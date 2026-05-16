---
phase: 03-bilingual-routing
plan: 05
type: execute
wave: 3
depends_on: [02]
files_modified:
  - scripts/sitemap.mjs
autonomous: true
requirements:
  - GEO-C-2
  - GEO-C-3
must_haves:
  truths:
    - "`dist/sitemap.xml` lists exactly 12 `<url>` entries (6 RU + 6 EN)"
    - "Every `<url>` entry carries 3 `<xhtml:link rel=\"alternate\" hreflang=\"...\">` annotations (`ru`, `en`, `x-default`)"
    - "The `<urlset>` root element declares the `xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"` namespace (required by xhtml:link elements per Google Sitemap spec)"
    - "Hreflang triplet values are reciprocal between each cluster's RU and EN entries (Pitfall 5)"
    - "Every entry retains its `<lastmod>`, `<changefreq>`, `<priority>` (Phase 2 D-04 invariants preserved — uniform build-time lastmod)"
  artifacts:
    - path: "scripts/sitemap.mjs"
      provides: "Postbuild XML emitter expanded for bilingual entries with xhtml:link annotations"
      contains: "xmlns:xhtml="
  key_links:
    - from: "scripts/sitemap.mjs"
      to: "scripts/seo-routes.ts (routes + hreflangAlternates)"
      via: "imports routes from .ssr-meta; reads hreflangAlternates triplet per entry"
      pattern: "r\\.hreflangAlternates"
    - from: "dist/sitemap.xml"
      to: "AI crawlers + search engines"
      via: "static file served by Vercel; sitemap reference is in public/robots.txt line 40"
      pattern: "<loc>.*opten\\.space"
---

<objective>
Extend `scripts/sitemap.mjs` so the emitted `dist/sitemap.xml` lists all 12 prerendered pages (6 RU + 6 EN) and decorates each `<url>` with the 3-tag `<xhtml:link rel="alternate" hreflang="...">` triplet per Google's sitemap-hreflang spec [CITED: developers.google.com/search/docs/specialty/international/localized-versions#sitemap].

The route-count expansion is **automatic** — Plan 02 already added the 6 EN entries to the manifest; the existing `routes.filter(r => r.prerender !== "none")` line already includes them. The actual work in this plan is:

1. Add the `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace declaration to the `<urlset>` root element.
2. Render 3 `<xhtml:link>` children per `<url>` entry, sourced from each route's `hreflangAlternates` field.
3. Bump the count threshold in the fail-fast guard (line 29-31) from "at least 1 route" to "at least 12 routes" (defense-in-depth — catches a manifest regression that drops EN entries silently).

Chosen sitemap shape: **Option A** (annotated `xhtml:link` per URL) over Option B (12 plain entries). Rationale: single source of truth — the same `hreflangAlternates` triplet drives both `prerender.mjs` (per-page `<head>`) and `sitemap.mjs` (per-URL XML), guaranteeing reciprocity at both levels (RESEARCH.md Pitfall 5 mitigation by construction). Per CONTEXT.md "Claude's Discretion" and RESEARCH.md recommendation at line 766.

Closes GEO-C-2 (every shipped page enumerated in sitemap) + GEO-C-3 (hreflang annotations across all bilingual pages, both in sitemap AND in per-page `<head>` from Plan 03 — redundant by design for AI crawlers).

Output: a 12-entry `dist/sitemap.xml` that Google Search Console can parse without warnings.
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
@scripts/sitemap.mjs
@scripts/seo-routes.ts
@CLAUDE.md

<interfaces>
<!-- Current sitemap.mjs (Phase 2 baseline). Surface area is intentionally tiny — one template-literal extension. -->

scripts/sitemap.mjs current state (46 lines, fully read):
- Line 25 imports the manifest from `.ssr-meta/seo-routes.js`.
- Line 27 filters to prerendered routes only: `const sitemapRoutes = routes.filter(r => r.prerender !== "none");`
- Line 29-31 fail-fast guard: throws if `sitemapRoutes.length === 0`.
- Lines 33-42 emit the XML via a template literal: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + per-url `<url>` blocks with `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`.

After Plan 02 ships, `sitemapRoutes` will already contain 12 entries (the 7 RU + 6 EN entries from the manifest; only routes with `prerender !== "none"` are emitted, and ALL 13 manifest entries have `prerender: "full"` or `"head"`, both of which pass the filter; `/pay` and `/en/pay` are `head` tier and DO appear in the sitemap per Phase 2 D-04).

