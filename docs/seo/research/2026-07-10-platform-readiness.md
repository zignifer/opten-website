# GEO Platform Optimization Report — opten.space

> [!note] Статус: стартовый ресёрч
> Исходный специализированный аудит. Используется как доказательная база, но
> не как самостоятельный план реализации. Актуальные приоритеты находятся в
> [[../SEO-GROWTH-PLAN|каноническом SEO Growth Plan]].

**Дата:** 10 июля 2026 года  
**Режим:** только чтение  
**Поверхность:** live-сайт, локальный репозиторий, публичный поиск и публичные страницы платформ  
**Продукт:** Opten — Chrome-расширение для генерации, оценки и улучшения промптов

## Overall Platform Readiness

- **Combined GEO Score: 35/100 — Weak**
- Техническая доступность и структурированные данные сильнее внешнего авторитета бренда.
- Главный барьер не crawlability: AI-платформам легко прочитать сайт, но у них мало независимых оснований считать Opten канонической сущностью и проверенным источником.
- Самая срочная платформенная проверка — Bing: IndexNow реализован корректно, но публичные точные запросы Bing не вывели `opten.space`. Без Bing Webmaster Tools это симптом, а не доказательство деиндексации.

## Platform Scores

| Platform | Score | Status |
|---|---:|---|
| Google AI Overviews | **41/100** | Moderate |
| ChatGPT Web Search | **10/100** | Weak |
| Perplexity AI | **30/100** | Weak |
| Google Gemini | **47/100** | Moderate |
| Bing Copilot | **47/100** | Moderate |
| **Combined** | **35/100** | **Weak** |

Пороговые значения навыка: Strong = 70+, Moderate = 40–69, Weak = 0–39. Combined — простое среднее пяти платформ. Для Gemini и Copilot неприменимые Merchant Center и Bing Places исключены из знаменателя, после чего результат нормализован до 100.

## Данные и ограничения

### Подтвержденный поисковый baseline

| Источник | Период | Clicks | Impressions | CTR | Position |
|---|---|---:|---:|---:|---:|
| Google Search Console, Web | 2026-06-10 — 2026-07-07 | 27 | 2 200 | 1,23% | 10,94 |
| Яндекс.Вебмастер | 2026-06-11 — 2026-07-08 | 78 | 3 922 | 1,99% | 8,37 |

Доступ owner к GSC и эти агрегаты получены из подтвержденного контекста мастер-аудита. Query-level выборка топ-10 в этой подзадаче не передавалась, поэтому средняя позиция 10,94 не интерпретируется как доказательство топ-10 по целевым запросам.

### Live-выборка

