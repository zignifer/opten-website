# Полный GEO + SEO-аудит opten.space

> [!note] Статус: стартовый сводный ресёрч
> Это исходный аудит и снимок данных на дату проверки, а не действующий
> implementation backlog. Решения, последовательность и критерии приёмки
> финализированы в [[../SEO-GROWTH-PLAN|каноническом SEO Growth Plan]].

> [!warning] Исправление продуктового статуса от 11.07.2026
> Курс `ai-content-marketing-2026` официально запущен и намеренно показывается
> в public Learn, статьях, Telegram и других маркетинговых поверхностях.
> Рекомендации этого снимка удалить ссылки на курс «до запуска» устарели и не
> должны выполняться. Нулевой урок доступен после проверки подписки на
> Telegram; уроки 1+ требуют отдельной покупки и course entitlement.

**Дата аудита:** 10 июля 2026 года  
**Сайт:** https://opten.space  
**Тип проекта:** SaaS / Chrome-расширение + контентный издатель RU/EN  
**Режим:** только чтение  
**Охват:** Google Search Console, Яндекс.Вебмастер, live-сайт, репозиторий, sitemap из 214 URL, техническая live-выборка до 50 URL, Google SERP и GEO/AI-платформы

---

## Резюме для владельца

**Итоговый GEO Score: 55/100 (слабый / Poor).**

У opten.space хорошая техническая основа: публичные страницы пререндерены, Google и Яндекс их индексируют, sitemap и hreflang исправны, основные AI-краулеры допущены. Органическая видимость быстро растёт: за последние полные 28 дней показы увеличились примерно в 9,8 раза в Google и в 9 раз в Яндексе.

Главное ограничение роста сейчас — не массовая индексация, а превращение показов в клики и авторитет. Google дал 2 373 показа при CTR 1,18%, Яндекс — 3 922 показа при CTR 1,99%. Большая часть новых запросов находится на позициях 5–10, но страницы проигрывают более полным гайдам, видео и community-источникам. Для AI-поиска контент технически доступен, однако внешняя сущность бренда слаба: Brand Authority — 19/100. Отдельное исключение — Google пока не индексирует `/blog` как хаб, хотя большинство проверенных detail pages уже индексируются.

### Пять главных проблем

1. **P0 — GPT Image 2 смешивает API и ChatGPT и публикует неподдерживаемые размеры.** `/models/gpt-image-2` и `/blog/gpt-image-2` заявляют 2560×1440/4K, произвольные размеры, кратность сторон 16 и диапазон до 3:1. Текущий OpenAI API reference для `gpt-image-2` перечисляет только `1024×1024`, `1024×1536`, `1536×1024` и `auto`; ChatGPT Images также представлен отдельной моделью `chatgpt-image-latest`.
2. **P0 — фактические ошибки на странице Midjourney 8.1.** На `/models/midjourney-8.1` указаны устаревшие сведения про alpha-only, отсутствие Discord, `--hd`, `--no` и `--q`. Это прямой риск доверия пользователей и AI-систем.
3. **P1 — высокий объём показов не конвертируется в клики.** В Google CTR снизился с 9,05% до 1,18%, в Яндексе — с 3,90% до 1,99% на фоне резкого расширения небрендовой семантики.
4. **P1 — generic-запросы ведут на слишком узкие model pages.** По Runway, Wan, PixVerse и похожим кластерам выдача предпочитает полные руководства, библиотеки примеров, видео и community-материалы.
5. **P1 — слабая внешняя авторитетность.** AI Citability составляет 70/100, но Brand Authority — только 19/100: почти нет независимых обзоров, Reddit/LinkedIn/press-сигналов и брендовых профилей.

### Пять главных возможностей

1. Поднять CTR у URL и кластеров уже находящихся на позициях 5–10, не создавая новые страницы без необходимости.
2. Создать один сильный broad-intent guide по Runway и аналогично переработать кластеры Wan/PixVerse, сохранив version-specific model pages.
3. Добавить первичные источники, даты проверки и воспроизводимые тесты на быстро меняющиеся страницы моделей.
4. Превратить Learn из video-first в crawler-readable формат: summary, выводы, таймкоды и редакторский конспект.
5. Синхронизировать entity-факты Opten и построить независимые упоминания вокруг уже существующего канала основателя.

---

## Система статусов

- **Подтверждено данными** — вывод получен из API, live HTTP/HTML, репозитория или официального источника.
- **Вероятная причина** — несколько сигналов согласуются, но причинность нельзя доказать одной аналитикой.
- **Гипотеза для проверки** — разумное направление эксперимента без достаточного baseline.
- **Не удалось проверить** — доступа, квоты или надёжной локализации выдачи не было.

---

## Доступы и качество данных

| Источник | Статус | Выбранное свойство | Последняя полная дата | Что проверено | Ограничения |
|---|---|---|---|---|---|
| Google Search Console | Доступ есть, owner | `sc-domain:opten.space` и `https://opten.space/` | 08.07.2026 | Performance, sitemap, country/device/search type, page/query, 12 URL Inspection + повторная выборка | Query dimension privacy-suppressed; последние неполные дни исключены; CWV field не выгружен |
| Яндекс.Вебмастер | Доступ есть, VERIFIED | `https:opten.space:443` | 08.07.2026 | KPI, devices, queries, pages, diagnostics, indexing, sitemap, broken/external links | Live SERP потребовал CAPTCHA; присвоенного региона в доступном API нет |
| Sitemap | Доступен | `https://opten.space/sitemap.xml` | live 10.07.2026 | 214 URL, lastmod, RU/EN/x-default, reciprocity | GSC поле `indexed: 0` не использовано как coverage truth |
| Live crawl | Доступен | `https://opten.space` | 10.07.2026 | До 50 URL/ресурсов, raw HTML, redirects, headers, mobile, assets | Не полный лог-файловый crawl всех посещений ботов |
| PageSpeed / CrUX | Частично | priority templates | Исторический lab 07.06.2026 | Lab baseline + live asset/TTFB checks | PSI API вернул 429; свежего CrUX p75 нет |
| Google SERP | Доступен | RU locale spot-check | 10.07.2026 | Runway и Wan, типы результатов и конкуренты | Не rank tracker и не персонализированная статистика |
| Яндекс SERP | Ограничен | — | — | Позиции и страницы взяты из Вебмастера | CAPTCHA; точный live-состав выдачи не заявляется |

