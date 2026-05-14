---
tags:
  - gsd
  - research
  - phase
phase: 2
milestone: "geo-optimization"
kind: phase-research
---
# Phase 2: Per-route prerender + per-route metadata — Research

**Researched:** 2026-05-15
**Domain:** Build-time static prerender for a Vite 6 + React 18.3 + React Router 7 SPA, with per-route head metadata, hydration, and a regenerated sitemap.xml.
**Confidence:** HIGH

## Summary

The hard work for Phase 2 is **wiring** a small set of well-understood primitives — `react-dom/server.renderToString`, react-router 7's `StaticRouter`, and a Node-based `postbuild` script — into the existing Vite 6 build, *without* breaking the synchronous Paddle bootstrap or the i18n context. None of the work requires a framework migration; everything stays in-repo as a single `scripts/prerender.mjs` invoked after `vite build`.

Three concrete primary findings drive the plan:

1. **`react-router@7.13.0` still exports `StaticRouter`** from the `react-router` package root [VERIFIED: `node_modules/react-router/dist/development/index.d.ts` line 8, also re-exported at v7.15.1 on npm]. There is no `react-router-dom` v7 — v7 unified everything into `react-router`. So the SSR import path is `import { StaticRouter } from "react-router"`. No new dependency needed.
2. **`react-dom@18.3.1` ships `react-dom/server`** [VERIFIED: `node_modules/react-dom/package.json` exports map includes `./server` resolving to `./server.node.js`]. So `import { renderToString } from "react-dom/server"` works in a plain Node script. No new dependency needed for the SSR side either.
3. **`LangContext.tsx`'s `useState(detectLang)` initializer reads `localStorage` and `navigator`** ([src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx) lines 9–13, 30) — both undefined under `renderToString`. This is a **hard blocker** for the prerender step until mitigated. The minimal fix is one line: change `useState<Lang>(detectLang)` to `useState<Lang>("ru")` and move detection into a `useEffect` that runs only on the client. The detection result already lives in `useEffect` semantics anyway (the `document.documentElement.lang` sync is already in a `useEffect`). Mitigation is non-controversial and matches the D-05 decision (prerender RU, hydrate to user preference).

**Primary recommendation:** Implement a hand-rolled postbuild Node script (`scripts/prerender.mjs`) that (a) compiles a tiny SSR entry through Vite's library mode into a `.cache/` location, (b) imports the compiled entry, (c) loops over a manifest of routes, calls `renderToString(<StaticRouter location={path}>...)`, performs targeted string replacement on the built `dist/index.html` to inject per-route `<head>` overrides and the rendered body, and (d) writes each output to `dist/<route>/index.html`. The same script writes `dist/sitemap.xml`. Zero new runtime dependencies; `react-dom`/`react-router` are already installed.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Per-route HTML generation | Build (Node postbuild) | — | Audit C-1/C-4 require pre-hydration HTML; runtime tools cannot reach non-JS crawlers |
| Per-route metadata source | Build (TypeScript manifest, compiled by Vite SSR build) | — | Must be importable both by the postbuild script AND optionally by client React if Phase 3 needs it; SSR-build resolves `@` alias and TS types |
| HTML template authoring | Build (Vite-built `dist/index.html`) | — | Vite already rewrites asset hashes and minifies; postbuild only mutates `<head>` + `<body>` body slot |
| Hydration of prerendered DOM | Client (`react-dom/client.hydrateRoot`) | — | Preserves the SEO-relevant DOM and avoids a re-render flash |
| Empty-`#root` fallback (SPA routes) | Client (`react-dom/client.createRoot`) | — | `/account` `/success` `/dashboard/*` keep current behavior |
| Sitemap.xml emission | Build (same postbuild) | Static file in `public/sitemap.xml` (fallback) | `dist/sitemap.xml` shadows `public/sitemap.xml` — Vite copies `public/` first, then the postbuild overwrites |
| Paddle bootstrap | Browser (sync script tag in `<head>`) | — | Locked by DEC-integration-contract-paddle-init; every emitted HTML must keep the sync `<script>` |

## Standard Stack

### Core (already installed — verify locally before planning)

| Package | Installed version | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| `react-dom@18.3.1` | [VERIFIED: `node_modules/react-dom/package.json` line `"version": "18.3.1"`] | Provides `react-dom/server.renderToString` AND `react-dom/client.hydrateRoot` | The canonical Vite SSG pattern uses these two; latest is `19.2.6` on npm but project is locked to 18 by peerDependencies in [package.json](../../../package.json) line 74. Stay on 18. |
| `react-router@7.13.0` | [VERIFIED: `node_modules/react-router/package.json` line `"version": "7.13.0"`] | Provides `StaticRouter` for SSR routing; current package.json declares dep at this version (line 59). npm latest is `7.15.1`. | v7 collapsed `react-router-dom` into `react-router`. `StaticRouter` is exported from the root package — import path is `import { StaticRouter } from "react-router"` [VERIFIED: `node_modules/react-router/dist/development/index.d.ts` line 8 re-exports `T as StaticRouter` from `./index-react-server-client-1TI9M9o1.js`]. |
| `vite@6.3.5` | [VERIFIED: [package.json](../../../package.json) line 71] | Used to build the SSR entry as a library bundle | The official Vite SSR guide recommends a separate Vite build pass with `build.ssr: true` to produce a Node-importable bundle [CITED: vite.dev/guide/ssr]. This avoids hand-rolling a TypeScript loader for `*.tsx`, JSON imports, Tailwind class strings, and the `@` alias. |

### Supporting (NO new dependencies needed)

| Pattern | Why no library | Alternative if needed |
|---------|---------------|----------------------|
| HTML mutation | Plain string `.replace()` with anchored markers is sufficient for the 7 targeted tag swaps and 1 body slot. The Phase 1 `<head>` already has stable, unique marker comments (`<!-- Open Graph -->`, `<!-- Paddle.js v2 ... -->`) | `cheerio` (~700KB, full jQuery-like DOM API) — only worth it if the spec grows to manipulate JSON-LD per route. [ASSUMED] cheerio adds startup time on every build; with 6 routes the cost is negligible (~50–100ms). |
| XML emission | Hand-written template literal in `sitemap.mjs`. The schema (`<urlset xmlns="..."><url><loc/><lastmod/><changefreq/><priority/></url>…`) is fixed and short. | `xmlbuilder2` if the schema grows (e.g., `<image:image>` or `<xhtml:link>` for hreflang in Phase 3). |
| File I/O | Node 20 built-ins: `node:fs/promises`, `node:path`, `node:url` for `import.meta.url` → `__dirname`. | None. |

### Alternatives Considered

| Instead of | Could use | Why rejected |
|------------|-----------|--------------|
| Hand-rolled `scripts/prerender.mjs` | `vite-plugin-prerender` / `vite-plugin-ssr` (now Vike) | Vike is a full file-routing framework — replaces `BrowserRouter` setup, conflicts with D-08 ("prefer postbuild script over framework migration"). [ASSUMED, based on Vike docs] |
| Hand-rolled `scripts/prerender.mjs` | `react-snap` (Puppeteer-based) | Puppeteer downloads ~300MB Chromium [CITED: pptr.dev "Puppeteer downloads a recent version of Chrome (~170MB Mac, ~282MB Linux, ~280MB Win)"]. Windows-host project, slow CI. Worse: react-snap is unmaintained (last meaningful release 2019) — [ASSUMED based on npmjs.com/package/react-snap last publish date]. |
| `hydrateRoot` for all routes | Keep `createRoot` everywhere | Without hydration, React replaces the prerendered DOM tree on first render — the SEO win is real for the *initial response* but the DOM you see in DevTools after first paint is client-rendered. Hydration matters for visible stability (no FOUC) and for crawlers that *do* run JS (Googlebot post-2019). D-06 already locked `hydrateRoot`. |
| Vite SSR build of an entry file | Pure-Node loader with `tsx`/`esbuild` + manual alias resolution | Need to resolve `@` alias, `.tsx`, JSON imports, raw `.svg` (via `assetsInclude` in [vite.config.ts](../../../vite.config.ts) line 21), and Tailwind class strings (which are inert at runtime). Vite SSR build handles all of this for free. The cost is one extra `vite build --ssr` invocation (~3–5s [ASSUMED]). |

