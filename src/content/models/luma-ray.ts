// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for luma-ray.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Luma Ray: структура, ошибки, примеры",
    description:
      "Как писать промпты для Luma Ray в Dream Machine: формула субъект+действие+камера, positive-only стиль, keyframes, режимы Modify и Extend, примеры до и после.",
    h1: "Luma Ray: как писать промпты, которые модель понимает",
    intro:
      "Luma Ray — общее семейство видеомоделей Luma в Dream Machine: Ray 1.x, Ray 2, Ray 3.14 и Ray 3 Reasoning. Все модели Ray работают по одной формуле — субъект + mid-action verb + сцена + вторичное движение + камера + свет. Это «positive-only» модели: негативные промпты контрпродуктивны. Длительность 5–10 секунд, extend до ~30 секунд.",
    sections: [
      {
        heading: "Что умеет семейство Ray",
        body:
          "Все модели Luma Ray принимают text-to-video, image-to-video с keyframes (start + end frame), extend для продления, modify для трансформации существующего видео и loop для бесшовной петли. Соотношения сторон: 9:16, 3:4, 1:1, 4:3, 16:9, 21:9.\n\nКлючевая особенность семейства: модели Ray обучены на видеоданных, поэтому понимают естественное движение и физически корректные взаимодействия. Они НЕ принимают негативные инструкции — описывай только то, что хочешь видеть. Слова «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» деградируют качество — это эмпирически подтверждено Luma.",
        bullets: [
          "5–10 секунд за один запуск, extend до ~30 секунд",
          "720p и 1080p нативно, 4K через апскейл",
          "Keyframes: start frame + end frame для I2V",
          "Loop для бесшовных продуктовых видео",
          "Positive-only модель — без негативных промптов",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Универсальная формула для всех моделей Ray: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nГлавное правило — present continuous. Используй глаголы в процессе действия: «running» вместо «begins to run», «pouring» вместо «starts to pour», «spinning» вместо «will spin». Модель не понимает будущее время и последовательность действий.\n\nОптимальная длина промпта — около 100 слов, сфокусированных на действии. Меньше 15 слов — модель додумывает слишком много, результат непредсказуем. Больше 200 слов — перегрузка деталями, модель теряет фокус.",
      },
      {
        heading: "Камера и вторичное движение",
        body:
          "Конкретное описание камеры значительно улучшает результат. Категории движения: dolly forward/back, tracking shot, orbit, crane shot, push in, pull out, pan left/right, tilt up/down. Крупность: close-up, extreme close-up, medium shot, wide shot, establishing shot, macro. Ракурс: low angle, high angle, bird's eye view, Dutch angle, POV, over-the-shoulder.\n\nВторичное движение — это последствия основного действия, которые делают видео живым: «ears flapping in the wind», «dust particles catching golden hour sunlight», «fabric billowing outward», «hair flowing», «reflections shimmering on wet pavement», «ripples spreading on water». Без них видео выглядит статичным даже при движущемся субъекте.\n\nИзбегай конфликтующих камерных движений (zoom + pan + orbit одновременно) — модель пытается выполнить всё сразу и даёт хаотичный результат.",
      },
      {
        heading: "Режимы и keyframes",
        body:
          "Text-to-Video — генерация из текста, основной режим. Image-to-Video — анимация изображения или переход между start/end keyframes. С keyframes соотношение сторон берётся автоматически из загруженного изображения. Описывай только то, что МЕНЯЕТСЯ — не описывай статичные элементы заново.\n\nExtend — продолжение существующего видео. Лимит ~30 секунд суммарно, далее качество снижается. Каждое продление — отдельный промпт с описанием нового контента.\n\nModify (V2V) — трансформация существующего видео по промпту. Три режима: Adhere (сохранение оригинала, минимальные изменения), Flex (баланс), Reimagine (свобода). Критическое правило: описывай КОНЕЧНОЕ СОСТОЯНИЕ, не команды. «Cyberpunk neon city at night, rain-slicked streets» работает, «change the sky to blue» нет.\n\nLoop — бесшовное зацикленное видео для продуктовых шоукейсов. Активируется иконкой ∞ в prompt box.",
      },
      {
        heading: "Запрещённые слова и негативные промпты",
        body:
          "Эмпирически подтверждённый Luma список слов, деградирующих качество на моделях Ray: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning». Эти слова не дают модели визуальной информации, занимают место в промпте и снижают итоговое качество. Замени на конкретику: вместо «beautiful sunset» — «warm orange light spilling across the horizon».\n\nНегативные инструкции («no clouds», «without text», «remove shadows», «no watermark») контрпродуктивны на Ray — это «positive only» модель. Если не хочешь облаков — пиши «clear blue sky», если не хочешь теней — «evenly lit scene», если не хочешь людей — «empty wheat field».\n\nВременные фразы тоже ломают результат: «begins to», «starts to», «will», «then» — модель не понимает последовательность во времени. Используй настоящее непрерывное: «running», «pouring», «spinning».",
      },
    ],
    examples: [
      {
        before:
          "a beautiful golden retriever runs through a field, stunning visuals",
        after:
          "A golden retriever running through a wheat field at sunset, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside at the dog's level, warm cinematic light.",
        note:
          "Запрещённые слова («beautiful», «stunning visuals») убраны. «Runs» (will/present simple) заменено на «running» (mid-action). Добавлено вторичное движение (ears flapping, dust particles), конкретная камера (tracking alongside at dog's level) и свет (golden hour, warm cinematic).",
      },
      {
        before:
          "espresso pouring, no spills, no mess",
        after:
          "Espresso pouring into a white ceramic cup, dark liquid swirling and forming crema, steam rising slowly, macro close-up, soft warm morning light from the left, shallow depth of field.",
        note:
          "«No spills, no mess» — негативный промпт, который Ray игнорирует или интерпретирует обратно. Решение: позитивное описание чистого процесса (swirling, forming crema), macro близость, конкретный свет (warm morning light from the left).",
      },
      {
        before:
          "change the sky from cloudy to blue (для Modify)",
        after:
          "Clear blue sky, bright daylight, soft white clouds at the horizon, warm sunlight, golden hour atmosphere — same composition as original.",
        note:
          "Для Modify (V2V) команды («change», «remove», «transform») не работают. Решение: описывай КОНЕЧНОЕ СОСТОЯНИЕ как самостоятельную сцену. Начинай с Adhere 1–2 интенсивности, повышай при необходимости.",
      },
    ],
    mistakes: [
      {
        title: "Запрещённые слова в промпте",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — эмпирически деградируют качество Ray. Эти слова не дают модели визуальной информации, занимают место и снижают результат. Замени на конкретику: «warm orange light», «soft pastel palette», «sharp detail», «cinematic lighting».",
      },
      {
        title: "Временные фразы и будущее время",
        explain:
          "«Begins to run», «starts to spin», «will pour», «then transforms» — модель Ray не понимает последовательность во времени, работает в present continuous. Используй mid-action verbs: «running», «spinning», «pouring», «transforming». Для последовательных действий — отдельные промпты с extend.",
      },
      {
        title: "Негативные промпты",
        explain:
          "«No text», «without people», «remove watermark», «no clouds» — Ray это «positive only» модель, негативные инструкции либо игнорируются, либо интерпретируются обратно. Замени на позитивное описание желаемого результата: вместо «no clouds» — «clear blue sky», вместо «without people» — «empty street».",
      },
      {
        title: "Слишком короткий промпт",
        explain:
          "Промпт меньше 15 слов даёт модели слишком мало информации, она додумывает большую часть сцены. Оптимальная длина — около 100 слов с описанием субъекта, действия, сцены, вторичного движения, камеры и света. Длиннее 200 слов — перегрузка деталями.",
      },
      {
        title: "Пере-описание статики с keyframes",
        explain:
          "Когда используешь image-to-video с keyframes, не описывай заново то, что уже есть в кадрах. Описывай только ИЗМЕНЕНИЯ между start и end frame: «hair starts to flow», «camera dollies forward», «light shifts from cool to warm». Подробное описание статичных элементов сбивает модель.",
      },
    ],
    faq: [
      {
        q: "Чем семейство Ray отличается от других видеомоделей?",
        a: "Ray обучен напрямую на видеоданных, что даёт ему понимание естественного движения и физически корректных взаимодействий. Это «positive only» модель — негативные промпты не работают. Поддерживает keyframes (start + end frame), extend до ~30 секунд, modify (V2V с тремя режимами), loop. Семейство включает несколько моделей: Ray 1.x, Ray 2, Ray 3.14, Ray 3 Reasoning.",
      },
      {
        q: "Какие слова деградируют качество Ray?",
        a: "Эмпирически подтверждённый Luma список: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning». Они не дают модели визуальной информации и снижают качество. Также деградируют временные фразы («begins to», «starts to», «will», «then») и негативные промпты («no», «without», «remove»). Замени на конкретику и present continuous.",
      },
      {
        q: "Сколько секунд можно сгенерировать за раз?",
        a: "5 или 10 секунд за один запуск (выбирается в настройках Dream Machine). Для более длинных видео используй extend — продолжение существующего ролика с описанием нового контента. Суммарный лимит — около 30 секунд, далее качество снижается с каждым продлением. Каждое продление — отдельный промпт.",
      },
      {
        q: "Как работают keyframes в Ray?",
        a: "Image-to-Video режим принимает start frame (обязательный) и end frame (опциональный). Модель генерирует переход между ними. С keyframes соотношение сторон берётся автоматически из изображения. Главное правило: описывай только то, что МЕНЯЕТСЯ между кадрами, не переописывай статичные элементы. Это даёт лучшую плавность движения.",
      },
      {
        q: "Что такое режим Modify?",
        a: "Modify (Video-to-Video) трансформирует существующее видео по промпту: меняет стиль, освещение, окружение, время суток. Три уровня контроля: Adhere (1–3, сохранение оригинала), Flex (1–3, баланс), Reimagine (1–3, творческая свобода). Описывай КОНЕЧНОЕ СОСТОЯНИЕ, не команды: «cyberpunk neon city at night» работает, «change to cyberpunk» нет.",
      },
      {
        q: "Стоит ли писать промпты на русском?",
        a: "Нет, модели Ray оптимизированы под английский и кинематографическую терминологию. На других языках результаты заметно хуже — модель теряет фотографические и операторские опоры, на которые она реагирует лучше всего. Для production-задач всегда переводи промпт на английский, для коротких экспериментов русский ок, но не жди того же качества.",
      },
      {
        q: "Поддерживает ли Opten Luma Ray?",
        a: "Да, расширение Opten автоматически распознаёт модели семейства Ray (Ray 1.x, Ray 2, Ray 3.14, Ray 3) и оценивает промпты по специфике семейства. Проверяет отсутствие запрещённых слов и негативных промптов, наличие mid-action verbs, конкретного описания камеры и света, вторичного движения. Одним кликом получаешь rewrite в positive-only формате с правильной структурой.",
      },
    ],
  },
  en: {
    title: "Luma Ray Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Luma Ray video models in Dream Machine: subject+action+camera formula, positive-only style, keyframes, Modify and Extend modes.",
    h1: "Luma Ray: how to write prompts the model actually understands",
    intro:
      "Luma Ray is the Luma video-model family in Dream Machine: Ray 1.x, Ray 2, Ray 3.14, and Ray 3 Reasoning. All Ray models share the same formula — subject + mid-action verb + setting + secondary motion + camera + lighting. These are positive-only models: negative prompts are counter-productive. Duration is 5–10 seconds, extend up to 30 seconds.",
    sections: [
      {
        heading: "What the Ray family does",
        body:
          "All Luma Ray models support text-to-video, image-to-video with keyframes (start + end frame), extend for continuation, modify for transforming existing video, and loop for seamless looping. Aspect ratios: 9:16, 3:4, 1:1, 4:3, 16:9, 21:9.\n\nKey feature of the family: Ray models are trained directly on video data, so they understand natural motion and physically correct interactions. They do NOT accept negative instructions — describe only what you want to see. The words «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» degrade quality — empirically confirmed by Luma.",
        bullets: [
          "5–10 seconds per run, extend up to ~30 seconds",
          "720p and 1080p native, 4K via upscale",
          "Keyframes: start frame + end frame for I2V",
          "Loop for seamless product videos",
          "Positive-only model — no negative prompts",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Universal formula across all Ray models: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nKey rule — present continuous. Use mid-action verbs: «running» instead of «begins to run», «pouring» instead of «starts to pour», «spinning» instead of «will spin». The model doesn't understand future tense or action sequences.\n\nOptimal prompt length is around 100 words focused on the action. Under 15 words — the model fills in too much and results are unpredictable. Over 200 words — detail overload and the model loses focus.",
      },
      {
        heading: "Camera and secondary motion",
        body:
          "A concrete camera description significantly improves the result. Movement categories: dolly forward/back, tracking shot, orbit, crane shot, push in, pull out, pan left/right, tilt up/down. Shot size: close-up, extreme close-up, medium shot, wide shot, establishing shot, macro. Angle: low angle, high angle, bird's eye view, Dutch angle, POV, over-the-shoulder.\n\nSecondary motion is the consequence of the main action that makes video feel alive: «ears flapping in the wind», «dust particles catching golden hour sunlight», «fabric billowing outward», «hair flowing», «reflections shimmering on wet pavement», «ripples spreading on water». Without them, video looks static even with a moving subject.\n\nAvoid conflicting camera moves (zoom + pan + orbit simultaneously) — the model tries to execute everything at once and produces chaos.",
      },
      {
        heading: "Modes and keyframes",
        body:
          "Text-to-Video — generation from text, the main mode. Image-to-Video — animating an image or transitioning between start/end keyframes. With keyframes the aspect ratio is taken automatically from the uploaded image. Describe only what CHANGES — don't re-describe static elements.\n\nExtend — continuation of existing video. Limit ~30 seconds total, beyond that quality drops. Each extension is a separate prompt describing the new content.\n\nModify (V2V) — transforming existing video by prompt. Three modes: Adhere (preserve original, minimal change), Flex (balance), Reimagine (freedom). Critical rule: describe the END STATE, not commands. «Cyberpunk neon city at night, rain-slicked streets» works; «change the sky to blue» doesn't.\n\nLoop — seamless looped video for product showcases. Activated via the ∞ icon in the prompt box.",
      },
      {
        heading: "Forbidden words and negative prompts",
        body:
          "Luma's empirically confirmed list of words that degrade quality on Ray models: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning». They give the model no visual information, take up prompt space, and reduce final quality. Replace with concrete description: instead of «beautiful sunset» write «warm orange light spilling across the horizon».\n\nNegative instructions («no clouds», «without text», «remove shadows», «no watermark») are counter-productive on Ray — this is a «positive only» model. If you don't want clouds, write «clear blue sky»; if you don't want shadows, write «evenly lit scene»; if you don't want people, write «empty wheat field».\n\nTemporal phrases also break results: «begins to», «starts to», «will», «then» — the model doesn't understand temporal sequence. Use present continuous: «running», «pouring», «spinning».",
      },
    ],
    examples: [
      {
        before:
          "a beautiful golden retriever runs through a field, stunning visuals",
        after:
          "A golden retriever running through a wheat field at sunset, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside at the dog's level, warm cinematic light.",
        note:
          "Forbidden words («beautiful», «stunning visuals») removed. «Runs» (present simple) replaced with «running» (mid-action). Added secondary motion (ears flapping, dust particles), concrete camera (tracking alongside at dog's level), and light (golden hour, warm cinematic).",
      },
      {
        before:
          "espresso pouring, no spills, no mess",
        after:
          "Espresso pouring into a white ceramic cup, dark liquid swirling and forming crema, steam rising slowly, macro close-up, soft warm morning light from the left, shallow depth of field.",
        note:
          "«No spills, no mess» is a negative prompt that Ray ignores or inverts. The fix: positive description of the clean process (swirling, forming crema), macro proximity, specific light (warm morning light from the left).",
      },
      {
        before:
          "change the sky from cloudy to blue (for Modify)",
        after:
          "Clear blue sky, bright daylight, soft white clouds at the horizon, warm sunlight, golden hour atmosphere — same composition as original.",
        note:
          "For Modify (V2V), commands («change», «remove», «transform») don't work. The fix: describe the END STATE as a standalone scene. Start with Adhere 1–2 intensity and increase as needed.",
      },
    ],
    mistakes: [
      {
        title: "Forbidden words in the prompt",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» empirically degrade Ray quality. These words give the model no visual information, take up prompt space, and reduce results. Replace with concrete description: «warm orange light», «soft pastel palette», «sharp detail», «cinematic lighting».",
      },
      {
        title: "Temporal phrases and future tense",
        explain:
          "«Begins to run», «starts to spin», «will pour», «then transforms» — Ray doesn't understand temporal sequence and works in present continuous. Use mid-action verbs: «running», «spinning», «pouring», «transforming». For sequential actions, split into separate prompts with extend.",
      },
      {
        title: "Negative prompts",
        explain:
          "«No text», «without people», «remove watermark», «no clouds» — Ray is a «positive only» model. Negative instructions are either ignored or inverted. Replace with positive description of the desired result: instead of «no clouds» write «clear blue sky»; instead of «without people» write «empty street».",
      },
      {
        title: "Prompt too short",
        explain:
          "A prompt under 15 words gives the model too little information and it makes up most of the scene. Optimal length is around 100 words with subject, action, setting, secondary motion, camera, and light. Over 200 words leads to detail overload.",
      },
      {
        title: "Re-describing static elements with keyframes",
        explain:
          "When using image-to-video with keyframes, don't re-describe what's already in the frames. Describe only the CHANGES between start and end frame: «hair starts to flow», «camera dollies forward», «light shifts from cool to warm». Detailed descriptions of static elements confuse the model.",
      },
    ],
    faq: [
      {
        q: "How is the Ray family different from other video models?",
        a: "Ray is trained directly on video data, giving it an understanding of natural motion and physically correct interactions. It's a «positive only» model — negative prompts don't work. Supports keyframes (start + end frame), extend up to ~30 seconds, modify (V2V with three modes), and loop. The family includes several models: Ray 1.x, Ray 2, Ray 3.14, Ray 3 Reasoning.",
      },
      {
        q: "Which words degrade Ray quality?",
        a: "Luma's empirically confirmed list: «vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning». They give the model no visual information and lower quality. Temporal phrases («begins to», «starts to», «will», «then») and negative prompts («no», «without», «remove») also degrade output. Replace with concrete description and present continuous verbs.",
      },
      {
        q: "How many seconds can I generate at once?",
        a: "5 or 10 seconds per run (selectable in Dream Machine settings). For longer videos use extend — continuation of the existing clip with a description of new content. Total limit is around 30 seconds, beyond that quality drops with each extension. Each extension is a separate prompt.",
      },
      {
        q: "How do keyframes work in Ray?",
        a: "Image-to-Video mode accepts a start frame (required) and an end frame (optional). The model generates the transition between them. With keyframes the aspect ratio is taken automatically from the image. Key rule: describe only what CHANGES between frames, don't re-describe static elements. This produces the smoothest motion.",
      },
      {
        q: "What is Modify mode?",
        a: "Modify (Video-to-Video) transforms existing video by prompt: changes style, lighting, environment, time of day. Three control levels: Adhere (1–3, preserves the original), Flex (1–3, balance), Reimagine (1–3, creative freedom). Describe the END STATE, not commands: «cyberpunk neon city at night» works; «change to cyberpunk» doesn't.",
      },
      {
        q: "Should I write prompts in languages other than English?",
        a: "No, Ray models are optimized for English and cinematic terminology. In other languages results are noticeably worse — the model loses the photographic and cinematographic anchors it responds to best. For production work always translate to English; for short experiments other languages are fine, but expect lower quality.",
      },
      {
        q: "Does Opten support Luma Ray?",
        a: "Yes, the Opten extension auto-detects models in the Ray family (Ray 1.x, Ray 2, Ray 3.14, Ray 3) and scores prompts by family-specific rules. It checks for absence of forbidden words and negative prompts, presence of mid-action verbs, concrete camera and light descriptions, and secondary motion. One click gives you a rewrite in the positive-only format with the correct structure.",
      },
    ],
  },
};
