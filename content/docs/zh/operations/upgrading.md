---
title: "升级"
description: "手动从Git更新CasWAF，或者让每个网关节点自动更新：自动更新如何构建、重启和回滚。"
---

CasWAF在[caswaf/caswaf](https://github.com/caswaf/caswaf)的`master`分支上开发，每个网关运行的都是它的一份检出。表由CasWAF在启动时自己更新，所以升级就是拿到新代码再重启。

## 手动升级

```bash
cd /opt/caswaf
git pull
cd web && yarn install && yarn build && cd ..
go build -o caswaf .
sudo systemctl restart caswaf-site-caswaf
```

`web/`下没有改动时，跳过`web`那一步。管理界面的文件在每次请求时从`web/build`读取，所以新构建的版本不用重启就能看到。

重启网关会断开它持有的连接，并重置[限流](../rules/rate-limiting.md)计数和已通过的[验证码](../rules/captcha.md)。有多个[节点](./nodes.md)时，一台一台地升级。

如果`conf/app.conf`有本地修改，并且和上游的修改冲突，`git pull`会停下；先把你的值挪开，拉取之后再放回去。

## 自动更新

网关可以从Git自动更新。它每五分钟检查一次检出所跟踪的分支上有没有新提交，如果有：

1. 拉取新提交，构建新程序`<appDir>/_bin/<dbName>/<dbName>_<commit>.exe`；
2. 如果`web/`下有改动，就重新构建管理界面；管理界面构建失败不会阻止这次更新；
3. 以新程序重启：在Linux上把它的systemd unit指向新程序然后退出，由systemd重新启动；在Windows上过几秒启动新程序然后退出。

如果构建失败，它回到原来运行的提交，继续运行，并且不再尝试这个上游提交，而是等下一个。

只有同时满足下面这些条件时才会自动更新：

- 机器运行Windows，或者运行Linux且CasWAF作为systemd服务运行；
- CasWAF从Git检出运行，并且装了Go，以及构建管理界面用的Yarn；
- **Nodes**页面上有这台机器的条目，所有者是`admin`，并且打开了**Self update**；
- 节点的**Upgrade mode**当前允许更新：`At Any Time`，或者`Half A Hour`时从UTC+8的23:00开始的半小时；`No Upgrade`会禁止更新。

先在一个测试节点上打开它，等你信任所跟踪的分支后再给其余节点打开。要固定版本，就让检出指向一个由你自己移动的分支。
