# Luma Ray — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для видеомоделей семейства Luma Ray (общий fallback).
> Источники: https://lumalabs.ai/learning-center/articles/luma-video-models-field-guide, https://lumaai-help.freshdesk.com/support/solutions/articles/151000214865

## Идентификация

- **model_id:** luma-ray
- **model_name:** Luma Ray (общее семейство)
- **type:** video
- **platform:** Luma Dream Machine
- **best_language:** English. Модели Ray оптимизированы под английские промпты с кинематографической терминологией.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Длительность генерации | 5–10 секунд (extend до ~30 секунд) |
| Разрешение | 720p, 1080p (нативное); 4K через апскейл |
| Соотношения сторон | 9:16, 3:4, 1:1, 4:3, 16:9, 21:9 |
| Keyframes | Start frame + End frame (Image-to-Video) |
| Loop | Да — бесшовная петля для продуктовых видео |
| Аудио | Генерация аудио доступна отдельно |
| Character Reference | Только в Ray3 (не в Ray2 и старше) |
| Изображений на вход | Start/End keyframe (jpeg/png) |
| Видео на вход | Для Modify (V2V) и Extend |
| Draft Mode | Только Ray3 — быстрая генерация в низком разрешении |

---

## Структура хорошего промпта

Оптимальная структура промпта для моделей Luma Ray:

```
[Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood]
```

Ключевой принцип: модели Ray — это «positive only» модели. Негативные промпты контрпродуктивны. Описывайте то, что ХОТИТЕ видеть, а не то, чего хотите избежать.

---

## Режимы генерации

### 1. Text-to-Video (Describe)
Генерация видео из текстового описания.
- Формула: `[Субъект] + [Действие в процессе] + [Среда] + [Вторичное движение] + [Камера] + [Свет/Настроение]`
- Пример: «A golden retriever running through a wheat field, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside.»

### 2. Image-to-Video (Keyframe)
Анимация статичных изображений или переход между двумя кадрами.
- Формула: `Start/End keyframe + [Описание действия между кадрами] + [Камера]`
- Важно: при использовании keyframes соотношение сторон берётся автоматически из загруженного изображения
- С keyframes описывайте только то, что МЕНЯЕТСЯ — не описывайте статичные элементы заново

### 3. Extend (продление видео)
Продолжение существующего видео вперёд.
- Лимит: до ~30 секунд суммарно, далее возможно снижение качества
- Каждое продление = отдельный промпт с описанием нового контента

### 4. Modify (Video-to-Video)
Трансформация существующего видео по промпту — изменение стиля, освещения, окружения.
- Три режима: Adhere (сохранить оригинал), Flex (баланс), Reimagine (свобода)
- Каждый режим имеет 3 уровня интенсивности (1–3)
- Критическое правило: описывайте КОНЕЧНОЕ СОСТОЯНИЕ, не команды

### 5. Loop (бесшовная петля)
Создание зацикленного видео для продуктовых шоукейсов.

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Close-up, extreme close-up, medium shot, wide shot, establishing shot, macro |
| Движение | Dolly forward, dolly back, tracking shot, orbit, crane shot, push in, pull out, pan left/right, tilt up/down |
| Угол | Low angle, high angle, bird's eye view, Dutch angle, POV, over-the-shoulder |
| Ритм | Slow motion, time-lapse, real-time, freeze frame |
| Фокус | Shallow depth of field, rack focus, soft background bokeh |
| Спецприёмы | Aerial descending shot, handheld gimbal feel, one-take, steadicam |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, HDR, 4K, 8K, photorealistic, production-ready |
| Жанр | Hollywood blockbuster, indie film, documentary, commercial, music video, vlog |
| Цвет/тон | Warm, cold, high contrast, desaturated, neon, golden hour, moody noir |
| Арт-стиль | Realistic, surreal, minimal, cyberpunk, noir, watercolor, oil painting |
| Освещение | Natural light, rim light, backlight, volumetric light, neon glow, silhouette, warm key light |

---

## Рекомендации по промптам

### Общие правила для всех моделей Ray

1. **Используйте глаголы в процессе действия** — «running» вместо «begins to run», «spinning» вместо «starts to spin»
2. **Включайте вторичные последствия** — ветер в волосах, движение ткани, отражения, поднятая пыль, рябь на воде
3. **Оптимальная длина ~100 слов** — сфокусировано на действии, в настоящем времени
4. **Описывайте камеру конкретно** — «camera dollies forward», «slow pan right», «aerial descending shot»
5. **Указывайте освещение и настроение** — это значительно влияет на результат
6. **Present tense** — всегда описывайте в настоящем времени

### Шаблон промпта

```
Create a video of [SUBJECT] [MID-ACTION VERB] in [SETTING], [SECONDARY MOTION/CONSEQUENCE], [CAMERA MOVEMENT], [LIGHTING/MOOD].
```

---

## Типичные сценарии использования

### Продуктовые видео
- 360° вращение продукта с бесшовным loop
- Макро-крупный план текстур и деталей
- Коммерческое освещение, чистые отражения

### Кинематографические сцены
- HDR для драматичного освещения (закаты, неон, огонь)
- 21:9 для letterbox-эстетики
- Keyframes для точного контроля композиции

### Социальные сети
- 9:16 для TikTok/Reels
- 1:1 для Instagram-ленты
- Короткие динамичные сцены с энергичным движением

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретно: «a golden retriever», «a woman in a red jacket», не «something» или «someone».
2. **Действие в процессе** — глагол в -ing форме или описание текущего движения. «Running», «spinning», «pouring» — не «begins to run», «will spin».
3. **Камера** — хотя бы одно указание на крупность плана ИЛИ движение камеры. «Close-up», «tracking shot», «camera orbits slowly».
4. **Сцена/среда** — где происходит действие. «Wheat field», «rooftop at sunset», «neon-lit alley».

### Бонусные элементы (улучшают результат)
5. **Вторичное движение** — последствия действий: «dust particles catching light», «fabric billowing», «reflections on wet surface».
6. **Освещение** — конкретное описание: «golden hour sunlight», «warm key light with soft bokeh», «rim lighting».
7. **Стиль/настроение** — визуальная атмосфера: «cinematic», «moody noir», «warm commercial look».
8. **Темпоральное движение** — описание того, как сцена развивается во времени.

### Антипаттерны (ухудшают результат)
- **Запрещённые слова**: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — деградируют качество на моделях Ray
- **Временные фразы**: «begins to», «starts to», «will» — модель не понимает будущее время, используйте present continuous
- **Негативные промпты**: «no clouds», «without text», «remove shadows» — Ray это «positive only» модель, негативные инструкции контрпродуктивны
- **Слишком короткий промпт** (<15 слов) — модель додумывает слишком много, результат непредсказуемый
- **Пере-описание статики с keyframes** — если используете keyframe, описывайте только то, что МЕНЯЕТСЯ
- **Абстрактные формулировки** — «something beautiful happens», «an emotional moment» — без конкретики модель не понимает, что генерировать
- **Команды вместо описаний** (для Modify) — «change the sky to blue» вместо «clear blue sky, bright daylight»
- **Конфликтующие камерные движения** — zoom + pan + orbit одновременно

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Продуктовое видео не требует сложной сцены — достаточно чистого фона и хорошего света
- Кинематографический шот требует детальной проработки камеры и освещения
- Социальный контент может быть проще, но должен быть динамичным
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
- Промпт на ~100 слов — оптимальная длина для Ray; короче — мало деталей, длиннее — перегрузка
