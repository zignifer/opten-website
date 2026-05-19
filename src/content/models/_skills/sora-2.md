# Sora 2 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Sora 2 (и Sora 2 Pro).
> Источники: https://cookbook.openai.com/examples/sora/sora2_prompting_guide, https://fal.ai/learn/devs/how-to-write-prompts-sora-2, https://leonardo.ai/news/sora-prompt-guide/

## Идентификация

- **model_id:** sora-2
- **model_name:** Sora 2 / Sora 2 Pro
- **type:** video
- **platform:** OpenAI (ChatGPT, API), fal.ai
- **best_language:** English (en). Промпты на английском дают наиболее стабильные результаты.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Длительность генерации | 4, 8, 12, 16 или 20 секунд (задаётся через API, не в промпте) |
| Разрешения sora-2 | 720x1280, 1280x720 |
| Разрешения sora-2-pro | 720x1280, 1280x720, 1024x1792, 1792x1024, 1080x1920, 1920x1080 |
| Макс. персонажей | До 2 на генерацию (через Characters API) |
| Продление видео | До 6 раз, макс. 120 секунд суммарно; модель использует ПОЛНЫЙ клип как контекст |
| Формат входных изображений | JPEG, PNG, WebP (размер должен совпадать с целевым разрешением видео) |
| Формат персонажей | MP4, 2–4 сек, 720p–1080p, 16:9 или 9:16 |
| Запрет | Длительность (`seconds`), разрешение (`size`) и персонажи (`characters`) задаются ТОЛЬКО через API-параметры |

---

## Структура хорошего промпта

Оптимальная структура промпта для Sora 2:

```
[Стиль/Эстетика] + [Субъект/Персонаж] + [Сцена/Среда] + [Действие/Движение] + [Камера: кадр + движение] + [Освещение/Цвет] + [Настроение] + [Звук/Диалоги]
```

Промпт — это бриф для оператора-постановщика, который впервые видит ваш сценарий. Если деталь не описана — модель додумает её сама.

---

## Ключевые принципы промптинга Sora 2

### 1. Промпт = один кадр (шот)
Каждый промпт описывает один конкретный кадр. Не пытайтесь уместить целую историю в один промпт — разбивайте на серию коротких клипов.

### 2. Стиль задаётся первым
Стиль — самый мощный рычаг управления в Sora 2. Одни и те же детали выглядят совершенно по-разному в зависимости от того, задали вы «Hollywood drama», «handheld smartphone clip» или «grainy vintage commercial».

### 3. Баланс детальности
- **Детальные промпты** = контроль и предсказуемость.
- **Краткие промпты** = творческая свобода модели, неожиданные результаты.
- Каждый запуск с одинаковым промптом даёт разный результат — это особенность Sora 2.

### 4. Короткие клипы стабильнее
Модель надёжнее следует инструкциям в коротких клипах (4 сек). Два склеенных 4-секундных клипа часто лучше одного 8-секундного.

### 5. Итеративный подход
Маленькие изменения в камере, освещении или действии кардинально меняют результат. Редактирование — для точечных правок, а не для полной переделки.

---

## Шаблон промпта (официальный)

```
[Прозаическое описание сцены. Опишите персонажей, костюмы, декорации, погоду и другие детали.]

Cinematography:
Camera shot: [крупность и угол, напр. wide establishing shot, eye level]
Mood: [общий тон, напр. cinematic and tense, playful and suspenseful]

Actions:
- [Действие 1: конкретный бит в клипе]
- [Действие 2: следующий бит]
- [Действие 3: ещё действие или реплика]

Dialogue:
- [Персонаж]: "[Реплика]"
```

---

## Примеры промптов

### Пример 1: Мастерская робота
```
Cinematography:
Camera: medium close-up, slow push-in with gentle parallax from hanging tools
Lighting: warm key from overhead practical; cool spill from window for contrast
Mood: gentle, whimsical, a touch of suspense

Actions:
- The robot taps the bulb; sparks crackle.
- It flinches, dropping the bulb, eyes widening.
- The bulb tumbles in slow motion; it catches it just in time.
- A puff of steam escapes its chest — relief and pride.
- Robot says quietly: "Almost lost it… but I got it!"

Background Sound:
Rain, ticking clock, soft mechanical hum, faint bulb sizzle.
```

### Пример 2: Романтическая сцена 1970-х
```
Style: 1970s romantic drama, shot on 35mm film with natural flares, soft focus, and warm halation. Slight gate weave and handheld micro-shake. Warm Kodak-inspired grade; film grain and soft vignette.

Cinematography:
Camera: medium-wide shot, slow dolly-in from eye level
Lighting: golden natural key with tungsten bounce; edge from fairy bulbs
Mood: nostalgic, tender, cinematic

Actions:
- She spins; her dress flares, catching sunlight.
- Woman (laughing): "See? Even the city dances with us tonight."
- He steps in, catches her hand, and dips her into shadow.
- Man (smiling): "Only because you lead."

Background Sound:
Natural ambience only: faint wind, fabric flutter, street noise. No added score.
```

