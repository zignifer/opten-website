// Phase 5 B-01: blog barrel. Single source of truth for blog post slugs.
// Append new posts here; src/app/pages/BlogListPage.tsx + scripts/seo-routes.ts
// + src/i18n/paths.ts + scripts/sitemap.mjs PATH_TO_SOURCE must stay in sync.

import { post as gptImage2 } from "./gpt-image-2";
import { post as aiHeadshotGenerator } from "./ai-headshot-generator";
import { post as aiUgcForBrands } from "./ai-ugc-for-brands";
import { post as aiFaceSwap } from "./ai-face-swap";
import { post as flux2Prompts } from "./flux-2-prompts";
import { post as kling3Prompts } from "./kling-3-prompts";
import { post as aiInfluencer } from "./ai-influencer";
import { post as aiLipSync } from "./ai-lip-sync";
import { post as upscaleImageAi } from "./upscale-image-ai";
import { post as seedance20Prompts } from "./seedance-2-0-prompts";
import { post as promptExamples } from "./prompt-examples";
import { post as bestAiVideo2026 } from "./best-ai-video-2026";
import { post as consistentCharacterAi } from "./consistent-character-ai";
import { post as imageToVideo } from "./image-to-video";
import { post as negativePrompt } from "./negative-prompt";
import { post as nanoBananaPrompts } from "./nano-banana-prompts";
import { post as promptStructure } from "./prompt-structure";
import { post as sora2VsVeo31 } from "./sora-2-vs-veo-3-1";
import { post as aiLogoGeneratorPrompt } from "./ai-logo-generator-prompt";
import type { BlogPost } from "./types";

export const blogPostsBySlug = {
  "ai-headshot-generator": aiHeadshotGenerator,
  "ai-ugc-for-brands": aiUgcForBrands,
  "upscale-image-ai": upscaleImageAi,
  "ai-lip-sync": aiLipSync,
  "flux-2-prompts": flux2Prompts,
  "kling-3-prompts": kling3Prompts,
  "ai-influencer": aiInfluencer,
  "prompt-examples": promptExamples,
  "seedance-2-0-prompts": seedance20Prompts,
  "ai-face-swap": aiFaceSwap,
  "best-ai-video-2026": bestAiVideo2026,
  "ai-logo-generator-prompt": aiLogoGeneratorPrompt,
  "sora-2-vs-veo-3-1": sora2VsVeo31,
  "nano-banana-prompts": nanoBananaPrompts,
  "consistent-character-ai": consistentCharacterAi,
  "prompt-structure": promptStructure,
  "negative-prompt": negativePrompt,
  "image-to-video": imageToVideo,
  "gpt-image-2": gptImage2,
} as const;

export type BlogSlug = keyof typeof blogPostsBySlug;

// Sorted newest-first by RU publishedAt (RU/EN dates are kept in sync per locale-parity policy).
export const allBlogPosts: { slug: BlogSlug; post: BlogPost }[] = (Object.keys(blogPostsBySlug) as BlogSlug[])
  .map((slug) => ({ slug, post: blogPostsBySlug[slug] }))
  .sort((a, b) => b.post.ru.publishedAt.localeCompare(a.post.ru.publishedAt));

export type { BlogPost } from "./types";
