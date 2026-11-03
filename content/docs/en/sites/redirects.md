---
title: "Redirects"
description: "The redirects CasWAF does before forwarding a request: other domains to the main domain, www to the bare domain, HTTP to HTTPS, and adding a trailing slash."
---

CasWAF answers some requests with a `301` redirect before they reach the application. They run in this order, and each keeps the path and the query string.

## Other domains to the main domain

Turn on **Need redirect** and every request whose `Host` is not exactly the site's **Domain** is sent there: `example.net/pricing?a=1` becomes `app.example.com/pricing?a=1`. The scheme stays the same, so an HTTP request is redirected to the HTTP address and then, for an `HTTPS Only` site, to HTTPS.

Use it when you move a site to a new domain and keep the old one in **Other domains**, or to gather `example.com`, `example.net` and their `www.` forms on one address. Leave it off when the other domains should each serve the site under their own name.

## Adding a trailing slash

With **Need redirect** on, **Redirect with slash** also adds a `/` to the end of the path: `old.example.com/docs/intro?a=1` becomes `app.example.com/docs/intro/?a=1`. The root `/` and paths whose last part has a dot, such as `/sitemap.xml`, are left alone.

This saves a hop for sites such as Docusaurus that redirect `/docs/intro` to `/docs/intro/` themselves: an old link then reaches the final address in one redirect instead of two.

## www to the bare domain

A request for `www.<domain>` is always redirected to `<domain>`, whatever the site's settings. Set a site's domains without `www.`; the `www.` forms are matched and redirected for you. When **Need redirect** is on, `www.example.net` goes straight to the main domain in one hop.

## HTTP to HTTPS

A site in `HTTPS Only` mode redirects every plain HTTP request to the same address over HTTPS. ACME challenges and WeChat verification files are answered first, over plain HTTP; see [HTTPS](./https.md#http-only-paths).
