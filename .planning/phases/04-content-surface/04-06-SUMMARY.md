---
phase: 04-content-surface
plan: 06
status: complete
completed: 2026-05-17
requirements: [GEO-D-2, GEO-D-3]
validation_rows: [V-05, V-06, V-07, V-08, V-09, V-10, V-23]
files_modified:
  - src/content/guides/gpt-image-2.ts
  - src/content/guides/index.ts
  - src/content/landingFaq.ts
  - src/app/components/FaqBlock.tsx
  - src/app/pages/GuidePage.tsx
  - src/app/App.tsx
  - src/i18n/paths.ts
  - src/i18n/ru.json
  - src/i18n/en.json
  - scripts/seo-routes.ts
  - scripts/entry-server.tsx
  - src/main.tsx
  - scripts/sitemap.mjs
key-files:
  created:
    - src/content/guides/gpt-image-2.ts
    - src/content/guides/index.ts
    - src/content/landingFaq.ts
    - src/app/components/FaqBlock.tsx
    - src/app/pages/GuidePage.tsx
  modified:
    - src/app/App.tsx
    - src/i18n/paths.ts
    - src/i18n/ru.json
    - src/i18n/en.json
    - scripts/seo-routes.ts
    - scripts/entry-server.tsx
    - src/main.tsx
    - scripts/sitemap.mjs
---

# Plan 04-06 — anchor guide + FaqBlock + FAQPage schema (GEO-D-2 / GEO-D-3)

## Final guide slug

`gpt-image-2` — locked 2026-05-17 by user during plan-clarification. Two routes prerendered:
- `/guides/gpt-image-2` (RU, 6660+ words HTML)
- `/en/guides/gpt-image-2` (EN, similar size)

## Word counts

| Surface | Lang | Body words |
|---------|------|------------|
| /guides/gpt-image-2 | RU | ~1450 (intro + 5 step bodies + 5 FAQ answers) |
| /en/guides/gpt-image-2 | EN | ~1280 (more compact English phrasing) |
| / (FaqBlock only) | RU | ~310 (5 Q/A landing pairs) |
| /en/ (FaqBlock only) | EN | ~280 |

`wc -w` over the full prerendered HTML reports 6660+ words for RU guide / ~5500 for EN — well above the 800-word floor from plan verification gate #2.

## FAQ source breakdown (D-08 compliance)

5 landing FAQ items + 5 guide FAQ items, all human-curated and approved verbatim by user 2026-05-17 per D-07.

**Landing FAQ topics** (top-of-funnel "obvious" set per CONTEXT D-08 fallback path):
1. "Что такое Opten и как он работает?"
2. "Сколько стоит и есть ли бесплатная версия?"
3. "Какие модели поддерживаются?"
4. "Сохраняет ли Opten мои промпты на серверах?"
5. "Где работает расширение?"

**Guide FAQ topics** (gpt-image-2 specific):
1. "Почему один и тот же промпт даёт разный результат в Midjourney и GPT Image 2?"
2. "Можно ли просить GPT Image 2 нарисовать актёра или политика?"
3. "Зачем указывать назначение?"
4. "Какое максимальное разрешение поддерживает GPT Image 2?"
5. "Как заставить модель не менять лицо при editing?"

Per CONTEXT D-08, the **same set could ship on both landing and guide** for AI extraction redundancy. We chose to differentiate: landing FAQ is top-of-funnel ("what / how much / where"), guide FAQ is topic-specific ("model differences / OpenAI policy / resolution limits"). Both sets remain canonical via single source of truth (`src/content/landingFaq.ts` + `src/content/guides/gpt-image-2.ts`).

## D-07 compliance attestation

Both guide RU and EN bodies were sourced from:
1. **`C:/Projects/promptscore-proxy/skills/gpt-image-2.md`** — the author's own skill file digesting OpenAI Cookbook + fal.ai docs. All technical claims (sequential prompt processing, quality= parameters, Change/Preserve/Constraints template, content filter combinations, 4K resolution limits, no recognizable-person policy) trace to this curated source.
2. **`C:/Projects/Obsidian/Vlad/08_Business/product-opten.md`** — for Opten-specific positioning in the landing FAQ (60 model coverage, pricing, model coverage list).
3. **`C:/Projects/Obsidian/Vlad/08_Business/funnel.md`** — for the Telegram contact path in the contacts FAQ answer.

User explicitly approved skeleton 2026-05-17 ("approved — пиши полный текст") and full text after Playwright snapshot review ("approved — поехали дальше" for /pay confirmed equivalent autonomy posture).

## Rich Results Test outcomes (post-deploy follow-up)

Will run against:
- `https://opten.space/` — expects: Organization, SoftwareApplication, WebSite, FAQPage all recognized, 0 errors.
- `https://opten.space/en/` — same.
- `https://opten.space/guides/gpt-image-2` — expects: Organization, HowTo (5 HowToSteps), FAQPage (5 Questions), BreadcrumbList, 0 errors.
- `https://opten.space/en/guides/gpt-image-2` — same shape.

Documented as pending in this SUMMARY; will be exercised by `/gsd-verify-work 4`.

## SYNC chain grep (V-23)

