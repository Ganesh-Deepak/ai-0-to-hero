import { Moon, Search, Sun } from "lucide-react";
import { buildHash } from "../lib/router";

export default function Header({ path, paths, section, go, onSwitchPath, onOpenPalette, onToggleTheme }) {
  const nav = [
    ["plan", "Plan"],
    ["library", "Library"],
    ["labs", "Labs"],
    ["reference", "Reference"],
    ["offers", path.offersLabel],
  ];
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  return (
    <header className="site-header">
      <div className="container header-row">
        <a className="brand" href={buildHash({ pathId: path.id, section: "plan" })} aria-label="0 to Hero, home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="18" height="18">
              <path d="M7 16h15m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">0→Hero</span>
        </a>

        <div className="segmented path-switch" role="group" aria-label="Learning path">
          {paths.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === path.id}
              onClick={() => p.id !== path.id && onSwitchPath(p.id)}
              title={p.label}
            >
              {p.short}
            </button>
          ))}
        </div>

        <nav className="primary-nav" aria-label="Sections">
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

        <div className="header-actions">
          <button type="button" className="search-trigger" onClick={onOpenPalette} aria-label="Search and commands">
            <Search size={15} aria-hidden="true" />
            <span className="search-label">Search</span>
            <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button type="button" className="icon-button" onClick={onToggleTheme} aria-label="Toggle dark mode">
            <Sun size={16} className="icon-sun" aria-hidden="true" />
            <Moon size={16} className="icon-moon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
