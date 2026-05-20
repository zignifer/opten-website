# Полный аудит opten.space — синтез (2026-05-20)

Дата: 2026-05-20 · URL: https://opten.space · Тип: SaaS / расширение Chrome
(маркетинговый сайт продукта Opten)

Пять параллельных проверок: (1) GEO-SEO аудит (5 спец-агентов), (2) независимый
SEO-анализ через Codex CLI, (3) сравнение GEO vs Codex + вердикт, (4) PageSpeed,
(5) безопасность. Codex анализировал **только код репозитория**; GEO-агенты —
**живой сайт + off-site сигналы**. Это и есть причина расхождений ниже.

---

## 1. GEO-SEO аудит — композитный балл **69 / 100 (Fair)**

| Категория | Балл | Вес | Взвешенно |
|---|---|---|---|
| AI Citability (цитируемость) | 79 | 25% | 19.75 |
| Brand Authority (узнаваемость бренда) | **22** | 20% | 4.40 |
| Content E-E-A-T | 78 | 20% | 15.60 |
| Technical GEO | 89 | 15% | 13.35 |
| Schema / структурированные данные | 88 | 10% | 8.80 |
| Platform Optimization | 74 | 10% | 7.40 |
| **Итого** | | | **69.3 / 100** |

**Главный вывод:** техническая база, schema и контент — на уровне 78–89
(отлично). Весь балл вниз тянет **Brand Authority = 22** — off-site сигналы
(Wikipedia/Wikidata, Reddit, Product Hunt, отзывы) почти отсутствуют. Сайт
технически готов к цитированию ИИ, но ИИ ещё «не знает» бренд как сущность.

### Находки по категориям

**AI Citability 79** — страницы моделей = «золото для цитат» (самодостаточные
определения + спец-таблицы + числовые факты). Главная имеет чёткий
определяющий блок. Минусы: блог = 1 пост (мало топик-авторитета);
расхождение «43 модели» vs «60+ моделей» по сайту (флаг фактической связности).

**Brand Authority 22 (HIGH-проблема)** — нет статьи в Wikipedia, нет Wikidata,
ноль на Reddit / G2 / Product Hunt / Capterra. Имя «Opten» неоднозначное
(пересекается с другими сущностями). Аудитория основателя (YouTube ~4.5k,
~7M просмотров/год) привязана к личному бренду, не к продукту.

**Content E-E-A-T 78** — Trustworthiness 24/25 (реальное юр. лицо ИП, INN,
Paddle MoR, прозрачные цены, юр. страницы, контакты). Программные 62 страницы
моделей — НЕ thin-content (sora-2 ≈ 3200 слов, уникальные before/after, FAQ,
дата «Обновлено»). Риски: одинаковый скелет секций (возможный near-duplicate
при перефразе вместо реальной дифференциации) и отсутствие author byline /
Person-schema на страницах моделей (авторитет основателя не передаётся).

**Technical GEO 89 (Excellent)** — 144 prerendered route, реальный SSR-DOM
(не пустой SPA-shell), canonical/OG/hreflang/5 JSON-LD блоков в `<head>`.
robots.txt разрешает всех AI-краулеров + Content-Signal. Слабое место —
**mobile LCP 5.6s** (см. §4). lastmod у всех URL одинаковый (= дата сборки).

**Schema 88 (Excellent)** — граф сущностей связан через `@id`
(`#org`, `#person-founder`, `#software-app`), Organization/WebSite/
SoftwareApplication/FAQPage/Person/Article/ItemList/BreadcrumbList/Offer,
speakable на каждой WebPage. Баги: **мохибейк (битый символ) в `sameAs` URL
Chrome Web Store** (HIGH — рвёт связь с каноничным листингом продукта),
тонкий `sameAs` (нет Wikidata/LinkedIn), устаревший `HowTo` на блог-посте.

**Platform Optimization 74** — лучшая готовность к Bing Copilot (80) и Google
AI Overviews (80); ChatGPT/Perplexity/Gemini держит вниз отсутствие entity
grounding (нет `sameAs`-расширения, нет Wikidata, ноль community-следа).
**RU-фактор:** для русскоязычной аудитории самый высокий ROI — ChatGPT и
Perplexity (хорошо показывают RU-контент, Perplexity любит Telegram/Reddit);
Google AIO/Gemini для RU-запросов слабее (доминирует Яндекс — YandexBot
разрешён, это плюс).

