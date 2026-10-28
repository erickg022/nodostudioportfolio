import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createGallery, type Gallery } from "./gallery";
import { createSphere, type Sphere, type SphereTile } from "./sphere";
import { VERTICAL_QUERY } from "./media";
import { resolveView, viewHref } from "@/content/portfolio";
import { loadTextures, type TextureMap } from "./textures";
import type { OpenOrigin, RuntimeData, RuntimeProject, RuntimeView } from "./types";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

type Cleanup = () => void;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

let lenis: Lenis | null = null;

/** Lenis smooth scroll driven by the GSAP ticker, plus smooth in-page anchor links. */
function initSmoothScroll(): Cleanup {
  if (!reducedMotion()) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
  }
  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
    if (!link || link.matches("[data-open], a[href^='#project-']")) return;
    let target = $(link.getAttribute("href")!);
    if (!target) return;
    // Sections hidden on this layout (the gallery on vertical screens) point to a fallback.
    if (!target.getClientRects().length && target.dataset.fallback) target = $(target.dataset.fallback);
    if (!target) return;
    const dest = target;
    e.preventDefault();
    const go = () => (lenis ? lenis.scrollTo(dest, { duration: 1.4 }) : dest.scrollIntoView());
    // Footer links inside a project overlay close it first, then scroll the page.
    if (link.closest("[data-mr='overlay']")) {
      window.dispatchEvent(new CustomEvent("mr:close"));
      setTimeout(go, 950);
    } else go();
  };
  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Header clock in the configured timezone. */
function initClock(): Cleanup {
  const el = $("[data-clock]");
  if (!el) return () => {};
  const timeZone = el.dataset.tz || undefined;
  const update = () => {
    try {
      el.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }).format(new Date());
    } catch {
      el.textContent = "";
    }
  };
  update();
  const id = setInterval(update, 2e4);
  return () => clearInterval(id);
}

type FrameSequence = {
  path: string;
  prefix: string;
  count: number;
  fps: number;
  startBuffer: number;
  lookahead: number;
  version: string;
};

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

/** Desktop: the preloader film; resolves when it has played through. */
function playPreloaderVideo(video: HTMLVideoElement, src: string, isCancelled: () => boolean) {
  return new Promise<void>((resolve) => {
    let retry: ReturnType<typeof setTimeout> | undefined;
    const done = () => {
      clearTimeout(retry);
      resolve();
    };
    video.hidden = false;
    video.src = src;
    video.preload = "auto";
    prepareVideoForAutoplay(video);
    const play = () => {
      if (isCancelled()) return done();
      prepareVideoForAutoplay(video);
      video.play().catch(() => {
        retry = setTimeout(play, 250);
      });
    };
    video.addEventListener("ended", done, { once: true });
    video.addEventListener("error", done, { once: true });
    video.addEventListener("timeupdate", () => {
      if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime >= video.duration - 0.08) done();
    });
    video.addEventListener("canplay", play, { once: true });
    video.addEventListener("loadeddata", play, { once: true });
    play();
  });
}

/** Portrait: the same animation as a JPG frame sequence drawn to a canvas. */
function playPreloaderFrames(canvas: HTMLCanvasElement, seq: FrameSequence, isCancelled: () => boolean) {
  return new Promise<void>((resolve) => {
    const context = canvas.getContext("2d");
    if (!context) return resolve();
    canvas.hidden = false;
    let raf = 0;
    let started = false;
    let startTime = 0;
    let current = 0;
    const frames = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();

    const draw = (image: HTMLImageElement) => {
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
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };
    const finish = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      resolve();
    };
    const load = (n: number) => {
      if (n < 1 || n > seq.count || frames.has(n) || loading.has(n)) return;
      loading.add(n);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loading.delete(n);
        frames.set(n, image);
        if (isCancelled()) return finish();
        if (n === 1) draw(image);
        if (!started && frames.size >= seq.startBuffer) {
          started = true;
          startTime = performance.now();
          raf = requestAnimationFrame(play);
        }
      };
      image.onerror = () => loading.delete(n);
      image.src = `${seq.path}/${seq.prefix}${String(n).padStart(4, "0")}.jpg?v=${seq.version}`;
    };
    const loadAround = (n: number) => {
      const end = Math.min(seq.count, n + seq.lookahead);
      for (let i = n; i <= end; i++) load(i);
    };
    const play = (time: number) => {
      if (isCancelled()) return finish();
      const n = Math.min(seq.count, Math.max(1, Math.floor(((time - startTime) / 1000) * seq.fps) + 1));
      if (n !== current) {
        current = n;
        const image = frames.get(n);
        if (image) draw(image);
        loadAround(n);
      }
      if (n >= seq.count) return finish();
      raf = requestAnimationFrame(play);
    };
    const onResize = () => {
      const image = frames.get(current) ?? frames.get(1);
      if (image) draw(image);
    };
    window.addEventListener("resize", onResize);
    loadAround(1);
  });
}

