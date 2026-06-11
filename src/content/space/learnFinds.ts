import rawFinds from "./learnFinds.generated.json";
import type { LearnLang, LearnTimestamp, LearnTopic, LocalizedText } from "./learn";

export type LearnFindResourceKind = "official" | "github" | "download" | "tool" | "video" | "article" | "other";

export type LearnFindCommand = {
  title: LocalizedText;
  code: string;
  note?: LocalizedText;
};

export type LearnFindPrompt = {
  title: LocalizedText;
  text: string;
  note?: LocalizedText;
};

export type LearnFindResource = {
  title: string;
  href: string;
  kind: LearnFindResourceKind;
};

export type LearnFind = {
  slug: string;
  youtubeId: string;
  youtubeUrl: string;
  title: LocalizedText;
  description: LocalizedText;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
  topic: LearnTopic;
  duration: string;
  durationIso: string;
  publishedAt: string;
  updatedAt: string;
  sourceLabel: LocalizedText;
  summary: Record<LearnLang, string[]>;
  keyTakeaways: Record<LearnLang, string[]>;
  commands: LearnFindCommand[];
  prompts: LearnFindPrompt[];
  resources: LearnFindResource[];
  risks: Record<LearnLang, string[]>;
  timestamps: Record<LearnLang, LearnTimestamp[]>;
};

export const learnFinds = rawFinds as LearnFind[];

export const LEARN_FIND_SLUGS = learnFinds.map((find) => find.slug);

export function findLearnFind(slug: string | undefined): LearnFind | undefined {
  if (!slug) return undefined;
  return learnFinds.find((find) => find.slug === slug);
}

export function getLearnFindTitle(find: LearnFind, lang: LearnLang) {
  return localize(find.title, lang);
}

export function getLearnFindDescription(find: LearnFind, lang: LearnLang) {
  return localize(find.description, lang);
}

export function getLearnFindSeoTitle(find: LearnFind, lang: LearnLang) {
  return find.seoTitle ? localize(find.seoTitle, lang) : `${getLearnFindTitle(find, lang)} — Opten`;
}

export function getLearnFindSeoDescription(find: LearnFind, lang: LearnLang) {
  return find.seoDescription ? localize(find.seoDescription, lang) : getLearnFindDescription(find, lang);
}

export function getLearnFindSourceLabel(find: LearnFind, lang: LearnLang) {
  return localize(find.sourceLabel, lang);
}

export function getLearnFindSummary(find: LearnFind, lang: LearnLang) {
  return find.summary[lang] ?? find.summary.ru;
}

export function getLearnFindTakeaways(find: LearnFind, lang: LearnLang) {
  return find.keyTakeaways[lang] ?? find.keyTakeaways.ru;
}

export function getLearnFindRisks(find: LearnFind, lang: LearnLang) {
  return find.risks[lang] ?? find.risks.ru;
}

export function getLearnFindTimestamps(find: LearnFind, lang: LearnLang) {
  return find.timestamps[lang] ?? find.timestamps.ru;
}

export function getLearnFindRoute(find: LearnFind, lang: LearnLang) {
  return lang === "en" ? `/en/learn/finds/${find.slug}` : `/learn/finds/${find.slug}`;
}

export function getYoutubeThumbnailUrl(youtubeId: string, quality: "maxres" | "hq" = "maxres") {
  const name = quality === "maxres" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${youtubeId}/${name}.jpg`;
}

export function findMatchesQuery(find: LearnFind, lang: LearnLang, normalizedQuery: string) {
  if (!normalizedQuery) return true;
  const haystack = [
    getLearnFindTitle(find, lang),
    getLearnFindDescription(find, lang),
    find.resources.map((resource) => resource.title).join(" "),
    find.commands.map((command) => localize(command.title, lang)).join(" "),
    find.prompts.map((prompt) => localize(prompt.title, lang)).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function localize(value: LocalizedText, lang: LearnLang) {
  return value[lang] ?? value.ru;
}
