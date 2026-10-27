"use client";

import type { Project } from "@/data/projects";

type ProjectScrollSequenceProps = {
  project: Project;
};

type ScrollSequenceItem = NonNullable<Project["scrollSequence"]>[number];
type SequenceLayout = NonNullable<ScrollSequenceItem["layout"]>;

function normalizeSequenceLayout(layout?: string): SequenceLayout | undefined {
  if (layout === "portrait" || layout === "wide" || layout === "square") return layout;
  return undefined;
}

export function getProjectScrollSequence(project: Project): ScrollSequenceItem[] {
  if (project.scrollSequence?.length) return project.scrollSequence;

  const sequence: ScrollSequenceItem[] = [];
  const seen = new Set<string>();

  const addItem = (item?: ScrollSequenceItem) => {
    if (!item?.src || seen.has(item.src)) return;
    seen.add(item.src);
    sequence.push(item);
  };

  addItem({
    type: project.heroMedia.type,
    src: project.heroMedia.src ?? "",
    poster: project.heroMedia.poster,
    alt: project.heroMedia.alt,
  });

  project.mediaBlocks.forEach((block) => {
    if (block.type === "image") {
      addItem({
        type: "image",
        src: block.src ?? "",
        alt: block.alt,
        layout: normalizeSequenceLayout(block.layout),
      });
    }

    if (block.type === "video") {
      addItem({
        type: "video",
        src: block.src ?? "",
        poster: block.poster,
        alt: block.alt,
      });

      if (block.companionImage) {
        addItem({
          type: "image",
          src: block.companionImage.src,
          alt: block.companionImage.alt,
          layout: "portrait",
        });
      }
    }

    if (block.type === "gallery") {
      block.items.forEach((item) => {
        addItem({
          type: "image",
          src: item.src,
          alt: item.alt,
          layout: normalizeSequenceLayout(item.layout),
        });
      });
    }
  });

  return sequence;
}

export function ProjectScrollSequence({ project }: ProjectScrollSequenceProps) {
  const sequence = getProjectScrollSequence(project);
  const frames = groupSequenceFrames(sequence, project.slug);
  const isLacoste = project.slug === "lacoste-roland-garros";
  const isEatNudes = project.slug === "eat-nudes";
  const isGdlMovilidad = project.slug === "gdl-movilidad";
  const isGinebra = project.slug === "ginebra";
  const isAxeCeremonia = project.slug === "axe-ceremonia-ar-portal";

  if (!frames.length) return null;

  return (
    <div
      className={[
        "project-scroll-sequence",
        `project-scroll-sequence--${project.slug}`,
        "project-scroll-sequence--mobile-natural",
      ].join(" ")}
    >
      {frames.map((frame, index) =>
        frame.length === 2 ? (
          <MediaPairFrame key={`${frame[0].src}-${frame[1].src}`} items={frame} index={index} priority={index === 0} />
        ) : (
          <ScrollSequenceFrame
            key={`${frame[0].src}-${index}`}
            type={frame[0].type ?? "image"}
            src={frame[0].src}
            srcHigh={frame[0].srcHigh}
            webmSrc={frame[0].webmSrc}
            poster={frame[0].poster}
            alt={frame[0].alt}
            index={index}
            priority={index === 0}
            coverFrameImage={isGdlMovilidad && index === 0 && frame[0].type !== "video"}
            consistentVideoWidth={isGinebra}
            interactiveFilm={["mahou-dilo-como-madrid", "beefeater-light", "airbnb"].includes(project.slug) && index === 0}
            fullWidthImage={
              (isGdlMovilidad && frame[0].type !== "video" && [2, 3].includes(index)) ||
              (isAxeCeremonia && frame[0].type !== "video" && [0, 2, 3].includes(index)) ||
              (isLacoste && frame[0].type !== "video" && frame[0].layout !== "portrait" && frame[0].layout !== "square") ||
              (isEatNudes && index === 0 && frame[0].type !== "video")
            }
          />
        ),
      )}
    </div>
  );
}