---

## Сводный GEO Score

| Категория | Балл | Вес | Взвешенный вклад |
|---|---:|---:|---:|
| AI Citability | 70/100 | 25% | 17,50 |
| Brand Authority | 19/100 | 20% | 3,80 |
| Content E-E-A-T | 60/100 | 20% | 12,00 |
| Technical GEO | 77/100 | 15% | 11,55 |
| Schema & Structured Data | 69/100 | 10% | 6,90 |
| Platform Optimization | 35/100 | 10% | 3,50 |
| **Overall GEO Score** |  |  | **55,25 → 55/100** |

Независимая повторная выборка по тем же rubric дала близкие диапазоны: AI Citability 67–70, Brand Authority 19–20, Content E-E-A-T 58–60, Technical GEO 77–83, Schema 67–69 и Platform Optimization 35–37. В зависимости от строгости итог остаётся **55–56/100**; в отчёте сохранён консервативный балл 55.

Отдельный показатель **AI Crawler Access — 100/100**: OpenAI, Anthropic, Perplexity, Google, Bing/Copilot и другие основные crawler user-agents не заблокированы.

---

## Основные KPI поиска

### Google Search Console

| Период | Клики | Показы | CTR | Ср. позиция | Изменение кликов | Изменение показов | Изменение CTR | Изменение позиции |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 11.06–08.07.2026 | 28 | 2 373 | 1,18% | 10,57 | +27,3% | +876,5% | −7,87 п.п. | хуже на 2,84 |
| 14.05–10.06.2026 | 22 | 243 | 9,05% | 7,73 | — | — | — | — |
| 10.04–08.07.2026 | 58 | 2 643 | 2,19% | 10,23 | нет сопоставимого пред. периода | нет сопоставимого пред. периода | — | — |

**Подтверждено данными:** сайт вошёл в фазу быстрого расширения видимости. Падение CTR в абсолютном выражении не означает падение сайта: клики выросли, но показы стали значительно шире и менее брендовыми.

#### Google по устройствам, последние 28 полных дней

| Устройство | Клики | Показы | CTR | Ср. позиция |
|---|---:|---:|---:|---:|
| Desktop | 23 | 1 880 | 1,22% | 11,40 |
| Mobile | 5 | 484 | 1,03% | 7,36 |
| Tablet | 0 | 9 | 0% | — |

#### Google по странам

- США: 972 показа, 3 клика, CTR 0,31%, позиция 11,95.
- Индия: 128 показов, 1 клик.
- Нидерланды: 101 показ, 2 клика.
- Россия: 84 показа, 4 клика, CTR 4,76%, позиция 28,95.
- Германия: 85 показов, 1 клик; Великобритания: 68 показов, 0 кликов.

**Вывод:** Google-видимость уже глобальная и EN-led. Главный объём приходит из США, но текущие сниппеты/позиции почти не конвертируют его в переходы. GSC country нельзя интерпретировать как город или область.

### Яндекс.Вебмастер

| Период | Клики | Показы | CTR | Ср. позиция | Изменение кликов | Изменение показов | Изменение CTR | Изменение позиции |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 11.06–08.07.2026 | 78 | 3 922 | 1,99% | 8,37 | +358,8% | +799,5% | −1,91 п.п. | хуже на 0,38 |
| 14.05–10.06.2026 | 17 | 436 | 3,90% | 7,99 | — | — | — | — |
| 10.04–08.07.2026 | 102 | 4 375 | 2,33% | 8,31 | нет сопоставимого пред. периода | нет сопоставимого пред. периода | — | — |

#### Яндекс по устройствам, последние 28 полных дней

| Устройство | Клики | Показы | CTR | Ср. позиция |
|---|---:|---:|---:|---:|
| Desktop | 51 | 1 392 | 3,66% | 8,85 |
| Mobile + tablet | 27 | 2 530 | 1,07% | 8,10 |

**Подтверждено данными:** mobile даёт 64,5% показов Яндекса и является главным CTR-дефицитом. Позиция mobile даже немного лучше desktop, поэтому проблема не объясняется только ранжированием.

#### Бренд / небренд в Яндексе

| Сегмент | Показы | Клики | CTR |
|---|---:|---:|---:|
| Точный брендовый | 12 | 2 | 16,67% |
| Небрендовый | 3 910 | 76 | 1,94% |

В Google query dimension раскрывает только 540 из 2 373 показов и 8 из 28 кликов, поэтому точный brand/nonbrand split для Google делать нельзя. Запрос `opten` дал 415 показов и 5 кликов, но он неоднозначен из-за одноимённых компаний.

---

## Динамика и наиболее вероятные причины

### Что растёт

- Яндекс: май — 153 показа / 13 кликов; июнь — 2 987 / 74; 1–8 июля — 1 231 / 14.
- Google: появились новые EN-страницы с сотнями показов, особенно Graphify Find и Flux 2.
- В Яндексе основное расширение идёт через model-specific запросы Wan, Runway, PixVerse, LTX, Recraft, Seedream.

### Почему CTR снизился

1. **Подтверждено:** семантика резко расширилась из узкой/брендовой в небрендовую.
2. **Подтверждено:** большая часть новых показов находится на позициях примерно 5–12, где видео, AI Overview, community и агрегаторы отбирают клики.
3. **Вероятная причина:** одинаковый шаблон title «Промпты для X: структура, ошибки, примеры» недостаточно выделяет конкретную ценность отдельных моделей.
4. **Вероятная причина:** часть landing pages соответствует модели, но не broad-intent запросу «как писать промпты для…».
5. **Гипотеза:** mobile snippets и первый экран хуже раскрывают ответ для Яндекса; это нужно проверять отдельным snippet/UX экспериментом, а не переписыванием всех title сразу.

