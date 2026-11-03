import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName, getPageImageUrl } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/[lang]/og/docs/[...slug]'>) {
  const { lang, slug } = await params;
  const page = source.getPage(slug.slice(0, -1), lang);
  if (!page) notFound();

  // Longer text runs into the footer of the card.
  const limit = lang === 'zh' ? 60 : 120;
  const description = page.data.description ?? '';
  const short = description.length > limit ? `${description.slice(0, limit).trimEnd()}…` : description;
  const logo = await readFile(path.join(process.cwd(), 'public/logo192.png'));

  return generateOGImage({
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src={`data:image/png;base64,${logo.toString('base64')}`} width={72} height={72} alt="" />,
    title: page.data.title,
    description: short,
    site: appName,
    primaryColor: 'rgba(255, 122, 69, 0.35)',
    primaryTextColor: 'rgb(255, 193, 94)',
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
