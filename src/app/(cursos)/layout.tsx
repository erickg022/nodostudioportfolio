import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Header, mobile menu and footer styles shared with nodostudio.dev.
import "../(site)/nodo.css";
import "./cursos.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Private landing for the link in bio: reachable by URL, kept out of search engines.
export const metadata: Metadata = {
  title: "Workshops / NODO STUDIO",
  description: "Workshops de IA, diseño y tecnología creativa: arquitectura, campañas y experiencias interactivas. Preregistro abierto.",
  robots: { index: false, follow: false },
};

export default function CursosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