Алгоритмическое обновление как причина падения не заявляется: данных для такого вывода нет.

---

## Индексация

### Google

- Sitemap принят без warnings/errors: submitted 210 на момент последней загрузки GSC.
- Поле sitemap `indexed: 0` противоречит прямой URL Inspection и не используется как доказательство нулевой индексации.
- В исходной выборке 11 из 12 URL имели статус Submitted and indexed, crawl allowed, успешный fetch и self-canonical. Повторная проверка 10 июля подтвердила индексацию главной, `/models/wan`, `/models/midjourney-8.1`, `/learn` и `/en/blog/flux-2-prompts`, но `/blog` имеет статус `Discovered - currently not indexed`.
- `/blog/ai-for-work` был Unknown to Google, но опубликован 10 июля, позже последней полной даты GSC 7 июля. Это нормальный лаг, а не SEO-ошибка.

### Яндекс

- SQI/ИКС: 10.
- Searchable pages: 208; excluded pages: 7.
- Live sitemap: 214 URL; текущая скорректированная coverage — примерно 206/214, или 96,3%.
- Два legacy `/guides/gpt-image-2` URL ещё видны в поисковом массиве, но уже делают 308 на `/blog/gpt-image-2`; консолидация настроена правильно.
- В sitemap, но пока не в поиске: 8 новых URL, включая `ai-for-work`, `free-ai-courses`, `neural-networks-from-scratch` и отдельные Learn-страницы. Для свежих публикаций это не основание для массового переобхода.
- 9 «битых» внутренних ссылок Яндекса ведут на намеренно закрытые `/login?...` и `/prompt-library`; для пользователя они отвечают 200. Это diagnostic noise, не реальные 404.

### Матрица ключевых шаблонов

| Шаблон | HTTP | Indexable | Canonical/hreflang | Sitemap | Google | Яндекс | Вывод |
|---|---:|---|---|---|---|---|---|
| `/` | 200 | Да | Pass | Да | Indexed | Searchable | Здоров |
| `/blog/*` | 200 | Да | Pass | Да | Detail pages indexed; `/blog` discovered/not indexed; new lag | Большинство searchable | Нужна внутренняя обнаруживаемость и повторная проверка хаба после исправления SSR-ссылок |
| `/models/*` | 200 | Да | Pass | Да | Выборка indexed | Основной драйвер | Улучшать intent и CTR |
| `/learn/*` | 200 | Да | Pass | Да | Выборка indexed | Частично | Тонкий text layer и слабые hub links |
| `/guides/*` | 308 | Нет | Redirect | Нет | Consolidated | Legacy rows | Работает правильно |
| `/login`, `/account`, `/app/*` | 200 | Noindex | Auth/noindex | Нет | Нет показов | Нет показов | Контрактные служебные URL |
| `/learn/courses/*` | 200 | Noindex | Hidden course | Нет | Нет показов | Нет показов | Не должен быть связан с public Learn |

### Важная граница: публичный Learn и закрытый платный курс

**Подтверждено проектным контрактом и live-проверкой:** это две разные поверхности.

- `/learn`, `/en/learn`, публичные уроки и Learn Finds — открытый индексируемый SEO-контент. Рекомендации про HTML-ссылки, answer-first summary, таймкоды и текстовые конспекты относятся только к ним.
- `/learn/courses/*` — намеренно скрытый/noindex Kinescope-курс. Полные видео и материалы должны оставаться закрытыми; доступ выдаётся сервером только после проверки отдельного course entitlement, полученного после покупки. Это не Pro-entitlement и не публичная Learn-библиотека.
- Закрытые course URL не должны попадать в sitemap, `llms.txt`, EN sibling map или публичную навигацию до отдельного продуктового решения о запуске.
- SEO-аудит **не рекомендует открывать, индексировать, публиковать transcript или отдавать playback URL** платных уроков поисковым и AI-краулерам.
- Найденная проблема относится только к тому, что ссылки на hidden-course URL уже присутствуют в raw HTML публичного `/learn`. Рекомендация — убрать эти публичные ссылки до запуска; gating, авторизация и платный доступ должны остаться без изменений.

---

## Географическое SEO

Opten — глобальный онлайн-SaaS, а не локальный бизнес с филиалами. Поэтому диагностики Яндекса `NO_REGIONS` и `NOT_IN_SPRAV` не являются основанием создавать городские страницы, добавлять фиктивный адрес или назначать случайный регион.

| География | Язык/URL | Фактическая видимость | Основная проблема | Действие |
|---|---|---|---|---|
| Россия / RU | RU без префикса | Сильнее в Яндексе; model queries 5–10 | Mobile CTR 1,07%, generic intent | Переработать snippets и broad guides; сохранить RU canonical |
| США / EN | `/en/*` | 972 показа Google, CTR 0,31% | Позиции около 12, слабая brand authority | EN source-backed guides + external mentions |
| Другие страны | `/en/*` | Ранние показы | Мало данных для сегментации | Не создавать country pages без спроса/локальной ценности |

Hreflang RU/EN/x-default проверен: 214 sitemap-блоков содержат три взаимных alternate, ошибок reciprocity не найдено. Принудительных IP-редиректов не выявлено.

**Не удалось подтвердить:** присвоенный Яндексом регион через доступный API. Но для digital-only продукта это не текущий ростовой рычаг.

---

## Запросы и посадочные страницы

### Google: страницы с крупнейшей видимостью за 28 дней

| URL | Показы | Клики | CTR | Позиция | Диагноз |
|---|---:|---:|---:|---:|---|
| `/` | 606 | 10 | 1,65% | 6,60 | Высокий бренд/generic mix, CTR просел относительно прошлого периода |
| `/en/learn/finds/graphify-obsidian-claude-code-second-brain` | 416 | 10 | 2,40% | 10,13 | Сильный новый EN entry point |
| `/en/blog/flux-2-prompts` | 210 | 1 | 0,48% | 10,63 | Высокий CTR-потенциал после intent/snippet review |
| `/en/blog/ai-face-swap` | 72 | 0 | 0% | 7,81 | Позиция хорошая, проверить состав SERP и snippet |
| `/en/models/midjourney-niji` | 72 | 0 | 0% | 10,00 | Нужна более конкретная ценность сниппета |
| `/models/grok-imagine` | 33 | 0 | 0% | 8,24 | Быстрая возможность, но сначала проверить intent |

