---
title: "介绍"
description: "CasWAF是什么：一个Go程序同时做反向代理和Web应用防火墙，在网页管理界面里管理，站点、证书和规则保存在数据库里。"
---

CasWAF是一个Go程序，同时是反向代理和Web应用防火墙（WAF）。把它放在原来Nginx的位置，即你的Web应用前面，然后在浏览器里管理：添加一个站点，填上域名和应用的地址，挂上证书和一些规则，保存即可。不用改配置文件，也不用重新加载。

## 包含什么

- **网关**，监听端口80和443。它按请求的`Host`找到站点，用匹配的证书提供HTTPS，再把请求转发给应用。
- **规则**，在请求转发前检查：IP地址和地址段、境外流量、User-Agent、URL路径、按IP限流，以及由[Coraza](https://coraza.io)执行的ModSecurity规则。规则的结果是放行、拦截或让访客先过验证码。
- **证书**：手动添加，或由Let's Encrypt签发和续期。
- **登录保护**：站点可以要求访客先通过[Casdoor](https://casdoor.ai)登录，才能访问。
- **请求记录**和仪表盘：随时间变化的请求数，请求最多的站点、IP和User-Agent。
- **健康告警**：站点不再响应时通过邮件或短信通知。
- **网页管理界面**，在端口17000上，通过Casdoor登录，支持九种语言。

## 一个请求怎样经过它

1. 请求到达端口80或443。如果是HTTPS，按客户端请求的服务器名选择证书。
2. CasWAF记录这个请求：时间、方法、主机名、路径、客户端IP和User-Agent。
3. 找到域名或其他域名之一与`Host`匹配的站点。匹配前先去掉`www.`前缀。
4. 执行跳转：其他域名跳到主域名，`www.`跳到不带`www.`的域名，HTTP跳到HTTPS。
5. 如果站点设置了Casdoor应用，没有有效登录的访客会被送去登录。
6. 按顺序检查站点的规则。第一条匹配的规则决定结果：放行、拦截或验证码。
7. 把请求转发给应用，或者从文件夹里返回文件。

## 组成部分

| 部分 | 说明 |
| --- | --- |
| 网关 | 监听80和443（`gatewayHttpPort`、`gatewayHttpsPort`） |
| 管理界面和API | 监听17000（`httpport`）；React前端从`web/build`提供 |
| 数据库 | 默认MySQL；表`site`、`cert`、`rule`、`record`、`node`和`setting` |
| Casdoor | 负责管理界面的登录，并支撑登录保护、验证码和告警 |

多台机器可以连同一个数据库运行CasWAF。每台都服务所有站点，所以DNS可以指向其中任意一台。见[节点](../operations/nodes.md)。

## 源码和许可证

CasWAF的源码在[github.com/caswaf/caswaf](https://github.com/caswaf/caswaf)，使用Apache-2.0许可证。后端是Go，用Beego和XORM；管理界面是React，用Ant Design。
