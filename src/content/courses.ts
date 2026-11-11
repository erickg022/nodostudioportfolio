/**
 * Courses landing (/cursos) — every piece of copy and media lives here.
 *
 * MEDIA: /public/cursos/<course-slug>/. Images: .webp, max 1600 px on the long side.
 * Videos: silent H.264 .mp4, ideally < 5 MB, with a .jpg poster next to it.
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
  /** Presale price, e.g. "$2,500 MXN". */
  price: string;
  /** Regular price shown struck through; leave "" to hide. */
  regularPrice: string;
  /** Seat limit shown on the card and in the specs, e.g. "12 lugares"; leave "" to hide. */
  seats: string;
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
    "Tres cursos para diseñar experiencias de retail inmersivas, renders hiperrealistas con tour web y campañas audiovisuales con IA — con los procesos que usamos en proyectos para Lacoste, Airbnb y Stüssy × Moncler.",
};

const R = "/cursos/render";
const F = "/cursos/film";
const C = "/cursos/campanas";

/** Cards on the rotating hero wheel (14 works best). */
export const wheelMedia: CourseMedia[] = [
  { type: "image", src: `${R}/popup-paris.webp`, alt: "", caption: "Pop-up" },
  { type: "image", src: `${F}/pabellon-lago.webp`, alt: "", caption: "Arquitectura" },
  { type: "image", src: `${C}/running-key-visual.webp`, alt: "", caption: "Campaña" },
  { type: "image", src: `${R}/tunel-inflable.webp`, alt: "", caption: "Inmersivo" },
  { type: "image", src: `${F}/biblioteca.webp`, alt: "", caption: "Interior" },
  { type: "image", src: `${R}/flagship-escalera.webp`, alt: "", caption: "Flagship" },
  { type: "video", src: `${C}/airbnb-film.mp4`, poster: `${C}/airbnb-film-poster.jpg`, alt: "", caption: "Film" },
  { type: "image", src: `${C}/anillo-cgi.webp`, alt: "", caption: "Producto" },
  { type: "image", src: `${F}/sala-circular.webp`, alt: "", caption: "Espacio" },
  { type: "image", src: `${R}/concept-store.webp`, alt: "", caption: "Retail" },
  { type: "video", src: `${C}/joyeria-motion.mp4`, poster: `${C}/joyeria-motion-poster.jpg`, alt: "", caption: "Motion" },
  { type: "image", src: `${F}/lounge-terciopelo.webp`, alt: "", caption: "Material" },
  { type: "image", src: `${C}/film-still.webp`, alt: "", caption: "Still" },
  { type: "image", src: `${R}/stand-mostrador.webp`, alt: "", caption: "Stand" },
];

