---
title: "Sign in with Casdoor"
description: "The CasWAF console signs in through a Casdoor application: the settings it needs on both sides, the redirect URLs, and who can sign in."
---

CasWAF has no accounts of its own. The console signs people in through [Casdoor](https://casdoor.ai), and the same Casdoor connection backs [login protection](../sites/login.md), [CAPTCHA](../rules/captcha.md) and [health alerts](../sites/alerts.md). Casdoor is open source and can run next to CasWAF, or behind it as one of its sites.

## In Casdoor

1. Pick or create the organization the CasWAF administrators belong to.
2. Add an application in that organization.
3. Under **Redirect URLs**, add the console's callback, for each address you open the console at:

   ```text
   http://localhost:17000/callback
   https://waf.example.com/callback
   ```

4. Note the client ID and client secret.

## In CasWAF

The backend reads these keys from `conf/app.conf`:

| Key | Value |
| --- | --- |
| `casdoorEndpoint` | Casdoor's address, such as `https://door.example.com` |
| `clientId`, `clientSecret` | The application's client ID and secret |
| `casdoorOrganization` | The organization |
| `casdoorApplication` | The application name |

The sign-in button in the browser reads `web/src/Conf.js`, which is compiled into `web/build`. Set the same endpoint, client ID, application and organization there and rebuild the console with `yarn build`:

```js
export const AuthConfig = {
  serverUrl: "https://door.example.com",
  clientId: "<client ID>",
  appName: "<application>",
  organizationName: "<organization>",
  redirectPath: "/callback",
};
```

## Who can sign in

Everyone who can sign in to the Casdoor application can manage every site, certificate and rule in CasWAF; there are no read-only roles yet. Keep the application to the people who run CasWAF: put it in an organization of its own, and turn off sign-up on the application.

A session lasts a year. Sessions are kept as files in `tmp/` next to the program, or in Redis when `redisEndpoint` is set, which lets several console instances share them.

## Read-only demo mode

With `isDemoMode = true` in `conf/app.conf`, CasWAF refuses every change made through the API except signing in and out. Set `IsDemoMode` in `web/src/Conf.js` too, so the console tells visitors it is a read-only demo.
