---
title: "登录保护"
description: "在站点前面加一道Casdoor登录，只有能登录某个Casdoor应用的人才能访问，应用本身不用改。"
---

站点可以要求访客先通过Casdoor登录，CasWAF才把请求转发给它。站点后面的应用不需要任何改动：适合没有自己登录功能的管理后台、内部工具和预发布站点。

## 设置

1. 在Casdoor里，在CasWAF自己的应用所在的组织（`casdoorOrganization`）中，为这个站点添加一个应用，或者复用已有的应用。
2. 给这个应用加上下面的回调地址，换成站点的域名：

   ```text
   https://app.example.com/caswaf-handler
   ```

   站点只通过普通HTTP提供时，改用`http://`。CasWAF发给Casdoor的是访客进来时用的协议。

3. 在CasWAF里打开站点，在**Casdoor app**下选择这个应用。列表里是CasWAF所在组织的应用。保存。

谁能访问由Casdoor决定：应用所属的组织、是否允许注册，以及它的登录方式（密码、第三方登录、LDAP、SAML、多因素认证等）。

## 访客看到什么

1. 没有`casdoor_access_token` cookie的请求会被跳转到这个应用的Casdoor登录页，并保留访客原来请求的路径。
2. 访客登录后，Casdoor把他送到`/caswaf-handler`，CasWAF用授权码换取访问令牌，存进`casdoor_access_token` cookie，再跳转到他最初请求的页面。
3. 之后的每个请求，CasWAF都先用应用的证书校验令牌签名，再检查站点的规则。令牌过期或校验不通过时，访客会被送去重新登录。

站点后面的应用会随请求收到这个cookie，需要的话可以从令牌里读出用户。

## 限制

- 这项检查只说明访客登录过这个应用。CasWAF里没有按用户或按用户组的规则；请在Casdoor里限制访问。
