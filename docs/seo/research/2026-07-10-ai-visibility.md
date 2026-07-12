# GEO / AI Visibility-аудит opten.space

> [!note] Статус: стартовый ресёрч
> Исходный специализированный аудит. Используется как доказательная база, но
> не как самостоятельный план реализации. Актуальные приоритеты находятся в
> [[../SEO-GROWTH-PLAN|каноническом SEO Growth Plan]].

**Дата проверки:** 10 июля 2026 года  
**Режим:** только чтение  
**Объект:** Opten / opten.space / Chrome-расширение Opten  
**Направления:** AI-crawler access, AI citability, публичные упоминания и entity authority

## Резюме

| Направление | Балл | Диагноз |
|---|---:|---|
| AI Crawler Access | **100/100** | Критические AI-поисковые краулеры допущены; публичные страницы отдают готовый HTML, sitemap и llms-файлы. |
| AI Citability, выборка 10 страниц | **70/100** | Страницы моделей и статьи хорошо извлекаются в ответы; Learn и листинги заметно слабее. |
| Citability Coverage | **54%** | Оценочная доля секций выборки, способных набрать 70+ по рубрике extractability. |
| Brand Authority | **19/100 — Minimal** | Есть Chrome Web Store, активный канал основателя, Telegram и публичный GitHub, но почти нет независимых упоминаний, Reddit/Wikipedia/LinkedIn-сущности бренда. |

**Общий диагноз:** техническая готовность к AI-поиску высокая, контентная — средне-высокая, но реальная вероятность рекомендаций Opten ограничена слабой внешней сущностью бренда. Сейчас AI-система может легко прочитать opten.space и извлечь сильный ответ со страницы модели, но у неё мало независимых причин считать Opten известным и авторитетным источником.

Общий сводный индекс намеренно не рассчитывался: доступ краулеров, цитируемость текста и внешний авторитет измеряют разные стадии цепочки и не взаимозаменяемы.

## Статусы доказательств

- **Подтверждено:** получено из публичного HTTP-ответа, HTML, официальной платформы или API.
- **Вероятно:** вывод из нескольких публичных сигналов, но без внутренних логов/аналитики.
- **Не найдено:** заданные точные публичные поиски не вернули релевантного результата; это не абсолютное доказательство отсутствия.
- **Не проверено:** источник потребовал авторизацию, был заблокирован или не имел публичного API.

## Методика и ограничения

