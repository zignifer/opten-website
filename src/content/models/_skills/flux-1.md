# FLUX.1 / FLUX.1 Pro / FLUX.1.1 Pro Ultra — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для моделей FLUX.1 (все варианты: schnell, dev, pro, 1.1 pro ultra).
> Источники: https://blog.segmind.com/flux-prompting-guide-image-creation/, https://docs.bfl.ml/guides/prompting_guide_kontext_i2i, https://replicate.com/blog/flux-kontext

## Идентификация

- **model_id:** flux-1
- **model_name:** FLUX.1 Pro / FLUX.1.1 Pro Ultra
- **type:** image
- **platform:** Replicate, Segmind, ComfyUI, fal.ai, BFL API, Together AI и др.
- **best_language:** English — FLUX.1 оптимизирована для английского языка. Двойной энкодер CLIP + T5-XXL лучше всего работает с английским.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Макс. длина промпта | ~2000 токенов (T5-XXL), оптимально 50–200 слов |
| Разрешение | До 1440x1440 (pro), до 2752x2752 (1.1 pro ultra) |
| Варианты моделей | [schnell] — быстрая/4 шага, [dev] — опенсорс/20+ шагов, [pro] — лучшее качество, [1.1 pro] ultra — макс. разрешение |
| Соотношение сторон | Настраивается через параметры платформы |
| Текст в изображениях | FLUX.1 хорошо генерирует текст — один из лучших в классе по рендерингу надписей |
| Особенность | Двойной текстовый энкодер (CLIP + T5-XXL). Понимает длинные связные описания значительно лучше моделей на одном CLIP |

---

## Структура хорошего промпта

Оптимальная структура промпта для FLUX.1 text-to-image:

```
[Субъект] + [Детали внешности/описание] + [Сцена/Окружение] + [Освещение] + [Стиль/Арт-направление] + [Камера/Техника] + [Настроение/Цвет]
```

Пример:
```
A wide-angle view of a snow-capped mountain range at dawn, mist swirling over the icy peaks, with a vibrant orange-pink sky in the background and a lone wolf in the foreground looking into the horizon, cinematic photography, shot on RED camera, dramatic warm light
```

### Ключевой принцип: связное описательное предложение

FLUX.1 великолепно интерпретирует естественный язык благодаря T5-XXL энкодеру. Пиши полными предложениями, описывая сцену как для художника или кинооператора. Не нужны списки ключевых слов через запятую — модель лучше понимает контекст из связного текста.

---

## Техники промптинга FLUX.1

### 1. Естественные описания вместо ключевых слов
**Да:** «A towering mountain peak covered in snow, with jagged edges and a bright blue sky above»
**Нет:** «mountain, snow, sky, blue, epic, detailed»

FLUX.1 обучена на длинных описаниях и лучше реагирует на связный текст.

### 2. Многослойное описание сцены (Layered Description)
Описывай от переднего плана к заднему:
```
In the foreground, a large oak tree with golden autumn leaves. Behind it, a flowing river, and in the background, a mist-covered mountain range.
```
Это даёт модели чёткую пространственную структуру.

### 3. Художественные ссылки и стилизация
Конкретные ссылки на стиль работают лучше абстрактных:
- «In the style of 1980s cyberpunk» — конкретная эпоха
- «Inspired by the surrealism of Salvador Dali» — конкретный художник
- «Impressionist painting with visible brushstrokes» — конкретная техника

### 4. Техническая фото-терминология
FLUX.1 отлично понимает параметры камеры:
- «Shot with a 50mm lens at f/2.8, shallow depth of field, blurred background»
- «Wide-angle 24mm lens, deep focus, everything sharp»
- «Macro photography, extreme close-up, water droplets on a leaf»

### 5. Детальное освещение
Конкретное описание света критично для качества:
- «Soft morning light casting long shadows with a serene atmosphere»
- «Dramatic rim lighting from behind, silhouette effect»
- «Studio three-point lighting, soft key, hair light»

### 6. Текст в изображении
FLUX.1 — одна из лучших моделей для рендеринга текста. Используй кавычки:
- «A neon sign reading "OPEN 24/7" on a dark brick wall»
- «A handwritten note saying "I love you" on vintage paper»

