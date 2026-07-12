# GEO Content Quality & E-E-A-T Analysis — opten.space

> [!note] Статус: стартовый ресёрч
> Исходный специализированный аудит. Используется как доказательная база, но
> не как самостоятельный план реализации. Актуальные приоритеты находятся в
> [[../SEO-GROWTH-PLAN|каноническом SEO Growth Plan]].

**Дата аудита:** 10 июля 2026 года  
**Режим:** только чтение; live-сайт + локальные источники репозитория  
**Язык выборки:** RU. EN-версии проверялись только на структурную паритетность в исходниках, но не проходили отдельную редакторскую оценку.  
**Статусы выводов:** «Подтверждено» — видно на live-странице или в исходнике; «Вероятно» — сильный сигнал без полной внешней верификации; «Гипотеза» — требует данных/подтверждения владельца.

## Content Score: 60/100

**Интерпретация:** средний уровень. У сайта уже есть сильная практическая база для GEO: конкретные промпты, пошаговые процессы, видеоуроки, человеческий автор и широкое покрытие моделей. Главный потолок AI-цитируемости — не глубина тем, а доказательная база: почти нет ссылок на первичные источники, воспроизводимых тестов, реальных результатов генераций и внешней валидации автора/бренда. Быстро меняющиеся модельные страницы могут устареть раньше указанной даты обновления.

## Методика и ограничения

- Проверены 17 репрезентативных live-URL: главная, About, блог-хаб, 7 статей, Learn-хаб, 2 авторских урока, 1 Learn Find и 3 model pages.
- Все URL вернули HTTP 200 по HTTPS 10 июля 2026 года.
- Объём текста рассчитан по SSR/live HTML внутри основного содержимого. Значения приблизительные: в Learn и хабах часть текста — подписи карточек и интерфейса.
- Структура, даты, авторство, ссылки, изображения и JSON-LD сверялись с локальными источниками.
- Для трёх быстро меняющихся моделей выполнена точечная сверка с первичными источниками OpenAI, ByteDance и Midjourney.
- Реальные входящие ссылки, упоминания в прессе и пользовательские отзывы не были доступны как отдельный backlink/review dataset. Authoritativeness оценён консервативно по видимым сигналам и публичной точечной проверке.
- Содержимое видео оценено по описаниям, тайм-кодам, материалам и доступной разметке, а не по полной ручной расшифровке каждого ролика.

## E-E-A-T Breakdown

| Dimension | Score | Key Finding |
|---|---:|---|
| Experience | **19/25** | Сильный авторский голос, конкретные процессы, before/after и видео; но большая часть визуалов иллюстративна, а кейсы не имеют воспроизводимых доказательств. |
| Expertise | **16/25** | Техническая глубина и терминология выше среднего; виден базовый bio автора, но почти отсутствуют первичные источники, методология тестов и детальная профессиональная биография. |
| Authoritativeness | **3/25** | Широкое собственное покрытие темы есть, но не найдено доказательств цитирования авторитетными медиа, наград, выступлений, рецензентов или признанных внешних публикаций. |
| Trustworthiness | **12/25** | HTTPS, юридическая прозрачность, Privacy/Terms и корректное отделение сторонних видео — сильные сигналы; мешают ошибки свежести, отсутствие corrections/editorial policy и неясный статус некоторых кейсов/реферальных ссылок. |
| **Subtotal** | **50/100** |  |

## Детализация баллов по рубрике

### Experience — 19/25

| Signal | Score | Evidence |
|---|---:|---|
| First-person accounts | 5/5 | `/about`: «Opten я начал делать осенью 2025-го для себя»; `/learn/actual-ai-tools-2026`: «я попробовал около 40 сервисов». |
| Original work/data | 3/5 | 60+ собственных skill-файлов и практические тесты заявлены, но нет открытого набора тестов, методики или агрегированных результатов. |
| Case studies with results | 2/4 | Есть точные кейсы с артефактами и исправлениями, но нет даты, настроек, числа прогонов, исходных файлов или доказательства результата. |
| Screenshots/photos/direct-use evidence | 1/3 | Learn содержит авторские видео и обложки; большинство blog step images — оформленные иллюстрации, а не проверяемые скриншоты интерфейса/реальные output-пары. |
| Specific examples | 4/4 | Много конкретных промптов, моделей, длительностей, camera/action/constraint блоков. |
| Process demonstrations | 4/4 | Статьи дают пошаговые workflows; Learn — материалы, тайм-коды и связанные уроки. |

### Expertise — 16/25

