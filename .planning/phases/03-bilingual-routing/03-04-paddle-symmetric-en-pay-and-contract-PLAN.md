---
phase: 03-bilingual-routing
plan: 04
type: execute
wave: 4
depends_on: [03]
files_modified:
  - scripts/prerender.mjs
  - docs/INTEGRATION-CONTRACT.md
  - public/robots.txt
autonomous: true
requirements:
  - GEO-C-2
must_haves:
  truths:
    - "`dist/en/pay/index.html` carries the same synchronous Paddle CDN `<script src=\"https://cdn.paddle.com/paddle/v2/paddle.js\"></script>` tag as `dist/pay/index.html`"
    - "`dist/en/pay/index.html` carries the same `<link rel=\"preconnect\" href=\"https://cdn.paddle.com\" />` tag as `dist/pay/index.html`"
    - "`docs/INTEGRATION-CONTRACT.md` §6 explicitly mentions `/en/pay` as a Paddle-injected surface alongside `/pay`"
    - "`docs/INTEGRATION-CONTRACT.md` `Last sync` date is bumped to the current build date per §8 protocol"
    - "`public/robots.txt` carries `Disallow: /en/account`, `Disallow: /en/success`, `Disallow: /en/dashboard/` for defense-in-depth (RESEARCH.md security section recommendation)"
  artifacts:
    - path: "scripts/prerender.mjs"
      provides: "Paddle injection condition widened to cover both /pay and /en/pay"
      contains: "meta.path === \"/pay\" || meta.path === \"/en/pay\""
    - path: "docs/INTEGRATION-CONTRACT.md"
      provides: "§6 + §8 + (defensive) §3 mention of /en/pay symmetric extension"
      contains: "/en/pay"
    - path: "public/robots.txt"
      provides: "Defense-in-depth Disallow on /en/* paths that have no EN sibling"
      contains: "Disallow: /en/account"
  key_links:
    - from: "scripts/prerender.mjs main loop (line 137 condition)"
      to: "applyPaddleScript (line 123)"
      via: "single OR-widened condition; function body untouched"
      pattern: "meta\\.path === \"/pay\" \\|\\| meta\\.path === \"/en/pay\""
    - from: "docs/INTEGRATION-CONTRACT.md §6"
      to: "scripts/prerender.mjs applyPaddleScript"
      via: "binding documentation contract — site MUST keep both `/pay` and `/en/pay` shipping the sync Paddle tag"
      pattern: "/en/pay"
---

<objective>
Three-edit atomic plan that extends the Paddle-sync invariant from `/pay` to `/en/pay` and keeps the binding documentation (INTEGRATION-CONTRACT §6) and the static crawler signal (robots.txt) in lockstep with that code change.

Three coupled edits per CONTEXT.md D-03b ("Integration Contract §6 is **extended symmetrically, not violated** — every `/pay` surface still ships Paddle sync. Contract update required alongside this plan."):

1. `scripts/prerender.mjs` line 137 — widen `if (meta.path === "/pay")` to `if (meta.path === "/pay" || meta.path === "/en/pay")`. Paddle preconnect + sync `<script>` injection then symmetric for both surfaces.

2. `docs/INTEGRATION-CONTRACT.md` §6 — add a sentence noting that `dist/en/pay/index.html` also receives the sync Paddle script; bump the document's `Last sync` date per §8.

3. `public/robots.txt` — defense-in-depth `Disallow: /en/account`, `Disallow: /en/success`, `Disallow: /en/dashboard/` across the same crawler agent blocks that already disallow the unprefixed equivalents (per RESEARCH.md §Security Domain "Indexing of internal/private paths via EN sibling" mitigation).

Closes GEO-C-2 ("`/en/*` siblings ship alongside locked routes; locked routes still respond at root paths") with full Paddle behavioral parity on the EN sibling. Without this plan, a direct hit on `https://opten.space/en/pay` (from EN search results or a shared link) would 404 on `window.Paddle` — see RESEARCH.md Pitfall 2 for the exact failure mode.

Purpose: maintain the binding documentation contract atomically with the code. Splitting the three edits across separate commits would create a window where the contract document falsely describes the runtime surface.

