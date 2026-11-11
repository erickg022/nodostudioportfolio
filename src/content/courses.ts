/**
 * Workshops landing (/cursos) — every piece of copy and media lives here.
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
  /** Short caption (mono, uppercase). */
  caption: string;
};

export type Course = {
  slug: string;
  num: string;
  /** Main name, shown big. */
  title: string;
  /** Second line of the name; "" to hide. */
  subtitle: string;
  /** Short label on the collection card and ticker. */
  focus: string;
  /** One-line hook: card hover and the opening of the detail sheet. */
  tagline: string;
  /** "El workshop" paragraphs. */
  intro: string[];
  learn: string[];
  requirements: string[];
  /** "Importante" note under the requirements. */
  note: string;
  takeaways: string[];
  /** Closing line after the takeaways. */
  closing: string;
  /** Spec rows shown next to the gallery. */
  specs: [string, string][];
  /** Presale price, e.g. "$2,500 MXN". */
  price: string;
  /** Regular price shown struck through; "" to hide. */
  regularPrice: string;
  /** Seat limit, e.g. "12 lugares"; "" to hide. */
  seats: string;
  cover: CourseMedia;
  /** Everything the student can make: drives the auto gallery, the strip and the section images. */
  gallery: CourseMedia[];
};

export const coursesSettings = {
  /**
   * Tally form id (the part after tally.so/r/). Add a hidden field named "curso" in Tally
   * so every signup records which course it came from. Leave "" to show a placeholder.
   */
  tallyFormId: "",
  season: "Temporada 01",
  title: "Aprende a crear lo que antes parecía imposible.",
  intro: [
    "Domina las herramientas de inteligencia artificial, diseño y tecnología creativa que utilizo en proyectos reales para marcas y experiencias digitales.",
    "Aprende mis workflows, transforma tus ideas en proyectos de alto impacto visual y construye piezas propias que puedas llevar a tu portafolio o aplicar profesionalmente.",
  ],
  cta: "Explora los workshops",
};

const A = "/cursos/arquitectura";
const C = "/cursos/campanas";
const E = "/cursos/experiencias";

const REQUIREMENTS_BASE = [
  "Laptop o computadora con conexión estable a internet.",
  "Cuenta en ChatGPT o Claude.",
  "Cuenta en Magnific AI — Plan Pro (obligatorio).",
];

/** Cards on the rotating hero wheel (14 works best). */
export const wheelMedia: CourseMedia[] = [
  { type: "image", src: `${E}/popup-paris.webp`, alt: "", caption: "Pop-up" },
  { type: "image", src: `${A}/pabellon-lago.webp`, alt: "", caption: "Arquitectura" },
  { type: "image", src: `${C}/running-key-visual.webp`, alt: "", caption: "Campaña" },
  { type: "image", src: `${E}/tunel-inflable.webp`, alt: "", caption: "Inmersivo" },
  { type: "image", src: `${A}/biblioteca.webp`, alt: "", caption: "Interior" },
  { type: "image", src: `${E}/flagship-escalera.webp`, alt: "", caption: "Flagship" },
  { type: "video", src: `${C}/airbnb-film.mp4`, poster: `${C}/airbnb-film-poster.jpg`, alt: "", caption: "Film" },
  { type: "image", src: `${C}/anillo-cgi.webp`, alt: "", caption: "Producto" },
  { type: "image", src: `${A}/sala-circular.webp`, alt: "", caption: "Espacio" },
  { type: "image", src: `${E}/concept-store.webp`, alt: "", caption: "Retail" },
  { type: "video", src: `${C}/joyeria-motion.mp4`, poster: `${C}/joyeria-motion-poster.jpg`, alt: "", caption: "Motion" },
  { type: "image", src: `${A}/lounge-terciopelo.webp`, alt: "", caption: "Material" },
  { type: "image", src: `${C}/film-still.webp`, alt: "", caption: "Still" },
  { type: "image", src: `${E}/stand-mostrador.webp`, alt: "", caption: "Stand" },
];