### Пример 3: Короткий атмосферный промпт
```
In a 90s documentary-style interview, an old Swedish man sits in a study and says, "I still remember when I was young."
```

---

## Сравнение слабых и сильных промптов

| Слабо | Сильно | Что улучшено |
|-------|--------|-------------|
| A cat playing with a ball | Close-up shot of a tabby cat batting a red yarn ball across hardwood floors, shallow depth of field with background bokeh, natural window light | Кадрирование, детали субъекта, глубина резкости, освещение |
| City street at night | Wide-angle shot slowly pushing forward down a rain-soaked Tokyo street, neon signs reflecting in puddles, cinematic teal and orange grading | Движение камеры, детали среды, цветовая палитра |
| Product spinning | Smooth 360-degree rotating shot of black wireless headphones on a white pedestal, studio lighting with soft shadows, commercial photography style | Конкретика движения, сетап освещения, стилистический референс |
| Cinematic look | Anamorphic 2.0x lens, shallow DOF, volumetric light | Конкретные параметры вместо абстрактного слова |
| Person moves quickly | Cyclist pedals three times, brakes, and stops at crosswalk | Конкретное действие с таймингом |
| Brightly lit room | Soft window light with warm lamp fill, cool rim from hallway. Palette: amber, cream, walnut brown | Источники света + цветовые якоря |

---

## Ультра-детальный промпт (продвинутый уровень)

Для максимального контроля можно описать каждый аспект продакшена:

### Структура ультра-детального промпта:
1. **Формат и внешний вид** — shutter angle, capture type, grain, halation
2. **Объективы и фильтры** — focal length (32mm, 50mm), Pro-Mist, CPL
3. **Цветокоррекция** — highlights, mids, blacks по отдельности
4. **Освещение и атмосфера** — ключевой свет, отражатели (4x4 ultrabounce), negative fill, практические источники, атмосферные эффекты (дымка, туман)
5. **Локация и кадрирование** — передний, средний, задний планы
6. **Костюмы, реквизит, массовка** — детальное описание одежды, предметов
7. **Звуковой дизайн** — диегетический звук, уровни (LUFS)
8. **Посекундная раскладка** — точные действия привязанные к таймкодам

Пример посекундной раскладки:
```
0.00–2.40 — "Arrival Drift" (32mm, shoulder-mounted slow dolly left)
Camera slides past platform signage; shallow focus reveals traveler mid-frame.
Morning light blooms across lens; train headlights flare through mist.

2.40–4.00 — "Turn and Pause" (50mm, slow arc in)
Tighter over-shoulder arc as train halts; traveler turns toward camera,
catching sunlight rim across cheek. Eyes flick up toward something unseen.
```

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Wide establishing shot, wide shot, medium shot, medium close-up, close-up, extreme close-up, over-the-shoulder |
| Движение | Tracking shot, dolly zoom, crane shot, push-in, pull-out, pan, tilt, arc, dolly left/right, slow dolly-in |
| Стиль съёмки | Handheld, Steadicam, shoulder-mounted, static tripod, handheld ENG camera |
| Угол | Eye level, low angle, high angle, aerial, bird's eye, Dutch angle, slight angle from behind |
| Фокус | Shallow depth of field, deep focus, rack focus, bokeh, soft focus |
| Скорость | Slow motion, time-lapse, real-time, slow push-in |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Плёнка/Камера | 35mm film, 16mm, IMAX 65mm, anamorphic 2.0x, Kodak Vision3 500T, Arri Alexa, shot on 35mm |
| Визуальные эффекты | Film grain, halation, gate weave, natural flares, soft vignette, Pro-Mist filter |
| Жанр | Hollywood drama, documentary, romantic drama, noir, commercial, music video, 90s documentary-style |
| Цвет/тон | Golden hour, teal and orange, warm Kodak grade, desaturated, neon, monochrome, warm-cool split tone |
| Настроение | Cinematic and tense, playful and suspenseful, nostalgic, tender, whimsical, luxurious anticipation |
| Освещение | Rembrandt lighting, soft diffused, dramatic side lighting, rim light, backlight, natural sunlight, volumetric, key light from left |
| Эпоха | 1970s, 90s, vintage, retro, modern, futuristic |

---

## Функции Sora 2

### Персонажи (Characters API)
Загрузите короткое видео (2-4 сек, MP4, 720p-1080p) для создания переиспользуемого персонажа. Укажите ID и имя персонажа в промпте. Максимум 2 персонажа.

### Входное изображение (Input Reference)
Загрузите фото, арт или AI-изображение как визуальный якорь первого кадра. Размер изображения должен совпадать с целевым разрешением видео. Промпт описывает, что происходит дальше.

### Продление видео (Video Extension)
Модель использует ПОЛНЫЙ оригинальный клип как контекст (не только последний кадр). Поддерживается до 6 продлений, до 20 сек каждое, максимум 120 сек суммарно.

