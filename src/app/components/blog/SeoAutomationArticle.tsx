import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CircleAlert,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderKanban,
  KeyRound,
  Search,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import LocalizedLink from "../LocalizedLink";
import ResponsiveImage from "../ResponsiveImage";

type Lang = "ru" | "en";

const SLUG = "seo-pipeline-wordstat-codex";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";
const DOWNLOAD_URL = "/downloads/seo-automation-starter-kit.zip";

const ru = {
  routeLabel: "Что вы настроите",
  route: ["Спрос", "Реестр", "Бриф", "Статья", "Проверка"],
  outcomeTitle: "Не робот-публикатор, а управляемый конвейер",
  outcomeBody:
    "Система забирает повторяемую работу, но оставляет человеку решения. Вы подтверждаете тему, факты и публикацию. Codex читает правила проекта, собирает материалы, создаёт страницу и проверяет, что сайт не сломан.",
  outcomeList: [
    "подходит для услуг, магазинов, экспертов и локального бизнеса",
    "пишет одну подтверждённую статью за запуск",
    "помнит опубликованные темы и не создаёт дубли",
    "готовит русскую и английскую версии по одним правилам",
  ],
  beforeTitle: "Что понадобится до начала",
  beforeItems: [
    ["Сайт или проект", "Папка с файлами сайта либо доступ к системе публикации."],
    ["Codex", "Приложение, которое сможет прочитать проект и выполнить понятную команду."],
    ["Yandex Cloud", "Аккаунт для доступа к Wordstat API и отдельный сервисный аккаунт."],
    ["30-60 минут", "Чтобы один раз описать бизнес, аудиторию, ограничения и приоритеты."],
  ],
  codexSetupTitle: "Установите Codex и передайте ему папку сайта",
  codexSetupBody:
    "Для этого конвейера расширение Chrome не обязательно. Работа с файлами, проверками и публикацией происходит в приложении Codex. Расширение Opten можно использовать отдельно, когда вы хотите улучшить промпт в браузере.",
  codexSetupSteps: [
    "Откройте официальную страницу Codex app, скачайте версию для своей системы и запустите установщик.",
    "Войдите в тот же аккаунт ChatGPT, в котором вам доступен Codex.",
    "Соберите файлы сайта в одной папке. Если сайт хранится в GitHub, попросите разработчика один раз помочь скачать проект.",
    "В Codex нажмите добавление проекта и выберите папку сайта. Не выбирайте весь диск или домашнюю папку.",
    "Начните с безопасной проверки без изменений. Только после отчёта разрешайте настраивать автоматизацию.",
  ],
  codexPromptLabel: "Первая команда для проверки проекта",
  codexPrompt:
    "Изучи этот проект без изменений. Найди, где хранятся статьи, SEO-поля, изображения, языковые версии, sitemap и команда сборки. Объясни результат простыми словами. Не публикуй сайт и не меняй файлы.",
  safetyTitle: "Где нужно остановиться и сделать действие самому",
  safetyBody:
    "Вход, капча, двухфакторная проверка, принятие условий, подключение биллинга и создание секретного ключа выполняются владельцем аккаунта. Не отправляйте API-ключ в чат и не добавляйте его в публичные файлы сайта.",
  demandEyebrow: "Шаг 1. Wordstat",
  demandTitle: "Сначала найдите спрос, потом выбирайте тему",
  demandBody:
    "Начните с 5-10 обычных фраз, которыми клиент мог бы назвать вашу услугу. Для стоматологии это могут быть «имплантация зубов», «цена брекетов» и «болит зуб ночью». Для производства мебели: «кухня на заказ», «шкаф в нишу» и «гардеробная по размерам». Система расширит эти фразы и сохранит связанные запросы.",
  demandCards: [
    ["Широкая частотность", "Показывает размер темы и соседние формулировки. Нужна для исследования."],
    ["Точная формулировка", "Помогает понять спрос на конкретную фразу. Нужна для приоритета."],
  ],
  demandWarning:
    "Число в Wordstat не равно людям, покупателям или продажам. Это показы запросов за период. Частотность помогает сравнивать темы, но не гарантирует трафик.",
  wordstatTitle: "Как подключить Wordstat без программирования",
  wordstatSteps: [
    "Войдите в Yandex Cloud и создайте платёжный аккаунт по официальной инструкции.",
    "Создайте отдельный сервисный аккаунт для автоматизации.",
    "Выдайте только те роли, которые нужны для Wordstat API.",
    "Создайте API-ключ и сохраните его в секретном хранилище системы.",
    "Попросите Codex проверить соединение на одном тестовом запросе.",
  ],
  registryEyebrow: "Шаг 2. Память системы",
  registryTitle: "Один реестр тем защищает от дублей и хаоса",
  registryBody:
    "Не создавайте новую папку с брифами каждую неделю. Держите единственный реестр. В нём система видит, какая тема ждёт работу, какая отложена, а какая уже опубликована. После закрытия приложения очередь остаётся на месте.",
  registryFields: [
    ["Запрос", "основная формулировка из Wordstat"],
    ["Намерение", "что человек хочет узнать или сделать"],
    ["Адрес", "будущий URL без пересечения с существующими страницами"],
    ["Статус", "queued, deferred, published, parked или rejected"],
    ["Источник", "ссылка и дата проверки данных"],
  ],
  briefEyebrow: "Шаг 3. Контекст бизнеса",
  briefTitle: "Бриф превращает одинаковый конвейер в систему под любую сферу",
  briefBody:
    "Инструменты остаются теми же, а содержание меняется через бриф. Он не требует технических терминов. Отвечайте как владельцу или маркетологу: что продаёте, кому, где работаете, почему выбирают вас и какие обещания нельзя давать.",
  briefQuestions: [
    "Какой продукт или услуга приоритетны?",
    "Кто покупатель и в каком регионе он находится?",
    "Какие вопросы чаще всего задают до заявки?",
    "Какие факты можно подтвердить документами или ссылками?",
    "Куда вести читателя: форма, звонок, каталог или консультация?",
    "Какие темы, формулировки и конкуренты исключены?",
  ],
  rulesTitle: "Второй файл описывает не бизнес, а сам сайт",
  rulesBody:
    "Codex должен знать, где лежат статьи, как называется компонент страницы, какие SEO-поля обязательны, какой размер нужен изображениям, какой командой проверяется сборка и как происходит публикация. Это записывается один раз в проектных правилах.",
  commandEyebrow: "Шаг 4. Запуск",
  commandTitle: "После настройки достаточно одной команды",
  command: "Напиши SEO-статью",
  commandBody:
    "Codex берёт следующую подтверждённую тему, формирует бриф из реестра и правил, создаёт статью, локализует её, добавляет изображения и запускает проверки. За один запуск создаётся ровно одна статья, чтобы её можно было спокойно прочитать и принять.",
  commandFlow: [
    ["01", "Берёт тему", "Только со статусом queued и без дубля."],
    ["02", "Собирает бриф", "Запрос, намерение, бизнес, источники и CTA."],
    ["03", "Создаёт страницу", "Текст, SEO-поля, изображения и обе локали."],
    ["04", "Проверяет", "Факты, ссылки, schema, сборку и мобильный экран."],
    ["05", "Ждёт подтверждение", "Публикация остаётся отдельным решением."],
  ],
  verifyEyebrow: "Шаг 5. Контроль",
  verifyTitle: "Автоматизация заканчивается не текстом, а живой проверенной страницей",
  verifyBody:
    "Даже хороший черновик не готов к публикации. Система должна подтвердить техническую целостность, а человек - смысл и достоверность. Только после двух проверок тема получает статус published.",
  verifyCards: [
    ["Факты", "Все цифры, характеристики и правила имеют источник. Нет придуманных кейсов."],
    ["SEO", "Уникальные title, description, H1, canonical, hreflang, schema и sitemap."],
    ["Мобильный экран", "Текст читается, изображения не обрезаны, кнопки доступны пальцем."],
    ["Сборка", "Проект собирается без ошибок, а живой URL отдаёт новую страницу."],
  ],
  downloadEyebrow: "Материалы",
  downloadTitle: "Скачайте стартовый набор и заполните его своими словами",
  downloadBody:
    "Внутри ZIP лежат готовый бриф, реестр тем, инструкция первого запуска и чек-лист публикации. Есть русская и английская версии. Код внутри файлов не нужен: поля можно заполнить в обычном редакторе и отдать Codex вместе с проектом.",
  downloadCta: "Скачать набор ZIP",
  downloadMeta: "8 файлов · RU + EN · Markdown и CSV",
  downloadFiles: ["Бриф бизнеса", "Реестр тем", "Первый запуск", "Чек-лист статьи"],
  pilotEyebrow: "Безопасный старт",
  pilotTitle: "Первая неделя: одна статья вместо огромной контент-фабрики",
  pilotSteps: [
    ["1", "Выберите один сайт", "Не подключайте все проекты одновременно."],
    ["2", "Запишите 5-10 фраз", "Используйте язык реальных клиентов, а не профессиональный жаргон."],
    ["3", "Подтвердите три темы", "Сравните спрос, пользу для бизнеса и существующие страницы."],
    ["4", "Создайте одну статью", "Прочитайте обе версии и пройдите чек-лист."],
    ["5", "Проверьте живой URL", "Только после этого расширяйте очередь или добавляйте расписание."],
  ],
  noPromise:
    "Такой конвейер ускоряет исследование и производство, но не гарантирует позиции, трафик или продажи. Результат зависит от спроса, сайта, конкуренции, качества продукта, дистрибуции и времени.",
  courseEyebrow: "Курс Opten",
  courseTitle: "Хотите собрать всю контент-систему на одном проекте?",
  courseBody:
    "На курсе вы соедините задачу, промпты, тексты, изображения, видео и сайт в связный проект, который можно показывать клиентам и развивать дальше.",
  courseCta: "Открыть программу курса",
  sourcesTitle: "Официальные инструкции",
  sourcesNote:
    "Интерфейс, тарифы и лимиты сервисов меняются. Перед подключением сверяйтесь с актуальной документацией. Ссылки ниже проверены при публикации статьи 6 августа 2026 года.",
  sources: [
    ["Codex app", "https://openai.com/index/introducing-the-codex-app/"],
    ["Платёжный аккаунт Yandex Cloud", "https://yandex.cloud/ru/docs/billing/quickstart/"],
    ["Сервисный аккаунт", "https://yandex.cloud/ru/docs/iam/quickstart-sa"],
    ["API-ключ", "https://yandex.cloud/ru/docs/iam/operations/authentication/manage-api-keys"],
    ["Wordstat API", "https://yandex.cloud/ru/docs/search-api/operations/wordstat-gettop"],
  ],
};

