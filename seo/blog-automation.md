---
tags: [opten, blog, semantics, seo, geo, brief]
kind: brief
repo: opten-website (self-contained under seo/)
date: 2026-05-29
---

# Блог opten.space — семантика и SEO-оформление постов

> **Что это.** Бриф-руководство по контенту: **откуда брать ключи, как их
> проставлять в текст, как оформить пост SEO/GEO-правильно и как делать
> картинки**. Это «мозг» по содержанию — *что* писать и *как* оптимизировать.
>
> **Что НЕ здесь.** Механику запуска, расписания и публикации описывает
> `seo/routine-instructions.md` (Claude Code local routine). Здесь — только
> семантика, требования к посту и стиль изображений.
>
> **Где применяется.** Пост создаётся в этом репозитории (`opten-website`).
> Эталон формы — живой пост `src/content/blog/gpt-image-2.ts`; спорные вопросы
> сверяй с ним.

---

## 0. Ежедневная автоматизация

Посты публикует **Claude Code Local routine**. Полная механика и порядок шагов —
в `seo/routine-instructions.md`. Коротко: routine стартует в изолированном
worktree opten-website → выбирает тему → пишет двуязычный пост → генерит картинки
через `seo/fal-image.mjs` (FAL GPT Image 2, 1600×900) → `npm run build` →
commit + push прямым коммитом в `origin/main` (`git push origin HEAD:main`).
PR/merge и remote feature-веток нет; worktree — только локальная изоляция
checkout'а. Успех = `opten.space/blog/<slug>` и `/en/blog/<slug>` отдают 200.

Ниже §1–§7 — только контент/SEO-substance: **что** писать и **как** оптимизировать.

---

## 1. Откуда брать ключи

Семантика блога собрана в SEO-воркспейсе `opten-seo`. Источники по приоритету
(для ручной работы человека):

1. **`opten-seo/keywords/blog-clusters.md`** — курируемый phrase-bank: топ-фразы по
   темам с объёмами и идеями статей. Главный рабочий источник для писателя.
2. **Supabase (SEO-проект), таблица `seo_keywords`** — полный свежий список:
   ```sql
   select keyword, language, volume, cluster_id
   from seo_keywords
   where cluster_id like 'BL-%'
   order by cluster_id, volume desc nulls last;
   ```
   Объём: EN — Bing BroadImpressions; RU — Yandex Wordstat (регион 225, /мес).
   Хвост без цифры = реальный спрос из Google Suggest.

**4 кластера (метка `cluster_id`):**

| Кластер | Тема | Топ-объём (пример) | Роль |
|---------|------|--------------------|------|
| `BL-news` | новости/релизы/сравнения | `nano banana` 122k, RU `нейросеть для видео` 55.8k | быстрый трафик на инфоповоде |
| `BL-technique` | how-to / техники | `image to video ai` 9.9k, `ai face swap` 7.3k | вечнозелёные гайды |
| `BL-usecase` | применения | `ai logo generator` 5.6k | коммерческий интент, конверсия |
| `BL-prompting` | промптинг как тема | `what is a prompt`, RU `негативный промпт` 468 | ядро продукта, ближе всего к Opten |

