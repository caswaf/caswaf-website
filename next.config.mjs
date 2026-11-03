import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Pages of the old Docusaurus site, so that links and search results keep working.
const oldDocs = {
  overview: 'getting-started/introduction',
  'core-concepts': 'getting-started/introduction',
  'category/the-basics': 'getting-started/introduction',
  installation: 'getting-started/quickstart',
  'casdoor-sso': 'getting-started/casdoor',
  site: 'sites/sites',
  'sites-configuration': 'sites/sites',
  'category/sites': 'sites/sites',
  cert: 'certificates/certificates',
  'category/certs': 'certificates/certificates',
  rule: 'rules/rules',
  'category/rules': 'rules/rules',
  'ip-rule': 'rules/ip',
  'ua-rule': 'rules/user-agent-and-path',
  'waf-rule': 'rules/waf',
  'ip-rate-rule': 'rules/rate-limiting',
  'compound-rule': 'rules/rules',
  action: 'rules/rules',
  'category/actions': 'rules/rules',
  'allow-action': 'rules/rules',
  'block-action': 'rules/rules',
  'captcha-action': 'rules/captcha',
  record: 'monitoring/records',
};

function redirects() {
  const rules = [];
  for (const [from, to] of Object.entries(oldDocs)) {
    rules.push({ source: `/docs/${from}`, destination: `/en/docs/${to}`, permanent: true });
    rules.push({ source: `/zh/docs/${from}`, destination: `/zh/docs/${to}`, permanent: true });
    rules.push({ source: `/:lang(fr|de|ko|ru|ja)/docs/${from}`, destination: `/en/docs/${to}`, permanent: true });
  }
  rules.push({ source: '/:lang(fr|de|ko|ru|ja)', destination: '/en', permanent: true });
  rules.push({ source: '/:lang(fr|de|ko|ru|ja)/:path*', destination: '/en', permanent: true });
  for (const page of ['help', 'users', 'pdf']) {
    rules.push({ source: `/${page}/:path*`, destination: '/en', permanent: true });
    rules.push({ source: `/zh/${page}/:path*`, destination: '/zh', permanent: true });
  }
  // The root was indexed as https://caswaf.org/ before the rewrite; a permanent redirect passes its signals to /en.
  rules.push({ source: '/', destination: '/en', permanent: true });
  // Category indexes of the old site that the map above does not know go to the docs index instead of a 404.
  rules.push({ source: '/docs/category', destination: '/en/docs', permanent: true });
  rules.push({ source: '/docs/category/:path*', destination: '/en/docs', permanent: true });
  rules.push({ source: '/zh/docs/category', destination: '/zh/docs', permanent: true });
  rules.push({ source: '/zh/docs/category/:path*', destination: '/zh/docs', permanent: true });
  rules.push({ source: '/:lang(fr|de|ko|ru|ja)/docs/category/:path*', destination: '/en/docs', permanent: true });
  return rules;
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // The images are a few small logos; Vercel's image optimization is billed per image and fails with 402 when the quota runs out.
  images: { unoptimized: true },
  redirects: async () => redirects(),
};

export default withMDX(config);
