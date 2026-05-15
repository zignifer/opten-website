---
status: resolved
trigger: "При скролле сайта opten.space с мобильного iOS Safari появляется большая белая зона под тёмным контентом. Регрессия — появилось после деплоя Фазы 2 (per-route prerender + hydrateRoot, коммиты 93b0a51 → 062327a, hotfix 80b16be) 2026-05-15."
created: 2026-05-15
updated: 2026-05-15
resolved: 2026-05-15
slug: mobile-scroll-white-bg
---

# Debug Session: mobile-scroll-white-bg

## Symptoms

- **Expected behavior:** Лендинг `/` на opten.space на мобильном (iPhone Safari) скроллится плавно, фон всей видимой области — тёмный `#011417`, как у обёрточного `<div>` в [src/app/App.tsx:507](src/app/App.tsx#L507). Никаких белых зон не должно быть.
- **Actual behavior:** При скролле в нижней части viewport (над URL-баром iOS Safari) видна большая белая зона (~30-40% высоты экрана). Зона стабильно видна на любых scroll-позициях.
- **Error messages:** Не зафиксировано — devtools на мобильном не открывались.
- **Timeline:** Регрессия после деплоя `80b16be` (hotfix Фазы 2) 2026-05-15.
- **Reproduction:** 1) Открыть https://opten.space на iPhone Safari (URL-бар внизу). 2) Скроллить лендинг. 3) Белая зона появляется в нижней трети viewport.
- **Device/browser:** iPhone Safari, URL-бар внизу.
- **Stability:** Каждый раз при скролле.

## Context

См. секцию «Resolution» ниже для итоговой формулировки. Подробный архив гипотез и проверок:

