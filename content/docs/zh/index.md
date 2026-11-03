---
title: "CasWAF文档"
description: "CasWAF的使用手册。CasWAF是用Go编写的开源反向代理和Web应用防火墙，本手册包括安装、通过Casdoor登录、站点、HTTPS和证书、规则、请求记录、仪表盘以及运行多个网关节点。"
---

CasWAF是一个用Go编写的开源反向代理和Web应用防火墙（WAF）。它代替Nginx放在你的Web应用前面：监听端口80和443，按请求的域名找到站点，终结HTTPS，用你的规则检查每个请求，再转发给应用。所有设置都在网页管理界面里完成，不用改配置文件；设置保存在数据库里，多个网关节点可以共用。

## 入门

- [介绍](./getting-started/introduction.md)：CasWAF做什么，一个请求怎样经过它
- [快速上手](./getting-started/quickstart.md)：编译、运行，并把第一个站点放到它后面
- [用Casdoor登录](./getting-started/casdoor.md)：管理界面登录所用的Casdoor应用
- [Docker](./getting-started/docker.md)：用Docker Compose构建并运行镜像

## 站点

- [站点](./sites/sites.md)：域名、请求转发到哪里，以及站点状态
- [HTTPS](./sites/https.md)：SSL模式、怎样选证书，以及CasWAF添加的响应头
- [跳转](./sites/redirects.md)：其他域名、`www.`和末尾斜杠
- [登录保护](./sites/login.md)：只让已登录Casdoor的用户访问站点
- [健康告警](./sites/alerts.md)：站点不再响应时发邮件或短信

## 证书

- [证书](./certificates/certificates.md)：添加证书，以及证书怎样和域名匹配
- [Let's Encrypt](./certificates/lets-encrypt.md)：自动签发和续期的证书

## 规则

- [规则](./rules/rules.md)：规则怎样挂到站点上、按什么顺序检查，以及每种动作的效果
- [IP规则](./rules/ip.md)：地址、地址段和境外流量
- [User-Agent和URL路径规则](./rules/user-agent-and-path.md)：按客户端或路径匹配
- [限流](./rules/rate-limiting.md)：每个IP每秒的请求数，以及地址被封多久
- [WAF规则](./rules/waf.md)：由Coraza执行的ModSecurity SecLang规则
- [验证码](./rules/captcha.md)：让访客先过验证码，而不是直接拦截

## 监控

- [请求记录](./monitoring/records.md)：网关收到的每个请求，以及保留多久
- [仪表盘](./monitoring/dashboard.md)：随时间变化的请求数，请求最多的站点、IP和User-Agent

## 运维

- [配置](./operations/configuration.md)：`conf/app.conf`里的每一项和环境变量
- [代理后面的客户端IP](./operations/client-ip.md)：可信代理和`X-Forwarded-For`
- [节点](./operations/nodes.md)：多个网关共用一个数据库
- [升级](./operations/upgrading.md)：手动更新和自我更新

## 更多

- [路线图](./more/roadmap.md)：接下来要做的功能
- [对比](./more/comparison.md)：CasWAF和Nginx、Caddy、Nginx Proxy Manager、BunkerWeb、雷池（SafeLine）的对比
- [常见问题](./more/faq.md)
