---
title: "What the request records can tell you"
description: "Every request is written down before the gateway decides anything about it. That ordering is what makes the records useful, and it also explains what they cannot answer."
---

The gateway writes a record for every request it receives before it looks up the site or checks a single rule. That ordering looks like an implementation detail. It is the thing that makes the records worth having.

A log written after routing only contains requests that reached a site. The interesting ones are often the requests that did not: an IP probing for `admin.example.com` on a domain you never configured, a scanner walking hostnames from a certificate transparency list, a client sending an empty `Host`. None of those route anywhere. All of them are recorded.

## What is kept

| Field | Example |
| --- | --- |
| Created time | `2026-11-03T21:14:05+08:00` |
| Method | `GET` |
| Host | `app.example.com` |
| Path | `/login?next=%2F`, with the query string, up to 100 characters |
| Client IP | `203.0.113.7`, worked out from the forwarded headers when a trusted proxy is in front |
| User-Agent | up to 512 characters |

Each record is also printed to the program's standard output, so the same data reaches a log shipper if you run one.

## Questions the records answer

**Who is hitting this site.** The most common query, and the one that needs SQL rather than the list view:

```sql
SELECT client_ip, COUNT(*) AS n
FROM record
WHERE host = 'app.example.com'
  AND created_time >= '2026-11-02T21:00:00+08:00'
GROUP BY client_ip
ORDER BY n DESC
LIMIT 20;
```

`created_time` is text in RFC 3339 form, always UTC+8, so compare it with strings in the same shape.

**What is being probed.** Group by host over a day and the attempts show up on their own: hostnames you do not serve, paths like `/.env` and `/wp-login.php`, and the occasional request with no `Host` at all. Those are the inputs for an IP or path rule that finally has evidence behind it.

**Whether a change did anything.** A rule that blocks a scanner should make those records disappear. Comparing the counts before and after is the only honest way to know it worked.

## What they do not answer

The records are deliberately small, and the gaps are worth knowing before an incident:

- **No response status.** A record says a request arrived, not what came back. A page returning `500` and a page returning `200` look the same.
- **No rule or site identifier.** The `Host` tells you the domain, but not which rule blocked the request or which site row handled it.
- **No body.** Only the path, headers and address.

For the missing parts, three other places fill in:

- The **reason** shown to a blocked visitor carries the rule, and WAF blocks read `blocked by WAF rule: <id>`, which is the number in the rule definition.
- The **dashboard** aggregates by site and time, which is where a traffic shape becomes visible.
- Health **alerts** tell you the site stopped answering, which the records alone cannot, because a site that is down produces no records at all.

## Retention

A busy gateway writes hundreds of thousands of records a day, so the table is the part of the database that grows without asking. **Record retention days** in Settings deletes anything older than the number you set, once an hour, in small batches so the deletes do not lock the table.

`0`, the default, keeps everything. That is fine for a trial and wrong for a year, so set a number on the first day: thirty days covers almost every investigation and keeps the table at a size a single MySQL instance handles without thought.

If you need longer history, archive: a nightly `SELECT ... INTO OUTFILE` or a dump of the table into cold storage costs nothing and keeps the live table small.

One exemption worth remembering: requests whose User-Agent contains `Uptime-Kuma` are not recorded, so a monitor polling every few seconds does not fill the table. If your uptime tool is something else, its requests are in there with everything else.

The [request records](/en/docs/monitoring/records) page has the field list and the retention setting, and the [dashboard](/en/docs/monitoring/dashboard) is the aggregate view of the same data.