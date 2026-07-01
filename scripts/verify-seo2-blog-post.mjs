// SEO2 blog source/asset gate.
// Usage: node scripts/verify-seo2-blog-post.mjs <slug> [<slug>...]
//
// This intentionally checks the source layer before build. npm run build catches
// route/schema mechanics, but it does not know whether a SEO2 article has the
// required localized inline image set and course CTA layer.

import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error("✗ usage: node scripts/verify-seo2-blog-post.mjs <slug> [<slug>...]");
  process.exit(1);
}

let failureCount = 0;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
  failureCount += 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function allMatches(text, regex) {
  return Array.from(text.matchAll(regex));
}

function sectionForLocale(source, locale) {
  const marker = locale === "ru" ? "const ru: BlogPostLocale = {" : "const en: BlogPostLocale = {";
  const start = source.indexOf(marker);
  if (start < 0) return "";
  if (locale === "ru") {
    const enStart = source.indexOf("const en: BlogPostLocale = {", start);
    return enStart > start ? source.slice(start, enStart) : source.slice(start);
  }
  return source.slice(start);
}

function captureString(section, field) {
  const match = section.match(new RegExp(`${field}:\\s*"([^"]+)"`));
  return match?.[1] ?? "";
}

async function imageInfo(path) {
  const meta = await sharp(path).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

async function verifyImageFile(path, label, minWidth = 1200, minHeight = 675) {
  if (!existsSync(path)) {
    fail(`${label}: missing file ${path}`);
    return;
  }
  const { width, height } = await imageInfo(path);
  if (width < minWidth || height < minHeight) {
    fail(`${label}: expected at least ${minWidth}x${minHeight}, got ${width}x${height}`);
    return;
  }
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) > 0.03) {
    fail(`${label}: expected ~16:9 image, got ${width}x${height}`);
    return;
  }
  pass(`${label}: ${width}x${height}`);
}

async function verifySlug(slug) {
  console.log(`\n=== SEO2 source gate: ${slug} ===`);
  const sourcePath = resolve(ROOT, "src", "content", "blog", `${slug}.ts`);
  const source = existsSync(sourcePath) ? readFileSync(sourcePath, "utf8") : "";
  if (!source) {
    fail(`${slug}: missing source file ${sourcePath}`);
    return;
  }

  const coverPath = resolve(ROOT, "public", "blog", slug, "cover.jpg");
  await verifyImageFile(coverPath, `${slug} cover`, 1600, 900);

  for (const locale of ["ru", "en"]) {
    const section = sectionForLocale(source, locale);
    if (!section) {
      fail(`${slug} ${locale}: missing BlogPostLocale block`);
      continue;
    }

    const title = captureString(section, "title");
    const excerpt = captureString(section, "excerpt");
    const description = captureString(section, "description");
    const intro = section.match(/intro:\s*"([\s\S]*?)",\s*steps:/)?.[1]?.replace(/\\n/g, " ") ?? "";
    const imageRefs = allMatches(section, new RegExp(`imageSrc:\\s*"(/blog/${slug}/${locale}/[^"]+\\.jpg)"`, "g")).map((m) => m[1]);
    const promoCount = allMatches(section, /promoBanner:\s*{/g).length;
    const courseHrefCount = allMatches(section, new RegExp(`href:\\s*COURSE_URL|href:\\s*"${COURSE_URL.replace(/\//g, "\\/")}"`, "g")).length;

    if (title.length < 20 || title.length > 70) fail(`${slug} ${locale}: title length ${title.length}, expected 20..70`);
    else pass(`${slug} ${locale}: title length ${title.length}`);

    if (excerpt.length < 140 || excerpt.length > 180) fail(`${slug} ${locale}: excerpt length ${excerpt.length}, expected 140..180`);
    else pass(`${slug} ${locale}: excerpt length ${excerpt.length}`);

    if (description.length < 145 || description.length > 165) fail(`${slug} ${locale}: description length ${description.length}, expected 145..165`);
    else pass(`${slug} ${locale}: description length ${description.length}`);

    const introWords = intro.trim().split(/\s+/).filter(Boolean).length;
    if (introWords < 40 || introWords > 60) fail(`${slug} ${locale}: intro ${introWords} words, expected 40..60`);
    else pass(`${slug} ${locale}: intro ${introWords} words`);

    if (imageRefs.length < 4) fail(`${slug} ${locale}: expected at least 4 inline imageSrc refs, got ${imageRefs.length}`);
    else pass(`${slug} ${locale}: ${imageRefs.length} inline image refs`);

    const localeDir = resolve(ROOT, "public", "blog", slug, locale);
    if (!existsSync(localeDir)) {
      fail(`${slug} ${locale}: missing image directory ${localeDir}`);
    } else {
      const files = (await readdir(localeDir)).filter((f) => /\.(jpe?g|webp|png)$/i.test(f));
      if (files.length < 4) fail(`${slug} ${locale}: expected at least 4 generated image files, got ${files.length}`);
      else pass(`${slug} ${locale}: ${files.length} generated image files`);
    }

    for (const imageRef of imageRefs) {
      await verifyImageFile(resolve(ROOT, "public", imageRef.replace(/^\//, "")), `${slug} ${locale} ${imageRef}`);
    }

    if (promoCount < 1) fail(`${slug} ${locale}: expected at least one course promoBanner`);
    else pass(`${slug} ${locale}: ${promoCount} promoBanner blocks`);

    if (courseHrefCount < promoCount) fail(`${slug} ${locale}: promoBanner href must point to ${COURSE_URL}`);
    else pass(`${slug} ${locale}: course CTA hrefs valid`);
  }
}

for (const slug of slugs) {
  await verifySlug(slug);
}

if (failureCount > 0) {
  console.error(`\nSEO2 gate failed: ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("\nSEO2 gate passed.");
