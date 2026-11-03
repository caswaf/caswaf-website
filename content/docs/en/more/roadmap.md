---
title: "Roadmap"
description: "What is being built next in CasWAF: deploying applications from Git, compound rules, request bodies in WAF rules, richer request records, wildcard certificates and roles in the console."
---

The rest of this manual describes what CasWAF's `master` branch does today. This page lists what comes next, roughly in order. Ideas and pull requests are welcome on [GitHub](https://github.com/caswaf/caswaf/issues).

## Rules

- **Compound rules that work.** Combine rules with `and` and `or`, such as "from abroad and on `/login`". The `Compound` type in the editor matches every request today and should not be used yet.
- **Request bodies in WAF rules.** Pass the body to Coraza, so `ARGS_POST`, JSON and file uploads can be checked.
- **`is not in` with several ranges** in IP rules, matching addresses outside all of them.
- **Countries and regions.** Match any country, not only inside or outside China, with a database that also covers IPv6.
- **Custom block pages**, per site, instead of the plain-text reason.

## Request records

- Record which site and rule handled each request, the action taken and the response status, so blocked requests can be listed and counted.
- Write records in batches off the request path, and keep long paths in full.
- The dashboard on databases other than MySQL.

## Sites

- **Deploy any application from Git.** CasWAF can already clone a repository onto gateway nodes, build it, run it under systemd or as a Windows service, pull new commits and restart it, upload the front end's files to a CDN, and update itself. Today the repository is derived from the site's name and the code is tailored to Casbin's own projects; the next step is a repository URL and build and run commands on each site, so it works for any application.
- **Upstream health checks and balancing.** Take an upstream that is down out of **Hosts**, and offer round robin and weights besides random choice.
- **Login protection** that sends the visitor back to sign in when the token has expired, and rules on Casdoor users, groups and roles.
- A default certificate for clients that send no server name.

## Certificates

- **Wildcard certificates from the console**, over the DNS-01 challenge with Alibaba Cloud DNS and GoDaddy. The code to issue them is in the repository and needs a button and a renewal loop.
- Automatic certificates for every site, without the per-site **Tag** and owner conditions.

## Console and operations

- **Roles.** Read-only users, and administrators per site.
- The console's Casdoor settings read from the server instead of compiled into the web app, so one image fits every installation.
- Rate limit counts and passed CAPTCHAs shared between nodes.
