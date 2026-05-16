---
phase: 03-bilingual-routing
plan: 03
type: execute
wave: 3
depends_on: [02]
files_modified:
  - scripts/prerender.mjs
autonomous: true
requirements:
  - GEO-C-3
  - GEO-C-4
must_haves:
  truths:
    - "Every emitted RU HTML file (`dist/index.html`, `dist/welcome/index.html`, `dist/pay/index.html`, `dist/privacy/index.html`, `dist/terms/index.html`, `dist/refund/index.html`) carries `<html lang=\"ru\">`"
    - "Every emitted EN HTML file (`dist/en/index.html`, `dist/en/welcome/index.html`, `dist/en/pay/index.html`, `dist/en/privacy/index.html`, `dist/en/terms/index.html`, `dist/en/refund/index.html`) carries `<html lang=\"en\">`"
    - "Every emitted HTML file carries exactly 3 `<link rel=\"alternate\" hreflang=\"...\">` tags (`ru`, `en`, `x-default`) with reciprocal href values"
    - "Every emitted HTML file carries `<meta property=\"og:locale\" content=\"ru_RU\" />` (RU) or `\"en_US\"` (EN), plus a matching `og:locale:alternate` entry"
    - "Build fails loudly if any of the 3 new apply* helpers cannot find its regex anchor (Phase 2 D-08 fail-fast pattern reused)"
  artifacts:
    - path: "scripts/prerender.mjs"
      provides: "applyHtmlLang / applyHreflang / applyOgLocale helpers; main loop calls them in order before applyMarker"
      contains: "function applyHtmlLang"
  key_links:
    - from: "scripts/prerender.mjs (main loop)"
      to: "scripts/seo-routes.ts (meta.htmlLang, meta.hreflangAlternates)"
      via: "meta-driven HTML transform; each apply* fn reads one field from RouteMeta"
      pattern: "meta\\.htmlLang|meta\\.hreflangAlternates"
    - from: "dist/en/{route}/index.html files"
      to: "Vercel CDN"
      via: "static-file precedence (no vercel.json change) — mkdir({ recursive: true }) handles nested EN dirs unchanged"
      pattern: "dist/en/[a-z]+/index\\.html"
---

<objective>
Add three sibling `apply*` helpers to `scripts/prerender.mjs` (mirror of existing `applyMeta` / `applyModulePreload` / `applyPaddleScript` shape):

1. `applyHtmlLang(html, meta)` — replaces template `<html lang="ru">` with `<html lang="${meta.htmlLang}">` (per-output-file bake — GEO-C-4).
2. `applyHreflang(html, meta)` — injects the 3-tag triplet (`ru`, `en`, `x-default`) after the canonical link inserted by `applyMeta` (per-page `<head>` — GEO-C-3).
3. `applyOgLocale(html, meta)` — replaces `og:locale=ru_RU` with the per-route locale and appends an `og:locale:alternate` (Pitfall 4 mitigation).

Then wire all three into the main `for (const meta of routes)` loop between `applyMeta` and `applyModulePreload`, **before** `applyMarker` (which is destructive — consumes `</head>` — per the existing `prerender.mjs:80-81` comment). Every helper follows the Phase 2 D-08 fail-fast pattern: regex replace + `if (html === before) throw`.

Closes GEO-C-3 and GEO-C-4 at the build-pipeline level. With this plan + Plan 02 in place, `npm run build` emits 12 prerendered HTML files (6 RU + 6 EN), each correctly localized in `<html lang>`, `og:locale`, and the hreflang triplet. Plan 04 will widen the Paddle injection condition; Plan 07 will register the `/en/*` SSR routes so the body content also speaks English. This plan deliberately addresses HEAD-only transforms — body content is Plan 07's concern.

Purpose: build-time, byte-stable, AI-crawler-readable bilingual signaling. The Paddle widen condition + `/en/pay` Paddle injection moves into Plan 04 (intentional split — keeps the diff per plan focused and atomic).

Output: an extended `scripts/prerender.mjs` that, given the 13-entry manifest, emits 12 fully-localized HTML files.
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
@scripts/prerender.mjs
@scripts/seo-routes.ts
@index.html
@CLAUDE.md

<interfaces>
<!-- prerender.mjs surface area BEFORE this plan (Phase 2.2 state). -->

