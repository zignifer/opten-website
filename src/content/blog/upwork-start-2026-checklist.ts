import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-19";
const SLUG = "upwork-start-2026-checklist";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: `/blog/${SLUG}/cover.jpg`,
  width: 1600,
  height: 900,
  alt: "Открытый портфолио-кейс с сайтом, мобильным экраном и материалами проекта для старта на Upwork",
};

const COVER_EN = {
  ...COVER_RU,
  alt: "An open portfolio case with a website, mobile screen, and project materials for starting on Upwork",
};

const ARTICLE_HERO_RU = {
  src: `/blog/${SLUG}/ru/article-hero.jpg`,
  width: 1600,
  height: 1600,
  alt: "Чек-лист старта на Upwork: отклики, профиль, LinkedIn, каталог и отзывы",
};

const ARTICLE_HERO_EN = {
  src: `/blog/${SLUG}/en/article-hero.jpg`,
  width: 1600,
  height: 1600,
  alt: "Upwork launch checklist covering proposals, profile, LinkedIn, catalog, and reviews",
};

const ru: BlogPostLocale = {
  slug: SLUG,
  title: "Как начать работать на Upwork с нуля в 2026 году: подробный чек-лист",
  excerpt:
    "Как собрать профиль Upwork, выбрать первые проекты, не сливать Connects, писать точечные отклики и привести клиентов через LinkedIn и Project Catalog.",
  description:
    "Как начать на Upwork с нуля: профиль, портфолио, первые проекты, Connects, отклики, LinkedIn, Project Catalog и понятная система поиска первых клиентов.",
  category: "guide",
  tags: ["workflow"],
  cover: COVER_RU,
  articleHero: ARTICLE_HERO_RU,
  readingTimeMin: 18,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-training-beginners", "ai-for-work"],
  editorialLayout: "upwork-start",
  body: {
    intro:
      "Начать работать на Upwork с нуля проще не через массовые отклики, а через одну понятную услугу, узкое портфолио и фильтр проектов до расхода Connects. Первые небольшие оплачиваемые контракты дают историю и отзывы, а LinkedIn и Project Catalog постепенно добавляют входящий трафик.",
    steps: [
      {
        title: "Выберите одну услугу",
        body:
          "Опишите один результат для конкретного типа клиента. Заголовок, навыки и портфолио должны поддерживать эту услугу, а не собирать все профессии в одну строку.",
        imageSrc: "/blog/upwork-start-2026-checklist/ru/step-1.jpg",
      },
      {
        title: "Соберите профиль и 3-5 релевантных кейсов",
        body:
          "Покажите задачу, ограничения, свой вклад, процесс и финальный результат. Если клиентских работ нет, используйте честно подписанные Concept Project, Personal Project или Redesign Concept.",
        imageSrc: "/blog/upwork-start-2026-checklist/ru/step-4.jpg",
      },
      {
        title: "Отбирайте маленькие оплачиваемые задачи",
        body:
          "Начните с короткого понятного scope. До расхода Connects проверьте совпадение навыка, бюджет, историю клиента, активность вакансии, релевантный кейс и вопрос, который можно задать по задаче.",
        imageSrc: "/blog/upwork-start-2026-checklist/ru/step-2.jpg",
      },
      {
        title: "Пишите отклик под конкретный проект",
        body:
          "Первые строки должны относиться к задаче клиента. Объясните, что сделаете, какой результат передадите, приложите один близкий кейс и закончите одним конкретным вопросом.",
      },
      {
        title: "Подключите LinkedIn и Project Catalog",
        body:
          "Не оставайтесь зависимыми только от платных откликов. Ведите внешний трафик на профиль или отдельную услугу, а каждую неделю смотрите, на каком шаге ломается путь от просмотра до контракта.",
        imageSrc: "/blog/upwork-start-2026-checklist/ru/step-3.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите полный проект для портфолио",
          body: "На курсе вы упакуете бренд, контент, сайт и рекламные материалы в один связный кейс, который можно честно показать клиенту.",
          ctaLabel: "Посмотреть курс",
          href: COURSE_URL,
          image: { src: "/blog/_banners/course-nova-brand.jpg", width: 1600, height: 560, alt: "Курс Opten: полный AI-проект для портфолио" },
        },
      },
    ],
    faq: [
      {
        q: "Можно ли начать на Upwork без опыта внутри платформы?",
        a: "Да. Покажите релевантные работы вне Upwork или честно обозначенные концепты, выберите небольшую оплачиваемую задачу и зафиксируйте понятный scope. Не придумывайте клиентов, результаты и отзывы.",
      },
      {
        q: "Какие проекты лучше брать новичку?",
        a: "Подойдут задачи с коротким циклом и проверяемым результатом: аудит одной страницы, дизайн секции, мобильная адаптация, перенос одной страницы, исправление конкретной ошибки или небольшой технический аудит.",
      },
      {
        q: "Стоит ли сразу покупать boost для отклика?",
        a: "Не автоматически. Сначала проверьте совпадение с задачей, первые строки отклика, релевантный кейс и профиль клиента. Дополнительные Connects не исправят слабое предложение.",
      },
      {
        q: "Можно ли сделать работу бесплатно ради первого отзыва?",
        a: "Нет. Upwork запрещает feedback building. Отзыв должен относиться к реальной оплачиваемой работе и оставаться независимым. После сдачи результата можно спокойно попросить честную оценку.",
      },
      {
        q: "Когда появятся входящие заявки?",
        a: "Универсального порога нет. На видимость влияют заполненный профиль, релевантные навыки, история контрактов, отзывы, Job Success Score, активность, Project Catalog и другие сигналы доверия.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: SLUG,
  title: "How to start on Upwork from scratch in 2026: the complete checklist",
  excerpt:
    "Build an Upwork profile, choose early projects, protect your Connects, write focused proposals, and bring clients through LinkedIn and Project Catalog.",
  description:
    "How to start on Upwork from scratch: profile, portfolio, first projects, Connects, proposals, LinkedIn, Project Catalog, and a practical client-search system.",
  category: "guide",
  tags: ru.tags,
  cover: COVER_EN,
  articleHero: ARTICLE_HERO_EN,
  readingTimeMin: 18,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  editorialLayout: "upwork-start",
  body: {
    intro:
      "Starting on Upwork from scratch works better when you build one clear service, a focused portfolio, and a project filter before spending Connects. Small paid contracts create real history and reviews, while LinkedIn and Project Catalog gradually add inbound traffic.",
    steps: [
      {
        title: "Choose one clear service",
        body:
          "Describe one outcome for a specific client. Your headline, skills, and portfolio should support that service instead of listing every profession you have tried.",
        imageSrc: "/blog/upwork-start-2026-checklist/en/step-1.jpg",
      },
      {
        title: "Build a complete profile and 3-5 relevant cases",
        body:
          "Show the brief, constraints, your contribution, process, and final result. If you have no client work yet, publish clearly labeled Concept Projects, Personal Projects, or Redesign Concepts.",
        imageSrc: "/blog/upwork-start-2026-checklist/en/step-4.jpg",
      },
      {
        title: "Filter for small paid projects",
        body:
          "Start with a short, testable scope. Before spending Connects, check skill fit, budget, client history, job activity, your relevant case, and the question you can ask about the work.",
        imageSrc: "/blog/upwork-start-2026-checklist/en/step-2.jpg",
      },
      {
        title: "Write a proposal for the specific job",
        body:
          "Open with the client's task. Explain what you will do, what you will deliver, attach one closely related case, and finish with one concrete question.",
      },
      {
        title: "Add LinkedIn and Project Catalog",
        body:
          "Do not depend only on paid proposals. Send external traffic to your profile or a packaged service, then review the numbers weekly to find where the path to a contract breaks.",
        imageSrc: "/blog/upwork-start-2026-checklist/en/step-3.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build a complete project for your portfolio",
          body: "The course packages a brand, content, website, and campaign assets into one coherent case you can honestly show a client.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: { src: "/blog/_banners/course-nova-brand.jpg", width: 1600, height: 560, alt: "Opten course: a complete AI project for a portfolio" },
        },
      },
    ],
    faq: [
      {
        q: "Can I start on Upwork without platform history?",
        a: "Yes. Show relevant work completed elsewhere or honestly labeled concepts, choose a small paid task, and agree on a clear scope. Never invent clients, outcomes, or reviews.",
      },
      {
        q: "Which projects are best for a beginner?",
        a: "Look for short projects with a testable result: a one-page audit, one website section, a mobile adaptation, one-page implementation, a specific bug fix, or a focused technical review.",
      },
      {
        q: "Should I boost proposals immediately?",
        a: "Not by default. Check the fit, opening lines, relevant proof, and client profile first. Extra Connects do not repair a weak proposal.",
      },
      {
        q: "Can I work for free to get my first review?",
        a: "No. Upwork prohibits feedback building. Reviews must relate to real paid work and remain independent. After delivery, you can politely ask for an honest review.",
      },
      {
        q: "When will inbound invitations start?",
        a: "There is no universal threshold. Visibility depends on profile completeness, relevant skills, contract history, reviews, Job Success Score, activity, Project Catalog performance, and other trust signals.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