export const courses: Course[] = [
  {
    slug: "render",
    num: "01",
    title: "Retail & Experiencias Inmersivas",
    focus: "Arquitectura · Pop-ups",
    short: "Conceptos de retail, pop-ups y espacios inmersivos con IA.",
    description:
      "Diseña conceptos de arquitectura comercial, pop-ups y experiencias inmersivas con IA: del brief de marca a imágenes que venden la idea al cliente.",
    price: "$2,500 MXN",
    regularPrice: "$3,000 MXN",
    seats: "12 lugares",
    format: "Online",
    level: "Principiante – Intermedio",
    audience: "Arquitectos, interioristas, retail, marcas",
    cover: { type: "image", src: `${R}/popup-paris.webp`, alt: "Pop-up de marca en una calle de París", caption: "Pop-up" },
    gallery: [
      { type: "image", src: `${R}/popup-paris.webp`, alt: "Pop-up de marca en una calle de París", caption: "Pop-up — exterior" },
      { type: "image", src: `${R}/flagship-escalera.webp`, alt: "Flagship con escalera y mesa de producto", caption: "Flagship — interior" },
      { type: "video", src: `${R}/inflable-film.mp4`, poster: `${R}/inflable-film-poster.jpg`, alt: "Pabellón inflable animado", caption: "Concepto — en movimiento" },
      { type: "image", src: `${R}/tunel-inflable.webp`, alt: "Túnel inflable iluminado", caption: "Inmersivo — túnel" },
      { type: "image", src: `${R}/concept-store.webp`, alt: "Concept store en acero", caption: "Retail — concept store" },
      { type: "image", src: `${R}/stand-mostrador.webp`, alt: "Stand de marca con mostrador circular", caption: "Stand — mostrador" },
    ],
    outcomes: [
      "Conceptos de retail, pop-ups y stands listos para presentar.",
      "Experiencias inmersivas con identidad de marca clara.",
      "Luz, materiales y cámara para que no se vea “hecho con IA”.",
      "Entregar en alta resolución, lista para cliente.",
    ],
    modules: [
      { title: "Del brief al concepto", detail: "Leer la marca y traducirla a espacio." },
      { title: "Retail y flagships", detail: "Fachadas, interiores, mobiliario de producto." },
      { title: "Pop-ups e inmersivos", detail: "Inflables, túneles, instalaciones." },
      { title: "Materiales, luz y atmósfera", detail: "Que se lea como fotografía." },
      { title: "Presentación y entrega", detail: "Upscale y deck para cliente." },
    ],
  },
  {
    slug: "film",
    num: "02",
    title: "Render Hiperrealista + Tour Web",
    focus: "Render + Film + Web",
    short: "Renders que parecen foto, convertidos en tour animado y web.",
    description:
      "Renders de arquitectura e interiores que se leen como fotografía, convertidos en un tour cinematográfico y en una web con scroll animation construida con Claude — sin ser programador.",
    price: "$3,500 MXN",
    regularPrice: "$4,000 MXN",
    seats: "",
    format: "Online",
    level: "Intermedio",
    audience: "Arquitectos, desarrolladores, estudios",
    cover: { type: "image", src: `${F}/pabellon-lago.webp`, alt: "Pabellón frente a un lago", caption: "Arquitectura" },
    gallery: [
      { type: "image", src: `${F}/pabellon-lago.webp`, alt: "Pabellón frente a un lago", caption: "Exterior — pabellón" },
      { type: "image", src: `${F}/biblioteca.webp`, alt: "Biblioteca en madera", caption: "Interior — biblioteca" },
      { type: "image", src: `${F}/sala-circular.webp`, alt: "Sala circular", caption: "Espacio — sala" },
      { type: "image", src: `${F}/lounge-terciopelo.webp`, alt: "Lounge de terciopelo", caption: "Interior — lounge" },
      { type: "image", src: `${F}/sala-cristal.webp`, alt: "Sala con muro de cristal", caption: "Interior — luz" },
      { type: "image", src: `${F}/detalle-terciopelo.webp`, alt: "Detalle de terciopelo", caption: "Material — detalle" },
    ],
    outcomes: [
      "Renders fotorrealistas de interiores y arquitectura.",
      "Un tour arquitectónico planeado como un film.",
      "Una web de recorrido con scroll animation, hecha con Claude.",
      "Publicar el tour para presentar o vender proyectos.",
    ],
    modules: [
      { title: "Fundamentos del fotorrealismo", detail: "Qué hace que una imagen se lea como foto." },
      { title: "Del render a la toma", detail: "Animar imágenes fijas con IA de video." },
      { title: "Cámara para arquitectura", detail: "Dollys, reveals y ritmo." },
      { title: "Scroll tours con Claude", detail: "Tu recorrido como web animada." },
      { title: "Publicar y presentar", detail: "Para clientes y compradores." },
    ],
  },
  {
    slug: "campanas",
    num: "03",
    title: "IA para Campañas Audiovisuales",
    focus: "Concepto → Producción",
    short: "El workflow de estudio para campañas visuales con IA.",
    description:
      "El proceso que usamos en campañas reales: concepto, dirección de arte con IA, consistencia de producto y estilo, y piezas fijas y video para marca.",
    price: "$3,500 MXN",
    regularPrice: "$4,000 MXN",
    seats: "",
    format: "Online",
    level: "Todos los niveles",
    audience: "Creativos, agencias, marcas",
    cover: { type: "image", src: `${C}/running-key-visual.webp`, alt: "Key visual de campaña de running", caption: "Campaña" },
    gallery: [
      { type: "image", src: `${C}/running-key-visual.webp`, alt: "Key visual de campaña de running", caption: "Key visual" },
      { type: "video", src: `${C}/airbnb-film.mp4`, poster: `${C}/airbnb-film-poster.jpg`, alt: "Film de campaña", caption: "Film — campaña" },
      { type: "image", src: `${C}/anillo-cgi.webp`, alt: "Anillo en CGI", caption: "Producto — CGI" },
      { type: "video", src: `${C}/joyeria-motion.mp4`, poster: `${C}/joyeria-motion-poster.jpg`, alt: "Pieza de motion de joyería", caption: "Motion — joyería" },
      { type: "image", src: `${C}/froyo-producto.webp`, alt: "Producto de comida", caption: "Producto — food" },
      { type: "video", src: `${C}/tenis-film.mp4`, poster: `${C}/tenis-film-poster.jpg`, alt: "Film de tenis", caption: "Film — deporte" },
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
