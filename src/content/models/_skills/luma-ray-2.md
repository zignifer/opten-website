# Luma Ray 2 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Luma Ray 2.
> Источники: https://lumalabs.ai/learning-hub/dream-machine-guide-ray2, https://lumalabs.ai/learning-center/articles/luma-video-models-field-guide

## Идентификация

- **model_id:** luma-ray-2
- **model_name:** Luma Ray 2
- **type:** video
- **platform:** Luma Dream Machine
- **best_language:** English. Ray 2 оптимизирован под английские промпты с кинематографической терминологией.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Длительность генерации | 5 или 10 секунд (выбирается в настройках) |
| Макс. длина после Extend | ~30 секунд (далее качество снижается) |
| Разрешение | 720p (нативное), 1080p, апскейл до 4K |
| Соотношения сторон | 9:16, 3:4, 1:1, 4:3, 16:9, 21:9 |
| Keyframes | Start frame + End frame |
| Loop | Да — бесшовная петля |
| Аудио | Генерация аудио по отдельному промпту (не нативное) |
| Camera Tags | Да — специальные теги камерных движений в интерфейсе |
| Character Reference | Нет (доступно только в Ray3) |
| Draft Mode | Нет (доступно только в Ray3) |
| HDR | Нет (доступно только в Ray3+) |

---

## О модели

Ray 2 — крупномасштабная модель генерации видео, обученная напрямую на видеоданных. Это позволяет модели понимать естественное движение, реалистичное освещение и физически корректное взаимодействие объектов. Ключевые улучшения по сравнению с Ray 1.6:

- **Реализм и качество**: реалистичные текстуры, плавная работа камеры, динамичные сцены
- **Длительность и разрешение**: до 10 секунд при 720p (Ray 1.6 — меньше)
- **Нет замедленного воспроизведения**: устранена проблема slow-motion, характерная для Ray 1.6
- **Понимание текста**: сильное понимание текстовых инструкций
- **Видео на вход**: может принимать видео как входные данные

### Ray 2 Flash
Ускоренная версия: 3x быстрее, 3x дешевле. Те же возможности (Text-to-Video, Image-to-Video, аудио, контроль), но с упором на скорость.

---

## Структура хорошего промпта

Оптимальная структура промпта для Ray 2:

```
[Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood]
```

Ray 2 — «positive only» модель. Негативные промпты контрпродуктивны. Описывайте только то, что ХОТИТЕ видеть.

---

## Режимы генерации

### 1. Text-to-Video (Describe)
Генерация видео из текстового описания.
- Формула: `[Субъект] + [Действие в процессе] + [Среда] + [Вторичное движение] + [Камера] + [Свет/Настроение]`
- Пример: «Espresso pouring into a white ceramic cup, steam rising, liquid swirling, macro close-up, warm morning light.»

### 2. Image-to-Video (Keyframe)
Анимация изображений или переход между start/end keyframes.
- Start frame и End frame поддерживаются
- При использовании keyframes соотношение сторон берётся из загруженного изображения
- Описывайте только то, что МЕНЯЕТСЯ между кадрами

### 3. Extend (продление)
Продолжение существующего видео.
- Выбор между 5 и 10 секунд нового контента
- Лимит: ~30 секунд суммарно, далее качество деградирует с каждым продлением
- Каждое продление = отдельный промпт

### 4. Loop (бесшовная петля)
Зацикленное видео — идеально для продуктовых шоукейсов.
- Активируется иконкой ∞ в prompt box

### 5. Camera Tags
Специальные теги камерных движений в интерфейсе Dream Machine.
- Доступны только для моделей Ray2 и Ray2 Flash
- Можно комбинировать теги для сложных движений
- Убедитесь, что модель Ray2 выбрана в настройках — иначе теги недоступны

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Close-up, extreme close-up, medium shot, wide shot, establishing shot, macro |
| Движение | Dolly forward, dolly back, tracking shot, orbit, crane shot, push in, pull out, pan left/right, tilt up/down |
| Угол | Low angle, high angle, bird's eye view, Dutch angle, POV, over-the-shoulder |
| Ритм | Slow motion, time-lapse, real-time |
| Фокус | Shallow depth of field, rack focus, soft background bokeh |
| Спецприёмы | Aerial shot, handheld, steadicam, one-take |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, 4K, photorealistic, production-ready |
| Жанр | Hollywood blockbuster, indie film, documentary, commercial, music video |
| Цвет/тон | Warm, cold, high contrast, desaturated, neon, golden hour, moody |
| Арт-стиль | Realistic, surreal, minimal, cyberpunk, noir |
| Освещение | Natural light, rim light, backlight, volumetric light, neon glow, silhouette |

