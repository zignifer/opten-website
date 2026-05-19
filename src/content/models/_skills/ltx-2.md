# LTX 2 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели LTX 2 (Fast + Pro).
> Источники: github.com/Lightricks/LTX-Video, ltx.io/model/model-blog/ltx-2-3-fast-vs-pro, ltx.io/model/model-blog/ltx-2-3-prompt-guide, docs.ltx.video/api-documentation/prompting-guide, ltx.studio/blog/ltx-2-the-complete-ai-creative-engine

## Идентификация

- **model_id:** ltx-2
- **model_name:** LTX 2 (Fast / Pro)
- **type:** video
- **platform:** LTX (ltx.io), LTX Studio, HuggingFace, ComfyUI
- **best_language:** English. «Prompts should be in English. The more elaborate the better.»

---

## Ограничения платформы

| Параметр | LTX 2 Fast | LTX 2 Pro |
|----------|-----------|-----------|
| Разрешение | До **4K (2160p)**; 1080p, 1440p | До **4K (2160p)** |
| Длительность | До **20 секунд** | До **10 секунд** |
| FPS | До **50 FPS** (1080p/1440p); 24/25 (4K) | До **50 FPS** |
| Режимы | T2V, I2V | T2V, I2V, **Audio-to-Video (A2V)**, Retake, Extend |
| Скорость | **2× быстрее**, 1/10 compute cost | Стандарт |
| Негативные промпты | **ДА — поддерживаются** | ДА |
| Custom seed | Да | Да |
| Prompt enhancement | `enhance_prompt=True` | `enhance_prompt=True` |
| Архитектура | Diffusion Transformer (DiT) | DiT |
| Нативное аудио | Да | Да |
| Лицензия | Apache-style (free <$10M revenue) | То же |
| Portrait video (9:16) | Да (с LTX-2.3) | Да |

---

## Структура хорошего промпта

**Кинематографический стиль** — писать как shot list оператора. Подробные хронологические описания в формате paragraph.

### Официальная 6-элементная структура

1. **Shot type / camera position** — кинематографические термины
2. **Environment** — освещение, цветовая палитра, текстуры, атмосфера
3. **Action** — естественная последовательность, present-tense, start-to-finish
4. **Character details** — возраст, причёска, одежда, отличительные черты
5. **Camera movement** — как и когда; описание post-movement помогает
6. **Audio description** — эмбиент, музыка, речь, пение

### Ключевые принципы

- **Lens/aperture language снижает артефакты:** «50mm, f/2.8» уменьшает мерцание краёв
- **Explicit camera paths** (dolly, crane, orbit) снижают temporal jitter
- **Длина промпта = длина видео:** длинные видео требуют длинных промптов. Короткий промпт для 10с видео вызывает rushing.
- **~200 слов** — рекомендованная длина (официально)
- `enhance_prompt=True` — автоулучшение промпта

---

## Ключевые возможности

1. **Нативное 4K (2160p)** до 50 FPS — максимальное разрешение среди опрошенных моделей
2. **Нативная генерация аудио** — диалоги, музыка, эмбиент, SFX синхронно с видео
3. **Open source** — полные веса на HuggingFace, Apache-лицензия
4. **Audio-to-Video (Pro)** — генерация видео по аудио-треку
5. **Retake (Pro)** — перегенерация участка видео без перезапуска
6. **LoRA fine-tuning** — кастомные стили/движения за <1 часа
7. **Multi-keyframe conditioning** — кадры в определённых точках таймлайна

---

## Словарь камерных движений

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Wide shot, medium shot, close-up, extreme close-up, macro, establishing |
| Движение | Dolly forward, dolly back, crane, orbit, push in, pull out, pan, tilt, tracking |
| Объектив | 50mm, 85mm, f/2.8, f/1.4, wide-angle, telephoto, anamorphic |
| Фокус | Shallow depth of field, rack focus, soft bokeh, deep focus |
| Ритм | Slow motion, time-lapse, real-time, speed ramp |

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Cinematic, 4K, photorealistic, film grain, HDR, production-quality |
| Жанр | Documentary, commercial, music video, narrative, thriller, drama |
| Освещение | Natural light, volumetric, rim light, golden hour, neon, tungsten, soft |
| Звук | Ambient noise, dialogue, musical score, SFX, lo-fi, orchestral |

---

## Типичные сценарии использования

### Продакшн-качество видео
- 4K финальные рендеры для профессионального контента
- 50 FPS для smooth motion

### Audio-driven контент (Pro)
- Генерация видео по аудио-треку (A2V)
- Музыкальные визуализации

### Быстрое прототипирование (Fast)
- 2× быстрее и 10× дешевле для итерации
- До 20 секунд для длинных тестов

### Open-source workflow
- Локальный запуск на consumer hardware
- LoRA fine-tuning для кастомных стилей

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Shot type / camera** — тип кадра и/или движение камеры.
2. **Действие** — конкретные физические действия, present-tense.
3. **Среда** — где происходит, освещение, атмосфера.
4. **Персонаж** (если есть) — визуальные детали: возраст, внешность, одежда.

### Бонусные элементы (улучшают результат)
5. **Объектив** — «50mm, f/2.8» снижает артефакты.
6. **Аудио описание** — звуки, музыка, речь.
7. **Камерный путь** — explicit trajectory снижает jitter.
8. **Негативный промпт** — исключение артефактов: «no high-frequency patterns».
9. **Хронологичность** — описание развития сцены от начала к концу.
10. **Длина соответствует длительности** — длинное видео = длинный промпт.

### Антипаттерны (ухудшают результат)
- **Короткий промпт для длинного видео** — 10 слов для 10-секундного видео — модель не знает что делать. Длинные видео ТРЕБУЮТ длинных промптов.
- **Конфликтующие описания** — «still peaceful lake with dramatic waves crashing» — противоречие.
- **Описание изображения в I2V** — не повторять что видно, описывать только движение/изменения.
- **Абстрактные «vibe» слова** — «happy and excited» → конкретно: «eyes widen, mouth opens in surprise, hands raised to face».
- **High-frequency patterns при 4K** — могут вызвать moiré артефакты. Добавлять guardrail в negative: «no high-frequency patterns».
- **Отсутствие аудио описания** — LTX 2 генерирует аудио, описание улучшает результат.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- 6-элементная структура — идеал, но не все элементы обязательны для простых сцен
- Fast vs Pro — разные возможности (A2V, Retake только в Pro)
- ~200 слов рекомендовано — это ДЛИННЫЙ промпт, для LTX это нормально
- 4K/50FPS — продакшн-задачи, ожидать более детальные промпты
- Open source — возможен enhance_prompt для компенсации
- Lens language (50mm, f/2.8) — технический бонус, снижает артефакты
