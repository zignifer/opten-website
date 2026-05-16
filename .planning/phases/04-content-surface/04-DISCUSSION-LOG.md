# Phase 4: Content surface — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 04-content-surface
**Areas discussed:** /about content, /guides structure, FAQ + JSON-LD bundle, sidecar fixes

---

## /about content

### Q1 — Who is the "brand face"?

| Option | Description | Selected |
|--------|-------------|----------|
| Founder solo | Single-author voice (Voronezhtsev); Person schema + Organization founder | ✓ |
| Dual operator (RU + GE) | Disclose both legal operators like in privacy policy; stronger trust, harder to read | |
| Brand without persona | No founder bio; partners + legal info; weaker E-E-A-T | |

**User's choice:** Founder solo.
**Notes:** Aligns with the single-author tone established in the privacy policy (which user has called the "citability champion" elsewhere in the GEO audit).

### Q2 — Size & bilingual approach

| Option | Description | Selected |
|--------|-------------|----------|
| Short (~300–500w), EN = direct translation | Fast, lighter E-E-A-T | |
| Medium (~600–900w), EN = localized | Balanced | |
| Long (~1000+w), EN deferred to v2 | Maximum E-E-A-T; English in Phase 4.1 | ✓ |

**User's choice:** Long, EN deferred.
**Notes:** Creates an asymmetry with the bilingual guides choice below. Captured as D-16 with planner discretion to suppress or stub the EN navbar entry.

---

## /guides structure

### Q1 — How many guides in the first release?

| Option | Description | Selected |
|--------|-------------|----------|
| 1 anchor guide | Fast start; minimal GEO-D-2 closure; Phase 4.1 adds 3–5 | ✓ |
| 3 guides (cluster of 3) | One per model family (Midjourney / Flux / SD); thematic cluster | |
| 5+ guides (full cluster) | Includes DALL-E + general principles; strongest signal, longest to write | |

**User's choice:** 1 anchor guide.

### Q2 — Guide shape

| Option | Description | Selected |
|--------|-------------|----------|
| HowTo (5–7 steps, 600–1000w) | Compact; AI Overviews extraction friendly | |
| Long article (1500–2500w, sections) | Topical authority lift; longer write; AI-detection risk | |
| Hybrid HowTo + before/after blocks | HowTo with "bad prompt / good prompt" pairs; 1000–1500w; balanced | ✓ |

**User's choice:** Hybrid HowTo + before/after.
**Notes:** Format ties directly to the "30–50% credit savings" claim from landing — guide turns marketing line into citable demonstration.

### Q3 — Guide bilingualism

| Option | Description | Selected |
|--------|-------------|----------|
| RU first, EN in Phase 4.1 | Consistent with /about decision | |
| RU + EN in Phase 4 | Both siblings ship; preserves Phase 3 bilingual contract for marketing routes | ✓ |

**User's choice:** RU + EN in Phase 4.
**Notes:** Creates the /about (RU only) vs /guides (RU+EN) asymmetry mentioned above. Phase planner resolves UX impact.

---

## FAQ + JSON-LD bundle

### Q1 — FAQ shape

| Option | Description | Selected |
|--------|-------------|----------|
| 5–6 Q/A on landing only | Compact, single mount point | |
| 8–12 Q/A on dedicated /faq page | Bigger surface, extra page to maintain | |
| 5–6 on landing + same/similar in guide | Dual coverage, no extra page | ✓ |

**User's choice:** 5–6 on landing + in guide.
**Notes:** Questions to be sourced from real Telegram chat / Chrome Web Store reviews (D-08).

### Q2 — JSON-LD bundle scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full: Organization + SoftwareApplication + WebSite + Product + FAQPage + HowTo + BreadcrumbList + Person | Maximum GEO leap (Schema 8 → ~75) | ✓ |
| Core: Organization + SoftwareApplication + WebSite + FAQPage + HowTo (no Product/Breadcrumb) | Defers Product schema until /pay prerender lands separately | |
| Minimum: FAQPage only (strict GEO-D-3) | Letter-of-the-law; rest deferred | |

**User's choice:** Full pack (8 schema types).
**Notes:** Triggers the /pay prerender requirement (Product schema needs visible body content per Google policy — D-12).

---

## Sidecar fixes from GEO audit

### Q1 — Initial question (rephrased after user requested clarification)

User initially answered "не понял что требуется давай подробнее" — agent re-presented each sidecar option in plain Russian, explaining what each fix is and what it does for GEO/perf, then re-asked.

### Q1 (second pass) — Which sidecar fixes to bundle into Phase 4?

| Option | Description | Selected |
|--------|-------------|----------|
| `/llms.txt` + `/llms-full.txt` | "Table of contents for AI bots"; ~30 lines, generated at build | ✓ |
| `/pay` + `/en/pay` full prerender | Bake pricing facts into HTML; needed for legal Product schema | ✓ |
| Hero fetchpriority + preload | LCP 3.3 s → ~2.5 s on mobile; 1–2 lines | ✓ |
| X-Frame-Options + Content-Signal | Security header + IETF AI consent; CSP excluded (out of scope per PROJECT.md) | ✓ |

**User's choice:** All four.

### Q2 — Phase shape

| Option | Description | Selected |
|--------|-------------|----------|
| Single Phase 4 (all of the above) | One large phase, single GEO leap at release | ✓ |
| Phase 4.0 + Phase 4.1 split (code vs content) | Smaller increments; GEO leap in two steps | |

**User's choice:** Single Phase 4.

---

## Claude's Discretion

- Anchor guide topic — default "How to write prompts for Midjourney v7"; planner samples Telegram + Chrome Web Store for highest-demand topic and adjusts if needed.
- FAQ question selection — planner mines Telegram chat + Chrome Web Store reviews; fallback to top-of-funnel set if pool thin.
- `/llms-full.txt` size cap — truncate to most-important sections if >50 KB.
- Page hierarchy — default flat `/guides/<slug>`; categorization deferred.
- About-link visibility on EN pages — hide entirely vs "Coming soon in EN" stub; planner picks per UX feel.

## Deferred Ideas

- `/en/about` — Phase 4.1
- Additional guides beyond the anchor (Flux, SD, DALL-E, general principles) — Phase 4.1 / 4.2
- CSP header — separate ticket; milestone out-of-scope
- Wikipedia / Wikidata / Reddit / YouTube / Product Hunt — Phase 5 (brand authority)
- Customer testimonials / Chrome Web Store rating embed — Phase 5
- `speakable` schema property — defer; rare lever
- Landing copy rewrite — out of scope
- `/about` EN stub — explicitly rejected (thin EN damages SEO)
- Categorized guide hierarchy — defer until volume justifies
- Standalone `/faq` page — rejected in favor of embedded FAQ blocks
