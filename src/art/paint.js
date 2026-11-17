// Paints a scene into standalone SVG documents (one per layer). Each layer
// is shown as an <img>, so the browser rasterises it once and can then move
// or composite it cheaply — no live filters re-running on every frame.
import { lerp } from "./noise";

const n = (v) => Math.round(v * 10) / 10;

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const m = (s) => Math.round(lerp(ch(pa, s), ch(pb, s), t));
  return `#${((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1)}`;
}

const doc = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;

export const toDataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function lightOf(scene, P, variant) {
  const { W, H, hz } = scene;
  const body = P.body;
  const minY = variant === "band" ? hz * 0.62 : variant === "hero" ? hz * 0.22 : 0;
  return {
    x: body.x * W,
    y: Math.min(Math.max(body.y * H, minY), hz - 6),
    r: body.r * Math.min(W, H * 1.6),
  };
}

export function paintSky(scene, P, light) {
  const { W, H, hz } = scene;
  const k = W / 1600;
  const b = P.body;
  let s = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="${n((0.55 * hz) / H * 100) / 100}" stop-color="${P.sky[1]}"/><stop offset="${n((hz / H) * 100) / 100}" stop-color="${P.sky[2]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>
<radialGradient id="bloom"><stop offset="0" stop-color="${P.bloom}" stop-opacity="0.75"/><stop offset="1" stop-color="${P.bloom}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0.25" stop-color="${b.glow}" stop-opacity="0.9"/><stop offset="1" stop-color="${b.glow}" stop-opacity="0"/></radialGradient>
</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  s += `<ellipse cx="${n(light.x)}" cy="${n(light.y)}" rx="${n(W * 0.55)}" ry="${n(H * 0.45)}" fill="url(#bloom)"/>`;
  if (P.stars) {
    s += `<g fill="#f6f0dc">`;
    for (const st of scene.stars) s += `<circle cx="${st.x}" cy="${st.y}" r="${n(st.r * k * 1.4 + 0.2)}" opacity="${st.o}"/>`;
    s += `</g>`;
  }
  s += `<circle cx="${n(light.x)}" cy="${n(light.y)}" r="${n(light.r * 5)}" fill="url(#glow)"/>`;
  s += `<circle cx="${n(light.x)}" cy="${n(light.y)}" r="${n(light.r)}" fill="${b.color}"/>`;
  if (b.kind === "moon") {
    const { x, y, r } = light;
    s += `<g fill="#c9c1a8" opacity="0.35"><circle cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.2)}" r="${n(r * 0.22)}"/><circle cx="${n(x + r * 0.35)}" cy="${n(y + r * 0.25)}" r="${n(r * 0.16)}"/><circle cx="${n(x + r * 0.05)}" cy="${n(y + r * 0.45)}" r="${n(r * 0.1)}"/></g>`;
  } else {
    s += `<g fill="none" stroke="${P.ink}" stroke-opacity="0.55" stroke-width="${n(1.6 * k + 0.6)}" stroke-linecap="round">`;
    for (const bd of scene.birds) {
      const z = bd.s;
      s += `<path d="M${n(bd.x - z)} ${n(bd.y - z * 0.4)} q${n(z * 0.5)} ${n(z * 0.1)} ${n(z)} ${n(z * 0.4)} q${n(z * 0.5)} ${n(-z * 0.3)} ${n(z)} ${n(-z * 0.4)}"/>`;
    }
    s += `</g>`;
  }
  return doc(W, H, s);
}

export function paintClouds(scene, P) {
  const { W, H } = scene;
  const k = W / 1600;
  let s = `<defs><filter id="c" x="-20%" y="-50%" width="140%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.02" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${n(46 * k + 6)}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="${n(3 * k + 0.6)}"/></filter></defs>`;
  s += `<g filter="url(#c)" opacity="${P.cloudOpacity}">`;
  for (const c of scene.clouds) {
    s += `<ellipse cx="${c.shade.x}" cy="${c.shade.y}" rx="${c.shade.rx}" ry="${c.shade.ry}" fill="${P.cloudShade}" opacity="0.55"/>`;
    for (const p of c.puffs) s += `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx}" ry="${p.ry}" fill="${P.cloud}"/>`;
  }
  s += `</g>`;
  return doc(W, H, s);
}

