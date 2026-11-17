import { MOOD_ORDER } from "./moods";

// Each path has its own country: mountains for AI, coast for PM.
export const terrainFor = (pathId) => (pathId === "pm" ? "coastal" : "alpine");

// Each lab is its own study: a fixed scene, light and terrain.
export function plateFor(pathId, lab, index) {
  const home = terrainFor(pathId);
  return {
    seed: `${pathId}:${lab.id}`,
    terrain: index % 3 === 2 ? (home === "alpine" ? "coastal" : "alpine") : home,
    mood: MOOD_ORDER[index % MOOD_ORDER.length],
  };
}
