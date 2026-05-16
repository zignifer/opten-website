---
phase: 03-bilingual-routing
plan: 02
type: execute
wave: 2
depends_on: [01]
files_modified:
  - scripts/seo-routes.ts
autonomous: true
requirements:
  - GEO-C-1
  - GEO-C-4
must_haves:
  truths:
    - "`scripts/seo-routes.ts` exports exactly 13 RouteMeta entries (7 RU + 6 EN)"
    - "Every RouteMeta entry carries a non-empty `htmlLang` field (`\"ru\"` or `\"en\"`)"
    - "Every RouteMeta entry carries a `hreflangAlternates` triplet with `ru`, `en`, and `xDefault` keys, all absolute URLs"
    - "Every cluster's `hreflangAlternates` triplet is reciprocal (`/welcome` and `/en/welcome` share identical triplet values)"
    - "EN entries reference `${SITE_ORIGIN}/og-card-en.png` as `ogImage`; RU entries fall through to `DEFAULT_OG_IMAGE` (RU card)"
  artifacts:
    - path: "scripts/seo-routes.ts"
      provides: "Per-route manifest extended with bilingual metadata"
      exports: ["RouteMeta", "routes", "SITE_ORIGIN", "DEFAULT_OG_IMAGE", "DEFAULT_OG_IMAGE_EN"]
      contains: "htmlLang: \"en\""
  key_links:
    - from: "scripts/seo-routes.ts"
      to: "scripts/prerender.mjs"
      via: "iterated by Phase 2 prerender loop; new entries flow through with zero loop changes (mkdir recursive already handles dist/en/{route}/)"
      pattern: "for \\(const meta of routes\\)"
    - from: "scripts/seo-routes.ts"
      to: "scripts/sitemap.mjs"
      via: "iterated by sitemap emitter; 12 entries (6 RU + 6 EN, all with prerender !== \"none\") drive the urlset"
      pattern: "routes.filter\\(r => r.prerender !== \"none\"\\)"
---

<objective>
Extend the per-route manifest in `scripts/seo-routes.ts` with two new fields (`htmlLang`, `hreflangAlternates`) and 6 EN sibling entries, stamping the existing 7 RU entries with `htmlLang: "ru"` and reciprocal hreflang triplets.

This plan is the **manifest foundation** for the rest of Phase 3 — every downstream plan (03, 05, 07) iterates `routes` from this manifest. After this plan ships:
- `prerender.mjs` (Plan 03) will iterate the 13 entries and emit 12 HTML files (6 RU + 6 EN; `/pay` and `/en/pay` are `prerender: "head"` so they still emit a file).
- `sitemap.mjs` (Plan 05) will emit 12 `<url>` entries with hreflang annotations.
- `entry-server.tsx` + `main.tsx` (Plan 07) will mirror the EN paths in their `<Route>` tables.

Closes GEO-C-1 (path-prefix `/en/*` strategy materialized in code) and GEO-C-4 source-of-truth (the `htmlLang` field drives `<html lang>` baking in Plan 03).

Purpose: single source of truth for per-route bilingual metadata. Avoid scattering EN copy across multiple files (avoids the dedupe drift Pitfall 5 calls out).

Output: a `scripts/seo-routes.ts` with 13 entries, full TypeScript-checked at `vite build --ssr` time.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-bilingual-routing/03-CONTEXT.md
@.planning/phases/03-bilingual-routing/03-RESEARCH.md
@.planning/phases/03-bilingual-routing/03-PATTERNS.md
@.planning/phases/03-bilingual-routing/03-VALIDATION.md
@scripts/seo-routes.ts
@src/i18n/en.json
@CLAUDE.md

<interfaces>
<!-- Surface area of scripts/seo-routes.ts after this plan. Plans 03, 05, 07 consume these. -->

