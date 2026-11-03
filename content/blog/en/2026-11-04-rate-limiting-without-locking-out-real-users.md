---
title: "Rate limiting that doesn't lock out real users"
description: "A rate limit is two numbers and a set of counting rules. Get the counting wrong and one office network or one page load takes the site down for everyone behind it."
---

Rate limiting looks like the simplest rule in a gateway: allow N requests per second, block for a while after that. The numbers are easy. What takes thought is what gets counted, and what happens to the people who share an address.

This post is about the second part, using CasWAF's `IP Rate Limiting` rule as the example. The same questions apply to `limit_req`, Cloudflare's rules and anything else that counts by address.

## The rule

Two numbers:

| Setting | Meaning | Default |
| --- | --- | --- |
| **Rate** | Requests per second one address may send on average; a burst of up to the same number is allowed at once | 100 |
| **Block Duration** | Seconds the address stays blocked after going over | 6000 |

When an address goes over, every request from it is refused for the duration, with status `403` unless the rule sets another code. `429 Too Many Requests` is the usual choice, because it tells a well-behaved client to slow down instead of retrying forever.

## What gets counted

Four details decide whether the rule behaves the way you expect.

**Counts are per rule.** A rule attached to several sites shares one allowance per address across all of them. That is usually wrong: you want each site to have its own budget, so give each site its own rule. A shared allowance means a busy page on one site can get a visitor blocked on another.

**Counts live in the gateway's memory.** A restart starts everyone from zero, and with several gateway nodes each one counts on its own. Neither is a bug: an in-memory counter is why the check is cheap. It does mean the effective limit with three nodes is three times what you configured for a client that happens to spread its requests across them.

**Only requests that reach the rule are counted.** A request let through by an earlier `Allow` rule, or stopped by an earlier rule, never reaches the counter. This is what makes the ordering trick below work.

**The address must be the real one.** Behind a load balancer or CDN, the connection comes from the proxy. If the gateway has not been told which proxies to trust, every visitor counts as the same address, and the first busy moment blocks the entire site for everyone. The [client IP](/en/blog/2026-11-04-real-client-ip-behind-a-proxy) post covers that part.

## Choosing numbers

Start higher than you think and lower it while watching the dashboard. A whole-site rule at 20 requests per second with a block of 600 seconds is a reasonable opening position; it stops floods and password guessing without touching normal reading.

Then account for the three cases that break naive limits:

- **Page weight.** A page that pulls sixty files at once is sixty requests from one address in a second. If static files go through the gateway too, the limit has to leave room for that burst, or every visitor trips it on the first load.
- **Shared networks.** A company, a school or a mobile carrier puts many people behind one address. Rate limiting per address punishes the whole building for one person's scraping. Put an `IP` rule that allows known networks before the rate limit rule, so their traffic is not counted at all.
- **Crawlers.** A legitimate crawler that respects `robots.txt` still sends a lot of requests. If its address is known, allow it explicitly rather than raising the global limit.

## Watching it work

Request records show each request with its status, so a rule that is too tight shows up as a column of `429`s from one address. The dashboard shows the top addresses over time, which is how a flood looks before it becomes an outage.

When a limit does trip, the record says why: the rule's reason string, or `Rate limit exceeded`. That is the line to search for when a user reports that the site "randomly" stopped working for them.

## The shape of a working setup

For most sites the sequence looks like this:

1. An `IP` rule that allows your own networks and the crawlers you want.
2. An `IP` rule that blocks the addresses you never want to see.
3. A `WAF` rule for the attacks that rules can describe.
4. An `IP Rate Limiting` rule last, as the catch-all for everything that gets through.

Rules are checked in order and the last one is the safety net. Putting the rate limit first turns it into the thing that decides everything, which is not what you want it to be.

The [rate limiting](/en/docs/rules/rate-limiting) page has the exact settings and counting behaviour, and [IP rules](/en/docs/rules/ip) covers the allow and block rules that go before it.