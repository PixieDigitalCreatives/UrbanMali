// ==========================================
// SEEKER CREEPER
// A free-growing shoot rooted on an element edge. At rest it arcs and
// sways; when the pointer comes within reach its tip stretches toward it
// and circles the cursor, as if the plant were curious. Solved with a
// FABRIK chain blended against the resting curve so it stays organic.
// ==========================================

import { TAU, clamp, lerp, easeOutBack, LEAF_TONES } from './geometry';

export class Seeker {
  constructor({ id, x, y, angle, length, scale, rng }) {
    this.id = id;
    this.scale = scale;
    this.seg = Math.max(5, 7 * scale);
    this.n = Math.max(12, Math.round(length / this.seg));
    this.rootX = x;
    this.rootY = y;
    this.angle = angle;
    this.curl = (rng() > 0.5 ? 1 : -1) * (0.012 + rng() * 0.014);
    this.phase = rng() * TAU;
    this.grown = 0;
    this.engage = 0;
    this.orbit = rng() * TAU;

    const n = this.n;
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
    this.rx = new Float32Array(n);
    this.ry = new Float32Array(n);
    this.sx = new Float32Array(n);
    this.sy = new Float32Array(n);
    this.restPose(0);
    this.px.set(this.rx);
    this.py.set(this.ry);

    this.leaves = [];
    let side = 1;
    for (let i = 3; i < n - 2; i += 2 + Math.floor(rng() * 2)) {
      side = -side;
      this.leaves.push({
        i,
        side,
        size: lerp(10, 22, Math.pow(rng(), 1.3)) * scale * (1 - (i / n) * 0.35),
        w: 0.82 + rng() * 0.22,
        spread: 0.6 + rng() * 0.6,
        tone: LEAF_TONES[Math.floor(rng() * LEAF_TONES.length)],
        phase: rng() * TAU,
        a: 0,
        av: 0,
      });
    }
    this.minY = y - length * 1.4;
    this.maxY = y + length * 1.4;
  }

  restPose(t) {
    const { n, seg, rx, ry } = this;
    let ang = this.angle;
    let x = this.rootX;
    let y = this.rootY;
    rx[0] = x;
    ry[0] = y;
    for (let i = 1; i < n; i++) {
      const u = i / n;
      ang += this.curl * (1 + u * 2.2) + Math.sin(t * 0.0009 + i * 0.16 + this.phase) * 0.012 * u;
      x += Math.cos(ang) * seg;
      y += Math.sin(ang) * seg;
      rx[i] = x;
      ry[i] = y;
    }
  }

