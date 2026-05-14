---
phase: 02-per-route-prerender-per-route-metadata
plan: "07"
subsystem: client-bootstrap
tags:
  - gsd
  - summary
  - phase-02
  - hydration
  - seo
  - geo
dependency_graph:
  requires:
    - 02-per-route-prerender-per-route-metadata/06
  provides:
    - hydration-aware client bootstrap
  affects:
    - src/main.tsx
tech_stack:
  added:
    - hydrateRoot from react-dom/client
  patterns:
    - hasChildNodes() discriminator for prerendered vs SPA routes
    - const tree = (...) extraction to share single JSX tree between branches
key_files:
  modified:
    - src/main.tsx
decisions:
  - "D-06: hasChildNodes() is the discriminator — Vite minifies index.html with no inner whitespace, so empty SPA roots reliably return false while prerendered roots return true (RESEARCH.md Pitfall 3)"
  - "Paddle bootstrap block kept byte-identical — DEC-integration-contract-paddle-init / BG-67-01 preserved"
  - "All 9 client routes remain mounted — locked routes /pay, /welcome, /success, /account, /dashboard/download-skill stay in client tree"
metrics:
  duration: "5m"
  completed: "2026-05-15"
  tasks: 1
  files: 1
---

# Phase 2 Plan 07: Hydration-Aware Client Bootstrap Summary

Switched `src/main.tsx` from a single `createRoot` call to a `hasChildNodes()` detector that uses `hydrateRoot` for prerendered routes and `createRoot` for SPA-only routes.

## What Was Built

Two surgical edits to `src/main.tsx`:

**Region 1 — Line 2 (import):**
```
Before: import { createRoot } from "react-dom/client";
After:  import { createRoot, hydrateRoot } from "react-dom/client";
```

**Region 2 — Lines 40-56 (render call):**
Replaced the single `createRoot(document.getElementById("root")!).render(...)` expression with:
```tsx
// === Hydration detector — Phase 2 D-06 (GEO-B-2) ===
const tree = (
  <LangProvider>
    <BrowserRouter>
      <Routes>
        {/* 9 routes — byte-identical to prior file */}
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

Lines 1 and 3-39 (blank line, imports, Paddle bootstrap) are byte-identical to the prior commit.

## Paddle Bootstrap Preservation Audit

Lines 16-38 of the original file (the `if (window.Paddle) { ... }` block) are byte-identical in the new file:
- `if (window.Paddle)` guard: present (1 code occurrence)
- `window.Paddle.Environment.set("sandbox")` conditional: present
- `window.Paddle.Initialize({ token: paddleToken })`: present
- `// BG-67-01` comment: present (2 occurrences — in comment block and Phase 67 reference)
- `import.meta.env.VITE_PADDLE_ENV`: present
- `import.meta.env.VITE_PADDLE_CLIENT_TOKEN`: present
- Text-order check: `window.Paddle.Initialize` appears at line 32, `hydrateRoot(root, tree)` at line 66 — Paddle runs BEFORE render (verified by `awk` check: printed "OK paddle before render")

**git diff** shows zero `+`/`-` lines in lines 16-38 region — confirmed by inspecting the diff output.

## 9-Route Client Tree Inventory

| # | Path | Element | Lock Status |
|---|------|---------|-------------|
| 1 | `/` | `<App />` | Standard |
| 2 | `/pay` | `<PayPage />` | LOCKED — extension opens from popup CTA |
| 3 | `/success` | `<SuccessPage />` | LOCKED — YooKassa return_url |
| 4 | `/privacy` | `<PrivacyPage />` | Standard |
| 5 | `/terms` | `<TermsPage />` | Standard |
| 6 | `/refund` | `<RefundPage />` | Standard |
| 7 | `/account` | `<AccountPage />` | LOCKED — extension-coupled |
| 8 | `/welcome` | `<WelcomePage />` | LOCKED — extension navigates on first install |
| 9 | `/dashboard/download-skill` | `<DownloadSkillPage />` | LOCKED — Pro-only utility |

All 9 routes confirmed by `grep -c '<Route path=' src/main.tsx` → 9.

## Build Verification

`npm run build` exits 0. Full prerender chain output:
```
✓ / → dist/index.html (full)
✓ /pay → dist/pay/index.html (head)
✓ /welcome → dist/welcome/index.html (full)
✓ /privacy → dist/privacy/index.html (full)
✓ /terms → dist/terms/index.html (full)
✓ /refund → dist/refund/index.html (full)
✓ prerender complete: 6 routes emitted
✓ sitemap.xml → 6 routes (lastmod 2026-05-14)
```

**Dist artifact checks:**
- `dist/welcome/index.html` `<div id="root">`: contains `<div class="relative min-h-screen...` (prerendered React tree)
- `dist/pay/index.html` `<div id="root">`: empty string after tag (SPA shell, head-only tier)
- `dist/assets/index-CF-BmjR_.js`: contains both `hydrateRoot` and `createRoot`
- `dist/sitemap.xml`: 6 `<lastmod>` entries

## Rollback Recipe

```bash
git revert 2dba132
npm run build
```

Reverts `src/main.tsx` to `createRoot`-only behavior. The prerendered HTML files in `dist/` remain valid — they render correctly under `createRoot` (they lose post-paint DOM stability / hydration benefit, but the GEO win from the initial HTTP response is unaffected). Rollback is clean with no cascading breakage.

## Deviations from Plan

None — plan executed exactly as written. Two-region surgical edit applied per the plan's `<interfaces>` specification. `npm run preview` smoke test was not executable (no `preview` script in `package.json`; `npx vite preview` background process exits between Bash calls in this environment). Verified equivalent evidence via direct `dist/` artifact inspection: prerendered content confirmed in `dist/welcome/index.html`, empty root confirmed in `dist/pay/index.html`, bundled JS confirmed to contain both `hydrateRoot` and `createRoot`.

## Self-Check: PASSED

- `src/main.tsx` exists and contains `hydrateRoot`, `createRoot`, `hasChildNodes()`: CONFIRMED
- Commit `2dba132` exists: CONFIRMED (`git log --oneline -1` → `2dba132 feat(seo): switch to hydrateRoot...`)
- Build exits 0: CONFIRMED
- 6 prerendered routes in `dist/`: CONFIRMED
- Paddle bootstrap byte-identical in lines 16-38: CONFIRMED (diff shows no changes in that region)