Проверены live-версии `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, HTTP-заголовки и исходный prerendered HTML 10 страниц. Для цитируемости применена формула:

`Answer Block Quality × 30% + Self-Containment × 25% + Structural Readability × 20% + Statistical Density × 15% + Uniqueness × 10%`.

Публичные упоминания проверены точными запросами по YouTube, Reddit, Wikipedia/Wikidata, LinkedIn, GitHub, Chrome Web Store, Quora, Stack Overflow, Hacker News, Product Hunt, обзорам и подкастам. Wikipedia/Wikidata проверены сначала официальными API, затем прямыми URL, как требует методика.

Ограничения:

- фактические ответы ChatGPT Search, Perplexity, Gemini/AI Overviews и Яндекс с авторизованными профилями не прогонялись; без платформенной аналитики нельзя заявлять реальную долю AI-ответов или цитирований;
- публичная web-выдача использована как proxy для discoverability, а не как точный замер позиции;
- внутренний поиск Reddit вернул HTTP 403 без авторизации; вывод по Reddit основан на четырёх точных web-поисках, поэтому помечен как «не найдено», а не как доказанное отсутствие;
- Quora блокирует автоматический доступ; наличие профиля/упоминаний внутри Quora не проверено;
- числа подписчиков и публикаций меняются; ниже зафиксирован снимок на дату аудита.

## 1. AI Crawler Access — 100/100

### 1.1. robots.txt

**Источник:** [https://opten.space/robots.txt](https://opten.space/robots.txt), HTTP 200, `text/plain`, проверено 10.07.2026.  
**Подтверждено:** публичный контент разрешён; закрыты только account/success/dashboard/app/space/api-пути. Sitemap объявлен.

| Краулер | Роль | Статус | Доказательство |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search | **Явно разрешён** | Отдельный блок `Allow: /`; официальный OpenAI источник подтверждает, что это search-контроль. |
| GPTBot | OpenAI training | **Явно разрешён** | Отдельный блок `Allow: /`. |
| ChatGPT-User | User-initiated fetch | **Явно разрешён** | Отдельный блок; официальный OpenAI источник отмечает, что user-initiated fetch может не зависеть от robots.txt. |
| ClaudeBot | Claude crawl | **Явно разрешён** | Отдельный блок `Allow: /`. |
| PerplexityBot | Perplexity Search | **Явно разрешён** | Отдельный блок `Allow: /`; официальный Perplexity источник рекомендует разрешать его для появления в поиске. |
| Google-Extended | Gemini training/grounding preference | **Явно разрешён** | Отдельный блок; это product token, а не отдельный HTTP user-agent. |
| GoogleOther | Google non-search crawler | **Разрешён wildcard** | Отдельного блока нет, действует `User-agent: * / Allow: /`. |
| Applebot-Extended | Apple AI data-use preference | **Явно разрешён** | Отдельный блок; Apple уточняет, что этот token сам не краулит страницы. |
| Amazonbot | Amazon | **Явно разрешён** | Отдельный блок. |
| Meta-ExternalAgent | Meta AI/indexing | **Явно разрешён** | Отдельный блок; это актуальное официальное имя Meta crawler. |
| CCBot | Common Crawl | **Явно разрешён** | Отдельный блок. |
| anthropic-ai | Anthropic legacy/training token | **Явно разрешён** | Отдельный блок. |
| Bytespider | ByteDance | **Явно разрешён** | Отдельный блок; это сознательная максимальная доступность, хотя ценность для RU/EN продукта ниже Tier 1. |
| cohere-ai | Cohere | **Явно разрешён** | Отдельный блок. |

Контрольная загрузка [страницы статьи](https://opten.space/blog/prompt-structure) с 14 user-agent строками вернула **HTTP 200 для всех 14**. Это подтверждает отсутствие простой UA-блокировки, но не проверяет WAF по официальным IP-диапазонам; серверные access logs в этом read-only аудите недоступны.

Расчёт по рубрике:

| Компонент | Балл |
|---|---:|
| Tier 1: 5/5 доступны | 50/50 |
| Tier 2: 5/5 доступны явно или через wildcard | 25/25 |
| Нет blanket-блокировки/noai | 15/15 |
| `llms.txt` + sitemap доступны | 10/10 |
| **Итого** | **100/100** |

### 1.2. Meta robots и HTTP headers

На всех 10 страницах выборки:

- HTTP 200;
- нет `meta robots=noindex`, `noai`, `noimageai`;
- нет `X-Robots-Tag: noindex/noai`;
- canonical указывает на проверяемый URL;
- исходный HTML уже содержит текст, headings и JSON-LD — критический SEO-контент не зависит от выполнения JavaScript.

Это особенно важно для GPTBot, ClaudeBot и PerplexityBot, чьи возможности исполнения JavaScript не следует считать равными полноценному браузеру.

### 1.3. AI-specific discovery files

| Ресурс | Статус | Наблюдение |
|---|---|---|
| [llms.txt](https://opten.space/llms.txt) | **200, 24 884 байта** | 214 ссылок: RU/EN маркетинг, блог, Learn и модели. Хороший компактный каталог. |
| [llms-full.txt](https://opten.space/llms-full.txt) | **200, 2 508 202 байта** | Файл очень большой, повторяет навигацию/CTA/footer и содержит неверную собственную заметку «under 50 KB». |
| [sitemap.xml](https://opten.space/sitemap.xml) | **200, 104 296 байт** | 214 URL: 107 RU + 107 EN; доступен и указан в robots.txt. |
| `/.well-known/ai-plugin.json` | 404 | Не проблема: это не обязательный механизм современного AI Search. |
| `/ai.txt` | 404 | Не проблема: общепринятого обязательного стандарта нет. |

`llms-full.txt` не имеет общепринятого жёсткого лимита, поэтому размер сам по себе не доказывает потерю индексации. Но **2,5 МБ повторяющегося текста ухудшают эффективность извлечения** и противоречат собственной заметке файла. Рекомендация P2: убрать ложное утверждение, исключить global chrome/CTA/footer из каждой записи и либо оставить действительно очищенный full-файл, либо разделить его на тематические файлы (`blog`, `models`, `learn`) со ссылками из `llms.txt`.

### 1.4. Content-Signal

В `robots.txt` присутствует:

`Content-Signal: search=yes, ai-train=yes, ai-input=yes`

Синтаксис соответствует текущей реализации [Content Signals](https://contentsignals.org/): `search`, `ai-input`, `ai-train`. Однако исходный IETF Internet-Draft [draft-romm-aipref-contentsignals-00](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/) истёк 4 апреля 2026 года и не стал RFC. Поэтому статус: **корректный экспериментальный сигнал, но не гарантированно соблюдаемый стандарт**. Срочных изменений не требуется; важно не описывать его публично как утверждённый IETF-стандарт.

Актуальные первичные источники по crawler semantics:

- [OpenAI — Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
- [Anthropic — ClaudeBot and robots.txt](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity — Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Google — common crawlers / Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Apple — Applebot and Applebot-Extended](https://support.apple.com/en-us/119829)
- [Meta — Meta-ExternalAgent](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)

## 2. AI Citability — 70/100

### 2.1. Оценка 10 страниц

`Coverage` — оценочная доля секций страницы, которые можно извлечь как самостоятельный ответ с итоговым баллом 70+.

| Страница | Answer 30% | Self-contained 25% | Structure 20% | Stats 15% | Unique 10% | Итог | Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|
| [Главная](https://opten.space/) | 78 | 70 | 80 | 55 | 65 | **72** | 35% |
| [О проекте](https://opten.space/about) | 75 | 78 | 75 | 65 | 90 | **76** | 55% |
| [Learn hub](https://opten.space/learn) | 45 | 45 | 60 | 30 | 55 | **47** | 20% |
| [Урок: актуальные AI-инструменты](https://opten.space/learn/actual-ai-tools-2026) | 50 | 50 | 60 | 45 | 65 | **53** | 25% |
| [Блог](https://opten.space/blog) | 70 | 70 | 60 | 35 | 50 | **61** | 35% |
| [Структура промпта](https://opten.space/blog/prompt-structure) | 82 | 80 | 85 | 45 | 68 | **75** | 70% |
| [Kling 3.0: промпты](https://opten.space/blog/kling-3-prompts) | 82 | 78 | 85 | 42 | 65 | **74** | 65% |
| [Каталог моделей](https://opten.space/models) | 75 | 78 | 80 | 55 | 70 | **73** | 70% |
| [GPT Image 2](https://opten.space/models/gpt-image-2) | 88 | 85 | 88 | 60 | 75 | **82** | 80% |
| [Kling 3.0](https://opten.space/models/kling-3) | 90 | 88 | 88 | 65 | 78 | **84** | 85% |
| **Среднее** | **73.5** | **72.2** | **76.1** | **49.7** | **68.1** | **69.6 → 70** | **54%** |

Счёт отражает extractability, а не качество фактов или гарантированное цитирование конкретной AI-платформой.

### 2.2. Сильные блоки

1. **Страницы конкретных моделей.** Первые абзацы сразу называют сущность, разработчика и возможности. Например, Kling 3.0 описан через длительность, число шотов, аудио и назначение. Это самостоятельный answer block с именованными сущностями и числами.
2. **Структура ошибок на model pages.** Нумерованные H3 («местоимения вместо меток», «multi-shot без маркировки») хорошо сопоставляются с вопросами пользователей и могут цитироваться отдельно.
3. **FAQ + JSON-LD.** На главной, Learn, статьях и страницах моделей есть `FAQPage`; у статей также есть `BlogPosting`/`HowTo`, у моделей — `TechArticle` и `SoftwareApplication`.
4. **About как first-party source.** Страница связывает продукт с Владом Воронежцевым, даёт историю и числовые показатели. Это сильный материал для ответа «кто создал Opten», если факты синхронизированы с внешними профилями.
5. **Prerender.** Текст, headings и schema находятся в исходном HTML; AI-краулеру не требуется выполнять SPA.

### 2.3. Главные слабости

#### P1 — факты о моделях не подкреплены источниками

На четырёх проверенных editorial/model URL внешние ссылки ведут только в Chrome Web Store и Telegram. Ссылок на официальную документацию OpenAI/Kuaishou и дат проверки технических утверждений нет. Поэтому числовая насыщенность высокая, но **верифицируемая statistical density ниже визуального впечатления**.

Конкретное действие:

- добавить к каждой странице модели блок «Источники и дата проверки»;
- для чисел, лимитов, режимов и совместимости давать ссылку на official docs/release notes;
- отделять «официально заявлено» от «проверили в Opten»;
- добавить 2–3 first-party теста с входным prompt, настройками, датой и наблюдаемым результатом.

Критерий приёмки: у каждого изменяемого технического утверждения есть первичный источник или явная пометка собственного теста; дата проверки видима пользователю и в structured data.

#### P1 — Learn-страницы слишком тонкие для самостоятельной цитаты

В prerendered HTML [Learn hub](https://opten.space/learn) содержит около 72 слов в `<p>`, а выбранный [урок](https://opten.space/learn/actual-ai-tools-2026) — около 96. Основная ценность находится в видео, а не в текстовом ответе страницы. Для crawler, который не обрабатывает video transcript, это слабый источник.

Конкретное действие:

- на hub добавить 150–250 слов: что такое Opten Learn, чему учит, кому подходит, сколько открытых уроков и какие результаты получает ученик;
- на каждый урок добавить answer-first summary 100–180 слов, 5–7 ключевых выводов, главы/таймкоды и краткий transcript/конспект;
- каждый вывод должен называть предмет явно, без «это/он/они» вне контекста;
- не дублировать полный transcript без редакторской обработки: лучше короткие самостоятельные смысловые блоки.

Пример нового открытия урока:

> В этом уроке Влад Воронежцев сравнивает пять AI-сервисов для дизайна и контента в 2026 году по четырём задачам: идея, изображение, видео и сборка рабочего процесса. Выбор основан на личном тестировании около 40 сервисов; для каждого инструмента ниже указаны сильная задача, ограничение и момент урока с демонстрацией.

#### P2 — листинги уступают detail pages

- `/blog` имеет `H1`, затем карточки `H3`, то есть пропускает уровень `H2`.
- `/learn` повторяет H2 «Обучение ИИ» и содержит карточечный текст, который мало отвечает на вопросы.
- `/models` содержит много информативных карточек, но часть описаний заканчивается визуальным многоточием и не формирует завершённый ответ.

Решение: добавить тематические H2-кластеры, вводные answer blocks и завершённые 1–2 предложения для карточек. Не превращать hub в длинную статью; достаточно чёткой классификации и коротких определений.

#### P2 — мало сравнительных таблиц

У model pages есть списки, но в выборке почти нет HTML-таблиц. Для запросов «GPT Image 2 vs…», «Kling 3.0: лимиты», «какую модель выбрать» таблица из 3+ критериев обычно извлекается надёжнее абзаца.

Решение: добавлять только проверяемые таблицы — режим, вход, длительность/разрешение, сильная задача, ограничение, источник, дата проверки.

### 2.4. Entity/schema

Сильные стороны:

- стабильные `@id`: `https://opten.space/#org`, `#website`, `#software-app`, `#person-founder`;
- `Organization`, `Person`, `SoftwareApplication`, `WebSite`, page-specific schema связаны между собой;
- about/article author ссылается на founder entity;
- canonical и RU/EN архитектура доступны в исходном HTML.