---

## 2. Независимый SEO-анализ (Codex CLI, без GEO-фреймворка)

Codex читал исходники и dist/, выдал находки с file:line.

- **[HIGH] Soft-404.** Catch-all rewrite в `vercel.json:8-9` отдаёт неизвестные
  URL как `index.html` с HTTP **200**; `noindex` ставится только после JS-рендера
  `NotFound`. Не-рендерящие краулеры видят soft-404 с дублем главной. ← ключевая
  находка, которую GEO-агенты не поймали (URL-краул не лезет в catch-all логику).
- **[MED] RU в EN JSON-LD.** На EN-страницах `Organization.description` и
  кириллические юр-поля остаются русскими (`scripts/seo-routes.ts:87-99`,
  `dist/en/index.html`).
- **[MED] Pricing schema неполный.** В schema только месячные офферы
  (199₽ / $2.99), а на `/pay` видны ещё разовые (299₽ / $4.99) →
  риск отклонения Product rich-result (`seo-routes.ts:697-703, 1043-1049`).
- **[MED] Bing-верификация — заглушка** `BING_VERIFICATION_TOKEN_TODO`
  в `index.html:14-20` → Bing Webmaster не подтверждён.
- **[MED] 11 скрытых моделей** (HUB_HIDDEN_SLUGS) — возможны orphan-страницы
  без входящих ссылок.
- **[MED] Пустой `alt=""`** на скриншотах продукта (`App.tsx:241, 311-316`).
- **[LOW]** `og:type` всегда `website`; нет `<main>` на лендинге;
  hreflang/sitemap/prerender — корректны.

---

## 3. Сравнение GEO vs Codex + вердикт

### Где совпали (высокая уверенность — чинить в первую очередь)
- **Bing-верификация сломана** — Codex: точная заглушка `..._TODO`;
  GEO-platform: «msvalidate.01 не подтверждается». Лёгкий фикс.
- **Языковая проблема в schema на EN** — Codex: RU description в EN JSON-LD;
  GEO-schema: битый `sameAs` URL. Разные баги, **один источник —
  `scripts/seo-routes.ts`**, нужен один проход чистки.
- **Schema и SSR/prerender — сильные** (обе стороны хвалят).
- **`sameAs` / entity grounding тонкий** (GEO platform+schema; Codex видит
  широкую schema, но off-site — зона GEO).

### Где разошлись (именно поэтому полезно было гонять оба)
- **Только Codex (взгляд из кода):** soft-404 HTTP 200 (HIGH), неполный pricing
  schema, пустые alt, нет `<main>`, orphan-риск скрытых моделей. Это видно лишь
  при чтении исходников.
- **Только GEO (off-site + perf + AI-линза):** Brand Authority 22 (нет
  Wikipedia/Reddit/Product Hunt) — **стратегически главная слабость**, её Codex
  структурно не видит; mobile LCP 5.6s; битый `sameAs`; устаревший HowTo;
  «43 vs 60 моделей».

### Конфликт, требующий проверки
- **HSTS:** security-агент (читал `vercel.json`) — «HSTS отсутствует, LOW»;
  technical-агент (читал ЖИВЫЕ заголовки) — «HSTS присутствует,
  `max-age=63072000`». Истина по живому замеру: **HSTS есть**, но без
  `includeSubDomains; preload`. Стоит сверить, откуда он берётся (vercel.json
  vs настройка проекта Vercel).

### Вердикт
Два инструмента **дополняют, а не противоречат** друг другу:
- **Codex = правда о коде** — точные file:line, нашёл реальный HIGH-баг
  (soft-404), недоступный URL-краулу GEO.
- **GEO = правда о видимости** — off-site авторитет, AI-платформы,
  производительность; нашёл стратегический потолок (узнаваемость бренда),
  который и определяет, будет ли ИИ реально цитировать сайт.

Сайт **технически отличный (база 88–89), но «невидим» как сущность для ИИ**.
Балл 69 = «Fair» держится низким Brand Authority. Порядок работ: сначала
дешёвые on-site фиксы (Bing, soft-404, schema-язык, pricing, alt), затем
долгий, но решающий off-site трек (Wikidata, Product Hunt, Reddit/Telegram,
`sameAs`).

---

## 4. Скорость (PageSpeed / Lighthouse, lab)

| | Performance | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|
| **Desktop** | **98** | 0.8s | 1.0s | 0.033 | 0ms |
| **Mobile** | **67** | 4.4s | **5.6s** | 0 | 0ms |

