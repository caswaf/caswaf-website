---
title: "健康告警"
description: "让CasWAF按固定间隔请求站点，在站点不再响应时通过Casdoor发送邮件或短信。"
---

CasWAF可以从外部监视站点：按固定间隔请求站点的域名，连续失败几次后，通过Casdoor的provider用邮件或短信发出告警。

## 设置

1. 在Casdoor里，在CasWAF所在的组织中，确认有邮件provider或短信provider，并且站点的所有者（在CasWAF里创建这个站点的账号）有邮箱地址或手机号。
2. 在CasWAF里打开站点，打开**Enable alert**。
3. 设置**Alert interval**，单位为秒（默认60），以及**Alert try times**，即连续失败多少次后发告警（默认3）。
4. 在**Alert providers**下选一个或多个provider。邮件provider发到所有者的邮箱，短信provider发到所有者的手机。
5. 保存。

## 检查什么

- 站点的主域名：`HTTPS Only`用HTTPS，`HTTP`用HTTP，`HTTPS and HTTP`两种都查，其中任一种响应即可。
- 跟随跳转后，5秒内得到`2xx`响应就算通过。
- `Inactive`或`Stopped`的站点不检查。
- `Static Folder`站点和`HTTPS and HTTP`站点一样检查。

## 什么时候发告警

连续失败次数达到**Alert try times**时，发出一条告警，包含域名和错误。同一次故障不会再发更多告警；检查重新通过后计数清零。站点恢复时不发消息。

每个网关节点都会执行检查，所以有多个[节点](../operations/nodes.md)时，每个节点都会各发一条告警。
