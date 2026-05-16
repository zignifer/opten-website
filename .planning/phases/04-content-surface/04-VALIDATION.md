---
phase: 4
slug: content-surface
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `04-RESEARCH.md` §"Validation Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **No unit-test framework.** Repo convention is `npm run build` + curl/grep + MCP-driven Playwright + MCP-driven PageSpeed + Google Rich Results Test (web UI). See `CLAUDE.md` "Tech stack" and `.planning/codebase/TESTING.md`. |
| **Config file** | None — no jest/vitest/pytest config exists. |
| **Quick run command** | `npm run build` (catches TS errors + malformed `JSON.stringify` schema literals + missing route mounts) |
| **Full suite command** | `npm run build && npm run preview` + curl/grep sweep of all 14 routes + Playwright MCP `/pay` sanity + PageSpeed MCP on `/` and `/en/` + Rich Results Test on every prerendered URL |
| **Estimated runtime** | ~30 s build · ~5 min full sweep including MCP runs |

---

## Sampling Rate

- **After every task commit:** `npm run build` — must be green.
- **After every plan wave:** `npm run build && npm run preview` + curl/grep sweep + Rich Results Test on 2–3 affected routes.
- **Before `/gsd-verify-work`:** Full validation table below must be green, including Playwright + PageSpeed MCP runs.
- **Max feedback latency:** ~30 s for `npm run build`; ~5 min for full MCP sweep.

---

## Per-Task Verification Map

> Tasks resolve to plan tasks in `04-PLAN-*.md` once the planner runs.
> The 23 rows below come from `04-RESEARCH.md` §"Phase Requirements → Test Map".
> "File Exists" reflects the no-test-framework reality — `❌ W0` means the validation lives as a curl/MCP command, not a checked-in test file.

