---
tags:
  - gsd
  - context
  - phase
phase: 3
milestone: "geo-optimization"
kind: phase-context
---
# Phase 3: Bilingual routing — Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the EN audience discoverable to search engines and AI crawlers by emitting per-language URL siblings for marketing-content and the two extension-facing marketing-content surfaces, with correct `<html lang>`, `<link rel="alternate" hreflang>`, and per-page canonical at build time — **without renaming, redirecting, or otherwise touching the 5 already-shipped locked routes** (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`).

The fix closes audit finding **C-5** (no language signaling for EN audience; hardcoded `<html lang="ru">`; no `hreflang`) and satisfies GEO-C-1, GEO-C-2, GEO-C-3, GEO-C-4.

**Explicitly in this phase:**
- Per-language `/en/*` siblings for the 4 marketing-content routes (`/`, `/privacy`, `/terms`, `/refund`) and for 2 of the 5 locked routes (`/welcome`, `/pay`).
- `<html lang>` baked per-route at prerender time (`"en"` for `/en/*`, `"ru"` otherwise).
- `<link rel="alternate" hreflang="ru|en|x-default">` triplet on every prerendered page, with `x-default → /` (the RU canonical).
- `LangContext` reads the URL prefix and lets `/en/` override `navigator.language` + `localStorage.opten_lang`.
- `scripts/seo-routes.ts` extended: `RouteMeta.htmlLang` field, 6 new EN entries with English `title`/`description`/`ogTitle`/`ogDescription`.
- `scripts/prerender.mjs` extended: emit `dist/en/{route}/index.html` files; inject Paddle sync script into `dist/en/pay/index.html` (symmetric to existing `dist/pay/index.html`); emit per-route `<html lang>` and hreflang block.
- `scripts/sitemap.mjs` extended: list every prerendered `/en/*` page; `hreflang` pairs documented in sitemap (or per-page `<head>`, planner picks).
- A **first plan** in Phase 3 dedicated to diagnosing and fixing the **residual hydration mismatch on `/`** (carried forward from Phase 02.2 — see STATE.md). This must land BEFORE any of the bilingual planning files ship, so dynamic `<html lang>` does not compound an open issue.
- Header language switcher (already a `useLang()` consumer) now writes to `history` (e.g., `pushState("/en/welcome")`) instead of just flipping the context — URL is the source of truth.

**Explicitly NOT in this phase:**
- `/ru/*` siblings — root path `/` remains RU-canonical; physical `/ru/*` is not emitted. Hreflang `ru` points to `/` directly. (Reversible later via 301 redirects if symmetric prefix becomes desirable.)
- `/en/success`, `/en/account`, `/en/dashboard/download-skill` — `/success` is YooKassa-only (no EN reachability path), `/account` and `/dashboard/*` are `Disallow`'d (zero GEO value, extension-coupled).
- Coordinated `promptscore` extension release to start opening `/en/welcome` / `/en/pay` for EN users — out of scope; shipped extension keeps deep-linking to the root paths. EN users reach `/en/*` via search results or the header language switcher only.
- Server-side language detection / Vercel rewrite-level redirect on `/` — explicitly rejected (canonical conflict risk, hydration-mismatch amplification).
- `/about`, `/guides/*`, FAQ schema — Phase 4 scope (GEO-D-*).
- Auto-translation pipelines or LLM-driven content generation — out of scope; runtime EN content is already complete in `en.json` (203 keys parity with `ru.json`).

</domain>

<decisions>
## Implementation Decisions

### URL strategy & root behavior
- **D-01:** Path-prefix `/ru/* /en/*` is the chosen language URL design **(GEO-C-1 closed)**. `?lang=` query rejected (GEO/SEO near-zero — crawlers see one document). `ru.opten.space` subdomain rejected (DNS/cert overhead; extension would need to know two hosts).
- **D-02:** Root `/` stays RU-canonical and **emits no redirect** — neither client-side nor Vercel-level. canonical=`https://opten.space/`. Hreflang triplet on `/`: `ru → /`, `en → /en/`, `x-default → /`. `/ru/*` is NOT physically emitted (`/ru/welcome` is not a real file); the RU canonical for every page lives at the unprefixed path. Reason: minimum surprise for the shipped extension, no canonical-vs-redirect conflict, no double-render flash for users.

