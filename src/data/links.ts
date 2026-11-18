export type BioLink = {
  label: string;
  /** Short line shown on the strip, e.g. "Preregistro abierto". */
  tag: string;
  /** Highlight the tag as a white pill. */
  highlight?: boolean;
  href: string;
  external?: boolean;
  image: { src: string; alt: string; position?: string };
  /** Strip width as a share of the column, for the staggered stack look. */
  width: string;
};

/** Links shown on /links (the TikTok / Instagram bio page), top to bottom. */
export const bioLinks: BioLink[] = [
  {
    label: "Cursos",
    tag: "Preregistro abierto",
    highlight: true,
    href: "/cursos",
    image: {
      src: "/links/cursos.webp",
      alt: "Two people in silhouette looking at a screen full of AI image workflows",
      position: "center 40%",
    },
    width: "88%",
  },
  {
    label: "Recursos",
    tag: "Guías y prompts gratis",
    href: "/recursos",
    image: {
      src: "/links/recursos.webp",
      alt: "Open magazine spread titled NODO recursos, prompts, guías, gratis",
      position: "center 30%",
    },
    width: "100%",
  },
  {
    label: "Instagram",
    tag: "@nodostudio__",
    href: "https://www.instagram.com/nodostudio__/",
    external: true,
    image: {
      src: "/links/instagram.webp",
      alt: "Round gallery hall with brown leather sofas and a clerestory window",
      position: "center 68%",
    },
    width: "78%",
  },
];
