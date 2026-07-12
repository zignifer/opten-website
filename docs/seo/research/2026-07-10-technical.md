# Technical GEO/SEO Audit — opten.space

> [!note] Статус: стартовый ресёрч
> Исходный специализированный аудит. Используется как доказательная база, но
> не как самостоятельный план реализации. Актуальные приоритеты находятся в
> [[../SEO-GROWTH-PLAN|каноническом SEO Growth Plan]].

> [!warning] Исправление продуктового статуса от 11.07.2026
> Курс `ai-content-marketing-2026` официально запущен и намеренно продвигается
> через public Learn, статьи, Telegram и другие поверхности. Выводы ниже о
> необходимости убрать ссылки «до запуска» устарели. Нулевой урок открывается
> гостю после проверки подписки на Telegram; уроки 1+ требуют покупки курса.

**Дата проверки:** 2026-07-10  
**Режим:** только чтение, live-сайт + локальный репозиторий `opten-website` (`main`, `e509ae4`)  
**Охват:** 33 уникальных live-URL/ресурса, не более 50; пауза между серийными запросами 250–300 мс; выборка публичных, языковых, закрытых и legacy-шаблонов.

## Technical Score: 77/100

Сайт технически устойчив и хорошо подготовлен к обычному поиску и GEO: публичный контент пререндерен, AI-краулеры разрешены, sitemap/hreflang корректны, HTTPS и базовые security headers работают. Основные потери баллов — внутренняя обнаруживаемость части контента, legacy-редиректы через JavaScript, вес автоматически загружаемого видео и отсутствие свежих полевых CWV.

> Балл Core Web Vitals предварительный: свежий PageSpeed API вернул `429 quota exceeded`, а доступных актуальных CrUX/field-данных в этой проверке не было. Lab и field ниже явно разделены.

## Score Breakdown

| Категория | Балл | Статус | Основание |
|---|---:|---|---|
| Crawlability | 13/15 | Pass | robots и sitemap исправны; часть индексируемых URL не связана с хабами обычными HTML-ссылками |
| Indexability | 8/12 | Warn | canonical/hreflang хороши; пагинация и пересечение `Disallow` + `noindex` требуют исправления |
| Security | 9/10 | Pass | HTTPS/HSTS и основные заголовки есть; CSP отсутствует |
| URL Structure | 6/8 | Warn | чистые URL и однопереходные 308; legacy Learn использует client redirect с HTTP 200 |
| Mobile Optimization | 9/10 | Pass | responsive без горизонтального скролла; часть tap targets меньше 48×48 px |
| Core Web Vitals | 8/15 | Warn | свежих field-данных нет; исторический lab LCP слабее на Blog/Learn, текущий вес главной вырос |
| Server-Side Rendering | 15/15 | Pass | ключевой публичный контент, мета, ссылки и schema уже находятся в raw HTML |
| Page Speed & Server | 9/15 | Warn | TTFB хороший, CDN/сжатие/кэш основных ассетов работают; видео и основной JS тяжелы |

`Pass` = не менее 80% баллов категории, `Warn` = 50–79%, `Fail` = менее 50%.

## Резюме находок

### Граница анализа Learn

Публичный индексируемый Learn (`/learn`, `/en/learn`, открытые уроки и Finds) отделён от намеренно скрытого/noindex платного курса `/learn/courses/*`. Видео курса должны оставаться закрытыми и выдаваться через серверную проверку отдельного course entitlement после покупки. Рекомендации ниже про crawlability и текстовый слой относятся к публичному Learn; аудит не рекомендует индексировать платные уроки, публиковать их transcript или ослаблять Kinescope/auth gating. Замечание ниже касается только преждевременных ссылок на hidden-course URL в raw HTML публичного хаба.

### Critical — исправить немедленно

Критических блокировок индексации, массовых 4xx/5xx, запрета Googlebot или пустого CSR-only HTML на публичных страницах не найдено.

### High — приоритет P1

