---
title: "不用 Nginx 也能跑 ModSecurity 规则"
description: "ModSecurity 通常以 Nginx 模块的形式出现。CasWAF 在网关进程里用 Coraza 跑同样的 SecLang 规则，底下没有 Nginx。哪些能直接搬过来，哪些不能，以及搬一套规则要注意什么。"
---

人们介绍 ModSecurity 时，通常说它是 Nginx 或 Apache 的模块。大多数人也是这样遇到它的：Web服务器通过一个连接器加载 `libmodsecurity`，前面挂一套规则。

但规则本身和 Nginx 没有关系。规则用 SecLang 写，就是 `SecRule` 指令、变量、操作符和转换组成的语言，任何实现了这门语言的引擎都能跑。[Coraza](https://coraza.io) 就是用 Go 写的一个实现。CasWAF 把它放在网关进程里，所以一个站点可以只跑 ModSecurity 规则，底下没有 Nginx，也没有连接器。

这篇讲搬一套规则过来时哪些能照用，以及容易让人意外的地方。

## 规则跑在哪里

在 CasWAF 里，防火墙规则是站点可以挂的规则类型之一。把类型设成 `WAF`，表达式里就是 SecRule 指令，写法和 ModSecurity 配置文件里完全一样：

```text
SecRule ARGS "@detectSQLi" "id:1001,phase:2,deny,msg:'SQL injection'"
SecRule ARGS "@detectXSS" "id:1002,phase:2,deny,msg:'XSS'"
```

Coraza 以检测模式运行，由 CasWAF 决定拿检测结果做什么。规则里的处置动作会变成 CasWAF 的动作：

| SecLang 动作 | CasWAF 的行为 |
| --- | --- |
| `deny`、`block` | 拦截请求，默认状态码 `403` |
| `drop` | 直接断开，返回 `Dropped by CasWAF` |
| `allow` | 放行，并跳过该站点后面的规则 |
| `pass` 及其他 | 没有效果 |

有两处和原生的 ModSecurity 不一样。`status:` 动作不生效，状态码在管理界面的规则上设。另外 `200000` 到 `200099` 这段 ID 属于 CasWAF 自带的基础配置，自己的规则要避开。

## 搬一套规则

给 Nginx 写的规则集，通常就是一个装满 SecRule 的文件。搬过来就是把那些行按想要的检查顺序贴进管理界面的规则表达式里。

规则能看到的变量和 ModSecurity 提供的一致：`REQUEST_URI`、`QUERY_STRING`、`ARGS`、`ARGS_GET`、`ARGS_POST`、`REQUEST_HEADERS`、`REQUEST_COOKIES`，以及最大 12.5 MB 的请求体。JSON 和 XML 请求体会按 Content-Type 解析，字段同样进 `ARGS`。请求体会原样转给应用。

如果旧配置里有下面这几条，可以拿来开头：

```text
# 按 User-Agent 拦已知扫描器，忽略大小写
SecRule REQUEST_HEADERS:User-Agent "@pm sqlmap nikto nmap masscan" "id:1003,phase:1,t:lowercase,deny"

# 查询串里的目录穿越
SecRule QUERY_STRING "@contains ../" "id:1004,phase:1,deny"

# 没有 Host 头的请求
SecRule &REQUEST_HEADERS:Host "@eq 0" "id:1005,phase:1,deny"
```

## OWASP Core Rule Set 怎么办

大家真正依赖的那部分是 OWASP Core Rule Set。它很大：几千条规则，带 include、异常评分、paranoia 级别和一整套 `SecMarker` 记账。CasWAF 对每个走到这条规则的请求重新构建规则集，几条规则没问题，跑整套 CRS 不是好用法。

所以 CasWAF 不捆绑 CRS，用这种方式跑整套也不在维护者的建议里。实际可行的做法是挑出和你实际流量对得上的规则：扫描器签名、目录穿越、几条 `@detectSQLi` 和 `@detectXSS`，再加上针对应用里接收危险输入那部分的自定义规则。这能覆盖相当多的真实攻击，而且每条规则你都说得清它在干什么。

如果确实需要完整的 CRS，就在应用前面放一个为它设计的引擎，让 CasWAF 负责站点、证书、跳转和登录保护。两者不冲突，CasWAF 可以放在 Nginx 前面，也可以放在后面。

## 依赖它之前要确认的

- **指令覆盖面。** Coraza 实现的是 SecLang，不等于 ModSecurity 历史上的每一条指令。正式放量前，先用测试请求把规则集跑一遍。
- **规则顺序。** 按站点规则的顺序检查，`allow` 会停掉后面的规则。要早跑的规则就放在前面。
- **请求体大小。** 超过 12.5 MB 的请求体不检查，基础配置自带的规则也不参与这条请求的判定。
- **日志。** 每个被拦的请求都会记成 `blocked by WAF rule: <id>`，数字就是规则里写的 id，调规则时按它找。

[Coraza 的 SecLang 参考](https://coraza.io/docs/seclang/)列了它支持的每个变量、操作符和转换。CasWAF 这边，[WAF规则](/zh/docs/rules/waf)讲的是集成方式，[CasWAF 与 ModSecurity 对比](/zh/compare/modsecurity)把两种部署方式放在一起看。