import { Moon, Sun } from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

const sectionDefs = [
  { id: "dashboard", key: "1" },
  { id: "roadmap", key: "2" },
  { id: "library", key: "3" },
  { id: "labs", key: "4" },
  { id: "concepts", key: "5" },
  { id: "revenue", key: "6" },
];

export default function Sidebar({
  activeSection,
  onSection,
  activeTopic,
  onTopic,
  topicCounts,
  totalResources,
  doneCount,
  labsDone,
  theme,
  onTheme,
}) {
  const path = usePath();
  const completion = totalResources
    ? Math.round((doneCount / totalResources) * 100)
    : 0;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">{path.brand.letter}</div>
        <div className="brand-text">
          <strong>{path.brand.name}</strong>
          <small>{path.brand.sub}</small>
        </div>
      </div>

      <div>
        <div className="nav-section-label">Workspace</div>
        <div className="nav-list">
          {sectionDefs.map((section) => (
            <button
              key={section.id}
              className={`nav-item${activeSection === section.id ? " active" : ""}`}
              onClick={() => onSection(section.id)}
            >
              <span>{path.sectionLabels[section.id]}</span>
              <span className="kbd">G {section.key}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="nav-section-label">Tracks</div>
        <div className="nav-list">
          <button
            className={`topic-pill${activeTopic === "all" ? " active" : ""}`}
            onClick={() => onTopic("all")}
            style={{ color: "var(--amber)" }}
          >
            <span className="dot" />
            <span style={{ color: "var(--ink-dim)" }}>All tracks</span>
            <span className="count">{totalResources}</span>
          </button>
          {path.topics.map((topic) => (
            <button
              key={topic.id}
              className={`topic-pill${activeTopic === topic.id ? " active" : ""}`}
              onClick={() => onTopic(topic.id)}
              title={topic.signal}
              style={{ color: topic.color }}
            >
              <span className="dot" />
              <span style={{ color: "var(--ink-dim)" }}>{topic.name}</span>
              <span className="count">{topicCounts[topic.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="progress-ring-wrap">
          <div
            className="progress-ring"
            style={{ "--pct": completion }}
            aria-label={`${completion}% complete`}
          >
            <span>{completion}%</span>
          </div>
          <div className="progress-meta">
            <strong>
              {doneCount}/{totalResources} sources
            </strong>
            <span>{labsDone} labs shipped</span>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={onTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </aside>
  );
}