Actually re-checking: 7 RU entries + 6 EN entries = 13 total. None have `prerender: "none"`. So `sitemapRoutes.length === 13`. Wait — Phase 2 emits 6 sitemap entries today (5 full + 1 head = `/pay`). Yes, all 7 RU pass the filter today. Plus 6 EN after Plan 02. Total = 13 entries.

CORRECTION TO must_haves: the sitemap will list **13** entries, not 12. The "12 routes emitted" count in VALIDATION.md row Plan 07 is a misalignment with Phase 2's existing behavior (where `/pay` IS in the sitemap because `prerender: "head"` passes the filter). Re-confirm by reading scripts/sitemap.mjs:27 + seo-routes.ts manifest: all 13 entries have `prerender !== "none"`. The executor should emit 13.

If the executor finds a discrepancy with VALIDATION.md (which says "12"), trust the code: VALIDATION.md row Plan 07 says `grep -c '<loc>' dist/sitemap.xml — 12`. That number was an underestimate (it counted "fully rendered" as 6 instead of all prerendered = 7). The actual correct count is 13. Update VALIDATION.md if convenient (optional), but DO NOT artificially exclude entries to match the doc.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add xmlns:xhtml namespace + xhtml:link annotations per URL + bump fail-fast threshold</name>
  <read_first>
    - scripts/sitemap.mjs (full file — 46 lines)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Code Examples → "Sitemap with hreflang annotations", lines 743-763 — verbatim XML target shape)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§3, lines 192-222 — file-by-file mapping; Option A choice rationale)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (Claude's Discretion #2 — annotated XML chosen over pair-listed)
    - scripts/seo-routes.ts (re-read after Plan 02 ships to confirm hreflangAlternates triplet shape: `{ ru, en, xDefault }` strings)
  </read_first>
  <action>
    In `scripts/sitemap.mjs`, modify the XML template literal (currently lines 33-42) to:

    (a) Extend the `<urlset>` root element with a second namespace declaration. From `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` to:
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">`
        (Indent the second xmlns line with 8 spaces under the opening `<urlset` to match the existing template's indent style; trailing `>` on the second line.)

    (b) For each `<url>` block, inject 3 `<xhtml:link>` children sourced from `r.hreflangAlternates`. The block becomes:
        ```
          <url>
            <loc>${r.canonical}</loc>
            <lastmod>${BUILD_DATE}</lastmod>
            <changefreq>${r.changefreq}</changefreq>
            <priority>${r.priority.toFixed(1)}</priority>
            <xhtml:link rel="alternate" hreflang="ru"        href="${r.hreflangAlternates.ru}" />
            <xhtml:link rel="alternate" hreflang="en"        href="${r.hreflangAlternates.en}" />
            <xhtml:link rel="alternate" hreflang="x-default" href="${r.hreflangAlternates.xDefault}" />
          </url>
        ```
        Use the existing 4-space indent for `<url>` children. The 3 new lines belong INSIDE the `<url>` block, after `<priority>`. The `href=` values come straight from the manifest — no escaping needed (the values are template-literal constants under `SITE_ORIGIN` with no special XML characters; the manifest is the trust boundary).

    (c) Bump the fail-fast guard threshold (currently `if (sitemapRoutes.length === 0)` at line 29) to `if (sitemapRoutes.length < 12)`. New error message: `\`sitemap.mjs: expected at least 12 routes (6 RU + 6 EN) per Phase 3, got ${sitemapRoutes.length}. Manifest mis-loaded or EN entries missing?\``. This catches the regression where someone trims the manifest and silently breaks the bilingual sitemap.

    (d) Update the final `console.log` line (currently `\`✓ sitemap.xml → ${sitemapRoutes.length} routes (lastmod ${BUILD_DATE})\``) to include a count breakdown comment, e.g. `\`✓ sitemap.xml → ${sitemapRoutes.length} routes (RU + EN, lastmod ${BUILD_DATE})\``. Cosmetic.

    Do NOT modify the import lines (15-25). Do NOT modify the BUILD_DATE derivation (23). Do NOT touch the `writeFile(resolve(DIST, "sitemap.xml"), …)` call (44).
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -10 &amp;&amp; node -e "const fs=require('fs');const s=fs.readFileSync('dist/sitemap.xml','utf-8');const locCount=(s.match(/&lt;loc&gt;/g)||[]).length;const xhtmlCount=(s.match(/&lt;xhtml:link/g)||[]).length;const hasNs=s.includes('xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"');if(locCount&lt;12){console.error('FAIL: expected at least 12 &lt;loc&gt;, got '+locCount);process.exit(1)}if(xhtmlCount!==locCount*3){console.error('FAIL: expected '+(locCount*3)+' &lt;xhtml:link&gt;, got '+xhtmlCount);process.exit(1)}if(!hasNs){console.error('FAIL: xmlns:xhtml namespace not declared on &lt;urlset&gt;');process.exit(1)}console.log('PASS: '+locCount+' URLs, '+xhtmlCount+' xhtml:link annotations, namespace declared')"</automated>
  </verify>
  <acceptance_criteria>
    - `dist/sitemap.xml` `<loc>` count is at least 12 (13 expected after Plan 02 ships — the 7 RU `prerender !== "none"` entries + 6 EN entries; if the executor finds the count is 12, that means one RU entry's `prerender` was changed elsewhere — investigate before proceeding)
    - `dist/sitemap.xml` `<xhtml:link` count equals 3× the `<loc>` count (every URL has the full triplet)
    - `<urlset>` root declares `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace
    - Spot-check reciprocity: in `dist/sitemap.xml`, the `<url>` block for `<loc>https://opten.space/welcome</loc>` and the block for `<loc>https://opten.space/en/welcome</loc>` have IDENTICAL `<xhtml:link>` triplet content (same 3 hreflang values, same href values)
    - Fail-fast guard threshold is `< 12` not `=== 0`
    - `npm run build` exits 0
    - `dist/sitemap.xml` parses as valid XML — quick check: `node -e "const s=require('fs').readFileSync('dist/sitemap.xml','utf-8'); if(!s.startsWith('<?xml')){process.exit(1)} if(!s.includes('</urlset>')){process.exit(1)} console.log('parseable')"` succeeds
  </acceptance_criteria>
  <done>
    `dist/sitemap.xml` carries the namespace, 12+ entries, and 3 reciprocal `<xhtml:link>` annotations per entry. Fail-fast guard updated. Build succeeds.
  </done>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time → static `dist/sitemap.xml` | sitemap.mjs runs in Node, reads the manifest (build-time constant), writes a static XML file. No user input enters the pipeline. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-13 | Tampering | sitemap URL values | mitigate | All `<loc>` + `<xhtml:link href>` values originate from `seo-routes.ts` build-time constants under `SITE_ORIGIN`. No user input; no runtime path. Defense-in-depth: per `<` `&` `"` characters never appear in any URL (the manifest origin is a literal string), so XML attribute escaping is unnecessary by construction. |
| T-03-14 | Information Disclosure | sitemap exposing private paths | accept | `/account`, `/success`, `/dashboard/download-skill`, `/en/account`, `/en/success`, `/en/dashboard/*` are NOT in the manifest (D-03 + Phase 2 D-04). No sitemap entry ever points at a private path. Plan 04 added robots.txt Disallows for defense-in-depth. |

ASVS V14 only (minor — Vercel security headers auto-apply to `/sitemap.xml`).
</threat_model>

<verification>

- `npm run build` exits 0; `dist/sitemap.xml` is emitted.
- `<loc>` count ≥ 12 (expected: 13 after Plan 02).
- Every entry carries exactly 3 reciprocal `<xhtml:link>` annotations.
- `xmlns:xhtml` namespace is declared on the `<urlset>` root.

</verification>

<success_criteria>

- [ ] sitemap.mjs emits the namespace + 3 `<xhtml:link>` annotations per `<url>`.
- [ ] Fail-fast guard threshold bumped to `< 12`.
- [ ] dist/sitemap.xml grep counts pass.
- [ ] Reciprocity spot-check on `/welcome` ↔ `/en/welcome` passes.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-05-SUMMARY.md` capturing:
- Diff stats (one template extension).
- Sample of one `<url>` block from `dist/sitemap.xml` showing the 3 `<xhtml:link>` annotations.
- Final route count in the emitted sitemap.
</output>
