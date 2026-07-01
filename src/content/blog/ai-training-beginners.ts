import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-01";

const COVER_RU = {
  src: "/blog/ai-training-beginners/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка статьи про обучение ИИ и нейросети с нуля через практические задачи",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for a beginner guide to learning AI through practical tasks",
};

const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COURSE_BANNER_LEARNING_RU = {
  src: "/blog/_banners/course-learning-path.jpg",
  width: 1600,
  height: 560,
  alt: "Визуальная схема практического обучения ИИ через проект и промпты",
};
const COURSE_BANNER_LEARNING_EN = {
  src: COURSE_BANNER_LEARNING_RU.src,
  width: COURSE_BANNER_LEARNING_RU.width,
  height: COURSE_BANNER_LEARNING_RU.height,
  alt: "Practical AI learning path visual with project work and prompts",
};
const COURSE_BANNER_PROJECT_RU = {
  src: "/blog/_banners/course-project-sprint.jpg",
  width: 1600,
  height: 560,
  alt: "Визуальная схема проектного спринта от prompt до готового контента",
};
const COURSE_BANNER_PROJECT_EN = {
  src: COURSE_BANNER_PROJECT_RU.src,
  width: COURSE_BANNER_PROJECT_RU.width,
  height: COURSE_BANNER_PROJECT_RU.height,
  alt: "Project sprint visual from prompt to finished AI content",
};

