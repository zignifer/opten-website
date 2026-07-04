import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

const requiredFiles = [
  "src/content/space/hiddenIntro.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "api/_shared/kinescopeCourse.ts",
  "src/content/space/privateCourse.ts",
  "scripts/seo-routes.ts",
  "src/content/space/learnSlugs.ts",
  "scripts/sitemap.mjs",
  "scripts/llms.mjs",
  "vercel.json",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing hidden intro guardrail input: ${file}`);
}

const hiddenIntro = read("src/content/space/hiddenIntro.ts");
const privateCourse = read("src/content/space/privateCourse.ts");
const privateCoursePage = read("src/app/pages/space/PrivateCoursePage.tsx");
const components = read("src/app/components/space/learn/LearnComponents.tsx");
const kinescopeCourse = read("api/_shared/kinescopeCourse.ts");
const seoRoutes = read("scripts/seo-routes.ts");
const learnSlugs = read("src/content/space/learnSlugs.ts");
const sitemap = read("scripts/sitemap.mjs");
const llms = read("scripts/llms.mjs");
const vercel = read("vercel.json");

assert.match(hiddenIntro, /HIDDEN_INTRO_SLUG\s*=\s*"hidden-intro"/, "Hidden intro slug must stay stable");
assert.match(
  hiddenIntro,
  /HIDDEN_INTRO_ROUTE\s*=\s*"\/learn\/courses\/ai-content-marketing-2026\/hidden-intro"/,
  "Hidden intro route must stay under the noindex course namespace",
);
assert.match(
  hiddenIntro,
  /HIDDEN_INTRO_UNLOCK_STORAGE_KEY\s*=\s*"opten_hidden_intro_opened_v1"/,
  "Hidden intro localStorage key must stay stable",
);
assert.match(hiddenIntro, /HIDDEN_INTRO_WEBSITE_SLOT_ENABLED\s*=\s*false/, "Hidden intro menu slot must stay disabled while the video is missing");
assert.match(hiddenIntro, /HIDDEN_INTRO_VIDEO_ENABLED\s*=\s*false/, "Hidden intro video must stay disabled while the video is missing");
assert.match(hiddenIntro, /Получить доступ в Telegram/, "Hidden intro must keep the Telegram access CTA copy");

assert.doesNotMatch(privateCourse, /hidden-intro/, "Hidden intro must not be added to privateCourseLessonConfigs while disabled");
assert.doesNotMatch(kinescopeCourse, /hidden-intro/, "Hidden intro must not be added to the Kinescope server whitelist while disabled");
assert.doesNotMatch(seoRoutes, /hidden-intro/, "Hidden intro must not be added to prerendered SEO routes");
assert.doesNotMatch(learnSlugs, /hidden-intro/, "Hidden intro must not be added to Learn slug siblings");
assert.doesNotMatch(sitemap, /hidden-intro/, "Hidden intro must not be added to sitemap generation");
assert.doesNotMatch(llms, /hidden-intro/, "Hidden intro must not be added to llms generation");

assert.match(privateCoursePage, /lessonSlug === HIDDEN_INTRO_SLUG/, "PrivateCoursePage must special-case hidden intro route");
assert.match(privateCoursePage, /!HIDDEN_INTRO_VIDEO_ENABLED[\s\S]*<HiddenIntroPlaceholderLayout collection=\{collection\}/, "Hidden intro must render a placeholder while the video is disabled");
assert.match(components, /localStorage\.setItem\(HIDDEN_INTRO_UNLOCK_STORAGE_KEY,\s*"1"\)/, "Hidden intro placeholder must store the local browser unlock hint");
assert.match(components, /HIDDEN_INTRO_WEBSITE_SLOT_ENABLED && collection\.id === AI_CONTENT_MARKETING_COURSE_SLUG/, "Course outline hidden-intro slot must stay behind the feature flag");

assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Hidden intro route must be covered by the noindex SPA course rewrite");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Hidden intro route must be covered by noindex headers");

console.log("Hidden intro guardrails passed.");
