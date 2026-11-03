// The comparison pages under /[lang]/compare, one per tool people weigh CasWAF against.
// Facts about the other tools were checked against their repositories and sites in November 2026.

export type CompareRow = { label: string; caswaf: string; other: string };
export type ComparePoint = { title: string; body: string };

export type ComparePage = {
  slug: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  lead: string;
  summary: string;
  table: CompareRow[];
  better: ComparePoint[];
  ahead: ComparePoint[];
  pick: string[];
  docs: { text: string; href: string }[];
};

export type CompareText = {
  indexTitle: string;
  indexDescription: string;
  indexLead: string;
  atAGlance: string;
  better: string;
  ahead: string;
  pick: string;
  read: string;
  back: string;
  ctaTitle: string;
  ctaBody: string;
  ctaStart: string;
  ctaDocs: string;
  docsTitle: string;
};

export const compareText: Record<'en' | 'zh', CompareText> = {
  en: {
    indexTitle: 'Compare CasWAF with other reverse proxies and WAFs',
    indexDescription:
      'CasWAF next to SafeLine, ModSecurity, BunkerWeb and Nginx: license, deployment, attack detection, editions, and which one to pick.',
    indexLead:
      'CasWAF sits where a reverse proxy sits and does part of the work of a web application firewall. These pages put it next to the tools people usually weigh it against, one page each, with the differences that decide the choice.',
    atAGlance: 'At a glance',
    better: 'Where CasWAF is different',
    ahead: 'Where {name} is ahead',
    pick: 'Which to pick',
    read: 'Read the comparison',
    back: 'All comparisons',
    ctaTitle: 'Try CasWAF on one machine',
    ctaBody: 'Go, Node.js and MySQL, a Casdoor application for the console, and the gateway starts on port 17000.',
    ctaStart: 'Get started',
    ctaDocs: 'Read the docs',
    docsTitle: 'Related pages',
  },
  zh: {
    indexTitle: 'CasWAF 与其他反向代理和 WAF 对比',
    indexDescription:
      'CasWAF 与 SafeLine、ModSecurity、BunkerWeb、Nginx 的逐项对比：许可证、部署方式、攻击检测、版本，以及该选哪个。',
    indexLead:
      'CasWAF 处在反向代理的位置，并承担了 Web 应用防火墙的一部分工作。下面每个页面把它和一个常见的比较对象放在一起，只写会影响选择的地方。',
    atAGlance: '一览',
    better: 'CasWAF 不一样的地方',
    ahead: '{name} 领先的地方',
    pick: '怎么选',
    read: '看对比',
    back: '全部对比',
    ctaTitle: '在一台机器上试试 CasWAF',
    ctaBody: '需要 Go、Node.js 和 MySQL，管理界面还要一个 Casdoor 应用，网关默认监听 17000 端口。',
    ctaStart: '快速上手',
    ctaDocs: '看文档',
    docsTitle: '相关页面',
  },
};