### Яндекс: страницы с крупнейшей видимостью за последние 14 дней

| URL | Показы | Клики | CTR | Позиция | Точное направление |
|---|---:|---:|---:|---:|---|
| `/models/wan` | 313 | 0 | 0% | 8,28 | Сильный answer-first intro + examples/source block; оценить отдельный broad guide |
| `/models/runway-gen4.5` | 267 | 1 | 0,37% | 8,31 | Развести generic Runway и version-specific intent |
| `/models/pixverse-6` | 195 | 2 | 1,03% | 7,42 | Добавить реальные примеры/ограничения и более отличимый snippet |
| `/models/ltx-2` | 176 | 6 | 3,41% | 8,57 | Уже лучший CTR группы; использовать как шаблон сравнения |
| `/models/recraft-v4` | 161 | 1 | 0,62% | 8,28 | Усилить intent «как писать» и визуальные/проверяемые примеры |
| `/blog/image-to-video` | 35 | 0 | 0% | 4,69 | Приоритетный CTR-эксперимент: позиция уже высокая |
| `/models/z-image` | 37 | 6 | 16,22% | 10,64 | Положительный benchmark, не переписывать без причины |

### Приоритетные query-кластеры Яндекса

| Кластер | Показы | Типичная позиция | Текущая проблема | Рекомендация |
|---|---:|---:|---|---|
| Как писать промпты для Runway | 70–80 на вариант | 6,7–9,8 | Варианты делятся между Gen-4 и Gen-4.5 | Создать/усилить broad Runway guide; model pages оставить version-specific |
| Wan prompts / промпты Wan | 81+ на отдельный query | ~5,3–8,3 | 0 кликов на ведущем URL | Examples + formula + limits + source-backed FAQ; проверить snippet |
| Примеры промптов PixVerse | 82 | ~6,0 | CTR ниже ожидаемого | Сильные готовые примеры с ожидаемым эффектом и ошибками |
| Как писать промпты Recraft | 105 | ~9,7 | 0 кликов | Сопоставить страницу с обучающим intent, добавить практический mini-test |
| LTX Studio AI примеры | 76 | ~8,5 | Средний CTR, есть спрос | Расширить example library и внутренние ссылки |

---

## Каннибализация

1. **Runway — вероятная intent-каннибализация.** Варианты широкого запроса распределяются между `/models/runway-gen4` и `/models/runway-gen4.5`. Страницы нужны обе, но broad intent должен получить отдельный главный guide или чёткий hub.
2. **GPT Image 2 RU/EN — не каннибализация.** Один точный EN technical query показывал обе языковые версии, но hreflang/self-canonical корректны и объём мал. Это не отменяет отдельный P0 по достоверности API/ChatGPT-фактов.
3. Массовой подтверждённой каннибализации по остальным кластерам не найдено из-за ограниченной query-level выборки GSC.

Не применять canonical/redirect автоматически. Сначала развести intent: broad guide, version-specific model page, comparison page.

---

## Актуальная выдача и конкуренты

### Google: «как писать промпты для runway»

В первой странице преобладают VC.ru, YouTube, Reddit, Filmora, prompt library, PDF/курс, Habr, Neurost и Threads. Opten в проверенной первой странице не появился.

**Что предпочитает выдача:** полный гайд с формулой, 10+ примерами, визуальными категориями, советами, автором и community/video-сигналами. Узкая страница конкретной версии модели не полностью соответствует этому intent.

### Google: «промпты wan»

Выдача включала AI Overview, Reddit, YouTube, Postium, VC.ru, Neurost, GPTunnel, Klerk, Hugging Face Forum и Habr. AI Overview ссылался на внешние источники, а community/video занимали заметную долю.

### Поисковые конкуренты

| Тип | Примеры | Почему выигрывают | Что взять, не копируя |
|---|---|---|---|
| Редакционные платформы | VC.ru, Habr, Klerk | Доменный авторитет, авторы, обсуждения | Публиковать оригинальные исследования/кейсы с canonical strategy |
| Видео | YouTube | Демонстрация результата и доверие | Связать видео, transcript и article entity |
| Community | Reddit, Hugging Face Forum | Независимые ответы и опыт | Получать естественные обсуждения, не спамить ссылками |
| Практические гайды | Filmora, Postium | Полнота, примеры, изображения, шаги | Reproducible mini-tests и проверяемые таблицы |
| Prompt libraries | prompt1, Neurost, GPTunnel | Быстрое совпадение с «примеры/готовые промпты» | Сделать примеры копируемыми и модельно-специфичными |

Точный live-состав Яндекса не заявляется из-за CAPTCHA; для него использованы собственные позиции и landing pages из Webmaster API.

---

## Техническое SEO и GEO — 77/100

### Что работает

- `robots.txt`, sitemap, canonical и hreflang исправны.
- Все 214 sitemap URL вернули 200, self-canonical, один H1 и готовый HTML; hreflang RU/EN/x-default взаимный.
- `http://opten.space` и `https://www.opten.space` нормализуются одним hop, но сочетание `http://www` проходит два hop; legacy `/guides/*` делает один 308-hop.
- Настоящая 404 отвечает 404 и noindex.
- Основные AI-краулеры явно или wildcard-разрешены.
- TTFB выборки 396–531 мс; Vercel cache hit, gzip/Brotli и immutable assets работают.
- IndexNow key и build pipeline присутствуют.

### Высокий приоритет

