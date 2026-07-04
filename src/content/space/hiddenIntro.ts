import type { LearnLang, LocalizedText } from "./learn";

export const HIDDEN_INTRO_SLUG = "hidden-intro";
export const HIDDEN_INTRO_ROUTE = "/learn/courses/ai-content-marketing-2026/hidden-intro";
export const HIDDEN_INTRO_UNLOCK_STORAGE_KEY = "opten_hidden_intro_opened_v1";
export const HIDDEN_INTRO_WEBSITE_SLOT_ENABLED = false;
export const HIDDEN_INTRO_VIDEO_ENABLED = false;
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
    ru: "Скрытый урок",
    en: "Hidden lesson",
  },
  lockedAction: {
    ru: "Получить доступ в Telegram",
    en: "Get access in Telegram",
  },
  lockedMeta: {
    ru: "Открывается по ссылке из Telegram",
    en: "Unlocked through a Telegram link",
  },
  placeholderText: {
    ru: "Урок скоро появится. Доступ будет открываться по ссылке из Telegram.",
    en: "This lesson is coming soon. Access will open through a Telegram link.",
  },
  backToCourse: {
    ru: "Вернуться к курсу",
    en: "Back to course",
  },
};

export function getHiddenIntroCopy(field: keyof HiddenIntroCopy, lang: LearnLang) {
  return hiddenIntroCopy[field][lang] ?? hiddenIntroCopy[field].ru;
}
