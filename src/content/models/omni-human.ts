// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for omni-human.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для OmniHuman 1.5: структура, ошибки, примеры",
    description:
      "Как писать промпты для OmniHuman 1.5 от ByteDance: схема image + audio → video, talking-head анимация и audio lip-sync, типичные ошибки и примеры до/после.",
    h1: "OmniHuman 1.5: как писать промпты, которые модель понимает",
    intro:
      "OmniHuman 1.5 — специализированная видеомодель ByteDance для анимации людей по схеме Image + Audio → Video. 1024×1024 при 30fps, до 30 секунд через API. Главный драйвер — аудио (lip-sync и body language), текстовый промпт — дополнение для сцены и камеры. Английский для промптов; аудио — на любом языке.",
    sections: [
      {
        heading: "Что умеет OmniHuman",
        body:
          "OmniHuman — не универсальный видеогенератор. Это узко-специализированная модель для оживления одного изображения человека с помощью аудио. Архитектура двухсистемная: Diffusion Transformer (System 1) для визуала + Multimodal LLM (System 2) для понимания контекста. Обучена на 18 700 часов видео человеческого движения; context window 50 000 токенов.\n\nТри входа работают вместе: изображение (обязательно — портрет, полуфигура или полная фигура), аудио (для lip-sync и языка тела), текстовый промпт (дополнение для сцены, камеры, действий, эмоций). Качество = согласованность всех трёх входов. Поддерживает реальных людей, животных, стилизованных персонажей и 3D-модели.",
        bullets: [
          "Image + Audio → Video, специализация — анимация людей",
          "1024×1024 при 30fps, до 30 секунд через API",
          "Audio-driven lip-sync с эмоциональным языком тела",
          "Subjects: реальные люди, животные, стилизованные персонажи, 3D",
          "Multi-character сцены с назначением спикеров",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Текстовый промпт = дополнение к аудио. Аудио задаёт темп, эмоцию, lip-sync; промпт описывает сцену, камеру, действия. Не пиши длинные описания внешности — она задана изображением.\n\nФормула: [Character description + pose] + [Action/movement] + [Camera] + [Emotional tone].\n\nПример: «A male DJ performing live on stage, wearing headphones and mixing music on a DJ controller, focused expression, subtle head movement following the beat.» Короткие естественные сценарии работают лучше, чем списки ключевых слов. Оптимальная длина 15-40 слов. Главное — согласованность с аудио и изображением, а не подробность.",
      },
      {
        heading: "Согласованность трёх входов — главное правило",
        body:
          "Качество выхода = согласованность image + audio + prompt. Это правило ломает большинство неудачных генераций.\n\nРассогласованный пример: на изображении — портрет бизнесмена в офисе; аудио — рок-музыка; промпт — «DJ performing on stage». Модель не сможет разрешить конфликт и даст странный результат. Согласованный пример: изображение — DJ в наушниках; аудио — электронная музыка; промпт — «male DJ performing live on stage, focused expression, subtle head movement following the beat». Все три входа говорят об одном.\n\nЕсли просишь lip-sync — аудио должно содержать речь или вокал. Если просишь танец под бит — аудио должно содержать ритмичную музыку. Если хочешь спокойный talking head — аудио должно быть подкастом, а не рок-треком.",
      },
      {
        heading: "Talking head и презентации",
        body:
          "Основной production-сценарий OmniHuman — анимация спикера из одного фото. Подкасты, видеоуроки, корпоративные ролики, объясняющие видео — всё, что требует lip-sync без съёмки. Сэкономишь день съёмочного процесса: одно фото, одна звуковая дорожка → готовый клип.\n\nДля talking head промпт минимальный: «A speaker addressing the camera with a calm professional tone, slight natural head movement, occasional hand gestures off-frame». Аудио задаёт всё остальное — паузы, интонацию, эмоцию. Камеру задавай статичной или с лёгким zoom in — это совпадает с эстетикой talking head, не отвлекает от лица.",
      },
      {
        heading: "Multi-character сцены",
        body:
          "OmniHuman поддерживает сцены с несколькими персонажами в кадре — но требует явного назначения спикеров. Без указания модель не знает, кто говорит, чьи губы синхронизировать с аудио.\n\nФормула: «Two people in a podcast studio. The man on the left is speaking (lip-sync to audio), nodding occasionally. The woman on the right is listening attentively, slight reactions on her face.» Указано: кто говорит (для lip-sync), кто слушает (для фоновых реакций), позиции в кадре. Модель распределит роли правильно.\n\nДля двух говорящих по очереди нужно два прохода с разными аудио или предварительный монтаж аудио. OmniHuman не делает диалог за один проход — это известное ограничение.",
      },
    ],
    examples: [
      {
        before:
          "анимируй моего бизнес-партнёра для презентации",
        after:
          "A professional speaker addressing the camera with a calm confident tone, slight natural head movements, occasional subtle hand gestures appearing at the bottom of frame. Static camera, mid-shot framing, neutral business office background visible behind. Focused friendly expression, executive presentation aesthetic.",
        note:
          "Внешность не описана — она на референсе. Указано: tone (calm confident), движение (slight natural head), камера (static mid-shot), эмоциональный тон (focused friendly). Длина в целевом диапазоне 15-40 слов.",
      },
      {
        before:
          "DJ играет музыку",
        after:
          "A male DJ performing live on a club stage, wearing headphones, hands operating a DJ controller, subtle head and shoulder movement following the beat of the audio. Tracking shot slowly orbiting from left to right. Energetic focused expression, club lighting atmosphere with magenta and blue accents.",
        note:
          "Согласовано с предполагаемым аудио (electronic beat). Описано взаимодействие с инструментом (operating DJ controller), движение в такт (following the beat), камера (tracking orbit), атмосфера (club lighting).",
      },
      {
        before:
          "два человека разговаривают в подкасте",
        after:
          "Two people in a warmly-lit podcast studio. The man on the left is speaking (lip-sync to audio), occasional emphatic hand gestures, engaged expression. The woman on the right is listening attentively, slight nods and subtle micro-reactions on her face. Static two-shot framing, soft warm key light, intimate atmosphere.",
        note:
          "Multi-character: явно указан спикер (man on the left, lip-sync to audio) и слушатель (woman on the right, micro-reactions). Без этого OmniHuman не знает, чьи губы синхронизировать.",
      },
    ],
    mistakes: [
      {
        title: "Использование как text-to-video",
        explain:
          "OmniHuman ВСЕГДА требует изображение человека. Это не general video generator. Если ты пишешь только текстовый промпт без загрузки референса, генерация невозможна. Для T2V используй Veo, Sora, Kling или Hailuo. OmniHuman — узкоспециализированная модель для анимации одного фото, не альтернатива универсальным видеомоделям.",
      },
      {
        title: "Отсутствие аудио",
        explain:
          "Главная фича OmniHuman — audio-driven lip-sync с эмоциональным языком тела. Без аудио модель не сможет синхронизировать губы, не получит сигнала о темпе и эмоции. Результат резко деградирует: статичный портрет или хаотичная мимика. Для каждой генерации нужно аудио — даже если это просто эмбиентный фон.",
      },
      {
        title: "Рассогласование входов",
        explain:
          "DJ в промпте + классическая музыка в аудио + портрет бизнесмена на референсе = конфликт, который модель не разрешит. Все три входа должны говорить об одном. Перед генерацией проверь: совпадает ли субъект на изображении с описанием в промпте; совпадает ли эмоциональный тон аудио с действием в промпте; совпадает ли визуальная сцена с акустической средой.",
      },
      {
        title: "Описание внешности субъекта",
        explain:
          "Внешность задана входным изображением. Длинное описание «handsome young man with blonde hair, blue eyes, wearing a black suit» — пустые токены до описания действия. Пиши только: что персонаж делает, как движется камера, какой эмоциональный тон, какая сцена вокруг. 15-40 слов более чем достаточно.",
      },
      {
        title: "Ожидание высокого разрешения",
        explain:
          "OmniHuman — 1024×1024 при 30fps. Это не 4K и не широкий 1080P. Для production-видео в YouTube-разрешении нужен пост-апскейл (Topaz, отдельный super-resolution pass). Для социального контента (Reels, Shorts, TikTok вертикально) 1024×1024 нормально с лёгким кропом. Для презентаций и подкастов — тоже окей. Для broadcast-кинематографа — недостаточно.",
      },
    ],
    faq: [
      {
        q: "Чем OmniHuman отличается от Veo или Sora?",
        a: "Veo и Sora — универсальные видеомодели для генерации любых сцен по тексту (T2V) или изображению (I2V). OmniHuman — узкоспециализированная модель ТОЛЬКО для анимации людей по схеме Image + Audio → Video. Главная фича — audio-driven lip-sync с эмоциональным языком тела. Это не «лучше или хуже Veo», это другой класс инструмента для конкретной задачи: оживление одного портрета с аудио.",
      },
      {
        q: "Можно ли использовать OmniHuman без аудио?",
        a: "Технически можно, но не рекомендуется. Audio-driven lip-sync — главная фича модели; без аудио OmniHuman теряет основной сигнал о темпе, эмоции и языке тела. Результат деградирует до статичного портрета или хаотичной мимики. Если аудио речи нет — используй хотя бы эмбиентный фон или музыкальный трек, который задаст ритм движений. Для тишины OmniHuman не предназначен.",
      },
      {
        q: "Подходит ли модель для генерации диалогов между двумя людьми?",
        a: "Только частично. OmniHuman поддерживает multi-character сцены с одним спикером и фоновыми реакциями других персонажей — это работает. Но настоящий диалог (две очереди говорения) за один проход не получится: модель синхронизирует lip-sync с одной аудиодорожкой. Решение — два прохода с разными аудио и последующим монтажом, или предварительный монтаж аудио с явной маркировкой спикеров.",
      },
      {
        q: "Какие типы субъектов поддерживаются?",
        a: "Реальные люди (главный сценарий), животные (анимация говорящих кошек, собак — работает удивительно хорошо), стилизованные / анимированные персонажи (cartoon, anime), 3D-модели и аватары. Главное условие — на референсе должен быть один субъект как «main character». Для multi-character сцены с одним спикером и фоновыми реакциями — тоже работает, но с явным назначением.",
      },
      {
        q: "Какая длительность видео доступна?",
        a: "Через API — до 30 секунд. Research-версия модели поддерживает более минуты, но эта версия не доступна публично. 30 секунд — достаточно для talking head презентации, короткого подкаста, музыкального клипа, продуктового ролика. Для длинных видео — генерируй несколько 30-секундных сегментов и склеивай при монтаже. Для коротких социальных клипов (Reels, Shorts) лимит несущественен.",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "15-40 слов. Короткий промпт — это норма для OmniHuman, а не недостаток. Текстовый промпт дополняет аудио, не заменяет его. Описание внешности не нужно (она на изображении), описание эмоциональной арки не нужно (она в аудио). Достаточно: что персонаж делает в кадре, какая камера, какой эмоциональный тон, какая сцена вокруг.",
      },
      {
        q: "Поддерживается ли Opten для OmniHuman 1.5?",
        a: "Да, расширение Opten автоматически распознаёт ByteDance OmniHuman и оценивает промпты по структуре выше: проверяет наличие входного изображения, согласованность image + audio + prompt, отсутствие описания внешности (она на референсе), фокус на действии и камере, оптимальную длину 15-40 слов. Для multi-character — проверяет явное назначение спикеров. Одним кликом получаешь rewrite в правильной формуле.",
      },
    ],
  },
  en: {
    title: "OmniHuman 1.5 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance OmniHuman 1.5: image + audio → video, talking-head animation, lip-sync, common mistakes, and before/after examples.",
    h1: "OmniHuman 1.5: how to write prompts the model actually understands",
    intro:
      "OmniHuman 1.5 is ByteDance's specialized video model for animating people via Image + Audio → Video. 1024×1024 at 30fps, up to 30 seconds via API. The primary driver is audio (lip-sync and body language); the text prompt is a supplement for scene and camera. English for prompts; audio can be in any language.",
    sections: [
      {
        heading: "What OmniHuman does",
        body:
          "OmniHuman isn't a universal video generator. It's a narrow specialized model for bringing a single human image to life using audio. The architecture is dual-system: Diffusion Transformer (System 1) for visuals + Multimodal LLM (System 2) for context understanding. Trained on 18,700 hours of human motion video; context window 50,000 tokens.\n\nThree inputs work together: image (required — portrait, half-body, or full-body), audio (for lip-sync and body language), text prompt (a supplement for scene, camera, action, emotion). Quality = consistency across all three inputs. Subjects supported: real people, animals, stylized characters, and 3D models.",
        bullets: [
          "Image + Audio → Video, specialized in human animation",
          "1024×1024 at 30fps, up to 30 seconds via API",
          "Audio-driven lip-sync with emotionally responsive body language",
          "Subjects: real people, animals, stylized characters, 3D",
          "Multi-character scenes with explicit speaker assignment",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "The text prompt is a supplement to audio. Audio sets tempo, emotion, lip-sync; the prompt describes scene, camera, action. Don't write long appearance descriptions — appearance is set by the image.\n\nFormula: [Character description + pose] + [Action/movement] + [Camera] + [Emotional tone].\n\nExample: «A male DJ performing live on stage, wearing headphones and mixing music on a DJ controller, focused expression, subtle head movement following the beat.» Short natural scenarios work better than keyword lists. Optimal length 15-40 words. The main thing is consistency with audio and image, not verbosity.",
      },
      {
        heading: "Three-input consistency is the main rule",
        body:
          "Output quality = consistency of image + audio + prompt. This rule breaks most failed generations.\n\nInconsistent example: the image is a businessman in an office; the audio is rock music; the prompt is «DJ performing on stage.» The model can't resolve the conflict and outputs something strange. Consistent example: image — DJ in headphones; audio — electronic music; prompt — «male DJ performing live on stage, focused expression, subtle head movement following the beat.» All three inputs say the same thing.\n\nIf you want lip-sync, the audio must contain speech or vocals. If you want a dance to a beat, the audio must contain rhythmic music. If you want a calm talking head, the audio should be a podcast, not a rock track.",
      },
      {
        heading: "Talking head and presentations",
        body:
          "OmniHuman's main production scenario — animating a speaker from a single photo. Podcasts, video lessons, corporate clips, explainers — anything that needs lip-sync without filming. Saves a day of production: one photo, one audio track → finished clip.\n\nFor talking head the prompt is minimal: «A speaker addressing the camera with a calm professional tone, slight natural head movement, occasional hand gestures off-frame.» Audio sets the rest — pauses, intonation, emotion. Use a static camera or light zoom-in — this matches talking-head aesthetics and doesn't distract from the face.",
      },
      {
        heading: "Multi-character scenes",
        body:
          "OmniHuman supports scenes with multiple characters in frame — but requires explicit speaker assignment. Without it the model doesn't know who's talking, whose lips to sync to the audio.\n\nFormula: «Two people in a podcast studio. The man on the left is speaking (lip-sync to audio), nodding occasionally. The woman on the right is listening attentively, slight reactions on her face.» Explicit: who speaks (for lip-sync), who listens (for background reactions), positions in frame. The model assigns roles correctly.\n\nFor two people speaking in turn you need two passes with different audio or a pre-edited audio file. OmniHuman doesn't do a full dialog in one pass — this is a known limitation.",
      },
    ],
    examples: [
      {
        before: "animate my business partner for a presentation",
        after:
          "A professional speaker addressing the camera with a calm confident tone, slight natural head movements, occasional subtle hand gestures appearing at the bottom of frame. Static camera, mid-shot framing, neutral business office background visible behind. Focused friendly expression, executive presentation aesthetic.",
        note:
          "Appearance isn't described — it's on the reference. Tone (calm confident), motion (slight natural head), camera (static mid-shot), and emotional tone (focused friendly) are explicit. Length is in the 15-40 word target range.",
      },
      {
        before: "DJ playing music",
        after:
          "A male DJ performing live on a club stage, wearing headphones, hands operating a DJ controller, subtle head and shoulder movement following the beat of the audio. Tracking shot slowly orbiting from left to right. Energetic focused expression, club lighting atmosphere with magenta and blue accents.",
        note:
          "Consistent with the assumed audio (electronic beat). Instrument interaction described (operating DJ controller), motion in tempo (following the beat), camera (tracking orbit), atmosphere (club lighting).",
      },
      {
        before: "two people talking on a podcast",
        after:
          "Two people in a warmly-lit podcast studio. The man on the left is speaking (lip-sync to audio), occasional emphatic hand gestures, engaged expression. The woman on the right is listening attentively, slight nods and subtle micro-reactions on her face. Static two-shot framing, soft warm key light, intimate atmosphere.",
        note:
          "Multi-character: the speaker is explicit (man on the left, lip-sync to audio) and the listener (woman on the right, micro-reactions). Without this OmniHuman doesn't know whose lips to sync.",
      },
    ],
    mistakes: [
      {
        title: "Using it as text-to-video",
        explain:
          "OmniHuman ALWAYS requires a human image. It's not a general video generator. If you submit only a text prompt without uploading a reference, generation isn't possible. For T2V use Veo, Sora, Kling, or Hailuo. OmniHuman is a narrow specialized model for animating one photo, not an alternative to general video models.",
      },
      {
        title: "No audio",
        explain:
          "OmniHuman's headline feature is audio-driven lip-sync with emotionally responsive body language. Without audio the model can't sync lips, gets no signal about tempo or emotion. The result degrades sharply: a static portrait or chaotic mimicry. Every generation needs audio — even just an ambient background.",
      },
      {
        title: "Input mismatch",
        explain:
          "DJ in the prompt + classical music in the audio + businessman portrait on the reference = a conflict the model won't resolve. All three inputs must say the same thing. Before generating, check: does the subject on the image match the description in the prompt; does the audio's emotional tone match the action in the prompt; does the visual scene match the acoustic environment.",
      },
      {
        title: "Describing the subject's appearance",
        explain:
          "Appearance is locked in the input image. A long description like «handsome young man with blonde hair, blue eyes, wearing a black suit» is empty tokens up to the action description. Write only: what the character does, how the camera moves, what the emotional tone is, what scene is around them. 15-40 words is more than enough.",
      },
      {
        title: "Expecting high resolution",
        explain:
          "OmniHuman is 1024×1024 at 30fps. That's not 4K and not wide 1080P. For YouTube-resolution production video you need a post-upscale (Topaz, a separate super-resolution pass). For social content (Reels, Shorts, vertical TikTok) 1024×1024 is fine with a light crop. For presentations and podcasts — also OK. For broadcast cinema — insufficient.",
      },
    ],
    faq: [
      {
        q: "How is OmniHuman different from Veo or Sora?",
        a: "Veo and Sora are general video models for generating any scene from text (T2V) or image (I2V). OmniHuman is a narrow specialized model ONLY for human animation via Image + Audio → Video. The headline feature is audio-driven lip-sync with emotional body language. It's not «better or worse than Veo» — it's a different class of tool for a specific task: bringing a single portrait to life with audio.",
      },
      {
        q: "Can I use OmniHuman without audio?",
        a: "Technically yes, but not recommended. Audio-driven lip-sync is the model's headline feature; without audio OmniHuman loses the main signal for tempo, emotion, and body language. The result degrades to a static portrait or chaotic mimicry. If there's no speech audio — use at least an ambient background or a music track to set motion rhythm. OmniHuman isn't designed for silence.",
      },
      {
        q: "Is the model suitable for dialog between two people?",
        a: "Only partially. OmniHuman supports multi-character scenes with one speaker and background reactions from other characters — that works. But a real dialog (two speaking turns) in one pass isn't possible: the model syncs lip-sync to a single audio track. The solution — two passes with different audio and post-edit, or pre-edited audio with explicit speaker markers.",
      },
      {
        q: "Which subject types are supported?",
        a: "Real people (the main scenario), animals (animating talking cats and dogs works surprisingly well), stylized / animated characters (cartoon, anime), 3D models, and avatars. The key requirement — the reference must have one subject as the «main character.» For multi-character scenes with one speaker and background reactions — also works, but with explicit assignment.",
      },
      {
        q: "What duration is available?",
        a: "Via API — up to 30 seconds. The research version of the model supports over a minute, but that version isn't publicly available. 30 seconds is enough for a talking-head presentation, a short podcast, a music clip, a product video. For longer videos — generate several 30-second segments and stitch them in post. For short social clips (Reels, Shorts) the limit is irrelevant.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "15-40 words. A short prompt is the norm for OmniHuman, not a shortcoming. The text prompt supplements the audio, doesn't replace it. Appearance description isn't needed (it's on the image), emotional-arc description isn't needed (it's in the audio). Enough to specify: what the character does in frame, what camera, what emotional tone, what scene is around.",
      },
      {
        q: "Does Opten support OmniHuman 1.5?",
        a: "Yes, the Opten extension auto-detects ByteDance OmniHuman and scores prompts against the structure above: it checks that an input image is present, consistency across image + audio + prompt, absence of appearance description (it's on the reference), focus on action and camera, and optimal 15-40 word length. For multi-character — it checks for explicit speaker assignment. One click gives you a rewrite in the correct formula.",
      },
    ],
  },
};
