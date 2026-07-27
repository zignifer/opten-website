import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-27";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/vibe-coding-freelance/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Архитектурная мастерская сайта для статьи про вайб-кодинг",
};

const COVER_EN = {
  src: "/blog/vibe-coding-freelance/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Architectural website workshop for a guide to vibe coding",
};

const ru: BlogPostLocale = {
  slug: "vibe-coding-freelance",
  title: "Вайб-кодинг: как создать сайт с нейросетью и взять заказ",
  excerpt:
    "Вайб-кодинг помогает создать сайт с нейросетью, но заказ оплачивают не за код сам по себе. Разбираем ТЗ, сборку, проверку и передачу лендинга клиенту.",
  description:
    "Вайб-кодинг для фриланса: как создать сайт с нейросетью, написать понятное ТЗ, проверить мобильную версию и упаковать лендинг как услугу для клиента.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "ai-for-work", "ai-training-beginners"],
  body: {
    intro:
      "Вайб-кодинг - это способ собирать сайты и приложения через диалог с ИИ: вы описываете задачу, проверяете результат и уточняете требования, а модель меняет код. Для первого проекта этого достаточно, только если человек отвечает за смысл, дизайн, мобильную версию, формы, ошибки и публикацию. ИИ ускоряет сборку, но не принимает проект за вас.",
    steps: [
      {
        title: "Выберите одну задачу, которую можно проверить",
        body:
          "Начинать вайбкодинг лучше не с идеи «сделать большой сервис», а с небольшого результата, который можно открыть и проверить. Подойдут лендинг услуги, страница мероприятия, портфолио, простой каталог без оплаты или внутренний калькулятор. У такой задачи понятен конец: страница открывается, текст читается, кнопка ведет куда нужно, форма показывает ожидаемое состояние, а мобильная версия не разваливается.\n\nСложный личный кабинет, платежи, разные роли пользователей и хранение чувствительных данных требуют отдельной разработки и проверки безопасности. Для первого заказа это плохой способ учиться на ошибках. Небольшой сайт полезнее: на нем видно, умеете ли вы собрать требования, довести макет до рабочего состояния и спокойно передать результат.",
        before:
          "Хочу научиться делать любые сайты с ИИ и сразу брать большие проекты.",
        after:
          "Первый проект: одностраничный сайт услуги без оплаты и личного кабинета. Проверяю текст, ссылки, форму, мобильную версию и публикацию.",
        imageSrc: "/blog/vibe-coding-freelance/ru/step-1.jpg",
      },
      {
        title: "Превратите идею в техническое задание для ИИ",
        body:
          "Запрос «сделай сайт для кофейни» оставляет модели все решения: для кого страница, что продаем, какие нужны блоки, куда ведет кнопка и какие факты нельзя выдумывать. Получается аккуратный, но безликий шаблон. Чтобы создать сайт с нейросетью, сначала опишите результат так, как объясняли бы его дизайнеру и разработчику.\n\nУчебный кейс: Марина собирала в Codex лендинг небольшой кофейни. Первый запрос дал общие слова, стоковые отзывы и меню, которого не было в исходниках. Во второй версии она указала аудиторию района, предложение с завтраками до 12:00, шесть блоков страницы, кнопку построения маршрута, спокойный визуальный стиль, мобильную версию и запрет придумывать цены, отзывы и позиции меню. Codex пересобрал структуру, и черновик уже можно было проверять по конкретному ТЗ, а не по ощущению «нравится или нет».",
        before:
          "Сделай красивый современный сайт для кофейни. Добавь все нужные блоки.",
        after:
          "Собери одностраничный сайт районной кофейни. Аудитория: жители рядом и гости по пути на работу. Главный оффер: завтраки до 12:00. Блоки: первый экран, преимущества, три категории меню без выдуманных позиций, фотографии, адрес с кнопкой маршрута, контакты. Спокойная теплая палитра, крупный текст, адаптация для телефона. Не придумывай цены, отзывы и факты.",
        imageSrc: "/blog/vibe-coding-freelance/ru/step-2.jpg",
      },
      {
        title: "Собирайте сайт короткими циклами и проверяйте каждый",
        body:
          "Рабочий процесс короче, когда ИИ меняет один слой за раз. Сначала утвердите структуру и тексты. Затем соберите внешний вид. После этого подключите действия: ссылки, форму, меню, состояния кнопок. В конце проверьте телефон, планшет и широкий экран. Если одновременно попросить сменить стиль, переписать весь текст и починить форму, будет трудно понять, какая правка сломала страницу.\n\nПосле каждого цикла открывайте сайт сами. Нажмите все кнопки, отправьте пустую и заполненную форму, проверьте длинные заголовки, изображения и горизонтальную прокрутку. Затем попросите ИИ исправить одну найденную проблему и повторите проверку. Вайб-кодинг экономит время на сборке, но качество появляется в этом коротком цикле: изменение, просмотр, тест, следующая правка.",
        before:
          "Поменяй дизайн, перепиши текст, добавь анимации и заодно почини форму.",
        after:
          "Сейчас исправь только мобильное меню: оно должно открываться по кнопке, закрываться после перехода и не сдвигать страницу. Остальной дизайн и тексты не меняй.",
        imageSrc: "/blog/vibe-coding-freelance/ru/step-3.jpg",
      },
      {
        title: "Упакуйте лендинг как понятную первую услугу",
        body:
          "Клиенту нужен не «вайб-кодинг», а решенная задача. Поэтому первая услуга должна описывать результат и границы: одностраничный сайт, согласованная структура, адаптация под телефон, подключенная форма, базовая публикация и один круг правок. Отдельно перечислите, что клиент передает до старта: факты о продукте, цены, фотографии, контакты и доступы.\n\nВ портфолио показывайте не только финальный экран. Добавьте исходную задачу, техническое задание, первую ошибку, вашу правку и короткий список проверок. Так видно, за что вы отвечали. Курсы по вайб-кодингу и обучение работе с ИИ полезны, если доводят до такого проекта, а не заканчиваются демонстрацией инструмента. Начните с узкого лендинга и расширяйте услугу после нескольких спокойных передач.",
        before:
          "Сделаю любой сайт под ключ с помощью ИИ.",
        after:
          "Соберу одностраничный сайт услуги: структура, адаптация для телефона, форма, публикация и один круг правок. Контент и доступы клиент передает до старта.",
        imageSrc: "/blog/vibe-coding-freelance/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите сайт как часть полного проекта",
          body:
            "На курсе вы проходите путь от технического задания и визуального стиля до лендинга, видео и рекламных материалов, а затем проверяете, как все части работают вместе.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: путь от промпта до сайта и рекламных материалов",
          },
        },
      },
    ],
    faq: [
      {
        q: "Что такое вайб-кодинг простыми словами?",
        a:
          "Это способ создавать сайт или приложение через диалог с ИИ. Вы описываете задачу обычным языком, модель пишет или меняет код, а вы смотрите результат, тестируете его и уточняете требования. Ответственность за смысл, ошибки и публикацию остается у человека.",
      },
      {
        q: "Можно ли брать заказы с вайб-кодингом?",
        a:
          "Можно начинать с небольших задач с понятными границами: лендинг, портфолио или страница мероприятия. Не обещайте сложный сервис, если не умеете проверять авторизацию, платежи, данные и безопасность. Клиент платит за рабочий результат и аккуратную передачу, а не за способ написания кода.",
      },
      {
        q: "Какие инструменты нужны для вайб-кодинга?",
        a:
          "Нужен ИИ-инструмент, который работает с кодом, редактор проекта, браузер для проверки и площадка для публикации. Конкретный набор вторичен. Важнее уметь дать техническое задание, увидеть ошибку, проверить разные экраны и вернуть проект в рабочее состояние.",
      },
      {
        q: "Нужно ли проходить обучение вайб-кодингу?",
        a:
          "Начать можно с одного небольшого учебного сайта. Обучение полезно, если в нем есть полный цикл: задача, техническое задание, сборка, проверка, публикация и разбор ошибок. Просмотр списка инструментов без готового проекта быстро забывается.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "vibe-coding-freelance",
  title: "Vibe coding for freelance work: build and sell a first site",
  excerpt:
    "Vibe coding can speed up a first website, but clients pay for the result. Learn how to scope, brief, test, publish, and hand off a small landing page.",
  description:
    "Use vibe coding for freelance website work: choose a safe first project, write a useful brief, test the mobile build, and package a landing page service.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "ai-for-work", "ai-training-beginners"],
  body: {
    intro:
      "Vibe coding is a way to build websites and apps through a conversation with AI: you describe the job, inspect the result, and refine the instructions while the model changes the code. It works for a first project only when a person still owns the content, design judgment, mobile behavior, testing, and release.",
    steps: [
      {
        title: "Choose one result you can actually test",
        body:
          "Don't start with a large platform because the tool makes it look possible. Start with an outcome you can open and inspect: a service landing page, event page, portfolio, simple catalog without checkout, or an internal calculator. The finish line should be visible. The copy is readable, links go to the right place, the form handles expected states, and the mobile page doesn't fall apart.\n\nAccounts, payments, user roles, and sensitive data add security and operational work that a beginner may not know how to review. They're poor first freelance experiments. A small site is more useful because it reveals whether you can collect requirements, turn a layout into a working page, test it, and hand it off without hiding behind the AI tool.",
        before:
          "I want to build any kind of website with AI and start selling large projects.",
        after:
          "First project: a one-page service site without checkout or accounts. I will test the copy, links, form states, mobile layout, and published URL.",
        imageSrc: "/blog/vibe-coding-freelance/en/step-1.jpg",
      },
      {
        title: "Turn the idea into a brief the coding agent can use",
        body:
          "A request like \"make a website for a coffee shop\" pushes every decision onto the model: audience, offer, sections, call to action, and facts. The result may look polished but still feel interchangeable. A useful vibe coding prompt reads more like a short product and design brief than a wish for a pretty page.\n\nTraining case: Marina used Codex to assemble a landing page for a neighborhood coffee shop. Her first request produced generic copy, invented reviews, and menu items that weren't in the source material. She revised the brief with the local audience, breakfast offer before noon, six page sections, a directions button, a calm visual direction, mobile requirements, and a ban on invented prices, reviews, or menu items. Codex rebuilt the structure into a draft she could evaluate against a real spec instead of asking whether it simply looked nice.",
        before:
          "Build a beautiful modern website for a coffee shop. Add everything it needs.",
        after:
          "Build a one-page site for a neighborhood coffee shop. Audience: nearby residents and commuters. Main offer: breakfast before noon. Sections: hero, benefits, three menu categories using only supplied items, photos, address with directions button, and contact details. Use a warm restrained palette, large readable type, and a mobile layout. Do not invent prices, reviews, or facts.",
        imageSrc: "/blog/vibe-coding-freelance/en/step-2.jpg",
      },
      {
        title: "Build in short loops and test each one",
        body:
          "The workflow stays manageable when the agent changes one layer at a time. Approve the structure and copy first. Build the visual system next. Then connect behavior: links, forms, navigation, and button states. Finally, check phone, tablet, and wide screens. If you request a redesign, a full rewrite, new animation, and a form fix together, you won't know which edit broke the page.\n\nOpen the site yourself after every loop. Click each action, submit empty and filled forms, test long headings, inspect images, and look for horizontal scrolling. Then ask the agent to repair one observed problem and run the check again. Vibe coding saves build time, but reliability comes from this rhythm: change, inspect, test, revise.",
        before:
          "Change the style, rewrite all copy, add animation, and fix the form too.",
        after:
          "Fix only the mobile menu. It must open from the menu button, close after navigation, and never shift the page. Keep the current design and copy unchanged.",
        imageSrc: "/blog/vibe-coding-freelance/en/step-3.jpg",
      },
      {
        title: "Package the landing page as a clear first service",
        body:
          "A client isn't buying vibe coding. They're buying a solved job. Describe the outcome and the boundary: one-page site, approved structure, mobile adaptation, connected form, basic deployment, and one revision round. List what the client must provide before work starts, including product facts, prices, images, contact details, and access.\n\nShow more than the final screenshot in your portfolio. Include the original task, your brief, the first failure, the correction, and a short test list. That makes your contribution visible. Vibe coding courses and training are useful when they end with this kind of finished project, not a tour of tools. Start with a narrow landing page offer and expand the service after a few calm handoffs.",
        before:
          "I can build any website from start to finish with AI.",
        after:
          "I deliver a one-page service site with structure, mobile adaptation, a working form, deployment, and one revision round. The client provides final content and access before work begins.",
        imageSrc: "/blog/vibe-coding-freelance/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build the website as part of a complete project",
          body:
            "The course moves from briefing and visual direction to a landing page, video, and campaign materials, then shows how to review the pieces as one system.",
          ctaLabel: "View the program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course path from a prompt to a website and campaign assets",
          },
        },
      },
    ],
    faq: [
      {
        q: "What is vibe coding?",
        a:
          "Vibe coding means building a website or application by describing changes to an AI coding tool in natural language. The tool writes or edits code while you inspect the output, test behavior, and refine the request. The person still owns the decisions, errors, and release.",
      },
      {
        q: "Can I use vibe coding for freelance projects?",
        a:
          "Start with small projects that have clear boundaries, such as a landing page, portfolio, or event page. Don't promise a complex product unless you can review authentication, payments, data handling, and security. Clients pay for a working result and a clean handoff, not the way the code was produced.",
      },
      {
        q: "Which vibe coding tools do I need?",
        a:
          "You need an AI coding tool, a project editor, a browser for testing, and a place to deploy the site. The brand matters less than your ability to write a useful brief, identify a failure, test different screens, and restore the project when an edit goes wrong.",
      },
      {
        q: "Do I need a vibe coding course?",
        a:
          "You can begin with one small training site. A course is useful when it covers the whole cycle: scope, brief, build, testing, deployment, and error review. A tool tour without a finished project is much harder to turn into a freelance service.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
