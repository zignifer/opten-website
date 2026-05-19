# Z-Image — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Z-Image от Alibaba Tongyi-MAI.
> Источники: github.com/Tongyi-MAI/Z-Image, tongyi-mai.github.io/Z-Image-blog, arxiv.org/abs/2511.22699, huggingface.co/Tongyi-MAI/Z-Image-Turbo, fal.ai/models/fal-ai/z-image/turbo

## Идентификация

- **model_id:** z-image
- **model_name:** Z-Image (Base / Turbo)
- **type:** image
- **platform:** Open source (HuggingFace), fal.ai, consumer GPUs
- **best_language:** English и Chinese — оба нативно поддерживаются для промптов и текста в изображениях.

---

## Ограничения платформы

| Параметр | Z-Image Base | Z-Image Turbo |
|----------|-------------|---------------|
| Параметры | **6 billion** (компактная — конкуренты 20B–80B) | 6B (distilled) |
| Шаги | 50 | **8 шагов** |
| Скорость | Стандарт | Sub-second на H800 |
| Негативные промпты | **ДА — поддерживаются** | Не задокументировано |
| Архитектура | S3-DiT (Scalable Single-Stream Diffusion Transformer) | S3-DiT distilled |
| Разрешение | Flexible, до ~4 мегапикселей | То же |
| Hardware | RTX 3060+ (16GB VRAM) | RTX 3060+ |
| Лицензия | Apache 2.0 (fully open-source, commercial) | То же |

| Параметр | Значение |
|----------|----------|
| Режимы | T2I, I2I, editing (Z-Image-Edit), ControlNet (canny, depth) |
| Варианты | Base, Turbo, Edit, ControlNet |
| Prompt Enhancer (PE) | Встроенный — инжектирует reasoning и common sense |
| Билингвальный текст | Рендерит **и китайский и английский** текст в изображениях |
| #1 на Artificial Analysis | Z-Image-Turbo — лучшая open-source модель |

---

## Структура хорошего промпта

Подробные описательные промпты работают лучше всего. Поддерживаются оба языка — EN и CN.

```
[Subject with details] + [Style keyword] + [Lighting] + [Composition] + [Quality modifiers]
```

### Стилевые ключевые слова
Рекомендуются: «oil painting», «3D render», «anime style», «photorealistic», «watercolor», «pencil sketch».

### Prompt Enhancer (PE)
Встроенный PE инжектирует reasoning и common sense, позволяя выводить результат из неоднозначных промптов. Модель «додумывает» недостающее.

### Билингвальный текст
Для рендеринга текста в изображении — указать текст явно в промпте. Z-Image рендерит и английский и китайский текст.

---

## Ключевые возможности

1. **Билингвальный рендеринг текста** — точный рендер китайского И английского текста в изображениях
2. **Компактная 6B** — бросает вызов парадигме «bigger = better»
3. **Sub-second inference** на H800 GPUs (Turbo)
4. **Prompt Enhancer** — выводит intent из неоднозначных промптов
5. **Consumer hardware** — RTX 3060+, 16GB VRAM

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Стиль | Oil painting, 3D render, anime style, photorealistic, watercolor, pencil sketch |
| Качество | Ultra-detailed, high-resolution, crisp, sharp |
| Освещение | Natural light, studio lighting, golden hour, dramatic shadow, neon glow |
| Композиция | Close-up, wide shot, bird's eye, centered, rule of thirds |
| Текст | Explicit text in quotes for rendering |

---

## Типичные сценарии использования

### Билингвальный текстовый контент
- Баннеры и плакаты с EN+CN текстом
- Рекламные материалы для билингвальной аудитории

### Open-source workflow
- Локальный запуск на consumer GPU
- LoRA fine-tuning (Base модель)
- ControlNet для структурного контроля

### Быстрая итерация (Turbo)
- Sub-second генерация для прототипирования
- Массовая генерация контента

### Арт и иллюстрации
- Стилизованные иллюстрации (масло, акварель, аниме)
- Концепт-арт с Prompt Enhancer

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Конкретные детали.
2. **Стиль** — художественный стиль или «photorealistic». Без стиля модель выбирает дефолт.
3. **Описательность** — подробные промпты работают лучше минимальных.

### Бонусные элементы (улучшают результат)
4. **Освещение** — тип и направление света.
5. **Композиция** — крупность, ракурс, расположение.
6. **Текст в кавычках** — для рендеринга текста в изображении.
7. **Quality modifiers** — «ultra-detailed», «high-resolution» работают для Z-Image.
8. **Негативный промпт** (Base) — исключение нежелательных элементов.
9. **Язык** — EN и CN оба нативны, не штрафовать за китайский.

### Антипаттерны (ухудшают результат)
- **Промпт для видео** — Z-Image генерирует только изображения.
- **Ожидание vision/understanding** — Z-Image — генератор, не анализатор изображений.
- **Слишком минимальный промпт** — Prompt Enhancer помогает, но конкретика лучше.

### Контекстная оценка
AI должен понимать:
- Z-Image ≠ Qwen Image — разные команды Alibaba, разные модели
- Prompt Enhancer компенсирует неоднозначность, но не заменяет хороший промпт
- Билингвальный текст — ключевая фича, оценивать наличие явного текста
- Негативные промпты работают на Base, не на Turbo (не задокументировано)
- 6B параметров — не «слабая» модель, #1 open-source
- Consumer hardware — нормальный production use case