### 7. Негативные указания
В конце промпта можно указать исключения:
- «No text, no watermarks, no blur»
- «Without people, no human figures»

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, HDR, 8K, RAW, ultra-detailed, photorealistic, hyperrealistic |
| Фото-жанр | Portrait, landscape, street photography, editorial, fashion, product shot, food photography |
| Арт-стиль | Oil painting, watercolor, pencil sketch, digital art, concept art, anime, pixel art, vector illustration |
| Эпоха/движение | Art Nouveau, Bauhaus, Pop Art, Impressionism, Surrealism, Cyberpunk, Steampunk, Retro-futurism |
| Цвет/тон | Warm tones, cool palette, monochrome, high contrast, pastel, desaturated, neon, earth tones |
| Освещение | Natural light, golden hour, blue hour, rim light, volumetric light, neon glow, chiaroscuro |
| Камера | Wide-angle, telephoto, macro, fisheye, tilt-shift, shallow DOF, bokeh, long exposure |

---

## Различия между вариантами FLUX.1

| Вариант | Характеристики | Когда использовать |
|---------|---------------|-------------------|
| [schnell] | 4 шага, быстрая, Apache 2.0 лицензия | Прототипирование, тесты, быстрые итерации |
| [dev] | 20+ шагов, опенсорс, хорошее качество | Разработка, эксперименты, некоммерческое использование |
| [pro] | Лучшее качество, API, коммерческая лицензия | Финальная продукция, коммерческие проекты |
| [1.1 pro] ultra | Макс. разрешение до 2752x2752, Raw mode | Крупная печать, детализированные изображения |

---

## Типичные сценарии использования

### Портреты / Персонажи
- Описывай внешность, возраст, одежду, выражение лица
- Указывай тип освещения и фон
- Стиль фотографии: editorial, candid, studio, cinematic

### Пейзажи / Окружение
- Многослойное описание (передний/средний/задний план)
- Время суток и погода
- Атмосфера и настроение

### Типографика / Текст
- Используй кавычки для текста
- Описывай шрифт, размер, расположение
- FLUX.1 — топ по рендерингу текста

### Продуктовая съёмка
- Чёткое описание продукта и материалов
- Студийное освещение, чистый фон
- Акцент на текстурах и деталях

### Концепт-арт
- Подробное описание мира и элементов
- Художественные ссылки
- Драматическое освещение и композиция

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно, с деталями. «A red-haired woman in a vintage dress» вместо «a person».
2. **Сцена/контекст** — где происходит действие. Хотя бы минимальное описание фона или окружения.
3. **Визуальный стиль** — хотя бы базовое указание: фото, иллюстрация, живопись, 3D и т.д.

### Бонусные элементы (улучшают результат)
4. **Освещение** — конкретные источники света (golden hour, studio lighting, rim light, volumetric).
5. **Композиция** — крупность, ракурс, перспектива (close-up, wide shot, bird's eye, Dutch angle).
6. **Настроение/атмосфера** — эмоциональный тон (dramatic, peaceful, ominous, nostalgic).
7. **Цветовая палитра** — цветовая гамма (warm tones, desaturated, neon, earth colors).
8. **Технические детали камеры** — объектив, глубина резкости, приём (85mm lens, f/1.4, bokeh).
9. **Многослойность описания** — передний план → средний → задний — даёт глубину.
10. **Язык** — английский даёт лучшие результаты.

### Антипаттерны (ухудшают результат)
- **Слишком короткий промпт** (<10 слов) — модель додумает слишком много. «A mountain» — почти бесполезно.
- **Prompt weights (SD-синтаксис)** — FLUX.1 НЕ поддерживает синтаксис `(word)++` или `(word:1.5)`. Это Stable Diffusion — здесь не работает. Используй «with emphasis on» или «with a focus on» вместо весов.
- **Хаотичный порядок** — «beach at dawn, the sun, Welcome sign, green, vibrant colors» — бессвязный набор. Нужна логическая последовательность.
- **Перегрузка деталями** — слишком много объектов, стилей, требований в одном промпте. Модель теряет приоритеты.
- **Конфликтующие стили** — «cyberpunk and medieval», «photorealistic watercolor painting» — взаимоисключающие указания.
- **«White background» в [dev]** — в FLUX.1 [dev] фраза «white background» вызывает размытые/нечёткие изображения. Описывай фон конкретнее: «a soft grey studio backdrop».
- **Списки ключевых слов вместо описаний** — «dragon, fire, sky, sunset, mountains, epic» — хуже чем связное предложение.
- **Бессмысленные quality-бустеры** — «masterpiece, best quality, ultra HD, 4K, 8K» подряд — не помогают FLUX.1 (в отличие от SD).
- **Негативные формулировки без позитивной альтернативы** — «no ugly faces, no bad anatomy» — менее эффективно чем описание желаемого качества.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Простой продуктовый шот не требует сложной многослойной композиции
- Абстрактное арт-изображение может не иметь конкретного субъекта
- Промпт с текстом (вывеска, постер) оценивается по чёткости инструкции для текста
- Быстрый концепт или мудборд не требует исчерпывающей детализации
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
