import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { i18n } from '@/lib/i18n';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `/:lang${docsRoute}{/*path}`,
  `/:lang${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `/:lang${docsRoute}{/*path}.md`,
  `/:lang${docsContentRoute}{/*path}/content.md`,
);

// `/` goes straight to `/en`; the default formatter sends it to `/en/`, which then redirects again.
const i18nProxy = createI18nMiddleware({
  ...i18n,
  format: (locale, pathname) => (pathname === '/' ? `/${locale}` : `/${locale}${pathname}`),
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const suffix = rewriteSuffix(request.nextUrl.pathname);
  if (suffix) {
    return NextResponse.rewrite(new URL(suffix, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return i18nProxy(request, event);
}

export const config = {
  // Static files, robots.txt and sitemap.xml skip the locale redirect; `.md` does not, as it maps a page to its Markdown.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpe?g|gif|svg|ico|webp|txt|xml)$).*)'],
};
