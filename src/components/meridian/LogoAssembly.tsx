"use client";

/* eslint-disable @next/next/no-img-element -- static fallback for the canvas, shown only if it fails */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { VERTICAL_QUERY } from "./runtime/media";

type Mode = "sequence" | "sway" | "stretch" | "still";
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

/**
 * NODO logo assembly (port of _reference/nodo-logo-assembly.html). Canvas 2D, no libraries:
 * the logo builds from small glyphs as the box scrolls into view, then idles.
 * Everything that moves goes through a damped value, so nothing snaps.
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
    const ctx = cv.getContext("2d");
    if (!ctx) {
      setFailed(true);
      return;
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TAU = Math.PI * 2;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // smootherstep: zero velocity at both ends
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

    /* settings from the approved reference; keep these numbers */
    const CFG = {
      assemblySpan: 0.55, // share of progress each glyph takes to travel home
      maxDelay: 0.45, // latest a glyph may start (0..1 of progress)
      scrollDamp: 4.2, // how quickly the drawn progress follows the scroll
      idleDamp: 1.6, // how slowly the idle motion fades in once built
      seqLength: 13, // seconds in the Sequence loop
      turnStart: 2.6,
      turnDur: 4.6,
      stretchStart: 8.2,
      stretchDur: 3.0,
      stretchX: 0.38,
      stretchY: 0.18,
      sweepDur: 2.4,
      cursorRadius: 0.085, // fraction of logo width
      budgetDesktop: 12000,
      budgetMobile: 5200,
    };

    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() ||
      '"IBM Plex Mono"';

    let W = 0;
    let H = 0;
    let dpr = 1;
    let img: HTMLImageElement | null = null;
    let N = 0;
    let fw = 0;
    let fh = 0;
    let cell = 4;
    let hx = new Float32Array(0), hy = hx, hz = hx, sx = hx, sy = hx, sz = hx, dl = hx, ph = hx;
    let bri = hx, arc = hx, lag = hx, ox = hx, oy = hx, vx = hx, vy = hx;
    let gl = new Uint8Array(0);
    let rawP = 0, P = 0, idleW = 0, T = 0, tg = 0, sweepT = -1, last = 0;
    let mouse: { x: number; y: number } | null = null;
    let mouseW = 0;
    let spr: { base: HTMLCanvasElement[]; accent: HTMLCanvasElement[] } = { base: [], accent: [] };
    let raf = 0;
    let running = false;
    let disposed = false;

    /* glyphs: edges are dots and ticks, the body is the brand's own letters */
    const EDGE = ["·", ":", "+"];
    const BODY = ["N", "O", "D", "O"];
    function sprites() {
      const fg = stage === "ink" ? "#ebe9e4" : "#000000";
      const mk = (col: string) =>
        [...EDGE, ...BODY].map((ch) => {
          const S = 48;
          const c = document.createElement("canvas");
          c.width = c.height = S;
          const x = c.getContext("2d")!;
          x.font = `500 33px ${fontFamily}, ui-monospace, monospace`;
          x.textAlign = "center";
          x.textBaseline = "middle";
          x.fillStyle = col;
          x.fillText(ch, S / 2, S / 2 + 2);
          return c;
        });
      spr = { base: mk(fg), accent: mk("#FF4D00") };
    }

    /* sample the logo into a grid of points, two layers deep so the turn has volume */
    function sample(cols: number) {
      const logo = img!;
      const cs = fw / cols;
      const rows = Math.max(8, Math.round(fh / cs));
      const t = document.createElement("canvas");
      t.width = cols;
      t.height = rows;
      const x = t.getContext("2d", { willReadFrequently: true })!;
      x.imageSmoothingQuality = "high";
      x.drawImage(logo, 0, 0, cols, rows);
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
      fh = fw / ar;
      let g = sample(clamp(Math.round(fw / (mobile ? 3.2 : 4)), 60, 320));
      const budget = mobile ? CFG.budgetMobile : CFG.budgetDesktop;
      if (g.n * 2 > budget) g = sample(Math.round(g.cols * Math.sqrt(budget / (g.n * 2))));
      const { cols, rows, cs, fil, cov, n } = g;
      cell = cs;

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

      N = n * 2;
      const F = () => new Float32Array(N);
      hx = F(); hy = F(); hz = F(); sx = F(); sy = F(); sz = F(); dl = F(); ph = F(); bri = F(); arc = F(); lag = F();
      ox = F(); oy = F(); vx = F(); vy = F(); gl = new Uint8Array(N);
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
            hx[k] = X;
            hy[k] = Y;
            hz[k] = s * (0.35 + Math.min(dd, 4) / 4) * zt;
            bri[k] = (0.62 + 0.38 * cov[i]) * (0.78 + 0.22 * rnd()) * (s > 0 ? 1 : 0.7);
            gl[k] = dd <= 1.5 ? Math.floor(rnd() * 3) : 3 + ((r * 7 + c * 3) & 3);
            /* start in a low, wide mound below centre */
            const th = rnd() * TAU;
            const rad = Math.pow(rnd(), 0.6);
            sx[k] = Math.cos(th) * rad * W * 0.55;
            sy[k] = Math.abs(Math.sin(th)) * rad * H * 0.32 + H * 0.12;
            sz[k] = (rnd() - 0.5) * fw * 0.8;
            /* start order: a soft left-to-right wave with noise, so it reads as one gesture */
            const nx = X / fw + 0.5;
            dl[k] = clamp((0.6 * nx + 0.4 * rnd()) * CFG.maxDelay, 0, CFG.maxDelay);
            arc[k] = -(0.15 + 0.35 * rnd()) * H * 0.45;
            ph[k] = rnd() * TAU;
            lag[k] = Math.abs(X) / fw;
            k++;
          }
        }
    }

    function resize() {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      build();
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

    /* bell curve with a small settle: 0 → 1 → 0, no hard turnaround */
    const bell = (u: number) =>
      u <= 0 || u >= 1 ? 0 : Math.pow(Math.sin(Math.PI * u), 2) * (1 + 0.08 * Math.sin(TAU * u));

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      tg += dt;
      rawP = reduce ? 1 : scrollTarget();
      P = reduce ? 1 : damp(P, rawP, CFG.scrollDamp, dt);
      if (Math.abs(P - rawP) < 0.0005) P = rawP;
      const built = P > 0.995;
      idleW = reduce ? 0 : damp(idleW, built && mode !== "still" ? 1 : 0, CFG.idleDamp, dt);
      if (idleW > 0.002) T += dt;
      else T = 0;
      if (built && sweepT < 0 && !reduce) sweepT = 0; // one sweep the moment it lands
      if (!built && P < 0.9) sweepT = -1;
      if (sweepT >= 0) sweepT += dt;
      mouseW = damp(mouseW, mouse && !reduce ? 1 : 0, 6, dt);
      if (!N) return;

      /* idle choreography, all as smooth functions of time */
      let yaw = 0;
      let pitch = 0;
      let st = -1;
      let sweep = sweepT >= 0 && sweepT < CFG.sweepDur ? sweepT / CFG.sweepDur : -1;
      if (mode === "sequence") {
        const t = T % CFG.seqLength;
        yaw = 0.09 * Math.sin(T * 0.7) + TAU * sineIO((t - CFG.turnStart) / CFG.turnDur);
        st = (t - CFG.stretchStart) / CFG.stretchDur;
        if (
          t > CFG.stretchStart + CFG.stretchDur + 0.4 &&
          t < CFG.stretchStart + CFG.stretchDur + 0.4 + CFG.sweepDur &&
          T > CFG.seqLength * 0.5
        )
          sweep = (t - CFG.stretchStart - CFG.stretchDur - 0.4) / CFG.sweepDur;
      } else if (mode === "sway") {
        yaw = 0.5 * Math.sin(T * 0.55);
      } else if (mode === "stretch") {
        yaw = 0.07 * Math.sin(T * 0.7);
        st = ((T % 5) - 0.5) / CFG.stretchDur;
      }
      pitch = 0.07 * Math.sin(T * 0.45);
      yaw *= idleW;
      pitch *= idleW;
      const stK = idleW;
      const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch);
      const Fd = fw * 2.6, cx0 = W / 2, cy0 = H / 2;
      const sweepX = sweep >= 0 ? (-0.65 + 1.3 * sineIO(sweep)) * fw : 1e9;
      const band = fw * 0.06;
      const R = Math.max(60, fw * CFG.cursorRadius);
      const R2 = R * R;
      const breath = 0.06;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      const size0 = cell * 1.68;

      for (let i = 0; i < N; i++) {
        const lt = clamp((P - dl[i]) / CFG.assemblySpan, 0, 1);
        const e = smoother(lt);
        /* the cloud breathes slowly; once a glyph lands, the breathing fades out */
        const drift = 1 - e;
        const cx = sx[i] + Math.sin(tg * 0.45 + ph[i]) * 18 * drift;
        const cy = sy[i] + Math.cos(tg * 0.38 + ph[i]) * 12 * drift;
        const cz = sz[i];
        let x = cx + (hx[i] - cx) * e;
        let y = cy + (hy[i] - cy) * e + arc[i] * Math.sin(Math.PI * e);
        let z = cz + (hz[i] - cz) * e;

        if (st > -0.5) {
          const k = bell(st - lag[i] * 0.22) * stK;
          if (k) {
            x *= 1 + CFG.stretchX * k;
            y *= 1 - CFG.stretchY * k;
            z *= 1 - 0.3 * k;
          }
        }
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const pr = Fd / (Fd - z2);
        let X = cx0 + x1 * pr, Y = cy0 + y2 * pr;

        /* cursor: a soft spring push, faded in and out */
        if (mouseW > 0.01 && mouse) {
          const dx = X + ox[i] - mouse.x, dy = Y + oy[i] - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2), f = (1 - d / R) * (1 - d / R) * 2.2 * mouseW;
            vx[i] += (dx / d) * f;
            vy[i] += (dy / d) * f;
          }
        }
        if (ox[i] !== 0 || vx[i] !== 0 || oy[i] !== 0 || vy[i] !== 0) {
          vx[i] = (vx[i] - ox[i] * 0.045) * 0.88;
          vy[i] = (vy[i] - oy[i] * 0.045) * 0.88;
          ox[i] += vx[i];
          oy[i] += vy[i];
          if (Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(vx[i]) + Math.abs(vy[i]) < 0.02) ox[i] = oy[i] = vx[i] = vy[i] = 0;
        }
        X += ox[i];
        Y += oy[i];

        const depth = clamp(0.5 + z2 / (fw * 0.8), 0, 1);
        /* a slow light wave across the built logo instead of flicker */
        const wave = 1 - breath + breath * Math.sin(tg * 1.1 - hx[i] * 0.008 - hy[i] * 0.012 + ph[i] * 0.3);
        const a = bri[i] * (0.32 + 0.68 * depth) * (0.25 + 0.75 * e) * (e > 0.99 ? wave : 1);
        const s = size0 * pr * (0.8 + 0.2 * e);
        const g = gl[i];

        let acc = 0;
        if (sweepX < 1e8) {
          const d = (hx[i] - sweepX) / band;
          acc = Math.exp(-d * d) * e;
        }
        if (acc < 0.98) {
          ctx!.globalAlpha = a * (1 - acc);
          ctx!.drawImage(spr.base[g], X - s / 2, Y - s / 2, s, s);
        }
        if (acc > 0.02) {
          ctx!.globalAlpha = Math.min(1, (a + 0.35) * acc);
          ctx!.drawImage(spr.accent[g], X - s / 2, Y - s / 2, s, s);
        }
      }
      ctx!.globalAlpha = 1;
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
      sprites();
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
