import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-04";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/neural-networks-from-scratch/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про обучение нейросетям через практические навыки",
};
const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Cover image for a practical beginner guide to learning AI skills",
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
  slug: "neural-networks-from-scratch",
  title: "Обучение нейросетям с нуля: 5 навыков для работы",
  excerpt:
    "Обучение нейросетям и нейросети с нуля проще освоить через задачу, prompt, проверку результата и маленький кейс для портфолио без хаоса из уроков.",
  description:
    "Обучение нейросетям с нуля: какие навыки нужны новичку, как выбирать курсы по нейросетям, писать prompt, проверять ответ и собрать первый кейс без хаоса.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "prompt-structure", "prompt-examples"],
  body: {
    intro:
      "Обучение нейросетям стоит начинать не с архитектуры моделей, а с практики: выбрать задачу, описать результат, написать prompt, проверить ответ и сохранить кейс за один вечер. Так нейросети с нуля становятся рабочим навыком, а не набором случайных уроков и списков сервисов.",
    steps: [
      {
        title: "Нейросети с нуля - это не сначала математика",
        body:
          "Новичку не нужно начинать с слоев, весов и функции активации, если цель - применять ИИ в работе. Эти темы пригодятся позже, когда вы пойдете в ML или аналитику. Для маркетолога, дизайнера, предпринимателя, менеджера или фрилансера первый уровень другой: понять, какую задачу можно отдать модели и как оценить результат.\n\nПоэтому обучение нейросетям начинается с маленького результата. Не «разобраться во всем», а «собрать черновик письма клиенту», «сделать структуру презентации», «подготовить описание товара», «сформулировать референс для изображения». Такой подход снижает тревогу: вы учитесь управлять ответом модели, а не сдавать экзамен по нейронным сетям.",
        before:
          "Хочу изучить нейросети с нуля. Объясни архитектуру, историю, модели, инструменты и все важные термины.",
        after:
          "Задача: за 40 минут подготовить черновик письма клиенту после созвона. Нужны тон, структура, 3 тезиса, следующий шаг и список вопросов, которые надо уточнить.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-1.jpg",
      },
      {
        title: "Выберите первую задачу, а не первый сервис",
        body:
          "Курсы по нейросетям часто начинаются с обзора инструментов: ChatGPT, Midjourney, генераторы видео, автоматизации, таблицы, презентации. Это полезно, но новичок быстро теряется. Надежнее начать с одной задачи из своей работы и только потом выбирать модель.\n\nХорошая стартовая задача проходит четыре фильтра: у нее есть цель, понятная аудитория, формат результата и критерий качества. Например: «сделать структуру поста для Telegram для владельцев небольших студий; формат - заголовок, план, 5 тезисов; критерий - можно отдать редактору на доработку». Если задача так не описывается, модель будет угадывать.",
        before:
          "Посоветуй лучшую нейросеть для работы и курсы по нейросетям для начинающих.",
        after:
          "Мне нужен черновик Telegram-поста для владельцев студий. Цель: объяснить новую услугу. Формат: заголовок, план, 5 тезисов. Критерий: редактор понимает, что дописывать.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-2.jpg",
      },
      {
        title: "Prompt пишется как короткое ТЗ",
        body:
          "Prompt - это не магическая фраза, а короткое техническое задание. В нем должны быть роль модели, контекст, входные данные, формат ответа и запреты. Если написать «сделай хороший текст», модель даст общий ответ. Если объяснить аудиторию, задачу, тон, объем и ограничения, ответ становится рабочим черновиком.\n\nПрактический кейс: новичок попросил ChatGPT сделать текст для лендинга курса и получил стерильный набор преимуществ. Ошибка была в prompt: не было аудитории, уровня знания, формата блока и запрета на рекламные штампы. После правки добавили роль редактора, контекст курса, аудиторию «специалист, который боится начать с ИИ», формат из 5 блоков и запрет на обещания профессии за неделю. Результат стал похож на черновик страницы, который уже можно редактировать.",
        before:
          "Напиши текст для лендинга про курс по нейросетям. Сделай убедительно и современно.",
        after:
          "Ты - редактор лендинга. Курс учит применять ИИ в работе через один проект. Аудитория: новичок, который боится начать. Формат: 5 блоков страницы. Тон: спокойно, без обещаний профессии за неделю. Не используй клише.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-3.jpg",
      },
      {
        title: "Проверяйте результат, а не верьте первому ответу",
        body:
          "Главный навык после prompt - проверка. Смотрите на факты, тон, формат, полноту и одну главную ошибку. Не переписывайте запрос целиком после каждого ответа: выберите один дефект и исправьте его. Например: «тон слишком рекламный», «нет примеров», «модель не поняла аудиторию», «формат не совпал с заданием».\n\nOpten полезен именно на этом preflight-этапе: он помогает увидеть, где запрос не зафиксировал роль, формат, ограничения или критерий качества, и улучшить prompt до генерации. Это экономит попытки и быстрее показывает, какие правила работают для вашей задачи.",
        before:
          "Ответ не понравился. Сделай лучше, подробнее, интереснее и без ошибок.",
        after:
          "Исправь только тон: меньше рекламы, больше конкретики. Сохрани структуру из 5 блоков. Добавь по одному примеру в каждый блок и не обещай быстрый заработок.",
        imageSrc: "/blog/neural-networks-from-scratch/ru/step-4.jpg",
      },
      {
        title: "Как выбрать курсы по нейросетям и не утонуть в уроках",
        body:
          "Курсы по нейросетям для начинающих стоит оценивать не по количеству сервисов, а по тому, что вы сделаете руками. Хороший курс ведет к артефакту: презентации, визуалу, тексту, видео, лендингу, карточке товара или портфолио-кейсу. Плохой курс оставляет только конспект и ощущение, что надо посмотреть еще десять уроков.\n\nБесплатные курсы по нейросетям подходят для первого знакомства: понять термины, увидеть интерфейсы, попробовать prompts. Для роста выбирайте программу, где есть повторяемый workflow: задача, prompt, первая ошибка, правка, финальный результат, упаковка кейса. Именно эта связка переносится между ChatGPT, генераторами изображений, видео-моделями и рабочими инструментами.",
        before:
          "Смотрю бесплатные курсы по нейросетям подряд и сохраняю ссылки, но не могу показать ни одного результата.",
        after:
          "Выбираю один учебный трек: за неделю сделать один кейс с задачей, prompt, ошибкой, правкой, финальным результатом и коротким описанием.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите обучение нейросетям вокруг одного проекта",
          body:
            "В курсе показываю полный цикл: prompt, изображения, видео, сайт и рекламные материалы для одного проекта, чтобы практика сразу становилась кейсом.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_RU,
        },
      },
    ],
    faq: [
      {
        q: "Сколько времени нужно на обучение нейросетям?",
        a: "Первый практический результат можно получить за вечер: выбрать задачу, написать prompt, проверить ответ и исправить одну ошибку. Уверенный рабочий навык обычно появляется после нескольких недель повторения на похожих задачах.",
      },
      {
        q: "Какие нейросети учить новичку?",
        a: "Начните с текстовой модели для задач вроде писем, постов, структуры презентаций и анализа черновиков. Когда поймете, как задавать роль, контекст, формат и ограничения, добавляйте генераторы изображений, видео или автоматизации под свои рабочие задачи.",
      },
      {
        q: "Нужны ли курсы по нейросетям для начинающих?",
        a: "Курсы по нейросетям для начинающих полезны, если в них есть практика и готовый артефакт. Если курс только перечисляет инструменты, навык не закрепляется: вы знаете названия сервисов, но не умеете доводить задачу до результата.",
      },
      {
        q: "Можно ли начать с бесплатных курсов по нейросетям?",
        a: "Да. Бесплатные курсы по нейросетям хороши для первого входа: понять базовые термины и попробовать prompts. Но после вводных уроков переходите к своему кейсу, иначе обучение останется просмотром чужих примеров.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "neural-networks-from-scratch",
  title: "AI for beginners: 5 skills before you pick a course",
  excerpt:
    "AI for beginners works best when you start with one task, write a prompt as a brief, review the output, and turn the result into a small case.",
  description:
    "AI for beginners: learn AI for beginners through task framing, prompt structure, output review, course selection, and a first portfolio case for work.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI for beginners should start with practice, not model architecture. Pick one work task, define the output, write a prompt, review the answer, and save the case. That makes learning AI practical before you compare tools, courses, or technical terms.",
    steps: [
      {
        title: "Learning AI from scratch does not start with math",
        body:
          "You don't need to begin with layers, weights, and activation functions if your goal is to use AI at work. Those topics matter later if you move into ML or analytics. For a marketer, designer, founder, manager, or freelancer, the first layer is simpler: know which task belongs to the model and how you'll judge the answer.\n\nSo the first AI tutorial for beginners should lead to a small result. Not «understand everything», but «draft a client follow-up email», «outline a presentation», «prepare a product description», or «write a visual reference for an image». This lowers the pressure: you're learning how to direct the model, not studying for a neural network exam.",
        before:
          "I want to learn AI from scratch. Explain the architecture, history, tools, terms, and all important models.",
        after:
          "Task: draft a client follow-up email in 40 minutes. Include tone, structure, 3 key points, next step, and questions that still need clarification.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-1.jpg",
      },
      {
        title: "Choose the first task before the first tool",
        body:
          "Many AI courses start with a tool tour: ChatGPT, image generators, video tools, automations, spreadsheets, slide makers. That's useful, but beginners get lost fast. A better start is one task from your own work, then the model that fits it.\n\nA good starter task has four parts: a goal, an audience, an output format, and a quality bar. For example: «outline a Telegram post for small studio owners; format: headline, plan, 5 points; quality bar: an editor can see what to improve». If the task can't be described that way, the model has to guess.",
        before:
          "Recommend the best AI tool for work and the best course for beginners.",
        after:
          "I need a draft Telegram post for small studio owners. Goal: explain a new service. Format: headline, outline, 5 points. Quality bar: the editor knows what to rewrite.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-2.jpg",
      },
      {
        title: "Write the prompt as a short brief",
        body:
          "A prompt is not a magic phrase. It's a working brief. It should define the model's role, context, input material, output format, and constraints. If you write «make it good», the model gives you a generic answer. If you state the audience, task, tone, length, and limits, the answer becomes a usable draft.\n\nPractical case: a beginner asked ChatGPT to write landing page copy for an AI course and got sterile benefit bullets. The prompt was the problem: no audience, no knowledge level, no page format, and no ban on marketing cliches. The fix added an editor role, course context, the audience «a specialist afraid to start with AI», a five-block page format, and a ban on promising a new profession in a week. The next answer looked like a page draft worth editing.",
        before:
          "Write landing page copy for an AI course. Make it persuasive and modern.",
        after:
          "You are a landing page editor. The course teaches applied AI through one project. Audience: beginners who are afraid to start. Format: 5 page blocks. Tone: calm and specific. Avoid cliches and career-in-a-week promises.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-3.jpg",
      },
      {
        title: "Review the output before you trust it",
        body:
          "The next skill after prompting is review. Check facts, tone, format, completeness, and the one main error. Don't rewrite the whole prompt after every answer. Pick one defect and fix that: «too salesy», «no examples», «wrong audience», «format doesn't match the task».\n\nOpten is useful at this preflight stage. It helps catch the missing role, format, constraints, or quality bar before you spend more generation attempts. That makes learn AI for beginners less about guessing and more about seeing which rules improve your own task.",
        before:
          "I don't like the answer. Make it better, more detailed, more interesting, and error-free.",
        after:
          "Fix only the tone: less sales copy, more specific detail. Keep the 5-block structure. Add one example to each block and do not promise fast income.",
        imageSrc: "/blog/neural-networks-from-scratch/en/step-4.jpg",
      },
      {
        title: "Pick AI courses by the artifact they help you make",
        body:
          "Evaluate AI courses by what you build, not by how many tools they list. A useful beginner course produces an artifact: a presentation, visual, text, video, landing page, product card, or portfolio case. A weak course leaves you with notes and the feeling that you need ten more lessons.\n\nFree AI courses are fine for the first pass: learn the terms, see the interfaces, try prompts. After that, choose a workflow: task, prompt, first mistake, prompt fix, final result, case packaging. That loop carries across ChatGPT, image generators, video models, and workplace tools.",
        before:
          "I keep watching free AI courses and saving links, but I can't show one finished result.",
        after:
          "One learning track for the week: one case with a task, prompt, error, fix, final result, and a short portfolio note.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build AI learning around one real project",
          body:
            "The course walks through prompts, images, video, a website, and campaign assets for one project, so practice turns into a concrete case.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: COURSE_BANNER_WORKFLOW_EN,
        },
      },
    ],
    faq: [
      {
        q: "How long does it take to learn AI for beginners?",
        a: "You can get the first practical result in one evening: choose a task, write a prompt, review the answer, and fix one error. A reliable work skill usually takes a few weeks of repeating that loop on similar tasks.",
      },
      {
        q: "Which AI tools should a beginner learn first?",
        a: "Start with a text model for emails, posts, presentation outlines, summaries, and draft review. Once you can set role, context, format, and constraints, add image generators, video tools, or automations for your actual work.",
      },
      {
        q: "Do I need an AI course as a beginner?",
        a: "An AI course helps if it includes practice and a finished artifact. If it only lists tools, the skill doesn't stick: you know service names but still don't know how to move a task from prompt to result.",
      },
      {
        q: "Can I start with a free AI tutorial for beginners?",
        a: "Yes. A free AI tutorial for beginners is good for first orientation: terms, interfaces, and basic prompts. After the intro, switch to your own small case, otherwise learning stays passive.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
