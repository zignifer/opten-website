---
phase: 3
slug: bilingual-routing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None** — project has no unit/integration test suite by design (CLAUDE.md "no tests, no lint, no typecheck"). Build pipeline + manual smoke + post-deploy `fetch_page.py` is the chosen acceptance gate. |
| **Config file** | n/a |
| **Quick run command** | `npm run build` (TS errors surface during `vite build`; emits `dist/` with all prerendered files) |
| **Full suite command** | `npm run build && npm run preview` (serves `dist/` on `http://localhost:4173/` for in-browser smoke) |
| **Estimated runtime** | ~20–35 s for build, ~2 s for preview server bootstrap |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` — exit 0, no TS errors, expected output files emitted (12 prerendered HTML files in `dist/`: 6 RU + 6 EN).
- **After every plan wave:** Run `npm run build && npm run preview`. Manually smoke 12 routes in browser; check zero console hydration warnings on `/` and `/en/` (Plan 01 acceptance bar).
- **Before `/gsd-verify-work`:** Vercel preview deploy is live AND every route in the GEO-C-2 table responds 200 AND `fetch_page.py` reports `has_ssr_content: true`, `word_count > 100` for `/en/` with a distinct `<title>` from `/`.
- **Max feedback latency:** ~35 s (build) per commit; ~3 min wall-clock for full wave smoke (build + preview + 12-route manual check).

---

## Per-Task Verification Map

> Plan IDs are forward-references — actual task IDs will be assigned by gsd-planner. Status starts ⬜ pending and is updated by executor as plans land. Requirement IDs map verbatim to `.planning/REQUIREMENTS.md` Phase 3.

| Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01 (hydration fix on `/`) | 1 | — (carry-over from Phase 02.2) | — | Zero React hydration warnings on initial `/` render after `npm run preview`, including with `navigator.language=en` simulated via Chrome DevTools Sensors | manual + DevTools console | `npm run build && npm run preview` then open `http://localhost:4173/` with Console open; assert zero "Hydration failed" / "did not match" / `<html>` attribute warnings | ❌ Plan 01 emits the fix | ⬜ pending |
| 02 (RouteMeta + 6 EN entries + htmlLang field) | 2 | GEO-C-1, GEO-C-4 | — | `scripts/seo-routes.ts` has 13 entries (7 RU + 6 EN) each with `htmlLang: "ru" \| "en"`; build emits 6 new EN files | source assert + smoke | `npm run build && ls dist/en/index.html dist/en/welcome/index.html dist/en/pay/index.html dist/en/privacy/index.html dist/en/terms/index.html dist/en/refund/index.html` — all 6 exist | ❌ Plan 02 emits | ⬜ pending |
| 03 (prerender.mjs emits nested EN dirs + per-route `<html lang>`) | 2 | GEO-C-1, GEO-C-4 | — | Every emitted HTML file's `<html lang="...">` matches its `htmlLang` manifest entry | source assert + grep | `grep -H '<html lang=' dist/index.html dist/en/index.html dist/welcome/index.html dist/en/welcome/index.html dist/privacy/index.html dist/en/privacy/index.html` — RU files emit `lang="ru"`, EN files emit `lang="en"` | ❌ Plan 03 emits | ⬜ pending |
| 04 (hreflang triplet block in `<head>`) | 2 | GEO-C-3 | XSS via hreflang (defense-in-depth) | Every prerendered `<head>` contains 3 `<link rel="alternate" hreflang="...">` tags: `ru`, `en`, `x-default`; URL values built from `seo-routes.ts` (no user input) and passed through `escapeAttr` | smoke + grep | `for f in dist/index.html dist/en/index.html dist/welcome/index.html dist/en/welcome/index.html dist/pay/index.html dist/en/pay/index.html dist/privacy/index.html dist/en/privacy/index.html dist/terms/index.html dist/en/terms/index.html dist/refund/index.html dist/en/refund/index.html; do echo $f $(grep -c 'rel="alternate"' "$f"); done` — every count == 3 | ❌ Plan 04 emits | ⬜ pending |
| 05 (Paddle injection symmetric for `/en/pay` + INTEGRATION-CONTRACT.md §6 update) | 2 | GEO-C-2 (locked routes preserved + EN sibling shipping) | Paddle script-load race on `/en/pay` | `dist/en/pay/index.html` contains the same synchronous Paddle CDN `<script>` tag as `dist/pay/index.html`; `docs/INTEGRATION-CONTRACT.md` §6 updated with the `/en/pay` extension (and `## Last sync` line bumped per §8) | smoke + grep + docs assert | `diff <(grep -o 'paddle.*\.js' dist/pay/index.html) <(grep -o 'paddle.*\.js' dist/en/pay/index.html)` — empty (identical); `grep -c '/en/pay' docs/INTEGRATION-CONTRACT.md` — ≥ 1 | ❌ Plan 05 emits | ⬜ pending |
| 06 (LangContext URL-prefix detection + remove `useEffect` writing `documentElement.lang`) | 2 | GEO-C-4 | — | `src/i18n/LangContext.tsx` `detectLang()` returns `"en"` when `window.location.pathname.startsWith("/en/")`; the URL prefix takes precedence over `localStorage.opten_lang` and `navigator.language`; the previous `useEffect` writing `document.documentElement.lang` is deleted (Plan 01 root cause); `LangProvider` reacts to `useLocation` changes | source assert + manual | `grep -n "startsWith(\"/en/\")" src/i18n/LangContext.tsx` — ≥ 1 line; `grep -c "document.documentElement.lang" src/i18n/LangContext.tsx` — 0 | ❌ Plan 06 emits | ⬜ pending |
| 07 (sitemap.mjs lists 12+ entries with hreflang annotations) | 3 | GEO-C-2, GEO-C-3 | — | `dist/sitemap.xml` lists every shipped page (≥ 12: 6 RU + 6 EN — Plan 05 self-corrects to 13 because `/pay` is already in the Phase-2 sitemap as `prerender != "none"`); each entry carries `<xhtml:link rel="alternate" hreflang="...">` annotations for its siblings | source assert + xmllint or grep | `npm run build && grep -c '<loc>' dist/sitemap.xml` — ≥ 12 (actual: 13 after Plan 02 + 05); `grep -c '<xhtml:link' dist/sitemap.xml` — ≥ 24 (each entry has at least 2 alternates) | ❌ Plan 07 emits | ⬜ pending |
| 08 (`/en/*` routes in `src/main.tsx` + header switcher uses `useNavigate`) | 3 | GEO-C-1, GEO-C-4 | Open Redirect via switcher | `BrowserRouter` route table covers `/en/`, `/en/welcome`, `/en/pay`, `/en/privacy`, `/en/terms`, `/en/refund`; header switcher routes through `react-router useNavigate` to allow-listed EN sibling paths (no user-supplied URL fragments); switcher behavior on `/success`, `/account`, `/dashboard/download-skill` falls back to `/en/` (or to `/`) — never an unguarded `navigate(arg)` | source assert + manual smoke | `grep -c '/en/' src/main.tsx` — ≥ 6 (one per EN route); `grep -c "useNavigate\|navigate(" src/app/<header-switcher-file>` — uses allow-list, no untrusted-input pass-through | ❌ Plan 08 emits | ⬜ pending |
| 09 (post-deploy fetch verification — Vercel preview) | gate | GEO-C-1..C-4 | Indexing of disallowed paths via EN siblings (defense-in-depth) | Deployed preview URL responds 200 on every route in the matrix; `fetch_page.py` reports SSR content for `/en/`; `robots.txt` extended with explicit `Disallow: /en/account`, `/en/success`, `/en/dashboard/` even though those paths emit no real content | manual + curl + Python | `for p in / /welcome /pay /privacy /terms /refund /en/ /en/welcome /en/pay /en/privacy /en/terms /en/refund; do curl -sI "<preview-url>$p" \| head -1; done` — all 200; `python ~/.claude/skills/geo/scripts/fetch_page.py "<preview-url>/en/"` — `has_ssr_content: true`, `word_count > 100`, `<title>` distinct from `/` | ❌ Phase gate | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No framework install, no test stubs, no shared fixtures needed — acceptance gate is `npm run build` + manual `npm run preview` smoke + post-deploy `fetch_page.py`, matching the verbatim Phase 2 acceptance protocol.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No React hydration warning on `/` initial render (Plan 01 acceptance) | — (Phase 02.2 carry-over) | Hydration warnings surface only in `npm run preview` + browser DevTools console; cannot be asserted at build time | Run `npm run build && npm run preview`. Open `http://localhost:4173/` with Chrome DevTools Console open. Assert zero warnings matching `Hydration failed`, `did not match`, or `<html>` attribute changes. Repeat with `navigator.language=en` simulated via DevTools Sensors. |
| EN content renders on `/en/` initial paint without RU-flash | GEO-C-1, GEO-C-4 | First-paint observation requires browser; SSR content can be asserted via curl but the perceptual "no flash" check is visual | `npm run preview` → open `/en/` directly (clear cache). Confirm headings/copy render in English from the first frame, no millisecond-window RU. |
| Header language switcher routes URL (not just content) | D-05, D-07b | Requires DOM interaction | `npm run preview` → click EN switcher on `/welcome` → URL becomes `/en/welcome` AND content updates. Reverse: click RU on `/en/welcome` → URL becomes `/welcome`. |
| Shipped extension still hits `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` at root paths (hard constraint) | GEO-C-2 + CON-locked-routes-keep-existing-paths | Requires running the extension or curl simulation | After Vercel preview deploy: `for p in /welcome /pay /success /account /dashboard/download-skill; do curl -sI "<preview-url>$p" \| head -1; done` — all 200. (No need to install the extension; the contract is "path responds 200 with the expected page".) |
| Paddle Checkout opens correctly on `/en/pay` (D-03b symmetry) | GEO-C-2 + DEC-integration-contract-paddle-init | Requires JS execution in a browser | `npm run preview` → `/en/pay` → click upgrade CTA → Paddle Checkout modal opens (no console errors about missing Paddle global). Repeat on `/pay` to confirm parity. |

---

## Validation Sign-Off

- [ ] All plans land verifiable acceptance criteria (build assertions + grep assertions + manual smoke instructions)
- [ ] Sampling continuity: every plan has at least one automated build/grep gate; manual-only gates are explicitly listed above
- [ ] Wave 0 covers all MISSING references — N/A (no framework, no stubs needed)
- [ ] No watch-mode flags used (single-shot `npm run build` per commit; preview server is bounded by manual smoke window)
- [ ] Feedback latency < 35 s per commit
- [ ] `nyquist_compliant: true` set in frontmatter after all plan acceptance criteria pass

**Approval:** pending
