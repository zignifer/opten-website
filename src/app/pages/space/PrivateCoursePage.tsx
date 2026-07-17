import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router";
import { CourseIntroLayout, LessonDetailLayout } from "../../components/space/learn/LearnComponents";
import {
  PRIVATE_COURSE_FIRST_LESSON_SLUG,
  findPrivateCourseLesson,
  getAdjacentPrivateCourseLessons,
  getPrivateCourseCollection,
  privateCourseIntroContent,
} from "../../../content/space/privateCourse";
import { LEGACY_HIDDEN_INTRO_SLUG } from "../../../content/space/courseDiscountClaim";
import { getLearnLessonTitle } from "../../../content/space/learn";
import { useLang } from "../../../i18n/LangContext";
import {
  readCourseDiscountClaimTokenFromSearch,
  rememberCourseDiscountClaim,
  reportCourseDiscountClaimOpened,
} from "../../../lib/courseAccess";

export default function PrivateCoursePage() {
  const { courseSlug, lessonSlug } = useParams();
  const location = useLocation();
  const { lang } = useLang();
  const collection = getPrivateCourseCollection(courseSlug);
  const lesson = findPrivateCourseLesson(courseSlug, lessonSlug);
  const isLegacyHiddenIntro = lessonSlug === LEGACY_HIDDEN_INTRO_SLUG;
  const pageTitle = !lessonSlug || isLegacyHiddenIntro
    ? `${privateCourseIntroContent.title[lang]} — Opten course`
    : lesson
      ? `${getLearnLessonTitle(lesson, lang)} — Opten course`
      : "Opten private course";
  const discountClaimToken = readCourseDiscountClaimTokenFromSearch(location.search);

  useNoIndexPrivateCourse(pageTitle);
  useRememberCourseDiscountClaim(Boolean(collection), discountClaimToken);

  if (!collection) {
    return <Navigate to="/learn" replace />;
  }

  if (isLegacyHiddenIntro) {
    const routeBase = collection.routeBasePath?.[lang] ?? `/learn/courses/${collection.id}`;
    return <Navigate to={`${routeBase}/${PRIVATE_COURSE_FIRST_LESSON_SLUG}${location.search}`} replace />;
  }

  if (!lessonSlug) {
    return <CourseIntroLayout collection={collection} intro={privateCourseIntroContent} />;
  }

  if (!lesson) {
    return <Navigate to="/learn" replace />;
  }

  const { previousLesson, nextLesson } = getAdjacentPrivateCourseLessons(courseSlug, lesson.slug);

  return (
    <LessonDetailLayout
      lesson={lesson}
      collection={collection}
      previousLesson={previousLesson}
      nextLesson={nextLesson}
    />
  );
}

function useRememberCourseDiscountClaim(active: boolean, discountClaimToken: string | null) {
  useEffect(() => {
    if (!active || !discountClaimToken) return;
    rememberCourseDiscountClaim(discountClaimToken);
    void reportCourseDiscountClaimOpened(discountClaimToken);
  }, [active, discountClaimToken]);
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
