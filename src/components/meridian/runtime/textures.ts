import * as THREE from "three";

export type TextureMap = Map<string, THREE.Texture>;

/** Loads every unique URL as a texture, reporting 0..1 progress. Failed images are skipped. */
export function loadTextures(urls: string[], onProgress: (p: number) => void): Promise<TextureMap> {
  const unique = [...new Set(urls)];
  const map: TextureMap = new Map();
  let done = 0;
  return Promise.all(
    unique.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            const tex = new THREE.Texture(img);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.needsUpdate = true;
            map.set(url, tex);
            onProgress(++done / unique.length);
            resolve();
          };
          img.onerror = () => {
            onProgress(++done / unique.length);
            resolve();
          };
          img.src = url;
        }),
    ),
  ).then(() => map);
}

export function applyAnisotropy(textures: TextureMap, renderer: THREE.WebGLRenderer) {
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  textures.forEach((tex) => (tex.anisotropy = aniso));
}

/** Clone of `tex` cropped like object-fit: cover for a surface of the given aspect. */
export function coverTexture(tex: THREE.Texture, aspect: number, mirror = false) {
  const t = tex.clone();
  const img = tex.image as HTMLImageElement;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  let rx = 1;
  let ry = 1;
  if (imgAspect > aspect) rx = aspect / imgAspect;
  else ry = imgAspect / aspect;
  const ox = (1 - rx) / 2;
  const oy = (1 - ry) / 2;
  if (mirror) {
    t.repeat.set(-rx, ry);
    t.offset.set(ox + rx, oy);
  } else {
    t.repeat.set(rx, ry);
    t.offset.set(ox, oy);
  }
  return t;
}

/** Screen-space bounding rect of projected points. */
export function projectedRect(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  points: Iterable<THREE.Vector3>,
  skipBehind = false,
) {
  const box = canvas.getBoundingClientRect();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    p.project(camera);
    if (skipBehind && p.z > 1) continue;
    const x = box.left + ((p.x + 1) / 2) * box.width;
    const y = box.top + ((1 - p.y) / 2) * box.height;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return new DOMRect(minX, minY, maxX - minX, maxY - minY);
}
