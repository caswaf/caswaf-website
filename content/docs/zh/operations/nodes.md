---
title: "节点"
description: "在多台机器上用同一个数据库运行CasWAF：哪些是共享的，哪些由每个网关自己保存，以及与升级有关的节点设置。"
---

任意多台机器都可以用相同的数据库设置运行CasWAF。每一台都是完整的网关：服务所有站点，使用所有证书，检查所有规则，所以你可以把DNS指向所有机器，把它们放在负载均衡后面，或者每个地区用一台。管理界面可以在其中任何一台上运行。

## 哪些共享，哪些不共享

| 通过数据库共享 | 每个网关自己保存 |
| --- | --- |
| 站点、证书、规则、节点、设置 | [限流](../rules/rate-limiting.md)计数 |
| 请求记录，来自所有网关 | 已通过的[验证码](../rules/captcha.md) |
| | [健康告警](../sites/alerts.md)检查，所以每个节点各自告警 |

每个网关每隔几秒从数据库重新加载站点和规则，所以在管理界面里做的修改不用重启就能到达每个节点。

[Let's Encrypt](../certificates/lets-encrypt.md)证书对每个站点只由一个网关申请，即站点**Tag**里写的那个；证书进入数据库后，其他网关就使用它。

## 节点列表

**Nodes**页面上每台网关机器一个条目。不管有没有条目，网关都会处理流量；条目只保存这台机器的设置。

| 字段 | 含义 |
| --- | --- |
| **Name** | 机器的主机名，必须完全一致 |
| **Upgrade mode** | 这台机器什么时候可以更新：`At Any Time`、`Half A Hour`（只在UTC+8的23:00到23:30之间）或`No Upgrade` |
| **Self update** | 让这台机器上的CasWAF从Git自动更新；见[升级](./upgrading.md) |
| **Run mode** | `Go Run`或`Binary`，用于部署Casbin自己的应用 |
| **Tag**、**Display name**、**Client IP** | 给你自己看的备注 |

以`admin`账号登录时再创建节点条目：CasWAF按`admin/<hostname>`查找自己的条目。

## 随机器启动

在Windows上，以及在Linux上CasWAF作为systemd服务运行时，CasWAF会确保机器重启后自己再次启动，所用的名字是`dbName`：

- **Windows**：它写入`Desktop\run\<dbName>.bat`，这个文件在`<appDir>\<dbName>`里运行`go run main.go`，并在“启动”文件夹里放一个指向它的快捷方式。
- **Linux**：它期望以`caswaf-site-<dbName>.service`这个unit运行；如果unit文件不存在，就写入并启用它，在`<appDir>/<dbName>`里运行`go run main.go`。

所以要把仓库放在`<appDir>/<dbName>`。在Linux上，如果`appDir = /opt`、仓库在`/opt/caswaf`，可以自己写unit来运行构建好的程序，CasWAF就不会去动它：

```ini
# /etc/systemd/system/caswaf-site-caswaf.service
[Unit]
Description=CasWAF
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/caswaf
ExecStart=/opt/caswaf/caswaf
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now caswaf-site-caswaf
```

主机名里恰好有两个`-`的机器不做这些，也不做[自动更新](./upgrading.md)。

## 一台机器上运行多个CasWAF

CasWAF启动时会停掉监听它端口的任何进程（`httpport`，开启网关时还有`gatewayHttpPort`和`gatewayHttpsPort`）。一台机器上的两个实例要在各自的`conf/app.conf`里用不同的端口，而且只有一个能在80和443上运行网关。

CasWAF崩溃后也会自己重启，五分钟内最多五次。