### Редактирование видео (Video Edit)
Точечные правки существующего видео с новым промптом. Описывайте ОДНО конкретное изменение: «same shot, switch to 85mm» или «Change the color of the monster to orange».

---

## Типичные сценарии использования

### Кинематография / Короткий метр
- Ультра-детальные промпты с объективами, освещением, цветокоррекцией
- Посекундная раскладка для точного контроля
- Characters API для консистентности персонажей между шотами
- Продление видео для длинных сцен

### Реклама / E-commerce
- 360° вращение продукта: «smooth 360-degree rotating shot, studio lighting, commercial style»
- Короткие клипы (4 сек) для максимального контроля
- Входное изображение продукта как визуальный якорь

### Документальный / Интервью
- Стилистика: «90s documentary-style», «handheld ENG camera», «16mm film»
- Естественное освещение, зерно плёнки
- Диалоги в кавычках с указанием персонажа и эмоции

### Атмосферные / Пейзажные шоты
- Establishing shots, aerial wide shots, crane shots
- Акцент на освещении (golden hour, volumetric), погоде, палитре
- Короткие промпты с творческой свободой для модели

### Музыкальные клипы
- Стилистические референсы: «shot on Kodak Vision3 500T with natural grain»
- Динамичные движения камеры: tracking, dolly zoom, crane
- Продление видео для сборки длинных секвенций

---

## Workflow для продакшена

1. **Планируйте шоты заранее** — составьте shot list до генерации
2. **Тестируйте вариации** — запускайте критичные шоты с разными промптами
3. **Правьте итеративно** — маленькие правки успешных промптов лучше полной переделки
4. **Генерируйте короткие клипы** — 4-8 секунд, монтируйте в пост-продакшене
5. **Создайте библиотеку шаблонов** — типовые шоты: вращение продукта, пейзаж, крупный план

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно: «a woman in a red coat», не «a person». Указать внешность, одежду, позу.
2. **Действие** — физические действия с конкретикой и таймингом. «Takes four steps to the window, pauses, pulls the curtain» вместо «walks across the room». Конкретные глаголы: sprinting, strolling, tiptoeing вместо «moving».
3. **Камера** — крупность плана (wide/medium/close-up) И/ИЛИ движение камеры (dolly/tracking/handheld/crane). Хотя бы одно из двух обязательно.
4. **Сцена/среда** — где происходит действие. Детали окружения: поверхности, объекты, погода.

### Бонусные элементы (значительно улучшают результат)
5. **Стиль/эстетика** — визуальный стиль, формат плёнки, эпоха, жанр. Самый мощный рычаг: «shot on 35mm film» или «Kodak Vision3 500T» вместо абстрактного «cinematic».
6. **Освещение** — конкретные источники, качество и направление. «Soft window light with warm lamp fill, cool rim from hallway» вместо «brightly lit».
7. **Цветовая палитра** — 3-5 цветовых якорей: «amber, cream, walnut brown». Критично для стабильности между кадрами.
8. **Настроение/тон** — эмоциональная атмосфера: «cinematic and tense», «nostalgic, tender».
9. **Звук/диалоги** — звуковой дизайн или хотя бы один ритмический звук. Диалоги в кавычках с указанием персонажа.
10. **Тайминг** — привязка действий к таймкодам (особенно для клипов >8 сек).

### Антипаттерны (ухудшают результат)
- **Абстрактность вместо конкретики**: «cinematic look» вместо параметров камеры и света; «beautiful» без деталей
- **Размытые действия**: «person moves quickly» — модель не знает, КАК двигается
- **Размытое освещение**: «bright», «dark» — модель не знает, ОТКУДА свет
- **Нет крупности плана**: модель не знает, как кадрировать сцену
- **Длительность/разрешение в тексте**: эти параметры игнорируются моделью, задаются ТОЛЬКО через API
- **Много сцен в одном промпте**: один промпт = один шот. Для истории — серия клипов
- **Более 2 персонажей**: модель поддерживает максимум 2 через Characters API
- **Конфликтующие стили**: реализм + мультяшность, vintage + futuristic в одном промпте
- **Слишком короткий промпт (<5 слов)**: если это не намеренный выбор для творческой свободы
- **Слишком расплывчатые глаголы**: «moving», «doing something» — использовать конкретные: sprinting, tiptoeing, gliding
- **Морфинг субъекта**: слишком сложные промпты вызывают деформацию персонажа — упрощать и разбивать на отдельные шоты
- **Проблемы с пейсингом**: не использовать темпоральные модификаторы (slowly, gradually, sudden)

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Короткий промпт может быть намеренным — для творческой свободы модели. Не штрафовать за краткость если промпт осмысленный.
- Атмосферный пейзажный шот — не требует сложных действий персонажа
- Простой продуктовый шот — не требует кинематографических объективов и плёночных форматов
- Абстрактное арт-видео — может не иметь конкретного субъекта
- Документальный стиль — намеренная «небрежность» камеры это особенность, не ошибка
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
