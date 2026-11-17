import React from "react";
import { Search, X } from "lucide-react";
import { Entry, PageBand} from "../components/ui";
import { roman } from "../lib/format";
import { terrainFor } from "../art/plates";
import { buildHash, navigate } from "../lib/router";

const FILTERS = [
  ["all", "Everything"],
  ["must", "Core"],
  ["unread", "Unread"],
  ["saved", "Saved"],
];

export default function Library({ path, progress, actions, route, mood }) {
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
    .map((t, i) => ({ topic: t, n: i + 1, items: results.filter((r) => r.topic === t.id).sort((a, b) => Number(b.must) - Number(a.must)) }))
    .filter((g) => g.items.length);
  const readCount = path.resources.filter((r) => done.has(r.id)).length;

  return (
    <div>
      <PageBand
        seed={`${path.id}:library`}
        terrain={terrainFor(path.id)}
        mood={mood}
        kicker={`${readCount} of ${path.resources.length} read`}
        title="The Library"
        lede="A short shelf, chosen so that leaving out any one would leave a gap. Core works come first in each chapter."
      />

      <div className="page">
        <div className="catalogue-tools" role="search">
          <div className="quill-search">
            <Search size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search by title, author or idea"
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
                className="tool"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setParams({ q: "" });
                  searchRef.current?.focus();
                }}
              >
                <X size={15} aria-hidden="true" />
              </button>
            ) : (
              <kbd aria-hidden="true">/</kbd>
            )}
          </div>
          <div className="pills" role="radiogroup" aria-label="Show">
            {FILTERS.map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={filter === id} onClick={() => setParams({ filter: id })}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <nav className="contents" aria-label="Chapters">
          <div role="radiogroup" aria-label="Chapter">
            <button type="button" role="radio" aria-checked={topic === "all"} onClick={() => setParams({ topic: "all" })}>
              <span>All chapters</span>
              <span className="contents-count">{path.resources.length}</span>
            </button>
            {path.topics.map((t, i) => (
              <button key={t.id} type="button" role="radio" aria-checked={topic === t.id} onClick={() => setParams({ topic: t.id })} title={t.blurb}>
                <span>
                  <span className="contents-num">{roman(i + 1)}</span> {t.name}
                </span>
                <span className="contents-count">{counts[t.id] || 0}</span>
              </button>
            ))}
          </div>
        </nav>

        <p className="result-count" aria-live="polite">
          {results.length === path.resources.length ? `All ${results.length} works` : `${results.length} of ${path.resources.length} works shown`}
        </p>

        {groups.length === 0 ? (
          <div className="sheet empty">
            <h2 className="sheet-title">Nothing on this shelf.</h2>
            <p>{filter === "saved" ? "Tap the ribbon on any work to save it here." : "Try another word, or clear the filters."}</p>
            <button
              type="button"
              className="btn"
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
            <section key={g.topic.id} className="shelf" aria-labelledby={`t-${g.topic.id}`}>
              <header className="shelf-head">
                <span className="shelf-num" aria-hidden="true">
                  {roman(g.n)}
                </span>
                <h2 id={`t-${g.topic.id}`}>{g.topic.name}</h2>
                <p>{g.topic.blurb}</p>
              </header>
              <ul className="entries">
                {g.items.map((r) => (
                  <Entry
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
    </div>
  );
}
