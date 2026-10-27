import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./meridian.css";
import "./nodo.css";

// Display type (Meridian).
const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["400", "500"],
  subsets: ["latin"],
});

// Body text and footer, as on the previous NODO site.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Glyphs of the About logo assembly.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
};

const { bg, fg, accent } = site.theme;
// `html:root` outranks the defaults in meridian.css regardless of stylesheet order.
const themeCss = `html:root{--bg:${bg};--fg:${fg};--accent:${accent}}`;

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.meta.lang}
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} ${plexMono.variable}`}
    >
      <head>
        <style>{themeCss}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
