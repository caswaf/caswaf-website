---
title: "Upgrading"
description: "Update CasWAF from Git by hand, or let each gateway node update itself: how self-update builds, restarts and rolls back."
---

CasWAF is developed on the `master` branch of [caswaf/caswaf](https://github.com/caswaf/caswaf), and each gateway runs a checkout of it. The tables are updated by CasWAF itself when it starts, so upgrading is getting the new code and restarting.

## By hand

```bash
cd /opt/caswaf
git pull
cd web && yarn install && yarn build && cd ..
go build -o caswaf .
sudo systemctl restart caswaf-site-caswaf
```

Skip the `web` step when nothing under `web/` changed. The console's files are read from `web/build` on each request, so a new build shows without a restart.

Restarting the gateway drops the connections it holds and resets [rate limit](../rules/rate-limiting.md) counts and passed [CAPTCHAs](../rules/captcha.md). With several [nodes](./nodes.md), upgrade them one at a time.

If `conf/app.conf` has local changes that conflict with a change upstream, `git pull` stops; move your values aside, pull, and put them back.

## Self-update

A gateway can update itself from Git. Every five minutes it checks for new commits on the branch its checkout tracks, and if there are any:

1. it pulls them and builds a new program, `<appDir>/_bin/<dbName>/<dbName>_<commit>.exe`;
2. it rebuilds the console if anything under `web/` changed; a failed console build does not hold the update back;
3. it restarts on the new program: on Linux by pointing its systemd unit at the new program and exiting, so systemd starts it again; on Windows by starting the new program a few seconds later and exiting.

If the build fails, it goes back to the commit it was running, keeps running, and does not try that upstream commit again; it waits for the next one.

Self-update runs only when all of these hold:

- the machine runs Windows, or Linux with CasWAF as a systemd service;
- CasWAF runs from a Git checkout, and Go, and Yarn for the console, are installed;
- there is an entry for the machine on the **Nodes** page, owned by `admin`, with **Self update** on;
- the node's **Upgrade mode** allows it now: `At Any Time`, or the half hour from 23:00 UTC+8 for `Half A Hour`; `No Upgrade` stops it.

Turn it on for a test node first, and for the rest once you trust the branch you follow. For a fixed version, point the checkout at a branch you move yourself.
