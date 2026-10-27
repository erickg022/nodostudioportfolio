"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { ProjectDetail } from "@/components/ProjectDetail";

type ProjectOverlayProps = {
  project: Project | null;
  total: number;
  previous?: Project;
  next?: Project;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
};

export function ProjectOverlay({ project, total, previous, next, onClose, onSelectProject }: ProjectOverlayProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusFirst = () => {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      focusable?.[0]?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.setTimeout(focusFirst, 0);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project]);

  return (
    <AnimatePresence>
      {project ? (
        <m.div
          key={project.slug}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project dossier`}
          ref={panelRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-white"
        >
          <ProjectDetail
            project={project}
            total={total}
            previous={previous}
            next={next}
            onClose={onClose}
            onSelectProject={onSelectProject}
            isOverlay
          />
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
