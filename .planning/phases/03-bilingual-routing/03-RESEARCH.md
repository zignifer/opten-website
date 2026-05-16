---
tags:
  - gsd
  - research
  - phase
phase: 3
milestone: "geo-optimization"
kind: phase-research
---
# Phase 3: Bilingual routing — Research

**Researched:** 2026-05-16
**Domain:** SSR/SSG bilingual SEO + hydration + React Router 7 path-prefix routing
**Confidence:** HIGH (all upstream decisions verified against shipped code; one MEDIUM area — the exact root cause of the residual hydration mismatch is rigorously diagnosed below but proof requires running the dev/preview build with React DevTools to confirm, which is a planner-level task).

---

## Summary

Phase 3 is a **mechanical extension** of the Phase 2 prerender pipeline plus a **surgical patch to `LangContext`**. The infrastructure is in place:

- `scripts/seo-routes.ts` is the single per-route manifest already iterated by both `prerender.mjs` and `sitemap.mjs` — adding 6 EN entries with one new `htmlLang` field is enough to drive HTML emission, sitemap inclusion, and `<html lang>` stamping.
- `scripts/prerender.mjs` already nests output to `dist/{route}/index.html` via `resolve(DIST, meta.path.replace(/^\//, ""), "index.html") + mkdir(..., { recursive: true })`. The same code handles `/en/welcome → dist/en/welcome/index.html` with **zero changes** to the path-construction logic (verified [VERIFIED: prerender.mjs:149-153]).
- `scripts/entry-server.tsx` accepts a path argument and routes through `StaticRouter` — adding 4 marketing `/en/*` `<Route>` declarations + 1 `/en/welcome` declaration (5 total, since `/en/pay` is head-only and not SSR'd) makes `renderRoute("/en/")` produce the EN tree once `LangContext` reads the URL prefix.
- `vercel.json` needs **no change** — Vercel serves real files in `dist/` before falling back to the SPA rewrite. The Phase 1 + Phase 2 precedent (static files for `robots.txt`, `sitemap.xml`, `og-card-*.png`, then nested `dist/welcome/index.html`, `dist/privacy/index.html` etc.) already proves nested directories shadow correctly.
- `src/main.tsx` needs 5 new `<Route>` declarations (`/en/`, `/en/welcome`, `/en/pay`, `/en/privacy`, `/en/terms`, `/en/refund` = 6 — `/en/pay` reuses the lazy `PayPage` import). Per-page declarations are recommended over a wildcard re-mount because they integrate cleanly with the existing `__PRERENDER_PATH` discriminator.
- `LangContext.detectLang()` needs **one extra line** at the top: `if (typeof window !== "undefined" && window.location.pathname.startsWith("/en/")) return "en";`. Wired through `react-router`'s `useLocation` (cleaner than a path `useEffect`) so language follows route changes.
- The header switcher (3 consumers: `App.tsx` navbar, `PayPage.tsx`, `AccountPage.tsx`, `LegalLayout.tsx`) currently calls `setLang(...)` directly — Phase 3 wraps that in a `useNavigate()` call so URL becomes the source of truth on **prefixed** routes. **Unprefixed root paths keep current behavior** (D-07).

**Primary recommendation:** Ship as 8 atomic commits in this order: **(1) hydration-mismatch fix** → (2) `RouteMeta.htmlLang` field + stamp 7 RU entries → (3) add 6 EN entries → (4) `prerender.mjs` `<html lang>` per-route stamping + hreflang triplet injection + Paddle widening to `/en/pay` → (5) `entry-server.tsx` `/en/*` routes → (6) `main.tsx` `/en/*` routes → (7) `LangContext` URL-prefix detection via `useLocation` + header switcher `useNavigate` wiring → (8) `sitemap.mjs` expansion + `docs/INTEGRATION-CONTRACT.md` §6 sync date bump. The residual hydration mismatch (Plan 01) is **standalone and ships before any of 2–8** because Plan 04 introduces dynamic `<html lang>` which would compound the issue.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Path-prefix `/ru/* /en/*` is the chosen language URL design (GEO-C-1 closed). `?lang=` rejected. `ru.opten.space` subdomain rejected.
- **D-02:** Root `/` stays RU-canonical and emits **no redirect**. canonical = `https://opten.space/`. Hreflang triplet on `/`: `ru → /`, `en → /en/`, `x-default → /`. `/ru/*` is **NOT** physically emitted (virtual; hreflang `ru` points to unprefixed path). Root canonical for every page lives at the unprefixed path.
- **D-03:** EN siblings ship for `/welcome` and `/pay` only (in addition to 4 marketing-content routes `/`, `/privacy`, `/terms`, `/refund`). `/success`, `/account`, `/dashboard/download-skill` stay RU-only by design.
- **D-03b:** `scripts/prerender.mjs` Paddle-injection condition (`meta.path === "/pay"`) extended to also cover `/en/pay`. `dist/en/pay/index.html` must carry the synchronous Paddle CDN `<script>` tag. `docs/INTEGRATION-CONTRACT.md` §6 update required alongside this plan.
- **D-04:** EN-meta lives in `scripts/seo-routes.ts`. Extend `RouteMeta` with `htmlLang: "ru" | "en"`. Add 6 new entries (`/en/`, `/en/welcome`, `/en/pay`, `/en/privacy`, `/en/terms`, `/en/refund`) with English title/description/ogTitle/ogDescription and `htmlLang: "en"`. Stamp existing 7 routes with `htmlLang: "ru"`. EN `ogImage` → `${SITE_ORIGIN}/og-card-en.png`. Pulling EN-meta from `en.json` deferred.
- **D-05:** `LangContext.detectLang()` extended with URL-prefix check that takes precedence over `navigator.language` + `localStorage.opten_lang`. Rule: `if (window.location.pathname.startsWith("/en/")) return "en";` runs first. Header language switcher uses `react-router useNavigate` — URL is source of truth on prefixed routes.
- **D-06:** Phase 3 Plan 01 = "diagnose + fix residual hydration mismatch on `/`". This lands before any bilingual plan ships. Escalation rule: if root cause turns out to be architectural (3+ commits or unrelated subsystem), split into a separate mini-phase 2.3 during `/gsd-plan-phase 3` rather than blocking Phase 3 indefinitely.
- **D-07:** On unprefixed (root) paths — `/`, `/welcome`, `/pay`, `/privacy`, `/terms`, `/refund`, `/success`, `/account`, `/dashboard/download-skill` — `LangContext` keeps **current behavior**: post-hydration reads `localStorage.opten_lang` ?? `navigator.language` and flips **content** to that language. **URL does NOT change.** No client-side `navigate("/en/...")`, no `history.replaceState("/en/...")` based on language detection. EN flash on root paths is accepted status-quo cost.
- **D-07b:** The **only** way URL changes language during a session is the explicit **header language switcher** click. User-initiated, not detection-driven.

### Claude's Discretion

- **Hreflang placement** — in each prerendered `<head>` (preferred per CONTEXT.md) vs in `sitemap.xml`. Planner picks; default to `<head>`.
- **Sitemap.xml shape** — pair-listed (12 entries) vs hreflang-annotated XML (`<xhtml:link rel="alternate">` per URL). Both valid; planner picks the simpler one.
- **`scripts/seo-routes.ts` ordering** — RU-then-EN grouped vs per-page (`/` followed by `/en/`). Cosmetic; planner picks.
- **`LangContext` URL-prefix detection implementation** — `useEffect` on path change vs wired through `react-router`'s `useLocation`. Planner picks; `useLocation` is cleaner.
- **Header language-switcher behavior** — does clicking "EN" while on `/welcome` route to `/en/welcome`, or to `/en/` (root)? Default: route to EN sibling of current page if exists, else `/en/`. Planner confirms.
- **Treatment of locked routes that lack EN siblings (`/success`, `/account`, `/dashboard`)** — the header switcher on these routes should either disable EN button or route to `/en/` (landing). Planner picks; "route to `/en/`" is more user-friendly.

### Deferred Ideas (OUT OF SCOPE)

- **Physical `/ru/*` symmetry** — virtual `/ru/*` only. Revisit in a Phase 3.1 if Google/Yandex SEO data argues for it.
- **`/en/success`, `/en/account`, `/en/dashboard/download-skill`** — architecturally have no EN path.
- **Coordinated `promptscore` extension release** to open `/en/welcome` / `/en/pay` based on `navigator.language`.
- **EN-meta migration to `en.json`** — replacing D-04 with single-source-of-truth.
- **Server-side `/` → `/en/` redirect** for `navigator.language=en` users — explicitly rejected (canonical-vs-redirect conflict).
- **Client-side soft-redirect on locked-route surfaces** (`/welcome` / `/pay`) — explicitly rejected (double-render flash).
- **`<html lang>` per-language in `index.html` source template** — template stays `lang="ru"`.
- **Switching the header language switcher to a `<select>` or to flag icons.**
- **Phase 4 content** (`/about`, `/guides/*`, FAQ).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **GEO-C-1** | Resolve per-language URL strategy (`/ru/*` `/en/*` vs `?lang=` vs subdomain) | Already closed by D-01 (path-prefix `/en/*`, `/ru/*` virtual). Research confirms this is the universally-recommended Google/AI-crawler choice ([CITED: developers.google.com/search/docs/specialty/international/localized-versions]). No further work — Phase 3 implements the decision. |
| **GEO-C-2** | Add `/ru/*` and `/en/*` path siblings for marketing routes alongside locked routes (locked roots keep responding at existing paths) | Research confirms `scripts/prerender.mjs:149-153` already constructs nested output paths via `mkdir({ recursive: true })`. Adding 6 EN entries to `seo-routes.ts` produces `dist/en/{welcome,pay,privacy,terms,refund}/index.html` + `dist/en/index.html` with **zero code changes** to path logic. `vercel.json` rewrite untouched (static-file precedence — verified Phase 2 pattern). |
| **GEO-C-3** | Add `hreflang` annotations across all bilingual pages | Research recommends per-page `<head>` triplet (`ru` → `/`, `en` → `/en/`, `x-default` → `/`) over sitemap annotations. Reason: AI crawlers (GPTBot, ClaudeBot, PerplexityBot) read `<head>` directly without sitemap discovery; sitemap-only annotations are valid for Google but weaker for AI surfaces. [CITED: developers.google.com/search/blog/2023/05/x-default]. Implementation: extend `prerender.mjs` with `applyHreflang(html, meta, manifest)` step. |
| **GEO-C-4** | Dynamic `<html lang="...">` per route instead of hardcoded `lang="ru"` | Research recommends baking `lang` per-output-file in `prerender.mjs` via `html.replace(/<html lang="ru">/, ...)` (one `applyHtmlLang` step). Template `index.html` stays `lang="ru"` (its sole consumer is `dist/index.html` which is the RU root). EN routes get `lang="en"` stamped per file. **No runtime `document.documentElement.lang` writes** — see Hydration Mismatch Diagnosis below; that pattern is the suspected root cause of the residual mismatch (D-06 Plan 01). |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

**Locked / mandatory:**
- Locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) keep responding at root paths. `/en/*` are **additions**, not replacements. Renaming = breaking change.
- `EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` are duplicated across 3 page files + extension; do NOT touch.
- Paddle CDN `<script>` MUST load synchronously on every `/pay` surface (Integration Contract §6, BG-67-01). D-03b extends this to `/en/pay` symmetrically.
- React Router 7 import path: `from "react-router"` (NOT `react-router-dom`).
- No tests, no ESLint, no `typecheck` script. Acceptance gate is `npm run build` + `npm run preview` + `~/.claude/skills/geo/scripts/fetch_page.py` + manual curl.
- Phase number convention: GSD-style (3, 3.1, …), not lettered. Atomic commits per requirement. Each commit subject prefixed `feat(03):` or `fix(03):` etc.
- Static-file precedence: anything emitted in `dist/` shadows the `vercel.json` SPA rewrite.
- Tailwind 4, React 18.3, Vite 6 — no framework changes.
- Pricing strings in `seo-routes.ts` are duplicated from `src/i18n/ru.json` with a sync comment — this policy carries to EN (duplicate from `en.json` with the same sync comment).
- Update `docs/INTEGRATION-CONTRACT.md` §6 + bump "Last sync" date when D-03b lands (Paddle injection now covers `/en/pay`).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Per-language URL emission (`/en/{route}/index.html`) | **Build-time / Static (postbuild Node script)** | — | Same tier as Phase 2 prerender. Output is plain HTML files in `dist/`; Vercel serves statically. No runtime, no Edge function. |
| `<html lang>` per route | **Build-time (prerender.mjs)** | — | Baked into HTML at emission. **Explicitly NOT** runtime `document.documentElement.lang =` (that pattern is the suspected hydration-mismatch root cause). |
| Hreflang triplet `<link rel="alternate">` | **Build-time (prerender.mjs)** | — | Three `<link>` tags appended to each emitted `<head>`. Static; no React. |
| URL-prefix language detection (`/en/` → `en`) | **Browser / Client (LangContext)** | — | Happens at hydration via `react-router useLocation`. Must run **before first paint** to avoid RU→EN flash on `/en/*` routes. (Achieved by setting initial state from `useLocation` synchronously inside `LangProvider`.) |
| Header language switcher | **Browser / Client (`useNavigate`)** | — | User-initiated URL change. React Router 7 `useNavigate` writes to history; LangContext follows the URL via `useLocation`. |
| Sitemap.xml with bilingual entries | **Build-time (sitemap.mjs)** | — | Postbuild Node script. Same tier as Phase 2. |
| Paddle SDK sync `<script>` on `/en/pay` | **Build-time injection (prerender.mjs)** | — | Same mechanism as existing `/pay` injection; condition widening only. Paddle.js consumption happens client-side in `PayPage` (unchanged). |
| Hydration mismatch fix on `/` (Plan 01) | **Browser / Client (LangContext useEffect lifecycle)** | — | Root cause sits entirely in `src/i18n/LangContext.tsx` — see Hydration Mismatch Diagnosis below. No build-pipeline change required for the fix. |

