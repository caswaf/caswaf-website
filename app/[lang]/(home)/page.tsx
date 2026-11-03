/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, Globe, Server } from 'lucide-react';
import { InstallCommand } from '@/components/install-command';
import { SiteFooter } from '@/components/site-footer';
import { getComparePages } from '@/lib/compare';
import { getText } from '@/lib/home';
import { alternates } from '@/lib/seo';
import { appName, repoUrl, siteUrl } from '@/lib/shared';

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const t = getText(lang);
  const description = `${t.subtitle} ${t.lead}`;
  const image = `/${lang}/og/image.png`;
  return {
    title: { absolute: t.seoTitle },
    description,
    alternates: alternates(lang, ''),
    openGraph: { type: 'website', siteName: appName, title: t.seoTitle, description, url: `/${lang}`, images: image },
    twitter: { card: 'summary_large_image', title: t.seoTitle, description, images: image },
  };
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-fd-muted-foreground" aria-hidden>
      <ChevronRight className="hidden size-5 lg:block" />
      <ChevronDown className="size-5 lg:hidden" />
    </div>
  );
}

function Verdicts({ label, names }: { label: string; names: string[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
      <span className="text-xs text-fd-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <span key={name} className="rounded-md bg-fd-secondary px-2 py-1 text-xs font-medium">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const t = getText(lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appName,
    description: `${t.title}: ${t.subtitle}`,
    url: `${siteUrl}/${lang}`,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Linux, Windows',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    codeRepository: repoUrl,
    image: `${siteUrl}/logo512.png`,
  };

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-4xl rounded-full bg-fd-primary/15 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-12 text-center sm:pt-24">
          <img src="/logo192.png" alt="" width={72} height={72} className="mb-6" />
          <p className="mb-6 rounded-full border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            {t.badge}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">{t.title}</h1>
          <p className="mt-4 max-w-3xl text-xl text-balance text-fd-primary sm:text-2xl">{t.subtitle}</p>
          <p className="mt-6 max-w-2xl text-base text-pretty text-fd-muted-foreground sm:text-lg">{t.lead}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/docs/getting-started/quickstart`}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.start}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={repoUrl}
              className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-2">
            <InstallCommand copyLabel={t.copy} />
            <p className="text-sm text-fd-muted-foreground">{t.installNote}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">{t.howTitle}</h2>
        <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1.5fr_auto_1fr_auto_1fr]">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-fd-card p-5 text-center">
            <Globe className="size-6 text-fd-primary" />
            <span className="font-semibold">{t.how.visitors}</span>
            <span className="text-sm text-fd-muted-foreground">{t.how.visitorsBody}</span>
          </div>
          <Arrow />
          <div className="flex flex-col gap-3 rounded-xl border border-fd-primary/40 bg-fd-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <img src="/logo192.png" alt="" width={22} height={22} />
              <span className="font-semibold">CasWAF</span>
            </div>
            <ol className="flex flex-col gap-2">
              {t.how.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-2 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fd-primary text-xs font-semibold text-fd-primary-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <Arrow />
          <div className="flex flex-col justify-center gap-3">
            <Verdicts label={t.how.verdicts} names={t.verdicts} />
          </div>
          <Arrow />
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-fd-card p-5 text-center">
            <Server className="size-6 text-fd-primary" />
            <span className="font-semibold">{t.how.apps}</span>
            <span className="text-sm text-fd-muted-foreground">{t.how.appsBody}</span>
          </div>
        </div>
      </section>

      <section className="border-y bg-fd-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">{t.featuresTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.features.map(({ icon: Icon, title, body, href }) => (
              <Link
                key={href}
                href={`/${lang}/docs/${href}`}
                className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:border-fd-primary/50"
              >
                <Icon className="mb-3 size-5 text-fd-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-fd-muted-foreground">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
                  {t.more}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">{t.compareTitle}</h2>
        <p className="mb-8 text-center text-sm text-fd-muted-foreground">{t.compareBody}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getComparePages(lang).map((page) => (
            <Link
              key={page.slug}
              href={`/${lang}/compare/${page.slug}`}
              className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:border-fd-primary/50"
            >
              <h3 className="font-semibold">{page.name}</h3>
              <p className="mt-2 flex-1 text-sm text-fd-muted-foreground">{page.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
                {t.more}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${lang}/compare`}
            className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            {t.compareAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">{t.openTitle}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {t.open.map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-2 border-l-2 border-[var(--color-teal)] pl-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-fd-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href={`/${lang}/docs/more/roadmap`}
            className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            {t.roadmap}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter lang={lang} className="mt-auto" />
    </main>
  );
}
