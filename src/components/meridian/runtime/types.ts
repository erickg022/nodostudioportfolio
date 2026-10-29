/** Optimized texture URLs: `lg` for desktop, `sm` for viewports up to 760px. */
export type TextureSet = { lg: string; sm: string };

export type RuntimeProject = {
  slug: string;
  title: string;
  year: string;
  client: string;
  cover: TextureSet;
  /** Cover used on the work carousel (the project cover unless overridden in site.json). */
  carouselCover: TextureSet;
};

/** One portfolio view as the runtime needs it: slugs in order and its `?view=` value. */
export type RuntimeView = { id: string; param: string; slugs: string[] };

/** Shape of the JSON in <script id="mr-data">. */
export type RuntimeSphereTile = { slug: string; title?: string; textures: TextureSet };

export type RuntimeData = {
  projects: RuntimeProject[];
  sphere: RuntimeSphereTile[];
  views: RuntimeView[];
  defaultView: string;
};

/** Where a project was opened from, for the ghost image transition. */
export type OpenOrigin = { rect: DOMRect; src: string };