/**
 * NODO preloader from the previous site: the film on landscape screens, the frame sequence
 * on portrait ones (≤767px), on white. It stays up until both the animation has played and
 * the WebGL textures are ready, then fades out over 600ms while the hero rises.
 */
function initPreloader(
  load: (progress: (p: number) => void) => Promise<void>,
  reveal: () => void,
): Cleanup {
  const root = $("[data-mr='preloader']");
  if (!root || reducedMotion()) {
    root?.remove();
    load(() => {}).then(reveal);
    return () => {};
  }
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";

  let cancelled = false;
  const isCancelled = () => cancelled;
  const mobile = matchMedia("(max-width: 767px)").matches;
  const animation = mobile
    ? playPreloaderFrames($<HTMLCanvasElement>("canvas", root)!, JSON.parse(root.dataset.frames!), isCancelled)
    : playPreloaderVideo($<HTMLVideoElement>("video", root)!, root.dataset.video!, isCancelled);

  Promise.all([load(() => {}), animation]).then(() => {
    if (cancelled) return;
    root.dataset.visible = "false";
    document.documentElement.style.overflow = "";
    lenis?.start();
    reveal();
    setTimeout(() => root.remove(), 620);
  });
  return () => {
    cancelled = true;
  };
}

/** Full-screen project overlay with hash routes (#project-<slug>), Esc, Close and back button. */
function initOverlay() {
  const root = $("[data-mr='overlay']")!;
  const scroller = $("[data-scroll]", root)!;
  const close = $("[data-close]", root)!;
  const articles = new Map($$("[data-project]", root).map((a) => [a.dataset.project!, a]));
  let current: string | null = null;
  let pushed = false;
  let returnFocus: Element | null = null;

  const reveal = (article: HTMLElement) => {
    gsap.fromTo(
      $$(".mr-proj__title", article),
      { yPercent: 105 },
      { yPercent: 0, duration: 1.1, ease: "expo.out", delay: 0.05 },
    );
    gsap.fromTo(
      $$(".mr-proj__meta", article),
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.2 },
    );
  };
  const show = (slug: string) => {
    articles.forEach((a, s) => (a.hidden = s !== slug));
    scroller.scrollTop = 0;
    current = slug;
    $$<HTMLVideoElement>("video", articles.get(slug)).forEach((v) => v.play().catch(() => {}));
  };

  const open = (slug: string, origin?: OpenOrigin) => {
    const article = articles.get(slug);
    if (!article) return;
    if (current) {
      gsap.to(scroller, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          show(slug);
          gsap.to(scroller, { autoAlpha: 1, duration: 0.4 });
          gsap.fromTo(
            $(".mr-proj__cover img", article),
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.out" },
          );
          reveal(article);
        },
      });
      try {
        history.replaceState(null, "", `#project-${slug}`);
      } catch {}
      return;
    }
    returnFocus = document.activeElement;
    lenis?.stop();
    document.documentElement.classList.add("mr-locked");
    show(slug);
    root.hidden = false;
    try {
      if (location.hash !== `#project-${slug}`) {
        history.pushState({ mr: slug }, "", `#project-${slug}`);
        pushed = true;
      }
    } catch {}
    if (origin && !reducedMotion()) {
      gsap.set(root, { autoAlpha: 0 });
      const ghost = document.createElement("img");
      ghost.src = origin.src;
      ghost.className = "mr-ghost";
      Object.assign(ghost.style, {
        left: `${origin.rect.left}px`,
        top: `${origin.rect.top}px`,
        width: `${origin.rect.width}px`,
        height: `${origin.rect.height}px`,
      });
      document.body.appendChild(ghost);
      gsap.to(ghost, {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        duration: 1.05,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(root, { autoAlpha: 1 });
          gsap.to(ghost, { autoAlpha: 0, duration: 0.25, onComplete: () => ghost.remove() });
          reveal(article);
          // The overlay was invisible when focus was first requested below; retry now it is shown.
          close.focus({ preventScroll: true });
        },
      });
    } else {
      gsap.fromTo(
        root,
        { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: reducedMotion() ? 0 : 1,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(root, { clearProps: "clipPath" });
            reveal(article);
          },
        },
      );
    }
    close.focus({ preventScroll: true });
  };

  const hide = () => {
    if (!current) return;
    current = null;
    gsap.to(root, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: reducedMotion() ? 0 : 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        root.hidden = true;
        gsap.set(root, { clearProps: "clipPath,opacity,visibility" });
        $$<HTMLVideoElement>("video", root).forEach((v) => v.pause());
        document.documentElement.classList.remove("mr-locked");
        lenis?.start();
        (returnFocus as HTMLElement | null)?.focus?.({ preventScroll: true });
      },
    });
  };
  const dismiss = () => {
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch {}
      hide();
    }
  };
  const onPop = () => {
    const match = location.hash.match(/^#project-(.+)$/);
    if (match && articles.has(match[1])) open(match[1]);
    else hide();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && current) dismiss();
  };
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element).closest<HTMLElement>("[data-open], a[href^='#project-']");
    if (!link) return;
    const slug = link.dataset.open ?? link.getAttribute("href")!.replace("#project-", "");
    if (articles.has(slug)) {
      e.preventDefault();
      open(slug);
    }
  };

  const onCloseRequest = () => current && dismiss();
  close.addEventListener("click", dismiss);
  window.addEventListener("mr:close", onCloseRequest);
  window.addEventListener("popstate", onPop);
  window.addEventListener("keydown", onKey);
  document.addEventListener("click", onClick);
  return {
    open,
    destroy() {
      close.removeEventListener("click", dismiss);
      window.removeEventListener("mr:close", onCloseRequest);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    },
  };
}

