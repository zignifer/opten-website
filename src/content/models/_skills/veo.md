# Google Veo — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для моделей семейства Google Veo (общий fallback).
> Источники: https://deepmind.google/models/veo/prompt-guide/, https://replicate.com/blog/using-and-prompting-veo-3, https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1

## Идентификация

- **model_id:** veo
- **model_name:** Google Veo (General)
- **type:** video
- **platform:** Google AI (Vertex AI, AI Studio, Flow)
- **best_language:** English (en). Промпты на английском дают наиболее стабильные результаты.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Длительность генерации | 5–8 секунд (зависит от версии) |
| Макс. длина промпта | ~1500 символов рекомендуемый лимит |
| Разрешение | До 720p (1280×720) базовое |
| Формат вывода | 16:9 горизонтальное видео |
| Аудио | Зависит от версии — Veo 1/2 без аудио, Veo 3+ с аудио |
| Вертикальное видео | Нативно не поддерживается (только через постобработку) |

---

## Структура хорошего промпта

Оптимальная структура промпта для моделей Veo:

```
[Subject] + [Context/Scene] + [Action] + [Camera Movement] + [Style/Mood] + [Lighting/Ambiance] + [Audio (если поддерживается)]
```

Не обязательно использовать все элементы — состав зависит от типа видео. Чем конкретнее описание, тем лучше результат. Пишите так, как если бы вы описывали сцену режиссёру.

---

## Основные типы генерации

### 1. Text-to-Video
Генерация видео только из текстового описания.
- Формула: `(Субъект) + (Действие) + (Среда/Контекст) + (Камера) + (Стиль)`
- Пример: «A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall.»

### 2. Image-to-Video
Создание видео из начального изображения (в зависимости от версии и платформы).
- Формула: `[Описание действия] + [Что должно измениться] + [Камера]`

---

## Продвинутые техники

### Детализация промпта
Базовый промпт даёт базовый результат. Детальный промпт — контролируемый результат:

**Плохо:** «A man answers a phone»
**Хорошо:** «A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign.»

### Стилистические модификаторы
Можно задать стиль через префикс «In the style of [style]:»
- LEGO, Claymation, Pixar animation, Anime, Graphic novel
- 8-bit retro, Stop-motion, Origami, Blueprint, Marble

### Selfie-стиль
Для реалистичных selfie-видео:
- Начинайте с «A selfie video of…»
- Укажите видимую руку: «holds the camera at arm's length, arm clearly visible in frame»
- Добавьте естественные движения глаз: «occasionally looking into the camera»

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Wide shot, medium shot, close-up, extreme close-up, establishing shot |
| Движение | Dolly shot, zoom in, zoom out, pan (left/right), tracking shot, orbit |
| Угол | Eye level, high angle, low angle, worm's eye, top-down, aerial shot |
| Фокус | Shallow depth of field, rack focus, deep focus |
| Спецприёмы | Dolly zoom, one-take, handheld, steadicam, crane shot |

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, film grain, HDR, 4K, professional |
| Жанр | Hollywood blockbuster, indie film, documentary, commercial, music video, vlog |
| Цвет/тон | Warm tones, cool tones, high contrast, desaturated, neon, golden hour |
| Арт-стиль | Realistic, surreal, minimal, noir, anime, claymation, stop-motion |
| Освещение | Natural light, rim light, backlight, volumetric, neon glow, silhouette, blue light |

---

## Типичные сценарии использования

### Реклама / Коммерческое видео
- Продуктовые шоты, демонстрации, промо-ролики
- Стилизация под коммерческую съёмку

### Короткие истории / Нарратив
- Описание персонажей с конкретными деталями внешности
- Описание действий и эмоций

### Арт / Стилизация
- Использование стилистических модификаторов
- Абстрактные и экспериментальные видео

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретное описание, не абстрактное. «A man in a green trench coat» вместо «someone».
2. **Действие** — что происходит в кадре. Физические действия: «picks up the phone, turns around, walks» вместо «something happens».
3. **Контекст/Среда** — где происходит действие. «On a gritty brick wall», «in a quiet forest clearing», «on a busy Tokyo street».
4. **Камера** — хотя бы одно указание на крупность плана, движение камеры или угол съёмки.

### Бонусные элементы (улучшают результат)
5. **Стиль/Настроение** — визуальный стиль, цветовая палитра, атмосфера. «Cinematic», «warm tones», «eerie glow».
6. **Освещение** — конкретные источники света: «bathed in neon glow», «golden hour sunlight», «soft ambient light».
7. **Композиция** — как построен кадр: «wide shot», «close-up framing on the face».
8. **Атмосфера/Звук** — звуковой дизайн (для версий с аудио): фоновые звуки, музыка.
9. **Детали внешности** — для персонажей: одежда, возраст, причёска, выражение лица.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<10 слов) — модель будет додумывать слишком много, результат непредсказуемый
- Абстрактные формулировки без конкретики («something beautiful happens», «cool video»)
- Конфликтующие инструкции (zoom in + zoom out одновременно, static shot + tracking shot)
- Отсутствие описания действия — статичная сцена без динамики
- Перегрузка промпта противоречивыми стилями
- Использование негативных формулировок без позитивной альтернативы

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Простой продуктовый шот не требует сложной раскадровки
- Анимационное видео не требует реалистичного освещения
- Абстрактное арт-видео может не иметь конкретного субъекта
- Оценка должна учитывать тип задачи, а не слепо проверять наличие всех элементов
