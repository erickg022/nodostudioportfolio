"use client";

import { useEffect, useRef, useState } from "react";
import type { CourseDemo } from "@/content/courses";

/**
 * "Así se ve": a short real recording of the result, framed like a display, with chapter
 * snaps that jump to each room. Plays only while visible and never autoplays for
 * visitors who asked for reduced motion.
 */
export function DemoReel({ demo }: { demo: CourseDemo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Play while it is on screen, pause when it leaves (saves battery and data).
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [reduced]);

  // On phones the snaps scroll sideways: keep the active one in view (without moving the page).
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.querySelectorAll<HTMLElement>("button")[active];
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.clientWidth) / 2, behavior: "smooth" });
  }, [active]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
    let idx = 0;
    demo.chapters.forEach((c, i) => {
      if (v.currentTime >= c.at) idx = i;
    });
    setActive(idx);
  };

  const jump = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = demo.chapters[i].at;
    v.play().catch(() => {});
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section className="cx-demo" aria-label={demo.title}>
      <div className="cx-demo__head">
        <p className="cx-label cx-mono">{demo.label}</p>
        <div className="cx-demo__copy">
          <h3 className="cx-demo__title">{demo.title}</h3>
          <p className="cx-demo__text">{demo.text}</p>
        </div>
      </div>

      <figure ref={stageRef} className="cx-demo__stage">
        <div className="cx-demo__screen">
          <video
            ref={videoRef}
            className="cx-demo__video"
            src={demo.video.src}
            poster={demo.video.poster}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={!reduced}
            onTimeUpdate={onTime}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={demo.video.alt}
          />
          <button type="button" className="cx-demo__toggle cx-mono" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
            {playing ? "Pausa" : "Reproducir"}
          </button>
          <span className="cx-demo__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        </div>
        <div className="cx-demo__neck" aria-hidden="true" />
        <div className="cx-demo__foot" aria-hidden="true" />
        <figcaption className="cx-demo__cap cx-mono">{demo.video.caption}</figcaption>
      </figure>

      <ol ref={listRef} className="cx-demo__chapters">
        {demo.chapters.map((c, i) => (
          <li key={c.label}>
            <button type="button" className={`cx-demo__chap${i === active ? " is-on" : ""}`} onClick={() => jump(i)} aria-label={`Ir a ${c.label}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" loading="lazy" decoding="async" width={360} height={188} />
              <span className="cx-mono cx-muted">0{i + 1}</span>
              <span className="cx-demo__chapname">{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
