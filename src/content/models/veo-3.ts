// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for veo-3.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Veo 3: структура, ошибки, примеры",
    description:
      "Как писать промпты для Google Veo 3 с нативным аудио: диалоги через двоеточие, фоновые звуки, тег «no subtitles», частые ошибки и примеры до и после кадра.",
    h1: "Veo 3: как писать промпты, которые модель понимает",
    intro:
      "Veo 3 — первая модель Google DeepMind с нативной генерацией аудио вместе с видео: диалоги, фоновые звуки, музыка, SFX. Клипы ~8 секунд, разрешение 720p, формат 16:9. Промпт обязательно описывает звуковую составляющую, иначе модель додумает её сама и часто неудачно. Английский даёт самые стабильные результаты.",
    sections: [
      {
        heading: "Что нового в Veo 3",
        body:
          "Главное отличие Veo 3 от предыдущих версий — нативная генерация аудио. Каждое видео создаётся со звуком: диалоги персонажей, фоновые звуки окружения, звуковые эффекты привязанные к действиям, фоновая музыка под настроение. Это меняет логику промптинга: молчать о звуке нельзя — модель всё равно его сгенерирует, и часто не то, что нужно.\n\nДругие характеристики: длительность около 8 секунд, базовое разрешение 720p (1280×720), формат 16:9, стандартный FPS. Лимит промпта около 1500 символов. Очень высокая консистентность: один и тот же промпт даёт почти идентичные результаты даже с разными seed — для вариаций нужно менять сам промпт, а не перегенерировать.",
        bullets: [
          "Нативная генерация аудио — диалоги, фон, SFX, музыка",
          "Клипы ~8 секунд, разрешение 720p, формат 16:9",
          "Лимит промпта ~1500 символов",
          "Очень высокая консистентность — для вариаций меняй промпт",
          "Платформы: Google AI Studio, Vertex AI, Replicate, Flow",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Subject + Appearance] + [Context/Scene] + [Action] + [Camera Movement] + [Style/Mood] + [Lighting] + [Dialogue/Audio].\n\nКлючевая особенность: блок аудио обязателен. Без него модель додумает звук случайно — самый частый артефакт это «studio audience laughter», смех аудитории как в ситкоме, который появляется в драматичных сценах с несколькими персонажами.\n\nПример сильного промпта: «A man in his 40s with short brown hair, wearing a blue jacket, sits at a podcast desk in a dimly lit studio. He leans into the microphone and says: My name is Ben, and today we're talking about why most startups fail in year two. Camera: medium close-up, static. Lighting: warm key from a desk lamp, cool rim from a monitor. Background Sound: faint room tone, soft electronic hum. (no subtitles!)»",
      },
      {
        heading: "Диалоги: двоеточие, не кавычки",
        body:
          "Veo 3 поддерживает два подхода к диалогам:\n\nЯвный (explicit) — точный текст после двоеточия: «A guy says: My name is Ben». Используй для точного контроля произносимых слов.\n\nНеявный (implicit) — описание того, что персонаж говорит: «A guy tells us his name». Используй, когда модель может сама придумать реплику.\n\nКритично важно: пиши диалог через двоеточие, не в кавычках. `says: My name is Ben` работает лучше, чем `says \"My name is Ben\"` — кавычки провоцируют модель сгенерировать вшитые субтитры внизу кадра, часто с ошибками. Добавляй `(no subtitles!)` в конец промпта для надёжности. При нескольких персонажах чётко указывай, кто говорит: «The woman in pink says: ... The man with glasses replies: ...».",
      },
      {
        heading: "Фоновые звуки и музыка",
        body:
          "Если в промпте есть персонажи, но не описан фон — Veo 3 заполнит тишину автоматически, и часто неуместно. Типичный артефакт: «studio audience laughter» в драматичной сцене, случайный saxophone в спокойной обстановке, шум аудитории как в ситкоме. Лечение — всегда явно описывай фоновые звуки:\n\n«sounds of distant bands, noisy crowd, ambient background of a busy festival field»\n«ambient sounds of rain on windows, distant thunder, soft piano music»\n«faint room tone, soft electronic hum, ticking wall clock»\n\nДля музыки указывай жанр, настроение и стиль: «a tense cinematic score plays in the background», «a cheerful upbeat pop melody», «a melancholic orchestral score swells». Даже простое «no background music, ambient room tone only» работает лучше тишины.",
      },
      {
        heading: "Длина диалога, произношение, селфи-стиль",
        body:
          "Длина диалога должна умещаться в ~8 секунд произнесения. Слишком длинный текст — модель говорит неестественно быстро, без пауз и интонации. Слишком короткий диалог (1-2 слова) — модель заполняет оставшееся время AI-бормотанием и невнятным шумом. Целься в 12-25 слов на 8-секундный клип.\n\nДля сложных слов и имён используй фонетическую запись: «foh-fur» вместо «fofr» — модель произнесёт правильно. Veo 3 — отлично работает в selfie-стиле: начинай с «A selfie video of...», укажи видимую руку («holds the camera at arm's length, arm clearly visible in frame») и естественные движения глаз. Добавляй «slightly grainy, film-like image» — убирает синтетическую AI-чистоту.\n\nКонсистентность персонажей: Veo 3 при идентичном промпте даёт почти идентичного персонажа. Используй детальное повторяемое описание в каждой генерации: «John, a man in his 40s with short brown hair, wearing a blue jacket and glasses, looking thoughtful». Чем уникальнее описание, тем стабильнее консистентность между сценами.",
      },
    ],
    examples: [
      {
        before: "a man talking to camera about his startup",
        after:
          "A man in his 40s with short brown hair and a closely trimmed beard, wearing a navy blue jacket over a grey t-shirt, sits at a podcast desk in a dimly lit studio. He leans toward the microphone and says: My name is Ben, and today we're talking about why most startups fail in year two. Camera: medium close-up, static, slight handheld micro-shake. Lighting: warm key from a desk lamp on screen-left, cool rim from a monitor behind. Mood: intimate, thoughtful. Background Sound: faint room tone, soft electronic hum from the equipment. (no subtitles!)",
        note:
          "Детальный субъект для консистентности, диалог через двоеточие (не кавычки), явный фоновый звук, добавлено «(no subtitles!)».",
      },
      {
        before: "a woman walking through a market",
        after:
          "A young woman with long auburn hair tied in a low ponytail, wearing a green linen dress and a straw hat, walks through a bustling outdoor farmers market on a sunny Saturday morning. She picks up an apple, examines it, and smiles. Camera: medium tracking shot following her from the side, slow steadicam motion. Lighting: golden hour natural sunlight, warm tones. Mood: warm, casual, observational. Background Sound: lively crowd chatter, distant vendor calls, faint acoustic guitar playing somewhere nearby, occasional bird song. No background music — just ambient market sounds.",
        note:
          "Конкретный субъект, явное действие с глаголами, движение камеры, цветовая характеристика, обязательно прописан фоновый звук с уточнением «no background music».",
      },
      {
        before: "a selfie video of someone in nature",
        after:
          "A selfie video of a young man with messy brown hair and a denim jacket, hiking along a misty mountain trail at dawn. He holds the camera at arm's length, arm clearly visible in frame, occasionally looking into the lens with an excited grin. Background: pine trees, low fog, soft mountain silhouettes. Lighting: soft diffused dawn light, cool blue palette with warm spill from his face. Style: slightly grainy, film-like, vlog aesthetic. He says: I can't believe how quiet it is up here. Background Sound: distant bird calls, soft wind through pine needles, the crunch of his footsteps on gravel. (no subtitles!)",
        note:
          "Полная selfie-структура: видимая рука, естественные движения, реплика через двоеточие, явный звуковой фон с тремя слоями, «slightly grainy» против AI-чистоты.",
      },
    ],
    mistakes: [
      {
        title: "Диалог в кавычках вместо двоеточия",
        explain:
          "`says \"hello\"` провоцирует модель сгенерировать вшитые субтитры внизу кадра — часто с ошибками в словах и плохой кириллицей. Используй формат `says: hello` через двоеточие и добавь `(no subtitles!)` в конце. Если субтитры всё равно появляются, повтори: «No subtitles. No subtitles!» — для надёжности.",
      },
      {
        title: "Отсутствие описания фоновых звуков",
        explain:
          "Если в сцене есть персонажи, но фон не описан — Veo 3 додумает звук случайно. Самый частый артефакт: «studio audience laughter», смех аудитории как в ситкоме в любой сцене с несколькими людьми. Лечение — всегда явно прописывай Background Sound, даже простое «faint room tone, ambient hum» убирает проблему.",
      },
      {
        title: "Слишком длинный или слишком короткий диалог",
        explain:
          "Диалог на 50 слов в 8-секундном клипе — модель говорит неестественно быстро, проглатывает паузы и интонации. Диалог из 1-2 слов — модель заполняет оставшееся время AI-бормотанием. Целься в 12-25 слов на 8 секунд, оставляй естественные паузы и эмоциональные акценты.",
      },
      {
        title: "Перегенерация одного промпта вместо его изменения",
        explain:
          "Veo 3 очень консистентен — идентичный промпт даёт почти идентичный результат даже с разными seed. Если хочешь вариации, нужно МЕНЯТЬ промпт, а не перегенерировать. Добавь другой объектив, измени освещение, поменяй цветовую палитру — это даст реальные вариации. Перегенерация одного и того же текста — пустая трата токенов.",
      },
      {
        title: "Попытка вертикального формата",
        explain:
          "Veo 3 нативно генерирует только 16:9 — горизонтальный формат. Указание «vertical video» или «9:16» в промпте игнорируется. Для вертикального контента используй Veo 3.1 (там 9:16 поддерживается нативно) или обрезай в постобработке. В промпте Veo 3 не указывай формат — это лишний шум.",
      },
    ],
    faq: [
      {
        q: "Чем Veo 3 отличается от Veo 2?",
        a: "Главное отличие — нативная генерация аудио. Veo 2 выдавал немое видео, Veo 3 генерирует диалоги, фоновые звуки, SFX и музыку вместе с видеорядом. Это меняет логику промптинга: блок аудио теперь обязателен, иначе модель додумывает звук сама и часто неудачно. Базовое качество и разрешение остались на уровне 720p, формат 16:9.",
      },
      {
        q: "Как избежать вшитых субтитров в кадре?",
        a: "Три приёма работают вместе. Пиши диалоги через двоеточие, не в кавычках: `says: hello` вместо `says \"hello\"`. Добавляй `(no subtitles!)` в конец промпта. Если субтитры всё равно появляются — повтори несколько раз: «No subtitles. No subtitles!». Кавычки — главный триггер субтитров, двоеточие модель воспринимает как реплику без визуального отображения.",
      },
      {
        q: "Почему модель добавляет смех аудитории, которого я не просил?",
        a: "Это типичный артефакт Veo 3, когда в сцене есть несколько персонажей, но фоновый звук не описан явно. Модель «помнит», что в видео с людьми обычно есть какой-то фон, и додумывает «studio audience laughter» как самый частый паттерн из тренировочных данных. Лечение — всегда явно прописывай Background Sound, даже один ритмический звук убирает проблему.",
      },
      {
        q: "Можно ли писать диалоги на русском?",
        a: "Технически да — Veo 3 произносит русские слова, но качество заметно ниже, чем на английском: возможны искажения произношения, странная интонация, проблемы с длинными словами. Для production-задач рекомендуется английский диалог. Если нужен русский — используй фонетическую запись сложных слов и тестируй на коротких фразах перед длинными сценами.",
      },
      {
        q: "Какая длина диалога оптимальна для 8-секундного клипа?",
        a: "Примерно 12-25 слов. Меньше — модель заполняет паузы AI-бормотанием. Больше — говорит неестественно быстро, без интонаций. Идеальный паттерн: короткая фраза-вступление, основная мысль, короткое завершение. Например: «So, here's the thing. Most startups fail in year two because they scale too fast. It's not the product, it's the timing.»",
      },
      {
        q: "Как добиться консистентности персонажа между сценами?",
        a: "Veo 3 при идентичном промпте даёт почти идентичного персонажа — используй это. Создай детальное описание: «John, a man in his 40s with short brown hair and a closely trimmed beard, wearing a navy blue jacket over a grey t-shirt, looking thoughtful». Повторяй это описание дословно в каждой генерации. Чем уникальнее набор деталей, тем стабильнее консистентность.",
      },
      {
        q: "Поддерживается ли Opten для Veo 3?",
        a: "Да, расширение Opten распознаёт Veo 3 на платформах Google AI Studio, Vertex AI, Replicate и Flow и оценивает промпты по структуре, описанной выше: проверяет наличие блока аудио, формат диалогов через двоеточие, тег «(no subtitles!)», описание фоновых звуков, разумную длину диалога. Одним кликом можно получить rewrite с правильной структурой.",
      },
    ],
  },
  en: {
    title: "Veo 3 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google Veo 3 with native audio: dialogue via colon, background sounds, «no subtitles», common mistakes, and before/after examples.",
    h1: "Veo 3: how to write prompts the model actually understands",
    intro:
      "Veo 3 is the first Google DeepMind model to generate audio natively together with video: dialogue, background sounds, music, SFX. Clips are around 8 seconds, resolution 720p, format 16:9. The prompt must describe the audio layer — otherwise the model invents it and often badly. English gives the most stable results.",
    sections: [
      {
        heading: "What is new in Veo 3",
        body:
          "The headline change in Veo 3 versus prior versions is native audio generation. Every video ships with sound: character dialogue, ambient background, action-tied SFX, and mood music. This changes prompting: you cannot stay silent about sound — the model will generate it anyway, and often not what you wanted.\n\nOther specs: roughly 8-second duration, base resolution 720p (1280×720), 16:9 format, standard FPS. Prompt limit around 1500 characters. Very high consistency: the same prompt yields nearly identical results even across seeds — for variation you have to change the prompt itself, not re-roll.",
        bullets: [
          "Native audio — dialogue, ambience, SFX, music",
          "Clips ~8 seconds, 720p, 16:9 format",
          "Prompt limit ~1500 characters",
          "Very high consistency — change the prompt to get variation",
          "Platforms: Google AI Studio, Vertex AI, Replicate, Flow",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject + Appearance] + [Context/Scene] + [Action] + [Camera Movement] + [Style/Mood] + [Lighting] + [Dialogue/Audio].\n\nThe key trait: the audio block is mandatory. Without it the model invents sound randomly — the most common artifact is «studio audience laughter» that drops into dramatic scenes with several characters.\n\nExample of a strong prompt: «A man in his 40s with short brown hair, wearing a blue jacket, sits at a podcast desk in a dimly lit studio. He leans into the microphone and says: My name is Ben, and today we're talking about why most startups fail in year two. Camera: medium close-up, static. Lighting: warm key from a desk lamp, cool rim from a monitor. Background Sound: faint room tone, soft electronic hum. (no subtitles!)»",
      },
      {
        heading: "Dialogue: colon, not quotes",
        body:
          "Veo 3 accepts two approaches to dialogue:\n\nExplicit — exact text after a colon: «A guy says: My name is Ben». Use this for precise control over spoken words.\n\nImplicit — a description of what the character is saying: «A guy tells us his name». Use this when the model can invent the line itself.\n\nCritical: write dialogue via colon, not in quotes. `says: My name is Ben` works better than `says \"My name is Ben\"` — quotes push the model to render embedded subtitles at the bottom of the frame, often with typos. Add `(no subtitles!)` at the end of the prompt as a safeguard. With multiple characters state clearly who is speaking: «The woman in pink says: ... The man with glasses replies: ...».",
      },
      {
        heading: "Background sounds and music",
        body:
          "If the prompt has characters but the background is not described, Veo 3 fills the silence on its own, often inappropriately. The classic artifact: «studio audience laughter» in a dramatic scene, a random saxophone in a quiet setting, sitcom-style crowd noise. The fix — always state background sounds explicitly:\n\n«sounds of distant bands, noisy crowd, ambient background of a busy festival field»\n«ambient sounds of rain on windows, distant thunder, soft piano music»\n«faint room tone, soft electronic hum, ticking wall clock»\n\nFor music, specify genre, mood, and style: «a tense cinematic score plays in the background», «a cheerful upbeat pop melody», «a melancholic orchestral score swells». Even a plain «no background music, ambient room tone only» works better than silence.",
      },
      {
        heading: "Dialogue length, pronunciation, selfie style",
        body:
          "Dialogue length must fit into about 8 seconds of speech. Too long — the model speaks unnaturally fast, dropping pauses and intonation. Too short (1-2 words) — the model fills the rest of the time with AI mumbling. Aim for 12-25 words per 8-second clip.\n\nFor tricky words and names use phonetic spelling: «foh-fur» instead of «fofr» — the model pronounces it correctly. Veo 3 is excellent at selfie style: start with «A selfie video of...», state the visible arm («holds the camera at arm's length, arm clearly visible in frame»), and add natural eye motion. Add «slightly grainy, film-like image» — it strips the synthetic AI cleanliness.\n\nCharacter consistency: with an identical prompt Veo 3 produces a nearly identical character. Use a detailed, repeated description in every generation: «John, a man in his 40s with short brown hair, wearing a blue jacket and glasses, looking thoughtful». The more unique the description, the more stable the consistency across scenes.",
      },
    ],
    examples: [
      {
        before: "a man talking to camera about his startup",
        after:
          "A man in his 40s with short brown hair and a closely trimmed beard, wearing a navy blue jacket over a grey t-shirt, sits at a podcast desk in a dimly lit studio. He leans toward the microphone and says: My name is Ben, and today we're talking about why most startups fail in year two. Camera: medium close-up, static, slight handheld micro-shake. Lighting: warm key from a desk lamp on screen-left, cool rim from a monitor behind. Mood: intimate, thoughtful. Background Sound: faint room tone, soft electronic hum from the equipment. (no subtitles!)",
        note:
          "Detailed subject for consistency, dialogue via colon (not quotes), explicit background sound, «(no subtitles!)» appended.",
      },
      {
        before: "a woman walking through a market",
        after:
          "A young woman with long auburn hair tied in a low ponytail, wearing a green linen dress and a straw hat, walks through a bustling outdoor farmers market on a sunny Saturday morning. She picks up an apple, examines it, and smiles. Camera: medium tracking shot following her from the side, slow steadicam motion. Lighting: golden hour natural sunlight, warm tones. Mood: warm, casual, observational. Background Sound: lively crowd chatter, distant vendor calls, faint acoustic guitar playing somewhere nearby, occasional bird song. No background music — just ambient market sounds.",
        note:
          "Concrete subject, explicit action with verbs, camera motion, color character, background sound written out with a «no background music» caveat.",
      },
      {
        before: "a selfie video of someone in nature",
        after:
          "A selfie video of a young man with messy brown hair and a denim jacket, hiking along a misty mountain trail at dawn. He holds the camera at arm's length, arm clearly visible in frame, occasionally looking into the lens with an excited grin. Background: pine trees, low fog, soft mountain silhouettes. Lighting: soft diffused dawn light, cool blue palette with warm spill from his face. Style: slightly grainy, film-like, vlog aesthetic. He says: I can't believe how quiet it is up here. Background Sound: distant bird calls, soft wind through pine needles, the crunch of his footsteps on gravel. (no subtitles!)",
        note:
          "Full selfie structure: visible arm, natural eye motion, a line via colon, layered background sound, «slightly grainy» counteracts AI cleanliness.",
      },
    ],
    mistakes: [
      {
        title: "Dialogue in quotes instead of with a colon",
        explain:
          "`says \"hello\"` pushes the model to generate embedded subtitles at the bottom of the frame — often with typos and bad accent rendering. Use the `says: hello` format with a colon and append `(no subtitles!)` at the end. If subtitles still appear, repeat: «No subtitles. No subtitles!» — for reliability.",
      },
      {
        title: "No background sound described",
        explain:
          "If the scene has characters but no background is described, Veo 3 invents the audio randomly. The most common artifact: «studio audience laughter» — sitcom-style crowd noise in any scene with multiple people. The fix — always state Background Sound explicitly, even a simple «faint room tone, ambient hum» removes the problem.",
      },
      {
        title: "Dialogue too long or too short",
        explain:
          "A 50-word line in an 8-second clip — the model speaks unnaturally fast, swallowing pauses and intonation. A 1-2 word line — the model fills the rest of the time with AI mumbling. Aim for 12-25 words per 8 seconds, leave natural pauses and emotional beats.",
      },
      {
        title: "Re-rolling the same prompt instead of changing it",
        explain:
          "Veo 3 is very consistent — an identical prompt yields a nearly identical result even with different seeds. To get variation you have to CHANGE the prompt, not re-roll. Add a different lens, change the lighting, swap the palette — that produces real variation. Re-rolling the same text is wasted tokens.",
      },
      {
        title: "Trying to get vertical format",
        explain:
          "Veo 3 natively generates 16:9 only — horizontal format. «Vertical video» or «9:16» in the prompt is ignored. For vertical content use Veo 3.1 (9:16 is native there) or crop in post. Do not specify format in a Veo 3 prompt — it is just noise.",
      },
    ],
    faq: [
      {
        q: "How is Veo 3 different from Veo 2?",
        a: "The main difference is native audio generation. Veo 2 produced silent video; Veo 3 generates dialogue, ambient sounds, SFX, and music together with the video track. This changes prompting: the audio block is now mandatory, otherwise the model invents the sound and often badly. Base quality and resolution remain at 720p, format stays 16:9.",
      },
      {
        q: "How do I avoid embedded subtitles in frame?",
        a: "Three techniques work together. Write dialogue via colon, not in quotes: `says: hello` instead of `says \"hello\"`. Append `(no subtitles!)` to the end of the prompt. If subtitles still show up, repeat several times: «No subtitles. No subtitles!». Quotes are the main subtitle trigger; the colon is interpreted by the model as a spoken line without visual rendering.",
      },
      {
        q: "Why does the model add audience laughter I never asked for?",
        a: "It is a typical Veo 3 artifact when the scene has several characters but background sound is not described explicitly. The model «remembers» that videos with people usually have some background, and falls back on «studio audience laughter» as the most frequent pattern from its training data. The fix: always state Background Sound explicitly; even one rhythmic anchor removes the problem.",
      },
      {
        q: "Can I write dialogue in languages other than English?",
        a: "Technically yes — Veo 3 will pronounce other-language words, but quality is noticeably lower than in English: pronunciation can warp, intonation feels off, long words are problematic. For production work English dialogue is recommended. If you need another language, use phonetic spelling for tricky words and test on short phrases before long scenes.",
      },
      {
        q: "What dialogue length is optimal for an 8-second clip?",
        a: "Roughly 12-25 words. Less — the model fills pauses with AI mumbling. More — it speaks unnaturally fast without intonation. Ideal pattern: a short opener, the main idea, a short closer. For example: «So, here's the thing. Most startups fail in year two because they scale too fast. It's not the product, it's the timing.»",
      },
      {
        q: "How do I get character consistency across scenes?",
        a: "Veo 3 with an identical prompt produces a nearly identical character — exploit that. Build a detailed description: «John, a man in his 40s with short brown hair and a closely trimmed beard, wearing a navy blue jacket over a grey t-shirt, looking thoughtful». Repeat that description verbatim in every generation. The more unique the detail set, the more stable the consistency.",
      },
      {
        q: "Does Opten support Veo 3?",
        a: "Yes, the Opten extension detects Veo 3 on Google AI Studio, Vertex AI, Replicate, and Flow and scores prompts against the structure outlined above: it checks for the audio block, the colon dialogue format, the «(no subtitles!)» tag, background-sound description, and reasonable dialogue length. One click gives you a rewrite in the right structure.",
      },
    ],
  },
};
