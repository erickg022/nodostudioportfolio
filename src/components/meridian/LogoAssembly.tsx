"use client";

/* eslint-disable @next/next/no-img-element -- static fallback for the canvas, shown only if WebGL fails */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { VERTICAL_QUERY } from "./runtime/media";

type Mode = "sequence" | "sway" | "still";
type Stage = "ink" | "paper";

type Props = {
  logo: string;
  label: string;
  mode?: Mode;
  stage?: Stage;
  /** "side": beside the About statement (landscape). "stacked": above the footer (vertical). */
  placement: "side" | "stacked";
};

function useVertical() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(VERTICAL_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(VERTICAL_QUERY).matches,
    () => false,
  );
}

/* settings from the approved reference (_reference/nodo-logo-assembly.html); keep these numbers */
const CFG = {
  assemblySpan: 0.55, // share of progress each glyph takes to travel home
  maxDelay: 0.45, // latest a glyph may start (0..1 of progress)
  scrollDamp: 4.2, // how quickly the drawn progress follows the scroll
  idleDamp: 1.6, // how slowly the idle motion fades in once built
  seqLength: 11, // seconds in the Sequence loop: turn, orange sweep, nod, repeat
  turnStart: 0.8,
  turnDur: 4.6,
  sweepStart: 5.9,
  sweepDur: 2.4,
  nodStart: 8.6,
  nodDur: 2.4,
  symbolsDesktop: 110, // floating code symbols orbiting the logo
  symbolsMobile: 48,
  cursorRadius: 0.085, // fraction of logo width
  budgetDesktop: 12000,
  budgetMobile: 5200,
};

/* glyphs: edges are dots and ticks, the body is the brand's own letters */
const GLYPHS = ["·", ":", "+", "N", "O", "D", "O"];
const CELL = 48;

/* code symbols that drift around the finished logo */
const SYMBOLS = ["{", "}", "<", ">", "/", ";", "=", "(", ")", "[", "]", "0", "1", "#", "*", "&", "|", "$"];

/* Each symbol rides its own slow 3D orbit around the logo, so there is always something moving. */
const SYM_VERTEX = /* glsl */ `
  uniform float uTg, uYaw, uPitch, uFw, uSize, uDpr, uSym, uMouseW, uR;
  uniform vec2 uView, uMouse;
  attribute vec4 aOrbit;   // radius scale, speed, phase, glyph index
  attribute vec4 aShape;   // y scale, z scale, accent, tilt
  varying float vA;
  varying float vGlyph;
  varying float vAccent;
  void main() {
    float a = aOrbit.z + uTg * aOrbit.y;
    float rad = aOrbit.x * uFw;
    float x = cos(a) * rad * 0.85;
    float z = sin(a) * rad * 0.42 * aShape.y;
    float y = (sin(a * 0.7 + aOrbit.z * 3.0) * 0.5 + sin(uTg * 0.3 + aOrbit.z) * 0.12) * rad * 0.5 * aShape.x;
    float ca = cos(uYaw), sa = sin(uYaw), cb = cos(uPitch), sb = sin(uPitch);
    float x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    float y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
    float Fd = uFw * 2.6;
    float pr = Fd / (Fd - z2);
    vec2 p = vec2(uView.x * 0.5 + x1 * pr, uView.y * 0.5 + y2 * pr);
    if (uMouseW > 0.01) {
      vec2 d = p - uMouse;
      float dist = length(d);
      if (dist < uR && dist > 0.1) {
        float f = 1.0 - dist / uR;
        p += d / dist * f * f * 70.0 * uMouseW;
      }
    }
    float depth = clamp(0.5 + z2 / (uFw * 0.9), 0.0, 1.0);
    float blink = 0.55 + 0.45 * sin(uTg * (0.6 + aShape.w) + aOrbit.z * 9.0);
    vA = uSym * (0.4 + 0.6 * depth) * (0.6 + 0.4 * blink);
    vGlyph = aOrbit.w;
    vAccent = aShape.z;
    gl_PointSize = uSize * pr * (0.7 + 0.5 * depth) * uDpr;
    gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  }
`;

