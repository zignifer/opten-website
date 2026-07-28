import type { LearnLang, LocalizedText } from "./learn";
import {
  HIDDEN_INTRO_ROUTE,
  HIDDEN_INTRO_SLUG,
  HIDDEN_INTRO_TELEGRAM_URL,
} from "./courseDiscountClaim";

export { HIDDEN_INTRO_ROUTE, HIDDEN_INTRO_SLUG, HIDDEN_INTRO_TELEGRAM_URL };

export type HiddenIntroCopy = {
  lockedTitle: LocalizedText;
  lockedDescription: LocalizedText;
  lockedAction: LocalizedText;
};

export const hiddenIntroCopy: HiddenIntroCopy = {
  lockedTitle: {
    ru: "Открой нулевой урок в Telegram",
    en: "Unlock lesson zero in Telegram",
  },
  lockedDescription: {
    ru: "Подпишитесь на канал и подтвердите подписку в боте. Нулевой урок останется доступен по персональной ссылке, а генератор промптов и остальные материалы курса продолжат открываться отдельно.",
    en: "Subscribe to the channel and verify it in the bot. Lesson zero will remain available through your personal link; the prompt generator and the rest of the course stay separately gated.",
  },
  lockedAction: {
    ru: "Открыть в Telegram",
    en: "Open Telegram",
  },
};

export function getHiddenIntroCopy(field: keyof HiddenIntroCopy, lang: LearnLang) {
  return hiddenIntroCopy[field][lang] ?? hiddenIntroCopy[field].ru;
}