### Locked-route bilingual coverage
- **D-03:** EN siblings ship for `/welcome` and `/pay` only (in addition to the 4 marketing-content routes). `/success`, `/account`, `/dashboard/download-skill` stay RU-only by design:
  - `/success` — YooKassa is RUB-only; EN payers go through Paddle Checkout modal flow which never lands here. An `/en/success` URL would be dead.
  - `/account`, `/dashboard/download-skill` — `Disallow`'d in `public/robots.txt`, extension-coupled, zero GEO value, no external link path.
- **D-03b:** `scripts/prerender.mjs` must extend its Paddle-injection condition (`scripts/prerender.mjs:107` `meta.path === "/pay"`) to ALSO cover `/en/pay` — `dist/en/pay/index.html` must carry the synchronous Paddle CDN `<script>` tag. Integration Contract §6 is **extended symmetrically, not violated** — every `/pay` surface still ships Paddle sync. Contract update required alongside this plan.

### EN-SEO-meta source of truth
- **D-04:** EN-meta lives directly in `scripts/seo-routes.ts`. Approach:
  - Extend `RouteMeta` interface with `htmlLang: "ru" | "en"`.
  - Add 6 new `RouteMeta` entries for `/en/`, `/en/welcome`, `/en/pay`, `/en/privacy`, `/en/terms`, `/en/refund`, each with English `title` / `description` / `ogTitle` / `ogDescription` and `htmlLang: "en"`.
  - Keep current 7 entries unchanged but stamp them `htmlLang: "ru"`.
  - `ogImage` for `/en/*` points to `${SITE_ORIGIN}/og-card-en.png` (already in `public/` from Phase 1 GEO-A-4).
- Pulling EN-meta from `en.json` instead (single source of truth) is deferred — Phase 2 raised this refactor as a future cleanup, but not now: SEO meta is a build-time contract and keeps its own home for now.

### Runtime language detection
- **D-05:** [src/i18n/LangContext.tsx:12](../../../src/i18n/LangContext.tsx) `detectLang()` extended with a URL-prefix check that takes precedence over `navigator.language` and `localStorage.opten_lang`. Rule: `if (window.location.pathname.startsWith("/en/")) return "en";` runs first. localStorage and navigator only matter when path is unprefixed (root `/` and locked routes). The header language switcher must use `history.pushState` (or `react-router` `useNavigate`) so changing language changes the URL — URL is the source of truth.

### Pre-Phase-3 hygiene
- **D-06:** Phase 3 **Plan 01 = "diagnose + fix residual hydration mismatch on `/`"**. This lands before any bilingual plan ships, so dynamic `<html lang>` does not compound an open issue (STATE.md "Pre-Phase-3 known mismatch"). Escalation rule (for planner): if root cause turns out to be architectural (3+ commits or unrelated subsystem), split off into a separate mini-phase 2.3 during `/gsd-plan-phase 3` rather than blocking Phase 3 indefinitely.

### Claude's Discretion
- **Hreflang placement** — in each prerendered `<head>` (preferred) vs in `sitemap.xml` (allowed by Google but lower-leverage). Planner picks; default to `<head>` because it's read by AI crawlers without sitemap discovery.
- **Sitemap.xml shape** — pair-listed (current 6 RU + 6 EN entries = 12) vs hreflang-annotated XML (`<xhtml:link rel="alternate">` per URL). Both are valid; planner picks the simpler one.
- **`scripts/seo-routes.ts` ordering** — RU-then-EN grouped, or per-page (`/` followed by `/en/`). Cosmetic; planner picks.
- **LangContext URL-prefix detection implementation** — `useEffect` on path change, or wired through `react-router`'s `useLocation`. Planner picks; `useLocation` is cleaner because language follows route.
- **Header language-switcher behavior** — does clicking "EN" while on `/welcome` route to `/en/welcome`, or to `/en/` (root)? Default: route to the EN sibling of the current page if it exists, else to `/en/`. Planner confirms.
- **Treatment of locked routes that lack EN siblings (`/success`, `/account`, `/dashboard`)** — the header switcher on these routes should either disable the EN button or route to `/en/` (landing). Planner picks; "route to `/en/`" is more user-friendly.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit findings (the source of truth for what this phase must close)
- `.planning/research/GEO-AUDIT.md` §C-5 (lines 95–99) — primary driver: path-prefix `/ru/* /en/*` strategy, hreflang siblings, "highest-leverage SEO+GEO fix"
- `.planning/research/GEO-AUDIT.md` per-route crawl table (lines 350–360) — confirms current `<html lang="ru">` shipping to crawlers regardless of route
- `.planning/research/GEO-AUDIT.md` "No hreflang" entry (line 381) — direct mapping to GEO-C-3

