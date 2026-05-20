// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for kling.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Kling: структура, ошибки, примеры",
    description:
      "Как писать промпты для видеомодели Kling от Kuaishou: структура для режимов T2V, I2V и Motion Control, негативный промпт, типичные ошибки и примеры до и после.",
    h1: "Kling: как писать промпты, которые модель понимает",
    intro:
      "Kling — семейство видеомоделей от Kuaishou, доступное через klingai.com. Генерирует видео до 10 секунд (до 15 секунд в Kling 3.0), поддерживает T2V, I2V и Motion Control. Промпт принимает до ~2500 символов, оптимальная длина 50–150 слов. Английский даёт самые стабильные результаты; есть поддержка негативного промпта.",
    sections: [
      {
        heading: "Что умеет Kling",
        body:
          "Kling — это text-to-video и image-to-video модель, ориентированная на кинематографические сцены и продуктовый контент. Стандартная длительность — 5–10 секунд (15 секунд в Kling 3.0), разрешение до 1080p, поддерживаются Elements — до 4 референсных изображений для консистентности персонажей и объектов.\n\nРежим Motion Control переносит движения из референсного видео на нового персонажа из изображения — основа для AI-инфлюенсеров, виртуальных презентаторов и танцевальных перформансов. Негативный промпт поддерживается как отдельное поле — это принципиальное отличие от Imagen и многих других моделей. Поддерживаются также Keyframes (ровно 2 опорных кадра).",
        bullets: [
          "T2V до 10 секунд (15 в Kling 3.0), разрешение до 1080p",
          "Image-to-Video для оживления статичных изображений",
          "Motion Control: перенос движений с референсного видео",
          "Elements — до 4 референсов для консистентности",
          "Негативный промпт как отдельное поле",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальная структура для T2V: [Subject/Character] + [Action/Motion] + [Scene/Environment] + [Camera Movement] + [Style/Mood/Lighting]. Порядок важен — модель сильнее учитывает элементы в начале промпта. Самое важное всегда первым.\n\nКаждый блок требует конкретики: «35-year-old woman with shoulder-length auburn hair wearing an emerald green coat» вместо «a person»; «walking purposefully through fallen leaves» вместо «moving around»; «smooth tracking shot following from the side» вместо отсутствия камеры. Среду ограничивай 3–4 элементами — больше десяти приводит к перегрузке и потере фокуса. Оптимальная длина 50–150 слов.",
      },
      {
        heading: "Режимы T2V, I2V и Motion Control",
        body:
          "Каждый режим требует своей стратегии. T2V — описывай ВСЁ: субъект, действие, среду, камеру, стиль. Формула: (Субъект + детали) + (Действие + темп) + (Среда + освещение) + (Камера) + (Стиль).\n\nI2V — описывай ТОЛЬКО движение, не сцену. Модель уже видит изображение. Формула: (Движение субъекта) + (Движение среды) + (Камера). Длина 20–40 слов. Описание того, что уже на картинке, — антипаттерн.\n\nMotion Control — описывай ТОЛЬКО внешность персонажа и окружение. Движения берутся из референсного видео автоматически. Формула: [Стиль персонажа + одежда] + [Среда/фон] + [Визуальное качество]. Инструкции по движениям, жестам, мимике в Motion Control — главный антипаттерн.",
      },
      {
        heading: "Камера, темп и негативный промпт",
        body:
          "Движение субъекта и движение камеры всегда описываются отдельно: «The dancer gradually rises en pointe [субъект], camera slowly orbits clockwise [камера]». Это критично — без разделения модель путается, кто двигается.\n\nТемпоральные дескрипторы управляют ритмом: «gradually», «suddenly», «smoothly», «rhythmically», «at the 3-second mark», «by the end of the clip». Для усиления элементов работает синтаксис `++keyword++`: «++sleek red convertible++ driving along coastal highway».\n\nНегативный промпт идёт в отдельное поле, не в основной промпт: «No people, no text overlays, no distortion in vehicle proportions». Это страховка от частых артефактов — людей в кадрах продукта, водяных знаков, искажений геометрии.",
      },
    ],
    examples: [
      {
        before: "машина едет по городу на закате",
        after:
          "A sleek silver sports car with chrome wheels accelerates through a rain-slicked downtown street as golden sunset light breaks through storm clouds, camera tracking alongside at street level, smooth dolly motion, cinematic lighting with volumetric light rays reflecting off wet asphalt, photorealistic rendering, shot on virtual anamorphic lens, 24mm, f/2.8, warm color grading with deep contrast.",
        note:
          "Главные изменения: конкретные детали машины, состояние улицы, поведение камеры отдельно от субъекта, кинематографический стек, темпоральный маркер для ритма.",
      },
      {
        before: "I2V для фото девушки на пляже: «девушка идёт к морю»",
        after:
          "Walks slowly toward the ocean, hair and clothing moving gently in the breeze, waves rolling onto shore in the background, camera slowly pushes in",
        note:
          "I2V короткий (20–40 слов) и описывает ТОЛЬКО движение: что делает субъект, что в среде, как двигается камера. Описание внешности или сцены было бы антипаттерном — модель уже видит изображение.",
      },
      {
        before: "Motion Control для танцевального видео: «персонаж танцует»",
        after:
          "Style the character as a confident urban dancer wearing oversized black streetwear and white sneakers, placed in a moody underground parking lot with flickering fluorescent lights and concrete walls, cinematic realism with grainy 35mm film aesthetic, high contrast color grading, shallow depth of field with bokeh on background lights.",
        note:
          "Motion Control описывает ВНЕШНОСТЬ и ОКРУЖЕНИЕ, не движения. Танец и тайминг берутся из референсного видео. Инструкции вроде «dances energetically» здесь — главный антипаттерн.",
      },
    ],
    mistakes: [
      {
        title: "Описание сцены в I2V-промпте",
        explain:
          "В Image-to-Video модель уже видит исходное изображение. Описание внешности персонажа, одежды, окружения — пустые токены, которые модель игнорирует или из-за которых конфликтует с реальной картинкой. I2V-промпт должен быть 20–40 слов и описывать ТОЛЬКО движение и эволюцию сцены.",
      },
      {
        title: "Инструкции по движению в Motion Control",
        explain:
          "Motion Control переносит движения из референсного видео автоматически. Фразы «character dances», «waves hand», «walks forward» в промпте либо игнорируются, либо конфликтуют с движениями из видео. Промпт = арт-дирекция (как выглядит), а НЕ режиссура движения (как двигается).",
      },
      {
        title: "Конфликтующие камерные движения",
        explain:
          "«360-degree rotation around subject while zooming in and panning left» — три одновременные трансформации почти гарантированно вызывают деформацию геометрии. Используй одно основное движение камеры за раз: либо орбита, либо zoom, либо pan. Для сложных переходов лучше Multi-shot в Kling 3.0.",
      },
      {
        title: "Слишком короткий или абстрактный промпт",
        explain:
          "Промпт меньше 15 слов оставляет модели слишком много свободы — она «додумывает» сцену по-своему. Абстрактные формулировки вроде «something beautiful happens», «make it look dynamic», «cool vibes» не дают визуальных якорей. Конкретные детали и физические действия дают модели опору.",
      },
      {
        title: "Негативные формулировки в основном промпте",
        explain:
          "Kling поддерживает negative prompt как отдельное поле — но не в основном промпте. «No people, no text, not blurry» внутри основного промпта либо игнорируется, либо приводит к обратному эффекту. Переноси нежелательные элементы в специальное поле негативного промпта.",
      },
    ],
    faq: [
      {
        q: "Какая длительность видео доступна в Kling?",
        a: "Стандартная длительность — 5–10 секунд для большинства версий (Kling 1.6, Kling 2.0, Kling 2.6 Pro, Kling O1). Kling 3.0 расширяет потолок до 15 секунд и добавляет режим Multi-shot — до 6 шотов в одной генерации с нарративным развитием. Для длинных видео лучше использовать Kling 3.0 или склеивать несколько генераций в монтаже.",
      },
      {
        q: "Как работает Image-to-Video в Kling?",
        a: "В I2V модель получает статичное изображение и оживляет его. Ключевое правило — описывать ТОЛЬКО движение и эволюцию сцены, не описывать то, что уже видно на картинке. Длина 20–40 слов. Формула: (движение субъекта + темп) + (движение среды) + (поведение камеры). Описание внешности или окружения внутри I2V-промпта — антипаттерн, ведущий к конфликтам с изображением.",
      },
      {
        q: "Чем Motion Control отличается от обычного T2V?",
        a: "В T2V промпт описывает ВСЁ — субъект, действия, движения, камеру, среду, стиль. В Motion Control движения, жесты, мимика, тайминг берутся из референсного видео автоматически; промпт описывает ТОЛЬКО внешность персонажа и окружение. Это принципиально другая стратегия: промпт = арт-дирекция, не режиссура движения. Оптимальная длина 30–80 слов.",
      },
      {
        q: "Зачем нужен Elements и сколько референсов брать?",
        a: "Elements — режим с референсными изображениями для консистентности персонажей и объектов в видео. Оптимально 2–4 качественных референса с разных ракурсов. Более 4 — модель путается в приоритетах и начинает смешивать черты. Применение: повторяющиеся персонажи в серии видео, брендированный контент, нарративы с консистентным героем.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но качество ниже. Kling обучен на мультиязычных данных, однако английский даёт наиболее стабильные результаты — особенно для кинематографической лексики и описаний камерных движений. Для production-задач переводи промпт на английский, для экспериментов и быстрых тестов русский допустим, но не оптимален.",
      },
      {
        q: "Как использовать негативный промпт?",
        a: "Негативный промпт в Kling — отдельное поле, не часть основного промпта. Туда выноси нежелательные элементы: «No people, no text overlays, no distortion in vehicle proportions», «No watermark, no logos, no extra limbs». Это страховка от частых артефактов: лишние люди в продуктовом шоте, водяные знаки, искажения геометрии. Не дублируй негативные формулировки в основной промпт — они там не работают.",
      },
      {
        q: "Поддерживается ли Opten для Kling?",
        a: "Да, расширение Opten автоматически распознаёт Kling и его режимы (T2V, I2V, Motion Control, Elements) внутри klingai.com. Для каждого режима применяется своя стратегия оценки: для T2V — полный 5-компонентный чек-лист, для I2V — фокус на движении и коротком промпте, для Motion Control — проверка отсутствия инструкций по движениям. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Kling Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Kuaishou's Kling video model: T2V / I2V / Motion Control structure, negative prompt, common mistakes, and before/after examples.",
    h1: "Kling: how to write prompts the model actually understands",
    intro:
      "Kling is Kuaishou's video model family, available at klingai.com. It generates up to 10-second clips (up to 15 seconds in Kling 3.0) and supports T2V, I2V, and Motion Control. Prompts accept up to ~2500 characters; the sweet spot is 50–150 words. English yields the most stable results, and a negative prompt field is supported.",
    sections: [
      {
        heading: "What Kling does well",
        body:
          "Kling is a text-to-video and image-to-video model aimed at cinematic scenes and product content. Standard duration is 5–10 seconds (15 seconds in Kling 3.0), resolution up to 1080p, with Elements support — up to 4 reference images for character and object consistency.\n\nMotion Control transfers motion from a reference video onto a new character from an image — the foundation for AI influencers, virtual presenters, and dance performances. A negative prompt is supported as a separate field — a key difference from Imagen and many other models. Keyframes (exactly 2 anchor frames) are also supported.",
        bullets: [
          "T2V up to 10 seconds (15 in Kling 3.0), resolution up to 1080p",
          "Image-to-Video for animating still images",
          "Motion Control: transferring motion from a reference video",
          "Elements — up to 4 references for consistency",
          "Negative prompt as a separate field",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal T2V structure: [Subject/Character] + [Action/Motion] + [Scene/Environment] + [Camera Movement] + [Style/Mood/Lighting]. Order matters — the model weights elements at the start of the prompt more heavily. The most important goes first.\n\nEach block needs concrete detail: «35-year-old woman with shoulder-length auburn hair wearing an emerald green coat» instead of «a person»; «walking purposefully through fallen leaves» instead of «moving around»; «smooth tracking shot following from the side» instead of no camera at all. Limit the environment to 3–4 elements — more than ten causes overload and loss of focus. Sweet-spot length is 50–150 words.",
      },
      {
        heading: "T2V, I2V, and Motion Control modes",
        body:
          "Each mode needs its own strategy. T2V — describe EVERYTHING: subject, action, environment, camera, style. Formula: (Subject + details) + (Action + tempo) + (Environment + lighting) + (Camera) + (Style).\n\nI2V — describe ONLY motion, not the scene. The model already sees the image. Formula: (Subject motion) + (Environmental motion) + (Camera). Length 20–40 words. Describing what's already in the picture is an anti-pattern.\n\nMotion Control — describe ONLY the character's appearance and setting. Motion is taken from the reference video automatically. Formula: [Character style + clothing] + [Setting/background] + [Visual quality]. Motion, gesture, and expression instructions in Motion Control are the main anti-pattern.",
      },
      {
        heading: "Camera, tempo, and the negative prompt",
        body:
          "Subject motion and camera motion are always described separately: «The dancer gradually rises en pointe [subject], camera slowly orbits clockwise [camera]». Critical — without separation the model gets confused about who's moving.\n\nTemporal descriptors control rhythm: «gradually», «suddenly», «smoothly», «rhythmically», «at the 3-second mark», «by the end of the clip». To emphasize elements, the `++keyword++` syntax works: «++sleek red convertible++ driving along coastal highway».\n\nThe negative prompt goes in a separate field, not in the main prompt: «No people, no text overlays, no distortion in vehicle proportions». Insurance against common artifacts — extra people in product shots, watermarks, geometry distortions.",
      },
    ],
    examples: [
      {
        before: "car drives through a city at sunset",
        after:
          "A sleek silver sports car with chrome wheels accelerates through a rain-slicked downtown street as golden sunset light breaks through storm clouds, camera tracking alongside at street level, smooth dolly motion, cinematic lighting with volumetric light rays reflecting off wet asphalt, photorealistic rendering, shot on virtual anamorphic lens, 24mm, f/2.8, warm color grading with deep contrast.",
        note:
          "Key changes: concrete car details, the street's state, camera behavior described separately from the subject, the cinematic stack, a temporal marker for rhythm.",
      },
      {
        before: "I2V from a photo of a woman on the beach: «woman walks to the sea»",
        after:
          "Walks slowly toward the ocean, hair and clothing moving gently in the breeze, waves rolling onto shore in the background, camera slowly pushes in",
        note:
          "I2V is short (20–40 words) and describes ONLY motion: what the subject does, what's happening in the environment, how the camera moves. Describing appearance or scene would be an anti-pattern — the model already sees the image.",
      },
      {
        before: "Motion Control for a dance video: «character dances»",
        after:
          "Style the character as a confident urban dancer wearing oversized black streetwear and white sneakers, placed in a moody underground parking lot with flickering fluorescent lights and concrete walls, cinematic realism with grainy 35mm film aesthetic, high contrast color grading, shallow depth of field with bokeh on background lights.",
        note:
          "Motion Control describes APPEARANCE and SETTING, not motion. The dance and timing come from the reference video. Instructions like «dances energetically» here are the main anti-pattern.",
      },
    ],
    mistakes: [
      {
        title: "Describing the scene in an I2V prompt",
        explain:
          "In Image-to-Video the model already sees the source image. Describing appearance, clothing, or setting wastes tokens and either gets ignored or conflicts with the actual picture. An I2V prompt should be 20–40 words and describe ONLY motion and scene evolution.",
      },
      {
        title: "Motion instructions in Motion Control",
        explain:
          "Motion Control transfers motion from the reference video automatically. Phrases like «character dances», «waves hand», «walks forward» in the prompt are either ignored or conflict with motion from the video. The prompt is art direction (how it looks), not motion direction (how it moves).",
      },
      {
        title: "Conflicting camera moves",
        explain:
          "«360-degree rotation around subject while zooming in and panning left» — three simultaneous transforms almost guarantee geometry distortion. Use one primary camera move at a time: either orbit, or zoom, or pan. For complex transitions, use Multi-shot in Kling 3.0.",
      },
      {
        title: "Prompts that are too short or too abstract",
        explain:
          "A prompt under 15 words leaves too much freedom — the model fills the scene on its own. Abstract phrases like «something beautiful happens», «make it look dynamic», «cool vibes» give no visual anchors. Concrete details and physical actions give the model something to grip.",
      },
      {
        title: "Negative phrasing in the main prompt",
        explain:
          "Kling supports a negative prompt as a separate field — but not inside the main prompt. «No people, no text, not blurry» inside the main prompt is either ignored or causes the opposite effect. Move unwanted elements to the dedicated negative prompt field.",
      },
    ],
    faq: [
      {
        q: "What clip durations does Kling offer?",
        a: "Standard duration is 5–10 seconds for most versions (Kling 1.6, Kling 2.0, Kling 2.6 Pro, Kling O1). Kling 3.0 pushes the ceiling to 15 seconds and adds Multi-shot mode — up to 6 shots in one generation with narrative development. For longer videos, use Kling 3.0 or stitch several generations together in editing.",
      },
      {
        q: "How does Image-to-Video work in Kling?",
        a: "In I2V the model receives a still image and brings it to life. The key rule is to describe ONLY motion and scene evolution, not what's already in the picture. Length 20–40 words. Formula: (subject motion + tempo) + (environmental motion) + (camera behavior). Describing appearance or setting inside an I2V prompt is an anti-pattern that causes conflicts with the image.",
      },
      {
        q: "How is Motion Control different from regular T2V?",
        a: "In T2V the prompt describes EVERYTHING — subject, action, motion, camera, environment, style. In Motion Control, motion, gestures, expressions, and timing come from the reference video automatically; the prompt describes ONLY the character's appearance and setting. A fundamentally different strategy: prompt as art direction, not motion direction. Sweet-spot length 30–80 words.",
      },
      {
        q: "Why use Elements, and how many references should I include?",
        a: "Elements is a mode with reference images for character and object consistency in video. The sweet spot is 2–4 high-quality references from different angles. Beyond 4, the model gets confused about priorities and starts mixing features. Use cases: recurring characters across a series, branded content, narratives with a consistent protagonist.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but quality drops. Kling was trained on multilingual data, but English produces the most stable results — especially for cinematic vocabulary and camera-move descriptions. For production work, translate the prompt to English; for experiments and quick tests other languages are acceptable but suboptimal.",
      },
      {
        q: "How do I use the negative prompt?",
        a: "Kling's negative prompt is a separate field, not part of the main prompt. Move unwanted elements there: «No people, no text overlays, no distortion in vehicle proportions», «No watermark, no logos, no extra limbs». It's insurance against common artifacts: extra people in product shots, watermarks, geometry issues. Don't duplicate negative phrasing in the main prompt — it doesn't work there.",
      },
      {
        q: "Does Opten support Kling?",
        a: "Yes, the Opten extension auto-detects Kling and its modes (T2V, I2V, Motion Control, Elements) inside klingai.com. Each mode uses its own scoring strategy: T2V — the full 5-component checklist; I2V — focus on motion and a short prompt; Motion Control — checking for the absence of motion instructions. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
