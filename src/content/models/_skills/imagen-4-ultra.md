# Imagen 4 Ultra — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для модели Google Imagen 4 Ultra.
> Источники: https://github.com/yanis112/The-Generative-Art-Prompt-Bible, https://www.freepik.com/blog/google-imagen-4/, https://www.atlabs.ai/blog/imagen-4-prompting-guide, https://medium.com/@charmichokshi/a-practical-guide-to-googles-imagen-4-in-your-everyday-work-c00eaad80486

## Идентификация

- **model_id:** imagen-4-ultra
- **model_name:** Imagen 4 Ultra
- **type:** image
- **platform:** Google AI (ImageFX, Vertex AI, Freepik, Google AI Studio)
- **best_language:** English — модель оптимизирована для английских промптов. Естественный язык (полные предложения) работает значительно лучше, чем списки тегов.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Тип генерации | Text-to-Image |
| Разрешение | Максимальное среди семейства Imagen 4 |
| Соотношения сторон | 1:1, 4:3, 3:4, 9:16, 16:9 |
| Макс. длина промпта | ~4000 символов (рекомендуется 100–400 слов — Ultra раскрывается на детальных промптах) |
| Рендер текста | Лучший в семействе — максимально чёткий текст с правильной типографикой |
| Негативные промпты | Не поддерживаются — описывай что нужно, а не что не нужно |
| Скорость | Медленнее стандартного Imagen 4 — приоритет на качество |
| Запреты | Контент-фильтры Google: реалистичные лица публичных персон, NSFW, насилие, копирайт |

---

## Отличия Imagen 4 Ultra от стандартного Imagen 4

| Аспект | Imagen 4 (стандарт) | Imagen 4 Ultra |
|--------|--------------------|----|
| Детализация | Высокая | Максимальная — микро-текстуры, поры, нити |
| Верность промпту | Хорошая | Наилучшая — следует всем элементам промпта точнее |
| Типографика | Хорошая | Превосходная — самый точный рендер текста |
| Сложные сцены | Может упрощать | Сохраняет больше деталей в сложных композициях |
| Скорость | Быстрая | Медленнее, но качественнее |
| Оптимальная длина промпта | 50–300 слов | 100–400 слов — Ultra лучше использует длинные описания |
| Лучшее применение | Основная работа, итерации | Финальные изображения, печать, premium контент |

**Ключевое отличие:** Imagen 4 Ultra — самая верная промпту модель в семействе. Она старается реализовать ВСЕ описанные элементы, даже если их много. Это значит, что детальные промпты здесь дают максимальную отдачу.

---

## Структура хорошего промпта

Imagen 4 Ultra раскрывается на детальных, хорошо структурированных промптах. Оптимальная структура:

```
[Тип изображения/стиль/камера] + [Субъект с максимумом деталей] + [Действие/поза] + [Окружение/сцена] + [Освещение с конкретикой] + [Ракурс/композиция/глубина резкости] + [Материалы/текстуры] + [Цветовая палитра] + [Настроение/атмосфера] + [Пост-обработка]
```

### Фреймворк SCULPT (расширенный для Ultra)

| Буква | Элемент | Описание | Пример для Ultra |
|-------|---------|----------|-----------------|
| **S** | Subject (Субъект) | Максимально детальное описание — Ultra реализует всё | «A towering 3-meter alien robot with an elongated head composed of hundreds of intricate components, plastic, wires, all in creamy white, with tiny Japanese kanji inscriptions» |
| **C** | Context (Контекст) | Многослойное окружение: передний, средний, задний план | «Standing in a lush natural garden, with marble statues scattered throughout, clouds drifting lazily overhead» |
| **U** | Unique details (Уникальные детали) | Микро-детали, которые Ultra может реализовать | «Iridescent feather glow with subtle hues of lavender and rose gold, miniature reflections in red-tinted glasses» |
| **L** | Lighting (Освещение) | Конкретные источники и их взаимодействие | «Warm golden sunlight bathes the scene, creating long shadows, with god rays filtering through mist» |
| **P** | Perspective (Перспектива) | Конкретный объектив и параметры съёмки | «Low-angle wide shot, shot at f/2.0, telephoto compression, shallow depth of field with bokeh» |
| **T** | Tone/Theme (Тон/Тема) | Стилистика + пост-обработка + отсылки | «Cinematic, Kodak Vision3 500T tones, color grading with rich warm tones, Peter Jackson epic style» |

---

## Ключевые сильные стороны Imagen 4 Ultra

### 1. Максимальная верность промпту
Ultra — самая «послушная» модель семейства. Если ты описал 15 деталей в промпте, она постарается реализовать все 15. Стандартный Imagen 4 может упростить или пропустить некоторые.