### Roadmap & requirements
- `.planning/ROADMAP.md` §Phase 3 (lines 151–163) — phase boundary, dependency on Phase 2, locked-route hard constraint, success criteria sketch
- `.planning/REQUIREMENTS.md` §Phase 3 (lines 52–57) — GEO-C-1, GEO-C-2, GEO-C-3, GEO-C-4 verbatim
- `.planning/PROJECT.md` §Constraints + §Key Decisions — milestone-wide constraints (locked routes, static-file precedence, Paddle sync script) and the 8 ADR-locked integration decisions
- `.planning/STATE.md` "Pre-Phase-3 known mismatch" + "Locked-route constraint" — open hydration issue and the hard rule that `/ru/*` `/en/*` are additions

### Integration contract (MANDATORY before touching anything route- or build-coupled)
- `docs/INTEGRATION-CONTRACT.md` §3 (URL contract, lines 153–169) — locked routes table; `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` keep their root paths; "Don't" rename
- `docs/INTEGRATION-CONTRACT.md` §6 (Paddle SDK initialization, lines 236–268) — sync `<script>` tag MUST appear in every `/pay` HTML surface; D-03b extends this contract symmetrically to `/en/pay`
- `docs/INTEGRATION-CONTRACT.md` §8 — protocol for updating the contract document (must update "Last sync" date when D-03b lands)

### Phase 2 artifacts (what shipped, what to preserve)
- `.planning/phases/02-per-route-prerender-per-route-metadata/02-CONTEXT.md` — D-01 (build-time prerender, not runtime), D-02 (3 prerender tiers: full / head / none), D-03 (per-route manifest in `seo-routes.ts`), D-04 (uniform sitemap lastmod), D-05 (RU-only in Phase 2, deferred bilingual to Phase 3), D-06 (`hydrateRoot` vs `createRoot` + `__PRERENDER_PATH` guard), D-07 (no trailing slash), D-08 (postbuild Node script, no framework)
- `.planning/phases/02.2-mobile-perf-followup/02.2-CONTEXT.md` — Paddle lazy-load policy: sync script on `/pay` only, lazy via `src/lib/paddle.ts` elsewhere. D-03b in this phase extends that policy to `/en/pay`.

### Source files touched by this phase (researcher must read)
- `scripts/seo-routes.ts` — current 7-entry RU manifest; extended to 13 entries (7 RU + 6 EN) with new `htmlLang` field
- `scripts/prerender.mjs` (especially lines 22–60 + 97–107) — current prerender pipeline; extended to emit `dist/en/{route}/index.html` and inject Paddle on both `/pay` and `/en/pay`
- `scripts/sitemap.mjs` — current 6-entry sitemap; extended to ~12 entries with hreflang annotations
- `scripts/entry-server.tsx` — SSR entry; must produce HTML usable for both RU and EN routes (router-driven)
- `src/main.tsx` (especially lines 44–72) — `BrowserRouter` + Routes + hydration-detector; extended with `/en/*` route declarations (or wildcard prefix routing)
- `src/i18n/LangContext.tsx` (lines 7–50) — `detectLang()` extended with URL-prefix check (D-05); `LangProvider` reacts to route changes via `useLocation`
- `index.html` (current `<html lang="ru">` at line 2) — stays as template; prerender stamps actual `lang` per output file
- `public/robots.txt` — confirms which routes stay disallowed (no EN treatment needed); `Sitemap:` line stays
- `vercel.json` (current rewrite `/((?!api/).*) → /index.html`) — confirm that `dist/en/{route}/index.html` files shadow the rewrite correctly; researcher to verify no extra rewrite needed

