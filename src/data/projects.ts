export const DISCIPLINES = ["IMAGE", "MOTION", "SPACE", "SYSTEMS"] as const;
export const ROLES = [
  "CREATIVE DIRECTION",
  "CREATIVE TECHNOLOGY",
  "CGI / AI",
  "EXPERIENTIAL",
  "POST / FINISH",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];
export type Role = (typeof ROLES)[number];

export type ProjectSystem = {
  input?: string;
  system?: string;
  feedback?: string;
  concept?: string;
  world?: string;
  output?: string;
};

export type MediaBlock =
  | {
      type: "image";
      label: string;
      src?: string;
      alt: string;
      caption?: string;
      layout?: "wide" | "portrait" | "split" | "contact";
    }
  | {
      type: "video";
      label: string;
      src?: string;
      poster?: string;
      alt: string;
      caption?: string;
      companionImage?: {
        src: string;
        alt: string;
        caption?: string;
        position?: "left" | "right";
      };
      align?: "center" | "right";
      layout?: "wide" | "portrait" | "split";
    }
  | {
      type: "text";
      eyebrow: string;
      title: string;
      body: string;
    }
  | {
      type: "gallery";
      label: string;
      caption?: string;
      variant?: "default" | "staggered-right";
      items: Array<{
        src: string;
        alt: string;
        caption?: string;
        layout?: "wide" | "portrait" | "square";
      }>;
    };

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  type: string;
  status: string;
  disciplineText: string;
  hoverCategory?: string;
  description: string;
  coverImage: string;
  coverAvailable?: boolean;
  coverVideo?: {
    src: string;
    webmSrc?: string;
    poster?: string;
  };
  accentColor: string;
  systemContent: ProjectSystem;
  statement: string;
  contentMode: "system" | "campaign";
  featured: boolean;
  shortDescription: string;
  longDescription: string;
  disciplines: Discipline[];
  roles: Role[];
  projectType: string;
  collaborationCredits: string[];
  deliverables: string[];
  toolsMethods: string[];
  heroMedia: {
    type: "image" | "video";
    src?: string;
    poster?: string;
    muxPlaybackId?: string;
    alt: string;
  };
  scrollSequence?: Array<{
    type?: "image" | "video";
    src: string;
    webmSrc?: string;
    srcHigh?: string;
    poster?: string;
    alt: string;
    pairWithNext?: boolean;
    layout?: "wide" | "portrait" | "square";
  }>;
  mediaBlocks: MediaBlock[];
  externalLink?: string;
  lab?: boolean;
};

const PROJECT_DISPLAY_ORDER = [
  "lacoste-roland-garros",
  "ginebra",
  "stussy-moncler",
  "twojeys",
  "gdl-movilidad",
  "eat-nudes",
  "nike-world-cup",
  "play-in-motion",
  "axe-ceremonia-ar-portal",
];

const PROJECT_CONTENT: Record<
  string,
  Pick<
    Project,
    | "title"
    | "subtitle"
    | "client"
    | "year"
    | "type"
    | "status"
    | "disciplineText"
    | "hoverCategory"
    | "description"
    | "shortDescription"
    | "longDescription"
    | "projectType"
    | "statement"
  >
