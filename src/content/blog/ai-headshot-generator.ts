import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-28";

const COVER_RU = {
  src: "/blog/ai-headshot-generator/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про бизнес-портрет через нейросеть",
};
const COVER_EN = {
  src: "/blog/ai-headshot-generator/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for an AI headshot generator guide for business portraits",
};

const ru: BlogPostLocale = {
  slug: "ai-headshot-generator",
  title: "Бизнес-портрет через нейросеть: деловое фото без стока",
  excerpt:
    "Бизнес-портрет через нейросеть получается убедительнее, когда prompt фиксирует фон, свет, объектив, одежду и естественную кожу вместо общего запроса.",
  description:
    "Как сделать бизнес-портрет через нейросеть: prompt для делового портрета, фон, свет, объектив и проверка нейросети для делового фото.",
  category: "guide",
  tags: ["workflow", "ai-image-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "gpt-image-2"],
  body: {
    intro:
      "Бизнес-портрет через нейросеть — это деловое фото для сайта, LinkedIn, презентации или карточки эксперта, а не просто красивое селфи. Модель справляется лучше, когда prompt задает назначение кадра, фон, свет, объектив, одежду и естественную фактуру кожи, а не просит «профессиональный портрет» одним абзацем.",
    steps: [
      {
        title: "Соберите prompt как brief для делового фото",
        body:
          "AI headshot generator на русском лучше начинать не с описания внешности, а с назначения кадра. Напишите, где портрет будет жить: сайт компании, профиль эксперта, обложка вебинара, карточка автора в блоге. Это меняет тон: для корпоративного сайта нужен спокойный взгляд и нейтральный фон, для founder-профиля можно оставить больше характера, для speaking page важнее энергия.\n\nМинимальный brief: возрастной диапазон, роль человека, тип одежды, фон, свет, объектив, выражение лица и запреты. Не обещайте официальные документы и не используйте реальные лица без разрешения. Для публичного делового портрета достаточно вымышленного персонажа или собственной фотографии как референса, если сервис это поддерживает.",
        before:
          "Сделай профессиональный бизнес-портрет, красивый, реалистичный, для LinkedIn.",
        after:
          "Business headshot for a consulting website: fictional 35-year-old product strategist, navy blazer, neutral warm gray background, soft key light, 85mm portrait lens, eye-level framing, natural skin texture, calm confident expression. Constraints: no plastic skin, no stock-photo smile, no random logo, no extra text.",
        imageSrc: "/blog/ai-headshot-generator/ru/step-1.jpg",
      },
      {
        title: "На чем держится деловой портрет: фон, свет и объектив",
        body:
          "Слова `professional`, `premium` и `realistic` не заменяют фотосъемку. Для делового портрета нейросеть должна получить три конкретных якоря: нейтральный фон без офисного шума, мягкий ключевой свет и портретный объектив. Хороший базовый набор: `neutral gray background`, `soft key light`, `85mm portrait lens`, `eye-level`, `shoulders-up crop`.\n\nОдежду лучше описывать проще, чем кажется: blazer, plain shirt, no tie или dark knit. Если просить «дорогой CEO look», модель часто делает стоковый костюм, глянцевую кожу и чрезмерную улыбку. Нейросеть для делового фото выглядит убедительнее, когда prompt описывает обычную съемку, а не статус.",
        before:
          "Premium CEO portrait, luxury office, expensive suit, confident, photorealistic.",
        after:
          "Shoulders-up business portrait, neutral gray seamless background, navy blazer over a plain black knit, soft key light from front-left, subtle rim light, 85mm lens, natural skin texture, relaxed mouth, direct eye contact, no luxury office, no glossy retouching.",
        imageSrc: "/blog/ai-headshot-generator/ru/step-2.jpg",
      },
      {
        title: "Исправьте стоковый первый результат",
        body:
          "Практический кейс: первый портрет в GPT Image 2 выглядел как сток. Лицо было слишком гладким, фон случайно ушел в офис, а человек выглядел младше заданного возраста. Проблема была не в модели, а в prompt: он просил `professional headshot`, но не фиксировал lens, wardrobe, neutral background и natural skin texture.\n\nИсправление было точечным: добавили `35-40 years old`, `85mm portrait lens`, `neutral gray background`, `navy blazer`, `natural skin pores`, `calm direct gaze`, а в constraints вынесли `no plastic skin, no stock-photo smile, no office background, no age drift`. Следующий рендер стал похож на деловой портрет, а не на рекламную заготовку.",
        before:
          "Professional headshot, confident man, business style, realistic photo.",
        after:
          "Fictional 38-year-old consultant, shoulders-up business headshot, neutral gray background, navy blazer, 85mm portrait lens, soft key light, natural skin pores, calm direct gaze. Constraints: no plastic skin, no stock-photo smile, no office background, no age drift.",
        imageSrc: "/blog/ai-headshot-generator/ru/step-3.jpg",
      },
      {
        title: "Прогоните prompt через preflight перед рендером",
        body:
          "Перед генерацией проверьте prompt как короткий чек-лист: возраст, роль, фон, свет, объектив, одежда, выражение, ограничения. Если один пункт пропущен, модель заполнит его сама. Обычно она выбирает самый усредненный вариант: молодое лицо, офисный фон, слишком белые зубы и глянцевую кожу.\n\nOpten здесь полезен как preflight-редактор: вы даете идею на русском, а он помогает развернуть ее в production prompt под конкретную модель и подсветить пропуски. Особенно стоит проверять противоречия: `natural skin texture` и `perfect retouched magazine portrait` тянут кадр в разные стороны.",
        before:
          "Деловой портрет для сайта, реалистичный, красивый свет, уверенный человек.",
        after:
          "Preflight: role defined; age range defined; neutral background locked; soft key light specified; 85mm lens specified; wardrobe simple; constraints block plastic skin, stock smile, logo, office clutter, age drift.",
        imageSrc: "/blog/ai-headshot-generator/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Можно ли сделать бизнес-портрет через нейросеть?",
        a: "Да, если нужен публичный деловой кадр для сайта, профиля, презентации или автора. Не стоит обещать официальное фото для документов: требования к таким снимкам зависят от конкретного сервиса и страны.",
      },
      {
        q: "Какой prompt нужен для делового портрета нейросетью?",
        a: "Опишите назначение кадра, возрастной диапазон, роль человека, одежду, нейтральный фон, мягкий свет, объектив и запреты. Ключевые блоки: background, wardrobe, lighting, lens, expression, skin texture, constraints.",
      },
      {
        q: "Что такое ai headshot generator на русском?",
        a: "Это сервис или модель, которая создает деловой headshot по текстовому prompt или референс-фото. На русском можно писать смысл и требования, но техническую часть часто стабильнее формулировать на английском.",
      },
      {
        q: "Какая нейросеть для делового фото выглядит реалистичнее?",
        a: "Чаще выигрывает не название модели, а качество prompt. Проверьте, чтобы в запросе были neutral background, soft key light, 85mm lens, natural skin texture и короткий constraints-блок против стоковой улыбки и пластиковой кожи.",
      },
      {
        q: "Почему деловой портрет из нейросети похож на сток?",
        a: "Prompt обычно просит «professional» и «premium», но не задает фотонастройки. Модель достраивает офис, гладкую кожу, идеальную улыбку и общий костюм. Добавьте фон, свет, объектив, одежду и запреты на stock-photo smile.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-headshot-generator",
  title: "AI headshot generator: business portraits that look real",
  excerpt:
    "An AI headshot generator works best when the prompt locks background, light, lens, wardrobe, age range, and natural skin texture before rendering.",
  description:
    "AI headshot generator guide: write prompts for business portraits with neutral background, soft light, 85mm lens, wardrobe, skin texture, and preflight checks.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "An AI headshot generator creates a business portrait from a text prompt or reference image, but the result depends on prompt control. A useful headshot prompt defines the background, light, lens, wardrobe, age range, expression, and skin texture before the model starts inventing its own corporate stock photo.",
    steps: [
      {
        title: "Write a headshot brief, not a vague request",
        body:
          "Start with the job of the image, not the person's face. Is the portrait for a consulting website, LinkedIn profile, webinar speaker page, founder bio, or author card? That context changes the output. A company page needs calm trust and a neutral background. A founder profile can carry more character. A speaker page needs more energy.\n\nA compact brief should include age range, role, wardrobe, background, lighting, lens, facial expression, and constraints. Do not promise official ID photos, and do not use real faces without permission. For public business use, a fictional person or your own reference photo is the safer route, depending on what the tool supports.",
        before:
          "Make a professional business headshot, beautiful, realistic, for LinkedIn.",
        after:
          "Business headshot for a consulting website: fictional 35-year-old product strategist, navy blazer, neutral warm gray background, soft key light, 85mm portrait lens, eye-level framing, natural skin texture, calm confident expression. Constraints: no plastic skin, no stock-photo smile, no random logo, no extra text.",
        imageSrc: "/blog/ai-headshot-generator/en/step-1.jpg",
      },
      {
        title: "Lock background, light, and lens",
        body:
          "Words like `professional`, `premium`, and `realistic` don't replace a photo setup. For a business portrait, the AI headshot generator needs three concrete anchors: a neutral background, soft key light, and a portrait lens. A reliable base is `neutral gray background`, `soft key light`, `85mm portrait lens`, `eye-level`, and `shoulders-up crop`.\n\nKeep wardrobe simpler than you think: blazer, plain shirt, dark knit, no loud pattern. If you ask for an expensive CEO look, the model often gives you a stock suit, glossy skin, and a forced smile. A headshot feels more credible when the prompt describes a normal portrait session, not status symbols.",
        before:
          "Premium CEO portrait, luxury office, expensive suit, confident, photorealistic.",
        after:
          "Shoulders-up business portrait, neutral gray seamless background, navy blazer over a plain black knit, soft key light from front-left, subtle rim light, 85mm lens, natural skin texture, relaxed mouth, direct eye contact, no luxury office, no glossy retouching.",
        imageSrc: "/blog/ai-headshot-generator/en/step-2.jpg",
      },
      {
        title: "Fix the first stock-looking render",
        body:
          "Practical case: the first headshot in GPT Image 2 looked like stock photography. The skin was too smooth, the background drifted into an office, and the person looked younger than requested. The model was not the main problem. The prompt asked for a `professional headshot`, but it did not lock lens, wardrobe, neutral background, or natural skin texture.\n\nThe fix was specific: `35-40 years old`, `85mm portrait lens`, `neutral gray background`, `navy blazer`, `natural skin pores`, `calm direct gaze`, plus constraints: `no plastic skin, no stock-photo smile, no office background, no age drift`. The next render looked like a business portrait, not a generic ad placeholder.",
        before:
          "Professional headshot, confident man, business style, realistic photo.",
        after:
          "Fictional 38-year-old consultant, shoulders-up business headshot, neutral gray background, navy blazer, 85mm portrait lens, soft key light, natural skin pores, calm direct gaze. Constraints: no plastic skin, no stock-photo smile, no office background, no age drift.",
        imageSrc: "/blog/ai-headshot-generator/en/step-3.jpg",
      },
      {
        title: "Run a prompt preflight before rendering",
        body:
          "Before you render, check the prompt as a short list: age, role, background, light, lens, wardrobe, expression, constraints. If one item is missing, the model fills it in. The default fill is usually average: younger face, vague office background, too-white teeth, and polished skin.\n\nOpten works well as a preflight editor here. Give it the rough idea, then use it to expand the request into a production prompt for the model you are using and catch missing pieces. Watch for contradictions too: `natural skin texture` and `perfect retouched magazine portrait` pull the image in opposite directions.",
        before:
          "Business portrait for a website, realistic, beautiful light, confident person.",
        after:
          "Preflight: role defined; age range defined; neutral background locked; soft key light specified; 85mm lens specified; wardrobe simple; constraints block plastic skin, stock smile, logo, office clutter, age drift.",
        imageSrc: "/blog/ai-headshot-generator/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What is an ai headshot generator?",
        a: "An AI headshot generator is an image model or app that creates a business-style portrait from a text prompt or reference image. The quality depends heavily on how clearly you define background, light, lens, wardrobe, expression, and constraints.",
      },
      {
        q: "What is the best ai headshot generator for business portraits?",
        a: "The best AI headshot generator is the one that lets you control prompt details, reference images, privacy, and output review. For realistic business portraits, prompt structure matters more than the tool name.",
      },
      {
        q: "Can I use an ai headshot generator app like Canva or Kiwi?",
        a: "You can use an ai headshot generator app if it gives you enough control over background, lighting, crop, wardrobe, and editing rights. Searches like `ai headshot generator Canva` or `ai headshot generator Kiwi` still need the same prompt checklist.",
      },
      {
        q: "Do AI headshots work for official documents?",
        a: "Do not assume that. AI headshots can work for websites, profiles, presentations, and author pages, but official IDs and passports have separate rules. Check the relevant authority before using any generated image.",
      },
      {
        q: "How do I make an ai headshot generator look less fake?",
        a: "Avoid generic words like `premium` and `professional` by themselves. Add neutral background, soft key light, 85mm lens, natural skin texture, relaxed mouth, direct eye contact, and constraints against plastic skin, stock-photo smile, and office clutter.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
