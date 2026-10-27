import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createGallery, type Gallery } from "./gallery";
import { createSphere, type Sphere, type SphereTile } from "./sphere";
import { loadTextures } from "./textures";
import type { OpenOrigin, RuntimeData } from "./types";

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
    const target = $(link.getAttribute("href")!);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView();
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

/**
 * Paper preloader: rolling 3-digit counter tied to texture loading, then the halves split.
 * Shown once per session; skipped with reduced motion.
 */
function initPreloader(
  load: (progress: (p: number) => void) => Promise<void>,
  reveal: () => void,
): Cleanup {
  const root = $("[data-mr='preloader']");
  let seen = false;
  try {
    seen = sessionStorage.getItem("mr:seen") === "1";
  } catch {}
  if (!root || seen || reducedMotion()) {
    root?.remove();
    load(() => {}).then(reveal);
    return () => {};
  }
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";

  const strips = $$("[data-col]", root).map((col) => col.firstElementChild as HTMLElement);
  const show = (n: number) => {
    const digits = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
    strips.forEach((strip, i) => {
      strip.style.transform = `translateY(${-digits[i]}em)`;
      if (i === 0) strip.parentElement!.style.opacity = digits[0] ? "1" : "0";
      if (i === 1) strip.parentElement!.style.opacity = n >= 10 ? "1" : "0";
    });
  };
  let shown = 0;
  let target = 0;
  const count = () => {
    shown += Math.max(0.25, (target - shown) * 0.12);
    shown = Math.min(shown, target);
    show(Math.floor(shown));
  };
  gsap.ticker.add(count);
  gsap.from($$("[data-pre-line]", root), {
    yPercent: 110,
    duration: 1,
    ease: "expo.out",
    stagger: 0.08,
  });

  let cancelled = false;
  const minTime = new Promise((r) => setTimeout(r, 1400));
  Promise.all([load((p) => (target = Math.round(p * 100))), minTime]).then(async () => {
    target = 100;
    await new Promise<void>((resolve) => {
      const wait = () => (shown >= 100 ? resolve() : requestAnimationFrame(wait));
      wait();
    });
    if (cancelled) return;
    gsap.ticker.remove(count);
    gsap
      .timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("mr:seen", "1");
          } catch {}
          document.documentElement.style.overflow = "";
          lenis?.start();
          root.remove();
        },
      })
      .to($$("[data-pre-line], [data-pre-count]", root), {
        yPercent: -110,
        duration: 0.7,
        ease: "expo.in",
        stagger: 0.04,
      })
      .add(reveal, "-=0.05")
      .to($(".mr-pre__half--top", root), { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "<")
      .to($(".mr-pre__half--bottom", root), { yPercent: 100, duration: 1.2, ease: "expo.inOut" }, "<");
  });
  return () => {
    cancelled = true;
    gsap.ticker.remove(count);
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

  close.addEventListener("click", dismiss);
  window.addEventListener("popstate", onPop);
  window.addEventListener("keydown", onKey);
  document.addEventListener("click", onClick);
  return {
    open,
    destroy() {
      close.removeEventListener("click", dismiss);
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
  const { projects }: RuntimeData = JSON.parse($("#mr-data")?.textContent ?? '{"projects":[]}');
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const tier = matchMedia("(max-width: 760px)").matches ? "sm" : "lg";

  let destroyed = false;
  let sphere: Sphere | null = null;
  let gallery: Gallery | null = null;
  const triggers: ScrollTrigger[] = [];
  const cleanups: Cleanup[] = [];
  // Synchronous tweens/sets live in a context so a teardown (e.g. React Strict Mode) restores the DOM.
  const ctx = gsap.context(() => {});

  cleanups.push(initSmoothScroll(), initClock());
  const overlay = initOverlay();
  cleanups.push(overlay.destroy, initWords(), initContact());

  const gl = hasWebGL();
  if (!gl) root.classList.add("mr--nogl");

  // Sphere tiles: the first six photographs of every project, interleaved.
  const tiles: SphereTile[] = [];
  for (let i = 0; i < 6; i++) {
    projects.forEach((p) => {
      const img = p.images[i];
      if (img) tiles.push({ src: img[tier], slug: p.slug, title: p.title, year: p.year });
    });
  }

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
    const urls = [...projects.map((p) => p.cover[tier]), ...tiles.map((t) => t.src)];
    return loadTextures(urls, progress).then((textures) => {
      if (destroyed) {
        textures.forEach((t) => t.dispose());
        return;
      }
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
            cursor.classList.remove("is-on");
            overlay.open(tile.slug, { rect, src: bySlug.get(tile.slug)?.cover[tier] ?? tile.src });
          },
        });
      }
      const galleryCanvas = $<HTMLCanvasElement>("[data-gallery]");
      if (galleryCanvas) {
        gallery = createGallery(
          galleryCanvas,
          projects.map((p) => ({ src: p.cover[tier], slug: p.slug })),
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
      ".mr-hero__notes > *, .mr-header > *",
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

  function bindScroll() {
    const s = sphere;
    const g = gallery;
    const hero = $("[data-mr='hero']")!;
    const notes = $(".mr-hero__notes")!;
    if (s) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => {
            s.setProgress(st.progress);
            notes.style.opacity = String(1 - Math.min(1, st.progress * 4));
          },
          onToggle: (st) => (st.isActive ? s.start() : s.stop()),
        }),
      );
      if (window.scrollY < hero.offsetHeight) s.start();
    }
    if (g) {
      const section = $("[data-mr='gallery']")!;
      const index = $("[data-g-index]")!;
      const title = $("[data-g-title]")!;
      const meta = $("[data-g-meta]")!;
      const link = $<HTMLAnchorElement>("[data-g-link]")!;
      g.onIndex((i) => {
        const p = projects[i];
        if (!p) return;
        index.textContent = String(i + 1).padStart(2, "0");
        link.href = `#project-${p.slug}`;
        gsap.fromTo(
          title,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.7,
            ease: "expo.out",
            onStart: () => {
              title.textContent = p.title;
            },
          },
        );
        meta.textContent = [p.client, p.year].filter(Boolean).join(", ");
      });
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => g.setProgress(st.progress),
          onToggle: (st) => (st.isActive ? g.start() : g.stop()),
        }),
      );
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