Проблема: `Organization.sameAs` сейчас содержит личные YouTube/Telegram-профили Влада, а те же URL используются в `Person.sameAs`. Для knowledge graph это может смешивать **организацию/продукт** и **человека**.

Рекомендация P1:

- сохранить личные профили только в `Person.sameAs`;
- создать или определить постоянные брендовые профили Opten и добавить их в `Organization.sameAs`;
- Chrome Web Store оставить в `SoftwareApplication.sameAs` и при необходимости также в Organization только если схема явно описывает издателя;
- добавить `founder: {"@id":"https://opten.space/#person-founder"}` и согласованный `alternateName` вида `Opten — AI Prompt Scorer & Optimizer`;
- использовать одинаковые logo/name/description на сайте, в CWS, GitHub и будущей LinkedIn company page.

## 3. Brand Authority — 19/100

### 3.1. Расчёт

| Платформа | Балл | Вес | Вклад | Статус на 10.07.2026 |
|---|---:|---:|---:|---|
| YouTube | 45 | 25% | 11.25 | Активный канал основателя, но не отдельный бренд-канал; независимые видео о продукте не найдены. |
| Reddit | 5 | 25% | 1.25 | Точные web-поиски не нашли упоминаний; внутренний поиск Reddit не проверен из-за HTTP 403. |
| Wikipedia / Wikidata | 0 | 20% | 0.00 | Ни Opten AI-продукт, ни основатель не найдены в EN/RU Wikipedia API и Wikidata API; прямые URL 404. |
| LinkedIn | 0 | 15% | 0.00 | Релевантная company/founder entity не найдена; результаты «Opten» относятся к другим компаниям. |
| Other | 45 | 15% | 6.75 | Chrome Web Store, Chrome-Stats/Extpose, активный Telegram, публичный GitHub; нет найденных Product Hunt/HN/Quora/Stack Overflow/press/podcast сигналов. |
| **Итого** |  |  | **19.25 → 19/100** | **Minimal** |

