// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for veo.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Veo: структура, ошибки, примеры",
    description:
      "Как писать промпты для Google Veo: структура брифа для режиссёра, камера, стиль, освещение, типичные ошибки и примеры до/после для всей линейки моделей.",
    h1: "Veo: как писать промпты, которые модель понимает",
    intro:
      "Google Veo — линейка video-моделей от DeepMind с клипами 5-8 секунд и базовым разрешением 720p. Промпт работает как описание для режиссёра: субъект, контекст, действие, камера, стиль и освещение. Английский даёт самые стабильные результаты. В семействе разные версии: Veo 1/2 без аудио, Veo 3+ с нативным звуком.",
    sections: [
      {
        heading: "Что умеет Veo",
        body:
          "Veo генерирует видео в формате 16:9 длительностью 5-8 секунд (точное значение зависит от версии модели). Базовое разрешение — 720p (1280×720), апскейл до 4K делается через сторонние инструменты постобработки. Рекомендуемый лимит промпта около 1500 символов: больше — модель начинает терять детали из конца описания.\n\nДоступно на Google AI Studio, Vertex AI и Flow. Поддерживает два основных режима: Text-to-Video (генерация только из текста) и Image-to-Video (анимация стартового изображения, доступность зависит от версии и платформы). Аудио появляется только с версии 3 — Veo 1 и Veo 2 выдают немое видео. Вертикальный формат нативно не поддерживается в базовой линейке Veo, только через постобработку или специальные варианты (Veo 3.1).",
        bullets: [
          "Клипы 5-8 секунд, формат 16:9, базовое разрешение 720p",
          "Лимит промпта ~1500 символов",
          "Text-to-Video и Image-to-Video режимы",
          "Аудио — только начиная с Veo 3",
          "Платформы: Google AI Studio, Vertex AI, Flow",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Subject] + [Context/Scene] + [Action] + [Camera Movement] + [Style/Mood] + [Lighting/Ambiance] + [Audio (если поддерживается)].\n\nНе обязательно использовать все элементы — состав зависит от типа видео. Чем конкретнее описание, тем лучше результат. Пиши так, как если бы ты описывал сцену режиссёру, который впервые видит сценарий.\n\nКлючевой контраст:\n• Слабо: «A man answers a phone».\n• Сильно: «A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign».\n\nКонкретные детали внешности, среды, освещения и движения камеры — главный рычаг качества.",
      },
      {
        heading: "Камера и движение",
        body:
          "Veo хорошо понимает камерные термины — это основной язык модели. Указывай в промпте хотя бы один из параметров: крупность плана, движение, угол или фокус. Крупность — wide shot, medium shot, close-up, extreme close-up, establishing shot. Движение — dolly shot, zoom in, zoom out, pan left/right, tracking shot, orbit. Угол — eye level, high angle, low angle, worm's eye, top-down, aerial shot. Фокус — shallow depth of field, rack focus, deep focus.\n\nСпецприёмы — dolly zoom, one-take, handheld, steadicam, crane shot. Конкретные приёмы работают лучше абстрактного «cinematic camera»: «slow dolly-in from eye level» или «shaky handheld tracking shot» дают модели чёткое направление и стабильный результат.",
      },
      {
        heading: "Стиль, освещение, настроение",
        body:
          "Стилистические модификаторы через префикс «In the style of [style]:» — LEGO, Claymation, Pixar animation, Anime, Graphic novel, 8-bit retro, Stop-motion, Origami, Blueprint, Marble. Это даёт радикальное переключение визуала при сохранении остальных параметров.\n\nКачество — Cinematic, film grain, HDR, 4K, professional. Жанр — Hollywood blockbuster, indie film, documentary, commercial, music video, vlog. Цвет — warm tones, cool tones, high contrast, desaturated, neon, golden hour. Освещение — natural light, rim light, backlight, volumetric, neon glow, silhouette, blue light.\n\nДля selfie-стиля: начинай с «A selfie video of...», укажи видимую руку («holds the camera at arm's length, arm clearly visible in frame») и естественные движения глаз. Это убирает синтетическое ощущение и даёт характерный POV.",
      },
      {
        heading: "Типичные сценарии",
        body:
          "Реклама и коммерческое видео — продуктовые шоты, демонстрации, промо-ролики со стилизацией под коммерческую съёмку. Конкретный сетап освещения и цветовая палитра дают премиальный вид кадра без необходимости в постобработке.\n\nКороткие истории и нарратив — детальные описания персонажей с конкретными деталями внешности (одежда, возраст, причёска, выражение лица), физические действия и эмоции. Veo любит уникальные описания: «desperate man in a weathered green trench coat» даёт стабильнее результат, чем абстрактное «a sad guy».\n\nАрт и стилизация — использование стилистических модификаторов («In the style of...»), абстрактные и экспериментальные видео. Для арт-видео абстрактный субъект — вполне допустим, главное — задать стиль, движение и атмосферу кадра.",
      },
    ],
    examples: [
      {
        before: "a man answers a phone",
        after:
          "A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign. Camera: handheld with subtle micro-shake, dolly zoom effect. Lighting: green neon key from above, deep shadows in the alley. Mood: tense, noir, claustrophobic.",
        note:
          "Конкретный персонаж с одеждой, эмоция в описании («desperate»), точное движение камеры (dolly zoom), сетап освещения с источником и направлением, явное настроение.",
      },
      {
        before: "a selfie video of someone in the city",
        after:
          "A selfie video of a young woman with curly red hair and a black leather jacket walking through Tokyo's Shibuya crossing at night. She holds the camera at arm's length, arm clearly visible in frame, occasionally looking into the lens and smiling. Background: neon signs, crowd of pedestrians, light rain. Lighting: cool neon glow with warm spill from storefronts. Style: slightly grainy, film-like, vlog aesthetic.",
        note:
          "Формат selfie-видео: явная видимая рука, естественные движения глаз, конкретный фон с деталями, цветовая характеристика среды. Veo любит «slightly grainy, film-like» — убирает AI-чистоту.",
      },
      {
        before: "a product video of headphones",
        after:
          "Commercial product shot. Smooth 360-degree orbit around matte-black wireless headphones on a white marble pedestal against a seamless white background. Camera: slow continuous orbit at eye level, shallow depth of field, medium close-up. Lighting: large softbox key from above-left, gentle rim light from behind, soft gradient fill from the right. Style: clean commercial photography, premium minimalism. Mood: confident, refined.",
        note:
          "Конкретное движение камеры (smooth orbit), материал и фон, трёхточечный сетап освещения с явными источниками, стилистический референс «commercial photography».",
      },
    ],
    mistakes: [
      {
        title: "Слишком короткий промпт без деталей",
        explain:
          "«A beautiful video» или «a cool scene» — модель додумает всё сама и результат будет непредсказуем. Минимум: конкретный субъект с деталями внешности, физическое действие с глаголом, среда, и хотя бы одно указание на камеру. Без этих четырёх элементов Veo сваливается в «обобщённый красивый кадр» без направления.",
      },
      {
        title: "Абстрактные формулировки вместо конкретики",
        explain:
          "«Cinematic look», «beautiful lighting», «high quality» ничего не говорят модели — это субъективные слова. Заменяй конкретикой: «shallow depth of field», «golden hour sunlight», «35mm film grain», «soft window light with warm tungsten fill». Конкретные параметры работают, абстрактные оценочные прилагательные — нет.",
      },
      {
        title: "Конфликтующие инструкции по камере",
        explain:
          "«Zoom in and zoom out», «static shot with tracking», «wide angle close-up» — модель не может выполнить противоречие и либо игнорирует часть инструкции, либо выдаёт хаотичное движение. Выбирай одно движение камеры на клип. Сложную раскадровку собирай из нескольких клипов в посте.",
      },
      {
        title: "Отсутствие описания действия",
        explain:
          "Статичная сцена без динамики — Veo сгенерирует «застывшее» видео с минимальным движением, выглядит как gif. Описывай физическое действие: «picks up the phone, turns around, walks», «leaves blow across the empty street», «steam rises slowly from the coffee cup». Без действия видео теряет смысл.",
      },
      {
        title: "Попытка вертикального видео в базовом Veo",
        explain:
          "Veo 1/2 нативно не поддерживает вертикальный формат — выход всегда 16:9. Если пытаться через промпт («vertical video», «9:16»), модель проигнорирует и выдаст горизонтальный кадр. Для вертикали либо используй Veo 3.1 (там 9:16 поддерживается нативно), либо обрезай в постобработке.",
      },
    ],
    faq: [
      {
        q: "Какие версии Veo существуют?",
        a: "Линейка Veo от Google DeepMind включает несколько поколений: Veo 1 и Veo 2 (видео без аудио, базовое качество), Veo 3 (нативный звук, диалоги, фоновые звуки), Veo 3.1 с вариантами Fast и Fast Relax (улучшенное следование промпту, вертикальное видео, image-to-video). Эта страница — общий обзор для всей линейки; специфика каждой версии — на отдельных страницах.",
      },
      {
        q: "Сколько секунд длится один клип Veo?",
        a: "Стандартный клип Veo — 5-8 секунд, точная длительность зависит от версии и платформы. Veo 3.1 расширенный режим поддерживает более длинные видео. Длительность задаётся через UI или API-параметры, не через текст промпта. В промпте не нужно писать «make it 8 seconds long» — это игнорируется и засоряет описание.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически да, но английский даёт заметно более стабильные результаты, особенно для камерных терминов и стилистических референсов. Кинематографический словарь («dolly zoom», «shallow depth of field», «golden hour») исторически тренируется лучше в английском. Для production-задач рекомендуется английский; для экспериментов — русский тоже работает.",
      },
      {
        q: "Поддерживает ли Veo вертикальное видео?",
        a: "Базовые версии Veo 1 и Veo 2 — нет, выход всегда 16:9 (горизонтальный). Veo 3 — тоже преимущественно 16:9. Veo 3.1 нативно поддерживает 9:16 (вертикальный) формат — это новинка 3.1, удобная для TikTok, Reels, Shorts. Для вертикального контента используй Veo 3.1 или обрезай 16:9 в постобработке.",
      },
      {
        q: "Как добиться кинематографичного результата?",
        a: "Конкретика вместо абстракций. Не «cinematic», а «35mm film grain, anamorphic lens, shallow DOF, volumetric lighting». Не «beautiful light», а «soft window light from screen-left with warm tungsten fill, cool rim from hallway». Не «moves smoothly», а «slow dolly-in from eye level, then tilts up to follow the subject». Конкретные параметры — главный рычаг качества.",
      },
      {
        q: "Что делать с движущимся текстом и логотипами в кадре?",
        a: "Veo на момент написания плохо справляется с точным рендерингом текста — буквы могут искажаться, особенно при движении. Если в брифе обязательно нужен точный текст или логотип, добавляй его в постобработке поверх сгенерированного видео. Для текста в кадре лучше использовать image-модели (GPT Image 2) с дальнейшей анимацией, чем напрямую Veo.",
      },
      {
        q: "Поддерживается ли Opten для Veo?",
        a: "Да, расширение Opten распознаёт Veo на платформах Google AI Studio, Vertex AI и Flow и оценивает промпты по структуре, описанной выше: проверяет наличие конкретного субъекта с деталями, физического действия, движения камеры, стиля и освещения. Одним кликом можно получить rewrite с правильной структурой и без абстрактных «cinematic» / «beautiful».",
      },
    ],
  },
  en: {
    title: "Veo Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google Veo: brief structure, camera, style, lighting, common mistakes, and before/after examples for the whole Veo model line.",
    h1: "Veo: how to write prompts the model actually understands",
    intro:
      "Google Veo is DeepMind's line of video models that produce 5-8 second clips at a base resolution of 720p. The prompt works as a brief for a director: subject, context, action, camera, style, and lighting. English gives the most stable results. The family spans several versions: Veo 1/2 are video-only, Veo 3 and later add native audio.",
    sections: [
      {
        heading: "What Veo does",
        body:
          "Veo generates 16:9 videos of 5-8 seconds (version-dependent). Base resolution is 720p (1280×720), upscale to 4K is done via external tools. The recommended prompt limit is around 1500 characters — beyond that the model starts dropping details.\n\nAvailable on Google AI Studio, Vertex AI, and Flow. Two main modes: Text-to-Video (generation purely from text) and Image-to-Video (animating a starting frame, availability varies by version and platform). Audio arrives only with version 3 — Veo 1 and Veo 2 output silent video. Vertical format is not natively supported in the base Veo line, only through post-processing or special variants (Veo 3.1).",
        bullets: [
          "Clips of 5-8 seconds, 16:9 format, base resolution 720p",
          "Prompt limit ~1500 characters",
          "Text-to-Video and Image-to-Video modes",
          "Audio — only from Veo 3 onward",
          "Platforms: Google AI Studio, Vertex AI, Flow",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject] + [Context/Scene] + [Action] + [Camera Movement] + [Style/Mood] + [Lighting/Ambiance] + [Audio (where supported)].\n\nUsing every element is not mandatory — the mix depends on the type of video. The more concrete the description, the better the result. Write as if you were briefing a director who is seeing the script for the first time.\n\nKey contrast:\n• Weak: «A man answers a phone».\n• Strong: «A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign».\n\nConcrete details of appearance, environment, lighting, and camera motion are the main quality lever.",
      },
      {
        heading: "Camera and motion",
        body:
          "Veo understands camera terms well — that is the model's primary control language. In every prompt specify at least one of: shot size, movement, angle, or focus. Shot size — wide shot, medium shot, close-up, extreme close-up, establishing shot. Movement — dolly shot, zoom in, zoom out, pan left/right, tracking shot, orbit. Angle — eye level, high angle, low angle, worm's eye, top-down, aerial shot. Focus — shallow depth of field, rack focus, deep focus.\n\nSpecial techniques — dolly zoom, one-take, handheld, steadicam, crane shot. Concrete techniques work better than an abstract «cinematic camera»: «slow dolly-in from eye level» or «shaky handheld tracking shot» gives the model a clear direction.",
      },
      {
        heading: "Style, lighting, mood",
        body:
          "Stylistic modifiers through the «In the style of [style]:» prefix — LEGO, Claymation, Pixar animation, Anime, Graphic novel, 8-bit retro, Stop-motion, Origami, Blueprint, Marble. This gives a radical visual switch while keeping the rest of the parameters intact.\n\nQuality — Cinematic, film grain, HDR, 4K, professional. Genre — Hollywood blockbuster, indie film, documentary, commercial, music video, vlog. Color — warm tones, cool tones, high contrast, desaturated, neon, golden hour. Lighting — natural light, rim light, backlight, volumetric, neon glow, silhouette, blue light.\n\nFor a selfie style: start with «A selfie video of...», state a visible arm («holds the camera at arm's length, arm clearly visible in frame»), and add natural eye movement. This removes the synthetic feel and locks in the POV.",
      },
      {
        heading: "Typical use cases",
        body:
          "Advertising and commercial video — product shots, demos, promo reels styled like commercial footage. A concrete lighting setup and color palette give a premium look without further post-production work.\n\nShort stories and narrative — detailed character descriptions with specifics (clothing, age, hairstyle, expression), physical actions, and emotions. Veo rewards unique descriptions: «desperate man in a weathered green trench coat» yields a more stable result than an abstract «a sad guy».\n\nArt and stylization — using «In the style of...» modifiers, abstract and experimental videos. For art video an abstract subject is acceptable — what matters is locking in style, motion, and overall mood of the frame.",
      },
    ],
    examples: [
      {
        before: "a man answers a phone",
        after:
          "A shaky dolly zoom goes from a far away blur to a close-up cinematic shot of a desperate man in a weathered green trench coat as he picks up a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign. Camera: handheld with subtle micro-shake, dolly zoom effect. Lighting: green neon key from above, deep shadows in the alley. Mood: tense, noir, claustrophobic.",
        note:
          "Concrete character with wardrobe, emotion baked into the description («desperate»), precise camera move (dolly zoom), lighting setup with source and direction, explicit mood.",
      },
      {
        before: "a selfie video of someone in the city",
        after:
          "A selfie video of a young woman with curly red hair and a black leather jacket walking through Tokyo's Shibuya crossing at night. She holds the camera at arm's length, arm clearly visible in frame, occasionally looking into the lens and smiling. Background: neon signs, crowd of pedestrians, light rain. Lighting: cool neon glow with warm spill from storefronts. Style: slightly grainy, film-like, vlog aesthetic.",
        note:
          "Selfie format: explicit visible arm, natural eye motion, concrete background details, environment color characterization. Veo responds well to «slightly grainy, film-like» — it removes AI cleanliness.",
      },
      {
        before: "a product video of headphones",
        after:
          "Commercial product shot. Smooth 360-degree orbit around matte-black wireless headphones on a white marble pedestal against a seamless white background. Camera: slow continuous orbit at eye level, shallow depth of field, medium close-up. Lighting: large softbox key from above-left, gentle rim light from behind, soft gradient fill from the right. Style: clean commercial photography, premium minimalism. Mood: confident, refined.",
        note:
          "Concrete camera motion (smooth orbit), material and background, three-point lighting setup with explicit sources, stylistic reference «commercial photography».",
      },
    ],
    mistakes: [
      {
        title: "Too short a prompt without details",
        explain:
          "«A beautiful video» or «a cool scene» — the model invents everything and the result becomes unpredictable. Minimum: a concrete subject with appearance details, a physical action with a verb, an environment, and at least one camera direction. Without these four elements Veo collapses into a «generic pretty frame» with no direction.",
      },
      {
        title: "Abstract phrasing instead of specifics",
        explain:
          "«Cinematic look», «beautiful lighting», «high quality» tell the model nothing — these are subjective words. Replace them with specifics: «shallow depth of field», «golden hour sunlight», «35mm film grain», «soft window light with warm tungsten fill». Concrete parameters work, abstract evaluative adjectives do not.",
      },
      {
        title: "Conflicting camera instructions",
        explain:
          "«Zoom in and zoom out», «static shot with tracking», «wide angle close-up» — the model cannot honor a contradiction and either ignores part of the instruction or produces chaotic motion. Pick one camera move per clip. Build complex shot lists from several clips in post.",
      },
      {
        title: "No action described",
        explain:
          "A static scene with no dynamics — Veo will generate a near-frozen video with minimal motion, looking like a GIF. Describe physical action: «picks up the phone, turns around, walks», «leaves blow across the empty street», «steam rises slowly from the coffee cup». Without action the video loses meaning.",
      },
      {
        title: "Attempting vertical video in base Veo",
        explain:
          "Veo 1/2 does not natively support vertical format — the output is always 16:9. If you try via the prompt («vertical video», «9:16»), the model ignores it and returns a horizontal frame. For vertical use Veo 3.1, where 9:16 is supported natively, or crop in post-processing.",
      },
    ],
    faq: [
      {
        q: "Which Veo versions exist?",
        a: "Google DeepMind's Veo line spans several generations: Veo 1 and Veo 2 (video without audio, base quality), Veo 3 (native sound, dialogue, ambience), and Veo 3.1 with Fast and Fast Relax variants (better prompt adherence, vertical video, image-to-video). This page is the general overview for the whole line; per-version specifics live on dedicated pages.",
      },
      {
        q: "How long is a single Veo clip?",
        a: "A standard Veo clip is 5-8 seconds; exact duration depends on the version and the platform. Veo 3.1 extended mode supports longer videos. Duration is set through the UI or API parameters, not via prompt text. You do not need to write «make it 8 seconds long» in the prompt — that is ignored and just clutters the description.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, but English gives noticeably more stable results, especially for camera terminology and stylistic references. The cinematographic vocabulary («dolly zoom», «shallow depth of field», «golden hour») has historically been trained best in English. For production work English is recommended; for experiments other languages also work.",
      },
      {
        q: "Does Veo support vertical video?",
        a: "Base Veo 1 and Veo 2 — no, the output is always 16:9 (horizontal). Veo 3 — also predominantly 16:9. Veo 3.1 natively supports 9:16 vertical format — a new feature in 3.1 that fits TikTok, Reels, and Shorts. For vertical content use Veo 3.1 or crop a 16:9 output in post-processing.",
      },
      {
        q: "How do I get a cinematic result?",
        a: "Specifics instead of abstractions. Not «cinematic», but «35mm film grain, anamorphic lens, shallow DOF, volumetric lighting». Not «beautiful light», but «soft window light from screen-left with warm tungsten fill, cool rim from hallway». Not «moves smoothly», but «slow dolly-in from eye level, then tilts up to follow the subject». Concrete parameters are the main quality lever.",
      },
      {
        q: "What about moving text and logos in frame?",
        a: "Veo at the time of writing handles in-frame text imperfectly — letters can warp, especially under motion. If the brief absolutely needs exact text or a logo, add it in post over the generated video. For text in-frame it is better to use image models (GPT Image 2) and animate that result than to ask Veo directly.",
      },
      {
        q: "Does Opten support Veo?",
        a: "Yes, the Opten extension detects Veo on Google AI Studio, Vertex AI, and Flow and scores prompts against the structure outlined above: it checks for a concrete subject with details, physical action, camera motion, style, and lighting. One click gives you a rewrite in the right structure, with abstract «cinematic» / «beautiful» stripped out.",
      },
    ],
  },
};