  update(t, k, pointer, revealY, reduced) {
    const { n, seg, px, py, rx, ry, sx, sy } = this;

    if (reduced) this.grown = n;
    else if (revealY > this.rootY - 60 && this.grown < n) {
      this.grown = Math.min(n, this.grown + Math.max(0.35, (n - this.grown) * 0.035) * k);
    }
    const g = Math.max(1, Math.min(n - 1, Math.floor(this.grown)));

    this.restPose(reduced ? 0 : t);

    // engagement rises while the pointer is within reach of the root
    let target = 0;
    if (pointer.active) {
      const d = Math.hypot(pointer.x - this.rootX, pointer.y - this.rootY);
      if (d < seg * g * 1.45) target = 1;
    }
    this.engage += (target - this.engage) * Math.min(1, 0.05 * k);

    if (this.engage > 0.005) {
      // tip circles the cursor instead of stabbing it
      this.orbit += 0.05 * k;
      const r = 16 * this.scale + 8;
      const tx = pointer.x + Math.cos(this.orbit) * r;
      const ty = pointer.y + Math.sin(this.orbit) * r * 0.8;
      sx.set(rx);
      sy.set(ry);
      for (let iter = 0; iter < 3; iter++) {
        sx[g] = tx;
        sy[g] = ty;
        for (let i = g - 1; i >= 0; i--) {
          const dx = sx[i] - sx[i + 1];
          const dy = sy[i] - sy[i + 1];
          const l = Math.hypot(dx, dy) || 1;
          sx[i] = sx[i + 1] + (dx / l) * seg;
          sy[i] = sy[i + 1] + (dy / l) * seg;
        }
        sx[0] = this.rootX;
        sy[0] = this.rootY;
        for (let i = 1; i <= g; i++) {
          const dx = sx[i] - sx[i - 1];
          const dy = sy[i] - sy[i - 1];
          const l = Math.hypot(dx, dy) || 1;
          sx[i] = sx[i - 1] + (dx / l) * seg;
          sy[i] = sy[i - 1] + (dy / l) * seg;
        }
      }
      for (let i = 0; i <= g; i++) {
        const w = this.engage * (0.2 + 0.8 * Math.pow(i / g, 0.8));
        sx[i] = lerp(rx[i], sx[i], w);
        sy[i] = lerp(ry[i], sy[i], w);
      }
    } else {
      sx.set(rx);
      sy.set(ry);
    }

    // ease toward the desired pose, then re-impose segment lengths from the root
    const follow = Math.min(1, 0.17 * k);
    px[0] = this.rootX;
    py[0] = this.rootY;
    for (let i = 1; i < n; i++) {
      const tx = i <= g ? sx[i] : sx[g];
      const ty = i <= g ? sy[i] : sy[g];
      px[i] += (tx - px[i]) * follow;
      py[i] += (ty - py[i]) * follow;
      const dx = px[i] - px[i - 1];
      const dy = py[i] - py[i - 1];
      const l = Math.hypot(dx, dy) || 1;
      px[i] = px[i - 1] + (dx / l) * seg;
      py[i] = py[i - 1] + (dy / l) * seg;
    }

    // leaves shy away from the pointer and catch swipes
    for (let li = 0; li < this.leaves.length; li++) {
      const lf = this.leaves[li];
      if (lf.i > g) break;
      let tgt = 0;
      if (pointer.active) {
        const ddx = pointer.x - px[lf.i];
        const ddy = pointer.y - py[lf.i];
        const RL = 46 + lf.size * 1.8;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < RL * RL) {
          const i0 = Math.max(0, lf.i - 1);
          const i1 = Math.min(n - 1, lf.i + 1);
          const tang = Math.atan2(py[i1] - py[i0], px[i1] - px[i0]) + lf.side * lf.spread;
          const cross = Math.cos(tang) * ddy - Math.sin(tang) * ddx;
          tgt = -Math.sign(cross) * (1 - Math.sqrt(d2) / RL) * 1.3;
          lf.av += (pointer.vx * -Math.sin(tang) + pointer.vy * Math.cos(tang)) * 0.003;
        }
      }
      if (tgt !== 0 || lf.a !== 0 || lf.av !== 0) {
        lf.av = (lf.av + (tgt - lf.a) * 0.07 * k) * Math.pow(0.86, k);
        lf.a += lf.av * k;
        if (tgt === 0 && Math.abs(lf.a) < 0.001 && Math.abs(lf.av) < 0.001) lf.a = lf.av = 0;
      }
    }
  }

  draw(ctx, dpr, scrollY, t, paths, swayAmp) {
    const { n, px, py } = this;
    const g = Math.max(1, Math.min(n - 1, Math.floor(this.grown)));
    const frac = this.grown - Math.floor(this.grown);

    ctx.setTransform(dpr, 0, 0, dpr, 0, -scrollY * dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // tapered stem, woody at the root and green toward the tip
    const base = 3.2 * this.scale + 0.6;
    for (let i = 0; i < g; i++) {
      const u = i / n;
      ctx.lineWidth = Math.max(0.7, base * (1 - u * 0.75));
      ctx.strokeStyle = u < 0.45 ? 'rgba(122, 102, 52, 0.95)' : 'rgba(31, 94, 70, 0.95)';
      ctx.beginPath();
      ctx.moveTo(px[i], py[i]);
      if (i === g - 1) ctx.lineTo(lerp(px[i], px[i + 1], frac), lerp(py[i], py[i + 1], frac));
      else ctx.lineTo(px[i + 1], py[i + 1]);
      ctx.stroke();
    }

    // coiling tendril at the tip — tighter while it is reaching
    const tipI = g;
    const i0 = Math.max(0, tipI - 1);
    let ang = Math.atan2(py[tipI] - py[i0], px[tipI] - px[i0]);
    let x = px[tipI];
    let y = py[tipI];
    const coil = 0.18 + this.engage * 0.22;
    const step = (2.2 + this.scale) * clamp(this.grown / n, 0.2, 1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(74, 139, 110, 0.95)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 22; s++) {
      ang += coil * (1 + s * 0.06) + Math.sin(t * 0.003 + s) * 0.02;
      x += Math.cos(ang) * step;
      y += Math.sin(ang) * step;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // leaves
    for (let li = 0; li < this.leaves.length; li++) {
      const lf = this.leaves[li];
      if (lf.i > g) break;
      const grow = clamp(this.grown - lf.i, 0, 3) / 3;
      if (grow <= 0) continue;
      const a0 = Math.max(0, lf.i - 1);
      const a1 = Math.min(n - 1, lf.i + 1);
      const tang = Math.atan2(py[a1] - py[a0], px[a1] - px[a0]);
      const la = tang + lf.side * lf.spread * Math.min(1, grow * 1.4) + lf.a + Math.sin(t * 0.0014 + lf.phase) * swayAmp;
      const dirX = Math.cos(la);
      const dirY = Math.sin(la);
      const S = lf.size * easeOutBack(grow);
      const pl = lf.size * 0.3;
      const bx = px[lf.i];
      const by = py[lf.i];
      const lx = bx + dirX * pl;
      const ly = by + dirY * pl;

      ctx.setTransform(dpr, 0, 0, dpr, 0, -scrollY * dpr);
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = 'rgba(31, 94, 70, 0.9)';
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(lx, ly);
      ctx.stroke();

      const sw = S * lf.w;
      ctx.setTransform(dpr * S * dirX, dpr * S * dirY, -dpr * sw * dirY, dpr * sw * dirX, dpr * lx, dpr * (ly - scrollY));
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
      ctx.strokeStyle = 'rgba(251, 248, 241, 0.45)';
      ctx.stroke(paths.rib);
    }
  }
}
