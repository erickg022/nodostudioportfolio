import * as THREE from "three";
import { applyAnisotropy, coverTexture, projectedRect, type TextureMap } from "./textures";

export type SphereTile = { src: string; slug: string; title: string; year: string };

type SphereEvents = {
  onHover(tile: SphereTile | null, x: number, y: number): void;
  onOpen(tile: SphereTile, rect: DOMRect): void;
};

const RADIUS = 2;
const RINGS = 8;
const MAX_PER_RING = 15;
const GAP = 0.014;
/** Corner radius as a fraction of the tile's shorter side. */
const CORNER = 0.07;

type TileData = { tile: SphereTile; normal: THREE.Vector3; lift: number; tone: number };
type TileMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> & { userData: TileData };

const thetaStart = Math.PI * 0.13;
const band = (Math.PI * 0.87 - thetaStart) / RINGS;

/** Tiles per ring for a given density (equator width), never fewer than five. */
function ringCounts(density: number) {
  return Array.from({ length: RINGS }, (_, ring) =>
    Math.max(5, Math.round(density * Math.sin(thetaStart + ring * band + band / 2))),
  );
}

/** Densest layout that still gives every slot its own photograph. */
function fitRings(available: number) {
  for (let density = MAX_PER_RING; density > 0; density -= 0.1) {
    const counts = ringCounts(density);
    if (counts.reduce((a, b) => a + b, 0) <= available) return counts;
  }
  return ringCounts(1);
}

/** Alpha mask with rounded corners for a tile of the given aspect (width / height). */
function roundedMask(aspect: number) {
  const h = 128;
  const w = Math.max(16, Math.round(h * aspect));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, Math.min(w, h) * CORNER);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/**
 * Assigns each slot a distinct tile, keeping neighbours (same ring, ring above, ring wrap) from sharing a project
 * and spending the biggest groups first so no single project clumps at the end.
 */
function assignTiles(tiles: SphereTile[], counts: number[]) {
  const total = counts.reduce((a, b) => a + b, 0);
  const pool = [...tiles];
  // Surplus photographs come out of the largest group first (the studio brand shots).
  while (pool.length > total) {
    const sizes = new Map<string, number>();
    pool.forEach((t) => sizes.set(t.slug, (sizes.get(t.slug) ?? 0) + 1));
    const biggest = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const of = pool.map((t, i) => (t.slug === biggest ? i : -1)).filter((i) => i >= 0);
    pool.splice(of[Math.floor(of.length / 2)], 1);
  }
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rows: SphereTile[][] = [];
  counts.forEach((n, ring) => {
    const row: SphereTile[] = [];
    for (let k = 0; k < n; k++) {
      const left = row[k - 1]?.slug;
      const above = rows[ring - 1]?.[Math.round((k / n) * rows[ring - 1].length) % rows[ring - 1].length]?.slug;
      const above2 = rows[ring - 1]?.[Math.round(((k + 0.5) / n) * rows[ring - 1].length) % rows[ring - 1].length]?.slug;
      const first = k === n - 1 ? row[0]?.slug : undefined;
      const remaining = new Map<string, number>();
      pool.forEach((t) => remaining.set(t.slug, (remaining.get(t.slug) ?? 0) + 1));
      let best = 0;
      let bestScore = -Infinity;
      pool.forEach((t, i) => {
        const clash = [left, above, above2, first].filter((s) => s === t.slug).length;
        const score = -clash * 100 + (remaining.get(t.slug) ?? 0) * 2 + rand();
        if (score > bestScore) {
          bestScore = score;
          best = i;
        }
      });
      row.push(pool.splice(best, 1)[0]);
    }
    rows.push(row);
  });
  return rows;
}

/** Hero photo sphere: one curved, softly rounded tile per photograph, drag to spin, hover lifts, click opens. */
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
  const usable = tiles.filter((t) => textures.has(t.src));
  const counts = fitRings(usable.length);
  const rows = assignTiles(usable, counts);
  rows.forEach((row, ring) => {
    const theta = thetaStart + ring * band;
    const mid = theta + band / 2;
    const perRing = row.length;
    const step = (Math.PI * 2) / perRing;
    const shift = (ring % 2) * step * 0.5;
    const aspect = ((step - GAP * 2) * Math.sin(mid)) / (band - GAP * 2);
    const mask = roundedMask(aspect);
    row.forEach((tile, k) => {
      const tex = textures.get(tile.src)!;
      const phi = k * step + shift;
      const geometry = new THREE.SphereGeometry(
        RADIUS,
        12,
        8,
        phi + GAP,
        step - GAP * 2,
        theta + GAP,
        band - GAP * 2,
      );
      const material = new THREE.MeshBasicMaterial({
        map: coverTexture(tex, aspect),
        alphaMap: mask,
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
    });
  });

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
    const fitH = RADIUS / (t * 0.7);
    const fitW = RADIUS / (t * camera.aspect * 0.86);
    distance = Math.max(fitH, fitW);
    // Sit a little above centre so the logo below overlaps as little as possible.
    group.position.y = RADIUS * 0.1;
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
        m.material.alphaMap?.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    },
  };
}

export type Sphere = ReturnType<typeof createSphere>;
