import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-08-06";
const SLUG = "seo-pipeline-wordstat-codex";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: `/blog/${SLUG}/cover.jpg`,
  width: 1672,
  height: 941,
  alt: "SEO-конвейер от сбора спроса в Wordstat до статьи, проверки и публикации",
};

const COVER_EN = {
  ...COVER_RU,
  alt: "SEO pipeline from Wordstat demand research to an article, review, and publication",
};

const ru: BlogPostLocale = {
  slug: SLUG,
  title: "Как настроить автоматизацию SEO-статей с Wordstat и Codex",
  excerpt:
    "Пошаговая настройка SEO-конвейера без опыта в коде: Wordstat собирает спрос, единый реестр хранит темы, а Codex создаёт и проверяет статьи на сайте.",
  description:
    "Как настроить SEO-конвейер без опыта в коде: Wordstat, реестр тем, брифы, Codex, проверка и публикация статей на сайте без лишних папок и с ручным контролем.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 14,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["build-website-with-ai", "ai-text-for-work"],
  editorialLayout: "seo-automation",
  body: {
    intro:
      "Автоматизация SEO-статей связывает Wordstat, единый реестр тем, проектные правила и Codex в управляемый конвейер по правилам вашего бизнеса. Человек выбирает тему и подтверждает публикацию, а система собирает спрос, готовит бриф, пишет обе языковые версии, проверяет факты, изображения, ссылки и сборку сайта.",
    steps: [
      {
        title: "Подключите Wordstat и соберите реальный поисковый спрос",
        body:
          "Создайте аккаунт Yandex Cloud, сервисный аккаунт и API-ключ по официальным инструкциям. Ключ храните только в секретном хранилище, а не в переписке или файлах сайта. Начните с 5-10 фраз вашей ниши. Wordstat показывает частотность запросов, но не число покупателей, заказов или продаж.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/ru/frame-1.jpg",
      },
      {
        title: "Ведите один реестр тем вместо папок на каждую неделю",
        body:
          "Каждая идея получает поисковый запрос, намерение, будущий адрес страницы, язык, источник и статус. Очередь, отложенные и опубликованные темы живут в одном файле. Так система видит дубли, не пишет две статьи под один запрос и продолжает работу после перезапуска.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/ru/frame-2.jpg",
      },
      {
        title: "Опишите бизнес и правила сайта один раз",
        body:
          "Заполните бриф: что продаёт компания, кому, в каком регионе, какие услуги приоритетны, какие утверждения нельзя делать и куда вести читателя. Отдельно зафиксируйте структуру сайта, тон, требования к изображениям, SEO-поля, команду сборки и способ публикации.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/ru/frame-3.jpg",
      },
      {
        title: "Запускайте одну статью одной понятной командой",
        body:
          "Команда «Напиши SEO-статью» берёт следующую подтверждённую тему, собирает бриф и создаёт ровно одну статью. Автоматизация не должна бесконтрольно публиковать десятки текстов: сначала человек проверяет тему, факты и результат, затем разрешает отправку на сайт.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/ru/frame-4.jpg",
      },
      {
        title: "Начните с пилота и проверяйте публикацию",
        body:
          "Для первого запуска достаточно одного сайта, 5-10 начальных фраз, трёх тем и одной статьи. Проверьте мобильную версию, метаданные, схемы, ссылки, изображения, сборку и живой адрес. После этого расширяйте очередь и только затем обсуждайте расписание.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/ru/frame-5.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите контент-систему на реальном проекте",
          body:
            "На курсе вы пройдёте путь от задачи и промптов до текстов, визуалов, сайта и готовых материалов для продвижения.",
          ctaLabel: "Посмотреть программу курса",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс Opten о создании связной системы AI-контента",
          },
        },
      },
    ],
    faq: [
      {
        q: "Нужно ли уметь программировать, чтобы настроить такой конвейер?",
        a:
          "Нет. Нужно уметь устанавливать программы по инструкции, входить в аккаунты и отвечать на вопросы о своём бизнесе. Codex может проверить структуру проекта и внести изменения. Важные действия, платежи, секретные ключи и публикацию подтверждает владелец.",
      },
      {
        q: "Можно ли использовать систему в любой нише?",
        a:
          "Да. Меняются начальные запросы, бизнес-бриф, ограничения и источники. Сама логика остаётся прежней: спрос, кластеризация, реестр, бриф, статья, проверка и публикация. Для медицинских, юридических и финансовых тем нужен усиленный экспертный контроль.",
      },
      {
        q: "Wordstat показывает количество клиентов?",
        a:
          "Нет. Частотность Wordstat отражает показы запросов за период, а не уникальных людей, покупателей, заявок или продаж. Используйте её как сигнал спроса и сравнивайте темы с бизнес-приоритетом и данными сайта.",
      },
      {
        q: "Можно ли сразу включить полностью автоматическую публикацию?",
        a:
          "Технически можно, но для старта это плохая идея. Оставьте ручное подтверждение темы, фактов и публикации. Автоматизируйте повторяемые шаги, а не ответственность за точность, права на материалы и соответствие бизнесу.",
      },
      {
        q: "Что находится в наборе для скачивания?",
        a:
          "В архиве есть бриф о бизнесе, шаблон реестра тем, инструкция первой настройки и чек-лист проверки статьи. Файлы доступны на русском и английском и открываются в обычном текстовом редакторе или таблице.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: SLUG,
  title: "How to automate SEO articles with Wordstat and Codex",
  excerpt:
    "Set up a beginner-friendly SEO pipeline: Wordstat captures demand, one registry controls topics, and Codex drafts, checks, and publishes site articles.",
  description:
    "Set up an SEO article pipeline without coding: Wordstat research, a topic registry, reusable briefs, Codex drafting, checks, and controlled publishing.",
  category: "guide",
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 13,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  editorialLayout: "seo-automation",
  body: {
    intro:
      "An SEO article automation connects Wordstat, one topic registry, project rules, and Codex in a controlled pipeline. A person approves the topic and publication, while the system collects demand, prepares the brief, drafts both language versions, and checks facts, images, links, metadata, and the website build.",
    steps: [
      {
        title: "Connect Wordstat and collect real search demand",
        body:
          "Create a Yandex Cloud account, service account, and API key by following the official documentation. Keep the key in a secret store, never in chat or website files. Begin with 5-10 phrases from your market. Wordstat reports query impressions, not buyers, orders, or sales.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/en/frame-1.jpg",
      },
      {
        title: "Keep one topic registry instead of weekly folders",
        body:
          "Every idea gets a query, intent, future page address, language, source, and status. Queued, deferred, and published topics stay in one file. This lets the system spot duplicates, avoid two pages for the same intent, and continue safely after a restart.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/en/frame-2.jpg",
      },
      {
        title: "Describe the business and website rules once",
        body:
          "Complete a brief covering the offer, audience, region, priority services, forbidden claims, and reader destination. Record the site structure, voice, image requirements, SEO fields, build command, and publishing method separately. Codex can reuse these constraints for every topic.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/en/frame-3.jpg",
      },
      {
        title: "Run one article with one plain-language command",
        body:
          "The command “Write an SEO article” selects the next approved topic, assembles its brief, and creates exactly one article. The pipeline should not publish dozens of drafts without supervision. A person reviews the topic, claims, and result before allowing a live update.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/en/frame-4.jpg",
      },
      {
        title: "Start with a pilot and verify the live page",
        body:
          "For a first run, use one website, 5-10 seed phrases, three topics, and one article. Check the mobile layout, metadata, schema, links, images, build, and live URL. Expand the queue only after that works, then consider a schedule.",
        imageSrc: "/blog/seo-pipeline-wordstat-codex/en/frame-5.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build a content system around a real project",
          body:
            "The course takes you from a clear task and prompts to copy, visuals, a website, and promotion-ready project materials.",
          ctaLabel: "View the course program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Opten course about building a connected AI content system",
          },
        },
      },
    ],
    faq: [
      {
        q: "Do I need coding skills to set up this pipeline?",
        a:
          "No. You need to install applications from instructions, sign in to accounts, and answer questions about the business. Codex can inspect the project and make scoped changes. The owner still approves payments, secret handling, important actions, and publication.",
      },
      {
        q: "Can the system work in any industry?",
        a:
          "Yes. The seed phrases, business brief, restrictions, and sources change, but the flow stays the same: demand, clustering, registry, brief, article, review, and publication. Medical, legal, and financial topics need stronger expert review.",
      },
      {
        q: "Does Wordstat report the number of customers?",
        a:
          "No. Wordstat frequency represents query impressions for a period, not unique people, buyers, leads, or sales. Treat it as a demand signal and compare it with business priorities and your own website data.",
      },
      {
        q: "Can I enable fully automatic publishing immediately?",
        a:
          "It is technically possible, but it is not a sensible starting point. Keep manual approval for the topic, claims, and publication. Automate repetitive work, not responsibility for accuracy, rights, or business fit.",
      },
      {
        q: "What is included in the downloadable starter kit?",
        a:
          "The ZIP contains a business brief, topic registry template, first-run guide, and article review checklist. Russian and English versions are included, and the files open in a regular text editor or spreadsheet app.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
