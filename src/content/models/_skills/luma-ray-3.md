# Luma Ray 3 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для моделей Luma Ray 3, Ray 3 Reasoning и Ray 3.14.
> Источники: https://lumalabs.ai/learning-center/articles/luma-video-models-field-guide, https://www.capcut.com/resource/luma-ray-3, https://lumaai-help.freshdesk.com/support/solutions/articles/151000214865

## Идентификация

- **model_id:** luma-ray-3
- **model_name:** Luma Ray 3 / Ray 3.14 / Ray 3 Reasoning
- **type:** video
- **platform:** Luma Dream Machine, Adobe Firefly (интеграция)
- **best_language:** English. Модели Ray 3 оптимизированы под английские промпты с кинематографической терминологией.

---

## Ограничения платформы

| Параметр | Ray 3.14 | Ray 3 |
|----------|----------|-------|
| Длительность T2V | 5с или 10с | 5с или 10с |
| Длительность I2V | 5с | 5с |
| Длительность Modify | до 18с | до 18с |
| Extend | до ~30с суммарно | до ~30с суммарно |
| Разрешение | Draft, 540p, 720p, 1080p (нативное) | 720p, 1080p |
| HDR | Да — 16-bit HDR с расширенным динамическим диапазоном | Да |
| EXR экспорт | Да (540p и 720p) — для профессионального цветокора | Да |
| Соотношения сторон | 9:16, 3:4, 1:1, 4:3, 16:9, 21:9 | 9:16, 3:4, 1:1, 4:3, 16:9, 21:9 |
| Keyframes | Start frame + End frame | Start frame + End frame |
| Loop | Да — бесшовная петля | Да |
| Character Reference | Нет | Да — сохранение идентичности персонажа |
| Draft Mode | Нет | Да — 5-10x быстрее и дешевле |
| Visual Annotation | Да — рисование инструкций прямо на кадре | Да |
| Аудио | Генерация аудио в поддерживаемых интерфейсах | Генерация аудио в поддерживаемых интерфейсах |

---

## О моделях

### Ray 3.14
**Рабочая лошадка** — самая быстрая модель в линейке Luma. Рекомендуется как default для 90% задач. Нативное 1080p, HDR, EXR экспорт. Отличное кинематографическое качество: плёночное освещение, стабильная камера, убедительное движение.

### Ray 3 (Reasoning)
Первая мультимодальная «рассуждающая» модель генерации видео. Ray 3 разбивает сложные креативные задания на шаги — как режиссёр, планирующий раскадровку. Умеет оценивать и уточнять собственные результаты для логической согласованности.

**Уникальные возможности Ray 3:**
- **Character Reference** — загрузка референсного изображения персонажа для сохранения идентичности через T2V, I2V, V2V и Reference Mode
- **Draft Mode** — генерация в 5-10x быстрее и дешевле для итерации идей
- **16-bit HDR** — нативный расширенный динамический диапазон для студийного качества
- **Visual Annotation** — рисование инструкций прямо на стартовом кадре для точного управления движением
- **Сложные экшн-сцены** — боевые сцены, физические симуляции, динамика толпы, многоступенчатые события

### Когда Ray 3, а когда Ray 3.14?
- **Ray 3.14** — для 90% задач: быстрый, высокое качество, нативное 1080p
- **Ray 3** — когда нужна идентичность персонажа через несколько шотов (Character Reference), быстрая итерация (Draft Mode), или интенсивное сложное движение

---

## Структура хорошего промпта

Оптимальная структура промпта для Ray 3:

```
[Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood]
```

Ray 3 — «positive only» модель. Негативные промпты контрпродуктивны. Описывайте то, что ХОТИТЕ видеть.

---

## Режимы генерации

### 1. Text-to-Video (Describe)
Генерация видео из текстового описания.
- Формула: `[Субъект] + [Действие в процессе] + [Среда] + [Вторичное движение] + [Камера] + [Свет/Настроение]`
- Пример: «Dancer spinning on a rooftop at sunset, dress billowing outward, hair flowing, city lights glowing in background, camera orbiting slowly.»

### 2. Image-to-Video (Keyframe)
Анимация изображений или переход между start/end keyframes.
- Start frame + End frame (5-й кадр/120-й кадр)
- Соотношение сторон берётся из загруженного изображения
- Описывайте ТОЛЬКО то, что МЕНЯЕТСЯ между кадрами

### 3. Character Reference (только Ray 3)
Сохранение идентичности персонажа через несколько генераций.
- Загружается референсное изображение персонажа
- Промпт описывает СЦЕНУ и ДЕЙСТВИЕ — референс обеспечивает внешность
- НЕ нужно описывать внешность персонажа повторно — это делает референсное изображение
- Работает в T2V, I2V, V2V и Reference Mode
- Лучший результат с чёткими, хорошо освещёнными фото лица и ключевых черт

