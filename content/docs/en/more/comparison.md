---
title: "Comparison"
description: "CasWAF next to Nginx, Caddy, Nginx Proxy Manager, BunkerWeb and SafeLine: how each is configured, what protection it has, its license, and when to pick which."
---

CasWAF sits in the same place as a reverse proxy, and does part of the job of a web application firewall. This page sets it next to the tools people usually weigh it against. The others change too, so check their own documentation before deciding.

One tool at a time, with more detail: [SafeLine](/en/compare/safeline), [ModSecurity](/en/compare/modsecurity), [BunkerWeb](/en/compare/bunkerweb) and [Nginx](/en/compare/nginx).

## At a glance

| | Configured in | WAF | HTTPS certificates | License |
| --- | --- | --- | --- | --- |
| **CasWAF** | Web console, settings in a database | IP, User-Agent, path and rate rules; ModSecurity rules on Coraza; CAPTCHA | By hand, or Let's Encrypt per domain | Apache-2.0 |
| **Nginx** | Configuration files | Through modules such as ModSecurity | By hand or with Certbot | BSD-2-Clause |
| **Caddy** | Caddyfile or JSON API | Through plugins such as Coraza | Automatic | Apache-2.0 |
| **Nginx Proxy Manager** | Web UI over Nginx | Access lists only | Let's Encrypt | MIT |
| **BunkerWeb** | Environment settings or web UI, over Nginx | ModSecurity with the OWASP Core Rule Set, bad-behavior bans, anti-bot | Let's Encrypt | AGPL-3.0, with a paid edition |
| **SafeLine** | Web UI | Its own semantic detection engine | Let's Encrypt | GPL-3.0 for the open parts, with paid editions |

## Where CasWAF is different

- **One Go program.** The gateway, the rules and the console are one program with no Nginx, Lua or separate detection service underneath. It runs on Linux and Windows.
- **Settings in a database, not in files.** Every gateway node reads the same sites, certificates and rules, and a change in the console reaches all of them in seconds, with nothing to template, copy or reload.
- **Single sign-on built in.** The console signs in through Casdoor, so MFA, LDAP, SAML and social logins come with it, and any site can be put behind a Casdoor login without touching the application.
- **Apache-2.0, all of it.** There is no paid edition with features held back.

## Where the others are ahead

- **Nginx** is faster, has been run everywhere for twenty years, and does far more as a web server: caching, compression, fine control over buffering and timeouts, streams.
- **Caddy** makes HTTPS fully automatic, wildcards included, and has a large plugin ecosystem.
- **Nginx Proxy Manager** is the simplest way to put a few home or small-office services behind HTTPS with a UI.
- **BunkerWeb** ships the OWASP Core Rule Set and many protections turned on by default, which CasWAF does not.
- **SafeLine** detects attacks by parsing SQL, JavaScript and shell syntax instead of matching patterns, and has a mature UI for its reports.

## Which to pick

- You manage many sites across several servers and want them in one console with single sign-on: **CasWAF**.
- You run Casdoor already, or want internal tools behind a company login without changing them: **CasWAF**.
- You need the highest throughput or features beyond reverse proxying: **Nginx**, or **Caddy** for less configuration.
- You need broad attack coverage out of the box today: **BunkerWeb** or **SafeLine**, or Nginx or Caddy with Coraza and the Core Rule Set.

CasWAF can also sit in front of or behind any of them, for instance with Nginx still serving one application on another port.
