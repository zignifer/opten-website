// SEO2 blog source/asset gate.
// Usage: node scripts/verify-seo2-blog-post.mjs <slug> [<slug>...]
//
// This intentionally checks the source layer before build. npm run build catches
// route/schema mechanics, but it does not know whether a SEO2 article has the
// required localized inline image set and intent-matched promo CTA layer.

import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";
const TOPIC_REGISTRY = resolve(ROOT, "seo2", "topic-registry.json");
const VISUAL_PLAN_REQUIRED_FROM = "2026-07-25";
const HUMAN_PRESENCE_REQUIRED_FROM = "2026-08-25";
const HUMAN_PRESENCE_TYPES = new Set([
  "none",
  "hands-only",
  "human-detail",
  "single-person",
  "interaction",
]);
const AVOIDABLE_ENGLISH_IN_RU =
  /\b(prompt|prompts|brief|workflow|preflight|production prompt|visual brief|visual direction|deck|draft|review)\b/gi;

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

function expectedPromoDestination(slug) {
  if (!existsSync(TOPIC_REGISTRY)) return COURSE_URL;
  const registry = JSON.parse(readFileSync(TOPIC_REGISTRY, "utf8"));
  return registry.topics?.find((topic) => topic.slug === slug)?.primaryDestination ?? COURSE_URL;
}

function resolvedHrefValues(section, source) {
  return allMatches(section, /href:\s*(?:"([^"]+)"|([A-Z][A-Z0-9_]*))/g).map((match) => {
    if (match[1]) return match[1];
    const constantName = match[2];
    return source.match(new RegExp(`const\\s+${constantName}\\s*=\\s*"([^"]+)"`))?.[1] ?? "";
  });
}