const en: ComparePage[] = [
  {
    slug: 'safeline',
    name: 'SafeLine',
    h1: 'CasWAF vs SafeLine',
    title: 'CasWAF vs SafeLine: two self-hosted WAFs compared',
    description:
      'SafeLine is a GPL-3.0 WAF with a semantic detection engine and a free tier capped at 10 applications. CasWAF is an Apache-2.0 reverse proxy with a console, rules and single sign-on. How they differ, and which to pick.',
    lead: 'SafeLine and CasWAF both sit in front of your web applications and decide which requests reach them. SafeLine is a WAF first: its own detection engine, a console built around reports, and a free edition that stops at 10 applications. CasWAF is a reverse proxy first: sites, certificates, redirects and login protection are part of it, the firewall is one of its rule types, and no feature is held back for a paid edition.',
    summary: 'A GPL-3.0 WAF with its own detection engine and a free tier capped at 10 applications.',
    table: [
      {
        label: 'License',
        caswaf: 'Apache-2.0, no paid edition',
        other: 'GPL-3.0 for the community edition; paid Lite, Pro and Ultimate',
      },
      {
        label: 'What it is',
        caswaf: 'Reverse proxy, firewall and console in one Go program',
        other: 'A WAF that sits as a reverse proxy in front of applications',
      },
      {
        label: 'How it runs',
        caswaf: 'One binary on Linux or Windows, next to MySQL',
        other: 'Docker Compose on a Linux host',
      },
      {
        label: 'Configured in',
        caswaf: 'The console; settings in MySQL, shared by every node',
        other: 'The web console',
      },
      {
        label: 'Attack detection',
        caswaf: 'IP, User-Agent, path and rate rules; CAPTCHA; ModSecurity SecLang rules on Coraza',
        other: 'Its own semantic analysis engine, plus rules',
      },
      {
        label: 'HTTPS certificates',
        caswaf: 'Uploaded by hand, or issued and renewed with Let’s Encrypt per domain',
        other: 'Uploaded in the console',
      },
      {
        label: 'Console login',
        caswaf: 'Casdoor: MFA, LDAP, SAML and social logins',
        other: 'Local accounts',
      },
      {
        label: 'Editions',
        caswaf: 'One, Apache-2.0',
        other: 'Free for up to 10 applications, then $10 to $100 a month',
      },
    ],
    better: [
      {
        title: 'Everything in one program',
        body: 'The gateway, the console and the rules are a single Go program. There is no Nginx, no Lua and no separate detection service to keep in step, and the same binary runs on Windows as well as Linux.',
      },
      {
        title: 'Settings in a database, not in files',
        body: 'Sites, certificates and rules live in MySQL, and every gateway node reads the same rows. A site added in the console reaches the other nodes within seconds, with nothing to template, copy or reload.',
      },
      {
        title: 'Single sign-on belongs to the product',
        body: 'The console signs in through Casdoor, so MFA, LDAP, SAML and social logins are already there. The same login can be put in front of any site without changing the application.',
      },
      {
        title: 'Apache-2.0 with no cap',
        body: 'There is no application limit and no paid tier to grow into. The license also asks less of you than the GPL if you modify the gateway and let others use it over a network.',
      },
      {
        title: 'Records, a dashboard and alerts',
        body: 'Every request is recorded per site, with a dashboard of traffic over time and an email or SMS when a site stops answering, rather than a firewall console only.',
      },
    ],
    ahead: [
      {
        title: 'Detection is the product',
        body: 'SafeLine ships a semantic analysis engine tuned to catch attacks without a hand-written ruleset. CasWAF gives you rule types and a ModSecurity engine; it does not bundle a detection engine of its own or the OWASP Core Rule Set.',
      },
      {
        title: 'HTML and JavaScript encryption',
        body: 'SafeLine can re-encrypt a page on every visit so that scrapers and automated tools cannot read the markup directly. CasWAF has nothing like it.',
      },
      {
        title: 'Bots and floods have their own settings',
        body: 'Anti-bot challenges, a password challenge for a whole site and HTTP flood protection are first-class features there. CasWAF covers the same ground with CAPTCHA and rate rules, which take more thought to tune.',
      },
      {
        title: 'A much larger community',
        body: 'SafeLine has over 23,000 stars, packages for Kubernetes ingress and Kong, and documentation in Chinese as well as English. Expect more ready-made answers when something goes wrong.',
      },
    ],
    pick: [
      'You want the strongest attack detection with the least tuning: **SafeLine**.',
      'You run many sites across several servers and want one console with single sign-on: **CasWAF**.',
      'You need more than 10 applications without a subscription: **CasWAF**.',
      'You already use Casdoor, or want internal tools behind a company login without changing them: **CasWAF**.',
    ],
    docs: [
      { text: 'Quick start', href: '/docs/getting-started/quickstart' },
      { text: 'WAF rules', href: '/docs/rules/waf' },
      { text: 'Login protection', href: '/docs/sites/login' },
    ],
  },
  {
    slug: 'modsecurity',
    name: 'ModSecurity',
    h1: 'CasWAF vs ModSecurity',
    title: 'CasWAF vs ModSecurity: a WAF engine and a whole gateway',
    description:
      'ModSecurity is an Apache-2.0 WAF engine that a web server such as Nginx or Apache loads. CasWAF is a complete reverse proxy that runs the same SecLang rules on Coraza, with a console, certificates and single sign-on.',
    lead: 'ModSecurity is not a product you install and browse. It is a WAF engine, libmodsecurity, that a web server loads: you still pick the server, write or import the rules, manage certificates, and find something to read when a request is blocked. CasWAF is the other shape. One program is the proxy, the firewall and the console, and it runs ModSecurity’s own SecLang rules on the Coraza engine.',
    summary: 'An Apache-2.0 WAF engine that embeds in Nginx, Apache or IIS, with no console of its own.',
    table: [
      {
        label: 'What it is',
        caswaf: 'Reverse proxy, firewall and console in one program',
        other: 'A WAF engine loaded by a web server',
      },
      {
        label: 'License',
        caswaf: 'Apache-2.0',
        other: 'Apache-2.0',
      },
      {
        label: 'Written in',
        caswaf: 'Go, rules run on Coraza',
        other: 'C++; connectors for Apache, Nginx and IIS',
      },
      {
        label: 'Where rules run',
        caswaf: 'Inside the gateway, on Coraza',
        other: 'Inside the web server, through a connector',
      },
      {
        label: 'Sites and certificates',
        caswaf: 'In the console, with Let’s Encrypt per domain',
        other: 'Left to the web server and to Certbot or similar',
      },
      {
        label: 'Console and records',
        caswaf: 'Built in, with a dashboard and alerts',
        other: 'None; logs go wherever the server sends them',
      },
      {
        label: 'Single sign-on',
        caswaf: 'Casdoor, for the console and for protected sites',
        other: 'None',
      },
    ],
    better: [
      {
        title: 'The parts around the engine are included',
        body: 'Sites, redirects, certificates, request records, a dashboard and alerts are in the same program. With ModSecurity you assemble those from the web server, Certbot, log shipping and something to read the logs.',
      },
      {
        title: 'Same rule language, one place to put it',
        body: 'SecRule lines go into a rule in the console exactly as they would into a ModSecurity configuration, and Coraza runs them. You keep the rules you already know and skip the server configuration around them.',
      },
      {
        title: 'Several nodes, one database',
        body: 'Every gateway node reads the same sites, certificates and rules, so a rule added on one machine applies on all of them. With ModSecurity each server’s configuration is its own.',
      },
      {
        title: 'Sign-in without extra work',
        body: 'The console uses Casdoor for MFA, LDAP, SAML and social logins, and the same login can protect any site. ModSecurity has no notion of a user.',
      },
      {
        title: 'Windows is a first-class target',
        body: 'CasWAF runs as a single binary on Windows as well as Linux. ModSecurity on Windows means the IIS connector, which is a much narrower path.',
      },
    ],
    ahead: [
      {
        title: 'It defines the language',
        body: 'ModSecurity v3, and the v2 Apache module before it, is where SecLang comes from. New directives and operators appear there first, and Coraza implements the language rather than defining it.',
      },
      {
        title: 'Every directive, eventually',
        body: 'Coraza covers the directives and operators that real rulesets use, which is not the same as every last one. A large, unusual ModSecurity configuration may need testing before it behaves identically.',
      },
      {
        title: 'It embeds in Apache and IIS',
        body: 'The v2 module runs inside Apache, and there is an IIS connector. CasWAF is always a proxy in front of the application, which is a different deployment.',
      },
      {
        title: 'Two decades of scrutiny',
        body: 'ModSecurity has been audited, deployed and broken for far longer, and the OWASP Core Rule Set is built and tuned for it. That history is worth something on its own.',
      },
    ],
    pick: [
      'You already run Nginx or Apache and only want the engine: **ModSecurity** with the Core Rule Set.',
      'You want the proxy, certificates, rules, records and console in one place: **CasWAF**.',
      'You have a ModSecurity ruleset you trust: **CasWAF** runs SecLang on Coraza, but test the ruleset first.',
      'You need the firewall inside Apache or IIS itself: **ModSecurity**.',
    ],
    docs: [
      { text: 'WAF rules', href: '/docs/rules/waf' },
      { text: 'Quick start', href: '/docs/getting-started/quickstart' },
      { text: 'Certificates', href: '/docs/certificates/certificates' },
    ],
  },
  {
    slug: 'bunkerweb',
    name: 'BunkerWeb',
    h1: 'CasWAF vs BunkerWeb',
    title: 'CasWAF vs BunkerWeb: two open-source WAFs compared',
    description:
      'BunkerWeb is an AGPL-3.0 WAF built on Nginx, with the OWASP Core Rule Set on by default and a paid Pro edition. CasWAF is a single Go program under Apache-2.0 with the console and single sign-on inside it.',
    lead: 'BunkerWeb is a full-featured WAF and reverse proxy built on Nginx. It turns protections on by default, deploys with Docker and Kubernetes first, and carries a Pro edition and a hosted service on top of the open source one. CasWAF is the opposite bet: one Go program, the console inside it, settings in a database, Apache-2.0 all the way through, and nothing to upgrade to.',
    summary: 'An AGPL-3.0 WAF built on Nginx, with the OWASP Core Rule Set on by default and a paid Pro edition.',
    table: [
      {
        label: 'License',
        caswaf: 'Apache-2.0, no paid edition',
        other: 'AGPL-3.0, with Pro and a hosted Cloud',
      },
      {
        label: 'Built on',
        caswaf: 'A single Go program; no Nginx underneath',
        other: 'Nginx',
      },
      {
        label: 'Deployment',
        caswaf: 'One binary on Linux or Windows',
        other: 'Docker, Kubernetes, Swarm, Linux packages, Azure',
      },
      {
        label: 'Configured in',
        caswaf: 'The console; settings in MySQL, shared by every node',
        other: 'Environment variables or the web UI',
      },
      {
        label: 'Protection by default',
        caswaf: 'The rules you add; no rule set is bundled',
        other: 'ModSecurity with the OWASP Core Rule Set, bans, anti-bot, limits',
      },
      {
        label: 'Console login',
        caswaf: 'Casdoor: MFA, LDAP, SAML and social logins',
        other: 'Local accounts',
      },
      {
        label: 'Editions',
        caswaf: 'One, Apache-2.0',
        other: 'Open source, Pro, and a managed cloud',
      },
    ],
    better: [
      {
        title: 'Apache-2.0 instead of AGPL-3.0',
        body: 'If you modify BunkerWeb and let other people use it over the network, the AGPL asks you to publish those changes. Apache-2.0 only asks for attribution, which matters when a gateway is part of something you ship.',
      },
      {
        title: 'No Nginx underneath',
        body: 'The gateway, the console and the rules are one Go program. There is no second web server to configure, patch or reason about, and the same binary runs on Windows.',
      },
      {
        title: 'Settings in a database',
        body: 'Sites, certificates and rules live in MySQL and every node reads the same rows, which makes several gateways behind one database the normal case rather than an integration.',
      },
      {
        title: 'Single sign-on is part of the console',
        body: 'Casdoor brings MFA, LDAP, SAML and social logins to the console, and the same login can be put in front of any site. BunkerWeb’s accounts are local to it.',
      },
      {
        title: 'Nothing held back',
        body: 'There is no Pro edition and no hosted service to move to, so every feature in the manual is in the program you download.',
      },
    ],
    ahead: [
      {
        title: 'Protections are on when it starts',
        body: 'BunkerWeb ships the OWASP Core Rule Set, bans on bad behavior, anti-bot challenges and connection limits already wired up. CasWAF gives you the rule types and an empty rule list; you decide what to add.',
      },
      {
        title: 'Wider deployment story',
        body: 'Kubernetes, Docker Swarm, autoconf for containers, Azure and Linux packages are all first-class. CasWAF expects a binary and a database, and the cluster integrations are yours to build.',
      },
      {
        title: 'A plugin system',
        body: 'BunkerWeb extensions can add features without touching the core. CasWAF has no plugin API; what the gateway does is what the release does.',
      },
      {
        title: 'Reports in the UI',
        body: 'Its console is built around seeing what was blocked and why, which is further along than the records and dashboard in CasWAF today.',
      },
    ],
    pick: [
      'You want broad protection switched on out of the box, on Kubernetes: **BunkerWeb**.',
      'You want one Apache-2.0 program with the console and SSO inside it: **CasWAF**.',
      'You manage sites on a few servers and want one database behind them: **CasWAF**.',
      'You need a vendor behind a self-hosted WAF: **BunkerWeb Pro**.',
    ],
    docs: [
      { text: 'Quick start', href: '/docs/getting-started/quickstart' },
      { text: 'Rules', href: '/docs/rules/rules' },
      { text: 'Nodes', href: '/docs/operations/nodes' },
    ],
  },
  {
    slug: 'nginx',
    name: 'Nginx',
    h1: 'CasWAF vs Nginx',
    title: 'CasWAF vs Nginx: a WAF and a console for the reverse proxy',
    description:
      'Nginx is a BSD-2-Clause web server and reverse proxy; a firewall on top means adding ModSecurity or Coraza, a ruleset, certificate renewal and a way to read the logs. CasWAF packages all of it as one Go program under Apache-2.0.',
    lead: 'Nginx is a web server and reverse proxy, and it is very good at both. CasWAF is a reverse proxy that also does the firewall job. Putting a WAF in front of Nginx usually means adding ModSecurity or Coraza, a ruleset, something for certificate renewal and something to read when a request is blocked. CasWAF puts those in one program, keeps the settings in a database, and adds a console, request records and single sign-on.',
    summary: 'A BSD-2-Clause web server and reverse proxy with no firewall, console or SSO of its own.',
    table: [
      {
        label: 'What it is',
        caswaf: 'Reverse proxy with a firewall, console and SSO',
        other: 'Web server and reverse proxy',
      },
      {
        label: 'Firewall',
        caswaf: 'Built in: IP, path, rate and CAPTCHA rules, plus SecLang on Coraza',
        other: 'Not built in; add ModSecurity, Coraza or njs and Lua',
      },
      {
        label: 'Configured in',
        caswaf: 'The console; settings in MySQL, shared by every node',
        other: 'Configuration files, then a reload',
      },
      {
        label: 'Certificates',
        caswaf: 'Uploaded by hand, or issued and renewed with Let’s Encrypt per domain',
        other: 'Certbot or manual files',
      },
      {
        label: 'Console, records, dashboard',
        caswaf: 'Built in, with alerts per site',
        other: 'None; logs go to files or a log stack',
      },
      {
        label: 'Single sign-on for your sites',
        caswaf: 'Casdoor login in front of any site, without changing it',
        other: 'None; auth_request modules or an external service',
      },
      {
        label: 'License',
        caswaf: 'Apache-2.0',
        other: 'BSD-2-Clause; Nginx Plus is a paid product',
      },
    ],
    better: [
      {
        title: 'A firewall without assembling modules',
        body: 'Blocking by IP range, country, User-Agent or path, rate limiting per address and CAPTCHA are rule types in the console. On Nginx each one means another module, another file and another reload.',
      },
      {
        title: 'Change a site without editing a file',
        body: 'A domain, a certificate or a redirect is a form in the console, and every gateway node picks it up in seconds. There is no configuration to template, copy between servers or validate by hand.',
      },
      {
        title: 'See what came in',
        body: 'Requests are recorded per site, with a dashboard of traffic over time and an alert by email or SMS when a site stops answering. With Nginx that is a separate log pipeline.',
      },
      {
        title: 'Put a login in front of an application',
        body: 'Any site can be put behind a Casdoor login without touching the application, with MFA, LDAP and social logins coming from Casdoor. On Nginx this is auth_request plus your own service.',
      },
      {
        title: 'Several machines, one configuration',
        body: 'Nodes run against one database and all serve the same sites, which is the normal setup rather than a fleet of hand-managed configurations.',
      },
    ],
    ahead: [
      {
        title: 'Throughput and maturity',
        body: 'Nginx handles more traffic per core and has been tuned in production for twenty years. CasWAF is a Go program with a database behind it, and does not claim to match it.',
      },
      {
        title: 'Far more as a web server',
        body: 'Caching, compression, fine control over buffering and timeouts, static file serving at scale and TCP and UDP streams are all Nginx features CasWAF does not have.',
      },
      {
        title: 'Modules and documentation',
        body: 'The module ecosystem and the amount of written material about every corner of Nginx are much larger than anything a young project can offer.',
      },
      {
        title: 'You already run it',
        body: 'If Nginx is working and the firewall is not the problem, staying put is a reasonable answer.',
      },
    ],
    pick: [
      'You need a WAF, a console and SSO without adding modules: **CasWAF**.',
      'You serve heavy static traffic or need caching, streams or a module CasWAF does not have: keep **Nginx** and put CasWAF in front of it, or in front of the applications it serves.',
      'You manage many sites and want them in one console: **CasWAF**.',
      'You are happy editing configuration files and only want raw performance: **Nginx**.',
    ],
    docs: [
      { text: 'Sites', href: '/docs/sites/sites' },
      { text: 'Rules', href: '/docs/rules/rules' },
      { text: 'Client IP behind a proxy', href: '/docs/operations/client-ip' },
    ],
  },
];

