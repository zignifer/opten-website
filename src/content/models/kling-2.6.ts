// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for kling-2.6.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Kling 2.6 Pro: структура, ошибки, примеры",
    description:
      "Как писать промпты для Kling 2.6 Pro: четырёхкомпонентная структура, Elements и Motion Control, негативный промпт, типичные ошибки и примеры до и после.",
    h1: "Kling 2.6 Pro: как писать промпты, которые модель понимает",
    intro:
      "Kling 2.6 Pro — видеомодель от Kuaishou, доступная на klingai.com. Генерирует клипы до 10 секунд в 1080p, поддерживает T2V, I2V, Elements (до 4 референсов) и Motion Control. Оптимальная длина промпта 50–150 слов, лучше всего работает с английским и принимает negative prompt как отдельное поле.",
    sections: [
      {
        heading: "Что умеет Kling 2.6 Pro",
        body:
          "Kling 2.6 Pro — production-инструмент для коротких видео: продуктовые шоты, ландшафтные таймлапсы, корпоративные спикеры, UGC-стиль контент. Длительность до 10 секунд, разрешение до 1080p, четыре режима: Text-to-Video для генерации с нуля, Image-to-Video для оживления статичных кадров, Elements для консистентности персонажей через 2–4 референса, Motion Control для переноса движений с видео-референса.\n\nНегативный промпт идёт отдельным полем — туда выносятся артефакты и нежелательные элементы. Это даёт более чистый контроль, чем у моделей без negative prompt вроде Imagen.",
        bullets: [
          "Длительность до 10 секунд, разрешение до 1080p",
          "Четыре режима: T2V, I2V, Elements, Motion Control",
          "Elements — 2–4 референса для консистентности персонажей и объектов",
          "Negative prompt как отдельное поле",
          "Акцент через ++keyword++ для усиления элементов",
        ],
      },
      {
        heading: "Четырёхкомпонентная структура промпта",
        body:
          "Оптимальная структура для Kling 2.6 Pro: [Scene Setting] + [Subject Description] + [Motion Directives] + [Stylistic Guidance].\n\nScene Setting — окружение и освещение. «A sunlit coastal highway with dramatic cliffs on one side and sparkling ocean on the other, golden hour lighting with long shadows».\n\nSubject Description — детальное описание главных объектов. «A sleek red convertible sports car with chrome wheels and leather interior».\n\nMotion Directives — чёткая артикуляция движения. «Camera tracks alongside the car as it drives at moderate speed, then gradually pulls back to reveal the expansive coastline».\n\nStylistic Guidance — визуальная эстетика. «Cinematic 4K quality, shallow depth of field, vibrant color grading». Главное правило — модель сильнее учитывает начало промпта, важное идёт первым.",
      },
      {
        heading: "I2V и Motion Control: разные стратегии",
        body:
          "I2V (Image-to-Video) описывает ТОЛЬКО движение, не сцену. Модель уже видит изображение. Длина 20–40 слов, фокус на том, как сцена оживает: «Camera slowly tracks right while maintaining focus on the central figure, subtle wind animation affecting the subject's hair and clothing, leaves in background sway gently, warm lighting gradually intensifies».\n\nMotion Control переносит движения из референсного видео на персонажа из изображения. Промпт описывает ВНЕШНОСТЬ и ОКРУЖЕНИЕ, не движения. Формула: [Стиль/внешность персонажа] + [Среда/фон] + [Визуальное качество]. Пример: «Make the character appear as a polished corporate presenter in a tailored navy suit, realistic skin texture, professional grooming. Place in a modern office environment with glass walls, soft daylight, and shallow depth of field».",
      },
      {
        heading: "Технические подсказки и решение типичных проблем",
        body:
          "Камерные параметры работают как стилистические маркеры, а не реальные оптические настройки. «Shot on virtual anamorphic lens, 24mm, f/2.8» ассоциируется у модели с визуальными паттернами из обучающих данных и улучшает результат.\n\nДля решения частых проблем есть готовые приёмы. Проблема морфинга объектов в длинных видео решается фразой «maintains exact appearance throughout» и использованием Elements. Искажение движения — добавлением «stable camera movement» или «no distortion». Визуальная несогласованность — поддержанием согласованного описания освещения по всему промпту.\n\nДля акцентирования используется синтаксис `++keyword++`: «++sleek red convertible++ driving along coastal highway».",
      },
    ],
    examples: [
      {
        before: "красная машина едет по дороге",
        after:
          "A sunlit coastal highway with dramatic cliffs on one side and sparkling ocean on the other, golden hour lighting with long shadows. A ++sleek red convertible sports car++ with chrome wheels and tan leather interior. Camera tracks alongside the car as it drives at moderate speed along the winding road, then gradually pulls back to reveal the expansive coastline. Cinematic 4K quality, shallow depth of field, vibrant color grading, shot on virtual anamorphic lens, 24mm, f/2.8.",
        note:
          "Четырёхкомпонентная структура целиком: scene setting, subject description с акцентом через ++, motion directives с темпом, stylistic guidance с техническими маркерами.",
      },
      {
        before: "I2V для фото с кафе: «человек пьёт кофе»",
        after:
          "Camera slowly tracks right while the woman raises the cup to her lips and takes a slow sip, steam rising gently from the espresso, leaves in background sway in light breeze, warm afternoon light gradually intensifies",
        note:
          "I2V короткий (20–40 слов), описывает только движение и эволюцию сцены. Никаких описаний внешности или одежды — модель уже видит изображение.",
      },
      {
        before: "Motion Control: «спикер презентует продукт»",
        after:
          "Make the character appear as a polished corporate presenter in a tailored navy suit with a crisp white shirt, realistic skin texture, professional grooming, neat short haircut. Place in a modern office environment with floor-to-ceiling glass walls overlooking a city skyline, soft daylight from above, clean minimalist interior. Cinematic realism with shallow depth of field, professional commercial quality.",
        note:
          "Motion Control описывает только внешность и среду. Жесты, мимика и позы для презентации берутся из референсного видео. Инструкции «gestures with hands» здесь — антипаттерн.",
      },
    ],
    mistakes: [
      {
        title: "Описание сцены в I2V-промпте",
        explain:
          "В Image-to-Video модель уже видит исходное изображение. Описание внешности, одежды, окружения тратит токены и конфликтует с реальной картинкой. I2V-промпт должен быть 20–40 слов и описывать ТОЛЬКО движение и эволюцию сцены — что двигается, как и в каком темпе.",
      },
      {
        title: "Инструкции по движению в Motion Control",
        explain:
          "Motion Control переносит движения из референсного видео автоматически. «Character dances», «waves hand», «walks energetically» в промпте — главный антипаттерн режима. Промпт описывает арт-дирекцию (как выглядит, где находится, какое качество), а не режиссуру движения.",
      },
      {
        title: "Конфликтующие камерные движения и стили",
        explain:
          "«360° rotation + zoom in» — множественные одновременные трансформации вызывают деформацию геометрии. «Golden hour» + «studio lighting» в одном промпте путает стилевую интерпретацию модели. Используй одно основное камерное движение и согласованную светотеневую схему по всему промпту.",
      },
      {
        title: "Перегрузка среды деталями",
        explain:
          "Больше 10 элементов окружения в одном промпте приводит к потере фокуса — модель пытается уместить всё в 10 секунд и упрощает или путает элементы. Оптимально 3–4 ключевых элемента среды с описанием освещения и атмосферы. Лишние детали оставь негативному промпту или Elements.",
      },
      {
        title: "Важная информация в конце промпта",
        explain:
          "Kling 2.6 Pro сильнее учитывает начало промпта. Если главный субъект или ключевое действие зарыты в последнем предложении, модель приоритизирует то, что прочла первым. Выноси главный субъект и сцену в первые 30–50 слов, дальше добавляй стиль и технические детали.",
      },
    ],
    faq: [
      {
        q: "Чем Kling 2.6 Pro отличается от Kling 3.0?",
        a: "Kling 2.6 Pro генерирует видео до 10 секунд в 1080p и не поддерживает multi-shot и нативный аудио. Kling 3.0 расширяет потолок до 15 секунд, добавляет Multi-shot (до 6 шотов в одной генерации), нативную генерацию диалогов и аудио, и улучшенный кинематографический рендеринг. Для коротких продуктовых клипов 2.6 Pro оптимален; для нарративов с диалогами — 3.0.",
      },
      {
        q: "Сколько референсов брать в Elements?",
        a: "Оптимально 2–4 качественных референса персонажа или объекта с разных ракурсов. Один референс работает, но даёт меньше консистентности при поворотах головы и смене угла. Более 4 референсов — модель путается в приоритетах и начинает смешивать черты разных изображений. Лучшее качество — 3 чётких референса с одного освещения и в одном стиле.",
      },
      {
        q: "Как работает синтаксис ++keyword++?",
        a: "Двойные плюсы вокруг слова или фразы усиливают её важность в промпте. «++sleek red convertible++ driving along coastal highway» даёт модели сигнал, что машина — центральный элемент кадра. Не злоупотребляй: 1–2 акцента на промпт. Если выделить всё, эффект теряется и модель воспринимает выделения как обычный текст.",
      },
      {
        q: "Что такое проблема морфинга объектов и как её решать?",
        a: "Морфинг — это когда объект меняет внешность в середине видео: машина превращается в другую модель, лицо персонажа дрейфует, логотип искажается. Чаще всего проявляется в длинных генерациях. Решения: использовать Elements с референсами объекта с нескольких ракурсов, добавить «maintains exact appearance throughout» в промпт, сократить длительность, упростить движение камеры.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но качество ниже. Kling 2.6 Pro обучен на мультиязычных данных, однако английский даёт самые стабильные результаты — особенно для кинематографической лексики, описаний камерных движений и стилистических маркеров. Для production-задач переводи промпт на английский. Для черновиков и быстрых тестов русский допустим.",
      },
      {
        q: "Зачем нужен негативный промпт и что туда писать?",
        a: "Негативный промпт — отдельное поле, страховка от частых артефактов. Туда выноси: «No people, no text overlays, no distortion in vehicle proportions» для продуктовых шотов; «No watermark, no logos, no extra limbs» для портретов; «No morphing, no shape distortion» для длинных кадров. Не дублируй негативные формулировки в основной промпт — там они либо игнорируются, либо приводят к обратному эффекту.",
      },
      {
        q: "Поддерживается ли Opten для Kling 2.6 Pro?",
        a: "Да, расширение Opten автоматически распознаёт Kling 2.6 Pro и его режимы (T2V, I2V, Elements, Motion Control) внутри klingai.com. Для каждого режима применяется своя стратегия оценки: для T2V — четырёхкомпонентная структура, для I2V — короткий промпт о движении, для Motion Control — отсутствие инструкций по движениям. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Kling 2.6 Pro Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Kling 2.6 Pro: the 4-component structure, Elements and Motion Control, negative prompt, common mistakes, and before/after examples.",
    h1: "Kling 2.6 Pro: how to write prompts the model actually understands",
    intro:
      "Kling 2.6 Pro is Kuaishou's video model on klingai.com. It generates clips up to 10 seconds at 1080p and supports T2V, I2V, Elements (up to 4 references), and Motion Control. Optimal prompt length is 50–150 words; it performs best in English and accepts a negative prompt as a separate field.",
    sections: [
      {
        heading: "What Kling 2.6 Pro does well",
        body:
          "Kling 2.6 Pro is a production tool for short video: product shots, landscape time-lapses, corporate presenters, UGC-style content. Duration up to 10 seconds, resolution up to 1080p, four modes — Text-to-Video for from-scratch generation, Image-to-Video for animating still frames, Elements for character consistency through 2–4 references, and Motion Control for transferring motion from a video reference.\n\nThe negative prompt is a separate field — artifacts and unwanted elements go there. This gives cleaner control than models without a negative prompt such as Imagen.",
        bullets: [
          "Duration up to 10 seconds, resolution up to 1080p",
          "Four modes: T2V, I2V, Elements, Motion Control",
          "Elements — 2–4 references for character and object consistency",
          "Negative prompt as a separate field",
          "Emphasis via ++keyword++ to amplify elements",
        ],
      },
      {
        heading: "The four-component prompt structure",
        body:
          "Optimal structure for Kling 2.6 Pro: [Scene Setting] + [Subject Description] + [Motion Directives] + [Stylistic Guidance].\n\nScene Setting — environment and lighting. «A sunlit coastal highway with dramatic cliffs on one side and sparkling ocean on the other, golden hour lighting with long shadows».\n\nSubject Description — detailed description of main objects. «A sleek red convertible sports car with chrome wheels and leather interior».\n\nMotion Directives — clear articulation of motion. «Camera tracks alongside the car as it drives at moderate speed, then gradually pulls back to reveal the expansive coastline».\n\nStylistic Guidance — visual aesthetic. «Cinematic 4K quality, shallow depth of field, vibrant color grading». The key rule — the model weights the start of the prompt more heavily, so important things go first.",
      },
      {
        heading: "I2V and Motion Control: different strategies",
        body:
          "I2V (Image-to-Video) describes ONLY motion, not the scene. The model already sees the image. Length 20–40 words, focus on how the scene comes alive: «Camera slowly tracks right while maintaining focus on the central figure, subtle wind animation affecting the subject's hair and clothing, leaves in background sway gently, warm lighting gradually intensifies».\n\nMotion Control transfers motion from a reference video onto a character from an image. The prompt describes APPEARANCE and SETTING, not motion. Formula: [Character style/appearance] + [Setting/background] + [Visual quality]. Example: «Make the character appear as a polished corporate presenter in a tailored navy suit, realistic skin texture, professional grooming. Place in a modern office environment with glass walls, soft daylight, and shallow depth of field».",
      },
      {
        heading: "Technical hints and fixes for common issues",
        body:
          "Camera parameters work as stylistic markers, not real optical settings. «Shot on virtual anamorphic lens, 24mm, f/2.8» associates with visual patterns from training data and improves results.\n\nThere are ready-made fixes for common problems. Object morphing in long videos is mitigated by «maintains exact appearance throughout» and by using Elements. Motion distortion — add «stable camera movement» or «no distortion». Visual inconsistency — keep lighting description consistent across the whole prompt.\n\nFor emphasis, use the `++keyword++` syntax: «++sleek red convertible++ driving along coastal highway».",
      },
    ],
    examples: [
      {
        before: "red car drives on a road",
        after:
          "A sunlit coastal highway with dramatic cliffs on one side and sparkling ocean on the other, golden hour lighting with long shadows. A ++sleek red convertible sports car++ with chrome wheels and tan leather interior. Camera tracks alongside the car as it drives at moderate speed along the winding road, then gradually pulls back to reveal the expansive coastline. Cinematic 4K quality, shallow depth of field, vibrant color grading, shot on virtual anamorphic lens, 24mm, f/2.8.",
        note:
          "The full four-component structure: scene setting, subject description with ++ emphasis, motion directives with tempo, stylistic guidance with technical markers.",
      },
      {
        before: "I2V from a café photo: «person drinks coffee»",
        after:
          "Camera slowly tracks right while the woman raises the cup to her lips and takes a slow sip, steam rising gently from the espresso, leaves in background sway in light breeze, warm afternoon light gradually intensifies",
        note:
          "I2V is short (20–40 words), describing only motion and scene evolution. No appearance or clothing description — the model already sees the image.",
      },
      {
        before: "Motion Control: «presenter pitches a product»",
        after:
          "Make the character appear as a polished corporate presenter in a tailored navy suit with a crisp white shirt, realistic skin texture, professional grooming, neat short haircut. Place in a modern office environment with floor-to-ceiling glass walls overlooking a city skyline, soft daylight from above, clean minimalist interior. Cinematic realism with shallow depth of field, professional commercial quality.",
        note:
          "Motion Control describes appearance and setting only. Gestures, expressions, and presentation poses come from the reference video. Instructions like «gestures with hands» are an anti-pattern here.",
      },
    ],
    mistakes: [
      {
        title: "Describing the scene in an I2V prompt",
        explain:
          "In Image-to-Video the model already sees the source image. Describing appearance, clothing, or setting wastes tokens and conflicts with the actual picture. An I2V prompt should be 20–40 words and describe ONLY motion and scene evolution — what moves, how, and at what tempo.",
      },
      {
        title: "Motion instructions in Motion Control",
        explain:
          "Motion Control transfers motion from the reference video automatically. «Character dances», «waves hand», «walks energetically» in the prompt is the mode's main anti-pattern. The prompt describes art direction (how it looks, where it is, what quality), not motion direction.",
      },
      {
        title: "Conflicting camera moves and styles",
        explain:
          "«360° rotation + zoom in» — multiple simultaneous transforms cause geometry distortion. «Golden hour» + «studio lighting» in one prompt confuses the model's style interpretation. Use one primary camera move and keep a consistent lighting scheme throughout the prompt.",
      },
      {
        title: "Overloading the environment with details",
        explain:
          "More than 10 environmental elements in one prompt causes loss of focus — the model tries to fit everything into 10 seconds and simplifies or confuses elements. Aim for 3–4 key elements with lighting and atmosphere description. Push the rest into the negative prompt or Elements.",
      },
      {
        title: "Important information at the end of the prompt",
        explain:
          "Kling 2.6 Pro weights the start of the prompt more heavily. If the main subject or key action is buried in the last sentence, the model prioritizes whatever it read first. Put the main subject and scene in the first 30–50 words; add style and technical details after.",
      },
    ],
    faq: [
      {
        q: "How is Kling 2.6 Pro different from Kling 3.0?",
        a: "Kling 2.6 Pro generates video up to 10 seconds at 1080p and does not support multi-shot or native audio. Kling 3.0 extends the ceiling to 15 seconds, adds Multi-shot (up to 6 shots in one generation), native dialogue and audio generation, and improved cinematic rendering. For short product clips 2.6 Pro is optimal; for narratives with dialogue, choose 3.0.",
      },
      {
        q: "How many references should I use with Elements?",
        a: "The sweet spot is 2–4 high-quality character or object references from different angles. One reference works, but gives less consistency on head turns and angle changes. More than 4 references — the model gets confused about priorities and starts mixing features. Best quality: 3 clean references under the same lighting and in the same style.",
      },
      {
        q: "How does the ++keyword++ syntax work?",
        a: "Double pluses around a word or phrase amplify its importance in the prompt. «++sleek red convertible++ driving along coastal highway» signals to the model that the car is the central element of the frame. Don't overuse it: 1–2 accents per prompt. Highlighting everything dilutes the effect and the model treats the marks as regular text.",
      },
      {
        q: "What's object morphing and how do I fix it?",
        a: "Morphing is when an object changes appearance mid-video: a car turns into a different model, a character's face drifts, a logo distorts. Most common in long generations. Fixes: use Elements with references of the object from several angles; add «maintains exact appearance throughout» to the prompt; shorten the duration; simplify camera motion.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but quality drops. Kling 2.6 Pro was trained on multilingual data, but English produces the most stable results — especially for cinematic vocabulary, camera-move descriptions, and stylistic markers. For production work, translate the prompt to English. For drafts and quick tests other languages are acceptable.",
      },
      {
        q: "Why use the negative prompt and what goes in it?",
        a: "The negative prompt is a separate field, insurance against common artifacts. Move things there: «No people, no text overlays, no distortion in vehicle proportions» for product shots; «No watermark, no logos, no extra limbs» for portraits; «No morphing, no shape distortion» for long shots. Don't duplicate negative phrasing in the main prompt — there it's either ignored or causes the opposite effect.",
      },
      {
        q: "Does Opten support Kling 2.6 Pro?",
        a: "Yes, the Opten extension auto-detects Kling 2.6 Pro and its modes (T2V, I2V, Elements, Motion Control) inside klingai.com. Each mode uses its own scoring strategy: T2V — the four-component structure; I2V — short prompt focused on motion; Motion Control — checking for the absence of motion instructions. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
