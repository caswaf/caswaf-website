---
title: "Running the gateway on Windows"
description: "Most WAFs assume a Linux box next to the application. CasWAF runs on the server itself, including the Windows one that hosts the app. What is the same, what is different, and the one thing to plan before a reboot."
---

The usual shape of a WAF deployment is a Linux machine in front of the application, because the WAF is Linux software and the application is somewhere else. That shape exists for a reason, but it is not the only one: plenty of internal tools, IIS sites and line-of-business applications live on a Windows server that nobody wants to duplicate.

CasWAF runs on Windows as well as Linux, from the same source, with the same console. This post is about the parts that are genuinely different there.

## What is the same

- The program: one binary, the gateway and the console in the same process.
- The settings: a MySQL database, and the same `conf/app.conf`.
- The console: a browser on port 17000, signing in through Casdoor.
- The features: sites, certificates, redirects, rules, login protection, records, alerts.

The application behind the gateway does not have to know anything about this. IIS on port 8080 is an upstream like any other.

## What is different: starting with the machine

On Linux, the normal answer is a systemd unit. On Windows, CasWAF registers itself differently: it writes a batch file, `<dbName>.bat`, into `Desktop\run`, and puts a shortcut to it in the Startup folder. The batch file runs `go run main.go` in the repository folder.

Two consequences follow, and both are worth knowing before the first reboot:

- **Go has to be installed** on the machine, because the autostart runs `go run`, not a compiled executable. If you would rather not keep a toolchain on a server, build the binary and start it another way: Task Scheduler with "run whether the user is logged on or not" is the closest Windows equivalent to a service.
- **A Startup shortcut runs when that user signs in.** On a workstation that is exactly right. On a server that reboots at three in the morning and sits at the login screen, nothing starts until someone signs in. If that is the situation, Task Scheduler is the answer, not the Startup folder.

## Ports, and the process that already has them

When CasWAF starts, it stops whatever is listening on the ports it needs: 80, 443 and 17000. On a Windows server that is very likely IIS.

So the order matters:

1. Move IIS, or whatever owns 80, to another port, such as 8080.
2. Add that address as the site's upstream in CasWAF.
3. Start CasWAF.

Doing it the other way round means CasWAF stops IIS on its first start, which looks like a crash until you read the service list.

## Building and running

```bash
go build -o caswaf.exe .
```

Run it from the repository folder: it reads `conf/app.conf` and the built console from the working directory. The first start needs the database to exist, so either create an empty `caswaf` database in MySQL or pass `-createDatabase=true` once.

Then test a site before DNS points at the machine:

```bash
curl -H "Host: app.example.com" http://127.0.0.1/
```

If the answer comes from the application, the site is wired correctly. The rest is DNS and a certificate.

## Updating

The repository is on disk, so an update is `git pull` and a restart, or the self-update path the console offers, which works on Windows too. There is no image to rebuild and no registry involved.

One thing to keep in mind on Windows: the running process holds the executable, so a rebuild while the gateway is up fails with "access is denied". Stop it, build, start it again.

## When this is the right call

If the application is on a Windows server and you want a firewall, a certificate and a login in front of it, running the gateway on the same machine avoids introducing a second operating system to maintain. It is also the smallest possible step: one binary, one database, one console.

If you have a fleet of Windows servers, the gateway still scales the same way as on Linux: several machines, one database. The autostart details differ per machine, nothing else does.

The [quick start](/en/docs/getting-started/quickstart) covers the build, and [nodes](/en/docs/operations/nodes) explains the autostart in detail.