import { Activity, Globe2, Layers, Lock, ShieldCheck, UserRoundCheck } from 'lucide-react';

// The landing page's copy, shared by the page, its metadata and its preview image.
const text = {
  en: {
    seoTitle: 'CasWAF: Open-Source Reverse Proxy and Web Application Firewall in Go',
    badge: 'Apache-2.0, no enterprise edition',
    title: 'The reverse proxy with a firewall and a console',
    subtitle: 'Put every site behind one Go gateway, with HTTPS, rules and single sign-on, managed from the browser.',
    lead: 'CasWAF takes the place of Nginx in front of your web applications. Add a site in the console, give it a domain and the address of the application, attach a certificate and some rules, and every gateway node picks it up within seconds. No configuration files, no reloads.',
    start: 'Get started',
    copy: 'Copy command',
    installNote: 'Needs Go, Node.js, MySQL and a Casdoor application. The console runs on port 17000.',
    howTitle: 'How a request goes through',
    how: {
      visitors: 'Visitors',
      visitorsBody: 'Browsers, apps and crawlers',
      steps: ['Serve HTTPS with the matching certificate', 'Record the request', 'Redirect, and ask for a login if set', "Check the site's rules in order"],
      verdicts: 'Each request is',
      apps: 'Your applications',
      appsBody: 'Any HTTP service, or a folder of files',
    },
    verdicts: ['Allowed', 'Blocked', 'CAPTCHA'],
    featuresTitle: 'What it does today',
    features: [
      {
        icon: Globe2,
        title: 'Many sites, one gateway',
        body: 'Route each domain to its application, with extra domains, www and trailing-slash redirects, several upstreams, or a folder of static files. WebSockets and HTTP/2 included.',
        href: 'sites/sites',
      },
      {
        icon: Lock,
        title: 'HTTPS without the chores',
        body: 'Certificates picked by domain for every connection, wildcards serving every subdomain, Let’s Encrypt certificates issued and renewed for you, HSTS and secure cookies added.',
        href: 'sites/https',
      },
      {
        icon: ShieldCheck,
        title: 'Rules in front of every site',
        body: 'Block or allow by IP range, traffic from abroad, User-Agent and path, rate-limit each address, run ModSecurity rules on the Coraza engine, or send doubtful visitors through a CAPTCHA.',
        href: 'rules/rules',
      },
      {
        icon: UserRoundCheck,
        title: 'Single sign-on, for you and your sites',
        body: 'The console signs in through Casdoor, with MFA, LDAP, SAML and social logins. Put any internal tool behind a Casdoor login without changing a line of it.',
        href: 'sites/login',
      },
      {
        icon: Activity,
        title: 'See what comes in',
        body: 'Every request recorded, a dashboard of traffic per site over time with the top addresses and crawlers, and an email or SMS when a site stops answering.',
        href: 'monitoring/dashboard',
      },
      {
        icon: Layers,
        title: 'Several nodes, one configuration',
        body: 'Run the gateway on as many machines as you like against one database. Each serves every site, and each can update itself from Git.',
        href: 'operations/nodes',
      },
    ],
    more: 'Read more',
    openTitle: 'Open source, all of it',
    open: [
      {
        title: 'Nothing held back',
        body: 'No paid edition with the rules, the console or single sign-on locked away. What is in the repository is the product.',
      },
      {
        title: 'Settings you can query',
        body: 'Sites, certificates and rules are rows in your database, so they can be backed up, audited and changed by your own scripts.',
      },
      {
        title: 'Built in the open',
        body: 'Next: deploying any application from Git, wildcard certificates from the console, roles in the console, and richer request records.',
      },
    ],
    compareTitle: 'How it compares',
    compareBody: 'One page per tool it replaces or gets weighed against.',
    compareAll: 'All comparisons',
    roadmap: 'See the roadmap',
  },
  zh: {
    seoTitle: 'CasWAF：开源反向代理与Web应用防火墙，Go语言实现',
    badge: 'Apache-2.0许可证，没有企业版',
    title: '带防火墙和管理界面的反向代理',
    subtitle: '所有站点都放在一个Go网关后面，HTTPS、规则和单点登录都在浏览器里管理。',
    lead: 'CasWAF放在Web应用前面，取代Nginx。在管理界面里添加站点，填上域名和应用地址，挂上证书和规则，几秒内所有网关节点都会生效。不用写配置文件，也不用重载。',
    start: '开始使用',
    copy: '复制命令',
    installNote: '需要Go、Node.js、MySQL和一个Casdoor应用。管理界面在17000端口。',
    howTitle: '一个请求怎么走',
    how: {
      visitors: '访客',
      visitorsBody: '浏览器、App和爬虫',
      steps: ['按域名选证书，提供HTTPS', '记录请求', '跳转，按需要求登录', '按顺序检查站点的规则'],
      verdicts: '每个请求',
      apps: '你的应用',
      appsBody: '任意HTTP服务，或一个静态文件目录',
    },
    verdicts: ['放行', '拦截', '验证码'],
    featuresTitle: '现在能做什么',
    features: [
      {
        icon: Globe2,
        title: '多个站点，一个网关',
        body: '按域名把请求转给对应的应用，支持附加域名、www和结尾斜杠跳转、多个上游，也能直接提供静态文件目录。支持WebSocket和HTTP/2。',
        href: 'sites/sites',
      },
      {
        icon: Lock,
        title: '省心的HTTPS',
        body: '每个连接按域名选证书，一张通配符证书覆盖所有子域名，Let’s Encrypt证书自动签发和续期，自动加上HSTS和Secure Cookie。',
        href: 'sites/https',
      },
      {
        icon: ShieldCheck,
        title: '每个站点前都有规则',
        body: '按IP段、境外流量、User-Agent和路径放行或拦截，按IP限流，用Coraza引擎跑ModSecurity规则，或者让可疑访客先过验证码。',
        href: 'rules/rules',
      },
      {
        icon: UserRoundCheck,
        title: '管理员和站点都能单点登录',
        body: '管理界面通过Casdoor登录，自带多因素认证、LDAP、SAML和第三方登录。任何内部工具都能挂上Casdoor登录，不用改它一行代码。',
        href: 'sites/login',
      },
      {
        icon: Activity,
        title: '看清进来的流量',
        body: '每个请求都有记录，仪表盘按站点和时间统计流量，列出访问最多的IP和爬虫，站点打不开时发邮件或短信告警。',
        href: 'monitoring/dashboard',
      },
      {
        icon: Layers,
        title: '多个节点，一份配置',
        body: '任意多台机器连同一个数据库运行网关，每台都服务所有站点，还能各自从Git自动更新。',
        href: 'operations/nodes',
      },
    ],
    more: '了解更多',
    openTitle: '完全开源',
    open: [
      {
        title: '没有阉割',
        body: '不会把规则、管理界面或单点登录放进收费版。仓库里有什么，产品就是什么。',
      },
      {
        title: '配置就是数据',
        body: '站点、证书和规则都是你数据库里的数据行，可以备份、审计，也能用自己的脚本修改。',
      },
      {
        title: '公开开发',
        body: '接下来要做：从Git部署任意应用，在管理界面里申请通配符证书，管理界面的角色权限，更详细的请求记录。',
      },
    ],
    compareTitle: '和别的工具比',
    compareBody: '每个比较对象一页，只写会影响选择的地方。',
    compareAll: '全部对比',
    roadmap: '查看路线图',
  },
};

export function getText(lang: string) {
  return text[lang as keyof typeof text] ?? text.en;
}
