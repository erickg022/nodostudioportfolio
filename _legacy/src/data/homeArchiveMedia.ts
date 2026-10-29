export type HomeArchiveMediaItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  projectSlug?: string;
  type: "image" | "video" | "panel";
  src?: string;
  poster?: string;
  alt: string;
  aspectRatio: string;
  visualMood: string;
};

// Replace or extend these items to update the homepage archive orbit.
// For video, use: type: "video", src: "/media/project-video.webm", poster: "/media/project-poster.jpg".
export const HOME_ARCHIVE_MEDIA: HomeArchiveMediaItem[] = [
  {
    id: "lacoste",
    index: "01",
    title: "LACOSTE × ROLAND-GARROS",
    subtitle: "Experiential Marketing Visuals",
    category: "IMAGE / SPACE",
    year: "2026",
    projectSlug: "lacoste-roland-garros",
    type: "image",
    src: "/projects/lacoste-cover.jpg",
    alt: "Terracotta Lacoste Roland-Garros retail facade concept",
    aspectRatio: "16 / 10",
    visualMood: "warm clay architecture / Paris / terracotta retail",
  },
  {
    id: "ginebra",
    index: "02",
    title: "GINEBRA JOYERIA",
    subtitle: "Jewelry Dispenser Campaign",
    category: "CGI / AI",
    year: "2026",
    projectSlug: "ginebra",
    type: "image",
    src: "/projects/ginebra-work.jpg",
    alt: "Chrome Ginebra jewelry dispenser campaign image",
    aspectRatio: "4 / 5",
    visualMood: "chrome machinery / stainless steel / luxury product world",
  },
  {
    id: "twojeys",
    index: "03",
    title: "TWOJEYS",
    subtitle: "Fashion Visual Campaign",
    category: "IMAGE / CULTURE",
    year: "2026",
    projectSlug: "twojeys",
    type: "image",
    src: "/projects/twojeys-work.jpg",
    alt: "High contrast fashion jewelry campaign image",
    aspectRatio: "4 / 5",
    visualMood: "black fashion editorial / silver jewelry / high contrast",
  },
  {
    id: "avocados",
    index: "04",
    title: "AVOCADOS FROM MEXICO",
    subtitle: "Interactive Brand Installation",
    category: "INTERACTION / GAME",
    year: "2026",
    projectSlug: "play-in-motion",
    type: "image",
    src: "/projects/avocados-work.jpg",
    alt: "Avocados From Mexico interactive installation image",
    aspectRatio: "4 / 5",
    visualMood: "green product environment / playful installation / tactile game world",
  },
  {
    id: "eat-nudes",
    index: "05",
    title: "EAT NUDES",
    subtitle: "Social Content + Brand World",
    category: "MOTION / BRAND",
    year: "2026",
    projectSlug: "eat-nudes",
    type: "image",
    src: "/projects/eat-nudes-work.jpg",
    alt: "EAT NUDES editorial food and product image",
    aspectRatio: "4 / 5",
    visualMood: "ecru food imagery / clean wellness editorial / product color studies",
  },
  {
    id: "nike",
    index: "06",
    title: "NIKE FOOTBALL 2026",
    subtitle: "Speculative Retail World",
    category: "SPACE / CAMPAIGN",
    year: "2026",
    projectSlug: "nike-world-cup",
    type: "image",
    src: "/projects/nike-work.jpg",
    alt: "Nike Football speculative spatial campaign image",
    aspectRatio: "16 / 9",
    visualMood: "dark stadium world / football architecture / Nike-inspired spatial energy",
  },
  {
    id: "gddl",
    index: "07",
    title: "GDDL",
    subtitle: "Public Interactive Experience",
    category: "PUBLIC / SYSTEMS",
    year: "2026",
    projectSlug: "gdl-movilidad",
    type: "image",
    src: "/projects/gdl-work.jpg",
    alt: "Public interactive transit interface image",
    aspectRatio: "16 / 10",
    visualMood: "public interface / playful digital installation / civic interaction",
  },
  {
    id: "nodo-archive",
    index: "08",
    title: "NODO ARCHIVE",
    subtitle: "Experimental Motion Studies",
    category: "LAB / IMAGE",
    year: "2026",
    type: "panel",
    alt: "NODO Archive typography panel",
    aspectRatio: "16 / 10",
    visualMood: "abstract black material / grayscale motion graphic / experimental image work",
  },
  {
    id: "support-worlds",
    index: "09",
    title: "SELECTED WORLDS",
    subtitle: "IMAGE / SPACE / MOTION",
    category: "ARCHIVE",
    year: "2026",
    type: "panel",
    alt: "Selected Worlds typography panel",
    aspectRatio: "16 / 9",
    visualMood: "editorial index panel / project archive / moving contact sheet",
  },
  {
    id: "support-interface",
    index: "10",
    title: "CULTURE AS INTERFACE",
    subtitle: "SYSTEMS IN MOTION",
    category: "STUDY",
    year: "2026",
    type: "panel",
    alt: "Culture as Interface typography panel",
    aspectRatio: "4 / 5",
    visualMood: "dark typography panel / experimental interface language",
  },
];
