---
type: quick
quick_id: 260517-t5i
slug: seo-geo-audit-batch
status: complete
created: 2026-05-17
completed: 2026-05-17
---

# SUMMARY — SEO+GEO improvements batch (post 2026-05-17 audit)

10 атомарных коммитов, 11 файлов, ~190 строк изменений. Билд чист (16 routes, FAQ parity gate OK).

## Что сделано

| # | Commit | Files | Audit refs |
|---|--------|-------|------------|
| 1 | `feat(seo): Person/Org/SoftwareApp/Product schema enrichment + sameAs +YouTube` [04d72a3] | scripts/seo-routes.ts | CR-1, CR-2, CR-3, HI-2, HI-3 |
| 2 | `feat(seo): Article + WebPage speakable schemas on landing/about/guides` [928c6c5] | scripts/seo-routes.ts | HI-4, ME-4 |
| 3 | `feat(robots): explicit entries for 8 AI crawlers + unified Disallow set` [ac0c767] | public/robots.txt | HI-8 |
| 4 | `perf(fonts): PT Root UI font-display optional + drop preload — fixes mobile CLS` [6141a0d] | fonts.css, index.html, prerender.mjs | CR-4 |
| 5 | `feat(landing): definitional paragraph under hero + partners disclaimer` [194c3a1] | App.tsx, ru/en.json | ME-1, CR-5 |
| 6 | `feat(guide): visible publish/update dates + fix About link gate on EN footer` [a4e6122] | GuidePage.tsx, ru/en.json | HI-5 + spot-fix |
| 7 | `feat(about): founder email contact alongside Telegram CTA` [45999a9] | AboutPage.tsx, ru/en.json | ME-7 |
| 8 | `chore(llms): /en/about under ## About + clearer truncated header` [005cdab] | scripts/llms.mjs | HI-1 |
| 9 | `chore(sitemap): per-route lastmod via git mtime of source files` [381862a] | scripts/sitemap.mjs | ME-12 |
| 10 | `chore(prerender): per-route <meta name=author> for human-byline pages` [9748e3b] | prerender.mjs, seo-routes.ts | ME-10 |

## Главные результаты

**Critical CR-1 закрыт.** Имя founder в JSON-LD приведено в соответствие с visible content: `Person.name = "Влад Воронежцев"` + `alternateName: "Воронежцев Владислав Павлович"`. Это ключевая поправка — раньше AI-системы получали schema-vs-body конфликт, ChatGPT/Perplexity могли называть founder некорректно.

**CR-2/CR-3.** YouTube канал `@v.voronezhtsev` (4500 subs, 7M views) подключён к Person.sameAs И Organization.sameAs. Это главный external authority signal.

**SoftwareApp + Product** обогащены: `aggregateRating` 5★/2 отзыва, `screenshot`, `description`, `softwareVersion 1.3.6` (синхронизирован с extension manifest), `image` для Product → открывают Google rich result.

**E-E-A-T схемы добавлены:** Article на /about (RU+EN), TechArticle на /guides/gpt-image-2 (RU+EN) с `author: PERSON_FOUNDER_REF`, `datePublished`, `dateModified`. AI теперь видят авторство и дату.

**Mobile CWV fix:** PT Root UI `font-display: optional` + сняли preload (был источником CLS 0.129 на RU из-за swap-shift длинных кириллических слов). Unbounded оставили swap+preload — он H1/LCP.

**Hero AI-snippet block** на лендинге: 40-словный definitional абзац под H1, в котором есть entity name, supported models, host sites, цены. Это эталонный текст для AI citation.

**Logo bar disclaimer** для trademark fair-use — AI-системы и юр.лица не должны интерпретировать Higgsfield/Freepik/Canva как official partnerships.

**Robots.txt:** 8 эксплицитных AI-ботов (OAI-SearchBot, ChatGPT-User, CCBot, Bingbot, YandexBot, Meta-ExternalAgent, Amazonbot, Bytespider) + унифицированный Disallow для anthropic-ai / Applebot-Extended / cohere-ai.

**Speakable** на 4 routes (landing × 2 + guide × 2) для Google Assistant / Perplexity voice.

**Sitemap** теперь карты `<lastmod>` через git mtime — 3 различные даты вместо одной (`2026-04-13`, `2026-05-16`, `2026-05-17`).

**llms.txt:** `/en/about` теперь в `## About`, а не в `## Other`. Заголовок усечённого `llms-full.txt` поменян с пугающего «truncated» на explicit «full content (legal pages excluded)».

**Per-route author meta** для /about (RU+EN) и /guides/* — content="Влад Воронежцев" вместо generic "Opten".

## Spot-fix (попутно)

В `src/app/pages/GuidePage.tsx:113-115` обнаружен ещё один `lang === "ru"` гейт у About-link в footer — тот же баг, что в App.tsx, упущенный в первом фиксе 8b64d30. Снят.

## Что НЕ сделано (отдельным шагом)

- **CSP в `vercel.json`** — Paddle risk, нужно тестировать на /pay
- **`/guides` index hub page** — контент-работа
- **Founder photo** на /about — нужен asset `public/assets/about/founder.jpg`
- **Microsoft Clarity, IndexNow file, BWT meta** — внешнее или сделано пользователем (Bing/Google/Yandex Webmaster Tools уже настроены).

## Ожидаемый эффект на GEO score

Базовый: **63/100 (Fair)** на 2026-05-17.

Реалистичная оценка после батча: **75-78/100 (Good)**:
- AI Citability 74 → 82 (definitional paragraph + Article + speakable)
- Brand Authority 18 → 28 (YouTube sameAs)
- Content E-E-A-T 72 → 82 (Article author/date + email + visible dates + disclaimer)
- Technical GEO 86 → 92 (font CLS fix + per-route lastmod + 8 AI bots)
- Schema & Structured Data 76 → 88 (Person fix + aggregateRating + Article + speakable + author)
- Platform Optimization 60 → 70 (cross-cutting улучшения)

Дальнейший рост (≥85) требует **внешних** действий: Wikidata entity, посты на Habr / vc.ru, Reddit seeding, Product Hunt запуск.

## Файлы артефактов

- [PLAN.md](./PLAN.md) — изначальный план
- Источник: [.planning/research/GEO-AUDIT-2026-05-17.md](../../research/GEO-AUDIT-2026-05-17.md)
- Косвенный: [.planning/research/CODEX-SEO-REVIEW-2026-05-17.md](../../research/CODEX-SEO-REVIEW-2026-05-17.md)
