import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = resolve(ROOT, "seo2", "topic-registry.json");
const OUT_DIR = resolve(ROOT, ".tmp", "seo-topic-research");
const OUT_PATH = resolve(OUT_DIR, "latest-keywords.json");
const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
const args = process.argv.slice(2);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}

if (args.includes("--help") || args.includes("-h")) {
  console.log([
    "Usage: node scripts/collect-seo-keywords.mjs [options]",
    "  --group <name|all>   Seed group from seo2/topic-registry.json (default: all)",
    "  --alphabet           Expand every seed with a-z / а-я",
    "  --modifiers          Add how/best/examples-style variants",
    "  --bing               Enrich EN suggestions through Bing Webmaster",
    "  --max-seeds <n>      Limit requests for a small manual pass",
    "  --dry-run            Validate and show request count without network calls",
  ].join("\n"));
  process.exit(0);
}

const selectedGroup = valueAfter("--group") ?? "all";
const maxSeeds = Number(valueAfter("--max-seeds") ?? "0");
const useAlphabet = args.includes("--alphabet");
const useModifiers = args.includes("--modifiers");
const useBing = args.includes("--bing");
const dryRun = args.includes("--dry-run");
const groups = registry.research.seedGroups.filter((group) => selectedGroup === "all" || group.name === selectedGroup);
if (groups.length === 0) throw new Error(`Unknown seed group "${selectedGroup}"`);

const letters = {
  en: [..."abcdefghijklmnopqrstuvwxyz"],
  ru: [..."абвгдежзиклмнопрстуфхцчшэюя"],
};
const modifiers = {
  en: { prefix: ["how to", "best"], suffix: ["examples", "for beginners", "2026"] },
  ru: { prefix: ["как", "лучшие"], suffix: ["пример", "для начинающих", "2026"] },
};
const globalReject = /ваканс|vacanc|зарплат|salary|\bjobs?\b|\bapk\b|crack|кряк|torrent|торрент|скачать бесплатно/i;
const sleep = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));
const normalize = (value) => value.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();

function expandSeeds(base, language) {
  let values = [...base];
  if (useModifiers) {
    values = values.flatMap((seed) => [
      seed,
      ...modifiers[language].prefix.map((prefix) => `${prefix} ${seed}`),
      ...modifiers[language].suffix.map((suffix) => `${seed} ${suffix}`),
    ]);
  }
  if (useAlphabet) values = values.flatMap((seed) => [seed, ...letters[language].map((letter) => `${seed} ${letter}`)]);
  return [...new Set(values.map(normalize))];
}

async function fetchJson(url, label, attempts = 2) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36" },
    });
    if (response.status === 429) throw new Error(`${label}: HTTP 429; stop this research batch`);
    if (response.ok) return response.json();
    if (response.status < 500 || attempt === attempts) throw new Error(`${label}: HTTP ${response.status}`);
    await sleep(500 * attempt);
  }
}

async function suggestions(seed, language) {
  const gl = language === "ru" ? "ru" : "us";
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${language}&gl=${gl}&q=${encodeURIComponent(seed)}`;
  const body = await fetchJson(url, `Google Suggest ${language}/${seed}`);
  return Array.isArray(body?.[1]) ? body[1] : [];
}

async function bingVolume(keyword) {
  const apiKey = process.env.BING_WEBMASTER_API_KEY;
  if (!apiKey) throw new Error("Missing BING_WEBMASTER_API_KEY");
  const end = new Date();
  const start = new Date(Date.now() - 31 * 864e5);
  const iso = (date) => date.toISOString().slice(0, 10);
  const params = new URLSearchParams({ q: keyword, country: "", language: "en-US", startDate: iso(start), endDate: iso(end), apikey: apiKey });
  const body = await fetchJson(`https://ssl.bing.com/webmaster/api.svc/json/GetKeyword?${params}`, `Bing ${keyword}`);
  if (body?.ErrorCode) return null;
  const broad = body?.d?.BroadImpressions;
  const exact = body?.d?.Impressions;
  if (!Number.isFinite(broad) && !Number.isFinite(exact)) return null;
  return { broad: Number.isFinite(broad) ? broad : null, exactLike: Number.isFinite(exact) ? exact : null };
}

const units = [];
for (const group of groups) {
  for (const language of ["ru", "en"]) {
    for (const seed of expandSeeds(group.seeds[language], language)) units.push({ group, language, seed });
  }
}
const limitedUnits = maxSeeds > 0 ? units.slice(0, maxSeeds) : units;
if (dryRun) {
  console.log(JSON.stringify({ groups: groups.map((group) => group.name), requests: limitedUnits.length, alphabet: useAlphabet, modifiers: useModifiers, bing: useBing, output: OUT_PATH }, null, 2));
  process.exit(0);
}

const byKey = new Map();
for (const [index, unit] of limitedUnits.entries()) {
  const found = await suggestions(unit.seed, unit.language);
  for (const raw of found) {
    const keyword = normalize(raw);
    if (keyword.split(" ").length < 2 || globalReject.test(keyword)) continue;
    if (!unit.group.includeTerms.some((term) => keyword.includes(normalize(term)))) continue;
    const key = `${unit.language}:${keyword}`;
    if (!byKey.has(key)) byKey.set(key, { keyword, language: unit.language, source: "suggest", seed: unit.seed, seedGroup: unit.group.name, bing: null });
  }
  if ((index + 1) % 20 === 0) console.log(`suggest: ${index + 1}/${limitedUnits.length}`);
  await sleep(180);
}

const rows = [...byKey.values()].sort((a, b) => a.language.localeCompare(b.language) || a.seedGroup.localeCompare(b.seedGroup) || a.keyword.localeCompare(b.keyword));
if (useBing) {
  const enRows = rows.filter((row) => row.language === "en");
  for (const [index, row] of enRows.entries()) {
    row.bing = await bingVolume(row.keyword);
    if ((index + 1) % 20 === 0) console.log(`bing: ${index + 1}/${enRows.length}`);
    await sleep(180);
  }
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_PATH, JSON.stringify({ collectedAt: new Date().toISOString(), groups: groups.map((group) => group.name), requestCount: limitedUnits.length, keywords: rows }, null, 2) + "\n", "utf8");
console.log(`collected ${rows.length} unique suggestions -> ${OUT_PATH}`);
