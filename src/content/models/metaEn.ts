// Phase v2.0 follow-up (2026-05-20): English translations for the free-text
// ModelMeta fields (name / platform / duration / resolution) that
// build-models-registry.mjs parses VERBATIM from the Russian skill MDs.
//
// Why this file exists: the registry is auto-generated from RU-only skill
// sources, so those four prose fields come out in Russian and previously
// leaked onto the /en/* pages (Quick Facts table, related-model cards, hub
// cards, breadcrumb + SoftwareApplication schema). ModelMeta is locale-neutral
// by design; this map supplies the EN side. The generator NEVER touches this
// file, so it is regen-safe — re-running build-models-registry.mjs refreshes
// the RU values without clobbering these translations.
//
// Keyed by slug. Only fields whose generated value contains Russian need an
// entry (brand names identical across locales fall back to the raw value via
// metaField). Verify gate: scripts/verify-models-content.mjs asserts no
// Cyrillic survives in any EN-resolved meta field.

import type { ModelMeta } from "./types";

type LocalizableField = "name" | "platform" | "duration" | "resolution";
type MetaEnFields = Partial<Record<LocalizableField, string>>;

export const META_EN: Record<string, MetaEnFields> = {
  "flux": {
    platform: "Replicate, Segmind, ComfyUI, fal.ai, BFL API, etc.",
    resolution: "Up to 2048×2048 (varies by version and platform)",
  },
  "flux-1": {
    platform: "Replicate, Segmind, ComfyUI, fal.ai, BFL API, Together AI, etc.",
    resolution: "Up to 1440×1440 (pro), up to 2752×2752 (1.1 pro ultra)",
  },
  "flux-kontext": {
    platform: "Replicate, BFL API, Segmind, ComfyUI, fal.ai, etc.",
  },
  "gpt-image-2": {
    resolution: "Up to 4K (3840×2160), with caveats; 2K (2560×1440) stable, higher is experimental…",
  },
  "grok-imagine": {
    resolution: "1K (default), 2K (`resolution` parameter)",
  },
  "happy-horse": {
    platform: "Alibaba ATH (open source), available on fal.ai, Morphic, Mobi and other hosts",
    duration: "5–8 seconds by default; up to 12 sec on Lite, up to 15 sec on the paid tier",
    resolution: "Native 1080p HD (no upscaling)",
  },
  "higgsfield": {
    platform: "Higgsfield (higgsfield.ai) — platform with proprietary models + aggregator of third-party models",
    duration: "N/A | N/A | 5 seconds",
    resolution: "Up to 4K | Not documented | 720p–1080p",
  },
  "imagen": {
    platform: "Google AI (ImageFX, Vertex AI, Freepik, and other platforms)",
    resolution: "Up to 1024×1024 (varies by version and platform)",
  },
  "imagen-4": {
    resolution: "Up to 1024×1024 (standard); varies by platform",
  },
  "imagen-4-ultra": {
    resolution: "Highest in the Imagen 4 family",
  },
  "kling": {
    name: "Kling (general)",
    duration: "5–10 seconds (standard), up to 15 seconds (Kling 3.0)",
    resolution: "Up to 1080p",
  },
  "kling-2.6": {
    duration: "Up to 10 seconds (standard)",
    resolution: "Up to 1080p",
  },
  "kling-3": {
    duration: "Up to 15 seconds",
    resolution: "Up to 1080p",
  },
  "kling-motion-control": {
    duration: "5–10 seconds",
    resolution: "Up to 4K (Kling 3.0), up to 1080p (Kling 2.6)",
  },
  "kling-o1": {
    duration: "Up to 10 seconds",
    resolution: "Up to 1080p",
  },
  "ltx-2": {
    duration: "Up to 20 seconds | Up to 10 seconds",
    resolution: "Up to 4K (2160p); 1080p, 1440p | Up to 4K (2160p)",
  },
  "luma-ray": {
    name: "Luma Ray (general family)",
    duration: "5–10 seconds (extend up to ~30 seconds)",
    resolution: "720p, 1080p (native); 4K via upscaling",
  },
  "luma-ray-2": {
    duration: "5 or 10 seconds (selectable in settings)",
    resolution: "720p (native), 1080p, upscale to 4K",
  },
  "luma-ray-3": {
    platform: "Luma Dream Machine, Adobe Firefly (integration)",
    duration: "5s or 10s | 5s or 10s",
    resolution: "Draft, 540p, 720p, 1080p (native) | 720p, 1080p",
  },
  "luma-uni-1": {
    resolution: "Native 2K (no upscaling); several tiers available via API",
  },
  "midjourney": {
    resolution: "Up to 1024×1024 (V7), up to 2048×2048 (V8 with --hd)",
  },
  "midjourney-7": {
    resolution: "Up to 1024×1024",
  },
  "midjourney-8": {
    platform: "alpha.midjourney.com (web interface only, Discord not supported)",
    resolution: "Up to 2048×2048 (with --hd)",
  },
  "midjourney-8.1": {
    platform: "alpha.midjourney.com — web only, Discord not supported.",
    resolution: "HD by default (native 2K) — `--hd` is no longer a flag but the baseline",
  },
  "midjourney-niji": {
    resolution: "Up to 1024×1024",
  },
  "midjourney-video": {
    duration: "Short clips (exact limits TBD)",
  },
  "minimax-hailuo-02": {
    duration: "6s or 10s (512P/768P); 6s only (1080P) | Same",
  },
  "minimax-hailuo-2.3": {
    duration: "6s or 10s (768P); 6s only (1080P) | 6s or 10s (768P); 6s only (1080P)",
  },
  "minimax-live-illustrations": {
    duration: "Up to 6 seconds",
  },
  "mystic": {
    resolution: "Up to 2K (standard Freepik Pikaso output)",
  },
  "nano-banana": {
    name: "Nano Banana (general fallback for all versions)",
    resolution: "Up to 1K (base versions), up to 4K (Pro)",
  },
  "nano-banana-2": {
    resolution: "Up to 2K",
  },
  "nano-banana-pro": {
    platform: "Google AI Studio, Gemini API (Gemini 3 Pro model)",
    resolution: "Up to 4K (native high-resolution generation)",
  },
  "omni-human": {
    platform: "ByteDance Intelligent Creation, API via Replicate/fal.ai",
    duration: "Up to 30 seconds (API); >1 min (research model)",
    resolution: "1024×1024 at 30fps",
  },
  "pixverse-6": {
    platform: "PixVerse (pixverse.ai), API via Runware/fal.ai",
    duration: "Up to 15s at 1080p | 5/8/10s (1080p: 5–8s; 10s max 720p)",
    resolution: "Up to 1080p | Up to 1080p",
  },
  "qwen-image": {
    resolution: "Standard | Native 2048×2048 (2K)",
  },
  "recraft-v4": {
    platform: "Recraft (recraft.ai), Figma Plugin, MCP integration",
  },
  "reve": {
    resolution: "Native 2048×2048; 4K upscaling (4096×4096)",
  },
  "runway-gen4": {
    duration: "5 or 10 seconds | 5 or 10 seconds",
    resolution: "720p native, upscale to 4K | 720p",
  },
  "runway-gen4.5": {
    duration: "2–10 seconds (flexible)",
    resolution: "720p native, upscale to 4K",
  },
  "seedance": {
    duration: "4–15 seconds per run",
    resolution: "Up to 2K",
  },
  "seedance-1.0-lite": {
    duration: "5 or 10 seconds (fixed options)",
  },
  "seedance-1.0-pro": {
    duration: "5 or 10 seconds (fixed options)",
  },
  "seedance-1.5-pro": {
    duration: "5 or 10 seconds",
  },
  "seedance-2.0": {
    duration: "4–15 seconds per run",
    resolution: "Up to 2K",
  },
  "seedance-new": {
    duration: "4–15 seconds per run",
    resolution: "Up to 2K",
  },
  "seedream": {
    name: "Seedream (general)",
    platform: "ByteDance (available via fal.ai, syntx.ai, YouMind, flux-ai.io and other platforms)",
    resolution: "Up to 2K (v4.0), up to 4K+ (v4.5, v5)",
  },
  "seedream-4": {
    platform: "ByteDance (available via fal.ai, flux-ai.io and other platforms)",
    resolution: "Up to 2K",
  },
  "seedream-4.5": {
    platform: "ByteDance (available via fal.ai, YouMind, flux-ai.io and other platforms)",
    resolution: "Up to 4K",
  },
  "seedream-5": {
    platform: "ByteDance (available via fal.ai, syntx.ai and other platforms)",
    resolution: "Up to 4K+",
  },
  "sora": {
    duration: "4–20 seconds per run",
  },
  "sora-2": {
    duration: "4, 8, 12, 16 or 20 seconds (set via API, not in the prompt)",
  },
  "veed-fabric": {
    platform: "VEED (veed.io), API via fal.ai",
    duration: "Up to 5 minutes (API); up to 30s/clip (Studio) | Same",
  },
  "veo": {
    duration: "5–8 seconds (varies by version)",
    resolution: "Up to 720p (1280×720) base",
  },
  "veo-3": {
    duration: "~8 seconds",
    resolution: "720p (1280×720) base, upscale to 4K via third-party tools",
  },
  "veo-3.1": {
    name: "Google Veo 3.1 (incl. Veo 3.1 Fast and Veo 3.1 Fast Relax)",
    duration: "5–8 seconds (standard), up to several minutes (extended)",
    resolution: "Up to 1080p (Veo 3.1), 720p (Veo 3.1 Fast/Fast Relax)",
  },
  "wan": {
    platform: "fal.ai, Replicate, local run (open model by Alibaba/Wan-AI)",
    resolution: "Up to 1024×1024 (varies by platform and configuration)",
  },
  "z-image": {
    resolution: "Flexible, up to ~4 megapixels | Same",
  },
};

/**
 * Locale-correct value for a free-text ModelMeta field. On EN, prefers the
 * hand-maintained META_EN override; falls back to the raw (generated, RU) value
 * when no override exists (brand names are usually identical across locales).
 * Also strips stray `**` markdown bold that leaks from the source skill tables
 * (the Quick Facts <dd> renders plain text, so the asterisks would show
 * literally on both locales).
 */
export function metaField(
  meta: ModelMeta,
  field: LocalizableField,
  lang: "ru" | "en",
): string | null {
  const override = lang === "en" ? META_EN[meta.slug]?.[field] : undefined;
  const raw = override ?? (meta[field] as string | null);
  if (raw == null) return null;
  return raw.replace(/\*\*/g, "");
}
