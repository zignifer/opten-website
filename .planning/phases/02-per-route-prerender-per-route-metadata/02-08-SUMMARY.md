---
phase: 02-per-route-prerender-per-route-metadata
plan: "08"
subsystem: seo/prerender
tags: [gitignore, verification, geo-b-1, geo-b-2, geo-b-3, postdeploy]
dependency_graph:
  requires:
    - 02-01 (seo-routes.ts manifest)
    - 02-02 (entry-server.tsx SSR bundle)
    - 02-03 (SSR-safe LangContext)
    - 02-04 (prerender.mjs script + gitignore deviation)
    - 02-05 (sitemap.mjs script)
    - 02-06 (build pipeline wiring)
    - 02-07 (hydrateRoot hydration switch)
  provides:
    - .gitignore excluding .ssr-cache and .ssr-meta (committed in 02-04, confirmed here)
    - Local verification report for all Phase 2 artifacts
    - DEFERRED: post-deploy acceptance checklist (Sections A-G) awaiting Vercel preview URL
  affects:
    - .planning/STATE.md
    - .planning/ROADMAP.md
tech_stack:
  added: []
  patterns:
    - Two-outDir Vite SSR builds (.ssr-cache + .ssr-meta) — Vite 6 behavior, gitignored
key_files:
  created:
    - .planning/phases/02-per-route-prerender-per-route-metadata/02-08-SUMMARY.md
  modified:
    - .planning/STATE.md
    - .planning/ROADMAP.md
decisions:
  - "Task 1 (.gitignore edit) was already completed as part of Plan 02-04 deviation — deviation required adding .ssr-meta alongside .ssr-cache in the same commit (93b0a51). No separate commit needed for 02-08 Task 1."
  - "Post-deploy verification (Task 2, Sections A-G) deferred until Vercel preview URL is available after git push origin main. All locally-runnable checks pass against dist/."
metrics:
  duration: "~15 minutes"
  completed: "2026-05-15"
---

# Phase 2 Plan 08: Gitignore + Post-Deploy Verification Summary

## One-liner

`.gitignore` already excludes both `.ssr-cache` and `.ssr-meta` (committed in `93b0a51` as a Plan 02-04 deviation); all locally-runnable Phase 2 verification checks pass against `dist/`; post-deploy Sections A-G deferred pending Vercel preview URL.

## What Was Done

### Task 1: .gitignore (COMPLETED — inherited from Plan 02-04 deviation)

The `.gitignore` edit was executed as part of Plan 02-04's deviation fix (commit `93b0a51`) when Vite 6.3.5's outDir-clearing behavior forced two separate SSR output directories. The plan originally called for adding only `.ssr-cache`; the deviation added both `.ssr-cache` and `.ssr-meta` in the same commit.

**Current `.gitignore` state (lines 3-5):**
```
.vite
.ssr-cache
.ssr-meta
```

**Functional verification (run 2026-05-15):**
- `npm run build` exits 0 — full chain (SPA + two SSR builds + prerender + sitemap) completes successfully
- `git status --porcelain .ssr-cache .ssr-meta` returns empty — both directories exist on disk but are gitignored
- Pattern was committed in `93b0a51` and is byte-active

### Task 2: Local Verification (PARTIALLY COMPLETE — locally-runnable subset)

All locally-runnable verification checks ran against the current `dist/` produced by `npm run build`.

#### L1 — File existence (prerendered routes)

| File | Status |
|------|--------|
| `dist/index.html` | FOUND |
| `dist/welcome/index.html` | FOUND |
| `dist/pay/index.html` | FOUND |
| `dist/privacy/index.html` | FOUND |
| `dist/terms/index.html` | FOUND |
| `dist/refund/index.html` | FOUND |
| `dist/sitemap.xml` | FOUND |

#### L2 — SPA-only routes NOT prerendered

| File | Status |
|------|--------|
| `dist/account/index.html` | NOT PRESENT (correct — SPA fallback) |
| `dist/success/index.html` | NOT PRESENT (correct — SPA fallback) |
| `dist/dashboard/download-skill/index.html` | NOT PRESENT (correct — SPA fallback) |

#### L3 — Distinct titles per route

All 6 titles are distinct (6 unique values out of 6 files):

| Route file | Title |
|-----------|-------|
| `dist/index.html` | `Opten — AI-оценка и улучшение промптов для генерации изображений` |
| `dist/welcome/index.html` | `Добро пожаловать в Opten — начало работы с расширением` |
| `dist/pay/index.html` | `Тарифы Opten — Pro-подписка для улучшения промптов` |
| `dist/privacy/index.html` | `Политика конфиденциальности — Opten` |
| `dist/terms/index.html` | `Условия использования — Opten` |
| `dist/refund/index.html` | `Политика возврата — Opten` |

Result: **PASS** — 6 distinct titles, none repeated.

#### L4 — Canonical URLs per route (no trailing slash)

