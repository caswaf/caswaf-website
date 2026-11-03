import { comparePages } from '@/lib/compare';
import { siteUrl } from '@/lib/shared';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const index = await docsLlms.index();
  const compare = comparePages.en
    .map((page) => `- [${page.h1}](${siteUrl}/en/compare/${page.slug}): ${page.description}`)
    .join('\n');

  return new Response(`${index}

# Compare

- [Compare CasWAF with other reverse proxies and WAFs](${siteUrl}/en/compare): SafeLine, ModSecurity, BunkerWeb and Nginx, one page each.
${compare}
`);
}