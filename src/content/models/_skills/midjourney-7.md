# MidJourney V7 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели MidJourney V7.
> Источники: https://blakecrosley.com/guides/midjourney, https://geekycuriosity.substack.com/p/the-complete-guide-to-midjourney-585

## Идентификация

- **model_id:** midjourney-7
- **model_name:** MidJourney V7
- **type:** image
- **platform:** midjourney.com / Discord
- **best_language:** English — V7 отлично понимает естественный английский язык. Пишите связными предложениями, а не списками ключевых слов.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Макс. длина промпта | ~6000 символов (оптимально 50–150 токенов) |
| Нативное разрешение | До 1024x1024 |
| Формат выдачи | 4 вариации на один запрос |
| Режимы | Turbo (2x стоимость), Fast (1x), Relax (включён), Draft (0.5x) |
| Соотношение сторон | Любое через --ar, по умолчанию 1:1 |
| Персонализация | Включена по умолчанию |
| Дата релиза | 3 апреля 2025 (текущая флагманская модель) |

---

## Структура хорошего промпта

V7 фундаментально изменил работу с промптами. Старый подход «keywords через запятую» активно ухудшает результат. V7 понимает естественный язык — пишите как описание для кинооператора.

### Иерархия промпта (слова в начале весят больше)

```
1. СУБЪЕКТ (кто/что)           ← Самое важное
2. ДЕТАЛИ СУБЪЕКТА (описание)
3. КОНТЕКСТ (где/когда)
4. СТИЛЬ/НАСТРОЕНИЕ
5. ТЕХНИКА (камера/освещение)
6. ПАРАМЕТРЫ (--ar, --s и т.д.) ← Тонкая настройка
```

### Шаблон

```
[СУБЪЕКТ] [ДЕТАЛИ], [КОНТЕКСТ], [СТИЛЬ/НАСТРОЕНИЕ], [ТЕХНИКА] --параметры
```

### Пример

```
An elderly fisherman with a weathered face and silver beard, standing on a wooden dock at dawn, documentary photography style, contemplative mood, shot on Leica M11 with natural morning light, soft mist rising from the water --ar 3:2 --s 100 --v 7
```

---

## Ключевые параметры V7

| Параметр | Диапазон | По умолчанию | Описание |
|----------|----------|-------------|----------|
| `--v 7` | — | 7 | Указывает версию V7 |
| `--ar` | Любое соотношение | 1:1 | Соотношение сторон |
| `--s` / `--stylize` | 0–1000 | 100 | Художественная интерпретация |
| `--c` / `--chaos` | 0–100 | 0 | Разнообразие вариаций |
| `--w` / `--weird` | 0–3000 | 0 | Экспериментальность |
| `--no` | текст | — | Негативный промпт |
| `--seed` | 0–4294967295 | случайный | Воспроизводимость |
| `--style raw` | — | выкл | Минимальная художественная обработка |
| `--p` | код или без | — | Персонализация (предпочтения пользователя) |
| `--sref [URL]` | — | — | Style Reference |
| `--sw` | 0–1000 | 100 | Вес style reference |
| `--oref` | — | — | Omni Reference (универсальная ссылка) |
| `--iw` | 0–3 | 1 | Вес изображения-референса |
| `--exp` | 0–100 | 0 | Экспериментальная детализация |
| `--tile` | — | выкл | Бесшовные паттерны |
| `--repeat` | 1–40 | 1 | Повторные генерации |
| `--q` / `--quality` | 1 | 1 | Качество (в V7 фиксированное) |

---

## Сильные стороны V7

### 1. Естественный язык
V7 понимает полные предложения. «A man walking through rain-soaked streets, his reflection shimmering in puddles» работает лучше, чем «man, rain, street, wet, reflections».

### 2. Фотореализм
Лучший фотореализм среди всех версий. Отлично работает с терминами фотографии:
- `shot on 85mm f/1.8, shallow depth of field`
- `medium format look, high dynamic range`
- `35mm film grain, slightly desaturated`

### 3. Рендеринг текста
Значительно улучшенный рендеринг текста внутри изображений (вывески, надписи, упаковка).

### 4. Анатомия людей
Драматически улучшенные руки, тела, позы и пространственные отношения.

### 5. Персонализация
Включена по умолчанию — модель учитывает профиль предпочтений пользователя.

---

## Режимы генерации

| Режим | Скорость | Стоимость | Когда использовать |
|-------|----------|-----------|-------------------|
| Draft | 10x быстрее | 0.5x | Быстрая итерация, поиск направления |
| Fast | Нормальная | 1x | Стандартный рабочий процесс |
| Turbo | Самый быстрый | 2x | Финальные рендеры с ограничением по времени |
| Relax | В очереди | Бесплатно | Экспериментирование, обучение |

**Важно:** Draft режим — мощный инструмент для итерации. Тестируйте идеи в Draft, переходите на Fast/Turbo только для финальных рендеров.

---

## Продвинутые техники

