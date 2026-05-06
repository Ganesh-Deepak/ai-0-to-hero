import { ArrowLeftRight } from "lucide-react";

// Top-of-workspace tab switcher between career paths.
// Each path is a fully isolated bundle (data + progress namespace).
export default function PathSwitcher({ paths, activeId, onChange }) {
  return (
    <nav className="path-switcher" aria-label="Career path">
      <span className="path-switcher-label">
        <ArrowLeftRight size={11} />
        Career path
      </span>
      <div className="path-switcher-tabs" role="tablist">
        {paths.map((p) => {
          const active = p.id === activeId;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`path-tab${active ? " active" : ""}`}
              onClick={() => onChange(p.id)}
              title={p.tagline}
            >
              <span className="path-tab-mark" aria-hidden>
                {p.brand.letter}
              </span>
              <span className="path-tab-text">
                <span className="path-tab-name">{p.label}</span>
                <span className="path-tab-tag">{p.tagline}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
