---
title: "快速上手"
description: "从源码编译CasWAF，连接MySQL和Casdoor，登录管理界面，把第一个站点放到网关后面。"
---

本页从`master`分支编译CasWAF，在一台机器上运行，并把一个Web应用放到它后面。大约需要十五分钟。

## 需要什么

- [Go](https://go.dev/dl/) 1.20或更新版本
- 编译管理界面用的[Node.js](https://nodejs.org) 20和[Yarn 1](https://classic.yarnpkg.com)
- MySQL 5.7或8
- 一个用来登录的[Casdoor](https://casdoor.ai)实例，并且有权限在里面添加应用
- 机器上的端口80、443和17000没有被占用

> **警告**：CasWAF启动时会结束正在监听端口80、443和17000的进程，包括你还在运行的Nginx或Apache。请先把它们移到别的端口，再让CasWAF转发过去。

## 1. 获取代码

```bash
git clone https://github.com/caswaf/caswaf
cd caswaf
```

## 2. 创建Casdoor应用

在Casdoor里为CasWAF添加一个应用，并给它加上这个回调地址：

```text
http://localhost:17000/callback
```

记下组织、应用名、Client ID和Client secret。[用Casdoor登录](./casdoor.md)解释了每一项设置以及谁能登录。

## 3. 配置CasWAF

编辑`conf/app.conf`：

```ini
driverName = mysql
dataSourceName = root:your-password@tcp(localhost:3306)/
dbName = caswaf

casdoorEndpoint = https://your-casdoor.example.com
clientId = <client ID>
clientSecret = <client secret>
casdoorOrganization = <organization>
casdoorApplication = <application>
```

管理界面自己的登录按钮读的是`web/src/Conf.js`，它会编译进前端，所以在那里也填上相同的值：

```js
export const AuthConfig = {
  serverUrl: "https://your-casdoor.example.com",
  clientId: "<client ID>",
  appName: "<application>",
  organizationName: "<organization>",
  redirectPath: "/callback",
};
```

## 4. 编译管理界面

```bash
cd web
yarn install
yarn build
cd ..
```

## 5. 运行

CasWAF启动时会建表，但不会建数据库。可以先在MySQL里建一个空的`caswaf`数据库，或者第一次运行时加上`-createDatabase=true`：

```bash
go build -o caswaf .
sudo ./caswaf -createDatabase=true
```

在Linux上，绑定端口80和443需要root或`CAP_NET_BIND_SERVICE`权限。要在仓库目录下运行：它从工作目录读取`conf/app.conf`和`web/build`。

> **注意**：在Windows上，以及在Linux上以systemd服务运行时，CasWAF还会把自己注册为开机自启：Windows上是`Desktop\run`下的一个`<dbName>.bat`，加上“启动”文件夹里的一个快捷方式；Linux上是一个systemd unit。见[节点](../operations/nodes.md)。

## 6. 登录

打开`http://localhost:17000`，通过Casdoor登录。登录后进入站点列表。

## 7. 把站点放到它后面

假设同一台机器上有一个应用监听端口3000，要通过`app.example.com`访问。

1. 打开**Sites**，点**Add**，再点新行上的**Edit**。
2. 把**Domain**设为`app.example.com`。
3. 把**Port**设为`3000`，或者把**Host**设为`http://127.0.0.1:3000`。
4. 在有证书之前把**Mode**设为`HTTP`，把**Status**设为`Active`。
5. 点**Save**。

网关几秒内就会生效。在DNS指向这台机器之前可以先这样试：

```bash
curl -H "Host: app.example.com" http://127.0.0.1/
```

然后把DNS指向这台机器，添加证书（[证书](../certificates/certificates.md)或[Let's Encrypt](../certificates/lets-encrypt.md)），把**Mode**改成`HTTPS Only`，再挂上一些[规则](../rules/rules.md)。
