---
title: "Dashboard"
description: "The CasWAF dashboard: total requests, unique client addresses, requests per site, requests over time, and the top IP addresses and User-Agents."
---

The **Dashboard** page sums up the [request records](./records.md) for a period you pick: **Hour** covers the last 72 hours, **Day** the last 7 days, **Week** the last 12 weeks and **Month** the last 12 months. **All** shows the last 12 months, with the chart over time for the last 12 weeks.

## What it shows

- **Total Request Count** and **Unique IP Count** for the period
- Requests per site, as a pie chart by host
- Requests over time, as a bar chart
- **Top 10 IP Addresses** and **Top 10 User-Agents**

Use it to see which sites take the traffic, to spot an address or a crawler sending far more than the rest, and then to write an [IP rule](../rules/ip.md), a [User-Agent rule](../rules/user-agent-and-path.md) or a [rate limit](../rules/rate-limiting.md) for it.

## Notes

- The figures are worked out from the `record` table when the page loads, so they cover only what [retention](./records.md#how-long-records-are-kept) has kept, and take longer on a large table.
- The queries use MySQL's date functions, so the dashboard needs MySQL, the database CasWAF is developed and run on.
- The same figures come from the API: `/api/get-metrics?type=site|path|ip|userAgent&rangeType=hour|day|week|month&count=<n>&top=<n>` and `/api/get-metrics-over-time?rangeType=<...>&count=<n>&granularity=hour|day|month`. `count` is the number of `rangeType` units to go back.