### i18n surface (already complete — confirm parity)
- `src/i18n/ru.json` + `src/i18n/en.json` — 203 keys each, full parity (verified 2026-05-16 via `Object.keys()` diff). EN-runtime content is shipping-ready.
- `public/assets/welcome-{ru,en}-*.png` — bilingual screenshot pairs already in place (see [WelcomePage.tsx:11](../../../src/app/pages/WelcomePage.tsx:11))

### OG assets
- `public/og-card-ru.png` — RU OG card (Phase 1 GEO-A-4)
- `public/og-card-en.png` — EN OG card (Phase 1 GEO-A-4, queued for use; Phase 3 wires it into `/en/*` entries)

### Tech stack baseline
- `CLAUDE.md` "Tech stack" section — Vite 6, React 18.3, React Router 7, Tailwind 4, no tests/lint/typecheck
- `.planning/codebase/STRUCTURE.md` — current directory map (Phase 02.1-02.2 era)
- `.planning/codebase/INTEGRATIONS.md` — current Paddle / Supabase / extension wiring

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`scripts/seo-routes.ts`** — already the canonical place for per-route metadata. Extending it (vs creating a parallel EN manifest) keeps single-source-of-truth for SEO. The file already declares pricing-string duplication policy ("SYNC: title/description strings duplicated from src/i18n/ru.json") — D-04 inherits that policy unchanged for EN.
- **`scripts/prerender.mjs:97-107` `applyPaddleScript`** — existing function that injects Paddle's sync `<script>` into `/pay` HTML. D-03b reuses this by widening the matching condition; no second injection mechanism needed.
- **`scripts/prerender.mjs:22` `renderRoute(path)`** — SSR entry already accepts a path argument. Routes for `/en/*` register in `BrowserRouter` and `renderRoute("/en/welcome")` produces the EN tree because `LangContext` (post-D-05) reads the prefix.
- **`src/i18n/en.json` (203 keys)** — runtime EN content is complete. Phase 3 doesn't write content; it only routes existing content.
- **`public/assets/welcome-en-*.png`** — bilingual screenshots already present in [WelcomePage.tsx:11-14](../../../src/app/pages/WelcomePage.tsx:11) — `/en/welcome` will render the EN slide deck automatically.
- **`public/og-card-en.png`** — EN OG card already shipped by Phase 1 GEO-A-4 in anticipation of this phase.
- **`window.__PRERENDER_PATH` discriminator in [main.tsx:65-66](../../../src/main.tsx:65)** — already understands per-path prerender; `/en/welcome` etc. drop into the same hydration check unchanged.

### Established Patterns
- **Static-file shadowing (Phase 1, reconfirmed in Phase 2)** — Vercel's SPA rewrite `/((?!api/).*) → /index.html` is a fallback. Real files in `dist/` win first. `dist/en/welcome/index.html` will serve at `/en/welcome` with zero `vercel.json` changes (researcher confirms).
- **No-trailing-slash canonical (Phase 2 D-07)** — applies to EN paths too: `/en/welcome`, `/en/pay`, not `/en/welcome/`. Root EN stays `/en/` (mirrors `/` having the slash). Manifest uses `/en/` for the EN landing.
- **Atomic-commit-per-requirement (Phase 1 + Phase 2 pattern)** — Phase 3 plans should mirror this. One plan per logical change (e.g., "add htmlLang field to RouteMeta and stamp existing routes", "add 6 EN entries to manifest", "extend prerender.mjs for EN dir", "extend Paddle injection condition", "patch LangContext URL-prefix detection", "extend sitemap.mjs for EN", "register /en/* routes in main.tsx", "fix residual hydration mismatch on /" — last shipping FIRST).
- **Synchronous Paddle script tag (DEC-integration-contract-paddle-init)** — every `/pay` surface keeps it. D-03b is the symmetric extension to `/en/pay`.
- **Disallow set in `public/robots.txt`** — explicitly defines which routes deserve no AI-crawler attention. The same set defines "no EN sibling needed" in D-03.

