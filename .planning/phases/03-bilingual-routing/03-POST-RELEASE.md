---
tags:
  - gsd
  - phase
  - bugfix
phase: 3
milestone: "geo-optimization"
kind: post-release-fixes
status: resolved
opened: 2026-05-16
closed: 2026-05-17
---

# Phase 3 — Post-Release Fixes

Two user-facing bugs surfaced after the user approved Phase 3 and the phase
was closed on 2026-05-16 (`be10eb3`). Both were caused by gaps in the original
D-07b / D-05 implementation — the URL-as-source-of-truth model worked for the
SEO scenario but had UX cracks for the cross-page flow.

Documented here (rather than reopening the phase) because the fixes ship on
the same milestone and reuse the Phase 3 contract; the planning loop was not
re-run.

## Bug 1 — EN browser, page still RU

**Symptom (reported 2026-05-16):** user changed browser language to English,
opened `https://opten.space/`, content stayed in Russian.

**Root cause:** `LangContext.detectLangFromStorage()` honored any value in
`localStorage.opten_lang`. Older builds (pre-Phase-3) auto-wrote `"ru"` on
detect, so EN-browser visitors with the stale value were pinned to RU forever
even after switching their browser. `navigator.language` never got a chance.

**Fix (commit `c789dee`):**
- Bumped storage key from `opten_lang` to `opten_lang_v3`.
- Legacy key is still read, but **only when its value is `"en"`** (an explicit
  EN choice — `"ru"` could have come from auto-detect and is intentionally
  discarded so navigator gets a fresh chance).

**Files touched:** `src/i18n/LangContext.tsx`.

## Bug 2 — Language doesn't persist across navigation

**Symptom (reported 2026-05-16):** clicking LangSwitcher on `/` flipped to
`/en/`, but clicking any internal link (Pricing / Privacy / Account) snapped
back to RU.

**Root causes (two interacting issues):**

1. The Phase 3 `LangSwitcher` deliberately did NOT write `localStorage` (per
   the D-07b note "URL is the source of truth — never writes to localStorage
   directly"). Once the user navigated to a non-`/en/*` URL the LangProvider
   effect re-detected from navigator/storage and reverted.
2. All ~30 internal `<Link to="/...">` in the codebase stripped the `/en/`
   prefix on click. URL contract broke for both directions.

**Fix (commit `c789dee`):**
- `LangSwitcher` now calls `setLang(next)` (synchronous `localStorage.setItem`)
  before `navigate(target)`. The explicit choice persists into unprefixed
  navigation (`/account`, `/success`, `/dashboard/*` — locked routes that have
  no EN sibling by Phase 3 D-03 design).
- New `src/app/components/LocalizedLink.tsx`: drop-in `<Link>` replacement.
  When the current URL is `/en/*`, `to="/pay"` is rewritten to `"/en/pay"` for
  the 6 EN_SIBLINGS routes. On unprefixed URLs it passes through unchanged —
  preserves D-07's "URL does not change on auto-detect" contract.
- New `src/i18n/paths.ts`: single source of truth for `EN_SIBLINGS`,
  `toEnTarget`, `toRuTarget`, `localizeHref`. SYNC note mirrors the
  `scripts/seo-routes.ts` EN entries.
- All internal `<Link>`s in `App.tsx`, `PayPage.tsx`, `AccountPage.tsx`,
  `LegalLayout.tsx`, `SuccessPage.tsx`, `DownloadSkillPage.tsx` migrated to
  `<LocalizedLink>`.

## Bug 3 (regression from Bug 2 fix) — LangSwitcher on non-sibling routes redirects to /en/

**Symptom (reported 2026-05-17):** after the Bug 2 fix shipped, clicking the
switcher on `/account` (and any other locked route without an EN sibling) was
dumping the user onto the EN landing instead of flipping language in place.

**Root cause:** `toEnTarget()` for non-sibling paths returned `EN_LANDING` as
a fallback target. The original intent was OQ-6 from the Phase 3 RESEARCH
("locked routes without EN sibling → route to EN landing"), but the UX was
clearly wrong — the user wants language to flip in place, not to be teleported
home.

**Fix (commit `bfd164b`):**
- `toEnTarget` / `toRuTarget` now return `string | null`. `null` means
  "no navigation — switcher should only flip state + storage."
- `LangSwitcher` checks the rewriter result; if it is `null` or equals the
  current pathname, it skips `navigate()` entirely.
- Trailing-slash normalization (`stripTrailingSlash`) so `/privacy` and
  `/privacy/` both resolve to the same sibling. Phase 2 D-07 says the
  canonical is unprefixed, but `vite preview` and some user inputs add the
  slash anyway.

**Files touched:** `src/i18n/paths.ts`, `src/app/components/LangSwitcher.tsx`.

## Behavior matrix (post-fix)

| Current URL | Click | New URL | Content |
|---|---|---|---|
| `/account` (non-sibling), RU | EN | `/account` *(unchanged)* | EN |
| `/account` (non-sibling), EN | RU | `/account` *(unchanged)* | RU |
| `/privacy` (sibling), RU | EN | `/en/privacy` | EN |
| `/en/privacy` (sibling), EN | RU | `/privacy` | RU |
| `/pay` (sibling), RU | EN | `/en/pay` (Paddle sync preserved) | EN |

## Verification

All scenarios verified via Playwright against the prerendered `dist/` over
`vite preview`. PageSpeed `/en/` mobile baseline before fixes = 92; after
fixes the bundle delta is ~1.5 KB raw / ≤0.6 KB gzip (LocalizedLink +
paths.ts), well below measurement noise.

## Commits

- `c789dee` — `fix(i18n): persist EN choice across navigation + bump storage key`
- `bfd164b` — `fix(i18n): keep user on current page when switching language on non-sibling routes`

Both pushed to `main`; auto-deployed by Vercel.

## Decision impact

Phase 3 contract D-01..D-07 is preserved:

- **D-02** (root `/` stays RU-canonical, no redirect) — unchanged.
- **D-03** (locked routes have no EN sibling) — unchanged; switcher now flips
  language in place instead of routing to `/en/` landing (UX correction).
- **D-05** (URL-prefix wins) — unchanged; LangProvider still reads pathLang first.
- **D-07** (unprefixed paths: content flips via storage/navigator, URL doesn't
  change on auto-detect) — unchanged; LangSwitcher click is an *explicit* user
  action so it can change URL when an EN sibling exists.
- **D-07b** (URL is the only way to change language during a session) —
  refined: still true for SEO-relevant `/en/*` siblings, but on locked
  no-sibling routes the language toggle has to flip without a URL change —
  there is no EN URL to navigate to. localStorage is now the persistence
  mechanism for that case.

No SSR/prerender/Paddle code touched.
