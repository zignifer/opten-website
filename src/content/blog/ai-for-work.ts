import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-10";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-for-work/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Нейросети для работы: физическая карта десяти рабочих задач и готовых артефактов",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "AI for work: a physical map of ten work tasks and finished artifacts",
};

const COURSE_BANNER_RU = {
  src: "/blog/_banners/course-workflow.jpg",
  width: 1600,
  height: 560,
  alt: "Курс по AI-контенту: путь от prompt к готовому проекту",
};

const COURSE_BANNER_EN = {
  src: COURSE_BANNER_RU.src,
  width: COURSE_BANNER_RU.width,
  height: COURSE_BANNER_RU.height,
  alt: "AI content course workflow from prompt to a finished project",
};

const ru: BlogPostLocale = {
  slug: "ai-for-work",
  title: "Нейросети для работы: 10 задач на каждый день",
  excerpt:
    "Нейросети для работы ускоряют черновики, презентации, тексты и видео. Работа с нейросетями дает пользу, когда человек проверяет факты, смысл и задачу клиента.",
  description:
    "Нейросети для работы ускоряют презентации, тексты, письма, видео и анализ: 10 рабочих задач, структура prompt и проверка результата человеком перед отправкой.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["free-ai-courses", "prompt-structure", "ai-training-beginners"],
  body: {
    intro:
      "Нейросети для работы помогают быстрее собрать первый черновик, структуру или визуальное направление для конкретной задачи. Уже сегодня можно ускорить презентацию, текст, письмо, видео, исследование или brief. Но ИИ не принимает решение за специалиста: человек проверяет факты, смысл, тон и то, подходит ли результат клиенту или команде.",
    steps: [
      {
        title: "Нейросети для работы: 10 задач, с которых удобно начать",
        body:
          "Не начинайте с вопроса, какая нейросеть лучше всех. Выберите задачу, которая уже лежит в вашей работе. ИИ для работы может помочь с планом презентации, первым текстовым черновиком, письмом клиенту, раскадровкой видео, visual brief, карточкой товара, структурой сайта, исследовательскими вопросами, контент-планом и техническим brief для подрядчика. Во всех десяти случаях модель ускоряет подготовку, а не отменяет профессиональную проверку.\n\nДля первого опыта берите задачу с ясным владельцем и коротким сроком. Например, не «сделать маркетинг», а «подготовить структуру семи слайдов к встрече в четверг». Так проще увидеть, где результат помогает, а где ему не хватает фактов, данных или знания контекста. Нейросети для презентаций, текста и видео дают разный формат черновика, но рабочий принцип один: сначала задача, затем понятный prompt, потом проверка.",
        before: "Помоги с работой, сделай презентацию и текст для клиента.",
        after:
          "Подготовь структуру из 7 слайдов для внутренней презентации нового сервиса. Аудитория: менеджеры без технического бэкграунда. Нужны проблема, решение, один сценарий и следующий шаг. После структуры предложи черновик письма клиенту в спокойном деловом тоне.",
        imageSrc: "/blog/ai-for-work/ru/step-1.jpg",
      },
      {
        title: "Работа с нейросетями начинается со структуры, а не с выбора сервиса",
        body:
          "Полезный AI workflow похож на обычный рабочий процесс: brief, план, черновик, проверка. Сначала вы фиксируете цель и исходные материалы, затем просите модель собрать структуру, после этого уточняете один нужный фрагмент и только в конце отправляете результат на ручную проверку. Если перескочить сразу к «готовому документу», получится гладкий текст без нужных деталей или красивый слайд без рабочего смысла.\n\nКейс Антона: раньше он вручную собирал внутреннюю презентацию почти день. В ChatGPT он сначала запросил каркас слайдов, а для обложки и одного визуального примера использовал GPT Image 2. Первая ошибка была в запросе «Сделай современную презентацию о сервисе»: модель не знала аудиторию и цель встречи. После правки Антон указал семь слайдов, менеджерскую аудиторию, один сценарий использования и запрет на рекламные обещания. Через час у него был черновик для обсуждения, который он дополнил фактами команды, а не финальная презентация без проверки.",
        before: "Сделай современную презентацию о новом сервисе.",
        after:
          "Собери каркас из 7 слайдов для внутренней встречи о новом сервисе. Аудитория: менеджеры без технического бэкграунда. Логика: проблема, решение, один сценарий, ограничения, следующий шаг. Тон: спокойный и деловой. Не добавляй неподтвержденные цифры и обещания.",
        imageSrc: "/blog/ai-for-work/ru/step-2.jpg",
      },
      {
        title: "Как писать prompt под рабочую задачу",
        body:
          "Рабочий prompt обычно выигрывает не длиной, а четырьмя опорами: целью, аудиторией, форматом и критерием качества. Цель объясняет, зачем нужен материал. Аудитория задает уровень деталей и тон. Формат ограничивает ответ: письмо, таблица, сценарий, структура слайдов или visual brief. Критерий помогает понять, что проверить до отправки.\n\nДля текстовой задачи это может быть письмо с двумя вариантами темы. Для видео - раскадровка с длительностью и действием в кадре. Для сайта - список блоков, аудитория и один путь пользователя. Когда prompt еще сырой, Opten помогает заметить недостающий контекст или ограничение до того, как вы потратите время на несколько случайных вариантов. После первого ответа меняйте один слабый слой, а не переписывайте задачу с нуля.",
        before: "Напиши письмо клиенту про обновление.",
        after:
          "Напиши письмо действующему клиенту об обновлении сервиса. Цель: объяснить, что изменилось и какой следующий шаг нужен. Аудитория: занятые менеджеры. Формат: тема письма и текст до 120 слов. Тон: спокойный, без давления. Критерий: читатель понимает пользу и действие после письма.",
        imageSrc: "/blog/ai-for-work/ru/step-3.jpg",
      },
      {
        title: "Проверяйте результат до того, как он станет рабочим документом",
        body:
          "Готовый ответ модели - это материал для проверки, а не автоподпись под документом. Пройдите по четырем точкам: факты, тон, адресат и правки. Факты должны опираться на ваши источники, а не на уверенный стиль текста. Тон должен совпадать с клиентом или внутренней командой. Адресат должен получить нужный уровень деталей. Правки нужны, чтобы убрать случайные допущения, повторы и формулировки, которые нельзя подтвердить.\n\nТакой контроль превращает работу с нейросетями в обучение ИИ на реальных задачах. Сохраняйте хороший prompt, первую версию и одну содержательную правку. Через несколько кейсов у вас будет не коллекция сервисов, а понятный workflow и портфолио решений. Платная программа становится нужна, когда хочется быстрее пройти более сложный проект с обратной связью, а не потому, что бесплатный ответ модели сам по себе недостаточен.",
        before: "Копирую ответ модели в письмо или презентацию, если он звучит уверенно.",
        after:
          "Перед отправкой проверяю факты по источникам, тон под адресата, обязательные детали задачи и одну содержательную правку. Только затем использую результат в рабочем документе.",
        imageSrc: "/blog/ai-for-work/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите AI-workflow вокруг реального проекта",
          body:
            "Курс соединяет prompt, изображения, видео, сайт и рекламные материалы в один проект, чтобы практика давала не набор черновиков, а законченный кейс.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_RU,
        },
      },
    ],
    faq: [
      {
        q: "Какие нейросети подходят для работы?",
        a: "Подходят те модели, которые решают конкретный тип задачи: текст, презентация, visual brief, видео, исследование или структура сайта. Выбирайте не по громкому названию, а по тому, какой черновик вам нужно получить и как вы его будете проверять.",
      },
      {
        q: "Как начать работать с нейросетями?",
        a: "Возьмите одну реальную задачу с коротким сроком, опишите цель, аудиторию, формат и критерий качества. Сохраните первый prompt и сделайте одну правку после результата. Такой цикл быстрее учит, чем просмотр обзоров сервисов.",
      },
      {
        q: "Какие задачи не стоит отдавать ИИ полностью?",
        a: "Не отдавайте полностью решения, где важны точные факты, ответственность перед клиентом, юридические формулировки, персональные данные или стратегический выбор. ИИ может подготовить основу, но смысл, данные и финальную ответственность проверяет человек.",
      },
      {
        q: "Можно ли использовать ИИ для работы без специального обучения?",
        a: "Да, если начать с небольшой задачи и не ожидать готового ответа без проверки. Обучение ИИ становится практичным, когда вы повторяете один workflow: brief, prompt, черновик, проверка и правка.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-for-work",
  title: "AI for work: 10 tasks you can speed up today",
  excerpt:
    "AI for work speeds up drafts, presentations, copy, and video. AI training pays off when a person checks facts, meaning, and the client's actual task.",
  description:
    "AI for work can speed up presentations, copy, emails, video, and research: 10 practical tasks, a clear prompt structure, and a human review before delivery.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["free-ai-courses", "prompt-structure", "ai-training-beginners"],
  body: {
    intro:
      "AI for work can speed up a first draft, structure, or visual direction for a specific task. Today, it can help with a presentation, copy, email, video, research, or a brief. It does not make the professional decision: a person still checks facts, meaning, tone, and whether the result fits the client or the team.",
    steps: [
      {
        title: "AI for work: 10 practical tasks to start with",
        body:
          "Do not begin by asking which model is best at everything. Choose a task that is already on your desk. AI for work can help with a presentation outline, a first copy draft, a client email, a video storyboard, a visual brief, a product card, a website structure, research questions, a content plan, or a technical brief for a contractor. In all ten cases, the model speeds up preparation rather than replacing professional review.\n\nFor a first experiment, pick a task with a clear owner and a short deadline. Instead of \"do the marketing,\" ask for a seven-slide outline for Thursday's meeting. That makes it easier to see where the result helps and where it lacks facts, data, or context. AI for presentations, copy, and video creates different drafts, but the working principle is the same: task first, then a clear prompt, then review.",
        before: "Help with work. Make a presentation and copy for the client.",
        after:
          "Create a seven-slide outline for an internal presentation about a new service. Audience: managers without a technical background. Include the problem, solution, one scenario, and the next step. After the outline, draft a calm business email for the client.",
        imageSrc: "/blog/ai-for-work/en/step-1.jpg",
      },
      {
        title: "Work with AI starts with structure, not tool shopping",
        body:
          "A useful AI workflow resembles an ordinary work process: brief, plan, draft, and review. First, record the goal and source material. Then ask the model for a structure, refine one required part, and only then send the result through a manual check. Jump straight to a finished document and you often get polished copy with missing detail or a beautiful slide without a working point.\n\nAnton used to spend most of a day assembling an internal presentation. He asked ChatGPT for a slide framework and used GPT Image 2 for a cover and one visual example. His first request, \"Make a modern presentation about the service,\" failed because the model had no audience or meeting goal. The revision specified seven slides, a manager audience, one usage scenario, and no promotional promises. An hour later, Anton had a draft for discussion, which he completed with verified team facts, not a final presentation without review.",
        before: "Make a modern presentation about the new service.",
        after:
          "Create a seven-slide framework for an internal meeting about a new service. Audience: managers without a technical background. Flow: problem, solution, one scenario, limitations, next step. Tone: calm and businesslike. Do not add unverified numbers or promises.",
        imageSrc: "/blog/ai-for-work/en/step-2.jpg",
      },
      {
        title: "Write prompts for the work task, not for the tool",
        body:
          "A work prompt rarely wins by being long. It wins by carrying four supports: a goal, audience, format, and quality criterion. The goal explains why the material exists. The audience sets the level of detail and tone. The format constrains the answer to an email, table, video scenario, slide outline, or visual brief. The criterion tells you what to check before sending it.\n\nFor copy, this might be an email with two subject-line options. For video, it could be a storyboard with duration and on-screen action. For a website, it can be a list of sections, audience, and one user path. When a prompt is still vague, Opten can help surface missing context or a missing constraint before you spend time on several random versions. After the first result, revise one weak layer instead of rewriting the task from scratch.",
        before: "Write an email to the client about the update.",
        after:
          "Write an email to an existing client about a service update. Goal: explain what changed and the needed next step. Audience: busy managers. Format: subject line plus a body under 120 words. Tone: calm, no pressure. Success criterion: the reader understands the benefit and the action after the email.",
        imageSrc: "/blog/ai-for-work/en/step-3.jpg",
      },
      {
        title: "Review the result before it becomes a work document",
        body:
          "A finished model response is material to review, not an automatic signature on a document. Check four things: facts, tone, audience, and revisions. Facts need to come from your sources, not a confident writing style. Tone has to fit the client or internal team. The audience needs the right level of detail. Revisions remove unsupported assumptions, repetition, and wording you cannot stand behind.\n\nThat control turns day-to-day use into AI training on real tasks. Save a good prompt, the first version, and one substantial revision. After several cases, you have a clear workflow and a portfolio of decisions instead of a collection of tools. A paid program becomes useful when you want to move through a more demanding project faster with feedback, not because an unreviewed model answer is somehow insufficient on its own.",
        before: "I copy the model answer into an email or presentation if it sounds confident.",
        after:
          "Before sending, I check facts against sources, tone for the audience, mandatory task details, and one substantial revision. Only then do I use the result in a work document.",
        imageSrc: "/blog/ai-for-work/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build an AI workflow around a real project",
          body:
            "The course brings prompt, images, video, a website, and promotional materials into one project, so practice produces a finished case rather than a stack of drafts.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: COURSE_BANNER_EN,
        },
      },
    ],
    faq: [
      {
        q: "Which AI tools are useful for work?",
        a: "Use models that fit a specific task: copy, presentation, visual brief, video, research, or site structure. Choose by the draft you need and how you will review it, not by the loudest product name.",
      },
      {
        q: "How do I start using AI for work?",
        a: "Take one real task with a short deadline, then describe the goal, audience, format, and quality criterion. Save the first prompt and make one revision after the result. That loop teaches faster than watching tool overviews.",
      },
      {
        q: "Which work tasks should not be handed to AI completely?",
        a: "Do not fully delegate decisions that require exact facts, client accountability, legal language, personal data, or strategic judgment. AI can prepare a starting point, but a person verifies the meaning, data, and final responsibility.",
      },
      {
        q: "Can I use AI for work without formal AI training?",
        a: "Yes, if you start with a small task and do not expect a ready-to-send answer without review. AI training becomes practical when you repeat one workflow: brief, prompt, draft, review, and revision.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
