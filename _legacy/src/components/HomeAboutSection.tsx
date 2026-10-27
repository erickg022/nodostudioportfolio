import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ABOUT_MEDIA_FAN } from "@/data/aboutMediaFan";

const SPIRAL_COUNT = 52;
const SPIRAL_COLUMNS = 10;
const SPIRAL_TILE = 86;
const SPIRAL_GAP = 14;
const SPIRAL_Y_STEP = (SPIRAL_TILE + SPIRAL_GAP) / SPIRAL_COLUMNS;
const SPIRAL_DEPTH =
  (0.5 * (SPIRAL_TILE + SPIRAL_GAP / Math.sin(((SPIRAL_COLUMNS - 2) * 90 * Math.PI) / 180 / SPIRAL_COLUMNS))) /
  Math.tan(Math.PI / SPIRAL_COLUMNS);
const SPIRAL_TILT = (Math.atan2(SPIRAL_Y_STEP, SPIRAL_TILE + SPIRAL_GAP) * 180) / Math.PI;

const SPIRAL_MEDIA = ABOUT_MEDIA_FAN.filter((item) => item.type === "image" && item.src);

const SPIRAL_ITEMS = Array.from({ length: SPIRAL_COUNT }, (_, index) => {
  const item = SPIRAL_MEDIA[index % SPIRAL_MEDIA.length];
  return {
    src: item?.src ?? "/projects/lacoste-cover.jpg",
    alt: item?.alt ?? "NODO Studio media fragment",
  };
});

export function HomeAboutSection() {
  return (
    <section id="about-nodo" className="about-project-section bg-white text-neutral-950">
      <span id="about" className="pointer-events-none absolute -top-16" aria-hidden="true" />

      <RotatingProjectVisual className="about-desktop-visual md:order-2 lg:order-1" />

      <div className="about-desktop-copy hidden min-h-0 flex-col md:order-1 md:flex lg:order-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.02em] text-neutral-500">(ABOUT NODO)</p>

        <h2 className="mt-5 max-w-[940px] text-[clamp(2rem,2.75vw,3.35rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-neutral-950">
          NODO STUDIO IS A CREATIVE TECHNOLOGY
          <br />
          AND VISUAL DIRECTION PRACTICE BUILDING
          <br />
          CAMPAIGN WORLDS, SPATIAL EXPERIENCES,
          <br />
          AND DIGITAL CULTURE FOR BRANDS THAT
          <br />
          WANT TO MOVE DIFFERENTLY.
        </h2>

        <div className="mt-7 border-t border-black/15 pt-6">
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-2">
            <div className="space-y-7">
              <AboutCreditBlock
                label="(SERVICES)"
                values={[
                  "CREATIVE DIRECTION",
                  "AI VISUAL DEVELOPMENT",
                  "CGI + MOTION",
                  "SPATIAL DESIGN",
                  "INTERACTIVE EXPERIENCES",
                ]}
              />
              <AboutCreditBlock
                label="(ROLE)"
                values={["ERICK GARCIA", "FOUNDER / CREATIVE DIRECTOR", "CREATIVE TECHNOLOGIST"]}
              />
            </div>
            <div className="space-y-7">
              <AboutCreditBlock label="(FOCUS)" values={["FASHION", "SPORT", "HOSPITALITY", "MUSIC", "CULTURE"]} />
              <AboutCreditBlock label="(BASED)" values={["LA - MX - ES", "WORKING GLOBALLY"]} />
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-black/15 pt-6">
          <Link
            href="/work"
            className="group inline-flex items-center whitespace-nowrap text-[clamp(1.85rem,3.2vw,3.55rem)] font-normal uppercase leading-none tracking-[-0.045em] text-neutral-500 transition duration-300 hover:translate-x-1 hover:text-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            VIEW SELECTED WORK
            <span className="ml-2 text-[0.82em] leading-none transition duration-300 group-hover:translate-x-1">-&gt;</span>
          </Link>
        </div>
      </div>

      <div className="about-mobile-flow md:hidden">
        <AboutCreditBlock
          label="(SERVICES)"
          values={[
            "CREATIVE DIRECTION",
            "AI VISUAL DEVELOPMENT",
            "CGI + MOTION",
            "SPATIAL DESIGN",
            "INTERACTIVE EXPERIENCES",
          ]}
        />

        <div className="about-mobile-visual-wrapper">
          <RotatingProjectVisual className="about-spiral-scene-mobile" />
        </div>

        <div className="about-mobile-details-grid">
          <div className="about-mobile-column">
            <AboutCreditBlock
              label="(ROLE)"
              values={["ERICK GARCIA", "FOUNDER / CREATIVE DIRECTOR", "CREATIVE TECHNOLOGIST"]}
            />
            <AboutCreditBlock label="(BASED)" values={["LA - MX - ES", "WORKING GLOBALLY"]} className="about-mobile-based" />
          </div>
          <div className="about-mobile-column">
            <AboutCreditBlock label="(FOCUS)" values={["FASHION", "SPORT", "HOSPITALITY", "MUSIC", "CULTURE"]} />
            <AboutCreditBlock label="(BASED)" values={["LA - MX - ES", "WORKING GLOBALLY"]} className="about-mobile-based" />
          </div>
        </div>

        <Link
          href="/work"
          className="about-mobile-selected-link group inline-flex items-center whitespace-nowrap font-normal uppercase leading-none tracking-[-0.045em] text-neutral-500 transition duration-300 hover:translate-x-1 hover:text-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          VIEW SELECTED WORK
          <span className="ml-2 text-[0.82em] leading-none transition duration-300 group-hover:translate-x-1">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}

function RotatingProjectVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`about-spiral-scene ${className}`} aria-label="Rotating NODO Studio media archive">
      <div className="about-spiral" style={{ "--n": SPIRAL_COUNT, "--p": SPIRAL_COLUMNS } as CSSProperties}>
        {SPIRAL_ITEMS.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className="about-spiral-tile"
            style={
              {
                "--i": index,
                transform: `rotateY(${(index * 360) / SPIRAL_COLUMNS}deg) translate3d(0, ${
                  (index - SPIRAL_COUNT * 0.5) * SPIRAL_Y_STEP
                }px, ${SPIRAL_DEPTH}px) rotate(${SPIRAL_TILT}deg)`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 767px) 32vw, (max-width: 1024px) 24vw, 8vw"
              className="object-cover"
              loading={index < 18 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutCreditBlock({ label, values, className = "" }: { label: string; values: string[]; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.02em] text-neutral-500">{label}</p>
      <div className="space-y-1 font-mono text-[13px] uppercase leading-tight tracking-[0.02em] text-neutral-950">
        {values.map((value, index) => (
          <p key={`${value}-${index}`} className={index > 0 && label === "(ROLE)" ? "text-neutral-500" : undefined}>
            {value}
          </p>
        ))}
      </div>
    </div>
  );
}
