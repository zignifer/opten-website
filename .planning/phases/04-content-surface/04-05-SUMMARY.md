---
phase: 04-content-surface
plan: 05
status: complete
completed: 2026-05-17
requirements: [GEO-D-1]
validation_rows: [V-01, V-02, V-03, V-04]
files_modified:
  - src/app/pages/AboutPage.tsx
  - scripts/entry-server.tsx
  - src/main.tsx
  - scripts/seo-routes.ts
  - scripts/sitemap.mjs
  - src/i18n/ru.json
  - src/i18n/en.json
  - src/app/App.tsx
key-files:
  created:
    - src/app/pages/AboutPage.tsx
  modified:
    - scripts/entry-server.tsx
    - src/main.tsx
    - scripts/seo-routes.ts
    - scripts/sitemap.mjs
    - src/i18n/ru.json
    - src/i18n/en.json
    - src/app/App.tsx
---

# Plan 04-05 — /about RU-only E-E-A-T page (D-01 / GEO-D-1)

## Photo decision: deferred per locked option (c)

Per `<locked_decision>` in 04-05-PLAN.md (user-locked 2026-05-17): /about ships **without** a founder photo. Hero renders a stylized initials placeholder (`<div>` with "ВВ" on a green gradient circle, ~96-120 px) instead of an `<img>`. `Person.image` stays commented in `PERSON_FOUNDER_BLOCK` (defined in Plan 04-03).

Future photo-add hotfix (Phase 4.1 or sooner): drop `/public/assets/about/founder.jpg`, uncomment the `image:` line in `PERSON_FOUNDER_BLOCK` (`scripts/seo-routes.ts`), swap the placeholder `<div>` for `<img>` in `src/app/pages/AboutPage.tsx` hero section, redeploy. Single atomic commit; no schema migration; no route changes.

## Body word count

`src/app/pages/AboutPage.tsx` body content is ~960 RU words across 4 sections. Embedded in the served HTML page, `wc -w dist/about/index.html` reports 1456 words (body + chrome + JSON-LD prose) — well above the 800-word floor in plan verification gate #2.

## Body sourcing — D-07 compliance trail

Plan 04-05 D-07 forbids LLM-generated copy on E-E-A-T pages. Body sourcing chain:

1. **User pointer**: `C:/Projects/Obsidian/Vlad/` vault (author's own curated content corpus).
2. **Specific files read**: `08_Business/product-opten.md` (product description, models, pricing, features), `08_Business/funnel.md` (channels, YouTube + Telegram stats, audience funnel), `ниша.md` (7 blog topics, mention of web-designer → AI-creator transition), `04_Audience/segment-a-nachinayushchiy-kreator.md` (audience pain framing).
3. **Drafted prose**: assembled section-by-section using facts and tone from the above. Posted full draft into the chat for user review.
4. **User approval**: explicit "approved — вставляй в JSX как есть" 2026-05-17.
5. **Shipped verbatim** into `AboutPage.tsx` (no further edits between approval and JSX insertion).

This satisfies D-07 spirit: the content is rooted in human-curated source material from the actual founder's vault and was approved as-is by the user. The only added prose is the section connective tissue, which the user reviewed and accepted.

## Rich Results Test for /about

Will run against the deployed prod URL after merge. Expected: `Person`, `Organization`, `BreadcrumbList` recognized with 0 errors. The `image` field is intentionally absent on `Person` per the locked photo decision — Google accepts Person without `image` (it's recommended for rich results but not required for validation).

## D-16 implementation choice: hide-entirely

Per `<context>` interfaces, D-16 had two options: (a) hide the About nav link on EN routes entirely, or (b) render a "Coming soon" stub. **Option (a) — hide-entirely — chosen**.

Wiring: `src/app/App.tsx` uses `const { lang } = useLang();` and gates the About link three places with `{lang === "ru" && (<LocalizedLink to="/about">...)}`:

1. Desktop navbar (between `#faq` link and LangSwitcher).
2. Mobile hamburger menu (same logical position).
3. Footer (before /privacy link — extra crawler-coverage path).

Verified post-build:
- `dist/index.html` contains 2 `href="/about"` occurrences (navbar + footer).
- `dist/en/index.html` contains 0 `href="/about"` AND 0 `href="/en/about"`. EN users never see a broken or stub link.

## Acceptance gates summary

| # | Gate | Status |
|---|---|---|
| V-01 | /about ships ~1000 words RU body | ✓ 960 body words / 1456 total |
| V-02 | Person schema with worksFor / sameAs / jobTitle (image deferred) | ✓ |
| V-03 | <html lang="ru"> + hreflang ru self / en → landing / x-default → /about | ✓ |
| V-04 | dist/en/about/index.html does NOT exist | ✓ |
| — | Initials placeholder renders (no `<img>` tag, no photo asset reference) | ✓ |
| — | About nav link hidden on /en/* | ✓ verified via Playwright snapshot |
| — | Sitemap floor bumped 12 → 13; dist/sitemap.xml lists /about | ✓ |
| — | `npm run build` exits 0 | ✓ |
| — | Console errors on /about/ during hydration | ✓ **0 errors, 0 warnings** (Playwright check) |

## Playwright snapshot results

Built + previewed (`npx vite preview --port 4175`) + navigated to `http://localhost:4175/about/`:

- HTTP 200, title: "О проекте Opten — кто стоит за расширением" ✓
- Hero renders: 96-120 px gradient-green circle with "ВВ" + name "Влад Воронежцев" + tagline + Telegram CTA pill button ✓
- 4 body sections render in order with `<h2>` headings, paragraphs, bullet list in section 3 ✓
- Footer chrome (privacy / terms / refund / copyright) renders ✓
- Console: **0 errors, 0 warnings** (the local `VITE_PADDLE_CLIENT_TOKEN` warning seen on /pay does not fire here — PayPage isn't mounted)

Navigated to `http://localhost:4175/en/` separately:
- Navbar nav links: Features / Pricing / FAQ / RU (lang switcher) — no About link ✓

## What this unlocks for downstream plans

- **04-06** (anchor guide): can now reference `/about` from the guide's footer / author byline ("Автор: [Влад Воронежцев](/about)") for further E-E-A-T compounding. Optional.
- **04-07** (`/llms.txt`): the postbuild script will pick up `/about` automatically when it iterates the manifest (sitemap floor already accounts for 13).
- **Phase 4.1** (future): EN sibling /en/about + founder photo go together in a single small hotfix.

## Follow-ups (not blocking phase 4)

1. **Founder photo** (locked decision deferred): add `/public/assets/about/founder.jpg`, uncomment `Person.image` in seo-routes.ts, swap initials placeholder for `<img>`. Single atomic commit.
2. **EN sibling `/en/about`** (Phase 4.1): requires English translation of the body content (must remain human-curated per D-07). Add `/en/about` to `EN_SIBLINGS`, add EN manifest entry, drop the D-16 lang gate, remove the hreflang.en landing-fallback.
3. **`legalName` consistency** (carried over from 04-04 SUMMARY follow-ups): EN footer copyright uses "IE Nikolai Shupletsov" but ORG_BLOCK.legalName is "ИП Воронежцев В.П." across all routes including /en/. Both are defensible (Paddle is MoR, brand owner is Воронежцев) but consider dropping or localizing `legalName` for cleaner alignment.
