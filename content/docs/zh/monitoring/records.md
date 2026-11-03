---
title: "请求记录"
description: "CasWAF把网关收到的每个请求都记在数据库里：记录了什么，怎么查看，保留多久。"
---

网关在查找站点、检查任何规则之前，就为收到的每个请求在`record`表里写一条记录。**Records**页面按时间从新到旧列出这些记录，[仪表盘](./dashboard.md)对它们做汇总。

## 记录了什么

| 字段 | 示例 |
| --- | --- |
| **Created time** | `2026-11-03T21:14:05+08:00` |
| **Method** | `GET` |
| **Host** | `app.example.com` |
| **Path** | `/login?next=%2F`，带查询字符串的路径，最多100个字符 |
| **Client IP** | `203.0.113.7`，按[代理后面的客户端IP](../operations/client-ip.md)里的方法得出 |
| **User-Agent** | 最多512个字符 |

请求的域名不属于任何站点时也会记录，从中能看出谁在探测网关。User-Agent包含`Uptime-Kuma`的请求不记录，这样每隔几秒轮询一次的监控不会把表填满。每条记录也会打印到程序的标准输出。

记录里没有写是哪个站点、哪条规则处理了请求，也没有写响应是什么；见[路线图](../more/roadmap.md)。

## 记录保留多久

打开**Settings**，设置**Record retention days**。CasWAF每小时删除一次早于这个天数的记录，分小批删除，以免长时间锁住数据库。默认值`0`表示全部保留。

繁忙的网关每天会写几十万条记录，所以在表变大之前，要设置保留期限，或者自己归档这张表。

## 查看记录

**Records**页面上的列表可以按列排序。更复杂的问题直接查表；例如在MySQL里查询某个站点从某个时间以来请求最多的客户端地址：

```sql
SELECT client_ip, COUNT(*) AS n
FROM record
WHERE host = 'app.example.com'
  AND created_time >= '2026-11-02T21:00:00+08:00'
GROUP BY client_ip
ORDER BY n DESC
LIMIT 20;
```

`created_time`以RFC 3339格式的文本存储，时区固定为UTC+8，所以要和同样格式的字符串比较。