**Как выбрать тему:** возьми head-фразу кластера → разверни в угол статьи
(«Nano Banana: что это и как писать промпты», «Sora 2 vs Veo 3.1: что выбрать»).
Стартовый бэклог с предложенными slug'ами — §7. Не повторяй уже написанное
(сверься со slug'ами в `src/content/blog/index.ts`).

**Runtime автоматизации.** Routine работает в worktree opten-website **без доступа
к Supabase и `opten-seo/keywords/blog-clusters.md`**. Темы он берёт из стартового
бэклога §7 + таблицы кластеров выше; дедуп — по `src/content/blog/index.ts`.
Внешние источники применимы только при ручном редактировании брифа человеком.

---

## 2. Как проставлять ключи в посте (ядро брифа)

Принцип: **одна основная фраза на пост** (head кластера или сильный long-tail) +
2–4 семантических варианта/смежных запроса. Не keyword-stuffing — фразы вплетаются
естественно, статья сначала полезная.

**Карта размещения (куда какой ключ):**

| Элемент поста | Что туда |
|---------------|----------|
| `title` (=H1) | основная фраза ближе к началу, ≤ ~60 симв., естественно |
| `excerpt` / `description` | основная + 1 смежная, в формулировке «польза/действие» |
| `body.intro` (первые 40–60 слов) | основная фраза **+ определительный ответ** (answer-block) — то, что AI-движки цитируют. См. §3 |
| заголовки `sections[].heading` / `steps[].title` (H2) | смежные фразы и how-/why-формулировки |
| `body` шагов/секций | long-tail и синонимы в естественном тексте, без повторов в точную форму |
| `faq[].q` | **реальные вопросы-запросы** из Suggest (как/почему/что/сколько) — кормят FAQPage-схему и голос/AI |
| `cover.alt` | описательно + основная фраза один раз |
| `tags` | из закрытого enum (§3); поле schema `keywords` = теги через запятую (выводится автоматически) |
| `related` | до 3 slug смежных постов (внутренняя перелинковка) |

**RU и EN — раздельно, не переводом.** Спрос на языках разный: RU тянет
`нейросеть для видео` (55.8k), EN — `image to video ai` (9.9k). Для каждой локали
бери **свои** фразы, а не переводи ключи RU↔EN. Тексты самостоятельные на каждом языке.

**GEO-акценты (цитируемость в ChatGPT/Perplexity/AI Overviews):**
- intro = сжатый прямой ответ в первых 40–60 словах (answer-block).
- FAQ из вопросов-запросов → прямые Q→A блоки.
- Конкретика, цифры, примеры «до/после» — их AI охотнее цитирует, чем воду.

**Opten вплетаем органично** (1–2 раза): «промпт решает половину результата →
Opten сгенерит/оценит/улучшит промпт под конкретную модель прямо в интерфейсе
генератора», мягкий CTA на расширение.

**Чего избегать:** free-seeker хвост (`free`, `без регистрации`, `unlimited`) —
плохо конвертит в Pro; off-ICP (`prompt engineering course`, карьера/курсы) — не
наш юзер; coding-сравнения нейросетей — не наша тема.

---

## 3. SEO-оформление поста — обязательные требования

Тип — `src/content/blog/types.ts`. Пост = `{ ru: BlogPostLocale, en: BlogPostLocale }`.

**Поля и инварианты (на каждую локаль):**

| Поле | Правило |
|------|---------|
| `slug` | одинаковый ru/en; уникальный; kebab-case латиницей |
| `title` | ≤ ~60 симв.; содержит основную фразу |
| `excerpt` | 140–180 симв. |
| `description` | 150–160 симв. (`<meta name=description>`) |
| `category` | ровно 1 из enum (ниже) |
| `tags` | 2–4 из enum (ниже) |
| `cover` | `{src,width,height,alt}`; **1600×900**; alt свой на язык |
| `readingTimeMin` | целое (≈ слов/180) |
| `publishedAt`/`updatedAt` | ISO `YYYY-MM-DD`; **ru и en одинаковые**; на создании updatedAt = publishedAt |
| `body.intro` | **40–60 слов**, answer-block (§2) |
| `body.sections[]` | `{heading, body, image?}`; в `body` абзацы через `\n\n` |
| `body.steps[]` | `{title, body, before?, after?, imageSrc?}` → HowTo-схема |
| `body.faq[]` | `{q, a}` → FAQPage-схема |

**Глубина (для E-E-A-T и ранжирования):** обязательно **FAQ (3–5 Q&A)** плюс
**`steps` (4–6) либо `sections` (3–6)** плюс **4–5 изображений** (§6 — FAL
GPT Image 2, RU/EN раздельно). Только intro — мало.

**Experience-сигнал (обязательно):** в каждом посте — минимум один named
практический кейс генерации: конкретная актуальная модель, первая ошибка,
точное исправление. Пример формы: «в Kling 3.0 первый рендер дал 6 пальцев →
`preserve finger count` починил». Кейс должен жить в прозе статьи, а не только
в schema/keywords.

**Структура steps:** не дублируй один шаблон 4–5 раз. Чередуй: шаг-диагностика
(что пошло не так), шаг-кейс (как починили), шаг-сравнение моделей,
шаг-чек-лист. `before/after` ставь только там, где это реально помогает.

**Актуальный реестр моделей.** Названия и версии сверяй с
`src/content/models/slugs.ts` + `_registry.ts` + `_summaries.ts`. Старые версии и
снятые модели не выдавай как живые. Опорные актуалы: video/image-to-video —
Kling 3.0, Veo 3.1, Seedance 2.0/Seedance New, Runway Gen-4.5, Luma Ray 3, Wan,
Pixverse 6; image — GPT Image 2, Midjourney 8.1, Nano Banana Pro, Imagen 4 Ultra,
Seedream 5, Flux Kontext.

**Закрытые enum'ы (чужое значение роняет сборку — это защита):**
- `BlogCategory` (1): `guide` · `deep-dive` · `comparison` · `news`
- `BlogTag` (2–4): `ai-image-gen` · `ai-video-gen` · `prompt-engineering` ·
  `model-deep-dive` · `workflow` · `release-notes`

**Маппинг кластер → категория / теги:**

| Кластер | category | типичные tags |
|---------|----------|---------------|
| `BL-news` | `news` / `comparison` | `release-notes`, `model-deep-dive`, `ai-image-gen`/`ai-video-gen` |
| `BL-technique` | `guide` | `workflow`, `ai-image-gen`/`ai-video-gen`, `prompt-engineering` |
| `BL-usecase` | `guide` | `ai-image-gen`/`ai-video-gen`, `workflow` |
| `BL-prompting` | `deep-dive` | `prompt-engineering`, `model-deep-dive` |

Схему (BlogPosting + HowTo + FAQPage + WebPage/speakable + BreadcrumbList), мету,
hreflang, sitemap, llms.txt сайт собирает **сам** из этих полей — нужно лишь
заполнить пост правильно и подключить его (§5).

---

## 4. Скелет поста (заполнить и сохранить как `<slug>.ts`)

```ts
import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "<YYYY-MM-DD>";

// Обложка без текста → один файл на RU+EN; alt свой на язык.
const COVER_RU = { src: "/blog/<slug>/cover.jpg", width: 1600, height: 900, alt: "<RU alt>" };
const COVER_EN = { src: "/blog/<slug>/cover.jpg", width: 1600, height: 900, alt: "<EN alt>" };

const ru: BlogPostLocale = {
  slug: "<slug>",
  title: "<RU заголовок ≤60 симв., с основной фразой>",
  excerpt: "<RU 140–180 симв.>",
  description: "<RU 150–160 симв.>",
  category: "<guide|deep-dive|comparison|news>",
  tags: ["<tag1>", "<tag2>"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  body: {
    intro: "<RU 40–60 слов: основная фраза + прямой ответ в первых же словах>",
    steps: [
      {
        title: "<RU шаг 1 — описательный (= alt картинки)>",
        body: "<...>",
        before: "<опц.>", after: "<опц.>",
        imageSrc: "/blog/<slug>/ru/step-1.jpg",   // FAL GPT Image 2, текст по-русски
      },
      // 4–6 шагов; всего 4–5 картинок на пост (§6)
    ],
    // ИЛИ sections: [{ heading: "<RU h2 со смежной фразой>", body: "<абзацы через \\n\\n>",
    //   image: { src: "/blog/<slug>/ru/sec-1.jpg", width: 1600, height: 900, alt: "<RU alt>" } }],
    faq: [
      { q: "<RU вопрос-запрос>", a: "<RU прямой ответ>" },
      // 3–5 Q&A
    ],
  },
};

const en: BlogPostLocale = {
  slug: "<slug>",
  title: "<EN title ≤60 chars, with the primary phrase>",
  excerpt: "<EN 140–180 chars>",
  description: "<EN 150–160 chars>",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: ru.readingTimeMin,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  body: {
    intro: "<EN 40–60 words: primary phrase + a direct answer up front>",
    steps: [ { title: "<EN step 1>", body: "<...>", imageSrc: "/blog/<slug>/en/step-1.jpg" } ],
    faq: [ { q: "<EN question-query>", a: "<EN direct answer>" } ],
  },
};

export const post: BlogPost = { ru, en };
```

---

## 5. Что трогает один пост (справка по интеграции)

Кроме самого `<slug>.ts` пост надо дописать в несколько мест (routine это делает
сам — здесь для понимания):

- `src/content/blog/index.ts` — регистрация в `blogPostsBySlug` (импорт + строка).
- `scripts/seo-routes.ts` — 2 роута (`/blog/<slug>` + `/en/blog/<slug>`) со схемой
  через готовые билдеры; **и добавить пост в `itemListBlock` обоих хабов** `/blog`
  и `/en/blog` (частая ловушка — иначе пост не попадёт в schema листинга).
- `src/i18n/paths.ts` — путь в `STATIC_EN_SIBLINGS` (переключатель RU↔EN).
- `scripts/sitemap.mjs` — обе локали в `PATH_TO_SOURCE` (lastmod по git-mtime).
- `scripts/llms.mjs` — добавить пост в обе локали, иначе он не попадёт в `llms.txt`.
- `public/blog/<slug>/cover.jpg` — обложка (без текста, общая RU/EN).
- `public/blog/<slug>/ru/*.jpg` + `public/blog/<slug>/en/*.jpg` — внутристатейные
  изображения с текстом, по локалям (§6); `width`/`height` в посте = реальные размеры.

Листинг и страница поста рендерятся **автоматически** из барреля — компоненты не
трогать. После правок сборка должна оставаться зелёной (`npm run build` — routine
проверит); падение TS-сборки `seo-routes.ts` обычно значит чужой тег/категорию или
рассинхрон полей.

---

## 6. Изображения статьи (обложка + 4–5 внутристатейных)

**Движок — FAL, модель GPT Image 2 (High Quality), через готовый хелпер
`seo/fal-image.mjs`.** Ключ хелпер читает сам. Перед картинками сделай `npm ci`
(нужен `sharp`). Один кадр:

```bash
node seo/fal-image.mjs --prompt "<английский промпт кадра>" --out "public/blog/<slug>/ru/step-1.jpg"
```

Хелпер всегда отдаёт ровно **1600×900 jpeg**.

**Эталон стиля — реальные референсы `seo/Reference/step-1..4.jpg`.** Каждый кадр
обязан попадать в их визуальный язык. Сверяйся с ними, не выдумывай свой стиль.

### 6.1 Обложка (1 на пост)
- 16:9 1600×900, **без текста** → один файл на RU+EN: `public/blog/<slug>/cover.jpg`.
- Кинематографичный предметный кадр под тему (персонаж, робот, сцена, девайс) на
  тёмном тил-чёрном фоне с мягким лаймовым свечением. Премиальный, не «стоковый».

### 6.2 Внутристатейные (4–5 на пост)
- **Visual-first + лаймовый UI-оверлей.** Сначала сильный кинематографичный
  объект-результат, поверх — аккуратная схема (см. 6.3). Не голая сетка панелей.
- **Текст на кадре — крупный и короткий** (1–4 слова): «РЕФЕРЕНСЫ», «ВЫБОР»,
  «ДВИЖЕНИЕ», «ДО»/«ПОСЛЕ», «5 БЛОКОВ». Без абзацев и мелких подписей.
- **RU и EN — отдельные файлы, но ОДИНАКОВАЯ композиция:** тот же визуал, та же
  раскладка, те же объекты; меняется только язык короткого текста.
  `public/blog/<slug>/ru/<name>.jpg` и `…/en/<name>.jpg`.
- **Чипы реальных моделей можно** (GPT Image 2, Nano Banana Pro, Kling 3.0,
  Veo 3.1 …) — это по теме статьи. **Нельзя** показывать Opten/PromptScore,
  score-индикаторы, «оценку/улучшение промпта», продающий UI расширения.
- Смысл кадра дублируй в тексте поста и в `alt`. Если FAL исказил слово — перегенери
  или наложи короткий текст локально поверх готового визуала.
- Размещение: `steps[].imageSrc` (alt = `title` шага — делай title описательным)
  и/или `sections[].image` (`{src,width,height,alt}` — alt свой на язык).

### 6.3 Визуальный язык (из `seo/Reference/`)
- **Фон:** тёмный тил-чёрный `#011417`, почти чёрный, лёгкая виньетка/grain.
- **Акцент:** лайм `#9CFB51` — заголовки, номера-бейджи (лаймовый круг с цифрой),
  иконки-аутлайн, чек-маркеры, стрелки (сплошные и пунктирные), прогресс-бары,
  бордеры-свечение карточек, статус-лейблы, и **filled-CTA** (лаймовая кнопка с
  тёмным текстом, напр. «ГОТОВО»).
- **Текст:** белый (основной) + приглушённый серо-зелёный (вторичный). Заголовки —
  крупные, жирные, часто одно слово лаймом (`IDENTITY`, `DRIFT`, `5 БЛОКОВ`).
- **Карточки:** скруглённые тёмные панели `#0e2023` с тонким лаймовым бордером и
  мягким свечением.
- **UI-словарь (бери из референсов):** нумерованные шаги 1→2→3 карточками со
  стрелками; вертикальные/горизонтальные чек-листы с иконками; рамки-уголки
  «фокуса» вокруг портрета; пиллы «ДО»/«ПОСЛЕ»; предупреждающий треугольник +
  пунктир на проблеме; таймлайн с точками; скраббер видео (play, progress, ⏸, ⛶);
  чипы моделей (лого + имя); нижний статус-бар со щитом и короткой фразой.
- **Встроенный «результат»:** кинематографичные кадры в тёмно-зелёной гамме
  (персонаж в профиль, робот-бариста, ночной город) живут внутри карточек.
- Шрифты сайта: `Unbounded` (заголовки), `PT Root UI` (подписи) — на картинке
  имитируй их дух (жирный гротеск для заголовка, чистый sans для подписей).

### 6.4 Как писать промпт для FAL
Промпт — на английском, как бриф кадра: **назначение → сцена → лаймовый UI →
точный видимый текст в кавычках → палитра**. Шаблоны:

Обложка (без текста):
```
Minimal cinematic hero illustration, deep teal-black (#011417) background,
single soft lime-green (#9CFB51) radial glow, [subject for the topic],
premium dark SaaS aesthetic, subtle film grain, no text, 16:9.
```

Внутристатейный кадр (визуал + лаймовый UI + короткий текст):
```
Dark premium UI concept illustration, deep teal-black (#011417) background.
Bold lime-green (#9CFB51) heading "<1–2 WORDS>" top-left.
[cinematic subject of the topic] inside a rounded dark card (#0e2023) with a
thin lime glow border. Lime outline icons, a dashed lime arrow, a small status
bar. Text large, clean, white and lime. Modern SaaS dashboard layout. 16:9.
Match the style of the opten reference banners (dark teal-black + lime green).
```

- **ДО/ПОСЛЕ:** две карточки рядом, пиллы «ДО»/«ПОСЛЕ» (RU) или "BEFORE"/"AFTER"
  (EN), лаймовая стрелка между ними, чек-марк на «после», предупреждающий
  треугольник на проблеме «до».
- **Пошаговый флоу:** 3 карточки с лаймовыми бейджами «1/2/3», заголовками и
  чипами моделей (как `seo/Reference/step-3.jpg`).
- **Панель управления:** слева нумерованный чек-лист/прогресс, справа
  кинематографичный результат + таймлайн (как `seo/Reference/step-2.jpg`).

---

## 7. Стартовый бэклог тем

Топ по объёму; slug — предложение. News-темы проверяй на свежесть перед взятием.
Runtime-дедуп — против `src/content/blog/index.ts`.

**Уже опубликовано (НЕ брать снова):** `gpt-image-2`, `image-to-video`,
`consistent-character-ai`, `negative-prompt`, `prompt-structure`.

**Доступные темы по кластерам:**

**BL-news:** `nano-banana-prompts` (122k) · `sora-2-vs-veo-3-1` ·
`best-ai-video-2026` (RU 55.8k) · `seedance-2-0` · `kling-3-0`
**BL-technique:** `ai-face-swap` (7.3k) · `upscale-image-ai`
**BL-usecase:** `ai-logo-generator` (5.6k) · `ai-headshot` (1.3k) · `ai-influencer` ·
`ai-ugc-for-brands`
**BL-prompting:** `what-is-a-prompt` · `prompt-examples`

---

## Приложение — ключевые файлы

| Файл | Роль |
|------|------|
| `seo/routine-instructions.md` | инструкции Claude routine (механика запуска) |
| `seo/fal-image.mjs` | генератор картинок через FAL GPT Image 2 (1600×900) |
| `seo/Reference/step-1..4.jpg` | **эталон стиля изображений** |
| `src/content/blog/types.ts` | тип `BlogPost`, enum'ы `BlogTag`/`BlogCategory` |
| `src/content/blog/index.ts` | баррель `blogPostsBySlug` |
| `src/content/blog/gpt-image-2.ts` | **эталонный пост** |
| `scripts/seo-routes.ts` | роуты + JSON-LD билдеры; `SITE_ORIGIN`, `FOUNDER_NAME`, `ORG_BLOCK` |
| `src/i18n/paths.ts` | `STATIC_EN_SIBLINGS` |
| `scripts/sitemap.mjs` | `PATH_TO_SOURCE` |
| `scripts/llms.mjs` | пост в `llms.txt` (обе локали) |
| `src/styles/theme.css`, `src/styles/fonts.css` | бренд-палитра и шрифты |