| Проблема | Доказательство | Влияние | Точное действие | Приёмка |
|---|---|---|---|---|
| Неполный серверный link graph | 46 из 214 sitemap URL без входящей server-rendered HTML-ссылки, ещё 2 в изолированном кластере; `/blog`: 12/24 и `/learn`: 3/11 непосредственно из хабов | Crawl depth, internal equity, AI discovery | Вернуть ценные URL в SSR-хабы/related-блоки; намеренно скрытые indexable URL пересмотреть отдельно | 100% ценных sitemap URL имеют HTML inbound link, depth ≤3 |
| Тяжёлое avatar video | RU 2,79 МБ, EN 12,45 МБ; компонент вызывает load/play | LCP/mobile bandwidth | Poster, `preload=none`, загрузка после действия/idle, перекодировать EN | Initial payload <1 МБ; видео не скачивается до политики загрузки |
| Hidden course связан из public Learn | Raw `/learn` содержит `/learn/courses/*` | Нарушение контракта, crawl noise | Удалить только публичные ссылки до запуска; не менять noindex, entitlement и Kinescope gating | В source `/learn` нет course URL; закрытые видео доступны только после course entitlement |
| Legacy Learn — client redirect | `/app/learn*`, `/space/learn*` отвечают 200 | Структурный риск консолидации | 301/308 до SPA rewrite | Один hop на canonical 200 |

По данным GSC/Яндекса legacy Learn и hidden course сейчас не получают показов, поэтому их SEO-эффект не следует завышать. Приоритет здесь основан также на архитектурном контракте.

### Средний/низкий приоритет

- Согласовать `Disallow` и `noindex` для HTML-зон после URL Inspection; не ослаблять защиту API и приватных маршрутов.
- Ввести CSP сначала в Report-Only, учитывая Supabase, Paddle, YouTube/Kinescope.
- Увеличить header tap targets до 44×44 минимум.
- Снизить основной JS примерно с 250 КБ compressed до <200 КБ route splitting.
- `/blog/` → `/blog` одним redirect; убрать canonical home с настоящей 404.

### Core Web Vitals

Свежих field p75 нет. Исторический mobile lab от 07.06.2026: home 98/LCP 2,1 с; Learn 82/LCP 3,9 с; Blog 88/LCP 3,6 с. Эти значения не являются текущими CrUX и предшествуют июльскому video avatar.

---

## Контент и E-E-A-T — 60/100

| Компонент | Балл | Диагноз |
|---|---:|---|
| Experience | 19/25 | Сильный авторский голос, процессы, before/after, видео; мало воспроизводимых доказательств |
| Expertise | 16/25 | Глубина выше среднего; почти нет primary sources и test methodology |
| Authoritativeness | 3/25 | Широкое покрытие темы, но почти нет независимого признания |
| Trustworthiness | 12/25 | HTTPS/legal/third-party attribution сильны; мешают ошибки свежести и отсутствие policies |
| Topical authority modifier | +10 | 24 blog + 62 model + Learn-кластеры |

### P0: исправить факты GPT Image 2 и Midjourney 8.1

#### GPT Image 2

`/models/gpt-image-2` и `/blog/gpt-image-2` одновременно описывают API-модель `gpt-image-2` и поведение ChatGPT Images: thinking mode, web search, self-checking и Instant mode. В тех же RU/EN текстах заявлены 2560×1440 как «стабильный максимум», 3840×2160 как экспериментальный, произвольные стороны, кратные 16, и отношение до 3:1. Текущий официальный OpenAI API reference перечисляет `gpt-image-2` и `chatgpt-image-latest` как разные model IDs и для Images API допускает только `1024×1024`, `1024×1536`, `1536×1024` или `auto`.

**Действие:** разделить API- и ChatGPT-поверхности, убрать неподдерживаемые API-размеры и непроверенные ограничения, синхронно исправить RU/EN model/blog/FAQ/schema и добавить видимый блок «Источник и проверено 10.07.2026». Возможности ChatGPT описывать отдельно и только по официальному ChatGPT-источнику.

#### Midjourney 8.1

Локальная страница `/models/midjourney-8.1` утверждает, что V8.1 доступна только в alpha, не работает в Discord, HD является default и `--hd` отсутствует, `--no` удалён, а `--q` входит в safe set. Актуальные официальные release notes/docs Midjourney показывают обратное: V8.1 доступна на web и Discord, стала default, поддерживает `--no`, поддерживает `--hd/--sd`, а quality parameter для неё не поддерживается.

**Действие:** сверить весь файл с официальными docs, исправить одновременно RU/EN, блог `prompt-structure`, FAQ/schema и добавить `dateModified` + видимый блок источников.

### Остальные content gaps

- Model/blog pages: добавить «Источники и дата проверки» и отделить official claim от Opten test.
- Практические кейсы: публиковать input, settings, output, дату, критерий оценки и ограничения.
- Learn: 100–180 слов answer-first, 5–7 выводов, chapters/timestamps, редакторский transcript.
- About/author: расширить проверяемую биографию, опыт, speaking/publications без выдуманных credentials.
- Добавить editorial, corrections и affiliate/commercial disclosure policy.
- Уменьшить формульность SEO2-материалов: больше оригинальных наблюдений, источников и различий между темами.

---

## AI-видимость

### AI Citability — 70/100

| Шаблон/страница | Балл | Вывод |
|---|---:|---|
| `/models/kling-3` | 84 | Лучший цитируемый detail page |
| `/models/gpt-image-2` | 82 | Сильные answer blocks и структура, но factual P0 делает цитируемость рискованной до исправления |
| `/about` | 76 | Сильный first-party entity source |
| `/blog/prompt-structure` | 75 | Хорошая extractability, но факты требуют проверки |
| `/` | 72 | Достаточная основа, средняя statistical density |
| `/blog` | 61 | Hub слабее detail pages |
| `/learn/actual-ai-tools-2026` | 53 | Основная ценность скрыта в видео |
| `/learn` | 47 | Самый слабый crawler-readable шаблон |

Citability coverage — 54%: примерно половина секций выборки достаточно самостоятельна для извлечения как ответ.

### Brand Authority — 19/100

