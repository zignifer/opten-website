---
phase: 03-bilingual-routing
plan: 07
type: execute
wave: 3
depends_on: [02]
files_modified:
  - scripts/entry-server.tsx
  - src/main.tsx
autonomous: false
requirements:
  - GEO-C-1
  - GEO-C-2
must_haves:
  truths:
    - "`scripts/entry-server.tsx` registers `<Route path=\"/en/\">`, `<Route path=\"/en/welcome\">`, `<Route path=\"/en/privacy\">`, `<Route path=\"/en/terms\">`, `<Route path=\"/en/refund\">` — 5 EN full-prerender routes (Plan 04 already shipped `/en/pay` Paddle injection; `/en/pay` is head-only per D-02 so it does NOT mount in entry-server)"
    - "`src/main.tsx` registers ALL 6 `/en/*` routes (`/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`) — full client mount for SPA navigation + direct hits"
    - "Routes are per-page (NOT wildcard `path=\"/en/*\"`) — `__PRERENDER_PATH` discriminator is an exact-path check (RESEARCH.md anti-pattern line 473)"
    - "Existing 9 root-path `<Route>` declarations in `src/main.tsx` remain untouched (locked-route invariant — `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` keep responding)"
    - "Existing 5 root-path `<Route>` declarations in `scripts/entry-server.tsx` remain untouched"
    - "Both files import from `\"react-router\"`, NEVER `\"react-router-dom\"` (CLAUDE.md convention + RESEARCH.md anti-pattern line 477)"
  artifacts:
    - path: "scripts/entry-server.tsx"
      provides: "SSR route table extended with 5 EN sibling routes"
      contains: "path=\"/en/welcome\""
    - path: "src/main.tsx"
      provides: "Client route table extended with 6 EN sibling routes"
      contains: "path=\"/en/welcome\""
  key_links:
    - from: "scripts/entry-server.tsx + src/main.tsx"
      to: "scripts/prerender.mjs renderRoute calls"
      via: "renderRoute(\"/en/welcome\") returns prerendered EN tree; main.tsx hydrates it via __PRERENDER_PATH discriminator"
      pattern: "renderRoute\\|hydrateRoot"
    - from: "src/main.tsx /en/* declarations"
      to: "scripts/entry-server.tsx /en/* declarations"
      via: "Phase 2 D-06 mirror invariant — every prerendered route mounts in both routers"
      pattern: "path=\"/en/"
---

<objective>
Register the 6 `/en/*` routes in both the client router (`src/main.tsx`) and the SSR router (`scripts/entry-server.tsx`), respecting:

