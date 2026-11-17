import React from "react";
import { MOODS } from "./moods";
import { makeScene } from "./scene";
import { lightOf, paintClouds, paintLand, paintSky, paintTexture, toDataUri } from "./paint";

function useSize(ref) {
  const [size, setSize] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setSize((s) => (s && s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const DETAIL = { hero: 1, band: 0.6, plate: 0.45, mini: 0.3 };

/**
 * An original, generated landscape painting.
 * Fixed-ratio variants ("plate", "mini") use 4:3; "hero" and "band" fill
 * their container and re-compose for its shape.
 */
export default function Painting({
  seed,
  terrain = "alpine",
  mood = "day",
  variant = "band",
  horizon,
  waypoints = null,
  label,
  children,
  className = "",
}) {
  const ref = React.useRef(null);
  const fluid = variant === "hero" || variant === "band";
  const size = useSize(ref);
  const P = MOODS[mood] || MOODS.day;

  const W = fluid ? 1600 : 800;
  let H = 600;
  if (fluid) {
    const ratio = size ? size.h / size.w : variant === "hero" ? 0.56 : 0.25;
    H = Math.max(260, Math.min(2600, Math.round((W * ratio) / 40) * 40));
  }
  const hz = horizon ?? (variant === "hero" ? (H > W ? 0.64 : 0.6) : variant === "band" ? 0.64 : 0.5);

  const wpCount = waypoints ? waypoints.length : 0;
  const scene = React.useMemo(
    () =>
      makeScene({
        seed,
        terrain,
        W,
        H,
        horizon: hz,
        waypoints: wpCount,
        detail: DETAIL[variant] ?? 0.6,
        treeZone: variant === "hero" ? [H > W ? 0.6 : 0.5, 1] : variant === "band" ? [0.55, 1] : [0, 1],
      }),
    [seed, terrain, W, H, hz, wpCount, variant]
  );

  const light = React.useMemo(() => lightOf(scene, P, variant), [scene, P, variant]);
  const roadKey = waypoints ? waypoints.map((w) => `${w.status}:${w.walked.toFixed(2)}`).join("|") : "";

  const sky = React.useMemo(() => toDataUri(paintSky(scene, P, light)), [scene, P, light]);
  const clouds = React.useMemo(() => toDataUri(paintClouds(scene, P)), [scene, P]);
  // roadKey captures everything about the waypoints that changes the picture.
  const land = React.useMemo(
    () => toDataUri(paintLand(scene, P, light, waypoints)),
    [scene, P, light, roadKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const texture = React.useMemo(() => toDataUri(paintTexture(scene)), [scene]);

  // Overlay positions for the waypoint buttons (object-fit: cover maths).
  let place = null;
  if (size && scene.road) {
    const s = Math.max(size.w / W, size.h / H);
    const ox = (size.w - W * s) / 2;
    const oy = (size.h - H * s) / 2;
    place = (x, y) => ({ left: ox + x * s, top: oy + y * s });
  }

  return (
    <div ref={ref} className={`painting painting--${variant} mood-${P.id} ${className}`} style={{ "--sky-ink": P.ink, "--sky-mist": P.haze }}>
      {label && <span className="sr-only">{label}</span>}
      <img className="pt-layer pt-sky" src={sky} alt="" aria-hidden="true" draggable="false" decoding="async" />
      <img className="pt-layer pt-clouds" src={clouds} alt="" aria-hidden="true" draggable="false" decoding="async" />
      <img className="pt-layer pt-land" src={land} alt="" aria-hidden="true" draggable="false" decoding="async" />
      <img className="pt-layer pt-texture" src={texture} alt="" aria-hidden="true" draggable="false" decoding="async" />
      <div className="pt-layer pt-vignette" aria-hidden="true" />
      {fluid && <div className="pt-layer pt-fade" aria-hidden="true" />}

      {waypoints && place && (
        <ol className="waypoints" aria-label="Phases on the map">
          {scene.road.waypoints.map((p, i) => {
            const wp = waypoints[i];
            if (!wp) return null;
            const pos = place(p.x, p.y);
            return (
              <li key={wp.id} style={{ left: pos.left, top: pos.top }} className={`wp is-${wp.status}`}>
                <button type="button" onClick={() => wp.onSelect?.()} aria-label={`${wp.numeral}. ${wp.label}: ${wp.statusText}`}>
                  <span className="wp-dot" aria-hidden="true" />
                  <span className="wp-text" aria-hidden="true">
                    <span className="wp-num">{wp.numeral}</span> {wp.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {children && <div className="pt-overlay">{children}</div>}
    </div>
  );
}
