---
tags:
  - gsd
  - phase
  - plan
kind: phase-plan
milestone: v2.0
phase: 2
phase_name: Models Content Generation + Publication
status: blocked-by-phase-1
defined: 2026-05-19
---

# Phase 2 — Models Content: PLAN

6 атомарных плана (MODELS-B-1..6), сгруппированных в 3 wave-ов.

## Wave 6 — Content generation via parallel agents (1 plan)

- [ ] **2-01 (MODELS-B-1):** Spawn 7 параллельных general-purpose Claude Code агентов через Agent tool в одном сообщении (max parallelism). Каждый получает свой блок 8-9 моделей (точный список из `_registry.ts` сортируется alphabetically и режется в 2-CONTEXT.md перед запуском). Каждый агент пишет 8-9 `<slug>.ts` файлов через Write tool по эталону `gpt-image-2.ts`. Main session ждёт завершения. Acceptance: 61 новый `.ts` файл в `src/content/models/` (62 минус эталонный).

## Wave 7 — Verification (1 plan)

- [ ] **2-02 (MODELS-B-2):** Main-session-верификация. Программный чекер на 5 случайных + 2 фиксированных (`midjourney-7`, `kling-3`). Проверка: intro 40-60 слов, faq≥6, examples=3, mistakes=5, RU/EN parity, EN без кириллицы, title/description длина. Если ≥2 систематические ошибки — корректировка промпта + регенерация проблемных через нового агента. Acceptance: 7/7 файлов проходят все 7 чеков (или после регенерации — проходят).

## Wave 8 — Build & publication (4 plans)

- [ ] **2-03 (MODELS-B-3a):** Снять фильтр `if (m.content)` в `seo-routes.ts` цикле — теперь все 62 модели в routes. Acceptance: `routes.length` = 18 baseline + 124 модельных + 2 хаба = 144.
- [ ] **2-04 (MODELS-B-3b):** Поднять floor в `scripts/sitemap.mjs` и `scripts/llms.mjs` с 22 до 144. Acceptance: `npm run build` → 126 HTML в `dist/models/` + `dist/en/models/`. `dist/sitemap.xml` ≥144 URL.
- [ ] **2-05 (MODELS-B-4):** Atomic batch commits. 7 коммитов (Wave 6 агентские батчи + Wave 7 верификация-фиксы + Wave 8 builds). Push в `main`. Acceptance: Vercel автодеплой зелёный, prod URL `/models/<slug>` отдаёт 200 на 5 случайных.
- [ ] **2-06 (MODELS-B-5):** IndexNow ping. `node scripts/indexnow.mjs` отправляет все 126 URL в Bing+Yandex IndexNow. Acceptance: `api.indexnow.org` returns 200/202. Manual check в Bing Webmaster Tools через 24-72h.

## Post-deploy monitoring (Phase 2 verification window)

- [ ] **2-07 (MODELS-B-6):** Через 7-14 дней — проверка GSC «Coverage» отчёта по `site:opten.space/models/`. Acceptance: ≥60% URL в «Indexed». Если меньше — diagnostic анализ (тонкий контент, дубликаты, robots.txt блокирующий, и т.п.) и план корректировок.

## Risks & mitigations

| # | Risk | Митигация в Phase 2 |
|---|---|---|
| R1 | `llms-full.txt` > 50KB cap при 126 routes | Замерить на 2-04 build; если фейл — поднять cap до 200KB или отложить sharding в backlog. Не блокирующее. |
| R4 | Drift между эталонным `gpt-image-2.ts` и AI-сгенерированными | 2-02 верификация сравнивает 1 случайный AI-output side-by-side с эталоном на качественные критерии |
| R6 | Monolith commit на 62 файла нечитаем | D-12 — батчи по 8-9 файлов = 7 коммитов, build green после каждого |

## Open questions для Wave 6

Решаются на старте Wave 6, при первом контакте с агентами:

1. **Передавать MD-скиллы целиком агенту или extracted-факты?** Целиком — даёт контекст для качественных examples и mistakes. Решение по умолчанию: целиком.
2. **Какие 2 fixed-модели для верификации?** Default: `midjourney-7` (сложная image, много версий) и `kling-3` (сложная video). Можно поменять при обнаружении более «pathological» моделей.
3. **Что если агент не уложился в budget по времени или контексту?** Резервный план: split (8-9 → 4-5 на агента, нужно 14 агентов вместо 7). Решение — на месте по факту первого прогона.

## Commit order summary

```
Wave 6 (Content):       7 batch commits (по 8-9 файлов каждый)
Wave 7 (Verify):        fix commits + regeneration if needed
Wave 8 (Build+Deploy):  2-03 → 2-04 → 2-05 → 2-06
Post-deploy:            2-07 (7-14 days later)
```
