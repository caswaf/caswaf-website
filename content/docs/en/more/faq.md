---
title: "FAQ"
description: "Common questions about CasWAF: replacing Nginx, WebSockets, HTTP/2, databases, Casdoor, operating systems, logs and errors."
---

## Can CasWAF replace Nginx?

For reverse proxying many sites with HTTPS, redirects and access rules, yes: that is what it is used for. It also serves a folder of static files. It does not cache, compress, rewrite URLs or proxy TCP streams; keep Nginx behind CasWAF on another port for an application that needs those.

## Does it support WebSockets and HTTP/2?

Yes. WebSocket upgrades are passed through to the application, and HTTPS connections use HTTP/2 when the client supports it. The connection to the application is HTTP/1.1.

## Do I need Casdoor?

Yes, the console signs in only through Casdoor. Casdoor is open source and quick to run; it can even be one of the sites behind CasWAF. Only the administrators of CasWAF's organization in Casdoor can manage CasWAF; see [Sign in with Casdoor](../getting-started/casdoor.md).

## Which databases does it run on?

MySQL is what CasWAF is developed and run on. The database layer, XORM, also has drivers for PostgreSQL, SQL Server and SQLite built in, but the [dashboard](../monitoring/dashboard.md) needs MySQL.

## Which operating systems?

The gateway and console run wherever Go runs. Starting with the machine and [self-update](../operations/upgrading.md#self-update) need Windows, or Linux with systemd.

## Where are the logs?

CasWAF prints to standard output: each request, rule errors, certificate attempts and self-update steps. Under systemd, read them with `journalctl -u caswaf-site-caswaf`. Requests also go to the [record table](../monitoring/records.md).

## What do these errors mean?

| Response | Cause |
| --- | --- |
| `CasWAF error: site not found for host` | No site has this domain, or the domain is in no site's **Other domains** |
| `400` with an empty body | The request was made to an IP address instead of a domain |
| `503` with a "stopped" page | The site's status is `Stopped` |
| `Blocked by CasWAF: ...` | A rule blocked the request; the text after the colon is the reason |
| TLS handshake error | No certificate matches the domain; see [HTTPS](../sites/https.md#which-certificate-is-used) |
| `rule not found` | The site lists a rule that has been deleted; remove it from the site |

## Why did my Nginx stop when CasWAF started?

CasWAF stops whatever listens on its ports when it starts. Move the other server to another port first; see the [Quick start](../getting-started/quickstart.md).
