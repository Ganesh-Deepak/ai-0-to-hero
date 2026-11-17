import React from "react";

import { paths, getPath, pathById, DEFAULT_PATH_ID } from "./data/paths";
import { buildHash, navigate, parseHash, useHash } from "./lib/router";
import { readJSON, writeJSON } from "./lib/storage";
import { formatDate } from "./lib/format";
import {
  exportPayload,
  migrateLegacy,
  parseImport,
  progressMarkdown,
  sanitizeProgress,
  storageKey,
} from "./lib/progress";

import Header from "./components/Header";
import CommandPalette from "./components/CommandPalette";
import Plan from "./pages/Plan";
import Library from "./pages/Library";
import Labs from "./pages/Labs";
import Reference from "./pages/Reference";
import Offers from "./pages/Offers";

const VALID_PATHS = new Set(paths.map((p) => p.id));
const THEMES = ["system", "light", "dark"];

function loadProgress(path) {
  const stored = readJSON(storageKey(path.id));
  const raw = stored ?? migrateLegacy(path.id, (k) => readJSON(k));
  const progress = sanitizeProgress(raw, path);
  if (!stored) writeJSON(storageKey(path.id), progress);
  return progress;
}

function useProgress(path) {
  const [state, setState] = React.useState(() => ({ id: path.id, value: loadProgress(path) }));
  let current = state;
  if (state.id !== path.id) {
    current = { id: path.id, value: loadProgress(path) };
    setState(current);
  }
  const update = React.useCallback(
    (fn) =>
      setState((prev) => {
        const value = sanitizeProgress(fn(prev.value), getPath(prev.id));
        writeJSON(storageKey(prev.id), value);
        return { id: prev.id, value };
      }),
    []
  );
  return [current.value, update];
}

function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    const t = readJSON("ai0.theme", "system");
    return THEMES.includes(t) ? t : "system";
  });
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
    writeJSON("ai0.theme", theme);
  }, [theme]);
  const toggle = React.useCallback(() => {
    setTheme((t) => {
      const dark =
        t === "dark" ||
        (t === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      return dark ? "light" : "dark";
    });
  }, []);
  return [theme, toggle];
}

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function App() {
  const hash = useHash();
  const storedPath = readJSON("ai0.activePath", DEFAULT_PATH_ID);
  const fallbackPath = VALID_PATHS.has(storedPath) ? storedPath : DEFAULT_PATH_ID;
  const route = parseHash(hash, VALID_PATHS, fallbackPath);
  const path = pathById[route.pathId];
  const [progress, update] = useProgress(path);
  const [theme, toggleTheme] = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [notice, setNotice] = React.useState(null);

  // Canonicalise the URL and remember the last path.
  const canonical = buildHash(route);
  React.useEffect(() => {
    if (hash !== canonical) navigate(canonical, { replace: true });
    writeJSON("ai0.activePath", route.pathId);
  }, [hash, canonical, route.pathId]);

  // Reset scroll when the page changes.
  const pageKey = `${route.pathId}/${route.section}/${route.id ?? ""}`;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  const go = React.useCallback(
    (section, id = null, query = {}) => navigate(buildHash({ pathId: path.id, section, id, query })),
    [path.id]
  );
  const switchPath = (pathId) => navigate(buildHash({ pathId, section: route.section === "labs" ? "labs" : route.section }));

  const actions = React.useMemo(
    () => ({
      toggleRead: (id) => update((p) => ({ ...p, done: toggleIn(p.done, id) })),
      toggleSaved: (id) => update((p) => ({ ...p, saved: toggleIn(p.saved, id) })),
      toggleShipped: (id) => update((p) => ({ ...p, shipped: toggleIn(p.shipped, id) })),
      toggleStep: (labId, index) =>
        update((p) => ({ ...p, steps: { ...p.steps, [labId]: toggleIn(p.steps[labId] || [], index) } })),
      setHours: (hours) => update((p) => ({ ...p, hours })),
      setGoal: (goal) => update((p) => ({ ...p, goal })),
      setNiche: (niche) => update((p) => ({ ...p, niche })),
    }),
    [update]
  );

  const data = React.useMemo(
    () => ({
      exportJSON() {
        const date = new Date().toISOString().slice(0, 10);
        download(`${path.id}-progress-${date}.json`, JSON.stringify(exportPayload(progress, path.id), null, 2), "application/json");
      },
      exportMarkdown() {
        const date = new Date().toISOString().slice(0, 10);
        download(`${path.id}-progress-${date}.md`, progressMarkdown(progress, path), "text/markdown;charset=utf-8");
      },
      importJSON() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json,.json";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            const json = JSON.parse(await file.text());
            const target = VALID_PATHS.has(json?.pathId) ? getPath(json.pathId) : path;
            const parsed = parseImport(json, target);
            if (!parsed) throw new Error("bad file");
            writeJSON(storageKey(target.id), parsed);
            if (target.id === path.id) update(() => parsed);
            else navigate(buildHash({ pathId: target.id, section: "plan" }));
            setNotice(`Imported progress for ${target.label}.`);
          } catch {
            setNotice("That file couldn't be read as a progress export.");
          }
        };
        input.click();
      },
      reset() {
        if (!window.confirm(`Reset all ${path.label} progress in this browser? This can't be undone.`)) return;
        update(() => ({}));
        setNotice("Progress reset.");
      },
    }),
    [path, progress, update, setNotice]
  );

  const pageProps = { path, progress, actions, go, route };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header
        path={path}
        paths={paths}
        section={route.section}
        go={go}
        onSwitchPath={switchPath}
        onOpenPalette={() => setPaletteOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main id="main" className="main" tabIndex={-1}>
        {route.section === "plan" && <Plan key={path.id} {...pageProps} data={data} />}
        {route.section === "library" && <Library key={path.id} {...pageProps} />}
        {route.section === "labs" && <Labs key={path.id} {...pageProps} />}
        {route.section === "reference" && <Reference key={path.id} {...pageProps} />}
        {route.section === "offers" && <Offers key={path.id} {...pageProps} />}
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Content reviewed {formatDate(path.reviewed)}.</span>
          <span>Progress is saved in this browser only.</span>
        </div>
      </footer>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        path={path}
        paths={paths}
        progress={progress}
        go={go}
        onSwitchPath={switchPath}
        onToggleTheme={toggleTheme}
        data={data}
      />
      <div className="toast-region" role="status" aria-live="polite">
        {notice && <div className="toast">{notice}</div>}
      </div>
    </>
  );
}
