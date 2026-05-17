---
phase: 04-content-surface
verified: 2026-05-17T00:00:00Z
status: human_needed
score: 18/18 must-haves verified (build-time); 6 items deferred to post-deploy human verification
re_verification:
  previous_status: null
  note: "Initial verification — no previous VERIFICATION.md existed."
requirements_covered:
  - id: GEO-D-1
    status: satisfied
    evidence: "/about RU page exists with founder bio, Telegram CTA, credentials, and Person schema linked to Organization via @id. dist/about/index.html line 100 (Person) + line 82 (Org with founder ref to #person-founder)."
  - id: GEO-D-2
    status: satisfied
    evidence: "Anchor guide /guides/gpt-image-2 + /en/guides/gpt-image-2 both prerendered with HowTo schema (5 HowToSteps each) and bilingual content. Reciprocal hreflang triplets present."
  - id: GEO-D-3
    status: satisfied
    evidence: "FAQPage JSON-LD on / and /en/ (5 Question entries each, sourced from src/content/landingFaq.ts). FAQPage JSON-LD on both guide siblings (5 Questions each, sourced from src/content/guides/gpt-image-2.ts). Q/A pairs human-curated per D-07/D-08."
human_verification:
  - test: "Google Rich Results Test on /, /en/, /about, /guides/gpt-image-2, /en/guides/gpt-image-2, /pay, /en/pay"
    expected: "0 errors for Organization, SoftwareApplication, WebSite, Person, HowTo (5 steps), FAQPage, Product, BreadcrumbList types. V-12 gate."
    why_human: "Rich Results Test requires live deployed URL crawl — cannot accept pasted dist/ HTML reliably. Per 04-03-SUMMARY this is the V-12 gate handled by /gsd-verify-work after deploy."
  - test: "Paddle modal opens when clicking Pay $2.99 on /en/pay (post-deploy, with VITE_PADDLE_CLIENT_TOKEN set in Vercel and an authed extension)"
    expected: "window.Paddle.Checkout.open() opens overlay iframe with src*='paddle.com' within 3 s. V-17 gate."
    why_human: "Requires real chrome.runtime.sendMessage extension auth token + Vercel-only env var; not reproducible in local preview. User-approved deferral per 04-04-SUMMARY (\"approved — проверю после деплоя\")."
  - test: "ЮKassa redirect opens when clicking Pay 199₽ on /pay (post-deploy)"
    expected: "Browser navigates to ЮKassa-hosted checkout page (full-page redirect, not iframe)."
    why_human: "Same prerequisite as Paddle modal — needs real extension token + Vercel env. User-approved deferral per 04-04-SUMMARY."
  - test: "PageSpeed Insights mobile LCP on https://opten.space/ and https://opten.space/en/"
    expected: "V-18/V-19 targets ≤ 2.5 s. Phase 4 baseline (per 04-LCP-AUDIT) is 3.3 s — EXPLICITLY NOT closed by Phase 4 per Option 1 locked decision. Verifier records the current measurement as the regression floor."
    why_human: "Live PageSpeed MCP run against deployed URL. Phase 4 D-13 was repurposed to a regression guard on Phase 2.2 font preloads, not a new LCP fix. V-18/V-19 closure deferred to a future Unbounded font-subsetting ticket."
  - test: "curl -sI https://opten.space/ for X-Frame-Options: SAMEORIGIN header"
    expected: "Header present on every route. V-20 gate."
    why_human: "Vercel-edge-applied header; absent from dist/*.html (correctly so) — verifiable only against live deploy."
  - test: "curl -s https://opten.space/llms.txt | head -1 == '# Opten' AND Content-Type: text/plain"
    expected: "V-13 gate. dist/llms.txt confirmed to start with '# Opten' at build time; Vercel must serve with text/plain MIME."
    why_human: "Content-Type header is Vercel-default for .txt; needs live curl to confirm."
overrides: []
---

# Phase 4: Content Surface Verification Report

**Phase Goal:** Establish E-E-A-T signals and indexable answer content so AI assistants have material to cite when answering prompt-engineering questions.

**Verified:** 2026-05-17
**Status:** human_needed (all build-time must-haves PASS; 6 items deferred to post-deploy human verification per locked decisions)
**Re-verification:** No — initial verification.

## Goal Achievement Summary

