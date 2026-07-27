import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-27";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/build-website-with-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Нейросеть для создания сайтов: сборка и проверка макета лендинга",
};

const COVER_EN = {
  src: "/blog/build-website-with-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Build a website with AI: assembling and reviewing a landing page",
};

const ru: BlogPostLocale = {
  slug: "build-website-with-ai",
  title: "Нейросеть для создания сайтов: лендинг от идеи до публикации",
  excerpt:
    "Как создать сайт с нейросетью: подготовить задачу, написать промпт для лендинга, собрать макет и проверить мобильную версию, форму и скорость.",
  description:
    "Как создать сайт с помощью нейросети: подготовить задачу, написать промпт для лендинга, собрать макет и проверить мобильную версию, CTA, скорость и форму.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["vibe-coding-freelance", "prompt-structure", "ai-for-work"],
  body: {
    intro:
      "Нейросеть для создания сайтов может собрать черновик лендинга, предложить структуру и написать код, но не решает за вас, кому и что продает страница. Чтобы создать сайт с нейросетью и получить рабочий результат, сначала зафиксируйте задачу, затем соберите макет, проверьте тексты, мобильную версию, форму и скорость.",
    steps: [
      {
        title: "Сформулируйте задачу до генерации сайта",
        body:
          "Создание сайтов начинается не с выбора нейросети, а с короткого ответа на четыре вопроса: кто придет на страницу, что ему предлагают, почему он должен поверить и какое действие нужно сделать. Соберите исходные факты отдельно: цену, сроки, адрес, фотографии, условия, контакты и подтверждения результата. Модель не должна додумывать их за бизнес.\n\nДля лендинга локальной услуги достаточно одного главного сценария. Например, человек ищет химчистку дивана, видит понятную цену или способ расчета, сравнивает доказательства и оставляет заявку. Если в задаче одновременно есть интернет-магазин, блог, личный кабинет и «что-нибудь современное», нейросеть потратит внимание на форму проекта, а не на этот путь.",
        before:
          "Сделай современный красивый сайт для химчистки. Добавь все нужное.",
        after:
          "Задача: одностраничный сайт химчистки мебели для жителей Екатеринбурга. Главный оффер: выезд и оценка стоимости по фото. Целевое действие: отправить фото в форму. Используй только переданные цены, районы выезда, фотографии и отзывы.",
        imageSrc: "/blog/build-website-with-ai/ru/step-1.jpg",
      },
      {
        title: "Напишите промпт для лендинга как техническое задание",
        body:
          "Чтобы создать сайт с помощью нейросети, передайте ей не пожелание о стиле, а порядок страницы. Укажите аудиторию, оффер, разделы, факты, визуальное направление, требования к телефону и запреты. Полезный промпт называет результат: один лендинг с конкретными блоками и рабочей формой, а не «лучший сайт под ключ».\n\nУчебный кейс: Алина собирала в Codex лендинг для районной химчистки. Первая фраза «сделай премиальный сайт» дала темный шаблон, выдуманные цифры и три одинаковых кнопки. Во втором запросе она зафиксировала выезд по Екатеринбургу, оценку по фото, шесть разделов, одну основную кнопку, спокойную светлую подачу и запрет придумывать цены и отзывы. Черновик стал проще, но его уже можно было сверять с задачей.\n\nПеред отправкой большой инструкции ее удобно проверить в Opten: убрать противоречия, уточнить формат результата и сохранить ограничения. Такая проверка не заменяет исходные данные, зато помогает модели не потерять важное требование внутри длинного запроса.",
        before:
          "Сделай премиальный сайт химчистки с красивыми анимациями и продающим текстом.",
        after:
          "Собери одностраничный лендинг химчистки мебели в Екатеринбурге. Аудитория: владельцы квартир с детьми и животными. Разделы: первый экран, когда нужна чистка, как проходит оценка по фото, услуги, подтверждения, форма заявки. Одна основная CTA-кнопка: «Оценить по фото». На телефоне форма и кнопка должны быть видны без горизонтальной прокрутки. Не придумывай цены, отзывы и сроки.",
        imageSrc: "/blog/build-website-with-ai/ru/step-2.jpg",
      },
      {
        title: "Собирайте макет короткими итерациями",
        body:
          "Вайб-кодинг сайтов работает спокойнее, когда каждый запрос меняет один слой. Сначала утвердите смысл и порядок блоков. Затем попросите собрать визуальную систему: ширину контейнера, типографику, цвета, кнопки и карточки. После этого подключайте форму, навигацию и адаптацию. Так проще увидеть, какая правка улучшила страницу, а какая сломала уже согласованное.\n\nНе оценивайте макет только по первому экрану. Прочитайте страницу сверху вниз: следующий блок должен отвечать на вопрос, который возник в предыдущем. Если после оффера человек думает «сколько это стоит?» или «можно ли доверять?», рядом должны появиться способ расчета и доказательства, а не еще один декоративный экран. На телефоне проверьте тот же порядок, длину заголовков и доступность основной кнопки.\n\nПосле каждой итерации открывайте сайт в браузере. Не просите одновременно переписать все тексты, поменять стиль, добавить анимацию и исправить форму. Один наблюдаемый дефект, одна инструкция, одна повторная проверка дают более предсказуемый результат.",
        before:
          "Переделай весь дизайн, сделай тексты короче, добавь анимации и улучши мобильную версию.",
        after:
          "Исправь только мобильный первый экран: заголовок должен занимать не больше четырех строк, кнопка «Оценить по фото» должна быть полностью видна, а изображение не должно создавать горизонтальную прокрутку. Остальные блоки, тексты и цвета не меняй.",
        imageSrc: "/blog/build-website-with-ai/ru/step-3.jpg",
      },
      {
        title: "Проверьте проект перед публикацией и передачей",
        body:
          "Черновик становится сайтом после проверки. Откройте страницу на узком и широком экране, нажмите каждую ссылку и кнопку, отправьте пустую и заполненную форму, проверьте сообщение об успехе и ошибке. Перечитайте текст: нет ли выдуманных фактов, разных формулировок оффера и кнопок, которые обещают действие, которого форма не выполняет. Затем проверьте вес изображений и скорость загрузки.\n\nЕсли вы хотите превратить такую работу в услугу, продавайте не «сайт, сделанный нейросетью», а ограниченный результат: лендинг, адаптация для телефона, подключенная форма, публикация и один круг правок. До старта письменно перечислите, что дает клиент, что входит в работу и кто оплачивает домен, хостинг или сторонние сервисы. Сложные платежи, аккаунты и персональные данные лучше не брать первым проектом без технической проверки.\n\nВ портфолио покажите путь: задачу, первый слабый черновик, исправленный промпт, готовый экран и чек-лист проверки. Так видно не только создание сайта, но и ваша работа с требованиями, ошибками и выпуском.",
        before:
          "Сайт выглядит готовым на ноутбуке, можно отправлять клиенту.",
        after:
          "Передача после проверки: телефон и широкий экран, тексты и CTA, ссылки и состояния формы, оптимизированные изображения, опубликованный адрес и список доступов.",
        imageSrc: "/blog/build-website-with-ai/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите лендинг внутри полного проекта",
          body:
            "На курсе вы проходите путь от задачи и визуального направления до сайта, видео и рекламных материалов, а затем проверяете, как все части работают вместе.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: путь от задачи и промпта до сайта и рекламных материалов",
          },
        },
      },
    ],
    faq: [
      {
        q: "Можно ли создать сайт с нейросетью бесплатно?",
        a:
          "Можно собрать учебный черновик на бесплатном тарифе инструмента или в пробном режиме, но публикация часто требует домена, хостинга либо платного лимита сервиса. До начала проверьте условия выбранной платформы и не обещайте клиенту постоянный бесплатный сайт.",
      },
      {
        q: "Какие данные нужны для промпта на создание сайта?",
        a:
          "Минимальный набор: аудитория, оффер, целевое действие, факты о продукте, порядок разделов, тексты или источники для них, визуальные референсы, требования к телефону и список того, что запрещено придумывать. Контакты, цены и отзывы лучше передавать отдельно и явно.",
      },
      {
        q: "Можно ли брать заказы на сайты, сделанные с помощью нейросети?",
        a:
          "Да, если вы отвечаете за рабочий результат: собираете требования, проверяете мобильную версию, ссылки, форму, скорость и публикацию. Начинайте с лендингов без платежей и аккаунтов. Клиенту важно, что сайт решает задачу и его можно поддерживать, а не каким способом написан код.",
      },
      {
        q: "Чем создание сайта с нейросетью отличается от вайб-кодинга?",
        a:
          "Создание сайта с нейросетью — широкая задача: ИИ может помочь со структурой, текстом, дизайном и кодом. Вайб-кодинг — конкретный способ собирать и менять код через диалог с моделью. В обоих случаях человеку нужно задавать требования и проверять результат.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "build-website-with-ai",
  title: "Build a website with AI: from brief to published landing page",
  excerpt:
    "Build a website with AI by defining the job, writing a landing page brief, assembling the layout, and checking mobile behavior, forms, and speed.",
  description:
    "Build a website with AI: define the job, write a landing page prompt, assemble the layout, then check mobile behavior, copy, forms, and loading speed.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["vibe-coding-freelance", "prompt-structure", "ai-for-work"],
  body: {
    intro:
      "You can build a website with AI faster than starting from an empty file, but the model can't decide who the page serves or what it should prove. A useful landing page still needs a product brief, deliberate structure, accurate copy, mobile review, working forms, and a final performance check.",
    steps: [
      {
        title: "Define the job before generating the website",
        body:
          "Website creation doesn't begin with choosing a model. It begins with four answers: who will visit, what you're offering, why they should believe it, and what they should do next. Collect source facts separately, including prices, service area, timing, photos, contact details, and proof. The model shouldn't invent them for the business.\n\nA local service landing page needs one primary path. Someone searches for sofa cleaning, sees a clear offer or pricing method, reviews the proof, and sends a request. If your request also includes a store, blog, account area, and \"something modern,\" the AI will spend its attention shaping a large project instead of making that path clear.",
        before:
          "Make a beautiful modern website for a cleaning business. Add everything it needs.",
        after:
          "Build a one-page site for an upholstery cleaning service in Yekaterinburg. Main offer: on-site service with a photo estimate. Primary action: upload a photo through the request form. Use only the supplied prices, service areas, photos, and reviews.",
        imageSrc: "/blog/build-website-with-ai/en/step-1.jpg",
      },
      {
        title: "Write the landing page prompt like a product brief",
        body:
          "To build a website with AI, give the model a page order rather than a taste preference. Include the audience, offer, sections, source facts, visual direction, mobile requirements, and constraints. A useful prompt names the output: one landing page with specific sections and a working form, not \"the best full-service website.\"\n\nTraining case: Alina used Codex to build a page for a neighborhood upholstery cleaner. Her first instruction, \"make it look premium,\" produced a dark template, invented numbers, and three competing buttons. In the second prompt she fixed the Yekaterinburg service area, photo estimate, six sections, one primary action, a calm light direction, and a ban on invented prices or testimonials. The new draft was simpler, but she could review it against a real brief.\n\nBefore sending a long instruction, you can review it in Opten to remove contradictions, clarify the requested output, and keep the constraints visible. That preflight can't replace missing business facts, but it helps the model retain the important requirement inside a detailed prompt.",
        before:
          "Make a premium cleaning website with beautiful animation and persuasive copy.",
        after:
          "Build a one-page landing page for an upholstery cleaning service in Yekaterinburg. Audience: apartment owners with children or pets. Sections: hero, when cleaning helps, photo-estimate process, services, proof, and request form. Use one primary CTA, \"Get a photo estimate.\" The form and CTA must fit mobile screens without horizontal scrolling. Don't invent prices, testimonials, or turnaround times.",
        imageSrc: "/blog/build-website-with-ai/en/step-2.jpg",
      },
      {
        title: "Assemble the layout in short iterations",
        body:
          "AI website builders and coding agents are easier to direct when each request changes one layer. Approve the message and section order first. Then build the visual system: container width, type, colors, buttons, and cards. Connect the form, navigation, and responsive behavior after that. This makes it easier to see which edit improved the page and which one broke an approved part.\n\nDon't judge the layout by the hero alone. Read from top to bottom. Each section should answer the question raised by the previous one. If the offer makes someone wonder about price or trust, the next section should provide an estimate method or proof, not another decorative scene. Review the same order on a phone, including long headings and access to the primary action.\n\nOpen the site in a browser after every iteration. Don't ask the model to rewrite all the copy, replace the visual style, add animation, and repair the form in one pass. One observed defect, one instruction, and one repeated test produce a more predictable build.",
        before:
          "Redesign everything, shorten the copy, add animation, and improve the mobile version.",
        after:
          "Fix only the mobile hero. Keep the heading to four lines or fewer, show the full \"Get a photo estimate\" button, and remove horizontal overflow from the image. Don't change the remaining sections, copy, or colors.",
        imageSrc: "/blog/build-website-with-ai/en/step-3.jpg",
      },
      {
        title: "Review the project before publishing or handing it off",
        body:
          "A draft becomes a website after review. Open it on narrow and wide screens, click every link and button, submit empty and completed forms, and inspect the success and error states. Read the copy again for invented facts, competing versions of the offer, or buttons that promise an action the form can't complete. Then review image weight and loading speed.\n\nIf you want to sell this work, package a bounded result instead of \"a website made by AI\": one landing page, mobile adaptation, a connected form, deployment, and one revision round. State what the client supplies, what the delivery includes, and who pays for domains, hosting, or external services. Projects with payments, user accounts, or sensitive data are poor first jobs without technical review.\n\nA useful portfolio case shows the path: task, weak first draft, corrected prompt, final screen, and test checklist. That makes your work with requirements, errors, and release visible, not just the fact that an AI tool generated code.",
        before:
          "It looks finished on my laptop, so I can send it to the client.",
        after:
          "Handoff after review: phone and desktop layouts, copy and CTA, links and form states, optimized images, live URL, and an access list.",
        imageSrc: "/blog/build-website-with-ai/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build the landing page inside a complete project",
          body:
            "The course moves from the task and visual direction to a website, video, and campaign assets, then shows how to review the pieces as one system.",
          ctaLabel: "View the program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course path from a product brief and prompt to a website and campaign assets",
          },
        },
      },
    ],
    faq: [
      {
        q: "Can I build a website with AI for free?",
        a:
          "You can often build a learning draft on a free plan or trial, but publishing may require a domain, hosting, or paid usage. Check the selected platform's current terms before starting, and don't promise a client that the website will remain free to operate.",
      },
      {
        q: "What information does an AI website prompt need?",
        a:
          "Include the audience, offer, primary action, verified product facts, section order, source copy, visual references, mobile requirements, and a list of facts the model must not invent. Provide prices, contact details, and testimonials separately and label them clearly.",
      },
      {
        q: "Can I sell websites built with AI?",
        a:
          "Yes, if you own the working result: requirements, mobile behavior, links, form states, performance, deployment, and handoff. Start with landing pages that don't handle payments or accounts. Clients care that the page solves the job and can be maintained, not how the code was produced.",
      },
      {
        q: "Is building an app with AI the same as building a landing page?",
        a:
          "No. A landing page mainly presents information and collects an action, while an app may manage accounts, permissions, payments, and stored data. You can build an app with AI, but those systems require deeper testing, security review, and ongoing operations than a first marketing page.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