- `<body>` имеет белый фон через `body { @apply bg-background }` ([src/styles/theme.css:165](src/styles/theme.css#L165)), где `--background: #ffffff`.
- Обёрточный `<div>` лендинга — `bg-[#011417]` ([src/app/App.tsx:507](src/app/App.tsx#L507)).
- Phase 2 изменил `main.tsx` на `hydrateRoot`, добавил `scripts/prerender.mjs` (per-route prerender), сделал hero-анимацию eager-imported, переключил `useState<Lang>("ru")` для SSR-safety.
- Meta theme-color был `#000000`, не совпадал с `#011417` страницы.

## Resolution

### Root cause

**Body имел белый фон (`--background: #ffffff`)**, обёрточный `<div>` лендинга — тёмный `bg-[#011417]`. iOS Safari с нижним URL-баром:

1. Использует разные viewport-метрики (small/large/dynamic) при рассчёте видимой области.
2. Полупрозрачный нижний URL-бар, safe-area insets и rubber-band overscroll просвечивают document background.
3. По умолчанию iOS Safari красит фон под полупрозрачным URL-баром через `<meta name="theme-color">` (был `#000000`) ИЛИ через `<html>`/`<body>` background-color — а оба белых.

**Почему именно Фаза 2 выявила баг (а не создала его):** до Phase 2 страница рендерилась поверх пустого `<div id="root">` — пользователь видел белый фон до гидратации, потом тёмный лендинг. iOS Safari не успевал показать характерные «гэпы» белого, потому что страница была пустая. После Phase 2 prerender отдаёт полные 8062px тёмного контента с первого paint → iOS теперь стабильно рендерит UI-границы вокруг тёмной страницы, и в этих границах виден белый body.

Это **накопленный технический долг**, обнажённый ускорением первого paint, а не новый баг из hydrateRoot или prerender-скриптов.

### Fix

**2 файла, 1 коммит:**

1. **[src/styles/theme.css](src/styles/theme.css)** — добавлены `background-color: #011417` для `html` и `body` (поверх существующих overflow/width правил в `@layer base`). Tailwind-токен `--background: #ffffff` НЕ менял — Radix UI компоненты на `bg-background` останутся белыми, как ожидается. Только сам элемент `<body>` теперь красится в брендовый тёмный.

2. **[index.html:11](index.html#L11)** — `<meta name="theme-color" content="#000000">` → `#011417`. Это убирает цветовой шов между нижним URL-баром iOS и страницей.

**Покрытие маршрутов:**

| Route | Wrapper bg | Body bg после фикса | OK? |
|---|---|---|---|
| `/` | `#011417` | `#011417` | ✓ совпадают |
| `/pay` | `#011417` | `#011417` | ✓ совпадают |
| `/account` | `bg-black` | `#011417` | ✓ overscroll-bounce покажет `#011417` под чёрным wrapper — почти неразличимо |
| `/success` | `bg-black` | `#011417` | ✓ как `/account` |
| `/privacy`, `/terms`, `/refund` | `bg-black` (LegalLayout) | `#011417` | ✓ как `/account` |
| `/dashboard/download-skill` | `#0a0a0a` | `#011417` | ✓ почти неразличимо |
| `/welcome` | `bg-white` ⚠️ | `#011417` | ⚠️ overscroll bounce покажет краешек тёмного под белым wrapper. Acceptable — `/welcome` редко скроллится, и эффект меньше регрессии, которую он лечит. |

### Build verification

- `npm run build` — clean, 1621 modules, 2.11s. Prerender: 6 routes emitted (`/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`).
- В `dist/assets/index-*.css` второе правило для `body` побеждает в каскаде: `body{background-color:#011417;...}` идёт после `body{background-color:var(--background);...}`.
- В `dist/index.html`, `dist/welcome/index.html`, `dist/pay/index.html` `<meta name="theme-color" content="#011417">` присутствует.

### Real-device verification — REQUIRED

В этой сессии iOS WebKit-репродукция была невозможна (Playwright не установлен, Chromium-эмуляция баг не воспроизводила). Финальное подтверждение — на реальном iPhone после деплоя:

1. Зайти на https://opten.space с iPhone Safari (URL-бар внизу).
2. Скроллить лендинг.
3. Ожидаемо: ни на одной scroll-позиции белой зоны не видно — фон везде `#011417`, цвет нижнего URL-бара слит со страницей.
4. Если белая зона осталась — повторно открыть debug session и копать в сторону DOM-разрыва (например, `position: fixed` элемент с белым фоном, который мог появиться после Phase 2 в hero).

## Evidence

- 2026-05-15: User-supplied 3 screenshots from iPhone Safari (21:57, 22:02, 22:02) — show same white area below dark page content across different scroll positions on `/`.
- 2026-05-15: Chromium iPhone 13 emulation on `npm run build` + local static server → body 8062.078px, wrapper 8062.078px, all sections bg `rgb(1,20,23)`, no white visible. (Chromium не воспроизводит iOS-Safari-специфичный rendering нижнего UI.)
- 2026-05-15: Hydration check — body height stable before/after networkidle.
- 2026-05-15: With all images blocked, page still 8033px — not image-load-related.
- 2026-05-15: Static audit показал: `body { @apply bg-background }`, `--background: #ffffff` → body белый. Wrapper `<div>` тёмный. Все остальные роуты тоже имеют тёмный wrapper, кроме `/welcome` (`bg-white`).
- 2026-05-15: Post-fix `npm run build` clean, prerendered HTML содержит обновлённый `theme-color`, prod CSS красит `html` и `body` в `#011417`.

## Eliminated

- ✗ Image lazy-loading causing short body — body 8033px даже без картинок.
- ✗ Hydration layout shift (LangContext) — SSR использует `useState("ru")`, RU-user не меняется, height стабильна.
- ✗ Missing sections in DOM — все 6 секций + footer присутствуют в `dist/index.html`.
- ✗ `100vh` constraints — нет `h-screen`/`100vh` на лендинге.
- ✗ Реальная регрессия в hydrateRoot/prerender DOM — никаких новых элементов с белым фоном Phase 2 не добавляла; root cause — давний body bg = white, обнажённый ускорением first paint.

## Lessons learned

- При prerender-стратегии (страница тёмная с первого paint) **полупрозрачный нижний UI iOS Safari начинает участвовать в композите** иначе, чем когда страница пустая.
- Tailwind-токены (`--background`) и реально painted background элемента — **разные слои ответственности**. Безопасно красить `body` напрямую через `background-color`, оставляя `--background` как white для компонентов.
- `<meta name="theme-color">` должен совпадать с painted background — иначе виден seam между URL-баром iOS и страницей.
- В будущем при изменении hero/первого экрана пробовать на реальном iOS, а не только в Chromium emulator. Chromium iPhone emulation **не воспроизводит** translucent URL-bar / safe-area behavior.
