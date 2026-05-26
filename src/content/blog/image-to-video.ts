import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-26";

const COVER_RU = {
  src: "/blog/image-to-video/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про нейросеть для видео и промпты image-to-video",
};

const COVER_EN = {
  src: "/blog/image-to-video/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for an image to video AI prompting guide",
};

const ru: BlogPostLocale = {
  slug: "image-to-video",
  title: "Нейросеть для видео: промпт image-to-video",
  excerpt:
    "Как превратить картинку в ролик: структура промпта, движение камеры, темп сцены и финальная проверка, чтобы нейросеть для видео не ломала кадр.",
  description:
    "Гайд по image-to-video: как описать сцену, камеру, движение и ограничения, чтобы нейросеть для видео превращала картинку в стабильный ролик.",
  category: "guide",
  tags: ["ai-video-gen", "workflow", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2"],
  body: {
    intro:
      "Нейросеть для видео превращает статичную картинку в короткий ролик, но качество зависит не от магии модели, а от промпта. Рабочий image-to-video запрос описывает исходный кадр, движение камеры, действие, свет, темп и ограничения. Если эти блоки заданы явно, модель меньше ломает лица, фон и композицию.",
    steps: [
      {
        title: "Опишите исходный кадр и будущий ролик",
        body:
          "Генерация видео по картинке начинается не с команды «сделай красиво», а с описания того, что уже есть в кадре и что должно измениться во времени. В первом предложении назовите субъект, фон, состояние сцены и желаемый результат: короткий продуктовый клип, атмосферный establishing shot, плавный портретный кадр или динамичный фрагмент для соцсетей. Такой промпт для видео дает модели опору: она понимает, какие элементы нужно сохранить, а какие можно анимировать.",
        before:
          "Оживи это изображение, сделай кинематографично.",
        after:
          "Image-to-video: сохранить композицию исходного кадра. Герой стоит на мокрой дороге у гор. Сделать короткий 5-секундный ролик: ветер двигает куртку, облака медленно расходятся, камера слегка приближается.",
        imageSrc: "/blog/image-to-video/ru/step-1.jpg",
      },
      {
        title: "Разложите промпт на сцену, героя, свет и темп",
        body:
          "Сильный image-to-video промпт состоит из четырех понятных блоков: сцена, герой, свет и темп. Сцена отвечает за фон и атмосферу, герой - за главный объект и его действие, свет - за настроение и читаемость кадра, темп - за скорость изменений. Если один блок пропущен, AI video generator сам додумывает его, и ролик часто уходит в лишнюю драму, хаотичную камеру или резкие изменения лица.",
        before:
          "Девушка на улице, видео, красиво, реалистично.",
        after:
          "Сцена: тихая вечерняя улица после дождя. Герой: девушка в светлом плаще идет вперед и смотрит в сторону. Свет: мягкие витрины, отражения на асфальте. Темп: медленно, без резких скачков.",
        imageSrc: "/blog/image-to-video/ru/step-2.jpg",
      },
      {
        title: "Задайте одно движение камеры",
        body:
          "Для короткого ролика лучше работает одно движение камеры: наезд, отъезд, облет, плавная панорама или статичная пауза. Комбинация «наезд + облет + дрон + резкий зум» почти всегда провоцирует дрожь и разрывы между кадрами. Укажите не только движение, но и запрет: без тряски, без смены ракурса, без внезапного монтажа. Так нейросеть для видео держит композицию стабильнее.",
        before:
          "Камера летит вокруг, приближается, потом резко уходит вверх.",
        after:
          "Камера: медленный наезд на 10%, уровень глаз, без вращения. Сохранить горизонт и положение героя. Без тряски, без смены объектива, без склеек.",
        imageSrc: "/blog/image-to-video/ru/step-3.jpg",
      },
      {
        title: "Проверьте лицо, руки, фон и темп перед рендером",
        body:
          "Перед запуском финальной генерации проверьте четыре риска: лицо, руки, фон и темп. Для людей явно просите сохранять черты лица, количество пальцев и пропорции тела. Для предметов фиксируйте форму, логотипы лучше не добавлять в кадр мелким текстом, а для фона запрещайте появление новых объектов. Отдельно задайте длительность: 4-6 секунд обычно безопаснее, чем длинный ролик с большим числом событий.",
        before:
          "Сделай 12 секунд, пусть персонаж идет, машет рукой, камера меняет ракурс, фон оживает.",
        after:
          "Длительность 5 секунд. Сохранить лицо, руки, одежду и фон. Движение только одно: герой делает полшага вперед, ткань слегка колышется. Без новых людей, без деформации рук, без смены сцены.",
        imageSrc: "/blog/image-to-video/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Как написать промпт для image-to-video?",
        a: "Начните с исходного кадра: кто или что в нем находится, где стоит субъект, какой фон и свет уже есть. Затем добавьте одно действие, одно движение камеры, длительность и ограничения. Хороший промпт для видео похож на короткий режиссерский бриф, а не на набор красивых тегов.",
      },
      {
        q: "Почему нейросеть для видео ломает лицо или фон?",
        a: "Чаще всего в промпте не указано, что нужно сохранить. Модель воспринимает картинку как материал для изменения и может перерисовать лицо, руки, одежду или фон. Добавляйте preserve-блок: сохранить лицо, пропорции, позу, одежду, фон и композицию; изменить только движение и свет.",
      },
      {
        q: "Какое движение камеры лучше задавать для короткого ролика?",
        a: "Самые надежные варианты - медленный наезд, легкий отъезд, плавная панорама или статичная пауза с движением внутри сцены. Для 4-6 секунд не стоит смешивать несколько движений. Чем проще траектория камеры, тем стабильнее image-to-video результат.",
      },
      {
        q: "Сколько текста можно оставлять на скрине или в кадре?",
        a: "Для обучающих скринов оставляйте крупные короткие слова и дублируйте смысл в тексте статьи и alt. В самом ролике лучше избегать мелкого текста: image-to-video модели могут смазывать буквы между кадрами, особенно при движении камеры.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "image-to-video",
  title: "Image to video AI: prompt workflow that works",
  excerpt:
    "A practical image-to-video workflow: define the source frame, camera motion, scene pace, and constraints so image to video AI outputs stay stable.",
  description:
    "Learn an image to video AI workflow: source frame, camera motion, scene pace, constraints, and a final check before rendering a stable clip.",
  category: "guide",
  tags: ["ai-video-gen", "workflow", "prompt-engineering"],
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["gpt-image-2"],
  body: {
    intro:
      "Image to video AI turns a still frame into a short clip, but the useful result comes from a structured prompt, not from a lucky render. A good image-to-video brief defines the source frame, camera motion, subject action, lighting, pace, and constraints so the model keeps identity, background, and composition stable.",
    steps: [
      {
        title: "Describe the source frame and the target clip",
        body:
          "Image-to-video generation starts with what the still frame already contains and what should change over time. In the first sentence, name the subject, setting, current state, and intended clip type: a product motion shot, an atmospheric establishing shot, a smooth portrait, or a social short. That gives the AI video generator a stable anchor: it knows which elements to preserve and which elements can move.",
        before:
          "Animate this image and make it cinematic.",
        after:
          "Image to video prompt: preserve the source composition. A person stands on a wet mountain road. Create a 5-second clip: jacket moves in the wind, clouds slowly open, camera gently pushes in.",
        imageSrc: "/blog/image-to-video/en/step-1.jpg",
      },
      {
        title: "Break the prompt into scene, subject, light, and pace",
        body:
          "A reliable image-to-video prompt has four plain blocks: scene, subject, light, and pace. Scene defines the environment and mood, subject defines the main object and action, light controls readability, and pace controls how quickly the frame changes. If one block is missing, the model guesses it, which often creates extra drama, chaotic camera motion, or identity drift.",
        before:
          "Woman outside, video, beautiful, realistic.",
        after:
          "Scene: quiet evening street after rain. Subject: woman in a light coat walks forward and glances aside. Light: soft shop-window reflections on wet asphalt. Pace: slow, no abrupt jumps.",
        imageSrc: "/blog/image-to-video/en/step-2.jpg",
      },
      {
        title: "Use one camera move",
        body:
          "Short clips work best with one camera move: push-in, pull-back, orbit, pan, or a steady hold. A prompt that asks for push-in, orbit, drone rise, and hard zoom at once usually causes shake and frame breaks. State the movement and the constraint together: no shake, no angle change, no sudden cut. This keeps image to video AI closer to the original composition.",
        before:
          "Camera flies around, pushes in, then rapidly rises overhead.",
        after:
          "Camera: slow 10% push-in, eye level, no rotation. Preserve horizon and subject position. No shake, no lens change, no cuts.",
        imageSrc: "/blog/image-to-video/en/step-3.jpg",
      },
      {
        title: "Check face, hands, background, and pace before render",
        body:
          "Before the final render, check four risk areas: face, hands, background, and pace. For people, explicitly preserve facial features, finger count, and body proportions. For objects, lock shape and material. For backgrounds, block new objects from appearing. Keep duration modest: 4-6 seconds is usually safer than a long clip with several events.",
        before:
          "Make it 12 seconds, the character walks, waves, camera changes angle, background comes alive.",
        after:
          "Duration 5 seconds. Preserve face, hands, outfit, and background. Motion only: the subject takes half a step forward, fabric moves slightly. No new people, no hand deformation, no scene change.",
        imageSrc: "/blog/image-to-video/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "How do you write an image to video prompt?",
        a: "Start with the source frame: who or what is present, where the subject sits, and what background and light already exist. Then add one action, one camera move, duration, and constraints. A strong prompt for video generation reads like a short director's brief, not a pile of aesthetic tags.",
      },
      {
        q: "Why does image to video AI distort faces or backgrounds?",
        a: "Usually the prompt does not say what to preserve. The model treats the still image as editable material and may redraw the face, hands, outfit, or background. Add a preserve block: keep face, proportions, pose, clothing, background, and composition; change only motion and light.",
      },
      {
        q: "What camera motion works best for short AI video clips?",
        a: "The safest options are a slow push-in, slight pull-back, smooth pan, or steady hold with movement inside the scene. For a 4-6 second clip, avoid stacking several camera moves. The simpler the camera path, the more stable the image-to-video result.",
      },
      {
        q: "How much text should appear in screenshots or video frames?",
        a: "For educational screenshots, keep text large and short, then repeat the meaning in the article body and alt text. In generated video frames, avoid small text because image-to-video models can smear letters between frames, especially when the camera moves.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
