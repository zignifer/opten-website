---
tags: [seo, geo, strategy, canonical]
status: canonical
created: 2026-07-10
last_reviewed: 2026-07-11
review_cycle: monthly
---

# SEO Growth Plan — opten.space

> [!important] Канонический рабочий документ
> Этот файл определяет SEO/GEO-приоритеты, последовательность реализации и
> критерии приёмки. Стартовые аудиты в [[research/README|research/]] являются
> доказательной базой, но не самостоятельным backlog.

## Иерархия решений

1. `AGENTS.md` и `docs/INTEGRATION-CONTRACT.md` — продуктовые, security и integration constraints.
2. Этот документ — SEO/GEO-приоритеты и порядок работы.
3. `docs/CONTENT-AUTHORING.md`, `seo2/` и профильные specs — правила реализации конкретного формата.
4. `docs/seo/research/` — исторические снимки и гипотезы.

Если стартовый аудит конфликтует с этим планом, используется этот план. Если
SEO-идея конфликтует с продуктовым контрактом, используется продуктовый
контракт.

---

## Цель

Увеличивать не общий объём показов, а **целевой органический спрос**, который
может привести к одному из продуктовых действий:

- переходу в Chrome Web Store;
- установке расширения;
- первому и повторному использованию Opten;
- покупке Pro;
- покупке отдельного курса, если пользователь пришёл на соответствующий
  публичный маркетинговый материал.

Рабочая последовательность:

> достоверность и продуктовые факты → crawl/UX foundation → страницы под
> подтверждённый intent → оригинальные тесты → внешняя дистрибуция →
> масштабирование только доказавших результат форматов.

---

## Baseline на 10 июля 2026 года

| Канал | Период | Клики | Показы | CTR | Средняя позиция |
|---|---|---:|---:|---:|---:|
| Google | 11.06–08.07 | 28 | 2 373 | 1,18% | 10,57 |
| Яндекс | 11.06–08.07 | 78 | 3 922 | 1,99% | 8,37 |
| Bing | 11.04–10.07 | 0 | 390 | 0% | — |

Дополнительный baseline:

- Яндекс mobile + tablet: 2 530 показов, 27 кликов, CTR 1,07%, позиция 8,10.
- AI Crawler Access: 100/100.
- AI Citability: 70/100.
- Brand Authority: 19/100.
- Content E-E-A-T: 60/100.
- Technical GEO: 77/100.
- Schema: 69/100.
- Overall GEO Score: 55/100.
- Sitemap: 214 URL; 46 URL без входящей server-rendered HTML-ссылки и ещё 2 в изолированном кластере по стартовому crawl.
- `/blog` в prerender содержит 12 из 24 post links; `/learn` — 3 из 11
  публичных Learn links. Ссылки на запущенный платный курс в `/learn`
  намеренны и не считаются технической ошибкой.
- Bing Webmaster Tools подключён и подтверждён 11.07.2026 через авторизованный
  интерфейс: выбрано свойство `opten.space`, доступны Search Performance,
  AI Performance, URL Inspection, Sitemaps, IndexNow и Backlinks.
- Bing AI Performance за 11.04–10.07: 20 citations; детальная выборка Grounding
  Queries пока не содержит строк. Это baseline видимости, а не 20 переходов.
- Основной `https://opten.space/sitemap.xml` имеет статус `Success`, 210
  обнаруженных URL и последний crawl 09.07.2026. Bing также хранит старый
  `https://www.opten.space/sitemap.xml`: `Success`, 6 URL, crawl 15.05.2026;
  его нужно проверить как legacy-запись, а не считать отдельным сайтом.

Google и Яндекс измеряются раздельно. Query/page sums в GSC не считаются
полными из-за privacy suppression.

---

## Финальные решения

### Делать сейчас