| Signal | Score | Evidence |
|---|---:|---|
| Visible author credentials | 3/5 | `/about` называет Влада веб-дизайнером и AI-блогером, показывает аудиторию/просмотры и соцсети; нет подтверждённого портфолио, образования, сертификаций или списка профессиональных ролей/проектов. |
| Technical depth | 5/5 | Model pages подробно раскрывают параметры, ограничения, структуры промптов, типовые ошибки и before/after. |
| Methodology explanation | 2/4 | Процесс улучшения объяснён, но метод сравнительного теста моделей почти нигде не задокументирован. |
| Data-backed claims | 1/4 | В текстах много точных чисел и сравнений, но sampled blog/model pages практически не ссылаются на первичные источники. |
| Correct terminology | 3/3 | Термины camera, continuity, multimodal input, identity preservation, constraints и model-specific параметры используются уместно; найденные проблемы — преимущественно свежесть фактов, не базовая терминология. |
| Detailed author page | 2/4 | `/about` фактически выполняет роль bio, но byline в статьях не ведёт к нему и профессиональная история изложена кратко. |

### Authoritativeness — 3/25

Единственные баллы даны за comprehensive topic coverage (3/3). В рамках доступной проверки не подтверждены authoritative inbound citations, цитирование автора в прессе, отраслевые награды, выступления, публикации в признанных изданиях или Wikipedia/энциклопедические упоминания. Публичные соцсети и сторонние агрегаторы подтверждают реальное присутствие автора, но не заменяют внешнее признание экспертности.

### Trustworthiness — 12/25

| Signal | Score | Evidence |
|---|---:|---|
| Contact information | 2/4 | Telegram, YouTube, юридическое имя, ИНН и город видимы; нет публичного email, телефона и полного адреса для редакционных исправлений. |
| Privacy policy | 2/2 | Политика присутствует и доступна из site shell. |
| Terms | 1/1 | Условия использования присутствуют. |
| HTTPS | 2/2 | Все проверенные URL доступны по HTTPS. |
| Editorial/corrections policy | 1/3 | Автор и даты заданы, но нет публичной редакционной политики, процесса обновлений и формы сообщения об ошибке. |
| Business model/conflicts | 2/3 | Pro, разовые платежи, юридические лица и Merchant of Record раскрыты; связь контента с продажей Opten понятна, но её стоит обозначать прямо в редакционных материалах. |
| Reviews/testimonials | 0/3 | В выборке не найден блок проверяемых пользовательских отзывов или внешних review-ссылок. |
| Accuracy | 2/4 | Большая часть точечных фактов выглядит правдоподобно и часть Seedance/OpenAI claims подтверждается, но Midjourney 8.1 уже содержит подтверждённо устаревший статус и внутреннее противоречие. |
| Affiliate/sponsorship disclosure | 0/3 | На главной есть disclaimer о независимости от брендов, но ссылки типа `syntx.ai/welcome/GlUETIt6` не имеют явной маркировки «реферальная/партнёрская», если они действительно дают выгоду. |

## Topical Authority Modifier: +10

**Подтверждено:** репозиторий содержит 24 blog posts, 62 model pages, 6 публичных авторских Learn lessons и 3 основные Learn Finds в карте публичных slug'ов. Есть отдельные хабы `/blog`, `/models`, `/learn`; sampled blog pages выводят 2 related posts, model pages — 3 related models, авторские уроки — 2 соседних урока.

Это уже authority-scale breadth (20+ страниц) с рабочими кластерами вокруг prompt engineering, image/video models, AI-workflows и обучения. Слабое место — кластеры в основном соединены карточками в конце; внутри основного текста мало контекстных ссылок на доказательства и соседние подзадачи. Learn Finds также почти не связываются друг с другом.

## Pages Analyzed

