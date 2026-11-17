// Pure geometry for a landscape. No colours here — the same scene can be
// painted at dawn, by day, at dusk or at night.
import { clamp, hashString, lerp, makeNoise, mulberry32, smoothstep } from "./noise";

const f1 = (n) => Math.round(n * 10) / 10;

function ridgePath(points, W, H) {
  const pad = W * 0.04;
  let d = `M${-pad} ${H + 40} L${-pad} ${f1(points[0][1])}`;
  for (const [x, y] of points) d += ` L${f1(x)} ${f1(y)}`;
  return `${d} L${f1(W + pad)} ${f1(points[points.length - 1][1])} L${f1(W + pad)} ${H + 40} Z`;
}

function catmullRom(points) {
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    segs.push(`M${f1(p1[0])} ${f1(p1[1])} C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`);
  }
  return segs;
}

export function makeScene({
  seed = "0",
  terrain = "alpine",
  W = 1600,
  H = 900,
  horizon = 0.52,
  waypoints = 0,
  detail = 1,
  treeZone = [0, 1],
}) {
  const rand = mulberry32(hashString(`${seed}:${terrain}`));
  const { fbm } = makeNoise(rand);
  const r = (a, b) => a + rand() * (b - a);
  const hz = H * horizon;
  const coastal = terrain === "coastal";
  const LAYERS = 5;
  const step = W / Math.round(140 * Math.max(0.5, detail));

  // Ridge lines, far → near.
  const ridges = [];
  for (let i = 0; i < LAYERS; i++) {
    const d = i / (LAYERS - 1);
    const off = r(0, 400);
    const freq = coastal ? 1.3 + d * 1.6 : 2.0 + d * 1.8;
    const base = coastal
      ? i === 0
        ? hz
        : hz + (H - hz) * (0.22 + 0.72 * Math.pow((i - 1) / (LAYERS - 2), 1.15))
      : hz + (H - hz) * (0.02 + 0.8 * Math.pow(d, 1.3));
    const amp = coastal ? H * (i === 0 ? 0.12 : 0.05 + 0.03 * (1 - d)) : H * (0.24 * (1 - d) + 0.045);
    const tilt = r(-1, 1) * H * 0.04 * d;
    const pts = [];
    for (let x = 0; x <= W + 0.1; x += step) {
      const u = x / W;
      let n = fbm(u * freq + off, 5);
      if (!coastal && i < 2) n = Math.pow(1 - Math.abs(2 * n - 1), 1.6); // ridged peaks
      let y = base - amp * n + tilt * (u - 0.5) * 2;
      if (coastal && i === 0) {
        // A headland on the right that slopes down into the sea.
        const land = smoothstep(0.36, 0.6, u);
        y = hz - (amp * n + H * 0.012) * land;
      }
      pts.push([x, y]);
    }
    ridges.push({ d: ridgePath(pts, W, H), pts, depth: d });
  }

  const ridgeY = (i, x) => {
    const pts = ridges[i].pts;
    const k = clamp(Math.floor(x / step), 0, pts.length - 2);
    const t = (x - pts[k][0]) / step;
    return lerp(pts[k][1], pts[k + 1][1], clamp(t, 0, 1));
  };

  // Trees along the middle ridge.
  const trees = [];
  const treeLayer = 2;
  const treeCount = Math.round((coastal ? 14 : 34) * detail);
  for (let k = 0; k < treeCount; k++) {
    const cluster = r(0, 1) < 0.6;
    const u = cluster ? 0.08 + 0.18 * Math.floor(r(0, 5)) + r(-0.025, 0.025) : r(0, 1);
    if (u < treeZone[0] || u > treeZone[1]) continue;
    const x = u * W;
    const y = ridgeY(treeLayer, x) + r(2, 14);
    const s = r(0.7, 1.3) * H * (coastal ? 0.022 : 0.03);
    trees.push(
      coastal
        ? { x: f1(x), y: f1(y), s: f1(s), kind: "round" }
        : { x: f1(x), y: f1(y), s: f1(s), kind: "pine" }
    );
  }

  // Clouds: clusters of soft ellipses.
  const clouds = [];
  const cloudCount = Math.round(r(4, 7) * Math.min(1, detail + 0.2));
  for (let k = 0; k < cloudCount; k++) {
    const cx = r(-0.05, 1.05) * W;
    const cy = r(0.06, 0.8) * hz * 0.6;
    const w = r(0.1, 0.24) * W;
    const puffs = [];
    const n = Math.round(r(4, 7));
    for (let p = 0; p < n; p++) {
      puffs.push({
        x: f1(cx + r(-0.5, 0.5) * w),
        y: f1(cy + r(-0.18, 0.12) * w * 0.35),
        rx: f1(r(0.18, 0.4) * w),
        ry: f1(r(0.06, 0.13) * w),
      });
    }
    clouds.push({ puffs, shade: { x: f1(cx), y: f1(cy + w * 0.06), rx: f1(w * 0.45), ry: f1(w * 0.05) }, speed: r(0.6, 1.4) });
  }

  // Stars.
  const stars = [];
  for (let k = 0; k < Math.round(160 * detail); k++) {
    stars.push({ x: f1(r(0, W)), y: f1(r(0, hz * 0.95) * r(0.3, 1)), r: f1(r(0.5, 1.7)), o: f1(r(0.3, 1)), tw: rand() < 0.08 });
  }

  // Birds.
  const birds = [];
  const flockX = r(0.5, 0.68) * W;
  const flockY = r(0.3, 0.45) * hz;
  for (let k = 0; k < 5; k++) {
    birds.push({ x: f1(flockX + r(-90, 90)), y: f1(flockY + r(-30, 30)), s: f1(r(5, 10) * (H / 900)) });
  }

  // Grass strokes and colour dabs in the foreground.
  const grass = [];
  const dabs = [];
  const last = LAYERS - 1;
  for (let k = 0; k < Math.round(150 * detail); k++) {
    const x = r(0, W);
    const top = ridgeY(last, x);
    const y = top + Math.pow(r(0, 1), 1.6) * (H - top);
    const h = r(8, 26) * (0.6 + (y - top) / Math.max(1, H - top)) * (H / 900);
    const lean = r(-0.6, 0.6) * h;
    grass.push(`M${f1(x)} ${f1(y)} q${f1(lean * 0.3)} ${f1(-h * 0.6)} ${f1(lean)} ${f1(-h)}`);
  }
  for (let k = 0; k < Math.round(40 * detail); k++) {
    const x = r(0, W);
    const top = ridgeY(last - 1, x);
    const y = top + r(0.1, 1) * (H - top);
    dabs.push({ x: f1(x), y: f1(y), r: f1(r(1.5, 4) * (H / 900)), c: Math.floor(r(0, 3)) });
  }

  // Shimmer on water, under the light.
  const shimmer = [];
  if (coastal) {
    for (let k = 0; k < Math.round(60 * detail); k++) {
      const y = hz + Math.pow(r(0, 1), 1.5) * (H - hz) * 0.5;
      const spread = 30 + (y - hz) * 0.9;
      shimmer.push({ y: f1(y), dx: f1(r(-1, 1) * spread), w: f1(r(10, 50) * (0.5 + (y - hz) / H)) });
    }
  }

  // The road: from below the frame, through each waypoint, to a summit.
  let road = null;
  if (waypoints > 0) {
    const phase = r(0, Math.PI * 2);
    const endX = coastal ? r(0.68, 0.76) : r(0.58, 0.7);
    const pts = [[W * (coastal ? 0.38 : 0.3), H + 30]];
    for (let k = 0; k <= waypoints; k++) {
      const t = (k + 0.55) / (waypoints + 0.6);
      const y = H * 0.9 - Math.pow(t, 0.82) * (H * 0.9 - (hz + H * 0.05));
      const startX = coastal ? 0.44 : 0.42;
      const wobble = (coastal ? 0.12 : 0.24) * (1 - 0.7 * t) * Math.sin(phase + t * Math.PI * 2.3);
      const x = W * (lerp(startX, endX, t) + wobble);
      pts.push([clamp(x, W * 0.08, W * 0.92), y]);
    }
    const segs = catmullRom(pts);
    road = {
      segments: segs.map((d, i) => ({ d, t: i / segs.length })),
      waypoints: pts.slice(1, waypoints + 1).map(([x, y], i) => ({ x: f1(x), y: f1(y), t: (i + 1) / segs.length })),
      summit: { x: f1(pts[pts.length - 1][0]), y: f1(pts[pts.length - 1][1]) },
    };
  }

  return { W, H, hz, coastal, ridges, trees, clouds, stars, birds, grass, dabs, shimmer, road };
}
