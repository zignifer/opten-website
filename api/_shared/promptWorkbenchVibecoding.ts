export type VibecodingGuardrailReason =
  | "accepted"
  | "empty"
  | "too_long"
  | "expanded_short_request"
  | "expanded_request"
  | "formatting_wrapper"
  | "missing_protected_fragment"
  | "introduced_requirement"
  | "lost_meaningful_terms";

export interface VibecodingGuardrailResult {
  accepted: boolean;
  prompt: string;
  reason: VibecodingGuardrailReason;
  missingProtectedFragments?: string[];
  introducedTerms?: string[];
  retainedMeaningfulTermRatio?: number;
}

const MAX_PROMPT_CHARS = 6_000;

const FORBIDDEN_ADDITIONS = [
  "современн",
  "минималистич",
  "профессиональн",
  "адаптивн",
  "отзывчив",
  "масштабируем",
  "продакшн",
  "лучшие практики",
  "критерии приемки",
  "приемочные критерии",
  "юнит-тест",
  "интеграционн",
  "сквозн",
  "план реализации",
  "режим планирования",
  "modern",
  "minimalist",
  "professional",
  "responsive",
  "production-ready",
  "production ready",
  "scalable",
  "best practices",
  "accessibility",
  "analytics",
  "authentication",
  "authorization",
  "acceptance criteria",
  "unit test",
  "integration test",
  "end-to-end test",
  "implementation plan",
  "plan mode",
  "docker",
  "kubernetes",
  "ci/cd",
  "next.js",
  "typescript",
  "tailwind",
  "supabase",
  "postgresql",
  "vercel",
] as const;

const NON_SEMANTIC_WORDS = new Set([
  "а", "бы", "в", "во", "вот", "давай", "для", "до", "же", "и", "или", "как", "какбы", "именно",
  "который", "которая", "которые", "мне", "мой", "моя", "надо", "не", "ну", "нужно", "пожалуйста",
  "значит", "короче", "нужен", "потом", "получается", "просто", "сделай", "сделайте", "сначала", "слушай", "создай", "создать", "то", "типа", "хочу", "чтобы", "это",
  "этот", "эта", "этой", "этого", "эту", "я",
  "a", "actually", "an", "and", "are", "be", "basically", "build", "could", "create", "do", "exactly", "first", "for", "from", "hey", "i",
  "is", "it", "just", "kind", "like", "make", "me", "my", "need", "of", "or", "please", "should", "so", "that",
  "the", "then", "this", "to", "want", "well", "while", "with", "would",
]);

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function collectMatches(value: string, pattern: RegExp, group = 0) {
  return [...value.matchAll(pattern)].map((match) => match[group] || "");
}

function trimUrlPunctuation(value: string) {
  return value.replace(/[.,;:!?]+$/g, "");
}

/**
 * Values which the cleaner is never allowed to paraphrase. The extraction is
 * intentionally conservative: a false positive produces a safe no-op rather
 * than silently changing a command, route, version, or identifier.
 */
