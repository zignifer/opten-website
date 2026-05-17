# SEO/GEO Review — Synthesis — opten.space — 2026-05-17

Синтез двух независимых прогонов Codex CLI (`--effort high`) поверх внутреннего GEO-аудита, проведённого тем же утром:

- Baseline: [GEO-AUDIT-2026-05-17.md](GEO-AUDIT-2026-05-17.md) — композитный GEO Score **63/100** (Fair), 5 параллельных GEO-агентов + внутренняя Codex-проверка
- Прогон A: [CODEX-SEO-REVIEW-2026-05-17.md](CODEX-SEO-REVIEW-2026-05-17.md) — классическая SEO-оптика (без GEO-рамки в промпте)
- Прогон B: [CODEX-GEO-REVIEW-2026-05-17.md](CODEX-GEO-REVIEW-2026-05-17.md) — GEO-рамка впрыснута в промпт (citability / crawlers / llms.txt / schema / platform / E-E-A-T / brand authority), композитный **72.6/100**

Цель синтеза — отделить «уже сделано», «согласованные находки» и «уникальные», построить один приоритизированный action plan и отдельно ответить на вопрос **готовности к масштабированию на 100+ keyword-таргетированных страниц**.

---

## TL;DR

1. **Технический фундамент крепкий.** Оба ревьюера независимо подтвердили: prerender, hreflang, robots с 15 AI-краулерами, JSON-LD-граф, font CLS fix, sitemap с git-mtime lastmod, llms.txt + llms-full.txt — всё на месте. Это видно из обоих отчётов и подтверждается утренними коммитами (см. ниже).
2. **Композитный GEO Score вырос с 63 → ~72** после утренних фиксов. Прогон B оценивает текущее состояние в **72.6/100** против baseline 63.0 — рост на +9.6 балла за день. Внешняя Brand Authority всё ещё держит общий счёт (35–40 из 100).
3. **5 проблем нашли оба прогона независимо** (см. раздел «Согласованные находки») — это самые надёжные кандидаты на исправление.
4. **Главный архитектурный риск для масштабирования** — инвентарь роутов размазан по пяти файлам (`scripts/seo-routes.ts`, `src/main.tsx`, `scripts/entry-server.tsx`, `src/i18n/paths.ts`, `scripts/sitemap.mjs`). При росте до 100+ роутов это станет блокером. Оба ревьюера указали на это, но Прогон A сформулировал детальнее.
5. **Top-5 P0** (≤1 дня каждое): noindex/X-Robots на service-routes; стереть/перегенерировать `public/sitemap.xml`-fallback; видимый `<h1>` на `/pay` и `/welcome`; устранить дрейф `43+` vs `60+`; `Disallow: /api/` + CSP-заголовок.
6. **Внешний workstream (Brand Authority)** — Wikipedia/Wikidata, Habr/vc.ru, Product Hunt, LinkedIn, Reddit — оба прогона согласны, что репо это не починит. Это отдельная задача на 2–6 недель, не часть SEO-кода.

---

## Что уже сделано сегодня (2026-05-17)

10 атомарных коммитов после baseline-аудита (`bf02d4f`):

```
3a879fe  refactor(landing): move definitional paragraph from hero to footer
9748e3b  chore(prerender): per-route <meta name=author>
381622a  chore(sitemap): per-route lastmod via git mtime
005cdab  chore(llms): /en/about under ## About + clearer truncated header
45999a9  feat(about): founder email contact alongside Telegram CTA
a4e6122  feat(guide): visible publish/update dates + fix About link gate on EN footer
194c3a1  feat(landing): definitional paragraph under hero + partners disclaimer
6141a0d  perf(fonts): PT Root UI font-display optional + drop preload — fixes mobile CLS
ac0c767  feat(robots): explicit entries for 8 AI crawlers + unified Disallow set
928c6c5  feat(seo): Article + WebPage speakable schemas on landing/about/guides
04d72a3  feat(seo): Person/Org/SoftwareApp/Product schema enrichment + sameAs +YouTube
```

Оба Codex-прогона **явно исключили** эти фиксы из рекомендаций и показывают только дельты — это и было заложено в промпте.

---

