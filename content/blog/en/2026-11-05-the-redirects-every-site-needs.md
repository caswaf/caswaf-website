---
title: "The redirects every site needs, and the order they run in"
description: "www to the bare domain, the old domain to the new one, HTTP to HTTPS, and the trailing slash. Four redirects, one order, and a few paths where each of them does more harm than good."
---

Almost every site collects the same four canonical redirects over its life. They are boring, they are easy to get wrong, and when they are wrong the symptom is subtle: a cookie set on the wrong host, a mixed-content warning, or two URLs competing in search results.

A proxy is the right place to fix all four, because it sees the request before the application does and can answer with a `301` without waking it up.

## The four

In CasWAF they run in this order, and each keeps the path and the query string.

**Other domains to the main domain.** Turn on **Need redirect** and every request whose `Host` is not exactly the site's domain is sent to the main one. `example.net/pricing?a=1` becomes `app.example.com/pricing?a=1`. Use it when a site moves and the old domain stays around, or to gather `example.com`, `example.net` and their `www` forms on one address.

**The trailing slash.** With **Redirect with slash** on, a `/` is added to the end of the path: `old.example.com/docs/intro?a=1` becomes `app.example.com/docs/intro/?a=1`. The root `/` and paths whose last part contains a dot, such as `/sitemap.xml`, are left alone. This exists for sites that redirect `/docs/intro` to `/docs/intro/` themselves, like Docusaurus; an old link then reaches its final address in one hop instead of two.

**www to the bare domain.** `www.<domain>` always redirects to `<domain>`, whatever else the site is set to. Set the site's domains without `www` and the `www` forms are matched and redirected for you.

**HTTP to HTTPS.** A site in `HTTPS Only` mode redirects every plain HTTP request to the same address over HTTPS. ACME challenges and WeChat verification files are answered first, over plain HTTP, because a certificate you do not have yet cannot be used to serve the challenge that issues it.

## Why the order matters

The order is what keeps a redirect from costing two round trips. An HTTP request for `www.old.example.net/docs/intro` on a site whose main domain is `app.example.com` gets to the final address in one response: the main-domain redirect decides the host, and the scheme follows from the site's mode.

If the redirects ran in the other order, the same request would first be bounced from HTTP to HTTPS on a host that redirects elsewhere, and the browser would make a second request it did not need. One extra hop per request is not a disaster, but it is free to avoid.

## What keeps the path

Every one of them preserves the path and query string, which is what makes them safe for bookmarks and for search engines. A redirect that drops the query string turns a link to `/pricing?plan=pro` into a link to the pricing page, and the visitor has to find the plan again.

## Where not to point them

- **Do not put an API on a site with `Need redirect` on** if clients call it by a domain in **Other domains**. The client gets a redirect it may not follow.
- **Do not redirect a health check path** to another host, or the check fails on a redirect it does not expect.
- **Do not use a site redirect for application routes.** A redirect from `/old-page` to `/new-page` belongs in the application, where the routing table lives and where the redirect can change with the content.

## Testing

Redirects are easy to verify with a header dump:

```bash
curl -sI -H "Host: www.example.com" http://127.0.0.1/pricing?plan=pro
```

Look for the `301` and the `Location` header, and check that the path and query survived. Repeat for the four cases: `www`, the old domain, plain HTTP, and a path without a trailing slash.

The [redirects](/en/docs/sites/redirects) page documents the exact behaviour, and [sites](/en/docs/sites/sites) covers the fields themselves.