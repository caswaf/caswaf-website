---
title: "常见问题"
description: "关于CasWAF的常见问题：替代Nginx、WebSocket、HTTP/2、数据库、Casdoor、操作系统、日志和错误。"
---

## CasWAF能替代Nginx吗？

如果是给很多站点做反向代理，带HTTPS、跳转和访问规则，可以：这正是它的用途。它也能提供一个目录里的静态文件。它不做缓存、压缩、URL重写，也不代理TCP流；需要这些的应用，就让Nginx在CasWAF后面的另一个端口上继续运行。

## 支持WebSocket和HTTP/2吗？

支持。WebSocket升级会透传给应用，客户端支持时，HTTPS连接使用HTTP/2。到应用的连接是HTTP/1.1。

## 必须用Casdoor吗？

是的，管理界面只能通过Casdoor登录。Casdoor是开源的，很快就能跑起来；它甚至可以是CasWAF后面的站点之一。只有CasWAF在Casdoor里所在组织的管理员才能管理CasWAF；见[用Casdoor登录](../getting-started/casdoor.md)。

## 能用哪些数据库？

CasWAF是在MySQL上开发和运行的。数据库层XORM也内置了PostgreSQL、SQL Server和SQLite的驱动，但[仪表盘](../monitoring/dashboard.md)需要MySQL。

## 支持哪些操作系统？

网关和管理界面在能运行Go的地方都能运行。随机器启动和[自动更新](../operations/upgrading.md)需要Windows，或者带systemd的Linux。

## 日志在哪里？

CasWAF打印到标准输出：每个请求、规则错误、证书申请尝试和自动更新的各个步骤。在systemd下用`journalctl -u caswaf-site-caswaf`查看。请求还会写进[记录表](../monitoring/records.md)。

## 这些错误是什么意思？

| 响应 | 原因 |
| --- | --- |
| `CasWAF error: site not found for host` | 没有站点使用这个域名，这个域名也不在任何站点的**Other domains**里 |
| `400`，响应体为空 | 请求发到了IP地址，而不是域名 |
| `503`，显示“stopped”页面 | 站点的状态是`Stopped` |
| `Blocked by CasWAF: ...` | 请求被规则拦截；冒号后面的文字是原因 |
| TLS握手错误 | 没有证书匹配这个域名；见[HTTPS](../sites/https.md) |
| `rule not found` | 站点列出了一条已删除的规则；把它从站点上移除 |

## 为什么CasWAF启动后我的Nginx停了？

CasWAF启动时会停掉监听它端口的任何程序。先把另一个服务器挪到别的端口；见[快速开始](../getting-started/quickstart.md)。
