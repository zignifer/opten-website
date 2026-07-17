import type { LearnLang, LearnMaterial, LearnMissingItem, LearnPromptBlock } from "./learn";

type LessonExtras = {
  materials: Partial<Record<LearnLang, LearnMaterial[]>>;
  prompts?: Partial<Record<LearnLang, LearnPromptBlock[]>>;
  missingItems?: Partial<Record<LearnLang, LearnMissingItem[]>>;
};

function link(title: string, meta: string, href: string, actionLabel = "Перейти"): LearnMaterial {
  return { title, meta, kind: "link", actionLabel, href };
}

function prompt(id: string, title: string, meta: string, sourceLabel?: string, body?: string): LearnPromptBlock {
  return { id, title, meta, sourceLabel, body, language: "text" };
}

const links = {
  syntx: link("Syntx", "Платформа для генерации фото и видео", "https://syntx.ai/welcome/GlUETIt6"),
  higgsfield: link("Higgsfield", "Платформа для генерации и управления видео", "https://higgsfield.ai/"),
  higgsfieldMcp: link("Higgsfield MCP", "MCP-интеграция для анализа и генерации видео", "https://higgsfield.ai/mcp"),
};

const modelCheatsheet: LearnMaterial = {
  title: "Шпаргалка по моделям",
  meta: "Список актуальных нейросетей и их задач",
  kind: "pdf",
  actionLabel: "Скачать",
  href: "/assets/space/courses/ai-content-marketing-2026/lesson-4-model-cheatsheet.pdf",
};

const characterReferenceSheet: LearnMaterial = {
  title: "Референс внешности",
  meta: "Лист для сохранения внешности персонажа",
  kind: "link",
  actionLabel: "Скачать",
  href: "/assets/space/courses/ai-content-marketing-2026/lesson-5-character-reference-sheet.png",
};

