import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = resolve(ROOT, "seo2", "topic-registry.json");
const LEGACY_BRIEFS_DIR = resolve(ROOT, "seo2", "briefs");
const BLOG_DIR = resolve(ROOT, "src", "content", "blog");
const BLOG_INDEX = resolve(BLOG_DIR, "index.ts");
const STATUSES = new Set(["queued", "deferred", "published", "parked", "rejected"]);
const INTENTS = new Set(["transactional", "problem", "comparison", "guide", "info"]);
const BUYER_STAGES = new Set(["awareness", "consideration", "decision"]);
const SOURCES = new Set(["suggest", "wordstat", "bing", "gsc", "yandex-webmaster", "manual", "legacy-import"]);
const PRIMARY_DESTINATIONS = new Set([
  "/",
  "/prompt-library",
  "/learn",
  "/learn/courses/ai-content-marketing-2026",
]);

let failures = 0;
function fail(message) {
  failures += 1;
  console.error(`✗ ${message}`);
}

function publishedSlugs() {
  const slugs = new Set();
  if (existsSync(BLOG_INDEX)) {
    for (const match of readFileSync(BLOG_INDEX, "utf8").matchAll(/"([a-z0-9-]+)"\s*:/g)) slugs.add(match[1]);
  }
  if (existsSync(BLOG_DIR)) {
    for (const name of readdirSync(BLOG_DIR)) {
      if (/^[a-z0-9-]+\.ts$/.test(name) && !["index.ts", "types.ts"].includes(name)) slugs.add(name.replace(/\.ts$/, ""));
    }
  }
  return slugs;
}

if (!existsSync(REGISTRY_PATH)) {
  fail(`missing ${REGISTRY_PATH}`);
  process.exit(1);
}
if (existsSync(LEGACY_BRIEFS_DIR)) fail("legacy seo2/briefs directory must not return; use topic-registry.json");

let registry;
try {
  registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
  process.exit(1);
}

if (registry.schemaVersion !== 1) fail("schemaVersion must equal 1");
if (!/^\d{4}-\d{2}-\d{2}$/.test(registry.updatedAt ?? "")) fail("updatedAt must be YYYY-MM-DD");
if (!Array.isArray(registry.research?.seedGroups) || registry.research.seedGroups.length === 0) fail("research.seedGroups must not be empty");
if (!Array.isArray(registry.topics) || registry.topics.length === 0) fail("topics must not be empty");

const livePublished = publishedSlugs();
const slugs = new Set();
const orders = new Set();
const counts = {};

for (const [index, topic] of (registry.topics ?? []).entries()) {
  const label = topic.slug || `topics[${index}]`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug ?? "")) fail(`${label}: invalid slug`);
  if (slugs.has(topic.slug)) fail(`${label}: duplicate slug`);
  slugs.add(topic.slug);

  if (!Number.isInteger(topic.queueOrder) || topic.queueOrder <= 0) fail(`${label}: queueOrder must be a positive integer`);
  if (orders.has(topic.queueOrder)) fail(`${label}: duplicate queueOrder ${topic.queueOrder}`);
  orders.add(topic.queueOrder);

  if (!STATUSES.has(topic.status)) fail(`${label}: unsupported status ${topic.status}`);
  if (!INTENTS.has(topic.intentType)) fail(`${label}: unsupported intentType ${topic.intentType}`);
  if (topic.buyerStage !== null && !BUYER_STAGES.has(topic.buyerStage)) fail(`${label}: unsupported buyerStage ${topic.buyerStage}`);
  if (["queued", "deferred"].includes(topic.status) && !PRIMARY_DESTINATIONS.has(topic.primaryDestination)) {
    fail(`${label}: active topic needs a supported primaryDestination`);
  }
  if (typeof topic.titleHint !== "string" || topic.titleHint.trim().length < 3) fail(`${label}: titleHint is required`);
  if (!/^BL-[a-z0-9-]+$/i.test(topic.clusterId ?? "")) fail(`${label}: invalid clusterId`);

  if (!Array.isArray(topic.keywords) || topic.keywords.length === 0) {
    fail(`${label}: keywords must not be empty`);
  } else {
    const localKeywords = new Set();
    let primaryCount = 0;
    const languages = new Set();
    for (const keyword of topic.keywords) {
      const normalized = String(keyword.phrase ?? "").normalize("NFKC").trim().toLowerCase();
      const keywordKey = `${keyword.language}:${normalized}`;
      if (!normalized) fail(`${label}: empty keyword phrase`);
      if (!["ru", "en"].includes(keyword.language)) fail(`${label}: keyword language must be ru or en`);
      if (!["primary", "secondary"].includes(keyword.role)) fail(`${label}: keyword role must be primary or secondary`);
      if (localKeywords.has(keywordKey)) fail(`${label}: duplicate keyword ${keywordKey}`);
      localKeywords.add(keywordKey);
      languages.add(keyword.language);
      if (keyword.role === "primary") primaryCount += 1;
      for (const field of ["broadVolume", "exactLikeVolume"]) {
        if (keyword[field] !== null && (!Number.isInteger(keyword[field]) || keyword[field] < 0)) fail(`${label}: ${field} must be a non-negative integer or null`);
      }
    }
    if (primaryCount === 0) fail(`${label}: at least one primary keyword is required`);
    if (["queued", "deferred"].includes(topic.status) && (!languages.has("ru") || !languages.has("en"))) fail(`${label}: active topic needs RU and EN keyword coverage`);
  }

  if (!Array.isArray(topic.evidence?.sources) || topic.evidence.sources.length === 0) fail(`${label}: evidence.sources is required`);
  for (const source of topic.evidence?.sources ?? []) if (!SOURCES.has(source)) fail(`${label}: unsupported evidence source ${source}`);

  if (topic.status === "published") {
    if (!livePublished.has(topic.slug)) fail(`${label}: marked published but missing from src/content/blog`);
    if (topic.targetUrl !== `/blog/${topic.slug}`) fail(`${label}: published targetUrl must be /blog/${topic.slug}`);
  }
  if (["queued", "deferred"].includes(topic.status) && livePublished.has(topic.slug)) fail(`${label}: exists in blog but is still ${topic.status}`);
  counts[topic.status] = (counts[topic.status] ?? 0) + 1;
}

if (failures > 0) {
  console.error(`\nSEO topic registry failed: ${failures} issue(s).`);
  process.exit(1);
}

console.log(`SEO topic registry passed: ${registry.topics.length} topics (${Object.entries(counts).map(([status, count]) => `${status}=${count}`).join(", ")}).`);
