# Erick Garcia de Anda Portfolio

Premium editorial portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Project Data

All work entries live in `src/data/projects.ts`. The project model is typed and includes slug, title, client, year, disciplines, roles, deliverables, tools/methods, accent color, hero media, media blocks, optional external link, and optional lab flag.

## Adding Images And Videos

Place production assets in `public/media/`, then reference them from project data with root-relative paths:

```ts
heroMedia: {
  type: "image",
  src: "/media/project-name/hero.jpg",
  alt: "Descriptive alt text",
}
```

For video, use muted, web-optimized files and add a poster when possible:

```ts
heroMedia: {
  type: "video",
  src: "/media/project-name/film.mp4",
  poster: "/media/project-name/poster.jpg",
  alt: "Short description of the motion asset",
}
```

Every media field is optional. If no `src` is provided, the site renders a polished placeholder using the project accent color.

## Homepage Hero And About Assets

Homepage asset paths live in `src/data/homepageAssets.ts`.

Replace the hero video files here:

```ts
export const HERO_VIDEO_SRC = "/video/hero.mp4";
export const HERO_VIDEO_WEBM_SRC = "/video/hero.webm";
export const HERO_VIDEO_POSTER = "/video/hero-poster.jpg";
```

The current source video was inspected from `C:\Users\erick\Desktop\VIDEO MATCHUT NODO.mp4`: 1376x768, H.264, yuv420p, 25fps, 2.92s, about 9.1 Mbps with AAC audio. Optimized silent autoplay versions were exported to `public/video/hero.mp4` and `public/video/hero.webm`, with a poster at `public/video/hero-poster.jpg`.

Replace the About collage assets here:

```ts
export const ABOUT_OBJECT_IMAGE = "/about/object-study.svg";
export const ABOUT_AR_IMAGE = "/about/ar-wayfinding.svg";
export const ABOUT_CGI_IMAGE = "/about/cgi-campaign.svg";
export const ABOUT_LOGO_IMAGE = "/about/logo-sculpture.svg";
```

Drop final assets into `public/about/` and update those constants. Hard rectangular crops are intentional; use images that can tolerate editorial cropping.

## Selected Works Covers

Selected work data lives in `src/data/projects.ts`. Replace carousel cover images at these paths:

```txt
public/projects/blink-cover.jpg
public/projects/gdl-cover.jpg
public/projects/play-cover.jpg
public/projects/ginebra-cover.jpg
public/projects/lacoste-cover.jpg
public/projects/eat-nudes-cover.jpg
public/projects/nike-cover.jpg
```

Until real media is added, each project renders an editorial neutral placeholder. When a real cover is ready, place the image at the matching path and set `coverAvailable: true` on that project entry.

## Adding A New Project

Add a new object to the `projects` array in `src/data/projects.ts`.

Required steps:

1. Use a unique `slug`.
2. Add one or more `disciplines`: `IMAGE`, `MOTION`, `SPACE`, `SYSTEMS`.
3. Add one or more `roles`: `CREATIVE DIRECTION`, `CREATIVE TECHNOLOGY`, `CGI / AI`, `EXPERIENTIAL`, `POST / FINISH`.
4. Set `featured: true` if it should appear in the homepage selected work section.
5. Set `lab: true` for research or field-note entries.
6. Add `mediaBlocks` for the case-study sequence.

## Filters And Accent Colors

Archive filters are driven by the `DISCIPLINES` and `ROLES` constants in `src/data/projects.ts`. If you add or rename a filter, update those constants and each project entry that uses it.

Each project uses `accentColor` as its adaptive interface color. Use a high-contrast hex value that works against the near-black background.

## Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Deployment

Deploy as a standard Next.js app. Vercel is the simplest path:

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Use the default Next.js build settings.
4. Add real media to `public/media/` or connect an external image/video pipeline before launch.
