# Happy Horse 1.0 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Happy Horse 1.0 (快乐小马) от Alibaba ATH AI Innovation Unit.
> Источники: https://fal.ai/learn/tools/prompting-happy-horse, https://morphic.com/resources/how-to/happy-horse-1-0-complete-guide-prompts-features-tips, https://www.glbgpt.com/resources/happy-horse-1-0-prompt-guide/

## Идентификация

- **model_id:** happy-horse
- **model_name:** Happy Horse 1.0
- **type:** video
- **platform:** Alibaba ATH (open source), доступна на fal.ai, Morphic, Mobi и других хостингах
- **best_language:** English (английская проза даёт лучший результат). Mandarin и другие языки в тестах работают хуже на визуал, но допустимы для DIALOGUE-блоков с lip-sync

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Архитектура | Unified single-stream Transformer, 15B параметров, 40 слоёв, DMD-2 distillation (8 шагов) |
| Тип генерации | Text-to-Video (T2V), Image-to-Video (I2V) — оба из одних и тех же весов |
| Длительность | 5–8 секунд по умолчанию; до 12 сек на Lite, до 15 сек на платном уровне |
| Разрешение | Нативно 1080p HD (без апскейла) |
| Соотношения сторон | 16:9, 9:16, 4:3, 21:9, 1:1 |
| Время генерации | ~10 секунд в среднем; ~38 сек для 1080p на NVIDIA H100; ~2 сек для 5-сек 256p превью |
| Joint audio-video | Видео и звук генерируются в **одном forward pass** — синхронизированы по умолчанию |
| Lip-sync языки | 7: English, Mandarin, Cantonese, Japanese, Korean, German, French (ультра-низкий WER) |
| Multimodal входы | До 12: текст + reference images + reference videos + audio references |
| Лицензия | Open source (база, distilled-модель, super-resolution module, inference code) |
| Бенчмарки | #1 на Artificial Analysis Video Arena (T2V Elo 1333, I2V Elo 1392) |

---

## Структура хорошего промпта

### Default-шаблон (≈20 слов — закрывает 80% задач)

```
[Subject] [does action] in [setting], [time of day], [one atmosphere or camera cue].
```

Примеры, которые попали в длину и сработали:
- "A young woman in a red coat walks down a wet city street at night, neon reflections."
- "A 1965 cherry-red Mustang convertible drives along a winding California coastal highway at midday."
- "An orange tabby cat coiled on a velvet sofa leaps to a tall oak bookshelf."

### Золотое правило: brevity wins

Happy Horse — модель с конечным «бюджетом внимания». Каждое лишнее слово отнимает мощность у рендеринга. Длинные промпты буквально **ухудшают** результат: лица плывут к усреднённому образу, кисти теряют геометрию, походка уплощается. ~20 слов — это золотая середина.

Длинный промпт оправдан **в одном случае**: когда кадр опирается на язык камеры (Steadicam push, slow dolly-in, helicopter aerial). Тогда камерный cue лучше ставить **в конце** — он получает максимальный вес.

### Каждый клип = самодостаточная сцена

AI-видео модели не помнят, что было в предыдущих клипах. Каждый промпт должен содержать всё, что нужно для конкретного кадра. Не полагайтесь на «контекст из предыдущей генерации».

---

## Структуры для длинных промптов

### Shot list with timecodes (для multi-beat кадров)

Лучший результат на сложных, многобитовых сценах. Каждое beat помечается типом плана и временным окном:

```
Shot 1 (wide establishing, 0-1s): The camera pulls into the rain-slicked
Manhattan side street at night; neon storefront signs glow on both sides.

Shot 2 (mid tracking, 1-4s): The young woman in the deep crimson wool peacoat
enters frame from the right, walking briskly away from camera. The camera
tracks alongside her at her pace; warm amber backlight skims her shoulder.

Shot 3 (slow push-in close, 4-5s): A slow dolly-in onto her face. Her breath
is visible in the cold air, calm expression, raindrops in her hair.
```

В тестах fal.ai shot-list с таймкодами разводит beat'ы корректно, а та же сцена в виде сплошной прозы коллапсирует в одно размытое движение.

### Markdown sections (для одного непрерывного дубля с множеством осей)

Когда нужно контролировать сразу subject / action / setting / camera / lighting / mood — секции лучше прозы:

```
## Subject
A young woman in her late twenties wearing a deep crimson wool peacoat.

## Action
Walks briskly down a rain-slicked Manhattan side street, breath visible.

## Setting
Manhattan side street at night, neon signs, shallow puddles.

## Camera
Steady tracking shot, 35mm telephoto, shallow depth of field.

## Lighting
Warm amber backlight, cool blue ambient, neon reflections in puddles.

## Mood
Cinematic, intimate, contemplative.
```

Использовать **только** когда есть контент для большинства секций. Пустые заголовки вредят. Если у вас только субъект и камерный cue — пишите 20 слов и не накручивайте.

### Что НЕ работает для Happy Horse