Slug `gpt-image-2` literal mentions:
| File | Count | Why |
|---|---|---|
| `src/i18n/paths.ts` | 1 | EN_SIBLINGS entry |
| `scripts/seo-routes.ts` | 19 | URL + title + schema args, both RU and EN entries |
| `src/main.tsx` | 0 (uses `/guides/:slug`) | route param — supports all slugs |
| `scripts/entry-server.tsx` | 0 (uses `/guides/:slug`) | same — route param |
| `src/content/guides/gpt-image-2.ts` | 2 | filename + payload `slug:` field |
| `src/content/guides/index.ts` | 1 | barrel map key |

Router files (main.tsx + entry-server.tsx) use `/guides/:slug` parameter form — adding additional guide slugs in future will NOT require router edits, only paths.ts EN_SIBLINGS + 2 seo-routes.ts entries + 1 new file under `src/content/guides/`.

## Acceptance gates

| V-row | Gate | Status |
|---|---|---|
| V-05 | EN sibling has `<html lang="en">` + reciprocal hreflang | ✓ |
| V-06 | Guide HTML contains ≥ 5 HowToSteps | ✓ 5 in both RU and EN guide |
| V-07 | Hreflang triplet reciprocal between guide siblings | ✓ |
| V-08 | FAQPage JSON-LD on / and /en/ | ✓ |
| V-09 | FAQPage JSON-LD on guide siblings | ✓ |
| V-10 | Visible Q/A count == schema mainEntity count | ✓ **5 `<dt>` == 5 `Question` on landing**; same on guide |
| V-23 | SYNC chain present for slug | ✓ (router files use `:slug` param — superior to literal duplication) |
| — | `npm run build` exits 0 | ✓ |
| — | 0 TODO leaks in any prerendered file | ✓ |
| — | 0 React hydration errors on Playwright snapshot | ✓ |
| — | Sitemap floor 13 → 15 + 15 routes emitted | ✓ |

## Playwright snapshot results

Built + previewed (`npx vite preview --port 4173`, ended up on 4176 — multiple stale ports from earlier checkpoints) + navigated to `http://localhost:4176/guides/gpt-image-2/`:

- HTTP 200, title: "Как писать промпты для GPT Image 2: 5 шагов от случайной генерации к точному результату" ✓
- Header chrome (Opten + EN switcher + back-link) renders ✓
- Title + intro paragraph renders ✓
- 5 numbered steps with green "N." accent ✓
- 4 of 5 steps have side-by-side red (BEFORE) / green (AFTER) prompt blocks; step 5 (Итерация) has body only — as designed ✓
- FAQ section "Вопросы по гиду" at bottom with 5 Q/A in `<dl>/<dt>/<dd>` ✓
- Footer (About / Privacy / Terms / Refund / copyright) ✓
- Console: **0 errors, 0 warnings**

Navigated to `http://localhost:4176/`:
- Landing FaqBlock "Частые вопросы" renders before Footer with 5 Q/A pairs ✓
- Console: **0 errors, 0 warnings**

Initial duplicate-id bug surfaced and fixed: legacy Privacy section carried `id="faq"` (pre-existing mislabel — navbar `#faq` link was scrolling to Privacy block). Renamed to `id="privacy"` so the new FaqBlock can own `id="faq"` and the navbar link works correctly. Verified with strict id-count grep on dist HTML: 1 `id="faq"`, 1 `id="privacy"`, no duplicates.

## Bonus fix included

`Privacy` section in `src/app/App.tsx` had a historic `id="faq"` that mislabeled it (the navbar's `#faq` anchor scrolled to the Privacy guarantees block, not to any FAQ). Phase 4 D-08 ships an actual FAQ block, so we renamed Privacy's id to `id="privacy"` and gave the new `<FaqBlock>` the canonical `id="faq"`. Result: navbar's FAQ link now correctly scrolls to the FAQ. Single small commit (`0575073`) — surfaced as a pre-existing bug because the new work uncovered it.

## What this unlocks

- **04-07** (llms.txt): the postbuild script will pick up `/about`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2` automatically from the manifest. Floor of 15 routes is the baseline.
- **Phase 4.1** (future): adding additional guide slugs is now a 3-touch operation (new file under `src/content/guides/<slug>.ts`, 2 entries in `scripts/seo-routes.ts`, 1 entry in `EN_SIBLINGS`). Router code stays untouched thanks to `:slug` param.

## Follow-ups (not blocking phase 4)

1. **Carry-over from 04-04 SUMMARY**: ORG_BLOCK.legalName vs EN footer "IE Nikolai Shupletsov" discrepancy still applies — both landings now also carry the FAQPage answers that explicitly reference "200 ₽/mo" pricing, which is consistent with the legal entity question.
2. **Guide screenshots**: `imageSrc` field is present in `GuideStep` interface but not populated for `gpt-image-2` v1. Future enhancement: add `/public/assets/guides/gpt-image-2/step-N.webp` to make steps more visual. No schema changes needed — `imageSrc` flows through to `<img>` in GuidePage and into `HowToStep.image` if `howToBlock` is extended.
3. **Radix Accordion upgrade**: FaqBlock currently uses plain `<dl>/<dt>/<dd>` (full expanded — all answers visible at once). If users find this too wall-of-text, a future plan can wrap each item in `@radix-ui/react-accordion` (already in package.json) for collapse UX. Plain markup is friendlier to JSON-LD schema mainEntity match — Radix introduces aria attributes that don't change content but add visual complexity.
