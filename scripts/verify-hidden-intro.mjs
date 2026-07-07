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
assert.match(hiddenIntro, /HIDDEN_INTRO_WEBSITE_SLOT_ENABLED\s*=\s*false/, "Hidden intro synthetic menu slot must stay disabled because lesson 0 is now a real course lesson");
assert.match(hiddenIntro, /HIDDEN_INTRO_VIDEO_ENABLED\s*=\s*true/, "Hidden intro video must stay enabled now that lesson 0 exists");
assert.match(hiddenIntro, /Разблокировать в Telegram/, "Hidden intro must keep the Telegram access CTA copy");

assert.match(privateCourse, /slug:\s*HIDDEN_INTRO_SLUG/, "Hidden intro must be present in privateCourseLessonConfigs");
assert.match(privateCourse, /PRIVATE_COURSE_HIDDEN_INTRO_KINESCOPE_VIDEO_ID/, "Hidden intro must use the dedicated Kinescope video id constant");
assert.match(kinescopeCourse, /hidden-intro/, "Hidden intro must be present in the Kinescope server whitelist");
assert.doesNotMatch(seoRoutes, /hidden-intro/, "Hidden intro must not be added to prerendered SEO routes");
assert.doesNotMatch(learnSlugs, /hidden-intro/, "Hidden intro must not be added to Learn slug siblings");
assert.doesNotMatch(sitemap, /hidden-intro/, "Hidden intro must not be added to sitemap generation");
assert.doesNotMatch(llms, /hidden-intro/, "Hidden intro must not be added to llms generation");

assert.match(privateCoursePage, /lessonSlug === HIDDEN_INTRO_SLUG/, "PrivateCoursePage must special-case hidden intro route");
assert.match(privateCoursePage, /localStorage\.setItem\(HIDDEN_INTRO_UNLOCK_STORAGE_KEY,\s*"1"\)/, "Hidden intro route must store the local browser unlock hint");
assert.match(privateCoursePage, /hiddenIntroRouteUnlocked=\{isHiddenIntro\}/, "Hidden intro route must unlock the current lesson immediately");
assert.match(components, /HIDDEN_INTRO_WEBSITE_SLOT_ENABLED && collection\.id === AI_CONTENT_MARKETING_COURSE_SLUG/, "Course outline hidden-intro slot must stay behind the feature flag");
assert.match(components, /hiddenIntroUnlocked:\s*canUseHiddenIntroUnlock/, "Kinescope token request must pass the browser unlock only for hidden intro");
assert.match(components, /href=\{HIDDEN_INTRO_TELEGRAM_URL\}/, "Locked hidden intro outline row must send guests to Telegram");

assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Hidden intro route must be covered by the noindex SPA course rewrite");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Hidden intro route must be covered by noindex headers");

console.log("Hidden intro guardrails passed.");
