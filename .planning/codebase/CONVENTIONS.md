# Coding Conventions

**Analysis Date:** 2026-05-16

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx`, one component per file — `src/app/pages/PayPage.tsx`, `src/app/components/OptenHeroAnimation.tsx`, `src/app/components/layout/LegalLayout.tsx`
- shadcn/Radix UI primitives: lowercase kebab-case under `src/app/components/ui/` — `button.tsx`, `dropdown-menu.tsx`, `alert-dialog.tsx` (47 files, mostly untouched scaffold)
- Non-component TS modules: lowercase — `src/lib/paddle.ts`, `src/i18n/LangContext.tsx`, `src/app/components/ui/utils.ts`
- Type-only declarations: `.d.ts` — `src/types/paddle.d.ts`, `src/types/imagetools.d.ts`
- i18n dictionaries: `ru.json`, `en.json` at `src/i18n/`
- Auto-generated Figma-Make imports: `src/imports/<ScreenName>/` — do not hand-edit (see Anti-Conventions)

**Functions:**
- camelCase for utilities — `detectLang`, `charDelay`, `titleCaseEn`, `langToCurrency`
- PascalCase for React components — `Button`, `LegalLayout`, `OptenHeroAnimation`, `LangProvider`
- Local helper components inside a file are also PascalCase — `Accent`, `Logo`, `BrowserIcons`, `InstallButton` in `src/app/App.tsx:54-78`

**Variables:**
- camelCase for locals and state
- UPPER_SNAKE_CASE for module-level constants — `STORAGE_KEY`, `CURRENCY_STORAGE_KEY`, `SUPABASE_ANON_KEY`, `EXTENSION_IDS`, `CHROME_STORE_URL`, `SUPABASE_FUNCTIONS_URL`, `ASSET`, `ASSET_ROOT`, `STORE_URL`

**Types:**
- PascalCase interfaces and type aliases — `LangContextValue`, `Subscription`, `ExtStatus`, `Currency`, `Lang`, `Phase`
- No `I`-prefix convention

**i18n keys:**
- Dot-namespaced strings — `account.ext.notInstalled.desc1`, `legal.backLink`, `welcome.step1.title`, `anim.oldText`. Looked up via `useT()(key)`; fallback chain is RU → EN → key itself (`src/i18n/LangContext.tsx:46`).

**Storage keys:**
- `localStorage` (site-owned): `opten_` prefix — `opten_lang` (`src/i18n/LangContext.tsx:7`), `opten_pay_currency` (`src/app/pages/PayPage.tsx:19`)
- `chrome.storage.local` (extension-owned, read-only here): `ps_*` prefix. The site does NOT read these directly — only via `chrome.runtime.sendMessage` to the extension. See `docs/INTEGRATION-CONTRACT.md` §5.

## Code Style

**Formatting:**
- No Prettier config in repo (`.prettierrc*` absent).
- No formatter enforced. Indentation is 2 spaces everywhere observed. Double-quoted strings dominate (`"react-router"`, `"detecting"`); single quotes appear in vite-imagetools URLs in `src/app/App.tsx:16-27`.
- Trailing commas in multi-line object/array literals (consistent across files).

**Linting:**
- No ESLint config in repo root (`.eslintrc*` absent — only nested `node_modules` configs match).
- No type-check script in `package.json:6-9`. TS errors surface only at `npm run build` via `@vitejs/plugin-react`.

## Import Organization

**Order (observed pattern, no enforcer):**
1. React / hooks (`from "react"`)
2. Router (`from "react-router"` — Router v7 syntax, NEVER `react-router-dom`)
3. Third-party libs (`lucide-react`, `motion`, etc.)
4. Internal modules — relative paths (`../../i18n/LangContext`, `../components/Picture`)
5. Asset imports — relative, often with vite-imagetools query strings (`?w=...&format=webp;png&as=picture`)

Example: `src/app/App.tsx:1-27`.

**Path Aliases:**
- `@` → `./src` is configured in `vite.config.ts:20-23` but **unused in source** — verified via grep, zero `@/` imports in `src/`. All imports are relative. New code should follow the relative convention or commit to `@/` consistently.

**No `tsconfig.json`:**
- Project has no root `tsconfig.json` (verified via Glob). `@vitejs/plugin-react` parses TS without one; type information is best-effort.

## Error Handling

**Patterns:**
- `try { ... } catch (e) { ... }` around async fetch/Paddle/`chrome.runtime.sendMessage` calls (e.g. `src/app/pages/AccountPage.tsx:99-122`, `src/app/pages/PayPage.tsx:270-300`).
- Errors usually mapped to a string state field rendered inline (`setError(t("..."))`), not thrown. No global error boundary.
- `chrome.runtime.sendMessage` is wrapped in iteration over `EXTENSION_IDS` because `chrome.runtime.lastError` fires for the non-installed ID — this is by design (`AccountPage.tsx:99-122`).

## Logging

**Framework:** none. Plain `console.log` / `console.warn` / `console.error` only. No structured logging, no remote telemetry, no Sentry.

## Comments

**Phase / decision / bug refs** — shared numbering with the extension repo:

- `// Phase 2.2:` — site-local phase number (perf / hydration sweep). Example: `src/main.tsx:23`, `src/app/App.tsx:66`.
- `// Phase 66 D-04 + FE-02:` — cross-repo phase tag (extension Phase 66 = pricing/billing). Example: `src/app/pages/PayPage.tsx:118`, `:266`.
- `// D-NN:` — design decision marker. Example: `src/main.tsx:14` (`Phase 2.1 D-01`), `src/app/App.tsx:14` (`Phase 2.1 D-04`).
- `// BG-NN-NN:` — bug reference. Example: `src/lib/paddle.ts:23` (`BG-67-01: Paddle v2 SDK Environment.set('production') throws`).

