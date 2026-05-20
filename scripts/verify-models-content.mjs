#!/usr/bin/env node
// Phase v2.0 MODELS-B-2: verify generated model content files against the
// ModelContent schema and quality criteria. Reports per-file pass/fail with
// the specific check that broke. Used as the gate before committing batch.
//
// Usage:
//   node scripts/verify-models-content.mjs               # check all files
//   node scripts/verify-models-content.mjs kling-2.6 sora-2   # check specific
//   node scripts/verify-models-content.mjs --sample 7   # check 5 random + 2 fixed

import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MODELS_DIR = join(ROOT, "src/content/models");

// Two fixed models that exercise complex cases (image + video)
const FIXED_SAMPLES = ["midjourney-7", "kling-3"];

const args = process.argv.slice(2);
let mode = "all";
let sampleN = 7;
let explicitSlugs = [];

if (args.includes("--sample")) {
  mode = "sample";
  const idx = args.indexOf("--sample");
  sampleN = parseInt(args[idx + 1] ?? "7", 10);
} else if (args.length > 0) {
  mode = "explicit";
  explicitSlugs = args;
}

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function hasCyrillic(s) {
  return /[а-яА-ЯёЁ]/.test(s);
}

function flattenLocale(loc) {
  // concat strings for cross-locale checks (e.g. cyrillic in EN)
  const parts = [loc.title, loc.description, loc.h1, loc.intro];
  for (const s of loc.sections ?? []) {
    parts.push(s.heading, s.body);
    parts.push(...(s.bullets ?? []));
    if (s.table) {
      for (const row of s.table.rows ?? []) parts.push(...row);
    }
  }
  for (const e of loc.examples ?? []) parts.push(e.before, e.after, e.note ?? "");
  for (const m of loc.mistakes ?? []) parts.push(m.title, m.explain);
  for (const f of loc.faq ?? []) parts.push(f.q, f.a);
  return parts.join(" ");
}

const checks = {
  title_length: (loc) => {
    if (!loc.title || loc.title.length > 60) {
      return `title.length=${loc.title?.length ?? 0} (must <=60)`;
    }
    return null;
  },
  description_length: (loc) => {
    const len = loc.description?.length ?? 0;
    if (len < 140 || len > 170) {
      return `description.length=${len} (target 150-160, accept 140-170)`;
    }
    return null;
  },
  intro_words: (loc) => {
    const n = countWords(loc.intro ?? "");
    if (n < 35 || n > 70) {
      return `intro words=${n} (target 40-60, accept 35-70)`;
    }
    return null;
  },
  sections_count: (loc) => {
    const n = (loc.sections ?? []).length;
    if (n < 3 || n > 6) {
      return `sections.length=${n} (target 4-5, accept 3-6)`;
    }
    return null;
  },
  examples_count: (loc) => {
    const n = (loc.examples ?? []).length;
    if (n !== 3) return `examples.length=${n} (must ===3)`;
    return null;
  },
  mistakes_count: (loc) => {
    const n = (loc.mistakes ?? []).length;
    if (n !== 5) return `mistakes.length=${n} (must ===5)`;
    return null;
  },
  faq_count: (loc) => {
    const n = (loc.faq ?? []).length;
    if (n < 6) return `faq.length=${n} (must >=6)`;
    return null;
  },
  faq_answer_length: (loc) => {
    for (const [i, f] of (loc.faq ?? []).entries()) {
      const words = countWords(f.a ?? "");
      if (words < 25) return `faq[${i}].a words=${words} (must >=30, accept 25)`;
    }
    return null;
  },
};

const enChecks = {
  no_cyrillic: (loc) => {
    const all = flattenLocale(loc);
    if (hasCyrillic(all)) {
      const m = all.match(/[а-яА-ЯёЁ]+[а-яА-ЯёЁ\s]{0,20}/);
      return `EN locale contains Cyrillic: "${m?.[0]}..."`;
    }
    return null;
  },
};

