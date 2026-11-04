---
title: "TLS certificates without the certificate files"
description: "In a file-based proxy, a certificate is two paths on one machine and a reload. Here it is a row in the database, matched per connection by domain. What that changes for renewal, wildcards and several nodes."
---

Every reverse proxy has to answer the same three questions about HTTPS: which certificate does this connection get, where does it come from, and what happens when it expires. Nginx answers them with file paths and a reload. CasWAF answers them with rows in the database.

The difference sounds cosmetic until the second machine exists.

## Matching

A certificate in CasWAF has a name, and the name is the domain it answers for. When a connection arrives, the gateway takes the `Host` and the TLS SNI name, looks for a certificate whose name matches, and uses it. A certificate named `*.example.com` covers every subdomain; a certificate named `app.example.com` covers that one name.

Nothing is keyed by file path, so adding a domain is adding a name, and the same certificate can serve any number of sites without being copied anywhere.

## Getting a certificate

Two ways in: paste one, or let CasWAF request one from Let's Encrypt.

Pasting is what you do for certificates you bought, or for wildcards. A wildcard cannot be issued over HTTP-01, so it comes from your DNS provider's ACME client, such as `lego` or `acme.sh`, and is uploaded with the chain. CasWAF then treats it like any other certificate, including for every subdomain it matches.

Requesting is the HTTP-01 flow, which CasWAF runs itself:

1. It needs an ACME account: an email address and an EC P-256 key in `conf/app.conf`. The account is registered with Let's Encrypt the first time it is used.
2. Before talking to Let's Encrypt, it checks that the domain reaches itself: it writes a random token into the site's challenges and fetches `http://<domain>/.well-known/acme-challenge/<token>`. If that does not come back, it stops. This one step prevents most of the failed attempts that end in a rate limit.
3. It asks for an RSA 2048 certificate, answers the challenge, and stores the result in the certificate list.

Only one gateway requests certificates for a site, not every node. Which one is decided by the site's tag, and a site whose tag names no machine gets no automatic certificate. The other nodes see the certificate appear in the database and start serving it.

## Renewal, and what happens when it fails

The gateway checks the site every few seconds. It requests a certificate when no certificate matches a domain, or when the matching one expires within seven days. A domain already covered by a wildcard is left alone, because the wildcard matches by its registered domain.

Failures back off: an hour, then two, four, eight, sixteen, then once a day. That is deliberately conservative, because Let's Encrypt rate limits are counted per domain per week, and a proxy that retries every minute burns the budget in an afternoon.

The common failures are all in DNS or port 80. A domain that still points at the old server, or a firewall that drops port 80, both fail the pre-check before Let's Encrypt is ever contacted, and the error in the records says so.

## On several nodes

This is where the database version earns its keep. The certificate and key are written once, and every gateway reads them. There is no `certbot` on each machine, no deploy hook that copies `/etc/letsencrypt`, no reload signal to send to four processes.

The one thing worth remembering: the node that requests the certificate is the one whose tag matches the site. If that machine is down for a week, renewal waits for it to come back, and the ten-day window before expiry is what you have left.

## What to watch

- **Expiry in the certificate list.** A certificate that is about to expire is visible before it does, which is the difference between a routine renewal and a morning of 502s.
- **The pre-check failure.** When a domain stops reaching the gateway, the message is about the challenge fetch, not about Let's Encrypt, which saves a support ticket to the wrong place.
- **Wildcards versus per-domain.** A wildcard simplifies DNS and certificate count, but a single per-domain certificate is easier to revoke without touching every subdomain.

The [Let's Encrypt](/en/docs/certificates/lets-encrypt) page has the settings, and [certificates](/en/docs/certificates/certificates) covers uploading one by hand, including the wildcard case.