- Chrome Web Store — главный внешний якорь: 281 пользователь, 5,0/2 оценки, версия 1.4.1 на дату проверки.
- Канал основателя активен, но пока не создаёт отдельную brand entity Opten.
- Не найдены устойчивые независимые Reddit, Wikipedia/Wikidata, LinkedIn company, press/podcast сигналы.
- Название Opten сталкивается в knowledge graph с OPTEN Ltd/AG и другими одноимёнными компаниями.
- GitHub repo публичен, но README всё ещё описывает generic landing page и staging URL.

### Entity-конфликт 60+ vs 43+

Сайт заявляет 60+ моделей, Chrome Web Store — 43+. Это может быть не фактическим противоречием, если одно число означает контентный каталог, а другое — модели, автоматически поддерживаемые расширением, но сейчас разница не объяснена.

**Действие:** определить canonical product sheet и явно развести метрики: например, «63 model-specific profiles in content catalog» и «extension coverage depends on platform/version». Синхронизировать сайт, CWS, schema, llms, YouTube/Telegram и GitHub.

---

## Schema & Structured Data — 69/100

Схема технически доставляется хорошо: на 36 из 36 live RU/EN страниц JSON-LD валиден, находится в `<head>` и совпадает с локальным prerender. Проверенные 198 URL внутри schema разрешаются, canonical/hreflang согласованы, а FAQ visible content точно совпадает с `FAQPage`.

Главные семантические ошибки:

1. На большинстве Blog/Model/Learn страниц author представлен только локальным `@id`, но соответствующий Person node не развёрнут в этом page graph. Добавить ссылку на стабильную author URL и полноценный Person node или связать с глобальной сущностью доступным способом.
2. Model `SoftwareApplication` использует `brand` и `isRelatedTo` вне их допустимого Schema.org domain; `TechArticle`/`WebPage` не связаны с `#model`. Для FLUX хостинг Replicate/fal.ai смешан с разработчиком Black Forest Labs.
3. В Learn Finds сторонний YouTube `VideoObject` публикуется как `publisher=Opten`. Opten может быть автором конспекта/страницы, но не издателем исходного видео. У `/learn/ai-marketplace-product-cards` uploadDate страницы/видео также расходится с датой источника, а `inLanguage` меняется вместе с языком страницы при одном и том же видео.
4. У model/about Article отсутствует `image`; у Organization только три `sameAs` и нет `knowsAbout`; homepage `speakable` указывает на отсутствующие CSS-классы `.faq-question/.faq-answer`.
5. Learn Find breadcrumb использует неоднозначные/дублирующиеся уровни Courses/Finds; в EN keywords осталась кириллица «Оригинал на YouTube».

Отсутствующий `SearchAction` не считается практической проблемой: Google прекратил поддержку sitelinks search box. Итог 69 отражает строгую общую Schema.org/GEO-рубрику, а не наличие критической ошибки Google rich results.

---

## Platform Optimization — 35/100

| Платформа | Балл | Основное ограничение |
|---|---:|---|
| Google AI Overviews | 41 | Нет question-heading → direct-answer паттерна, 0 HTML-таблиц в 50-URL выборке, claims без источников |
| ChatGPT Search | 10 | Не подтверждены Bing coverage, Wikipedia/Wikidata, Reddit и authoritative backlinks; entity conflicts |
| Perplexity | 30 | Нет original benchmark, multi-source validation и независимых community discussions |
| Gemini | 47 | Хорошая schema/multimodal база, слабые brand entity, author credentials и meaningful image alt coverage |
| Bing Copilot | 47 | IndexNow исправен, но BWT не подключён к аудиту и публичный Bing spot-check не вывел домен |

В 50-URL platform-выборке все страницы отвечали 200 и имели один H1; 34 содержали списки и `FAQPage`, но **0 из 50** имели HTML-таблицу. Видимый `<time>` был на 32/50, updated-сигнал — на 21/50. Самый важный неопределённый риск — Bing: IndexNow key и pipeline работают, однако точные публичные запросы смешивали Opten с одноимёнными компаниями и не показывали домен. Это требует проверки в Bing Webmaster Tools, а не слепой повторной отправки URL.

Приоритет платформ: BWT coverage → entity consistency → primary sources/benchmark → answer-first H2/H3 и таблицы → YouTube/LinkedIn/GitHub/community authority.

---

## Приоритетный backlog

