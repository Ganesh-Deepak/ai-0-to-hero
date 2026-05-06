import React from "react";
import { Check, Command, Cloud } from "lucide-react";

import { paths, getPath, DEFAULT_PATH_ID } from "./data/paths";
import { PathProvider } from "./contexts/PathContext";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Roadmap from "./components/Roadmap";
import Library from "./components/Library";
import Labs from "./components/Labs";
import Concepts from "./components/Concepts";
import Revenue from "./components/Revenue";
import CommandPalette from "./components/CommandPalette";
import PathSwitcher from "./components/PathSwitcher";

import {
  usePersistentState,
  usePersistentSet,
  usePersistentMap,
  useSaveIndicator,
} from "./hooks/usePersistentState";
import { useTheme } from "./hooks/useTheme";
import {
  arraysEqual,
  clampWeeklyHours,
  createProgressPayload,
  jsonEqual,
  sanitizeAppState,
  sanitizeProgress,
} from "./lib/progress";

const isMacPlatform =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(
    navigator.userAgentData?.platform || navigator.platform || navigator.userAgent
  );
const modKeyLabel = isMacPlatform ? "⌘K" : "Ctrl K";

const VALID_PATH_IDS = new Set(paths.map((p) => p.id));

function k(pathId, name) {
  return `ai0.${pathId}.${name}`;
}

