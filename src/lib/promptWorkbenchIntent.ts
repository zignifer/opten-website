const EXPLICIT_VIBECODING_PATTERN = /(?:^|[^\p{L}\p{N}_])(?:вайб[-\s]?код(?:инг)?\p{L}*|vibe[-\s]?coding)(?=$|[^\p{L}\p{N}_])/iu;
const SUPER_POWERS_PATTERN = /(?:^|[^\p{L}\p{N}_])super\s*powers?(?=$|[^\p{L}\p{N}_])/iu;
const WORKFLOW_PATTERN = /(?:^|[^\p{L}\p{N}_])(?:реализ\p{L}*|этап\p{L}*|план\p{L}*|контекст\p{L}*|сжат\p{L}*|implement\p{L}*|stages?|phases?|planning|context|compaction)(?=$|[^\p{L}\p{N}_])/iu;
const VERSION_CONTROL_ACTION_PATTERN = /(?:^|[^\p{L}\p{N}_])(?:заком+ит\p{L}*|запуш\p{L}*|git\s+(?:commit|push))(?![\p{L}\p{N}_])/iu;
const MAIN_BRANCH_PATTERN = /(?:^|[^\p{L}\p{N}_])(?:(?:ветк\p{L}*|branch(?:es)?)\s+main)(?=$|[^\p{L}\p{N}_])/iu;

/**
 * Deliberately conservative. It catches explicit coding-workflow markers without
 * trying to classify ordinary image/video prompts from their general wording.
 */
export function promptLooksLikeVibecoding(prompt: string) {
  const value = prompt.trim();
  if (!value) return false;
  if (EXPLICIT_VIBECODING_PATTERN.test(value)) return true;
  if (VERSION_CONTROL_ACTION_PATTERN.test(value)) return true;
  if (MAIN_BRANCH_PATTERN.test(value) && WORKFLOW_PATTERN.test(value)) return true;
  return SUPER_POWERS_PATTERN.test(value) && WORKFLOW_PATTERN.test(value);
}