### 4. Modify (Video-to-Video)
Трансформация существующего видео по промпту.
- **Adhere (1-3)**: сохранение оригинала, минимальные изменения
- **Flex (1-3)**: баланс между оригиналом и трансформацией
- **Reimagine (1-3)**: творческая свобода, значительные изменения
- Критическое правило: описывайте КОНЕЧНОЕ СОСТОЯНИЕ, не команды
- Нет временного языка — не «changes to», не «transforms into»
- Только позитивные описания — «clear blue sky», не «no clouds»

### 5. Draft Mode (только Ray 3)
Быстрая генерация в низком разрешении для итерации.
- 5-10x быстрее и дешевле
- Для тестирования идей и вариаций
- Финальный рендер — на стандартном режиме в 1080p

### 6. Extend (продление)
Продолжение видео до ~30 секунд суммарно.

### 7. Loop (бесшовная петля)
Зацикленное видео для продуктовых шоукейсов.

### 8. Visual Annotation
Рисование инструкций прямо на стартовом кадре.
- Разметка зон движения, положения объектов, траектории камеры
- Визуальное дополнение к текстовому промпту

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Close-up, extreme close-up, medium shot, medium close-up, wide shot, establishing shot, macro |
| Движение | Dolly forward, dolly back, tracking shot, orbit, crane shot, push in, pull out, pan left/right, tilt up/down, camera dollies forward, slow pan right |
| Угол | Low angle, low-angle tracking shot, high angle, bird's eye view, Dutch angle, POV, over-the-shoulder |
| Ритм | Slow motion, time-lapse, real-time |
| Фокус | Shallow depth of field, rack focus, soft background bokeh |
| Спецприёмы | Aerial descending shot, handheld gimbal feel, one-take, steadicam, 360-degree rotating shot |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, HDR, 16-bit HDR, 4K, 8K, photorealistic, production-ready |
| Жанр | Hollywood blockbuster, indie film, documentary, commercial, music video, noir |
| Цвет/тон | Warm, cold, high contrast, desaturated, neon, golden hour, moody noir, saturated color palette |
| Арт-стиль | Realistic, surreal, minimal, cyberpunk, watercolor, oil painting, comic book |
| Освещение | Natural light, rim light, backlight, volumetric light, neon glow, silhouette, warm key light, crisp commercial lighting, bright midday sun |

---

## Рекомендации по промптам

### Правила промптинга (критически важны для Ray 3)

1. **Mid-action verbs** — «running», «spinning», «pouring» — НЕ «begins to run», «starts to spin»
2. **Вторичные последствия** — ветер в волосах, движение ткани, отражения, поднятая пыль, рябь на воде, пар, конденсат
3. **Оптимальная длина ~100 слов** — сфокусировано на действии, в настоящем времени
4. **Конкретная камера** — «camera dollies forward», «slow pan right», «aerial descending shot»
5. **Освещение и настроение** — значительно влияют на качество: «golden hour side lighting», «moody noir lighting, high contrast»
6. **Present tense** — всегда настоящее время
7. **Cinematic стиль по умолчанию** — если не указано иное, Ray 3 тяготеет к кинематографическому стилю

### Шаблон промпта

```
Create a video of [SUBJECT] [MID-ACTION VERB] in [SETTING], [SECONDARY MOTION/CONSEQUENCE], [CAMERA MOVEMENT], [LIGHTING/MOOD].
```

### Примеры хороших промптов

- «A golden retriever running through a wheat field, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside.»
- «Espresso pouring into a white ceramic cup, steam rising, liquid swirling, macro close-up, warm morning light.»
- «Dancer spinning on a rooftop at sunset, dress billowing outward, hair flowing, city lights glowing in background, camera orbiting slowly.»
- С Character Reference: «Character walking through a foggy forest, leaves crunching underfoot, mist swirling around legs, low-angle tracking shot.»
- Без референса: «Young woman in red jacket hiking up a mountain trail, backpack bouncing, hair tied back, breathing visible in cold air, golden hour side lighting.»
- Продуктовый: «360-degree rotating shot of a sleek smartphone on a minimal pedestal, slow floating motion, crisp commercial lighting, clean reflections, product photography look.»

### Специальные правила для Modify (V2V)

- Описывайте **конечное состояние**, не команды
- **Хорошо**: «Cyberpunk neon city at night, rain-slicked streets, purple and blue lighting»
- **Плохо**: ❌ «Change the sky to blue» (команда), ❌ «Remove the clouds» (негатив), ❌ «The scene transforms into a forest» (временной язык)
- Начинайте с низкой интенсивности (Adhere 1-2) и повышайте при необходимости

