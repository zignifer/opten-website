---
tags:
  - gsd
  - context
  - phase
phase: 2
milestone: "geo-optimization"
kind: phase-context
---
# Phase 2: Per-route prerender + per-route metadata — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** `--auto` (recommended option chosen for every gray area; see `02-DISCUSSION-LOG.md`)

<domain>
## Phase Boundary

Make each marketing route on opten.space return a distinct, pre-hydration HTML document that AI crawlers and link-preview clients can quote — by generating per-route `<title>`, `<meta description>`, `<link rel="canonical">`, and per-route Open Graph tags at build time, and (for marketing-content routes) by emitting real React-rendered body content into `dist/{route}/index.html`. This closes audit findings **C-1** (no SSR) and **C-4** (one shared title/meta across 7 routes) and unblocks GEO-B-3 (per-route `lastmod` in sitemap.xml).

**Explicitly in this phase:** prerendered static HTML for marketing-content routes, central per-route metadata manifest, sitemap.xml `lastmod` derived from build, hydration on prerendered routes.

**Explicitly NOT in this phase:** bilingual `/ru/*` `/en/*` URL siblings (Phase 3), `<html lang>` dynamism (Phase 3), `/about` content surface (Phase 4), `FAQPage` JSON-LD (Phase 4), per-route OG hero card images (Phase 4+), brand-authority work (Phase 5).

</domain>

<decisions>
## Implementation Decisions

All decisions auto-selected from the recommended option. Re-open before planning if any look wrong.

