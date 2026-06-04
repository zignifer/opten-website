export type LearnFilter = "All" | "Standalone" | "Prompt packs" | "Builder" | "Brand" | "Models";

export type LearnLessonStatus = "Available" | "In progress" | "Completed";

export type LearnAccess = "free" | "full-platform";

export type LearnAuthor = {
  name: string;
  initials: string;
  intro: string;
  note: string;
};

export type LearnVideoProviderMetadata = {
  provider: "future-provider-placeholder";
  providerAssetId: string;
  posterPath: string;
  playbackPolicy: "mock-preview" | "mock-preview-plus-gated-full";
  signedPlaybackUrl: null;
  notes: string;
};

export type LearnLesson = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  status: LearnLessonStatus;
  access: LearnAccess;
  previewAvailable?: boolean;
  fullAccessOnly?: boolean;
  thumbnailPath: string;
  author?: LearnAuthor;
  updatedAt?: string;
  releaseNote?: string;
  filters: LearnFilter[];
  topics: string[];
  whatYouWillLearn: string[];
  updatedNote: string;
  videoProvider?: LearnVideoProviderMetadata;
};

export type LearnCourse = {
  id: string;
  title: string;
  category: LearnFilter;
  description: string;
  lessons: LearnLesson[];
};

export type LearnOverviewSection = {
  id: string;
  title: string;
  metadata?: string;
  description: string;
  iconPath: string;
  lessons: LearnLesson[];
};

export type LearnCollection = {
  id: string;
  title: string;
  description: string;
  lessons: LearnLesson[];
};

export const learnFilters: LearnFilter[] = ["All", "Standalone", "Prompt packs", "Builder", "Brand", "Models"];

export const futureProtectedVideoDeliveryNote =
  "Future protected video delivery should use backend-issued signed short-lived playback URLs and a proper streaming/video provider, potentially HLS/DRM-capable if required. Do not claim frontend can make videos impossible to steal. Do not implement now.";

export const learnDefaultAuthor: LearnAuthor = {
  name: "Vladislav Voronezhtsev",
  initials: "VV",
  intro: "I build Opten workflows and turn real production patterns into short practical lessons.",
  note: "Expect prompt-pack walkthroughs, model notes, and compact updates when tools change.",
};

export const learnIntegrationTodos = {
  auth: "TODO: connect Opten auth/user database later to decide viewer identity and entitlement state.",
  subscription:
    "TODO: connect subscription/payment access later. Keep this frontend-only mock disconnected from checkout, billing, or payment APIs.",
  video:
    "TODO: connect a real streaming/video provider later using backend-issued signed short-lived playback URLs. Use HLS/DRM-capable delivery if product requirements need it.",
  contentManagement:
    "TODO: replace this local mock catalog with an owner upload/content management workflow when the product owner is ready.",
};

const templateAssetBase = "/assets/space/templates";

const standaloneLessons: LearnLesson[] = [
  {
    slug: "new-model-workflow-update",
    title: "New model workflow update",
    description: "Map a model release into the prompt-pack workflow without changing the product scope.",
    duration: "5 min",
    status: "Available",
    access: "free",
    thumbnailPath: `${templateAssetBase}/skincare-texture.jpg`,
    filters: ["Standalone", "Models"],
    topics: ["Model updates", "Prompt packs", "External AI tools"],
    whatYouWillLearn: [
      "Spot when a model change affects prompt wording",
      "Keep prompt packs model-specific",
      "Separate Opten prompts from external media creation",
    ],
    updatedNote: "Standalone updates are added when model behavior changes the workflow.",
  },
  {
    slug: "external-ai-tool-handoff",
    title: "External AI tool handoff",
    description: "Prepare prompt pack output for external image and video tools.",
    duration: "7 min",
    status: "Completed",
    access: "free",
    thumbnailPath: `${templateAssetBase}/cinematic-destination-reel.jpg`,
    filters: ["Standalone", "Models", "Prompt packs"],
    topics: ["External AI tools", "Model-specific prompts", "Copy workflow"],
    whatYouWillLearn: [
      "Copy only the prompt section needed for the next step",
      "Use selected model labels as handoff context",
      "Avoid implying Opten generates the final media",
    ],
    updatedNote: "Short standalone videos cover important handoff changes between full courses.",
  },
  {
    slug: "prompt-pack-teardown",
    title: "Prompt pack teardown",
    description: "Read a complete prompt pack and understand why each section exists.",
    duration: "9 min",
    status: "In progress",
    access: "free",
    thumbnailPath: `${templateAssetBase}/on-model-fashion-reel.jpg`,
    filters: ["Standalone", "Prompt packs"],
    topics: ["Prompt packs", "Model notes", "Consistency rules"],
    whatYouWillLearn: [
      "Identify source-image, video-motion, rules, and model-note sections",
      "Use brief fields to explain prompt wording",
      "Keep prompt packs compact enough to copy",
    ],
    updatedNote: "Teardowns are refreshed as the prompt-pack format changes.",
  },
];

