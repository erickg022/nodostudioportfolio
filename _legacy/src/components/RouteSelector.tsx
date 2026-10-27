"use client";

import { useRouter } from "next/navigation";

const routes = [
  { label: "Build a visual world", discipline: "IMAGE" },
  { label: "Create a spatial encounter", discipline: "SPACE" },
  { label: "Make it move", discipline: "MOTION" },
  { label: "Build an interactive system", discipline: "SYSTEMS" },
];

export function RouteSelector() {
  const router = useRouter();

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1800px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Looking for something specific?</p>
        <div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-4">
          {routes.map((route) => (
            <button
              key={route.label}
              type="button"
              onClick={() => router.push("/work#work-index")}
              className="min-h-56 bg-[#f4f1e8] p-5 text-left transition hover:bg-[#ebe6d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{route.discipline}</span>
              <span className="mt-16 block text-3xl uppercase leading-none text-neutral-950">{route.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