**Tier sanity check:** Every capability is either build-time (postbuild Node) or client-side React. There is no API / database / CDN edge-function work in this phase. This matches Phase 2 / Phase 2.1 / Phase 2.2 patterns and is the correct tier distribution for a static-SPA + per-route-prerender architecture.

---

## Standard Stack

### Core (verified — already in use)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-router` | 7.13.0 [VERIFIED: package.json:59; npm view latest = 7.15.1] | Routing — `BrowserRouter`, `StaticRouter`, `Routes`, `Route`, `useLocation`, `useNavigate`, `Link` | Already adopted Phase 2; v7 is the current stable. **No upgrade needed for Phase 3** — `useLocation` + `useNavigate` are in v7.13.0. |
| `react` + `react-dom` | 18.3.1 [VERIFIED: package.json:78-79; npm view latest react = 19.2.6] | UI + `hydrateRoot` / `createRoot` / `renderToString` | Already adopted. **No upgrade needed.** Staying on 18.3 — React 19 introduces server components which would require larger refactor; out of scope. |
| `vite` | 6.3.5 [VERIFIED: package.json:74] | Build, SSR build, asset hashing | Already adopted. |
| Node 22+ for postbuild scripts | (assumed local; Vercel ships Node 22 by default for builds — verify in Vercel project settings) | `node scripts/prerender.mjs` and `node scripts/sitemap.mjs` | Phase 2 / Phase 2.2 chain works on Vercel today — pre-verified. |

### Supporting (no new dependencies needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | — | — | Phase 3 adds **zero new packages**. All code is React Router 7 patterns + Node 22 stdlib (`fs/promises`, `path`, `url`) extensions of existing scripts. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled hreflang injection in `prerender.mjs` | `react-helmet-async` | Rejected — `react-helmet-async` is runtime-only and would not reach AI crawlers (the audit's primary criticism). Same reasoning as Phase 2 D-01 [CITED: 02-CONTEXT.md D-01]. |
| `useLocation` for prefix detection | `useEffect` polling `window.location.pathname` | `useLocation` is the React-Router-7 idiomatic way; it triggers re-renders on history changes for free. Polling via `useEffect` reinvents the wheel and risks missing `pushState` events triggered by `useNavigate`. |
| Per-page `<head>` hreflang | Sitemap-only hreflang via `xhtml:link` | Per-page wins because AI crawlers (GPTBot, ClaudeBot, PerplexityBot) read `<head>` without parsing sitemap.xml [CITED: developers.google.com/search/blog/2013/04/x-default-hreflang-for-international-pages]. Google reads both, so per-`<head>` is the larger-surface option. |
| Wildcard `<Route path="/en/*">` re-mount | Per-page `<Route path="/en/welcome">` declarations | Per-page wins because the existing `__PRERENDER_PATH` discriminator in `main.tsx:65-66` compares **exact paths**. A wildcard would need additional logic to know which child to mount, and would not match how `entry-server.tsx` exhaustively enumerates routes. Per-page is also explicit and grep-able. |

**Installation:** *(none — Phase 3 adds zero packages)*

**Version verification:** Re-checked 2026-05-16 against npm registry:
- `react-router@7.15.1` is latest (project on 7.13.0 — fine; both ship `useNavigate` and `useLocation`; no breaking changes between 7.13 and 7.15 per [CITED: github.com/remix-run/react-router CHANGELOG]).
- `react@19.2.6` is latest. Project stays on `18.3.1`.

---

## Architecture Patterns

### System Architecture Diagram