- **Mirror invariant (Phase 2 D-06):** every route that prerenders MUST appear in `entry-server.tsx`; every route that hydrates MUST appear in `main.tsx`. The two files stay in lockstep.
- **Tier discipline (Phase 2 D-02):** `/en/pay` is `prerender: "head"` in the manifest — its `<head>` is emitted by `prerender.mjs` but its body comes from client mount only. So `/en/pay` mounts ONLY in `main.tsx`, NOT in `entry-server.tsx` (mirrors how `/pay` is treated today).
- **Per-page declarations, NOT wildcard:** `<Route path="/en/welcome">`, etc. — `__PRERENDER_PATH` discriminator does exact-string match (`main.tsx:65-66`), so wildcards would break the hydration flow (RESEARCH.md anti-pattern line 473).
- **Locked-route preservation (PROJECT.md):** the existing 9 root-path routes in `main.tsx:48-58` (incl. `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) and the 5 root-path routes in `entry-server.tsx:20-27` stay BYTE-IDENTICAL. This plan is purely additive.

With Plan 06 in place (URL-prefix-driven LangProvider with SSR-eager en.json gate), the new routes produce real EN-language prerendered HTML. With Plan 03 in place (build-time `<html lang>` + hreflang triplet + og:locale per file), every emitted file is correctly localized. With Plan 04 in place (Paddle widen), `/en/pay` carries the Paddle sync tag. This plan finishes the route surface area.

Closes GEO-C-1 (path-prefix design materialized in code) + GEO-C-2 (`/en/*` siblings ship; locked routes unaltered) at the routing layer.

Output: client + SSR router tables that recognize all `/en/*` URLs as real routes (not SPA-fallback) so direct hits and client navigation both produce the right component tree.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/phases/03-bilingual-routing/03-CONTEXT.md
@.planning/phases/03-bilingual-routing/03-RESEARCH.md
@.planning/phases/03-bilingual-routing/03-PATTERNS.md
@.planning/phases/03-bilingual-routing/03-VALIDATION.md
@scripts/entry-server.tsx
@src/main.tsx
@docs/INTEGRATION-CONTRACT.md
@CLAUDE.md

<interfaces>
<!-- Current router table shape. The EN routes are mirror-copies of the existing RU routes. -->

scripts/entry-server.tsx (current, 31 lines):
- Imports App, WelcomePage, PrivacyPage, TermsPage, RefundPage at top.
- renderRoute(path) wraps <LangProvider><StaticRouter location={path}><Routes>{<Route path="/" element={<App />}/>...etc...}</Routes></StaticRouter></LangProvider> and calls renderToString.
- ALREADY has 5 full-prerender routes mounted: `/`, `/welcome`, `/privacy`, `/terms`, `/refund`. `/pay` is intentionally NOT mounted (head-only per D-02; the comment at line 26 spells this out).

src/main.tsx (current, 72 lines):
- Imports App, PrivacyPage, TermsPage, RefundPage, WelcomePage STATICALLY (lines 5-9).
- Lazy-imports PayPage, SuccessPage, AccountPage, DownloadSkillPage (lines 18-21).
- Routes block (lines 48-58) mounts ALL 9 routes — full-prerender + head-only + SPA-only.
- __PRERENDER_PATH discriminator at lines 65-66 — exact-path string match against `window.location.pathname`.
- Vercel SPA rewrite (`/((?!api/).*) → /index.html`) serves `dist/index.html` (prerendered for `/`) at any uncovered route. The discriminator wipes the prerendered tree and `createRoot`s when the path doesn't match the prerender marker. ZERO changes needed in this plan — prerender.mjs already writes `window.__PRERENDER_PATH = "/en/welcome"` (etc.) to each EN file's `<script>` block via `applyMarker`, so the discriminator works unchanged for `/en/*` paths.

Reusing components: all 5 EN routes mount the SAME component as their RU sibling (`<App />` for `/en/`, `<WelcomePage />` for `/en/welcome`, etc.). The language flip is driven by LangProvider via useLocation (Plan 06) — components themselves are language-agnostic.

Reusing lazy imports: in main.tsx, `PayPage` is the same lazy import for both `/pay` and `/en/pay`. The lazy chunk loads once and serves both routes — no new lazy() call needed.

Phase 2 D-06 mirror invariant: this plan modifies BOTH entry-server.tsx and main.tsx in the same commit. Splitting them would leave the SSR/client desynced (one would prerender empty trees, the other would hydrate against the wrong content), tripping React #418/#423.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Register 5 EN full-prerender routes in scripts/entry-server.tsx</name>
  <read_first>
    - scripts/entry-server.tsx (full file — 31 lines)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§4, lines 226-254 — file-by-file mapping with verbatim Route declarations)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-02 + D-03 — /en/pay is head-only, NOT mounted in entry-server)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 6 — SSR EN body parity; Plan 06's SSR-eager en.json gate is what makes this work)
  </read_first>
  <action>
    In `scripts/entry-server.tsx`, in the `<Routes>` block (currently lines 20-27), add 5 new `<Route>` declarations immediately AFTER the existing 5 root-path declarations and BEFORE the closing `</Routes>` tag. Order: `/en/`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund` (mirror of the RU order). Each new line reuses the EXISTING component import (no new imports — `App`, `WelcomePage`, `PrivacyPage`, `TermsPage`, `RefundPage` are already imported at the top of the file):

      <Route path="/en/"        element={<App />} />
      <Route path="/en/welcome" element={<WelcomePage />} />
      <Route path="/en/privacy" element={<PrivacyPage />} />
      <Route path="/en/terms"   element={<TermsPage />} />
      <Route path="/en/refund"  element={<RefundPage />} />

    Use the same indent pattern as the existing 5 lines (10 spaces from the line start for `<Route` inside the `<Routes>` block). Update the trailing comment on the line currently at scripts/entry-server.tsx:26 (the `NOTE: /pay is head-only` comment) to include `/en/pay` in the same exclusion clause: e.g. `{/* NOTE: /pay AND /en/pay are head-only (D-02 + D-03b), /success /account /dashboard/* are SPA-only — intentionally NOT mounted here. */}`.

    DO NOT add `/en/pay` here — it's `prerender: "head"` (per Plan 02's manifest), meaning prerender.mjs emits its `<head>` but body stays empty (SSR doesn't render body for head-tier routes). The `entry-server.tsx` `renderRoute("/en/pay")` call path is never exercised because `prerender.mjs` line 141 only calls `renderRoute` when `meta.prerender === "full"`. So mounting `/en/pay` in entry-server has no effect — keep parity with `/pay` for cleanliness and don't add it.

    DO NOT touch the existing imports, `LangProvider` wrap, or `StaticRouter` props. The `StaticRouter location={path}` line continues to work — `useLocation` inside `LangProvider` (Plan 06's refactor) will return the right pathname.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/entry-server.tsx','utf-8'); const enRoutes=(s.match(/&lt;Route\s+path=\"\/en\//g)||[]).length; const noEnPay=!s.match(/&lt;Route\s+path=\"\/en\/pay\"/); const noWildcard=!s.match(/&lt;Route\s+path=\"\/en\/\*\"/); const rrImport=s.includes('from \"react-router\"') &amp;&amp; !s.includes('react-router-dom'); if(enRoutes!==5){console.error('FAIL: expected 5 /en/* Routes in entry-server.tsx, got '+enRoutes);process.exit(1)} if(!noEnPay){console.error('FAIL: /en/pay must NOT be mounted in entry-server (head-only per D-02)');process.exit(1)} if(!noWildcard){console.error('FAIL: wildcard /en/* breaks __PRERENDER_PATH discriminator');process.exit(1)} if(!rrImport){console.error('FAIL: must import from \"react-router\" not \"react-router-dom\"');process.exit(1)} console.log('PASS: 5 EN routes, no /en/pay, no wildcard, react-router import')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c '<Route path="/en/' scripts/entry-server.tsx` returns exactly `5`
    - `grep '<Route path="/en/pay"' scripts/entry-server.tsx` returns 0 matches (head-only routes don't SSR)
    - `grep '<Route path="/en/*"' scripts/entry-server.tsx` returns 0 matches (no wildcard)
    - `grep "react-router-dom" scripts/entry-server.tsx` returns 0 matches (correct package per CLAUDE.md)
    - File still parses — verified by `npm run build` in Task 3
  </acceptance_criteria>
  <done>
    entry-server.tsx mounts 5 EN full-prerender routes alongside the existing 5 RU routes. /en/pay is intentionally absent. No wildcard. No package drift.
  </done>
</task>

<task type="auto">
  <name>Task 2: Register 6 EN routes in src/main.tsx</name>
  <read_first>
    - src/main.tsx (full file — 72 lines)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§5, lines 258-294 — file-by-file mapping with verbatim Route declarations + lazy-import reuse note)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 7, lines 595-598 — __PRERENDER_PATH discriminator needs zero change; trust the existing data flow)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-02 + D-03 — /en/pay IS mounted in main.tsx because client SPA navigation needs it + direct hits hydrate via head-tier marker)
  </read_first>
  <action>
    In `src/main.tsx`, inside the `<Routes>` block (lines 48-58), add 6 new `<Route>` declarations immediately AFTER the existing 9 root-path declarations and BEFORE the closing `</Routes>` tag. Order: `/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund` (mirror of the RU order, grouping `/en/` first then `/en/pay`):

      <Route path="/en/"        element={<App />} />
      <Route path="/en/pay"     element={<PayPage />} />
      <Route path="/en/welcome" element={<WelcomePage />} />
      <Route path="/en/privacy" element={<PrivacyPage />} />
      <Route path="/en/terms"   element={<TermsPage />} />
      <Route path="/en/refund"  element={<RefundPage />} />

    Use the same indent as the existing lines (10 spaces from line start for `<Route` inside `<Routes>`). Reuse the existing imports: `App`, `WelcomePage`, `PrivacyPage`, `TermsPage`, `RefundPage` are statically imported (lines 5-9); `PayPage` is lazy-imported (line 18). No new imports needed. The lazy `PayPage` chunk serves both `/pay` and `/en/pay` (single chunk, one network fetch).

    Add a short banner comment immediately above the new 6 lines: `{/* Phase 3 D-01/D-03b: /en/* siblings. Mirror of entry-server.tsx EN routes + /en/pay (head-only, client-mount-only). __PRERENDER_PATH discriminator (lines 65-66) handles these unchanged — meta.path strings written by applyMarker include "/en/welcome" etc. */}`.

    DO NOT touch the existing 9 root-path Route declarations. DO NOT touch the lazy imports. DO NOT touch the __PRERENDER_PATH discriminator block (lines 65-72) — it works unchanged because `applyMarker` (prerender.mjs:67) JSON-stringifies the meta.path which is already `/en/welcome` etc. after Plan 02. DO NOT touch the `<Suspense fallback={<RouteLoading />}>` wrapper — it covers ALL routes including the new EN ones.

    DO NOT import from `"react-router-dom"`. The existing `import { BrowserRouter, Routes, Route } from "react-router";` at line 4 is correct.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('src/main.tsx','utf-8'); const enRoutes=(s.match(/&lt;Route\s+path=\"\/en\//g)||[]).length; const hasEnPay=s.match(/&lt;Route\s+path=\"\/en\/pay\"/); const noWildcard=!s.match(/&lt;Route\s+path=\"\/en\/\*\"/); const rrImport=s.includes('from \"react-router\"') &amp;&amp; !s.includes('react-router-dom'); const rootRoutes=(s.match(/&lt;Route\s+path=\"\/[a-z]/g)||[]).length; if(enRoutes!==6){console.error('FAIL: expected 6 /en/* Routes in main.tsx, got '+enRoutes);process.exit(1)} if(!hasEnPay){console.error('FAIL: /en/pay must be mounted in main.tsx for SPA navigation');process.exit(1)} if(!noWildcard){console.error('FAIL: wildcard /en/* breaks __PRERENDER_PATH discriminator');process.exit(1)} if(!rrImport){console.error('FAIL: react-router-dom import detected');process.exit(1)} console.log('PASS: 6 EN routes, /en/pay present, no wildcard, react-router import')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c '<Route path="/en/' src/main.tsx` returns exactly `6` (mirrors VALIDATION.md row Plan 08 — count threshold met)
    - `grep '<Route path="/en/pay"' src/main.tsx` returns 1 match
    - `grep '<Route path="/en/\*"' src/main.tsx` returns 0 matches
    - `grep "react-router-dom" src/main.tsx` returns 0 matches
    - The existing 9 root-path Routes (`/`, `/pay`, `/success`, `/privacy`, `/terms`, `/refund`, `/account`, `/welcome`, `/dashboard/download-skill`) are byte-stable — diff against the pre-Plan-07 file shows only additions, no deletions/modifications outside the new block
  </acceptance_criteria>
  <done>
    main.tsx mounts 6 EN routes alongside the existing 9. /en/pay reuses the lazy PayPage import. No wildcard. Locked routes untouched.
  </done>
</task>

<task type="auto">
  <name>Task 3: Build + grep all 12 dist files for prerender marker correctness + emit summary</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (rows Plan 02 + Plan 08 — file-exists + main.tsx grep gates)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 7 — verify __PRERENDER_PATH marker value for /en/welcome)
  </read_first>
  <action>
    Run `npm run build`. Verify exit 0. Then sweep the 12 emitted dist files:

    - All 12 files exist (6 RU + 6 EN, including head-tier `/pay` and `/en/pay`).
    - Every file has `window.__PRERENDER_PATH = "<path>"` set to its OWN path (e.g. `dist/en/welcome/index.html` has `window.__PRERENDER_PATH = "/en/welcome"`).
    - `dist/en/welcome/index.html` body contains English content (Plan 06's SSR-eager gate + Plan 07's route mount together produce EN body output).
    - `dist/welcome/index.html` body still contains RU content (regression check on the unprefixed sibling — Plan 06 + Plan 07 must not flip RU pages to EN).
    - `dist/en/index.html` body contains English content (EN landing renders App.tsx with EN dict).

    This task does NOT add a manual checkpoint — Task 4 of this plan is the human-verify step.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -20 &amp;&amp; node -e "const fs=require('fs');const files=['dist/index.html','dist/en/index.html','dist/welcome/index.html','dist/en/welcome/index.html','dist/pay/index.html','dist/en/pay/index.html','dist/privacy/index.html','dist/en/privacy/index.html','dist/terms/index.html','dist/en/terms/index.html','dist/refund/index.html','dist/en/refund/index.html'];let errors=0;for(const f of files){if(!fs.existsSync(f)){console.error('MISSING: '+f);errors++;continue}const s=fs.readFileSync(f,'utf-8');const expectedPath=f.replace(/^dist/,'').replace(/\/index\.html$/,'')||'/';const wantMarker='window.__PRERENDER_PATH='+JSON.stringify(expectedPath);if(!s.includes(wantMarker)){console.error(f+': missing or wrong __PRERENDER_PATH marker. Want '+wantMarker);errors++}}if(errors){console.error('FAIL: '+errors+' marker issues');process.exit(1)}console.log('PASS: all 12 files have correct __PRERENDER_PATH marker')"</automated>
  </verify>
  <acceptance_criteria>
    - All 12 dist files exist after build.
    - Every file's `window.__PRERENDER_PATH` marker equals its own path string (e.g. `dist/en/welcome/index.html` carries `window.__PRERENDER_PATH="/en/welcome"`; the test handles `dist/index.html` → `"/"` and `dist/en/index.html` → `"/en/"`)
    - `npm run build` exits 0
    - Manual spot-check: open `dist/en/welcome/index.html` and `dist/welcome/index.html` in a text editor and confirm the body strings differ (EN vs RU). This is a sanity check that LangProvider's `useLocation` is dispatching correctly during SSR.
  </acceptance_criteria>
  <done>
    All 12 files emit with correct prerender markers. EN bodies are English, RU bodies are Russian. Build exits 0.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Manual preview smoke — /en/* direct hits + SPA navigation + Paddle modal on /en/pay</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (§Manual-Only Verifications rows 2-5 — full test instructions for EN content on /en/, switcher behavior is in Plan 08, locked routes still respond, Paddle modal on /en/pay)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 1 — hydration warnings on these new routes are a separate concern from Plan 01's fix; this checkpoint catches any new ones introduced by Plans 03-07)
  </read_first>
  <what-built>
    Plans 01-07 are all in place:
    - Plan 01: deleted document.documentElement.lang write.
    - Plan 02: 13-entry manifest (7 RU + 6 EN).
    - Plan 03: prerender bakes <html lang>, hreflang triplet, og:locale per file.
    - Plan 04: /en/pay carries Paddle sync script; INTEGRATION-CONTRACT §6 updated; robots.txt extended.
    - Plan 05: sitemap.xml has 12+ entries with xhtml:link annotations.
    - Plan 06: LangProvider URL-driven; SSR-eager en.json for /en/* parity.
    - Plan 07 (this plan): /en/* routes registered in both routers.

    This checkpoint verifies the integrated build behaves correctly before Plan 08 wires the LangSwitcher to URL navigation.
  </what-built>
  <how-to-verify>
    1. From the repo root: `npm run build && npm run preview` — preview on `http://localhost:4173/`.
    2. **/en/welcome direct hit:** open `http://localhost:4173/en/welcome` in an Incognito window (clears localStorage). Confirm:
       - Page renders English content on the first frame (no RU→EN flash). View the first ~100ms via a video capture if needed; the perceptual test is "did I see Russian text at any point?". If yes → SSR-eager en.json gate didn't fire → investigate Plan 06 Task 2 (e).
       - DevTools Console: zero React hydration warnings (no "Hydration failed", no "did not match", no "Prop `lang` did not match"). If any appear, capture them and surface to the user.
       - DevTools Elements panel: `<html lang="en">` — NOT `<html lang="ru">`. The lang is baked, not mutated.
       - DevTools Network panel: a small `en-<hash>.js` chunk loaded? Or did the page ship with en.json content inlined? Either is acceptable per Plan 06 — only the BUNDLE SIZE matters (Plan 06 acceptance covers this).
    3. **/en/ direct hit:** repeat step 2 for `http://localhost:4173/en/`. Same expectations.
    4. **Locked-route preservation:** confirm `http://localhost:4173/welcome`, `/pay`, `/privacy`, `/terms`, `/refund` STILL render their RU content with `<html lang="ru">`. The bilingual addition must not affect the unprefixed canonical paths.
    5. **/en/pay Paddle modal:** open `http://localhost:4173/en/pay`. Click the upgrade CTA (English copy). Paddle Checkout modal MUST open without console errors. If `window.Paddle is undefined`, Plan 04's widen didn't reach `dist/en/pay/index.html` — re-check Plan 04 acceptance.
    6. **SPA navigation:** from `http://localhost:4173/en/`, find a link or use the URL bar to navigate to `/en/welcome`. URL changes, content stays English (no flash to RU), header still renders English copy.
    7. **Reverse SPA navigation:** from `http://localhost:4173/welcome` (a RU page), use the URL bar to navigate to `/en/welcome`. URL changes to `/en/welcome`, content flips to English. (The LangSwitcher button itself comes in Plan 08; this manual nav simulates what the switcher will do.)

    If all 7 steps pass, type "approved" and Plan 08 starts.
    If any step fails (especially #2 or #5), STOP and surface the specific failure with DevTools output. Per phase contract, Plan 08 cannot ship over a broken integrated build.
  </how-to-verify>
  <resume-signal>Type "approved" to mark Plan 07 green and unblock Wave 4 (Plan 08 — LangSwitcher). Otherwise describe the specific failure and reference the suspect plan.</resume-signal>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client URL bar / link → React Router | The user-supplied pathname is routed through React Router's `Routes` matcher; only the 15 declared routes (9 RU + 6 EN) match. Anything else hits `RouteLoading` fallback, then the existing SPA-fallback discriminator wipes the prerendered tree. No user input flows into `navigate()` in this plan (Plan 08 owns the LangSwitcher with allow-list-based navigation). |
| Vercel SPA rewrite → prerendered file | `dist/en/welcome/index.html` is a real static file; Vercel serves it directly without invoking the SPA rewrite. The rewrite still catches any non-prerendered `/en/<unknown>` path → SPA fallback (the unprefixed `dist/index.html`) hydrates with `__PRERENDER_PATH` mismatch → `createRoot` wipes and re-mounts. This is the Phase 2 D-06 hotfix path. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-18 | Tampering | React Router 7 import surface | mitigate | Both files import from `"react-router"` (verified by grep in Tasks 1-2). No drift to `"react-router-dom"`. CLAUDE.md convention preserved. |
| T-03-19 | DoS | Wildcard route breaking __PRERENDER_PATH | mitigate | Per-page declarations (RESEARCH.md anti-pattern line 473). Grep gates in Tasks 1-2 enforce. |
| T-03-20 | Information Disclosure | /en/account, /en/success, /en/dashboard/* — accidentally mountable | accept | Tasks 1-2 only register the 6 EN routes explicitly listed in the manifest. The other 3 RU SPA-only routes (/success, /account, /dashboard/download-skill) get NO EN mount — visiting `/en/account` falls through to the SPA fallback (`dist/index.html`) which has no `/en/account` route → React Router 404 → returns App component. Acceptable per D-03 + Plan 04's robots.txt Disallow defense-in-depth. |
| T-03-21 | Repudiation | entry-server.tsx ↔ main.tsx desync | mitigate | This plan modifies BOTH files in the same commit. Phase 2 D-06 mirror invariant preserved. Future maintainers reading the git log see one atomic change. |

ASVS V14 only (minor — security headers unchanged).
</threat_model>

<verification>

- `npm run build` exits 0.
- 12 dist files exist with correct `__PRERENDER_PATH` markers.
- `dist/en/welcome/index.html` body is English; `dist/welcome/index.html` body is Russian.
- Manual smoke (Task 4) passes all 7 steps including hydration-warning-free on `/en/welcome` and Paddle modal on `/en/pay`.

</verification>

<success_criteria>

- [ ] `scripts/entry-server.tsx` has 5 `/en/*` Route declarations (no `/en/pay`, no wildcard).
- [ ] `src/main.tsx` has 6 `/en/*` Route declarations including `/en/pay`.
- [ ] No `react-router-dom` import in either file.
- [ ] Existing root-path routes are byte-identical to pre-Plan-07 state.
- [ ] All 12 dist files emit with correct `__PRERENDER_PATH` markers.
- [ ] Manual checkpoint: zero hydration warnings on `/en/*`, Paddle modal works on `/en/pay`, locked routes still RU, SPA navigation flips lang on URL change.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-07-SUMMARY.md` capturing:
- Diff stats: 5 lines added to entry-server.tsx, 6+1 (banner) lines added to main.tsx.
- DevTools Console transcript from Task 4 (or "0 warnings" note).
- Confirmation that Plan 08 can proceed.
</output>