## Согласованные находки (оба прогона + internal сходятся)

Самые надёжные кандидаты на работу — нашли независимо как минимум двое ревьюеров.

### S-1. Дрейф «43+» vs «60+» в claims о количестве моделей
- **Плоско:** [scripts/seo-routes.ts:360](../../scripts/seo-routes.ts) ("43+ моделями"), [scripts/seo-routes.ts:223](../../scripts/seo-routes.ts) (Product), [scripts/seo-routes.ts:643](../../scripts/seo-routes.ts) (EN landing)
- **GEO:** [scripts/seo-routes.ts:82](../../scripts/seo-routes.ts) (Organization), [scripts/seo-routes.ts:117](../../scripts/seo-routes.ts) (SoftwareApplication), [src/i18n/ru.json:32](../../src/i18n/ru.json), [src/content/about.tsx:64](../../src/content/about.tsx) — везде "60+"
- **Влияние:** AI-системы (особенно ChatGPT/Perplexity) получают противоречие между schema и body text → понижают confidence. Для SEO — слабый сигнал доверия в snippet.
- **Fix:** выбрать ОДНО число (например, "60+" если это реальное количество skill-файлов в репо расширения), пройтись по всем 8 точкам, желательно вынести в один константный источник.
- **Effort:** 30–60 минут.

### S-2. `public/sitemap.xml` устарел (6 URL вместо 16)
- **Плоско:** [public/sitemap.xml:3](../../public/sitemap.xml) — fallback на 6 RU-роутов, без `lastmod`, без hreflang. `scripts/sitemap.mjs:31` гарантирует ≥16 в `dist/sitemap.xml`, но `public/` fallback может уехать в продакшен при сломанном postbuild.
- **GEO:** косвенно — отмечает llms.txt scaling, но саму проблему public/sitemap.xml не поднимает.
- **Internal:** не отмечал (baseline аудит делался до этих коммитов).
- **Fix:** либо удалить `public/sitemap.xml` (Vite скопирует его в dist, потом sitemap.mjs всё равно перезапишет — но удаление чище), либо обновить fallback до 16 роутов.
- **Effort:** 30 минут.

### S-3. Schema-архетипы и `/guides` hub нужны до масштабирования
- **Плоско:** [scripts/seo-routes.ts:349](../../scripts/seo-routes.ts) — единый routes array, [scripts/seo-routes.ts:620](../../scripts/seo-routes.ts) — breadcrumbs специально избегают несуществующий `/guides`.
- **GEO:** "Define archetypes: `LandingPage`, `PricingPage`, `AboutPage`, `LegalPage`, `GuideArticle`, `GuideHub`, `ComparisonPage`, `ChangelogPage`". Добавить `CollectionPage`/`ItemList` для `/guides` до публикации второго гайда.
- **Fix:** перед публикацией 2-го гайда — `/guides` (RU) + `/en/guides` (EN) с `CollectionPage` + `ItemList` schema, затем шаблонизация под guide / comparison / category / changelog архетипы.
- **Effort:** 1–2 дня (hub) + 3–5 дней (архетипы).

### S-4. Инвентарь роутов размазан по 5 источникам
- **Плоско** (детальнее): [scripts/seo-routes.ts:349](../../scripts/seo-routes.ts) + [src/main.tsx:54](../../src/main.tsx) + [scripts/entry-server.tsx:31](../../scripts/entry-server.tsx) + [src/i18n/paths.ts:9](../../src/i18n/paths.ts) + [scripts/sitemap.mjs:42](../../scripts/sitemap.mjs) (PATH_TO_SOURCE) + [scripts/llms.mjs:30](../../scripts/llms.mjs) — шесть точек, которые нужно держать синхронно вручную.
- **GEO:** косвенно — предлагает archetype builders, но не выделяет route-inventory отдельно.
- **Fix:** ввести `RouteRecord` (slug, localeGroupId, sourceFile, archetype, schema-inputs) и сгенерированный `seo-routes.generated.ts`, переписать пять консьюмеров поверх одного источника.
- **Effort:** 3–5 дней (под первое семейство страниц).

