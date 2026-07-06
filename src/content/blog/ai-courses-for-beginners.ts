import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-06";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-courses-for-beginners/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про выбор курсов по ИИ и нейросетям без лишних обещаний",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for a guide to choosing AI courses without hype",
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
  slug: "ai-courses-for-beginners",
  title: "Курсы по ИИ для начинающих: как выбрать без хайпа",
  excerpt:
    "Курсы по ИИ и курсы по нейросетям стоит выбирать по практике: заданиям, обратной связи, портфолио-результату и честным ожиданиям перед оплатой.",
  description:
    "Курсы по ИИ для начинающих: как отличить практическую программу от хайпа, проверить задания, обратную связь и портфолио-результат перед оплатой курса.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "neural-networks-from-scratch", "prompt-structure"],
  body: {
    intro:
      "Курсы по ИИ стоит выбирать по практическому результату, а не по обещаниям профессии за неделю. Хорошая программа показывает, как поставить задачу модели, написать prompt, проверить ответ и собрать портфолио-кейс. Если курс по нейросетям не ведет к артефакту, новичок получает конспект вместо навыка.",
    steps: [
      {
        title: "Курсы по ИИ для начинающих: начните с результата",
        body:
          "Перед оплатой курса сформулируйте один результат, который вам нужен через 7-14 дней: презентация, лендинг, карточка товара, видео, серия постов или рабочий prompt workflow. Если программа обещает «все про ИИ», но не показывает, что именно вы сделаете руками, новичку будет трудно понять прогресс.\n\nПрактический кейс: специалист выбирал между большим курсом «профессия AI-эксперт» и короткими уроками Opten. Вместо покупки всего пакета он выбрал один результат: лендинг для тестового продукта. Первый prompt в ChatGPT был слабым: «сделай структуру лендинга для курса». Исправление: добавили аудиторию, продукт, формат блоков, запрет на обещания заработка и критерий качества. Через вечер у него был черновик страницы, а не просто список инструментов.",
        before:
          "Хочу пройти курсы по ИИ. Посоветуй, что выбрать, чтобы быстро разобраться во всем.",
        after:
          "Цель обучения: за неделю собрать один лендинг для тестового продукта. Нужны структура страницы, тексты блоков, визуальный brief и список правок. Критерий: кейс можно показать как черновик портфолио.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-1.jpg",
      },
      {
        title: "Красные флаги курсов по нейросетям",
        body:
          "Сильные курсы по нейросетям не продают гарантию трудоустройства, сертификат вместо навыка или «профессию за неделю». Они честно объясняют, какие задачи вы научитесь делать, где нужна практика и какие ограничения есть у моделей. Красный флаг - программа из длинных обзорных уроков без домашнего задания, ревью и финального проекта.\n\nНе ищите «лучшие курсы по нейросетям» как рейтинг школ без контекста. Для новичка лучший вариант зависит от задачи: работа с текстом, визуал, презентации, видео, маркетплейсы или сайт. Сравнивайте не громкость обещаний, а структуру: сколько практики, как проверяют результат, есть ли повторяемый workflow и можно ли закончить мини-кейс.",
        before:
          "Курс обещает профессию за неделю, сертификат, доступ к закрытым инструментам и быстрый заработок.",
        after:
          "Проверяю программу: какие задачи делаю руками, кто дает обратную связь, какой финальный артефакт получаю и где указаны ограничения.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-2.jpg",
      },
      {
        title: "Что должно быть в курсе по ИИ и нейросетям",
        body:
          "В хорошем курсе по ИИ и нейросетям есть не только список сервисов. Нужны блоки про постановку задачи, контекст, prompt, ограничения, проверку ответа, итерацию и упаковку результата. Модель может быстро дать черновик, но качество появляется там, где ученик умеет объяснить цель, аудиторию, формат и критерий проверки.\n\nМинимальный набор практики: один текстовый кейс, один визуальный brief, одна презентация или лендинг, одно упражнение на исправление слабого prompt и финальная упаковка результата. Opten здесь полезен как preflight: он помогает заметить, что в запросе не хватает роли, формата, ограничений или критерия качества до того, как вы тратите генерации.",
        before:
          "Программа: обзор ChatGPT, обзор генераторов картинок, обзор видео, обзор автоматизаций.",
        after:
          "Программа: задача, prompt, первая ошибка, правка, проверка результата, финальный кейс и короткое описание для портфолио.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-3.jpg",
      },
      {
        title: "Портфолио важнее красивого сертификата",
        body:
          "Сертификат помогает только как подтверждение участия. Для работы, фриланса или внутренней задачи важнее показать артефакт: исходную задачу, prompt, первую ошибку, исправление и финальный результат. Так видно, что вы не просто смотрели уроки, а умеете доводить AI-задачу до результата.\n\nЕсли бюджет ограничен, начните с бесплатных уроков Opten в разделе Learn: выберите один сценарий и соберите мини-кейс. Платные курсы по ИИ для начинающих имеют смысл, когда вы уже понимаете, какой результат хотите повторять и где вам не хватает обратной связи, дисциплины или глубины.",
        before:
          "После курса у меня есть конспект, сертификат и список сервисов, но нет результата, который можно показать.",
        after:
          "После обучения у меня есть кейс: задача, prompt, ошибка, исправление, финальный артефакт и выводы для следующей работы.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите AI-практику вокруг одного проекта",
          body:
            "Курс показывает полный цикл: prompt, изображения, видео, сайт и рекламные материалы для одного проекта, чтобы обучение сразу превращалось в портфолио-кейс.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_RU,
        },
      },
    ],
    faq: [
      {
        q: "Какие курсы по ИИ выбрать новичку?",
        a: "Выбирайте курсы по ИИ для начинающих, где есть практические задания, обратная связь и финальный артефакт: презентация, лендинг, визуал, видео или рабочий prompt workflow. Если программа только перечисляет сервисы, навык закрепляется хуже.",
      },
      {
        q: "Нужен ли сертификат после курса по нейросетям?",
        a: "Сертификат может подтвердить участие, но сам по себе редко показывает навык. Сильнее работает портфолио-кейс: задача, исходный prompt, ошибка, исправление и финальный результат.",
      },
      {
        q: "Можно ли начать бесплатно?",
        a: "Да. Начните с бесплатных уроков, выберите одну маленькую задачу и доведите ее до результата. Платный курс нужен позже, если вам нужна система, обратная связь или глубокая программа.",
      },
      {
        q: "Как понять, что курсы по ИИ и нейросетям практические?",
        a: "Посмотрите, есть ли домашние задания, разбор ошибок, финальный проект и критерии качества. Практический курс заставляет сделать артефакт руками, а не только посмотреть демонстрацию преподавателя.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-courses-for-beginners",
  title: "AI courses for beginners: how to choose without hype",
  excerpt:
    "AI courses work best when they teach one practical workflow: task framing, prompt writing, feedback, portfolio output, and honest expectations.",
  description:
    "Choose an AI course without hype: check practical tasks, prompt workflow, feedback, portfolio output, and whether the program fits your first AI project.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI courses should be judged by practical output, not promises of a new career in a week. A useful program teaches you to frame a task, write a prompt, review the answer, and package a portfolio case. If the course produces only notes, the skill does not stick.",
    steps: [
      {
        title: "Start with the result you want from an AI course",
        body:
          "Before you pay for a course, define one result you want within 7-14 days: a presentation, landing page, product card, video, post series, or prompt workflow. If the program promises «everything about AI» but never says what you'll build with your own hands, progress becomes hard to measure.\n\nPractical case: a specialist was choosing between a large «AI expert career» program and practical Opten lessons. Instead of buying the whole package, he picked one output: a landing page for a test product. The first ChatGPT prompt was weak: «make a landing page structure for a course». The fix added the audience, product, page blocks, a ban on income promises, and a quality bar. One evening later, he had a page draft, not just a tool list.",
        before:
          "I want to take AI courses. Tell me what to choose so I can quickly understand everything.",
        after:
          "Learning goal: build one landing page for a test product in a week. Need page structure, block copy, visual brief, and revision list. Quality bar: the case can be shown as a portfolio draft.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-1.jpg",
      },
      {
        title: "Red flags in AI courses online",
        body:
          "Strong AI courses online don't sell guaranteed employment, a certificate in place of skill, or a new profession in a week. They explain which tasks you'll learn, where practice matters, and what the models still can't do well. A red flag is a long sequence of overview lessons with no homework, review, or final project.\n\nDon't search for the «best AI courses» as if one ranking fits everyone. For a beginner, the right course depends on the task: writing, visuals, presentations, video, marketplace content, or websites. Compare the structure instead of the promise: how much practice, how the output is reviewed, whether the workflow repeats, and whether you'll finish a small case.",
        before:
          "The course promises a new career in a week, a certificate, secret tools, and fast income.",
        after:
          "I check the program: what I build by hand, who reviews it, what final artifact I get, and where the limits are stated.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-2.jpg",
      },
      {
        title: "What a practical AI course should include",
        body:
          "A good AI course is more than a tool list. It should cover task framing, context, prompt writing, constraints, output review, iteration, and packaging the result. A model can produce a draft fast, but quality appears when the learner can explain the goal, audience, format, and quality bar.\n\nThe minimum practice set: one text case, one visual brief, one presentation or landing page, one exercise for fixing a weak prompt, and final result packaging. Opten helps at the preflight stage: it can catch a missing role, format, constraint, or quality bar before you spend generation attempts.",
        before:
          "Program: ChatGPT overview, image generator overview, video overview, automation overview.",
        after:
          "Program: task, prompt, first error, fix, output review, final case, and a short portfolio note.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-3.jpg",
      },
      {
        title: "A portfolio case beats a polished certificate",
        body:
          "A certificate can prove that you attended. For work, freelance, or an internal project, the better proof is an artifact: the original task, prompt, first error, prompt fix, and final output. That shows you can move an AI task from idea to result instead of just watching lessons.\n\nIf budget is tight, start with free Opten lessons in Learn: choose one scenario and build a mini-case. Paid AI courses for beginners make sense once you know which result you want to repeat and where you need feedback, structure, or depth.",
        before:
          "After the course I have notes, a certificate, and a list of tools, but no result I can show.",
        after:
          "After learning I have a case: task, prompt, error, fix, final artifact, and notes for the next project.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build AI practice around one real project",
          body:
            "The course walks through prompts, images, video, a website, and campaign assets for one project, so learning turns into a portfolio case.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_EN,
        },
      },
    ],
    faq: [
      {
        q: "Which AI courses should a beginner choose?",
        a: "Choose AI courses that include practical tasks, feedback, and a final artifact: a presentation, landing page, visual, video, or repeatable prompt workflow. Tool-only courses are harder to turn into skill.",
      },
      {
        q: "Do I need a certificate after an AI course?",
        a: "A certificate can prove attendance, but it rarely proves skill by itself. A portfolio case is stronger: task, original prompt, error, fix, and final result.",
      },
      {
        q: "Can I start with free AI lessons?",
        a: "Yes. Start with free lessons, choose one small task, and finish it. A paid course makes more sense later, when you need structure, feedback, or a deeper program.",
      },
      {
        q: "How do I know that an AI course is practical?",
        a: "Look for homework, error review, a final project, and clear quality criteria. A practical course makes you build an artifact, not just watch an instructor demonstrate tools.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
