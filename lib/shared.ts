import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'CasWAF';
export const siteUrl = 'https://caswaf.org';

// Analytics IDs come from the deployment's environment, so forks of this repository report to nobody.
export const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const baiduTongjiId = process.env.NEXT_PUBLIC_BAIDU_TONGJI_ID ?? '';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// The product's own repository, which the GitHub buttons point at.
export const repoUrl = 'https://github.com/caswaf/caswaf';

// This repository, where the manual is written.
export const gitConfig = {
  user: 'caswaf',
  repo: 'caswaf-website',
  branch: 'master',
};

export function getPageSourceUrl(path: string) {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
