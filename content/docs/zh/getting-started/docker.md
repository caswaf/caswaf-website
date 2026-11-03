---
title: "Docker"
description: "从仓库构建CasWAF镜像，用Docker Compose和MySQL一起运行，并发布网关端口。"
---

仓库里有一个`Dockerfile`和一个`docker-compose.yml`，用旁边的源码构建镜像，并和MySQL一起运行。由于管理界面的Casdoor设置是编译进前端的，要先填好这些设置，再自己构建镜像。

## 1. 设置Casdoor和配置文件

按[快速上手](./quickstart.md)的第2步和第3步做：创建Casdoor应用，然后填写`conf/app.conf`和`web/src/Conf.js`。在`conf/app.conf`里把数据库指向`db`服务：

```ini
dataSourceName = root:123@tcp(db:3306)/
dbName = caswaf
```

## 2. 编辑docker-compose.yml

这个compose文件只发布了管理界面的端口。把网关端口也发布出来，并让MySQL第一次启动时建好`caswaf`数据库，因为CasWAF默认不会建数据库：

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

如果不只是试用，请把两处的MySQL密码都改掉。

## 3. 启动

```bash
docker compose up -d --build
```

打开`http://localhost:17000`并登录。`conf`文件夹挂载进了容器，所以以后改`conf/app.conf`只需要`docker compose restart caswaf`；改`web/src/Conf.js`则要重新构建。

## 说明

- 镜像为`linux/amd64`构建，用Go 1.20和Node.js 18。
- 设置环境变量`RUNNING_IN_DOCKER=true`后，CasWAF会把`dataSourceName`里的`localhost`改写成Docker宿主机（Linux上是`172.17.0.1`，其他系统是`host.docker.internal`），用于MySQL跑在宿主机上而不是在Compose里的情况。
- 在容器里CasWAF只作为网关工作。把自己注册为开机自启和[自我更新](../operations/upgrading.md)需要Windows或systemd服务。
- 仓库的`k8s/`文件夹里有Kubernetes清单，附有单独的README。它们运行关闭了网关的管理界面（`gatewayEnabled = false`），放在你集群的ingress后面。