export const courses: Course[] = [
  {
    slug: "arquitectura",
    num: "01",
    title: "Arquitectura con IA",
    subtitle: "Renders Hiperrealistas + Tours Inmersivos",
    focus: "Render + Tour web",
    tagline:
      "Transforma tus proyectos arquitectónicos en visualizaciones hiperrealistas y experiencias digitales interactivas utilizando inteligencia artificial.",
    intro: [
      "En este workshop aprenderás a crear renders arquitectónicos de calidad profesional utilizando IA, sin depender de procesos complejos de renderizado.",
      "Descubrirás cómo generar interiores y exteriores hiperrealistas, controlar iluminación, materiales, composición y perspectivas, y transformar tus imágenes en recorridos inmersivos que tus clientes puedan explorar directamente desde una página web.",
      "Aprenderás un workflow práctico que combina generación visual, dirección creativa y desarrollo web asistido por IA, para llevar tus proyectos arquitectónicos a otro nivel.",
    ],
    learn: [
      "Cómo generar renders arquitectónicos hiperrealistas con IA.",
      "Cómo utilizar referencias, imágenes y proyectos existentes para generar nuevas visualizaciones.",
      "Técnicas de iluminación, composición, materiales y dirección visual.",
      "Cómo mantener consistencia arquitectónica entre diferentes perspectivas de un mismo espacio.",
      "Creación de imágenes y recorridos cinematográficos.",
      "Cómo transformar tus renders en un tour inmersivo e interactivo en web.",
      "Cómo utilizar ChatGPT o Claude para construir experiencias digitales sin conocimientos avanzados de programación.",
    ],
    requirements: [
      ...REQUIREMENTS_BASE,
      "Renders base, fotografías, planos o referencias de algún proyecto arquitectónico propio (opcional).",
      "No necesitas experiencia previa en programación.",
    ],
    note: "Después de completar tu inscripción, recibirás un correo electrónico con todas las instrucciones para configurar tus cuentas, preparar las herramientas y organizar los materiales antes del workshop. Las suscripciones a herramientas externas no están incluidas en el precio del curso.",
    takeaways: [
      "Tus propios renders arquitectónicos hiperrealistas.",
      "Un prototipo funcional de tour inmersivo en web.",
    ],
    closing:
      "Un proyecto desarrollado por ti que podrás compartir, presentar a clientes, integrar a tu portafolio o aplicar directamente en tus proyectos profesionales.",
    specs: [
      ["Formato", "Workshop práctico"],
      ["Duración", "3 horas"],
      ["Herramientas", "ChatGPT o Claude · Magnific AI Pro"],
      ["Programación", "No necesaria"],
    ],
    price: "$3,500 MXN",
    regularPrice: "$4,000 MXN",
    seats: "",
    cover: { type: "image", src: `${A}/pabellon-lago.webp`, alt: "Pabellón frente a un lago", caption: "Arquitectura" },
    gallery: [
      { type: "image", src: `${A}/pabellon-lago.webp`, alt: "Pabellón frente a un lago", caption: "Exterior — pabellón" },
      { type: "image", src: `${A}/biblioteca.webp`, alt: "Biblioteca en madera", caption: "Interior — biblioteca" },
      { type: "image", src: `${A}/sala-circular.webp`, alt: "Sala circular", caption: "Espacio — sala" },
      { type: "image", src: `${A}/lounge-terciopelo.webp`, alt: "Lounge de terciopelo", caption: "Interior — lounge" },
      { type: "image", src: `${A}/sala-cristal.webp`, alt: "Sala con muro de cristal", caption: "Interior — luz" },
      { type: "image", src: `${A}/lounge-alfombra.webp`, alt: "Lounge con alfombra roja", caption: "Interior — escala" },
      { type: "image", src: `${A}/detalle-terciopelo.webp`, alt: "Detalle de terciopelo", caption: "Material — detalle" },
    ],
  },
  {
    slug: "campanas",
    num: "02",
    title: "Campañas de Alto Impacto Visual con IA",
    subtitle: "",
    focus: "Concepto → Imagen → Video",
    tagline:
      "Aprende a transformar una simple fotografía de producto en una campaña publicitaria de alto nivel utilizando inteligencia artificial.",
    intro: [
      "En este workshop descubrirás cómo desarrollar campañas visuales para marcas, productos y proyectos creativos, combinando dirección de arte, generación de imágenes hiperrealistas y animación cinematográfica con IA.",
      "Aprenderás a construir un concepto visual, encontrar referencias de alto nivel y convertir tus ideas en imágenes y videos con una estética comparable a producciones publicitarias de gran presupuesto.",
      "Te enseñaré mi workflow para crear contenido visual de alto valor, desde la primera referencia hasta la pieza final, utilizando las herramientas que se están integrando en los procesos creativos profesionales.",
    ],
    learn: [
      "Cómo conceptualizar una campaña publicitaria desde cero.",
      "Dónde encontrar referencias visuales de alto nivel y cómo construir moodboards.",
      "Cómo desarrollar una dirección de arte consistente para tu marca o producto.",
      "Generación de fotografías editoriales y publicitarias hiperrealistas con IA.",
      "Cómo integrar productos reales en escenarios generados con inteligencia artificial.",
      "Creación de prompts profesionales para controlar iluminación, composición, materiales y estética.",
      "Cómo animar imágenes y generar videos cinematográficos con movimientos de cámara, iluminación y física realista.",
      "Cómo utilizar herramientas como Magnific, ChatGPT, Seedream y modelos de generación de video.",
      "Cómo organizar un workflow profesional y reutilizable para futuras campañas.",
    ],
    requirements: [
      ...REQUIREMENTS_BASE,
      "Fotografía de un producto, marca o concepto con el que quieras desarrollar tu campaña (opcional).",
      "No necesitas experiencia previa en producción audiovisual ni herramientas avanzadas de edición.",
    ],
    note: "Después de completar tu inscripción, recibirás un correo electrónico con todas las instrucciones para configurar tus cuentas, preparar las herramientas y reunir los materiales necesarios antes del workshop. Las suscripciones y créditos de herramientas externas no están incluidos en el precio del curso.",
    takeaways: [
      "Una dirección de arte y concepto visual definidos.",
      "Una serie de imágenes editoriales de alta calidad.",
      "Al menos un video publicitario cinematográfico.",
      "Un workflow que podrás replicar para futuras campañas.",
    ],
    closing:
      "Todo creado por ti, listo para utilizarse en redes sociales, presentaciones comerciales, proyectos de marca o como parte de tu portafolio profesional.",
    specs: [
      ["Formato", "Workshop práctico"],
      ["Herramientas", "Magnific · ChatGPT · Seedream · Video IA"],
      ["Resultado", "Mini campaña: imágenes + video"],
      ["Experiencia", "No necesaria"],
    ],
    price: "$3,500 MXN",
    regularPrice: "$4,000 MXN",
    seats: "",
    cover: { type: "image", src: `${C}/running-key-visual.webp`, alt: "Key visual de campaña de running", caption: "Campaña" },
    gallery: [
      { type: "image", src: `${C}/running-key-visual.webp`, alt: "Key visual de campaña de running", caption: "Key visual" },
      { type: "video", src: `${C}/airbnb-film.mp4`, poster: `${C}/airbnb-film-poster.jpg`, alt: "Film de campaña", caption: "Film — campaña" },
      { type: "image", src: `${C}/anillo-cgi.webp`, alt: "Anillo en CGI", caption: "Producto — CGI" },
      { type: "video", src: `${C}/joyeria-motion.mp4`, poster: `${C}/joyeria-motion-poster.jpg`, alt: "Pieza de motion de joyería", caption: "Motion — joyería" },
      { type: "image", src: `${C}/film-still.webp`, alt: "Still de film", caption: "Film — still" },
      { type: "video", src: `${C}/gorra-producto.mp4`, poster: `${C}/gorra-producto-poster.jpg`, alt: "Gorra en movimiento", caption: "Producto — video" },
      { type: "image", src: `${C}/froyo-producto.webp`, alt: "Producto de comida", caption: "Producto — food" },
      { type: "video", src: `${C}/tenis-film.mp4`, poster: `${C}/tenis-film-poster.jpg`, alt: "Film de tenis", caption: "Film — deporte" },
      { type: "video", src: `${C}/running-film.mp4`, poster: `${C}/running-film-poster.jpg`, alt: "Video de campaña de running", caption: "Campaña — video" },
      { type: "video", src: `${C}/food-film.mp4`, poster: `${C}/food-film-poster.jpg`, alt: "Video de campaña de comida", caption: "Campaña — food" },
    ],
  },
  {
    slug: "experiencias",
    num: "03",
    title: "De la Idea a la Experiencia",
    subtitle: "Creative Technology + IA",
    focus: "Marcas · Eventos · Retail",
    tagline: "Aprende a convertir tus ideas en experiencias interactivas reales utilizando inteligencia artificial y tecnologías creativas.",
    intro: [
      "¿Alguna vez has imaginado una activación para una marca, una instalación interactiva, una experiencia inmersiva o un concepto innovador de retail, pero no sabes cómo llevarlo a la realidad?",
      "En este workshop aprenderás a desarrollar proyectos de Creative Technology desde cero: comenzando con una idea, investigando referencias, construyendo un concepto creativo y aterrizándolo en una experiencia que puedas visualizar, prototipar y presentar profesionalmente.",
      "Exploraremos cómo combinar inteligencia artificial, diseño, programación asistida y herramientas interactivas para desarrollar proyectos que conecten el mundo físico con el digital.",
      "El objetivo no es únicamente aprender nuevas tecnologías, sino entender cómo utilizarlas para resolver problemas creativos y construir experiencias originales.",
    ],
    learn: [
      "Cómo transformar una idea en un concepto creativo sólido y realizable.",
      "Dónde investigar y encontrar referencias de instalaciones, retail, eventos y experiencias inmersivas.",
      "Cómo desarrollar un concepto, storytelling y dirección de arte para tu proyecto.",
      "Cómo visualizar espacios, instalaciones y experiencias utilizando IA.",
      "Cómo elegir las tecnologías adecuadas para cada proyecto.",
      "Introducción práctica a tecnologías como computer vision, hand tracking, interacciones web y sensores.",
      "Cómo utilizar ChatGPT o Claude para desarrollar prototipos interactivos con programación asistida por IA.",
      "Cómo construir un prototipo funcional de tu idea.",
      "Cómo documentar y presentar el proyecto para clientes, estudios creativos o tu portafolio profesional.",
    ],
    requirements: [
      ...REQUIREMENTS_BASE,
      "Cámara web funcional para los ejercicios que involucren interacciones visuales.",
      "Una idea, marca, concepto o problema creativo que quieras desarrollar (opcional).",
      "No necesitas experiencia previa en programación.",
    ],
    note: "Después de completar tu inscripción, recibirás un correo electrónico con todas las instrucciones para configurar tus cuentas, preparar las herramientas y organizar tus materiales antes del workshop. Las suscripciones y créditos de herramientas externas no están incluidos en el precio del curso.",
    takeaways: [
      "Un concepto creativo original.",
      "Una dirección visual y referencias definidas.",
      "Visualizaciones de cómo funcionaría tu experiencia.",
      "Un prototipo interactivo funcional de alcance definido.",
      "Una presentación del proyecto que puedas utilizar como caso de estudio.",
    ],
    closing:
      "Un proyecto creado por ti, de la idea al prototipo, listo para incorporarlo a tu portafolio, presentarlo a potenciales clientes o continuar desarrollándolo como una experiencia real.",
    specs: [
      ["Formato", "Workshop práctico"],
      ["Tecnologías", "IA · Computer vision · Hand tracking · Web"],
      ["Necesitas", "Cámara web"],
      ["Programación", "No necesaria"],
    ],
    price: "$2,500 MXN",
    regularPrice: "$3,000 MXN",
    seats: "12 lugares",
    cover: { type: "image", src: `${E}/popup-paris.webp`, alt: "Pop-up de marca en una calle de París", caption: "Pop-up" },
    gallery: [
      { type: "image", src: `${E}/popup-paris.webp`, alt: "Pop-up de marca en una calle de París", caption: "Pop-up — exterior" },
      { type: "image", src: `${E}/flagship-escalera.webp`, alt: "Flagship con escalera y mesa de producto", caption: "Retail — flagship" },
      { type: "video", src: `${E}/inflable-film.mp4`, poster: `${E}/inflable-film-poster.jpg`, alt: "Pabellón inflable animado", caption: "Instalación — en movimiento" },
      { type: "image", src: `${E}/tunel-inflable.webp`, alt: "Túnel inflable iluminado", caption: "Inmersivo — túnel" },
      { type: "image", src: `${E}/lab-store.webp`, alt: "Laboratorio interactivo de marca", caption: "Activación — lab" },
      { type: "image", src: `${E}/stand-mostrador.webp`, alt: "Stand de marca con mostrador circular", caption: "Evento — stand" },
      { type: "image", src: `${E}/concept-store.webp`, alt: "Concept store en acero", caption: "Retail — concept store" },
      { type: "image", src: `${E}/pabellon-inflable.webp`, alt: "Pabellón inflable de marca", caption: "Instalación — pabellón" },
      { type: "image", src: `${E}/cafe-retail.webp`, alt: "Café de marca", caption: "Espacio — café" },
      { type: "image", src: `${E}/mostrador-detalle.webp`, alt: "Detalle de mostrador", caption: "Detalle — producto" },
    ],
  },
];
