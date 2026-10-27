"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { Project } from "@/data/projects";
import { MediaSurface } from "@/components/MediaSurface";
import { cn, projectIndex } from "@/lib/utils";

type WorkCardProps = {
  project: Project;
  variant?: "wide" | "portrait" | "split" | "compact";
  hrefBase?: string;
  previewHandlers?: {
    onMouseEnter: (event: MouseEvent) => void;
    onMouseMove: (event: MouseEvent) => void;
    onMouseLeave: () => void;
  };
};

export function WorkCard({ project, variant = "compact", hrefBase = "/work", previewHandlers }: WorkCardProps) {
  const [open, setOpen] = useState(false);
  const useStillCover = project.slug === "beefeater-light";

  return (
    <article
      style={{ "--project-accent": project.accentColor } as CSSProperties}
      className={cn(
        "group relative",
        variant === "wide" && "md:col-span-7",
        variant === "portrait" && "md:col-span-4",
        variant === "split" && "md:col-span-5",
        variant === "compact" && "md:col-span-3",
      )}
      {...previewHandlers}
    >
      <Link
        href={`${hrefBase}/${project.slug}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        <MediaSurface
          project={project}
          type={useStillCover ? "image" : project.heroMedia.type}
          src={useStillCover ? project.coverImage : project.heroMedia.src}
          poster={useStillCover ? undefined : project.heroMedia.poster}
          muxPlaybackId={useStillCover ? undefined : project.heroMedia.muxPlaybackId}
          alt={useStillCover ? "Beefeater Light campaign cover showing a divided London guard" : project.heroMedia.alt}
          label={project.title}
          className={cn(
            "mb-4",
            variant === "wide" && "aspect-[16/8]",
            variant === "portrait" && "aspect-[4/5]",
            variant === "split" && "aspect-[5/4]",
            variant === "compact" && "aspect-[4/3]",
          )}
        />
        <div className="grid gap-3 border-t border-black/10 pt-3 md:grid-cols-[auto_1fr]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--project-accent)]">
            {projectIndex(project)}
          </span>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl uppercase leading-none text-neutral-950 sm:text-3xl">{project.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{project.year}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">{project.shortDescription}</p>
            <div className="mt-4 grid gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 sm:grid-cols-2">
              <span>{project.disciplines.join(" / ")}</span>
              <span>{project.roles.join(" / ")}</span>
            </div>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="mt-3 border border-black/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 transition hover:border-black/35 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:hidden"
      >
        Preview media
      </button>
      {open ? (
        <MediaSurface
          project={project}
          type={useStillCover ? "image" : project.heroMedia.type}
          src={useStillCover ? project.coverImage : project.heroMedia.src}
          poster={useStillCover ? undefined : project.heroMedia.poster}
          muxPlaybackId={useStillCover ? undefined : project.heroMedia.muxPlaybackId}
          alt={useStillCover ? "Beefeater Light campaign cover showing a divided London guard" : project.heroMedia.alt}
          label={`${project.title} mobile preview`}
          className="mt-3 aspect-[16/10] md:hidden"
        />
      ) : null}
    </article>
  );
}
