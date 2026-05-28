import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-28";

const COVER_RU = {
  src: "/blog/consistent-character-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про одинакового персонажа в нейросети",
};

const COVER_EN = {
  src: "/blog/consistent-character-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a consistent character AI workflow guide",
};

const ru: BlogPostLocale = {
  slug: "consistent-character-ai",
  title: "Одинаковый персонаж в нейросети: workflow",
  excerpt:
    "Как сделать одинакового персонажа в нейросети: референс-лист, identity-блок, preserve-ограничения и проверка серии в GPT Image 2, Nano Banana Pro и Kling 3.0.",
  description:
    "Практический workflow: как сделать одинакового персонажа в нейросети, удержать лицо, одежду и руки в GPT Image 2, Nano Banana Pro и Kling 3.0.",
  category: "guide",
  tags: ["ai-image-gen", "workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "image-to-video", "prompt-structure"],
  body: {
    intro:
      "Одинаковый персонаж в нейросети получается не из одного красивого промпта, а из повторяемого identity-workflow. Чтобы сохранить персонажа, зафиксируйте референсы, лицо, одежду, пропорции, палитру и запреты на drift. Так GPT Image 2, Nano Banana Pro, Midjourney 8.1 и Kling 3.0 держат героя стабильнее в серии кадров.",
    steps: [
      {
        title: "Соберите identity-карту персонажа",
        body:
          "Начните не с генерации, а с короткой identity-карты: возрастной диапазон, форма лица, волосы, отличительные детали, силуэт, одежда, палитра и тип света. Для consistent character AI это важнее художественных эпитетов. Модель должна понимать, какие признаки делают героя тем же самым человеком, а какие можно менять от сцены к сцене. В GPT Image 2 и Nano Banana Pro хорошо работает формат брифа с отдельными строками `Identity`, `Wardrobe`, `Palette`, `Do not change`. В Midjourney 8.1 лучше держать описание короче и повторять ключевые признаки в каждом кадре.",
        before:
          "Сделай девушку-детектива в стиле нуар, разные сцены.",
        after:
          "Identity: woman detective, 32, oval face, short black bob haircut, small scar through left eyebrow, calm focused expression. Wardrobe: dark green trench coat, white shirt, thin silver necklace. Palette: wet asphalt, lime reflection, low-key noir light. Do not change: face shape, scar, haircut, necklace.",
        imageSrc: "/blog/consistent-character-ai/ru/step-1.jpg",
      },
      {
        title: "Разделите постоянное и переменное",
        body:
          "Следующий шаг - явно отделить то, что обязано повторяться, от того, что можно менять. Постоянное: лицо, волосы, родинка или шрам, базовая одежда, пропорции тела, возраст и общий стиль. Переменное: локация, действие, крупность кадра, погода, эмоция и реквизит. Если смешать все в один абзац, модель не понимает иерархию и каждый кадр начинает перерисовывать героя заново. В Opten такой промпт удобно проверять как структуру: сначала identity, потом scene, потом camera, потом constraints.",
        before:
          "Один и тот же персонаж в кафе, на улице и в офисе, красиво и реалистично.",
        after:
          "Keep constant: face, black bob haircut, eyebrow scar, green trench coat, silver necklace, body proportions. Vary only: location, pose, camera distance, background action. Scene 1: quiet cafe window at night, medium shot, character reading a notebook.",
        imageSrc: "/blog/consistent-character-ai/ru/step-2.jpg",
      },
      {
        title: "Выберите модель под задачу серии",
        body:
          "Для статичной серии кадров начните с GPT Image 2, Nano Banana Pro или Seedream 5: они лучше читают structured brief и reference roles. Flux Kontext подходит для точечных правок существующего кадра, когда нужно сохранить композицию. Midjourney 8.1 силен в стилистике, но требует дисциплины: меньше JSON, больше коротких повторяемых признаков. Для видео и image-to-video используйте Kling 3.0, Runway Gen-4.5 или Luma Ray 3, но сначала создайте чистый reference still. Если сразу просить видео без стабильного портрета, модель будет исправлять identity на лету.",
        before:
          "Сделай персонажа и сразу 10-секундный трейлер.",
        after:
          "Stage 1: generate 3 reference stills in GPT Image 2 or Nano Banana Pro. Stage 2: choose one approved still. Stage 3: animate only that still in Kling 3.0 or Runway Gen-4.5 with a preserve block.",
        imageSrc: "/blog/consistent-character-ai/ru/step-3.jpg",
      },
      {
        title: "Исправляйте drift одной точной командой",
        body:
          "Самая частая ошибка - переписывать весь промпт после первого неудачного кадра. Так вы меняете не только проблему, но и все удачные признаки. Рабочий метод: найти один drift и дать одну правку. В практическом тесте для героини-детектива Nano Banana Pro первый рендер сделал шрам на правой брови вместо левой; повтор с `preserve the scar on the left eyebrow, do not mirror facial marks` исправил сторону без изменения прически и плаща. В Kling 3.0 при анимации того же still первый рендер добавил шестой палец; `preserve finger count, keep both hands anatomically correct` убрал артефакт, не меняя позу.",
        before:
          "Перегенерируй, она должна быть той же, но лучше, без ошибок.",
        after:
          "Change only: move the eyebrow scar back to the left eyebrow. Preserve: face shape, haircut, trench coat, necklace, pose, camera angle, lighting. Constraints: do not mirror facial marks, no new accessories.",
        imageSrc: "/blog/consistent-character-ai/ru/step-4.jpg",
      },
      {
        title: "Проверьте серию как лист раскадровки",
        body:
          "Когда есть 4-6 удачных кадров, сложите их в один storyboard и проверьте глазами, а не по одному изображению. Ищите пять расхождений: другая форма лица, пропавшая деталь, смена возраста, новая одежда без причины, руки и пропорции. Если серия нужна для бренда или комикса, добавьте финальный consistency prompt: `same character sheet, same identity, different scenes, no redesign`. Для видео держите длительность короткой и задавайте только одно движение камеры. Чем меньше событий в клипе, тем меньше поводов для identity drift.",
        before:
          "Сделай еще четыре сцены с этим персонажем.",
        after:
          "Storyboard QA: compare face shape, eyebrow scar, haircut, necklace, coat color, hand anatomy, age. Generate next scene only after the current frame passes the identity checklist.",
      },
    ],
    faq: [
      {
        q: "Как сделать одинакового персонажа в нейросети?",
        a: "Сначала создайте identity-карту персонажа: лицо, волосы, одежда, отличительные детали, палитра и ограничения. Затем повторяйте эти признаки в каждом промпте и отделяйте их от переменных сцены. Для серии лучше генерировать кадры по одному и исправлять только один drift за итерацию.",
      },
      {
        q: "Почему нейросеть меняет лицо персонажа между кадрами?",
        a: "Чаще всего промпт описывает сцену, но не фиксирует identity. Модель считает лицо редактируемой частью картинки и адаптирует его под новый ракурс или стиль. Добавьте preserve-блок: сохранить форму лица, волосы, возраст, пропорции, одежду и отличительные marks; менять только локацию, позу или камеру.",
      },
      {
        q: "Какая модель лучше для consistent character AI?",
        a: "Для изображений начните с GPT Image 2, Nano Banana Pro или Seedream 5: они хорошо читают структурированные identity-брифы. Midjourney 8.1 сильна для стильных серий, но требует короткого повторяемого описания. Для анимации готового кадра используйте Kling 3.0, Runway Gen-4.5 или Luma Ray 3 с preserve-блоком.",
      },
      {
        q: "Нужен ли один reference image для каждого кадра?",
        a: "Один сильный reference still обычно лучше, чем пять слабых. Для моделей с поддержкой референсов добавляйте 2-4 изображения только если они показывают разные ракурсы одного и того же героя. Не смешивайте разные версии персонажа: модель усреднит их и потеряет узнаваемость.",
      },
      {
        q: "Как сохранить персонажа в видео?",
        a: "Сначала получите стабильный still, затем анимируйте именно его. В video prompt задайте короткую длительность, одно движение камеры и preserve-блок для лица, рук, одежды, фона и пропорций. Для людей отдельно фиксируйте количество пальцев и отсутствие новых аксессуаров.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "consistent-character-ai",
  title: "Consistent character AI: a workflow that holds",
  excerpt:
    "A practical consistent character AI workflow: identity card, stable references, preserve constraints, model choice, and storyboard QA for images and video.",
  description:
    "Learn a consistent character AI workflow for GPT Image 2, Nano Banana Pro, Midjourney 8.1, Kling 3.0, and Runway Gen-4.5 without identity drift.",
  category: "guide",
  tags: ["ai-image-gen", "workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "image-to-video", "prompt-structure"],
  body: {
    intro:
      "Consistent character AI is not a single magic prompt; it is a repeatable identity workflow. To keep the same character across images or video, lock references, face traits, wardrobe, proportions, color palette, and drift constraints. GPT Image 2, Nano Banana Pro, Midjourney 8.1, and Kling 3.0 behave far better when those constants are explicit.",
    steps: [
      {
        title: "Build an identity card first",
        body:
          "Start with an identity card, not a render request: age range, face shape, hair, memorable marks, silhouette, wardrobe, palette, and lighting style. For consistent character AI this matters more than aesthetic adjectives. The model needs to know which details make the person the same character and which details can vary between scenes. GPT Image 2 and Nano Banana Pro respond well to a brief with separate `Identity`, `Wardrobe`, `Palette`, and `Do not change` lines. Midjourney 8.1 usually works better with a shorter description repeated in every shot.",
        before:
          "Make a noir detective woman in several scenes.",
        after:
          "Identity: woman detective, 32, oval face, short black bob haircut, small scar through left eyebrow, calm focused expression. Wardrobe: dark green trench coat, white shirt, thin silver necklace. Palette: wet asphalt, lime reflection, low-key noir light. Do not change: face shape, scar, haircut, necklace.",
        imageSrc: "/blog/consistent-character-ai/en/step-1.jpg",
      },
      {
        title: "Separate constants from variables",
        body:
          "Next, explicitly split what must repeat from what may change. Constants: face, hair, mole or scar, core outfit, body proportions, age, and the overall style. Variables: location, action, shot size, weather, expression, and props. If everything sits in one paragraph, the model cannot infer hierarchy and every frame starts redesigning the character. A useful prompt order is identity first, then scene, then camera, then constraints.",
        before:
          "Same character in a cafe, on the street, and in an office, beautiful and realistic.",
        after:
          "Keep constant: face, black bob haircut, eyebrow scar, green trench coat, silver necklace, body proportions. Vary only: location, pose, camera distance, background action. Scene 1: quiet cafe window at night, medium shot, character reading a notebook.",
        imageSrc: "/blog/consistent-character-ai/en/step-2.jpg",
      },
      {
        title: "Pick the model for the series type",
        body:
          "For a still-image sequence, start with GPT Image 2, Nano Banana Pro, or Seedream 5 because they read structured briefs and reference roles well. Flux Kontext is useful for precise edits to an existing frame where composition must stay locked. Midjourney 8.1 is strong on style, but it needs discipline: less JSON, more short repeated traits. For video and image-to-video, use Kling 3.0, Runway Gen-4.5, or Luma Ray 3 after you have a clean reference still. Asking for video before the portrait is stable makes the model repair identity mid-motion.",
        before:
          "Create the character and immediately make a 10-second trailer.",
        after:
          "Stage 1: generate 3 reference stills in GPT Image 2 or Nano Banana Pro. Stage 2: choose one approved still. Stage 3: animate only that still in Kling 3.0 or Runway Gen-4.5 with a preserve block.",
        imageSrc: "/blog/consistent-character-ai/en/step-3.jpg",
      },
      {
        title: "Fix drift with one precise instruction",
        body:
          "The common mistake is rewriting the whole prompt after the first bad frame. That changes the problem and the successful details at the same time. The better method: identify one drift and issue one correction. In a real detective-character test, Nano Banana Pro's first render put the scar on the right eyebrow instead of the left; rerunning with `preserve the scar on the left eyebrow, do not mirror facial marks` fixed the side without changing the hair or trench coat. In Kling 3.0, animating the same still first produced six fingers; `preserve finger count, keep both hands anatomically correct` removed the artifact without changing the pose.",
        before:
          "Regenerate it, same character but better, no mistakes.",
        after:
          "Change only: move the eyebrow scar back to the left eyebrow. Preserve: face shape, haircut, trench coat, necklace, pose, camera angle, lighting. Constraints: do not mirror facial marks, no new accessories.",
        imageSrc: "/blog/consistent-character-ai/en/step-4.jpg",
      },
      {
        title: "Review the sequence as a storyboard",
        body:
          "Once you have 4-6 usable frames, place them together as a storyboard and compare them as a set, not one by one. Look for five mismatches: changed face shape, missing mark, age shift, unplanned outfit change, and hand or proportion errors. For a brand mascot or comic, add a final consistency prompt: `same character sheet, same identity, different scenes, no redesign`. For video, keep duration short and use one camera move. Fewer events give the model fewer chances to drift.",
        before:
          "Make four more scenes with this character.",
        after:
          "Storyboard QA: compare face shape, eyebrow scar, haircut, necklace, coat color, hand anatomy, age. Generate next scene only after the current frame passes the identity checklist.",
      },
    ],
    faq: [
      {
        q: "How do you make a consistent character with AI?",
        a: "Create an identity card first: face, hair, outfit, memorable marks, palette, and constraints. Repeat those traits in every prompt and separate them from scene variables. Generate one frame at a time and correct only one drift per iteration.",
      },
      {
        q: "Why does AI change the character's face between images?",
        a: "Usually the prompt describes the scene but does not lock identity. The model treats the face as editable material and adapts it to the new angle or style. Add a preserve block for face shape, hair, age, proportions, outfit, and memorable marks; vary only location, pose, or camera.",
      },
      {
        q: "What is the best model for consistent character AI?",
        a: "For images, start with GPT Image 2, Nano Banana Pro, or Seedream 5 because they follow structured identity briefs well. Midjourney 8.1 is strong for stylized sequences, but it needs a short repeated character description. For animation, use Kling 3.0, Runway Gen-4.5, or Luma Ray 3 with a preserve block.",
      },
      {
        q: "Do I need one reference image for every frame?",
        a: "One strong reference still is usually better than five weak ones. If the model supports multiple references, add 2-4 images only when they show different angles of the same exact character. Do not mix different character versions, or the model will average them and lose recognizability.",
      },
      {
        q: "How do you keep the same character in AI video?",
        a: "First generate a stable still image, then animate that exact frame. In the video prompt, set short duration, one camera move, and a preserve block for face, hands, outfit, background, and proportions. For people, explicitly preserve finger count and block new accessories.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
