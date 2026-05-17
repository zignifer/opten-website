---
tags:
  - gsd
  - roadmap
kind: roadmap
milestone: "next"
aliases:
  - Roadmap
---

# Roadmap: opten-website

## Shipped milestones

- **v1.0 — GEO Optimization** *(2026-05-14 → 2026-05-17, closed 2026-05-17)* — Static GEO foundations + per-route prerender + bilingual routing + content surface + SEO/GEO polish. 7 phases shipped, 2 closed as deferred-to-v2 (brand authority off-site, scale-ready architecture). GEO Score 12 → ~72.6 (target ~80+ after deploy bakes in). Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) · [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md).

## Active milestone

*(No active milestone — run `/gsd-new-milestone` to start the next one.)*

## v2 candidates (from v1.0 deferred work)

These are **not committed yet** — they're the picking material for the next milestone, preserved verbatim from the v1.0 ROADMAP archive:

1. **Brand authority** *(was v1.0 Phase 5)* — Product Hunt launch, Wikipedia/Wikidata entry, Reddit + Habr + YouTube seeding, expanded `sameAs` schema after authority URLs acquired. Mostly off-site marketing work; small code component (sameAs additions to Organization JSON-LD) when authority URLs are real. See `.planning/milestones/v1.0-ROADMAP.md` § "Phase 5: Brand authority" for the original scope sketch.
2. **Scale-ready content architecture** *(was v1.0 Phase 6)* — refactor route inventory (currently spread across 6 files: `scripts/seo-routes.ts`, `src/main.tsx`, `scripts/entry-server.tsx`, `src/i18n/paths.ts`, `scripts/sitemap.mjs` `PATH_TO_SOURCE`, `scripts/llms.mjs`), schema templating (`LandingPage`, `PricingPage`, `GuideArticle`, `GuideHub`, `ComparisonPage`, `ChangelogPage` archetypes), and build-time gates (duplicate `primaryKeyword`, `wordCount ≥ 300`, citability check). Prerequisite for any programmatic SEO rollout. See `.planning/milestones/v1.0-ROADMAP.md` § "Phase 6: Scale-ready content architecture".
3. **Post-deploy follow-ups from v1.0 Phase 4.2** — Bing token replacement (operational, not code), GEO rescore window 7-14 days after Phase 4.2 deploy, manual UAT of X-Robots-Tag edge materialization. Tracked in `.planning/phases/04.2-seo-geo-polish-post-synthesis/04.2-VERIFICATION.md`.

---

*Roadmap created: 2026-05-14*
*v1.0 closed: 2026-05-17*
*Next milestone: TBD — run `/gsd-new-milestone` when ready.*
