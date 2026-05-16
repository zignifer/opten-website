---
tags:
  - gsd
  - patterns
  - phase
phase: 3
milestone: "geo-optimization"
kind: phase-patterns
---
# Phase 3: Bilingual routing — Pattern Map

**Mapped:** 2026-05-16
**Files analyzed:** 9 (8 modified, 0–1 new — `LangSwitcher.tsx` is planner-discretionary)
**Analogs found:** 9 / 9 (every touched file already exists; this phase is pure extension of Phase 2 surface area)

> **Source-of-truth note:** RESEARCH.md §"Architecture Patterns" (Patterns 1–5) and §"Code Examples" already contain the verified target excerpts.
> This file is the **file-by-file mapping** of new/changed code onto its closest in-repo analog — concrete line anchors so the planner can write `Edit` actions without re-deriving where each splice goes.

---

## File Classification

| File | New / Modified | Role | Data Flow | Closest Analog | Match Quality |
|------|----------------|------|-----------|----------------|---------------|
| `scripts/seo-routes.ts` | **Modified** | config / route manifest | build-time data | self (Phase 2 baseline, lines 1–87) | exact (extending own schema) |
| `scripts/prerender.mjs` | **Modified** | build script (HTML transform pipeline) | batch / file-I/O | self (`applyMeta` line 34, `applyPaddleScript` line 123) | exact (adding 3 sibling `apply*` fns) |
| `scripts/sitemap.mjs` | **Modified** | build script (XML emitter) | batch / file-I/O | self (lines 33–42) | exact (extending own `urlset` loop) |
| `scripts/entry-server.tsx` | **Modified** | SSR entry / route registrar | request-response (build-time) | self (lines 16–31) | exact (5 sibling `<Route>` declarations) |
| `src/main.tsx` | **Modified** | client entry / route registrar | request-response | self (lines 44–62) | exact (5 sibling `<Route>` declarations, mirror of `entry-server.tsx`) |
| `src/i18n/LangContext.tsx` | **Modified** | context / state | event-driven (location.pathname) | self (lines 51–100) | exact (extending own provider) |
| `src/app/App.tsx` (Navbar switcher) | **Modified** | component (inline button) | event-driven (click) | `LegalLayout.tsx:22-27` (same inline pattern, simpler) | exact-role match |
| `src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `components/layout/LegalLayout.tsx` (switchers) | **Modified** | component (inline button) | event-driven (click) | each other (4 sites with identical 3-line inline pattern) | exact-role match |
| `src/app/components/LangSwitcher.tsx` | **Possibly new** (planner discretion — RESEARCH "Pattern 5" recommends extract) | component | event-driven (click) | `src/app/components/RouteLoading.tsx` (small shared component already exported from `app/components/`) | role-match |
| `docs/INTEGRATION-CONTRACT.md` §6 | **Modified** | docs | n/a | self (Paddle protocol note) | exact (footnote on `/en/pay` symmetric extension) |

---

## Pattern Assignments

### 1. `scripts/seo-routes.ts` (config, build-time data)

**Analog:** **self** — `scripts/seo-routes.ts` lines 1–87 (the Phase 2 manifest is already the per-route source of truth).
**Pattern source in RESEARCH.md:** §Architecture Patterns → **Pattern 1** (lines 246–302).

**Existing schema** (lines 4–15) — add 2 new fields:
```ts
// scripts/seo-routes.ts:4
export interface RouteMeta {
  path: string;                         // canonical pathname (D-07: bare, no trailing slash except "/")
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  prerender: "full" | "head" | "none";  // D-02 tier
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
}
```

**Extension (D-04 + D-02):**
```ts
htmlLang: "ru" | "en";                  // NEW (D-04) — stamps <html lang> at prerender
hreflangAlternates: {                   // NEW — drives <link rel="alternate"> triplet
  ru: string;                           // unprefixed URL (RU canonical, D-02)
  en: string;                           // /en/ URL
  xDefault: string;                     // always = ru sibling (D-02)
};
```

**Existing constants pattern** (line 17–18) — reuse, do NOT add a new origin constant:
```ts
export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;
```
Add at the same level:
```ts
export const DEFAULT_OG_IMAGE_EN = `${SITE_ORIGIN}/og-card-en.png`;   // already in public/ (Phase 1 GEO-A-4)
```

**Existing entry shape** (lines 21–31, the `/` entry) — copy this shape verbatim for the 6 new EN entries:
```ts
{
  path: "/",                             // ← becomes "/en/", "/en/welcome", "/en/pay", "/en/privacy", "/en/terms", "/en/refund"
  title: "Opten — AI-оценка и улучшение промптов для генерации изображений",  // ← English copy
  description: "…",                       // ← English copy
  canonical: `${SITE_ORIGIN}/`,           // ← `${SITE_ORIGIN}/en/...` for the EN entry
  ogTitle: "…",
  ogDescription: "…",
  prerender: "full",                      // ← match the RU sibling's tier ("full" for /, /welcome, /privacy, /terms, /refund; "head" for /pay)
  changefreq: "weekly",                   // ← match RU sibling
  priority: 1.0,                          // ← match RU sibling
}
```

**Stamping policy for existing 7 entries** (lines 20–87): each gets `htmlLang: "ru"` and a `hreflangAlternates` triplet whose `xDefault` always equals its own RU canonical (D-02). The EN counterpart of every cluster has an **identical triplet** (Google reciprocity requirement — RESEARCH.md Pattern 2 citation).

**Existing pricing/string duplication policy** (line 2 comment `SYNC: title/description strings duplicated from src/i18n/ru.json`) — **inherits unchanged for EN**: EN titles/descriptions duplicated from `src/i18n/en.json`. Same future-cleanup note applies; D-04 explicitly defers the i18n→manifest pipeline.

---

### 2. `scripts/prerender.mjs` (build script, file-I/O batch)

**Analog:** **self** — three existing `apply*` functions are the template for three new ones.
**Pattern source in RESEARCH.md:** §Architecture Patterns → **Pattern 3** (lines 330–349), §Code Examples (lines 651–683).

#### Existing `applyMeta` function (lines 34–52) — template for all `apply*` head-mutators

```js
// scripts/prerender.mjs:34
function applyMeta(html, meta) {
  const before = html;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  // …more regex replacements…
  html = html.replace(
    /<meta name="theme-color"[^>]*\/?>/,
    (m) => `${m}\n    <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`
  );
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <head> tags matched. index.html structure changed?`);
  }
  return html;
}
```

**Copy this signature + fail-fast pattern verbatim** for the three new functions:

- `applyHtmlLang(html, meta)` — RESEARCH.md Pattern 3 (lines 338–349). Single regex on `<html lang="…">`, throws if no match (Phase 2 D-08 fail-fast — same `if (html === before) throw` shape as line 48).
- `applyHreflang(html, meta)` — RESEARCH.md Pattern 2 code (lines 312–324). Injects 3 `<link rel="alternate">` tags after the canonical link inserted by `applyMeta` line 44–47. **Anchor:** match `/<link rel="canonical"[^>]*\/>/` and append.
- `applyOgLocale(html, meta)` — RESEARCH.md Code Examples (lines 656–666). Replaces `<meta property="og:locale">` and appends `<meta property="og:locale:alternate">`. Same regex-with-fallthrough shape as `applyMeta`.

#### Existing `escapeAttr` helper (line 27–29) — already exported pattern; reuse, don't duplicate

```js
// scripts/prerender.mjs:27
function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
```
All hreflang `href=` and og:locale `content=` values pass through this. **No new escape helper needed** (research speculated one might — confirmed not).

#### Existing `applyPaddleScript` condition (line 137) — **widen** in-place (D-03b)

**Current code:**
```js
// scripts/prerender.mjs:137
if (meta.path === "/pay") {
  html = applyPaddleScript(html);         // Phase 2.2: sync Paddle SDK on /pay only
}
```

**Pattern to apply** (D-03b — symmetric Paddle injection on `/en/pay`):
```js
if (meta.path === "/pay" || meta.path === "/en/pay") {
  html = applyPaddleScript(html);         // Phase 3 D-03b: symmetric for /en/pay
}
```
No change to `applyPaddleScript` body itself (line 123–128). The function is reused as-is.

#### Existing main for-loop (lines 130–156) — copy ordering rules

The new `apply*` functions slot between `applyMeta` and `applyModulePreload`, **before** `applyMarker` (which consumes `</head>` — line 71 comment). Ordering rule from research Pattern 3 + line 80–81 comment:
```js
let html = applyMeta(template, meta);
html = applyHtmlLang(html, meta);             // ← NEW
html = applyHreflang(html, meta);             // ← NEW (after applyMeta — needs the canonical link as anchor)
html = applyOgLocale(html, meta);             // ← NEW
html = applyModulePreload(html);              // existing — must precede applyMarker
html = applySafariPreloadFallback(html);      // existing
if (meta.path === "/pay" || meta.path === "/en/pay") {
  html = applyPaddleScript(html);             // existing — widened condition
}
html = applyMarker(html, meta.path);          // existing — MUST be last (eats </head>)
```

#### Existing output-path logic (lines 149–154) — works for `/en/…` unchanged

```js
const outPath = meta.path === "/"
  ? resolve(DIST, "index.html")
  : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
```
`/en/welcome` → `dist/en/welcome/index.html` via `meta.path.replace(/^\//, "") = "en/welcome"`. No code change needed; `mkdir(dirname(outPath), { recursive: true })` already handles nested dirs.

For `/en/` (the EN landing — note trailing slash), the manifest entry needs `path: "/en/"` and the replace produces `"en/"`, resolving to `dist/en/index.html`. **Edge case** the planner must verify: `meta.path === "/"` short-circuit is exact-match against `/`, so `/en/` falls into the `else` branch correctly.

---

### 3. `scripts/sitemap.mjs` (build script, XML emitter)

**Analog:** **self** — current 6-route emitter pattern.
**Pattern source in RESEARCH.md:** §Code Examples → "Sitemap with hreflang annotations" (lines 743–763).

**Existing emitter** (lines 27–42):
```js
const sitemapRoutes = routes.filter(r => r.prerender !== "none");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(r => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join("\n")}
</urlset>`;
```

**Two valid extensions (CONTEXT.md Claude's Discretion — planner picks):**

- **Option A — `xhtml:link` annotations.** Add `xmlns:xhtml="http://www.w3.org/1999/xhtml"` to the `<urlset>` element. Each `<url>` gets 3 `<xhtml:link>` children derived from `r.hreflangAlternates`. Route count stays at 12 (6 RU + 6 EN), but each `<url>` block grows by 3 lines.
- **Option B — pair-listed entries.** No namespace change; the loop simply iterates 12 entries. Hreflang lives only in per-page `<head>` (already injected by `applyHreflang`). Simpler, smaller XML.

RESEARCH.md recommends Option A (line 766 — "single source of truth for hreflang at sitemap level AND we already inject hreflang in `<head>`; redundancy is good for AI crawlers"). Both are valid per CONTEXT.md.

**Existing fail-fast pattern** (lines 29–31) — keep, with the count threshold bumped to match the new manifest:
```js
if (sitemapRoutes.length === 0) {
  throw new Error("sitemap.mjs: no routes with prerender != 'none' — manifest mis-loaded?");
}
```

---

### 4. `scripts/entry-server.tsx` (SSR entry, route registrar)

**Analog:** **self** — Phase 2 mount table (lines 16–31).

**Existing Routes block** (lines 20–27):
```tsx
// scripts/entry-server.tsx:20
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/welcome" element={<WelcomePage />} />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/refund" element={<RefundPage />} />
  {/* NOTE: /pay is head-only (D-02), /success /account /dashboard/* are SPA-only — intentionally NOT mounted here. */}
</Routes>
```

**Pattern to apply** — sibling `/en/*` `<Route>` declarations for the **5 full-prerender** EN routes (`/en/pay` stays out — it's head-only, same comment as `/pay`):
```tsx
<Route path="/en/"        element={<App />} />
<Route path="/en/welcome" element={<WelcomePage />} />
<Route path="/en/privacy" element={<PrivacyPage />} />
<Route path="/en/terms"   element={<TermsPage />} />
<Route path="/en/refund"  element={<RefundPage />} />
```

**Per-page, not wildcard** (RESEARCH.md anti-pattern line 473) — `__PRERENDER_PATH` discriminator (`src/main.tsx:65-66`) compares exact paths; a wildcard `<Route path="/en/*">` would break the match.

**No `LangProvider` change here** — `LangProvider` already wraps `<StaticRouter>` (line 18), and once `LangContext` reads `useLocation` (item 6 below), the `StaticRouter location={path}` (line 19) supplies `/en/welcome` and the EN dict loads automatically. **However:** during SSR, `loadEnDict()` (a dynamic import) is asynchronous → first render still produces RU text on `/en/*`. RESEARCH.md §Common Pitfalls discusses this; planner's call whether to switch `en.json` to a static SSR import (mirrors `ru` line 2 import) for the EN entries, accepting the bundle-weight tradeoff for build-time-only correctness.

---

### 5. `src/main.tsx` (client entry, route registrar — **mirror of `entry-server.tsx`**)

**Analog:** **self** — Phase 2 client mount table (lines 44–62).
**Coupling note:** This block and `entry-server.tsx` must stay in lockstep — every prerendered route must mount in both. RESEARCH.md Pattern 1 + Phase 2 D-06 already enforce this.

**Existing Routes block** (lines 48–58):
```tsx
// src/main.tsx:48
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/pay" element={<PayPage />} />
  <Route path="/success" element={<SuccessPage />} />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/refund" element={<RefundPage />} />
  <Route path="/account" element={<AccountPage />} />
  <Route path="/welcome" element={<WelcomePage />} />
  <Route path="/dashboard/download-skill" element={<DownloadSkillPage />} />
</Routes>
```

**Pattern to apply** — 6 sibling `/en/*` declarations (5 full + `/en/pay` since the client must mount it for SPA navigation and direct hits):
```tsx
<Route path="/en/"        element={<App />} />
<Route path="/en/pay"     element={<PayPage />} />
<Route path="/en/privacy" element={<PrivacyPage />} />
<Route path="/en/terms"   element={<TermsPage />} />
<Route path="/en/refund"  element={<RefundPage />} />
<Route path="/en/welcome" element={<WelcomePage />} />
```

**No new lazy imports** — `PayPage` etc. are already lazy-loaded (lines 18–21). The same `<Suspense fallback={<RouteLoading />}>` (line 47) covers both prefixes.

**`__PRERENDER_PATH` discriminator (lines 65–66) needs zero change** — already a string-equality test against `window.location.pathname`. For `/en/welcome` the prerendered file writes `window.__PRERENDER_PATH = "/en/welcome"` (from `applyMarker(html, meta.path)` at `prerender.mjs:140`), so `pathMatches === true` and `hydrateRoot` runs cleanly.

---

### 6. `src/i18n/LangContext.tsx` (context, event-driven on location)

**Analog:** **self** — Phase 2 provider (lines 51–100).
**Pattern source in RESEARCH.md:** §Architecture Patterns → **Pattern 4** (lines 359–415), §Code Examples (lines 685–741).

**Existing detection** (lines 8–12) — keep, rename to `detectLangFromStorage`, SSR-guard:
```ts
// src/i18n/LangContext.tsx:8 — existing
function detectLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return navigator.language.startsWith("ru") ? "ru" : "en";
}
```
Becomes (per RESEARCH Pattern 4 lines 375–381):
```ts
function detectLangFromPath(pathname: string): Lang | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return null;
}
function detectLangFromStorage(): Lang {
  if (typeof window === "undefined") return "ru";        // SSR-safe
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return navigator.language.startsWith("ru") ? "ru" : "en";
}
```

**Existing provider** (lines 51–100) — extend with `useLocation` and **DELETE lines 84–86** (the `document.documentElement.lang =` `useEffect`). RESEARCH.md Pattern 3 + Hydration Mismatch Diagnosis identify this as the **root cause** of the Phase 02.2-carried `/` hydration mismatch (CONTEXT.md D-06, "Plan 01 of Phase 3").

**Lines that MUST be deleted** (the fix):
```ts
// src/i18n/LangContext.tsx:84 — DELETE THIS BLOCK
useEffect(() => {
  document.documentElement.lang = lang;
}, [lang]);
```

**Lines that MUST be added** (Pattern 4 — full new body shown in RESEARCH.md lines 695–741). Key splice points relative to existing code:
- Insert `import { useLocation } from "react-router";` at top.
- Replace `useState<Lang>("ru")` initializer (line 52) with `useState<Lang>(detectLangFromPath(useLocation().pathname) ?? "ru")` — but **bind `useLocation` once** before `useState` to obey rules of hooks.
- Replace the `useEffect(() => { const detected = detectLang(); … }, [])` (lines 57–68) with the location-keyed effect from RESEARCH.md lines 701–719 (`useEffect(() => { … }, [location.pathname])`).

**SSR-safety constraint inherited from Phase 2 D-06:** The initial `useState` value runs during `renderToString` — `useLocation` works inside `StaticRouter` (entry-server.tsx line 19), so the EN dict won't be ready synchronously but the lang state itself is. The `t()` fallback (lines 88–93) already covers "EN selected, en.json not loaded yet → fall back to ru" — that path is already exercised in Phase 2.

---

### 7. Header language switcher (4 inline sites — `App.tsx:131-137`, `App.tsx:160-169`, `PayPage.tsx:374`, `AccountPage.tsx:209`, `LegalLayout.tsx:22-27`)

**Analog (closest existing inline pattern):** `src/app/components/layout/LegalLayout.tsx:22-27` — smallest, cleanest occurrence:
```tsx
<button
  onClick={() => setLang(lang === "ru" ? "en" : "ru")}
  className="text-sm font-medium text-zinc-400 hover:text-white …"
>
  {lang === "ru" ? "EN" : "RU"}
</button>
```
**Pattern source in RESEARCH.md:** §Architecture Patterns → **Pattern 5** (lines 417–468).

**Replacement pattern (full code excerpt — RESEARCH.md lines 424–465).** Two planner options:

- **Option A (recommended by RESEARCH.md line 468):** extract `src/app/components/LangSwitcher.tsx` per Pattern 5 code excerpt. Single source of truth for the path-aware navigation logic (`getEnTarget` / `getRuTarget`). Each of the 4 sites replaces ~6 lines of inline `<button>` with `<LangSwitcher className="…" />`, passing only Tailwind classes.
- **Option B:** inline `useNavigate` + `getEnTarget` in each of the 4 sites. Lower diff but duplicates the EN-siblings set + path-rewrite logic 4×. CONTEXT.md "Claude's Discretion" allows either.

**Existing imports pattern (LegalLayout.tsx:1-3)** — destination component imports:
```tsx
import { Link } from "react-router";
import { useLang, useT } from "../../i18n/LangContext";
```
Per Pattern 5 (line 427) the switcher adds:
```tsx
import { useLocation, useNavigate } from "react-router";
```
Same package (`react-router`, **not** `react-router-dom`) — RESEARCH.md anti-pattern line 477.

**EN_SIBLINGS set (RESEARCH.md line 431)** is build-time data and must stay in sync with the 6 EN entries added to `seo-routes.ts` (item 1). Planner-level comment in the file should call this out (mirrors `seo-routes.ts:2` "SYNC:" comment style — same project convention).

**Sites without EN siblings** (`/success`, `/account`, `/dashboard/download-skill`) — `getEnTarget` returns `/en/` (CONTEXT.md Claude's Discretion last bullet — "route to `/en/`" is the planner-defaulted choice).

---

### 8. `docs/INTEGRATION-CONTRACT.md` (docs, n/a flow)

**Analog:** **self** — §6 Paddle SDK Initialization (CONTEXT.md canonical_refs lines 105–106 pin the line range to 236–268).

**Pattern to apply** (CONTEXT.md D-03b):
- Update §6 to state explicitly that `/en/pay` is a `/pay` surface and ships the synchronous `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">` tag.
- Bump `Last sync` date per §8 protocol.
- Frame as **symmetric extension, not contract change** (CONTEXT.md D-03b wording).

No code excerpt needed — this is a one-paragraph docs edit. Plan should include it in the same commit as the `prerender.mjs` Paddle widening (item 2) so contract and code land together (project convention from PROJECT.md §Constraints: "duplicated and must be kept in sync").

---

## Shared Patterns

### Build-time HTML mutation (fail-fast on missing anchor)

**Source:** `scripts/prerender.mjs:48-50` (also lines 56–58, 69–70 — the pattern is used 3× already)
```js
if (html === before) {
  throw new Error(`prerender(${meta.path}): no <head> tags matched. index.html structure changed?`);
}
```
**Apply to:** `applyHtmlLang`, `applyHreflang`, `applyOgLocale`. Every new regex-replace in prerender.mjs must include a no-match guard — Phase 2 D-08 ("postbuild Node script, no framework") relies on loud-fail at build time rather than silent SEO regressions in production.

### Path → output-file resolution

**Source:** `scripts/prerender.mjs:149-154`
```js
const outPath = meta.path === "/"
  ? resolve(DIST, "index.html")
  : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
await mkdir(dirname(outPath), { recursive: true });
```
**Apply to:** All 6 new EN entries. No code change to this block itself; the new manifest entries flow through unchanged. `mkdir({ recursive: true })` handles the nested `dist/en/{route}/` directory creation.

### Per-page route mount mirroring (entry-server.tsx ↔ main.tsx)

**Source:** Phase 2 D-06 invariant — every `<Route>` in `entry-server.tsx` (lines 20–27, full-prerender only) has a matching `<Route>` in `src/main.tsx` (lines 48–58, all routes).
**Apply to:** Items 4 and 5 must ship in the same plan or be reviewed together. A mount in `main.tsx` without `entry-server.tsx` would prerender empty `<div id="root">`. A mount in `entry-server.tsx` without `main.tsx` would prerender content that hydration cannot match → React #418/#423 (Phase 2 hard-learned, see [main.tsx:36-40](../../../src/main.tsx) comment).

### React Router 7 import surface

**Source:** Every router file in the repo (`main.tsx:4`, `entry-server.tsx:7`, `App.tsx`, `LegalLayout.tsx:1`) imports from `"react-router"` — NEVER `"react-router-dom"`.
**Apply to:** New `LangSwitcher.tsx` (if extracted) + extended `LangContext.tsx` must import `useLocation` / `useNavigate` from `"react-router"`. RESEARCH.md anti-pattern line 477 explicitly flags the wrong package.

### Locked-route preservation (PROJECT.md / INTEGRATION-CONTRACT.md §3)

**Source:** PROJECT.md §Constraints, `docs/INTEGRATION-CONTRACT.md` §3.
**Apply to:** Every plan in Phase 3. The 5 locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) MUST keep their root paths. `/en/welcome` and `/en/pay` are **additions**, never renames or redirects. No edit in this phase may modify the 5 root-path `<Route>` declarations in `main.tsx:49-57` or the 5 manifest entries in `seo-routes.ts:21-87`.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/app/components/LangSwitcher.tsx` (only if planner picks Option A in item 7) | component | event-driven | The 4 existing switcher sites are inline `<button>` snippets — no prior extracted shared-language-switcher component exists in the repo. Closest neighbor is `src/app/components/RouteLoading.tsx` (small shared component, `app/components/` directory, imported from `main.tsx:12`) — use its file structure as the **directory + export-style** analog only (the **behavior** comes from RESEARCH.md Pattern 5 lines 449–465). |

No files in Phase 3 lack a behavioral analog. The "no analog" cell above is structural only.

---

## Plan 01 — Hydration mismatch fix (CONTEXT.md D-06)

**Special status:** Plan 01 ships BEFORE any other Phase 3 plan (CONTEXT.md D-06). It is **purely** the deletion of `src/i18n/LangContext.tsx:84-86`:
```ts
useEffect(() => {
  document.documentElement.lang = lang;
}, [lang]);
```
Pattern source: RESEARCH.md §Architecture Patterns Pattern 3 (lines 351–357) — "DELETE — this is the hydration-mismatch root cause".

**Why this is its own plan:** removing the runtime `<html lang>` write is meaningless unless build-time `<html lang>` baking (`applyHtmlLang`, item 2) is in place to replace it. So Plan 01 = remove the broken runtime write; Plan 02+ = ship the build-time replacement and the rest of the bilingual surface. Order is critical: shipping Plan 01 alone would leave `/` correctly RU but break the runtime EN-flip on root paths (D-07 contract). RESEARCH.md §Common Pitfalls + §Hydration Mismatch Diagnosis (sections beyond the patterns block) drive the planner's commit shape here.

---

## Metadata

**Analog search scope:**
- `scripts/` (prerender, sitemap, seo-routes, entry-server) — full directory read
- `src/i18n/` (LangContext) — full file read
- `src/main.tsx` — full file read
- `src/app/App.tsx`, `pages/PayPage.tsx`, `pages/AccountPage.tsx`, `components/layout/LegalLayout.tsx` — switcher excerpts read via `setLang(` grep + targeted Read

**Files scanned:** 7 source files, 2 research/context files
**Pattern extraction date:** 2026-05-16
**Phase 3 surface area:** 8 modified files + 0–1 new file (planner discretion on `LangSwitcher` extract) + 1 docs edit (INTEGRATION-CONTRACT §6)

---

*Phase: 3 — Bilingual routing*
*Patterns mapped: 2026-05-16*
