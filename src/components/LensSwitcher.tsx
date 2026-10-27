"use client";

import { m } from "framer-motion";
import { useState } from "react";
import type { Discipline, Project } from "@/data/projects";
import { DISCIPLINES } from "@/data/projects";
import { MediaSurface } from "@/components/MediaSurface";
import { cn } from "@/lib/utils";

export function LensSwitcher({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Discipline>("IMAGE");
  const project = projects.find((item) => item.disciplines.includes(active)) ?? projects[0];

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] items-end gap-8 px-4 pb-8 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative z-10 max-w-6xl">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-600">
          Madrid / Available for selected collaborations / 2026
        </p>
        <h1 className="text-[clamp(4rem,14vw,15rem)] font-black uppercase leading-[0.78] tracking-normal text-neutral-950">
          Erick Garcia
          <br />
          de Anda
        </h1>
        <p className="mt-8 max-w-3xl text-2xl leading-tight text-neutral-950 sm:text-4xl">
          I build image systems, spatial experiences, and digital tools for brands, culture, and emerging media.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {DISCIPLINES.map((lens) => (
            <button
              key={lens}
              type="button"
              onMouseEnter={() => setActive(lens)}
              onFocus={() => setActive(lens)}
              onClick={() => setActive(lens)}
              className={cn(
                "border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]",
                active === lens
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-black/15 text-neutral-600 hover:border-black/40 hover:text-neutral-950",
              )}
            >
              {lens}
            </button>
          ))}
        </div>
      </div>
      <m.div
        key={project.slug}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-[42vh] lg:min-h-[72vh]"
      >
        <MediaSurface
          project={project}
          type={project.heroMedia.type}
          src={project.heroMedia.src}
          poster={project.heroMedia.poster}
          alt={project.heroMedia.alt}
          label={`${active} preview`}
          className="absolute inset-0"
          priority
        />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-950">
          <span>{project.title}</span>
          <span>{project.projectType}</span>
        </div>
      </m.div>
    </div>
  );
}
