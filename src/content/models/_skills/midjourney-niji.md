# MidJourney Niji — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для моделей MidJourney Niji (5, 6, 7).
> Источники: https://blakecrosley.com/guides/midjourney, https://geekycuriosity.substack.com/p/the-complete-guide-to-midjourney-585

## Идентификация

- **model_id:** midjourney-niji
- **model_name:** MidJourney Niji (5/6/7)
- **type:** image
- **platform:** midjourney.com / Discord
- **best_language:** English — модели Niji обучены преимущественно на английском. Японские термины аниме/манги (например, «shoujo», «seinen», «chibi») работают как стилевые маркеры.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Макс. длина промпта | ~6000 символов (оптимально 50–150 токенов) |
| Нативное разрешение | До 1024x1024 |
| Формат выдачи | 4 вариации на один запрос |
| Специализация | Аниме, манга, восточная иллюстрация |
| Текущая версия | Niji 7 (с 9 января 2026) |
| Персонализация | Поддерживается с 26 февраля 2026 (Niji 7) |

---

## Версии Niji

### Niji 7 (рекомендуемая, с января 2026)

**Сильные стороны:**
- Кристально чистые глаза, отражения и мелкие детали фона
- Улучшенная когерентность для сложных поз и многорукого дизайна
- Более буквальная интерпретация — точно следует описаниям цвета одежды, причёсок, поз
- Чистые, плоские линии (linework) — фирменная эстетика Niji 7
- Улучшенный рендеринг текста
- Значительно улучшенный --sref с минимальным дрейфом стиля
- Персонализация (--p) и мудборды поддерживаются (с 26 февраля 2026)

**Ограничения:**
- `--cref` НЕ поддерживается (новая система ссылок на персонажей в разработке)
- Более буквальная, чем предыдущие версии — «вайбовые» промпты нужно корректировать
- Стилевые пресеты (--style expressive/cute/scenic) НЕ поддерживаются

**Использование:**
```
A determined young mage with crimson hair, casting fire magic, intense expression, ancient library background --niji 7
```

### Niji 6 (legacy, для обратной совместимости)

**Когда использовать Niji 6 вместо 7:**
- Нужны стилевые пресеты (--style expressive, cute, scenic, original)
- Рабочий процесс зависит от --cref (ссылка на персонажа)
- Предпочитаете мягкую, менее буквальную интерпретацию

**Стилевые пресеты Niji 6:**
```
--niji 6 --style expressive    # Динамичный, стилизованный
--niji 6 --style cute           # Кавайная эстетика
--niji 6 --style scenic          # Фокус на фоне/окружении
--niji 6 --style original        # Классический стиль Niji
```

### Niji 5 (устаревшая)
Практически не используется. Рекомендуется обновление до Niji 7.

---

## Структура хорошего промпта для Niji

### Иерархия промпта (аниме-специфичная)

```
[Персонаж/Субъект] + [Внешность/Одежда] + [Действие/Поза] + [Окружение/Фон] + [Стиль аниме] + [Настроение/Атмосфера] + [Параметры]
```

### Ключевой принцип: аниме-специфичная терминология

Niji обучена на аниме и манге. Она понимает специфическую терминологию лучше, чем общую:

**Типы персонажей:**
- `shoujo heroine` — девушка в стиле сёдзё (романтика, эмоциональность)
- `shonen protagonist` — герой сёнэна (энергия, боевой дух)
- `seinen character` — персонаж сейнена (зрелость, реализм)
- `chibi` — суперстилизованный маленький персонаж
- `bishounen` — красивый юноша
- `bishoujo` — красивая девушка
- `mecha pilot` — пилот робота
- `magical girl` — махо-сёдзё

**Стили рисовки:**
- `cel shading` — классическая анимационная заливка
- `flat color` — плоские цвета без градиентов
- `watercolor anime` — акварельный аниме-стиль
- `ink wash` — тушевая техника
- `line art` — чистые контуры
- `thick outlines` — жирные контуры
- `soft shading` — мягкая тень
- `screentone` — точечная заливка как в манге

**Жанровые маркеры:**
- `isekai` — попаданчество
- `slice of life` — повседневность
- `mecha` — роботы
- `mahou shoujo` — магические девочки
- `dark fantasy` — тёмное фэнтези
- `cyberpunk anime` — киберпанк в аниме-стиле
- `studio ghibli style` — стиль студии Гибли