1. Исправить недостоверные технические и продуктовые утверждения.
2. Создать единый проверяемый Product Facts source.
3. Исправить серверную обнаруживаемость ценного контента и тяжёлое hero video.
4. Сохранить публичное продвижение запущенного курса, не раскрывая платные
   видео и материалы без соответствующего доступа.
5. Улучшать уже ранжирующиеся Wan/Runway/PixVerse/Recraft/LTX pages.
6. Развести broad и version-specific intent, начиная с Runway.
7. Создать страницы только подтверждённых extension integrations.
8. Публиковать воспроизводимые тесты и распространять их через YouTube,
   партнёров и профильные сообщества.
9. Использовать уже подключённый Bing Webmaster Tools: проверять приоритетные
   URL, следить за sitemap/IndexNow и ежемесячно фиксировать AI Performance.
10. Измерять переход от organic landing к продуктовым действиям там, где это
    технически наблюдаемо.

### Делать позже, после foundation

- task/use-case pages после query/SERP validation;
- model comparisons только с собственными тестами;
- schema cleanup, author entity и editorial policies;
- free web prompt checker только после отдельного product/backend discovery;
- очистка `llms-full.txt`, CSP, tap targets и URL hygiene после P0/P1.

### Не делать

- PBN, арендные SEO-ссылки, массовые dofollow-пакеты и exact-match anchors;
- накрутку кликов, поведенческих факторов, отзывов или установок;
- фальшивые Reddit/форумные обсуждения и скрытую рекламу;
- массовые guest posts, единственная ценность которых — ссылка;
- expired-domain redirects и parasite SEO для манипуляции выдачей;
- десятки doorway/tool pages, отличающихся только названием модели;
- массовые непроверенные AI-статьи ради количества URL;
- самостоятельное создание Wikipedia/Wikidata entity без независимой значимости;
- отдельную «AI-разметку» или GEO-файлы ради формального score;
- индексацию, transcript или ослабление защиты платных Kinescope-уроков;
- обещания работы расширения на сайтах, которых нет в подтверждённой support matrix;
- бесплатные AI-операции только ради SEO без cost/rate-limit/product решения.

