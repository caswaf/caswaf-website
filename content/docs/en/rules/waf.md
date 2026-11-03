---
title: "WAF rules"
description: "Write ModSecurity SecLang rules for CasWAF, run by the Coraza engine: what they can see, which actions count, and examples for SQL injection, XSS and scanners."
---

A `WAF` rule holds rules in ModSecurity's SecLang language, the same language as ModSecurity and the OWASP Core Rule Set, run by [Coraza](https://coraza.io), a WAF engine written in Go. Use them for what the simpler rule types cannot express: the query string, cookies, any header, and Coraza's SQL injection and XSS detectors.

## Writing one

1. Add a rule and set **Type** to `WAF`. There is no **Action** to choose; it comes from the SecLang rules.
2. Write one or more `SecRule` directives in the expressions. The expressions are joined as written, so keep the whole set in one expression, or end each one with a line break.
3. Save. CasWAF checks the syntax and refuses a rule set it cannot parse.

Each `SecRule` needs its own `id` and a `phase` of `1` (headers) or `2`. IDs 200000 to 200006 are taken by the base configuration built into CasWAF, `conf/waf.conf`.

## Which actions count

Coraza runs in detection mode and CasWAF decides what to do with what it reports. When a rule matches, its disruptive action becomes CasWAF's action:

| SecLang action | CasWAF action | Default status |
| --- | --- | --- |
| `deny`, `block` | Block | `403` |
| `drop` | Drop: refused with `Dropped by CasWAF` | `400` |
| `allow` | Allow: forwarded, the site's later rules skipped | |
| `pass` and the rest | No effect | |

The reason shown is `blocked by WAF rule: <id>`. The SecLang `status:` action is not used; set the rule's **Status code** instead.

## What the rules see

The request line and the headers: the method, the path, the query string and its arguments (`ARGS`, `ARGS_GET`, `REQUEST_URI`, `QUERY_STRING`), `REQUEST_HEADERS` and `REQUEST_COOKIES`. The request body is not passed to Coraza yet, so `ARGS_POST` and `REQUEST_BODY` are empty; see the [roadmap](../more/roadmap.md).

CasWAF builds the rule set again for each request that reaches the rule, which takes well under a millisecond for a handful of rules. Keep WAF rules short and specific: the full OWASP Core Rule Set is not bundled and is too large to run this way.

## Examples

SQL injection in any query argument, with Coraza's libinjection detector:

```text
SecRule ARGS "@detectSQLi" "id:1001,phase:2,deny,msg:'SQL injection'"
```

Cross-site scripting in any query argument:

```text
SecRule ARGS "@detectXSS" "id:1002,phase:2,deny,msg:'XSS'"
```

Known scanners, by User-Agent, ignoring case:

```text
SecRule REQUEST_HEADERS:User-Agent "@pm sqlmap nikto nmap masscan" "id:1003,phase:1,t:lowercase,deny"
```

Path traversal in the query string:

```text
SecRule QUERY_STRING "@contains ../" "id:1004,phase:1,deny"
```

Requests with no `Host` header:

```text
SecRule &REQUEST_HEADERS:Host "@eq 0" "id:1005,phase:1,deny"
```

The [Coraza SecLang reference](https://coraza.io/docs/seclang/) lists every variable, operator and transformation.