- **Booru-теги** (запятые с ключевиками без предложений) — заметно проигрывают английской прозе.
- **JSON-объекты** — на этой модели проигрывают тексту.
- **Weighted parentheses** `(keyword:1.2)` — синтаксис Stable Diffusion не работает.
- **Mandarin-промпты для визуала** — даже несмотря на китайское происхождение, английский даёт лучший визуал. Mandarin использовать только в DIALOGUE-блоке для китайского lip-sync.

---

## Сильные стороны модели (используйте их)

### Камерные движения
Happy Horse необычно хорошо понимает английскую камерную лексику:
- Steadicam push, slow dolly-in, lateral orbit with parallax
- Helicopter aerial, locked-off framing under wind
- Side tracking, slow push-in, crane shot
**Совет:** камерный cue — в конец промпта.

### Атмосферное освещение
Сильные рецепты, которые модель чисто отдаёт:
- Blue hour alley, neon noir with mist and puddle reflections
- Single hard top-down key with deep falloff
- Warm amber backlight + cool blue ambient
- Sodium vapor street lamps

### Машины, металл, хром
Отражения и металлические покрытия рендерятся чисто — продуктовые шоты с автомобилями, винтаж, tech.

### Ткани и волосы на ветру
Плащи, флаги, волосы на ветру — secondary motion удерживается всю длительность, если ткань является главным субъектом.

### Огонь и искры
Пламя с правильной теплотой, искры по реальным дугам в небо. Если кадр уходит на orbit/rising camera, костёр визуально «уменьшается» — это камера, а не модель.

### Joint audio-video
Звук генерируется параллельно с видео в одном проходе. Управляйте звуком через текст: «dialogue in English: '...'», «ambient: distant traffic», «Foley: footsteps on gravel». Если звук не описан — модель сделает по визуальной логике.

---

## Anti-slop правила: слова, которые тянут результат вниз

Слова, которые **выкинуть из лексикона**:
- beautiful, stunning, amazing, gorgeous
- masterpiece, epic, breathtaking
- insane detail, ultra detailed, hyperrealistic

Слова, которые **окупаются** вместо них:
- "overcast daylight, wet asphalt"
- "neon pink and cyan reflections in puddles"
- "warm amber backlight on her shoulder"
- "35mm telephoto, shallow depth of field"
- "single hard top-down key, deep falloff to black"
- "sodium vapor street lamps, mid-afternoon sun on chrome"

### Стак синонимов не помогает
"Crimson, scarlet, ruby, deep red" не выкручивает насыщенность. Один цвет — и идём дальше.

### Имена режиссёров/операторов почти не работают
"Roger Deakins cinematography" сама по себе почти не сдвигает результат. Лучше описать **техникой**: «backlit silhouette, soft natural haze, restrained cool desaturated palette, slow tracking dolly behind».

### Большинство негативных cue — пустые слова
"No camera shake" не помогает, если модель и так не добавляет shake. "No people in frame" имеет смысл только когда есть реальный риск появления человека. Каждый негатив должен закрывать конкретный риск, иначе он съедает токены.

---

## Эмоция должна стать видимым движением

Это критичное правило. Happy Horse не понимает эмоцию как абстракцию.

- **Плохо:** «sad woman thinking about her past»
- **Хорошо:** «close-up of a young woman standing still, soft wind moving her hair, neutral expression, slow blink, shallow depth of field»

Эмоция переводится в физические детали: микро-выражения, направление взгляда, темп дыхания, паузы.

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|----------------|
| Тип плана | wide establishing, medium, close-up, extreme close-up, two-shot |
| Движение | steadicam push, slow dolly-in, lateral orbit, helicopter aerial, locked-off, side tracking |
| Спецприёмы | parallax orbit, crane shot, low-angle wide, macro close-up |
| Линза | 35mm telephoto, 50mm, 85mm, wide-angle, anamorphic |
| Глубина | shallow depth of field, deep focus, soft bokeh background |

## Словарь освещения

| Категория | Ключевые слова |
|-----------|----------------|
| Время суток | blue hour, golden hour, mid-afternoon, overcast daylight |
| Технические | hard top-down key, deep falloff, warm amber backlight, cool blue ambient |
| Источники | sodium vapor street lamps, neon pink and cyan, candlelight, single practical |
| Атмосфера | wet asphalt reflections, mist, dust particles in light beams, soft natural haze |

## Словарь стилей

| Категория | Ключевые слова |
|-----------|----------------|
| Жанр | cinematic, documentary, editorial, music video, commercial spot |
| Тон | neon noir, naturalistic, restrained palette, desaturated, warm grade |
| Эстетика | 1990s film stock, modern digital, anamorphic, handheld vérité |

---

## Типичные сценарии использования

### TikTok / Reels / Shorts (вертикальный формат)
- Соотношение 9:16, 5–8 секунд
- Hook + один сильный визуальный момент
- Camera cue в конце промпта (zoom in, push, swing)