| ID | Приоритет | Категория | Проблема / возможность | Доказательство | Ответственный | Техническое действие | Приёмка / KPI |
|---|---|---|---|---|---|---|---|
| SEO-00 | P0 | Trust/content | GPT Image 2 смешивает API/ChatGPT и заявляет неподдерживаемые API-размеры | Локальный RU/EN контент против OpenAI API reference | Редактор + SEO | Разделить surfaces, исправить model/blog/FAQ/schema, добавить source/date | Только документированные размеры; 0 смешанных API/ChatGPT claims |
| SEO-01 | P0 | Trust/content | Устаревшие факты Midjourney 8.1 | Локальный контент против official docs | Редактор + SEO | Исправить RU/EN, FAQ/schema, добавить sources/date | 0 противоречий в checklist; повторная source review |
| SEO-02 | P1 | CTR/intent | Wan: 313 показов, 0 кликов, pos 8,28 | Яндекс query analytics | SEO + редактор | Answer-first, examples, sources; snippet test | CTR >2% при стабильной позиции за 28 дней |
| SEO-03 | P1 | CTR/intent | Runway URLs делят generic intent | Яндекс queries + Google SERP | SEO + редактор | Broad guide/hub + version-specific linking | Один стабильный broad landing; CTR/position cluster растут |
| SEO-04 | P1 | Crawlability | Ценные sitemap URL не включены в связный server HTML graph | 46/214 без входящих ссылок + 2 в изолированном кластере; хабы Blog/Learn неполны | Разработчик + SEO | SSR links, related-блоки или crawlable pagination | 100% ценных URL имеют inbound HTML link, depth ≤3 |
| SEO-05 | P1 | Performance | Auto-loaded 2,79/12,45 МБ video | Live network/headers/code | Разработчик + дизайнер | Poster/lazy media/compress/cache | <1 МБ initial payload; свежий PSI/CrUX |
| SEO-06 | P1 | Product contract | Hidden course linked publicly | Raw `/learn` | Разработчик + product | Убрать links до launch, сохранив noindex и server-gated paid access | 0 `/learn/courses/*` в public source; видео открывается только с course entitlement |
| SEO-07 | P1 | Citability | Нет sources/test methodology | 4 editorial/model sample | Редактор | Source blocks + reproducible tests | Technical claims sourced/date-stamped |
| SEO-08 | P1 | Learn | Video content плохо извлекается | Citability 47–53 | Редактор + video | Summary, takeaways, timestamps, transcript notes | Learn citability ≥70 |
| SEO-09 | P1 | Entity | 60+ против 43+ | Site vs CWS | Product marketing | Canonical product facts across surfaces | 0 conflicts in 20 entity prompts |
| SEO-10 | P1 | Authority | Brand Authority 19 | Platform scan | Founder + PR/community | Independent reviews, branded profiles, public cases | 5+ independent mentions; 10+ CWS reviews |
| SEO-11 | P1 | Mobile CTR | Яндекс mobile CTR 1,07% | Webmaster devices | SEO + designer | Mobile snippet/first-screen experiments | CTR +0,5–1 п.п. без position loss |
| SEO-12 | P2 | EN CTR | Flux 2: 221 показ, CTR 0,45% | GSC pages | EN editor + SEO | Match title/intro to actual queries/SERP | CTR >1,5% over comparable 28d |
| SEO-13 | P2 | Schema/entity | Person/Organization sameAs смешаны | JSON-LD audit | Разработчик + SEO | Личные profiles → Person; brand profiles → Organization | Graph validators resolve entities separately |
| SEO-14 | P2 | llms | `llms-full.txt` 2,5 МБ и повторяется | Live file | Разработчик + редактор | Очистить chrome/CTA/footer или разделить | Существенно меньше size/duplication |
| SEO-15 | P2 | Editorial trust | Нет corrections/editorial disclosure | Content audit | Редактор/owner | Опубликовать policies и review cadence | Visible policy + links from author/content |
| SEO-16 | P2 | Legacy routes | Client redirects `/app/learn*` | HTTP 200 + React redirect | Разработчик | Server 301/308 | One-hop destination 200 |
| SEO-17 | P2 | Security | CSP отсутствует | Live headers | Разработчик/security | Report-Only → enforcement | Auth/payment/video не сломаны |
| SEO-18 | P2 | Mobile UX | Header controls <44×44 | Mobile DOM | Дизайнер + разработчик | Увеличить hit areas | Critical controls ≥44×44 |
| SEO-19 | P2 | Measurement | Яндекс.Метрика не установлена | Webmaster diagnostic | Аналитик | Подключить при наличии consent/privacy решения | Organic landing/conversion baseline доступен |
| SEO-20 | P3 | URL hygiene | `/blog/` 200; 404 canonical home | Live HTTP/HTML | Разработчик | 308 slash variant; remove 404 canonical | Один canonical URL; 404 без conflict |

---

## Быстрые действия на 7–14 дней

1. Исправить GPT Image 2 и Midjourney 8.1, затем провести source-check пяти страниц с наибольшими показами.
2. Сделать все Blog/Learn материалы доступными из SSR HTML-хабов.
3. Отключить стартовую загрузку avatar video и убрать hidden-course links из public Learn.
4. Подготовить один broad Runway guide, чётко связанный с Gen-4 и Gen-4.5 pages.
5. Синхронизировать 60+/43+ и Person/Organization facts на сайте и CWS.
6. Добавить sources/date/test blocks на Wan, Runway, PixVerse, Recraft и LTX.
7. Зафиксировать baseline 20 GEO prompts и CTR priority URLs до изменений.

---

## План на 30/60/90 дней

### Первые 30 дней

- Закрыть SEO-00, SEO-01, SEO-04, SEO-05, SEO-06 и SEO-09.
- Выпустить source-backed Runway guide и обновить Wan/PixVerse/Recraft pages.
- Обновить Learn summary/timestamps минимум у пяти уроков.
- Настроить weekly dashboard GSC + Яндекс отдельно по page/query/device/country.
- Обновить GitHub README и создать однозначный branded profile description.

### 31–60 дней

- Провести controlled title/description tests на 5 URL, не менять весь шаблон одновременно.
- Опубликовать 3–5 воспроизводимых model experiments с raw prompt/settings/result.
- Усилить contextual linking между guide → model → Learn → Prompt Library.
- Получить первые независимые обзоры/демонстрации и содержательные community mentions.
- Внедрить schema/entity corrections и editorial/corrections policy.

### 61–90 дней

- Масштабировать выигравшие шаблоны только после 28-дневного сравнения.
- Создать comparison content по SERP-validated demand, а не по списку моделей.
- Повторить GEO Score, AI answer-share benchmark и technical crawl.
- Получить свежий CrUX/GSC CWV baseline и проверить effect video optimization.
- Решать вопрос country-specific EN content только при достаточном query/conversion спросе.

---

## Контентный план

| Приоритет | Тема/кластер | Intent | Тип | Предлагаемый URL | Обязательные элементы | Риск дублирования |
|---|---|---|---|---|---|---|
| P1 | Как писать промпты для Runway | Broad educational | Полный guide | `/blog/runway-prompts` | Формула, 10+ примеров, versions table, video, sources | Высокий: развести с Gen-4/4.5 pages |
| P1 | Промпты Wan | Examples + how-to | Расширение current page или guide после SERP check | `/models/wan` либо `/blog/wan-prompts` | Example library, negative patterns, source date | Средний |
| P1 | PixVerse examples | Examples | Model guide | `/models/pixverse-6` | Copyable prompts + expected result + limits | Низкий при version-specific scope |
| P1 | Recraft prompts | How-to | Practical guide | `/models/recraft-v4` | Design tasks, mini-tests, primary sources | Низкий |
| P2 | Flux 2 EN | EN how-to | Refresh current article | `/en/blog/flux-2-prompts` | Query-aligned intro, comparison/table, sources | Низкий |
| P2 | AI face swap EN | Problem-solving | Refresh current article | `/en/blog/ai-face-swap` | Safety/consent, artifact checklist, examples | Низкий |
| P2 | Learn transcripts | Educational | Enriched lesson pages | Existing `/learn/*` | Summary, takeaways, timestamps, transcript notes | Нет, если canonical остаётся уроком |
| P2 | Model comparison | Commercial investigation | Comparison | После query/SERP validation | Criteria table, real tests, limitations | Высокий без intent map |