### Мульти-промпты с весами
```
cat::2 spaceship::1
```
Вес определяет баланс между концептами. Полезно для контроля композиции.

### Негативный промпт
```
--no blur, text, watermark, cluttered background
```
Указывает что исключить. Эффективен, но не абсолютен.

### Style Reference (--sref)
Переносит визуальный стиль из изображения:
```
A portrait of a young artist --sref https://example.com/style.jpg --sw 200
```
`--sw` контролирует силу влияния (выше = ближе к стилю референса).

### Omni Reference (--oref)
Универсальная ссылка на изображение для переноса содержимого и стиля (новое в V7).

### Персонализация (--p)
```
A landscape at sunset --p          # Применяет ваш профиль
A landscape at sunset --p abc123   # Применяет конкретный профиль
```
Профиль строится на основе рейтинга изображений в интерфейсе MidJourney.

---

## Описатели качества по категориям

### Освещение (самый мощный фактор)
```
"golden hour light casting long shadows across weathered stone"
"Rembrandt lighting with soft fill from camera left"
"bioluminescent glow illuminating the fog"
"soft overcast natural light"
"warm backlight creating rim lighting on the hair"
```

### Материалы и текстуры
```
"oxidized copper with verdigris patina"
"worn leather showing decades of use"
"translucent jade catching the light"
```

### Атмосфера и настроение
```
"melancholic twilight atmosphere"
"oppressive industrial ambiance"
"ethereal dreamlike quality"
```

### Камера и оптика
```
"shot on medium format, shallow depth of field"
"85mm lens, f/1.8 aperture"
"anamorphic lens flare, 2.39:1 aspect"
"35mm film photograph, Kodak Portra 400 palette"
```

---

## Типичные сценарии использования

### Фотореалистичные портреты
```
A confident businesswoman in her 40s, tailored navy suit, standing by floor-to-ceiling windows overlooking a city skyline, soft diffused daylight, shot on Canon R5 with 85mm lens, shallow depth of field --ar 4:5 --s 75 --v 7
```

### Пейзажи
```
Ancient redwood forest in morning mist, shafts of golden light filtering through canopy, ferns covering the forest floor, wide-angle composition, national geographic photography --ar 16:9 --s 150 --v 7
```

### Концепт-арт
```
A massive clockwork dragon perched atop a steampunk cathedral, gears and pistons visible through its translucent bronze skin, volumetric steam, twilight sky, concept art, detailed environment design --ar 21:9 --s 400 --v 7
```

### Продуктовая фотография
```
Minimalist product shot of a ceramic coffee mug on a light oak table, soft natural window light from the left, clean composition, editorial style --ar 1:1 --s 25 --style raw --v 7
```

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Конкретно: «elderly fisherman with a silver beard» вместо «a man».
2. **Контекст/Среда** — где находится субъект. «On a wooden dock at dawn» вместо «outside».
3. **Стиль или медиум** — фотография, иллюстрация, 3D, акварель и т.д.

### Бонусные элементы (улучшают результат)
4. **Освещение** — самый мощный фактор качества. «Golden hour light casting long shadows» вместо «nice lighting».
5. **Камера/Оптика** — объектив, глубина резкости, ракурс, тип плёнки.
6. **Настроение/Атмосфера** — эмоциональный тон: contemplative, melancholic, triumphant.
7. **Цветовая палитра** — конкретные цвета или направление: «warm autumn tones», «desaturated blues».
8. **Материалы/Текстуры** — поверхности: «weathered wood», «oxidized copper», «translucent glass».
9. **Параметры** — осмысленное использование --ar, --s, --style raw, --sref.

### Антипаттерны (ухудшают результат)
- **Спам качества** — «beautiful, stunning, 8k, detailed, masterpiece, best quality» — в V7 это бесполезный мусор, засоряющий промпт
- **Списки ключевых слов** — «mountain, fog, sunrise, epic, cinematic» вместо связного описания
- **Субъект НЕ в начале** — «beautiful cinematic photo of a woman» — стиль стоит первым, а субъект вторым
- **Противоречия** — «dark bright moody cheerful» — концепции отменяют друг друга
- **Перегрузка деталями** — больше 150 токенов ведёт к конфликтам
- **Слишком мало деталей** — менее 5 слов, модель додумает всё сама
- **Высокий --s + --style raw** — эти параметры работают в противоположных направлениях
- **Смена --ar после итераций** — композиция радикально меняется, фактически начинаете заново
- **Абстрактные формулировки** — «something cool», «nice scene» — не дают модели информации
- **Использование --cref** — в V7 параметр --cref НЕ работает (он удалён)

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Продуктовое фото не требует высокой стилизации — низкий --s + --style raw уместны
- Абстрактное искусство может не иметь конкретного субъекта — это нормально
- Аниме-промпт без --niji стоит предложить перенести на Niji 7
- Draft-режим подходит для итерации — не нужно критиковать черновые промпты за простоту
- Персонализация (--p) может компенсировать отсутствие явных стилевых описаний
- Очень короткие промпты могут быть осознанным выбором для открытой интерпретации
