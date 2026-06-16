import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-16";

const COVER_RU = {
  src: "/blog/ai-ugc-for-brands/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про AI UGC и prompt brief для рекламных видео",
};
const COVER_EN = {
  src: "/blog/ai-ugc-for-brands/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for an AI UGC guide about prompt briefs for video ads",
};

const ru: BlogPostLocale = {
  slug: "ai-ugc-for-brands",
  title: "AI UGC: промпты для рекламных видео бренда",
  excerpt:
    "AI UGC это не просто аватар в кадре: нейросеть для UGC делает рекламу живее, когда prompt brief фиксирует hook, продукт, автора, CTA и поведение.",
  description:
    "AI UGC на русском: как написать prompt brief для UGC-видео рекламы бренда, product shot, creator behavior, hook, CTA и естественный кадр без постановки.",
  category: "guide",
  tags: ["workflow", "ai-video-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "ai-influencer"],
  body: {
    intro:
      "AI UGC это рекламный ролик, где нейросеть имитирует creator-style видео: человек показывает продукт, говорит короткий hook и ведет к CTA. AI UGC на русском работает лучше, когда вы пишете не общий запрос «сделай рекламу», а точный prompt brief с поведением автора, кадрами продукта и ограничениями.",
    steps: [
      {
        title: "Начните с prompt brief, а не с идеи ролика",
        body:
          "Нейросеть для UGC не понимает бизнес-задачу по умолчанию. Если написать «сделай живое видео про крем», модель сама придумает автора, интонацию, ракурс, продуктовый кадр и финальный CTA. Иногда это выглядит красиво, но коммерчески слабо: продукт мелькает случайно, герой улыбается без причины, а hook звучит как стоковая реклама.\n\nРабочий brief короткий: кто говорит, для кого ролик, какой продукт в руках, какая проблема в первых 2 секундах, какой кадр доказывает пользу и что зритель должен сделать в конце. Такой блок можно писать и на русском, но для большинства video-моделей стабильнее финальный production prompt на английском. Русский смысл лучше держать в брифе, а техническую режиссуру переводить аккуратно.",
        before:
          "Сделай UGC рекламу крема, чтобы выглядело естественно и продавало.",
        after:
          "UGC ad brief: creator is a 28-year-old skincare buyer, casual bathroom shelf setup, handheld phone camera. Hook: dry skin after travel. Product interaction: opens generic cream jar, shows texture on fingers, applies small amount. CTA: try a simple evening routine. Constraints: no brand logos, no exaggerated smile, no random text.",
        imageSrc: "/blog/ai-ugc-for-brands/ru/step-1.jpg",
      },
      {
        title: "Соберите ролик как hook, product shot и CTA",
        body:
          "UGC видео нейросеть часто делает слишком ровным: герой сразу держит продукт, потом просто говорит в камеру. Для рекламы это слабая структура. Нужна мини-раскадровка: `0-2s hook`, `2-5s product interaction`, `5-8s benefit proof`, `8-10s CTA`. Не обязательно делать длинный сценарий. Важно указать, где продукт виден, где герой взаимодействует с ним, и где заканчивается смысл.\n\nДля fashion, косметики, приложений и небольших DTC-товаров эта логика одинаковая. Hook цепляет проблему, product shot показывает предмет, creator behavior делает сцену похожей на личный опыт, CTA закрывает ролик. Если пропустить один beat, нейросеть для видео рекламы обычно компенсирует это красивой, но пустой мимикой.",
        before:
          "Creator talks about the product, cinematic UGC ad, natural, 10 seconds.",
        after:
          "0-2s hook: creator notices dry skin after a flight.\n2-5s product: opens generic cream jar and shows texture.\n5-8s proof: applies a small amount, handheld close-up, real bathroom shelf.\n8-10s CTA: calm direct-to-camera line, no salesy grin, no on-screen logo.",
        imageSrc: "/blog/ai-ugc-for-brands/ru/step-2.jpg",
      },
      {
        title: "Нейросеть для UGC: добавьте поведение автора",
        body:
          "Самая частая ошибка в AI UGC для брендов — просить эмоцию вместо поведения. `Natural`, `authentic`, `relatable` звучит правильно, но модель часто превращает это в одинаковую улыбку и постановочную позу. Лучше описывать маленькие действия: герой поправляет упаковку в руке, смотрит на текст этикетки, делает короткую паузу перед фразой, двигает телефон как обычный покупатель.\n\nПрактический кейс: ролик для skincare-продукта выглядел как студийная реклама, хотя в промпте было `authentic UGC`. Исправление было точнее: `handheld pacing, creator glances at the bottle before speaking, opens the jar mid-sentence, applies texture on fingertips, slight imperfect framing, no polished studio smile`. После этого кадр стал менее постановочным, а продукт перестал быть случайным реквизитом.",
        before:
          "Authentic UGC video, woman presents a skincare product, natural emotion, realistic.",
        after:
          "Handheld UGC ad. Creator glances at the generic bottle before speaking, pauses, opens the jar mid-sentence, shows cream texture on fingertips, applies it once. Slight imperfect framing, soft bathroom light, no polished studio smile, no logo.",
        imageSrc: "/blog/ai-ugc-for-brands/ru/step-3.jpg",
      },
      {
        title: "Проверьте prompt перед рендером рекламы",
        body:
          "Нейросеть для рекламы быстро тратит попытки, если prompt забывает ограничения. Перед рендером проверьте пять строк: creator role, product visibility, camera movement, text/voice line, constraints. Отдельно проверьте, нет ли противоречий: «handheld» и «perfect studio commercial», «casual review» и «luxury perfume ad» в одном запросе будут тянуть ролик в разные стороны.\n\nOpten здесь удобен как preflight: вы даете короткую идею, а он помогает развернуть ее в production prompt под конкретную модель и подсвечивает пропуски. Для UGC особенно важны запреты на случайные логотипы, лишний текст в кадре, слишком глянцевую улыбку и смену продукта между кадрами.",
        before:
          "AI UGC ad for a product, creator speaks, product visible, beautiful lighting.",
        after:
          "Preflight: creator role is defined; product is visible in 3 beats; handheld camera path is specified; CTA line is short; constraints block random logos, extra text, product change, polished studio smile, and off-brand packaging.",
        imageSrc: "/blog/ai-ugc-for-brands/ru/step-4.jpg",
      },
      {
        title: "Пишите текст для рекламы отдельным блоком",
        body:
          "Фраза героя — это не то же самое, что visual prompt. Если смешать нейросеть текст для рекламы, описание кадра и технические запреты в один абзац, модель может вывести случайные слова на экран или сделать речь слишком длинной. Лучше держать script line отдельно: 1-2 короткие фразы, которые человек реально успеет сказать в 8-10 секунд.\n\nДля русского ролика сначала напишите живую строку на русском, затем отдельно задайте визуальный prompt. Например: «После перелета кожа обычно стянутая. Я наношу это вечером, когда не хочу десять шагов ухода». Дальше уже описывайте камеру, руки, продукт и ограничения. Так AI UGC остается рекламой, но не превращается в дикторский ролик.",
        before:
          "Она говорит про пользу крема, показывает банку и зовет купить, все естественно.",
        after:
          "Script line RU: «После перелета кожа обычно стянутая. Я наношу это вечером, когда не хочу десять шагов ухода».\nVisual prompt: handheld bathroom shelf shot, creator opens generic cream jar, shows texture, one calm CTA, no subtitles, no random logo.",
      },
    ],
    faq: [
      {
        q: "AI UGC это что?",
        a: "AI UGC это рекламное видео в стиле пользовательского контента, созданное или собранное с помощью нейросети. В кадре обычно есть creator, продукт, короткий hook, демонстрация и CTA, но все это задается prompt brief.",
      },
      {
        q: "Можно ли делать AI UGC на русском?",
        a: "Да. Смысл, оффер и реплику автора можно писать на русском. Для стабильного video prompt часто полезно перевести техническую часть на английский: камера, действие, продукт, ограничения и tempo.",
      },
      {
        q: "Какая нейросеть для UGC подходит для рекламных видео?",
        a: "Подходят video-модели и платформы, которые умеют image-to-video, talking creator, product interaction и стабильный короткий клип. Важнее не название сервиса, а clear prompt brief, видимый продукт, поведение автора и запреты на drift.",
      },
      {
        q: "Почему UGC видео нейросеть делает слишком постановочным?",
        a: "Обычно prompt просит эмоцию, но не описывает поведение. Слова `authentic` и `natural` не заменяют конкретику: handheld camera, пауза перед фразой, взгляд на продукт, взаимодействие с упаковкой и imperfect framing.",
      },
      {
        q: "Как использовать нейросеть для видео рекламы без случайных логотипов?",
        a: "Добавьте constraints: no real brand logos, no random text, no packaging redesign, no product change between shots. Если нужен реальный бренд, используйте только проверенные права и отдельный brand-safe workflow.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-ugc-for-brands",
  title: "AI UGC: prompt workflow for brand video ads",
  excerpt:
    "AI UGC ads work better when the prompt brief locks the creator, product shot, hook, handheld pacing, CTA, and behavior before rendering brand videos.",
  description:
    "AI UGC guide for brand video ads: write prompt briefs for creator behavior, product shots, hooks, CTAs, handheld pacing, and natural UGC videos without staging.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI UGC is a creator-style video ad made with a generative model: someone shows a product, opens with a short hook, and leads to a CTA. The useful output comes from a precise prompt brief, not a vague request to make an ad look natural.",
    steps: [
      {
        title: "Start with a prompt brief, not a video idea",
        body:
          "An AI UGC model does not know your business goal by default. If you write `make a natural video about a cream`, the model invents the creator, tone, camera, product shot, and final CTA. Sometimes the clip looks polished, but it is weak as an ad: the product appears by accident, the smile feels fake, and the hook sounds like stock copy.\n\nA useful brief is short: who is speaking, who the ad is for, what product is in hand, what problem appears in the first 2 seconds, which shot proves the benefit, and what the viewer should do at the end. Keep the business meaning in your native language if needed, then make the production prompt precise enough for the video model.",
        before:
          "Make a UGC ad for a cream that looks natural and sells.",
        after:
          "UGC ad brief: creator is a 28-year-old skincare buyer, casual bathroom shelf setup, handheld phone camera. Hook: dry skin after travel. Product interaction: opens generic cream jar, shows texture on fingers, applies small amount. CTA: try a simple evening routine. Constraints: no brand logos, no exaggerated smile, no random text.",
        imageSrc: "/blog/ai-ugc-for-brands/en/step-1.jpg",
      },
      {
        title: "Build ai ugc ads as hook, product shot, and CTA",
        body:
          "AI UGC ads often come back too smooth: the creator holds the product, talks to camera, and nothing really happens. A better structure is a mini storyboard: `0-2s hook`, `2-5s product interaction`, `5-8s benefit proof`, `8-10s CTA`. You do not need a full screenplay. You do need to say where the product is visible, where the creator touches it, and where the point lands.\n\nThis works for fashion, skincare, apps, and small DTC products. The hook names the problem, the product shot shows the object, creator behavior makes it feel like lived experience, and the CTA closes the ad. Skip one beat and the video model usually fills the gap with nice but empty facial expression.",
        before:
          "Creator talks about the product, cinematic UGC ad, natural, 10 seconds.",
        after:
          "0-2s hook: creator notices dry skin after a flight.\n2-5s product: opens generic cream jar and shows texture.\n5-8s proof: applies a small amount, handheld close-up, real bathroom shelf.\n8-10s CTA: calm direct-to-camera line, no salesy grin, no on-screen logo.",
        imageSrc: "/blog/ai-ugc-for-brands/en/step-2.jpg",
      },
      {
        title: "For ai ugc videos, describe creator behavior",
        body:
          "The common mistake in AI UGC for brands is asking for emotion instead of behavior. `Natural`, `authentic`, and `relatable` sound right, but models often translate them into the same smile and a staged pose. Describe tiny actions instead: the creator adjusts the bottle in hand, glances at the label, pauses before the line, and moves the phone like a real buyer.\n\nPractical case: a skincare clip looked like a studio ad even though the prompt said `authentic UGC`. The fix was specific: `handheld pacing, creator glances at the bottle before speaking, opens the jar mid-sentence, applies texture on fingertips, slight imperfect framing, no polished studio smile`. The next render felt less staged, and the product stopped looking like random props.",
        before:
          "Authentic UGC video, woman presents a skincare product, natural emotion, realistic.",
        after:
          "Handheld UGC ad. Creator glances at the generic bottle before speaking, pauses, opens the jar mid-sentence, shows cream texture on fingertips, applies it once. Slight imperfect framing, soft bathroom light, no polished studio smile, no logo.",
        imageSrc: "/blog/ai-ugc-for-brands/en/step-3.jpg",
      },
      {
        title: "Run a prompt preflight before rendering ai video ads",
        body:
          "AI video ads waste attempts when the prompt forgets constraints. Before rendering, check five lines: creator role, product visibility, camera movement, spoken line, and constraints. Also check for contradictions. `Handheld` plus `perfect studio commercial`, or `casual review` plus `luxury perfume ad`, will pull the clip in different directions.\n\nOpten works well as a preflight editor here: you give it the rough idea, then it expands the idea into a production prompt for a specific model and catches missing pieces. For UGC, the important constraints are random logos, extra text in the frame, an over-polished smile, and product drift between shots.",
        before:
          "AI UGC ad for a product, creator speaks, product visible, beautiful lighting.",
        after:
          "Preflight: creator role is defined; product is visible in 3 beats; handheld camera path is specified; CTA line is short; constraints block random logos, extra text, product change, polished studio smile, and off-brand packaging.",
        imageSrc: "/blog/ai-ugc-for-brands/en/step-4.jpg",
      },
      {
        title: "Keep ad copy separate from the visual prompt",
        body:
          "The creator's line is not the same thing as the visual prompt. If you mix ad copy, camera direction, and technical constraints into one paragraph, the model may print random words on screen or make the line too long for an 8-10 second clip. Keep the script line separate: one or two short sentences that a person can actually say.\n\nFor example: `After a flight, my skin usually feels tight. I use this at night when I do not want a ten-step routine.` Then describe the camera, hands, product, and constraints separately. That keeps AI UGC videos commercial without turning them into voiceover spots.",
        before:
          "She talks about the cream benefits, shows the jar, and asks people to buy, naturally.",
        after:
          "Script line: `After a flight, my skin usually feels tight. I use this at night when I do not want a ten-step routine.`\nVisual prompt: handheld bathroom shelf shot, creator opens generic cream jar, shows texture, one calm CTA, no subtitles, no random logo.",
      },
    ],
    faq: [
      {
        q: "What is ai ugc?",
        a: "AI UGC is creator-style user-generated content made or assisted by generative models. In ad production, it usually means a short clip with a creator, product, hook, demonstration, and CTA built from a prompt brief.",
      },
      {
        q: "How do ai ugc ads work?",
        a: "AI UGC ads work by turning a marketing brief into a short video prompt: creator role, product interaction, camera behavior, spoken line, and constraints. The clearer the brief, the less the model invents.",
      },
      {
        q: "What is a simple ai ugc guide workflow?",
        a: "Use this order: write the offer, define the creator, choose the product shot, map hook-product-proof-CTA, add behavior details, then run a prompt preflight before rendering.",
      },
      {
        q: "Which tools can make ai video ads?",
        a: "Many video models and creator-video platforms can make AI video ads, especially when they support image-to-video, talking creators, product interaction, or short vertical clips. The prompt structure matters more than the tool name.",
      },
      {
        q: "Can ai ugc videos replace real creators?",
        a: "They can help with drafts, low-budget tests, localization, and creative exploration. They do not remove the need for brand review, legal checks, product truth, or real customer insight.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
