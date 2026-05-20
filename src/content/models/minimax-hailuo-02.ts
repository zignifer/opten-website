// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for minimax-hailuo-02.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для MiniMax Hailuo 02: структура, ошибки, примеры",
    description:
      "Как писать промпты для MiniMax Hailuo 02: уникальный режим FL2V, bracket camera syntax, экстремальная физика, типичные ошибки и примеры до/после с разбором.",
    h1: "MiniMax Hailuo 02: как писать промпты, которые модель понимает",
    intro:
      "MiniMax Hailuo 02 — предшественник Hailuo 2.3, до сих пор актуальный благодаря уникальному режиму FL2V (First-and-Last-Frame-to-Video) и сильной физике на экстремальных движениях вроде гимнастики и паркура. Промпт пишется как режиссёрские заметки, поддерживается bracket camera syntax `[Push in]`. Английский предпочтителен; оптимальная длина 40-60 слов.",
    sections: [
      {
        heading: "Что умеет Hailuo 02",
        body:
          "Hailuo 02 — старая видеомодель MiniMax, но не «устаревшая». У неё есть два уникальных козыря, которых нет в более новой 2.3.\n\nПервый — режим FL2V (First-and-Last-Frame-to-Video): модель принимает ДВА кадра (начальный и конечный) и генерирует плавный переход между ними. Это незаменимо для морфинга, сезонных трансформаций (лето → зима), смены состояний объекта.\n\nВторой — экстремальная физика: гимнастика, паркур, акробатика, сложные физические движения. На таких сценах 02 даёт более реалистичную динамику, чем 2.3. Плюс поддержка 512P для быстрого прототипирования. Для всего остального — стандартных T2V и I2V — лучше брать 2.3.",
        bullets: [
          "FL2V — уникальный режим первого и последнего кадра",
          "Экстремальная физика: гимнастика, паркур, акробатика",
          "Разрешения: 512P, 768P (default), 1080P",
          "Длительность: 6с или 10с (на 512P/768P); 6с на 1080P",
          "Bracket camera syntax `[Push in]`, `[Tracking shot]`, до 3 одновременных команд",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Стиль совпадает с Hailuo 2.3 — режиссёрские заметки на естественном языке, не теги. Оптимальная длина 40-60 слов, максимум 2000 символов.\n\nФормула: [Камера + движение] + [Субъект + описание] + [Действие в present tense] + [Стиль и атмосфера] + [Эмоциональные маркеры].\n\nПример: «[Push in] A young woman in a flowing red dress spins gracefully on a moonlit terrace, her hair catching the breeze. Cinematic, dreamlike atmosphere, soft warm rim light, serene emotional tone.» Глаголы в настоящем времени («spins», «catches»), бренд-семантика «[Push in]» — bracket syntax работает.",
      },
      {
        heading: "FL2V — уникальный режим",
        body:
          "Главная фича Hailuo 02. Принимает два кадра: первый = начальное состояние сцены, последний = конечное состояние. Модель генерирует плавный переход. Это другой стиль промптинга — не описание сцены, а описание ПРОЦЕССА перехода.\n\nХороший FL2V промпт: «The flower gradually blooms, petals slowly unfurling outward, camera holding steady on a close-up». Плохой — описание содержимого первого или последнего кадра (они уже определены изображениями). Указывай характер перехода: плавный, резкий, постепенный. Указывай поведение камеры во время перехода. Если в настройках выбран FL2V, но второго кадра нет — это критическая ошибка, модель не сможет сгенерировать.",
      },
      {
        heading: "Bracket Camera Syntax",
        body:
          "Hailuo 02 поддерживает тот же синтаксис, что и 2.3 — точный кинематографический контроль через квадратные скобки. Базовые команды: `[Truck left]`, `[Truck right]` (горизонтальное перемещение); `[Pan left]`, `[Pan right]` (панорама); `[Push in]`, `[Pull out]` (наезд/отъезд); `[Pedestal up]`, `[Pedestal down]` (подъём камеры); `[Tilt up]`, `[Tilt down]` (наклон); `[Zoom in]`, `[Zoom out]` (зум); `[Shake]` (тряска); `[Tracking shot]` (следящий кадр); `[Static shot]` (статика).\n\nКомбинирование: `[Pan left,Pedestal up]` — максимум 3 одновременных команды. Последовательно: «...[Push in], then...[Pull out]». Это фича модели, а не ошибка форматирования — bracket syntax активирует прямой контроль камеры.",
      },
      {
        heading: "Экстремальная физика и 512P",
        body:
          "На сложных физических движениях Hailuo 02 даёт более реалистичную динамику, чем 2.3: гимнастика, паркур, акробатика, флипы, прыжки с поворотами. Если задача — реалистичный экшен или спортивная сцена, 02 — правильный выбор.\n\n512P уникален: 2.3 начинается с 768P, а 02 поддерживает 512P для быстрых тестов идей перед финальным рендером. На 512P можно итерировать 10 вариантов за то же время, что один на 1080P. После того как нашёл рабочий промпт, переключайся на 768P или 1080P для финала. Это сценарий, где 02 экономит время на ранней фазе.",
      },
    ],
    examples: [
      {
        before:
          "красивый закат превращается в ночь",
        after:
          "[FL2V mode, frame 1: golden sunset over the ocean; frame 2: deep blue night with stars]. The sky gradually transitions from warm golden tones to deep indigo, sun slowly sinking below the horizon, first stars beginning to twinkle. Camera holds steady on the wide horizon. Smooth, gradual atmospheric shift, peaceful contemplative mood.",
        note:
          "FL2V промпт описывает ПРОЦЕСС перехода, не кадры (они заданы изображениями). Указан характер перехода (gradual, smooth), поведение камеры (holds steady), эмоциональный тон.",
      },
      {
        before:
          "гимнастка делает сальто",
        after:
          "[Tracking shot] A young female gymnast in a white leotard performs a backflip on a sunlit gymnastics floor, body fully extended mid-air, sharp focus on her arched form. Realistic physics, smooth body mechanics, dynamic energy. Sports broadcast aesthetic, tense and energetic emotional tone.",
        note:
          "Экстремальная физика — сильная сторона Hailuo 02. Bracket `[Tracking shot]` ведёт камеру за движением. Глагол в present tense, явные физические маркеры (body fully extended, arched form).",
      },
      {
        before:
          "кошка прыгает на стол",
        after:
          "[Static shot] A ginger cat crouches on the kitchen floor, tail flicking, then leaps gracefully onto the wooden countertop, landing softly. Natural daylight from the window, calm domestic atmosphere, slight cinematic tension during the leap.",
        note:
          "Статичная камера для предсказуемого кадра, конкретные глаголы (crouches, flicking, leaps, landing), описание физики приземления (softly). Не tag soup «кошка, прыжок, кухня, 4K».",
      },
    ],
    mistakes: [
      {
        title: "Tag-based промпты вместо предложений",
        explain:
          "«cyberpunk, rain, neon, 4k» — Hailuo 02 обучена на нарративных описаниях. Tag soup даёт обобщённый результат с непредсказуемой динамикой. Пиши режиссёрские заметки: «[Push in] Neon-lit Tokyo street, heavy rain falling on wet asphalt, lone figure walking through reflections.»",
      },
      {
        title: "Quality boosters в стиле «8k masterpiece»",
        explain:
          "«ultra-detailed, 8k, masterpiece, best quality» вызывают чрезмерную насыщенность и контраст в финальном видео. Качество определяется конкретностью описания сцены, движения и камеры, а не магическими токенами. На Hailuo 02 quality spam особенно ломает физику движений.",
      },
      {
        title: "Описание содержимого первого/последнего кадра в FL2V",
        explain:
          "Если включён режим FL2V, первый и последний кадры заданы изображениями — их не нужно описывать. Промпт должен описывать ПРОЦЕСС ПЕРЕХОДА между ними: характер движения, поведение камеры, темп. Описание содержимого кадров тратит токены и сбивает модель.",
      },
      {
        title: "FL2V без второго референса",
        explain:
          "FL2V требует ДВА изображения — первый и последний кадр. Если в настройках выбран FL2V, но загружен только один или ни одного — это критическая ошибка, модель не сможет сгенерировать переход. Перед использованием FL2V убедись, что оба референса загружены.",
      },
      {
        title: "Использование 02 когда нужен 2.3",
        explain:
          "Hailuo 02 — старая модель. Если задача стандартная (T2V или I2V без FL2V, без экстремальной физики) — лучше брать Hailuo 2.3: она новее, точнее, дешевле в Fast-версии. 02 имеет смысл только для FL2V, спортивной физики или быстрых тестов на 512P. Для большинства задач — 2.3 правильнее.",
      },
    ],
    faq: [
      {
        q: "Чем Hailuo 02 отличается от Hailuo 2.3?",
        a: "Hailuo 2.3 — более новая модель, по умолчанию лучше для стандартных T2V/I2V задач: точнее микро-выражения лица, разнообразнее арт-стили, есть дешёвая Fast-версия. Hailuo 02 — старая, но сохраняет два уникальных козыря: режим FL2V (первый+последний кадр) и сильную физику на экстремальных движениях (гимнастика, паркур). Плюс поддержка 512P для быстрых тестов.",
      },
      {
        q: "Что такое FL2V и когда его использовать?",
        a: "First-and-Last-Frame-to-Video — режим, где модель принимает два кадра (начальный и конечный) и генерирует плавный переход между ними. Это незаменимо для морфинга (лето → зима, цветок до и после цветения, превращение объекта), для контролируемых сезонных переходов и трансформаций. Промпт описывает ПРОЦЕСС перехода, не сами кадры — они уже заданы изображениями.",
      },
      {
        q: "Как работает bracket camera syntax?",
        a: "Это фича MiniMax — квадратные скобки активируют прямой контроль камеры. Доступны 15 команд: `[Push in]`, `[Pull out]`, `[Pan left/right]`, `[Truck left/right]`, `[Pedestal up/down]`, `[Tilt up/down]`, `[Zoom in/out]`, `[Shake]`, `[Tracking shot]`, `[Static shot]`. Комбинирование: `[Pan left,Pedestal up]`, максимум 3 одновременно. Последовательность через «then»: «[Push in], then [Pull out]».",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "40-60 слов, максимум 2000 символов. Слишком короткий промпт даёт генерик результат — модель додумывает. Слишком длинный приводит к перегрузке и деформации лиц/объектов. Для T2V и FL2V целевая длина 40-60 слов; для I2V промпт может быть короче (он описывает только движение, не содержимое).",
      },
      {
        q: "Когда выбрать 02 вместо 2.3?",
        a: "Три сценария: (1) нужен FL2V — это только в 02; (2) экстремальная физика — гимнастика, паркур, акробатика, флипы — 02 даёт более реалистичную динамику; (3) быстрое прототипирование на 512P — 2.3 начинается с 768P, на 02 можно итерировать 10 вариантов на 512P, потом перейти на 1080P для финала. Во всех остальных случаях — 2.3.",
      },
      {
        q: "Поддерживается ли русский язык в промптах?",
        a: "MiniMax поддерживает мультиязычность, но рекомендует английский для международных пользователей и китайский (родной язык обучения). Русский технически работает, но даёт менее предсказуемые результаты на сложных сценах. Рекомендация: основная масса промпта на английском, с bracket camera commands.",
      },
      {
        q: "Поддерживается ли Opten для Hailuo 02?",
        a: "Да, расширение Opten автоматически распознаёт MiniMax Hailuo 02 и оценивает промпты по структуре выше: проверяет наличие конкретного субъекта, глаголов в present tense, bracket camera commands, оптимальную длину 40-60 слов, отсутствие quality boosters. Для FL2V — проверяет наличие двух референсов и что промпт описывает ПЕРЕХОД, а не кадры. Одним кликом получаешь rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "MiniMax Hailuo 02 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for MiniMax Hailuo 02: the unique FL2V mode, bracket camera syntax, extreme physics, common mistakes, and before/after examples with notes.",
    h1: "MiniMax Hailuo 02: how to write prompts the model actually understands",
    intro:
      "MiniMax Hailuo 02 is the predecessor of Hailuo 2.3, still relevant for its unique FL2V (First-and-Last-Frame-to-Video) mode and strong physics on extreme motion. Prompts are written as director's notes; bracket camera syntax `[Push in]` is supported. English is preferred; optimal length 40-60 words.",
    sections: [
      {
        heading: "What Hailuo 02 does",
        body:
          "Hailuo 02 is MiniMax's older video model, but not «outdated.» It has two unique aces that newer 2.3 doesn't have.\n\nFirst — FL2V (First-and-Last-Frame-to-Video) mode: the model takes TWO frames (start and end) and generates a smooth transition between them. Indispensable for morphing, seasonal transformations (summer → winter), state changes of an object.\n\nSecond — extreme physics: gymnastics, parkour, acrobatics, complex physical motion. On scenes like that, 02 delivers more realistic dynamics than 2.3. Plus 512P support for rapid prototyping. For everything else — standard T2V and I2V — pick 2.3.",
        bullets: [
          "FL2V — unique first-and-last-frame mode",
          "Extreme physics: gymnastics, parkour, acrobatics",
          "Resolutions: 512P, 768P (default), 1080P",
          "Duration: 6s or 10s (at 512P/768P); 6s at 1080P",
          "Bracket camera syntax `[Push in]`, `[Tracking shot]`, up to 3 combined commands",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Style matches Hailuo 2.3 — director's notes in natural language, not tags. Optimal length 40-60 words, max 2000 characters.\n\nFormula: [Camera + motion] + [Subject + description] + [Action in present tense] + [Style and atmosphere] + [Emotional markers].\n\nExample: «[Push in] A young woman in a flowing red dress spins gracefully on a moonlit terrace, her hair catching the breeze. Cinematic, dreamlike atmosphere, soft warm rim light, serene emotional tone.» Verbs in present tense («spins», «catches»), brand semantics «[Push in]» — bracket syntax works.",
      },
      {
        heading: "FL2V — the unique mode",
        body:
          "The headline feature of Hailuo 02. It takes two frames: first = the starting state of the scene, last = the ending state. The model generates a smooth transition. This is a different prompting style — not a scene description, but a description of the TRANSITION process.\n\nGood FL2V prompt: «The flower gradually blooms, petals slowly unfurling outward, camera holding steady on a close-up.» Bad — describing the contents of the first or last frame (they're already set by images). Specify the transition character: smooth, abrupt, gradual. Specify camera behavior during the transition. If FL2V is enabled in settings but the second frame is missing — that's a critical error; the model can't generate.",
      },
      {
        heading: "Bracket Camera Syntax",
        body:
          "Hailuo 02 supports the same syntax as 2.3 — precise cinematic control through square brackets. Core commands: `[Truck left]`, `[Truck right]` (horizontal trucking); `[Pan left]`, `[Pan right]` (panning); `[Push in]`, `[Pull out]` (in/out); `[Pedestal up]`, `[Pedestal down]` (camera height); `[Tilt up]`, `[Tilt down]` (tilt); `[Zoom in]`, `[Zoom out]` (zoom); `[Shake]`; `[Tracking shot]`; `[Static shot]`.\n\nCombination: `[Pan left,Pedestal up]` — up to 3 simultaneous commands. Sequential: «...[Push in], then...[Pull out].» This is a model feature, not a formatting error — bracket syntax activates direct camera control.",
      },
      {
        heading: "Extreme physics and 512P",
        body:
          "On complex physical motion Hailuo 02 delivers more realistic dynamics than 2.3: gymnastics, parkour, acrobatics, flips, twisting jumps. If the task is realistic action or a sports scene, 02 is the right pick.\n\n512P is unique: 2.3 starts at 768P, but 02 supports 512P for rapid testing before the final render. At 512P you can iterate 10 variants in the time it takes to render one at 1080P. Once you find a working prompt, switch to 768P or 1080P for the final. This is the scenario where 02 saves time on the early phase.",
      },
    ],
    examples: [
      {
        before: "beautiful sunset turns into night",
        after:
          "[FL2V mode, frame 1: golden sunset over the ocean; frame 2: deep blue night with stars]. The sky gradually transitions from warm golden tones to deep indigo, sun slowly sinking below the horizon, first stars beginning to twinkle. Camera holds steady on the wide horizon. Smooth, gradual atmospheric shift, peaceful contemplative mood.",
        note:
          "An FL2V prompt describes the PROCESS of transition, not the frames (they're set by images). Transition character (gradual, smooth), camera behavior (holds steady), and emotional tone are explicit.",
      },
      {
        before: "gymnast does a flip",
        after:
          "[Tracking shot] A young female gymnast in a white leotard performs a backflip on a sunlit gymnastics floor, body fully extended mid-air, sharp focus on her arched form. Realistic physics, smooth body mechanics, dynamic energy. Sports broadcast aesthetic, tense and energetic emotional tone.",
        note:
          "Extreme physics is Hailuo 02's strength. The `[Tracking shot]` bracket keeps the camera on the motion. Present-tense verb, explicit physical markers (body fully extended, arched form).",
      },
      {
        before: "cat jumps onto the table",
        after:
          "[Static shot] A ginger cat crouches on the kitchen floor, tail flicking, then leaps gracefully onto the wooden countertop, landing softly. Natural daylight from the window, calm domestic atmosphere, slight cinematic tension during the leap.",
        note:
          "Static camera for a predictable shot, concrete verbs (crouches, flicking, leaps, landing), landing physics described (softly). Not tag soup like «cat, jump, kitchen, 4K.»",
      },
    ],
    mistakes: [
      {
        title: "Tag-based prompts instead of sentences",
        explain:
          "«cyberpunk, rain, neon, 4k» — Hailuo 02 was trained on narrative descriptions. Tag soup yields generic results with unpredictable dynamics. Write director's notes: «[Push in] Neon-lit Tokyo street, heavy rain falling on wet asphalt, lone figure walking through reflections.»",
      },
      {
        title: "Quality boosters like «8k masterpiece»",
        explain:
          "«ultra-detailed, 8k, masterpiece, best quality» cause excessive saturation and contrast in the final video. Quality is determined by scene, motion, and camera specificity — not magic tokens. On Hailuo 02 quality spam especially breaks motion physics.",
      },
      {
        title: "Describing first/last frame contents in FL2V",
        explain:
          "If FL2V is on, the first and last frames are defined by images — don't describe them. The prompt must describe the TRANSITION PROCESS between them: motion character, camera behavior, tempo. Restating frame contents wastes tokens and confuses the model.",
      },
      {
        title: "FL2V without a second reference",
        explain:
          "FL2V requires TWO images — first and last frame. If FL2V is selected in settings but only one or no image is loaded, that's a critical error and the model can't generate the transition. Before using FL2V, make sure both references are uploaded.",
      },
      {
        title: "Using 02 when 2.3 is the right choice",
        explain:
          "Hailuo 02 is the older model. If the task is standard (T2V or I2V without FL2V, without extreme physics), 2.3 is better: newer, more precise, with a cheaper Fast version. 02 only makes sense for FL2V, sports physics, or quick 512P tests. For most tasks — 2.3 is the right call.",
      },
    ],
    faq: [
      {
        q: "How is Hailuo 02 different from Hailuo 2.3?",
        a: "Hailuo 2.3 is the newer model, generally better for standard T2V/I2V tasks: more precise micro-expressions, more diverse art styles, and a cheap Fast version. Hailuo 02 is older but retains two unique aces: FL2V mode (first + last frame) and strong physics on extreme motion (gymnastics, parkour). Plus 512P support for rapid testing.",
      },
      {
        q: "What is FL2V and when should I use it?",
        a: "First-and-Last-Frame-to-Video — a mode where the model accepts two frames (start and end) and generates a smooth transition between them. Indispensable for morphing (summer → winter, flower before/after blooming, object transformation), controlled seasonal transitions, and state changes. The prompt describes the TRANSITION process, not the frames themselves — they're already set by images.",
      },
      {
        q: "How does bracket camera syntax work?",
        a: "It's a MiniMax feature — square brackets activate direct camera control. 15 commands available: `[Push in]`, `[Pull out]`, `[Pan left/right]`, `[Truck left/right]`, `[Pedestal up/down]`, `[Tilt up/down]`, `[Zoom in/out]`, `[Shake]`, `[Tracking shot]`, `[Static shot]`. Combination: `[Pan left,Pedestal up]`, up to 3 at once. Sequencing via «then»: «[Push in], then [Pull out].»",
      },
      {
        q: "What's the optimal prompt length?",
        a: "40-60 words, max 2000 characters. Too short — generic output; the model fills in. Too long — overload and face/object deformation. Target 40-60 words for T2V and FL2V; I2V prompts can be shorter (they describe only motion, not contents).",
      },
      {
        q: "When pick 02 over 2.3?",
        a: "Three scenarios: (1) you need FL2V — only in 02; (2) extreme physics — gymnastics, parkour, acrobatics, flips — 02 delivers more realistic dynamics; (3) rapid prototyping at 512P — 2.3 starts at 768P, on 02 you can iterate 10 variants at 512P, then move to 1080P for the final. In all other cases — 2.3.",
      },
      {
        q: "Is Russian supported in prompts?",
        a: "MiniMax supports multilingual input, but recommends English for international users and Chinese (the native training language). Russian technically works but yields less predictable results on complex scenes. Recommendation: keep the bulk of the prompt in English, with bracket camera commands.",
      },
      {
        q: "Does Opten support Hailuo 02?",
        a: "Yes, the Opten extension auto-detects MiniMax Hailuo 02 and scores prompts against the structure above: it checks for a concrete subject, present-tense verbs, bracket camera commands, optimal 40-60 word length, and absence of quality boosters. For FL2V — it checks both references are present and that the prompt describes the TRANSITION, not the frames. One click gives you a rewrite in the correct structure.",
      },
    ],
  },
};
