import * as THREE from "three";
import { applyAnisotropy, coverTexture, projectedRect, type TextureMap } from "./textures";

export type GallerySlide = { src: string; slug: string };

type GalleryEvents = {
  onOpen(slide: GallerySlide, rect: DOMRect): void;
  onHover(on: boolean): void;
};

const RADIUS = 6;
const STEP = 0.82;
const ARC = 0.66;
const HEIGHT = 2.7;

type SlideMesh = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial> & {
  userData: { slide: GallerySlide; index: number };
};

/**
 * Work gallery: covers on the inside of a cylinder, turned by scroll; speed adds tilt and stretch.
 * `setSlides` swaps the collection in place (portfolio views) and returns to the first slide.
 */
export function createGallery(
  canvas: HTMLCanvasElement,
  slides: GallerySlide[],
  textures: TextureMap,
  events: GalleryEvents,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  applyAnisotropy(textures, renderer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50);
  const group = new THREE.Group();
  scene.add(group);

  let meshes: SlideMesh[] = [];
  const disposeMeshes = () => {
    meshes.forEach((m) => {
      group.remove(m);
      m.geometry.dispose();
      m.material.map?.dispose();
      m.material.dispose();
    });
    meshes = [];
  };
  const buildMeshes = (list: GallerySlide[]) => {
    disposeMeshes();
    meshes = list.flatMap((slide, index) => {
      const tex = textures.get(slide.src);
      if (!tex) return [];
      const geometry = new THREE.CylinderGeometry(
        RADIUS,
        RADIUS,
        HEIGHT,
        32,
        1,
        true,
        Math.PI - ARC / 2,
        ARC,
      );
      const aspect = (ARC * RADIUS) / HEIGHT;
      const material = new THREE.MeshBasicMaterial({
        map: coverTexture(tex, aspect, true),
        side: THREE.BackSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material) as SlideMesh;
      mesh.userData = { slide, index };
      group.add(mesh);
      return [mesh];
    });
  };
  buildMeshes(slides);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.fov = camera.aspect < 1 ? 62 : 46;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  let target = 0;
  let current = 0;
  let velocity = 0;
  let raw = 0;
  let settle: ReturnType<typeof setTimeout> | undefined;
  let hovered: SlideMesh | null = null;
  let raf = 0;
  let running = false;
  const listeners: ((index: number) => void)[] = [];
  let lastIndex = -1;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (x: number, y: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return (raycaster.intersectObjects(meshes, false)[0]?.object as SlideMesh | undefined) ?? null;
  };
  const onMove = (e: PointerEvent) => {
    const hit = pick(e.clientX, e.clientY);
    if (hit !== hovered) {
      hovered = hit;
      canvas.style.cursor = hit ? "pointer" : "";
      events.onHover(!!hit);
    }
  };
  const onClick = (e: MouseEvent) => {
    const hit = pick(e.clientX, e.clientY);
    if (hit) events.onOpen(hit.userData.slide, slideRect(hit));
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("click", onClick);

  function slideRect(mesh: SlideMesh) {
    const pos = mesh.geometry.attributes.position;
    const points = Array.from({ length: pos.count }, (_, i) =>
      new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld),
    );
    return projectedRect(canvas, camera, points, true);
  }

  const white = new THREE.Color(1, 1, 1);
  const tick = () => {
    raf = requestAnimationFrame(tick);
    frame();
  };
  const frame = () => {
    const prev = current;
    current += (target - current) * 0.08;
    velocity += ((current - prev) * 60 - velocity) * 0.15;
    meshes.forEach((mesh) => {
      const offset = mesh.userData.index - current;
      mesh.rotation.y = -offset * STEP;
      const dist = Math.abs(offset);
      // On the white page, slides away from the centre fade out instead of darkening.
      mesh.material.color.copy(white).multiplyScalar(mesh === hovered ? 1 : 0.97);
      const focus = 0.3 + 0.7 * Math.max(0, 1 - dist * 0.5);
      mesh.material.opacity = Math.max(0, 1 - Math.max(0, dist - 2.2)) * focus;
      mesh.scale.y = 1 + Math.min(0.12, Math.abs(velocity) * 0.04);
    });
    group.rotation.z = Math.max(-0.05, Math.min(0.05, velocity * 0.02));
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);
    const index = Math.round(Math.max(0, Math.min(meshes.length - 1, current)));
    if (index !== lastIndex) {
      lastIndex = index;
      listeners.forEach((fn) => fn(index));
    }
    renderer.render(scene, camera);
  };

  return {
    /** Replaces the slides (textures must already be in the map) and jumps to the first one. */
    setSlides(next: GallerySlide[], map: TextureMap = textures) {
      textures = map;
      applyAnisotropy(textures, renderer);
      buildMeshes(next);
      hovered = null;
      canvas.style.cursor = "";
      events.onHover(false);
      raw = target = current = velocity = 0;
      lastIndex = -1;
      // Paused (section off screen): draw once so the old slides never linger on the canvas.
      if (!running) frame();
    },
    get count() {
      return meshes.length;
    },
    setProgress(p: number) {
      raw = p * (meshes.length - 1);
      target = raw;
      clearTimeout(settle);
      settle = setTimeout(() => (target = Math.round(raw)), 180);
    },
    onIndex(fn: (index: number) => void) {
      listeners.push(fn);
    },
    start() {
      if (!running) {
        running = true;
        tick();
      }
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    destroy() {
      this.stop();
      clearTimeout(settle);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      disposeMeshes();
      renderer.dispose();
    },
  };
}

export type Gallery = ReturnType<typeof createGallery>;
