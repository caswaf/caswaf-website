---
title: "WAF规则"
description: "为CasWAF编写ModSecurity的SecLang规则，由Coraza引擎运行：规则能看到什么，哪些动作有效，以及SQL注入、XSS和扫描器的示例。"
---

`WAF`规则包含用ModSecurity的SecLang语言写的规则，和ModSecurity以及OWASP Core Rule Set用的是同一种语言，由Go写的WAF引擎[Coraza](https://coraza.io)运行。较简单的规则类型表达不了的东西用它来写：查询字符串、请求体、Cookie、任意请求头，以及Coraza的SQL注入和XSS检测器。

## 编写

1. 添加一条规则，把**Type**设为`WAF`。没有**Action**可选，动作来自SecLang规则。
2. 在表达式里写一条或多条`SecRule`指令。各个表达式按原样拼接，所以要么把整套规则放在一个表达式里，要么在每个表达式末尾加一个换行。
3. 保存。CasWAF会检查语法，无法解析的规则集会被拒绝。

每条`SecRule`要有自己的`id`，`phase`为`1`（请求头）或`2`。不要使用200000到200099这个范围的ID：它们属于CasWAF内置的基础配置`conf/waf.conf`，这个范围内的匹配会被忽略。

## 哪些动作有效

Coraza以检测模式运行，由CasWAF决定如何处理它报告的结果。规则匹配时，它的中断性动作就成为CasWAF的动作：

| SecLang动作 | CasWAF动作 | 默认状态码 |
| --- | --- | --- |
| `deny`、`block` | Block | `403` |
| `drop` | Drop：以`Dropped by CasWAF`拒绝 | `400` |
| `allow` | Allow：转发，并跳过该站点后面的规则 | |
| `pass`和其他动作 | 不起作用 | |

显示的原因是`blocked by WAF rule: <id>`。SecLang的`status:`动作不会被使用；请改为设置规则的**Status code**。

## 规则能看到什么

整个请求：方法、路径、查询字符串及其参数（`ARGS`、`ARGS_GET`、`REQUEST_URI`、`QUERY_STRING`）、`REQUEST_HEADERS`、`REQUEST_COOKIES`，以及最多12.5MB的请求体（`REQUEST_BODY`，表单还有`ARGS_POST`）。JSON和XML请求体按内容类型解析，所以它们的字段也在`ARGS`里。请求体会原样传给应用。

基础配置自己的规则，例如针对无法解析的请求体的那条，不参与决定：只有你写的规则会拦截或放行。

对每个到达这条规则的请求，CasWAF都会重新构建一次规则集，规则只有几条时，耗时远不到1毫秒。WAF规则要写得短而具体：完整的OWASP Core Rule Set没有内置，而且太大，不能以这种方式运行。

## 示例

用Coraza的libinjection检测器检测任意参数里的SQL注入，参数来自查询字符串或请求体都可以：

```text
SecRule ARGS "@detectSQLi" "id:1001,phase:2,deny,msg:'SQL injection'"
```

任意参数里的跨站脚本：

```text
SecRule ARGS "@detectXSS" "id:1002,phase:2,deny,msg:'XSS'"
```

按User-Agent识别已知扫描器，忽略大小写：

```text
SecRule REQUEST_HEADERS:User-Agent "@pm sqlmap nikto nmap masscan" "id:1003,phase:1,t:lowercase,deny"
```

查询字符串里的路径穿越：

```text
SecRule QUERY_STRING "@contains ../" "id:1004,phase:1,deny"
```

没有`Host`请求头的请求：

```text
SecRule &REQUEST_HEADERS:Host "@eq 0" "id:1005,phase:1,deny"
```

[Coraza SecLang参考](https://coraza.io/docs/seclang/)列出了所有变量、运算符和转换。
