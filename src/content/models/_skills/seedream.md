# Seedream — Skill для PromptScore (общий fallback)

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для моделей семейства Seedream (ByteDance), когда конкретная версия не определена.
> Применяется ко всем версиям: Seedream 4.0, 4.5, 5 Lite и будущим.

## Идентификация

- **model_id:** seedream
- **model_name:** Seedream (общий)
- **type:** image
- **platform:** ByteDance (доступен через fal.ai, syntx.ai, YouMind, flux-ai.io и другие платформы)
- **best_language:** English. Все версии Seedream оптимизированы для английских промптов.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Тип генерации | Text-to-Image (все версии), Image-to-Image (4.5+), Multi-Image Blending (4.5+) |
| Макс. разрешение | До 2K (v4.0), до 4K+ (v4.5, v5) |
| Оптимальная длина промпта | 30–100 слов |
| Соотношения сторон | 1:1, 2:3, 3:4, 4:3, 3:2, 16:9, 9:16 (указываются через --ar) |
| Negative prompts | Поддерживаются (зависит от платформы) |

---

## Структура хорошего промпта

Оптимальная структура промпта для всех моделей Seedream:

```
[Субъект] + [Стиль] + [Композиция] + [Освещение/Атмосфера] + [Технические параметры]
```

Все версии Seedream используют одну архитектуру приоритизации: элементы, указанные раньше в промпте, получают больший вес. Субъект всегда должен идти первым.

### Иерархия понимания модели
1. **Subject** — главный объект, персонаж или фокусная точка
2. **Style** — фотографический стиль, арт-стиль, кинематографический подход
3. **Composition** — ракурс камеры, кадрирование, расстояние
4. **Lighting & Atmosphere** — настроение, цветовая температура
5. **Technical details** — объективы, фокусное расстояние, плёночное зерно

---

## Общие возможности семейства Seedream

- **Фотореализм** — реалистичные изображения с детализированными текстурами и светом
- **Стилевое разнообразие** — фотография, иллюстрация, концепт-арт, различные арт-стили
- **Понимание композиции** — ракурсы, крупности, правило третей
- **Работа с освещением** — точный контроль через текстовые описания света
- **Текст на изображениях** — базовая поддержка (v4.0), хорошая (v4.5), отличная (v5)

---

## Основные типы промптов

### 1. Портретная фотография
Реалистичные портреты — одна из сильнейших сторон Seedream.
- Формула: `(Субъект + внешность) + (Стиль: portrait photography / photorealistic) + (Объектив: 85mm) + (Свет) + (Фон)`
- Пример: «A young woman in soft natural light, photorealistic portrait style, 85mm lens, shallow depth of field, smooth bokeh background, clean composition.»

### 2. Продуктовая фотография
Чёткие коммерческие изображения продуктов.
- Формула: `(Продукт + материал) + (Фон: white/gradient) + (Стиль: product photography) + (Свет: studio) + (Детали)`
- Пример: «Matte black water bottle on white seamless background, commercial product photography, soft studio lighting, ultra-sharp details, slight overhead angle.»

### 3. Кинематографические сцены
Драматические кадры с глубоким освещением и сторителлингом.
- Формула: `(Сцена + персонаж) + (Стиль: cinematic) + (Объектив: 35mm) + (Свет: dramatic) + (Атмосфера)`
- Пример: «A lone warrior in rain-soaked neon alley, cinematic style, 35mm lens, cold blue lighting, reflective puddles, dramatic shadows.»

### 4. Концепт-арт и иллюстрации
Фэнтези, sci-fi, стилизованный арт.
- Формула: `(Субъект/мир) + (Стиль: concept art / digital painting) + (Масштаб) + (Свет) + (Детали)`
- Пример: «Ancient floating city above clouds, concept art, epic scale, volumetric golden light, intricate architectural details.»

### 5. Стилизованные изображения
Работа в конкретных арт-стилях.
- Формула: `(Субъект) + (Стиль: oil painting / watercolor / anime) + (Палитра) + (Настроение)`
- Пример: «A fox in autumn forest, watercolor style, warm orange and red palette, peaceful serene atmosphere.»

### 6. Постеры и типографика
Изображения с текстовыми элементами.
- Формула: `(Тип: poster/banner) + (Тема) + (Текст в кавычках) + (Стиль типографики) + (Формат)`
- Пример: «Movie poster, text "BEYOND THE STARS" in bold metallic font, dark space background, cinematic composition, --ar 2:3.»

---

## Продвинутые техники

### Модификаторы стиля

