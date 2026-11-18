"use client";

import Image from "next/image";
import { useRef } from "react";
import type { BioLink } from "@/data/links";
import styles from "./LinkStack.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function LinkStack({ links }: { links: BioLink[] }) {
  const busy = useRef(false);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, link: BioLink) => {
    // Let the browser handle new-tab / modified clicks normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;

    // Grow a copy of the tapped strip to fill the screen, then navigate.
    const strip = e.currentTarget;
    const r = strip.getBoundingClientRect();
    const ghost = document.createElement("div");
    ghost.className = styles.ghost;
    Object.assign(ghost.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
    const img = strip.querySelector("img");
    if (img) {
      const copy = img.cloneNode() as HTMLImageElement;
      Object.assign(copy.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      ghost.appendChild(copy);
    }
    document.body.appendChild(ghost);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => Object.assign(ghost.style, { top: "0px", left: "0px", width: "100vw", height: "100vh" })),
    );

    window.setTimeout(() => {
      window.location.href = link.href;
      // If the page is restored from the back/forward cache, clean up.
      window.setTimeout(() => {
        ghost.remove();
        busy.current = false;
      }, 1200);
    }, 520);
  };

  return (
    <nav className={styles.stack} aria-label="Links">
      {links.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          {...(link.external ? { rel: "noopener noreferrer" } : {})}
          onClick={(e) => onClick(e, link)}
          className={styles.strip}
          style={{ width: link.width, animationDelay: `${0.12 + i * 0.13}s` }}
          aria-label={`${link.label}: ${link.tag}`}
        >
          <span className={styles.img} style={{ animationDelay: `${-i * 3}s` }}>
            <Image
              src={link.image.src}
              alt={link.image.alt}
              fill
              priority
              sizes="(min-width: 768px) 560px, 100vw"
              style={{ objectPosition: link.image.position ?? "center" }}
            />
          </span>
          <span className={styles.shade} aria-hidden="true" />
          <span className={styles.label} aria-hidden="true">
            <span className={styles.row}>
              <span className={styles.mono}>({pad(i + 1)})</span>
              <span className={`${styles.mono} ${styles.tag} ${link.highlight ? styles.pill : ""}`}>{link.tag}</span>
            </span>
            <span className={`${styles.row} ${styles.rowEnd}`}>
              <span className={styles.title}>{link.label}</span>
              <span className={styles.arrow}>&#8599;</span>
            </span>
          </span>
        </a>
      ))}
    </nav>
  );
}
