"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HOME_ARCHIVE_MEDIA, type HomeArchiveMediaItem } from "@/data/homeArchiveMedia";

type CursorState = {
  visible: boolean;
  x: number;
  y: number;
  label: "ORBIT" | "VIEW" | "DRAG" | "";
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function HomeArchiveOrbit() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0.5, y: 0.5, inside: false });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, lastX: 0, lastTime: 0 });
  const hoverRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [cursor, setCursor] = useState<CursorState>({ visible: false, x: 0, y: 0, label: "" });
  const cards = HOME_ARCHIVE_MEDIA;
  const total = cards.length;
  const activeItem = cards[activeIndex] ?? cards[0];

  const mobileItems = useMemo(() => {
    const prev = cards[(mobileIndex - 1 + total) % total];
    const current = cards[mobileIndex];
    const next = cards[(mobileIndex + 1) % total];
    return [prev, current, next];
  }, [cards, mobileIndex, total]);

  const updateCards = useCallback((rotation: number) => {
    const scene = sectionRef.current;
    if (!scene) return;

    const rect = scene.getBoundingClientRect();
    const radiusX = Math.min(rect.width * 0.33, 520);
    const radiusZ = Math.min(rect.height * 0.38, 360);

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const baseAngle = (index / total) * 360 + rotation;
      const radians = (baseAngle * Math.PI) / 180;
      const x = Math.sin(radians) * radiusX;
      const z = Math.cos(radians) * radiusZ;
      const y = Math.sin(radians * 1.7) * 18;
      const front = (Math.cos(radians) + 1) / 2;
      const hoverLift = hoverRef.current === index ? 30 : 0;
      const scale = 0.68 + front * 0.38 + (hoverRef.current === index ? 0.035 : 0);
      const opacity = 0.34 + front * 0.66;
      const rotateY = Math.sin(radians) * -42;

      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z + hoverLift}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(Math.round(front * 100));

      const video = videoRefs.current[index];
      if (video) {
        if (front > 0.62) void video.play().catch(() => undefined);
        else video.pause();
      }
    });
  }, [total]);

  useEffect(() => {
    updateCards(rotationRef.current);
  }, [updateCards]);

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let last = performance.now();
    let running = true;

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry?.isIntersecting ?? true;
    });
    observer.observe(section);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 1000;
      last = now;

      if (running && visibleRef.current) {
        const hover = hoverRef.current;
        const idleSpeed = hover === null ? 360 / 48 : 360 / 150;
        const pointerPush = pointerRef.current.inside ? (pointerRef.current.x - 0.5) * 4.2 : 0;
        const dragVelocity = velocityRef.current;
        rotationRef.current += (idleSpeed + pointerPush + dragVelocity) * dt;
        velocityRef.current *= dragRef.current.active ? 0.98 : 0.93;

        targetTiltRef.current.x = pointerRef.current.inside ? (pointerRef.current.y - 0.5) * -7 : 0;
        targetTiltRef.current.y = pointerRef.current.inside ? (pointerRef.current.x - 0.5) * 4 : 0;
        tiltRef.current.x += (targetTiltRef.current.x - tiltRef.current.x) * 0.08;
        tiltRef.current.y += (targetTiltRef.current.y - tiltRef.current.y) * 0.08;

        if (orbitRef.current) {
          orbitRef.current.style.transform = `rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`;
        }

        updateCards(rotationRef.current);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, updateCards]);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerRef.current = { x, y, inside: true };

    if (dragRef.current.active) {
      const now = performance.now();
      const dx = event.clientX - dragRef.current.lastX;
      const dt = Math.max(16, now - dragRef.current.lastTime);
      rotationRef.current += dx * 0.18;
      velocityRef.current = (dx / dt) * 36;
      dragRef.current.lastX = event.clientX;
      dragRef.current.lastTime = now;
    }

    setCursor({
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      label: dragRef.current.active ? "DRAG" : hoverRef.current === null ? "ORBIT" : "VIEW",
    });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setCursor((current) => ({ ...current, label: "DRAG" }));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setCursor((current) => ({ ...current, label: hoverRef.current === null ? "ORBIT" : "VIEW" }));
  };

  const openItem = (item: HomeArchiveMediaItem) => {
    if (!item.projectSlug) return;
    router.push(`/work/${item.projectSlug}`);
  };

  const setHover = (index: number | null) => {
    hoverRef.current = index;
    if (index !== null) setActiveIndex(index);
    setCursor((current) => ({ ...current, label: index === null ? "ORBIT" : "VIEW" }));
  };

  const onMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    dragRef.current.startX = event.touches[0]?.clientX ?? 0;
  };

  const onMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = dragRef.current.startX;
    const end = event.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 32) return;
    setMobileIndex((current) => (delta < 0 ? (current + 1) % total : (current - 1 + total) % total));
  };

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden border-y border-black/15 bg-[#f4f1e8] px-4 py-5 text-neutral-950 sm:px-6"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerMove}
      onPointerLeave={() => {
        pointerRef.current.inside = false;
        setCursor((current) => ({ ...current, visible: false }));
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pointer-events-none absolute inset-x-4 top-5 z-20 grid gap-3 border-b border-black/15 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-700 sm:inset-x-6 md:grid-cols-3">
        <span>SELECTED WORK / 2026</span>
        <span className="hidden text-center md:block">NODO STUDIO — PROJECT ARCHIVE</span>
        <span className="hidden text-right md:block">08 WORLDS / 01-08</span>
      </div>

      <div className="archive-scene relative mx-auto hidden h-[calc(100svh-4rem)] max-w-[1800px] touch-none md:block">
        <div
          ref={orbitRef}
          className="archive-orbit absolute left-1/2 top-1/2 h-[68svh] w-[72vw] max-w-[1320px] -translate-x-1/2 -translate-y-1/2"
        >
          {cards.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              type="button"
              aria-label={`Open ${item.title}`}
              onMouseEnter={() => setHover(index)}
              onFocus={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              onBlur={() => setHover(null)}
              onClick={() => openItem(item)}
              className="archive-card absolute left-1/2 top-1/2 grid w-[min(42vw,560px)] cursor-none overflow-hidden bg-[#dfdbd0] text-left outline-none transition-[filter] duration-300 hover:contrast-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              style={{ aspectRatio: item.aspectRatio }}
            >
              <ArchiveMedia
                item={item}
                onVideoRef={(node) => {
                  videoRefs.current[index] = node;
                }}
              />
              <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4f1e8] mix-blend-difference">
                {item.index} / {item.category}
              </span>
            </button>
          ))}
        </div>

        <ArchiveReadout item={activeItem} total={8} />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[720px] flex-col justify-center py-20 md:hidden">
        <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-600">
          <p>NODO STUDIO — PROJECT ARCHIVE</p>
          <p>08 WORLDS / 01-08</p>
        </div>
        <div className="relative h-[58svh]" onTouchStart={onMobileTouchStart} onTouchEnd={onMobileTouchEnd}>
          {mobileItems.map((item, index) => {
            const offset = index - 1;
            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => (offset === 0 ? openItem(item) : setMobileIndex(cards.findIndex((card) => card.id === item.id)))}
                className="absolute left-1/2 top-1/2 w-[84%] overflow-hidden bg-[#dfdbd0] text-left transition duration-500"
                style={{
                  aspectRatio: item.aspectRatio,
                  transform: `translate(-50%, -50%) translateX(${offset * 18}%) translateY(${Math.abs(offset) * 22}px) scale(${offset === 0 ? 1 : 0.88})`,
                  opacity: offset === 0 ? 1 : 0.42,
                  zIndex: 10 - Math.abs(offset),
                }}
              >
                <ArchiveMedia item={item} onVideoRef={() => undefined} />
              </button>
            );
          })}
        </div>
        <ArchiveReadout item={cards[mobileIndex]} total={8} mobile />
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-5 z-20 grid gap-3 border-t border-black/15 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-700 sm:inset-x-6 md:grid-cols-3">
        <span>DRAG TO ORBIT</span>
        <span className="hidden text-center md:block">IMAGE / SPACE / MOTION / INTERACTION</span>
        <span className="hidden text-right md:block">CURSOR TO EXPLORE</span>
      </div>

      <div
        className={[
          "pointer-events-none absolute z-30 hidden h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-950/55 px-2 font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-950 transition-opacity md:flex",
          cursor.visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ left: cursor.x, top: cursor.y }}
      >
        {cursor.label}
      </div>
    </section>
  );
}

