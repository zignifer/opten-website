import type { LearnLang, LocalizedText } from "./learn";

export const HIDDEN_INTRO_SLUG = "hidden-intro";
export const HIDDEN_INTRO_ROUTE = "/learn/courses/ai-content-marketing-2026/hidden-intro";
export const HIDDEN_INTRO_UNLOCK_STORAGE_KEY = "opten_hidden_intro_opened_v1";
export const HIDDEN_INTRO_WEBSITE_SLOT_ENABLED = false;
export const HIDDEN_INTRO_VIDEO_ENABLED = true;
export const HIDDEN_INTRO_TELEGRAM_URL = "https://t.me/opten_space_bot?start=hidden_intro";

export type HiddenIntroCopy = {
  title: LocalizedText;
  lockedAction: LocalizedText;
  lockedMeta: LocalizedText;
  placeholderText: LocalizedText;
  backToCourse: LocalizedText;
};

export const hiddenIntroCopy: HiddenIntroCopy = {
  title: {
    ru: "AI контент-завод",
    en: "AI content factory",
  },
  lockedAction: {
    ru: "Разблокировать в Telegram",
    en: "Unlock in Telegram",
  },
  lockedMeta: {
    ru: "Покупателям курса открыт автоматически",
    en: "Included automatically for course buyers",
  },
  placeholderText: {
    ru: "Урок открыт покупателям курса автоматически. Гостям доступ выдаёт Telegram-бот после проверки подписки на канал.",
    en: "Course buyers get this lesson automatically. Guests unlock it through the Telegram bot after channel subscription verification.",
  },
  backToCourse: {
    ru: "Вернуться к курсу",
    en: "Back to course",
  },
};

export function getHiddenIntroCopy(field: keyof HiddenIntroCopy, lang: LearnLang) {
  return hiddenIntroCopy[field][lang] ?? hiddenIntroCopy[field].ru;
}
