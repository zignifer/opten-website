# Technology Stack

**Analysis Date:** 2026-05-16

## Languages

**Primary:**
- TypeScript — `src/**/*.{ts,tsx}`, `api/download-skill.ts`, `scripts/{entry-server.tsx,seo-routes.ts}`
- TSX — React components

**Secondary:**
- JavaScript (ESM `.mjs`) — `scripts/prerender.mjs`, `scripts/sitemap.mjs`, `scripts/mock-vercel-server.mjs`
- JSON — i18n dicts `src/i18n/{ru,en}.json`

## Runtime

**Environment:**
- Browser: ES module bundle from Vite 6
- Vercel serverless (Node.js): single function at `api/download-skill.ts` using `IncomingMessage`/`ServerResponse` signature
- No `engines` field in `package.json`; no `.nvmrc`

**Package Manager:**
- npm — only `package-lock.json` would be authoritative; `pnpm.overrides` block present in `package.json:89-93` pins `vite: 6.3.5` (suggests pnpm-compatible)
- Lockfile: not visible at repo root (status snapshot does not list one); `pnpm.overrides` implies pnpm support

## Frameworks

**Core:**
- `vite` 6.3.5 — `package.json:74`, config `vite.config.ts`
- `@vitejs/plugin-react` 4.7.0 — `vite.config.ts:4,11`
- `react` 18.3.1 (peerDependency) — `package.json:78`
- `react-dom` 18.3.1 (peerDependency) — `package.json:79`
- `react-router` 7.13.0 — `package.json:59`, used as `import { BrowserRouter, Routes, Route, Link } from "react-router"` (NOT `react-router-dom`)
- `tailwindcss` 4.1.12 + `@tailwindcss/vite` 4.1.12 — `vite.config.ts:3,12`
- `typescript` — not in `devDependencies`; relies on Vite's built-in TS handling. No `tsc` typecheck script.

**Testing:**
- None. No test runner, no `*.test.*` / `*.spec.*` files.

**Build/Dev:**
- `vite` (dev + client build) — `vite.config.ts`
- `vite build --ssr scripts/entry-server.tsx` — React SSR bundle → `.ssr-cache/`
- `vite build --ssr scripts/seo-routes.ts` — route metadata manifest → `.ssr-meta/`
- `node scripts/prerender.mjs` — per-route prerender of head + body → `dist/{route}/index.html`
- `node scripts/sitemap.mjs` — sitemap emission
- `rollup-plugin-visualizer` ^7.0.1 — bundle inspection
- `sharp` ^0.34.5 — image processing (used by `vite-imagetools`)
- `vite-imagetools` ^6.2.9 — `?w=...&format=webp;png&as=picture` query-string imports; configured with `exclude: ''` so `public/` files are processed (`vite.config.ts:17`)
- `supabase` ^2.98.2 (devDependency) — Supabase CLI for the linked `opten-seo` project

## Key Dependencies

**UI primitives (Radix UI):**
- `@radix-ui/react-accordion` 1.2.3, `react-alert-dialog` 1.1.6, `react-aspect-ratio` 1.1.2, `react-avatar` 1.1.3, `react-checkbox` 1.1.4, `react-collapsible` 1.1.3, `react-context-menu` 2.2.6, `react-dialog` 1.1.6, `react-dropdown-menu` 2.1.6, `react-hover-card` 1.1.6, `react-label` 2.1.2, `react-menubar` 1.1.6, `react-navigation-menu` 1.2.5, `react-popover` 1.1.6, `react-progress` 1.1.2, `react-radio-group` 1.2.3, `react-scroll-area` 1.2.3, `react-select` 2.1.6, `react-separator` 1.1.2, `react-slider` 1.2.3, `react-slot` 1.1.2, `react-switch` 1.1.3, `react-tabs` 1.1.3, `react-toggle` 1.1.2, `react-toggle-group` 1.1.2, `react-tooltip` 1.1.8 — `package.json:16-41`

