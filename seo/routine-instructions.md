# Daily Opten blog post — Claude Code Local routine

Эталонная копия инструкций для routine. Вставь блок «INSTRUCTIONS» ниже в поле
Instructions при создании Local routine.

**Настройки routine (вне Instructions):**
- Select folder: `C:\Projects\opten-website`
- Worktree: **ON**
- Bypass permissions: **ON**
- Schedule: Daily, время вроде `10:07` (не ровно :00)
- Model: Sonnet достаточно (Opus — максимум качества, дороже)

Всё, что нужно routine, лежит внутри этого репо в `seo/` — внешних зависимостей
от путей opten-seo нет. FAL-ключ читается из `C:\Projects\opten-website\.env.local`
(gitignored; в worktree его нет, хелпер берёт по абсолютному пути из основного
checkout).

---

## INSTRUCTIONS

Ты — ежедневная автоматизация блога opten.space. За запуск делаешь ОДИН пост и
публикуешь его прямо в `origin/main`. Без веток, без PR. Не спрашивай подтверждений.

ОКРУЖЕНИЕ
- Ты в изолированном git worktree репозитория opten-website (Worktree ON). Твой
  cwd = этот worktree. Основной checkout `C:\Projects\opten-website` не трогай.
- Сеть есть: git push и curl работают.
- Все справочные файлы внутри репо: бриф `seo/blog-automation.md`, FAL-хелпер
  `seo/fal-image.mjs`.

ШАГИ

1. Свежий main:
   git fetch origin main
   git reset --hard origin/main

2. Выбор темы. Прочитай `seo/blog-automation.md`. Кандидаты — §7. Использованные
   slug'и — `src/content/blog/index.ts`. Возьми первый slug из §7, которого ещё
   НЕТ в index.ts. Если все §7 опубликованы — заверши статусом no-topics.

3. Установи зависимости заранее (нужны для сборки и для ресайза картинок):
   npm ci

4. Контент (бриф `seo/blog-automation.md` §2–§4, образец `src/content/blog/gpt-image-2.ts`):
   - Двуязычный RU+EN, не машинный перевод.
   - intro answer-block 40–60 слов; FAQ 3–5; steps 4–6 ИЛИ sections 3–6.
   - Категории/теги только из enum BlogCategory/BlogTag (`src/content/blog/types.ts`).
   - Минимум один named практический кейс: модель + первая ошибка + точное исправление.
   - Модели сверяй с `src/content/models/slugs.ts`, `_registry.ts`, `_summaries.ts`.
   - Варьируй структуру steps. Файл поста: `src/content/blog/<slug>.ts`.

5. Картинки через FAL (GPT Image 2 High Quality), 1600×900:
   node seo/fal-image.mjs --prompt "<английский промпт кадра>" --out "<путь .jpg>"
   - public/blog/<slug>/cover.jpg — обложка БЕЗ текста.
   - public/blog/<slug>/ru/<name>.jpg — 4–5 шт, текст по-русски.
   - public/blog/<slug>/en/<name>.jpg — 4–5 шт, текст по-английски.
   Скрины — про тему статьи, БЕЗ Opten / score / улучшения промпта / sales-UI.
   Стиль: тёмный SaaS, #9CFB51 / #011417 / #FFFFFF, крупный короткий текст.
   Промпты на английском, видимый текст в кавычках, объяви назначение кадра (бриф §6).

6. Интеграции (иначе пост не появится):
   - src/content/blog/index.ts — импорт + строка в blogPostsBySlug.
   - scripts/seo-routes.ts — 2 роута + добавь в itemListBlock хабов /blog И /en/blog.
   - src/i18n/paths.ts — STATIC_EN_SIBLINGS.
   - scripts/sitemap.mjs + scripts/llms.mjs — обе локали.

7. Сборка и проверка:
   npm run build
   Проверь prerendered RU/EN HTML: lang, canonical, reciprocal hreflang,
   BlogPosting/HowTo/FAQ schema, ссылки на картинки. Все jpg ровно 1600×900.
   Build упал — НЕ пушь, заверши статусом failed с логом.

8. Публикация прямо в main:
   git add src/content/blog/<slug>.ts src/content/blog/index.ts
   git add scripts/seo-routes.ts scripts/sitemap.mjs scripts/llms.mjs src/i18n/paths.ts
   git add public/blog/<slug>/
   (НЕ git add -A и НЕ git add .; seo/ не коммить)
   git commit -m "blog: <slug>"
   git push origin HEAD:main
   non-fast-forward → git fetch origin main && git rebase origin/main && git push origin HEAD:main

9. Проверка живого URL (Vercel ~2–3 мин):
   curl -sI https://opten.space/blog/<slug>      -> ждём 200
   curl -sI https://opten.space/en/blog/<slug>   -> ждём 200
   Оба 200 -> published. 404 спустя ~4 мин -> blocked + ссылка на Vercel deploy.

ПРАВИЛА
- Один пост за запуск. Не спрашивай подтверждений.
- Никаких веток/PR. Пуш прямо в main.
- Не трогай основной checkout C:\Projects\opten-website.
- Не коммить node_modules, .env*, dist, seo/.
- Ключевой шаг упал (build/push) — заверши явным failed/blocked с причиной.
