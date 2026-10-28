/* eslint-disable @next/next/no-img-element -- Meridian's runtime animates raw <img> nodes (clip-path reveals, ghost transition); sources still go through the Next image optimizer via getImageProps. */
import { resolveView, viewHref } from "@/content/portfolio";
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
  const { portfolio } = site;
  return {
    sphere: site.sphere.map((s) => ({ slug: s.project, title: s.title, textures: { lg: `${s.src}-lg.webp`, sm: `${s.src}-sm.webp` } })),
    projects: await Promise.all(
      projects.map(async (p) => {
        const carousel = portfolio.covers[p.slug] ?? p.cover;
        return {
          slug: p.slug,
          title: p.title,
          year: p.year,
          client: p.client,
          cover: { lg: await textureUrl(p.cover, 1920), sm: await textureUrl(p.cover, 1080) },
          carouselCover: { lg: await textureUrl(carousel, 1920), sm: await textureUrl(carousel, 1080) },
        };
      }),
    ),
    views: portfolio.views.map((v) => ({ id: v.id, param: v.param, slugs: v.projects })),
    defaultView: portfolio.defaultView,
  };
}

/** Projects of every portfolio view, in curated order; unknown slugs in site.json are skipped. */
function portfolioViews(projects: Project[]) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return site.portfolio.views.map((view) => ({
    ...view,
    items: view.projects.flatMap((slug) => bySlug.get(slug) ?? []),
  }));
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
          {project.technologies?.length ? (
            <div>
              <dt>{overlay.metaLabels.technology}</dt>
              <dd>{project.technologies.join(", ")}</dd>
            </div>
          ) : null}
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
  const { studio, hero, work, index, about, overlay, projects, portfolio } = site;
  const data = await runtimeData(projects);
  const views = portfolioViews(projects);
  // The page is prerendered with the default view; the runtime applies ?view= before the preloader lifts.
  const active = resolveView(views, null, portfolio.defaultView);
  const first = active.items[0];
  // The section keeps one height for every view, so switching never shifts the page below.
  const longest = Math.max(...views.map((v) => v.items.length));
  const reels = await Promise.all(
    views.map((v) =>
      Promise.all(
        v.items.map((p) => responsiveImage(portfolio.covers[p.slug] ?? p.cover, "(max-width: 760px) 78vw, 46vw")),
      ),
    ),
  );
  const peeks = await Promise.all(projects.map((p) => fixedImage(p.cover, 170)));

  return (
    <div className="mr" data-view={active.id}>
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
            <p className="nd-hero__coords">
              {hero.coordinates.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className="nd-hero__intro">{hero.intro}</p>
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
          // Reference: 60vh per project + one screen, sized for the longest view.
          style={{ height: `${longest * 60 + 60}vh` }}
          aria-labelledby="work-title"
        >
          <div className="mr-gallery__sticky">
            <canvas data-gallery="true" className="mr-gallery__canvas" aria-hidden="true" />
            <div className="nd-work__head">
              <div className="nd-work__row">
                <h2 id="work-title" className="nd-work__label">
                  {portfolio.label}
                </h2>
                <span className="nd-work__count">
                  (<span data-g-index="true">01</span> — <span data-g-total="true">{pad(active.items.length)}</span>)
                </span>
              </div>
              <div role="tablist" aria-label={`${work.title} view`} className="nd-work__tabs">
                {views.map((v) => (
                  <a
                    key={v.id}
                    href={viewHref(v.param)}
                    role="tab"
                    id={`work-tab-${v.id}`}
                    aria-selected={v.id === active.id}
                    aria-controls="work-panel"
                    tabIndex={v.id === active.id ? 0 : -1}
                    data-view-tab={v.id}
                    className="nd-work__tab"
                  >
                    {v.label}
                  </a>
                ))}
              </div>
            </div>
            <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${active.id}`} className="nd-work__panel">
              <div className="mr-gallery__info">
                <a data-g-link="true" href={`#project-${first.slug}`} className="mr-gallery__title">
                  <span data-g-title="true">{first.title}</span>
                </a>
                <span data-g-meta="true" className="mr-gallery__meta">
                  {[first.client, first.year].filter(Boolean).join(", ")}
                </span>
              </div>
              {/* Vertical screens: a native swipe reel instead of the scroll-turned WebGL gallery. */}
              <div className="nd-reel">
                {views.map((v, vi) => (
                  <ol key={v.id} data-reel={v.id} className="nd-reel__list" hidden={v.id !== active.id}>
                    {v.items.map((p, i) => (
                      <li key={p.slug} className="nd-reel__item">
                        <a href={`#project-${p.slug}`} data-open={p.slug} className="nd-reel__link">
                          <img {...reels[vi][i]} alt="" loading="lazy" decoding="async" className="nd-reel__img" />
                          <span className="nd-reel__no">{pad(i + 1)}</span>
                          <span className="nd-reel__title">{p.title}</span>
                          <span className="nd-reel__meta">{[p.client, p.year].filter(Boolean).join(", ")}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                ))}
              </div>
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