1. **Индексируемый Blog/Learn-контент не полностью доступен из хабов обычными ссылками.** В raw HTML `/blog` есть ссылки только на 12 из 24 RU-постов; ещё 12 доступны через sitemap, но не через crawlable-пагинацию. В raw HTML `/learn` есть ссылки только на 3 из 11 публичных RU-материалов из sitemap. Это ослабляет crawl depth, внутренний вес и GEO-обнаруживаемость краулерами без JavaScript.
2. **Legacy Learn-URL не делают серверный redirect.** `/app/learn` и `/space/learn` отвечают `200 OK`; перенаправление выполняет React. При этом `/app/` и `/space/` закрыты в robots.txt, поэтому поисковый робот не увидит client redirect и старые сигналы/ссылки не консолидируются в `/learn`.
3. **Видео-аватар резко увеличивает стартовый вес главной.** На RU-главной браузер фактически загрузил `opten-extension-avatar.mp4` размером 2 793 943 байта; суммарный encoded body ресурсов текущего lab-сеанса — около 3,46 МБ. EN-файл имеет `Content-Length: 12 453 845` байт. Компонент вызывает `video.load()` и `video.play()` при монтировании, несмотря на `preload="metadata"`. Оба MP4 отдаются с `Cache-Control: public, max-age=0, must-revalidate`.
4. **Скрытый/noindex-курс публично связан с `/learn`.** Raw HTML публичного Learn-хаба содержит ссылки на `/learn/courses/ai-content-marketing-2026`, `hidden-intro`, `lesson-1-prompting` и `lesson-2-ai-services`, хотя проектный контракт требует не выводить скрытый курс в публичном Learn до запуска. Маршруты защищены `X-Robots-Tag: noindex`, а видео намеренно доступны только после серверной проверки course entitlement. Проблема — публичные ссылки и раскрытие структуры, а не закрытость видео; noindex, Kinescope gating и платный доступ менять не нужно.

### Medium — исправить в течение месяца

1. `robots.txt` одновременно запрещает `/account`, `/success`, `/dashboard/`, `/app/`, `/space/`, а ответы этих маршрутов содержат `X-Robots-Tag: noindex`. При `Disallow` поисковик может не загрузить ответ и не увидеть `noindex`; возможны URL-only записи при наличии внешней ссылки.
2. На live-ответе нет `Content-Security-Policy`. HSTS есть (`max-age=63072000`), но без `includeSubDomains`.
3. На мобильной главной 16 из 23 видимых интерактивных элементов в проверенном DOM имели ширину или высоту меньше 48 px. Приоритетные примеры: кнопка меню 38×38, RU-переключатель 42×36, логотип-ссылка 132×32.
4. `/blog/` отвечает `200`, а не редиректом на `/blog`; canonical корректно указывает на `/blog`, но остается лишний доступный дубль. `?utm_source=...` также отвечает `200`, но корректно canonical-ится на чистый URL.
5. Основной JS `/assets/index-x0VEv9M9.js` — около 249 798 байт encoded и 910 537 байт decoded, то есть выше предупреждающего порога 200 КБ compressed. Brotli и immutable cache работают.
6. 404-страница корректно отвечает HTTP 404 и содержит `noindex`, но также canonical на главную. HTTP 404 уже является достаточным сигналом; canonical на `/` лучше убрать, чтобы не смешивать сигналы.

## AI Crawler Access

Live `robots.txt` возвращает `200`, имеет `Sitemap: https://opten.space/sitemap.xml`, разрешающий wildcard и отдельные правила для основных AI-краулеров.

| Платформа | User-Agent | Статус | Комментарий |
|---|---|---|---|
| OpenAI training | GPTBot | Allowed | Явный блок `User-agent: GPTBot`, публичные разделы разрешены |
| ChatGPT live fetch | ChatGPT-User | Allowed | Явно разрешен |
| ChatGPT Search | OAI-SearchBot | Allowed | Явно разрешен |
| Google Search / AI Overviews | Googlebot | Allowed | Разрешен через `User-agent: *` |
| Gemini controls | Google-Extended | Allowed | Явно разрешен |
| Bing / Copilot | bingbot | Allowed | Явный `Bingbot`; публичные разделы разрешены |
| Perplexity | PerplexityBot | Allowed | Явно разрешен |
| Anthropic | ClaudeBot | Allowed | Явно разрешен; также есть `anthropic-ai` |
| Amazon | Amazonbot | Allowed | Явно разрешен |
| Common Crawl | CCBot | Allowed | Явно разрешен |
| Meta | FacebookExternalHit | Allowed | Разрешен wildcard; `Meta-ExternalAgent` указан отдельно |
| ByteDance | Bytespider | Allowed | Явно разрешен |
| Apple Intelligence | Applebot-Extended | Allowed | Явно разрешен |

