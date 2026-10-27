import type { Project } from "@/data/projects";
import { MediaSurface } from "@/components/MediaSurface";

export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-[1800px]">
        <MediaSurface
          project={project}
          type={project.heroMedia.type}
          src={project.heroMedia.src}
          poster={project.heroMedia.poster}
          alt={project.heroMedia.alt}
          label={project.title}
          className="aspect-[16/11] min-h-[52vh] md:aspect-[16/8]"
          priority
        />
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_0.52fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--project-accent)]">
              {project.client} / {project.year}
            </p>
            <h1 className="mt-4 max-w-6xl text-6xl uppercase leading-none text-neutral-950 sm:text-8xl lg:text-9xl">
              {project.title}
            </h1>
          </div>
          <div className="self-end">
            <p className="text-2xl leading-tight text-neutral-950">{project.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.disciplines.map((discipline) => (
                <span
                  key={discipline}
                  className="border border-black/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-700"
                >
                  {discipline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
