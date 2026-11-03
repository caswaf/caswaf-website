---
title: "Certificates"
description: "Add TLS certificates to CasWAF, name them so the gateway matches them to domains, and keep track of when certificates and domains expire."
---

Certificates live in their own list, apart from sites. The gateway picks one for each HTTPS connection by its name, so one wildcard certificate can serve every site under a domain. Certificates for single domains can also be issued for you by [Let's Encrypt](./lets-encrypt.md).

## Add a certificate

1. Open **Certs** and click **Add**, then **Edit** on the new row.
2. Set **Name** to the domain the certificate is for. This is what the gateway matches; see below.
3. Paste the PEM certificate, with its intermediate certificates after it, into **Certificate**, and the PEM private key into **Private key**.
4. Set **Crypto algorithm** to `RSA` or `ECC` to match the key, and leave **Type** at `SSL`.
5. Save. **Expire time** is read from the certificate.

The new certificate is used for new connections within a few seconds; nothing needs to restart.

## How names are matched

For a connection to `shop.app.example.com`, CasWAF looks for a certificate named:

1. `shop.app.example.com`, exactly, and then
2. `example.com`, the registered domain.

So name a certificate for a single domain after that domain, and a wildcard certificate (`*.example.com` plus `example.com`) after the bare domain. A wildcard only covers one level, so `shop.app.example.com` is not covered by `*.example.com` even though the name matches: give it a certificate of its own.

Certificates of every owner are searched. The site edit page shows which certificate its domain picked under **SSL cert**.

## Expiry

The list shows when each certificate expires. **Domain expire** shows when the domain's registration expires: click **Refresh** on a row, or **Refresh all**, to look it up. CasWAF asks Alibaba Cloud's domain API when the certificate has **Provider** `Aliyun` with an access key, and RDAP and WHOIS otherwise.

## Provider and keys

**Provider** (`Aliyun` or `GoDaddy`), **Account**, **Access key** and **Access secret** hold DNS credentials for the domain. CasWAF uses the Alibaba Cloud key to read the domain's expiry. The access secret is never sent back to the browser and shows as `***`; when you save the certificate, type the secret in again, or the stored one is replaced by `***`.

## Copying and downloading

The edit page has buttons to copy or download the certificate and the private key, for use on other servers.
