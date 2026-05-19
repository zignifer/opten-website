// Phase v2.0 MODELS-A-4: models barrel. Heavy import (pulls all content modules
// via Vite glob). Consumed by scripts/seo-routes.ts (RouteMeta loop) and
// src/app/pages/ModelsHubPage.tsx (card grid). For the light slug list used by
// src/i18n/paths.ts, import from "./slugs" instead.

import { MODELS_REGISTRY } from "./_registry";
import { MODEL_SLUGS_WITH_CONTENT } from "./slugs";
import type { ModelContent, ModelEntry, ModelMeta } from "./types";

// Vite glob resolves at build time. Each generated content file under
// src/content/models/<slug>.ts exports a `content: ModelContent` const.
const contentModules = import.meta.glob<{ content: ModelContent }>(
  "./[!_]*.ts",
  { eager: true }
);

function contentForSlug(slug: string): ModelContent | undefined {
  const key = "./" + slug + ".ts";
  const mod = contentModules[key];
  return mod ? mod.content : undefined;
}

// Sanity check at build time: every slug declared in MODEL_SLUGS_WITH_CONTENT
// must have a corresponding content module. Surfaces drift between slugs.ts
// (manually maintained) and the actual content files.
for (const slug of MODEL_SLUGS_WITH_CONTENT) {
  if (!contentForSlug(slug)) {
    throw new Error(
      `[content/models] slug "${slug}" listed in MODEL_SLUGS_WITH_CONTENT but ` +
        `src/content/models/${slug}.ts is missing.`
    );
  }
}

export const ALL_MODEL_SLUGS: readonly string[] = MODELS_REGISTRY.map((m) => m.slug);

export const allModels: ModelEntry[] = MODELS_REGISTRY.map((meta) => ({
  slug: meta.slug,
  meta,
  content: contentForSlug(meta.slug),
}));

export const modelsBySlug: Record<string, ModelEntry> = allModels.reduce(
  (acc, m) => {
    acc[m.slug] = m;
    return acc;
  },
  {} as Record<string, ModelEntry>
);

export function getModelBySlug(slug: string): ModelEntry | undefined {
  return modelsBySlug[slug];
}

/**
 * Returns up to `n` models of the same type, alphabetically descending (stable),
 * excluding the given slug. Used by RelatedModels component.
 */
export function getRelatedModels(slug: string, type: ModelMeta["type"], n = 3): ModelEntry[] {
  return allModels
    .filter((m) => m.meta.type === type && m.slug !== slug)
    .sort((a, b) => b.slug.localeCompare(a.slug))
    .slice(0, n);
}

export { MODEL_SLUGS_WITH_CONTENT } from "./slugs";
export type { ModelMeta, ModelLocale, ModelContent, ModelEntry } from "./types";
