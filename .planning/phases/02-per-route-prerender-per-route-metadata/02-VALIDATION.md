---
phase: 2
slug: per-route-prerender-per-route-metadata
status: draft
nyquist_compliant: false
nyquist_applicable: false
wave_0_complete: not_required
created: 2026-05-15
---

# Phase 2 — Validation Strategy

> Per-phase validation contract. Per `02-RESEARCH.md §Validation Architecture` and `REQUIREMENTS.md` "Out of Scope" ("Tests / ESLint / typecheck script — codebase has none; not adding inside a GEO milestone"), this project does **not** participate in Nyquist test validation. Verification = `npm run build` + `npm run preview` + `curl` + the `geo` skill's `fetch_page.py`.
>
> `nyquist_compliant: false` is **expected and acceptable** for this phase. The planner MUST NOT generate Wave 0 test-scaffolding tasks.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none (no test framework installed; introducing one is out-of-scope per REQUIREMENTS.md) |
| **Config file** | none |
| **Quick run command** | `npm run build` (TS errors surface here) |
| **Full suite command** | `npm run build && npm run preview` + manual `curl` recipes from `02-RESEARCH.md §Verification Recipe` |
| **Estimated runtime** | ~20–40s for `npm run build`; ~10s for the curl recipes |

---

## Sampling Rate

- **After every task commit:** `npm run build` (catches TS / Vite-resolution / import-order regressions immediately).
- **After every plan wave:** `npm run build && npm run preview &` then run the curl recipes from `02-RESEARCH.md §Verification Recipe`.
- **Before `/gsd-verify-work`:** full curl recipe set must pass; `~/.claude/skills/geo/scripts/fetch_page.py` must report `has_ssr_content: true` and `word_count > 100` on each fully-prerendered route.
- **Max feedback latency:** ~40s (`npm run build` is the slowest gate).

---

## Per-Task Verification Map

Verification map is produced inline in each `*-PLAN.md` via the `<acceptance_criteria>` blocks (planner contract). Re-summarised here:

| Task ID (placeholder) | Plan | Wave | Requirement | Verification |
|---|---|---|---|---|
| 02-01 | seo-routes manifest | 1 | GEO-B-1 | `npm run build`; manifest file exists; `node -e "import('./scripts/seo-routes.js').then(m => console.log(m.SEO_ROUTES.length))"` prints `6` |
| 02-02 | entry-server.tsx | 1 | GEO-B-2 | `npm run build`; file exists; SSR build emits `.ssr-cache/entry-server.js` without error |
| 02-03 | LangContext SSR-safety mod | 1 | GEO-B-2 | `npm run build`; SSR test render of `<App/>` does not throw `localStorage is not defined` |
| 02-04 | prerender.mjs | 2 | GEO-B-1, GEO-B-2 | `node scripts/prerender.mjs` exits 0; `dist/{welcome,privacy,terms,refund,pay}/index.html` all exist; `grep -c '<title>' dist/welcome/index.html` is `1` and unique per route |
| 02-05 | sitemap regen script | 2 | GEO-B-3 | `dist/sitemap.xml` parses (e.g. `node -e "import('fs').then(f=>f.readFileSync('dist/sitemap.xml','utf8'))"`); contains 6 `<lastmod>` entries with ISO build date |
| 02-06 | package.json build chain | 3 | GEO-B-1, GEO-B-2, GEO-B-3 | `npm run build` exits 0 and produces all the above outputs in one invocation |
| 02-07 | main.tsx hydrate detector | 3 | GEO-B-2 | `npm run build` then `npm run preview`; visiting `/welcome` in headless browser shows `hydrateRoot` was used (no full re-render flash); `/account` still mounts via `createRoot` |
| 02-08 (final) | .gitignore + preview verify | 4 | GEO-B-1, GEO-B-2, GEO-B-3 | full curl recipe from `02-RESEARCH.md §Verification Recipe` passes; `fetch_page.py` reports per-route distinct titles + `has_ssr_content: true` for marketing routes |

The exact Task IDs above are placeholders — the planner re-IDs them in each `*-PLAN.md`.

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] **Not required.** Project has no test framework; introducing one is out-of-scope per `REQUIREMENTS.md "Out of Scope"` and confirmed by `02-RESEARCH.md §Validation Architecture`.
- [ ] If the milestone later flips to add tests, the framework choice would be Vitest (Vite-compatible) with a per-route assertion suite at `tests/prerender.test.ts`. **Out of scope for Phase 2.**

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AI-crawler word count + `has_ssr_content: true` on the 5 marketing routes | GEO-B-2 | Requires running the GEO skill against a preview deploy (Vercel preview URL); cannot be asserted from source alone. | After deploy: `~/.claude/skills/geo/scripts/fetch_page.py https://<preview>.vercel.app/welcome` — confirm `has_ssr_content: true`, `word_count > 100`, `title` non-default. Repeat for `/`, `/privacy`, `/terms`, `/refund`. |
| OG card unfurl visual check | GEO-B-2 | Telegram / Slack / Twitter previews are visual; no curl assertion. | Paste preview URL into Telegram + Slack — confirm per-route OG title/description renders. |
| Phase 1 JSON-LD blocks preserved in every emitted HTML | GEO-A-5 (preservation) | Visual diff of `<head>` against source `index.html` is easier than a structural assertion. | `diff <(sed -n '/<script type="application\/ld+json">/,/<\/script>/p' dist/index.html) <(sed -n '/<script type="application\/ld+json">/,/<\/script>/p' dist/welcome/index.html)` — should be empty. |
| Paddle preconnect + sync script tag preserved | DEC-integration-contract-paddle-init | Failure mode (Paddle modal not mounting) only shows in browser. | `grep -c 'cdn.paddle.com' dist/welcome/index.html` should be `2` (preconnect + script). Then visit `/pay` on preview, click upgrade CTA — Paddle Checkout must open. |

---

## Validation Sign-Off

- [x] Nyquist not applicable for this phase (project policy — no test framework, no plans to introduce one in this milestone).
- [x] Every task has either an `npm run build` gate, a `dist/*` file-existence assertion, or a curl assertion as its automated verify.
- [x] No watch-mode flags (project has no test runner to flag).
- [x] Feedback latency < 60s (`npm run build` dominates at ~20–40s).
- [x] `nyquist_compliant: false` set in frontmatter — expected per project policy.
- [x] `nyquist_applicable: false` set in frontmatter — surfaces the policy explicitly to downstream gates.

**Approval:** pending — auto-generated 2026-05-15 from `02-RESEARCH.md §Validation Architecture`.