- **Desktop — отлично, трогать нечего.**
- **Mobile — единственная зона роста.** CLS=0 и TBT=0 (prerender работает),
  значит дело **не** в вёрстке/интерактивности, а в **скорости первой
  отрисовки** под мобильным throttle: тяжёлая доставка ресурсов (шрифты,
  стартовый JS/hero) блокирует LCP.
- Lighthouse-«opportunities» (minify CSS/JS, unused CSS/JS) имели score=1, т.е.
  **пройдены** — это не реальные проблемы, а ложный сигнал.
- **Что улучшить (mobile LCP 5.6s → <2.5s):** preload LCP-ресурса
  (hero/первый экран) с `fetchpriority="high"`; шрифты — `font-display:swap` +
  preload/subset; убедиться, что LCP — это текст, а не поздно грузящийся
  hero-анимация; при возможности отложить несрочный стартовый JS.
- Это **lab-данные** (эмулированный 4G). Реальные пользователи (CrUX/field)
  могут видеть лучше — стоит свериться с полевыми данными перед оптимизацией.

---

## 5. Безопасность — **чисто, критичных дыр нет**

- **api/download-skill.ts (единственный сервер-эндпоинт):** JWT проверяется
  по-настоящему (через Supabase `/auth/v1/user`, не trust-decode); Pro-gating
  на сервере, не обходится; **path traversal невозможен** (путь к `opten.zip`
  захардкожен, нет ввода пользователя); CORS заперт на `https://opten.space`;
  нет инъекций/SSRF.
- **Секреты не утекают:** в клиент попадает только публичный `SUPABASE_ANON_KEY`
  (by design). Service-role/Paddle-private/YooKassa-секретов в репо нет;
  `.env` в gitignore.
- **XSS:** все `dangerouslySetInnerHTML` — статические i18n-строки разработчика;
  JSON-LD экранируется (`escapeJsonLd` в prerender.mjs). Чисто.
- **Заголовки:** есть nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy,
  Permissions-Policy, X-Robots-Tag noindex на /account /success /dashboard /api,
  HSTS (по живому замеру). **Рекомендации:** добавить **Content-Security-Policy**
  (MED — главный пробел, особенно для /pay с Paddle) и `includeSubDomains;
  preload` к HSTS (LOW).
- **LOW:** ошибка 500 в download-skill отдаёт абсолютный путь `ZIP_PATH`
  (убрать из ответа клиенту); JWT из `#token=` в URL-хэше — допустимый
  handoff от расширения (хэш не уходит на сервер и стирается).

---

## Сводный список приоритетов

**Дёшево и быстро (эта неделя):**
1. Заменить `BING_VERIFICATION_TOKEN_TODO` реальным токеном (или убрать мету).
2. Починить soft-404: отдавать 404/`X-Robots-Tag: noindex` для неизвестных URL
   на уровне Vercel, не только runtime JS.
3. Чистка schema в `seo-routes.ts`: EN-описание Organization на английском +
   починить битый `sameAs` URL Chrome Web Store.
4. Добавить в pricing schema разовые офферы (299₽ / $4.99).
5. Проставить осмысленные `alt` на скриншотах продукта; обернуть лендинг в `<main>`.
6. Унифицировать «43 vs 60+ моделей» по всему сайту.

**Средний приоритет (этот месяц):**
7. Content-Security-Policy + HSTS `includeSubDomains; preload`.
8. Author byline + Person-schema на страницах моделей и блога.
9. Mobile LCP: preload hero + `font-display:swap` (сверить с CrUX).
10. Расширить `sameAs` (Wikidata, Telegram, Chrome Store, LinkedIn основателя).

**Долго, но решает потолок (Brand Authority 22):**
11. Создать Wikidata-сущность «Opten» (instance of: browser extension).
12. Листинг на Product Hunt; следы в Reddit/Telegram (посты-сравнения моделей
    со ссылками на страницы моделей) — это топ-ROI для ChatGPT/Perplexity на RU.
13. Нарастить блог (сейчас 1 пост) для топик-авторитета.

---
*Источники: 5 GEO-субагентов (citability/brand, platform, technical, content,
schema), Codex CLI 0.130.0 (анализ репозитория), PageSpeed Insights (mobile+
desktop), security-аудит репозитория. Codex — только код; GEO — живой сайт +
off-site.*
