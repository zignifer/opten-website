---
type: quick
quick_id: 260517-t5i
slug: seo-geo-audit-batch
status: in-progress
created: 2026-05-17
---

# SEO + GEO improvements batch (post 2026-05-17 audit)

**Источник:** [.planning/research/GEO-AUDIT-2026-05-17.md](../../research/GEO-AUDIT-2026-05-17.md)

**Скоп:** P0+P1+часть P2, только on-site код (~150 LOC, 11 файлов, 10 атомарных коммитов).

**Goal:** поднять композитный GEO score 63 → ~75-78 за один батч.

## Задачи (атомарные коммиты)

### Task 1 — `feat(seo): Person/Organization/SoftwareApp/Product enrichment + sameAs +YouTube`
**File:** `scripts/seo-routes.ts`

- `PERSON_FOUNDER_BLOCK` (строки 106-116):
  - `name`: "Виктор Воронежцев" → "Влад Воронежцев"
  - +`alternateName: "Воронежцев Владислав Павлович"`
  - +`givenName: "Владислав"`, +`familyName: "Воронежцев"`
  - +`description: "AI-блогер, автор Chrome-расширения Opten для оценки промптов под конкретные AI-модели."`
  - +`knowsAbout: ["AI image generation", "Prompt engineering", "Midjourney", "GPT Image 2", "Kling", "Sora", "Flux"]`
  - +YouTube в `sameAs`: `https://www.youtube.com/@v.voronezhtsev`

- `ORG_BLOCK` (строки 64-77):
  - +`description: "Opten — Chrome-расширение для AI-оценки и улучшения промптов под 60+ моделей генерации изображений и видео (Midjourney, GPT Image 2, Kling, Sora и др.)."`
  - +`foundingDate: "2026-04-22"`
  - +`contactPoint: { @type, contactType: "customer support", email: "zignifer@gmail.com", url: FOUNDER_TELEGRAM_URL, availableLanguage: ["ru", "en"] }`
  - +YouTube в `sameAs`

- `SOFTWARE_APP_BLOCK` (строки 89-103):
  - +`description: "Chrome extension that scores AI prompts against 60+ image and video generation models..."`
  - +`screenshot: DEFAULT_OG_IMAGE_EN`
  - +`softwareVersion: "1.3.6"` (sync from C:\Projects\promptscore\manifest.json)
  - +`aggregateRating: { @type: "AggregateRating", ratingValue: "5", reviewCount: "2", bestRating: "5", worstRating: "1" }`

- `productBlock` (функция, строки 154-217):
  - +`image: [DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_EN]`
  - +`aggregateRating: { ratingValue: "5", reviewCount: "2", bestRating: "5", worstRating: "1" }`

### Task 2 — `feat(seo): Article + WebPage speakable schemas on landing/about/guides`
**File:** `scripts/seo-routes.ts`

- Новые builder'ы:
  - `articleBlock({ pageId, type, headline, description, datePublished, dateModified, inLanguage, articleSection })` — генерит Article или TechArticle с `author: PERSON_FOUNDER_REF`, `publisher: ORG_REF`, `mainEntityOfPage`
  - `webPageBlock({ pageId, url, name, inLanguage, cssSelector, about })` — WebPage с speakable

- Подключить:
  - `/`, `/en/` → +`webPageBlock` с selectors `[h1, .faq-question, .faq-answer]`, `about: SOFTWARE_APP_REF`
  - `/about` → +`articleBlock` тип "Article", `datePublished/dateModified: "2026-05-17"`, lang ru-RU
  - `/en/about` → то же, lang en-US
  - `/guides/gpt-image-2` → +`articleBlock` тип "TechArticle" с `datePublished/dateModified` из `gptImage2Guide.ru.publishedAt/updatedAt` + +`webPageBlock` с selectors `[h1, .guide-intro, h2]`
  - `/en/guides/gpt-image-2` → то же для EN

### Task 3 — `feat(robots): explicit AI bot entries (8 bots) + unified Disallow`
**File:** `public/robots.txt`

Добавить блоки `User-agent: ... / Allow: / / Disallow: /account /en/account /success /en/success /dashboard/ /en/dashboard/` для:
- OAI-SearchBot
- ChatGPT-User
- CCBot
- Bingbot
- YandexBot
- Meta-ExternalAgent
- Amazonbot
- Bytespider

Также добавить тот же набор Disallow в существующие блоки `anthropic-ai`, `Applebot-Extended`, `cohere-ai` (сейчас у них только `Allow: /` без Disallow).

### Task 4 — `perf(fonts): PT Root UI font-display optional + drop preload (mobile CLS fix)`
**Files:** `src/styles/fonts.css`, `index.html`

- `fonts.css`: PT Root UI `font-display: swap` → `optional`
- `index.html`: убрать `<link rel="preload" href="/fonts/PT-Root-UI_VF.woff2" ...>` (строка 67); оставить Unbounded preload.

Обоснование: PT Root UI — текстовый шрифт. `optional` блокирует swap-shift на slow networks (это то что даёт CLS 0.129 на RU mobile). Browser использует fallback навсегда если шрифт не загрузился за ~100ms — что нормально для below-the-fold текста. H1 (Unbounded) остаётся swap+preload.

### Task 5 — `feat(landing): definitional paragraph under hero + partners disclaimer`
**Files:** `src/app/App.tsx`, `src/i18n/ru.json`, `src/i18n/en.json`

- App.tsx Hero (после строки 187, после `highlight.svg`): добавить `<p className="...">{t("hero.definitional")}</p>` — мелким шрифтом, max-width 800px.
- App.tsx Partners (внутри `<Partners>`, после logo bar внизу секции): добавить `<p>{t("partners.disclaimer")}</p>` — самым мелким серым.

