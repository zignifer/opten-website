import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

const requiredFiles = [
  "src/content/space/telegramCoursePreview.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "src/lib/courseAccess.ts",
  "api/kinescope-course-token.ts",
  "api/_shared/kinescopeCourse.ts",
  "api/_shared/optenServerAuth.ts",
  "src/content/space/privateCourse.ts",
  "scripts/seo-routes.ts",
  "src/content/space/learnSlugs.ts",
  "scripts/sitemap.mjs",
  "scripts/llms.mjs",
  "vercel.json",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing Telegram course preview guardrail input: ${file}`);
}

assert.equal(existsSync(join(root, "src/content/space/hiddenIntro.ts")), false, "Removed hidden-intro content module must not return");

const preview = read("src/content/space/telegramCoursePreview.ts");
const privateCourse = read("src/content/space/privateCourse.ts");
const privateCoursePage = read("src/app/pages/space/PrivateCoursePage.tsx");
const components = read("src/app/components/space/learn/LearnComponents.tsx");
const courseAccess = read("src/lib/courseAccess.ts");
const tokenApi = read("api/kinescope-course-token.ts");
const serverCourse = read("api/_shared/kinescopeCourse.ts");
const serverAuth = read("api/_shared/optenServerAuth.ts");
const seoRoutes = read("scripts/seo-routes.ts");
const learnSlugs = read("src/content/space/learnSlugs.ts");
const sitemap = read("scripts/sitemap.mjs");
const llms = read("scripts/llms.mjs");
const vercel = read("vercel.json");

assert.match(preview, /LEGACY_HIDDEN_INTRO_SLUG\s*=\s*"hidden-intro"/, "Legacy hidden route slug must stay redirectable");
assert.match(preview, /TELEGRAM_COURSE_PREVIEW_STORAGE_KEY\s*=\s*"opten_course_preview_claim_v1"/, "Preview must store the claim token, not a boolean unlock");
assert.match(preview, /TELEGRAM_COURSE_PREVIEW_BOT_URL\s*=\s*"https:\/\/t\.me\/opten_space_bot\?start=course_preview"/, "Preview discovery CTA must deep-link to the Telegram bot");
for (const slug of ["lesson-1-prompting", "lesson-2-ai-services", "lesson-3-logo-generation"]) {
  assert.match(preview, new RegExp(slug), `Client preview allowlist must include ${slug}`);
  assert.match(serverCourse, new RegExp(slug), `Server preview allowlist must include ${slug}`);
}

assert.doesNotMatch(privateCourse, /AI контент-завод|AI content factory|PRIVATE_COURSE_HIDDEN_INTRO/, "Lesson 0/content factory must be removed from course content");
assert.doesNotMatch(serverCourse, /a4722357-b131-491f-8ca0-cdd11d927630|lessonSlug:\s*"hidden-intro"/, "Removed lesson 0 must not be in the Kinescope whitelist");
assert.match(privateCoursePage, /isLegacyHiddenIntro[\s\S]*PRIVATE_COURSE_FIRST_LESSON_SLUG[\s\S]*location\.search/, "Legacy hidden URL must redirect to lesson 1 and preserve the claim query");
assert.match(privateCoursePage, /rememberTelegramCoursePreviewClaim/, "Course page must persist a claim token from the URL");
assert.match(courseAccess, /TELEGRAM_COURSE_PREVIEW_STORAGE_KEY/, "Course access helpers must use the new claim storage key");
assert.doesNotMatch(courseAccess, /opten_hidden_intro_opened_v1/, "Boolean hidden-intro storage must be removed");

assert.match(tokenApi, /telegramPreviewClaim/, "Kinescope token requests must accept the claim token");
assert.match(tokenApi, /hasTelegramCoursePreviewAccess/, "Kinescope token requests must validate preview claims server-side");
assert.match(tokenApi, /accessMode:\s*"course-entitlement"\s*\|\s*"telegram-course-preview"/, "Preview playback token must have a distinct access mode");
assert.doesNotMatch(tokenApi, /hiddenIntroUnlocked|BrowserUnlock/, "Kinescope access must not trust the removed browser boolean");
assert.match(serverAuth, /validate_only:\s*true/, "Server claim check must use the read-only validation mode");
const previewAccessValidator = serverAuth.match(/export async function hasTelegramCoursePreviewAccess[\s\S]*?\n\}/)?.[0] ?? "";
assert.doesNotMatch(previewAccessValidator, /expires_at|used_at/, "Preview playback validation must not expire with the checkout discount");

assert.match(components, /Генератор промптов Opten/, "Lesson UI must expose a separate Opten generator section");
assert.equal([...components.matchAll(/<OptenPromptGeneratorsSection/g)].length, 2, "Opten generators must render on both the course root and every lesson page");
assert.match(components, /<OptenPromptGeneratorsSection[\s\S]*?<LessonMaterials[\s\S]*?<LessonPrompts/, "Lesson generators must stay in the compact left-column flow before materials and prompts");
assert.match(components, /<OptenPromptGeneratorsSection[\s\S]*?<CourseIntroShowcase/, "Course-root generators must stay in the compact left-column flow before the intro showcase");
assert.match(components, /const hasAccess = courseAccess \|\| proAccess/, "Opten generators must open for either a course buyer or an active Pro user");
assert.match(components, /!loading\s*&&\s*!hasAccess[\s\S]*optenPromptGeneratorsDescription/, "Generator sales description must be hidden after access opens");
assert.match(components, /optenPromptGeneratorsLockedTitle[\s\S]*to="\/pay"/, "Locked generators must offer the compact Pro subscription action");
assert.doesNotMatch(components, /optenPromptGeneratorsCourseCta/, "The compact generator banner must not duplicate the course checkout CTA");
assert.match(components, /data-access-state=\{loading \? "loading" : hasAccess \? "open" : "locked"\}/, "Generator section must expose stable loading, open, and locked states");
assert.match(components, /telegramPreviewClaim:\s*telegramPreviewClaim\s*\|\|\s*undefined/, "Player must pass the claim token to the server");
assert.match(components, /telegramPreviewUnlockAvailable[\s\S]*TELEGRAM_COURSE_PREVIEW_BOT_URL/, "The first three locked lessons must offer the Telegram unlock CTA before a claim exists");
assert.match(components, /Бесплатно через Telegram/, "Course outline must advertise the Telegram preview on the first three lessons");
assert.match(components, /Разблокировать через Telegram/, "Locked preview lessons must show an explicit Telegram unlock action");
assert.match(components, /<LessonPrompts[\s\S]*?locked=\{!courseHasAccess\}/, "Private lesson prompts must remain buyer-only");

assert.doesNotMatch(seoRoutes, /hidden-intro/, "Legacy redirect must not be added to prerendered SEO routes");
assert.doesNotMatch(learnSlugs, /hidden-intro/, "Legacy redirect must not be added to Learn slug siblings");
assert.doesNotMatch(sitemap, /hidden-intro/, "Legacy redirect must not be added to sitemap generation");
assert.doesNotMatch(llms, /hidden-intro/, "Legacy redirect must not be added to llms generation");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Course preview routes must remain SPA routes");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Course preview routes must remain noindex");

console.log("Telegram course preview guardrails passed.");