function groupSequenceFrames(sequence: ScrollSequenceItem[], projectSlug: string) {
  const frames: ScrollSequenceItem[][] = [];

  for (let index = 0; index < sequence.length; index += 1) {
    const current = sequence[index];
    const next = sequence[index + 1];
    const isEatNudesColabPair =
      projectSlug === "eat-nudes" &&
      current.src === "/projects/videos/eat-nudes-colab.mp4" &&
      next?.src === "/projects/eat-nudes-green-soft-serve.png";
    const isExplicitPair = (current.pairWithNext && next) || isEatNudesColabPair;
    const isLacosteFinalPair =
      projectSlug === "lacoste-roland-garros" &&
      index === sequence.length - 2 &&
      current.type !== "video" &&
      next?.type !== "video";
    const canPair =
      isExplicitPair ||
      isLacosteFinalPair ||
      (projectSlug !== "eat-nudes" &&
      current.type !== "video" &&
      next?.type !== "video" &&
      current.layout === "portrait" &&
      next?.layout === "portrait");

    if (canPair) {
      frames.push([current, next]);
      index += 1;
    } else {
      frames.push([current]);
    }
  }

  return frames;
}

function MediaPairFrame({
  items,
  index,
  priority,
}: {
  items: [ScrollSequenceItem, ScrollSequenceItem] | ScrollSequenceItem[];
  index: number;
  priority?: boolean;
}) {
  return (
    <section
      className="project-scroll-frame relative h-[calc(100svh_-_var(--nav-height))] snap-start overflow-hidden bg-white"
      aria-label={`${String(index + 1).padStart(2, "0")} / Paired media block`}
    >
      <div className="project-scroll-frame-inner project-scroll-pair-inner absolute inset-0 grid grid-cols-2 gap-0">
        {items.map((item, itemIndex) =>
          item.type === "video" ? (
            <video
              key={item.src}
              className="block h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload={priority && itemIndex === 0 ? "auto" : "metadata"}
              poster={item.poster}
              aria-label={item.alt}
            >
              {item.webmSrc ? <source src={item.webmSrc} type="video/webm" /> : null}
              <source src={item.src} type="video/mp4" />
            </video>
          ) : (
            // Paired media intentionally fills an exact 50/50 editorial spread with no gutter.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              loading={priority && itemIndex === 0 ? "eager" : "lazy"}
              decoding="async"
              className="block h-full w-full object-cover object-center"
            />
          ),
        )}
      </div>
      <p className="project-scroll-frame-label pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4f1e8] mix-blend-difference">
        {String(index + 1).padStart(2, "0")}
      </p>
    </section>
  );
}

function ScrollSequenceFrame({
  type,
  src,
  srcHigh,
  webmSrc,
  poster,
  alt,
  index,
  priority,
  fullWidthImage,
  coverFrameImage,
  consistentVideoWidth,
  interactiveFilm,
}: {
  type: "image" | "video";
  src: string;
  srcHigh?: string;
  webmSrc?: string;
  poster?: string;
  alt: string;
  index: number;
  priority?: boolean;
  fullWidthImage?: boolean;
  coverFrameImage?: boolean;
  consistentVideoWidth?: boolean;
  interactiveFilm?: boolean;
}) {
  return (
    <section
      className="project-scroll-frame relative h-[calc(100svh_-_var(--nav-height))] snap-start overflow-hidden bg-white"
      aria-label={`${String(index + 1).padStart(2, "0")} / ${alt}`}
    >
      <div className="project-scroll-frame-inner absolute inset-0 flex items-center justify-center">
        {type === "video" ? (
          <video
            className={consistentVideoWidth ? "h-auto max-h-full object-contain" : "h-full w-full object-contain"}
            style={consistentVideoWidth ? { width: "min(calc((100svh - var(--nav-height)) * 0.5625), 100%)" } : undefined}
            autoPlay={!interactiveFilm}
            muted={!interactiveFilm}
            loop={!interactiveFilm}
            controls={interactiveFilm}
            playsInline
            preload={interactiveFilm ? "metadata" : priority ? "auto" : "metadata"}
            poster={poster}
            aria-label={alt}
          >
            {srcHigh ? <source src={srcHigh} media="(min-width: 1600px)" type="video/mp4" /> : null}
            {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          // This sequence preserves natural image dimensions; files only scale down to fit the viewport.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={
              coverFrameImage
                ? "block h-full w-full object-cover object-center"
                : fullWidthImage
                  ? "block h-auto w-full object-contain"
                  : "max-h-full max-w-full object-contain"
            }
          />
        )}
      </div>
      <p className="project-scroll-frame-label pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4f1e8] mix-blend-difference">
        {String(index + 1).padStart(2, "0")}
      </p>
    </section>
  );
}
