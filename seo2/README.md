---
tags: [opten, blog, seo2, manual-automation]
kind: index
---

# seo2 — ручная blog automation

`seo2/` — новая самодостаточная папка для ручного создания блог-постов
opten.space. Она заменяет старую ежедневную схему `seo/` + scheduled Codex +
local publisher.

## Чем отличается от старой automation

- Нет cron/scheduled task.
- Нет `preflight.ps1`, `mark-ready`, `run-publisher`, workspace-копий.
- Один запуск Codex в основном checkout `opten-website` создает один пост.
- После успешного build/SEO-проверок Codex сам делает scoped `git add`,
  `git commit`, `git push`.

## Файлы

| Путь | Роль |
|------|------|
| `blog-post-instruction.md` | Главная инструкция для Codex: как взять следующий brief и создать один пост. |
| `briefs/YYYY-Www/_batch.md` | Очередь тем недели со статусами `pending` / `deferred` / `published`. |
| `briefs/YYYY-Www/NN-slug.md` | Отдельные article briefs с RU/EN keywords. |
| `rules/blog-post-seo-rules.md` | SEO/GEO правила поста. |
| `rules/humanizer-ru.md` | Humanizer-pass для русского текста. |
| `rules/humanizer-en.md` | Humanizer-pass для английского текста. |
| `rules/image-style.md` | Сжатые правила генерации изображений. |
| `Reference/` | Визуальные референсы для картинок статьи. |

## Как запускать вручную

Открой Codex в `opten-website` и дай задачу:

```text
Используй seo2/blog-post-instruction.md. Создай следующий блог-пост из seo2/briefs.
```

После завершения Codex должен показать commit hash, pushed branch и список
измененных файлов. Если build не прошел, Codex не должен коммитить и пушить.

```bash
git status
```

## Источник тем

Темы и ключи приходят из `opten-seo` weekly batch, но во время написания поста
Codex не должен идти в `opten-seo`. Если нужен новый batch, его готовят отдельно
в `opten-seo`, затем копируют сюда.

## Правило очереди

Codex должен смотреть все папки `seo2/briefs/YYYY-Www/` от старой недели к
новой. Если в старой неделе остались `pending` или `deferred` темы, новая
неделя не начинается.

Статусы:

- `pending` — обычная тема в очереди.
- `deferred` — тема временно отложена, но не пропущена. Она добирается после
  остальных `pending` тем этой же недели и до перехода к новой неделе.
- `published` — пост уже опубликован.

После успешной публикации Codex меняет статус выбранной темы в `_batch.md` на
`published` и включает это изменение в коммит поста.
