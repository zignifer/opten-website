---
phase: 02-per-route-prerender-per-route-metadata
plan: 01
subsystem: seo
tags: [seo, metadata, typescript, manifest, prerender]

# Dependency graph
requires:
  - phase: 01-static-geo-foundations
    provides: public/sitemap.xml with 6-route set and priorities that this manifest mirrors
provides:
  - scripts/seo-routes.ts — typed per-route metadata manifest (RouteMeta interface + SITE_ORIGIN + DEFAULT_OG_IMAGE + routes array)
affects:
  - 02-02 (entry-server.tsx — optional path alignment import)
  - 02-04 (prerender.mjs — primary consumer, imports routes for head injection and sitemap generation)
  - 02-05 (sitemap generator — imports SITE_ORIGIN and routes for dist/sitemap.xml)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "scripts/ directory established as convention for build-time TypeScript data modules"
    - "SYNC: comment convention applied to strings duplicated from src/i18n/ru.json"
    - "UPPER_SNAKE_CASE module constants for SITE_ORIGIN and DEFAULT_OG_IMAGE"

key-files:
  created:
    - scripts/seo-routes.ts
  modified: []

key-decisions:
  - "scripts/ directory (not src/) used for build-time scripts per D-08 (postbuild Node script pattern)"
  - "No ogImage on any entry — prerender script falls back to DEFAULT_OG_IMAGE (og-card-ru.png) site-wide per Phase 2 deferred policy"
  - "RU-only metadata per D-05 — Phase 3 will add bilingual support"
  - "/pay assigned prerender tier 'head' (not 'full') per D-02 to avoid Paddle hydration timing collisions"

patterns-established:
  - "Pattern S-2: Top-of-file phase comment with GEO requirement IDs and decision IDs"
  - "Pattern S-3: UPPER_SNAKE_CASE for module-level constants (SITE_ORIGIN, DEFAULT_OG_IMAGE)"
  - "Pattern S-4: SYNC: comment for strings duplicated from src/i18n/ru.json"
  - "Pattern S-5: Two-space indent throughout"

requirements-completed: [GEO-B-1]

# Metrics
duration: 15min
completed: 2026-05-15
---

# Phase 2 Plan 01: Per-route metadata manifest Summary

**Typed per-route SEO manifest at scripts/seo-routes.ts — RouteMeta interface + SITE_ORIGIN + DEFAULT_OG_IMAGE + 6-entry routes array with D-02 tier assignments, ready for downstream Plans 02-04 (prerender) and 02-05 (sitemap).**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-14T19:34:00Z
- **Completed:** 2026-05-14T19:49:28Z
- **Tasks:** 1/1 completed
- **Files modified:** 1

## Accomplishments

- Created `scripts/` directory (greenfield — did not exist before this plan) and established the convention for build-time TypeScript data modules
- Exported `RouteMeta` interface with 10 typed fields matching the interfaces contract from the plan
- Exported `SITE_ORIGIN = "https://opten.space"` and `DEFAULT_OG_IMAGE` template-literal constant
- Created `routes: RouteMeta[]` with exactly 6 entries in sitemap order, `/` route values byte-identical to `index.html` lines 7-8 and 16-17 (SYNC invariant)
- Tier assignments: `/` = "full", `/pay` = "head", `/welcome` = "full", `/privacy` = "full", `/terms` = "full", `/refund` = "full"
- `npm run build` exits 0 — no regression on existing Vite SPA build

## SYNC Invariant (D-03 / Pattern S-4)

The following `scripts/seo-routes.ts` fields are byte-identical to `index.html` and must be kept in step:

| Field | Source in index.html | Value |
|-------|---------------------|-------|
| `routes[0].title` | line 7 `<title>` | "Opten — AI-оценка и улучшение промптов для генерации изображений" |
| `routes[0].description` | line 8 `<meta name="description">` | "Opten оценивает промпт под конкретную нейросеть, показывает ошибки и исправляет их в один клик. Работает с 43+ моделями прямо в интерфейсе генератора." |
| `routes[0].ogTitle` | line 16 `og:title` | "Opten — не сливай кредиты на плохие промпты" |
| `routes[0].ogDescription` | line 17 `og:description` | "AI-оценка и улучшение промптов для 43+ моделей генерации изображений. Прямо в интерфейсе генератора." |

If `index.html` head values are updated, `scripts/seo-routes.ts` routes[0] must be updated in the same commit.

## Route Tier Assignments

| Path | Tier | Priority | Changefreq | Rationale |
|------|------|----------|------------|-----------|
| `/` | full | 1.0 | weekly | Main marketing landing page — full body prerender for AI citation |
| `/pay` | head | 0.8 | monthly | In sitemap per Phase 1; head-only to protect Paddle sync init (D-02) |
| `/welcome` | full | 0.6 | monthly | Post-install onboarding — marketing-content route |
| `/privacy` | full | 0.3 | yearly | Legal page — full prerender for completeness |
| `/terms` | full | 0.3 | yearly | Legal page — full prerender for completeness |
| `/refund` | full | 0.3 | yearly | Legal page — full prerender for completeness |

## Task Commits

1. **Task 1: Create scripts/seo-routes.ts** - `357b9ca` (feat)

**Plan metadata:** _(to be committed below)_

## Files Created/Modified

- `scripts/seo-routes.ts` — typed per-route metadata manifest; single source of truth for Phase 2 prerender metadata

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. The manifest is pure typed data with no UI rendering or data wiring gaps.

## Threat Flags

None. `scripts/seo-routes.ts` is a build-time data module: no network endpoints, no auth paths, no file I/O, no schema changes. Zero new trust-boundary surface.

## Self-Check: PASSED

- `scripts/seo-routes.ts` exists: confirmed
- `npm run build` exits 0: confirmed (1622 modules transformed, no errors)
- 6 route entries: confirmed (`grep -c 'path: "/'` = 6)
- 4 named exports: confirmed (`grep ... | wc -l` = 4)
- No leaked secrets: confirmed (grep returns empty)
- No trailing slashes on bare canonicals: confirmed (negative grep)
- Root title byte-identical to index.html line 7: confirmed
- Root description byte-identical to index.html line 8: confirmed
- Commit 357b9ca exists: confirmed
