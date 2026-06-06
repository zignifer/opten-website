import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { LessonDetailLayout } from "../../components/space/learn/LearnComponents";
import {
  findLearnTemplateLesson,
  getAdjacentLearnTemplateLessons,
  getLearnLessonTitle,
  getLearnTemplateCollection,
} from "../../../content/space/learn";
import { useLang } from "../../../i18n/LangContext";

export default function LearnTemplatePage() {
  const { templateKind, templateLessonSlug } = useParams();
  const { lang } = useLang();
  const collection = getLearnTemplateCollection(templateKind);
  const lesson = findLearnTemplateLesson(templateKind, templateLessonSlug);

  useNoIndexTemplatePage(lesson ? `${getLearnLessonTitle(lesson, lang)} — Learn template` : "Learn template");

  if (!collection || !lesson) {
    return <Navigate to={lang === "en" ? "/en/learn/templates/course" : "/learn/templates/course"} replace />;
  }

  const { previousLesson, nextLesson } = getAdjacentLearnTemplateLessons(templateKind, lesson.slug);

  return <LessonDetailLayout lesson={lesson} collection={collection} previousLesson={previousLesson} nextLesson={nextLesson} />;
}

function useNoIndexTemplatePage(title: string) {
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
