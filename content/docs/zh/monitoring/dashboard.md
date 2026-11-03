---
title: "仪表盘"
description: "CasWAF的仪表盘：总请求数、不同客户端地址数、各站点的请求数、请求随时间的变化，以及请求最多的IP地址和User-Agent。"
---

**Dashboard**页面按你选的时间段汇总[请求记录](./records.md)：**Hour**覆盖最近72小时，**Day**覆盖最近7天，**Week**覆盖最近12周，**Month**覆盖最近12个月。**All**显示最近12个月，其中随时间变化的图表覆盖最近12周。

## 显示的内容

- 这段时间的**Total Request Count**和**Unique IP Count**
- 各站点的请求数，按主机名画成饼图
- 请求随时间的变化，画成柱状图
- **Top 10 IP Addresses**和**Top 10 User-Agents**

用它看哪些站点承担了流量，找出发送量远超其他的地址或爬虫，再为它写一条[IP规则](../rules/ip.md)、[User-Agent规则](../rules/user-agent-and-path.md)或[限流规则](../rules/rate-limiting.md)。

## 说明

- 这些数字是在页面加载时从`record`表算出来的，所以只覆盖[保留期限](./records.md)内留下的记录，表很大时也会更慢。
- 查询用到了MySQL的日期函数，所以仪表盘需要MySQL，也就是CasWAF开发和运行时用的数据库。
- 同样的数字也可以从API获取：`/api/get-metrics?type=site|path|ip|userAgent&rangeType=hour|day|week|month&count=<n>&top=<n>`和`/api/get-metrics-over-time?rangeType=<...>&count=<n>&granularity=hour|day|month`。`count`是往回数多少个`rangeType`单位。
