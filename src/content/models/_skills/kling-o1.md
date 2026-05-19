# Kling O1 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Kling O1.
> Источники: fal.ai Kling O1 Prompt Guide, veed.io Kling AI Guide.

## Идентификация

- **model_id:** kling-o1
- **model_name:** Kling O1
- **type:** video
- **platform:** Kling AI (klingai.com) by Kuaishou
- **best_language:** English. Kling O1 лучше всего реагирует на структурированные английские промпты.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Длительность генерации | До 10 секунд |
| Разрешение | До 1080p |
| Оптимальная длина промпта | 50–150 слов |
| Режимы | Image-to-Video, Video-to-Video, Reference-to-Video, Video Edit |
| Reasoning | O1 — рассуждающая модель: лучше интерпретирует сложные намерения |
| Референсы | До 4 референсных изображений (Reference-to-Video) |

---

## Ключевое отличие Kling O1

Kling O1 — **рассуждающая модель** (reasoning model). В отличие от предыдущих версий:

- Лучше понимает **намерение** промпта, а не только ключевые слова
- Выполняет внутренний анализ сцены перед генерацией
- Каждый из четырёх режимов **обрабатывает промпты по-разному**
- Качество результата определяется **структурой промпта больше, чем количеством слов**

Применение неправильной стратегии к режиму даёт нестабильные результаты, даже если промпт детальный.

---

## Структура хорошего промпта

Общая структура для всех режимов:

```
[Subject + Primary Action] → [Environmental Context] → [Camera Movement/Perspective] → [Style/Quality Descriptors]
```

**Главное правило:** Начинать с субъекта и основного действия. Каждый элемент даёт модели конкретный визуальный якорь.

### Слабый промпт:
«A car driving through a city at sunset.»

### Сильный промпт:
«A sleek silver sports car accelerates through a rain-slicked downtown street as golden sunset light breaks through storm clouds, camera tracking alongside at street level, cinematic lighting with volumetric light rays, photorealistic rendering.»

Разница: второй промпт даёт конкретные визуальные якоря — внешность машины, состояние улицы, качество освещения, поведение камеры, желаемая эстетика.

---

## Четыре режима генерации Kling O1

### 1. Image-to-Video (I2V)
Оживление статичного изображения. **Промпт описывает ДВИЖЕНИЕ, которое естественно для исходного изображения.**
- Формула: `(Движение субъекта + темп) + (Движение окружения) + (Камера — отдельно от субъекта)`
- **Разделять движение субъекта и камеры:** «Camera slowly pushes in while the subject turns their head to look over their shoulder»
- **Темпоральные дескрипторы:** «gradually», «suddenly», «smoothly», «rhythmically» — управляют ритмом и энергией
- **Длина:** 20–40 слов. Описывать только то, чего НЕТ на изображении (движение).
- Пример: «walks slowly toward the ocean, hair and clothing moving gently in the breeze, waves rolling onto shore, camera slowly pushes in»

### 2. Video-to-Video (V2V Transform)
Трансформация существующего видео. Движение из исходного видео сохраняется.
- Формула: `Transform into [целевой стиль/среда] + while maintaining original motion and composition + [конкретные изменения]`
- **Обязательно:** Указать что СОХРАНИТЬ: «maintaining the original camera movement and subject blocking»
- **Без этого якоря** модель может внести нежелательные изменения в движение
- Пример: «Transform into a cyberpunk cityscape with neon signs, holographic advertisements, and rain-slicked streets reflecting colored lights, maintaining the original camera movement and subject blocking, add volumetric fog and lens flares»
- Для стилевых трансфертов: ссылки на конкретные стили — «in the style of Studio Ghibli animation», «film noir lighting and shadows», «1980s VHS camcorder aesthetic»

### 3. Reference-to-Video (Ref2V)
Генерация с сохранением консистентности элементов из 1–4 референсных изображений.
- Формула: `[Персонаж из ref 1] + [Действие/взаимодействие] + [Пространственные отношения] + [Среда из ref N]`
- **Обязательно:** Явно привязать каждый референс к элементу в сцене
- **Пространственная точность:** «Character A (reference 1) stands in the foreground left, turning to hand an object to Character B (reference 2) who enters from the right background»
- **Согласованная терминология:** Если назвали «the red jacket» — не переключаться на «crimson coat» в следующем промпте
- Пример: «Character from reference image 1 walks through the marketplace, wearing the outfit from reference image 2, interacting with the merchant stall design from reference image 3, set against the background architecture from reference image 4»

### 4. Video-to-Video Edit (V2V Edit)
Хирургическая точность: модификация конкретных элементов при сохранении всего остального.
- Формула: `Keeping [что сохранить] identical + change only [что изменить] + [конкретное описание изменения]`
- **Начать с того, что НЕ меняется:** «Keeping all camera movement, subject blocking, and background elements identical, change only the sky to a dramatic sunset with purple and orange clouds»
- **Маскирующий язык:** «Replace the subject's shirt color from blue to red while maintaining all fabric texture, wrinkles, and lighting»
- **Негативные инструкции в Edit:** «Do not alter facial features, do not change body proportions, do not modify the lighting direction»
- **Сравнительный язык для цветокоррекции:** «Increase contrast by 20%, warm the color temperature to match golden hour lighting, deepen shadows while preserving highlight detail»