| Page | Approx. words | Readability | Heading structure | Citability |
|---|---:|---|---|---|
| `https://opten.space/` | 690 | Средняя: короткие UI-фрагменты, местами длинные маркетинговые формулировки | Pass: H1 → H2 → H3 | Medium |
| `https://opten.space/about` | 637 | Хорошая: около 15 слов/предложение, живой первый голос | Pass: один H1 + H2 | Medium–High |
| `https://opten.space/blog` | 397 | Карточки читаются легко; агрегатная метрика предложений нерепрезентативна | **Warn:** H1 → H3 карточек без H2 | Medium как hub |
| `https://opten.space/blog/prompt-structure` | 674 | Очень простая: около 10 слов/предложение | Pass: H1 → 5 H2 | Medium–High |
| `https://opten.space/blog/gpt-image-2` | 891 | Очень простая: около 11 слов/предложение | Pass: H1 → 5 H2 | Medium |
| `https://opten.space/blog/ai-for-work` | 766 | Очень простая: около 9 слов/предложение | Pass: H1 → H2 → H3 | Medium |
| `https://opten.space/blog/seedance-2-0-prompts` | 693 | Простая: около 11 слов/предложение | Pass: H1 → 4 H2 | Medium |
| `https://opten.space/blog/best-ai-video-2026` | 591 | Хорошая: около 13 слов/предложение | Pass: H1 → 4 H2 | **Low–Medium:** comparison без benchmark/data |
| `https://opten.space/blog/consistent-character-ai` | 710 | Простая: около 11 слов/предложение | Pass: H1 → 5 H2 | Medium |
| `https://opten.space/blog/free-ai-courses` | 734 | Простая: около 10 слов/предложение | Pass: H1 → H2 → H3 | Medium |
| `https://opten.space/learn` | 320 | Карточки/подписи; объём prose мал | Pass: H1 → H2 → H3 | Low–Medium как текстовый источник |
| `https://opten.space/learn/actual-ai-tools-2026` | 244 | Видео-first; текст фрагментарен | Pass: H1 → H2 → H3 | Medium как видео, Low как extractable text |
| `https://opten.space/learn/junior-designer-1100-order` | 283 | Видео-first; длинное вступительное предложение | Pass: H1 → H2 → H3 | Medium как видео, Low как extractable text |
| `https://opten.space/learn/finds/ideogram-mcp-claude-code` | 403 | Средняя: самостоятельные summary/takeaway блоки | Pass: H1 → H2 → H3 | Medium |
| `https://opten.space/models/gpt-image-2` | 930 | Хорошая: около 14 слов/предложение | Pass: H1 → H2 → H3 | Medium–High после добавления sources |
| `https://opten.space/models/seedance-2.0` | 1,315 | Хорошая: около 18 слов/предложение | Pass: H1 → H2 → H3 | Medium–High после добавления sources |
| `https://opten.space/models/midjourney-8.1` | 1,279 | Хорошая: около 15 слов/предложение | Pass: H1 → H2 → H3 | **Low до исправления фактов** |

## E-E-A-T Detailed Findings

### Experience

#### Сильные сигналы

1. **Собственная история продукта.** `/about` объясняет происхождение Opten через наблюдаемую боль и личное использование: «Opten я начал делать осенью 2025-го для себя». Это сильнее обезличенного корпоративного текста.
2. **Конкретный объём практики.** `/learn/actual-ai-tools-2026`: «За всё время работы я попробовал около 40 сервисов с нейросетями. Но эти 5 закрывают 99% моих задач…». Утверждение показывает опыт, хотя «99%» пока не раскрыто методологически.
3. **Наблюдаемые рабочие процессы.** `/blog/prompt-structure` описывает ошибку шестого пальца и точечную правку camera/hand constraints; `/blog/consistent-character-ai` — drift шрама и исправление без пересборки всей сцены.
4. **Before/after пригодны для действия.** Практически все sampled articles дают слабый и улучшенный prompt, а не только абстрактный совет.
5. **Learn добавляет видео, материалы и тайм-коды.** Это наиболее сильный first-hand слой сайта: пользователь может увидеть автора и процесс, а не только прочитать пересказ.

#### Слабые сигналы

1. **Иллюстрации выглядят как доказательства, но не являются ими.** Например, `public/blog/best-ai-video-2026/ru/step-3.jpg` — оформленная композиция «ФИЗИКА» с лодкой и стрелками; в ней нет UI модели, prompt ID, настроек, даты или исходного видео. То же относится к `prompt-structure/ru/step-4.jpg`.
2. **Кейсы не воспроизводимы.** «Кейс Veo 3.1», «практический тест Nano Banana Pro» и тест Kling 3.0 не показывают provider, model build, aspect ratio, duration, seed, число прогонов и raw output.
3. **Персонажи «Антон» и «Ирина» не маркированы.** `/blog/ai-for-work` и `/blog/free-ai-courses` читаются как реальные customer cases, но нет пояснения, реальные ли это анонимизированные пользователи или собирательные учебные примеры. Это **гипотеза для уточнения**, а не обвинение в выдумке.
4. **Заявления о масштабе не подкреплены на странице.** «30 тыс.+ подписчиков», «40 млн+ просмотров», «тысячи зрителей» усилили бы Experience, если бы рядом были ссылки/скриншоты с датой фиксации и метод подсчёта без двойного учёта аудитории между платформами.

### Expertise

#### Сильные сигналы

- Model pages заметно глубже обычных SEO-карточек: быстрые факты, 4–5 тематических секций, 5 ошибок, 3 before/after, FAQ.
- `/models/seedance-2.0` корректно и конкретно описывает multimodal input, reference workflow и 15-second storyboard; основные лимиты 9 images + 3 video + 3 audio и 15-second output совпадают с официальным запуском ByteDance.
- `/models/gpt-image-2` отделяет generation от edit workflow и вводит Change / Preserve / Constraints — полезную профессиональную модель задачи.
- Во многих статьях есть trade-offs: model choice по типу задачи, ограничения одного движения/оси за итерацию, различие image и video prompts.
- Язык точный, без заметного переизбытка академического jargon; английские термины обычно объяснены контекстом.

