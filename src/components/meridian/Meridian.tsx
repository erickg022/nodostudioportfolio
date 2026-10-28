/* eslint-disable @next/next/no-img-element -- Meridian's runtime animates raw <img> nodes (clip-path reveals, ghost transition); sources still go through the Next image optimizer via getImageProps. */
import { Fragment } from "react";
import { site, type Project, type ProjectMedia } from "@/content/site";
import { fixedImage, responsiveImage, textureUrl } from "@/lib/media";
import { LogoAssembly } from "./LogoAssembly";
import { NodoHeader } from "./NodoHeader";
import { SiteFooter } from "./SiteFooter";
import type { RuntimeData } from "./runtime/types";

const FIG_SIZES: Record<ProjectMedia["layout"], string> = {
  full: "100vw",
  half: "(max-width: 760px) 100vw, 50vw",
  left: "(max-width: 760px) 100vw, 50vw",
  right: "(max-width: 760px) 100vw, 58vw",
};

const pad = (n: number) => String(n).padStart(2, "0");

async function runtimeData(projects: Project[]): Promise<RuntimeData> {
  return {
    sphere: site.sphere.map((s) => ({ slug: s.project, textures: { lg: `${s.src}-lg.webp`, sm: `${s.src}-sm.webp` } })),
    projects: await Promise.all(
      projects.map(async (p) => ({
        slug: p.slug,
        title: p.title,
        year: p.year,
        client: p.client,
        cover: { lg: await textureUrl(p.cover, 1920), sm: await textureUrl(p.cover, 1080) },
        images: await Promise.all(
          p.images.map(async (src) => ({
            lg: await textureUrl(src, 640),
            sm: await textureUrl(src, 384),
          })),
        ),
      })),
    ),
  };
}

async function Figure({ media, alt }: { media: ProjectMedia; alt: string }) {
  const className = `mr-proj__fig mr-proj__fig--${media.layout}`;
  if (media.type === "video") {
    const poster = media.poster ? await responsiveImage(media.poster, FIG_SIZES[media.layout]) : null;
    return (
      <figure className={className}>
        <video
          src={media.src}
          poster={poster?.src}
          width={poster?.width}
          height={poster?.height}
          aria-label={alt}
          muted
          loop
          playsInline
          preload="none"
          controls={media.controls}
        />
      </figure>
    );
  }
  const img = await responsiveImage(media.src, FIG_SIZES[media.layout]);
  return (
    <figure className={className}>
      <img {...img} alt={alt} loading="lazy" decoding="async" />
    </figure>
  );
}