Output: a build where `dist/pay/index.html` and `dist/en/pay/index.html` carry the same Paddle script tag byte-for-byte (minus path-specific differences), a contract document that describes both surfaces, and a `robots.txt` that prevents AI crawlers from wandering to the non-emitted `/en/account`, `/en/success`, `/en/dashboard/` paths.
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
@docs/INTEGRATION-CONTRACT.md
@public/robots.txt
@CLAUDE.md

<interfaces>
<!-- The exact lines this plan touches. Surface area is intentionally tiny. -->

scripts/prerender.mjs current state (Plan 03 already shipped):
- Line 137 BEFORE: `if (meta.path === "/pay") {`
- Line 137 AFTER:  `if (meta.path === "/pay" || meta.path === "/en/pay") {`
- The applyPaddleScript function body (lines 123-128) is NOT touched — only the calling condition.

docs/INTEGRATION-CONTRACT.md §6 current state (verbatim, lines 236-268):
- The §6 section already describes the per-route Paddle loading strategy.
- Specifically lines 242-249 describe `dist/pay/index.html` getting the sync `<script>` tag via `applyPaddleScript` and lists routes that DO NOT load Paddle.
- D-03b extends "the routes that DO load Paddle" from `{/pay}` to `{/pay, /en/pay}`.
- The "Don't" subsection (lines 254-260) currently forbids re-introducing Paddle into the root template; this rule is preserved unchanged (the sync tag is still scoped to the two `/pay` surfaces only, not to `dist/index.html`).

