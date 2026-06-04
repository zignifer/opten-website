import { Navigate, useParams } from "react-router";
import { LessonDetailLayout } from "../../components/space/learn/LearnComponents";
import { findLearnLesson, getAdjacentLearnLessons, getLearnCollectionForLesson } from "../../../content/space/learn";

export default function LessonDetailPage() {
  const { lessonSlug } = useParams();
  const lesson = findLearnLesson(lessonSlug);

  if (!lesson) return <Navigate to="/app/learn" replace />;

  const collection = getLearnCollectionForLesson(lesson.slug);
  if (!collection) return <Navigate to="/app/learn" replace />;

  const { previousLesson, nextLesson } = getAdjacentLearnLessons(lesson.slug);

  return <LessonDetailLayout lesson={lesson} collection={collection} previousLesson={previousLesson} nextLesson={nextLesson} />;
}
