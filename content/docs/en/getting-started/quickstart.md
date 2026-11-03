---
title: "Quick start"
description: "Build CasWAF from source, connect it to MySQL and Casdoor, sign in to the console and put the first site behind the gateway."
---

This page builds CasWAF from the `master` branch, runs it on one machine and puts one web application behind it. It takes about fifteen minutes.

## What you need

- [Go](https://go.dev/dl/) 1.20 or newer
- [Node.js](https://nodejs.org) 20 and [Yarn 1](https://classic.yarnpkg.com) for the console
- MySQL 5.7 or 8
- A [Casdoor](https://casdoor.ai) instance to sign in through, and the right to add an application to it
- Ports 80, 443 and 17000 free on the machine

> **Warning:** When it starts, CasWAF stops whatever process is listening on ports 80, 443 and 17000, including an Nginx or Apache you still run. Move them to other ports first and let CasWAF forward to them.

## 1. Get the code

```bash
git clone https://github.com/caswaf/caswaf
cd caswaf
```

## 2. Create the Casdoor application

In Casdoor, add an application for CasWAF and add this redirect URL to it:

```text
http://localhost:17000/callback
```

Note the organization, the application name, the client ID and the client secret. [Sign in with Casdoor](./casdoor.md) explains each setting and who gets in.

## 3. Configure CasWAF

Edit `conf/app.conf`:

```ini
driverName = mysql
dataSourceName = root:your-password@tcp(localhost:3306)/
dbName = caswaf

casdoorEndpoint = https://your-casdoor.example.com
clientId = <client ID>
clientSecret = <client secret>
casdoorOrganization = <organization>
casdoorApplication = <application>
```

The console's own sign-in button reads `web/src/Conf.js`, which is built into the web app, so set the same values there:

```js
export const AuthConfig = {
  serverUrl: "https://your-casdoor.example.com",
  clientId: "<client ID>",
  appName: "<application>",
  organizationName: "<organization>",
  redirectPath: "/callback",
};
```

## 4. Build the console

```bash
cd web
yarn install
yarn build
cd ..
```

## 5. Run

CasWAF creates its tables on start, but not the database. Either create an empty `caswaf` database in MySQL, or pass `-createDatabase=true` the first time:

```bash
go build -o caswaf .
sudo ./caswaf -createDatabase=true
```

On Linux, binding ports 80 and 443 needs root or the `CAP_NET_BIND_SERVICE` capability. Run it from the repository folder: it reads `conf/app.conf` and `web/build` from the working directory.

> **Note:** On Windows, and on Linux when CasWAF runs as a systemd service, CasWAF also registers itself to start again after a reboot: a `<dbName>.bat` under `Desktop\run` with a shortcut in the Startup folder on Windows, a systemd unit on Linux. See [Nodes](../operations/nodes.md).

## 6. Sign in

Open `http://localhost:17000` and sign in through Casdoor. You land on the site list.

## 7. Put a site behind it

Say an application listens on port 3000 on the same machine and should be reached as `app.example.com`.

1. Open **Sites** and click **Add**, then **Edit** on the new row.
2. Set **Domain** to `app.example.com`.
3. Set **Port** to `3000`, or set **Host** to `http://127.0.0.1:3000`.
4. Set **Mode** to `HTTP` until a certificate is in place, and **Status** to `Active`.
5. Click **Save**.

The gateway picks up the change within a few seconds. Try it before DNS points at the machine:

```bash
curl -H "Host: app.example.com" http://127.0.0.1/
```

Then point DNS at the machine, add a certificate ([Certificates](../certificates/certificates.md) or [Let's Encrypt](../certificates/lets-encrypt.md)), switch **Mode** to `HTTPS Only`, and attach some [rules](../rules/rules.md).
