---
id: 260516-pmk
slug: normalize-mobile-landing-section-spacing
type: quick
status: complete
created: 2026-05-16
---

# Quick Task 260516-pmk: Normalize mobile landing section spacing

## Goal

Привести вертикальные отступы лендинга к единой системе на мобильном брейкпойнте, не трогая десктоп (md+).

### Целевая система

| Что | Текущее (замеры юзера) | Целевое |
|---|---|---|
| Top первой секции (Hero) от верха | 99 | 80 |
| Между секциями (Partners→Steps) | 132 | 140 |
| Между секциями (Steps→Features) | 176 | 140 |
| Между секциями (Features→Privacy) | 193 | 140 |
| Между секциями (Privacy→Pricing) | 241 | 140 |
| Между секциями (Pricing→Footer) | 204 | 140 |
| Внутри секции: heading→content | 85 (×4), 64 (×1) | 60 |

Принцип: каждая секция получает `py-[70px]` на мобильном (70 + 70 = 140 между соседними). Отступ `mt-[60px]` после `SectionTitle` до контента. `md:` префиксы возвращают существующие значения на десктопе.

## Tasks

### Task 1: Apply mobile spacing system to `src/app/App.tsx`

**Files:** `src/app/App.tsx`

**Changes:**

1. **Hero** (line ~179) — уменьшить top padding на мобильном:
   - `pt-[150px]` → `pt-[131px]` (−19px, чтобы 99→80)
   - `md:pt-[190px]` оставить

2. **Partners inner div** (line ~208):
   - `pb-[56px]` → `pb-[70px] md:pb-[56px]`

3. **Steps section** (line ~272):
   - `py-20` → `py-[70px] md:py-20`
   - Внутренний `mt-20 grid` (line ~284) → `mt-[60px] md:mt-20`

4. **FeatureCards section** (line ~340):
   - `py-24` → `py-[70px] md:py-24`
   - Внутренний `mt-20 grid` (line ~350) → `mt-[60px] md:mt-20`

5. **Privacy section** (line ~384):
   - `py-24` → `py-[70px] md:py-24`
   - Внутренний `gap-12 lg:grid-cols-...` (line ~385) → `gap-y-5 lg:grid-cols-...` (gap-y-5 = 20px; на lg перекрывается `lg:gap-[200px]`)
   - **PrivacyItem** (line ~399): `py-10` → `pt-10 pb-10` для не-last; `pt-10 pb-0 md:pb-10` для last. Это убирает 40px хвоста последнего пункта на мобильном, чтобы общий зазор Privacy→Pricing был 140.

6. **Pricing section** (line ~416):
   - `py-24` → `py-[70px] md:py-24`
   - Внутренний `mt-16 grid` (line ~431) → `mt-[60px] md:mt-16`

7. **Footer** (line ~489):
   - `pt-28` → `pt-[70px] md:pt-28`

**Verify:**
- `npm run build` проходит без TS-ошибок
- `npm run dev` — визуально проверить мобильный (Chrome DevTools, ширина 390px) — сравнить с PDF-разметкой

**Done:** все 7 правок применены, билд зелёный.

## Out of scope

- Десктоп-отступы (md+) — пользователь явно ограничил mobile-only
- Внутренние отступы между Step / FeatureCard / PrivacyItem карточками (gap внутри списков) — не флагалось
- `mt-16` перед InstallButton внутри Steps/FeatureCards — не флагалось
