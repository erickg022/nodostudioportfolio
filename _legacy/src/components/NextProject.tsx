import Link from "next/link";
import type { Project } from "@/data/projects";
import { MediaSurface } from "@/components/MediaSurface";

export function NextProject({ project }: { project: Project }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <Link
        href={`/work/${project.slug}`}
        className="mx-auto grid max-w-[1800px] gap-6 border-t border-black/10 pt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:grid-cols-[0.7fr_1.3fr] md:items-end"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Next Project</p>
          <h2 className="mt-4 text-5xl uppercase leading-none text-neutral-950 sm:text-7xl">{project.title}</h2>
          <p className="mt-4 max-w-xl text-neutral-700">{project.shortDescription}</p>
        </div>
        <MediaSurface project={project} alt={project.heroMedia.alt} label={project.title} className="aspect-[16/7]" />
      </Link>
    </section>
  );
}
