---
title: "CasWAF documentation"
description: "The manual of CasWAF, the open-source reverse proxy and web application firewall written in Go: installation, sign-in through Casdoor, sites, HTTPS and certificates, rules, request records, the dashboard and running several gateway nodes."
---

CasWAF is an open-source reverse proxy and web application firewall (WAF) written in Go. It takes the place of Nginx in front of your web applications: it listens on ports 80 and 443, picks the site by the requested domain, terminates HTTPS, checks each request against your rules and forwards it to the application. Everything is set up in a web console instead of configuration files, and the settings live in a database that several gateway nodes can share.

## Getting started

- [Introduction](./getting-started/introduction.md): what CasWAF does and how a request goes through it
- [Quick start](./getting-started/quickstart.md): build it, run it and put the first site behind it
- [Sign in with Casdoor](./getting-started/casdoor.md): the Casdoor application the console signs in through
- [Docker](./getting-started/docker.md): build and run the image with Docker Compose

## Sites

- [Sites](./sites/sites.md): domains, where requests go, and the site status
- [HTTPS](./sites/https.md): the SSL modes, how a certificate is picked, and the headers CasWAF adds
- [Redirects](./sites/redirects.md): extra domains, `www.` and trailing slashes
- [Login protection](./sites/login.md): only let signed-in Casdoor users reach a site
- [Health alerts](./sites/alerts.md): email or SMS when a site stops answering

## Certificates

- [Certificates](./certificates/certificates.md): adding certificates and how they are matched to domains
- [Let's Encrypt](./certificates/lets-encrypt.md): certificates issued and renewed automatically

## Rules

- [Rules](./rules/rules.md): how rules are attached to sites, checked in order, and what each action does
- [IP rules](./rules/ip.md): addresses, ranges and traffic from abroad
- [User-Agent and URL path rules](./rules/user-agent-and-path.md): match the client or the path
- [Rate limiting](./rules/rate-limiting.md): requests per second per IP, and how long an address stays blocked
- [WAF rules](./rules/waf.md): ModSecurity SecLang rules run by Coraza
- [CAPTCHA](./rules/captcha.md): send visitors through a CAPTCHA instead of blocking them

## Monitoring

- [Request records](./monitoring/records.md): every request the gateway receives, and how long they are kept
- [Dashboard](./monitoring/dashboard.md): requests over time, top sites, IPs and User-Agents

## Operations

- [Configuration](./operations/configuration.md): every key in `conf/app.conf` and the environment variables
- [Client IP behind a proxy](./operations/client-ip.md): trusted proxies and `X-Forwarded-For`
- [Nodes](./operations/nodes.md): several gateways sharing one database
- [Upgrading](./operations/upgrading.md): updating by hand, and self-update

## More

- [Roadmap](./more/roadmap.md): what is being built next
- [Comparison](./more/comparison.md): CasWAF next to Nginx, Caddy, Nginx Proxy Manager, BunkerWeb and SafeLine
- [FAQ](./more/faq.md)