function ArchiveMedia({
  item,
  onVideoRef,
}: {
  item: HomeArchiveMediaItem;
  onVideoRef: (node: HTMLVideoElement | null) => void;
}) {
  if (item.type === "video" && item.src) {
    return (
      <video
        ref={onVideoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={item.poster}
        aria-label={item.alt}
      >
        <source src={item.src} type={item.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
    );
  }

  if (item.type === "image" && item.src) {
    return (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 86vw, 42vw"
        className="object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-neutral-950 p-5 text-[#f4f1e8]">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f4f1e8]/65">{item.category}</p>
      <p className="max-w-[8ch] text-[clamp(2.7rem,5.5vw,5.8rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
        {item.title}
      </p>
      <p className="max-w-[28ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#f4f1e8]/70">
        {item.visualMood}
      </p>
    </div>
  );
}

function ArchiveReadout({ item, total, mobile = false }: { item: HomeArchiveMediaItem; total: number; mobile?: boolean }) {
  return (
    <div
      className={[
        "z-20 font-mono uppercase tracking-[0.2em] text-neutral-600",
        mobile ? "mt-8" : "absolute bottom-[13%] left-0 max-w-[360px]",
      ].join(" ")}
    >
      <p className="text-[10px]">{item.projectSlug ? `${item.index} / ${String(total).padStart(2, "0")}` : "PROJECT ARCHIVE"}</p>
      <p className="mt-3 font-sans text-2xl font-black leading-none tracking-[-0.04em] text-neutral-950 md:text-3xl">
        {item.projectSlug ? item.title : "08 SELECTED WORLDS"}
      </p>
      <p className="mt-3 text-[10px] leading-relaxed">
        {item.projectSlug ? item.subtitle : "DRAG / HOVER / EXPLORE"}
        <br />
        {item.projectSlug ? item.year : "IMAGE / SPACE / MOTION"}
      </p>
    </div>
  );
}