export const learnCourses: LearnCourse[] = [
  {
    id: "prompt-pack-foundations",
    title: "Prompt Pack Foundations",
    category: "Prompt packs",
    description: "Image prompts, video prompts, rules, and model notes.",
    lessons: [
      {
        slug: "understand-prompt-packs",
        title: "Understand prompt packs",
        description: "Learn the structure of a model-ready prompt pack before using the Builder.",
        duration: "8 min",
        status: "Available",
        access: "free",
        thumbnailPath: `${templateAssetBase}/supplement-hero-shot.jpg`,
        filters: ["Prompt packs"],
        topics: ["Prompt packs", "Source image prompts", "Video motion prompts"],
        whatYouWillLearn: [
          "Read the core prompt-pack sections",
          "Know when a source-image prompt is included",
          "Use rules and model notes without adding extra workflows",
        ],
        updatedNote: "Foundation lessons are revised when the prompt-pack structure changes.",
      },
      {
        slug: "source-image-prompts",
        title: "Source image prompts",
        description: "Write source image prompts that prepare a clean first frame for external tools.",
        duration: "9 min",
        status: "In progress",
        access: "free",
        thumbnailPath: `${templateAssetBase}/premium-beauty-visuals.jpg`,
        filters: ["Prompt packs", "Models"],
        topics: ["Source image prompts", "Model-specific prompts", "External AI tools"],
        whatYouWillLearn: [
          "Write source-image wording for selected image models",
          "Keep visual details aligned with the brief",
          "Avoid text, logos, and extra overlays in prompt language",
        ],
        updatedNote: "Source-image guidance follows the current image-model defaults.",
      },
      {
        slug: "video-motion-prompts",
        title: "Video motion prompts",
        description: "Turn brief fields into motion instructions for selected video models.",
        duration: "10 min",
        status: "Completed",
        access: "full-platform",
        thumbnailPath: `${templateAssetBase}/athlete-action-shot.jpg`,
        filters: ["Prompt packs", "Models"],
        topics: ["Video motion prompts", "Model-specific prompts", "Motion language"],
        whatYouWillLearn: [
          "Describe motion instead of static styling only",
          "Reference uploaded images only when the flow uses an image",
          "Keep model notes attached to the prompt pack",
        ],
        updatedNote: "Motion lessons update when video model behavior changes.",
      },
      {
        slug: "consistency-rules-and-model-notes",
        title: "Consistency rules and model notes",
        description: "Use consistency rules and notes to reduce surprises in external tools.",
        duration: "6 min",
        status: "Completed",
        access: "full-platform",
        thumbnailPath: `${templateAssetBase}/outfit-transition-video.jpg`,
        filters: ["Prompt packs", "Brand", "Models"],
        topics: ["Consistency rules", "Brand context", "Model notes"],
        whatYouWillLearn: [
          "Prioritize product, outfit, color, and style consistency",
          "Add brand context without adding new account workflows",
          "Read model notes before copying prompts externally",
        ],
        updatedNote: "Notes are refreshed as Opten workflows and model defaults change.",
      },
    ],
  },
  {
    id: "builder-workflow",
    title: "Builder Workflow",
    category: "Builder",
    description: "Create model-ready prompt packs from a compact brief.",
    lessons: [
      {
        slug: "builder-overview",
        title: "Builder overview",
        description: "Walk through the Builder sections and the one-way prompt-pack flow.",
        duration: "6 min",
        status: "Completed",
        access: "free",
        thumbnailPath: `${templateAssetBase}/on-model-fashion-reel.jpg`,
        filters: ["Builder", "Prompt packs"],
        topics: ["Builder workflow", "Prompt packs", "Brief fields"],
        whatYouWillLearn: [
          "Move from Prompt Library to Builder to Ready",
          "Understand how default brief fields seed a prompt pack",
          "Keep Ready read-only after creating the pack",
        ],
        updatedNote: "Builder overview reflects the current MVP one-way flow.",
      },
      {
        slug: "create-your-first-prompt-pack",
        title: "Create your first prompt pack",
        description: "Fill a compact Builder brief and create model-ready prompts for selected external AI tools.",
        duration: "12 min",
        status: "In progress",
        access: "full-platform",
        thumbnailPath: `${templateAssetBase}/outfit-transition-video.jpg`,
        filters: ["Builder", "Prompt packs", "Models"],
        topics: ["Builder workflow", "Prompt packs", "External AI tools", "Model-specific prompts"],
        whatYouWillLearn: [
          "Fill the minimum Builder brief",
          "Select source image and video models",
          "Create model-ready prompts",
          "Copy prompts into external AI tools",
        ],
        updatedNote: "Lessons are refreshed as models and AI tools change.",
      },
      {
        slug: "choose-starting-points",
        title: "Choose starting points",
        description: "Pick the right source-first, image-to-video, product-photo, or text-to-video flow.",
        duration: "7 min",
        status: "Available",
        access: "free",
        thumbnailPath: `${templateAssetBase}/meme-skit-prompt-pack.jpg`,
        filters: ["Builder", "Prompt packs"],
        topics: ["Starting points", "Builder workflow", "Prompt sections"],
        whatYouWillLearn: [
          "Choose the correct Builder starting point",
          "Know when the source-image prompt is omitted",
          "Keep no-source flows free of image-upload wording",
        ],
        updatedNote: "Starting point guidance follows the approved conditional-flow matrix.",
      },
      {
        slug: "copy-prompts-into-external-tools",
        title: "Copy prompts into external tools",
        description: "Use image and video prompt sections outside Opten Space without adding extra steps.",
        duration: "7 min",
        status: "Completed",
        access: "full-platform",
        thumbnailPath: `${templateAssetBase}/hotel-campaign.jpg`,
        filters: ["Builder", "Prompt packs", "Models"],
        topics: ["Copy workflow", "External AI tools", "Model-specific prompts"],
        whatYouWillLearn: [
          "Copy image prompts only when the flow includes them",
          "Copy video prompts for the selected video model",
          "Stay within the MVP copy workflow",
        ],
        updatedNote: "Copy workflow lessons update when Ready screen behavior changes.",
      },
      {
        slug: "review-model-notes",
        title: "Review model notes",
        description: "Read model notes before using prompts in selected external tools.",
        duration: "8 min",
        status: "Completed",
        access: "full-platform",
        thumbnailPath: `${templateAssetBase}/performance-product-ad.jpg`,
        filters: ["Builder", "Brand", "Models"],
        topics: ["Model notes", "Brand context", "External AI tools"],
        whatYouWillLearn: [
          "Use model notes to set expectations",
          "Carry brand context into prompt wording",
          "Keep the prompt pack model-specific",
        ],
        updatedNote: "Model notes are revised when selected-model guidance changes.",
      },
    ],
  },
];