Other comment shapes:

- Long header comments explaining tricky integration constraints — see `src/main.tsx:14-42` (hydration detector rationale) and `src/styles/fonts.css:1-26` (font-display strategy).
- Inline `// ...` for non-obvious lines; no JSDoc/TSDoc usage observed.

## Component Patterns

**Functional components only.** No class components.

**Default exports for pages, named exports for shared components:**
- Pages use `export default function PageName()` — `WelcomePage`, `PayPage`, `LegalLayout`.
- Hooks and providers use named exports — `useT`, `useLang`, `LangProvider`, `LangContext` from `src/i18n/LangContext.tsx`.
- UI primitives mix both — `button.tsx:58` exports `{ Button, buttonVariants }`.

**shadcn/Radix UI primitives:**
- All 47 files under `src/app/components/ui/` follow the shadcn pattern: `class-variance-authority` for variants + `cn(...)` (clsx + tailwind-merge) helper from `src/app/components/ui/utils.ts`. See `button.tsx:7-35` for the canonical shape.
- Most primitives are dormant scaffold — only a handful are actually imported by app code.

**Internationalization access pattern:**
```tsx
const t = useT();
const { lang, setLang } = useLang();
// then: t("account.ext.notInstalled.desc1"), lang === "ru"
```
Always destructure from `useLang()`; never reach into the context directly.

**No global state library.** Only `LangContext` for i18n; everything else is local component state or `localStorage`. Auth/subscription state lives in the **extension** and is fetched via `chrome.runtime.sendMessage`.

**No shared layout component for marketing pages.** `App.tsx` (landing) and `WelcomePage.tsx` each render their own header/footer markup. Only legal pages share `src/app/components/layout/LegalLayout.tsx`.

**Animation:** custom timeline driven by `setTimeout` chains in `src/app/components/OptenHeroAnimation.tsx`. The `motion` package is in `package.json:50` but currently has zero imports in `src/` — keep it out unless a clear use case appears.

