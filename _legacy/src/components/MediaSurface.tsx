"use client";

import "@mux/mux-player";
import Image from "next/image";
import { createElement, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { MediaBlock, Project } from "@/data/projects";
import { cn, mediaGradient } from "@/lib/utils";

type MediaSurfaceProps = {
  project: Project;
  label?: string;
  src?: string;
  alt: string;
  type?: "image" | "video";
  poster?: string;
  muxPlaybackId?: string;
  className?: string;
  priority?: boolean;
};

export function MediaSurface({
  project,
  label,
  src,
  alt,
  type = "image",
  poster,
  muxPlaybackId,
  className,
  priority,
}: MediaSurfaceProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const muxStyle = { "--media-object-fit": "cover", "--media-object-position": "50% 50%" } as CSSProperties;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void node.play().catch(() => undefined);
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={cn("group relative overflow-hidden border border-black/10 bg-neutral-100", className)}>
      {src && type === "image" ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover transition duration-700 group-hover:scale-[1.025]"
        />
      ) : null}
      {muxPlaybackId && poster && type === "video" ? (
        <Image src={poster} alt="" fill sizes="(max-width: 768px) 100vw, 70vw" className="object-cover" aria-hidden="true" />
      ) : null}
      {muxPlaybackId && type === "video" ? (
        createElement("mux-player", {
          "playback-id": muxPlaybackId,
          "stream-type": "on-demand",
          autoplay: "muted",
          muted: true,
          loop: true,
          playsinline: true,
          preload: "metadata",
          poster,
          placeholder: poster,
          "aria-label": alt,
          className: "nodo-mux-player absolute inset-0 h-full w-full",
          style: muxStyle,
        })
      ) : null}
      {src && type === "video" && !muxPlaybackId ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      {!src && !muxPlaybackId ? (
        <div className="absolute inset-0 paper-grid" style={mediaGradient(project.accentColor)}>
          <div className="absolute inset-0 opacity-[0.14] scan-lines" />
          <div className="absolute inset-0 mix-blend-multiply opacity-[0.10] grain" />
          <div className="absolute inset-x-6 top-1/2 h-px bg-black/15" />
          <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px bg-black/15" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-950/75">
            <span>{label ?? "[ADD MEDIA HERE]"}</span>
            <span>{project.disciplines.join(" / ")}</span>
          </div>
          <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-950/60">
            No media assigned
          </div>
        </div>
      ) : null}
    </figure>
  );
}

