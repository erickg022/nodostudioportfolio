import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";

type ProjectMediaProps = {
  project: Project;
  priority?: boolean;
  className?: string;
  cleanPlaceholder?: boolean;
};

export function ProjectMedia({ project, priority = false, className = "", cleanPlaceholder = false }: ProjectMediaProps) {
  return (
    <div className={`relative overflow-hidden bg-[#ded7c8] ${className}`}>
      {project.coverVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.coverVideo.poster}
          aria-label={`${project.title} carousel video`}
        >
          {project.coverVideo.webmSrc ? <source src={project.coverVideo.webmSrc} type="video/webm" /> : null}
          <source src={project.coverVideo.src} type="video/mp4" />
        </video>
      ) : project.coverAvailable ? (
        <Image
          src={project.coverImage}
          alt={`${project.title} cover image`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 86vw, 46vw"
          className="object-cover"
        />
      ) : (
        <div className="nodo-media-placeholder absolute inset-0" style={{ "--project-accent": project.accentColor } as CSSProperties}>
          {!cleanPlaceholder ? (
            <>
              <div className="absolute inset-x-6 top-1/2 h-px bg-black/20" />
              <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px bg-black/20" />
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">
                Replace / {project.coverImage}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-800">
                <span>{project.type}</span>
                <span>{project.year}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                <span className="text-[clamp(2rem,5vw,5rem)] font-black uppercase leading-none tracking-tight text-neutral-950/80">
                  {project.title}
                </span>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
