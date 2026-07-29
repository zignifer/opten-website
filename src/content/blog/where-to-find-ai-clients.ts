import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-29";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/where-to-find-ai-clients/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Где брать заказы: набор с услугой, портфолио и планом поиска клиентов",
};

const COVER_EN = {
  src: "/blog/where-to-find-ai-clients/cover.jpg",
  width: 1600,
  height: 900,
  alt: "How to find freelance clients with a clear service, portfolio proof, and outreach plan",
};

const ru: BlogPostLocale = {
  slug: "where-to-find-ai-clients",
  title: "Где брать заказы на сайты и контент с ИИ: 5 рабочих каналов",
  excerpt:
    "Разбираем, где брать заказы на сайты, презентации и контент с ИИ: как упаковать услугу, начать поиск клиентов и написать без навязчивого спама.",
  description:
    "Где брать заказы на сайты, презентации и контент с ИИ: понятная услуга, поиск клиентов в пяти каналах, портфолио и первое сообщение без спама на практике.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 10,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-freelance-services", "make-money-with-ai", "ai-presentations"],
  body: {
    intro:
      "Если вы решаете, где брать заказы на сайты, презентации и контент с ИИ, начните не с рассылки, а с конкретной услуги и двух-трех кейсов. Первые задачи чаще приходят через знакомых, локальный бизнес, профессиональные сообщества, партнеров и биржи. Канал сработает, только если клиент сразу понимает результат, срок и границы работы.",
    steps: [
      {
        title: "Сначала решите, что именно вы продаете",
        body:
          "Клиенту редко важно, какую нейросеть вы открываете во время работы. Ему нужен лендинг к запуску, презентация к встрече, пять карточек товара или серия коротких роликов. Фраза «делаю контент с ИИ» не отвечает на три главных вопроса: что будет готово, когда и в каком объеме.\n\nСоберите услугу из результата, исходников, срока, числа вариантов и правок. Например: «Подготовлю структуру и тексты лендинга до семи блоков по вашим материалам за четыре рабочих дня, покажу два варианта первого экрана и внесу один круг правок». Такой формат проще сопоставить с задачей и бюджетом.\n\nНе перечисляйте все освоенные инструменты. Если вы одновременно предлагаете сайты, видео, логотипы, исследования и автоматизацию, первый контакт получается размытым. Выберите одну основную услугу и соседний результат, который логично к ней добавляется: презентация плюс визуальное направление или лендинг плюс тексты.",
        before: "Делаю сайты, дизайн и контент с помощью любых нейросетей.",
        after:
          "Соберу лендинг до 7 блоков по готовым материалам: структура, тексты, 2 варианта первого экрана и 1 круг правок за 4 рабочих дня.",
        imageSrc: "/blog/where-to-find-ai-clients/ru/step-1.jpg",
      },
      {
        title: "Соберите кейсы до активного поиска клиентов",
        body:
          "Портфолио можно начать без платных заказов, но учебную работу нужно честно так и назвать. Возьмите открытый или собственный материал, задайте ограничение и покажите не только красивый финал. Нормальный кейс включает задачу, слабый первый вариант, точную правку, готовый результат и ручную проверку.\n\nЛена решила искать заказы на дизайн для небольших брендов. Вместо описания «работаю с нейросетями» она собрала три коротких учебных кейса: карточку товара, первый экран лендинга и структуру презентации. Для карточки она использовала GPT Image 2. Первый запрос «Сделай премиальную карточку для этой сыворотки» изменил форму флакона и придумал свойства продукта.\n\nЛена переписала промпт: «Создай черновик карточки товара по приложенному фото. Сохрани форму флакона, крышку, этикетку и цвет. Используй только факты из списка ниже. Если данных не хватает, поставь [нужен факт]. Не добавляй свойства, логотипы и текст на упаковке». После этого она получила основу, вручную сверила упаковку и собрала страницу кейса с первым промптом, исправлением и итогом. Теперь потенциальный заказчик видел не случайную генерацию, а способ работы с ошибкой.",
        before: "Портфолио: несколько красивых генераций без задачи и объяснения.",
        after:
          "Кейс: задача → слабый первый результат → точная правка промпта → проверенный итог.",
        imageSrc: "/blog/where-to-find-ai-clients/ru/step-2.jpg",
      },
      {
        title: "Ищите первые задачи в пяти каналах",
        body:
          "Первый канал — знакомые, бывшие коллеги и текущие рабочие контакты. Не просите «дать любую работу». Коротко скажите, какую задачу теперь берете, и приложите один релевантный кейс. Второй канал — локальный бизнес и компании из понятной вам отрасли. Для поиска клиентов для бизнеса лучше выбрать двадцать подходящих компаний и внимательно посмотреть их материалы, чем отправлять одно письмо сотням адресатов.\n\nТретий канал — профессиональные сообщества: чаты дизайнеров, маркетологов, предпринимателей и авторов. Сначала отвечайте по делу, делитесь разбором и только потом предлагайте помощь, когда появляется подходящая задача. Четвертый — партнеры с соседней компетенцией. Разработчику нужен дизайнер, дизайнеру — автор текста, агентству — человек на презентации или быстрый визуальный прототип.\n\nПятый канал — биржи и доски проектов. Заказы на дизайн там видны сразу, но конкуренция и давление на цену выше. Отбирайте заявки с понятными исходниками и результатом, отвечайте конкретным кейсом, не покупайте доступ ко всему подряд. Каналы работают по-разному, поэтому фиксируйте не число сообщений, а диалоги, созвоны, тестовые задачи и оплаты.",
        before: "Разошлю одинаковое сообщение всем компаниям и подожду ответа.",
        after:
          "Выберу 20 подходящих контактов в двух каналах и для каждого приложу один кейс по его задаче.",
        imageSrc: "/blog/where-to-find-ai-clients/ru/step-3.jpg",
      },
      {
        title: "Пишите первое сообщение вокруг задачи клиента",
        body:
          "Хорошее первое сообщение помещается в четыре части. Первая — почему вы пишете именно этому человеку. Вторая — какое наблюдение сделали по его текущему материалу. Третья — какой ограниченный результат можете подготовить. Четвертая — ссылка на один похожий кейс и простой вопрос о том, актуальна ли задача.\n\nНапример: «Анна, увидел, что вы запускаете новый курс и уже собрали программу, но на странице пока нет короткого сравнения тарифов. Я проектирую небольшие лендинги по готовым материалам. Могу за два дня предложить структуру этого блока и два варианта первого экрана. Вот похожий учебный кейс с задачей, правкой и итогом. Актуально обсудить?»\n\nНе прикрепляйте незапрошенный полный редизайн и не давите выдуманным дедлайном. Один небольшой пример показывает инициативу; бесплатный готовый проект обесценивает границы еще до начала работы. Если ответа нет, допустимо один раз вежливо напомнить и закрыть контакт.",
        before: "Здравствуйте! Делаю все с ИИ быстро и недорого. Вам интересно?",
        after:
          "Увидел конкретную задачу → предложил ограниченный результат → приложил похожий кейс → задал один простой вопрос.",
        imageSrc: "/blog/where-to-find-ai-clients/ru/step-4.jpg",
      },
      {
        title: "Начните с небольшого платного этапа и превратите его в доказательство",
        body:
          "Первый проект не обязан быть большим. Предложите платную структуру, один экран, одну визуальную концепцию или короткий тестовый ролик. Письменно зафиксируйте исходники, результат, срок, число вариантов, правки и того, кто подтверждает факты и права на материалы. Это снижает риск для обеих сторон и не превращает тест в бесплатную полноценную работу.\n\nПосле сдачи спросите разрешение оформить кейс. Покажите задачу, ограничения, процесс, исправление ошибки и итог без закрытых данных. Затем попросите короткий отзыв или рекомендацию одному человеку, которому может быть полезна такая же услуга. Так поиск клиентов постепенно опирается не только на холодные сообщения, но и на доказательства.\n\nOpten можно использовать перед генерацией, чтобы превратить размытое пожелание клиента в промпт с задачей, контекстом, ограничениями и критериями проверки. Но клиентский результат все равно нужно проверить вручную. Не обещайте гарантированный рост продаж, идеальную генерацию с первого раза или полную автоматизацию.",
        before: "Сначала бесплатно сделаю весь проект, а потом обсудим сотрудничество.",
        after:
          "Согласуем небольшой платный этап, критерии приемки и один круг правок; после сдачи оформим кейс с разрешения клиента.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите цельный проект, который не стыдно показать клиенту",
          body:
            "На курсе вы связываете задачу, промпты, тексты, визуалы, видео и лендинг в один проверяемый кейс для портфолио.",
          ctaLabel: "Смотреть программу",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: от задачи и промпта до готового проекта для портфолио",
          },
        },
      },
    ],
    faq: [
      {
        q: "Где брать заказы новичку?",
        a:
          "Начните со знакомых и бывших коллег, локального бизнеса, профессиональных сообществ, партнеров и одной подходящей биржи. До сообщений подготовьте одну конкретную услугу и два-три учебных кейса. Отправляйте не общий список навыков, а один пример, близкий к задаче получателя.",
      },
      {
        q: "Как найти клиентов на дизайн?",
        a:
          "Выберите вид дизайна и отрасль, соберите несколько кейсов в одном формате и ищите компании с похожей задачей. Заказы на дизайн можно находить через знакомых, профильные чаты, партнеров-разработчиков, небольшие агентства и биржи. В первом сообщении покажите релевантный кейс и ограниченный результат.",
      },
      {
        q: "Как найти заказчиков без платной рекламы?",
        a:
          "Используйте теплые контакты, содержательные ответы в сообществах, партнерские рекомендации и точечные сообщения компаниям. Бесплатный канал все равно требует времени: нужно изучить получателя, выбрать подходящий кейс и вести учет диалогов. Массовый спам обычно дает слабый контакт и портит репутацию.",
      },
      {
        q: "Что писать в первом сообщении клиенту?",
        a:
          "Объясните, почему обращаетесь именно к нему, назовите одно наблюдение по задаче, предложите небольшой понятный результат, приложите один похожий кейс и спросите, актуально ли обсуждение. Уберите длинную биографию, перечень нейросетей, давление и обещания гарантированного результата.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "where-to-find-ai-clients",
  title: "How to find freelance clients for AI-assisted services",
  excerpt:
    "Learn how to find freelance clients by packaging one AI-assisted service, building credible portfolio proof, and using five focused outreach channels.",
  description:
    "How to find freelance clients for AI-assisted services: package one offer, build portfolio proof, use five channels, and write a focused first message.",
  category: "guide",
  tags: ["workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 10,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-freelance-services", "make-money-with-ai", "ai-presentations"],
  body: {
    intro:
      "To learn how to find freelance clients for AI-assisted websites, decks, or content, start with a specific service and two or three credible cases. Early work often comes through existing contacts, targeted businesses, professional communities, partners, and marketplaces. A channel only works when the buyer can see the outcome, timeline, and boundaries.",
    steps: [
      {
        title: "Define the result before you look for clients",
        body:
          "Most buyers don't care which model sits in the middle of your process. They need a launch page, a meeting deck, five product cards, or a short video series. “I create with AI” doesn't tell them what will be delivered, when it will arrive, or what the fee covers.\n\nPackage the service around an outcome, required inputs, turnaround, option count, and revision limit. A useful offer sounds like this: “I'll create the structure and copy for a landing page of up to seven sections from your approved materials, provide two hero directions, and complete one revision round in four business days.”\n\nAvoid a menu of every tool you've tested. Offering websites, video, logos, research, and automation in the same introduction makes it hard to refer or hire you. Pick one main service and, at most, one adjacent outcome that belongs in the same project.",
        before: "I make websites, design, and content with every major AI tool.",
        after:
          "I'll create a seven-section landing page from approved materials: structure, copy, two hero directions, and one revision round in four business days.",
        imageSrc: "/blog/where-to-find-ai-clients/en/step-1.jpg",
      },
      {
        title: "Build portfolio proof before active outreach",
        body:
          "You can build an initial portfolio without paid work, as long as practice projects are labeled honestly. Use your own or openly available source material, set a real constraint, and show more than the polished output. A useful case includes the job, weak first draft, exact revision, final result, and manual checks.\n\nLena wanted design clients among small consumer brands. Instead of describing herself as “an AI creative,” she built three short practice cases: a product card, a landing-page hero, and a presentation structure. She used GPT Image 2 for the product-card draft. Her first prompt, “Make a premium product card for this serum,” changed the bottle and invented product benefits.\n\nShe rewrote it: “Create a product-card draft from the attached photo. Preserve the bottle shape, cap, label, and color. Use only the approved facts below. Mark missing information as [fact needed]. Don't add benefits, logos, or package text.” The next draft gave her a usable base. She checked the package manually and documented the first prompt, correction, and result. A prospect could now see how she handled an error, not just a lucky generation.",
        before: "Portfolio: a gallery of attractive generations with no task or explanation.",
        after:
          "Case: task → weak first result → exact prompt revision → manually reviewed delivery.",
        imageSrc: "/blog/where-to-find-ai-clients/en/step-2.jpg",
      },
      {
        title: "Use five focused channels for early work",
        body:
          "Start with people who already know your work: former colleagues, existing professional contacts, and business owners in your network. Don't ask for “anything available.” Name the service and share one relevant case. Next, research businesses in a field you understand. Twenty carefully chosen companies are more useful than a generic message sent to hundreds.\n\nProfessional communities are the third channel. Answer real questions in design, marketing, founder, and creator groups before pitching. Fourth, build relationships with adjacent specialists. Developers need designers, designers need writers, and small agencies often need help with a deck, prototype, or short production sprint.\n\nMarketplaces and project boards are the fifth option. Demand is visible there, but price pressure and competition are higher. Filter for clear inputs and deliverables, answer with a matching case, and don't pay for access to every category. Track conversations, calls, paid trials, and completed jobs rather than raw message volume.",
        before: "I'll send the same introduction to every company I can find.",
        after:
          "I'll choose 20 suitable contacts across two channels and pair each message with one relevant case.",
        imageSrc: "/blog/where-to-find-ai-clients/en/step-3.jpg",
      },
      {
        title: "Write the first message around the client's job",
        body:
          "A useful first message has four parts: why you're contacting this person, one observation about the current material, a limited result you can deliver, and one related case followed by a simple question.\n\nFor example: “Anna, I saw that you're launching a course and already have the program, but the page doesn't yet compare the three plans. I design compact landing pages from approved materials. I can propose the structure for that section and two hero directions within two days. Here's a similar practice case showing the task, revision, and final result. Would it be useful to discuss?”\n\nDon't attach a full unsolicited redesign or create a fake deadline. One small, relevant example demonstrates initiative; an entire free project removes the boundaries before work begins. If there's no response, send one polite follow-up, then close the contact.",
        before: "Hi! I do everything with AI, fast and affordable. Interested?",
        after:
          "Name the specific job → offer a limited outcome → share one matching case → ask one simple question.",
        imageSrc: "/blog/where-to-find-ai-clients/en/step-4.jpg",
      },
      {
        title: "Turn a small paid stage into the next piece of proof",
        body:
          "The first engagement doesn't need to be large. Offer a paid outline, one page section, one visual direction, or a short test clip. Put the inputs, deliverable, timeline, option count, revisions, and responsibility for claims and source rights in writing. That reduces risk without turning the trial into unpaid production work.\n\nAfter delivery, ask permission to document the case. Show the job, constraints, process, one corrected mistake, and result without exposing private information. Then ask for a short review or an introduction to one person who may need the same service. Over time, referrals and proof reduce your dependence on cold outreach.\n\nOpten can help turn a loose client request into a prompt with the job, context, constraints, and review criteria before generation. The final work still needs manual review. Don't promise guaranteed sales, a perfect first generation, or a fully automated outcome.",
        before: "I'll complete the whole project for free, then we can discuss ongoing work.",
        after:
          "We'll agree on one small paid stage, acceptance criteria, and one revision round, then document the case with permission.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build one complete project you can show to a client",
          body:
            "The course connects the job, prompts, copy, visuals, video, and landing page into one coherent, reviewable portfolio case.",
          ctaLabel: "View the program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course workflow from client task and prompt to a portfolio-ready project",
          },
        },
      },
    ],
    faq: [
      {
        q: "How do beginners find freelance clients?",
        a:
          "Start with former colleagues and existing contacts, targeted local businesses, professional communities, adjacent partners, and one suitable marketplace. Prepare one specific service and two or three honest practice cases first. Share the example closest to the recipient's job instead of a broad skills list.",
      },
      {
        q: "How do I find design clients?",
        a:
          "Choose a type of design and a market, then build several cases in the same format. Look through referrals, design and founder communities, developer partners, small agencies, and project boards. In the first message, pair one relevant case with a limited result you can deliver.",
      },
      {
        q: "Can I find clients without paid advertising?",
        a:
          "Yes. Use warm contacts, useful participation in professional communities, partner referrals, and targeted outreach to suitable companies. Free channels still cost time: research each recipient, choose a matching case, and track conversations. Mass spam usually produces weak leads and damages trust.",
      },
      {
        q: "What should I write in a first outreach message?",
        a:
          "Say why you're contacting that person, name one observation about the job, offer a small and specific outcome, share one similar case, and ask whether the task is worth discussing. Remove the long biography, tool list, pressure, and promises of guaranteed results.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
