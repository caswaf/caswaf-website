import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { getComparePage, getComparePages } from '@/lib/compare';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/[lang]/og/compare/[slug]'>) {
  const { lang, slug } = await params;
  const page = getComparePage(lang, slug);
  if (!page) notFound();

  // Longer text runs into the footer of the card; a whole sentence reads better than a cut word.
  const limit = lang === 'zh' ? 60 : 120;
  const sentence = page.description.match(/^.*?(?:\.(?=\s)|。)/)?.[0] ?? page.description;
  const short =
    page.description.length <= limit
      ? page.description
      : sentence.length <= limit
        ? sentence
        : `${page.description.slice(0, limit).trimEnd()}…`;
  const logo = await readFile(path.join(process.cwd(), 'public/logo192.png'));

  return generateOGImage({
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src={`data:image/png;base64,${logo.toString('base64')}`} width={72} height={72} alt="" />,
    title: page.h1,
    description: short,
    site: appName,
    primaryColor: 'rgba(255, 122, 69, 0.35)',
    primaryTextColor: 'rgb(255, 193, 94)',
  });
}

export function generateStaticParams() {
  return (['en', 'zh'] as const).flatMap((lang) =>
    getComparePages(lang).map((page) => ({ lang, slug: page.slug })),
  );
}