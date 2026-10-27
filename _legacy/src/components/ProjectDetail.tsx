"use client";

import { m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { Project } from "@/data/projects";
import { MediaBlockRenderer, MediaSurface } from "@/components/MediaSurface";
import { ProjectResponseSection } from "@/components/ProjectResponseSection";
import { getProjectScrollSequence, ProjectScrollSequence } from "@/components/ProjectScrollSequence";

type ProjectDetailProps = {
  project: Project;
  total: number;
  previous?: Project;
  next?: Project;
  onClose?: () => void;
  onSelectProject?: (project: Project) => void;
  isOverlay?: boolean;
  hrefBase?: string;
  showResponse?: boolean;
};

export function ProjectDetail({
  project,
  total,
  previous,
  next,
  onClose,
  onSelectProject,
  isOverlay = false,
  hrefBase = "/work",
  showResponse = true,
}: ProjectDetailProps) {
  const router = useRouter();
  const hasScrollSequence = getProjectScrollSequence(project).length > 0;
  const navigateProject = useCallback(
    (target?: Project) => {
      if (!target) return;
      if (onSelectProject) {
        onSelectProject(target);
        return;
      }
      router.push(`${hrefBase}/${target.slug}`);
    },
    [hrefBase, onSelectProject, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateProject(previous);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateProject(next);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigateProject, next, previous]);

  return (
    <article className="min-h-screen bg-white text-neutral-950">
      <div className={isOverlay ? "pt-[var(--nav-height)]" : "pt-24"}>
        <div
          className={[
            "grid gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_340px]",
            hasScrollSequence ? "items-start" : "",
          ].join(" ")}
          style={{ minHeight: "calc(100svh - var(--nav-height))" }}
        >
          {hasScrollSequence ? (
            <m.div layoutId={`media-${project.slug}`} className="relative overflow-hidden border border-black/15">
              <ProjectScrollSequence project={project} />
            </m.div>
          ) : (
            <m.div layoutId={`media-${project.slug}`} className="relative min-h-[60vh] overflow-hidden border border-black/15 lg:min-h-[72vh]">
              <MediaSurface
                project={project}
                type={project.heroMedia.type}
                src={project.heroMedia.src}
                poster={project.heroMedia.poster}
                muxPlaybackId={project.heroMedia.muxPlaybackId}
                alt={project.heroMedia.alt}
                label={project.title}
                className="h-full w-full border-0"
                priority
              />
            </m.div>
          )}
          <aside
            className={[
              "flex flex-col justify-between border-y border-black/15 py-4",
              hasScrollSequence
                ? "lg:sticky lg:top-[calc(var(--nav-height)_+_1rem)] lg:h-[calc(100svh_-_var(--nav-height)_-_2rem)]"
                : "",
            ].join(" ")}
          >
            <div>
              <div className="flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                <span>{project.index} / {String(total).padStart(2, "0")}</span>
                <span>Selected work by NODO STUDIO</span>
              </div>
              <m.h1 layoutId={`title-${project.slug}`} className="mt-8 text-5xl font-black uppercase leading-[0.88] tracking-tight">
                {project.title}
              </m.h1>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em]">{project.subtitle}</p>
              <dl className="mt-10 space-y-5 font-mono text-[10px] uppercase tracking-[0.17em]">
                <Meta label="Year" value={project.year} />
                <Meta label="Type" value={project.type} />
                <Meta label="Status" value={project.status} />
                <Meta label="Disciplines" value={project.disciplineText} />
              </dl>
              <ProjectDescription text={project.description} />
            </div>
            <div className="mt-10 grid gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
              <div className="flex justify-between gap-3">
                {previous ? (
                  <button type="button" onClick={() => navigateProject(previous)} className="underline-offset-4 hover:underline">
                    Previous
                  </button>
                ) : null}
                {next ? (
                  <button type="button" onClick={() => navigateProject(next)} className="ml-auto underline-offset-4 hover:underline">
                    Next
                  </button>
                ) : null}
              </div>
              {onClose ? (
                <button type="button" onClick={onClose} className="border border-black/20 px-3 py-3 text-left hover:border-black">
                  Close / Esc
                </button>
              ) : null}
            </div>
          </aside>
        </div>

        {showResponse ? <ProjectResponseSection project={project} /> : null}

        {project.mediaBlocks.length && !hasScrollSequence ? (
          <div className="pb-16">
            {project.mediaBlocks.map((block, index) => (
              <MediaBlockRenderer key={`${block.type}-${index}`} block={block} project={project} />
            ))}
          </div>
        ) : null}

        <section className="px-4 pb-16 sm:px-6 md:pb-28">
          {!project.mediaBlocks.length && !hasScrollSequence ? (
            <MediaSurface
              project={project}
              type={project.heroMedia.type}
              src={project.heroMedia.src}
              poster={project.heroMedia.poster}
              muxPlaybackId={project.heroMedia.muxPlaybackId}
              alt={project.heroMedia.alt}
              label={project.title}
              className="aspect-[16/9] border border-black/15"
            />
          ) : null}
        </section>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="mt-1 text-neutral-950">{value}</dd>
    </div>
  );
}

function ProjectDescription({ text }: { text: string }) {
  return (
    <div className="project-description mt-8 text-[15px] font-normal leading-[1.42] tracking-[-0.01em] text-neutral-800">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
