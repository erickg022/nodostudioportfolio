/**
 * Courses landing (/cursos) — every piece of copy and media lives here.
 *
 * MEDIA: the paths below point at existing portfolio files in /public/projects as
 * stand-ins. Drop the real course media into /public/cursos/<course-slug>/ and swap the paths.
 * Videos: silent H.264 .mp4, ideally < 5 MB, with a poster image.
 */

export type CourseMedia = {
  type: "image" | "video";
  src: string;
  /** Required for video: shown before it loads. */
  poster?: string;
  alt: string;
  /** Short caption shown under the gallery (mono, uppercase). */
  caption: string;
};

export type CourseModule = { title: string; detail: string };

export type Course = {
  slug: string;
  num: string;
  title: string;
  focus: string;
  /** One line for the collection card. */
  short: string;
  description: string;
  /** Presale price, e.g. "€149". */
  price: string;
  /** Regular price shown struck through; leave "" to hide. */
  regularPrice: string;
  format: string;
  level: string;
  audience: string;
  cover: CourseMedia;
  gallery: CourseMedia[];
  outcomes: string[];
  modules: CourseModule[];
};

export const coursesSettings = {
  /**
   * Tally form id (the part after tally.so/r/). Add a hidden field named "curso" in Tally
   * so every signup records which course it came from. Leave "" to show a placeholder.
   */
  tallyFormId: "",
  season: "Temporada 01",
  intro:
    "Tres cursos para crear renders hiperrealistas, tours cinematográficos y campañas con IA — con los procesos que usamos en proyectos para Nike, Lacoste, Airbnb y Stüssy × Moncler.",
};

/** Cards on the rotating hero wheel (14 works best). */
export const wheelMedia: CourseMedia[] = [
  { type: "image", src: "/projects/lacoste-storefront-gallery.jpg", alt: "", caption: "Retail" },
  { type: "image", src: "/projects/airbnb/still-02.webp", alt: "", caption: "Campaña" },
  { type: "image", src: "/projects/stussy/tunnel.webp", alt: "", caption: "Espacio" },
  { type: "image", src: "/projects/oura/still-ring.webp", alt: "", caption: "Producto" },
  { type: "image", src: "/projects/nike-circular-lounge.jpg", alt: "", caption: "Interior" },
  { type: "image", src: "/projects/beefeater-light/still-01.webp", alt: "", caption: "Key visual" },
  { type: "video", src: "/projects/stussy/pavilion-film.mp4", poster: "/projects/stussy/pavilion-film-poster.jpg", alt: "", caption: "Film" },
  { type: "image", src: "/projects/stussy/quilted-wall.webp", alt: "", caption: "Material" },
  { type: "image", src: "/projects/ginebra-cover-hero.webp", alt: "", caption: "Joyería" },
  { type: "image", src: "/projects/lacoste-conversation-pit.jpg", alt: "", caption: "Arquitectura" },
  { type: "image", src: "/projects/mahou/still-03.webp", alt: "", caption: "Campaña" },
  { type: "image", src: "/projects/nike-store-interior.jpg", alt: "", caption: "Retail" },
  { type: "video", src: "/projects/stussy/magazine.mp4", poster: "/projects/stussy/magazine-poster.jpg", alt: "", caption: "Motion" },
  { type: "image", src: "/projects/stussy/runway.webp", alt: "", caption: "Tour" },
];

