# FLUX Kontext — Skill для PromptScore

> Этот документ используется AI-валидатором PromptScore как база знаний при оценке промптов для FLUX Kontext (Pro, Max, Multi).
> **ВАЖНО: FLUX Kontext — это модель РЕДАКТИРОВАНИЯ изображений.** Промпт описывает ИЗМЕНЕНИЯ к существующему изображению, а не полную сцену с нуля.
> Источники: https://docs.bfl.ml/guides/prompting_guide_kontext_i2i, https://replicate.com/blog/flux-kontext, https://fluxai.pro/blog/flux-kontext-prompt-guide, https://www.mimicpc.com/learn/flux-kontext-prompt-guide-how-to-edit-images

## Идентификация

- **model_id:** flux-kontext
- **model_name:** FLUX Kontext Pro / Max / Multi
- **type:** image
- **platform:** Replicate, BFL API, Segmind, ComfyUI, fal.ai и др.
- **best_language:** English — FLUX Kontext оптимизирована для английского языка.

---

## Ограничения платформы

| Параметр | Значение |
|----------|----------|
| Тип модели | Image-to-image editing (i2i). Принимает входное изображение + текстовый промпт с инструкцией по редактированию |
| Варианты | [pro] — высокое качество, [max] — максимальная точность + типографика, [dev] — опенсорс |
| Multi-image | Kontext Multi позволяет комбинировать 2+ входных изображения |
| Входное изображение | Обязательно (без него модель работает как обычный text-to-image, но это не её основной режим) |
| Особенность | Модель видит и понимает входное изображение. НЕ нужно описывать то, что уже есть — только изменения |
| Текст в изображениях | Отличный рендеринг текста (особенно [max]) |

---

## Принципиальное отличие от text-to-image

**FLUX Kontext видит исходное изображение.** Это ключевое отличие:

- **НЕ НУЖНО** описывать всю сцену целиком
- **НУЖНО** описать только что ИЗМЕНИТЬ
- Модель сохранит всё, что не упомянуто в промпте (если не указано иное)

Пример:
- **Плохо:** «A woman with red hair wearing a blue dress standing in a park with autumn trees» (полное описание с нуля)
- **Хорошо:** «Change her hair color to red» (конкретное изменение)

---

## Структура хорошего промпта

Промпт для FLUX Kontext = инструкция по редактированию:

```
[Что изменить] + [Как изменить] + [Что сохранить (опционально)]
```

### Три уровня детализации

#### Уровень 1: Быстрое редактирование (Quick Edit)
Минимальная инструкция для простого изменения:
```
Change the car to red
```

#### Уровень 2: Контролируемое редактирование (Controlled Edit)
Конкретная инструкция с указанием что сохранить:
```
Change the car to bright red while keeping everything else identical, maintain the same lighting and background
```

#### Уровень 3: Комплексная трансформация (Complex Transformation)
Подробная инструкция для серьёзных изменений:
```
Change the background to a beach while keeping the person in the exact same position, maintain identical subject placement, camera angle, framing, and perspective. Only replace the environment around them.
```

---

## Типы редактирования

### 1. Изменение объектов
Замена цвета, материала, формы объектов:
- «Change the car to red»
- «Replace the wooden table with a glass one»
- «Make the building taller»

### 2. Изменение внешности / одежды
Редактирование людей с сохранением идентичности:
- «Give her a gold necklace»
- «Give her a Pixie haircut»
- «Change his suit to a casual t-shirt»
- **Важно:** «Transform the person into a Viking» может полностью сменить идентичность. Для сохранения лица используй: «Change the clothing to Viking armor while keeping the same facial features»

### 3. Смена фона / окружения
- «Change the background to a tropical beach»
- «Replace the indoor setting with an outdoor garden»
- «Put the person in a snowy mountain landscape while maintaining their exact position and pose»

### 4. Перенос стиля (Style Transfer)
Изменение художественного стиля всего изображения:
- «Convert to quick pencil sketch»
- «Convert to colorful gouache painting»
- «Make this a 90s cartoon»
- «Reimagine as an impressionist painting with visible brushstrokes»
- **Совет:** называй конкретный стиль/эпоху/технику, а не «make it artistic»

### 5. Редактирование текста
Изменение надписей на изображении:
- «Change the text on the sign to 'HELLO WORLD'»
- «Replace 'OPEN' with 'CLOSED' on the door sign»
- **Совет:** используй кавычки для точного текста. «Replace 'X' with 'Y'» работает лучше общих инструкций.

### 6. Добавление / удаление элементов
- «Add sunglasses to the person»
- «Remove the tree in the background»
- «Add a cat sitting on the table»

### 7. Итеративное редактирование (цепочка правок)
Kontext поддерживает последовательные правки с сохранением идентичности персонажа:
1. Исходное изображение
2. «Change the blue headscarf to green»
3. «Put the woman with the green headscarf in a jungle»
4. «Add rain and dramatic lighting»

