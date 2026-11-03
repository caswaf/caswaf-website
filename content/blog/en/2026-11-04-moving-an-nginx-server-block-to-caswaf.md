---
title: "Moving an Nginx server block to CasWAF"
description: "A server block is a list of decisions: name, upstream, certificate, redirects, limits. Here is what each part turns into in CasWAF, what has no equivalent, and how to cut over without a window of downtime."
---

Most Nginx configurations in front of an application are the same shape: one `server` block per hostname, a `proxy_pass` to the application, a certificate, a redirect from `www`, maybe a rate limit and an access rule. Moving that to a console is less about syntax and more about knowing which line becomes which setting.

This post goes through a typical block and maps it. Nothing here is magic: if a line has no equivalent, it says so.

## A typical block

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        auth_request /auth;
    }

    limit_req zone=one burst=20;
}
```

And the same site in CasWAF:

| Nginx | CasWAF |
| --- | --- |
| `server_name` | The site's **Domain**, plus **Other domains** for the rest |
| `listen 443 ssl` | The site's SSL mode; a site in `HTTPS Only` answers on 443 and redirects plain HTTP |
| `ssl_certificate` and `ssl_certificate_key` | A certificate entry, either uploaded or requested from Let's Encrypt |
| `proxy_pass http://127.0.0.1:3000` | The site's upstream address |
| `return 301` from `www` | Automatic: `www.<domain>` always redirects to `<domain>` |
| `return 301` from another domain | **Other domains** with **Need redirect** on |
| `limit_req` | An `IP Rate Limiting` rule |
| `allow` and `deny` | An `IP` rule |
| `access_log` | Request records, on by default |
| `proxy_set_header X-Real-IP` | Automatic: CasWAF sends `X-Real-Ip` and `X-Forwarded-Proto` |

Two of those deserve a longer look, because they are where the migration stops being mechanical.

## The certificate

In Nginx the certificate is two file paths on the machine, renewed by Certbot and reloaded with a signal. In CasWAF the certificate is a row in the database: paste the certificate and key, or let CasWAF request one from Let's Encrypt over HTTP-01.

The database version is what makes several gateway machines possible: upload a certificate once and every node serves it, with no files to copy and no reload. A wildcard certificate registered as `*.example.com` serves every subdomain, so the per-site entries can be thinner than the per-site files.

If you already have Let's Encrypt certificates on disk, use them until they are close to expiry, then move the renewal to CasWAF. Two things renewing the same domain over HTTP-01 will fight over `/.well-known/acme-challenge/`.

## The admin location

`location /admin/` with `auth_request` protects one path. CasWAF's login protection protects the whole site, through Casdoor. There is no per-location login.

That difference matters if the same hostname serves both a private admin panel and a public API. The migration is to split them: one site for the public part, another hostname with login protection for the admin part. It is usually the better shape anyway, because it makes the boundary visible in DNS instead of in a config file.

## What has no equivalent

- **`location` blocks.** CasWAF routes by hostname, not by path prefix. Applications that rely on Nginx to serve `/static` from disk while proxying everything else need the static files served by the application, a second site on a subdomain, or Nginx kept in front.
- **`rewrite` rules.** Only the redirects listed above exist. Internal rewrites belong in the application.
- **Caching, compression and buffering knobs.** Not part of the gateway.
- **`upstream` blocks with weights and health checks.** A site has an address; balancing across several application instances happens in the address you give it.

None of these are accidents. They are the parts of Nginx that make it a web server, and the point of the gateway is to be smaller than that.

## Cutting over

1. **Add the site in CasWAF** with the real domain, and leave the certificate empty for now.
2. **Test with a hosts file entry** pointing the domain at the new gateway, before DNS changes. The `Host` header is what CasWAF routes on, so `curl --resolve` works too.
3. **Move the certificate**, or request one from Let's Encrypt once DNS points at the gateway. HTTP-01 needs the domain to resolve to the machine that answers the challenge.
4. **Lower the DNS TTL** a day before, and keep the old server running until the records have expired.
5. **Watch the records** for a day: status codes, the top addresses, anything that used to be handled by a `location` you dropped.

If one application really needs Nginx in front of it, that is fine: CasWAF can forward to Nginx on another port, or sit behind it. The two do not have to be replaced wholesale.

The [sites](/en/docs/sites/sites) page covers the fields in detail, [redirects](/en/docs/sites/redirects) explains the automatic ones, and [CasWAF vs Nginx](/en/compare/nginx) has the side-by-side view.