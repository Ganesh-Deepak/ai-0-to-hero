import { describe, expect, it } from "vitest";
import { makeScene } from "./scene";
import { moodForHour, resolveMood } from "./moods";

describe("scene", () => {
  it("is deterministic for a seed", () => {
    const a = makeScene({ seed: "x", waypoints: 6 });
    const b = makeScene({ seed: "x", waypoints: 6 });
    expect(a).toEqual(b);
    expect(makeScene({ seed: "y", waypoints: 6 })).not.toEqual(a);
  });

  it("places one waypoint per phase, climbing towards the horizon", () => {
    const s = makeScene({ seed: "ai:journey", waypoints: 6, W: 1600, H: 900, horizon: 0.6 });
    expect(s.road.waypoints).toHaveLength(6);
    expect(s.road.segments).toHaveLength(7);
    const ys = s.road.waypoints.map((w) => w.y);
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeLessThan(ys[i - 1]);
    for (const w of s.road.waypoints) {
      expect(w.x).toBeGreaterThanOrEqual(0);
      expect(w.x).toBeLessThanOrEqual(1600);
      expect(w.y).toBeGreaterThan(s.hz);
    }
  });

  it("keeps trees inside the allowed zone", () => {
    const s = makeScene({ seed: "z", treeZone: [0.5, 1] });
    expect(s.trees.length).toBeGreaterThan(0);
    for (const t of s.trees) expect(t.x).toBeGreaterThanOrEqual(800);
  });
});

describe("moods", () => {
  it("maps the clock to a time of day", () => {
    expect(moodForHour(6)).toBe("dawn");
    expect(moodForHour(12)).toBe("day");
    expect(moodForHour(18)).toBe("dusk");
    expect(moodForHour(23)).toBe("night");
    expect(moodForHour(3)).toBe("night");
  });

  it("lets the user pin day or night", () => {
    const late = new Date(2026, 10, 17, 23, 0);
    const evening = new Date(2026, 10, 17, 18, 0);
    expect(resolveMood("auto", late)).toBe("night");
    expect(resolveMood("day", late)).toBe("day");
    expect(resolveMood("day", evening)).toBe("dusk");
    expect(resolveMood("night", evening)).toBe("night");
  });
});
