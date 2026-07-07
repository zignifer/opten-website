export const KINESCOPE_COURSE_SLUG = "ai-content-marketing-2026";
export const KINESCOPE_HIDDEN_INTRO_LESSON_SLUG = "hidden-intro";
export const KINESCOPE_PLAYBACK_AUDIENCE = "opten-kinescope-course-playback";
export const KINESCOPE_PLAYBACK_ISSUER = "https://opten.space";
export const KINESCOPE_PLAYBACK_TTL_SECONDS = 15 * 60;

export type KinescopeCourseLesson = {
  courseSlug: string;
  lessonSlug: string;
  videoId: string;
};

export const KINESCOPE_COURSE_LESSONS: KinescopeCourseLesson[] = [
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: KINESCOPE_HIDDEN_INTRO_LESSON_SLUG,
    videoId: "e0cd3bcd-bf94-4240-ad53-445d1c796f7c",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-1-prompting",
    videoId: "e941e14d-c5bf-40fc-abe5-a41e247777cf",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-2-ai-services",
    videoId: "c3b06c01-19dd-4a3c-8218-7a216a2ebd67",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-3-logo-generation",
    videoId: "947a68e0-b570-4a9d-ad0c-ee55cc86b440",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-4-photo-generation",
    videoId: "1fe7af11-23e5-46cf-bedf-e6bb41c2d3b3",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-5-references",
    videoId: "02bcf12a-ab7c-49d4-96cb-441fafb898b9",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-6-image-editing",
    videoId: "a6294ef7-c6e6-4744-8b2e-60967fa7bfd7",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-7-ai-video",
    videoId: "18f00246-366f-4f43-a67a-a1b3ead807c0",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-8-frames",
    videoId: "43d3328a-dc4d-4e60-a269-aa1eebf7e2b4",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-9-storytelling",
    videoId: "6f742d8c-cf18-4b9d-97b7-b3e6f63aa696",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-10-prompt-library",
    videoId: "3675dfeb-55da-47c3-aac8-35b0556dbd84",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-11-ai-avatars",
    videoId: "602d64ae-48ab-4730-a4fc-81b4d9677c14",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-12-motion-control",
    videoId: "d01c3455-92fe-4ffa-b878-d367211cfb5a",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-13-upscale",
    videoId: "c8494fb4-b8cf-4b4e-b6e8-7b43aebd9189",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-14-codex",
    videoId: "7a62c38c-b75d-4777-8ee8-74c81eda7a18",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-15-higgsfield-mcp",
    videoId: "54757622-4f97-4d8f-a97e-1f95ac2561f1",
  },
  {
    courseSlug: KINESCOPE_COURSE_SLUG,
    lessonSlug: "lesson-16-nova-website",
    videoId: "34992868-3dc1-416c-8438-d25ced15833a",
  },
];

export function findKinescopeCourseLesson(courseSlug: string | undefined, lessonSlug: string | undefined) {
  if (!courseSlug || !lessonSlug) return undefined;
  return KINESCOPE_COURSE_LESSONS.find((lesson) => lesson.courseSlug === courseSlug && lesson.lessonSlug === lessonSlug);
}

export function findKinescopeLessonByVideoId(videoId: string | undefined) {
  if (!videoId) return undefined;
  return KINESCOPE_COURSE_LESSONS.find((lesson) => lesson.videoId === videoId);
}

export function buildKinescopeEmbedUrl(videoId: string, drmAuthToken: string) {
  const url = new URL(`https://kinescope.io/embed/${videoId}`);
  url.searchParams.set("drmauthtoken", drmAuthToken);
  return url.toString();
}
