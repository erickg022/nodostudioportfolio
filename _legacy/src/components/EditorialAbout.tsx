"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ModeKey = "direction" | "space" | "ai" | "motion" | "interaction";

type Discipline = {
  key: ModeKey;
  label: string;
  className: string;
};

const disciplines: Discipline[] = [
  { key: "direction", label: "CREATIVE DIRECTION", className: "left-[7%] top-[18%]" },
  { key: "space", label: "SPATIAL SYSTEMS", className: "right-[4%] top-[28%]" },
  { key: "ai", label: "AI VISUAL DEVELOPMENT", className: "left-[2%] bottom-[29%]" },
  { key: "motion", label: "CGI + MOTION", className: "right-[10%] bottom-[21%]" },
  { key: "interaction", label: "INTERACTIVE EXPERIENCES", className: "left-[36%] bottom-[8%]" },
];

const indexItems = [
  { key: "ai", label: "01 / IMAGE" },
  { key: "space", label: "02 / SPACE" },
  { key: "motion", label: "03 / MOTION" },
  { key: "interaction", label: "04 / INTERACTION" },
] satisfies Array<{ key: ModeKey; label: string }>;

const operatingModes = [
  {
    key: "ai",
    title: "IMAGE SYSTEMS",
    body: "Campaign worlds, art direction, AI visual development, CGI, image-making, and editorial brand language.",
    note: "Visual languages designed as systems, not isolated outputs.",
  },
  {
    key: "space",
    title: "SPATIAL EXPERIENCES",
    body: "Retail concepts, pop-ups, installations, environmental storytelling, and real-world brand encounters.",
    note: "Physical moments structured with the same precision as digital interfaces.",
  },
  {
    key: "motion",
    title: "MOTION + PERFORMANCE",
    body: "Motion design, show visuals, screen systems, product films, and moving-image direction.",
    note: "Images that carry timing, behavior, rhythm, and atmosphere.",
  },
  {
    key: "interaction",
    title: "INTERACTIVE CULTURE",
    body: "Playable experiences, computer vision, responsive environments, digital tools, and participation-led campaigns.",
    note: "Interfaces built around audience behavior, not static presentation.",
  },
] satisfies Array<{ key: ModeKey; title: string; body: string; note: string }>;

const proofColumns = [
  ["CULTURE", "Fashion, music, sport, hospitality, and youth culture."],
  ["TECHNOLOGY", "AI, creative coding, real-time systems, computer vision, and generative workflows."],
  ["EXPERIENCE", "Campaign worlds that move between screen, space, object, audience, and place."],
];

