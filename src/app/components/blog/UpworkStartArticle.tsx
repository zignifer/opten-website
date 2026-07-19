import { useState } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Layers3,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import LocalizedLink from "../LocalizedLink";
import ResponsiveImage from "../ResponsiveImage";

type Lang = "ru" | "en";

const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const ru = {
  proofLabel: "Личный опыт автора",
  proofValue: "$100 000 за 4 года",
  proofBody:
    "Если бы я сегодня снова заходил на Upwork с пустым профилем, я бы не начинал со ста одинаковых откликов.",
  startTitle: "Если времени мало, начните с этих 10 действий",
  startItems: [
    "Выберите одну основную услугу.",
    "Сформулируйте результат в одном предложении.",
    "Заполните профиль Upwork на 100%.",
    "Добавьте 3-5 релевантных работ или концептов.",
    "Подготовьте два шаблона отклика.",
    "Создайте 3-5 сохранённых поисков.",
    "Фильтруйте задачи до оплаты Connects.",
    "Берите маленькие, но реальные контракты.",
    "Просите честный отзыв после сдачи.",
    "Подключите LinkedIn и Project Catalog.",
  ],
  routeLabel: "Маршрут статьи",
  routeItems: [
    ["01", "Услуга и профиль", "Собрать понятное позиционирование"],
    ["02", "Первые проекты", "Не сливать Connects"],
    ["03", "Отклики", "Показывать решение, а не биографию"],
    ["04", "Три канала", "Upwork, LinkedIn и каталог"],
    ["05", "14 дней", "Запустить систему и посмотреть цифры"],
  ],
  channelEyebrow: "Не один источник заявок",
  channelTitle: "Три канала складываются в одну историю доверия",
  channelBody:
    "Точечные отклики дают первые разговоры. LinkedIn приводит внешний трафик. Project Catalog превращает услугу в готовый продукт. Контракты, отзывы и кейсы усиливают каждый канал дальше.",
  channels: ["Точечные отклики", "LinkedIn", "Project Catalog"],
  channelResult: "Контракты → отзывы → входящие",
  serviceTitle: "Сначала выберите не профессию, а понятную услугу",
  serviceIntro:
    "Профиль с перечислением web design, UX/UI, development, AI и marketing кажется универсальным только автору. Клиенту труднее понять, с какой задачей сюда приходить.",
  formulaLabel: "Формула первой услуги",
  formula: "Что вы делаете + для кого + в каком инструменте или формате",
  serviceTable: [
    ["Web Designer", "Landing Page Designer", "Landing pages for SaaS in Figma"],
    ["UX/UI Designer", "Mobile App UX Designer", "UX audit for mobile apps"],
    ["Tilda Expert", "Tilda Website Designer", "Tilda landing pages from Figma"],
    ["SEO Specialist", "Technical SEO Specialist", "Technical SEO audit for service websites"],
  ],
  serviceHeads: ["Слишком широко", "Уже понятнее", "Проще купить"],
  serviceQuestions: [
    "Какой результат клиент получает на выходе?",
    "Какую задачу вы можете повторить несколько раз?",
    "Для какого клиента эта задача особенно понятна?",
    "Какую работу вы уже можете показать?",
  ],
  profileTitle: "Профиль Upwork работает как посадочная страница",
  profileIntro:
    "Первые строки профиля видны в поиске, поэтому задача клиента должна появиться раньше вашей биографии. Вся страница должна поддерживать одну основную услугу.",
  profileCards: [
    {
      n: "01",
      title: "Заголовок",
      body: "Не помещайте туда весь опыт. Назовите основную услугу, ключевой инструмент и, если помогает, тип клиента.",
      example: "SaaS Landing Page Designer | Figma, Tilda, UX Audit",
    },
    {
      n: "02",
      title: "Первые 250 символов",
      body: "Начните с результата: что вы проектируете, для кого и что человек получит. Имя клиент уже видит.",
      example:
        "I design clear landing pages for SaaS products. You get a structured Figma design, a strong first screen, and components ready for development.",
    },
    {
      n: "03",
      title: "Портфолио",
      body: "Четыре работы под одну услугу сильнее пятнадцати случайных картинок. Покажите задачу, ограничения, свой вклад, процесс и финал.",
      example: "Concept Project · Personal Project · Redesign Concept",
    },
    {
      n: "04",
      title: "Навыки",
      body: "Добавляйте запросы, которыми действительно ищут вашу услугу и которые вы можете подтвердить работами.",
      example: "Landing Page · Figma · UX & UI · Responsive Design · Wireframing",
    },
    {
      n: "05",
      title: "Видимость",
      body: "Проверьте, что профиль доступен для поиска и указана реальная доступность. Availability Badge тратит Connects, поэтому подключайте его после базовой упаковки.",
      example: "Profile 100% · Visibility checked · Availability is current",
    },
  ],
  profileChecklistTitle: "Профиль готов, если",
  profileChecklist: [
    "одна услуга читается в заголовке",
    "первые строки начинаются с задачи клиента",
    "есть 3-5 релевантных работ",
    "концепты честно подписаны",
    "навыки поддерживают позиционирование",
    "нет внешних контактов и выдуманных результатов",
  ],
  courseOne: {
    eyebrow: "Курс Opten · портфолио",
    title: "Не собирайте портфолио из разрозненных учебных картинок",
    body:
      "На курсе вы упакуете один проект целиком: бренд, контент, сайт, видео и рекламные материалы. Такой концепт можно честно оформить как связный кейс, а не как набор проб.",
    cta: "Посмотреть, что войдёт в кейс",
  },
  projectsTitle: "Первые проекты: маленькие, понятные и оплачиваемые",
  projectsIntro:
    "Новичку сложнее выиграть большой проект не обязательно из-за навыка. У клиента пока мало доказательств, что работа будет доведена до конца. Поэтому в начале важнее короткий цикл и ясный результат.",
  projectChips: [
    "аудит одного лендинга",
    "разбор первого экрана",
    "UX-аудит одного сценария",
    "дизайн одной секции",
    "мобильная адаптация",
    "перенос страницы на Tilda",
    "исправление ошибки вёрстки",
    "небольшой SEO-аудит",
  ],
  reviewWarningTitle: "Бесплатная работа за отзыв не подходит",
  reviewWarningBody:
    "Upwork запрещает feedback building. Нормальная последовательность другая: небольшой оплачиваемый scope, выполненная работа, согласованные правки и спокойная просьба оставить честный отзыв.",
  filterTitle: "Не тратьте Connects, пока не проверили проект",
  filterIntro:
    "Boost может поднять отклик выше, но не исправит слабое совпадение. Решение нужно принимать до оплаты, а не после.",
  filterItems: [
    "задача совпадает с основной услугой",
    "понятен конечный результат",
    "есть релевантный кейс",
    "бюджет соответствует объёму",
    "история клиента выглядит нормально",
    "нет найма и десятков активных интервью",
    "есть сильный вопрос по задаче",
  ],
  scoreGood: "6-7 совпадений: отклик имеет смысл",
  scoreWeak: "3-4 совпадения: скорее всего, Connects сгорят впустую",
  proposalsTitle: "Два формата отклика вместо одного шаблона на всё",
  proposalsIntro:
    "Маленькой задаче нужен короткий ответ. Большому проекту нужна логика этапов и снижение неопределённости. Выберите вкладку и используйте структуру как каркас, а не как массовую рассылку.",
  smallTab: "Маленькая задача",
  largeTab: "Большой проект",
  smallStructure: "Деталь из задачи + действие + результат + кейс + один вопрос",
  largeStructure: "Что понял + главный риск + первый этап + milestones + доказательство + вопрос",
  smallTemplate: `Hi {{Name}},\n\nI noticed you need a focused UX review of {{page or flow}}, especially {{specific detail}}.\n\nI can review the flow and deliver a prioritized list of issues with screenshots and practical fixes. I would separate quick improvements from changes that require a redesign.\n\nRelevant example: {{portfolio item}}.\n\nOne question before I estimate the scope: is the main goal {{bookings, sign-ups, purchases, or usability}}?`,
  largeTemplate: `Hi {{Name}},\n\nFrom your brief, this is not only a visual redesign. The main challenge is to reorganize {{content, user flow, or product structure}} without losing {{SEO, brand consistency, or product logic}}.\n\nI would start with a short discovery and audit: review the current pages, map the main journey, agree on priorities, and design the key page before scaling the system.\n\nRelevant work: {{one similar case}}.\n\nWhich action matters most on the website: {{demo requests, purchases, bookings, or another goal}}?`,
  proposalDont: [
    "длинная биография до задачи",
    "I am the best candidate",
    "список всех программ",
    "неподтверждённая гарантия роста",
    "внешний мессенджер до контракта",
  ],
  honestReviewTitle: "Первый отзыв начинается с нормальной передачи результата",
  honestReviewBody:
    "Сверьте scope, покажите сделанное, отдельно назовите то, что не входило в задачу, закройте согласованные правки и только потом спросите, готов ли клиент завершить контракт.",
  honestReviewTemplate:
    "Thanks for the project. If everything looks good on your side, you can close the contract when convenient. I would appreciate an honest review of our work together.",
  linkedinTitle: "LinkedIn даёт внешний трафик, если есть конкретный повод",
  linkedinIntro:
    "У меня связка LinkedIn и Upwork помогла получить первый крупный проект. Внешний контакт увидел услугу, а контракт прошёл через биржу, поэтому история осталась в профиле.",
  linkedinPeople: [
    "Founder небольшого SaaS",
    "Head of Marketing",
    "Product Manager",
    "владелец клиники или сервиса",
    "эксперт перед запуском продукта",
  ],
  linkedinReasons: [
    "запуск продукта",
    "новое направление",
    "вакансия дизайнера",
    "новый сайт",
    "пост о проблеме",
  ],
  linkedinSteps: [
    "Найдите один реальный контекст.",
    "Отправьте короткое приглашение без продажи.",
    "После принятия дайте одно наблюдение.",
    "Подробное решение упакуйте в платный scope на Upwork.",
  ],
  linkedinTemplate:
    "Hi {{Name}}, I saw your post about {{launch or topic}}. I work on {{specific service}} for {{type of business}} and would be glad to connect.",
  catalogTitle: "Project Catalog превращает услугу в готовый продукт",
  catalogIntro:
    "Не делайте двадцать одинаковых карточек. Начните с 3-5 отдельных услуг, где понятны результат, scope, срок, цена и материалы, которые нужны от клиента.",
  catalogFormula: "Конкретный результат + тип продукта или клиента + инструмент",
  catalogRows: [
    ["I will design a website", "I will design a SaaS landing page in Figma"],
    ["I will do UX/UI design", "I will audit your mobile app UX and prioritize fixes"],
    ["I will build on Tilda", "I will build a responsive Tilda landing page from Figma"],
    ["I will do SEO", "I will run a technical SEO audit for a service website"],
  ],
  packageRows: [
    ["Starter", "Один экран или страница, основные проблемы"],
    ["Standard", "Один сценарий, скриншоты и приоритеты"],
    ["Advanced", "Несколько сценариев, рекомендации и созвон внутри Upwork"],
  ],
  courseTwo: {
    eyebrow: "Курс Opten · готовый кейс",
    title: "Соберите работу, которую не стыдно приложить к отклику",
    body:
      "16 уроков ведут от идеи и промптов до полной упаковки проекта. В финале у вас остаётся связный кейс с визуальной системой, сайтом и контентом для портфолио.",
    cta: "Открыть программу курса",
  },
  metricsTitle: "Смотрите, на каком шаге ломается путь до контракта",
  metricsIntro:
    "Не переписывайте весь профиль после одного отказа. После каждых десяти осмысленных откликов найдите конкретный слабый участок.",
  metricRows: [
    ["Отклики почти не открывают", "Выбор задач или первые строки"],
    ["Открывают, но не отвечают", "Совпадение, доказательство, результат"],
    ["Отвечают, но нет контракта", "Вопросы, scope, цена, этапы"],
    ["Профиль смотрят, но не приглашают", "Заголовок и портфолио не складываются в услугу"],
    ["Catalog смотрят, но не покупают", "Непонятны объём, результат, цена или примеры"],
  ],
  planTitle: "План запуска профиля на 14 дней",
  planIntro: "Не 100 откликов за ночь. Одна рабочая система за две недели.",
  plan: [
    ["Дни 1-2", "Услуга и позиционирование", ["один клиент", "один результат", "заголовок", "первые 250 символов"]],
    ["Дни 3-6", "Профиль и кейсы", ["2-3 концепта", "честные подписи", "профиль 100%", "проверка английского"]],
    ["Дни 7-10", "Поиск и отклики", ["3-5 запросов", "два шаблона", "точечные отклики", "один вопрос"]],
    ["Дни 11-13", "LinkedIn и каталог", ["кейсы в профиле", "20 компаний для изучения", "3 услуги", "пакеты и теги"]],
    ["День 14", "Цифры и корректировка", ["открытия", "ответы", "частые вопросы", "слабый шаг воронки"]],
  ] as [string, string, string[]][],
  finalChecklistTitle: "Чек-лист перед каждым откликом",
  finalGroups: [
    ["Клиент", ["история без явных флагов", "бюджет не спорит с описанием", "нет бесплатной тестовой", "понятен принимающий решение"]],
    ["Задача", ["понятен результат", "есть релевантный навык", "есть близкий кейс", "можно оценить первый этап"]],
    ["Отклик", ["первая строка уникальна", "описан результат", "один пример", "один конкретный вопрос", "нет гарантий и внешних контактов"]],
    ["После ответа", ["уточнить цель", "зафиксировать scope", "назвать исключения", "разбить большой проект на этапы"]],
    ["После выполнения", ["понятно передать результат", "закрыть правки", "попросить честный отзыв", "добавить кейс только с разрешения"]],
  ] as [string, string[]][],
  mistakesTitle: "10 ошибок, которые тормозят старт",
  mistakes: [
    "Откликаться на всё подряд.",
    "Писать слишком широкий профиль.",
    "Брать огромный проект ради первого отзыва.",
    "Предлагать бесплатную работу за оценку.",
    "Придумывать клиентские кейсы.",
    "Копировать один отклик.",
    "Сразу покупать boost.",
    "Уводить клиента во внешний мессенджер.",
    "Надеяться только на вакансии.",
    "Ждать магическую сумму заработка.",
  ],
  finishEyebrow: "Что сделать сегодня",
  finishTitle: "Выберите одну услугу и перепишите под неё заголовок профиля",
  finishBody:
    "Завтра соберите первый релевантный кейс. После этого настройте поиск и отправьте несколько откликов, которые действительно совпадают с вашей работой.",
  sourcesTitle: "Источники и актуальные правила",
  sourcesNote:
    "Материал проверен по открытым справочным страницам платформ на 19 июля 2026 года. Интерфейс, цены и ограничения могут меняться.",
};