```
                                BUILD TIME
            ┌──────────────────────────────────────────────────────┐
            │                                                      │
   vite build → dist/                                               │
            │                                                      │
   vite --ssr entry-server.tsx → .ssr-cache/                        │
            │                                                      │
   vite --ssr seo-routes.ts → .ssr-meta/                            │
            │                                                      │
            ▼                                                      │
   scripts/prerender.mjs                                            │
            │                                                      │
            │  for meta of routes (13 entries: 7 RU + 6 EN)         │
            │      ┌─ applyMeta(html, meta)                         │
            │      │  → title, description, canonical, OG (RU/EN)   │
            │      ├─ applyHtmlLang(html, meta.htmlLang)  ← NEW     │
            │      │  → <html lang="ru"> or <html lang="en">        │
            │      ├─ applyHreflang(html, meta, manifest) ← NEW     │
            │      │  → <link rel=alternate hreflang=ru   href=/>   │
            │      │  → <link rel=alternate hreflang=en   href=/en/>│
            │      │  → <link rel=alternate hreflang=x-default …>   │
            │      ├─ applyOgLocale(html, meta.htmlLang)  ← NEW     │
            │      │  → og:locale = ru_RU or en_US                  │
            │      ├─ applyModulePreload(html)                      │
            │      ├─ applySafariPreloadFallback(html)              │
            │      ├─ if meta.path in ("/pay", "/en/pay"):  ← WIDEN │
            │      │     applyPaddleScript(html)                    │
            │      ├─ applyMarker(html, meta.path)  ← __PRERENDER_PATH│
            │      └─ if meta.prerender === "full":                 │
            │            renderRoute(meta.path) → applyBody         │
            │                                                      │
            │      writeFile(dist/<path>/index.html)                │
            │                                                      │
   scripts/sitemap.mjs                                              │
            │  → dist/sitemap.xml (12 RU+EN entries)                │
            │                                                      │
            └──────────────────────────────────────────────────────┘
                                  ▼
                              Vercel CDN
                                  │
                                  ▼
                              RUNTIME
            ┌──────────────────────────────────────────────────────┐
            │  Browser request /en/welcome                         │
            │       ▼                                              │
            │  Vercel serves dist/en/welcome/index.html            │
            │       ▼                                              │
            │  <html lang="en"> + 3 hreflang tags + RU/EN meta     │
            │  + body prerendered in EN via renderToString         │
            │       ▼                                              │
            │  main.tsx loads → reads window.__PRERENDER_PATH      │
            │       ▼                                              │
            │  pathMatches=true → hydrateRoot                      │
            │       ▼                                              │
            │  LangProvider mounts:                                │
            │    useLocation() → "/en/welcome"                     │
            │    detectLang() → "en" (URL prefix wins)             │
            │    NO document.documentElement.lang writes ← FIX     │
            │    NO post-mount setLang(detected) flip ← FIX        │
            │       ▼                                              │
            │  Header switcher click "RU" → useNavigate("/welcome")│
            │  → URL changes → useLocation updates → detectLang→ru │
            └──────────────────────────────────────────────────────┘
```

### Recommended Project Structure

**No new directories.** All work is extension of existing files:

```
scripts/
├── seo-routes.ts        # +1 field (htmlLang) + 6 new entries
├── prerender.mjs        # +applyHtmlLang, +applyHreflang, +applyOgLocale, widened Paddle condition
├── sitemap.mjs          # +hreflang annotations OR +6 entries (planner picks)
└── entry-server.tsx     # +5 <Route> declarations for /en/* (no /en/pay since head-only)

src/
├── main.tsx             # +6 <Route> declarations for /en/* (incl. /en/pay)
├── i18n/
│   └── LangContext.tsx  # +URL-prefix detection via useLocation; FIX hydration mismatch (Plan 01)
├── app/
│   ├── App.tsx                          # navbar switcher → useNavigate
│   ├── pages/PayPage.tsx                # switcher → useNavigate
│   ├── pages/AccountPage.tsx            # switcher → useNavigate (route to /en/ since no /en/account)
│   └── components/layout/LegalLayout.tsx # switcher → useNavigate

docs/
└── INTEGRATION-CONTRACT.md  # §6 Paddle protocol note + bump "Last sync" date

(NO new files in Phase 3 — pure extension of Phase 2 surface area.)
```

### Pattern 1: Path-prefix language URLs (extension of Phase 2 manifest pattern)

**What:** Each route has a single source of truth in `seo-routes.ts` describing its path, language, meta, canonical, hreflang sibling. The prerender loop and sitemap loop both iterate this manifest. Adding a language is "add N rows to the manifest", not "add N route handlers".

**When to use:** Static SSG sites with a small (≤ 20) route count where build-time emission beats runtime middleware.

**Example:**
```typescript
// scripts/seo-routes.ts — extended RouteMeta + new entries
export interface RouteMeta {
  path: string;
  htmlLang: "ru" | "en";         // NEW (D-04)
  hreflangAlternates: {           // NEW — hreflang triplet config
    ru: string;                   // unprefixed path (RU canonical)
    en: string;                   // /en/ path
    xDefault: string;             // always = ru (D-02 root canonical)
  };
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  prerender: "full" | "head" | "none";
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
}

export const routes: RouteMeta[] = [
  // RU root
  {
    path: "/",
    htmlLang: "ru",
    hreflangAlternates: { ru: `${SITE_ORIGIN}/`, en: `${SITE_ORIGIN}/en/`, xDefault: `${SITE_ORIGIN}/` },
    title: "Opten — AI-оценка и улучшение промптов для генерации изображений",
    // …(existing fields unchanged)
    prerender: "full",
    priority: 1.0,
  },
  // EN root
  {
    path: "/en/",
    htmlLang: "en",
    hreflangAlternates: { ru: `${SITE_ORIGIN}/`, en: `${SITE_ORIGIN}/en/`, xDefault: `${SITE_ORIGIN}/` },
    title: "Opten — AI scoring & enhancement of prompts for image generation",
    description: "Opten scores your prompt against the target model, surfaces errors, and rewrites them in one click. Works with 43+ AI image models inside the generator's own UI.",
    canonical: `${SITE_ORIGIN}/en/`,
    ogTitle: "Opten — stop wasting credits on bad prompts",
    ogDescription: "AI scoring & enhancement of prompts for 43+ image-generation models. Right inside the generator's UI.",
    ogImage: `${SITE_ORIGIN}/og-card-en.png`,    // D-04 — EN OG card (already in public/)
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
  },
  // …5 more EN entries: /en/welcome, /en/pay, /en/privacy, /en/terms, /en/refund
];
```

### Pattern 2: Hreflang triplet injected at prerender time

**What:** Each emitted HTML file gets three `<link rel="alternate">` tags appended to `<head>`. The triplet is derived from the per-route `hreflangAlternates` config — every page in the cluster has identical triplet content (reciprocal links — Google requirement).

**When to use:** Whenever the canonical and its translated sibling have to cross-link. For sites with single locale, skip.

**Example:**
```javascript
// scripts/prerender.mjs — NEW function (planner-level signature)
function applyHreflang(html, meta) {
  const tags = [
    `<link rel="alternate" hreflang="ru"        href="${escapeAttr(meta.hreflangAlternates.ru)}" />`,
    `<link rel="alternate" hreflang="en"        href="${escapeAttr(meta.hreflangAlternates.en)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.hreflangAlternates.xDefault)}" />`,
  ].map(t => `    ${t}`).join("\n");
  // Inject after the canonical link (already added by applyMeta)
  return html.replace(
    /(<link rel="canonical"[^>]*\/>)/,
    `$1\n${tags}`
  );
}
```

**Source:** Verified pattern against [CITED: developers.google.com/search/docs/specialty/international/localized-versions]:
> "For each version, place these `<link>` elements in the `<head>` section of every page. Each version must list every alternate version, including itself."

### Pattern 3: `<html lang>` baked at build time, NOT mutated at runtime

**What:** `prerender.mjs` rewrites `<html lang="ru">` → `<html lang="${meta.htmlLang}">` per emitted file. `LangContext` **never** writes `document.documentElement.lang` anymore. The DOM attribute is set once, before hydration, and stays put.

**When to use:** Always, when SSG is on the table. Runtime `document.documentElement.lang` writes are the #1 cause of hydration-attribute-mismatch warnings on multilingual SPAs.

**Example:**
```javascript
// scripts/prerender.mjs — NEW function
function applyHtmlLang(html, meta) {
  // Source template is <html lang="ru"> — must replace with target lang.
  // Throw if not found (Phase 2 D-08 fail-fast pattern).
  const before = html;
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${meta.htmlLang}">`);
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <html lang> matched. index.html structure changed?`);
  }
  return html;
}
```

**Companion change in `LangContext.tsx`:** delete lines 84-86:
```typescript
// DELETE — this is the hydration-mismatch root cause (see diagnosis below)
//   useEffect(() => {
//     document.documentElement.lang = lang;
//   }, [lang]);
```

### Pattern 4: URL-prefix language detection via `useLocation` (SSR-safe)

**What:** `LangProvider` reads the current pathname via `react-router`'s `useLocation` hook. When the pathname starts with `/en/`, the language is `en`; otherwise the existing detection (`localStorage` → `navigator.language`) applies. **Critically:** the initial `useState` value is derived from `useLocation` synchronously, so SSR and first client paint agree — no post-hydration flip on `/en/*` routes.

**When to use:** When you have a route-driven language convention and want zero-flash language selection on prefixed routes.

**Example:**
```typescript
// src/i18n/LangContext.tsx — extended
import { useLocation } from "react-router";

function detectLangFromPath(pathname: string): Lang | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return null;
}

function detectLangFromStorage(): Lang {
  // Status-quo behavior — runs ONLY when path is unprefixed (D-07).
  if (typeof window === "undefined") return "ru"; // SSR-safe
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return navigator.language.startsWith("ru") ? "ru" : "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Initial state: URL prefix wins; otherwise SSR-safe RU.
  const pathLang = detectLangFromPath(location.pathname);
  const [lang, setLangState] = useState<Lang>(pathLang ?? "ru");

  useEffect(() => {
    // Re-detect when location changes
    const next = detectLangFromPath(location.pathname);
    if (next) {
      // On prefixed routes — URL is source of truth, no fallback to storage
      if (next === "en" && !dicts.en) {
        loadEnDict().then(() => setLangState("en"));
      } else {
        setLangState(next);
      }
      return;
    }
    // D-07: unprefixed routes — keep existing detection (post-hydration storage/navigator)
    const detected = detectLangFromStorage();
    if (detected === "en") {
      loadEnDict().then(() => setLangState("en"));
    } else {
      setLangState("ru");
    }
  }, [location.pathname]);

  // NOTE: NO useEffect writing document.documentElement.lang.
  // Lang is baked at prerender time per file. Header switcher uses useNavigate.

  // …setLang + t + provider unchanged …
}
```