#### Пробелы

- В sampled blog/model JSON-LD поле `citation` пусто; в видимом content модельные страницы не ведут на официальную документацию поставщика. Внешние ссылки model pages фактически сводятся к Chrome Web Store CTA.
- Exact claims («до 16 референсов и 8 связанных изображений», «4–15 секунд до 2K», «anti-bokeh stack из 3–4 фраз», «английский стабильнее») не имеют рядом источника или собственного benchmark.
- `/blog/best-ai-video-2026` называет «лучшие» модели и раздаёт роли Veo/Kling/Runway/Seedance без таблицы тестов, стоимости, одинакового prompt set и статистики трёх прогонов. Текст рекомендует «тест из трёх дублей», но не показывает результаты такого теста.
- Byline «Влад Воронежцев» — plain text, не ссылка на `/about`; читателю и crawler сложнее перейти от утверждения к credentials.

### Authoritativeness

#### Что уже работает

- Organization/Person entities связаны через `@id`; `sameAs` указывает Chrome Web Store, Telegram и YouTube.
- У автора есть реальный публичный footprint и регулярно обновляемые видео/соцсети; сторонняя точечная проверка показывает канал и публикации об Opten.
- Сайт сам по себе уже покрывает тему широким корпусом, а не одной продающей страницей.

#### Чего не хватает

- Нет блока «Где нас цитировали», публикаций в профильных медиа, подтверждённых выступлений, отраслевых наград или экспертных рецензентов.
- 30K+/40M+ — self-claimed metrics без ссылки на независимый источник/датированный snapshot.
- На model pages автор обозначен как один и тот же founder, но нет второго уровня review: «проверил/обновил» с компетенцией по конкретной платформе.
- Нет editorial board, source policy или публичной истории правок.
- Search/public spot-check нашёл соцагрегатор и видеоплатформу, но не авторитетные публикации, которые цитируют Opten как источник.

### Trustworthiness

#### Сильные сигналы

- `/about` прозрачно раскрывает ИП, ИНН, город, Paddle Merchant of Record и ссылки на Terms/Refund.
- Privacy/Terms/Refund видны в общей оболочке; сайт работает по HTTPS.
- Главная явно говорит: «Opten — независимый продукт. Указанные бренды не аффилированы с Opten».
- Learn Finds не присваивает стороннее видео Opten: есть «Оригинал на YouTube», source thumbnail и отдельный блок автора/источника.
- BlogPosting/TechArticle/LearningResource schema содержит author, publisher, datePublished/dateModified.

#### Подтверждённая проблема свежести и точности — P0

`https://opten.space/models/midjourney-8.1` (visible updated date 19 мая 2026) утверждает:

> «доступный только через alpha.midjourney.com (Discord не поддерживается)»

Это устарело: официальный Midjourney сообщил 30 апреля 2026, что V8.1 доступна в Discord и на midjourney.com, а 11 июня 2026 сделал V8.1 моделью по умолчанию. Страница также говорит, что HD всегда default и `--hd` не нужен, хотя официальный update 30 апреля временно вернул SD default и разрешил `--hd`; текущий status должен быть перепроверен на дату обновления.

Есть внутреннее противоречие:

- `/models/midjourney-8.1`: `--no` удалён и является ошибкой.
- `/blog/prompt-structure`: Midjourney 8.1 «требует аккуратных `--no` и `--style`».

Необходимо выбрать корректное текущее правило по официальной документации/живому интерфейсу и исправить все вхождения одновременно. Пока это не сделано, страницу нельзя считать надёжным AI citation candidate.

#### Другие trust-пробелы

- На статьях видна дата публикации, но нет source list, «проверено на версии», revision history или кнопки «сообщить об ошибке».
- На `/about` даты есть только в schema (published 17 мая, modified 31 мая), не видны пользователю.
- У авторских Learn lessons и Learn Find dates присутствуют в schema, но не показаны рядом с контентом.
- `sourceLabel` у `/learn/finds/ideogram-mcp-claude-code` — «Другой автор», хотя страница ведёт на конкретное YouTube-видео. Generic label ослабляет attribution и Person schema.
- Если `syntx.ai/welcome/GlUETIt6` или другие outbound links реферальные, нужна явная disclosure; текущий disclaimer «не аффилированы» не отвечает на вопрос о вознаграждении за переход/регистрацию.

## Content Quality Issues

### 1. Blog depth ниже порога для доказательного guide-контента

Все 7 sampled posts содержат примерно 591–891 слово при ориентире skill 1,500+ для thorough blog post. Сам по себе word count не является SEO-целью: `/blog/prompt-structure` отвечает на задачу компактно. Но для comparative/current topics недостаток глубины материален:

