# Coding Conventions

**Analysis Date:** 2026-05-21

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx`, one component per file — `SiteHeader.tsx`, `FaqBlock.tsx`, `LocalizedLink.tsx`, `LangSwitcher.tsx`
- Non-component TS modules: lowercase — `LangContext.tsx`, `paths.ts`, `paddle.ts`, `landingFaq.ts`
- Page files: PascalCase + "Page" suffix — `PayPage.tsx`, `AccountPage.tsx`, `ModelPage.tsx`, `BlogPostPage.tsx`
- UI primitives (shadcn/Radix): lowercase kebab-case — `button.tsx`, `dropdown-menu.tsx`, `alert-dialog.tsx`
- Build scripts: lowercase kebab-case — `verify-faq-mainentity.mjs`, `build-models-registry.mjs`, `smoke-blog.mjs`
- Auto-generated Figma imports: `src/imports/<ScreenName>/` — do NOT hand-edit

**Functions:**
- React components: PascalCase — `SiteHeader()`, `FaqBlock()`, `App()`, `LangProvider()`
- Event handlers: camelCase with semantic prefix — `handleError()`, `handleClick()`, `closeMenu()`
- Utility functions: camelCase — `titleCaseEn()`, `formatDate()`, `detectLangFromStorage()`, `localizeHref()`
- Local helper components inside a file: PascalCase — `Accent()`, `Logo()`, `ChromeIconSmall()`, `PartnerLink()`

**Variables:**
- State variables: camelCase — `lang`, `extStatus`, `loadingSub`, `error`, `email`
- Booleans: camelCase, often with `is`/`has`/`can`/`did` prefix — `didError`, `hasChildNodes`, `pathMatches`, `scrolled`
- Loop/temporary: camelCase — `tried`, `srcSuffix`, `locale`, `px`
- Refs: camelCase with `Ref` suffix — `panelRef`, `buttonRef`

**Types & Interfaces:**
- PascalCase, named semantically — `Props`, `SiteHeaderProps`, `FaqItem`, `Subscription`, `ExtStatus`, `Currency`, `Lang`
- No `I`-prefix (not used in this codebase)

**Constants (Module-level):**
- UPPER_SNAKE_CASE for critical configuration
  - Extension identifiers: `EXTENSION_IDS` (duplicated across `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts` — **SYNC required per INTEGRATION-CONTRACT**)
  - Supabase credentials: `SUPABASE_FUNCTIONS_URL`, `SUPABASE_ANON_KEY` (duplicated, **SYNC required**)
  - External links: `CHROME_STORE_URL`, `STORE_URL`
  - i18n: `STORAGE_KEY`, `LEGACY_STORAGE_KEY` (i18n storage keys)
  - UI: `CURRENCY_STORAGE_KEY` (payment preference)
  - Paths: `ASSET_ROOT`, `BASE`, `DIST` (in build scripts)

**i18n Keys:**
- Dot-namespaced structure in `ru.json`/`en.json` — `hero.title`, `partners.label`, `pricing.heading.accent`, `account.error.loadSubFailed`, `faq.heading`
- Accessed via `t()` helper: `t("hero.title")` (see `LangContext.tsx`)

**localStorage Keys:**
- `opten_lang_v3` — explicit user language choice (written by `LangSwitcher` only, read at boot)
- `opten_lang` — legacy key, read-only for one-shot EN migration (RU values ignored intentionally)
- `opten_pay_currency` — selected payment currency (RUB or USD)

**Extension Storage Keys (read-only via `chrome.runtime.sendMessage`):**
- `ps_*` prefix — extension-owned (site never reads directly, only via message API)

## Code Style

**Formatting:**
- NO Prettier config (`.prettierrc*` absent)
- NO ESLint config (`.eslintrc*` absent at root)
- Manual formatting: 2-space indentation observed consistently, double-quoted strings preferred, trailing commas in multi-line literals

**Import Organization:**
1. React + hooks: `import { useState, useEffect } from "react"`
2. React Router: `import { Link, useParams } from "react-router"` (v7 only, NOT `react-router-dom`)
3. Context/i18n: `import { useT, useLang } from "../../i18n/LangContext"`
4. Local components: relative paths — `import LocalizedLink from "../components/LocalizedLink"`
5. Content/utilities: `import { landingFaq } from "../content/landingFaq"`
6. Libraries: `import { Menu, X } from "lucide-react"`
7. Assets: `import featureModelsSrc from '../../public/assets/...'`
8. Stylesheets: `import "./styles/index.css"`

**Path Aliases:**
- `@` → `./src` configured but **not used** — all imports are relative paths
- New code should follow relative convention for consistency

**TypeScript:**
- `tsconfig.json` not present at repo root — TS errors surface during `npm run build` via `vite build`
- NO separate `typecheck` script
- Type errors checked at bundle time only — best-effort, lossy

**JSX/TSX:**
- React Router 7 syntax: `import { Link } from "react-router"`
- **MUST use `<LocalizedLink>` for internal navigation** to preserve `/en/*` URL prefix (not bare `<Link>`)
- Props always typed via interfaces: `interface Props { items: readonly FaqItem[] }`
- Components destructure props: `export default function FaqBlock({ items, headingKey = "faq.heading", id = "faq" }: Props)`
- Return type annotation: explicit `JSX.Element` or implicit (modern React)

**CSS & Tailwind:**
- Tailwind 4 via `@tailwindcss/vite` plugin
- All styling via utility classes in JSX — NO component scoped CSS
- Arbitrary Tailwind values: `text-[#9cfb51]`, `px-[20px]` (design tokens from Figma)
- Custom fonts via Tailwind: `font-['Unbounded',sans-serif]`, `font-['PT_Root_UI',sans-serif]`
- Every `<img>` has explicit `width` and `height` for CLS guard

**Helper Functions:**
- Simple utility for class composition:
  ```typescript
  function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
  }
  ```
- Use instead of `clsx` library (which is available but not in core pattern)

## Comments

**When to Comment:**
- **Phase references:** `// Phase 73:`, `// Phase 66 D-04:` — matches extension repo numbering when changes span both repos
- **Design decisions:** `// D-04:`, `// D-08:` — reasoning for non-obvious patterns
- **Bug references:** `// BG-67-01:`, `// IN-04:` — incident/decision tracker
- **Complex blocks:** explain SSR guards, hydration logic, state transitions
- **SYNC markers:** `// SYNC:` for constants/manifests that must stay in step (e.g., `EXTENSION_IDS` across 4 files, `EN_SIBLINGS` in paths.ts vs seo-routes.ts)

**Examples from codebase:**
```typescript
// Phase 3 D-05: URL-prefix takes precedence over localStorage + navigator (GEO-C-4).
// Phase 2.2: fetchPriority dropped — React 18.3 doesn't normalize the camelCase JSX prop...
// Phase 4.1 WR-03: lang-aware FAQ anchor
// SYNC: EN_SIBLINGS MUST match the EN entries in scripts/seo-routes.ts
```

**NOT used:**
- JSDoc/TSDoc (mostly absent except prop descriptions in interfaces)
- Lengthy boilerplate comments

## Error Handling

**Pattern — Try/Catch with State-Driven UI:**
```typescript
// AccountPage.tsx
const fetchSubscription = async (authToken: string) => {
  setLoadingSub(true);
  try {
    const res = await fetch(SUPABASE_FUNCTIONS_URL + "/get-subscription", {
      headers: { "Authorization": "Bearer " + authToken },
    });
    const data = await res.json();
    if (res.ok) {
      setSub(data);
    } else {
      setError("Ошибка подписки: " + (data._debug_auth_error || data.error || res.status));
    }
  } catch {
    setError(t("account.error.loadSubFailed"));
  } finally {
    setLoadingSub(false);
  }
};
```

**Patterns:**
- Network errors: try/catch, display via state (`[error, setError]`)
- Missing dependencies: throw with descriptor: `throw new Error("useCarousel must be used within a <Carousel />")`
- Extension API: loop over `EXTENSION_IDS`, catch each, fallback if all fail:
  ```typescript
  for (const id of EXTENSION_IDS) {
    try {
      chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          // Try next ID
        }
      });
    } catch {
      // Next iteration
    }
  }
  ```

**No global error boundaries** — site uses SSR prerendering, not client-side error recovery

## Logging

**Framework:** native `console` only

**Patterns:**
- Build scripts: `console.log()` for progress, `console.error()` for failures, `throw new Error()` for halt
- Client-side: console statements not used in production (Vite minification strips them)
- Error reporting to user: state-driven (`[error, setError]`), displayed in-page

**Example (scripts/smoke-blog.mjs):**
```javascript
function assert(cond, label) {
  if (cond) {
    console.log(`  ✓ ${label}`);
    pass++;
  } else {
    console.log(`  ✗ ${label}`);
    fail++;
  }
}
```

## State Management

**React Context only** — no Redux, Zustand, or other libraries
- `LangContext` (`src/i18n/LangContext.tsx`) — singleton for i18n (`lang`, `setLang`, `t()`)

**localStorage:**
- Reads at boot: `LangContext` checks `opten_lang_v3` → legacy `opten_lang` → `navigator.language`
- Writes only from `LangSwitcher` on explicit user click
- NO auto-writes (prevents pinning users to stale language)

**Extension State (Read-Only):**
- Auth/subscription lives in extension's `chrome.storage.local` (`ps_*` keys)
- Site queries via `chrome.runtime.sendMessage(..., callback)` (externally_connectable, one-way)
- Site NEVER writes to extension storage

**Component State:** `useState()`, `useRef()` for local scope

## Function Design

**Size:**
- Components: ~100–300 LOC (e.g., `SiteHeader.tsx` is 150 LOC)
- Utilities: 5–50 LOC (e.g., `titleCaseEn()`, `formatDate()`)
- Pages: can exceed 300 LOC when mixing data fetching + JSX (e.g., `PayPage.tsx`, `AccountPage.tsx`)

**Parameters:**
- Destructured props object: `{ items, headingKey = "faq.heading", id = "faq" }`
- Default values in destructure: `headingKey = "faq.heading"`
- Optional callbacks: `rightSlot?: React.ReactNode`

**Return Values:**
- Components: `JSX.Element` (explicit or implicit)
- Functions: always typed (e.g., `fetchSubscription(token: string): Promise<void>`)
- "Not found" returns: `null` (e.g., `toEnTarget(pathname): string | null`)

## Module Design

**Exports:**
- One default export per file (rule of thumb)
- Named exports for utilities and types: `export interface FaqItem`, `export const EN_SIBLINGS`
- Barrel files: `src/content/blog/index.ts` exports `{ allBlogPosts, blogPostsBySlug }`

**No Circular Imports:**
- Clean dependency tree: pages → components → i18n → utilities
- Sibling imports avoided (use parent barrel file)

**Constants Placement:**
- Module-top, above components/functions
- Critical duplicates (like `EXTENSION_IDS`) must be kept in sync across all files per `docs/INTEGRATION-CONTRACT.md`

## Anti-Patterns to Avoid

**Routing & Navigation:**
- DO NOT: use bare `<Link>` for internal navigation → use `<LocalizedLink>` (post-Phase-3 bug fix)
- DO NOT: rename locked routes `/welcome`, `/pay`, `/success` — referenced by extension binaries
- DO NOT: write to `localStorage.opten_lang_v3` outside `LangContext.setLang` — caused EN-pinned-to-RU bug
- DO NOT: mutate `<html lang>` at runtime — baked at build time per route, never changes during SPA nav

**Constants & Config:**
- DO NOT: add duplicate module-level constants without updating INTEGRATION-CONTRACT.md sync requirements
- DO NOT: forget 6-file SYNC when adding a new route: `seo-routes.ts`, `paths.ts EN_SIBLINGS`, `main.tsx`, `entry-server.tsx`, `sitemap/llms manifests`, `i18n dicts`
- DO NOT: revive legacy `opten_lang` key for writing — it's read-only migration only

**TypeScript & Imports:**
- DO NOT: add `tsconfig.json` lightly — triggers wall of errors in `imports/` and `ui/` scaffold
- DO NOT: mix `@/` and relative imports in same file — pick one (codebase is 100% relative)
- DO NOT: import from `react-router-dom` — this is React Router v7, use `react-router`

**Figma & Auto-Generated:**
- DO NOT: hand-edit `src/imports/**` — auto-generated by Figma Make (source of truth is `App.tsx`, not the import)
- DO NOT: commit updated Figma imports without reviewing the hand-rebuilt landing

## Storage Keys & SYNC

**Critical SYNC Points:**

| Constant | Files | Reason |
|----------|-------|--------|
| `EXTENSION_IDS` | `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts` | Hardcoded extension identifiers for message API |
| `SUPABASE_FUNCTIONS_URL`, `SUPABASE_ANON_KEY` | Same 4 files + extension's `config/api.js` | API credentials for Supabase Edge Functions |
| `EN_SIBLINGS` | `src/i18n/paths.ts`, `scripts/seo-routes.ts`, `src/main.tsx`, `scripts/entry-server.tsx` | Routes with `/en/*` siblings (LocalizedLink, prerender, SPA mount) |

**See:** `docs/INTEGRATION-CONTRACT.md` for binding interface contract.

---

*Convention analysis: 2026-05-21 — covers v1.0 (GEO) + v2.0 (models) + Phase 5 (blog). Cross-reference [[CONTENT-AUTHORING.md]] for route registration checklist.*
