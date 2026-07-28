import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const requiredFiles = [
  "src/content/space/courseDiscountClaim.ts",
  "src/content/space/hiddenIntro.ts",
  "src/content/space/privateCourse.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "src/lib/courseAccess.ts",
  "api/kinescope-course-token.ts",
  "api/kinescope-course-auth.ts",
  "api/_shared/kinescopeCourse.ts",
  "api/_shared/optenServerAuth.ts",
  "scripts/seo-routes.ts",
  "src/content/space/learnSlugs.ts",
  "scripts/sitemap.mjs",
  "scripts/llms.mjs",
  "vercel.json",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing hidden-intro guardrail input: ${file}`);
}

const claim = read("src/content/space/courseDiscountClaim.ts");
const hiddenIntro = read("src/content/space/hiddenIntro.ts");
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

assert.match(claim, /HIDDEN_INTRO_SLUG\s*=\s*"hidden-intro"/, "Hidden intro route slug must remain stable");
assert.match(claim, /COURSE_DISCOUNT_CLAIM_STORAGE_KEY\s*=\s*"opten_course_preview_claim_v1"/, "Shipped claim storage key must stay compatible");
assert.match(hiddenIntro, /HIDDEN_INTRO_TELEGRAM_URL/, "Locked lesson must point back to the Telegram bot");
assert.doesNotMatch(courseAccess, /opten_hidden_intro_opened_v1/, "A browser boolean must never unlock the lesson");

assert.match(privateCourse, /PRIVATE_COURSE_HIDDEN_INTRO_KINESCOPE_VIDEO_ID\s*=\s*"a4722357-b131-491f-8ca0-cdd11d927630"/, "Lesson zero must keep the reviewed Kinescope video");
assert.match(privateCourse, /privateCourseHiddenIntroLesson[\s\S]*materials:\s*\[\][\s\S]*prompts:\s*\[\]/, "Lesson zero must not expose paid materials or prompts");
assert.match(privateCourse, /const privateCourseTotalLessons = 16/, "Paid course progress must remain 16 lessons");
assert.match(privateCourse, /lessons:\s*privateCourseLessons/, "Lesson zero must stay outside the paid course lesson list");
assert.match(privateCoursePage, /isHiddenIntro[\s\S]*privateCourseHiddenIntroLesson/, "The hidden route must render the separate lesson zero");
assert.match(privateCoursePage, /readStoredCourseDiscountClaim/, "The personal claim must survive navigation");

assert.match(courseAccess, /fetchTelegramHiddenIntroAccess[\s\S]*validate_only/, "Client preview must be validated by the server");
assert.match(serverAuth, /hasTelegramHiddenIntroAccess[\s\S]*telegram-hidden-intro-opened[\s\S]*validate_only:\s*true/, "Website server must revalidate the claim");
assert.match(tokenApi, /hasTelegramHiddenIntroAccess/, "Kinescope token API must validate Telegram claim access server-side");
assert.match(tokenApi, /lesson\.lessonSlug === KINESCOPE_HIDDEN_INTRO_SLUG/, "Telegram claim must be limited to lesson zero");
assert.match(authApi, /payload\.access_mode === "telegram-hidden-intro"[\s\S]*lesson\?\.lessonSlug === KINESCOPE_HIDDEN_INTRO_SLUG/, "Kinescope callback must limit Telegram playback tokens to lesson zero");
assert.match(serverCourse, /lessonSlug:\s*KINESCOPE_HIDDEN_INTRO_SLUG[\s\S]*videoId:\s*"a4722357-b131-491f-8ca0-cdd11d927630"/, "Lesson zero must be in the server video whitelist");

assert.match(components, /const lessonHasAccess = courseHasAccess \|\| telegramAccess\.hasAccess/, "Only the current lesson player may use the Telegram claim");
assert.match(components, /const hasAccess = courseAccess \|\| proAccess/, "Generator access must remain course purchase or Pro");
assert.match(components, /<LessonPrompts[\s\S]*?locked=\{!courseHasAccess\}/, "Private prompts must remain buyer-only");
assert.doesNotMatch(components, /courseAccess=\{lessonHasAccess\}/, "Telegram lesson access must never flow into the generator");
assert.match(components, /discountClaimToken:\s*previewClaimToken/, "The playback request must send the claim for server validation");
assert.match(components, /outlineLessons[\s\S]*privateCourseHiddenIntroLesson[\s\S]*collection\.lessons/, "Lesson zero must be visible above the paid course outline");
assert.match(components, /lesson\.slug === HIDDEN_INTRO_SLUG\) return "0"/, "The visible free lesson must keep number zero");
assert.match(components, /hasAccess \|\| \(isHiddenIntro && hiddenIntroHasAccess\)/, "Telegram claim access may unlock only the lesson-zero outline row");
assert.match(components, /hiddenIntroSubscriptionBadge:\s*"Бесплатно после подписки"/, "Locked lesson zero must describe its Telegram subscription gate");

assert.doesNotMatch(seoRoutes, /hidden-intro/, "Hidden lesson must not be prerendered as an SEO route");
assert.doesNotMatch(learnSlugs, /hidden-intro/, "Hidden lesson must not get an EN sibling");
assert.doesNotMatch(sitemap, /hidden-intro/, "Hidden lesson must not enter the sitemap");
assert.doesNotMatch(llms, /hidden-intro/, "Hidden lesson must not enter llms.txt");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Course routes must remain SPA routes");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Course routes must remain noindex");

console.log("Secure Telegram lesson-zero guardrails passed.");