function parityCheck(ru, en) {
  if ((ru.sections?.length ?? 0) !== (en.sections?.length ?? 0)) {
    return `sections RU=${ru.sections?.length} EN=${en.sections?.length}`;
  }
  if ((ru.examples?.length ?? 0) !== (en.examples?.length ?? 0)) {
    return `examples RU=${ru.examples?.length} EN=${en.examples?.length}`;
  }
  if ((ru.mistakes?.length ?? 0) !== (en.mistakes?.length ?? 0)) {
    return `mistakes RU=${ru.mistakes?.length} EN=${en.mistakes?.length}`;
  }
  if ((ru.faq?.length ?? 0) !== (en.faq?.length ?? 0)) {
    return `faq RU=${ru.faq?.length} EN=${en.faq?.length}`;
  }
  return null;
}

async function checkFile(slug) {
  const path = join(MODELS_DIR, `${slug}.ts`);
  let mod;
  try {
    mod = await import(pathToFileURL(path).href);
  } catch (e) {
    return { slug, ok: false, errors: [`import failed: ${e.message}`] };
  }
  const content = mod.content;
  if (!content || !content.ru || !content.en) {
    return { slug, ok: false, errors: [`missing content.ru or content.en`] };
  }

  const errors = [];
  for (const [name, check] of Object.entries(checks)) {
    const ru = check(content.ru);
    if (ru) errors.push(`RU ${name}: ${ru}`);
    const en = check(content.en);
    if (en) errors.push(`EN ${name}: ${en}`);
  }
  for (const [name, check] of Object.entries(enChecks)) {
    const err = check(content.en);
    if (err) errors.push(`EN ${name}: ${err}`);
  }
  const parity = parityCheck(content.ru, content.en);
  if (parity) errors.push(`parity: ${parity}`);

  return { slug, ok: errors.length === 0, errors };
}

async function checkMetaEnCyrillic() {
  // EN pages must never show Russian in the free-text meta fields (name,
  // platform, duration, resolution). Those come from _registry.ts (parsed
  // verbatim from the RU skill MDs); src/content/models/metaEn.ts supplies the
  // EN overrides. This gate fails if any EN-resolved value still has Cyrillic.
  const reg = await import(pathToFileURL(join(MODELS_DIR, "_registry.ts")).href);
  const { metaField } = await import(pathToFileURL(join(MODELS_DIR, "metaEn.ts")).href);
  const fields = ["name", "platform", "duration", "resolution"];
  const failures = [];
  for (const meta of reg.MODELS_REGISTRY) {
    for (const f of fields) {
      const en = metaField(meta, f, "en");
      if (en && hasCyrillic(en)) {
        failures.push(`${meta.slug}.${f}: EN meta has Cyrillic — add a metaEn.ts override (got "${en.slice(0, 40)}…")`);
      }
    }
  }
  return failures;
}

async function main() {
  let slugs;
  if (mode === "explicit") {
    slugs = explicitSlugs;
  } else {
    const files = await readdir(MODELS_DIR);
    slugs = files
      .filter((f) => f.endsWith(".ts") && !f.startsWith("_") && f !== "index.ts" && f !== "slugs.ts" && f !== "types.ts")
      .map((f) => f.replace(/\.ts$/, ""));

    if (mode === "sample") {
      const allSlugs = slugs.filter((s) => !FIXED_SAMPLES.includes(s));
      const randomN = Math.max(0, sampleN - FIXED_SAMPLES.length);
      const shuffled = allSlugs.sort(() => Math.random() - 0.5).slice(0, randomN);
      slugs = [...FIXED_SAMPLES.filter((s) => files.includes(`${s}.ts`)), ...shuffled];
    }
  }

  slugs.sort();
  const results = [];
  for (const slug of slugs) {
    results.push(await checkFile(slug));
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;

  console.log(`\nChecked ${results.length} model files. ${passed} passed, ${failed.length} failed.\n`);
  for (const r of results) {
    if (r.ok) {
      console.log(`✓ ${r.slug}`);
    } else {
      console.log(`✗ ${r.slug}`);
      for (const err of r.errors) {
        console.log(`    ${err}`);
      }
    }
  }
  const metaFailures = await checkMetaEnCyrillic();
  if (metaFailures.length === 0) {
    console.log(`\n✓ EN meta: no Cyrillic in name/platform/duration/resolution.`);
  } else {
    console.log(`\n✗ EN meta: ${metaFailures.length} Cyrillic leak(s):`);
    for (const m of metaFailures) console.log(`    ${m}`);
  }

  if (failed.length > 0 || metaFailures.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("verify-models-content failed:", err);
  process.exit(2);
});
