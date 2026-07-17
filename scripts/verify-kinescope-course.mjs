import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const requiredFiles = [
  "src/content/space/privateCourse.ts",
  "src/lib/courseAccess.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "api/kinescope-course-token.ts",
  "api/kinescope-course-auth.ts",
  "api/_shared/kinescopeCourse.ts",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing Kinescope course artifact: ${file}`);
}

const content = read("src/content/space/privateCourse.ts");
const extrasContent = read("src/content/space/privateCourseExtras.ts");
const promptBodiesContent = read("api/_shared/coursePromptBodies.ts");
const serverCourseContent = read("api/_shared/kinescopeCourse.ts");
const lessonOneSkillAsset = "public/assets/space/courses/ai-content-marketing-2026/opten-skill.zip";
const introVideoOneAsset = "public/assets/space/courses/ai-content-marketing-2026/intro/course-intro-video-1.mp4";
const introVideoTwoAsset = "public/assets/space/courses/ai-content-marketing-2026/intro/course-intro-video-2.mp4";
const introPhotoFourAsset = "public/assets/space/courses/ai-content-marketing-2026/intro/course-intro-photo-4.png";
const lessonFourCheatsheetAsset = "public/assets/space/courses/ai-content-marketing-2026/lesson-4-model-cheatsheet.pdf";
const lessonFourResultAsset = "public/assets/space/courses/ai-content-marketing-2026/lesson-4-cofe1-result.jpg";

const expectedKinescopeLessons = [
  ["lesson-1-prompting", "e941e14d-c5bf-40fc-abe5-a41e247777cf"],
  ["lesson-2-ai-services", "c3b06c01-19dd-4a3c-8218-7a216a2ebd67"],
  ["lesson-3-logo-generation", "947a68e0-b570-4a9d-ad0c-ee55cc86b440"],
  ["lesson-4-photo-generation", "1fe7af11-23e5-46cf-bedf-e6bb41c2d3b3"],
  ["lesson-5-references", "02bcf12a-ab7c-49d4-96cb-441fafb898b9"],
  ["lesson-6-image-editing", "a6294ef7-c6e6-4744-8b2e-60967fa7bfd7"],
  ["lesson-7-ai-video", "18f00246-366f-4f43-a67a-a1b3ead807c0"],
  ["lesson-8-frames", "43d3328a-dc4d-4e60-a269-aa1eebf7e2b4"],
  ["lesson-9-storytelling", "6f742d8c-cf18-4b9d-97b7-b3e6f63aa696"],
  ["lesson-10-prompt-library", "3675dfeb-55da-47c3-aac8-35b0556dbd84"],
  ["lesson-11-ai-avatars", "602d64ae-48ab-4730-a4fc-81b4d9677c14"],
  ["lesson-12-motion-control", "d01c3455-92fe-4ffa-b878-d367211cfb5a"],
  ["lesson-13-upscale", "c8494fb4-b8cf-4b4e-b6e8-7b43aebd9189"],
  ["lesson-14-codex", "7a62c38c-b75d-4777-8ee8-74c81eda7a18"],
  ["lesson-15-higgsfield-mcp", "54757622-4f97-4d8f-a97e-1f95ac2561f1"],
  ["lesson-16-nova-website", "34992868-3dc1-416c-8438-d25ced15833a"],
];

const expectedPrivateCourseRuTitles = [
  "Работа с ChatGPT и Claude",
  "Обзор Syntx и Higgsfield",
  "Создание логотипа",
  "Генерация изображений",
  "Работа с референсами",
  "ИИ редактирование фото",
  "Генерация видео",
  "Режим ключевых кадров",
  "Режим мультишот",
  "ИИ редактирование видео",
  "Создание AI-аватаров",
  "Генерация озвучки",
  "Апскейл фото и видео",
  "Настройка Codex",
  "Автоматизация контента",
  "Вайб-кодинг сайта",
];

assert.match(content, /e941e14d-c5bf-40fc-abe5-a41e247777cf/, "Private course must use the uploaded Kinescope video id");
assert.match(content, /ai-content-marketing-2026/, "Private course must expose a stable hidden course slug");
assert.match(content, /lesson-1-prompting/, "Private course must expose the first lesson slug");
assert.match(content, /PRIVATE_COURSE_PRICE_RUB\s*=\s*2990/, "Private course base RUB price must be 2 990");
assert.match(content, /PRIVATE_COURSE_LIST_PRICE_RUB\s*=\s*2990/, "Private course list RUB price must stay 2 990");
assert.match(content, /PRIVATE_COURSE_PRICE_USD\s*=\s*41/, "Private course sale price must be 41 USD");
assert.match(content, /PRIVATE_COURSE_LIST_PRICE_USD\s*=\s*41/, "Private course list price must be 41 USD");
assert.match(content, /PRIVATE_COURSE_DISCOUNT_PERCENT\s*=\s*0/, "Private course must not hard-code a public discount; promo codes own discounting");
assert.match(content, /PRIVATE_COURSE_SALE_ENDS_AT/, "Private course must define a sale countdown deadline");
assert.match(content, /purchase:\s*{[\s\S]*priceRub:\s*PRIVATE_COURSE_PRICE_RUB[\s\S]*priceUsd:\s*PRIVATE_COURSE_PRICE_USD[\s\S]*discountPercent:\s*PRIVATE_COURSE_DISCOUNT_PERCENT/, "Private course collection must expose RUB and USD purchase metadata");
for (const [lessonSlug, videoId] of expectedKinescopeLessons) {
  assert.match(content, new RegExp(lessonSlug), `Private course content must include ${lessonSlug}`);
  assert.match(content, new RegExp(videoId), `Private course content must include Kinescope video ${videoId}`);
  assert.match(serverCourseContent, new RegExp(lessonSlug), `Server Kinescope whitelist must include ${lessonSlug}`);
  assert.match(serverCourseContent, new RegExp(videoId), `Server Kinescope whitelist must include Kinescope video ${videoId}`);
}
for (const title of expectedPrivateCourseRuTitles) {
  assert.match(content, new RegExp(`ru:\\s*"${escapeRegExp(title)}"`), `Private course RU title must be exactly "${title}"`);
}
assert.doesNotMatch(content, /ru:\s*"Урок \d+:/, "Private course RU lesson titles must not include numeric lesson prefixes");
assert.match(content, /chatgpt\.com\/g\/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator/, "Lesson materials must link the ChatGPT prompt generator");
const lessonOneExtrasStart = extrasContent.indexOf('"lesson-1-prompting"');
const lessonTwoExtrasStart = extrasContent.indexOf('"lesson-2-ai-services"', lessonOneExtrasStart);
const lessonThreeExtrasStart = extrasContent.indexOf('"lesson-3-logo-generation"', lessonTwoExtrasStart);
const lessonFourExtrasStart = extrasContent.indexOf('"lesson-4-photo-generation"');
const lessonFiveExtrasStart = extrasContent.indexOf('"lesson-5-references"', lessonFourExtrasStart);
const lessonSixExtrasStart = extrasContent.indexOf('"lesson-6-image-editing"', lessonFiveExtrasStart);
const lessonSevenExtrasStart = extrasContent.indexOf('"lesson-7-ai-video"', lessonSixExtrasStart);
assert.ok(lessonOneExtrasStart >= 0 && lessonTwoExtrasStart > lessonOneExtrasStart, "Private course extras must include lesson 1 and lesson 2 blocks");
const lessonOneExtras = extrasContent.slice(lessonOneExtrasStart, lessonTwoExtrasStart);
const lessonOneContentStart = content.indexOf("slug: PRIVATE_COURSE_FIRST_LESSON_SLUG");
const lessonOneContentEnd = content.indexOf('slug: "lesson-2-ai-services"', lessonOneContentStart);
assert.ok(lessonOneContentStart >= 0 && lessonOneContentEnd > lessonOneContentStart, "Private course content must include lesson 1 before lesson 2");
const lessonOneContent = content.slice(lessonOneContentStart, lessonOneContentEnd);
assert.ok(lessonThreeExtrasStart > lessonTwoExtrasStart, "Private course extras must include lesson 3 after lesson 2");
const lessonTwoExtras = extrasContent.slice(lessonTwoExtrasStart, lessonThreeExtrasStart);
assert.ok(lessonFourExtrasStart >= 0 && lessonFiveExtrasStart > lessonFourExtrasStart, "Private course extras must include lesson 4 and lesson 5 blocks");
const lessonFourExtras = extrasContent.slice(lessonFourExtrasStart, lessonFiveExtrasStart);
assert.ok(lessonSixExtrasStart > lessonFiveExtrasStart && lessonSevenExtrasStart > lessonSixExtrasStart, "Private course extras must include lesson 6 and lesson 7 blocks");
const lessonSixExtras = extrasContent.slice(lessonSixExtrasStart, lessonSevenExtrasStart);
assert.match(extrasContent, /const requiredCourseMaterials = \[links\.syntx\]/, "Paid course lesson materials must keep Syntx in the shared prefix");
assert.match(extrasContent, /ru:\s*withRequiredCourseMaterials\(extras\.materials\.ru\)/, "Private course extras must apply the shared required material prefix to paid lessons");
assert.doesNotMatch(`${content}\n${extrasContent}`, /AI контент-завод|l0-niche-research-strategy|HIDDEN_INTRO_SLUG/, "Removed lesson 0 must not remain in private course content");
assert.match(content, /const coursePromptGenerators:[\s\S]*Opten \(ChatGPT\)[\s\S]*Opten \(Claude и Codex\)/, "Paid course must define the separate Opten prompt generator section");
assert.match(content, /title:\s*"Opten \(ChatGPT\)"/, "Shared ChatGPT prompt generator fallback must use the current RU title");
const courseMaterialsBlock = content.slice(content.indexOf("const courseMaterials:"), content.indexOf("const coursePromptGenerators:"));
const coursePromptGeneratorsBlock = content.slice(content.indexOf("const coursePromptGenerators:"), content.indexOf("type PrivateCourseLessonConfig"));
assert.doesNotMatch(courseMaterialsBlock, /Opten \(ChatGPT\)|Opten \(Claude и Codex\)/, "Opten generators must not remain in general lesson materials");
assert.match(coursePromptGeneratorsBlock, /Opten \(ChatGPT\)[\s\S]*Opten \(Claude и Codex\)/, "Separate generator section must keep ChatGPT before Claude/Codex");
assert.doesNotMatch(`${content}\n${extrasContent}`, /Генератор промптов в ChatGPT|Opten Prompt Improver"|Opten генератор промптов/, "Private course materials must not use old ChatGPT prompt generator titles");
assert.match(coursePromptGeneratorsBlock, /Opten \(ChatGPT\)[\s\S]*actionLabel:\s*"Перейти"/, "Prompt generator button must say Перейти");
const invalidMaterialActionLabels = [...`${content}\n${extrasContent}`.matchAll(/actionLabel:\s*"([^"]+)"/g)]
  .map((match) => match[1])
  .filter((label) => label !== "Перейти" && label !== "Скачать");
assert.deepEqual(invalidMaterialActionLabels, [], "Private course material action labels must only be Перейти or Скачать");
assert.doesNotMatch(extrasContent, /function pending|promptPending|missing\(/, "Private course extras must not expose pending lesson placeholders");
assert.match(coursePromptGeneratorsBlock, /Opten \(Claude и Codex\)/, "Generator section must label the Claude/Codex skill archive in RU");
assert.match(coursePromptGeneratorsBlock, /Скилл для генерации промптов в Claude и Codex/, "Course Claude/Codex generator must show user-facing download copy");
assert.doesNotMatch(lessonOneExtras, /Скилл для загрузки на рабочем столе\./, "Lesson 1 Claude skill material must not expose internal desktop note");
assert.doesNotMatch(coursePromptGeneratorsBlock, /Скилл для загрузки на рабочем столе\./, "Generator section must not expose internal desktop notes");
assert.match(coursePromptGeneratorsBlock, /actionLabel:\s*"Скачать"/, "Course Claude skill material button must say Скачать");
assert.match(coursePromptGeneratorsBlock, /\/assets\/space\/courses\/ai-content-marketing-2026\/opten-skill\.zip/, "Course Claude skill material must link the downloadable ZIP asset");
assert.ok(existsSync(join(root, lessonOneSkillAsset)), `Lesson 1 Claude skill ZIP must exist: ${lessonOneSkillAsset}`);
assert.ok(statSync(join(root, lessonOneSkillAsset)).size > 0, "Lesson 1 Claude skill ZIP must not be empty");
assert.match(lessonFourExtras, /lesson-4-model-cheatsheet\.pdf/, "Lesson 4 must link the downloadable model cheat sheet");
assert.match(lessonFourExtras, /lesson-4-cofe1-result\.jpg/, "Lesson 4 must link the Cofe1 generated image");
assert.match(lessonFourExtras, /l4-cofe1-photo/, "Lesson 4 prompts must expose the exact Cofe1 prompt");
assert.doesNotMatch(lessonFourExtras, /Настройки генерации/, "Lesson 4 must not show generation settings as a missing item");
assert.match(lessonSixExtras, /Photopea[\s\S]*Бесплатный Photoshop в браузере[\s\S]*https:\/\/www\.photopea\.com\//, "Lesson 6 materials must include Photopea as a free browser Photoshop");
assert.match(promptBodiesContent, /Photorealistic square-format product lifestyle photograph/, "Course prompt API must serve the exact lesson 4 Cofe1 prompt");
assert.ok(existsSync(join(root, lessonFourCheatsheetAsset)), `Lesson 4 model cheat sheet must exist: ${lessonFourCheatsheetAsset}`);
assert.ok(statSync(join(root, lessonFourCheatsheetAsset)).size > 0, "Lesson 4 model cheat sheet must not be empty");
assert.ok(existsSync(join(root, lessonFourResultAsset)), `Lesson 4 Cofe1 image must exist: ${lessonFourResultAsset}`);
assert.ok(statSync(join(root, lessonFourResultAsset)).size > 0, "Lesson 4 Cofe1 image must not be empty");
assert.doesNotMatch(extrasContent, /links\.opten\b|opten:\s*link\("Opten"/, "Private course materials must not include the generic Opten site link");
assert.doesNotMatch(extrasContent, /chatgpt:\s*link\("ChatGPT"|claude:\s*link\("Claude"/, "Private course materials must not include generic ChatGPT or Claude links");
assert.doesNotMatch(lessonOneExtras, /Шпаргалка: формула промпта/, "Lesson 1 materials must not include the obsolete prompt formula cheat sheet");
assert.doesNotMatch(lessonOneExtras, /recommendedVpn/, "Lesson 1 materials must not include the VPN link removed with the shortened ending");
assert.doesNotMatch(lessonOneExtras, /foreignServicesPayment/, "Lesson 1 materials must not include the payment link removed with the shortened ending");
assert.match(lessonOneContent, /duration:\s*"08:09"/, "Lesson 1 duration must match the shortened Kinescope video");
assert.match(lessonOneContent, /durationIso:\s*"PT8M9S"/, "Lesson 1 ISO duration must match the shortened Kinescope video");
assert.match(lessonOneContent, /\["07:32", "Что дальше в курсе"\]/, "Lesson 1 timestamps must include the new closing chapter");
assert.doesNotMatch(lessonOneContent, /08:35|09:40|Доступ и оплата сервисов/, "Lesson 1 timestamps must not reference removed footage");
assert.doesNotMatch(lessonTwoExtras, /Шпаргалка по Syntx/, "Lesson 2 materials must not include the Syntx cheat sheet");
assert.match(lessonOneExtras, /l1-nova-formula-image/, "Lesson 1 prompts must expose the single NOVA formula example");
assert.doesNotMatch(lessonOneExtras, /l1-business-name|l1-opten-image-prompt|l1-skill-explanation/, "Lesson 1 prompts must not expose obsolete prompt examples");
assert.match(promptBodiesContent, /l1-nova-formula-image/, "Course prompt API must serve the lesson 1 NOVA formula prompt");
assert.match(promptBodiesContent, /Задача:[\s\S]*Контекст:[\s\S]*Сцена:[\s\S]*Стиль:[\s\S]*Ограничения:[\s\S]*Формат:/, "Lesson 1 prompt body must follow the requested prompt formula");
assert.doesNotMatch(promptBodiesContent, /l1-business-name|l1-opten-image-prompt|l1-skill-explanation/, "Course prompt API must not serve obsolete lesson 1 prompt ids");
assert.doesNotMatch(extrasContent, /Opten skill archive/, "Private course materials must not use the old English Opten skill archive label");
assert.doesNotMatch(content, /\/dashboard\/download-skill/, "Standalone course materials must not link the Pro-only skill download route");
assert.match(content, /https:\/\/syntx\.ai\/welcome\/GlUETIt6/, "Lesson materials must link Syntx");
assert.match(content, /https:\/\/higgsfield\.ai\//, "Lesson materials must link Higgsfield");
assert.match(content, /https:\/\/disk\.yandex\.ru\/d\/HaU7LdU850QLVw/, "Every private course lesson must expose the current AI tools 2026 material");
assert.match(content, /const courseMaterials:/, "Private course must define one shared material set");
assert.match(content, /materials:\s*extras\?\.materials\s*\?\?\s*courseMaterials/, "Private course lessons must use lesson extras with the shared material fallback");
assert.equal([...content.matchAll(/promptGenerators:\s*coursePromptGenerators/g)].length, 1, "Private course must expose one collection-level Opten generator section");
assert.match(content, /purchase:\s*{[\s\S]*promptGenerators:\s*coursePromptGenerators[\s\S]*progress:/, "Opten generators must belong to the course collection, not individual lessons");
assert.doesNotMatch(content, /materials\?:/, "Private course lesson config must not allow per-lesson material overrides");
assert.doesNotMatch(content, /materials:\s*firstLessonSpecificMaterials/, "Private course lessons must not keep first-lesson-only material overrides");
assert.match(content, /provider:\s*"kinescope"/, "Private lesson must use the Kinescope video provider");
assert.match(content, /playbackPolicy:\s*"course-entitlement-gated-preview"/, "Private Kinescope lessons must use course entitlement playback policy");
assert.doesNotMatch(content, /Pro-gate|Pro gate/, "Private course content must not describe Kinescope access as Pro-gated");

const learn = read("src/content/space/learn.ts");
assert.match(learn, /provider:\s*"youtube"\s*\|\s*"local"\s*\|\s*"kinescope"/, "Learn provider type must include Kinescope");
assert.match(learn, /course-entitlement-gated-preview/, "Learn playback policy type must include course entitlement gating");

const components = read("src/app/components/space/learn/LearnComponents.tsx");
const privateCoursePage = read("src/app/pages/space/PrivateCoursePage.tsx");
assert.match(content, /privateCourseIntroContent/, "Private course must define dedicated intro content");
assert.match(content, /Курс про нейросети для контента и маркетинга/, "Private course intro title must use the requested wording");
assert.match(content, /posterPath:\s*"\/assets\/learn\/video\/actual-ai-tools-2026-poster\.jpg"/, "Private course intro must reuse the Learn hero course cover");
assert.doesNotMatch(content, /if \(!lessonSlug\) return collection\.lessons\[0\]/, "Private course root must not fall back to lesson 1");
assert.match(privateCoursePage, /!lessonSlug[\s\S]*<CourseIntroLayout collection=\{collection\} intro=\{privateCourseIntroContent\}/, "Private course root route must render the course intro layout");
assert.match(components, /export function CourseIntroLayout/, "Private course root must have a dedicated intro layout");
assert.match(components, /function CourseIntroVideoPlaceholder/, "Private course intro must render the intro player slot");
assert.match(content, /publicIntroVideo:\s*{[\s\S]*9c0fc06c-0063-4d9d-98f8-5333f993072b[\s\S]*https:\/\/kinescope\.io\/embed\/kgJ8g56Bu5BpggbbaFLhqc/, "Private course root must point at the public Kinescope intro video");
assert.match(components, /publicIntroVideo \? \([\s\S]*<iframe[\s\S]*src=\{publicIntroVideo\.embedUrl\}[\s\S]*allow="autoplay; fullscreen; picture-in-picture; encrypted-media"/, "Private course intro must embed the public Kinescope player directly");
assert.match(components, /function CourseIntroShowcase/, "Private course intro must render a showcase section instead of lesson materials");
assert.match(components, /currentSlug=\{currentSlug \?\? lesson\.slug\}/, "Course sidebar must support a course overview with no selected lesson");
assert.match(components, /course-intro-video-1\.mp4/, "Private course intro bento must use video 1");
assert.match(components, /course-intro-video-2\.mp4/, "Private course intro bento must use video 2");
assert.match(components, /course-intro-photo-4\.png/, "Private course intro bento must use photo 4");
assert.match(components, /autoPlay[\s\S]*loop[\s\S]*muted[\s\S]*playsInline/, "Private course intro bento videos must autoplay, loop, stay muted, and play inline");
const courseIntroStart = components.indexOf("export function CourseIntroLayout");
const courseIntroEnd = components.indexOf("type LessonPlayerProps", courseIntroStart);
assert.ok(courseIntroStart >= 0 && courseIntroEnd > courseIntroStart, "Private course intro source block must be readable");
const courseIntroSource = components.slice(courseIntroStart, courseIntroEnd);
assert.doesNotMatch(courseIntroSource, /<LessonPlayer|<LessonMaterials|<LessonPrompts|<LessonMissingItems|\/api\/kinescope-course-token|drmauthtoken/, "Private course intro must not embed a gated lesson player, materials, prompts, or tokenized playback");
for (const assetPath of [introVideoOneAsset, introVideoTwoAsset, introPhotoFourAsset]) {
  assert.ok(existsSync(join(root, assetPath)), `Private course intro asset must exist: ${assetPath}`);
  assert.ok(statSync(join(root, assetPath)).size > 0, `Private course intro asset must not be empty: ${assetPath}`);
}
assert.match(components, /const actionLabel = getMaterialActionLabel\(material\);/, "Course material buttons must normalize labels to Перейти or Скачать");
assert.doesNotMatch(components, /pending \? copy\.materialPendingAction : material\.actionLabel/, "Pending course material buttons must not use a third label");
assert.doesNotMatch(components, /purchase \? copy\.paidCourseBadge : material\.actionLabel/, "Course material buttons must not replace actions with a generic course badge");
assert.match(components, /const staticAsset = material\.href\.startsWith\("\/assets\/"\);/, "Static asset materials must bypass SPA routing");
assert.match(components, /download=\{staticAsset \|\| material\.href\.endsWith\("\.zip"\) \? "" : undefined\}/, "Static course materials must set the browser download attribute");
assert.doesNotMatch(components, /!locked && !collection\.purchase/, "Opened paid-course lessons must still show the lesson completion button");
assert.match(components, /<LessonCompletionAction[\s\S]*onToggle=\{\(\) => onCompletionChange\(!completed\)\}/, "Lesson completion button must toggle local lesson progress");
assert.match(components, /provider\.provider === "kinescope"/, "Learn player must branch for Kinescope videos");
assert.match(components, /\/api\/kinescope-course-token/, "Learn player must request Kinescope embed URLs through the server");
assert.match(components, /KINESCOPE_IFRAME_API_SRC = "https:\/\/player\.kinescope\.io\/latest\/iframe\.player\.js"/, "Learn player must load the official Kinescope iframe API for timestamp seeking");
assert.match(components, /pendingKinescopeSeekRef/, "Learn player must preserve pending Kinescope timestamp seeks while the player loads");
assert.match(components, /\.seekTo\(Math\.max\(0, Math\.floor\(startSeconds\)\)\)/, "Kinescope timestamp clicks must call player.seekTo");
assert.match(components, /player\.once\(player\.Events\.Loaded/, "Kinescope player must seek after the iframe API reports the video as loaded");
assert.match(components, /createCoursePayment/, "Private course UI must create a standalone course payment");
assert.match(components, /fetchCourseAccessSummary/, "Private course UI must check standalone course access");
assert.match(components, /normalizeCoursePromoCode/, "Private course UI must normalize promo codes");
assert.match(components, /isValidCoursePromoCode/, "Private course UI must accept server-managed promo codes");
assert.match(components, /Paddle\.Checkout\.open/, "Private course UI must support Paddle checkout for USD course purchases");
assert.match(components, /discountCode/, "Private course UI must pass Paddle discount codes for USD course promos");
assert.match(components, /courseLockedDescription/, "Private course locked overlay must use course purchase copy");
assert.match(components, /unlocksAfterPurchase/, "Private course outline must label locked lessons as purchase-gated");
assert.match(components, /const courseBreadcrumbTitle = isCourse \? getLearnCollectionTitle\(collection, lang\) : getLearnLessonTitle\(lesson, lang\)/, "Course breadcrumbs must stay stable per course instead of changing per lesson");
assert.match(components, /const courseMobileOrder = \(order: 1 \| 2 \| 3 \| 4 \| 5\)/, "Private course mobile layout must support separate player, progress, outline, purchase, and content ordering");
assert.match(components, /max-md:max-h-\[312px\]/, "Mobile course outline must show more of the lesson list while keeping the next content visible");
assert.match(components, /courseBuyButton:\s*\(price: string\) => `Открыть весь курс за \$\{price\}`/, "Course purchase button copy must say 'Открыть весь курс за ...'");
assert.match(components, /buyCourseShort:\s*\(price: string\) => `Открыть весь курс за \$\{price\}`/, "Locked player CTA copy must say 'Открыть весь курс за ...'");
assert.match(components, /markLessonCompleted:\s*"Отметить как пройдено"/, "Completion CTA must use the requested passed-lesson wording");
assert.match(components, /lessonCompleted:\s*"Отмечено как пройдено"/, "Completed lesson state must use the requested passed-lesson wording");
assert.match(components, /function CourseProgressCard/, "Opened paid course must render a focused course progress card");
assert.match(components, /function LessonDescription/, "Lesson intro description must use the compact mobile show-more component");
assert.match(components, /showMoreDescription:\s*"Показать ещё"/, "Lesson intro mobile expander must say 'Показать ещё'");
assert.match(components, /max-md:text-\[16px\]/, "Course lesson/timestamp tabs must use 16px text on mobile");
assert.match(components, /text-\[19px\][\s\S]*max-sm:text-\[18px\]/, "Course purchase title must be 2px larger on desktop and mobile");
assert.doesNotMatch(components, /promoBadgeLabel/, "Course purchase card must not render FREE or discount promo badges");
assert.match(components, /<div className=\{`min-w-0 \$\{courseMobileOrder\(3\)\}`\}>\s*<CoursePurchaseCard/, "Locked private-course purchase form must be third on mobile");
assert.match(components, /<div className=\{`min-w-0 \$\{courseMobileOrder\(2\)\}`\}>\s*<LessonSidebar/, "Locked private-course outline must be second on mobile");
assert.doesNotMatch(components, /kine\.txt|KINESCOPE_API|Bearer\s+[0-9a-f-]{36}/i, "Client code must not expose Kinescope API keys");
const kinescopeFetchIndex = components.indexOf('fetch("/api/kinescope-course-token"');
assert.notEqual(kinescopeFetchIndex, -1, "Learn player must keep Kinescope token fetch in source");
const kinescopeFetchEffectStart = components.lastIndexOf("useEffect(() => {", kinescopeFetchIndex);
const kinescopeFetchDepsStart = components.indexOf("}, [", kinescopeFetchIndex);
const kinescopeFetchEffectEnd = components.indexOf("]);", kinescopeFetchDepsStart);
assert.ok(kinescopeFetchEffectStart >= 0 && kinescopeFetchDepsStart > kinescopeFetchIndex && kinescopeFetchEffectEnd > kinescopeFetchDepsStart, "Learn player must keep Kinescope token fetch inside a React effect");
const kinescopeFetchEffectBody = components.slice(kinescopeFetchEffectStart, kinescopeFetchDepsStart);
const kinescopeFetchEffectDeps = components.slice(kinescopeFetchDepsStart, kinescopeFetchEffectEnd);
assert.doesNotMatch(kinescopeFetchEffectBody, /if \([^\n]*\bkinescopeLoading\b/, "Kinescope token fetch must not use loading state as an effect guard because it can skip the replacement request");
assert.doesNotMatch(kinescopeFetchEffectDeps, /\bkinescopeLoading\b/, "Kinescope token fetch must not depend on loading state because it cancels the in-flight request");

const tokenApi = read("api/kinescope-course-token.ts");
const serverAuth = read("api/_shared/optenServerAuth.ts");
const serverCourse = serverCourseContent;
assert.match(tokenApi, /KINESCOPE_AUTH_JWT_SECRET/, "Token API must sign playback tokens with a server env secret");
assert.match(tokenApi, /hasCourseAccess/, "Token API must enforce standalone course access server-side");
assert.match(tokenApi, /telegram-course-preview/, "Token API must use a distinct Telegram three-lesson preview access mode");
assert.match(tokenApi, /hasTelegramCoursePreviewAccess/, "Token API must validate Telegram preview claims server-side");
assert.doesNotMatch(tokenApi, /hiddenIntroUnlocked/, "Token API must not trust the removed browser boolean unlock");
assert.doesNotMatch(tokenApi, /hasLiveProSubscription|not_pro/, "Kinescope token API must not unlock the private course through Pro");
assert.match(serverAuth, /course-access-summary/, "Server auth helper must call course-access-summary for course entitlements");
assert.match(tokenApi, /buildKinescopeEmbedUrl/, "Token API must return Kinescope embed URLs through the shared builder");
assert.match(serverCourse, /drmauthtoken/, "Kinescope embed URL builder must attach the DRM auth token");
assert.doesNotMatch(serverCourse, /buildKinescopeViewerWatermark|watermark/i, "Kinescope embed URL builder must not attach viewer watermark text");
assert.doesNotMatch(tokenApi, /buildKinescopeViewerWatermark|viewerWatermark|watermark/i, "Token API must not pass per-viewer watermark text into Kinescope embed URLs");

const authApi = read("api/kinescope-course-auth.ts");
assert.match(authApi, /KINESCOPE_AUTH_JWT_SECRET/, "Kinescope auth callback must verify the same server env secret");
assert.match(authApi, /403/, "Kinescope auth callback must be able to deny playback");
assert.match(authApi, /jwtVerify/, "Kinescope auth callback must validate signed playback JWTs");

const main = read("src/main.tsx");
assert.match(main, /\/learn\/courses\/:courseSlug"/, "Main router must register hidden course routes");
assert.match(main, /\/learn\/courses\/:courseSlug\/:lessonSlug"/, "Main router must register hidden course lesson routes");
assert.ok(main.indexOf('/learn/courses/:courseSlug') < main.indexOf('/learn/:lessonSlug'), "Course routes must be registered before generic /learn/:lessonSlug");

const vercel = read("vercel.json");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Hidden course routes must SPA-rewrite to /spa.html");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Hidden course routes must ship noindex headers");

const agents = read("AGENTS.md");
assert.match(agents, /Kinescope/i, "AGENTS.md must document the Kinescope course integration");
assert.match(agents, /KINESCOPE_AUTH_JWT_SECRET/, "AGENTS.md must document the Kinescope playback env secret");
assert.match(agents, /create-course-payment/, "AGENTS.md must document standalone course checkout");
assert.match(agents, /course-access-summary/, "AGENTS.md must document standalone course entitlement checks");

console.log("Kinescope private course integration artifacts are present.");
