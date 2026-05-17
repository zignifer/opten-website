// Phase 4 D-04: anchor guide barrel. Additional guides land in Phase 4.1 — append to this map.

import { guide as gptImage2 } from "./gpt-image-2";

export const guidesBySlug = {
  "gpt-image-2": gptImage2,
} as const;

export type GuideSlug = keyof typeof guidesBySlug;
