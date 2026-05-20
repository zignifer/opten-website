// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for flux-kontext.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для FLUX Kontext: структура, ошибки, примеры",
    description:
      "Как писать промпты для FLUX Kontext (Pro/Max/Multi): инструкции редактирования, что сохранять, итеративные правки, типичные ошибки и примеры до/после.",
    h1: "FLUX Kontext: как писать промпты, которые модель понимает",
    intro:
      "FLUX Kontext — image-to-image модель редактирования от Black Forest Labs (Pro, Max, Multi). Принимает входное изображение плюс инструкцию по изменению. Главное отличие от обычных text-to-image моделей — Kontext видит исходник и не нужно переописывать всю сцену; промпт описывает только что изменить.",
    sections: [
      {
        heading: "Что умеет FLUX Kontext",
        body:
          "Kontext — это инструмент для surgical editing: замена объектов, изменение одежды и фона, перенос стиля, редактирование текста, добавление и удаление элементов. Модель сохраняет всё, что не упомянуто в промпте, что делает её идеальной для итеративной работы.\n\nВарианты: [pro] — высокое качество, [max] — максимальная точность плюс лучший рендеринг текста, [dev] — опенсорс. Kontext Multi позволяет комбинировать 2+ входных изображения в одной генерации — например, перенос лица из одного снимка в сцену из другого.",
        bullets: [
          "Image-to-image редактирование с сохранением неизменённых областей",
          "Варианты: Pro, Max, Multi (multi-image), dev",
          "Топ-класс по рендерингу текста (особенно [max])",
          "Поддержка итеративных правок с сохранением идентичности",
          "Multi-image композитинг до 2+ источников",
        ],
      },
      {
        heading: "Принципиальное отличие от text-to-image",
        body:
          "Kontext видит исходное изображение. Это меняет логику промпта:\n\nНЕ НУЖНО описывать всю сцену целиком. НУЖНО описать только что ИЗМЕНИТЬ. Модель сохранит всё, что не упомянуто.\n\nПлохо: «A woman with red hair wearing a blue dress standing in a park with autumn trees» (это промпт для text-to-image).\n\nХорошо: «Change her hair color to red» (конкретное изменение).\n\nКороткий промпт «Change the car to red» — это нормально для Kontext, не недостаток. Длина оправдана только для сложных трансформаций.",
      },
      {
        heading: "Структура промпта и уровни детализации",
        body:
          "Формула: [Что изменить] + [Как изменить] + [Что сохранить (опционально)].\n\nУровень 1 (Quick Edit): «Change the car to red» — для простых правок.\n\nУровень 2 (Controlled Edit): «Change the car to bright red while keeping everything else identical, maintain the same lighting and background» — с указанием что сохранить.\n\nУровень 3 (Complex Transformation): «Change the background to a beach while keeping the person in the exact same position, maintain identical subject placement, camera angle, framing, and perspective. Only replace the environment around them» — для серьёзных изменений.",
      },
      {
        heading: "Контроль глаголов и точные указания",
        body:
          "Глагол определяет масштаб изменения:\n\n«change» — точечная замена. «transform» — глобальное преобразование, может изменить идентичность. «convert» — стилевая конверсия (style transfer). «add» — дополнение без изменения существующего. «replace» — замена конкретного элемента.\n\nДля сохранения лица используй «change», не «transform»: «Transform the person into a Viking» может полностью сменить идентичность. «Change the clothing to Viking armor while keeping the same facial features» — сохранит лицо.\n\nИзбегай местоимений. Вместо «she» или «the person» используй описательные фразы: «the woman with short black hair», «the car on the left».",
      },
      {
        heading: "Работа с текстом и итеративные правки",
        body:
          "Для редактирования надписей используй кавычки: «Change the text on the sign to 'HELLO WORLD'», «Replace 'OPEN' with 'CLOSED' on the door sign». Длина нового текста влияет на layout — старайся сохранять примерно равную длину. Для сохранения шрифта: «maintain the same font style».\n\nKontext поддерживает цепочку итеративных правок с сохранением идентичности персонажа. Каждый шаг берёт результат предыдущего как вход: (1) исходник, (2) «Change the blue headscarf to green», (3) «Put the woman with the green headscarf in a jungle», (4) «Add rain and dramatic lighting». Лучше серия коротких точных правок, чем одна огромная инструкция.",
      },
    ],
    examples: [
      {
        before: "make the image more interesting and cool with better colors",
        after:
          "Change the sky from overcast grey to a vibrant sunset with orange and pink clouds. Keep the building, people, and street unchanged. Maintain the same camera angle, framing, and shadow direction on the ground.",
        note:
          "«Make it better» — модель не знает что менять. Конкретное указание ЧТО → ЧТО плюс preserve-блок дают предсказуемый результат.",
      },
      {
        before: "A beautiful woman with red hair in a blue dress on a beach",
        after:
          "Change the woman's dress from black to navy blue. Change the background from the original setting to a tropical beach at sunset. Keep her exact facial features, pose, body position, and hair unchanged.",
        note:
          "Первый промпт — полное описание сцены с нуля, как для text-to-image. Kontext видит исходник; нужны конкретные правки с явным preserve-списком для лица и позы.",
      },
      {
        before: "change the sign",
        after:
          "Replace the text on the wooden shop sign to read \"LIBRARY\" in elegant gold serif lettering. Maintain the original sign shape, brick wall background, lighting, and shadows. Match the existing font weight and color tone as closely as possible.",
        note:
          "Кавычки фиксируют точный новый текст. Указание шрифта, фиксация фона и тени делают замену чистой и читаемой.",
      },
    ],
    mistakes: [
      {
        title: "Полное описание сцены вместо инструкции редактирования",
        explain:
          "«A woman with red hair in a blue dress standing in a park» — это промпт для text-to-image, не для Kontext. Модель видит исходное изображение; описывать то, что уже есть, не нужно. Описывай только изменения: «Change her hair to red» или «Change the dress to blue».",
      },
      {
        title: "Размытые инструкции «make it better»",
        explain:
          "«Make it better», «Improve the image», «Make it more interesting» — модель не знает что конкретно менять. Указывай чёткое действие: «Change X to Y», «Add Z», «Remove W», «Convert to style S». Конкретика обязательна.",
      },
      {
        title: "Глагол «transform» для точечных правок",
        explain:
          "«Transform the person into a Viking» может полностью сменить идентичность — лицо, телосложение, всё. Для сохранения лица используй «change»: «Change the clothing to Viking armor while keeping the same facial features». Глагол определяет масштаб.",
      },
      {
        title: "Слишком много изменений за один промпт",
        explain:
          "«Change the background, add glasses, change hair color, add a hat, and make it cartoon style» — перегрузка. Kontext работает чище через цепочку из 2-3 простых правок: сначала фон, потом аксессуары, потом стиль. Каждый шаг сохраняет идентичность лучше.",
      },
      {
        title: "Местоимения вместо описательных фраз",
        explain:
          "«Change her dress» в изображении с двумя женщинами — неоднозначно, модель не знает кого редактировать. Используй описание: «the woman on the left», «the woman with dark hair», «the person in the red jacket». Для текста — «the sign above the door».",
      },
    ],
    faq: [
      {
        q: "В чём разница между Kontext Pro, Max и Multi?",
        a: "[Pro] — высокое качество для большинства задач редактирования. [Max] — максимальная точность плюс лучший рендеринг текста в кадре; используй когда меняешь надписи или редактируешь типографику. [Multi] — позволяет передать 2+ входных изображения в одну генерацию: например, перенести лицо из одного снимка в сцену из другого. [dev] — опенсорс-вариант с меньшим качеством, но для исследований и некоммерческого использования.",
      },
      {
        q: "Нужно ли описывать сохранение каждого элемента?",
        a: "Не всегда. Для простых правок Kontext по умолчанию сохраняет всё неупомянутое. Но для смены фона, окружения или сложных трансформаций явный preserve-блок резко повышает стабильность: «while keeping the same facial features», «maintain the original composition», «keep the lighting and camera angle». Особенно критично при итеративных правках — иначе модель «дрейфует».",
      },
      {
        q: "Как редактировать текст без потери шрифта?",
        a: "Используй кавычки для точного нового текста: «Replace 'OPEN' with 'CLOSED'». Добавь «maintain the same font style and color» и старайся сохранить примерно равную длину нового текста — это удерживает layout. Для сложных шрифтов или редкой типографики ставь Kontext Max, у него лучший рендеринг текста среди вариантов модели.",
      },
      {
        q: "Можно ли использовать Kontext для text-to-image без входного изображения?",
        a: "Технически да, но это не основной режим модели. Без входного изображения Kontext работает как обычный text-to-image, но качество ниже, чем у FLUX.1 [pro] и [1.1 pro] Ultra, специализирующихся на T2I. Для генерации с нуля используй FLUX.1, для редактирования — Kontext.",
      },
      {
        q: "Как делать сложные трансформации без потери идентичности?",
        a: "Разбивай на цепочку из 2-3 простых правок. Не пытайся «change background + add glasses + change hair + make it cartoon» одним промптом — Kontext путается. Лучше: (1) поменять фон, (2) добавить аксессуары, (3) применить стиль. Каждый шаг берёт результат предыдущего как вход — это сохраняет лицо и позу через всю цепочку.",
      },
      {
        q: "Поддерживает ли Kontext SD-синтаксис?",
        a: "Нет. Веса вида `(word:1.5)`, `word++`, embeddings, LoRA-ссылки не работают и попадают в промпт как литеральный мусор. Регулируй приоритеты порядком слов (важное — в начало инструкции) и явными формулировками «with emphasis on», «focus on». Это семейство моделей построено на T5-XXL, не на SD-стеке.",
      },
      {
        q: "Поддерживается ли Opten для FLUX Kontext?",
        a: "Да, расширение Opten автоматически распознаёт FLUX Kontext и оценивает промпты по структуре редактирования, описанной выше: проверяет наличие конкретного действия, явного preserve-блока для сложных правок, правильного глагола (change vs transform), использования кавычек для текста и описательных фраз вместо местоимений. Одним кликом — rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "FLUX Kontext Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for FLUX Kontext (Pro/Max/Multi): edit instructions, preserve blocks, iterative editing, common mistakes, and before/after examples.",
    h1: "FLUX Kontext: how to write prompts the model actually understands",
    intro:
      "FLUX Kontext is Black Forest Labs' image-to-image editing model (Pro, Max, Multi). It accepts an input image plus a change instruction. The key difference from regular text-to-image models — Kontext sees the source and there's no need to redescribe the whole scene; the prompt describes only what to change.",
    sections: [
      {
        heading: "What FLUX Kontext does well",
        body:
          "Kontext is a surgical editing tool: object swaps, clothing and background changes, style transfer, text editing, adding and removing elements. The model preserves everything not mentioned in the prompt, which makes it ideal for iterative work.\n\nVariants: [pro] — high quality, [max] — maximum accuracy plus best in-image text rendering, [dev] — open source. Kontext Multi combines 2+ input images into a single generation — for example, transferring a face from one shot into a scene from another.",
        bullets: [
          "Image-to-image editing that preserves unchanged regions",
          "Variants: Pro, Max, Multi (multi-image), dev",
          "Top-tier in-image text rendering (especially [max])",
          "Iterative editing with identity preservation",
          "Multi-image compositing across 2+ sources",
        ],
      },
      {
        heading: "Key difference from text-to-image",
        body:
          "Kontext sees the input image. This changes the prompt logic:\n\nDON'T describe the whole scene. DO describe only what to CHANGE. The model preserves anything not mentioned.\n\nBad: «A woman with red hair wearing a blue dress standing in a park with autumn trees» (that's a text-to-image prompt).\n\nGood: «Change her hair color to red» (a concrete change).\n\nA short prompt like «Change the car to red» is normal for Kontext, not a flaw. Length is justified only for complex transformations.",
      },
      {
        heading: "Prompt structure and detail levels",
        body:
          "Formula: [What to change] + [How to change] + [What to preserve (optional)].\n\nLevel 1 (Quick Edit): «Change the car to red» — for simple edits.\n\nLevel 2 (Controlled Edit): «Change the car to bright red while keeping everything else identical, maintain the same lighting and background» — with explicit preservation.\n\nLevel 3 (Complex Transformation): «Change the background to a beach while keeping the person in the exact same position, maintain identical subject placement, camera angle, framing, and perspective. Only replace the environment around them» — for serious changes.",
      },
      {
        heading: "Verb control and precise pointers",
        body:
          "The verb defines the scale of change:\n\n«change» — targeted swap. «transform» — global transformation, can alter identity. «convert» — stylistic conversion (style transfer). «add» — addition without modifying existing content. «replace» — substitution of a specific element.\n\nTo preserve a face use «change», not «transform»: «Transform the person into a Viking» may fully shift identity. «Change the clothing to Viking armor while keeping the same facial features» preserves the face.\n\nAvoid pronouns. Instead of «she» or «the person» use descriptive phrases: «the woman with short black hair», «the car on the left».",
      },
      {
        heading: "Text editing and iterative work",
        body:
          "For text edits use quotes: «Change the text on the sign to 'HELLO WORLD'», «Replace 'OPEN' with 'CLOSED' on the door sign». The new text length affects layout — try to keep roughly similar length. To preserve the font: «maintain the same font style».\n\nKontext supports an iterative edit chain with character identity preservation. Each step takes the previous result as input: (1) source, (2) «Change the blue headscarf to green», (3) «Put the woman with the green headscarf in a jungle», (4) «Add rain and dramatic lighting». A series of short precise edits beats one huge instruction.",
      },
    ],
    examples: [
      {
        before: "make the image more interesting and cool with better colors",
        after:
          "Change the sky from overcast grey to a vibrant sunset with orange and pink clouds. Keep the building, people, and street unchanged. Maintain the same camera angle, framing, and shadow direction on the ground.",
        note:
          "«Make it better» — the model doesn't know what to change. A concrete X → Y instruction plus a preserve block yields predictable results.",
      },
      {
        before: "A beautiful woman with red hair in a blue dress on a beach",
        after:
          "Change the woman's dress from black to navy blue. Change the background from the original setting to a tropical beach at sunset. Keep her exact facial features, pose, body position, and hair unchanged.",
        note:
          "The first prompt is a full from-scratch scene description, like text-to-image. Kontext sees the source; concrete edits with an explicit preserve list for face and pose are required.",
      },
      {
        before: "change the sign",
        after:
          "Replace the text on the wooden shop sign to read \"LIBRARY\" in elegant gold serif lettering. Maintain the original sign shape, brick wall background, lighting, and shadows. Match the existing font weight and color tone as closely as possible.",
        note:
          "Quotes lock the new text exactly. Specifying font, fixing background and shadows makes the replacement clean and legible.",
      },
    ],
    mistakes: [
      {
        title: "Full scene description instead of edit instruction",
        explain:
          "«A woman with red hair in a blue dress standing in a park» is a text-to-image prompt, not a Kontext one. The model sees the input image; describing what's already there is unnecessary. Describe only the changes: «Change her hair to red» or «Change the dress to blue».",
      },
      {
        title: "Vague instructions like «make it better»",
        explain:
          "«Make it better», «Improve the image», «Make it more interesting» — the model doesn't know what to change specifically. State a clear action: «Change X to Y», «Add Z», «Remove W», «Convert to style S». Specificity is mandatory.",
      },
      {
        title: "Verb «transform» for targeted edits",
        explain:
          "«Transform the person into a Viking» may fully alter identity — face, build, everything. To preserve the face use «change»: «Change the clothing to Viking armor while keeping the same facial features». The verb defines the scale.",
      },
      {
        title: "Too many changes in a single prompt",
        explain:
          "«Change the background, add glasses, change hair color, add a hat, and make it cartoon style» — overload. Kontext works cleaner via a chain of 2-3 simple edits: background first, then accessories, then style. Each step preserves identity better.",
      },
      {
        title: "Pronouns instead of descriptive phrases",
        explain:
          "«Change her dress» in an image with two women is ambiguous — the model doesn't know which one to edit. Use descriptions: «the woman on the left», «the woman with dark hair», «the person in the red jacket». For text: «the sign above the door».",
      },
    ],
    faq: [
      {
        q: "What is the difference between Kontext Pro, Max, and Multi?",
        a: "[Pro] — high quality for most editing tasks. [Max] — maximum accuracy plus the best in-image text rendering; use it when changing signage or editing typography. [Multi] — accepts 2+ input images in a single generation: for example, transferring a face from one shot into a scene from another. [dev] — open-source variant with lower quality, for research and non-commercial use.",
      },
      {
        q: "Do all preserved elements need to be listed?",
        a: "Not always. For simple edits Kontext preserves the unmentioned by default. But for background swaps, environment changes, or complex transformations an explicit preserve block sharply boosts stability: «while keeping the same facial features», «maintain the original composition», «keep the lighting and camera angle». Especially critical during iterative edits — otherwise the model drifts.",
      },
      {
        q: "How can text be edited without losing the font?",
        a: "Use quotes for the exact new text: «Replace 'OPEN' with 'CLOSED'». Add «maintain the same font style and color» and try to keep roughly similar text length — that holds the layout. For complex fonts or rare typography use Kontext Max, which has the best text rendering among the variants.",
      },
      {
        q: "Can Kontext be used as text-to-image without an input image?",
        a: "Technically yes, but it's not the primary mode. Without an input image Kontext works as a regular text-to-image, but quality is lower than FLUX.1 [pro] and [1.1 pro] Ultra, which specialize in T2I. For from-scratch generation use FLUX.1; for editing use Kontext.",
      },
      {
        q: "How do you do complex transformations without losing identity?",
        a: "Break them into a chain of 2-3 simple edits. Don't try «change background + add glasses + change hair + make it cartoon» in one prompt — Kontext gets confused. Better: (1) change the background, (2) add accessories, (3) apply the style. Each step takes the previous result as input, which preserves face and pose across the chain.",
      },
      {
        q: "Does Kontext support SD syntax?",
        a: "No. Weights like `(word:1.5)`, `word++`, embeddings, LoRA references don't work and land in the prompt as literal noise. Regulate priorities via word order (important content first in the instruction) and explicit phrasing like «with emphasis on», «focus on». This family is built on T5-XXL, not the SD stack.",
      },
      {
        q: "Does Opten support FLUX Kontext?",
        a: "Yes, the Opten extension auto-detects FLUX Kontext and scores prompts against the edit structure outlined above: it checks for a concrete action, an explicit preserve block on complex edits, the right verb (change vs transform), use of quotes for text, and descriptive phrases instead of pronouns. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