export function extractVibecodingProtectedFragments(prompt: string) {
  const fragments: string[] = [];

  fragments.push(...collectMatches(prompt, /https?:\/\/[^\s<>"'`]+/giu).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /\b[A-Za-z]:\\[^\s<>"'`]+/g).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /(?:^|[\s(])((?:\.\.\/|\.\/|\/)(?:[A-Za-z0-9_@.-]+\/)*[A-Za-z0-9_@.-]+)/g, 1).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /\b(?:[A-Za-z0-9_@.-]+\/)+[A-Za-z0-9_@.-]+/g).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /\b(?:GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+\/[A-Za-z0-9_./:{}?=&%-]+/g).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /\b(?:npm|pnpm|yarn)\s+(?:run\s+)?[A-Za-z0-9:_-]+(?:\s+--\s+[A-Za-z0-9:_=./-]+)*/g));
  fragments.push(...collectMatches(prompt, /(?:^|\n)\s*(?:\$\s*)?((?:npm|pnpm|yarn|npx|git|node|python(?:3)?|pytest|cargo|go|docker(?:\s+compose)?|kubectl|vercel|supabase|powershell|pwsh|bash|sh)\b[^\r\n]*)/gim, 1));
  fragments.push(...collectMatches(prompt, /\bv?\d+\.\d+(?:\.\d+)*(?:-[0-9A-Za-z.-]+)?\b/g));
  fragments.push(...collectMatches(prompt, /#[0-9A-Fa-f]{3,8}\b/g));
  fragments.push(...collectMatches(prompt, /\b\d+(?:[.,]\d+)?\s*(?:px|rem|em|ms|s|MB|GB|МБ|ГБ|%|₽)(?![\p{L}\p{N}_])/giu).map((value) => value.trim()));
  fragments.push(...collectMatches(prompt, /\b\d+(?:[.,]\d+)?\b/g));
  fragments.push(...collectMatches(prompt, /`[^`\r\n]+`|"[^"\r\n]+"|'[^'\r\n]+'|«[^»\r\n]+»/g));
  fragments.push(...collectMatches(prompt, /@[A-Za-z][A-Za-z0-9_-]*/g));
  fragments.push(...collectMatches(prompt, /\b[A-Za-z_$][A-Za-z0-9_$]*(?:[._][A-Za-z0-9_$-]+)+\b/g));
  fragments.push(...collectMatches(prompt, /\b[A-Za-z][A-Za-z0-9]*-[A-Za-z0-9][A-Za-z0-9.-]*\b/g));
  fragments.push(...collectMatches(prompt, /\b[a-z_$][a-z0-9_$]*(?:[A-Z][A-Za-z0-9_$]*)+\b/g));
  fragments.push(...collectMatches(prompt, /\b[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]*)+\b/g));
  fragments.push(...collectMatches(prompt, /\b(?:React|Vite|Node(?:\.js)?|Supabase|PostgreSQL|Docker|Kubernetes|Vercel|Codex|Claude|Gemini|Anthropic|OpenAI|GitHub|GitLab|Figma|Playwright|Tailwind|Next\.js)\b/g));
  fragments.push(...collectMatches(prompt, /\b[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_]+\b/g));
  fragments.push(...collectMatches(prompt, /\b[A-Z][A-Z0-9_]{2,}\b/g));

  return unique(fragments);
}

export function detectVibecodingPromptLanguage(prompt: string): "ru" | "en" {
  const cyrillicCount = (prompt.match(/[а-яё]/giu) || []).length;
  const latinCount = (prompt.match(/[a-z]/giu) || []).length;
  if (cyrillicCount === 0) return "en";
  return cyrillicCount >= Math.max(3, latinCount * 0.35) ? "ru" : "en";
}

export function vibecodingPromptReferencesImages(prompt: string) {
  return /(?:@image\d*|@reference\d*|скрин(?:шот)?|изображен|картин|фото|референс|макет|вложенн|image|screenshot|screen\s*shot|photo|reference|mockup|attached)/iu.test(prompt);
}

function hasFormattingWrapper(candidate: string, source: string) {
  if (/```|(?:^|\n)\s*#{1,6}\s+/u.test(candidate)) return true;
  if (/^(?:вот\s+(?:очищенн|улучшенн|переписанн)[^:\n]*|(?:очищенн|улучшенн)\s+(?:запрос|промпт)|here(?:'s|\s+is)\s+(?:the\s+)?(?:cleaned|improved|rewritten)[^:\n]*|(?:cleaned|improved|rewritten)\s+(?:request|prompt))\s*[:\n]/iu.test(candidate)) return true;
  if (/\n\s*(?:пояснение|объяснение|почему|explanation|why)\s*:/iu.test(candidate)) return true;

  const wrappedPairs: Array<[string, string]> = [["\"", "\""], ["'", "'"], ["`", "`"], ["«", "»"]];
  return wrappedPairs.some(([start, end]) => (
    candidate.startsWith(start)
    && candidate.endsWith(end)
    && !(source.startsWith(start) && source.endsWith(end))
  ));
}

function introducedForbiddenTerms(source: string, candidate: string) {
  const sourceLower = source.toLocaleLowerCase();
  const candidateLower = candidate.toLocaleLowerCase();
  return FORBIDDEN_ADDITIONS.filter((term) => candidateLower.includes(term) && !sourceLower.includes(term));
}

function meaningfulTokens(value: string) {
  const tokens = value.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}_-]*/gu) || [];
  return unique(tokens.filter((token) => token.length >= 4 && !NON_SEMANTIC_WORDS.has(token)));
}

function tokensMatch(sourceToken: string, candidateToken: string) {
  if (sourceToken === candidateToken) return true;
  if (sourceToken.length < 5 || candidateToken.length < 5) return false;
  return sourceToken.slice(0, 5) === candidateToken.slice(0, 5);
}

function retainedMeaningfulTermRatio(source: string, candidate: string) {
  const sourceTokens = meaningfulTokens(source);
  if (sourceTokens.length === 0) return 1;
  const candidateTokens = meaningfulTokens(candidate);
  const retained = sourceTokens.filter((sourceToken) => candidateTokens.some((candidateToken) => tokensMatch(sourceToken, candidateToken)));
  return retained.length / sourceTokens.length;
}

export function validateVibecodingCandidate(sourceValue: string, candidateValue: string): VibecodingGuardrailResult {
  const source = sourceValue.trim();
  const candidate = candidateValue.trim();

  if (!candidate) return { accepted: false, prompt: source, reason: "empty" };
  if (candidate.length > MAX_PROMPT_CHARS) return { accepted: false, prompt: source, reason: "too_long" };
  if (candidate === source) return { accepted: true, prompt: source, reason: "accepted", retainedMeaningfulTermRatio: 1 };

  if (hasFormattingWrapper(candidate, source)) {
    return { accepted: false, prompt: source, reason: "formatting_wrapper" };
  }

  if (source.length <= 160 && candidate.length > source.length) {
    return { accepted: false, prompt: source, reason: "expanded_short_request" };
  }

  const allowedGrowth = Math.max(32, Math.ceil(source.length * 0.08));
  if (candidate.length > source.length + allowedGrowth) {
    return { accepted: false, prompt: source, reason: "expanded_request" };
  }

  const protectedFragments = extractVibecodingProtectedFragments(source);
  const missingProtectedFragments = protectedFragments.filter((fragment) => !candidate.includes(fragment));
  if (missingProtectedFragments.length > 0) {
    return { accepted: false, prompt: source, reason: "missing_protected_fragment", missingProtectedFragments };
  }

  const introducedTerms = introducedForbiddenTerms(source, candidate);
  if (introducedTerms.length > 0) {
    return { accepted: false, prompt: source, reason: "introduced_requirement", introducedTerms: [...introducedTerms] };
  }

  const retainedRatio = retainedMeaningfulTermRatio(source, candidate);
  const minimumRatio = meaningfulTokens(source).length <= 3 ? 1 : 0.72;
  if (retainedRatio < minimumRatio) {
    return {
      accepted: false,
      prompt: source,
      reason: "lost_meaningful_terms",
      retainedMeaningfulTermRatio: retainedRatio,
    };
  }

  return { accepted: true, prompt: candidate, reason: "accepted", retainedMeaningfulTermRatio: retainedRatio };
}
