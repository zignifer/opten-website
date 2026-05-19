# FLUX (общий) — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для любой версии FLUX.
> Источники: https://blog.segmind.com/flux-prompting-guide-image-creation/, https://docs.bfl.ml/guides/prompting_guide_kontext_i2i, https://replicate.com/blog/flux-kontext

## Идентификация

- **model_id:** flux
- **model_name:** FLUX (General)
- **type:** image
- **platform:** Replicate, Segmind, ComfyUI, fal.ai, BFL API и др.
- **best_language:** English — FLUX оптимизирована для английского языка. Промпты на других языках дают значительно худшие результаты.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Макс. длина промпта | ~2000 токенов (T5-XXL энкодер), оптимально 50–200 слов |
| Разрешение | До 2048x2048 (зависит от версии и платформы) |
| Форматы | FLUX.1 [schnell], FLUX.1 [dev], FLUX.1 [pro], FLUX.1.1 [pro] Ultra, FLUX.2 [pro/max/klein], FLUX Kontext |
| Соотношение сторон | Задаётся параметрами платформы (1:1, 16:9, 9:16, 4:3 и др.) |
| Особенность | Использует двойной текстовый энкодер (CLIP + T5-XXL) — понимает длинные связные описания лучше большинства моделей |

---

## Структура хорошего промпта

Оптимальная структура промпта для FLUX:

```
[Субъект] + [Детали/Внешность] + [Сцена/Фон] + [Освещение] + [Стиль/Настроение] + [Техника/Камера] + [Цветовая палитра]
```

Пример:
```
Close-up portrait of a middle-aged man with a thick dark beard, wearing a leather jacket, standing in front of an urban graffiti wall, soft sunlight casting shadows on his face, documentary photography, shot on 85mm lens, warm muted tones
```

### Ключевой принцип: естественный описательный язык

FLUX великолепно понимает связные описания на естественном языке. Вместо списков ключевых слов через запятую — пиши как для кинооператора. Чем конкретнее описание, тем точнее результат.

---

## Основные элементы промпта

### 1. Субъект (Subject)
Чётко определи главный объект изображения. «A lone astronaut standing on Mars at sunset» намного лучше, чем просто «astronaut».

### 2. Стиль и художественные ссылки (Style & References)
Указывай конкретный арт-стиль или жанр: «inspired by retro sci-fi art», «in the style of 1980s cyberpunk», «surrealism of Salvador Dali».

### 3. Композиция и расположение (Composition)
Описывай многослойно — передний план, средний план, фон: «In the foreground, a large oak tree with golden autumn leaves. Behind it, a flowing river, and in the background, a mist-covered mountain range.»

### 4. Освещение и цвет (Lighting & Color)
Конкретное освещение критично: «golden hour light, warm tones», «soft morning light casting long shadows», «neon glow with cyberpunk palette».

### 5. Настроение и атмосфера (Mood)
Эмоциональный тон направляет генерацию: «serene and contemplative», «dramatic and intense», «nostalgic warmth».

### 6. Технические параметры камеры
FLUX хорошо понимает фото-терминологию: «shot with a 50mm lens at f/2.8, shallow depth of field, blurred background», «wide-angle view», «macro shot».

### 7. Негативные указания
Можно указать что исключить: «No text, no watermarks, no blur». Помогает избежать нежелательных артефактов.

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, HDR, 8K, RAW, ultra-detailed, photorealistic |
| Жанр | Documentary photography, editorial, fashion shoot, concept art, illustration |
| Цвет/тон | Warm, cold, high contrast, desaturated, neon, golden hour, moody |
| Арт-стиль | Realistic, surreal, minimal, cyberpunk, noir, anime, watercolor, oil painting |
| Освещение | Natural light, rim light, backlight, volumetric, neon glow, silhouette, studio lighting |
| Камера | Wide-angle, telephoto, macro, fisheye, tilt-shift, shallow DOF, bokeh |

---

## Типичные сценарии использования

### Портреты
- Описывай внешность, одежду, выражение лица
- Указывай тип освещения и фон
- Упоминай стиль фотографии (editorial, candid, studio)

### Пейзажи / Окружение
- Многослойное описание (передний/средний/задний план)
- Время суток и погодные условия
- Атмосфера и настроение

### Продуктовая / Коммерческая съёмка
- Чёткое описание продукта и материалов
- Студийное освещение, чистый фон
- Акцент на текстурах и деталях

### Концепт-арт / Фэнтези
- Подробное описание мира и элементов
- Художественные ссылки и стиль
- Драматическое освещение и композиция

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно, не абстрактно. «A red-haired woman in a white dress» вместо «a person».
2. **Сцена/контекст** — где происходит действие, что вокруг. Пустой промпт без контекста заставит модель додумывать.
3. **Визуальный стиль** — хотя бы базовое указание на стиль: фото, иллюстрация, живопись, 3D-рендер и т.д.

### Бонусные элементы (улучшают результат)
4. **Освещение** — конкретные источники света и их характер (golden hour, studio lighting, rim light).
5. **Композиция** — крупность, расположение, перспектива (close-up, wide shot, bird's eye view).
6. **Настроение/атмосфера** — эмоциональный тон (dramatic, serene, melancholic).
7. **Цветовая палитра** — указание на цветовую гамму (warm tones, muted colors, vibrant).
8. **Технические детали камеры** — тип объектива, глубина резкости, приём (85mm, shallow DOF, bokeh).
9. **Язык** — английский даёт лучшие результаты.

### Антипаттерны (ухудшают результат)
- **Слишком короткий промпт** (<10 слов) — модель будет додумывать слишком много. «Mountain landscape» — плохо.
- **Список ключевых слов без связи** — «dragon, fire, sky, sunset, mountains, epic» — бессвязный список хуже связного предложения.
- **Prompt weights (SD-синтаксис)** — FLUX НЕ поддерживает синтаксис (word)++ или (word:1.5). Это от Stable Diffusion и вызовет ошибки или непредсказуемое поведение.
- **Конфликтующие стили** — «cyberpunk and medieval» одновременно сбивает модель.
- **Перегрузка деталями** — слишком много элементов одновременно (>200 слов) — модель теряет приоритеты.
- **«White background» в dev-версии** — вызывает размытые изображения в FLUX.1 [dev].
- **Хаотичный порядок** — описание элементов вразнобой без логической последовательности снижает качество.
- **Ненужные ключевые слова без контекста** — слова ради слов («beautiful, amazing, best quality») не помогают FLUX.
- **Негативные формулировки без альтернативы** — «no ugly, no bad» менее эффективно чем позитивное описание желаемого.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Простой продуктовый шот на белом фоне не требует сложной многослойной композиции
- Абстрактное арт-изображение может не иметь конкретного субъекта
- Быстрый скетч или концепт не требует перечисления всех элементов
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