public/robots.txt current state (verbatim, full file):
- 5 user-agent blocks have `Disallow: /account`, `Disallow: /success`, `Disallow: /dashboard/` (the `*`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` blocks at lines 1-29).
- 3 user-agent blocks (`Applebot-Extended`, `cohere-ai`, `anthropic-ai`) have only `Allow: /` and no explicit Disallow.
- The plan adds `Disallow: /en/account`, `Disallow: /en/success`, `Disallow: /en/dashboard/` to the same 5 blocks that already disallow the unprefixed equivalents. The 3 Allow-only blocks stay unchanged (they have no Disallow surface today; adding only-for-EN would be asymmetric).
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Widen the Paddle injection condition in prerender.mjs</name>
  <read_first>
    - scripts/prerender.mjs (re-read after Plan 03 — confirm Plan 03's apply* helpers are in place and the main loop ordering is as designed; line 137 should still read `if (meta.path === "/pay") {`)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-03b — exact wording)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Pitfall 2, lines 538-546 — the failure mode this widen prevents)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§2 → "Existing applyPaddleScript condition", lines 144-159 — verbatim before/after)
  </read_first>
  <action>
    In `scripts/prerender.mjs`, change the single condition at line 137 (the line currently reading `if (meta.path === "/pay") {`) to `if (meta.path === "/pay" || meta.path === "/en/pay") {`. Update the inline comment on the same or next line (currently `// Phase 2.2: sync Paddle SDK on /pay only`) to `// Phase 3 D-03b: sync Paddle SDK on /pay AND /en/pay (symmetric extension; INTEGRATION-CONTRACT §6).`. Do NOT modify the body of `applyPaddleScript` (lines 123-128). Do NOT change any other line in `prerender.mjs`. The diff is exactly 1 line of code + the comment line.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/prerender.mjs','utf-8'); const widened=s.includes('meta.path === \"/pay\" || meta.path === \"/en/pay\"'); if(!widened){console.error('FAIL: Paddle condition not widened');process.exit(1)} console.log('PASS: condition widened')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep 'meta.path === "/pay" || meta.path === "/en/pay"' scripts/prerender.mjs` returns exactly 1 hit
    - `grep -c 'if (meta.path === "/pay")' scripts/prerender.mjs` returns 0 (the old single-condition form is gone)
  </acceptance_criteria>
  <done>
    prerender.mjs line 137 reads the OR-widened condition; comment updated; no other line touched.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update INTEGRATION-CONTRACT.md §6 + bump Last sync date</name>
  <read_first>
    - docs/INTEGRATION-CONTRACT.md §6 (lines 236-268 — full section; specifically the "Per-route loading strategy (Phase 2.2):" sub-heading at line 241 and the bullet list at 242-252)
    - docs/INTEGRATION-CONTRACT.md §8 (locate via `grep -n "## 8\\|Last sync"` — the document's protocol for updating it; bump the date here)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-03b — wording "extended symmetrically, not violated"; this is the exact framing to use in the contract update)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Assumption A5, lines 793 — §3 stays unchanged; only §6 needs the symmetric Paddle mention)
  </read_first>
  <action>
    Edit `docs/INTEGRATION-CONTRACT.md` §6 ("Paddle SDK initialization"). Add a paragraph or extend the existing "Per-route loading strategy" sub-section so the document explicitly states:

    - `dist/pay/index.html` AND `dist/en/pay/index.html` both receive the synchronous Paddle CDN `<script>` tag via `applyPaddleScript` in `scripts/prerender.mjs`. The widen lands in Phase 3 per Phase 3 plan D-03b — a symmetric extension of the §6 contract, NOT a contract change. Direct hits on `https://opten.space/en/pay` (from EN search results, shared links, or future extension navigation) have `window.Paddle` defined before PayPage mounts, matching the existing `/pay` invariant.
    - The "Don't" subsection (currently lines 254-260) is preserved unchanged: do NOT switch the tag to async/defer, do NOT re-introduce it into the root template. The new `/en/pay` injection follows the same constraints.
    - In §3 (URL contract), add a one-line note at the bottom (NOT a new row in the locked-routes table — the table describes extension-deep-linked routes only; `/en/pay` is currently reached via search results or the language switcher, not via the extension binary). Wording: "Note (Phase 3 D-03b): the site additionally emits `/en/pay` as an EN sibling of `/pay`. The extension does NOT navigate to `/en/pay` in current shipped versions; this is a site-side SEO addition only."

    Locate the document's `Last sync` / `Last updated` line (typically near the top, e.g. `Last sync: YYYY-MM-DD against extension manifest.json vX.Y.Z`). Bump the date to the current build date (use `new Date().toISOString().split("T")[0]` format — the same format `BUILD_DATE` uses in `scripts/sitemap.mjs`). Leave the extension version reference unchanged (Phase 3 doesn't bump the extension's manifest — only the site).

    Do NOT touch sections §1, §2, §4, §5, §7 — they describe surfaces this plan does NOT change. The edit is scoped to §3 (1-line note), §6 (symmetric `/en/pay` mention), and the `Last sync` line.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('docs/INTEGRATION-CONTRACT.md','utf-8'); const hits=(s.match(/\/en\/pay/g)||[]).length; if(hits&lt;1){console.error('FAIL: INTEGRATION-CONTRACT.md mentions /en/pay '+hits+' time(s), want &gt;=1');process.exit(1)} const today=new Date().toISOString().split('T')[0]; if(!s.includes(today)){console.error('FAIL: Last sync date '+today+' not found — bump the date');process.exit(1)} console.log('PASS: /en/pay mentioned, Last sync bumped to '+today)"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "/en/pay" docs/INTEGRATION-CONTRACT.md` returns at least `1` (mirrors VALIDATION.md row Plan 05's docs assert)
    - `grep "Last sync" docs/INTEGRATION-CONTRACT.md` (or equivalent date marker) shows the current YYYY-MM-DD
    - §6 still contains the "Don't" subsection forbidding `async`/`defer` on the Paddle script tag (unchanged)
    - §3's locked-routes table still has exactly 5 rows (no new row for `/en/pay` — only a free-text note below the table, per assumption A5)
  </acceptance_criteria>
  <done>
    Contract document describes both `/pay` and `/en/pay` as Paddle-injected surfaces; Last sync date is current.
  </done>
</task>

<task type="auto">
  <name>Task 3: Extend public/robots.txt with /en/* defense-in-depth Disallows + build verification</name>
  <read_first>
    - public/robots.txt (full file — 40 lines; 5 blocks already disallow `/account`, `/success`, `/dashboard/`)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Security Domain → "Indexing of internal/private paths via EN sibling" recommendation, line 902 — explicitly: "Recommend: Plan 02 adds explicit `Disallow: /en/account`, `/en/success`, `/en/dashboard/` to `public/robots.txt` for defense-in-depth")
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (row Plan 09 — security recommendation that this plan satisfies in advance)
  </read_first>
  <action>
    Edit `public/robots.txt`. For each of the 5 user-agent blocks that ALREADY contain `Disallow: /account`, `Disallow: /success`, `Disallow: /dashboard/` (the blocks at lines 1-5 `*`, 7-11 `GPTBot`, 13-17 `ClaudeBot`, 19-23 `PerplexityBot`, 25-29 `Google-Extended`), append three sibling Disallow lines:

      Disallow: /en/account
      Disallow: /en/success
      Disallow: /en/dashboard/

    Place each new line directly below its unprefixed sibling (so the file groups RU-then-EN within each block). The 3 user-agent blocks WITHOUT any current Disallow (`Applebot-Extended`, `cohere-ai`, `anthropic-ai` at lines 31-38) stay unchanged — they only carry `Allow: /` today, and adding EN-only Disallow there would be asymmetric (no RU sibling to mirror).

    Keep the trailing `Sitemap: https://opten.space/sitemap.xml` line on line 40 (or wherever it ends up after the additions) unchanged.

    Then run `npm run build` and verify both `dist/en/pay/index.html` and `dist/pay/index.html` carry the Paddle script tag. This task wraps the build verification because Tasks 1-3 form one atomic commit and the build must succeed across all three edits.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('public/robots.txt','utf-8'); const enAccount=(s.match(/Disallow:\s*\/en\/account/g)||[]).length; const enSuccess=(s.match(/Disallow:\s*\/en\/success/g)||[]).length; const enDash=(s.match(/Disallow:\s*\/en\/dashboard\//g)||[]).length; if(enAccount!==5){console.error('FAIL: Disallow /en/account appears '+enAccount+' time(s), want 5 (one per user-agent block)');process.exit(1)} if(enSuccess!==5){console.error('FAIL: Disallow /en/success appears '+enSuccess+' time(s), want 5');process.exit(1)} if(enDash!==5){console.error('FAIL: Disallow /en/dashboard/ appears '+enDash+' time(s), want 5');process.exit(1)} console.log('PASS: 5 user-agent blocks each carry the 3 /en/* Disallows')" &amp;&amp; npm run build 2&gt;&amp;1 | tail -10 &amp;&amp; node -e "const fs=require('fs'); const p=fs.readFileSync('dist/pay/index.html','utf-8'); const e=fs.readFileSync('dist/en/pay/index.html','utf-8'); const pHas=p.includes('https://cdn.paddle.com/paddle/v2/paddle.js'); const eHas=e.includes('https://cdn.paddle.com/paddle/v2/paddle.js'); if(!pHas){console.error('FAIL: dist/pay/index.html missing Paddle script');process.exit(1)} if(!eHas){console.error('FAIL: dist/en/pay/index.html missing Paddle script — widen broken');process.exit(1)} const pPreconnect=p.includes('rel=\"preconnect\" href=\"https://cdn.paddle.com\"'); const ePreconnect=e.includes('rel=\"preconnect\" href=\"https://cdn.paddle.com\"'); if(!pPreconnect||!ePreconnect){console.error('FAIL: preconnect not symmetric');process.exit(1)} console.log('PASS: both /pay and /en/pay carry Paddle script + preconnect')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "Disallow: /en/account" public/robots.txt` returns exactly `5`
    - `grep -c "Disallow: /en/success" public/robots.txt` returns exactly `5`
    - `grep -c "Disallow: /en/dashboard/" public/robots.txt` returns exactly `5`
    - `dist/en/pay/index.html` contains `https://cdn.paddle.com/paddle/v2/paddle.js` (the sync Paddle script tag, byte-identical to `dist/pay/index.html`'s injection)
    - `dist/en/pay/index.html` contains the matching `<link rel="preconnect" href="https://cdn.paddle.com" />` tag
    - `diff <(grep -o 'paddle[^"]*\.js' dist/pay/index.html) <(grep -o 'paddle[^"]*\.js' dist/en/pay/index.html)` returns empty (the two files reference identical Paddle URLs — mirrors VALIDATION.md row Plan 05 acceptance)
    - `dist/index.html` and other RU/EN routes (non-`/pay`) do NOT carry the Paddle script (Phase 2.2 perf invariant preserved): `grep -L 'cdn.paddle.com/paddle/v2/paddle.js' dist/index.html dist/welcome/index.html dist/privacy/index.html dist/en/index.html dist/en/welcome/index.html dist/en/privacy/index.html` lists all 6 files (none contain the script)
  </acceptance_criteria>
  <done>
    robots.txt has the 3 new `/en/*` Disallows in the 5 expected blocks; build emits both `/pay` and `/en/pay` with the Paddle sync script; the Phase 2.2 perf invariant (no Paddle on landing) is preserved.
  </done>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time → static `dist/en/pay/index.html` | The Paddle script tag is injected at build time via the existing `applyPaddleScript` helper; only the calling condition widens. Output served by Vercel CDN. |
| crawler → `/en/account`, `/en/success`, `/en/dashboard/*` | These paths emit NO real files (D-03). Crawlers hit the Vercel SPA fallback (RU shell, no EN-specific data). The new robots.txt Disallow blocks AI crawlers from even attempting to fetch them — defense-in-depth. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-09 | Tampering | Paddle SDK script integrity on /en/pay | accept | The CDN script URL (`https://cdn.paddle.com/paddle/v2/paddle.js`) is a build-time constant identical to the existing `/pay` injection. No new attack surface; Integration Contract §6 invariants apply symmetrically. |
| T-03-10 | DoS | Paddle script-load race on /en/pay | mitigate | Synchronous `<script>` tag (NOT async/defer) — RESEARCH.md Pitfall 2 + Integration Contract §6 "Don't" rule preserved. `window.Paddle` is defined before `PayPage` mounts on direct hits. |
| T-03-11 | Information Disclosure | AI crawlers indexing /en/account et al. | mitigate | `public/robots.txt` now Disallows `/en/account`, `/en/success`, `/en/dashboard/` for the 5 main bot user-agents. This is in addition to the fact that those paths emit no real content (D-03) — defense-in-depth per RESEARCH.md §Security Domain. |
| T-03-12 | Repudiation | Drift between binding contract and runtime | mitigate | The contract document edit (§6 + §8 Last sync) ships in the SAME COMMIT as the code change (atomic). Reading the docs at any point in git history yields a consistent description of the runtime. |

ASVS V14 only (minor — security headers in `vercel.json` `/(.*)` auto-apply to `/en/pay`; no header change needed).
</threat_model>

<verification>

- `npm run build` exits 0.
- `dist/pay/index.html` and `dist/en/pay/index.html` both contain the Paddle sync script + preconnect (byte-identical Paddle URLs).
- `dist/index.html` (landing) does NOT contain the Paddle script — Phase 2.2 perf invariant preserved.
- `public/robots.txt` carries 5 occurrences each of `Disallow: /en/account`, `Disallow: /en/success`, `Disallow: /en/dashboard/`.
- `docs/INTEGRATION-CONTRACT.md` §6 mentions `/en/pay`; `Last sync` date is current.

</verification>

<success_criteria>

- [ ] `scripts/prerender.mjs` line 137 reads `if (meta.path === "/pay" || meta.path === "/en/pay") {`.
- [ ] `dist/en/pay/index.html` contains the sync Paddle script tag + preconnect, byte-for-byte symmetric to `dist/pay/index.html`.
- [ ] `dist/index.html` does NOT contain the Paddle script (Phase 2.2 perf invariant preserved).
- [ ] `docs/INTEGRATION-CONTRACT.md` §6 explicitly mentions `/en/pay`; Last sync date is current.
- [ ] `public/robots.txt` Disallows `/en/account`, `/en/success`, `/en/dashboard/` in each of the 5 main bot user-agent blocks.
- [ ] §3 locked-routes table still has exactly 5 rows (no new row for `/en/pay`).

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-04-SUMMARY.md` listing:
- The 3-file diff stats.
- A snippet from `dist/en/pay/index.html` proving the Paddle script + preconnect are present.
- The bumped `Last sync` date in INTEGRATION-CONTRACT.md.
</output>