**Вывод:** подтверждено данными — GEO-доступ основных публичных страниц не блокируется robots.txt.

## Crawlability и sitemap

### Подтверждено данными

- `https://opten.space/robots.txt` — `200`, `text/plain`, 4 992 байта.
- `https://opten.space/sitemap.xml` — `200`, валидный XML, 214 URL, у всех 214 есть `<lastmod>`.
- Все 214 sitemap-блоков содержат ровно три alternate-ссылки: `ru`, `en`, `x-default`.
- Автоматическая проверка sitemap-пар не нашла ошибок взаимности hreflang: `0` ошибок.
- 14/14 выбранных публичных индексируемых URL вернули `200`, self-canonical, один H1 и пререндеренный контент.
- Главная HTML-ссылками ведет на `/blog`, `/models`, `/learn`; эти хабы находятся на глубине 1.
- `/models` содержит 51 RU-ссылку из 62 model URL. Оставшиеся 11 umbrella-моделей скрыты из хаба намеренно; выборочная страница `/models/veo-3.1` содержит ссылку на umbrella `/models/veo`, поэтому blanket-вывод об их orphan-статусе не делался.

### H-01: неполная HTML-обнаруживаемость Blog и Learn

**Статус:** подтверждено данными.  
**Доказательство:**

- sitemap: 24 RU-поста `/blog/*`; raw HTML `/blog`: 12 уникальных ссылок на посты;
- не связаны из хаба: `/blog/gpt-image-2`, `/blog/prompt-structure`, `/blog/negative-prompt`, `/blog/sora-2-vs-veo-3-1` и ещё 8;
- sitemap: 11 публичных RU-страниц `/learn/*`; raw HTML `/learn`: 3 ссылки;
- не связаны из хаба: `/learn/web-design-references`, `/learn/junior-designer-1100-order`, `/learn/client-website-navigation-hero` и все 5 `/learn/finds/*`;
- `/blog` использует кнопочную client-side пагинацию и `?page=...`, а не HTML `<a href>`; пререндер всегда содержит page 1 и canonical `/blog`.

**Влияние:** вероятная причина — более медленное обнаружение обновлений, слабая передача внутреннего веса, неполная навигация для GPTBot/ClaudeBot/PerplexityBot, которые не обязаны выполнять JavaScript.

**Точное действие:** при 24 постах самый надежный вариант — вывести все карточки/ссылки в пререндеренный `/blog` и оставить клиентский фильтр как progressive enhancement. Альтернатива — создать crawlable `/blog/page/2` с пререндером, self-canonical и обычными `<a href>` из page 1. Для `/learn` добавить публичные уроки и Finds в raw HTML хаба или отдельный crawlable подраздел, связанный из `/learn`.

**Критерии приемки:**

- `view-source:https://opten.space/blog` содержит HTML-ссылку на каждый sitemap-пост либо HTML-ссылку на self-canonical page 2;
- `view-source:https://opten.space/learn` содержит ссылку на каждый публичный урок/Find или на crawlable индексируемый хаб этих материалов;
- каждый публичный Blog/Learn URL из sitemap имеет хотя бы одну входящую HTML-ссылку;
- JS-off обход достигает каждого такого URL не более чем за 3 клика.

## Indexability, canonical и hreflang

### Что работает

