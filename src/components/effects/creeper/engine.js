// ==========================================
// CREEPER ENGINE
// A fixed, viewport-sized canvas that renders document-space vines.
// - Vines grow as the page scrolls (spines scrub, anchored vines latch)
// - Stems bend away from the pointer, leaves rustle and flip,
//   tendrils uncoil and reach toward the cursor
// - Fast sweeps knock leaves loose; clicks burst a few leaves
// Anchors come from DOM elements with [data-creeper]; seekers are
// curious shoots whose tips reach for the cursor ([data-creeper="seeker"]).
// ==========================================

import {
  TAU,
  mulberry32,
  hashString,
  clamp,
  lerp,
  easeOutBack,
  catmullRom,
  resample,
  braid,
  makeLeafPaths,
  LEAF_TONES,
  STEM_COLOR,
  STEM_YOUNG,
  TENDRIL_COLOR,
} from './geometry';
import { Seeker } from './seeker';

const STEP = 4;
const POINTER_RADIUS = 150;
const MAX_PARTICLES = 34;

function lerpAngle(a, b, t) {
  const diff = ((((b - a) % TAU) + TAU * 1.5) % TAU) - Math.PI;
  return a + diff * t;
}

export class CreeperEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.paths = makeLeafPaths();
    this.vines = [];
    this.seekers = [];
    this.particles = [];
    this.grownMemory = new Map();
    this.routeKey = '';

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pointer = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false };
    this.lastScroll = window.scrollY;
    this.wind = 0;
    this.running = false;
    this.raf = 0;
    this.rebuildTimer = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onBurst = this.onBurst.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: true });
    document.addEventListener('mouseleave', this.onPointerLeave);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('creeper:burst', this.onBurst);
    document.addEventListener('visibilitychange', this.onVisibility);

    this.resizeObserver = new ResizeObserver(() => this.scheduleRebuild());
    this.resizeObserver.observe(document.body);

    this.resizeCanvas();
  }

  // ---------- lifecycle ----------
  start() {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    clearTimeout(this.rebuildTimer);
    this.resizeObserver.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    document.removeEventListener('mouseleave', this.onPointerLeave);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('creeper:burst', this.onBurst);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  // ---------- events ----------
  onPointerMove(e) {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
    this.pointer.active = true;
    this.pointer.touch = e.pointerType === 'touch';
  }

  onPointerDown(e) {
    this.onPointerMove(e);
    clearTimeout(this.touchTimer);
  }

  onPointerUp(e) {
    if (e.pointerType === 'touch') {
      clearTimeout(this.touchTimer);
      this.touchTimer = setTimeout(() => this.onPointerLeave(), 260);
    }
  }

  onPointerLeave() {
    this.pointer.active = false;
  }

  onVisibility() {
    if (document.hidden) this.stop();
    else this.start();
  }

  onBurst(e) {
    const { x, y } = e.detail || {};
    if (typeof x !== 'number') return;
    const rng = Math.random;
    for (let k = 0; k < 5; k++) {
      this.spawnParticle(x, y, (rng() - 0.5) * 5, -1 - rng() * 2.4, 9 + rng() * 7);
    }
  }

  onResize() {
    this.resizeCanvas();
    this.scheduleRebuild();
  }

  resizeCanvas() {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 1.75);
    this.dpr = dpr;
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;
    this.canvas.width = Math.round(this.vw * dpr);
    this.canvas.height = Math.round(this.vh * dpr);
    this.canvas.style.width = `${this.vw}px`;
    this.canvas.style.height = `${this.vh}px`;
  }

  // ---------- building ----------
  scheduleRebuild(opts = {}) {
    if (opts.reset) {
      this.pendingReset = true;
      this.routeKey = opts.key || this.routeKey;
    }
    clearTimeout(this.rebuildTimer);
    this.rebuildTimer = setTimeout(() => this.rebuild(), opts.delay ?? 140);
  }

  rebuild() {
    const reset = this.pendingReset;
    this.pendingReset = false;
    if (reset) this.grownMemory.clear();
    else [...this.vines, ...this.seekers].forEach((v) => this.grownMemory.set(v.id, v.grown));

    const docW = document.documentElement.clientWidth;
    const isMobile = docW < 768;
    this.isMobile = isMobile;
    this.scale = isMobile ? 0.62 : docW < 1100 ? 0.82 : 1;
    const seed = hashString(this.routeKey || 'root');
    const sy = window.scrollY;

    const vines = [];
    const seekers = [];

    // vines enter from just beyond the viewport edge
    const edgeX = -14;

    // --- Anchored vines ---
    const anchors = document.querySelectorAll('[data-creeper]');
    let seamIndex = 0;
    anchors.forEach((el, ai) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const L = rect.left;
      const T = rect.top + sy;
      const W = rect.width;
      const H = rect.height;
      const type = el.dataset.creeper;
      const rng = mulberry32(seed + ai * 9973 + Math.round(W));
      const k = this.scale;
      const idBase = `${type}-${ai}`;

      if (type === 'seam' || type === 'garland') {
        if (isMobile && type === 'seam' && el.dataset.creeperMobile !== 'true') return;
        const sideAttr = el.dataset.creeperSide;
        const side = sideAttr || (seamIndex++ % 2 === 0 ? 'left' : 'right');
        const span = parseFloat(el.dataset.creeperSpan || (type === 'garland' ? '1' : '0.34'));
        const y0 = T + parseFloat(el.dataset.creeperOffset || '0');
        const startX = side === 'left' ? edgeX : docW - edgeX;
        const dir = side === 'left' ? 1 : -1;
        const w = type === 'garland' ? docW - edgeX * 2 : docW * span;
        const sag = type === 'garland' ? 54 * k : 24 * k;
        const ctrl =
          type === 'garland'
            ? [
                { x: startX, y: y0 - 34 },
                { x: startX + dir * w * 0.22, y: y0 + sag * 0.7 },
                { x: startX + dir * w * 0.5, y: y0 + sag },
                { x: startX + dir * w * 0.78, y: y0 + sag * 0.7 },
                { x: startX + dir * w, y: y0 - 34 },
              ]
            : [
                { x: startX, y: y0 - 46 * k },
                { x: startX + dir * w * 0.2, y: y0 + 4 },
                { x: startX + dir * w * 0.52, y: y0 + sag },
                { x: startX + dir * w * 0.8, y: y0 + sag * 0.45 },
                { x: startX + dir * w, y: y0 + sag * 1.6 },
              ];
        const base = resample(catmullRom(ctrl, 28), STEP);
        const phase = rng() * TAU;
        [0, 1].forEach((strand) => {
          const pts = braid(base, { amp: 5 * k, wavelength: 40, phase: phase + strand * Math.PI, step: STEP });
          vines.push(
            this.makeVine(pts, {
              id: `${idBase}-${strand}`,
              mode: 'latch',
              triggerY: y0 - 40,
              rng: mulberry32(seed + ai * 31 + strand),
              leafEvery: strand === 0 ? 30 : 58,
              leafSize: [11 * k, 21 * k],
              outer: -dir,
              outerBias: 0.6,
              tendrilEvery: strand === 0 ? 120 : 0,
              flowerEvery: strand === 0 ? 300 : 0,
              width: (strand === 0 ? 2.2 : 1.4) * k,
              color: strand === 0 ? STEM_COLOR : STEM_YOUNG,
            })
          );
        });
        // hanging drips from the runner
        const drips = type === 'garland' ? 5 : 2;
        for (let d = 0; d < drips; d++) {
          const f = (d + 0.6 + rng() * 0.4) / (drips + 0.6);
          const p = base[Math.min(base.length - 1, Math.floor(base.length * f))];
          const len = (70 + rng() * 120) * k;
          vines.push(this.makeHanging(p.x, p.y, len, `${idBase}-drip-${d}`, seed + ai * 7 + d, y0 + 20));
        }
        return;
      }

      if (type === 'arch') {
        if (isMobile && el.dataset.creeperMobile !== 'true') return;
        const pad = 16 * k;
        const r = W / 2 + pad;
        const cx = L + W / 2;
        const cy = T + W / 2;
        const sweep = parseFloat(el.dataset.creeperSpan || '0.7');
        const pts = [];
        const startY = T + H * 0.86;
        for (let y = startY; y > cy; y -= 20) pts.push({ x: L - pad, y });
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const ang = Math.PI + (s / steps) * Math.PI * sweep;
          pts.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r });
        }
        const base = resample(catmullRom(pts, 6), STEP);
        const phase = rng() * TAU;
        [0, 1].forEach((strand) => {
          const bp = braid(base, { amp: 5.5 * k, wavelength: 38, phase: phase + strand * Math.PI, step: STEP });
          vines.push(
            this.makeVine(bp, {
              id: `${idBase}-${strand}`,
              mode: 'latch',
              triggerY: T + H * 0.3,
              rng: mulberry32(seed + ai * 57 + strand),
              leafEvery: strand === 0 ? 26 : 50,
              leafSize: [12 * k, 24 * k],
              outer: -1,
              outerBias: 0.7,
              tendrilEvery: strand === 0 ? 110 : 0,
              flowerEvery: strand === 0 ? 210 : 0,
              width: (strand === 0 ? 2.6 : 1.5) * k,
              color: strand === 0 ? STEM_COLOR : STEM_YOUNG,
              delay: 18,
            })
          );
        });
        return;
      }

      if (type === 'climb') {
        if (isMobile && el.dataset.creeperMobile !== 'true') return;
        const side = el.dataset.creeperSide || 'left';
        const pad = 14 * k;
        const x = side === 'left' ? L - pad : L + W + pad;
        const reach = parseFloat(el.dataset.creeperSpan || '0.9');
        const ctrl = [];
        for (let y = T + H; y >= T + H * (1 - reach); y -= 90) {
          ctrl.push({ x: x + (rng() - 0.5) * 8, y });
        }
        if (ctrl.length < 2) return;
        const base = resample(catmullRom(ctrl, 20), STEP);
        const phase = rng() * TAU;
        [0, 1].forEach((strand) => {
          const bp = braid(base, { amp: 5 * k, wavelength: 40, phase: phase + strand * Math.PI, step: STEP });
          vines.push(
            this.makeVine(bp, {
              id: `${idBase}-${strand}`,
              mode: 'latch',
              triggerY: T + H * 0.5,
              rng: mulberry32(seed + ai * 41 + strand),
              leafEvery: strand === 0 ? 28 : 56,
              leafSize: [11 * k, 21 * k],
              outer: side === 'left' ? -1 : 1,
              outerBias: 0.72,
              tendrilEvery: strand === 0 ? 130 : 0,
              flowerEvery: strand === 0 ? 260 : 0,
              width: (strand === 0 ? 2.3 : 1.4) * k,
              color: strand === 0 ? STEM_COLOR : STEM_YOUNG,
            })
          );
        });
        return;
      }

      if (type === 'seeker') {
        // data-seekers="fx,fy,angleDeg,length; ..." — root as a fraction of the element box
        const specs = (el.dataset.seekers || '0,1,-60,320').split(';');
        specs.forEach((spec, si) => {
          const [fx, fy, deg, len] = spec.split(',').map((v) => parseFloat(v));
          seekers.push(
            new Seeker({
              id: `${idBase}-${si}`,
              x: L + W * fx,
              y: T + H * fy,
              angle: (deg * Math.PI) / 180,
              length: (len || 320) * (isMobile ? 0.6 : k),
              scale: isMobile ? 0.7 : k,
              rng: mulberry32(seed + ai * 101 + si * 7),
            })
          );
        });
        return;
      }

      if (type === 'hang') {
        const count = parseInt(el.dataset.creeperCount || String(Math.max(3, Math.round(W / 150))), 10);
        for (let h = 0; h < count; h++) {
          const x = L + W * ((h + 0.3 + rng() * 0.4) / count);
          const len = (60 + rng() * 150) * (isMobile ? 0.7 : 1);
          vines.push(this.makeHanging(x, T - 2, len, `${idBase}-${h}`, seed + ai * 13 + h, T - 60));
        }
      }
    });

    // carry growth over (rebuilds after images load shouldn't regrow)
    vines.forEach((v) => {
      if (this.grownMemory.has(v.id)) v.grown = Math.min(v.total, this.grownMemory.get(v.id));
      if (this.reducedMotion) v.grown = v.total;
    });
    seekers.forEach((sk) => {
      if (this.grownMemory.has(sk.id)) sk.grown = Math.min(sk.n, this.grownMemory.get(sk.id));
    });
    this.vines = vines;
    this.seekers = seekers;
  }

  makeHanging(x, y, len, id, seed, triggerY) {
    const rng = mulberry32(seed);
    const k = this.scale;
    const ctrl = [
      { x, y },
      { x: x + (rng() - 0.5) * 14, y: y + len * 0.4 },
      { x: x + (rng() - 0.5) * 22, y: y + len * 0.75 },
      { x: x + (rng() - 0.5) * 16, y: y + len },
    ];
    const base = resample(catmullRom(ctrl, 14), STEP);
    const pts = braid(base, { amp: 2.5 * k, wavelength: 26, phase: rng() * TAU, step: STEP });
    return this.makeVine(pts, {
      id,
      mode: 'latch',
      triggerY,
      rng,
      leafEvery: 22,
      leafSize: [9 * k, 18 * k],
      outer: 1,
      outerBias: 0.5,
      tendrilEvery: 0,
      flowerEvery: rng() > 0.6 ? 90 : 0,
      width: 1.5 * k,
      color: STEM_YOUNG,
      free: true,
      delay: 10 + Math.floor(rng() * 40),
    });
  }

  makeVine(pts, o) {
    const n = pts.length;
    const ox = new Float32Array(n);
    const oy = new Float32Array(n);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < n; i++) {
      ox[i] = pts[i].x;
      oy[i] = pts[i].y;
      if (ox[i] < minX) minX = ox[i];
      if (ox[i] > maxX) maxX = ox[i];
      if (oy[i] < minY) minY = oy[i];
      if (oy[i] > maxY) maxY = oy[i];
    }
    const pad = 46;
    const rng = o.rng;
    const total = (n - 1) * STEP;

    const leaves = [];
    let side = rng() > 0.5 ? 1 : -1;
    for (let s = 10 + rng() * o.leafEvery; s < total - 4; s += o.leafEvery * (0.65 + rng() * 0.7)) {
      side = rng() < o.outerBias ? o.outer : -o.outer;
      const size = lerp(o.leafSize[0], o.leafSize[1], Math.pow(rng(), 1.4));
      leaves.push({
        i: Math.round(s / STEP),
        side,
        size,
        w: 0.82 + rng() * 0.22,
        spread: 0.55 + rng() * 0.7,
        tone: LEAF_TONES[Math.floor(rng() * LEAF_TONES.length)],
        phase: rng() * TAU,
        petiole: 0.22 + rng() * 0.2,
        a: 0,
        av: 0,
      });
      // occasionally pair a second leaf at the same node
      if (rng() > 0.78) {
        leaves.push({
          ...leaves[leaves.length - 1],
          side: -side,
          size: size * 0.72,
          spread: 0.5 + rng() * 0.6,
          phase: rng() * TAU,
          tone: LEAF_TONES[Math.floor(rng() * LEAF_TONES.length)],
        });
      }
    }

    const tendrils = [];
    if (o.tendrilEvery) {
      for (let s = o.tendrilEvery * (0.5 + rng()); s < total - 20; s += o.tendrilEvery * (0.7 + rng() * 0.6)) {
        tendrils.push({
          i: Math.round(s / STEP),
          side: rng() > 0.5 ? 1 : -1,
          len: (22 + rng() * 26) * this.scale,
          curl: 5 + rng() * 4,
          reach: 0,
        });
      }
    }

    const flowers = [];
    if (o.flowerEvery) {
      for (let s = o.flowerEvery * (0.4 + rng()); s < total - 30; s += o.flowerEvery * (0.6 + rng() * 0.8)) {
        flowers.push({ i: Math.round(s / STEP), side: rng() > 0.5 ? 1 : -1, size: (2 + rng() * 1.3) * this.scale });
      }
    }

    return {
      id: o.id,
      mode: o.mode,
      triggerY: o.triggerY ?? minY,
      delay: o.delay || 0,
      wait: 0,
      n,
      ox,
      oy,
      dx: new Float32Array(n),
      dy: new Float32Array(n),
      vx: new Float32Array(n),
      vy: new Float32Array(n),
      cx: new Float32Array(n),
      cy: new Float32Array(n),
      total,
      minX: minX - pad,
      maxX: maxX + pad,
      minY: minY - pad,
      maxY: maxY + pad,
      leaves,
      tendrils,
      flowers,
      grown: 0,
      width: o.width,
      color: o.color,
      free: !!o.free,
      phase: rng() * TAU,
    };
  }

  // ---------- particles ----------
  spawnParticle(x, y, vx, vy, size, tone) {
    if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
    this.particles.push({
      x,
      y,
      vx,
      vy,
      size,
      rot: Math.random() * TAU,
      vr: (Math.random() - 0.5) * 0.12,
      tone: tone || LEAF_TONES[Math.floor(Math.random() * LEAF_TONES.length)],
      phase: Math.random() * TAU,
      life: 1,
    });
  }

  // ---------- frame ----------
  tick(now) {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    // normalise to 60fps steps so growth & springs feel the same at any refresh rate
    const dt = this.lastTime ? now - this.lastTime : 16.67;
    this.lastTime = now;
    this.k = clamp(dt / 16.67, 0.5, 4);
    this.frame(now);
  }

  frame(t) {
    const { ctx, dpr, vw, vh, paths } = this;
    const k = this.k || 1;
    const damp = Math.pow(0.76, k);
    const leafDamp = Math.pow(0.86, k);
    const sy = window.scrollY;
    const scrollDelta = sy - this.lastScroll;
    this.lastScroll = sy;
    this.wind = lerp(this.wind, clamp(Math.abs(scrollDelta) / (38 * k), 0, 1), Math.min(1, 0.08 * k));
    const swayBase = this.reducedMotion ? 0 : 1;

    const p = this.pointer;
    p.vx = lerp(p.vx, p.px < -9000 ? 0 : p.x - p.px, 0.5);
    p.vy = lerp(p.vy, p.py < -9000 ? 0 : p.y - p.py, 0.5);
    p.px = p.x;
    p.py = p.y;
    const pActive = p.active;
    const mx = p.x;
    const my = p.y + sy;
    const mSpeed = Math.hypot(p.vx, p.vy);

    const bandTop = sy - 120;
    const bandBot = sy + vh + 120;
    const revealY = sy + vh * 0.9;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const R = POINTER_RADIUS;
    const R2 = R * R;

    for (let vi = 0; vi < this.vines.length; vi++) {
      const v = this.vines[vi];

      // --- growth ---
      if (!this.reducedMotion) {
        if (v.mode === 'scrub') {
          // binary search for the last point above the reveal line
          let lo = 0;
          let hi = v.n - 1;
          while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (v.oy[mid] <= revealY) lo = mid;
            else hi = mid - 1;
          }
          const target = lo * STEP;
          const gap = target - v.grown;
          if (gap > 0) v.grown += Math.min(gap, Math.max(16, gap * 0.08) * k);
          else v.grown += Math.max(gap, -60 * k);
        } else if (revealY > v.triggerY && v.grown < v.total) {
          if (v.wait < v.delay) v.wait += k;
          else v.grown = Math.min(v.total, v.grown + Math.max(3.4, (v.total - v.grown) * 0.022) * k);
        }
      }

      if (v.grown <= 0) continue;
      if (v.maxY < bandTop || v.minY > bandBot) continue;

      const gi = Math.min(v.n - 1, Math.floor(v.grown / STEP));
      const { ox, oy, dx, dy, vx, vy, cx, cy } = v;

      // --- stem physics + current positions ---
      const swayAmp = swayBase * (0.5 + this.wind * 2.6);
      const pushK = v.free ? 30 : 22;
      for (let i = 0; i <= gi; i++) {
        const y0 = oy[i];
        if (y0 < bandTop - 40 || y0 > bandBot + 40) {
          cx[i] = ox[i];
          cy[i] = y0;
          continue;
        }
        let tx = 0;
        let ty = 0;
        if (pActive) {
          const ddx = ox[i] - mx;
          const ddy = y0 - my;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            const along = v.free ? Math.min(1, (i * STEP) / 60) : 1;
            const push = f * f * pushK * along;
            tx = (ddx / d) * push;
            ty = (ddy / d) * push;
          }
        }
        if (tx !== 0 || ty !== 0 || dx[i] !== 0 || vx[i] !== 0 || dy[i] !== 0 || vy[i] !== 0) {
          vx[i] = (vx[i] + (tx - dx[i]) * 0.14 * k) * damp;
          vy[i] = (vy[i] + (ty - dy[i]) * 0.14 * k) * damp;
          dx[i] += vx[i] * k;
          dy[i] += vy[i] * k;
          if (Math.abs(dx[i]) + Math.abs(vx[i]) + Math.abs(dy[i]) + Math.abs(vy[i]) < 0.02) {
            dx[i] = dy[i] = vx[i] = vy[i] = 0;
          }
        }
        const freeAmp = v.free ? (i * STEP) / 26 : 1;
        const sw = swayAmp * freeAmp;
        cx[i] = ox[i] + dx[i] + Math.sin(t * 0.0011 + i * 0.045 + v.phase) * sw;
        cy[i] = y0 + dy[i] + Math.cos(t * 0.0008 + i * 0.03 + v.phase) * sw * 0.35;
      }

      // --- stem ---
      ctx.setTransform(dpr, 0, 0, dpr, 0, -sy * dpr);
      ctx.strokeStyle = v.color;
      const chunk = 6;
      for (let i0 = 0; i0 < gi; i0 += chunk) {
        const i1 = Math.min(gi, i0 + chunk);
        if (oy[i0] < bandTop - 40 && oy[i1] < bandTop - 40) continue;
        if (oy[i0] > bandBot + 40 && oy[i1] > bandBot + 40) continue;
        const u = i0 / v.n;
        let w = v.width * (1 - 0.5 * u);
        const toTip = v.grown - i0 * STEP;
        if (toTip < 70) w *= 0.3 + 0.7 * (toTip / 70);
        ctx.lineWidth = Math.max(0.5, w);
        ctx.beginPath();
        ctx.moveTo(cx[i0], cy[i0]);
        for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(cx[i], cy[i]);
        ctx.stroke();
      }

      // --- tendrils ---
      if (v.tendrils.length) {
        ctx.strokeStyle = TENDRIL_COLOR;
        ctx.lineWidth = 0.95 * this.scale + 0.25;
        ctx.beginPath();
        for (let ti = 0; ti < v.tendrils.length; ti++) {
          const td = v.tendrils[ti];
          if (td.i > gi) break;
          const g = clamp((v.grown - td.i * STEP) / 90, 0, 1);
          const bx = cx[td.i];
          const by = cy[td.i];
          if (by < bandTop || by > bandBot) continue;
          const i0 = Math.max(0, td.i - 1);
          const i1 = Math.min(v.n - 1, td.i + 1);
          let ang = Math.atan2(cy[i1] - cy[i0], cx[i1] - cx[i0]) + td.side * 0.95;
          let target = 0;
          let mAng = 0;
          if (pActive) {
            const ddx = mx - bx;
            const ddy = my - by;
            const d = Math.hypot(ddx, ddy);
            if (d < 190) {
              target = 1 - Math.max(0, d - 40) / 150;
              mAng = Math.atan2(ddy, ddx);
            }
          }
          td.reach += (target - td.reach) * Math.min(1, 0.06 * k);
          if (td.reach > 0.01) ang = lerpAngle(ang, mAng, td.reach * 0.9);
          const L = td.len * g * (1 + 0.75 * td.reach);
          const curl = td.curl * (1 - 0.82 * td.reach);
          const segs = 16;
          const stepL = L / segs;
          let x = bx;
          let y = by;
          ctx.moveTo(x, y);
          for (let k = 1; k <= segs; k++) {
            const q = k / segs;
            ang += td.side * curl * q * q * 0.11 + Math.sin(t * 0.004 + k * 0.7) * 0.03 * td.reach;
            x += Math.cos(ang) * stepL;
            y += Math.sin(ang) * stepL;
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // --- leaves ---
      const leafSway = swayBase * (0.05 + this.wind * 0.32);
      ctx.strokeStyle = 'rgba(31, 94, 70, 0.9)';
      for (let li = 0; li < v.leaves.length; li++) {
        const lf = v.leaves[li];
        if (lf.i > gi) break;
        const bx = cx[lf.i];
        const by = cy[lf.i];
        if (by < bandTop || by > bandBot) continue;
        const g = clamp((v.grown - lf.i * STEP) / 70, 0, 1);
        if (g <= 0) continue;
        const i0 = Math.max(0, lf.i - 1);
        const i1 = Math.min(v.n - 1, lf.i + 1);
        const tangent = Math.atan2(cy[i1] - cy[i0], cx[i1] - cx[i0]);
        const open = Math.min(1, g * 1.4);
        let ang = tangent + lf.side * lf.spread * open;
        let dirX = Math.cos(ang);
        let dirY = Math.sin(ang);
        const S = lf.size * easeOutBack(g);
        const pl = lf.size * lf.petiole;

        // physics: leaves bend away from the pointer and catch swipes
        const lcx = bx + dirX * (pl + S * 0.55);
        const lcy = by + dirY * (pl + S * 0.55);
        let target = 0;
        if (pActive) {
          const ddx = mx - lcx;
          const ddy = my - lcy;
          const RL = 52 + lf.size * 1.9;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < RL * RL) {
            const d = Math.sqrt(d2);
            const f = 1 - d / RL;
            const cross = dirX * ddy - dirY * ddx;
            target = -Math.sign(cross) * f * 1.4;
            const perp = p.vx * -dirY + p.vy * dirX;
            lf.av += perp * 0.0042 * f;
            if (!this.reducedMotion && mSpeed > 16 && f > 0.35 && Math.random() < 0.02) {
              this.spawnParticle(lcx, lcy - sy, p.vx * 0.12, p.vy * 0.08 - 0.4, lf.size * 0.8, lf.tone);
            }
          }
        }
        if (target !== 0 || lf.a !== 0 || lf.av !== 0) {
          lf.av = (lf.av + (target - lf.a) * 0.07 * k) * leafDamp;
          lf.a += lf.av * k;
          if (target === 0 && Math.abs(lf.a) < 0.001 && Math.abs(lf.av) < 0.001) lf.a = lf.av = 0;
        }

        ang += lf.a + Math.sin(t * 0.0014 + lf.phase) * leafSway;
        dirX = Math.cos(ang);
        dirY = Math.sin(ang);

        // petiole
        ctx.setTransform(dpr, 0, 0, dpr, 0, -sy * dpr);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        const lx = bx + dirX * pl * g;
        const ly = by + dirY * pl * g;
        ctx.lineTo(lx, ly);
        ctx.stroke();

        // leaf body
        const sw = S * lf.w;
        ctx.setTransform(dpr * S * dirX, dpr * S * dirY, -dpr * sw * dirY, dpr * sw * dirX, dpr * lx, dpr * (ly - sy));
        ctx.fillStyle = lf.tone.dark;
        ctx.fill(paths.full);
        ctx.fillStyle = lf.tone.light;
        ctx.fill(paths.half);
        const disturbed = Math.min(1, Math.abs(lf.a) * 1.5 + Math.abs(lf.av) * 5);
        if (disturbed > 0.02) {
          ctx.globalAlpha = disturbed * 0.85;
          ctx.fillStyle = lf.tone.flip;
          ctx.fill(paths.half);
          ctx.globalAlpha = 1;
        }
        ctx.lineWidth = 0.045;
        ctx.strokeStyle = 'rgba(251, 248, 241, 0.42)';
        ctx.stroke(paths.rib);
        ctx.strokeStyle = 'rgba(31, 94, 70, 0.9)';
      }

      // --- tiny jasmine flowers ---
      if (v.flowers.length) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, -sy * dpr);
        for (let fi = 0; fi < v.flowers.length; fi++) {
          const fl = v.flowers[fi];
          if (fl.i > gi) break;
          const g = clamp((v.grown - fl.i * STEP - 90) / 60, 0, 1);
          if (g <= 0) continue;
          const i0 = Math.max(0, fl.i - 1);
          const i1 = Math.min(v.n - 1, fl.i + 1);
          const tangent = Math.atan2(cy[i1] - cy[i0], cx[i1] - cx[i0]) + fl.side * Math.PI * 0.5;
          const fx = cx[fl.i] + Math.cos(tangent) * 7 * this.scale;
          const fy = cy[fl.i] + Math.sin(tangent) * 7 * this.scale;
          if (fy < bandTop || fy > bandBot) continue;
          const r = fl.size * easeOutBack(g);
          ctx.fillStyle = '#FBF8F1';
          ctx.strokeStyle = 'rgba(95, 114, 104, 0.55)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * TAU + t * 0.0002 + fl.i;
            ctx.moveTo(fx + Math.cos(a) * r * 1.2 + r * 0.9, fy + Math.sin(a) * r * 1.2);
            ctx.arc(fx + Math.cos(a) * r * 1.2, fy + Math.sin(a) * r * 1.2, r * 0.9, 0, TAU);
          }
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#CDB77E';
          ctx.beginPath();
          ctx.arc(fx, fy, r * 0.55, 0, TAU);
          ctx.fill();
        }
      }
    }

    // --- seekers ---
    if (this.seekers.length) {
      const ptr = { active: pActive, x: mx, y: my, vx: p.vx, vy: p.vy };
      const seekerSway = swayBase * (0.05 + this.wind * 0.3);
      for (let si = 0; si < this.seekers.length; si++) {
        const sk = this.seekers[si];
        if (sk.maxY < bandTop || sk.minY > bandBot) continue;
        sk.update(t, k, ptr, revealY, this.reducedMotion);
        sk.draw(ctx, dpr, sy, t, paths, seekerSway);
      }
    }

    // --- falling leaves (screen space) ---
    if (this.particles.length) {
      const next = [];
      for (let i = 0; i < this.particles.length; i++) {
        const q = this.particles[i];
        q.vy = Math.min(q.vy + 0.035 * k, 1.45);
        q.vx *= Math.pow(0.985, k);
        q.x += (q.vx + Math.sin(t * 0.0028 + q.phase) * 0.75) * k;
        q.y += q.vy * k;
        q.rot += (q.vr + Math.sin(t * 0.002 + q.phase) * 0.012) * k;
        q.life -= 0.0042 * k;
        if (q.life <= 0 || q.y > vh + 40) continue;
        next.push(q);
        const S = q.size;
        const c = Math.cos(q.rot);
        const s = Math.sin(q.rot);
        // fake 3D tumble by squashing the width over time
        const squash = 0.35 + Math.abs(Math.sin(t * 0.003 + q.phase)) * 0.65;
        ctx.globalAlpha = Math.min(1, q.life * 3);
        ctx.setTransform(dpr * S * c, dpr * S * s, -dpr * S * squash * s, dpr * S * squash * c, dpr * q.x, dpr * q.y);
        ctx.fillStyle = q.tone.dark;
        ctx.fill(paths.full);
        ctx.fillStyle = q.tone.light;
        ctx.fill(paths.half);
      }
      ctx.globalAlpha = 1;
      this.particles = next;
    }
  }
}
