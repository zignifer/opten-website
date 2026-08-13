import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-08-14";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/figma-course-beginners/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Figma-курс с нуля: фреймы, Auto Layout, компоненты и адаптивный макет",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "Figma tutorial for beginners with frames, Auto Layout, components, and a responsive interface",
};

const ru: BlogPostLocale = {
  slug: "figma-course-beginners",
  title: "Figma-курс с нуля: как учиться на одном макете",
  excerpt:
    "Figma-курс с нуля проще проходить на одном интерфейсе. Разбираем обучение Figma: фреймы, Auto Layout, компоненты, ИИ-материалы, адаптив и прототип.",
  description:
    "Практический Figma-курс с нуля: как освоить фреймы, Auto Layout, компоненты, собрать дизайн сайта в Figma и проверить адаптивный прототип на экранах.",
  category: "guide",
  tags: ["workflow", "ai-image-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["web-design-with-ai", "ai-for-designers", "build-website-with-ai"],
  body: {
    intro:
      "Хороший Figma-курс с нуля учит не отдельным кнопкам, а сборке изменяемого интерфейса. Возьмите один небольшой экран и последовательно освойте фреймы, Auto Layout, компоненты, стили, адаптив и прототип. ИИ можно подключить для отдельной иллюстрации или текста, но структура и редактируемые слои должны остаться в Figma.",
    steps: [
      {
        title: "Начните с фреймов и понятной структуры слоев",
        body:
          "Для первого задания достаточно экрана входа, карточки события или небольшого первого экрана сайта. Создайте фрейм нужной ширины и разложите содержимое по смыслу: навигация, заголовок, описание, действие, изображение. Каждый заметный блок поместите во вложенный фрейм и назовите по роли, а не по внешнему виду. Название `Primary action` полезнее, чем `Green button 2`, потому что цвет и размер еще изменятся. Не начинайте обучение Figma с рисования десятка экранов. Один аккуратный файл быстрее покажет, где вы понимаете вложенность, выравнивание и порядок слоев, а где пока двигаете элементы вручную и случайно ломаете соседние блоки.",
        imageSrc: "/blog/figma-course-beginners/ru/step-1.jpg",
      },
      {
        title: "Освойте Auto Layout на реальном содержании",
        body:
          "Auto Layout — автоматическая раскладка элементов внутри фрейма. Начните с кнопки: текст должен задавать ширину, а внутренние отступы — сохраняться при замене подписи. Затем соберите вертикальную карточку из изображения, заголовка, описания и действия. Настройте расстояния между элементами, выравнивание и режимы изменения размера. После этого замените короткий заголовок длинным и проверьте, растет ли карточка без наложений. Figma-уроки часто показывают функцию на идеальном примере, но навык появляется при неудобном содержании. Подставьте длинную фамилию, две строки описания и кнопку с развернутой подписью. Если макет выдерживает их без ручной перестановки, правила работают.",
        imageSrc: "/blog/figma-course-beginners/ru/step-2.jpg",
      },
      {
        title: "Соберите компоненты и состояния без копирования",
        body:
          "Когда кнопка или поле повторяется, превратите его в компонент. Свойства компонента должны менять то, что действительно варьируется: текст, иконку, размер или состояние. Для учебного поля ввода достаточно обычного, активного, заполненного и ошибочного состояния. Не создавайте отдельный главный компонент на каждую подпись. В экземпляре меняется содержимое, а общая геометрия и стиль приходят из одного источника. Затем исправьте радиус, отступ или цвет в главном компоненте и убедитесь, что обновились все экземпляры. Такой Figma-курс готовит к реальному файлу: вы не просто повторяете макет преподавателя, а строите правила, которые переживают правки и не расходятся между экранами.",
        imageSrc: "/blog/figma-course-beginners/ru/step-3.jpg",
      },
      {
        title: "Используйте ИИ как источник одного слоя",
        body:
          "Практический кейс: для экрана приложения о привычках в GPT Image 2 отправили запрос «сделай современный экран приветствия с растением». Модель нарисовала заголовок, кнопку и псевдоинтерфейс внутри картинки, поэтому результат нельзя было нормально редактировать. Запрос ограничили одной иллюстрацией: 'Create only a 1200x900 editorial illustration for a habit-tracking app onboarding screen. One small paper plant growing from a matte charcoal pot, soft side light, calm dark background, centered subject with generous clean margins. No text, letters, logos, buttons, cards, browser frame, phone frame, or UI.' Получился самостоятельный визуал без встроенного интерфейса. Его добавили в Figma одним растровым слоем, а текст, кнопку и отступы собрали компонентами. Opten помогает заранее заметить, что в промпте не хватает формата и запрета на UI.",
        imageSrc: "/blog/figma-course-beginners/ru/step-4.jpg",
      },
      {
        title: "Сделайте адаптив и проверьте прототип",
        body:
          "Для дизайна сайта в Figma соберите хотя бы две ширины: большую и мобильную. Не уменьшайте большой экран целиком. Решите, какие блоки меняют порядок, где карточки переходят в одну колонку, как сокращается навигация и какие поля растягиваются по ширине. Проверьте ограничения размера и Auto Layout на каждом уровне вложенности. Затем соедините основные состояния в прототипе и пройдите один короткий сценарий: открыть экран, выполнить действие, увидеть подтверждение или ошибку. Попросите другого человека сделать это без объяснений. Его первая остановка обычно полезнее еще одного часа косметических правок. В финале подготовьте понятные названия компонентов, стили, комментарии к нестандартным решениям и ссылку на выбранную стартовую точку прототипа.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите проект с ИИ от идеи до сайта",
          body:
            "На курсе вы создаете визуалы, видео, сайт и презентацию результата, сохраняя контроль над промптами и финальной сборкой.",
          ctaLabel: "Посмотреть программу курса",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс Opten: практический проект с ИИ, дизайном сайта и презентацией",
          },
        },
      },
    ],
    faq: [
      {
        q: "Как выбрать Figma-курс с нуля?",
        a: "Ищите программу, где вы собираете один цельный интерфейс, используете Auto Layout и компоненты, делаете мобильную версию, проверяете прототип и получаете обратную связь по редактируемому файлу. Количество записанных уроков само по себе мало говорит о практике.",
      },
      {
        q: "Сколько времени нужно, чтобы освоить Figma с нуля?",
        a: "Базовые операции можно освоить быстро, но уверенность появляется на нескольких циклах правок. Ориентируйтесь не на число дней, а на результат: вы можете собрать экран, изменить содержание без поломок, переиспользовать компоненты и объяснить структуру файла другому человеку.",
      },
      {
        q: "Какие Figma-уроки нужны начинающему в первую очередь?",
        a: "Начните с фреймов и слоев, затем переходите к Auto Layout, стилям, компонентам, свойствам и вариантам. После этого сделайте адаптивный экран и простой прототип. Плагины и редкие функции можно изучать под конкретную задачу.",
      },
      {
        q: "Можно ли сделать дизайн сайта в Figma без опыта?",
        a: "Да, если начать с небольшой страницы и реального содержания. Сначала соберите структуру и черно-белый каркас, затем настройте типографику, сетку, компоненты и мобильную версию. Не пытайтесь сразу проектировать большой сервис с десятками состояний.",
      },
      {
        q: "Как применять ИИ при обучении Figma?",
        a: "Поручайте ИИ ограниченные материалы: иллюстрацию, фон или варианты короткого текста. Просите не рисовать UI и не добавлять надписи внутрь изображения. Сам интерфейс собирайте редактируемыми слоями, Auto Layout и компонентами в Figma.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "figma-course-beginners",
  title: "Figma tutorial for beginners: learn through one interface",
  excerpt:
    "A Figma tutorial for beginners works best on one interface. Learn frames, Auto Layout, components, AI-assisted assets, responsive design, and prototyping.",
  description:
    "A practical Figma tutorial for beginners covering frames, Auto Layout, components, AI-assisted assets, responsive layouts, and a testable prototype.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 9,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "A useful Figma tutorial for beginners teaches you to build an interface that survives content changes, not memorize isolated tools. Start with one small screen and learn frames, Auto Layout, components, styles, responsive behavior, and prototyping in context. AI can supply one illustration or copy option, while the structure and editable layers stay in Figma.",
    steps: [
      {
        title: "Start with frames and a readable layer structure",
        body:
          "A login screen, event card, or compact landing hero is enough for the first exercise. Create a frame at the intended width and divide its content by meaning: navigation, headline, supporting copy, action, and image. Put each substantial block inside a nested frame and name it by its job instead of its current appearance. `Primary action` will still make sense after the button changes color; `Green button 2` won't. Don't begin a Figma course by drawing ten screens. One orderly file makes it much easier to see whether you understand nesting, alignment, and layer order or you're still positioning every object by hand and breaking nearby sections.",
        imageSrc: "/blog/figma-course-beginners/en/step-1.jpg",
      },
      {
        title: "Learn Auto Layout with difficult content",
        body:
          "Start with a button. Its label should define the width, while the internal padding stays consistent when the copy changes. Next, build a vertical card from an image, headline, description, and action. Set the gaps, alignment, and resizing behavior. Replace the short headline with a long one and check whether the card grows without overlaps. Many Figma tutorial examples use content that already fits, so the layout rule never faces a real test. Add a long name, a two-line description, and an extended button label. When the interface absorbs those changes without manual repositioning, the structure is doing useful work.",
        imageSrc: "/blog/figma-course-beginners/en/step-2.jpg",
      },
      {
        title: "Build components and states without duplicating the system",
        body:
          "Turn a repeated button or field into a component. Component properties should control the parts that truly vary, such as label, icon, size, or state. A beginner input component only needs a small set of useful states: default, focused, filled, and error. Don't create a new main component for every line of copy. The instance owns its content, while shared geometry and styling come from one source. Change the radius, spacing, or color in the main component and confirm that all instances update. A practical Figma course should teach this kind of repairable system instead of asking you to copy the instructor's finished screens.",
        imageSrc: "/blog/figma-course-beginners/en/step-3.jpg",
      },
      {
        title: "Use AI as the source of one layer",
        body:
          "For a habit-app onboarding screen, the first GPT Image 2 instruction was “make a modern welcome screen with a plant.” The model embedded a headline, button, and fake interface inside the image, leaving nothing useful to edit. The corrected prompt requested one asset: 'Create only a 1200x900 editorial illustration for a habit-tracking app onboarding screen. One small paper plant growing from a matte charcoal pot, soft side light, calm dark background, centered subject with generous clean margins. No text, letters, logos, buttons, cards, browser frame, phone frame, or UI.' The result was a clean illustration. It entered Figma as one raster layer, while copy, controls, and spacing remained normal components. Opten can help catch a missing format or UI exclusion before generation.",
        imageSrc: "/blog/figma-course-beginners/en/step-4.jpg",
      },
      {
        title: "Create responsive layouts and test the prototype",
        body:
          "For a website, build at least one large and one mobile width. Don't shrink the desktop design as a single object. Decide which blocks reorder, when cards collapse into one column, how navigation becomes compact, and which fields fill their container. Check resizing rules and Auto Layout at every nesting level. Connect the important states into a prototype, then complete one short scenario: open the screen, take an action, and receive confirmation or an error. Ask someone else to try without coaching. Their first hesitation is usually more informative than another round of cosmetic polish. Finish with clear component names, styles, notes for unusual decisions, and a link that opens at the correct prototype starting point.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build an AI project from idea to website",
          body:
            "The course covers visuals, video, a website, and a final presentation while keeping prompts and production decisions under your control.",
          ctaLabel: "View the course program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Opten course project combining AI assets, website design, and a final presentation",
          },
        },
      },
    ],
    faq: [
      {
        q: "How should I choose a Figma course?",
        a: "Look for a course where you build one coherent interface, use Auto Layout and components, create a mobile layout, test a prototype, and receive feedback on the editable file. A large library of recorded lessons doesn't guarantee that practice.",
      },
      {
        q: "How long does it take to learn Figma from scratch?",
        a: "The core tools are quick to understand, but confidence comes from several revision cycles. Measure progress by outcomes: you can build a screen, change its content without breaking it, reuse components, and explain the file structure to someone else.",
      },
      {
        q: "What should a Figma tutorial for beginners cover first?",
        a: "Start with frames and layers, then move to Auto Layout, styles, components, properties, and variants. Follow that with one responsive screen and a simple prototype. Learn plugins and less common features when a project actually needs them.",
      },
      {
        q: "Can I design a website in Figma without experience?",
        a: "Yes. Begin with a small page and real content. Build the structure and grayscale wireframe first, then add typography, a grid, reusable components, and a mobile layout instead of starting with a large product full of states.",
      },
      {
        q: "How can AI help while I learn Figma?",
        a: "Give AI bounded jobs such as producing an illustration, background, or short copy options. Tell it not to draw UI or embed text in the image. Build the interface itself with editable layers, Auto Layout, and components in Figma.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