- Выборка RU/EN главной, Blog, статей, Models, model pages, Learn, урока, Find, About, Pay и Privacy: `200`, self-canonical, 3 hreflang.
- Проверенная пара `/blog/ai-for-work` ↔ `/en/blog/ai-for-work` взаимна; `x-default` указывает на RU.
- HTTP и `www` делают один 308-hop на `https://opten.space/`.
- `/guides` → `/blog` и `/guides/gpt-image-2` → `/blog/gpt-image-2` — один 308-hop.
- `/BLOG` возвращает настоящий `404`, а не soft 404.
- Несуществующий `/nonexistent-seo-audit-xyz` возвращает HTTP 404 и `meta robots=noindex,nofollow`.
- `/login`, `/app`, `/learn/courses/ai-content-marketing-2026` возвращают `200` с `meta robots=noindex,nofollow` и `X-Robots-Tag: noindex, nofollow`.

### H-02: legacy Learn не консолидирует сигналы серверным redirect

**Статус:** подтверждено данными.  
`https://opten.space/app/learn` и `https://opten.space/space/learn` отвечают `200 OK`, а canonical-навигация происходит только после запуска React. В robots.txt обе зоны запрещены.

**Действие:** добавить серверные permanent redirects до SPA rewrites:

- `/app/learn` и `/app/learn-v2` → `/learn`;
- `/app/learn/:lessonSlug` → `/learn/:lessonSlug`;
- `/space/learn` → `/learn`;
- `/space/learn/:lessonSlug` → `/learn/:lessonSlug`.

**Критерий приемки:** каждый legacy URL без выполнения JS возвращает один `301/308` непосредственно на canonical URL; destination отвечает `200`, цепочки отсутствуют.

### M-01: `Disallow` конфликтует с `noindex`

**Статус:** подтверждено конфигурацией и live-заголовками выборки.  
Для не-секретных HTML-маршрутов, которые нужно гарантированно исключить из индекса, поисковику следует позволить получить `noindex`. Оставить `Disallow` имеет смысл для `/api/` и действительно нежелательных для обхода поверхностей; для `/app/`, `/account`, `/success`, `/dashboard/`, `/space/` выбрать согласованную стратегию после проверки текущей индексации в GSC/Яндекс.Вебмастере.

**Критерий приемки:** URL Inspection показывает, что выбранные HTML-маршруты доступны роботу и исключены по `noindex`, а API остаются закрыты.

## SSR / исходный HTML против DOM

### Главная

| Сигнал | Raw HTML | Rendered DOM |
|---|---:|---:|
| H1 | 1 | 1, тот же текст |
| Внутренние/внешние `<a href>` | 31 | 31 |
| hreflang | 3 | 3 |
| JSON-LD blocks | 5 | 5 |
| Основной видимый текст | присутствует | около 6 204 символов в `<main>` |

### Статья `/blog/ai-for-work`

- Raw H1: `Нейросети для работы: 10 задач на каждый день`.
- Raw HTML: 24 ссылки, 3 hreflang, 6 JSON-LD blocks, полный article text внутри SSR root.
- Rendered DOM сохраняет тот же H1, canonical, 24 ссылки, 6 JSON-LD blocks и около 5 573 символов основного текста.

### Вывод

**Подтверждено данными:** критический публичный контент не зависит от JavaScript. AI-краулеры получают заголовки, текст, навигацию, canonical, hreflang и structured data в первом HTML-ответе. SPA-only/noindex-маршруты преднамеренно возвращают компактный shell без публичного контента.

## Security

Live главная:

| Проверка | Результат |
|---|---|
| HTTPS | Pass; HTTP → HTTPS одним 308 |
| TLS | Pass в браузере/curl, ошибок сертификата нет |
| HSTS | `max-age=63072000`; без `includeSubDomains` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `SAMEORIGIN` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera/microphone/geolocation выключены, payment ограничен |
| Content-Security-Policy | отсутствует |
| Mixed content | не найден в загруженной выборке; наблюдаемые ресурсы HTTPS |

**Рекомендация:** начать с `Content-Security-Policy-Report-Only`, собрать нарушения для Supabase, Paddle, YouTube/Kinescope и прочих реальных интеграций, затем включить enforcement. `includeSubDomains` добавлять в HSTS только после инвентаризации всех поддоменов и подтверждения HTTPS, особенно `supabase.opten.space`.