### Реклама / продуктовые шоты
- 1965 Mustang, продукт на вращении, B-roll с хромом и отражениями
- Сильная сторона модели — рендеринг металлических поверхностей
- I2V-режим: загрузить product still + промпт на движение

### Концепт-кадры и кинематографические сцены
- Steadicam через дождливый переулок
- Helicopter aerial над побережьем
- Locked-off frame с движением субъекта

### Диалоговые сцены с lip-sync
- Один из 7 поддерживаемых языков (English / Mandarin / Cantonese / Japanese / Korean / German / French)
- В промпте: `dialogue in [язык]: "..."`
- Joint audio-video синхронизирует речь и движение губ автоматически

### Раскадровки (3-shot структура)
- Shot list с таймкодами для 3 beat'ов
- Каждый beat = свой план + действие + время
- Хорошо для рекламных хуков с поворотом

### B-roll и атмосферные пейзажи
- Огонь, ветер, ткань — сильные стороны модели
- Атмосферные lighting recipes окупаются

---

## Критерии оценки промпта (для AI-валидатора)

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно, без хеджирующих эпитетов.
2. **Действие** — физическое глагольное действие (walks, drives, leaps), не абстракция.
3. **Сеттинг** — где происходит. Конкретное место и время суток.
4. **Один камерный или атмосферный cue** — telephoto / tracking / neon reflections / golden hour.

### Важные элементы (улучшают результат)
5. **Английский язык промпта** — модель Alibaba, но английский даёт лучший визуал. Mandarin — только в DIALOGUE.
6. **Камерный cue в конце промпта** (для камерных кадров) — там он получает максимальный вес.
7. **Звук и диалоги** — `ambient: ...`, `dialogue in [lang]: "..."` — задействует joint audio-video.
8. **Ровно ~20 слов** для simple shots. Длиннее — только если оправдано камерой или multi-beat.
9. **Shot list с таймкодами** для multi-beat сцен (3 beat'а в 5-сек ролике — окей).
10. **Markdown секции** для single-take с множеством осей (subject / action / camera / lighting).

### Бонусные элементы
11. **Соотношение сторон** — 16:9, 9:16 (для соцсетей), 21:9 (cinema).
12. **Lip-sync язык в DIALOGUE-блоке** — указание языка для синхронизации губ.
13. **Reference image / video / audio** — для I2V или style consistency (до 12 multimodal входов).
14. **Конкретные технические термины освещения** вместо имён режиссёров.

### Антипаттерны (ухудшают результат)
- **Слишком длинный промпт** (>50–60 слов) для простой сцены — лица плывут, движение уплощается. Главный антипаттерн модели.
- **Эпитеты-хеджи** (beautiful, stunning, masterpiece, ultra detailed, hyperrealistic) — съедают токенный бюджет, тянут к average-look.
- **Стак синонимов цвета или прилагательных** — не усиливает эффект, занимает место.
- **Имя режиссёра без техник** («shot like Roger Deakins») — почти не работает в одиночку.
- **Лишние негативные cue** («no camera shake», «no blur») когда нет реального риска — выкинуть.
- **Booru-теги, JSON, weighted parentheses** — английская проза работает лучше.
- **Mandarin для визуала** — английский даёт лучший рендеринг, даже на китайской модели.
- **Эмоция как абстракция** («sad woman», «happy moment») вместо физических деталей (slow blink, soft smile, hand to chest).
- **Сторителлинг-проза** вместо production notes — модель не понимает повествование, она исполняет инструкции.
- **Опора на «контекст предыдущего клипа»** — каждая генерация самодостаточна.
- **Запрос длительности больше лимита** — макс 8 сек на standard, 15 сек на платном.
- **Конфликтующие камерные движения одновременно** (zoom + pan + orbit) — модель путается.

### Специфика Alibaba-модели
- **Brevity wins** — главное правило. ~20 слов на простой кадр.
- **Camera cue в конце** — порядок имеет значение, последнее слово получает вес.
- **Joint audio-video** — звук «бесплатный», описывайте его текстом.
- **7 языков для lip-sync** — указывать язык в промпте: `dialogue in Korean: "..."`.
- **Open source** — модель можно крутить локально, что снимает многие ограничения платформы.
- **Strong: камера, атмосфера, металл, ткань, огонь.** Weak: длинные human action sequences с лицами в фокусе.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- 5-сек продуктовый спин не требует shot-list с таймкодами — короткий промпт даже выгоднее
- Атмосферный B-roll может быть валиден без явного субъекта-человека
- Диалоговая сцена оценивается по DIALOGUE-блоку и языку, а не по фотографическому языку
- Для I2V-промпта (с референс-картинкой) описание визуала менее критично — нужно описать **движение**, а не пере-описать картинку
- Vertical TikTok-формат не требует cinema-уровня композиции
- Не штрафовать за короткий промпт, если он попадает в default 20-слов шаблон — это сильная сторона модели
- Не требовать stuff'инга деталями — Happy Horse наказывает за это
- Оценка должна учитывать тип кадра и платформу публикации, а не слепо проверять «есть ли все элементы»
