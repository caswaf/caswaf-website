---
title: "When a rule blocks the wrong person"
description: "Every firewall eventually blocks a real customer. The difference between ten minutes and a bad afternoon is knowing which rule fired, and fixing it in the right place."
---

Sooner or later someone writes in: the site says access denied, and it works for everyone else. It is almost always a rule, and it is almost never the rule you would guess.

The good news is that the gateway tells you which rule fired, if you know where to look.

## Start with what the visitor saw

A blocked visitor sees the rule's response, and the response carries the rule's reason. For a rate limit that is the rule's reason string, or `Rate limit exceeded`; for a WAF rule it is `blocked by WAF rule: <id>`, with the number you gave the rule.

Ask for a screenshot. A `403` with no body could be the gateway, the application or a CDN; the reason string narrows it in one step. If the visitor sees a CAPTCHA page instead of an error, the rule that fired has the `CAPTCHA` action, and the question is why it matched them.

## Reproduce it

A rule that matched once will match again, but only with the same inputs. Reproduce with the same method, path, headers and User-Agent:

```bash
curl -sI -H "Host: app.example.com" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" \
  "http://127.0.0.1/some/path?q=1"
```

The two headers that catch people out are `Host`, because that is how the site is chosen, and `User-Agent`, because a rule that matches a version string will match exactly that version string.

IP-based rules are the exception: you cannot reproduce those from your own machine unless you are on the same address. For those, check the request records for the visitor's address and look at which IP rule would match it.

## Find the rule

The type of rule tells you where to look:

- **Rate limit** — the visitor's address went over the allowance. Often a page that suddenly pulls a hundred assets, or many people behind one office network.
- **User-Agent or path** — a browser string or a URL that the rule was not written for. `equals` compares the whole header, so the same browser with one extra token stops matching; `contains` matches anywhere, so a rule written for `curl` also catches a legitimate client that happens to mention it. Path rules are just as easy to widen by accident: a `contains /admin` rule also matches `/administrator-help`.
- **IP rule** — an address on the wrong side of an allow or block list, or a visitor whose traffic comes through a proxy you listed as untrusted.
- **WAF rule** — the request contained something that looked like an attack: a form field with a `<` in it, a code sample containing `select ... from`, a file name with `../`.
- **CAPTCHA rule** — the visitor matched a heuristic, often a User-Agent or an unusual request pattern, and was challenged instead of blocked.

## Fix it in the right place

The order below goes from least to most disruptive. Resist starting at the bottom.

1. **Add an `Allow` rule before the rule that fired.** Rules are checked in order and an allow stops the rest, so this fixes one case without changing the rule for everyone else. It is the right answer for a customer with an odd User-Agent, an office with a shared address, or a partner whose traffic you can identify.
2. **Narrow the rule.** If a path rule says `/admin` and the complaint is about `/administrator-help`, the rule is describing the path too loosely. A more specific match keeps the protection and removes the false positive.
3. **Change the action from block to CAPTCHA.** Where the rule is a heuristic rather than a certainty, a challenge is the honest answer; the visitor proves they are human and continues, and the bots stay out.
4. **Raise a limit.** Rate limits are guesses; if a legitimate client trips one, the guess was low. Raise it, or move the site's static assets out of the counted path.
5. **Turn the rule off.** Sometimes it is right, but it is the only option that removes the protection from everyone, so it should be a decision with a note, not a reflex.

## The rule that prevents the whole conversation

Put an allow rule for your own networks and the clients you know at the top of every site's rule list. It is one rule, it costs nothing, and it means that when a rule you wrote turns out to be too broad, the person debugging it can still reach the site.

That single line is the difference between a five-minute fix and an afternoon spent wondering why the admin page stopped loading after a deployment.

The [rules](/en/docs/rules/rules) page explains the order and the actions, and [request records](/en/docs/monitoring/records) is where the visitor's address and headers are, when the reason string is not enough.