### S-5. `aggregateRating` захардкожен (5.0 / 2 отзыва) и должен мэтчить Chrome Web Store
- **Плоско** (не отдельным P0, упоминается в notes).
- **GEO** (P0): [scripts/seo-routes.ts:125](../../scripts/seo-routes.ts), [scripts/seo-routes.ts:230](../../scripts/seo-routes.ts) — если live CWS не показывает ровно 5/2, schema утрачивает доверие и могут быть structured-data warnings в GSC.
- **Fix:** проверить live CWS листинг → либо обновить значения, либо удалить `aggregateRating` до накопления честного объёма отзывов.
- **Effort:** 15 минут (проверка + decision) + 10 минут (правка).

---

## Уникально у Прогона A (классический SEO)

Находки, которые проявились именно при «обычном SEO-взгляде» — GEO-рамка их пропустила.

### A-1. Нет видимого `<h1>` на `/pay` и `/welcome`
- [src/app/pages/PayPage.tsx:417](../../src/app/pages/PayPage.tsx), [src/app/pages/WelcomePage.tsx:53](../../src/app/pages/WelcomePage.tsx) — обе страницы full-prerendered и indexable, но H1 отсутствует. На pricing-page есть `<p>`/`<span>` с заголовком, на welcome — карусель без заголовка.
- **Fix:** добавить лаконичный `<h1>` в обе страницы без переименования путей (`/pay` и `/welcome` залочены интеграционным контрактом).
- **Effort:** 1–2 часа.

### A-2. `Disallow: /api/` отсутствует в robots.txt
- [public/robots.txt:1](../../public/robots.txt) — нет блокировки `/api/`, хотя `/api/download-skill` — auth-gated ZIP endpoint ([api/download-skill.ts:36](../../api/download-skill.ts)).
- **Fix:** добавить `Disallow: /api/` в wildcard блок (и/или per-bot).
- **Effort:** 20 минут.

### A-3. Нет `X-Robots-Tag: noindex` для SPA-only роутов
- [src/main.tsx:56-64](../../src/main.tsx) (`/account`, `/success`, `/dashboard/download-skill`) — клиентские, без SSR. Глобальный rewrite ([vercel.json:2](../../vercel.json)) отдаёт пререндеренный root HTML до гидрации → не-JS краулер увидит корневую meta.
- **Fix:** в `vercel.json` headers добавить `X-Robots-Tag: noindex, nofollow` для `/account*`, `/success*`, `/dashboard/*`, `/api/*`.
- **Effort:** 1–2 часа (включая верификацию).

### A-4. Документация устарела по числу роутов
- [CLAUDE.md:65](../../CLAUDE.md) и [docs/ARCHITECTURE.md:101](../../docs/ARCHITECTURE.md) описывают «14 routes / 6 EN siblings», в реальности **16 / 8** после Phase 4.1. [src/i18n/paths.ts:2](../../src/i18n/paths.ts) тоже говорит «6 routes» в комментарии.
- **Fix:** одноразовый sweep по docs + комментариям.
- **Effort:** 30 минут.

### A-5. Нет catch-all 404-роута
- [src/main.tsx:53-74](../../src/main.tsx) — `<Routes>` без `path="*"`. Vercel rewrite ([vercel.json:2](../../vercel.json)) шлёт ВСЕ unknown paths в SPA → soft-404 (200 OK + landing-like content).
- **Fix:** добавить `<Route path="*" element={<NotFound/>}/>` + соответствующий компонент с 410 или явным 404 текстом и meta noindex.
- **Effort:** 0.5–1 день.

### A-6. Hreflang locale code policy не зафиксирована
- [scripts/prerender.mjs:55](../../scripts/prerender.mjs) использует `ru` / `en` в hreflang, [scripts/seo-routes.ts:377](../../scripts/seo-routes.ts) — `ru-RU` / `en-US` в schema. Оба валидны, но непоследовательны.
- **Fix:** выбрать одно (рекомендация — оставить hreflang language-only `ru`/`en` как самый широкий targeting, schema оставить region-specific).
- **Effort:** 2–3 часа (документировать + проверить генераторы).