/** About statement: words brighten with scroll. */
function initWords(): Cleanup {
  const words = $$("[data-word]");
  if (!words.length) return () => {};
  const tween = gsap.fromTo(
    words,
    { opacity: 0.14 },
    {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: {
        trigger: words[0].parentElement,
        start: "top 78%",
        end: "bottom 40%",
        scrub: true,
      },
    },
  );
  return () => tween.scrollTrigger?.kill();
}

/** Contact: letters stretch towards the pointer (idle wave without one), plus Copy email. */
function initContact(): Cleanup {
  const root = $("[data-mr='contact']");
  if (!root) return () => {};
  const letters = $$("[data-letter]", root);
  const scale = letters.map(() => 1);
  let px = -1e4;
  let py = -1e4;
  let pointer = false;
  let visible = false;
  let time = 0;
  const anchors: { x: number; y: number }[] = [];
  const measure = () => {
    letters.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      anchors[i] = { x: r.left + r.width / 2, y: r.bottom - r.height * 0.4 };
    });
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") {
      px = e.clientX;
      py = e.clientY;
      pointer = true;
    }
  };
  const onLeave = () => (pointer = false);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(root);
  const still = reducedMotion();
  const tick = (_: number, delta: number) => {
    if (!visible || still) return;
    time += delta / 1e3;
    if (pointer) measure();
    letters.forEach((el, i) => {
      let to = 1;
      if (pointer) {
        const dx = (px - anchors[i].x) / 160;
        const dy = (py - anchors[i].y) / 420;
        to = 1 + 0.95 * Math.exp(-(dx * dx + dy * dy));
      } else {
        to = 1 + 0.18 * Math.sin(time * 1.6 - i * 0.45) ** 2;
      }
      scale[i] += (to - scale[i]) * 0.12;
      el.style.transform = `scaleY(${scale[i].toFixed(3)})`;
    });
  };
  gsap.ticker.add(tick);

  const button = $<HTMLButtonElement>("[data-copy]", root);
  const copy = async () => {
    if (!button) return;
    const label = button.dataset.copyLabel ?? "Copy email";
    try {
      await navigator.clipboard.writeText(button.dataset.copy!);
      button.textContent = button.dataset.copiedLabel ?? "Email copied";
    } catch {
      const address = $(".mr-contact__address", root)!;
      const range = document.createRange();
      range.selectNodeContents(address);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      button.textContent = button.dataset.fallbackLabel ?? "Selected, press Copy";
    }
    setTimeout(() => (button.textContent = label), 2400);
  };
  button?.addEventListener("click", copy);
  return () => {
    gsap.ticker.remove(tick);
    io.disconnect();
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    button?.removeEventListener("click", copy);
  };
}

