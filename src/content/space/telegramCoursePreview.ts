export const LEGACY_HIDDEN_INTRO_SLUG = "hidden-intro";
export const TELEGRAM_COURSE_PREVIEW_STORAGE_KEY = "opten_course_preview_claim_v1";
export const TELEGRAM_COURSE_PREVIEW_BOT_URL = "https://t.me/opten_space_bot?start=course_preview";
export const TELEGRAM_COURSE_PREVIEW_LESSON_SLUGS = [
  "lesson-1-prompting",
  "lesson-2-ai-services",
  "lesson-3-logo-generation",
] as const;

export function isTelegramCoursePreviewLesson(slug: string | undefined): boolean {
  return Boolean(slug && TELEGRAM_COURSE_PREVIEW_LESSON_SLUGS.includes(slug as (typeof TELEGRAM_COURSE_PREVIEW_LESSON_SLUGS)[number]));
}
