---
phase: 03-bilingual-routing
plan: "02"
subsystem: seo-manifest
tags:
  - bilingual
  - hreflang
  - seo-routes
  - phase-3
dependency_graph:
  requires:
    - 03-01 (hydration mismatch fix)
  provides:
    - per-route htmlLang field
    - reciprocal hreflang triplets
    - 6 EN sibling RouteMeta entries
    - DEFAULT_OG_IMAGE_EN constant
  affects:
    - scripts/prerender.mjs (consumes routes for html emit)
    - scripts/sitemap.mjs (consumes routes for sitemap)
    - src/main.tsx (Plan 07 — EN route declarations)
    - scripts/entry-server.tsx (Plan 03 — EN route rendering)
tech_stack:
  added: []
  patterns:
    - reciprocal hreflang triplets per cluster pair (RESEARCH.md Pitfall 5)
    - D-04 EN-meta directly in seo-routes.ts (not pulled from en.json)
key_files:
  modified:
    - scripts/seo-routes.ts
decisions:
  - "D-04: EN-meta lives in seo-routes.ts, not en.json — deferred pipeline"
  - "D-02: xDefault always equals RU sibling URL — root canonical is unprefixed"
  - "Actual RU entry count was 6, not 7 as stated in plan — 12 total routes (6 RU + 6 EN)"
metrics:
  duration: "8 min"
  completed: "2026-05-16"
  tasks_completed: 2
  files_modified: 1
---

# Phase 03 Plan 02: Extend seo-routes manifest with bilingual metadata Summary

RouteMeta interface extended with `htmlLang` + `hreflangAlternates` fields; 6 existing RU entries stamped; 6 EN sibling entries added with English copy and `og-card-en.png` — manifest is now the single source of truth for bilingual SEO for Plans 03, 05, 07.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1+2 | Extend RouteMeta + stamp RU entries + add 6 EN siblings | 972bc8e | scripts/seo-routes.ts |

## Final RouteMeta Schema

```typescript
export interface RouteMeta {
  path: string;
  htmlLang: "ru" | "en";               // Phase 3 D-04
  hreflangAlternates: {                 // Phase 3 D-02 reciprocal triplet
    ru: string;
    en: string;
    xDefault: string;
  };
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  prerender: "full" | "head" | "none";
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
}
```

## EN Entries Added (6 total)

| Path | Title | prerender |
|------|-------|-----------|
| `/en/` | Opten — AI prompt scoring and improvement for image generation | full |
| `/en/pay` | Opten pricing — Pro subscription for prompt improvement | head |
| `/en/welcome` | Welcome to Opten — get started with the extension | full |
| `/en/privacy` | Privacy Policy — Opten | full |
| `/en/terms` | Terms of Service — Opten | full |
| `/en/refund` | Refund Policy — Opten | full |

All EN entries:
- `htmlLang: "en"`
- `ogImage: DEFAULT_OG_IMAGE_EN` → `https://opten.space/og-card-en.png`
- Hreflang triplet identical to their RU cluster sibling (reciprocal — RESEARCH.md Pitfall 5)
- `xDefault` points to the RU (unprefixed) sibling per D-02

## Hreflang Cluster Pairs

| RU path | EN path | xDefault |
|---------|---------|----------|
| `/` | `/en/` | `/` |
| `/pay` | `/en/pay` | `/pay` |
| `/welcome` | `/en/welcome` | `/welcome` |
| `/privacy` | `/en/privacy` | `/privacy` |
| `/terms` | `/en/terms` | `/terms` |
| `/refund` | `/en/refund` | `/refund` |

## Deviations from Plan

### Corrected Count

**1. [Rule 1 - Bug] Plan stated 7 RU entries → actual count was 6**
- **Found during:** Task 1 verification
- **Issue:** The plan repeatedly stated "7 RU + 6 EN = 13 total", but `scripts/seo-routes.ts` contained exactly 6 RU entries (/, /pay, /welcome, /privacy, /terms, /refund). No 7th RU route existed in the file.
- **Fix:** Implemented 6 RU + 6 EN = 12 total entries. The 6 cluster pairs in the plan's own interface spec (`/`↔`/en/`, etc.) confirm 6 is correct.
- **Verified:** `node -e "import('./.ssr-meta/seo-routes.js').then(m => console.log(m.routes.length))"` prints `12`. Build emits `12 routes`.
- **Files modified:** scripts/seo-routes.ts
- **Commit:** 972bc8e

### Atomic commit strategy

Tasks 1 and 2 were written to the file in one pass (full file rewrite) and committed as a single commit. The plan suggested splitting into two commits for diff readability, but since the entire file was rewritten atomically both tasks are covered by commit `972bc8e`.

## Acceptance Verification

- `grep -c 'htmlLang:' scripts/seo-routes.ts` = 13 (1 in interface + 6 RU + 6 EN entries) ✓
- `grep -c 'htmlLang: "ru"' scripts/seo-routes.ts` = 6 (matches actual RU entry count) ✓
- `grep -c 'htmlLang: "en"' scripts/seo-routes.ts` = 6 ✓
- `grep -c 'DEFAULT_OG_IMAGE_EN' scripts/seo-routes.ts` = 2 (export + usage in EN entries) ✓
- `grep -c 'hreflangAlternates' scripts/seo-routes.ts` = 13 (1 interface + 12 entries) ✓
- `grep -c 'path: "/en/' scripts/seo-routes.ts` = 6 ✓
- `npm run build` exits 0 ✓
- `.ssr-meta/seo-routes.js` exports 12 routes ✓
- Reciprocity check: `/welcome` and `/en/welcome` share identical hreflangAlternates triplet ✓

## Known Stubs

None — all 12 entries contain real English/Russian copy sourced from en.json and ru.json respectively.

## Self-Check: PASSED

- `scripts/seo-routes.ts` — exists and modified ✓
- commit `972bc8e` — exists ✓
- `.ssr-meta/seo-routes.js` — emitted with 12 routes ✓