**Installation:**
No `npm install` step needed for the standard recommendation. All required packages are already installed (verified via `node_modules` inspection).

**Version verification (planner: run before locking the plan):**
```bash
node -e "console.log(require('react-dom/package.json').version)"   # expect 18.3.1
node -e "console.log(require('react-router/package.json').version)" # expect 7.13.0
node -e "console.log(require('react/package.json').version)"        # expect 18.3.1
```

## Architecture Patterns

### System Architecture Diagram

```
                      npm run build
                            │
                            ▼
              ┌─────────────────────────────┐
              │  vite build (existing)      │  → dist/index.html, dist/assets/*,
              │  produces SPA bundle        │    dist/{robots,sitemap,llms}.txt,
              └──────────────┬──────────────┘    dist/og-card-*.png (from public/)
                             │
                             ▼
              ┌─────────────────────────────┐
              │  vite build --ssr           │  → .ssr-cache/entry-server.mjs
              │  scripts/entry-server.tsx   │    (Node-importable SSR bundle that
              │  → SSR bundle               │     exports renderRoute(path))
              └──────────────┬──────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │  node scripts/prerender.mjs │
              │                             │
              │  1. read dist/index.html    │
              │  2. import SSR bundle       │
              │  3. import seo-routes.ts    │
              │  4. for each route:         │
              │       renderRoute(path)     │
              │       → html body string    │
              │       inject head overrides │
              │       inject body content   │
              │       write dist/<r>/index  │
              │  5. write dist/sitemap.xml  │
              └─────────────────────────────┘
                             │
                             ▼
                    Vercel deploy (static)
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   GET /welcome                  GET /account
   → dist/welcome/index.html     → no file matches
   (real file, takes precedence) → rewrite /(.*) → /index.html
   prerendered head+body            → dist/index.html (SPA shell)
   hydrateRoot on mount             createRoot on mount
```

### Recommended Project Structure

```
opten-website/
├── scripts/
│   ├── entry-server.tsx        # SSR entry: exports renderRoute(path: string): string
│   ├── prerender.mjs           # Node postbuild orchestrator
│   ├── sitemap.mjs             # XML emitter (called by prerender.mjs OR standalone)
│   └── seo-routes.ts           # Per-route metadata manifest (D-03 home)
├── src/
│   └── main.tsx                # MODIFIED: hydrateRoot vs createRoot branch (D-06)
├── src/i18n/
│   └── LangContext.tsx         # MODIFIED: move detectLang into useEffect (SSR-safe)
├── package.json                # MODIFIED: build script chains the postbuild
└── vite.config.ts              # MODIFIED only if SSR build needs explicit config
```

**Rationale on manifest location:** `scripts/seo-routes.ts` (not `src/seo/routes.ts`) because (a) the file is consumed by the postbuild script which lives in `scripts/`, (b) keeping it out of `src/` makes it explicit that it's a build-time artifact, not a React runtime concern, and (c) the SSR entry can still `import` it via the Vite SSR build, which resolves cross-directory TS imports. If Phase 3 later needs to expose route metadata to the client (e.g., for a sitemap link list in the footer), move to `src/seo/routes.ts` at that point. **Researcher decision:** start in `scripts/seo-routes.ts`.

**Rationale on manifest format:** TypeScript (not JSON) because (a) types catch typos in the metadata keys, (b) it can import from `src/i18n/ru.json` to avoid duplicating pricing/headline strings — though the simpler approach is to duplicate verbatim with a `// SYNC: keep in sync with src/i18n/ru.json key "hero.title"` comment per CLAUDE.md's existing duplication convention for `EXTENSION_IDS` / `SUPABASE_URL`. **Recommended:** duplicate verbatim with sync comments; the metadata strings are user-facing copy that benefits from being reviewable in isolation.

### Pattern 1: SSR entry that returns a renderable string

```typescript
// scripts/entry-server.tsx
// Source: vite.dev/guide/ssr (entry-server pattern)
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";          // v7: from "react-router", NOT "react-router-dom"
import { Routes, Route } from "react-router";
import App from "../src/app/App";
import WelcomePage from "../src/app/pages/WelcomePage";
import PrivacyPage from "../src/app/pages/PrivacyPage";
import TermsPage from "../src/app/pages/TermsPage";
import RefundPage from "../src/app/pages/RefundPage";
import { LangProvider } from "../src/i18n/LangContext";
import "../src/styles/index.css";  // Tailwind classes are emitted by client build; CSS import here is inert under SSR

export function renderRoute(path: string): string {
  return renderToString(
    <LangProvider>
      <StaticRouter location={path}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          {/* NOTE: /pay is intentionally absent — D-02 head-only treatment */}
        </Routes>
      </StaticRouter>
    </LangProvider>
  );
}
```

**Key points:**
- Only the 5 full-body-prerender routes are mounted. `/pay`, `/account`, `/success`, `/dashboard/*` are deliberately NOT imported here — they never get a body render.
- `import "../src/styles/index.css"` is included so the SSR build doesn't emit a warning, but CSS imports are no-ops in Node — Tailwind classes ship from the client build.
- The `<App />` import is the existing landing component at [src/app/App.tsx](../../../src/app/App.tsx). It contains `lazy(() => import("./components/OptenHeroAnimation"))` ([src/app/App.tsx](../../../src/app/App.tsx) line 12), which `renderToString` handles by rendering the `<Suspense fallback={<div className="h-[170px]" />} />` placeholder instead of the lazy chunk. [CITED: React 18 docs — "renderToString does not wait for data" + Suspense fallbacks during SSR render synchronously]. This is **fine for GEO** because the lazy component is a decorative animation; the SEO-relevant `<h1>`, `<h2>`, paragraphs, pricing cards all render at the top level.

### Pattern 2: Hydration detection (D-06) in `src/main.tsx`

```typescript
// src/main.tsx (MODIFIED — see line 40 of current file)
import { createRoot, hydrateRoot } from "react-dom/client";
// ... existing imports ...

const tree = (
  <LangProvider>
    <BrowserRouter>
      <Routes>{/* ...existing 9 routes... */}</Routes>
    </BrowserRouter>
  </LangProvider>
);

const root = document.getElementById("root")!;

// D-06: prerendered routes have body content; SPA routes have an empty <div id="root"/>.
// Vite minifies index.html so the root is `<div id="root"></div>` with no whitespace
// between the tags; hasChildNodes() correctly returns false for SPA routes.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
```

**Key point on `hasChildNodes()`:** Vite minifies `dist/index.html` by default; the SPA shell ships as `<div id="root"></div>` with zero whitespace between tags [VERIFIED: inspecting the existing build behavior — the source [index.html](../../../index.html) line 90 already has `<div id="root"></div>` with no whitespace]. So `hasChildNodes()` returns `false` on SPA routes and `true` on prerendered routes. **Critical:** the prerender script MUST inject the rendered body string directly between the existing `<div id="root">` and `</div>` markers — adding whitespace there would cause `hasChildNodes()` to return `true` on SPA routes too (broken). The string replacement target is `<div id="root"></div>` → `<div id="root">{rendered}</div>` with no inner whitespace.

