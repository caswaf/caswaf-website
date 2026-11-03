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
  for (const page of ['blog', 'help', 'users', 'pdf']) {
    rules.push({ source: `/${page}/:path*`, destination: '/en', permanent: true });
    rules.push({ source: `/zh/${page}/:path*`, destination: '/zh', permanent: true });
  }
  return rules;
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => redirects(),
};

export default withMDX(config);
