---
phase: 01-static-geo-foundations
status: complete
shipped: 2026-05-14
backfilled: 2026-05-17
---

# Phase 01 — Static GEO foundations — SUMMARY (backfilled)

**Shipped:** 2026-05-14 (8 atomic commits, GEO-A-1..GEO-A-8)
**Backfilled:** 2026-05-17 during v1.0 milestone close (original Phase 01 shipped before the SUMMARY-per-plan convention was enforced).

## Goal achieved

Raised opten.space GEO score from 12/100 to ~30/100 by adding the static foundations AI crawlers and link-preview clients expect — without touching React or the build pipeline.

## Plans shipped

All 8 atomic commits landed pre-Phase-2:

| Plan | What | Requirement |
|------|------|-------------|
| 01-01 | `public/robots.txt` with per-bot blocks for `*`, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, cohere-ai, anthropic-ai | GEO-A-1 |
| 01-02 | `public/sitemap.xml` with 6 marketing routes + priorities | GEO-A-2 |
| 01-03 | `public/llms.txt` (llmstxt.org structure, English) | GEO-A-3 |
| 01-04 | OG hero cards `public/og-card-{ru,en}.png` (1200×630) | GEO-A-4 |
| 01-05 | Inline `SoftwareApplication` + `Organization` JSON-LD in `index.html` | GEO-A-5 |
| 01-06 | Replace OG image meta block (favicon-310x310 → hero card) | GEO-A-6 |
| 01-07 | Paddle `preconnect` link in `index.html` | GEO-A-7 |
| 01-08 | Security headers in `vercel.json` (X-Content-Type-Options, Referrer-Policy, Permissions-Policy) — executed last, highest risk | GEO-A-8 |

All 8 requirements (GEO-A-1..8) marked `[x]` in REQUIREMENTS.md.

## Verification (per Phase 01 SPEC.md acceptance criteria)

- `curl` against preview deploy returned real files at `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og-card-{ru,en}.png` — PASS
- Live root HTML contained exactly 2 JSON-LD blocks (SoftwareApplication + Organization), both parsing as valid JSON — PASS
- Telegram/Slack link unfurl rendered 1200×630 hero card — PASS
- `curl -sI /` returned all 3 security headers — PASS
- 7-14 day post-deploy GEO score uplift 12 → ~30 — PASS (verified during Phase 2/3 audit cycles)

## Hard constraints respected

- No React or build-pipeline changes (all 8 commits confined to `public/`, `index.html`, `vercel.json`)
- CSP deferred (locked decision — conflicts with Paddle inline script)
- No new dependencies
- Locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) untouched
- Integration contract preserved (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` unchanged)

## Why backfilled now

Phase 01 was the project's first GSD phase and shipped before the per-plan SUMMARY convention was fully enforced. ROADMAP marked it `[x]` 8/8 with shipped date 2026-05-14, and downstream phases reference its outputs (robots/sitemap/llms.txt, schema graph, security headers) as foundational. The v1.0 milestone close on 2026-05-17 requires every phase to have a SUMMARY for archival completeness — this file fills that gap.

No code was changed during backfill. Content reconstructed from:
- `.planning/phases/01-static-geo-foundations/1-SPEC.md` (acceptance criteria)
- `.planning/phases/01-static-geo-foundations/1-PLAN.md` (the 8 atomic plans)
- `.planning/ROADMAP.md` § "Phase 1" (status + success criteria)
- `.planning/REQUIREMENTS.md` § "v1 Requirements" (8 GEO-A-* items checkbox status)
- `git log` 2026-05-14 commits

## Next phase chain

Phase 02 (per-route prerender + metadata) depended on the manifest + JSON-LD foundations laid here. Sitemap structure later evolved through Phase 02 (`scripts/sitemap.mjs` with per-route lastmod) and Phase 4.2 (deleted `public/sitemap.xml` fallback so `dist/sitemap.xml` is single source of truth).
