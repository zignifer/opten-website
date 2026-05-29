import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-29";

const COVER_RU = {
  src: "/blog/seedance-2-0/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про Seedance 2.0 — флагманскую видео-модель ByteDance",
};
const COVER_EN = {
  src: "/blog/seedance-2-0/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a guide to Seedance 2.0, ByteDance's flagship video generation model",
};

const ru: BlogPostLocale = {
  slug: "seedance-2-0",
  title: "Seedance 2.0: что нового и как писать промпты",
  excerpt:
    "Seedance 2.0 от ByteDance поддерживает до 9 изображений на входе, ролики до 15 секунд в 2K. Разбираем TRY CGI структуру промпта и разницу с Kling 3.0.",
  description:
    "Seedance 2.0: что изменилось против 1.5 Pro, TRY CGI структура промпта с примерами, правила image-to-video, кейс с физикой движения и сравнение с Kling 3.0.",
  category: "news",
  tags: ["ai-video-gen", "release-notes", "model-deep-dive"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["best-ai-video-2026", "image-to-video", "sora-2-vs-veo-3-1"],
  body: {
    intro:
      "Seedance 2.0 — флагманская видео-модель ByteDance с поддержкой multi-modal входа до 9 изображений и 15-секундных роликов в 2K. По сравнению с Seedance 1.5 Pro заметно лучше scene consistency, управление физикой и удержание субъекта между кадрами. Главная особенность: блочная TRY CGI структура промпта, которую модель читает как режиссёрский бриф.",
    steps: [
      {
        title: "Что изменилось в Seedance 2.0 против Seedance 1.5 Pro",
        body:
          "Самая частая ошибка при переходе с Seedance 1.x на 2.0 — использовать старый подход с простыми описательными промптами. В 1.x хватало «drone shot over a city at night, cinematic». В 2.0 та же фраза работает, но модель ждёт большего — если не дать ей структуру, результат будет случайным: или слишком статичным, или с артефактами движения.\n\nГлавные изменения 2.0: расширен multi-modal вход (до 9 изображений, 3 видео и 3 аудио-файла одновременно), улучшена scene consistency при смене планов, добавлена более точная работа с камерными движениями. Разрешение выросло до 2K при сохранении диапазона длительности 4–15 секунд. Также новая версия лучше удерживает физически правдоподобное движение — жидкость, ткань, инерцию объектов — при условии, что в промпте это явно указано.",
        imageSrc: "/blog/seedance-2-0/ru/step-1.jpg",
      },
      {
        title: "TRY CGI структура: как писать промпт для Seedance 2.0",
        body:
          "Seedance 2.0 читает промпт как режиссёрский бриф с именованными блоками. Это не просто совет — это прямое влияние на качество результата. Оптимальный порядок: ЛОКАЦИЯ → СТИЛЬ → СЮЖЕТ → ПЕРСОНАЖИ → СТРУКТУРА КАДРОВ (с таймингом 0–4с / 4–10с / 10–15с) → ЗВУК. Внутри каждого акта: Действие, Камера, Свет, VFX (опционально), Звук.\n\nВажно: блоки разделяются пустой строкой, после каждого заголовка — двоеточие и пробел. Английские технические якоря (`dolby-in`, `handheld`, `Ultra-photorealistic 4K`, `diegetic`) не переводятся даже в русском тексте — они работают как пресеты стиля. Для работы через syntx.ai промпт может быть на английском.\n\nOpten поддерживает Seedance 2.0 как отдельную модель: расширение подсветит недостающие блоки и слабые формулировки прямо в интерфейсе генератора.",
        before: "Drone shot over city at night, cinematic.",
        after:
          "ЛОКАЦИЯ: Ночной город, стеклянные небоскрёбы, тысячи огней внизу.\n\nСТИЛЬ: Ultra-photorealistic 4K cinematic, film grain, no AI look.\n\nСЮЖЕТ: Медленный дрон-облёт делового центра города.\n\nСТРУКТУРА КАДРОВ (10 СЕК):\n\n0-4с — [ЗАВЯЗКА]\n  Действие: Плавный подъём от уличного уровня к крышам.\n  Камера: Slow dolly-in, угол снизу вверх.\n  Свет: Тёплые уличные фонари, контровой неоновый отблеск.\n\n4-10с — [КУЛЬМИНАЦИЯ]\n  Действие: Широкий облёт небоскрёбов, панорама.\n  Камера: Slow crane, горизонтальная ось.\n  Звук: Diegetic only — слабый городской гул.",
        imageSrc: "/blog/seedance-2-0/ru/step-2.jpg",
      },
      {
        title: "Image-to-video: правила подготовки входного изображения",
        body:
          "Seedance 2.0 принимает до 9 изображений в формате jpeg/png/webp/bmp/tiff/gif весом до 30 МБ каждое. Ключевое ограничение платформы: реалистичные человеческие лица в загружаемых изображениях или видео блокируются модератором автоматически — это не баг, а политика платформы 即梦 (Jimeng). Для персонажей используйте анимационный стиль, иллюстрации или 3D-рендер.\n\nЧек-лист для хорошего image-to-video:\n— Изображение должно содержать чёткий субъект с понятной позой (неоднозначная поза = случайное направление анимации).\n— Если нужно удержать конкретный ракурс из исходника — укажите в промпте: `preserve camera angle from reference image`.\n— Для анимации нескольких объектов назначайте каждому референс-слот через `@image1`, `@image2` — без этого модель может их перепутать.\n— Задавайте тайминг для каждого объекта в СТРУКТУРЕ КАДРОВ явно, иначе модель выбирает произвольный темп.",
        imageSrc: "/blog/seedance-2-0/ru/step-3.jpg",
      },
      {
        title: "Кейс: первый рендер сломал физику движения — точная правка",
        body:
          "Named case: в Seedance 2.0 для промпта `city chase scene, sports car drifts around a sharp corner at high speed` первый рендер выглядел красиво, но машина просто скользила боком без физики — как будто её толкали сзади без инерции. Колёса не держали трение, кузов не кренился в повороте.\n\nОшибка была не в слове «дрифт» — модель его понимает. Проблема в отсутствии причинно-следственной цепочки: нет описания того, что происходит с шинами, подвеской и кузовом.\n\nТочная правка: `sports car enters left-to-right drift, rear wheels break traction first, tire smoke builds from rear axle, body rolls outward 15 degrees, front wheels steer into the slide to correct, camera tracks from low side angle`. После этого модель держала физику поворота правильно — кузов кренился, дым шёл от правильных колёс, передние рулили в занос. Правило переносится на любую физику в Seedance 2.0: описывайте причину движения, а не только его внешний вид.",
        imageSrc: "/blog/seedance-2-0/ru/step-4.jpg",
      },
      {
        title: "Seedance 2.0 vs Kling 3.0: когда выбирать какую модель",
        body:
          "Обе модели умеют text-to-video и image-to-video, обе дают 15-секундные ролики. Разница в акцентах.\n\nSeedance 2.0 лучше там, где сцена строится из нескольких модальностей: несколько входных изображений, аудио-сопровождение, синхронизация звука и действия. Если нужен сложный multi-shot с чётким тайминговым брифом — TRY CGI структура Seedance 2.0 здесь выигрывает. Также Seedance 2.0 немного точнее следует звуковым инструкциям (diegetic/non-diegetic разделение работает надёжно).\n\nKling 3.0 сильнее в удержании identity персонажа через несколько шотов и в character consistency при смене окружения. Если снимаете несколько сцен с одним персонажем — Kling 3.0 стабильнее. Для чистого text-to-video без сложного входа обе модели близки по качеству, разница зависит от конкретного промпта.\n\nКраткий критерий: multi-modal или TRY CGI бриф → Seedance 2.0; character consistency через сцены → Kling 3.0.",
      },
    ],
    faq: [
      {
        q: "Чем Seedance 2.0 отличается от Seedance 1.5 Pro?",
        a: "Seedance 2.0 поддерживает multi-modal вход: до 9 изображений, 3 видео и 3 аудиофайла одновременно. Разрешение выросло до 2K. Улучшена scene consistency при смене планов, точнее работает физика движения. Ключевое изменение для промптинга: модель воспринимает блочную TRY CGI структуру как режиссёрский бриф — в 1.x это работало слабее.",
      },
      {
        q: "Работает ли Seedance 2.0 с кириллическими промптами?",
        a: "Нативная платформа 即梦 (Jimeng) лучше всего отвечает на китайский язык. На синтаксис-площадках вроде syntx.ai стандартом является английский. Кириллица технически поддерживается, но качество следования промпту может быть ниже. Для лучших результатов используйте английский промпт с TRY CGI структурой — технические якоря (стиль, движение камеры, звук) на английском работают как пресеты независимо от языка основного текста.",
      },
      {
        q: "Сколько длится видео в Seedance 2.0?",
        a: "Диапазон: 4–15 секунд за один запуск. Максимальная длина промпта — около 2000 символов. Если нужен ролик длиннее 15 секунд — придётся собирать несколько генераций. При использовании TRY CGI структуры с таймингами (0–4с, 4–10с, 10–15с) модель точнее распределяет действие по времени.",
      },
      {
        q: "В каких задачах Seedance 2.0 лучше Kling 3.0?",
        a: "Seedance 2.0 выигрывает при multi-modal входе (несколько изображений + аудио + видео в одном запуске), при сценах с точным тайминговым брифом и синхронизацией звука. Kling 3.0 сильнее в удержании identity одного персонажа через несколько разных шотов. Для простого text-to-video без сложного входа обе модели дают сопоставимый результат.",
      },
      {
        q: "Можно ли показать реалистичное лицо человека в Seedance 2.0?",
        a: "Нет. Платформа 即梦 (Jimeng) автоматически блокирует реалистичные человеческие лица в загружаемых изображениях и видео. Это политика платформы, не баг. Для персонажей используйте иллюстрацию, 3D-рендер или анимационный стиль — они проходят без ограничений.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "seedance-2-0",
  title: "Seedance 2.0: what's new and how to write prompts",
  excerpt:
    "Seedance 2.0 by ByteDance supports up to 9 images as input and 15-second 2K clips. We break down the TRY CGI prompt structure and how it differs from Kling 3.0.",
  description:
    "Seedance 2.0: changes vs 1.5 Pro, TRY CGI prompt structure with examples, image-to-video rules, a physics motion case study, and comparison with Kling 3.0.",
  category: "news",
  tags: ["ai-video-gen", "release-notes", "model-deep-dive"],
  cover: COVER_EN,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["best-ai-video-2026", "image-to-video", "sora-2-vs-veo-3-1"],
  body: {
    intro:
      "Seedance 2.0 is ByteDance's flagship video model supporting multi-modal input of up to 9 images and 15-second clips at 2K resolution. Compared to Seedance 1.5 Pro, it delivers noticeably better scene consistency, physics control, and subject retention across frames. The defining feature: a block-based TRY CGI prompt structure the model reads like a director's brief.",
    steps: [
      {
        title: "What changed in Seedance 2.0 vs Seedance 1.5 Pro",
        body:
          "The most common mistake when upgrading from Seedance 1.x to 2.0 is carrying over the old approach of simple descriptive prompts. In 1.x, \"drone shot over a city at night, cinematic\" was enough. In 2.0 that same line still works, but the model expects more — without a structure it produces inconsistent results: either too static or with motion artifacts.\n\nThe key improvements in 2.0: expanded multi-modal input (up to 9 images, 3 videos, and 3 audio files simultaneously), improved scene consistency during shot transitions, and more precise camera movement handling. Resolution increased to 2K while maintaining the 4–15 second duration range. The new version also handles physically plausible motion better — liquid, fabric, inertia — as long as you describe it explicitly in the prompt.",
        imageSrc: "/blog/seedance-2-0/en/step-1.jpg",
      },
      {
        title: "TRY CGI structure: how to write prompts for Seedance 2.0",
        body:
          "Seedance 2.0 reads the prompt like a director's brief with named blocks. This is not just a tip — it directly affects output quality. The optimal order: LOCATION → STYLE → STORY → CHARACTERS → SHOT STRUCTURE (with timing 0–4s / 4–10s / 10–15s) → AUDIO. Inside each act: Action, Camera, Lighting, VFX (optional), Audio.\n\nImportant: blocks are separated by a blank line, each heading is followed by a colon and a space. Technical anchors (dolly-in, handheld, Ultra-photorealistic 4K, diegetic) stay in English even in non-English prompts — they function as style presets. For syntx.ai, English prompts are standard.\n\nOpten supports Seedance 2.0 as a separate model — the extension highlights missing blocks and weak formulations directly inside the generator interface.",
        before: "Drone shot over city at night, cinematic.",
        after:
          "LOCATION: Night city, glass skyscrapers, thousands of lights below.\n\nSTYLE: Ultra-photorealistic 4K cinematic, film grain, no AI look.\n\nSTORY: Slow drone flyover of the business district.\n\nSHOT STRUCTURE (10 SEC):\n\n0-4s — [SETUP]\n  Action: Smooth ascent from street level to rooftops.\n  Camera: Slow dolly-in, low-angle upward tilt.\n  Lighting: Warm street lamps, backlit neon glow.\n\n4-10s — [CLIMAX]\n  Action: Wide flyaround of skyscrapers, cityscape panorama.\n  Camera: Slow crane, horizontal axis.\n  Audio: Diegetic only — faint urban hum.",
        imageSrc: "/blog/seedance-2-0/en/step-2.jpg",
      },
      {
        title: "Image-to-video: how to prepare input images",
        body:
          "Seedance 2.0 accepts up to 9 images in jpeg/png/webp/bmp/tiff/gif format, up to 30 MB each. The key platform restriction: realistic human faces in uploaded images or videos are automatically blocked by the moderator — this is 即梦 (Jimeng) platform policy, not a bug. For characters, use illustration, 3D render, or animation style.\n\nChecklist for good image-to-video:\n— The image should have a clear subject in a well-defined pose (ambiguous pose = random animation direction).\n— If you need to preserve a specific camera angle from the source — state it: `preserve camera angle from reference image`.\n— For animating multiple objects, assign each one a reference slot via `@image1`, `@image2` — without this the model may mix them up.\n— Specify timing for each object in SHOT STRUCTURE explicitly; otherwise the model picks an arbitrary pace.",
        imageSrc: "/blog/seedance-2-0/en/step-3.jpg",
      },
      {
        title: "Case study: the first render broke physics — the exact fix",
        body:
          "Named case: in Seedance 2.0 for the prompt `city chase scene, sports car drifts around a sharp corner at high speed`, the first render looked good visually but the car simply slid sideways without any physics — as if being pushed from behind with no inertia. The wheels had no grip, the body didn't lean into the corner.\n\nThe mistake wasn't the word \"drift\" — the model understands it. The problem was the absence of a cause-and-effect chain: no description of what happens to the tires, suspension, and chassis.\n\nThe exact fix: `sports car enters left-to-right drift, rear wheels break traction first, tire smoke builds from rear axle, body rolls outward 15 degrees, front wheels steer into the slide to correct, camera tracks from low side angle`. After this the model held the corner physics correctly — body lean, smoke from the right wheels, front steering into the slide. This rule transfers to any physics in Seedance 2.0: describe the cause of the motion, not just its appearance.",
        imageSrc: "/blog/seedance-2-0/en/step-4.jpg",
      },
      {
        title: "Seedance 2.0 vs Kling 3.0: when to use which model",
        body:
          "Both models support text-to-video and image-to-video, both produce 15-second clips. The difference lies in their strengths.\n\nSeedance 2.0 excels when a scene is built from multiple modalities: several input images, audio accompaniment, and synchronized sound and action. If you need complex multi-shot output with a precise timing brief — the TRY CGI structure of Seedance 2.0 wins here. Seedance 2.0 is also more accurate with audio instructions (diegetic/non-diegetic separation works reliably).\n\nKling 3.0 is stronger at maintaining character identity across multiple shots and keeping character consistency when the environment changes. If you're shooting several scenes with the same character, Kling 3.0 is more stable. For straightforward text-to-video without complex input, both models are close in quality — the difference depends on the specific prompt.\n\nQuick rule: multi-modal input or TRY CGI brief → Seedance 2.0; character consistency across scenes → Kling 3.0.",
      },
    ],
    faq: [
      {
        q: "How does Seedance 2.0 differ from Seedance 1.5 Pro?",
        a: "Seedance 2.0 supports multi-modal input: up to 9 images, 3 videos, and 3 audio files in a single run. Resolution increased to 2K. Scene consistency improved across shot transitions, and physics handling is more accurate. The key prompting change: the model processes the block-based TRY CGI structure as a director's brief — in 1.x this worked less reliably.",
      },
      {
        q: "Do English prompts work well in Seedance 2.0?",
        a: "The native platform 即梦 (Jimeng) responds best to Chinese. On platforms like syntx.ai, English is the standard. For best results, use English prompts with TRY CGI block structure — technical anchors (style, camera movement, audio) work as style presets regardless of the language of the main text.",
      },
      {
        q: "How long can a Seedance 2.0 video be?",
        a: "The range is 4–15 seconds per run. Maximum prompt length is approximately 2,000 characters. For clips longer than 15 seconds, you'll need to assemble multiple generations. When using TRY CGI structure with explicit timings (0–4s, 4–10s, 10–15s), the model distributes action across time more accurately.",
      },
      {
        q: "When is Seedance 2.0 better than Kling 3.0?",
        a: "Seedance 2.0 wins with multi-modal input (multiple images + audio + video in one run), scenes with precise timing briefs, and audio synchronization. Kling 3.0 is stronger at maintaining one character's identity across multiple different shots. For straightforward text-to-video without complex input, both models deliver comparable quality.",
      },
      {
        q: "Can I use realistic human faces with Seedance 2.0?",
        a: "No. The 即梦 (Jimeng) platform automatically blocks realistic human faces in uploaded images and videos. This is platform policy, not a bug. For characters, use illustration, 3D render, or animation style — these pass without restrictions.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