export default function App() {
  const [pathIdRaw, setPathId] = usePersistentState(
    "ai0.activePath",
    DEFAULT_PATH_ID
  );
  const pathId = VALID_PATH_IDS.has(pathIdRaw) ? pathIdRaw : DEFAULT_PATH_ID;
  const path = React.useMemo(() => getPath(pathId), [pathId]);

  const [section, setSection] = usePersistentState(
    k(pathId, "section"),
    "dashboard"
  );
  const [activeTopic, setActiveTopic] = usePersistentState(
    k(pathId, "topic"),
    "all"
  );
  const [activePhase, setActivePhase] = usePersistentState(
    k(pathId, "phase"),
    null
  );
  const [weeklyHours, setWeeklyHours] = usePersistentState(
    k(pathId, "hours"),
    12
  );
  const [goal, setGoal] = usePersistentState(
    k(pathId, "goal"),
    path.defaults.goal
  );
  const [selectedNiche, setSelectedNiche] = usePersistentState(
    k(pathId, "niche"),
    path.defaults.selectedNiche
  );
  const [selectedLayersList, setSelectedLayersList] = usePersistentState(
    k(pathId, "layers"),
    path.defaults.selectedLayers
  );
  const [libraryHighlight, setLibraryHighlight] = usePersistentState(
    k(pathId, "libraryHighlight"),
    []
  );
  const selectedLayers = React.useMemo(
    () => new Set(selectedLayersList),
    [selectedLayersList]
  );
  const toggleLayer = (id) =>
    setSelectedLayersList((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );

  const [doneResources, doneResActions] = usePersistentSet(
    k(pathId, "doneResources")
  );
  const [savedResources, savedResActions] = usePersistentSet(
    k(pathId, "savedResources")
  );
  const [doneLabs, doneLabActions] = usePersistentSet(k(pathId, "doneLabs"));
  const [labTasks, setLabTasks] = usePersistentMap(k(pathId, "labTasks"), {});
  const toggleLabTask = (labId, idx) => {
    setLabTasks((current) => {
      const list = new Set(current[labId] || []);
      list.has(idx) ? list.delete(idx) : list.add(idx);
      return { ...current, [labId]: [...list] };
    });
  };

  const { theme, setTheme, cycle: cycleTheme } = useTheme();
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [libraryIntent, setLibraryIntent] = React.useState(null);
  const savedAt = useSaveIndicator();
  const safeWeeklyHours = clampWeeklyHours(weeklyHours);

  const progressContext = React.useMemo(
    () => ({
      architectureLayers: path.architectureLayers,
      defaults: path.defaults,
      goals: path.goals,
      labs: path.labs,
      phases: path.phases,
      resources: path.resources,
      revenueNiches: path.revenueNiches,
      topics: path.topics,
    }),
    [path]
  );

  React.useEffect(() => {
    const sanitized = sanitizeAppState(
      {
        activePhase,
        activeTopic,
        doneLabs,
        doneResources,
        goal,
        labTasks,
        libraryHighlight,
        savedResources,
        section,
        selectedLayersList,
        selectedNiche,
        theme,
        weeklyHours,
      },
      progressContext
    );

    if (sanitized.section !== section) setSection(sanitized.section);
    if (sanitized.activeTopic !== activeTopic) setActiveTopic(sanitized.activeTopic);
    if (sanitized.activePhase !== activePhase) setActivePhase(sanitized.activePhase);
    if (sanitized.weeklyHours !== weeklyHours) setWeeklyHours(sanitized.weeklyHours);
    if (sanitized.goal !== goal) setGoal(sanitized.goal);
    if (sanitized.selectedNiche !== selectedNiche) setSelectedNiche(sanitized.selectedNiche);
    if (sanitized.theme !== theme) setTheme(sanitized.theme);
    if (!arraysEqual(sanitized.selectedLayersList, selectedLayersList)) {
      setSelectedLayersList(sanitized.selectedLayersList);
    }
    if (!arraysEqual(sanitized.libraryHighlight, libraryHighlight)) {
      setLibraryHighlight(sanitized.libraryHighlight);
    }
    if (!arraysEqual(sanitized.done, [...doneResources])) {
      doneResActions.setAll(sanitized.done);
    }
    if (!arraysEqual(sanitized.saved, [...savedResources])) {
      savedResActions.setAll(sanitized.saved);
    }
    if (!arraysEqual(sanitized.labs, [...doneLabs])) {
      doneLabActions.setAll(sanitized.labs);
    }
    if (!jsonEqual(sanitized.labTasks, labTasks)) {
      setLabTasks(sanitized.labTasks);
    }
  }, [
    activePhase,
    activeTopic,
    doneLabActions,
    doneLabs,
    doneResActions,
    doneResources,
    goal,
    labTasks,
    libraryHighlight,
    progressContext,
    savedResActions,
    savedResources,
    section,
    selectedLayersList,
    selectedNiche,
    setActivePhase,
    setActiveTopic,
    setGoal,
    setLabTasks,
    setLibraryHighlight,
    setSection,
    setSelectedLayersList,
    setSelectedNiche,
    setTheme,
    setWeeklyHours,
    theme,
    weeklyHours,
  ]);

  // keyboard shortcuts: cmd+k, g+1..6, t for theme
  const pendingG = React.useRef(false);
  React.useEffect(() => {
    const onKey = (e) => {
      const isMod = e.ctrlKey || e.metaKey;
      const inTextField =
        document.activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((x) => !x);
        return;
      }

      if (inTextField) return;

      if (e.key.toLowerCase() === "g") {
        pendingG.current = true;
        setTimeout(() => (pendingG.current = false), 700);
        return;
      }

      if (pendingG.current && /^[1-6]$/.test(e.key)) {
        const map = {
          1: "dashboard",
          2: "roadmap",
          3: "library",
          4: "labs",
          5: "concepts",
          6: "revenue",
        };
        pendingG.current = false;
        setSection(map[e.key]);
        setActivePhase(null);
        return;
      }

      if (e.key.toLowerCase() === "t") {
        cycleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme, setSection, setActivePhase]);

  // topic counts for sidebar
  const topicCounts = React.useMemo(() => {
    const counts = {};
    path.topics.forEach((t) => (counts[t.id] = 0));
    path.resources.forEach((r) => {
      counts[r.topic] = (counts[r.topic] || 0) + 1;
    });
    return counts;
  }, [path]);

  const resetProgress = () => {
    if (!window.confirm("Reset all progress for this path? This clears done + saved items and lab checklists.")) {
      return;
    }
    doneResActions.clear();
    savedResActions.clear();
    doneLabActions.clear();
    setLabTasks({});
  };

  const exportProgress = () => {
    const payload = {
      ...createProgressPayload({
        activePhase,
        activeTopic,
        doneLabs,
        doneResources,
        goal,
        labTasks,
        libraryHighlight,
        savedResources,
        section,
        selectedLayersList,
        selectedNiche,
        theme,
        weeklyHours: safeWeeklyHours,
      }),
      pathId,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pathId}-0-to-hero-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    const date = new Date().toISOString().slice(0, 10);
    const doneList = path.resources.filter((r) => doneResources.has(r.id));
    const savedList = path.resources.filter((r) => savedResources.has(r.id));
    const labObjs = path.labs.filter((l) => doneLabs.has(l.id));
    const labInProgress = path.labs.filter((l) => {
      const t = labTasks[l.id] || [];
      return !doneLabs.has(l.id) && t.length > 0;
    });

    const byTopic = (list) => {
      const groups = {};
      list.forEach((r) => {
        groups[r.topic] = groups[r.topic] || [];
        groups[r.topic].push(r);
      });
      return groups;
    };

    const renderTopicSection = (title, list) => {
      if (list.length === 0) return "";
      const groups = byTopic(list);
      const parts = [`## ${title}  (${list.length})`];
      for (const [topic, items] of Object.entries(groups)) {
        parts.push(`\n### ${topic}`);
        items.forEach((r) => {
          parts.push(`- [${r.title}](${r.url}) — ${r.source}${r.author && r.author !== r.source ? ` · ${r.author}` : ""} · ${r.type} · ${r.time}`);
        });
      }
      return parts.join("\n");
    };

    const labSection = (title, list) => {
      if (list.length === 0) return "";
      const parts = [`## ${title}  (${list.length})`];
      list.forEach((l) => {
        const t = labTasks[l.id] || [];
        const pct = Math.round((t.length / l.steps.length) * 100);
        parts.push(`- **${l.title}** — ${l.topic} · ${l.level} · ${l.estimate} — ${pct}% tasks complete`);
      });
      return parts.join("\n");
    };

    const md = [
      `# ${path.brand.name} — Progress report`,
      `_Exported ${date} · path: **${path.label}** · goal: **${goal}** · ${safeWeeklyHours}h/week_`,
      ``,
      `**Summary**`,
      `- Sources done: ${doneList.length} / ${path.resources.length}`,
      `- Labs shipped: ${labObjs.length} / ${path.labs.length}`,
      `- Labs in progress: ${labInProgress.length}`,
      `- Saved for later: ${savedList.length}`,
      ``,
      labSection("Labs shipped", labObjs),
      labSection("Labs in progress", labInProgress),
      renderTopicSection("Sources completed", doneList),
      renderTopicSection("Saved reading queue", savedList),
    ]
      .filter(Boolean)
      .join("\n\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pathId}-0-to-hero-progress-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        // If the file contains a different pathId, switch to that path first.
        if (parsed?.pathId && VALID_PATH_IDS.has(parsed.pathId) && parsed.pathId !== pathId) {
          setPathId(parsed.pathId);
          // Defer applying values until next tick so namespaced storage uses the new id.
          setTimeout(() => applyImportedProgress(parsed, getPath(parsed.pathId)), 30);
          return;
        }
        applyImportedProgress(parsed, path);
      } catch {
        alert("Could not parse that file.");
      }
    };
    input.click();
  };

  const applyImportedProgress = (parsed, targetPath) => {
    const targetContext = {
      architectureLayers: targetPath.architectureLayers,
      defaults: targetPath.defaults,
      goals: targetPath.goals,
      labs: targetPath.labs,
      phases: targetPath.phases,
      resources: targetPath.resources,
      revenueNiches: targetPath.revenueNiches,
      topics: targetPath.topics,
    };
    const sanitized = sanitizeProgress(parsed, targetContext, {
      activePhase,
      activeTopic,
      goal,
      section,
      selectedLayersList,
      selectedNiche,
      theme,
      weeklyHours: safeWeeklyHours,
    });
    doneResActions.setAll(sanitized.done);
    savedResActions.setAll(sanitized.saved);
    doneLabActions.setAll(sanitized.labs);
    setLabTasks(sanitized.labTasks);
    setWeeklyHours(sanitized.weeklyHours);
    setGoal(sanitized.goal);
    setSelectedNiche(sanitized.selectedNiche);
    setSelectedLayersList(sanitized.selectedLayersList);
    setActiveTopic(sanitized.activeTopic);
    setActivePhase(sanitized.activePhase);
    setLibraryHighlight(sanitized.libraryHighlight);
    setSection(sanitized.section);
    setTheme(sanitized.theme);
  };

  const openResource = (r) => {
    window.open(r.url, "_blank", "noopener,noreferrer");
  };

  const title = path.sectionTitles[section] || path.sectionTitles.dashboard;

  const goToPhase = (phaseId) => {
    setActivePhase(phaseId);
    setActiveTopic("all");
    setSection("library");
  };

  const selectTopic = (id) => {
    setActivePhase(null);
    setActiveTopic(id);
  };

  const goToLibraryForLab = (topicId, resourceIds = []) => {
    setActivePhase(null);
    setActiveTopic(topicId || "all");
    setLibraryHighlight(Array.isArray(resourceIds) ? resourceIds : []);
    setSection("library");
  };

  const goToLab = (labId, topicId) => {
    setActivePhase(null);
    if (topicId) setActiveTopic(topicId);
    setSection("labs");
    if (labId) {
      setTimeout(() => {
        const el = document.getElementById(`lab-${labId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  const goToLibraryTopic = (topicId) => {
    setActivePhase(null);
    setActiveTopic(topicId || "all");
    setLibraryHighlight([]);
    setSection("library");
  };

  const goToLibraryIntent = (intent) => {
    setActivePhase(null);
    setActiveTopic("all");
    setLibraryHighlight([]);
    setLibraryIntent(intent);
    setSection("library");
  };

  const handlePathChange = (nextId) => {
    if (!VALID_PATH_IDS.has(nextId) || nextId === pathId) return;
    setPathId(nextId);
    // Reset transient navigation; persistent state for the new path
    // hydrates automatically via namespaced keys.
    setLibraryIntent(null);
  };

  return (
    <PathProvider pathId={pathId}>
      <div className="app-shell">
        <Sidebar
          activeSection={section}
          onSection={(s) => {
            setSection(s);
            setActivePhase(null);
          }}
          activeTopic={activeTopic}
          onTopic={(id) => {
            selectTopic(id);
            if (section !== "library" && section !== "labs") {
              setSection("library");
            }
          }}
          topicCounts={topicCounts}
          totalResources={path.resources.length}
          doneCount={doneResources.size}
          labsDone={doneLabs.size}
          theme={theme}
          onTheme={cycleTheme}
        />

        <main className="workspace">
          <PathSwitcher
            paths={paths}
            activeId={pathId}
            onChange={handlePathChange}
          />

          <header className="topbar">
            <div className="topbar-title">
              <h1>{title.label}</h1>
              <span className="subtle">{title.sub}</span>
            </div>
            <div className="spacer" />
            <span
              className={`save-indicator${savedAt ? " active" : ""}`}
              title="Your progress auto-saves to this browser"
              aria-live="polite"
            >
              {savedAt ? (
                <>
                  <Check size={12} /> Saved
                </>
              ) : (
                <>
                  <Cloud size={12} /> Auto-saved
                </>
              )}
            </span>
            <button
              className="cmdk-button"
              onClick={() => setCmdkOpen(true)}
              aria-label="Open command palette"
            >
              <Command size={14} />
              <span className="label" style={{ color: "var(--muted)" }}>
                Search or jump…
              </span>
              <span className="kbd">{modKeyLabel}</span>
            </button>
          </header>

          {section === "dashboard" && (
            <Dashboard
              resources={path.resources}
              labs={path.labs}
              doneResources={doneResources}
              doneLabs={doneLabs}
              savedResources={savedResources}
              goToLibrary={() => {
                setActivePhase(null);
                setSection("library");
              }}
              goToLabs={() => setSection("labs")}
              goToPhase={goToPhase}
              goToLibraryIntent={goToLibraryIntent}
            />
          )}

          {section === "roadmap" && (
            <Roadmap
              weeklyHours={safeWeeklyHours}
              setWeeklyHours={setWeeklyHours}
              goal={goal}
              setGoal={setGoal}
              doneCount={doneResources.size}
              goToPhase={goToPhase}
            />
          )}

          {section === "library" && (
            <Library
              resources={path.resources}
              activeTopic={activeTopic}
              setActiveTopic={selectTopic}
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              doneResources={doneResources}
              savedResources={savedResources}
              toggleDone={doneResActions.toggle}
              toggleSaved={savedResActions.toggle}
              onClearProgress={resetProgress}
              highlightIds={libraryHighlight}
              clearHighlight={() => setLibraryHighlight([])}
              intent={libraryIntent}
              clearIntent={() => setLibraryIntent(null)}
            />
          )}

          {section === "labs" && (
            <Labs
              labs={path.labs}
              activeTopic={activeTopic}
              setActiveTopic={selectTopic}
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              doneLabs={doneLabs}
              toggleLab={doneLabActions.toggle}
              labTasks={labTasks}
              toggleLabTask={toggleLabTask}
              goToLibraryForLab={goToLibraryForLab}
            />
          )}

          {section === "concepts" && (
            <Concepts
              selectedLayers={selectedLayers}
              toggleLayer={toggleLayer}
            />
          )}

          {section === "revenue" && (
            <Revenue
              selectedNiche={selectedNiche}
              setSelectedNiche={setSelectedNiche}
              weeklyHours={safeWeeklyHours}
              goToLab={goToLab}
              goToLibraryTopic={goToLibraryTopic}
              doneLabs={doneLabs}
            />
          )}
        </main>
      </div>

      <CommandPalette
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        resources={path.resources}
        onOpenResource={openResource}
        onGoToSection={(s) => {
          setSection(s);
          setActivePhase(null);
        }}
        onSelectTopic={(id) => {
          selectTopic(id);
          setSection("library");
        }}
        onToggleTheme={cycleTheme}
        onExport={exportProgress}
        onExportMarkdown={exportMarkdown}
        onImport={importProgress}
      />
    </PathProvider>
  );
}