- `/blog/best-ai-video-2026` — 591 слово для сравнения четырёх моделей без benchmarks.
- `/blog/seedance-2-0-prompts` — 693 слова, но без официальных references и actual output examples.
- `/blog/gpt-image-2` — 891 слово и много точных model-behavior claims без источников.

**Точное улучшение:** не «дописать до 1,500 слов», а добавить source-backed sections: что тестировали, версия/дата, одинаковый prompt, настройки, 3 raw results, failure pattern, price/availability caveat, limitations. Если новых доказательств нет, оставить материал коротким и ослабить абсолютные утверждения.

### 2. Paragraph extraction в целом хорош, но часть абзацев перегружена

`/about` держит удобный средний размер предложения, однако отдельные абзацы превышают 80–100 слов и смешивают bio, площадки и список моделей. Model pages обычно разбиты лучше.

**Точное улучшение:** делить длинный абзац на claim → evidence/example → caveat. Каждый paragraph должен сохранять смысл при цитировании отдельно.

### 3. Blog hub пропускает heading level

На `/blog` есть H1 «Блог Opten», затем карточки размечены H3 без промежуточного H2.

**Точное улучшение:** добавить H2 для списка («Последние статьи») либо сделать названия карточек H2. Проверить, что фильтры/категории не создают пустую heading hierarchy.

### 4. Контекстные ссылки уступают карточкам

Related cards работают: 2 у blog posts, 3 у model pages, 2 у sampled author lessons. Но основной текст редко связывает утверждение с конкретной соседней страницей или официальной документацией. Например, `/blog/prompt-structure` упоминает GPT Image 2, Seedance 2.0 и Midjourney 8.1 без contextual links на соответствующие `/models/*`.

**Точное улучшение:** добавить 3–5 содержательных ссылок в body каждого guide: официальная документация для факта + 1–2 собственные model pages + следующий практический workflow. Не превращать каждое упоминание бренда в ссылку.

### 5. Learn text layer слишком тонкий для AI extraction

Авторские уроки содержат только ~244–283 слова SSR-текста. Основная ценность остаётся в видео, которое LLM/crawler может не расшифровать или не связать с точным claim.

**Точное улучшение:** добавить отредактированный transcript или подробные section notes с headings, exact prompts, settings, результатами и timestamp deep links. Короткое summary не заменяет transcript.

### 6. About силён как история, слабее как credential page

Есть first-person story, соцсети, 30K+/40M+, 60+ skills и юридические данные. Нет датированного portfolio, списка ключевых проектов, профессионального стажа в виде timeline, ссылок на выступления/публикации и пояснения, как считаются аудитория/просмотры.

**Точное улучшение:** добавить «Опыт и проверяемые работы»: годы, 3–5 проектов/кейсов, роли, ссылки, дата snapshot метрик, methodology note. Не добавлять непроверяемые титулы.

## AI Content Concerns

### Подтверждено: формульность последних SEO-материалов

У нескольких статей повторяется один шаблон: definitional intro → 4–5 steps → Before/After → FAQ; часто используются конструкции «не X, а Y», «начните не с…», «если сломалась одна ось…». Структура полезна для parsing, но при масштабировании создаёт ощущение программного шаблона и взаимозаменяемости страниц.

Примеры:

- `/blog/best-ai-video-2026`: «это не один победитель, а набор рабочих инструментов».
- `/blog/seedance-2-0-prompts`: «это не список красивых слов, а короткий режиссёрский бриф».
- `/blog/free-ai-courses`: «хорош не тем, что…, а тем, что…».
- `/blog/ai-for-work`: та же четырёхшаговая схема brief → draft → check → edit.

**Риск:** AI-системе легко извлечь абзац, но трудно понять, что именно является собственным знанием Opten, а не перефразированной общей рекомендацией.

### Вероятно: псевдо-кейсы без статуса

«Кейс Антона» и «Кейс Ирины» стилистически выглядят как реальные кейсы, но не имеют source note. Если это учебные composite examples, назвать их «условный пример». Если реальные — добавить «анонимизированный кейс», дату, задачу, baseline, результат и разрешение на публикацию. Не оставлять двусмысленность.

### Подтверждено: evidence gap у «Named case»

В `/blog/best-ai-video-2026` текст буквально начинает абзац «Named case», но не называет проект/клиента и не показывает output. Это выглядит как незавершённый шаблон и должно быть заменено на нормальный русский заголовок с доказательством либо на «Условный тестовый пример».

### Позитивные сигналы

- Нет массового filler уровня «в современном быстро меняющемся мире».
- Есть профессиональное суждение, конкретные ограничения и trade-offs.
- Большинство paragraphs можно цитировать отдельно.
- RU/EN bodies структурно зеркалятся, что снижает риск разного смысла между локалями, но factual corrections нужно применять к обеим версиям.

