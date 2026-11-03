---
title: "Putting a company login in front of an internal tool"
description: "A reverse proxy can ask for a Casdoor login before a request reaches an application, so admin panels and internal tools get MFA, LDAP and social logins without a line of new code."
---

Most internal tools have one of two problems. Either they have no login at all, because they were written to run on a laptop or behind a VPN, or they have their own accounts with their own passwords that nobody rotates and everyone shares.

Both are fixable at the proxy. If a gateway can ask for a login before it forwards a request, the application never sees an unauthenticated visitor, and the identity system behind that login is the one you already run for everything else.

CasWAF does this through Casdoor. This post covers the flow, the three settings involved, and the places where it does not fit.

## The flow

1. A visitor asks for a page on a site that has login protection on. They have no `casdoor_access_token` cookie, so CasWAF sends them to the Casdoor application's login page, remembering the path they asked for.
2. They sign in. Casdoor sends them back to `/caswaf-handler` on the site's domain. CasWAF exchanges the code for an access token, puts it in the cookie, and redirects to the original path.
3. On every later request CasWAF checks the token's signature against the application's certificate before the site's rules run. An expired or invalid token means a trip back to the login page.

The application changes in no way. It receives a request that already passed the check, with the cookie attached.

## Setting it up

The whole configuration is three things:

1. **A Casdoor application** for the site, in the same organization as CasWAF's own application. It can be a new one or a shared one.
2. **A redirect URL** on that application, using the site's domain:

   ```text
   https://app.example.com/caswaf-handler
   ```

   Use `http://` for a site served over plain HTTP; CasWAF sends Casdoor the scheme the visitor came in on.

3. **The application selected on the site** in CasWAF, under Casdoor app.

That is it. Who can get in is decided in Casdoor: the application's organization, whether it allows sign-up, and the sign-in methods it has. If your company already uses Casdoor with LDAP behind it, or with Azure AD, Okta or GitHub as the only provider, the internal tool inherits all of it, including MFA.

## What the application sees

The request arrives with the `casdoor_access_token` cookie. An application that wants to know who the user is can read the token and verify it with the same certificate Casdoor publishes; an application that does not care can ignore it.

CasWAF also sets `X-Real-Ip`, so the application sees the visitor's address rather than the gateway's, and `X-Forwarded-Proto`, so it knows whether the visitor connected over HTTPS.

## Where it does not fit

- **The whole site is behind the login.** A site that also exposes a webhook, a health check or an API for other services needs those on a separate site or hostname without login protection.
- **There are no per-user rules in CasWAF.** The check says the visitor signed in to the application, nothing more. Restricting by group or by user belongs in Casdoor.
- **API clients need a different answer.** A script that calls the site with a token in a header is not a browser with a cookie; put those endpoints on another site and protect them another way.
- **Sessions live in Casdoor.** Changing a user's access, disabling an account or shortening the token lifetime all happen there, and the next request follows the new rules.

## Why do it at the proxy

The alternative is to add authentication to each application, which means a library in each stack, a session store in each service, and a different definition of "logged in" every time. At the proxy there is one implementation, one place to look when a login breaks, and one audit trail: every request that reaches the application was preceded by a sign-in recorded in Casdoor.

CasWAF's [login protection](/en/docs/sites/login) page has the exact settings and the cookie details. If you do not run Casdoor yet, its [documentation](https://casdoor.ai/docs/overview) covers the server installation and the application setup.