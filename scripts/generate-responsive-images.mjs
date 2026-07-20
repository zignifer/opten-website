import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const OUTPUT_DIR = resolve(PUBLIC_DIR, "generated", "responsive");
const CACHE_VERSION = 2;
const DEFAULT_CACHE_DIR = resolve(ROOT, "node_modules", ".cache", "opten-responsive-images", `v${CACHE_VERSION}`);
const CACHE_DIR = process.env.RESPONSIVE_IMAGE_CACHE_DIR
  ? resolve(ROOT, process.env.RESPONSIVE_IMAGE_CACHE_DIR)
  : DEFAULT_CACHE_DIR;
const CACHE_VARIANTS_DIR = resolve(CACHE_DIR, "responsive");
const CACHE_MANIFEST_PATH = resolve(CACHE_DIR, "manifest.json");
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

const TARGET_DIRS = [
  resolve(PUBLIC_DIR, "blog"),
  resolve(PUBLIC_DIR, "assets", "learn"),
  resolve(PUBLIC_DIR, "assets", "space", "learn-v2"),
];
const FORCE = process.argv.includes("--force") || process.argv.includes("--clean");
const CONCURRENCY = Number(process.env.RESPONSIVE_IMAGE_CONCURRENCY || 6);
const CACHE_ENABLED = process.env.RESPONSIVE_IMAGE_CACHE !== "0" && !process.argv.includes("--no-cache");

const ENCODERS = {
  avif: { quality: 50, effort: 4 },
  webp: { quality: 76, effort: 4 },
};

function toPosixPath(path) {
  return path.split(sep).join("/");
}

function widthsFor(relativePath) {
  const path = toPosixPath(relativePath);
  const file = path.split("/").pop() ?? "";

  if (path.startsWith("blog/")) {
    return file === "cover.jpg" || file === "cover.png" || file === "article-hero.jpg"
      ? [480, 800, 1200, 1600]
      : [480, 800];
  }

  if (path.includes("/author-") || file === "title-line.png") {
    return [64, 96, 192, 320, 480];
  }

  return [360, 480, 720, 800, 960, 1200];
}

async function collectImages(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectImages(fullPath));
      continue;
    }
    if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function isFresh(outputPath, sourceMtimeMs) {
  if (FORCE) return false;
  try {
    const outputStat = await stat(outputPath);
    return outputStat.mtimeMs >= sourceMtimeMs;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function readCacheManifest() {
  if (!CACHE_ENABLED || FORCE) return {};
  try {
    const raw = await readFile(CACHE_MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(raw);
    if (manifest?.version !== CACHE_VERSION || typeof manifest?.entries !== "object") {
      return {};
    }
    return manifest.entries;
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    console.warn(`responsive image cache ignored: ${error.message}`);
    return {};
  }
}

async function writeCacheManifest(entries) {
  if (!CACHE_ENABLED) return;
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(
    CACHE_MANIFEST_PATH,
    `${JSON.stringify({ version: CACHE_VERSION, entries }, null, 2)}\n`,
    "utf8",
  );
}

async function hashFile(path) {
  const buffer = await readFile(path);
  return createHash("sha256").update(buffer).digest("hex");
}

function cacheSignature({ sourceHash, width, format }) {
  const encoder = ENCODERS[format];
  return [
    `v${CACHE_VERSION}`,
    sourceHash,
    width,
    format,
    `q${encoder.quality}`,
    `e${encoder.effort}`,
  ].join(":");
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function restoreCachedVariant(cachePath, outputPath) {
  try {
    await mkdir(dirname(outputPath), { recursive: true });
    await copyFile(cachePath, outputPath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function storeCachedVariant(outputPath, cachePath) {
  if (!CACHE_ENABLED) return;
  await mkdir(dirname(cachePath), { recursive: true });
  await copyFile(outputPath, cachePath);
}

async function generateVariant({
  sourcePath,
  sourceMtimeMs,
  sourceHash,
  outputStem,
  width,
  format,
  cacheEntries,
  nextCacheEntries,
}) {
  const outputPath = `${outputStem}-${width}.${format}`;
  const outputRelativePath = toPosixPath(relative(OUTPUT_DIR, outputPath));
  const cachePath = resolve(CACHE_VARIANTS_DIR, ...outputRelativePath.split("/"));
  const signature = cacheSignature({ sourceHash, width, format });
  const cacheEntry = cacheEntries[outputRelativePath];
  const nextCacheEntry = {
    signature,
    sourceHash,
    width,
    format,
    encoder: ENCODERS[format],
  };

  if (!FORCE && cacheEntry?.signature === signature && CACHE_ENABLED) {
    nextCacheEntries[outputRelativePath] = nextCacheEntry;
    if (await fileExists(outputPath)) return "fresh";
    if (await restoreCachedVariant(cachePath, outputPath)) return "restored";
  }

  if (await isFresh(outputPath, sourceMtimeMs)) {
    await storeCachedVariant(outputPath, cachePath);
    nextCacheEntries[outputRelativePath] = nextCacheEntry;
    return "fresh";
  }

  await mkdir(dirname(outputPath), { recursive: true });

  const image = sharp(sourcePath, { animated: false })
    .rotate()
    .resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await image.avif(ENCODERS.avif).toFile(outputPath);
  } else {
    await image.webp(ENCODERS.webp).toFile(outputPath);
  }

  await storeCachedVariant(outputPath, cachePath);
  nextCacheEntries[outputRelativePath] = nextCacheEntry;
  return "generated";
}

if (process.argv.includes("--clean")) {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
}
if (process.argv.includes("--clean-cache")) {
  await rm(CACHE_DIR, { recursive: true, force: true });
}

const cacheEntries = await readCacheManifest();
const nextCacheEntries = {};
const images = (await Promise.all(TARGET_DIRS.map(collectImages))).flat();
const tasks = [];

for (const sourcePath of images) {
  const sourceStat = await stat(sourcePath);
  const sourceHash = await hashFile(sourcePath);
  const relativePath = relative(PUBLIC_DIR, sourcePath);
  const ext = extname(relativePath);
  const withoutExt = relativePath.slice(0, -ext.length);
  const outputStem = resolve(OUTPUT_DIR, ...toPosixPath(withoutExt).split("/"));

  for (const width of widthsFor(relativePath)) {
    tasks.push(() => generateVariant({
      sourcePath,
      sourceMtimeMs: sourceStat.mtimeMs,
      sourceHash,
      outputStem,
      width,
      format: "avif",
      cacheEntries,
      nextCacheEntries,
    }));
    tasks.push(() => generateVariant({
      sourcePath,
      sourceMtimeMs: sourceStat.mtimeMs,
      sourceHash,
      outputStem,
      width,
      format: "webp",
      cacheEntries,
      nextCacheEntries,
    }));
  }
}

let generated = 0;
let skipped = 0;
let restored = 0;
let nextTask = 0;

async function worker() {
  while (nextTask < tasks.length) {
    const task = tasks[nextTask];
    nextTask += 1;
    const result = await task();
    if (result === "generated") {
      generated += 1;
    } else if (result === "restored") {
      restored += 1;
    } else {
      skipped += 1;
    }
  }
}

await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));
await writeCacheManifest(nextCacheEntries);

console.log(`✓ responsive images: ${generated} generated, ${restored} restored, ${skipped} fresh, ${images.length} sources`);
