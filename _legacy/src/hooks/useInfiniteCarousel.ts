"use client";

import { useCallback, useEffect, useRef } from "react";

const AUTO_SPEED = 150;
const HOVER_SPEED = 72;
const IDLE_RESUME_MS = 1200;

export function useInfiniteCarousel({ paused = false }: { paused?: boolean } = {}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef(0);
  const draggingRef = useRef(false);
  const hoverRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const movedRef = useRef(false);
  const resumeTimerRef = useRef<number | undefined>(undefined);

  const normalize = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const loopWidth = track.scrollWidth / 3;
    if (!loopWidth) return;

    while (positionRef.current <= -loopWidth * 2) positionRef.current += loopWidth;
    while (positionRef.current >= 0) positionRef.current -= loopWidth;
    track.style.transform = `translate3d(${positionRef.current}px,0,0)`;
  }, []);

  const moveBy = useCallback(
    (delta: number) => {
      positionRef.current += delta;
      normalize();
    },
    [normalize],
  );

  const pauseBriefly = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      draggingRef.current = false;
    }, IDLE_RESUME_MS);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const setInitial = () => {
      const loopWidth = track.scrollWidth / 3;
      positionRef.current = -loopWidth;
      track.style.transform = `translate3d(${positionRef.current}px,0,0)`;
    };
    const frame = window.requestAnimationFrame(setInitial);
    window.addEventListener("resize", setInitial);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", setInitial);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = window.performance.now();

    const tick = (time: number) => {
      const deltaSeconds = Math.min(0.05, (time - last) / 1000);
      last = time;

      if (!paused && !draggingRef.current) {
        const speed = hoverRef.current ? HOVER_SPEED : AUTO_SPEED;
        moveBy(-speed * deltaSeconds);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [moveBy, paused]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    movedRef.current = false;
    lastPointerXRef.current = event.clientX;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = event.clientX - lastPointerXRef.current;
    if (Math.abs(delta) > 1) movedRef.current = true;
    lastPointerXRef.current = event.clientX;
    moveBy(delta);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    pauseBriefly();
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    draggingRef.current = true;
    moveBy(-event.deltaX);
    pauseBriefly();
  };

  return {
    viewportRef,
    trackRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onMouseEnter: () => {
        hoverRef.current = true;
      },
      onMouseLeave: () => {
        hoverRef.current = false;
      },
      onWheel,
    },
  };
}