const standaloneCollection: LearnCollection = {
  id: "standalone-videos",
  title: "Standalone videos",
  description: "Short updates and experiments outside any course.",
  lessons: standaloneLessons,
};

const collections: LearnCollection[] = [
  standaloneCollection,
  ...learnCourses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    lessons: course.lessons,
  })),
];

export const learnOverviewBaseSections: LearnOverviewSection[] = [
  {
    id: standaloneCollection.id,
    title: standaloneCollection.title,
    description: standaloneCollection.description,
    iconPath: "/assets/space/figma/header-atoms/icon-explore.svg",
    lessons: standaloneCollection.lessons,
  },
  ...learnCourses.map((course) => ({
    id: course.id,
    title: course.title,
    metadata: `${course.lessons.length} lessons`,
    description: course.description,
    iconPath:
      course.id === "prompt-pack-foundations"
        ? "/assets/space/figma/prompt-stack.svg"
        : "/assets/space/figma/header-atoms/icon-create.svg",
    lessons: course.lessons.slice(0, course.id === "prompt-pack-foundations" ? 3 : 4),
  })),
];

export function getLearnOverviewSections(query: string, activeFilter: LearnFilter): LearnOverviewSection[] {
  const normalizedQuery = query.trim().toLowerCase();
  return learnOverviewBaseSections
    .map((section) => ({
      ...section,
      lessons: section.lessons.filter((lesson) => lessonMatches(lesson, normalizedQuery, activeFilter)),
    }))
    .filter((section) => section.lessons.length > 0);
}

