---
title: "Several gateways, one database"
description: "CasWAF has no cluster mode. Any number of machines can run the same gateway against one database, which is the same thing with fewer moving parts. What is shared, what each node keeps to itself, and where it breaks."
---

Most gateways make you choose between one machine and a cluster with a control plane, a consensus protocol and a different set of logs to read. CasWAF takes a third option: every gateway machine is identical and stateless, and everything that needs to agree lives in the database you already run.

There is no cluster mode to turn on. You install the same program on a second machine with the same database settings, and it serves the same sites.

## What is shared, and what is not

| Shared through the database | Kept by each gateway |
| --- | --- |
| Sites, certificates, rules, nodes, settings | Rate limit counters |
| Request records from every gateway | Passed CAPTCHAs |
| | Health alert checks |

That table is the whole design. Everything that decides what a request should do is shared, so all nodes make the same decision. Everything that is a short-lived counter stays local, so no request has to call another machine to be handled.

The consequences are worth spelling out:

- **Rate limits are per node.** A rule that allows 20 requests per second allows 20 per second on each machine. With three nodes behind a round-robin DNS record, one client can effectively send 60. If that matters, set the per-node number to a third of what you want, or do the counting in a load balancer that sees all the traffic.
- **CAPTCHA passes are per node.** A visitor who solved a CAPTCHA on one machine may be asked again if the next request lands on another. With sticky sessions at the load balancer, they usually will not.
- **Health alerts fire per node.** Each gateway checks the sites it serves and sends its own alert. Three nodes mean three emails when a site goes down, unless you route alerts through one place.

## Changes reach every node

Each gateway reloads sites, certificates and rules from the database every few seconds. Add a site in the console and it exists everywhere within that window, with no restart and no configuration to distribute. This is the part that usually takes a deployment pipeline and here is a row in a table.

It also means the console is not a control plane that pushes to agents. The console is one of the gateways, or a machine that only runs the console; the nodes poll the same database.

## Certificates

A Let's Encrypt certificate is requested by one gateway per site, not by all of them. If every node tried, they would race over the HTTP-01 challenge and the account's rate limits. The node that requests it is the one assigned to the site; the others pick the certificate up from the database once it is there.

Uploaded certificates need no coordination at all: they are a row, and every node reads it.

## Rolling upgrades

Because the nodes are independent processes reading the same database, an upgrade is a sequence rather than a switch: take one node out of rotation, upgrade it, put it back, move to the next. Traffic keeps being served by the others the whole time, and a node that fails to come back does not take the site down.

The node list in the console is how you keep track of which machine is which. An entry per gateway holds its upgrade window and whether it may update itself from Git, so the upgrade order is a setting rather than a checklist someone remembers.

## Where it breaks

- **The database is a single point of failure.** If it is down, the gateways keep serving what they last loaded, but changes stop applying and records stop being written. Treat it like any other critical database, because it is one.
- **The network between nodes and the database matters more than the network between nodes**, because there isn't one. A node that cannot reach the database is a node that cannot pick up a new certificate.
- **In-memory state is lost on restart.** Rate limit counters reset, which gives a flooding client a clean slate every time you redeploy a node. For ordinary floods this is invisible; for a determined attacker it is a free five seconds.

## When not to bother

For a handful of sites on one machine, one gateway is fine and simpler. The second machine is worth adding when you need a maintenance window without downtime, when the sites serve different regions, or when a single machine can no longer carry the traffic. Until then, the database-backed design means adding the second one later is an install, not a migration.

The [nodes](/en/docs/operations/nodes) page has the settings, [upgrading](/en/docs/operations/upgrading) covers the update flow, and [CasWAF vs Nginx](/en/compare/nginx) is the comparison if you are weighing this against a hand-managed fleet.