### A-7. Welcome-карусель: 4 одинаковых `alt="Opten extension"`
- [src/app/pages/WelcomePage.tsx:56-63](../../src/app/pages/WelcomePage.tsx) — 4 PNG eagerly-loaded с идентичным alt. Плюс LCP/network outlier из-за eager-loading.
- **Fix:** уникальные descriptive alt-ы для каждого слайда, либо decorative `alt=""` для неактивных + `loading="lazy"`.
- **Effort:** 1–2 часа.

---

## Уникально у Прогона B (с GEO-рамкой)

Находки, которые проявились благодаря GEO-оптике — классический SEO бы их пропустил.

### B-1. Нет CSP-заголовка в Vercel headers
- [vercel.json:7-12](../../vercel.json) содержит только `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`. CSP отсутствует.
- **Влияние:** для E-E-A-T Trustworthiness и платформенной аналитики (security headers — один из сигналов).
- **Fix:** CSP-политика совместимая с Paddle (`*.paddle.com`), Supabase (`*.supabase.co`), inline JSON-LD, fonts/images. Аккуратно — может сломать extension messaging и Paddle.
- **Effort:** 1 день (включая тест на dev + preview).

### B-2. `llms-full.txt` имеет 50KB cap и при превышении выкидывает legal-страницы
- [scripts/llms.mjs:145-157](../../scripts/llms.mjs) — захардкожен лимит и логика drop-priority. При 100+ роутах легко проскочит.
- **Fix:** перейти на секционные файлы (`/llms/marketing.txt`, `/llms/guides.txt`, `/llms/legal.txt`), `llms.txt` оставить как индекс.
- **Effort:** 1 день.

### B-3. Definitional абзац ниже main content fold
- [src/app/App.tsx:509](../../src/app/App.tsx) — definitional paragraph после CTA, не рядом с H1. Утренний refactor (`3a879fe`) намеренно убрал его из hero в footer; GEO-рамка считает это субоптимальным для AI extraction (citability AI системы предпочитают ответ в первых 40–60 словах).
- **Note:** это рекомендация ПРОТИВ только что принятого решения. Обсудить — если хочется максимизировать AI-citability, definition должна быть выше; если приоритет CTR/конверсия landing — текущее решение может быть лучше.
- **Fix (опционально):** микро-абзац под H1 в hero + полный definitional абзац в footer.
- **Effort:** 2–4 часа + A/B.

### B-4. `VideoObject` не привязан, хотя founder YouTube — часть authority
- [scripts/seo-routes.ts:60](../../scripts/seo-routes.ts), [src/content/about.tsx:119](../../src/content/about.tsx) — канал упомянут в Person.sameAs и в About копии, но конкретные видео не оформлены как `VideoObject`.
- **Note:** прогон B сам же отмечает: добавлять только когда конкретное видео встроено или ссылается со страницы. Не «глобально», иначе schema spam.
- **Fix (когда появится встроенное видео):** добавить `VideoObject` для соответствующих страниц.
- **Effort:** 2–3 часа (для одной страницы).

### B-5. Founder image deferred → Person.image отсутствует
- [scripts/seo-routes.ts:164](../../scripts/seo-routes.ts) — `image: undefined` в PERSON_FOUNDER_BLOCK; [src/app/pages/AboutPage.tsx:35](../../src/app/pages/AboutPage.tsx) использует initials placeholder.
- **Влияние:** Knowledge Panel-готовность Gemini хуже без founder photo.
- **Fix:** оптимизированный аватар (WebP, 400×400, <50KB) → `Person.image` + видимый аватар на /about.
- **Effort:** 2 часа.

### B-6. Bing Webmaster + IndexNow не настроены
- [scripts/sitemap.mjs:99](../../scripts/sitemap.mjs) — только sitemap.xml пишется, без IndexNow ping.
- **Влияние:** Copilot platform-readiness ~62/100. Bing — единственный путь в Copilot.
- **Fix:** Bing Webmaster verification + добавить шаг `IndexNow` post-build (HTTP POST на `api.indexnow.org` со списком URL). Ключ генерируется один раз.
- **Effort:** 0.5 дня.

