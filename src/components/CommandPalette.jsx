import React from "react";
import { Search } from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

const SECTION_IDS = ["dashboard", "roadmap", "library", "labs", "concepts", "revenue"];

export default function CommandPalette({
  open,
  onClose,
  resources,
  onOpenResource,
  onGoToSection,
  onSelectTopic,
  onToggleTheme,
  onExport,
  onExportMarkdown,
  onImport,
}) {
  const path = usePath();
  const { topics, sectionLabels } = path;
  const sectionCommands = React.useMemo(
    () =>
      SECTION_IDS.map((id) => ({
        id,
        label: `Go to ${sectionLabels[id]}`,
        kind: "Nav",
      })),
    [sectionLabels]
  );
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const items = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    const noop = () => {};
    const actions = [
      {
        id: "theme",
        label: "Toggle theme",
        kind: "Action",
        run: onToggleTheme || noop,
      },
      {
        id: "export",
        label: "Export progress (JSON)",
        kind: "Action",
        run: onExport || noop,
      },
      {
        id: "export-md",
        label: "Export progress (Markdown report)",
        kind: "Action",
        run: onExportMarkdown || noop,
      },
      {
        id: "import",
        label: "Import progress (JSON)",
        kind: "Action",
        run: onImport || noop,
      },
    ];

    const navs = sectionCommands.map((s) => ({
      ...s,
      run: () => onGoToSection(s.id),
    }));

    const topicNavs = topics.map((t) => ({
      id: `topic-${t.id}`,
      label: `Filter by ${t.name}`,
      kind: "Topic",
      run: () => onSelectTopic(t.id),
    }));

    const resourceItems = resources.map((r) => ({
      id: `res-${r.id}`,
      label: r.title,
      kind: "Source",
      source: `${r.source} · ${r.type}`,
      run: () => onOpenResource(r),
    }));

    const all = [...navs, ...actions, ...topicNavs, ...resourceItems];

    if (!q) return all.slice(0, 40);
    return all
      .filter((it) =>
        `${it.label} ${it.source || ""} ${it.kind}`.toLowerCase().includes(q)
      )
      .slice(0, 60);
  }, [query, resources, topics, sectionCommands, onOpenResource, onGoToSection, onSelectTopic, onToggleTheme, onExport, onExportMarkdown, onImport]);

  React.useEffect(() => {
    if (selected >= items.length) setSelected(Math.max(0, items.length - 1));
  }, [items.length, selected]);

  const runSelected = React.useCallback(() => {
    const item = items[selected];
    if (item) {
      item.run();
      onClose();
    }
  }, [items, selected, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(items.length - 1, s + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runSelected();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length, runSelected, onClose]);

  if (!open) return null;

  // group items for display
  const groups = {};
  items.forEach((it, idx) => {
    if (!groups[it.kind]) groups[it.kind] = [];
    groups[it.kind].push({ ...it, globalIndex: idx });
  });

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()} role="dialog">
        <header>
          <Search size={16} color="var(--muted)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, a source, or an action…"
          />
        </header>
        <div className="cmdk-list">
          {items.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              No results.
            </div>
          ) : (
            Object.entries(groups).map(([group, rows]) => (
              <div key={group}>
                <div className="cmdk-group-label">{group}</div>
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="cmdk-row"
                    data-selected={row.globalIndex === selected}
                    onMouseEnter={() => setSelected(row.globalIndex)}
                    onClick={() => {
                      setSelected(row.globalIndex);
                      row.run();
                      onClose();
                    }}
                  >
                    <span>{row.label}</span>
                    {row.source && <span className="source">{row.source}</span>}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        <footer>
          <span className="keys">
            <kbd>↑↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close
          </span>
          <span>{items.length} results</span>
        </footer>
      </div>
    </div>
  );
}