## Freshness Assessment

| Page | Published | Last updated | Visible date | Status |
|---|---|---|---|---|
| `/` | — | — | Нет | Product page; нужна feature/version freshness note только для быстро меняющихся claims |
| `/about` | 2026-05-17 | 2026-05-31 | Нет; только schema | Current, но дату стоит показать |
| `/blog` | Item dates 2026-05-17…2026-07-10 | — | Да, на карточках | Current hub |
| `/blog/prompt-structure` | 2026-05-28 | 2026-05-28 | Да | **Needs factual refresh:** конфликт по Midjourney 8.1 |
| `/blog/gpt-image-2` | 2026-05-17 | 2026-05-17 | Да | Review exact limits against current OpenAI docs |
| `/blog/ai-for-work` | 2026-07-10 | 2026-07-10 | Да | Current |
| `/blog/seedance-2-0-prompts` | 2026-06-01 | 2026-06-01 | Да | Current, но requires sources |
| `/blog/best-ai-video-2026` | 2026-05-29 | 2026-05-29 | Да | Review monthly; fast-changing comparison |
| `/blog/consistent-character-ai` | 2026-05-28 | 2026-05-28 | Да | Review model recommendations monthly |
| `/blog/free-ai-courses` | 2026-07-10 | 2026-07-10 | Да | Current |
| `/learn` | Item dates in schema | — | Page date нет | Hub current, page-level freshness unclear |
| `/learn/actual-ai-tools-2026` | 2026-06-06 | 2026-06-06 | Нет; только schema | Current, show date visibly |
| `/learn/junior-designer-1100-order` | 2026-06-02 | 2026-06-06 | Нет; только schema | Current, show date visibly |
| `/learn/finds/ideogram-mcp-claude-code` | 2026-06-10 | 2026-06-11 | Нет; только schema | Current, show date/source visibly |
| `/models/gpt-image-2` | 2026-05-19 | 2026-05-19 | Да | Current-ish; verify rapidly changing limits |
| `/models/seedance-2.0` | 2026-05-19 | 2026-05-19 | Да | Core facts align with official launch; add sources/check date |
| `/models/midjourney-8.1` | 2026-05-19 | 2026-05-19 | Да | **Stale/incorrect as of audit** |

## Citability Assessment

### Most Citable Passages

1. **Definition of prompt structure — `/blog/prompt-structure`.**  
   «Структура промпта — это порядок блоков в запросе к нейросети: цель, сцена, субъект, стиль, камера, ограничения и проверка результата».  
   **Почему:** самостоятельное определение, прямой answer-first формат, не требует соседнего контекста.

2. **Model-specific process — `/models/seedance-2.0`.**  
   Абзац про 9 images + 3 video + 3 audio, 4–15 seconds и storyboard.  
   **Почему:** конкретные числа и профессиональная применимость. **Условие:** добавить official citation и отделить подтверждённые vendor limits от наблюдений Opten.

3. **Iteration principle — `/blog/prompt-structure`.**  
   «Если фон хороший, а лицо не то, меняйте только identity-блок…»  
   **Почему:** ясное практическое правило с trade-off; хорошо отвечает на follow-up query.

4. **Identity workflow — `/blog/consistent-character-ai`.**  
   Разделение постоянного (лицо, волосы, детали, пропорции) и переменного (локация, действие, камера).  
   **Почему:** структурированный reusable framework; можно цитировать как checklist.

5. **Source-aware Find summary — `/learn/finds/ideogram-mcp-claude-code`.**  
   «Claude Code формулирует задачу, Ideogram генерирует изображения, а Magic Path собирает результаты…».  
   **Почему:** короткое объяснение workflow + ссылки на official MCP/tool/original video. Атрибуцию автора нужно сделать конкретной.

### Least Citable Pages

1. **`/models/midjourney-8.1` — Low.** Confirmed stale status; временно не использовать как источник до correction + recheck.
2. **`/blog/best-ai-video-2026` — Low–Medium.** Сравнительные выводы без сравнительных данных; слово «лучшие» не доказано.
3. **`/learn` — Low as a source.** 320 слов, большинство — карточки/marketing; нет canonical overview знания, критериев курса и даты обновления.
4. **`/learn/actual-ai-tools-2026` и `/learn/junior-designer-1100-order` — Low as text.** Видео ценно, но нет transcript/section notes, а даты скрыты в schema.
5. **`/blog/ai-for-work` и `/blog/free-ai-courses` — Medium.** Хорошо читаются, но generic workflow + кейсы без статуса ограничивают уникальность и trust.

## Improvement Recommendations

### P0 — немедленно: factual correction и единый источник истины для model claims

