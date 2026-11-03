---
title: "Request records"
description: "CasWAF records every request the gateway receives in the database: what is kept, how to look at it, and how long it is kept."
---

The gateway writes a record for every request it receives, in the `record` table, before it looks for the site or checks any rule. The **Records** page lists them, newest first, and the [dashboard](./dashboard.md) adds them up.

## What is recorded

| Field | Example |
| --- | --- |
| **Created time** | `2026-11-03T21:14:05+08:00` |
| **Method** | `GET` |
| **Host** | `app.example.com` |
| **Path** | `/login?next=%2F`, the path with the query string, up to 100 characters |
| **Client IP** | `203.0.113.7`, worked out as in [Client IP behind a proxy](../operations/client-ip.md) |
| **User-Agent** | Up to 512 characters |

Requests for domains no site has are recorded too, which shows who is probing the gateway. Requests whose User-Agent contains `Uptime-Kuma` are left out, so a monitor that polls every few seconds does not fill the table. Each record is also printed to the program's standard output.

The record does not say which site or rule handled the request, or what the response was; see the [roadmap](../more/roadmap.md).

## How long records are kept

Open **Settings** and set **Record retention days**. Once an hour, CasWAF deletes the records older than that, in small batches so the database is not locked for long. `0`, the default, keeps everything.

A busy gateway writes hundreds of thousands of records a day, so set a retention period, or archive the table yourself, before it grows large.

## Looking at records

The list on the **Records** page can be sorted by column. For larger questions, query the table directly; for example, the busiest client addresses of a site since a given time, in MySQL:

```sql
SELECT client_ip, COUNT(*) AS n
FROM record
WHERE host = 'app.example.com'
  AND created_time >= '2026-11-02T21:00:00+08:00'
GROUP BY client_ip
ORDER BY n DESC
LIMIT 20;
```

`created_time` is stored as text in RFC 3339 form, always in UTC+8, so compare it with strings in the same form.
