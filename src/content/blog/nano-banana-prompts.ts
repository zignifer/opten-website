import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-29";

const COVER_RU = {
  src: "/blog/nano-banana-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про промпты для Nano Banana Pro",
};

const COVER_EN = {
  src: "/blog/nano-banana-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a Nano Banana Pro prompts guide",
};

const ru: BlogPostLocale = {
  slug: "nano-banana-prompts",
  title: "Nano Banana Pro: как писать промпты",
  excerpt:
    "Практический workflow для Nano Banana Pro: 5 блоков промпта, выбор модели, референсы, точечные правки и финальная проверка текста, рук и композиции.",
  description:
    "Как писать промпты для Nano Banana Pro: 5 блоков, референсы, выбор модели, кейс с лишними пальцами, точная правка результата и QA перед финальным рендером.",
  category: "guide",
  tags: ["ai-image-gen", "prompt-engineering", "model-deep-dive"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "prompt-structure", "consistent-character-ai"],
  body: {
    intro:
      "Nano Banana Pro - это image-модель Google для генерации, редактирования и 4K-визуалов в экосистеме Gemini. Хороший промпт для Nano Banana Pro работает как короткий дизайн-бриф: цель, сцена, объект, стиль, референсы и ограничения. Такой порядок снижает drift, улучшает текст в кадре и экономит итерации.",
    steps: [
      {
        title: "Соберите промпт из пяти блоков",
        body:
          "Базовый nano banana prompt лучше писать не как список красивых тегов, а как бриф из пяти блоков: `Purpose`, `Scene`, `Subject`, `Style`, `Constraints`. В первом предложении укажите, что именно нужно получить: product shot, обложка, постер, hero image, UI-мокап или character reference. Затем опишите сцену и главный объект. После этого добавьте стиль, камеру, свет, материалы и только в конце ограничения. Если нужен текст на картинке, пишите его в кавычках и просите крупный headline, а не мелкую таблицу. Opten удобно использовать перед запуском: он быстро показывает, где промпт звучит как бриф, а где как набор пожеланий.",
        before:
          "banana ai poster, cool product, neon, cinematic, text, 4k",
        after:
          'Purpose: premium product poster, 16:9. Subject: matte black perfume bottle on wet volcanic stone. Scene: dark botanical studio, lime rim light. Text, exact: "NIGHT BLOOM". Constraints: no extra logos, no tiny text, preserve bottle shape.',
        imageSrc: "/blog/nano-banana-prompts/ru/step-1.jpg",
      },
      {
        title: "Выберите модель под задачу, а не по хайпу",
        body:
          "Nano Banana Pro хорош, когда нужен аккуратный image prompt с материалами, светом, предметной сценой, рекламной композицией или редактированием по референсам. GPT Image 2 часто лучше держит многоязычный текст и строгую структуру с большим количеством условий. Imagen 4 Ultra удобен для чистых фотореалистичных кадров, а Midjourney 8.1 быстрее дает сильную стилистику. Поэтому не начинайте с вопроса «какая нейросеть лучше». Начните с результата: если это premium product shot с референсами и 4K-финалом, Nano Banana Pro уместен; если это плотная инфографика с русским текстом, сначала протестируйте GPT Image 2.",
        before:
          "Сделай один промпт для всех моделей: Nano Banana Pro, GPT Image 2, Midjourney 8.1.",
        after:
          "Nano Banana Pro: product shot + references. GPT Image 2: exact text and structured brief. Midjourney 8.1: style exploration before final production.",
        imageSrc: "/blog/nano-banana-prompts/ru/step-2.jpg",
      },
      {
        title: "Исправляйте первую ошибку одной строкой",
        body:
          "Практический кейс: для Nano Banana Pro мы делали кадр «девушка держит стеклянный флакон духов на мокром камне, крупный рекламный план». Первый рендер дал красивый свет, но на видимой руке появилось шесть пальцев, а флакон стал слишком широким. Ошибка была не в стиле, а в constraints. Точная правка: `preserve five fingers on each visible hand, keep the perfume bottle narrow and cylindrical, do not change lighting or composition`. После этого рука и форма флакона исправились, а удачная сцена осталась. Не переписывайте весь prompt после первой ошибки: вы потеряете то, что уже сработало.",
        before:
          "Сделай лучше, исправь руку, флакон и вообще больше реализма.",
        after:
          "Change only: hand anatomy and bottle geometry. Preserve: lighting, camera angle, wet stone, model pose, color palette. Constraint: five fingers on each visible hand.",
        imageSrc: "/blog/nano-banana-prompts/ru/step-3.jpg",
      },
      {
        title: "Давайте референсы ролями",
        body:
          "Если модель поддерживает reference images, не бросайте их в запрос без объяснения. Разделите роли: один референс для формы объекта, второй для материала, третий для света, четвертый для цветовой палитры. В тексте промпта прямо напишите: `Use reference 1 for product shape only`, `Use reference 2 for wet stone texture`, `Use reference 3 for lime rim lighting`. Иначе Nano Banana AI может усреднить все картинки и получить красивую, но неверную смесь. Для персонажей отдельно фиксируйте identity: лицо, волосы, одежду, возраст и отличительные marks.",
        before:
          "Вот несколько референсов, сделай в таком духе.",
        after:
          "Reference 1: product shape only. Reference 2: material texture only. Reference 3: lighting mood only. Do not copy logos or text from any reference.",
        imageSrc: "/blog/nano-banana-prompts/ru/step-4.jpg",
      },
      {
        title: "Проверяйте финал по чек-листу",
        body:
          "Финальный кадр проверяйте как production asset, а не как «красиво / некрасиво». Мини-чек-лист: руки, форма объекта, текст, crop, свет, лишние логотипы, водяные знаки, совпадение с задачей. Для коммерческих картинок отдельно проверьте, не изменилась ли упаковка или материал. Для social creative проверьте безопасную зону под заголовок. Если ошибка одна, делайте одну итерацию. Если ошибок три и больше, вернитесь к структуре промпта: скорее всего, в нем смешаны цель, стиль и constraints. Этот подход переносится и на GPT Image 2, Seedream 5 и Flux Kontext.",
        before:
          "Выглядит неплохо, но что-то не так.",
        after:
          "QA: hands, object shape, exact text, crop, light, extra logos, watermark, task fit. Fix only the first failing item.",
        imageSrc: "/blog/nano-banana-prompts/ru/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое Nano Banana Pro?",
        a: "Nano Banana Pro - image-модель Google в семействе Gemini для генерации и редактирования изображений, включая высокое разрешение и работу с референсами. На практике она полезна для продуктовых кадров, рекламных визуалов, персонажей и аккуратных image-to-image правок.",
      },
      {
        q: "Как написать хороший промпт для Nano Banana Pro?",
        a: "Начните с цели кадра, затем опишите сцену, объект, стиль, камеру, свет и ограничения. Если есть референсы, назначьте каждому роль. После первого рендера исправляйте одну ошибку за раз, не переписывая весь запрос.",
      },
      {
        q: "Nano Banana Pro лучше GPT Image 2?",
        a: "Не всегда. Nano Banana Pro удобен для продуктовых сцен, материалов, референсов и 4K-визуалов. GPT Image 2 часто сильнее, когда нужен точный текст в кадре или очень структурированный бриф. Выбор зависит от задачи, а не от названия модели.",
      },
      {
        q: "Почему Nano Banana меняет руки или форму объекта?",
        a: "Обычно в промпте не зафиксированы анатомия, геометрия или preserve-блок. Добавьте точное ограничение: сохранить пять пальцев на каждой видимой руке, не менять форму объекта, не менять композицию, свет и ракурс.",
      },
      {
        q: "Нужно ли писать промпты для Nano Banana Pro на английском?",
        a: "Для production-запросов английский стабильнее, особенно в камере, свете, материалах и constraints. Русский можно использовать для черновика, но финальный prompt лучше держать на английском и проверять структуру перед запуском.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "nano-banana-prompts",
  title: "Nano Banana Pro prompts: practical workflow",
  excerpt:
    "A practical Nano Banana Pro prompts workflow: five prompt blocks, model choice, references, targeted fixes, and final QA for hands, text, crop, and composition.",
  description:
    "Write better Nano Banana Pro prompts with five prompt blocks, role-based references, a real extra-fingers fix, final image QA, and model choice for production.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Nano Banana Pro is Google's image model for generation, editing, and high-resolution visuals in the Gemini ecosystem. Strong Nano Banana Pro prompts work like compact design briefs: job, scene, subject, style, references, and constraints. That order reduces drift, improves in-image text, and saves iterations.",
    steps: [
      {
        title: "Build the prompt from five blocks",
        body:
          "The best nano banana prompt is not a pile of attractive tags; it is a five-block brief: `Purpose`, `Scene`, `Subject`, `Style`, `Constraints`. In the first sentence, state the job: product shot, article cover, poster, hero image, UI mockup, or character reference. Then describe the scene and main subject. Add style, camera, light, materials, and only then constraints. If text must appear in the image, quote it exactly and ask for a large headline, not a tiny table. Opten is useful before generation because it shows whether the prompt reads like a usable brief or scattered wishes.",
        before:
          "banana ai poster, cool product, neon, cinematic, text, 4k",
        after:
          'Purpose: premium product poster, 16:9. Subject: matte black perfume bottle on wet volcanic stone. Scene: dark botanical studio, lime rim light. Text, exact: "NIGHT BLOOM". Constraints: no extra logos, no tiny text, preserve bottle shape.',
        imageSrc: "/blog/nano-banana-prompts/en/step-1.jpg",
      },
      {
        title: "Choose the model for the job",
        body:
          "Nano Banana Pro is a strong fit when the image prompt needs materials, lighting, product composition, advertising polish, or reference-based editing. GPT Image 2 often handles multilingual text and strict long-form structure better. Imagen 4 Ultra is useful for clean photoreal frames, while Midjourney 8.1 gets to a strong style exploration quickly. So do not start with “which AI model is best.” Start with the output. If you need a premium product shot with references and a 4K final, Nano Banana Pro is a good candidate; if you need dense infographic text in Russian, test GPT Image 2 first.",
        before:
          "Use one prompt for Nano Banana Pro, GPT Image 2, and Midjourney 8.1.",
        after:
          "Nano Banana Pro: product shot plus references. GPT Image 2: exact text and structured brief. Midjourney 8.1: style exploration before final production.",
        imageSrc: "/blog/nano-banana-prompts/en/step-2.jpg",
      },
      {
        title: "Fix the first error with one line",
        body:
          "Practical case: in Nano Banana Pro, we tested “a woman holding a glass perfume bottle on wet volcanic stone, close advertising shot.” The first render had beautiful lighting, but the visible hand had six fingers and the bottle became too wide. The mistake was not style; it was missing constraints. The precise fix was: `preserve five fingers on each visible hand, keep the perfume bottle narrow and cylindrical, do not change lighting or composition`. The hand and bottle shape improved while the successful scene stayed intact. Do not rewrite the full prompt after the first error or you will lose what already worked.",
        before:
          "Make it better, fix the hand and bottle, more realistic.",
        after:
          "Change only: hand anatomy and bottle geometry. Preserve: lighting, camera angle, wet stone, model pose, color palette. Constraint: five fingers on each visible hand.",
        imageSrc: "/blog/nano-banana-prompts/en/step-3.jpg",
      },
      {
        title: "Give references explicit roles",
        body:
          "If the model accepts reference images, do not drop them into the request without explanation. Assign roles: one reference for object shape, one for material, one for lighting, and one for color palette. Write it directly in the prompt: `Use reference 1 for product shape only`, `Use reference 2 for wet stone texture`, `Use reference 3 for lime rim lighting`. Otherwise Nano Banana AI can average the inputs into a pretty but wrong hybrid. For characters, separately lock identity: face, hair, outfit, age, and memorable marks.",
        before:
          "Here are several references; make something in this style.",
        after:
          "Reference 1: product shape only. Reference 2: material texture only. Reference 3: lighting mood only. Do not copy logos or text from any reference.",
        imageSrc: "/blog/nano-banana-prompts/en/step-4.jpg",
      },
      {
        title: "Review the final as production work",
        body:
          "Review the final image as a production asset, not just as “nice or not.” Mini-checklist: hands, object shape, text, crop, lighting, extra logos, watermark, and task fit. For commercial images, confirm that packaging and material did not drift. For social creative, check the safe area for a headline. If there is one error, make one iteration. If there are three or more errors, return to the prompt structure because the goal, style, and constraints are probably mixed together. The same workflow also transfers to GPT Image 2, Seedream 5, and Flux Kontext.",
        before:
          "It looks good, but something is off.",
        after:
          "QA: hands, object shape, exact text, crop, light, extra logos, watermark, task fit. Fix only the first failing item.",
        imageSrc: "/blog/nano-banana-prompts/en/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "What is Nano Banana Pro?",
        a: "Nano Banana Pro is Google's Gemini-family image model for image generation and editing, including high-resolution output and reference-based workflows. In practice it is useful for product shots, ad visuals, characters, and controlled image-to-image edits.",
      },
      {
        q: "How do you write good Nano Banana Pro prompts?",
        a: "Start with the image job, then describe scene, subject, style, camera, light, and constraints. If you use references, assign each one a role. After the first render, fix one error at a time instead of rewriting the whole request.",
      },
      {
        q: "Is Nano Banana Pro better than GPT Image 2?",
        a: "Not always. Nano Banana Pro is useful for product scenes, materials, references, and high-resolution visuals. GPT Image 2 often performs better when the image needs exact text or a very structured brief. The right model depends on the job.",
      },
      {
        q: "Why does Nano Banana change hands or object shape?",
        a: "Usually the prompt did not lock anatomy, geometry, or preserve rules. Add a precise constraint: preserve five fingers on each visible hand, keep the object shape unchanged, and do not change composition, light, or camera angle.",
      },
      {
        q: "Should Nano Banana Pro prompts be written in English?",
        a: "For production prompts, English is more stable, especially for camera, light, materials, and constraints. You can draft in another language, but the final prompt should usually be English and structurally checked before generation.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
