---
title: "Rate limiting"
description: "Limit how many requests per second one IP address may send, and block an address that goes over the limit for a set time."
---

An `IP Rate Limiting` rule counts requests per client address. An address that goes over the limit is blocked for a while, which keeps floods, scrapers and password guessing off the site.

## Settings

A rate limiting rule has one expression with two numbers:

| Field | Meaning | Default |
| --- | --- | --- |
| **Rate** | Requests per second one address may send on average. Short bursts of up to the same number of requests at once are allowed. | `100` |
| **Block Duration** | Seconds an address stays blocked after going over | `6000` |

While an address is blocked, every request from it is refused with the rule's **Reason**, or `Rate limit exceeded` when the rule has none, status `403` unless the rule's **Status code** says otherwise; `429 Too Many Requests` is the usual choice. When the time is up, the address starts with a full allowance again.

## How it counts

- The count is per rule. A rule attached to several sites shares one allowance per address across all of them; give each site its own rule to count them apart.
- The count is kept in the memory of each gateway process. It starts over when CasWAF restarts, and with several [nodes](../operations/nodes.md) each one counts on its own.
- Only requests that reach this rule are counted. Requests let through by an earlier `Allow` rule, or stopped by an earlier rule, are not.

## Choosing numbers

- For a whole site, start high, such as `20` per second and a block of `600` seconds, and lower it while watching the [dashboard](../monitoring/dashboard.md).
- A page load can fetch dozens of files at once. If the site's static files go through CasWAF too, leave room for that burst.
- Visitors behind one company or school network share one address. Allow known networks with an `IP` rule before the rate limit.
- Make sure CasWAF sees the real client address when it sits behind a load balancer or CDN; otherwise every visitor counts as the same one. See [Client IP behind a proxy](../operations/client-ip.md).
