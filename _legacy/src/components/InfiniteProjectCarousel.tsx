"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

const slideSize = "w-[78vw] md:w-[23vw]";

type InfiniteProjectCarouselProps = {
  projects: Project[];
  paused: boolean;
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
};

export function InfiniteProjectCarousel({ projects, paused, onOpen }: InfiniteProjectCarouselProps) {
  const repeated = [...projects, ...projects];
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const startPreview = (slug: string) => {
    clearResumeTimer();
    setPreviewSlug(slug);
  };

  const endPreview = () => {
    clearResumeTimer();
    setPreviewSlug(null);
  };

  const touchPreview = (slug: string) => {
    clearResumeTimer();
    setPreviewSlug(slug);
    resumeTimerRef.current = window.setTimeout(() => {
      setPreviewSlug(null);
      resumeTimerRef.current = null;
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="nodo-project-marquee relative -mx-4 shrink-0 overflow-hidden border-y border-black/10 bg-white py-1 sm:-mx-6">
      <div className="nodo-project-marquee-track flex w-max gap-1" data-paused={paused || previewSlug ? "true" : "false"}>
        {repeated.map((project, index) => (
          <ProjectCard
            key={`${project.slug}-${index}`}
            project={project}
            widthClass={slideSize}
            active={previewSlug === project.slug}
            onPreviewStart={startPreview}
            onPreviewEnd={endPreview}
            onTouchPreview={touchPreview}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