const zh: ComparePage[] = [
  {
    slug: 'safeline',
    name: 'SafeLine（雷池）',
    h1: 'CasWAF 与 SafeLine 对比',
    title: 'CasWAF 与 SafeLine（雷池）对比：两个自建 WAF 怎么选',
    description:
      'SafeLine 是 GPL-3.0 的 WAF，有自己的语义检测引擎，免费版最多 10 个应用。CasWAF 是 Apache-2.0 的反向代理，管理界面、规则和单点登录都在里面。两者的差别和选择方式。',
    lead: 'SafeLine 和 CasWAF 都挡在 Web 应用前面，决定哪些请求能到应用。SafeLine 首先是一个 WAF：自己的检测引擎、围绕报告做的管理界面，免费版到 10 个应用为止。CasWAF 首先是一个反向代理：站点、证书、跳转和登录保护本来就是它的一部分，防火墙只是它的一种规则，而且没有保留给付费版的功能。',
    summary: 'GPL-3.0 的 WAF，自带检测引擎，免费版最多 10 个应用。',
    table: [
      {
        label: '许可证',
        caswaf: 'Apache-2.0，没有付费版',
        other: '社区版 GPL-3.0，另有付费的 Lite、Pro、Ultimate',
      },
      {
        label: '是什么',
        caswaf: '反向代理、防火墙和管理界面，一个 Go 程序',
        other: '作为反向代理挡在应用前面的 WAF',
      },
      {
        label: '怎么运行',
        caswaf: 'Linux 或 Windows 上的一个可执行文件，加一个 MySQL',
        other: 'Linux 上的 Docker Compose',
      },
      {
        label: '怎么配置',
        caswaf: '管理界面，设置存在 MySQL，所有节点共用',
        other: '网页管理界面',
      },
      {
        label: '攻击检测',
        caswaf: 'IP、User-Agent、路径和频率规则，验证码，基于 Coraza 的 ModSecurity 规则',
        other: '自己的语义分析引擎，加规则',
      },
      {
        label: 'HTTPS 证书',
        caswaf: '手动上传，或按域名用 Let’s Encrypt 自动签发和续期',
        other: '在管理界面上传',
      },
      {
        label: '管理界面登录',
        caswaf: 'Casdoor，带多因素认证、LDAP、SAML 和第三方登录',
        other: '本地账号',
      },
      {
        label: '版本',
        caswaf: '一个版本，Apache-2.0',
        other: '免费版最多 10 个应用，付费每月 10 到 100 美元',
      },
    ],
    better: [
      {
        title: '所有东西在一个程序里',
        body: '网关、管理界面和规则是同一个 Go 程序。底下没有 Nginx、没有 Lua，也没有另一个需要同步的检测服务，同一个可执行文件在 Windows 和 Linux 上都能跑。',
      },
      {
        title: '设置存在数据库里，不存文件里',
        body: '站点、证书和规则都在 MySQL 里，每个网关节点读的是同一批行。在管理界面里加一个站点，几秒内就到其他节点，不需要套模板、复制文件或重新加载。',
      },
      {
        title: '单点登录是产品自带的一部分',
        body: '管理界面通过 Casdoor 登录，多因素认证、LDAP、SAML 和第三方登录都已经有了。同一个登录可以放在任何站点前面，不用改应用。',
      },
      {
        title: 'Apache-2.0，没有上限',
        body: '没有应用数量限制，也没有需要升级过去的付费版。如果你改了它再通过网络提供给其他人用，这个许可证的要求也比 GPL 少。',
      },
      {
        title: '请求记录、看板和告警',
        body: '每个请求按站点记录下来，有按时间的流量看板，站点不再响应时发邮件或短信，而不只是一个防火墙控制台。',
      },
    ],
    ahead: [
      {
        title: '检测本身就是它的产品',
        body: 'SafeLine 自带一个语义分析引擎，不用写规则也能拦攻击。CasWAF 提供的是规则类型和一个 ModSecurity 引擎，不自带检测引擎，也不捆绑 OWASP Core Rule Set。',
      },
      {
        title: 'HTML 和 JavaScript 加密',
        body: 'SafeLine 可以每次访问都重新加密页面，让采集工具读不到原始代码。CasWAF 没有对应的功能。',
      },
      {
        title: '机器人防护和洪水攻击有专门设置',
        body: '反机器人挑战、整站口令验证和 HTTP 洪水防护在那边是一等功能。CasWAF 用验证码和频率规则覆盖同样的问题，调起来要自己多想。',
      },
      {
        title: '社区大得多',
        body: 'SafeLine 有两万三千多 star，有 Kubernetes ingress 和 Kong 的插件，文档有中文也有英文。出问题时能找到的现成答案更多。',
      },
    ],
    pick: [
      '想用最少的调整获得最强的攻击检测：**SafeLine**。',
      '在多台服务器上管很多站点，想把它们放进一个带单点登录的管理界面：**CasWAF**。',
      '应用超过 10 个，又不想订阅：**CasWAF**。',
      '已经在用 Casdoor，或者想把内部工具放在公司登录后面而不改它们：**CasWAF**。',
    ],
    docs: [
      { text: '快速上手', href: '/docs/getting-started/quickstart' },
      { text: 'WAF规则', href: '/docs/rules/waf' },
      { text: '登录保护', href: '/docs/sites/login' },
    ],
  },
  {
    slug: 'modsecurity',
    name: 'ModSecurity',
    h1: 'CasWAF 与 ModSecurity 对比',
    title: 'CasWAF 与 ModSecurity 对比：一个引擎和一套网关',
    description:
      'ModSecurity 是 Apache-2.0 的 WAF 引擎，由 Nginx、Apache 这类Web服务器加载。CasWAF 是完整的反向代理，在 Coraza 上跑同样的 SecLang 规则，带管理界面、证书和单点登录。',
    lead: 'ModSecurity 不是装好就能点开用的产品。它是一个 WAF 引擎 libmodsecurity，由Web服务器加载：服务器还要你自己选，规则要自己写或导入，证书要自己管，请求被拦了还要找地方看。CasWAF 是另一种形态：一个程序同时是代理、防火墙和管理界面，跑的是 ModSecurity 自己的 SecLang 规则，引擎换成了 Coraza。',
    summary: 'Apache-2.0 的 WAF 引擎，嵌在 Nginx、Apache 或 IIS 里，自己没有管理界面。',
    table: [
      {
        label: '是什么',
        caswaf: '反向代理、防火墙和管理界面，一个程序',
        other: '由Web服务器加载的 WAF 引擎',
      },
      {
        label: '许可证',
        caswaf: 'Apache-2.0',
        other: 'Apache-2.0',
      },
      {
        label: '用什么写的',
        caswaf: 'Go，规则跑在 Coraza 上',
        other: 'C++，另有 Apache、Nginx、IIS 的连接器',
      },
      {
        label: '规则跑在哪',
        caswaf: '网关进程里，Coraza 上',
        other: 'Web服务器里，通过连接器',
      },
      {
        label: '站点和证书',
        caswaf: '在管理界面里，按域名用 Let’s Encrypt',
        other: '交给Web服务器和 Certbot 之类',
      },
      {
        label: '管理界面和记录',
        caswaf: '自带，有看板和告警',
        other: '没有，日志送到哪里就在哪里看',
      },
      {
        label: '单点登录',
        caswaf: 'Casdoor，管理界面和受保护站点共用',
        other: '没有用户的概念',
      },
    ],
    better: [
      {
        title: '引擎周围的部分都带了',
        body: '站点、跳转、证书、请求记录、看板和告警都在同一个程序里。用 ModSecurity 时这些要自己从Web服务器、Certbot、日志采集和日志查看工具里拼出来。',
      },
      {
        title: '同一种规则语言，只放在一个地方',
        body: 'SecRule 写在管理界面的规则里，和写在 ModSecurity 配置里一样，由 Coraza 执行。已经会写的规则可以照用，省掉外面那层服务器配置。',
      },
      {
        title: '多节点一个库',
        body: '每个网关节点读同样的站点、证书和规则，在一台机器上加的规则在所有机器上生效。用 ModSecurity 时每台服务器的配置各管各的。',
      },
      {
        title: '登录不用另外做',
        body: '管理界面用 Casdoor 做多因素认证、LDAP、SAML 和第三方登录，同一个登录可以保护任何站点。ModSecurity 没有用户的概念。',
      },
      {
        title: 'Windows 是一等目标',
        body: 'CasWAF 在 Windows 和 Linux 上都是单个可执行文件。ModSecurity 在 Windows 上只有 IIS 连接器，路窄得多。',
      },
    ],
    ahead: [
      {
        title: '语言是它定义的',
        body: 'SecLang 来自 ModSecurity v3，以及更早的 v2 Apache 模块。新的指令和操作符先出现在那里，Coraza 是照着实现这门语言，而不是定义它。',
      },
      {
        title: '指令支持更全',
        body: 'Coraza 覆盖了真实规则集用到的指令和操作符，但不等于每一条都支持。一套很大、很特别的 ModSecurity 配置，行为要测过才能确认一致。',
      },
      {
        title: '能嵌进 Apache 和 IIS',
        body: 'v2 模块跑在 Apache 进程里，还有 IIS 连接器。CasWAF 始终是挡在应用前面的代理，部署形态不同。',
      },
      {
        title: '二十年的检验',
        body: 'ModSecurity 被审计、被部署、被打穿的时间长得多，OWASP Core Rule Set 也是为它写和调的。这段历史本身就有价值。',
      },
    ],
    pick: [
      '已经在跑 Nginx 或 Apache，只要那个引擎：**ModSecurity** 加 Core Rule Set。',
      '想把代理、证书、规则、记录和管理界面放在一起：**CasWAF**。',
      '有一套信得过的 ModSecurity 规则：**CasWAF** 用 Coraza 跑 SecLang，但先测一遍。',
      '防火墙必须在 Apache 或 IIS 进程里：**ModSecurity**。',
    ],
    docs: [
      { text: 'WAF规则', href: '/docs/rules/waf' },
      { text: '快速上手', href: '/docs/getting-started/quickstart' },
      { text: '证书', href: '/docs/certificates/certificates' },
    ],
  },
  {
    slug: 'bunkerweb',
    name: 'BunkerWeb',
    h1: 'CasWAF 与 BunkerWeb 对比',
    title: 'CasWAF 与 BunkerWeb 对比：两个开源 WAF',
    description:
      'BunkerWeb 是基于 Nginx 的 AGPL-3.0 WAF，默认开着 OWASP Core Rule Set，另有付费的 Pro 版。CasWAF 是单个 Go 程序，Apache-2.0，管理界面和单点登录都在里面。',
    lead: 'BunkerWeb 是基于 Nginx 的 WAF 和反向代理。它默认把很多防护打开，部署以 Docker 和 Kubernetes 为主，开源版之上还有 Pro 版和托管服务。CasWAF 押的是另一边：一个 Go 程序，管理界面在里面，设置存在数据库，从头到尾 Apache-2.0，没有可以升级过去的版本。',
    summary: '基于 Nginx 的 AGPL-3.0 WAF，默认开启 OWASP Core Rule Set，另有付费 Pro 版。',
    table: [
      {
        label: '许可证',
        caswaf: 'Apache-2.0，没有付费版',
        other: 'AGPL-3.0，另有 Pro 和托管云',
      },
      {
        label: '基于什么',
        caswaf: '一个 Go 程序，底下没有 Nginx',
        other: 'Nginx',
      },
      {
        label: '部署',
        caswaf: 'Linux 或 Windows 上一个可执行文件',
        other: 'Docker、Kubernetes、Swarm、Linux 包、Azure',
      },
      {
        label: '怎么配置',
        caswaf: '管理界面，设置存在 MySQL，所有节点共用',
        other: '环境变量或网页界面',
      },
      {
        label: '默认防护',
        caswaf: '自己加的规则，不捆绑规则集',
        other: '带 OWASP Core Rule Set 的 ModSecurity、按行为封禁、反机器人、连接限制',
      },
      {
        label: '管理界面登录',
        caswaf: 'Casdoor，带多因素认证、LDAP、SAML 和第三方登录',
        other: '本地账号',
      },
      {
        label: '版本',
        caswaf: '一个版本，Apache-2.0',
        other: '开源版、Pro 版、托管云',
      },
    ],
    better: [
      {
        title: 'Apache-2.0，不是 AGPL-3.0',
        body: '改了 BunkerWeb 再通过网络提供给其他人用，AGPL 要求你公开这些改动。Apache-2.0 只要求署名，网关作为你要交付的产品的一部分时，这个区别有实际影响。',
      },
      {
        title: '底下没有 Nginx',
        body: '网关、管理界面和规则是一个 Go 程序。没有第二个需要配置、打补丁和理解的Web服务器，同一个可执行文件在 Windows 上也能跑。',
      },
      {
        title: '设置存在数据库里',
        body: '站点、证书和规则都在 MySQL 里，每个节点读同一批行，所以一个库后面挂几个网关是常规用法，不需要额外的集成。',
      },
      {
        title: '单点登录是管理界面的一部分',
        body: 'Casdoor 把多因素认证、LDAP、SAML 和第三方登录带进管理界面，同一个登录可以放在任何站点前面。BunkerWeb 的账号只在它自己里面。',
      },
      {
        title: '没有保留功能',
        body: '没有 Pro 版，也没有要迁过去的托管服务，文档里写的每个功能都在你下载的程序里。',
      },
    ],
    ahead: [
      {
        title: '启动时防护就开着',
        body: 'BunkerWeb 自带 OWASP Core Rule Set，按不良行为封禁、反机器人挑战和连接限制都已经接好。CasWAF 提供规则类型和一个空的规则列表，加什么由你决定。',
      },
      {
        title: '部署方式更多',
        body: 'Kubernetes、Docker Swarm、面向容器的 autoconf、Azure 和 Linux 包都是一等支持。CasWAF 要的是一个可执行文件和一个数据库，集群方面要自己搭。',
      },
      {
        title: '插件系统',
        body: 'BunkerWeb 的扩展能不动核心就加功能。CasWAF 没有插件接口，发布版有什么就是什么。',
      },
      {
        title: '界面里的报告',
        body: '它的管理界面就是围绕“拦了什么、为什么拦”做的，比 CasWAF 现在的请求记录和看板走得更远。',
      },
    ],
    pick: [
      '想在 Kubernetes 上开箱就有广泛防护：**BunkerWeb**。',
      '想要一个 Apache-2.0 的程序，管理界面和单点登录都在里面：**CasWAF**。',
      '在几台服务器上管站点，想让它们共用一个数据库：**CasWAF**。',
      '自建 WAF 需要有厂商在后面支持：**BunkerWeb Pro**。',
    ],
    docs: [
      { text: '快速上手', href: '/docs/getting-started/quickstart' },
      { text: '规则', href: '/docs/rules/rules' },
      { text: '节点', href: '/docs/operations/nodes' },
    ],
  },
  {
    slug: 'nginx',
    name: 'Nginx',
    h1: 'CasWAF 与 Nginx 对比',
    title: 'CasWAF 与 Nginx 对比：给反向代理加上防火墙和管理界面',
    description:
      'Nginx 是 BSD-2-Clause 的Web服务器和反向代理，要做防火墙得加 ModSecurity 或 Coraza、规则集、证书续期和看日志的地方。CasWAF 把这些打成一个 Apache-2.0 的 Go 程序。',
    lead: 'Nginx 是Web服务器和反向代理，这两件事做得很好。CasWAF 是一个顺带做防火墙的反向代理。在 Nginx 前面加 WAF 通常意味着加 ModSecurity 或 Coraza、一套规则、证书续期的办法，以及请求被拦时看日志的地方。CasWAF 把这些放进一个程序，设置存在数据库里，再加管理界面、请求记录和单点登录。',
    summary: 'BSD-2-Clause 的Web服务器和反向代理，自己没有防火墙、管理界面和单点登录。',
    table: [
      {
        label: '是什么',
        caswaf: '反向代理，带防火墙、管理界面和单点登录',
        other: 'Web服务器和反向代理',
      },
      {
        label: '防火墙',
        caswaf: '自带：IP、路径、频率、验证码规则，以及 Coraza 上的 SecLang',
        other: '不自带，要加 ModSecurity、Coraza 或 njs 和 Lua',
      },
      {
        label: '怎么配置',
        caswaf: '管理界面，设置存在 MySQL，所有节点共用',
        other: '配置文件，改完 reload',
      },
      {
        label: '证书',
        caswaf: '手动上传，或按域名用 Let’s Encrypt 自动签发和续期',
        other: 'Certbot 或手动放文件',
      },
      {
        label: '管理界面、记录、看板',
        caswaf: '自带，按站点告警',
        other: '没有，日志写到文件或日志系统',
      },
      {
        label: '站点的单点登录',
        caswaf: '任何站点前面都可以加 Casdoor 登录，不用改应用',
        other: '没有，要 auth_request 模块或外部服务',
      },
      {
        label: '许可证',
        caswaf: 'Apache-2.0',
        other: 'BSD-2-Clause，Nginx Plus 是付费产品',
      },
    ],
    better: [
      {
        title: '不用拼模块就有防火墙',
        body: '按 IP 段、国家、User-Agent 或路径拦截，按地址限流，验证码，这些在管理界面里都是规则类型。在 Nginx 上每一样都意味着另一个模块、另一个文件、又一次 reload。',
      },
      {
        title: '改站点不用改文件',
        body: '加域名、换证书、加跳转都是管理界面里的表单，几秒内所有网关节点生效。没有配置需要套模板、在服务器之间复制或手工校验。',
      },
      {
        title: '看得见进来的流量',
        body: '请求按站点记录，有按时间的流量看板，站点不响应时发邮件或短信。用 Nginx 时这是一条另外搭的日志链路。',
      },
      {
        title: '在应用前面加登录',
        body: '任何站点都可以放在 Casdoor 登录后面，不用改应用，多因素认证、LDAP 和第三方登录都来自 Casdoor。在 Nginx 上是 auth_request 加你自己写的一个服务。',
      },
      {
        title: '多台机器，一份配置',
        body: '节点连同一个数据库，服务同一批站点，这是常规用法，而不是一堆各自手工维护的配置。',
      },
    ],
    ahead: [
      {
        title: '吞吐量和成熟度',
        body: 'Nginx 每核处理的流量更多，在生产里被调了二十年。CasWAF 是一个带数据库的 Go 程序，不声称能比。',
      },
      {
        title: '作为Web服务器强得多',
        body: '缓存、压缩、对缓冲和超时的精细控制、大规模静态文件服务、TCP 和 UDP stream，这些都是 Nginx 有而 CasWAF 没有的。',
      },
      {
        title: '模块和文档',
        body: 'Nginx 的模块生态，以及关于它每个角落的写作量，都不是一个年轻项目能比的。',
      },
      {
        title: '你已经在用它',
        body: '如果 Nginx 跑得好好的，防火墙也不是你的问题，继续用是合理的答案。',
      },
    ],
    pick: [
      '需要防火墙、管理界面和单点登录，又不想加模块：**CasWAF**。',
      '要扛大量静态流量，或者需要缓存、stream、CasWAF 没有的模块：留着 **Nginx**，把 CasWAF 放在它或者它后面的应用前面。',
      '管很多站点，想把它们放进一个管理界面：**CasWAF**。',
      '习惯改配置文件，只要原始性能：**Nginx**。',
    ],
    docs: [
      { text: '站点', href: '/docs/sites/sites' },
      { text: '规则', href: '/docs/rules/rules' },
      { text: '代理后的客户端IP', href: '/docs/operations/client-ip' },
    ],
  },
];

export const comparePages: Record<'en' | 'zh', ComparePage[]> = { en, zh };

export function getComparePages(lang: string): ComparePage[] {
  return comparePages[lang as 'en' | 'zh'] ?? en;
}

export function getComparePage(lang: string, slug: string): ComparePage | undefined {
  return getComparePages(lang).find((page) => page.slug === slug);
}

export function getCompareText(lang: string): CompareText {
  return compareText[lang as 'en' | 'zh'] ?? compareText.en;
}