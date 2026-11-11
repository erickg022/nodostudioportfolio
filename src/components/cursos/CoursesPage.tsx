"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Course, CourseMedia } from "@/content/courses";

type Settings = { tallyFormId: string; season: string; intro: string };
type Phase = "info" | "form";

const pad = (n: number) => String(n).padStart(2, "0");

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
  const [flip, setFlip] = useState(false);
  const [phase, setPhase] = useState<Phase>("info");

  const openIndex = courses.findIndex((c) => c.slug === openSlug);
  const course = openIndex >= 0 ? courses[openIndex] : null;

  const open = useCallback((slug: string | null) => {
    setOpenSlug(slug);
    setSlide(0);
    setPhase("info");
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("curso", slug);
    else url.searchParams.delete("curso");
    window.history.replaceState(null, "", url);
  }, []);

  // ?curso=<slug> opens a course directly (shareable links per course).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("curso");
    if (slug && courses.some((c) => c.slug === slug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSlug(slug);
    }
  }, [courses]);

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

  const go = (i: number) => {
    if (!course) return;
    const n = course.gallery.length;
    setSlide(((i % n) + n) % n);
    setFlip((f) => !f);
  };

  const step = (n: number) => (slide + n) % (course?.gallery.length ?? 1);
  const tallySrc =
    course && settings.tallyFormId
      ? `https://tally.so/embed/${settings.tallyFormId}?curso=${course.slug}&hideTitle=1&transparentBackground=1&dynamicHeight=1`
      : null;

  return (
    <div className="cx">
      {/* NAV */}
      <header className="cx-nav">
        <span>Creative technology studio</span>
        <Link href="/" className="cx-logo">
          nodo<sup>®</sup>
        </Link>
        <nav aria-label="Principal" className="cx-nav__links">
          <Link href="/">Portfolio</Link>
          <a href="#cursos">Cursos</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="cx-hero">
        <div className="cx-hero__text">
          <p className="cx-mono cx-muted cx-r1">{settings.season} — Preregistro abierto</p>
          <div className="cx-hero__body">
            <h1 className="cx-h1 cx-r2">Aprende el workflow detrás de cada render.</h1>
            <p className="cx-lead cx-r3">{settings.intro}</p>
            <dl className="cx-meta cx-r4">
              <div>
                <dt>Cursos</dt>
                <dd>Render · Film · Campañas</dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>Online</dd>
              </div>
              <div>
                <dt>Inscripción</dt>
                <dd>Solo preregistro, sin pago</dd>
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
          <span>{courses.length} cursos</span>
          <span className="cx-pill__sep" aria-hidden="true">
            |
          </span>
          <span>Plazas limitadas</span>
          <a className="cx-pill__btn" href="#cursos">
            Ver cursos <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* WORDMARK + TICKER */}
      <section className="cx-word" aria-hidden="true">
        <p>Cursos—01</p>
      </section>
      <div className="cx-ticker cx-mono" aria-hidden="true">
        <div className="cx-ticker__track">
          {[0, 1].map((k) => (
            <span key={k}>
              {courses.map((c) => (
                <span key={c.slug}>{c.title} — {c.focus}</span>
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
            NODO <span className="cx-indent">Todos los cursos</span>
            <br />
            Explora la colección <span className="cx-muted">01—{pad(courses.length)}</span>
          </h2>
          <span className="cx-small">Toca un curso para ver más [+]</span>
        </div>
        <div className="cx-grid">
          {courses.map((c) => (
            <button key={c.slug} type="button" className="cx-card" onClick={() => open(c.slug)} aria-label={`Ver curso ${c.title}`}>
              <span className="cx-card__img">
                <Media media={c.cover} className="cx-cover cx-card__media" />
                <span className="cx-badge cx-mono">
                  {pad(c.gallery.length)} · {c.gallery.some((m) => m.type === "video") ? "IMG + VIDEO" : "IMÁGENES"}
                </span>
              </span>
              <span className="cx-card__cap cx-mono">
                <span>
                  <span>Curso {c.num}</span>
                  <span>{c.title}</span>
                </span>
                <span className="cx-right">
                  <span>{c.focus}</span>
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
            <span className="cx-soft">Revisa el preview, temario y precio de cada curso.</span>
          </div>
          <div className="cx-row3">
            <span className="cx-muted">02</span>
            <span>Preregístrate</span>
            <span className="cx-soft">Nombre y correo. No se cobra nada hoy.</span>
          </div>
          <div className="cx-row3">
            <span className="cx-muted">03</span>
            <span>Recibe acceso</span>
            <span className="cx-soft">Te escribimos primero con la fecha y el precio de preventa.</span>
          </div>
        </div>
      </section>

      <footer className="cx-footer cx-mono">
        <span className="cx-footer__mark">
          NODO <span className="cx-indent">Cursos</span>
        </span>
        <Link href="/">nodostudio.dev</Link>
        <span>
          LA · MX · ES
          <br />© 2026 NODO Studio
        </span>
      </footer>

      {/* DETAIL SHEET */}
      {course && (
        <div className="cx-sheet" role="dialog" aria-modal="true" aria-label={course.title}>
          <div className="cx-sheet__bar">
            <button type="button" className="cx-ln" onClick={() => open(null)}>
              ← Todos los cursos
            </button>
            <span className="cx-logo cx-logo--sm">
              nodo<sup>®</sup>
            </span>
            <button type="button" className="cx-ln cx-end" onClick={() => open(courses[(openIndex + 1) % courses.length].slug)}>
              Siguiente curso →
            </button>
          </div>

          <div className="cx-detail">
            <div className="cx-detail__info">
              <p className="cx-detail__title cx-mono">
                Curso <span className="cx-indent">{course.num}<span className="cx-muted">/{pad(courses.length)}</span></span>
                <br />
                {course.title}
              </p>
              <p className="cx-lead">{course.description}</p>

              {phase === "info" ? (
                <>
                  <div className="cx-specs cx-mono">
                    {[
                      ["Enfoque", course.focus],
                      ["Formato", course.format],
                      ["Nivel", course.level],
                      ["Para", course.audience],
                      ["Temario", `${course.modules.length} módulos`],
                    ].map(([k, v]) => (
                      <div key={k} className="cx-spec">
                        <span className="cx-soft">{k}</span>
                        <span>{v}</span>
                      </div>
                    ))}
                    <div className="cx-spec cx-spec--price">
                      <span className="cx-soft">Precio</span>
                      <span>
                        {course.price} {course.regularPrice && <s className="cx-muted">{course.regularPrice}</s>}
                      </span>
                      <button type="button" className="cx-ln cx-end" onClick={() => setPhase("form")}>
                        Preregistrarme [+]
                      </button>
                    </div>
                  </div>
                  <button type="button" className="cx-btn" onClick={() => setPhase("form")}>
                    Preregistrarme — sin pago <span aria-hidden="true">→</span>
                  </button>
                </>
              ) : (
                <div className="cx-form">
                  <span className="cx-mono cx-soft cx-small">Preregistro — {course.title}</span>
                  {tallySrc ? (
                    <iframe src={tallySrc} title={`Preregistro ${course.title}`} className="cx-tally" loading="lazy" />
                  ) : (
                    <p className="cx-placeholder cx-mono">
                      Falta el id del formulario de Tally: añádelo en <code>coursesSettings.tallyFormId</code> (src/content/courses.ts).
                    </p>
                  )}
                  <button type="button" className="cx-ln" onClick={() => setPhase("info")}>
                    ← Volver
                  </button>
                </div>
              )}
            </div>

            <div className="cx-detail__gallery">
              <div className="cx-stack">
                <div className="cx-stack__card cx-stack__back2">
                  <Media media={course.gallery[step(2)]} className="cx-cover" play={false} />
                </div>
                <div className="cx-stack__card cx-stack__back1">
                  <Media media={course.gallery[step(1)]} className="cx-cover" play={false} />
                </div>
                <div key={`${slide}-${flip}`} className="cx-stack__card cx-stack__front">
                  <Media media={course.gallery[slide]} className="cx-cover" />
                  {course.gallery[slide].type === "video" && <span className="cx-badge cx-badge--l cx-mono">● Video</span>}
                </div>
              </div>
              <div className="cx-gallery__nav cx-mono">
                <span>{course.gallery[slide].caption}</span>
                <span className="cx-arrows">
                  <button type="button" className="cx-arrow" onClick={() => go(slide - 1)} aria-label="Anterior">
                    ←
                  </button>
                  <span>
                    {pad(slide + 1)} / {pad(course.gallery.length)}
                  </span>
                  <button type="button" className="cx-arrow" onClick={() => go(slide + 1)} aria-label="Siguiente">
                    →
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="cx-strip">
            <p className="cx-strip__title cx-mono">
              Dentro del curso
              <br />
              <span className="cx-muted">Imágenes y videos</span>
            </p>
            <div className="cx-strip__row">
              {course.gallery.map((m, i) => (
                <button
                  key={m.src + i}
                  type="button"
                  className={`cx-thumb${i === slide ? " is-on" : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Ver ${m.caption}`}
                >
                  <span className="cx-thumb__img">
                    <Media media={m} className="cx-cover" play={false} />
                  </span>
                  <span className="cx-thumb__cap cx-mono">
                    <span>{m.caption}</span>
                    <span className="cx-soft">{m.type === "video" ? "Video" : "Img"}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="cx-syllabus">
            <div className="cx-syllabus__col">
              <p className="cx-mono cx-soft cx-small">Lo que vas a poder hacer</p>
              {course.outcomes.map((o) => (
                <p key={o} className="cx-outcome">
                  {o}
                </p>
              ))}
            </div>
            <div className="cx-syllabus__col cx-syllabus__col--wide">
              <p className="cx-mono cx-soft cx-small">Temario</p>
              <div className="cx-table cx-mono">
                {course.modules.map((m, i) => (
                  <div key={m.title} className="cx-row3 cx-row3--mod">
                    <span className="cx-muted">{pad(i + 1)}</span>
                    <span>{m.title}</span>
                    <span className="cx-soft">{m.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
