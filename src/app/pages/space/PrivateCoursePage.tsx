import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { CourseIntroLayout, HiddenIntroPlaceholderLayout, LessonDetailLayout } from "../../components/space/learn/LearnComponents";
import {
  findPrivateCourseLesson,
  getAdjacentPrivateCourseLessons,
  getPrivateCourseCollection,
  privateCourseIntroContent,
} from "../../../content/space/privateCourse";
import { HIDDEN_INTRO_SLUG, HIDDEN_INTRO_VIDEO_ENABLED, getHiddenIntroCopy } from "../../../content/space/hiddenIntro";
import { getLearnLessonTitle } from "../../../content/space/learn";
import { useLang } from "../../../i18n/LangContext";

export default function PrivateCoursePage() {
  const { courseSlug, lessonSlug } = useParams();
  const { lang } = useLang();
  const collection = getPrivateCourseCollection(courseSlug);
  const lesson = findPrivateCourseLesson(courseSlug, lessonSlug);
  const isHiddenIntro = lessonSlug === HIDDEN_INTRO_SLUG;
  const pageTitle = isHiddenIntro
    ? `${getHiddenIntroCopy("title", lang)} — Opten course`
    : !lessonSlug
    ? `${privateCourseIntroContent.title[lang]} — Opten course`
    : lesson
      ? `${getLearnLessonTitle(lesson, lang)} — Opten course`
      : "Opten private course";

  useNoIndexPrivateCourse(pageTitle);

  if (!collection) {
    return <Navigate to="/learn" replace />;
  }

  if (!lessonSlug) {
    return <CourseIntroLayout collection={collection} intro={privateCourseIntroContent} />;
  }

  if (isHiddenIntro && !HIDDEN_INTRO_VIDEO_ENABLED) {
    return <HiddenIntroPlaceholderLayout collection={collection} />;
  }

  if (!lesson) {
    return <Navigate to="/learn" replace />;
  }

  const { previousLesson, nextLesson } = getAdjacentPrivateCourseLessons(courseSlug, lesson.slug);

  return <LessonDetailLayout lesson={lesson} collection={collection} previousLesson={previousLesson} nextLesson={nextLesson} />;
}

function useNoIndexPrivateCourse(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const existingMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existingMeta ?? document.createElement("meta");
    const previousContent = existingMeta?.getAttribute("content") ?? null;

    document.title = title;
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex,nofollow");
    if (!existingMeta) document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      if (!existingMeta) {
        robots.remove();
      } else if (previousContent !== null) {
        robots.setAttribute("content", previousContent);
      }
    };
  }, [title]);
}
