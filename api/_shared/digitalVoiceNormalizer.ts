import { DIGITAL_VOICE_RULES, type DigitalVoiceRule } from "./digitalVoiceRules.js";

export interface DigitalVoiceReplacement {
  alias: string;
  replacement: string;
}

export interface DigitalVoiceNormalizationResult {
  prompt: string;
  changed: boolean;
  replacements: DigitalVoiceReplacement[];
}

const AMBIGUOUS_ALIAS_ROOTS = new Set([
  "ai",
  "go",
  "motion",
  "reels",
  "ref",
  "ruby",
  "shorts",
  "storybook",
  "битрикс",
  "го",
  "директ",
  "клауд",
  "клин",
  "курсор",
  "мейк",
  "метрика",
  "моушн",
  "нода",
  "призма",
  "реф",
  "рилс",
  "рендер",
  "руби",
  "свифт",
  "синтакс",
  "сора",
  "флюкс",
  "шортс",
  "эй ай",
]);

const DIGITAL_CONTEXT_ROOTS = [
  "ai",
  "api",
  "backend",
  "code",
  "frontend",
  "image",
  "prompt",
  "seo",
  "video",
  "автоматизац",
  "агент",
  "аналитик",
  "видео",
  "генера",
  "дизайн",
  "изображ",
  "инструкц",
  "код",
  "контент",
  "маркет",
  "модел",
  "нейросет",
  "программ",
  "промпт",
  "реклам",
  "сайт",
  "сценари",
];

const MODEL_REPLACEMENTS: Record<string, string[]> = {
  codex: ["OpenAI Codex", "Codex"],
  claude: ["Claude"],
  gemini: ["Gemini"],
  "nano-banana-2": ["Nano Banana 2"],
  "nano-banana-pro": ["Nano Banana Pro"],
  "gpt-image-2": ["GPT Image 2", "ChatGPT"],
  "midjourney-8.1": ["Midjourney 8.1", "Midjourney"],
  "seedream-5-pro": ["Seedream 5.0 Pro", "Seedream"],
  "recraft-v4.1": ["Recraft V4.1", "Recraft"],
  "seedance-2.5": ["Seedance 2.5", "Seedance"],
  "seedance-2.0": ["Seedance 2.0", "Seedance"],
  "kling-3": ["Kling AI 3", "Kling AI", "Kling"],
  "veo-3.1": ["Veo 3.1", "Veo"],
  "flux-3": ["FLUX 3", "FLUX"],
  "grok-imagine-video-1.5": ["Grok Imagine Video 1.5", "Grok Imagine"],
};