### 2. Ультра-детализация текстур
Ultra рендерит микро-уровень деталей:
- Индивидуальные пряди волос с бликами
- Поры кожи, веснушки, мельчайшие морщины
- Нити ткани, швы, текстура плетения
- Капли воды с правдоподобным преломлением света
- Отражения в металлических и стеклянных поверхностях

### 3. Превосходный рендер текста
Лучшая типографика среди всех версий Imagen:
- Длинные надписи с корректным кернингом
- Несколько слов/строк одновременно
- Для максимального качества: точный текст в кавычках + стиль + расположение + контекст
- Пример: «A vintage neon sign above the entrance reading "HOTEL CALIFORNIA" in warm amber cursive lettering, with a subtle flicker effect»

### 4. Сложные многофигурные сцены
Ultra лучше справляется со сценами, где много персонажей и элементов:
- Батальные сцены с десятками фигур
- Городские пейзажи с деталями архитектуры
- Толпы людей с индивидуальными чертами

---

## Продвинутые техники для Ultra

### Максимально детальные промпты
Ultra раскрывается на длинных (150–400 слов), хорошо структурированных промптах. Пример качественного промпта для Ultra:

```
Immersive, hyperrealistic cinematic scene depicting a powerful shogun seated
regally before an ancient, weathered stone Japanese temple. The shogun is clad
in incredibly complex and detailed golden armor featuring intricate ornamentation,
including sculpted golden dragons intertwined with detailed engravings. The armor
gleams with a realistic, warm metallic luster. [... продолжение с описанием шлема,
охранников, окружения, освещения, камеры, пост-обработки ...]
```

### Послойное описание сцены
Описывай сцену от переднего плана к заднему:

```
Foreground: [детальное описание]
Middle ground: [субъект и основная сцена]
Background: [удалённые элементы, небо, горизонт]
```

### Кинематографический стек
Максимальный набор кино-параметров для Ultra:

```
[Камера] + [Объектив] + [Плёнка/ISO] + [Диафрагма] + [Угол] + [Глубина резкости]
+ [Color grading] + [Пост-обработка] + [Атмосферные эффекты]
```

Пример: «Leica M10, 50mm Summilux lens, shot at f/2.0, Cinestill 50D tones, dramatic chiaroscuro lighting, rich textures, 8K resolution, subtle film grain, baroque painting meets high fashion, chromatic aberration»

### Описательные имена вместо собственных
Ultra верна промпту, но ограничена обучающими данными. Для фотореализма:
- **Плохо:** «Valyrian lord» → модель рендерит в стиле книжной иллюстрации
- **Хорошо:** «a lord from a glorious titanic city with Greco-Roman architecture» → фотореалистичный результат

### Атмосферные эффекты и VFX
Ultra качественно реализует:
- Частицы: «embers, ash, dust swirling in the air»
- Бог-лучи: «volumetric god rays filtering through the canopy»
- Дым и туман: «mist swirls gently, creating depth»
- Искры: «sparks flying from clashing weapons»
- Свечение: «neon tubes with a pinkish glow, amber-lit eyes»

---

## Словарь стилей

| Категория | Ключевые слова |
|-----------|---------------|
| Качество | Photorealistic, ultra-detailed, hyper-realistic, 8K resolution, RAW, razor-sharp focus, studio quality |
| Жанр фото | Editorial fashion, cinematic portrait, product photography, macro, architectural, documentary |
| Кинематограф | Blockbuster movie still, film noir, indie film, epic fantasy, sci-fi cinematic, high-budget scene |
| Цвет/тон | Rich warm tones, desaturated, high contrast, muted earth tones, neon cyberpunk, pastel, golden hour |
| Арт-стиль | Watercolor, ink-wash, anime, oil painting, digital concept art, surreal, Renaissance, Art Nouveau |
| Освещение | Chiaroscuro, volumetric god rays, rim light, backlit silhouette, studio strobe, candlelight, neon glow |
| Плёнка/камера | Cinestill 50D, Kodak Vision3 500T, Kodak Portra 400, 35mm film grain, anamorphic, ARRI Alexa |
| Пост-обработка | Color grading, LUT, film emulation, digital intermediate, chromatic aberration, lens flare, light leaks |
| Атмосфера | Ethereal, gritty, nostalgic, futuristic, epic, intimate, tension, melancholy, whimsical |

---

## Словарь ракурсов и композиции

