---
tags: [opten, blog, seo2, manual-workflow]
kind: index
---

# SEO2 — единая ручная система

`seo2/` содержит один контур тем и действующие правила производства статей.
Отдельных недельных batch-брифов, cron, publisher, workspace-копий и внешнего
SEO-репозитория в рабочем цикле больше нет.

## Источники истины

| Путь | Роль |
|---|---|
| `topic-registry.json` | Единая пополняемая очередь и история тем. |
| `TOPIC-PIPELINE.md` | Ручной сбор Suggest, Wordstat, Bing и GSC-сигналов. |
| `blog-post-instruction.md` | Создание и публикация ровно одной статьи. |
| `rules/blog-post-seo-rules.md` | SEO/GEO требования к статье. |
| `rules/humanizer-ru.md`, `humanizer-en.md` | Редакторский проход RU/EN. |
| `rules/image-style.md` | Действующие правила изображений. |
| `Reference/` | Утверждённые визуальные референсы. |
| `visual-plans/<slug>.md` | Production sheet конкретной статьи, не новый brief. |

## Команды

```powershell
npm run start:seo
npm run verify:seo-topics
npm run seo:keywords -- --dry-run
```

`start:seo` выбирает первую `queued` тему, затем `deferred`. Если очередь
закончилась, команда возвращает `start-seo: research-needed`: агент вручную
следует `TOPIC-PIPELINE.md`, дополняет тот же реестр и повторяет выбор.

Пользовательская команда для одной публикации остаётся прежней:

```text
напиши SEO-статью
```

После успешного build и SEO-проверок агент меняет статус записи на
`published`, указывает `/blog/<slug>` и включает реестр в тот же scoped commit.

## Visual quality bar

Внутристатейные изображения остаются mini-explainers, а не title cards.
Используются текущие `Reference/`, единая art direction статьи, четыре RU/EN
пары и существующая проверка `verify:seo2-blog`. Перенос keyword pipeline не
изменяет эти правила.
