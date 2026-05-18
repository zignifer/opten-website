# Technology Stack

**Analysis Date:** 2026-05-18

## Languages

**Primary:**
- TypeScript (transpiled via Vite) — `src/**/*.{ts,tsx}`, `api/download-skill.ts`, `scripts/{entry-server.tsx,seo-routes.ts}`
- JavaScript (ESM `.mjs`) — build scripts (`scripts/prerender.mjs`, `scripts/sitemap.mjs`, `scripts/llms.mjs`, `scripts/verify-faq-mainentity.mjs`, `scripts/indexnow.mjs`, `scripts/smoke-blog.mjs`, `scripts/mock-vercel-server.mjs`)

**Secondary:**
- JSON — i18n dicts `src/i18n/{ru,en}.json`
- HTML — `index.html` template + prerendered routes

## Runtime

**Environment:**
- Browser: ES module bundle from Vite 6 (SPA with SSR-prerendered routes)
- Vercel serverless (Node.js): single function `api/download-skill.ts` using `IncomingMessage`/`ServerResponse` signature
- Node.js (build-time only): SSR for prerender via `scripts/entry-server.tsx`, route metadata via `scripts/seo-routes.ts`
- No `engines` field in `package.json`; no `.nvmrc`

**Package Manager:**
- npm (primary) — `package-lock.json` committed
- `pnpm.overrides: { vite: "6.3.5" }` in `package.json` (suggests pnpm compatibility)

## Frameworks

**Core:**
- Vite 6.3.5 (pinned via `pnpm.overrides`) — bundler (`npm run dev` dev server, `npm run build` production build)
- @vitejs/plugin-react 4.7.0 — React fast refresh
- @tailwindcss/vite 4.1.12 — Tailwind CSS integration (required by Figma Make export origin; do not remove)
- React 18.3.1 (peerDependency, optional in `package.json`) — UI layer
- react-dom 18.3.1 (peerDependency) — React rendering
- React Router 7.13.0 — client-side routing (import from `"react-router"`, NOT `"react-router-dom"`)

**Styling:**
- Tailwind CSS 4.1.12 via @tailwindcss/vite (no separate PostCSS config; `postcss.config.mjs` is empty)
- tw-animate-css 1.3.8 — animation utilities

**UI Component Libraries:**
- Radix UI ~25 primitives (accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toggle, toggle-group, tooltip) — headless behavior, styled via Tailwind
- MUI (Material-UI) 7.3.5 + @mui/icons-material 7.3.5 — selective use for icon glyphs and styles
- Lucide React 0.487.0 — lighter icon alternative
- motion 12.23.24 — scroll-reveal animations (Framer Motion successor)
- embla-carousel-react 8.6.0 — carousel component
- react-slick 0.31.0 — second carousel library (consolidation candidate)
- sonner 2.0.3 — toast notifications
- canvas-confetti 1.9.4 — confetti effect

**Forms:**
- react-hook-form 7.55.0 — form state and validation

**Other UI/Data:**
- recharts 2.15.2 — charting (status: unclear if actively used; potential dead weight)
- react-day-picker 8.10.1 — date picker component
- input-otp 1.4.2 — OTP input
- next-themes 0.4.6 — theme management (status: unknown why in SPA)

**Drag-and-drop & Layout:**
- react-dnd 16.0.1, react-dnd-html5-backend 16.0.1 — drag-and-drop
- react-responsive-masonry 2.7.1 — masonry layout
- react-resizable-panels 2.1.7 — resizable panel UI
- vaul 1.1.2 — drawer component

**Utility Libraries:**
- clsx 2.1.1, class-variance-authority 0.7.1 — classname/variant utilities
- tailwind-merge 3.2.0 — merge Tailwind class conflicts
- date-fns 3.6.0 — date formatting
- cmdk 1.1.1 — command palette
- react-popper 2.3.0, @popperjs/core 2.11.8 — positioning engine

**CSS-in-JS (dependency of MUI):**
- @emotion/react 11.14.0, @emotion/styled 11.14.1

