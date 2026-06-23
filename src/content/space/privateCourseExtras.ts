import type { LearnLang, LearnMaterial, LearnMissingItem, LearnPromptBlock } from "./learn";

type LessonExtras = {
  materials: Partial<Record<LearnLang, LearnMaterial[]>>;
  prompts?: Partial<Record<LearnLang, LearnPromptBlock[]>>;
  missingItems?: Partial<Record<LearnLang, LearnMissingItem[]>>;
};

const PENDING_HREF = "#";

function link(title: string, meta: string, href: string, actionLabel = "Перейти"): LearnMaterial {
  return { title, meta, kind: "link", actionLabel, href };
}

function pending(title: string, meta: string, _actionLabel = "Перейти", kind: LearnMaterial["kind"] = "link"): LearnMaterial {
  const actionLabel = kind === "link" ? "Перейти" : "Скачать";
  return { title, meta, kind, actionLabel, href: PENDING_HREF, status: "pending" };
}

function prompt(id: string, title: string, meta: string, sourceLabel?: string): LearnPromptBlock {
  return { id, title, meta, sourceLabel, language: "text" };
}

function promptPending(title: string, meta: string): LearnPromptBlock {
  return { title, meta, status: "pending", language: "text" };
}

function missing(title: string, meta: string, actionLabel = "Добрать"): LearnMissingItem {
  return { title, meta, actionLabel };
}

const links = {
  optenPromptImprover: link(
    "Opten генератор промптов (ChatGPT)",
    "GPT для генерации промптов под изображения",
    "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    "Перейти",
  ),
  syntx: link("Syntx", "Платформа для запуска AI-моделей, изображений и видео", "https://syntx.ai/welcome/GlUETIt6"),
  higgsfield: link("Higgsfield", "AI-видео, камера, motion и MCP-интеграция", "https://higgsfield.ai/"),
};

const optenSkill: LearnMaterial = {
  title: "Opten скилл для генерации промптов (Claude)",
  meta: "ZIP-архив Claude Skill для генерации промптов",
  kind: "pdf",
  actionLabel: "Скачать",
  href: "/assets/space/courses/ai-content-marketing-2026/opten-skill.zip",
};

const modelCheatsheet: LearnMaterial = {
  title: "Шпаргалка по моделям",
  meta: "Nano Banana, GPT Image, Midjourney, Recraft: когда что брать",
  kind: "pdf",
  actionLabel: "Скачать",
  href: "/assets/space/courses/ai-content-marketing-2026/lesson-4-model-cheatsheet.pdf",
};

const characterReferenceSheet: LearnMaterial = {
  title: "Чит-лист с вашей внешностью",
  meta: "Character reference sheet для сохранения внешности персонажа",
  kind: "link",
  actionLabel: "Скачать",
  href: "/assets/space/courses/ai-content-marketing-2026/lesson-5-character-reference-sheet.png",
};

const requiredCourseMaterials = [links.syntx, links.optenPromptImprover, optenSkill];
const removedSharedMaterialHrefs = new Set(["https://chatgpt.com/", "https://claude.ai/", "https://opten.space/"]);

function withRequiredCourseMaterials(materials: LearnMaterial[] | undefined) {
  const list = materials ?? [];
  const lessonMaterials = list.filter((material) => {
    if (removedSharedMaterialHrefs.has(material.href)) return false;
    return !requiredCourseMaterials.some((required) => required.href === material.href);
  });
  const withModel = lessonMaterials.some((material) => material.href === modelCheatsheet.href) ? lessonMaterials : [...lessonMaterials, modelCheatsheet];
  return [...requiredCourseMaterials, ...withModel];
}