const en = {
  routeLabel: "What you will build",
  route: ["Demand", "Registry", "Brief", "Article", "Review"],
  outcomeTitle: "A controlled pipeline, not an unsupervised publisher",
  outcomeBody:
    "The system handles repetitive work while people keep the decisions. You approve the topic, claims, and publication. Codex reads the project rules, assembles the materials, creates the page, and checks that the website still works.",
  outcomeList: [
    "works for services, stores, experts, and local businesses",
    "creates one approved article per run",
    "remembers published topics and prevents duplicates",
    "produces Russian and English versions under the same rules",
  ],
  beforeTitle: "What you need before you start",
  beforeItems: [
    ["Website or project", "A folder with website files or access to the publishing system."],
    ["Codex", "The application that reads the project and follows a plain-language command."],
    ["Yandex Cloud", "An account for Wordstat API access and a separate service account."],
    ["30-60 minutes", "Time to describe the business, audience, restrictions, and priorities once."],
  ],
  codexSetupTitle: "Install Codex and give it the website folder",
  codexSetupBody:
    "This pipeline does not require a Chrome extension. File work, checks, and publication happen in the Codex app. You can use the Opten extension separately when you want to improve an individual prompt in the browser.",
  codexSetupSteps: [
    "Open the official Codex app page, download the version for your system, and run the installer.",
    "Sign in with the ChatGPT account that has access to Codex.",
    "Put the website files in one folder. If the site lives in GitHub, ask a developer to help download the project once.",
    "Add a project in Codex and select the website folder. Do not select an entire drive or home folder.",
    "Begin with a read-only inspection. Allow automation changes only after you understand the report.",
  ],
  codexPromptLabel: "First command for the project inspection",
  codexPrompt:
    "Inspect this project without making changes. Find where articles, SEO fields, images, language versions, the sitemap, and the build command are stored. Explain the result in plain language. Do not publish the website or edit files.",
  safetyTitle: "Where you should stop and take over",
  safetyBody:
    "The account owner handles sign-in, CAPTCHA, two-factor checks, terms, billing, and secret-key creation. Never paste an API key into chat or commit it to public website files.",
  demandEyebrow: "Step 1. Wordstat",
  demandTitle: "Find demand before you choose the topic",
  demandBody:
    "Start with 5-10 phrases a customer might use for your service. A dental clinic could begin with “dental implants,” “braces cost,” and “toothache at night.” A furniture maker could use “custom kitchen,” “built-in wardrobe,” and “made-to-measure closet.” The system expands these seeds and stores related searches.",
  demandCards: [
    ["Broad frequency", "Reveals the size of a topic and related wording. Use it for discovery."],
    ["Exact phrase", "Helps estimate demand for one formulation. Use it for priority."],
  ],
  demandWarning:
    "A Wordstat number does not equal people, buyers, or sales. It represents query impressions for a period. Frequency helps compare topics, but it does not guarantee traffic.",
  wordstatTitle: "How to connect Wordstat without coding",
  wordstatSteps: [
    "Sign in to Yandex Cloud and create a billing account from the official guide.",
    "Create a separate service account for the automation.",
    "Grant only the roles required by the Wordstat API.",
    "Create an API key and save it in the system's secret store.",
    "Ask Codex to test the connection with one sample query.",
  ],
  registryEyebrow: "Step 2. System memory",
  registryTitle: "One topic registry prevents duplicates and disorder",
  registryBody:
    "Do not create a fresh brief folder every week. Keep one registry. It shows which topic is queued, deferred, or already published. The queue survives when the application closes, so the next run continues from the correct place.",
  registryFields: [
    ["Query", "the primary formulation from Wordstat"],
    ["Intent", "what the searcher wants to learn or do"],
    ["Address", "the future URL with no overlap with existing pages"],
    ["Status", "queued, deferred, published, parked, or rejected"],
    ["Source", "a link and the date the information was checked"],
  ],
  briefEyebrow: "Step 3. Business context",
  briefTitle: "The brief adapts the same pipeline to any industry",
  briefBody:
    "The tools stay the same while the brief changes the content. No technical language is required. Answer like an owner or marketer: what you sell, who buys it, where you operate, why customers choose you, and which promises you cannot make.",
  briefQuestions: [
    "Which product or service has priority?",
    "Who is the customer and where are they located?",
    "Which questions appear before a lead or purchase?",
    "Which facts can you support with documents or links?",
    "Where should the reader go: form, call, catalog, or consultation?",
    "Which topics, wording, and competitors are excluded?",
  ],
  rulesTitle: "A second file describes the website itself",
  rulesBody:
    "Codex needs to know where articles live, which page component is used, which SEO fields are required, what image sizes are accepted, which command validates the build, and how publishing works. Record these project rules once.",
  commandEyebrow: "Step 4. Run",
  commandTitle: "After setup, one plain-language command is enough",
  command: "Write an SEO article",
  commandBody:
    "Codex takes the next approved topic, builds its brief from the registry and project rules, creates the article, localizes it, adds images, and runs the checks. Each run creates exactly one article so a person can read and approve it carefully.",
  commandFlow: [
    ["01", "Select topic", "Only a queued topic with no duplicate."],
    ["02", "Build brief", "Query, intent, business, sources, and CTA."],
    ["03", "Create page", "Copy, SEO fields, images, and both locales."],
    ["04", "Run checks", "Facts, links, schema, build, and mobile layout."],
    ["05", "Wait for approval", "Publication remains a separate decision."],
  ],
  verifyEyebrow: "Step 5. Control",
  verifyTitle: "Automation ends with a verified live page, not a draft",
  verifyBody:
    "Even a strong draft is not ready to publish. The system must confirm technical integrity while a person reviews meaning and accuracy. Only after both checks does the topic move to published.",
  verifyCards: [
    ["Facts", "Every number, product claim, and rule has a source. No invented cases."],
    ["SEO", "Unique title, description, H1, canonical, hreflang, schema, and sitemap."],
    ["Mobile", "Text is readable, images are not cropped, and controls are easy to tap."],
    ["Build", "The project compiles without errors and the live URL serves the new page."],
  ],
  downloadEyebrow: "Resources",
  downloadTitle: "Download the starter kit and complete it in your own words",
  downloadBody:
    "The ZIP contains a ready-made business brief, topic registry, first-run guide, and publication checklist. Russian and English versions are included. No code is required: complete the files in a regular editor and give them to Codex with the project.",
  downloadCta: "Download the ZIP kit",
  downloadMeta: "8 files · RU + EN · Markdown and CSV",
  downloadFiles: ["Business brief", "Topic registry", "First run", "Article checklist"],
  pilotEyebrow: "Safe start",
  pilotTitle: "Week one: one article, not a giant content factory",
  pilotSteps: [
    ["1", "Choose one website", "Do not connect every project at once."],
    ["2", "Write 5-10 phrases", "Use customer language instead of internal jargon."],
    ["3", "Approve three topics", "Compare demand, business value, and existing pages."],
    ["4", "Create one article", "Read both versions and complete the checklist."],
    ["5", "Check the live URL", "Expand the queue or add a schedule only after this works."],
  ],
  noPromise:
    "This pipeline speeds up research and production, but it cannot guarantee rankings, traffic, or sales. Results depend on demand, the website, competition, the product, distribution, and time.",
  courseEyebrow: "Opten course",
  courseTitle: "Want to build the full content system around one project?",
  courseBody:
    "The course connects the task, prompts, copy, images, video, and website into one coherent project you can show to clients and continue developing.",
  courseCta: "View the course program",
  sourcesTitle: "Official instructions",
  sourcesNote:
    "Interfaces, prices, and service limits change. Check the current documentation before setup. The links below were reviewed when this article was published on August 6, 2026.",
  sources: [
    ["Codex app", "https://openai.com/index/introducing-the-codex-app/"],
    ["Yandex Cloud billing account", "https://yandex.cloud/en/docs/billing/quickstart/"],
    ["Service account", "https://yandex.cloud/en/docs/iam/quickstart-sa"],
    ["API key", "https://yandex.cloud/en/docs/iam/operations/authentication/manage-api-keys"],
    ["Wordstat API", "https://yandex.cloud/en/docs/search-api/operations/wordstat-gettop"],
  ],
};

