# MidJourney V8.1 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели MidJourney V8.1 (Alpha).
> Источники: midjourney-8.md (база для V8), Dan Kieft v3 prompt engineer guide (V8.1 deltas, anti-bokeh stack, parameter defaults по категориям).

## Идентификация

- **model_id:** midjourney-8.1
- **model_name:** MidJourney V8.1 (Alpha)
- **type:** image
- **platform:** alpha.midjourney.com — **web only**, Discord не поддерживается.
- **best_language:** English. V8.1 интерпретирует промпт ещё более буквально, чем V8 — точность описания критична.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Макс. длина промпта | ~6000 символов (оптимально 50–150 токенов) |
| Нативное разрешение | HD по умолчанию (native 2K) — `--hd` больше не флаг, а baseline |
| Формат выдачи | 4 вариации на один запрос |
| Режимы | Fast / Relax / Mega |
| Доступ | Только alpha.midjourney.com (web) |
| UI для референсов | 3 слота: Start Frame / Image Prompts / Style References |

---

## Ключевые изменения V8 → V8.1

V8.1 — это **апгрейд V8**, не отдельный продукт. Но MidJourney удалил ряд параметров, которые работали в V8. Это критично для оценки промпта: если scorer видит удалённые флаги — это валидная ошибка.

### Удалённые параметры (НЕ ПОДДЕРЖИВАЮТСЯ в V8.1)

Подтверждено через сообщения об ошибках MidJourney:

| Параметр | Был в V8 | Что делать в V8.1 |
|----------|----------|-------------------|
| `--ow` (omni-weight) | ✅ | ❌ удалить — нет замены |
| `--no` (negatives) | ✅ | ❌ удалить — описывать позитивно («clean background» вместо «--no clutter») |
| `--p 0` (personalization off) | ✅ | ❌ удалить — персонализация управляется только через UI |

**Сообщение об ошибке от MidJourney:** `--no is not compatible with --version 8.1`

Если в промпте под V8.1 есть `--no`, `--ow` или `--p 0` — это **#1 ошибка** для немедленного флага.

### Что осталось / изменилось

- **HD теперь default.** `--hd` больше не нужен — нативное 2K включено по умолчанию. Стоимость поднялась относительно V8 base.
- **Image references — только через UI-слоты**, не параметрами. Три слота в интерфейсе: Start Frame, Image Prompts, Style References.
- **Persona-стиль** — через Style Creator в UI, не через `--p` с кодом.

### Что работает (полный список рабочих параметров V8.1)

| Параметр | Назначение |
|----------|-----------|
| `--raw` | Убирает дефолтную house-style стилизацию (полированность, тёплый glow) |
| `--s` / `--stylize` | 0–1000, дефолт 100 — сила художественной интерпретации |
| `--ar` | Соотношение сторон |
| `--c` / `--chaos` | 0–100, дефолт 0 — разнообразие вариаций |
| `--q` / `--quality` | Дополнительная когерентность |

**Всё. Других параметров в V8.1 нет.** Если промпт использует `--w`, `--exp`, `--seed`, `--sref`, `--sw`, `--style raw`, `--style cute` и т.п. — проверяй официальную документацию V8.1; часть из них могла остаться, часть — нет. Безопасный набор: `--raw --s --ar --c --q`.

---

## Параметр-дефолты по категориям (Dan Kieft v3)

Готовые комбинации параметров, сгруппированные по типичным сценариям. Используй их как baseline; пользователь может тюнить.

| Категория | Параметры |
|-----------|-----------|
| Photorealism / documentary / cinematic action | `--raw --s 100 --ar 16:9` |
| Editorial portraits / fashion | `--s 100 --ar 16:9` (без `--raw`) |
| Stylized illustration / anime / cyberpunk | `--s 250 --ar 16:9` (без `--raw`) |
| Movie posters | `--s 250 --ar 2:3` (без `--raw`) |
| Fantasy character close-ups (grounded) | `--raw --s 100 --ar 16:9` |
| Fantasy character close-ups (stylized) | `--s 250 --ar 16:9` (без `--raw`) |

**Дефолт `--ar`:** 16:9, кроме movie posters (2:3) и явных запросов пользователя на иной формат.

### Что делает `--raw`

