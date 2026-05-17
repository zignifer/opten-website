---
phase: 04-content-surface
plan: 03
status: complete
completed: 2026-05-17
requirements: [GEO-D-1, GEO-D-2, GEO-D-3]
validation_rows: [V-11, V-12, V-16]
files_modified:
  - scripts/seo-routes.ts
  - scripts/prerender.mjs
  - index.html
key-files:
  created: []
  modified:
    - scripts/seo-routes.ts
    - scripts/prerender.mjs
    - index.html
---

# Plan 04-03 — JSON-LD entity graph + font-preload regression guard

## What shipped

Two atomic feat-commits and one inline cleanup landed Wave 2:

1. **`scripts/seo-routes.ts`** — schema authoring surface (D-09 / D-10):
   - New `SchemaBlock` interface with index signature (loose typing, Rich Results Test is the source of truth).
   - New optional `schema?: SchemaBlock[]` field on `RouteMeta`.
   - Four module-scope `*_REF` pointers (`{"@id": "https://opten.space/#org"}` etc.) used inside blocks to cross-link the entity graph.
   - Four reusable `*_BLOCK` constants: `ORG_BLOCK`, `WEBSITE_BLOCK`, `SOFTWARE_APP_BLOCK`, `PERSON_FOUNDER_BLOCK`. `Person.image` stays commented out per locked decision in 04-05 (founder-photo option c — initials placeholder ships, photo deferred).
   - Four pure builder functions: `faqPageBlock`, `howToBlock`, `productBlock`, `breadcrumbBlock`. Each takes a `pageId` URL to scope nested `@id` values (e.g. `${pageId}#faq`) so the same builder can produce distinct entities on different routes without `@id` collisions. `productBlock` emits either a single `Offer`, an `AggregateOffer` (when all plans share currency), or an `offers[]` array (when multi-currency) per Google's Rich Results spec.
   - 12 existing routes wired with the `schema:` field:
     - `/` and `/en/` → `[ORG_BLOCK, SOFTWARE_APP_BLOCK, WEBSITE_BLOCK]` (FAQPage joins in 04-06).
     - `/pay` and `/en/pay` → `[ORG_BLOCK]` only (Product + Breadcrumb land with the D-12 full-prerender flip in 04-04).
     - `/welcome`, `/privacy`, `/terms`, `/refund` (RU + EN) → `[ORG_BLOCK, breadcrumbBlock(...)]`. Breadcrumb labels are localized (Главная/Privacy Policy etc.) and URLs follow the user's actual click-path (`/en/` siblings use `/en/` URLs in their breadcrumbs).

2. **`scripts/prerender.mjs`** — apply-chain integration:
   - `applyJsonLd(html, meta)` — injects `<script type="application/ld+json">` blocks from `meta.schema` before `</head>`. Optional field: no-op when undefined or empty. Fails fast on `</head>` anchor regression.
   - `applyHeroPreloadGuard(html, meta)` — build-time assertion only (per 04-LCP-AUDIT Option 1 — user-selected 2026-05-17). Asserts both Phase 2.2 font preloads (`PT-Root-UI_VF.woff2` + `Unbounded-VF.woff2`) survived the pipeline on every route. Does NOT mutate html; throws if either preload is missing.
   - Both helpers wired between `applyOgLocale` and `applyModulePreload` (the latter consumes `</head>`).
   - Paddle path-gate at the original line is unchanged — INTEGRATION-CONTRACT §6 invariant intact.

3. **`index.html`** — legacy Phase-1 static SoftwareApplication + Organization JSON-LD blocks removed (per CONTEXT D-09 — "Phase 4 generalizes what Phase 1 hardcoded"). Replaced with a comment pointer to the new authoring surface. Keeping the old blocks would have created **duplicate entities on every prerendered route** because the template flows through to all 12 outputs — that's what the verify step initially caught.

## Rationale: D-13 became a regression-guard (not a new preload)

Per [04-LCP-AUDIT.md](.planning/phases/04-content-surface/04-LCP-AUDIT.md) Option 1 (user decision 2026-05-17): the LCP element on prod is the hero `<h1>` text rendered with Unbounded-VF.woff2, both gating fonts are already `<link rel=preload>` in `index.html` since Phase 2.2, and `font-display: swap` is on. A literal image preload would either be a no-op (no above-the-fold hero image exists) or hurt LCP (would steal bandwidth from the actual gating font). So D-13 became a build-time assertion that the existing font preloads survive the pipeline.

