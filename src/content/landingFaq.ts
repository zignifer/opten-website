// Phase 4 D-08 / V-10: single source of truth for landing FAQ. Same data feeds:
//   1. <FaqBlock items={landingFaq[lang]}/> on the / and /en/ landing (visible DOM)
//   2. faqPageBlock(landingFaq[lang], pageId) in scripts/seo-routes.ts (JSON-LD mainEntity)
// V-10 enforces that visible Q/A count == schema mainEntity Q/A count — sharing the source
// is the cleanest way to keep them in sync.
//
// Content provenance: 5 questions match the anchor guide's FAQ (D-08: "duplication acceptable
// for AI extraction"). Sourced from the same gpt-image-2 skill file + audience objections doc.
// Human-curated, approved by user 2026-05-17 per D-07.

export interface FaqItem {
  q: string;
  a: string;
}

const ru: FaqItem[] = [
  {
    q: "Что такое Opten и как он работает?",
    a: "Opten — расширение для Chrome, которое оценивает твой промпт прямо в интерфейсе генератора (Syntx, Higgsfield, Freepik) и одним кликом улучшает его под конкретную модель: Midjourney, Sora, Kling, Nano Banana, GPT Image 2 и ещё 50+. Расширение само определяет модель по странице и применяет правила из её документации — оценка 0–100, до пяти конкретных замечаний и кнопка auto-enhance.",
  },
  {
    q: "Сколько стоит и есть ли бесплатная версия?",
    a: "Бесплатно — 10 проверок промптов в месяц. Этого хватает попробовать на нескольких генерациях. Pro — 199 ₽/мес с автопродлением через ЮKassa (300 проверок в месяц) или 299 ₽ разово без подписки. Для долларовых платежей через Paddle — около $2.99/мес. Это в пять раз дешевле PromptPerfect ($9.99), и Opten работает не только в собственном чате, а внутри привычных генераторов.",
  },
  {
    q: "Какие модели поддерживаются?",
    a: "Около 60 моделей, в том числе: Seedance (все версии), Seedream, Kling с motion-control, Midjourney 7/8/niji/video, GPT Image 2, Flux, Nano Banana, Imagen, Luma Ray, Sora 2, Veo 3/3.1, Runway, MiniMax Hailuo, Pixverse, LTX, Wan, Qwen, Grok Imagine и другие. Если ты пробуешь редкую модель — Opten применяет fallback-режим с базовыми правилами вместо вылета с ошибкой.",
  },
  {
    q: "Сохраняет ли Opten мои промпты на серверах?",
    a: "Нет. Промпты и референсные изображения проходят транзитом через Vercel-прокси к Claude Haiku 4.5 для анализа и не сохраняются ни у Opten, ни у Anthropic (политика API). Никакой телеметрии содержимого промпта. В аккаунте хранится только счётчик использованных проверок за месяц.",
  },
  {
    q: "Где работает расширение?",
    a: "Сейчас полная поддержка: syntx.ai (все страницы генерации), higgsfield.ai (image + video), freepik.com (AI-генераторы и brand mode). Активно расширяем покрытие на других AI-агрегаторов — Aitrix, TensorArt, OpenRouter, Flora, MagAI. Если на твоём любимом сайте Opten ещё не работает — напиши в Telegram @v_voronezhtsev, мы приоритизируем по запросам.",
  },
];

const en: FaqItem[] = [
  {
    q: "What is Opten and how does it work?",
    a: "Opten is a Chrome extension that scores your prompt right inside the AI generator's interface (Syntx, Higgsfield, Freepik) and one-click improves it for the specific model: Midjourney, Sora, Kling, Nano Banana, GPT Image 2, and 50+ others. The extension auto-detects the model from the page URL and applies rules from that model's documentation — a 0–100 score, up to five specific issues, and an auto-enhance button.",
  },
  {
    q: "How much does it cost and is there a free tier?",
    a: 'Free tier: 10 prompt checks per month, enough to try Opten on a handful of generations. Pro: 199 ₽/mo with auto-renewal via YooKassa (300 checks per month), or 299 ₽ one-time without subscription. For USD payments via Paddle — around $2.99/mo. This is five times cheaper than PromptPerfect ($9.99), and Opten works inside familiar generators rather than in its own chat.',
  },
  {
    q: "Which models are supported?",
    a: "About 60 models including: Seedance (all versions), Seedream, Kling with motion-control, Midjourney 7/8/niji/video, GPT Image 2, Flux, Nano Banana, Imagen, Luma Ray, Sora 2, Veo 3/3.1, Runway, MiniMax Hailuo, Pixverse, LTX, Wan, Qwen, Grok Imagine and more. For rare models Opten falls back to a baseline rule set instead of throwing an error.",
  },
  {
    q: "Does Opten store my prompts on its servers?",
    a: "No. Prompts and reference images flow through a Vercel proxy to Claude Haiku 4.5 for analysis and are NOT stored — neither by Opten nor by Anthropic (per API policy). No prompt-content telemetry. Your account only tracks the monthly count of checks used.",
  },
  {
    q: "Where does the extension work?",
    a: "Currently fully supported: syntx.ai (all generation pages), higgsfield.ai (image + video), freepik.com (AI generators and brand mode). We're actively expanding to other AI aggregators — Aitrix, TensorArt, OpenRouter, Flora, MagAI. If your favorite site isn't supported yet, message @v_voronezhtsev on Telegram and we'll prioritize by request volume.",
  },
];

export const landingFaq = { ru, en } as const;
