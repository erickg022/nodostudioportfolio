"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PRELOADER_VIDEO_SRC = "/video/nodo-preload-desktop.mp4?v=20260823-1";
const MOBILE_FRAME_PATH = "/video/preload-jpg-v2";
const MOBILE_FRAME_COUNT = 111;
const MOBILE_FRAME_FPS = 25;
const MOBILE_FRAME_START_BUFFER = 18;
const MOBILE_FRAME_LOOKAHEAD = 36;

export function SitePreloader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [mode, setMode] = useState<"desktop" | "mobile" | null>(null);

  const finishPreloader = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setVisible(false);
    window.setTimeout(() => setMounted(false), 620);
  }, []);

  const setVideoRef = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (!video) return;

    prepareVideoForAutoplay(video);
  }, []);

  useEffect(() => {
    // Pre-existing legacy pattern (only /recursos uses this); reads the viewport after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
  }, []);

  useEffect(() => {
    if (mode !== "desktop") return;

    const video = videoRef.current;
    if (!video) return;

    let retryTimer: number | undefined;

    const playVideo = () => {
      prepareVideoForAutoplay(video);

      video.play().catch((error) => {
        console.warn("Preloader autoplay was blocked:", error);
        retryTimer = window.setTimeout(playVideo, 250);
      });
    };

    video.addEventListener("canplay", playVideo, { once: true });
    video.addEventListener("loadeddata", playVideo, { once: true });
    playVideo();

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "mobile") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let started = false;
    let startTime = 0;
    let currentFrame = 0;
    let cancelled = false;
    const frames = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();

    const drawFrame = (image: HTMLImageElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      const drawHeight = imageRatio > canvasRatio ? width / imageRatio : height;
      const drawWidth = imageRatio > canvasRatio ? width : height * imageRatio;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const loadFrame = (frameNumber: number) => {
      if (
        frameNumber < 1 ||
        frameNumber > MOBILE_FRAME_COUNT ||
        frames.has(frameNumber) ||
        loading.has(frameNumber)
      ) {
        return;
      }

      loading.add(frameNumber);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loading.delete(frameNumber);
        frames.set(frameNumber, image);

        if (cancelled) return;
        if (frameNumber === 1) drawFrame(image);

        if (!started && frames.size >= MOBILE_FRAME_START_BUFFER) {
          started = true;
          startTime = performance.now();
          animationFrame = window.requestAnimationFrame(playSequence);
        }
      };
      image.onerror = () => {
        loading.delete(frameNumber);
      };
      image.src = `${MOBILE_FRAME_PATH}/preload-${String(frameNumber).padStart(4, "0")}.jpg?v=20260803-5`;
    };

    const loadAroundFrame = (frameNumber: number) => {
      const end = Math.min(MOBILE_FRAME_COUNT, frameNumber + MOBILE_FRAME_LOOKAHEAD);
      for (let index = frameNumber; index <= end; index += 1) loadFrame(index);
    };

    const playSequence = (time: number) => {
      if (cancelled) return;

      const elapsed = time - startTime;
      const frameNumber = Math.min(
        MOBILE_FRAME_COUNT,
        Math.max(1, Math.floor((elapsed / 1000) * MOBILE_FRAME_FPS) + 1),
      );

      if (frameNumber !== currentFrame) {
        currentFrame = frameNumber;
        const image = frames.get(frameNumber);
        if (image) drawFrame(image);
        loadAroundFrame(frameNumber);
      }

      if (frameNumber >= MOBILE_FRAME_COUNT) {
        finishPreloader();
        return;
      }

      animationFrame = window.requestAnimationFrame(playSequence);
    };

    const handleResize = () => {
      const image = frames.get(currentFrame) ?? frames.get(1);
      if (image) drawFrame(image);
    };

    window.addEventListener("resize", handleResize);
    loadAroundFrame(1);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [finishPreloader, mode]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    if (video.currentTime >= video.duration - 0.08) finishPreloader();
  }, [finishPreloader]);

  if (!mounted) return null;

  return (
    <div className="site-preloader" data-visible={visible} aria-hidden="true">
      {mode === "mobile" ? (
        <canvas ref={canvasRef} className="site-preloader__video" />
      ) : null}

      {mode === "desktop" ? (
        <video
          ref={setVideoRef}
          className="site-preloader__video"
          autoPlay
          muted
          playsInline
          loop={false}
          preload="auto"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={finishPreloader}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={PRELOADER_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

function prepareVideoForAutoplay(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.playsInline = true;
  video.controls = false;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.removeAttribute("controls");
}
