---
phase: 03-bilingual-routing
plan: "04"
subsystem: build-pipeline / integration-contract / crawler-signals
tags:
  - gsd
  - summary
  - bilingual-routing
  - paddle
  - integration-contract
  - robots
dependency_graph:
  requires:
    - 03-03-prerender-apply-htmlLang-hreflang-oglocale-PLAN (applyPaddleScript function body)
    - 03-07-register-en-routes-in-routers-PLAN (/en/pay route registered in react-router)
  provides:
    - dist/en/pay/index.html carries synchronous Paddle CDN script (GEO-C-2 full close)
    - INTEGRATION-CONTRACT.md §6 documents /en/pay Paddle invariant
    - public/robots.txt blocks AI crawlers from non-emitted /en/* paths
  affects:
    - Any future plan touching /en/pay rendering
    - Integration contract §6 consumers (extension coupling)
tech_stack:
  added: []
  patterns:
    - OR-widened Paddle injection condition (meta.path === "/pay" || meta.path === "/en/pay")
    - Defense-in-depth Disallow pairs (RU then EN within each robots.txt agent block)
key_files:
  created: []
  modified:
    - scripts/prerender.mjs
    - docs/INTEGRATION-CONTRACT.md
    - public/robots.txt
decisions:
  - "D-03b: symmetric extension of Paddle injection to /en/pay — contract updated atomically with code"
  - "§3 note below table (not a new row) — /en/pay is site-SEO addition, not extension-linked route"
  - "3 Allow-only robots.txt blocks (Applebot-Extended, cohere-ai, anthropic-ai) left unchanged — asymmetry rule: no EN Disallow without RU Disallow sibling"
metrics:
  duration: "8min"
  completed: "2026-05-16"
  tasks: 3
  files: 3
requirements:
  - GEO-C-2
---

# Phase 3 Plan 04: Paddle Symmetric /en/pay + Integration Contract + robots.txt

One-liner: synchronous Paddle CDN script extended from `/pay` to `/en/pay` via OR-widened condition in prerender.mjs; INTEGRATION-CONTRACT.md §6 updated atomically; robots.txt defense-in-depth Disallow on /en/account + /en/success + /en/dashboard/ for 5 AI crawler agent blocks.

## What Was Done

Three coupled edits in one atomic commit per D-03b ("Integration Contract §6 is extended symmetrically, not violated"):

### 1. scripts/prerender.mjs — Paddle condition widened

**Before (line 192):**
```js
if (meta.path === "/pay") {
  html = applyPaddleScript(html);         // Phase 2.2: sync Paddle SDK on /pay only
}
```

**After:**
```js
if (meta.path === "/pay" || meta.path === "/en/pay") {
  html = applyPaddleScript(html);         // Phase 3 D-03b: sync Paddle SDK on /pay AND /en/pay (symmetric extension; INTEGRATION-CONTRACT §6).
}
```

Function body of `applyPaddleScript` (lines 175-180) unchanged — only the calling condition widened.

### 2. docs/INTEGRATION-CONTRACT.md — §3 note + §6 symmetric mention + Last sync bump

- **Last sync:** bumped from `2026-05-14` to `2026-05-16`.
- **§3:** Added one-line note below the locked-routes table (NOT a new row): `/en/pay` is a site-side SEO addition, extension does not navigate there in shipped versions.
- **§6:** Extended "Per-route loading strategy" paragraph to explicitly name both `dist/pay/index.html` AND `dist/en/pay/index.html` as Paddle-injected surfaces. Added Phase 3 D-03b widen description. EN sibling routes added to the "do NOT load Paddle" list. "Don't" subsection preserved unchanged (no async/defer).

### 3. public/robots.txt — /en/* defense-in-depth Disallows

Added `Disallow: /en/account`, `Disallow: /en/success`, `Disallow: /en/dashboard/` to the same 5 user-agent blocks that already disallow the unprefixed equivalents (`*`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`). Each new line placed immediately below its unprefixed sibling (RU-then-EN grouping within each block).

The 3 Allow-only blocks (`Applebot-Extended`, `cohere-ai`, `anthropic-ai`) left unchanged — asymmetry rule: no EN Disallow without an existing RU Disallow sibling.

## Build Verification

Build ran successfully (`npm run build` exit 0). Prerender log confirmed:

```
✓ /en/pay → \dist\en\pay\index.html (head)
✓ prerender complete: 12 routes emitted
```

### dist/en/pay/index.html Paddle proof (snippet from head section)

```html
<link rel="preconnect" href="https://cdn.paddle.com" />
<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
```

These tags are byte-identical to the injection in `dist/pay/index.html`. Both routes carry the synchronous (non-async, non-defer) Paddle script.

### Phase 2.2 perf invariant preserved

`dist/index.html` (landing) — **no** Paddle script tag. Confirmed for 5 other non-pay routes too (welcome, privacy, en/index, en/welcome, en/privacy).

## Diff Stats

| File | Lines added | Lines removed |
|------|-------------|---------------|
| `scripts/prerender.mjs` | 2 | 2 |
| `docs/INTEGRATION-CONTRACT.md` | ~20 | 2 |
| `public/robots.txt` | 15 | 0 |

## Acceptance Criteria Status

| Criterion | Status |
|-----------|--------|
| `meta.path === "/pay" \|\| meta.path === "/en/pay"` in prerender.mjs | PASS |
| `dist/en/pay/index.html` carries Paddle script + preconnect | PASS |
| `dist/pay/index.html` carries Paddle script + preconnect | PASS |
| `dist/index.html` does NOT carry Paddle script | PASS |
| INTEGRATION-CONTRACT.md §6 mentions /en/pay (5 occurrences) | PASS |
| Last sync date is 2026-05-16 | PASS |
| §3 locked-routes table has exactly 5 rows | PASS |
| §3 /en/pay appears in note (not table row) | PASS |
| §6 "Don't" subsection preserved (no async/defer) | PASS |
| robots.txt: 5 × `Disallow: /en/account` | PASS |
| robots.txt: 5 × `Disallow: /en/success` | PASS |
| robots.txt: 5 × `Disallow: /en/dashboard/` | PASS |
| Sitemap line preserved | PASS |
| 3 Allow-only blocks unchanged | PASS |
| Build exits 0 | PASS |

## Last sync date in INTEGRATION-CONTRACT.md

```
Last sync: 2026-05-16 against extension `manifest.json` version **1.3.5**.
```

## Deviations from Plan

None — plan executed exactly as written. All three edits are strictly within the stated surface area (1 condition line + comment in prerender.mjs; §3 note + §6 paragraph + Last sync line in contract; 15 Disallow lines in robots.txt).

## Threat Register

| Threat ID | Disposition | Status |
|-----------|-------------|--------|
| T-03-09 | accept | No new attack surface; CDN URL identical to /pay |
| T-03-10 | mitigate | Synchronous script preserved (not async/defer); window.Paddle defined before PayPage mounts on /en/pay direct hits |
| T-03-11 | mitigate | robots.txt Disallows /en/account + /en/success + /en/dashboard/ in 5 agent blocks |
| T-03-12 | mitigate | Contract update ships in SAME COMMIT as code change — git history always consistent |

## Self-Check: PASSED

- `scripts/prerender.mjs` modified: confirmed (condition widened, comment updated)
- `docs/INTEGRATION-CONTRACT.md` modified: confirmed (/en/pay appears 5 times, Last sync 2026-05-16, §3 note, §6 extended)
- `public/robots.txt` modified: confirmed (5 × each of /en/account, /en/success, /en/dashboard/)
- `dist/pay/index.html` has Paddle script: confirmed (count=1)
- `dist/en/pay/index.html` has Paddle script: confirmed (count=1)
- `dist/index.html` no Paddle script: confirmed (count=0)
- §3 table row count = 5 (not 6): confirmed
- Build exit 0: confirmed
