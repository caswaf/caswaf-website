---
title: "规则"
description: "CasWAF的规则如何工作：规则类型，把规则挂到站点上，检查顺序，动作，状态码，以及被拦截的访客看到的原因。"
---

规则决定请求在转发之前如何处理。规则在规则列表里定义一次，就可以挂到任意多个站点上。

## 规则类型

| 类型 | 匹配的对象 | 页面 |
| --- | --- | --- |
| `IP` | 客户端地址、一组地址和地址段，或来自境外的流量 | [IP规则](./ip.md) |
| `User-Agent` | `User-Agent`请求头 | [User-Agent和URL路径](./user-agent-and-path.md) |
| `URL Path` | 路径，不含查询字符串 | [User-Agent和URL路径](./user-agent-and-path.md) |
| `IP Rate Limiting` | 同一地址每秒的请求数 | [限流](./rate-limiting.md) |
| `WAF` | ModSecurity的SecLang规则，由Coraza运行 | [WAF规则](./waf.md) |
| `Compound` | 其他规则，以`and`和`or`组合 | 见下文 |

一条规则包含一个或多个表达式（**Expressions**）。对`IP`、`User-Agent`和`URL Path`来说，任何一个表达式匹配，规则就匹配；要同时满足几个条件，请用组合规则。

## 动作

| 动作 | 结果 | 默认状态码 |
| --- | --- | --- |
| `Block` | CasWAF自己应答`Blocked by CasWAF: <reason>` | `403` |
| `Allow` | 转发请求，并跳过该站点后面的规则 | `200` |
| `CAPTCHA` | 先让访客通过验证码；见[验证码](./captcha.md) | `302` |

**Status code**会替换默认状态码，例如拦截时用`429`，或者用`404`来隐藏这里有东西。`IP Rate Limiting`规则总是拦截，`WAF`规则的动作取自匹配到的那条SecLang规则。

## 原因

请求被拦截时，访客会看到一个原因：

- 规则的**Reason**（如果设置了），例如`Your request is blocked.`
- 否则是`hit rule <owner>/<name>: <what matched>`。

打开**Verbose mode**后，原因里还会写出规则和匹配到的表达式，写规则时很有用。要在某个站点上对访客隐藏这些内容，就在这个站点上打开**Disable verbose**：它被拦截的访客只会看到“the rule has been hit”。

## 把规则挂到站点上

打开站点，在**Rules**下选择规则。它们按列出的顺序检查，排在跳转和[登录保护](../sites/login.md)之后，第一条匹配的规则决定结果。都不匹配时，请求被转发。

按从最具体到最笼统的顺序排列。一种常见的配置：

1. 一条动作为`Allow`的`IP`规则，放行办公室和监控的地址，这样后面的规则都不会把它们挡在外面。
2. 一条拦截已知恶意爬虫的`User-Agent`规则。
3. 一条`IP Rate Limiting`规则。
4. `WAF`规则。

对规则和站点规则列表的修改几秒内生效。先添加并保存规则，再把它挂到站点上；删除规则之前，先把它从所有站点上摘下：如果站点列出了一条不存在的规则，它对每个请求都返回错误。

## 组合规则

`Compound`规则在其他规则的某种组合匹配时匹配，然后执行它自己的动作。每个表达式指定一条规则，写成`<owner>/<name>`，第一个表达式的**Logic**为`begin`，之后为`and`或`or`。被引用的规则只算匹配或不匹配，它们自己的动作会被忽略。

`and`的优先级高于`or`，所以`A and B or C and D`表示`(A and B) or (C and D)`。例如，要让打开登录页的境外访客先通过验证码：

1. 一条`IP`规则`admin/abroad`，运算符`is abroad`。
2. 一条`URL Path`规则`admin/login-page`，运算符`match`，值`^/login`。
3. 一条`Compound`规则，表达式为`begin admin/abroad`和`and admin/login-page`，动作`CAPTCHA`。只把这一条挂到站点上。

组合规则可以引用其他组合规则，最多八层。最终引用到自己的组合规则会返回错误，而不会陷入循环。
