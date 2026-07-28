import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-28";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/make-money-with-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Как заработать на нейросетях: услуга, кейсы и готовый результат для клиента",
};

const COVER_EN = {
  src: "/blog/make-money-with-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "How to make money with AI by packaging a service, portfolio cases, and a client-ready result",
};

const ru: BlogPostLocale = {
  slug: "make-money-with-ai",
  title: "Как заработать на нейросетях без инфобиза: 7 реальных направлений",
  excerpt:
    "Как заработать на нейросетях честно: выберите одну услугу, соберите три кейса и превратите работу с ИИ в проверяемый дополнительный доход от услуг.",
  description:
    "Как заработать на нейросетях без обещаний легких денег: 7 услуг, первые кейсы, проверка заявки, промптов и план выхода на дополнительный доход на практике.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 10,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-freelance-services", "ai-presentations", "ai-video-for-work"],
  body: {
    intro:
      "Чтобы понять, как заработать на нейросетях, не ищите «денежную кнопку». Дополнительный доход появляется, когда вы берете знакомую задачу, превращаете ее в небольшую услугу, показываете три честных кейса и отвечаете за проверяемый результат. ИИ ускоряет черновик, но ценность создают техническое задание, отбор, правки и ручная проверка.",
    steps: [
      {
        title: "Отделите реальный ИИ-заработок от обещаний легких денег",
        body:
          "Фраза «заработать на нейросетях» часто ведет к курсам про пассивный доход, сотни автоматических роликов и услуги «без навыков». В реальной работе платят не за доступ к модели и не за число генераций. Клиент покупает понятный итог: презентацию к встрече, пять карточек товара, черновик лендинга или короткий рекламный ролик.\n\nПоэтому ИИ-заработок безопаснее рассматривать как обычную услугу с ускоренным производством. Вам все равно нужны знания предмета, умение задать вопросы, проверить факты, отобрать сильный вариант и внести правки. Если результат нельзя описать, показать и проверить, его рано продавать.\n\nНачните с вопроса: какую задачу вы уже понимаете без нейросети? Человек, который умеет выстраивать логику, может собирать презентации. Редактор — улучшать тексты. Дизайнер — готовить визуальные черновики. Модель сокращает часть ручной работы, но не заменяет профессиональное решение.",
        before: "Хочу освоить нейросети и получать с них пассивный доход.",
        after:
          "Выберу одну знакомую задачу, опишу конкретный результат, соберу три учебных кейса и проверю спрос на небольшой платной работе.",
      },
      {
        title: "Выберите одно из семи направлений",
        body:
          "Работа с нейросетями может начинаться с семи практических направлений. Первое — презентации: структура, черновики слайдов и визуальное направление по подтвержденным материалам. Второе — тексты: редактура письма, страницы, статьи или серии публикаций. Третье — лендинги: логика страницы, прототип, черновик текста и визуальная концепция без обещания сложной разработки.\n\nЧетвертое направление — карточки товаров по готовым фото и фактам. Пятое — короткие ИИ-видео: раскадровка, запрос, несколько вариантов, отбор и подготовка к монтажу. Шестое — клиентское исследование: поиск источников, сводка и список выводов с обязательной проверкой ссылок. Седьмое — контент-пакет из одного материала, например интервью: пост, письмо, сценарий короткого ролика и тезисы для карточек.\n\nУ каждого направления есть работа за пределами ИИ. В презентациях нужно отвечать за логику, в карточках — за точность товара, в видео — за физику и монтаж, в исследовании — за источники. Выбирайте не самую модную модель, а результат, качество которого умеете оценить вручную.",
        before: "Предлагаю тексты, сайты, видео, дизайн, исследования и автоматизацию с ИИ.",
        after:
          "Первая услуга: пять карточек одного товара по готовым фото и подтвержденным фактам, два визуальных направления и один круг правок.",
      },
      {
        title: "Упакуйте навык в понятную услугу",
        body:
          "Чтобы дополнительный заработок не превратился в бесконечные переделки, зафиксируйте пять вещей: результат, исходные материалы, срок, количество вариантов и число правок. Формулировка «сделаю контент с ИИ» оставляет все открытым. Клиент и исполнитель будут по-разному понимать объем, готовность и ответственность.\n\nУслуга звучит яснее, когда ее можно пересказать одной строкой: «Соберу структуру презентации до 10 слайдов по вашим фактам, подготовлю черновики заголовков и визуальное направление, затем внесу один круг правок». Здесь есть результат и границы. Можно обсудить цену, срок и критерий завершения.\n\nОтдельно напишите, что не входит в работу. Вы не придумываете показатели бизнеса, не подтверждаете юридические обещания, не используете чужие изображения без разрешения и не подключаете технические функции, которых нет в составе услуги. Эти ограничения не ослабляют предложение, а защищают обе стороны.",
        before: "Сделаю любые материалы с помощью нейросетей быстро и под ключ.",
        after:
          "Подготовлю 5 карточек товара по вашим фото и фактам: 2 визуальных направления, выбранная серия и 1 круг правок. Тексты и свойства подтверждает клиент.",
        imageSrc: "/blog/make-money-with-ai/ru/step-1.jpg",
      },
      {
        title: "Соберите три честных кейса до поиска заказов",
        body:
          "Первое портфолио не обязано состоять из оплаченных проектов. Сделайте три учебных кейса одной услуги и явно подпишите их как учебные. Для карточек товара можно выбрать косметику, предмет интерьера и продукт питания; для презентаций — локальный бизнес, небольшую студию и внутренний отчет. Используйте собственные, открытые или специально подготовленные исходники.\n\nХороший кейс показывает не только красивый финал. Добавьте задачу, ограничения, слабый первый черновик, точное исправление запроса, готовый результат и список ручных проверок. Так клиент видит, что вы умеете замечать ошибку, а не просто сохраняете удачные генерации.\n\nТри кейса одной услуги полезнее двадцати несвязанных картинок. Они показывают повторяемость процесса: вы получаете материалы, уточняете задачу, создаете варианты, отбираете решение, проверяете его и отдаете в согласованном формате. Именно такой процесс легче оценить и купить.",
        before: "Портфолио: подборка красивых генераций без задачи и пояснений.",
        after:
          "Кейс: задача → первый черновик → одна точная правка → готовый результат → ручная проверка.",
        imageSrc: "/blog/make-money-with-ai/ru/step-2.jpg",
      },
      {
        title: "Проверяйте заявку до начала работы",
        body:
          "Даже небольшая заявка требует короткого разбора. Что клиент передает: фотографии, текст, цифры, бренд-правила? Что именно он получит? Какой срок, сколько вариантов и правок? Кто подтверждает факты и права на материалы? Если на эти вопросы нет ответа, модель начнет заполнять пробелы догадками, а исполнитель — делать лишнюю работу.\n\nНе называйте цену только по фразе «нужно пять карточек». Один клиент пришлет готовые фото и тексты, другой ожидает съемку, исследование конкурентов, написание описаний и загрузку в магазин. Сначала перечислите состав работы, затем оцените время на подготовку, генерации, ручную редактуру, переписку и экспорт.\n\nДля первой сделки подойдет небольшой платный этап: одна структура, один визуальный подход или один тестовый ролик с заранее заданными границами. Это честнее бесплатного полного проекта и помогает обеим сторонам понять, подходит ли процесс.",
        before: "Сделаю пять карточек. Присылайте товар, с ценой разберемся потом.",
        after:
          "Пришлите фото, подтвержденные свойства, пример площадки и срок. Я письменно зафиксирую 5 карточек, 2 направления, 1 круг правок и формат передачи.",
        imageSrc: "/blog/make-money-with-ai/ru/step-3.jpg",
      },
      {
        title: "Как начать зарабатывать: одна услуга, три кейса, одна заявка",
        body:
          "Разберем учебный кейс Ильи. Он выбрал услугу «пять карточек товара по готовым фото и фактам» и использовал GPT Image 2 для визуальных черновиков. Первый запрос был коротким: «Сделай премиальные карточки для сыворотки». Модель изменила форму флакона, придумала надписи на этикетке и смешала разные ракурсы. Такой результат нельзя было показывать клиенту.\n\nИлья переписал запрос: зафиксировал приложенное фото как единственный источник внешнего вида, запретил менять флакон и упаковку, перечислил подтвержденные свойства, потребовал одну функцию на карточку и пометку `[нужен факт]` вместо догадки. В следующем проходе он получил пять связанных черновиков. Затем вручную сверил форму товара, убрал неподтвержденные формулировки и собрал финальную типографику в макете.\n\nПрактический план простой: выберите одну услугу, сделайте три кейса по одной форме, покажите их знакомым предпринимателям или в профессиональном сообществе и предложите одну небольшую платную задачу. Так дополнительный заработок проверяется на реальной работе, а не на обещании дохода. Opten можно использовать перед генерацией, чтобы вернуть в промпт задачу, формат, ограничения и критерии проверки.",
        before: "Сделай премиальные карточки для сыворотки.",
        after:
          "Создай визуальный черновик 5 карточек для этой сыворотки. Используй приложенное фото как единственный источник внешнего вида. Сохрани форму флакона, крышку, этикетку и цвет. Используй только подтвержденные факты ниже; недостающие данные помечай `[нужен факт]`. Одна функция на карточку. Не добавляй новые свойства, логотипы и текст на упаковку.",
        imageSrc: "/blog/make-money-with-ai/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите портфолио на одном полном ИИ-проекте",
          body:
            "На курсе вы проходите задачу, промпты, тексты, визуалы, видео и лендинг как один связный проект с проверяемым результатом.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: путь от задачи и промпта до проекта для портфолио",
          },
        },
      },
    ],
    faq: [
      {
        q: "Можно ли заработать на нейросетях новичку?",
        a:
          "Да, если начать с небольшой услуги, результат которой вы умеете проверить вручную. Сначала сделайте три учебных кейса, опишите состав работы и возьмите ограниченную платную задачу. Не берите проекты с высокой юридической, медицинской или финансовой ответственностью без профильных знаний.",
      },
      {
        q: "Какие услуги выбрать первыми?",
        a:
          "Выберите задачу, которую уже понимаете без ИИ: презентации, редактуру текста, карточки товара, простой лендинг, короткое видео, сводку исследования или контент-пакет из одного источника. Первая услуга должна иметь небольшой объем, понятный результат и быструю ручную проверку.",
      },
      {
        q: "Сколько можно заработать на нейросетях?",
        a:
          "Гарантированной суммы нет. Доход зависит от задачи, рынка, качества, скорости, репутации, стоимости инструментов и умения находить клиентов. Считайте полный цикл работы и назначайте цену за согласованный результат, а не за число запросов к модели.",
      },
      {
        q: "Чего не обещать клиенту?",
        a:
          "Не обещайте гарантированный рост продаж, полностью автоматический результат, фактическую точность без проверки и использование любых материалов без ограничений. Письменно фиксируйте исходники, результат, срок, правки и зоны ответственности.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "make-money-with-ai",
  title: "How to make money with AI without selling hype: 7 practical paths",
  excerpt:
    "Learn how to make money with AI by packaging one useful service, building three honest cases, and turning AI-assisted work into reliable extra income.",
  description:
    "How to make money with AI through seven practical services: choose one outcome, build portfolio cases, qualify a lead, improve prompts, and review delivery.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 10,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-freelance-services", "ai-presentations", "ai-video-for-work"],
  body: {
    intro:
      "To make money with AI, don't hunt for a passive-income button. Start with a task you already understand, package it as a small service, build three honest examples, and take responsibility for a reviewable result. AI can speed up the draft; the value comes from scope, judgment, revisions, and quality control.",
    steps: [
      {
        title: "Separate real AI income from easy-money claims",
        body:
          "The phrase “make money with AI” often leads to promises of passive income, hundreds of automatic videos, and services that require “no skills.” Real clients don't pay for model access or a large generation count. They pay for a useful outcome: a meeting deck, five product cards, a landing-page draft, or a short ad clip.\n\nTreat AI income as ordinary service work with faster production. You still need domain judgment, good questions, fact checking, selection, and revisions. If you can't describe, show, and review the result, it isn't ready to sell.\n\nStart with the work you already understand without AI. Someone who can structure an argument may offer presentation drafts. An editor can improve copy. A designer can create visual directions. The model shortens parts of the process; it doesn't replace the professional decision.",
        before: "I want to learn AI and turn it into passive income.",
        after:
          "I'll choose one familiar task, define a concrete result, build three practice cases, and test demand with one small paid project.",
      },
      {
        title: "Choose one of seven practical paths",
        body:
          "Seven directions work well for a first AI-assisted service. One: presentation structure, slide drafts, and visual direction from approved materials. Two: editing an email, page, article, or content series. Three: landing-page structure, copy drafts, and a visual concept without promising complex production work.\n\nFour: product cards built from supplied photos and facts. Five: short AI video, including a storyboard, prompt, variants, selection, and preparation for editing. Six: client research with sources, a summary, and checked links. Seven: a content pack derived from one source such as an interview, including a post, email, short-video script, and card outline.\n\nEvery path includes work beyond the model. Presentations need narrative logic, product cards need item accuracy, video needs physics and editability, and research needs source review. Pick the outcome you can judge by hand, not the most fashionable tool.",
        before: "I offer AI copy, websites, video, design, research, and automation.",
        after:
          "My first service: five product cards from supplied photos and approved facts, with two visual directions and one revision round.",
      },
      {
        title: "Package the skill as a clear service",
        body:
          "To keep extra income from turning into endless rework, define five things: result, source materials, deadline, number of options, and revision rounds. “I make content with AI” leaves all of them open. The client and freelancer will imagine different scopes and different definitions of done.\n\nA service is easier to buy when it fits in one sentence: “I'll build a presentation structure of up to ten slides from your approved facts, draft the headlines and visual direction, then complete one revision round.” The output and boundaries are visible, so price and timing can be discussed.\n\nState exclusions as well. You don't invent business metrics, approve legal claims, use unlicensed images, or connect technical features outside the agreed service. Clear limits don't weaken the offer. They protect the client and the person delivering it.",
        before: "I'll make any AI content quickly and handle everything.",
        after:
          "I'll create 5 product cards from your photos and approved facts: 2 visual directions, one selected series, and 1 revision round. The client approves product claims.",
        imageSrc: "/blog/make-money-with-ai/en/step-1.jpg",
      },
      {
        title: "Build three honest cases before looking for clients",
        body:
          "Your first portfolio doesn't need to consist of paid projects. Create three practice cases for the same service and label them honestly. For product cards, you might use a cosmetic item, a home object, and a packaged food product. For presentations, try a local business, a small studio, and an internal team report. Use your own, open, or purpose-built source material.\n\nA strong case shows more than the final image. Include the task, constraints, weak first draft, exact prompt revision, finished result, and manual review. That lets a client see how you respond when the model makes a mistake, not just how you collect lucky outputs.\n\nThree focused cases are more convincing than twenty unrelated images. They reveal a repeatable process: receive materials, clarify the job, produce options, select a direction, review the result, and deliver it in the agreed format.",
        before: "Portfolio: a gallery of attractive generations with no task or explanation.",
        after:
          "Case: task → first draft → one precise revision → finished result → manual review.",
        imageSrc: "/blog/make-money-with-ai/en/step-2.jpg",
      },
      {
        title: "Qualify the lead before starting",
        body:
          "Even a small lead needs a short intake. What will the client provide: photos, copy, numbers, brand rules? What exactly will you deliver? What's the deadline, option count, and revision limit? Who approves claims and usage rights? If those questions remain open, the model fills gaps with guesses and the freelancer fills them with unpaid work.\n\nDon't quote a price from “we need five product cards” alone. One client may provide final photos and copy. Another expects photography, competitor research, product descriptions, and store upload. List the work first, then estimate preparation, generations, manual editing, communication, and export.\n\nFor a first engagement, offer one small paid stage: a structure, one visual direction, or one test clip with written limits. It's more honest than completing a full project for free, and it helps both sides see whether the process fits.",
        before: "I'll make five cards. Send the product and we'll discuss price later.",
        after:
          "Send the photos, approved claims, target marketplace, and deadline. I'll confirm 5 cards, 2 directions, 1 revision round, and the delivery format in writing.",
        imageSrc: "/blog/make-money-with-ai/en/step-3.jpg",
      },
      {
        title: "Start with one service, three cases, and one lead",
        body:
          "Consider a practice case for Ilya. He chose a five-product-card service based on supplied photos and facts, using GPT Image 2 for visual drafts. His first prompt was simply, “Make premium cards for this serum.” The model changed the bottle shape, invented label copy, and mixed camera angles. The result wasn't safe to show a client.\n\nIlya revised the prompt. He made the attached photo the only appearance source, locked the bottle and packaging, listed approved claims, assigned one function to each card, and required `[fact needed]` instead of guessing. The next pass produced five related drafts. He then checked product shape by hand, removed unsupported language, and built the final typography in the layout.\n\nThe practical plan is small: choose one service, make three cases in the same format, show them to business owners you know or a professional community, and propose one limited paid task. That tests extra income through real work instead of an income promise. Opten can help restore the job, format, constraints, and review criteria before generation.",
        before: "Make premium cards for this serum.",
        after:
          "Create visual drafts for 5 product cards for this serum. Use the attached photo as the only appearance source. Preserve bottle shape, cap, label, and color. Use only the approved facts below; mark missing information as `[fact needed]`. One function per card. Do not add claims, logos, or package text.",
        imageSrc: "/blog/make-money-with-ai/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build portfolio proof through one complete AI project",
          body:
            "The course connects the task, prompts, copy, visuals, video, and landing page into one coherent project with a reviewable result.",
          ctaLabel: "View the program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course workflow from task and prompt to a portfolio-ready project",
          },
        },
      },
    ],
    faq: [
      {
        q: "Can a beginner make money with AI?",
        a:
          "Yes, if you start with a small service whose result you can review manually. Build three honest practice cases, define the scope, and take one limited paid task. Avoid high-stakes legal, medical, or financial work without the required professional expertise.",
      },
      {
        q: "Which AI services should I offer first?",
        a:
          "Choose a task you already understand: presentations, copy editing, product cards, a simple landing page, a short video, sourced research, or a content pack from one source. The first service should have a small scope, visible result, and fast manual review.",
      },
      {
        q: "How much can I make with AI?",
        a:
          "There is no guaranteed amount. Income depends on the job, market, quality, speed, reputation, tool costs, and ability to find clients. Estimate the full work cycle and price an agreed outcome rather than the number of model requests.",
      },
      {
        q: "What should I never promise a client?",
        a:
          "Don't promise guaranteed sales growth, a fully automatic result, factual accuracy without review, or unrestricted use of any source material. Put inputs, output, deadline, revisions, and responsibility in writing.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
