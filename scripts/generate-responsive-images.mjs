import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const OUTPUT_DIR = resolve(PUBLIC_DIR, "generated", "responsive");
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

const TARGET_DIRS = [
  resolve(PUBLIC_DIR, "blog"),
  resolve(PUBLIC_DIR, "assets", "learn"),
  resolve(PUBLIC_DIR, "assets", "space", "learn-v2"),
];
const FORCE = process.argv.includes("--force") || process.argv.includes("--clean");
const CONCURRENCY = Number(process.env.RESPONSIVE_IMAGE_CONCURRENCY || 6);

function toPosixPath(path) {
  return path.split(sep).join("/");
}

function widthsFor(relativePath) {
  const path = toPosixPath(relativePath);
  const file = path.split("/").pop() ?? "";

  if (path.startsWith("blog/")) {
    return file === "cover.jpg" || file === "cover.png"
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

async function generateVariant(sourcePath, sourceMtimeMs, outputStem, width, format) {
  const outputPath = `${outputStem}-${width}.${format}`;
  if (await isFresh(outputPath, sourceMtimeMs)) return false;

  await mkdir(dirname(outputPath), { recursive: true });

  const image = sharp(sourcePath, { animated: false })
    .rotate()
    .resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await image.avif({ quality: 50, effort: 4 }).toFile(outputPath);
    return true;
  }

  await image.webp({ quality: 76, effort: 4 }).toFile(outputPath);
  return true;
}

if (process.argv.includes("--clean")) {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
}

const images = (await Promise.all(TARGET_DIRS.map(collectImages))).flat();
const tasks = [];

for (const sourcePath of images) {
  const sourceStat = await stat(sourcePath);
  const relativePath = relative(PUBLIC_DIR, sourcePath);
  const ext = extname(relativePath);
  const withoutExt = relativePath.slice(0, -ext.length);
  const outputStem = resolve(OUTPUT_DIR, ...toPosixPath(withoutExt).split("/"));

  for (const width of widthsFor(relativePath)) {
    tasks.push(() => generateVariant(sourcePath, sourceStat.mtimeMs, outputStem, width, "avif"));
    tasks.push(() => generateVariant(sourcePath, sourceStat.mtimeMs, outputStem, width, "webp"));
  }
}

let generated = 0;
let skipped = 0;
let nextTask = 0;

async function worker() {
  while (nextTask < tasks.length) {
    const task = tasks[nextTask];
    nextTask += 1;
    if (await task()) {
      generated += 1;
    } else {
      skipped += 1;
    }
  }
}

await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

console.log(`✓ responsive images: ${generated} generated, ${skipped} fresh, ${images.length} sources`);
