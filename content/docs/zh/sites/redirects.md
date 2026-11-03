---
title: "跳转"
description: "CasWAF在转发请求之前做的跳转：其他域名跳到主域名，www跳到不带www的域名，HTTP跳到HTTPS，以及添加末尾斜杠。"
---

有些请求在到达应用之前，CasWAF就以`301`跳转应答。它们按下面的顺序执行，每一种都保留路径和查询字符串。

## 其他域名跳到主域名

打开**Need redirect**后，`Host`与站点**Domain**不完全相同的请求都会被送到主域名：`example.net/pricing?a=1`变成`app.example.com/pricing?a=1`。协议保持不变，所以HTTP请求先跳到HTTP地址，如果站点是`HTTPS Only`，再跳到HTTPS。

把站点搬到新域名、旧域名留在**Other domains**里时用它，或者用它把`example.com`、`example.net`以及它们的`www.`形式集中到一个地址。如果每个其他域名都应该以自己的名字提供站点，就不要打开。

## 添加末尾斜杠

打开**Need redirect**时，**Redirect with slash**还会在路径末尾加上`/`：`old.example.com/docs/intro?a=1`变成`app.example.com/docs/intro/?a=1`。根路径`/`和最后一段带点的路径（例如`/sitemap.xml`）不变。

对于Docusaurus这类自己会把`/docs/intro`跳到`/docs/intro/`的站点，这样可以省掉一跳：旧链接只跳一次就到达最终地址，而不是两次。

## www跳到不带www的域名

对`www.<domain>`的请求总会跳转到`<domain>`，不论站点怎么设置。站点的域名请不带`www.`填写；`www.`形式会自动匹配并跳转。打开**Need redirect**时，`www.example.net`一跳就到主域名。

## HTTP跳到HTTPS

`HTTPS Only`模式的站点把每个普通HTTP请求跳转到同一地址的HTTPS。ACME challenge和微信验证文件会先通过普通HTTP应答；见[HTTPS](./https.md)。