**Где:** `/models/midjourney-8.1`, `/blog/prompt-structure`, RU и EN, а также связанные skill/meta тексты.  
**Действие:**

1. Проверить текущий V8.1 status в official Midjourney updates/docs и живом UI.
2. Исправить alpha/Discord/default/HD statements.
3. Разрешить внутренний конфликт по `--no` и `--style`; массово найти все вхождения.
4. Показать «Проверено: 10 июля 2026» и 2–3 ссылки на первичные источники.
5. Обновить `dateModified` только после реальной factual review обеих локалей.

**Критерий приёмки:** одинаковое правило во всех RU/EN страницах; ни одно утверждение не противоречит official current page; source links видны рядом с facts; schema dateModified соответствует фактической правке.

### P1 — source blocks на всех быстро меняющихся страницах

**Где:** 62 `/models/*`, comparisons и model-deep-dive blog posts.  
**Действие:** добавить блок «Источники и дата проверки»:

- official model/release docs;
- official API/parameter docs;
- платформа, на которой тестировал Opten;
- дата/версия интерфейса;
- отдельная маркировка `Vendor-stated` и `Opten-tested`.

**Критерий приёмки:** каждое точное ограничение/параметр имеет source или явно помечено как собственное наблюдение; нет source links только в JSON-LD — они видимы пользователю.

### P1 — превратить «практические кейсы» в воспроизводимые mini-experiments

Для одного кейса на каждой приоритетной model page показывать:

- model + provider + date/build;
- input assets и права на них;
- exact prompt before/after;
- settings: duration, ratio, seed/variation, reference slots;
- 3 attempts, не только лучший output;
- что изменилось и что не исправилось;
- реальные output screenshots/video links с подписью «фактический результат».

**Критерий приёмки:** независимый читатель может повторить test; illustrative art явно маркирована «иллюстрация», а не выглядит как test evidence.

### P1 — редакционная прозрачность

Создать публичную страницу/блок:

- как выбираются темы и источники;
- как проверяются быстро меняющиеся model claims;
- используется ли AI при подготовке и как проходит human review;
- corrections policy и changelog;
- контакт для сообщения об ошибке;
- affiliate/sponsorship policy.

**Критерий приёмки:** ссылка доступна из footer и author/byline; исправления имеют дату и краткое описание; referral links маркируются в момент перехода/рядом с материалом.

### P1 — усилить author entity без выдуманных credentials

1. Сделать byline ссылкой на `/about` или `/authors/vlad-voronezhtsev`.
2. Добавить dateline: профессиональный стаж, роли, 3–5 проверяемых проектов, ссылки на portfolio/выступления/публикации.
3. Показать способ подсчёта 30K+ и 40M+ и дату snapshot.
4. Для model pages добавить `Reviewed by` при наличии реального второго специалиста; не создавать фиктивного reviewer.

**Критерий приёмки:** author page отвечает «почему этому человеку доверять по этой теме?» и каждое крупное claim можно проверить по ссылке.

### P2 — сделать Learn извлекаемым, а не только просматриваемым

- Показать published/updated рядом с H1.
- Добавить transcript или подробные notes по H2 с timestamp links.
- Вынести exact prompts, settings, tools, outputs и limitations в HTML.
- Указать, что lesson авторский/сторонний, и кто именно источник.
- На Finds заменить «Другой автор» реальным creator/channel name из оригинального видео и связать Person/Organization schema с source URL.

**Критерий приёмки:** без запуска видеоплеера можно понять метод, получить команды/промпты, проверить источник и процитировать конкретный вывод.

### P2 — укрепить внутренние topic clusters

- В каждом blog body добавить 2–3 contextual links на relevant `/models/*` и related guides.
- В model pages добавить links не только на похожие модели, но и на собственные benchmarks/guides/lessons.
- В Learn Finds добавить 2 related Finds по tool/workflow и back-link из релевантного pillar page.
- На `/blog` исправить H1 → H3 hierarchy.

**Критерий приёмки:** у каждой content page есть 3–5 содержательных внутренних ссылок с описательными anchor texts; crawler проходит cluster без reliance только на bottom cards.

### P2 — честно маркировать кейсы и commercial context

- Если Антон/Ирина — composite, заменить «Кейс» на «Условный пример».
- Если реальные, указать «анонимизированный кейс», период, исходную задачу, измеримый результат и что изменено ради приватности.
- В comparison/model content добавить короткую disclosure: Opten продаёт инструмент для prompt optimization; model ranking не должен зависеть от коммерческого партнёрства.
- Если outbound link реферальный, маркировать его; если нет — явно зафиксировать non-affiliate status для ссылок с referral-like path.

## Content Gaps

Новые страницы нужны только там, где есть собственные данные. Самые полезные gaps:

