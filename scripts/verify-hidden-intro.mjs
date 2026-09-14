import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

const privateCourse = read("src/content/space/privateCourse.ts");
const privateCoursePage = read("src/app/pages/space/PrivateCoursePage.tsx");
const components = read("src/app/components/space/learn/LearnComponents.tsx");
const courseAccess = read("src/lib/courseAccess.ts");
const tokenApi = read("api/kinescope-course-token.ts");
const authApi = read("api/kinescope-course-auth.ts");
const serverCourse = read("api/_shared/kinescopeCourse.ts");
const serverAuth = read("api/_shared/optenServerAuth.ts");
const agents = read("AGENTS.md");
const integrationContract = read("docs/INTEGRATION-CONTRACT.md");

assert.equal(
  existsSync(join(root, "src/content/space/hiddenIntro.ts")),
  false,
  "Retired lesson-zero content module must stay deleted",
);
assert.match(privateCourse, /const privateCourseTotalLessons = 16/, "Paid course progress must remain 16 lessons");
assert.doesNotMatch(privateCourse, /privateCourseHiddenIntroLesson|PRIVATE_COURSE_HIDDEN_INTRO|AI контент-завод|Бесплатный нулевой урок/iu);

assert.match(privateCoursePage, /RETIRED_HIDDEN_INTRO_SLUG\s*=\s*"hidden-intro"/);
assert.match(privateCoursePage, /lessonSlug === RETIRED_HIDDEN_INTRO_SLUG[\s\S]*?<NotFound \/>/);

assert.doesNotMatch(components, /telegramHiddenIntro|privateCourseHiddenIntroLesson|HIDDEN_INTRO_SLUG|Бесплатно после подписки/iu);
assert.match(components, /const hasAccess = courseAccess \|\| proAccess/, "Generator access must remain course purchase or Pro");
assert.match(components, /<LessonPrompts[\s\S]*?locked=\{!courseHasAccess\}/, "Private prompts must remain buyer-only");
assert.doesNotMatch(courseAccess, /fetchTelegramHiddenIntroAccess|telegram-hidden-intro-opened/);
assert.doesNotMatch(serverAuth, /hasTelegramHiddenIntroAccess|telegram-hidden-intro-opened/);

assert.doesNotMatch(tokenApi, /discountClaimToken|telegram-hidden-intro|KINESCOPE_HIDDEN_INTRO_SLUG|hasTelegramHiddenIntroAccess/);
assert.doesNotMatch(authApi, /telegram-hidden-intro|KINESCOPE_HIDDEN_INTRO_SLUG/);
assert.doesNotMatch(serverCourse, /hidden-intro|a4722357-b131-491f-8ca0-cdd11d927630/);


assert.doesNotMatch(courseAccess, /discountClaim|discount_claim|opten_course_preview_claim_v1/);
assert.doesNotMatch(components, /claimBlocksPromo|courseClaimExpired|discountClaimToken/);
assert.doesNotMatch(privateCoursePage, /rememberCourseDiscountClaim|readStoredCourseDiscountClaim/);
assert.match(agents, /Telegram course bot is paused/);
assert.match(integrationContract, /Telegram course bot is paused/);

console.log("Telegram discounts and lesson-zero retirement guardrails passed.");