### Pattern 5: Header switcher via `useNavigate` (URL as source of truth)

**What:** When the user clicks the language toggle, instead of `setLang("en")`, call `navigate("/en/welcome")` (or whichever EN sibling matches the current route). On routes without an EN sibling (`/success`, `/account`, `/dashboard/*`), route to `/en/` (landing). Per D-07, the URL change is the only signal; `LangContext` follows via `useLocation`.

**When to use:** Any route-driven i18n convention.

**Example:**
```typescript
// src/app/components/LangSwitcher.tsx — extracted shared component
// (or inline in each consumer if planner prefers — 4 consumers: Navbar, PayPage, AccountPage, LegalLayout)
import { useLocation, useNavigate } from "react-router";
import { useLang } from "../../i18n/LangContext";

// Build-time list of EN siblings (kept in sync with seo-routes.ts EN entries — D-04)
const EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"]);
const EN_LANDING = "/en/";

function getEnTarget(currentPath: string): string {
  // From RU side: /welcome → /en/welcome, /pay → /en/pay, …
  if (EN_SIBLINGS.has(currentPath)) {
    return currentPath === "/" ? "/en/" : `/en${currentPath}`;
  }
  // No EN sibling (success, account, dashboard/*) — drop to EN landing
  return EN_LANDING;
}

function getRuTarget(currentPath: string): string {
  if (currentPath === "/en/" || currentPath === "/en") return "/";
  if (currentPath.startsWith("/en/")) return currentPath.slice(3); // strip "/en"
  return "/";
}

export function LangSwitcher({ className }: { className?: string }) {
  const { lang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const target = lang === "ru"
    ? getEnTarget(location.pathname)
    : getRuTarget(location.pathname);
  return (
    <button
      type="button"
      onClick={() => navigate(target)}
      className={className}
    >
      {lang === "ru" ? "EN" : "RU"}
    </button>
  );
}
```

**Important:** the 4 current consumers (`App.tsx` Navbar, `PayPage.tsx`, `AccountPage.tsx`, `LegalLayout.tsx`) currently inline the button. Planner picks: extract to shared `<LangSwitcher>` (recommended — single source of behavior) vs inline the `useNavigate` wiring per file (lower diff but 4× duplicated logic).

### Anti-Patterns to Avoid

- **`document.documentElement.lang = lang` inside `useEffect`** — guaranteed hydration-attribute warning on first client render. This is the **suspected root cause of the current `/` mismatch** (see diagnosis below). Bake `lang` at prerender time instead.
- **Mounting `/en/*` as a wildcard `<Route path="/en/*" element={<EnApp />}>`** — breaks `__PRERENDER_PATH` discriminator (which expects exact-path match). Per-page declarations only.
- **Putting hreflang ONLY in sitemap.xml** — Google reads both, but AI crawlers read `<head>`. Per-page `<head>` hreflang is the larger surface.
- **Soft-redirecting `/welcome` → `/en/welcome` based on `navigator.language`** — explicitly rejected by D-07; doubles render flashes and amplifies any hydration mismatch.
- **Letting the Paddle SDK script tag drift to `async` or `defer` on `/en/pay`** — same constraint as `/pay` (Integration Contract §6; BG-67-01 — `window.Paddle` must exist before `main.tsx` runs).
- **Importing `useNavigate` from `react-router-dom`** — wrong package; React Router 7 ships everything from `react-router`. Codebase already follows this convention.
- **Calling `setLang` from inside `LangContext` `useEffect` that triggers another `useEffect`** — easy to introduce a render loop. Detection logic should be idempotent and gated on `location.pathname` only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL-based language detection | Custom regex on `window.location.pathname` scattered across components | React Router 7 `useLocation` hook | History changes (`pushState`, `popState`, back/forward) auto-trigger `useLocation` re-render. Custom regex misses these unless you wire your own `popstate` listener. |
| Programmatic URL changes | `window.history.pushState(...)` directly | React Router 7 `useNavigate` | `useNavigate` integrates with Router state (scroll restoration, route loaders, transitions). Direct `pushState` bypasses these and the Router won't re-render. |
| Hreflang annotations | DIY meta-tag library or scattered JSX `<Link>` components | Build-time injection in `prerender.mjs` (same pattern as canonical/OG) | Hreflang lives in `<head>` of every emitted HTML; runtime React-rendered links don't reach AI crawlers. Phase 2 already locked this pattern (D-01). |
| Sitemap hreflang | Custom XML serializer | Existing `scripts/sitemap.mjs` template-string approach | Manual `xhtml:link` insertion is a 10-line addition to the existing template literal. A library would be heavier than the existing pure-Node solution. |
| `<html lang>` switching | Runtime `document.documentElement.lang = …` | Build-time `html.replace(/<html lang="…">/, …)` in `prerender.mjs` | Runtime DOM mutation triggers hydration warning. Build-time is byte-stable. |
| Bidirectional sibling mapping for switcher | Lookup table object | Same lookup but ALSO bake into `seo-routes.ts` `hreflangAlternates` field | Single source of truth — the manifest already knows every page's EN sibling URL. Avoid duplicating it client-side; pass into `LangSwitcher` via context or import. |

**Key insight:** Phase 3 is **manifest extension + prerender pipeline extension**, not new architecture. The temptation to introduce `react-intl` / `react-i18next` / `next-intl` / per-language route trees should be resisted — the existing `LangContext` + `t()` design already does runtime i18n correctly; Phase 3 only needs to make the **URL** speak the language too.

---

## Runtime State Inventory