| Категория | Примеры |
|-----------|---------|
| Арт-стили | oil painting, watercolor, pencil sketch, digital art, ink wash |
| Фото-стили | portrait photography, macro, aerial view, street, product |
| Эстетика | cinematic, photorealistic, stylized, minimalist, hyperrealistic |

### Контроль композиции
- «symmetrical composition», «rule of thirds»
- «foreground detail with blurred background», «leading lines»
- «wide-angle view», «overhead perspective», «centered in frame»
- «close-up», «medium shot», «full-body shot», «wide shot»

### Директивы освещения
- «golden hour lighting», «dramatic side lighting», «soft diffused light»
- «studio lighting», «Rembrandt lighting», «rim light», «backlight»
- «volumetric light», «neon glow», «moonlight»
- «high-key lighting», «low-key lighting»

### Технические параметры
- «85mm lens», «35mm lens», «50mm lens», «wide-angle»
- «shallow depth of field», «deep focus»
- «high resolution», «4K detail», «film grain»

### Негативные промпты
Для исключения нежелательных элементов (в отдельном поле negative prompt):
- «no extra limbs», «no blurry details»
- «no cluttered background», «no cartoon style»
- «no watermark», «no text» (если текст не нужен)

### Итеративный подход
1. Начать с базового промпта (субъект + стиль)
2. Сгенерировать изображение
3. Добавить/изменить один параметр
4. Повторить до желаемого результата

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | photorealistic, hyperrealistic, ultra-detailed, 4K, 8K, high resolution, RAW |
| Фото-жанры | portrait, landscape, macro, aerial, street, product, food, architectural |
| Арт-направления | oil painting, watercolor, digital art, concept art, pencil sketch, ink wash |
| Кинематограф | cinematic, film noir, anamorphic, Hollywood, indie, Wes Anderson |
| Цвет/тон | warm tones, cool tones, muted, vibrant, pastel, monochrome, sepia |
| Настроение | dramatic, serene, mysterious, ethereal, melancholic, energetic, cozy |

---

## Типичные сценарии использования

### Реклама / E-commerce
- Продуктовые шоты на чистом фоне
- Лайфстайл-фото с продуктом в контексте
- Рекламные баннеры и постеры
- Fashion-контент и каталоги

### Портреты / Социальные сети
- Профессиональные хедшоты
- Стилизованные портреты
- Контент для инфлюенсеров
- Аватарки и профильные фото

### Кинематограф / Концепт-арт
- Мудборды и pre-visualization
- Концептуальные иллюстрации
- Фэнтези и sci-fi визуализации

### Графический дизайн
- Постеры и флаеры
- Инфографика
- Обложки

### Архитектура / Дизайн
- Визуализации зданий и интерьеров
- Ландшафтный дизайн

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Должен быть конкретным и стоять в начале промпта. «A fluffy orange tabby cat sitting on a windowsill» вместо «a cat».
2. **Стиль** — визуальный, фотографический или арт-стиль. Без указания стиля результат непредсказуем.
3. **Детализация** — хотя бы 2-3 конкретных визуальных дескриптора сверх субъекта и стиля.

### Бонусные элементы (улучшают результат)
4. **Композиция** — ракурс, крупность, компоновка (close-up, rule of thirds, overhead).
5. **Освещение** — тип и характер света (golden hour, studio lighting, dramatic shadows).
6. **Технические параметры** — объектив, глубина резкости (85mm lens, shallow depth of field).
7. **Атмосфера/настроение** — эмоциональный тон (moody, serene, dramatic).
8. **Фон/среда** — описание окружения (bokeh background, white seamless, urban street).
9. **Соотношение сторон** — --ar для нужного формата.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<5 слов) — модель будет додумывать слишком много
- Слишком длинный промпт (>150 слов) — модель теряет фокус
- Субъект не в начале промпта — модель неправильно расставит приоритеты
- Перегрузка прилагательными — 3-5 мощных дескрипторов лучше 20 слабых
- Конфликтующие стили одновременно («photorealistic cartoon watercolor»)
- Абстрактные/размытые формулировки без визуальной конкретики («something nice and beautiful»)
- Негативные промпты в основном тексте вместо отдельного поля negative prompt
- Отсутствие указания стиля — результат будет случайным
- Слишком много объектов/персонажей без чёткой иерархии
- Текст для рендеринга без кавычек
- Изменение множества параметров одновременно при итерации

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Продуктовый шот не требует сложной атмосферы — но требует чёткого освещения и фона
- Концепт-арт может быть абстрактнее — но должен иметь чёткий стиль
- Портрет требует деталей внешности и освещения — но не обязательно сложного окружения
- Постер с текстом — текст должен быть в кавычках, указан стиль шрифта
- Простые стилизованные изображения не требуют технических параметров камеры
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