const privateCourseLessonExtras: Record<string, LessonExtras> = {
  "lesson-1-prompting": {
    materials: {
      ru: [
        link(
          "VPN который рекомендую",
          "Рекомендованный VPN для доступа к зарубежным сервисам",
          "https://sotavpn.app/?utm_source=f37531d3-c013-45cc-858c-9e1690fa3d43",
        ),
        link(
          "Сервис для оплаты зарубежных сервисов",
          "Telegram-бот для оплаты зарубежных сервисов",
          "https://t.me/zarub_robot?start=ref_xAulfY",
        ),
      ],
    },
    prompts: {
      ru: [
        prompt("l1-nova-formula-image", "Пример промпта по формуле", "задача -> контекст -> сцена -> стиль -> ограничения -> формат"),
      ],
    },
  },
  "lesson-2-ai-services": {
    materials: {
      ru: [
        links.syntx,
        links.higgsfield,
      ],
    },
  },
  "lesson-3-logo-generation": {
    materials: {
      ru: [
        link("Recraft", "Сервис для генерации векторного логотипа", "https://www.recraft.ai/"),
        links.higgsfield,
        link("Pinterest-референс логотипа", "Референс логотипа из урока", "https://ru.pinterest.com/pin/440789882308217256/"),
        link("Quiver", "AI-инструмент для работы с визуалом", "https://quiver.ai/"),
        link("Ролик про Quiver", "Instagram-видео с примером Quiver", "https://www.instagram.com/p/DVQyhkXDSSk/", "Перейти"),
      ],
    },
    prompts: {
      ru: [
        prompt("l3-opten-recraft-logo", "Запрос в Opten для Recraft", "Короткий запрос из озвучки"),
        prompt("l3-recraft-logo", "Recraft V4: логотип NOVA", "Prompt pack, блок 7", "course-v2-prompt-pack.md"),
      ],
    },
  },
  "lesson-4-photo-generation": {
    materials: {
      ru: [
        links.syntx,
        {
          title: "Шпаргалка по моделям",
          meta: "Nano Banana, GPT Image, Midjourney, Recraft: когда что брать",
          kind: "pdf",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-4-model-cheatsheet.pdf",
        },
        {
          title: "Результат первой генерации Cofe1",
          meta: "Фото кофейной сцены с жёлтыми акцентами из урока",
          kind: "link",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-4-cofe1-result.jpg",
        },
      ],
    },
    prompts: {
      ru: [
        prompt("l4-cofe1-photo", "Cofe1: фото кофейной сцены", "Точный prompt из урока"),
      ],
    },
  },
  "lesson-5-references": {
    materials: {
      ru: [
        links.syntx,
        link("Pinterest-референсы", "Брендовые референсы NOVA из 5 урока", "https://ru.pinterest.com/pin/863354191108943126/", "Перейти"),
        characterReferenceSheet,
      ],
    },
    prompts: {
      ru: [
        prompt("l5-character-reference-sheet", "Генерация чит-листа с вашей внешностью", "GPT Image 2: 4K, высокая детализация, strict identity preservation"),
        prompt("l5-opten-references", "Opten: сохранить внешность по референсам", "Запрос из озвучки"),
        prompt("l5-nano-barista-identity", "Кадр с баристой NOVA по референсам", "Точный prompt из урока"),
      ],
    },
  },
  "lesson-6-image-editing": {
    materials: {
      ru: [
        pending("Syntx editor / модель редактирования", "Добавить актуальную ссылку на инструмент", "Нужно добавить"),
        pending("Шпаргалка по маскам", "Photoshop/editor: где маска, что выделять, чего избегать", "Оформить", "pdf"),
        pending("До/после редактирования", "Добавить исходную картинку и финальный вариант", "Загрузить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        prompt("l6-remove-text", "Короткая правка: убрать текст", "Фраза из озвучки"),
        prompt("l6-remove-logos", "Короткая правка: убрать логотипы", "Фраза из озвучки"),
        promptPending("Полные edit-prompts из видео", "Если на экране были длинные тексты для Syntx/Photoshop, нужно забрать точный текст."),
      ],
    },
    missingItems: {
      ru: [
        missing("Настройки маски", "Точные параметры и область выделения."),
        missing("Горячие клавиши Photoshop", "Добавить только если они реально показывались."),
        missing("До/после", "Нужны ассеты для страницы урока."),
      ],
    },
  },
  "lesson-7-ai-video": {
    materials: {
      ru: [
        links.syntx,
        pending("Kling", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("Seedance", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("Шпаргалка по видеоформатам", "Text-to-video, image-to-video, 9:16, длительность, кредиты", "Оформить", "pdf"),
        pending("Результат ролика 9:16", "Загрузить финальное видео или preview", "Загрузить", "video"),
      ],
    },
    prompts: {
      ru: [
        prompt("l7-kling-i2v", "Kling 3.0 Image-to-Video", "Prompt pack, блок 8", "course-v2-prompt-pack.md"),
        prompt("l7-veo-vertical", "Veo 3.1: вертикальный ролик", "Prompt pack, блок 9", "course-v2-prompt-pack.md"),
      ],
    },
    missingItems: {
      ru: [
        missing("Модель и настройки", "Длительность, разрешение 720p/другое, режим генерации."),
        missing("Стартовый кадр", "Какой кадр был выбран для image-to-video."),
        missing("Точный prompt из видео", "Если использовался другой текст, забрать с экрана."),
      ],
    },
  },
  "lesson-8-frames": {
    materials: {
      ru: [
        links.syntx,
        pending("Kling keyframes", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("Start frame", "Загрузить первый keyframe", "Загрузить", "pdf"),
        pending("End frame", "Загрузить последний keyframe", "Загрузить", "pdf"),
        pending("Шпаргалка keyframes", "Что писать про движение между кадрами", "Оформить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        prompt("l8-keyframe-transition", "Пример prompt для перехода", "Черновой пример, точный prompt из видео нужно добрать"),
        promptPending("Точный keyframe prompt", "В ТЗ указано, что точный prompt не раскрыт полностью и его нужно взять с экрана."),
      ],
    },
    missingItems: {
      ru: [
        missing("Start frame и end frame", "Нужны два изображения из урока."),
        missing("Настройки длительности и разрешения", "Забрать с экрана."),
      ],
    },
  },
  "lesson-9-storytelling": {
    materials: {
      ru: [
        links.syntx,
        pending("Kling", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("Seedance", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("Инструкция Seedance по @-референсам", "Загрузить/связать opten-model-rules/seedance-2.0.md", "Загрузить", "pdf"),
        pending("Шпаргалка storyboard", "Multi-shot, сцены, раскадровка, плохой дубль", "Оформить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        prompt("l9-seedance-multishot", "Seedance 2.0: мультикадровый ролик", "Prompt pack, блок 10", "course-v2-prompt-pack.md"),
        prompt("l9-idea-15s", "Идея на 15 секунд", "Запрос из озвучки"),
        prompt("l9-storyboard", "Раскадровка по сценам", "Запрос из озвучки"),
      ],
    },
    missingItems: {
      ru: [
        missing("Точный prompt под Kling/Seedance", "Если финальный prompt отличался от prompt pack, забрать с экрана."),
        missing("Монтажные правки", "Какие куски были подрезаны или заменены."),
      ],
    },
  },
  "lesson-10-prompt-library": {
    materials: {
      ru: [
        links.syntx,
        pending("Bible Switch X", "Проверить точное название модели и добавить ссылку внутри Syntx", "Проверить"),
        pending("Исходное видео", "Загрузить исходник или preview", "Загрузить", "video"),
        pending("Первый кадр", "Загрузить frame, с которого начиналась правка", "Загрузить", "pdf"),
        pending("Финальный результат", "Загрузить итоговое видео", "Загрузить", "video"),
        pending("Checklist маски", "Голова, руки, одежда, фон", "Оформить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        promptPending("Точный prompt Bible Switch X", "В озвучке есть смысл: заменить фон/одежду, сохранить лицо и позу. Нужен точный текст с экрана."),
      ],
    },
    missingItems: {
      ru: [
        missing("Точное название модели", "ТЗ отдельно просит проверить Bible Switch X по интерфейсу."),
        missing("Настройки маски и разрешения", "Забрать с экрана."),
        missing("Файлы до/после", "Исходное видео, первый кадр, финальный результат."),
      ],
    },
  },
  "lesson-11-ai-avatars": {
    materials: {
      ru: [
        links.syntx,
        pending("ElevenLabs", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("HeyGen", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("Midjourney", "Добавить актуальную ссылку или путь запуска", "Нужно добавить"),
        pending("Шпаргалка эмоций", "Эмоции в квадратных скобках для озвучки", "Оформить", "pdf"),
        pending("Персонаж NOVA и аудио", "Загрузить mascot/persona image и аудиофайл", "Загрузить", "video"),
      ],
    },
    prompts: {
      ru: [
        prompt("l11-midjourney-opten", "Запрос в Opten для Midjourney 8.1", "Из сценария начитки"),
        promptPending("Финальный Midjourney prompt", "Точный английский prompt и настройки 9:16 нужно забрать с экрана."),
      ],
    },
    missingItems: {
      ru: [
        missing("Настройки голоса ElevenLabs", "Голос, эмоции, voice settings."),
        missing("Настройки HeyGen", "Формат, загрузка фото и аудио, lipsync."),
        missing("Персонаж/маскот NOVA", "Добавить изображение в материалы."),
      ],
    },
  },
  "lesson-12-motion-control": {
    materials: {
      ru: [
        links.syntx,
        pending("Kling Motion Control", "Добавить актуальную ссылку или путь внутри Syntx", "Нужно добавить"),
        pending("ElevenLabs Voice Changer", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("CapCut", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("Референс движения", "Загрузить reference video", "Загрузить", "video"),
        pending("Новый персонаж и первый кадр", "Загрузить image assets", "Загрузить", "pdf"),
        pending("Инструкция Kling Motion Control", "Загрузить/связать opten-model-rules/kling-motion-control.md", "Загрузить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        prompt("l12-kling-motion", "Kling Motion Control 3.0", "Prompt pack, блок 11", "course-v2-prompt-pack.md"),
        prompt("l12-short-replace-person", "Короткий смысл prompt", "Из озвучки"),
      ],
    },
    missingItems: {
      ru: [
        missing("Voice Changer", "Настройки изменения голоса."),
        missing("Kling Motion Control", "Настройки motion/reference/background source."),
        missing("CapCut", "Монтажная схема и порядок сборки."),
      ],
    },
  },
  "lesson-13-upscale": {
    materials: {
      ru: [
        pending("Инструмент апскейла", "Проверить, какой сервис реально показан в финальном видео", "Проверить"),
        pending("Magnific/Topaz/Syntx Upscale", "Если показывались, добавить отдельные ссылки", "Нужно добавить"),
        pending("Таблица настроек апскейла", "scale 2x, creativity/similarity, Proteus/Gaia или аналог", "Оформить", "pdf"),
        pending("notebooklm-upscale-lesson.md", "Загрузить или перенести выдержки в материал урока", "Загрузить", "pdf"),
      ],
    },
    missingItems: {
      ru: [
        missing("Какой сервис показан", "Проверить по видео, не гадать."),
        missing("Точные значения ползунков", "Фото-апскейл и видео-апскейл."),
        missing("Модель видео-апскейла", "Название и режим."),
      ],
    },
  },
  "lesson-14-codex": {
    materials: {
      ru: [
        pending("Codex app / OpenAI", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("Шаблон AGENTS.md для NOVA", "Загрузить готовый файл", "Загрузить", "pdf"),
        pending("Higgsfield MCP", "Добавить ссылку/инструкцию подключения", "Нужно добавить"),
      ],
    },
    prompts: {
      ru: [
        prompt("l14-higgsfield-auth", "Авторизация Higgsfield MCP", "Фраза из сценария"),
        prompt("l14-install-skill", "Установка skill", "Короткая команда из урока"),
        prompt("l14-check-mcp", "Проверка MCP", "Короткая команда из урока"),
        prompt("l14-opten-codex", "Opten в Codex", "Короткая команда из урока"),
        promptPending("Точные команды установки", "Команды MCP/skill и настройки Codex нужно забрать с экрана."),
      ],
    },
    missingItems: {
      ru: [
        missing("Настройки Codex", "Режим, доступ к файлам, модель, reasoning level."),
        missing("Команды MCP/skill", "Точные команды и ссылки."),
        missing("AGENTS.md", "Файл или шаблон для скачивания."),
      ],
    },
  },
  "lesson-15-higgsfield-mcp": {
    materials: {
      ru: [
        links.higgsfield,
        pending("Higgsfield MCP", "Добавить ссылку/инструкцию MCP", "Нужно добавить"),
        pending("Reference video", "Нужна точная ссылка на Pinterest или другой источник", "Нужно добавить", "video"),
        pending("Output с результатом", "Загрузить папку/output или архив", "Загрузить", "pdf"),
        pending("Первый кадр и финальное видео", "Загрузить generated image и result video", "Загрузить", "video"),
      ],
    },
    prompts: {
      ru: [
        prompt("l15-higgsfield-mcp-video-analysis", "Higgsfield MCP + Video Analysis", "Из сценария урока 15", "course-10-lessons.v5.draft.md"),
        promptPending("Промпты первого кадра и видео", "Точные prompts из output/Codex нужно забрать после генерации."),
      ],
    },
    missingItems: {
      ru: [
        missing("Reference video URL", "Конкретная ссылка на ролик."),
        missing("Файлы из output", "Что Codex создал: prompt, image, video, logs."),
        missing("Финальные prompts", "Текст для первого кадра и видео из output."),
      ],
    },
  },
  "lesson-16-nova-website": {
    materials: {
      ru: [
        pending("Codex", "Добавить актуальную ссылку", "Нужно добавить"),
        pending("Vercel", "Добавить ссылку на деплой или инструкцию", "Нужно добавить"),
        pending("Reg.ru", "Добавить ссылку/настройки домена, если показывались", "Нужно добавить"),
        pending("Playwright", "Добавить ссылку/команды проверки", "Нужно добавить"),
        pending("Архив ассетов NOVA", "Логотип, картинки, видео, аватар, prompt pack", "Загрузить", "pdf"),
        pending("Image-to-code skill", "Добавить инструкцию установки, если использовался", "Нужно добавить", "pdf"),
      ],
    },
    prompts: {
      ru: [
        prompt("l16-codex-landing", "Codex app: вайб-кодим сайт", "Prompt pack, блок 13", "course-v2-prompt-pack.md"),
        prompt("l16-image-to-code", "Image-to-code prompt", "Из сценария урока 16", "course-10-lessons.v5.draft.md"),
      ],
    },
    missingItems: {
      ru: [
        missing("URL деплоя", "Добавить, если есть готовый Vercel deploy."),
        missing("Настройки адаптива", "Особенно iPhone 15 Pro и мобильные правки."),
        missing("Форма/CRM/бронирование", "Добавить только если реально показано на экране."),
        missing("Домен и DNS/Reg.ru", "Забрать настройки, если они есть в видео."),
      ],
    },
  },
};

export function getPrivateCourseLessonExtras(slug: string): LessonExtras | undefined {
  const extras = privateCourseLessonExtras[slug];
  if (!extras) return undefined;

  return {
    ...extras,
    materials: {
      ...extras.materials,
      ru: withRequiredCourseMaterials(extras.materials.ru),
    },
  };
}
