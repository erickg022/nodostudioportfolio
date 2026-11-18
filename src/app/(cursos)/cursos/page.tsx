import { CoursesPage } from "@/components/cursos/CoursesPage";
import { courses, coursesSettings, wheelMedia } from "@/content/courses";

export default function Page() {
  return <CoursesPage courses={courses} settings={coursesSettings} wheel={wheelMedia} />;
}
