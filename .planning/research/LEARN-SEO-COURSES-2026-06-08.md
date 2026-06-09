# Learn SEO course intent update - 2026-06-08

## Inputs checked

- SEO briefs from `C:\Projects\opten-seo`:
  - `content/briefs/002-learn-courses.md`
  - `keywords/learn-courses-clusters.md`
  - `keywords/learn-courses-en-clusters.md`
- Google Search Console, 2026-03-10..2026-06-08:
  - no Learn page/query rows in the filtered page+query export
  - `https://opten.space/learn` inspection returned `URL is unknown to Google`
- Yandex Webmaster popular queries, 2026-05-31..2026-06-06:
  - visible demand is currently prompt/model-specific, not Learn/course-specific
- External checks:
  - Google Course list structured data requires real course entities and at least three courses in the marked-up list.
  - Google title-link guidance stresses concise descriptive titles, no keyword stuffing, and language/script match.
  - Google generative AI guidance still treats GEO/AEO as normal SEO: useful unique content, clear structure, crawlability, and relevant video/images.

## EN addendum checked on 2026-06-09

The EN keyword set is not a translation of RU Wordstat. It uses Google Suggest plus Bing Webmaster Keyword Research API, language `en-US`.

Primary EN hub targets:

- `ai course`
- `ai courses`
- `learn ai`
- `ai training`
- `vibe coding`
- `ai tutorials`
- `free ai courses`
- `prompt engineering course`
- `figma tutorial`

Decision: `/en/learn` should optimize for `AI courses / learn AI / AI tutorials`, with `vibe coding` as the strongest trend layer. It should not lead with `web design course`; the EN Bing signal for web design course terms is weak. Tool-name queries such as `claude code`, `cursor ai`, and `lovable ai` are high-volume but mostly navigational, so they belong in body/intro or future lesson/category pages, not the hub title.

## Decision

The current issue is not sitemap plumbing; the hub lacks enough visible, early semantic text for the target course intent. Implement a stronger `/learn` and `/en/learn` hub now. Do not add thin category URLs yet, and do not mark standalone video lessons as `Course`.

## Implemented

- Updated RU/EN Learn hub title and description in `scripts/seo-routes.ts`.
- Reworked visible H1:
  - RU: `Курсы Opten по нейросетям, дизайну и вайб-кодингу`
  - EN: `AI courses, tutorials and vibe coding lessons`
- Added visible intro text near the first screen with the priority RU phrases:
  - `курсы по нейросетям`
  - `обучение ИИ`
  - `нейросети с нуля`
  - `AI-видео`
  - `веб-дизайн`
  - `Figma`
  - `вайб-кодинг`
- Added visible RU/EN FAQ on the Learn hub and mirrored it into `FAQPage` JSON-LD from the same content source.
- Retained `CollectionPage + ItemList` for the hub and `LearningResource + VideoObject + TechArticle` for individual lessons.
- Updated future collection labels with exact but readable cluster terms.
- Updated EN collection labels around `learn AI for beginners`, `free AI courses`, `AI video tutorials`, `vibe coding lessons`, `AI training`, and `best AI tools`.
- Updated `scripts/verify-space-learn.mjs` to match the current `/spa.html` template rewrite used in `vercel.json`.

## Deferred

- `/learn/neural-networks`, `/learn/vibe-coding`, `/learn/web-design`, `/learn/figma`, `/learn/ai-for-designers`, `/learn/ai-video`:
  - defer until each category has enough unique lesson/content depth for an indexable page.
- `/en/learn/ai`, `/en/learn/vibe-coding`, `/en/learn/claude-code`, `/en/learn/cursor-ai`, `/en/learn/lovable-ai`, `/en/learn/prompt-engineering`, `/en/learn/figma`:
  - defer until each URL has enough unique course/lesson content and internal links. Do not create thin pages from client-side filters.
- `Course` schema:
  - defer until `learnCourses` contains real course series/modules with educational outcomes.
- GSC/Yandex recrawl:
  - run after deployment, not against the old live HTML.

## Verification

- `npm run verify:space-learn` passed.
- `npm run build` passed.
- Dist HTML check:
  - `/learn` and `/en/learn` include updated title/description/H1/intro.
  - FAQ is visible in DOM and present as `FAQPage`.
  - no `Course` schema is emitted.
- Browser check on `http://127.0.0.1:5173/learn`:
  - desktop 1280x720: no horizontal overflow, no H1/intro/FAQ clipping.
  - mobile 390x844: no horizontal overflow, no H1/intro/FAQ clipping.