export function MediaBlockRenderer({ block, project }: { block: MediaBlock; project: Project }) {
  if (block.type === "text") {
    return (
      <section className="mx-auto grid max-w-[1400px] gap-6 px-4 py-16 sm:px-6 md:grid-cols-[0.65fr_1.35fr] md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--project-accent)]">{block.eyebrow}</p>
        <div>
          <h2 className="max-w-4xl text-4xl uppercase leading-none text-neutral-950 sm:text-6xl">{block.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-700">{block.body}</p>
        </div>
      </section>
    );
  }

  if (block.type === "gallery") {
    const isStaggeredRight = block.variant === "staggered-right";

    return (
      <section className="mx-auto max-w-[1800px] px-4 pb-12 pt-20 sm:px-6 md:pb-16 md:pt-28">
        <div className="mb-10 ml-auto grid max-w-[min(720px,100%)] gap-3 border-t border-black/15 pt-5 text-right md:mb-12 md:grid-cols-[0.34fr_0.66fr]">
          <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-500">{block.label}</p>
          {block.caption ? (
            <p className="justify-self-end font-mono text-[7px] uppercase leading-relaxed tracking-[0.16em] text-neutral-600">
              {block.caption}
            </p>
          ) : null}
        </div>
        <div className={cn("grid gap-3", isStaggeredRight ? "md:grid-cols-12 md:gap-5" : "md:grid-cols-6")}>
          {block.items.map((item, index) => (
            <figure
              key={`${item.src}-${index}`}
              className={cn(
                "group relative overflow-hidden border border-black/10 bg-neutral-100",
                !isStaggeredRight && item.layout === "wide" && "aspect-[16/10] md:col-span-4",
                !isStaggeredRight && item.layout === "portrait" && "aspect-[4/5] md:col-span-2",
                !isStaggeredRight && item.layout === "square" && "aspect-square md:col-span-2",
                !isStaggeredRight && !item.layout && "aspect-[4/5] md:col-span-2",
                isStaggeredRight &&
                  cn(
                    "aspect-[4/5] md:col-span-4",
                    index % 3 === 0 && "md:col-start-4",
                    index % 3 === 1 && "md:col-start-7 md:-mt-16",
                    index % 3 === 2 && "md:col-start-5 md:-mt-8",
                  ),
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.025]"
              />
              {item.caption ? (
                <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#f4f1e8] mix-blend-difference">
                  {String(index + 1).padStart(2, "0")} / {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    );
  }

  const layout = block.layout ?? "wide";
  const hasCompanionImage = block.type === "video" && layout === "portrait" && Boolean(block.companionImage);

  if (hasCompanionImage && block.type === "video" && block.companionImage) {
    const companionPosition = block.companionImage.position ?? "right";
    const videoSurface = (
      <MediaSurface
        project={project}
        type={block.type}
        src={block.src}
        poster={block.poster}
        alt={block.alt}
        label={block.label}
        className={cn("portrait-video-surface", companionPosition === "right" ? "lg:justify-self-end" : "lg:justify-self-start")}
      />
    );
    const companionSurface = (
      <figure
        className={cn(
          "portrait-companion-surface group relative overflow-hidden border border-black/10 bg-neutral-100",
          companionPosition === "right" ? "lg:justify-self-start" : "lg:justify-self-end",
        )}
      >
        <Image
          src={block.companionImage.src}
          alt={block.companionImage.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 34vw"
          className="object-cover transition duration-700 group-hover:scale-[1.025]"
        />
        {block.companionImage.caption ? (
          <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#f4f1e8] mix-blend-difference">
            02 / {block.companionImage.caption}
          </figcaption>
        ) : null}
      </figure>
    );

    return (
      <section
        className={cn(
          "mx-auto grid max-w-[1500px] items-end gap-4 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[minmax(260px,0.72fr)_auto]",
          companionPosition === "right" && "lg:grid-cols-[auto_minmax(260px,0.72fr)]",
          companionPosition === "left" && "lg:pr-[10vw]",
        )}
      >
        {companionPosition === "left" ? companionSurface : videoSurface}
        {companionPosition === "left" ? videoSurface : companionSurface}
        {block.caption ? (
          <figcaption className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 lg:col-span-2">
            {block.caption}
          </figcaption>
        ) : null}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "mx-auto grid max-w-[1800px] gap-4 px-4 py-4 sm:px-6",
        block.type === "video" && layout === "portrait" && block.align === "right" && "justify-items-end pr-[8vw] md:pr-[12vw]",
        layout === "split" && "md:grid-cols-[1.2fr_0.8fr]",
        layout === "contact" && "md:grid-cols-2",
      )}
    >
      <MediaSurface
        project={project}
        type={block.type}
        src={block.src}
        poster={block.type === "video" ? block.poster : undefined}
        alt={block.alt}
        label={block.label}
        className={cn(
          !(block.type === "video" && layout === "portrait") && "min-h-[360px]",
          layout === "wide" && "aspect-[16/8]",
          block.type === "video" && layout === "portrait" && "portrait-video-surface",
          block.type !== "video" && layout === "portrait" && "mx-auto aspect-[9/16] w-full max-w-[min(680px,100%)]",
          layout === "split" && "aspect-[4/3]",
          layout === "contact" && "aspect-[5/4]",
        )}
      />
      {(layout === "split" || layout === "contact") && (
        <MediaSurface
          project={project}
          alt={block.alt}
          label={`${block.label} / alternate`}
          className={cn("min-h-[280px]", layout === "split" ? "aspect-[3/4]" : "aspect-[5/4]")}
        />
      )}
      {block.caption ? (
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 md:col-span-2">
          {block.caption}
        </figcaption>
      ) : null}
    </section>
  );
}