| # | Requirement | Wave | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|-------------|------|------------|-----------------|-----------|-------------------|-------------|--------|
| V-01 | GEO-D-1 | 3 | — | `/about` ships ~1000+ words RU | curl + wc | `curl -s https://opten.space/about \| wc -w` ≥ 800 | ❌ W0 (no file — MCP/curl) | ⬜ pending |
| V-02 | GEO-D-1 | 2 | — | `/about` carries Person schema with `image`, `worksFor`, `sameAs`, `jobTitle` | schema-extraction | `curl -s https://opten.space/about \| grep -A2 '"@type": "Person"'` + Google Rich Results Test | ❌ W0 | ⬜ pending |
| V-03 | GEO-D-1 | 3 | — | `/about` carries `<html lang="ru">` only, no `en` hreflang alternate | curl/grep | `curl -s https://opten.space/about \| grep 'hreflang'` → ONLY `ru` line | ❌ W0 | ⬜ pending |
| V-04 | GEO-D-1 | 3 | — | `/en/about` does NOT exist as prerendered file | curl + dist-check | `curl -sI https://opten.space/en/about` → SPA fallback; `dist/en/about/index.html` absent | ❌ W0 | ⬜ pending |
| V-05 | GEO-D-2 | 3 | — | `/guides/<slug>` + `/en/guides/<slug>` both prerendered with bilingual content | curl/grep | `curl -s https://opten.space/guides/<slug> \| grep 'lang="ru"'` + same for EN sibling with `lang="en"` | ❌ W0 | ⬜ pending |
| V-06 | GEO-D-2 | 2 | — | Guide carries HowTo schema with 5–7 `HowToStep` entries | schema-extraction | `curl -s ... \| grep '"@type": "HowToStep"' \| wc -l` ≥ 5 | ❌ W0 | ⬜ pending |
| V-07 | GEO-D-2 | 3 | — | Guide hreflang triplet reciprocal between RU and EN siblings | curl/grep | Both `/guides/<slug>` and `/en/guides/<slug>` reference each other in `hreflang` block | ❌ W0 | ⬜ pending |
| V-08 | GEO-D-3 | 2 | — | FAQPage schema on landing (`/` and `/en/`) | schema-extraction | `curl -s https://opten.space/ \| grep '"@type": "FAQPage"'` + same for `/en/` | ❌ W0 | ⬜ pending |
| V-09 | GEO-D-3 | 2 | — | FAQPage schema on anchor guide | schema-extraction | `curl -s https://opten.space/guides/<slug> \| grep '"@type": "FAQPage"'` | ❌ W0 | ⬜ pending |
| V-10 | GEO-D-3 | 3 | — | FAQ Q/A pairs match schema `mainEntity` count (5–6) | schema + visual | Visible `<details>`/`<dt>` count == `mainEntity` entry count | ❌ W0 | ⬜ pending |
| V-11 | D-09 entity-graph | 2 | — | `@id` cross-references resolve (every referenced `@id` is declared somewhere on the same prerendered HTML) | grep | Cross-reference grep sweep — see `04-RESEARCH.md` §Pitfall 1 | ❌ W0 | ⬜ pending |
| V-12 | D-09 schema validation | gate | — | All 8 schema types valid in Google Rich Results Test | manual web | Submit `/`, `/en/`, `/about`, guide pair, `/pay` pair — 0 errors | ❌ W0 | ⬜ pending |
| V-13 | D-11 llms.txt | 4 | — | `/llms.txt` exists, starts with `# Opten`, `Content-Type: text/plain` | curl | `curl -I .../llms.txt` returns 200 + text/plain; head -1 == `# Opten` | ❌ W0 | ⬜ pending |
| V-14 | D-11 llms-full.txt | 4 | — | `/llms-full.txt` exists, includes text from landing + about + guide + pay | curl | `curl -s .../llms-full.txt \| grep -c 'opten.space'` ≥ 5 | ❌ W0 | ⬜ pending |
| V-15 | D-12 /pay prerender | 3 | T-04 (Paddle invariant) | Pricing strings (RUB + USD plan names) visible in initial HTML, not just React-rendered | curl/grep | `curl -s https://opten.space/pay \| grep -E '(199₽\|2\\.99)'` ≥ 2 matches | ❌ W0 | ⬜ pending |
| V-16 | D-12 Paddle invariant | 3 | T-04 | `<script src="cdn.paddle.com">` present in `/pay/index.html` AND `/en/pay/index.html` | curl/grep | `curl -s .../pay \| grep 'cdn.paddle.com'` + same for `/en/pay` | ❌ W0 | ⬜ pending |
| V-17 | D-12 Paddle modal | 3 | T-04 | Clicking Pay button opens Paddle overlay (no regression) | Playwright MCP | Navigate `/pay?token=test`, click Pay, assert `iframe[src*="paddle.com"]` within 3 s | ❌ W0 | ⬜ pending |
| V-18 | D-13 LCP mobile RU | 1 | — | Mobile LCP on `/` ≤ 2.5 s post-deploy | PageSpeed MCP | `mcp__pagespeed__*` against `https://opten.space/` mobile strategy → LCP ≤ 2500 ms | ❌ W0 | ⬜ pending |
| V-19 | D-13 LCP mobile EN | 1 | — | Mobile LCP on `/en/` ≤ 2.5 s | PageSpeed MCP | Same against `https://opten.space/en/` | ❌ W0 | ⬜ pending |
| V-20 | D-14 X-Frame-Options | 1 | T-01 (clickjacking) | Header `X-Frame-Options: SAMEORIGIN` present on all routes | curl | `curl -sI https://opten.space/ \| grep -i 'x-frame-options'` returns `SAMEORIGIN` | ❌ W0 | ⬜ pending |
| V-21 | D-14 Content-Signal | 1 | — | `Content-Signal` directive present in robots.txt (vocabulary TBD — see Q2) | curl | `curl -s https://opten.space/robots.txt \| grep -i 'content-signal'` returns expected line | ❌ W0 | ⬜ pending |
| V-22 | D-14 no CSP regression | 1 | — | CSP NOT silently added to vercel.json | grep | `git diff vercel.json` MUST NOT contain `Content-Security-Policy` | ❌ W0 | ⬜ pending |
| V-23 | SYNC chain | gate | — | `EN_SIBLINGS` ↔ `seo-routes.ts` ↔ `main.tsx` ↔ `entry-server.tsx` all agree on `/guides/<slug>`; `/about` in seo-routes.ts + both routers but NOT in `EN_SIBLINGS` | grep | 4-file sweep per `.planning/codebase/CONVENTIONS.md` §SYNC | ❌ W0 | ⬜ pending |
| V-24 | Existing-route regression | gate | — | All 12 prerendered routes from Phase 3 still respond + carry hreflang triplet | Playwright MCP | Sweep all 12 routes post-deploy; existing GEO audit reports `has_ssr_content: true` everywhere | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Wave column maps to the 4-wave sequencing in `04-RESEARCH.md` §Implementation Recommendations — see Pattern 1 sequencing.*

