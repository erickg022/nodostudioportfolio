/** Optimized texture URLs: `lg` for desktop, `sm` for viewports up to 760px. */
export type TextureSet = { lg: string; sm: string };

export type RuntimeProject = {
  slug: string;
  title: string;
  year: string;
  client: string;
  cover: TextureSet;
  images: TextureSet[];
};

/** Shape of the JSON in <script id="mr-data">. */
export type RuntimeSphereTile = { slug: string; title?: string; textures: TextureSet };

export type RuntimeData = { projects: RuntimeProject[]; sphere: RuntimeSphereTile[] };

/** Where a project was opened from, for the ghost image transition. */
export type OpenOrigin = { rect: DOMRect; src: string };