const en: typeof ru = {
  ...ru,
  proofLabel: "Author's experience",
  proofValue: "$100,000 in four years",
  proofBody:
    "If I had to restart on Upwork with an empty profile today, I would not begin by sending one hundred identical proposals.",
  startTitle: "If you are short on time, start with these 10 actions",
  startItems: [
    "Choose one primary service.",
    "Describe the outcome in one sentence.",
    "Complete your Upwork profile to 100%.",
    "Add 3-5 relevant works or concepts.",
    "Prepare two proposal frameworks.",
    "Create 3-5 saved searches.",
    "Filter jobs before spending Connects.",
    "Take small but real paid contracts.",
    "Ask for an honest review after delivery.",
    "Add LinkedIn and Project Catalog.",
  ],
  routeLabel: "Article route",
  routeItems: [
    ["01", "Service and profile", "Build clear positioning"],
    ["02", "First projects", "Protect your Connects"],
    ["03", "Proposals", "Show a solution, not a biography"],
    ["04", "Three channels", "Upwork, LinkedIn, and Catalog"],
    ["05", "14 days", "Launch the system and read the numbers"],
  ],
  channelEyebrow: "More than one source of work",
  channelTitle: "Three channels build one trust history",
  channelBody:
    "Focused proposals start conversations. LinkedIn brings external traffic. Project Catalog turns your service into a product. Contracts, reviews, and cases then strengthen every channel.",
  channels: ["Focused proposals", "LinkedIn", "Project Catalog"],
  channelResult: "Contracts → reviews → inbound",
  serviceTitle: "Choose a clear service, not a list of professions",
  serviceIntro:
    "A profile listing web design, UX/UI, development, AI, and marketing only feels versatile to its author. The client cannot see which problem to bring you.",
  formulaLabel: "First-service formula",
  formula: "What you do + for whom + in which tool or format",
  serviceHeads: ["Too broad", "Clearer", "Easier to buy"],
  serviceQuestions: [
    "What outcome does the client receive?",
    "Which task can you repeat several times?",
    "Which client understands this task best?",
    "Which work can you show today?",
  ],
  profileTitle: "Treat the Upwork profile as a landing page",
  profileIntro:
    "Your opening lines appear in search, so the client's task must come before your biography. Every part of the page should support one primary service.",
  profileCards: [
    { ...ru.profileCards[0], title: "Headline", body: "Do not fit your entire career into it. Name the service, primary tool, and useful client category." },
    { ...ru.profileCards[1], title: "First 250 characters", body: "Open with the outcome: what you design, for whom, and what the client receives. They can already see your name." },
    { ...ru.profileCards[2], title: "Portfolio", body: "Four cases for one service beat fifteen unrelated images. Show the brief, constraints, contribution, process, and result." },
    { ...ru.profileCards[3], title: "Skills", body: "Use search terms that genuinely support your service and that you can prove with work." },
    { ...ru.profileCards[4], title: "Visibility", body: "Check that clients can find the profile and that availability is current. Test the basic package before spending Connects on the badge." },
  ],
  profileChecklistTitle: "Your profile is ready when",
  profileChecklist: [
    "one service is clear in the headline",
    "the opening starts with a client problem",
    "3-5 relevant works are visible",
    "concepts are labeled honestly",
    "skills support the positioning",
    "there are no external contacts or invented results",
  ],
  courseOne: {
    eyebrow: "Opten course · portfolio",
    title: "Do not build a portfolio from disconnected practice images",
    body:
      "In the course, you package one complete project: brand, content, website, video, and campaign assets. It can become an honest, connected concept case instead of a folder of experiments.",
    cta: "See what goes into the case",
  },
  projectsTitle: "First projects: small, clear, and paid",
  projectsIntro:
    "Beginners often lose large projects because clients have little proof they will finish, not because their craft is necessarily weak. Start with a short cycle and a clear result.",
  projectChips: [
    "one landing-page audit",
    "first-screen review",
    "one-flow UX audit",
    "one website section",
    "mobile adaptation",
    "one-page Tilda build",
    "specific front-end fix",
    "focused SEO audit",
  ],
  reviewWarningTitle: "Free work for a review is not an option",
  reviewWarningBody:
    "Upwork prohibits feedback building. Use a small paid scope, complete the work, close agreed revisions, and then politely ask for an honest review.",
  filterTitle: "Do not spend Connects before checking the job",
  filterIntro:
    "Boosting may move a proposal higher, but it cannot repair a weak fit. Make the decision before you pay.",
  filterItems: [
    "the job matches your primary service",
    "the final outcome is clear",
    "you have a relevant case",
    "the budget fits the scope",
    "the client's history looks reasonable",
    "the client has not hired and is not interviewing everyone",
    "you can ask a strong question",
  ],
  scoreGood: "6-7 matches: the proposal is worth sending",
  scoreWeak: "3-4 matches: you are probably spending Connects on fear",
  proposalsTitle: "Use two proposal formats instead of one universal template",
  proposalsIntro:
    "A small task needs a compact answer. A large project needs a staged plan that reduces uncertainty. Use the structure as scaffolding, never as bulk outreach.",
  smallTab: "Small task",
  largeTab: "Large project",
  smallStructure: "Job detail + action + deliverable + case + one question",
  largeStructure: "Understanding + main risk + first stage + milestones + proof + question",
  proposalDont: [
    "a biography before the problem",
    "I am the best candidate",
    "a list of every tool",
    "an unsupported growth guarantee",
    "an external messenger before contract",
  ],
  honestReviewTitle: "The first review starts with a clear handoff",
  honestReviewBody:
    "Check the scope, show what was completed, name what was outside the agreement, close revisions, and only then ask whether the client is ready to end the contract.",
  linkedinTitle: "LinkedIn brings external traffic when there is a real trigger",
  linkedinIntro:
    "The LinkedIn plus Upwork combination helped me land my first large project. The contact found the service externally, while the contract stayed on Upwork and strengthened the profile.",
  linkedinPeople: ["small SaaS founder", "Head of Marketing", "Product Manager", "clinic or service owner", "expert launching a product"],
  linkedinReasons: ["product launch", "new business line", "design vacancy", "new website", "post about a problem"],
  linkedinSteps: [
    "Find one real piece of context.",
    "Send a short invitation without a pitch.",
    "Offer one observation after they accept.",
    "Package the full solution as a paid Upwork scope.",
  ],
  catalogTitle: "Project Catalog turns a service into a product",
  catalogIntro:
    "Do not create twenty near-identical cards. Start with 3-5 services that make the outcome, scope, timeline, price, and client requirements clear.",
  catalogFormula: "Specific outcome + product or client type + tool",
  packageRows: [
    ["Starter", "One screen or page and its main issues"],
    ["Standard", "One user flow with screenshots and priorities"],
    ["Advanced", "Several flows, recommendations, and an Upwork call"],
  ],
  courseTwo: {
    eyebrow: "Opten course · complete case",
    title: "Build work you can confidently attach to a proposal",
    body:
      "Sixteen lessons take one idea from prompts to a complete project package. You finish with a connected case that includes a visual system, website, and content.",
    cta: "Open the course program",
  },
  metricsTitle: "Find the exact step where the contract path breaks",
  metricsIntro:
    "Do not rebuild the whole profile after one rejection. Review every ten thoughtful proposals and diagnose one weak stage.",
  metricRows: [
    ["Proposals are barely opened", "Job selection or opening lines"],
    ["Opened but no reply", "Fit, proof, or unclear outcome"],
    ["Replies but no contract", "Questions, scope, price, or milestones"],
    ["Profile views but no invitations", "Headline and portfolio do not form one service"],
    ["Catalog views but no purchase", "Scope, outcome, price, or examples are unclear"],
  ],
  planTitle: "A 14-day profile launch plan",
  planIntro: "Not 100 proposals overnight. One working system in two weeks.",
  plan: [
    ["Days 1-2", "Service and positioning", ["one client", "one result", "headline", "first 250 characters"]],
    ["Days 3-6", "Profile and cases", ["2-3 concepts", "honest labels", "100% profile", "English check"]],
    ["Days 7-10", "Search and proposals", ["3-5 searches", "two frameworks", "focused proposals", "one question"]],
    ["Days 11-13", "LinkedIn and Catalog", ["cases in profile", "20 companies to study", "3 services", "packages and tags"]],
    ["Day 14", "Numbers and correction", ["opens", "replies", "repeated questions", "weak funnel stage"]],
  ],
  finalChecklistTitle: "Checklist before every proposal",
  finalGroups: [
    ["Client", ["reasonable history", "budget matches the brief", "no free test", "decision-maker is clear"]],
    ["Job", ["outcome is clear", "skill is relevant", "there is a close case", "first stage can be estimated"]],
    ["Proposal", ["opening is specific", "deliverable is clear", "one example", "one question", "no guarantees or contacts"]],
    ["After reply", ["clarify the goal", "lock the scope", "name exclusions", "split a large project into stages"]],
    ["After delivery", ["hand off clearly", "close revisions", "ask for an honest review", "publish only with permission"]],
  ],
  mistakesTitle: "10 mistakes that slow down the start",
  mistakes: [
    "Apply to everything.",
    "Write an overly broad profile.",
    "Take a huge project for the first review.",
    "Offer free work for feedback.",
    "Invent client cases.",
    "Copy one proposal everywhere.",
    "Boost automatically.",
    "Move the client outside Upwork.",
    "Depend only on job posts.",
    "Wait for a magical earnings threshold.",
  ],
  finishEyebrow: "What to do today",
  finishTitle: "Choose one service and rewrite your profile headline around it",
  finishBody:
    "Build the first relevant case tomorrow. Then set up your searches and send a few proposals that genuinely match your work.",
  sourcesTitle: "Sources and current rules",
  sourcesNote:
    "This guide was checked against public platform documentation on July 19, 2026. Interfaces, prices, and limits may change.",
};