export function paintLand(scene, P, light, waypoints) {
  const { W, H, hz } = scene;
  const k = W / 1600;
  let defs = `<filter id="paint" x="-2%" y="-5%" width="104%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.007 0.02" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${n(14 * k + 3)}" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${n(5 * k + 1.5)}" xChannelSelector="R" yChannelSelector="G"/></filter>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sea[0]}"/><stop offset="1" stop-color="${P.sea[1]}"/></linearGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.haze}" stop-opacity="0"/><stop offset="0.5" stop-color="${P.haze}" stop-opacity="0.55"/><stop offset="1" stop-color="${P.haze}" stop-opacity="0"/></linearGradient>`;
  scene.ridges.forEach((rg, i) => {
    defs += `<linearGradient id="l${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(P.land[i], P.haze, 0.35 * (1 - rg.depth))}"/><stop offset="0.6" stop-color="${P.land[i]}"/><stop offset="1" stop-color="${mix(P.land[i], "#000000", 0.18)}"/></linearGradient>`;
  });

  const ridge = (i) => {
    let r = `<path d="${scene.ridges[i].d}" fill="url(#l${i})"/>`;
    if (i === 2) {
      for (const t of scene.trees) {
        r +=
          t.kind === "pine"
            ? `<path d="M${t.x} ${n(t.y - t.s * 2.4)} L${n(t.x + t.s * 0.55)} ${t.y} L${n(t.x - t.s * 0.55)} ${t.y} Z" fill="${P.tree}" opacity="0.9"/>`
            : `<g fill="${P.tree}" opacity="0.85"><circle cx="${t.x}" cy="${n(t.y - t.s * 0.9)}" r="${n(t.s * 0.8)}"/><circle cx="${n(t.x + t.s * 0.6)}" cy="${n(t.y - t.s * 0.6)}" r="${n(t.s * 0.6)}"/></g>`;
      }
    }
    return r;
  };

  let s = `<defs>${defs}</defs>`;
  s += `<g filter="url(#paint)">${ridge(0)}`;
  if (!scene.coastal) s += `<rect x="${n(-W * 0.05)}" y="${n(hz - H * 0.06)}" width="${n(W * 1.1)}" height="${n(H * 0.16)}" fill="url(#haze)"/>`;
  s += `</g>`;
  if (scene.coastal) {
    s += `<rect x="-10" y="${n(hz)}" width="${W + 20}" height="${n(H - hz + 10)}" fill="url(#sea)"/>`;
    s += `<rect x="-10" y="${n(hz - 2)}" width="${W + 20}" height="${n(H * 0.03)}" fill="${P.haze}" opacity="0.35"/>`;
    s += `<g stroke="${P.body.glow}" stroke-linecap="round" opacity="${P.stars ? 0.45 : 0.6}" stroke-width="${n(2.2 * k + 0.5)}">`;
    for (const sh of scene.shimmer) s += `<line x1="${n(light.x + sh.dx - sh.w / 2)}" x2="${n(light.x + sh.dx + sh.w / 2)}" y1="${sh.y}" y2="${sh.y}"/>`;
    s += `</g>`;
  }
  s += `<g filter="url(#paint)">`;
  for (let i = 1; i < scene.ridges.length; i++) s += ridge(i);
  s += `</g>`;

  s += `<g stroke="${P.grass}" stroke-linecap="round" fill="none" opacity="0.7">`;
  scene.grass.forEach((d, i) => {
    s += `<path d="${d}" stroke-width="${n((1.2 + (i % 3) * 0.6) * k + 0.4)}"/>`;
  });
  s += `</g><g opacity="${P.stars ? 0.35 : 0.75}">`;
  for (const d of scene.dabs) s += `<circle cx="${d.x}" cy="${d.y}" r="${d.r}" fill="${P.dabs[d.c]}"/>`;
  s += `</g>`;

  if (scene.road && waypoints) {
    s += `<g filter="url(#rough)" fill="none" stroke-linecap="round">`;
    scene.road.segments.forEach((seg, j) => {
      const w = lerp(15, 3.5, seg.t) * k + 1;
      const frac = j === 0 ? 1 : waypoints[j - 1]?.walked ?? 0;
      s += `<path d="${seg.d}" stroke="${P.road}" stroke-width="${n(w * 0.55)}" stroke-dasharray="${n(w * 0.1)} ${n(w * 1.1)}" opacity="0.85"/>`;
      if (frac > 0) s += `<path d="${seg.d}" pathLength="1" stroke="${P.walked}" stroke-width="${n(w)}" stroke-dasharray="${Math.min(1, frac).toFixed(3)} 1"/>`;
    });
    scene.road.waypoints.forEach((p, i) => {
      const st = waypoints[i]?.status;
      const rr = lerp(13, 6, p.t) * k + 2;
      const fill = st === "done" ? P.walked : st === "current" ? "#fbf4e2" : P.road;
      s += `<circle cx="${p.x}" cy="${p.y}" r="${n(rr)}" fill="${fill}" fill-opacity="${st === "next" ? 0.5 : 1}" stroke="${st === "current" ? P.walked : P.ink}" stroke-opacity="${st === "next" ? 0.4 : 0.85}" stroke-width="${n((st === "current" ? 3.5 : 1.6) * k + 0.6)}"/>`;
    });
    const f = scene.road.summit;
    const h = 30 * k + 6;
    const allDone = waypoints.every((w) => w.status === "done");
    s += `<path d="M${f.x} ${f.y} v${n(-h)}" stroke="${P.ink}" stroke-width="${n(1.8 * k + 0.6)}"/>`;
    s += `<path d="M${f.x} ${n(f.y - h)} l${n(h * 0.7)} ${n(h * 0.22)} l${n(-h * 0.7)} ${n(h * 0.22)} Z" fill="${allDone ? P.walked : P.road}" stroke="none"/>`;
    s += `</g>`;
  }
  return doc(W, H, s);
}

export function paintTexture(scene) {
  const { W, H } = scene;
  const k = W / 1600;
  const s = `<filter id="t" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.045" numOctaves="4" seed="21"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.44  0 0 0 0 0.36  0 0 0 1.1 -0.42"/></filter>
<filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${n((0.75 / Math.max(0.5, k)) * 100) / 100}" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0.5 0"/></filter>
<rect width="${W}" height="${H}" filter="url(#t)"/><rect width="${W}" height="${H}" filter="url(#g)"/>`;
  return doc(W, H, s);
}
