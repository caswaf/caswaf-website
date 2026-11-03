import { loader } from 'fumadocs-core/source';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { i18n } from './i18n';

// Posts live in content/blog/<lang>/<yyyy-mm-dd>-<slug>.md; the date is in the file name,
// so front matter stays the same as the docs.
const blog = defineDocs({
  dir: 'content/blog',
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
});

export const blogSource = loader({
  baseUrl: '/blog',
  i18n,
  source: blog.toFumadocsSource(),
});

export function postDate(slug: string): Date | undefined {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  return match ? new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`) : undefined;
}

export function getPosts(lang: string) {
  return blogSource.getPages(lang).sort((a, b) => {
    const left = postDate(a.slugs[0])?.getTime() ?? 0;
    const right = postDate(b.slugs[0])?.getTime() ?? 0;
    return right - left;
  });
}

export function formatDate(date: Date | undefined, lang: string): string {
  if (!date) return '';
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export const blogText = {
  en: {
    title: 'Blog',
    description: 'Notes on running CasWAF: firewall rules, certificates, single sign-on and the parts of a reverse proxy that usually take a weekend.',
    lead: 'Notes on running CasWAF and the pieces around it: firewall rules, certificates, single sign-on and the parts of a reverse proxy that usually take a weekend.',
    read: 'Read the post',
    back: 'All posts',
    by: 'By The Casbin Authors',
  },
  zh: {
    title: '博客',
    description: '运行 CasWAF 的笔记：防火墙规则、证书、单点登录，以及反向代理里那些通常要花一个周末的部分。',
    lead: '运行 CasWAF 和它周边组件的笔记：防火墙规则、证书、单点登录，以及反向代理里那些通常要花一个周末的部分。',
    read: '阅读全文',
    back: '全部文章',
    by: '作者：The Casbin Authors',
  },
};

export function getBlogText(lang: string) {
  return blogText[lang as 'en' | 'zh'] ?? blogText.en;
}