### D-01. Head-management strategy: build-time prerender, not runtime
**Decision:** Implement per-route metadata via a build-time prerender step that emits `dist/{route}/index.html` files. Do **not** use `react-helmet-async` (runtime-only — does not solve C-1, the audit's primary criticism).
**Rationale:** `.planning/research/GEO-AUDIT.md` §C-1 and §C-4 are explicit that build-time is preferred — runtime head management does not reach the GPTBot / ClaudeBot / PerplexityBot / Google-Extended / Applebot-Extended crawlers documented in `public/robots.txt`. Phase 1 already proved that real files in `dist/` shadow Vercel's SPA rewrite (`/((?!api/).*) → /index.html`), so emitted per-route HTML files will be served before the fallback kicks in.
**Researcher to validate:** which tooling — Vike, `vite-plugin-prerender`, `react-snap`, or a hand-rolled Node script using `react-dom/server.renderToString` + `react-router`'s `StaticRouter` — has the lowest migration cost given the existing `BrowserRouter` setup in [src/main.tsx](../../../src/main.tsx).

### D-02. Prerender scope: marketing-content routes full body, /pay head-only, billing/dashboard SPA-only
**Decision:** Three tiers of treatment, route-by-route:
- **Full body prerender** (head + React-rendered body in `dist/{route}/index.html`): `/`, `/welcome`, `/privacy`, `/terms`, `/refund` — 5 routes.
- **Head-only injection** (per-route `<head>` written into `dist/pay/index.html`, body stays SPA-empty as today): `/pay`. Paddle Checkout modal is initiated by client-side JS (`window.Paddle.Checkout.open`) and the page does very little non-interactive content rendering; full prerender risks hydration timing collisions with the synchronous Paddle SDK bootstrap in [src/main.tsx](../../../src/main.tsx) ("Pitfall BG-67-01" — extension memory).
- **No prerender** (continue to serve `dist/index.html` via SPA fallback as today): `/account`, `/success`, `/dashboard/download-skill`. These are extension-coupled, `Disallow`'d in `public/robots.txt`, omitted from `public/sitemap.xml`, and have no AI-citation value.

**Rationale:** The audit (§C-1) itself notes "billing routes (`/pay`, `/account`, `/success`) can stay SPA — they're not for AI citation". This decision is more conservative: `/pay` *is* in the sitemap (Phase 1 milestone-level decision, see PROJECT.md), so it gets per-route head, but its body stays SPA to protect the Paddle handshake. Memory `feedback_autonomy_and_caution` (extra caution around extension-coupled surfaces) reinforces leaving `/account`, `/success`, `/dashboard/*` untouched.

### D-03. Per-route metadata source: central manifest
**Decision:** Create one canonical file — provisional name `scripts/seo-routes.ts` (researcher may pick `src/seo/routes.ts` or `seo.config.ts` depending on whether the file must be importable by both Vite and Node) — that exports a typed array describing every route's `title`, `description`, `canonical`, `og:title`, `og:description`, `og:image`, `og:type`, `priority`, and `lastmod` flag.
**Rationale:** Avoids polluting every `*Page.tsx` with metadata exports; gives the future Phase 3 bilingual work a single place to add per-language tables; lets the sitemap generator and the prerender script consume the same source.
**Note:** RU values for v1 must stay in sync with the i18n RU dict ([src/i18n/ru.json](../../../src/i18n/ru.json)) — pricing strings and the headline tagline appear in both. Phase 1 already locked this duplication policy (PROJECT.md milestone decision: "Pricing values sourced from `src/i18n/ru.json` and must stay in sync"). Researcher to decide whether the manifest imports from `ru.json` or duplicates with a sync comment.

### D-04. Sitemap lastmod: uniform build-time ISO date (GEO-B-3)
**Decision:** Generate `dist/sitemap.xml` at build time from the same per-route manifest in D-03. Every `<lastmod>` entry uses one ISO date computed once at build start (`new Date().toISOString().split('T')[0]`).
**Rationale:** opten.space pushes are batch releases — every push to `main` triggers a Vercel deploy and the marketing routes ship together. Per-route git mtime would imply more granularity than the workflow has. If a single route changes meaningfully, the build date still updates on the next deploy. This also lets us keep `public/sitemap.xml` as the Phase 1 static fallback while `dist/sitemap.xml` (emitted by the build script) wins precedence.

### D-05. Language coverage: RU only in Phase 2
**Decision:** All prerendered routes emit RU titles, descriptions, OG values, and keep `<html lang="ru">` hardcoded (status quo from [index.html](../../../index.html) line 2).
**Rationale:** Bilingual routing is Phase 3 scope per ROADMAP.md and REQUIREMENTS.md (GEO-C-*). Doing EN inside Phase 2 would force the per-language URL strategy decision (GEO-C-1, currently OPEN) prematurely. Phase 1's milestone decision (PROJECT.md: "OG `og:image` = RU card; `<html lang="ru">` is hardcoded") sets this precedent.

### D-06. Hydration: `hydrateRoot` for prerendered routes, `createRoot` for SPA routes
**Decision:** Swap [src/main.tsx](../../../src/main.tsx)'s `createRoot(...).render(...)` for a small runtime detector: if `#root` has prerendered children (`document.getElementById('root')?.hasChildNodes()`), use `hydrateRoot`; otherwise `createRoot`. SPA-only routes (`/account`, `/success`, `/dashboard/*`) continue with `createRoot`. Marketing routes get hydrated.
**Rationale:** Hydration preserves the SEO-relevant DOM the crawler reads; without it, React replaces the prerendered tree on first render and the GEO win is fragile to deferred re-renders (e.g., `<Suspense>`, motion-driven mount animations). Researcher to flag any hydration-mismatch risks in [src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx) (it reads `localStorage.opten_lang` + `navigator.language` — both unavailable at build time) and in `motion` components.

### D-07. Canonical URL & trailing-slash policy
**Decision:** Bare paths — `https://opten.space/welcome`, no trailing slash. The root canonical is `https://opten.space/`. Matches Phase 1's `public/sitemap.xml` URL convention.
**Rationale:** Avoids the historic SEO trap of duplicate-content via trailing-slash vs non-trailing-slash. No precedent in this repo for trailing-slash routing, and Vercel does not enforce one by default.

### D-08. Build pipeline change is in-scope; no new framework
**Decision:** Phase 2 *does* modify the build pipeline (Phase 1 explicitly did not — that constraint was Phase-1-only per PROJECT.md). Prefer the smallest pipeline change that delivers per-route HTML: a postbuild Node script invoked from `npm run build` (e.g., `vite build && node scripts/prerender.mjs`), not a framework migration to Next.js / Astro / Vike.
**Rationale:** No tests, no lint, no typecheck script in this repo (CLAUDE.md "Tech stack"). A framework migration introduces validation surface area this project has no automation to catch. A standalone postbuild script is reversible (`git revert` removes both the script and the `package.json` script edit).

### Claude's Discretion
- **Exact tool choice** for prerendering (custom `renderToString` + `StaticRouter`, vs `vite-plugin-prerender`, vs Vike, vs `react-snap`). Researcher should produce a side-by-side and pick. Constraints: must not break the existing `npm run dev` / Vite preview workflow, must keep the synchronous Paddle CDN script tag intact in every emitted HTML, must allow hydration.
- **Where the per-route manifest lives** (`scripts/seo-routes.ts` vs `src/seo/routes.ts` vs `seo.config.ts`) — depends on whether the prerender script runs in Vite's context or as a pure Node postbuild.
- **How to handle 404 / unknown routes** in the prerender step — out of scope for the audit findings, so default to "skip; SPA fallback handles them".

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit findings (the source of truth for what this phase must close)
- `.planning/research/GEO-AUDIT.md` §C-1 (no SSR; lines 54–60) — primary driver for full-body prerender on marketing routes
- `.planning/research/GEO-AUDIT.md` §C-4 (one shared title/meta; lines 87–93) — primary driver for per-route head injection on every prerendered route
- `.planning/research/GEO-AUDIT.md` §H-3 (no E-E-A-T surface; lines 131–135) — NOT this phase's concern, listed so researcher does not pull it in
- `.planning/research/GEO-AUDIT.md` per-route crawl table (lines 350–360) — confirms which routes the AI fetch script visited at audit time

### Roadmap & requirements
- `.planning/ROADMAP.md` §Phase 2 (lines 57–68) — phase boundary, dependency on Phase 1, success criteria sketch
- `.planning/REQUIREMENTS.md` §Phase 2 (lines 42–48) — GEO-B-1, GEO-B-2, GEO-B-3 verbatim
- `.planning/PROJECT.md` §Constraints + §Key Decisions — milestone-wide constraints (locked routes, static-file precedence, Paddle sync script tag) and the 8 ADR-locked integration decisions

### Integration contract (read before touching anything route- or build-coupled)
- `docs/INTEGRATION-CONTRACT.md` §3 (Routes) — `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` are extension deep-link targets; renaming or losing any of them is a breaking change
- `docs/INTEGRATION-CONTRACT.md` §4 (Edge Functions + hardcoded `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `EXTENSION_IDS`) — duplicated in 3 page files; prerender must not break the build-time substitution of these constants
- `docs/INTEGRATION-CONTRACT.md` §6 (Paddle init protocol — sync script tag in `index.html`, no `Environment.set('production')`) — every emitted HTML file MUST keep the sync Paddle script tag

### Phase 1 artifacts (what shipped, what to preserve)
- `.planning/phases/01-static-geo-foundations/1-SPEC.md` — Phase 1 spec; explains why `/pay` is crawlable and `/account`, `/success`, `/dashboard` are not
- `.planning/phases/01-static-geo-foundations/1-PLAN.md` — Phase 1 task breakdown; reference for the "atomic commit per requirement" pattern this phase should mirror
- `public/sitemap.xml` — current 6-route sitemap; `dist/sitemap.xml` from Phase 2 must remain a superset (no route removed)
- `public/robots.txt` — current `Disallow` policy; `/account`, `/success`, `/dashboard` already blocked from AI crawlers — confirms they don't need prerender
- `public/llms.txt` — current product summary; per-route prerender does not change it
- `vercel.json` — current rewrite `/((?!api/).*) → /index.html` is the fallback that emitted `dist/{route}/index.html` files must shadow

### Tech stack baseline (so researcher knows the surface)
- `CLAUDE.md` "Tech stack" section — Vite 6, React 18.3, React Router 7, Tailwind 4, no tests/lint/typecheck
- `index.html` (lines 1–80) — current `<head>` with Paddle preconnect + 2 JSON-LD blocks + favicon hierarchy that every emitted HTML file must inherit
- `src/main.tsx` — current `BrowserRouter` + Paddle bootstrap order; prerender must produce HTML compatible with the post-hydration tree
- `src/i18n/ru.json`, `src/i18n/en.json`, `src/i18n/LangContext.tsx` — locale layer; hydration-mismatch risk if prerender bakes the wrong language string into the body
- `vite.config.ts` — current Vite config (React + Tailwind plugins, `assetsInclude` for svg/csv, `historyApiFallback`); prerender tooling must coexist with these plugins

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`public/sitemap.xml`** — already lists exactly the 6 marketing routes Phase 2 will prerender. The route list is essentially the same; the prerender manifest in D-03 can mirror its URL set.
- **`public/robots.txt`** — already blocks AI crawlers from `/account`, `/success`, `/dashboard/`. This is the exact "do not prerender" set in D-02.
- **`src/i18n/ru.json`** — already contains every page's headline, description, and tagline. The per-route metadata manifest in D-03 can import or mirror these strings. Pricing duplication policy (PROJECT.md milestone decision) applies.
- **Phase 1 JSON-LD + OG block in `index.html` lines 50–80** — these inline scripts MUST appear in every emitted HTML file. The prerender template should preserve the whole `<head>` of the source `index.html`, only overriding `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title">`, `<meta property="og:description">`, and (where applicable) `<meta property="og:image">`.

### Established Patterns
- **Static-file shadowing (Phase 1)** — Vercel's SPA rewrite `/((?!api/).*) → /index.html` is a *fallback*. Real files in `dist/` win first (proven by Phase 1: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og-card-*.png` all serve as static files with correct MIME types). Phase 2 emits `dist/welcome/index.html` etc.; same precedence applies.
- **Synchronous Paddle script tag** (PROJECT.md DEC-integration-contract-paddle-init) — every HTML file must keep the Paddle CDN `<script>` synchronous so `window.Paddle` exists before `main.tsx` runs. Prerender template must NOT add `async` / `defer`.
- **i18n via React Context, no SSR primitives** — [src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx) reads `localStorage` and `navigator.language` on mount. At prerender time both are unavailable. Strategy: prerender with RU default (matches `<html lang="ru">`), let hydration pick up the real preference. Researcher should test for visible flash-of-RU on EN-locale machines.
- **Path alias `@` → `./src`** — already configured in [vite.config.ts](../../../vite.config.ts); any prerender script that runs through Vite resolves this for free, a pure Node script does not.

### Integration Points
- **`src/main.tsx` (entry)** — must switch from unconditional `createRoot` to `createRoot`-or-`hydrateRoot` branching per D-06. Keep the Paddle bootstrap block above the render call.
- **`vercel.json`** — no change expected if `dist/{route}/index.html` files shadow the rewrite correctly. Researcher to confirm; if Vercel needs an explicit `cleanUrls: true` to serve `dist/welcome/index.html` at `/welcome`, that becomes a plan task.
- **`public/sitemap.xml`** — Phase 1's static file stays as fallback. Phase 2's build script writes `dist/sitemap.xml` (overrides at deploy). Researcher to confirm Vercel serves the `dist` version (it should — `dist/` is the build output).
- **`index.html`** — becomes a *template* for the prerender script; current content stays but the prerender step duplicates it per route with overrides.
- **`package.json` scripts** — `"build": "vite build"` becomes `"build": "vite build && node scripts/prerender.mjs"` (or equivalent). Single line change.

</code_context>

<specifics>
## Specific Ideas

- **The audit explicitly compares two paths in §C-4:** runtime `react-helmet-async` vs build-time prerender. We are picking build-time, *and* we are committing to render real body content (not just `<head>`) on the marketing-content routes — because the audit's §C-1 fix calls for `has_ssr_content: true` and a non-trivial `word_count`, which `react-helmet-async` cannot deliver.
- **`/pay` is special** — it is in the sitemap with priority 0.8 (per Phase 1 GEO-A-2), so it needs per-route head metadata. But it loads Paddle's modal via a sync CDN script that bootstraps in `main.tsx` before React renders (per DEC-integration-contract-paddle-init). Head-only prerender for `/pay` is the safest answer.
- **The audit's per-route fetch table** (`GEO-AUDIT.md` lines 350–360) shows `has_ssr_content: false`, `word_count: 9`, `h1_tags: []` for every route. The post-Phase-2 acceptance check should reuse `~/.claude/skills/geo/scripts/fetch_page.py` and confirm `has_ssr_content: true`, `word_count > 100`, `h1_tags: [<actual h1>]` on the 5 fully-prerendered routes.
- **Sitemap `lastmod` (GEO-B-3) is small** — one ISO date for v1; revisit per-route mtime if the AI Overviews score doesn't move.

</specifics>

<deferred>
## Deferred Ideas

- **Per-route OG hero images** (e.g., `og-card-welcome-ru.png`, `og-card-privacy-ru.png`). Phase 4+ work; Phase 2 keeps `og-card-ru.png` site-wide.
- **`<html lang>` dynamism per route + `hreflang` annotations** — Phase 3 scope (GEO-C-3, GEO-C-4); requires the bilingual URL strategy decision first.
- **`/about` E-E-A-T surface, `/guides/*` HowTo content, FAQ schema** — Phase 4 scope (GEO-D-1..3); these are content-creation work, not infrastructure.
- **`BreadcrumbList` JSON-LD per route** — useful once content grows past 5 marketing routes; defer to Phase 4 when `/guides/*` ships.
- **Per-route git mtime for sitemap `lastmod`** — only worth doing if marketing routes start updating independently of each other. Currently every push to `main` is a release.
- **Migrating away from `BrowserRouter` to a file-based router (e.g., Vike, TanStack Router file routes)** — out of scope; the postbuild-script approach in D-08 sidesteps this entirely.
- **Adding tests / ESLint / typecheck to validate prerender output** — out of scope per REQUIREMENTS.md "Out of Scope". Verification stays `npm run build` + `npm run preview` + `curl` + `~/.claude/skills/geo/scripts/fetch_page.py`.

</deferred>

---

*Phase: 2 — Per-route prerender + per-route metadata*
*Context gathered: 2026-05-15*
*Mode: `--auto`; recommended option chosen for all gray areas.*
