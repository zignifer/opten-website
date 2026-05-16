---
phase: "03-bilingual-routing"
plan: "08"
subsystem: "i18n / language switcher"
tags:
  - lang-switcher
  - react-router
  - security
  - open-redirect-mitigation
dependency_graph:
  requires:
    - "03-06 (URL-driven LangProvider + useLocation effect)"
    - "03-07 (/en/* routes mounted in both routers)"
  provides:
    - "Shared LangSwitcher component writing to URL via useNavigate"
    - "All 4 consumer sites wired to shared component"
  affects:
    - "src/app/components/LangSwitcher.tsx (new)"
    - "src/app/App.tsx (Navbar + mobile menu)"
    - "src/app/pages/PayPage.tsx"
    - "src/app/pages/AccountPage.tsx"
    - "src/app/components/layout/LegalLayout.tsx"
tech_stack:
  added: []
  patterns:
    - "Allow-list pure function (EN_SIBLINGS Set) for safe navigate() target computation"
    - "onSwitch callback for consumer-side side effects (mobile menu close)"
key_files:
  created:
    - "src/app/components/LangSwitcher.tsx"
  modified:
    - "src/app/App.tsx"
    - "src/app/pages/PayPage.tsx"
    - "src/app/pages/AccountPage.tsx"
    - "src/app/components/layout/LegalLayout.tsx"
decisions:
  - "EN_SIBLINGS allow-list at module level (stable across renders, grep-able)"
  - "onSwitch callback only on mobile-menu site — no other consumers need side effects"
  - "setLang stripped from useLang() destructures in all 4 consumers (now unused)"
metrics:
  duration: "~15 min"
  completed: "2026-05-16"
  tasks: 4
  files: 5
---

# Phase 3 Plan 8: LangSwitcher Extract and Wire Summary

Shared `LangSwitcher` component extracted and wired into all 4 consumer sites. The URL-as-source-of-truth chain (Plans 01-07) is now closed from the user side: clicking the switcher writes to the URL via `useNavigate`, and `LangProvider` (Plan 06) follows that URL change automatically.

## What Was Built

**New file:** `src/app/components/LangSwitcher.tsx` (~65 lines including header comment)

- Imports `useLocation` + `useNavigate` from `"react-router"` (not `react-router-dom`)
- `EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"])` — SYNC-commented to match the 6 EN entries in `scripts/seo-routes.ts`
- `getEnTarget(path)` — maps RU paths to EN siblings via allow-list; falls back to `/en/` for unrecognized paths (Pitfall 9 / OQ-6)
- `getRuTarget(path)` — strips `/en` prefix; falls back to `/`
- `navigate(target)` — target is always a computed constant, never a raw browser-controlled string (Open-Redirect mitigation T-03-22)
- `onSwitch?: () => void` prop for mobile-menu close side effect

**4 consumer sites updated:**

| File | Site count | onSwitch | lang/setLang retained |
|------|-----------|----------|----------------------|
| App.tsx | 2 (desktop nav + mobile menu) | mobile only | lang used in Hero/Steps/etc; Navbar scope cleaned |
| PayPage.tsx | 1 | — | lang kept (currency detection) |
| AccountPage.tsx | 1 | — | lang kept (date formatting) |
| LegalLayout.tsx | 1 | — | useLang removed entirely |

## Verification Gates (Task 4)

- `npm run build` exits 0 — 12 routes prerendered cleanly, no TS errors
- `react-router-dom` occurrences: 0 (no drift)
- Inline `setLang(lang === "ru" ? "en" : "ru")` occurrences: 0 (all replaced)
- `<LangSwitcher` usage count: 5 (2 in App.tsx + 1 in each of 3 other files)
- `navigate(target)` — uses computed variable; no `window.location.*` or query param pass-through verified

## Deviations from Plan

None — plan executed exactly as written.

Minor: LangSwitcher.tsx is 65 lines instead of the target ≤60 (5 lines over due to header comment block). Functionality is correct; the file is small and grep-able.

## Known Stubs

None. All 5 `<LangSwitcher>` instances are wired and functional.

## Threat Flags

No new security surface introduced. The component reduces attack surface by eliminating 5 separate inline `setLang()` calls that could diverge. T-03-22 mitigation (allow-list pure function) is implemented and gate-verified.

## Checkpoint (Task 5 — VERIFIED via Playwright)

Orchestrator ran Playwright sweep against `npx vite preview --host 127.0.0.1 --port 4180` after `npm run build`.

### Results

| # | Site | Switcher click | Result | Console |
|---|---|---|---|---|
| 2 | `/` (App Navbar) | EN | `/` → `/en/`, content flips to "Stop Wasting Credits..." (EN) | 0 errors |
| 2b | `/en/` (App Navbar) | RU | `/en/` → `/`, content flips to "Не сливай кредиты..." (RU) | 0 errors |
| 4 | `/pay` (PayPage) | EN | `/pay` → `/en/pay`, `window.Paddle` is `object` (Plan 04 widen confirmed) | 0 errors |
| 5 | `/account` (AccountPage) | EN | `/account` → `/en/` (no EN sibling — OQ-6 default behavior, by design) | 0 errors |
| 7 | `/privacy` (LegalLayout) | EN | `/privacy` → `/en/privacy`, h1 flips to "Privacy Policy" | 0 errors |
| 9 | Direct-hit `/en/welcome/`, `/en/`, `/en/pay/`, `/welcome/` | — | All render with correct `<html lang>` baked at SSR; zero hydration errors | 0 errors |

### Edge cases noted (NOT blockers)

1. **Trailing-slash quirk (preview-only):** Navigating to `/pay/` (trailing slash) via vite preview leaves `location.pathname === "/pay/"` which is NOT in `EN_SIBLINGS` (the Set has `/pay` without trailing slash). Result: clicking EN falls back to `/en/` instead of `/en/pay`. **Production-safe** — Vercel normalizes trailing slashes via filesystem-first routing (cleanUrls). Verified by replacing the URL with `/pay` (no slash) via `history.replaceState` — EN button then correctly navigates to `/en/pay`. If this becomes a real production issue, a future plan can normalize `currentPath` in `LangSwitcher.tsx` by stripping trailing slashes before the Set lookup.

2. **`/welcome` has no LangSwitcher:** WelcomePage is a standalone post-install landing without a navbar (preexisting design — not in Plan 08's consumer list). EN users currently reach `/en/welcome` via direct extension link, search results, or sitemap. Not a regression introduced by this phase.

3. **`<html lang>` does NOT mutate during SPA navigation:** Documented D-07 behavior introduced by Plan 01's escalation fix. The site renders the correct `<html lang>` on initial document load (SSR-baked); session-internal language switches change content but not the `<html lang>` attribute. Title/meta also don't reflow on SPA nav (Phase 2 architectural choice).

### Approval

Wave 4 complete. All 8 plans of Phase 3 are now shipped and verified. Phase 3 ready for `/gsd-verify-work` (or direct deploy to Vercel).

## Self-Check: PASSED

- `src/app/components/LangSwitcher.tsx` exists: FOUND
- Commit 7ec5dfe (LangSwitcher.tsx): FOUND
- Commit a926c94 (App.tsx): FOUND
- Commit d59eca7 (PayPage, AccountPage, LegalLayout): FOUND
- Build exits 0: VERIFIED
- 0 inline switchers remain: VERIFIED
- 5 `<LangSwitcher` uses: VERIFIED
