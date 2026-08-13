import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-08-14";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/prompt-engineering-course/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Курс по промптингу: практическая сборка и проверка промпта",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Prompt engineering course with practical prompt building and output review",
};

const ru: BlogPostLocale = {
  slug: "prompt-engineering-course",
  title: "Курс по промптингу: как научиться составлять промпты",
  excerpt:
    "Курс по промптингу через практику: разбираем, что такое промптинг, как составить промпт, проверить результат и превратить примеры промптов в навык.",
  description:
    "Практический курс по промптингу: как составить промпт, проверить ответ модели, разобрать примеры промптов и выбрать практическое обучение с обратной связью.",
  category: "guide",
  tags: ["prompt-engineering", "workflow", "ai-image-gen"],
  cover: COVER_RU,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-examples", "prompt-structure", "ai-courses-for-beginners"],
  body: {
    intro:
      "Промптинг - это умение описать задачу ИИ так, чтобы результат можно было проверить и улучшить. Курс по промптингу стоит проходить не по списку терминов, а через короткие практические задачи: задать результат, добавить контекст и ограничения, получить ответ, найти ошибку и переписать запрос. Так примеры промптов превращаются в рабочий навык.",
    steps: [
      {
        title: "Сначала определите результат и способ проверки",
        body:
          "Начинайте упражнение не со слов для модели, а с результата. Для текста это может быть письмо на 120-150 слов с одним призывом к действию. Для изображения - один предмет в заданном кадре без логотипов и надписей. Для анализа - таблица с фиксированными колонками и выводом под ней. Затем запишите два-три признака, по которым ответ можно принять или отклонить. Такой подход сразу отвечает на вопрос, как составить промпт: сначала описать полезный артефакт, затем добавить условия его создания. Если критериев нет, ученик оценивает результат словами «нравится» или «не нравится» и не понимает, какую часть запроса менять.",
        imageSrc: "/blog/prompt-engineering-course/ru/step-1.jpg",
      },
      {
        title: "Собирайте промпт из четырех рабочих блоков",
        body:
          "Удобная структура состоит из задачи, контекста, ограничений и формата ответа. Задача говорит, что сделать. Контекст уточняет аудиторию, исходные материалы и ситуацию. Ограничения фиксируют длину, стиль, обязательные детали и запреты. Формат задает вид результата: список, письмо, таблица, сценарий или один визуал. Не обязательно писать названия блоков в каждом запросе, но при обучении они помогают увидеть пробел. Возьмите несколько примеров промптов и отметьте в них эти части. Если в примере есть только роль и красивое описание, но нет проверяемого результата, не копируйте его целиком. Добавьте недостающий блок под свою задачу.",
        imageSrc: "/blog/prompt-engineering-course/ru/step-2.jpg",
      },
      {
        title: "Учитесь через короткий цикл, а не библиотеку шаблонов",
        body:
          "Сделайте одну попытку, посмотрите на конкретную ошибку и измените только связанную с ней часть промпта. Если ответ слишком общий, добавьте исходные данные или аудиторию. Если структура расползлась, жестче задайте формат. Если модель придумала факты, потребуйте опираться только на переданный материал и отмечать отсутствующие данные. После правки сохраните не просто финальный запрос, а короткую заметку: какая ошибка появилась и какое ограничение ее исправляло. Затем перенесите прием на новую задачу. Так курс по промптингу развивает навык диагностики, а не коллекцию фраз, которые работают только в одном примере.",
        imageSrc: "/blog/prompt-engineering-course/ru/step-3.jpg",
      },
      {
        title: "Разбирайте практический кейс до точной правки",
        body:
          "Учебный кейс для GPT Image 2 начинается с запроса «сделай стильное фото кружки для сайта». В нем не определены кадр, фон, количество предметов и запреты, поэтому модель может добавить упаковку, надпись или лишний реквизит. Исправленный промпт фиксирует один результат: 'Create one editorial product photo of a matte black ceramic travel mug on a dark stone desk, three-quarter view, handle fully visible, soft side light, 16:9. Keep the mug centered with clean margins. No text, letters, logos, labels, extra mugs, hands, packaging, or interface.' В итоговом упражнении ученик получает один изолированный объект и может отдельно проверить ракурс, ручку, поля и отсутствие надписей. Opten помогает заметить недостающий формат и ограничения до запуска генерации.",
        imageSrc: "/blog/prompt-engineering-course/ru/step-4.jpg",
      },
      {
        title: "Выбирайте курс по заданиям, обратной связи и переносу навыка",
        body:
          "Сравнивая программы, смотрите не на число уроков и сертификат, а на учебный цикл. Хорошее задание содержит исходные данные, понятный результат и критерии проверки. Обратная связь должна объяснять, какая часть промпта не управляет результатом и почему предложенная правка уместна. После разбора нужен новый кейс с другими входными данными: так видно, понял ли ученик принцип или повторил готовую формулу. Полезно, когда курс по промпт-инжинирингу охватывает несколько типов задач, но не смешивает их в одном упражнении. Текст, изображение и анализ требуют разных ограничений. К концу обучения у вас должны остаться не десятки чужих шаблонов, а несколько собственных работ с объяснением решений.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Освойте промпты на реальных задачах",
          body:
            "На курсе вы создаете визуалы, видео, сайт и презентацию результата, проверяя промпты на каждом этапе проекта.",
          ctaLabel: "Посмотреть программу курса",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс Opten с практическими заданиями по промптам и созданию проекта с ИИ",
          },
        },
      },
    ],
    faq: [
      {
        q: "Промптинг - что это простыми словами?",
        a: "Промптинг - это постановка задачи для ИИ и последовательная проверка результата. Вы описываете нужный итог, передаете контекст, задаете ограничения и формат, затем находите ошибку в ответе и уточняете связанную с ней часть запроса.",
      },
      {
        q: "Как составить промпт для нейросети?",
        a: "Сначала назовите результат и аудиторию, затем добавьте исходные данные, обязательные условия, запреты и формат ответа. Проверьте, можно ли по вашему описанию однозначно принять результат или указать, что именно нужно исправить.",
      },
      {
        q: "Стоит ли сохранять готовые примеры промптов?",
        a: "Да, если вместе с запросом вы сохраняете задачу, модель, ошибку и причину правки. Шаблон без контекста быстро устаревает или не подходит к новой ситуации. Полезнее хранить рабочий принцип и один подтверждающий пример.",
      },
      {
        q: "Что должно быть в курсе по промптингу?",
        a: "Ищите практические задания с исходными данными, критериями результата, обратной связью и повторным упражнением на новом кейсе. Отдельным плюсом будет разбор разных типов задач: текста, изображений, анализа и проектной работы.",
      },
      {
        q: "Нужно ли знать программирование для промптинга?",
        a: "Для базовой работы с текстовыми и визуальными моделями программирование не требуется. Важнее уметь точно описывать результат, отделять факты от предположений и проверять ответ. Код понадобится только для технических сценариев и автоматизации.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "prompt-engineering-course",
  title: "Prompt engineering course: learn through practical tasks",
  excerpt:
    "A prompt engineering course should turn prompt examples into repeatable practice. Learn to define a result, write AI prompts, inspect outputs, and revise constraints.",
  description:
    "A practical prompt engineering course for learning prompt structure, testing AI outputs, revising constraints, and choosing exercises with useful feedback.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "A useful prompt engineering course teaches a repeatable practice: define the result, add context and constraints, run the prompt, inspect the output, and revise one weak part. The goal isn't to memorize clever wording. It's to learn how to write AI prompts that can be tested, explained, and adapted to a new task.",
    steps: [
      {
        title: "Define the output and the review criteria first",
        body:
          "Begin with the artifact, not the wording for the model. A writing exercise might ask for a 120-150 word email with one call to action. An image task could require one product in a specified frame with no logos or lettering. An analysis task might end in a table with fixed columns and a short conclusion. Write two or three criteria that let you accept or reject the output. That step makes prompt writing much easier because every instruction now serves a visible result. Without criteria, learners can only say that an answer feels good or bad. They can't identify which part of the prompt needs work.",
        imageSrc: "/blog/prompt-engineering-course/en/step-1.jpg",
      },
      {
        title: "Build the prompt from four working blocks",
        body:
          "A reliable structure has a task, context, constraints, and output format. The task states the action. Context supplies the audience, situation, and source material. Constraints set length, tone, required details, and exclusions. The format defines the shape of the answer: a list, email, table, script, or single visual. You don't need to label every block in daily work, but doing so during a course makes missing information obvious. Study several prompt examples and mark these parts. If an example has an elaborate role but no testable result, don't copy the whole thing. Keep the useful idea and add the block your task actually needs.",
        imageSrc: "/blog/prompt-engineering-course/en/step-2.jpg",
      },
      {
        title: "Practice a short loop instead of collecting templates",
        body:
          "Run one attempt, find a specific failure, and change only the instruction connected to it. If the answer is generic, add source material or a clearer audience. If the structure drifts, tighten the output format. If the model invents facts, limit it to the supplied material and ask it to flag missing information. Save a short note with the final prompt: what failed and which constraint addressed it. Then apply the same principle to a new task. This is where prompt engineering courses differ from template libraries. A useful course develops diagnosis and transfer, not a folder of phrases that only work in one demonstration.",
        imageSrc: "/blog/prompt-engineering-course/en/step-3.jpg",
      },
      {
        title: "Trace a practical case to one precise revision",
        body:
          "A GPT Image 2 exercise starts with “make a stylish mug photo for a website.” The request leaves framing, background, object count, and exclusions open, so the model may add packaging, lettering, or unrelated props. The revised prompt asks for one result: 'Create one editorial product photo of a matte black ceramic travel mug on a dark stone desk, three-quarter view, handle fully visible, soft side light, 16:9. Keep the mug centered with clean margins. No text, letters, logos, labels, extra mugs, hands, packaging, or interface.' The exercise now produces one bounded subject that can be reviewed for angle, handle visibility, margins, and unwanted text. Opten can help flag a missing format or exclusion before generation.",
        imageSrc: "/blog/prompt-engineering-course/en/step-4.jpg",
      },
      {
        title: "Choose a course by its exercises, feedback, and transfer",
        body:
          "When comparing prompt engineering courses, look past lesson count and certificates. A useful exercise provides source material, a clear deliverable, and review criteria. Feedback should explain which instruction failed to control the output and why a revision fits the problem. The next exercise should use different inputs so you can prove that the principle transfers instead of repeating a formula. It's helpful when a course covers several task types, but each exercise should stay focused. Writing, image generation, and analysis need different constraints. By the end, you should have a small set of your own reviewed artifacts and be able to explain the decisions behind them.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Practice prompts on real project tasks",
          body:
            "The course takes you through visuals, video, a website, and a final presentation, with prompt checks at every stage.",
          ctaLabel: "View the course program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Opten course with practical prompt exercises and an AI-assisted project",
          },
        },
      },
    ],
    faq: [
      {
        q: "What is prompt engineering in simple terms?",
        a: "Prompt engineering is the practice of describing a task for an AI system and reviewing the result. You define the output, supply context, set constraints and format, then revise the instruction connected to a specific failure.",
      },
      {
        q: "How do you write AI prompts?",
        a: "Start with the intended result and audience. Add source material, required conditions, exclusions, and the output format. A strong prompt makes it possible to accept the response or point to a specific part that needs revision.",
      },
      {
        q: "Are saved prompt examples useful?",
        a: "Yes, when you save the task, model, failure, and reason for the revision alongside the prompt. A template without context may not fit a new situation. The transferable principle matters more than the exact wording.",
      },
      {
        q: "What should a prompt engineering course include?",
        a: "Look for practical exercises with source material, output criteria, feedback, and a follow-up task using new inputs. It should also separate the constraints needed for writing, image generation, analysis, and project work.",
      },
      {
        q: "Do you need coding skills for prompt engineering?",
        a: "You don't need coding for basic work with text and image models. Clear output definitions, source checking, and careful review matter more. Programming becomes relevant for technical workflows, APIs, and automation.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
