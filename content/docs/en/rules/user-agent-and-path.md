---
title: "User-Agent and URL path rules"
description: "Match requests by their User-Agent header or by their URL path, with exact, substring and regular expression comparisons."
---

`User-Agent` rules look at the `User-Agent` header, and `URL Path` rules at the path of the request, such as `/admin/login`, without the query string.

## Operators

Both types use the same operators. Comparisons are case-sensitive.

| Operator | Matches when the header or path |
| --- | --- |
| `equals` | is exactly the value |
| `does not equal` | is anything else |
| `contains` | contains the value |
| `does not contain` | does not contain the value |
| `match` | matches the value as a regular expression ([Go syntax](https://pkg.go.dev/regexp/syntax)), anywhere unless anchored with `^` and `$` |

A rule matches when any of its expressions matches, so one rule can list several crawlers or several paths.

## Examples

**Block bad crawlers.** Type `User-Agent`, operator `match`, value `(?i)(ahrefsbot|semrushbot|mj12bot)`, action `Block`.

**Turn away clients that send no User-Agent.** Type `User-Agent`, operator `equals`, empty value, action `Block`.

**Hide an admin area.** Type `URL Path`, operator `match`, value `^/(admin|wp-admin)(/|$)`, action `Block`, status code `404`. Put an `IP` allow rule for your own addresses before it to keep using it yourself.

**Block probes for files that should never be served.** Type `URL Path`, operator `match`, value `\.(env|git|bak|sql)$|/\.git/`, action `Block`.

To match on the query string or other headers, use a [WAF rule](./waf.md).