- ru.json keys:
  - `hero.definitional`: "Opten — расширение Chrome для оценки и улучшения AI-промптов под конкретную нейросеть. Поддерживает 60+ моделей: Midjourney, GPT Image 2, Kling, Sora, Nano Banana, Flux. Работает в интерфейсе Syntx, Higgsfield, Freepik. От 199₽ или $2.99 в месяц."
  - `partners.disclaimer`: "Opten — независимый продукт. Указанные бренды не аффилированы с Opten."

- en.json keys:
  - `hero.definitional`: "Opten is a Chrome extension that scores AI prompts for a specific model. Supports 60+ image and video models — Midjourney, GPT Image 2, Kling, Sora, Nano Banana, Flux — and rewrites them in one click inside the Syntx, Higgsfield, and Freepik interfaces. From $2.99/month."
  - `partners.disclaimer`: "Opten is an independent product. The brands shown are not affiliated with Opten."

### Task 6 — `feat(guide): visible publish/update dates + fix About link gate on EN`
**File:** `src/app/pages/GuidePage.tsx`

- После `<h1>` (строка 58): добавить
  ```jsx
  <p className="text-[rgba(255,255,255,0.4)] text-[14px] mb-[24px]">
    {t("guide.publishedLabel")}: <time dateTime={data.publishedAt}>{formatDate(data.publishedAt, lang)}</time>
    {data.updatedAt !== data.publishedAt && (
      <> · {t("guide.updatedLabel")}: <time dateTime={data.updatedAt}>{formatDate(data.updatedAt, lang)}</time></>
    )}
  </p>
  ```
- Helper `formatDate(iso, lang)` — inline в файле или в `i18n/format.ts`.

- Строки 113-115: снять `lang === "ru" && (...)` гейт у About-link в footer (тот же баг как в App.tsx — `/en/about` теперь существует).

- i18n keys в ru.json/en.json:
  - `guide.publishedLabel`: "Опубликовано" / "Published"
  - `guide.updatedLabel`: "Обновлено" / "Updated"

### Task 7 — `feat(about): founder email contact`
**Files:** `src/app/pages/AboutPage.tsx`, `src/i18n/ru.json`, `src/i18n/en.json`

После Telegram-кнопки (строка 56) добавить email-ссылку:
```jsx
<a href="mailto:zignifer@gmail.com" className="...">
  {t("about.emailCta")}
</a>
```

i18n keys:
- ru.json `about.emailCta`: "Написать на email"
- en.json `about.emailCta`: "Email me"

### Task 8 — `chore(llms): /en/about in About section + better truncated header`
**File:** `scripts/llms.mjs`

- Строка 35: `match: (p) => p === "/about"` → `match: (p) => p === "/about" || p === "/en/about"`
- Строка 152: `"# Opten (truncated)\n\n# Note: legal..."` → `"# Opten — full content (legal pages excluded)\n\n# Note: legal..."`

### Task 9 — `chore(sitemap): per-route lastmod via git mtime`
**File:** `scripts/sitemap.mjs`

- Добавить mapping `path → source-file` (dict в файле).
- Для каждого route — `git log -1 --format=%cI -- <source-file>` → ISO date → подставить в `<lastmod>`.
- Fallback на `BUILD_DATE` если git недоступен или source не найден.

Маппинг:
- `/`, `/en/` → `src/app/App.tsx`
- `/about`, `/en/about` → `src/content/about.tsx`
- `/guides/gpt-image-2`, `/en/guides/gpt-image-2` → `src/content/guides/gpt-image-2.ts`
- `/pay`, `/en/pay` → `src/app/pages/PayPage.tsx`
- `/welcome`, `/en/welcome` → `src/app/pages/WelcomePage.tsx`
- `/privacy`, `/en/privacy` → `src/app/pages/PrivacyPage.tsx`
- `/terms`, `/en/terms` → `src/app/pages/TermsPage.tsx`
- `/refund`, `/en/refund` → `src/app/pages/RefundPage.tsx`

### Task 10 — `chore(prerender): per-route meta author`
**Files:** `scripts/prerender.mjs`, `scripts/seo-routes.ts`

- В `RouteMeta` интерфейсе: +опциональное поле `author?: string`.
- В seo-routes.ts: для 4 routes (`/about`, `/en/about`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2`) — `author: "Влад Воронежцев"`.
- В prerender.mjs: при наличии `route.author` подменять `content="Opten"` в `<meta name="author" ...>` на `content="${route.author}"`. Если нет — оставлять generic.

## Validation gate

После всех 10 коммитов:
- `npm run build` — должен пройти чисто (16 routes, FAQ parity gate OK)
- `dist/about/index.html`, `dist/en/about/index.html` — содержат `Влад Воронежцев` (не "Виктор") в JSON-LD
- `dist/index.html` — содержит `hero.definitional` параграф
- `dist/en/index.html` — то же EN
- `dist/sitemap.xml` — `<lastmod>` различается между routes (per-page git mtime)
- `dist/llms.txt` — `## About` секция содержит и `/about`, и `/en/about`

## Push

После успешной валидации — `git push origin main`.

## Out of scope (отдельным шагом)

- CSP в `vercel.json` (Paddle risk — нужно тестировать)
- `/guides` index hub page (контент-работа)
- Founder photo (нет asset'а `public/assets/about/founder.jpg`)
- Microsoft Clarity, IndexNow file, BWT meta (внешнее или сделано пользователем)
