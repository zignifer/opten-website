import type { LearnCollection, LearnLesson, LearnMaterial } from "./learn";
import { futureProtectedVideoDeliveryNote, learnDefaultAuthor } from "./learn";

export const PRIVATE_COURSE_SLUG = "ai-content-marketing-2026";
export const PRIVATE_COURSE_FIRST_LESSON_SLUG = "lesson-1-prompting";
export const PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID = "e941e14d-c5bf-40fc-abe5-a41e247777cf";

const firstLessonPoster = `https://kinescope.io/${PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID}/poster/lg.webp`;

const firstLessonMaterials: Record<"ru" | "en", LearnMaterial[]> = {
  ru: [
    {
      title: "Генератор промптов в ChatGPT",
      meta: "Opten Prompt Improver для генерации промптов под изображения",
      kind: "link",
      actionLabel: "Открыть",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Скилл для генерации промптов в Claude",
      meta: "Скачивание Pro-сборки opten.zip через расширение Opten",
      kind: "link",
      actionLabel: "Скачать",
      href: "/dashboard/download-skill",
    },
    {
      title: "Syntx",
      meta: "AI-платформа для генерации изображений и видео",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Higgsfield",
      meta: "AI-видео, движение камеры и визуальные эффекты",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://higgsfield.ai/",
    },
  ],
  en: [
    {
      title: "ChatGPT prompt generator",
      meta: "Opten Prompt Improver for image-generation prompts",
      kind: "link",
      actionLabel: "Open",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Claude prompt-generation Skill",
      meta: "Downloads the Pro opten.zip bundle through the Opten extension flow",
      kind: "link",
      actionLabel: "Download",
      href: "/dashboard/download-skill",
    },
    {
      title: "Syntx",
      meta: "AI platform for image and video generation",
      kind: "link",
      actionLabel: "Open",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Higgsfield",
      meta: "AI video, camera motion, and visual effects",
      kind: "link",
      actionLabel: "Open",
      href: "https://higgsfield.ai/",
    },
  ],
};

const firstLesson: LearnLesson = {
  slug: PRIVATE_COURSE_FIRST_LESSON_SLUG,
  title: {
    ru: "Урок 1: промптинг для визуального контента",
    en: "Lesson 1: prompting for visual content",
  },
  description: {
    ru: "Первый урок закрытого курса: разбираем, как собирать промпты для визуального контента и сразу использовать Opten-инструменты в ChatGPT, Claude, Syntx и Higgsfield.",
    en: "The first private-course lesson: how to assemble prompts for visual content and use Opten tools in ChatGPT, Claude, Syntx, and Higgsfield.",
  },
  category: "ai-video",
  duration: "07:39",
  durationIso: "PT7M39S",
  status: "Available",
  access: "full-platform",
  fullAccessOnly: true,
  thumbnailPath: firstLessonPoster,
  author: learnDefaultAuthor,
  publishedAt: "2026-06-19",
  updatedAt: "2026-06-19",
  releaseNote: {
    ru: "Закрытый MVP-урок курса. Видео хранится в Kinescope и открывается через серверный Pro-gate.",
    en: "Private course MVP lesson. Video is hosted on Kinescope and opened through the server-side Pro gate.",
  },
  filters: ["Standalone", "Prompt packs"],
  topics: {
    ru: ["Промптинг", "AI-визуал", "ChatGPT", "Claude", "Syntx", "Higgsfield"],
    en: ["Prompting", "AI visuals", "ChatGPT", "Claude", "Syntx", "Higgsfield"],
  },
  whatYouWillLearn: {
    ru: [
      "Понять структуру промпта для визуального результата",
      "Использовать генератор промптов Opten в ChatGPT",
      "Скачать Claude Skill для генерации промптов",
      "Перенести готовый промпт в Syntx или Higgsfield",
    ],
    en: [
      "Understand the structure of a prompt for visual output",
      "Use the Opten prompt generator in ChatGPT",
      "Download the Claude Skill for prompt generation",
      "Move the finished prompt into Syntx or Higgsfield",
    ],
  },
  updatedNote: {
    ru: "Kinescope video id привязан 2026-06-19.",
    en: "Kinescope video id connected on 2026-06-19.",
  },
  timestamps: {
    ru: [],
    en: [],
  },
  materials: firstLessonMaterials,
  videoProvider: {
    provider: "kinescope",
    providerAssetId: PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID,
    posterPath: firstLessonPoster,
    playbackPolicy: "subscription-gated-public-preview",
    signedPlaybackUrl: null,
    notes: futureProtectedVideoDeliveryNote,
  },
};

export const privateCourseCollection: LearnCollection = {
  id: PRIVATE_COURSE_SLUG,
  title: {
    ru: "Нейросети для контента и маркетинга 2026",
    en: "AI for Content and Marketing 2026",
  },
  description: {
    ru: "Закрытый курс Opten по созданию контента и маркетинговой упаковки с помощью ИИ.",
    en: "A private Opten course on creating content and marketing assets with AI.",
  },
  kind: "course",
  categoryLabel: {
    ru: "Закрытый курс",
    en: "Private course",
  },
  routeBasePath: {
    ru: `/learn/courses/${PRIVATE_COURSE_SLUG}`,
    en: `/learn/courses/${PRIVATE_COURSE_SLUG}`,
  },
  progress: {
    completed: 0,
    total: 15,
  },
  lessons: [firstLesson],
};

export function getPrivateCourseCollection(courseSlug: string | undefined): LearnCollection | undefined {
  return courseSlug === PRIVATE_COURSE_SLUG ? privateCourseCollection : undefined;
}

export function findPrivateCourseLesson(courseSlug: string | undefined, lessonSlug: string | undefined): LearnLesson | undefined {
  const collection = getPrivateCourseCollection(courseSlug);
  if (!collection) return undefined;
  if (!lessonSlug) return collection.lessons[0];
  return collection.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentPrivateCourseLessons(courseSlug: string | undefined, lessonSlug: string) {
  const collection = getPrivateCourseCollection(courseSlug);
  if (!collection) return {};
  const index = collection.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  return {
    previousLesson: index > 0 ? collection.lessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < collection.lessons.length - 1 ? collection.lessons[index + 1] : undefined,
  };
}
