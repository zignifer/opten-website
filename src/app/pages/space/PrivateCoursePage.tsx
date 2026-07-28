import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router";
import { CourseIntroLayout, LessonDetailLayout } from "../../components/space/learn/LearnComponents";
import {
  findPrivateCourseLesson,
  getAdjacentPrivateCourseLessons,
  getPrivateCourseCollection,
  privateCourseHiddenIntroLesson,
  privateCourseIntroContent,
} from "../../../content/space/privateCourse";
import {
  HIDDEN_INTRO_SLUG,
  HIDDEN_INTRO_TELEGRAM_URL,
} from "../../../content/space/courseDiscountClaim";
import { getLearnLessonTitle } from "../../../content/space/learn";
import { useLang } from "../../../i18n/LangContext";
import {
  readCourseDiscountClaimTokenFromSearch,
  readStoredCourseDiscountClaim,
  rememberCourseDiscountClaim,
} from "../../../lib/courseAccess";

export default function PrivateCoursePage() {
  const { courseSlug, lessonSlug } = useParams();
  const location = useLocation();
  const { lang } = useLang();
  const collection = getPrivateCourseCollection(courseSlug);
  const isHiddenIntro = lessonSlug === HIDDEN_INTRO_SLUG;
  const lesson = isHiddenIntro
    ? privateCourseHiddenIntroLesson
    : findPrivateCourseLesson(courseSlug, lessonSlug);
  const pageTitle = !lessonSlug
    ? `${privateCourseIntroContent.title[lang]} — Opten course`
    : lesson
      ? `${getLearnLessonTitle(lesson, lang)} — Opten course`
      : "Opten private course";
  const discountClaimToken =
    readCourseDiscountClaimTokenFromSearch(location.search)
    ?? readStoredCourseDiscountClaim();

  useNoIndexPrivateCourse(pageTitle);
  useRememberCourseDiscountClaim(Boolean(collection), discountClaimToken);

  if (!collection) {
    return <Navigate to="/learn" replace />;
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
      telegramHiddenIntro={isHiddenIntro ? {
        claimToken: discountClaimToken,
        unlockUrl: HIDDEN_INTRO_TELEGRAM_URL,
      } : undefined}
    />
  );
}

function useRememberCourseDiscountClaim(active: boolean, discountClaimToken: string | null) {
  useEffect(() => {
    if (!active || !discountClaimToken) return;
    rememberCourseDiscountClaim(discountClaimToken);
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