### Integration Points
- **`src/main.tsx` route declarations** — must register `/en/*` paths (per-page or with a wildcard `<Route path="/en/*">` that re-uses the existing route children with a lang prop). Either keeps `BrowserRouter` intact.
- **`scripts/prerender.mjs` route iteration** — currently iterates `routes` from `seo-routes.ts`. Once D-04 adds 6 EN entries, the same loop produces 6 new HTML files without code change beyond `htmlLang` stamping and the Paddle condition widening.
- **`vercel.json`** — no expected change; researcher confirms that emitted `dist/en/{route}/index.html` files shadow the rewrite. If Vercel needs explicit nested-directory clean URLs, that becomes a plan task.
- **Header language switcher (current consumer of `useLang()`)** — needs to write through `history` (e.g., via `react-router` `useNavigate("/en/...")`) instead of just `setLang("en")`. URL becomes the source of truth.
- **Phase 02.2-known hydration mismatch on `/`** — Plan 01 of Phase 3 lands the fix. Plan 02+ touch `<html lang>` only after Plan 01 is green.

</code_context>

<specifics>
## Specific Ideas

- **Aim: `~/.claude/skills/geo/scripts/fetch_page.py` on `/en/` reports `has_ssr_content: true`, `word_count > 100`, and a distinct `<title>` from `/`** — the acceptance bar mirrors the Phase 2 post-deploy verification protocol.
- **Hreflang triplet (ru, en, x-default) on every prerendered page** — three `<link rel="alternate">` tags per `<head>`. `x-default` always points at the unprefixed RU path (matches "RU-canonical" stance from D-02). Make this a constant block in `prerender.mjs` based on `meta.path` (or a `pair` field added to RouteMeta in D-04).
- **`/en/pay` Paddle injection — symmetric to `/pay`** — same sync `<script>` tag, same position in `<head>`, same `Environment.set` guard in `src/lib/paddle.ts`. Contract §6 update committed in the same plan.
- **`dist/en/index.html`** is the EN landing — separate file from `dist/index.html` (RU). Both prerender from `entry-server.tsx renderRoute("/")` and `renderRoute("/en/")` respectively; `LangContext` decides which dict.
- **First plan is the hydration-mismatch fix on `/`** — explicit; researcher will pinpoint the source (likely `LangProvider`'s `useEffect` on mount writing `document.documentElement.lang` after hydration → React sees `<html>` attribute change on first client render).

</specifics>

<deferred>
## Deferred Ideas

- **Physical `/ru/*` symmetry** — Phase 3 keeps `/ru/*` virtual (hreflang `ru → /`). If post-launch SEO instrumentation suggests Google/Yandex prefer explicit `/ru/*`, ship in a Phase 3.1 as 301 redirects `/ru/{route} → /{route}` plus updated hreflang pairs.
- **`/en/success`, `/en/account`, `/en/dashboard/download-skill`** — architecturally have no EN path: `/success` is YooKassa-RUB-only; the other two are `Disallow`'d and extension-coupled. If a coordinated extension release ever opens these routes for EN users (D-03b-style symmetric extension of paths), revisit.
- **Coordinated `promptscore` extension release to open `/en/welcome` / `/en/pay` based on `navigator.language`** — would need a `manifest.json` bump and the `breaking-change protocol` from `docs/INTEGRATION-CONTRACT.md §5`. Out of scope for this site-side phase.
- **EN-meta migration to `en.json`** — replacing D-04 ("EN-meta lives in `seo-routes.ts`") with a single-source-of-truth approach via `en.json` is appealing long-term (kills the "duplicated from ru.json" note in `seo-routes.ts`). Defer to a future hygiene phase that touches both i18n and SEO at once.
- **Server-side `/` → `/en/` redirect for `navigator.language=en` users** — explicitly rejected in D-02 (canonical-vs-redirect conflict, hydration-mismatch amplification). Revisit only if measured EN conversion on `/` is much worse than on `/en/`.
- **`<html lang>` per-language in `index.html` source template** — the template stays `lang="ru"` (its only consumer is `dist/index.html` which is RU). EN-routes get their `lang` baked by `prerender.mjs` per output file.
- **Switching the header language switcher to a `<select>` or to flag icons** — UI polish, not a routing concern. Defer.
- **Phase 4 content (`/about`, `/guides/*`, FAQ)** — explicitly Phase 4 scope; Phase 3 ships bilingual scaffolding so Phase 4 plans land bilingual from day one.

</deferred>

---

*Phase: 3 — Bilingual routing*
*Context gathered: 2026-05-16*