**Build & Image Tools:**
- vite-imagetools 6.2.9 — image optimization via query-string transforms (`?w=...&format=webp;png&as=picture`); configured with `exclude: ''` to process `public/` files
- sharp 0.34.5 — image resizing (used in build scripts via imagetools)
- rollup-plugin-visualizer 7.0.1 — bundle analysis
- supabase 2.98.2 (devDependency) — Supabase CLI (for linked `opten-seo` project, not this repo's deployment)

**Notably Absent:**
- No `@supabase/supabase-js` — Supabase access is plain `fetch` to REST/Functions endpoints
- No test runner (Vitest, Jest, Mocha)
- No ESLint, Prettier, or other formatters
- No TypeScript compiler (`tsc`) in scripts

## Payment Gateway

**Paddle.js v2:**
- Loaded from CDN `https://cdn.paddle.com/paddle/v2/paddle.js`
- Synchronously injected into prerendered `/pay/index.html` and `/en/pay/index.html` via `scripts/prerender.mjs` (Phase 2.2 + Phase 3 D-03b optimization)
- Lazily loaded on SPA-navigation via `src/lib/paddle.ts:ensurePaddle()` (other routes)
- Initialization: `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })`
- Environment: `Paddle.Environment.set("sandbox")` only when `VITE_PADDLE_ENV === "sandbox"` (Phase 67 fix: do NOT call for production)
- Types: `src/types/paddle.d.ts` augments `window.Paddle`

## Internationalization (Custom, No i18next)

**Implementation:**
- `src/i18n/LangContext.tsx` — React Context (must be INSIDE BrowserRouter because it uses `useLocation()`)
- `src/i18n/ru.json` (~68 KB) — Russian translations (statically imported, always available)
- `src/i18n/en.json` (~41 KB, lazy-loaded on client) — English translations (dynamic import to save ~13 KB gzip on RU visits)
- `src/i18n/paths.ts` — `EN_SIBLINGS` constant defining 6 prerendered EN-prefix routes + siblings

**Detection order:**
1. URL prefix `/en/*`
2. `localStorage.opten_lang_v3` (explicit user choice, written by LangSwitcher only)
3. Legacy `localStorage.opten_lang === "en"` (one-shot migration; RU values ignored)
4. `navigator.language`

**Components:**
- `<LocalizedLink>` — internal navigation primitive that preserves `/en/` prefix on EN routes
- `LangSwitcher` — flips language in storage + context, navigates to EN sibling or stays in place

**Prerendered HTML:**
- `<html lang>` baked at prerender time per `scripts/prerender.mjs`, not mutated at runtime
- `hreflang` triplets (ru, en, x-default) injected into every prerendered `<head>`

## Backend Integration

**API Client:**
- Plain `fetch` (no `@supabase/supabase-js` SDK) to Supabase REST and Edge Functions

**Supabase Configuration (hardcoded in 3 site files + extension repo):**
- `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"`
- `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"`

**Hardcoded Extension IDs (duplicated in 3 files):**
- `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl", "kcmcaeenfmfnpiaihicecnfnagejpcog"]` (Chrome Web Store + unpacked dev)

## Configuration Files

**Vite (`vite.config.ts`):**
- Plugins: `react()`, `tailwindcss()`, `imagetools({ exclude: '' })`
- Alias: `@ → ./src`
- Asset includes: `**/*.svg`, `**/*.csv`
- Vendor chunks (client build only): `vendor-router`, `vendor-react`, `vendor-lucide`
- SPA fallback dev: `server.historyApiFallback: true`
- SSR: no special config (handled by `vite build --ssr`)

**PostCSS (`postcss.config.mjs`):**
- Empty (Tailwind 4 via @tailwindcss/vite handles all PostCSS setup)

**TypeScript:**
- No `tsconfig.json` present; Vite handles TS transpilation
- No `tsc` or `typecheck` npm script
- TS errors surface only during `npm run build` (Vite build step)

**Vercel (`vercel.json`):**
- Redirects: `/guides/*` → `/blog/*` (Phase 5 B-07)
- Rewrites: `/((?!api/).*) → /index.html` (SPA fallback)
- Headers: security, X-Robots-Tag, Permissions-Policy (Paddle)
- Functions: `api/download-skill.ts` with `includeFiles: "api/_assets/**"`

**Tailwind (`src/styles/theme.css`):**
- Theme tokens (no separate `tailwind.config.js`); entry `src/styles/index.css`; fonts `src/styles/fonts.css`

**Environment (Vercel):**
- `VITE_PADDLE_ENV` — `"sandbox"` | `"production"` (public, bundled at build)
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token (public, bundled at build)
- No secrets in this repo; real secrets live in extension repo's Edge Functions

## Build Pipeline

**npm scripts:**
```json
{
  "build": "vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta && node scripts/prerender.mjs && node scripts/sitemap.mjs && node scripts/llms.mjs && node scripts/verify-faq-mainentity.mjs && node scripts/indexnow.mjs",
  "dev": "vite"
}
```

**Build sequence (production):**
1. `vite build` → SPA bundle to `dist/`, vendor chunks (router, React, lucide)
2. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache` → SSR React renderer
3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` → per-route metadata manifest
4. `node scripts/prerender.mjs` → 18 prerendered HTML files (9 RU + 9 EN):
   - Full prerender: `/`, `/welcome`, `/about`, `/blog`, `/privacy`, `/terms`, `/refund` + EN siblings
   - Blog posts: `/blog/:slug` + `/en/blog/:slug` (dynamic per `src/content/blog/`)
   - Head-only: `/pay`, `/en/pay` (Paddle SDK injected, body loaded by React)
   - Injects per-route `<title>`, `<meta>`, `<link rel="canonical">`, hreflang triplets, `<html lang>`, og:locale, JSON-LD schema, modulepreload, Paddle `<script>` for `/pay` routes
5. `node scripts/sitemap.mjs` → `dist/sitemap.xml` with per-route `<lastmod>` from git mtime; fails if route count < 18
6. `node scripts/llms.mjs` → `dist/llms.txt` + `dist/llms-full.txt` (AI-crawler opt-in); fails if route count < 18
7. `node scripts/verify-faq-mainentity.mjs` → assert visible FAQ DOM matches JSON-LD FAQPage.mainEntity
8. `node scripts/indexnow.mjs` → Bing IndexNow notification (non-fatal)

**Ad-hoc:**
- `node scripts/smoke-blog.mjs` — Playwright smoke tests (requires `npx playwright install chromium` once)

**Excluded from version control:**
- `dist/` — build output
- `.ssr-cache/`, `.ssr-meta/` — intermediate build artifacts
- `node_modules/` — dependencies

**Scripts not present (deliberate):**
- No `test` script
- No `lint` script
- No `typecheck` script
- No `format` script

## Deployment

**Platform:** Vercel
- Project: `opten-website2` (per recent commits)
- Deploy: auto on push to `main`
- Domain: `opten.space` (HTTPS)
- SPA fallback: `/((?!api/).*) → /index.html` in vercel.json

**No release versioning** — every push to `main` is a release. No semver in `package.json` (version is `0.0.1` boilerplate). Hotfix iteration speed is high; breaking changes with the extension must be coordinated manually (see `docs/INTEGRATION-CONTRACT.md`).

## Dependency Audit Notes

**UI ecosystem overlap:** Radix + MUI + Lucide + react-slick + embla-carousel represent three overlapping icon/component systems. Worth consolidating (e.g., replace MUI icons with Lucide, drop react-slick if embla suffices).

**Figma Make export origin:** `package.json` `name` is `@figma/my-make-file`. Auto-generated SVG-path imports under `src/imports/` are from Figma; edits there are brittle — regenerate from Figma rather than hand-edit.

**No lockfile mismatch tooling:** `package-lock.json` is committed; npm-based (not yarn, pnpm).

---

*Stack analysis: 2026-05-18*
