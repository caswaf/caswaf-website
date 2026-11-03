import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { translations } from '@/lib/layout.shared';
import { BaiduTongjiPageview } from '@/components/baidu-tongji';
import { appName, baiduTongjiId, googleAnalyticsId, siteUrl } from '@/lib/shared';
import '../global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${appName}`,
    default: appName,
  },
  icons: { icon: '/favicon.ico', apple: '/logo192.png' },
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!(i18n.languages as string[]).includes(lang)) notFound();

  return (
    <html lang={lang === 'zh' ? 'zh-CN' : lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nProvider(translations, lang)}>{children}</RootProvider>
        {googleAnalyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
            </Script>
          </>
        )}
        {baiduTongjiId && (
          <>
            <Script src={`https://hm.baidu.com/hm.js?${baiduTongjiId}`} strategy="afterInteractive" />
            <BaiduTongjiPageview />
          </>
        )}
      </body>
    </html>
  );
}
