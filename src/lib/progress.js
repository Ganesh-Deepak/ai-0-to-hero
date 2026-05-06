export const PROGRESS_VERSION = 3;

export const SECTIONS = [
  "dashboard",
  "roadmap",
  "library",
  "labs",
  "concepts",
  "revenue",
];

export const THEMES = ["dark", "light"];

// Kept for backwards compatibility with existing imports. Active layers
// are now sourced from the active path's defaults.
export const DEFAULT_SELECTED_LAYERS = [
  "model",
  "prompt",
  "retrieval",
  "tools",
  "evals",
];

const DEFAULTS = {
  activePhase: null,
  activeTopic: "all",
  goal: "freelance",
  libraryHighlight: [],
  section: "dashboard",
  selectedLayersList: DEFAULT_SELECTED_LAYERS,
  theme: "dark",
  weeklyHours: 12,
};

function pathDefaults(context) {
  const d = context?.defaults || {};
  return {
    goal: d.goal || DEFAULTS.goal,
    selectedLayersList: Array.isArray(d.selectedLayers)
      ? d.selectedLayers
      : DEFAULTS.selectedLayersList,
    selectedNiche:
      d.selectedNiche || (context?.revenueNiches?.[0]?.id ?? null),
  };
}

export function clampWeeklyHours(value, fallback = DEFAULTS.weeklyHours) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(30, Math.max(4, Math.round(parsed)));
}

export function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value instanceof Set) return [...value];
  return [];
}

function uniqueKnownIds(value, allowedIds) {
  const result = [];
  const seen = new Set();
  for (const id of asArray(value)) {
    if (typeof id !== "string" || !allowedIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function knownOrFallback(value, allowedIds, fallback) {
  return typeof value === "string" && allowedIds.has(value) ? value : fallback;
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function sanitizeLabTasks(value, labs) {
  if (!plainObject(value)) return {};
  const labById = new Map(labs.map((lab) => [lab.id, lab]));
  const sanitized = {};

  for (const [labId, taskIndexes] of Object.entries(value)) {
    const lab = labById.get(labId);
    if (!lab) continue;

    const maxIndex = (lab.steps || []).length - 1;
    const selected = [];
    const seen = new Set();
    for (const rawIndex of asArray(taskIndexes)) {
      const index = Number(rawIndex);
      if (!Number.isInteger(index) || index < 0 || index > maxIndex || seen.has(index)) {
        continue;
      }
      seen.add(index);
      selected.push(index);
    }
    if (selected.length > 0) sanitized[labId] = selected.sort((a, b) => a - b);
  }

  return sanitized;
}

function contextSets(context) {
  return {
    goalIds: new Set(Object.keys(context.goals || {})),
    labIds: new Set((context.labs || []).map((lab) => lab.id)),
    layerIds: new Set((context.architectureLayers || []).map((layer) => layer.id)),
    nicheIds: new Set((context.revenueNiches || []).map((niche) => niche.id)),
    phaseIds: new Set((context.phases || []).map((phase) => phase.id)),
    resourceIds: new Set((context.resources || []).map((resource) => resource.id)),
    topicIds: new Set(["all", ...(context.topics || []).map((topic) => topic.id)]),
  };
}

export function sanitizeProgress(rawValue, context, fallback = {}) {
  const raw = plainObject(rawValue) ? rawValue : {};
  const sets = contextSets(context);
  const pathDef = pathDefaults(context);
  const fallbackLayers = asArray(fallback.selectedLayersList);
  const selectedLayersFallback =
    fallbackLayers.length > 0 ? fallbackLayers : pathDef.selectedLayersList;

  const validLayers = uniqueKnownIds(raw.selectedLayersList, sets.layerIds);

  return {
    activePhase:
      raw.activePhase === null || raw.activePhase === undefined
        ? DEFAULTS.activePhase
        : knownOrFallback(raw.activePhase, sets.phaseIds, DEFAULTS.activePhase),
    activeTopic: knownOrFallback(
      raw.activeTopic,
      sets.topicIds,
      fallback.activeTopic || DEFAULTS.activeTopic
    ),
    done: uniqueKnownIds(raw.done, sets.resourceIds),
    goal: knownOrFallback(raw.goal, sets.goalIds, fallback.goal || pathDef.goal),
    labTasks: sanitizeLabTasks(raw.labTasks, context.labs || []),
    labs: uniqueKnownIds(raw.labs, sets.labIds),
    libraryHighlight: uniqueKnownIds(raw.libraryHighlight, sets.resourceIds),
    saved: uniqueKnownIds(raw.saved, sets.resourceIds),
    section: knownOrFallback(raw.section, new Set(SECTIONS), fallback.section || DEFAULTS.section),
    selectedLayersList: validLayers.length
      ? validLayers
      : selectedLayersFallback.filter((id) => sets.layerIds.has(id)),
    selectedNiche: knownOrFallback(
      raw.selectedNiche,
      sets.nicheIds,
      fallback.selectedNiche || pathDef.selectedNiche
    ),
    theme: knownOrFallback(raw.theme, new Set(THEMES), fallback.theme || DEFAULTS.theme),
    weeklyHours: clampWeeklyHours(raw.weeklyHours, fallback.weeklyHours || DEFAULTS.weeklyHours),
  };
}

export function sanitizeAppState(state, context) {
  return sanitizeProgress(
    {
      activePhase: state.activePhase,
      activeTopic: state.activeTopic,
      done: state.doneResources,
      goal: state.goal,
      labTasks: state.labTasks,
      labs: state.doneLabs,
      libraryHighlight: state.libraryHighlight,
      saved: state.savedResources,
      section: state.section,
      selectedLayersList: state.selectedLayersList,
      selectedNiche: state.selectedNiche,
      theme: state.theme,
      weeklyHours: state.weeklyHours,
    },
    context,
    state
  );
}

export function createProgressPayload(state) {
  return {
    activePhase: state.activePhase,
    activeTopic: state.activeTopic,
    done: [...state.doneResources],
    exportedAt: new Date().toISOString(),
    goal: state.goal,
    labTasks: state.labTasks,
    labs: [...state.doneLabs],
    libraryHighlight: state.libraryHighlight,
    saved: [...state.savedResources],
    section: state.section,
    selectedLayersList: state.selectedLayersList,
    selectedNiche: state.selectedNiche,
    theme: state.theme,
    version: PROGRESS_VERSION,
    weeklyHours: state.weeklyHours,
  };
}