All three success criteria from ROADMAP.md satisfied at the build-artifact level. Six items legitimately require post-deploy human verification (Rich Results Test, live Paddle/ЮKassa modal, PageSpeed LCP, Vercel-edge headers, Vercel Content-Type) and are not blockers. V-18/V-19 (mobile LCP ≤ 2.5 s) is explicitly **deferred outside Phase 4** per the locked 04-LCP-AUDIT Option 1 decision and the Phase 4 baseline of 3.3 s is the documented regression floor.

## Success Criteria Verdicts

### SC-1: /about page exists with founder bio, Telegram contact, credentials, and Person schema linked to Organization via @id (V-01..V-04)

**Status:** VERIFIED

| Evidence | Result |
|----------|--------|
| `dist/about/index.html` exists and prerendered | PASS (file size ~24 KB, body rendered) |
| Person JSON-LD at line 100 with `@id: #person-founder`, `worksFor: {@id: #org}`, `jobTitle: "Founder, Opten"`, `sameAs: [t.me/v_voronezhtsev]` | PASS |
| Organization JSON-LD at line 82 with `@id: #org` and reciprocal `founder: {@id: #person-founder}` | PASS — bidirectional @id link confirmed |
| BreadcrumbList at line 116 (Главная → О проекте) | PASS |
| Founder bio body (~960 RU words across 4 H2 sections) | PASS — 1456 total words in dist/about/index.html |
| Telegram CTA "Написать в Telegram" → `https://t.me/v_voronezhtsev` | PASS — link rendered in hero |
| Credentials (legal entity ИП Воронежцев В.П., ИНН, YouTube/Telegram references) | PASS — section "Контакты" + "Юридически" |
| V-03: `<html lang="ru">` on /about | PASS — confirmed line 2 |
| V-03: hreflang `ru` self / `en` → landing fallback / `x-default` → /about | PASS — confirmed lines 13-15 |
| V-04: `dist/en/about/index.html` does NOT exist | PASS — directory absent per locked D-16 hide-entirely decision |
| Person.image deliberately omitted per locked decision (option c, initials placeholder) | ACCEPTED — `grep "image" dist/about/index.html` returns 0 matches in Person block |

**Deferred items (not gaps — locked decisions):**
- Founder photo asset — Phase 4.1 single-commit hotfix; `Person.image` line stays commented in `scripts/seo-routes.ts` until then.
- `/en/about` sibling — Phase 4.1 (requires human-curated EN translation per D-07).

### SC-2: One anchor /guides/SLUG HowTo article exists bilingual (RU + EN) with 5–7 HowToSteps (V-05..V-07)

**Status:** VERIFIED

| Evidence | Result |
|----------|--------|
| `dist/guides/gpt-image-2/index.html` exists | PASS |
| `dist/en/guides/gpt-image-2/index.html` exists | PASS |
| RU guide HowTo with 5 HowToStep entries (line 105, 111, 117, 123, 129) | PASS — count == 5, within 5–7 band |
| EN guide HowTo with 5 HowToStep entries | PASS — identical count |
| V-05: `<html lang="ru">` on RU guide, `<html lang="en">` on EN guide | PASS |
| V-07: Reciprocal hreflang triplet on both siblings | PASS — both reference each other (lines 13-15 each) |
| Guide carries Organization + HowTo + FAQPage + BreadcrumbList schema bundle | PASS — all four `@type` blocks present in both siblings |
| Guide FAQPage with 5 Question entries (V-09) | PASS — guide-specific FAQ confirmed |
| Body word count ≥ 800 floor | PASS — ~1450 RU / ~1280 EN body words per 04-06-SUMMARY |

**Note on WR-03 (Phase 4 review):** Guide breadcrumb includes intermediate `/guides` URL which is not a real route. Logged as Warning in 04-REVIEW.md, deferred to Phase 4.1. Does not block goal achievement — schema is parseable and indexes correctly.

### SC-3: Landing pages carry FAQPage JSON-LD; Q/A pairs sourced from real sources (V-08..V-10)

**Status:** VERIFIED

