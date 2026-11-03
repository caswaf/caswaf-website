---
title: "User-Agent和URL路径规则"
description: "按User-Agent请求头或URL路径匹配请求，支持精确比较、子串比较和正则表达式比较。"
---

`User-Agent`规则看`User-Agent`请求头，`URL Path`规则看请求的路径，例如`/admin/login`，不含查询字符串。

## 运算符

两种类型使用相同的运算符。比较区分大小写。

| 运算符 | 何时匹配：请求头或路径 |
| --- | --- |
| `equals` | 和值完全相同 |
| `does not equal` | 是其他任何内容 |
| `contains` | 包含该值 |
| `does not contain` | 不包含该值 |
| `match` | 匹配以该值为模式的正则表达式（[Go语法](https://pkg.go.dev/regexp/syntax)），除非用`^`和`$`锚定，否则可以出现在任意位置 |

任何一个表达式匹配，规则就匹配，所以一条规则可以列出好几个爬虫或好几个路径。

## 示例

**拦截恶意爬虫。** 类型`User-Agent`，运算符`match`，值`(?i)(ahrefsbot|semrushbot|mj12bot)`，动作`Block`。

**拒绝不发送User-Agent的客户端。** 类型`User-Agent`，运算符`equals`，值留空，动作`Block`。

**隐藏管理后台。** 类型`URL Path`，运算符`match`，值`^/(admin|wp-admin)(/|$)`，动作`Block`，状态码`404`。在它前面放一条针对你自己地址的`IP`放行规则，你自己就还能继续使用。

**拦截对绝不应该对外提供的文件的探测。** 类型`URL Path`，运算符`match`，值`\.(env|git|bak|sql)$|/\.git/`，动作`Block`。

要按查询字符串或其他请求头匹配，请用[WAF规则](./waf.md)。
