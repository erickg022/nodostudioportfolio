import data from "../../content/site.json";

export type MediaLayout = "full" | "half" | "left" | "right";

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  layout: MediaLayout;
  controls?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  client: string;
  disciplines: string[];
  /** Cover image: gallery slide, index peek, overlay cover and ghost transition. */
  cover: string;
  /** Photographs shown on the hero sphere (first six are used). */
  images: string[];
  /** Extra rows for the overlay meta list, after client / year / discipline. */
  credits: { label: string; value: string }[];
  summary: string;
  text: string[];
  media: ProjectMedia[];
};

export type Site = {
  meta: { title: string; description: string; lang: string };
  theme: { bg: string; fg: string; accent: string };
  studio: {
    name: string;
    nameLines: string[];
    role: string;
    location: string;
    clockLabel: string;
    timezone: string;
    availability: string;
    copyrightYear: string;
  };
  person: { name: string; role: string };
  nav: { label: string; href: string }[];
  hero: {
    intro: string;
    countLabels: { projects: string; images: string };
    hint: string[];
  };
  work: { title: string; hint: string };
  index: { title: string; columns: string[] };
  about: {
    title: string;
    statement: string;
    lists: { title: string; items: string[] }[];
    records: { title: string; items: { label: string; value: string }[] };
  };
  contact: {
    headingLines: string[];
    emailLabel: string;
    email: string;
    copyLabel: string;
    copiedLabel: string;
    copyFallbackLabel: string;
    availabilityLabel: string;
    availability: string;
    elsewhereLabel: string;
    socials: { label: string; href: string }[];
    backToTop: string;
  };
  overlay: {
    dialogLabel: string;
    closeLabel: string;
    nextLabel: string;
    metaLabels: { client: string; year: string; discipline: string };
  };
  projects: Project[];
};

export const site = data as Site;

/** Values still waiting for real content are written as "TODO: ..." in site.json. */
export const isTodo = (value: string) => value.startsWith("TODO");