export function findLearnLesson(slug: string | undefined): LearnLesson | undefined {
  if (!slug) return undefined;
  return collections.flatMap((collection) => collection.lessons).find((lesson) => lesson.slug === slug);
}

export function getLearnCollectionForLesson(slug: string): LearnCollection | undefined {
  return collections.find((collection) => collection.lessons.some((lesson) => lesson.slug === slug));
}

export function getAdjacentLearnLessons(slug: string) {
  const collection = getLearnCollectionForLesson(slug);
  if (!collection) return { previousLesson: undefined, nextLesson: undefined };
  const index = collection.lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previousLesson: index > 0 ? collection.lessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < collection.lessons.length - 1 ? collection.lessons[index + 1] : undefined,
  };
}

export function getLessonPosition(slug: string) {
  const collection = getLearnCollectionForLesson(slug);
  if (!collection) return "";
  const index = collection.lessons.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) return "";
  return `Lesson ${index + 1} of ${collection.lessons.length}`;
}

export function getLearnLessonAuthor(lesson: LearnLesson) {
  return lesson.author ?? learnDefaultAuthor;
}

export function getLearnLessonReleaseNote(lesson: LearnLesson) {
  return lesson.releaseNote ?? lesson.updatedNote;
}

export function getLearnLessonUpdatedAt(lesson: LearnLesson) {
  return lesson.updatedAt ?? "2026-06-04";
}

export function getLearnLessonVideoProvider(lesson: LearnLesson): LearnVideoProviderMetadata {
  return (
    lesson.videoProvider ?? {
      provider: "future-provider-placeholder",
      providerAssetId: `todo-${lesson.slug}`,
      posterPath: lesson.thumbnailPath,
      playbackPolicy: lesson.access === "full-platform" ? "mock-preview-plus-gated-full" : "mock-preview",
      signedPlaybackUrl: null,
      notes: futureProtectedVideoDeliveryNote,
    }
  );
}

function lessonMatches(lesson: LearnLesson, normalizedQuery: string, activeFilter: LearnFilter) {
  const filterMatch = activeFilter === "All" || lesson.filters.includes(activeFilter);
  const queryMatch =
    !normalizedQuery ||
    `${lesson.title} ${lesson.description} ${lesson.topics.join(" ")} ${lesson.status}`.toLowerCase().includes(normalizedQuery);
  return filterMatch && queryMatch;
}
