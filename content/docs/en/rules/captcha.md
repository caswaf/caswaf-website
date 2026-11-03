---
title: "CAPTCHA"
description: "Send visitors that match a rule through a Casdoor CAPTCHA instead of blocking them, and let them in for 30 minutes once they pass."
---

Any rule except `WAF` and `IP Rate Limiting` can use the action `CAPTCHA`. A visitor who matches is sent to a CAPTCHA page served by Casdoor; once they pass, they come back to the site's home page and are let through for 30 minutes. It suits traffic you are unsure about, such as visitors from abroad or clients with an odd User-Agent, where blocking would turn real people away.

## Set it up

1. In Casdoor, add a CAPTCHA provider (Casdoor's built-in one, reCAPTCHA, hCaptcha, Cloudflare Turnstile and others) and add it to the providers of CasWAF's own application, the one in `casdoorApplication`.
2. In CasWAF, set a rule's **Action** to `CAPTCHA` and attach the rule to a site.

## What a visitor sees

1. A request that matches the rule is redirected to `<casdoorEndpoint>/captcha`.
2. After solving it, the visitor is sent to `/caswaf-captcha-verify` on the site, where CasWAF checks the result with Casdoor.
3. On success CasWAF sets the `casdoor_captcha_token` cookie and redirects the visitor to the site's home page, not the page they first asked for. Requests that match the rule pass while the cookie is valid, for 30 minutes.

## Limits

- Passed CAPTCHAs are remembered in the memory of the gateway that checked them. After a restart, or on another [node](../operations/nodes.md), the visitor solves it again.
- A request that passes this way gets a `200` from CasWAF before the site's own response, so a redirect or error from the site does not reach the visitor with its own status.
- The redirect to the CAPTCHA works for page loads. API calls and other requests made by scripts cannot follow it, so do not put a `CAPTCHA` rule in front of an API.
