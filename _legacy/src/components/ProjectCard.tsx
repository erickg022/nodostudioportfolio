"use client";

import { m } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { ProjectMedia } from "@/components/ProjectMedia";

type ProjectCardProps = {
  project: Project;
  widthClass: string;
  active: boolean;
  onPreviewStart: (slug: string) => void;
  onPreviewEnd: () => void;
  onTouchPreview: (slug: string) => void;
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
};

function getProjectSignal(project: Project) {
  if (project.roles.includes("CGI / AI")) return "AI";
  if (project.disciplines.includes("MOTION")) return "MOTION";
  if (project.disciplines.includes("SPACE")) return "SPACE";
  if (project.disciplines.includes("SYSTEMS")) return "SYSTEM";
  return "IMAGE";
}

export function ProjectCard({
  project,
  widthClass,
  active,
  onPreviewStart,
  onPreviewEnd,
  onTouchPreview,
  onOpen,
}: ProjectCardProps) {
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const draggedRef = useRef(false);
  const touchPrimedRef = useRef(false);
  const signal = project.hoverCategory ?? getProjectSignal(project);

  return (
    <button
      type="button"
      onMouseEnter={() => onPreviewStart(project.slug)}
      onMouseLeave={() => onPreviewEnd()}
      onFocus={() => onPreviewStart(project.slug)}
      onBlur={() => onPreviewEnd()}
      onPointerDown={(event) => {
        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        draggedRef.current = false;
        if (event.pointerType === "touch") {
          onTouchPreview(project.slug);
        }
      }}
      onPointerMove={(event) => {
        if (Math.abs(event.clientX - startXRef.current) > 8 || Math.abs(event.clientY - startYRef.current) > 8) {
          draggedRef.current = true;
        }
      }}
      onPointerUp={(event) => {
        if (draggedRef.current) return;
        if (event.pointerType === "touch" && !touchPrimedRef.current) {
          touchPrimedRef.current = true;
          window.setTimeout(() => {
            touchPrimedRef.current = false;
          }, 2400);
          return;
        }
        onOpen(project, event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(project, event.currentTarget);
        }
      }}
      className={`group relative h-[190px] shrink-0 cursor-pointer touch-pan-y overflow-visible bg-transparent pt-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:h-[220px] md:h-[260px] ${widthClass}`}
      aria-label={`Open project ${project.title}`}
    >
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 z-10 flex translate-y-1 items-center justify-between px-0 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-950 opacity-0 transition duration-200",
          active ? "translate-y-0 opacity-100" : "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        ].join(" ")}
      >
        <span className="max-w-[42%] truncate">{project.title}</span>
        <span className="max-w-[58%] truncate text-right">{signal}</span>
      </div>

      <m.div layoutId={`media-${project.slug}`} className="relative h-full overflow-hidden bg-[#e6e1d7]">
        <div className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]">
          <ProjectMedia project={project} className="h-full w-full" cleanPlaceholder />
        </div>
      </m.div>
    </button>
  );
}
