---
tags:
  - gsd
  - phase
  - summary
kind: phase-summary
milestone: v2.0
phase: 1
phase_name: Models Infrastructure
status: complete
shipped: 2026-05-19
---

# Phase 1 — Models Infrastructure: SUMMARY

## Outcome

Заложена вся инфраструктура для программатики 62 моделных страниц. Build зелёный, 4 prerendered HTML существуют (`/models` + `/en/models` хаб + `/models/gpt-image-2` + `/en/models/gpt-image-2` эталонная страница). Schema graph (TechArticle + SoftwareApplication ×2 + FAQPage + BreadcrumbList + WebPage+Speakable) валиден. verify-faq-mainentity зелёный.

Phase 2 разблокирована — осталось сгенерить 61 контент-файл через параллельных агентов.

## What shipped

| Domain | Artifacts |
|---|---|
| Data layer | `src/content/models/types.ts`, `_registry.ts` (62 ModelMeta, 30 image + 32 video), `index.ts` (barrel с `import.meta.glob`), `slugs.ts` (light export для paths.ts), `_skills/*.md` (62 синканных скилла под git) |
| Scripts | `scripts/sync-skills.mjs` (sync из promptscore-proxy), `scripts/build-models-registry.mjs` (парсер шапок MD) |
| Components | `ModelPage.tsx`, `ModelsHubPage.tsx`, `ModelQuickFacts.tsx`, `InlineOptenCallout.tsx`, `ModelInstallCta.tsx`, `RelatedModels.tsx` |
| Reference content | `src/content/models/gpt-image-2.ts` (вручную, RU + EN — образец для Phase 2 агентов) |
| SEO routing | `scripts/seo-routes.ts` — новый export `softwareApplicationModelBlock`, helpers `buildModelRoute`/`buildModelsHubRoute`, фильтрованный спред в routes |
| Routes | `main.tsx` + `entry-server.tsx` — +4 Route (RU + EN × hub + page) |
| Navigation | `SiteHeader` (пункт «Модели»), `SiteFooter` (ссылка), `App.tsx` (кнопка «Все 62+ модели →») |
| Build pipeline | `sitemap.mjs` (floor 18→22, PATH_TO_SOURCE как функция), `llms.mjs` (floor + SECTIONS Models) |
| i18n | 51 новый ключ в `ru.json` + `en.json` |

## Commits

| Commit | Wave |
|---|---|
| adbc72c | chore(planning): open v2.0 milestone |
| d9a2aa3 | Wave 1 — types, sync, registry, barrel |
| 92c2d49 | Wave 2 — React components + i18n |
| 52aa4bb | Wave 3 — reference content gpt-image-2 |
| c300766 | Wave 4 — SEO route plumbing |
| fcd245a | Wave 5 — routes + navigation |
| c699b9a | docs: close Phase 1 |

## Build results

```
✓ 22 routes prerendered (18 baseline + 4 new)
✓ sitemap.xml → 22 routes
✓ llms.txt → 22 routes with new Models section
✓ verify-faq-mainentity: 34 questions, all parity holds
✓ indexnow → pinged 22 URLs
```

## Decisions captured

| Decision | Rationale |
|---|---|
| Реально 62 модели, не 63 | Plan Влада указал 63, фактически в promptscore-proxy/skills/ 64 файла - 2 fallback = 62 |
| `_skills/` под git | Vercel-build не имеет доступа к локальному proxy-репо |
| `MODEL_SLUGS_WITH_CONTENT` отдельный light-экспорт | Предотвращает циркулярный импорт paths.ts ↔ content/models |
| Phase 1 фильтр `if (m.content)` | В Phase 1 в routes попадает только модель с реальным контентом (gpt-image-2). Phase 2 снимет фильтр |
| Floor counts инкрементально | sitemap/llms floor 18→22 в Phase 1, 22→144 в Phase 2 |
| Без email-захвата / PDF / skill-отдачи | План Влада §13 — три CTA — все прямые ссылки на Chrome Web Store |
| Без уникальных cover на MVP | Используем `DEFAULT_OG_IMAGE`. Уникальные — Stage 2 (v2.1) |

## Learnings

- Vite import.meta.glob работает в SSR build, безопасно использовать в content barrel
- Существующий `<FaqBlock>` гарантирует FAQ-mainentity parity без дополнительной работы — агенты в Phase 2 пишут только данные `faq[]`, не верстку
- IndexNow вызывается даже при локальном build — это OK, Bing/Yandex дедуплицируют

## Next

Phase 2 — Models Content Generation + Publication. Spawn 7 параллельных Claude Code агентов, каждый генерирует 8-9 моделей по эталону `gpt-image-2.ts`. Main session верифицирует и коммитит атомарными батчами.
