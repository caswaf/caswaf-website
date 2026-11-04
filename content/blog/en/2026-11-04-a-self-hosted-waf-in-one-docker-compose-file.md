---
title: "A self-hosted WAF in one Docker Compose file"
description: "Two services, a mounted config folder and three published ports. What the compose file actually contains, why the image is built rather than pulled, and the two edits that trip people up."
---

The shortest way to try a self-hosted gateway is a compose file with two services: the gateway, and the MySQL it keeps its settings in. The repository ships both the `Dockerfile` and the `docker-compose.yml`, so the whole thing is a checkout and one command.

There is a catch worth knowing before you start: the image is built from source, not pulled from a registry, and that is deliberate.

## Why build instead of pull

The console's sign-in goes through Casdoor, and the settings for it, the endpoint, client ID, application and organization, are compiled into the web app at build time. They live in `web/src/Conf.js`, not in the database.

That means an image tagged `latest` would carry someone else's Casdoor settings. Building your own after filling in those values is the only way the console's login button points at your Casdoor. The gateway half reads the same values from `conf/app.conf`, which is mounted rather than built in.

## The compose file

Two services. The `db` one is stock MySQL, with `MYSQL_DATABASE: caswaf` so the database exists on first start, because CasWAF creates its tables but not the database. The `caswaf` one builds from the repository and waits for MySQL to accept connections:

```yaml
services:
  caswaf:
    build:
      context: ./
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
      - "17000:17000"
    depends_on:
      - db
    command: ["./wait-for-it", "db:3306", "--", "./server"]
    volumes:
      - ./conf:/conf/
  db:
    restart: always
    image: mysql:8.0.25
    environment:
      MYSQL_ROOT_PASSWORD: 123
      MYSQL_DATABASE: caswaf
    volumes:
      - /usr/local/docker/mysql:/var/lib/mysql
```

Two things in there are not defaults.

**The ports.** The repository's file publishes only the console port, 17000. A gateway that cannot accept traffic on 80 and 443 is a console with nothing behind it, so add both.

**The database host.** `conf/app.conf` points at the Compose service name, not localhost:

```ini
dataSourceName = root:123@tcp(db:3306)/
dbName = caswaf
```

Inside the container, `localhost` is the container. If MySQL runs on the host instead of in Compose there is a way out: set `RUNNING_IN_DOCKER=true`, and CasWAF rewrites `localhost` in the data source name to the Docker host.

## What restarts and what needs a rebuild

The `conf` folder is mounted, so editing `conf/app.conf` is a `docker compose restart caswaf`. Editing `web/src/Conf.js` is not: it is compiled into the static files the image serves, so it needs `docker compose up -d --build`.

That split is the most common source of "I changed the client ID and the login page still points at the old Casdoor".

## What runs inside the container

A gateway only. Registering itself for autostart after a reboot and updating itself from Git both need a Windows session or a systemd unit, and a container has neither. If you want the self-update behaviour, run the binary on the host and keep the container for the database.

For Kubernetes, the repository has a `k8s/` folder with its own manifests. Those run the console with the gateway turned off and let the cluster's ingress handle traffic, which is the right shape there: one console, and the ingress doing the work.

## Trying it without DNS

The gateway routes on the `Host` header, so a site can be tested before DNS exists:

```bash
curl -H "Host: app.example.com" http://127.0.0.1/
```

If that returns the application, the site and the upstream are wired correctly, and the remaining work is DNS and a certificate.

The [Docker](/en/docs/getting-started/docker) page has the full steps, and [quick start](/en/docs/getting-started/quickstart) covers the Casdoor application you need first.