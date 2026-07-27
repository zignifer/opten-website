import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-28";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-freelance-services/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Работа с нейросетями: стол с готовыми услугами и материалами для портфолио",
};

const COVER_EN = {
  src: "/blog/ai-freelance-services/cover.jpg",
  width: 1600,
  height: 900,
  alt: "AI freelance services arranged as finished client deliverables and portfolio cases",
};

const ru: BlogPostLocale = {
  slug: "ai-freelance-services",
  title: "Работа с нейросетями: 7 услуг, с которых можно начать",
  excerpt:
    "Работа с нейросетями может дать дополнительный доход: выберите одну услугу, соберите три кейса и начните с небольших задач для первых клиентов.",
  description:
    "Работа с нейросетями как дополнительный доход: 7 услуг для старта, выбор первой задачи, три кейса, проверка промптов и поиск первых небольших заказов.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-presentations", "ai-text-for-work", "build-website-with-ai"],
  body: {
    intro:
      "Работа с нейросетями может стать дополнительным доходом, если продавать не «ИИ вообще», а небольшой проверяемый результат: структуру презентации, пакет карточек, черновик лендинга или монтаж короткого ролика. Новичку стоит выбрать одну услугу, сделать три учебных кейса, описать границы работы и только потом искать первые небольшие заказы.",
    steps: [
      {
        title: "Продавайте результат, а не владение нейросетью",
        body:
          "Клиент редко ищет человека, который просто умеет пользоваться ChatGPT или генератором изображений. Ему нужен итог: презентация к встрече, десять карточек для каталога, недельный пакет постов или короткий ролик из готовых материалов. Поэтому работа с нейросетями начинается с формулировки услуги через результат, срок, исходные данные и число правок.\n\nСравните два предложения. «Делаю контент с ИИ» ничего не говорит о составе работы. «Соберу структуру презентации до 10 слайдов, черновик текста и визуальное направление по вашим материалам, затем внесу один круг правок» уже можно обсудить и проверить. Инструмент остается внутри процесса, а клиент покупает понятную поставку.\n\nСразу обозначьте границы ответственности. Если вы не проверяете юридические утверждения, не создаете фирменный стиль с нуля или не подключаете оплату на сайте, напишите это до старта. Узкая честная услуга полезнее большого обещания, которое новичок не сможет выполнить.",
        before: "Сделаю для вас любые материалы с помощью нейросетей.",
        after:
          "Соберу презентацию до 10 слайдов по вашим фактам: структура, черновик текста, визуальное направление и один круг правок. Финальные цифры и утверждения подтверждает клиент.",
        imageSrc: "/blog/ai-freelance-services/ru/step-1.jpg",
      },
      {
        title: "Выберите одну из семи услуг для старта",
        body:
          "Для первой практики подходят задачи с небольшим объемом и понятным критерием готовности. Семь вариантов: структура и черновик презентации; редактура письма, поста или страницы; карточки товаров по готовым фото и фактам; прототип простого лендинга; нарезка коротких видео из исходников клиента; пакет контента из одного интервью; сводка исследования с обязательными ссылками на источники.\n\nНе берите все семь сразу. Посмотрите, что вы уже понимаете без нейросети. Если умеете выстраивать рассказ, начните с презентаций. Если замечаете слабые формулировки, попробуйте редактуру. Если работали с каталогами, соберите карточки товаров. ИИ ускорит черновик, но качество услуги держится на вашем понимании задачи и проверке результата.\n\nФриланс для новичков безопаснее начинать с материалов, которые клиент может быстро просмотреть и исправить. Проекты с платежами, персональными данными, медицинскими или юридическими выводами требуют другой ответственности и не подходят для учебного заказа.",
        before: "Я предлагаю тексты, дизайн, видео, сайты, исследования и автоматизацию.",
        after:
          "Первая услуга: структура презентации и визуальный черновик для малого бизнеса по готовым материалам клиента.",
      },
      {
        title: "Проверьте услугу на одной реальной заявке",
        body:
          "Если неясно, как начать зарабатывать, возьмите одну типичную задачу из знакомой сферы и разложите ее до измеримого результата. Что клиент передает? Что получит? Сколько вариантов и правок входит? Как вы поймете, что работа завершена? Такой разбор быстро показывает, где услуга пока слишком широкая.\n\nНапример, владельцу кофейни нужна презентация для арендодателя. Он дает описание концепции, фотографии, меню и подтвержденные цифры. Исполнитель собирает логику до восьми слайдов, черновики заголовков, предложения по визуалам и список недостающих фактов. Он не придумывает выручку, условия аренды или отзывы. Это ограниченная заявка, которую можно оценить до начала.\n\nПеред первым платным заказом повторите ту же работу на учебном примере и замерьте собственное время. Учтите сбор материалов, генерации, ручную редактуру, переписку, экспорт и правки. Дополнительный доход появляется не из количества открытых моделей, а из процесса, который вы способны повторить без ночной переделки.",
        before: "Сделаю презентацию для любого бизнеса быстро и под ключ.",
        after:
          "Соберу структуру презентации до 8 слайдов по материалам кофейни: логика, черновики заголовков, визуальные идеи и список недостающих фактов. Один круг правок включен.",
        imageSrc: "/blog/ai-freelance-services/ru/step-3.jpg",
      },
      {
        title: "Соберите три кейса для портфолио",
        body:
          "Портфолио без клиентов можно начать с трех самостоятельных кейсов. Выберите один тип услуги и три разные ситуации: презентация для локального бизнеса, предложение для небольшой студии и внутренний отчет для команды. Используйте открытые или придуманные исходные данные и явно подпишите, что это учебная работа. Не присваивайте чужие результаты и не маскируйте макет под реальный заказ.\n\nКаждый кейс должен показывать не только красивый финал. Добавьте исходную задачу, ограничения, слабый первый черновик, исправленный запрос, готовый материал и короткую проверку. Тогда клиент увидит, как вы думаете и что делаете, когда нейросеть ошибается. Три аккуратных разбора одной услуги убедительнее, чем двадцать несвязанных картинок.\n\nСоберите кейсы в одинаковой форме: задача, что было дано, что сделали вы, какие инструменты использовали, что проверили и что передали бы заказчику. Такой шаблон потом ускорит описание реальных работ.",
        before: "Портфолио: галерея красивых генераций без задачи и пояснений.",
        after:
          "Кейс: задача и исходники → первый черновик → исправленный запрос → готовый материал → список ручных проверок.",
        imageSrc: "/blog/ai-freelance-services/ru/step-2.jpg",
      },
      {
        title: "Улучшайте запрос до генерации и проверяйте после",
        body:
          "Практический кейс: Марина выбрала услугу «структура презентации и визуальный черновик для малого бизнеса». Сначала она написала в ChatGPT: «Сделай презентацию для кофейни». В ответ получила общие слайды про уют, качество и любовь к кофе, а недостающие цифры модель заполнила правдоподобными догадками.\n\nМарина переписала запрос: указала встречу с арендодателем, цель получить согласование помещения, лимит восемь слайдов, перечень подтвержденных фактов и правило отмечать пробелы как `[нужен факт]`. Для каждого слайда попросила один вывод, до трех опорных пунктов и описание нужного визуала. ChatGPT собрал проверяемую структуру; после ручной сверки Марина перенесла ее в Gamma и сделала визуальный черновик без выдуманных показателей.\n\nOpten можно использовать перед такой генерацией, чтобы найти расплывчатые места, вернуть в запрос аудиторию, формат и ограничения. Но последняя проверка остается у исполнителя: нейросеть не знает, актуальны ли цифры, разрешено ли использовать фото и соответствует ли результат договоренности с клиентом.",
        before: "Сделай презентацию для кофейни, чтобы она выглядела убедительно.",
        after:
          "Подготовь структуру презентации для встречи кофейни с арендодателем. Цель: согласовать помещение. До 8 слайдов. Используй только факты ниже; пробелы помечай `[нужен факт]`. Для каждого слайда дай один вывод, до 3 опорных пунктов и идею визуала.",
        imageSrc: "/blog/ai-freelance-services/ru/step-4.jpg",
      },
      {
        title: "Ищите первые заказы через небольшие понятные задачи",
        body:
          "Где брать заказы после трех кейсов: начните с бывших коллег, знакомых предпринимателей, профессиональных чатов, локальных сообществ и бирж с небольшими задачами. Не рассылайте сообщение «сделаю что угодно с ИИ». Выберите одну проблему, покажите близкий кейс и предложите короткий следующий шаг, например разобрать материалы и оценить объем.\n\nПервое сообщение может быть простым: «Я собираю презентации до 10 слайдов по готовым фактам. Вот учебный кейс для локального бизнеса: задача, черновик и финальная структура. Если вам нужен похожий материал, пришлите тему и исходники, я отвечу, что войдет в работу». Не делайте бесплатный полный проект ради обещания будущих заказов. Для знакомства достаточно небольшого платного этапа или ограниченного примера.\n\nФиксируйте состав работы, срок, цену, правки и формат передачи письменно. После заказа сохраните разрешенный фрагмент в портфолио, запишите типичные ошибки и обновите шаблон процесса. Так одна услуга постепенно становится надежнее, а не просто быстрее благодаря нейросети.",
        before: "Привет! Я работаю со всеми нейросетями и готов выполнить любую задачу.",
        after:
          "Собираю презентации до 10 слайдов по готовым фактам. Покажу близкий кейс и после просмотра материалов письменно назову состав работы, срок и число правок.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите первые кейсы внутри полного ИИ-проекта",
          body:
            "На курсе вы проходите задачу, промпты, тексты, визуалы, видео и лендинг как один проверяемый проект, который можно разобрать в портфолио.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: рабочий процесс от задачи до готового проекта для портфолио",
          },
        },
      },
    ],
    faq: [
      {
        q: "Какие услуги с нейросетями можно продавать?",
        a:
          "Новичку подходят ограниченные результаты: структура презентации, редактура текста, карточки товаров по готовым данным, простой лендинг, нарезка коротких видео, пакет контента из одного источника или сводка исследования со ссылками. Выберите одну услугу, которую умеете проверить вручную.",
      },
      {
        q: "Сколько можно заработать на работе с нейросетями?",
        a:
          "Гарантированной суммы нет. Доход зависит от качества результата, сложности задачи, рынка, скорости работы, репутации и умения находить клиентов. Сначала посчитайте время на полный цикл и цену сторонних инструментов, затем назначайте стоимость за понятный объем, а не за количество нажатий.",
      },
      {
        q: "Где брать первые заказы?",
        a:
          "Покажите три кейса бывшим коллегам, знакомым предпринимателям, участникам профессиональных и локальных сообществ. Можно отвечать на небольшие задачи на биржах. В сообщении называйте один результат, близкий пример, срок оценки и границы работы.",
      },
      {
        q: "Подходит ли такой фриланс для новичков?",
        a:
          "Да, если начать с небольшой проверяемой услуги и не брать задачи, где ошибка может навредить клиенту. Нейросеть ускоряет черновик, но новичок все равно отвечает за факты, права на материалы, качество, сроки и договоренности.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-freelance-services",
  title: "AI freelance services: 7 practical offers for beginners",
  excerpt:
    "AI freelance services can become extra income when you choose one clear deliverable, build three portfolio cases, and start with small client tasks.",
  description:
    "AI freelance services for beginners: choose one of 7 clear deliverables, build three portfolio cases, improve prompts, and find small first projects.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-presentations", "ai-text-for-work", "build-website-with-ai"],
  body: {
    intro:
      "AI freelance services are easier to sell when they promise a small, reviewable deliverable instead of vague “AI expertise.” A beginner can start with a presentation outline, edited copy, product cards, a landing page draft, or a short video cut. Pick one offer, build three practice cases, set the boundaries, then look for small projects.",
    steps: [
      {
        title: "Sell a deliverable, not access to AI tools",
        body:
          "Clients rarely need someone who simply knows ChatGPT or an image generator. They need a result: a deck for a meeting, ten catalog cards, a week of social copy, or a short video cut from supplied footage. Define an AI freelance service through the deliverable, turnaround, required inputs, and number of revisions.\n\nCompare two offers. “I make content with AI” gives the buyer nothing to scope. “I’ll create a presentation outline for up to 10 slides, draft the copy, suggest a visual direction, and include one revision round using your source material” can be reviewed and priced. The tools stay inside your process; the client buys a clear handoff.\n\nState exclusions early. If you don’t verify legal claims, create a full brand identity, or connect website payments, put that in writing before the project begins. A narrow offer you can finish is more useful than a large promise you can’t control.",
        before: "I can make any kind of content with AI.",
        after:
          "I’ll create a presentation outline for up to 10 slides from your verified materials: structure, copy draft, visual direction, and one revision round.",
        imageSrc: "/blog/ai-freelance-services/en/step-1.jpg",
      },
      {
        title: "Choose one of seven beginner-friendly services",
        body:
          "Good first projects have a small scope and a visible finish line. Seven useful options are presentation structure and draft slides; editing an email, post, or landing page; product cards from supplied photos and facts; a simple landing page prototype; short clips from client footage; a content pack made from one interview; and a research summary with links to every source.\n\nDon’t launch all seven offers. Start with work you already understand without AI. If you can shape a story, try presentations. If weak wording bothers you, offer editing. If you know product catalogs, build product cards. AI speeds up the first pass, but your existing judgment determines whether the delivery is useful.\n\nBeginner freelancing is safer when the client can review and correct the artifact quickly. Projects involving payments, personal data, medical advice, or legal conclusions carry different risks and shouldn’t be treated as practice jobs.",
        before: "I offer copy, design, video, websites, research, and automation.",
        after:
          "My first offer is presentation structure plus a visual draft for small businesses using the client’s source material.",
      },
      {
        title: "Test the offer against one realistic lead",
        body:
          "If you’re unsure where to begin, take one common task from an industry you know and reduce it to a measurable handoff. What does the client supply? What will they receive? How many options and revision rounds are included? What marks the project complete? These questions reveal when an offer is still too broad.\n\nSuppose a neighborhood café needs a presentation for a landlord. The owner supplies the concept, menu, photos, and verified numbers. The freelancer creates an eight-slide story, draft headlines, visual suggestions, and a list of missing facts. They don’t invent revenue, lease terms, or testimonials. That’s a bounded lead you can estimate before starting.\n\nRun the same process on a practice project and time the whole cycle: intake, generation, manual editing, messages, export, and revisions. Extra income comes from a process you can repeat without losing control, not from the number of models you have open.",
        before: "I can quickly make a complete presentation for any business.",
        after:
          "I’ll create an outline for up to 8 slides from the café’s materials: story, draft headlines, visual ideas, missing-fact list, and one revision round.",
        imageSrc: "/blog/ai-freelance-services/en/step-3.jpg",
      },
      {
        title: "Build three portfolio cases before outreach",
        body:
          "You can build a credible starter portfolio without pretending to have clients. Choose one service and create three distinct practice cases, such as a deck for a local business, a proposal for a small studio, and an internal team report. Use public or fictional inputs and label the work as self-initiated. Don’t borrow someone else’s results or present a mock project as a paid engagement.\n\nA useful case includes more than the polished final. Show the task, constraints, weak first draft, corrected prompt, finished artifact, and short review checklist. A potential client can then see how you think and what happens when the model gets something wrong. Three well-explained cases for one service carry more weight than twenty unrelated generations.\n\nUse the same structure for every case: task, inputs, your role, tools, checks, and handoff. Once paid work arrives, that template also makes real case studies faster to document.",
        before: "Portfolio: a gallery of polished AI images with no task or explanation.",
        after:
          "Case study: task and inputs → first draft → corrected prompt → finished artifact → manual review checklist.",
        imageSrc: "/blog/ai-freelance-services/en/step-2.jpg",
      },
      {
        title: "Improve the prompt before generation, then review",
        body:
          "Marina chose one offer: presentation structure and a visual draft for small businesses. Her first ChatGPT request was, “Make a presentation for a café.” It returned generic slides about comfort, quality, and a love of coffee, then filled gaps in the source material with plausible-looking numbers.\n\nShe rebuilt the prompt around a landlord meeting, the goal of securing approval for a location, an eight-slide limit, a list of verified facts, and a rule to mark every gap as `[fact needed]`. She requested one conclusion, up to three supporting points, and a visual note for each slide. ChatGPT returned an outline she could review; after checking it manually, she moved the structure into Gamma for a visual draft without invented performance claims.\n\nOpten can help review a vague request before generation, restoring the audience, output format, and constraints. The freelancer still owns the final checks. A model doesn’t know whether a number is current, an image is licensed, or the delivery matches the client agreement.",
        before: "Make a convincing presentation for a café.",
        after:
          "Create a presentation outline for a café’s landlord meeting. Goal: secure approval for the location. Maximum 8 slides. Use only the facts below; mark gaps as `[fact needed]`. For every slide, provide one conclusion, up to 3 supporting points, and one visual note.",
        imageSrc: "/blog/ai-freelance-services/en/step-4.jpg",
      },
      {
        title: "Find first projects through small, clear requests",
        body:
          "Start outreach with former coworkers, business owners you know, professional communities, local groups, and marketplaces that list small jobs. Don’t send “I can do anything with AI.” Name one problem, show a closely related case, and offer one simple next step, such as reviewing the source material and returning a written scope.\n\nA message can be direct: “I create presentations of up to 10 slides from verified source material. Here’s a practice case for a local business, including the task, first draft, and final structure. If you need something similar, send the topic and materials, and I’ll outline what the project includes.” You don’t need to deliver a full unpaid project to prove interest. A bounded sample or small paid first stage is enough.\n\nWrite down the deliverable, date, price, revision count, and file format. After delivery, save any portfolio excerpt the client has approved, note recurring mistakes, and update your process template. That’s how one offer becomes more reliable, rather than merely faster because it uses AI.",
        before: "Hi! I use every AI tool and can take on any task.",
        after:
          "I create presentations of up to 10 slides from verified materials. I’ll share a related case, then return a written scope, timeline, and revision count after reviewing your inputs.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build your first cases inside a complete AI project",
          body:
            "The course connects the task, prompts, copy, visuals, video, and landing page in one reviewable project you can break down for a portfolio.",
          ctaLabel: "View the program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course workflow from a project brief to a finished portfolio-ready delivery",
          },
        },
      },
    ],
    faq: [
      {
        q: "What AI freelance services can a beginner sell?",
        a:
          "Start with bounded outputs you can review: presentation structure, copy editing, product cards from supplied data, a simple landing page, short clips from client footage, a content pack from one source, or a research summary with citations. Pick one service and learn to check it manually.",
      },
      {
        q: "How much can you earn with AI freelance services?",
        a:
          "There’s no guaranteed amount. Earnings depend on output quality, project complexity, market demand, reputation, client acquisition, and your full delivery time. Track the complete cycle and tool costs, then price a defined scope rather than the number of AI generations.",
      },
      {
        q: "Where can beginners find their first clients?",
        a:
          "Share three relevant cases with former coworkers, business owners you know, and members of professional or local communities. You can also answer small marketplace listings. Lead with one deliverable, a close example, and clear project boundaries.",
      },
      {
        q: "Is AI freelancing suitable for complete beginners?",
        a:
          "It can be, if you start with a small service you can review and avoid high-risk work where an error could harm the client. AI speeds up the draft, but you remain responsible for facts, rights, quality, timing, and the written agreement.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
