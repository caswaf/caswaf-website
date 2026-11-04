---
title: "CAPTCHA without turning people away"
description: "Blocking suspicious traffic is a decision made once, by a rule. Challenging it moves the decision to the visitor. Where that trade is worth it, and the two places it is not."
---

A firewall has two answers to traffic it does not trust: block it, or make it prove it is human. Blocking is fast, cheap and unambiguous, and when the rule is right nobody misses the blocked requests. When the rule is wrong, a real person sees a `403` and leaves.

A challenge moves that decision to the visitor. Instead of deciding for them, the gateway asks them to solve a CAPTCHA once, and lets them through if they do. The cost is one interruption; the benefit is that a wrong guess does not cost a customer.

CasWAF has both, and the interesting part is when to use which.

## How the challenge works

A rule whose action is `CAPTCHA` does not block. A request that matches it is redirected to the CAPTCHA page of the Casdoor deployment, and the visitor solves it there. After that:

1. They are sent to `/caswaf-captcha-verify` on the site, where CasWAF checks the result with Casdoor.
2. On success it sets a `casdoor_captcha_token` cookie and redirects them to the page they first asked for.
3. For the next thirty minutes, their requests pass the rule without being challenged again.

The CAPTCHA itself is whatever the Casdoor application has configured: Casdoor's built-in one, reCAPTCHA, hCaptcha, Cloudflare Turnstile or another provider. CasWAF never renders the challenge; it delegates the whole question to Casdoor.

## Where the trade is worth it

The rule type matters, because not every rule can use the action: `WAF` and `IP Rate Limiting` cannot, and neither should they. A SQL injection attempt is not a visitor having a bad day; it is an attack, and it gets blocked.

The rules that suit a challenge are the ones that describe suspicion rather than certainty:

- **Traffic from abroad**, when the site only serves one country. Most of it is fine, and the part that is not is often automated.
- **Odd User-Agents**, empty ones, or ones that claim to be a browser from ten years ago.
- **A path that should not see much traffic**, such as a login form that suddenly gets thousands of requests.

In all three cases the rule is a heuristic, and a heuristic that blocks real people is expensive.

## Where it is the wrong tool

**APIs.** The redirect to a CAPTCHA page only makes sense for something that renders HTML. A script calling an API gets a redirect it cannot follow, and the call fails in a way that looks like a bug. If an endpoint serves machines, put a fixed rate limit on it instead.

**Search engine crawlers.** A crawler cannot solve a CAPTCHA, and it will not index a page it is redirected away from. If a `CAPTCHA` rule matches Googlebot, the site disappears from search. The order matters: an `IP` or User-Agent rule that allows the crawlers you want comes before the challenge rule, and that rule's `Allow` means the request never reaches the challenge.

**Anything a monitor checks.** The same reasoning as the crawler: a health check that gets a CAPTCHA page reports the site as broken.

## The ordering that works

The shape is the same as for rate limits: allow first, challenge second, block last.

1. An `IP` or User-Agent rule that allows your own networks and the crawlers you want.
2. A `CAPTCHA` rule for the traffic you are unsure about.
3. A `WAF` rule for the attacks a rule can describe.
4. An `IP Rate Limiting` rule as the catch-all.

A request that matches the allow rule never reaches the challenge. A request that reaches the challenge has already been judged not to be a known good client, and a real visitor among them pays one click instead of being turned away.

## The multi-node caveat

Passed challenges are remembered in the memory of the gateway that checked them, not in the database. After a restart, or on another node behind the load balancer, the visitor is challenged again. For a site on one machine this is invisible. For a site on several, sticky sessions at the load balancer are the difference between one challenge and five.

The [CAPTCHA](/en/docs/rules/captcha) page has the setup steps, and [rules](/en/docs/rules/rules) covers the order rules are checked in.