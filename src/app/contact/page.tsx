import { ContactPanel } from "@/components/ContactPanel";
import { PageTransition } from "@/components/PageTransition";

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="px-4 pb-8 pt-28 sm:px-6">
        <div className="mx-auto max-w-[1800px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Contact</p>
          <h1 className="mt-4 max-w-6xl text-6xl uppercase leading-none text-neutral-950 sm:text-9xl">
            Build the next visual system.
          </h1>
        </div>
      </section>
      <ContactPanel />
    </PageTransition>
  );
}