### B-7. Citability build-gate отсутствует
- Сейчас [package.json:7](../../package.json) запускает FAQ-parity verification. Нет лина «новая страница ≥60 баллов citability».
- **Note:** это самая «дорогая» рекомендация, но и самый сильный multiplier при масштабировании на 100+ страниц.
- **Fix:** при добавлении archetype builders — добавить citability-lint: H1 присутствует, answer block 40–80 слов в первой секции, byline + datePublished связаны с visible `<time>`, ≥1 FAQ или steps-list, speakable selector соответствует существующему DOM-узлу.
- **Effort:** 1–2 дня.

---

## Конфликты / противоречия

### C-1. Definitional paragraph: hero vs footer
Утренний коммит `3a879fe` намеренно убрал definitional абзац из hero в footer. **Прогон B** считает это потерей citability (см. B-3). **Прогон A** не возражает.
**Резолюция:** оставить решение пользователю. Если оптимизируем под AI search (ChatGPT/Perplexity цитируют первые 40–60 слов) — вернуть в hero. Если оптимизируем CTR на CTA — оставить как есть.

### C-2. Брать `43+` или `60+` как канон
Внутри сайта есть оба числа в разных местах. Какое из них «правда»? Прогон B предлагает: «pick one canonical or use 40+ for pricing and 60 skill files only where literally true». Уточнить с продуктом перед фиксом S-1.

### C-3. Mobile LCP/CLS статус
Internal baseline (на момент 2026-05-17 утром) фиксировал LCP 3.5s + CLS 0.129 на RU. Коммит `6141a0d` (PT Root UI font-display: optional + drop preload) предположительно фиксит CLS. Прогон B пишет: «no live CWV data was collected; appears addressed in source but needs production confirmation». Перемерять после деплоя через PageSpeed Insights, не править код спекулятивно.

---

## Готовность к масштабу — 100+ keyword-таргетированных страниц

Раздельные ответы на 4 вопроса пользователя. **Все четыре пункта оба прогона признают НЕ-готовыми** в текущем виде; нужен подготовительный refactor перед публикацией страниц.

### 1. Программная генерация роутов из данных

**Сейчас:** инвентарь захардкожен в 6 источниках (см. S-4). Любое добавление страницы = 6 правок в 6 файлах.

**Минимальный refactor:**
- Завести `src/content/<archetype>/*.ts` (или MDX) с типизированным контентом + frontmatter.
- Ввести `RouteRecord` type: `{ slug, localeGroupId, archetype, sourceFile, schemaInputs }`.
- Написать `scripts/build-route-meta.mjs` — читает content модули, эмитит `scripts/seo-routes.generated.ts` с `RouteMeta[]`.
- В [src/main.tsx](../../src/main.tsx) — один dynamic route `<Route path="/:archetype/:slug" element={<ArchetypePage/>}/>` который маршрутизирует по типу.
- В [scripts/entry-server.tsx](../../scripts/entry-server.tsx) — итерация по generated records.
- Заменить [scripts/sitemap.mjs:42](../../scripts/sitemap.mjs) `PATH_TO_SOURCE` на поле в RouteRecord.

**Effort:** 3–5 дней для первого archetype, затем добавление страницы = 1 файл данных. **Без этого refactor добавление 100+ страниц нереально.**

### 2. Шаблоны контента и JSON-LD

**Существующие фабрики:** `productBlock`, `articleBlock`, `faqPageBlock`, `breadcrumbBlock`, `webPageBlock`, `howToBlock` — покрывают guide / pricing / FAQ.

**Не хватает:**
- `CollectionPage` + `ItemList` для hub-страниц (`/guides`, `/compare`)
- `VideoObject` для guide-ов с встроенным видео
- archetype-builder: `buildArchetype('guide-article', record)` → возвращает `{ meta, schema }` целиком из RouteRecord

**Validation gate:** build-time проверка, что для каждого archetype присутствуют обязательные schema-блоки + видимые DOM-узлы (selectors из `speakable.cssSelector`).

**Effort:** 3–5 дней (после route-refactor).

### 3. Риски дубликатов и каннибализации

**Текущая архитектура НЕ блокирует** ни один из этих сценариев:
- Два роута с одинаковым `primaryKeyword` (нет поля)
- Два роута с почти идентичным `title`/`description` (нет проверки)
- Каннибализация RU vs EN перевод vs RU вариант (нет `localeGroupId`)
- Тонкий контент (нет word-count gate)