**Icons:**
- `lucide-react` 0.487.0 — `package.json:49` (split into own vendor chunk, `vite.config.ts:40`)
- `@mui/icons-material` 7.3.5 — `package.json:13`
- `@mui/material` 7.3.5 + `@emotion/react` 11.14.0 + `@emotion/styled` 11.14.1 — `package.json:11-14`

**Animation:**
- `motion` 12.23.24 — `package.json:50`
- `tw-animate-css` 1.3.8 — `package.json:64`
- `canvas-confetti` 1.9.4 — `package.json:42`

**Forms:**
- `react-hook-form` 7.55.0 — `package.json:55`
- `input-otp` 1.4.2 — `package.json:48`

**Payments:**
- `Paddle.js v2` — loaded from CDN `https://cdn.paddle.com/paddle/v2/paddle.js`, NOT an npm dependency. Loader at `src/lib/paddle.ts:13`. Types at `src/types/paddle.d.ts`.

**Utility libs:**
- `clsx` 2.1.1, `class-variance-authority` 0.7.1, `tailwind-merge` 3.2.0 — `package.json:43-44,63`
- `date-fns` 3.6.0 — `package.json:46`
- `cmdk` 1.1.1, `sonner` 2.0.3, `vaul` 1.1.2, `next-themes` 0.4.6 — `package.json:45,62,65,51`

**Carousels/charts/misc:**
- `embla-carousel-react` 8.6.0, `react-slick` 0.31.0, `react-day-picker` 8.10.1, `react-dnd` 16.0.1 + `react-dnd-html5-backend` 16.0.1, `react-popper` 2.3.0, `@popperjs/core` 2.11.8, `react-resizable-panels` 2.1.7, `react-responsive-masonry` 2.7.1, `recharts` 2.15.2 — `package.json:47,60,52-54,56-58,61`

**Notably absent:**
- `@supabase/supabase-js` — Supabase access is plain `fetch` to REST/Functions endpoints

## Configuration

**Vite (`vite.config.ts`):**
- Plugins: `react()`, `tailwindcss()`, `imagetools({ exclude: '' })`
- Alias `@` → `./src` (`vite.config.ts:22`)
- `assetsInclude: ['**/*.svg', '**/*.csv']` (`vite.config.ts:27`)
- `manualChunks` (client build only): `vendor-router`, `vendor-react`, `vendor-lucide` (`vite.config.ts:36-42`)
- `server.historyApiFallback: true` (SPA dev fallback) (`vite.config.ts:49`)

**TypeScript:**
- No `tsconfig.json` visible at root via Read; type checking happens at Vite build time
- No `typecheck` npm script

**Lint/Format:**
- No ESLint config
- No Prettier config

**Vercel (`vercel.json`):**
- SPA rewrite: `/((?!api/).*) → /index.html` (`vercel.json:3`)
- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")` (`vercel.json:6-13`)
- Function bundling: `api/download-skill.ts` includes `api/_assets/**` (`vercel.json:15-19`)

**Tailwind 4:**
- Pure Vite plugin (no `tailwind.config.js`); theme tokens in `src/styles/theme.css`; entry `src/styles/index.css`; webfonts in `src/styles/fonts.css`

## Platform Requirements

**Development:**
- Node.js (version unpinned)
- `npm run dev` → Vite dev server, port 5173

**Production:**
- Vercel — auto-deploy on push to `main`, project name `opten-website2` (per recent commits)
- Custom domain: `opten.space` (HTTPS)
- No semver / version field useful for releases (`package.json:4` is `0.0.1` boilerplate)

## Scripts

`package.json:6-9`:
- `dev`: `vite`
- `build`: `vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta && node scripts/prerender.mjs && node scripts/sitemap.mjs`

**Absent scripts (deliberate):**
- No `test`
- No `lint`
- No `typecheck`
- No `format`

TS errors surface only via `vite build` (`npm run build`).

---

*Stack analysis: 2026-05-16*
