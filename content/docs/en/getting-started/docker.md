---
title: "Docker"
description: "Build the CasWAF image from the repository and run it with MySQL using Docker Compose, with the gateway ports published."
---

The repository has a `Dockerfile` and a `docker-compose.yml` that build the image from the source next to them and run it with MySQL. Because the console's Casdoor settings are compiled into the web app, build the image yourself after setting them.

## 1. Set up Casdoor and the configuration

Follow steps 2 and 3 of the [Quick start](./quickstart.md): create the Casdoor application, then fill in `conf/app.conf` and `web/src/Conf.js`. In `conf/app.conf`, point the database at the `db` service:

```ini
dataSourceName = root:123@tcp(db:3306)/
dbName = caswaf
```

## 2. Edit docker-compose.yml

The compose file publishes only the console port. Publish the gateway ports as well, and have MySQL create the `caswaf` database on its first start, since CasWAF does not create it unless asked:

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

Change the MySQL password in both places for anything beyond a trial.

## 3. Start

```bash
docker compose up -d --build
```

Open `http://localhost:17000` and sign in. The `conf` folder is mounted into the container, so later changes to `conf/app.conf` need only `docker compose restart caswaf`; changes to `web/src/Conf.js` need a rebuild.

## Notes

- The image is built for `linux/amd64` with Go 1.20 and Node.js 18.
- With the environment variable `RUNNING_IN_DOCKER=true`, CasWAF rewrites `localhost` in `dataSourceName` to the Docker host (`172.17.0.1` on Linux, `host.docker.internal` elsewhere), for a MySQL that runs on the host instead of in Compose.
- Inside a container CasWAF works as a gateway only. Registering itself for autostart and [self-update](../operations/upgrading.md) need Windows or a systemd service.
- The repository's `k8s/` folder has Kubernetes manifests with their own README. They run the console with the gateway turned off (`gatewayEnabled = false`), behind your cluster's ingress.
