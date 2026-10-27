import Link from "next/link";

export function ContactPanel() {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-[1800px] gap-8 border-y border-black/10 py-10 md:grid-cols-[1.1fr_0.9fr]">
        <h2 className="max-w-5xl text-5xl uppercase leading-none text-neutral-950 sm:text-7xl">
          Available for selected collaborations across image, space, motion, and systems.
        </h2>
        <div className="self-end">
          <p className="max-w-xl text-xl leading-relaxed text-neutral-700">
          For interactive systems, AI/CGI visual worlds, AR prototypes, spatial campaigns, accessible interfaces, and digital brand experiences.
          </p>
          <Link
            href="mailto:[EMAIL]"
            className="mt-8 inline-flex border border-black/20 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-950 transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            [EMAIL]
          </Link>
        </div>
      </div>
    </section>
  );
}
