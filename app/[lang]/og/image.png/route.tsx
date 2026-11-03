import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { generateOGImage } from 'fumadocs-ui/og';
import { i18n } from '@/lib/i18n';
import { getText } from '@/lib/home';
import { appName } from '@/lib/shared';

export const revalidate = false;

// The home page's preview image, in the same style as the docs pages'.
export async function GET(_req: Request, { params }: RouteContext<'/[lang]/og/image.png'>) {
  const t = getText((await params).lang);
  const logo = await readFile(path.join(process.cwd(), 'public/logo192.png'));

  return generateOGImage({
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src={`data:image/png;base64,${logo.toString('base64')}`} width={72} height={72} alt="" />,
    title: t.title,
    description: t.subtitle,
    site: appName,
    primaryColor: 'rgba(46, 204, 113, 0.35)',
    primaryTextColor: 'rgb(127, 197, 232)',
  });
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