function Eyebrow({ children }: { children: string }) {
  return <p className="text-[12px] font-bold uppercase tracking-[1.4px] text-[#9cfb51]">{children}</p>;
}

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mt-[24px] overflow-hidden rounded-[16px] border border-white/10 bg-[#071c1f] shadow-[0_28px_70px_rgba(0,0,0,0.24)]">
      <ResponsiveImage
        src={src}
        alt={alt}
        width={1672}
        height={941}
        loading="lazy"
        widths={[480, 800]}
        sizes="(max-width: 840px) calc(100vw - 40px), 800px"
        className="block h-auto w-full"
      />
    </figure>
  );
}

export default function SeoAutomationArticle({ lang }: { lang: Lang }) {
  const c = lang === "ru" ? ru : en;
  const imageBase = `/blog/${SLUG}/${lang}`;

  return (
    <div className="mt-[44px]">
      <section aria-label={c.routeLabel} className="rounded-[18px] border border-white/10 bg-[#071c1f] p-[20px] md:p-[28px]">
        <Eyebrow>{c.routeLabel}</Eyebrow>
        <div className="mt-[18px] grid grid-cols-2 gap-[10px] sm:grid-cols-5">
          {c.route.map((item, index) => (
            <div key={item} className="relative rounded-[12px] border border-white/10 bg-[#011417] px-[12px] py-[14px]">
              <span className="text-[11px] font-bold text-[#9cfb51]">0{index + 1}</span>
              <p className="mt-[5px] text-[14px] font-medium text-white">{item}</p>
              {index < c.route.length - 1 && (
                <ArrowRight className="absolute -right-[8px] top-1/2 z-10 hidden h-[14px] w-[14px] -translate-y-1/2 text-[#9cfb51] sm:block" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[28px] grid gap-[16px] md:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[18px] border border-[#9cfb51]/25 bg-[#9cfb51]/[0.06] p-[22px] md:p-[28px]">
          <Workflow className="h-[30px] w-[30px] text-[#9cfb51]" aria-hidden="true" />
          <h2 className="mt-[18px] text-[24px] font-medium leading-[1.25] tracking-[-0.5px] text-white md:text-[28px]">{c.outcomeTitle}</h2>
          <p className="mt-[14px] text-[16px] leading-[1.7] text-white/72">{c.outcomeBody}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-[#071c1f] p-[22px]">
          <ul className="space-y-[14px]">
            {c.outcomeList.map((item) => (
              <li key={item} className="flex gap-[10px] text-[14px] leading-[1.55] text-white/72">
                <span className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#9cfb51] text-[#011417]">
                  <Check className="h-[13px] w-[13px]" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-[64px] border-t border-white/10 pt-[36px]">
        <h2 className="text-[25px] font-medium leading-[1.25] tracking-[-0.5px] text-white md:text-[30px]">{c.beforeTitle}</h2>
        <div className="mt-[22px] grid gap-[12px] md:grid-cols-2">
          {c.beforeItems.map(([title, body], index) => {
            const icons = [FileText, TerminalSquare, KeyRound, FolderKanban];
            const Icon = icons[index];
            return (
              <div key={title} className="rounded-[16px] border border-white/10 bg-[#071c1f] p-[20px]">
                <Icon className="h-[24px] w-[24px] text-[#9cfb51]" aria-hidden="true" />
                <h3 className="mt-[14px] text-[17px] font-medium text-white">{title}</h3>
                <p className="mt-[7px] text-[14px] leading-[1.6] text-white/62">{body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-[16px] rounded-[18px] border border-white/10 bg-[#071c1f] p-[22px] md:p-[28px]">
          <h3 className="text-[21px] font-medium text-white">{c.codexSetupTitle}</h3>
          <p className="mt-[10px] text-[15px] leading-[1.7] text-white/68">{c.codexSetupBody}</p>
          <ol className="mt-[18px] space-y-[12px]">
            {c.codexSetupSteps.map((item, index) => (
              <li key={item} className="flex gap-[12px] text-[14px] leading-[1.6] text-white/70">
                <span className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full border border-[#9cfb51]/40 text-[11px] font-bold text-[#9cfb51]">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <div className="mt-[20px] overflow-hidden rounded-[14px] border border-white/10 bg-[#001013]">
            <p className="border-b border-white/10 px-[16px] py-[10px] text-[11px] font-bold uppercase tracking-[1px] text-[#9cfb51]">{c.codexPromptLabel}</p>
            <p className="px-[16px] py-[15px] font-mono text-[13px] leading-[1.65] text-white/75">{c.codexPrompt}</p>
          </div>
        </div>
        <div className="mt-[16px] flex gap-[14px] rounded-[16px] border border-amber-300/20 bg-amber-300/[0.06] p-[20px]">
          <CircleAlert className="mt-[2px] h-[23px] w-[23px] shrink-0 text-amber-200" aria-hidden="true" />
          <div>
            <h3 className="text-[16px] font-medium text-white">{c.safetyTitle}</h3>
            <p className="mt-[7px] text-[14px] leading-[1.65] text-white/68">{c.safetyBody}</p>
          </div>
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.demandEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.demandTitle}</h2>
        <p className="mt-[16px] text-[16px] leading-[1.75] text-white/74">{c.demandBody}</p>
        <ArticleImage src={`${imageBase}/frame-1.jpg`} alt={c.demandTitle} />
        <div className="mt-[18px] grid gap-[12px] md:grid-cols-2">
          {c.demandCards.map(([title, body]) => (
            <div key={title} className="rounded-[16px] border border-white/10 bg-[#071c1f] p-[20px]">
              <Search className="h-[23px] w-[23px] text-[#9cfb51]" aria-hidden="true" />
              <h3 className="mt-[12px] text-[17px] font-medium text-white">{title}</h3>
              <p className="mt-[7px] text-[14px] leading-[1.6] text-white/62">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-[14px] rounded-[14px] border-l-[3px] border-[#9cfb51] bg-[#9cfb51]/[0.05] px-[18px] py-[16px] text-[14px] leading-[1.65] text-white/72">
          {c.demandWarning}
        </p>
        <div className="mt-[32px] rounded-[18px] border border-white/10 bg-[#071c1f] p-[22px] md:p-[28px]">
          <h3 className="text-[21px] font-medium text-white">{c.wordstatTitle}</h3>
          <ol className="mt-[18px] space-y-[13px]">
            {c.wordstatSteps.map((item, index) => (
              <li key={item} className="flex gap-[12px] text-[15px] leading-[1.6] text-white/70">
                <span className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full border border-[#9cfb51]/40 text-[11px] font-bold text-[#9cfb51]">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.registryEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.registryTitle}</h2>
        <p className="mt-[16px] text-[16px] leading-[1.75] text-white/74">{c.registryBody}</p>
        <ArticleImage src={`${imageBase}/frame-2.jpg`} alt={c.registryTitle} />
        <div className="mt-[20px] overflow-hidden rounded-[16px] border border-white/10">
          {c.registryFields.map(([field, description], index) => (
            <div key={field} className={`grid gap-[4px] bg-[#071c1f] px-[18px] py-[15px] sm:grid-cols-[140px_1fr] ${index ? "border-t border-white/10" : ""}`}>
              <span className="text-[13px] font-bold uppercase tracking-[0.8px] text-[#9cfb51]">{field}</span>
              <span className="text-[14px] leading-[1.55] text-white/66">{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.briefEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.briefTitle}</h2>
        <p className="mt-[16px] text-[16px] leading-[1.75] text-white/74">{c.briefBody}</p>
        <div className="mt-[24px] rounded-[18px] border border-white/10 bg-[#071c1f] p-[22px] md:p-[28px]">
          <ol className="grid gap-[12px] md:grid-cols-2">
            {c.briefQuestions.map((question, index) => (
              <li key={question} className="flex gap-[11px] rounded-[12px] bg-[#011417] p-[14px] text-[14px] leading-[1.55] text-white/72">
                <span className="font-bold text-[#9cfb51]">0{index + 1}</span>
                {question}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-[16px] rounded-[18px] border border-[#9cfb51]/20 bg-[#9cfb51]/[0.05] p-[22px]">
          <h3 className="text-[19px] font-medium text-white">{c.rulesTitle}</h3>
          <p className="mt-[10px] text-[15px] leading-[1.7] text-white/68">{c.rulesBody}</p>
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.commandEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.commandTitle}</h2>
        <div className="mt-[22px] overflow-hidden rounded-[16px] border border-[#9cfb51]/30 bg-[#001013] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-[7px] border-b border-white/10 px-[16px] py-[12px]" aria-hidden="true">
            <span className="h-[8px] w-[8px] rounded-full bg-white/20" />
            <span className="h-[8px] w-[8px] rounded-full bg-white/20" />
            <span className="h-[8px] w-[8px] rounded-full bg-[#9cfb51]" />
          </div>
          <div className="flex items-center gap-[12px] px-[18px] py-[22px] sm:px-[24px]">
            <TerminalSquare className="h-[24px] w-[24px] shrink-0 text-[#9cfb51]" aria-hidden="true" />
            <code className="font-mono text-[17px] text-white sm:text-[19px]">{c.command}</code>
          </div>
        </div>
        <p className="mt-[18px] text-[16px] leading-[1.75] text-white/74">{c.commandBody}</p>
        <ArticleImage src={`${imageBase}/frame-3.jpg`} alt={c.commandTitle} />
        <div className="mt-[20px] space-y-[10px]">
          {c.commandFlow.map(([number, title, body]) => (
            <div key={number} className="grid gap-[6px] rounded-[14px] border border-white/10 bg-[#071c1f] px-[18px] py-[16px] sm:grid-cols-[48px_150px_1fr] sm:items-center">
              <span className="text-[12px] font-bold text-[#9cfb51]">{number}</span>
              <span className="text-[15px] font-medium text-white">{title}</span>
              <span className="text-[14px] leading-[1.55] text-white/60">{body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.verifyEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.verifyTitle}</h2>
        <p className="mt-[16px] text-[16px] leading-[1.75] text-white/74">{c.verifyBody}</p>
        <ArticleImage src={`${imageBase}/frame-4.jpg`} alt={c.verifyTitle} />
        <div className="mt-[18px] grid gap-[12px] md:grid-cols-2">
          {c.verifyCards.map(([title, body], index) => {
            const icons = [Search, FileCheck2, ShieldCheck, TerminalSquare];
            const Icon = icons[index];
            return (
              <div key={title} className="rounded-[16px] border border-white/10 bg-[#071c1f] p-[20px]">
                <Icon className="h-[23px] w-[23px] text-[#9cfb51]" aria-hidden="true" />
                <h3 className="mt-[12px] text-[17px] font-medium text-white">{title}</h3>
                <p className="mt-[7px] text-[14px] leading-[1.6] text-white/62">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-[72px] overflow-hidden rounded-[18px] border border-[#9cfb51]/25 bg-[#071c1f]">
        <ArticleImage src={`${imageBase}/frame-5.jpg`} alt={c.downloadTitle} />
        <div className="p-[22px] md:p-[30px]">
          <Eyebrow>{c.downloadEyebrow}</Eyebrow>
          <h2 className="mt-[10px] text-[25px] font-medium leading-[1.25] tracking-[-0.5px] text-white md:text-[30px]">{c.downloadTitle}</h2>
          <p className="mt-[14px] text-[15px] leading-[1.7] text-white/70">{c.downloadBody}</p>
          <div className="mt-[18px] flex flex-wrap gap-[8px]">
            {c.downloadFiles.map((file) => (
              <span key={file} className="rounded-full border border-white/10 bg-[#011417] px-[12px] py-[7px] text-[12px] text-white/68">{file}</span>
            ))}
          </div>
          <div className="mt-[22px] flex flex-col gap-[12px] sm:flex-row sm:items-center">
            <a href={DOWNLOAD_URL} download className="inline-flex w-fit items-center gap-[9px] rounded-full bg-[#9cfb51] px-[20px] py-[12px] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(156,251,81,0.2)]">
              <ArrowDownToLine className="h-[17px] w-[17px]" aria-hidden="true" />
              {c.downloadCta}
            </a>
            <span className="text-[12px] text-white/45">{c.downloadMeta}</span>
          </div>
        </div>
      </section>

      <section className="mt-[72px] border-t border-white/10 pt-[36px]">
        <Eyebrow>{c.pilotEyebrow}</Eyebrow>
        <h2 className="mt-[10px] text-[26px] font-medium leading-[1.22] tracking-[-0.6px] text-white md:text-[32px]">{c.pilotTitle}</h2>
        <ol className="mt-[24px] space-y-[10px]">
          {c.pilotSteps.map(([number, title, body]) => (
            <li key={number} className="grid gap-[8px] rounded-[16px] border border-white/10 bg-[#071c1f] p-[18px] sm:grid-cols-[46px_180px_1fr] sm:items-center">
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#9cfb51] text-[12px] font-bold text-[#011417]">{number}</span>
              <span className="text-[16px] font-medium text-white">{title}</span>
              <span className="text-[14px] leading-[1.55] text-white/62">{body}</span>
            </li>
          ))}
        </ol>
        <p className="mt-[16px] rounded-[16px] border border-white/10 bg-[#011417] px-[18px] py-[17px] text-[14px] leading-[1.65] text-white/62">{c.noPromise}</p>
      </section>

      <section className="relative mt-[72px] overflow-hidden rounded-[18px] border border-white/10 bg-[#071c1f] p-[24px] md:p-[32px]">
        <div className="absolute -right-[90px] -top-[100px] h-[260px] w-[260px] rounded-full bg-[#9cfb51]/10 blur-[70px]" aria-hidden="true" />
        <div className="relative max-w-[620px]">
          <Eyebrow>{c.courseEyebrow}</Eyebrow>
          <h2 className="mt-[10px] text-[25px] font-medium leading-[1.25] tracking-[-0.5px] text-white md:text-[30px]">{c.courseTitle}</h2>
          <p className="mt-[14px] text-[15px] leading-[1.7] text-white/68">{c.courseBody}</p>
          <LocalizedLink to={COURSE_URL} className="mt-[20px] inline-flex items-center gap-[8px] rounded-full border border-[#9cfb51]/40 px-[18px] py-[11px] text-[14px] font-bold text-[#9cfb51] no-underline transition hover:bg-[#9cfb51] hover:text-[#011417]">
            {c.courseCta}
            <ArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </section>

      <section className="mt-[64px] border-t border-white/10 pt-[32px]">
        <h2 className="text-[22px] font-medium text-white">{c.sourcesTitle}</h2>
        <p className="mt-[10px] text-[14px] leading-[1.65] text-white/55">{c.sourcesNote}</p>
        <ul className="mt-[18px] grid gap-[9px] sm:grid-cols-2">
          {c.sources.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-[12px] rounded-[12px] border border-white/10 bg-[#071c1f] px-[14px] py-[12px] text-[13px] text-white/70 no-underline transition hover:border-[#9cfb51]/35 hover:text-white">
                {label}
                <ExternalLink className="h-[14px] w-[14px] shrink-0 text-[#9cfb51]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