function visibleStringLiterals(section) {
  return allMatches(section, /"((?:\\.|[^"\\])*)"/g)
    .map((match) => match[1])
    .filter((value) => !/^\/|^[a-z0-9][a-z0-9/_-]*(?:\.jpg)?$/i.test(value));
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
  const promoDestination = expectedPromoDestination(slug);
  if (!source) {
    fail(`${slug}: missing source file ${sourcePath}`);
    return;
  }

  const publishedAt = source.match(/const PUBLISHED = "(\d{4}-\d{2}-\d{2})"/)?.[1] ?? "";
  if (publishedAt >= VISUAL_PLAN_REQUIRED_FROM) {
    const visualPlanPath = resolve(ROOT, "seo2", "visual-plans", `${slug}.md`);
    if (!existsSync(visualPlanPath)) {
      fail(`${slug}: missing visual production plan ${visualPlanPath}`);
    } else {
      const visualPlan = readFileSync(visualPlanPath, "utf8");
      const frameCount = allMatches(visualPlan, /^## Frame \d+\b/gm).length;
      const visualProofCount = allMatches(visualPlan, /^- Visual proof:\s*\S.+$/gmi).length;
      const continuityCount = allMatches(visualPlan, /^- Style continuity:\s*\S.+$/gmi).length;
      const compositions = allMatches(visualPlan, /^- Composition:\s*(\S.+)$/gmi).map((match) => match[1].trim().toLowerCase());
      const textModes = allMatches(visualPlan, /^- Text mode:\s*(headline-only|contrast-pair|sequence|annotated-explainer)\s*$/gmi).map((match) => match[1].toLowerCase());
      const uniqueCompositions = new Set(compositions);
      const uniqueTextModes = new Set(textModes);
      const cardGridFrames = Number(visualPlan.match(/^- Card\/grid frames:\s*(\d+)\s*$/mi)?.[1] ?? Number.NaN);
      const flatTypography = /^- Typography treatment:\s*flat\b.*$/mi.test(visualPlan);

      if (frameCount < 4) fail(`${slug}: visual plan needs at least 4 Frame sections, got ${frameCount}`);
      else pass(`${slug}: visual plan has ${frameCount} frames`);

      if (visualProofCount < frameCount) fail(`${slug}: every frame needs a Visual proof`);
      else pass(`${slug}: visual proofs declared`);

      if (continuityCount < frameCount) fail(`${slug}: every frame needs Style continuity`);
      else pass(`${slug}: style continuity declared per frame`);

      if (compositions.length < frameCount || uniqueCompositions.size < 3) {
        fail(`${slug}: visual plan needs at least 3 distinct composition archetypes across ${frameCount} frames`);
      } else {
        pass(`${slug}: ${uniqueCompositions.size} distinct composition archetypes`);
      }

      if (textModes.length < frameCount || uniqueTextModes.size < 2) {
        fail(`${slug}: visual plan needs at least 2 text modes across ${frameCount} frames`);
      } else {
        pass(`${slug}: ${uniqueTextModes.size} text modes`);
      }

      if (!Number.isFinite(cardGridFrames) || cardGridFrames > 1) {
        fail(`${slug}: Card/grid frames must be declared and be 0 or 1`);
      } else {
        pass(`${slug}: card/grid frame count ${cardGridFrames}`);
      }

      if (!flatTypography) fail(`${slug}: visual plan must declare flat Typography treatment`);
      else pass(`${slug}: flat typography treatment declared`);

      if (publishedAt >= HUMAN_PRESENCE_REQUIRED_FROM) {
        const declaredHumanizedFrames = Number(
          visualPlan.match(/^- Humanized frames:\s*(\d+)\s*$/mi)?.[1] ?? Number.NaN,
        );
        const humanHeavyException =
          visualPlan.match(/^- Human-heavy exception:\s*(\S.+)$/mi)?.[1]?.trim() ?? "";
        const frameSections = visualPlan
          .split(/^## Frame \d+\b[^\r\n]*$/gmi)
          .slice(1, frameCount + 1);
        const frameHumanPlans = frameSections.map((section, index) => ({
          frame: index + 1,
          presence: section.match(/^- Human presence:\s*(\S.*?)\s*$/mi)?.[1]?.toLowerCase() ?? "",
          purpose: section.match(/^- Human purpose:\s*(\S.+)$/mi)?.[1]?.trim() ?? "",
        }));
        let humanPlanValid = true;

        for (const framePlan of frameHumanPlans) {
          if (!HUMAN_PRESENCE_TYPES.has(framePlan.presence)) {
            fail(
              `${slug}: Frame ${framePlan.frame} needs Human presence: ${Array.from(HUMAN_PRESENCE_TYPES).join(" | ")}`,
            );
            humanPlanValid = false;
          } else if (framePlan.presence !== "none" && !framePlan.purpose) {
            fail(`${slug}: Frame ${framePlan.frame} needs Human purpose for ${framePlan.presence}`);
            humanPlanValid = false;
          }
        }

        const validHumanPlans = frameHumanPlans.filter((framePlan) =>
          HUMAN_PRESENCE_TYPES.has(framePlan.presence),
        );
        if (validHumanPlans.length === frameCount) {
          const actualHumanizedFrames = validHumanPlans.filter(
            (framePlan) => framePlan.presence !== "none",
          ).length;

          if (!Number.isInteger(declaredHumanizedFrames)) {
            fail(`${slug}: visual plan must declare Humanized frames: 1 by default`);
            humanPlanValid = false;
          } else if (declaredHumanizedFrames !== actualHumanizedFrames) {
            fail(
              `${slug}: Humanized frames declares ${declaredHumanizedFrames}, but ${actualHumanizedFrames} Frame sections are humanized`,
            );
            humanPlanValid = false;
          }

          if (actualHumanizedFrames < 1) {
            fail(`${slug}: at least one inline frame must be deliberately humanized`);
            humanPlanValid = false;
          } else if (actualHumanizedFrames >= frameCount) {
            fail(`${slug}: at least one inline frame must remain human-free`);
            humanPlanValid = false;
          } else if (actualHumanizedFrames > 2) {
            fail(`${slug}: at most two inline frames may be humanized`);
            humanPlanValid = false;
          } else if (actualHumanizedFrames === 2 && !humanHeavyException) {
            fail(`${slug}: two humanized frames require a Human-heavy exception`);
            humanPlanValid = false;
          }

          if (humanPlanValid) {
            pass(`${slug}: ${actualHumanizedFrames} of ${frameCount} inline frames deliberately humanized`);
          }
        }
      }
    }
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
    const destinationHrefCount = resolvedHrefValues(section, source).filter((href) => href === promoDestination).length;

    if (locale === "ru") {
      const avoidableTerms = new Set(
        visibleStringLiterals(section).flatMap((value) => value.match(AVOIDABLE_ENGLISH_IN_RU) ?? []).map((value) => value.toLowerCase()),
      );
      if (avoidableTerms.size > 0) {
        fail(`${slug} ru: translate avoidable English terms: ${Array.from(avoidableTerms).join(", ")}`);
      } else {
        pass(`${slug} ru: no avoidable English terms`);
      }
    }

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

    if (promoCount < 1) fail(`${slug} ${locale}: expected at least one promoBanner`);
    else pass(`${slug} ${locale}: ${promoCount} promoBanner blocks`);

    if (destinationHrefCount < promoCount) fail(`${slug} ${locale}: promoBanner href must point to ${promoDestination}`);
    else pass(`${slug} ${locale}: promo CTA hrefs valid`);
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
