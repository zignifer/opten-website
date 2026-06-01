import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-28";

const COVER_RU = {
  src: "/blog/prompt-structure/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка разбора про структуру промпта для нейросетей",
};

const COVER_EN = {
  src: "/blog/prompt-structure/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a guide to AI prompt structure",
};

const ru: BlogPostLocale = {
  slug: "prompt-structure",
  title: "Структура промпта: как писать запрос к нейросети",
  excerpt:
    "Практичная структура промпта для изображений и видео: цель, сцена, модель, ограничения, проверка первого рендера и точная правка без переписывания всего запроса.",
  description:
    "Структура промпта для нейросети: 5 блоков запроса, примеры для GPT Image 2, Midjourney 8.1, Kling 3.0 и правка первого рендера для изображений и видео.",
  category: "guide",
  tags: ["prompt-engineering", "workflow", "ai-image-gen", "ai-video-gen"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2", "negative-prompt", "image-to-video"],
  body: {
    intro:
      "Структура промпта - это порядок блоков в запросе к нейросети: цель, сцена, субъект, стиль, камера, ограничения и проверка результата. Если вы ищете, как правильно писать промпт для нейросети, начинайте не с красивых тегов, а с понятного брифа под конкретную модель и формат вывода.",
    steps: [
      {
        title: "Начните с задачи, а не с красивых слов",
        body:
          "Первый блок отвечает на вопрос: зачем нужен результат. Для GPT Image 2 это может быть «обложка для статьи, 16:9, без текста», для Midjourney 8.1 - «fashion editorial кадр для moodboard», для Kling 3.0 - «5-секундный ролик с одним движением камеры». Когда цель стоит в начале, модель выбирает правильную композицию: рекламный кадр оставляет место под продукт, UI-мокап строит сетку, видео-промпт держит действие во времени. Opten полезен именно на этом шаге: он показывает, где промпт звучит как набор слов, а где уже похож на рабочий бриф.",
        before:
          "красивая картинка, неон, девушка, камера, стильное, кинематографично",
        after:
          "Задача: вертикальный fashion editorial кадр для moodboard. Субъект: модель в лаймовом плаще под дождем. Композиция: средний план, лицо не крупнее 30% кадра. Свет: мягкий неон, мокрый асфальт, без логотипов.",
        imageSrc: "/blog/prompt-structure/ru/step-1.jpg",
      },
      {
        title: "Соберите промпт из пяти блоков",
        body:
          "Базовая структура промпта держится на пяти блоках: `Purpose`, `Scene`, `Subject`, `Style and camera`, `Constraints`. Для image-моделей добавьте материал, освещение и текст в кавычках, если он должен появиться в кадре. Для video-моделей добавьте действие, вторичное движение и камеру. В Veo 3.1 и Kling 3.0 звук тоже лучше описывать явно: короткий диалог, ambience, SFX или тишина. Без этого модель часто придумывает лишнюю аудиодорожку или превращает спокойную сцену в клип с драматичной музыкой.",
        before:
          "кофейня будущего, робот-бариста, красиво, 4k, реализм",
        after:
          "Purpose: 8-second video concept. Scene: quiet futuristic coffee shop at night. Subject: robot barista pouring espresso. Motion: slow hand movement, steam rising, camera push-in. Constraints: no crowd, no brand logos, no fast cuts.",
        imageSrc: "/blog/prompt-structure/ru/step-2.jpg",
      },
      {
        title: "Подстройте структуру под модель",
        body:
          "Одна структура не означает один и тот же текст для всех движков. GPT Image 2 любит естественный бриф и точный текст в кавычках. Nano Banana Pro и Imagen 4 Ultra хорошо отвечают на детальное описание материалов, цвета и микрофактуры. Midjourney 8.1 быстрее схватывает эстетические коды, но требует аккуратных `--no` и `--style`, чтобы не уйти в глянец. В видео Runway Gen-4.5 и Luma Ray 3 важнее глагол действия и физика движения, а не список объектов. Поэтому сначала выбирайте модель, потом пишите промпт.",
        before:
          "один и тот же промпт для GPT Image 2, Midjourney 8.1, Veo 3.1 и Runway Gen-4.5",
        after:
          "Для GPT Image 2: подробный дизайнерский бриф. Для Midjourney 8.1: эстетический код + точные запреты. Для Kling 3.0: действие, камера, длительность, ограничения движения.",
        imageSrc: "/blog/prompt-structure/ru/step-3.jpg",
      },
      {
        title: "Проверяйте первый рендер как диагностику",
        body:
          "Практический кейс: в Kling 3.0 мы тестировали короткий ролик «дизайнер берет прозрачный планшет со стола и поворачивается к камере». Первый рендер дал шестой палец на правой руке и слишком резкий рывок камеры. Исправление было точечным: `preserve five fingers on each visible hand, slow handheld push-in, no sudden camera snap`. Мы не переписывали всю сцену; добавили только правило для руки и камеры. После этого действие осталось тем же, но артефакт ушел. Первый рендер нужен именно для такой диагностики, а не для оценки «нравится / не нравится».",
        before:
          "Designer picks up a transparent tablet and turns to camera, cinematic office, handheld camera.",
        after:
          "Designer picks up a transparent tablet and turns to camera. Preserve five fingers on each visible hand. Slow handheld push-in, no sudden camera snap, no warped tablet edges.",
        imageSrc: "/blog/prompt-structure/ru/step-4.jpg",
      },
      {
        title: "Исправляйте одну ось за итерацию",
        body:
          "Самая дорогая ошибка - переписывать весь промпт после каждого неудачного результата. Если фон хороший, а лицо не то, меняйте только identity-блок. Если движение верное, но камера слишком быстрая, меняйте только camera-блок. Если в Seedance 2.0 или Runway Gen-4.5 сцена разваливается во времени, добавьте timestamp или порядок beat'ов, но не трогайте стиль. Такой ритм экономит кредиты и сохраняет удачные части генерации. Для команды это еще и проще обсуждать: «правим свет» понятнее, чем «перепридумываем ролик».",
        before:
          "Сделай лучше: больше реализма, другую камеру, красивее свет, меньше артефактов, лицо исправь, фон поменяй.",
        after:
          "Итерация 2: сохранить сцену, позу и фон. Изменить только свет: мягкий боковой источник слева, меньше бликов на стекле, без изменения камеры.",
        imageSrc: "/blog/prompt-structure/ru/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое структура промпта?",
        a: "Структура промпта - это порядок смысловых блоков в запросе: задача, сцена, субъект, стиль, камера, ограничения и критерий проверки результата. Она помогает модели понять приоритеты, а не просто увидеть набор красивых слов.",
      },
      {
        q: "Как правильно писать промпт для нейросети?",
        a: "Начните с формата результата и цели, затем опишите сцену, субъект, стиль, камеру или движение, а в конце добавьте ограничения. Для изображения важны свет, материал и текст; для видео - действие, длительность, камера и звук.",
      },
      {
        q: "Нужно ли писать промпт на английском?",
        a: "Для большинства актуальных моделей английский дает стабильнее результат, особенно в камере, свете и профессиональных терминах. Русский можно использовать для черновика, но финальный промпт для GPT Image 2, Kling 3.0, Veo 3.1 и Midjourney 8.1 лучше держать на английском.",
      },
      {
        q: "Почему промпт с большим количеством деталей работает хуже?",
        a: "Детали вредят, когда они спорят друг с другом или не имеют приоритета. Лучше 5 ясных блоков, чем 40 тегов без иерархии. Если требований много, разделите их на основной промпт и точечные итерации.",
      },
      {
        q: "Чем структура промпта отличается от шаблона промпта?",
        a: "Структура - это логика порядка и приоритетов. Шаблон - конкретная форма записи. Один и тот же порядок можно написать прозой, JSON-подобным блоком или коротким брифом; важнее, чтобы модель видела цель и ограничения.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "prompt-structure",
  title: "Prompt structure: write better AI prompts",
  excerpt:
    "A practical AI prompt structure for images and video: goal, scene, model fit, constraints, first-render diagnosis, and targeted edits without rewriting everything.",
  description:
    "Use this AI prompt structure: 5 prompt blocks, examples for GPT Image 2, Midjourney 8.1, Kling 3.0, and a precise first-render fix for video and images.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Prompt structure is the order of blocks in an AI request: goal, scene, subject, style, camera, constraints, and result checks. If you want to write better AI prompts, start with a clear brief for the model and output format, not with a pile of attractive tags.",
    steps: [
      {
        title: "Start with the job, not pretty words",
        body:
          "The first block answers what the output is for. For GPT Image 2, that might be “article cover, 16:9, no text.” For Midjourney 8.1, “fashion editorial frame for a moodboard.” For Kling 3.0, “5-second clip with one camera move.” When the job comes first, the model chooses the right composition: an ad frame leaves product space, a UI mockup builds a grid, a video prompt holds action over time. Opten helps at this stage because it flags where a prompt still reads like scattered words rather than a usable brief.",
        before:
          "beautiful image, neon, girl, camera, stylish, cinematic",
        after:
          "Job: vertical fashion editorial frame for a moodboard. Subject: model in a lime raincoat under rain. Composition: medium shot, face under 30% of frame. Light: soft neon, wet asphalt, no logos.",
        imageSrc: "/blog/prompt-structure/en/step-1.jpg",
      },
      {
        title: "Build the prompt from five blocks",
        body:
          "The base AI prompt structure has five blocks: `Purpose`, `Scene`, `Subject`, `Style and camera`, `Constraints`. For image models, add material, lighting, and quoted text if text must appear in the image. For video models, add action, secondary motion, and camera. In Veo 3.1 and Kling 3.0, sound is also worth specifying: short dialogue, ambience, SFX, or silence. Otherwise the model often invents an audio layer or turns a calm scene into a dramatic music clip.",
        before:
          "future coffee shop, robot barista, beautiful, 4k, realism",
        after:
          "Purpose: 8-second video concept. Scene: quiet futuristic coffee shop at night. Subject: robot barista pouring espresso. Motion: slow hand movement, steam rising, camera push-in. Constraints: no crowd, no brand logos, no fast cuts.",
        imageSrc: "/blog/prompt-structure/en/step-2.jpg",
      },
      {
        title: "Adapt the structure to the model",
        body:
          "One structure does not mean one identical prompt for every engine. GPT Image 2 likes a natural design brief and exact text in quotes. Nano Banana Pro and Imagen 4 Ultra respond well to material, color, and micro-texture detail. Midjourney 8.1 catches aesthetic codes fast, but needs careful `--no` and `--style` control to avoid over-polish. In video, Runway Gen-4.5 and Luma Ray 3 care more about the action verb and motion physics than a list of objects. Choose the model first, then write the prompt.",
        before:
          "one prompt for GPT Image 2, Midjourney 8.1, Veo 3.1, and Runway Gen-4.5",
        after:
          "For GPT Image 2: detailed design brief. For Midjourney 8.1: aesthetic code plus exact bans. For Kling 3.0: action, camera, duration, motion constraints.",
        imageSrc: "/blog/prompt-structure/en/step-3.jpg",
      },
      {
        title: "Treat the first render as diagnosis",
        body:
          "A practical case: in Kling 3.0, we tested a short clip where “a designer picks up a transparent tablet from a desk and turns to camera.” The first render gave the right hand six fingers and snapped the camera too sharply. The fix was precise: `preserve five fingers on each visible hand, slow handheld push-in, no sudden camera snap`. We did not rewrite the whole scene; we added one hand rule and one camera rule. The action stayed the same, but the artifact disappeared. That is what the first render is for: diagnosis, not a vague like/dislike verdict.",
        before:
          "Designer picks up a transparent tablet and turns to camera, cinematic office, handheld camera.",
        after:
          "Designer picks up a transparent tablet and turns to camera. Preserve five fingers on each visible hand. Slow handheld push-in, no sudden camera snap, no warped tablet edges.",
        imageSrc: "/blog/prompt-structure/en/step-4.jpg",
      },
      {
        title: "Edit one axis per iteration",
        body:
          "The expensive mistake is rewriting the entire prompt after every weak output. If the background works but the face does not, change only the identity block. If the motion is right but the camera is too fast, change only the camera block. If Seedance 2.0 or Runway Gen-4.5 breaks timing, add timestamps or beat order without touching the style. This rhythm saves credits and preserves the successful parts of the generation. It also makes team review cleaner: “fix the light” is easier to act on than “make the whole clip better.”",
        before:
          "Make it better: more realistic, different camera, nicer light, fewer artifacts, fix the face, change the background.",
        after:
          "Iteration 2: preserve scene, pose, and background. Change only the light: soft side source from left, fewer glass highlights, no camera change.",
        imageSrc: "/blog/prompt-structure/en/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "What is prompt structure?",
        a: "Prompt structure is the order of meaning blocks in a request: goal, scene, subject, style, camera, constraints, and result checks. It tells the model what matters first instead of giving it a loose pile of nice words.",
      },
      {
        q: "How do you write better AI prompts?",
        a: "Start with the output format and goal, then describe the scene, subject, style, camera or motion, and constraints. For images, include light, material, and exact text. For video, include action, duration, camera, and sound.",
      },
      {
        q: "Should AI prompts be written in English?",
        a: "For most current image and video models, English is more stable, especially for camera, lighting, and production terms. You can draft in another language, but final prompts for GPT Image 2, Kling 3.0, Veo 3.1, and Midjourney 8.1 usually perform best in English.",
      },
      {
        q: "Why do detailed prompts sometimes perform worse?",
        a: "Details hurt when they conflict or have no priority. Five clear blocks are better than forty tags without hierarchy. If requirements pile up, keep the base prompt clean and move refinements into targeted iterations.",
      },
      {
        q: "Is prompt structure the same as a prompt template?",
        a: "No. Structure is the logic of order and priority. A template is one way to write it down. The same structure can be prose, JSON-like blocks, or a short brief; what matters is that the model sees the goal and constraints.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
