---
title: "对比"
description: "CasWAF与Nginx、Caddy、Nginx Proxy Manager、BunkerWeb和SafeLine的比较：各自怎么配置，有什么防护，许可证，以及什么时候选哪个。"
---

CasWAF和反向代理处在同一个位置，并承担了Web应用防火墙的一部分工作。这一页把它和人们通常拿来比较的工具放在一起。其他工具也在变化，做决定前请查看它们自己的文档。

一次只和一个工具比、写得更细的页面：[SafeLine（雷池）](/zh/compare/safeline)、[ModSecurity](/zh/compare/modsecurity)、[BunkerWeb](/zh/compare/bunkerweb)、[Nginx](/zh/compare/nginx)。

## 一览

| | 配置方式 | WAF | HTTPS证书 | 许可证 |
| --- | --- | --- | --- | --- |
| **CasWAF** | 网页管理界面，设置存在数据库里 | IP、User-Agent、路径和频率规则；基于Coraza的ModSecurity规则；验证码 | 手动，或按域名用Let's Encrypt | Apache-2.0 |
| **Nginx** | 配置文件 | 通过ModSecurity等模块 | 手动或用Certbot | BSD-2-Clause |
| **Caddy** | Caddyfile或JSON API | 通过Coraza等插件 | 自动 | Apache-2.0 |
| **Nginx Proxy Manager** | 基于Nginx的网页界面 | 只有访问列表 | Let's Encrypt | MIT |
| **BunkerWeb** | 环境变量设置或网页界面，基于Nginx | 带OWASP Core Rule Set的ModSecurity、按不良行为封禁、反机器人 | Let's Encrypt | AGPL-3.0，另有付费版 |
| **SafeLine（雷池）** | 网页界面 | 自己的语义检测引擎 | Let's Encrypt | 开放部分为GPL-3.0，另有付费版 |

## CasWAF不一样的地方

- **一个Go程序。** 网关、规则和管理界面是同一个程序，底下没有Nginx、Lua或单独的检测服务。它能在Linux和Windows上运行。
- **设置存在数据库里，而不是文件里。** 每个网关节点读取同样的站点、证书和规则，在管理界面里做的修改几秒内就到达所有节点，不需要套模板、复制或重新加载。
- **内置单点登录。** 管理界面通过Casdoor登录，所以多因素认证、LDAP、SAML和第三方登录都随之而来，而且任何站点都可以放在Casdoor登录后面，不用改应用。
- **全部是Apache-2.0。** 没有保留了部分功能的付费版。

## 其他工具领先的地方

- **Nginx**更快，二十年来到处都在跑，作为Web服务器能做的事多得多：缓存、压缩、对缓冲和超时的精细控制，以及stream代理。
- **Caddy**让HTTPS完全自动化，包括通配符证书，还有庞大的插件生态。
- **Nginx Proxy Manager**是用界面给家里或小办公室的几个服务加上HTTPS的最简单办法。
- **BunkerWeb**自带OWASP Core Rule Set，并默认开启很多防护，CasWAF没有这些。
- **SafeLine**通过解析SQL、JavaScript和shell语法来检测攻击，而不是匹配模式，它的报告界面也很成熟。

## 选哪个

- 你在多台服务器上管理很多站点，想把它们放在一个带单点登录的管理界面里：**CasWAF**。
- 你已经在用Casdoor，或者想把内部工具放在公司登录后面而不改它们：**CasWAF**。
- 你需要最高的吞吐量，或者反向代理以外的功能：**Nginx**，想少写配置就用**Caddy**。
- 你现在就需要开箱即用的广泛攻击防护：**BunkerWeb**或**SafeLine**，或者Nginx、Caddy加上Coraza和Core Rule Set。

CasWAF也可以放在它们中任何一个的前面或后面，例如让Nginx继续在另一个端口上服务某个应用。
