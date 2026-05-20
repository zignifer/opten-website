// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for minimax-live-illustrations.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для MiniMax I2V-01-Live: структура, ошибки, примеры",
    description:
      "Как писать промпты для MiniMax I2V-01-Live: анимация 2D-иллюстраций, субтильные Live2D-движения, сохранение арт-стиля, типичные ошибки и примеры до/после.",
    h1: "MiniMax I2V-01-Live: как писать промпты, которые модель понимает",
    intro:
      "MiniMax I2V-01-Live — специализированная Image-to-Video модель для анимации 2D-иллюстраций: аниме, манги, цифровых портретов, концепт-арта и книжных иллюстраций. До 720P, длительность до 6 секунд. Модель сохраняет арт-стиль и линии оригинала и оптимизирована под субтильные Live2D-движения. Промпт описывает только движение; 10-30 слов оптимально, на английском.",
    sections: [
      {
        heading: "Что умеет I2V-01-Live",
        body:
          "Это отдельная специализированная модель MiniMax, не режим Hailuo 2.3 или 02. Она создана специально для оживления 2D-иллюстраций — аниме, манги, цифровых портретов, иллюстраций книг, рисованных персонажей. Ключевая фича — сохранение линий, цветов и арт-стиля оригинального изображения. Модель не «дорисовывает» иллюстрацию и не уходит в реализм.\n\nЛучше всего работает с субтильными Live2D-движениями: моргание, дыхание, лёгкий поворот головы, развевающиеся волосы, колыхание ткани. Идеальна для VTuber-контента, оживления манга-панелей, концепт-арта и иллюстраций книг. До 720P, длительность до 6 секунд.",
        bullets: [
          "Только I2V — без референса не работает",
          "Специализация: аниме, манга, цифровой портрет, концепт-арт",
          "Сохранение арт-стиля и линий оригинала",
          "Live2D-стиль анимации (субтильные движения)",
          "720P, до 6 секунд",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Формула: [Описание движения] + [Направление/тип движения] + [Атмосферные изменения]. Оптимально 10-30 слов — это намного короче, чем для Hailuo 2.3.\n\nПример: «Hair gently flowing, eyes blinking slowly, soft light shifting on her face, subtle smile.» Промпт не описывает содержимое иллюстрации — модель её видит. Описывается только то, что движется и как.\n\nКороткий промпт — это норма для I2V-01-Live, а не недостаток. Длинные описания со сложным экшеном работают плохо: модель оптимизирована под Live2D-эстетику, где минимальные движения создают эффект «оживления» без разрушения исходного стиля.",
      },
      {
        heading: "Субтильные движения — фишка модели",
        body:
          "Live2D-стиль анимации — это субтильные плавные движения характерные для VTuber-контента. Что работает хорошо: моргание (blinks slowly), дыхание (chest rises and falls gently), лёгкий поворот головы (slight head turn), развевающиеся волосы (hair gently flowing), колыхание ткани (fabric rippling softly), смена выражения лица (subtle smile appears).\n\nЧто работает плохо: бег, прыжки, флипы, боевые сцены, сложные физические действия. Для этого нужна Hailuo 2.3, не I2V-01-Live. Если попытаться сгенерировать динамичное действие на этой модели — линии иллюстрации сломаются, появятся артефакты на границах движения.",
      },
      {
        heading: "Сохранение арт-стиля",
        body:
          "Главное обещание модели — она не «перерисовывает» иллюстрацию в фотореализм. Если на входе аниме-портрет с cel-shading — модель сохранит cel-shading. Если манга-панель в чёрно-белом — она останется монохромной. Если акварель с мягкими переходами — переходы сохранятся.\n\nЭто отличает I2V-01-Live от обычных видеомоделей: Hailuo 2.3, Runway или Sora склонны «улучшать» иллюстрацию в более реалистичный стиль. I2V-01-Live этого не делает — она специально обучена удерживать арт-стиль входного изображения. Поэтому стиль НЕ задаётся в промпте — он определяется иллюстрацией. Не пиши «in anime style», если иллюстрация уже аниме.",
      },
      {
        heading: "Атмосферные изменения",
        body:
          "Кроме движения субъекта можно добавлять атмосферные элементы — это бонусный, не обязательный слой. «Light shifting from warm to cool», «leaves drifting past in the foreground», «sparkles appearing softly», «petals floating down», «mist gently swirling».\n\nЭто добавляет жизни в кадр без необходимости двигать самого субъекта — особенно полезно для портретов, где главный персонаж должен оставаться более-менее статичным. Атмосфера — это контрапункт к субтильности субъекта, она даёт ощущение динамики через окружение, а не через сам персонаж.",
      },
    ],
    examples: [
      {
        before:
          "сделай аниме девушку живой",
        after:
          "Hair gently flowing in the breeze, eyes blinking slowly, a faint smile appears at the corner of her mouth, soft light shifting on her cheeks.",
        note:
          "Не описывается ни внешность, ни стиль (всё на иллюстрации). Только субтильные движения: волосы, моргание, выражение лица, изменение света. Длина в целевом диапазоне 10-30 слов.",
      },
      {
        before:
          "оживи моего персонажа",
        after:
          "The character's chest rises and falls with slow breathing, cloak gently rippling at the hem, eyes blink once. Faint magical sparkles drift around her shoulders, light atmospheric shimmer.",
        note:
          "Главная цепочка субтильных движений (дыхание, плащ, моргание) плюс атмосферный слой (sparkles, shimmer). Этот контрапункт даёт ощущение динамики без разрушения иллюстрации.",
      },
      {
        before:
          "пусть манга-герой двигается",
        after:
          "Wind tousles his hair from left to right, eyes narrow slightly into a focused expression, the edge of his cape lifts and falls. Light shadow shifting on his face.",
        note:
          "Указано направление движения волос (left to right), микро-выражение (eyes narrow), субтильное движение одежды (cape lifts). Модель удержит монохромный/манга-стиль исходника без указания в промпте.",
      },
    ],
    mistakes: [
      {
        title: "Описание содержимого иллюстрации",
        explain:
          "«Аниме девушка с фиолетовыми волосами в школьной форме сидит у окна, моргает» — модель видит иллюстрацию, описывать её содержимое бессмысленно и тратит токены. Пиши только движение: «slowly blinks, hair gently flowing». Это сокращает промпт до 10-30 слов и фокусирует модель на анимации.",
      },
      {
        title: "Слишком динамичные действия",
        explain:
          "Бег, прыжки, флипы, удары, боевые сцены не подходят для 2D-анимации в Live2D-стиле. Модель оптимизирована под субтильные движения. На динамичных действиях линии иллюстрации ломаются, появляются артефакты, теряется арт-стиль. Для динамики используй Hailuo 2.3 — она лучше для экшена, даже стилизованного.",
      },
      {
        title: "Описание арт-стиля в промпте",
        explain:
          "«In anime style», «with cel-shading», «manga aesthetic» — стиль уже задан входной иллюстрацией. Описание стиля в промпте либо игнорируется, либо конфликтует с тем, что модель считала с изображения. Для I2V-01-Live стиль = свойство референса, не параметр промпта.",
      },
      {
        title: "Использование для фотореалистичных изображений",
        explain:
          "I2V-01-Live специализирована на 2D-иллюстрациях — аниме, манга, цифровой портрет, концепт-арт. Если на входе реалистичное фото, модель попытается обработать его как иллюстрацию: результат будет странным, с потерей деталей фотореализма. Для фото — Hailuo 2.3 или Veo, не Live Illustrations.",
      },
      {
        title: "Слишком длинный промпт",
        explain:
          "Для I2V-анимации 2D-иллюстраций 10-30 слов оптимально. Длинные промпты со множеством движений приводят к перегрузке и артефактам — модель пытается анимировать всё сразу и ломает линии. Одно-два основных движения + атмосферный слой = идеальный промпт.",
      },
    ],
    faq: [
      {
        q: "Чем I2V-01-Live отличается от Hailuo 2.3?",
        a: "I2V-01-Live — это ОТДЕЛЬНАЯ специализированная модель, не режим 2.3 или 02. Она создана для анимации 2D-иллюстраций с сохранением арт-стиля. Hailuo 2.3 — универсальная видеомодель, оптимизированная под реалистичные сцены и стилизованный экшен. Для аниме/манги/концепт-арта без потери линий — I2V-01-Live; для реалистичной анимации, танцев и экшена — 2.3.",
      },
      {
        q: "Подходит ли модель для VTuber-контента?",
        a: "Да, это один из главных сценариев использования. I2V-01-Live оптимизирована под Live2D-стиль — субтильные плавные движения, характерные для VTuber: моргание, лёгкий поворот головы, развевающиеся волосы, смена выражения лица. Для коротких клипов оживления статичных VTuber-моделей или fan-арта — это правильный выбор. Длительность до 6 секунд хорошо ложится в социальный контент.",
      },
      {
        q: "Работает ли модель с мангой и чёрно-белой графикой?",
        a: "Да, и это её сильная сторона. Модель сохраняет монохромный или ограниченный палитровый стиль оригинала. Можно анимировать ключевые кадры манги, чёрно-белые иллюстрации, скетчи, тушевые рисунки. Цвета и тональность входной иллюстрации удерживаются — модель не «раскрашивает» чёрно-белое в цветное.",
      },
      {
        q: "Какие движения работают лучше всего?",
        a: "Субтильные Live2D-движения: моргание (slowly blinks), дыхание (chest rises and falls gently), лёгкий поворот головы (slight head turn), развевающиеся волосы (hair gently flowing), колыхание ткани (fabric rippling softly), смена выражения (subtle smile appears). Плюс атмосферные элементы: sparkles, light shifting, leaves drifting. Это контрапункт к субтильности субъекта.",
      },
      {
        q: "Можно ли просить динамичный экшен или бой?",
        a: "Не рекомендуется. На динамичных действиях (бег, прыжки, флипы, боевые сцены) линии иллюстрации ломаются, появляются артефакты на границах движения, теряется арт-стиль. Для стилизованного экшена в аниме-эстетике используй Hailuo 2.3 — она лучше справляется с динамикой, хотя и может «улучшить» стиль в более реалистичный.",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "10-30 слов. Это намного короче, чем для Hailuo 2.3 (40-60 слов). Промпт не описывает иллюстрацию — модель её видит. Только движение: одно-два основных субтильных действия + атмосферный слой. Длинные промпты со множеством движений приводят к перегрузке и артефактам — модель пытается анимировать всё сразу и ломает линии.",
      },
      {
        q: "Поддерживается ли Opten для I2V-01-Live?",
        a: "Да, расширение Opten автоматически распознаёт MiniMax I2V-01-Live и оценивает промпты по структуре выше: проверяет наличие входного 2D-изображения, отсутствие описания арт-стиля (он на иллюстрации), фокус на субтильных движениях, оптимальную длину 10-30 слов. Одним кликом получаешь rewrite в правильной формуле «движение + направление + атмосфера».",
      },
    ],
  },
  en: {
    title: "MiniMax I2V-01-Live Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for MiniMax I2V-01-Live: 2D illustration animation, subtle Live2D motion, art-style preservation, and detailed before/after examples.",
    h1: "MiniMax I2V-01-Live: how to write prompts the model actually understands",
    intro:
      "MiniMax I2V-01-Live is a specialized Image-to-Video model for animating 2D illustrations: anime, manga, digital portraits, concept art. Up to 720P, 6 seconds. The model preserves the original art style and line work, optimized for subtle Live2D-style motion. The prompt describes motion only; 10-30 words is optimal.",
    sections: [
      {
        heading: "What I2V-01-Live does",
        body:
          "This is a separate specialized MiniMax model, not a mode of Hailuo 2.3 or 02. It's built specifically for animating 2D illustrations — anime, manga, digital portraits, book illustrations, drawn characters. The headline feature is preservation of the original image's lines, colors, and art style. The model doesn't «redraw» the illustration and doesn't drift into realism.\n\nIt works best with subtle Live2D-style motion: blinking, breathing, slight head turn, flowing hair, fabric ripple. Ideal for VTuber content, animating manga panels, concept art, and book illustrations. Up to 720P, duration up to 6 seconds.",
        bullets: [
          "I2V only — no reference, no generation",
          "Specialization: anime, manga, digital portrait, concept art",
          "Art-style and line preservation from the original",
          "Live2D-style animation (subtle motion)",
          "720P, up to 6 seconds",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Formula: [Motion description] + [Direction/type of movement] + [Atmospheric changes]. Optimal 10-30 words — far shorter than for Hailuo 2.3.\n\nExample: «Hair gently flowing, eyes blinking slowly, soft light shifting on her face, subtle smile.» The prompt does not describe the illustration's contents — the model sees it. Only what moves and how is described.\n\nA short prompt is the norm for I2V-01-Live, not a shortcoming. Long descriptions with complex action work poorly: the model is tuned for Live2D aesthetics where minimal motion creates an «alive» effect without breaking the source style.",
      },
      {
        heading: "Subtle motion is the model's feature",
        body:
          "Live2D-style animation is the subtle smooth motion characteristic of VTuber content. What works well: blinking (blinks slowly), breathing (chest rises and falls gently), slight head turn, flowing hair (hair gently flowing), fabric ripple (fabric rippling softly), expression shift (subtle smile appears).\n\nWhat works poorly: running, jumping, flips, fight scenes, complex physical action. For that you need Hailuo 2.3, not I2V-01-Live. Trying to generate dynamic action on this model breaks the illustration's lines, introduces edge artifacts at motion boundaries, and loses the art style.",
      },
      {
        heading: "Art-style preservation",
        body:
          "The model's headline promise — it doesn't «repaint» the illustration into photorealism. An anime portrait with cel-shading goes in, cel-shading comes out. A black-and-white manga panel stays monochrome. Watercolor with soft transitions keeps its transitions.\n\nThis distinguishes I2V-01-Live from general video models: Hailuo 2.3, Runway, or Sora tend to «improve» an illustration toward a more realistic style. I2V-01-Live doesn't — it's specifically trained to hold the input image's art style. So style is NOT set in the prompt — it's set by the illustration. Don't write «in anime style» if the illustration is already anime.",
      },
      {
        heading: "Atmospheric changes",
        body:
          "Beyond subject motion you can add atmospheric elements — a bonus layer, not required. «Light shifting from warm to cool», «leaves drifting past in the foreground», «sparkles appearing softly», «petals floating down», «mist gently swirling.»\n\nThis adds life to the frame without needing to move the subject itself — especially useful for portraits where the main character should remain more or less still. Atmosphere is a counterpoint to subject subtlety; it conveys dynamics through the environment, not through the character.",
      },
    ],
    examples: [
      {
        before: "make the anime girl alive",
        after:
          "Hair gently flowing in the breeze, eyes blinking slowly, a faint smile appears at the corner of her mouth, soft light shifting on her cheeks.",
        note:
          "Neither appearance nor style is described (both are on the illustration). Only subtle motion: hair, blinks, expression, light shift. Length is in the 10-30 word target range.",
      },
      {
        before: "bring my character to life",
        after:
          "The character's chest rises and falls with slow breathing, cloak gently rippling at the hem, eyes blink once. Faint magical sparkles drift around her shoulders, light atmospheric shimmer.",
        note:
          "Main chain of subtle motions (breath, cloak, blink) plus an atmospheric layer (sparkles, shimmer). This counterpoint conveys dynamics without breaking the illustration.",
      },
      {
        before: "make the manga hero move",
        after:
          "Wind tousles his hair from left to right, eyes narrow slightly into a focused expression, the edge of his cape lifts and falls. Light shadow shifting on his face.",
        note:
          "Hair direction is specified (left to right), micro-expression (eyes narrow), subtle clothing motion (cape lifts). The model holds the monochrome/manga style from the source without any style call in the prompt.",
      },
    ],
    mistakes: [
      {
        title: "Describing the illustration's contents",
        explain:
          "«Anime girl with purple hair in a school uniform sitting by the window, blinks» — the model sees the illustration; describing its contents is pointless and wastes tokens. Write motion only: «slowly blinks, hair gently flowing.» This shortens the prompt to 10-30 words and focuses the model on animation.",
      },
      {
        title: "Action that's too dynamic",
        explain:
          "Running, jumping, flips, strikes, fight scenes don't fit 2D Live2D-style animation. The model is tuned for subtle motion. On dynamic action the illustration's lines break, edge artifacts appear, the art style is lost. For dynamic action use Hailuo 2.3 — it handles motion better, even stylized.",
      },
      {
        title: "Describing art style in the prompt",
        explain:
          "«In anime style», «with cel-shading», «manga aesthetic» — style is already set by the input illustration. A style call in the prompt is either ignored or conflicts with what the model parsed from the image. For I2V-01-Live, style is a property of the reference, not a prompt parameter.",
      },
      {
        title: "Using it on photorealistic images",
        explain:
          "I2V-01-Live is specialized in 2D illustrations — anime, manga, digital portrait, concept art. With a realistic photo as input the model will try to process it like an illustration: the result is odd, with loss of photographic detail. For photos use Hailuo 2.3 or Veo, not Live Illustrations.",
      },
      {
        title: "Prompt that's too long",
        explain:
          "For I2V animation of 2D illustrations, 10-30 words is optimal. Long prompts with many motions cause overload and artifacts — the model tries to animate everything at once and breaks the lines. One or two primary motions + an atmospheric layer = the ideal prompt.",
      },
    ],
    faq: [
      {
        q: "How is I2V-01-Live different from Hailuo 2.3?",
        a: "I2V-01-Live is a SEPARATE specialized model, not a mode of 2.3 or 02. It's built for animating 2D illustrations with art-style preservation. Hailuo 2.3 is a general-purpose video model tuned for realistic scenes and stylized action. For anime/manga/concept-art without line loss — I2V-01-Live; for realistic animation, dance, and action — 2.3.",
      },
      {
        q: "Is the model suitable for VTuber content?",
        a: "Yes, that's one of the headline use cases. I2V-01-Live is tuned for Live2D style — subtle smooth motion characteristic of VTubers: blinking, slight head turn, flowing hair, expression shifts. For short clips bringing static VTuber models or fan art to life, this is the right pick. The 6-second duration fits well into social content.",
      },
      {
        q: "Does the model work with manga and black-and-white art?",
        a: "Yes, and that's a strength. The model preserves the monochrome or limited-palette style of the original. You can animate manga key frames, black-and-white illustrations, sketches, ink drawings. The color and tonality of the input illustration are held — the model doesn't «colorize» black-and-white into color.",
      },
      {
        q: "Which motions work best?",
        a: "Subtle Live2D motion: blinking (slowly blinks), breathing (chest rises and falls gently), slight head turn, flowing hair (hair gently flowing), fabric ripple (fabric rippling softly), expression shift (subtle smile appears). Plus atmospheric elements: sparkles, light shifting, leaves drifting. This is a counterpoint to subject subtlety.",
      },
      {
        q: "Can I ask for dynamic action or combat?",
        a: "Not recommended. On dynamic action (running, jumping, flips, fight scenes) the illustration's lines break, edge artifacts appear at motion boundaries, the art style is lost. For stylized action in anime aesthetic use Hailuo 2.3 — it handles dynamics better, though it may «improve» the style toward something more realistic.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "10-30 words. Much shorter than Hailuo 2.3 (40-60 words). The prompt doesn't describe the illustration — the model sees it. Motion only: one or two primary subtle actions + an atmospheric layer. Long prompts with many motions cause overload and artifacts — the model tries to animate everything at once and breaks the lines.",
      },
      {
        q: "Does Opten support I2V-01-Live?",
        a: "Yes, the Opten extension auto-detects MiniMax I2V-01-Live and scores prompts against the structure above: it checks that an input 2D image is present, that the art style isn't restated (it's on the illustration), focus on subtle motion, and optimal 10-30 word length. One click gives you a rewrite in the correct «motion + direction + atmosphere» formula.",
      },
    ],
  },
};
