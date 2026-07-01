import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-01";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/neural-networks-from-scratch/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про обучение нейросетям и нейросети с нуля для работы",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for an AI for beginners guide focused on practical work skills",
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
  slug: "neural-networks-from-scratch",
  title: "Обучение нейросетям с нуля: 5 навыков для работы",
  excerpt:
    "Обучение нейросетям и курсы по нейросетям работают лучше, когда новичок учит постановку задачи, prompt, проверку и упаковку результата в кейс.",
  description:
    "Обучение нейросетям с нуля: какие навыки учить первыми, как писать prompt как ТЗ, проверять результат и собрать первый рабочий кейс для работы с ИИ.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "prompt-structure"],
  body: {
    intro:
      "Обучение нейросетям с нуля не начинается с математики или архитектуры моделей. Для работы важнее пять прикладных навыков: выбрать задачу, описать контекст, написать prompt как ТЗ, проверить результат и собрать небольшой кейс. Так новичок быстрее понимает ИИ через практику, а не через термины.",
    steps: [
      {
        title: "Не начинайте с ML-теории",
        body:
          "Фраза «нейросети с нуля» часто звучит так, будто сначала нужно разобраться в слоях, весах и датасетах. Для прикладной работы это не первый шаг. Если вы хотите применять ИИ в маркетинге, дизайне, контенте или операционных задачах, начинать нужно с результата: какой документ, слайд, изображение, сценарий или анализ вам нужен.\n\nТеория полезна позже, когда вы уже видите ограничения моделей. На старте важнее научиться отличать хороший ответ от слабого. Модель может писать уверенно, но не учитывать аудиторию, придумывать факты или делать красивую структуру без пользы. Этот навык проверки быстрее всего появляется на реальной задаче.",
        before:
          "Сначала выучу устройство нейросетей, потом выберу сервис и когда-нибудь попробую применить ИИ.",
        after:
          "Сначала беру рабочую задачу: улучшить коммерческое письмо. Потом проверяю, что модель поняла аудиторию, формат, тон и ограничения.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-1.jpg",
      },
      {
        title: "Навык 1: формулировать задачу",
        body:
          "Любое обучение нейросетям ломается, если задача звучит как «сделай нормально». Нейросеть не знает, кто читатель, какой формат нужен и что считается успехом. Хорошая постановка задачи отвечает на четыре вопроса: для кого результат, где он будет использоваться, какой формат нужен и как понять, что версия готова.\n\nНапример, «напиши текст для лендинга» почти всегда даст общий ответ. Лучше: «собери первый экран лендинга для курса по ИИ для владельцев малого бизнеса; нужен заголовок, подзаголовок, 3 выгоды и CTA без обещаний заработка». С такой задачей модель уже работает как помощник, а не как генератор случайных абзацев.",
        before:
          "Напиши текст для лендинга про нейросети.",
        after:
          "Задача: первый экран лендинга для курса по нейросетям для начинающих. Аудитория: предприниматели без AI-опыта. Формат: H1, подзаголовок, 3 выгоды, CTA. Ограничения: без гарантий дохода и без сложных терминов.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-2.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Учитесь нейросетям через задачи, а не через список сервисов",
          body:
            "В курсе вы проходите практический маршрут: задача, prompt, визуал, видео, сайт и финальная упаковка результата.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_RU,
        },
      },
      {
        title: "Навык 2: писать prompt как ТЗ",
        body:
          "Prompt должен быть похож на короткое техническое задание. В нем есть роль модели, контекст, аудитория, формат ответа, ограничения и критерии проверки. Если эти блоки пропущены, модель достраивает их сама. Обычно она выбирает самый безопасный средний вариант, и результат выглядит гладко, но не решает вашу задачу.\n\nOpten можно использовать как preflight перед генерацией: дать черновик запроса и проверить, хватает ли в нем роли, контекста, формата и запретов. Это особенно полезно, когда вы учитесь на дорогих попытках: видео, визуал, презентация или сайт требуют точности до запуска, а не после десятого рендера.",
        before:
          "Сделай пост про преимущества курса.",
        after:
          "Role: content strategist. Task: draft a LinkedIn post about a beginner AI course. Audience: solo marketers. Format: hook, 3 practical points, soft CTA. Constraints: no income guarantees, no hype, include one concrete workflow example.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-3.jpg",
      },
      {
        title: "Навык 3: проверять результат",
        body:
          "Проверка важнее скорости. Когда модель выдала ответ, не спрашивайте только «нравится или нет». Проверьте факты, соответствие аудитории, формат, ограничения и практическую пользу. Если это текст, ищите общие фразы и недоказанные обещания. Если это презентация, смотрите, есть ли логика слайдов. Если это визуал, проверяйте стиль, лишние детали и читаемость.\n\nИсправлять лучше одну ось за раз. Сначала аудитория, потом формат, потом тон, потом ограничения. Так вы видите, какая правка реально улучшила результат. Это и есть прикладное обучение нейросетям: не нажимать кнопку заново, а понимать, почему output стал лучше.",
        before:
          "Ответ вроде нормальный, но какой-то общий. Попробую попросить «лучше и подробнее».",
        after:
          "Проверка: аудитория не названа, формат размыт, есть обещание результата, примера нет. Правка: уточнить аудиторию и убрать обещание дохода.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-4.jpg",
      },
      {
        title: "Навык 4: собирать маленькие кейсы",
        body:
          "Кейсы нужны не только фрилансеру. Они помогают понять собственный прогресс. Сохраните исходную задачу, первый prompt, слабый результат, исправленный prompt и финальную версию. Через несколько таких циклов вы увидите свои повторяющиеся ошибки: забыли аудиторию, не задали формат, не указали ограничения, не проверили факты.\n\nЕсли выбираете курсы по нейросетям для начинающих, смотрите, есть ли в программе проектный результат. Бесплатные курсы по нейросетям подойдут для первого знакомства, но дальше нужен цикл с практикой и обратной связью. Хорошее обучение заканчивается не сертификатом в вакууме, а понятным кейсом.",
        before:
          "Я попробовал нейросеть, но не понимаю, чему научился.",
        after:
          "Кейс: исходная задача, prompt v1, слабый output, prompt v2, финальный текст и вывод, какая правка улучшила результат.",
        promoBanner: {
          eyebrow: "Практика вместо теории",
          title: "Соберите свой первый AI-кейс в проектном формате",
          body:
            "Курс помогает пройти весь цикл: поставить задачу, улучшить prompt, получить материалы и оформить результат так, чтобы его можно было показать.",
          ctaLabel: "Перейти в курс",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_RU,
        },
      },
    ],
    faq: [
      {
        q: "Сколько времени нужно на обучение нейросетям?",
        a: "Первый прикладной цикл можно пройти за неделю: выбрать задачу, написать prompt, получить output, исправить ошибку и оформить кейс. Глубокое освоение занимает больше времени, но стартовать можно с малого проекта.",
      },
      {
        q: "Какие нейросети учить новичку?",
        a: "Новичку важнее учить сценарии: текст, презентации, визуал, видео и анализ. Конкретные сервисы меняются, а навык ставить задачу, писать prompt и проверять результат переносится между моделями.",
      },
      {
        q: "Нужны ли курсы по нейросетям для начинающих?",
        a: "Нужны, если курс дает практику, обратную связь и проект. Если программа только перечисляет сервисы и термины, лучше сначала пройти один самостоятельный кейс и понять, где именно не хватает структуры.",
      },
      {
        q: "Можно ли начать с бесплатных курсов по нейросетям?",
        a: "Да, бесплатные материалы подходят для первого знакомства. Но фиксируйте результат: prompt, output, ошибки и правки. Без практического артефакта бесплатное обучение быстро превращается в список ссылок.",
      },
      {
        q: "Что делать первым, если я изучаю нейросети с нуля?",
        a: "Выберите одну рабочую задачу и напишите prompt как ТЗ: цель, аудитория, формат, контекст и ограничения. Затем проверьте первый результат и улучшите только один параметр.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "neural-networks-from-scratch",
  title: "AI for beginners: 5 skills to learn before tools",
  excerpt:
    "AI for beginners works better when you learn task framing, prompt structure, output review, and proof-of-work cases before chasing every new tool.",
  description:
    "AI for beginners: learn task framing, prompt briefs, output review, iteration, and small portfolio cases before jumping into every new tool or course.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI for beginners should not start with model architecture or machine-learning math. For practical work, learn five skills first: choose a task, explain context, write the prompt as a brief, review the output, and package a small case. That gives you usable AI judgment before theory.",
    steps: [
      {
        title: "Don't start with ML theory",
        body:
          "Learning neural networks from scratch can sound like you need layers, weights, and datasets before doing anything useful. If your goal is marketing, design, content, or operational work, that is not the first step. Start with an output: a document, slide, image, video script, or analysis you actually need.\n\nTheory becomes useful later, once you can see where models fail. At the beginning, you need to tell a strong answer from a weak one. The model may sound confident while missing the audience, inventing facts, or giving you a polished structure that does not solve the job. Real tasks teach that faster than definitions.",
        before:
          "First I'll learn how neural networks work, then choose a tool, then maybe apply AI later.",
        after:
          "First task: improve a sales email. Review whether the model understood audience, format, tone, and constraints.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-1.jpg",
      },
      {
        title: "Skill 1: frame the task",
        body:
          "Any AI tutorial for beginners breaks down if the task is just \"make it good.\" The model does not know who will read the output, where it will be used, or what counts as done. A useful task answers four questions: who is it for, where will it appear, what format is required, and how will you judge the result?\n\nFor example, \"write landing page copy\" produces generic text. Better: \"write the first screen for a beginner AI course landing page for small business owners; include a headline, subhead, 3 benefits, and CTA without income promises.\" Now the model has a job, not a vague wish.",
        before:
          "Write landing page text about neural networks.",
        after:
          "Task: first-screen copy for a beginner AI course. Audience: small business owners with no AI background. Format: H1, subhead, 3 benefits, CTA. Constraints: no income promises, no advanced jargon.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-2.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Learn AI through tasks, not tool lists",
          body:
            "The course follows a practical path: task framing, prompts, visuals, video, website, and final packaging.",
          ctaLabel: "View curriculum",
          href: COURSE_URL,
          image: COURSE_BANNER_LEARNING_EN,
        },
      },
      {
        title: "Skill 2: write the prompt as a brief",
        body:
          "A prompt should read like a compact brief. It includes the model role, context, audience, output format, constraints, and review criteria. If those pieces are missing, the model invents them. It usually chooses the safest average answer, which looks smooth but does not fit your task.\n\nOpten can work as a preflight check before generation: give it the rough request and use it to catch missing role, context, format, and constraints. That matters most when every attempt costs time or credits, especially with video, visuals, presentations, or web pages.",
        before:
          "Make a post about the benefits of a course.",
        after:
          "Role: content strategist. Task: draft a LinkedIn post about a beginner AI course. Audience: solo marketers. Format: hook, 3 practical points, soft CTA. Constraints: no income guarantees, no hype, include one concrete workflow example.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-3.jpg",
      },
      {
        title: "Skill 3: review the output",
        body:
          "Review matters more than speed. When the model returns an answer, don't only ask whether you like it. Check facts, audience fit, format, constraints, and practical usefulness. For text, look for generic phrasing and unsupported claims. For a presentation, check slide logic. For visuals, check style drift, extra details, and readability.\n\nFix one axis at a time: audience, then format, then tone, then constraints. That shows which edit actually improved the output. This is the practical core of learning AI for beginners: not pressing generate again, but understanding why the next result got better.",
        before:
          "The answer seems okay, but generic. I'll ask for better and more detailed.",
        after:
          "Review: audience missing, format vague, result promise too strong, no example. Fix: define audience and remove the income promise.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-4.jpg",
      },
      {
        title: "Skill 4: build small proof-of-work cases",
        body:
          "Cases are not only for freelancers. They help you see your own progress. Save the original task, first prompt, weak output, revised prompt, and final version. After a few cycles, you will see your recurring mistakes: missing audience, vague format, no constraints, unchecked facts.\n\nIf you choose an AI course for beginners, look for a project result. Free AI tutorials are fine for orientation, but the next step needs practice and review. Good training ends with a case you can explain, not a certificate floating away from the actual work.",
        before:
          "I tried an AI tool, but I don't know what I learned.",
        after:
          "Case: original task, prompt v1, weak output, prompt v2, final text, and the edit that improved it.",
        promoBanner: {
          eyebrow: "Practice over theory",
          title: "Build your first AI case as a project",
          body:
            "The course helps you frame a task, improve the prompt, generate materials, and package the result so it can be reviewed.",
          ctaLabel: "Open the course",
          href: COURSE_URL,
          image: COURSE_BANNER_PROJECT_EN,
        },
      },
    ],
    faq: [
      {
        q: "How long does it take to learn AI for beginners?",
        a: "You can complete a first practical loop in a week: choose a task, write a prompt, generate an output, fix one problem, and document the case. Deeper skill takes longer, but the starting loop can be small.",
      },
      {
        q: "What AI tools should a beginner learn first?",
        a: "Learn scenarios first: text, presentations, visuals, video, and analysis. Tool names change, but task framing, prompt structure, and output review transfer across models.",
      },
      {
        q: "Do I need an AI course for beginners?",
        a: "A course helps when it includes practice, feedback, and a finished project. If it only lists tools and terms, run one small case first and see where you need structure.",
      },
      {
        q: "Can I start with free AI tutorials?",
        a: "Yes. Free tutorials are useful for orientation. Keep a prompt journal, compare outputs, and save the revised version so the learning turns into evidence, not a link collection.",
      },
      {
        q: "What should I do first if I am learning neural networks from scratch?",
        a: "Pick one work task and write the prompt as a brief: goal, audience, format, context, and constraints. Then review the first result and improve one parameter.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
