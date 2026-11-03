# CasWAF Website

The website and documentation of [CasWAF](https://github.com/caswaf/caswaf), the open-source reverse proxy and web application firewall, in English and Chinese, built with [Fumadocs](https://fumadocs.dev) on Next.js. It is served at https://caswaf.org.

## Writing the docs

The manual is in `content/docs/`, one folder per language with the same chapters and file names in each, so `rules/waf.md` is the same page in English and Chinese. Change both languages in the same pull request.

- Each page starts with frontmatter. `title` is the heading shown on the page, so the body has no `# Heading` of its own. `description` is a plain-text summary for search results and the preview image.
- `index.md` is a language's front page. Each chapter folder has a `meta.json` holding its title and page order, and the language folder's own `meta.json` lists the chapters.
- Link to another page by its file, relatively, such as `[IP rules](../rules/ip.md)`; the site turns that into the page URL.
- Describe what the code on CasWAF's `master` does today. Say so where a setting has no effect yet, and put plans on the roadmap page.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `/` sends the visitor to `/en` or `/zh` by their browser language.

## Layout

| Path | What it is |
| --- | --- |
| `app/[lang]/(home)`, `lib/home.ts` | The landing page and its copy in both languages |
| `app/[lang]/docs` | The manual |
| `app/[lang]/og` | Social preview images, one per page and one for the home page |
| `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts` | The sitemap, robots.txt, and each page's canonical URL and language alternates |
| `app/[lang]/llms.mdx`, `app/llms.txt`, `app/llms-full.txt` | The manual as Markdown, for agents; append `.md` to any page URL to get it |
| `app/api/search` | Search over both languages |
| `lib/layout.shared.tsx`, `components/site-footer.tsx` | Navigation, footer, and the Chinese strings for Fumadocs' own UI |
| `next.config.mjs` | Redirects from the URLs of the old Docusaurus site |

## Analytics

The site reads its Google Analytics and Baidu Tongji IDs from the environment variables `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_BAIDU_TONGJI_ID`, set in the deployment. Neither is in the code, so a fork reports to nobody, and with neither set no tracker is loaded.
