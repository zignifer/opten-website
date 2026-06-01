import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-27";

const COVER_RU = {
  src: "/blog/negative-prompt/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про негативный промпт для нейросетей",
};

const COVER_EN = {
  src: "/blog/negative-prompt/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a negative prompt guide for AI image generation",
};

const ru: BlogPostLocale = {
  slug: "negative-prompt",
  title: "Негативный промпт: как убирать артефакты",
  excerpt:
    "Что такое негативный промпт, когда он помогает в Imagen 4 Ultra, Midjourney 8.1 и Seedream 5, а когда лучше писать позитивные ограничения сцены.",
  description:
    "Гайд по negative prompt: что такое негативный промпт, как убрать артефакты и не сломать кадр в Imagen 4 Ultra, Midjourney 8.1 и Seedream 5 на практике.",
  category: "guide",
  tags: ["prompt-engineering", "ai-image-gen", "workflow"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "image-to-video"],
  body: {
    intro:
      "Негативный промпт - это блок запретов для генерации изображений: он объясняет нейросети, чего не должно быть в кадре. Он полезен против артефактов, лишних пальцев, грязного фона и нежелательного стиля, но работает лучше всего рядом с четким позитивным описанием сцены, а не как список случайных слов.",
    steps: [
      {
        title: "Разделите, что оставить и что убрать",
        body:
          "Сначала напишите позитивный промпт: кто в кадре, где он находится, какой свет, материал, ракурс и настроение нужны. Только после этого добавляйте negative prompt. Если начать с запретов, модель получает карту того, чего бояться, но не получает ясной цели. В Imagen 4 Ultra и Seedream 5 это особенно заметно на предметной съемке: фраза «матовая керамическая чашка на темном столе, мягкий боковой свет» дает стабильнее результат, чем длинный список «no plastic, no glare, no blur» без главного описания.",
        before:
          "negative prompt: ugly, bad, blurry, plastic, weird, deformed",
        after:
          "Позитивно: матовая керамическая чашка на темном столе, мягкий боковой свет. Негативно: no glossy plastic, no warped handle, no extra objects.",
        imageSrc: "/blog/negative-prompt/ru/step-1.jpg",
      },
      {
        title: "Пишите мягкие запреты вместо мусорных списков",
        body:
          "Разговорный запрос «как убрать артефакты в нейросети» обычно решается не сотней тегов, а коротким списком точных рисков. Для портрета это могут быть руки, кожа, зубы, фон и лишние объекты. Для логотипа - мелкий текст, псевдобуквы, сложные тени и фото-фактура. В Midjourney 8.1 старые negative prompt списки из Stable Diffusion часто дают непредсказуемый эффект, поэтому лучше использовать `--no` только для конкретных объектов или признаков, а стиль задавать в основном промпте.",
        before:
          "no ugly, no bad anatomy, no low quality, no worst quality, no jpeg artifacts, no mutation, no noise, no text, no logo",
        after:
          "no extra fingers, no melted jewelry, no text in background, no plastic skin",
        imageSrc: "/blog/negative-prompt/ru/step-2.jpg",
      },
      {
        title: "Ограничьте negative prompt до 3-7 правил",
        body:
          "Чем длиннее запретный блок, тем выше шанс, что модель начнет спорить сама с собой. Правило для рабочих промптов простое: оставьте только те ошибки, которые реально вероятны для конкретного кадра. Если генерируете предмет, не нужно запрещать лишние пальцы. Если делаете портрет, не тратьте место на «no watermark», если в сцене нет причин для водяного знака. GPT Image 2 и Nano Banana Pro часто лучше слушают позитивную инструкцию «clean empty background, readable product silhouette» вместо перегруженного негативного хвоста.",
        before:
          "no hands, no people, no cars, no animals, no city, no text, no blur, no artifacts, no bad quality, no shadows, no reflections, no dust",
        after:
          "no extra objects, no warped edges, no unreadable text, no harsh reflections",
        imageSrc: "/blog/negative-prompt/ru/step-3.jpg",
      },
      {
        title: "Проверяйте модель на первом рендере",
        body:
          "Практический кейс: для fashion-кадра в Imagen 4 Ultra первый рендер сделал кожу слишком пластиковой и добавил шестой палец на видимой руке. Исправление сработало не через общий «bad anatomy», а через точный патч: `natural skin texture, preserve five fingers on each visible hand; negative: no glossy plastic skin, no extra fingers, no fused fingers`. После этого поза сохранилась, но рука и фактура стали нормальными. Такой тест стоит делать до финальной серии: один рендер показывает, какие именно запреты нужны вашей модели.",
        before:
          "Портрет модели в зеленом пальто, студийный свет, модный журнал. Negative: bad anatomy.",
        after:
          "Портрет модели в зеленом пальто, студийный свет. Preserve five fingers on each visible hand. Negative: no glossy plastic skin, no extra fingers, no fused fingers.",
        imageSrc: "/blog/negative-prompt/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое негативный промпт?",
        a: "Негативный промпт - это часть запроса, где вы перечисляете, чего не должно быть в изображении: лишние пальцы, шум, грязный фон, водяные знаки, нежелательный стиль или объекты. Он не заменяет основной промпт, а уточняет границы результата.",
      },
      {
        q: "Как писать негативный промпт для нейросети?",
        a: "Сначала опишите нужный кадр позитивно, затем добавьте 3-7 конкретных запретов под риск этой сцены. Не копируйте универсальные списки. Для портрета укажите руки, кожу и фон; для предмета - форму, материал, лишние объекты и блики.",
      },
      {
        q: "Как убрать артефакты в AI изображении?",
        a: "Назовите конкретный артефакт и перепишите его как ограничение: не «bad quality», а «no extra fingers», «no warped logo», «no melted edges», «no unreadable text». Если модель плохо поддерживает negative prompt, перенесите ограничение в позитивную инструкцию.",
      },
      {
        q: "Почему negative prompt иногда ухудшает картинку?",
        a: "Слишком длинный или общий negative prompt отвлекает модель от главной сцены. Запреты вроде «ugly, bad, worst quality» часто не дают понятной визуальной команды. Чем точнее и короче запрет, тем меньше риск, что модель потеряет композицию.",
      },
      {
        q: "Нужен ли негативный промпт в GPT Image 2?",
        a: "Для GPT Image 2 чаще полезнее писать позитивные ограничения естественным языком: «keep background clean», «preserve five fingers», «avoid text in the scene». Если интерфейс поддерживает отдельное negative-поле, используйте его коротко, но не переносите туда старые Stable Diffusion списки.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "negative-prompt",
  title: "Negative prompt: remove AI image artifacts",
  excerpt:
    "What a negative prompt is, when it helps in Imagen 4 Ultra, Midjourney 8.1, and Seedream 5, and when positive scene constraints work better.",
  description:
    "Learn how to write a negative prompt, remove AI image artifacts, and avoid overloading models like Imagen 4 Ultra, Midjourney 8.1, and Seedream 5 in practice.",
  category: "guide",
  tags: ["prompt-engineering", "ai-image-gen", "workflow"],
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "image-to-video"],
  body: {
    intro:
      "A negative prompt is the constraint block in an AI image prompt: it tells the model what must not appear in the frame. It helps with artifacts, extra fingers, noisy backgrounds, unwanted styles, and accidental objects, but it works best beside a clear positive scene description, not as a random pile of banned words.",
    steps: [
      {
        title: "Separate what to keep from what to remove",
        body:
          "Write the positive prompt first: subject, setting, light, material, camera angle, and intended mood. Then add the negative prompt. If you start with bans, the model gets a map of what to avoid but no strong target. In Imagen 4 Ultra and Seedream 5, this is obvious on product imagery: «matte ceramic cup on a dark table, soft side light» is more stable than a long «no plastic, no glare, no blur» list without the actual scene.",
        before:
          "negative prompt: ugly, bad, blurry, plastic, weird, deformed",
        after:
          "Positive: matte ceramic cup on a dark table, soft side light. Negative: no glossy plastic, no warped handle, no extra objects.",
        imageSrc: "/blog/negative-prompt/en/step-1.jpg",
      },
      {
        title: "Use soft blocks instead of junk lists",
        body:
          "The query «how to remove AI image artifacts» is usually solved by a short list of exact risks, not by a hundred inherited tags. For portraits, those risks are hands, skin, teeth, background, and unwanted objects. For a logo, they are tiny text, pseudo-letters, complex shadows, and photo texture. In Midjourney 8.1, old Stable Diffusion negative lists can behave unpredictably, so use `--no` for specific objects or traits and keep style control in the main prompt.",
        before:
          "no ugly, no bad anatomy, no low quality, no worst quality, no jpeg artifacts, no mutation, no noise, no text, no logo",
        after:
          "no extra fingers, no melted jewelry, no text in background, no plastic skin",
        imageSrc: "/blog/negative-prompt/en/step-2.jpg",
      },
      {
        title: "Keep the negative prompt to 3-7 rules",
        body:
          "The longer the banned list gets, the more likely the model is to fight itself. The practical rule is simple: keep only the mistakes that are plausible for this specific image. If you generate a product shot, there is no reason to ban extra fingers. If you generate a portrait, do not spend space on «no watermark» unless the scene has a real watermark risk. GPT Image 2 and Nano Banana Pro often respond better to positive constraints like «clean empty background, readable product silhouette» than to a bloated negative tail.",
        before:
          "no hands, no people, no cars, no animals, no city, no text, no blur, no artifacts, no bad quality, no shadows, no reflections, no dust",
        after:
          "no extra objects, no warped edges, no unreadable text, no harsh reflections",
        imageSrc: "/blog/negative-prompt/en/step-3.jpg",
      },
      {
        title: "Test the model on the first render",
        body:
          "A practical case: for a fashion image in Imagen 4 Ultra, the first render made the skin too glossy and gave one visible hand six fingers. The fix was not a vague «bad anatomy» tag; it was a precise patch: `natural skin texture, preserve five fingers on each visible hand; negative: no glossy plastic skin, no extra fingers, no fused fingers`. The pose stayed intact, while the hand and skin texture became normal. Run this test before a final batch: one render shows which constraints your model actually needs.",
        before:
          "Fashion portrait in a green coat, studio light, magazine look. Negative: bad anatomy.",
        after:
          "Fashion portrait in a green coat, studio light. Preserve five fingers on each visible hand. Negative: no glossy plastic skin, no extra fingers, no fused fingers.",
        imageSrc: "/blog/negative-prompt/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What is a negative prompt?",
        a: "A negative prompt is the part of an AI image prompt where you list what should not appear: extra fingers, noise, messy background, watermarks, unwanted style, or accidental objects. It does not replace the main prompt; it narrows the output boundaries.",
      },
      {
        q: "How do you write a negative prompt?",
        a: "Describe the desired image first, then add 3-7 specific bans that match the scene risk. Do not copy universal lists. For portraits, mention hands, skin, and background; for product shots, mention shape, material, extra objects, and reflections.",
      },
      {
        q: "How do you remove AI image artifacts?",
        a: "Name the artifact and turn it into a direct constraint: not «bad quality», but «no extra fingers», «no warped logo», «no melted edges», or «no unreadable text». If the model does not support negative prompts well, move the same constraint into positive language.",
      },
      {
        q: "Why can negative prompts make images worse?",
        a: "A long or generic negative prompt pulls attention away from the main scene. Bans like «ugly, bad, worst quality» are not clear visual instructions. Short, specific constraints reduce the risk of losing composition.",
      },
      {
        q: "Do you need a negative prompt for GPT Image 2?",
        a: "GPT Image 2 often works better with natural positive constraints: «keep background clean», «preserve five fingers», «avoid text in the scene». If your interface has a separate negative field, keep it short and avoid old Stable Diffusion tag dumps.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