const sourceLinks = [
  ["Understanding and using Connects", "https://support.upwork.com/hc/en-us/articles/211062898-Understanding-and-using-Connects"],
  ["How to submit a proposal on Upwork", "https://support.upwork.com/hc/en-us/articles/211062998-How-to-submit-a-proposal-on-Upwork"],
  ["How to build your freelancer profile", "https://support.upwork.com/hc/en-us/articles/360016252373-How-to-build-your-freelancer-profile-the-essentials"],
  ["Create a 100% complete freelancer profile", "https://support.upwork.com/hc/en-us/articles/211063188-How-do-I-create-a-100-complete-freelancer-profile"],
  ["What is feedback building?", "https://support.upwork.com/hc/en-us/articles/7180643124243-What-is-feedback-building"],
  ["When will I get a Job Success Score?", "https://support.upwork.com/hc/en-us/articles/38437546570643-When-will-I-get-a-JSS"],
  ["How to become Rising Talent", "https://support.upwork.com/hc/en-us/articles/211063228-How-to-become-a-Rising-Talent-on-Upwork"],
  ["Create a project in Project Catalog", "https://support.upwork.com/hc/en-us/articles/360057397533-How-to-create-a-project-in-Project-Catalog"],
  ["Keep contact information safe on Upwork", "https://support.upwork.com/hc/en-us/articles/360051749534-How-to-keep-your-contact-information-safe-on-Upwork"],
  ["LinkedIn invitation restrictions", "https://www.linkedin.com/help/linkedin/answer/a551012/invitation-limitations?lang=en"],
] as const;

