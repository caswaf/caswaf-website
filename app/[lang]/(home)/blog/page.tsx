import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { formatDate, getBlogText, getPosts, postDate } from '@/lib/blog';
import { alternates } from '@/lib/seo';
import { appName } from '@/lib/shared';

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await params;
  const t = getBlogText(lang);
  const image = `/${lang}/og/image.png`;
  return {
    title: { absolute: `${t.title} | ${appName}` },
    description: t.description,
    alternates: alternates(lang, '/blog'),
    openGraph: {
      type: 'website',
      siteName: appName,
      title: t.title,
      description: t.description,
      url: `/${lang}/blog`,
      images: image,
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description, images: image },
  };
}

export default async function BlogIndexPage({ params }: PageProps<'/[lang]/blog'>) {
  const { lang } = await params;
  const t = getBlogText(lang);
  const posts = getPosts(lang);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-lg text-pretty text-fd-muted-foreground">{t.lead}</p>

        <div className="mt-10 flex flex-col divide-y">
          {posts.map((post) => (
            <Link key={post.url} href={post.url} className="group py-6">
              <time className="text-sm text-fd-muted-foreground" dateTime={postDate(post.slugs[0])?.toISOString()}>
                {formatDate(postDate(post.slugs[0]), lang)}
              </time>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-fd-primary">{post.data.title}</h2>
              {post.data.description && (
                <p className="mt-2 text-sm text-fd-muted-foreground">{post.data.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter lang={lang} className="mt-auto" />
    </main>
  );
}