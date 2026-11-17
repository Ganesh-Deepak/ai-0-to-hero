// Path registry. Each path is a self-contained data set; the UI is driven
// entirely by the active path.

import * as ai from "./ai.js";
import * as pm from "./pm.js";

function buildPath(mod) {
  const topicById = Object.fromEntries(mod.topics.map((t) => [t.id, t]));
  const resourceById = Object.fromEntries(mod.resources.map((r) => [r.id, r]));
  const labById = Object.fromEntries(mod.labs.map((l) => [l.id, l]));
  const phaseById = Object.fromEntries(mod.phases.map((p) => [p.id, p]));
  const types = [...new Set(mod.resources.map((r) => r.type))].sort();
  return {
    ...mod.meta,
    fieldNotes: mod.fieldNotes,
    topics: mod.topics,
    phases: mod.phases,
    goals: mod.goals,
    goalIds: Object.keys(mod.goals),
    defaultGoal: Object.keys(mod.goals)[0],
    resources: mod.resources,
    labs: mod.labs,
    reference: mod.reference,
    offers: mod.offers,
    types,
    topicById,
    resourceById,
    labById,
    phaseById,
  };
}

export const paths = [buildPath(ai), buildPath(pm)];
export const pathById = Object.fromEntries(paths.map((p) => [p.id, p]));
export const DEFAULT_PATH_ID = "ai";

export function getPath(id) {
  return pathById[id] || pathById[DEFAULT_PATH_ID];
}