**Минимальные guardrails:**
- Добавить в RouteRecord: `primaryKeyword`, `secondaryKeywords[]`, `localeGroupId`, `wordCount` (computed).
- Build-time gate: дубликаты `primaryKeyword` в одной локали = error; `wordCount < 300` для индексируемой страницы = warning; missing reciprocal locale pair = error.
- Для overlapping intents — canonical на сильнейшую страницу через `canonical` поле (оно уже есть в RouteMeta).

**Effort:** 1–2 дня после route-refactor.

### 4. Внутренняя перелинковка и hreflang в масштабе

**Сейчас:**
- Hreflang — O(2 alternates) на роут, growth — линейный, не O(n²) (Прогон A это отдельно подтвердил).
- Sitemap — один `<urlset>`, 16 URL. Лимит протокола — 50000 URL / 50MB на файл, до этого ещё далеко, но **операционно** при 100+ страниц лучше шардировать по архетипу/локали.
- llms-full.txt — 50KB cap, при превышении legal pages дропаются (B-2).
- Внутренние ссылки — захардкожены в footer/nav компонентах ([src/app/App.tsx:511](../../src/app/App.tsx), [src/app/pages/GuidePage.tsx:133](../../src/app/pages/GuidePage.tsx)).

**Что нужно:**
- Generated related-links: `RelatedLinks` компонент берёт `localeGroupId` + `archetype` + `tags` из RouteRecord и рендерит блок ссылок автоматически (через build-time computed graph).
- Sitemap index: `/sitemap.xml` указывает на `/sitemap-marketing.xml`, `/sitemap-guides.xml`, `/sitemap-legal.xml` — реализация в `scripts/sitemap.mjs` тривиальна когда RouteRecord готов.
- llms split: `/llms.txt` — index, `/llms/<archetype>.txt` — body.

**Effort:** 2–3 дня.

---

## Приоритизированный action plan

### P0 — ≤1 день каждое, можно делать прямо сейчас

| # | Действие | Файлы | Источник | Effort |
|---|---|---|---|---|
| P0-1 | Устранить дрейф `43+` vs `60+` по 8 точкам — выбрать одно число | [scripts/seo-routes.ts:82,117,223,360,643](../../scripts/seo-routes.ts), [src/content/about.tsx:64](../../src/content/about.tsx), [src/i18n/ru.json:32](../../src/i18n/ru.json), [src/i18n/en.json:32](../../src/i18n/en.json) | S-1 (оба) | 30–60 мин |
| P0-2 | Удалить или обновить устаревший `public/sitemap.xml` fallback | [public/sitemap.xml](../../public/sitemap.xml) | S-2 (A) | 30 мин |
| P0-3 | Добавить `<h1>` на `/pay` и `/welcome` (без переименования путей — они залочены) | [src/app/pages/PayPage.tsx:417](../../src/app/pages/PayPage.tsx), [src/app/pages/WelcomePage.tsx:53](../../src/app/pages/WelcomePage.tsx) | A-1 | 1–2 часа |
| P0-4 | `Disallow: /api/` в robots.txt + `X-Robots-Tag: noindex` для `/account*`, `/success*`, `/dashboard/*`, `/api/*` в vercel.json | [public/robots.txt](../../public/robots.txt), [vercel.json](../../vercel.json) | A-2, A-3 | 1–2 часа |
| P0-5 | Проверить live Chrome Web Store rating/reviews → либо обновить, либо удалить `aggregateRating` | [scripts/seo-routes.ts:125,230](../../scripts/seo-routes.ts) | S-5 (B) | 30 мин |

### P1 — 1–3 дня каждое, в течение недели