> = {
  "lacoste-roland-garros": {
    title: "LACOSTE × ROLAND-GARROS",
    subtitle: "LACOSTE × ROLAND-GARROS",
    client: "LACOSTE × ROLAND-GARROS",
    year: "2026",
    type: "EXPERIENTIAL MARKETING VISUALS",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    disciplineText: "Creative Direction / Spatial Design / AI Visual Development / Retail",
    hoverCategory: "Retail Creative Direction",
    description:
      "A pop-up exploring French tennis heritage through contemporary fashion, immersive retail, and spatial storytelling.\n\nBuilt through creative direction, spatial design, and AI visual development, it imagines a complete brand world across every touchpoint.",
    shortDescription:
      "A pop-up exploring French tennis heritage through contemporary fashion, immersive retail, and spatial storytelling.",
    longDescription:
      "A pop-up exploring French tennis heritage through contemporary fashion, immersive retail, and spatial storytelling. Built through creative direction, spatial design, and AI visual development, it imagines a complete brand world across every touchpoint.",
    projectType: "Experiential marketing visuals",
    statement:
      "A pop-up exploring French tennis heritage through contemporary fashion, immersive retail, and spatial storytelling.\n\nBuilt through creative direction, spatial design, and AI visual development, it imagines a complete brand world across every touchpoint.",
  },
  ginebra: {
    title: "GINEBRA JOYERIA",
    subtitle: "JEWELRY DISPENSER CAMPAIGN",
    client: "GINEBRA JOYERIA",
    year: "2026",
    type: "CGI + AI CAMPAIGN",
    status: "CLIENT PROJECT",
    disciplineText: "Creative Direction / CGI / AI Visuals / Motion + 3D",
    hoverCategory: "CGI + AI",
    description:
      "Premium launch visuals for Ginebra, a jewelry brand featured in British Vogue, combining CGI craft, AI image direction, and product-world storytelling.",
    shortDescription:
      "Premium launch visuals combining CGI craft, AI image direction, and product-world storytelling.",
    longDescription:
      "Premium launch visuals for Ginebra, a jewelry brand featured in British Vogue, combining CGI craft, AI image direction, and product-world storytelling.",
    projectType: "CGI + AI campaign",
    statement:
      "Premium launch visuals for Ginebra, a jewelry brand featured in British Vogue.",
  },
  "stussy-moncler": {
    title: "STUSSY × MONCLER",
    subtitle: "INSIDE THE WAVE SS2027",
    client: "STUSSY × MONCLER",
    year: "2026",
    type: "CGI + AI CAMPAIGN",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    disciplineText: "Creative Direction / CGI / AI Visuals / Motion + 3D",
    hoverCategory: "AI Visual Campaign",
    description:
      "A speculative campaign world for Stussy × Moncler, built around the collision of alpine performance, streetwear codes, and cinematic winter atmosphere.\n\nThe project explores how AI image direction, CGI, motion, and 3D visual development can extend a fashion collaboration into a complete visual system across stills, moving-image assets, and launch-world storytelling.",
    shortDescription:
      "A speculative Stussy × Moncler campaign world built through AI image direction, CGI, motion, and 3D visual development.",
    longDescription:
      "A speculative campaign world for Stussy × Moncler, built around the collision of alpine performance, streetwear codes, and cinematic winter atmosphere. The project explores how AI image direction, CGI, motion, and 3D visual development can extend a fashion collaboration into a complete visual system across stills, moving-image assets, and launch-world storytelling.",
    projectType: "CGI + AI campaign",
    statement:
      "A speculative campaign world for Stussy × Moncler, built around alpine performance, streetwear codes, and cinematic winter atmosphere.",
  },
  twojeys: {
    title: "TWOJEYS",
    subtitle: "AI VISUAL CAMPAIGN",
    client: "TWOJEYS",
    year: "2026",
    type: "AI VISUAL CAMPAIGN",
    status: "CLIENT PROJECT",
    disciplineText: "AI Visuals / Creative Direction / Campaign Imagery / Post-Production",
    hoverCategory: "AI Creative Direction",
    description:
      "An AI-led visual campaign system for TWOJEYS, exploring new product forms through synthetic image direction, campaign mood, and polished visual storytelling.",
    shortDescription:
      "An AI-led visual campaign system exploring new product forms through synthetic image direction.",
    longDescription:
      "An AI-led visual campaign system for TWOJEYS, exploring new product forms through synthetic image direction, campaign mood, and polished visual storytelling.",
    projectType: "AI visual campaign",
    statement:
      "An AI-led visual campaign system for TWOJEYS, exploring new product forms through synthetic image direction.",
  },
  "gdl-movilidad": {
    title: "GDL GOVERNMENT",
    subtitle: "AR TRANSIT NAVIGATION",
    client: "GDL GOVERNMENT",
    year: "2025",
    type: "AUGMENTED REALITY + APP DEVELOPMENT",
    status: "CONCEPT + PROTOTYPE",
    disciplineText:
      "AR Experience Design / Image Recognition / Interaction Design / Interface Design / Systems Design / App Development",
    hoverCategory: "AR + Systems",
    description:
      "An augmented-reality transit navigation prototype developed for Guadalajara's public transport system. Users scan a physical transport card to access route information, choose their destination, and activate an AR guidance layer that maps the journey through directional overlays, stops, transfers, and real-time navigation cues.",
    shortDescription:
      "An augmented-reality transit navigation prototype developed for Guadalajara's public transport system.",
    longDescription:
      "An augmented-reality transit navigation prototype developed for Guadalajara's public transport system. Users scan a physical transport card to access route information, choose their destination, and activate an AR guidance layer that maps the journey through directional overlays, stops, transfers, and real-time navigation cues.",
    projectType: "Augmented reality + app development",
    statement:
      "An augmented-reality transit navigation prototype developed for Guadalajara's public transport system.",
  },
  "eat-nudes": {
    title: "EAT NUDES",
    subtitle: "DIGITAL CAMPAIGNS, WEB + MENU DESIGN",
    client: "EAT NUDES",
    year: "2026",
    type: "DIGITAL BRAND SYSTEM",
    status: "CLIENT PROJECT",
    disciplineText: "Web Design / Motion / Digital Menus / AI + CGI Content",
    hoverCategory: "Creative Technology + Production",
    description:
      "A multi-platform digital rollout for EAT NUDES, including AI-led campaign imagery, CGI product content, web design, animated digital menus, and social-first creative direction.",
    shortDescription:
      "A multi-platform digital rollout spanning AI imagery, CGI content, web design, menus, and social direction.",
    longDescription:
      "A multi-platform digital rollout for EAT NUDES, including AI-led campaign imagery, CGI product content, web design, animated digital menus, and social-first creative direction.",
    projectType: "Digital brand system",
    statement:
      "A multi-platform digital rollout for EAT NUDES, including AI-led campaign imagery, CGI product content, web design, animated digital menus, and social-first creative direction.",
  },
  "nike-world-cup": {
    title: "NIKE FOOTBALL",
    subtitle: "WORLD CUP POP-UP STORE",
    client: "NIKE FOOTBALL",
    year: "2025",
    type: "EXPERIENTIAL MARKETING / SPATIAL BRAND VISUALS",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    disciplineText:
      "Creative Direction / Experiential Design / Spatial Visual Development / AI Visuals / Retail Concept",
    hoverCategory: "Retail Creative Direction",
    description:
      "A speculative Nike Football pop-up store developed for the World Cup, translating football culture into an immersive retail experience. The project combines spatial storytelling, product moments, campaign visuals, and interactive brand zones to imagine how Nike Football could activate the city around the tournament.",
    shortDescription:
      "A speculative Nike Football pop-up store developed for the World Cup.",
    longDescription:
      "A speculative Nike Football pop-up store developed for the World Cup, translating football culture into an immersive retail experience. The project combines spatial storytelling, product moments, campaign visuals, and interactive brand zones to imagine how Nike Football could activate the city around the tournament.",
    projectType: "Experiential marketing / spatial brand visuals",
    statement:
      "A speculative Nike Football pop-up store developed for the World Cup, translating football culture into an immersive retail experience.",
  },
  "play-in-motion": {
    title: "AVOCADOS FROM MEXICO",
    subtitle: "HAND-TRACKED BRAND ACTIVATION",
    client: "AVOCADOS FROM MEXICO",
    year: "2025",
    type: "INTERACTIVE GAME DEVELOPMENT / EXPERIENTIAL TECHNOLOGY",
    status: "CLIENT PROJECT",
    disciplineText:
      "Creative Technology / Game Design / Hand Tracking / Real-Time Interaction / Installation Design",
    hoverCategory: "AR Activation",
    description:
      "Two camera-based interactive games developed for a live Avocados From Mexico expo activation. Visitors controlled each experience with their hands in front of a screen: real-time tracking translated physical gestures into in-game actions, reactions, and score-based play. The games turned the booth into a participatory brand moment, encouraging movement, competition, and repeat engagement rather than passive viewing.",
    shortDescription:
      "Two camera-based interactive games developed for a live Avocados From Mexico expo activation.",
    longDescription:
      "Two camera-based interactive games developed for a live Avocados From Mexico expo activation. Visitors controlled each experience with their hands in front of a screen: real-time tracking translated physical gestures into in-game actions, reactions, and score-based play. The games turned the booth into a participatory brand moment, encouraging movement, competition, and repeat engagement rather than passive viewing.",
    projectType: "Interactive game development / experiential technology",
    statement:
      "Two camera-based interactive games developed for a live Avocados From Mexico expo activation.",
  },
  "axe-ceremonia-ar-portal": {
    title: "AXE CEREMONIA",
    subtitle: "AUGMENTED REALITY BRAND ACTIVATION",
    client: "AXE CEREMONIA",
    year: "2025",
    type: "AUGMENTED REALITY / EXPERIENTIAL TECHNOLOGY",
    status: "CLIENT PROJECT",
    disciplineText:
      "Creative Technology / AR Experience Design / Spatial Computing / Real-Time 3D / Interaction Design / Mobile Interface",
    hoverCategory: "AR Activation",
    description:
      "An augmented-reality brand activation developed for AXE Ceremonia, using mobile-based spatial tracking and real-time 3D content to transform a physical festival moment into an interactive digital layer. The experience guided users through a portal-like AR sequence, placing branded visual environments and responsive digital elements directly within their surroundings to create a more immersive, shareable on-site interaction.",
    shortDescription:
      "An augmented-reality brand activation developed for AXE Ceremonia.",
    longDescription:
      "An augmented-reality brand activation developed for AXE Ceremonia, using mobile-based spatial tracking and real-time 3D content to transform a physical festival moment into an interactive digital layer. The experience guided users through a portal-like AR sequence, placing branded visual environments and responsive digital elements directly within their surroundings to create a more immersive, shareable on-site interaction.",
    projectType: "Augmented reality / experiential technology",
    statement:
      "An augmented-reality brand activation developed for AXE Ceremonia, using mobile-based spatial tracking and real-time 3D content.",
  },
};