function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div className="mb-[22px]">
      {eyebrow && <p className="mb-[8px] text-[11px] font-bold uppercase tracking-[1.5px] text-[#9cfb51]">{eyebrow}</p>}
      <h2 className="font-['Unbounded',sans-serif] text-[24px] font-medium leading-[1.2] tracking-[-0.5px] text-white md:text-[30px]">
        {title}
      </h2>
      {body && <p className="mt-[12px] text-[16px] leading-[1.7] text-white/68">{body}</p>}
    </div>
  );
}

function CourseBanner({ copy, image }: { copy: typeof ru.courseOne; image: string }) {
  return (
    <aside className="group relative overflow-hidden rounded-[18px] border border-[#9cfb51]/20 bg-[#071d20]">
      <ResponsiveImage
        src={image}
        alt=""
        width={1600}
        height={560}
        loading="lazy"
        widths={[480, 800, 1200, 1600]}
        sizes="(max-width: 840px) calc(100vw - 40px), 800px"
        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#011417] via-[#011417]/94 to-[#011417]/35" />
      <div className="relative z-10 flex min-h-[330px] max-w-[520px] flex-col justify-center p-[24px] md:min-h-[300px] md:p-[34px]">
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#9cfb51]">{copy.eyebrow}</p>
        <h3 className="mt-[10px] font-['Unbounded',sans-serif] text-[21px] font-medium leading-[1.25] text-white md:text-[26px]">{copy.title}</h3>
        <p className="mt-[12px] text-[15px] leading-[1.65] text-white/72">{copy.body}</p>
        <LocalizedLink
          to={COURSE_URL}
          className="mt-[20px] inline-flex w-fit items-center gap-[8px] rounded-full bg-[#9cfb51] px-[18px] py-[11px] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5"
        >
          {copy.cta} <ArrowRight className="h-[15px] w-[15px]" />
        </LocalizedLink>
      </div>
    </aside>
  );
}