| Категория | Ключевые слова |
|-----------|---------------|
| Крупность | Extreme close-up (ECU), close-up, medium shot, wide shot, establishing shot, macro |
| Угол | Low angle, high angle, bird's eye, Dutch angle, over-the-shoulder (OTS), POV, worm's eye |
| Тип кадра | Tracking shot, crane shot, aerial/drone, dolly zoom (vertigo effect), whip pan |
| Фокус | Shallow depth of field (f/1.4–f/2.8), deep focus, bokeh, tilt-shift, rack focus |
| Композиция | Rule of thirds, centered, symmetrical, diagonal lines, layered, negative space, framing within frame |

---

## Типичные сценарии использования

### Premium маркетинг и рекламные визуалы
- Финальные рекламные изображения с типографикой
- Продуктовые шоты для печати и billboard
- Editorial-стиль для luxury-брендов
- Постеры, обложки, промо-материалы

### Фэнтези, сай-фай и эпические сцены
- Батальные сцены с сотнями фигур
- Детальные фэнтези-существа и окружения
- Космические корабли и футуристические города
- Длинные промпты (200–400 слов) для максимальной детализации

### Фотореалистичные портреты и фэшн
- Портреты с микро-детализацией кожи, волос, макияжа
- Fashion editorial с полным кинематографическим стеком
- Сложные сцены с несколькими моделями

### Концепт-арт и визуальная разработка
- Дизайн персонажей с полным описанием экипировки
- Архитектурные концепты с детализацией материалов
- Среды и миры с атмосферными эффектами

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них генерация будет слабой)
1. **Субъект** — кто или что изображено. Ultra требует максимальной конкретики: внешность, одежда, поза, выражение.
2. **Визуальный стиль** — тип изображения. Ultra может реализовать любой стиль, но должен знать какой.
3. **Сцена/контекст** — окружение субъекта. Ultra хорошо работает с многослойными описаниями (foreground/background).

### Важные элементы (значительно улучшают результат)
4. **Освещение** — конкретный тип и характер: «chiaroscuro with god rays», «golden hour rim light». Ultra превосходно реализует сложное освещение.
5. **Композиция/ракурс** — тип кадра, угол, объектив, диафрагма. Ultra использует эту информацию точнее стандартной версии.
6. **Детали текстур и материалов** — микро-описания поверхностей: «worn wooden scabbard with visible grain», «iridescent feathers with lavender hues».
7. **Настроение и цветовая палитра** — эмоциональный тон + конкретные цвета: «grim determination, earthy neutral tones with splashes of crimson».

### Бонусные элементы (Ultra раскрывается на них)
8. **Кинематографический стек** — камера + объектив + плёнка + диафрагма + пост-обработка. Ultra реализует полный стек.
9. **Типографика** — точный текст + стиль шрифта + расположение + контекст. Ultra — лидер по рендеру текста.
10. **Атмосферные эффекты** — частицы, туман, бог-лучи, искры, свечение.
11. **Многослойная композиция** — foreground / middle ground / background с описанием каждого слоя.
12. **Длина и структура** — Ultra лучше всех работает с длинными (150–400 слов), хорошо структурированными промптами.

### Антипаттерны (ухудшают результат)
- Слишком короткий промпт (<15 слов) — Ultra создан для детальных описаний, короткий промпт — пустая трата потенциала модели
- Теги через запятую вместо связных предложений — Imagen 4 Ultra оптимизирован для natural language
- Собственные имена из фикшена для фотореалистичных сцен — используй описательные характеристики вместо имён
- Конфликтующие стили одновременно («photorealistic anime surreal pencil sketch»)
- Точные числовые требования к расположению объектов — модель слаба в spatial reasoning
- Запрос сложных сцен с множеством пересекающихся объектов без чёткой иерархии — описывай слоями
- Негативные формулировки — Imagen не поддерживает negative prompt, описывай что НУЖНО
- Промпт без иерархии важности — даже в длинном промпте выделяй главное в начале
- Отсутствие освещения в фотореалистичном промпте — для Ultra это критически важный параметр
- Промпт на языке отличном от английского — качество значительно снижается

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Для Ultra короткие промпты — это почти всегда недоиспользование модели (рекомендуй расширить)
- Фотореалистичный портрет требует описания освещения, фокуса, настроения
- Эпическая сцена выигрывает от длинного детального описания — не штрафуй за длину
- Маркетинговый визуал с типографикой — проверяй чёткость описания текста
- Концепт-арт допускает более свободное описание, но Ultra лучше с конкретикой
- Если промпт подходит для стандартного Imagen 4, можно рекомендовать добавить деталей для Ultra
- Оценка должна учитывать что Ultra — premium модель, и промпт должен соответствовать её возможностям
