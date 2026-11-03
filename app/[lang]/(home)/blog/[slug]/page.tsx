import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { SiteFooter } from '@/components/site-footer';
import { blogSource, formatDate, getBlogText, postDate } from '@/lib/blog';
import { alternates } from '@/lib/seo';
import { appName, siteUrl } from '@/lib/shared';

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ lang: page.locale, slug: page.slugs[0] }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = blogSource.getPage([slug], lang);
  if (!page) notFound();

  const image = `/${lang}/og/blog/${slug}`;
  return {
    title: { absolute: `${page.data.title} | ${appName}` },
    description: page.data.description,
    alternates: alternates(lang, `/blog/${slug}`),
    openGraph: {
      type: 'article',
      siteName: appName,
      title: page.data.title,
      description: page.data.description,
      url: `/${lang}/blog/${slug}`,
      publishedTime: postDate(slug)?.toISOString(),
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: image,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await params;
  const page = blogSource.getPage([slug], lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const t = getBlogText(lang);
  const date = postDate(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description,
    url: `${siteUrl}/${lang}/blog/${slug}`,
    mainEntityOfPage: `${siteUrl}/${lang}/blog/${slug}`,
    datePublished: date?.toISOString(),
    dateModified: date?.toISOString(),
    author: { '@type': 'Organization', name: 'The Casbin Authors', url: 'https://github.com/caswaf' },
    publisher: { '@type': 'Organization', name: appName, url: siteUrl },
  };

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <Link href={`/${lang}/blog`} className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
          ← {t.back}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{page.data.title}</h1>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          {formatDate(date, lang)}，{t.by}
        </p>
        <div className="prose mt-8 max-w-none">
          <MDX components={getMDXComponents()} />
        </div>
      </article>

      <SiteFooter lang={lang} className="mt-auto" />
    </main>
  );
}