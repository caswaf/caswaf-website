---
title: "Introduction"
description: "What CasWAF is: a reverse proxy and web application firewall in one Go program, managed from a web console, with sites, certificates and rules stored in a database."
---

CasWAF is a reverse proxy and web application firewall (WAF) in one Go program. You put it where Nginx would be, in front of your web applications, and manage it from a browser: add a site, give it a domain and the address of the application, attach a certificate and some rules, and save. There are no configuration files to edit and nothing to reload.

## What is in the box

- **A gateway** on ports 80 and 443. It picks the site by the `Host` of the request, serves HTTPS with the matching certificate, and forwards the request to the application.
- **Rules** checked before a request is forwarded: IP addresses and ranges, traffic from abroad, User-Agent, URL path, rate limits per IP, and ModSecurity rules run by [Coraza](https://coraza.io). A rule allows, blocks or sends the visitor through a CAPTCHA.
- **Certificates**: added by hand, or issued and renewed by Let's Encrypt.
- **Login protection**: a site can require its visitors to sign in through [Casdoor](https://casdoor.ai) before they reach it.
- **Request records** and a dashboard of requests over time, top sites, top IPs and top User-Agents.
- **Health alerts** by email or SMS when a site stops answering.
- **A web console** on port 17000, which signs in through Casdoor and comes in nine languages.

## How a request goes through

1. The request arrives on port 80 or 443. For HTTPS, the certificate is chosen by the server name the client asked for.
2. CasWAF records the request: time, method, host, path, client IP and User-Agent.
3. It finds the site whose domain, or one of whose other domains, matches the `Host`. A `www.` prefix is removed first.
4. Redirects run: other domains to the main domain, `www.` to the bare domain, HTTP to HTTPS.
5. If the site has a Casdoor application, a visitor without a valid login is sent to sign in.
6. The site's rules are checked in order. The first rule that matches decides: allow, block or CAPTCHA.
7. The request is forwarded to the application, or a file is served from a folder.

## The parts

| Part | What it is |
| --- | --- |
| Gateway | Listens on 80 and 443 (`gatewayHttpPort`, `gatewayHttpsPort`) |
| Console and API | Listens on 17000 (`httpport`); the React app is served from `web/build` |
| Database | MySQL by default; tables `site`, `cert`, `rule`, `record`, `node` and `setting` |
| Casdoor | Signs people in to the console, and backs login protection, CAPTCHA and alerts |

Several machines can run CasWAF against the same database. Each one serves every site, so you can point DNS at any of them. See [Nodes](../operations/nodes.md).

## Source and license

CasWAF is at [github.com/caswaf/caswaf](https://github.com/caswaf/caswaf), under the Apache-2.0 license. The backend is Go with Beego and XORM; the console is React with Ant Design.
