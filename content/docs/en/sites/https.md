---
title: "HTTPS"
description: "How CasWAF serves HTTPS: the SSL modes of a site, how the certificate is picked for each connection, the TLS settings, and the headers it adds to HTTPS responses."
---

The gateway listens for HTTPS on port 443 and for plain HTTP on port 80. A site's **Mode** says what happens to plain HTTP; the certificate comes from the [certificate list](../certificates/certificates.md).

## SSL modes

| Mode | Plain HTTP | HTTPS |
| --- | --- | --- |
| `HTTPS Only` | Redirected to HTTPS with a `301` | Served |
| `HTTPS and HTTP` | Served | Served |
| `HTTP` | Served | Served if a certificate matches the domain |
| `Static Folder` | Serves files from the folder in **Host** instead of forwarding; see [Sites](./sites.md#serving-a-folder) | |

New sites start as `HTTPS Only`. Until the site has a certificate, use `HTTP`: with `HTTPS Only` and no certificate, every visit is redirected to an HTTPS address that cannot connect.

## Which certificate is used

The certificate is chosen while the TLS connection is set up, from the server name (SNI) the client sends, in two steps:

1. A certificate whose **Name** is exactly the requested name, such as `app.example.com`.
2. Otherwise, a certificate named after the registered domain, such as `example.com`. A wildcard certificate for `*.example.com` and `example.com`, named `example.com`, serves every subdomain this way.

A client that sends no server name, or asks for a name no certificate matches, cannot connect: there is no default certificate. The site edit page shows the matched certificate under **SSL cert**.

Certificates are not tied to sites, so a certificate also serves a domain that no site has yet; the request then gets `site not found`.

## TLS settings

- TLS 1.2 and 1.3
- For TLS 1.2, ECDHE key exchange with AES-GCM or ChaCha20-Poly1305 only
- Curves X25519, P-256 and P-384

These are built in and the same for every site.

## What CasWAF adds to HTTPS responses

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`, unless the application already sent the header
- `Secure` on every `Set-Cookie` that does not have it

On every response, HTTPS or not, CasWAF removes `Access-Control-Allow-Origin` and the other `Access-Control-*` headers when the application allows credentials together with the origin `*` or `null`, a combination that would let any website read the user's data.

## HTTP-only paths

Two kinds of path are answered by the gateway itself, before the mode is applied, so they work over plain HTTP even for an `HTTPS Only` site:

- `/.well-known/acme-challenge/<token>`, for [Let's Encrypt](../certificates/lets-encrypt.md) and other ACME clients
- `/MP_verify_<code>.txt`, the files WeChat asks a domain to serve for verification

Both are answered from the site's **Challenges**, each entry written as `<token>:<answer>` or `MP_verify_<code>.txt:<answer>`.