> Phase 3 is **additive only** — no renames, no migrations, no `dist/{old}` → `dist/{new}` movements. Runtime state inventory is largely "nothing to do" but listed exhaustively to satisfy the discipline:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | `localStorage.opten_lang` — used by `LangContext.detectLang()` to remember the user's language preference on unprefixed routes. Phase 3 adds URL-prefix detection that **takes precedence** but does NOT delete or rename this key. **No migration needed** — old values remain valid. | None (key semantics preserved per D-07). |
| Live service config | None — no n8n / Datadog / Tailscale / Cloudflare in this stack. | None. |
| OS-registered state | None — no Task Scheduler, pm2, systemd registrations. | None. |
| Secrets / env vars | `VITE_PADDLE_ENV`, `VITE_PADDLE_CLIENT_TOKEN` set in Vercel project settings — unchanged. `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `EXTENSION_IDS` hardcoded in code, unchanged. | None. |
| Build artifacts | `dist/welcome/`, `dist/pay/`, `dist/privacy/`, `dist/terms/`, `dist/refund/` — Phase 2 emissions, **kept** and overwritten on every build. Phase 3 ADDS `dist/en/index.html`, `dist/en/welcome/index.html`, `dist/en/pay/index.html`, `dist/en/privacy/index.html`, `dist/en/terms/index.html`, `dist/en/refund/index.html`. Vercel deploys the whole `dist/` snapshot atomically — no cache invalidation drama. | None — `mkdir({ recursive: true })` in `prerender.mjs:153` already handles new nested directories. |
| Sitemap entries | Existing sitemap.xml on Vercel CDN: 6 entries. After Phase 3: 12 entries. Search engines re-crawl on `lastmod` change — already changes per deploy (D-04 build-time uniform date). | None — automatic on next deploy. |
| Locked routes | `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` continue to respond at unprefixed paths. `dist/en/{welcome,pay}/index.html` are **new files**, not replacements. | None (Integration Contract §3 preserved). |
| Extension binary references | Shipped extension (manifest.json v1.3.5) navigates to `/welcome`, `/pay`, `/success` — unprefixed. **These code paths remain valid post-Phase-3**. The extension is NOT updated to navigate to `/en/*` in this phase. | None (Integration Contract §3 preserved; deferred future work per CONTEXT.md). |
| `docs/INTEGRATION-CONTRACT.md` | §6 currently states "The CDN `<script src='paddle.js'>` tag is injected synchronously into `dist/pay/index.html` by `scripts/prerender.mjs`" — needs symmetric mention of `dist/en/pay/index.html` after D-03b lands. "Last sync" date bumps from 2026-05-14 to whatever ships. | Documented edit; goes in the same commit as D-03b implementation. |

---

## Common Pitfalls

### Pitfall 1: Hydration-attribute mismatch from runtime `<html lang>` writes (the residual `/` issue)
**What goes wrong:** First client paint after hydration shows React warning: *"Warning: Prop `lang` did not match. Server: 'ru' Client: 'en'"* on the `<html>` element. React recovers by re-rendering, but the recovery costs ~50-200 ms and creates a visible flicker.
**Why it happens:** Current `LangContext.tsx:84-86` writes `document.documentElement.lang = lang` inside `useEffect` whenever `lang` state changes. On a fresh page load with `navigator.language=en`:
  1. Server renders `<html lang="ru">` (Phase 2 hardcoded).
  2. Client hydrates — initial state `lang="ru"`. No mismatch yet.
  3. First `useEffect` runs `detectLang()` → returns `en` → `setLangState("en")`.
  4. Second `useEffect` (the `[lang]` one) fires → writes `document.documentElement.lang = "en"`.
  5. React's hydration commit has already recorded the `<html>` node and sees the attribute change — emits attribute-mismatch warning.
  
  Additionally, the **text content** of body elements mismatches: SSR renders RU strings (because `LangProvider` SSR-default is `"ru"` at `entry-server.tsx`), client re-renders with EN strings after step 3. This is a content mismatch, not just an attribute mismatch — visible in the Playwright sweep flagged in STATE.md.
**How to avoid:**
  1. **Delete** the `useEffect(() => { document.documentElement.lang = lang; }, [lang])` block in `LangContext.tsx:84-86`.
  2. **Bake `<html lang>` per file** at prerender time (Pattern 3 above).
  3. On `/en/*` routes — initial `useState` reads `useLocation().pathname` synchronously, so client `lang` matches server `lang` from the first render. No flip needed.
  4. On unprefixed routes (D-07) — server still renders RU; client flips to EN post-mount; this remains a status-quo accepted **content** flicker (~200-500 ms). The new code path eliminates the **attribute** mismatch.
**Warning signs:**
  - `npm run preview` + DevTools Console shows React warning containing `lang` attribute.
  - Playwright `page.on("pageerror", …)` captures `Hydration failed because …`.
  - Lighthouse "Avoid non-composited animations" or CLS spikes around 100-200 ms after FCP (the recovery re-render).
**Confidence:** HIGH — root cause directly inferred from code inspection of `LangContext.tsx:84-86` combined with documented React 18 behavior [CITED: 18.react.dev/reference/react-dom/client/hydrateRoot]. **VALIDATION REQUIRED:** Plan 01 should reproduce in dev/preview before merging the fix to confirm the diagnosis. **Escalation:** If after deleting lines 84-86 + baking `<html lang>` the warning persists, root cause is elsewhere — likely a `motion` component mount animation or an `OptenHeroAnimation` Suspense boundary; escalate per D-06 to a mini-phase 2.3.

### Pitfall 2: Forgetting to widen the Paddle injection condition to `/en/pay`
**What goes wrong:** A user lands directly on `https://opten.space/en/pay` (from EN search results or a shared link). Vercel serves `dist/en/pay/index.html`. `<script src="paddle.js">` is NOT in `<head>` because `prerender.mjs:137` only checks `meta.path === "/pay"`. `main.tsx` runs, `PayPage` mounts, `Paddle.Checkout.open()` fires → `window.Paddle is undefined` → checkout button does nothing.
**Why it happens:** Phase 2.2 D-03 narrowed Paddle to `/pay` for perf; Phase 3 adds an EN sibling that needs the same script. Easy to miss because the symptom only appears on direct hits (SPA navigation from `/en/` → `/en/pay` would trigger the async `ensurePaddle()` in `src/lib/paddle.ts` and still work).
**How to avoid:**
  - Change `prerender.mjs:137` from `if (meta.path === "/pay")` to `if (meta.path === "/pay" || meta.path === "/en/pay")`.
  - Update `docs/INTEGRATION-CONTRACT.md` §6 in the same commit and bump "Last sync" date.
  - Verify in built `dist/en/pay/index.html` that the sync `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">` appears in `<head>`.
**Warning signs:** Direct curl `https://opten.space/en/pay | grep paddle.js` returns empty in production; YouTube/Slack share previews of `/en/pay` show the page but Paddle button is dead on click.
**Confidence:** HIGH — verified against `scripts/prerender.mjs:137` [VERIFIED: line read this session].

### Pitfall 3: `<html lang>` source template only has `lang="ru"` — `applyHtmlLang` regex must match it exactly
**What goes wrong:** `index.html` source has `<html lang="ru">` on line 2. The prerender `applyHtmlLang` step matches this string and rewrites. If someone later edits `index.html` to `<html lang="ru-RU">` or `<html lang="ru" dir="ltr">`, the regex misses and EN files ship with `<html lang="ru">` baked in.
**Why it happens:** Phase 2 already established the "throw on missing match" pattern (`prerender.mjs:48-50`) but that policy must explicitly cover the new `applyHtmlLang` step.
**How to avoid:**
  - Use a loose-but-anchored regex: `/<html\s+lang="[^"]*"([^>]*)>/` — captures any siblings.
  - Throw with a clear message if no match: `prerender({meta.path}): no <html lang> matched`.
  - Phase 2 / Phase 2.1 / Phase 2.2 all preserve `<html lang="ru">` exactly — verified [VERIFIED: index.html:2 read this session]; risk only materializes if a future commit alters this line. Adding the throw protects the next person.
**Warning signs:** `dist/en/index.html` contains `<html lang="ru">`. Hreflang inspector shows lang mismatch.
**Confidence:** HIGH — Phase 2 fail-fast pattern [VERIFIED: prerender.mjs:48-50].

### Pitfall 4: `og:locale` not updated alongside `<html lang>`
**What goes wrong:** Phase 1 hardcoded `<meta property="og:locale" content="ru_RU" />` in `index.html:22` [VERIFIED]. Phase 3 emits EN files with English title/description but `og:locale=ru_RU`. Facebook / Telegram / Slack OG unfurls show EN text with a Russian locale flag → mixed signal.
**Why it happens:** `seo-routes.ts` doesn't currently model `og:locale`; `applyMeta` doesn't override it.
**How to avoid:**
  - Add an `applyOgLocale(html, meta.htmlLang)` step in `prerender.mjs`. Replaces `ru_RU` with `en_US` on EN routes.
  - **Best practice:** also emit `<meta property="og:locale:alternate" content="en_US" />` on RU pages and `:alternate content="ru_RU"` on EN pages [CITED: ogp.me/#optional]. Same reciprocal-links principle as hreflang.
  - Acceptance: `curl https://opten.space/en/ | grep og:locale` shows `en_US`.
**Warning signs:** Telegram preview of `/en/` shows EN title + RU locale tag in the technical preview.
**Confidence:** HIGH for the issue — verified against index.html:22; CITED for the alternate-locale pattern.

### Pitfall 5: Reciprocal hreflang violation (Google ignores annotations if non-reciprocal)
**What goes wrong:** `/welcome` declares `hreflang=en → /en/welcome` but `/en/welcome` declares `hreflang=en → /en/` (typo). Google detects the asymmetry and **silently drops all hreflang annotations on the cluster** [CITED: developers.google.com/search/docs/specialty/international/localized-versions §"Reciprocal links"]. Phase 3's primary SEO win evaporates.
**Why it happens:** Hand-maintained sibling tables drift. Easy to swap RU/EN URLs in the manifest by mistake.
**How to avoid:**
  - Centralize the triplet in `seo-routes.ts` `hreflangAlternates` field (Pattern 1 above). Every entry in a cluster references the same triplet values.
  - Pair up entries explicitly: `/` ↔ `/en/`, `/welcome` ↔ `/en/welcome`, etc. Use a `cluster` field if planner prefers (`cluster: "root" | "welcome" | "pay" | "privacy" | "terms" | "refund"`).
  - Acceptance check: `curl https://opten.space/welcome | grep hreflang` and `curl https://opten.space/en/welcome | grep hreflang` produce identical triplet content (just same href values, identical order).
**Warning signs:** Google Search Console "International Targeting" report flags asymmetry. SERP impressions for EN queries don't materialize after 14 days post-deploy.
**Confidence:** HIGH [CITED: developers.google.com/search/docs/specialty/international/localized-versions].

### Pitfall 6: `entry-server.tsx` adds `<Route path="/en/welcome">` but mounts the wrong component / lang
**What goes wrong:** `renderRoute("/en/welcome")` produces a tree where `<LangProvider>` defaults to `lang="ru"` (current SSR-safe default per Phase 2 D-05). The body is rendered with RU strings. Then in browser, hydration sees EN strings via URL-prefix detection → React content mismatch on every body text node → forced re-render.
**Why it happens:** `LangProvider` in `entry-server.tsx` uses `useState<Lang>("ru")` as initial state and detection runs only in `useEffect`. The new URL-prefix detection must run **synchronously** during SSR too, not just on client.
**How to avoid:**
  - In `LangProvider`, derive initial state from `useLocation().pathname` (works in both `StaticRouter` and `BrowserRouter`):
    ```tsx
    const location = useLocation();
    const initialLang = detectLangFromPath(location.pathname) ?? "ru";
    const [lang, setLangState] = useState<Lang>(initialLang);
    ```
  - SSR side: `StaticRouter location={path}` populates `useLocation` synchronously [CITED: reactrouter.com/start/library/routing]. So `path="/en/welcome"` → `useLocation().pathname="/en/welcome"` → `initialLang="en"` at render time. SSR output uses EN dict.
  - **BUT** — `entry-server.tsx` statically imports `ru` only; `en.json` is dynamically loaded via `loadEnDict()` (Phase 2.2 D-?). For SSR to render EN body, **`en.json` must be statically imported in `entry-server.tsx`** (the SSR build is server-only — bundle size doesn't matter, and `renderToString` is synchronous so it can't await a dynamic import).
  - **Recommendation:** in `LangContext.tsx`, gate the dynamic import behind `typeof window !== "undefined"` and statically import `en.json` for the SSR path. The shipped client bundle continues to dynamic-import.
**Warning signs:** Diff between `dist/en/welcome/index.html` body and a Playwright `page.content()` snapshot on `/en/welcome` shows different text. Hydration warning: *"Text content did not match. Server: 'Установить' Client: 'Install'"*.
**Confidence:** HIGH — both the SSR-pathway analysis and the `LangContext.tsx` dynamic-import structure are [VERIFIED: LangContext.tsx:25-37 read this session, entry-server.tsx:14 read this session]. **MEDIUM only on the recommended fix** because there are two valid approaches (static import for SSR-path; or pre-fetch `en.json` synchronously in `entry-server.tsx`); planner picks.

### Pitfall 7: `__PRERENDER_PATH` discriminator forgets `/en/*` paths
**What goes wrong:** `main.tsx:65-66` reads `window.__PRERENDER_PATH` and compares to `window.location.pathname`. The prerender script (`prerender.mjs:67`) writes `JSON.stringify(meta.path)` — already covers any path string. So `dist/en/welcome/index.html` will get `window.__PRERENDER_PATH="/en/welcome"` and `window.location.pathname` will also be `/en/welcome` → match → `hydrateRoot`. **No code change needed.** Verified [VERIFIED: prerender.mjs:67, main.tsx:65-66 read this session].
**Why this is in the pitfall list anyway:** Easy to assume the discriminator needs updating when introducing new paths. It doesn't. Document the invariant in the plan to forestall a needless edit.
**How to avoid:** Trust the existing data flow. Verify post-build via `grep __PRERENDER_PATH dist/en/welcome/index.html` returns `"/en/welcome"`.
**Confidence:** HIGH.

### Pitfall 8: Vercel cleanUrls or trailing-slash quirks on nested directories
**What goes wrong:** Some Vercel projects with `cleanUrls: true` rewrite `/en/welcome` to `/en/welcome/` (or vice versa). With `dist/en/welcome/index.html` present but inconsistent slash behavior, you can end up with double-canonical issues (`/en/welcome` and `/en/welcome/` both serving same content, neither canonical to the other).
**Why it happens:** `vercel.json` doesn't currently set `cleanUrls` [VERIFIED: vercel.json read this session — only `rewrites`, `headers`, `functions` keys]. Vercel default is "serve `dist/foo/index.html` at both `/foo` and `/foo/` and treat the unprefixed as canonical." This matches Phase 2 D-07 (no trailing slash).
**How to avoid:**
  - Do **not** add `cleanUrls` to `vercel.json` in Phase 3.
  - All canonical URLs use bare paths in `seo-routes.ts` (`/en/welcome`, not `/en/welcome/`). Root EN uses `/en/` (mirrors `/`).
  - Acceptance: `curl -I https://opten.space/en/welcome/` returns 200 with no redirect; `curl -I https://opten.space/en/welcome` returns 200. Both serve identical bytes.
**Confidence:** HIGH — Phase 2 already proved this with nested dirs (`/welcome`, `/privacy`, …). Nested under `/en/` follows identical mechanics.

### Pitfall 9: Header switcher routes to `/en/` but the user was at `/account` — they expected to stay in account
**What goes wrong:** User on `/account` (extension-coupled, RU-only) clicks "EN" — switcher routes to `/en/` (landing). User loses their place. Worse — if they were mid-cancellation flow, the click feels like a bug.
**Why it happens:** D-03 deliberately doesn't ship `/en/account`. The switcher must route somewhere — and D-discretion lets planner pick "disable EN button" vs "route to /en/". The current code (per `AccountPage.tsx:209`) does `setLang("en")` which flips text but stays on `/account`. Phase 3 changes this.
**How to avoid:**
  - **Planner picks one** of:
    - **Option A (recommended per CONTEXT.md):** route to `/en/` landing. User-friendly because they SEE an EN page; they can navigate back via account-link in nav.
    - **Option B:** disable the EN button on routes without an EN sibling. Greys-out the button with `title="Account page is Russian-only"`. Less surprising but adds copy.
    - **Option C:** keep current behavior (flip text but stay on `/account`). Diverges from D-05 (URL is source of truth) — rejected for inconsistency.
  - Acceptance: define expected behavior in plan and verify per route.
**Warning signs:** User feedback "Why does clicking EN on account page take me back to the homepage?"
**Confidence:** HIGH for the issue; planner discretion on the resolution.

---

## Code Examples

Verified patterns from official sources + this codebase:

### Hreflang triplet for a bilingual page cluster
```html
<!-- Source: developers.google.com/search/docs/specialty/international/localized-versions -->
<!-- Appears in BOTH /welcome AND /en/welcome — identical content, reciprocal -->
<link rel="canonical"    href="https://opten.space/welcome" />
<link rel="alternate" hreflang="ru"        href="https://opten.space/welcome" />
<link rel="alternate" hreflang="en"        href="https://opten.space/en/welcome" />
<link rel="alternate" hreflang="x-default" href="https://opten.space/welcome" />
```
[CITED: developers.google.com/search/docs/specialty/international/localized-versions]

### React Router 7 — `useLocation` + `useNavigate` (server-safe)
```tsx
// Source: reactrouter.com/start/library/routing (v7 stable)
import { useLocation, useNavigate, BrowserRouter, StaticRouter } from "react-router";

function Switcher() {
  const location = useLocation();          // works in StaticRouter + BrowserRouter
  const navigate = useNavigate();          // BrowserRouter-only (no-op in StaticRouter at SSR; only called from event handlers post-hydration)
  return <button onClick={() => navigate("/en/welcome")}>EN</button>;
}
```
[CITED: reactrouter.com/start/library/routing/ — confirmed `useLocation`/`useNavigate` are first-class v7 APIs]

### Prerender step — extended `prerender.mjs` body (signature only)
```javascript
// Source: extension of existing scripts/prerender.mjs (this session)
function applyHtmlLang(html, meta) { /* …Pattern 3… */ }
function applyHreflang(html, meta) { /* …Pattern 2… */ }
function applyOgLocale(html, meta) {
  const ogLocale = meta.htmlLang === "en" ? "en_US" : "ru_RU";
  const alternate = meta.htmlLang === "en" ? "ru_RU" : "en_US";
  html = html.replace(/<meta property="og:locale" content="[^"]*"\s*\/?>/, `<meta property="og:locale" content="${ogLocale}" />`);
  // Inject og:locale:alternate after og:locale
  html = html.replace(
    /(<meta property="og:locale" content="[^"]*"\s*\/?>)/,
    `$1\n    <meta property="og:locale:alternate" content="${alternate}" />`
  );
  return html;
}

