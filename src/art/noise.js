// Deterministic randomness so every painting is the same on every visit.

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1-D value noise with cosine interpolation, plus fractal sum.
export function makeNoise(rand) {
  const table = Array.from({ length: 512 }, () => rand());
  const at = (i) => table[((i % 512) + 512) % 512];
  const noise = (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const t = (1 - Math.cos(f * Math.PI)) / 2;
    return at(i) * (1 - t) + at(i + 1) * t;
  };
  const fbm = (x, octaves = 4) => {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += amp * noise(x * freq + o * 37.1);
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return sum / norm;
  };
  return { noise, fbm };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