function usePrefersReducedMotion() {
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

export function EditorialAbout() {
  const [activeMode, setActiveMode] = useState<ModeKey>("direction");
  const [expandedMode, setExpandedMode] = useState<ModeKey | null>(null);

  return (
    <section id="about" className="relative overflow-hidden bg-[#f4f1e8] text-neutral-950">
      <AboutHero activeMode={activeMode} setActiveMode={setActiveMode} />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-10 flex justify-between gap-6 border-b border-black/15 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            <span>OPERATING MODES / 02</span>
            <span>STUDIO INDEX</span>
          </div>

          <div className="border-y border-black/15">
            {operatingModes.map((mode, index) => {
              const isOpen = expandedMode === mode.key;

              return (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setExpandedMode(isOpen ? null : mode.key)}
                  onMouseEnter={() => setActiveMode(mode.key)}
                  onFocus={() => setActiveMode(mode.key)}
                  className="group relative grid w-full gap-5 border-b border-black/15 py-7 text-left last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:grid-cols-[0.18fr_0.82fr] md:py-9"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-400 transition group-hover:text-neutral-950">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
                    <span className="text-[clamp(2rem,5vw,5.5rem)] font-black uppercase leading-[0.86] tracking-[-0.04em]">
                      {mode.title}
                    </span>
                    <span className="max-w-2xl self-center text-base leading-snug text-neutral-700 md:text-lg">{mode.body}</span>
                    <span
                      className={[
                        "overflow-hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-neutral-500 transition-all duration-300 lg:col-start-2",
                        isOpen ? "max-h-24 pt-2 opacity-100" : "max-h-0 opacity-0",
                      ].join(" ")}
                    >
                      {mode.note}
                    </span>
                  </span>
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-neutral-950 transition-all duration-500 group-hover:w-full" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 md:pb-32">
        <div className="mx-auto max-w-[1800px] border-t border-black/15 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">SELECTED PRACTICE / 03</p>
          <div className="mt-14 grid gap-px bg-black/15 md:grid-cols-3">
            {proofColumns.map(([label, text]) => (
              <div key={label} className="min-h-64 bg-[#f4f1e8] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">{label}</p>
                <p className="mt-24 max-w-sm text-xl leading-tight text-neutral-950">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 max-w-5xl text-[clamp(2.5rem,6.4vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
            NODO BUILDS THE SYSTEM, NOT JUST THE IMAGE.
          </p>
        </div>
      </section>
    </section>
  );
}

function AboutHero({
  activeMode,
  setActiveMode,
}: {
  activeMode: ModeKey;
  setActiveMode: (mode: ModeKey) => void;
}) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, label: "" });

  const setExplore = (mode: ModeKey) => {
    setActiveMode(mode);
    setCursor((current) => ({ ...current, label: "EXPLORE" }));
  };

  return (
    <section className="relative min-h-[100svh] px-4 pb-8 pt-20 sm:px-6 lg:pt-24">
      <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-[1800px] gap-10 lg:grid-cols-12 lg:gap-6">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10 lg:col-span-2"
        >
          <div className="space-y-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-neutral-600">
            <p>ABOUT NODO / 01</p>
            <p>
              LA - MX - ES /
              <br />
              Working globally
            </p>
            <p>
              CREATIVE TECHNOLOGY /
              <br />
              CULTURE / IMAGE
            </p>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="relative order-3 min-h-[440px] lg:order-none lg:col-span-5 lg:min-h-0"
        >
          <MaterialObjectCanvas
            activeMode={activeMode}
            cursor={cursor}
            setCursor={setCursor}
            setActiveMode={setActiveMode}
          />
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {disciplines.map((discipline) => (
              <button
                key={discipline.key}
                type="button"
                onMouseEnter={() => setExplore(discipline.key)}
                onFocus={() => setExplore(discipline.key)}
                className={`pointer-events-auto absolute ${discipline.className} font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 underline-offset-4 transition hover:text-neutral-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]`}
              >
                {discipline.label}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 lg:hidden">
            {disciplines.map((discipline) => (
              <button key={discipline.key} type="button" onClick={() => setActiveMode(discipline.key)} className="text-left">
                {discipline.label}
              </button>
            ))}
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="lg:col-span-5"
        >
          <h1 className="max-w-5xl text-[clamp(2.7rem,5.4vw,7.1rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
            NODO STUDIO OPERATES BETWEEN CREATIVE DIRECTION, TECHNOLOGY, AND CULTURE - BUILDING VISUAL WORLDS, SPATIAL
            EXPERIENCES, AND DIGITAL SYSTEMS FOR BRANDS THAT WANT TO MOVE DIFFERENTLY.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-snug text-neutral-700 md:text-lg">
            We combine image-making, AI visual development, CGI, motion, interaction, and spatial thinking to create work
            that feels culturally aware, technically considered, and impossible to ignore.
          </p>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-600">MOVE THROUGH THE FIELD -&gt;</p>
        </m.div>
      </div>

      <div className="mx-auto mt-10 max-w-[1800px] border-t border-black/15 pt-4">
        <div className="grid gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-600 sm:grid-cols-4">
          {indexItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setExplore(item.key)}
              onFocus={() => setExplore(item.key)}
              onClick={() => setActiveMode(item.key)}
              className="text-left underline-offset-4 transition hover:text-neutral-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaterialObjectCanvas({
  activeMode,
  cursor,
  setCursor,
  setActiveMode,
}: {
  activeMode: ModeKey;
  cursor: { x: number; y: number; visible: boolean; label: string };
  setCursor: React.Dispatch<React.SetStateAction<{ x: number; y: number; visible: boolean; label: string }>>;
  setActiveMode: (mode: ModeKey) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false, pulse: 0 });
  const modeRef = useRef<ModeKey>(activeMode);
  const reducedMotion = usePrefersReducedMotion();
  const [coords, setCoords] = useState("X: 00.00 / Y: 00.00");

  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    if (!canvas || !zone) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let running = true;
    let visible = true;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const points = Array.from({ length: 72 }, (_, index) => {
      const angle = (index / 72) * Math.PI * 2;
      return {
        angle,
        noise: seededNoise(index) * 0.16 - 0.08,
      };
    });

    const resize = () => {
      const rect = zone.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(zone);
    resize();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    observer.observe(zone);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) draw();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = () => {
      if (!running || !visible) {
        frame = window.requestAnimationFrame(draw);
        return;
      }

      time += reducedMotion ? 0.003 : 0.014;
      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      pointer.pulse *= 0.92;
      const cx = width * 0.5;
      const cy = height * 0.51;
      const minSide = Math.min(width, height);
      const mode = modeRef.current;
      const sx = mode === "direction" ? 1.13 : mode === "space" ? 0.88 : 1;
      const sy = mode === "space" ? 1.22 : mode === "direction" ? 0.92 : 1;
      const baseRadius = minSide * (mode === "interaction" ? 0.29 : 0.265);
      const px = pointer.x * width;
      const py = pointer.y * height;

      context.save();
      context.translate(cx, cy);

      const gradient = context.createRadialGradient(-baseRadius * 0.36, -baseRadius * 0.42, baseRadius * 0.08, 0, 0, baseRadius * 1.25);
      gradient.addColorStop(0, "#34342f");
      gradient.addColorStop(0.44, "#11110f");
      gradient.addColorStop(1, "#020202");

      context.beginPath();
      points.forEach((point, index) => {
        const next = points[(index + 1) % points.length];
        const localWave = Math.sin(time * 1.2 + point.angle * 3.1) * 0.022;
        const ripple = mode === "motion" ? Math.sin(time * 2.1 + point.angle * 6) * 0.035 : 0;
        const pixel = mode === "ai" ? Math.sin(time * 5 + point.angle * 17) * 0.018 : 0;
        const radius = baseRadius * (1 + point.noise + localWave + ripple + pixel + pointer.pulse * 0.025);
        const rawX = Math.cos(point.angle) * radius * sx;
        const rawY = Math.sin(point.angle) * radius * sy;
        const worldX = rawX + cx;
        const worldY = rawY + cy;
        const distance = Math.hypot(px - worldX, py - worldY);
        const influence = pointer.active && !reducedMotion ? Math.max(0, 1 - distance / (baseRadius * 1.35)) : 0;
        const pull = mode === "interaction" ? 0.16 : 0.085;
        const x = rawX + (px - worldX) * influence * pull;
        const y = rawY + (py - worldY) * influence * pull;

        const nextRadius = baseRadius * (1 + next.noise + Math.sin(time * 1.2 + next.angle * 3.1) * 0.022);
        const nx = Math.cos(next.angle) * nextRadius * sx;
        const ny = Math.sin(next.angle) * nextRadius * sy;
        const midX = (x + nx) / 2;
        const midY = (y + ny) / 2;

        if (index === 0) context.moveTo(midX, midY);
        else context.quadraticCurveTo(x, y, midX, midY);
      });
      context.closePath();
      context.fillStyle = gradient;
      context.fill();

      context.globalAlpha = 0.22;
      for (let i = 0; i < 220; i++) {
        const angle = seededNoise(i + 200) * Math.PI * 2;
        const distance = Math.sqrt(seededNoise(i + 500)) * baseRadius * 0.95;
        const x = Math.cos(angle) * distance * sx + Math.sin(time + i) * 0.5;
        const y = Math.sin(angle) * distance * sy;
        context.fillStyle = i % 3 === 0 ? "#4a4a43" : "#060606";
        context.fillRect(x, y, 0.7, 0.7);
      }

      if (mode === "space") {
        context.globalAlpha = 0.11;
        context.strokeStyle = "#bdb7aa";
        context.lineWidth = 0.7;
        for (let i = -3; i <= 3; i++) {
          context.beginPath();
          context.ellipse(0, i * baseRadius * 0.13, baseRadius * (0.2 + Math.abs(i) * 0.09), baseRadius * 0.11, 0, 0, Math.PI * 2);
          context.stroke();
        }
      }

      if (mode === "ai") {
        context.globalAlpha = 0.16;
        context.fillStyle = "#d8d3c8";
        for (let i = 0; i < 140; i++) {
          const x = (seededNoise(i + 1000) - 0.5) * baseRadius * 1.75;
          const y = (seededNoise(i + 1300) - 0.5) * baseRadius * 1.55;
          context.fillRect(Math.round(x / 6) * 6, Math.round(y / 6) * 6, 1, 1);
        }
      }

      context.restore();
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerRef.current.x = Math.min(1, Math.max(0, x));
    pointerRef.current.y = Math.min(1, Math.max(0, y));
    pointerRef.current.active = true;
    setCoords(`X: ${x.toFixed(2)} / Y: ${y.toFixed(2)}`);

    const dx = x - 0.5;
    const dy = y - 0.51;
    const nearObject = Math.hypot(dx, dy) < 0.27;
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
      label: nearObject ? "FIELD" : "",
    });
  };

  return (
    <div
      ref={zoneRef}
      className="relative h-full min-h-[420px] overflow-hidden"
      onPointerMove={updatePointer}
      onPointerEnter={updatePointer}
      onPointerLeave={() => {
        pointerRef.current.active = false;
        setCursor((current) => ({ ...current, visible: false, label: "" }));
      }}
      onPointerDown={() => {
        pointerRef.current.pulse = 1;
        setActiveMode("interaction");
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Reactive black material study" />
      <p className="absolute right-2 top-2 hidden font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 md:block">{coords}</p>
      <div
        className={[
          "pointer-events-none absolute z-10 hidden h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-950/50 bg-[#f4f1e8]/10 px-2 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-950 mix-blend-multiply transition-opacity md:flex",
          cursor.visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ left: cursor.x, top: cursor.y }}
      >
        {cursor.label}
      </div>
    </div>
  );
}

function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
