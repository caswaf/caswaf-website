---
title: "Client IP behind a proxy"
description: "How CasWAF works out the client's address, when it believes X-Forwarded-For, and how to set trustedProxies when it sits behind a load balancer or CDN."
---

IP rules, rate limits, request records and the `X-Real-Ip` header CasWAF sends on all use the client's address. When CasWAF faces the internet directly, that is simply the address the connection comes from. When a load balancer, a CDN or another proxy sits in front of it, the connection comes from the proxy, and the real address is in `X-Forwarded-For`, a header anyone can also set by hand.

## How CasWAF decides

1. If the connection does not come from a trusted proxy, the client is the connection's address. Any `X-Forwarded-For` the client sent is ignored, and removed before the request is forwarded.
2. If it does, CasWAF reads `X-Forwarded-For` from the right, skipping trusted proxies, and takes the first address that is not one. Each proxy appends the address it received from, so this is the last hop before your own infrastructure, which a client cannot fake.
3. With no `X-Forwarded-For`, it uses `X-Real-IP` if the trusted proxy sent one, and the connection's address otherwise.

## Trusted proxies

By default the private and local ranges are trusted:

```text
127.0.0.0/8, ::1/128, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10, fc00::/7
```

That covers a load balancer on your private network, such as a cloud load balancer that forwards from internal addresses. If the proxy in front of CasWAF reaches it from public addresses, as a CDN does, list its ranges, together with the private ones you still need, in `trustedProxies`:

```ini
trustedProxies = 127.0.0.0/8, ::1/128, 10.0.0.0/8, 173.245.48.0/20, 103.21.244.0/22
```

The value replaces the default list. Single addresses without `/` are accepted. Like the database settings, it can also be set as an environment variable of the same name. It is read once, at start.

Only trust ranges that belong to proxies you use. Every address in the list can claim to be forwarding for anyone.

## What the application sees

CasWAF passes the request on with:

- `X-Real-Ip`: the client address worked out above
- `X-Forwarded-Proto`: `https` or `http`, as the client connected to CasWAF
- `X-Forwarded-For`: kept as received when it came from a trusted proxy, removed otherwise

Applications behind CasWAF should read `X-Real-Ip`, and trust it only from CasWAF.
