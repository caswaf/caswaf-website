---
title: "验证码"
description: "让匹配规则的访客先通过Casdoor验证码，而不是直接拦截，通过后放行30分钟。"
---

除`WAF`和`IP Rate Limiting`外，任何规则都可以使用`CAPTCHA`动作。匹配的访客会被送到Casdoor提供的验证码页面；通过后，他们回到原来请求的页面，并在30分钟内被放行。它适合你拿不准的流量，例如境外访客，或者User-Agent不寻常的客户端，这些情况下直接拦截会把真人挡在外面。

## 配置

1. 在Casdoor里添加一个验证码提供商（Casdoor自带的、reCAPTCHA、hCaptcha、Cloudflare Turnstile等），并把它加到CasWAF自己的应用（即`casdoorApplication`里的那个）的提供商列表里。
2. 在CasWAF里把规则的**Action**设为`CAPTCHA`，并把规则挂到站点上。

## 访客看到什么

1. 匹配规则的请求被跳转到`<casdoorEndpoint>/captcha`。
2. 完成验证后，访客被送到站点上的`/caswaf-captcha-verify`，CasWAF在这里向Casdoor核对结果。
3. 核对成功后，CasWAF设置名为`casdoor_captcha_token`的Cookie，并把访客跳转到他们最初请求的页面。Cookie有效期间，即30分钟内，匹配这条规则的请求都会放行。核对失败时，访客会被送回验证码页面。

## 限制

- 通过的验证码记在核对它的那个网关的内存里。重启之后，或者换到另一个[节点](../operations/nodes.md)上，访客要重新做一次。
- 跳转到验证码只对页面加载有效。API调用和其他由脚本发起的请求无法跟随这个跳转，所以不要在API前面放`CAPTCHA`规则。