// Replace cover assets in /public/projects/. Keep these filenames for the carousel.
const projectRecords: Project[] = [
  {
    slug: "axe-ceremonia-ar-portal",
    index: "01",
    title: "AXE CEREMONIA",
    subtitle: "AR PORTAL",
    year: "2025",
    type: "AUGMENTED REALITY",
    disciplineText: "AR / Spatial Interaction / Experiential / Mobile Interface",
    status: "PROJECT",
    description:
      "An augmented-reality portal experience for Axe Ceremonia, extending a physical brand moment into a spatial digital layer.",
    coverImage: "/projects/axe-ceremonia-hero.jpg",
    coverAvailable: true,
    accentColor: "#b93015",
    systemContent: {
      input: "Mobile camera interaction and portal entry.",
      system: "AR tracking and spatial interface logic connect the physical environment to a digital brand layer.",
      feedback: "Portal reveal, visual confirmation, and guided interaction moments.",
    },
    statement:
      "Axe Ceremonia AR Portal turns a brand encounter into a spatial entry point, using augmented reality as an image-led interaction layer.",
    contentMode: "system",
    client: "AXE CEREMONIA",
    featured: true,
    shortDescription: "Augmented-reality portal experience for a spatial brand moment.",
    longDescription:
      "An augmented-reality portal experience for Axe Ceremonia, extending a physical brand moment into a spatial digital layer.",
    disciplines: ["SYSTEMS", "SPACE"],
    roles: ["CREATIVE TECHNOLOGY", "EXPERIENTIAL", "CREATIVE DIRECTION"],
    projectType: "Augmented reality portal",
    collaborationCredits: ["[ADD CREDITS HERE]"],
    deliverables: ["AR portal", "Spatial interaction flow", "Mobile interface", "Experience prototype"],
    toolsMethods: ["AR prototyping", "Spatial tracking", "Mobile interaction design", "Experience design"],
    heroMedia: {
      type: "image",
      src: "/projects/axe-ceremonia-hero.jpg",
      alt: "Axe Ceremonia AR portal hero image",
    },
    scrollSequence: [
      {
        type: "image",
        src: "/projects/axe-ceremonia-hero.jpg",
        alt: "Axe Ceremonia AR portal hero image",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/axe-ceremonia-ar-portal.mp4",
        poster: "/projects/videos/axe-ceremonia-ar-portal-poster.jpg",
        alt: "Axe Ceremonia AR portal mobile capture",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/axe-ceremonia-portal.png",
        alt: "Axe Ceremonia AR portal still",
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/axe-ceremonia-still-01.jpg",
        alt: "Axe Ceremonia AR portal still",
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/axe-ceremonia-still-02.jpg",
        alt: "Axe Ceremonia AR portal visual still",
        layout: "wide",
      },
    ],
    mediaBlocks: [
      {
        type: "video",
        label: "AR Portal Capture",
        src: "/projects/videos/axe-ceremonia-ar-portal.mp4",
        poster: "/projects/videos/axe-ceremonia-ar-portal-poster.jpg",
        alt: "Axe Ceremonia AR portal mobile capture",
        caption: "Vertical capture documenting the Axe Ceremonia augmented-reality portal interaction.",
        companionImage: {
          src: "/projects/axe-ceremonia-still-01.jpg",
          alt: "Axe Ceremonia AR portal still",
          caption: "Portal still",
        },
        layout: "portrait",
      },
      {
        type: "gallery",
        label: "AR Portal Image System",
        caption:
          "Selected visual stills from the Axe Ceremonia AR portal world and spatial brand layer.",
        items: [
          {
            src: "/projects/axe-ceremonia-still-02.jpg",
            alt: "Axe Ceremonia AR portal visual still",
            caption: "Spatial layer",
            layout: "wide",
          },
          {
            src: "/projects/axe-ceremonia-still-03.jpg",
            alt: "Axe Ceremonia AR portal environment still",
            caption: "Portal environment",
            layout: "wide",
          },
        ],
      },
    ],
  },
  {
    slug: "gdl-movilidad",
    index: "02",
    title: "GDL MOVILIDAD",
    subtitle: "AR TRANSIT NAVIGATION",
    year: "2024",
    type: "AUGMENTED REALITY",
    disciplineText: "AR / Mapping / Mobility / Interface Design",
    status: "CONCEPT + PROTOTYPE",
    description:
      "An augmented transit navigation system where users scan a transport card, select a route, and reveal directional information through an immersive AR layer.",
    coverImage: "/projects/gdl-cover.jpg",
    accentColor: "#346b83",
    systemContent: {
      input: "Transit card scan and origin/destination selection.",
      system: "Route logic and mapping data are translated into spatial AR direction cues.",
      feedback: "Augmented route visualization and step-by-step navigation.",
    },
    statement:
      "GDL Movilidad turns transit data into a spatial interface, using AR to make route decisions visible in the physical environment.",
    contentMode: "system",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Augmented transit navigation prototype for route discovery.",
    longDescription:
      "An augmented transit navigation system where card scanning, route logic, and spatial directions become one mobile AR experience.",
    disciplines: ["SPACE", "SYSTEMS"],
    roles: ["CREATIVE TECHNOLOGY", "EXPERIENTIAL"],
    projectType: "Augmented reality",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["AR prototype", "Route interaction flow", "Interface system", "Spatial cues"],
    toolsMethods: ["AR prototyping", "Mapping logic", "Mobile interface design", "Wayfinding"],
    heroMedia: {
      type: "image",
      src: "/projects/gdl-work.jpg",
      alt: "GDL Movilidad AR transit navigation cover",
    },
    mediaBlocks: [
      {
        type: "video",
        label: "Macro Instructions",
        src: "/projects/videos/macro-instrucciones.mp4",
        alt: "GDL Movilidad macro instructions video",
        caption: "Instructional motion layer for the GDL Movilidad AR transit interface.",
        layout: "wide",
      },
      {
        type: "gallery",
        label: "AR Transit Interface Stills",
        caption:
          "Route discovery screens and spatial navigation moments from the GDL Movilidad augmented transit prototype.",
        items: [
          {
            src: "/projects/gdl-movilidad-ar-01.jpg",
            alt: "GDL Movilidad AR route selection interface",
            caption: "Route interface",
            layout: "wide",
          },
          {
            src: "/projects/gdl-movilidad-ar-02.jpg",
            alt: "GDL Movilidad AR navigation prototype screen",
            caption: "Spatial cue",
            layout: "wide",
          },
        ],
      },
    ],
  },
  {
    slug: "play-in-motion",
    index: "03",
    title: "AVOCADOS FROM MEXICO",
    subtitle: "HAND-TRACKED BRAND ACTIVATION",
    year: "2025",
    type: "EXPERIENTIAL TECHNOLOGY",
    disciplineText: "Hand Tracking / Game Design / Real-Time Interaction / Installation",
    status: "CLIENT PROJECT",
    description:
      "Two camera-based interactive games created for a live expo activation, transforming hand movements into playful branded experiences.",
    coverImage: "/projects/play-cover.jpg",
    accentColor: "#6d6f2f",
    systemContent: {
      input: "Real-time user movement and hand tracking.",
      system: "Interactive game logic converts body movement into branded play mechanics.",
      feedback: "Scoring, visual rewards, motion feedback, and live activation energy.",
    },
    statement:
      "Play in Motion converts the body into an interface, making branded interaction immediate, public, and physically memorable.",
    contentMode: "system",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Camera-based interactive games for a live expo activation.",
    longDescription:
      "Two real-time interactive games that transform hand movement and body motion into branded play mechanics.",
    disciplines: ["SPACE", "SYSTEMS", "MOTION"],
    roles: ["CREATIVE TECHNOLOGY", "EXPERIENTIAL", "CREATIVE DIRECTION"],
    projectType: "Experiential technology",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Interactive games", "Hand-tracking prototype", "Activation system", "Live installation logic"],
    toolsMethods: ["Hand tracking", "Game logic", "Real-time interaction", "Installation testing"],
    heroMedia: {
      type: "image",
      src: "/projects/avocados-work.jpg",
      alt: "Avocados From Mexico hand-tracked brand activation cover",
    },
    scrollSequence: [
      {
        type: "image",
        src: "/projects/avocados-work.jpg",
        alt: "Avocados From Mexico hand-tracked brand activation cover",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/avocados-node-ar-ifba.mp4",
        poster: "/projects/videos/avocados-node-ar-ifba-poster.jpg",
        alt: "Avocados From Mexico AR game capture",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/avocados-installation-02.jpg",
        alt: "Avocados From Mexico interactive game still",
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/avocados-installation-01.jpg",
        alt: "Avocados From Mexico interactive activation still",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "video",
        src: "/projects/videos/avocados-live-demo.mp4",
        poster: "/projects/videos/avocados-live-demo-poster.jpg",
        alt: "Avocados From Mexico live demo video",
        layout: "portrait",
      },
    ],
    mediaBlocks: [
      {
        type: "video",
        label: "AR Game Capture",
        src: "/projects/videos/avocados-node-ar-ifba.mp4",
        poster: "/projects/videos/avocados-node-ar-ifba-poster.jpg",
        alt: "Avocados From Mexico AR game capture",
        caption: "Vertical capture from the interactive Avocados From Mexico activation system.",
        companionImage: {
          src: "/projects/avocados-installation-01.jpg",
          alt: "Avocados From Mexico interactive activation still",
          caption: "Activation still",
        },
        layout: "portrait",
      },
      {
        type: "video",
        label: "Live Demo",
        src: "/projects/videos/avocados-live-demo.mp4",
        poster: "/projects/videos/avocados-live-demo-poster.jpg",
        alt: "Avocados From Mexico live demo video",
        caption: "Mobile documentation of the interaction running live.",
        companionImage: {
          src: "/projects/avocados-installation-02.jpg",
          alt: "Avocados From Mexico interactive game still",
          caption: "Game still",
          position: "left",
        },
        align: "right",
        layout: "portrait",
      },
    ],
  },
  {
    slug: "ginebra",
    index: "04",
    title: "GINEBRA",
    subtitle: "THE JEWELRY DISPENSER",
    year: "2025",
    type: "CGI + AI CAMPAIGN",
    disciplineText: "Creative Direction / CGI / AI Visuals / Motion",
    status: "CLIENT PROJECT",
    description:
      "Premium launch visuals for a jewelry dispensing machine, combining CGI craft, AI image direction, and product-world storytelling.",
    coverImage: "/projects/ginebra-carousel-cover.png",
    accentColor: "#9a8d7a",
    systemContent: {
      concept: "A premium object-world built around automated jewelry, machine ritual, and refined product desire.",
      world: "CGI surfaces, AI-directed atmospheres, and campaign motion create a launch language for the dispenser.",
      output: "Hero visuals, motion fragments, product-world stills, and a cinematic image system.",
    },
    statement:
      "Ginebra frames a machine as an object of desire, using synthetic image craft to turn functionality into a premium launch world.",
    contentMode: "campaign",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Premium CGI and AI launch visuals for a jewelry dispensing machine.",
    longDescription:
      "Premium launch visuals for a jewelry dispensing machine, combining CGI craft, AI image direction, and product-world storytelling.",
    disciplines: ["IMAGE", "MOTION"],
    roles: ["CREATIVE DIRECTION", "CGI / AI", "POST / FINISH"],
    projectType: "CGI + AI campaign",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Campaign visuals", "CGI frames", "AI look development", "Motion fragments"],
    toolsMethods: ["CGI", "AI visual development", "Creative direction", "Finishing"],
    heroMedia: {
      type: "video",
      src: "/projects/videos/ginebra-vending.mp4",
      poster: "/projects/videos/ginebra-vending-poster.jpg",
      alt: "Ginebra jewelry dispenser launch film",
    },
    mediaBlocks: [
      {
        type: "video",
        label: "Transport Film",
        src: "/projects/videos/ginebra-transport.mp4",
        poster: "/projects/videos/ginebra-transport-poster.jpg",
        alt: "Ginebra transport campaign film",
        caption: "Motion extension for the Ginebra campaign system.",
        layout: "portrait",
      },
      {
        type: "video",
        label: "Glass Motion Study",
        src: "/projects/videos/ginebra-gl.mp4",
        poster: "/projects/videos/ginebra-gl-poster.jpg",
        alt: "Ginebra jewelry glass motion film",
        caption: "Additional motion study for the Ginebra campaign system.",
        layout: "portrait",
      },
    ],
  },
  {
    slug: "lacoste-roland-garros",
    index: "05",
    title: "LACOSTE × ROLAND-GARROS",
    subtitle: "LACOSTE × ROLAND-GARROS",
    year: "2025",
    type: "SPECULATIVE RETAIL EXPERIENCE",
    disciplineText: "Creative Direction / Spatial Design / AI Visual Development / Retail",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    description:
      "A speculative retail pop-up exploring the intersection of French sport heritage, contemporary fashion, and immersive brand space.",
    coverImage: "/projects/lacoste-cover.jpg",
    accentColor: "#2e6b4d",
    systemContent: {
      concept: "A heritage tennis world reimagined as a contemporary retail encounter.",
      world: "Spatial concepts, AI-developed campaign fragments, and editorial retail moments connect sport and fashion codes.",
      output: "Pop-up direction, image studies, experience beats, and speculative brand-world documentation.",
    },
    statement:
      "All Seeing Tennis Club imagines a retail environment where sport heritage becomes spatial image-making and cultural ritual.",
    contentMode: "campaign",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Speculative retail pop-up for French sport heritage and fashion space.",
    longDescription:
      "A speculative retail pop-up exploring French sport heritage, contemporary fashion, AI visual development, and immersive brand space.",
    disciplines: ["SPACE", "IMAGE"],
    roles: ["CREATIVE DIRECTION", "CGI / AI", "EXPERIENTIAL"],
    projectType: "Speculative retail experience",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Retail concept", "AI visual development", "Spatial direction", "Campaign world"],
    toolsMethods: ["Creative direction", "Spatial design", "AI image development", "Retail strategy"],
    heroMedia: {
      type: "image",
      src: "/projects/lacoste-work.jpg",
      alt: "Lacoste Roland-Garros speculative retail experience interior cover",
    },
    mediaBlocks: [
      {
        type: "gallery",
        label: "Retail World Image Sequence",
        caption: "AI visual development and speculative spatial campaign stills for the Lacoste x Roland-Garros retail world.",
        items: [
          {
            src: "/projects/lacoste-conversation-pit.jpg",
            alt: "Lacoste Roland-Garros conversation pit retail interior",
            caption: "Conversation pit",
            layout: "portrait",
          },
          {
            src: "/projects/lacoste-coffee-stop.jpg",
            alt: "Lacoste Roland-Garros coffee stop detail",
            caption: "Coffee stop",
            layout: "portrait",
          },
          {
            src: "/projects/lacoste-merch-shop.jpg",
            alt: "Lacoste Roland-Garros merch shop retail area",
            caption: "Merch shop",
            layout: "wide",
          },
          {
            src: "/projects/lacoste-storefront-gallery.jpg",
            alt: "Lacoste Roland-Garros storefront",
            caption: "Storefront",
            layout: "portrait",
          },
          {
            src: "/projects/lacoste-soundroom.jpg",
            alt: "Lacoste Roland-Garros soundroom",
            caption: "Soundroom",
            layout: "square",
          },
        ],
      },
    ],
  },
  {
    slug: "stussy-moncler",
    index: "06",
    title: "STUSSY × MONCLER",
    subtitle: "INSIDE THE WAVE SS2027",
    year: "2026",
    type: "CGI + AI CAMPAIGN",
    disciplineText: "Creative Direction / CGI / AI Visuals / Motion + 3D",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    description:
      "A speculative campaign world for Stussy × Moncler, built around the collision of alpine performance, streetwear codes, and cinematic winter atmosphere.",
    coverImage: "/projects/stussy-moncler-work.webp",
    coverAvailable: true,
    accentColor: "#7e8d93",
    systemContent: {
      concept: "A winter campaign language where alpine performance collides with streetwear attitude.",
      world: "AI image direction, CGI surfaces, wave forms, and motion studies shape a speculative collaboration environment.",
      output: "Campaign stills, moving-image assets, 3D product-world fragments, and an editorial launch sequence.",
    },
    statement:
      "Inside the Wave SS2027 imagines Stussy × Moncler as a cinematic system of cold-weather performance, surf tension, and synthetic campaign imagery.",
    contentMode: "campaign",
    client: "STUSSY × MONCLER",
    featured: true,
    shortDescription:
      "Speculative AI, CGI, motion, and 3D campaign world for Stussy × Moncler.",
    longDescription:
      "A speculative campaign world for Stussy × Moncler, built around alpine performance, streetwear codes, AI image direction, CGI, motion, and 3D visual development.",
    disciplines: ["IMAGE", "MOTION"],
    roles: ["CREATIVE DIRECTION", "CGI / AI", "POST / FINISH"],
    projectType: "CGI + AI campaign",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Campaign film", "AI visual direction", "CGI stills", "Motion fragments"],
    toolsMethods: ["AI image development", "CGI", "3D motion", "Creative direction", "Finishing"],
    heroMedia: {
      type: "image",
      src: "/projects/stussy-moncler-work.webp",
      alt: "Stussy Moncler Inside the Wave project cover",
    },
    scrollSequence: [
      {
        type: "image",
        src: "/projects/stussy-moncler-wave-01.webp",
        alt: "Stussy Moncler Inside the Wave campaign image",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/stussy-moncler-wave-film.mp4",
        webmSrc: "/projects/videos/stussy-moncler-wave-film.webm",
        poster: "/projects/videos/stussy-moncler-wave-film-poster.jpg",
        alt: "Stussy Moncler Inside the Wave campaign film",
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/stussy-moncler-wave-02.webp",
        alt: "Stussy Moncler campaign still",
        layout: "wide",
      },
      {
        type: "image",
        src: "/projects/stussy-moncler-surfboard.webp",
        alt: "Stussy Moncler surfboard object study",
        layout: "wide",
      },
      {
        type: "image",
        src: "/projects/stussy-moncler-wave-03.webp",
        alt: "Stussy Moncler campaign environment still",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/stussy-moncler-vertical-01.mp4",
        webmSrc: "/projects/videos/stussy-moncler-vertical-01.webm",
        poster: "/projects/videos/stussy-moncler-vertical-01-poster.jpg",
        alt: "Stussy Moncler moving image study",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/stussy-moncler-vertical-02.mp4",
        webmSrc: "/projects/videos/stussy-moncler-vertical-02.webm",
        poster: "/projects/videos/stussy-moncler-vertical-02-poster.jpg",
        alt: "Stussy Moncler second moving image study",
        layout: "wide",
      },
    ],
    mediaBlocks: [],
  },
  {
    slug: "eat-nudes",
    index: "06",
    title: "EAT NUDES",
    subtitle: "DIGITAL APPETITE",
    year: "2025",
    type: "DIGITAL BRAND SYSTEM",
    disciplineText: "Web Design / Motion / Digital Menus / AI Content",
    status: "CLIENT PROJECT",
    description:
      "A digital identity system spanning web design, animated menu experiences, visual content, and a more expressive hospitality interface.",
    coverImage: "/projects/eat-nudes-cover.jpg",
    accentColor: "#b85d40",
    systemContent: {
      concept: "A hospitality interface with a more expressive appetite for motion, image, and menu behavior.",
      world: "Web, animated menus, and AI-assisted content form a digital brand surface with more personality.",
      output: "Website direction, menu interactions, motion assets, and visual content system.",
    },
    statement:
      "Eat Nudes treats the menu as a digital experience, folding content, motion, and interface rhythm into one appetite-driven system.",
    contentMode: "campaign",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Digital identity, web, animated menu, and AI content system.",
    longDescription:
      "A digital identity system spanning web design, animated menu experiences, visual content, and expressive hospitality interfaces.",
    disciplines: ["SYSTEMS", "MOTION", "IMAGE"],
    roles: ["CREATIVE TECHNOLOGY", "CREATIVE DIRECTION", "CGI / AI"],
    projectType: "Digital brand system",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Web design", "Animated menus", "Visual content", "Motion system"],
    toolsMethods: ["Web design", "Motion", "AI content", "Digital menu systems"],
    heroMedia: {
      type: "image",
      src: "/projects/eat-nudes-hero.jpg",
      alt: "Eat Nudes hero campaign image",
    },
    scrollSequence: [
      {
        type: "image",
        src: "/projects/eat-nudes-hero.jpg",
        alt: "Eat Nudes hero campaign image",
        layout: "wide",
      },
      {
        type: "video",
        src: "/projects/videos/eat-nudes-cognitive-cacao.mp4",
        poster: "/projects/videos/eat-nudes-cognitive-cacao-poster.jpg",
        alt: "Eat Nudes Cognitive Cacao vertical motion piece",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/eat-nudes-green-soft-serve.png",
        alt: "Eat Nudes green soft serve campaign still",
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/eat-nudes-smoothie-replacement.png",
        alt: "Eat Nudes smoothie campaign still",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "video",
        src: "/projects/videos/eat-nudes-clawmachine.mp4",
        poster: "/projects/videos/eat-nudes-clawmachine-poster.jpg",
        alt: "Eat Nudes claw machine vertical motion piece",
        layout: "portrait",
      },
      {
        type: "video",
        src: "/projects/videos/eat-nudes-colab.mp4",
        poster: "/projects/videos/eat-nudes-colab-poster.jpg",
        alt: "Eat Nudes collaboration vertical motion piece",
        pairWithNext: true,
        layout: "portrait",
      },
      {
        type: "image",
        src: "/projects/eat-nudes-macro-02.jpg",
        alt: "Eat Nudes macro campaign image",
        layout: "portrait",
      },
      {
        type: "video",
        src: "/projects/videos/eat-nudes-screen-horizontal.mp4",
        poster: "/projects/videos/eat-nudes-screen-horizontal-poster.jpg",
        alt: "Eat Nudes horizontal digital interface recording",
        layout: "wide",
      },
    ],
    mediaBlocks: [],
  },
  {
    slug: "nike-world-cup",
    index: "07",
    title: "NIKE / WORLD CUP",
    subtitle: "THE CITY PLAYS",
    year: "2025",
    type: "SPECULATIVE BRAND WORLD",
    disciplineText: "Creative Direction / Spatial Campaign / AI Visuals / Experience Design",
    status: "INDEPENDENT SPECULATIVE CONCEPT",
    description:
      "A high-energy speculative pop-up and campaign world designed around football culture, collective movement, and urban performance.",
    coverImage: "/projects/nike-cover.jpg",
    accentColor: "#2f4b7c",
    systemContent: {
      concept: "A city-scale football world built around collective movement and urban performance.",
      world: "AI visuals, spatial campaign moments, and activation logic create a speculative World Cup brand environment.",
      output: "Pop-up concept, campaign images, experience direction, and urban activation narrative.",
    },
    statement:
      "The City Plays turns football culture into a spatial campaign language: kinetic, public, and built for collective energy.",
    contentMode: "campaign",
    client: "NODO STUDIO",
    featured: true,
    shortDescription: "Speculative pop-up and campaign world for football culture.",
    longDescription:
      "A high-energy speculative brand world designed around football culture, collective movement, and urban performance.",
    disciplines: ["SPACE", "IMAGE", "MOTION"],
    roles: ["CREATIVE DIRECTION", "CGI / AI", "EXPERIENTIAL"],
    projectType: "Speculative brand world",
    collaborationCredits: ["NODO STUDIO"],
    deliverables: ["Spatial campaign", "AI visuals", "Experience direction", "Brand world"],
    toolsMethods: ["Creative direction", "AI visual development", "Spatial campaign design", "Experience strategy"],
    heroMedia: {
      type: "video",
      src: "/projects/videos/nike-world-cup-hero.mp4",
      poster: "/projects/videos/nike-world-cup-hero-poster.jpg",
      alt: "Nike World Cup live project hero video",
    },
    scrollSequence: [
      {
        type: "video",
        src: "/projects/videos/nike-world-cup-hero.mp4",
        poster: "/projects/videos/nike-world-cup-hero-poster.jpg",
        alt: "Nike World Cup shoe installation hero film",
      },
      {
        src: "/projects/nike-dj-room.jpg",
        alt: "Nike World Cup DJ room activation",
      },
      {
        type: "video",
        src: "/projects/videos/nike-installation-carousel.mp4",
        poster: "/projects/videos/nike-installation-poster.jpg",
        alt: "Nike World Cup live installation loop",
      },
      {
        src: "/projects/nike-circular-lounge.jpg",
        alt: "Nike World Cup circular lounge installation",
      },
      {
        src: "/projects/nike-store-interior.jpg",
        alt: "Nike World Cup modern retail interior",
      },
      {
        src: "/projects/nike-activation-room.jpg",
        alt: "Nike World Cup activation room",
      },
    ],
    mediaBlocks: [],
  },
  {
    slug: "twojeys",
    index: "08",
    title: "TWOJEYS",
    subtitle: "AI VISUAL CAMPAIGN",
    year: "2025",
    type: "AI VISUAL CAMPAIGN",
    disciplineText: "AI Visuals / Creative Direction / Campaign Imagery / Post-Production",
    status: "CLIENT PROJECT",
    description:
      "An AI-led visual campaign system for TWOJEYS, built around synthetic image direction, campaign mood, and polished visual storytelling.",
    coverImage: "/projects/twojeys-work.jpg",
    accentColor: "#7f8a92",
    systemContent: {
      concept: "A focused visual campaign language built through AI image direction and brand-world references.",
      world: "Synthetic image studies, art direction, and finishing define the mood, materiality, and campaign atmosphere.",
      output: "Campaign stills, visual direction, post-production passes, and image-system documentation.",
    },
    statement:
      "TWOJEYS uses AI image production as a direction tool, shaping a campaign world through visual references, iteration, and finishing.",
    contentMode: "campaign",
    client: "TWOJEYS",
    featured: true,
    shortDescription: "AI-led visual campaign direction and synthetic campaign imagery.",
    longDescription:
      "An AI visual campaign project built around synthetic image direction, campaign mood, visual development, and finishing.",
    disciplines: ["IMAGE", "MOTION"],
    roles: ["CREATIVE DIRECTION", "CGI / AI", "POST / FINISH"],
    projectType: "AI visual campaign",
    collaborationCredits: ["[ADD CREDITS HERE]"],
    deliverables: ["AI visual direction", "Campaign stills", "Look development", "Post-production"],
    toolsMethods: ["AI image production", "Creative direction", "Visual development", "Finishing"],
    heroMedia: {
      type: "video",
      src: "/projects/videos/twojeys-dawgs.mp4",
      poster: "/projects/videos/twojeys-dawgs-poster.jpg",
      alt: "TWOJEYS AI visual campaign hero film",
    },
    mediaBlocks: [
      {
        type: "gallery",
        label: "AI Visual Campaign Stills",
        caption:
          "Selected campaign imagery for a TWOJEYS visual world built through AI direction, post-production, and cinematic brand mood.",
        items: [
          {
            src: "/projects/twojeys-campaign-01-replacement.png",
            alt: "TWOJEYS AI visual campaign portrait still",
            caption: "Campaign portrait",
            layout: "portrait",
          },
          {
            src: "/projects/twojeys-campaign-03.jpg",
            alt: "TWOJEYS campaign behind-the-scenes image",
            caption: "Campaign texture",
            layout: "wide",
          },
          {
            src: "/projects/twojeys-campaign-04.jpg",
            alt: "TWOJEYS AI campaign image study",
            caption: "Image study",
            layout: "wide",
          },
          {
            src: "/projects/twojeys-campaign-05.jpg",
            alt: "TWOJEYS AI visual campaign material study",
            caption: "Material study",
            layout: "wide",
          },
          {
            src: "/projects/twojeys-campaign-06.jpg",
            alt: "TWOJEYS AI visual campaign wide still",
            caption: "Final still",
            layout: "wide",
          },
        ],
      },
    ],
  },
];

export const projects: Project[] = [...projectRecords]
  .sort((a, b) => PROJECT_DISPLAY_ORDER.indexOf(a.slug) - PROJECT_DISPLAY_ORDER.indexOf(b.slug))
  .map((project, index) => ({
    ...project,
    ...PROJECT_CONTENT[project.slug],
    index: String(index + 1).padStart(2, "0"),
  }));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function getPreviousProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index - 1 + projects.length) % projects.length];
}