---

## Рекомендации по промптам

### Правила промптинга

1. **Глаголы в процессе действия (mid-action verbs)** — «running» вместо «begins to run», «pouring» вместо «starts to pour»
2. **Вторичные последствия** — ветер в волосах, поднятая пыль, отражения, движение ткани, рябь на воде
3. **Оптимальная длина ~100 слов** — действие в настоящем времени, сфокусировано
4. **Конкретная камера** — «camera dollies forward», «slow pan right», не просто «camera moves»
5. **Освещение и настроение** — значительно влияют на результат
6. **Present tense** — всегда настоящее время

### Шаблон промпта

```
Create a video of [SUBJECT] [MID-ACTION VERB] in [SETTING], [SECONDARY MOTION/CONSEQUENCE], [CAMERA MOVEMENT], [LIGHTING/MOOD].
```

### Примеры хороших промптов

- «A golden retriever running through a wheat field, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside.»
- «Espresso pouring into a white ceramic cup, steam rising, liquid swirling, macro close-up, warm morning light.»
- «Dancer spinning on a rooftop at sunset, dress billowing outward, hair flowing, city lights glowing in background, camera orbiting slowly.»

---

## Типичные сценарии использования

### Продуктовые видео
- 360° вращение продукта с loop
- Макро-съёмка текстур и деталей
- Коммерческое освещение

### Кинематографические сцены
- Плавная работа камеры, реалистичное освещение
- Keyframes для точного контроля start/end композиции
- Действие и динамика — сильная сторона Ray 2

### Социальные сети
- 9:16 для вертикального контента
- 1:1 для Instagram-ленты
- Camera Tags для быстрой настройки движения камеры

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно: «a woman in a red dress», «espresso cup», не «something» или «a thing».
2. **Действие в процессе** — глагол в -ing форме. «Running», «spinning», «pouring» — НЕ «begins to run», «will spin», «starts pouring».
3. **Камера** — хотя бы одно указание: крупность плана ИЛИ движение камеры. «Close-up», «tracking shot», «camera orbits slowly».
4. **Сцена/среда** — где происходит действие. «Wheat field», «rooftop at sunset», «foggy forest».

### Бонусные элементы (улучшают результат)
5. **Вторичное движение** — последствия действий: «ears flapping», «dust particles catching light», «dress billowing».
6. **Освещение** — конкретное описание: «golden hour sunlight», «warm morning light», «neon glow».
7. **Стиль/настроение** — визуальная атмосфера: «cinematic», «moody», «commercial look».
8. **Язык** — английский даёт лучшие результаты.

### Антипаттерны (ухудшают результат)
- **Запрещённые слова**: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — деградируют качество генерации на моделях Ray
- **Временные фразы**: «begins to», «starts to», «will», «then» — модель работает в present continuous, не понимает последовательность
- **Негативные промпты**: «no text», «without logos», «remove clouds» — Ray это «positive only» модель, негативные инструкции ухудшают результат
- **Слишком короткий промпт** (<15 слов) — модель додумывает слишком много
- **Слишком длинный и запутанный промпт** — перегрузка деталями, ~100 слов оптимально
- **Пере-описание статики с keyframes** — если используете keyframe, описывайте только ИЗМЕНЕНИЯ
- **Абстрактные формулировки** — «something beautiful», «an amazing scene» — без конкретики результат непредсказуемый
- **Конфликтующие камерные движения** — zoom + pan + orbit одновременно дают хаотичный результат
- **Промпт на >10 секунд без extend** — максимум генерации = 10 секунд, для большего используйте Extend
- **Размытые описания движения** — «moves around», «does something» вместо конкретного действия

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Продуктовое видео не требует сложной сцены — чистый фон, хороший свет, loop
- Кинематографический шот требует детальной камеры и освещения
- Простой макро-шот не требует описания действий нескольких персонажей
- Ray 2 силён в реалистичных сценах с физически корректным движением — оценка должна учитывать это
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
- Camera Tags — бонус, но не замена текстового описания камеры в промпте