---

## Продвинутые техники

### Послойное описание движения
Разделить передний, средний и задний план:
```
Foreground subject walks left to right, midground traffic moves right to left at faster speed, background pedestrians move at varying paces, creating parallax depth
```

### Хореография освещения
Описать как свет меняется в течение клипа:
```
Scene begins in shadow, sunlight gradually breaks through clouds at the 3-second mark, illuminating the subject's face by the 5-second mark, casting long shadows
```

### Прогрессия атмосферы
```
Light fog at the start gradually thickens to dense mist by the end, reducing visibility and softening distant elements
```

### Описание с учётом физики
```
Fabric drapes and flows with gravity, responding to body movement with slight delay, catching air resistance during faster motions
```

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Wide shot, medium shot, close-up, extreme close-up, macro |
| Движение | Tracking, dolly, push in, pull out, pan, orbit, crane, follow |
| Угол | Low angle, high angle, bird's eye, Dutch angle, POV, street level |
| Ритм | Slow motion, time-lapse, freeze frame |
| Фокус | Shallow depth of field, rack focus, bokeh |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, 4K, photorealistic, film grain, HDR |
| Жанр | Film noir, documentary, commercial, cyberpunk, editorial |
| Цвет/тон | Warm, cold, high contrast, desaturated, neon, golden hour, muted |
| Арт-стиль | Realistic, surreal, Studio Ghibli, 1980s VHS, anime, minimal |
| Освещение | Natural light, volumetric, rim light, neon glow, studio lighting |

---

## Типичные сценарии использования

### Image-to-Video
- Оживление фотографий и иллюстраций
- Добавление субтильного движения к неподвижным портретам
- Анимация продуктовых изображений

### Video-to-Video Transform
- Стилевые трансферты (реализм → аниме, день → ночь)
- Атмосферные трансформации (солнце → дождь)
- Ретро-стилизация (современное видео → VHS, film noir)

### Reference-to-Video
- Нарративный контент с консистентными персонажами
- Брендированный контент с фиксированными элементами
- Серии видео с повторяющимися персонажами

### Video Edit
- Замена неба, фона, цвета одежды
- Цветокоррекция и атмосферные изменения
- Удаление или добавление элементов

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — конкретные визуальные детали. Не абстрактные описания.
2. **Действие/движение** — для I2V. Или **целевая трансформация** — для V2V/Edit.
3. **Камера/перспектива** — поведение камеры описано отдельно от движения субъекта.
4. **Стиль/эстетика** — визуальный якорь: стиль, качество, цветовая палитра.

### Бонусные элементы (улучшают результат)
5. **Темпоральные дескрипторы** — маркеры ритма и пейсинга.
6. **Послойное движение** — разделение переднего/среднего/заднего планов.
7. **Хореография освещения** — как свет меняется в течение клипа.
8. **Физически корректные описания** — гравитация, инерция, сопротивление воздуха.
9. **Явные якоря сохранения** — для V2V/Edit: что должно остаться неизменным.
10. **Привязка референсов** — для Ref2V: какой референс → какой элемент.

### Специальные правила для режимов
- **I2V:** описывать ТОЛЬКО движение (20–40 слов). Разделять движение субъекта и камеры. Использовать темпоральные дескрипторы.
- **V2V Transform:** ОБЯЗАТЕЛЬНО указать что сохранить («maintaining original camera movement»). Без этого — штраф.
- **Ref2V:** ОБЯЗАТЕЛЬНО явно привязать каждый референс к элементу сцены. Согласованная терминология через промпты. Пространственная точность.
- **V2V Edit:** Начать с того, что НЕ меняется. Изолировать изменения. Маскирующий язык.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<15 слов) — недостаточно визуальных якорей
- Слишком длинный промпт (>150 слов для single-mode) — конфликтующие инструкции
- Конфликтующие описания: «bright sunny day with dark moody shadows»
- Абстрактные формулировки без визуальных якорей: «make it look dynamic»
- Важная информация похоронена в конце промпта (модель приоритизирует начало)
- Описание сцены в I2V промпте (модель видит изображение)
- V2V Transform без указания что сохранить (модель ломает исходное движение)
- V2V Edit без изоляции изменений (изменяется вся сцена вместо целевого элемента)
- Ref2V без привязки референсов к элементам (элементы смешиваются непредвиденно)
- Несогласованная терминология в Ref2V («red jacket» → «crimson coat»)
- 3+ одновременных камерных трансформации
- Перегрузка промпта несовместимыми стилями

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Каждый режим O1 требует **разной стратегии промптинга**
- I2V промпт ДОЛЖЕН быть коротким — это корректное поведение
- V2V Transform промпт фокусируется на изменениях, а не на описании с нуля
- V2V Edit промпт начинается с того, что сохранить — это правильная структура
- Ref2V промпт может быть длиннее из-за привязки референсов
- O1 как reasoning-модель лучше справляется со сложными намерениями, но требует чёткой структуры
- Оценка должна учитывать конкретный режим генерации
