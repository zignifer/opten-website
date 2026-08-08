// Mirrors PS_CHAT_TOP_MODELS in C:\Projects\promptscore\popup\popup.js.
// Keep the order, labels, and skill IDs aligned with the extension quick-Improve tab.
export const PROMPT_WORKBENCH_MODELS = {
  image: [
    { slug: "nano-banana-2", label: "Nano Banana 2" },
    { slug: "nano-banana-pro", label: "Nano Banana Pro" },
    { slug: "gpt-image-2", label: "GPT Image 2" },
    { slug: "midjourney-8.1", label: "Midjourney 8.1" },
    { slug: "seedream-5-pro", label: "Seedream 5.0 Pro" },
    { slug: "recraft-v4.1", label: "Recraft V4.1" },
  ],
  video: [
    { slug: "seedance-2.5", label: "Seedance 2.5" },
    { slug: "seedance-2.0", label: "Seedance 2.0" },
    { slug: "kling-3", label: "Kling 3.0" },
    { slug: "veo-3.1", label: "Google Veo 3.1" },
    { slug: "flux-3", label: "FLUX 3" },
    { slug: "grok-imagine-video-1.5", label: "Grok Imagine" },
  ],
  vibecoding: [
    { slug: "codex", label: "Codex" },
    { slug: "claude", label: "Claude" },
    { slug: "gemini", label: "Gemini" },
  ],
} as const;

export type PromptWorkbenchType = keyof typeof PROMPT_WORKBENCH_MODELS;