Проверено 50 URL из [sitemap.xml](https://opten.space/sitemap.xml): главная, About, хабы, 10 RU-статей, 20 RU-модельных страниц, 10 Learn/Learn Finds и 5 EN-хабов.

| Сигнал | Результат |
|---|---:|
| HTTP 200 | 50/50 |
| Ровно один H1 | 50/50 |
| Страницы с HTML-списками | 34/50 |
| Страницы с `FAQPage` | 34/50 |
| HTML-таблицы | 0/50 |
| Видимый `<time>` | 32/50 |
| Видимый updated-сигнал | 21/50 |
| Средний оценочный объём | ~1 040 слов |
| Максимум в выборке detail pages | ~1 795 слов |
| Изображения / непустой alt | 512 / 253 |

На 20 модельных страницах найден вопросительный H2/H3, но это промо-CTA вида «Готов писать промпты…?», а не поисковый вопрос с answer-first ответом. FAQ-вопросы размечены семантическим `dt/dd` и JSON-LD, но не H2/H3. Дополнительная проверка 50 RU URL: 50/50 имеют title и meta description, все 50 title и 50 descriptions уникальны.

### Что не проверено

- Bing Webmaster Tools — **нет доступа в этой подзадаче**; verification, sitemap status, crawl errors и фактический indexed count не подтверждены.
- Google Business Profile и Bing Places — **не проверены**; Opten является online-only SaaS, локальные карточки не являются основным каналом, но их отсутствие не выдумывалось.
- Google Knowledge Panel — **не подтвержден**. Публичный поиск не является надежной заменой авторизованной проверки панели.
- Фактические ответы авторизованных ChatGPT Search, Perplexity, Gemini, Google AI Overviews и Copilot не прогонялись. Баллы измеряют readiness по рубрике, не долю реальных цитирований.
- Backlink-провайдер не подключен. Отсутствие .edu/.gov/press ссылок означает «не найдено в публичной выборке», а не полный backlink verdict.

## Platform Details

## 1. Google AI Overviews — 41/100

### Расчёт

| Criterion | Score | Evidence |
|---|---:|---|
| Ranks in top 10 for target queries | 10/20 | GSC average position 10,94: top-20 readiness, но не доказанный query-level top-10 |
| Question-based headings | 0/10 | Вопросительные headings в выборке — промо-CTA; реальные FAQ находятся в `dt`, не H2/H3 |
| Direct answers after question headings | 0/15 | Query-heading → 1–2 sentence answer pattern не найден |
| Tables for comparison data | 0/10 | 0 HTML-таблиц на 50 URL |
| Lists for processes/features | 10/10 | 34/50 страниц имеют `ol`/`ul`; статьи и model pages используют пошаговые структуры |
| FAQ with 5+ questions | 10/10 | FAQ-контент и `FAQPage` широко используются; 34/50 в выборке |
| Statistics with citations | 0/10 | Числа есть, но primary-source ссылки и методология рядом с claims практически отсутствуют |
| Publication/updated date visible | 3/5 | Даты широко видимы, но обычно показана только публикация или только обновление |
| Author byline with credentials | 3/5 | В статьях виден Влад Воронежцев, но имя не ведёт на bio и credentials рядом нет; model pages не показывают byline |
| Clean URL + heading hierarchy | 5/5 | 50/50 имеют один H1, clean canonical paths и понятные H2/H3 |
| **Итого** | **41/100** | **Moderate** |

### Что уже помогает

- Индексируемый prerendered HTML, clean hierarchy и сильные intro-блоки на model pages, например [Kling 3.0](https://opten.space/models/kling-3).
- `FAQPage`, `HowTo`, `BlogPosting`, `TechArticle`, `BreadcrumbList`, `SoftwareApplication` и `SpeakableSpecification` связаны стабильными `@id`.
- Статьи показывают дату и автора, например [«Нейросети для работы»](https://opten.space/blog/ai-for-work).
- Google подтверждает, что для AI features действуют обычные SEO-требования и не требуется отдельная AI-разметка; текущий prerender/schema фундамент полезен, но сам по себе не гарантирует citation ([Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)).

### Главные gaps и действия

1. Для 10 приоритетных query clusters добавить H2-вопрос, затем самостоятельный ответ на 40–70 слов. Начать с `/models/kling-3`, `/models/gpt-image-2`, `/models/veo-3.1`, `/blog/prompt-structure`, `/blog/best-ai-video-2026`.
2. Добавить проверяемые comparison tables: модель, режим, вход, длительность/разрешение, лучший сценарий, ограничение, источник, дата проверки.
3. Вынести FAQ-вопросы в H3 внутри доступной секции, сохранив `dl`/schema parity.
4. Добавить «Источники и дата проверки» с official docs/release notes и разделением «официально заявлено» / «проверили в Opten».
5. Сделать byline ссылкой на `/about`, расширить bio компетенциями и показать `datePublished` + `dateModified`, когда это действительно разные события. Google рекомендует явные author URL и даты в Article-разметке ([Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)).

## 2. ChatGPT Web Search — 10/100

### Расчёт

| Criterion | Score | Evidence |
|---|---:|---|
| Wikipedia article | 0/20 | Релевантной статьи Opten/основателя не найдено |
| Wikidata entity with 5+ properties | 0/10 | По `Opten` и `opten.space` релевантной сущности нет |
| Bing index coverage | 0/10 | Публичные точные Bing-запросы не вывели `opten.space`; BWT недоступен |
| Reddit positive mentions | 0/10 | Четыре точных web-поиска не нашли упоминаний; Reddit internal search не подтвержден |
| YouTube channel | 5/10 | Активный канал основателя есть, но нет устойчивой Opten-series/entity |
| Authoritative backlinks | 0/15 | Независимые .edu/.gov/editorial press категории не подтверждены |
| Entity consistency | 0/10 | Сайт говорит 60+, Chrome Web Store — 43+; Person и Organization делят одни `sameAs` |
| Comprehensive 2 000+ content | 5/10 | Model/blog detail pages содержательны, но sampled максимум ~1 795 слов |
| Bing Webmaster Tools | 0/5 | Не проверено, балл не начислен |
| **Итого** | **10/100** | **Weak** |

### Entity graph

- [Wikipedia API](https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=Opten) выдаёт нерелевантные омонимы; статьи о продукте нет.
- [Wikidata API по `opten.space`](https://www.wikidata.org/w/api.php?action=wbsearchentities&search=opten.space&language=en&format=json) возвращает пустой результат.
- Создавать Wikipedia сейчас не рекомендуется: без независимых существенных публикаций страница не пройдёт критерии значимости и создаст conflict-of-interest риск.
- [Chrome Web Store](https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl) — сильнейший внешний product anchor, но он описывает **43+** модели, тогда как [сайт](https://opten.space/) — **60+**.
- `Organization.sameAs` включает личные Telegram/YouTube автора, а `Person.sameAs` повторяет их. Это смешивает бренд и основателя.

### Приоритетные действия

1. В Bing Webmaster Tools подтвердить domain, sitemap, crawl/index coverage и URL Inspection для 20 ключевых URL. Пока это P0-проверка, а не обещание исправления.
2. Синхронизировать продуктовый факт: отдельно описать число model profiles в каталоге и фактически поддерживаемые extension models/version.
3. Оставить личные профили в `Person.sameAs`; в `Organization.sameAs` добавить только реальные брендовые сущности.
4. Создать LinkedIn company page и привести CWS, site, GitHub, YouTube descriptions к одной canonical формулировке `Opten — AI Prompt Scorer & Optimizer`.
5. Не создавать Wikipedia «для SEO». Сначала получить 3–5 независимых отраслевых обзоров/интервью/кейсов.

## 3. Perplexity AI — 30/100

### Расчёт

| Criterion | Score | Evidence |
|---|---:|---|
| Active Reddit presence | 0/20 | Не найдено в публичной web-выборке |
| Forum/community mentions | 0/10 | HN, Stack Overflow, Quora и профильные форумы не подтверждены |
| Content freshness | 10/10 | Контент и канал обновляются в июне–июле 2026 |
| Original research/data | 0/15 | Claims и before/after есть, но dataset, methodology и repeatable benchmark отсутствуют |
| YouTube with transcripts | 5/10 | Канал активен, но Opten-focused chapters/transcripts системно не подтверждены |
| Quotable standalone paragraphs | 10/10 | Model intros и blog intros дают самостоятельные определения и инструкции |
| Multi-source validation | 0/10 | У sampled editorial/model pages нет source lists и primary claims citations |
| Discussion-generating content | 5/10 | Есть аудитория и активность автора в YouTube/Telegram, но независимые обсуждения Opten не найдены |
| Wikipedia/Wikidata | 0/5 | Нет релевантной сущности |
| **Итого** | **30/100** | **Weak** |

### Что уже помогает

- Свежий [YouTube-канал Влада Воронежцева](https://www.youtube.com/@v.voronezhtsev) и его [RSS](https://www.youtube.com/feeds/videos.xml?channel_id=UC797Sd_fYNILYZFuXsjjFDA) показывают регулярные публикации вплоть до 10.07.2026.
- Model pages дают конкретные, отдельно цитируемые абзацы; Learn Finds корректно ссылаются на оригинальные видео и не присваивают авторство.
- `PerplexityBot` явно разрешён в [robots.txt](https://opten.space/robots.txt).

### Приоритетные действия

1. Опубликовать первый repeatable benchmark: одинаковый prompt set, 3 прогона на модель, настройки, дата, raw outputs, scoring rubric и ограничения.
2. Добавить к модельным claims primary docs и changelog links. Не «набивать ссылками», а давать проверяемое происхождение каждого изменяемого числа.
3. Делать Opten-видео с chapters, полным transcript/конспектом и canonical URL страницы в description.
4. Участвовать в Reddit/HN/профильных сообществах через полезные разборы и открытые тесты. KPI — содержательные независимые ответы и обсуждения, не число рекламных ссылок.
5. Для Learn lessons добавить 100–180 слов answer-first summary, 5–7 выводов и таймкоды: текущие страницы слишком зависят от просмотра видео.

## 4. Google Gemini — 47/100

### Расчёт

| Criterion | Score | Evidence |
|---|---:|---|
| Google Knowledge Panel | 0/15 | Публично не подтвержден; авторизованной проверки нет |
| Google Business Profile | 0/10 | Не проверен; online-only продукт, но балл без доказательства не начислен |
| YouTube topic-relevant content | 10/20 | Активный creator channel и Learn video; нет отдельной Opten-series с chapters |
| Schema.org | 15/15 | Organization, Person, SoftwareApplication, Article, VideoObject, LearningResource, FAQ, breadcrumbs |
| Google ecosystem presence | 5/10 | Подтверждены Chrome Web Store и YouTube; Scholar/News/Maps не подтверждены |
| Image optimization | 5/10 | Частичное покрытие; 253/512 img имеют непустой alt, часть пустых alt декоративна, но Learn content thumbnails тоже пусты |
| E-E-A-T signals | 5/10 | `/about`, Person schema, bylines и creator footprint есть; credentials/source policy/reviewer layer слабы |
| Google Merchant Center | N/A | SaaS/extension, не товарный каталог |
| Multi-modal content | 5/5 | Текст, изображения, авторские видео и сторонние embedded videos |
| **Нормализованный итог** | **47/100** | **Moderate** |

### Сильные стороны и gaps

- [About](https://opten.space/about) связывает Person и Organization, а Chrome Web Store подтверждает издателя и домен.
- Schema graph богатый и находится в исходном HTML, но `Organization.sameAs` требует очистки от личных аккаунтов.
- Google-owned surfaces есть, но канал называется по имени автора, а не Opten. В свежей YouTube-выборке не видна постоянная серия Opten в titles.
- Image layer богатый, но на Learn cards/detail media пустые alt не всегда декоративны; это ослабляет multimodal grounding.
- Knowledge Panel и GBP не заявляются существующими без доказательства.

### Приоритетные действия

1. Создать YouTube playlist/series «Opten»: title, chapters, captions, description с canonical URL и одинаковой entity формулировкой.
2. Исправить Organization/Person `sameAs`, выровнять 60+/43+ и добавить устойчивый `alternateName`.
3. Сделать имя автора в статьях ссылкой на `/about`; добавить опыт, специализации, ссылки на работы/выступления и editorial/source policy.
4. Добавить осмысленные alt/filenames к content-bearing Learn и comparison media; декоративные изображения оставить `alt=""`.
5. После укрепления внешней сущности отдельно проверить Knowledge Panel/brand SERP; не пытаться «создать» панель только schema-разметкой.

## 5. Bing Copilot — 47/100

### Расчёт

| Criterion | Score | Evidence |
|---|---:|---|
| Bing Webmaster Tools + sitemap | 0/15 | Не проверено |
| IndexNow | 15/15 | Реализован POST до 214 URL и доступный root key file |
| Bing index coverage | 0/10 | Точные публичные запросы не вывели opten.space; BWT нужен для подтверждения |
| LinkedIn company page | 0/10 | Релевантная Opten AI company entity не найдена |
| GitHub presence | 5/5 | Public repo активен, но entity metadata слабая |
| Meta descriptions | 10/10 | 50/50 sampled RU pages имеют уникальный description |
| Social engagement | 5/10 | Активные YouTube/Telegram автора, но мало independent brand engagement |
| Exact target phrases in title/H1 | 10/10 | 37/50 sampled RU pages имеют выраженное title/H1 overlap; model pages literal и конкретны |
| Page load <2 seconds | 0/10 | Свежих field-данных нет; исторический mobile LCP большинства шаблонов 3,6–3,9 с |
| Bing Places | N/A | Online-only SaaS, локальная карточка не основной surface |
| **Нормализованный итог** | **47/100** | **Moderate** |

### IndexNow и Bing

- `scripts/indexnow.mjs` после build читает sitemap и отправляет весь URL list в `https://api.indexnow.org/indexnow`.
- Live root key [36ced30e188f58b51d26c30e483124d5.txt](https://opten.space/36ced30e188f58b51d26c30e483124d5.txt) отвечает 200 и содержит совпадающий ключ.
- `/.well-known/indexnow-key.txt` возвращает 404, но это **не дефект** текущей реализации: официальный протокол прямо разрешает root `{key}.txt`, а скрипт передаёт этот root URL как `keyLocation` ([IndexNow documentation](https://www.indexnow.org/documentation)).
- Публичный Bing spot-check 10.07.2026 по `site:opten.space`, точному домену и `"Opten AI Prompt Scorer"` не показал `opten.space` и смешал бренд с более сильной венгерской OPTEN-сущностью. Search operator не равен indexed count, поэтому следующий шаг — BWT, а не повторная отправка IndexNow вслепую.
- [Public GitHub repo](https://github.com/zignifer/opten-website) обновляется, но repository description пуст, homepage ведёт на staging `opten-website2.vercel.app`, topics/license отсутствуют, 0 stars/1 fork. Это слабый Microsoft-ecosystem entity signal.

### Приоритетные действия

1. В BWT проверить domain verification, sitemap processing, crawl errors, indexed URLs и URL Inspection для `/`, `/models`, пяти model pages, пяти articles и Learn pages.
2. Если ключевые URL не indexed, сначала исправить BWT-reported причину; только затем повторять submit/IndexNow.
3. Создать LinkedIn company page с доменом, founder link и canonical description.
4. Обновить GitHub repo: description, homepage=`https://opten.space`, README, CWS link, screenshots, topics и лицензия/политика contribution.
5. Убрать стартовую автозагрузку тяжёлого avatar video и повторить field/lab замеры; current HTML TTFB хороший, но это не доказывает sub-2-second LCP.

## Cross-Platform Entity Findings

### P1 — конфликт 60+ / 43+

[Сайт](https://opten.space/) заявляет 60+ моделей, [Chrome Web Store](https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl) — 43+. Автоматические каталоги копируют store metadata, поэтому AI-платформы получают две несовместимые цифры.

**Решение:** описывать разные сущности явно: «63 model-specific profiles в каталоге контента» и «N моделей, которые версия X расширения определяет/поддерживает на перечисленных платформах». Синхронизировать site, schema, llms, CWS, YouTube, Telegram и GitHub.

### P1 — смешаны Person и Organization

`Organization.sameAs` и `Person.sameAs` используют личные YouTube/Telegram URL. Пока нет брендовых профилей, личные ссылки должны описывать Person; Organization связывается с ним через `founder`.

### P1 — brand collision

По короткому запросу `Opten` конкурируют уже известные OPTEN-компании. Во внешних профилях и упоминаниях использовать дескриптор `Opten — AI Prompt Scorer & Optimizer` и домен, пока entity не станет однозначной.

### P1 — нет primary research layer

Сайт даёт много точных параметров и рекомендаций, но почти не показывает official sources, repeatable tests и raw outcomes. Это одновременно снижает AIO statistics score, ChatGPT authority и Perplexity multi-source/original-research scores.

## Prioritized Action Plan

### Quick Wins — 7–14 дней

| ID | Action | Platforms | Acceptance criteria |
|---|---|---|---|
| PL-01 | Проверить Bing Webmaster Tools и 20 ключевых URL | ChatGPT, Copilot | domain verified; sitemap processed; причины неиндексации задокументированы |
| PL-02 | Синхронизировать 60+/43+ и canonical description | All | 0 противоречий в site/schema/llms/CWS/YouTube/GitHub |
| PL-03 | Разделить Organization и Person `sameAs` | ChatGPT, Gemini, Copilot | личные профили только у Person; Organization содержит реальные брендовые URLs |
| PL-04 | Добавить 5 answer-first question blocks и 3 comparison tables | AIO, Gemini | query H2/H3 → 40–70-word answer; таблицы имеют sources/date |
| PL-05 | Сделать byline ссылкой на `/about` | AIO, Gemini, ChatGPT | видимый автор → bio; Person URL одинаков в schema и HTML |

### Medium-Term — 30 дней

| ID | Action | Platforms | Acceptance criteria |
|---|---|---|---|
| PL-06 | Source layer на 20 приоритетных model/blog pages | AIO, Perplexity, ChatGPT | каждый изменяемый claim имеет official source или own-test label |
| PL-07 | YouTube Opten-series с chapters/captions | Gemini, Perplexity, ChatGPT | 5 видео, playlist, chapters, transcript, canonical page links |
| PL-08 | LinkedIn company page и GitHub entity cleanup | ChatGPT, Copilot | canonical description/domain/founder согласованы; GitHub homepage не staging |
| PL-09 | Расширить Learn pages текстовым конспектом | Perplexity, Gemini | 100–180-word summary, 5–7 takeaways, timestamps на каждый public lesson |
| PL-10 | Исправить content image alts и performance video | Gemini, Copilot | meaningful media имеет alt; decorative alt пуст; fresh PSI/CrUX recorded |

### Strategic — квартал

| ID | Action | Platforms | Acceptance criteria |
|---|---|---|---|
| PL-11 | Публичный Opten benchmark/dataset | Perplexity, AIO, ChatGPT | methodology, prompt set, 3 runs/model, raw outputs, version/date |
| PL-12 | Независимые reviews/tutorials/cases | ChatGPT, Perplexity, Gemini | 5+ substantive third-party mentions, disclosure visible |
| PL-13 | Authentic community participation | Perplexity, ChatGPT | содержательные discussions/answers в 3+ релевантных communities |
| PL-14 | Entity consolidation measurement | All | branded prompts/queries по 5 платформам ежемесячно, facts/citations logged |
| PL-15 | Wikipedia/Wikidata readiness review | ChatGPT, Perplexity | запускать только после независимой значимости; self-created Wikipedia не KPI |

## Пять важнейших действий

1. **Проверить Bing Webmaster Tools сейчас:** публичный Bing не показывает домен даже по точным запросам, хотя IndexNow технически исправен.
2. **Устранить entity-конфликты:** синхронизировать 60+/43+, разделить Person/Organization `sameAs`, закрепить полный дескриптор бренда.
3. **Добавить доказательную базу:** official sources, дата/версия проверки и первый воспроизводимый benchmark с raw outputs.
4. **Перестроить 10 ключевых страниц под answer extraction:** реальный вопрос в H2/H3, короткий прямой ответ, проверяемая таблица и видимые даты/автор.
5. **Построить внешний authority layer:** Opten-series на YouTube с chapters/transcripts, LinkedIn company page, сильный GitHub entity и независимые community/review mentions.

## Measurement Plan

Ежемесячно фиксировать для 20 одинаковых RU/EN prompts:

- упомянут ли Opten;
- является ли `opten.space` цитируемым источником;
- какой URL цитируется;
- совпадают ли ключевые факты (модели, цена, платформы, автор);
- какие конкуренты цитируются вместо Opten;
- отдельно ChatGPT Search, Perplexity, Gemini, Copilot и Google AI Overview presence;
- Bing indexed/inspected status и GSC clicks/impressions для тех же URL;
- результаты сравнивать только после 28 полных дней с даты внедрения.

Баллы readiness не являются прогнозом или гарантией роста позиций/AI-цитирований.