Отключает дефолтную house-style стилизацию MidJourney — повышенный контраст, тёплая color grade, «полированный красивый» рендер. Делает результат более нейтральным и **prompt-faithful**.

- **Использовать `--raw` для:** photorealism, documentary, продуктовой съёмки, любых задач, где промпт должен доминировать над стилем модели.
- **НЕ использовать `--raw` для:** stylized illustration, fantasy art, editorial fashion, movie posters — категорий, которые выигрывают от house-style.

### Что делает `--s` (stylize)

Контролирует, насколько сильно MidJourney тянет результат к «красивому художественному».

- `--s 100` (default): сбалансировано.
- `--s 250`: заметно более стилизованно, хорошо для иллюстраций.
- `--s 500–750`: максимальная художественная интерпретация, начинает дрейфовать от промпта.

---

## Bokeh bias и anti-bokeh stack

V8.1 имеет **сильный baked-in bokeh** — модель почти всегда добавляет шallow depth of field на close-up'ах. Для документального / iPhone-реализма это убивает аутентичность.

**Реальность:** у iPhone маленький сенсор → естественно глубокая depth of field. На iPhone **нет настоящего bokeh** (Portrait Mode — это софтверная подделка). Поэтому для iPhone-style realism нужно эксплицитно гасить bokeh.

### Anti-bokeh stack (стакать 3–4 фразы для V8.1)

- `Deep focus, sharp from foreground to background.`
- `No blur, no bokeh, no depth-of-field separation.`
- `Shot on 24mm lens at f/11.`
- `Natural deep depth of field of an iPhone.`
- `Hyperfocal deep focus, sharp throughout entire frame.`

Для V8.1 нужно **3–4 такие фразы одновременно**, потому что одной модель проигнорирует. Это сильнее, чем в V8.

### Критическое исключение: action cinema bokeh = ПРАВИЛЬНО

В **action film stills** (battle scenes, charging POV, mid-combat) shallow depth of field на герое с soft chaos позади — это **как настоящее prestige-кино снимает эти сцены** (Last Samurai, Gladiator, Pelennor Fields, Red Cliff). Это не баг — это намеренная кинематография:

- Направляет глаз на subject действия.
- Продаёт хаос через soft motion позади.
- Отделяет protagonist от threat.
- Воспроизводит aesthetic настоящей военной фотографии.

**Не борись с bokeh в action cinema. Борись с bokeh в static realism.**

Если оцениваешь промпт для боевой сцены и видишь anti-bokeh stack — это валидное замечание: убрать, потому что в этом жанре shallow DoF корректен.

---

## Структура хорошего промпта

V8.1 вознаграждает **связные cinematic-описания**, а не списки тегов.

### Главные правила

1. **Указывай освещение ЯВНО.** V8.1 не добавит интересный свет автоматически.
2. **Пиши связными описаниями.** Не «mountain, fog, sunrise, epic», а «A snow-capped mountain emerging from fog at sunrise, dramatic warm light on the peaks».
3. **Добавляй камеру и оптику.** V8.1 отлично реагирует на фотографическую терминологию: «85mm f/1.4», «medium format», «24mm wide-angle».
4. **Фиксируй `--ar` с самого начала.** Смена соотношения сторон = генерация с нуля.

### Структура параграфа (Dan Kieft v3, для cinematic-промптов)

Один параграф 60–140 слов, читается как режиссёр описывает кадр оператору. Порядок элементов:

1. **Shot type + subject** — «Candid iPhone close-up of a woman in her 20s…»
2. **Specific physical details** — что делает её *именно ею*, а не generic «woman».
3. **Wardrobe + props** — материалы, состояние, износ.
4. **Action / expression** — конкретный момент, который ловим.
5. **Camera angle and lens feel** — один короткий технический якорь.
6. **Light + setting** — источник, направление, атмосфера.
7. **Finishing texture** — skin / grain / realism cue в конце.

После промпта — отдельный code block с параметрами V8.1 (см. таблицу дефолтов выше).

---

## Length variants

Не каждый промпт должен быть 120 слов. Длина зависит от задачи.

