# Technology Stack

**Analysis Date:** 2026-05-21

## Languages

**Primary:**
- TypeScript — entire codebase (`src/**/*.ts`, `src/**/*.tsx`, `api/download-skill.ts`, `scripts/entry-server.tsx`, `scripts/seo-routes.ts`). Transpiled via Vite; no `tsc` script. TS errors surface during `npm run build`.

**Secondary:**
- JavaScript (ESM `.mjs`) — build orchestration scripts (`scripts/prerender.mjs`, `scripts/sitemap.mjs`, `scripts/llms.mjs`, `scripts/verify-faq-mainentity.mjs`, `scripts/indexnow.mjs`, etc.)

## Runtime

**Environment:**
- Browser — ES module bundle from Vite 6, SPA with SSR-prerendered landing + model content islands
- Vercel serverless (Node.js) — single function `api/download-skill.ts` using Node.js `IncomingMessage`/`ServerResponse` signature (not Web Standard Request/Response)
- Node.js (build-time only) — SSR rendering via `scripts/entry-server.tsx`, route metadata via `scripts/seo-routes.ts`
- No `engines` field; no `.nvmrc`; Vercel defaults to Node.js 20.x LTS

**Package Manager:**
- npm (primary, `package-lock.json` committed)
- pnpm overrides: `{ vite: "6.3.5" }` in `package.json` (ensures exact Vite version across installs)
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- Vite 6.3.5 — build tool + dev server (pinned via pnpm overrides for reproducibility)
  - `npm run dev` — local dev (port 5173, SPA fallback on 404)
  - `npm run build` — multi-stage production build (see Scripts below)
- @vitejs/plugin-react 4.7.0 — React Fast Refresh + JSX transform
- @tailwindcss/vite 4.1.12 — Tailwind CSS Vite plugin (required, do not remove)
- React 18.3.1 — UI layer (peerDependency, marked optional for Figma Make compatibility)
- React Router 7.13.0 — client routing. Imports from `"react-router"` (not `"react-router-dom"` — v7 unified API). ~22 client route patterns expand to 144 prerendered routes.

**Styling:**
- Tailwind CSS 4.1.12 — utility-first CSS framework via Vite plugin. Entry: `src/styles/index.css`. Theme tokens in `src/styles/theme.css`. Custom fonts in `src/styles/fonts.css`.
- tw-animate-css 1.3.8 — animation utility classes

**Fonts:**
- Self-hosted WOFF2 subsets: Unbounded (VF, ~79 KB, weights 400–700, font-display: swap for LCP) + PT Root UI (VF, ~64 KB, weights 400–700, font-display: optional for CLS mitigation)
- Built via `scripts/subset-fonts.py` (corpus: RU+EN site text + Latin/Cyrillic safety ranges); verified by `scripts/verify-fonts.mjs`

**UI Primitives & Components:**
- Radix UI (~25 packages): accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toggle, toggle-group, tooltip. All provide headless behavior; styled via Tailwind.
- MUI (Material-UI) 7.3.5 + @mui/icons-material 7.3.5 — selective icon glyphs; core UI via Radix
- Lucide React 0.487.0 — lighter icon library alternative
- motion 12.23.24 — scroll-reveal animations (Framer Motion successor)
- embla-carousel-react 8.6.0 — carousel component (for model showcase)
- react-slick 0.31.0 — second carousel library (consolidation candidate)
- canvas-confetti 1.9.4 — confetti effect on success/welcome
- sonner 2.0.3 — toast notifications

**Forms:**
- react-hook-form 7.55.0 — form state management and validation

**Charts & Visualization:**
- recharts 2.15.2 — charting library (presence unclear; may be dead weight from Figma Make export origin)

**Additional UI/UX:**
- react-responsive-masonry 2.7.1 — masonry grid layout
- react-dnd 16.0.1 + react-dnd-html5-backend 16.0.1 — drag-and-drop (unclear if actively used)
- react-day-picker 8.10.1 — date picker
- react-popper 2.3.0 — positioning engine for popovers/tooltips
- react-resizable-panels 2.1.7 — resizable panel layout (unclear usage)
- vaul 1.1.2 — drawer component
- input-otp 1.4.2 — one-time password input component
- class-variance-authority 0.7.1 — CSS class composition utility
- clsx 2.1.1 — conditional className builder
- cmdk 1.1.1 — command menu component
- date-fns 3.6.0 — date manipulation library
- next-themes 0.4.6 — theme provider (unusual; designed for Next.js, repurposed here)
- tailwind-merge 3.2.0 — Tailwind class conflict resolution
- @emotion/react 11.14.0 + @emotion/styled 11.14.1 — CSS-in-JS (transitive via MUI)
- @popperjs/core 2.11.8 — positioning library (transitive via react-popper)

**Build & Image Optimization:**
- vite-imagetools 6.2.9 — image optimization via `?w=...&format=webp;png&as=picture` query strings
- sharp 0.34.5 — image processing library (used by build scripts)
- esbuild 0.25.12 — JavaScript bundler (bundled with Vite)
- rollup-plugin-visualizer 7.0.1 — bundle size visualization (dev dependency)

**CLI Tools:**
- supabase 2.98.2 — Supabase CLI (dev dependency, for project operations; site linked to `opten-seo` analytics replica; extension repo linked to production `opten`)

