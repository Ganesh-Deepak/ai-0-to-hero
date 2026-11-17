import React from "react";
import { Search, X } from "lucide-react";
import { ResourceRow, PageHead } from "../components/ui";
import { buildHash, navigate } from "../lib/router";

const FILTERS = [
  ["all", "All"],
  ["must", "Core"],
  ["unread", "Unread"],
  ["saved", "Saved"],
];

export default function Library({ path, progress, actions, route }) {
  const topic = path.topicById[route.query.topic] ? route.query.topic : "all";
  const filter = FILTERS.some(([id]) => id === route.query.filter) ? route.query.filter : "all";
  const [query, setQuery] = React.useState(route.query.q || "");
  const searchRef = React.useRef(null);
  const done = new Set(progress.done);
  const saved = new Set(progress.saved);

  const setParams = (next) => {
    const params = { topic, filter, q: query, ...next };
    navigate(
      buildHash({
        pathId: path.id,
        section: "library",
        query: {
          topic: params.topic === "all" ? null : params.topic,
          filter: params.filter === "all" ? null : params.filter,
          q: params.q?.trim() || null,
        },
      }),
      { replace: true }
    );
  };

  React.useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = React.useMemo(() => {
    const c = {};
    for (const r of path.resources) c[r.topic] = (c[r.topic] || 0) + 1;
    return c;
  }, [path]);

  const q = query.trim().toLowerCase();
  const results = path.resources.filter((r) => {
    if (topic !== "all" && r.topic !== topic) return false;
    if (filter === "must" && !r.must) return false;
    if (filter === "unread" && done.has(r.id)) return false;
    if (filter === "saved" && !saved.has(r.id)) return false;
    if (!q) return true;
    return `${r.title} ${r.source} ${r.type} ${r.why} ${r.todo}`.toLowerCase().includes(q);
  });

  const groups = path.topics
    .map((t) => ({ topic: t, items: results.filter((r) => r.topic === t.id).sort((a, b) => Number(b.must) - Number(a.must)) }))
    .filter((g) => g.items.length);

  const readCount = path.resources.filter((r) => done.has(r.id)).length;

  return (
    <div className="container page">
      <PageHead
        title="Library"
        lede={`${path.resources.length} sources, chosen because leaving any one out would leave a gap. Core items come first in each topic. ${readCount} read so far.`}
      />

      <div className="toolbar" role="search">
        <div className="search-field">
          <Search size={16} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search titles, authors, notes"
            aria-label="Search the library"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setParams({ q: e.target.value });
            }}
          />
          {query ? (
            <button
              type="button"
              className="icon-button small"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setParams({ q: "" });
                searchRef.current?.focus();
              }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
        <div className="segmented" role="radiogroup" aria-label="Status filter">
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={filter === id} onClick={() => setParams({ filter: id })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="chips" role="radiogroup" aria-label="Topic">
        <button type="button" role="radio" className="chip" aria-checked={topic === "all"} onClick={() => setParams({ topic: "all" })}>
          All <span className="count">{path.resources.length}</span>
        </button>
        {path.topics.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            className="chip"
            aria-checked={topic === t.id}
            onClick={() => setParams({ topic: t.id })}
            title={t.blurb}
          >
            {t.name} <span className="count">{counts[t.id] || 0}</span>
          </button>
        ))}
      </div>

      <p className="result-count muted" aria-live="polite">
        {results.length === path.resources.length ? `Showing all ${results.length}` : `${results.length} of ${path.resources.length} shown`}
      </p>

      {groups.length === 0 ? (
        <div className="panel empty">
          <h3>Nothing matches.</h3>
          <p className="muted">
            {filter === "saved" ? "Bookmark a source to add it to your saved list." : "Try a different word or clear the filters."}
          </p>
          <button
            type="button"
            className="button"
            onClick={() => {
              setQuery("");
              setParams({ topic: "all", filter: "all", q: "" });
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.topic.id} className="topic-group" aria-labelledby={`t-${g.topic.id}`}>
            <div className="topic-head">
              <h2 id={`t-${g.topic.id}`}>{g.topic.name}</h2>
              <p className="muted">{g.topic.blurb}</p>
            </div>
            <ul className="resource-list">
              {g.items.map((r) => (
                <ResourceRow
                  key={r.id}
                  resource={r}
                  done={done.has(r.id)}
                  saved={saved.has(r.id)}
                  onToggleRead={actions.toggleRead}
                  onToggleSaved={actions.toggleSaved}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
