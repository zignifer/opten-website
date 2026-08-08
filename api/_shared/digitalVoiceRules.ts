// Generated from C:/Users/КОМП/Desktop/digit/voice_dictation_errors.csv and dictionary.csv,
// plus a compact reviewed set for the website's selectable coding assistants.
// Reviewed source date: 2026-08-08. Runtime-only data; never sent wholesale to the AI provider.
export interface DigitalVoiceRule {
  replacement: string;
  aliases: string[];
  positive: string[];
  negative: string[];
}

export const DIGITAL_VOICE_RULES: DigitalVoiceRule[] = [
  {
    "replacement": "Seedance 2.5",
    "aliases": [
      "Sidens 2.5",
      "Sedans 2.5",
      "Сиденс 2.5",
      "Сиданс 2.5",
      "Сидэнс 2.5"
    ],
    "positive": [
      "модель",
      "видео",
      "генерация",
      "промпт"
    ],
    "negative": [
      "автомобиль",
      "машина",
      "седан"
    ]
  },
  {
    "replacement": "SYNTX.AI",
    "aliases": [
      "Синтекс",
      "Синтикс",
      "Синтакс",
      "Syntx",
      "Синтх",
      "Синт икс"
    ],
    "positive": [
      "нейросети",
      "Sora",
      "Kling",
      "Seedance",
      "модели",
      "Telegram бот",
      "промпт"
    ],
    "negative": [
      "syntax синтаксис",
      "VS Code extension Syntx"
    ]
  },
  {
    "replacement": "ChatGPT",
    "aliases": [
      "Чат Джи-Пи-Ти",
      "Chat GPT",
      "чат жпт",
      "чат гпт",
      "ЧатGPT",
      "чат gpt",
      "чат джипити",
      "чаджпт",
      "джипити",
      "GPT"
    ],
    "positive": [
      "нейросеть",
      "чат",
      "промпт",
      "OpenAI",
      "ассистент",
      "генерация"
    ],
    "negative": [
      "GPT как модель API без ChatGPT"
    ]
  },
  {
    "replacement": "Claude",
    "aliases": [
      "Клауд",
      "Клод",
      "Клауде",
      "Claude AI",
      "клауд антропик",
      "Клода",
      "Клоде",
      "Клодом"
    ],
    "positive": [
      "Anthropic",
      "нейросеть",
      "модель",
      "ассистент",
      "код",
      "prompt"
    ],
    "negative": [
      "cloud",
      "облако",
      "клаудфлейр",
      "Google Cloud",
      "AWS"
    ]
  },
  {
    "replacement": "Claude Code",
    "aliases": [
      "Клод код",
      "клауд код",
      "Claude код",
      "код клод"
    ],
    "positive": [
      "кодинг",
      "агент",
      "репозиторий",
      "код",
      "терминал",
      "Anthropic"
    ],
    "negative": [
      "cloud code как облачный код"
    ]
  },
  {
    "replacement": "Vercel",
    "aliases": [
      "Версель",
      "Версел",
      "верцель",
      "верцел",
      "верселе",
      "Верселя",
      "Верселем"
    ],
    "positive": [
      "Next.js",
      "деплой",
      "хостинг",
      "сайт",
      "превью",
      "serverless"
    ],
    "negative": []
  },
  {
    "replacement": "Supabase",
    "aliases": [
      "Супабейс",
      "Супабаза",
      "Супербейс",
      "Superbase",
      "супа бейс",
      "супабазе",
      "Супабейса",
      "Супабейсе",
      "Супабейсом"
    ],
    "positive": [
      "Postgres",
      "auth",
      "database",
      "база данных",
      "storage",
      "edge functions",
      "Vercel",
      "Lovable"
    ],
    "negative": [
      "super base generic",
      "супер база"
    ]
  },
  {
    "replacement": "React",
    "aliases": [
      "Реакт джс",
      "Рект",
      "React.js",
      "React JS",
      "риакт",
      "реекте",
      "Реакт",
      "Реакта",
      "Реакте",
      "Реактом"
    ],
    "positive": [
      "frontend",
      "component",
      "hooks",
      "компонент",
      "хуки",
      "jsx",
      "next",
      "state"
    ],
    "negative": [
      "реакция",
      "react to",
      "реакт как глагол"
    ]
  },
  {
    "replacement": "Next.js",
    "aliases": [
      "Некст джс",
      "Некс джей эс",
      "Next JS",
      "NextJS",
      "некстжс",
      "некст 16",
      "Некст",
      "Некстом",
      "Нексту",
      "Некста"
    ],
    "positive": [
      "React",
      "App",
      "Router",
      "Vercel",
      "SSR",
      "серверные",
      "компоненты",
      "App Router",
      "серверные компоненты",
      "роутинг"
    ],
    "negative": [
      "next как следующий",
      "следующий"
    ]
  },
  {
    "replacement": "Vite",
    "aliases": [
      "Вайт",
      "Витэ",
      "Вите",
      "вайт дев сервер",
      "вит",
      "Вайта",
      "Вайте",
      "Вайтом"
    ],
    "positive": [
      "frontend",
      "dev",
      "server",
      "build",
      "сборка",
      "react",
      "vue",
      "dev server"
    ],
    "negative": [
      "white",
      "цвет белый",
      "vite как имя"
    ]
  },
  {
    "replacement": "TypeScript",
    "aliases": [
      "Тайп скрипт",
      "Type Script",
      "тайпскрип",
      "тайпскрипте",
      "типа скрипт",
      "Тайпскрипт",
      "TS",
      "Тайпскрипта",
      "Тайпскриптом"
    ],
    "positive": [
      "код",
      "типизация",
      "frontend",
      "react",
      "next",
      "tsconfig"
    ],
    "negative": [
      "тип скрипта"
    ]
  },
  {
    "replacement": "JavaScript",
    "aliases": [
      "Яваскрипт",
      "Джава скрипт",
      "Java Script",
      "джавоскрипт",
      "джс",
      "JS",
      "ДжаваScript",
      "Джаваскрипт",
      "Джаваскрипта",
      "Джаваскрипте",
      "Джаваскриптом"
    ],
    "positive": [
      "код",
      "браузер",
      "frontend",
      "фронтенд",
      "node",
      "скрипт",
      "функция"
    ],
    "negative": [
      "Java язык",
      "ява как остров"
    ]
  },
  {
    "replacement": "Tailwind CSS",
    "aliases": [
      "Тайлвинд",
      "Тейлвинд",
      "TailwindCSS",
      "Тэйлвинд",
      "тайл винд",
      "тейл винд",
      "тэйлвинд css",
      "Tailwind",
      "TW",
      "Тейлвинда",
      "Тейлвинде",
      "Тейлвиндом"
    ],
    "positive": [
      "css",
      "классы",
      "верстка",
      "утилиты",
      "shadcn"
    ],
    "negative": [
      "tail wind как ветер"
    ]
  },
  {
    "replacement": "PostgreSQL",
    "aliases": [
      "Постгресс",
      "Postgre SQL",
      "Postgres",
      "Постгрес",
      "постгрескьюэль",
      "постгре",
      "постгреSQL",
      "PG"
    ],
    "positive": [
      "база",
      "данных",
      "SQL",
      "база данных",
      "Supabase",
      "таблица",
      "миграция"
    ],
    "negative": []
  },
  {
    "replacement": "Firebase",
    "aliases": [
      "Файр база",
      "Файрбейс",
      "Fire base",
      "фаербейз",
      "файрбазе",
      "Файрбейса",
      "Файрбейсе",
      "Файрбейсом"
    ],
    "positive": [
      "Google",
      "backend",
      "auth",
      "Firestore",
      "Realtime Database",
      "mobile"
    ],
    "negative": [
      "fire base военный"
    ]
  },
  {
    "replacement": "GitHub",
    "aliases": [
      "Гит хаб",
      "Джитхаб",
      "Гитхаб",
      "Git Hub"
    ],
    "positive": [
      "репозиторий",
      "pull",
      "request",
      "PR",
      "pull request",
      "код",
      "Copilot"
    ],
    "negative": [
      "хаб как hub"
    ]
  },
  {
    "replacement": "GitLab",
    "aliases": [
      "Гит лаб",
      "Гитлаб",
      "Git Lab",
      "джитлаб"
    ],
    "positive": [
      "репозиторий",
      "merge",
      "request",
      "CI/CD",
      "merge request",
      "код"
    ],
    "negative": [
      "лаборатория"
    ]
  },
  {
    "replacement": "Docker Compose",
    "aliases": [
      "Докер композ",
      "docker-compose",
      "докер compose"
    ],
    "positive": [
      "контейнер",
      "compose",
      "yaml",
      "docker",
      "сервис"
    ],
    "negative": []
  },
  {
    "replacement": "Kubernetes",
    "aliases": [
      "Кубер",
      "К8с",
      "K8s",
      "кубернетес",
      "кубернэтис",
      "кубернетис"
    ],
    "positive": [
      "кластер",
      "pod",
      "deployment",
      "container",
      "devops"
    ],
    "negative": []
  },
  {
    "replacement": "Midjourney",
    "aliases": [
      "Миджорни",
      "Миджерни",
      "миджорней",
      "мидджорни",
      "миджорни v8"
    ],
    "positive": [
      "изображение",
      "промпт",
      "генерация",
      "Discord",
      "AI art"
    ],
    "negative": [
      "journey путешествие"
    ]
  },
  {
    "replacement": "Seedream",
    "aliases": [
      "Сидрим",
      "Сид дрим",
      "Сидрим 4",
      "Seed dream",
      "Си дрим"
    ],
    "positive": [
      "изображение",
      "модель",
      "генерация",
      "ByteDance",
      "Freepik",
      "Magnific"
    ],
    "negative": [
      "сон",
      "dream",
      "seed"
    ]
  },
  {
    "replacement": "Kling AI",
    "aliases": [
      "Клинг",
      "Клин",
      "Kling",
      "Клинг AI",
      "KlingAI",
      "клинг 3"
    ],
    "positive": [
      "видео",
      "модель",
      "генерация",
      "промпт",
      "image-to-video",
      "text-to-video"
    ],
    "negative": [
      "clean",
      "клин город",
      "клин клином"
    ]
  },
  {
    "replacement": "Veo 3",
    "aliases": [
      "Вио 3"
    ],
    "positive": [
      "Google",
      "Gemini",
      "видео"
    ],
    "negative": [
      "видео сокращение",
      "veo как слово"
    ]
  },
  {
    "replacement": "Veo 3.1",
    "aliases": [
      "Вео 3.1"
    ],
    "positive": [
      "Google",
      "Gemini",
      "видео"
    ],
    "negative": [
      "видео сокращение",
      "veo как слово"
    ]
  },
  {
    "replacement": "Sora 2",
    "aliases": [
      "Сора 2"
    ],
    "positive": [
      "OpenAI",
      "видео"
    ],
    "negative": [
      "ссора",
      "имя Сора",
      "игра Kingdom Hearts"
    ]
  },
  {
    "replacement": "Runway Gen-4",
    "aliases": [
      "Ранвей Gen 4"
    ],
    "positive": [
      "AI",
      "видео",
      "Gen-4"
    ],
    "negative": [
      "runway взлетная полоса",
      "fashion runway"
    ]
  },
  {
    "replacement": "FLUX Kontext",
    "aliases": [
      "Флакс контекст",
      "Флюкс контекст",
      "FLUX",
      "Флюкс",
      "Флакс",
      "флюкс модель"
    ],
    "positive": [
      "Black",
      "Forest",
      "Labs",
      "image",
      "Black Forest Labs",
      "изображение",
      "генерация",
      "модель",
      "Kontext",
      "Freepik"
    ],
    "negative": [
      "flux архитектура",
      "флюс для пайки",
      "поток"
    ]
  },
  {
    "replacement": "Nano Banana",
    "aliases": [
      "Нано банан",
      "Нано Банана",
      "NanoBanana",
      "банана модель",
      "nano banana pro"
    ],
    "positive": [
      "Google",
      "image",
      "model",
      "Gemini",
      "изображение",
      "генерация",
      "модель",
      "Freepik"
    ],
    "negative": [
      "банан",
      "фрукт"
    ]
  },
  {
    "replacement": "Imagen 4",
    "aliases": [
      "Имейджен 4"
    ],
    "positive": [
      "Google",
      "image",
      "model"
    ],
    "negative": [
      "image gen как общий режим"
    ]
  },
  {
    "replacement": "GPT Image",
    "aliases": [
      "Джипити имидж",
      "gpt-image",
      "GPT Image 2",
      "GPT Image 2.0",
      "жпт имидж",
      "GPT image HQ"
    ],
    "positive": [
      "OpenAI",
      "image",
      "generation",
      "изображение",
      "генерация",
      "редактирование",
      "image API"
    ],
    "negative": [
      "просто gpt текст"
    ]
  },
  {
    "replacement": "Freepik",
    "aliases": [
      "Фрипик",
      "фрипек",
      "фри пик",
      "фрипике",
      "Magnific"
    ],
    "positive": [
      "AI",
      "image",
      "generator",
      "изображение",
      "генерация",
      "вектор",
      "стоки",
      "Magnific"
    ],
    "negative": [
      "free pick"
    ]
  },
  {
    "replacement": "Higgsfield",
    "aliases": [
      "Хигсфилд",
      "Хиггсфилд",
      "хигс филд",
      "хигсфилде"
    ],
    "positive": [
      "AI",
      "video",
      "camera",
      "видео",
      "camera control",
      "липсинк",
      "image-to-video"
    ],
    "negative": [
      "поле Хиггса"
    ]
  },
  {
    "replacement": "CapCut",
    "aliases": [
      "Кап кут",
      "Капкат",
      "Cap Cut",
      "капкате"
    ],
    "positive": [
      "монтаж",
      "видео",
      "рилс",
      "shorts",
      "шаблон",
      "субтитры"
    ],
    "negative": [
      "cap cut как действие"
    ]
  },
  {
    "replacement": "Adobe Premiere Pro",
    "aliases": [
      "Премьер Про",
      "Premiere Pro",
      "Adobe Premiere",
      "Премьера",
      "премьер"
    ],
    "positive": [
      "монтаж",
      "видео",
      "таймлайн",
      "экспорт",
      "ролик"
    ],
    "negative": [
      "премьера фильма",
      "премьер министр"
    ]
  },
  {
    "replacement": "Adobe After Effects",
    "aliases": [
      "Афтер Эффектс",
      "After Effects",
      "AfterEffects",
      "афтер",
      "афтер эффект",
      "аfter",
      "AE"
    ],
    "positive": [
      "моушн",
      "композитинг",
      "анимация",
      "keyframe",
      "видео"
    ],
    "negative": [
      "после эффектов"
    ]
  },
  {
    "replacement": "DaVinci Resolve",
    "aliases": [
      "Давинчи резолв",
      "Давинчи",
      "Da Vinci Resolve",
      "да винчи резолв"
    ],
    "positive": [
      "монтаж",
      "грейдинг",
      "цветокоррекция",
      "видео",
      "таймлайн"
    ],
    "negative": [
      "Леонардо да Винчи"
    ]
  },
  {
    "replacement": "Blender 4.5 LTS",
    "aliases": [
      "Блендер 4.5"
    ],
    "positive": [
      "3D",
      "рендер"
    ],
    "negative": [
      "кухонный блендер"
    ]
  },
  {
    "replacement": "Telegram",
    "aliases": [
      "Телега",
      "Телеграм",
      "тг",
      "tg",
      "телеге",
      "telegram канал"
    ],
    "positive": [
      "канал",
      "бот",
      "пост",
      "чат",
      "аудитория",
      "рассылка"
    ],
    "negative": [
      "телеграмма"
    ]
  },
  {
    "replacement": "YouTube",
    "aliases": [
      "Ютьюб",
      "Ютуб",
      "You Tube",
      "ютюб",
      "ютубе"
    ],
    "positive": [
      "канал",
      "видео",
      "shorts",
      "шортс",
      "обложка",
      "ролик"
    ],
    "negative": []
  },
  {
    "replacement": "YouTube Shorts",
    "aliases": [
      "Ютуб шортс",
      "Shorts",
      "шортс",
      "шорты"
    ],
    "positive": [
      "YouTube",
      "вертикальное",
      "видео",
      "вертикальное видео",
      "ролик",
      "контент"
    ],
    "negative": [
      "шорты одежда"
    ]
  },
  {
    "replacement": "VK",
    "aliases": [
      "Вэ Ка",
      "ВК",
      "ВКонтакте",
      "vk.com"
    ],
    "positive": [
      "соцсеть",
      "пост",
      "реклама",
      "сообщество",
      "клипы"
    ],
    "negative": [
      "инициалы В.К."
    ]
  },
  {
    "replacement": "Instagram",
    "aliases": [
      "Инста",
      "Инстаграм",
      "инст",
      "insta",
      "инсте",
      "инсту",
      "IG"
    ],
    "positive": [
      "рилс",
      "сторис",
      "профиль",
      "пост",
      "директ",
      "охваты"
    ],
    "negative": []
  },
  {
    "replacement": "Instagram Reels",
    "aliases": [
      "Рилз",
      "Reels",
      "Рилс",
      "Рилсы",
      "реелс"
    ],
    "positive": [
      "Instagram",
      "видео",
      "охваты",
      "вертикальный ролик",
      "профиль"
    ],
    "negative": [
      "катушка reels",
      "reel как барабан"
    ]
  },
  {
    "replacement": "TikTok",
    "aliases": [
      "Тик ток",
      "ТикТок",
      "Tik Tok",
      "тиктоке"
    ],
    "positive": [
      "короткие",
      "видео",
      "короткий ролик",
      "тренд",
      "алгоритм",
      "реклама"
    ],
    "negative": [
      "тик-так"
    ]
  },
  {
    "replacement": "Google Ads",
    "aliases": [
      "Гугл эдс",
      "Гугл Ads",
      "google adwords",
      "гугл реклама"
    ],
    "positive": [
      "реклама",
      "кампания",
      "ключи",
      "performance",
      "кабинет"
    ],
    "negative": [
      "ads generic"
    ]
  },
  {
    "replacement": "Яндекс Директ",
    "aliases": [
      "Яндекс direct",
      "Директ",
      "Yandex Direct",
      "директе"
    ],
    "positive": [
      "реклама",
      "РСЯ",
      "ключи",
      "кампания",
      "поиск",
      "кабинет"
    ],
    "negative": [
      "Instagram Direct",
      "директ сообщения",
      "direct URL"
    ]
  },
  {
    "replacement": "GA4",
    "aliases": [
      "Га четыре"
    ],
    "positive": [
      "аналитика",
      "события"
    ],
    "negative": [
      "га как звук"
    ]
  },
  {
    "replacement": "Google Tag Manager",
    "aliases": [
      "Гугл таг менеджер",
      "GTM",
      "гугл тег менеджер",
      "джи ти эм",
      "тэг менеджер"
    ],
    "positive": [
      "теги",
      "пиксель",
      "аналитика",
      "события",
      "сайт"
    ],
    "negative": []
  },
  {
    "replacement": "amoCRM",
    "aliases": [
      "Амо срм",
      "АмоCRM",
      "Амо",
      "amo CRM",
      "амо црм",
      "амосрм"
    ],
    "positive": [
      "CRM",
      "сделки",
      "лиды",
      "сделка",
      "лид",
      "воронка",
      "продажи"
    ],
    "negative": [
      "амо как имя"
    ]
  },
  {
    "replacement": "Bitrix24",
    "aliases": [
      "Битрикс двадцать четыре"
    ],
    "positive": [
      "CRM",
      "портал",
      "сделки"
    ],
    "negative": [
      "1C-Bitrix CMS"
    ]
  },
  {
    "replacement": "n8n",
    "aliases": [
      "Эн эйт эн",
      "Нейтэн"
    ],
    "positive": [
      "workflow",
      "автоматизация"
    ],
    "negative": []
  },
  {
    "replacement": "Zapier",
    "aliases": [
      "Зэпиер",
      "Запир",
      "запьер",
      "запиер",
      "зэпьер"
    ],
    "positive": [
      "автоматизация",
      "zap",
      "интеграция",
      "webhook"
    ],
    "negative": []
  },
  {
    "replacement": "Airtable",
    "aliases": [
      "Эйртейбл",
      "Air Table",
      "эйр тейбл",
      "airtable база"
    ],
    "positive": [
      "таблица",
      "база",
      "no-code",
      "автоматизация"
    ],
    "negative": [
      "air table"
    ]
  },
  {
    "replacement": "Typeform",
    "aliases": [
      "Тайп форма",
      "Тайпформ",
      "Type Form",
      "тайпформе"
    ],
    "positive": [
      "форма",
      "лид",
      "квиз",
      "опрос"
    ],
    "negative": []
  },
  {
    "replacement": "Figma",
    "aliases": [
      "Фигме",
      "Фигму",
      "Figma Design",
      "фигма дизайн",
      "фигма-дизайн",
      "Фигма",
      "Фигмы",
      "Фигмой"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "автолэйаут",
      "компонент",
      "вариант"
    ],
    "negative": [
      "фигма как растение",
      "фиг",
      "фигурка"
    ]
  },
  {
    "replacement": "Dev Mode",
    "aliases": [
      "Дев мод",
      "режим разработчика",
      "девмоде",
      "девмод"
    ],
    "positive": [
      "Figma",
      "фигма",
      "макет",
      "handoff",
      "верстка",
      "inspect"
    ],
    "negative": [
      "режим разработчика браузера",
      "developer mode телефона"
    ]
  },
  {
    "replacement": "Framer",
    "aliases": [
      "Фрамер",
      "фреймэр",
      "фреймере",
      "Framer AI",
      "Фреймер",
      "Фреймера",
      "Фреймером"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "no-code",
      "анимация",
      "CMS"
    ],
    "negative": [
      "рамка",
      "frame",
      "фрейм"
    ]
  },
  {
    "replacement": "Webflow",
    "aliases": [
      "Web flow",
      "Веб флоу",
      "Вэбфлоу",
      "Вебфло",
      "веб фло",
      "Вебфлоу"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "конструктор",
      "CMS",
      "анимация"
    ],
    "negative": [
      "поток",
      "flow",
      "веб поток"
    ]
  },
  {
    "replacement": "Tilda",
    "aliases": [
      "Тилда",
      "тильде",
      "тильду",
      "тильдой",
      "Tilda Publishing",
      "Тильда",
      "Тильды"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "Zero Block",
      "конструктор"
    ],
    "negative": [
      "тильда символ",
      "~"
    ]
  },
  {
    "replacement": "WordPress",
    "aliases": [
      "Word Press",
      "ворд пресс",
      "Ворд прес",
      "вордпрес",
      "вордпрессе",
      "Вордпресс",
      "WP",
      "ВП",
      "Вордпресса",
      "Вордпрессом"
    ],
    "positive": [
      "код",
      "репозиторий",
      "проект",
      "сайт",
      "приложение",
      "фронтенд",
      "бэкенд",
      "api",
      "деплой",
      "компонент",
      "фреймворк",
      "CMS",
      "плагин",
      "тема",
      "шаблон"
    ],
    "negative": [
      "Microsoft Word",
      "документ Word"
    ]
  },
  {
    "replacement": "Wix",
    "aliases": [
      "Викс сайт",
      "Wix Studio",
      "виксе",
      "виксом",
      "Викс",
      "Викса"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "конструктор"
    ],
    "negative": [
      "VIX индекс",
      "викс как имя"
    ]
  },
  {
    "replacement": "Readymag",
    "aliases": [
      "Ready mag",
      "Реди маг",
      "Рэди маг",
      "РэдиМаг",
      "Редимаг",
      "Редимага",
      "Редимаге",
      "Редимагом"
    ],
    "positive": [
      "дизайн",
      "макет",
      "прототип",
      "экран",
      "сайт",
      "лендинг",
      "интерфейс",
      "ui",
      "ux",
      "figma",
      "верстка",
      "портфолио",
      "конструктор"
    ],
    "negative": []
  },
  {
    "replacement": "Canva",
    "aliases": [
      "Кэнва",
      "Canva Pro",
      "канве",
      "канву",
      "Канва",
      "Канвы",
      "Канвой"
    ],
    "positive": [
      "дизайн",
      "баннер",
      "презентация",
      "smm",
      "шаблон",
      "креатив"
    ],
    "negative": [
      "канва как ткань"
    ]
  },
  {
    "replacement": "Adobe Photoshop",
    "aliases": [
      "Adobe Photo Shop",
      "фото шоп",
      "фотошопе",
      "фотошопом",
      "Пхотошоп",
      "Фотошоп",
      "Photoshop",
      "PS",
      "Фотошопа"
    ],
    "positive": [
      "дизайн",
      "ретушь",
      "изображение",
      "генеративная",
      "заливка",
      "слои",
      "генеративная заливка",
      "маска"
    ],
    "negative": [
      "фотошоп как глагол без продукта"
    ]
  },
  {
    "replacement": "Notion",
    "aliases": [
      "Ношен",
      "Ноушн",
      "ноушене",
      "Ноушен",
      "Ноушена",
      "Ноушеном"
    ],
    "positive": [
      "база",
      "знаний",
      "документация",
      "таблица",
      "таски",
      "шаблон",
      "база знаний"
    ],
    "negative": [
      "notion как понятие"
    ]
  },
  {
    "replacement": "Trello",
    "aliases": [
      "Трело",
      "трелле",
      "трелло доска",
      "Трелло"
    ],
    "positive": [
      "доска",
      "карточка",
      "канбан",
      "таска"
    ],
    "negative": []
  },
  {
    "replacement": "ClickUp",
    "aliases": [
      "Клик ап",
      "Click Up",
      "кликапе",
      "клик апе",
      "Кликап",
      "Кликапа",
      "Кликапом"
    ],
    "positive": [
      "таски",
      "документы",
      "проект",
      "автоматизация"
    ],
    "negative": [
      "click up как действие"
    ]
  },
  {
    "replacement": "HTML",
    "aliases": [
      "эйч т м л",
      "аш ти эм эл",
      "html5",
      "Эйч-ти-эм-эл"
    ],
    "positive": [
      "верстка",
      "сайт",
      "теги",
      "семантика",
      "страница"
    ],
    "negative": [
      "письмо html без веб контекста"
    ]
  },
  {
    "replacement": "CSS",
    "aliases": [
      "си эс эс",
      "цсс",
      "css3",
      "Си-эс-эс"
    ],
    "positive": [
      "стили",
      "верстка",
      "классы",
      "адаптив",
      "сайт"
    ],
    "negative": []
  },
  {
    "replacement": "Sass",
    "aliases": [
      "сас",
      "Сасс"
    ],
    "positive": [
      "scss",
      "css",
      "стили",
      "препроцессор"
    ],
    "negative": [
      "sass как дерзость"
    ]
  },
  {
    "replacement": "SCSS",
    "aliases": [
      "эс си эс эс",
      "сксс",
      "scss файл"
    ],
    "positive": [
      "sass",
      "css",
      "стили",
      "переменные"
    ],
    "negative": []
  },
  {
    "replacement": "Vue.js",
    "aliases": [
      "Vue JS",
      "вью джс",
      "вьюшка",
      "вьюе",
      "Vue",
      "Вью",
      "Вьюшки"
    ],
    "positive": [
      "компонент",
      "frontend",
      "Nuxt",
      "template",
      "reactivity"
    ],
    "negative": [
      "view",
      "вью как вид"
    ]
  },
  {
    "replacement": "Nuxt",
    "aliases": [
      "Нукст",
      "нюкст",
      "Nuxt.js",
      "Nuxt JS",
      "Накст",
      "Накста",
      "Наксте",
      "Накстом"
    ],
    "positive": [
      "Vue",
      "SSR",
      "серверный",
      "рендеринг",
      "frontend",
      "серверный рендеринг"
    ],
    "negative": []
  },
  {
    "replacement": "Svelte",
    "aliases": [
      "Свелте",
      "свэлт",
      "свелт js",
      "Свелт",
      "Свелта",
      "Свелтом"
    ],
    "positive": [
      "компонент",
      "frontend",
      "SvelteKit",
      "компилятор"
    ],
    "negative": []
  },
  {
    "replacement": "SvelteKit",
    "aliases": [
      "Свелт кит",
      "Svelte Kit",
      "свелткит",
      "свэлт кит"
    ],
    "positive": [
      "Svelte",
      "роутинг",
      "SSR",
      "frontend"
    ],
    "negative": []
  },
  {
    "replacement": "Cursor",
    "aliases": [
      "Курсор",
      "Курсоре",
      "Курсора",
      "Кёрсор",
      "курсор ai",
      "cursor editor"
    ],
    "positive": [
      "кодинг-агент",
      "редактор",
      "IDE",
      "репозиторий",
      "агент",
      "AI"
    ],
    "negative": [
      "курсор мыши",
      "указатель",
      "CSS cursor"
    ]
  },
  {
    "replacement": "Make",
    "aliases": [
      "Make.com",
      "Мейк",
      "Мейке",
      "Мэйк",
      "make сценарий",
      "make automation"
    ],
    "positive": [
      "сценарий",
      "интеграция",
      "автоматизация",
      "webhook",
      "модуль"
    ],
    "negative": [
      "make команда",
      "makefile"
    ]
  },
  {
    "replacement": "OpenAI Codex",
    "aliases": [
      "Кодекс",
      "Кодэкс",
      "кодекс агент",
      "чатгпт кодекс",
      "OpenAI кодекс"
    ],
    "positive": [
      "код",
      "репозиторий",
      "агент",
      "ChatGPT",
      "OpenAI",
      "PR"
    ],
    "negative": [
      "юридический кодекс",
      "кодекс законов"
    ]
  },
  {
    "replacement": "Gemini",
    "aliases": [
      "Джемини",
      "Гемини",
      "Геминай",
      "Джимини",
      "Google Gemini"
    ],
    "positive": [
      "Google",
      "нейросеть",
      "модель",
      "Veo",
      "Nano Banana",
      "промпт"
    ],
    "negative": [
      "гороскоп",
      "близнецы",
      "криптобиржа Gemini"
    ]
  },
  {
    "replacement": "shadcn/ui",
    "aliases": [
      "шадсиэн ui",
      "шадсн",
      "shad cn",
      "shadcn ui",
      "шад си эн"
    ],
    "positive": [
      "React",
      "Tailwind",
      "компоненты",
      "UI",
      "button"
    ],
    "negative": []
  }
];
