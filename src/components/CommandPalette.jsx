import React from "react";
import { Search } from "lucide-react";

// Accessible command palette: a modal dialog with a combobox + listbox.
export default function CommandPalette({ open, onClose, path, paths, progress, go, onSwitchPath, onSetLight, data }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const returnFocus = React.useRef(null);

  const items = React.useMemo(() => {
    const done = new Set(progress.done);
    const pages = [
      ["plan", "Journey"],
      ["library", "Library"],
      ["labs", "Studio (labs)"],
      ["reference", "Field guide"],
      ["offers", path.offersLabel],
    ].map(([id, label]) => ({ id: `go-${id}`, group: "Go to", label, run: () => go(id) }));
    const commands = [
      ...paths
        .filter((p) => p.id !== path.id)
        .map((p) => ({ id: `path-${p.id}`, group: "Commands", label: `Switch to ${p.label}`, run: () => onSwitchPath(p.id) })),
      { id: "light-auto", group: "Commands", label: "Light: follow the clock", run: () => onSetLight("auto") },
      { id: "light-day", group: "Commands", label: "Light: always day", run: () => onSetLight("day") },
      { id: "light-night", group: "Commands", label: "Light: always night", run: () => onSetLight("night") },
      { id: "export-json", group: "Commands", label: "Export progress (JSON)", run: data.exportJSON },
      { id: "export-md", group: "Commands", label: "Export progress (Markdown)", run: data.exportMarkdown },
      { id: "import", group: "Commands", label: "Import progress", run: data.importJSON },
    ];
    const labs = path.labs.map((l) => ({
      id: `lab-${l.id}`,
      group: "Labs",
      label: l.title,
      hint: path.phaseById[l.phase]?.title,
      run: () => go("labs", l.id),
    }));
    const sources = path.resources.map((r) => ({
      id: `res-${r.id}`,
      group: "Sources",
      label: r.title,
      hint: `${r.source}${done.has(r.id) ? " · read" : ""}`,
      haystack: `${r.title} ${r.source} ${path.topicById[r.topic]?.name}`,
      run: () => window.open(r.url, "_blank", "noopener,noreferrer"),
    }));
    const topics = path.topics.map((t) => ({
      id: `topic-${t.id}`,
      group: "Topics",
      label: t.name,
      hint: "Library",
      run: () => go("library", null, { topic: t.id }),
    }));
    return [...pages, ...labs, ...topics, ...commands, ...sources];
  }, [path, paths, progress.done, go, onSwitchPath, onSetLight, data]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((it) => (it.haystack || `${it.label} ${it.hint || ""}`).toLowerCase().includes(q)).slice(0, 40)
    : items.filter((it) => it.group !== "Sources" && it.group !== "Topics");

  React.useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (returnFocus.current) {
      returnFocus.current.focus?.();
      returnFocus.current = null;
    }
  }, [open]);

  React.useEffect(() => {
    const el = listRef.current?.querySelector('[aria-selected="true"]');
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
  }, [active, query]);

  if (!open) return null;

  const run = (item) => {
    onClose();
    item.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: the input is its only tab stop.
      e.preventDefault();
    }
  };

  let lastGroup = null;
  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search and commands" onKeyDown={onKeyDown}>
        <div className="palette-input">
          <Search size={17} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
            aria-autocomplete="list"
            placeholder="Search the library, studies, or a command…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" ref={listRef} role="listbox" aria-label="Results" className="palette-list">
          {results.length === 0 && <li className="palette-empty">No results for “{query}”.</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <React.Fragment key={item.id}>
                {header && (
                  <li role="presentation" className="palette-group">
                    {header}
                  </li>
                )}
                <li
                  id={`pal-${item.id}`}
                  role="option"
                  aria-selected={i === active}
                  className="palette-item"
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => run(item)}
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="hint">{item.hint}</span>}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
