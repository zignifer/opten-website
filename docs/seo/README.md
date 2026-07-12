---
tags: [seo, geo, moc]
---

# SEO / GEO documentation

Этот раздел хранит единую рабочую стратегию и исходные аудиты opten.space.

## Использовать в работе

- [[SEO-GROWTH-PLAN]] — **канонический план**: решения, приоритеты,
  implementation waves, guardrails, критерии приёмки и метрики.
- [[../CONTENT-AUTHORING]] — правила добавления и изменения публичного
  контента, RU/EN, schema, изображений и route registration.
- [[../SEARCH-CONSOLE]] — локальный доступ к Google Search Console.
- [[../YANDEX-WEBMASTER]] — локальный доступ к Яндекс.Вебмастеру.

## Стартовый ресёрч

Все исходные аудиты находятся в [[research/README|research/]]. Они сохранены
как доказательная и историческая база, но не являются независимыми backlog.

При конфликте используется следующий порядок:

1. `AGENTS.md` и `docs/INTEGRATION-CONTRACT.md`;
2. `docs/seo/SEO-GROWTH-PLAN.md`;
3. профильные playbooks/specs;
4. стартовый ресёрч.

## Как обновлять план

1. Сначала обновить фактический baseline из GSC/Яндекс/Bing.
2. Изменить `last_reviewed` в `SEO-GROWTH-PLAN.md`.
3. Обновить статус задач и добавить дату deploy/measurement.
4. Новые идеи сначала помещать в research или scoped spec; переносить в
   canonical plan только после проверки product constraints и evidence.
5. Не удалять исторические аудиты: они объясняют происхождение решений и
   помогают сравнивать состояние сайта во времени.

