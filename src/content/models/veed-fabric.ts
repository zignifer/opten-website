// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for veed-fabric.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Veed Fabric: структура, ошибки, примеры",
    description:
      "Как писать промпты для Veed Fabric 1.0: речевой скрипт, эмоциональные теги, входное изображение, lip-sync, частые ошибки и примеры до/после для talking head.",
    h1: "Veed Fabric: как писать промпты, которые модель понимает",
    intro:
      "Veed Fabric 1.0 — специализированная lip-sync модель, а не генератор видео общего назначения. На вход идёт изображение и аудио (или речевой скрипт для TTS), на выход — анимированный talking head с движениями губ, головы и рук. Поддерживается 30+ языков, до 5 минут через API. Промпт в традиционном смысле не используется.",
    sections: [
      {
        heading: "Как работает Fabric и чем он отличается",
        body:
          "Fabric — это не text-to-video. Это lip-sync / talking head система на архитектуре Diffusion Transformer (DiT), оживляющая статичное изображение под аудио. На вход подаётся пара: одно изображение и один аудиофайл. Модель строит lip-sync, добавляет естественные движения головы, тела и жесты рук, привязанные к ритму речи.\n\nИзображение может быть в любом стиле: фото, иллюстрация, аниме, 3D-рендер, глиняный маскот, бренд-персонаж. Это ключевое отличие от классических avatar-генераторов — Fabric не требует фотореалистичного лица. Аудио — речь или музыка. Разрешения 480p и 720p, FPS 25, форматы 16:9, 9:16 и 1:1. Скорость: Fabric 1.0 Fast примерно в 2.5 раза быстрее Standard, версия 480p отрабатывает 10 секунд за ~1.5 минуты.",
        bullets: [
          "Image + Audio → видео с lip-sync (не T2V)",
          "Любой стиль входного изображения — фото, иллюстрация, аниме, 3D",
          "30+ языков, до 5 минут через API",
          "Разрешения 480p и 720p, FPS 25, форматы 16:9 / 9:16 / 1:1",
          "Fast-вариант ~2.5× быстрее Standard",
        ],
      },
      {
        heading: "Два режима работы",
        body:
          "Audio-режим: ты сам приносишь аудиофайл (mp3/wav/m4a/aac/ogg, до 10 МБ). Текстового промпта здесь нет вообще — модель просто синхронизирует губы и движения под звук. Качество напрямую зависит от пары изображение + аудио: чистая запись без фонового шума, фронтальное изображение с видимым лицом и ртом, без экстремальных ракурсов и сильных бликов на лице.\n\nTTS-режим (через VEED): аудио генерируется из речевого скрипта движком ElevenLabs V3. Здесь «промпт» — это и есть скрипт: текст, который произносится в кадре, плюс встроенные теги в квадратных скобках для контроля эмоций, темпа, акцента и звуковых эффектов. Скрипт может быть на любом из 30+ поддерживаемых языков, включая русский, английский, китайский, японский, испанский и арабский.",
      },
      {
        heading: "Fabric Emotions: inline теги в скрипте",
        body:
          "В TTS-режиме в текст скрипта встраиваются теги [tag] для эмоциональной экспрессии. Это не разметка форматирования, а режиссёрские указания для движка озвучки:\n\nЭмоции: [excited], [happy], [sad], [angry], [curious], [nervous], [confident].\nРеакции: [laughs], [sighs], [gasps], [clears throat].\nГромкость: [whispers], [shouting].\nТемп: [pause], [long pause], [breathes], [rushed], [drawn out].\nЗвуковые эффекты: [applause], [gunshot], [door creaks].\nАкцент: [American accent], [British accent].\n\nПравило одно: не перегружать тегами. Один тег на 1-2 предложения, распределять постепенно для естественного звучания. Тег перед каждым словом сломает интонацию — модель начнёт каждое слово произносить отдельно, с провалами, рывками и неестественными паузами.",
      },
      {
        heading: "Требования к входному изображению",
        body:
          "Входное изображение задаёт всё визуальное качество итогового клипа. Базовые правила: фронтальное лицо или близко к фронтальному, без сильных Dutch-углов и профилей под 90 градусов. Лицо хорошо освещено и хорошо видно — без глубоких теней на одной половине, без сильных бликов от очков. Никаких окклюзий (рук перед лицом, медицинской маски, очков с зеркальными бликами на глазах) — модель просто не вытянет lip-sync, если рта не видно.\n\nФорматы — jpg, jpeg, png, webp, gif, avif; размер до 10 МБ. Стиль не критичен: Fabric одинаково хорошо оживляет фото, иллюстрации в стиле аниме, 3D-рендеры пластилиновых персонажей, корпоративных маскотов и бренд-аватаров. Но в любом случае нужно одно чёткое лицо в кадре — не толпа, не два персонажа одновременно, не профиль без видимого рта.",
      },
      {
        heading: "Типичные сценарии",
        body:
          "Talking head контент — анимация спикера для презентаций, виртуальные ведущие, корпоративные видео для рассылок и обучения сотрудников. Бренд-маскоты — оживление маскотов с речью, animated brand ambassadors, говорящие персонажи для соцсетей. Образовательный контент — анимированные инструкторы и видео-объяснения с lip-sync на любом из 30+ языков платформы. Социальный контент — мемы, talking head клипы, multilingual видео для глобальных аудиторий.\n\nЧто Fabric НЕ делает: не генерирует сцены и фоны (статичное изображение остаётся статичным фоном кадра), не делает камерных движений, не поддерживает экшн и физическое взаимодействие. Если задача — кинематографический клип с движением камеры, Fabric не подходит. Это инструмент для одного: оживить лицо под речь.",
      },
    ],
    examples: [
      {
        before: "person talking about a product",
        after:
          "[TTS script for Veed Fabric, paired with a frontal product-shot image of a brand mascot]\n\n[confident] Hey there! I'm Otto, and today I'm showing you something special. [pause] Our new wireless earbuds give you twelve hours of battery on a single charge. [excited] Twelve full hours — that's almost a whole workday! [pause] [drawn out] No more low-battery anxiety. Tap the link below to grab yours.",
        note:
          "Это речевой скрипт для TTS-режима, не описание сцены. Эмоциональные теги [confident], [excited], [drawn out] расставлены через паузы, не на каждом слове.",
      },
      {
        before: "a brand mascot says hello to viewers",
        after:
          "[TTS script paired with a frontal illustration of the brand mascot]\n\n[happy] Hello, friends! [laughs] It's so good to see you again. [pause] I've been waiting all week to share this with you. [curious] Have you ever wondered what makes our community special? [pause] [confident] Stick around — I'll show you in the next sixty seconds.",
        note:
          "Скрипт короткий, теги распределены: одна эмоция → одна-две фразы → пауза. Реакции типа [laughs] делают talking head живым.",
      },
      {
        before: "explain something in two languages",
        after:
          "[TTS script for Veed Fabric, paired with a frontal image of an animated instructor — illustration style]\n\n[British accent] [confident] Welcome back to the channel. Today we're tackling something most beginners get wrong. [pause] [curious] What if I told you the trick is in the timing, not the tools? [drawn out] Let me show you. [pause] In the next clip I'll walk through it step by step.",
        note:
          "Акцент задаётся тегом [British accent] в начале и держится дальше. Скрипт продуман под ~15 секунд произнесения — не пытается уместить целую лекцию.",
      },
    ],
    mistakes: [
      {
        title: "Описание сцены вместо скрипта",
        explain:
          "Fabric — не T2V. Промпт типа «a man in a forest at sunset, walking and explaining the product» модель проигнорирует: она не генерирует ни лес, ни закат, ни ходьбу. Вместо описания сцены давай готовое изображение (фон + лицо) и речевой скрипт с тегами. Сцену рисует другой инструмент, Fabric только оживляет лицо.",
      },
      {
        title: "Перегрузка эмоциональными тегами",
        explain:
          "[excited] Hello [happy] everyone [laughs] today [confident] I want — модель сорвётся в рывки, паузы и неестественные переходы. Один тег на 1-2 предложения, не на каждое слово. Реакции [laughs], [sighs] ставь между фразами, не внутри. Эмоции работают как режиссёрские указания, а не как разметка каждой словоформы.",
      },
      {
        title: "Грязное аудио или сильный фоновый шум",
        explain:
          "В Audio-режиме качество lip-sync напрямую зависит от чистоты звука. Сильный фоновый шум, эхо, музыка поверх речи путают модель — губы начинают «дрейфовать», синхронизация ломается. Записывай речь отдельно, фоновую музыку добавляй на монтаже после генерации, не в исходном аудиофайле.",
      },
      {
        title: "Экстремальные ракурсы на входном изображении",
        explain:
          "Сильный профиль, Dutch-угол, лицо в окклюзии (за рукой, под маской, с бликами на очках) — модель не вытянет lip-sync. Используй фронтальное или близкое к фронтальному изображение с хорошо видимым ртом и равномерным освещением. Анимация стиля не критична, ракурс — критичен.",
      },
      {
        title: "Ожидание камерных движений или экшна",
        explain:
          "Fabric не делает dolly, push-in, tracking shot — модель не двигает камеру и не меняет план. Если в брифе нужны кинематографические движения и действия персонажа в среде, это задача для Sora 2, Veo 3.1 или Kling. Fabric закрывает другой кейс: фиксированный кадр, оживший лицом и речью.",
      },
    ],
    faq: [
      {
        q: "Чем Veed Fabric отличается от обычной text-to-video модели?",
        a: "Fabric не генерирует сцены, фоны и движение камеры — он оживляет статичное изображение под речь. На вход идёт пара изображение + аудио (или скрипт для TTS), на выход — talking head с lip-sync, движениями головы и жестами. Это специализированный инструмент для одного кейса: говорящий персонаж в фиксированном кадре. Для кинематографических клипов нужны Sora 2, Veo 3.1, Kling.",
      },
      {
        q: "Какие языки поддерживает Fabric?",
        a: "Fabric поддерживает 30+ языков, включая русский, английский, испанский, французский, немецкий, китайский, японский, арабский. Аудио или TTS-скрипт может быть на любом из них. Это делает Fabric удобным для локализации talking head контента: один и тот же визуальный персонаж может говорить на нескольких языках с разными скриптами.",
      },
      {
        q: "Какая разница между Fabric 1.0 Standard и Fabric 1.0 Fast?",
        a: "Standard даёт максимальное качество, Fast — примерно в 2.5 раза быстрее при той же архитектуре DiT. На 480p Standard отрабатывает 10 секунд видео примерно за 1.5 минуты, Fast — заметно быстрее. На 720p Standard работает около 5 минут на 10 секунд. Выбирай Fast для итераций и прототипирования, Standard — для финального продакшна.",
      },
      {
        q: "Какие требования к входному изображению?",
        a: "Форматы — jpg, jpeg, png, webp, gif, avif, до 10 МБ. Лицо должно быть фронтальным или близким к фронтальному, хорошо освещённым, без окклюзий (руки, маски, бликов на очках). Один персонаж в кадре, не толпа. Стиль не критичен — фото, иллюстрация, аниме, 3D работают одинаково. Критичен ракурс: модель должна видеть рот.",
      },
      {
        q: "Что такое Fabric Emotions и как их использовать?",
        a: "Fabric Emotions — inline теги в квадратных скобках, которые встраиваются в речевой скрипт в TTS-режиме. Категории: эмоции ([excited], [sad]), реакции ([laughs], [sighs]), громкость ([whispers], [shouting]), темп ([pause], [rushed]), звуковые эффекты ([applause]), акценты ([British accent]). Распределяй их постепенно — один тег на 1-2 фразы, не на каждое слово.",
      },
      {
        q: "Можно ли использовать Fabric для длинных видео?",
        a: "Через API — да, до 5 минут на один клип. В Studio действует лимит около 30 секунд на клип. Для длинного контента используй API напрямую или режь длинную речь на несколько клипов и склеивай в посте. Lip-sync остаётся стабильным на длинных отрезках, если входное аудио чистое и без резких смен темпа.",
      },
      {
        q: "Поддерживается ли Opten для Veed Fabric?",
        a: "Да, расширение Opten распознаёт Fabric в интерфейсе VEED и оценивает речевой скрипт по структуре, описанной выше: проверяет наличие входного изображения, длину скрипта под целевую длительность, разумное распределение эмоциональных тегов, отсутствие сценического описания вместо TTS-текста. Одним кликом можно получить rewrite скрипта в правильном формате.",
      },
    ],
  },
  en: {
    title: "Veed Fabric Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Veed Fabric 1.0: speech script, emotion tags, input image, lip-sync, common mistakes, and before/after examples for talking head.",
    h1: "Veed Fabric: how to write prompts the model actually understands",
    intro:
      "Veed Fabric 1.0 is a specialized lip-sync model, not a general video generator. The input is an image plus audio (or a TTS speech script), and the output is an animated talking head with lip, head, and hand motion. It supports 30+ languages and up to 5 minutes via API. A traditional text prompt does not apply here.",
    sections: [
      {
        heading: "How Fabric works and how it differs",
        body:
          "Fabric is not text-to-video. It is a lip-sync / talking head system built on a Diffusion Transformer (DiT) architecture that animates a still image to audio. The input is a pair: one image and one audio file. The model produces lip-sync, adds natural head and body motion, and adds hand gestures tied to the speech rhythm.\n\nThe image can be in any style: photo, illustration, anime, 3D render, clay mascot, brand character. This is the key difference from classic avatar generators — Fabric does not require a photorealistic face. Audio is speech or music. Resolutions are 480p and 720p, frame rate 25 fps, formats 16:9, 9:16, and 1:1. Speed: Fabric 1.0 Fast is roughly 2.5× faster than Standard, the 480p path handles 10 seconds of video in about 1.5 minutes.",
        bullets: [
          "Image + Audio → lip-synced video (not T2V)",
          "Any input image style — photo, illustration, anime, 3D",
          "30+ languages, up to 5 minutes via API",
          "Resolutions 480p and 720p, 25 fps, formats 16:9 / 9:16 / 1:1",
          "Fast variant runs ~2.5× faster than Standard",
        ],
      },
      {
        heading: "Two working modes",
        body:
          "Audio mode: you bring your own audio file (mp3/wav/m4a/aac/ogg, up to 10 MB). There is no text prompt here at all — the model only syncs lips and motion to the sound. Quality depends on the image and audio pair: clean recording with no background noise, frontal image with a visible face, no extreme angles.\n\nTTS mode (via VEED): audio is generated from a speech script by the ElevenLabs V3 engine. Here the «prompt» is the script itself: the text spoken on screen plus inline bracketed tags that control emotions, pacing, accent, and sound effects. The script can be in any of the 30+ supported languages.",
      },
      {
        heading: "Fabric Emotions: inline tags inside the script",
        body:
          "In TTS mode the script carries [tag] markers for emotional expression. These are not formatting markers — they are directorial cues for the voice engine:\n\nEmotions: [excited], [happy], [sad], [angry], [curious], [nervous], [confident].\nReactions: [laughs], [sighs], [gasps], [clears throat].\nVolume: [whispers], [shouting].\nPacing: [pause], [long pause], [breathes], [rushed], [drawn out].\nSound effects: [applause], [gunshot], [door creaks].\nAccent: [American accent], [British accent].\n\nOne rule: do not overload. One tag per 1-2 sentences, distributed gradually for natural delivery. A tag before every word will break the intonation — the model will start clipping each word with awkward pauses and gear shifts.",
      },
      {
        heading: "Requirements for the input image",
        body:
          "The image sets the entire visual quality. Base rules: frontal or near-frontal face, no heavy Dutch angles, no 90-degree profiles. Face well lit — no deep shadow on one half. No occlusions (hands in front of the face, masks, glasses with strong reflections on the eyes) — the model cannot pull lip-sync if it cannot see the mouth.\n\nFormats: jpg, jpeg, png, webp, gif, avif, up to 10 MB. Style is not critical: Fabric animates photos, anime illustrations, 3D-rendered clay characters, and corporate mascots equally well. But in every case you need one clear face in frame — not a crowd, not two characters, not a profile without a visible mouth.",
      },
      {
        heading: "Typical use cases",
        body:
          "Talking head content — animated speakers for presentations, virtual hosts, corporate videos. Brand mascots — bringing mascots to life with speech, animated brand ambassadors. Educational content — animated instructors and explainer videos with lip-sync in any language. Social content — memes, talking head clips, multilingual videos across the 30+ supported languages.\n\nWhat Fabric does NOT do: it does not generate scenes or backgrounds (a static image stays a static background), it does not move the camera, it does not support action or physical interaction. If the brief calls for cinematic camera movement and character action in an environment, Fabric is the wrong tool. It is built for one thing: bring a face to life under speech.",
      },
    ],
    examples: [
      {
        before: "person talking about a product",
        after:
          "[TTS script for Veed Fabric, paired with a frontal product-shot image of a brand mascot]\n\n[confident] Hey there! I'm Otto, and today I'm showing you something special. [pause] Our new wireless earbuds give you twelve hours of battery on a single charge. [excited] Twelve full hours — that's almost a whole workday! [pause] [drawn out] No more low-battery anxiety. Tap the link below to grab yours.",
        note:
          "This is a TTS script, not a scene description. Emotion tags [confident], [excited], [drawn out] are placed between phrases, not on every word.",
      },
      {
        before: "a brand mascot says hello to viewers",
        after:
          "[TTS script paired with a frontal illustration of the brand mascot]\n\n[happy] Hello, friends! [laughs] It's so good to see you again. [pause] I've been waiting all week to share this with you. [curious] Have you ever wondered what makes our community special? [pause] [confident] Stick around — I'll show you in the next sixty seconds.",
        note:
          "Short script, tags distributed: one emotion → one or two phrases → pause. Reactions like [laughs] make the talking head feel alive.",
      },
      {
        before: "explain something in two languages",
        after:
          "[TTS script for Veed Fabric, paired with a frontal image of an animated instructor — illustration style]\n\n[British accent] [confident] Welcome back to the channel. Today we're tackling something most beginners get wrong. [pause] [curious] What if I told you the trick is in the timing, not the tools? [drawn out] Let me show you. [pause] In the next clip I'll walk through it step by step.",
        note:
          "Accent is set by the [British accent] tag at the start and carries forward. The script is sized for about 15 seconds of speech — it does not try to cram a full lecture.",
      },
    ],
    mistakes: [
      {
        title: "Describing a scene instead of writing a script",
        explain:
          "Fabric is not T2V. A prompt like «a man in a forest at sunset, walking and explaining the product» will be ignored: the model does not generate the forest, the sunset, or the walking. Hand in a ready image (background plus face) and a speech script with tags. Some other tool draws the scene; Fabric only animates the face.",
      },
      {
        title: "Overloading with emotion tags",
        explain:
          "[excited] Hello [happy] everyone [laughs] today [confident] I want — the model will jitter, pause, and break into unnatural transitions. One tag per 1-2 sentences, not per word. Place reactions like [laughs] and [sighs] between phrases, not inside them. Tags work as director's notes, not as per-token markup.",
      },
      {
        title: "Dirty audio or heavy background noise",
        explain:
          "In Audio mode lip-sync quality depends directly on how clean the sound is. Heavy background noise, echo, or music layered over speech confuses the model — lips start to drift and sync breaks. Record speech alone, add background music in post after generation, not into the source audio file.",
      },
      {
        title: "Extreme angles in the input image",
        explain:
          "A strong profile, Dutch angle, or face occluded behind a hand, mask, or reflective glasses — the model cannot pull lip-sync. Use a frontal or near-frontal image with a clearly visible mouth and even lighting. Art style is not critical, the angle is.",
      },
      {
        title: "Expecting camera moves or action",
        explain:
          "Fabric does not do dolly, push-in, or tracking shots — the model does not move the camera and does not change the shot. If the brief needs cinematic motion and physical action in an environment, that is a job for Sora 2, Veo 3.1, or Kling. Fabric covers a different case: a fixed frame brought to life by face and speech.",
      },
    ],
    faq: [
      {
        q: "How is Veed Fabric different from a regular text-to-video model?",
        a: "Fabric does not generate scenes, backgrounds, or camera motion — it animates a still image to speech. Input is an image + audio pair (or a TTS script), output is a talking head with lip-sync, head motion, and gestures. It is a specialized tool for one case: a speaking character in a fixed frame. For cinematic clips reach for Sora 2, Veo 3.1, or Kling.",
      },
      {
        q: "Which languages does Fabric support?",
        a: "Fabric supports 30+ languages, including English, Russian, Spanish, French, German, Chinese, Japanese, and Arabic. The audio or TTS script can be in any of them. That makes Fabric convenient for localizing talking head content: the same visual character can speak several languages from different scripts.",
      },
      {
        q: "What is the difference between Fabric 1.0 Standard and Fabric 1.0 Fast?",
        a: "Standard delivers maximum quality, Fast runs roughly 2.5× faster on the same DiT architecture. At 480p Standard renders 10 seconds in about 1.5 minutes; Fast is noticeably quicker. At 720p Standard takes around 5 minutes per 10 seconds. Pick Fast for iteration and prototyping, Standard for final production.",
      },
      {
        q: "What are the requirements for the input image?",
        a: "Formats: jpg, jpeg, png, webp, gif, avif, up to 10 MB. The face must be frontal or near-frontal, well lit, with no occlusions (hands, masks, strong glasses reflections). One character per frame, not a crowd. Style is not critical — photo, illustration, anime, 3D all work equally. Angle is critical: the model has to see the mouth.",
      },
      {
        q: "What are Fabric Emotions and how do I use them?",
        a: "Fabric Emotions are inline bracketed tags embedded in the speech script in TTS mode. Categories: emotions ([excited], [sad]), reactions ([laughs], [sighs]), volume ([whispers], [shouting]), pacing ([pause], [rushed]), sound effects ([applause]), accents ([British accent]). Distribute them gradually — one tag per 1-2 phrases, not per word.",
      },
      {
        q: "Can Fabric be used for long videos?",
        a: "Via the API, yes, up to 5 minutes per clip. In Studio the limit is around 30 seconds per clip. For long content use the API directly, or split long speech into several clips and join them in post. Lip-sync stays stable on long takes if the input audio is clean and free of sharp tempo changes.",
      },
      {
        q: "Does Opten support Veed Fabric?",
        a: "Yes, the Opten extension detects Fabric inside the VEED interface and scores the speech script against the structure outlined above: it checks for the input image, script length matched to target duration, sensible distribution of emotion tags, and that you did not write a scene description instead of TTS text. One click gives you a rewrite of the script in the right format.",
      },
    ],
  },
};
