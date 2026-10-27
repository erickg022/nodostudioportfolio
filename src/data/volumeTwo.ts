import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";

const mahou: Project = {
  slug: "mahou-dilo-como-madrid",
  index: "01",
  title: "MAHOU — DILO COMO MADRID",
  subtitle: "INTERACTIVE AR EXPERIENCE",
  client: "MAHOU",
  year: "2026",
  type: "INTERACTIVE AR EXPERIENCE",
  status: "PROJECT",
  disciplineText:
    "Creative Direction / Art Direction / Creative Technology / AR / Voice Recognition / Development / Motion",
  hoverCategory: "Interactive AR Experience",
  description:
    "Dilo como Madrid is a voice-activated AR experience that turns the correct pronunciation of Mahou into an interaction across iconic brand murals in Madrid.\n\nUsers scan a QR code, point their camera at the mural and pronounce “Mahou.” When the system recognizes the correct pronunciation, the mural comes alive through AR animation and unlocks an invitation to claim a free Mahou at a nearby bar.\n\nI developed the project end-to-end, from concept and creative direction to visual design, animation, voice recognition, AR and development.",
  shortDescription:
    "A voice-activated AR experience turning Mahou’s pronunciation into a playful introduction to Madrid.",
  longDescription:
    "An interactive AR experience connecting Mahou’s name with Madrid’s iconic brand murals.",
  statement: "Dilo como Madrid.",
  coverImage: "/projects/mahou/cover.webp",
  coverAvailable: true,
  accentColor: "#bd1825",
  systemContent: {
    concept: "Turn the pronunciation of Mahou into a playful city interaction.",
    world: "Madrid murals that respond to voice and come alive through AR.",
    output: "A voice-activated AR experience and an invitation to claim a nearby Mahou.",
  },
  contentMode: "campaign",
  featured: false,
  disciplines: ["IMAGE", "MOTION", "SPACE", "SYSTEMS"],
  roles: ["CREATIVE DIRECTION", "CREATIVE TECHNOLOGY", "EXPERIENTIAL"],
  projectType: "Interactive AR experience",
  collaborationCredits: [],
  deliverables: ["Creative concept", "AR experience", "Voice recognition", "Animation", "Visual design"],
  toolsMethods: ["Creative direction", "Art direction", "AR", "Voice recognition", "Development", "Motion"],
  heroMedia: {
    type: "image",
    src: "/projects/mahou/cover.webp",
    alt: "Mahou voice recognition experience on a Madrid street",
  },
  scrollSequence: [
    {
      type: "video",
      src: "/projects/mahou/film-720p.mp4",
      poster: "/projects/mahou/cover.webp",
      alt: "Dilo como Madrid interactive AR experience film",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/mahou/still-01.webp",
      alt: "Mahou voice interaction in Madrid",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/mahou/still-02.webp",
      alt: "Mahou pronunciation prompt viewed on a Madrid street",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/mahou/still-03.webp",
      alt: "Mahou mural at Plaza del Carmen",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/mahou/still-04.webp",
      alt: "Mahou bottle in front of a Madrid mural",
      layout: "portrait",
      pairWithNext: true,
    },
    {
      type: "image",
      src: "/projects/mahou/still-05.webp",
      alt: "Mahou mural animated with a figure holding a beer",
      layout: "portrait",
    },
  ],
  mediaBlocks: [],
};

const beefeaterLight: Project = {
  slug: "beefeater-light",
  index: "01",
  title: "BEEFEATER LIGHT",
  subtitle: "HALF THE ALCOHOL. FULL LONDON SPIRIT.",
  client: "BEEFEATER LIGHT",
  year: "2026",
  type: "CAMPAIGN CONCEPT + FILM",
  status: "SPEC CAMPAIGN / CONCEPT",
  disciplineText:
    "Creative Direction / Campaign Concept / Art Direction / Film / Motion Design / AI-Assisted Production / Visual Identity",
  hoverCategory: "Campaign Concept + Film",
  description:
    "Beefeater has always been deeply connected to London — its streets, architecture, culture and attitude. With Beefeater Light offering 50% less alcohol, the challenge was to communicate reduction without making the product feel like a reduced version of the brand.\n\nThe campaign turns “half” into the central creative device. London’s most recognizable icons are divided, cropped and reconstructed in halves while remaining instantly identifiable, creating a visual parallel with the product itself.\n\nThe idea became a cinematic and graphic campaign system built around a simple message: Half the alcohol. Full London spirit.",
  shortDescription:
    "A campaign concept for Beefeater Light turning its 50% lower alcohol proposition into a visual language rooted in London.",
  longDescription:
    "A cinematic and graphic campaign system that turns Beefeater Light’s 50% lower alcohol proposition into a visual language rooted in London.",
  statement: "Half the alcohol. Full London spirit.",
  coverImage: "/projects/beefeater-light/cover.webp",
  coverAvailable: true,
  accentColor: "#b81027",
  systemContent: {
    concept: "Turn half into the central visual device for Beefeater Light.",
    world: "Split and reconstruct recognizable London icons while retaining their identity.",
    output: "A cinematic film and a graphic campaign image system.",
  },
  contentMode: "campaign",
  featured: false,
  disciplines: ["IMAGE", "MOTION"],
  roles: ["CREATIVE DIRECTION", "CGI / AI", "POST / FINISH"],
  projectType: "Campaign concept + film",
  collaborationCredits: [],
  deliverables: ["Campaign concept", "Film", "Campaign stills", "Visual identity"],
  toolsMethods: ["Creative direction", "Art direction", "Motion design", "AI-assisted production"],
  heroMedia: {
    type: "video",
    src: "/projects/beefeater-light/film-1080p.mp4",
    poster: "/projects/beefeater-light/film-poster.webp",
    alt: "Beefeater Light campaign film",
  },
  scrollSequence: [
    {
      type: "video",
      src: "/projects/beefeater-light/film-1080p.mp4",
      srcHigh: "/projects/beefeater-light/film-4k.mp4",
      poster: "/projects/beefeater-light/film-poster.webp",
      alt: "Beefeater Light campaign film — Half the alcohol. Full London spirit.",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/beefeater-light/still-01.webp",
      alt: "Close-up of a Beefeater Light bottle in a dark cinematic setting",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/beefeater-light/still-02.webp",
      alt: "Red London bus crossing a city intersection at dusk",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/beefeater-light/still-03.webp",
      alt: "Beefeater Light bottle beside a London Underground entrance at night",
      layout: "wide",
    },
  ],
  mediaBlocks: [],
};

