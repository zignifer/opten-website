import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

const requiredFiles = [
  "src/content/space/learn.ts",
  "src/content/space/learnSlugs.ts",
  "src/app/components/space/SpaceHeader.tsx",
  "src/app/components/space/SpaceAuthProvider.tsx",
  "src/app/components/space/learn/LearnComponents.tsx",
  "src/app/pages/space/AppIndexPage.tsx",
  "src/app/pages/space/AppLoginPage.tsx",
  "src/app/pages/space/AppAuthCallbackPage.tsx",
  "src/app/pages/space/LearnOverviewPage.tsx",
  "src/app/pages/space/LessonDetailPage.tsx",
  "src/lib/optenAuth.ts",
  "public/assets/space/figma/search.svg",
  "public/assets/space/figma/prompt-stack.svg",
  "public/assets/space/figma/header-atoms/logo-lockup.svg",
  "public/assets/space/templates/supplement-hero-shot.jpg",
  "public/assets/learn/video/actual-ai-tools-2026.mp4",
  "public/assets/learn/video/actual-ai-tools-2026-poster.jpg",
  "public/assets/learn/og/actual-ai-tools-2026.jpg",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing Space Learn artifact: ${file}`);
}

const main = readFileSync(join(root, "src/main.tsx"), "utf8");
assert.match(main, /\/app"/, "Main router must register /app");
assert.match(main, /\/app\/login"/, "Main router must register /app/login");
assert.match(main, /\/app\/auth\/callback"/, "Main router must register /app/auth/callback");
assert.match(main, /\/learn"/, "Main router must register public /learn");
assert.match(main, /\/learn\/:lessonSlug"/, "Main router must register public /learn/:lessonSlug");
assert.match(main, /\/en\/learn"/, "Main router must register public /en/learn");
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
assert.doesNotMatch(vercel, /"source": "\/learn(?::|\/)/, "Public /learn routes must not receive the app noindex header");

const content = readFileSync(join(root, "src/content/space/learn.ts"), "utf8");
assert.match(content, /export const learnFilters/, "Learn filters must be exported");
assert.match(content, /export const learnCourses/, "Learn courses must be exported");
assert.match(content, /actual-ai-tools-2026/, "Learn catalog must include the featured local video");
assert.match(content, /ai-avatar-motion-control/, "Learn catalog must include the AI avatar lesson");
assert.match(content, /junior-designer-1100-order/, "Learn catalog must include the junior designer order lesson");
assert.match(content, /client-website-navigation-hero/, "Learn catalog must include the client website lesson");
assert.match(content, /ai-marketplace-product-cards/, "Learn catalog must include the AI marketplace cards lesson");
assert.match(content, /web-design-references/, "Learn catalog must include the web design references lesson");
assert.match(content, /findLearnLesson/, "Learn detail lookup helper must be exported");
assert.match(content, /getAdjacentLearnLessons/, "Adjacent lesson navigation helper must be exported");

const paths = readFileSync(join(root, "src/i18n/paths.ts"), "utf8");
assert.match(paths, /LEARN_LESSON_SLUGS/, "LocalizedLink must know public Learn lesson siblings");

const seoRoutes = readFileSync(join(root, "scripts/seo-routes.ts"), "utf8");
assert.match(seoRoutes, /learnHubRoute/, "SEO manifest must register the public Learn hub");
assert.match(seoRoutes, /buildLearnLessonRoute/, "SEO manifest must register public Learn lesson pages");
assert.match(seoRoutes, /LearningResource/, "Learn lesson schema must expose LearningResource");
assert.match(seoRoutes, /VideoObject/, "Learn lesson schema must expose VideoObject");

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
assert.doesNotMatch(learnComponents, /No media is generated in Opten Space/, "Temporary media disclaimer must not be visible in the lesson detail");
assert.doesNotMatch(learnComponents, /Author updates|Topics covered/, "Temporary detail sidebar sections must stay out of the first Learn pass");

console.log("Space Learn integration artifacts are present.");
