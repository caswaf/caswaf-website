---
title: "Let's Encrypt"
description: "Have CasWAF request and renew Let's Encrypt certificates for a site's domains over HTTP-01, what it needs, and when it does it."
---

CasWAF can get certificates from Let's Encrypt for a site's domains and renew them before they expire, using the HTTP-01 challenge that it answers itself. Each domain of the site, the main one and every one in **Other domains**, gets its own certificate, named after the domain.

## What it needs

1. **An ACME account** in `conf/app.conf`: an email address and an EC P-256 private key in PEM form. Create the key with:

   ```bash
   openssl ecparam -name prime256v1 -genkey -noout
   ```

   and put it on one line, with `\n` where the line breaks were:

   ```ini
   acmeEmail = admin@example.com
   acmePrivateKey = -----BEGIN EC PRIVATE KEY-----\nMHcCAQEE...\n-----END EC PRIVATE KEY-----
   ```

   CasWAF registers the account with Let's Encrypt the first time it is used. Restart CasWAF after setting these.

2. **The gateway that should request it.** Only one gateway requests certificates for a site, so that several [nodes](../operations/nodes.md) do not each ask for one. It is named in the site's **Tag**: the tag is the gateway machine's hostname, or anything followed by `-` and the hostname. A site tagged `gw1` or `web-gw1` has its certificates requested by the machine whose hostname is `gw1`. A site whose tag names no machine gets no certificates.

3. **DNS** for each domain pointing at the gateways, and port 80 reachable from the internet.

4. **A site owner other than `admin`.** Sites created by the `admin` account are skipped; CasWAF expects those to use certificates added by hand, such as wildcards.

## When it runs

The gateway checks the site every few seconds. For each domain it requests a certificate when:

- no certificate matches the domain, either by its exact name or by its registered domain, or
- the matching certificate expires within 7 days.

So a domain already covered by a wildcard certificate named after its registered domain is left alone.

## How it runs

1. CasWAF first checks that it can reach itself: it writes a random token into the site's **Challenges** and requests `http://<domain>/.well-known/acme-challenge/<token>` up to ten times. If the answer does not come back, for instance because DNS points somewhere else, it stops there and does not bother Let's Encrypt.
2. It asks Let's Encrypt for an RSA 2048 certificate, answers the challenge, and stores the certificate with its chain in the certificate list, replacing the old one.
3. If anything fails, it waits an hour before trying that domain again, then two, four, eight, sixteen, and then once a day, which keeps it under Let's Encrypt's rate limits.

While it works, CasWAF replaces the site's **Challenges** with its own token and empties them afterwards, so keep WeChat verification files on a site that does not get automatic certificates.

## Wildcard certificates

HTTP-01 cannot issue wildcards. Get a wildcard certificate with your DNS provider's ACME client, such as [lego](https://go-acme.github.io/lego/) or [acme.sh](https://github.com/acmesh-official/acme.sh), and add it by hand, named after the bare domain; see [Certificates](./certificates.md). Requesting wildcard certificates over DNS from the console is on the [roadmap](../more/roadmap.md).
