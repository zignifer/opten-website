import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-02";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-training-beginners/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про обучение ИИ через семидневный практический план",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for a beginner AI training guide with a seven-day practice plan",
};

const COURSE_BANNER_WORKFLOW_RU = {
  src: "/blog/_banners/course-workflow.jpg",
  width: 1600,
  height: 560,
  alt: "Схема курса по созданию контента, видео и сайта через нейросети",
};
const COURSE_BANNER_WORKFLOW_EN = {
  src: COURSE_BANNER_WORKFLOW_RU.src,
  width: COURSE_BANNER_WORKFLOW_RU.width,
  height: COURSE_BANNER_WORKFLOW_RU.height,
  alt: "Course workflow visual for creating content, video, and a website with AI",
};

const ru: BlogPostLocale = {
  slug: "ai-training-beginners",
  title: "Обучение ИИ с нуля: 7 дней до первой практики",
  excerpt:
    "Обучение ИИ и обучение нейросетям быстрее дают результат, когда новичок выбирает одну задачу, пишет prompt, сравнивает ответ и улучшает его.",
  description:
    "Обучение ИИ с нуля: как выбрать первую задачу, построить семидневную практику, писать prompt, перейти от курсов по ИИ к портфолио и обучению нейросетям.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "prompt-examples", "ai-headshot-generator"],
  body: {
    intro:
      "Обучение ИИ с нуля стоит начинать не со списка сервисов, а с одной практической задачи. Новичку нужно выбрать формат результата, написать prompt как короткое ТЗ, сравнить ответы модели и улучшить запрос. Так обучение нейросетям быстрее превращается в навык, а не в бесконечный обзор инструментов.",
    steps: [
      {
        title: "С чего начать обучение ИИ: выберите одну задачу",
        body:
          "Самая частая ошибка новичка: открыть десять нейросетей, посмотреть пять уроков и не закончить ни одного результата. Для первого шага выберите одну рабочую задачу: краткий текст, слайд, карточку товара, обложку, сценарий короткого видео или структуру письма. Задача должна быть достаточно маленькой, чтобы ее можно было закончить за вечер.\n\nЗапишите цель, аудиторию, формат, ограничения и критерий качества. Не «хочу научиться нейросетям», а «за 60 минут собрать одну карточку товара для маркетплейса: фото, заголовок, описание и три варианта промо-текста». Такое обучение искусственному интеллекту сразу показывает, где модель помогает, а где нужен контроль человека.",
        before:
          "Хочу разобраться в ИИ. Посоветуй инструменты и расскажи, что попробовать.",
        after:
          "Задача: за один вечер собрать карточку товара для маркетплейса. Аудитория: покупатель, который выбирает подарок. Формат: фото-идея, заголовок до 60 символов, описание 500 знаков, 3 промо-текста. Критерий качества: понятно, чем товар отличается от аналогов.",
        imageSrc: "/blog/ai-training-beginners/ru/step-1.jpg",
      },
      {
        title: "Три стартовые траектории: текст, презентации, визуал",
        body:
          "Нейросети с нуля проще осваивать через одну из трех траекторий. Первая - текст: письма, посты, описания товаров, резюме встреч. Вторая - презентации: структура, тезисы, слайды, сценарий выступления. Третья - визуал и видео: референсы, обложки, рекламные кадры, короткие ролики. Не смешивайте их в первую неделю.\n\nЕсли вам нужны курсы по ИИ, выбирайте те, где есть повторяемый workflow, а не только обзор сервисов. Хороший учебный модуль заставляет сделать артефакт: слайд, лендинг, карточку, видео, мини-проект. Без артефакта обучение остается просмотром чужого экрана.",
        before:
          "Пойду изучать ChatGPT, Midjourney, Veo, Figma AI, автоматизации и еще пару сервисов.",
        after:
          "Траектория на неделю: только презентации. День 1 - задача и аудитория. День 2 - структура. День 3 - prompt для слайдов. День 4 - визуальный стиль. День 5 - правки. День 6 - сборка. День 7 - один готовый кейс.",
        imageSrc: "/blog/ai-training-beginners/ru/step-2.jpg",
      },
      {
        title: "Prompt - это ТЗ для нейросети",
        body:
          "Prompt работает как техническое задание: он должен объяснить цель, контекст, входные данные, формат ответа и запреты. Если написать «сделай красиво», модель угадает стиль сама. Если указать аудиторию, роль, тон, формат и ограничения, результат становится проверяемым.\n\nПрактический кейс: новичок делал карточку товара в GPT Image 2 и получил красивую, но бесполезную картинку. Ошибка была в prompt: он просил «рекламное фото товара», но не фиксировал аудиторию, ракурс, фон и место под текст. Исправление: добавили `hero product card for handmade ceramic mug`, `target audience: gift buyers`, `dark neutral background`, `top-left empty space for headline`, `no fake logo, no unreadable text`. Следующий рендер стал пригоден для портфолио: понятный товар, чистый фон и место под заголовок.",
        before:
          "Сделай рекламную карточку товара, красиво, современно, для маркетплейса.",
        after:
          "Hero product card for a handmade ceramic mug. Target audience: gift buyers. Dark neutral background, soft studio light, mug centered, top-left empty space for headline, realistic texture. Constraints: no fake logo, no unreadable text, no extra products.",
        imageSrc: "/blog/ai-training-beginners/ru/step-3.jpg",
      },
      {
        title: "Мини-план на 7 дней: от запроса до портфолио",
        body:
          "День 1: выберите одну задачу и запишите критерий качества. День 2: соберите 3 референса. День 3: напишите первый prompt. День 4: сравните 2-3 результата и найдите одну главную ошибку. День 5: перепишите prompt, не меняя всю задачу. День 6: доведите результат до публикабельного вида. День 7: сохраните кейс с исходным prompt, исправлением и финалом.\n\nOpten полезен на этапе preflight: он помогает превратить русскую идею в production prompt, подсветить пропущенные ограничения и улучшить запрос до генерации. Сначала учитесь ставить задачу модели, потом уже расширяйте набор инструментов.",
        before:
          "Каждый день смотреть новый урок и пробовать новый сервис.",
        after:
          "Каждый день двигать один кейс: задача, референсы, prompt, первая ошибка, исправление, финальный результат, короткое описание для портфолио.",
        imageSrc: "/blog/ai-training-beginners/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите практику на нейросетях в один workflow",
          body:
            "В курсе показываю полный цикл: промпты, изображения, видео, сайт и рекламные материалы для одного проекта, чтобы обучение сразу превращалось в кейсы.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_RU,
        },
      },
    ],
    faq: [
      {
        q: "С чего начать обучение ИИ с нуля?",
        a: "Начните с одной маленькой задачи, которую можно закончить за вечер: текст, слайд, карточка товара, обложка или короткий сценарий. Затем напишите prompt, получите результат, найдите главную ошибку и улучшите запрос.",
      },
      {
        q: "Нужны ли курсы по ИИ новичку?",
        a: "Курсы по ИИ полезны, если в них есть практика и готовый результат, а не только обзор сервисов. Хороший курс ведет к артефакту: презентации, визуалу, видео, сайту или портфолио-кейсу.",
      },
      {
        q: "Можно ли изучать нейросети бесплатно?",
        a: "Да, первые шаги можно делать бесплатно: выбрать задачу, писать prompts, сравнивать ответы и фиксировать ошибки. Платные инструменты нужны позже, когда вы понимаете, какой результат хотите получить и зачем.",
      },
      {
        q: "Чем обучение ИИ отличается от списка инструментов?",
        a: "Список инструментов отвечает на вопрос «где нажать». Обучение ИИ отвечает на вопрос «как поставить задачу модели, проверить результат и улучшить prompt». Второй навык переносится между сервисами.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-training-beginners",
  title: "Learn AI from scratch: a 7-day beginner path",
  excerpt:
    "Learn AI faster by picking one task, writing a prompt, comparing model outputs, and improving the request instead of collecting endless tool lists.",
  description:
    "Learn AI from scratch with a 7-day AI training path: choose one task, write better prompts, compare outputs, and turn practice into a portfolio case.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Learn AI from scratch by starting with one practical task, not a long tool list. A beginner should choose the output format, write a prompt as a short brief, compare the model's answers, and improve the request. That turns AI training into a skill instead of passive tool watching.",
    steps: [
      {
        title: "Start AI training with one small task",
        body:
          "The common beginner mistake is opening ten AI tools, watching five lessons, and finishing nothing. For the first step, choose one work-shaped task: a short text, a slide, a product card, a cover image, a short video script, or an email outline. The task should be small enough to finish in one evening.\n\nWrite down the goal, audience, format, constraints, and quality bar. Not «I want to learn AI», but «in 60 minutes, build one marketplace product card: image idea, title, description, and three promo lines». This kind of AI training shows where the model helps and where human judgment still matters.",
        before:
          "I want to understand AI. Recommend tools and tell me what to try.",
        after:
          "Task: build one marketplace product card in one evening. Audience: gift buyers. Format: image idea, title under 60 characters, 500-character description, 3 promo lines. Quality bar: the difference from similar products is clear.",
        imageSrc: "/blog/ai-training-beginners/en/step-1.jpg",
      },
      {
        title: "Pick a track: text, slides, or visual work",
        body:
          "It's easier to learn AI when you stay on one track. Track one is text: emails, posts, product descriptions, meeting summaries. Track two is presentations: structure, talking points, slides, and speaking notes. Track three is visual and video work: references, covers, ad frames, and short clips. Don't mix them in week one.\n\nIf you choose an AI course, pick one that teaches a repeatable workflow, not just a tour of apps. A useful module forces you to make an artifact: a slide, landing page, product card, video, or mini-project. Without an artifact, learning becomes watching someone else's screen.",
        before:
          "I'll study ChatGPT, Midjourney, Veo, Figma AI, automations, and a few more tools.",
        after:
          "One-week track: presentations only. Day 1 - task and audience. Day 2 - structure. Day 3 - slide prompt. Day 4 - visual style. Day 5 - revisions. Day 6 - assembly. Day 7 - one finished case.",
        imageSrc: "/blog/ai-training-beginners/en/step-2.jpg",
      },
      {
        title: "Treat the prompt as a brief",
        body:
          "A prompt is a working brief: it should define the goal, context, input material, output format, and constraints. If you write «make it nice», the model guesses the style. If you state the audience, role, tone, format, and limits, the result becomes easier to judge.\n\nPractical case: a beginner made a product card in GPT Image 2 and got a pretty but useless image. The mistake was the prompt. It asked for an «advertising product photo» but did not lock the audience, angle, background, or space for text. The fix added `hero product card for handmade ceramic mug`, `target audience: gift buyers`, `dark neutral background`, `top-left empty space for headline`, `no fake logo, no unreadable text`. The next render was portfolio-ready: clear product, clean background, and space for a headline.",
        before:
          "Make a product ad card, beautiful, modern, for a marketplace.",
        after:
          "Hero product card for a handmade ceramic mug. Target audience: gift buyers. Dark neutral background, soft studio light, mug centered, top-left empty space for headline, realistic texture. Constraints: no fake logo, no unreadable text, no extra products.",
        imageSrc: "/blog/ai-training-beginners/en/step-3.jpg",
      },
      {
        title: "Use a 7-day plan, then save the case",
        body:
          "Day 1: choose one task and define the quality bar. Day 2: collect three references. Day 3: write the first prompt. Day 4: compare two or three outputs and find the main error. Day 5: rewrite the prompt without changing the whole task. Day 6: polish the result. Day 7: save the case with the original prompt, the fix, and the final output.\n\nOpten is useful at the preflight stage. It helps turn a rough idea into a production prompt, catch missing constraints, and improve the request before you spend generation attempts. Learn the workflow first, then add more tools.",
        before:
          "Watch a new lesson every day and try a new tool every day.",
        after:
          "Move one case forward every day: task, references, prompt, first error, fix, final result, short portfolio note.",
        imageSrc: "/blog/ai-training-beginners/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Turn AI practice into one repeatable workflow",
          body:
            "The course walks through prompts, images, video, a website, and campaign assets for one project, so learning turns into concrete cases.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_EN,
        },
      },
    ],
    faq: [
      {
        q: "Where should I start if I want to learn AI from scratch?",
        a: "Start with one small task you can finish in an evening: a text, slide, product card, cover image, or short script. Write the prompt, get an output, find the main error, and improve the request.",
      },
      {
        q: "Is an AI course necessary for beginners?",
        a: "An AI course helps if it includes practice and a finished result, not just a tool overview. Look for a course that produces an artifact: a presentation, visual, video, website, or portfolio case.",
      },
      {
        q: "Can I learn AI for free?",
        a: "Yes. The first steps can be free: choose a task, write prompts, compare answers, and record what failed. Paid tools matter later, when you know what output you need and why.",
      },
      {
        q: "What is the difference between AI training and a tool list?",
        a: "A tool list tells you where to click. AI training teaches you how to brief the model, check the output, and improve the prompt. That skill carries across tools.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
