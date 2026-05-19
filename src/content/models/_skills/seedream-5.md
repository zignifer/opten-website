# Seedream 5 Lite — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Seedream 5 Lite.
> Источники: документация ByteDance, адаптация из Seedream 4.5 skill

## Идентификация

- **model_id:** seedream-5
- **model_name:** Seedream 5 Lite
- **type:** image
- **platform:** ByteDance (доступен через fal.ai, syntx.ai и другие платформы)
- **best_language:** English. Модель оптимизирована для английских промптов. Китайский также хорошо поддерживается.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Тип генерации | Text-to-Image, Image-to-Image, Multi-Image Blending, Inpainting |
| Макс. разрешение | До 4K+ |
| Оптимальная длина промпта | 30–120 слов |
| Соотношения сторон | 1:1, 2:3, 3:4, 4:3, 3:2, 16:9, 9:16 и произвольные |
| Negative prompts | Поддерживаются |
| Редактирование | Полная поддержка (inpainting, outpainting, image-to-image) |

---

## Структура хорошего промпта

Оптимальная структура промпта для Seedream 5 Lite:

```
[Субъект] + [Стиль] + [Композиция] + [Освещение/Атмосфера] + [Технические параметры] + [Дополнительные детали]
```

Модель наследует архитектуру приоритизации Seedream 4.5 — элементы в начале промпта получают наибольший вес. Но Seedream 5 Lite лучше справляется с длинными и сложными промптами.

---

## Ключевые возможности Seedream 5 Lite

- **Улучшенный фотореализм** — ещё более детализированный рендеринг по сравнению с 4.5
- **Превосходное понимание текста** — значительно улучшена генерация читаемого текста на изображениях
- **Расширенное пространственное понимание** — точное размещение объектов, реалистичные пропорции
- **Улучшенная консистентность** — более стабильные результаты при сложных сценах
- **Лучшее следование инструкциям** — точнее интерпретирует сложные и многослойные промпты
- **Расширенные стили** — больший диапазон арт-стилей и визуальных эстетик
- **Улучшенная работа с руками и анатомией** — меньше артефактов при генерации людей

### Отличия от Seedream 4.5
- Более точная генерация текста на изображениях
- Лучшая работа с анатомией человека (руки, пальцы, позы)
- Улучшенная обработка сложных многоэлементных сцен
- Более широкий диапазон поддерживаемых стилей
- Лучшее понимание пространственных отношений между объектами
- Может обрабатывать более длинные и детализированные промпты без потери фокуса

---

## Основные типы промптов для Seedream 5 Lite

### 1. Портретная фотография
- Формула: `(Субъект + детальная внешность) + (Стиль: photorealistic portrait) + (Объектив: 85mm/105mm) + (Свет) + (Фон) + (Настроение)`
- Пример: «A middle-aged man with salt-and-pepper beard, photorealistic portrait, 105mm lens, Rembrandt lighting, dark moody background, contemplative expression, shallow depth of field, fine skin texture detail.»

### 2. Fashion / Lifestyle
- Формула: `(Субъект + одежда + ткани) + (Стиль: editorial/street fashion) + (Среда) + (Свет) + (Объектив) + (Настроение)`
- Пример: «Full-body shot of a woman in flowing silk dress, editorial fashion photography, cherry blossom garden, soft golden hour backlight, 50mm lens, ethereal romantic atmosphere.»

### 3. Продуктовая фотография
- Формула: `(Продукт + материал + цвет) + (Фон + поверхность) + (Стиль: commercial) + (Свет: studio) + (Композиция) + (Детали)`
- Пример: «Luxury gold wristwatch on dark marble surface, commercial product photography, three-point studio lighting, ultra-sharp details, subtle reflections, overhead angle, 4K quality.»

### 4. Кинематографические сцены
- Формула: `(Сцена + персонажи) + (Стиль: cinematic / film still) + (Объектив: anamorphic/35mm) + (Свет) + (Цветовая гамма) + (Атмосфера)`
- Пример: «A cyberpunk detective walking through neon-lit rain-soaked streets, cinematic film still, anamorphic lens, cold blue and magenta lighting, atmospheric fog, blade runner aesthetic.»

### 5. Концепт-арт и иллюстрации
- Формула: `(Субъект/мир) + (Стиль: concept art / digital painting) + (Масштаб) + (Свет: volumetric) + (Палитра) + (Детали: intricate)`
- Пример: «Ancient floating city above the clouds, concept art style, epic scale, volumetric golden light, intricate architectural details, lush hanging gardens, birds in foreground.»

### 6. Постеры и типографика
Seedream 5 Lite значительно улучшен в рендеринге текста.
- Формула: `(Тип: poster/banner) + (Тема) + (Текст в кавычках) + (Стиль типографики) + (Цвета) + (Формат)`
- Пример: «Movie poster for a sci-fi thriller, text "BEYOND THE STARS" in bold metallic typography, dark space background with planet, cinematic lighting, dramatic composition, --ar 2:3.»

### 7. Архитектура и интерьеры
- Формула: `(Объект + стиль архитектуры) + (Стиль: architectural visualization) + (Свет) + (Материалы) + (Время суток) + (Окружение)`
- Пример: «Modern minimalist house with floor-to-ceiling windows, architectural photography, golden hour warm light, concrete and wood materials, lush garden, wide-angle lens.»

### 8. Научная и техническая визуализация
- Формула: `(Объект/процесс) + (Стиль: scientific illustration / 3D render) + (Детали: labeled, cross-section) + (Фон) + (Цвета)`