| Route | Canonical href |
|-------|---------------|
| `/` | `https://opten.space/` |
| `/welcome` | `https://opten.space/welcome` |
| `/pay` | `https://opten.space/pay` |
| `/privacy` | `https://opten.space/privacy` |
| `/terms` | `https://opten.space/terms` |
| `/refund` | `https://opten.space/refund` |

Result: **PASS** — all 6 routes have distinct canonical href, bare path, no trailing slash on routes (root has `https://opten.space/` which is correct).

#### L5 — Paddle script preserved in every emitted file

`grep -c 'cdn.paddle.com/paddle/v2/paddle.js'` returns `1` for each of the 6 files.

Result: **PASS** — synchronous Paddle script preserved in all 6 prerendered HTML files.

#### L6 — JSON-LD blocks preserved in every emitted file

`grep -c '<script type="application/ld+json">'` returns `2` for each of the 6 files.

Result: **PASS** — both JSON-LD blocks (SoftwareApplication + Organization) preserved in all 6 prerendered HTML files.

#### L7 — Sitemap content

- File length: 1,052 chars — parses without error
- `<url>` entries: **6**
- `<lastmod>` entries: **6**
- Unique dates: **1** (`2026-05-14`) — uniform build-time ISO date (D-04 compliant)

Result: **PASS** — sitemap.xml has exactly 6 URL entries all with a uniform lastmod date.

#### L8 — Integration-contract leak audit (scripts/)

`grep -rE 'EXTENSION_IDS|SUPABASE_URL|SUPABASE_ANON_KEY|VITE_PADDLE_(ENV|CLIENT_TOKEN)|iphkppgbobpilmphloffcalicmejacfl|vuywydhwkqmihfztpkgl' scripts/` returns **0 matches** (exit code 1 = no matches found).

Result: **PASS** — no integration-contract constants leaked into scripts/.

## Deviations from Plan

### Inherited Deviation (from Plan 02-04)

**[Plan 02-04 deviation, inherited] .ssr-meta added alongside .ssr-cache in .gitignore**

- **Background:** Plan 02-08 originally specified adding only `.ssr-cache` to `.gitignore`. However, Plan 02-04 discovered that Vite 6.3.5 requires two separate SSR outDirs (`.ssr-cache` for `entry-server.tsx`, `.ssr-meta` for `seo-routes.ts`) to prevent inter-build erasure.
- **Resolution:** Both `.ssr-cache` and `.ssr-meta` were added to `.gitignore` in commit `93b0a51` as part of Plan 02-04's deviation fix. Plan 02-08 Task 1 is therefore already complete — no separate commit needed.
- **Commit:** 93b0a51 (`feat(seo): add postbuild prerender script emitting per-route HTML (GEO-B-1, GEO-B-2)`)
- **Impact on this plan:** Task 1 is a no-op; documentation and state updates are the only outputs of Plan 02-08.

### No Task 1 commit in this plan

Since the `.gitignore` change was committed as part of Plan 02-04's deviation (before this plan was executed), there is no separate "Task 1 commit" for Plan 02-08. The commit history is clean and the gitignore is correct. The plan's stated Task 1 outcome is fully satisfied.

## DEFERRED: Post-Deploy Verification (Task 2, Sections A-G)

The following verification items require a live Vercel preview URL, which does not exist until after `git push origin main` triggers an auto-deploy. They are deferred and must be run by the user after the current commits land on `main`.

**How to trigger the Vercel preview deploy:**
```bash
git push origin main
```
Vercel auto-deploys on push. The preview URL will be visible in the Vercel dashboard or via `vercel ls` (if the Vercel CLI is installed).

**Deferred checklist — run against `https://<preview>.vercel.app` after deploy:**

### Section A — Per-route distinct titles + canonicals (GEO-B-2)
```bash
# A1: distinct titles
for route in / pay welcome privacy terms refund; do
  echo "=== $route ==="; curl -s "https://<preview>.vercel.app$route" | grep -oE '<title>[^<]*</title>' | head -1
done

# A2: distinct canonicals
for route in / pay welcome privacy terms refund; do
  echo "=== $route ==="; curl -s "https://<preview>.vercel.app$route" | grep -oE '<link rel="canonical"[^>]*>' | head -1
done

# A3: OG tags per route
for route in / pay welcome privacy terms refund; do
  echo "=== $route og ==="; curl -s "https://<preview>.vercel.app$route" | grep -E '(og:title|og:description|og:url)' | head -3
done
```

