import type { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n';
import { sitemapEntry } from '@/lib/seo';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  const home = i18n.languages.map((lang) => sitemapEntry(lang, ''));
  const docs = source.getPages().map((page) => {
    const lang = page.locale ?? i18n.defaultLanguage;
    const langs = i18n.languages.filter((l) => source.getPage(page.slugs, l));
    return sitemapEntry(lang, page.url.slice(lang.length + 1), langs);
  });
  return [...home, ...docs];
}
