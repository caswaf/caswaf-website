import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from './i18n';
import { appName, repoUrl } from './shared';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: 'English' },
    zh: {
      displayName: '中文',
      'Ask AI(AI chat button)': '问AI',
      'Back to Home(404 not found page)': '返回首页',
      'Choose a language(language switcher)': '选择语言',
      'Choose a language(language switcher)(aria-label)': '选择语言',
      'Close Banner(banner)(aria-label)': '关闭横幅',
      'Close Search(search dialog)(aria-label)': '关闭搜索',
      'Close Sidebar(aria-label)': '关闭侧边栏',
      'Close Sidebar(sidebar)(aria-label)': '关闭侧边栏',
      'Collapse Sidebar(sidebar)(aria-label)': '收起侧边栏',
      'Copied Anchor Link(heading anchor)(aria-label)': '已复制锚点链接',
      'Copied Link(accordion)(aria-label)': '已复制链接',
      'Copied Markdown(page actions)': '已复制Markdown',
      'Copied Text(code block)(aria-label)': '已复制',
      'Copy Anchor Link(heading anchor)(aria-label)': '复制锚点链接',
      'Copy Link(accordion)(aria-label)': '复制链接',
      'Copy Markdown(page actions)': '复制Markdown',
      'Copy Text(code block)(aria-label)': '复制',
      'Dark(theme switcher)(aria-label)': '深色',
      'Default(type table)': '默认值',
      'Edit on GitHub(edit page)': '在GitHub上编辑',
      'Hide Sidebar(sidebar)': '隐藏侧边栏',
      'Last updated on(page footer)': '最后更新于',
      'Layout Tab(layout tab trigger)': '布局标签',
      'Light(theme switcher)(aria-label)': '浅色',
      'Next Page(pagination)': '下一页',
      'No Headings(table of contents)': '没有标题',
      'No results found(search dialog)': '没有找到结果',
      'On this page(table of contents)': '本页内容',
      'Open Search(search trigger)(aria-label)': '打开搜索',
      'Open Sidebar(aria-label)': '打开侧边栏',
      'Open Sidebar(sidebar)(aria-label)': '打开侧边栏',
      'Open in ChatGPT(page actions)': '在ChatGPT中打开',
      'Open in Claude(page actions)': '在Claude中打开',
      'Open in Cursor(page actions)': '在Cursor中打开',
      'Open in GitHub(page actions)': '在GitHub中打开',
      'Open in Scira AI(page actions)': '在Scira AI中打开',
      'Open(page actions)': '打开',
      'Page Not Found(404 not found page)': '页面不存在',
      'Parameters(type table)': '参数',
      'Previous Page(pagination)': '上一页',
      'Prop(type table)': '属性',
      'Read {url}, I want to ask questions about it.(page actions)': '阅读{url}，我想就它提几个问题。',
      'Returns(type table)': '返回值',
      'Search(search dialog)': '搜索文档',
      'Search(search trigger)': '搜索',
      'Show Sidebar(sidebar)': '显示侧边栏',
      'System(theme switcher)(aria-label)': '跟随系统',
      'Table of Contents(inline table of contents)': '目录',
      'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
        '你要找的页面可能已被删除、改名，或暂时无法访问。',
      'Toggle Menu(home layout header)(aria-label)': '切换菜单',
      'Toggle Theme(theme switcher)(aria-label)': '切换主题',
      'Type(type table)': '类型',
      'View as Markdown(page actions)': '以Markdown查看',
    },
  });

const navText = {
  en: { docs: 'Docs', roadmap: 'Roadmap', community: 'Community' },
  zh: { docs: '文档', roadmap: '路线图', community: '社区' },
};

const community = [
  { text: 'GitHub', url: repoUrl },
  { text: 'Casdoor', url: 'https://casdoor.ai' },
  { text: 'Casvisor', url: 'https://casvisor.org' },
];

export function baseOptions(lang: string): BaseLayoutProps {
  const text = navText[lang as keyof typeof navText] ?? navText.en;
  return {
    nav: {
      title: (
        <>
          <Image src="/logo192.png" alt="" width={24} height={24} />
          <span className="font-semibold">{appName}</span>
        </>
      ),
      url: `/${lang}`,
    },
    links: [
      { text: text.docs, url: `/${lang}/docs`, active: 'nested-url' },
      { text: text.roadmap, url: `/${lang}/docs/more/roadmap` },
      {
        type: 'menu',
        text: text.community,
        items: community.map((link) => ({ ...link, external: true })),
      },
    ],
    githubUrl: repoUrl,
  };
}

export function footerLinks(lang: string) {
  const zh = lang === 'zh';
  return [
    {
      title: zh ? '文档' : 'Docs',
      items: [
        { text: zh ? '介绍' : 'Introduction', url: `/${lang}/docs/getting-started/introduction` },
        { text: zh ? '快速上手' : 'Quick start', url: `/${lang}/docs/getting-started/quickstart` },
        { text: zh ? '规则' : 'Rules', url: `/${lang}/docs/rules/rules` },
        { text: zh ? '路线图' : 'Roadmap', url: `/${lang}/docs/more/roadmap` },
      ],
    },
    { title: zh ? '社区' : 'Community', items: community },
    {
      title: zh ? '相关项目' : 'Related',
      items: [
        { text: 'Casdoor', url: 'https://casdoor.ai' },
        { text: 'Apache Casbin', url: 'https://casbin.apache.org' },
        { text: 'Coraza', url: 'https://coraza.io' },
      ],
    },
  ];
}