| # | Действие | Источник | Effort |
|---|---|---|---|
| P1-1 | Добавить catch-all 404-роут + meta noindex + страница 404 | A-5 | 0.5–1 день |
| P1-2 | CSP-заголовок в vercel.json (Paddle + Supabase compat) | B-1 | 1 день |
| P1-3 | Зафиксировать hreflang locale policy (`ru`/`en` или `ru-RU`/`en-US`) + sweep по docs | A-6 | 2–3 часа |
| P1-4 | Bing Webmaster verification + IndexNow на post-build | B-6 | 0.5 дня |
| P1-5 | Уникальные alt-ы для welcome carousel + lazy-loading неактивных слайдов | A-7 | 1–2 часа |
| P1-6 | Founder image asset → `Person.image` + видимый аватар на /about | B-5 | 2 часа |
| P1-7 | Sweep устаревшей документации (CLAUDE.md, docs/ARCHITECTURE.md, src/i18n/paths.ts комментарий) | A-4 | 30 мин |

### P2 — стратегические, перед масштабированием

| # | Действие | Источник | Effort |
|---|---|---|---|
| P2-1 | Route-refactor: RouteRecord + generated seo-routes + один источник правды | S-4 | 3–5 дней |
| P2-2 | Schema archetype builders (LandingPage, PricingPage, GuideArticle, GuideHub, ComparisonPage, ...) | S-3, B-7 | 3–5 дней (после P2-1) |
| P2-3 | `/guides` hub + `CollectionPage`/`ItemList` schema | S-3 | 1–2 дня |
| P2-4 | Build-time citability + duplicate gate (H1, answer block, primaryKeyword uniqueness, wordCount) | B-7 + GTS-3 | 1–2 дня |
| P2-5 | Sitemap index + sharded llms (marketing/guides/legal) | B-2 + GTS-4 | 1–2 дня |
| P2-6 | Generated related-links компонент для внутренней перелинковки | GTS-4 | 2–3 дня |

### Conflicts / requires decision

| # | Действие | Источник |
|---|---|---|
| D-1 | Definitional paragraph: вернуть в hero (для AI citability) или оставить в footer (для CTR) | C-1 |
| D-2 | Канон количества моделей: `43+` или `60+`? | C-2 |
| D-3 | Hreflang policy: language-only (`ru`/`en`) или regional (`ru-RU`/`en-US`)? | A-6 |

---

## Внешний workstream (Brand Authority)

Эти задачи **не решаются в репо**. Оба прогона признают, что Brand Authority 35/100 (B) → 18/100 (internal baseline) — главный ограничитель композитного GEO Score и требует off-site работы на 2–6 недель.

| Задача | Цель | Ожидаемый lift |
|---|---|---|
| Wikidata item «Opten (Chrome extension)» | Entity disambiguation от других «Opten» брендов | +6–10 |
| 2–3 long-form поста на Habr / vc.ru / Medium-like | External corroboration founder expertise | +5–8 |
| Product Hunt + AI directory listings (There Is An AI For That, Futurepedia, Toolify) | Third-party entity anchors | +4–7 |
| LinkedIn company + founder profile (когда профиль готов) | sameAs business graph signals | +2–4 |
| Reddit / HN seeding non-promotional examples | Perplexity citation surface | +3–6 |
| Стабилизация Chrome Web Store рейтинга (получить честные 10+ отзывов) | aggregateRating schema trust + сам рейтинг как ranking signal | +2–4 |
| (Опц.) Wikipedia entry (требует ≥3 независимых RS источников) | ChatGPT/Gemini Knowledge Panel | +4–8 |

Все эти задачи в одну очередь не помещаются — выбрать 2–3 приоритетные, метрика «появилась ссылка X через Y дней».

---

## Заметки / caveats

- Оба Codex-прогона **не запускали build** и не делали live web fetch. Все претензии к `dist/sitemap.xml`, `dist/llms.txt` и live HTML — проверяются только после деплоя через PageSpeed Insights / Rich Results Test / прямой `curl`.
- Mobile LCP/CLS (internal baseline указывает на проблему) — нужно перемерять после деплоя коммита `6141a0d` (font fix). Не вносить изменений в код спекулятивно.
- Codex-прогон A корректно отметил, что Paddle.js sync-loading на `/pay` — часть интеграционного контракта (нельзя async-grade «оптимизировать»). Прогон B это уважил.
- Расхождение Brand Authority 18 (internal) vs 35 (B) объясняется методикой: internal baseline учитывал внешнее присутствие (Wikipedia/Reddit/Habr), Codex GEO смотрел только то, что видно в репо (sameAs, founder bio, links) — отсюда более оптимистичная оценка.
