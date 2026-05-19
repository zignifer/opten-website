# Reve Image 1.0 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Reve Image 1.0.
> Источники: venturebeat.com/ai/the-new-best-ai-image-generation-model, higgsfield.ai/blog/The-Most-Realistic-Unlimited-AI-Image-Tool, overchat.ai/ai-hub/reve-image-generator, eweek.com/news/reve-image-ai-image-generator, curiousrefuge.com/blog/reve-ai-image-generator-review

## Идентификация

- **model_id:** reve
- **model_name:** Reve Image 1.0
- **type:** image
- **platform:** Reve AI (preview.reve.art), Higgsfield (higgsfield.ai)
- **best_language:** English — основной задокументированный язык промптов.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Параметры | **12 billion** |
| Разрешение | Нативное **2048×2048**; 4K upscaling (4096×4096) |
| Aspect ratios | 3:2, 16:9, макс 2560px по длинной стороне |
| Режимы | T2I, I2I (style matching), multi-reference (2–3 изображения), sketch-to-image |
| Архитектура | Hybrid Diffusion с relational attention + Typography Engine (50M font samples) |
| Точность текста | **98%** через проприетарный Typography Engine |
| Рейтинг | **#1 на Artificial Analysis Image Arena** (ELO 1167) — выше Midjourney v6.1, Imagen 3, Flux Pro 1.1, Recraft V3 |
| Коммерческие права | Полные на все output |
| Доступность | Higgsfield (unlimited на подписке), preview.reve.art |
| Разработчик | Reve AI, Inc. (Palo Alto) — ex-Google Brain и NVIDIA |

---

## Структура хорошего промпта

**Фотографический стиль промптинга.** Структурированные, конкретные промпты дают лучший результат.

```
[Photographic framing] + [Subject with details] + [Lighting/atmosphere] + [Texture/materials] + [Camera/lens hints]
```

### Принципы

- Начинать с чёткого фотографического кадрирования: «A high-resolution, photorealistic studio portrait, captured with shallow depth of field...»
- Конкретные свет и текстура: «warm side light, foggy dusk atmosphere»
- Фотографический язык: «shift focus to the man», «render as if shot at 1.8 f-stop»
- Модель строит **именно** то, что описано — высокая верность промпту
- Минимальный промпт тоже работает благодаря сильному inference

### Текст в изображениях
Для рендеринга текста — указать явно в промпте. Typography Engine обеспечивает 98% точность.

---

## Ключевые возможности

1. **Исключительная верность промпту** — строит ровно то, что описано
2. **98% точность текста** через Typography Engine (50M font samples)
3. **Гиперреалистичные портреты** — особенно сильны с разнообразными этническими чертами
4. **Celebrity likeness** — генерация узнаваемых лиц
5. **Полные коммерческие права** на все output

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Камера | Studio portrait, shallow DoF, 1.8 f-stop, 85mm, wide-angle, macro |
| Освещение | Warm side light, foggy dusk, golden hour, studio softbox, rim light, hard flash |
| Текстуры | Skin pores, fabric weave, weathered wood, brushed metal, frosted glass |
| Настроение | Cinematic, editorial, intimate, dramatic, serene, melancholic |
| Фотография | High-resolution, photorealistic, shallow depth of field, shift focus, bokeh |

---

## Типичные сценарии использования

### Портретная фотография
- Гиперреалистичные портреты с детализацией кожи
- Celebrity likeness генерация
- Разнообразные этнические представления

### Коммерческая фотография
- Продуктовая съёмка с точным текстом
- Рекламные баннеры с типографикой
- Lifestyle photography

### Multi-reference
- Стилевое совмещение из 2–3 источников
- Sketch-to-image конвертация

### Текстовый контент
- Логотипы и вывески с 98% точностью текста
- Баннеры и постеры

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Конкретные визуальные детали.
2. **Визуальный стиль** — фотореализм, иллюстрация и т.д. Или фотографическое кадрирование.
3. **Описательный язык** — конкретные, структурированные описания.

### Бонусные элементы (улучшают результат)
4. **Освещение** — конкретный тип и направление: «warm side light», «foggy dusk atmosphere».
5. **Текстуры/материалы** — «visible skin pores», «fabric weave», «weathered wood».
6. **Camera/lens** — фотографические термины: «shallow DoF», «85mm», «f/1.8».
7. **Текст** — для рендеринга текста, указать явно.
8. **Фотографическое кадрирование** — «studio portrait», «wide establishing shot».

### Антипаттерны (ухудшают результат)
- **Сложные прозрачные объекты** — полный бокал вина и подобное — модель может не справиться.
- **Конкретные вымышленные персонажи** — video game characters → generic результат. Модель не знает всех franchise.
- **Multi-object compositions** — может неправильно расположить детали. Простые центрированные сцены — сильная сторона.
- **Слишком минимальный промпт** — модель справится, но конкретика даёт лучший результат.

### Контекстная оценка
AI должен понимать:
- Reve — #1 на Artificial Analysis, высокая верность промпту
- Фотографический язык — идеальный подход для этой модели
- Минимальный промпт допустим (сильный inference), но конкретный — лучше
- Typography Engine — 98% точность, текстовые промпты оценивать наличие явного текста
- Celebrity likeness — поддерживается, не штрафовать
- Multi-reference (2–3 images) — поддерживается, промпт описывает как совместить
- Доступна на Higgsfield — unlimited generations на подписке
