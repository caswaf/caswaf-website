---
title: "Health alerts"
description: "Have CasWAF request a site at a fixed interval and send an email or SMS through Casdoor when it stops answering."
---

CasWAF can watch a site from the outside: it requests the site's domain at a fixed interval and, when it fails several times in a row, sends an alert by email or SMS through Casdoor's providers.

## Set it up

1. In Casdoor, in CasWAF's organization, make sure there is an email provider or an SMS provider, and that the user who owns the site (the account that created it in CasWAF) has an email address or a phone number.
2. In CasWAF, open the site and turn on **Enable alert**.
3. Set **Alert interval**, in seconds (60 by default), and **Alert try times**, the failures in a row before an alert is sent (3 by default).
4. Pick one or more providers under **Alert providers**. Email providers send to the owner's email address, SMS providers to their phone.
5. Save.

## What is checked

- The site's main domain, over HTTPS for `HTTPS Only`, over HTTP for `HTTP`, and both for `HTTPS and HTTP`, where either answering is enough.
- A check passes when the response, after following redirects, is a `2xx` within 5 seconds.
- Sites that are `Inactive` or `Stopped` are not checked.
- `Static Folder` sites are checked like `HTTPS and HTTP` ones.

## When alerts are sent

When the failures in a row reach **Alert try times**, one alert goes out with the domain and the error. No more alerts are sent for the same outage; the count starts over once a check passes again. There is no message when the site recovers.

Every gateway node runs the checks, so with several [nodes](../operations/nodes.md) each one sends its own alert.
