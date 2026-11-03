---
title: "Sites"
description: "A site is one web application behind CasWAF: its domains, where its requests are forwarded, how it is served, and what its status does."
---

A site is one web application behind the gateway. Each request is matched to a site by its domain, and the site says where the request goes and what is checked on the way.

## Domains

| Field | What it does |
| --- | --- |
| **Domain** | The main domain, such as `app.example.com` |
| **Other domains** | More domains served by the same site, such as `example.com` or `app.example.net` |
| **Need redirect**, **Redirect with slash** | Send the other domains to the main one; see [Redirects](./redirects.md) |

Matching ignores case, the port and a leading `www.`, so `www.app.example.com:443` matches a site whose domain is `app.example.com`. A request for a domain no site has gets a `500` with `CasWAF error: site not found for host`, and a request whose `Host` is a bare IP address gets a `400`.

## Where requests go

CasWAF picks the upstream in this order:

| Field | Used when | Example |
| --- | --- | --- |
| **Hosts** | It has entries; one is picked at random for each request | `http://10.0.0.11:8080`, `http://10.0.0.12:8080` |
| **Host** | **Hosts** is empty | `http://127.0.0.1:3000`, `https://backend.internal` |
| **Port** | Both are empty | `3000` means `http://localhost:3000` |

The original `Host` header is passed on unchanged, and CasWAF adds `X-Real-Ip` (the client address) and `X-Forwarded-Proto` (`http` or `https`). See [Client IP behind a proxy](../operations/client-ip.md) for `X-Forwarded-For`.

Picking among **Hosts** is plain random choice: there is no weighting, and an upstream that is down is not taken out of the rotation.

## Serving a folder

Set **Mode** to `Static Folder` and **Host** to a folder on the gateway machine, such as `/var/www/site`, and CasWAF serves the files in it. `/` serves `index.htm` or `index.html`. The other modes, `HTTP`, `HTTPS and HTTP` and `HTTPS Only`, are covered in [HTTPS](./https.md).

## Status

| Status | Effect |
| --- | --- |
| `Active` | Served normally |
| `Inactive` | Still served by the gateway, but skipped by [health alerts](./alerts.md) |
| `Stopped` | Every request gets `503` and a page saying the service has been stopped |

To take a site offline, set it to `Stopped`; to remove it, delete it.

## Other fields

| Field | What it does |
| --- | --- |
| **Name**, **Display name** | The site's ID is `<owner>/<name>`; the owner is the account that created it |
| **Tag** | Free text; the site list is sorted by it |
| **Rules** | The [rules](../rules/rules.md) checked for each request, in order |
| **Disable verbose** | Visitors stopped by a rule see only "the rule has been hit" instead of the rule's reason |
| **Casdoor app** | Require visitors to sign in first; see [Login protection](./login.md) |
| **Challenges** | Answers for `/.well-known/acme-challenge/<token>` and `/MP_verify_*` files, written as `token:answer`; CasWAF fills these in itself for [Let's Encrypt](../certificates/lets-encrypt.md) |
| **Public IP** | Filled in from DNS: the first IPv4 address the main domain resolves to |
| **SSL cert** | Read only: the certificate the site's domain matches |
| **Node** | The first gateway that served the site |
| **Nodes** | Used by CasWAF's deployment of applications from Git, which today only handles Casbin's own projects (see the [roadmap](../more/roadmap.md)); leave it empty |
| **Enable alert** and the fields after it | [Health alerts](./alerts.md) |

Changes are picked up by every gateway within a few seconds of saving.
