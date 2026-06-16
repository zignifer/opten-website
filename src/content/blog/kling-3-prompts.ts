import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-05";

const COVER_RU = {
  src: "/blog/kling-3-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про Kling 3.0 промпты и управляемое AI-видео",
};
const COVER_EN = {
  src: "/blog/kling-3-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a Kling 3.0 prompt guide and controllable AI video workflow",
};

const ru: BlogPostLocale = {
  slug: "kling-3-prompts",
  title: "Kling 3.0: промпты для управляемого AI-видео",
  excerpt:
    "Для Kling 3.0 нужны не красивые теги, а режиссерский prompt: сцена, камера, движение, continuity и ограничения.",
  description:
    "Kling 3.0 — это AI-видео модель для управляемых сцен. Разбираем Omni, motion prompt, цену и типичные ошибки.",
  category: "guide",
  tags: ["release-notes", "model-deep-dive", "ai-video-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "seedance-2-0-prompts"],
  body: {
    intro:
      "Kling 3.0 — это линейка AI video моделей Kuaishou для более длинных, связных и управляемых сцен: Video 3.0, Video 3.0 Omni, Image 3.0 и Image 3.0 Omni. В промпте для Kling 3.0 нужно описывать не только идею, но и камеру, движение, continuity, звук и запреты.",
    steps: [
      {
        title: "Пишите сцену как режиссерский бриф",
        body:
          "Главная ошибка в промпте для Kling 3 — начинать с имени модели и набора эстетических слов. `Kling 3.0, cinematic, realistic, dramatic` не объясняет, что происходит в кадре, где стоит камера и какой объект нельзя менять. Модель получает настроение, но не получает постановку.\n\nРабочий порядок проще: `Scene` -> `Subject` -> `Action` -> `Camera` -> `Motion` -> `Lighting` -> `Audio` -> `Constraints`. Даже если вы думаете по-русски, финальный production prompt лучше собрать на английском: camera path, subject lock и motion constraints обычно читаются стабильнее. Opten здесь полезен как preflight: он разворачивает короткую идею в блоки и подсвечивает, где забыта камера или запрет.",
        before:
          "Kling 3.0, мужчина идет по улице ночью, cinematic, realistic, beautiful camera.",
        after:
          "Scene: narrow wet city street at night with soft neon reflections.\nSubject: one man in a dark coat, same face and outfit through the whole clip.\nAction: he walks slowly toward a small street food stall.\nCamera: locked eye-level tracking shot, 50mm lens, slow backward dolly.\nMotion: natural walking pace, no sudden cuts.\nLighting: green and amber neon rim light, realistic skin texture.\nAudio: quiet street ambience only.\nConstraints: no face change, no extra people in foreground, no shaky camera, no random text.",
        imageSrc: "/blog/kling-3-prompts/ru/step-1.jpg",
      },
      {
        title: "Фиксируйте камеру, движение и объект вместе",
        body:
          "Kling 3.0 стал сильнее в связности, но короткий motion prompt все равно может развалить сцену. Если камера «летит вокруг героя», а герой не зафиксирован, модель может сменить лицо, одежду или пропорции между кадрами. Если объект зафиксирован, но камера описана общо, кадр дрожит или делает лишний рывок.\n\nПрактический кейс: запрос про человека на ночной улице дал красивый свет, но камера хаотично прыгала, а лицо менялось на втором повороте. Исправление было не в `more stable`, а в связке: `locked eye-level tracking shot`, `same face and outfit`, `slow backward dolly`, `no sudden cuts`. После такого блока клип остается живым, но перестает выглядеть как нарезка случайных кадров.",
        before:
          "A man walks through a neon street, camera moves around him, cinematic motion.",
        after:
          "Subject lock: preserve the same face, coat, body proportions, walking rhythm, and distance to camera.\nCamera path: locked eye-level tracking shot, slow backward dolly, no orbit, no whip pan.\nMotion constraints: natural walking speed, stable horizon, no sudden cuts, no duplicated limbs.",
        imageSrc: "/blog/kling-3-prompts/ru/step-2.jpg",
      },
      {
        title: "Для Kling 3.0 Omni думайте шотами, а не одним абзацем",
        body:
          "Kling 3.0 Omni полезен там, где нужен reference-based контроль: один персонаж, один продукт, одна сцена или несколько планов с сохранением идентичности. Но Omni не отменяет структуру. Если все действия написаны одним длинным абзацем, модель сама решает, где менять крупность и когда переходить к следующему beat'у.\n\nДля 10-15 секунд пишите storyboard: 0-4с setup, 4-9с развитие, 9-15с payoff. В каждом шоте повторяйте то, что нельзя потерять: лицо, силуэт продукта, направление света, отношение камеры к объекту. Так Omni получает не «сделай кино», а понятную монтажную схему.",
        before:
          "Make a 15-second story: the designer looks at a product, city lights move, camera cuts, product appears in hand, dramatic ending.",
        after:
          "0-4s: medium shot, designer stands by a rain-covered window, product box on the table, camera locked.\n4-9s: slow push-in to the same product box, designer's hand enters frame, same lighting direction.\n9-15s: hero close-up of the box in hand, background city lights stay soft, no new objects.\nContinuity: preserve product shape, hand anatomy, coat color, room layout, and green rim light.",
        imageSrc: "/blog/kling-3-prompts/ru/step-3.jpg",
      },
      {
        title: "Проверяйте цену и доступность в интерфейсе, а промпт — до рендера",
        body:
          "Поисковый запрос про цену Kling 3.0 быстро устаревает: тарифы, лимиты, доступ к Omni и кредитная стоимость зависят от площадки и могут меняться. Поэтому в статье безопаснее держать постоянную часть: проверяйте цену конкретного рендера в интерфейсе перед запуском, а не ориентируйтесь на старый скриншот из обзора.\n\nС промптом наоборот: preflight лучше делать до траты кредитов. Пройдитесь по чеклисту: есть ли scene, subject lock, camera path, timing, audio и constraints. Если один блок пустой, модель заполнит его сама. Opten можно использовать как быстрый редактор такого брифа: он превращает сырой запрос в модельно-готовый prompt и помогает убрать лишние общие слова.",
        before:
          "Make it high quality, stable, professional, no errors.",
        after:
          "Preflight checklist:\nScene: clear location and time of day.\nSubject lock: identity, outfit, product shape, or key object preserved.\nCamera: lens, distance, movement path, horizon stability.\nTiming: one action for short clips, storyboard for 10-15s.\nConstraints: no random text, no face drift, no sudden camera jump, no warped hands.",
        imageSrc: "/blog/kling-3-prompts/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое Kling 3.0?",
        a: "Kling 3.0 — это линейка моделей Kuaishou для AI-видео и изображений: Video 3.0, Video 3.0 Omni, Image 3.0 и Image 3.0 Omni. Для автора промптов важны не только названия, а новые требования к постановке: шоты, камера, continuity, звук и запреты.",
      },
      {
        q: "Чем Kling 3.0 отличается от старых video-моделей?",
        a: "По официальному релизу Kuaishou, акцент Kling 3.0 сделан на более длинных видео до 15 секунд, multi-shot storytelling, native audio, reference-based consistency и лучшем сохранении текста или брендовых элементов. Это не отменяет хороший prompt: без структуры модель все равно додумывает сцену.",
      },
      {
        q: "Как писать промпт для Kling 3, чтобы персонаж оставался стабильным?",
        a: "Добавьте subject lock рядом с движением: лицо, одежда, силуэт, дистанция до камеры и ритм движения должны оставаться одинаковыми. Затем отдельно задайте camera path: locked tracking shot, slow push-in, fixed horizon или другой конкретный маршрут.",
      },
      {
        q: "Что такое Kling 3.0 Omni?",
        a: "Kling 3.0 Omni — вариант для reference-based генерации и более сложного storyboarding. Его имеет смысл использовать, когда нужно сохранять персонажа, голос, продукт или несколько шотов в одной сцене. Промпт для Omni лучше писать по шотам, а не одним длинным абзацем.",
      },
      {
        q: "Где смотреть цену Kling 3.0?",
        a: "Проверяйте цену и кредитную стоимость в той платформе, где вы запускаете рендер. Доступность, тарифы и стоимость Omni могут меняться, поэтому старые обзоры быстро становятся ненадежными. Перед запуском важнее проверить и цену, и сам prompt.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "kling-3-prompts",
  title: "Kling 3.0 prompts: controllable AI video guide",
  excerpt:
    "Kling 3.0 and kling 3 prompts need director-style structure: scene, camera path, subject lock, motion constraints, and timing.",
  description:
    "Kling 3.0 prompt guide for controllable AI video: write scene blocks, camera motion, subject continuity, Omni storyboards, and constraints.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Kling 3.0 is Kuaishou's AI video and image model series for longer, more controllable scenes: Video 3.0, Video 3.0 Omni, Image 3.0, and Image 3.0 Omni. A good kling 3.0 prompt describes not only the idea, but camera motion, subject continuity, timing, audio, and constraints.",
    steps: [
      {
        title: "Write a director brief, not a model tag",
        body:
          "The first mistake with kling 3 prompts is starting with the model name and a stack of aesthetic words. `Kling 3.0, cinematic, realistic, dramatic` gives the model a mood, but not blocking. It still has to guess where the camera is, what must stay stable, and what actually changes during the clip.\n\nUse a production order: `Scene` -> `Subject` -> `Action` -> `Camera` -> `Motion` -> `Lighting` -> `Audio` -> `Constraints`. Even when the original idea is in another language, the final production prompt is usually stronger in English because camera path, subject lock, and motion constraints map cleanly. Opten works as a quick preflight here: it expands the rough idea into blocks and catches missing camera or constraint fields.",
        before:
          "Kling 3.0, man walking in a street at night, cinematic, realistic, beautiful camera.",
        after:
          "Scene: narrow wet city street at night with soft neon reflections.\nSubject: one man in a dark coat, same face and outfit through the whole clip.\nAction: he walks slowly toward a small street food stall.\nCamera: locked eye-level tracking shot, 50mm lens, slow backward dolly.\nMotion: natural walking pace, no sudden cuts.\nLighting: green and amber neon rim light, realistic skin texture.\nAudio: quiet street ambience only.\nConstraints: no face change, no extra people in foreground, no shaky camera, no random text.",
        imageSrc: "/blog/kling-3-prompts/en/step-1.jpg",
      },
      {
        title: "Lock camera, motion, and subject together",
        body:
          "Kling 3.0 ai is better at consistency, but a short motion prompt can still break the scene. If the camera is told to move around a person and the person is not locked, the model may change the face, coat, or body proportions between beats. If the subject is locked but the camera is vague, the shot can wobble or cut too hard.\n\nPractical case: a prompt about a person on a neon night street produced good lighting, but the camera jumped and the face changed on the turn. The fix was not `more stable`; it was a linked set of instructions: `locked eye-level tracking shot`, `same face and outfit`, `slow backward dolly`, `no sudden cuts`. The clip still has motion, but it stops feeling like random stitched frames.",
        before:
          "A man walks through a neon street, camera moves around him, cinematic motion.",
        after:
          "Subject lock: preserve the same face, coat, body proportions, walking rhythm, and distance to camera.\nCamera path: locked eye-level tracking shot, slow backward dolly, no orbit, no whip pan.\nMotion constraints: natural walking speed, stable horizon, no sudden cuts, no duplicated limbs.",
        imageSrc: "/blog/kling-3-prompts/en/step-2.jpg",
      },
      {
        title: "For kling 3.0 omni, think in shots",
        body:
          "Kling 3.0 Omni matters when you need reference-based control: one character, one product, one location, or several shots with preserved identity. But Omni does not remove the need for structure. If every action lives in one long paragraph, the model decides where to cut, when to change shot size, and which detail can drift.\n\nFor 10-15 seconds, write a storyboard: 0-4s setup, 4-9s development, 9-15s payoff. In each beat, repeat the thing that cannot be lost: face, product silhouette, lighting direction, or camera relationship. That gives kling 3.0 omni a usable edit plan instead of a vague request to \"make it cinematic.\"",
        before:
          "Make a 15-second story: the designer looks at a product, city lights move, camera cuts, product appears in hand, dramatic ending.",
        after:
          "0-4s: medium shot, designer stands by a rain-covered window, product box on the table, camera locked.\n4-9s: slow push-in to the same product box, designer's hand enters frame, same lighting direction.\n9-15s: hero close-up of the box in hand, background city lights stay soft, no new objects.\nContinuity: preserve product shape, hand anatomy, coat color, room layout, and green rim light.",
        imageSrc: "/blog/kling-3-prompts/en/step-3.jpg",
      },
      {
        title: "Check pricing in the UI, but check the prompt first",
        body:
          "Searches for kling 3.0 pricing age quickly because plans, limits, Omni access, and credit costs vary by platform and can change. The durable rule is simple: check the specific render cost in the tool before you press generate, not from an old review screenshot.\n\nThe prompt check is more predictable. Before spending credits, scan for scene, subject lock, camera path, timing, audio, and constraints. If one field is blank, the model will fill it for you. Opten can serve as the editor for that brief: it turns a raw idea into a model-ready prompt and trims generic lines that do not control the video.",
        before:
          "Make it high quality, stable, professional, no errors.",
        after:
          "Preflight checklist:\nScene: clear location and time of day.\nSubject lock: identity, outfit, product shape, or key object preserved.\nCamera: lens, distance, movement path, horizon stability.\nTiming: one action for short clips, storyboard for 10-15s.\nConstraints: no random text, no face drift, no sudden camera jump, no warped hands.",
        imageSrc: "/blog/kling-3-prompts/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What is kling 3.0?",
        a: "Kling 3.0 is Kuaishou's model series for AI video and image generation: Video 3.0, Video 3.0 Omni, Image 3.0, and Image 3.0 Omni. For prompt writers, the useful change is tighter control over shots, references, audio, consistency, and longer scene structure.",
      },
      {
        q: "How is kling 3 different from older AI video models?",
        a: "Kuaishou's official release highlights longer clips up to 15 seconds, multi-shot storytelling, native audio, reference-based consistency, and better preservation of text or branded elements. Those features still need a structured prompt; the model cannot infer every camera and continuity rule for you.",
      },
      {
        q: "What is the best kling 3.0 ai prompt structure?",
        a: "Use Scene -> Subject -> Action -> Camera -> Motion -> Lighting -> Audio -> Constraints. For products or characters, add a subject-lock line. For longer clips, add timestamped beats so the model knows when the shot changes.",
      },
      {
        q: "What is kling 3.0 omni?",
        a: "Kling 3.0 Omni is the reference-based, storyboard-oriented variant for stronger consistency across characters, products, voices, or multiple shots. Treat it like a shot plan: duration, shot size, perspective, action, camera movement, and continuity rules for each beat.",
      },
      {
        q: "Where should I check kling 3.0 pricing?",
        a: "Check pricing and credit cost inside the platform where you will run the render. Access, plans, and Omni pricing can change by provider, so old articles or screenshots are not reliable enough for production budgeting.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
