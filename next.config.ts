import type { NextConfig } from "next";
import site from "./content/site.json";

// Old project pages that are not part of the Meridian site send visitors to the work section.
const RETIRED_PROJECTS = ["axe-ceremonia-ar-portal", "gdl-movilidad", "play-in-motion"];

const nextConfig: NextConfig = {
  // src/lib/media.ts reads image sizes from /public at build time; the page is prerendered,
  // so keep public assets (and the archived site) out of the server function bundle.
  outputFileTracingExcludes: {
    "/*": ["./public/**/*", "./_legacy/**/*", "./_reference/**/*", "./REFERENCE/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
  async redirects() {
    // Meridian is a single page with overlays; keep the previous URLs working.
    return [
      { source: "/work", destination: "/#work", permanent: false },
      { source: "/work/vol-2", destination: "/#work", permanent: false },
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
      ...RETIRED_PROJECTS.flatMap((slug) => [
        { source: `/work/${slug}`, destination: "/#work", permanent: false },
        { source: `/work/vol-2/${slug}`, destination: "/#work", permanent: false },
      ]),
      ...site.projects.flatMap(({ slug }) => [
        { source: `/work/${slug}`, destination: `/#project-${slug}`, permanent: false },
        { source: `/work/vol-2/${slug}`, destination: `/#project-${slug}`, permanent: false },
      ]),
      { source: "/work/:path*", destination: "/#work", permanent: false },
    ];
  },
};

export default nextConfig;
