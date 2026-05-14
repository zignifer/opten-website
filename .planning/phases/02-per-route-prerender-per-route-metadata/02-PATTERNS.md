---
tags:
  - gsd
  - patterns
  - phase
phase: 2
milestone: "geo-optimization"
kind: phase-patterns
---
# Phase 2: Per-route prerender + per-route metadata — Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 7 (4 new in `scripts/`, 3 modified at repo root / `src/`)
**Analogs found:** 4 strong / 3 with no analog (scripts/ is greenfield in this repo)

## Headline Findings

- **`scripts/` directory does not exist.** Verified via `Glob("scripts/**/*")` — zero matches. Phase 1 confined itself to `public/`, `index.html`, `vercel.json`. Phase 2 establishes the convention from scratch. The planner must pick conventions deliberately rather than mirror an existing analog.
- **There is NO `tsconfig.json` at the repo root.** Verified via `Glob("tsconfig*.json")` — only matches are inside `node_modules/` and the unrelated `WebsiteMotion/` folder. TypeScript validation happens only via `vite build` (Vite's internal `esbuild` pass). This is why CLAUDE.md states "no typecheck script."
- **The repo is ESM-only.** `package.json` declares `"type": "module"` (line 5) — every `.js`/`.mjs`/`.cjs` extension behaves accordingly. New `.mjs` scripts get ESM by extension; new `.ts` files get ESM via the `"type": "module"` setting when compiled.
- **The single existing TS-on-Node example is `api/download-skill.ts`** — a Vercel serverless function, NOT a build-time script. Its conventions (Node 20 `node:`-prefixed imports, top-level constants in `UPPER_SNAKE_CASE`, top-of-file phase comment) are the closest reference for `scripts/entry-server.tsx` and `scripts/prerender.mjs`, but the runtime context differs (request handler vs CLI script).
- **No `.cjs`/`.mjs` files in repo root other than `postcss.config.mjs`** — the only existing `.mjs` analog in the repo is a 15-line Tailwind-v4 placeholder. Not a useful pattern source.

## File Classification

| New / Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `scripts/seo-routes.ts` (NEW) | build-time TS manifest (data module) | static export consumed by build script | `src/i18n/ru.json` (flat keyed dict, "central source of truth" shape) + `EXTENSION_IDS` arrays in `src/app/pages/PayPage.tsx` (typed const array, sync-comment convention) | **partial** — same "single source of truth" pattern, different output shape |
| `scripts/entry-server.tsx` (NEW) | SSR React tree entry (build-time, compiled via Vite) | imports React components → exports `renderRoute(path)` | `src/main.tsx` (same Routes structure, sub-set; sibling, NOT parent — see Pitfall in research) | **role-match, opposite render API** — copy the Routes block, swap `BrowserRouter`→`StaticRouter`, swap `createRoot().render()`→`renderToString()` |
| `src/i18n/LangContext.tsx` (MODIFY) | React context provider — SSR-safety patch | existing client-only module made SSR-safe | self (surgical edit on lines 30, 37) | **exact** — modifying the file itself |
| `scripts/prerender.mjs` (NEW) | Node postbuild orchestrator (CLI) | reads `dist/`, writes `dist/`, dynamically imports SSR bundle | **No in-repo analog** — `api/download-skill.ts` is the closest Node-on-Vercel TS file but it's a request handler, not a CLI script. Use it only for imports-style and top-of-file phase-comment conventions. | **no analog (Node CLI)** — researcher's Pattern 4/5/Example B is the source of truth |
| `package.json` (MODIFY) | npm scripts edit | existing `"build"` script extended | self (surgical edit on line 7) | **exact** — modifying the file itself |
| `src/main.tsx` (MODIFY) | App bootstrap — hydration detector patch | existing entry made SSR-aware | self (surgical edits on lines 2 and 40) | **exact** — modifying the file itself |
| `.gitignore` (MODIFY) | dotfile config — one-line addition | existing ignore list extended | self (one new line) | **exact** — modifying the file itself |

## Pattern Assignments

---

### `scripts/seo-routes.ts` (NEW) — TS data manifest

**Primary analog:** `src/app/pages/PayPage.tsx` `EXTENSION_IDS` array — the closest in-repo example of a typed, hardcoded const-array with a sync comment.

**Secondary analog:** `src/i18n/ru.json` (flat keyed dict — same "single source of truth" concept, different shape).

**Sync-comment convention** (from `EXTENSION_IDS` duplication policy documented in CLAUDE.md "CRITICAL"):

The repo's existing pattern for duplicated-but-must-stay-in-sync data is a comment at the top of the duplicate naming the canonical source. Apply this convention here: any string that also lives in `src/i18n/ru.json` gets a `// SYNC:` comment.

**Import / module style** (verified from `api/download-skill.ts` lines 10–22 — only in-repo TS-on-Node example):

```typescript
// scripts/seo-routes.ts
// Phase 2 D-03 / GEO-B-2: Per-route metadata manifest.
// SYNC: title/description strings duplicated from src/i18n/ru.json — keep both
// in step until Phase 3 introduces a unified i18n→manifest pipeline.

export interface RouteMeta {
  path: string;
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

export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;

export const routes: RouteMeta[] = [
  // ... entries from RESEARCH.md Pattern 6 ...
];
```

**Conventions to follow:**
- `UPPER_SNAKE_CASE` for module-level constants — matches `api/download-skill.ts` lines 14, 20, 22 (`SUPABASE_URL`, `ZIP_PATH`, `CORS_ORIGIN`) and CLAUDE.md "Naming" section.
- Top-of-file 2-line phase comment naming the decision IDs — matches `api/download-skill.ts` lines 1–3 phase-reference style (`// Phase 73 DIST-01: …`).
- Named exports only (no default export) — matches CLAUDE.md "Naming" + every existing TS module in the repo.
- Two-space indent — matches all existing `.ts`/`.tsx` files.

**Data flow:** static export → consumed by `scripts/entry-server.tsx` (for routing) AND by `scripts/prerender.mjs` (for metadata substitution + sitemap emission). Per RESEARCH.md Open Question 1, compile through `vite build --ssr` so Node can `import` the resulting `.mjs` without `--experimental-strip-types`.

---

### `scripts/entry-server.tsx` (NEW) — SSR React tree entry

**Primary analog:** `src/main.tsx` lines 1–14, 40–56.

**Routes block to copy (subset)** — current `src/main.tsx` lines 43–53:

```typescript
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

**Subset to mount in SSR entry** (D-02 full-prerender tier only — 5 routes, NOT 9):
- `/` → `<App />`
- `/welcome` → `<WelcomePage />`
- `/privacy` → `<PrivacyPage />`
- `/terms` → `<TermsPage />`
- `/refund` → `<RefundPage />`

**Imports to transform** — from `src/main.tsx` lines 1–14:

```typescript
// CURRENT (main.tsx line 2)
import { BrowserRouter, Routes, Route } from "react-router";
// SSR ENTRY equivalent (RESEARCH.md confirms StaticRouter re-export at react-router root in v7)
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router";
```

**Import-path convention** — `src/main.tsx` lines 4–12 import pages with the explicit `.tsx` extension (e.g., `import App from "./app/App.tsx";`). **Match this exactly** — it is the project-locked extension policy (Vite's React plugin requires the explicit extension for these specific imports in this config). From `scripts/entry-server.tsx`, the relative path becomes `../src/app/App.tsx`.

**Render API swap:**

```typescript
// In main.tsx (line 40):
createRoot(document.getElementById("root")!).render(<LangProvider>…</LangProvider>);

// In entry-server.tsx (exports a function, does NOT mount):
export function renderRoute(path: string): string {
  return renderToString(
    <LangProvider>
      <StaticRouter location={path}>
        <Routes>{/* subset above */}</Routes>
      </StaticRouter>
    </LangProvider>
  );
}
```

**Conventions to follow:**
- Same explicit `.tsx` extension on relative imports of page components (matches `src/main.tsx` lines 4–12).
- Keep `import "../src/styles/index.css"` even though CSS is a no-op under SSR — Vite SSR build will warn otherwise (RESEARCH.md Pattern 1 note).
- DO NOT import `src/main.tsx` itself — it calls `createRoot` at module load and will crash in Node (RESEARCH.md "Anti-Patterns to Avoid").
- DO NOT import `PayPage`, `SuccessPage`, `AccountPage`, `DownloadSkillPage` — they read `EXTENSION_IDS`, `SUPABASE_URL`, Paddle env (`import.meta.env.VITE_PADDLE_ENV`); leaving them out of the SSR bundle is what protects the integration contract.

**Data flow:** `scripts/prerender.mjs` does `await import(".ssr-cache/entry-server.mjs")` → calls `renderRoute(path)` for each `prerender: "full"` route → splices the returned string into `dist/index.html` template.

---

### `src/i18n/LangContext.tsx` (MODIFY) — surgical SSR-safety patch

**Analog:** the file itself (no rewrite — two-line surgical edit).

**EXACT lines that must change** (verified by reading the current file):

| Current line # | Current code | Action |
|----------------|--------------|--------|
| 30 | `const [lang, setLangState] = useState<Lang>(detectLang);` | Replace with `const [lang, setLangState] = useState<Lang>("ru");` |
| 31 (new) | _(blank line today)_ | Insert a new `useEffect` that runs `setLangState(detectLang())` on mount |

**Lines that must NOT change** (verified — they are SSR-safe as written):
- Lines 1–8 (imports + STORAGE_KEY)
- Lines 9–13 (`detectLang` function) — body stays as-is; it's only its CALL SITE that moves
- Lines 15–28 (dicts, interface, context default)
- Lines 32–35 (`setLang` — only runs on user interaction, post-hydration)
- Lines 37–39 (existing `useEffect` that syncs `document.documentElement.lang`) — already deferred to client tick, no change needed
- Lines 41–58 (`t`, `LangProvider` JSX return, `useT`, `useLang`)

**Exact patch shape** (RESEARCH.md Example D):

```typescript
// BEFORE (line 30):
const [lang, setLangState] = useState<Lang>(detectLang);

// AFTER (lines 30–34):
const [lang, setLangState] = useState<Lang>("ru");  // D-05: SSR-safe RU default

useEffect(() => {
  // detectLang() reads localStorage + navigator — defer to client mount
  setLangState(detectLang());
}, []);
```

**Critical:** `useEffect` is already imported at line 1 (`import { …, useEffect } from "react";`) — no import change needed.

**Data flow:** SSR renders with `lang === "ru"` → hydration commits matching RU DOM → effect fires post-hydration → if user previously chose EN, `setLangState("en")` triggers a normal client re-render (no hydration warning). Documented and accepted in RESEARCH.md Pitfall 2.

---

### `scripts/prerender.mjs` (NEW) — Node postbuild CLI

**Analog: NONE in this repo.** Phase 1 created no scripts; `api/download-skill.ts` is the closest TS-on-Node file but it's a request handler, not a CLI. Use the researcher's RESEARCH.md Pattern 4 / Pattern 5 / Example B as the source of truth.

**Conventions extracted from `api/download-skill.ts` (lines 1–34) that DO transfer:**

```typescript
// 1) Top-of-file phase comment (api/download-skill.ts lines 1–8)
// Phase 73 DIST-01: Auth-gated skill bundle download endpoint.
// Validates user's Supabase JWT, checks active Pro subscription, streams opten.zip.

// 2) node:-prefixed built-in imports (api/download-skill.ts lines 10–12)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

// 3) UPPER_SNAKE_CASE module constants (api/download-skill.ts lines 14–22)
const SUPABASE_URL = "…";
const ZIP_PATH = join(process.cwd(), "api", "_assets", "opten.zip");
```

**Apply to `scripts/prerender.mjs`:**

```javascript
// scripts/prerender.mjs
// Phase 2 GEO-B-2 / GEO-B-3: Postbuild prerenderer for marketing routes.
// Reads dist/index.html, imports SSR bundle, splices per-route head + body,
// writes dist/{route}/index.html + dist/sitemap.xml.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SSR_BUNDLE = resolve(ROOT, ".ssr-cache", "entry-server.mjs");
```

**Conventions specific to this script (no in-repo precedent — researcher-prescribed):**
- Extension: `.mjs` (ESM by extension, even though `package.json` already declares `"type": "module"` — the extension is unambiguous and matches `postcss.config.mjs` precedent).
- Top-level `await` is fine (Node 20+, ESM).
- Path alias `@` → `./src` is **NOT** available here (CLAUDE.md "Conventions": "Path alias `@` → `./src` available but most imports are relative" — and Vite's resolver is not in this script's process). Use `node:path` `resolve(__dirname, "..", "src", …)` for any path computation. **Researcher flagged this in RESEARCH.md Pattern Map row 1.**
- Use `console.log("✓ …")` for progress logs — matches Phase 1's verification-recipe style; no logging library exists in the repo.
- Assert-on-no-match for every `.replace()` call (RESEARCH.md Pattern 4 "Safety net") — `throw new Error(...)` causes `npm run build` to exit non-zero, which is the project's only verification gate per CLAUDE.md.
- Build-time `BUILD_DATE = new Date().toISOString().split("T")[0]` computed once at script start (D-04).

**Data flow:**
- Inputs: `dist/index.html` (Vite's SPA shell), `.ssr-cache/entry-server.mjs` (compiled SSR bundle), `.ssr-cache/seo-routes.mjs` (compiled manifest).
- Outputs: `dist/{route}/index.html` × 5 (full tier) + `dist/pay/index.html` (head-only) + `dist/sitemap.xml`.
- Side effects: overwrites `dist/index.html` for the `/` route; overwrites `dist/sitemap.xml` copied by Vite from `public/sitemap.xml`.

---

### `package.json` (MODIFY) — npm scripts edit

**Analog:** the file itself (one-line edit).

**Current state** (lines 5–9):

```json
"type": "module",
"scripts": {
  "build": "vite build",
  "dev": "vite"
},
```

**EXACT lines to preserve unchanged:**
- Line 5: `"type": "module"` — DO NOT TOUCH. ESM-mode is a project invariant.
- Line 8: `"dev": "vite"` — DO NOT TOUCH. Researcher RESEARCH.md Risks row "build time grows" applies only to `build`; dev workflow stays SPA-only.
- Lines 10–66: `dependencies` block — DO NOT TOUCH. No new packages are needed (RESEARCH.md Standard Stack: zero new deps).
- Lines 67–72: `devDependencies` — DO NOT TOUCH for the same reason.
- Lines 73–84: `peerDependencies` / `peerDependenciesMeta` — DO NOT TOUCH. React 18 lock is integration-contract-adjacent.
- Lines 85–88: `pnpm.overrides` — DO NOT TOUCH. Vite version is pinned here.

**Lines to modify** — line 7 only:

```json
// CURRENT
"build": "vite build",

// AFTER (single line):
"build": "vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && node scripts/prerender.mjs",
```

**Optional new script** (the planner may or may not add `preview` — current `package.json` lacks one but `npm run preview` works anyway via Vite's CLI default). If added, place AFTER `dev`, never between `build` and `dev`.

**Conventions to follow:**
- Two-space indent matches the existing file.
- Trailing comma after `"dev": "vite"` only if other entries follow — the current file omits it. If only `build` and `dev` exist, NO trailing comma after `dev`.
- No version bump anywhere (CLAUDE.md "No release versioning").

**Data flow:** `npm run build` → vite SPA build → vite SSR build of entry+manifest → node postbuild script → `dist/` ready for Vercel.

---

### `src/main.tsx` (MODIFY) — hydration detector patch

**Analog:** the file itself (two surgical edits — line 2 import, line 40 render).

**EXACT lines that MUST be preserved byte-for-byte:**

| Lines | Content | Why locked |
|-------|---------|------------|
| 1 | _(blank — file starts with a leading blank line; preserve it)_ | Existing convention |
| 2 (import object only) | `from "react-dom/client";` part stays | Same module, add `hydrateRoot` to the imported names |
| 3 | `import { BrowserRouter, Routes, Route } from "react-router";` | `BrowserRouter` is still needed for the SPA-fallback case |
| 4–14 | Page imports + `LangProvider` import | DO NOT TOUCH. Researcher RESEARCH.md "Anti-Patterns": the SSR entry must NOT import `main.tsx`, but `main.tsx` keeps importing every page for the SPA tree. |
| 16–38 | **Paddle.js bootstrap block** | **LOCKED** by DEC-integration-contract-paddle-init. Researcher RESEARCH.md Pattern 3: "Paddle bootstrap survives hydration". The block must stay between the imports and the render call, untouched. |
| 43–53 | The full 9-route `<Routes>` block | DO NOT TOUCH. The SSR entry is a SUBSET; the client tree keeps all 9 routes. |

**EXACT lines that change:**

| Line | Before | After |
|------|--------|-------|
| 2 | `import { createRoot } from "react-dom/client";` | `import { createRoot, hydrateRoot } from "react-dom/client";` |
| 40–56 | `createRoot(document.getElementById("root")!).render(...)` (current single expression) | Extract the JSX into a `const tree = (...)`, then branch on `root.hasChildNodes()` (RESEARCH.md Example C / Pattern 2) |

**Two-space indent convention** — verified: the existing file uses two-space indent throughout. New code must match.

**Comment style** — the file uses block-comment dividers (lines 16, 23) with `===` delimiters and references decision IDs (`Phase 66 D-14 (FE-05)`, `BG-67-01`, `Pitfall #4`). The hydration patch should add its own comment in the same style:

```typescript
// === Hydration detector — Phase 2 D-06 (GEO-B-1) ===
// Prerendered routes have body content in <div id="root">…</div>; SPA routes have
// the empty <div id="root"></div>. Vite minifies index.html with no inner whitespace
// so hasChildNodes() is a reliable discriminator (RESEARCH.md Pitfall 3).
```

**Critical pitfall reminder for the planner:**
- The `// BG-67-01` comment at lines 21–24 documents the Paddle-Environment-set bug. The hydration patch MUST NOT alter the order: Paddle init runs BEFORE the render call (whether `createRoot` or `hydrateRoot`).

**Data flow:** `main.tsx` runs on every route in the browser. On prerendered routes (`/`, `/welcome`, `/privacy`, `/terms`, `/refund`) → `hasChildNodes() === true` → `hydrateRoot`. On SPA-only routes (`/pay`, `/account`, `/success`, `/dashboard/*`) → empty `#root` → `createRoot().render()`.

---

### `.gitignore` (MODIFY) — one-line addition

**Analog:** the file itself (one new line).

**Current content** (verified by reading the file):

```
node_modules
dist
.vite
*.local
.env
.env.*

.vercel
.env*.local

.obsidian/workspace.json
.obsidian/workspaces.json
```

**Convention to follow:**
- One pattern per line.
- Group separators are blank lines (between `*.local` and `.vercel`, between `.env*.local` and the `.obsidian/*` lines).
- No comments in the existing file — do not add comments.
- `dist` is already on line 2 (good — Vite output already ignored).

**Exact addition** — append `.ssr-cache` near `dist` (logical grouping: both are build outputs). Suggested placement: line 3, immediately after `dist`. The trailing slash is optional in `.gitignore` syntax; pick **without trailing slash** to match the `dist` precedent on line 2.

**Data flow:** prevents `.ssr-cache/` (the intermediate output of `vite build --ssr`) from being committed.

---

## Shared Patterns

### Pattern S-1: ESM-by-default module convention

**Source:** `package.json` line 5 (`"type": "module"`), `postcss.config.mjs` lines 1–15.

**Applies to:** every new `.mjs` / `.ts` file in `scripts/`.

**Convention:**
- New `.ts` files: use ESM syntax (`import`/`export`); they will be compiled to `.mjs` via the SSR Vite build.
- New `.mjs` files: ESM is implied by both `"type": "module"` and the extension; use `import.meta.url` for path resolution (no `__dirname` on ESM).
- DO NOT use `require()`, `module.exports`, or `__dirname` directly. The repo has zero CommonJS sources outside `node_modules/`.

```javascript
// scripts/prerender.mjs — ESM `__dirname` recovery pattern
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
```

### Pattern S-2: Top-of-file phase comment with decision IDs

**Source:** `api/download-skill.ts` lines 1–8, `src/main.tsx` lines 16–24, every `.planning/phases/` artifact.

**Applies to:** `scripts/seo-routes.ts`, `scripts/entry-server.tsx`, `scripts/prerender.mjs`.

**Convention:** First non-blank line of every new file is a `// Phase N <ID>:` reference (e.g. `// Phase 2 GEO-B-2 / D-03:`). Match CLAUDE.md "Comments" section: "Phase references: `// Phase 66:`, `// Phase 73:` — match the extension repo's phase numbering when changes span both repos. Design decisions: `// D-04:`, bugs: `// BG-67-01:`."

### Pattern S-3: UPPER_SNAKE_CASE module-level constants

**Source:** `api/download-skill.ts` lines 14, 20, 22 (`SUPABASE_URL`, `ZIP_PATH`, `CORS_ORIGIN`); `src/app/App.tsx` lines 14–15 (`STORE_URL`, `ASSET_ROOT`); CLAUDE.md "Naming" section verbatim.

**Applies to:** `scripts/seo-routes.ts` (`SITE_ORIGIN`, `DEFAULT_OG_IMAGE`), `scripts/prerender.mjs` (`ROOT`, `DIST`, `SSR_BUNDLE`, `BUILD_DATE`).

**Convention:** Top-of-file constants are `UPPER_SNAKE_CASE`. Locals and exports that are functions/objects/types are `camelCase` / `PascalCase` respectively.

### Pattern S-4: Sync-comment for duplicated data

**Source:** `EXTENSION_IDS` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` duplicated across `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts` — CLAUDE.md "CRITICAL" section documents this as the project's accepted duplication policy.

**Applies to:** `scripts/seo-routes.ts` only (the title / description strings overlap with `src/i18n/ru.json` — RESEARCH.md Open Question on whether to import or duplicate). Researcher recommends duplicate with `// SYNC:` comments — same convention.

### Pattern S-5: Two-space indent + explicit `.tsx` extension on local imports

**Source:** every `.tsx` / `.ts` file in `src/`; `src/main.tsx` lines 4–12 (page imports with `.tsx`).

**Applies to:** `scripts/entry-server.tsx`.

**Convention:** Two-space indent. Local relative imports of `.tsx` files include the `.tsx` extension. Imports of `.ts` files and `node_modules` packages do NOT include extensions. Match the existing style verbatim — there is no Prettier or ESLint to auto-format.

### Pattern S-6: Verification via `npm run build` exit code

**Source:** Phase 1 `1-PLAN.md` Tasks 2, 5, 8 Step-2-or-3 "Build and verify" pattern; CLAUDE.md "Tech stack": "TS errors surface during `vite build` (`npm run build`)".

**Applies to:** every Phase 2 plan task.

**Convention:** The only automated gate is `npm run build` exit 0. Each task that touches a file under build watch should end with a `npm run build` check before commit. Manual verification is `npm run preview` + `curl` + `~/.claude/skills/geo/scripts/fetch_page.py` — RESEARCH.md "Verification Recipe" enumerates the exact commands.

---

## No Analog Found

Files where the planner cannot mirror existing project code and must follow RESEARCH.md patterns directly:

| File | Role | Reason no in-repo analog |
|------|------|--------------------------|
| `scripts/prerender.mjs` | Node CLI postbuild script | Repo has zero CLI scripts. `api/download-skill.ts` is a serverless handler (different runtime contract). Use RESEARCH.md Pattern 4/5 + Example B. |
| `scripts/seo-routes.ts` (the data shape — manifest of route metadata) | Typed data manifest | Closest analog is `src/i18n/ru.json` (flat keyed string dict — different shape) or `EXTENSION_IDS` (string array — different shape). Use RESEARCH.md Pattern 6 `RouteMeta` interface. |
| `scripts/entry-server.tsx` (the file as a whole — SSR entry pattern) | Build-time SSR entry | `src/main.tsx` is the closest sibling but it's a client-side bootstrap (calls `createRoot` at module load). The SSR-entry pattern itself comes from RESEARCH.md Pattern 1 + Example E. |

**For all three:** RESEARCH.md is the authoritative source. The pattern map's job is only to ensure the planner uses the **project-local conventions** (ESM, UPPER_SNAKE_CASE, phase comments, two-space indent, explicit `.tsx` extension on page imports) when writing files modelled on RESEARCH.md's prescriptions.

---

## Anti-patterns / Code NOT to copy

Per CLAUDE.md and verified by reading: the following in-repo code MUST NOT be used as a pattern source.

| Don't pattern after | Why |
|--------------------|-----|
| `src/imports/**/*.ts` (Figma-Make-generated SVG paths) | CLAUDE.md "File structure": "Figma-Make-generated SVG paths (auto-generated; brittle)". These files are write-only artifacts from Figma export. |
| `src/main.tsx` import of itself / circular | RESEARCH.md "Anti-Patterns": SSR entry must NOT import `main.tsx` (would crash on `createRoot`-at-module-load). |
| Adding `tsconfig.json` to the repo root | No tsconfig exists. Vite's internal config handles TS compilation. Researcher's plan does NOT call for one. CLAUDE.md "no typecheck script" is intentional. |
| `react-router-dom` in any new import | Researcher RESEARCH.md "Anti-Patterns to Avoid": v7 unified everything into `react-router`; `react-router-dom` does not exist in v7. |
| `react-helmet-async` (runtime head) | D-01 rejected; RESEARCH.md "Anti-Patterns". |
| `cheerio` / `jsdom` for HTML mutation | RESEARCH.md "Don't Hand-Roll": 8 anchored regex replacements is the correct shape for this template. |
| Adding `cleanUrls: true` to `vercel.json` | RESEARCH.md Pitfall 6 + assumption A5: Vercel serves `dist/welcome/index.html` at `/welcome` automatically without `cleanUrls`. `cleanUrls` strips `.html` extensions from FILE paths, a different concern. |

---

## Integration-Contract Guardrails

Pulled from CLAUDE.md "CRITICAL" + RESEARCH.md "Project Constraints" — every Phase 2 plan task must respect these.

| Constraint | Files this phase touches that could break it | Mitigation |
|------------|----------------------------------------------|------------|
| Sync `<script src="cdn.paddle.com/paddle/v2/paddle.js">` in `index.html` line 86 | `scripts/prerender.mjs` (template-copies `dist/index.html` per route) | Prerender mutates only the 8 head tags in RESEARCH.md Pattern 4 + injects body in Pattern 5. The Paddle preconnect (line 85) and the sync script (line 86) are NOT targets of any `.replace()`. Verification recipe item (4) confirms presence in all 6 emitted files. |
| `EXTENSION_IDS` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` duplicated across 3 page files + `api/download-skill.ts` | NONE — Phase 2 does not modify any of those 4 files | Plan tasks must NOT mention `src/app/pages/{PayPage,AccountPage,DownloadSkillPage}.tsx` or `api/download-skill.ts`. Confirmed: SSR entry deliberately omits PayPage/AccountPage/SuccessPage/DownloadSkillPage. |
| Locked routes `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` | `scripts/seo-routes.ts` (defines routes), `scripts/entry-server.tsx` (subset), `src/main.tsx` (full set) | Phase 2 ADDS files at these paths (`dist/welcome/index.html`, `dist/pay/index.html`); never renames or removes. SPA routes keep their current SPA-fallback behavior. |
| `<html lang="ru">` hardcoded | `scripts/prerender.mjs` template-copies the `<html>` opening tag | Template copy is verbatim — `<html lang="ru">` is preserved. Phase 3 changes this (out of scope). |

---

## Metadata

**Analog search scope:** repo root, `src/**`, `api/**`, `public/**`, `scripts/**` (empty), `.planning/phases/01-static-geo-foundations/**`.
**Files scanned (read in full):** `src/main.tsx`, `src/i18n/LangContext.tsx`, `index.html`, `api/download-skill.ts`, `package.json`, `vite.config.ts`, `.gitignore`, `postcss.config.mjs`, `src/app/App.tsx` (header), `.planning/phases/01-static-geo-foundations/1-PLAN.md`, `02-CONTEXT.md`, `02-RESEARCH.md`.
**Files scanned (existence/structure check via Glob):** `scripts/**`, repo-root `tsconfig*.json` (both confirmed absent).
**Pattern extraction date:** 2026-05-15
**Confidence:** HIGH for in-repo conventions (small surface area, every file directly read); HIGH for "no analog exists" findings (Glob confirms absence); MEDIUM for `scripts/prerender.mjs` patterns (no in-repo precedent — relies on RESEARCH.md prescriptions).

## PATTERN MAPPING COMPLETE