**V-18 / V-19 (LCP ≤ 2.5 s) is explicitly NOT closed by Phase 4** — addressing it requires Unbounded font subsetting (the variable font is 254 KB) and is now a separate future ticket. The 04-LCP-AUDIT.md file records the baseline (3.3 s mobile on both `/` and `/en/`) as the regression floor.

## Schema bundle composition per route (matrix)

| Route | Org | SoftwareApp | WebSite | Breadcrumb | Notes |
|-------|-----|-------------|---------|------------|-------|
| `/` | ✓ | ✓ | ✓ | — | FAQPage joins in 04-06 |
| `/en/` | ✓ | ✓ | ✓ | — | FAQPage joins in 04-06 |
| `/welcome` | ✓ | — | — | ✓ | Главная → Добро пожаловать |
| `/en/welcome` | ✓ | — | — | ✓ | Home → Welcome |
| `/privacy` | ✓ | — | — | ✓ | Главная → Политика конфиденциальности |
| `/en/privacy` | ✓ | — | — | ✓ | Home → Privacy Policy |
| `/terms` | ✓ | — | — | ✓ | Главная → Условия использования |
| `/en/terms` | ✓ | — | — | ✓ | Home → Terms of Service |
| `/refund` | ✓ | — | — | ✓ | Главная → Политика возврата |
| `/en/refund` | ✓ | — | — | ✓ | Home → Refund Policy |
| `/pay` | ✓ | — | — | — | Product + Breadcrumb land in 04-04 |
| `/en/pay` | ✓ | — | — | — | Product + Breadcrumb land in 04-04 |

**Strict-count verify ran clean:** exactly 1 Organization per route, SoftwareApplication and WebSite ONLY on the two landings (1 each), BreadcrumbList ONLY on the 8 non-landing-non-pay routes (1 each). No duplicates.

## Acceptance verification

- `npm run build` exits 0 (12 routes prerendered, sitemap regenerated, .ssr-meta/seo-routes.js grew from 10 KB → 17 KB to reflect the new authoring surface).
- All 12 routes contain `"@type": "Organization"` (V-11 indirect ✓).
- Both landings contain `"@type": "SoftwareApplication"` and `"@type": "WebSite"` (V-12 ready for Rich Results Test post-deploy).
- All 8 legal/welcome routes contain `"@type": "BreadcrumbList"`.
- Both font preloads (`PT-Root-UI_VF.woff2` + `Unbounded-VF.woff2`) survive on every prerendered route — `applyHeroPreloadGuard` would have thrown otherwise.
- `dist/pay/index.html` AND `dist/en/pay/index.html` still contain `cdn.paddle.com` (V-16, INTEGRATION-CONTRACT §6 invariant ✓).
- No legacy `Phase A — GEO foundations` block in any `dist/*/index.html` (legacy duplicate removed).

## Manual Rich Results Test (post-deploy follow-up)

V-12 (gate) requires submitting one prerendered URL to https://search.google.com/test/rich-results and confirming 0 errors for the Organization, SoftwareApplication, and WebSite types. This must happen against the deployed prod URL (the Rich Results Test does not accept pasted HTML from local files reliably — it needs to crawl a live URL). Will be exercised by `/gsd-verify-work 4` after the Phase 4 deploy.

## What this unlocks for downstream plans

- **04-04** (`/pay` full-prerender flip): adds `productBlock([{name,price,currency},...])` + `breadcrumbBlock([...])` to the `/pay` and `/en/pay` schema arrays, flips `prerender: "head"` → `"full"`. The Product schema becomes acceptable to Google's Rich Results Test because the pricing facts will now be in the initial HTML.
- **04-05** (`/about` page): adds a new manifest entry for `/about` with `schema: [ORG_BLOCK, PERSON_FOUNDER_BLOCK, breadcrumbBlock(...)]`. `PERSON_FOUNDER_BLOCK` is already authored — just needs to be wired.
- **04-06** (guide + FAQ): adds two new manifest entries for `/guides/gpt-image-2` + `/en/guides/gpt-image-2` with `schema: [ORG_BLOCK, howToBlock(...), faqPageBlock(...), breadcrumbBlock(...)]`. Also adds `faqPageBlock(landingFaqRu, ...)` to `/` and `faqPageBlock(landingFaqEn, ...)` to `/en/`.
- **04-07** (`/llms.txt`): independent, no schema dependency.