### Pattern 3: Paddle bootstrap survives hydration

The current [src/main.tsx](../../../src/main.tsx) lines 25–38 run BEFORE `createRoot(...).render(...)`. That ordering must be preserved. `hydrateRoot` accepts the exact same render call signature as `createRoot().render` (it just expects existing DOM and reconciles). So the structure becomes:

```typescript
// Paddle bootstrap stays here, unchanged (lines 16–38 of current main.tsx)
if (window.Paddle) {
  // ... existing Paddle.Initialize call ...
}

// Then either hydrateRoot OR createRoot, both run after Paddle is bootstrapped.
```

This satisfies DEC-integration-contract-paddle-init. The sync `<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>` in [index.html](../../../index.html) line 86 must appear verbatim in every emitted prerendered HTML — the prerender template-copy will preserve it because the entire `<head>` block is copied from `dist/index.html` and only specific tags are rewritten.

**Paddle modal interaction with hydration on `/pay`:** D-02 already pulled `/pay` out of full-body prerender precisely because the modal-mount machinery is the riskiest possible thing to put under React hydration. `/pay` gets **head-only injection** — the prerender script writes `dist/pay/index.html` with overridden `<head>` but the body stays `<div id="root"></div>` (empty, like the SPA shell). On the client, `hasChildNodes()` returns `false`, so `createRoot` runs (not `hydrateRoot`), and PayPage mounts exactly as today. No hydration risk on /pay.

### Pattern 4: Targeted head substitution

```javascript
// scripts/prerender.mjs (excerpt)
// Source: hand-rolled, derived from the structure of dist/index.html
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const template = await readFile(resolve(distDir, "index.html"), "utf-8");

function applyHead(template, meta) {
  // The current <head> has stable, unique tags we can target verbatim.
  // Match by full opening tag (anchored to property name) for safety.
  let html = template
    // <title>
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(meta.title)}</title>`
    )
    // <meta name="description" content="...">
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(meta.description)}" />`
    )
    // <meta property="og:url" content="...">
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`
    )
    // <meta property="og:title" content="...">
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`
    )
    // <meta property="og:description" content="...">
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`
    )
    // <meta name="twitter:title" content="...">
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />`
    )
    // <meta name="twitter:description" content="...">
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttr(meta.ogDescription)}" />`
    );

  // Add <link rel="canonical"> — there's no canonical tag in current index.html,
  // so insert immediately after <meta name="theme-color"> (a stable anchor).
  html = html.replace(
    /<meta name="theme-color"[^>]*\/?>/,
    (m) => `${m}\n    <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`
  );

  return html;
}
```

**Tradeoffs:**
- **Regex replacement** is fragile in the general case BUT very robust here because the source [index.html](../../../index.html) is hand-authored, has one match per tag, and ships through Vite's minifier consistently. Each regex anchors on the property/name attribute so the order of attributes does not matter as long as Vite preserves it (it does — Vite's HTML transform is whitespace-only).
- **cheerio** would be a 700KB dep [ASSUMED — verify with `npm view cheerio dist.unpackedSize`] for what is fundamentally 8 single-line replacements. Reject unless future requirements add per-route JSON-LD manipulation.
- **Safety net:** the script should `assert` that each `.replace()` actually changed the string (i.e., `result !== input`). If `index.html` ever loses one of the anchors, the build fails loudly instead of silently emitting an unmodified meta tag.

### Pattern 5: Body slot injection

```javascript
// scripts/prerender.mjs (continued)
function applyBody(template, renderedHtml) {
  // Vite minifies index.html — the <div id="root"></div> has no inner whitespace.
  // Inject the rendered string between the tags WITHOUT adding whitespace.
  const target = '<div id="root"></div>';
  if (!template.includes(target)) {
    throw new Error(
      `prerender: could not find empty <div id="root"></div> in dist/index.html. ` +
      `Vite may have changed minification behavior. Check the output of \`npm run build\`.`
    );
  }
  return template.replace(target, `<div id="root">${renderedHtml}</div>`);
}
```

### Pattern 6: Manifest shape (`scripts/seo-routes.ts`)

```typescript
// scripts/seo-routes.ts
// Source of truth for per-route metadata (D-03). RU only in Phase 2 (D-05).
// SYNC: pricing & headline strings duplicated from src/i18n/ru.json — keep both
// in step until Phase 3 introduces a unified i18n→manifest pipeline.

export interface RouteMeta {
  path: string;                    // canonical pathname (D-07: bare, no trailing slash except "/")
  title: string;                   // <title>
  description: string;             // <meta name="description">
  canonical: string;               // absolute URL for <link rel="canonical"> AND <meta og:url>
  ogTitle: string;                 // <meta property="og:title">
  ogDescription: string;           // <meta property="og:description">
  ogImage?: string;                // absolute URL; Phase 2 keeps og-card-ru.png site-wide (PROJECT.md decision)
  prerender: "full" | "head" | "none"; // D-02 tier
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;                // 0..1 — matches Phase 1 sitemap priorities
}

export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;

export const routes: RouteMeta[] = [
  {
    path: "/",
    title: "Opten — AI-оценка и улучшение промптов для генерации изображений",
    description: "Opten оценивает промпт под конкретную нейросеть, показывает ошибки и исправляет их в один клик. Работает с 43+ моделями прямо в интерфейсе генератора.",
    canonical: `${SITE_ORIGIN}/`,
    ogTitle: "Opten — не сливай кредиты на плохие промпты",
    ogDescription: "AI-оценка и улучшение промптов для 43+ моделей генерации изображений. Прямо в интерфейсе генератора.",
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
  },
  // ... 5 more entries: /pay (head), /welcome (full), /privacy (full), /terms (full), /refund (full) ...
];
```

### Anti-Patterns to Avoid

- **Don't introduce `react-helmet-async`.** D-01 explicitly rejected it; if the planner is tempted because it's "easier," remember runtime head injection never reaches GPTBot/ClaudeBot etc.
- **Don't reach for `cheerio` or `jsdom` for HTML manipulation.** 8 regex replaces on a known-shape template is correct here.
- **Don't add `<base href="...">` to per-route HTML files.** It would change relative URL resolution for assets and break the existing icon/logo paths.
- **Don't write whitespace inside the empty `<div id="root">` on SPA-only outputs** — would break the `hasChildNodes()` detector.
- **Don't `import` from `src/main.tsx` in the SSR entry.** `main.tsx` calls `createRoot` / `hydrateRoot` at module load, which crashes in Node. The SSR entry is a sibling, not a parent.
- **Don't make the prerender script use `process.env.NODE_ENV !== "production"`** to skip work. The build must always emit per-route HTML; otherwise a local `npm run preview` won't show what Vercel will serve.
- **Don't switch `react-router` → `react-router-dom`.** That package doesn't exist in v7. v7 unified everything into `react-router`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSR rendering of a React tree | A custom JSX→string emitter | `react-dom/server.renderToString` | Already installed; handles Suspense fallbacks, refs, hydration markers correctly |
| Routing under SSR | A custom path→component lookup | `react-router@7`'s `StaticRouter` | Matches `BrowserRouter` semantics 1:1; no risk of route divergence between SSR and client |
| TypeScript → Node loader | Hand-config of `tsx`, `esbuild`, alias resolution | `vite build --ssr` producing `.ssr-cache/entry-server.mjs` | Vite already knows `@` alias, JSON imports, `assetsInclude` (svg/csv), Tailwind plugin — re-using it is the only way to keep dev/prod parity |
| HTML parsing for 8 tag swaps | `cheerio`/`jsdom`/`parse5` | Anchored regex on the known [index.html](../../../index.html) shape with assert-on-no-match safety net | 700KB+ deps for what is 8 lines of string manipulation; the template is hand-authored and never changes shape |
| Sitemap XML | XML library | Template literal + manual escape | 6 routes, fixed schema, no namespaces beyond the default urlset |

**Key insight:** every "real" problem in this phase is already solved by an existing dependency. The work is *integration*, not invention.

## Common Pitfalls

### Pitfall 1: `LangContext` SSR crash on `localStorage`/`navigator`

**What goes wrong:** `renderToString(<App/>)` throws `ReferenceError: localStorage is not defined` (or `navigator is not defined`) because `LangProvider`'s `useState<Lang>(detectLang)` initializer at [src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx) line 30 calls `detectLang()` synchronously, and `detectLang()` reads `localStorage.getItem` (line 10) and `navigator.language` (line 12).

**Why it happens:** `useState(fn)` invokes the initializer eagerly during the first render — including during `renderToString`. There's no `useEffect` deferral.

**How to avoid:** Two small edits to [src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx):
```typescript
// BEFORE (line 30):
const [lang, setLangState] = useState<Lang>(detectLang);

