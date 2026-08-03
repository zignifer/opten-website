export type VibecodingGuardrailReason =
  | "accepted"
  | "empty"
  | "no_change"
  | "too_long"
  | "expanded_request"
  | "compressed_too_far"
  | "formatting_wrapper"
  | "meta_response"
  | "missing_protected_fragment"
  | "missing_semantic_anchor"
  | "introduced_requirement";

export interface VibecodingGuardrailResult {
  accepted: boolean;
  prompt: string;
  reason: VibecodingGuardrailReason;
  missingProtectedFragments?: string[];
  missingAnchors?: string[];
  introducedTerms?: string[];
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

const META_RESPONSE_PATTERNS = [
  /^\s*(?:я\s+(?:вижу|понимаю)(?=$|[\s,.;:])|мне\s+(?:нужно|необходимо)\s+уточнить(?=$|[\s,.;:])|i\s+(?:see|understand)\b|i\s+need\s+to\s+clarify\b)/iu,
  /(?:^|\n)\s*(?:я\s*[—-]\s*(?:инструмент|ассистент)(?=$|[\s,.;:])|i\s+am\s+(?:a|an)\s+(?:tool|assistant)\b)/iu,
  /(?:^|[^\p{L}\p{N}_])(?:моя\s+роль|my\s+role)(?=$|[^\p{L}\p{N}_])/iu,
  /(?:^|\n)\s*(?:пожалуйста,?\s*)?(?:(?:предоставьте|пришлите|уточните|ответьте)(?=$|[\s,.;:])|please\s+(?:provide|send|clarify|answer)\b)/iu,
] as const;

const SEMANTIC_ANCHOR_GROUPS = [
  { name: "stages", pattern: /(?:^|[^\p{L}\p{N}_])(?:этап\p{L}*|стади\p{L}*|шаг\p{L}*|stages?|phases?|steps?)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "planning", pattern: /(?:^|[^\p{L}\p{N}_])(?:план\p{L}*|спланир\p{L}*|planning|plan(?:ned|ning|s)?)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "verification", pattern: /(?:^|[^\p{L}\p{N}_])(?:перепровер\p{L}*|провер\p{L}*|аудит\p{L}*|verify\p{L}*|review\p{L}*|audit\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "testing", pattern: /(?:^|[^\p{L}\p{N}_])(?:тест\p{L}*|потест\p{L}*|tests?|testing|test)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "context", pattern: /(?:^|[^\p{L}\p{N}_])(?:контекст\p{L}*|context\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "compaction", pattern: /(?:^|[^\p{L}\p{N}_])(?:сжат\p{L}*|сокращ\p{L}*|обрез\p{L}*|compaction\p{L}*|compress\p{L}*|truncat\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "branch", pattern: /(?:^|[^\p{L}\p{N}_])(?:ветк\p{L}*|branch(?:es)?)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "completion", pattern: /(?:^|[^\p{L}\p{N}_])(?:рабоч\p{L}*|заверш\p{L}*|довед\p{L}*|готов\p{L}*|working|complete\p{L}*|finish\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "commit", pattern: /(?:^|[^\p{L}\p{N}_])(?:заком+ит\p{L}*|ком+ит\p{L}*|commit\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "push", pattern: /(?:^|[^\p{L}\p{N}_])(?:запуш\p{L}*|пуш\p{L}*|push\p{L}*)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "preservation", pattern: /(?:^|[^\p{L}\p{N}_])(?:сохран\p{L}*|не\s+тер\p{L}*|preserv\p{L}*|keep(?:ing|s|t)?)(?=$|[^\p{L}\p{N}_])/iu },
  { name: "negation", pattern: /(?:^|[\s,.;:])(?:не|нельзя|никогда|никак|без|do\s+not|don't|never|without|must\s+not)(?=$|[\s,.;:])/iu },
] as const;

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
  fragments.push(...collectMatches(prompt, /(?:^|[\s(])(?:branch|ветк[аеиуы]?|ветку)\s+([A-Za-z0-9._/-]+)/giu, 1).map(trimUrlPunctuation));
  fragments.push(...collectMatches(prompt, /\b[A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)+\b/g));
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
  return FORBIDDEN_ADDITIONS.filter((term) => {
    if (!candidateLower.includes(term) || sourceLower.includes(term)) return false;
    const significantParts = term.match(/[\p{L}\p{N}]+/gu)?.filter((part) => part.length >= 4) || [];
    const alreadyPresent = significantParts.length > 0 && significantParts.every((part) => (
      sourceLower.includes(part.slice(0, Math.min(6, part.length)))
    ));
    return !alreadyPresent;
  });
}

function normalizedComparison(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasIntroducedMetaResponse(source: string, candidate: string) {
  return META_RESPONSE_PATTERNS.some((pattern) => pattern.test(candidate) && !pattern.test(source));
}

function missingSemanticAnchors(source: string, candidate: string) {
  return SEMANTIC_ANCHOR_GROUPS
    .filter(({ pattern }) => pattern.test(source) && !pattern.test(candidate))
    .map(({ name }) => name);
}

function minimumRetentionRatio(sourceLength: number) {
  if (sourceLength >= 300) return 0.6;
  if (sourceLength >= 160) return 0.5;
  return 0.4;
}

export function validateVibecodingCandidate(sourceValue: string, candidateValue: string): VibecodingGuardrailResult {
  const source = sourceValue.trim();
  const candidate = candidateValue.trim();

  if (!candidate) return { accepted: false, prompt: source, reason: "empty" };
  if (candidate.length > MAX_PROMPT_CHARS) return { accepted: false, prompt: source, reason: "too_long" };
  if (normalizedComparison(candidate) === normalizedComparison(source)) {
    return { accepted: false, prompt: source, reason: "no_change" };
  }

  if (hasFormattingWrapper(candidate, source)) {
    return { accepted: false, prompt: source, reason: "formatting_wrapper" };
  }
  if (hasIntroducedMetaResponse(source, candidate)) {
    return { accepted: false, prompt: source, reason: "meta_response" };
  }

  const allowedGrowth = Math.max(120, Math.ceil(source.length * 0.5));
  if (candidate.length > source.length + allowedGrowth) {
    return { accepted: false, prompt: source, reason: "expanded_request" };
  }
  const protectedFragments = extractVibecodingProtectedFragments(source);
  const missingProtectedFragments = protectedFragments.filter((fragment) => !candidate.includes(fragment));
  if (missingProtectedFragments.length > 0) {
    return { accepted: false, prompt: source, reason: "missing_protected_fragment", missingProtectedFragments };
  }

  const missingAnchors = missingSemanticAnchors(source, candidate);
  if (missingAnchors.length > 0) {
    return { accepted: false, prompt: source, reason: "missing_semantic_anchor", missingAnchors };
  }

  const introducedTerms = introducedForbiddenTerms(source, candidate);
  if (introducedTerms.length > 0) {
    return { accepted: false, prompt: source, reason: "introduced_requirement", introducedTerms: [...introducedTerms] };
  }

  if (source.length >= 40 && candidate.length < Math.ceil(source.length * minimumRetentionRatio(source.length))) {
    return { accepted: false, prompt: source, reason: "compressed_too_far" };
  }

  return { accepted: true, prompt: candidate, reason: "accepted" };
}