---

## Параметры Niji

### Niji 7

| Параметр | Диапазон | По умолчанию | Описание |
|----------|----------|-------------|----------|
| `--niji 7` | — | — | Указывает версию Niji 7 |
| `--ar` | Любое | 1:1 | Соотношение сторон |
| `--s` / `--stylize` | 0–1000 | 100 | Художественная интерпретация |
| `--c` / `--chaos` | 0–100 | 0 | Разнообразие вариаций |
| `--w` / `--weird` | 0–3000 | 0 | Экспериментальность |
| `--no` | текст | — | Негативный промпт |
| `--sref [URL]` | — | — | Style Reference (минимальный дрейф в Niji 7) |
| `--sw` | 0–1000 | 100 | Вес style reference |
| `--p` | код или без | — | Персонализация (с февраля 2026) |
| `--seed` | 0–4294967295 | случайный | Воспроизводимость |
| `--style raw` | — | выкл | Минимальная обработка |
| `--exp` | 0–100 | 0 | Экспериментальная детализация |

### Niji 6 (дополнительные)

| Параметр | Описание |
|----------|----------|
| `--style expressive` | Динамичный, стилизованный вариант |
| `--style cute` | Кавайная эстетика |
| `--style scenic` | Акцент на окружении и фонах |
| `--style original` | Классический стиль Niji |
| `--cref [URL]` | Character Reference (сохранение внешности персонажа) |
| `--cw` | Character Weight — сила ссылки на персонажа |

---

## Специфика аниме-промптов

### Глаза и лицо (особенно важно для аниме)
Niji 7 значительно улучшила отрисовку глаз. Указывайте:
- `large expressive eyes` — большие выразительные глаза
- `heterochromia` — разный цвет глаз
- `sharp eyes` — острый взгляд
- `gentle gaze` — мягкий взгляд
- `closed eyes, serene expression` — закрытые глаза, спокойное выражение

### Волосы
Аниме-специфичные описания волос работают лучше реалистичных:
- `long flowing silver hair` — длинные серебристые волосы
- `twin tails with red ribbons` — два хвоста с красными лентами
- `messy short blue hair` — растрёпанные короткие голубые волосы
- `gradient hair from pink to purple` — градиент от розового к фиолетовому
- `hair blowing in the wind` — волосы развеваются на ветру

### Одежда и аксессуары
- `school uniform`, `sailor uniform` — школьная форма
- `kimono with floral pattern` — кимоно с цветочным узором
- `armored knight with flowing cape` — рыцарь в доспехах с развевающимся плащом
- `casual hoodie and jeans` — повседневная толстовка и джинсы
- `elaborate fantasy armor with glowing runes` — фэнтезийные доспехи с рунами

### Динамичные позы (важно для аниме)
- `action pose, mid-jump` — боевая поза, прыжок
- `sword slash motion blur` — размытие от удара мечом
- `casting magic, energy swirling` — каст магии, вихрь энергии
- `running with dramatic perspective` — бег с драматичной перспективой
- `sitting on rooftop, looking at sunset` — сидит на крыше, смотрит на закат

### Эффекты (популярные в аниме)
- `sparkles`, `glowing particles` — блёстки, светящиеся частицы
- `cherry blossom petals falling` — падающие лепестки сакуры
- `speed lines` — линии скорости
- `dramatic backlighting` — драматичная контровая подсветка
- `ethereal glow` — эфирное свечение
- `rain drops catching light` — капли дождя ловят свет
- `magical circle` — магический круг

---

## Типичные сценарии использования

### Аниме-портрет
```
A serene young woman with long silver hair and deep blue eyes, wearing an elegant dark kimono with crane patterns, standing under a blooming cherry blossom tree, soft pink petals falling, gentle wind, watercolor anime style, dreamy atmosphere --ar 3:4 --s 200 --niji 7
```

### Боевая сцена
```
A fierce warrior with wild red hair and golden eyes, mid-leap wielding a flaming katana, slashing through dark energy, speed lines and dynamic motion blur, dramatic backlighting, intense expression, shonen anime style --ar 16:9 --s 300 --niji 7
```

### Slice of Life
```
Two friends sharing an umbrella in light rain, quiet city street with warm streetlights and puddle reflections, cozy evening atmosphere, soft colors, slice of life anime --ar 4:5 --s 150 --niji 7
```

