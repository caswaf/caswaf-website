---
title: "The real client IP behind a reverse proxy"
description: "IP rules, rate limits and request records all key off the client's address. Once a proxy is in front, the address in the socket belongs to the proxy. How CasWAF works out the real one, and when it refuses to believe the header."
---

The first thing that breaks when a reverse proxy goes in front of an application is the client's address. Before, the application saw the visitor. After, every connection comes from the proxy: the logs say `10.0.0.14`, the rate limiter counts one address for the whole internet, and an IP blocklist does nothing at all.

The address is still there. It is in the `X-Forwarded-For` header, which each proxy appends to as the request passes through. The problem is that any client can send that header too, so a proxy that trusts it unconditionally hands attackers a way to claim any address they like.

CasWAF resolves this in one place, and everything downstream uses the result: IP rules, rate limits, request records, the `X-Real-Ip` header it sends upstream, and the address shown in the dashboard.

## How it decides

1. **The connection is not from a trusted proxy.** The client is the address the connection came from. Any `X-Forwarded-For` the client sent is ignored and removed before the request is forwarded.
2. **The connection is from a trusted proxy.** CasWAF reads `X-Forwarded-For` from the right, skipping addresses that are themselves trusted proxies, and takes the first one that is not. That is the last hop before your own infrastructure, which a client cannot fake.
3. **There is no `X-Forwarded-For`.** It falls back to `X-Real-IP` if the trusted proxy sent one, and to the connection's address otherwise.

Reading from the right is the important part. A client can send `X-Forwarded-For: 1.2.3.4`, and each real proxy appends the address it actually received the connection from. Taking the rightmost untrusted entry means the fake value at the front never wins.

## Trusted proxies

By default CasWAF trusts the private and local ranges:

```text
127.0.0.0/8, ::1/128, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10, fc00::/7
```

That covers a load balancer on your own network, which is the common case: a cloud load balancer forwards from an internal address, CasWAF trusts it, and the real client comes out of the header.

A CDN is different, because it reaches CasWAF from public addresses. List its ranges, together with the private ones you still need, in `trustedProxies`:

```ini
trustedProxies = 127.0.0.0/8, ::1/128, 10.0.0.0/8, 173.245.48.0/20, 103.21.244.0/22
```

The value replaces the default list rather than adding to it, single addresses without a prefix are accepted, and it can also be set as an environment variable of the same name. It is read once, at start.

## What the application sees

CasWAF forwards the request with:

- `X-Real-Ip`: the client address worked out above
- `X-Forwarded-Proto`: `https` or `http`, as the client connected to CasWAF
- `X-Forwarded-For`: kept as received when it came from a trusted proxy, removed otherwise

Applications behind CasWAF should read `X-Real-Ip`, and trust it only when the request comes from CasWAF. If the application is also reachable directly, it has the same spoofing problem one layer down.

## The one rule that matters

Only list ranges that belong to proxies you actually run. Every address in `trustedProxies` is an address that can claim to be forwarding for anyone. A CDN's ranges are public information; an internet-facing proxy that you forgot was there is not.

The full reference is in [client IP behind a proxy](/en/docs/operations/client-ip), and [IP rules](/en/docs/rules/ip) shows what the address is used for once it is correct.