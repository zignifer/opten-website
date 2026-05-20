// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for kling-3.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Kling 3.0: структура, ошибки, примеры",
    description:
      "Как писать промпты для Kling 3.0: Multi-shot до шести кадров, нативное аудио и диалоги с управлением тонами голоса, кинематографический язык и примеры.",
    h1: "Kling 3.0: как писать промпты, которые модель понимает",
    intro:
      "Kling 3.0 — флагманская видеомодель Kuaishou на klingai.com. Длительность до 15 секунд, Multi-shot до 6 шотов в одной генерации, нативная генерация диалогов и аудио с управлением тоном голоса, мультиязычные акценты и code-switching. Создана для понимания режиссёрского намерения, а не просто списка объектов.",
    sections: [
      {
        heading: "Что нового в Kling 3.0",
        body:
          "Kling 3.0 — крупный апгрейд видеомодели Kuaishou. Длительность одной генерации выросла с 10 до 15 секунд, что позволяет уместить реальное нарративное развитие. Главная фича версии — Multi-shot: до 6 шотов в одной генерации с автоматической вариацией ракурсов и сохранением нарративной непрерывности.\n\nНативная генерация аудио появилась впервые в семействе: диалоги с уникальным тоном голоса для каждого персонажа, эмбиент, музыка, SFX. Поддерживаются мультиязычные диалоги, акценты и code-switching внутри одной сцены. Модель отлично сохраняет идентичность, макет и даже текст из исходного изображения в I2V — критично для брендированного контента.",
        bullets: [
          "Длительность до 15 секунд (против 10 в Kling 2.6 Pro)",
          "Multi-shot: до 6 шотов с нарративной непрерывностью",
          "Нативное аудио: диалоги, эмбиент, музыка, SFX",
          "Мультиязычные диалоги с акцентами и code-switching",
          "Сохранение текста и логотипов из исходного изображения в I2V",
        ],
      },
      {
        heading: "Структура промпта как режиссёрский сценарий",
        body:
          "Kling 3.0 создан для понимания кинематографического намерения, а не просто визуальных описаний. Промпты должны быть написаны как режиссёрские указания, а не как список объектов.\n\nОптимальная структура: [Scene Setup + Atmosphere] + [Character Introduction] + [Action/Dialogue Sequence] + [Camera Direction] + [Audio/Sound Design]. Закрепляй персонажей в начале промпта и сохраняй их описания согласованными через все шоты — модель фиксирует черты персонажей, объектов и окружений.\n\nЯвно описывай движение камеры: «tracking», «following», «freezing», «panning», «moving in sync». Длинные дубли работают лучше, когда чётко описано, как камера соотносится с субъектом. Оптимальная длина 50–200 слов (длиннее для multi-shot).",
      },
      {
        heading: "Multi-shot: до 6 шотов в одной генерации",
        body:
          "Ключевая фича Kling 3.0. Multi-shot позволяет создать раскадровку из нескольких шотов в одной генерации с нарративной непрерывностью.\n\nФормула:\nMaster Prompt: [общее описание сцены]\nMulti shot Prompt 1: [описание шота 1] (Duration: Xс)\nMulti shot Prompt 2: [описание шота 2] (Duration: Xс)\n\nКаждый шот должен иметь свой кадр, действие и хронометраж. Master Prompt задаёт общий контекст. Модель автоматически варьирует ракурсы и композиции, сохраняя нарративную непрерывность между шотами. Поддерживаемые типы: profile shots, macro close-ups, tracking shots, POV, shot-reverse-shot для диалогов. Multi-shot без чёткой маркировки отдельных шотов — главный антипаттерн режима.",
      },
      {
        heading: "Диалоги с нативным аудио",
        body:
          "Kling 3.0 поддерживает генерацию диалогов с привязкой к персонажам. Четыре обязательных принципа:\n\nСтруктурное наименование: уникальные метки персонажей через весь промпт — `[Character A: Black-suited Agent]` и `[Character B: Female Assistant]`. Местоимения вместо меток («he says…») — антипаттерн.\n\nВизуальное якорение: физическое действие ДО реплики. «The agent slams his hand on the table. [Agent, angrily]: \"Where is the truth?\"»\n\nАудио-детали: уникальный тон и эмоции для каждого персонажа. «[Agent, raspy, deep voice]: \"Don't move.\" [Assistant, clear, fearful voice]: \"I'm scared.\"»\n\nТемпоральный контроль: связующие слова между репликами. «[Agent]: \"Why?\" Immediately, [Assistant]: \"Because it's time.\"» Без связки модель может слить реплики.",
      },
      {
        heading: "I2V в Kling 3.0 и сохранение идентичности",
        body:
          "Image-to-Video в Kling 3.0 особенно силён в сохранении идентичности — модель удерживает макет, черты лица и даже читаемый текст из исходного изображения. Это критично для рекламы и брендированного контента: логотипы, продуктовые этикетки, ключевая типографика не «дрейфуют» в анимации.\n\nПравила те же, что в других моделях Kling: входное изображение = якорь, промпт описывает ТОЛЬКО движение и эволюцию сцены, длина 20–40 слов. Формула: (Как сцена развивается из изображения) + (Субтильные движения) + (Камера) + (Изменения окружения). Описание того, что уже на изображении, — антипаттерн, ведущий к конфликтам.",
      },
    ],
    examples: [
      {
        before: "женщина на кухне ночью",
        after:
          "A dim kitchen late at night, warm tungsten light from overhead fixture casting long shadows. [Character A: Sarah, mid-30s woman in a worn flannel bathrobe, exhausted eyes, hair in a messy ponytail]. Sarah sets a ceramic plate down too hard on the granite counter. Sharp ceramic clink. She turns slowly from the sink, exhaustion evident in her posture. Camera holds steady medium shot at eye level, shallow depth of field with soft bokeh from the kitchen window behind her. Quiet ambient sound of a ticking wall clock, distant traffic muffled through the window.",
        note:
          "Полная структура: scene setup + atmosphere, закреплённый персонаж в начале, визуальное якорение перед звуком, камера отдельно от субъекта, аудио-дизайн (clink, ticking clock, traffic).",
      },
      {
        before: "Multi-shot: «джокер танцует на лестнице»",
        after:
          "Master Prompt: A theatrical figure begins his iconic dance descent down a long flight of concrete stairs in a moody urban setting at dusk, cinematic gritty atmosphere.\n\nMulti shot Prompt 1: A man in a vibrant red suit starts dancing at the top of the stairs, taking first exaggerated steps down, arms spreading wide, head tilting back in laughter, wide shot from below capturing the full silhouette against amber sky (Duration: 5 seconds).\n\nMulti shot Prompt 2: Continuing wild dance down concrete steps, spinning and kicking, coat tails flapping dramatically, reaching the bottom step with triumphant arms-raised pose, medium tracking shot following from the side with smooth dolly motion (Duration: 5 seconds).",
        note:
          "Multi-shot в чистом виде: Master Prompt задаёт общий контекст, два маркированных шота с собственным кадрированием, действием и хронометражом.",
      },
      {
        before: "диалог между агентом и помощницей",
        after:
          "A tense interrogation room with single overhead bulb casting harsh shadows. [Character A: Agent, black-suited man in his 40s with closely-cropped grey hair]. [Character B: Assistant, young woman in a beige sweater, nervous expression]. The agent slams his hand on the metal table, the impact echoes sharply. [Agent, raspy deep voice, cold]: \"Where is the truth?\" The assistant flinches, looks down at her trembling hands. Immediately, [Assistant, clear fearful voice]: \"I told you everything I know.\" Camera holds tight medium shot, shallow depth of field, dim tungsten lighting with hard shadows.",
        note:
          "Диалог по всем правилам: уникальные метки персонажей, визуальное действие перед каждой репликой, тональные дескрипторы для голоса, связующее слово «Immediately» между репликами.",
      },
    ],
    mistakes: [
      {
        title: "Местоимения вместо меток персонажей в диалогах",
        explain:
          "«He says...», «Then she replies...» — модель не знает, кто говорит, и сливает реплики или меняет голос между ними. Используй уникальные структурные метки `[Character A: description]` и `[Character B: description]` через весь промпт. Каждая реплика — с явной меткой персонажа.",
      },
      {
        title: "Multi-shot без маркировки отдельных шотов",
        explain:
          "Если описать несколько сцен подряд без маркеров `Multi shot Prompt 1:`, `Multi shot Prompt 2:`, модель воспринимает это как один длинный шот и путается в переходах. Каждый шот — отдельный блок с собственным кадрированием, действием и хронометражом.",
      },
      {
        title: "Диалоги без визуального якорения",
        explain:
          "Если сначала идёт реплика, а потом действие — «[Agent]: \"Where is the truth?\" The agent slams the table» — модель часто рассинхронизирует звук и движение. Правильно: физическое действие ДО реплики. Это даёт модели понятную аудио-визуальную привязку.",
      },
      {
        title: "Диалоги без тональных дескрипторов",
        explain:
          "«[Agent]: \"Don't move\"» без тональной информации — голос будет нейтральным, как у TTS-движка. Добавляй характеристики голоса: «[Agent, raspy deep voice, threatening]: \"Don't move\"». Это раскрывает преимущество нативного аудио Kling 3.0 — управление эмоциями и тоном.",
      },
      {
        title: "Описание сцены в I2V-промпте",
        explain:
          "Как и в других моделях Kling, в Image-to-Video модель уже видит изображение и сохраняет его макет, текст и идентичность. Описание внешности или окружения внутри I2V-промпта конфликтует с реальной картинкой. Длина 20–40 слов, описывать ТОЛЬКО движение и эволюцию сцены.",
      },
    ],
    faq: [
      {
        q: "Чем Kling 3.0 отличается от Kling 2.6 Pro?",
        a: "Три главных апгрейда: длительность выросла с 10 до 15 секунд, появился Multi-shot (до 6 шотов в одной генерации), и добавилась нативная генерация диалогов и аудио с управлением тоном голоса. Для коротких продуктовых клипов без речи 2.6 Pro по-прежнему оптимален. Для нарративов с диалогами, multi-shot композиций и брендированного контента с аудио — выбирай 3.0.",
      },
      {
        q: "Как работает Multi-shot?",
        a: "Multi-shot позволяет в одной генерации создать до 6 шотов с нарративной непрерывностью. Структура: Master Prompt задаёт общий контекст сцены, затем идут пронумерованные блоки Multi shot Prompt 1, 2, ... с описанием кадрирования, действия и хронометража каждого. Модель автоматически сохраняет персонажей и среду между шотами и варьирует ракурсы. Без чёткой маркировки шотов режим работает некорректно.",
      },
      {
        q: "Как генерировать диалоги в Kling 3.0?",
        a: "Четыре обязательных принципа: уникальные метки персонажей `[Character A: description]`, визуальное действие ДО реплики, тональные дескрипторы голоса в скобках перед текстом «[Agent, raspy deep voice]:», и связующие слова между репликами («Immediately», «After a pause»). Без хотя бы одного из четырёх компонентов модель сливает реплики или теряет эмоциональную окраску.",
      },
      {
        q: "Поддерживается ли русский в диалогах?",
        a: "Да, Kling 3.0 поддерживает мультиязычные диалоги, включая русский, акценты и code-switching внутри одной сцены — персонаж может говорить на двух языках попеременно. Для самого промпта (инструкций модели) лучше использовать английский, но реплики персонажей могут быть на любом поддерживаемом языке в кавычках.",
      },
      {
        q: "Сколько кадров оптимально для Multi-shot?",
        a: "Технический потолок — 6 шотов. На практике 2–4 шота дают лучший результат: модель легче удерживает нарративную непрерывность, персонажи и среда консистентны. 5–6 шотов работают для более сложных раскадровок, но требуют детального Master Prompt и согласованного описания персонажей через все шоты. Каждому шоту — свой хронометраж в формате (Duration: Xс).",
      },
      {
        q: "Чем I2V в Kling 3.0 лучше предыдущих версий?",
        a: "Главное улучшение — сохранение идентичности и читаемого текста из исходного изображения. Логотипы, продуктовые этикетки, надписи и ключевая типографика не «дрейфуют» в анимации. Для брендированной рекламы это критично. Промпт по-прежнему описывает ТОЛЬКО движение и эволюцию сцены (20–40 слов), не повторяя того, что уже видно на картинке.",
      },
      {
        q: "Поддерживается ли Opten для Kling 3.0?",
        a: "Да, расширение Opten автоматически распознаёт Kling 3.0 и все его специфичные режимы (Multi-shot, диалоговые сцены, I2V) внутри klingai.com. Для диалогов проверяется наличие меток персонажей, визуальных якорей, тональных дескрипторов и связующих слов. Для Multi-shot — маркировка отдельных шотов и хронометраж. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Kling 3.0 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Kling 3.0: Multi-shot up to 6 shots, native audio and dialogue, director's language, common mistakes, and before/after examples.",
    h1: "Kling 3.0: how to write prompts the model actually understands",
    intro:
      "Kling 3.0 is Kuaishou's flagship video model on klingai.com. Duration up to 15 seconds, Multi-shot with up to 6 shots in one generation, native dialogue and audio generation with voice-tone control, multilingual accents, and code-switching. Built to understand directorial intent, not just an object list.",
    sections: [
      {
        heading: "What's new in Kling 3.0",
        body:
          "Kling 3.0 is a major upgrade to Kuaishou's video model. Single-generation length grew from 10 to 15 seconds, enough for real narrative progression. The headline feature is Multi-shot: up to 6 shots in one generation with automatic angle variation and preserved narrative continuity.\n\nNative audio generation appears for the first time in the family: dialogue with a unique voice tone per character, ambient sound, music, SFX. Multilingual dialogue is supported, with accents and code-switching inside a single scene. The model excellently preserves identity, layout, and even text from the source image in I2V — critical for branded content.",
        bullets: [
          "Duration up to 15 seconds (vs 10 in Kling 2.6 Pro)",
          "Multi-shot: up to 6 shots with narrative continuity",
          "Native audio: dialogue, ambient, music, SFX",
          "Multilingual dialogue with accents and code-switching",
          "Text and logos from the source image preserved in I2V",
        ],
      },
      {
        heading: "Prompt structure as a director's script",
        body:
          "Kling 3.0 is built to understand cinematic intent, not just visual descriptions. Prompts should be written as directorial instructions, not as an object list.\n\nOptimal structure: [Scene Setup + Atmosphere] + [Character Introduction] + [Action/Dialogue Sequence] + [Camera Direction] + [Audio/Sound Design]. Anchor characters at the start of the prompt and keep their descriptions consistent across all shots — the model locks in character, object, and environment traits.\n\nDescribe camera motion explicitly: «tracking», «following», «freezing», «panning», «moving in sync». Long takes work better when the camera's relationship to the subject is clearly described. Sweet-spot length 50–200 words (longer for multi-shot).",
      },
      {
        heading: "Multi-shot: up to 6 shots in one generation",
        body:
          "The key feature of Kling 3.0. Multi-shot enables a multi-shot storyboard in one generation with narrative continuity.\n\nFormula:\nMaster Prompt: [overall scene description]\nMulti shot Prompt 1: [shot 1 description] (Duration: Xs)\nMulti shot Prompt 2: [shot 2 description] (Duration: Xs)\n\nEach shot must have its own framing, action, and duration. The Master Prompt sets the overall context. The model automatically varies angles and composition while preserving narrative continuity between shots. Supported types: profile shots, macro close-ups, tracking shots, POV, shot-reverse-shot for dialogue. Multi-shot without clear shot markers is the mode's main anti-pattern.",
      },
      {
        heading: "Dialogue with native audio",
        body:
          "Kling 3.0 supports character-anchored dialogue generation. Four required principles:\n\nStructural naming: unique character labels throughout the prompt — `[Character A: Black-suited Agent]` and `[Character B: Female Assistant]`. Pronouns instead of labels («he says…») are an anti-pattern.\n\nVisual anchoring: physical action BEFORE the line. «The agent slams his hand on the table. [Agent, angrily]: \"Where is the truth?\"»\n\nAudio details: a unique tone and emotion per character. «[Agent, raspy, deep voice]: \"Don't move.\" [Assistant, clear, fearful voice]: \"I'm scared.\"»\n\nTemporal control: linking words between lines. «[Agent]: \"Why?\" Immediately, [Assistant]: \"Because it's time.\"» Without a connector, the model can merge lines.",
      },
      {
        heading: "I2V in Kling 3.0 and identity preservation",
        body:
          "Image-to-Video in Kling 3.0 is especially strong at preserving identity — the model holds layout, facial features, and even legible text from the source image. Critical for advertising and branded content: logos, product labels, and key typography don't «drift» in animation.\n\nThe rules are the same as in other Kling models: the input image is the anchor, the prompt describes ONLY motion and scene evolution, length 20–40 words. Formula: (How the scene develops from the image) + (Subtle motions) + (Camera) + (Environmental changes). Describing what's already in the image is an anti-pattern that causes conflicts.",
      },
    ],
    examples: [
      {
        before: "woman in a kitchen at night",
        after:
          "A dim kitchen late at night, warm tungsten light from overhead fixture casting long shadows. [Character A: Sarah, mid-30s woman in a worn flannel bathrobe, exhausted eyes, hair in a messy ponytail]. Sarah sets a ceramic plate down too hard on the granite counter. Sharp ceramic clink. She turns slowly from the sink, exhaustion evident in her posture. Camera holds steady medium shot at eye level, shallow depth of field with soft bokeh from the kitchen window behind her. Quiet ambient sound of a ticking wall clock, distant traffic muffled through the window.",
        note:
          "Full structure: scene setup + atmosphere, an anchored character up front, visual anchoring before sound, camera described separately from subject, audio design (clink, ticking clock, traffic).",
      },
      {
        before: "Multi-shot: «joker dances down stairs»",
        after:
          "Master Prompt: A theatrical figure begins his iconic dance descent down a long flight of concrete stairs in a moody urban setting at dusk, cinematic gritty atmosphere.\n\nMulti shot Prompt 1: A man in a vibrant red suit starts dancing at the top of the stairs, taking first exaggerated steps down, arms spreading wide, head tilting back in laughter, wide shot from below capturing the full silhouette against amber sky (Duration: 5 seconds).\n\nMulti shot Prompt 2: Continuing wild dance down concrete steps, spinning and kicking, coat tails flapping dramatically, reaching the bottom step with triumphant arms-raised pose, medium tracking shot following from the side with smooth dolly motion (Duration: 5 seconds).",
        note:
          "Pure Multi-shot: Master Prompt sets the overall context, two marked shots with their own framing, action, and duration.",
      },
      {
        before: "dialogue between an agent and an assistant",
        after:
          "A tense interrogation room with a single overhead bulb casting harsh shadows. [Character A: Agent, black-suited man in his 40s with closely-cropped grey hair]. [Character B: Assistant, young woman in a beige sweater, nervous expression]. The agent slams his hand on the metal table, the impact echoes sharply. [Agent, raspy deep voice, cold]: \"Where is the truth?\" The assistant flinches, looks down at her trembling hands. Immediately, [Assistant, clear fearful voice]: \"I told you everything I know.\" Camera holds tight medium shot, shallow depth of field, dim tungsten lighting with hard shadows.",
        note:
          "Dialogue by all the rules: unique character labels, visual action before each line, tonal voice descriptors, the linking word «Immediately» between lines.",
      },
    ],
    mistakes: [
      {
        title: "Pronouns instead of character labels in dialogue",
        explain:
          "«He says…», «Then she replies…» — the model doesn't know who's speaking and merges lines or changes voice between them. Use unique structural labels `[Character A: description]` and `[Character B: description]` throughout the prompt. Every line gets an explicit character label.",
      },
      {
        title: "Multi-shot without marking individual shots",
        explain:
          "Describing several scenes in a row without `Multi shot Prompt 1:`, `Multi shot Prompt 2:` markers makes the model treat it as one long shot and stumble on transitions. Each shot needs to be a separate block with its own framing, action, and duration.",
      },
      {
        title: "Dialogue without visual anchoring",
        explain:
          "If the line comes first and the action after — «[Agent]: \"Where is the truth?\" The agent slams the table» — the model often desyncs sound and motion. Correct order: physical action BEFORE the line. This gives the model a clear audio-visual anchor.",
      },
      {
        title: "Dialogue without tonal descriptors",
        explain:
          "«[Agent]: \"Don't move\"» without tonal info delivers a flat TTS-like voice. Add voice characteristics: «[Agent, raspy deep voice, threatening]: \"Don't move\"». This unlocks Kling 3.0's native-audio advantage — emotional and tonal control.",
      },
      {
        title: "Describing the scene in an I2V prompt",
        explain:
          "As in other Kling models, in Image-to-Video the model already sees the image and preserves its layout, text, and identity. Describing appearance or setting inside an I2V prompt conflicts with the actual picture. Length 20–40 words, ONLY motion and scene evolution.",
      },
    ],
    faq: [
      {
        q: "How is Kling 3.0 different from Kling 2.6 Pro?",
        a: "Three key upgrades: duration grew from 10 to 15 seconds, Multi-shot appeared (up to 6 shots in one generation), and native dialogue and audio generation with voice-tone control was added. For short product clips without speech, 2.6 Pro remains optimal. For dialogue narratives, multi-shot compositions, and branded content with audio, choose 3.0.",
      },
      {
        q: "How does Multi-shot work?",
        a: "Multi-shot lets you create up to 6 shots in one generation with narrative continuity. Structure: the Master Prompt sets the overall scene context, then numbered Multi shot Prompt 1, 2, ... blocks describe framing, action, and duration for each. The model automatically preserves characters and setting across shots and varies angles. Without clear shot markers the mode misbehaves.",
      },
      {
        q: "How do I generate dialogue in Kling 3.0?",
        a: "Four required principles: unique character labels `[Character A: description]`, visual action BEFORE the line, tonal voice descriptors in brackets before the text «[Agent, raspy deep voice]:», and linking words between lines («Immediately», «After a pause»). Skipping any of the four causes merged lines or lost emotional color.",
      },
      {
        q: "Are languages other than English supported in dialogue?",
        a: "Yes, Kling 3.0 supports multilingual dialogue including Russian, accents, and code-switching within a single scene — a character can switch between two languages. For the prompt itself (instructions to the model) English is best, but character lines can be in any supported language in quotes.",
      },
      {
        q: "How many shots are optimal for Multi-shot?",
        a: "The technical ceiling is 6 shots. In practice 2–4 shots give the best results: the model holds narrative continuity more easily, with characters and setting consistent. 5–6 shots work for more complex storyboards but require a detailed Master Prompt and consistent character descriptions across all shots. Each shot gets its own duration in (Duration: Xs) format.",
      },
      {
        q: "How is I2V in Kling 3.0 better than previous versions?",
        a: "The main improvement is identity and legible-text preservation from the source image. Logos, product labels, captions, and key typography don't «drift» in animation. Critical for branded advertising. The prompt still describes ONLY motion and scene evolution (20–40 words), without repeating what's already visible in the image.",
      },
      {
        q: "Does Opten support Kling 3.0?",
        a: "Yes, the Opten extension auto-detects Kling 3.0 and all its specific modes (Multi-shot, dialogue scenes, I2V) inside klingai.com. For dialogue it checks for character labels, visual anchors, tonal descriptors, and linking words. For Multi-shot — shot markers and durations. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
