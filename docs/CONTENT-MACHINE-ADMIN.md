# Контент-машина в Opten Admin

## Что это

`/admin?view=content` — защищённый read-only reader производственного контура
контента. Он помогает увидеть не отдельные Markdown-файлы, а связи между
исследованием, форматами, стилем, CTA, проверками качества и метриками.

Верхний переключатель отделяет два уровня:

- `Админка` — операционные действия и живая Telegram-воронка;
- `Контент-машина` — база знаний без редактирования и публикации.

## Источник и синхронизация

Источник истины — приватный репозиторий `zignifer/content`.

После Graphify-postflight в `C:\Projects\content`:

```powershell
py -3.12 scripts\export_content_machine.py --website-root C:\Projects\opten-website
```

Либо со стороны сайта:

```powershell
npm run sync:content-machine -- --source C:\Projects\content\exports\admin\content-machine.json
```

Синхронизация валидирует schema version, read-only контракт, отсутствие
персональных данных и максимальный размер snapshot. Результат записывается в
`api/admin/_contentMachineSnapshot.ts` и проверяется перед каждым production
build.

## Безопасность

- Snapshot не импортируется в клиентский bundle.
- `/api/admin/content-machine` использует тот же website JWT и server-side
  owner allowlist, что остальные `/api/admin/*`.
- Runtime GitHub token не нужен.
- В snapshot не входят сырые research-архивы, транскрипты, пакеты, identity
  assets, email, телефоны, user/chat/payment identifiers и секреты.
- Интерфейс не содержит write, publish или delete действий.

## UX-разделы

1. `Обзор` — карта системы, свежесть и ключевые объёмы.
2. `Пайплайны` — этапы радара, Reels, карточек, длинного видео, Telegram и
   упаковки готового ролика.
3. `Форматы` — источник стиля, навигация, CTA и финальный gate.
4. `Источники` — блогеры/каналы, skills и канонические документы.
5. `Метрики` — исторические social snapshots, Telegram funnel и контентные
   checkpoints с явной датой.
6. `Связи` — bounded Graphify summary и наиболее связанные узлы.
