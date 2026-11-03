---
title: "IP rules"
description: "Match requests by client IP address: lists of IPv4 and IPv6 addresses and CIDR ranges, and traffic from outside China."
---

An `IP` rule matches on the client's address, as CasWAF works it out; behind a load balancer or CDN, read [Client IP behind a proxy](../operations/client-ip.md) first.

## Expressions

| Operator | Value | Matches when |
| --- | --- | --- |
| `is in` | Addresses and CIDR ranges separated by commas, IPv4 and IPv6 mixed, such as `203.0.113.7,198.51.100.0/24,2001:db8::/32` | The client is one of them |
| `is not in` | The same kind of list | The client is none of them |
| `is abroad` | Nothing | The client is outside China |

Values are checked when you save, so a mistyped address is refused. The rule matches when any of its expressions matches.

## Traffic from abroad

`is abroad` looks the address up in the IPIP.net (17mon) database that ships with CasWAF, and matches when the country is not China. Private and local addresses never count as abroad, and neither do IPv6 addresses, which the database does not cover.

Block it for a site that only serves visitors in China, or attach it with action `CAPTCHA` to slow down crawlers from abroad without turning people away.

## Examples

**Block a few addresses.** Type `IP`, operator `is in`, value `203.0.113.7,198.51.100.0/24`, action `Block`.

**Allow only the office.** Type `IP`, operator `is not in`, value `203.0.113.0/24,2001:db8:1::/48`, action `Block`. Everyone outside those ranges is blocked.

To let the office skip all other rules of the site as well, put an `Allow` rule with `is in` and the same ranges first.

**Keep search engines in while blocking traffic from abroad.** Put an `Allow` rule for the search engines' published ranges, or a `User-Agent` allow rule, before the `is abroad` block rule.