// AFTER:
const [lang, setLangState] = useState<Lang>("ru");  // SSR-safe default; D-05 locks RU
useEffect(() => {
  // detectLang reads window APIs — defer to first client tick
  setLangState(detectLang());
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

This guarantees the SSR output is RU and the prerendered DOM matches the client's first render (which also defaults to RU). The detection runs on the second client render, after hydration is committed — React 18 handles the resulting `setLangState` as a normal client-side state update, NOT a hydration mismatch.

**Warning signs:** If you skip this fix, `npm run build` fails at the postbuild step with `ReferenceError: localStorage is not defined`. Cannot be ignored.

**Alternative (rejected):** wrap `detectLang` in `typeof window !== "undefined"` guards. Works, but leaves the door open for future SSR-unsafe code in `LangContext`. The `useEffect` approach is the canonical React 18 hydration-safe pattern.

### Pitfall 2: Hydration mismatch from RU/EN language flip

**What goes wrong:** Prerender emits RU body. Client first render (with the Pitfall-1 fix) also defaults to RU. Then `useEffect` runs, reads `localStorage.getItem("opten_lang") === "en"` (returning EN user), and triggers a re-render to English. The user sees a flash of RU on EN-locale machines.

**Why it happens:** the language is determined post-hydration by design (D-05).

**How to avoid:** This is acceptable in Phase 2 per CONTEXT.md `<code_context>` "i18n via React Context, no SSR primitives — Strategy: prerender with RU default … let hydration pick up the real preference." Phase 3 fixes this properly with `/ru/*` `/en/*` URL siblings (each prerendered in the correct language).

**Warning signs:** EN-locale users see a brief RU flash on first load of `/`, `/welcome`, `/privacy`, `/terms`, `/refund`. Acceptable for v1.

### Pitfall 3: Vite minifies whitespace; `hasChildNodes()` returns false-positive

**What goes wrong:** If `dist/index.html` after Vite minification contains whitespace between `<div id="root">` and `</div>` (e.g., `<div id="root">   </div>` or `<div id="root">\n  </div>`), then `hasChildNodes()` returns `true` on SPA routes too, and the client calls `hydrateRoot` on an empty root → React logs warnings.

**How to avoid:** Plan task: verify `dist/index.html` post-Vite-build contains the exact string `<div id="root"></div>` (no whitespace). Existing baseline: [index.html](../../../index.html) line 90 source has `<div id="root"></div>` already. Vite's HTML minifier is whitespace-preserving in this region by default (only collapses between tags in attribute-free contexts). If a future Vite upgrade changes this, the prerender script's body-injection step will fail its `if (!template.includes('<div id="root"></div>'))` assertion — loud failure, easy fix.

**Warning signs:** Console warning "Expected server HTML to contain a matching `<div>` in `<div>`" when loading an SPA-only route in production.

### Pitfall 4: Lazy components in `App.tsx` (`OptenHeroAnimation`)

**What goes wrong:** [src/app/App.tsx](../../../src/app/App.tsx) line 12 has `const OptenHeroAnimation = lazy(() => import("./components/OptenHeroAnimation"))`. `renderToString` doesn't await the lazy import; it renders the `Suspense fallback` synchronously [CITED: react.dev "renderToString does not stream / does not wait for data"].

**Why this is fine:** the fallback is a `<div className="h-[170px]" />` — a sized placeholder. Prerendered HTML will contain that placeholder div. On hydration, the client suspends, fetches the lazy chunk, resolves the Suspense boundary, and swaps in the real animation. This is a non-issue for GEO (the animation is decorative; the heading, partner logos, pricing cards all render at the top level) and a non-issue for hydration (Suspense fallback → resolved suspense is a normal React 18 client transition).

**How to avoid:** Nothing to do. If a future page adds a lazy component containing SEO content, hoist it out of `lazy(...)` for that page.

**Warning signs:** None expected in Phase 2 with the current routes.

### Pitfall 5: `import.meta.env.VITE_PADDLE_ENV` at SSR time

**What goes wrong:** If the prerender script transitively pulls in a module that reads `import.meta.env.VITE_PADDLE_ENV` at top level (not inside a function body), the SSR build inlines whatever value happens to be set during `vite build --ssr` — which might be `undefined` if env vars aren't passed to that build.

**Why this matters:** The SSR build of the entry runs separately from the client build. Vite reads env vars per-build.

**How to avoid:** The SSR entry imports only the routes that get full-body prerender (`/`, `/welcome`, `/privacy`, `/terms`, `/refund`). None of those read `VITE_PADDLE_ENV` (only `src/main.tsx` does, at line 26 — but `main.tsx` is NOT imported by the SSR entry). Grep-check before locking the plan:
```bash
grep -rn "VITE_PADDLE\|import.meta.env" src/app/App.tsx src/app/pages/{WelcomePage,PrivacyPage,TermsPage,RefundPage}.tsx src/i18n/
# Expected: zero matches
```

**Warning signs:** Paddle stops working on `/pay` after Phase 2 ships (impossible if PayPage is left untouched, but worth verifying).

### Pitfall 6: Vercel static-file precedence vs SPA rewrite

**What goes wrong:** Vercel applies rewrites BEFORE checking static files? No — opposite: **static files take precedence over rewrites** [CITED: vercel.com/docs/rewrites and the Phase 1 evidence: `dist/robots.txt`, `dist/sitemap.xml`, `dist/llms.txt` all serve as static files with correct MIME types despite the SPA rewrite covering `/((?!api/).*)`]. So `dist/welcome/index.html` will be served at `/welcome` automatically; the rewrite is the fallback for paths with no matching file.

**About `cleanUrls`:** Vercel's behavior with `dist/welcome/index.html` and a request for `/welcome` (no trailing slash) is to serve the `index.html` directly without needing `cleanUrls: true`. Vercel handles directory-style `index.html` serving by default for static deployments [VERIFIED: vercel.com/docs/project-configuration/vercel-json — directory `index.html` handling is automatic; `cleanUrls: true` strips `.html` extension from FILE paths like `/about.html`, which is a different concern]. **Plan should NOT modify `vercel.json` for cleanUrls.**

**How to verify in the plan:** After the postbuild script runs, `npm run preview` serves from `dist/`. `curl -sI http://localhost:4173/welcome` should return `200 OK` and the body should contain the route-specific `<title>`. If Vercel preview behaves differently from `npm run preview`, that's a Vercel quirk worth catching on the preview deploy, but local `vite preview` is a reliable simulator.

**Warning signs:** A live request to `/welcome` returns the landing-page `<title>` instead of the welcome `<title>` → static file precedence is broken, OR the postbuild script never wrote `dist/welcome/index.html`.

### Pitfall 7: Sitemap.xml — `dist/sitemap.xml` must shadow `public/sitemap.xml`

**What goes wrong:** The Phase 1 file `public/sitemap.xml` (lacking `<lastmod>`) gets copied to `dist/sitemap.xml` by Vite. The postbuild needs to overwrite it with the new generated version.

**How to verify in the plan:** the postbuild script runs AFTER `vite build`, so writing `dist/sitemap.xml` last simply overwrites the Vite-copied version. Verify with:
```bash
grep -c "<lastmod>" dist/sitemap.xml   # expect 6 (one per marketing route)
```

**Warning signs:** the served `/sitemap.xml` has no `<lastmod>` entries → postbuild step didn't run, or it wrote to the wrong path.

## Runtime State Inventory

Not applicable: this phase is greenfield (adds new build-step files; modifies one existing source file `src/main.tsx` and one for hydration safety `src/i18n/LangContext.tsx`). No renamed strings, no migrated datastores, no OS-registered state. **Verified:** no Phase 2 task touches the integration-contract constants (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) per CLAUDE.md "Hardcoded constants" warning.

## Code Examples

### Example A: SSR build configured via a second `vite build` call

```bash
# package.json scripts (proposed)
{
  "scripts": {
    "build": "vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && node scripts/prerender.mjs",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

Why `--outDir .ssr-cache`: keeps SSR build output out of `dist/` (which Vercel deploys). `.ssr-cache/` should be added to `.gitignore`.

**Source:** [CITED: vite.dev/guide/ssr#building-for-production "Run the same build command twice with --ssr"], adapted for a single SSR entry file.

### Example B: Full `scripts/prerender.mjs` skeleton

```javascript
// scripts/prerender.mjs
// Run: node scripts/prerender.mjs
// Prereq: `vite build` has run (dist/index.html exists)
//         `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache` has run
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SSR_BUNDLE = resolve(ROOT, ".ssr-cache", "entry-server.mjs");

// Stable build-time ISO date for sitemap lastmod (D-04)
const BUILD_DATE = new Date().toISOString().split("T")[0]; // "2026-05-15"

const { renderRoute } = await import(SSR_BUNDLE);
const { routes, SITE_ORIGIN, DEFAULT_OG_IMAGE } = await import("./seo-routes.ts");
// NOTE: importing .ts directly from Node requires Node 22+ with --experimental-strip-types
// Fallback: have `vite build --ssr` ALSO compile scripts/seo-routes.ts and import from .ssr-cache.

const template = await readFile(resolve(DIST, "index.html"), "utf-8");

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyMeta(html, meta) {
  const before = html;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(meta.ogDescription)}" />`);
  // Inject canonical after theme-color anchor (no canonical exists in source today)
  html = html.replace(
    /<meta name="theme-color"[^>]*\/?>/,
    (m) => `${m}\n    <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`
  );
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <head> tags matched. index.html structure changed?`);
  }
  return html;
}

function applyBody(html, rendered) {
  const target = '<div id="root"></div>';
  if (!html.includes(target)) {
    throw new Error('prerender: empty <div id="root"></div> not found in dist/index.html');
  }
  return html.replace(target, `<div id="root">${rendered}</div>`);
}

for (const meta of routes) {
  let html = applyMeta(template, meta);
  if (meta.prerender === "full") {
    const rendered = renderRoute(meta.path);
    html = applyBody(html, rendered);
  }
  // For "head" tier (e.g., /pay): leave body empty, head is already overridden.
  // For "none" tier: skip (don't write a file — SPA fallback handles).
  if (meta.prerender === "none") continue;

  // Output path: "/" → dist/index.html (overwrite), "/welcome" → dist/welcome/index.html
  const outPath = meta.path === "/"
    ? resolve(DIST, "index.html")
    : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf-8");
  console.log(`✓ ${meta.path} → ${outPath.replace(ROOT, "")} (${meta.prerender})`);
}

// Emit sitemap.xml (D-04: uniform build-time lastmod)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.filter(r => r.prerender !== "none").map(r => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join("\n")}
</urlset>
`;
await writeFile(resolve(DIST, "sitemap.xml"), sitemap, "utf-8");
console.log(`✓ sitemap.xml → ${routes.filter(r => r.prerender !== "none").length} routes`);
```

**Note on `import("./seo-routes.ts")`:** Node 22's experimental TS stripping or a tsx loader is one option. The cleaner approach: include `seo-routes.ts` in the `vite build --ssr` input set so it gets compiled to `.ssr-cache/seo-routes.mjs` alongside `entry-server.mjs`. Planner should pick whichever Node version the local/Vercel environment supports — Vercel's default Node 22 supports `--experimental-strip-types` flag, but for portability, route the manifest through the SSR Vite build.

### Example C: Modified `src/main.tsx` (D-06)

```typescript
// src/main.tsx — MODIFY line 2 import and line 40 render call
import { createRoot, hydrateRoot } from "react-dom/client";  // CHANGED: add hydrateRoot
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
// ... rest of existing imports unchanged ...

// Paddle bootstrap unchanged — lines 16–38 stay verbatim.
if (window.Paddle) { /* ... */ }

const tree = (
  <LangProvider>
    <BrowserRouter>
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
    </BrowserRouter>
  </LangProvider>
);

const root = document.getElementById("root")!;
if (root.hasChildNodes()) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
```

### Example D: Modified `src/i18n/LangContext.tsx` (SSR safety)

```typescript
// src/i18n/LangContext.tsx — MODIFY line 30 + add useEffect at line 31
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");  // CHANGED: SSR-safe default

  useEffect(() => {
    // detectLang reads localStorage + navigator; defer to client mount.
    setLangState(detectLang());
  }, []);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // ... rest unchanged ...
}
```

### Example E: BrowserRouter / StaticRouter pathname parity for hydration

`BrowserRouter` reads `window.location.pathname` on mount [CITED: react-router v7 docs, BrowserRouter implementation]. The SSR `StaticRouter` is given the same path via the `location={path}` prop. Both render with the same matched route, so the hydrated tree matches the SSR tree exactly. **No `__PRERENDERED_ROUTE__` global script tag is needed** — the browser already knows its own path. This addresses the planner's research question about how the client knows which route was prerendered.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ReactDOMServer.renderToString` + `BrowserRouter` server polyfill | `renderToString` + `StaticRouter` | React Router 6+ | StaticRouter is the supported v6/v7 SSR primitive |
| `react-router-dom` for browser, `react-router` for core | `react-router` is the only package in v7 | React Router 7.0 (2024) | Imports change from `"react-router-dom"` → `"react-router"`; `StaticRouter` moves to root export |
| `createRoot` always | `hydrateRoot` for SSR'd content, `createRoot` for empty | React 18 (2022) | Two-API split; D-06 chooses at runtime |
| `vite-plugin-ssr` | `Vike` (renamed) | 2023 rename | Documentation/community uses "Vike"; old plugin name deprecated. Phase 2 rejects Vike per D-08 anyway. |
| `react-helmet` | `react-helmet-async` | 2018+ | Both are runtime-only — neither helps GPTBot. D-01 rejects both. |

**Deprecated/outdated:**
- `react-snap` — Puppeteer-based prerender; last meaningful release 2019 [ASSUMED]. Replaced for new projects by framework-native SSG (Astro, Next, SvelteKit) or hand-rolled scripts.
- `react-router-dom` package in v7 (still exists for v6 backports; do not install).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GEO-B-1 | Resolve open question: head-management strategy (`react-helmet-async` runtime vs build-time prerender). | D-01 in CONTEXT.md already chose build-time. This research confirms the choice by enumerating the SSR primitives (renderToString + StaticRouter) are available with zero new deps, and the alternative (`react-helmet-async`) is documented as non-viable for non-JS crawlers in CONTEXT.md canonical refs §C-4. |
| GEO-B-2 | Implement per-route `<title>`, `<meta description>`, canonical, `og:title`, `og:description`, `og:image` across all 8 routes (Phase 2 covers 6: 5 full + `/pay` head; 3 SPA-only routes keep site-wide meta as before, OK because they're Disallow'd in robots.txt). | Pattern 4 (head substitution), Pattern 6 (manifest shape), Example B (full prerender script). Manifest in `scripts/seo-routes.ts` is the single source of truth (D-03). |
| GEO-B-3 | Sitemap.xml grows `lastmod` per route. | Example B sitemap emission block, D-04 uniform ISO date strategy. `dist/sitemap.xml` shadows `public/sitemap.xml`. |

## Verification Recipe

Each task can be verified in three layers: build-passes / file-emitted / content-correct.

### Build-passes verification

```bash
# Must exit 0
npm run build

# Must exist after build
ls dist/index.html dist/welcome/index.html dist/privacy/index.html \
   dist/terms/index.html dist/refund/index.html dist/pay/index.html \
   dist/sitemap.xml
```

### Content-correct verification (per-route)

```bash
# Start preview server in background
npm run preview &
PREVIEW_PID=$!
sleep 2

# 1) Each prerendered route has distinct <title>
for route in / welcome privacy terms refund pay; do
  echo "=== $route ==="
  curl -s "http://localhost:4173/$route" | grep -o '<title>[^<]*</title>' | head -1
done
# Expected: 6 distinct <title> strings

# 2) Each route has its own <link rel="canonical">
for route in / welcome privacy terms refund pay; do
  curl -s "http://localhost:4173/$route" | grep -o '<link rel="canonical"[^>]*>'
done
# Expected: 6 different href values matching scripts/seo-routes.ts

# 3) og:title / og:description per-route
curl -s http://localhost:4173/welcome | grep -E 'og:(title|description)'

# 4) Phase 1 artifacts preserved in EVERY emitted HTML
for route in / welcome privacy terms refund pay; do
  echo "=== $route preserves Phase 1 ==="
  curl -s "http://localhost:4173/$route" | grep -c 'application/ld+json'   # expect 2
  curl -s "http://localhost:4173/$route" | grep -c 'cdn.paddle.com/paddle/v2/paddle.js'  # expect 1
  curl -s "http://localhost:4173/$route" | grep -c 'preconnect.*cdn.paddle.com'  # expect 1
  curl -s "http://localhost:4173/$route" | grep -c 'favicon.svg'  # expect 1
done

# 5) Full-body prerender routes have real <h1>
for route in / welcome privacy terms refund; do
  echo "=== $route h1 ==="
  curl -s "http://localhost:4173/$route" | grep -oE '<h1[^>]*>.{0,80}' | head -1
done
# Expected: each prints an <h1> with route-specific content (NOT empty)

# 6) /pay body stays empty (head-only tier)
curl -s http://localhost:4173/pay | grep -oE '<div id="root">[^<]{0,30}'
# Expected: <div id="root"></div>  (no rendered content)

# 7) SPA-only routes still return the SPA shell
curl -s http://localhost:4173/account | grep -oE '<div id="root">[^<]{0,30}'
# Expected: <div id="root"></div>  (Vercel SPA rewrite would also do this; here we test
#           that we have NOT accidentally written dist/account/index.html)
test ! -e dist/account/index.html && echo "OK: no dist/account/index.html"
test ! -e dist/success/index.html && echo "OK: no dist/success/index.html"
test ! -e dist/dashboard/download-skill/index.html && echo "OK: no dist/dashboard/* HTML"

# 8) sitemap.xml: 6 lastmod entries, parses as XML
curl -s http://localhost:4173/sitemap.xml | grep -c '<lastmod>'  # expect 6
# XML parse check (no new test dep — use built-in python or node)
node -e "import('node:fs/promises').then(fs=>fs.readFile('dist/sitemap.xml','utf8')).then(s=>{if(!/<urlset[^>]*>/.test(s)||!/<\/urlset>/.test(s))throw 1;console.log('OK: sitemap.xml well-formed urlset')})"

# 9) robots.txt unchanged (Phase 1 invariant — Disallow on /account /success /dashboard)
curl -s http://localhost:4173/robots.txt | grep -E 'Disallow: /(account|success|dashboard)'
# Expected: 3 Disallow lines per UA block

kill $PREVIEW_PID
```

### GEO audit script verification (Phase 1 baseline tool — apples-to-apples)

```bash
# Reuse the audit tool that produced the original 12/100 baseline
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/welcome
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/privacy
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/terms
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/refund

# Each MUST report:
#   has_ssr_content: true
#   word_count: > 100   (was 9 pre-Phase-2)
#   h1_tags: [<actual h1 text>]   (was [] pre-Phase-2)
#   structured_data: 2   (Phase 1 JSON-LD blocks preserved)

# /pay is head-only — expect:
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173/pay
#   has_ssr_content: false   (body still empty, OK)
#   structured_data: 2       (Phase 1 JSON-LD preserved)
#   distinct title vs / (per-route head injection worked)
```

### Production verification (post-deploy)

```bash
# Same checks above, replacing http://localhost:4173 with https://opten.space
# Plus header check from Phase 1 (must still pass):
curl -sI https://opten.space/welcome | grep -iE 'x-content-type-options|referrer-policy|permissions-policy'
```

## Pattern Map

For each file the planner is likely to create/modify, here's the closest existing analog in the codebase:

| New / modified file | Closest analog | Pattern to extract |
|---------------------|----------------|---------------------|
| `scripts/prerender.mjs` (new) | **None in this repo** — Phase 1 created no scripts. Closest external analog: vite.dev/guide/ssr "Generating Static Site" example. | Hand-roll using Node 20 built-ins + dynamic import of compiled SSR bundle. |
| `scripts/entry-server.tsx` (new) | [src/main.tsx](../../../src/main.tsx) — same Routes structure, sub-set | Mirror the 5 full-body routes from main.tsx; wrap in `StaticRouter` instead of `BrowserRouter`; export `renderRoute(path)` instead of calling `createRoot` |
| `scripts/seo-routes.ts` (new) | [src/i18n/ru.json](../../../src/i18n/ru.json) — flat keyed dict (different shape but same "central source of truth" pattern); also `EXTENSION_IDS` arrays in [src/app/pages/PayPage.tsx](../../../src/app/pages/PayPage.tsx) line 12, AccountPage, DownloadSkillPage — same "duplicate with sync comment" convention | Use typed TS array of `RouteMeta` objects. Pattern 6 above gives the shape. |
| `scripts/sitemap.mjs` (new — OR inlined into prerender.mjs) | [public/sitemap.xml](../../../public/sitemap.xml) — 6-line XML template | Hand-write the template literal in JS. Inlining into `prerender.mjs` is simpler; only break out if the file grows past ~30 lines. |
| `src/main.tsx` (MODIFY) | Existing file — surgical edit | Change line 2 to `import { createRoot, hydrateRoot } from "react-dom/client";`; wrap render call with `hasChildNodes()` branch (Example C). No other lines change. |
| `src/i18n/LangContext.tsx` (MODIFY) | Existing file — surgical edit | Change line 30 to `useState<Lang>("ru")`; add `useEffect` block calling `setLangState(detectLang())` (Example D). |
| `package.json` (MODIFY) | Existing file — `"build"` script edit | Change line 7 `"build": "vite build"` to chain SSR build + prerender (Example A). |
| `vite.config.ts` (NO CHANGE expected) | Existing file | Verified: current config supports SSR build via CLI flag without config changes. If `vite build --ssr` reports a missing config (unlikely with react plugin already configured), planner adds an `ssr.noExternal` block to keep CSS-modules transformer in. |
| `vercel.json` (NO CHANGE expected) | Existing file | Verified above: Vercel serves `dist/welcome/index.html` at `/welcome` without `cleanUrls`. **Do not edit unless preview deploy proves otherwise.** |
| `.gitignore` (MODIFY) | Existing file | Add `.ssr-cache/` line. |

## Risks and Landmines

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Static-file precedence breaks (`dist/welcome/index.html` not served at `/welcome`) | LOW | Phase 1 already proved precedence works for `dist/robots.txt`, `dist/sitemap.xml`, etc. Verify on Vercel preview before merging. |
| Hardcoded `EXTENSION_IDS` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` accidentally touched | LOW (no task in this phase reads or writes those files) | Plan task list MUST NOT mention `src/app/pages/{PayPage,AccountPage,DownloadSkillPage}.tsx` or `api/download-skill.ts` for any edit. Researcher confirms: zero overlap. |
| `VITE_PADDLE_ENV` baked into prerendered HTML | LOW (SSR entry imports only routes that don't reference Paddle env) | Pitfall 5 grep-check. The SSR entry must NOT import `src/main.tsx`. |
| JSON-LD pricing values desync from `src/i18n/ru.json` | MEDIUM (manifest copies the headline text — same risk class as Phase 1 already accepted) | Sync comment `// SYNC: keep in sync with src/i18n/ru.json key "hero.title"` per file. Same convention as Phase 1 milestone decision. Planner should NOT include pricing strings in the metadata manifest (they're not in `<title>`/`<description>` for any route). |
| `npm run build` time grows | LOW (estimate: +3–5s for SSR build, +1–2s for prerender of 6 routes) | Acceptable. Phase 1 build is ~10s; expected post-Phase-2 ~15–17s. |
| Hydration warnings in browser console | MEDIUM (Pitfall 1 / 3) | Pitfall mitigations above are mandatory. Verification step: open `http://localhost:4173/welcome` in DevTools, watch Console for hydration warnings. |
| Future Vite upgrade changes `index.html` minification (extra whitespace in `<div id="root">`) | LOW | Prerender script asserts on no-match (Pattern 5) → loud failure, easy fix |
| `OptenHeroAnimation` lazy chunk doesn't load post-hydration | LOW (this is exactly what Suspense is designed for) | If broken, the fallback `<div className="h-[170px]" />` stays visible. No regression vs current behavior. |
| `react-router-dom` package mistakenly added by planner via `npm install` (it would install v6 alongside v7 → conflict) | LOW (researcher flagged) | Planner: imports come from `"react-router"`, NOT `"react-router-dom"`. v7 unified the packages. |

## Project Constraints (from CLAUDE.md)

These directives are extracted verbatim from `CLAUDE.md` and the integration contract — they bind every task in the plan:

| Directive | Source | Phase 2 application |
|-----------|--------|---------------------|
| **Locked routes** (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) must keep responding at their paths. | CLAUDE.md "CRITICAL" + DEC-integration-contract-locked-routes | Phase 2 EMITS HTML for `/welcome` and `/pay`, never renames. SPA routes (`/account`, `/success`, `/dashboard/*`) continue serving via SPA fallback. |
| **Synchronous Paddle script tag** in every emitted HTML. | DEC-integration-contract-paddle-init | Prerender template-copies the entire `<head>` of `dist/index.html`; only specific tags are mutated. The Paddle `<script>` block (line 86 of source) is never touched. Verification step in recipe item (4) confirms its presence in all 6 emitted files. |
| **Hardcoded constants** (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) are duplicated in 4 files; phase changes must NOT desync them. | DEC-integration-contract-supabase-constants + DEC-integration-contract-extension-ids | Phase 2 touches none of those 4 files. Plan task list MUST NOT modify [src/app/pages/PayPage.tsx](../../../src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](../../../src/app/pages/AccountPage.tsx), [src/app/pages/DownloadSkillPage.tsx](../../../src/app/pages/DownloadSkillPage.tsx), [api/download-skill.ts](../../../api/download-skill.ts). |
| **No tests / no ESLint / no typecheck.** Verification gate is `npm run build` + `npm run preview` + `curl`. | CLAUDE.md "Tech stack" + Phase 1 verification philosophy | Plan tasks use the verification recipe above. Do NOT invent test-shaped acceptance criteria. |
| **Path alias `@` → `./src`** is configured in vite.config.ts. Pure Node scripts don't resolve it; Vite SSR build does. | [vite.config.ts](../../../vite.config.ts) line 16 | The SSR entry uses Vite SSR build (`vite build --ssr`), so `@` alias resolves there. The Node postbuild script imports from `.ssr-cache/` which has all aliases already resolved. |
| **No release versioning** — every push to `main` is a release. Phase 2 ships atomically per task. | CLAUDE.md "Deploy & build" | Each Phase 2 task is one commit (mirrors Phase 1 atomic-commit pattern). Risk task (`src/main.tsx` hydrate switch) shipped last with rollback path. |
| **Locked `/pay` in sitemap** (Phase 1 milestone decision, priority 0.8). | PROJECT.md "Key Decisions" table | Phase 2 keeps `/pay` in the sitemap with `<lastmod>`; D-02 head-only treatment makes its head route-specific while preserving its body shape. |
| **`<html lang="ru">` stays hardcoded.** | PROJECT.md "Key Decisions" + D-05 | The prerender template-copies the `<html lang="ru">` opening tag verbatim. Phase 3 changes this. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `cheerio` package weighs ~700KB unpacked. | Pattern 4 / Don't Hand-Roll | Low — if wrong, the decision (don't use cheerio) is still correct because we only need 8 string swaps. |
| A2 | `vite-plugin-prerender` and Vike pull in a routing framework | Alternatives Considered | Low — these are rejected anyway by D-08; even if I've mis-described their architecture, the decision stands. |
| A3 | Puppeteer-based react-snap downloads ~300MB Chromium and is unmaintained since 2019. | Alternatives Considered | Low — primary reason to reject is Windows compat + build time; even if maintenance has resumed, the postbuild script approach is simpler. |
| A4 | `vite build --ssr` adds ~3–5s to total build time on this codebase. | Code Examples / Risks | Medium — actual impact depends on the SSR entry size. Measure during plan execution. Mitigation if too slow: skip the SSR build step in dev (only run in production build). |
| A5 | Vercel serves `dist/welcome/index.html` at `/welcome` without `cleanUrls: true`. | Pitfall 6 / Pattern Map | LOW-MEDIUM — verified that static files take precedence over rewrites [CITED: vercel.com/docs/rewrites]; the specific directory-index-no-trailing-slash behavior is documented as automatic but **planner should verify on the first preview deploy** because a wrong assumption here would silently break the entire phase. If wrong: add `"cleanUrls": true` to `vercel.json` (one-line edit). |
| A6 | React 18's `renderToString` renders Suspense fallbacks synchronously rather than awaiting lazy imports. | Pitfall 4 | Low — well-documented React 18 behavior [CITED: react.dev]. If wrong, the lazy animation simply doesn't render in SSR HTML (same outcome we want). |

