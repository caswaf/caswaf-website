---
title: "Nodes"
description: "Run CasWAF on several machines against one database: what is shared, what each gateway keeps to itself, and the node settings for upgrades."
---

Any number of machines can run CasWAF with the same database settings. Each of them is a full gateway: it serves every site, uses every certificate and checks every rule, so you can point DNS at all of them, put them behind a load balancer, or give each region its own. The console can run on any one of them.

## What is shared and what is not

| Shared through the database | Kept by each gateway |
| --- | --- |
| Sites, certificates, rules, nodes, settings | [Rate limit](../rules/rate-limiting.md) counts |
| Request records, from every gateway | Passed [CAPTCHAs](../rules/captcha.md) |
| | [Health alert](../sites/alerts.md) checks, so each node alerts on its own |

Each gateway reloads the sites and rules from the database every few seconds, so a change made in the console reaches every node without a restart.

[Let's Encrypt](../certificates/lets-encrypt.md) certificates are requested by one gateway per site, the one named in the site's **Tag**; the others use the certificate once it is in the database.

## The node list

The **Nodes** page has one entry per gateway machine. A gateway serves traffic whether or not it has an entry; the entry only holds settings for that machine.

| Field | Meaning |
| --- | --- |
| **Name** | The machine's hostname, exactly |
| **Upgrade mode** | When the machine may update: `At Any Time`, `Half A Hour` (only from 23:00 to 23:30, UTC+8) or `No Upgrade` |
| **Self update** | Let CasWAF on this machine update itself from Git; see [Upgrading](./upgrading.md#self-update) |
| **Run mode** | `Go Run` or `Binary`, for the deployment of Casbin's own applications |
| **Tag**, **Display name**, **Client IP** | Notes for you |

Create node entries while signed in as the `admin` account: CasWAF looks up its own entry as `admin/<hostname>`.

## Starting with the machine

On Windows, and on Linux when CasWAF runs as a systemd service, CasWAF makes sure it starts again after a reboot, under the name in `dbName`:

- **Windows**: it writes `Desktop\run\<dbName>.bat`, which runs `go run main.go` in `<appDir>\<dbName>`, and puts a shortcut to it in the Startup folder.
- **Linux**: it expects to run as the unit `caswaf-site-<dbName>.service`, and writes and enables that unit if the file does not exist, with `go run main.go` in `<appDir>/<dbName>`.

So keep the repository at `<appDir>/<dbName>`. On Linux, with `appDir = /opt` and the repository in `/opt/caswaf`, write the unit yourself to run the built program, and CasWAF leaves it alone:

```ini
# /etc/systemd/system/caswaf-site-caswaf.service
[Unit]
Description=CasWAF
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/caswaf
ExecStart=/opt/caswaf/caswaf
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now caswaf-site-caswaf
```

Machines whose hostname has exactly two `-` are left out of this, and of [self-update](./upgrading.md#self-update).

## Running more than one CasWAF on a machine

When it starts, CasWAF stops any process listening on its ports (`httpport`, and with the gateway on, `gatewayHttpPort` and `gatewayHttpsPort`). Two instances on one machine need different ports in each `conf/app.conf`, and only one of them can run the gateway on 80 and 443.

CasWAF also restarts itself after a crash, up to five times in five minutes.
