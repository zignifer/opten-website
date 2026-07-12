// Mirrors PS_CHAT_TOP_MODELS in C:\Projects\promptscore\popup\popup.js.
// Keep the order, labels, and skill IDs aligned with the extension quick-Improve tab.
export const PROMPT_WORKBENCH_MODELS = {
  image: [
    { slug: "nano-banana-2", label: "Nano Banana 2" },
    { slug: "nano-banana-pro", label: "Nano Banana Pro" },
    { slug: "gpt-image-2", label: "Chat GPT Image 2" },
    { slug: "midjourney-8", label: "Midjourney 8" },
    { slug: "midjourney-7", label: "Midjourney 7" },
    { slug: "seedream-5", label: "Seedream 5 Lite" },
    { slug: "flux", label: "Flux 2 Pro" },
    { slug: "z-image", label: "Z-Image" },
  ],
  video: [
    { slug: "seedance-2.0", label: "Seedance 2.0" },
    { slug: "kling-3", label: "Kling 3.0" },
    { slug: "kling-2.6", label: "Kling 2.6" },
    { slug: "veo-3.1", label: "Google Veo 3.1" },
    { slug: "veo-3", label: "Google Veo 3.0" },
    { slug: "wan", label: "Wan 2.6" },
  ],
} as const;

export type PromptWorkbenchType = keyof typeof PROMPT_WORKBENCH_MODELS;