| Вариант | Длина | Когда использовать |
|---------|-------|---------------------|
| Minimal | 10–40 слов | «Intelligence test» — сравнить как модели интерпретируют sparse промпт |
| Short | 30–60 слов | Простые атмосферные кадры, single subject, чистое окружение |
| Standard | 60–140 слов | Дефолт. Конкретный субъект, defined emotion, ясное окружение |
| Multi-Reference | 140–250 слов | Только когда загружено 8+ референсов — описание превращается в *размещение* |

**Не padding.** Если промпт работает в 70 словах — не растягивай его до 120. Длина — это инструмент, не самоцель.

---

## Bokeh stack vs cinematic bokeh — таблица решения

Чтобы валидатор не путал ситуации:

| Тип сцены | Bokeh правильный? | Что писать |
|-----------|-------------------|------------|
| iPhone selfie / candid | ❌ | Anti-bokeh stack (3–4 фразы) |
| Documentary realism | ❌ | Anti-bokeh stack |
| Editorial portrait (DSLR look) | ✅ | Можно `shallow DOF, 85mm f/1.4` |
| Cinematic action / battle | ✅ | Soft chaos behind, hero in focus — норма |
| Product photography (изоляция) | ✅ | `shallow DOF` для разделения с фоном |
| Macro / extreme close-up | ✅ | Естественно shallow DOF на этой дистанции |
| Wide establishing shot | ❌ | Everything sharp, deep focus |

---

## Multi-reference rules (8+ ref)

Когда в UI-слотах загружено 8+ референсов (через Image Prompts + Style References), правила меняются:

1. **Ссылайся на референс, не переописывай его.** «He wears the field jacket from the reference», а не «an olive green canvas field jacket with leather collar and four utility pockets».
2. **Назначай каждому референсу место.** «The camera hangs in his right hand. The bag is across his shoulder. The compass clipped to his belt.» Каждый референс — это слот в сцене.
3. **Избегай clutter language.** Не пытайся «оправдать» каждый референс художественным языком — пусть размещения будут matter-of-fact.
4. **Выбрасывай референсы без testable value.** Если не можешь чётко поместить референс в сцену, модель его всё равно проигнорирует.
5. **На 12+ референсах ожидай частичный провал.** Спланируй так, чтобы 2–3 самых важных референса легли чисто, не пытаясь сделать все 14 идеально.

---

## Common prompt patterns (готовые анкеры)

### Photorealistic selfie / iPhone style
- Лидируй с «iPhone selfie photograph» или «candid iPhone shot».
- Front camera perspective, slight elevated angle.
- «Natural deep depth of field of an iPhone front camera».
- «Raw unfiltered iPhone photography aesthetic».
- **Пропусти** cinematic camera/lens references — они тянут к DSLR-looku.

### Cinematic action (battle, POV, mid-charge)
- Лидируй с «Cinematic film still» или «Action POV shot».
- Укажи момент: «mid-charge», «moments before impact», «the exact second of».
- Включи атмосферу: dust, fog, light shafts, motion.
- Якорь к prestige-фильмам: «Zhang Yimou cinematography», «Pelennor Fields meets Red Cliff».
- Разреши shallow DoF на герое — здесь это правильно.

### Documentary realism (борьба со стилизацией V8.1)
- Лидируй с «Documentary-style photograph» или «captured by a real combat photographer».
- Заменяй artistic-effect язык на natural-reality.
- «Natural early morning sunlight from the side» вместо «golden hour rim lighting».
- Эксплицитные негативные cue в конце: «no painterly look, no fantasy aesthetic, no concept art, no movie poster look».
- Якорь к реальной фотографии: «looks like a real news photograph».

### Stylized illustration / anime / cyberpunk
- Лидируй с «Stylized [genre] illustration in the visual style of [reference shows]».
- Якорь к актуальной prestige-анимации: Arcane, Cyberpunk Edgerunners, Blade Runner Black Lotus.
- «Painterly digital illustration with visible brush stroke texture».
- «Anime-stylized proportions with slightly larger expressive eyes».
- Финал: «stylized illustration not photorealism, no photographic look».
- Параметры: `--s 250` (без `--raw`).

### Movie posters
- Лидируй с «Cinematic [genre] movie poster artwork, vertical composition».
- Negative space: «significant negative space at top for poster typography».
- Если с текстом — указать позицию (top tagline, bottom title).
- Если без — «No text, no titles, no logos, just the artwork».
- Параметры: `--s 250 --ar 2:3`.

