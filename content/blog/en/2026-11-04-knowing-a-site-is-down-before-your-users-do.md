---
title: "Knowing a site is down before your users do"
description: "A health check that runs inside the same network answers a different question than one that comes from outside. What CasWAF checks, when it sends an alert, and the parts it deliberately leaves out."
---

There are two kinds of "is the site up" checks, and they disagree more often than people expect.

The one inside the application is a health endpoint: it says the process is running, the database answers and the worker is alive. It is the right check for an orchestrator deciding whether to restart a container. It says nothing about whether a visitor can reach the site, because it never leaves the network.

The one outside is a request to the real domain over HTTPS, following the same path a visitor takes: DNS, the gateway, the certificate, the redirects, the application. That is the check CasWAF runs, and it catches the failures the health endpoint cannot see, like a DNS record pointing at the wrong machine, an expired certificate, or a redirect loop.

## What a check is

- The site's main domain, requested at a fixed interval.
- Over HTTPS for `HTTPS Only` sites, over HTTP for `HTTP` sites, and both for `HTTPS and HTTP`, where either answering is enough.
- A check passes when the response, after following redirects, is a `2xx` within five seconds.
- Three failures in a row by default, at sixty-second intervals, before anything is sent.

The "after following redirects" part matters. A site that redirects `www` to the apex, then to HTTPS, then to a trailing slash, is fine as long as the last hop answers. A check that stopped at the first `301` would call every correctly configured site down.

## Where the alert goes

Through Casdoor, to the person who created the site: an email provider sends to their address, an SMS provider to their phone. There is no separate alerting service to configure and no webhook to write, which also means there is no way to alert a channel rather than a person.

One alert goes out per outage, with the domain and the error. When the site comes back, nothing is sent. That is a deliberate trade: a recovery message is nice to have, but it doubles the messages for every flapping site, and the first thing people do with noisy alerts is turn them off.

## What it does not do

- **Inactive and stopped sites are skipped.** A site you took down on purpose should not page you.
- **`Static Folder` sites are checked like `HTTPS and HTTP` ones**, because they have no upstream to distinguish.
- **Every node checks on its own.** With three gateways you get three emails per outage, because the alert settings are shared but the checks are not. A mailbox rule that collapses them is the simplest answer.
- **It is not a synthetic monitor.** It does one request to the domain. It does not log in, click through a checkout or validate content.

## Choosing the numbers

The defaults are a minute between checks and three failures, so a real outage is detected within about three minutes. The trade is false positives: a single slow response during a deploy is one failure, and three in a row is a pattern.

For a site with a maintenance window, raise the failure count rather than the interval. A slower check delays detection; a higher count only delays the alert, which is what you want during a deploy.

## The gap this leaves

The check only proves the site answered. It does not know that the answer was the right one: a 200 page showing a database error passes. That is what the request records are for: after an alert, the records show what visitors were actually getting, with status codes and the addresses that asked.

Between the two, you get the shape of an incident: whether it was the network, the certificate, the application, or one visitor hammering a page that was never meant to be public.

The [health alerts](/en/docs/sites/alerts) page has the settings and the exact check behaviour, and [request records](/en/docs/monitoring/records) covers what is kept for each request.