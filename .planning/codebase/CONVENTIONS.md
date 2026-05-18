# Coding Conventions

**Analysis Date:** 2026-05-18

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx`, one component per file — `src/app/pages/PayPage.tsx`, `src/app/components/OptenHeroAnimation.tsx`, `src/app/components/layout/LegalLayout.tsx`, `src/app/components/LangSwitcher.tsx`, `src/app/components/LocalizedLink.tsx`
- shadcn/Radix UI primitives: lowercase kebab-case under `src/app/components/ui/` — `button.tsx`, `dropdown-menu.tsx`, `alert-dialog.tsx` (mostly untouched scaffold)
- Non-component TS modules: lowercase — `src/lib/paddle.ts`, `src/i18n/LangContext.tsx`, `src/i18n/paths.ts`, `src/app/components/ui/utils.ts`
- Type-only declarations: `.d.ts` — `src/types/paddle.d.ts`, `src/types/imagetools.d.ts`
- i18n dictionaries: `ru.json`, `en.json` at `src/i18n/`
- Build scripts: lowercase under `scripts/` — `scripts/prerender.mjs`, `scripts/sitemap.mjs`, `scripts/seo-routes.ts`, `scripts/entry-server.tsx`, `scripts/smoke-blog.mjs`
- Auto-generated Figma-Make imports: `src/imports/<ScreenName>/` — do not hand-edit (see Anti-Conventions)

**Functions:**
- camelCase for utilities — `detectLangFromPath`, `detectLangFromStorage`, `loadEnDict`, `localizeHref`, `toEnTarget`, `toRuTarget`, `stripTrailingSlash`, `charDelay`, `titleCaseEn`, `langToCurrency`
- PascalCase for React components — `Button`, `LegalLayout`, `OptenHeroAnimation`, `LangProvider`, `LangSwitcher`, `LocalizedLink`
- Local helper components inside a file are also PascalCase — `Accent`, `Logo`, `BrowserIcons`, `InstallButton`, `ChromeIconSmall`, `CheckIcon` in various page files

**Variables:**
- camelCase for locals and state
- UPPER_SNAKE_CASE for module-level constants — `STORAGE_KEY`, `LEGACY_STORAGE_KEY`, `CURRENCY_STORAGE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_FUNCTIONS_URL`, `EXTENSION_IDS`, `CHROME_STORE_URL`, `EN_SIBLINGS`, `EN_LANDING`, `SITE_ORIGIN`, `DEFAULT_OG_IMAGE`, `DEFAULT_OG_IMAGE_EN`

**Types:**
- PascalCase interfaces and type aliases — `LangContextValue`, `RouteMeta`, `Subscription`, `ExtStatus`, `Currency`, `Lang`, `Phase`, `BlogPost`, `BlogPostLocale`, `BlogPostBody`, `BlogFaqItem`, `BlogStep`, `BlogSection`
- No `I`-prefix convention

**i18n keys:**
- Dot-namespaced strings — `account.ext.notInstalled.desc1`, `legal.backLink`, `welcome.step1.title`, `nav.blog`, `faq.heading`, `blog.empty.title`, `about.bio.p1`. Looked up via `useT()(key)`; fallback chain is current-lang → RU → key itself.

**Storage keys:**
- `localStorage` (site-owned): `opten_` prefix — `opten_lang_v3` (`src/i18n/LangContext.tsx:20`), `opten_pay_currency` (`src/app/pages/PayPage.tsx`)
  - **`opten_lang_v3` is the post-Phase-3 key.** The legacy `opten_lang` is read only as a one-shot migration and only when its value is exactly `"en"` (RU values from old auto-detect are intentionally discarded). Do NOT revive the old key name.
- `chrome.storage.local` (extension-owned, read-only here): `ps_*` prefix. The site does NOT read these directly — only via `chrome.runtime.sendMessage` to the extension (see `docs/INTEGRATION-CONTRACT.md` §5).

## Code Style

**Formatting:**
- No Prettier config in repo (`.prettierrc*` absent).
- No formatter enforced. Indentation is 2 spaces everywhere observed. Double-quoted strings dominate; single quotes appear in vite-imagetools URLs.
- Trailing commas in multi-line object/array literals (consistent across files).

**Linting / type-checking:**
- No ESLint config in repo root (`.eslintrc*` absent — only nested `node_modules` configs match).
- No `typecheck` script in `package.json` (only `dev` and `build`).
- TS errors surface only during `npm run build` — via `@vitejs/plugin-react` in the client bundle and the two `vite build --ssr` invocations (`scripts/entry-server.tsx` and `scripts/seo-routes.ts`). A file with broken types may still compile if the offending construct is stripped by SWC; type checking is best-effort.

## Import Organization

**Order (observed pattern, no enforcer):**
1. React / hooks (`from "react"`)
2. Router (`from "react-router"` — Router v7 syntax, NEVER `react-router-dom`)
3. Third-party libs (`lucide-react`, `motion`, `date-fns`, etc.)
4. Internal modules — relative paths (`../../i18n/LangContext`, `../../i18n/paths`, `../components/Picture`, `../components/LocalizedLink`)
5. Asset imports — relative, often with vite-imagetools query strings (`?w=...&format=webp;png&as=picture`)
6. Type imports — `import type { ... }`

Example: `src/app/App.tsx:1-35`, `src/app/components/LangSwitcher.tsx:16-18`.

**Path Aliases:**
- `@` → `./src` is configured in `vite.config.ts` but **unused in source** — verified via grep, zero `@/` imports in `src/`. All imports are relative. New code should follow the relative convention or commit to `@/` consistently.

**No `tsconfig.json`:**
- Project has no root `tsconfig.json` (verified via Glob). `@vitejs/plugin-react` parses TS without one; type information is best-effort.

## Internal Navigation

**Use `LocalizedLink`, not bare `Link`.** Post-Phase-3 the canonical internal-navigation primitive is `src/app/components/LocalizedLink.tsx` (a thin wrapper around `react-router` `<Link>`).

```tsx
import LocalizedLink from "../../components/LocalizedLink";
// then:
<LocalizedLink to="/pay">{t("nav.pricing")}</LocalizedLink>
```

**Behavior contract** (header comment in `LocalizedLink.tsx:1-10`):

- On `/en/*` URLs, `to="/pay"` is rewritten to `"/en/pay"` for the routes in `EN_SIBLINGS` (`/`, `/welcome`, `/pay`, `/privacy`, `/terms`, `/refund`, `/about`, `/blog`, `/blog/:slug`).
- On `/en/*` URLs, `to="/account"` stays as `"/account"` (no EN sibling — content layer keeps language via `localStorage` + `LangProvider`).
- On unprefixed paths, URL stays unprefixed regardless of detected language (D-07 contract preserved).
- Non-string `to` props pass through unchanged.

**Why this exists:** the original bare-`<Link>` usage stripped the `/en/` prefix on every click after the user explicitly switched to EN, snapping them back to RU. The fix is `LocalizedLink` plus the SYNC contract below.

Consumers: `App.tsx`, `PayPage.tsx`, `AccountPage.tsx`, `LegalLayout.tsx`, `SuccessPage.tsx`, `DownloadSkillPage.tsx`, `BlogPostPage.tsx`, `BlogListPage.tsx`. New marketing/billing pages MUST use `LocalizedLink`.

**External links and hash/mailto anchors** stay as bare `<a href=...>` — `LocalizedLink` only handles in-app paths beginning with `/`.

## EN_SIBLINGS SYNC Contract

`src/i18n/paths.ts` exports `EN_SIBLINGS` as the **single source of truth** for which top-level routes have an `/en/...` sibling:

```ts
export const EN_SIBLINGS = new Set<string>([
  "/", "/welcome", "/pay", "/privacy", "/terms", "/refund", "/about", "/blog", 
  // Note: /blog/:slug is parameterized; EN sibling is /en/blog/:slug (automatic via route matching)
]);
```

**SYNC rule (called out in the file header):** `EN_SIBLINGS` MUST stay in step with the EN entries (`path: "/en/..."`) in `scripts/seo-routes.ts` and the EN `<Route>` mounts in `src/main.tsx` and `scripts/entry-server.tsx`. Adding or removing an EN route requires updating all three files. The files together drive:

- `LocalizedLink` rewrite decisions (`paths.ts` via `localizeHref`).
- `LangSwitcher` navigate targets (`paths.ts` via `toEnTarget` / `toRuTarget`).
- Prerendered HTML output, hreflang triplets, sitemap entries (`seo-routes.ts` consumed by `scripts/prerender.mjs` + `scripts/sitemap.mjs`).
- `/en/*` route mounts in `src/main.tsx` and `scripts/entry-server.tsx`.

Add a new EN route → edit (1) `scripts/seo-routes.ts` manifest, (2) `src/i18n/paths.ts` `EN_SIBLINGS`, (3) `src/main.tsx` `<Route path="/en/...">`, (4) `scripts/entry-server.tsx` `<Route>` (unless head-only like `/en/pay`). Missing any of these breaks SPA navigation, prerender, or SEO.

**See also:** `docs/CONTENT-AUTHORING.md` §1 — the full "6 files in sync" checklist for adding a new page or blog post.

## Language-Switcher Storage Discipline

`LangSwitcher` (`src/app/components/LangSwitcher.tsx`) is the **only** allowed writer of `localStorage.opten_lang_v3`. `setLang(nextLang)` flips React state and storage synchronously; if the current URL has an EN sibling (or vice versa), it then calls `navigate(target)`. On no-sibling routes (`/account`, `/success`, `/dashboard/*`) `toEnTarget` returns `null` and the switcher deliberately skips `navigate()` — language flips in place via storage + context, URL is preserved.

**Forbidden patterns:**

- `localStorage.setItem("opten_lang_v3", ...)` outside `LangContext.setLang` / `LangSwitcher`. The previous codebase had auto-write-on-detect; that's the bug the v3 rename fixed. `LangProvider` reads storage but never writes it on its own.
- Reviving inline `setLang(lang === "ru" ? "en" : "ru")` in pages. Inline switchers were removed in Plan 08; reintroducing them duplicates the EN_SIBLINGS allow-list and reopens the open-redirect attack surface mitigated by `paths.ts`.
- Passing user-controlled strings (search params, hashes, postMessage payloads) into `navigate()`. `LangSwitcher` computes its target only from `EN_SIBLINGS` lookups — keep new switchable surfaces on the same allow-list pattern.

## Error Handling

**Patterns:**
- `try { ... } catch (e) { ... }` around async fetch/Paddle/`chrome.runtime.sendMessage` calls (e.g. `src/app/pages/AccountPage.tsx`, `src/app/pages/PayPage.tsx`).
- Errors usually mapped to a string state field rendered inline (`setError(t("..."))`), not thrown. No global error boundary.
- `chrome.runtime.sendMessage` is wrapped in iteration over `EXTENSION_IDS` because `chrome.runtime.lastError` fires for the non-installed ID — this is by design.
- SSR guards: `if (typeof window === "undefined")` checks for components used in prerendered routes (e.g., `LangContext.tsx`, `PayPage.tsx`)

**Fail-fast at build time:** every `apply*` helper in `scripts/prerender.mjs` follows the `if (html === before) throw new Error(...)` pattern. New build-time HTML mutators MUST include the same no-match guard — Phase 2 D-08 relies on loud-fail at build rather than silent SEO regressions in production.

## Logging

**Framework:** none. Plain `console.log` / `console.warn` / `console.error` only. No structured logging, no remote telemetry, no Sentry.

## Comments

**Phase / decision / bug refs** — numbering is shared with the extension repo (`C:\Projects\promptscore`) when changes span both repos; site-only sweeps reuse the same scheme to keep grep behavior consistent:

- `// Phase N:` — site-local or cross-repo phase number. Examples: `// Phase 2.1 D-04:` (`src/main.tsx:16`), `// Phase 2.2:` (perf/hydration sweep), `// Phase 3 D-05:` (`src/main.tsx:50`), `// Phase 3 Pitfall 6:` (`src/i18n/LangContext.tsx:4,24,56`).
- `// Phase 66 D-04 + FE-02:` — cross-repo phase tag (extension Phase 66 = pricing/billing). Example: `src/app/pages/PayPage.tsx:19`.
- `// D-NN:` — design decision marker. Examples: `// D-01:`, `// D-05:`, `// D-07:` (Phase 3 routing-contract decisions referenced repeatedly across `LangContext.tsx`, `paths.ts`, `LangSwitcher.tsx`).
- `// BG-NN-NN:` — bug reference. Example: `src/lib/paddle.ts` (`BG-67-01: Paddle v2 SDK Environment.set('production') throws`).
- `// Post-Phase-3:` / `// Phase 3 follow-up:` — fixes that landed after the phase was closed (Bugs 1–3 in `03-POST-RELEASE.md`). Pattern is "name the phase, mark as post-release" — used in `LocalizedLink.tsx:1`, `paths.ts:1`, `LangContext.tsx:13,160`, `LangSwitcher.tsx:1`.

Other comment shapes:

- Long header comments explaining tricky integration constraints — see `src/main.tsx:14-48` (hydration detector rationale), `src/styles/fonts.css:1-26` (font-display strategy), `src/i18n/LangContext.tsx:13-22` (storage-key rationale), `src/app/components/LocalizedLink.tsx:1-10` (behavior contract).
- `// SYNC:` markers for duplicated-but-must-stay-in-step constants (`paths.ts:2` on `EN_SIBLINGS` ↔ `scripts/seo-routes.ts` EN entries, `scripts/seo-routes.ts:2` on title/description strings ↔ `src/i18n/*.json`). Treat these as compiler hints: changing one side without the other is a real bug, not just a style nit.
- Inline `// ...` for non-obvious lines; no JSDoc/TSDoc usage observed.

## Component Patterns

**Functional components only.** No class components.

**Default exports for pages and the post-Phase-3 navigation primitives, named exports for shared hooks/providers:**
- Pages use `export default function PageName()` — `WelcomePage`, `PayPage`, `LegalLayout`, `App`, `BlogPostPage`, `BlogListPage`.
- Navigation primitives default-export the component, named-export config/hooks alongside if needed — `LocalizedLink` (default), `LangSwitcher` (default).
- Hooks and providers use named exports — `useT`, `useLang`, `useOnEnPath`, `LangProvider`, `LangContext` from `src/i18n/LangContext.tsx`.
- Pure helpers are named exports — `toEnTarget`, `toRuTarget`, `localizeHref`, `EN_SIBLINGS`, `EN_LANDING` from `src/i18n/paths.ts`.
- UI primitives mix both — `button.tsx` exports `{ Button, buttonVariants }`.

**shadcn/Radix UI primitives:**
- All files under `src/app/components/ui/` follow the shadcn pattern: `class-variance-authority` for variants + `cn(...)` (clsx + tailwind-merge) helper from `src/app/components/ui/utils.ts`. See `button.tsx` for the canonical shape.
- Most primitives are dormant scaffold — only a handful are actually imported by app code.

**Internationalization access pattern:**
```tsx
const t = useT();
const { lang, setLang } = useLang();
// then: t("account.ext.notInstalled.desc1"), lang === "ru"
```
Always destructure from `useLang()`; never reach into the context directly. After Plan 08, `setLang` is only consumed by `LangSwitcher` — pages that previously used it for inline switchers no longer destructure it.

**No global state library.** Only `LangContext` for i18n; everything else is local component state or `localStorage`. Auth/subscription state lives in the **extension** and is fetched via `chrome.runtime.sendMessage`.

**Blog content types (Phase 5):**
- `src/content/blog/types.ts` defines `BlogPost`, `BlogPostLocale`, `BlogPostBody`, `BlogStep`, `BlogFaqItem`, `BlogSection`, `BlogImage`
- Each blog post is a TS file implementing `{ ru, en }` locale pair (e.g., `src/content/blog/gpt-image-2.ts`)
- Barrel export in `src/content/blog/index.ts` sorted newest-first by `publishedAt`
- Schema source-of-truth: `body.intro` (40-60 word definitional block), `body.steps` → HowTo schema, `body.faq` → FAQPage schema
- See `docs/CONTENT-AUTHORING.md` for full conventions

**No shared layout component for marketing pages.** `App.tsx` (landing) and `WelcomePage.tsx` each render their own header/footer markup. Only legal pages share `src/app/components/layout/LegalLayout.tsx`. `LangSwitcher` is rendered 5 times (2 in `App.tsx`, 1 each in `PayPage.tsx`, `AccountPage.tsx`, `LegalLayout.tsx`) — passing `className` for site-specific Tailwind, plus `onSwitch` only on the mobile-menu instance.

**Animation:** custom timeline driven by `setTimeout` chains in `src/app/components/OptenHeroAnimation.tsx`. The `motion` package is in `package.json` but currently has zero imports in `src/` — keep it out unless a clear use case appears.

**MUI / react-hook-form:** `@mui/icons-material` has zero imports in `src/`. `react-hook-form` appears only inside the unused `src/app/components/ui/form.tsx` shadcn primitive. Neither is part of the live UI surface today — do not assume they're wired up.

## SSR / Prerender Constraints

The site is SSR-prerendered for 18 routes (9 RU + 9 EN). Conventions that come from this:

- **Components used in prerendered routes must not depend on `window`, `localStorage`, or `navigator` during the initial render.** Guards like `if (typeof window === "undefined")` in `LangContext.tsx:25, 62` are the canonical shape.
- **Routes mounted in `src/main.tsx` and `scripts/entry-server.tsx` must mirror each other** for every prerendered path. A mount in `main.tsx` without a counterpart in `entry-server.tsx` prerenders an empty `<div id="root">`; a mount in `entry-server.tsx` without `main.tsx` triggers React #418/#423 during hydration.
- **`React.lazy()` is only safe for SPA-only routes** — `entry-server.tsx` cannot resolve lazy chunks during `renderToString`. The lazy-loaded pages (`SuccessPage`, `AccountPage`, `DownloadSkillPage`) are intentionally NOT mounted in `entry-server.tsx`. See `src/main.tsx:20-27`.

## CSS / Styling

- Tailwind 4 via `@tailwindcss/vite` plugin (`vite.config.ts`). No `tailwind.config.js` — Tailwind 4 uses CSS-first config.
- Single CSS entry: `src/styles/index.css` imports `fonts.css`, `tailwind.css`, `theme.css` (in that order).
- Theme tokens live in `src/styles/theme.css` as CSS custom properties on `:root` (`--background`, `--foreground`, `--primary`, `--radius`, etc.). Use the token, not the literal color — e.g. `bg-primary` not `bg-[#030213]`.
- Fonts self-hosted as variable WOFF2 from `/public/fonts/`, declared in `src/styles/fonts.css`. `PT Root UI` uses `font-display: swap` with an adjusted-fallback face; `Unbounded` uses `font-display: block` with `<link rel=preload>` in `index.html`. Don't switch back to Google Fonts `@import` — see comment header in `fonts.css:1-26`.
- Component-level styles: Tailwind utility classes inline in JSX. Arbitrary values (`text-[#9cfb51]`, `text-[14px]`, `px-[20px]`) are common — design tokens come from Figma exports, not a constrained palette.
- Hardcoded font-family in className strings: `font-['PT_Root_UI',sans-serif]` and `font-['PT_Root_UI:Medium',sans-serif]` appear inline. Pattern is inconsistent — some files inherit body font, others re-declare.

## Function & Module Design

**Function size:** mostly short helpers (≤ 10 lines) plus a few large page components (`PayPage.tsx`, `AccountPage.tsx`, `BlogPostPage.tsx`) that exceed 300 lines and mix data fetching, Paddle integration, and JSX in a single default export. No `useMemo`/extraction pattern enforced — split only when something concrete breaks. New cross-page concerns (i18n routing, language storage, blog content) get their own small modules instead (`paths.ts`, `LocalizedLink.tsx`, `LangSwitcher.tsx`, `src/content/blog/`) — that's the precedent set by the Phase 3 post-release work.

**Module exports:** one default export per page component / per stand-alone navigation primitive; named exports for hooks, providers, pure helpers, and shadcn primitives. Barrel files for `src/content/blog/index.ts` (re-exports posts) and build outputs.

**Constants placement:** module-top, above the component. Duplicated across files (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_FUNCTIONS_URL`, `CHROME_STORE_URL`) — see CONCERNS / INTEGRATION-CONTRACT. Changing one without the others breaks the extension link. `EN_SIBLINGS`, `SITE_ORIGIN`, `DEFAULT_OG_IMAGE` have one canonical home (`paths.ts` and `seo-routes.ts` respectively) and are reused by import; new constants should follow the canonical-home pattern, not the duplicate pattern.

## Anti-Conventions / Avoid

- **Never hand-edit `src/imports/**`.** It's auto-generated by Figma Make — SVG path data, image-hash filenames, opaque `Frame5`/`Frame161` helper components. The landing page (`src/app/App.tsx`) was hand-rebuilt from `imports/LandingPage/LandingPage.tsx`; `App.tsx` is the source of truth, the import is reference-only.
- **Don't import from `react-router-dom`.** This project is on React Router v7 — always `import { Link, ... } from "react-router"`. Verified: 0 occurrences in `src/` and `scripts/`.
- **Don't use bare `<Link>` for internal navigation.** Use `LocalizedLink` so the `/en/` prefix is preserved. The only legitimate bare `<Link>` is inside `LocalizedLink.tsx` itself.
- **Don't add a `tsconfig.json` casually.** Vite + `@vitejs/plugin-react` work without one. Introducing strict TS now will surface a wall of errors in `imports/` and `ui/` scaffold files — quarantine them via `exclude` if you add a config.
- **Don't add `@/` imports next to relative ones in the same file.** Pick one. Current codebase is 100% relative.
- **Don't drop new module-level constants for `EXTENSION_IDS` / `SUPABASE_*` without updating every duplicate.** They're hardcoded in `src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, and `api/download-skill.ts` — keep them in sync. See `docs/INTEGRATION-CONTRACT.md`.
- **Don't rename routes** `/welcome`, `/pay`, `/success` — they're referenced by already-shipped extension binaries. `/en/welcome` and `/en/pay` are additions, never renames or redirects of the locked routes.
- **Don't switch Paddle to async `<script defer>` in `index.html`** — see Phase 2.2 commit history; current strategy is sync on `/pay` AND `/en/pay` only (prerender injects the tag for both) and `ensurePaddle()` for SPA-nav cases.
- **Don't reach into `chrome.storage.local` directly.** The site never imports a Supabase JS client and never owns auth tokens — all extension state flows through `chrome.runtime.sendMessage`.
- **Don't write to `localStorage.opten_lang_v3` outside `LangContext.setLang`.** Auto-writes on detect are what caused the EN-pinned-to-RU bug; the new key was specifically picked to throw away the contaminated history. `LangProvider` reads but never writes.
- **Don't revive the legacy `opten_lang` key.** It's read only as a one-shot migration for explicit-EN choices; intentionally never written. A new key (`opten_lang_v4`, etc.) would be required if storage semantics need to change again.
- **Don't mutate `<html lang>` at runtime via `document.documentElement.lang = ...`.** That was the root cause of the Phase 2.2-carried hydration mismatch on `/` (Plan 01 of Phase 3 deleted the offending `useEffect`). `<html lang>` is baked at build time per route via `applyHtmlLang` in `scripts/prerender.mjs` and does NOT change during SPA navigation — that's the documented D-07 behavior.
- **Don't forget the 6-file SYNC when adding a new route or blog post.** See `docs/CONTENT-AUTHORING.md` §1 — missing one file breaks prerender, sitemap, or SPA navigation.

---

*Convention analysis: 2026-05-18 — covers v1.0 (GEO Optimization) + Phase 5 (blog migration). Cross-reference [[CONTENT-AUTHORING.md]] for route registration + blog conventions.*