---

## План измерения

| Изменение | Исходный показатель | Сегмент | Окно проверки | Успех | Guardrail |
|---|---|---|---|---|---|
| Runway broad guide | Generic queries делятся между 2 model pages | Яндекс RU mobile/desktop | 28 дней после полной индексации | CTR >2%, стабильный target URL, рост clicks | Version queries не теряют landing relevance |
| Wan refresh | 313 показов, 0 кликов, pos 8,28 | Яндекс URL/query | 28 дней | ≥5 кликов или CTR ≥2% при сопоставимых показах | Позиция не ухудшилась >1,5 |
| EN Flux 2 refresh | 221 показ, 1 клик | Google US/desktop+mobile | 28 дней | CTR ≥1,5% | Не теряется query breadth |
| Mobile snippet/UX | Яндекс mobile CTR 1,07% | Mobile+tablet | 28 дней | +0,5–1 п.п. | Ср. позиция стабильна |
| Video optimization | Fresh field отсутствует; RU media 2,79 МБ | Home RU/EN mobile | PSI lab сразу, CrUX 28+ дней | Initial <1 МБ; LCP lab <2,5 с | INP/CLS без регрессии |
| Sources/tests | Citability 70, stats component ~50 | Model/blog sample | 30–60 дней | Citability ≥75; factual errors 0 | Visible content остаётся читаемым |
| Brand work | Brand Authority 19 | RU/EN web + AI | 90 дней | ≥30; 5+ independent mentions | Без spam/self-promo violations |
| Learn enrichment | Citability 47–53 | Learn sample | 30 дней | ≥70 | Transcript не является raw unedited dump |

GSC и Яндекс не объединять в одну цифру. Сравнивать одинаковые полные периоды, фиксировать даты релизов и отделять field CWV от Lighthouse.

---

## Ограничения и что не удалось проверить

- У сайта недостаточно истории для предыдущих 90 дней и год-к-году; такие сравнения равны нулю и не интерпретируются как рост.
- GSC скрывает большую часть query detail по privacy; суммы query/page могут не совпадать с site totals.
- Актуальные CrUX/GSC CWV p75 не были доступны; PageSpeed API вернул 429.
- Яндекс live SERP потребовал CAPTCHA; она не обходилась. Использованы Webmaster positions и Google spot-checks.
- Google SERP spot-check — не локальный rank tracker и не обещание фиксированной позиции.
- Реальный Share of Answers в ChatGPT/Perplexity/Gemini/Яндекс ещё не измерен авторизованным повторяемым benchmark.
- Региональность Яндекса через доступный API не подтверждена; для online-only SaaS это не критическая диагностика.
- Никакой рост позиций не гарантируется. Каждая рекомендация должна проверяться по сегменту и одинаковому периоду.

---

## Приложение: ключевые страницы и ресурсы аудита

| URL/ресурс | Роль | Главный вывод |
|---|---|---|
| `https://opten.space/` | Главная | Высокая видимость, CTR 1,58% Google; entity facts требуют синхронизации |
| `/models/wan` | Model page | Главная Yandex opportunity: 313 показов, 0 кликов |
| `/models/runway-gen4.5` | Model page | Generic/version intent split |
| `/models/pixverse-6` | Model page | Позиция 7,42, CTR 1,03% |
| `/models/ltx-2` | Model page | Лучший практический benchmark среди high-impression group |
| `/models/gpt-image-2`, `/blog/gpt-image-2` | Model + article | P0: разделить API/ChatGPT и исправить неподдерживаемые API-размеры |
| `/models/midjourney-8.1` | Model page | P0 factual correction |
| `/en/blog/flux-2-prompts` | EN article | 221 показ Google, CTR 0,45% |
| `/en/learn/finds/graphify-obsidian-claude-code-second-brain` | EN Find | 481 показ, 10 кликов, сильный новый entry point |
| `/learn` | Learn hub | Thin text layer, 3/11 public links in raw HTML, hidden-course links |
| `/blog` | Blog hub | 12/24 post links in raw HTML |
| `/about` | Entity/author | Сильная история, недостаточно credentials/external proof |
| `robots.txt` | Crawl control | AI crawler access 100/100 |
| `sitemap.xml` | Discovery | 214 URL, valid RU/EN/x-default |
| `llms.txt` | AI discovery | Полезный 214-link catalog |
| `llms-full.txt` | AI corpus | 2,5 МБ, duplication и неверная size note |

### Вспомогательные отчёты

- [[2026-07-10-ai-visibility|AI visibility]]
- [[2026-07-10-technical|Technical audit]]
- [[2026-07-10-content-eeat|Content/E-E-A-T]]
- [[2026-07-10-schema|Schema audit]]
- [[2026-07-10-platform-readiness|Platform readiness]]

### Первичные источники для срочной проверки Midjourney

- [Midjourney V8.1 updates](https://updates.midjourney.com/v8-1-updates/)
- [Midjourney V8.1 is now the default model](https://updates.midjourney.com/v8-1-is-now-the-default-model/)
- [Midjourney Version documentation](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version)
- [Midjourney No parameter](https://docs.midjourney.com/hc/en-us/articles/32173351982093-No)
- [Midjourney Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)

### Первичный источник для срочной проверки GPT Image 2

- [OpenAI Images API reference](https://developers.openai.com/api/reference/resources/images)
