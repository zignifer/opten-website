# Imagen 4 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Google Imagen 4.
> Источники: https://github.com/yanis112/The-Generative-Art-Prompt-Bible, https://www.freepik.com/blog/google-imagen-4/, https://www.atlabs.ai/blog/imagen-4-prompting-guide, https://medium.com/@charmichokshi/a-practical-guide-to-googles-imagen-4-in-your-everyday-work-c00eaad80486

## Идентификация

- **model_id:** imagen-4
- **model_name:** Imagen 4
- **type:** image
- **platform:** Google AI (ImageFX, Vertex AI, Freepik, Google AI Studio)
- **best_language:** English — модель оптимизирована для английских промптов. Естественный язык (полные предложения) работает значительно лучше, чем списки тегов через запятую.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Тип генерации | Text-to-Image |
| Разрешение | До 1024×1024 (стандарт); зависит от платформы |
| Соотношения сторон | 1:1, 4:3, 3:4, 9:16, 16:9 |
| Макс. длина промпта | ~4000 символов (рекомендуется 50–300 слов для оптимального результата) |
| Рендер текста | Продвинутая типографика — чёткий, читаемый текст с правильным кернингом |
| Негативные промпты | Не поддерживаются — описывай что нужно, а не что не нужно |
| Скорость | До 10× быстрее Imagen 3 (версия Fast) |
| Запреты | Контент-фильтры Google: реалистичные лица публичных персон, NSFW, насилие, копирайт |

---

## Версии Imagen 4

| Версия | Описание | Когда использовать |
|--------|----------|-------------------|
| **Imagen 4 Fast** | Быстрая генерация, хорошее качество | Черновики, итерации, тестирование идей |
| **Imagen 4** (стандарт) | Баланс качества и скорости | Основная работа, маркетинг, контент |
| **Imagen 4 Ultra** | Максимальная детализация и качество | Финальные изображения, печать, premium контент |

Все версии используют одинаковую структуру промптов и соотношения сторон.

---

## Структура хорошего промпта

Imagen 4 работает на естественном языке. Оптимальная структура промпта:

```
[Тип изображения/стиль съёмки] + [Субъект с деталями] + [Действие/поза] + [Окружение/сцена] + [Освещение] + [Ракурс/композиция] + [Материалы/текстуры] + [Настроение/атмосфера]
```

Не обязательно использовать все элементы — состав зависит от задачи. Но чем конкретнее описание, тем точнее результат.

### Фреймворк SCULPT

Рекомендуемый фреймворк для построения промптов:

| Буква | Элемент | Описание | Пример |
|-------|---------|----------|--------|
| **S** | Subject (Субъект) | Кто или что изображено, с конкретными деталями | «A battle-hardened samurai in white porcelain armor» |
| **C** | Context (Контекст) | Окружение, место, время, погода | «in a misty bamboo grove at dawn» |
| **U** | Unique details (Уникальные детали) | Текстуры, материалы, аксессуары, особенности | «armor adorned with intricate blue paintings, worn wooden scabbard» |
| **L** | Lighting (Освещение) | Тип и характер света | «soft dappled light filtering through the canopy» |
| **P** | Perspective (Перспектива) | Ракурс, тип кадра, объектив | «dramatic close-up, low angle, shallow depth of field» |
| **T** | Tone/Theme (Тон/Тема) | Настроение, стилистика, отсылки | «cinematic tension, Akira Kurosawa style, high-contrast black and white» |

---

## Ключевые сильные стороны Imagen 4

### 1. Ультра-фотореализм
Imagen 4 — один из лидеров по фотореалистичной генерации:
- Волосы, кожа, текстуры тканей — на уровне студийной фотографии
- Капли воды, отражения, преломление света — физически правдоподобны
- Детализация на уровне мельчайших элементов: швы, нити, поры

### 2. Продвинутый рендер текста (типографика)
Главное преимущество Imagen 4 перед конкурентами:
- Чёткий, читаемый текст на вывесках, постерах, упаковке
- Правильный кернинг и интервалы между буквами
- Для лучшего результата: укажи текст в кавычках, опиши стиль и расположение
- Пример: «Large, bold, groovy white bubble typography reads "Tasty Burger" at the top»

