---
tags:
  - gsd
  - phase
  - verification
kind: phase-verification
milestone: v2.0
phase: 1
phase_name: Models Infrastructure
status: passed
verified: 2026-05-19
---

# Phase 1 — Models Infrastructure: VERIFICATION

## Acceptance criteria check

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | `npm run build` зелёный | ✅ | Build completed, 22 routes prerendered, sitemap + llms emitted, indexnow pinged |
| 2 | 4 новых HTML существуют | ✅ | `dist/models/index.html`, `dist/en/models/index.html`, `dist/models/gpt-image-2/index.html`, `dist/en/models/gpt-image-2/index.html` |
| 3 | sitemap.xml ≥22 URL | ✅ | `grep -c "<url>" dist/sitemap.xml` → 22 |
| 4 | llms.txt содержит секцию Models с 4 entry | ✅ | См. `dist/llms.txt` — `## Models` блок с 4 ссылками (hub RU/EN + gpt-image-2 RU/EN) |
| 5 | Rich Results: schema-blocks emitted | ✅ | grep `'"@type":` показывает TechArticle, SoftwareApplication, FAQPage, BreadcrumbList, WebPage, SpeakableSpecification, WebSite, Organization, Offer, ContactPoint, Question, Answer, ListItem |
| 6 | verify-faq-mainentity зелёный | ✅ | "6 routes checked, 34 questions, all visible↔schema parity holds" (включая модельную страницу) |
| 7 | hreflang триплет (ru/en/x-default) | ✅ | dist/models/gpt-image-2/index.html содержит все три `<link rel="alternate" hreflang="...">` |
| 8 | html lang baked per-route | ✅ | RU → `<html lang="ru">`, EN → `<html lang="en">` |

## Wave commits

| Wave | Commit | What |
|---|---|---|
| Planning | adbc72c | chore(planning): open v2.0 milestone |
| 1 | d9a2aa3 | feat(models): Wave 1 — TS types, skill sync, registry parser, barrel |
| 2 | 92c2d49 | feat(models): Wave 2 — React components + i18n keys |
| 3 | 52aa4bb | feat(models): Wave 3 — reference content for gpt-image-2 |
| 4 | c300766 | feat(models): Wave 4 — SEO route plumbing (hubs + per-model routes) |
| 5 | fcd245a | feat(models): Wave 5 — wire model routes + navigation |

## What changed

- 62 model skill MDs committed to git (`src/content/models/_skills/`)
- 62 ModelMeta entries in `_registry.ts` (30 image + 32 video)
- 6 new React components for model pages
- 1 manually written reference content file (gpt-image-2, RU + EN)
- 4 new prerendered routes (2 hubs + 2 model page locales)
- Navigation integration: header hamburger + footer + landing CTA

## Remaining manual checks (post-deploy, не блокируют Phase 1 закрытие)

- [ ] Rich Results Test на https://search.google.com/test/rich-results
      after deploy — verify SoftwareApplication + TechArticle + FAQPage validate
- [ ] Visual smoke в браузере на prod URL `/models/gpt-image-2` после Vercel автодеплоя
- [ ] LangSwitcher `/models` ↔ `/en/models` работает (smoke на dev server при разработке)

## Ready for Phase 2

Phase 1 acceptance complete. Phase 2 (Models Content Generation + Publication) разблокирован — следующий шаг spawn 7 параллельных Claude Code агентов для генерации оставшихся 61 модели (62 total - 1 reference уже есть).
