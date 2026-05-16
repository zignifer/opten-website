---
phase: 03-bilingual-routing
verified: 2026-05-16T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Проверить поведение LangSwitcher в браузере: клик на /welcome переходит на /en/welcome, клик на /en/welcome — обратно на /welcome, на /account — переход на /en/"
    expected: "Переключатель работает по всем сценариям из Plan 08 Task 5 (10 шагов). Контент переключается без RU→EN вспышки на /en/* при прямом заходе."
    why_human: "Playwright-тесты выполнял оркестратор в рамках фазы (task 5), но верификатор не может воспроизвести headless-браузер в этом окружении без запуска сервера. Функционал URL-навигации LangSwitcher требует работающего BrowserRouter."
  - test: "Открыть /en/pay в браузере и нажать кнопку апгрейда — убедиться, что Paddle-модальное окно открывается без ошибок console"
    expected: "window.Paddle = object, модальное окно открывается, нет ошибок 'window.Paddle is undefined'"
    why_human: "Paddle требует CDN-загрузки в живом браузере. Статическое наличие script-тега в dist/en/pay/index.html подтверждено, но реальное поведение проверяется только в браузере."
---

# Phase 03: Bilingual Routing — Verification Report

**Phase Goal:** Make EN audience discoverable via real URLs that search engines and AI crawlers understand — without breaking shipped extension binaries that deep-link to locked routes.
**Verified:** 2026-05-16
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | EN user can land on /en/* URL and see English content with `<html lang="en">` baked at build time | VERIFIED | `dist/en/index.html`, `dist/en/welcome/index.html` etc. все содержат `<html lang="en">`. EN body content подтверждён: "Stop Wasting Credits" в dist/en/index.html, "Pin the extension" в dist/en/welcome/index.html. Все 6 EN-файлов прошли проверку. |
| 2 | hreflang triplet (ru, en, x-default) on every prerendered <head>, reciprocal between cluster pairs | VERIFIED | Все 12 dist-файлов содержат ровно 3 тега `rel="alternate" hreflang=...`. Reciprocity подтверждена для /welcome↔/en/welcome, /privacy↔/en/privacy, /↔/en/. x-default всегда указывает на RU-sibling (D-02). |
| 3 | Shipped extension binaries continue to navigate to locked routes; /en/pay carries the same synchronous Paddle CDN script as /pay; INTEGRATION-CONTRACT §6 updated symmetrically | VERIFIED | `dist/pay/index.html` и `dist/en/pay/index.html` оба содержат `<link rel="preconnect" href="https://cdn.paddle.com" />` и `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">`. Locked routes (/, /welcome, /pay, /success, /account, /dashboard/download-skill) сохранены без изменений в src/main.tsx и entry-server.tsx. INTEGRATION-CONTRACT.md §6 содержит 5 упоминаний /en/pay, Last sync = 2026-05-16, §3 locked-routes table = 5 строк. |
| 4 | Header LangSwitcher writes URL via useNavigate | VERIFIED | `src/app/components/LangSwitcher.tsx` создан, импортирует useNavigate из "react-router", использует computed target (getEnTarget/getRuTarget + EN_SIBLINGS allow-list). Нет inline `setLang(lang === "ru" ? "en" : "ru")` ни в одном файле (0 вхождений). 5 точек использования LangSwitcher: 2 в App.tsx, 1 в PayPage.tsx, 1 в AccountPage.tsx, 1 в LegalLayout.tsx. |
| 5 | Residual hydration mismatch on / (carry-over from Phase 02.2) is resolved | VERIFIED | `document.documentElement.lang` удалён из LangContext.tsx (0 вхождений). Suspense-маркеры `<!--$-->...<!--/$-->` присутствуют в dist/index.html и dist/en/welcome/index.html. Корневая причина (Suspense-асимметрия SSR/CSR) исправлена в entry-server.tsx — `<Routes>` обёрнут в `<Suspense>` зеркально main.tsx. Подтверждено Playwright (0 hydration errors в 3 сценариях). |

**Score: 5/5 truths verified**

---

### Deferred Items

Намеренно отложено за пределы фазы 3.

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | `og:image` в EN HTML-файлах указывает на `og-card-ru.png` вместо `og-card-en.png` | Phase 4+ | prerender.mjs строка 185: "ogImage is read but not currently re-injected — index.html already has og-card-ru.png hardcoded; Phase 4+ may swap this per-route". EN огриc в manifest (`DEFAULT_OG_IMAGE_EN`) корректен, но инъекция в HTML-шаблон отложена явно. |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `scripts/seo-routes.ts` | 12 RouteMeta записей (6 RU + 6 EN), поля htmlLang + hreflangAlternates | VERIFIED | 12 путей, 6 RU + 6 EN, RouteMeta содержит htmlLang и hreflangAlternates с xDefault. Commit 972bc8e. |
| `scripts/prerender.mjs` | applyHtmlLang, applyHreflang, applyOgLocale; Paddle widen; 12 dist-файлов | VERIFIED | Все 3 helper-функции присутствуют, wired в правильном порядке. Paddle condition: `meta.path === "/pay" \|\| meta.path === "/en/pay"`. Commit: 2c65135, d9261d8, f0e71b6, 5276b51. |
| `scripts/sitemap.mjs` | xmlns:xhtml + 3 xhtml:link на каждый URL | VERIFIED | `<loc>` count = 12, `<xhtml:link>` count = 36 (12×3), `xmlns:xhtml` объявлен. Fail-fast guard < 12. Commit 03bb3a5. |
| `scripts/entry-server.tsx` | 5 EN Route в SSR (без /en/pay) | VERIFIED | Ровно 5 `/en/*` Route (без /en/pay, без wildcard). Imports from "react-router". LangProvider inside StaticRouter. Commit 62f78c0. |
| `src/main.tsx` | 6 EN Route в client router | VERIFIED | Ровно 6 `/en/*` Route включая /en/pay. Locked routes (9 шт.) без изменений. Imports from "react-router". Commit 62f78c0. |
| `src/i18n/LangContext.tsx` | URL-prefix detection, SSR-safe, нет document.documentElement.lang | VERIFIED | detectLangFromPath, detectLangFromStorage (с SSR guard), useLocation(), pathLang ?? "ru", location.pathname в deps effect. 0 вхождений document.documentElement.lang. Commit 75fd6d4. |
| `src/app/components/LangSwitcher.tsx` | Новый компонент, useNavigate, EN_SIBLINGS allow-list | VERIFIED | Файл создан (~65 строк), exports default, useNavigate+useLocation из "react-router", EN_SIBLINGS = new Set(["/","/welcome","/pay","/privacy","/terms","/refund"]). Commit 7ec5dfe. |
| `public/robots.txt` | 5 × Disallow /en/account, /en/success, /en/dashboard/ | VERIFIED | Ровно 5 вхождений каждого Disallow в 5 user-agent блоках. |
| `docs/INTEGRATION-CONTRACT.md` | §6 упоминает /en/pay, Last sync = 2026-05-16 | VERIFIED | 5 упоминаний /en/pay, Last sync: 2026-05-16, §3 table = 5 строк (не 6). |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| scripts/seo-routes.ts (routes) | scripts/prerender.mjs | for-loop итерирует routes, читает htmlLang + hreflangAlternates | VERIFIED | prerender.mjs использует `meta.htmlLang`, `meta.hreflangAlternates.ru/en/xDefault` |
| scripts/seo-routes.ts (routes) | scripts/sitemap.mjs | filter + xhtml:link из hreflangAlternates | VERIFIED | sitemap.mjs читает `r.hreflangAlternates`, 36 xhtml:link в dist/sitemap.xml |
| src/i18n/LangContext.tsx | react-router useLocation | synchronous read в LangProvider body | VERIFIED | `const location = useLocation()` в верхней части LangProvider, useEffect([location.pathname]) |
| src/app/components/LangSwitcher.tsx | react-router useNavigate | navigate(computed target) | VERIFIED | `navigate(target)`, target = getEnTarget/getRuTarget, нет сырого browser-input в navigate() |
| scripts/prerender.mjs (/pay OR /en/pay) | applyPaddleScript | OR-widened condition | VERIFIED | `if (meta.path === "/pay" \|\| meta.path === "/en/pay")` в строке 192 |
| LangProvider inside StaticRouter (SSR) | entry-server.tsx | RouterContext required for useLocation | VERIFIED | StaticRouter > LangProvider > Suspense > Routes в entry-server.tsx |
| LangProvider inside BrowserRouter (client) | src/main.tsx | RouterContext required for useLocation | VERIFIED | BrowserRouter > LangProvider > Suspense > Routes в main.tsx |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| dist/en/welcome/index.html (body) | EN strings ("Pin the extension", "Welcome to Opten", "Sign in") | entry-server.tsx renderRoute("/en/welcome") → LangProvider(pathLang="en") → dicts.en (from static enFallback import) | Да | FLOWING |
| dist/en/index.html (body) | EN strings ("Stop Wasting Credits", component tree) | renderRoute("/en/") → LangProvider(pathLang="en") → EN dict | Да | FLOWING |
| LangSwitcher.tsx (navigate target) | computed target из EN_SIBLINGS Set + location.pathname | чистая функция getEnTarget/getRuTarget, нет внешнего data source | Да (константы) | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| dist/en/* файлы существуют и содержат правильный lang | node verification script | Все 12 файлов: lang OK, og:locale OK, og:locale:alternate OK, 3 hreflang тегов | PASS |
| Hreflang reciprocity | node verification script | /welcome↔/en/welcome, /privacy↔/en/privacy, /↔/en/: reciprocal=true | PASS |
| __PRERENDER_PATH markers | node verification script | Все 8 проверенных файлов содержат корректный marker | PASS |
| EN body content | node verification script | dist/en/welcome: hasPin=true, hasSignIn=true, hasRuWelcome=false. dist/en/index: hasStopWasting=true, hasRuNeSlivai=false | PASS |
| Paddle symmetric | grep dist/en/pay/index.html | cdn.paddle.com/paddle/v2/paddle.js строка 113 | PASS |
| robots.txt /en/* Disallows | node verification script | /en/account=5, /en/success=5, /en/dashboard/=5 | PASS |
| LangSwitcher consumers | node verification script | App.tsx=2, PayPage=1, AccountPage=1, LegalLayout=1; inline switchers=0 | PASS |
| No react-router-dom drift | grep src/ scripts/ | 0 вхождений в src/, 0 в scripts/ | PASS |
| Suspense markers in dist/ | node verification script | <!--$-->...<!--/$--> в dist/index.html и dist/en/welcome/index.html | PASS |
| Paddle NOT on non-pay routes | node verification script | dist/index.html, welcome, privacy, en/index, en/welcome, en/privacy — все без Paddle | PASS |
| INTEGRATION-CONTRACT.md /en/pay | node verification script | 5 вхождений, Last sync 2026-05-16, §3 = 5 строк | PASS |
| Sitemap xhtml:link | node verification script | 12 URL, 36 xhtml:link, xmlns:xhtml объявлен | PASS |
| Git commits из SUMMARY | git show | Все 14 commit-хешей из SUMMARY файлов существуют | PASS |

---

### Probe Execution

Step 7c: SKIPPED (проверяемые поведения не упоминают probe-скриптов; scripts/tests/ не содержит phase-03 probe-файлов).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| GEO-C-1 | Plan 02, 07 | Resolve URL strategy: /ru/*/en/* chosen | SATISFIED | path-prefix /en/* материализован в seo-routes.ts, main.tsx, entry-server.tsx |
| GEO-C-2 | Plan 04, 05, 07 | /en/* siblings for marketing routes, locked routes preserved | SATISFIED | 6 EN siblings в manifest + routers, locked routes (/welcome /pay /success /account /dashboard/download-skill) неизменны |
| GEO-C-3 | Plan 03, 05 | hreflang annotations | SATISFIED | 3-тег triplet в каждом из 12 HTML-файлов; 36 xhtml:link в sitemap.xml |
| GEO-C-4 | Plan 02, 03, 06 | Dynamic <html lang> per route | SATISFIED | <html lang> baked build-time через applyHtmlLang; LangProvider URL-driven через useLocation |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `scripts/prerender.mjs` | 184-185 | ogImage для EN-страниц читается из manifest, но не инъектируется в HTML (намеренно отложено до Phase 4+) | Info | EN HTML-файлы содержат `og-card-ru.png` вместо `og-card-en.png`. Это явно задокументировано в коде как Phase 4+ scope и не является багом фазы 3. |
| `src/i18n/LangContext.tsx` | — | Статический import enFallback из en.json попадает в клиентский бандл (Vite не может tree-shake, т.к. target не constant-fold `typeof window`) | Warning | ~13 KB gzip overhead в main bundle. Задокументировано в 03-06-SUMMARY.md: bundle size до/после = 148.22 KB / 40.39 KB gzip — без изменений (en.json уже был в бандле до фазы 3 через loadEnDict). |

Нет `TBD`, `FIXME`, `XXX` маркеров в файлах, изменённых в этой фазе.

---

### Human Verification Required

#### 1. LangSwitcher — полный цикл навигации

**Test:** `npm run build && npm run preview`. Открыть http://localhost:4173/ в Incognito. Нажать "EN" в Navbar — URL должен стать /en/, контент EN. Нажать "RU" — URL /. Повторить на /welcome → /en/welcome, /pay → /en/pay. На /account нажать "EN" — должен перейти на /en/ (нет EN-sibling для /account). В мобильном меню проверить, что меню закрывается после переключения.

**Expected:** Все 10 шагов из Plan 08 Task 5 зелёные: правильный URL после клика, контент переключается, <html lang> корректен при прямом заходе, 0 hydration warnings.

**Why human:** Playwright-верификацию выполнял оркестратор в рамках фазы (результаты задокументированы в 03-08-SUMMARY.md). Независимая верификация требует запуска preview-сервера, что невозможно в рамках статического code review.

#### 2. Paddle-модальное окно на /en/pay

**Test:** `npm run preview`. Открыть http://localhost:4173/en/pay (или /en/pay/ для vite preview). Нажать кнопку апгрейда/покупки.

**Expected:** Paddle-модальное окно открывается без ошибок в консоли. `window.Paddle` определён до маунта PayPage (синхронный script-тег подтверждён в dist/en/pay/index.html).

**Why human:** Paddle CDN-скрипт загружается только в живом браузере. Статическая проверка подтвердила наличие тега, но реальное поведение (window.Paddle ready, modal opens) требует браузера.

---

### Gaps Summary

Критических пробелов не обнаружено. Все 5 success criteria фазы выполнены, подтверждены кодом и артефактами сборки.

Два пункта требуют человеческой верификации (поведение в браузере), но они были верифицированы оркестратором через Playwright в рамках самой фазы. Независимая верификация через запуск сервера выходит за рамки статического code review.

Одно намеренное расхождение (og:image EN-страниц показывает og-card-ru.png) явно задокументировано в коде как Phase 4+ задача — не является блокером.

---

_Verified: 2026-05-16_
_Verifier: Claude (gsd-verifier)_

---

## Post-release follow-up (2026-05-17)

Two i18n bugs surfaced after the user approved the phase:

1. **Stale `opten_lang` localStorage pinned EN-browser visitors to RU.**
2. **`LangSwitcher` + non-localized `<Link>`s broke language persistence across SPA navigation; the original "switcher routes to `/en/` landing for non-sibling routes" behavior was a UX regression.**

Fixes shipped on `main` as `c789dee` and `bfd164b`. Full bug breakdown,
behavior matrix, and contract-impact analysis in [03-POST-RELEASE.md](03-POST-RELEASE.md).

Phase 3 D-01..D-07 contract preserved; D-07b was refined (localStorage is the
persistence mechanism for no-sibling locked routes).