### Mixed media (cartoon + realism)
- Strict character description для cartoon: «Flat 2D cartoon X with bold black outlines and cel-shaded coloring».
- Strict realism для environment: «hyper-realistic detail» повторить.
- Эксплицитно: «the deliberate visual contrast between the flat cartoon character and the photorealistic real world».

### YouTube thumbnails
- «High-impact realistic YouTube thumbnail».
- Лицо — конкретная эмоция: «wide-eyed urgent fear, mouth slightly open mid-gasp».
- Story props видны.
- Конкретный текст: 1–3 слова, шрифт, позиция.
- Cinematic high-contrast lighting.

### Horror movie posters
- Restraint — не показывай монстра напрямую.
- Якорь к Mondo / A24 эстетике.
- Single iconic image с negative space.
- «Implied horror, second-look reveals».
- Cool desaturated palette с одним warm-акцентом.

---

## Camera Angles Reference

| Угол | Эффект |
|------|--------|
| Eye-level | Нейтральный, candid, documentary |
| Low angle (looking up) | Сила, доминирование, intimidation |
| High angle (looking down) | Уязвимость, smallness, observation |
| Dutch tilt | Напряжение, нестабильность |
| Worm's eye / ground level | Found-frame, hiding, child POV |
| Over-the-shoulder | Связь, разговор, character investment |
| First-person POV | Immersion, viewer = персонаж |
| Wide establishing | Масштаб, world-building |
| Macro / extreme close-up | Intimacy, текстура, изолированная деталь |

---

## Style Dictionary

| Категория | Ключевые слова |
|-----------|----------------|
| Качество | photorealistic, native 2K, crisp detail, prompt-faithful |
| Камера | 24mm, 35mm, 50mm, 85mm f/1.4, medium format, iPhone front camera |
| Освещение | golden hour, harsh midday, moody blue night, overcast soft, rim light, motivated practical |
| Текстуры | film grain, skin pores, fabric weave, weathered, hyper-detail |
| Настроение | candid, editorial, cinematic, documentary, nostalgic, ominous |
| Жанровые якоря | A24 horror, Mondo poster, Pelennor Fields, Zhang Yimou, Arcane, Cyberpunk Edgerunners |
| Параметры | `--raw`, `--s 100/250`, `--ar 16:9/2:3`, `--c 0–25` |

---

## Слабости V8.1

V8.1 — мощная модель, но не универсальная. Будь честен с пользователем:

- **Text rendering** — V8.1 заметно слабее GPT Image 2 и Nano Banana Pro. Длинные надписи, инфографика, мульти-language → рекомендуй другую модель.
- **IP / celebrity faces** — намеренно блокируется или искажается. Не воспроизводит конкретных публичных персон.
- **Multi-detail compliance** — больше 5–6 точных требований за один промпт = часть будет проигнорирована. Итерируй вместо overload.
- **Documentary realism** — несмотря на `--raw`, модель борется против сухого репортажного looka. Стакай anti-bokeh + anti-style cue.
- **UI mockups / infographics** — не для этого. GPT Image 2 или Nano Banana Pro.
- **Counting > 3** — ломается на «pile of 7 apples», «5 windows», и т.п. Для prompt-adherence-тестов это известное ограничение.

---

## Типичные сценарии использования

### Фотореалистичный портрет
```
Editorial portrait of a middle-aged man with weathered skin and kind eyes, wearing a worn denim jacket, standing in a doorway of an old bookshop, soft afternoon light from a nearby window casting warm shadows across his face, shot on an 85mm lens f/1.8, shallow depth of field, photorealistic editorial photography.
```
```
--s 100 --ar 4:5
```

### iPhone selfie (anti-bokeh)
```
iPhone selfie photograph of a young woman in her early 20s sitting on a bench in a busy New York City subway station, holding her iPhone at arm's length. Front camera perspective, slightly elevated angle. She wears a soft pink leotard and ballet slippers, dark hair in a tight bun. Around her, the busy NYC subway, white tile walls, fluorescent overhead lighting. The natural deep depth of field of an iPhone front camera, everything in sharp clear focus, no blur or bokeh, no portrait mode effect. Hyper-realistic skin texture, raw unfiltered iPhone photography aesthetic.
```
```
--raw --s 100 --ar 16:9
```

