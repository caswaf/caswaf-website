---
title: "Let's Encrypt"
description: "让CasWAF通过HTTP-01为站点的域名申请和续期Let's Encrypt证书：需要什么，以及什么时候申请。"
---

CasWAF可以为站点的域名从Let's Encrypt获取证书，并在到期前续期，使用的是它自己应答的HTTP-01验证。站点的每个域名，即主域名和**Other domains**里的每一个，都有自己的证书，以该域名命名。

## 需要什么

1. `conf/app.conf`里的**ACME账号**：一个邮箱地址和一个PEM格式的EC P-256私钥。用下面的命令生成私钥：

   ```bash
   openssl ecparam -name prime256v1 -genkey -noout
   ```

   并把它写成一行，原来换行的地方写`\n`：

   ```ini
   acmeEmail = admin@example.com
   acmePrivateKey = -----BEGIN EC PRIVATE KEY-----\nMHcCAQEE...\n-----END EC PRIVATE KEY-----
   ```

   CasWAF第一次使用这个账号时会在Let's Encrypt注册它。设置后重启CasWAF。

2. **负责申请的网关**。一个站点的证书只由一个网关申请，以免多个[节点](../operations/nodes.md)各申请一张。这个网关写在站点的**Tag**里：tag是网关机器的主机名，或者任意内容后接`-`和主机名。tag为`gw1`或`web-gw1`的站点，由主机名为`gw1`的机器申请证书。tag没有对应任何机器的站点不会得到证书。

3. 每个域名的**DNS**指向网关，并且端口80能从互联网访问。

4. **站点的所有者不是`admin`**。`admin`账号创建的站点会被跳过；CasWAF认为它们用的是手动添加的证书，例如通配符证书。

## 什么时候运行

网关每隔几秒检查一次站点。对每个域名，在以下情况下申请证书：

- 没有证书匹配这个域名，既没有完全同名的，也没有以注册域名命名的，或者
- 匹配的证书在7天内到期。

所以已经被以注册域名命名的通配符证书覆盖的域名不会处理。

## 怎样运行

1. CasWAF先检查能否访问到自己：它往站点的**Challenges**里写一个随机token，然后请求`http://<domain>/.well-known/acme-challenge/<token>`，最多十次。如果没有得到应答，例如因为DNS指向了别处，它就到此为止，不去打扰Let's Encrypt。
2. 它向Let's Encrypt申请一张RSA 2048证书，应答验证，然后把证书连同证书链存进证书列表，替换旧证书。
3. 任何一步失败时，它等一小时再重试这个域名，然后是两小时、四小时、八小时、十六小时，之后每天一次，这样不会超过Let's Encrypt的频率限制。

运行期间，CasWAF会用自己的token替换站点的**Challenges**，结束后清空，所以微信验证文件要放在不自动申请证书的站点上。

## 通配符证书

HTTP-01不能签发通配符证书。请用支持你DNS服务商的ACME客户端获取通配符证书，例如[lego](https://go-acme.github.io/lego/)或[acme.sh](https://github.com/acmesh-official/acme.sh)，然后手动添加，以不带前缀的域名命名；见[证书](./certificates.md)。在管理界面里通过DNS申请通配符证书已列入[路线图](../more/roadmap.md)。