From scripts/seo-routes.ts (Phase 3 target signatures):
- export interface RouteMeta {
    path: string;
    htmlLang: "ru" | "en";                                          // NEW (D-04)
    hreflangAlternates: { ru: string; en: string; xDefault: string }; // NEW
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
- export const SITE_ORIGIN: string;
- export const DEFAULT_OG_IMAGE: string;
- export const DEFAULT_OG_IMAGE_EN: string;                          // NEW (D-04 EN card)
- export const routes: RouteMeta[];                                  // 13 entries (7 RU + 6 EN)

Cluster pairing for hreflangAlternates (reciprocal — RESEARCH.md Pitfall 5):
  "/"        ↔ "/en/"
  "/pay"     ↔ "/en/pay"
  "/welcome" ↔ "/en/welcome"
  "/privacy" ↔ "/en/privacy"
  "/terms"   ↔ "/en/terms"
  "/refund"  ↔ "/en/refund"

For every cluster: both entries share the same triplet:
  ru:        `${SITE_ORIGIN}${RU_PATH}`           (e.g. `${SITE_ORIGIN}/`        or `${SITE_ORIGIN}/welcome`)
  en:        `${SITE_ORIGIN}${EN_PATH}`           (e.g. `${SITE_ORIGIN}/en/`     or `${SITE_ORIGIN}/en/welcome`)
  xDefault:  same as `ru` (D-02 — root canonical lives at unprefixed path)
</interfaces>

<en_copy_source>
<!-- EN title/description/ogTitle/ogDescription strings — duplicate from src/i18n/en.json per same SYNC policy as line 2 comment "duplicated from src/i18n/ru.json". -->
<!-- These strings live as build-time constants in seo-routes.ts; do NOT introduce a runtime dependency on en.json from the manifest (the manifest is consumed by the postbuild Node script, en.json is the runtime i18n dict). -->
<!-- D-04 explicitly defers the en.json → manifest pipeline; for Phase 3, duplicate-with-sync-comment is the chosen policy. -->

Required strings per EN entry (the executor extracts from src/i18n/en.json; mirror the SAME keys as the RU sibling uses):
- `/en/`:        `meta.title.home`, `meta.description.home`, `meta.ogTitle.home`, `meta.ogDescription.home` (or, if those keys do not exist in en.json, use the English equivalents of the strings in the RU `/` entry — see RESEARCH.md Pattern 1 example at lines 290-295 for the recommended English copy)
- `/en/pay`:     EN equivalents of the `/pay` entry's title/description/og*
- `/en/welcome`: EN equivalents of the `/welcome` entry's title/description/og*
- `/en/privacy`: EN equivalents of the `/privacy` entry's title/description/og* (legal-page boilerplate)
- `/en/terms`:   EN equivalents of the `/terms` entry's title/description/og*
- `/en/refund`:  EN equivalents of the `/refund` entry's title/description/og*

If en.json does not yet contain SEO-meta-specific keys, fall back to (a) reusing the relevant runtime EN strings (hero headline, page H1, etc.) that DO exist in en.json, OR (b) writing direct English equivalents in `seo-routes.ts` and adding the same "SYNC:" comment that line 2 already carries for the RU manifest. Either approach is acceptable per D-04 ("EN-meta lives directly in `scripts/seo-routes.ts`").
</en_copy_source>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extend RouteMeta interface + stamp 7 RU entries + add DEFAULT_OG_IMAGE_EN</name>
  <read_first>
    - scripts/seo-routes.ts (full file — 87 lines; current `RouteMeta` interface at lines 4-15, constants at lines 17-18, 7 entries at lines 20-87)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 1, lines 246-302 — verbatim RouteMeta target schema)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§1, lines 40-101 — file-by-file mapping with the exact additions)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-02 + D-04 — root canonical = unprefixed; xDefault always points at RU sibling; EN ogImage = og-card-en.png)
    - public/og-card-en.png (no read needed — verify exists via `ls public/og-card-en.png` first; shipped by Phase 1 GEO-A-4)
  </read_first>
  <action>
    Open `scripts/seo-routes.ts`. Make four edits in sequence:

    (a) **Extend the `RouteMeta` interface** (currently lines 4-15) by inserting two new required fields IMMEDIATELY after the `path` field and BEFORE `title`: `htmlLang: "ru" | "en"` (D-04) and `hreflangAlternates: { ru: string; en: string; xDefault: string }`. Add a short trailing comment on each new field (D-04 reference, RESEARCH Pattern 1 reference). Do NOT reorder existing fields. The full target interface shape is shown verbatim in PATTERNS.md §1 lines 47-70 — match it exactly.

    (b) **Add the new constant** `export const DEFAULT_OG_IMAGE_EN = \`${SITE_ORIGIN}/og-card-en.png\`;` immediately below the existing `DEFAULT_OG_IMAGE` line (currently line 18). One-line trailing comment "Phase 3 D-04 — EN OG card (already in public/ from Phase 1 GEO-A-4)". Keep `SITE_ORIGIN` and `DEFAULT_OG_IMAGE` byte-stable.

    (c) **Stamp each of the 7 existing RU entries** (lines 21-86) with the two new fields. For each entry, insert immediately after the `path:` line: `htmlLang: "ru",` and a `hreflangAlternates: { ru: \`${SITE_ORIGIN}${RU_PATH}\`, en: \`${SITE_ORIGIN}${EN_PATH}\`, xDefault: \`${SITE_ORIGIN}${RU_PATH}\` },` where `RU_PATH` is the entry's existing `path` value (e.g. `/welcome`) and `EN_PATH` is the `/en/`-prefixed sibling (e.g. `/en/welcome`). Per D-02 `xDefault` always equals the RU URL (the root canonical). For the `/` entry: `ru: \`${SITE_ORIGIN}/\``, `en: \`${SITE_ORIGIN}/en/\``, `xDefault: \`${SITE_ORIGIN}/\``. No other fields change. Pricing-string comments at line 2 stay; the SYNC policy unchanged.

    (d) **Add a header comment** above the routes array (around line 19) listing the cluster pairs so the next reader sees the reciprocal mapping at a glance:
        // Phase 3 D-01/D-02: cluster pairs (reciprocal hreflang per RESEARCH.md Pitfall 5):
        //   "/"        ↔ "/en/"          "/pay"     ↔ "/en/pay"
        //   "/welcome" ↔ "/en/welcome"   "/privacy" ↔ "/en/privacy"
        //   "/terms"   ↔ "/en/terms"     "/refund"  ↔ "/en/refund"
        // xDefault always = RU sibling (D-02 root canonical).

    Do NOT add the 6 EN entries in this task — Task 2 does that. Splitting the edit keeps the diff readable: this task = "extend schema + stamp existing rows"; Task 2 = "add 6 new rows".
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/seo-routes.ts','utf-8'); const htmlLangCount=(s.match(/htmlLang:\s*\"ru\"/g)||[]).length; const enConst=s.includes('DEFAULT_OG_IMAGE_EN'); const triplets=(s.match(/hreflangAlternates:\s*\{/g)||[]).length; if(htmlLangCount!==7){console.error('FAIL: expected 7 htmlLang:\"ru\", got '+htmlLangCount);process.exit(1)} if(!enConst){console.error('FAIL: DEFAULT_OG_IMAGE_EN not exported');process.exit(1)} if(triplets!==7){console.error('FAIL: expected 7 hreflangAlternates triplets, got '+triplets);process.exit(1)} console.log('PASS: schema extended, 7 RU rows stamped')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "htmlLang:" scripts/seo-routes.ts` returns at least `8` (1 in the interface declaration + 7 in entries; Task 2 will push this to `14`)
    - `grep -c "htmlLang: \"ru\"" scripts/seo-routes.ts` returns exactly `7`
    - `grep -c "DEFAULT_OG_IMAGE_EN" scripts/seo-routes.ts` returns at least `1` (the export line; consumers add later)
    - `grep -c "hreflangAlternates" scripts/seo-routes.ts` returns at least `8` (1 in the interface declaration + 7 in entries)
    - File still parses: `node -e "require('child_process').execSync('npx tsc --noEmit --module esnext --target es2022 --moduleResolution bundler scripts/seo-routes.ts', {stdio:'inherit'})"` exits 0 (or, simpler, the full `npm run build` in Task 2 acceptance succeeds — the SSR build catches the TS errors)
  </acceptance_criteria>
  <done>
    RouteMeta interface has 2 new required fields. 7 RU entries each carry `htmlLang: "ru"` and a reciprocal `hreflangAlternates` triplet. `DEFAULT_OG_IMAGE_EN` is exported. Header comment documenting cluster pairs is in place. No EN entries yet — Task 2 adds those.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add 6 EN entries (`/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`)</name>
  <read_first>
    - scripts/seo-routes.ts (re-read after Task 1 — confirm the 7 RU entries each have the new fields; this task appends 6 more to the same array)
    - src/i18n/en.json (full file — 203 keys; check whether SEO-specific keys like `meta.title.home` exist, or whether the executor needs to write direct English equivalents for SEO meta; both options are valid per D-04)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 1, lines 274-301 — verbatim shape of the EN `/` entry; this is the template for all 6 new rows)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§1, lines 82-100 — entry-shape template)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-04 — EN ogImage = `${SITE_ORIGIN}/og-card-en.png`; D-03 — `/en/pay` is included; D-07 (no trailing slash convention) — `/en/welcome` not `/en/welcome/`, but `/en/` mirrors `/` with the slash)
  </read_first>
  <action>
    Append 6 new RouteMeta entries to the `routes` array in `scripts/seo-routes.ts`. Place them at the END of the array (after the existing `/refund` entry, line 86). Group order: `/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund` (mirrors the RU group's `/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund` order — easier to diff against RU siblings).

    For each EN entry, copy the shape of the RU sibling exactly, then change these fields:
    - `path:` — `/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund` (trailing slash ONLY on `/en/` per D-07 mirroring `/`)
    - `htmlLang: "en"`
    - `hreflangAlternates: { ru: <same as RU sibling's `ru`>, en: <same as RU sibling's `en`>, xDefault: <same as RU sibling's `xDefault`> }` — IDENTICAL TRIPLET to the RU sibling (reciprocal — Pitfall 5)
    - `title:` — English equivalent of the RU title (see RESEARCH.md Pattern 1 lines 290-295 for the recommended `/en/` copy; reuse style for other entries)
    - `description:` — English equivalent of the RU description
    - `canonical:` — `${SITE_ORIGIN}${path}` (e.g. `${SITE_ORIGIN}/en/welcome`)
    - `ogTitle:` — English equivalent
    - `ogDescription:` — English equivalent
    - `ogImage: \`${SITE_ORIGIN}/og-card-en.png\`` (or reference `DEFAULT_OG_IMAGE_EN` — same value)
    - `prerender:` — same tier as RU sibling (`/`→full, `/pay`→head, `/welcome`→full, `/privacy`→full, `/terms`→full, `/refund`→full)
    - `changefreq:`, `priority:` — match RU sibling

    EN copy source: prefer SEO-specific keys from `src/i18n/en.json` if they exist (`meta.title.home`, etc.); otherwise write direct English equivalents in `seo-routes.ts` per the existing SYNC policy (line 2 comment). RESEARCH.md Pattern 1 lines 290-295 provides verified English copy for `/en/`; mirror that style for the other 5 entries (e.g. `/en/welcome`: "Welcome to Opten — get started with the extension"; `/en/pay`: "Opten pricing — Pro subscription for prompt improvement"; legal pages: "Privacy policy — Opten" / "Terms of use — Opten" / "Refund policy — Opten").

    Above the first EN entry, insert a section comment: `// Phase 3 D-04: EN siblings (6 entries). EN ogImage = DEFAULT_OG_IMAGE_EN. SYNC: title/description duplicated from src/i18n/en.json — see line 2 SYNC policy.`
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -30 &amp;&amp; node -e "const s=require('fs').readFileSync('scripts/seo-routes.ts','utf-8'); const enEntries=(s.match(/path:\s*\"\/en\//g)||[]).length; const enRoot=s.includes('path: \"/en/\"'); const enHtml=(s.match(/htmlLang:\s*\"en\"/g)||[]).length; if(enEntries!==6){console.error('FAIL: expected 6 /en/* path entries, got '+enEntries);process.exit(1)} if(!enRoot){console.error('FAIL: /en/ root entry missing');process.exit(1)} if(enHtml!==6){console.error('FAIL: expected 6 htmlLang:\"en\" rows, got '+enHtml);process.exit(1)} console.log('PASS: 6 EN entries present')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c 'path: "/en/' scripts/seo-routes.ts` returns exactly `6`
    - `grep -c 'htmlLang: "en"' scripts/seo-routes.ts` returns exactly `6`
    - `grep -c 'ogImage:' scripts/seo-routes.ts` returns at least `6` (every EN entry has ogImage; RU entries fall through to DEFAULT_OG_IMAGE without explicit ogImage by current convention)
    - `npm run build` exits 0 (verifies TS compilation of the SSR build of seo-routes.ts succeeds; if any of the 6 new entries is missing a required RouteMeta field, the build fails loudly)
    - Reciprocity check: pick `/welcome` and `/en/welcome` entries, diff their `hreflangAlternates` triplet values — they MUST be identical (RESEARCH.md Pitfall 5)
    - `node -e "import('./.ssr-meta/seo-routes.js').then(m =&gt; { if(m.routes.length !== 13){console.error('FAIL: expected 13 routes, got '+m.routes.length);process.exit(1)} console.log('PASS: 13 routes total') })"` after build (verifies the SSR-compiled manifest has 13 entries — this is the form prerender.mjs and sitemap.mjs consume)
  </acceptance_criteria>
  <done>
    `scripts/seo-routes.ts` exports 13 RouteMeta entries (7 RU + 6 EN). Build succeeds. All EN entries reference `og-card-en.png`. Hreflang triplets are reciprocal between each cluster pair. Plans 03, 05, 07 can now consume the manifest unchanged.
  </done>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none in this plan) | `scripts/seo-routes.ts` is a build-time TypeScript constant module. It is consumed only by `scripts/prerender.mjs` and `scripts/sitemap.mjs` at build time, both of which run in Node before the static `dist/` artifacts are uploaded. No runtime path, no user input, no external surface. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-03 | Tampering | hreflang URL values | mitigate | `hreflangAlternates` values are template-literal constants under `SITE_ORIGIN`. No user input flows into them. Plan 03's `applyHreflang` further passes each value through `escapeAttr` (already used by `applyMeta`). Defense-in-depth. |