function ProposalTabs({ copy }: { copy: typeof ru }) {
  const [active, setActive] = useState<"small" | "large">("small");
  const small = active === "small";
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0b2023]">
      <div className="grid grid-cols-2 gap-[6px] border-b border-white/10 bg-black/10 p-[6px]" role="tablist">
        {([
          ["small", copy.smallTab],
          ["large", copy.largeTab],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={`rounded-[12px] px-[12px] py-[11px] text-[13px] font-bold transition md:text-[14px] ${
              active === id ? "bg-[#9cfb51] text-[#011417]" : "text-white/58 hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-[18px] md:p-[24px]">
        <p className="rounded-[10px] border border-white/10 bg-white/[0.035] px-[14px] py-[11px] text-[13px] font-medium leading-[1.55] text-[#bffb8c]">
          {small ? copy.smallStructure : copy.largeStructure}
        </p>
        <pre className="mt-[16px] overflow-x-auto whitespace-pre-wrap font-mono text-[12px] leading-[1.75] text-white/72 md:text-[13px]">
          {small ? copy.smallTemplate : copy.largeTemplate}
        </pre>
      </div>
    </div>
  );
}

export default function UpworkStartArticle({ lang }: { lang: Lang }) {
  const c = lang === "ru" ? ru : en;

  return (
    <div className="mt-[28px] flex flex-col gap-[64px] md:gap-[80px]">
      <section className="grid gap-[14px] md:grid-cols-[0.82fr_1.18fr]">
        <div className="relative overflow-hidden rounded-[18px] border border-[#9cfb51]/20 bg-[#9cfb51] p-[22px] text-[#011417]">
          <Sparkles className="absolute right-[18px] top-[18px] h-[26px] w-[26px] opacity-35" />
          <p className="text-[11px] font-bold uppercase tracking-[1.3px] opacity-60">{c.proofLabel}</p>
          <p className="mt-[18px] font-['Unbounded',sans-serif] text-[28px] font-bold leading-[1.05] tracking-[-0.8px] md:text-[34px]">{c.proofValue}</p>
          <p className="mt-[16px] text-[14px] font-medium leading-[1.55] opacity-75">{c.proofBody}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-[22px]">
          <h2 className="text-[18px] font-medium leading-[1.35] text-white md:text-[20px]">{c.startTitle}</h2>
          <div className="mt-[16px] grid gap-x-[16px] gap-y-[10px] sm:grid-cols-2">
            {c.startItems.map((item) => (
              <div key={item} className="flex items-start gap-[9px] text-[13px] leading-[1.45] text-white/68">
                <span className="mt-[1px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border border-[#9cfb51]/35 bg-[#9cfb51]/10">
                  <Check className="h-[11px] w-[11px] text-[#9cfb51]" strokeWidth={2.5} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav aria-label={c.routeLabel} className="rounded-[18px] border border-white/10 bg-[#071b1e] p-[18px] md:p-[22px]">
        <p className="mb-[14px] text-[11px] font-bold uppercase tracking-[1.4px] text-white/40">{c.routeLabel}</p>
        <div className="grid gap-[8px] sm:grid-cols-5">
          {c.routeItems.map(([n, title, body]) => (
            <div key={n} className="rounded-[12px] border border-white/8 bg-white/[0.025] p-[12px]">
              <span className="font-['Unbounded',sans-serif] text-[12px] font-bold text-[#9cfb51]">{n}</span>
              <p className="mt-[12px] text-[13px] font-bold leading-[1.25] text-white">{title}</p>
              <p className="mt-[5px] text-[11px] leading-[1.4] text-white/42">{body}</p>
            </div>
          ))}
        </div>
      </nav>

      <section>
        <SectionTitle eyebrow={c.channelEyebrow} title={c.channelTitle} body={c.channelBody} />
        <figure className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[#05191c]">
          <ResponsiveImage
            src={`/blog/upwork-start-2026-checklist/${lang}/step-3.jpg`}
            alt={lang === "ru" ? "Три канала привлечения клиентов сходятся в портфолио, контракты и отзывы" : "Three client channels converging into portfolio cases, contracts, and reviews"}
            width={1600}
            height={900}
            loading="lazy"
            widths={[480, 800]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block w-full"
          />
        </figure>
      </section>

      <section>
        <SectionTitle title={c.serviceTitle} body={c.serviceIntro} />
        <figure className="mb-[16px] overflow-hidden rounded-[18px] border border-white/10 bg-[#05191c]">
          <ResponsiveImage
            src={`/blog/upwork-start-2026-checklist/${lang}/step-1.jpg`}
            alt={lang === "ru" ? "Одна услуга для одного клиента с одним результатом и кейсом" : "One service for one client with one outcome and case study"}
            width={1600}
            height={900}
            loading="lazy"
            widths={[480, 800]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block w-full"
          />
        </figure>
        <div className="rounded-[16px] border border-[#9cfb51]/20 bg-[#9cfb51]/[0.06] p-[18px] md:p-[22px]">
          <p className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#9cfb51]">{c.formulaLabel}</p>
          <p className="mt-[10px] font-['Unbounded',sans-serif] text-[17px] font-medium leading-[1.45] text-white md:text-[20px]">{c.formula}</p>
        </div>
        <div className="mt-[16px] overflow-x-auto rounded-[16px] border border-white/10">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="bg-white/[0.045] text-[11px] uppercase tracking-[1px] text-white/40">
              <tr>{c.serviceHeads.map((head) => <th key={head} className="px-[16px] py-[12px] font-bold">{head}</th>)}</tr>
            </thead>
            <tbody>
              {c.serviceTable.map((row) => (
                <tr key={row[0]} className="border-t border-white/8 text-[13px] text-white/68">
                  {row.map((cell, i) => <td key={cell} className={`px-[16px] py-[14px] ${i === 2 ? "font-medium text-[#c6fb9c]" : ""}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-[16px] grid gap-[10px] sm:grid-cols-2">
          {c.serviceQuestions.map((q, i) => (
            <div key={q} className="flex gap-[10px] rounded-[12px] border border-white/8 bg-white/[0.025] p-[14px] text-[13px] leading-[1.5] text-white/67">
              <span className="font-['Unbounded',sans-serif] text-[12px] font-bold text-[#9cfb51]">0{i + 1}</span>{q}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={c.profileTitle} body={c.profileIntro} />
        <div className="grid gap-[12px] md:grid-cols-2">
          {c.profileCards.map((card, i) => (
            <article key={card.n} className={`rounded-[16px] border border-white/10 bg-[#0b2023] p-[18px] ${i === 2 ? "md:col-span-2" : ""}`}>
              <div className="flex items-center gap-[10px]">
                <span className="font-['Unbounded',sans-serif] text-[13px] font-bold text-[#9cfb51]">{card.n}</span>
                <h3 className="text-[17px] font-medium text-white">{card.title}</h3>
              </div>
              <p className="mt-[10px] text-[14px] leading-[1.6] text-white/62">{card.body}</p>
              <p className="mt-[14px] rounded-[10px] border border-white/8 bg-black/20 px-[13px] py-[11px] font-mono text-[12px] leading-[1.55] text-white/72">{card.example}</p>
            </article>
          ))}
        </div>
        <div className="mt-[16px] rounded-[16px] border border-white/10 p-[18px]">
          <h3 className="text-[16px] font-medium text-white">{c.profileChecklistTitle}</h3>
          <div className="mt-[13px] grid gap-[9px] sm:grid-cols-2">
            {c.profileChecklist.map((item) => (
              <p key={item} className="flex items-start gap-[8px] text-[13px] leading-[1.45] text-white/62"><Check className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#9cfb51]" />{item}</p>
            ))}
          </div>
        </div>
        <figure className="mt-[18px] overflow-hidden rounded-[18px] border border-white/10 bg-[#05191c]">
          <ResponsiveImage
            src={`/blog/upwork-start-2026-checklist/${lang}/step-4.jpg`}
            alt={lang === "ru" ? "Структура портфолио: задача, процесс, результат и честная пометка концепта" : "Portfolio structure: brief, process, result, and an honest concept label"}
            width={1600}
            height={900}
            loading="lazy"
            widths={[480, 800]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block w-full"
          />
        </figure>
        <div className="mt-[22px]"><CourseBanner copy={c.courseOne} image="/blog/_banners/course-nova-brand.jpg" /></div>
      </section>

      <section>
        <SectionTitle title={c.projectsTitle} body={c.projectsIntro} />
        <div className="flex flex-wrap gap-[8px]">
          {c.projectChips.map((chip) => <span key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-[12px] py-[7px] text-[12px] text-white/65">{chip}</span>)}
        </div>
        <div className="mt-[18px] flex gap-[12px] rounded-[16px] border border-amber-300/20 bg-amber-300/[0.055] p-[18px]">
          <CircleAlert className="mt-[1px] h-[20px] w-[20px] shrink-0 text-amber-200" />
          <div><h3 className="text-[15px] font-bold text-white">{c.reviewWarningTitle}</h3><p className="mt-[7px] text-[13px] leading-[1.6] text-white/62">{c.reviewWarningBody}</p></div>
        </div>
      </section>

      <section>
        <SectionTitle title={c.filterTitle} body={c.filterIntro} />
        <figure className="overflow-hidden rounded-[18px] border border-white/10 bg-[#05191c]">
          <ResponsiveImage
            src={`/blog/upwork-start-2026-checklist/${lang}/step-2.jpg`}
            alt={lang === "ru" ? "Семь проверок проекта до расхода Connects" : "Seven project checks before spending Connects"}
            width={1600}
            height={900}
            loading="lazy"
            widths={[480, 800]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block w-full"
          />
        </figure>
        <div className="mt-[14px] grid gap-[8px] sm:grid-cols-2">
          {c.filterItems.map((item, i) => (
            <div key={item} className={`flex items-start gap-[9px] rounded-[11px] border border-white/8 bg-white/[0.025] p-[12px] text-[13px] leading-[1.45] text-white/66 ${i === c.filterItems.length - 1 ? "sm:col-span-2" : ""}`}>
              <span className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-[#9cfb51]/12 font-['Unbounded',sans-serif] text-[9px] font-bold text-[#9cfb51]">{i + 1}</span>{item}
            </div>
          ))}
        </div>
        <div className="mt-[12px] grid gap-[8px] sm:grid-cols-2">
          <p className="rounded-[12px] border border-[#9cfb51]/20 bg-[#9cfb51]/[0.07] p-[13px] text-[13px] font-bold text-[#bffc90]">{c.scoreGood}</p>
          <p className="rounded-[12px] border border-white/10 bg-white/[0.03] p-[13px] text-[13px] font-medium text-white/48">{c.scoreWeak}</p>
        </div>
      </section>

      <section>
        <SectionTitle title={c.proposalsTitle} body={c.proposalsIntro} />
        <ProposalTabs copy={c} />
        <div className="mt-[14px] grid gap-[8px] sm:grid-cols-5">
          {c.proposalDont.map((item) => <p key={item} className="rounded-[10px] border border-white/8 bg-white/[0.025] p-[10px] text-center text-[11px] leading-[1.4] text-white/46">{item}</p>)}
        </div>
        <div className="mt-[20px] rounded-[16px] border border-white/10 bg-white/[0.025] p-[18px]">
          <h3 className="text-[17px] font-medium text-white">{c.honestReviewTitle}</h3>
          <p className="mt-[8px] text-[13px] leading-[1.6] text-white/60">{c.honestReviewBody}</p>
          <blockquote className="mt-[14px] border-l-2 border-[#9cfb51] pl-[14px] font-mono text-[12px] leading-[1.65] text-white/72">{c.honestReviewTemplate}</blockquote>
        </div>
      </section>

      <section>
        <SectionTitle title={c.linkedinTitle} body={c.linkedinIntro} />
        <div className="grid gap-[12px] md:grid-cols-2">
          <div className="rounded-[16px] border border-white/10 bg-[#0b2023] p-[18px]"><Users className="h-[22px] w-[22px] text-[#9cfb51]" /><h3 className="mt-[12px] text-[15px] font-bold text-white">{lang === "ru" ? "Кого искать" : "Who to find"}</h3><div className="mt-[12px] flex flex-wrap gap-[7px]">{c.linkedinPeople.map((x) => <span key={x} className="rounded-full bg-white/5 px-[10px] py-[6px] text-[11px] text-white/60">{x}</span>)}</div></div>
          <div className="rounded-[16px] border border-white/10 bg-[#0b2023] p-[18px]"><Search className="h-[22px] w-[22px] text-[#9cfb51]" /><h3 className="mt-[12px] text-[15px] font-bold text-white">{lang === "ru" ? "Какой повод искать" : "Which trigger to use"}</h3><div className="mt-[12px] flex flex-wrap gap-[7px]">{c.linkedinReasons.map((x) => <span key={x} className="rounded-full bg-white/5 px-[10px] py-[6px] text-[11px] text-white/60">{x}</span>)}</div></div>
        </div>
        <ol className="mt-[14px] grid gap-[8px] sm:grid-cols-4">
          {c.linkedinSteps.map((step, i) => <li key={step} className="rounded-[12px] border border-white/8 p-[12px] text-[12px] leading-[1.45] text-white/60"><span className="mb-[9px] block font-['Unbounded',sans-serif] text-[11px] font-bold text-[#9cfb51]">0{i + 1}</span>{step}</li>)}
        </ol>
        <blockquote className="mt-[14px] rounded-[14px] border border-[#9cfb51]/20 bg-[#9cfb51]/[0.05] p-[16px] font-mono text-[12px] leading-[1.7] text-white/75">{c.linkedinTemplate}</blockquote>
      </section>

      <section>
        <SectionTitle title={c.catalogTitle} body={c.catalogIntro} />
        <p className="rounded-[14px] border border-[#9cfb51]/20 bg-[#9cfb51]/[0.055] p-[16px] text-center font-['Unbounded',sans-serif] text-[15px] font-medium leading-[1.45] text-white">{c.catalogFormula}</p>
        <div className="mt-[14px] grid gap-[8px] md:grid-cols-2">
          {c.catalogRows.map(([broad, narrow]) => (
            <div key={broad} className="rounded-[14px] border border-white/10 bg-[#0b2023] p-[16px]">
              <p className="text-[12px] line-through decoration-white/25 text-white/35">{broad}</p>
              <p className="mt-[10px] text-[14px] font-medium leading-[1.45] text-[#c7fb9f]">{narrow}</p>
            </div>
          ))}
        </div>
        <div className="mt-[14px] overflow-hidden rounded-[14px] border border-white/10">
          {c.packageRows.map(([name, body], i) => (
            <div key={name} className={`grid grid-cols-[100px_1fr] gap-[12px] px-[16px] py-[14px] text-[13px] ${i ? "border-t border-white/8" : ""}`}><span className="font-bold text-white">{name}</span><span className="text-white/58">{body}</span></div>
          ))}
        </div>
        <div className="mt-[22px]"><CourseBanner copy={c.courseTwo} image="/blog/_banners/course-workflow.jpg" /></div>
      </section>

      <section>
        <SectionTitle title={c.metricsTitle} body={c.metricsIntro} />
        <div className="overflow-hidden rounded-[16px] border border-white/10">
          {c.metricRows.map(([signal, diagnosis], i) => (
            <div key={signal} className={`grid gap-[6px] px-[16px] py-[15px] sm:grid-cols-[0.95fr_1.05fr] sm:gap-[18px] ${i ? "border-t border-white/8" : ""}`}><span className="text-[13px] font-medium text-white">{signal}</span><span className="text-[13px] leading-[1.5] text-white/52">{diagnosis}</span></div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={c.planTitle} body={c.planIntro} />
        <figure className="mb-[16px] overflow-hidden rounded-[18px] border border-white/10 bg-[#05191c]">
          <ResponsiveImage
            src={`/blog/upwork-start-2026-checklist/${lang}/step-5.jpg`}
            alt={lang === "ru" ? "План запуска на 14 дней: услуга, профиль, отклики и цифры" : "A 14-day launch plan: service, profile, proposals, and numbers"}
            width={1600}
            height={900}
            loading="lazy"
            widths={[480, 800]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block w-full"
          />
        </figure>
        <div className="relative grid gap-[10px] md:grid-cols-5">
          <div className="absolute left-[7%] right-[7%] top-[25px] hidden h-px bg-gradient-to-r from-transparent via-[#9cfb51]/45 to-transparent md:block" />
          {c.plan.map(([days, title, items], i) => (
            <article key={days} className="relative rounded-[14px] border border-white/10 bg-[#0b2023] p-[14px]">
              <span className="relative z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#9cfb51] font-['Unbounded',sans-serif] text-[9px] font-bold text-[#011417]">{i + 1}</span>
              <p className="mt-[15px] text-[10px] font-bold uppercase tracking-[1px] text-[#9cfb51]">{days}</p>
              <h3 className="mt-[7px] text-[14px] font-bold leading-[1.35] text-white">{title}</h3>
              <ul className="mt-[11px] space-y-[6px]">{items.map((item) => <li key={item} className="flex gap-[6px] text-[11px] leading-[1.35] text-white/48"><Check className="mt-[1px] h-[11px] w-[11px] shrink-0 text-[#9cfb51]" />{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={c.finalChecklistTitle} />
        <div className="grid gap-[10px] md:grid-cols-2">
          {c.finalGroups.map(([title, items], i) => (
            <details key={title} open={i === 0} className={`group rounded-[14px] border border-white/10 bg-white/[0.025] ${i === c.finalGroups.length - 1 ? "md:col-span-2" : ""}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-[16px] py-[14px] text-[14px] font-bold text-white"><span>{title}</span><span className="text-[#9cfb51] transition group-open:rotate-45">+</span></summary>
              <div className="border-t border-white/8 px-[16px] py-[14px]">
                {items.map((item) => <p key={item} className="mb-[8px] flex items-start gap-[8px] text-[12px] leading-[1.45] text-white/56 last:mb-0"><Check className="mt-[1px] h-[13px] w-[13px] shrink-0 text-[#9cfb51]" />{item}</p>)}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={c.mistakesTitle} />
        <ol className="grid gap-[8px] sm:grid-cols-2">
          {c.mistakes.map((mistake, i) => (
            <li key={mistake} className="flex items-center gap-[11px] rounded-[12px] border border-white/8 bg-white/[0.02] p-[12px] text-[13px] text-white/60"><span className="font-['Unbounded',sans-serif] text-[11px] font-bold text-white/28">{String(i + 1).padStart(2, "0")}</span>{mistake}</li>
          ))}
        </ol>
      </section>

      <section className="relative overflow-hidden rounded-[20px] border border-[#9cfb51]/25 bg-[#9cfb51] p-[24px] text-[#011417] md:p-[34px]">
        <Target className="absolute -right-[14px] -top-[16px] h-[130px] w-[130px] opacity-[0.08]" />
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] opacity-55">{c.finishEyebrow}</p>
        <h2 className="mt-[10px] max-w-[620px] font-['Unbounded',sans-serif] text-[23px] font-bold leading-[1.2] tracking-[-0.5px] md:text-[30px]">{c.finishTitle}</h2>
        <p className="mt-[13px] max-w-[620px] text-[15px] font-medium leading-[1.6] opacity-70">{c.finishBody}</p>
      </section>

      <details className="rounded-[16px] border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center justify-between px-[18px] py-[16px] text-[14px] font-bold text-white"><span>{c.sourcesTitle}</span><Layers3 className="h-[17px] w-[17px] text-white/35" /></summary>
        <div className="border-t border-white/8 p-[18px]">
          <p className="mb-[14px] text-[12px] leading-[1.55] text-white/48">{c.sourcesNote}</p>
          <ul className="grid gap-[8px] sm:grid-cols-2">
            {sourceLinks.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-[7px] text-[12px] leading-[1.4] text-white/60 underline decoration-white/15 underline-offset-4 transition hover:text-[#9cfb51]"><ArrowRight className="h-[12px] w-[12px] shrink-0" />{label}</a></li>)}
          </ul>
        </div>
      </details>
    </div>
  );
}
