// ==========================================
// CREEPER GEOMETRY
// Path building, leaf shapes and seeded randomness for the vine engine.
// All coordinates are document-space pixels.
// ==========================================

export const TAU = Math.PI * 2;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
export const lerp = (a, b, t) => a + (b - a) * t;

export function easeOutBack(t) {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Centripetal-ish Catmull-Rom through control points -> dense polyline
export function catmullRom(points, samples = 24) {
  if (points.length < 2) return points.slice();
  const out = [];
  const pts = [points[0], ...points, points[points.length - 1]];
  for (let i = 1; i < pts.length - 2; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2];
    for (let j = 0; j < samples; j++) {
      const t = j / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

// Resample a polyline to evenly spaced points
export function resample(poly, step) {
  const out = [{ x: poly[0].x, y: poly[0].y }];
  let carry = 0;
  for (let i = 1; i < poly.length; i++) {
    const a = poly[i - 1];
    const b = poly[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (seg === 0) continue;
    let d = step - carry;
    while (d <= seg) {
      const t = d / seg;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      d += step;
    }
    carry = seg - (d - step);
  }
  return out;
}

// Offset a resampled polyline perpendicular to its tangent with a wave.
// Two strands built with phases PI apart braid and interlock.
export function braid(base, { amp, wavelength, phase, drift = 0, driftPhase = 0, step = 4 }) {
  const n = base.length;
  return base.map((p, i) => {
    const a = base[Math.max(0, i - 1)];
    const b = base[Math.min(n - 1, i + 1)];
    let tx = b.x - a.x;
    let ty = b.y - a.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    // fade the wave in at the root so strands share a common origin
    const s = i * step;
    const ramp = Math.min(1, s / 70);
    const off =
      ramp * amp * Math.sin(s / wavelength + phase) +
      drift * Math.sin(s / 310 + driftPhase);
    return { x: p.x - ty * off, y: p.y + tx * off };
  });
}

// --- Leaf shapes (unit space: base at origin, tip at +x = 1) ---
// Heart-shaped pothos / money-plant leaf.
export function makeLeafPaths() {
  const full = new Path2D(
    'M0,0 C-0.13,-0.3 0.3,-0.52 0.6,-0.32 C0.82,-0.17 0.95,-0.06 1,0 C0.95,0.06 0.82,0.17 0.6,0.32 C0.3,0.52 -0.13,0.3 0,0 Z'
  );
  const half = new Path2D('M0,0 C-0.13,-0.3 0.3,-0.52 0.6,-0.32 C0.82,-0.17 0.95,-0.06 1,0 Z');
  const rib = new Path2D('M0.04,0 Q0.5,0.025 0.94,0');
  return { full, half, rib };
}

// Palette pulled from the brand tokens; leaves shift lighter when disturbed
export const LEAF_TONES = [
  { dark: '#0E3529', light: '#1F5E46', flip: '#8DB8A2' },
  { dark: '#1F5E46', light: '#2F7257', flip: '#B6994F' },
  { dark: '#2F7257', light: '#4A8B6E', flip: '#DCE8DF' },
  { dark: '#4A8B6E', light: '#8DB8A2', flip: '#E7DEC6' },
];

export const STEM_COLOR = 'rgba(122, 102, 52, 0.95)';
export const STEM_YOUNG = 'rgba(31, 94, 70, 0.95)';
export const TENDRIL_COLOR = 'rgba(74, 139, 110, 0.9)';
