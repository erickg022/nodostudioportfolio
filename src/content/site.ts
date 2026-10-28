import data from "../../content/site.json";
import type { PortfolioCategory, PortfolioViewId } from "./portfolio";

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
  /** Portfolio categories this project belongs to; a project can be in both. */
  categories: PortfolioCategory[];
  /** Verifiable technologies used, listed in the project overlay. */
  technologies?: string[];
};

export type PortfolioView = {
  id: PortfolioViewId;
  label: string;
  /** `?view=` value for this view; empty for the default view (plain `/`). */
  param: string;
  /** Project slugs in carousel order. */
  projects: string[];
};

export type SphereImage = {
  /** Path without the size suffix: files live at `<src>-lg.webp` and `<src>-sm.webp`. */
  src: string;
  /** Project slug opened on click, or "nodo" for studio brand shots (not clickable). */
  project: string;
  /** Hover title for tiles without a project page. */
  title?: string;
};

export type Site = {
  sphere: SphereImage[];
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
    /** Replaces the first name line in the hero; the second line stays as text. */
    logo?: { src: string; alt: string };
    intro: string;
    /** Latitude / longitude shown bottom-left of the hero. */
    coordinates: string[];
    countLabels: { projects: string; images: string };
    hint: string[];
  };
  work: { title: string };
  /** The adaptive carousel after the hero: three curated views of the same projects. */
  portfolio: {
    label: string;
    defaultView: PortfolioViewId;
    views: PortfolioView[];
    /** Optional carousel-only cover per project slug; falls back to the project cover. */
    covers: Record<string, string>;
  };
  index: { title: string; columns: string[] };
  about: {
    title: string;
    statement: string;
    lists: { title: string; items: string[] }[];
    logoAssembly: {
      logo: string;
      label: string;
      mode: "sequence" | "sway" | "still";
      stage: "ink" | "paper";
    };
  };
  preloader: {
    desktopVideo: string;
    mobileFrames: {
      path: string;
      prefix: string;
      count: number;
      fps: number;
      startBuffer: number;
      lookahead: number;
      version: string;
    };
  };
  footer: {
    topLeft: string;
    topCenter: string;
    topRight: string;
    statementLines: string[];
    columns: {
      label: string;
      lines?: string[];
      /** href "mailto" becomes a mail link to contact.email. */
      links?: { label: string; href: string }[];
      /** Render contact.socials in this column. */
      socials?: boolean;
    }[];
  };
  header: {
    brand: string;
    /** Right-hand text of the desktop bar. */
    right: string;
    /** Two-line location block on the left of the desktop bar. */
    location: string[];
    /** Live clock beside it: label above, HH:MM:SS below. */
    clock: { label: string; timezone: string };
    mobileLinks: { label: string; href: string }[];
    mobileMeta: string[];
  };
  contact: {
    email: string;
    socials: { label: string; href: string }[];
  };
  overlay: {
    dialogLabel: string;
    closeLabel: string;
    nextLabel: string;
    metaLabels: { client: string; year: string; discipline: string; technology: string };
  };
  projects: Project[];
};

export const site = data as Site;

/** Values still waiting for real content are written as "TODO: ..." in site.json. */
export const isTodo = (value: string) => value.startsWith("TODO");
