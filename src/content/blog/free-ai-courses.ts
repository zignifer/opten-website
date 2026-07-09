import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-10";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/free-ai-courses/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Бесплатное обучение нейросетям: маршрут из карточек заданий к готовому мини-кейсу",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Free AI courses roadmap from task cards to a completed mini case",
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
  slug: "free-ai-courses",
  title: "Бесплатное обучение нейросетям: начать и не бросить",
  excerpt:
    "Бесплатное обучение нейросетям и бесплатные курсы по ИИ дают старт, если каждый урок заканчивается задачей, prompt и небольшим готовым результатом.",
  description:
    "Бесплатное обучение нейросетям помогает освоить первые AI-задачи: выбрать практику, написать prompt, исправить ошибку и собрать мини-кейс без платного курса.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "prompt-structure", "ai-courses-for-beginners"],
  body: {
    intro:
      "Бесплатное обучение нейросетям дает реальную опору, когда после каждого урока вы делаете маленькую задачу: текст, визуал, слайд или видео. Так появляются словарь, первые prompts и мини-кейсы. Бесплатные курсы по ИИ подходят, чтобы проверить интерес и рабочий сценарий, но не заменяют регулярную практику и обратную связь.",
    steps: [
      {
        title: "Бесплатные курсы по ИИ работают, когда у урока есть задача",
        body:
          "Бесплатный формат хорош не тем, что в нем можно посмотреть десятки роликов, а тем, что он позволяет без риска выбрать направление. Один урок по тексту, визуалу, презентациям или видео уже достаточен, чтобы понять: вам интересно решать такую задачу или вы просто собираете названия сервисов. Выберите один результат на ближайшие 30-40 минут и не переходите к следующему уроку, пока не получите черновик, который можно сохранить.\n\nКейс Ирины: после урока о визуальном brief она открыла GPT Image 2 с запросом «Сделай стильную иллюстрацию для урока» и получила красивую, но бесполезную картинку. Она переписала prompt, добавив назначение, предмет, формат и ограничения. В результате появился понятный кадр для мини-кейса, а не еще один случайный рендер. Модель здесь не сделала работу за нее: она помогла увидеть, какие детали задачи Ирина раньше не формулировала.",
        before: "Сделай стильную иллюстрацию для урока.",
        after:
          "Учебная иллюстрация для мини-кейса о бесплатном обучении нейросетям. Сцена: рабочий стол с пятью карточками заданий. Стиль: темный editorial. Формат: 16:9. Ограничения: без текста и логотипов. Критерий: путь от урока к готовой работе понятен без пояснений.",
        imageSrc: "/blog/free-ai-courses/ru/step-1.jpg",
      },
      {
        title: "Нейросети с нуля: держите недельный ритм, а не список вкладок",
        body:
          "Тем, кто изучает нейросети с нуля, полезнее собрать короткую неделю практики, чем искать идеальную программу. В первый день сделайте текстовый черновик, во второй - визуальный brief, в третий - один слайд, в четвертый - короткий ролик или раскадровку, а в пятый соедините материалы в одну понятную историю. Пять маленьких артефактов дают больше понимания, чем пять часов обзоров.\n\nНе пытайтесь пройти все бесплатные курсы по нейросетям подряд. Сохраняйте исходную задачу, первый prompt, первую ошибку и версию после правки. Так постепенно появляется свой набор рабочих приемов. Когда задача уже выбрана, Opten может подсветить, чего в prompt не хватает: цели, контекста, формата, ограничений или критерия проверки. Это полезнее, чем угадывать, почему модель снова выдала общий ответ.",
        before:
          "На этой неделе посмотрю уроки про ChatGPT, картинки, видео и презентации, а практику начну, когда разберусь во всем.",
        after:
          "На этой неделе соберу один мини-кейс: текст, visual brief, один слайд и короткую раскадровку для одной задачи. После каждого этапа сохраню prompt и правку.",
        imageSrc: "/blog/free-ai-courses/ru/step-2.jpg",
      },
      {
        title: "Превратите просмотр урока в короткий prompt",
        body:
          "Пассивное обучение начинается с фразы «сначала посмотрю еще пару видео». Практика начинается с вопроса, что вы хотите получить к концу занятия. Перед запуском модели назовите цель, добавьте контекст, задайте формат и решите, по какому признаку оцените результат. Такой prompt не обязан быть длинным, но он не оставляет модели гадать, что считать удачным ответом.\n\nЭто особенно заметно на простых заданиях. Если после урока про презентации написать «сделай слайды», вы получите общую заготовку. Если обозначить аудиторию, количество слайдов, исходные факты и один критерий качества, появится материал для проверки. Затем можно исправить только слабый элемент: сократить вступление, уточнить визуальный образ или попросить другой тон. Так формируется привычка не потреблять уроки, а ставить задачи.",
        before: "Сделай презентацию о продукте.",
        after:
          "Подготовь структуру из 7 слайдов для внутренней презентации нового сервиса. Аудитория: менеджеры без технического бэкграунда. Нужны проблема, решение, один сценарий использования и следующий шаг. Тон: ясный, без рекламных обещаний. Критерий: каждый слайд отвечает на один вопрос.",
        imageSrc: "/blog/free-ai-courses/ru/step-3.jpg",
      },
      {
        title: "Соберите первый кейс и только потом решайте, нужен ли платный курс",
        body:
          "Первый кейс не обязан быть коммерческим. Достаточно показать путь: какая была задача, какой prompt вы написали, что в первой версии не сработало, как вы это поправили и что вышло в финале. Такая папка честнее сертификата: по ней видно, умеете ли вы доводить AI-задачу до результата и объяснять свои решения.\n\nБесплатного обучения достаточно, чтобы попробовать направление и собрать базовую практику. Платный курс имеет смысл позже, когда вы понимаете, что хотите повторять один сценарий, но вам не хватает последовательной программы, обратной связи или более сложного проекта. Тогда вы платите не за доступ к названиям инструментов, а за темп, разбор ошибок и среду, где работу нужно закончить.",
        before:
          "У меня есть список уроков и сохраненные ссылки, но я не могу показать, чему научился.",
        after:
          "Мой мини-кейс: задача, prompt, первая версия, одна правка, финальный артефакт и короткий вывод о том, что сделаю иначе в следующий раз.",
        imageSrc: "/blog/free-ai-courses/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите AI-практику вокруг одного проекта",
          body:
            "Курс помогает пройти полный цикл: prompt, изображения, видео, сайт и рекламные материалы для одного проекта, чтобы практика сразу стала портфолио-кейсом.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: COURSE_BANNER_RU,
        },
      },
    ],
    faq: [
      {
        q: "Есть ли бесплатные курсы по ИИ, с которых можно начать?",
        a: "Да. Начните с бесплатных уроков по одному прикладному сценарию: текст, визуал, презентация или видео. После каждого урока делайте небольшую работу и сохраняйте prompt с результатом, иначе обучение останется просмотром.",
      },
      {
        q: "Можно ли освоить нейросети с нуля бесплатно?",
        a: "Можно освоить базовую логику: как поставить задачу, дать модели контекст, выбрать формат и проверить ответ. Бесплатный формат подходит для первых workflow и мини-кейсов, но требует собственного ритма и дисциплины.",
      },
      {
        q: "Когда нужен платный курс по нейросетям?",
        a: "Платный курс нужен не на старте любой ценой, а когда вы уже понимаете свой сценарий и хотите больше структуры, обратной связи или проект сложнее одиночного упражнения. Сначала проверьте интерес бесплатной практикой.",
      },
      {
        q: "Сколько практики делать после одного урока?",
        a: "Достаточно одной небольшой задачи на 30-40 минут. Важно завершить ее: сохранить prompt, отметить первую ошибку, сделать одну правку и положить финальный результат в папку с кейсами.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "free-ai-courses",
  title: "Free AI courses: learn by doing, not watching",
  excerpt:
    "Free AI courses and AI courses online free can get you started when every lesson ends with a task, a prompt, and a small finished result you can keep.",
  description:
    "Free AI courses can teach useful first workflows: choose a task, write a prompt, revise a weak result, and build a small portfolio case before paying for a course.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "prompt-structure", "ai-courses-for-beginners"],
  body: {
    intro:
      "Free AI courses are useful when every lesson ends with a small task: a piece of copy, a visual, a slide, or a short video. That is how beginners acquire vocabulary, first prompts, and small cases. AI courses online free are enough to test a direction and build a workflow, but they cannot replace consistent practice or feedback.",
    steps: [
      {
        title: "Free AI courses work when the lesson has a task",
        body:
          "The value of a free lesson is not that you can queue up dozens of videos. It is that you can test a direction without committing to a program. One lesson on copy, visuals, slides, or video is enough to find out whether you want to solve that kind of problem or merely collect tool names. Pick one result for the next 30 to 40 minutes and do not move on until you have a draft worth saving.\n\nIrina's case: after a lesson on visual briefs, she opened GPT Image 2 with the request, \"Make a stylish illustration for a lesson.\" The output was attractive but unusable. She rewrote the prompt with a purpose, subject, format, and constraints. The next result was a clear frame for a mini case instead of another random render. The model did not do the thinking for her; it exposed the details of the task she had not named yet.",
        before: "Make a stylish illustration for a lesson.",
        after:
          "Educational illustration for a mini case about free AI learning. Scene: a worktable with five task cards. Style: dark editorial. Format: 16:9. Constraints: no text and no logos. Success criterion: the path from lesson to finished work is clear without explanation.",
        imageSrc: "/blog/free-ai-courses/en/step-1.jpg",
      },
      {
        title: "Learn AI for beginners with a weekly rhythm",
        body:
          "If you want to learn AI for beginners, a short practice week is more useful than hunting for a perfect syllabus. Draft copy on day one, make a visual brief on day two, build one slide on day three, sketch a short video on day four, and connect the pieces into one clear story on day five. Five small artifacts teach you more than five hours of tool overviews.\n\nDo not take every free AI course back to back. Save the original task, the first prompt, the first mistake, and the version after revision. That record becomes your own working playbook. Once the task is defined, Opten can help surface what the prompt is missing: a goal, context, format, constraints, or a success criterion. It is more useful than guessing why the model produced another vague answer.",
        before:
          "This week I will watch lessons about ChatGPT, images, video, and presentations. I will practice once I understand everything.",
        after:
          "This week I will build one mini case: copy, a visual brief, one slide, and a short storyboard for a single task. I will save the prompt and one revision after every stage.",
        imageSrc: "/blog/free-ai-courses/en/step-2.jpg",
      },
      {
        title: "Turn a lesson into a short prompt",
        body:
          "Passive learning starts with, \"I will watch two more videos first.\" Practice starts with asking what you want to have by the end of the session. Name the goal, add context, specify the format, and decide how you will judge the output before you open the model. The prompt does not need to be long, but it should not make the model guess what success looks like.\n\nThis is obvious on simple assignments. Write, \"Make slides about the product,\" after a presentation lesson and you will get a generic outline. Define the audience, slide count, source facts, and one quality bar, and you have material you can assess. Then revise one weak element only: trim the opening, clarify the visual direction, or ask for a different tone. That is how watching lessons becomes a habit of setting useful tasks.",
        before: "Make slides about the product.",
        after:
          "Create a seven-slide outline for an internal presentation about a new service. Audience: managers without a technical background. Include the problem, solution, one usage scenario, and the next step. Tone: clear, no promotional promises. Success criterion: every slide answers one question.",
        imageSrc: "/blog/free-ai-courses/en/step-3.jpg",
      },
      {
        title: "Build a small case before choosing a paid course",
        body:
          "Your first case does not have to be commercial. Show the path instead: the task, the prompt you wrote, what failed in the first version, how you revised it, and the final result. This kind of folder is more honest than a certificate. It shows whether you can carry an AI task through to an outcome and explain the decisions along the way.\n\nFree AI courses are enough to try a direction and build basic practice. A paid course becomes useful when you know which workflow you want to repeat but need a structured sequence, feedback, or a more demanding project. At that point, you are not paying to hear tool names. You are paying for pace, error review, and an environment that expects you to finish the work.",
        before:
          "I have a list of lessons and saved links, but nothing that demonstrates what I learned.",
        after:
          "My mini case includes the task, prompt, first version, one revision, final artifact, and a short note about what I would change next time.",
        imageSrc: "/blog/free-ai-courses/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build AI practice around one complete project",
          body:
            "The course follows a full cycle: prompt, images, video, website, and promotional materials for one project, so practice becomes a portfolio case right away.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: COURSE_BANNER_EN,
        },
      },
    ],
    faq: [
      {
        q: "Are there free AI courses that are useful for beginners?",
        a: "Yes. Start with a free lesson for one applied scenario, such as copy, visuals, a presentation, or video. Make a small piece of work after every lesson and save the prompt with its result, otherwise the course stays passive viewing.",
      },
      {
        q: "Can you learn AI for beginners without paying?",
        a: "You can learn the basics of setting a task, giving the model context, choosing a format, and checking the output. Free learning works for first workflows and mini cases, but it needs your own rhythm and discipline.",
      },
      {
        q: "When is a paid AI course worth it?",
        a: "A paid course is not essential on day one. It becomes useful when you understand your workflow and need more structure, feedback, or a project that is harder than a single exercise. Test the direction with free practice first.",
      },
      {
        q: "How much practice should follow one AI lesson?",
        a: "One focused task of 30 to 40 minutes is enough. Finish it: save the prompt, note the first mistake, make one revision, and put the final result in a case folder.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
