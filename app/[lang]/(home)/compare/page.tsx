import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { getComparePages, getCompareText } from '@/lib/compare';
import { alternates } from '@/lib/seo';
import { appName } from '@/lib/shared';

export async function generateMetadata({ params }: PageProps<'/[lang]/compare'>): Promise<Metadata> {
  const { lang } = await params;
  const t = getCompareText(lang);
  const image = `/${lang}/og/image.png`;
  return {
    title: { absolute: `${t.indexTitle} | ${appName}` },
    description: t.indexDescription,
    alternates: alternates(lang, '/compare'),
    openGraph: {
      type: 'website',
      siteName: appName,
      title: t.indexTitle,
      description: t.indexDescription,
      url: `/${lang}/compare`,
      images: image,
    },
    twitter: { card: 'summary_large_image', title: t.indexTitle, description: t.indexDescription, images: image },
  };
}

export default async function CompareIndexPage({ params }: PageProps<'/[lang]/compare'>) {
  const { lang } = await params;
  const t = getCompareText(lang);
  const pages = getComparePages(lang);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t.indexTitle}</h1>
        <p className="mt-4 text-lg text-pretty text-fd-muted-foreground">{t.indexLead}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/${lang}/compare/${page.slug}`}
              className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:border-fd-primary/50"
            >
              <h2 className="font-semibold">{page.name}</h2>
              <p className="mt-2 flex-1 text-sm text-fd-muted-foreground">{page.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
                {t.read}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter lang={lang} className="mt-auto" />
    </main>
  );
}