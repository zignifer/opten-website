---
phase: 03-bilingual-routing
plan: 05
subsystem: infra
tags: [sitemap, hreflang, seo, xml, bilingual]

requires:
  - phase: 03-bilingual-routing/03-02
    provides: "EN route entries added to seo-routes.ts manifest with hreflangAlternates triplets"

provides:
  - "dist/sitemap.xml with xmlns:xhtml namespace + 3 xhtml:link annotations per URL (36 total)"
  - "Fail-fast guard in sitemap.mjs bumped to < 12 (Phase 3 regression guard)"

affects: [03-06, 03-07, 03-08, seo-verification, google-search-console]

tech-stack:
  added: []
  patterns:
    - "xhtml:link hreflang triplet (ru/en/x-default) per <url> in sitemap sourced directly from hreflangAlternates manifest field"
    - "Single source of truth: same hreflangAlternates triplet drives both prerender.mjs <head> and sitemap.mjs XML"

key-files:
  created: []
  modified:
    - scripts/sitemap.mjs

key-decisions:
  - "Option A (annotated xhtml:link per URL) chosen over Option B (plain 12-entry list) — reciprocity guaranteed by construction from manifest field"
  - "Fail-fast guard threshold: length < 12 (not === 0) to catch EN entries disappearing from manifest"
  - "xDefault always = RU sibling URL (D-02 root canonical per CONTEXT.md)"

patterns-established:
  - "hreflangAlternates.{ru,en,xDefault} is the canonical triplet — used in both sitemap XML and prerender head tags"

requirements-completed:
  - GEO-C-2
  - GEO-C-3

duration: 5min
completed: 2026-05-16
---

# Phase 03 Plan 05: Sitemap xhtml:link Annotations Summary

**xmlns:xhtml namespace + reciprocal hreflang triplets (ru/en/x-default) added to all 12 sitemap URL entries via sitemap.mjs template extension**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-16T17:18:45Z
- **Completed:** 2026-05-16T17:23:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Extended `<urlset>` root with `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace (required by Google Sitemap spec for xhtml:link elements)
- Added 3 `<xhtml:link rel="alternate">` annotations per `<url>` block: `hreflang="ru"`, `hreflang="en"`, `hreflang="x-default"` — sourced from `r.hreflangAlternates` manifest field
- Bumped fail-fast guard from `length === 0` to `length < 12` with descriptive error message
- Updated console.log to include "RU + EN" annotation
- Build: `npm run build` exits 0; `dist/sitemap.xml` emits 12 URLs × 3 = 36 `<xhtml:link>` annotations

## Task Commits

1. **Task 1: xmlns:xhtml namespace + xhtml:link annotations + fail-fast guard** - `03bb3a5` (feat)

## Files Created/Modified

- `scripts/sitemap.mjs` — extended XML template literal: xmlns:xhtml namespace on `<urlset>`, 3 `<xhtml:link>` children per `<url>`, fail-fast threshold `< 12`, updated console.log

## Sample Output (`dist/sitemap.xml` — first `<url>` block)

```xml
<url>
    <loc>https://opten.space/</loc>
    <lastmod>2026-05-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru"        href="https://opten.space/" />
    <xhtml:link rel="alternate" hreflang="en"        href="https://opten.space/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://opten.space/" />
  </url>
```

## Final Route Count

- 12 `<url>` entries (6 RU + 6 EN), all with `prerender !== "none"`
- 36 `<xhtml:link>` annotations total (12 × 3)
- 12 `hreflang="x-default"` entries (one per URL)
- Reciprocity verified: `/welcome` and `/en/welcome` carry identical triplet content

## Decisions Made

- Option A (annotated xhtml:link per URL) over Option B (plain entries): ensures reciprocity by construction — same `hreflangAlternates` field drives both sitemap XML and prerender `<head>` tags (RESEARCH.md Pitfall 5 mitigation)
- Guard threshold `< 12`: catches silent manifest regression where EN entries disappear

## Deviations from Plan

None — plan executed exactly as written.

Note: Plan interface description mentioned "13 entries" as possible count (7 RU + 6 EN = 13), but the actual build produced 12 entries. This is because the manifest has exactly 6 RU entries + 6 EN entries = 12 total. The plan's `<interfaces>` note about "/pay being prerender: head still counting" was accurate but the RU entry count is 6 (not 7 — there is no 7th RU route with `prerender !== "none"` in the current manifest). The success criteria `grep -c '<xhtml:link' dist/sitemap.xml` returning 36 is satisfied.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `dist/sitemap.xml` is Google Search Console ready with full hreflang annotations
- Closes GEO-C-2 (all bilingual pages enumerated) and GEO-C-3 (hreflang in sitemap + prerender head)
- Ready for Plan 06 (remaining Phase 3 tasks)

## Threat Surface Scan

No new network endpoints, auth paths, or trust boundary changes introduced. sitemap.mjs is a build-time static emitter with no user input — threat model T-03-13/T-03-14 from plan frontmatter remain valid and unmodified.

## Self-Check: PASSED

- `scripts/sitemap.mjs` modified: confirmed
- Commit `03bb3a5` exists: confirmed
- `dist/sitemap.xml` `<loc>` count: 12
- `dist/sitemap.xml` `<xhtml:link>` count: 36 (12 × 3)
- `xmlns:xhtml` declared: true
- `x-default` count: 12
- Reciprocity /welcome <-> /en/welcome: PASS
- Build exits 0: PASS

---
*Phase: 03-bilingual-routing*
*Completed: 2026-05-16*
