---
title: "Rules"
description: "How CasWAF rules work: the rule types, attaching rules to sites, the order they are checked in, the actions, status codes and the reason shown to blocked visitors."
---

Rules decide what happens to a request before it is forwarded. A rule is defined once in the rule list and can be attached to any number of sites.

## Rule types

| Type | Matches on | Page |
| --- | --- | --- |
| `IP` | The client address, a list of addresses and ranges, or traffic from abroad | [IP rules](./ip.md) |
| `User-Agent` | The `User-Agent` header | [User-Agent and URL path](./user-agent-and-path.md) |
| `URL Path` | The path, without the query string | [User-Agent and URL path](./user-agent-and-path.md) |
| `IP Rate Limiting` | Requests per second from one address | [Rate limiting](./rate-limiting.md) |
| `WAF` | ModSecurity SecLang rules, run by Coraza | [WAF rules](./waf.md) |

A rule holds one or more **Expressions**. For `IP`, `User-Agent` and `URL Path`, the rule matches when any of its expressions matches; to require several conditions at once, see the note on compound rules below.

## Actions

| Action | What happens | Default status |
| --- | --- | --- |
| `Block` | CasWAF answers itself with `Blocked by CasWAF: <reason>` | `403` |
| `Allow` | The request is forwarded, and the site's remaining rules are skipped | `200` |
| `CAPTCHA` | The visitor is sent through a CAPTCHA first; see [CAPTCHA](./captcha.md) | `302` |

**Status code** replaces the default status, for instance `429` for a block, or `404` to hide that anything is there. `IP Rate Limiting` rules always block, and `WAF` rules take their action from the SecLang rule that matched.

## The reason

For a block, the visitor reads a reason:

- **Reason** of the rule, when set, such as `Your request is blocked.`
- otherwise `hit rule <owner>/<name>: <what matched>`.

With **Verbose mode** on, the reason also names the rule and the expression that matched, which helps while writing rules. To keep all of that from visitors on one site, turn on **Disable verbose** on the site: its blocked visitors then read only "the rule has been hit".

## Attaching rules to a site

Open the site and pick the rules under **Rules**. They are checked in the order listed, after the redirects and [login protection](../sites/login.md), and the first rule that matches decides. When none matches, the request is forwarded.

Order them from the most specific to the most general. A common setup:

1. An `IP` rule with action `Allow` for your office and monitoring addresses, so nothing after it can lock them out.
2. A `User-Agent` rule that blocks known bad crawlers.
3. An `IP Rate Limiting` rule.
4. `WAF` rules.

Changes to rules and to a site's list take effect within a few seconds. Add and save a rule before attaching it, and detach it from every site before deleting it: a site that lists a rule which does not exist answers every request with an error.

## Compound rules

The rule editor also offers a `Compound` type, meant to combine other rules with `and` and `or`. It is being reworked: today a compound rule counts every request as a match, so its action applies to all traffic. Do not attach one to a site yet; see the [roadmap](../more/roadmap.md).
