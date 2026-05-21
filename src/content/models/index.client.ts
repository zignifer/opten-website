// Speed/Phase B: CLIENT-only model store. vite.config.ts aliases
// "@/content/models" to THIS file for the browser build, so the eager 62-file
// content glob in index.ts never ships in the entry chunk.
//
//   - Hub + RelatedModels read meta (./_registry) + intro (./_summaries) only.
//   - A model page reads its ONE model's full content from the #opten-model
//     data-island (injected by scripts/prerender.mjs), seeded synchronously here
//     at module init → hydration matches the prerendered HTML, no mismatch.
//   - Client-side SPA navigation to another model lazy-loads that model's chunk
//     via loadModelBySlug().
//
// SSR + build scripts keep using the full eager barrel (index.ts) unchanged.

import { MODELS_REGISTRY } from "./_registry";
import { MODEL_SUMMARIES } from "./_summaries";
import { HUB_HIDDEN_SLUGS } from "./slugs";
import type { ModelContent, ModelEntry, ModelLocale, ModelMeta } from "./types";

export { HUB_HIDDEN_SLUGS };

// Lazy per-model content chunks (NOT eager). Negative patterns keep the infra
// modules out, so only the 62 <slug>.ts content files become code-split chunks.
const lazyContent = import.meta.glob<{ content: ModelContent }>([
  "./[!_]*.ts",
  "!./index.ts",
  "!./index.client.ts",
  "!./metaEn.ts",
  "!./slugs.ts",
  "!./types.ts",
]);

const metaBySlug: Record<string, ModelMeta> = Object.fromEntries(
  MODELS_REGISTRY.map((m) => [m.slug, m]),
);

// Summary-only entries for the hub/related grids. Hub + RelatedModels read only
// meta + content[lang].intro, so the other ModelLocale fields are empty stubs.
function summaryContent(slug: string): ModelContent | undefined {
  const s = MODEL_SUMMARIES[slug];
  if (!s) return undefined;
  const stub = (intro: string): ModelLocale => ({
    title: "",
    description: "",
    h1: "",
    intro,
    sections: [],
    examples: [],
    mistakes: [],
    faq: [],
  });
  return { ru: stub(s.ru), en: stub(s.en) };
}

export const allModels: ModelEntry[] = MODELS_REGISTRY.map((meta) => ({
  slug: meta.slug,
  meta,
  content: summaryContent(meta.slug),
}));

export function getRelatedModels(slug: string, type: ModelMeta["type"], n = 3): ModelEntry[] {
  return allModels
    .filter((m) => m.meta.type === type && m.slug !== slug)
    .sort((a, b) => b.slug.localeCompare(a.slug))
    .slice(0, n);
}

// --- full-content store for the current model page ---
const fullCache = new Map<string, ModelEntry>();

// Seed from the prerendered data-island so the model page hydrates with the
// exact content the server rendered (synchronous → no React #418/#423).
(function seedFromIsland(): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById("opten-model");
  if (!el || !el.textContent) return;
  try {
    const data = JSON.parse(el.textContent) as ModelEntry;
    if (data && data.slug) {
      fullCache.set(data.slug, { slug: data.slug, meta: data.meta, content: data.content });
    }
  } catch {
    // malformed island — fall through to lazy load
  }
})();

export function getModelBySlug(slug: string): ModelEntry | undefined {
  return fullCache.get(slug);
}

export async function loadModelBySlug(slug: string): Promise<ModelEntry | undefined> {
  const cached = fullCache.get(slug);
  if (cached) return cached;
  const loader = lazyContent["./" + slug + ".ts"];
  const meta = metaBySlug[slug];
  if (!loader || !meta) return undefined;
  const mod = await loader();
  const entry: ModelEntry = { slug, meta, content: mod.content };
  fullCache.set(slug, entry);
  return entry;
}

export { MODEL_SLUGS_WITH_CONTENT } from "./slugs";
export type { ModelMeta, ModelContent, ModelEntry } from "./types";