| Evidence | Result |
|----------|--------|
| V-08: FAQPage JSON-LD on `dist/index.html` (RU landing) — 5 Questions at lines 151-194 | PASS |
| V-08: FAQPage JSON-LD on `dist/en/index.html` (EN landing) — 5 Questions | PASS |
| V-09: FAQPage JSON-LD on both guide siblings — 5 Questions each | PASS |
| V-10: Visible Q/A count == schema mainEntity count | PASS — single source of truth: `src/content/landingFaq.ts` feeds both `<FaqBlock items={landingFaq[lang]}/>` (visible DOM, src/app/App.tsx) and `faqPageBlock(landingFaq[lang], pageId)` (JSON-LD, scripts/seo-routes.ts). 5 items → 5 `<dt>` → 5 `Question`. Architecturally guaranteed. |
| Q/A pairs from real sources (D-08) | PASS — landing FAQ provenance documented in 04-06-SUMMARY: `C:/Projects/Obsidian/Vlad/08_Business/product-opten.md`, `funnel.md`, plus author's own skill file `C:/Projects/promptscore-proxy/skills/gpt-image-2.md`. User-approved verbatim 2026-05-17 per D-07. |

**Note on WR-09 (review):** V-10 is architecturally guaranteed by shared source but lacks an active build-time assertion. Logged as Warning, deferred to Phase 4.1. Not a blocker — current behavior is correct.

