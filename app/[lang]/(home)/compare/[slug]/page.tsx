import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { getComparePage, getComparePages, getCompareText } from '@/lib/compare';
import { alternates } from '@/lib/seo';
import { appName, siteUrl } from '@/lib/shared';

export function generateStaticParams() {
  return (['en', 'zh'] as const).flatMap((lang) =>
    getComparePages(lang).map((page) => ({ lang, slug: page.slug })),
  );
}

export async function generateMetadata({ params }: PageProps<'/[lang]/compare/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = getComparePage(lang, slug);
  if (!page) notFound();

  const image = `/${lang}/og/compare/${slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: alternates(lang, `/compare/${slug}`),
    openGraph: {
      type: 'article',
      siteName: appName,
      title: page.title,
      description: page.description,
      url: `/${lang}/compare/${slug}`,
      images: image,
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: image },
  };
}

function RichText({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

export default async function ComparePage({ params }: PageProps<'/[lang]/compare/[slug]'>) {
  const { lang, slug } = await params;
  const page = getComparePage(lang, slug);
  const t = getCompareText(lang);
  if (!page) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    url: `${siteUrl}/${lang}/compare/${slug}`,
    mainEntityOfPage: `${siteUrl}/${lang}/compare/${slug}`,
    about: [
      { '@type': 'SoftwareApplication', name: appName },
      { '@type': 'SoftwareApplication', name: page.name },
    ],
    isPartOf: { '@type': 'WebSite', name: appName, url: siteUrl },
  };

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
        <Link href={`/${lang}/compare`} className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
          ← {t.back}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{page.h1}</h1>
        <p className="mt-4 text-lg text-pretty text-fd-muted-foreground">{page.lead}</p>

        <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{t.atAGlance}</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-fd-muted/50 text-left">
                <th className="p-3 font-medium" />
                <th className="p-3 font-semibold text-fd-primary">CasWAF</th>
                <th className="p-3 font-semibold">{page.name}</th>
              </tr>
            </thead>
            <tbody>
              {page.table.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <th scope="row" className="p-3 text-left align-top font-medium text-fd-muted-foreground">
                    {row.label}
                  </th>
                  <td className="bg-fd-primary/5 p-3 align-top">{row.caswaf}</td>
                  <td className="p-3 align-top">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{t.better}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {page.better.map((point) => (
            <div key={point.title} className="rounded-xl border bg-fd-card p-5">
              <h3 className="font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">{point.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{t.ahead.replace('{name}', page.name)}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {page.ahead.map((point) => (
            <div key={point.title} className="rounded-xl border border-dashed p-5">
              <h3 className="font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">{point.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{t.pick}</h2>
        <ul className="flex flex-col gap-3">
          {page.pick.map((item) => (
            <li key={item} className="flex gap-3 text-sm">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fd-primary" aria-hidden />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{t.docsTitle}</h2>
        <div className="flex flex-wrap gap-3">
          {page.docs.map((doc) => (
            <Link
              key={doc.href}
              href={`/${lang}${doc.href}`}
              className="inline-flex items-center gap-1 rounded-lg border bg-fd-card px-3 py-1.5 text-sm transition-colors hover:bg-fd-accent"
            >
              {doc.text}
              <ArrowRight className="size-3.5" />
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-fd-primary/40 bg-fd-card p-6">
          <h2 className="text-xl font-semibold tracking-tight">{t.ctaTitle}</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">{t.ctaBody}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/docs/getting-started/quickstart`}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.ctaStart}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
            >
              {t.ctaDocs}
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter lang={lang} className="mt-auto" />
    </main>
  );
}