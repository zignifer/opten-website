import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-31";

const COVER_RU = {
  src: "/blog/ai-face-swap/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про аккуратную замену лица в нейросети",
};
const COVER_EN = {
  src: "/blog/ai-face-swap/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for an AI face swap guide about clean identity-preserving edits",
};

const ru: BlogPostLocale = {
  slug: "ai-face-swap",
  title: "Замена лица через нейросеть: аккуратный face swap без артефактов",
  excerpt:
    "Аккуратный face swap получается чище, когда исходники совпадают по ракурсу, свету и мимике. Разбираем замену лица без грязных краев.",
  description:
    "Как подобрать исходники, описать свет, кожу и мимику, чтобы замена лица через нейросеть не дала заметные артефакты на фото.",
  category: "guide",
  tags: ["workflow", "ai-image-gen", "ai-video-gen"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "consistent-character-ai"],
  body: {
    intro:
      "Замена лица через нейросеть — это image-editing задача, где модель переносит идентичность из референса в целевой кадр. Чистый результат зависит не от кнопки «swap», а от исходников: ракурс, свет, кожа и мимика должны быть описаны явно, иначе face swap оставит заметные артефакты.",
    steps: [
      {
        title: "Сначала подберите исходники, а потом выбирайте сервис",
        body:
          "Хороший AI face swap начинается до промпта. Нужны два кадра: референс лица и целевая сцена. Чем ближе поворот головы, фокусное расстояние, выражение и свет, тем меньше модель будет «додумывать». Если референс снят фронтально, а целевой кадр в три четверти и с жестким боковым светом, даже сильный онлайн-сервис для замены лица почти наверняка даст чужую челюсть, пластиковую кожу или странные края у волос.\n\nРабочее правило простое: используйте свои, согласованные или полностью синтетические лица; не берите знаменитостей и частных людей без разрешения. Для фото лучше держать оба изображения в близком разрешении и не обрезать уши, подбородок и линию волос. Для видео добавьте первый кадр сцены как отдельный reference, иначе лицо может совпасть в начале и поплыть на движении.",
        before:
          "Сделай face swap на этом фото, чтобы выглядело реалистично.",
        after:
          "Use the reference face only for identity. Match the target photo angle, lens compression, skin texture, hairline, and left-side soft light. Preserve body, pose, background, clothing, and camera.",
        imageSrc: "/blog/ai-face-swap/ru/step-1.jpg",
      },
      {
        title: "Опишите лицо как preserve-задачу",
        body:
          "Большая ошибка — просить модель «заменить лицо» и молчать про все остальное. Тогда инструмент воспринимает задачу как широкую перерисовку: вместе с лицом меняет возраст, тон кожи, прическу, эмоцию и иногда даже форму головы. В промпте нужно разделить три блока: что меняем, что сохраняем и какие дефекты запрещены.\n\nФормула: `Change: face identity only` / `Preserve: pose, body, clothes, background, lighting, camera angle, expression intensity` / `Constraints: no plastic skin, no double jawline, no extra teeth, no warped ears, no celebrity likeness`. Opten здесь полезен как preflight: можно быстро развернуть короткий запрос в модельный prompt и проверить, не забыты ли свет, текстура кожи и preserve-ограничения.",
        before:
          "Replace the face, make it natural.",
        after:
          "Change: face identity only.\nPreserve: target photo pose, body, clothes, background, camera angle, left-side soft light, mild smile.\nConstraints: no plastic skin, no warped ears, no double jawline, no extra teeth.",
        imageSrc: "/blog/ai-face-swap/ru/step-2.jpg",
      },
      {
        title: "Кейс Nano Banana Pro: почините свет одной строкой",
        body:
          "Практический кейс: в Nano Banana Pro замена лица на фото попала в черты, но лицо выглядело вклеенным. Первый prompt фиксировал identity и одежду, но не сказал, откуда идет свет. Результат: щека была теплее, кожа слишком гладкая, а тень под носом не совпадала с целевой сценой.\n\nИсправление было не в слове `photorealistic`, а в точной световой строке: `match the target image lighting: soft key light from upper left, same shadow under nose and cheekbone, keep visible skin pores and natural color temperature`. После одной правки лицо стало сидеть в кадре заметно спокойнее. Этот прием переносится на Seedream, GPT Image 2 и другие image-to-image модели: чините одну ось, а не переписывайте весь prompt.",
        before:
          "Face identity from reference, realistic skin, keep the outfit.",
        after:
          "Match target lighting: soft key light from upper left; same nose and cheekbone shadow; visible pores; natural color temperature.",
        imageSrc: "/blog/ai-face-swap/ru/step-3.jpg",
      },
      {
        title: "Проверьте артефакты перед публикацией",
        body:
          "Перед тем как выкладывать результат, проверьте не «похоже ли лицо», а пять конкретных зон: линия волос, уши, зубы, тень под носом, переход кожи на шее. У face swap чаще всего ломаются именно границы, потому что модель пытается совместить две разные оптики и два разных источника света.\n\nЕсли артефакт один, правьте один. Для края волос добавьте `preserve original hair outline and flyaway strands`. Для кожи: `keep target skin texture, no airbrushed face`. Для мимики: `match the target expression, do not change smile intensity`. Если проблем больше трех, дешевле вернуться к исходникам: взять reference с похожим ракурсом или целевой кадр с более ровным светом.",
        before:
          "Еще раз сделай реалистичнее.",
        after:
          "Fix only hairline blending. Preserve face identity, expression, lighting, body, background, and all clothing. No redesign.",
        imageSrc: "/blog/ai-face-swap/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Как работает замена лица через нейросеть?",
        a: "Модель берет identity из референса и переносит ее в целевой кадр, одновременно пытаясь сохранить позу, свет, фон и тело. Если эти условия не заданы, она дорисовывает их сама. Поэтому чистый face swap зависит от исходников и prompt-блоков Change / Preserve / Constraints.",
      },
      {
        q: "Где лучше делать замену лица онлайн?",
        a: "Выбирайте не сайт по кнопке swap, а workflow с референсами, image-to-image режимом и возможностью править prompt. Для аккуратной работы важнее поддержка preserve-ограничений, повторных итераций и хорошая работа с кожей, чем обещание «один клик».",
      },
      {
        q: "Почему замена лица на фото дает артефакты?",
        a: "Обычно не совпали ракурс, свет или мимика. Модель может правильно перенести черты, но оставить другую температуру кожи, двойной контур челюсти, лишние зубы или сломанный край волос. Исправляйте конкретную ось: свет, skin texture, expression lock или hairline blending.",
      },
      {
        q: "Можно ли использовать AI face swap для знаменитостей?",
        a: "Не стоит. Этот гайд про согласованные, личные или синтетические исходники, а не про обход идентичности. Для публичных людей, чужих частных фото и вводящего в заблуждение контента лучше не делать face swap вообще: юридический и репутационный риск выше любой пользы.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-face-swap",
  title: "AI face swap: clean results without artifacts",
  excerpt:
    "AI face swap works best when source and target match angle, light, and expression. Use this ai face swap app workflow before editing.",
  description:
    "AI face swap guide for 2026: choose source images, lock lighting, skin texture, and expression so an ai face swap app does not create artifacts.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI face swap is an image-editing task where a model transfers identity from a reference face into a target frame. Clean output is not about the swap button. It depends on matching source images: angle, light, skin texture, and expression must be stated clearly or the edit will leave visible artifacts.",
    steps: [
      {
        title: "Start with source images, not the ai face swap app",
        body:
          "A clean AI face swap starts before the prompt. You need two inputs: the identity reference and the target scene. The closer the head angle, lens compression, expression, and lighting are, the less the model has to invent. If the reference is straight-on but the target is three-quarter view with hard side light, the result usually gets a borrowed jawline, plastic skin, or messy hair edges.\n\nUse your own face, a consented reference, or a fully synthetic person. Do not use celebrities or private people without permission. For photos, keep both inputs near the same resolution and avoid crops that cut off ears, chin, or hairline. For video, add the first frame of the target scene as a reference too; otherwise the face can match at frame one and drift during motion.",
        before:
          "Do a face swap on this photo and make it realistic.",
        after:
          "Use the reference face only for identity. Match the target photo angle, lens compression, skin texture, hairline, and left-side soft light. Preserve body, pose, background, clothing, and camera.",
        imageSrc: "/blog/ai-face-swap/en/step-1.jpg",
      },
      {
        title: "Write the edit as a preserve task",
        body:
          "The common mistake is asking the model to \"replace the face\" and saying nothing about the rest. An ai face swap app may read that as a broad redraw: age, skin tone, hairstyle, expression, and even skull shape can shift. Split the prompt into three blocks: what changes, what stays, and which defects are forbidden.\n\nUse: `Change: face identity only` / `Preserve: pose, body, clothes, background, lighting, camera angle, expression intensity` / `Constraints: no plastic skin, no double jawline, no extra teeth, no warped ears, no celebrity likeness`. Opten is useful as a prompt preflight here: expand a short request into a model-specific brief and catch missing lighting, skin texture, and preserve constraints before spending credits.",
        before:
          "Replace the face, make it natural.",
        after:
          "Change: face identity only.\nPreserve: target photo pose, body, clothes, background, camera angle, left-side soft light, mild smile.\nConstraints: no plastic skin, no warped ears, no double jawline, no extra teeth.",
        imageSrc: "/blog/ai-face-swap/en/step-2.jpg",
      },
      {
        title: "Nano Banana Pro case: fix light with one line",
        body:
          "Practical case: in Nano Banana Pro, an AI face swap matched identity but the face still looked pasted in. The first prompt locked identity and clothing, but never said where the light came from. The cheek was warmer than the target, skin was too smooth, and the shadow under the nose pointed the wrong way.\n\nThe fix was not adding `photorealistic`; it was a precise lighting line: `match the target image lighting: soft key light from upper left, same shadow under nose and cheekbone, keep visible skin pores and natural color temperature`. After one edit, the face sat in the frame much better. The same rule works in Seedream, GPT Image 2, and other image-to-image models: repair one axis instead of rewriting the whole prompt.",
        before:
          "Face identity from reference, realistic skin, keep the outfit.",
        after:
          "Match target lighting: soft key light from upper left; same nose and cheekbone shadow; visible pores; natural color temperature.",
        imageSrc: "/blog/ai-face-swap/en/step-3.jpg",
      },
      {
        title: "Run a final artifact check",
        body:
          "Before publishing, do not only ask whether the face looks similar. Check five zones: hairline, ears, teeth, shadow under the nose, and the skin transition on the neck. AI face swap artifacts usually appear on boundaries because the model is merging two optical setups and two lighting sources.\n\nIf there is one artifact, fix one thing. For hair: `preserve original hair outline and flyaway strands`. For skin: `keep target skin texture, no airbrushed face`. For expression: `match the target expression, do not change smile intensity`. If more than three areas are broken, go back to input selection. A closer reference angle or softer target light will beat another vague \"make it realistic\" pass.",
        before:
          "Make it more realistic again.",
        after:
          "Fix only hairline blending. Preserve face identity, expression, lighting, body, background, and all clothing. No redesign.",
        imageSrc: "/blog/ai-face-swap/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What is the safest ai face swap workflow in 2026?",
        a: "Use consented or synthetic references, match angle and lighting before generation, then write a Change / Preserve / Constraints prompt. Do not use public figures, private photos without permission, or misleading edits. The cleanest workflow is also the least risky one.",
      },
      {
        q: "Is ai face swap io different from an ai face swap app?",
        a: "Usually the label matters less than the controls. Whether a tool calls itself ai face swap io, a web app, or an editing model, look for reference inputs, prompt control, preserve constraints, and repeatable iterations. One-click tools are fast, but they give you fewer ways to fix artifacts.",
      },
      {
        q: "Why does my AI face swap look fake?",
        a: "Most fake-looking swaps come from mismatched lighting, angle, skin texture, or expression. The model may copy identity correctly but miss the target frame's optics. Fix the exact failure: light direction, pores, hairline blending, jawline, or expression lock.",
      },
      {
        q: "Can I use AI face swap for celebrities?",
        a: "This guide is for personal, consented, or synthetic source images, not impersonation. Avoid celebrities, private people, and deceptive edits. Even when a tool technically allows it, the legal and reputational risk is usually bigger than the creative value.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