### 9. Абстрактное и генеративное искусство
- Формула: `(Концепция) + (Стиль: abstract / generative) + (Цвета + формы) + (Текстуры) + (Настроение)`

### 10. Комиксы и раскадровки
- Формула: `(Сцена + персонажи) + (Стиль: comic book / manga / graphic novel) + (Панели) + (Диалоги в пузырях)`

---

## Продвинутые техники

### Модификаторы стиля

| Категория | Примеры |
|-----------|---------|
| Арт-стили | oil painting, watercolor, pencil sketch, digital art, ink wash, gouache |
| Фото-стили | portrait, macro, aerial, street, product, food, architectural, underwater |
| Эстетика | cinematic, photorealistic, stylized, minimalist, hyperrealistic, surreal |
| Рендер | 3D render, CGI, Unreal Engine, Octane render, ray tracing |

### Контроль композиции
- «symmetrical composition», «rule of thirds», «golden ratio»
- «foreground detail with blurred background», «leading lines»
- «wide-angle view», «bird's eye view», «worm's eye view»
- «centered», «off-center», «dynamic angle», «Dutch angle»

### Директивы освещения
- «golden hour», «blue hour», «dramatic side lighting», «soft diffused light»
- «Rembrandt lighting», «split lighting», «butterfly lighting»
- «rim light», «backlight», «volumetric light», «caustics»
- «neon glow», «candlelight», «moonlight», «bioluminescent»

### Технические параметры
- «shot on 85mm lens», «35mm lens», «24mm wide-angle», «200mm telephoto»
- «shallow depth of field», «deep focus», «tilt-shift»
- «f/1.4», «f/2.8», «long exposure», «HDR»
- «film grain», «Kodak Portra 400», «Fujifilm Velvia»

### Генерация текста на изображениях
Seedream 5 Lite значительно улучшен в этом аспекте:
- Текст заключать в кавычки: `text "YOUR TEXT HERE"`
- Указывать стиль шрифта: `bold sans-serif`, `elegant serif`, `handwritten`
- Указывать расположение: `centered at top`, `bottom left corner`
- Для длинных текстов — разбивать на отдельные элементы

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | photorealistic, hyperrealistic, ultra-detailed, 4K, 8K, RAW, masterpiece |
| Фото-жанры | portrait, landscape, macro, aerial, street, product, food, architectural, underwater |
| Арт-направления | oil painting, watercolor, digital art, concept art, ink wash, gouache, charcoal |
| Кинематограф | cinematic, film noir, anamorphic, blockbuster, indie, Wes Anderson, Kubrick |
| Рендер | 3D render, CGI, Unreal Engine 5, Octane, ray tracing, isometric |
| Цвет/тон | warm, cool, muted, vibrant, pastel, monochrome, sepia, cross-processed |
| Настроение | dramatic, serene, mysterious, ethereal, melancholic, energetic, nostalgic |
| Текстуры | smooth, rough, grainy, glossy, matte, translucent, iridescent |

---

## Типичные сценарии использования

### Реклама / E-commerce
- Продуктовые шоты с точным рендерингом материалов
- Лайфстайл-фото с продуктом
- Рекламные баннеры и постеры с читаемым текстом
- Fashion-lookbook, каталоги, маркетплейсы

### Портреты / Социальные сети
- Профессиональные хедшоты с улучшенной анатомией
- Стилизованные портреты
- Контент для инфлюенсеров

### Кинематограф / Концепт-арт
- Мудборды и pre-visualization для фильмов
- Концептуальные иллюстрации для игр
- Storyboard-кадры
- Эпические фэнтези и sci-fi сцены

### Типографика / Графический дизайн
- Постеры с заголовками и текстом
- Логотипы и брендинг-концепты
- Инфографика
- Обложки книг и альбомов

### Архитектура / Дизайн
- Визуализации экстерьеров и интерьеров
- Ландшафтный дизайн
- Промышленный дизайн

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Должен быть конкретным и стоять в начале промпта. Подробное описание лучше краткого.
2. **Стиль** — визуальный, фотографический или арт-стиль. Модель должна знать, в каком направлении работать.
3. **Детализация** — минимум 2-3 конкретных визуальных дескриптора.

### Бонусные элементы (улучшают результат)
4. **Композиция** — ракурс, крупность, компоновка кадра.
5. **Освещение** — тип, направление, интенсивность света.
6. **Технические параметры** — объектив, глубина резкости, разрешение.
7. **Атмосфера/настроение** — эмоциональный тон изображения.
8. **Фон/среда** — описание окружения.
9. **Цветовая палитра** — указание на цветовую гамму или тональность.
10. **Соотношение сторон** — --ar для нужного формата.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<5 слов) — модель будет додумывать слишком много
- Чрезмерно длинный промпт (>200 слов) — даже Seedream 5 имеет пределы
- Субъект не в начале промпта — приоритеты будут расставлены неверно
- Конфликтующие стили одновременно («photorealistic watercolor cartoon»)
- Абстрактные формулировки без визуальной конкретики («something cool»)
- Перегрузка прилагательными без структуры
- Текст без кавычек — модель может не распознать его как текст для рендеринга
- Негативные промпты в основном тексте вместо отдельного поля
- Отсутствие указания стиля — результат будет непредсказуемым
- Слишком много объектов без чёткой иерархии и пространственных отношений

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Seedream 5 Lite справляется со сложными сценами лучше предыдущих версий — не штрафовать за сложность
- Генерация текста — одна из сильных сторон; поощрять использование текста в кавычках
- Модель хорошо работает с длинными детализированными промптами — не штрафовать за длину до 120 слов
- Портреты и анатомия улучшены — можно ожидать более сложных поз
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