### Stylized cyberpunk illustration
```
Stylized anime cyberpunk illustration in the visual style of Arcane, Cyberpunk Edgerunners, and Blade Runner Black Lotus, mid-shot of a stylish cyberpunk woman leaning against a graffiti-covered wall in a narrow rain-soaked neon alleyway, smoking a cigarette with a contemplative expression. Long straight white hair with blunt bangs, sharp angular jawline, large striking cyan eyes. Neon-lit skyscrapers, wet pavement reflecting saturated red and pink neon glow. Painterly digital illustration with visible brush strokes, anime-stylized proportions.
```
```
--s 250 --ar 16:9
```

### Horror movie poster (vertical)
```
Cinematic horror movie poster artwork, vertical composition, a small girl about seven years old walking slowly forward down the middle of an enormous long empty hallway of an old turn-of-the-century gothic mansion, viewed from far behind her at floor level. She wears a long pale Victorian-era white nightgown, dragging a worn old teddy bear. The hallway stretches into deep darkness with peeling wallpaper, dust motes in pale window light. At the very far end, a tall thin shadowy figure stands watching her. Cool desaturated palette, the look of a prestige A24 horror poster. Significant negative space at top for typography.
```
```
--s 250 --ar 2:3
```

---

## Критерии оценки промпта (для AI-валидатора)

### Обязательные элементы

1. **Субъект** — конкретный, в начале промпта. V8.1 весит первые слова сильнее.
2. **Освещение** — КРИТИЧНО. Без явного указания результат будет технически точным, но плоским.
3. **Контекст / среда** — где находится субъект.
4. **Параметры в конце** — корректный набор из рабочего списка `--raw --s --ar --c --q`.

### Бонусные элементы

5. **Камера / оптика** — V8.1 вознаграждает фотографические термины.
6. **Стиль / настроение** — V8.1 не добавит автоматически.
7. **Цветовая палитра** — конкретное направление: «warm autumn tones», «teal and orange».
8. **Texture cue** — film grain, skin pores, fabric weave.
9. **Корректный `--ar`** — 16:9 default, 2:3 для постеров.
10. **Length под задачу** — не padding, не sparse.

### Антипаттерны (немедленный флаг для V8.1)

- ❌ **`--no` в промпте** — не поддерживается V8.1. Заменить на позитивное описание.
- ❌ **`--ow` в промпте** — удалён. Описывать без omni-weight.
- ❌ **`--p 0`** — удалён. Персонализация только через UI.
- ❌ **`--hd`** — теперь default, флаг не нужен.
- ❌ **Tag-soup стиль** — список слов через запятую без связного предложения.
- ❌ **Отсутствие освещения** — главная причина «плоских» V8.1 результатов.
- ❌ **«beautiful, stunning, 8k, detailed, masterpiece»** — quality-spam, который V8.1 игнорирует.
- ❌ **Bokeh в iPhone/documentary** — стакать anti-bokeh stack.
- ❌ **Anti-bokeh в action-сценах** — здесь shallow DoF корректен.
- ❌ **Параметры через Discord-синтаксис (`::`, `[prompt:weight]`)** — не работают в V8.1, web-only.

### Контекстная оценка

- V8.1 — Alpha. Поведение может меняться. Будь честен про experimental status.
- Для photorealism: `--raw --s 100` — лучший baseline. Без `--raw` модель добавляет polished glow.
- Для stylized: `--s 250` без `--raw` — sweet spot.
- Если пользователь скопировал промпт из V7 / V8 — главный апгрейд для V8.1: убрать удалённые флаги (`--no`, `--ow`, `--p 0`).
- Honest critique: если задача — text-heavy инфографика, скажи что V8.1 не оптимален и предложи GPT Image 2.

### Язык промпта

**English — предпочтительный язык для V8.1.**

- Промпт на английском — норма и лучший выбор. Никогда не выдавать замечание о языке если промпт на английском.
- Промпт на русском — работает, но качество ниже. Можно упомянуть как neutral-замечание.
- ЗАПРЕЩЕНО: давать замечание «Промпт на английском» или советовать перевести на русский. Русский — не предпочтительный язык для этой модели.