---

## Wave 0 Requirements

**No automated test files to add.** The repo's "test framework" is the union of:

- `npm run build` (the TS/JSON-LD smoke test)
- curl/grep (HTML correctness)
- Playwright MCP (interaction sanity, mainly `/pay` Paddle modal)
- PageSpeed MCP (LCP gate)
- Google Rich Results Test (schema legality)

The one piece of **pre-implementation** validation that DOES need to happen before D-13 lands:

- [ ] **PageSpeed MCP run against production `/` and `/en/` to identify the actual LCP element.** Without this, the hero preload (D-13) may target the wrong asset. Output is a single annotation in the D-13 plan task (e.g., "LCP element is `feature-models-w400.webp` on mobile") — not a code artifact. Confidence assessment: research flags this as LOW confidence — must be resolved during planning or in the first task of Wave 1.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/about` reads as a human-written E-E-A-T page (no AI-content tells) | GEO-D-1 / D-07 | AI-content detection is heuristic; the relevant signal is editor judgement, not a test command. | Read the page top-to-bottom. Check: first-person voice, concrete dates/numbers, specific anecdote, founder photo renders, Telegram link clickable, no AI-generated symbolism. |
| Guide reads as human-written (D-07) | GEO-D-2 / D-07 | Same as above. | Same checklist applied to guide body and before/after prompt blocks. |
| Founder photo renders correctly (resolution, alt text, no broken image) | GEO-D-1 (Person schema `image`) | Visual check — automated DOM check would not catch a "wrong photo". | Open `/about` in Chrome desktop + mobile viewport; confirm photo loads under 200 KB; alt text mentions "founder" or name. |
| Anchor guide topic reflects highest-frequency real reader question (D-04) | GEO-D-2 | Topic selection is a judgement call from Telegram / CWS-review sampling. | Sample Telegram chat + CWS reviews during planning. Document the top-3 candidates in the plan task description before locking the slug. |
| FAQ Q/A wording reads naturally and matches real user phrasing (D-08) | GEO-D-3 | "Question phrasing" matches reader-mode evaluation, not a test. | Editor review pass — questions should sound like a real user asked them, not be marketing-flavoured. |

---

## Validation Sign-Off

- [ ] All 24 validation rows have an automated command or are flagged as `Manual-Only` above
- [ ] Sampling continuity: every wave merge requires curl/grep sweep — no wave passes without `npm run build` green
- [ ] Wave 0 covers the one pre-implementation MISSING reference (LCP element identification before D-13)
- [ ] No watch-mode flags (irrelevant — no test runner)
- [ ] Feedback latency: ~30 s for build, ~5 min for full MCP sweep — acceptable for a marketing-site project
- [ ] `nyquist_compliant: true` set in frontmatter once plan-checker passes

**Approval:** pending
