# Tech Stack — opten.space

> Snapshot taken 2026-05-14. Re-run discovery when `package.json` or build
> tooling changes meaningfully.

## Build & runtime

- **Vite 6.3.5** (pinned via pnpm overrides) — `npm run dev` for local, `npm run build` for production
- **React 18.3.1** + **React DOM 18.3.1** (peer deps, marked optional in `package.json` — unusual but works for Figma Make export origin)
- **TypeScript** via Vite's transpilation (no `tsc` in scripts)
- **`@vitejs/plugin-react` 4.7.0** + **`@tailwindcss/vite` 4.1.12** — both plugins required even though only React is heavily used. Do not remove (commented note in `vite.config.ts:9`).
- **Alias `@` → `./src`** in [`vite.config.ts`](../../vite.config.ts) — usable but most code uses relative imports.

## Routing

- **React Router 7.13.0** (`react-router` package, not `react-router-dom` — v7 unified API)
- All 8 routes declared in [`src/main.tsx`](../../src/main.tsx):
  - `/` — landing (`App.tsx`)
  - `/pay` — checkout (YooKassa + Paddle)
  - `/success` — post-payment confirmation
  - `/privacy` `/terms` `/refund` — legal
  - `/account` — subscription management
  - `/welcome` — first-install greeting
  - `/dashboard/download-skill` — Pro-only skill ZIP download
- **`vercel.json` rewrite:** all non-`/api/` paths → `/index.html` (SPA fallback)

## Styling

- **Tailwind CSS 4.1.12** via the official Vite plugin (no `postcss.config.mjs` magic; the `postcss.config.mjs` file exists but the Vite plugin is what runs)
- **`tw-animate-css` 1.3.8** — animation utility classes
- Style entry point: [`src/styles/`](../../src/styles/) — `index.css`, `tailwind.css`, `theme.css`, `fonts.css`

## UI libraries

- **Radix UI** primitives (~25 packages: accordion, dialog, dropdown, popover, tabs, tooltip, etc.) — used for headless behavior; styled via Tailwind
- **MUI 7.3.5** (Material-UI v7) + `@mui/icons-material` — used selectively, mostly for icon glyphs. Note: pulling MUI v7 alongside Radix is heavy; consider whether MUI is still earning its weight.
- **Lucide React 0.487.0** — icon set, lighter alternative to MUI icons
- **`motion` 12.23.24** (formerly Framer Motion) — scroll-reveal animations on the landing
- **`embla-carousel-react` 8.6.0** — carousels
- **`react-slick` 0.31.0** — second carousel library (consider consolidating)
- **`sonner` 2.0.3** — toasts
- **`canvas-confetti` 1.9.4** — confetti effect (likely on success/welcome)
- **`recharts` 2.15.2** — charts (unclear where used; may be dead weight from the Figma Make export)

## Forms

- **`react-hook-form` 7.55.0** — primary form library

## Backend integration

- **Plain `fetch`** to Supabase REST + Functions endpoints — no `@supabase/supabase-js` SDK
- **Hardcoded constants** in [`PayPage.tsx`](../../src/app/pages/PayPage.tsx), [`AccountPage.tsx`](../../src/app/pages/AccountPage.tsx), [`api/download-skill.ts`](../../api/download-skill.ts):
  - `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"`
  - `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"`
- **Paddle.js v2** loaded synchronously from `cdn.paddle.com` in [`index.html`](../../index.html). Initialized in [`main.tsx`](../../src/main.tsx) (Phase 67 fix: do not call `Environment.set('production')` — only sandbox).

## i18n (post-Phase-3)

- Custom context: [`src/i18n/LangContext.tsx`](../../src/i18n/LangContext.tsx)
- Two dicts: [`ru.json`](../../src/i18n/ru.json) (~68 KB), [`en.json`](../../src/i18n/en.json) (~41 KB) — EN dict is **lazy-loaded** on demand (Phase 2.2 perf fix, ~13 KB gzip saved on RU visits)
- Detection precedence: URL `/en/*` prefix → `localStorage.opten_lang_v3` (explicit choice) → legacy `localStorage.opten_lang === "en"` (one-shot migration) → `navigator.language`
- `LangSwitcher` is the only writer to `opten_lang_v3`; legacy `opten_lang="ru"` is intentionally ignored (was the cause of post-Phase-3 fix `c789dee`)
- `<html lang>` is **baked at prerender time** per output file (`scripts/prerender.mjs`) — not mutated at runtime (Phase 3 D-06 — runtime DOM mutation caused hydration mismatch)
- **`hreflang` triplet** (ru, en, x-default) injected into every prerendered `<head>`; sitemap.xml also carries `xhtml:link` reciprocal annotations (Phase 3 GEO-C-2/C-3)
- `<LocalizedLink>` ([src/app/components/LocalizedLink.tsx](../../src/app/components/LocalizedLink.tsx)) is the canonical internal-navigation primitive — preserves the `/en/` prefix when on EN routes
- `EN_SIBLINGS` constant lives in [`src/i18n/paths.ts`](../../src/i18n/paths.ts) — must stay in sync with EN entries in `scripts/seo-routes.ts`

## Vercel-side serverless

- **Single function:** [`api/download-skill.ts`](../../api/download-skill.ts) (Node.js handler signature `(req, res)`)
- Bundles ZIP via `vercel.json` `includeFiles: "api/_assets/**"`
- Validates Supabase JWT and Pro subscription before streaming the ZIP
- CORS locked to `https://opten.space`

## Env vars (Vercel)

| Var | Purpose | Where used |
|-----|---------|------------|
| `VITE_PADDLE_ENV` | `'sandbox'` \| `'production'` | [`main.tsx:26`](../../src/main.tsx#L26) |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle public client token | [`main.tsx:30`](../../src/main.tsx#L30) |

`VITE_*` vars are bundled into the client at build time — they're public. Real
secrets (Supabase service role, etc.) are NOT in this repo; they live in the
extension repo's Edge Functions. The Supabase anon key in this repo is also
public-by-design (it's the `anon` role).

## Scripts

```json
{
  "build": "vite build",
  "dev": "vite"
}
```

- No `test` script — there are no tests in this repo.
- No `lint` script — no ESLint config.
- No `typecheck` script — TS errors only surface during Vite build.
- Build output goes to `dist/` (gitignored).

## Deployment

- **Vercel** project linked via `.vercel/` (committed only `.vercel/project.json` if present; `.env*.local` ignored).
- Auto-deploy on push to `main`.
- Custom domain: `opten.space`.
- Per recent commit messages, the active Vercel project name is `opten-website2` (commit `e7e1767`).

## Dependency hygiene flags

- **Heavy UI surface area:** Radix + MUI + Lucide + react-slick + embla — three overlapping ecosystems. Worth auditing before adding more.
- **Figma Make origin:** `package.json` `name` is `@figma/my-make-file` and the README references a Figma export. Some imports (`imports/LandingPage/...`) are auto-generated SVG-path dumps from Figma. Edits there are brittle.
- **No lockfile mismatch tooling.** `package-lock.json` is committed; npm-based.