### Section B — Phase 1 invariants preserved
```bash
# B1: 2 JSON-LD blocks per route
# B2: Sync Paddle script preserved
# B3: No async/defer on Paddle
# B4: Paddle preconnect preserved
# B5: og-card-ru.png in og:image + twitter:image
for route in / pay welcome privacy terms refund; do
  echo "=== $route B1 json-ld ==="
  curl -s "https://<preview>.vercel.app$route" | grep -c '<script type="application/ld+json">'
  echo "=== $route B2 paddle ==="
  curl -s "https://<preview>.vercel.app$route" | grep -c 'cdn.paddle.com/paddle/v2/paddle.js'
  echo "=== $route B3 no-async ==="
  curl -s "https://<preview>.vercel.app$route" | grep -E 'paddle\.js"\s+(async|defer)' || echo "(none — correct)"
  echo "=== $route B4 preconnect ==="
  curl -s "https://<preview>.vercel.app$route" | grep -c 'rel="preconnect" href="https://cdn.paddle.com"'
  echo "=== $route B5 og-card ==="
  curl -s "https://<preview>.vercel.app$route" | grep -c 'og-card-ru.png'
done
```

### Section C — Integration-contract preservation
```bash
# C1: Locked SPA routes still respond with 200
curl -sI "https://<preview>.vercel.app/account" | head -1
curl -sI "https://<preview>.vercel.app/success" | head -1
curl -sI "https://<preview>.vercel.app/dashboard/download-skill" | head -1

# C2: SPA fallback delivers empty root div to locked routes
curl -s "https://<preview>.vercel.app/account" | grep -oE '<div id="root">[^<]*'

# C3: No Supabase URL leakage
curl -s "https://<preview>.vercel.app/welcome" | grep -c 'vuywydhwkqmihfztpkgl.supabase.co'
# Expected: 0

# C4: Phase 1 security headers still present
curl -sI "https://<preview>.vercel.app/" | grep -i 'x-content-type-options: nosniff'
curl -sI "https://<preview>.vercel.app/" | grep -i 'referrer-policy: strict-origin-when-cross-origin'
curl -sI "https://<preview>.vercel.app/" | grep -i 'permissions-policy'
```

### Section D — Sitemap 6 lastmod entries (GEO-B-3)
```bash
curl -s "https://<preview>.vercel.app/sitemap.xml" | grep -c '<lastmod>'
# Expected: 6

curl -s "https://<preview>.vercel.app/sitemap.xml" | grep -oP '<lastmod>\K[0-9]{4}-[0-9]{2}-[0-9]{2}' | sort -u | wc -l
# Expected: 1 (uniform date)

curl -sI "https://<preview>.vercel.app/sitemap.xml" | grep -i 'content-type'
# Expected: application/xml or text/xml

curl -sI "https://<preview>.vercel.app/robots.txt" | grep -i 'content-type: text/plain'
curl -sI "https://<preview>.vercel.app/llms.txt" | grep -i 'content-type: text/plain'
```

### Section E — AI-crawler verification via fetch_page.py
```bash
for route in "" welcome privacy terms refund; do
  echo "=== /$route ==="
  ~/.claude/skills/geo/scripts/fetch_page.py "https://<preview>.vercel.app/$route"
done
# Expected: has_ssr_content: true, word_count > 100, structured_data count = 2

~/.claude/skills/geo/scripts/fetch_page.py "https://<preview>.vercel.app/pay"
# Expected: has_ssr_content: false (body empty per D-02), structured_data count = 2, pay-specific title
```

### Section F — OG unfurl visual check (manual)
1. Paste `https://<preview>.vercel.app/welcome` into Telegram — confirm route-specific og:title + og-card-ru.png 1200x630
2. Paste `https://<preview>.vercel.app/privacy` into Telegram — confirm privacy-specific og:title
3. Repeat F1-F2 against Slack
4. (Optional) Repeat against Twitter/X

### Section G — Paddle modal functional on /pay
1. Visit `https://<preview>.vercel.app/pay` in a real browser
2. Open DevTools Console — check for no hydration warnings and no Paddle bootstrap errors
3. Click the USD pricing CTA — Paddle Checkout modal should open
4. Verify no console errors from `window.Paddle.Checkout.open`

**Phase 2 closure gate:** Phase 2 is NOT formally closed until all Sections A-G are marked PASS. If any section fails, file a follow-up plan in this phase directory.

**Final GEO rescore:** After ~7-14 days on production, run:
```bash
/geo audit https://opten.space
```
Expected: score uplift from ~30/100 (post-Phase-1) toward the Phase 2 target.

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 (.gitignore) | 93b0a51 | (committed as Plan 02-04 deviation — no separate commit in Plan 02-08) |
| Task 2 (verification) | DEFERRED | Awaiting Vercel preview URL after `git push origin main` |

## Self-Check: PASSED

- `.gitignore` contains `.ssr-cache` (line 4) and `.ssr-meta` (line 5) — confirmed
- Commit `93b0a51` exists in git log — confirmed
- `npm run build` exits 0 with full chain output — confirmed
- `git status --porcelain .ssr-cache .ssr-meta` returns empty (directories are gitignored) — confirmed
- All 8 locally-runnable verification checks (L1-L8) pass — confirmed
- Post-deploy verification (Sections A-G) correctly deferred — documented above