// In the main for-loop:
for (const meta of routes) {
  // …existing…
  let html = applyMeta(template, meta);
  html = applyHtmlLang(html, meta);             // ← NEW
  html = applyHreflang(html, meta);             // ← NEW
  html = applyOgLocale(html, meta);             // ← NEW
  html = applyModulePreload(html);
  html = applySafariPreloadFallback(html);
  if (meta.path === "/pay" || meta.path === "/en/pay") {   // ← WIDENED
    html = applyPaddleScript(html);
  }
  html = applyMarker(html, meta.path);
  // …existing body injection…
}
```

### `LangContext` — URL-prefix detection via `useLocation`
```tsx
// Source: extension of existing src/i18n/LangContext.tsx (this session)
import { useLocation } from "react-router";

function detectLangFromPath(pathname: string): Lang | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return null;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathLang = detectLangFromPath(location.pathname);
  const [lang, setLangState] = useState<Lang>(pathLang ?? "ru");
  const [, setEnReady] = useState(false);

  useEffect(() => {
    const next = detectLangFromPath(location.pathname);
    if (next === "en") {
      if (!dicts.en) loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
      else setLangState("en");
      return;
    }
    if (next === "ru") {
      setLangState("ru");
      return;
    }
    // Unprefixed: keep status-quo storage/navigator detection (D-07)
    const detected = detectLangFromStorage();
    if (detected === "en") {
      loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
    } else {
      setLangState("ru");
    }
  }, [location.pathname]);

  // DELETED — was the hydration-mismatch root cause:
  // useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    if (l === "en" && !dicts.en) {
      loadEnDict().then(() => { setEnReady(true); setLangState(l); });
    } else {
      setLangState(l);
    }
  };

  const t = (key: string): string => {
    const current = dicts[lang];
    if (current && current[key] !== undefined) return current[key];
    return dicts.ru?.[key] ?? key;
  };

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}
```

### Sitemap with hreflang annotations (Option A — inline `xhtml:link`)
```xml
<!-- Source: developers.google.com/search/docs/specialty/international/localized-versions#sitemap -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://opten.space/welcome</loc>
    <lastmod>2026-05-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="ru"        href="https://opten.space/welcome" />
    <xhtml:link rel="alternate" hreflang="en"        href="https://opten.space/en/welcome" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://opten.space/welcome" />
  </url>
  <url>
    <loc>https://opten.space/en/welcome</loc>
    <!-- …identical hreflang triplet… -->
  </url>
</urlset>
```
[CITED: developers.google.com/search/docs/specialty/international/localized-versions]

**Planner choice (per CONTEXT.md):** Option A (annotated XML, simpler for Google) **OR** Option B (12 entries, no `xhtml` namespace, hreflang only in `<head>`). Both are valid. Recommendation: **Option A** because it's a single source of truth for hreflang at sitemap level AND we already inject hreflang in `<head>`; redundancy is good for AI crawlers.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-helmet-async` for runtime head | Build-time prerender of head (Phase 2 D-01) | Phase 2 (2026-05-15) | AI crawlers see distinct heads pre-hydration. Phase 3 extends to per-language. |
| `document.documentElement.lang = lang` runtime mutation | `<html lang>` baked at prerender time | Phase 3 (now) | Eliminates hydration-attribute mismatch (Pitfall 1). |
| Single `<html lang="ru">` + sub-domain or query-param i18n | Path-prefix `/en/*` with reciprocal hreflang + per-lang `<html lang>` | Phase 3 (now) | Standard pattern recommended by Google + AI-crawler best practice [CITED: developers.google.com/search/docs/specialty/international/localized-versions]. |
| `import { Link } from "react-router-dom"` | `import { Link } from "react-router"` (v7) | Pre-Phase-2 (already migrated) | React Router 7 unified the `dom` and `core` packages — single import surface. |