export const courses: Course[] = [
  {
    slug: "render",
    num: "01",
    title: "Render Hiperrealista",
    focus: "Arquitectura & Retail",
    short: "Del sketch o modelo a imágenes que parecen fotografía.",
    description:
      "Renders de arquitectura y espacios comerciales con IA que se leen como fotografía: luz, materiales y cámara bajo control, del sketch a la imagen final.",
    price: "[PRECIO]",
    regularPrice: "[REGULAR]",
    format: "Online",
    level: "Principiante – Intermedio",
    audience: "Arquitectos, interioristas, retail",
    cover: { type: "image", src: "/projects/lacoste-storefront-gallery.jpg", alt: "Render de un espacio de retail", caption: "Retail" },
    gallery: [
      { type: "image", src: "/projects/lacoste-storefront-gallery.jpg", alt: "Fachada de tienda", caption: "Retail — fachada" },
      { type: "image", src: "/projects/nike-circular-lounge.jpg", alt: "Lounge circular", caption: "Interior — lounge" },
      { type: "image", src: "/projects/lacoste-soundroom.jpg", alt: "Sala de sonido", caption: "Interior — luz" },
      { type: "image", src: "/projects/stussy/quilted-wall.webp", alt: "Muro acolchado", caption: "Material — textil" },
      { type: "image", src: "/projects/nike-store-interior.jpg", alt: "Interior de tienda", caption: "Retail — interior" },
      { type: "image", src: "/projects/lacoste-merch-shop.jpg", alt: "Tienda de merch", caption: "Retail — pop-up" },
    ],
    outcomes: [
      "Renders fotorrealistas de interiores, fachadas y espacios comerciales.",
      "Luz, materiales y cámara para que no se vea “hecho con IA”.",
      "Un concepto de retail del boceto a imagen de campaña.",
      "Entregar en alta resolución, lista para cliente.",
    ],
    modules: [
      { title: "Fundamentos del fotorrealismo", detail: "Qué hace que una imagen se lea como foto." },
      { title: "Sketch o modelo a render", detail: "Tu workflow base, paso a paso." },
      { title: "Materiales, luz y atmósfera", detail: "Hora del día, texturas, profundidad." },
      { title: "Experiencias de retail", detail: "Vitrinas, pop-ups, espacios de marca." },
      { title: "Upscale y entrega", detail: "Resolución final y presentación." },
    ],
  },
  {
    slug: "film",
    num: "02",
    title: "Arquitectura en Movimiento",
    focus: "Render + Film + Web",
    short: "Renders a video cinematográfico y tours web con scroll animado.",
    description:
      "Del render al tour cinematográfico, y del tour a una web con scroll animation construida con Claude — sin ser programador.",
    price: "[PRECIO]",
    regularPrice: "[REGULAR]",
    format: "Online",
    level: "Intermedio",
    audience: "Arquitectos, desarrolladores, estudios",
    cover: { type: "image", src: "/projects/stussy/tunnel.webp", alt: "Túnel arquitectónico", caption: "Tour" },
    gallery: [
      { type: "video", src: "/projects/stussy/pavilion-film.mp4", poster: "/projects/stussy/pavilion-film-poster.jpg", alt: "Recorrido por un pabellón", caption: "Tour — pabellón" },
      { type: "image", src: "/projects/stussy/runway.webp", alt: "Pasarela", caption: "Frame — recorrido" },
      { type: "video", src: "/projects/stussy/coast-film.mp4", poster: "/projects/stussy/coast-film-poster.jpg", alt: "Toma de exterior", caption: "Toma — exterior" },
      { type: "image", src: "/projects/stussy/seats.webp", alt: "Gradas", caption: "Frame — espacio" },
      { type: "video", src: "/projects/oura/oura-film.mp4", poster: "/projects/oura/oura-film-poster.jpg", alt: "Film de producto", caption: "Cámara — detalle" },
      { type: "image", src: "/projects/pato/corridor.webp", alt: "Pasillo", caption: "Frame — pasillo" },
    ],
    outcomes: [
      "Renders convertidos en tomas con movimiento de cámara.",
      "Un tour arquitectónico planeado como un film.",
      "Una web de recorrido con scroll animation, hecha con Claude.",
      "Publicar el tour para presentar o vender proyectos.",
    ],
    modules: [
      { title: "Del render a la toma", detail: "Animar imágenes fijas con IA de video." },
      { title: "Cámara para arquitectura", detail: "Dollys, reveals y ritmo." },
      { title: "Edición, sonido y color", detail: "Que se sienta como película." },
      { title: "Scroll tours con Claude", detail: "Tu recorrido como web animada." },
      { title: "Publicar y presentar", detail: "Para clientes y compradores." },
    ],
  },
  {
    slug: "campanas",
    num: "03",
    title: "IA para Campañas Creativas",
    focus: "Concepto → Producción",
    short: "El workflow de estudio para campañas visuales con IA.",
    description:
      "El proceso que usamos en campañas reales: concepto, dirección de arte con IA, consistencia de producto y estilo, y piezas fijas y video para marca.",
    price: "[PRECIO]",
    regularPrice: "[REGULAR]",
    format: "Online",
    level: "Todos los niveles",
    audience: "Creativos, agencias, marcas",
    cover: { type: "image", src: "/projects/airbnb/still-02.webp", alt: "Still de campaña", caption: "Campaña" },
    gallery: [
      { type: "image", src: "/projects/beefeater-light/still-01.webp", alt: "Key visual", caption: "Key visual" },
      { type: "video", src: "/projects/stussy/magazine.mp4", poster: "/projects/stussy/magazine-poster.jpg", alt: "Pieza de motion", caption: "Motion — editorial" },
      { type: "image", src: "/projects/ginebra-cover-hero.webp", alt: "Joyería", caption: "Producto — joyería" },
      { type: "image", src: "/projects/oura/still-ring.webp", alt: "Anillo", caption: "Producto — CGI" },
      { type: "image", src: "/projects/airbnb/still-04.webp", alt: "Still de film", caption: "Film — still" },
      { type: "image", src: "/projects/eat-nudes-hero.jpg", alt: "Campaña de comida", caption: "Campaña — food" },
    ],
    outcomes: [
      "Un concepto con dirección de arte consistente.",
      "Key visuals con producto y estilo coherentes.",
      "Piezas de video para redes y campaña.",
      "Presentar la campaña a cliente como estudio.",
    ],
    modules: [
      { title: "Concepto y moodboard", detail: "De la idea a una dirección clara." },
      { title: "Dirección de arte con IA", detail: "Prompts, referencias y estilo." },
      { title: "Consistencia", detail: "Producto, personaje y estilo." },
      { title: "Video y motion", detail: "Piezas en movimiento." },
      { title: "Pitch y entrega", detail: "Presentar como estudio." },
    ],
  },
];
