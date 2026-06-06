# Public Learn Launch Design

## Goal

Move Opten Learn from an internal noindex `/app/learn` prototype to a public, indexed learning section at `/learn` and `/en/learn`, with real lesson pages, localized content, structured SEO metadata, and template-only course surfaces preserved but hidden until real course progress exists.

## Decisions

- `/learn` and `/learn/:lessonSlug` are the canonical RU routes.
- `/en/learn` and `/en/learn/:lessonSlug` are the canonical EN siblings.
- `/app/learn`, `/app/learn/:lessonSlug`, `/app/learn-v2`, `/space/learn`, and `/space/learn/:lessonSlug` redirect to the public `/learn` surface.
- Learn remains wrapped in website auth context only for optional local progress and Pro gating, but public reading and public video pages do not require login.
- Current course templates and collection placeholders stay in source data as future collections, but are visually marked as coming soon and do not expose fake lessons.
- `Continue learning` is hidden unless there is local progress on a course collection. Completed standalone lessons do not appear there because they are already 100% complete.
- The overview, detail pages, SEO manifest, sitemap, llms, and header navigation use one content source to prevent drift.
- The local desktop video `главное.MP4` becomes the featured lesson `actual-ai-tools-2026`, with an optimized public video asset and poster generated through ffmpeg.
- YouTube lessons use public embed URLs, local/static thumbnails, and curated timestamp arrays. Provider credentials remain local-only in `.secrets/learn-video.env`.

## Content Scope

Public lessons:

- `actual-ai-tools-2026`: "Актуальные нейросети в 2026 году" from the local desktop video.
- `ai-avatar-motion-control`: existing AI avatar lesson from YouTube `slxq1d8u-Hg`.
- `junior-designer-1100-order`: YouTube `blrSogS4yXM`.
- `client-website-navigation-hero`: YouTube `MEs-DdIjPy0`.
- `ai-marketplace-product-cards`: YouTube `-0elJixu1kc`.
- `web-design-references`: YouTube `MsIkbE1w-fM`.

The current placeholder lessons from "Все уроки" are removed from the public list. Future collections remain visible as coming-soon cards with no "View all" CTA.

## SEO/GEO Requirements

- Full prerender for `/learn`, `/en/learn`, every public lesson route, and every EN lesson sibling.
- Reciprocal hreflang triplets for each RU/EN pair.
- Canonical URLs use the public route, never `/app/learn`.
- `Course`, `ItemList`, `VideoObject`, `BreadcrumbList`, `WebPage`, `Person`, `Organization`, and `FAQPage`/speakable where useful are emitted in build-time JSON-LD.
- Visible DOM and schema agree on title, description, author, publication date, thumbnails, duration, and URL.
- Learn routes are not covered by `X-Robots-Tag: noindex`.
- Existing noindex for `/app/*`, `/login`, `/auth/*`, `/account`, `/prompt-library`, `/internal/*`, `/dashboard/*`, and `/api/*` stays intact.
- `EN_SIBLINGS` includes `/learn` and all lesson slugs so `LocalizedLink` preserves `/en`.
- Header navigation advertises Learn again in RU/EN.

## UX Requirements

- `/learn` opens with a real featured lesson, topic filters, future collection cards, and public lesson cards.
- Mobile hides the large author/featured explanatory block as already requested, while filters and lesson cards remain available.
- Detail pages support YouTube lessons and the local featured video lesson.
- The "mark learned" control can be toggled and updates course progress only for course collections.
- Standalone detail pages show the author card and socials, not a course progress card.
- Locked/Pro patterns remain in code for future courses but do not create fake current progress.

## Verification

- `npm run verify:unified-auth`
- `npm run verify:space-learn`
- `npm run build`
- In-app browser checks:
  - `/learn`
  - `/en/learn`
  - `/learn/actual-ai-tools-2026`
  - `/en/learn/actual-ai-tools-2026`
  - `/app/learn` redirects to `/learn`
  - Header Learn tab appears and is active on Learn pages
  - Learn pages are not noindex in generated/static metadata