const requiredCourseMaterials = [links.syntx];
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
      ru: [],
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
        link("Quiver", "Переводим растровое фото в вектор", "https://quiver.ai/"),
        link("Ролик про Quiver", "Instagram-видео с примером Quiver", "https://www.instagram.com/p/DVQyhkXDSSk/", "Перейти"),
      ],
    },
    prompts: {
      ru: [
        prompt("l3-opten-recraft-logo", "Запрос в Opten для Recraft", "Короткий запрос из озвучки"),
        prompt("l3-recraft-logo", "Recraft V4: логотип NOVA", "Векторный логотип кофейни NOVA"),
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
        link("Photopea", "Бесплатный Photoshop в браузере", "https://www.photopea.com/"),
      ],
    },
  },
  "lesson-7-ai-video": {
    materials: {
      ru: [],
    },
    prompts: {
      ru: [
        prompt("l7-text-to-video-latte-art", "Text-to-video: латте-арт", "Кинематографичный макро-ролик с розеттой на кофе"),
        prompt("l7-image-to-video-iced-coffee", "Image-to-video: кофе и лёд", "Плавный push-in с сохранением кадра и логотипа"),
      ],
    },
  },
  "lesson-8-frames": {
    materials: {
      ru: [],
    },
    prompts: {
      ru: [
        prompt("l8-keyframe-menu-transition", "Keyframe-переход к меню", "Камера отъезжает от кофе и переводит фокус на меню"),
      ],
    },
  },
  "lesson-9-storytelling": {
    materials: {
      ru: [],
    },
    prompts: {
      ru: [
        prompt("l9-kling-multishot", "Kling: 5 сцен NOVA cafe", "Пять коротких сцен рекламного ролика"),
        prompt("l9-seedance-multishot", "Seedance: 15 секунд NOVA cafe", "Единый multi-shot prompt с референсами"),
      ],
    },
  },
  "lesson-10-prompt-library": {
    materials: {
      ru: [
        {
          title: "Исходное видео",
          meta: "Вертикальный ролик для редактирования",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-10-source-video.mp4",
        },
        {
          title: "Первый кадр",
          meta: "Стартовый кадр для подготовки правки",
          kind: "pdf",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-10-first-frame.png",
        },
        {
          title: "Финальное видео",
          meta: "Результат замены фона",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-10-final-video.mp4",
        },
      ],
    },
    prompts: {
      ru: [
        prompt("l10-photo-edit-barista", "Редактирование фото: бариста NOVA", "Сохраняем лицо, позу и меняем фон/одежду"),
      ],
    },
  },
  "lesson-11-ai-avatars": {
    materials: {
      ru: [
        {
          title: "Готовый AI-аватар",
          meta: "Финальный ролик с оживлённым персонажем",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-11-final-avatar.mp4",
        },
      ],
    },
    prompts: {
      ru: [
        prompt("l11-midjourney-character", "Midjourney: персонаж-бариста", "Дружелюбный 3D-персонаж в кофейне"),
        prompt("l11-heygen-animation", "HeyGen: мягкая анимация аватара", "Сохраняем лицо, стиль и статичную камеру"),
      ],
    },
  },
  "lesson-12-motion-control": {
    materials: {
      ru: [
        link("CapCut", "Приложение для финального монтажа", "https://www.capcut.com/capcut_pc_web/fission_receive?code=Bem0NF27972253&lng=ru-RU"),
        link("ElevenLabs", "Сервис для генерации и изменения голоса", "https://elevenlabs.io"),
        link("Дополнительный урок по AI-аватару", "Разбор motion control на Opten Space", "https://opten.space/learn/ai-avatar-motion-control"),
        {
          title: "Оригинальное видео",
          meta: "Исходник движения для урока",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-original-video.mp4",
        },
        {
          title: "Первый кадр",
          meta: "Стартовый кадр для персонажа",
          kind: "pdf",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-first-frame.jpg",
        },
        {
          title: "Персонаж",
          meta: "Картинка персонажа для замены внешности",
          kind: "pdf",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-character.png",
        },
        {
          title: "Референс движения",
          meta: "Визуальный референс для motion control",
          kind: "pdf",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-reference.webp",
        },
        {
          title: "Оригинальная озвучка",
          meta: "Аудио до обработки",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-original-audio.mp3",
        },
        {
          title: "Готовая озвучка",
          meta: "Мужской голос после обработки",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-male-audio.mp3",
        },
        {
          title: "Финальное видео",
          meta: "Результат motion control",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-12-final-motion-control.mp4",
        },
      ],
    },
    prompts: {
      ru: [
        prompt("l12-replace-appearance", "Смена внешности", "Меняем человека по второму фото"),
      ],
    },
  },
  "lesson-13-upscale": {
    materials: {
      ru: [],
    },
  },
  "lesson-14-codex": {
    materials: {
      ru: [
        link("Codex", "Приложение OpenAI для работы с проектом", "https://openai.com/ru-RU/codex/"),
        links.higgsfieldMcp,
      ],
    },
    prompts: {
      ru: [
        prompt("l14-install-skill", "Установка skill", "Команда установки Higgsfield skill"),
        prompt("l14-opten-codex", "Opten в Codex", "Пример запроса к Opten из Codex"),
      ],
    },
  },
  "lesson-15-higgsfield-mcp": {
    materials: {
      ru: [
        links.higgsfieldMcp,
        link("Pinterest-референс", "Видео-референс для разбора движения", "https://ru.pinterest.com/pin/1759287349130552/"),
        link("Best Fonts", "Сервис для подготовки скриншотов шрифта как референса", "https://en.bestfonts.pro/"),
        {
          title: "Финальное видео",
          meta: "Результат автоматизации через Higgsfield MCP",
          kind: "video",
          actionLabel: "Скачать",
          href: "/assets/space/courses/ai-content-marketing-2026/lesson-15-final-video.mp4",
        },
      ],
    },
    prompts: {
      ru: [
        prompt("l15-video-reference-analysis", "Анализ видео-референса", "Codex + Higgsfield MCP + Video Analysis"),
        prompt("l15-generate-frame-and-video", "Сгенерировать кадр и ролик", "Сначала GPT Image, затем Seedance 2.0"),
        prompt("l15-four-social-covers", "4 обложки для соцсетей", "GPT Image 2.0 High Quality с логотипом и фото-референсами"),
        prompt("l15-four-graphic-variants", "Ещё 4 графических варианта", "Добавляем иконки, плашки и больше визуальной системы"),
        prompt("l15-text-inside-image", "Правило текста внутри кадра", "Не пустая фотография плюс текст поверх, а готовый дизайн внутри изображения"),
        prompt("l15-posts-from-design-md", "3 поста по design.md", "Генерируем серию постов в зафиксированном стиле бренда"),
      ],
    },
  },
  "lesson-16-nova-website": {
    materials: {
      ru: [
        link("Codex", "Приложение OpenAI для вайб-кодинга", "https://openai.com/ru-RU/codex/"),
        link("Vercel", "Платформа для деплоя сайта", "https://vercel.com/"),
        link("Reg.ru", "Регистрация домена для проекта", "https://www.reg.ru/"),
        link("Playwright", "Инструмент для проверки сайта в браузере", "https://github.com/microsoft/playwright"),
        link("Product Design plugin", "Плагин со skill image-to-code", "https://chatgpt.com/plugins/share/37f657dbc41f408d9b05b52d30b8b527"),
        link("Готовый сайт NOVA", "Итоговый пример сайта из урока", "https://nova-coffee.ru/"),
      ],
    },
    prompts: {
      ru: [
        prompt("l16-layout-grid", "Сетка для GPT Image", "Правило 1440px / 1200px / 12 колонок"),
        prompt("l16-image-to-code", "Image-to-code", "Запрос для верстки сайта NOVA"),
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
