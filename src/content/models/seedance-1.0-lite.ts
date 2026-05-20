// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for seedance-1.0-lite.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance 1.0 Lite: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance 1.0 Lite от ByteDance: облегчённая модель, 5 или 10 секунд, простые промпты, ограничения по сравнению с 2.0, типичные ошибки.",
    h1: "Seedance 1.0 Lite: как писать промпты, которые модель понимает",
    intro:
      "Seedance 1.0 Lite — облегчённая версия Seedance от ByteDance. Фиксированные длительности 5 или 10 секунд, разрешение 480p или 720p, только текст или текст + 1 изображение на вход. Сложные техники из 2.0 (timestamp, @-референсы, voice cloning) тут не работают. Промпты должны быть простыми и прямолинейными, до 1 000 символов.",
    sections: [
      {
        heading: "Что НЕ умеет Lite",
        body:
          "Главное правило работы с 1.0 Lite — понимать, что НЕ поддерживается, чтобы не тратить токены впустую. Список длинный: Consistency Control с @-референсами, копирование камеры и движений из reference-видео, копирование спецэффектов, продление видео, voice control и клонирование голоса, one-take long shot с несколькими референсами, video editing, beat sync с музыкой, timestamp-раскадровка по секундам.\n\nНегативные промпты в Lite тоже НЕ работают вообще — это документированное ограничение, не баг. «Не показывать руки» в промпте либо проигнорируется, либо произведёт руки. Описывай только желаемое позитивно.",
        bullets: [
          "Фиксированная длительность: только 5 или 10 секунд",
          "Разрешение 480p или 720p (1080p ожидается, но пока нет)",
          "Только T2V или I2V с одним изображением",
          "Не поддерживает @-референсы, voice control, timestamp",
          "Негативные промпты не работают",
        ],
      },
      {
        heading: "Структура простого промпта",
        body:
          "Базовая формула: [Subject/Character] + [Action/Motion] + [Scene/Environment] + [Camera] + [Style]. Простой и прямолинейный — это ключ. Модель хорошо «додумывает» детали, поэтому главное — чёткость ключевых элементов.\n\nДля T2V: Субъект + Движение + Сцена + Камера, стиль. Для I2V: Субъект + Движение, Фон + Движение, Камера + Движение. В I2V минимизируй статические описания (сцена уже на картинке), фокусируйся на динамике — что движется и как.\n\nДлина промпта — до 1 000 символов (короче чем 2 000 у 2.0). На практике 30–100 слов оптимальны. Меньше 10 слов — модель додумает слишком много, больше 100–150 — перегрузка для лёгкой модели.",
      },
      {
        heading: "Камерные движения и переключения",
        body:
          "Поддерживаемые движения: surround, aerial, zoom, pan, follow, handheld. Крупности: close-up, wide shot, panoramic. Углы: low/high angle, aerial, POV. Множественные движения и сложные комбинации работают плохо — выбирай одно главное на сцену.\n\nДля камерных движений важно правильно установить параметр платформы: «non-fixed camera» для любого движения, «fixed camera» для статичных сцен. Это отдельное поле, не текст в промпте. Если поставить fixed camera и потом просить pan — модель будет конфликтовать.\n\nMulti-shot возможен через «Cut to» или «Camera switching»: «Close-up of her face. Cut to wide shot of the street.» Между шотами описывай связь — иначе переход выйдет резким.",
      },
      {
        heading: "Наречия степени и хронология",
        body:
          "Модель не может определить интенсивность движения из картинки — указывай явно через наречия степени. «Car quickly passing by» вместо «car passing by». «Wings flapping wildly» вместо «wings flapping». «Man's crazy roar» вместо «man's roar». Полезные наречия: fast, intense, large, high frequency, strong, crazy.\n\nДля 10-секундных видео — цепочки действий в хронологическом порядке: «Play tai chi, surround the camera, focus on the face». Или: «Turn face to the camera and walk forward, then stop, with an angry expression, then put hands on hips». Модель поддерживает 2–3 последовательных действия в одном промпте, больше — теряет нить.",
      },
      {
        heading: "Что ставить вместо негативов и сложных техник",
        body:
          "Негативные промпты не работают — вместо «without text», «no blur», «no people» пиши позитивно: «clear empty signage», «sharp focus», «empty street». Если переформулировать не получается, прими, что Lite этот контроль не даёт, и переходи на Seedance 2.0 или другую модель.\n\nЕсли видишь @-синтаксис в туториалах или примерах из 2.0 — он в Lite не работает, промпт будет проигнорирован. Если запрашивается voice control или dialogue с lip-sync — Lite не поддерживает аудио вообще, выход будет тихим.\n\n«Collapse» — внезапные артефакты или неожиданная деформация — нормальное явление в Lite. Рекомендация — перегенерировать с тем же промптом. Это не повод усложнять промпт.",
      },
    ],
    examples: [
      {
        before:
          "сложный 15-секундный нарратив с тайминговой раскадровкой и тремя референсами персонажа",
        after:
          "Portrait photography, psychedelic cool light blue tones, butterfly light, close-up shot of a young woman with black short hair, raised eyebrows, biting red lips, staring at the camera. The camera pulls back, broken glass in the air blocking part of her face. 720p, 16:9, 5s, non-fixed camera.",
        note: "Lite не умеет в 15 секунд и timestamp-раскадровку — это уровень 2.0. Заменено на 5-секундный простой кадр с одним движением (pulls back), конкретной композицией и техническими параметрами. Это рабочий промпт для Lite.",
      },
      {
        before:
          "оживить фото с дедушкой в очках, добавить эмоции",
        after:
          "Old man wears glasses, slight smile spreads on his face, eyes squint warmly. Fixed camera, 720p, 10s.",
        note: "I2V-промпт описывает только движение (smile spreads, eyes squint), не содержимое референса. Указан fixed camera (статичная сцена), разрешение, длительность. Конкретные физические детали вместо абстрактных эмоций.",
      },
      {
        before:
          "видео с танцовщицей в космосе с разными ракурсами и музыкой",
        after:
          "A dancer in a flowing white dress spins quickly under cool blue starlight, arms extended. Aerial shot rotating around her, smooth orbital motion. Surreal cosmic background. 720p, 16:9, 10s, non-fixed camera.",
        note: "Убран запрос на музыку (Lite не поддерживает аудио). Конкретное камерное движение (aerial orbital), наречие степени (quickly), физические детали (flowing dress, arms extended). Это в пределах возможностей Lite.",
      },
    ],
    mistakes: [
      {
        title: "Использование сложных техник из Seedance 2.0",
        explain:
          "Timestamp-раскадровка, @-референсы изображений и видео, voice cloning, beat sync, copy camera — всё это есть в 2.0, но НЕ работает в Lite. Промпт с @Image1 или «0-3с: …» просто проигнорируется. Перед написанием промпта проверь, в какой версии работаешь — для production-сценариев лучше сразу 2.0.",
      },
      {
        title: "Негативные промпты",
        explain:
          "В Lite негативы не работают вообще — это документированное ограничение. «Не показывать руки», «без размытия», «no people» либо игнорируются, либо производят именно то, что просили исключить. Переформулируй позитивно: вместо «no fast motion» — «slow, deliberate movement».",
      },
      {
        title: "Конфликт промпта с входным изображением",
        explain:
          "В I2V описание должно соответствовать референсу. Если на картинке женщина, а в промпте «old man wears glasses» — модель будет конфликтовать, результат непредсказуем. Описывай только движение и динамику, не противоречащие тому, что на картинке.",
      },
      {
        title: "Запрос на более 10 секунд",
        explain:
          "Lite поддерживает только две длительности: 5 или 10 секунд. Промежуточных значений (4, 7, 8) нет, более 10 — невозможно в одной генерации. Если нужен 15-секундный клип, переходи на Seedance 2.0 (4–15с гибко) или собирай из двух 10-секундных генераций вручную.",
      },
      {
        title: "Слишком много камерных движений",
        explain:
          "Lite плохо справляется с несколькими движениями одновременно или быстрыми переключениями. «Zoom in, then pan left, then orbit» — модель не успеет за 5–10 секунд. Выбирай одно главное движение на сцену, плюс опционально наречие скорости. Multi-shot через «Cut to» возможен, но не больше 2 шотов на 10 секунд.",
      },
    ],
    faq: [
      {
        q: "Чем Seedance 1.0 Lite отличается от 2.0?",
        a: "Lite — более ранняя и облегчённая версия с серьёзными ограничениями. Фиксированная длительность 5 или 10 секунд против 4–15 у 2.0. Разрешение 480p/720p против 2K. Нет @-референсов, voice control, timestamp-раскадровки, video extension, beat sync. Зато Lite быстрее и дешевле — для простых I2V-анимаций и коротких T2V-сцен это разумный выбор.",
      },
      {
        q: "Какая длительность доступна?",
        a: "Только два фиксированных варианта — 5 или 10 секунд. Промежуточных значений (4, 7, 8 секунд) в Lite нет, в отличие от 2.0 с гибкой длительностью 4–15 секунд. Если нужен 15-секундный клип или промежуточное значение — переходи на Seedance 2.0.",
      },
      {
        q: "Работают ли @-референсы?",
        a: "Нет, @-синтаксис (@Image1, @Video1, @Audio1) в Lite не поддерживается. Все промпты с @-референсами либо игнорируются, либо обрабатываются как обычный текст. Для I2V можно подать одно изображение через стандартный image input, но Consistency Control через несколько референсов — это уровень 2.0.",
      },
      {
        q: "Поддерживается ли звук?",
        a: "Нет, Lite не генерирует аудио. Выход всегда тихий. Voice control, dialogue с lip-sync, BGM, ambient — всё это есть в 2.0, но НЕ в Lite. Если в промпте указано «with loud explosion sound» — это будет проигнорировано, видео сгенерируется без звука.",
      },
      {
        q: "Какое разрешение поддерживается?",
        a: "480p или 720p. 1080p официально «ожидается», но на момент текущего билда не поддерживается. Для социальных сетей и быстрых превью этого достаточно; для production-видео и больших экранов лучше Seedance 2.0 с разрешением до 2K.",
      },
      {
        q: "Почему результат иногда «коллапсирует» с артефактами?",
        a: "«Collapse» — внезапные артефакты или неожиданная деформация — нормальное явление в Lite из-за облегчённой архитектуры. Это не проблема промпта. Рекомендация — перегенерировать с тем же промптом. Если коллапсы повторяются, упрости промпт (меньше элементов, одно действие) или переходи на 2.0.",
      },
      {
        q: "Поддерживается ли Opten для Seedance 1.0 Lite?",
        a: "Да, расширение Opten распознаёт Seedance 1.0 Lite внутри syntx.ai и оценивает промпты по структуре, специфичной именно для Lite (не 2.0): проверяет простоту промпта, отсутствие негативов и @-референсов, корректность fixed/non-fixed camera параметра, использование наречий степени для выразительности движений. Одним кликом можно получить rewrite, упрощённый под Lite.",
      },
    ],
  },
  en: {
    title: "Seedance 1.0 Lite Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance 1.0 Lite: lightweight model, 5 or 10 seconds, simple prompts, limits versus 2.0, common mistakes and examples.",
    h1: "Seedance 1.0 Lite: how to write prompts the model actually understands",
    intro:
      "Seedance 1.0 Lite is the lightweight Seedance variant from ByteDance. Fixed duration of 5 or 10 seconds, resolution 480p or 720p, text-only or text + 1 image input. The advanced techniques from 2.0 (timestamps, @-references, voice cloning) don't work here. Prompts must be simple and direct, up to 1,000 characters.",
    sections: [
      {
        heading: "What Lite does NOT do",
        body:
          "The first rule of working with 1.0 Lite is knowing what's NOT supported, so you don't waste tokens. The list is long: Consistency Control via @-references, copying camera and motion from a reference video, copying VFX, video extension, voice control and voice cloning, one-take long shot with multiple references, video editing, beat sync to music, second-level timestamp storyboarding.\n\nNegative prompts in Lite don't work at all — that's a documented limit, not a bug. «Don't show hands» in the prompt is either ignored or produces hands. Describe only what you want, positively.",
        bullets: [
          "Fixed duration: 5 or 10 seconds only",
          "Resolution 480p or 720p (1080p expected but not yet)",
          "T2V or I2V with a single image only",
          "No @-references, voice control, or timestamps",
          "Negative prompts don't work",
        ],
      },
      {
        heading: "Simple prompt structure",
        body:
          "Base formula: [Subject/Character] + [Action/Motion] + [Scene/Environment] + [Camera] + [Style]. Simple and direct is the key. The model is good at filling in detail, so clarity on the core elements is what matters.\n\nFor T2V: Subject + Action + Scene + Camera, style. For I2V: Subject + Motion, Background + Motion, Camera + Motion. In I2V, minimize static descriptions (the scene is already in the image) and focus on dynamics — what moves and how.\n\nPrompt length is up to 1,000 characters (shorter than the 2,000 in 2.0). In practice 30–100 words is optimal. Under 10 words and the model invents too much; over 100–150 and it overloads the lighter architecture.",
      },
      {
        heading: "Camera moves and switches",
        body:
          "Supported moves: surround, aerial, zoom, pan, follow, handheld. Shot sizes: close-up, wide shot, panoramic. Angles: low/high angle, aerial, POV. Multiple moves and complex combinations work poorly — pick one main move per scene.\n\nFor camera moves you must set the platform parameter correctly: «non-fixed camera» for any motion, «fixed camera» for static scenes. This is a separate field, not text in the prompt. Setting fixed camera while asking for a pan creates conflict.\n\nMulti-shot is possible via «Cut to» or «Camera switching»: «Close-up of her face. Cut to wide shot of the street.» Describe the link between shots — otherwise the transition feels jarring.",
      },
      {
        heading: "Degree adverbs and chronology",
        body:
          "The model can't infer motion intensity from the image — specify with degree adverbs. «Car quickly passing by» beats «car passing by». «Wings flapping wildly» beats «wings flapping». «Man's crazy roar» beats «man's roar». Useful adverbs: fast, intense, large, high frequency, strong, crazy.\n\nFor 10-second videos, chain actions in chronological order: «Play tai chi, surround the camera, focus on the face». Or: «Turn face to the camera and walk forward, then stop, with an angry expression, then put hands on hips». The model handles 2–3 sequential actions per prompt; beyond that it loses the thread.",
      },
      {
        heading: "Replacements for negatives and advanced techniques",
        body:
          "Negative prompts don't work — instead of «without text», «no blur», «no people», write positively: «clear empty signage», «sharp focus», «empty street». If rewording fails, accept that Lite doesn't give you that control and switch to Seedance 2.0 or another model.\n\nIf you see @-syntax in tutorials or 2.0 examples — it does NOT work in Lite, the prompt is ignored. If voice control or dialogue with lip-sync is requested — Lite doesn't support audio at all; the output is silent.\n\n«Collapse» — sudden artifacts or unexpected deformation — is normal in Lite. The recommended fix is to regenerate with the same prompt. It's not a reason to overcomplicate the prompt.",
      },
    ],
    examples: [
      {
        before: "complex 15-second narrative with timestamp breakdown and three character references",
        after:
          "Portrait photography, psychedelic cool light blue tones, butterfly light, close-up shot of a young woman with black short hair, raised eyebrows, biting red lips, staring at the camera. The camera pulls back, broken glass in the air blocking part of her face. 720p, 16:9, 5s, non-fixed camera.",
        note: "Lite can't do 15 seconds or timestamp storyboarding — that's 2.0 territory. Replaced with a 5-second simple frame, one camera move (pulls back), concrete composition and technical parameters. A working Lite prompt.",
      },
      {
        before: "animate this photo of a grandfather in glasses, add emotion",
        after:
          "Old man wears glasses, slight smile spreads on his face, eyes squint warmly. Fixed camera, 720p, 10s.",
        note: "The I2V prompt describes only motion (smile spreads, eyes squint), not the reference content. Specifies fixed camera (static scene), resolution, duration. Concrete physical detail instead of abstract emotion.",
      },
      {
        before: "video with a dancer in space from different angles with music",
        after:
          "A dancer in a flowing white dress spins quickly under cool blue starlight, arms extended. Aerial shot rotating around her, smooth orbital motion. Surreal cosmic background. 720p, 16:9, 10s, non-fixed camera.",
        note: "Music request removed (Lite doesn't support audio). Specific camera move (aerial orbital), degree adverb (quickly), physical detail (flowing dress, arms extended). Within Lite's capability envelope.",
      },
    ],
    mistakes: [
      {
        title: "Using advanced techniques from Seedance 2.0",
        explain:
          "Timestamp storyboarding, @-references for images and videos, voice cloning, beat sync, copy camera — all exist in 2.0 but do NOT work in Lite. A prompt with @Image1 or «0-3s: …» is simply ignored. Before writing the prompt, confirm which version you're on — for production scenarios, jump straight to 2.0.",
      },
      {
        title: "Negative prompts",
        explain:
          "In Lite negatives don't work at all — a documented limit. «Don't show hands», «without blur», «no people» are either ignored or produce exactly what you wanted excluded. Reword positively: instead of «no fast motion» — «slow, deliberate movement».",
      },
      {
        title: "Prompt-image conflict",
        explain:
          "In I2V the description must align with the reference. If the picture shows a woman and the prompt says «old man wears glasses», the model conflicts and results are unpredictable. Describe only motion and dynamics that don't contradict what's in the image.",
      },
      {
        title: "Asking for more than 10 seconds",
        explain:
          "Lite supports only two durations: 5 or 10 seconds. No intermediate values (4, 7, 8) and nothing above 10 in a single generation. If you need 15 seconds, switch to Seedance 2.0 (flexible 4–15s) or stitch two 10-second generations manually.",
      },
      {
        title: "Too many camera moves",
        explain:
          "Lite handles multiple simultaneous moves or rapid switches poorly. «Zoom in, then pan left, then orbit» — the model can't fit it into 5–10 seconds. Pick one main move per scene, plus an optional speed adverb. Multi-shot via «Cut to» works, but no more than 2 shots in 10 seconds.",
      },
    ],
    faq: [
      {
        q: "How does Seedance 1.0 Lite differ from 2.0?",
        a: "Lite is an earlier, lighter version with significant limits. Fixed duration 5 or 10 seconds versus 4–15 in 2.0. Resolution 480p/720p versus 2K. No @-references, voice control, timestamp storyboarding, video extension, or beat sync. The upside: Lite is faster and cheaper — for simple I2V animations and short T2V scenes it's a reasonable pick.",
      },
      {
        q: "What durations are available?",
        a: "Only two fixed options — 5 or 10 seconds. No intermediate values (4, 7, 8 seconds), unlike 2.0 with its flexible 4–15 second range. If you need 15 seconds or an intermediate value, switch to Seedance 2.0.",
      },
      {
        q: "Do @-references work?",
        a: "No, @-syntax (@Image1, @Video1, @Audio1) is not supported in Lite. Prompts with @-references are either ignored or treated as plain text. For I2V you can feed one image via the standard image input, but Consistency Control across multiple references is a 2.0 feature.",
      },
      {
        q: "Is audio supported?",
        a: "No, Lite doesn't generate audio. Output is always silent. Voice control, dialogue with lip-sync, BGM, ambient — all exist in 2.0 but NOT in Lite. If the prompt says «with loud explosion sound» it's ignored, and the video generates without audio.",
      },
      {
        q: "What resolutions are supported?",
        a: "480p or 720p. 1080p is officially «coming» but not in the current build. For social media and quick previews that's enough; for production video and large screens, use Seedance 2.0 with resolution up to 2K.",
      },
      {
        q: "Why does the output sometimes «collapse» with artifacts?",
        a: "«Collapse» — sudden artifacts or unexpected deformation — is a known phenomenon in Lite due to the lighter architecture. It's not a prompt problem. The recommended fix is to regenerate with the same prompt. If collapses repeat, simplify the prompt (fewer elements, one action) or switch to 2.0.",
      },
      {
        q: "Does Opten support Seedance 1.0 Lite?",
        a: "Yes, the Opten extension recognizes Seedance 1.0 Lite inside syntx.ai and scores prompts against the Lite-specific structure (not 2.0): checks for prompt simplicity, absence of negatives and @-references, correct fixed/non-fixed camera parameter, and use of degree adverbs for expressive motion. One click yields a rewrite simplified for Lite.",
      },
    ],
  },
};