**Deprecated / outdated:**
- `react-router-dom` package — collapsed into `react-router` in v7 [CITED: reactrouter.com/upgrading/v6 — although project is v7-native, this is noted for any AI-generated suggestions that might revert to `-dom`].
- `react-helmet` (non-async variant) — long-deprecated; replaced by `react-helmet-async`; both rejected by Phase 2 in favor of build-time.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The residual hydration mismatch on `/` is caused by `LangContext.tsx:84-86` (`document.documentElement.lang =`) combined with the post-mount `setLangState(detected)` that re-renders body text. | Pitfall 1 / Plan 01 | MEDIUM — if root cause is elsewhere (e.g., `motion` mount animation, or an `OptenHeroAnimation` Suspense interaction), Plan 01's fix is incomplete and Phase 3 ships on an unstable base. **Mitigation:** Plan 01 explicitly validates via `npm run preview` + DevTools Console + Playwright `page.on("pageerror")` before merge. Escalation rule (D-06) routes to mini-phase 2.3 if architectural. |
| A2 | `vercel.json` needs no change for `dist/en/{route}/index.html` to serve at `/en/{route}` — Vercel's default static-file precedence handles nested directories the same way it handles flat. | Architecture Patterns / Pitfall 8 | LOW — Phase 2 proved this with 5 nested directories under `dist/`. Nested two levels deep is the same code path. **Mitigation:** Acceptance check on a Vercel preview deploy: `curl https://{preview}.vercel.app/en/welcome` returns the EN file, not the SPA fallback. |
| A3 | Static-importing `en.json` in `entry-server.tsx` (and only there) so SSR can render EN bodies will not bloat the **client** bundle — Vite tree-shakes per build, and `entry-server.tsx` is the SSR build only (separate from `vite build` for client). | Pitfall 6 fix recommendation | LOW — verified by mental model of two-outDir build (`.ssr-cache` vs `dist/assets`); the SSR bundle never reaches the browser. **Mitigation:** Planner verifies via post-build `grep en\.json dist/assets/index-*.js` — if no match, EN dict stays lazy on client. |
| A4 | React Router 7 `useLocation` returns the same `pathname` synchronously during SSR (under `StaticRouter`) as it does on first client render (under `BrowserRouter`), enabling SSR/CSR lang parity. | Pattern 4 + Pitfall 6 | LOW — [CITED: reactrouter.com/start/library/routing]; this is the documented behavior. **Mitigation:** Plan 01 includes a smoke test asserting SSR-rendered body text matches client-rendered body text for `/en/welcome`. |
| A5 | Updating `docs/INTEGRATION-CONTRACT.md` §6 to mention `/en/pay` is the only doc change needed for D-03b. §3 (URL contract) does NOT need a new row for `/en/pay` because the extension never navigates there — Integration Contract describes the extension↔site interface, not the site's full URL space. | Project Constraints / RuntimeStateInventory | MEDIUM — if I'm wrong about §3's scope, the contract document gets out of sync. **Mitigation:** read `docs/INTEGRATION-CONTRACT.md` §3 in full ([VERIFIED: this session, lines 153-169 — table lists 5 extension-deep-linked routes]; `/en/pay` is not such a route by D-03 design). **Confirmed:** §3 stays unchanged; only §6 needs the symmetric Paddle mention. |

---

## Open Questions

1. **Should `LangSwitcher` be extracted to a shared component or remain inlined per consumer (4 sites)?**
   - What we know: 4 consumers (`App.tsx` Navbar, `PayPage.tsx`, `AccountPage.tsx`, `LegalLayout.tsx`) currently inline the toggle. Extraction is cleaner; inlining is smaller diff.
   - What's unclear: planner discretion; not in CONTEXT.md.
   - Recommendation: **extract** to `src/app/components/LangSwitcher.tsx` because the `getEnTarget` / `getRuTarget` lookup logic is non-trivial — duplicating it 4× invites drift. Plan would add 1 new file + edit 4 existing files (net ~−40 lines).

2. **Sitemap shape — annotated `xhtml:link` per URL, or 12 plain entries (RU+EN flat)?**
   - What we know: both are valid; annotated is more redundant with `<head>` hreflang but lets Google cross-check.
   - What's unclear: planner discretion.
   - Recommendation: **annotated `xhtml:link`** — single source of truth for sibling URLs lives in `seo-routes.ts` `hreflangAlternates`; both `prerender.mjs` and `sitemap.mjs` consume it. Marginally more code in `sitemap.mjs` but no functional downside.

3. **Header switcher behavior on locked-route-only routes (`/success`, `/account`, `/dashboard/download-skill`) — route to `/en/`, or disable button?**
   - What we know: D-discretion. CONTEXT.md default = "route to `/en/`" (more user-friendly).
   - What's unclear: nothing — defer to planner with the CONTEXT.md default.
   - Recommendation: route to `/en/`. Planner confirms.

4. **Should `entry-server.tsx` import `en.json` statically?**
   - What we know: current `LangContext.tsx` lazy-loads EN via dynamic import. SSR needs synchronous access to render EN bodies (Pitfall 6).
   - What's unclear: cleanest pattern — (a) static-import `en.json` in `entry-server.tsx` and pass to `LangProvider` as a prop; (b) detect SSR in `LangContext.tsx` and gate the dynamic import behind `typeof window !== "undefined"`.
   - Recommendation: **(b)** — keep client-side lazy loading intact; only the SSR path eagerly imports. One small change in `LangContext.tsx`: at module top, `import enDict from "./en.json"` if `typeof window === "undefined"` (or do the eager static load via a separate `LangProviderSSR` wrapper used only in `entry-server.tsx`). Planner picks.

5. **Should the Plan-01 hydration-mismatch fix include a Playwright reproducer test, or trust manual `npm run preview` + DevTools?**
   - What we know: codebase has no tests / no automation. CLAUDE.md "no tests" rule applies.
   - What's unclear: nothing — codebase convention says manual.
   - Recommendation: manual `npm run preview` + DevTools Console grep for "Hydration failed" / "did not match". Document the repro in Plan 01 commit message and `03-VERIFICATION.md` per phase pattern. If the mismatch is too subtle to reproduce manually, escalate to mini-phase 2.3 per D-06.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node 22+ | `node scripts/prerender.mjs`, `node scripts/sitemap.mjs` | ✓ | (local + Vercel default) — [VERIFIED: phase 2 builds succeed on production] | — |
| Vite 6 | `vite build`, `vite build --ssr …` | ✓ | 6.3.5 | — |
| React 18.3 + react-dom | `renderToString`, `hydrateRoot`, `createRoot` | ✓ | 18.3.1 | — |
| React Router 7 | `BrowserRouter`, `StaticRouter`, `useLocation`, `useNavigate`, `Routes`, `Route`, `Link` | ✓ | 7.13.0 | — |
| Vercel CDN | static file serving from `dist/` | ✓ | — | — |
| `og-card-en.png` in `public/` | EN OG image | ✓ | shipped Phase 1 GEO-A-4 | — |
| `public/assets/welcome-en-*.png` | EN welcome screenshots | ✓ | shipped pre-Phase-2 | — |
| `~/.claude/skills/geo/scripts/fetch_page.py` | Phase 3 acceptance — `has_ssr_content` / `word_count` / hreflang grep | ✓ (per Phase 2 verification pattern) | — | manual `curl` + `grep` |
| Playwright (for hydration repro) | Plan 01 acceptance | OPTIONAL — `npx playwright` available via Phase 02 patterns | — | manual DevTools Console |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None — Playwright is optional; manual browser inspection is the documented acceptance gate.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None** — project has no unit/integration test suite by design (CLAUDE.md "no tests, no lint, no typecheck"). |
| Config file | n/a |
| Quick run command | `npm run build` (TS errors surface during `vite build`) |
| Full suite command | `npm run build && npm run preview` |
| Phase gate | Successful Vercel deploy + per-route fetch assertions via `fetch_page.py` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GEO-C-1 | `/en/*` path-prefix design implemented (not `?lang=` or subdomain) | smoke | `ls dist/en/welcome/index.html` after build | ❌ Plan emits it |
| GEO-C-2 | `/en/{root,welcome,pay,privacy,terms,refund}` siblings ship; locked routes still respond at root | smoke + curl | After deploy: `for p in / /welcome /pay /privacy /terms /refund /en/ /en/welcome /en/pay /en/privacy /en/terms /en/refund; do curl -sI "https://opten.space$p" | head -1; done` — all 200 | ❌ Manual post-deploy |
| GEO-C-3 | Hreflang triplet on every prerendered page | smoke + grep | `for f in dist/{,en/}{,welcome/,privacy/,terms/,refund/}index.html dist/{,en/}pay/index.html; do echo $f; grep -c 'rel="alternate"' "$f"; done` — every count == 3 | ❌ Plan implements |
| GEO-C-4 | `<html lang>` per route: `"ru"` on unprefixed, `"en"` on `/en/*` | smoke + grep | `grep '<html lang' dist/{,en/}index.html dist/{,en/}welcome/index.html` — confirm RU and EN bake | ❌ Plan implements |
| (Plan 01) | No "Hydration failed" / "did not match" console warning on `/` | manual + DevTools | `npm run preview` then open Chrome DevTools Console on `http://localhost:4173/` — zero React warnings; same with `navigator.language=en` simulated via DevTools Sensors | ❌ Plan 01 must hit this gate |

