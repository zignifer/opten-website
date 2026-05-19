# PixVerse V6 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели PixVerse V6 (и V5.5).
> Источники: pixverse.ai/en/blog/pixverse-v6-ai-video-generator-review, pixverse.ai/en/blog/pixverse-launches-v6, runware.ai/docs/models/pixverse-v5-5, runware.ai/docs/models/pixverse-v6, fal.ai/pixverse-v6, docs.pixverse.ai

## Идентификация

- **model_id:** pixverse-6
- **model_name:** PixVerse V6 (V5.5)
- **type:** video
- **platform:** PixVerse (pixverse.ai), API через Runware/fal.ai
- **best_language:** English — наиболее протестирован. Мультиязычная поддержка, внутренний перевод на английский.

---

## Ограничения платформы

| Параметр | V6 | V5.5 |
|----------|-----|------|
| Разрешение | До 1080p | До 1080p |
| Длительность | До **15с при 1080p** | 5/8/10с (1080p: 5-8с; 10с макс 720p) |
| Режимы | T2V, I2V, Multi-shot, Video Extension | T2V, I2V, Effects (46 шаблонов), multi-clip |
| Макс. промпт | 2–2,048 символов | 2–2,048 символов |
| Негативные промпты | **ДА — поддерживаются** | ДА |
| Custom seed | Да (unsigned 32-bit) | Да |
| FPS | 16 или 24 | 16 или 24 |
| Нативное аудио | **ДА** — BGM, SFX, диалоги, эмбиент | Нет |
| Cinematic lens controls | **20+** (focal length, aperture, DoF, lens distortion, chromatic aberration, vignetting) | Нет |
| Multilingual text в кадре | Да | Нет |
| Дата релиза | 30 марта 2026 | Старше |

### Style Presets (параметр, не в промпте)

`anime`, `3d_animation`, `clay`, `comic`, `cyberpunk` — выбираются через параметр.

### Prompt Optimization

Параметр `thinking_type`: `enabled` (автооптимизация), `disabled` (как есть), `auto` (модель решает).

---

## Структура хорошего промпта

**Literal/descriptive стиль.** PixVerse лучше всего реагирует на **буквальные физические описания**, НЕ метафоры и абстракции.

```
[Subject] + [Action] + [Environment] + [Camera movement] + [Audio description]
```

Описывать только что ВИДНО и СЛЫШНО.

### Аудио в промпте (V6)

Описывать аудио явно в тексте промпта:
```
Loud engine roaring sound. Tires hitting gravel sound. Wind rushing past.
```

### Камерные директивы

Pan, tilt, zoom, dolly, tracking, follow — поддерживаются в промпте. V6 добавляет явные параметры линз.

### Негативные промпты

Поддерживаются для исключения: `"blurry, distorted hands, extra limbs, watermark"`.

---

## Ключевые возможности

1. **Нативная генерация аудио** — BGM, SFX, диалоги, эмбиент за один проход одновременно с видео
2. **Multi-shot engine** — короткометражки с нативными переходами, консистентностью света и персонажей
3. **20+ cinematic lens controls** — параметры камеры как продакшн-настройки (не prompt hints)
4. **Character consistency** — multi-image reference (до 3 изображений)
5. **Стилизация** — аниме, 3D, clay, comic, cyberpunk с lip-sync

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Стили (параметр) | anime, 3d_animation, clay, comic, cyberpunk |
| Камера | Pan left/right, tilt up/down, zoom in/out, dolly, tracking, follow |
| Аудио | Engine roaring, wind rushing, footsteps, dialogue, ambient music, rain |
| Движение | Running, jumping, floating, spinning, walking, falling, flying |
| Среда | Urban street, forest clearing, underwater, space, interior, rooftop |

---

## Типичные сценарии использования

### Нативное аудио контент (V6)
- Видео с SFX и фоновой музыкой за один проход
- Диалоговые сцены с lip-sync

### Аниме и стилизация
- Аниме-видео через style preset
- Clay animation, comic, 3D стили

### Короткометражки (Multi-shot, V6)
- Мини-фильмы с нативными переходами
- Консистентность персонажей через серию шотов

### Длинные генерации
- До 15 секунд при 1080p (V6)
- Video Extension для ещё большей длительности

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что в кадре. Конкретные физические описания.
2. **Действие** — буквальное описание движения. Активные глаголы.
3. **Среда** — где происходит действие. Физическое описание локации.

### Бонусные элементы (улучшают результат)
4. **Камера** — движение камеры: pan, dolly, tracking и т.д.
5. **Аудио описание** (V6) — SFX, музыка, эмбиент в тексте промпта.
6. **Негативный промпт** — исключение артефактов.
7. **Style preset** — указание стиля через параметр.
8. **Консистентность персонажей** — повтор ключевых дескрипторов через multi-shot.

### Антипаттерны (ухудшают результат)
- **Абстрактные и размытые промпты** — «a cool video» — специфичность критически улучшает результат.
- **Метафоры вместо буквальных описаний** — «tears of the sky» → «heavy rain falling on pavement». PixVerse понимает БУКВАЛЬНО.
- **Сшивание коротких клипов** — использовать 15с single-pass (V6) или multi-shot engine.
- **1080p 10с на V5.5** — V5.5 макс 8с при 1080p, 10с только при 720p.
- **Забывать character descriptors в multi-shot** — повторять описания персонажей для предотвращения drift.
- **Ожидание стилей в промпте** — стили через параметр, не текст.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Literal descriptions — это правильный подход для PixVerse
- Аудио-описание в промпте — это фича V6, не лишний текст
- Негативные промпты поддерживаются — проверять адекватность
- Style presets — через параметр, не в тексте
- thinking_type=enabled может компенсировать короткий промпт
- V6 vs V5.5 — разные возможности (аудио, длительность, lens controls)
