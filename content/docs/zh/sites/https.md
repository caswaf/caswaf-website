---
title: "HTTPS"
description: "CasWAF怎样提供HTTPS：站点的SSL模式、每个连接怎样选证书、TLS设置，以及它给HTTPS响应添加的响应头。"
---

网关在端口443上监听HTTPS，在端口80上监听普通HTTP。站点的**Mode**决定普通HTTP请求怎么处理；证书来自[证书列表](../certificates/certificates.md)。

## SSL模式

| 模式 | 普通HTTP | HTTPS |
| --- | --- | --- |
| `HTTPS Only` | 以`301`跳转到HTTPS | 提供 |
| `HTTPS and HTTP` | 提供 | 提供 |
| `HTTP` | 提供 | 有证书匹配域名时提供 |
| `Static Folder` | 不转发，而是提供**Host**里那个文件夹中的文件；见[站点](./sites.md) | |

新站点默认是`HTTPS Only`。站点还没有证书时，请用`HTTP`：`HTTPS Only`又没有证书时，每次访问都会跳转到一个连不上的HTTPS地址。

## 用哪张证书

证书在建立TLS连接时，按客户端发送的服务器名（SNI）选择，分两步：

1. **Name**与请求的名字完全相同的证书，例如`app.example.com`。
2. 否则，用以注册域名命名的证书，例如`example.com`。一张覆盖`*.example.com`和`example.com`、命名为`example.com`的通配符证书，就这样服务所有子域名。

客户端不发送服务器名，或请求的名字没有证书匹配时，无法建立连接：没有默认证书。站点编辑页在**SSL cert**下显示匹配到的证书。

证书不和站点绑定，所以证书也会服务还没有站点的域名；这时请求得到`site not found`。

## TLS设置

- TLS 1.2和1.3
- TLS 1.2只用ECDHE密钥交换，配合AES-GCM或ChaCha20-Poly1305
- 曲线X25519、P-256和P-384

这些是内置的，所有站点都一样。

## CasWAF给HTTPS响应添加什么

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`，除非应用已经发送了这个响应头
- 给每个没有`Secure`的`Set-Cookie`加上`Secure`

对所有响应，不论是不是HTTPS，如果应用在允许携带凭据的同时允许来源`*`或`null`，CasWAF会去掉`Access-Control-Allow-Origin`和其他`Access-Control-*`响应头，因为这种组合会让任何网站读到用户的数据。

## 只走HTTP的路径

有两类路径在应用模式之前由网关自己应答，所以即使是`HTTPS Only`站点，它们也能通过普通HTTP访问：

- `/.well-known/acme-challenge/<token>`，用于[Let's Encrypt](../certificates/lets-encrypt.md)和其他ACME客户端
- `/MP_verify_<code>.txt`，微信要求域名提供的验证文件

两者都按站点的**Challenges**应答，每条写成`<token>:<answer>`或`MP_verify_<code>.txt:<answer>`。