1. **Opten Model Benchmark Methodology** — единая публичная методика, набор prompts, scoring dimensions, число прогонов, ограничения.
2. **Model change log / freshness dashboard** — что перепроверено, когда, какие facts изменились.
3. **Real prompt experiments** — серия «один prompt × 3 модели × 3 прогона» с raw outputs, а не рейтинг без данных.
4. **Failure library** — реальные artifacts (hands, text, identity, camera, physics) с diagnosis и точечной правкой.
5. **Privacy/data-flow explainer** — видимая схема прохождения prompt/reference, retention, subprocessors и различие browser storage/server transit; это поддержит и product Trust.
6. **Author portfolio/case archive** — реальные проекты, роль автора, до/после, измеримый результат и ссылки на публикацию.
7. **Learn transcripts/notes hub** — индексируемый корпус видео с source attribution.

Не создавать дополнительные city/keyword pages или ещё десятки общих «как использовать нейросети» до появления уникальных тестов: breadth уже достаточна, дефицит — evidence и external validation.

## 30-дневный порядок внедрения

| Priority | Week | Action | Expected content/GEO effect |
|---|---|---|---|
| P0 | 1 | Midjourney factual correction + cross-site consistency pass | Убирает прямой trust defect и риск неверной AI-цитаты |
| P1 | 1 | Source/date block template для model pages | Повышает проверяемость exact claims |
| P1 | 1–2 | 3 pilot model pages: GPT Image 2, Seedance 2.0, Midjourney 8.1 с primary sources | Создаёт эталон для масштабирования |
| P1 | 2 | Один воспроизводимый 3-run benchmark с raw outputs | Даёт original data и собственную цитируемую сущность |
| P1 | 2–3 | Author/editorial/corrections/affiliate disclosure | Усиливает Expertise, Authority и Trust |
| P2 | 3 | Visible dates + transcripts/notes у 3 Learn pages | Делает video expertise извлекаемой |
| P2 | 3–4 | Contextual internal links + Finds related links + blog heading fix | Укрепляет topic graph и passage discovery |
| P2 | 4 | Разметить реальные/composite cases и illustrative/actual images | Убирает двусмысленность доказательств |

## План измерения результата

1. **Coverage:** доля model pages с 2+ primary sources, visible check date и `Vendor-stated`/`Opten-tested` labels. Baseline sampled: 0/3.
2. **Accuracy:** число открытых factual contradictions в cross-page scan. Baseline: минимум 2 по Midjourney 8.1 (platform status, `--no` rule).
3. **Evidence:** число pages с reproducible experiment и raw outputs. Baseline sampled: 0/10 blog/model pages.
4. **Authorship:** доля BlogPosting/TechArticle pages, где visible byline ведёт на credential page. Baseline sampled: 0/10.
5. **Learn extraction:** доля lesson/find pages с visible date, named source and transcript/section notes. Baseline sampled: 0/3 выполняют всё одновременно.
6. **Internal links:** median contextual in-body links по content pages (breadcrumbs/CTA/bottom cards не считать). Baseline sampled: около 0.
7. **AI citation monitoring:** ежемесячно проверять фиксированный набор 20 factual queries по model limits/workflows; сохранять cited domains/passages и долю упоминаний Opten. Не смешивать рост упоминаний с гарантией роста органических позиций.

## Primary Sources Used for Spot Verification

- [OpenAI GPT Image 2 model page](https://developers.openai.com/api/docs/models/gpt-image-2)
- [OpenAI ChatGPT Images 2.0 system card](https://deploymentsafety.openai.com/chatgpt-images-2-0)
- [ByteDance Seedance 2.0 official launch](https://seed.bytedance.com/blog/seedance-2-0-official-launch)
- [ByteDance Seedance 2.0 product page](https://seed.bytedance.com/en/seedance2_0)
- [Midjourney V8.1 Alpha announcement — 14 Apr 2026](https://updates.midjourney.com/v8-1-alpha/)
- [Midjourney V8.1 Updates — Discord/web availability and SD/HD note, 30 Apr 2026](https://updates.midjourney.com/v8-1-updates/)
- [Midjourney V8.1 becomes default — 11 Jun 2026](https://updates.midjourney.com/v8-1-is-now-the-default-model/)

## Final Quality Check

- Данные и точные даты отделены от гипотез.
- Word count используется как diagnostic, не как самостоятельный ranking factor.
- Не утверждается, что отсутствие formal credentials означает отсутствие реального опыта.
- Не заявляется наличие/отсутствие backlinks без backlink dataset; внешняя авторитетность оценена консервативно.
- Рекомендации привязаны к конкретным URL, passages, источникам и критериям приёмки.
- Рост позиций или AI citations не гарантируется; предложены измеримые leading indicators.
