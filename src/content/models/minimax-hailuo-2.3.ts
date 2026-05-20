// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for minimax-hailuo-2.3.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для MiniMax Hailuo 2.3: структура, ошибки, примеры",
    description:
      "Как писать промпты для MiniMax Hailuo 2.3: режиссёрские заметки на естественном языке, bracket camera syntax, микро-выражения, ошибки и примеры до/после.",
    h1: "MiniMax Hailuo 2.3: как писать промпты, которые модель понимает",
    intro:
      "MiniMax Hailuo 2.3 — флагман видеомоделей MiniMax: T2V и I2V до 1080P, 25fps, поддержка bracket camera syntax `[Push in]`. Промпт пишется как режиссёрские заметки на естественном языке, не теги. Английский рекомендован, китайский — родной язык обучения; оптимальная длина 40-60 слов.",
    sections: [
      {
        heading: "Что умеет Hailuo 2.3",
        body:
          "Hailuo 2.3 — более новая и точная модель по сравнению с 02. Сильные стороны: танцевальные хореографии и полноценный экшен с реалистичными движениями тела (флипы, прыжки, боевые сцены), микро-выражения лица с улучшенной эмоциональной точностью, разнообразные арт-стили (аниме, тушь, game CG, реализм, акварель, claymation), точный кинематографический контроль через bracket camera syntax.\n\nЕсть Fast-версия — ~2× быстрее и на ~50% дешевле стандартной, но только I2V (без T2V). Поддерживает 768P (default) и 1080P, 25fps. Длительность 6с или 10с на 768P; 6с на 1080P. Максимум промпта — 2000 символов; есть встроенный prompt_optimizer.",
        bullets: [
          "T2V + I2V, Fast-версия только I2V",
          "Разрешения: 768P (default), 1080P, 25fps",
          "15 bracket camera commands, до 3 одновременных",
          "Сильные стороны: танец, экшен, микро-выражения, разнообразие стилей",
          "prompt_optimizer (default true) — LLM улучшает промпт",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Идеальная длина 40-60 слов, максимум 2000 символов. Стиль — режиссёрские заметки на естественном языке, НЕ теги.\n\nФормула: [Камера + движение] + [Субъект + описание] + [Действие в present tense] + [Стиль и атмосфера] + [Эмоциональные маркеры].\n\nПример: «[Tracking shot] A young dancer in a flowing crimson dress spins gracefully across a moonlit rooftop, hair catching the breeze, arms extended. Cinematic, dreamlike atmosphere, soft warm rim light, serene yet powerful emotional tone.» Конкретные глаголы в настоящем времени («spins», «catching», «extended»), bracket camera command в начале, эмоциональный якорь в конце.",
      },
      {
        heading: "Bracket Camera Syntax — 15 команд",
        body:
          "Главная фича MiniMax-семейства — точный кинематографический контроль через квадратные скобки. Доступно 15 команд:\n\n`[Truck left]`, `[Truck right]` — горизонтальное перемещение; `[Pan left]`, `[Pan right]`, `[Pan up]`, `[Pan down]` — панорама; `[Push in]`, `[Pull out]` — наезд/отъезд; `[Pedestal up]`, `[Pedestal down]` — подъём/опускание камеры; `[Tilt up]`, `[Tilt down]` — наклон; `[Zoom in]`, `[Zoom out]` — зум; `[Shake]` — тряска; `[Tracking shot]` — следящий кадр; `[Static shot]` — статика.\n\nКомбинирование: `[Pan left,Pedestal up]` — максимум 3 одновременных команды. Последовательность через связующие слова: «...[Push in], then...[Pull out]». Это фича модели, а не ошибка форматирования. Без bracket syntax камера ведёт себя непредсказуемо.",
      },
      {
        heading: "Prompt Optimizer и его роль",
        body:
          "У Hailuo 2.3 есть параметр `prompt_optimizer` (по умолчанию true) — LLM от MiniMax переписывает/улучшает твой промпт перед генерацией. Это объясняет, почему короткие нечёткие промпты часто дают приемлемый результат — оптимизатор дополняет описание.\n\nКогда оставить `true`: для случайных идей, быстрых тестов, общих задач. LLM добавит camera commands, атмосферные детали, эмоциональные маркеры.\n\nКогда поставить `false`: для production-промптов, точного следования брифу, A/B-тестов. Модель будет следовать твоему промпту буквально, без вмешательства LLM. Если ты прописал детальный промпт с bracket syntax и эмоциональным тоном — выключай оптимизатор, чтобы он не «переписал» твою структуру.",
      },
      {
        heading: "Танец, экшен и микро-выражения",
        body:
          "Hailuo 2.3 особенно силён в трёх сценариях. Первый — танцевальные хореографии и боевой экшен: модель удерживает консистентность тела через сложные движения (флипы, повороты, удары). Описывай конкретные танцевальные термины («pirouette», «contemporary jazz», «backflip»), физические маркеры («arms extended», «body fully rotated»).\n\nВторой — микро-выражения лица: 2.3 точнее передаёт нюансы эмоций (raised eyebrow, slight smirk, eyes welling up). Это уникально среди видеомоделей — большинство дают «общее» выражение.\n\nТретий — разнообразие арт-стилей в одной модели: аниме, тушь, game CG, реализм, акварель, claymation. Стиль задаётся прилагательными в промпте, не отдельной моделью.",
      },
    ],
    examples: [
      {
        before:
          "девушка танцует в красном платье",
        after:
          "[Tracking shot] A young woman in a flowing crimson silk dress performs a contemporary pirouette on a moonlit rooftop, arms extended, hair catching the breeze. Cinematic atmosphere with soft warm rim light from a single streetlamp, dreamlike serene tone, dynamic yet graceful tempo.",
        note:
          "Bracket camera command `[Tracking shot]`, конкретный танцевальный термин (contemporary pirouette), физический маркер (arms extended), эмоциональный тон. Длина в целевом диапазоне 40-60 слов.",
      },
      {
        before:
          "крутой боевой кадр",
        after:
          "[Pan right,Push in] A male martial artist in a black gi delivers a roundhouse kick mid-air on a dimly lit dojo, body fully rotated, focused intense expression. Cinematic action aesthetic, deep shadow contrast, tense and explosive emotional tone, realistic body mechanics.",
        note:
          "Комбинированная камерная команда (pan + push in одновременно), конкретное боевое действие (roundhouse kick), физический маркер (body fully rotated), микро-выражение (focused intense expression).",
      },
      {
        before:
          "аниме девушка под дождём",
        after:
          "[Static shot] An anime-style young woman with long black hair stands under a transparent umbrella on a neon-lit Tokyo street, looking up at the rain with a quiet melancholic smile. Soft watercolor textures, cool blue and magenta neon reflections on wet pavement, dreamy nostalgic tone.",
        note:
          "Указан арт-стиль (anime-style + watercolor textures), микро-выражение (quiet melancholic smile), статичная камера для портретного фокуса. Без указания «аниме» 2.3 может уйти в реализм.",
      },
    ],
    mistakes: [
      {
        title: "Tag-based промпты",
        explain:
          "«cyberpunk, rain, neon, 4k, masterpiece» — Hailuo 2.3 обучена на нарративных описаниях, не на тегах. Tag soup даёт обобщённый результат с генерик динамикой. Пиши режиссёрские заметки с глаголами в present tense и bracket camera commands. Это удваивает качество на тех же словах.",
      },
      {
        title: "Quality boosters вызывают перенасыщение",
        explain:
          "«ultra-detailed, 8k, masterpiece, best quality» вызывают чрезмерную насыщенность и контраст в финальном видео. Hailuo 2.3 чувствительна к таким токенам — они смещают цветокор и могут ломать физику движений. Качество определяется конкретностью описания, не магическими словами.",
      },
      {
        title: "Описание изображения в I2V",
        explain:
          "В I2V-режиме входное изображение определяет содержимое сцены. Промпт должен описывать только ДВИЖЕНИЕ и ИЗМЕНЕНИЯ. «Beautiful girl in red dress walks» при загруженном фото девушки в красном платье — пустые токены до «walks». Пиши короче, фокусируйся на движении и камере.",
      },
      {
        title: "Hailuo 2.3 Fast для T2V",
        explain:
          "Fast-версия 2.3 поддерживает ТОЛЬКО I2V — без T2V. Если хочешь сгенерировать видео из текста без референсного изображения, используй стандартную 2.3 или 02. Это известная путаница: Fast выглядит как «облегчённая» версия, но это другой класс — text-only промпты в неё не работают.",
      },
      {
        title: "Более 3 bracket commands одновременно",
        explain:
          "MiniMax поддерживает комбинирование (`[Pan left,Pedestal up]`), но максимум 3 одновременных. `[Pan left,Pedestal up,Push in,Tilt up]` — перегрузка камерных инструкций, модель не разрешит конфликт и даст хаотичный результат. Для нескольких движений — последовательность через «then»: «[Pan left], then [Push in]».",
      },
    ],
    faq: [
      {
        q: "Чем Hailuo 2.3 отличается от Hailuo 02?",
        a: "2.3 — более новая модель: точнее микро-выражения лица, разнообразнее арт-стили, есть дешёвая Fast-версия (~50% дешевле, только I2V). Hailuo 02 — старая, но сохраняет уникальные козыри: режим FL2V (первый+последний кадр) и сильную физику на экстремальных движениях (гимнастика, паркур). Для большинства стандартных задач T2V/I2V — 2.3.",
      },
      {
        q: "Как работает bracket camera syntax?",
        a: "Это фича MiniMax — квадратные скобки активируют прямой контроль камеры. 15 команд: `[Push in]`, `[Pull out]`, `[Pan left/right/up/down]`, `[Truck left/right]`, `[Pedestal up/down]`, `[Tilt up/down]`, `[Zoom in/out]`, `[Shake]`, `[Tracking shot]`, `[Static shot]`. Комбинирование: `[Pan left,Pedestal up]`, максимум 3 одновременно. Последовательность через «then».",
      },
      {
        q: "Что такое prompt_optimizer и когда его выключать?",
        a: "Это параметр (по умолчанию true), при котором LLM от MiniMax переписывает промпт перед генерацией: добавляет camera commands, атмосферные детали, эмоциональные маркеры. Оставь `true` для быстрых тестов и общих задач — оптимизатор дополнит короткий промпт. Выключи `false` для production: если ты прописал детальный промпт с bracket syntax — LLM может «переписать» твою структуру и испортить контроль.",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "40-60 слов, максимум 2000 символов. Слишком короткий — генерик результат, модель додумывает (или вмешивается prompt_optimizer). Слишком длинный — перегрузка, деформация лиц и объектов. Для T2V целевая длина 40-60 слов; для I2V короче (описывает только движение). С prompt_optimizer можно писать короче — он дополнит.",
      },
      {
        q: "Почему Fast-версия только I2V?",
        a: "Это архитектурное ограничение — Fast 2.3 оптимизирована под анимацию загруженного изображения, без полного pipeline для генерации сцены с нуля. Поэтому она ~2× быстрее и на ~50% дешевле. Если нужно T2V — используй стандартную 2.3. Fast — выбор когда у тебя уже есть готовое изображение и нужна быстрая дешёвая анимация.",
      },
      {
        q: "Как добиться точного арт-стиля (аниме, акварель)?",
        a: "Указывай стиль явно прилагательными в промпте: «anime-style», «watercolor textures», «ink-wash painting», «game CG aesthetic», «claymation style», «hand-drawn animation». Без явного указания 2.3 уйдёт в реализм по дефолту. Для аниме также добавляй «cel-shaded», «vibrant colors», «expressive eyes». Можно стакать стиль с bracket camera и эмоциональным маркером.",
      },
      {
        q: "Поддерживается ли Opten для Hailuo 2.3?",
        a: "Да, расширение Opten автоматически распознаёт MiniMax Hailuo 2.3 и оценивает промпты по структуре выше: проверяет наличие конкретного субъекта, глаголов в present tense, bracket camera commands, эмоциональных маркеров, оптимальную длину 40-60 слов, отсутствие quality boosters и tag soup. Одним кликом получаешь rewrite в формате режиссёрских заметок с bracket syntax.",
      },
    ],
  },
  en: {
    title: "MiniMax Hailuo 2.3 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for MiniMax Hailuo 2.3: director's notes, bracket camera syntax, micro-expressions and dance, common mistakes, and before/after examples.",
    h1: "MiniMax Hailuo 2.3: how to write prompts the model actually understands",
    intro:
      "MiniMax Hailuo 2.3 is the flagship of MiniMax video models: T2V and I2V up to 1080P, 25fps, with bracket camera syntax `[Push in]` support. Prompts are written as director's notes in natural language, not tags. English is recommended; Chinese is the native training language. Optimal length 40-60 words.",
    sections: [
      {
        heading: "What Hailuo 2.3 does",
        body:
          "Hailuo 2.3 is newer and more precise than 02. Strengths: dance choreography and full action with realistic body mechanics (flips, jumps, fight scenes); facial micro-expressions with improved emotional precision; diverse art styles in one model (anime, ink wash, game CG, realism, watercolor, claymation); precise cinematic control via bracket camera syntax.\n\nA Fast version exists — ~2× faster and ~50% cheaper than standard, but I2V only (no T2V). Supports 768P (default) and 1080P at 25fps. Duration 6s or 10s at 768P; 6s at 1080P. Max prompt length 2000 characters; a built-in prompt_optimizer is available.",
        bullets: [
          "T2V + I2V; Fast version is I2V only",
          "Resolutions: 768P (default), 1080P, 25fps",
          "15 bracket camera commands, up to 3 combined",
          "Strengths: dance, action, micro-expressions, style diversity",
          "prompt_optimizer (default true) — LLM rewrites your prompt",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Ideal length 40-60 words, max 2000 characters. Style — director's notes in natural language, NOT tags.\n\nFormula: [Camera + motion] + [Subject + description] + [Action in present tense] + [Style and atmosphere] + [Emotional markers].\n\nExample: «[Tracking shot] A young dancer in a flowing crimson dress spins gracefully across a moonlit rooftop, hair catching the breeze, arms extended. Cinematic, dreamlike atmosphere, soft warm rim light, serene yet powerful emotional tone.» Concrete present-tense verbs («spins», «catching», «extended»), bracket camera command up front, emotional anchor at the end.",
      },
      {
        heading: "Bracket Camera Syntax — 15 commands",
        body:
          "The headline MiniMax-family feature — precise cinematic control through square brackets. 15 commands available:\n\n`[Truck left]`, `[Truck right]` — horizontal trucking; `[Pan left]`, `[Pan right]`, `[Pan up]`, `[Pan down]` — panning; `[Push in]`, `[Pull out]` — in/out; `[Pedestal up]`, `[Pedestal down]` — camera height; `[Tilt up]`, `[Tilt down]` — tilt; `[Zoom in]`, `[Zoom out]` — zoom; `[Shake]`; `[Tracking shot]`; `[Static shot]`.\n\nCombination: `[Pan left,Pedestal up]` — up to 3 simultaneous. Sequencing via connecting words: «...[Push in], then...[Pull out].» This is a model feature, not a formatting error. Without bracket syntax the camera behaves unpredictably.",
      },
      {
        heading: "Prompt Optimizer and its role",
        body:
          "Hailuo 2.3 has a `prompt_optimizer` parameter (default true) — MiniMax's LLM rewrites/improves your prompt before generation. This explains why short, vague prompts often produce acceptable results — the optimizer fills in.\n\nWhen to leave `true`: random ideas, quick tests, general tasks. The LLM will add camera commands, atmospheric details, emotional markers.\n\nWhen to set `false`: production prompts, exact brief following, A/B tests. The model will follow your prompt literally, with no LLM intervention. If you wrote a detailed prompt with bracket syntax and emotional tone — turn the optimizer off so it doesn't «rewrite» your structure.",
      },
      {
        heading: "Dance, action, and micro-expressions",
        body:
          "Hailuo 2.3 is especially strong in three scenarios. First — dance choreography and combat action: the model holds body consistency through complex motion (flips, spins, strikes). Use concrete dance terms («pirouette», «contemporary jazz», «backflip»), physical markers («arms extended», «body fully rotated»).\n\nSecond — facial micro-expressions: 2.3 conveys emotional nuance more precisely (raised eyebrow, slight smirk, eyes welling up). This is unique among video models — most give you «generic» expression.\n\nThird — diverse art styles in one model: anime, ink wash, game CG, realism, watercolor, claymation. Style is set by adjectives in the prompt, not by a separate model.",
      },
    ],
    examples: [
      {
        before: "girl dancing in a red dress",
        after:
          "[Tracking shot] A young woman in a flowing crimson silk dress performs a contemporary pirouette on a moonlit rooftop, arms extended, hair catching the breeze. Cinematic atmosphere with soft warm rim light from a single streetlamp, dreamlike serene tone, dynamic yet graceful tempo.",
        note:
          "Bracket camera command `[Tracking shot]`, concrete dance term (contemporary pirouette), physical marker (arms extended), emotional tone. Length sits in the 40-60 word target range.",
      },
      {
        before: "cool fight shot",
        after:
          "[Pan right,Push in] A male martial artist in a black gi delivers a roundhouse kick mid-air on a dimly lit dojo, body fully rotated, focused intense expression. Cinematic action aesthetic, deep shadow contrast, tense and explosive emotional tone, realistic body mechanics.",
        note:
          "Combined camera command (pan + push in simultaneously), concrete combat action (roundhouse kick), physical marker (body fully rotated), micro-expression (focused intense expression).",
      },
      {
        before: "anime girl in the rain",
        after:
          "[Static shot] An anime-style young woman with long black hair stands under a transparent umbrella on a neon-lit Tokyo street, looking up at the rain with a quiet melancholic smile. Soft watercolor textures, cool blue and magenta neon reflections on wet pavement, dreamy nostalgic tone.",
        note:
          "Art style is explicit (anime-style + watercolor textures), micro-expression (quiet melancholic smile), static camera for portrait focus. Without an «anime» tag 2.3 may drift into realism.",
      },
    ],
    mistakes: [
      {
        title: "Tag-based prompts",
        explain:
          "«cyberpunk, rain, neon, 4k, masterpiece» — Hailuo 2.3 was trained on narrative descriptions, not tags. Tag soup gives generic output with generic dynamics. Write director's notes with present-tense verbs and bracket camera commands. That alone doubles quality on the same set of words.",
      },
      {
        title: "Quality boosters cause oversaturation",
        explain:
          "«ultra-detailed, 8k, masterpiece, best quality» cause excessive saturation and contrast in the final video. Hailuo 2.3 is sensitive to those tokens — they shift the color grade and can break motion physics. Quality comes from description specificity, not magic words.",
      },
      {
        title: "Describing the image in I2V",
        explain:
          "In I2V mode the input image defines scene contents. The prompt should describe only MOTION and CHANGES. «Beautiful girl in red dress walks» with a photo of a girl in a red dress already loaded — empty tokens up to «walks.» Write shorter, focus on motion and camera.",
      },
      {
        title: "Hailuo 2.3 Fast for T2V",
        explain:
          "The Fast version of 2.3 supports I2V ONLY — no T2V. If you want to generate from text without a reference image, use the standard 2.3 or 02. This is a known confusion: Fast looks like a «lite» version, but it's a different class — text-only prompts don't work in it.",
      },
      {
        title: "More than 3 bracket commands at once",
        explain:
          "MiniMax supports combining (`[Pan left,Pedestal up]`), but max 3 at once. `[Pan left,Pedestal up,Push in,Tilt up]` overloads camera instructions, the model won't resolve the conflict and outputs chaos. For multiple moves — sequence via «then»: «[Pan left], then [Push in].»",
      },
    ],
    faq: [
      {
        q: "How is Hailuo 2.3 different from Hailuo 02?",
        a: "2.3 is the newer model: more precise micro-expressions, more diverse art styles, and a cheap Fast version (~50% cheaper, I2V only). Hailuo 02 is older but retains unique aces: FL2V mode (first + last frame) and strong physics on extreme motion (gymnastics, parkour). For most standard T2V/I2V tasks — 2.3.",
      },
      {
        q: "How does bracket camera syntax work?",
        a: "It's a MiniMax feature — square brackets activate direct camera control. 15 commands: `[Push in]`, `[Pull out]`, `[Pan left/right/up/down]`, `[Truck left/right]`, `[Pedestal up/down]`, `[Tilt up/down]`, `[Zoom in/out]`, `[Shake]`, `[Tracking shot]`, `[Static shot]`. Combination: `[Pan left,Pedestal up]`, up to 3 at once. Sequencing via «then.»",
      },
      {
        q: "What is prompt_optimizer and when do I turn it off?",
        a: "It's a parameter (default true) where MiniMax's LLM rewrites the prompt before generation: adds camera commands, atmospheric details, emotional markers. Leave `true` for quick tests and general tasks — the optimizer fills in a short prompt. Set `false` for production: if you wrote a detailed prompt with bracket syntax, the LLM might «rewrite» your structure and break control.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "40-60 words, max 2000 characters. Too short — generic output; the model fills in (or prompt_optimizer steps in). Too long — overload, face/object deformation. For T2V target 40-60 words; for I2V shorter (describes motion only). With prompt_optimizer you can write shorter — it will fill in.",
      },
      {
        q: "Why is the Fast version I2V only?",
        a: "Architectural limit — Fast 2.3 is optimized for animating a loaded image, without the full pipeline for generating a scene from scratch. That's how it's ~2× faster and ~50% cheaper. If you need T2V — use standard 2.3. Fast is the choice when you already have a finished image and need quick cheap animation.",
      },
      {
        q: "How do I lock in a specific art style (anime, watercolor)?",
        a: "State the style explicitly with adjectives: «anime-style», «watercolor textures», «ink-wash painting», «game CG aesthetic», «claymation style», «hand-drawn animation.» Without an explicit call, 2.3 drifts into realism by default. For anime, also add «cel-shaded», «vibrant colors», «expressive eyes.» You can stack the style with a bracket camera and an emotional marker.",
      },
      {
        q: "Does Opten support Hailuo 2.3?",
        a: "Yes, the Opten extension auto-detects MiniMax Hailuo 2.3 and scores prompts against the structure above: it checks for a concrete subject, present-tense verbs, bracket camera commands, emotional markers, optimal 40-60 word length, and absence of quality boosters and tag soup. One click gives you a rewrite in the director's-notes format with bracket syntax.",
      },
    ],
  },
};
