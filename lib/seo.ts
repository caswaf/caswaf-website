import type { Metadata, MetadataRoute } from 'next';
import { i18n } from './i18n';
import { siteUrl } from './shared';

const hreflang: Record<string, string> = { en: 'en', zh: 'zh-CN' };

// `path` is the URL after the language, such as '' for the home page or '/docs/2-agents/2.1-agents'.
function languages(path: string, langs: readonly string[]) {
  return {
    ...Object.fromEntries(langs.map((lang) => [hreflang[lang] ?? lang, `${siteUrl}/${lang}${path}`])),
    'x-default': `${siteUrl}/${i18n.defaultLanguage}${path}`,
  };
}

export function alternates(lang: string, path: string, langs: readonly string[] = i18n.languages): Metadata['alternates'] {
  return { canonical: `${siteUrl}/${lang}${path}`, languages: languages(path, langs) };
}

export function sitemapEntry(lang: string, path: string, langs: readonly string[] = i18n.languages): MetadataRoute.Sitemap[number] {
  return { url: `${siteUrl}/${lang}${path}`, alternates: { languages: languages(path, langs) } };
}
