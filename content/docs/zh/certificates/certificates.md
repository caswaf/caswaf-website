---
title: "证书"
description: "给CasWAF添加TLS证书，给证书命名以便网关把它们和域名匹配，并掌握证书和域名的到期时间。"
---

证书在单独的列表里，和站点分开。网关按名字为每个HTTPS连接选一张证书，所以一张通配符证书可以服务一个域名下的所有站点。单个域名的证书也可以由[Let's Encrypt](./lets-encrypt.md)自动签发。

## 添加证书

1. 打开**Certs**，点**Add**，再点新行上的**Edit**。
2. 把**Name**设为证书所对应的域名。网关匹配的就是它；见下文。
3. 把PEM格式的证书粘贴到**Certificate**，中间证书接在后面；把PEM格式的私钥粘贴到**Private key**。
4. 按密钥类型把**Crypto algorithm**设为`RSA`或`ECC`，**Type**保持`SSL`。
5. 保存。**Expire time**从证书里读出。

几秒内新连接就会用上新证书；不需要重启。

## 名字怎样匹配

对于到`shop.app.example.com`的连接，CasWAF查找名为以下名字的证书：

1. 先找完全相同的`shop.app.example.com`，
2. 再找注册域名`example.com`。

所以单个域名的证书按该域名命名，通配符证书（`*.example.com`加`example.com`）按不带前缀的域名命名。通配符只覆盖一级，所以即使名字能匹配，`*.example.com`也不覆盖`shop.app.example.com`：要给它单独一张证书。

查找时不区分证书的所有者。站点编辑页在**SSL cert**下显示它的域名选中了哪张证书。

## 到期

列表显示每张证书什么时候到期。**Domain expire**显示域名注册什么时候到期：点某一行的**Refresh**或点**Refresh all**来查询。证书的**Provider**为`Aliyun`并填了access key时，CasWAF查询阿里云的域名API，否则用RDAP和WHOIS查询。

## Provider和密钥

**Provider**（`Aliyun`或`GoDaddy`）、**Account**、**Access key**和**Access secret**保存这个域名的DNS凭据。CasWAF用阿里云的key读取域名的到期时间。Access secret从不回传给浏览器，显示为`***`；保存证书时请重新输入secret，否则保存的值会被替换成`***`。

## 复制和下载

编辑页上有复制或下载证书和私钥的按钮，便于在其他服务器上使用。