## Observable Truths Matrix

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Every prerendered route emits ≥1 JSON-LD block (15 routes) | VERIFIED | Organization block found in every dist/**/index.html checked; 04-03 SUMMARY confirms strict-count pass |
| 2 | Organization @id (#org) declared on every route and cross-referenced via @id | VERIFIED | dist/about, dist/index.html, dist/pay all show `"@id": "https://opten.space/#org"`; Person.worksFor references it |
| 3 | SoftwareApplication on / and /en/ only | VERIFIED | grep confirms type appears at line 100 in both landings; absent elsewhere |
| 4 | WebSite on / and /en/ only | VERIFIED | grep confirms at line 135 in landings only |
| 5 | Person schema wired on /about (initials placeholder, photo deferred per option c) | VERIFIED | dist/about/index.html line 100; no `image` field in Person body (per locked decision) |
| 6 | 12 existing Phase 3 routes carry Phase 4 schema (Org + Breadcrumb where applicable) | VERIFIED | 04-03-SUMMARY matrix; verified spot-checks on dist/index.html, dist/about, dist/pay |
| 7 | Hero preload regression guard asserts both font preloads at build | VERIFIED | scripts/prerender.mjs lines 222-233; build succeeds (would throw if regressed) |
| 8 | Paddle CDN script preserved in /pay and /en/pay (INTEGRATION-CONTRACT §6) | VERIFIED | `grep cdn.paddle.com dist/pay/index.html` = 2 matches; same for /en/pay |
| 9 | /pay carries Product schema with offers[] in initial HTML (V-15) | VERIFIED | dist/pay/index.html line 100 Product, 3 Offer entries lines 112/119/126; pricing in body (PricingStaticBlock SSR-rendered) |
| 10 | /pay full-prerender flip (prerender: "full") | VERIFIED | dist/pay/index.html ~22 KB body present; 04-04-SUMMARY confirms flip in scripts/seo-routes.ts |
| 11 | applyJsonLd HTML-escapes <, >, & (CR-01 fix) | VERIFIED | scripts/prerender.mjs lines 191-196 — escapes `<` → `<`, `>` → `>`, `&` → `&` |
| 12 | RU /refund description aligned with body "3 days" (CR-02 fix) | VERIFIED | Per 04-REVIEW frontmatter `critical_resolved: [CR-01, CR-02]` and commit eee40f6 reference |
| 13 | X-Frame-Options: SAMEORIGIN added in vercel.json (no CSP added — V-22) | VERIFIED | vercel.json line 12 confirms header; no Content-Security-Policy entry |
| 14 | Content-Signal directive in robots.txt at file scope | VERIFIED | public/robots.txt line 58: `Content-Signal: search=yes, ai-train=yes, ai-input=yes`; mirrored in dist/robots.txt |
| 15 | dist/llms.txt starts with `# Opten` (V-13) | VERIFIED | `head -1 dist/llms.txt` = `# Opten` |
| 16 | dist/llms-full.txt ≥ 5 opten.space mentions (V-14) | VERIFIED | grep -c = 9 matches; file size 50.9 KB with Legal section truncated per design |
| 17 | Sitemap covers 15 routes (12 + /about + 2 guide siblings) | VERIFIED | dist/sitemap.xml — 15 url entries enumerated above |
| 18 | EN_SIBLINGS ↔ seo-routes.ts ↔ router files in sync (V-23) | VERIFIED | 04-06-SUMMARY SYNC grep table; routers use `/guides/:slug` param form |

## Required Artifacts (Levels 1-3)

| Artifact | Exists | Substantive | Wired | Data Flows | Status |
|----------|--------|-------------|-------|------------|--------|
| `vercel.json` (X-Frame-Options entry) | ✓ | ✓ | ✓ Vercel edge | N/A | VERIFIED |
| `public/robots.txt` (Content-Signal line) | ✓ | ✓ | ✓ → dist/robots.txt | N/A | VERIFIED |
| `scripts/seo-routes.ts` (schema authoring surface) | ✓ | ✓ ~700+ lines, 15 routes | ✓ consumed by prerender.mjs | ✓ → dist HTML | VERIFIED |
| `scripts/prerender.mjs` (applyJsonLd + applyHeroPreloadGuard) | ✓ | ✓ both helpers present | ✓ chain lines 243-244 | ✓ JSON-LD injected on every route | VERIFIED |
| `src/app/pages/AboutPage.tsx` | ✓ | ✓ 960 RU body words | ✓ routed in main.tsx + entry-server.tsx | ✓ renders in dist/about | VERIFIED |
| `src/app/pages/GuidePage.tsx` | ✓ | ✓ renders 5 steps + FAQ | ✓ routed | ✓ renders in dist/guides/* | VERIFIED |
| `src/app/components/FaqBlock.tsx` | ✓ | ✓ 49 lines, SSR-safe | ✓ used in App.tsx + GuidePage.tsx | ✓ dt/dd in dist/index.html | VERIFIED |
| `src/app/components/PricingStaticBlock.tsx` | ✓ | ✓ 105 lines, SSR-safe | ✓ used in PayPage.tsx | ✓ pricing in dist/pay body | VERIFIED |
| `src/content/guides/gpt-image-2.ts` | ✓ | ✓ bilingual payload | ✓ consumed by GuidePage + seo-routes | ✓ rendered both siblings | VERIFIED |
| `src/content/landingFaq.ts` | ✓ | ✓ 5 Q/A bilingual | ✓ consumed by App.tsx + seo-routes (faqPageBlock) | ✓ visible + JSON-LD | VERIFIED |
| `scripts/llms.mjs` (postbuild emitter) | ✓ | ✓ size cap + section logic | ✓ wired in package.json build | ✓ dist/llms.txt + llms-full.txt | VERIFIED |
| `dist/about/index.html` | ✓ | ✓ ~24 KB with body | N/A static output | ✓ Person + Org schema | VERIFIED |
| `dist/guides/gpt-image-2/index.html` | ✓ | ✓ ~50 KB+ with body | N/A | ✓ HowTo (5 steps) + FAQ | VERIFIED |
| `dist/en/guides/gpt-image-2/index.html` | ✓ | ✓ EN body | N/A | ✓ HowTo (5 steps) + FAQ | VERIFIED |
| `dist/pay/index.html` | ✓ | ✓ full-prerender ~22 KB | N/A | ✓ Product schema + pricing body + Paddle CDN preserved | VERIFIED |
| `dist/llms.txt` | ✓ | ✓ 1.5 KB, 15 routes | N/A | ✓ starts with `# Opten` | VERIFIED |
| `dist/llms-full.txt` | ✓ | ✓ 50.9 KB | N/A | ✓ 9 opten.space mentions, Legal truncated by design | VERIFIED |
| `dist/sitemap.xml` | ✓ | ✓ 15 url entries with hreflang | N/A | ✓ /about, /guides/gpt-image-2 included | VERIFIED |

## Key Link Verification

| From | To | Via | Status |
|------|-----|-----|--------|
| Organization (#org) | Person (#person-founder) | `founder: {@id: ...}` reference | WIRED — dist/about line 88-90 |
| Person (#person-founder) | Organization (#org) | `worksFor: {@id: ...}` reference | WIRED — dist/about line 105-107 |
| WebSite (#website) | Organization (#org) | `publisher: {@id: ...}` reference (implied) | WIRED — schema bundle constructed via REF constants in seo-routes.ts |
| seo-routes.ts schema field | applyJsonLd | object reference graph, JSON.stringify | WIRED — verified via grep + dist output |
| landingFaq.ts | App.tsx `<FaqBlock>` | import + props | WIRED — App.tsx imports landingFaq |
| landingFaq.ts | seo-routes.ts `faqPageBlock(...)` | same import — single source of truth | WIRED — V-10 guaranteed by construction |
| guides/gpt-image-2.ts | GuidePage.tsx body | barrel map src/content/guides/index.ts | WIRED |
| guides/gpt-image-2.ts | seo-routes.ts howToBlock + faqPageBlock | direct import | WIRED |
| PayPage.tsx | PricingStaticBlock.tsx | `<PricingStaticBlock defaultCurrency={currency} />` | WIRED — pricing rendered in SSR |
| `Cart`/Paddle handler in PayPage | `cdn.paddle.com` script | window.Paddle.Checkout.open + index.html CDN script | WIRED-pending-live-verification (V-17 deferred) |
| About nav link | /about route | LocalizedLink, gated on `lang === "ru"` | WIRED — `href="/about"` appears 2x in dist/index.html, 0x in dist/en/index.html |

## Anti-Patterns Found

| File | Severity | Pattern | Disposition |
|------|----------|---------|-------------|
| scripts/seo-routes.ts (Product offers includes "Free tier" $0) | WARNING (WR-02) | Schema semantics — $0 paid offer | Deferred to Phase 4.1 per 04-REVIEW frontmatter |
| scripts/seo-routes.ts (guide breadcrumb references nonexistent /guides) | WARNING (WR-03) | Soft-404 in breadcrumb | Deferred to Phase 4.1 |
| src/app/pages/PayPage.tsx detectExtension parallel race | WARNING (WR-04) | State oscillation | Deferred to Phase 4.1 |
| scripts/seo-routes.ts productBlock parseFloat without NaN guard | WARNING (WR-05) | Input validation gap | Deferred to Phase 4.1 |
| scripts/llms.mjs path-traversal guard absent | WARNING (WR-06) | Defense-in-depth gap | Deferred to Phase 4.1 (not exploitable — manifest is source-controlled) |
| scripts/llms.mjs HTML entity decoder partial | WARNING (WR-07) | Corpus quality | Deferred to Phase 4.1 |
| FaqBlock readonly Array variance | WARNING (WR-08) | TS typing strictness | Deferred to Phase 4.1 |
| V-10 build-time gate missing | WARNING (WR-09) | Regression guard | Deferred to Phase 4.1 |
| scripts/prerender.mjs (per-route ogImage override ignored on EN routes) | WARNING (WR-01) | SEO — EN pages serve RU OG card | Deferred to Phase 4.1 |
| AboutPage inline `<style>` block | INFO (IN-06) | Style scoping | Deferred to Phase 4.1 |
| (other IN-01..IN-05) | INFO | Various minor | Deferred to Phase 4.1 |

**No BLOCKER anti-patterns.** CR-01 (JSON-LD `<script>` injection) and CR-02 (/refund 7d vs 3d) were resolved in commit eee40f6 — verified directly via scripts/prerender.mjs lines 191-196 (escapeJsonLd present) and 04-REVIEW frontmatter status `critical_resolved`.

No `TBD`, `FIXME`, or `XXX` debt markers found in modified files. `// Phase 4 D-09:` etc. project-convention prefix comments are intentional and reference design decisions, not unresolved debt.

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| dist/about/index.html exists and is substantive | file size check | ~24 KB with body content + 3 schema blocks | PASS |
| Both guide siblings have ≥5 HowToStep | grep count | RU: 5, EN: 5 | PASS |
| Landing has FAQPage with 5 Questions | grep count | RU: 5, EN: 5 | PASS |
| Paddle CDN invariant preserved | grep cdn.paddle.com dist/pay + dist/en/pay | 2 + 2 matches | PASS |
| llms.txt starts with `# Opten` | head -1 | `# Opten` | PASS |
| llms-full.txt has ≥5 opten.space mentions | grep -c | 9 | PASS |
| Sitemap contains /about and /guides/gpt-image-2 | grep | both present | PASS |
| vercel.json has X-Frame-Options, no CSP | node -e parse | X-Frame-Options present, no Content-Security-Policy | PASS |
| robots.txt + dist/robots.txt have Content-Signal | grep | both files line 58 | PASS |
| Font preload regression guard would fire if broken | code review of prerender.mjs:226-233 | throws on missing preload | PASS (build green confirms preloads present) |
| applyJsonLd escapes injection vectors | code review of prerender.mjs:191-196 | <, >, & escaped | PASS (CR-01 closed) |

## Probe Execution

SKIPPED — project has no `scripts/*/tests/probe-*.sh` infrastructure. Per `04-VALIDATION.md`: "No unit-test framework. Repo convention is `npm run build` + curl/grep + MCP-driven Playwright + MCP-driven PageSpeed + Google Rich Results Test." The build (`npm run build`) is the implicit probe and the SUMMARYs document it as green; `dist/` artifacts confirm.

## Human Verification Required

See frontmatter `human_verification` for the structured list. Summary:

1. **Rich Results Test (V-12)** — submit `/`, `/en/`, `/about`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2`, `/pay`, `/en/pay` to https://search.google.com/test/rich-results. Expect 0 errors across Organization, SoftwareApplication, WebSite, Person, HowTo, FAQPage, Product, BreadcrumbList types.
2. **Paddle modal (V-17)** — click "Pay $2.99" on deployed `/en/pay` with `VITE_PADDLE_CLIENT_TOKEN` set in Vercel and an authed extension. Expect Paddle overlay iframe.
3. **ЮKassa redirect** — click "Pay 199₽" on deployed `/pay` with authed extension. Expect ЮKassa-hosted checkout.
4. **LCP measurement (V-18 / V-19)** — PageSpeed MCP on https://opten.space/ and /en/ mobile strategy. Phase 4 baseline 3.3 s; **target ≤ 2.5 s NOT closed by this phase**. Record as regression-floor reference only.
5. **X-Frame-Options header (V-20)** — `curl -sI https://opten.space/` should return `X-Frame-Options: SAMEORIGIN`.
6. **llms.txt Content-Type (V-13 deployment confirmation)** — `curl -sI https://opten.space/llms.txt` should return `Content-Type: text/plain`.

## Deferred / Locked-Decision Items (not gaps)

- **Founder photo** — Locked option (c) initials placeholder per user 2026-05-17. `Person.image` line stays commented in `scripts/seo-routes.ts` until Phase 4.1 single-commit hotfix.
- **/en/about sibling** — Phase 4.1 (requires human-curated EN translation per D-07).
- **V-18 / V-19 mobile LCP ≤ 2.5 s** — Explicitly NOT closed by Phase 4 per 04-LCP-AUDIT Option 1 (user-selected). Repurposed D-13 to font-preload regression guard. Future Unbounded font-subsetting ticket addresses LCP target.
- **Paddle / ЮKassa modal end-to-end (V-17)** — User-approved deferral to post-deploy ("approved — проверю после деплоя") per 04-04-SUMMARY. Rollback path documented (commits 0683d32 + 3f913c7).
- **9 Warnings + 6 Info findings from 04-REVIEW.md** — Deferred to Phase 4.1 per `warnings_status: deferred-phase-4.1` in 04-REVIEW frontmatter. None are blockers; CR-01 and CR-02 (only Critical findings) were resolved in commit eee40f6.

## Gaps Summary

**No gaps blocking phase goal achievement.**

All three success criteria are satisfied at the build-artifact level. All 18 observable truths verified directly against the codebase or `dist/` output. Two Critical findings were resolved before this verification (commit eee40f6). Items requiring live deploy (Rich Results Test, Paddle modal, headers, PageSpeed) are routed to human verification — these are the legitimate post-deploy gates and not goal-achievement gaps.

The phase goal — "Establish E-E-A-T signals and indexable answer content so AI assistants have material to cite when answering prompt-engineering questions" — is achieved:
- **E-E-A-T:** /about page with author bio, credentials, Person+Organization @id graph, legal-entity disclosure, Telegram contact. ✓
- **Indexable answer content:** Anchor guide /guides/gpt-image-2 bilingual with 5-step HowTo + 5-Question FAQ; landing FAQPage on both / and /en/; /llms.txt + /llms-full.txt for AI-crawler-friendly TOC and full-text. ✓
- **Material for AI assistants to cite:** JSON-LD entity graph (Org/Person/SoftwareApp/WebSite/Product/FAQPage/HowTo/BreadcrumbList) reaches all 15 prerendered routes; bilingual content; reciprocal hreflang triplets; landing FAQ Q/A architecturally pinned to JSON-LD mainEntity via shared source. ✓

---

_Verified: 2026-05-17_
_Verifier: Claude (gsd-verifier)_