const airbnb: Project = {
  slug: "airbnb",
  index: "05",
  title: "AIRBNB",
  subtitle: "CAMPAIGN CONCEPT + FILM",
  client: "AIRBNB",
  year: "2026",
  type: "CAMPAIGN CONCEPT + FILM",
  status: "SPEC CAMPAIGN / CONCEPT",
  disciplineText: "Creative Direction / Campaign Concept / Art Direction / AI Film / Storytelling",
  hoverCategory: "AI Film + Storytelling",
  description:
    "Opening your home to strangers can make it easy to imagine the worst.\n\nFor Airbnb, we turned that fear into the starting point of the campaign. An elderly couple receives a booking from a family with three children and immediately imagines chaos: mess, destruction and everything that could go wrong inside their home.\n\nThe campaign is built around the gap between what homeowners imagine could happen and what actually happens when they open their door.",
  shortDescription:
    "A campaign concept for Airbnb built around the gap between what homeowners imagine and what actually happens when they open their door.",
  longDescription:
    "A campaign concept for Airbnb built around the gap between imagined disaster and the reality of opening your home.",
  statement: "What we imagine before opening the door.",
  coverImage: "/projects/airbnb/film-final-poster.webp",
  coverAvailable: true,
  accentColor: "#ed687b",
  systemContent: {
    concept: "Use the fear of opening a home to strangers as the campaign's starting point.",
    world: "An elderly couple imagines chaos after receiving a booking from a family with three children.",
    output: "An AI-assisted campaign film and a sequence of campaign stills.",
  },
  contentMode: "campaign",
  featured: false,
  disciplines: ["IMAGE", "MOTION"],
  roles: ["CREATIVE DIRECTION", "CGI / AI", "POST / FINISH"],
  projectType: "Campaign concept + film",
  collaborationCredits: [],
  deliverables: ["Campaign concept", "Film", "Campaign stills"],
  toolsMethods: ["Creative direction", "Art direction", "AI film", "Storytelling"],
  heroMedia: {
    type: "video",
    src: "/projects/airbnb/cover-final-720p.mp4",
    poster: "/projects/airbnb/film-final-poster.webp",
    alt: "Airbnb campaign film preview",
  },
  scrollSequence: [
    {
      type: "video",
      src: "/projects/airbnb/film-final-1080p.mp4",
      poster: "/projects/airbnb/film-final-poster.webp",
      alt: "Airbnb campaign film about the fears of opening a home to guests",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/airbnb/still-01.webp",
      alt: "An elderly couple sees a family arriving at their door",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/airbnb/still-02.webp",
      alt: "Three children run through an ornate hallway in the imagined scenario",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/airbnb/still-03.webp",
      alt: "Cleaning supplies prepared in the couple's home",
      layout: "wide",
    },
    {
      type: "image",
      src: "/projects/airbnb/still-04.webp",
      alt: "Three children sit on a sofa in the Airbnb campaign film",
      layout: "wide",
    },
  ],
  mediaBlocks: [],
};

const excluded = new Set(["axe-ceremonia-ar-portal", "play-in-motion", "gdl-movilidad"]);

export const volumeTwoProjects: Project[] = [
  mahou,
  beefeaterLight,
  ...projects
    .filter((project) => !excluded.has(project.slug))
    .flatMap((project) => project.slug === "stussy-moncler" ? [project, airbnb] : [project]),
]
  .map((project, index) => ({ ...project, index: String(index + 1).padStart(2, "0") }));

export function getVolumeTwoProject(slug: string) {
  return volumeTwoProjects.find((project) => project.slug === slug);
}

export function getVolumeTwoAdjacent(slug: string) {
  const index = volumeTwoProjects.findIndex((project) => project.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: volumeTwoProjects[(index - 1 + volumeTwoProjects.length) % volumeTwoProjects.length],
    next: volumeTwoProjects[(index + 1) % volumeTwoProjects.length],
  };
}
