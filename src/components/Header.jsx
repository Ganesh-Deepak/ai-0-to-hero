import React from "react";
import { Clock, Moon, Search, Sun } from "lucide-react";
import { buildHash } from "../lib/router";
import { MOODS } from "../art/moods";

const LIGHT_LABEL = {
  auto: "Light follows the clock",
  day: "Always daylight",
  night: "Always night",
};

export default function Header({ path, paths, section, go, onSwitchPath, onOpenPalette, light, mood, onCycleLight, solid = false }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    ["plan", "Journey"],
    ["library", "Library"],
    ["labs", "Studio"],
    ["reference", "Field guide"],
    ["offers", path.offersLabel],
  ];
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const LightIcon = light === "auto" ? Clock : light === "day" ? Sun : Moon;

  return (
    <header className={`masthead${scrolled ? " is-scrolled" : ""}${solid ? " is-solid" : ""}`} style={{ "--sky-ink": MOODS[mood].ink }}>
      <div className="masthead-row">
        <a className="wordmark" href={buildHash({ pathId: path.id, section: "plan" })} aria-label="0 to Hero, home">
          <span className="wordmark-zero">0</span>
          <span className="wordmark-arrow" aria-hidden="true">→</span>
          <span className="wordmark-hero">Hero</span>
        </a>

        <div className="path-toggle" role="group" aria-label="Learning path">
          {paths.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === path.id} onClick={() => p.id !== path.id && onSwitchPath(p.id)} title={p.label}>
              {p.short}
            </button>
          ))}
        </div>

        <nav className="nav" aria-label="Sections">
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={buildHash({ pathId: path.id, section: id })}
              aria-current={section === id ? "page" : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                go(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="masthead-tools">
          <button type="button" className="tool search-tool" onClick={onOpenPalette} aria-label="Search and commands">
            <Search size={16} aria-hidden="true" />
            <span className="tool-label">Search</span>
            <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button
            type="button"
            className="tool"
            onClick={onCycleLight}
            aria-label={`${LIGHT_LABEL[light]}. Now: ${MOODS[mood].name.toLowerCase()}. Change light.`}
            title={`${LIGHT_LABEL[light]} · ${MOODS[mood].name}`}
          >
            <LightIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
