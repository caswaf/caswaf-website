---
title: "Running ModSecurity rules without Nginx"
description: "ModSecurity usually arrives as an Nginx module. CasWAF runs the same SecLang rules on Coraza, inside the gateway, with no Nginx underneath. What carries over, what does not, and how to move a ruleset."
---

ModSecurity is usually described as an Nginx or Apache module. That is how most people meet it: `libmodsecurity` loaded by a web server through a connector, with a rule set in front of an application.

The rules are not tied to Nginx. They are written in SecLang, a small language of `SecRule` directives, variables, operators and transformations, and any engine that implements the language can run them. [Coraza](https://coraza.io) is one such engine, written in Go. CasWAF runs it inside the gateway process, so a site can have ModSecurity rules with no Nginx and no connector underneath.

This post is about what carries over when you move a ruleset there, and the parts that surprise people.

## Where the rules run

In CasWAF a firewall rule is one of the rule types a site can have. Set its type to `WAF` and the expression holds SecRule lines, exactly as they would appear in a ModSecurity configuration:

```text
SecRule ARGS "@detectSQLi" "id:1001,phase:2,deny,msg:'SQL injection'"
SecRule ARGS "@detectXSS" "id:1002,phase:2,deny,msg:'XSS'"
```

Coraza runs in detection mode; CasWAF decides what to do with what it reports. The disruptive action in the rule becomes the action CasWAF takes:

| SecLang action | What CasWAF does |
| --- | --- |
| `deny`, `block` | Blocks the request, status `403` by default |
| `drop` | Refuses the connection with `Dropped by CasWAF` |
| `allow` | Forwards the request and skips the site's later rules |
| `pass` and the rest | No effect |

Two details differ from a stock ModSecurity setup. The `status:` action is ignored; the status code comes from the rule in the console instead. And IDs `200000` to `200099` belong to the base configuration CasWAF ships, so keep your own rules out of that range.

## Moving a ruleset

A ruleset you wrote for Nginx is usually a file of SecRule lines. Moving it means pasting those lines into the rule's expression in the console, in the order you want them checked.

What the rules can see is the same set of variables ModSecurity exposes: `REQUEST_URI`, `QUERY_STRING`, `ARGS`, `ARGS_GET`, `ARGS_POST`, `REQUEST_HEADERS`, `REQUEST_COOKIES`, and the request body up to 12.5 MB. JSON and XML bodies are parsed by content type, so their fields show up in `ARGS` as well. The body is passed on to the application unchanged.

A few rules that are worth starting with, if your old configuration has them somewhere:

```text
# Known scanners, by User-Agent, ignoring case
SecRule REQUEST_HEADERS:User-Agent "@pm sqlmap nikto nmap masscan" "id:1003,phase:1,t:lowercase,deny"

# Path traversal in the query string
SecRule QUERY_STRING "@contains ../" "id:1004,phase:1,deny"

# Requests with no Host header
SecRule &REQUEST_HEADERS:Host "@eq 0" "id:1005,phase:1,deny"
```

## The Core Rule Set question

The OWASP Core Rule Set is the part of ModSecurity people actually rely on. It is also large: thousands of rules with includes, anomaly scoring, paranoia levels and a chain of `SecMarker` bookkeeping. CasWAF builds the rule set again for each request that reaches the rule, which is fine for a handful of rules and not a good fit for the full set.

So CasWAF does not bundle the CRS, and running all of it this way is not something the maintainers recommend. The practical path is to pick the rules that match the traffic you actually see: scanner signatures, path traversal, a few `@detectSQLi` and `@detectXSS` rules, and rules for the parts of your application that take dangerous input. That covers a surprising amount of real traffic, and each rule is one you can explain.

If you need the full CRS, put an engine that is built for it in front of the application and let CasWAF handle sites, certificates, redirects and login protection. The two are not in conflict; CasWAF can sit behind or in front of Nginx.

## What to check before you rely on it

- **Directives.** Coraza implements SecLang, not every directive ModSecurity has ever shipped. Run a rule set through a test request before turning it on for real traffic.
- **Rule order.** Rules are checked in the order of the site's rules; `allow` stops the rest. If a rule is meant to run early, put it early.
- **Body size.** Bodies over 12.5 MB are not inspected, and the base configuration's own rule set does not decide the request either way.
- **Logs.** Every blocked request is recorded with `blocked by WAF rule: <id>`, which is the number you put in the rule. Use it when you are tuning.

The [Coraza SecLang reference](https://coraza.io/docs/seclang/) lists every variable, operator and transformation it supports. In CasWAF, the [WAF rules](/en/docs/rules/waf) page covers the integration itself, and [CasWAF vs ModSecurity](/en/compare/modsecurity) compares the two setups side by side.