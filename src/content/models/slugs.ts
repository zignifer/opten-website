// Phase v2.0 MODELS-A-4: light-import slug list — used by src/i18n/paths.ts to
// build EN_SIBLINGS without pulling all content modules into the i18n bundle.
//
// MODEL_SLUGS_WITH_CONTENT is hand-maintained. Add a slug here AFTER its
// `<slug>.ts` content file lands. In Phase 1, only the manual reference
// (gpt-image-2) is here; Phase 2 expands this to all 62 slugs after agents
// generate the rest.

export const MODEL_SLUGS_WITH_CONTENT: readonly string[] = [
  "gpt-image-2", // Phase 1 manual reference
] as const;
