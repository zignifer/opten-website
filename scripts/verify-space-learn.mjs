import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

const requiredFiles = [
  "src/content/space/learn.ts",
  "src/content/space/learnFinds.generated.json",
  "src/content/space/learnFinds.ts",
  "src/content/space/learnSlugs.ts",
  "src/app/components/space/SpaceHeader.tsx",
  "src/app/components/space/SpaceAuthProvider.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "src/app/pages/space/AppIndexPage.tsx",
  "src/app/pages/space/AppLoginPage.tsx",
  "src/app/pages/space/AppAuthCallbackPage.tsx",
  "src/app/pages/space/LearnOverviewPage.tsx",
  "src/app/pages/space/LearnLessonsPage.tsx",
  "src/app/components/space/learn/LearnLessonCard.tsx",
  "src/app/pages/space/LearnFindDetailPage.tsx",
  "src/app/pages/space/LessonDetailPage.tsx",
  "src/app/pages/space/LearnTemplatePage.tsx",
  "src/lib/optenAuth.ts",
  "public/assets/space/figma/search.svg",
  "public/assets/space/figma/prompt-stack.svg",
  "public/assets/space/figma/header-atoms/logo-lockup.svg",
  "public/assets/space/templates/supplement-hero-shot.jpg",
  "public/assets/learn/video/actual-ai-tools-2026.mp4",
  "public/assets/learn/video/actual-ai-tools-2026-poster.jpg",
  "public/assets/learn/og/actual-ai-tools-2026.jpg",
  "public/assets/learn/thumbs/figma-to-codex-website.jpg",
  "public/assets/learn/og/figma-to-codex-website.jpg",
  "public/assets/learn/thumbs/client-website-figma-codex.jpg",
  "public/assets/learn/og/client-website-figma-codex.jpg",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing Space Learn artifact: ${file}`);
}

const main = readFileSync(join(root, "src/main.tsx"), "utf8");
assert.match(main, /\/app"/, "Main router must register /app");
assert.match(main, /\/app\/login"/, "Main router must register /app/login");
assert.match(main, /\/app\/auth\/callback"/, "Main router must register /app/auth/callback");
assert.match(main, /\/learn"/, "Main router must register public /learn");
assert.match(main, /\/learn\/lessons"/, "Main router must register the complete free-lesson catalog");
assert.match(main, /\/learn\/templates\/:templateKind"/, "Main router must register noindex Learn template routes");
assert.match(main, /\/learn\/templates\/:templateKind\/:templateLessonSlug"/, "Main router must register noindex Learn template lesson routes");
assert.match(main, /\/learn\/finds\/:findSlug"/, "Main router must register public Learn Finds routes");
assert.ok(main.indexOf('/learn/finds/:findSlug') < main.indexOf('/learn/:lessonSlug'), "Learn Finds route must be registered before generic /learn/:lessonSlug");
assert.ok(main.indexOf('/learn/lessons') < main.indexOf('/learn/:lessonSlug'), "Learn catalog route must be registered before generic /learn/:lessonSlug");
assert.match(main, /\/learn\/:lessonSlug"/, "Main router must register public /learn/:lessonSlug");
assert.match(main, /\/en\/learn"/, "Main router must register public /en/learn");
assert.match(main, /\/en\/learn\/lessons"/, "Main router must register the EN free-lesson catalog");
assert.match(main, /\/en\/learn\/templates\/:templateKind"/, "Main router must register EN noindex Learn template routes");
assert.match(main, /\/en\/learn\/finds\/:findSlug"/, "Main router must register EN Learn Finds routes");
assert.match(main, /\/en\/learn\/:lessonSlug"/, "Main router must register public /en/learn/:lessonSlug");
assert.match(main, /\/app\/learn"[\s\S]*Navigate[\s\S]*\/learn/, "Legacy /app/learn must redirect to /learn");
assert.match(main, /\/app\/learn\/:lessonSlug"[\s\S]*Navigate[\s\S]*\/learn/, "Legacy /app/learn/:lessonSlug must redirect to /learn");
assert.match(main, /\/space\/learn"[\s\S]*Navigate[\s\S]*\/learn/, "Legacy /space/learn must redirect to /learn");
assert.match(main, /LearnOverviewPage/, "Main router must import/render LearnOverviewPage");
assert.match(main, /\/app\/learn-v2"[\s\S]*Navigate[\s\S]*\/learn/, "Legacy /app/learn-v2 must redirect to /learn");
assert.match(main, /LessonDetailPage/, "Main router must import/render LessonDetailPage");
assert.match(main, /SpaceAuthProvider/, "Main router must wrap app routes in SpaceAuthProvider");

const vercel = readFileSync(join(root, "vercel.json"), "utf8");
assert.match(vercel, /"source": "\/app\/:path\*"/, "Vercel must SPA-rewrite /app/:path* to /index.html");
assert.match(vercel, /"source": "\/app\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Opten Space app routes must ship noindex headers");
assert.match(vercel, /"source": "\/space\/:path\*"/, "Vercel must keep SPA rewrite for legacy /space/:path* redirects");
assert.match(vercel, /"source": "\/learn\/templates\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Learn template routes must SPA-rewrite to /spa.html");
assert.match(vercel, /"source": "\/learn\/templates\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Learn template routes must ship noindex headers");
assert.match(vercel, /"source": "\/en\/learn\/templates\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "EN Learn template routes must ship noindex headers");
assert.doesNotMatch(vercel, /"source": "\/learn"[\s\S]*"X-Robots-Tag"/, "Public /learn hub must not receive a noindex header");

const content = readFileSync(join(root, "src/content/space/learn.ts"), "utf8");
assert.match(content, /export const learnFilters/, "Learn filters must be exported");
assert.match(content, /export const learnCourses/, "Learn courses must be exported");
assert.match(content, /actual-ai-tools-2026/, "Learn catalog must include the featured local video");
assert.match(content, /ai-avatar-motion-control/, "Learn catalog must include the AI avatar lesson");
assert.match(content, /junior-designer-1100-order/, "Learn catalog must include the junior designer order lesson");
assert.match(content, /client-website-navigation-hero/, "Learn catalog must include the client website lesson");
assert.match(content, /thumbnailPath: "https:\/\/i\.ytimg\.com\/vi\/MEs-DdIjPy0\/maxresdefault\.jpg"/, "Client website navigation lesson must use its current YouTube thumbnail");
assert.match(content, /ai-marketplace-product-cards/, "Learn catalog must include the AI marketplace cards lesson");
assert.match(content, /web-design-references/, "Learn catalog must include the web design references lesson");
assert.match(content, /figma-to-codex-website/, "Learn catalog must include the Figma-to-Codex lesson");
assert.match(content, /youtubeId: "XRVo8ZU6Nis"/, "Figma-to-Codex lesson must use the requested YouTube video");
assert.match(content, /time: "23:13", seconds: 1393/, "Figma-to-Codex lesson must keep all original YouTube chapters");
assert.match(content, /client-website-figma-codex/, "Learn catalog must include the new client website lesson");
assert.match(content, /title:\s*\{[\s\S]*?ru: "Сайт за 50 000 ₽ в Figma и Codex"/, "New lesson must use the reviewed two-line card title");
assert.match(content, /youtubeId: "hekYDp3-ErQ"/, "New client website lesson must use the requested YouTube video");
assert.match(content, /time: "26:15", seconds: 1575/, "New client website lesson must keep all original YouTube chapters");
assert.match(content, /ai-website-vibe-design/, "Learn catalog must include the new AI website vibe-design lesson");
assert.match(content, /thumbnailPath: "https:\/\/i\.ytimg\.com\/vi\/ZWLiM5Wqv3M\/maxresdefault\.jpg"/, "AI website vibe-design lesson must use its live YouTube thumbnail");
assert.match(content, /youtubeId: "ZWLiM5Wqv3M"/, "AI website vibe-design lesson must use the requested YouTube video");
assert.match(content, /time: "31:07", seconds: 1867/, "AI website vibe-design lesson must keep all 20 original YouTube chapters");
assert.match(content, /https:\/\/t\.me\/v_voronezhtsev/, "AI website vibe-design lesson must include the author's Seedance materials link");
assert.match(content, /https:\/\/higgsfield\.ai\//, "Actual AI tools lesson must include the Higgsfield material");
assert.match(content, /https:\/\/freepik\.com\//, "Actual AI tools lesson must include the Freepik / Magnific material");
assert.match(content, /https:\/\/syntx\.ai\/welcome\/GlUETIt6/, "Actual AI tools lesson must include the Syntx material");
assert.match(content, /xzRwLyTMdrptYg/, "AI avatar lesson must include the bear source files material");
assert.match(content, /oXQC8gAKd7fLrQ/, "AI avatar lesson must include the human source files material");
assert.match(content, /RW634KjnQBxXOA/, "AI avatar lesson must include the prompts material");
assert.match(content, /mOcAHEj6CTfJ4I6rX3njbS\/Lesson-2/, "Junior designer lesson must include the Figma project material");
assert.match(content, /magnific\.com\/ai\/background-remover/, "Client website lesson must include the Magnific background remover material");
assert.match(content, /veGLoNcpik3KFPVt80NrCE\/Lesson--Show-/, "Client website lesson must include the Figma project material");
assert.match(content, /guN3wlvDOU5Noj96hXLoaM\/Pyros--lesson-/, "References lesson must include the Figma project material");
assert.match(content, /findLearnLesson/, "Learn detail lookup helper must be exported");
assert.match(content, /getAdjacentLearnLessons/, "Adjacent lesson navigation helper must be exported");
assert.match(content, /learnTemplateCollections/, "Noindex Learn template collections must be preserved for future course authoring");
assert.match(content, /routeBasePath/, "Template collections must keep internal template lesson links on template URLs");

const learnOverview = readFileSync(join(root, "src/app/pages/space/LearnOverviewPage.tsx"), "utf8");
assert.match(
  learnOverview,
  /const PINNED_FREE_LESSON_SLUGS = \[\s*"ai-website-vibe-design",\s*"client-website-figma-codex",\s*"figma-to-codex-website",\s*\] as const;/,
  "Learn overview must keep exactly the three reviewed free lessons in the requested order",
);
assert.match(learnOverview, /const lessons = pinnedFreeLessons\.filter/, "Learn overview filters must stay limited to the pinned free lessons");

const paths = readFileSync(join(root, "src/i18n/paths.ts"), "utf8");
assert.match(paths, /LEARN_LESSON_SLUGS/, "LocalizedLink must know public Learn lesson siblings");
assert.match(paths, /LEARN_FIND_SLUGS/, "LocalizedLink must know public Learn Finds siblings");
assert.match(paths, /\/learn\/lessons/, "LocalizedLink must know the free-lesson catalog sibling");

const seoRoutes = readFileSync(join(root, "scripts/seo-routes.ts"), "utf8");
assert.match(seoRoutes, /learnHubRoute/, "SEO manifest must register the public Learn hub");
assert.match(seoRoutes, /learnLessonsCatalogRoute/, "SEO manifest must register the complete free-lesson catalog");
assert.match(seoRoutes, /buildLearnLessonRoute/, "SEO manifest must register public Learn lesson pages");
assert.match(seoRoutes, /buildLearnFindRoute/, "SEO manifest must register public Learn Finds pages");
assert.match(seoRoutes, /LearningResource/, "Learn lesson schema must expose LearningResource");
assert.match(seoRoutes, /VideoObject/, "Learn lesson schema must expose VideoObject");

const learnFinds = readFileSync(join(root, "src/content/space/learnFinds.generated.json"), "utf8");
assert.match(learnFinds, /ideogram-mcp-claude-code/, "Learn Finds seed content must include the Ideogram MCP find");
assert.match(learnFinds, /figma-claude-code-ui-design/, "Learn Finds seed content must include the Figma Claude Code find");
assert.match(learnFinds, /claude-skills-ai-ugc-pipeline/, "Learn Finds seed content must include the Claude Skills UGC find");

const learnFindDetail = readFileSync(join(root, "src/app/pages/space/LearnFindDetailPage.tsx"), "utf8");
assert.match(learnFindDetail, /getLearnFindSummary/, "Learn Find detail page must render short summaries");
assert.match(learnFindDetail, /getLearnFindTakeaways/, "Learn Find detail page must render extracted takeaways");
assert.match(learnFindDetail, /getLearnFindRisks/, "Learn Find detail page must render risks");
assert.match(learnFindDetail, /youtube-nocookie\.com\/embed/, "Learn Find detail page must embed the original YouTube video");
assert.doesNotMatch(learnFindDetail, /LessonAuthor|AuthorSocialLinks|UnlockProCard/, "Learn Find detail must not render the Opten lesson author or Pro sidebar cards");

const header = readFileSync(join(root, "src/app/components/space/SpaceHeader.tsx"), "utf8");
assert.match(header, /useSpaceAuth/, "Learn header must read account state from SpaceAuthProvider");
assert.match(header, /opten_space_session_v1|account\.remaining|remaining/, "Learn header must render real account credits instead of a hardcoded placeholder");
assert.doesNotMatch(header, /!\s*learnOnly\s*&&\s*\(/, "Learn header must not hide credits/account in learnOnly mode");
assert.match(header, /max-w-\[1200px\]/, "Space header content must use the shared 1200px content width");
assert.match(header, /label: "Learn"[\s\S]*to: "\/learn"[\s\S]*label: "Extension"[\s\S]*to: "\/"[\s\S]*label: "Library"[\s\S]*to: "\/prompt-library"/, "Space header nav must advertise Learn plus Extension and Library links");
assert.doesNotMatch(header, /label: "Create"|label: "Explore"|label: "Your Prompt"/, "Space header nav must not show placeholder Create, Explore, or Your Prompt tabs in the first Learn pass");
assert.doesNotMatch(header, /256\/300/, "Space header must not hardcode the credits placeholder");

const auth = readFileSync(join(root, "src/lib/optenAuth.ts"), "utf8");
assert.match(auth, /SUPABASE_URL = "https:\/\/supabase\.opten\.space"/, "Website auth must use self-hosted Supabase");
assert.match(auth, /account-summary/, "Website auth must fetch account-summary for credits");
assert.match(auth, /opten_space_session_v1/, "Website auth must store app session under the app-specific key");
assert.doesNotMatch(auth, /SERVICE_ROLE|JWT_SECRET|YOOKASSA|PADDLE_API|ANTHROPIC/, "Website auth bundle must not reference backend secrets");

const learnComponents = readFileSync(join(root, "src/app/components/space/learn/LearnComponents.tsx"), "utf8");
assert.match(learnComponents, /max-w-\[1200px\]/, "Learn pages must use the shared 1200px content width");
assert.match(learnComponents, /\/learn/, "Learn links must use canonical /learn routes");
assert.doesNotMatch(learnComponents, /\/app\/learn/, "Learn components must not link to legacy /app/learn routes");
assert.match(learnComponents, /line-clamp-1 text-\[13px\]/, "Lesson card descriptions must clamp to one line");
assert.doesNotMatch(learnComponents, /section\.description/, "Learn overview section descriptions must not render");
assert.match(learnComponents, /text-\[14px\] text-white\/68/, "Lesson breadcrumbs must be 2px smaller than the original 16px");
assert.match(learnComponents, /grid-cols-\[minmax\(0,1fr\)_360px\]/, "Lesson detail layout must use the available left rail for a larger player");
assert.match(learnComponents, /pb-\[20px\] text-\[14px\] leading-\[1\.55\]/, "Lesson detail description must render at 14px");
assert.match(
  learnComponents,
  /const FREE_LESSON_COURSE_PROMO_SLUGS = \["lesson-14-codex", "lesson-16-nova-website"\] as const;/,
  "Every free lesson detail must promote exactly course lessons 14 and 16",
);
assert.match(learnComponents, /isFreeLessonPage \? freeLessonCoursePromoLessons/, "Free lesson details must use the fixed paid-course lesson pair");
assert.match(learnComponents, /collection\.purchase && !locked &&/, "Completion controls must stay limited to purchased-course lesson pages");
assert.doesNotMatch(learnComponents, /copy\.singleLesson/, "Free lesson details must not render the redundant single-lesson label");
assert.match(learnComponents, /copy\.aiTraining/, "Free lesson recommendations must use the AI training heading");
assert.match(learnComponents, /copy\.viewAllCourse/, "Free lesson recommendations must link to the complete course");
assert.doesNotMatch(learnComponents, /No media is generated in Opten Space/, "Temporary media disclaimer must not be visible in the lesson detail");
assert.doesNotMatch(learnComponents, /Author updates|Topics covered/, "Temporary detail sidebar sections must stay out of the first Learn pass");

console.log("Space Learn integration artifacts are present.");
