---
title: "Putting WordPress behind the gateway"
description: "WordPress attracts the most automated attacks of any common application. A gateway in front of it can take the brute force, the XML-RPC traffic and the scanner noise away before PHP ever starts."
---

WordPress is the most attacked web application in the world, not because it is uniquely vulnerable but because it is everywhere. The traffic that arrives at a public WordPress site is mostly not readers: it is `wp-login.php` guesses, XML-RPC pings, `/.env` probes and plugin-specific exploit attempts, all automated and all cheap to send.

Most of that never needs to reach PHP. A gateway in front of WordPress can answer it with a `403`, a CAPTCHA or a rate limit, and leave the application to the readers.

## The three rules that do most of the work

**Rate limit the login form.** `wp-login.php` takes a `POST` and checks a password. There is no legitimate reason for one address to try it hundreds of times a minute. An `IP Rate Limiting` rule attached to the site, with a rate around ten per minute and a block of an hour, removes the overwhelming majority of password guessing without touching normal visitors, who never log in more than once.

If you would rather challenge than block, a `CAPTCHA` rule on the `wp-login.php` path does the same job with a click instead of a `403`.

**Block `xmlrpc.php` if nothing uses it.** It is used by the mobile app, by some plugins, and by pingbacks, and it is also a favourite for brute-force amplification because one request can carry hundreds of password attempts. If nothing on the site needs it, a path rule that blocks it removes a whole attack class. Check the access logs first: if there are no legitimate calls, there is nothing to lose.

**Write WAF rules for the plugin you actually run.** This is the part that needs a little thought. The full OWASP Core Rule Set is not the right tool for a single WordPress site; a handful of rules aimed at the plugins you have installed is. A plugin vulnerability usually has a shape: a parameter that should be a number, a file name that should not contain `../`, an action that should not be reachable without a login. A SecLang rule for that shape blocks the exploit whether or not the plugin is patched.

## The proxy problem WordPress has

Two things break when any reverse proxy lands in front of WordPress, and both are WordPress's assumptions rather than the gateway's fault.

**HTTPS detection.** WordPress decides whether the request is secure by looking at the connection PHP received. Behind a proxy that terminates TLS, PHP sees a plain HTTP connection from the gateway, so WordPress generates `http://` links for a site served over `https://`, and the browser reports mixed content.

CasWAF sends `X-Forwarded-Proto: https`, but WordPress does not read that header by default. The smallest fix is in `wp-config.php`:

```php
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

**Client addresses.** WordPress records the address of the connection, which is now the gateway. CasWAF sends the real one in `X-Real-Ip`; mapping that into `REMOTE_ADDR` in the same file restores correct addresses in comments, logs and security plugins:

```php
if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_X_REAL_IP'];
}
```

Only do this when the gateway is the only way in. If the application is reachable directly as well, the header becomes a way for a client to claim any address it likes, which is worse than the wrong address.

## What the gateway should not do

- **Do not put login protection in front of a public WordPress site.** CasWAF's Casdoor login protects the whole site; visitors would have to sign in to read it. It fits a staging copy, not production.
- **Do not rate limit the whole site at the login form's rate.** A page load pulls dozens of assets, and a busy comment section is legitimate traffic.
- **Do not block `admin-ajax.php` or the REST API** to stop attacks. They are how the editor and many themes work; block the specific parameters instead.

## The order of the rules

The site's rules are checked in order, and the first one that decides wins. For WordPress that suggests:

1. An allow rule for your own addresses, so you can never lock yourself out.
2. A block rule for `xmlrpc.php` if unused.
3. The WAF rules for the plugins you run.
4. A CAPTCHA or rate limit on `wp-login.php`.
5. A whole-site rate limit as the catch-all.

The allow rule first is not paranoia. It is the difference between an afternoon of debugging and a one-line change when a rule turns out to be too broad.

The [IP rules](/en/docs/rules/ip), [rate limiting](/en/docs/rules/rate-limiting) and [WAF rules](/en/docs/rules/waf) pages cover the rule types, and [client IP behind a proxy](/en/docs/operations/client-ip) explains the header handling.