Existing functions (verbatim, scripts/prerender.mjs lines 27-128):
- escapeAttr(s)            — line 27-29 — reuse for all href/content values in new helpers
- escapeHtml(s)            — line 30-32 — reuse for any text-node values (not needed in this plan; helpers operate on attributes)
- applyMeta(html, meta)    — line 34-52 — TEMPLATE for the new helpers: regex-replace + `if (html === before) throw`
- applyBody(html, rendered) — line 54-60
- applyMarker(html, path)  — line 66-72 — MUST stay last; eats `</head>`
- applyModulePreload(html) — line 82-88 — appends `<link rel=modulepreload>` before `</head>`
- applySafariPreloadFallback(html) — line 106-115 — appends `<link rel=preload as=script>` before `</head>`
- applyPaddleScript(html)  — line 123-128 — appends Paddle preconnect + sync script before `</head>` (Plan 04 widens its calling condition; NOT touched in this plan)

Existing main loop (lines 130-156):
  for (const meta of routes) {
    let html = applyMeta(template, meta);
    html = applyModulePreload(html);
    html = applySafariPreloadFallback(html);
    if (meta.path === "/pay") html = applyPaddleScript(html);
    html = applyMarker(html, meta.path);
    if (meta.prerender === "full") { ... renderRoute(meta.path); html = applyBody(html, rendered); }
    if (meta.prerender === "none") continue;
    const outPath = meta.path === "/" ? resolve(DIST, "index.html") : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf-8");
  }

NEW order after this plan (Plan 04 will widen the Paddle condition):
  let html = applyMeta(template, meta);
  html = applyHtmlLang(html, meta);             // NEW
  html = applyHreflang(html, meta);             // NEW (must run AFTER applyMeta — needs the canonical link as anchor)
  html = applyOgLocale(html, meta);             // NEW
  html = applyModulePreload(html);              // unchanged
  html = applySafariPreloadFallback(html);      // unchanged
  if (meta.path === "/pay") html = applyPaddleScript(html);  // Plan 04 widens this
  html = applyMarker(html, meta.path);          // unchanged — MUST be last
</interfaces>

<template_anchors>
<!-- Verified anchors in index.html that the new regexes match against. -->