### 3. Стилевая гибкость
- Фотореализм: «photorealistic, shot on 35mm film, DSLR»
- Аниме: «anime style, hand-drawn, cel-shaded»
- Акварель: «watercolor illustration, soft washes, paper texture»
- Ink-wash: «ink wash painting, sumi-e style»
- Сюрреализм: «surreal, dreamlike, impossible geometry»
- Flat design: «minimalist flat illustration, vector style»

### 4. Множественные соотношения сторон
- **1:1** — социальные сети, аватары
- **4:3 / 3:4** — презентации, карточки товаров
- **16:9** — обложки YouTube, баннеры
- **9:16** — Stories, Reels, TikTok

---

## Продвинутые техники

### Кинематографический язык
Imagen 4 отлично реагирует на профессиональную фото/кино-терминологию:

```
35mm film look movie still, ARRI Alexa, Summilux lens: Hyperrealistic photography,
photorealistic quality, cinematic grain. A dramatic, low-angle shot captures...
```

- **Камера/объектив**: «Leica M10», «50mm Summilux», «ARRI Alexa», «anamorphic lens»
- **Плёнка**: «Cinestill 50D», «Kodak Vision3 500T», «Kodak Portra 400», «35mm film grain»
- **Пост-обработка**: «color grading», «LUT», «digital intermediate», «film emulation»
- **Диафрагма**: «shot at f/2.0» — для контроля глубины резкости

### Избегай собственных имён для фотореализма
Распространённая ошибка: использование имён из фикшена (Valyria, Gandalf, Thanos) при запросе фотореалистичного изображения. Модель ассоциирует эти имена с иллюстрациями и артами из обучающих данных.

**Плохо:** «a photorealistic image of Valyria»
**Хорошо:** «a photorealistic image of a glorious titanic city with Greco-Roman architecture»

Описывай ХАРАКТЕРИСТИКИ вместо имён, когда нужен реалистичный стиль.

### Детализация текстур и материалов
Imagen 4 превосходно рендерит физические свойства объектов:
- «porcelain carapace with intricate blue paintings»
- «worn leather with visible stitching and patina»
- «gleaming golden armor with detailed engravings and gemstones»
- «moss-covered ancient stone with cracks and weathering»
- «iridescent feathers with subtle hues of lavender and rose gold»

### Многослойная композиция
Для сложных сцен описывай слои от переднего плана к заднему:
- «In the foreground... In the middle ground... The background shows...»
- Использование глубины резкости для разделения планов
- «Layered composition with the subject sharply focused and background softly blurred»

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Photorealistic, high-resolution, ultra-detailed, hyper-realistic, 8K, RAW, studio quality |
| Жанр фото | Editorial fashion, portrait, product shot, documentary, street photography, macro |
| Кинематограф | Cinematic still, movie scene, blockbuster VFX, film noir, indie film |
| Цвет/тон | Golden hour, warm tones, desaturated, high contrast, muted earth tones, neon, pastel |
| Арт-стиль | Watercolor, ink-wash, anime, oil painting, digital art, surreal, concept art, flat design |
| Освещение | Natural light, rim light, chiaroscuro, volumetric god rays, neon glow, backlit, studio strobe |
| Плёнка/камера | 35mm film, Cinestill 50D, Kodak Portra, film grain, anamorphic, bokeh, lens flare |
| Атмосфера | Moody, dreamy, ethereal, gritty, nostalgic, futuristic, epic, intimate |

---

## Словарь ракурсов и композиции

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Extreme close-up (ECU), close-up, medium shot, wide shot, establishing shot, macro |
| Угол | Low angle, high angle, bird's eye, Dutch angle, over-the-shoulder (OTS), POV |
| Тип кадра | Tracking shot, crane shot, aerial/drone, dolly zoom (vertigo effect), whip pan |
| Фокус | Shallow depth of field, deep focus, bokeh, soft focus, tilt-shift, rack focus |
| Композиция | Rule of thirds, centered, symmetrical, diagonal lines, layered, negative space |