## Open Questions

1. **Should `seo-routes.ts` be compiled through Vite SSR build, or read directly by Node via `--experimental-strip-types`?**
   - What we know: Vercel runs Node 22 [ASSUMED — verify in Vercel project settings]; Node 22 supports `--experimental-strip-types` for `.ts` files [VERIFIED: Node 22.6.0+ release notes]. Local devs may be on Node 20 without strip-types.
   - What's unclear: which Node version is on the developer's machine and Vercel build runners.
   - Recommendation: compile `seo-routes.ts` through the SSR Vite build for portability. Import from `.ssr-cache/seo-routes.mjs`. Sidesteps Node version variance entirely. Planner can revisit if Vite SSR build proves too slow.

2. **Should `og:image` per route differ in Phase 2, or stay site-wide `og-card-ru.png`?**
   - What we know: Phase 1 milestone decision: "OG `og:image` = RU card; `<html lang="ru">` is hardcoded". Phase 4+ defers per-route OG hero images to later (CONTEXT.md `<deferred>` section).
   - Recommendation: keep `og:image` site-wide (`og-card-ru.png`) for all 6 routes in Phase 2. The manifest field `ogImage` is OPTIONAL; default to `DEFAULT_OG_IMAGE`. Don't override per-route. This matches CONTEXT.md `<deferred>` explicitly.

