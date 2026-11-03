---
title: "配置"
description: "CasWAF的conf/app.conf里的每一项，哪些可以用环境变量设置，以及存在数据库里的设置。"
---

CasWAF启动时从工作目录读取`conf/app.conf`；改完要重启。站点、证书、规则和节点不在这个文件里：它们存在数据库中，在管理界面里修改。

## 服务器

| 配置项 | 默认值 | 含义 |
| --- | --- | --- |
| `appname` | `caswaf` | 程序名 |
| `httpport` | `17000` | 管理界面和API的端口 |
| `runmode` | `dev` | Beego的运行模式 |
| `SessionOn`、`copyrequestbody` | `true` | CasWAF需要的Beego设置，保持开启 |
| `redisEndpoint` | 空 | 把管理界面的会话存进Redis（`host:port`），而不是`tmp/`下的文件 |
| `language` | `en` | CasWAF给自己的Windows快捷方式命名时用的语言 |

## 数据库

| 配置项 | 默认值 | 含义 |
| --- | --- | --- |
| `driverName` | `mysql` | `mysql`、`postgres`、`mssql`或`sqlite` |
| `dataSourceName` | `root:123@tcp(localhost:3306)/` | 连接字符串，不含数据库名 |
| `dbName` | `caswaf` | 数据库名；也是CasWAF注册开机自启时用的名字 |
| `tableNamePrefix` | 空 | 表名前缀 |
| `showSql` | `false` | 打印每条SQL语句 |

数据库必须已经存在，除非启动CasWAF时带上`-createDatabase=true`。每次启动时都会创建和更新表。

## 网关

| 配置项 | 默认值 | 含义 |
| --- | --- | --- |
| `gatewayEnabled` | `true` | 运行网关；`false`只运行管理界面和API |
| `gatewayHttpPort` | `80` | 普通HTTP端口 |
| `gatewayHttpsPort` | `443` | HTTPS端口 |
| `trustedProxies` | 私有地址段 | 信任哪些代理发来的`X-Forwarded-For`；见[代理后面的客户端IP](./client-ip.md) |

## Casdoor

| 配置项 | 含义 |
| --- | --- |
| `casdoorEndpoint` | Casdoor的地址 |
| `clientId`、`clientSecret` | CasWAF在Casdoor里的应用 |
| `casdoorOrganization`、`casdoorApplication` | 这个应用所属的组织和应用名 |
| `isDemoMode` | `true`时拒绝通过API做的一切修改 |

见[用Casdoor登录](../getting-started/casdoor.md)；管理界面自己的登录设置在`web/src/Conf.js`里。

## 证书

| 配置项 | 含义 |
| --- | --- |
| `acmeEmail`、`acmePrivateKey` | Let's Encrypt账号；见[Let's Encrypt](../certificates/lets-encrypt.md) |
| `httpProxy` | 一个SOCKS5代理，`host:port`，用来查询域名的到期日期；连不上时跳过 |

## 部署Casbin自己的应用

`appDir`、`appMap`、`dbRegionId`、`dbAccessKeyId`、`dbAccessKeySecret`、`dbInstanceId`、`dbHost`、`dbUser`、`dbPass`、`clientIdPrefix`和`clientSecretPrefix`属于把Casbin自己的应用部署到网关节点上的代码；见[路线图](../more/roadmap.md)。其中只有`appDir`在别处也有用：[自动更新](./upgrading.md)会在`<appDir>/_bin/`下构建CasWAF的新程序。

## 环境变量

下面这些配置项可以被同名环境变量覆盖，在容器里很方便：`driverName`、`dataSourceName`、`dbName`、`tableNamePrefix`、`showSql`、`trustedProxies`、`isDemoMode`、`httpport`和`appname`。其余配置项只从文件读取。

| 变量 | 作用 |
| --- | --- |
| `RUNNING_IN_DOCKER=true` | 把`dataSourceName`里的`localhost`换成Docker宿主机 |

## 数据库里的设置

**Settings**页面保存CasWAF运行期间可以修改的设置。目前只有**Record retention days**；见[请求记录](../monitoring/records.md)。
