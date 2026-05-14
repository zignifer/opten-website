---
tags:
  - gsd
  - discussion-log
  - phase
phase: 2
kind: discussion-log
---
# Phase 2: Per-route prerender + per-route metadata — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in [[02-CONTEXT]] — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 02-per-route-prerender-per-route-metadata
**Mode:** `--auto` (no user prompts; recommended option auto-selected for every area)
**Areas discussed:** Head-management strategy, Prerender scope, Body-content depth, Language coverage, Per-route metadata source, Sitemap lastmod, Hydration approach, Canonical & trailing-slash policy

---

## Head-management strategy (GEO-B-1)

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time prerender | Emit `dist/{route}/index.html` per route with overridden `<head>`; works for non-JS crawlers; audit-recommended | ✓ |
| `react-helmet-async` runtime | Manage `<head>` from React; simple migration; **does not solve C-1** — crawlers still see SPA shell | |
| Hybrid (helmet + selective prerender) | Both; adds complexity without removing risk of stale runtime metadata | |

**Auto-mode rationale:** GEO-AUDIT.md §C-1 + §C-4 explicitly recommend build-time. Phase 1 proved real files in `dist/` shadow the SPA rewrite.
**Notes:** Researcher to compare specific tooling (Vike vs `vite-plugin-prerender` vs hand-rolled `renderToString` + `StaticRouter`).

---

## Prerender scope (which routes get what treatment)

| Option | Description | Selected |
|--------|-------------|----------|
| Marketing-content full body + `/pay` head-only + billing/dashboard SPA | Three-tier; respects extension coupling + Paddle init protocol | ✓ |
| All 8 routes full body | Maximum SEO surface; introduces Paddle/extension hydration risk on every route | |
| Root `/` only | Minimal change; leaves C-4 mostly unsolved | |

**Auto-mode rationale:** GEO-AUDIT.md §C-1 itself says "billing routes (`/pay`, `/account`, `/success`) can stay SPA — they're not for AI citation". `/account`, `/success`, `/dashboard/*` are already `Disallow`'d in `public/robots.txt`. `/pay` is in `public/sitemap.xml` (Phase 1 decision) so it gets per-route head but body stays SPA to protect Paddle.
**Notes:** Memory `feedback_autonomy_and_caution` reinforces leaving extension-coupled routes alone.

---

## Body-content depth on prerendered routes

| Option | Description | Selected |
|--------|-------------|----------|
| Full body render (5 routes) + head-only (`/pay`) | Real `word_count`, real `h1_tags`, closes C-1 where audit cares; head-only protects Paddle | ✓ |
| Head-only everywhere | Closes C-4 only; audit's `has_ssr_content: true` requirement remains unmet | |
| Full body everywhere including `/pay` | Maximum surface, but hydration timing collides with Paddle SDK bootstrap (BG-67-01 pitfall) | |

**Auto-mode rationale:** Hybrid is the only option that closes both audit findings without breaking the Paddle integration contract.

---

## Language coverage

| Option | Description | Selected |
|--------|-------------|----------|
| RU only in Phase 2 | Matches `<html lang="ru">` hardcode; defers per-language URL question to Phase 3 | ✓ |
| RU + EN simultaneously | Requires resolving GEO-C-1 (per-language URL strategy) — currently OPEN | |

**Auto-mode rationale:** GEO-C-1 (URL strategy) is explicitly the Phase 3 open question per ROADMAP.md. Adding EN in Phase 2 forces an early commit.

---

## Per-route metadata source-of-truth

| Option | Description | Selected |
|--------|-------------|----------|
| Central manifest (`scripts/seo-routes.ts` or similar) | Single source; consumable by build script + future sitemap generator + bilingual layer | ✓ |
| Per-page metadata exports from `*Page.tsx` | Co-located with route; harder for a Node prerender script to import without going through Vite | |
| Data file under `src/i18n/` | Couples SEO to i18n; bilingual Phase 3 might prefer this — but premature | |

**Auto-mode rationale:** Manifest is the lowest-coupling option and gives Phase 3 a clean spot to add `en` siblings.
**Notes:** Pricing duplication policy from Phase 1 (PROJECT.md) still applies — RU titles/descriptions in the manifest must stay in sync with [src/i18n/ru.json](../../../src/i18n/ru.json).

---

## Sitemap `lastmod` (GEO-B-3)

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform build-time ISO date | One `Date.now()` ISO per build, same across routes; simple | ✓ |
| Per-route git mtime | More granular; overkill for batch-deploy site where every push to `main` is a release | |
| Omit `lastmod` entirely | Keeps Phase 1 behavior; fails GEO-B-3 requirement | |

**Auto-mode rationale:** Marketing routes change in batches with each Vercel deploy. Per-route mtime implies independence the workflow doesn't have.

---

## Hydration approach

| Option | Description | Selected |
|--------|-------------|----------|
| `hydrateRoot` on prerendered routes, `createRoot` elsewhere | Preserves SEO DOM after client-side mount; standard React 18 pattern | ✓ |
| Always `createRoot` (replace prerendered DOM) | Simpler `main.tsx`; crawler-visible content is fragile to motion / Suspense re-renders | |

**Auto-mode rationale:** Hydration is the supported React 18 pattern for prerender. Detector on `#root.hasChildNodes()` is one line.
**Notes:** Researcher must flag hydration-mismatch risks in `LangContext` (reads `localStorage` / `navigator.language` on mount — both undefined at prerender time) and any `motion` mount animations.

---

## Canonical & trailing-slash policy

| Option | Description | Selected |
|--------|-------------|----------|
| Bare paths (no trailing slash except `/`) | Matches Phase 1 `public/sitemap.xml`; no redirect tangles | ✓ |
| Trailing slash everywhere | Forces a redirect tier; no precedent in repo | |
| No opinion (canonical = exact request URL) | Risks duplicate-content; defeats canonical's purpose | |

**Auto-mode rationale:** Matches existing artefact ([public/sitemap.xml](../../../public/sitemap.xml)). No reason to diverge.

---

## Claude's Discretion

- Exact prerender tooling (Vike vs `vite-plugin-prerender` vs custom `renderToString` + `StaticRouter` Node script vs `react-snap`) — comparative analysis is researcher's job. Constraint: do not migrate framework; do not break `npm run dev`; preserve synchronous Paddle script tag; allow hydration.
- Per-route manifest filename / location — `scripts/seo-routes.ts` vs `src/seo/routes.ts` vs `seo.config.ts` depends on whether the prerender script runs through Vite or as plain Node.
- 404 / unknown-route handling at prerender — default "skip, let SPA fallback handle it"; not in any audit finding.

## Deferred Ideas

(Echoed in CONTEXT.md `<deferred>` for downstream visibility.)

- Per-route OG hero card images — Phase 4+ asset work.
- `<html lang>` dynamism + `hreflang` cross-links — Phase 3 (GEO-C-3, GEO-C-4).
- `/about` page, `/guides/*` HowTo, `FAQPage` JSON-LD — Phase 4 (GEO-D-*).
- `BreadcrumbList` JSON-LD — useful once content grows past 5 marketing routes.
- Per-route git mtime for sitemap `lastmod` — only if marketing routes start updating independently.
- File-based router migration (Vike, TanStack Router) — out of scope; postbuild script sidesteps the need.
- Tests / lint / typecheck to validate prerender output — out of scope per REQUIREMENTS.md.
