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

## Checkpoint (Task 5 — human-verify)

Task 5 is a `checkpoint:human-verify` gate. Manual smoke test required before phase is declared shippable:

**Steps for user to verify:**
1. `npm run build && npm run preview` — preview at `http://localhost:4173/`
2. Navbar switcher on `/` → URL becomes `/en/` → content EN → click RU → back to `/`
3. Switcher on `/welcome` → `/en/welcome` (bidirectional)
4. Switcher on `/pay` → `/en/pay` → Paddle modal opens without console errors
5. Switcher on `/account` → `/en/` (NOT `/en/account` — OQ-6 default)
6. Mobile menu switcher → closes menu after language change
7. Legal page switcher (`/privacy`) → `/en/privacy`
8. Locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) all return 200
9. Direct-hit to `/en/welcome`, `/en/`, `/en/pay` etc. → zero hydration warnings
10. `curl http://localhost:4173/sitemap.xml` shows bilingual entries

Type "approved" when all 10 steps pass.

## Self-Check: PASSED

- `src/app/components/LangSwitcher.tsx` exists: FOUND
- Commit 7ec5dfe (LangSwitcher.tsx): FOUND
- Commit a926c94 (App.tsx): FOUND
- Commit d59eca7 (PayPage, AccountPage, LegalLayout): FOUND
- Build exits 0: VERIFIED
- 0 inline switchers remain: VERIFIED
- 5 `<LangSwitcher` uses: VERIFIED
