"use client";

import { useEffect, useRef } from "react";
import { HERO_VIDEO_POSTER, HERO_VIDEO_SRC, HERO_VIDEO_WEBM_SRC } from "@/data/homepageAssets";

function VideoSources() {
  return (
    <>
      <source src={HERO_VIDEO_SRC} type="video/mp4" />
      <source src={HERO_VIDEO_WEBM_SRC} type="video/webm" />
    </>
  );
}

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <section aria-label="Homepage hero video" className="relative h-svh min-h-svh w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 block h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={HERO_VIDEO_POSTER}
        aria-label="Abstract match-cut hero video for NODO STUDIO"
      >
        <VideoSources />
      </video>
    </section>
  );
}
