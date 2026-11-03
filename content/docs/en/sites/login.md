---
title: "Login protection"
description: "Put a Casdoor login in front of a site, so that only people who can sign in to a Casdoor application reach it, without changing the application."
---

A site can require its visitors to sign in through Casdoor before CasWAF forwards anything to it. The application behind the site needs no changes: it is useful for admin panels, internal tools and staging sites that have no login of their own.

## Set it up

1. In Casdoor, in the same organization as CasWAF's own application (`casdoorOrganization`), add an application for the site, or reuse one.
2. Add this redirect URL to that application, with the site's domain:

   ```text
   https://app.example.com/caswaf-handler
   ```

   Use `http://` instead for a site served over plain HTTP. CasWAF sends Casdoor the scheme the visitor came in on.

3. In CasWAF, open the site and choose the application under **Casdoor app**. The list holds the applications of CasWAF's organization. Save.

Who can get in is decided in Casdoor: the application's organization, whether it allows sign-up, and its sign-in methods (passwords, social logins, LDAP, SAML, MFA and so on).

## What a visitor sees

1. A request without the `casdoor_access_token` cookie is redirected to the application's Casdoor login page. The path they asked for is kept.
2. After they sign in, Casdoor sends them to `/caswaf-handler`, CasWAF exchanges the code for an access token, stores it in the `casdoor_access_token` cookie and redirects them to the page they first asked for.
3. On every later request CasWAF checks the token's signature with the application's certificate before going on to the site's rules. When the token has expired or does not verify, the visitor is sent to sign in again.

The application behind the site receives the cookie along with the request, so it can read the user from the token if it wants to.

## Limits

- The check only says the visitor has signed in to the application. There are no per-user or per-group rules in CasWAF; restrict access in Casdoor.