### Фэнтезийный персонаж
```
An elegant dark elf mage with white braided hair and violet eyes, ornate black and gold robes, holding a glowing crystal staff, ancient magical library with floating books, mysterious lighting, detailed fantasy anime style --ar 2:3 --s 250 --niji 7
```

### Пейзаж (scenic)
```
A tiny shrine on a cliff overlooking a vast ocean at golden hour, torii gate silhouetted against the sky, clouds painted in orange and purple, Studio Ghibli inspired, breathtaking scenery --ar 16:9 --s 300 --niji 7
```

### Кавайный стиль
```
An adorable chibi witch with oversized hat and sparkling green eyes, sitting on a giant mushroom, colorful forest with glowing mushrooms, whimsical, cute anime style, pastel colors --ar 1:1 --s 200 --niji 7
```

---

## Сравнение Niji с обычными моделями для аниме

| Аспект | Niji 7 | V7 (с аниме-промптом) |
|--------|--------|----------------------|
| Качество аниме-стиля | Отличное | Хорошее |
| Линии и контуры | Чистые, профессиональные | Менее точные |
| Глаза | Кристально чистые | Хорошие, но менее детальные |
| Манга-стилистика | Родная | Приблизительная |
| Фотореализм | Не предназначена | Отличный |
| --sref стабильность | Лучшая | Хорошая |
| --cref | Нет (в разработке) | Нет |
| Персонализация | Да (с февраля 2026) | Да |

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них аниме-генерация будет слабой)
1. **Персонаж/Субъект** — кто изображён. Для аниме особенно важны: тип персонажа, внешность, выражение лица, поза.
2. **Стиль аниме** — явное указание стиля: «anime style», «manga illustration», «cel shaded», стиль конкретной студии (Ghibli, Ufotable, MAPPA). Без этого Niji использует дефолт, который может не совпасть с ожиданиями.
3. **Окружение/Фон** — для аниме фон часто не менее важен, чем персонаж.

### Бонусные элементы (улучшают аниме-результат)
4. **Детали внешности** — цвет и стиль волос, цвет глаз, одежда. Niji 7 буквально следует описаниям.
5. **Динамическая поза** — если это боевая или экшн сцена, описание действия и движения.
6. **Настроение/Атмосфера** — dreamy, intense, melancholic, whimsical — задаёт тон.
7. **Аниме-специфичные эффекты** — sparkles, speed lines, cherry blossoms, magical glow.
8. **Цветовая палитра** — warm sunset tones, pastel colors, dark moody palette.
9. **Style Reference (--sref)** — в Niji 7 работает лучше всех версий, минимальный дрейф.

### Антипаттерны (ухудшают аниме-результат)
- **Фотореалистические термины в аниме-промпте** — «shot on Canon R5, 85mm lens, bokeh» бессмысленны для аниме-стиля
- **Использование --cref с Niji 7** — параметр не поддерживается, будет проигнорирован
- **Стилевые пресеты с Niji 7** — `--style expressive/cute/scenic` работают только с Niji 6
- **Слишком реалистичные описания** — «photorealistic anime» — противоречие для Niji
- **Спам качества** — «8k, ultra detailed, best quality, masterpiece» — Niji это не улучшает
- **Отсутствие аниме-контекста** — промпт «a woman in a garden» без аниме-маркеров даст невыразительный результат
- **Западные стилевые маркеры** — «Marvel style», «Disney Pixar» конфликтуют с аниме-эстетикой Niji
- **Слишком длинные описания** — более 150 токенов перегружают модель, детали конфликтуют
- **Промпт на Niji 6 без обновления** — если пользователь не использует --cref или стилевые пресеты, стоит предложить Niji 7

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Для аниме-портретов детали лица и волос важнее освещения
- Для экшн-сцен поза и движение важнее фона
- Для scenic/пейзажей окружение важнее персонажа
- Chibi-стиль намеренно упрощает пропорции — это не ошибка
- Niji 7 более буквальна — если пользователь описал «red shirt», рубашка будет красной (а не «тёплого оттенка»)
- Использование Niji 6 вместо 7 допустимо, если пользователю нужны --cref или стилевые пресеты
- Если промпт подходит для Niji, но использует V7 — стоит рекомендовать переключение на --niji 7
- Смешивание аниме и реализма допустимо, если это осознанный выбор (например, «anime characters in a photorealistic city»)
