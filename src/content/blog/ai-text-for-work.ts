import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-25";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-text-for-work/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Нейросети для текста: редакционный стол с черновиками и правками",
};
const COVER_EN = {
  ...COVER_RU,
  alt: "AI writing workflow shown as an editorial desk with drafts and revisions",
};

const ru: BlogPostLocale = {
  slug: "ai-text-for-work",
  title: "Нейросети для текста: как писать быстрее без шаблонного мусора",
  excerpt:
    "Нейросети для текста ускоряют посты, письма и лендинги. Рабочая нейросеть для написания текста получает аудиторию, формат, примеры и запреты.",
  description:
    "Нейросети для текста: как собрать промпт для поста, письма или лендинга, убрать шаблонный ИИ-ритм и вручную проверить черновик перед публикацией.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "prompt-examples", "ai-for-work"],
  body: {
    intro:
      "Нейросети для текста ускоряют письма, посты, сценарии, карточки товаров и блоки лендинга, но не заменяют редактора. Чтобы черновик был полезным, модели нужны аудитория, задача, исходные факты, формат, тон, примеры и запреты. Без этого она заполняет пробелы усредненными фразами, которые звучат уверенно, но ничего не говорят.",
    steps: [
      {
        title: "Определите рабочую задачу и формат текста",
        body:
          "Нейросеть для генерации текста хорошо начинает работу там, где есть понятный результат: ответ клиенту, письмо с итогами встречи, блок лендинга, описание товара, сценарий короткого видео или пост для канала. Сначала назовите документ и его функцию. «Напиши о продукте» не объясняет, нужно ли познакомить, убедить, снять возражение или получить ответ.\n\nДобавьте аудиторию и ситуацию чтения. Руководителю нужен короткий вывод и решение, новому клиенту — контекст без внутреннего жаргона, подписчику канала — один полезный тезис вместо пресс-релиза. Укажите длину и форму ответа: пять абзацев, таблица, письмо с темой или сценарий по сценам. Так первая генерация становится материалом для работы, а не угадыванием жанра.",
        before: "Напиши текст о нашем сервисе.",
        after:
          "Напиши первый экран лендинга для владельца небольшой интернет-магазина. Цель: показать, как сервис сокращает ручную обработку заказов, и привести к заявке на демонстрацию. Дай заголовок, подзаголовок до 20 слов и три конкретных преимущества. Не используй слова «революционный» и «инновационный».",
        imageSrc: "/blog/ai-text-for-work/ru/step-1.jpg",
      },
      {
        title: "Соберите промпт для рабочего текста из шести блоков",
        body:
          "Полезный промпт держится на шести блоках: роль модели, аудитория, контекст, исходные факты, формат и ограничения. Роль задает угол работы: редактор делового письма, сценарист короткого ролика или продуктовый копирайтер. Контекст объясняет, что произошло до текста и какое действие нужно после него. Факты ограничивают содержание тем, что вы действительно можете подтвердить.\n\nФормат задает вид ответа, а пример показывает ритм лучше десятка прилагательных. Если примера нет, опишите тон через наблюдаемое поведение: короткие предложения, без канцелярита, один тезис на абзац. В блоке «не писать» перечислите конкретные штампы, выдуманные цифры и обещания. Такая работа с нейросетями сокращает число переделок, потому что критерии качества появляются до генерации.",
        before: "Напиши профессиональное письмо клиенту в дружелюбном тоне.",
        after:
          "Роль: редактор клиентских писем. Ситуация: срок первого макета сдвигается на один рабочий день из-за поздно полученных материалов. Аудитория: маркетолог клиента. Цель: сообщить новый срок и сохранить доверие. Формат: тема письма и 3 коротких абзаца. Тон: спокойный и прямой. Не перекладывай вину и не используй канцелярит.",
        imageSrc: "/blog/ai-text-for-work/ru/step-2.jpg",
      },
      {
        title: "Исправляйте промпт, а не просите «написать лучше»",
        body:
          "Практический кейс: Марина готовила в ChatGPT пост для Telegram о сервисе учета задач. Первый запрос «напиши пост для Telegram» дал знакомый набор: риторический вопрос, общие обещания, список преимуществ и финал «попробуйте уже сегодня». В тексте не было ни конкретной ситуации, ни голоса бренда, ни причины дочитать его.\n\nМарина переписала промпт: указала владельцев небольших агентств, проблему потерянных договоренностей, три функции сервиса, тезис о еженедельном разборе задач, длину до 900 знаков и запрет на риторические вопросы. В качестве примера добавила прежний пост с короткими абзацами. ChatGPT вернул спокойный черновик вокруг одной рабочей ситуации; Марине осталось проверить факты и переписать два перехода. Opten здесь помогает проверить и раскрыть расплывчатый запрос до отправки модели.",
        before: "Напиши пост для Telegram и сделай его более живым.",
        after:
          "Напиши пост до 900 знаков для владельцев агентств, которые теряют договоренности по задачам. Покажи одну ситуацию: обещание клиенту осталось в чате и не попало в план. Используй три функции сервиса из фактов ниже. Стиль — как в примере: короткие абзацы, спокойный тон. Без риторических вопросов, восклицаний и фразы «попробуйте уже сегодня».",
        imageSrc: "/blog/ai-text-for-work/ru/step-3.jpg",
      },
      {
        title: "Проверьте факты, голос и ритм перед публикацией",
        body:
          "Текст после генерации остается черновиком. Сначала проверьте имена, цифры, ссылки, условия продукта и любые причинно-следственные выводы. Затем прочитайте текст вслух. Повторяющиеся конструкции, одинаковая длина абзацев, лишние выводы и связки вроде «важно отметить» выдают шаблонный ИИ-ритм. Уберите то, что автор не сказал бы клиенту в обычном разговоре.\n\nПоследний проход сравнивает текст с задачей. Есть ли одно понятное действие? Достаточно ли контекста человеку, который впервые видит продукт? Можно ли сократить начало без потери смысла? Нейросети для контента ускоряют черновик, но ответственность за факты, интонацию и публикацию остается у человека. На фрилансе этот процесс можно продавать как услугу: техническое задание, промпт, редактура и адаптация под канал, а не как безликую «генерацию текстов».",
        before: "Публикую текст, если он грамотно написан и выглядит убедительно.",
        after:
          "Сверяю каждое утверждение с источником, убираю повторы и штампы, читаю текст вслух, проверяю голос бренда и одно целевое действие. Только после этого отдаю материал клиенту или публикую.",
        imageSrc: "/blog/ai-text-for-work/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Превратите ИИ-черновики в связный контент-проект",
          body:
            "На курсе вы проходите путь от технического задания и промпта до текстов, визуалов, сайта и рекламных материалов с понятной редакторской проверкой.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: процесс от промпта до готового проекта",
          },
        },
      },
    ],
    faq: [
      {
        q: "Какая нейросеть пишет тексты?",
        a:
          "ChatGPT, Claude, Gemini и другие языковые модели умеют готовить текстовые черновики. Выбирайте не по одной демонстрации, а по реальной задаче: передайте одинаковое техническое задание, сравните точность следования формату, качество русского языка и удобство редактирования.",
      },
      {
        q: "Как написать промпт для текста?",
        a:
          "Укажите роль, аудиторию, ситуацию, цель, исходные факты, формат, тон, пример и конкретные запреты. Если данных не хватает, попросите модель задать вопросы или поставить маркер, а не придумывать детали.",
      },
      {
        q: "Можно ли использовать текст нейросети без редактора?",
        a:
          "Не стоит публиковать его автоматически. Проверьте факты, ссылки, обещания, конфиденциальные данные, голос бренда и соответствие задаче. Даже аккуратный текст может содержать выдуманное утверждение или неуместную интонацию.",
      },
      {
        q: "Для каких задач подходят нейросети для контента?",
        a:
          "Они полезны для вариантов заголовков, структуры статьи, писем, постов, сценариев, описаний товаров и адаптации одного материала под разные каналы. Лучший результат получается, когда человек дает проверенные вводные и принимает финальное редакторское решение.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-text-for-work",
  title: "AI writing tools: how to get useful copy instead of generic filler",
  excerpt:
    "An AI writing tool can speed up emails, posts, landing copy, and scripts. A useful AI text generator still needs audience, context, format, examples, and limits.",
  description:
    "Use an AI writing tool for emails, posts, landing pages, and scripts: build a clear prompt, remove generic AI rhythm, and review every claim before publishing.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "prompt-examples", "ai-for-work"],
  body: {
    intro:
      "AI writing tools can speed up emails, posts, scripts, product descriptions, and landing-page copy, but they don't replace an editor. Useful drafts start with a clear audience, job, source facts, format, tone, examples, and exclusions. Without that context, an AI text generator fills the gaps with polished sentences that say very little.",
    steps: [
      {
        title: "Define the text job and its format",
        body:
          "An AI text generator works best when the deliverable is concrete: a client reply, a meeting recap, a landing-page section, a product description, a short-video script, or a channel post. Name the document and the job it must do. “Write about our product” doesn't say whether the copy should introduce, persuade, answer an objection, or earn a reply.\n\nAdd the audience and reading situation. An executive needs a short conclusion and a decision. A new customer needs context without internal jargon. A subscriber needs one useful point, not a press release. Set the output shape too: five paragraphs, a table, an email with a subject line, or a scene-by-scene script. The first generation then becomes workable material instead of a genre guess.",
        before: "Write copy about our service.",
        after:
          "Write the hero section for a small online-store owner. Goal: show how the service reduces manual order processing and lead to a demo request. Return a headline, a subhead under 20 words, and three concrete benefits. Don't use “revolutionary” or “innovative.”",
        imageSrc: "/blog/ai-text-for-work/en/step-1.jpg",
      },
      {
        title: "Build a work prompt from six clear blocks",
        body:
          "A useful prompt has six blocks: model role, audience, context, source facts, format, and constraints. The role sets the angle, such as business-email editor, short-form scriptwriter, or product copywriter. Context explains what happened before the text and what should happen after it. Source facts keep the draft inside what you can actually support.\n\nFormat defines the response, while an example communicates rhythm better than a pile of adjectives. If you don't have one, describe observable behavior: short sentences, no corporate jargon, one point per paragraph. List exact clichés, invented numbers, and promises under “avoid.” This prompt workflow cuts revision time because quality criteria exist before the model starts writing.",
        before: "Write a professional but friendly email to a client.",
        after:
          "Role: client-email editor. Situation: the first design draft moves by one business day because source materials arrived late. Audience: the client's marketing manager. Goal: confirm the new date and preserve trust. Format: subject line plus 3 short paragraphs. Tone: calm and direct. Don't assign blame or use corporate jargon.",
        imageSrc: "/blog/ai-text-for-work/en/step-2.jpg",
      },
      {
        title: "Repair the prompt instead of asking for “better writing”",
        body:
          "Marina used ChatGPT to draft a Telegram post about a task-management service. Her first request, “write a Telegram post,” returned a familiar pattern: rhetorical question, broad promises, feature list, and a “try it today” ending. The copy had no concrete situation, brand voice, or reason to keep reading.\n\nShe rebuilt the prompt around small-agency owners, the problem of lost commitments, three product functions, a weekly task-review idea, a 900-character limit, and no rhetorical questions. She added an older post as a rhythm reference. ChatGPT returned a calm draft built around one work situation; Marina only had to verify the facts and rewrite two transitions. Opten can act as a preflight here, expanding a vague request before it reaches the model.",
        before: "Write a Telegram post and make it more engaging.",
        after:
          "Write a post under 900 characters for agency owners who lose task commitments. Show one situation: a client promise stayed in chat and never reached the plan. Use the three product functions in the facts below. Match the example's short paragraphs and calm tone. No rhetorical questions, exclamation marks, or “try it today.”",
        imageSrc: "/blog/ai-text-for-work/en/step-3.jpg",
      },
      {
        title: "Review facts, voice, and rhythm before publishing",
        body:
          "Generated copy is still a draft. Check names, numbers, links, product terms, and every cause-and-effect claim first. Then read it aloud. Repeated sentence shapes, identical paragraph lengths, duplicate conclusions, and phrases like “it's important to note” create the generic AI rhythm readers recognize. Remove anything the author wouldn't say to a client in a normal conversation.\n\nThe final pass returns to the job. Is there one clear action? Does a first-time reader have enough context? Can the opening be shorter without losing meaning? AI writing tools accelerate the draft, but a person owns the facts, tone, and publishing decision. A freelancer can sell this as a service: briefing, prompting, editing, and channel adaptation, rather than anonymous “AI content generation.”",
        before: "I publish when the copy is grammatical and sounds convincing.",
        after:
          "I verify every claim against its source, cut repetition and clichés, read the copy aloud, check the brand voice, and confirm one target action. Only then do I deliver or publish it.",
        imageSrc: "/blog/ai-text-for-work/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Turn AI drafts into one coherent content project",
          body:
            "The course connects briefing and prompts with copy, visuals, a website, and campaign materials through a practical editorial review.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course workflow from prompt to finished project",
          },
        },
      },
    ],
    faq: [
      {
        q: "Which AI writing tool should I use?",
        a:
          "ChatGPT, Claude, Gemini, and other language models can all produce text drafts. Test them with the same real brief, then compare format control, factual discipline, writing quality, and how easy the output is to edit.",
      },
      {
        q: "How do I write a prompt for text?",
        a:
          "State the role, audience, situation, goal, source facts, format, tone, example, and exact exclusions. If inputs are missing, ask the model to request them or insert a marker instead of inventing details.",
      },
      {
        q: "Can I use AI-generated text without an editor?",
        a:
          "It shouldn't be published automatically. Check facts, links, promises, confidential details, brand voice, and fit for the task. Polished copy can still contain an invented claim or the wrong tone.",
      },
      {
        q: "What content tasks work well with an AI text generator?",
        a:
          "It can help with headline options, article outlines, emails, posts, scripts, product descriptions, and adapting one source into several channels. Results improve when a person supplies verified inputs and makes the final editorial decision.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
