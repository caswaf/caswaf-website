import { source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';

import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { ComponentProps } from 'react';
import { getPageImageUrl, getPageMarkdownUrl, getPageSourceUrl } from '@/lib/shared';
import { i18n } from '@/lib/i18n';
import { alternates } from '@/lib/seo';

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const sourceUrl = getPageSourceUrl(page.path);

  // The description is the first paragraph, which the body already opens with.
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={sourceUrl} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: RelativeLink(lang, page.path),
          })}
        />
      </DocsBody>
      <EditOnGitHub href={sourceUrl.replace('/blob/', '/edit/')} />
    </DocsPage>
  );
}

// createRelativeLink resolves against page.path, which carries the language
// folder under the dir parser, so it never finds a sibling page.
function RelativeLink(lang: string, pagePath: string) {
  const dir = pagePath.slice(lang.length + 1).split('/').slice(0, -1).join('/');
  return function Link({ href, ...props }: ComponentProps<'a'>) {
    if (href?.startsWith('./') || href?.startsWith('../')) {
      const target = source.getPageByHref(href, { dir, language: lang });
      if (target) href = target.hash ? `${target.page.url}#${target.hash}` : target.page.url;
    }
    return <defaultMdxComponents.a href={href} {...props} />;
  };
}

export async function generateStaticParams() {
  return source.generateParams('slug', 'lang');
}

export async function generateMetadata(props: PageProps<'/[lang]/docs/[[...slug]]'>): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const langs = i18n.languages.filter((l) => source.getPage(slug, l));
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: alternates(lang, page.url.slice(lang.length + 1), langs),
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
