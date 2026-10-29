import Image from "next/image";
import { projects } from "@/data/projects";
import { ProjectMedia } from "@/components/ProjectMedia";

const stripProjects = [...projects, ...projects];

export function SignalArchiveSection() {
  return (
    <section className="relative min-h-screen overflow-hidden border-y border-black/10 bg-[#f7f6f1] px-4 py-8 text-neutral-950 sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] grain" />
      <div className="absolute inset-x-0 top-0 h-2 bg-black" />

      <div className="relative mx-auto min-h-[calc(100svh-4rem)] max-w-[1920px]">
        <div className="absolute left-[4vw] top-[7vh] h-[28vh] w-[12vw] min-w-28">
          <Image
            src="/brand/nodo-d.png"
            alt="NODO D mark"
            fill
            sizes="18vw"
            className="object-contain object-left-top"
          />
        </div>

        <p className="absolute left-1/2 top-[7vh] -translate-x-1/2 font-mono text-lg font-bold uppercase tracking-[-0.02em] md:text-2xl">
          BASED IN madrid / cdmx/LA
        </p>

        <div className="absolute right-[1vw] top-[5.5vh] h-6 w-28 border border-black/30 bg-black/80 opacity-90" />

        <div className="absolute left-1/2 top-[43%] w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <div className="nodo-slow-image-marquee flex w-max gap-2">
            {stripProjects.map((project, index) => (
              <div
                key={`${project.slug}-signal-${index}`}
                className="relative h-[118px] w-[255px] shrink-0 overflow-hidden border border-black/15 bg-[#ded7c8] md:h-[150px] md:w-[360px]"
              >
                <ProjectMedia project={project} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-[43%] flex -translate-y-1/2 flex-col items-center gap-14">
          <span className="h-3 w-3 rounded-full bg-black" />
          <span className="h-3 w-3 rounded-full bg-black" />
          <span className="h-3 w-3 rounded-full bg-black" />
        </div>

        <div className="absolute bottom-[10vh] left-[2vw] max-w-[1040px]">
          <p className="font-mono text-2xl font-bold uppercase tracking-[-0.04em] md:text-3xl">CV6</p>
          <p className="mt-5 max-w-[1180px] font-mono text-[clamp(1.25rem,2.1vw,2.45rem)] font-bold uppercase leading-[0.82] tracking-[-0.08em]">
            EXPLANATION &amp; MEANING
            <br />
            ON THE BASIS OF CHANGE&nbsp;&nbsp; THINGS CAN BE EXPLAINED AND REASONED
            <br />
            YET MEANING IS WITHIN A DIFFERENT DIMENSION , LOCATION PENDING /
          </p>
          <div className="mt-4 grid grid-cols-[1fr_1fr] gap-8 font-mono text-[clamp(1rem,1.65vw,2rem)] font-bold uppercase leading-none tracking-[-0.05em]">
            <span>30° 58&apos; 57.504&apos;&apos; S</span>
            <span>119° 6&apos; 45.612&apos;&apos; E</span>
          </div>
        </div>

        <div className="absolute bottom-[2.5vh] right-[1vw] h-6 w-6 bg-black" />
      </div>
    </section>
  );
}
