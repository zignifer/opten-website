---
id: 260516-pmk
slug: normalize-mobile-landing-section-spacing
type: quick
status: complete
created: 2026-05-16
completed: 2026-05-16
files_modified: 1
commits: 1
---

# Quick Task 260516-pmk — Summary

## Outcome

Привёл вертикальные отступы лендинга к единой системе на мобильном брейкпойнте:

- Top первой секции: 80px (от референса юзера)
- Между секциями: **140px** (везде)
- Heading → content внутри секции: **60px** (везде)
- Десктоп (md+) не тронут

## Verification

`npm run build` — зелёный.

Замеры через Playwright (viewport 390×844, page.evaluate):

| Гэп | Цель | Факт |
|---|---|---|
| Hero h1 top | (юзерский ref) | 131px (соответствует −19 от 99) |
| Partners → Steps h2 | 140 | **140** ✓ |
| Steps h2 → first step | 60 | **60** ✓ |
| Steps → Features h2 | 140 | **140** ✓ |
| Features h2 → first card | 60 | **60** ✓ |
| Features → Privacy h2 | 140 | **140** ✓ |
| Privacy h2 → first item (h3) | 60 | **60** ✓ |
| Privacy → Pricing h2 | 140 | **140** ✓ |
| Pricing h2 → first card | 60 | **60** ✓ |
| Pricing → Footer h2 | 140 | **140** ✓ |

## Files Modified

- `src/app/App.tsx` — 11 правок Tailwind-классов:
  1. `Hero`: `pt-[150px]` → `pt-[131px]`
  2. `Partners` inner: `pb-[56px]` → `pb-[70px] md:pb-[56px]`
  3. `Steps section`: `py-20` → `py-[70px] md:py-20`
  4. `Steps grid`: `mt-20` → `mt-[60px] md:mt-20`
  5. `FeatureCards section`: `py-24` → `py-[70px] md:py-24`
  6. `FeatureCards grid`: `mt-20` → `mt-[60px] md:mt-20`
  7. `Privacy section`: `py-24` → `py-[70px] md:py-24`
  8. `Privacy grid`: `gap-12` → `gap-y-5` (lg:gap-[200px] перекрывает)
  9. `PrivacyItem`: `py-10` → `pt-10` + условный `pb-0 md:pb-10` для last
  10. `Pricing section`: `py-24` → `py-[70px] md:py-24`
  11. `Pricing grid`: `mt-16` → `mt-[60px] md:mt-16`
  12. `Footer`: `pt-28` → `pt-[70px] md:pt-28`

## Out of scope (явно не менялось)

- Все десктопные значения (≥md) сохранены
- Отступы перед `InstallButton` (`mt-16`) внутри Steps/FeatureCards
- Gap внутри списков карточек/степов