---

## Типичные сценарии использования

### Маркетинг и рекламные визуалы
- Продуктовые шоты с типографикой: постеры, баннеры, упаковка
- Editorial-стиль для брендов: «cinematic editorial shot», «fashion-forward»
- Чёткий призыв к действию через типографику на изображении

### Фотореалистичные портреты и фэшн
- Детальное описание одежды, аксессуаров, причёски
- Освещение и настроение: «cinematic noir», «golden-hour glow», «studio lighting»
- Среда и контекст: «urban street», «vintage car interior», «desert landscape»

### Фэнтези, сай-фай и концепт-арт
- Детальные описания существ, армий, архитектуры
- VFX-терминология: «particle effects», «volumetric lighting», «god rays»
- Стилистические отсылки: «Peter Jackson style», «Studio Ghibli», «Frostpunk aesthetic»
- Длинные промпты (150–300 слов) для максимальной детализации

### Типографические и дизайн-задачи
- Постеры с текстом: указать точный текст, стиль шрифта, расположение
- Вывески и логотипы: «neon sign reading "OPEN"», «hand-painted lettering»
- Этикетки и упаковка: «product label with "Organic Coffee" in serif font»

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Конкретно и детально, не абстрактно. «Молодая женщина с рыжими волосами» вместо «человек».
2. **Визуальный стиль** — тип изображения: фотореалистичное, иллюстрация, рендер, арт. Imagen 4 хорош в разных стилях, но должен знать какой нужен.
3. **Сцена/контекст** — где находится субъект, что его окружает. Даже минимальное описание среды помогает.

### Важные элементы (значительно улучшают результат)
4. **Освещение** — один из ключевых факторов качества. Golden hour, studio lighting, rim light — конкретика критична.
5. **Композиция/ракурс** — тип кадра и угол камеры: close-up, low angle, aerial, over-the-shoulder.
6. **Детали и текстуры** — конкретные материалы, ткани, поверхности: «worn leather», «gleaming metal», «soft wool».
7. **Настроение/атмосфера** — эмоциональный тон: moody, ethereal, gritty, nostalgic.

### Бонусные элементы (для продвинутых промптов)
8. **Кинематографические отсылки** — конкретная плёнка, камера, пост-обработка: «Cinestill 50D», «shot on ARRI Alexa».
9. **Типографика** — если нужен текст, он должен быть указан точно: текст в кавычках, стиль шрифта, расположение.
10. **Глубина резкости** — «shallow depth of field», «bokeh» — для профессионального вида.
11. **Естественный язык** — связные предложения вместо тегов через запятую.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<10 слов) — модель додумает слишком много самостоятельно
- Теги через запятую вместо связных предложений — Imagen 4 оптимизирован для natural language
- Собственные имена из фикшена для фотореалистичных сцен — модель ассоциирует их с иллюстрациями, используй описательные характеристики
- Конфликтующие стили («photorealistic anime watercolor oil painting»)
- Точные числовые требования к расположению объектов — модель слаба в spatial reasoning и подсчёте объектов
- Запрос сложных сцен с множеством пересекающихся объектов — могут появиться искажения
- Негативные формулировки («no trees, no clouds, without shadows») — Imagen не поддерживает negative prompt
- Перегруженный промпт (>500 слов) без чёткой структуры и иерархии важности
- Запрос на генерацию реалистичных лиц известных людей — контент-фильтр заблокирует
- Промпт на языке отличном от английского — качество снижается на других языках

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Фотореалистичный портрет оценивается иначе чем иллюстрация — разные критерии важности
- Маркетинговый постер с текстом — типографика должна быть описана детально
- Концепт-арт допускает более свободный стиль описания
- Простой продуктовый шот не требует VFX-терминологии
- Абстрактный арт может не иметь конкретного субъекта — это нормально
- Длинный детальный промпт для фэнтези-сцены — это плюс, не минус
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
