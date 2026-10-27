"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { volumeTwoProjects } from "@/data/volumeTwo";
import { InfiniteProjectCarousel } from "@/components/InfiniteProjectCarousel";

const carouselProjects: Project[] = volumeTwoProjects.map((project) => {
  if (project.slug === "airbnb") {
    return {
      ...project,
      coverVideo: {
        src: "/projects/airbnb/cover-final-720p.mp4",
        poster: "/projects/airbnb/film-final-poster.webp",
      },
    };
  }

  if (project.slug === "axe-ceremonia-ar-portal") {
    return {
      ...project,
      coverAvailable: true,
      coverVideo: {
        src: "/projects/videos/axe-ceremonia-ar-portal.mp4",
        poster: "/projects/videos/axe-ceremonia-ar-portal-poster.jpg",
      },
    };
  }

  if (project.slug === "lacoste-roland-garros") {
    return { ...project, coverAvailable: true };
  }

  if (project.slug === "nike-world-cup") {
    return {
      ...project,
      coverAvailable: true,
      coverVideo: {
        src: "/projects/videos/nike-installation-carousel.mp4",
        webmSrc: "/projects/videos/nike-installation-carousel.webm",
        poster: "/projects/videos/nike-installation-poster.jpg",
      },
    };
  }

  if (project.slug === "ginebra") {
    return {
      ...project,
      coverAvailable: true,
      coverVideo: {
        src: "/projects/videos/ginebra-vending.mp4",
        poster: "/projects/videos/ginebra-vending-poster.jpg",
      },
    };
  }

  if (project.slug === "twojeys") {
    return {
      ...project,
      coverAvailable: true,
      coverVideo: {
        src: "/projects/videos/twojeys-dawgs.mp4",
        poster: "/projects/videos/twojeys-dawgs-poster.jpg",
      },
    };
  }

  if (project.slug === "stussy-moncler") {
    return {
      ...project,
      coverAvailable: true,
      coverImage: "/projects/stussy-moncler-carousel.webp",
    };
  }

  if (project.slug === "eat-nudes") {
    return { ...project, coverAvailable: true };
  }

  if (project.slug === "gdl-movilidad") {
    return { ...project, coverAvailable: true };
  }

  if (project.slug === "play-in-motion") {
    return {
      ...project,
      coverAvailable: true,
    };
  }

  return project;
});

function useMadridTime() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Madrid",
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

export function SelectedWorks() {
  const router = useRouter();
  const restoreFocusRef = useRef<HTMLButtonElement | null>(null);
  const time = useMadridTime();

  const openProject = useCallback((project: Project, trigger: HTMLButtonElement) => {
    restoreFocusRef.current = trigger;
    router.push(`/work/${project.slug}`);
  }, [router]);

  return (
    <section
      id="selected-works"
      className="relative flex h-[100svh] flex-col overflow-hidden bg-white px-4 pb-5 pt-5 text-neutral-950 sm:px-6"
    >
      <div className="mx-auto grid h-[41svh] w-full max-w-[1920px] shrink-0 grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-[0.36fr_0.5fr_0.55fr_1fr]">
        <div aria-hidden="true" />
        <p className="self-start pt-1 font-mono text-[11px] font-normal uppercase leading-tight tracking-[0.22em] text-neutral-950 md:pt-0">
          LA - MX - ES
          <br />
          Working globally
        </p>
        <p className="self-start pt-1 font-mono text-[11px] font-normal uppercase leading-tight tracking-[0.22em] text-neutral-950 md:pt-0">
          Time Check
          <br />
          {time}
        </p>
        <nav className="hidden justify-self-end font-mono text-[11px] uppercase tracking-[0.22em] md:flex md:gap-12">
          <Link href="/work" className="underline-offset-4 hover:underline">
            Projects
          </Link>
          <a href="#about" className="underline-offset-4 hover:underline">
            About
          </a>
          <a href="#contact" className="underline-offset-4 hover:underline">
            - Info
          </a>
        </nav>

        <div className="relative col-span-2 md:col-span-4">
          <span className="absolute left-[30%] top-[78%] font-mono text-4xl font-light">+</span>
          <Image
            src="/brand/nodo-logo-cropped.png"
            alt="NODO Studio"
            width={2566}
            height={1255}
            priority
            className="absolute bottom-[32%] right-[3%] h-auto w-36 object-contain md:w-44"
          />
        </div>
      </div>

      <InfiniteProjectCarousel projects={carouselProjects} paused={false} onOpen={openProject} />

      <div className="mx-auto grid min-h-0 w-full max-w-[1920px] flex-1 grid-cols-1 gap-y-5 pt-6 md:grid-cols-[0.58fr_0.42fr] md:pt-8">
        <div className="relative min-h-0">
          <span className="absolute left-[28%] top-4 font-mono text-4xl font-light">+</span>
          <div className="absolute bottom-2 left-[2%] grid grid-cols-2 gap-16 font-mono text-[11px] font-normal uppercase tracking-[0.22em] md:text-sm">
            <span>30&deg; 58&apos; 57.504&apos;&apos; S</span>
            <span>119&deg; 6&apos; 45.612&apos;&apos; E</span>
          </div>
        </div>
        <div className="flex min-h-0 items-end justify-end">
          <p className="max-w-[720px] text-right font-mono text-[11px] font-normal uppercase leading-relaxed tracking-[0.12em] md:text-sm">
            Creative technology practice shaping visual worlds through AI, CGI and immersive media. We combine creative
            direction, real-time 3D, generative workflows and spatial experiences to create campaigns, digital identities
            and new forms of interaction.
          </p>
        </div>
      </div>
    </section>
  );
}