Google указывает, что обычные SEO-практики применимы и к AI features, а
специальные AI-файлы или schema для появления там не требуются:
[AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

---

## Product guardrails

### Product Facts прежде новых landing pages

Сейчас внешние и внутренние поверхности смешивают разные метрики:

- 62 model content pages в `MODEL_SLUGS_WITH_CONTENT`;
- 63 skill files в proxy bundle, включая fallback profiles;
- 60+ на сайте;
- 43+ в стартовом снимке Chrome Web Store;
- четыре реально поддерживаемые extension platforms по `AGENTS.md`;
- часть текущих hero/legal surfaces перечисляет только три;
- model pages обещают auto-detection на Runway, PixVerse, fal.ai и Replicate,
  хотя extension contract фиксирует Syntx, Higgsfield, Freepik и Magnific.

До integration pages и новых product claims нужно создать проверяемый документ
`docs/PRODUCT-FACTS.md` со следующими отдельными полями:

1. число model content pages;
2. число model-specific skill profiles;
3. число моделей, доступных для ручного выбора;
4. число моделей, автоматически распознаваемых расширением;
5. список сайтов, где реально работает интеграция;
6. текущая extension version;
7. Pro allowance и цена;
8. дата проверки и ответственный.

Этот документ должен быть сверён с `C:\Projects\promptscore` и
`C:\Projects\promptscore-proxy` до синхронизации сайта, CWS, schema, YouTube,
GitHub и Telegram.

### Публичный Learn и запущенный платный курс

- `/learn`, `/en/learn`, публичные lessons и Finds — индексируемый контент.
- Курс `ai-content-marketing-2026` официально запущен и намеренно показывается
  в публичном Learn, статьях, Telegram и других маркетинговых поверхностях.
- `/learn/courses/*` — отдельная SPA/noindex поверхность курса по текущей
  архитектуре. `noindex` не означает, что курс не запущен.
- Нулевой урок `hidden-intro` доступен гостю только после проверки подписки на
  Telegram и соответствующего claim/access flow. Покупатель полного курса
  получает его через обычный course entitlement.
- Уроки 1+ и закрытые материалы выдаются только после отдельной покупки курса
  и серверной проверки course entitlement.
- Курс не является Pro entitlement.
- Публичные ссылки на корень курса и превью уроков сохраняются. Course routes
  остаются вне sitemap, llms и EN siblings по текущей routing policy, пока
  отдельное SEO-решение не изменит способ их публикации.
- SEO-задачи не должны удалять курс из маркетинга, ослаблять noindex/playback
  policy или менять auth callback и access checks без отдельного решения.

### Free prompt checker

Идея потенциально сильная, но **не является быстрым SEO-фиксoм**. Free account
сейчас даёт 0 AI-операций, а сайт не должен напрямую обходить extension-owned
proxy/credits contract. Перед реализацией нужен discovery с ответами:

- выполняется ли анализ без платной AI-операции;
- какой backend владеет endpoint;
- лимит, abuse protection и стоимость;
- требуется ли login;
- как checker связан с extension activation;
- не создаёт ли он новый бесплатный тариф фактически.

До утверждения этого контракта разрешён только статический interactive demo без
ложного обещания реальной бесплатной AI-проверки.

---

## План реализации

### Wave 0 — доверие и источник правды, дни 1–7

| ID | Приоритет | Статус | Задача | Ответственный | Критерий приёмки |
|---|---|---|---|---|---|
| SEO-00 | P0 | `todo` | Исправить GPT Image 2 RU/EN model + blog + FAQ/schema | Редактор + SEO | API и ChatGPT surfaces разделены; размеры совпадают с [OpenAI Images API](https://developers.openai.com/api/reference/resources/images); source/date видимы |
| SEO-01 | P0 | `todo` | Исправить Midjourney 8.1 RU/EN и связанные claims | Редактор + SEO | Claims совпадают с [официальным V8.1 update](https://updates.midjourney.com/v8-1-is-now-the-default-model/) и parameter docs; source/date видимы |
| SEO-02 | P0 | `todo` | Удалить неподтверждённые auto-detection claims Runway/PixVerse/Wan | Product + редактор | Ни одна страница не обещает работу на неподдерживаемом сайте; ручной profile и site integration описаны раздельно |
| SEO-03 | P0 | `todo` | Создать и согласовать `docs/PRODUCT-FACTS.md` | Product owner | Website, extension и proxy facts разделены и подтверждены владельцами репозиториев |
| SEO-04 | P1 | `todo` | Source-check 20 страниц с максимальными показами | Редактор + SEO | У изменяемых claims есть official source или label «тест Opten»; дата/версия/платформа теста указаны |

Пока SEO-00…04 не закрыты, не создавать новые model pages и не масштабировать
одинаковый шаблон на новые модели. Очередь SEO2 не меняется автоматически:
команда `напиши SEO-статью` продолжает работать по `AGENTS.md`, но новый
weekly batch не следует генерировать без product relevance и source review.

### Wave 1 — crawl, performance и measurement, дни 5–14

| ID | Приоритет | Статус | Задача | Ответственный | Критерий приёмки |
|---|---|---|---|---|---|
| SEO-05 | P1 | `todo` | Классифицировать 48 disconnected/isolated sitemap URL и восстановить server HTML graph для ценных | Разработчик + SEO | Каждый ценный indexable URL имеет inbound `<a href>` и depth ≤3; intentional exclusions документированы |
| SEO-06 | P1 | `todo` | Исправить Blog/Learn hubs | Разработчик | `/blog` достигает всех 24 posts через SSR links/pagination; `/learn` достигает всех 11 public materials |
| SEO-07 | P1 | `corrected` | Сохранить курс в public Learn и проверить границы доступа | Разработчик + product | Корень курса и превью видимы; нулевой урок играет гостю только после Telegram subscription/claim; уроки 1+ требуют покупки; платные материалы не раскрываются |
| SEO-08 | P1 | `todo` | Остановить initial avatar MP4 download и сжать EN asset | Разработчик + дизайнер | До действия/утверждённой idle policy MP4 не скачивается; initial mobile payload <1 МБ; повторный запрос кэшируется |
| SEO-09 | P1 | `in_progress` | Вести Bing Webmaster Tools и проверить 20 ключевых URL | SEO/owner | Подключение и основной sitemap подтверждены 11.07.2026; AI baseline сохранён; 20 key URLs проверены через URL Inspection; legacy `www` sitemap классифицирован |
| SEO-10 | P1 | `todo` | Зафиксировать measurement baseline | SEO + аналитик | GSC/Яндекс/Bing раздельно; priority URL/query/device/country sheet; дата каждого релиза |

Bing AI Performance показывает citations, cited pages и grounding queries, но
не заменяет ranking/traffic analytics: [официальный анонс](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).

### Wave 2 — intent и product-led content, дни 15–45

| ID | Приоритет | Статус | Задача | Ответственный | Критерий приёмки |
|---|---|---|---|---|---|
| SEO-11 | P1 | `todo` | Создать broad Runway guide и intent map | SEO + редактор | Broad queries имеют один основной URL; Gen-4/Gen-4.5 сохраняют version intent; нет redirect/canonical потери |
| SEO-12 | P1 | `todo` | Обновить Wan, PixVerse, Recraft, LTX | Редактор | Примеры, ограничения, sources, test platform и distinct snippet promise; product claims сверены с Product Facts |
| SEO-13 | P1 | `todo` | Создать integration pages подтверждённых платформ | Product + редактор + разработчик | Только фактические integrations; видео/скриншоты, supported modes, limits, troubleshooting, RU/EN |
| SEO-14 | P1 | `todo` | Усилить 5 public Learn lessons | Редактор + video | 100–180 слов summary, 5–7 takeaways, chapters/timestamps и редакторский конспект; только public Learn |
| SEO-15 | P1 | `todo` | Провести controlled snippet tests на 5 URL | SEO | Меняется один кластер за раз; baseline и релиз отмечены; оценка после 28 полных дней |
| SEO-16 | P2 | `todo` | Author/editorial/corrections/disclosure layer | Owner + редактор | Видимый author URL, проверяемая bio, editorial/corrections и commercial disclosure policies |

Integration pages можно планировать для Syntx, Higgsfield, Freepik и Magnific
только после SEO-03; текущие списки на разных поверхностях расходятся.

### Wave 3 — исследования и внешний авторитет, дни 30–90

| ID | Приоритет | Статус | Задача | Ответственный | Критерий приёмки |
|---|---|---|---|---|---|
| SEO-17 | P1 | `todo` | Опубликовать первый воспроизводимый benchmark | Product + редактор + video | Methodology, prompt set, versions, settings, 3+ runs, raw outcomes, failures и limitations доступны |
| SEO-18 | P1 | `todo` | Запустить постоянную YouTube-серию Opten | Founder + video | 5 содержательных видео; Opten в title/description/spoken transcript; chapters и canonical research URL |
| SEO-19 | P1 | `todo` | Получить независимые обзоры/демонстрации | PR/community | ≥5 содержательных third-party mentions без требования положительного отзыва |
| SEO-20 | P1 | `todo` | Partner/resource outreach | Founder + PR | 30 релевантных контактов, персональный pitch на asset, 5 качественных ответов/размещений |
| SEO-21 | P1 | `todo` | Улучшить CWS trust layer | Product marketing | Product facts синхронизированы; screenshots/video актуальны; ≥10 настоящих отзывов без incentives |
| SEO-22 | P2 | `todo` | Обновить GitHub/LinkedIn branded entity | Founder + product marketing | Canonical domain/description, founder relation, CWS link и screenshots; staging URL удалён |
| SEO-23 | P2 | `todo` | Community participation | Founder + expert contributors | Полезные ответы/разборы в 3+ сообществах; no fake accounts, link dumping или скрытый sponsorship |

---

## Контентная архитектура

| Слой | Приоритет | Формат | Пример | Цель |
|---|---:|---|---|---|
| Product facts | P0 | Support matrix/methodology | Product Facts | Доверие и единая сущность |
| Integration | P1 | Подтверждённая platform landing | Opten для Higgsfield | Высококонверсионный product intent |
| Broad model guide | P1 | Полный tutorial | Runway prompts | Generic informational intent |
| Version model page | P1 | Точная версия/параметры | Runway Gen-4.5 | Long-tail и справка |
| Public Learn | P1 | Видео + извлекаемый текст | Existing lessons/Finds | Доверие, обучение, AI citation |
| Research | P1/P2 | Benchmark/dataset | Runway vs Kling vs PixVerse | Earned links и authority |
| Use case | P2 | Решение работы | AI UGC, product video | Целевой task demand |
| Comparison | P2 | Собственный тест | Flux vs Midjourney | Commercial investigation |
| Tool | Discovery | Prompt checker | `/tools/prompt-checker` | Product-led acquisition, только после contract |

### Первый контентный кластер: Runway

```text
/blog/runway-prompts           broad «как писать промпты»
├── /models/runway-gen4        version-specific I2V
├── /models/runway-gen4.5      version-specific T2V/I2V
└── future comparison/test     только после собственных генераций
```

Нельзя автоматически создавать новый guide для каждой модели. Отдельная
страница появляется только при самостоятельном intent и уникальной ценности.

---

## Off-page и ссылки

### Что строим

1. **Linkable assets:** benchmarks, compatibility matrices, cost calculators,
   открытые test prompts и changelog model behavior.
2. **YouTube:** собственные тесты и независимые reviews с упоминанием в title,
   description и transcript.
3. **Editorial distribution:** адаптированные материалы для профильных медиа,
   Habr/VC и creator newsletters с одной естественной ссылкой на первичные данные.
4. **Partners:** resource/integration pages, совместные tests, webinars и case studies.
5. **Community:** полезные ответы и открытые данные без рекламного маскарада.

Внешняя ссылка должна вести на наиболее релевантный asset/deep page, а не
всегда на главную. Внутри asset контекстные ссылки распределяют внимание на
guide, model page и product CTA.

### Платные размещения

Допустимы, если покупается аудитория и дистрибуция, а не ranking credit:

- sponsored review/article с disclosure;
- creator integration;
- newsletter sponsorship;
- участие в вебинаре/подкасте;
- модерируемый тематический каталог.

Paid links должны быть помечены `rel="sponsored"` или `nofollow`. Google
относит покупку ссылок для ранжирования, automated links и optimized anchors в
массовых guest posts к link spam:
[Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies).
Яндекс также рекомендует ориентироваться на пользу для посетителя и помечать
рекламные ссылки:
[рекомендации Яндекс.Вебмастера](https://yandex.ru/support/webmaster/ru/recommendations/links).

### Проверка площадки

Размещение рассматривается только если:

- аудитория и тема совпадают с Opten;
- страница индексируется и имеет реальный редакционный материал;
- у публикации есть автор/редактор;
- площадка не является витриной массовых SEO-статей;
- ссылка и упоминание естественны без exact-match требования;
- URL постоянный, а disclosure прозрачен;
- ценность размещения сохраняется, даже если ссылка не передаёт ranking signal.

---

## Метрики и критерии успеха

### Search

- clicks, impressions, CTR и average position отдельно Google/Яндекс/Bing;
- priority query clusters и стабильность правильной landing page;
- mobile/desktop отдельно;
- страны только на уровне доступной точности;
- index coverage и server link depth;
- branded queries `Opten` с учётом одноимённых компаний.

### Product

- organic landing → Chrome Web Store click;
- CWS listing views/installs/uninstalls по доступным store данным;
- install → first check → third check → paid activation там, где extension
  analytics законно и технически связывается с каналом;
- для курса — только публичный marketing funnel, без раскрытия paid content.

### Authority/GEO

- качественные referring domains;
- независимые linked и unlinked mentions;
- YouTube mentions/transcripts;
- реальные CWS reviews;
- Bing AI citations/grounding queries;
- fixed 20-prompt RU/EN AI answer-share benchmark раз в месяц.

### Directional targets на 90 дней

| Результат | Цель |
|---|---|
| Factual integrity | 0 известных противоречий на top-20 pages; 100% изменяемых claims sourced/test-labeled |
| Product consistency | 0 неразведённых конфликтов model/platform counts между site/CWS/schema/core profiles |
| Crawl graph | 100% ценных indexable sitemap URL имеют inbound server HTML link и depth ≤3 |
| Performance | Initial mobile homepage payload <1 МБ; MP4 не загружается преждевременно |
| Existing demand | Wan/Runway experiments стремятся к CTR >2% при сопоставимых позициях; не обещание результата |
| Content | 1 broad Runway guide, 4 verified integration pages, 5 enriched public Learn lessons |
| Research | 1 полный benchmark и 3–5 smaller reproducible tests |
| Distribution | ≥5 независимых содержательных mentions и ≥10 честных CWS reviews |
| Measurement | GSC + Яндекс + Bing baseline; Bing AI Performance включён |

---

## Отложенный backlog

| Задача | Приоритет | Условие запуска |
|---|---:|---|
| Free prompt checker | P2 discovery | Product/backend/cost/rate-limit contract утверждён |
| Use-case pages | P2 | Query demand + SERP format + product relevance подтверждены |
| Model comparisons | P2 | Есть собственные reproducible results |
| Person/Organization/schema cleanup | P2 | Product Facts утверждён, чтобы не закреплять неверную entity |
| Editorial/corrections policies | P2 | Owner подтверждает процесс обновления и ответственных |
| CSP enforcement | P2 | Report-Only собрал Supabase/Paddle/YouTube/Kinescope origins |
| Legacy Learn server redirects | P2 | Проверен routing/integration contract |
| `llms-full.txt` cleanup | P3 | P0/P1 закрыты; измерим duplication/size benefit |
| `/blog/` redirect, 404 canonical | P3 | Включить в ближайший безопасный routing batch |
| Wikipedia/Wikidata | Не планировать | Появилась независимая значимость и third-party sources |

---

## Рабочий процесс

1. Перед началом задачи найти её ID в этом документе.
2. Проверить связанные guardrails в `AGENTS.md` и integration contract.
3. Зафиксировать baseline и дату релиза.
4. Для нетривиальной реализации создать scoped plan/spec в `docs/`.
5. После внедрения записать commit/deploy date и изменить статус задачи.
6. Проверять эффект не раньше достаточного окна: обычно 28 полных дней после
   индексации, если задача не техническая.
7. Ежемесячно обновлять `last_reviewed`, KPI и решения о масштабировании.

Статусы backlog: `todo` → `in_progress` → `shipped` → `measuring` → `validated`
или `rejected`.

---

## Research basis

- [[research/2026-07-10-geo-seo-audit|Сводный GEO+SEO-аудит]]
- [[research/2026-07-10-technical|Technical audit]]
- [[research/2026-07-10-content-eeat|Content/E-E-A-T]]
- [[research/2026-07-10-ai-visibility|AI visibility and brand authority]]
- [[research/2026-07-10-platform-readiness|Platform readiness]]
- [[research/2026-07-10-schema|Schema audit]]
- [[research/2026-07-10-strategy-review|Дополнительный strategy review]]
- [[research/2026-05-14-seo-baseline|Исторический baseline до v1.0]]