## Key Dependencies

**Critical (core functionality):**
- React Router 7.13.0 — entire routing layer; ~22 client route patterns prerender to 144 files via `scripts/prerender.mjs`
- Vite 6.3.5 — build orchestration; pinned via pnpm overrides
- Paddle.js v2 — payment processing (USD, Paddle). Loaded via CDN (`https://cdn.paddle.com/paddle/v2/paddle.js`). Injected synchronously only on `/pay` (prerendered); lazy-loaded for SPA navigation via `src/lib/paddle.ts`.
- Supabase (REST + Edge Functions) — backend for auth, subscriptions, payment webhooks. Accessed via plain `fetch()` (no `@supabase/supabase-js` SDK).
- Vercel serverless — single function `api/download-skill.ts` (JWT validation, Pro subscription gate, ZIP stream)

**UI Foundation:**
- Radix UI primitives — 25 headless components (every interactive element derives from these)
- Tailwind CSS 4.1.12 — styling system

**Performance & Build:**
- vite-imagetools — image optimization for landing/blog cover images
- @tailwindcss/vite — CSS bundling without external PostCSS config

## Configuration

**Environment Variables:**
- Public (bundled at build time, set in Vercel project settings):
  - `VITE_PADDLE_ENV` — `'sandbox'` | `'production'`
  - `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token
- No `.env` or `.env.local` in repo
- All secrets (Supabase service role, Paddle private key, YooKasha webhooks) live in the **extension repo's** Supabase Edge Function secrets, not this project

**Hardcoded Constants (must be kept in sync across files):**
- `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` — appears in:
  - `src/app/pages/PayPage.tsx` (line 11)
  - `src/app/pages/AccountPage.tsx` (line 7)
  - `src/app/pages/DownloadSkillPage.tsx` (implicit via parent context)
  - `api/download-skill.ts` (line 14)
- `SUPABASE_ANON_KEY` — same four files (JWT authentication, read-only access to auth + subscriptions tables)
- `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl", "kcmcaeenfmfnpiaihicecnfnagejpcog"]` — in three pages (`PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`). First is Chrome Web Store ID; second is local dev unpacked ID. Pages iterate the list and use the first that responds.

**Build Configuration:**
- `vite.config.ts` — main build config:
  - Plugins: React Fast Refresh, Tailwind Vite, vite-imagetools
  - Path alias: `@` → `./src` (available but most imports are relative)
  - SSR-aware: `isSsrBuild` flag swaps `@/content/models` barrel to lazy client store (`index.client.ts`) on browser builds only
  - Chunk splitting (client only): separate vendor chunks for React, React Router, Lucide (better caching)
  - Server: SPA fallback (`historyApiFallback: true`)
- `vercel.json` — Vercel deployment config:
  - Redirects: `/guides/*` → `/blog/*`, `/en/guides/*` → `/en/blog/*` (Phase 5 B-07, legacy URL space retirement)
  - Rewrites: `/account`, `/success`, `/dashboard/download-skill` → `/index.html` (SPA fallback for these extension-coupled routes)
  - Security headers: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy (Paddle payment frame allowed)
  - X-Robots-Tag: noindex on `/account/*`, `/success/*`, `/dashboard/*`, `/api/*`
  - Function config: `api/download-skill.ts` bundles ZIP via `includeFiles: "api/_assets/**"`

**Build Pipeline (`npm run build`):**
1. Generate content summaries (`scripts/generate-summaries.mjs`)
2. Client build (Vite, `dist/`)
3. SSR build (`scripts/entry-server.tsx` → `.ssr-cache/`)
4. Meta build (`scripts/seo-routes.ts` → `.ssr-meta/`)
5. Prerender 144 routes (`scripts/prerender.mjs` → `dist/<route>/index.html`)
6. Generate `sitemap.xml` (`scripts/sitemap.mjs`)
7. Generate `llms.txt` + `llms-full.txt` (`scripts/llms.mjs`)
8. Verify FAQ ↔ FAQPage schema parity (`scripts/verify-faq-mainentity.mjs`)
9. Verify fonts (`scripts/verify-fonts.mjs`)
10. Ping Bing IndexNow (`scripts/indexnow.mjs`)

## Platform Requirements

**Development:**
- Node.js (no pinned minor version; Vercel currently uses 20.x LTS)
- npm or pnpm (lockfile committed)
- For extension integration testing: Chrome/Chromium with unpacked dev extension (ID: `kcmcaeenfmfnpiaihicecnfnagejpcog`); requires Vercel preview URL on `*.opten.space` (localhost:5173 not allowed by extension's `externally_connectable`)
- Optional: `scripts/smoke-blog.mjs` requires Playwright (for ad-hoc E2E testing of blog posts)

**Production:**
- Vercel — static hosting + single serverless function
- Supabase project `opten-seo` — read-only access to analytics (RLS enforced)
- Supabase project `opten` (in extension repo) — production Edge Functions for payments, subscriptions, webhooks
- Paddle account — USD payment processing
- YooKassa account — RUB payment processing (webhook secrets in extension repo)
- Chrome Web Store — extension distribution (not this site's responsibility)

---

*Stack analysis: 2026-05-21*
