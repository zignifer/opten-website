# Recraft V4 — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Recraft V4 / V4 Pro.
> Источники: recraft.ai/docs/recraft-models/recraft-V4, recraft.ai/blog/introducing-recraft-v4, recraft.mintlify.app/prompt-engineering-guide/prompting-with-recraft-v4, recraft.ai/blog/how-to-craft-prompts, recraft.ai/docs/recraft-studio/image-generation/working-with-text-and-prompts/negative-prompts

## Идентификация

- **model_id:** recraft-v4
- **model_name:** Recraft V4 / V4 Pro
- **type:** image
- **platform:** Recraft (recraft.ai), Figma Plugin, MCP интеграция
- **best_language:** English. V4 рендерит текст на разных языках, но промпты лучше на английском.

---

## Ограничения платформы

| Параметр | V4 Standard | V4 Pro |
|----------|-------------|--------|
| Разрешение | 1024×1024 | 2048×2048 |
| Скорость | ~10с/изобр | ~28-30с/изобр |
| Кредиты | 60 | 175 |
| Вектор | SVG ~15с | SVG ~45с (выше качество) |
| Дата релиза | Февраль 2026 | Февраль 2026 |

| Параметр | Значение |
|----------|----------|
| Режимы | T2I, I2I (strength param), inpainting, outpainting, vectorization, background removal, upscaling, exploration (8 вариаций) |
| Форматы выхода | SVG, PNG, JPG, PDF, TIFF, WebP, Lottie |
| Негативные промпты | **ДА — поддерживаются** |
| Макс. промпт | Обрабатывает как single-word так и 500+ word промпты |
| I2I ограничения | Макс 5MB, макс 16MP, макс 4096px, мин 256px |
| Стили | 100+ пресетов через `style`/`style_id` параметр |
| Базовые классы | `realistic_image`, `digital_illustration`, `vector_illustration`, `icon` |
| Цвета | Массив preferred RGB colors + optional background color |

---

## Структура хорошего промпта

Два режима промптинга:

### 1. Interpretive (короткий, 3–6 слов)
Модель принимает собственные дизайнерские решения. Для исследования идей.
```
Retro space station
```

### 2. Architectural (длинный, структурированный)
Полный контроль. Структура от глобального к локальному:

```
A <image style> of <main content>. <detailed description>. <background>. <style description>.
```

Порядок: Core concept → Background → Subject framing → Physical attributes → Secondary subjects → Lighting → Camera/depth → Mood.

### Рендеринг текста

**Текст в кавычках** внутри промпта:
```
A storefront sign reading "OPEN 24/7" in neon letters
```

Элементы **ранее в промпте** получают более высокий приоритет.

### Негативные промпты

**Поддерживаются** через отдельное поле/API параметр.
- Писать что ИСКЛЮЧИТЬ: `"blurry, text, watermark"`
- **НЕ использовать двойное отрицание**: писать `"apples"` в negative, НЕ `"no apples"`

### Style Controls

Параметр `style` или `style_id`:
- 4 базовых класса: `realistic_image`, `digital_illustration`, `vector_illustration`, `icon`
- 100+ пресетных стилей
- Custom styles через upload референсного изображения

---

## Ключевые возможности

1. **SVG-векторная генерация** — ЕДИНСТВЕННАЯ AI-модель генерирующая настоящий редактируемый SVG с структурированными слоями
2. **Точный рендеринг текста** — правильный кернинг и пространственное восприятие
3. **Дизайнерский вкус** — модель принимает осознанные решения по композиции, гармонии цветов, негативному пространству
4. **#1 на Hugging Face Text-to-Image Arena**
5. **Exploration mode** — 8 вариаций из одного промпта
6. **Figma plugin** и MCP интеграция

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Дизайн | Minimalist, editorial, brand identity, logotype, icon set, infographic |
| Иллюстрация | Digital illustration, vector art, flat design, isometric, line art, icon |
| Фото | Photorealistic, studio photography, product shot, editorial, lifestyle |
| Геометрия | Clean geometry, structured layers, negative space, grid-based, modular |
| Типографика | Serif, sans-serif, script, display font, bold lettering, neon sign |
| Материалы | Matte, glossy, metallic, wooden, fabric, paper texture |

---

## Типичные сценарии использования

### Дизайн и брендинг
- Логотипы и айдентика в SVG
- Иконки и иконографические системы
- Дизайн упаковки и этикеток

### Иллюстрация
- Digital illustrations для веб и приложений
- Исследование стилей через exploration mode
- Детализированные сцены с architectural промптом

### Типографика
- Вывески, баннеры, постеры с точным текстом
- Социальный контент с текстовыми элементами

### Продуктовая фотография
- Студийные продуктовые снимки
- Lifestyle photography для e-commerce

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект/контент** — что изображено. Конкретно: «a storefront sign», «a minimalist logo», «a cat on a windowsill».
2. **Стиль** — image style, арт-направление или базовый класс. «Digital illustration», «photorealistic», «vector icon».
3. **Ясность описания** — чёткое описательное предложение, не размытые пожелания.

### Бонусные элементы (улучшают результат)
4. **Текст в кавычках** — для рендеринга текста. «A sign reading "HELLO"».
5. **Композиция и фон** — описание фона и расположения элементов.
6. **Освещение** — тип света для фотореалистичных изображений.
7. **Негативный промпт** (отдельное поле) — исключение нежелательных элементов.
8. **Цветовая палитра** — конкретные цвета или гамма.
9. **Приоритизация** — важные элементы ранее в промпте.

### Антипаттерны (ухудшают результат)
- **Драматические/оценочные прилагательные** — точность лучше чем преувеличение. «Stunning masterpiece» менее полезно чем конкретное описание.
- **Texture/material язык для векторов** — для vector/logo: структурные и геометрические описания, не текстурные.
- **Двойное отрицание в negative prompts** — «no apples» в negative prompt → писать просто «apples».
- **Plural ambiguity** — «cats» неоднозначно. Указывать число: «three cats».
- **Style creation, prompt-based editing, image sets** — НЕ поддерживаются в V4 (пока).
- **Artistic level control** — НЕ поддерживается в V4.

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Короткий interpretive промпт (3–6 слов) — НОРМАЛЬНО для Recraft V4 exploration
- Длинный architectural промпт — для точного контроля
- SVG/vector задачи — оценивать геометрическую описательность, не текстуры
- Текст в изображении — проверять наличие кавычек
- Дизайн/брендинг — композиция и стиль важнее фотореалистичных деталей
- Negative prompt — проверять отсутствие двойного отрицания
