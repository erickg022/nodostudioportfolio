"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/** HH:MM:SS in the given time zone, ticking every second; blank until mounted so server and client markup match. */
function useClock(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

/**
 * Navigation from the previous NODO site: a white mono bar on desktop, and on mobile an
 * 80px header whose two-line toggle opens a full-screen menu. Links are page anchors;
 * the Meridian runtime turns them into smooth scrolls.
 */
export function NodoHeader() {
  const { header, nav } = site;
  const [open, setOpen] = useState(false);
  const time = useClock(header.clock.timezone);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
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

    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a, button")?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="nd-header">
        <nav className="nd-header__bar" aria-label="Main">
          <p className="nd-header__loc">
            {header.location[0]}
            <br />
            {header.location[1]}
          </p>
          <p className="nd-header__time">
            {header.clock.label}
            <br />
            <span suppressHydrationWarning>{time || "00:00:00"}</span>
          </p>
          <div className="nd-header__links">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <header className="mobile-site-header">
        <a href="#top" aria-label={`${header.brand} home`} className="mobile-site-header__brand-text" onClick={() => setOpen(false)}>
          {header.brand}
        </a>
        <button
          ref={buttonRef}
          type="button"
          className="mobile-site-header__toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation-panel"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        id="mobile-navigation-panel"
        ref={panelRef}
        className="mobile-menu-panel"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <nav className="mobile-menu-panel__nav" aria-label="Mobile primary navigation">
          {header.mobileLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-panel__meta">
          {header.mobileMeta.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </>
  );
}