| T-03-04 | Information Disclosure | Indexing of /en/account, /en/success, /en/dashboard | accept | `/en/account`, `/en/success`, `/en/dashboard/*` are intentionally NOT added to the manifest (D-03). They will return the SPA fallback (RU shell, no prerendered content) which has no EN-specific data leakage. Plan 04 adds explicit `Disallow: /en/account`, `/en/success`, `/en/dashboard/` to `public/robots.txt` for defense-in-depth. |

ASVS V14 only (minor — security headers in `vercel.json` `/(.*)` source pattern auto-apply to all 6 new `/en/*` URLs; no header change needed in this plan).
</threat_model>

<verification>

- `npm run build` exits 0 (TS errors in seo-routes.ts surface at SSR build time).
- After build, `node -e "import('./.ssr-meta/seo-routes.js').then(m =&gt; console.log(m.routes.length))"` prints `13`.
- Manual spot-check: open the compiled `.ssr-meta/seo-routes.js`, confirm each of the 6 EN entries has all required RouteMeta fields and the reciprocal hreflang triplet.

</verification>

<success_criteria>

- [ ] `RouteMeta` interface has `htmlLang` and `hreflangAlternates` required fields.
- [ ] 7 RU entries all carry `htmlLang: "ru"` and a reciprocal `hreflangAlternates` triplet.
- [ ] 6 EN entries (`/en/`, `/en/pay`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`) are appended.
- [ ] Every EN entry has `htmlLang: "en"`, `ogImage` pointing to `og-card-en.png`, and the same triplet as its RU sibling.
- [ ] `npm run build` exits 0.
- [ ] 13 total routes in the compiled manifest.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-02-SUMMARY.md` summarizing:
- Final RouteMeta schema (with the 2 new fields).
- The 6 EN entries with their English titles/descriptions (for downstream reference).
- Acceptance: 13 routes in `.ssr-meta/seo-routes.js`.
</output>