**MUI / react-hook-form:** `@mui/icons-material` (`package.json:13`) has zero imports in `src/`. `react-hook-form` appears only inside the unused `src/app/components/ui/form.tsx` shadcn primitive. Neither is part of the live UI surface today — CLAUDE.md's tech-stack list is aspirational on these two; do not assume they're wired up.

## CSS / Styling

- Tailwind 4 via `@tailwindcss/vite` plugin (`vite.config.ts:12`). No `tailwind.config.js` — Tailwind 4 uses CSS-first config.
- Single CSS entry: `src/styles/index.css` imports `fonts.css`, `tailwind.css`, `theme.css` (in that order).
- Theme tokens live in `src/styles/theme.css` as CSS custom properties on `:root` (`--background`, `--foreground`, `--primary`, `--radius`, etc.). Use the token, not the literal color — e.g. `bg-primary` not `bg-[#030213]`.
- Fonts self-hosted as variable WOFF2 from `/public/fonts/`, declared in `src/styles/fonts.css`. `PT Root UI` uses `font-display: swap` with an adjusted-fallback face; `Unbounded` uses `font-display: block` with `<link rel=preload>` in `index.html`. Don't switch back to Google Fonts `@import` — see comment header in `fonts.css:1-26`.
- Component-level styles: Tailwind utility classes inline in JSX. Arbitrary values (`text-[#9cfb51]`, `text-[14px]`, `px-[20px]`) are common — design tokens come from Figma exports, not a constrained palette.
- Hardcoded font-family in className strings: `font-['PT_Root_UI',sans-serif]` and `font-['PT_Root_UI:Medium',sans-serif]` appear inline (e.g. `LegalLayout.tsx:15`, `LandingPage.tsx:14`). Pattern is inconsistent — some files inherit body font, others re-declare.

## Function & Module Design

**Function size:** mostly short helpers (≤ 10 lines) plus a few large page components (`PayPage.tsx`, `AccountPage.tsx`) that exceed 300 lines and mix data fetching, Paddle integration, and JSX in a single default export. No `useMemo`/extraction pattern enforced — split only when something concrete breaks.

**Module exports:** one default export per page component; named exports for hooks, providers, and primitives. No barrel `index.ts` files anywhere.

**Constants placement:** module-top, above the component. Duplicated across files (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CHROME_STORE_URL`) — see CONCERNS / INTEGRATION-CONTRACT. Changing one without the others breaks the extension link.

## Anti-Conventions / Avoid

- **Never hand-edit `src/imports/**`.** It's auto-generated by Figma Make — SVG path data, image-hash filenames, opaque `Frame5`/`Frame161` helper components. The landing page (`src/app/App.tsx`) was hand-rebuilt from `imports/LandingPage/LandingPage.tsx`; `App.tsx` is the source of truth, the import is reference-only.
- **Don't import from `react-router-dom`.** This project is on React Router v7 — always `import { Link, ... } from "react-router"`.
- **Don't add `tsconfig.json` casually.** Vite + `@vitejs/plugin-react` work without one. Introducing strict TS now will surface a wall of errors in `imports/` and `ui/` scaffold files — quarantine them via `exclude` if you add a config.
- **Don't add `@/` imports next to relative ones in the same file.** Pick one. Current codebase is 100% relative.
- **Don't drop new module-level constants for `EXTENSION_IDS` / `SUPABASE_*` without updating every duplicate.** They're hardcoded in `src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, and `api/download-skill.ts` — keep them in sync. See `docs/INTEGRATION-CONTRACT.md`.
- **Don't rename routes** `/welcome`, `/pay`, `/success` — they're referenced by already-shipped extension binaries.
- **Don't switch Paddle to async `<script defer>` in `index.html`** — see Phase 2.2 commit history; current strategy is sync on `/pay` only (prerender injects the tag) and `ensurePaddle()` for SPA-nav cases.
- **Don't reach into `chrome.storage.local` directly.** The site never imports a Supabase JS client and never owns auth tokens — all extension state flows through `chrome.runtime.sendMessage`.

---

*Convention analysis: 2026-05-16*
