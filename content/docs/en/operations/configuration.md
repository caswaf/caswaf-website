---
title: "Configuration"
description: "Every key in CasWAF's conf/app.conf, which ones can be set from environment variables, and the settings kept in the database."
---

CasWAF reads `conf/app.conf` from its working directory when it starts; restart it after a change. Sites, certificates, rules and nodes are not in this file: they are in the database and are changed in the console.

## Server

| Key | Default | Meaning |
| --- | --- | --- |
| `appname` | `caswaf` | Name of the program |
| `httpport` | `17000` | Port of the console and the API |
| `runmode` | `dev` | Beego's run mode |
| `SessionOn`, `copyrequestbody` | `true` | Beego settings that CasWAF needs; leave them on |
| `redisEndpoint` | empty | Keep console sessions in Redis (`host:port`) instead of files in `tmp/` |
| `language` | `en` | Language of the names CasWAF gives its own Windows shortcuts |

## Database

| Key | Default | Meaning |
| --- | --- | --- |
| `driverName` | `mysql` | `mysql`, `postgres`, `mssql` or `sqlite` |
| `dataSourceName` | `root:123@tcp(localhost:3306)/` | Connection string, without the database name |
| `dbName` | `caswaf` | Database name; also the name CasWAF registers itself under for autostart |
| `tableNamePrefix` | empty | Prefix for the table names |
| `showSql` | `false` | Print every SQL statement |

The database must exist unless CasWAF is started with `-createDatabase=true`. The tables are created and updated on every start.

## Gateway

| Key | Default | Meaning |
| --- | --- | --- |
| `gatewayEnabled` | `true` | Run the gateway; `false` runs only the console and API |
| `gatewayHttpPort` | `80` | Plain HTTP port |
| `gatewayHttpsPort` | `443` | HTTPS port |
| `trustedProxies` | private ranges | Proxies whose `X-Forwarded-For` is believed; see [Client IP behind a proxy](./client-ip.md) |

## Casdoor

| Key | Meaning |
| --- | --- |
| `casdoorEndpoint` | Casdoor's address |
| `clientId`, `clientSecret` | CasWAF's application in Casdoor |
| `casdoorOrganization`, `casdoorApplication` | Its organization and name |
| `isDemoMode` | `true` refuses every change through the API |

See [Sign in with Casdoor](../getting-started/casdoor.md); the console's own sign-in settings are in `web/src/Conf.js`.

## Certificates

| Key | Meaning |
| --- | --- |
| `acmeEmail`, `acmePrivateKey` | The Let's Encrypt account; see [Let's Encrypt](../certificates/lets-encrypt.md) |
| `httpProxy` | A SOCKS5 proxy, `host:port`, for looking up domain expiry dates; skipped when it cannot be reached |

## Deployment of Casbin's own applications

`appDir`, `appMap`, `dbRegionId`, `dbAccessKeyId`, `dbAccessKeySecret`, `dbInstanceId`, `dbHost`, `dbUser`, `dbPass`, `clientIdPrefix` and `clientSecretPrefix` belong to the code that deploys Casbin's own applications onto gateway nodes; see the [roadmap](../more/roadmap.md). Of these, only `appDir` matters otherwise: [self-update](./upgrading.md#self-update) builds CasWAF's new program under `<appDir>/_bin/`.

## Environment variables

These keys can be overridden by an environment variable of the same name, which is handy in containers: `driverName`, `dataSourceName`, `dbName`, `tableNamePrefix`, `showSql`, `trustedProxies`, `isDemoMode`, `httpport` and `appname`. The rest are read from the file only.

| Variable | Effect |
| --- | --- |
| `RUNNING_IN_DOCKER=true` | Replace `localhost` in `dataSourceName` with the Docker host |

## Settings in the database

The **Settings** page holds the settings that can change while CasWAF runs. Today that is **Record retention days**; see [Request records](../monitoring/records.md#how-long-records-are-kept).
