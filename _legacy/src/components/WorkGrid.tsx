import type { Project } from "@/data/projects";
import { WorkCard } from "@/components/WorkCard";

const variants = ["wide", "portrait", "split", "compact", "split", "wide", "compact", "portrait"] as const;

export function WorkGrid({ projects, hrefBase = "/work" }: { projects: Project[]; hrefBase?: string }) {
  return (
    <div className="grid gap-x-4 gap-y-16 md:grid-cols-12">
      {projects.map((project, index) => (
        <WorkCard key={project.slug} project={project} variant={variants[index % variants.length]} hrefBase={hrefBase} />
      ))}
    </div>
  );
}