### 3.2. YouTube — 45/100

**Подтверждено:** [канал Влада Воронежцева](https://www.youtube.com/@v.voronezhtsev) существует, на дату проверки публичная страница показывала примерно **5,16 тыс. подписчиков и 84 видео**. [RSS канала](https://www.youtube.com/feeds/videos.xml?channel_id=UC797Sd_fYNILYZFuXsjjFDA) показывает регулярные публикации, включая видео 9–10 июля 2026 года. В описании канала присутствует `opten_space_bot`, а в свежем длинном видео есть ссылка на курс на opten.space.

**Слабость:** название канала — «Влад Воронежцев | Про нейросети», не Opten. Точные web-поиски `site:youtube.com "opten.space"`, `"Opten" "промпт"` не вернули подтверждённых независимых обзоров/туториалов. Поэтому сильный creator signal пока слабо превращается в отдельную brand entity.

**Действие:** создать постоянный playlist/series «Opten», добавить одинаковую 1–2-сентенционную формулировку продукта в описания, выпускать демонстрации с названием Opten в title/transcript и получать независимые обзоры без скрытой рекламы.

### 3.3. Reddit — 5/100

Четыре точных публичных поиска по `opten.space`, `Opten prompt extension`, `Opten промпт`, имени основателя не вернули результатов. Это статус **«не найдено в публичной web-выдаче»**, а не доказанное отсутствие: прямой Reddit search был заблокирован без авторизации.

**Действие:** не публиковать рекламные посты от лица бренда. Сначала участвовать в 3–5 релевантных сообществах через полезные разборы промптов и публичные тесты; продукт упоминать только там, где он реально решает вопрос. KPI — независимые обсуждения/рекомендации и содержательные ответы, а не число ссылок.

### 3.4. Wikipedia / Wikidata — 0/100

Проверка выполнена официальными API:

- EN/RU Wikipedia search по `Opten`, `opten.space`, `Влад Воронежцев`, `Vlad Voronezhtsev` — релевантной статьи или упоминания не найдено;
- Wikidata `wbsearchentities` — релевантной сущности нет;
- прямые URL `/wiki/Opten` и `/wiki/Влад_Воронежцев` вернули 404.

Создавать Wikipedia-страницу сейчас не рекомендуется: найденных независимых источников недостаточно для устойчивой значимости. Сначала нужны независимые обзоры, отраслевые публикации, интервью и измеримые кейсы; редактирование собственной статьи создаст conflict of interest.

### 3.5. LinkedIn — 0/100 и риск смешения сущностей

Релевантной странице opten.space или профилю основателя по точным запросам не найдено. При этом имя уже занято более сильными сущностями:

- [OPTEN Ltd., Венгрия](https://www.linkedin.com/company/opten-kft-) — 2 440+ followers в снимке поиска;
- [OPTEN AG, Швейцария](https://www.linkedin.com/company/opten-ag/) — отдельная web/digital company;
- также существует Opten Power.

Это не юридический вывод о товарном знаке, а **knowledge-graph collision**: запрос «Opten» без дескриптора неоднозначен.

**Действие:** завести LinkedIn company page с именем `Opten — AI Prompt Scorer & Optimizer`, доменом `opten.space`, founder link и тем же описанием, что в schema/CWS. Всегда добавлять категорию продукта или домен к внешним упоминаниям, пока сущность не станет самостоятельной.

### 3.6. Chrome Web Store — главный внешний якорь

[Официальная карточка](https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl?hl=ru) на дату проверки показывала:

- **281 пользователь**;
- **5,0 / 2 оценки**;
- версия **1.4.1**, обновлена **7 июня 2026**;
- издатель связан с `opten.space`; Google показывает формулировку о хорошем publisher record.

Дополнительные индексируемые сущности: [Chrome-Stats](https://chrome-stats.com/d/iphkppgbobpilmphloffcalicmejacfl) и [Extpose](https://extpose.com/ext/iphkppgbobpilmphloffcalicmejacfl). Это полезные независимые каталоги, но они автоматически копируют store metadata и не равны редакционному обзору.

### 3.7. GitHub — присутствие есть, авторитет слабый

[Профиль zignifer](https://github.com/zignifer) публичен; [репозиторий opten-website](https://github.com/zignifer/opten-website) также публичен, на снимке GitHub — 0 stars, 1 fork, 615 commits. README всё ещё описывает общий «Build responsive landing page» и ведёт на staging `opten-website2.vercel.app`, а не формирует сильную продуктовую сущность.

**Действие:** обновить README как продуктовую страницу: canonical `https://opten.space`, однозначное описание, screenshots, архитектурный статус, link на CWS, лицензия/политика contribution, темы репозитория. Это повысит качество GitHub-сигнала без раскрытия приватных extension/backend репозиториев.

### 3.8. Telegram и другие платформы

[Telemetr](https://telemetr.io/uz/channels/2214268216-v_voronezhtsev) индексирует канал основателя и несколько постов про Opten; снимок показывает около **5 967** подписчиков и посты с 2,0–2,7 тыс. просмотров. Это полезный creator/community signal, но источник сторонний, а канал опять является личным, не отдельной brand entity.

По точным поискам не найдены релевантные Opten-упоминания на Product Hunt, Hacker News, Stack Overflow, в подкастах или независимой прессе. Quora — **не проверено** из-за robots/access restriction.

## 4. Несогласованные факты об одной сущности

### P1 — 60+ против 43+

- [Главная opten.space](https://opten.space/) и [каталог моделей](https://opten.space/models) заявляют **60+ моделей**.
- [Chrome Web Store](https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl?hl=ru) на 10.07.2026 говорит **43+ модели**.
- Chrome-Stats/Extpose копируют store-версию, поэтому AI-система может получить оба числа из разных индексируемых источников.

Это самый конкретный текущий entity-consistency дефект.

**Исправление:** определить один продуктовый факт с датой/версией: например, «63 model-specific profiles in the content catalog; extension coverage depends on supported platform and version». Обновить site FAQ, llms description, CWS RU/EN description, schema description, YouTube/Telegram pinned descriptions и GitHub README. Если store update отстаёт, не скрывать разницу: назвать отдельно «каталог моделей» и «модели, автоматически определяемые расширением».

Критерий приёмки: по пяти внешним поверхностям AI получает одно и то же число или ясно понимает разницу метрик.

### P1 — Person и Organization используют одинаковые sameAs

Личные YouTube/Telegram URL одновременно описывают Влада и Organization Opten. До появления брендовых профилей лучше явно связывать сущности через `founder`, а не объявлять личные аккаунты эквивалентом организации.

## 5. Публичная discoverability-выборка

На 10.07.2026 общий поиск `Opten`, `Opten prompt optimizer`, `Opten расширение промптов`, `opten.space` находил главную opten.space и CWS. Это подтверждает индексируемость branded entity.

В выборке четырёх небрендовых запросов:

- `промпты Kling 3.0`;
- `структура промпта для нейросети`;
- `промпты GPT Image 2`;
- `актуальные нейросети 2026 дизайн контент`;

opten.space не появился среди результатов, возвращённых используемым web-search инструментом. Это не точный rank-tracking и не доказательство отсутствия во всей выдаче, но полезный baseline: **бренд находится, тематический источник пока не всплывает стабильно**.

Фактические цитаты AI-платформ по этим запросам — **не проверены**. Для следующего измеримого шага нужен регулярный answer-share benchmark.

## 6. Приоритетный план

| ID | Приоритет | Действие | Почему | Критерий приёмки | KPI проверки |
|---|---|---|---|---|---|
| AI-01 | P1 | Синхронизировать 60+/43+ и canonical product description | AI получает конфликтующие факты | Site, CWS, llms, schema, YouTube, GitHub дают один факт или ясное разделение метрик | 0 конфликтов в 20 brand/entity prompts |
| AI-02 | P1 | Добавить первичные источники и first-party тесты на model/blog pages | Числа есть, доказательств нет | У каждого изменяемого technical claim есть official source/date или test method | Citability Stats: ~50 → 70+ |
| AI-03 | P1 | Усилить текст Learn: summary, key takeaways, chapters, transcript notes | Видео почти не превращается в цитируемый HTML | 100–180 слов answer-first + 5–7 выводов + таймкоды на урок | Learn citability: 47–53 → 70+ |
| AI-04 | P1 | Развести Person и Organization, создать брендовые профили | Смешение сущностей и collision с OPTEN Ltd/AG | `Person.sameAs` личные; `Organization.sameAs` только бренд; founder relation | Корректная entity resolution в schema validator и AI brand prompts |
| AI-05 | P1 | Построить независимые упоминания | Brand Authority 19/100 | 5+ независимых YouTube/tutorial/review mentions, содержательные community mentions, 10+ CWS reviews | Brand Authority пересчёт ≥30 |
| AI-06 | P2 | Очистить/разделить `llms-full.txt` | 2,5 МБ повторяющегося текста и ложная note | Нет global chrome/CTA/footer на каждой записи; note соответствует размеру | Размер и duplication ratio существенно ниже |
| AI-07 | P2 | Исправить hub hierarchy и карточки | `/blog` H1→H3, thin hubs | H1→H2→H3; у каждого кластера answer block | Structure hubs ≥75 |
| AI-08 | P2 | Обновить GitHub README и профиль | Публичный repo не объясняет продукт | canonical domain, CWS, product description, screenshot, topics | Branded GitHub result с корректным snippet |
| AI-09 | P2 | Создать weekly AI answer-share benchmark | Реальные AI citations пока неизвестны | 20 фиксированных RU/EN prompts × ChatGPT/Perplexity/Gemini/Яндекс, URL citation log | Share of Answers, citation rate, factual consistency |

## 7. Рекомендуемый measurement baseline

Разделить 20 prompts на четыре группы:

1. **Brand/entity:** «Что такое Opten?», «Кто создал Opten?», «Сколько моделей поддерживает Opten?», «Где работает Opten?».
2. **Category:** «расширение для улучшения промптов», «AI prompt scorer for image generators», «как проверить промпт перед генерацией».
3. **Model-specific:** Kling 3.0, GPT Image 2, Midjourney 8, Nano Banana — structure/errors/examples.
4. **Learn:** «актуальные нейросети для контента 2026», «бесплатное обучение AI-видео», «AI-дизайн карточек товаров».

Для каждого ответа фиксировать:

- платформа, язык, страна/режим, дата;
- упомянут ли Opten;
- есть ли ссылка на opten.space и какой URL;
- какой факт о model count/support sites/price назван;
- совпадает ли факт с canonical product sheet;
- какие конкуренты названы и из каких источников;
- branded mention, recommendation и citation считать отдельно.

Исходный baseline этого read-only аудита:

- crawler access: **100/100**;
- citability: **70/100**, coverage **54%**;
- brand authority: **19/100**;
- branded web discoverability: подтверждена;
- тематическая discoverability в выборке: **0 из 4 запросов** среди возвращённых результатов;
- фактический AI Share of Answers: **не проверен**.

## 8. Пять главных выводов

1. **Технической блокировки AI-поиска нет:** Tier 1 crawlers разрешены, prerendered HTML, sitemap и llms.txt доступны.
2. **Лучший цитируемый актив — страницы моделей:** GPT Image 2 и Kling 3.0 набрали 82–84/100 благодаря answer-first определениям, структуре ошибок и schema.
3. **Самый слабый контентный шаблон — Learn:** видео есть, но crawler получает слишком мало самостоятельного текста; страницы набрали 47–53/100.
4. **Главный entity-дефект — разные факты:** сайт говорит 60+ моделей, Chrome Web Store — 43+; AI может уверенно повторять оба несовместимых числа.
5. **Главный ростовой барьер — не crawlability, а authority:** Brand Authority 19/100 из-за отсутствия найденных Reddit/Wikipedia/LinkedIn/press сигналов и малого числа независимых упоминаний; сильный канал основателя пока не равен самостоятельной сущности Opten.
