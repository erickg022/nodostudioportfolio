import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/content/site";
import "./meridian.css";

const archivo = Archivo({
  variable: "--font-archivo",
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
    <html lang={site.meta.lang} className={archivo.variable}>
      <head>
        <style>{themeCss}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