- `<html lang="ru">` — index.html:2. applyHtmlLang regex: `/<html\s+lang="[^"]*"([^>]*)>/` — captures any siblings (Pitfall 3 mitigation).
- `<link rel="canonical" href="…" />` — INJECTED BY applyMeta at line 44-47 (not in template; the apply order matters — applyHreflang MUST run after applyMeta so the canonical link exists as an anchor).
- `<meta property="og:locale" content="ru_RU" />` — index.html:22.
- `</head>` — index.html (line near 97) — applyMarker still owns this anchor; new helpers MUST NOT replace `</head>` (they operate on `<head>` interior).
</template_anchors>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add applyHtmlLang and applyOgLocale helpers</name>
  <read_first>
    - scripts/prerender.mjs (full file — 158 lines; templates `applyMeta` lines 34-52 and `applyPaddleScript` lines 123-128 are the shape to mirror)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 3, lines 330-349 — verbatim applyHtmlLang body; §Code Examples lines 651-666 — verbatim applyOgLocale body)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§2, lines 108-187 — file-by-file mapping)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-04 — htmlLang per route; Pitfall 4 — og:locale must update alongside <html lang>)
    - index.html (lines 2 + 22 — verify the exact anchor strings match the regexes; the executor must confirm `<html lang="ru">` is on line 2 with double quotes and `<meta property="og:locale" content="ru_RU" />` on line 22)
  </read_first>
  <action>
    In `scripts/prerender.mjs`, insert two new helper functions immediately after `escapeHtml` (line 32) and before `applyMeta` (line 34) — keeping the helpers grouped at the top of the file so the main loop reads top-to-bottom.

    **`applyHtmlLang(html, meta)`** — regex anchor `/<html\s+lang="[^"]*"([^>]*)>/` (the `([^>]*)` capture-group preserves any future siblings like `dir="ltr"` — Pitfall 3 mitigation). Replacement: `\`<html lang="${meta.htmlLang}"$1>\``. Fail-fast `if (html === before) throw new Error(\`prerender(${meta.path}): no <html lang> matched. index.html structure changed?\`);`. Body shape mirrors `applyMeta` line 48-50 verbatim.

    **`applyOgLocale(html, meta)`** — per RESEARCH §Code Examples lines 656-666:
    - Compute `const ogLocale = meta.htmlLang === "en" ? "en_US" : "ru_RU";` and `const alternate = meta.htmlLang === "en" ? "ru_RU" : "en_US";`.
    - First replace: `/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/` → `\`<meta property="og:locale" content="${ogLocale}" />\`` (use `escapeAttr` defensively on `ogLocale`; the values are constants but defense-in-depth matches `applyMeta` style at line 38).
    - Second replace (inject `og:locale:alternate` after the og:locale tag, idempotent): `/(<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>)/` → `\`$1\n    <meta property="og:locale:alternate" content="${alternate}" />\``.
    - Fail-fast on the first replace returning `before === after` (the second injection naturally re-runs idempotent; gate fail-fast on the first replace only).

    Add JSDoc-style banners above each helper referencing the Phase 3 plan + RESEARCH line ranges (matches Phase 2's banner style at lines 74-80 and 116-122). One-line each, e.g. `// Phase 3 GEO-C-4: bake <html lang> per emitted file. Replaces runtime mutator deleted in Plan 01 (RESEARCH.md Pattern 3).`.

    Do NOT wire into the main loop yet — Task 2 handles wiring + applyHreflang.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/prerender.mjs','utf-8'); const a=s.includes('function applyHtmlLang'); const b=s.includes('function applyOgLocale'); const failFastA=s.match(/applyHtmlLang[\s\S]*?html\s*===\s*before/); const failFastB=s.match(/applyOgLocale[\s\S]*?html\s*===\s*before/); if(!a){console.error('FAIL: applyHtmlLang missing');process.exit(1)} if(!b){console.error('FAIL: applyOgLocale missing');process.exit(1)} if(!failFastA){console.error('FAIL: applyHtmlLang missing fail-fast guard');process.exit(1)} if(!failFastB){console.error('FAIL: applyOgLocale missing fail-fast guard');process.exit(1)} console.log('PASS: 2 helpers + fail-fast guards present')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "function applyHtmlLang" scripts/prerender.mjs` returns `1`
    - `grep -c "function applyOgLocale" scripts/prerender.mjs` returns `1`
    - Each new helper contains an `if (html === before) throw` line (Phase 2 D-08 fail-fast pattern)
    - File still passes the next build (Task 3 acceptance runs `npm run build`)
  </acceptance_criteria>
  <done>
    Two new helpers exist at the top of prerender.mjs, both with fail-fast guards, neither wired into the main loop yet.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add applyHreflang helper and wire all 3 new helpers into the main loop</name>
  <read_first>
    - scripts/prerender.mjs (re-read after Task 1 — confirm applyHtmlLang + applyOgLocale exist; this task adds applyHreflang and wires all 3)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 2, lines 304-324 — verbatim applyHreflang body; §Code Examples lines 668-682 — verbatim main-loop excerpt; Pitfall 5 — reciprocity must come from manifest, NOT hand-typed)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§2 → "Existing main for-loop", lines 161-175 — verbatim new ordering with all 3 helpers)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (Claude's Discretion #1 — hreflang in <head> is the chosen approach)
  </read_first>
  <action>
    Add the third helper `applyHreflang(html, meta)` to the helper-function group at the top of the file, immediately after `applyOgLocale` (which Task 1 inserted right after `escapeHtml`). All three new helpers (`applyHtmlLang`, `applyOgLocale`, `applyHreflang`) sit BETWEEN `escapeHtml` and the pre-existing `applyMeta` — `applyMeta` stays where it was at the original line 34. Body per RESEARCH §Pattern 2:
    - Build a 3-tag block:
      `<link rel="alternate" hreflang="ru"        href="${escapeAttr(meta.hreflangAlternates.ru)}" />`
      `<link rel="alternate" hreflang="en"        href="${escapeAttr(meta.hreflangAlternates.en)}" />`
      `<link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.hreflangAlternates.xDefault)}" />`
      Indent each line with 4 leading spaces to match the surrounding `<head>` indent in index.html.
    - Join with `\n` and inject AFTER the canonical link (inserted by applyMeta at line 44-47). Regex: `/(<link rel="canonical"[^>]*\/>)/` → `\`$1\n${tags}\``.
    - Fail-fast: same `if (html === before) throw` shape — message `\`prerender(${meta.path}): no <link rel="canonical"> anchor for hreflang. applyMeta ordering broken?\``.

    Then **modify the main for-loop** (currently lines 130-156). Insert the three new helper calls in this exact order between `applyMeta` and `applyModulePreload`:
      let html = applyMeta(template, meta);
      html = applyHtmlLang(html, meta);
      html = applyHreflang(html, meta);
      html = applyOgLocale(html, meta);
      html = applyModulePreload(html);
      // ...rest unchanged...

    DO NOT touch the Paddle condition (line 137 `if (meta.path === "/pay")`) — Plan 04 owns that change. DO NOT reorder applyMarker (line 140 — must stay last; consumes `</head>`).

    DO NOT touch any code below the main loop. The `outPath` resolution at lines 149-154 already handles `/en/{route}/index.html` via `mkdir({ recursive: true })` — no change needed (RESEARCH §Architecture Diagram + PATTERNS §2 "Existing output-path logic" — verified Phase 2 pattern).
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/prerender.mjs','utf-8'); const a=s.includes('function applyHreflang'); const wireOrder=s.match(/applyMeta\(template,\s*meta\);[\s\S]{0,400}applyHtmlLang\(html,\s*meta\);[\s\S]{0,400}applyHreflang\(html,\s*meta\);[\s\S]{0,400}applyOgLocale\(html,\s*meta\);[\s\S]{0,400}applyModulePreload\(html\);/); const noPaddleWiden=!s.includes('meta.path === \"/en/pay\"'); if(!a){console.error('FAIL: applyHreflang missing');process.exit(1)} if(!wireOrder){console.error('FAIL: helpers not wired in correct order');process.exit(1)} if(!noPaddleWiden){console.error('FAIL: Paddle condition pre-widened — Plan 04 owns that change, not this plan');process.exit(1)} console.log('PASS: 3 helpers wired in correct order, Paddle condition untouched')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "function applyHreflang" scripts/prerender.mjs` returns `1`
    - The main loop contains all 3 new helper calls in the order `applyHtmlLang → applyHreflang → applyOgLocale`, between `applyMeta` and `applyModulePreload`
    - The Paddle condition at the current line 137 still reads `if (meta.path === "/pay") {` (Plan 04's responsibility — NOT changed here; the grep `grep "meta.path === \"/en/pay\"" scripts/prerender.mjs` returns 0 matches in this plan)
    - `applyMarker` is still the last call in the loop before `applyBody`
  </acceptance_criteria>
  <done>
    Three new helpers exist; all three are wired into the main loop in the correct order; Paddle condition is untouched (Plan 04's domain); applyMarker stays last.
  </done>
</task>

<task type="auto">
  <name>Task 3: Build, verify 12 emitted files, grep RU vs EN attributes</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (rows Plan 03 + Plan 04 acceptance maps — exact grep commands)
    - scripts/seo-routes.ts (verify Plan 02 already shipped — 13 entries; otherwise this task will fail and the executor should escalate)
  </read_first>
  <action>
    Run `npm run build` from the repo root. Verify the build exits 0 (TS + SSR + prerender chain all succeed). Then verify every emitted file via grep and the file-existence check spelled out in VALIDATION.md row Plan 03 + row Plan 04 (the latter's hreflang grep; Plan 04's Paddle grep is a different plan). Specifically:
    - Confirm all 12 HTML files exist (6 RU + 6 EN). Note: `dist/pay/index.html` and `dist/en/pay/index.html` are `prerender: "head"` so they still emit files (head-only — no body content but full head).
    - Grep `<html lang=` per file; RU files MUST report `lang="ru"`, EN files MUST report `lang="en"`.
    - Grep `rel="alternate"` per file; every file MUST report exactly 3 hits (the triplet).
    - Grep `og:locale` per file; RU files MUST report `ru_RU` for the primary tag, EN files MUST report `en_US`. Each file MUST also carry an `og:locale:alternate` line with the opposite locale.

    If any grep returns an unexpected count, the executor inspects the offending file and traces back to either (a) the manifest entry in seo-routes.ts (Plan 02 bug), or (b) the apply* helper ordering (this plan's bug). Do NOT manually edit `dist/` — fix the source script and rebuild.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -20 &amp;&amp; node -e "const fs=require('fs');const files=['dist/index.html','dist/en/index.html','dist/welcome/index.html','dist/en/welcome/index.html','dist/pay/index.html','dist/en/pay/index.html','dist/privacy/index.html','dist/en/privacy/index.html','dist/terms/index.html','dist/en/terms/index.html','dist/refund/index.html','dist/en/refund/index.html'];let errors=0;for(const f of files){if(!fs.existsSync(f)){console.error('MISSING: '+f);errors++;continue}const s=fs.readFileSync(f,'utf-8');const isEn=f.includes('/en/');const wantLang=isEn?'lang=\"en\"':'lang=\"ru\"';const wantLocale=isEn?'en_US':'ru_RU';const altLocale=isEn?'ru_RU':'en_US';const hreflangCount=(s.match(/rel=\"alternate\"\s+hreflang=/g)||[]).length;if(!s.includes('<html '+wantLang)){console.error(f+': missing '+wantLang);errors++}if(!s.includes('property=\"og:locale\" content=\"'+wantLocale+'\"')){console.error(f+': missing og:locale='+wantLocale);errors++}if(!s.includes('property=\"og:locale:alternate\" content=\"'+altLocale+'\"')){console.error(f+': missing og:locale:alternate='+altLocale);errors++}if(hreflangCount!==3){console.error(f+': hreflang count='+hreflangCount+' (want 3)');errors++}}if(errors){console.error('FAIL: '+errors+' file(s) failed');process.exit(1)}console.log('PASS: all 12 files have correct <html lang>, hreflang triplet, og:locale + alternate')"</automated>
  </verify>
  <acceptance_criteria>
    - All 12 files in the list above exist after build
    - Every RU file: `<html lang="ru">` + `og:locale="ru_RU"` + `og:locale:alternate="en_US"` + 3 hreflang tags
    - Every EN file: `<html lang="en">` + `og:locale="en_US"` + `og:locale:alternate="ru_RU"` + 3 hreflang tags
    - `grep -c '<html lang=' dist/index.html dist/en/index.html dist/welcome/index.html dist/en/welcome/index.html dist/privacy/index.html dist/en/privacy/index.html` shows exactly 1 hit per file with the correct value (mirrors VALIDATION.md Plan 03 row)
    - `grep -c 'rel="alternate"' dist/welcome/index.html` returns `3` (mirrors VALIDATION.md Plan 04 row)
    - Reciprocity spot-check: `dist/welcome/index.html` and `dist/en/welcome/index.html` carry identical hreflang triplet href values
  </acceptance_criteria>
  <done>
    Build emits 12 fully-localized HTML files. All grep gates green. The next plan (04) can widen the Paddle injection condition for `/en/pay`.
  </done>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time → static asset | `scripts/prerender.mjs` runs in Node during `npm run build`, reads the template + the compiled manifest, and writes static HTML to `dist/`. Output is served by Vercel CDN — no runtime parsing of user input. The new helpers operate on regex-replace against build-time constants. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-05 | Tampering | hreflang href values | mitigate | All href values pass through `escapeAttr` (line 27-29 helper, already in use by `applyMeta`). Values originate from `seo-routes.ts` build-time constants under `SITE_ORIGIN` — no user input. Defense-in-depth: HTML attribute encoding. |
| T-03-06 | Tampering | og:locale content | mitigate | `ogLocale` and `alternate` are derived from a literal ternary (`meta.htmlLang === "en" ? "en_US" : "ru_RU"`) — only two possible values, both server-controlled constants. `escapeAttr` applied defensively. |
| T-03-07 | DoS | build pipeline failure | mitigate | All 3 new helpers carry the Phase 2 D-08 fail-fast `if (html === before) throw` guard. If any regex anchor disappears (e.g., someone alters `index.html`), the build fails loudly with a route-specific message — preventing silent SEO regressions. |
| T-03-08 | Information Disclosure | hreflang exposing private paths | accept | The manifest does NOT include `/en/account`, `/en/success`, `/en/dashboard/*` (D-03). No hreflang ever points at a private path. |

ASVS V14 only (minor — `vercel.json` security headers auto-apply to the 6 new EN URLs).
</threat_model>

<verification>

- `npm run build` exits 0 (full SPA + SSR + prerender chain runs).
- All 12 files in the matrix exist with the correct `<html lang>`, 3 hreflang tags, og:locale + og:locale:alternate.
- Hreflang triplet is reciprocal between each cluster pair.
- The Paddle injection condition at line 137 is unchanged (Plan 04 owns the widen).

</verification>

<success_criteria>

- [ ] Three new helpers (`applyHtmlLang`, `applyHreflang`, `applyOgLocale`) added to `scripts/prerender.mjs`.
- [ ] All 3 helpers carry the fail-fast `if (html === before) throw` guard.
- [ ] Main loop wires them in the order `applyMeta → applyHtmlLang → applyHreflang → applyOgLocale → applyModulePreload`.
- [ ] `npm run build` emits 12 HTML files, all with correct `<html lang>`, hreflang triplet, og:locale + alternate.
- [ ] Paddle injection condition (line 137) is unchanged.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-03-SUMMARY.md` listing:
- Diff stats (helpers added, lines changed in main loop).
- Sample grep output proving the 12-file matrix is green.
- Note for Plan 04: Paddle widen condition is the only remaining edit to `prerender.mjs` for this phase.
</output>
