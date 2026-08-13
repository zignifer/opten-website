import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-08-14";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/web-design-with-ai/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Курсы веб-дизайна с ИИ: учебный проект от структуры до готового сайта",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Web design courses with AI from page structure to a finished website project",
};

const ru: BlogPostLocale = {
  slug: "web-design-with-ai",
  title: "Курсы веб-дизайна с ИИ: как учиться на практике",
  excerpt:
    "Курсы веб-дизайна стоит выбирать по учебному проекту. Разбираем, как выстроить обучение веб-дизайну: от структуры и Figma до ИИ, адаптива и проверки.",
  description:
    "Как выбрать курсы веб-дизайна и пройти обучение на практике: собрать структуру, дизайн сайта в Figma, материалы через ИИ и проверить адаптив на экранах.",
  category: "guide",
  tags: ["workflow", "ai-image-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-for-designers", "build-website-with-ai", "ai-courses-for-beginners"],
  body: {
    intro:
      "Курсы веб-дизайна полезны, если обучение ведет к законченному сайту, а не к набору разрозненных экранов. Хорошая программа связывает структуру страницы, типографику, сетку, дизайн сайта в Figma, адаптив и проверку на реальном устройстве. ИИ ускоряет поиск материалов и вариантов, но решения по макету остаются за дизайнером.",
    steps: [
      {
        title: "Выбирайте курс по итоговому проекту, а не по числу уроков",
        body:
          "Сначала посмотрите, что ученик должен показать в конце. Убедительный результат — не сертификат и не папка с упражнениями, а одна цельная страница: понятная задача, реальный текст, сетка, компоненты, мобильная версия и ссылка на работающий прототип или сайт. Затем проверьте программу. В ней нужны композиция, типографика, цвет, работа с содержанием, Figma, адаптив, базовая доступность и разбор правок. Если курсы для веб-дизайнера обещают только тренды, подбор референсов и десятки эффектов, знания будет трудно собрать в рабочий процесс. Количество часов тоже мало что говорит: важнее, сколько раз ученик получает обратную связь по одному проекту и исправляет конкретные решения.",
        imageSrc: "/blog/web-design-with-ai/ru/step-1.jpg",
      },
      {
        title: "Осваивайте веб-дизайн с нуля на одной странице",
        body:
          "Для первого проекта возьмите небольшой лендинг услуги, события или собственного продукта. Запишите аудиторию, предложение и одно главное действие. После этого соберите содержание без оформления: заголовок, аргументы, примеры, ответы на вопросы и финальный призыв. На основе текста сделайте черно-белый каркас, а уже потом ищите визуальное направление. Такой порядок не дает красивой картинке скрыть слабую структуру. Обучение веб-дизайну становится понятнее, когда один и тот же макет проходит весь цикл: содержание, каркас, визуальная система, адаптив, проверка и публикация. Пять незаконченных концепций обычно учат меньше, чем одна страница, которую пришлось переделать после теста.",
        imageSrc: "/blog/web-design-with-ai/ru/step-2.jpg",
      },
      {
        title: "Соберите дизайн сайта в Figma как систему",
        body:
          "Начните с ширины контейнера, колонок, отступов и нескольких размеров текста. Соберите кнопки, поля, карточки и навигацию как повторяемые компоненты, а не копии, разложенные по разным экранам. Затем проверьте иерархию: главный заголовок должен читаться первым, действие — находиться без поиска, а второстепенные детали не должны спорить с основной мыслью. Дизайн сайта в Figma полезно сразу смотреть в двух ширинах: большой экран показывает композицию, мобильный заставляет расставить приоритеты. Не ждите конца урока, чтобы заняться адаптивом. Если блок невозможно спокойно перестроить на узком экране, проблема часто уже есть в исходной структуре или слишком жестких размерах.",
        imageSrc: "/blog/web-design-with-ai/ru/step-3.jpg",
      },
      {
        title: "Отдайте ИИ материалы, но не весь интерфейс",
        body:
          "Практический кейс для учебного лендинга: в GPT Image 2 отправили запрос «сделай современный сайт керамической студии». Модель попыталась нарисовать весь экран внутри изображения: текст оказался нечитаемым, кнопки — декоративными, а сетку нельзя было редактировать. Задачу сузили до одного материала: 'Create only a 1600x900 editorial hero background for a small ceramics workshop website. One unfinished clay vessel on a dark worktable, soft side light, tactile dust and paper texture, subject in the right third, left 45% calm and empty for editable HTML copy. No text, letters, logos, buttons, browser frame, or UI.' Получился самостоятельный фон с чистой зоной слева. Его поставили в Figma, а заголовок, кнопку и сетку собрали обычными слоями. Opten помогает проверить такой промпт перед генерацией: формат, свободная зона и запреты не теряются в общей формулировке.",
        imageSrc: "/blog/web-design-with-ai/ru/step-4.jpg",
      },
      {
        title: "Проверьте макет на экранах и объясните свои решения",
        body:
          "Откройте прототип на ноутбуке и телефоне. Пройдите страницу без подсказок: понятна ли тема за несколько секунд, заметно ли главное действие, читается ли мелкий текст, удобно ли нажимать кнопки, не обрезаются ли изображения. Затем попросите другого человека выполнить одно действие и запишите место первой остановки. Исправляйте причину, а не украшайте симптом. В итоговом разборе покажите задачу, ограничения, структуру, сетку, два-три ключевых решения и результат проверки. Так курс по дизайну сайтов превращается в доказательство вашего мышления. ИИ-материалы можно включить в проект, если вы объясняете их роль и сохраняете исходные запросы, а не выдаете случайную генерацию за готовый интерфейс.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите свой проект с нейросетями",
          body:
            "На курсе вы проходите путь от промпта и визуальной идеи до изображений, видео, сайта и готовой презентации результата.",
          ctaLabel: "Посмотреть программу курса",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс Opten: практический проект с ИИ от идеи до сайта и презентации",
          },
        },
      },
    ],
    faq: [
      {
        q: "Как выбрать курсы веб-дизайна?",
        a: "Проверьте итоговый проект, программу и формат обратной связи. В хорошем курсе ученик собирает цельную страницу, работает с текстом и сеткой, делает мобильную версию, тестирует прототип и исправляет решения по конкретным замечаниям.",
      },
      {
        q: "Можно ли освоить веб-дизайн с нуля без художественного образования?",
        a: "Да. Начните с композиции, типографики, сетки и работы с содержанием на одном небольшом проекте. Художественный опыт помогает насмотренности, но первые интерфейсные решения можно разбирать по понятным критериям: иерархия, читаемость, последовательность и удобство действия.",
      },
      {
        q: "Нужно ли изучать Figma до начала курса?",
        a: "Нет, если программа объясняет базовые инструменты вместе с задачами макета. Не откладывайте проект ради изучения всех функций: освойте фреймы, стили, компоненты, автоматическую раскладку и прототипирование по мере необходимости.",
      },
      {
        q: "Как использовать ИИ во время обучения веб-дизайну?",
        a: "Поручайте ИИ ограниченные операции: варианты содержания, фон, предметный визуал или поиск слабых мест в техническом задании. Типографику, сетку, компоненты и адаптив собирайте в редакторе, чтобы макет оставался точным и изменяемым.",
      },
      {
        q: "Что должно войти в первый проект веб-дизайнера?",
        a: "Короткое описание задачи, структура страницы, черно-белый каркас, визуальная система, большой и мобильный макеты, интерактивный прототип, результаты простой проверки и финальная ссылка. Этого достаточно, чтобы показать не только картинку, но и ход решения.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "web-design-with-ai",
  title: "Web design courses with AI: a practical way to learn",
  excerpt:
    "Web design courses work best when they produce one finished site. Learn how to plan content, build in Figma, use AI for assets, and test responsive layouts.",
  description:
    "Compare web design courses by the project you finish. Learn page structure, Figma systems, AI-assisted assets, responsive design, and practical review.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "Web design courses are useful when they lead to a complete, testable website rather than a folder of disconnected screens. A sound learning path connects page structure, typography, layout, Figma components, responsive behavior, and review on real devices. AI can speed up source material and exploration, while the designer still owns every interface decision.",
    steps: [
      {
        title: "Judge the course by the finished project",
        body:
          "Start with the promised outcome. A certificate or a large lesson count doesn't prove that you'll learn web design. Look for one complete page with a clear purpose, real copy, a layout system, reusable components, a mobile version, and a working prototype or published link. Then read the syllabus for composition, typography, color, content hierarchy, Figma, responsive design, basic accessibility, and critique. Good web design courses return to the same project several times, so you can see what changed after feedback. A program built around trends, effects, and reference collections may feel busy without teaching you how to make and defend a decision.",
        imageSrc: "/blog/web-design-with-ai/en/step-1.jpg",
      },
      {
        title: "Learn web design through one complete page",
        body:
          "Choose a small landing page for a service, event, or personal project. Write down the audience, offer, and one primary action. Build the content before styling it: headline, supporting reasons, examples, answers to likely questions, and the final call to action. Turn that copy into a grayscale wireframe, then choose a visual direction. This order stops polish from hiding a weak structure. If you want to learn web design from scratch, taking one page through content, wireframe, visual system, responsive layout, testing, and publication gives each lesson context. One page you had to revise after a test often teaches more than five attractive concepts left unfinished.",
        imageSrc: "/blog/web-design-with-ai/en/step-2.jpg",
      },
      {
        title: "Build the Figma file as a system",
        body:
          "Set a container, columns, spacing scale, and a small type hierarchy before decorating individual sections. Create buttons, fields, cards, and navigation as reusable components instead of scattered copies. Check the reading order: the main headline should lead, the primary action should be easy to find, and supporting details shouldn't compete with it. Review the design at desktop and mobile widths from the start. Desktop reveals overall composition; mobile forces you to rank what matters. Don't treat responsive work as a final cleanup lesson. When a section refuses to fit a narrow screen, the underlying content order or fixed sizing may already be wrong.",
        imageSrc: "/blog/web-design-with-ai/en/step-3.jpg",
      },
      {
        title: "Use AI for source material, not the whole interface",
        body:
          "In a small ceramics-workshop project, the first GPT Image 2 instruction was “make a modern website for a ceramics studio.” The model drew an entire screen inside one image. Its copy was unreadable, the buttons were decorative, and none of the layout could be edited. The corrected prompt asked for one asset: 'Create only a 1600x900 editorial hero background for a small ceramics workshop website. One unfinished clay vessel on a dark worktable, soft side light, tactile dust and paper texture, subject in the right third, left 45% calm and empty for editable HTML copy. No text, letters, logos, buttons, browser frame, or UI.' The output supplied a usable background with clean space. The headline, button, grid, and responsive behavior were built as normal Figma layers. Opten can help catch missing format, copy space, and exclusions before that generation is sent.",
        imageSrc: "/blog/web-design-with-ai/en/step-4.jpg",
      },
      {
        title: "Test on real screens and explain your choices",
        body:
          "Open the prototype on a laptop and a phone. Move through it without design-tool overlays. Can you identify the subject quickly, find the primary action, read the smallest copy, tap each control, and see the images without awkward crops? Ask someone else to complete one action and note the first place they hesitate. Fix the cause instead of adding decoration. Your final case study should state the job, constraints, page structure, layout system, two or three important decisions, and what changed after testing. That turns a course project into evidence of design thinking. If AI produced any source assets, describe their limited role and keep the prompts with the project record.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build a complete project with AI",
          body:
            "The course takes you from a prompt and visual direction to images, video, a website, and a finished presentation of the result.",
          ctaLabel: "View the course program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Opten course project workflow from an AI idea to a website and final presentation",
          },
        },
      },
    ],
    faq: [
      {
        q: "How do I compare web design courses?",
        a: "Compare the final project, syllabus, and critique process. A useful course asks you to build a coherent page, work with real content and a layout system, create a mobile version, test the prototype, and revise decisions after specific feedback.",
      },
      {
        q: "Can I learn web design from scratch without an art background?",
        a: "Yes. Start with composition, typography, grids, and content hierarchy inside one small project. Art training can help visual judgment, but early interface decisions can be reviewed through concrete criteria such as readability, order, consistency, and ease of action.",
      },
      {
        q: "Do I need to know Figma before starting a course?",
        a: "Not if the course teaches the core tools alongside design tasks. Learn frames, styles, components, auto layout, and prototyping as the project needs them instead of delaying all design work until you've explored every feature.",
      },
      {
        q: "How should I use AI while learning web design?",
        a: "Give AI bounded jobs such as exploring copy, generating a background asset, or checking a brief for missing constraints. Build typography, layout, components, and responsive behavior in the editor so the interface remains accurate and editable.",
      },
      {
        q: "What belongs in a first web design project?",
        a: "Include the assignment, page structure, grayscale wireframe, visual system, desktop and mobile layouts, interactive prototype, a short testing record, and the final link. Together they show the reasoning behind the screen, not only its appearance.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