**Критерий приемки:** CSP не ломает auth/payment/video, не допускает `unsafe-eval`, а отчеты не показывают нужные заблокированные origin; HSTS применяется ко всем подтвержденным HTTPS-поддоменам.

## Mobile

Проверка live-главной при мобильном viewport:

- viewport meta: `width=device-width, initial-scale=1.0`;
- `scrollWidth == clientWidth` — горизонтального overflow нет;
- базовый проверенный текст — 16 px;
- основной контент и H1 присутствуют;
- 16 из 23 видимых интерактивных элементов имели одну из сторон меньше 48 px.

**Действие:** увеличить кликабельную область прежде всего у menu/language/currency controls до минимум 44×44, лучше 48×48, не обязательно визуально увеличивая иконку. Footer text links можно объединить с дополнительным padding/line-height.

**Критерий приемки:** автоматическая DOM-проверка не находит критичных header controls меньше 44×44; ручная проверка на 360/390 px не выявляет наложений и горизонтального скролла.

## Core Web Vitals: field и lab раздельно

### Field data

**Не удалось проверить из-за отсутствия доступа/квоты.** Свежий запрос PageSpeed Insights API 2026-07-10 вернул HTTP 429. Актуальные CrUX LCP/INP/CLS p75 и GSC CWV в этой технической подзадаче недоступны. Поэтому нельзя утверждать, что сайт проходит или не проходит CWV по реальным пользователям.

### Исторический lab baseline — не текущий field

Локальный документ `docs/superpowers/specs/2026-06-07-pagespeed-optimization-design.md` фиксирует результаты PSI mobile от 2026-06-07:

| URL | Lab score | Lab LCP | Total bytes |
|---|---:|---:|---:|
| `/` | 98 | 2,1 с | ~0,64 МБ |
| `/learn` | 82 | 3,9 с | ~1,39 МБ |
| `/learn/actual-ai-tools-2026` | 84 | 3,6 с | ~0,69 МБ |
| `/blog` | 88 | 3,6 с | ~1,96 МБ |
| `/blog/kling-3-prompts` | 86 | 3,6 с | ~1,45 МБ |
| `/login` | 89 | 3,15 с | ~0,56 МБ |

Эти цифры диагностические и устаревшие относительно видео-аватара, добавленного в июле. Они не заменяют CrUX p75.

### План измерения

После исправления видео и внутренних ссылок повторить PSI mobile/desktop минимум для `/`, `/en/`, `/blog`, статьи, `/models/veo-3.1`, `/learn`, урока. Отдельно получить CrUX/GSC p75: LCP < 2,5 с, INP < 200 мс, CLS < 0,1; сравнивать URL-level и origin-level, не смешивать field с Lighthouse.

## Page Speed & Server

### Текущие live-замеры

| URL | HTTP | TTFB | Total request |
|---|---:|---:|---:|
| `/` | 200 | 455 мс | 573 мс |
| `/blog/ai-for-work` | 200 | 396 мс | 500 мс |
| `/models/veo-3.1` | 200 | 423 мс | 569 мс |
| `/learn/actual-ai-tools-2026` | 200 | 531 мс | 642 мс |

Все четыре TTFB ниже целевых 800 мс. Ответы обслуживаются Vercel (`X-Vercel-Cache: HIT` в проверенной выборке). HTML сжимается gzip, JS/CSS — Brotli.

### Кэш и бандлы

- hashed JS/CSS: `public, max-age=31536000, immutable` — Pass;
- fonts: `public, max-age=31536000, immutable` — Pass;
- изображения: месячный cache — Pass;
- MP4 avatar: `max-age=0, must-revalidate` — Warn;
- основной JS: ~249,8 КБ encoded / ~910,5 КБ decoded — Warn;
- CSS: ~29,5 КБ encoded / ~182 КБ decoded — приемлемо;
- RU avatar MP4: 2,79 МБ; EN avatar MP4: 12,45 МБ — Fail для автоматической стартовой загрузки.

### H-03: отложить видео и уменьшить EN-файл

