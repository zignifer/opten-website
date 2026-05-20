// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for runway-act-two.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Runway Act-Two: структура, ошибки, примеры",
    description:
      "Как работать с Runway Act-Two: performance transfer без mocap, driving video + character reference, настройка Facial Expressiveness, типичные ошибки и сценарии.",
    h1: "Runway Act-Two: как готовить вход, который модель понимает",
    intro:
      "Runway Act-Two — это performance transfer модель, а не text-to-video. На вход подаётся driving video с актёрским перформансом и character reference (изображение или видео), модель переносит движение тела, мимику и lip-sync на персонажа. Текстовый промпт здесь играет минимальную роль — качество определяется входными данными.",
    sections: [
      {
        heading: "Что умеет Act-Two",
        body:
          "Act-Two работает как AI Motion Capture без mocap-костюмов: записываешь актёрский перформанс на обычную веб-камеру, выбираешь character reference, и модель переносит на него движение тела, мимику и аудио-lip-sync. Выход — 720p видео по 5 кредитов/сек.\n\nЭто принципиально другой класс моделей: ни T2V, ни I2V. Текстовый промпт почти не влияет на результат. Параметр Facial Expressiveness (шкала 1–5) регулирует степень переноса мимики — значения выше 3 могут давать артефакты. Если character reference подан как image, доступно дополнительное gesture control.",
        bullets: [
          "Performance transfer — НЕ text-to-video и НЕ prompt-driven",
          "Driving video + character reference обязательны",
          "Переносится: body motion, мимика, lip-sync (audio)",
          "Facial Expressiveness 1–5 (выше 3 — риск артефактов)",
          "720p, 5 кредитов/сек",
        ],
      },
      {
        heading: "Что подавать на вход",
        body:
          "Driving video — твоё видео с перформансом. Может быть запись с веб-камеры или подготовленный клип. Главные требования: чёткое освещение лица без резких теней, отчётливое аудио для lip-sync, и желательно начать кадр с ладонями к камере — это помогает модели захватить руки и потом точнее переносить жесты.\n\nCharacter reference — кому переносить перформанс. Может быть статичное изображение или короткое видео. Изображение даёт доступ к gesture control (дополнительный контроль над руками), видео — лучшую консистентность мимики на длительных сценах. В обоих случаях освещение и поза должны быть чёткими, лицо без перекрытий.",
      },
      {
        heading: "Роль текстового промпта",
        body:
          "Act-Two — input-driven модель. Текстовый промпт играет минимальную, почти декоративную роль. Всё, что обычно описывают в промпте (движения, мимика, lip-sync), здесь приходит из driving video; всё, что касается внешности (одежда, лицо, фон), приходит из character reference.\n\nЕсли пишешь развёрнутый текстовый промпт «a man in a suit, walking, smiling, saying hello» — он будет либо проигнорирован, либо вступит в конфликт с входными данными. Если хочешь конкретные движения — сыграй их в driving video. Если хочешь конкретную внешность — подбери character reference. Промпт оставь пустым или коротко опиши контекст сцены.",
      },
      {
        heading: "Настройка Facial Expressiveness",
        body:
          "Шкала 1–5 регулирует степень переноса лицевой экспрессии. Значение 1–2 — спокойная, сдержанная мимика, минимальный риск артефактов. Значение 3 — рекомендуемый дефолт, переносит большинство выражений естественно. Значение 4–5 — максимальная экспрессия, но возрастает риск артефактов: лицо может «плыть», глаза дёргаться, мимика выглядеть утрированной.\n\nПравило: начинай с 3, поднимай только если результат выглядит слишком плоским. Для драматических сцен 4 может работать, но дальше обычно начинаются проблемы. Если артефакты появились — снижай Expressiveness, а не пытайся компенсировать промптом.",
      },
      {
        heading: "Типичные сценарии",
        body:
          "Виртуальные персонажи: запись своего перформанса (рассказ, диалог) и перенос на анимированного аватара. Lip-sync контент: озвучка готового персонажа через перенос речи. Mocap без оборудования: motion capture для коротких сцен через обычную веб-камеру, без mocap-костюмов и студии.\n\nАct-Two особенно полезен для контент-креаторов, у которых есть голос и идея, но нет on-camera присутствия — можно играть персонажей, оставаясь за кадром. Также для дубляжа существующих видео на новый язык с сохранением lip-sync.",
      },
    ],
    examples: [
      {
        before:
          "Развёрнутый текстовый промпт: «A young woman in a red sweater speaks to the camera, smiling warmly, gesturing with her hands as she explains a new product.»",
        after:
          "Driving video: 15-секундная запись на веб-камеру, актриса говорит реплику чётко, ладони к камере в начале кадра, ровное освещение.\nCharacter reference: portrait image персонажа в красном свитере.\nPrompt: (пусто или коротко: «product explainer scene»).\nFacial Expressiveness: 3.",
        note: "Текстовый промпт в Act-Two бесполезен для управления движениями и мимикой — это всё переносится из driving video. Замени промпт качественной записью перформанса.",
      },
      {
        before:
          "Character reference: dramatic painted portrait, Facial Expressiveness: 5",
        after:
          "Character reference: чёткое фото или живой видео-референс персонажа, ровное освещение, лицо без перекрытий.\nFacial Expressiveness: 3.",
        note: "Painted/stylized референсы плохо переносят мимику. Expressiveness 5 на любом референсе почти гарантированно даёт артефакты. Понизь до 3, выбери чёткий референс — результат стабильнее.",
      },
      {
        before:
          "Driving video: тёмная запись с резкими тенями, аудио с шумом",
        after:
          "Driving video: запись в равномерном освещении (естественный свет от окна или soft box), отчётливое аудио без шума, в начале кадра ладони видны.\nCharacter reference + Expressiveness 3.",
        note: "Качество driving video напрямую определяет качество переноса. Резкие тени ломают face tracking, шумное аудио ломает lip-sync. Переснять перформанс — лучшая «оптимизация» промпта в Act-Two.",
      },
    ],
    mistakes: [
      {
        title: "Развёрнутый текстовый промпт как основное управление",
        explain:
          "Act-Two — input-driven, не prompt-driven модель. Описание движений и мимики в промпте либо игнорируется, либо вступает в конфликт с driving video. Если хочешь конкретные движения — сыграй их перед камерой. Промпт оставь пустым или впиши только короткий контекст сцены.",
      },
      {
        title: "Отсутствие driving video или character reference",
        explain:
          "Act-Two физически не может работать без обоих входов. Driving video задаёт перформанс, character reference — кого анимировать. Если запустил без одного из них, генерация либо не стартует, либо даёт мусорный выход. Перед запуском проверь оба слота в Generation Settings.",
      },
      {
        title: "Facial Expressiveness выше 3 как дефолт",
        explain:
          "Значения 4–5 могут давать впечатляющую экспрессию, но риск артефактов растёт нелинейно: лицо плывёт, глаза дёргаются, мимика выглядит утрированной. Начинай всегда с 3, поднимай только если результат явно плоский. Снижение Expressiveness — лучший фикс артефактов, чем перегенерация.",
      },
      {
        title: "Тёмный или зашумлённый driving video",
        explain:
          "Резкие тени на лице ломают face tracking, шумное аудио ломает lip-sync. Перформанс должен сниматься в равномерном soft-освещении (окно, softbox), с чистым аудио. Никакой «оптимизации» промпта это не починит — переснять driving video всегда быстрее и эффективнее.",
      },
      {
        title: "Использование Act-Two как обычного T2V/I2V",
        explain:
          "Act-Two — это система переноса перформанса, а не генератор сцены. Промпты вроде «a man walks across the room» здесь не работают, потому что движение не генерируется, а копируется из driving video. Если нужен генератор сцены — бери Gen-4.5 или Gen-4, а не Act-Two.",
      },
    ],
    faq: [
      {
        q: "Можно ли использовать Act-Two только с текстовым промптом?",
        a: "Нет, Act-Two — performance transfer модель, а не text-to-video. Без driving video и character reference генерация физически не запустится. Если нужно сделать видео по текстовому описанию, бери Runway Gen-4.5 — она поддерживает полноценный T2V. Act-Two нужен именно когда уже есть перформанс или планируется его записать.",
      },
      {
        q: "Чем driving video отличается от character reference?",
        a: "Driving video — это запись актёрского перформанса с движениями и мимикой, источник того, что будет переноситься. Character reference — изображение или видео персонажа, на которого переносится. Driving задаёт КАК двигаться, reference задаёт КАК выглядеть. Оба нужны одновременно, без любого из них Act-Two не работает.",
      },
      {
        q: "Какое значение Facial Expressiveness ставить?",
        a: "Дефолт — 3, это рекомендованное Runway значение для большинства сцен. 1–2 даёт сдержанную мимику, подходит для документального тона. 4 можно пробовать для драматических сцен, но артефакты вероятны. 5 почти всегда даёт «поплывшее» лицо и не рекомендуется. Если артефакты появились — снижай Expressiveness, не пытайся компенсировать промптом.",
      },
      {
        q: "Можно ли получить gesture control?",
        a: "Да, но только если character reference подан как image (не как video). Image-режим даёт дополнительный контроль над переносом жестов рук. Для лучшего захвата начинай driving video с ладонями к камере — это помогает модели зафиксировать руки и потом точнее переносить жесты по всему клипу.",
      },
      {
        q: "Подходит ли Act-Two для дубляжа на другой язык?",
        a: "Да, это один из сильных сценариев. Driving video — новая запись с речью на целевом языке (можно своим голосом), character reference — изображение или кадр из оригинального видео. Act-Two перенесёт lip-sync под новый язык, сохранив внешность персонажа. Качество lip-sync зависит от чистоты аудио в driving video.",
      },
      {
        q: "Какие у Act-Two ограничения по длительности?",
        a: "Длительность результата задаётся длительностью driving video — модель переносит перформанс кадр в кадр. Чем длиннее driving, тем выше расход кредитов (5 кредитов/сек). Для коротких реплик и микро-сцен это экономично, для многоминутных монологов сценарии лучше разбивать на отдельные генерации.",
      },
      {
        q: "Поддерживается ли Opten для Runway Act-Two?",
        a: "Да, расширение Opten распознаёт Act-Two внутри runwayml.com и учитывает её особый input-driven характер: если пользователь пишет развёрнутый текстовый промпт, Opten предупреждает, что модель управляется видео-вводом, а не текстом. Также проверяется наличие обоих входов (driving video + character reference) и адекватность Facial Expressiveness.",
      },
    ],
  },
  en: {
    title: "Runway Act-Two Prompts: Structure, Mistakes, Examples",
    description:
      "How to work with Runway Act-Two: performance transfer without mocap, driving video + character reference, Facial Expressiveness, mistakes and use cases.",
    h1: "Runway Act-Two: how to prepare inputs the model actually understands",
    intro:
      "Runway Act-Two is a performance transfer model, not text-to-video. You feed it a driving video with an actor's performance and a character reference (image or video), and the model transfers body motion, facial expression, and lip-sync onto the character. Text prompts play a minimal role here — quality is set by the inputs.",
    sections: [
      {
        heading: "What Act-Two does well",
        body:
          "Act-Two works like AI motion capture without mocap suits: record an actor's performance on a regular webcam, pick a character reference, and the model transfers body motion, facial expression, and audio lip-sync onto that character. Output is 720p video at 5 credits/sec.\n\nThis is a fundamentally different class of model — neither T2V nor I2V. The text prompt barely influences the result. The Facial Expressiveness parameter (1–5 scale) controls how strongly facial motion transfers — values above 3 risk artifacts. If the character reference is an image (not video), you also get gesture control.",
        bullets: [
          "Performance transfer — NOT text-to-video and NOT prompt-driven",
          "Driving video + character reference are mandatory",
          "Transfers: body motion, facial expression, lip-sync (audio)",
          "Facial Expressiveness 1–5 (above 3 risks artifacts)",
          "720p, 5 credits/sec",
        ],
      },
      {
        heading: "What to feed as input",
        body:
          "Driving video — your performance footage. Can be a webcam recording or a prepared clip. Key requirements: even lighting on the face without harsh shadows, clear audio for lip-sync, and ideally start the frame with palms toward the camera — this helps the model capture the hands and later transfer gestures more accurately.\n\nCharacter reference — who to transfer the performance onto. Can be a still image or a short video. An image unlocks gesture control (extra hand control); a video gives better facial consistency on longer scenes. In both cases the lighting and pose should be clear, the face unobstructed.",
      },
      {
        heading: "The role of the text prompt",
        body:
          "Act-Two is input-driven. The text prompt plays a minimal, almost decorative role. Everything you'd normally describe in a prompt (movements, expression, lip-sync) here comes from the driving video; everything about appearance (clothing, face, background) comes from the character reference.\n\nIf you write a detailed prompt like «a man in a suit, walking, smiling, saying hello», it will either be ignored or conflict with the inputs. If you want specific movements, act them out in the driving video. If you want a specific look, pick the right character reference. Leave the prompt empty or only briefly describe the scene context.",
      },
      {
        heading: "Tuning Facial Expressiveness",
        body:
          "The 1–5 scale controls how strongly facial expression transfers. Value 1–2 — calm, restrained expression with minimal artifact risk. Value 3 — recommended default, transfers most expressions naturally. Value 4–5 — maximum expression, but artifact risk rises non-linearly: the face can melt, eyes can twitch, expressions can look overdone.\n\nRule: start at 3, raise only if the result looks visibly flat. For dramatic scenes 4 can work, but problems usually start above that. If artifacts appear, lower Expressiveness — don't try to compensate with the prompt.",
      },
      {
        heading: "Common use cases",
        body:
          "Virtual characters: record your own performance (monologue, dialogue) and transfer onto an animated avatar. Lip-sync content: voicing an existing character by transferring speech. Mocap without gear: motion capture for short scenes via a regular webcam, no mocap suits or studio required.\n\nAct-Two is especially useful for content creators who have a voice and an idea but no on-camera presence — you can play characters while staying off-camera. Also for dubbing existing videos into a new language while preserving lip-sync.",
      },
    ],
    examples: [
      {
        before:
          "Detailed text prompt: «A young woman in a red sweater speaks to the camera, smiling warmly, gesturing with her hands as she explains a new product.»",
        after:
          "Driving video: 15-second webcam recording, actress delivers the line clearly, palms toward camera at the start of the frame, even lighting.\nCharacter reference: portrait image of the character in a red sweater.\nPrompt: (empty or brief: «product explainer scene»).\nFacial Expressiveness: 3.",
        note: "Text prompts in Act-Two are useless for controlling motion and expression — those transfer from the driving video. Replace the prompt with a quality performance recording.",
      },
      {
        before: "Character reference: dramatic painted portrait, Facial Expressiveness: 5",
        after:
          "Character reference: clear photo or live video reference of the character, even lighting, face unobstructed.\nFacial Expressiveness: 3.",
        note: "Painted or stylized references transfer expression poorly. Expressiveness 5 on any reference almost guarantees artifacts. Drop to 3, pick a clear reference — the result stabilizes.",
      },
      {
        before: "Driving video: dark recording with harsh shadows, noisy audio",
        after:
          "Driving video: recording in even light (natural window light or soft box), clean audio without noise, palms visible at the start of the frame.\nCharacter reference + Expressiveness 3.",
        note: "Driving video quality directly determines transfer quality. Harsh shadows break face tracking, noisy audio breaks lip-sync. Reshooting the performance is the best «prompt optimization» in Act-Two.",
      },
    ],
    mistakes: [
      {
        title: "Detailed text prompt as primary control",
        explain:
          "Act-Two is input-driven, not prompt-driven. Describing movements and expression in the prompt is either ignored or conflicts with the driving video. If you want specific motion, act it out in front of the camera. Leave the prompt empty or include only a brief scene context.",
      },
      {
        title: "Missing driving video or character reference",
        explain:
          "Act-Two physically cannot run without both inputs. Driving video sets the performance, character reference picks who gets animated. If you launch missing one of them, generation either won't start or produces garbage. Verify both slots in Generation Settings before running.",
      },
      {
        title: "Facial Expressiveness above 3 by default",
        explain:
          "Values 4–5 can deliver striking expression, but artifact risk grows non-linearly: face melts, eyes twitch, expression looks overdone. Always start at 3, raise only if the output is clearly flat. Lowering Expressiveness is a better fix for artifacts than regenerating.",
      },
      {
        title: "Dark or noisy driving video",
        explain:
          "Harsh facial shadows break face tracking; noisy audio breaks lip-sync. The performance should be shot in even soft lighting (window, softbox) with clean audio. No prompt optimization can fix this — reshooting the driving video is always faster and more effective.",
      },
      {
        title: "Using Act-Two like a generic T2V or I2V model",
        explain:
          "Act-Two is a performance transfer system, not a scene generator. Prompts like «a man walks across the room» don't work here because motion isn't generated — it's copied from the driving video. If you need a scene generator, use Gen-4.5 or Gen-4, not Act-Two.",
      },
    ],
    faq: [
      {
        q: "Can I use Act-Two with text prompts only?",
        a: "No, Act-Two is a performance transfer model, not text-to-video. Without a driving video and a character reference it cannot physically generate. If you need to produce video from a text description, use Runway Gen-4.5 — it supports full T2V. Act-Two is for when you already have a performance or plan to record one.",
      },
      {
        q: "What's the difference between driving video and character reference?",
        a: "Driving video is the actor's performance recording with motion and expression — the source of what gets transferred. Character reference is an image or video of the character it transfers onto. Driving sets HOW to move, reference sets HOW to look. Both are needed simultaneously; without either, Act-Two does not work.",
      },
      {
        q: "What Facial Expressiveness value should I use?",
        a: "Default is 3, Runway's recommended value for most scenes. 1–2 yields restrained expression, suits documentary tone. 4 is worth trying for dramatic scenes but artifacts are likely. 5 almost always produces a «melting» face and is not recommended. If artifacts appear, lower Expressiveness — don't try to compensate with the prompt.",
      },
      {
        q: "Can I get gesture control?",
        a: "Yes, but only if the character reference is provided as an image (not a video). Image mode unlocks extra hand-gesture transfer control. For best capture, start the driving video with palms toward the camera — this helps the model lock onto the hands and transfer gestures accurately throughout the clip.",
      },
      {
        q: "Is Act-Two good for dubbing into another language?",
        a: "Yes, it's one of the strongest use cases. Driving video is a new recording with speech in the target language (your own voice works); character reference is an image or frame from the original video. Act-Two transfers lip-sync to match the new language while preserving the character's appearance. Lip-sync quality depends on clean audio in the driving video.",
      },
      {
        q: "What are Act-Two's duration limits?",
        a: "Output duration matches the driving video — the model transfers frame by frame. The longer the driving, the more credits you spend (5 credits/sec). For short lines and micro-scenes that's economical; for multi-minute monologues it's better to split into separate generations.",
      },
      {
        q: "Does Opten support Runway Act-Two?",
        a: "Yes, the Opten extension recognizes Act-Two inside runwayml.com and accounts for its input-driven nature: if you write a detailed text prompt, Opten warns that the model is controlled by video input, not text. It also checks that both inputs are present (driving video + character reference) and that Facial Expressiveness is set sensibly.",
      },
    ],
  },
};