Каждый шаг берёт результат предыдущего как входное изображение.

### 8. Комбинирование изображений (Multi-image / Kontext Multi)
Объединение элементов из двух или более изображений:
- «Place the person from the first image into the scene from the second image»
- «Combine the face from image 1 with the outfit from image 2»

---

## Продвинутые техники

### Сохранение композиции
Когда меняешь фон или окружение, явно указывай что сохранить:
```
Change the background to a beach while keeping the person in the exact same position, maintain identical subject placement, camera angle, framing, and perspective.
```

### Точные указания субъекта
Вместо местоимений используй описательные фразы:
- **Да:** «the woman with short black hair»
- **Нет:** «she» или «the person»

### Контроль степени изменений
Глагол определяет масштаб:
- **«change»** — точечная замена
- **«transform»** — глобальное преобразование (может изменить идентичность!)
- **«convert»** — стилевая конверсия
- **«add»** — дополнение без изменения существующего
- **«replace»** — замена конкретного элемента

### Работа с текстом
- Используй кавычки: «Change the text to 'NEW TEXT'»
- Указывай расположение: «on the sign», «in the banner»
- Для сохранения шрифта: «maintain the same font style»
- Длина текста влияет на layout — старайся сохранять примерно равную длину

---

## Критерии оценки промпта (для AI-валидатора)

При оценке промпта AI должен учитывать:

### Обязательные элементы (без них редактирование будет слабым)
1. **Чёткая инструкция изменения** — промпт должен ясно указывать ЧТО нужно изменить. «Change X to Y», «Add Z», «Remove W», «Convert to style S». Без конкретного действия модель не знает что делать.
2. **Конкретность** — описание изменения должно быть конкретным, не размытым. «Change to red» лучше чем «make it different». «Give her a bob haircut» лучше чем «change the hair».
3. **Указание субъекта** (при необходимости) — если в изображении несколько объектов, нужно однозначно указать какой меняется: «the car on the left», «the woman with short black hair».

### Бонусные элементы (улучшают результат)
4. **Указание что сохранить** — «while keeping the same facial features», «maintain the original composition» — помогает избежать нежелательных изменений.
5. **Конкретный стиль** (для style transfer) — название стиля, эпохи, техники: «watercolor», «1960s pop art», «pencil sketch» вместо «artistic».
6. **Степень изменения** — правильный глагол (change vs transform vs convert) задаёт масштаб.
7. **Пошаговость** (для сложных правок) — лучше разбить на серию простых изменений, чем пытаться сделать всё за один промпт.
8. **Язык** — английский даёт лучшие результаты.

### Антипаттерны (ухудшают результат)
- **Полное описание сцены с нуля** — «A woman with red hair in a blue dress standing in a park» — это промпт для text-to-image, а не для редактирования. Kontext видит исходное изображение и не нужно описывать то, что уже есть.
- **Слишком размытая инструкция** — «Make it better», «Improve the image», «Make it more interesting» — модель не знает что конкретно менять.
- **Слишком много изменений за раз** — «Change the background, add glasses, change hair color, add a hat, and make it cartoon style» — перегрузка. Лучше разбить на 2-3 шага.
- **Использование местоимений вместо описаний** — «Change her dress» в изображении с двумя женщинами — неоднозначно. Используй «the woman on the left» или «the woman with dark hair».
- **Глагол «transform» для точечных правок** — «Transform the person into X» может полностью сменить идентичность. Для сохранения лица используй «Change the clothing to X while keeping the same face».
- **Отсутствие кавычек для текста** — «Change the sign to say hello» — хуже чем «Change the sign to say 'HELLO'».
- **Prompt weights или SD-синтаксис** — FLUX Kontext НЕ поддерживает `(word)++` или `(word:1.5)`.
- **Конфликтующие инструкции** — «Make the image darker but also more vibrant and colorful» — противоречивые требования.
- **Описание желаемого результата без указания что менять** — «I want a beach scene with the person smiling» — не указано что сейчас НЕ пляж и что сейчас персонаж НЕ улыбается. Лучше: «Change the background to a beach and make the person smile».

### Контекстная оценка
AI должен понимать НАМЕРЕНИЕ пользователя:
- Промпт для Kontext — это ИНСТРУКЦИЯ РЕДАКТИРОВАНИЯ, не описание сцены
- Короткий промпт «Change the car to red» — это НОРМАЛЬНО для Kontext, если задача простая
- Длинный детальный промпт оправдан для сложных трансформаций (смена фона, стиля)
- Оценивай соответствие промпта ТИПУ изменения, а не длину ради длины
- Промпт из 5 слов для простой замены цвета — это хорошо, не штрафуй за краткость
- Для style transfer достаточно назвать конкретный стиль — не нужны 10 дополнительных описаний
- Цепочка коротких точных правок лучше одной огромной инструкции
