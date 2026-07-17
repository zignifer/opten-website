import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const requiredFiles = [
  "src/content/space/courseDiscountClaim.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "src/lib/courseAccess.ts",
  "api/kinescope-course-token.ts",
  "api/kinescope-course-auth.ts",
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
  assert.ok(existsSync(join(root, file)), `Missing paid-course guardrail input: ${file}`);
}

assert.equal(existsSync(join(root, "src/content/space/hiddenIntro.ts")), false, "Removed hidden-intro content module must not return");
assert.equal(existsSync(join(root, "src/content/space/telegramCoursePreview.ts")), false, "Telegram preview allowlist must stay removed");

const claim = read("src/content/space/courseDiscountClaim.ts");
const privateCourse = read("src/content/space/privateCourse.ts");
const privateCoursePage = read("src/app/pages/space/PrivateCoursePage.tsx");
const components = read("src/app/components/space/learn/LearnComponents.tsx");
const courseAccess = read("src/lib/courseAccess.ts");
const tokenApi = read("api/kinescope-course-token.ts");
const authApi = read("api/kinescope-course-auth.ts");
const serverCourse = read("api/_shared/kinescopeCourse.ts");
const serverAuth = read("api/_shared/optenServerAuth.ts");
const seoRoutes = read("scripts/seo-routes.ts");
const learnSlugs = read("src/content/space/learnSlugs.ts");
const sitemap = read("scripts/sitemap.mjs");
const llms = read("scripts/llms.mjs");
const vercel = read("vercel.json");

assert.match(claim, /LEGACY_HIDDEN_INTRO_SLUG\s*=\s*"hidden-intro"/, "Legacy hidden route slug must stay redirectable");
assert.match(claim, /COURSE_DISCOUNT_CLAIM_STORAGE_KEY\s*=\s*"opten_course_preview_claim_v1"/, "Shipped claim storage key must stay compatible");
assert.doesNotMatch(privateCourse, /AI контент-завод|AI content factory|PRIVATE_COURSE_HIDDEN_INTRO/, "Lesson 0/content factory must stay removed");
assert.doesNotMatch(serverCourse, /a4722357-b131-491f-8ca0-cdd11d927630|lessonSlug:\s*"hidden-intro"/, "Removed lesson 0 must not be in the Kinescope whitelist");
assert.match(privateCoursePage, /isLegacyHiddenIntro[\s\S]*PRIVATE_COURSE_FIRST_LESSON_SLUG[\s\S]*location\.search/, "Legacy hidden URL must redirect to lesson 1 and preserve the claim query");
assert.match(privateCoursePage, /rememberCourseDiscountClaim/, "Course page must persist a discount claim token from the URL");
assert.match(courseAccess, /COURSE_DISCOUNT_CLAIM_STORAGE_KEY/, "Course access helpers must use the compatible claim storage key");
assert.doesNotMatch(courseAccess, /opten_hidden_intro_opened_v1/, "Boolean hidden-intro storage must stay removed");

assert.match(tokenApi, /hasCourseAccess/, "Kinescope token API must enforce standalone course access server-side");
assert.match(tokenApi, /accessMode:\s*"course-entitlement"\s*\|\s*null/, "Playback tokens must have only the paid course access mode");
assert.doesNotMatch(tokenApi, /telegramPreviewClaim|telegram-course-preview|hasTelegramCoursePreviewAccess/, "Telegram claims must never authorize playback");
assert.doesNotMatch(serverAuth, /hasTelegramCoursePreviewAccess|telegram_preview_access/, "Server auth must not contain Telegram playback validation");
assert.doesNotMatch(serverCourse, /KINESCOPE_TELEGRAM_PREVIEW_LESSON_SLUGS|isKinescopeTelegramPreviewLesson/, "Server video allowlist must not contain a Telegram preview subset");
assert.match(authApi, /payload\.access_mode !== "course-entitlement"/, "Kinescope callback must reject non-entitlement playback tokens");

assert.match(components, /Генератор промптов Opten/, "Lesson UI must expose a separate Opten generator section");
assert.equal([...components.matchAll(/<OptenPromptGeneratorsSection/g)].length, 2, "Opten generators must render on both the course root and every lesson page");
assert.match(components, /<OptenPromptGeneratorsSection[\s\S]*?<LessonMaterials[\s\S]*?<LessonPrompts/, "Lesson generators must stay before materials and prompts");
assert.match(components, /<OptenPromptGeneratorsSection[\s\S]*?<CourseIntroShowcase/, "Course-root generators must stay before the intro showcase");
assert.match(components, /const hasAccess = courseAccess \|\| proAccess/, "Opten generators must open for either a course buyer or an active Pro user");
assert.match(components, /!loading\s*&&\s*!hasAccess[\s\S]*optenPromptGeneratorsDescription/, "Generator sales description must be hidden after access opens");
assert.match(components, /optenPromptGeneratorsLockedTitle[\s\S]*to="\/pay"/, "Locked generators must offer the compact Pro subscription action");
assert.doesNotMatch(components, /optenPromptGeneratorsCourseCta/, "The compact generator banner must not duplicate the course checkout CTA");
assert.match(components, /data-access-state=\{loading \? "loading" : hasAccess \? "open" : "locked"\}/, "Generator section must expose stable loading, open, and locked states");
assert.match(components, /const locked = isLessonLocked\(outlineLesson, hasAccess\)/, "Every course outline lesson must use only paid entitlement access");
assert.match(components, /<LessonPrompts[\s\S]*?locked=\{!courseHasAccess\}/, "Private lesson prompts must remain buyer-only");
assert.doesNotMatch(components, /Бесплатно через Telegram|Разблокировать через Telegram|telegramPreview|opten_space_bot|Первые 3 урока — бесплатно/, "Course UI must not advertise Telegram lesson access");

assert.doesNotMatch(seoRoutes, /hidden-intro/, "Legacy redirect must not be added to prerendered SEO routes");
assert.doesNotMatch(learnSlugs, /hidden-intro/, "Legacy redirect must not be added to Learn slug siblings");
assert.doesNotMatch(sitemap, /hidden-intro/, "Legacy redirect must not be added to sitemap generation");
assert.doesNotMatch(llms, /hidden-intro/, "Legacy redirect must not be added to llms generation");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Course routes must remain SPA routes");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Course routes must remain noindex");

console.log("Paid course discount-only Telegram guardrails passed.");
