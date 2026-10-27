import * as THREE from "three";
import { applyAnisotropy, coverTexture, projectedRect, type TextureMap } from "./textures";

export type SphereTile = { src: string; slug: string; title: string; year: string };

type SphereEvents = {
  onHover(tile: SphereTile | null, x: number, y: number): void;
  onOpen(tile: SphereTile, rect: DOMRect): void;
};

const RADIUS = 2;
const RINGS = 8;
const MAX_TILES = 15;
const GAP = 0.014;

type TileData = { tile: SphereTile; normal: THREE.Vector3; lift: number; tone: number };
type TileMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> & { userData: TileData };

/** Hero photo sphere: one curved tile per photograph, drag to spin, hover lifts, click opens. */
export function createSphere(
  canvas: HTMLCanvasElement,
  tiles: SphereTile[],
  textures: TextureMap,
  events: SphereEvents,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  applyAnisotropy(textures, renderer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  const group = new THREE.Group();
  scene.add(group);

  const meshes: TileMesh[] = [];
  const thetaStart = Math.PI * 0.13;
  const band = (Math.PI * 0.87 - thetaStart) / RINGS;
  let count = 0;
  for (let ring = 0; ring < RINGS; ring++) {
    const theta = thetaStart + ring * band;
    const mid = theta + band / 2;
    const perRing = Math.max(5, Math.round(MAX_TILES * Math.sin(mid)));
    const step = (Math.PI * 2) / perRing;
    const shift = (ring % 2) * step * 0.5;
    for (let k = 0; k < perRing; k++) {
      const tile = tiles[(count * 5 + ring) % tiles.length];
      count++;
      const tex = textures.get(tile.src);
      if (!tex) continue;
      const phi = k * step + shift;
      const geometry = new THREE.SphereGeometry(
        RADIUS,
        8,
        6,
        phi + GAP,
        step - GAP * 2,
        theta + GAP,
        band - GAP * 2,
      );
      const aspect = ((step - GAP * 2) * Math.sin(mid)) / (band - GAP * 2);
      const material = new THREE.MeshBasicMaterial({
        map: coverTexture(tex, aspect),
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material) as TileMesh;
      const center = phi + step / 2;
      mesh.userData = {
        tile,
        normal: new THREE.Vector3(
          -Math.cos(center) * Math.sin(mid),
          Math.cos(mid),
          Math.sin(center) * Math.sin(mid),
        ),
        lift: 0,
        tone: 1,
      };
      geometry.computeBoundingBox();
      meshes.push(mesh);
      group.add(mesh);
    }
  }

  let width = 1;
  let height = 1;
  let distance = 10;
  let rotY = 0;
  let rotX = 0.18;
  let spinVel = 0;
  let tiltVel = 0;
  let intro = 0;
  let progress = 0;
  let hovered: TileMesh | null = null;
  let running = false;
  let raf = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const t = Math.tan((camera.fov * Math.PI) / 360);
    const fitH = RADIUS / (t * 0.74);
    const fitW = RADIUS / (t * camera.aspect * 0.86);
    distance = Math.max(fitH, fitW);
  };
  resize();
  window.addEventListener("resize", resize);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let drag: { x: number; y: number; t: number } | null = null;
  let last = { x: 0, y: 0 };
  let travelled = 0;

  const pick = (x: number, y: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return (raycaster.intersectObjects(meshes, false)[0]?.object as TileMesh | undefined) ?? null;
  };

  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    last = { x: e.clientX, y: e.clientY };
    travelled = 0;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (drag) {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      travelled += Math.abs(dx) + Math.abs(dy);
      spinVel = dx * 0.0042;
      tiltVel = dy * 0.0028;
      last = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    } else if (e.pointerType === "mouse" && progress < 0.1) {
      const hit = pick(e.clientX, e.clientY);
      if (hit !== hovered) {
        hovered = hit;
        canvas.style.cursor = hit ? "pointer" : "grab";
      }
      events.onHover(hit?.userData.tile ?? null, e.clientX, e.clientY);
    }
  };
  const onUp = (e: PointerEvent) => {
    if (drag && travelled < 6 && performance.now() - drag.t < 500) {
      const hit = pick(e.clientX, e.clientY);
      if (hit) events.onOpen(hit.userData.tile, tileRect(hit));
    }
    drag = null;
    canvas.style.cursor = hovered ? "pointer" : "grab";
  };
  const onCancel = () => (drag = null);
  const onLeave = () => {
    hovered = null;
    events.onHover(null, 0, 0);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.style.cursor = "grab";

  const box = new THREE.Box3();
  function tileRect(mesh: TileMesh) {
    box.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);
    const corners = Array.from(
      { length: 8 },
      (_, i) =>
        new THREE.Vector3(
          i & 1 ? box.max.x : box.min.x,
          i & 2 ? box.max.y : box.min.y,
          i & 4 ? box.max.z : box.min.z,
        ),
    );
    return projectedRect(canvas, camera, corners);
  }

  const white = new THREE.Color(1, 1, 1);
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const tick = () => {
    raf = requestAnimationFrame(tick);
    rotY += (hovered ? 4e-4 : 0.0018) + spinVel;
    rotX = Math.max(-0.6, Math.min(0.6, rotX + tiltVel));
    if (!drag) {
      spinVel *= 0.94;
      tiltVel *= 0.9;
      rotX += (0.18 - rotX) * 0.02;
    }
    const zoom = smooth(progress);
    group.rotation.set(rotX + zoom * 0.6, rotY + zoom * 2.4, 0);
    group.scale.setScalar(0.55 + 0.45 * smooth(intro));
    camera.position.set(0, 0, distance * (1 - zoom * 0.95));
    camera.lookAt(0, 0, 0);
    for (const mesh of meshes) {
      const d = mesh.userData;
      const isHovered = mesh === hovered;
      d.lift += ((isHovered ? 0.16 : 0) - d.lift) * 0.14;
      d.tone += ((hovered && !isHovered ? 0.55 : 1) - d.tone) * 0.1;
      mesh.position.copy(d.normal).multiplyScalar(d.lift);
      mesh.material.color.copy(white).multiplyScalar(d.tone);
      mesh.material.opacity = intro * (1 - Math.max(0, (progress - 0.72) / 0.28));
    }
    renderer.render(scene, camera);
  };

  return {
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
    setIntro(v: number) {
      intro = v;
    },
    setProgress(v: number) {
      progress = v;
      if (v > 0.1 && hovered) {
        hovered = null;
        events.onHover(null, 0, 0);
      }
    },
    spin(v: number) {
      spinVel = v;
    },
    destroy() {
      this.stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave);
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.map?.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    },
  };
}

export type Sphere = ReturnType<typeof createSphere>;