### Sampling Rate
- **Per task commit:** `npm run build` (exit 0, no TS errors, all 12 expected files emitted)
- **Per wave merge:** `npm run build && npm run preview` + manual smoke on 12 routes
- **Phase gate:** Vercel preview deploy + per-route `fetch_page.py` (matches Phase 2 acceptance protocol)

### Wave 0 Gaps
- None — project's chosen acceptance gate is build + preview + manual + `fetch_page.py`. No framework install needed.

*(If `nyquist_validation` is honored in this codebase per `.planning/config.json:11`, the answer is: nyquist mode is enabled but the project has no automated tests; sampling is via build verification + post-deploy fetch_page. This matches Phase 2's verification pattern verbatim.)*

---

## Security Domain

> `security_enforcement` is not explicitly set in `.planning/config.json`. Treating as enabled. ASVS categories evaluated below:

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | NO | Phase 3 changes no auth surface. Site auth lives in extension via `chrome.runtime.sendMessage`; locked routes that consume auth (`/account`, `/dashboard/download-skill`) get no EN siblings (D-03). |
| V3 Session Management | NO | Same — no session state on the site itself; extension owns it. |
| V4 Access Control | NO | `/account` and `/dashboard/download-skill` remain RU-only, robots-Disallow'd; access control is unchanged. |
| V5 Input Validation | NO | Phase 3 emits static HTML; no user input is parsed during prerender. URL path is the only input (matched against literal manifest entries via `meta.path`), no user-supplied values. |
| V6 Cryptography | NO | None. |
| V8 Data Protection | NO | None. |
| V11 Business Logic | NO | None. |
| V14 Configuration | YES — minor | `vercel.json` security headers (Phase 1 GEO-A-8 — Permissions-Policy, X-Content-Type-Options, Referrer-Policy) auto-apply to `/en/*` paths via the `/(.*)` source pattern. Verify post-deploy. **No change needed.** |

### Known Threat Patterns for `vite + react + vercel-static` stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Open Redirect via language switcher | Tampering | `LangSwitcher` `getEnTarget` / `getRuTarget` operate on literal allow-list of paths (`EN_SIBLINGS` Set), not user-supplied URLs. **Verified by code shape — no `window.location` parsing of query/hash, no untrusted-input → `navigate(arg)`**. |
| Stored XSS via hreflang content | Tampering | `escapeAttr` already used in `prerender.mjs:27` for `applyMeta`; reuse for `applyHreflang` URL values. URLs come from `seo-routes.ts` (build-time constants) — no user input. Defense-in-depth only. |
| Bypassing access control via `/en/account` | Elevation | N/A — `/en/account` not emitted (D-03). Even if a user types it, Vercel SPA fallback hits `main.tsx` which has no `/en/account` route → React Router 404 (returns to `<App />` landing). Acceptable. |
| Subverting Paddle on `/en/pay` (script-load race) | Tampering | Symmetric to `/pay` — synchronous CDN `<script>` tag (D-03b). Integration Contract §6 enforcement extends. |
| Indexing of internal/private paths via EN sibling | Information Disclosure | None created — `/en/account` etc. are intentionally absent. `robots.txt` Disallow list applies to unprefixed paths; verify post-deploy that AI crawlers don't index `/en/account` (which doesn't exist anyway — would return SPA fallback HTML with the standard RU shell). **Recommend:** Plan 02 adds explicit `Disallow: /en/account`, `/en/success`, `/en/dashboard/` to `public/robots.txt` for defense-in-depth, even though those paths emit no real content. |

---

## Sources

### Primary (HIGH confidence)
- `scripts/prerender.mjs` — [VERIFIED: read this session, lines 1-158 — every function signature, every regex, current Paddle injection condition at line 137]
- `scripts/seo-routes.ts` — [VERIFIED: read this session, current 7-entry RU manifest]
- `scripts/sitemap.mjs` — [VERIFIED: read this session, full 46-line file]
- `scripts/entry-server.tsx` — [VERIFIED: read this session, lines 1-31 — full SSR entry]
- `src/main.tsx` — [VERIFIED: read this session, lines 1-72 — current Router declarations + hydration discriminator]
- `src/i18n/LangContext.tsx` — [VERIFIED: read this session, full 110-line file — including the suspected hydration-mismatch root cause at lines 84-86]
- `src/app/App.tsx` Navbar — [VERIFIED: lines 110-174 — current `setLang` consumers]
- `src/app/components/layout/LegalLayout.tsx` — [VERIFIED: full file — switcher consumer]
- `src/app/pages/PayPage.tsx:116, 374` — [VERIFIED: switcher consumer + setLang call site]
- `src/app/pages/AccountPage.tsx:64, 209` — [VERIFIED: switcher consumer + setLang call site]
- `src/app/pages/WelcomePage.tsx` — [VERIFIED: lines 1-50 — uses `useLang` for slide selection only, no switcher of its own]
- `index.html` — [VERIFIED: full file — confirms `<html lang="ru">` line 2, `og:locale=ru_RU` line 22]
- `vercel.json` — [VERIFIED: full file — confirms no `cleanUrls`, SPA rewrite preserved]
- `public/robots.txt` — [VERIFIED: full file — confirms Disallow list applies to unprefixed paths only]
- `package.json` — [VERIFIED: react-router 7.13.0, react 18.3.1, no test deps]
- `docs/INTEGRATION-CONTRACT.md` §3 + §6 + §8 — [VERIFIED: full doc read; §3 lists 5 extension-deep-linked routes; §6 documents synchronous Paddle CDN script; §8 documents protocol for updating this contract]
- `.planning/REQUIREMENTS.md` GEO-C-* — [VERIFIED: lines 52-57 verbatim]
- `.planning/research/GEO-AUDIT.md` §C-5 + per-route table — [VERIFIED: lines 95-99 and 350-360]
- `.planning/phases/02-…/02-CONTEXT.md` — [VERIFIED: D-01 build-time prerender, D-06 hydrateRoot/createRoot detector, D-07 no trailing slash]
- `.planning/phases/02.1-…/02.1-CONTEXT.md` — [VERIFIED: Phase 2.1 D-01 lazy-route policy, D-08 hydration invariant]
- `.planning/phases/03-…/03-CONTEXT.md` — [VERIFIED: D-01..D-07 user-locked decisions]
- `.planning/phases/03-…/03-DISCUSSION-LOG.md` — [VERIFIED: alternatives considered for residual hydration mismatch + D-07 rationale]

### Secondary (HIGH–MEDIUM confidence — official docs, this session)
- [CITED: developers.google.com/search/docs/specialty/international/localized-versions] — Hreflang in `<head>` AND/OR sitemap; reciprocal links requirement; ISO language codes
- [CITED: developers.google.com/search/blog/2013/04/x-default-hreflang-for-international-pages] — original x-default spec
- [CITED: developers.google.com/search/blog/2023/05/x-default] — current x-default best practices
- [CITED: 18.react.dev/reference/react-dom/client/hydrateRoot] — `hydrateRoot` semantics, hydration warnings, `useEffect` runs after hydration commit
- [CITED: nextjs.org/docs/messages/react-hydration-error] — comprehensive list of hydration-mismatch root causes (document attribute writes prominently flagged)
- [CITED: reactrouter.com/start/library/routing] — React Router 7 `useLocation`, `useNavigate`, `StaticRouter` SSR semantics
- [CITED: ogp.me/#optional] — `og:locale` and `og:locale:alternate` spec

### Tertiary (MEDIUM — registry verification, this session)
- `npm view react-router version` → 7.15.1 latest (vs 7.13.0 installed — no breaking changes between)
- `npm view react version` → 19.2.6 latest (project stays on 18.3.1 — out of scope)
- `node -e "..."` parity check ru.json ↔ en.json → 203/203 keys identical

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — all libraries already shipping in Phase 2; no new packages; versions verified against npm registry.
- **Architecture / prerender extension:** HIGH — direct code inspection of `scripts/prerender.mjs:130-157` proves nested directory output works unchanged.
- **Hreflang / `<html lang>` SEO patterns:** HIGH — multiple cross-referenced Google docs + 2013 + 2023 blog posts; reciprocal-links requirement is hard-coded best practice.
- **Hydration-mismatch root cause diagnosis (Pitfall 1):** **MEDIUM** — strongly inferred from code inspection + documented React 18 behavior, but **not** yet reproduced in a controlled `npm run preview` session. This is intentional: Plan 01's job is to reproduce, confirm, and fix. The diagnosis is the planning hypothesis, not the verified fix.
- **Pitfalls:** HIGH — every pitfall is grounded in either a verified code snippet, a cited best-practice doc, or a documented Phase 2 / Phase 2.1 / Phase 2.2 pattern.
- **Common code patterns (Patterns 1-5):** HIGH — direct extension of Phase 2 / Phase 2.1 / Phase 2.2 patterns that are shipping in production today.

**Research date:** 2026-05-16
**Valid until:** 2026-06-13 (30 days for stable; react-router and react versions unlikely to change patterns even if minor releases ship).

---

*Phase: 3 — Bilingual routing*
*Research completed: 2026-05-16*
