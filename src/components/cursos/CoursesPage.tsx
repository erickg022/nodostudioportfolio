"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NodoHeader } from "@/components/meridian/NodoHeader";
import { SiteFooter } from "@/components/meridian/SiteFooter";
import type { Course, CourseMedia } from "@/content/courses";
import type { coursesSettings } from "@/content/courses";

type Settings = typeof coursesSettings;
type Phase = "info" | "form";

const LOGO = "/cursos/nodo-logo.webp";
const pad = (n: number) => String(n).padStart(2, "0");

/** Seconds each slide stays up before the gallery moves on by itself. */
const SLIDE_MS = { image: 4200, video: 8000 };

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
}

/** Image or muted looping video; videos only load when `play` is on. */
function Media({ media, className, play = true }: { media: CourseMedia; className?: string; play?: boolean }) {
  if (media.type === "video") {
    return (
      <video
        className={className}
        src={play ? media.src : undefined}
        poster={media.poster}
        muted
        loop
        playsInline
        autoPlay={play}
        preload={play ? "metadata" : "none"}
        aria-label={media.alt || undefined}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={media.src} alt={media.alt} loading="lazy" decoding="async" />;
}

export function CoursesPage({ courses, settings, wheel }: { courses: Course[]; settings: Settings; wheel: CourseMedia[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [phase, setPhase] = useState<Phase>("info");
  const [learnAt, setLearnAt] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const openIndex = courses.findIndex((c) => c.slug === openSlug);
  const course = openIndex >= 0 ? courses[openIndex] : null;
  const n = course?.gallery.length ?? 1;
  const current = course?.gallery[slide % n];
  const slideMs = current?.type === "video" ? SLIDE_MS.video : SLIDE_MS.image;
  const auto = !!course && !reduced;

  const open = useCallback((slug: string | null) => {
    setOpenSlug(slug);
    setSlide(0);
    setPhase("info");
    setLearnAt(0);
    sheetRef.current?.scrollTo({ top: 0 });
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("curso", slug);
    else url.searchParams.delete("curso");
    window.history.replaceState(null, "", url);
  }, []);

  // ?curso=<slug> opens a workshop directly (shareable links per workshop).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("curso");
    if (slug && courses.some((c) => c.slug === slug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSlug(slug);
    }
  }, [courses]);

  // Lock the page behind the sheet; Escape closes it.
  useEffect(() => {
    if (!course) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [course, open]);

  // The gallery moves on by itself; any manual step restarts the timer.
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % n), slideMs);
    return () => window.clearTimeout(t);
  }, [auto, slide, n, slideMs]);

  // "¿Qué aprenderás?": the sticky image follows the item in the middle of the screen.
  useEffect(() => {
    const root = sheetRef.current;
    if (!course || !root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-learn]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setLearnAt(Number((e.target as HTMLElement).dataset.learn));
      },
      { root, rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [course]);

  const go = (i: number) => setSlide(((i % n) + n) % n);
  const at = (i: number) => course!.gallery[((i % n) + n) % n];

  const prereg = () => {
    setPhase("form");
    requestAnimationFrame(() => document.getElementById("cx-prereg")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
  };

  // "Conocer más": carry on down into the workshop.
  const more = () => {
    const sheet = sheetRef.current;
    const target = sheet?.querySelector<HTMLElement>(".cx-reel");
    if (sheet && target) sheet.scrollTo({ top: target.offsetTop - 56, behavior: reduced ? "auto" : "smooth" });
  };

  const tallySrc =
    course && settings.tallyFormId
      ? `https://tally.so/embed/${settings.tallyFormId}?curso=${course.slug}&hideTitle=1&transparentBackground=1&dynamicHeight=1`
      : null;

  return (
    <div className="cx">
      <NodoHeader base="/" />

      {/* HERO */}
      <section className="cx-hero">
        <div className="cx-hero__text">
          <p className="cx-mono cx-muted cx-small cx-r1">{settings.season} — Preregistro abierto</p>
          <div className="cx-hero__body">
            <h1 className="cx-h1 cx-r2">{settings.title}</h1>
            <div className="cx-hero__lead cx-r3">
              {settings.intro.map((p) => (
                <p key={p} className="cx-lead">
                  {p}
                </p>
              ))}
            </div>
            <div className="cx-r4">
              <a className="cx-btn" href="#cursos">
                {settings.cta} <span aria-hidden="true">→</span>
              </a>
            </div>
            <dl className="cx-meta cx-r4">
              <div>
                <dt>Workshops</dt>
                <dd>Arquitectura · Campañas · Creative Tech</dd>
              </div>
              <div>
                <dt>Te llevas</dt>
                <dd>Un proyecto propio para tu portafolio</dd>
              </div>
              <div>
                <dt>Inscripción</dt>
                <dd>Preregistro, sin pago hoy</dd>
              </div>
              <div>
                <dt>Por</dt>
                <dd>NODO Studio — LA · MX · ES</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="cx-wheel-wrap" aria-hidden="true">
          <div className="cx-wheel">
            {wheel.map((m, i) => (
              <div key={i} className="cx-wcard" style={{ "--a": `${(360 / wheel.length) * i}deg` } as React.CSSProperties}>
                <Media media={m} className="cx-cover" />
                <span className="cx-wtag">{m.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating pill */}
      <div className="cx-pill-row">
        <div className="cx-pill">
          <span>{courses.length} workshops</span>
          <span className="cx-pill__sep" aria-hidden="true">
            |
          </span>
          <span>Plazas limitadas</span>
          <a className="cx-pill__btn" href="#cursos">
            Ver workshops <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* LOGO + TICKER */}
      <section className="cx-word" aria-label="NODO Workshops">
        <p className="cx-word__text" aria-hidden="true">
          Workshops—01
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="NODO" className="cx-word__logo" width={900} height={440} />
      </section>
      <div className="cx-ticker cx-mono" aria-hidden="true">
        <div className="cx-ticker__track">
          {[0, 1].map((k) => (
            <span key={k}>
              {courses.map((c) => (
                <span key={c.slug}>
                  {c.title} — {c.focus}
                </span>
              ))}
              <span>Preregistro abierto — sin pago</span>
            </span>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section id="cursos" className="cx-collection">
        <div className="cx-collection__head cx-mono">
          <h2>
            NODO <span className="cx-indent">Todos los workshops</span>
            <br />
            Explora la colección <span className="cx-muted">01—{pad(courses.length)}</span>
          </h2>
          <span className="cx-small">Toca un workshop para conocer más [+]</span>
        </div>
        <div className="cx-grid">
          {courses.map((c) => (
            <button key={c.slug} type="button" className="cx-card" onClick={() => open(c.slug)} aria-label={`Conocer más: ${c.title}`}>
              <span className="cx-card__img">
                <Media media={c.cover} className="cx-cover cx-card__media" />
                <span className="cx-card__over">
                  <span className="cx-mono cx-small">Workshop {c.num}</span>
                  <span className="cx-card__title">{c.title}</span>
                  {c.subtitle && <span className="cx-card__sub">{c.subtitle}</span>}
                  <span className="cx-card__tag">{c.tagline}</span>
                  <span className="cx-card__more cx-mono">
                    Conocer más <span aria-hidden="true">→</span>
                  </span>
                </span>
              </span>
              <span className="cx-card__cap cx-mono">
                <span>
                  <span>Workshop {c.num}</span>
                  <span>{c.focus}</span>
                </span>
                <span className="cx-right">
                  {c.seats && <span>Solo {c.seats}</span>}
                  <span>
                    Preventa {c.price} <span className="cx-plus" aria-hidden="true">+</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section className="cx-how">
        <div className="cx-how__title">
          <p className="cx-mono cx-muted">Cómo funciona</p>
          <h2 className="cx-h2">Hoy solo apartas tu lugar.</h2>
        </div>
        <div className="cx-table cx-mono">
          <div className="cx-row3">
            <span className="cx-muted">01</span>
            <span>Elige</span>
            <span className="cx-soft">Revisa qué vas a crear, el temario y el precio de cada workshop.</span>
          </div>
          <div className="cx-row3">
            <span className="cx-muted">02</span>
            <span>Preregístrate</span>
            <span className="cx-soft">Nombre y correo. No se cobra nada hoy.</span>
          </div>
          <div className="cx-row3">
            <span className="cx-muted">03</span>
            <span>Prepárate</span>
            <span className="cx-soft">Te escribimos con la fecha, el precio de preventa y cómo preparar tus herramientas.</span>
          </div>
        </div>
      </section>

      <SiteFooter id="contact" base="/" />

      {/* DETAIL SHEET */}
      {course && current && (
        <div ref={sheetRef} className="cx-sheet" role="dialog" aria-modal="true" aria-label={course.title}>
          <div className="cx-sheet__bar">
            <button type="button" className="cx-ln" onClick={() => open(null)}>
              ← Todos los workshops
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="NODO" className="cx-sheet__logo" width={900} height={440} />
            <button type="button" className="cx-ln cx-end" onClick={() => open(courses[(openIndex + 1) % courses.length].slug)}>
              Siguiente workshop →
            </button>
          </div>

          {/* Opening: name, specs, price + the gallery that moves by itself */}
          <section className="cx-detail">
            <div className="cx-detail__info">
              <p className="cx-mono cx-small cx-soft">
                Workshop {course.num}/{pad(courses.length)}
                {course.seats && <span className="cx-seats"> · Solo {course.seats}</span>}
              </p>
              <h2 className="cx-detail__title">
                {course.title}
                {course.subtitle && <span className="cx-detail__sub">{course.subtitle}</span>}
              </h2>
              <p className="cx-lead">{course.tagline}</p>
              <div className="cx-specs cx-mono">
                {course.specs.map(([k, v]) => (
                  <div key={k} className="cx-spec">
                    <span className="cx-soft">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
                <div className="cx-spec">
                  <span className="cx-soft">Preventa</span>
                  <span>
                    {course.price} {course.regularPrice && <s className="cx-muted">{course.regularPrice}</s>}
                  </span>
                </div>
              </div>
              <div className="cx-actions">
                <button type="button" className="cx-btn" onClick={prereg}>
                  Preregistrarme — sin pago <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="cx-more cx-mono" onClick={more}>
                  Conocer más <span className="cx-more__arrow" aria-hidden="true">↓</span>
                </button>
              </div>
            </div>

            <div className="cx-detail__gallery">
              <div className="cx-stack">
                <div className="cx-stack__card cx-stack__back2">
                  <Media media={at(slide + 2)} className="cx-cover" play={false} />
                </div>
                <div className="cx-stack__card cx-stack__back1">
                  <Media media={at(slide + 1)} className="cx-cover" play={false} />
                </div>
                <div key={slide} className="cx-stack__card cx-stack__front">
                  <Media media={current} className="cx-cover cx-kenburns" />
                </div>
              </div>
              <div className="cx-progress" aria-hidden="true">
                <span key={`${slide}-${auto}`} className={auto ? "is-run" : undefined} style={{ animationDuration: `${slideMs}ms` }} />
              </div>
              <div className="cx-gallery__nav cx-mono">
                <span>{current.caption}</span>
                <span className="cx-arrows">
                  <button type="button" className="cx-arrow" onClick={() => go(slide - 1)} aria-label="Anterior">
                    ←
                  </button>
                  <span>
                    {pad(slide + 1)} / {pad(n)}
                  </span>
                  <button type="button" className="cx-arrow" onClick={() => go(slide + 1)} aria-label="Siguiente">
                    →
                  </button>
                </span>
              </div>
            </div>
          </section>

          {/* What you can make: endless strip */}
          <section className="cx-reel" aria-label="Lo que puedes crear">
            <p className="cx-reel__title cx-mono">
              Lo que puedes crear <span className="cx-muted">{pad(n)} piezas</span>
            </p>
            <div className="cx-reel__viewport">
              <div className="cx-reel__track" style={{ animationDuration: `${n * 6}s` }}>
                {[0, 1].map((k) =>
                  course.gallery.map((m, i) => (
                    <button
                      key={`${k}-${i}`}
                      type="button"
                      className="cx-reel__item"
                      onClick={() => {
                        go(i);
                        sheetRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
                      }}
                      aria-label={`Ver ${m.caption}`}
                      tabIndex={k ? -1 : 0}
                      aria-hidden={k ? true : undefined}
                    >
                      <span className="cx-reel__img">
                        <Media media={m} className="cx-cover" play={false} />
                      </span>
                      <span className="cx-reel__cap cx-mono">{m.caption}</span>
                    </button>
                  )),
                )}
              </div>
            </div>
          </section>

          {/* The workshop */}
          <section className="cx-intro">
            <p className="cx-label cx-mono">El workshop</p>
            <div className="cx-intro__body">
              {course.intro.map((p, i) => (
                <p key={p} className={i === 0 ? "cx-intro__first" : "cx-intro__p"}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* What you'll learn: sticky image follows the list */}
          <section className="cx-learn">
            <div className="cx-learn__media">
              <div className="cx-learn__frame">
                <div key={learnAt} className="cx-learn__img">
                  <Media media={at(learnAt + 1)} className="cx-cover cx-kenburns" />
                </div>              </div>
            </div>
            <div className="cx-learn__list">
              <p className="cx-label cx-mono">¿Qué aprenderás?</p>
              <ol>
                {course.learn.map((item, i) => (
                  <li key={item} data-learn={i} className={i === learnAt ? "is-on" : undefined}>
                    <span className="cx-mono cx-muted">{pad(i + 1)}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* What you'll take home: one outcome per card */}
          <section className="cx-take">
            <div className="cx-take__head">
              <p className="cx-label cx-mono">¿Qué te llevarás?</p>
              <p className="cx-take__closing">{course.closing}</p>
            </div>
            <div className="cx-take__grid">
              {course.takeaways.map((t, i) => (
                <figure key={t} className="cx-take__card">
                  <span className="cx-take__img">
                    <Media media={at(i * 2 + 3)} className="cx-cover cx-drift" play={false} />
                  </span>
                  <figcaption>
                    <span className="cx-mono cx-muted cx-small">{pad(i + 1)}</span>
                    <span>{t}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="cx-req">
            <p className="cx-label cx-mono">Materiales y requisitos</p>
            <ul className="cx-req__list">
              {course.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="cx-req__note">
              <span className="cx-mono cx-small">Importante</span>
              {course.note}
            </p>
          </section>

          {/* Preregistration */}
          <section id="cx-prereg" className="cx-cta">
            <div className="cx-cta__bg" aria-hidden="true">
              <Media media={at(slide)} className="cx-cover cx-drift" play={false} />
            </div>
            <div className="cx-cta__inner">
              <p className="cx-mono cx-small">
                Preregistro — Workshop {course.num}
                {course.seats && ` · Solo ${course.seats}`}
              </p>
              <h3 className="cx-cta__title">{course.title}</h3>
              <p className="cx-cta__price cx-mono">
                Preventa {course.price} {course.regularPrice && <s>{course.regularPrice}</s>}
              </p>
              {phase === "info" ? (
                <button type="button" className="cx-btn cx-btn--light" onClick={prereg}>
                  Preregistrarme — sin pago <span aria-hidden="true">→</span>
                </button>
              ) : (
                <div className="cx-form">
                  {tallySrc ? (
                    <iframe src={tallySrc} title={`Preregistro ${course.title}`} className="cx-tally" loading="lazy" />
                  ) : (
                    <p className="cx-placeholder cx-mono">
                      Falta el id del formulario de Tally: añádelo en <code>coursesSettings.tallyFormId</code> (src/content/courses.ts).
                    </p>
                  )}
                </div>
              )}
              <div className="cx-cta__nav">
                <button type="button" className="cx-ln" onClick={() => open(null)}>
                  ← Todos los workshops
                </button>
                <button type="button" className="cx-ln" onClick={() => open(courses[(openIndex + 1) % courses.length].slug)}>
                  Siguiente: {courses[(openIndex + 1) % courses.length].title} →
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
