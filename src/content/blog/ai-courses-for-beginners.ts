import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-01";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-courses-for-beginners/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка статьи про курсы по ИИ и курсы по нейросетям для начинающих",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for a guide to choosing an AI course for beginners",
};

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
  slug: "ai-courses-for-beginners",
  title: "Курсы по ИИ для начинающих: как выбрать без обещаний",
  excerpt:
    "Курсы по ИИ и курсы по нейросетям стоит выбирать по практике: задачи, prompt workflow, обратная связь, проекты и честные ожидания без обещаний.",
  description:
    "Курсы по ИИ для начинающих: как выбрать обучение по нейросетям, проверить программу, избежать пустых обещаний и собрать портфолио-проект для работы.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "neural-networks-from-scratch"],
  body: {
    intro:
      "Курсы по ИИ для начинающих стоит выбирать не по громкому обещанию профессии, а по тому, какой практический результат вы соберете. Хорошее обучение по нейросетям дает задачи, prompt workflow, проверку output, обратную связь и портфолио-кейс. Без этого курс превращается в обзор сервисов.",
    steps: [
      {
        title: "Сначала проверьте результат курса",
        body:
          "Не начинайте с вопроса «какой курс самый лучший». Сначала спросите, что вы сможете показать после обучения. Если результат описан как «понимание ИИ» или «сертификат», этого мало. Практический курс должен вести к артефакту: презентации, лендингу, видео, карточке товара, контент-системе или другому материалу, который можно оценить.\n\nСравнивать курсы по ИИ проще через финальный проект. Хорошая программа показывает путь от задачи до результата: brief, prompt, первая версия, правки, финальная упаковка. Если этого нет, вы покупаете не навык, а доступ к лекциям.",
        before:
          "Выбираю курс, где больше модулей, длиннее программа и красивее сертификат.",
        after:
          "Выбираю курс, где понятен финальный проект: что будет создано, как проверяется prompt и какую работу можно показать после обучения.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-1.jpg",
      },
      {
        title: "Отсеките красные флаги",
        body:
          "Курсы ИИ для начинающих не должны обещать трудоустройство, быстрый доход или новую профессию за неделю. Это не честная рамка. Нейросети могут ускорить работу, помочь собрать материалы и открыть новые услуги, но результат зависит от вашей задачи, рынка, портфолио и умения проверять output.\n\nЕще один красный флаг — программа только про инструменты. Если курс перечисляет десятки сервисов, но не учит ставить задачу, писать prompt как ТЗ и разбирать ошибки, после него легко остаться с длинным списком ссылок. В хорошем обучении меньше магии и больше повторяемого процесса.",
        before:
          "Курс обещает быстрый доход, профессию без опыта и секретный список нейросетей.",
        after:
          "В программе есть практические задачи, ограничения, проверка результатов, разбор ошибок и честное описание того, что курс не гарантирует.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-2.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Практика вместо обещаний",
          body:
            "Курс строится вокруг проекта: вы ставите задачу, улучшаете prompt, собираете визуал, видео, сайт и финальную упаковку результата.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_RU,
        },
      },
      {
        title: "Проверьте prompt workflow в программе",
        body:
          "Курсы по ИИ и нейросетям должны учить не только нажимать кнопку генерации. В программе должен быть prompt workflow: как описать цель, аудиторию, формат, контекст, ограничения и критерии качества. Без этого новичок зависит от случайного первого результата и не понимает, почему одна генерация работает, а другая нет.\n\nOpten полезен именно в этом месте. Он помогает проверить черновик prompt до запуска, найти пропуски и развернуть идею под конкретную модель. Если в курсе нет этапа проверки prompt, вы тратите попытки на угадывание, а не на обучение.",
        before:
          "Введите запрос в нейросеть и выберите лучший ответ.",
        after:
          "Сначала brief: цель, аудитория, формат, ограничения. Потом preflight prompt, первый output, разбор ошибки и точечная правка.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-3.jpg",
      },
      {
        title: "Смотрите на проекты для портфолио",
        body:
          "Лучшие курсы по нейросетям для новичка — не те, где больше громких названий, а те, где вы собираете несколько понятных работ. Минимальный набор: текст или лендинг, презентация, визуал, короткое видео или контент-пакет. Эти проекты показывают, что вы умеете пройти цикл от задачи до результата.\n\nПортфолио не обязано обещать клиентам чудо. Достаточно показать процесс: исходная задача, первый prompt, слабый output, исправление, финальная версия и вывод. Такой формат честнее, чем сертификат без примеров.",
        before:
          "После курса у меня есть конспект и сертификат, но нет работы, которую можно показать.",
        after:
          "После курса у меня есть 3 кейса: лендинг, презентация и видео-сценарий с prompt-версией и разбором правок.",
        imageSrc: "/blog/ai-courses-for-beginners/ru/step-4.jpg",
      },
      {
        title: "Когда начать бесплатно, а когда идти в курс",
        body:
          "Бесплатные уроки хороши, если вы еще не понимаете, какие задачи хотите решать. Возьмите один открытый материал, сделайте маленький проект и посмотрите, где застряли. Если проблема в дисциплине, обратной связи, структуре или проектной сборке, тогда платный курс может сэкономить время.\n\nНе покупайте «все про ИИ» из страха отстать. Начните с одного результата: презентация, лендинг, видео или карточка товара. Потом выбирайте обучение, которое усиливает именно этот workflow, а не просто добавляет еще десять сервисов в список.",
        before:
          "Куплю большой курс сразу, чтобы закрыть весь ИИ и ничего не упустить.",
        after:
          "Сначала пробный проект. Потом курс, если нужна структура: prompt workflow, практика, обратная связь и упаковка результата.",
        promoBanner: {
          eyebrow: "Старт через проект",
          title: "Пройдите путь от prompt до готовой системы контента",
          body:
            "Если нужен не каталог сервисов, а последовательный проект, курс Opten показывает полный цикл на практических материалах.",
          ctaLabel: "Открыть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_RU,
        },
      },
    ],
    faq: [
      {
        q: "Какие курсы по ИИ выбрать новичку?",
        a: "Выбирайте курс, где есть практические задачи, prompt workflow, проверка output, обратная связь и финальный проект. Избегайте программ, которые обещают доход или профессию без понятного портфолио.",
      },
      {
        q: "Чем курсы по ИИ отличаются от курсов по нейросетям?",
        a: "В бытовом поиске эти фразы часто означают одно и то же: обучение работе с AI-инструментами. Важно смотреть не на название, а на программу: задачи, модели, промпты, проверку и проекты.",
      },
      {
        q: "Нужен ли сертификат после курса по ИИ?",
        a: "Сертификат может быть приятным бонусом, но для практики важнее кейсы. Покажите исходную задачу, prompt, правки и финальный результат — это говорит о навыке больше, чем документ без примеров.",
      },
      {
        q: "Можно ли начать с бесплатных курсов по ИИ?",
        a: "Да. Бесплатный старт подходит, чтобы понять базовые сценарии и выбрать направление. Если вы хотите системно собрать проект и получить обратную связь, тогда имеет смысл смотреть платный курс.",
      },
      {
        q: "Как понять, что курс по нейросетям практический?",
        a: "В нем есть реальные задачи, требования к результату, разбор ошибок, prompt workflow и портфолио-проект. Если программа состоит только из лекций и обзора сервисов, практики может не хватить.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-courses-for-beginners",
  title: "AI courses for beginners: how to choose without hype",
  excerpt:
    "AI courses and online AI training are worth choosing by practice: tasks, prompt workflow, feedback, portfolio projects, and honest expectations.",
  description:
    "AI courses for beginners: how to choose practical online AI training, check the curriculum, avoid empty promises, and build portfolio projects safely.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI courses for beginners should be judged by the practical result, not by promises of a fast new career. A useful AI course gives you tasks, prompt workflow, output review, feedback, and a portfolio case. Without that, the course becomes a tour of tools.",
    steps: [
      {
        title: "Check the course outcome first",
        body:
          "Don't start with \"what is the best AI course.\" Start with what you will be able to show after it. If the outcome is only \"understanding AI\" or a certificate, that is not enough. A practical course should lead to an artifact: presentation, landing page, video, product card, content system, or another piece someone can review.\n\nAI courses online are easier to compare through the final project. A strong curriculum shows the path from task to result: brief, prompt, first version, revisions, and final packaging. Without that, you are buying access to lectures, not a usable skill.",
        before:
          "I choose the course with more modules, a longer curriculum, and a nicer certificate.",
        after:
          "I choose the course where the final project is clear: what gets built, how the prompt is reviewed, and what work I can show afterward.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-1.jpg",
      },
      {
        title: "Filter out red flags",
        body:
          "AI courses for beginners should not promise a job, fast income, or a new profession in a week. That is not an honest frame. AI can speed up work, help create assets, and support new services, but outcomes depend on your task, market, portfolio, and ability to review outputs.\n\nAnother red flag is a curriculum that is only about tools. If a course lists dozens of apps but does not teach task framing, prompts as briefs, and error review, you can leave with a long link list and no workflow. Good training has less magic and more repeatable process.",
        before:
          "The course promises fast income, a profession with no experience, and a secret list of AI tools.",
        after:
          "The program has practical tasks, constraints, output review, error analysis, and honest limits on what the course does not guarantee.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-2.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Practice instead of promises",
          body:
            "The course is built around a project: frame the task, improve the prompt, create visuals, video, website, and final packaging.",
          ctaLabel: "View curriculum",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_EN,
        },
      },
      {
        title: "Look for prompt workflow",
        body:
          "An AI course should teach more than pressing generate. The curriculum needs a prompt workflow: how to define the goal, audience, format, context, constraints, and quality criteria. Without that, a beginner depends on the first random output and does not know why one generation works while another fails.\n\nOpten helps in exactly this stage. You can check a rough prompt before generation, find gaps, and expand the idea for a specific model. If a course has no prompt review step, you spend attempts on guessing instead of learning.",
        before:
          "Enter a request into an AI tool and choose the best answer.",
        after:
          "First brief: goal, audience, format, constraints. Then prompt preflight, first output, error review, and a focused revision.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-3.jpg",
      },
      {
        title: "Check the portfolio projects",
        body:
          "The best AI courses for beginners are not the ones with the loudest model names. They are the ones where you build a few clear pieces of work. A minimal set could include copy or a landing page, a presentation, a visual, a short video script, or a content pack. These projects show that you can move from task to result.\n\nA portfolio does not need to promise miracles. It should show process: original task, first prompt, weak output, revision, final version, and lesson learned. That is more honest than a certificate with no examples.",
        before:
          "After the course I have notes and a certificate, but no work I can show.",
        after:
          "After the course I have 3 cases: landing page, presentation, and video script with prompt versions and revision notes.",
        imageSrc: "/blog/ai-courses-for-beginners/en/step-4.jpg",
      },
      {
        title: "Know when free lessons are enough",
        body:
          "Free lessons are useful if you still don't know what you want to do with AI. Take one open lesson, make a small project, and see where you get stuck. If the problem is discipline, feedback, structure, or project assembly, a paid course can save time.\n\nDon't buy \"everything about AI\" because you are afraid of falling behind. Start with one result: presentation, landing page, video, or product card. Then choose training that strengthens that workflow instead of adding ten more tools to your list.",
        before:
          "I'll buy a huge AI course now so I don't miss anything.",
        after:
          "First a trial project. Then a course if I need structure: prompt workflow, practice, feedback, and final packaging.",
        promoBanner: {
          eyebrow: "Start with a project",
          title: "Go from prompt to a finished content system",
          body:
            "If you need a practical path instead of a tool catalog, the Opten course shows the full cycle on real project materials.",
          ctaLabel: "Open the course",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_EN,
        },
      },
    ],
    faq: [
      {
        q: "What AI course should a beginner choose?",
        a: "Choose a course with practical tasks, prompt workflow, output review, feedback, and a final project. Avoid programs that promise income or a new career without clear portfolio work.",
      },
      {
        q: "Are AI courses online enough to start?",
        a: "They can be enough if they include practice and a finished project. A video-only course may help with orientation, but it will not build skill unless you apply the workflow.",
      },
      {
        q: "Do I need a certificate from an AI course?",
        a: "A certificate can be a bonus, but cases matter more. Show the original task, prompt, revisions, and final result. That proves more than a document without examples.",
      },
      {
        q: "Can I start with free AI courses?",
        a: "Yes. Free lessons are a good first step. Use them to choose a direction and make one small project. If you need structure and review, move to a paid course later.",
      },
      {
        q: "How do I know an AI course is practical?",
        a: "It includes real tasks, output criteria, error review, prompt workflow, and a portfolio project. If the curriculum is only lectures and tool demos, practice may be too thin.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
