---
title: "用Casdoor登录"
description: "CasWAF的管理界面通过一个Casdoor应用登录：两边各需要哪些设置、回调地址，以及谁能登录。"
---

CasWAF没有自己的账号。管理界面通过[Casdoor](https://casdoor.ai)登录，同一个Casdoor连接还支撑[登录保护](../sites/login.md)、[验证码](../rules/captcha.md)和[健康告警](../sites/alerts.md)。Casdoor是开源的，可以和CasWAF并排运行，也可以作为CasWAF的一个站点放在它后面。

## 在Casdoor里

1. 选择或新建CasWAF管理员所在的组织。
2. 在这个组织里添加一个应用。
3. 在**Redirect URLs**里加上管理界面的回调地址，你用哪些地址打开管理界面，就每个都加一条：

   ```text
   http://localhost:17000/callback
   https://waf.example.com/callback
   ```

4. 记下Client ID和Client secret。

## 在CasWAF里

后端从`conf/app.conf`读取这几项：

| 配置项 | 值 |
| --- | --- |
| `casdoorEndpoint` | Casdoor的地址，例如`https://door.example.com` |
| `clientId`、`clientSecret` | 应用的Client ID和Client secret |
| `casdoorOrganization` | 组织 |
| `casdoorApplication` | 应用名 |

浏览器里的登录按钮读的是`web/src/Conf.js`，它会编译进`web/build`。在那里填上相同的地址、Client ID、应用和组织，再用`yarn build`重新编译管理界面：

```js
export const AuthConfig = {
  serverUrl: "https://door.example.com",
  clientId: "<client ID>",
  appName: "<application>",
  organizationName: "<organization>",
  redirectPath: "/callback",
};
```

## 谁能登录

凡是能登录这个Casdoor应用的人，都能管理CasWAF里的所有站点、证书和规则；目前还没有只读角色。所以这个应用只给运维CasWAF的人用：把它放在单独的组织里，并关掉应用的注册。

一次登录会话有效一年。会话以文件形式保存在程序旁边的`tmp/`里；设置了`redisEndpoint`时保存在Redis里，这样多个管理界面实例可以共用会话。

## 只读演示模式

在`conf/app.conf`里设置`isDemoMode = true`后，CasWAF拒绝通过API做的一切修改，登录和退出除外。同时在`web/src/Conf.js`里设置`IsDemoMode`，管理界面会提示访客这是只读演示站。