---

## Типичные сценарии использования

### Продуктовые видео
- 360° вращение с loop и коммерческим светом
- Макро-съёмка текстур
- HDR для драматичного освещения продукта

### Кинематографические сцены
- HDR для закатов, неона, огня, сценического освещения
- 21:9 ultrawide для letterbox-эстетики
- EXR экспорт для профессионального цветокора
- Keyframes для точного контроля композиции

### Нарративные проекты (Ray 3 + Character Reference)
- Многошотовые последовательности с одним персонажем
- Раскадровки с постоянными героями
- Визуальные истории с сохранением идентичности

### Социальные сети
- 9:16 для TikTok/Reels
- 1:1 для Instagram-ленты
- Draft Mode для быстрой итерации идей

### Стилистические трансформации (Modify)
- Перенос стиля: live-action → анимация, реалистика → иллюстрация
- Изменение освещения: день → ночь, лето → зима
- Погодные модификации: добавление дождя, тумана, снега

---

## Рабочий процесс (рекомендации)

1. **Итерация на 720p** — экономит время и кредиты
2. **Финал на 1080p** — для финальной версии
3. **Draft Mode для тестов** (Ray 3) — для быстрого прототипирования
4. **HDR для драматичного света** — закаты, неон, огонь, сценическое освещение
5. **Loop для продуктов** — бесшовная петля для шоукейсов
6. **21:9 для кино** — ультраширокий формат для кинематографических проектов
7. **EXR для пост-продакшена** — профессиональный цветокор (только 540p/720p)

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно: «a dancer», «espresso cup», «a sleek smartphone» — не «something» или «an object».
2. **Действие в процессе** — глагол в -ing форме или описание текущего движения. «Spinning», «pouring», «running» — НЕ «begins to spin», «will pour», «starts running».
3. **Камера** — хотя бы одно указание: крупность плана ИЛИ движение камеры. «Macro close-up», «camera orbiting slowly», «low-angle tracking shot».
4. **Сцена/среда** — где происходит действие. «Rooftop at sunset», «foggy forest», «minimal pedestal».

### Бонусные элементы (улучшают результат)
5. **Вторичное движение** — последствия действий: «dress billowing outward», «dust particles catching light», «mist swirling around legs», «steam rising».
6. **Освещение** — конкретное описание: «golden hour sunlight», «warm key light with soft bokeh», «crisp commercial lighting».
7. **Стиль/настроение** — визуальная атмосфера: «cinematic», «moody noir», «product photography look».
8. **Темпоральное движение** — описание развития сцены во времени.
9. **Язык** — английский даёт лучшие результаты на всех моделях Ray.

### Антипаттерны (ухудшают результат)
- **Запрещённые слова**: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — деградируют качество генерации на всех моделях Ray (протестировано)
- **Временные фразы**: «begins to», «starts to», «will», «then» — модель не понимает последовательность, используйте present continuous
- **Негативные промпты**: «no text», «without watermarks», «remove shadows» — Ray это «positive only» модель, негативные инструкции КОНТРПРОДУКТИВНЫ
- **Слишком короткий промпт** (<15 слов) — модель додумывает слишком много, результат непредсказуемый
- **Слишком длинный промпт** (>200 слов) — перегрузка деталями, ~100 слов оптимально
- **Пере-описание статики с keyframes** — описывайте только ИЗМЕНЕНИЯ
- **Пере-описание внешности с Character Reference** — референсное изображение уже определяет внешность, описывайте сцену и действие
- **Абстрактные формулировки** — «something beautiful happens», «an emotional moment» — без конкретики результат непредсказуемый
- **Команды вместо описаний** (для Modify) — «change the sky» → должно быть «clear blue sky, bright daylight»
- **Временной язык** (для Modify) — «transforms into», «changes to» → должно быть описание конечного состояния
- **Конфликтующие камерные движения** — zoom + pan + orbit одновременно
- **Размытые описания движения** — «moves around», «does something» вместо конкретного действия

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Продуктовое видео: чистый фон + хороший свет + loop — не нужна сложная раскадровка
- Кинематографический шот: детальная камера + освещение + HDR
- Нарративный проект с Character Reference: сцена + действие, без описания внешности персонажа
- Draft Mode: быстрый тест — допустим менее детальный промпт
- Modify (V2V): конечное состояние, без команд и временного языка
- Промпт на ~100 слов — золотой стандарт для Ray 3; короче — мало деталей, длиннее — перегрузка
- Оценка должна учитывать тип задачи и режим генерации, а не слепо проверять наличие всех элементов