const SYM_FRAGMENT = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uFg, uAccent;
  varying float vA;
  varying float vGlyph;
  varying float vAccent;
  void main() {
    vec2 uv = vec2((vGlyph + gl_PointCoord.x) / ${SYMBOLS.length.toFixed(1)}, 1.0 - gl_PointCoord.y);
    float ink = texture2D(uAtlas, uv).a;
    if (vA * ink < 0.01) discard;
    vec3 col = vAccent > 0.5 ? uAccent : uFg;
    gl_FragColor = vec4(col, vA * ink);
  }
`;

/*
 * The per-glyph maths of the reference frame loop, moved to the GPU so the browser only
 * updates a few uniforms per frame. Same easing, arc, rotation, projection, depth,
 * light wave and sweep. The cursor uses the resting offset of the reference's spring
 * (force / 0.0396 ≈ 55px at full strength) instead of integrating it per glyph.
 */
const VERTEX = /* glsl */ `
  uniform float uP, uTg, uYaw, uPitch, uSweepX, uBand, uFw, uSize0, uDpr, uMouseW, uR;
  uniform vec2 uView, uMouse;
  attribute vec3 aStart;
  attribute vec4 aMeta;   // delay, phase, brightness, arc
  attribute vec2 aMeta2;  // lag, glyph index
  varying float vA;
  varying float vAcc;
  varying float vGlyph;
  const float PI = 3.14159265;
  float smoother(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
  void main() {
    vec3 home = position;
    float e = smoother(clamp((uP - aMeta.x) / ${CFG.assemblySpan.toFixed(2)}, 0.0, 1.0));
    float drift = 1.0 - e;
    float cx = aStart.x + sin(uTg * 0.45 + aMeta.y) * 18.0 * drift;
    float cy = aStart.y + cos(uTg * 0.38 + aMeta.y) * 12.0 * drift;
    float x = cx + (home.x - cx) * e;
    float y = cy + (home.y - cy) * e + aMeta.w * sin(PI * e);
    float z = aStart.z + (home.z - aStart.z) * e;
    float ca = cos(uYaw), sa = sin(uYaw), cb = cos(uPitch), sb = sin(uPitch);
    float x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    float y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
    float Fd = uFw * 2.6;
    float pr = Fd / (Fd - z2);
    vec2 p = vec2(uView.x * 0.5 + x1 * pr, uView.y * 0.5 + y2 * pr);
    if (uMouseW > 0.01) {
      vec2 d = p - uMouse;
      float dist = length(d);
      if (dist < uR && dist > 0.1) {
        float f = 1.0 - dist / uR;
        p += d / dist * f * f * 55.5 * uMouseW;
      }
    }
    float depth = clamp(0.5 + z2 / (uFw * 0.8), 0.0, 1.0);
    float wave = 0.94 + 0.06 * sin(uTg * 1.1 - home.x * 0.008 - home.y * 0.012 + aMeta.y * 0.3);
    vA = aMeta.z * (0.32 + 0.68 * depth) * (0.25 + 0.75 * e) * (e > 0.99 ? wave : 1.0);
    float acc = 0.0;
    if (uSweepX < 1.0e8) {
      float dd = (home.x - uSweepX) / uBand;
      acc = exp(-dd * dd) * e;
    }
    vAcc = acc;
    vGlyph = aMeta2.y;
    gl_PointSize = uSize0 * pr * (0.8 + 0.2 * e) * uDpr;
    gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uFg, uAccent;
  varying float vA;
  varying float vAcc;
  varying float vGlyph;
  void main() {
    vec2 uv = vec2((vGlyph + gl_PointCoord.x) / ${GLYPHS.length.toFixed(1)}, 1.0 - gl_PointCoord.y);
    float ink = texture2D(uAtlas, uv).a;
    // The reference draws a base glyph and an accent glyph on top; composite both here.
    float aBase = vAcc < 0.98 ? vA * (1.0 - vAcc) : 0.0;
    float aAcc = vAcc > 0.02 ? min(1.0, (vA + 0.35) * vAcc) : 0.0;
    float a = aAcc + aBase * (1.0 - aAcc);
    if (a * ink < 0.003) discard;
    vec3 col = (uAccent * aAcc + uFg * aBase * (1.0 - aAcc)) / max(a, 1e-4);
    gl_FragColor = vec4(col, a * ink);
  }
`;

/**
 * NODO logo assembly: the logo builds from small glyphs as the box scrolls into view,
 * then idles (turn, orange sweep, nod, orbiting code symbols). WebGL points, one draw call per frame.
 */
export function LogoAssembly({ logo, label, mode = "sequence", stage = "paper", placement }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const vertical = useVertical();
  const active = placement === "stacked" ? vertical : !vertical;

  useEffect(() => {
    if (!active) return;
    const box = boxRef.current!;
    const cv = canvasRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TAU = Math.PI * 2;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const sineIO = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1));
    const damp = (cur: number, target: number, rate: number, dt: number) =>
      cur + (target - cur) * (1 - Math.exp(-rate * dt));
    function rng(s: number) {
      return () => {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() ||
      '"IBM Plex Mono"';

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.BufferGeometry();
    const atlasCanvas = document.createElement("canvas");
    const atlas = new THREE.CanvasTexture(atlasCanvas);
    const fg = stage === "ink" ? "#ebe9e4" : "#000000";
    const uniforms = {
      uP: { value: 0 },
      uTg: { value: 0 },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uSweepX: { value: 1e9 },
      uBand: { value: 1 },
      uFw: { value: 1 },
      uSize0: { value: 1 },
      uDpr: { value: 1 },
      uMouseW: { value: 0 },
      uR: { value: 60 },
      uView: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uAtlas: { value: atlas },
      uFg: { value: new THREE.Color(fg) },
      uAccent: { value: new THREE.Color("#FF4D00") },
    };
    // Colours are written as-is (sRGB), like the 2D reference.
    uniforms.uFg.value.setStyle(fg, THREE.LinearSRGBColorSpace);
    uniforms.uAccent.value.setStyle("#FF4D00", THREE.LinearSRGBColorSpace);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const symAtlasCanvas = document.createElement("canvas");
    const symAtlas = new THREE.CanvasTexture(symAtlasCanvas);
    const symGeometry = new THREE.BufferGeometry();
    const symUniforms = {
      uTg: { value: 0 },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uFw: { value: 1 },
      uSize: { value: 14 },
      uDpr: { value: 1 },
      uSym: { value: 0 },
      uMouseW: { value: 0 },
      uR: { value: 60 },
      uView: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uAtlas: { value: symAtlas },
      uFg: { value: new THREE.Color(fg) },
      uAccent: { value: new THREE.Color("#FF4D00") },
    };
    symUniforms.uFg.value.setStyle(fg, THREE.LinearSRGBColorSpace);
    symUniforms.uAccent.value.setStyle("#FF4D00", THREE.LinearSRGBColorSpace);
    const symMaterial = new THREE.ShaderMaterial({
      uniforms: symUniforms,
      vertexShader: SYM_VERTEX,
      fragmentShader: SYM_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const symPoints = new THREE.Points(symGeometry, symMaterial);
    symPoints.frustumCulled = false;
    scene.add(symPoints);
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    let W = 0;
    let H = 0;
    let fw = 0;
    let img: HTMLImageElement | null = null;
    let built = false;
    let P = 0, idleW = 0, T = 0, tg = 0, sweepT = -1, last = 0, mouseW = 0;
    let mouse: { x: number; y: number } | null = null;
    let raf = 0;
    let running = false;
    let disposed = false;

    function drawAtlas() {
      atlasCanvas.width = CELL * GLYPHS.length;
      atlasCanvas.height = CELL;
      const x = atlasCanvas.getContext("2d")!;
      x.font = `500 33px ${fontFamily}, ui-monospace, monospace`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillStyle = "#fff";
      GLYPHS.forEach((ch, i) => x.fillText(ch, CELL * i + CELL / 2, CELL / 2 + 2));
      atlas.needsUpdate = true;

      symAtlasCanvas.width = CELL * SYMBOLS.length;
      symAtlasCanvas.height = CELL;
      const y = symAtlasCanvas.getContext("2d")!;
      y.font = `500 34px ${fontFamily}, ui-monospace, monospace`;
      y.textAlign = "center";
      y.textBaseline = "middle";
      y.fillStyle = "#fff";
      SYMBOLS.forEach((ch, i) => y.fillText(ch, CELL * i + CELL / 2, CELL / 2 + 2));
      symAtlas.needsUpdate = true;
    }

    /* sample the logo into a grid of points, two layers deep so the turn has volume */
    function sample(cols: number, fh: number) {
      const cs = fw / cols;
      const rows = Math.max(8, Math.round(fh / cs));
      const t = document.createElement("canvas");
      t.width = cols;
      t.height = rows;
      const x = t.getContext("2d", { willReadFrequently: true })!;
      x.imageSmoothingQuality = "high";
      x.drawImage(img!, 0, 0, cols, rows);
      const d = x.getImageData(0, 0, cols, rows).data;
      const fil = new Uint8Array(cols * rows);
      const cov = new Float32Array(cols * rows);
      let n = 0;
      for (let i = 0; i < cols * rows; i++) {
        cov[i] = d[i * 4 + 3] / 255;
        fil[i] = cov[i] > 0.3 ? 1 : 0;
        n += fil[i];
      }
      return { cols, rows, cs, fil, cov, n };
    }

    function build() {
      if (!img || !W) return;
      const ar = img.width / img.height;
      const mobile = W < 640;
      fw = Math.min(W * (mobile ? 0.9 : 0.78), H * 0.6 * ar);
      const fh = fw / ar;
      let g = sample(clamp(Math.round(fw / (mobile ? 3.2 : 4)), 60, 320), fh);
      const budget = mobile ? CFG.budgetMobile : CFG.budgetDesktop;
      if (g.n * 2 > budget) g = sample(Math.round(g.cols * Math.sqrt(budget / (g.n * 2))), fh);
      const { cols, rows, cs, fil, cov, n } = g;

      /* distance to the nearest edge, so edges get dots and thick parts get depth */
      const dist = new Float32Array(cols * rows);
      for (let i = 0; i < dist.length; i++) dist[i] = fil[i] ? 1e5 : 0;
      const at = (r: number, c: number) => (r < 0 || c < 0 || r >= rows || c >= cols ? 0 : dist[r * cols + c]);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (fil[i])
            dist[i] = Math.min(dist[i], at(r - 1, c) + 1, at(r, c - 1) + 1, at(r - 1, c - 1) + 1.41, at(r - 1, c + 1) + 1.41);
        }
      for (let r = rows - 1; r >= 0; r--)
        for (let c = cols - 1; c >= 0; c--) {
          const i = r * cols + c;
          if (fil[i])
            dist[i] = Math.min(dist[i], at(r + 1, c) + 1, at(r, c + 1) + 1, at(r + 1, c + 1) + 1.41, at(r + 1, c - 1) + 1.41);
        }

      const N = n * 2;
      const home = new Float32Array(N * 3);
      const start = new Float32Array(N * 3);
      const meta = new Float32Array(N * 4);
      const meta2 = new Float32Array(N * 2);
      const rnd = rng(7);
      const zt = fw * 0.035;
      let k = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (!fil[i]) continue;
          const dd = dist[i];
          const X = (c + 0.5 - cols / 2) * cs;
          const Y = (r + 0.5 - rows / 2) * cs;
          for (let s = 1; s >= -1; s -= 2) {
            home.set([X, Y, s * (0.35 + Math.min(dd, 4) / 4) * zt], k * 3);
            const bri = (0.62 + 0.38 * cov[i]) * (0.78 + 0.22 * rnd()) * (s > 0 ? 1 : 0.7);
            const glyph = dd <= 1.5 ? Math.floor(rnd() * 3) : 3 + ((r * 7 + c * 3) & 3);
            /* start in a low, wide mound below centre */
            const th = rnd() * TAU;
            const rad = Math.pow(rnd(), 0.6);
            start.set(
              [
                Math.cos(th) * rad * W * 0.55,
                Math.abs(Math.sin(th)) * rad * H * 0.32 + H * 0.12,
                (rnd() - 0.5) * fw * 0.8,
              ],
              k * 3,
            );
            /* start order: a soft left-to-right wave with noise, so it reads as one gesture */
            const nx = X / fw + 0.5;
            const delay = clamp((0.6 * nx + 0.4 * rnd()) * CFG.maxDelay, 0, CFG.maxDelay);
            const arc = -(0.15 + 0.35 * rnd()) * H * 0.45;
            const phase = rnd() * TAU;
            meta.set([delay, phase, bri, arc], k * 4);
            meta2.set([Math.abs(X) / fw, glyph], k * 2);
            k++;
          }
        }
      geometry.setAttribute("position", new THREE.BufferAttribute(home, 3));
      geometry.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
      geometry.setAttribute("aMeta", new THREE.BufferAttribute(meta, 4));
      geometry.setAttribute("aMeta2", new THREE.BufferAttribute(meta2, 2));
      uniforms.uFw.value = fw;
      uniforms.uSize0.value = cs * 1.68;
      uniforms.uBand.value = fw * 0.06;
      uniforms.uR.value = Math.max(60, fw * CFG.cursorRadius);
      const SN = mobile ? CFG.symbolsMobile : CFG.symbolsDesktop;
      const orbit = new Float32Array(SN * 4);
      const shape = new Float32Array(SN * 4);
      const srnd = rng(23);
      const pos = new Float32Array(SN * 3);
      for (let j = 0; j < SN; j++) {
        // radius scale 0.5..0.72 of the logo width: a loose ring just around the letters
        const speed = (0.12 + 0.3 * srnd()) * (srnd() < 0.5 ? -1 : 1);
        orbit.set([0.5 + 0.22 * srnd(), speed, srnd() * TAU, Math.floor(srnd() * SYMBOLS.length)], j * 4);
        shape.set([0.5 + 0.8 * srnd(), 0.6 + 0.8 * srnd(), srnd() < 0.16 ? 1 : 0, srnd() * 0.8], j * 4);
      }
      symGeometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      symGeometry.setAttribute("aOrbit", new THREE.BufferAttribute(orbit, 4));
      symGeometry.setAttribute("aShape", new THREE.BufferAttribute(shape, 4));
      symUniforms.uFw.value = fw;
      symUniforms.uSize.value = clamp(fw * 0.05, 14, 32);
      symUniforms.uR.value = Math.max(60, fw * CFG.cursorRadius);
      built = true;
    }

    function resize() {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(W, H, false);
      uniforms.uDpr.value = dpr;
      uniforms.uView.value.set(W, H);
      symUniforms.uDpr.value = dpr;
      symUniforms.uView.value.set(W, H);
      build();
      if (!running) draw(); // keep a correct still frame when paused
    }

    /* scroll progress for an in-flow box: starts as its top passes 85% of the viewport,
       finishes when its centre reaches 45%, then holds; scrolling back takes it apart */
    function scrollTarget() {
      const r = box.getBoundingClientRect();
      const vh = innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.45 - r.height / 2;
      return clamp((start - r.top) / Math.max(1, start - end), 0, 1);
    }

    function update(dt: number) {
      tg += dt;
      const rawP = reduce ? 1 : scrollTarget();
      P = reduce ? 1 : damp(P, rawP, CFG.scrollDamp, dt);
      if (Math.abs(P - rawP) < 0.0005) P = rawP;
      const done = P > 0.995;
      idleW = reduce ? 0 : damp(idleW, done && mode !== "still" ? 1 : 0, CFG.idleDamp, dt);
      if (idleW > 0.002) T += dt;
      else T = 0;
      if (done && sweepT < 0 && !reduce) sweepT = 0; // one sweep the moment it lands
      if (!done && P < 0.9) sweepT = -1;
      if (sweepT >= 0) sweepT += dt;
      mouseW = damp(mouseW, mouse && !reduce ? 1 : 0, 6, dt);

      /* idle choreography, all as smooth functions of time */
      let yaw = 0;
      let nod = 0;
      let sweep = sweepT >= 0 && sweepT < CFG.sweepDur ? sweepT / CFG.sweepDur : -1;
      if (mode === "sequence") {
        const t = T % CFG.seqLength;
        yaw = 0.12 * Math.sin(T * 0.7) + TAU * sineIO((t - CFG.turnStart) / CFG.turnDur);
        nod = Math.sin(Math.PI * clamp((t - CFG.nodStart) / CFG.nodDur, 0, 1)) * 0.32;
        if (t > CFG.sweepStart && t < CFG.sweepStart + CFG.sweepDur && T > CFG.seqLength * 0.5)
          sweep = (t - CFG.sweepStart) / CFG.sweepDur;
      } else if (mode === "sway") {
        yaw = 0.5 * Math.sin(T * 0.55);
      }
      const pitch = 0.07 * Math.sin(T * 0.45) + nod;

      uniforms.uP.value = P;
      uniforms.uTg.value = tg;
      uniforms.uYaw.value = yaw * idleW;
      uniforms.uPitch.value = pitch * idleW;
      symUniforms.uSym.value = idleW * clamp((P - 0.8) / 0.2, 0, 1);
      symUniforms.uTg.value = tg;
      symUniforms.uYaw.value = yaw * idleW * 0.5;
      symUniforms.uPitch.value = pitch * idleW;
      symUniforms.uMouseW.value = mouseW;
      if (mouse) symUniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uSweepX.value = sweep >= 0 ? (-0.65 + 1.3 * sineIO(sweep)) * fw : 1e9;
      uniforms.uMouseW.value = mouseW;
      if (mouse) uniforms.uMouse.value.set(mouse.x, mouse.y);
    }

    function draw() {
      if (built) renderer.render(scene, camera);
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      update(dt);
      draw();
    }

    const start = () => {
      if (running || disposed || !img) return;
      running = true;
      raf = requestAnimationFrame((t) => {
        last = t;
        frame(t);
      });
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (mouse = null);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "200px" },
    );

    const boot = () => {
      if (disposed) return;
      drawAtlas();
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (disposed) return;
        img = image;
        resize();
        ro.observe(cv);
        io.observe(box);
        if (visible) start();
      };
      image.onerror = () => !disposed && setFailed(true);
      image.src = logo;
    };
    Promise.race([
      document.fonts.load(`500 33px ${fontFamily}`),
      new Promise((r) => setTimeout(r, 2500)),
    ]).then(boot, boot);

    return () => {
      disposed = true;
      stop();
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      atlas.dispose();
      symGeometry.dispose();
      symMaterial.dispose();
      symAtlas.dispose();
      renderer.dispose();
    };
  }, [active, logo, mode, stage]);

  return (
    <div
      ref={boxRef}
      className={`nd-assembly nd-assembly--${placement}`}
      data-stage={stage}
      data-failed={failed || undefined}
    >
      {failed ? (
        <img src={logo} alt={label} className="nd-assembly__fallback" />
      ) : (
        <canvas ref={canvasRef} role="img" aria-label={label} />
      )}
    </div>
  );
}