const ru: BlogPostLocale = {
  slug: "ai-training-beginners",
  title: "Обучение ИИ с нуля: 7 дней до практики",
  excerpt:
    "Обучение ИИ и обучение нейросетям работает быстрее, когда новичок берет одну задачу, пишет prompt как brief и улучшает результат по чек-листу.",
  description:
    "Обучение ИИ с нуля: как выбрать первую задачу, составить prompt, пройти 7-дневную практику за неделю и превратить результат в портфолио или рабочий кейс.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "prompt-examples"],
  body: {
    intro:
      "Обучение ИИ для новичка — это не список сервисов, а навык ставить задачи моделям, проверять результат и улучшать prompt. Начинать лучше с одного практического сценария: текст, презентация, визуал или короткое видео. Так нейросети с нуля превращаются в повторяемый рабочий процесс, а не в хаотичное тестирование инструментов.",
    steps: [
      {
        title: "Начните не с инструментов, а с задачи",
        body:
          "Самая частая ошибка в обучении искусственному интеллекту — открыть десять сервисов и пытаться понять все сразу. Новичок устает не потому, что ИИ сложный, а потому что у него нет задачи, по которой можно оценить результат. Выберите один понятный сценарий: написать пост, собрать структуру презентации, сделать карточку товара, подготовить короткий сценарий для видео.\n\nЗадача должна быть достаточно маленькой, чтобы закончить ее за один вечер, но достаточно реальной, чтобы результат можно было показать. Так обучение нейросетям быстро перестает быть просмотром уроков и становится практикой: вы ставите цель, пишете prompt, сравниваете версии и понимаете, что именно модель делает хорошо, а где ей нужен более точный brief.",
        before:
          "Хочу научиться ИИ. Посмотрю курс, список сервисов и все популярные нейросети.",
        after:
          "Задача на сегодня: за 40 минут сделать черновик презентации для клиента. Результат: структура на 8 слайдов, тезисы, визуальный стиль и список мест, где prompt надо уточнить.",
        imageSrc: "/blog/ai-training-beginners/ru/step-1.jpg",
      },
      {
        title: "Выберите одну стартовую траекторию",
        body:
          "Для первых семи дней достаточно трех направлений: текст, презентации, визуал или видео. Текст учит формулировать мысль и ограничения. Презентации учат структуре: цель, аудитория, логика слайдов, доказательства, вывод. Визуал и видео сразу показывают цену плохого prompt: модель дорисовывает лишнее, меняет стиль или делает красивый, но бесполезный результат.\n\nНе пытайтесь за неделю закрыть все курсы по ИИ. Лучше пройти один короткий цикл в выбранной траектории. Например, если вам нужны нейросети для работы, возьмите рабочий документ и улучшите его: письмо, коммерческое предложение, карточку продукта, скрипт для Reels или план выступления. В конце недели у вас должен быть не конспект, а маленький артефакт.",
        before:
          "Сегодня ChatGPT, завтра Midjourney, потом видео, потом таблицы, потом автоматизация.",
        after:
          "Траектория недели: презентации. Каждый день улучшаю один и тот же кейс: brief, структура, слайды, визуальный стиль, финальная проверка.",
        imageSrc: "/blog/ai-training-beginners/ru/step-2.jpg",
        promoBanner: {
          eyebrow: "Практический курс",
          title: "Освойте ИИ через один законченный проект",
          body:
            "Вместо списка сервисов курс ведет через связку: задача, prompt, визуал, видео, сайт и финальная упаковка результата.",
          ctaLabel: "Открыть программу",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_RU,
        },
      },
      {
        title: "Пишите prompt как техническое задание",
        body:
          "Prompt — это не просьба «сделай красиво». Это короткое ТЗ для нейросети: цель, аудитория, формат, исходные данные, ограничения и критерии качества. Если не назвать аудиторию, модель пишет для всех. Если не задать формат, она выбирает средний. Если не перечислить ограничения, она легко придумает факты, лишние блоки или стиль, который не подходит задаче.\n\nБазовая формула простая: роль модели, задача, контекст, аудитория, формат результата, ограничения, критерии проверки. Opten здесь полезен как редактор до генерации: вы даете сырой запрос, а он помогает развернуть его в рабочий prompt и подсветить пропуски. Это особенно важно, когда каждая попытка в видео, визуале или сложной презентации стоит времени и кредитов.",
        before:
          "Сделай мне презентацию про курс по ИИ, чтобы было интересно и современно.",
        after:
          "Role: presentation strategist. Task: create an 8-slide outline for a beginner AI course landing webinar. Audience: solo marketers and small business owners. Format: slide title, key message, proof, visual idea. Constraints: no income promises, no generic AI hype, clear practical examples.",
        imageSrc: "/blog/ai-training-beginners/ru/step-3.jpg",
      },
      {
        title: "Пройдите 7-дневный цикл практики",
        body:
          "Первый день — выбрать задачу и описать исходный результат. Второй — написать prompt как brief. Третий — получить первый output и честно отметить, что не работает. Четвертый — исправить prompt по одной оси: аудитория, формат, стиль или ограничения. Пятый — сделать вторую версию. Шестой — оформить результат так, чтобы его понял другой человек. Седьмой — записать короткий разбор: что было в prompt, где модель ошиблась и как вы это исправили.\n\nТакой цикл лучше бесконечного «обучения ИИ с нуля», потому что он создает опыт. Через неделю вы уже знаете не абстрактную теорию, а конкретное поведение модели: где она угадывает, где проваливает контекст, какие ограничения помогают и какие формулировки дают стабильный результат.",
        before:
          "Смотрю уроки, сохраняю ссылки, жду момента, когда станет понятно, с чего начать.",
        after:
          "7 дней: задача → prompt → первый результат → правка → вторая версия → оформление → короткий разбор кейса.",
        imageSrc: "/blog/ai-training-beginners/ru/step-4.jpg",
      },
      {
        title: "Соберите первый кейс для работы или портфолио",
        body:
          "Переход от учебы к пользе начинается не с обещаний заработка, а с доказательства процесса. Покажите исходную задачу, первый prompt, слабый результат, исправленный prompt и финальную версию. Такой кейс можно приложить к резюме, показать внутри команды или использовать как основу для небольшой услуги: презентация, тексты для лендинга, карточки для маркетплейса, сценарии роликов, быстрый аудит контента.\n\nЕсли вы хотите дальше расти через курсы по ИИ, выбирайте те, где есть не только лекции, но и повторяемый workflow. Хороший курс заставляет собрать проект, проверить prompt, исправить результат и оформить выводы. Без этого обучение остается набором терминов, а не навыком, который помогает в работе.",
        before:
          "Я прошел обучение, но показать пока нечего.",
        after:
          "Кейс: задача клиента, 2 версии prompt, сравнение результатов, финальный материал, выводы и список ограничений, которые улучшили output.",
        promoBanner: {
          eyebrow: "От обучения к кейсу",
          title: "Соберите результат, который можно показать",
          body:
            "Курс помогает пройти полный проектный спринт: от первого prompt до материалов, которые можно положить в портфолио или показать команде.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_RU,
        },
      },
    ],
    faq: [
      {
        q: "С чего начать обучение ИИ с нуля?",
        a: "Начните с одной практической задачи: текст, презентация, визуал или короткое видео. Напишите prompt как brief, получите первый результат, найдите слабое место и исправьте prompt по одной оси. Так вы быстрее поймете поведение модели.",
      },
      {
        q: "Нужны ли курсы по ИИ новичку?",
        a: "Курсы по ИИ полезны, если внутри есть практика, разбор ошибок и готовый проект. Если курс состоит только из обзора сервисов, новичок часто получает список инструментов, но не навык постановки задачи.",
      },
      {
        q: "Можно ли учиться нейросетям бесплатно?",
        a: "Да, базовый старт можно сделать бесплатно: выбрать одну задачу, использовать доступные модели, вести журнал prompt-версий и сравнивать результаты. Платное обучение имеет смысл, когда нужен структурированный маршрут и обратная связь.",
      },
      {
        q: "Что важнее в обучении нейросетям: сервисы или prompt?",
        a: "На старте важнее prompt и критерии проверки. Сервисы меняются, а навык описывать цель, аудиторию, формат и ограничения переносится между текстом, презентациями, визуалом и видео.",
      },
      {
        q: "Когда можно переходить от обучения ИИ к первым задачам?",
        a: "Когда у вас есть хотя бы один законченный кейс: исходная задача, первый результат, исправленный prompt, финальная версия и короткий вывод. Это еще не гарантия работы, но уже понятное доказательство навыка.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-training-beginners",
  title: "Learn AI: a 7-day beginner path to practice",
  excerpt:
    "Learn AI faster with AI training that starts from one practical task: write the prompt as a brief, check outputs, and turn the result into a portfolio case.",
  description:
    "Learn AI with a 7-day beginner path: choose one task, write a prompt brief, compare outputs, improve the prompt, and build a first portfolio case for work.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "To learn AI as a beginner, start with a real task, not a long tool list. AI training becomes useful when you can write a prompt as a brief, compare outputs, fix the prompt, and turn one result into a portfolio piece or workplace shortcut.",
    steps: [
      {
        title: "Start with a job, not a tool stack",
        body:
          "The fastest way to get lost is to open ten AI tools and try to understand them all at once. Beginners don't usually fail because AI is too hard. They fail because there is no task that tells them whether the output is good. Pick one clear job: write a post, draft a presentation, make a product card, or prepare a short video script.\n\nThe job should be small enough to finish in one evening and real enough to show someone else. That shifts AI training from watching lessons into practice: you set a goal, write a prompt, compare versions, and see where the model needs a better brief.",
        before:
          "I want to learn AI. I'll watch a course, collect tools, and try all the popular models.",
        after:
          "Today's task: create a draft client presentation in 40 minutes. Output: 8-slide structure, key points, visual direction, and a list of prompt gaps to fix.",
        imageSrc: "/blog/ai-training-beginners/en/step-1.jpg",
      },
      {
        title: "Choose one beginner track",
        body:
          "For the first week, three tracks are enough: text, presentations, or visual/video work. Text teaches you how to state a thought and set constraints. Presentations teach structure: goal, audience, slide logic, proof, and conclusion. Visual and video work show the cost of a weak prompt quickly, because the model adds extra objects, drifts style, or produces something pretty but unusable.\n\nDon't try to finish every AI course in one week. Run one short cycle inside one track. If you want AI for work, use a real work artifact: an email, proposal, product card, Reel script, landing page section, or talk outline. By the end of the week, you should have a small artifact, not just notes.",
        before:
          "Today ChatGPT, tomorrow image generation, then video, then spreadsheets, then automation.",
        after:
          "Weekly track: presentations. Improve one case every day: brief, structure, slides, visual direction, final review.",
        imageSrc: "/blog/ai-training-beginners/en/step-2.jpg",
        promoBanner: {
          eyebrow: "Practical course",
          title: "Learn AI through one finished project",
          body:
            "Instead of collecting tools, the course walks through task framing, prompts, visuals, video, a website, and final packaging.",
          ctaLabel: "Open curriculum",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_EN,
        },
      },
      {
        title: "Treat the prompt as a brief",
        body:
          "A prompt is not a request to \"make it good.\" It is a compact brief for the model: goal, audience, format, source material, constraints, and quality criteria. If you don't define the audience, the model writes for everyone. If you don't define the format, it chooses an average one. If you don't set constraints, it can invent facts, add useless sections, or pick the wrong tone.\n\nA reliable prompt structure is simple: model role, task, context, audience, output format, constraints, and review criteria. Opten works well before generation here: give it the rough request, then use it to expand the idea into a working prompt and catch missing pieces. That matters most when each attempt costs time or credits, especially with video, visuals, or complex presentations.",
        before:
          "Make me a presentation about an AI course. It should be interesting and modern.",
        after:
          "Role: presentation strategist. Task: create an 8-slide outline for a beginner AI course landing webinar. Audience: solo marketers and small business owners. Format: slide title, key message, proof, visual idea. Constraints: no income promises, no generic AI hype, clear practical examples.",
        imageSrc: "/blog/ai-training-beginners/en/step-3.jpg",
      },
      {
        title: "Run a 7-day practice sprint",
        body:
          "Day one: choose the task and write down what the current result looks like. Day two: write the prompt as a brief. Day three: generate the first output and mark what fails. Day four: fix one axis only: audience, format, style, or constraints. Day five: make a second version. Day six: package the result so another person can understand it. Day seven: write a short case note: what was in the prompt, where the model missed, and how you fixed it.\n\nThis works better than endless beginner AI training because it creates experience. After a week, you know something practical about model behavior: where it guesses, where it loses context, which constraints help, and which phrases produce a more stable result.",
        before:
          "I keep watching tutorials, saving links, and waiting until I know where to start.",
        after:
          "7 days: task -> prompt -> first output -> revision -> second version -> packaging -> short case note.",
        imageSrc: "/blog/ai-training-beginners/en/step-4.jpg",
      },
      {
        title: "Turn practice into a proof of work",
        body:
          "The bridge from learning to useful work is not a promise of income. It is proof of process. Show the original task, first prompt, weak output, revised prompt, and final version. That case can support a resume, help inside your team, or become the basis for a small service: presentation cleanup, landing page copy, marketplace product cards, short video scripts, or a fast content audit.\n\nIf you choose an AI course next, look for one that includes a repeatable workflow, not only lectures. A good course makes you build a project, check the prompt, revise the result, and explain the decisions. Without that, learning stays as a list of terms instead of a skill you can use at work.",
        before:
          "I finished AI training, but I don't have anything concrete to show yet.",
        after:
          "Case: client task, two prompt versions, output comparison, final material, lessons learned, and the constraints that improved the result.",
        promoBanner: {
          eyebrow: "From learning to proof",
          title: "Build something you can actually show",
          body:
            "The course turns beginner practice into a project sprint: prompt, output, revision, and a finished piece for work or portfolio review.",
          ctaLabel: "View course",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_EN,
        },
      },
    ],
    faq: [
      {
        q: "What is the best way to learn AI as a beginner?",
        a: "Start with one practical task and repeat a small loop: write a prompt as a brief, generate the first output, find the weak point, revise one thing, and document what changed. That builds usable judgment faster than tool-hopping.",
      },
      {
        q: "Do I need an AI course to start?",
        a: "You don't need an AI course for the first experiments. A course becomes useful when it gives you structure, feedback, and a finished project. A simple catalog of tools is not enough by itself.",
      },
      {
        q: "Can I learn AI for free?",
        a: "Yes. You can start for free by using available models, keeping a prompt journal, and comparing outputs against one real task. Paid training helps when you need a guided path, examples, and review.",
      },
      {
        q: "What should AI training include?",
        a: "Useful AI training should include task selection, prompt structure, output review, revision, and a final case. The tool names matter less than the repeatable workflow you can carry across models.",
      },
      {
        q: "When can I use AI skills for freelance work?",
        a: "Once you have a finished proof of work: the original task, first result, revised prompt, final version, and a short explanation of the improvement. That does not guarantee clients, but it gives you something concrete to show.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
