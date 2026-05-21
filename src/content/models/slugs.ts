// Phase v2.0 MODELS-A-4: light-import slug list — used by src/i18n/paths.ts to
// build EN_SIBLINGS without pulling all content modules into the i18n bundle.
//
// MODEL_SLUGS_WITH_CONTENT is hand-maintained. Add a slug here AFTER its
// `<slug>.ts` content file lands. Phase 2 expanded this to all 62 slugs once
// the parallel agents generated the content files (order mirrors _registry.ts).

export const MODEL_SLUGS_WITH_CONTENT: readonly string[] = [
  "flux",
  "flux-1",
  "flux-kontext",
  "gpt-image",
  "gpt-image-1",
  "gpt-image-1.5",
  "gpt-image-2", // Phase 1 manual reference
  "grok-imagine",
  "happy-horse",
  "higgsfield",
  "imagen",
  "imagen-4",
  "imagen-4-ultra",
  "kling",
  "kling-2.6",
  "kling-3",
  "kling-motion-control",
  "kling-o1",
  "ltx-2",
  "luma-ray",
  "luma-ray-2",
  "luma-ray-3",
  "luma-uni-1",
  "midjourney",
  "midjourney-7",
  "midjourney-8",
  "midjourney-8.1",
  "midjourney-niji",
  "midjourney-video",
  "minimax-hailuo-02",
  "minimax-hailuo-2.3",
  "minimax-live-illustrations",
  "mystic",
  "nano-banana",
  "nano-banana-2",
  "nano-banana-pro",
  "omni-human",
  "pixverse-6",
  "qwen-image",
  "recraft-v4",
  "reve",
  "runway-act-two",
  "runway-gen4",
  "runway-gen4.5",
  "seedance",
  "seedance-1.0-lite",
  "seedance-1.0-pro",
  "seedance-1.5-pro",
  "seedance-2.0",
  "seedance-new",
  "seedream",
  "seedream-4",
  "seedream-4.5",
  "seedream-5",
  "sora",
  "sora-2",
  "veed-fabric",
  "veo",
  "veo-3",
  "veo-3.1",
  "wan",
  "z-image",
] as const;

// General/umbrella model pages — bare-brand names that have specific versioned
// siblings (e.g. "FLUX (General)" alongside flux-1/flux-kontext). The pages stay
// live + in the sitemap for generic-query SEO, but are hidden from the /models
// hub grid + its ItemList schema. Lives here (the light-import module) so both
// index.ts (SSR/build) and index.client.ts (browser) share one source of truth
// without either pulling the eager content glob.
export const HUB_HIDDEN_SLUGS: ReadonlySet<string> = new Set<string>([
  "flux",
  "gpt-image",
  "imagen",
  "kling",
  "luma-ray",
  "midjourney",
  "nano-banana",
  "seedance",
  "seedream",
  "sora",
  "veo",
]);
