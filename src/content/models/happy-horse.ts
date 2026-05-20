// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for happy-horse.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Happy Horse 1.0: структура, ошибки, примеры",
    description:
      "Как писать промпты для Happy Horse 1.0 от Alibaba: правило 20 слов, brevity wins, joint audio-video, lip-sync на 7 языках, типичные ошибки и примеры до/после.",
    h1: "Happy Horse 1.0: как писать промпты, которые модель понимает",
    intro:
      "Happy Horse 1.0 (快乐小马) — video-модель от Alibaba ATH AI Innovation Unit, 15B параметров, unified single-stream Transformer. Генерирует 5–8 секунд 1080p за ~10 секунд на H100. Joint audio-video в одном forward pass, lip-sync на 7 языках, open source. Главное правило промптинга — brevity wins, ~20 слов на простой кадр.",
    sections: [
      {
        heading: "Что умеет Happy Horse 1.0",
        body:
          "Happy Horse — open-source модель с топ-1 рейтингом на Artificial Analysis Video Arena (T2V Elo 1333, I2V Elo 1392). T2I и I2V из одних и тех же весов, нативные 1080p без апскейла.\n\nKлючевая фича — joint audio-video: видео и звук генерируются в одном forward pass и синхронизированы по умолчанию. Lip-sync на 7 языках (English, Mandarin, Cantonese, Japanese, Korean, German, French) с ультра-низким WER. До 12 multimodal входов: текст + reference images + reference videos + audio references. Длительность 5–8 секунд по умолчанию, до 15 на платном тире.",
        bullets: [
          "15B параметров, unified single-stream Transformer",
          "Нативный 1080p без апскейла, длительность 5–8 секунд",
          "Joint audio-video в одном forward pass",
          "Lip-sync на 7 языках с ультра-низким WER",
          "Топ-1 на Artificial Analysis Video Arena (T2V и I2V)",
        ],
      },
      {
        heading: "Структура промпта и правило 20 слов",
        body:
          "Default-шаблон закрывает 80% задач: «[Subject] [does action] in [setting], [time of day], [one atmosphere or camera cue]». Примерно 20 слов.\n\nПримеры рабочих промптов: «A young woman in a red coat walks down a wet city street at night, neon reflections». «A 1965 cherry-red Mustang convertible drives along a winding California coastal highway at midday». «An orange tabby cat coiled on a velvet sofa leaps to a tall oak bookshelf».\n\nЗолотое правило: brevity wins. У модели конечный «бюджет внимания», и каждое лишнее слово отнимает мощность у рендеринга. Длинные промпты буквально ухудшают результат: лица плывут, кисти теряют геометрию, походка уплощается.",
      },
      {
        heading: "Когда уместен длинный промпт",
        body:
          "Длинный промпт оправдан в одном случае — когда кадр опирается на язык камеры (Steadicam push, slow dolly-in, helicopter aerial). Камерный cue ставь в конец промпта — там он получает максимальный вес.\n\nДля multi-beat сцен используй shot list с таймкодами: «Shot 1 (wide establishing, 0-1s): ...», «Shot 2 (mid tracking, 1-4s): ...», «Shot 3 (slow push-in close, 4-5s): ...». В тестах fal.ai shot-list с таймкодами разводит beat'ы корректно, а та же сцена в виде сплошной прозы коллапсирует в одно размытое движение.\n\nMarkdown секции (## Subject, ## Action, ## Setting, ## Camera, ## Lighting, ## Mood) — для single-take с множеством осей контроля. Использовать ТОЛЬКО когда есть контент для большинства секций. Пустые заголовки вредят.",
      },
      {
        heading: "Сильные стороны и слабые",
        body:
          "Сильные стороны (используйте их): камерные движения (Steadicam push, slow dolly-in, helicopter aerial — модель необычно хорошо понимает английскую камерную лексику); атмосферное освещение (blue hour alley, neon noir, single hard top-down key с deep falloff, warm amber backlight + cool blue ambient); машины, металл, хром, отражения; ткани и волосы на ветру (secondary motion удерживается всю длительность); огонь и искры с правильной теплотой.\n\nСлабые стороны: длинные human action sequences с лицами в фокусе. Сторителлинг-проза вместо production notes (модель исполняет инструкции, не повествование). Эмоция как абстракция («sad woman», «happy moment») — переводи в физические детали: микро-выражения, направление взгляда, темп дыхания, паузы.",
      },
      {
        heading: "Joint audio-video и lip-sync",
        body:
          "Звук генерируется параллельно с видео в одном forward pass — это уникальная фича Happy Horse. Управляй звуком через текст:\n\n«dialogue in English: 'Hey, are you ready?'», «ambient: distant traffic, light rain», «Foley: footsteps on gravel, fabric rustling». Если звук не описан — модель сделает звук по визуальной логике (но иногда наобум).\n\nLip-sync на 7 языках: English, Mandarin, Cantonese, Japanese, Korean, German, French. Указывай язык в DIALOGUE-блоке для синхронизации губ. Внимание: даже несмотря на китайское происхождение модели, Mandarin для визуала проигрывает английскому — китайский используй ТОЛЬКО в DIALOGUE для китайского lip-sync.",
      },
    ],
    examples: [
      {
        before:
          "A beautiful gorgeous stunning woman in a magnificent red coat masterpiece walking elegantly down a breathtaking wet city street at night with insane neon reflections, ultra detailed, hyperrealistic, 8k cinematography",
        after:
          "A young woman in a red coat walks down a wet city street at night, neon reflections, 35mm telephoto, slow tracking dolly.",
        note:
          "Anti-slop правило: эпитеты-хеджи (beautiful, gorgeous, stunning, masterpiece, ultra detailed) съедают токенный бюджет и тянут к average-look. ~20 слов с камерным cue в конце — sweet spot.",
      },
      {
        before: "happy man walking and feeling good about life in a nice park",
        after:
          "A young man walks through a sunlit park in autumn, slow exhale visible in cool air, soft smile, hand brushing fallen leaves, golden hour, slow side tracking.",
        note:
          "Эмоция как абстракция («happy», «feeling good») — модель не понимает. Перевод в физические детали (slow exhale, soft smile, hand brushing leaves) даёт видимое движение.",
      },
      {
        before:
          "A complex cinematic scene where a detective enters the dimly lit room, looks around suspiciously, finds a clue on the table, picks it up, examines it carefully, and then walks out the door",
        after:
          "Shot 1 (wide establishing, 0-1s): A detective in a wool coat enters a dim hotel room; single hard top-down key, deep falloff to black.\nShot 2 (close-up, 1-3s): His hand picks up a folded note from the wood desk; warm amber practical light.\nShot 3 (medium tracking, 3-5s): He turns and walks toward the door; slow side tracking, neon glow through the blinds.",
        note:
          "Сплошная проза с несколькими действиями коллапсирует в одно размытое движение. Shot list с таймкодами разводит beat'ы корректно.",
      },
    ],
    mistakes: [
      {
        title: "Слишком длинный промпт для простой сцены",
        explain:
          "Главный антипаттерн модели. Длинные промпты для простых сцен буквально ухудшают результат: лица плывут к усреднённому образу, кисти теряют геометрию, походка уплощается. ~20 слов — золотая середина. Длиннее — только если оправдано камерным языком или multi-beat сценой.",
      },
      {
        title: "Эпитеты-хеджи и quality-бустеры",
        explain:
          "«Beautiful, stunning, gorgeous, masterpiece, epic, breathtaking, insane detail, ultra detailed, hyperrealistic» — съедают токенный бюджет и тянут к average-look. Заменяй на конкретику: «overcast daylight, wet asphalt», «neon pink and cyan reflections», «35mm telephoto, shallow depth of field».",
      },
      {
        title: "Эмоция как абстракция",
        explain:
          "«Sad woman thinking about her past», «happy moment», «emotional scene» — Happy Horse не понимает эмоцию как концепцию. Переводи в физические детали: «close-up of a young woman standing still, soft wind moving her hair, neutral expression, slow blink, shallow depth of field». Микро-выражения, направление взгляда, темп дыхания.",
      },
      {
        title: "Mandarin для визуала",
        explain:
          "Даже несмотря на китайское происхождение модели от Alibaba, английский даёт лучший рендеринг визуала. Mandarin используй ТОЛЬКО в DIALOGUE-блоке для китайского lip-sync. Все production notes (subject, action, setting, camera, lighting) — на английском.",
      },
      {
        title: "Booru-теги, JSON, weighted parentheses",
        explain:
          "Запятые с ключевиками без предложений (Booru-стиль), JSON-объекты и weighted parentheses `(keyword:1.2)` (синтаксис Stable Diffusion) — заметно проигрывают английской прозе. Happy Horse обучен на естественном языке. Пиши предложениями и production notes.",
      },
    ],
    faq: [
      {
        q: "Какая оптимальная длина промпта?",
        a: "~20 слов на простой кадр — золотая середина. Default-шаблон «[Subject] [does action] in [setting], [time of day], [one atmosphere or camera cue]» закрывает 80% задач. Длиннее оправдано только когда кадр опирается на камерный язык (тогда cue в конец) или для multi-beat сцен с shot list и таймкодами.",
      },
      {
        q: "Как работает joint audio-video?",
        a: "Звук и видео генерируются в одном forward pass и синхронизированы по умолчанию. Управляй звуком через текст: «dialogue in English: '...'», «ambient: distant traffic», «Foley: footsteps on gravel». Если звук не описан, модель делает его по визуальной логике. Это уникальная фича Happy Horse — большинство видео-моделей генерируют звук отдельно или не генерируют вовсе.",
      },
      {
        q: "Какие языки поддерживаются для lip-sync?",
        a: "Семь: English, Mandarin, Cantonese, Japanese, Korean, German, French. С ультра-низким WER (word error rate). Указывай язык в DIALOGUE-блоке: «dialogue in Korean: '...'». Joint audio-video синхронизирует речь и движение губ автоматически. Внимание: визуал лучше рендерится на английском, даже если диалог на другом языке.",
      },
      {
        q: "Когда использовать shot list с таймкодами?",
        a: "Для multi-beat сцен — когда в одном клипе нужно несколько разных планов или действий. Формат: «Shot 1 (wide establishing, 0-1s): ...», «Shot 2 (close-up, 1-3s): ...». В тестах fal.ai shot-list разводит beat'ы корректно, а та же сцена в виде сплошной прозы коллапсирует. Для одного простого кадра shot-list избыточен — используй default 20-слов шаблон.",
      },
      {
        q: "Какая длительность видео поддерживается?",
        a: "5–8 секунд по умолчанию, до 12 секунд на Lite, до 15 секунд на платном тире. Нативный 1080p без апскейла. Время генерации ~10 секунд в среднем, ~38 секунд для 1080p на NVIDIA H100, ~2 секунды для 5-сек 256p превью. Соотношения сторон: 16:9, 9:16, 4:3, 21:9, 1:1.",
      },
      {
        q: "Что лучше работает: T2V или I2V?",
        a: "Обе модели делятся одними весами и работают одинаково сильно. I2V удобнее когда есть конкретный визуал-якорь (продуктовая фотография, портрет, концепт-арт) — тогда промпт описывает движение, а не пере-описывает картинку. T2V — для генерации сцены с нуля. Для I2V не нужно подробно описывать визуал; концентрируйся на движении и атмосфере.",
      },
      {
        q: "Поддерживается ли Opten для Happy Horse?",
        a: "Да, расширение Opten автоматически распознаёт Happy Horse 1.0 и оценивает промпты по структуре, описанной выше: проверяет соответствие default 20-слов шаблону, отсутствие эпитетов-хеджей и quality-бустеров, наличие физических деталей вместо абстрактной эмоции, английский язык для визуала. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Happy Horse 1.0 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Alibaba's Happy Horse 1.0: the 20-word rule, brevity wins, joint audio-video, common mistakes, and before/after examples.",
    h1: "Happy Horse 1.0: how to write prompts the model actually understands",
    intro:
      "Happy Horse 1.0 (快乐小马) is Alibaba ATH AI Innovation Unit's video model — 15B parameters, unified single-stream Transformer. It generates 5–8 seconds of 1080p in ~10 seconds on an H100. Joint audio-video in a single forward pass, lip-sync in 7 languages, open source. The core prompting rule — brevity wins, ~20 words for a simple shot.",
    sections: [
      {
        heading: "What Happy Horse 1.0 does well",
        body:
          "Happy Horse is an open-source model ranked #1 on Artificial Analysis Video Arena (T2V Elo 1333, I2V Elo 1392). T2I and I2V share the same weights; native 1080p without upscaling.\n\nKey feature — joint audio-video: video and sound are generated in one forward pass and synchronized by default. Lip-sync in 7 languages (English, Mandarin, Cantonese, Japanese, Korean, German, French) with ultra-low WER. Up to 12 multimodal inputs: text + reference images + reference videos + audio references. Duration 5–8 seconds by default, up to 15 on the paid tier.",
        bullets: [
          "15B parameters, unified single-stream Transformer",
          "Native 1080p without upscaling, 5–8 second duration",
          "Joint audio-video in a single forward pass",
          "Lip-sync in 7 languages with ultra-low WER",
          "#1 on Artificial Analysis Video Arena (T2V and I2V)",
        ],
      },
      {
        heading: "Prompt structure and the 20-word rule",
        body:
          "The default template covers 80% of tasks: «[Subject] [does action] in [setting], [time of day], [one atmosphere or camera cue]». About 20 words.\n\nWorking prompt examples: «A young woman in a red coat walks down a wet city street at night, neon reflections». «A 1965 cherry-red Mustang convertible drives along a winding California coastal highway at midday». «An orange tabby cat coiled on a velvet sofa leaps to a tall oak bookshelf».\n\nGolden rule: brevity wins. The model has a finite «attention budget», and every extra word steals power from rendering. Long prompts literally degrade results: faces blur toward an averaged look, hands lose geometry, gait flattens.",
      },
      {
        heading: "When a long prompt is justified",
        body:
          "A long prompt is justified in one case — when the shot leans on camera language (Steadicam push, slow dolly-in, helicopter aerial). Put the camera cue at the end of the prompt — that's where it gets maximum weight.\n\nFor multi-beat scenes use a shot list with timecodes: «Shot 1 (wide establishing, 0-1s): ...», «Shot 2 (mid tracking, 1-4s): ...», «Shot 3 (slow push-in close, 4-5s): ...». In fal.ai tests, a timecoded shot list separates beats correctly, while the same scene as flat prose collapses into one blurred motion.\n\nMarkdown sections (## Subject, ## Action, ## Setting, ## Camera, ## Lighting, ## Mood) — for single-take shots with many control axes. Use ONLY when there's content for most sections. Empty headers hurt.",
      },
      {
        heading: "Strengths and weaknesses",
        body:
          "Strengths (use them): camera movements (Steadicam push, slow dolly-in, helicopter aerial — the model understands English camera vocabulary unusually well); atmospheric lighting (blue hour alley, neon noir, single hard top-down key with deep falloff, warm amber backlight + cool blue ambient); cars, metal, chrome, reflections; fabric and hair in wind (secondary motion holds throughout the clip); fire and sparks with correct warmth.\n\nWeaknesses: long human action sequences with faces in focus. Storytelling prose instead of production notes (the model executes instructions, not narration). Emotion as abstraction («sad woman», «happy moment») — translate into physical details: micro-expressions, gaze direction, breath rhythm, pauses.",
      },
      {
        heading: "Joint audio-video and lip-sync",
        body:
          "Sound is generated in parallel with video in a single forward pass — a unique Happy Horse feature. Control sound via text:\n\n«dialogue in English: 'Hey, are you ready?'», «ambient: distant traffic, light rain», «Foley: footsteps on gravel, fabric rustling». If sound isn't described, the model generates it from visual logic (sometimes randomly).\n\nLip-sync in 7 languages: English, Mandarin, Cantonese, Japanese, Korean, German, French. Specify the language in the DIALOGUE block for lip synchronization. Note: despite the model's Chinese origin, Mandarin for visuals loses to English — use Mandarin ONLY in DIALOGUE for Chinese lip-sync.",
      },
    ],
    examples: [
      {
        before:
          "A beautiful gorgeous stunning woman in a magnificent red coat masterpiece walking elegantly down a breathtaking wet city street at night with insane neon reflections, ultra detailed, hyperrealistic, 8k cinematography",
        after:
          "A young woman in a red coat walks down a wet city street at night, neon reflections, 35mm telephoto, slow tracking dolly.",
        note:
          "Anti-slop rule: hedge epithets (beautiful, gorgeous, stunning, masterpiece, ultra detailed) eat the token budget and pull toward average-look. ~20 words with a camera cue at the end is the sweet spot.",
      },
      {
        before: "happy man walking and feeling good about life in a nice park",
        after:
          "A young man walks through a sunlit park in autumn, slow exhale visible in cool air, soft smile, hand brushing fallen leaves, golden hour, slow side tracking.",
        note:
          "Emotion as abstraction («happy», «feeling good») — the model can't read it. Translating into physical details (slow exhale, soft smile, hand brushing leaves) yields visible motion.",
      },
      {
        before:
          "A complex cinematic scene where a detective enters the dimly lit room, looks around suspiciously, finds a clue on the table, picks it up, examines it carefully, and then walks out the door",
        after:
          "Shot 1 (wide establishing, 0-1s): A detective in a wool coat enters a dim hotel room; single hard top-down key, deep falloff to black.\nShot 2 (close-up, 1-3s): His hand picks up a folded note from the wood desk; warm amber practical light.\nShot 3 (medium tracking, 3-5s): He turns and walks toward the door; slow side tracking, neon glow through the blinds.",
        note:
          "Flat prose with multiple actions collapses into one blurred motion. A timecoded shot list separates beats correctly.",
      },
    ],
    mistakes: [
      {
        title: "Too long a prompt for a simple scene",
        explain:
          "The model's main antipattern. Long prompts for simple scenes literally degrade output: faces blur toward an averaged look, hands lose geometry, gait flattens. ~20 words is the sweet spot. Longer is justified only when camera language or a multi-beat scene calls for it.",
      },
      {
        title: "Hedge epithets and quality boosters",
        explain:
          "«Beautiful, stunning, gorgeous, masterpiece, epic, breathtaking, insane detail, ultra detailed, hyperrealistic» eat the token budget and pull toward average-look. Replace with specifics: «overcast daylight, wet asphalt», «neon pink and cyan reflections», «35mm telephoto, shallow depth of field».",
      },
      {
        title: "Emotion as abstraction",
        explain:
          "«Sad woman thinking about her past», «happy moment», «emotional scene» — Happy Horse doesn't read emotion as a concept. Translate into physical details: «close-up of a young woman standing still, soft wind moving her hair, neutral expression, slow blink, shallow depth of field». Micro-expressions, gaze direction, breath rhythm.",
      },
      {
        title: "Mandarin for visuals",
        explain:
          "Despite the model's Chinese origin from Alibaba, English yields better visual rendering. Use Mandarin ONLY in the DIALOGUE block for Chinese lip-sync. All production notes (subject, action, setting, camera, lighting) — in English.",
      },
      {
        title: "Booru tags, JSON, weighted parentheses",
        explain:
          "Comma-separated keywords without sentences (Booru style), JSON objects, and weighted parentheses `(keyword:1.2)` (Stable Diffusion syntax) — measurably lose to English prose. Happy Horse is trained on natural language. Write sentences and production notes.",
      },
    ],
    faq: [
      {
        q: "What is the optimal prompt length?",
        a: "~20 words for a simple shot is the sweet spot. The default template «[Subject] [does action] in [setting], [time of day], [one atmosphere or camera cue]» covers 80% of tasks. Longer is justified only when the shot leans on camera language (then the cue goes at the end) or for multi-beat scenes with a timecoded shot list.",
      },
      {
        q: "How does joint audio-video work?",
        a: "Sound and video are generated in one forward pass and synchronized by default. Control sound via text: «dialogue in English: '...'», «ambient: distant traffic», «Foley: footsteps on gravel». If sound isn't described, the model invents it from visual logic. This is a unique Happy Horse feature — most video models generate sound separately or not at all.",
      },
      {
        q: "Which languages are supported for lip-sync?",
        a: "Seven: English, Mandarin, Cantonese, Japanese, Korean, German, French. With ultra-low WER (word error rate). Specify the language in the DIALOGUE block: «dialogue in Korean: '...'». Joint audio-video synchronizes speech and lip movement automatically. Note: visuals render better in English even when dialogue is in another language.",
      },
      {
        q: "When should a timecoded shot list be used?",
        a: "For multi-beat scenes — when one clip needs several different shots or actions. Format: «Shot 1 (wide establishing, 0-1s): ...», «Shot 2 (close-up, 1-3s): ...». In fal.ai tests a shot list separates beats correctly, while the same scene as flat prose collapses. For a single simple shot a shot list is overkill — use the default 20-word template.",
      },
      {
        q: "What video duration is supported?",
        a: "5–8 seconds by default, up to 12 on Lite, up to 15 on the paid tier. Native 1080p without upscaling. Generation time ~10 seconds on average, ~38 seconds for 1080p on NVIDIA H100, ~2 seconds for a 5-sec 256p preview. Aspect ratios: 16:9, 9:16, 4:3, 21:9, 1:1.",
      },
      {
        q: "What works better, T2V or I2V?",
        a: "Both modes share the same weights and perform equally well. I2V is handy when there's a concrete visual anchor (product photo, portrait, concept art) — then the prompt describes motion rather than re-describing the picture. T2V — for from-scratch scene generation. For I2V, don't describe the visual in detail; focus on motion and atmosphere.",
      },
      {
        q: "Does Opten support Happy Horse?",
        a: "Yes, the Opten extension auto-detects Happy Horse 1.0 and scores prompts against the structure outlined above: it checks alignment with the default 20-word template, absence of hedge epithets and quality boosters, physical details instead of abstract emotion, and English for visuals. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
