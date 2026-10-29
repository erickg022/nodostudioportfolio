"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";
import { MediaSurface } from "@/components/MediaSurface";

type PreviewState = {
  project: Project;
  x: number;
  y: number;
} | null;

export function useCursorPreview() {
  const [preview, setPreview] = useState<PreviewState>(null);
  const [enabled] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  return {
    preview: enabled ? preview : null,
    bindPreview: (project: Project) => ({
      onMouseEnter: (event: MouseEvent) => setPreview({ project, x: event.clientX, y: event.clientY }),
      onMouseMove: (event: MouseEvent) => setPreview({ project, x: event.clientX, y: event.clientY }),
      onMouseLeave: () => setPreview(null),
    }),
    closePreview: () => setPreview(null),
  };
}

export function CursorMediaPreview({ preview }: { preview: PreviewState }) {
  if (!preview) return null;

  return (
    <div
      className="pointer-events-none fixed z-[70] hidden w-[min(34vw,520px)] translate-x-6 translate-y-6 md:block"
      style={{ left: preview.x, top: preview.y }}
      aria-hidden="true"
    >
      <MediaSurface
        project={preview.project}
        src={preview.project.heroMedia.src}
        type={preview.project.heroMedia.type}
        poster={preview.project.heroMedia.poster}
        muxPlaybackId={preview.project.heroMedia.muxPlaybackId}
        alt=""
        label={preview.project.title}
        className="aspect-[16/10] shadow-2xl shadow-black/20"
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">
        <span>{preview.project.projectType}</span>
        <span>{preview.project.year}</span>
      </div>
    </div>
  );
}
