import type { MetadataRoute } from 'next';
import { execSync } from 'node:child_process';
import { comparePages } from '@/lib/compare';
import { i18n } from '@/lib/i18n';
import { sitemapEntry } from '@/lib/seo';
import { source } from '@/lib/source';

// The commit that last touched each file, so lastmod says something Google can trust
// instead of moving on every deploy.
const dates = new Map<string, Date | undefined>();

function lastModified(file: string): Date | undefined {
  if (!dates.has(file)) {
    let date: Date | undefined;
    try {
      const out = execSync(`git log -1 --format=%cI -- "${file}"`, { encoding: 'utf8' }).trim();
      date = out ? new Date(out) : undefined;
    } catch {
      date = undefined;
    }
    dates.set(file, date);
  }
  return dates.get(file);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const home = i18n.languages.map((lang) => sitemapEntry(lang, '', undefined, lastModified('lib/home.ts')));
  const docs = source.getPages().map((page) => {
    const lang = page.locale ?? i18n.defaultLanguage;
    const langs = i18n.languages.filter((l) => source.getPage(page.slugs, l));
    return sitemapEntry(
      lang,
      page.url.slice(lang.length + 1),
      langs,
      lastModified(`content/docs/${page.path}`),
    );
  });
  const compare = i18n.languages.flatMap((lang) => [
    sitemapEntry(lang, '/compare', undefined, lastModified('lib/compare.ts')),
    ...(comparePages[lang as 'en' | 'zh'] ?? []).map((page) =>
      sitemapEntry(lang, `/compare/${page.slug}`, undefined, lastModified('lib/compare.ts')),
    ),
  ]);
  return [...home, ...docs, ...compare];
}