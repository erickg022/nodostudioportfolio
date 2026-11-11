import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./cursos.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Private landing for the link in bio: reachable by URL, kept out of search engines.
export const metadata: Metadata = {
  title: "Cursos / NODO STUDIO",
  description: "Renders hiperrealistas, tours cinematográficos y campañas con IA. Preregistro abierto.",
  robots: { index: false, follow: false },
};

export default function CursosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
