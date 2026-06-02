import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-02";

const COVER_RU = {
  src: "/blog/prompt-examples/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про примеры промптов для нейросети",
};

const COVER_EN = {
  src: "/blog/prompt-examples/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a guide to prompt examples and model-specific adaptation",
};

const ru: BlogPostLocale = {
  slug: "prompt-examples",
  title: "Примеры промптов: как разбирать и улучшать под модель",
  excerpt:
    "Примеры промптов для нейросети работают лучше, когда вы видите структуру, модельные допущения и слабые места, а не копируете шаблон вслепую.",
  description:
    "Примеры промптов: как разбирать структуру, адаптировать под GPT Image 2, Midjourney, Kling и улучшать запросы для фото, картинок и ChatGPT.",
  category: "guide",
  tags: ["prompt-engineering", "workflow", "ai-image-gen"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "gpt-image-2"],
  body: {
    intro:
      "Примеры промптов помогают не тогда, когда их копируют целиком, а когда по ним видно логику запроса: цель, сцена, модель, ограничения и критерий результата. Хороший пример промпта показывает, что менять под свою задачу, а не обещает универсальную фразу для любой нейросети.",
    steps: [
      {
        title: "Разбирайте примеры промптов, а не собирайте коллекцию",
        body:
          "Большая подборка выглядит полезной, но чаще мешает. Человек берет строку из чужого кейса, вставляет ее в Midjourney 8.1, GPT Image 2 или Kling 3.0 и получает другой стиль, другой свет или слишком общий результат. Причина простая: пример был написан под конкретную модель, формат и исходный материал.\n\nРаботайте с примером как с разметкой. Найдите задачу, субъект, стиль, камеру, свет, ограничения и критерий проверки. Если в промпте есть только красивые слова вроде `cinematic`, `ultra detailed`, `award winning`, это не готовый prompt, а набор эстетических маркеров. Его нужно превратить в бриф, иначе модель сама решит, что важнее: лицо, фон, текст, движение или настроение.",
        before:
          "cinematic cyberpunk city, girl, neon, ultra detailed, 8k, masterpiece",
        after:
          "Задача: обложка статьи 16:9. Сцена: ночная улица с мокрым асфальтом. Субъект: один человек в желтом плаще, средний план. Свет: синий неон слева, лаймовый контровой справа. Ограничения: без логотипов, без текста, без толпы.",
        imageSrc: "/blog/prompt-examples/ru/step-1.jpg",
      },
      {
        title: "Примеры промптов для нейросети читайте по блокам",
        body:
          "У сильного примера почти всегда есть пять блоков: `Purpose`, `Scene`, `Subject`, `Style and camera`, `Constraints`. Для изображения добавляются материал, свет и точный текст в кавычках. Для видео - действие, длительность, вторичное движение и запреты на лишние склейки. Для ChatGPT - роль, контекст, формат ответа, критерии качества и границы: что не придумывать, что спросить перед ответом.\n\nЕсли блок отсутствует, это не повод выкинуть пример. Это подсказка, где он хрупкий. Промпт без цели часто дает красивую, но бесполезную картинку. Промпт без constraints тащит лишние логотипы, пальцы, текст или толпу. Промпт без критерия проверки трудно улучшать: непонятно, что именно сломалось после первого рендера.",
        before:
          "Сделай красивое фото продукта на темном фоне.",
        after:
          "Purpose: hero product image for a landing page. Product: matte black wireless headphones. Scene: dark graphite surface, lime rim light. Camera: 70mm product photography, three-quarter view. Constraints: no logo, no text, no extra objects.",
        imageSrc: "/blog/prompt-examples/ru/step-2.jpg",
      },
      {
        title: "Адаптируйте примеры промптов для фото и картинок",
        body:
          "Примеры промптов для фото, примеры промптов для картинок и примеры промптов для генерации изображений не взаимозаменяемы. Фото-промпт держится на объективе, ракурсе, источнике света, материале и естественных дефектах. Иллюстративный image prompt держится на форме, палитре, уровне стилизации и чистоте композиции. Если перенести одно в другое без правки, модель часто смешает жанры: продуктовый кадр станет постером, а реалистичный портрет уйдет в глянец.\n\nПрактическое правило: перед вставкой примера задайте три вопроса. Какая модель его понимает лучше? Какой формат нужен: фото, иллюстрация, видео или текстовый ответ? Какие слова в примере отвечают за результат, а какие просто декоративный шум? Opten можно использовать как быстрый reviewer: он разворачивает короткий запрос в модельный prompt и подсвечивает пустые места до траты кредитов.",
        before:
          "portrait of a chef, cinematic, realistic, beautiful, detailed",
        after:
          "Editorial photo portrait of a chef after service. 85mm lens, eye-level close medium shot, tired smile, soft kitchen practical light, visible steam in background, natural skin texture. Constraints: no plastic skin, no extra hands, no logo on uniform.",
        imageSrc: "/blog/prompt-examples/ru/step-3.jpg",
      },
      {
        title: "Кейс GPT Image 2: чужой пример дал другой стиль",
        body:
          "Практический кейс: команда взяла готовый prompt для Midjourney 8.1 - `minimal product shot, lime glow, premium, sharp shadows` - и перенесла его в GPT Image 2. Результат был аккуратным, но не тем: модель сделала слишком пустой кадр, смягчила тени и потеряла ощущение дорогого материала. Проблема была не в модели, а в том, что пример полагался на Midjourney-эстетику и не объяснял назначение кадра.\n\nИсправление заняло одну итерацию. Мы добавили purpose, материал, свет и композицию: `landing page hero for a premium AI tool, brushed black metal object, one lime rim light, diagonal shadow across the lower third, subject fills 45% of frame, no text`. После этого GPT Image 2 дал ближе к нужному результату: меньше случайной эстетики, больше управляемого кадра. Это и есть промпт инжиниринг: примеры промптов нужны как исходник, а не как финальная команда.",
        before:
          "minimal product shot, lime glow, premium, sharp shadows",
        after:
          "Landing page hero for a premium AI tool. Subject: abstract brushed black metal prompt cube, fills 45% of frame. Lighting: one lime rim light from upper right, diagonal shadow across lower third. Constraints: no text, no logo, no extra UI.",
        imageSrc: "/blog/prompt-examples/ru/step-4.jpg",
      },
      {
        title: "Примеры промптов ChatGPT проверяйте по формату ответа",
        body:
          "Примеры промптов ChatGPT ломаются иначе, чем image prompts. Визуальная модель чаще теряет свет, композицию или identity; текстовая модель чаще отвечает не в том формате, придумывает недостающие факты или пишет слишком общий совет. Поэтому в ChatGPT-примере важны не красивые вводные, а формат вывода и критерии.\n\nХороший запрос говорит: что у модели есть на входе, что считать успехом, какой формат ответа нужен и когда надо задать уточняющий вопрос. Например: `Ты редактор лендингов. Проверь этот блок на конкретность. Верни таблицу: проблема, почему мешает, точная правка. Не добавляй новые факты`. Такой пример легко адаптировать под SEO, UX, email или сценарий видео, потому что в нем видны роли и границы.",
        before:
          "Ты эксперт. Улучши этот текст и сделай его продающим.",
        after:
          "Ты редактор SaaS-лендингов. Найди 5 мест, где текст звучит общо. Верни таблицу: фраза, проблема, точная замена. Не добавляй факты, которых нет во входном тексте.",
        imageSrc: "/blog/prompt-examples/ru/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "Где брать хорошие примеры промптов?",
        a: "Лучше брать их из кейсов, где указан результат, модель и условия: исходники, формат, ограничения, первая ошибка и правка. Голые списки из 100 фраз полезны только как словарь идей, но не как готовый workflow.",
      },
      {
        q: "Как использовать примеры промптов для нейросети без копирования?",
        a: "Разберите пример на блоки: цель, сцена, субъект, стиль, камера или формат ответа, ограничения и критерий проверки. Затем замените только те блоки, которые отличаются в вашей задаче. Так сохраняется структура, но запрос становится вашим.",
      },
      {
        q: "Что значит промпт инжиниринг на примерах промптов?",
        a: "Это не запоминание удачных фраз, а умение видеть, почему пример сработал: какая часть задала композицию, какая ограничила модель, какая сохранила стиль или формат. После этого пример можно переносить между GPT Image 2, Midjourney, Kling и ChatGPT осознанно.",
      },
      {
        q: "Подходят ли примеры промптов для фото к генерации изображений?",
        a: "Подходят как основа, но требуют адаптации. Для фото важны объектив, свет, поза, материал и естественная фактура. Для иллюстрации или постера важнее стилизация, палитра, форма и чистая композиция. Без правки модель смешает жанры.",
      },
      {
        q: "Почему пример промпта дает другой результат у меня?",
        a: "Обычно отличаются модель, версия, исходное изображение, aspect ratio или скрытые настройки. Еще пример мог зависеть от предыдущих итераций. Исправляйте не весь prompt, а одну ось: свет, композицию, стиль, ограничения или формат ответа.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "prompt-examples",
  title: "Prompt examples: how to adapt them to any model",
  excerpt:
    "Prompt examples work when you read the structure, model assumptions, and weak spots before turning them into image prompt ideas or ChatGPT prompts.",
  description:
    "Use prompt examples as patterns, not templates. Learn how to adapt AI art prompts, image prompt ideas, and ChatGPT prompts to the model.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Prompt examples are useful when they reveal the logic of a request: goal, scene, model, constraints, and success criteria. They fail when copied as universal templates. A good example shows what to change for your model and task, not a magic sentence that works everywhere.",
    steps: [
      {
        title: "Treat prompt examples as patterns, not collections",
        body:
          "A giant list feels useful, but it often slows people down. You copy a line from someone else's Midjourney 8.1, GPT Image 2, or Kling 3.0 case and get a different style, different lighting, or a flat result. The reason is usually simple: the example was written for one model, one format, and one source material.\n\nRead the example as markup. Find the job, subject, style, camera, lighting, constraints, and quality check. If the prompt only says `cinematic`, `ultra detailed`, `award winning`, it is not a working prompt yet. It is a bag of aesthetic tags. Turn it into a brief or the model will decide what matters: face, background, text, motion, or mood.",
        before:
          "cinematic cyberpunk city, girl, neon, ultra detailed, 8k, masterpiece",
        after:
          "Job: 16:9 article cover. Scene: wet night street. Subject: one person in a yellow raincoat, medium shot. Light: blue neon from left, lime rim light from right. Constraints: no logos, no text, no crowd.",
        imageSrc: "/blog/prompt-examples/en/step-1.jpg",
      },
      {
        title: "Read prompt examples block by block",
        body:
          "Strong prompt examples usually have five blocks: `Purpose`, `Scene`, `Subject`, `Style and camera`, `Constraints`. For image models, add material, light, and exact quoted text if text must appear in the frame. For video, add action, duration, secondary motion, and bans on extra cuts. For ChatGPT, add role, context, output format, quality criteria, and boundaries: what not to invent and when to ask a question.\n\nA missing block does not make the example useless. It shows where the prompt is fragile. A prompt without a job often creates a nice but pointless image. A prompt without constraints pulls in stray logos, fingers, text, or crowds. A prompt without a quality check is hard to improve because you cannot tell what actually broke in the first render.",
        before:
          "Make a beautiful product photo on a dark background.",
        after:
          "Purpose: hero product image for a landing page. Product: matte black wireless headphones. Scene: dark graphite surface, lime rim light. Camera: 70mm product photography, three-quarter view. Constraints: no logo, no text, no extra objects.",
        imageSrc: "/blog/prompt-examples/en/step-2.jpg",
      },
      {
        title: "Adapt AI art prompts and image prompt ideas",
        body:
          "AI art prompts, image prompt ideas, and photo prompt ideas are not interchangeable. A photo prompt depends on lens, angle, light source, material, and natural imperfections. An illustrative image prompt depends on shape, palette, stylization level, and composition clarity. Move one into the other without editing and the model often blends genres: a product photo becomes a poster, or a realistic portrait turns glossy.\n\nBefore using an example, ask three questions. Which model understands it best? Which output do you need: photo, illustration, video, or text answer? Which words in the prompt drive the result, and which are decorative noise? Opten can work as a quick preflight here: expand a short request into a model-specific prompt and catch missing blocks before you spend credits.",
        before:
          "portrait of a chef, cinematic, realistic, beautiful, detailed",
        after:
          "Editorial photo portrait of a chef after service. 85mm lens, eye-level close medium shot, tired smile, soft kitchen practical light, visible steam in background, natural skin texture. Constraints: no plastic skin, no extra hands, no logo on uniform.",
        imageSrc: "/blog/prompt-examples/en/step-3.jpg",
      },
      {
        title: "GPT Image 2 case: copied style did not transfer",
        body:
          "Practical case: a team copied a Midjourney 8.1 prompt into GPT Image 2: `minimal product shot, lime glow, premium, sharp shadows`. The result was clean but wrong. GPT Image 2 made the frame too empty, softened the shadows, and lost the expensive material feel. The problem was not the model. The example relied on Midjourney aesthetics and never explained the shot's purpose.\n\nThe fix took one iteration. We added purpose, material, lighting, and composition: `landing page hero for a premium AI tool, brushed black metal object, one lime rim light, diagonal shadow across the lower third, subject fills 45% of frame, no text`. GPT Image 2 then moved much closer: less random style, more controlled frame. That is the useful side of prompt engineering: examples are raw material, not final commands.",
        before:
          "minimal product shot, lime glow, premium, sharp shadows",
        after:
          "Landing page hero for a premium AI tool. Subject: abstract brushed black metal prompt cube, fills 45% of frame. Lighting: one lime rim light from upper right, diagonal shadow across lower third. Constraints: no text, no logo, no extra UI.",
        imageSrc: "/blog/prompt-examples/en/step-4.jpg",
      },
      {
        title: "Check ChatGPT prompt examples by output format",
        body:
          "ChatGPT prompt examples fail differently from image prompts. A visual model usually loses light, composition, or identity. A text model usually answers in the wrong format, invents missing facts, or gives generic advice. That is why a ChatGPT example lives or dies by output format and criteria, not by a grand opening line.\n\nA good request says what the model receives, what success means, which format to return, and when it should ask a clarifying question. Example: `You are a landing-page editor. Check this block for specificity. Return a table: issue, why it hurts, exact rewrite. Do not add new facts`. That kind of prompt example adapts cleanly to SEO, UX, email, or video scripting because its role and boundaries are visible.",
        before:
          "You are an expert. Improve this text and make it sell better.",
        after:
          "You are a SaaS landing-page editor. Find 5 places where the copy is too vague. Return a table: phrase, issue, exact replacement. Do not add facts that are not in the input.",
        imageSrc: "/blog/prompt-examples/en/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "What makes good prompt examples?",
        a: "Good prompt examples show the model, output format, constraints, first failure, and the edit that fixed it. A bare list of clever phrases is useful as idea stock, but it is not a repeatable workflow.",
      },
      {
        q: "How should I use ai art prompts without copying them?",
        a: "Split the example into blocks: purpose, scene, subject, style, camera, constraints, and quality check. Keep the structure, then replace the blocks that differ in your task. The prompt becomes yours without losing the original logic.",
      },
      {
        q: "Should I save ai art prompts as a PDF?",
        a: "A PDF can be useful as a reference library, but do not treat it as a script to paste from. Store the example, model, result, first failure, and final edit together. That makes the library searchable and reusable.",
      },
      {
        q: "Where do image prompt ideas come from?",
        a: "Useful image prompt ideas usually come from a real output gap: wrong light, weak composition, plastic skin, broken text, or a model-specific habit. Start from the failure you need to fix, then choose words that control that axis.",
      },
      {
        q: "Are photo prompt ideas different from image prompt ideas?",
        a: "Yes. Photo prompt ideas need lens, camera angle, light direction, material, and natural texture. Illustration prompts care more about shape language, palette, stylization, and composition. You can borrow between them, but you should adapt the visual grammar.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
