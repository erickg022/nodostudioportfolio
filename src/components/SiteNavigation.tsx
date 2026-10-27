"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/#selected-works", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [visibleAfterWorks, setVisibleAfterWorks] = useState(false);
  const visible = pathname !== "/" || visibleAfterWorks;

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const onScroll = () => {
      setVisibleAfterWorks(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-[70] hidden border-b border-black/15 bg-white/95 backdrop-blur-xl transition duration-300 md:block",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      ].join(" ")}
    >
      <nav className="mx-auto grid h-14 max-w-[1800px] grid-cols-[1fr_auto] items-center gap-4 px-4 text-[11px] uppercase tracking-[0.22em] text-neutral-900 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="font-mono underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
          NODO STUDIO
        </Link>
        <div className="hidden gap-5 md:flex lg:gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-neutral-700 underline-offset-4 transition hover:text-neutral-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="justify-self-end font-mono text-neutral-700">Index / 001</div>
      </nav>
    </header>
  );
}
