"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const mobileLinks = [
  { href: "/", label: "Home", match: "/" },
  { href: "/work", label: "Work", match: "/work" },
  { href: "/#about", label: "About", match: "/#about" },
];

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const closeTimer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(closeTimer);
  }, [pathname]);

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
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeLabel = pathname.startsWith("/work") ? "Work" : pathname === "/" ? "Home" : "";

  return (
    <>
      <header className="mobile-site-header md:hidden">
        <Link
          href="/"
          aria-label="NODO Studio home"
          className={isHome ? "mobile-site-header__brand-text" : "mobile-site-header__logo"}
          onClick={() => setOpen(false)}
        >
          {isHome ? (
            "NODO STUDIO"
          ) : (
            <Image src="/brand/nodo-logo-cropped.png" alt="NODO." width={136} height={47} priority />
          )}
        </Link>
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
        className="mobile-menu-panel md:hidden"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <nav className="mobile-menu-panel__nav" aria-label="Mobile primary navigation">
          {mobileLinks.map((link) => {
            const active = activeLabel === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                data-active={active}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mobile-menu-panel__meta">
          <p>LA - MX - ES</p>
          <p>Working globally</p>
          <p>(C) 2026 NODO STUDIO</p>
        </div>
      </div>
    </>
  );
}
