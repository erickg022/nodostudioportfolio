import type { Metadata } from "next";
import Image from "next/image";
import { PageTransition } from "@/components/PageTransition";
import { resources, socials } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources / NODO STUDIO",
  description: "Free resources by NODO STUDIO.",
  robots: { index: false, follow: false },
};

const linkFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

export default function RecursosPage() {
  return (
    <PageTransition>
      <section className="px-4 pb-8 pt-28 sm:px-6">
        <div className="mx-auto max-w-[1800px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            Resources / Recursos
          </p>
          <h1 className="mt-4 text-6xl uppercase leading-none text-neutral-950 sm:text-9xl">Recursos</h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-neutral-700">
            Free tools for creatives: prompts, workflows and kits I use in my own projects.
            <span className="mt-2 block text-neutral-500">
              Herramientas gratis para creativos, las mismas que uso en mis proyectos.
            </span>
          </p>
        </div>
      </section>

      <section aria-label="Resources" className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-[1800px] border-t border-black/10">
          {resources.map((resource, index) => (
            <article
              key={resource.slug}
              className="grid gap-8 border-b border-black/10 py-10 md:grid-cols-[1.1fr_0.9fr]"
            >
              {resource.image ? (
                <Image
                  src={resource.image.src}
                  alt={resource.image.alt}
                  width={resource.image.width}
                  height={resource.image.height}
                  priority={index === 0}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="aspect-[4/3] w-full bg-neutral-100 object-cover"
                />
              ) : (
                <div aria-hidden="true" className="aspect-[4/3] w-full bg-neutral-100" />
              )}

              <div className="flex flex-col justify-between gap-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                    ({String(index + 1).padStart(2, "0")})
                  </p>
                  <h2 className="mt-4 text-5xl uppercase leading-none text-neutral-950 sm:text-7xl">
                    {resource.title}
                  </h2>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    {resource.titleEs}
                  </p>
                  <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-700">{resource.description}</p>
                </div>

                <div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    {resource.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                  <a
                    href={resource.href}
                    {...(resource.download
                      ? { download: resource.download }
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className={`mt-6 inline-flex border border-black/20 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-950 transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${linkFocus}`}
                  >
                    {resource.cta}
                    <span aria-hidden="true" className="ml-3">-&gt;</span>
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 py-6 font-mono text-[11px] uppercase tracking-[0.18em]">
            <p className="text-neutral-500">More resources soon / Más recursos pronto</p>
            <div className="flex gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-neutral-950 underline-offset-4 transition hover:underline ${linkFocus}`}
                >
                  {social.label} {social.handle}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