async function ProjectArticle({ project, next }: { project: Project; next: Project }) {
  const { overlay } = site;
  const cover = await responsiveImage(project.cover, "100vw");
  return (
    <article data-project={project.slug} className="mr-proj" hidden>
      <div className="mr-proj__cover">
        <img data-cover="true" {...cover} alt="" loading="lazy" decoding="async" />
        <h2 className="mr-proj__title">{project.title}</h2>
      </div>
      <div className="mr-proj__meta">
        <dl>
          <div>
            <dt>{overlay.metaLabels.client}</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>{overlay.metaLabels.year}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>{overlay.metaLabels.discipline}</dt>
            <dd>{project.disciplines.join(", ")}</dd>
          </div>
          {project.credits.map((credit) => (
            <div key={credit.label}>
              <dt>{credit.label}</dt>
              <dd>{credit.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mr-proj__text">
          <p className="mr-proj__summary">{project.summary}</p>
          {project.text.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="mr-proj__media">
        {project.media.map((media, i) => (
          <Figure key={media.src} media={media} alt={media.alt || `${project.title}, ${i + 1}`} />
        ))}
      </div>
      <a href={`#project-${next.slug}`} data-open={next.slug} className="mr-proj__next">
        <span className="mr-label">{overlay.nextLabel}</span>
        <span className="mr-proj__next-title">{next.title}</span>
      </a>
      <SiteFooter />
    </article>
  );
}

export async function Meridian() {
  const { studio, hero, work, index, about, overlay, projects } = site;
  const data = await runtimeData(projects);
  const imageCount = site.sphere.length;
  const first = projects[0];
  const peeks = await Promise.all(projects.map((p) => fixedImage(p.cover, 170)));

  return (
    <div className="mr">
      <script
        type="application/json"
        id="mr-data"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
      {/* NODO preloader from the previous site: a film on landscape screens, a frame sequence on portrait. */}
      <div
        data-mr="preloader"
        className="site-preloader"
        data-visible="true"
        data-video={site.preloader.desktopVideo}
        data-frames={JSON.stringify(site.preloader.mobileFrames)}
        aria-hidden="true"
      >
        <video
          className="site-preloader__video"
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          hidden
        />
        <canvas className="site-preloader__video" hidden />
      </div>

      <NodoHeader />

      <main>
        <section id="top" data-mr="hero" className="mr-hero" aria-label="Introduction">
          <div className="mr-hero__sticky">
            {hero.logo ? (
              // Logo only, centred at the bottom of the hero.
              <h1 className="mr-hero__name mr-hero__name--logo" aria-label={studio.name}>
                <span className="mr-hero__first">
                  <span data-rise="true">
                    <img src={hero.logo.src} alt={hero.logo.alt} className="mr-hero__logo" decoding="async" />
                  </span>
                </span>
              </h1>
            ) : (
              <h1 className="mr-hero__name" aria-label={studio.name}>
                <span className="mr-hero__first">
                  <span data-rise="true">{studio.nameLines[0]}</span>
                </span>
                <span className="mr-hero__last">
                  <span data-rise="true">{studio.nameLines[1]}</span>
                </span>
              </h1>
            )}
            <canvas data-sphere="true" className="mr-hero__canvas" aria-hidden="true" />
            <div className="mr-hero__notes">
              <p className="mr-hero__intro">{hero.intro}</p>
              <p className="mr-hero__count">
                {projects.length} {hero.countLabels.projects}
                <br />
                {imageCount} {hero.countLabels.images}
              </p>
              <p className="mr-hero__hint">
                {hero.hint.map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </p>
            </div>
            <div data-cursor="true" className="mr-cursor" aria-hidden="true">
              <span data-cursor-title="true" />
              <span data-cursor-year="true" className="mr-cursor__year" />
            </div>
          </div>
        </section>

        <section
          id="work"
          data-mr="gallery"
          data-fallback="#index"
          className="mr-gallery"
          // Reference: 540vh for 8 projects (60vh per project + one screen).
          style={{ height: `${projects.length * 60 + 60}vh` }}
          aria-labelledby="work-title"
        >
          <div className="mr-gallery__sticky">
            <canvas data-gallery="true" className="mr-gallery__canvas" aria-hidden="true" />
            <div className="mr-gallery__head">
              <h2 id="work-title">{work.title}</h2>
              <span>{work.hint}</span>
            </div>
            <div className="mr-gallery__info">
              <span className="mr-gallery__num">
                <span data-g-index="true">01</span> / {pad(projects.length)}
              </span>
              <a data-g-link="true" href={`#project-${first.slug}`} className="mr-gallery__title">
                <span data-g-title="true">{first.title}</span>
              </a>
              <span data-g-meta="true" className="mr-gallery__meta">
                {[first.client, first.year].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
        </section>

        <section id="index" data-mr="index" className="mr-index" aria-labelledby="index-title">
          <header className="mr-index__head">
            <h2 id="index-title">{index.title}</h2>
            {index.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </header>
          <ol className="mr-index__list">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <a href={`#project-${p.slug}`} data-open={p.slug} className="mr-index__row">
                  <span className="mr-index__no">{pad(i + 1)}</span>
                  <span className="mr-index__title">{p.title}</span>
                  <span>{p.client}</span>
                  <span>{p.disciplines.join(", ")}</span>
                  <span>{p.year}</span>
                  <img {...peeks[i]} alt="" loading="lazy" decoding="async" className="mr-index__peek" />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" data-mr="about" className="mr-about" aria-labelledby="about-title">
          <h2 id="about-title" className="mr-label">
            {about.title}
          </h2>
          <div className="mr-about__lead">
            <p className="mr-about__statement">
              {about.statement.split(/\s+/).map((word, i) => (
                <span key={i} data-word="true">
                  {word}{" "}
                </span>
              ))}
            </p>
            <LogoAssembly {...about.logoAssembly} placement="side" />
          </div>
          <div className="mr-about__grid">
            {about.lists.map((list) => (
              <div key={list.title}>
                <h3 className="mr-label">{list.title}</h3>
                <ul>
                  {list.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* On vertical screens the assembly moves out of About to sit just above the footer. */}
        <LogoAssembly {...about.logoAssembly} placement="stacked" />
        <SiteFooter id="contact" />
      </main>

      <div
        data-mr="overlay"
        className="mr-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={overlay.dialogLabel}
        hidden
      >
        <button type="button" data-close="true" className="mr-overlay__close">
          {overlay.closeLabel}
        </button>
        <div data-scroll="true" className="mr-overlay__scroll" data-lenis-prevent="true">
          {projects.map((p, i) => (
            <ProjectArticle key={p.slug} project={p} next={projects[(i + 1) % projects.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}
