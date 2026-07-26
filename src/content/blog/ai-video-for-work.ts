import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-07-27";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-video-for-work/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Нейросети для видео: съемочный стол с товаром, камерой и раскадровкой",
};

const COVER_EN = {
  ...COVER_RU,
  alt: "AI video production table with a product, camera path, and storyboard frames",
};

const ru: BlogPostLocale = {
  slug: "ai-video-for-work",
  title: "Нейросети для видео: как делать ролики для работы и рекламы",
  excerpt:
    "Нейросети для видео помогают собрать товарный ролик, рекламу или сцену для контента. Результат зависит от исходного кадра, камеры и промпта.",
  description:
    "Нейросети для видео: как сделать ИИ-видео из текста или фото, описать сцену, камеру и движение, проверить физику и вручную подготовить ролик к монтажу.",
  category: "guide",
  tags: ["workflow", "ai-video-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["image-to-video", "kling-3-prompts", "ai-for-work"],
  body: {
    intro:
      "Нейросети для видео подходят для коротких товарных сцен, рекламных черновиков, заставок, роликов из фотографий и проверки визуальной идеи до съемки. Полезный результат начинается с выбора режима, исходного кадра и понятного промпта: кто находится в сцене, что движется, где стоит камера и какие детали нельзя менять.",
    steps: [
      {
        title: "Выберите формат: видео из текста или изображения",
        body:
          "Сначала решите, что у вас уже есть. Режим text-to-video, то есть видео по текстовому описанию, подходит для поиска сцены с нуля: атмосферы, действия, места и общего визуального направления. Режим image-to-video, или видео из изображения, нужен, когда внешний вид уже зафиксирован фотографией товара, иллюстрацией или первым кадром. Во втором случае промпт описывает прежде всего движение объекта и камеры, а не заново придумывает всю сцену.\n\nДля рабочей задачи начните с одного короткого результата: шестисекундный товарный кадр, заставка урока, фон для рекламного объявления или черновик пользовательского ролика. Не соединяйте сразу четыре сцены, диалог и сложный монтаж. Одна сцена быстрее показывает, насколько нейросеть для создания видео сохраняет объект, направление света и смысл исходной идеи.",
        before:
          "Сделай красивое рекламное видео с этим товаром, динамично и современно.",
        after:
          "Оживи исходное фото товара в одном шестисекундном кадре. Сохрани форму, этикетку и цвет упаковки. Добавь только медленное приближение камеры и мягкое движение блика справа налево. Без вращения товара, новых объектов и текста.",
        imageSrc: "/blog/ai-video-for-work/ru/step-1.jpg",
      },
      {
        title: "Опишите сцену и путь камеры до генерации",
        body:
          "Видеомодель должна понимать не только объект, но и постановку. Назовите место, время, свет, положение героя или товара, действие и точку съемки. Затем задайте одно движение камеры: медленное приближение, движение параллельно объекту, статичный кадр или плавный отъезд. Слова «кинематографично» и «динамично» не заменяют эту режиссуру.\n\nПрактический кейс: дизайнер Ника собирала в Kling 3.0 короткий ролик для флакона косметики. Первый запрос «стильная реклама флакона, камера красиво летает вокруг» дал эффектный свет, но камера резко меняла угол, а этикетка теряла форму. Ника зафиксировала флакон по центру, один шестисекундный план, медленное приближение на уровне товара, мягкий боковой свет и запрет на вращение упаковки. В результате получился спокойный черновик, который уже можно было отдать в монтаж.",
        before:
          "Стильная реклама флакона, камера красиво летает вокруг, дорогой свет.",
        after:
          "Один план длительностью 6 секунд. Матовый флакон стоит по центру на темном камне, этикетка обращена к камере. Камера на уровне товара медленно приближается без поворота. Мягкий боковой свет движется справа налево. Сохрани форму флакона и текстуру упаковки. Без вращения, резких смен ракурса и новых предметов.",
        imageSrc: "/blog/ai-video-for-work/ru/step-2.jpg",
      },
      {
        title: "Соберите промпт из шести связанных блоков",
        body:
          "Рабочий промпт для видео удобно собирать по порядку: объект, сцена, камера, движение, стиль и ограничения. Объект отвечает за то, что должно сохраниться. Сцена задает среду и свет. Камера определяет крупность, точку съемки и путь. Движение описывает одно наблюдаемое действие. Стиль задает визуальную обработку, а ограничения защищают лицо, упаковку, фон и другие важные детали.\n\nДля длинной сцены добавьте последовательность по секундам: начало, действие и финальный кадр. Но не превращайте промпт в список несвязанных пожеланий. Если герой идет, камера приближается, фон меняется и предмет появляется в руке одновременно, модель сама расставит приоритеты. Opten помогает разложить идею по блокам и заметить противоречия до запуска генерации.",
        before:
          "Девушка берет чашку, идет к окну, камера кружит, потом крупный план, уютно и красиво.",
        after:
          "0-2 секунды: девушка стоит у окна и держит чашку двумя руками. 2-5 секунд: она медленно поднимает чашку к лицу. Камера остается на уровне глаз и плавно приближается. Теплый утренний свет, один непрерывный кадр. Сохрани лицо, одежду и форму чашки. Без вращения камеры, смены комнаты и лишних людей.",
        imageSrc: "/blog/ai-video-for-work/ru/step-3.jpg",
      },
      {
        title: "Проверьте физику, бренд и пригодность для монтажа",
        body:
          "Первый ролик остается черновиком. Посмотрите его без звука и проверьте руки, контакт с предметами, инерцию ткани и жидкости, направление света, форму товара и поведение камеры. Затем остановите видео на нескольких кадрах: не изменились ли лицо, упаковка, логотип или фон. Красивое движение не спасает материал, если продукт перестает быть узнаваемым.\n\nДля рекламы добавьте обычную редакторскую проверку: соответствует ли сцена задаче, есть ли место для титра, можно ли склеить начало и конец, не обещает ли ролик того, чего нет в продукте. Такую работу можно оформить как услугу: раскадровка, промпт, генерация вариантов, отбор и подготовка черновика к монтажу. Это не замена съемочной группе, а быстрый способ проверить идею и собрать материал для следующего этапа.",
        before:
          "Выбираю самый эффектный вариант и сразу отдаю его клиенту.",
        after:
          "Проверяю покадрово форму товара, этикетку, физику движения, свет и путь камеры. Затем выбираю фрагмент, который поддерживает задачу рекламы и нормально стыкуется с титрами и монтажом.",
        imageSrc: "/blog/ai-video-for-work/ru/step-4.jpg",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите ИИ-видео как часть реального проекта",
          body:
            "На курсе вы проходите путь от технического задания и промпта до изображений, видео, сайта и рекламных материалов с понятной проверкой результата.",
          ctaLabel: "Смотреть курс",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс по ИИ-контенту: процесс от промпта до готового проекта",
          },
        },
      },
    ],
    faq: [
      {
        q: "Как сделать ИИ-видео?",
        a:
          "Выберите режим: видео по текстовому описанию или видео из изображения. Затем задайте одну сцену, объект, действие, точку съемки, движение камеры и ограничения. Сгенерируйте короткий черновик, проверьте физику и сохранность важных деталей, после чего доработайте один слабый блок.",
      },
      {
        q: "Какие нейросети для видео выбрать?",
        a:
          "Выбор зависит от исходника и задачи. Для ролика из готового кадра нужен режим видео из изображения, для поиска сцены с нуля - генерация по тексту. Сравнивайте модели на одном коротком задании и проверяйте сохранность объекта, управляемость камеры и пригодность результата для монтажа.",
      },
      {
        q: "Как написать промпт для видео?",
        a:
          "Опишите объект, сцену, положение камеры, одно движение, действие, свет, стиль и конкретные запреты. Для последовательной сцены добавьте этапы по секундам. Не заменяйте постановку словами «красиво» и «кинематографично»: модель должна понимать, что именно происходит в кадре.",
      },
      {
        q: "Как работает нейросеть для видео из фото?",
        a:
          "Исходное изображение фиксирует внешний вид первого кадра, а промпт задает движение объекта, камеры и света. Чем важнее сохранить товар или персонажа, тем точнее нужно описать неизменные детали и тем меньше новых действий стоит добавлять в один короткий ролик.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-video-for-work",
  title: "AI video tools for work: product clips, ads, and content",
  excerpt:
    "AI video tools can turn a product image or written scene into a useful draft. Results depend on the source frame, camera direction, motion, and constraints.",
  description:
    "Use AI video tools for product clips, ads, and content: choose image to video or text to video AI, direct the camera, control motion, and review every frame.",
  category: "guide",
  tags: ["workflow", "ai-video-gen", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["image-to-video", "kling-3-prompts", "ai-for-work"],
  body: {
    intro:
      "AI video tools work well for short product scenes, ad drafts, title sequences, animated photos, and testing a visual idea before a shoot. A useful result starts with the right mode, a strong source frame, and clear direction: who is in the scene, what moves, where the camera sits, and what must stay unchanged.",
    steps: [
      {
        title: "Choose text to video AI or image to video AI",
        body:
          "Start with what you already have. Text to video AI is useful when the scene begins as an idea and the model needs to establish the location, atmosphere, action, and visual direction. Image to video AI starts from an approved product photo, illustration, or first frame. In that mode, the prompt should focus on object motion and camera behavior instead of redesigning the whole scene.\n\nUse one short deliverable for the first test: a six-second product shot, a course opener, a background plate for an ad, or a UGC-style draft. Don't combine four locations, dialogue, and a complex edit on the first pass. One scene quickly shows whether the model preserves the subject, lighting direction, and the point of the original idea.",
        before:
          "Make a beautiful modern product ad from this image. Keep it dynamic.",
        after:
          "Animate the source product photo as one six-second shot. Preserve the package shape, label, and color. Add only a slow camera push-in and a soft highlight moving from right to left. No product rotation, new objects, or text.",
        imageSrc: "/blog/ai-video-for-work/en/step-1.jpg",
      },
      {
        title: "Direct the scene and camera before generation",
        body:
          "A video model needs staging, not just a subject. Name the location, time, light, product or character position, action, and camera point. Then choose one camera move: a slow push-in, parallel tracking, a locked shot, or a gentle pullback. Words such as “cinematic” and “dynamic” don't replace direction.\n\nNika was building a short cosmetics clip in Kling 3.0. Her first request, “stylish bottle ad, camera flies around beautifully,” produced attractive light but abrupt angle changes and an unstable label. She locked the bottle in the center, used one six-second shot, set a slow product-level push-in, added soft side light, and prohibited package rotation. The next draft was calm and coherent enough to move into editing.",
        before:
          "Stylish bottle ad, camera flies around beautifully, premium lighting.",
        after:
          "One six-second shot. A matte bottle stands centered on dark stone with the label facing camera. Product-level camera slowly pushes in without rotating. Soft side light moves right to left. Preserve bottle shape and package texture. No rotation, abrupt angle changes, or new props.",
        imageSrc: "/blog/ai-video-for-work/en/step-2.jpg",
      },
      {
        title: "Build the video prompt from six connected blocks",
        body:
          "A practical video prompt follows a clear order: subject, scene, camera, motion, style, and constraints. The subject block protects what must remain recognizable. Scene defines the environment and light. Camera sets framing, viewpoint, and path. Motion describes one visible action. Style controls the finish, while constraints protect the face, package, background, and other critical details.\n\nFor a longer scene, add a short timeline with a start, action, and final frame. Don't turn the prompt into unrelated wishes. If the person walks, the camera pushes in, the room changes, and a prop appears at the same time, the model has to choose its own priorities. Opten can expand the rough idea into connected blocks and catch contradictions before generation.",
        before:
          "A woman picks up a cup and walks to the window, camera circles, then close-up, cozy and beautiful.",
        after:
          "0-2 seconds: a woman stands by the window holding a cup with both hands. 2-5 seconds: she slowly raises it toward her face. Camera stays at eye level and gently pushes in. Warm morning light, one continuous shot. Preserve face, clothing, and cup shape. No orbit, room change, or extra people.",
        imageSrc: "/blog/ai-video-for-work/en/step-3.jpg",
      },
      {
        title: "Review physics, brand details, and editability",
        body:
          "The first clip is still a draft. Watch it without sound and inspect hands, contact with objects, fabric and liquid inertia, lighting direction, product shape, and camera behavior. Then pause on several frames. Check whether the face, package, logo, or background changes. Impressive motion doesn't help if the product stops looking like itself.\n\nFor an ad, run a normal editorial review too. Does the scene support the job? Is there room for copy? Can the opening and ending be cut cleanly? Does the clip imply something the product can't do? A freelancer can package this as a service: storyboard, prompt development, variants, selection, and a draft prepared for editing. It doesn't replace a production crew; it helps test an idea and prepare material for the next stage.",
        before:
          "I choose the most dramatic result and send it straight to the client.",
        after:
          "I inspect product shape, label, motion physics, light, and camera path frame by frame. Then I select the section that supports the ad goal and cuts cleanly with titles and the rest of the edit.",
        imageSrc: "/blog/ai-video-for-work/en/step-4.jpg",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build AI video as part of a complete project",
          body:
            "The course connects briefing and prompts with images, video, a website, and campaign materials through a practical review process.",
          ctaLabel: "View the course",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "AI content course workflow from prompt to a finished project",
          },
        },
      },
    ],
    faq: [
      {
        q: "How do I make an AI video?",
        a:
          "Choose text to video AI or image to video AI, then define one scene, subject, action, camera position, camera move, and constraints. Generate a short draft, inspect physics and identity, and revise the single weakest block before making another version.",
      },
      {
        q: "Which AI video tool should I choose?",
        a:
          "It depends on the input and job. Use image to video when an approved frame must guide the look, and text to video when the scene starts from a written idea. Compare models on the same short task, then judge subject preservation, camera control, and how easily the result can be edited.",
      },
      {
        q: "How do I write a video prompt?",
        a:
          "Describe the subject, scene, camera position, one camera move, action, light, style, and exact constraints. For a sequence, add a short timeline. Don't replace direction with “beautiful” or “cinematic”; the model needs to know what happens on screen.",
      },
      {
        q: "How does image to video AI work?",
        a:
          "The source image establishes the look of the first frame, while the prompt directs object, camera, and lighting motion. When product or character fidelity matters, define the details that cannot change and keep the number of new actions low.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
