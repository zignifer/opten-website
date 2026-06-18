export const KINESCOPE_COURSE_SLUG = "ai-content-marketing-2026";
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
    lessonSlug: "lesson-1-prompting",
    videoId: "e941e14d-c5bf-40fc-abe5-a41e247777cf",
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
