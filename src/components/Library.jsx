import React from "react";
import {
  BadgeCheck,
  Check,
  ExternalLink,
  LayoutGrid,
  List,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Library({
  resources,
  activeTopic,
  setActiveTopic,
  activePhase,
  setActivePhase,
  doneResources,
  savedResources,
  toggleDone,
  toggleSaved,
  onClearProgress,
  highlightIds = [],
  clearHighlight,
  intent = null,
  clearIntent,
}) {
  const path = usePath();
  const { topicById, phases, resourceTypes, resourceCatalogMeta } = path;
  const phaseById = React.useMemo(
    () => Object.fromEntries(phases.map((p) => [p.id, p])),
    [phases]
  );
  const highlightSet = React.useMemo(
    () => new Set(highlightIds || []),
    [highlightIds]
  );
  const activeTopicMeta = activeTopic !== "all" ? topicById[activeTopic] : null;
  const activePhaseMeta = activePhase ? phaseById[activePhase] : null;
  const phaseTopicSet = React.useMemo(
    () => (activePhaseMeta ? new Set(activePhaseMeta.topics) : null),
    [activePhaseMeta]
  );
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState("All");
  const [type, setType] = React.useState("All");
  const [view, setView] = React.useState("grid");
  const [priorityOnly, setPriorityOnly] = React.useState(false);
  const [savedOnly, setSavedOnly] = React.useState(false);

  React.useEffect(() => {
    if (!intent) return;
    if (intent === "priority") {
      setPriorityOnly(true);
      setSavedOnly(false);
    } else if (intent === "saved") {
      setSavedOnly(true);
      setPriorityOnly(false);
    }
    clearIntent && clearIntent();
  }, [intent, clearIntent]);

  const searchRef = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (phaseTopicSet && !phaseTopicSet.has(r.topic)) return false;
      if (activeTopic !== "all" && r.topic !== activeTopic) return false;
      if (level !== "All" && r.level !== level && r.level !== "All") return false;
      if (type !== "All" && r.type !== type) return false;
      if (priorityOnly && r.priority !== 1) return false;
      if (savedOnly && !savedResources.has(r.id)) return false;
      if (!q) return true;
      const hay = `${r.title} ${r.source} ${r.author || ""} ${r.why} ${r.build} ${(r.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [resources, activeTopic, phaseTopicSet, level, type, query, priorityOnly, savedOnly, savedResources]);

  // Sort: highlights first, then priority, done at bottom
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aDone = doneResources.has(a.id) ? 1 : 0;
      const bDone = doneResources.has(b.id) ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const aHi = highlightSet.has(a.id) ? 0 : 1;
      const bHi = highlightSet.has(b.id) ? 0 : 1;
      if (aHi !== bHi) return aHi - bHi;
      const ap = a.priority || 3;
      const bp = b.priority || 3;
      return ap - bp;
    });
  }, [filtered, doneResources, highlightSet]);

  const savedList = resources.filter((r) => savedResources.has(r.id));

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Canonical library</span>
          <h2>
            The one <em>handful</em> of sources worth your time.
          </h2>
          <p>
            Every item was picked because removing it would leave a hole. Priority
            1 sources are must-reads before the next phase.
          </p>
          <div className="catalog-meta">
            <span>Reviewed {resourceCatalogMeta.lastReviewed}</span>
            <span>Links checked {resourceCatalogMeta.linkChecked}</span>
            <span>{resourceCatalogMeta.reviewCadence} refresh</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {activePhaseMeta && (
            <button
              className="btn filter-chip"
              onClick={() => setActivePhase && setActivePhase(null)}
              title="Clear phase filter"
            >
              <span className="chip-dot" style={{ background: "var(--amber)" }} />
              <span style={{ color: "var(--ink)" }}>
                Phase · {activePhaseMeta.title}
              </span>
              <span className="chip-x">×</span>
            </button>
          )}
          {activeTopicMeta && (
            <button
              className="btn filter-chip"
              style={{ color: activeTopicMeta.color }}
              onClick={() => setActiveTopic && setActiveTopic("all")}
              title="Clear track filter"
            >
              <span className="chip-dot" style={{ background: "currentColor" }} />
              <span style={{ color: "var(--ink)" }}>{activeTopicMeta.name}</span>
              <span className="chip-x">×</span>
            </button>
          )}
          <button
            className={`btn${priorityOnly ? " primary" : ""}`}
            onClick={() => setPriorityOnly((x) => !x)}
          >
            <Star size={13} /> Priority only
          </button>
          <button
            className={`btn${savedOnly ? " primary" : ""}`}
            onClick={() => setSavedOnly((x) => !x)}
            title="Show only your saved queue"
          >
            <Save size={13} /> Saved only
          </button>
          <div className="view-toggle">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={13} /> Grid
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <List size={13} /> List
            </button>
          </div>
        </div>
      </div>

      <div className="library-layout">
        <div>
          {activePhaseMeta && (
            <PhaseSummaryCard
              phase={activePhaseMeta}
              resources={resources}
              doneResources={doneResources}
            />
          )}
          {highlightSet.size > 0 && (
            <div className="highlight-banner">
              <span className="chip-dot" style={{ background: "var(--amber)" }} />
              <span>
                Focused on {highlightSet.size} source{highlightSet.size === 1 ? "" : "s"} from a lab —
                pinned to the top.
              </span>
              <button
                className="btn ghost"
                onClick={() => clearHighlight && clearHighlight()}
                style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 12 }}
              >
                Clear focus
              </button>
            </div>
          )}
          <div className="filters-bar">
            <div className="searchbox">
              <Search size={16} color="var(--muted)" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, authors, tags  ( / )"
              />
              {query && (
                <button
                  className="btn icon ghost"
                  onClick={() => setQuery("")}
                  title="Clear"
                  style={{ padding: 0, minWidth: "auto", color: "var(--muted)" }}
                >
                  ×
                </button>
              )}
            </div>
            <select
              className="filter-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {resourceTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 12px",
                height: 40,
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                color: "var(--muted)",
                fontSize: 12.5,
                fontFamily: "var(--f-mono)",
              }}
            >
              {sorted.length} {sorted.length === 1 ? "source" : "sources"}
            </div>
          </div>

          {view === "grid" ? (
            <div className="resource-grid">
              {sorted.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  topicById={topicById}
                  done={doneResources.has(r.id)}
                  saved={savedResources.has(r.id)}
                  highlighted={highlightSet.has(r.id)}
                  onDone={() => toggleDone(r.id)}
                  onSaved={() => toggleSaved(r.id)}
                />
              ))}
              {sorted.length === 0 && <EmptyState />}
            </div>
          ) : (
            <div className="resource-list">
              {sorted.map((r) => (
                <ResourceRow
                  key={r.id}
                  resource={r}
                  done={doneResources.has(r.id)}
                  saved={savedResources.has(r.id)}
                  highlighted={highlightSet.has(r.id)}
                  onDone={() => toggleDone(r.id)}
                  onSaved={() => toggleSaved(r.id)}
                />
              ))}
              {sorted.length === 0 && <EmptyState />}
            </div>
          )}
        </div>

        <aside className="saved-rail">
          <h3>Reading queue</h3>
          {savedList.length === 0 ? (
            <p className="empty">
              Save items with the bookmark icon. They'll show up here for later.
            </p>
          ) : (
            savedList.slice(0, 10).map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                title={r.title}
              >
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.title}
                </span>
                <ExternalLink size={13} color="var(--muted)" />
              </a>
            ))
          )}
          <button
            className="btn ghost"
            style={{
              marginTop: 8,
              color: "var(--muted)",
              fontSize: 12,
              justifyContent: "flex-start",
            }}
            onClick={onClearProgress}
          >
            <Trash2 size={13} /> Reset progress
          </button>
        </aside>
      </div>
    </section>
  );
}

function ResourceCard({ resource, topicById, done, saved, highlighted, onDone, onSaved }) {
  const topic = topicById[resource.topic];
  const Icon = topic?.icon;
  return (
    <article className={`resource-card${done ? " done" : ""}${highlighted ? " highlighted" : ""}`}>
      <div className="card-meta">
        {topic && (
          <span className="topic-tag" style={{ color: topic.color }}>
            {Icon && <Icon size={11} />}
            {topic.name}
          </span>
        )}
        <span>·</span>
        <span>{resource.level}</span>
        <span>·</span>
        <span>{resource.time}</span>
        {resource.priority === 1 && (
          <span className="pill amber" style={{ marginLeft: "auto" }}>
            <Star size={10} /> Priority
          </span>
        )}
      </div>
      <a
        className="title-link"
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        title={`Open ${resource.title}`}
      >
        <h3>
          {resource.title}
          <ExternalLink size={14} className="ext" />
        </h3>
      </a>
      <div className="source-line">
        <span>{resource.source}</span>
        {resource.author && resource.author !== resource.source && (
          <>
            <span className="separator">·</span>
            <span>{resource.author}</span>
          </>
        )}
        <span className="separator">·</span>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 11 }}>
          {resource.type}
        </span>
      </div>
      <p className="why">{resource.why}</p>
      <p className="build">
        <em>Build</em>
        {resource.build}
      </p>
      <div className="actions">
        <a
          className="btn primary open"
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          title={`Open ${resource.source}`}
        >
          <ExternalLink size={14} />
          <span>Open source</span>
        </a>
        <button
          className={`btn icon${done ? " success" : ""}`}
          onClick={onDone}
          title={done ? "Mark unread" : "Mark done"}
          aria-label={done ? "Mark unread" : "Mark done"}
        >
          {done ? <Check size={14} /> : <BadgeCheck size={14} />}
        </button>
        <button
          className={`btn icon${saved ? " saved" : ""}`}
          onClick={onSaved}
          title={saved ? "Remove from queue" : "Save for later"}
          aria-label={saved ? "Remove from queue" : "Save for later"}
        >
          <Save size={14} />
        </button>
      </div>
    </article>
  );
}

function ResourceRow({ resource, done, saved, highlighted, onDone, onSaved }) {
  return (
    <div className={`resource-row${done ? " done" : ""}${highlighted ? " highlighted" : ""}`}>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="row-body"
        title={`Open ${resource.title}`}
      >
        <div className="title">
          {resource.title}
          <ExternalLink size={12} className="row-ext" />
          <span className="muted">— {resource.why.slice(0, 64)}…</span>
        </div>
        <div className="source">
          {resource.source}
          {resource.author && resource.author !== resource.source ? ` · ${resource.author}` : ""}
        </div>
        <div className="type">
          {resource.type} · {resource.level}
        </div>
        <div className="time">{resource.time}</div>
      </a>
      <div className="actions">
        <button
          className={`btn icon${done ? " success" : ""}`}
          onClick={onDone}
          title={done ? "Mark unread" : "Mark complete"}
          aria-label={done ? "Mark unread" : "Mark complete"}
        >
          <Check size={14} />
        </button>
        <button
          className={`btn icon${saved ? " saved" : ""}`}
          onClick={onSaved}
          title={saved ? "Remove" : "Save"}
          aria-label={saved ? "Remove" : "Save"}
        >
          <Save size={14} />
        </button>
      </div>
    </div>
  );
}

function PhaseSummaryCard({ phase, resources, doneResources }) {
  const pool = resources.filter((r) => phase.topics.includes(r.topic));
  const poolDone = pool.filter((r) => doneResources.has(r.id)).length;
  const pct = pool.length ? Math.round((poolDone / pool.length) * 100) : 0;
  const priorityLeft = pool.filter(
    (r) => r.priority === 1 && !doneResources.has(r.id)
  ).length;

  return (
    <article className="phase-summary">
      <div className="phase-summary-head">
        <span className="eyebrow">
          <Sparkles size={11} style={{ marginRight: 6, verticalAlign: "-1px" }} />
          Phase focus
        </span>
        <h3>{phase.title}</h3>
        <p>{phase.focus}</p>
      </div>
      <div className="phase-summary-grid">
        <div className="phase-summary-stat">
          <span className="label">Progress</span>
          <span className="value">
            {poolDone}
            <small>/{pool.length}</small>
          </span>
          <div className="meter">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="phase-summary-stat">
          <span className="label">Priority left</span>
          <span className="value">
            {priorityLeft}
            <small> unread</small>
          </span>
          <span className="sub">
            {priorityLeft === 0
              ? "All phase priorities complete."
              : "Clear these before moving on."}
          </span>
        </div>
        <div className="phase-summary-stat">
          <span className="label">Weeks</span>
          <span className="value">
            {phase.weeks}
            <small>w</small>
          </span>
          <span className="sub">
            Ship: <strong>{phase.ship}</strong>
          </span>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        padding: 40,
        textAlign: "center",
        color: "var(--muted)",
        background: "var(--panel)",
        border: "1px dashed var(--line)",
        borderRadius: "var(--r-lg)",
      }}
    >
      No sources match these filters. Try widening the search.
    </div>
  );
}
