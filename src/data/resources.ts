export type Resource = {
  slug: string;
  title: string;
  titleEs: string;
  description: string;
  specs: string[];
  image?: { src: string; alt: string; width: number; height: number };
  href: string;
  /** Filename for a direct download of a file in /public. */
  download?: string;
  cta: string;
};

export const resources: Resource[] = [
  {
    slug: "render-realism-kit",
    title: "Render Realism Kit",
    titleEs: "Kit de realismo para renders",
    description:
      "7 prompt blocks that turn any architectural render into something that reads like a real photograph: light, camera, materials, shadows and finish. / 7 bloques de prompts para que cualquier render parezca una fotografía real.",
    specs: ["PDF", "7 pages", "EN / ES", "Free"],
    image: {
      src: "/recursos/kit-cover.jpg",
      alt: "Photoreal interior with linen curtains and a steel wall, made with the kit prompts",
      width: 1600,
      height: 1277,
    },
    href: "https://nodostudioegda.gumroad.com/l/kitrender",
    cta: "Descargar gratis",
  },
  {
    slug: "reels-tiktoks-auto-edit-super-prompt",
    title: "Reels & TikToks Auto-Edit Super Prompt",
    titleEs: "Super prompt para editar Reels y TikToks",
    description:
      "A reusable prompt that turns a folder of raw clips into a finished vertical video using Claude Code or Codex: silences removed, captions and motion graphics included. Just download it and paste it into Claude Code in the folder where your videos are. / Un prompt reutilizable que convierte una carpeta de clips sin editar en un video terminado con Claude Code o Codex: sin silencios, con subtítulos y motion. Solo descárgalo y pégalo en Claude Code en la carpeta donde tengas tus videos.",
    specs: ["MD", "EN / ES", "Free"],
    image: {
      src: "/recursos/super-prompt-cover.jpg",
      alt: "Video editor interface with a vertical clip timeline and grid overlay",
      width: 1200,
      height: 1200,
    },
    href: "/recursos/super-prompt-auto-edit-reels.md",
    download: "super-prompt-auto-edit-reels.md",
    cta: "Descargar gratis",
  },
  {
    slug: "scroll-virtual-walkthrough-guide",
    title: "Scroll-Driven Virtual Walkthrough Guide",
    titleEs: "Guía de recorrido virtual con scroll",
    description:
      "A step-by-step guide plus a ready-to-paste prompt that turns your finished walkthrough MP4 into a cinematic website where scrolling walks through the space. Works with Claude Code or Codex. You need your walkthrough video already made as an MP4. / Guía paso a paso con un prompt listo para pegar que convierte tu video de recorrido en MP4 en una web cinematográfica donde el scroll camina por el espacio. Funciona con Claude Code o Codex. Necesitas tener tu video de recorrido ya hecho en MP4.",
    specs: ["PDF", "7 pages", "ES + EN prompt", "Free"],
    image: {
      src: "/recursos/recorrido-virtual-cover.jpg",
      alt: "Warm walnut and travertine terrace lounge from the virtual walkthrough example",
      width: 1600,
      height: 1200,
    },
    href: "/recursos/recorrido-virtual-scroll.pdf",
    download: "recorrido-virtual-scroll.pdf",
    cta: "Descargar gratis",
  },
];

export const socials = [
  { label: "TikTok", handle: "@ericktechcreates", href: "https://www.tiktok.com/@ericktechcreates" },
  { label: "Instagram", handle: "@nodostudio__", href: "https://www.instagram.com/nodostudio__/" },
];