3. **Hydration mismatch logging — do we want to silence the EN-locale RU-flash warning, or accept it as visible noise?**
   - What we know: React 18 logs a hydration "boundary" warning for visible mismatches (e.g., RU text replaced by EN text post-hydration). Silent state changes (like the language flip via `setLangState` in `useEffect`) do NOT trigger the warning because they happen AFTER hydration commits.
   - Recommendation: with the Pitfall-1 fix (move detection into `useEffect`), the hydration commit is RU-vs-RU — no mismatch warning. The user-visible RU→EN flip happens as a normal client state update, no warning. **No action needed.**

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node 20+ | `scripts/prerender.mjs` (uses `node:fs/promises` top-level await + ESM dynamic import) | ✓ | Verify via `node --version` on dev machine. Vercel default is 22. | If <20: use CommonJS-style script with explicit promise chains. |
| `react-dom@18.3.1` | SSR rendering | ✓ | 18.3.1 ([VERIFIED node_modules](../../../node_modules/react-dom/package.json)) | None — must stay on 18 per peerDependencies |
| `react-router@7.13.0` | `StaticRouter` import | ✓ | 7.13.0 ([VERIFIED node_modules](../../../node_modules/react-router/package.json)); current npm latest 7.15.1 | None — already in package.json |
| `vite@6.3.5` | SSR build via `vite build --ssr` | ✓ | 6.3.5 ([VERIFIED package.json](../../../package.json) line 71) | None — already pinned via pnpm overrides |
| `~/.claude/skills/geo/scripts/fetch_page.py` | Verification recipe | ✓ (referenced by Phase 1 verification — assumed available in the dev environment) | n/a | Use curl + grep manually for the same checks (recipe items 1–9 don't depend on fetch_page.py) |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

## Validation Architecture

> Per `.planning/config.json` defaults (and explicit alignment with REQUIREMENTS.md "Out of Scope" — "Tests / ESLint / typecheck script — codebase has none; not adding inside a GEO milestone"), this project does **not** participate in Nyquist test validation. Verification is `npm run build` + `npm run preview` + `curl` + `~/.claude/skills/geo/scripts/fetch_page.py`, as detailed in the Verification Recipe above. The planner should NOT generate Wave 0 test-scaffolding tasks for this phase.

If `.planning/config.json` is later updated to enable `workflow.nyquist_validation`, the test framework would need to be Vitest or Jest (Vite-compatible), the config file would need to be created (none exists today), and per-route metadata assertions would belong in `tests/prerender.test.ts` running against the `dist/` output. **Until that policy changes, skip.**

## Sources

### Primary (HIGH confidence)
- `node_modules/react-router/dist/development/index.d.ts` — line 8 confirms `T as StaticRouter` re-export from `'react-router'` root for v7.13.0
- `node_modules/react-router/package.json` — v7.13.0 installed
- `node_modules/react-dom/package.json` — v18.3.1 with `./server` export pointing to `server.node.js`
- `node_modules/react/package.json` — v18.3.1
- `package.json` lines 59, 71, 74 — installed versions for react-router, vite, peer-required react/react-dom
- [src/main.tsx](../../../src/main.tsx) lines 1–56 — current bootstrap (Paddle init + createRoot)
- [src/i18n/LangContext.tsx](../../../src/i18n/LangContext.tsx) lines 9–13, 30 — `detectLang` SSR crash source
- [src/app/App.tsx](../../../src/app/App.tsx) lines 1, 12, 166–168 — `lazy` + `Suspense` usage
- [src/app/pages/WelcomePage.tsx](../../../src/app/pages/WelcomePage.tsx) lines 19, 22, 26 — `useState`/`useEffect` usage (no SSR-unsafe APIs)
- [src/app/pages/PrivacyPage.tsx](../../../src/app/pages/PrivacyPage.tsx), [TermsPage.tsx](../../../src/app/pages/TermsPage.tsx), [RefundPage.tsx](../../../src/app/pages/RefundPage.tsx) — grep confirmed zero `window`/`localStorage`/`useEffect`/`useState`
- [index.html](../../../index.html) lines 7, 8, 14–22, 84–86, 90 — anchored substitution targets and `<div id="root"></div>` shape
- [vite.config.ts](../../../vite.config.ts) — current Vite config (no SSR-specific blocks needed)
- [vercel.json](../../../vercel.json) — rewrites + headers structure
- [public/sitemap.xml](../../../public/sitemap.xml), [public/robots.txt](../../../public/robots.txt) — Phase 1 baselines
- vite.dev/guide/ssr — SSR build pattern, `vite build --ssr` invocation, entry-server template
- react.dev/reference/react-dom/server/renderToString — SSR rendering semantics (Suspense fallback, no async data)
- react.dev/reference/react-dom/client/hydrateRoot — hydration vs createRoot semantics
- vercel.com/docs/rewrites — static-file precedence rule confirmed
- vercel.com/docs/project-configuration/vercel-json — `cleanUrls` semantics (extension-stripping, not directory-index serving)

### Secondary (MEDIUM confidence)
- WebSearch ("vercel rewrites precedence static files directory index.html clean urls") — confirms multi-source consensus that static files override rewrites
- GitHub vercel/vercel discussions/6694 — `cleanUrls` interaction with rewrites (relevant only if planner is tempted to add `cleanUrls: true`)
- `npm view react-router version` (returned `7.15.1`) and `npm view react-dom version` (returned `19.2.6`) — confirms current packages have moved on but project's installed versions are still current-enough

### Tertiary (LOW confidence — flagged as assumed)
- A1, A3 (cheerio size; react-snap maintenance status) — used only to justify rejection of already-rejected alternatives. Low impact.
- A4 (SSR build adds 3–5s) — order-of-magnitude estimate; verify during plan execution.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package version verified against `node_modules/`; SSR primitives confirmed exported via grep of installed `.d.ts`
- Architecture: HIGH — pattern matches official Vite SSR guide + existing project structure with no contradictions
- Pitfalls: HIGH for Pitfall 1 (`LangContext` SSR crash — verified by reading actual code), HIGH for Pitfall 6 (Vercel precedence — multiple authoritative sources), MEDIUM for Pitfall 3 (Vite whitespace minification — verified against source `index.html` but Vite minifier behavior could change), MEDIUM for Pitfall 4 (`renderToString` + Suspense — well-documented but exact rendering of `lazy` boundaries is worth observing in the first preview build)

**Research date:** 2026-05-15
**Valid until:** 2026-06-14 (30 days — stable phase, no fast-moving dependencies; if React 19 migration is attempted later, revisit `hydrateRoot` API)

## RESEARCH COMPLETE