/** Boots the whole Meridian page. Returns a teardown function. */
export function initMeridian(): Cleanup {
  const root = $(".mr");
  if (!root) return () => {};
  const { projects, sphere: sphereData, views, defaultView }: RuntimeData = JSON.parse(
    $("#mr-data")?.textContent ?? '{"projects":[],"sphere":[],"views":[],"defaultView":"all"}',
  );
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const tier = matchMedia("(max-width: 760px)").matches ? "sm" : "lg";
  // The scroll-driven gallery is hidden on vertical screens (see VERTICAL_QUERY); skip its WebGL.
  const showGallery = !matchMedia(VERTICAL_QUERY).matches;

  // Active portfolio view (data-view on .mr), kept in sync with ?view= in the URL.
  let view: RuntimeView =
    views.find((v) => v.id === root.getAttribute("data-view")) ?? resolveView(views, null, defaultView);
  const viewProjects = (v: RuntimeView) =>
    v.slugs.flatMap((slug) => bySlug.get(slug) ?? ([] as RuntimeProject[]));
  const slidesFor = (v: RuntimeView) =>
    viewProjects(v).map((p) => ({ src: p.carouselCover[tier], slug: p.slug }));

  let destroyed = false;
  let sphere: Sphere | null = null;
  let gallery: Gallery | null = null;
  let galleryTrigger: ScrollTrigger | null = null;
  let galleryIndex = 0;
  let textureCache: TextureMap = new Map();
  const triggers: ScrollTrigger[] = [];
  const cleanups: Cleanup[] = [];
  // Synchronous tweens/sets live in a context so a teardown (e.g. React Strict Mode) restores the DOM.
  const ctx = gsap.context(() => {});

  cleanups.push(initSmoothScroll(), initClock());
  const overlay = initOverlay();
  cleanups.push(overlay.destroy, initWords(), initContact());

  const gl = hasWebGL();
  if (!gl) root.classList.add("mr--nogl");

  // Sphere tiles: one curated photograph per tile, no repeats; "nodo" shots are brand pieces without a project page.
  const tiles: SphereTile[] = sphereData.map((t) => {
    const p = bySlug.get(t.slug);
    return { src: t.textures[tier], slug: t.slug, title: p?.title ?? t.title ?? "NODO Studio", year: p?.year ?? "" };
  });

  const rise = $$(".mr-hero [data-rise]");
  ctx.add(() => gsap.set(rise, { yPercent: 110 }));
  const cursor = $("[data-cursor]")!;
  const cursorTitle = $("[data-cursor-title]", cursor)!;
  const cursorYear = $("[data-cursor-year]", cursor)!;
  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "expo.out" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "expo.out" });

  const load = (progress: (p: number) => void) => {
    if (!gl) {
      progress(1);
      return Promise.resolve();
    }
    // Only the active view's covers load up front; other views load when first opened.
    const urls = [...slidesFor(view).map((s) => s.src), ...tiles.map((t) => t.src)];
    return loadTextures(urls, progress).then((textures) => {
      if (destroyed) {
        textures.forEach((t) => t.dispose());
        return;
      }
      textureCache = textures;
      const sphereCanvas = $<HTMLCanvasElement>("[data-sphere]");
      if (sphereCanvas) {
        sphere = createSphere(sphereCanvas, tiles, textures, {
          onHover(tile, x, y) {
            cursor.classList.toggle("is-on", !!tile);
            if (tile) {
              cursorTitle.textContent = tile.title;
              cursorYear.textContent = tile.year;
              cursorX(x);
              cursorY(y);
            }
          },
          onOpen(tile, rect) {
            if (!bySlug.has(tile.slug)) return;
            cursor.classList.remove("is-on");
            overlay.open(tile.slug, { rect, src: bySlug.get(tile.slug)?.cover[tier] ?? tile.src });
          },
        });
      }
      const galleryCanvas = $<HTMLCanvasElement>("[data-gallery]");
      if (galleryCanvas && showGallery) {
        gallery = createGallery(
          galleryCanvas,
          slidesFor(view),
          textures,
          {
            onOpen(slide, rect) {
              overlay.open(slide.slug, { rect, src: slide.src });
            },
            onHover(on) {
              galleryCanvas.classList.toggle("is-hover", on);
            },
          },
        );
      }
      bindScroll();
    });
  };

  const reveal = () => {
    if (destroyed) return;
    gsap.to(rise, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, delay: 0.1 });
    gsap.fromTo(
      ".nd-hero__coords, .nd-hero__intro, .mr-header > *",
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.04, delay: 0.3 },
    );
    const s = sphere;
    if (s) {
      const intro = { v: 0 };
      gsap.to(intro, {
        v: 1,
        duration: reducedMotion() ? 0 : 2,
        ease: "expo.out",
        onUpdate: () => s.setIntro(intro.v),
      });
      if (!reducedMotion()) s.spin(0.09);
    }
    const initial =
      root.getAttribute("data-open-initial") || location.hash.match(/^#project-(.+)$/)?.[1];
    if (initial && bySlug.has(initial)) setTimeout(() => overlay.open(initial), 400);
  };

  const info = {
    index: $("[data-g-index]"),
    total: $("[data-g-total]"),
    title: $("[data-g-title]"),
    meta: $("[data-g-meta]"),
    link: $<HTMLAnchorElement>("[data-g-link]"),
  };
  /** Number, title, client and link for slide `i` of the active view. */
  function showSlide(i: number, animate = true) {
    const p = viewProjects(view)[i];
    if (!p) return;
    galleryIndex = i;
    if (info.index) info.index.textContent = String(i + 1).padStart(2, "0");
    if (info.link) info.link.href = `#project-${p.slug}`;
    if (info.meta) info.meta.textContent = [p.client, p.year].filter(Boolean).join(", ");
    const title = info.title;
    if (!title) return;
    if (!animate || reducedMotion()) {
      title.textContent = p.title;
      return;
    }
    gsap.fromTo(
      title,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.7, ease: "expo.out", onStart: () => void (title.textContent = p.title) },
    );
  }

  /** Scrolls the gallery section so slide `i` of the active view is in front. */
  function goToSlide(i: number, duration = 0.9) {
    const st = galleryTrigger;
    const count = gallery?.count ?? 0;
    if (!st || count < 1) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    const y = st.start + (st.end - st.start) * (count > 1 ? clamped / (count - 1) : 0);
    if (lenis) lenis.scrollTo(y, { duration: reducedMotion() ? 0 : duration, immediate: reducedMotion() });
    else window.scrollTo({ top: y, behavior: reducedMotion() ? "auto" : "smooth" });
  }

  const tabs = $$<HTMLAnchorElement>("[data-view-tab]");
  const panel = $("#work-panel");
  const galleryCanvasEl = $<HTMLCanvasElement>("[data-gallery]");
  let swapToken = 0;

  /** Activates a portfolio view: tabs, counter, swipe reel, URL and the WebGL slides. */
  function setView(id: string, push: boolean) {
    const next = views.find((v) => v.id === id);
    if (!next || next.id === view.id) return;
    view = next;
    root!.setAttribute("data-view", next.id);
    tabs.forEach((t) => {
      const on = t.dataset.viewTab === next.id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel?.setAttribute("aria-labelledby", `work-tab-${next.id}`);
    if (info.total) info.total.textContent = String(viewProjects(next).length).padStart(2, "0");
    $$<HTMLOListElement>("[data-reel]").forEach((list) => {
      list.hidden = list.dataset.reel !== next.id;
      if (!list.hidden) list.scrollLeft = 0;
    });
    showSlide(0, false);
    if (push) {
      const url = viewHref(next.param, location.pathname);
      history.pushState({ mrView: next.id }, "", url);
    }
    swapGallery(next);
  }

  /** Fades the canvas, loads any covers this view has not used yet, swaps the slides, returns to slide 1. */
  function swapGallery(next: RuntimeView) {
    const g = gallery;
    const canvas = galleryCanvasEl;
    if (!g || !canvas) return;
    const token = ++swapToken;
    const slides = slidesFor(next);
    const missing = slides.map((s) => s.src).filter((src) => !textureCache.has(src));
    const fade = reducedMotion() ? 0 : 280;
    canvas.classList.add("is-switching");
    // Back to the first project: the gallery is scroll-driven, so return to the top of its section.
    const st = galleryTrigger;
    if (st && st.progress > 0 && st.isActive) goToSlide(0, 0.8);
    Promise.all([
      missing.length ? loadTextures(missing, () => {}) : Promise.resolve(new Map() as TextureMap),
      new Promise((r) => setTimeout(r, fade)),
    ]).then(([loaded]) => {
      if (destroyed || token !== swapToken) {
        if (destroyed) loaded.forEach((t) => t.dispose());
        else loaded.forEach((t, src) => textureCache.set(src, t));
        return;
      }
      loaded.forEach((t, src) => textureCache.set(src, t));
      g.setSlides(slides, textureCache);
      if (galleryTrigger) g.setProgress(galleryTrigger.isActive ? galleryTrigger.progress : 0);
      showSlide(0, false);
      canvas.classList.remove("is-switching");
    });
  }

  function initViews(): Cleanup {
    const onTabClick = (e: MouseEvent) => {
      const tab = (e.target as Element).closest<HTMLAnchorElement>("[data-view-tab]");
      if (!tab || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      setView(tab.dataset.viewTab!, true);
    };
    // Arrow keys move between tabs (and activate them), as in a standard tablist.
    const onTabKey = (e: KeyboardEvent) => {
      const i = tabs.indexOf(e.target as HTMLAnchorElement);
      if (i < 0) return;
      const to =
        e.key === "ArrowRight" ? (i + 1) % tabs.length
        : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length
        : e.key === "Home" ? 0
        : e.key === "End" ? tabs.length - 1
        : -1;
      if (to < 0) return;
      e.preventDefault();
      e.stopPropagation();
      tabs[to].focus();
      setView(tabs[to].dataset.viewTab!, true);
    };
    // While the gallery is on screen, left/right step through its projects.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (!galleryTrigger?.isActive || e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable], [data-mr='overlay']")) return;
      if (!$("[data-mr='overlay']")?.hidden) return;
      e.preventDefault();
      goToSlide(galleryIndex + (e.key === "ArrowRight" ? 1 : -1));
    };
    const onPop = () => {
      const next = resolveView(views, new URL(location.href).searchParams.get("view"), defaultView);
      if (next.id !== view.id) setView(next.id, false);
    };
    // Swipe reel (vertical screens): keep the counter on the card nearest the left edge.
    const reels = $$<HTMLOListElement>("[data-reel]");
    const onReelScroll = (e: Event) => {
      const list = e.currentTarget as HTMLOListElement;
      const item = list.firstElementChild as HTMLElement | null;
      if (!item || list.hidden) return;
      const step = item.offsetWidth + parseFloat(getComputedStyle(list).columnGap || "0");
      const i = Math.round(list.scrollLeft / Math.max(1, step));
      if (info.index) info.index.textContent = String(i + 1).padStart(2, "0");
    };
    document.addEventListener("click", onTabClick);
    tabs.forEach((t) => t.addEventListener("keydown", onTabKey));
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    reels.forEach((r) => r.addEventListener("scroll", onReelScroll, { passive: true }));
    return () => {
      document.removeEventListener("click", onTabClick);
      tabs.forEach((t) => t.removeEventListener("keydown", onTabKey));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      reels.forEach((r) => r.removeEventListener("scroll", onReelScroll));
    };
  }
  cleanups.push(initViews());
  // Shared links (/?view=visual, /?view=tech): switch before WebGL loads, while the preloader still covers the page.
  setView(resolveView(views, new URL(location.href).searchParams.get("view"), defaultView).id, false);

  function bindScroll() {
    const s = sphere;
    const g = gallery;
    const hero = $("[data-mr='hero']")!;
    const notes = $$(".nd-hero__coords, .nd-hero__intro");
    if (s) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => {
            s.setProgress(st.progress);
            const fade = String(1 - Math.min(1, st.progress * 4));
            notes.forEach((n) => (n.style.opacity = fade));
          },
          onToggle: (st) => (st.isActive ? s.start() : s.stop()),
        }),
      );
      if (window.scrollY < hero.offsetHeight) s.start();
    }
    if (g) {
      const section = $("[data-mr='gallery']")!;
      g.onIndex(showSlide);
      galleryTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (st) => gallery?.setProgress(st.progress),
        onToggle: (st) => (st.isActive ? gallery?.start() : gallery?.stop()),
      });
      triggers.push(galleryTrigger);
      g.start();
      requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        if (r.top > innerHeight || r.bottom < 0) g.stop();
      });
    }
    ScrollTrigger.refresh();
  }

  ctx.add(() => cleanups.push(initPreloader(load, reveal)));

  return () => {
    destroyed = true;
    cleanups.reverse().forEach((fn) => fn());
    triggers.forEach((t) => t.kill());
    (sphere as Sphere | null)?.destroy();
    (gallery as Gallery | null)?.destroy();
    ctx.revert();
  };
}
