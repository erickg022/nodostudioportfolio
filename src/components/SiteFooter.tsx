import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Index" },
  { href: "/#selected-works", label: "Work" },
  { href: "/#about-nodo", label: "Info" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="relative flex min-h-[100svh] flex-col justify-between bg-white px-4 py-6 text-neutral-950 sm:px-6">
      <div className="grid grid-cols-3 font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-400 md:text-[12px]">
        <p>All Rights Reserved</p>
        <p className="text-center">NODO Studio</p>
        <p className="text-right">©2026</p>
      </div>

      <div className="mx-auto flex w-full max-w-[640px] items-center justify-center py-24">
        <div className="footer-statement-frame relative px-10 py-7 text-center">
          <p className="text-[clamp(1.55rem,2.05vw,2.45rem)] font-normal uppercase leading-[0.95] tracking-[-0.045em]">
            Built Between
            <br />
            Code, Culture,
            <br />
            And Craft.
          </p>
        </div>
      </div>

      <div className="grid gap-10 font-mono text-[12px] uppercase leading-tight tracking-[0.04em] md:grid-cols-4 md:text-[14px]">
        <FooterColumn label="Navigation">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 md:max-w-44">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="underline-offset-4 transition hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        </FooterColumn>

        <FooterColumn label="Contact">
          <p>NODO Studio</p>
          <p>LA - MX - ES / Working globally</p>
          <Link href="/contact" className="mt-2 block underline-offset-4 transition hover:underline">
            Start A Conversation
          </Link>
        </FooterColumn>

        <FooterColumn label="Practice">
          <p>Creative Technology</p>
          <p>Image / Interaction / Systems</p>
        </FooterColumn>

        <FooterColumn label="Social">
          <div className="space-y-1">
            <p>Instagram</p>
            <p>LinkedIn</p>
          </div>
        </FooterColumn>
      </div>
    </footer>
  );
}

function FooterColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-7 text-neutral-400">{label}</p>
      <div>{children}</div>
    </div>
  );
}
