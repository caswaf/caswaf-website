---
title: "站点"
description: "一个站点就是CasWAF后面的一个Web应用：它的域名、请求转发到哪里、以什么方式提供，以及状态的作用。"
---

一个站点就是网关后面的一个Web应用。每个请求按域名匹配到站点，站点决定请求转发到哪里、途中检查什么。

## 域名

| 字段 | 作用 |
| --- | --- |
| **Domain** | 主域名，例如`app.example.com` |
| **Other domains** | 同一个站点还提供的其他域名，例如`example.com`或`app.example.net` |
| **Need redirect**、**Redirect with slash** | 把其他域名跳转到主域名；见[跳转](./redirects.md) |

匹配时忽略大小写、端口和开头的`www.`，所以`www.app.example.com:443`能匹配域名为`app.example.com`的站点。请求的域名没有任何站点时，返回`500`和`CasWAF error: site not found for host`；`Host`是纯IP地址的请求返回`400`。

## 请求转发到哪里

CasWAF按以下顺序选择上游：

| 字段 | 何时使用 | 示例 |
| --- | --- | --- |
| **Hosts** | 有条目时；每个请求随机选一个 | `http://10.0.0.11:8080`、`http://10.0.0.12:8080` |
| **Host** | **Hosts**为空时 | `http://127.0.0.1:3000`、`https://backend.internal` |
| **Port** | 两者都为空时 | `3000`表示`http://localhost:3000` |

原始的`Host`请求头原样传给上游，CasWAF另外加上`X-Real-Ip`（客户端地址）和`X-Forwarded-Proto`（`http`或`https`）。`X-Forwarded-For`见[代理后面的客户端IP](../operations/client-ip.md)。

在**Hosts**之间就是简单的随机选择：没有权重，挂掉的上游也不会被移出轮换。

## 提供文件夹

把**Mode**设为`Static Folder`，把**Host**设为网关机器上的一个文件夹，例如`/var/www/site`，CasWAF就直接提供其中的文件。`/`返回`index.htm`或`index.html`。其他模式`HTTP`、`HTTPS and HTTP`和`HTTPS Only`见[HTTPS](./https.md)。

## 状态

| 状态 | 效果 |
| --- | --- |
| `Active` | 正常提供 |
| `Inactive` | 网关仍然提供，但[健康告警](./alerts.md)会跳过它 |
| `Stopped` | 所有请求都返回`503`和一个说明服务已停止的页面 |

要让站点下线，设为`Stopped`；要移除站点，删除它即可。

## 其他字段

| 字段 | 作用 |
| --- | --- |
| **Name**、**Display name** | 站点的ID是`<owner>/<name>`；所有者是创建它的账号 |
| **Tag** | 自由文本；站点列表按它排序 |
| **Rules** | 每个请求要检查的[规则](../rules/rules.md)，按顺序 |
| **Disable verbose** | 被规则拦下的访客只看到“the rule has been hit”，看不到规则的原因 |
| **Casdoor app** | 要求访客先登录；见[登录保护](./login.md) |
| **Challenges** | `/.well-known/acme-challenge/<token>`和`/MP_verify_*`文件的应答，写成`token:answer`；为[Let's Encrypt](../certificates/lets-encrypt.md)申请证书时CasWAF会自己填 |
| **Public IP** | 从DNS填入：主域名解析到的第一个IPv4地址 |
| **SSL cert** | 只读：站点域名匹配到的证书 |
| **Node** | 第一个提供这个站点的网关 |
| **Nodes** | 用于CasWAF从Git部署应用，目前只用于Casbin自己的项目（见[路线图](../more/roadmap.md)）；留空即可 |
| **Enable alert**及其后的字段 | [健康告警](./alerts.md) |

保存后几秒内，所有网关都会生效。