**Статус:** подтверждено RU network trace + live headers + кодом компонента; EN-автозагрузка следует из того же компонента и источника 12,45 МБ.

**Действие:**

1. В idle-состоянии показывать оптимизированный poster/static preview.
2. Не вызывать `load()`/`play()` сразу; использовать `preload="none"` и загружать видео после явного клика. Если autoplay бизнес-критичен — только после LCP/idle и с network-aware ограничением.
3. Перекодировать EN landscape в более низкий bitrate/разрешение; рассмотреть WebM с MP4 fallback.
4. Версионировать/хешировать имя видео и дать долгий immutable cache либо установить разумный cache с revalidation для стабильного имени.
5. Разнести тяжелый публичный код по route chunks; цель — стартовый main JS < 200 КБ compressed.

**Критерии приемки:**

- при первом открытии `/` и `/en/` до пользовательского действия MP4 не передается целиком;
- стартовый payload главной < 1 МБ на mobile lab;
- EN media не превышает согласованный бюджет (рекомендуемо < 2–3 МБ даже после клика);
- повторная загрузка использует браузерный cache;
- свежий PSI/CrUX подтверждает отсутствие регрессии LCP/INP.

## IndexNow

**Статус: Pass.**

- `public/36ced30e188f58b51d26c30e483124d5.txt` существует;
- live key URL отвечает `200`, содержимое совпадает с ключом;
- `scripts/indexnow.mjs` читает sitemap и отправляет полный URL list на `https://api.indexnow.org/indexnow` в build pipeline;
- 200/202 считаются успешным приемом, сетевой сбой не ломает deploy.

Ограничение: фактический ответ последнего production ping не хранится в проверенных артефактах, поэтому подтверждена реализация, а не прием конкретного последнего пакета поисковиками.

## Приоритетный план

| Приоритет | Задача | Impact | Effort | Ответственный | KPI/приемка |
|---|---|---:|---:|---|---|
| P1 | Сделать все Blog/Learn URL crawlable из HTML-хабов | High | Medium | разработчик + SEO | 100% sitemap Blog/Learn имеют входящую HTML-ссылку, depth ≤ 3 |
| P1 | Серверные 301/308 для `/app/learn*`, `/space/learn*` | High | Low | разработчик | один redirect hop, destination 200 |
| P1 | Убрать автозагрузку avatar MP4, сжать EN media | High | Medium | разработчик + дизайнер | initial payload < 1 МБ; MP4 только после действия/idle policy |
| P1 | Удалить hidden-course ссылки из публичного `/learn` до запуска | High | Low | разработчик/продакт | raw HTML `/learn` не содержит `/learn/courses/*`; noindex и server-gated paid access сохранены |
| P2 | Развести `Disallow` и `noindex` для HTML-зон | Medium | Low | SEO + разработчик | URL Inspection видит и применяет noindex |
| P2 | CSP Report-Only → enforcement | Medium | Medium | разработчик/security | нет сломанных auth/payment/video запросов |
| P2 | Увеличить tap targets | Medium | Low | дизайнер + разработчик | header controls ≥ 44×44 |
| P2 | Снизить main JS < 200 КБ compressed | Medium | Medium | разработчик | route-level bundle budget проходит |
| P3 | Redirect `/blog/` → `/blog`; убрать canonical с 404 | Low | Low | разработчик | один 308, 404 без conflicting canonical |

## Ограничения аудита

- Не выполнялся полный обход всех 214 URL: проверена ограниченная репрезентативная выборка и структура sitemap/hubs.
- Fresh PSI/CrUX field metrics недоступны из-за 429; INP не измерялся взаимодействиями реальных пользователей.
- Browser resource totals — lab-наблюдение и зависят от cache state; отдельно приведены серверные `Content-Length` и encoded размеры, где доступны.
- Не использовались GSC URL Inspection, GSC CWV, Яндекс.Вебмастер и фактическая база indexed URL; статус index bloat оценен только по структуре, sitemap и выборке.
- Не проверялись все возможные query-параметры, все внешние ссылки и все поддомены для HSTS.
- Product code, robots.txt, sitemap и deployment не изменялись.