const PROTECTED_PATTERNS = [
  /```[\s\S]*?```/gu,
  /`[^`\r\n]*`/gu,
  /"[^"\r\n]*"|'[^'\r\n]*'|«[^»\r\n]*»/gu,
  /https?:\/\/[^\s<>"'`]+/giu,
  /\b[A-Za-z]:\\[^\s<>"'`]+/gu,
  /(?:^|[\s(])(?:\.\.\/|\.\/|\/)(?:[A-Za-z0-9_@.-]+\/)*[A-Za-z0-9_@.-]+/gmu,
  /\b(?:GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+\/[A-Za-z0-9_./:{}?=&%-]+/gu,
  /(?:^|\n)\s*(?:\$\s*)?(?:npm|pnpm|yarn|npx|git|node|python(?:3)?|pytest|cargo|go|make|curl|docker(?:\s+compose)?|kubectl|vercel|supabase|powershell|pwsh|bash|sh)\b[^\r\n]*/gimu,
];

function fold(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/gu, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function tokenRoot(token: string) {
  if (token.length <= 3) return token;
  return token.slice(0, Math.min(6, Math.max(4, token.length - 1)));
}

function hintMatches(context: string, hint: string) {
  const tokens = fold(hint).split(" ").filter(Boolean);
  if (tokens.length === 0) return false;
  return tokens.every((token) => {
    const root = tokenRoot(token);
    const suffix = token.length <= 3 ? "" : "[\\p{L}\\p{N}]*";
    return new RegExp(`(?:^|\\s)${escapeRegExp(root)}${suffix}(?=$|\\s)`, "u").test(context);
  });
}

function hasPositiveContext(context: string, rule: DigitalVoiceRule) {
  return rule.positive.some((hint) => hintMatches(context, hint));
}

function hasNegativeContext(context: string, rule: DigitalVoiceRule) {
  return rule.negative.some((hint) => hintMatches(context, hint));
}

function hasDigitalContext(context: string) {
  return DIGITAL_CONTEXT_ROOTS.some((root) => hintMatches(context, root));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function aliasPattern(alias: string) {
  const flexible = escapeRegExp(alias.trim()).replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}_])${flexible}(?![\\p{L}\\p{N}_])`, "giu");
}

function aliasIsAmbiguous(alias: string) {
  const first = fold(alias).replace(/\b\d+(?:\s+\d+)*\b/gu, "").trim().split(" ")[0] || "";
  return [...AMBIGUOUS_ALIAS_ROOTS].some((root) => (
    first === root || (root.length >= 4 && first.startsWith(root))
  ));
}

function sourceContainsKnownPeer(source: string, currentRule: DigitalVoiceRule) {
  const foldedSource = fold(source);
  return DIGITAL_VOICE_RULES.some((rule) => {
    if (rule === currentRule) return false;
    if (hintMatches(foldedSource, rule.replacement)) return true;
    return rule.aliases.some((alias) => alias.length >= 4 && hintMatches(foldedSource, alias));
  });
}

function sourceContainsCanonicalFamily(source: string, rule: DigitalVoiceRule) {
  const [family] = fold(rule.replacement).split(" ");
  return Boolean(family && family.length >= 4 && hintMatches(fold(source), family));
}

function selectedModelMatches(modelSlug: string | undefined, rule: DigitalVoiceRule) {
  if (!modelSlug) return false;
  return (MODEL_REPLACEMENTS[modelSlug] || []).some((value) => {
    const expected = fold(value);
    const replacement = fold(rule.replacement);
    return replacement === expected || replacement.startsWith(`${expected} `) || expected.startsWith(`${replacement} `);
  });
}

interface Range {
  start: number;
  end: number;
}

function protectedRanges(prompt: string) {
  const ranges: Range[] = [];
  for (const pattern of PROTECTED_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of prompt.matchAll(pattern)) {
      if (match.index === undefined) continue;
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
  }
  ranges.sort((left, right) => left.start - right.start || right.end - left.end);
  const merged: Range[] = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

function unprotectedText(prompt: string, ranges: Range[]) {
  let cursor = 0;
  const pieces: string[] = [];
  for (const range of ranges) {
    pieces.push(prompt.slice(cursor, range.start));
    cursor = range.end;
  }
  pieces.push(prompt.slice(cursor));
  return pieces.join(" ");
}

function replaceInUnprotectedSegments(
  prompt: string,
  ranges: Range[],
  replace: (segment: string) => string,
) {
  let cursor = 0;
  const pieces: string[] = [];
  for (const range of ranges) {
    pieces.push(replace(prompt.slice(cursor, range.start)), prompt.slice(range.start, range.end));
    cursor = range.end;
  }
  pieces.push(replace(prompt.slice(cursor)));
  return pieces.join("");
}

/**
 * Normalizes likely speech-to-text distortions without any provider call or
 * prompt augmentation. Ambiguous aliases fail closed unless their own context,
 * the selected model, or another known digital product disambiguates them.
 */
export function normalizeDigitalVoicePrompt(prompt: string, modelSlug?: string): DigitalVoiceNormalizationResult {
  const ranges = protectedRanges(prompt);
  const contextSource = unprotectedText(prompt, ranges);
  const context = fold(contextSource);
  const digitalContext = hasDigitalContext(context);
  const replacements: DigitalVoiceReplacement[] = [];
  let normalized = prompt;

  for (const rule of DIGITAL_VOICE_RULES) {
    const negative = hasNegativeContext(context, rule);
    const positive = hasPositiveContext(context, rule);
    const selected = selectedModelMatches(modelSlug, rule);
    const peer = sourceContainsKnownPeer(contextSource, rule)
      || sourceContainsCanonicalFamily(contextSource, rule);
    if (negative || (!positive && !selected && !digitalContext && !peer)) continue;

    const orderedAliases = [...rule.aliases].sort((left, right) => right.length - left.length);
    for (const alias of orderedAliases) {
      if (aliasIsAmbiguous(alias) && !positive && !selected && !peer) continue;
      const pattern = aliasPattern(alias);
      let changed = false;
      const next = replaceInUnprotectedSegments(normalized, protectedRanges(normalized), (segment) => (
        segment.replace(pattern, (matched) => {
          changed = true;
          replacements.push({ alias: matched, replacement: rule.replacement });
          return rule.replacement;
        })
      ));
      if (changed) normalized = next;
    }
  }

  return {
    prompt: normalized,
    changed: normalized !== prompt,
    replacements,
  };
}
