import { describe, expect, it } from "vitest";
import { getPath } from "../data/paths";
import { computePlan } from "./plan";
import { sanitizeProgress } from "./progress";
import { buildHash, parseHash } from "./router";

const ai = getPath("ai");

describe("computePlan", () => {
  it("lays phases out back to back and sums the weeks", () => {
    const plan = computePlan(ai, sanitizeProgress({ hours: 12 }, ai));
    expect(plan.phases[0].startWeek).toBe(1);
    for (let i = 1; i < plan.phases.length; i++) {
      expect(plan.phases[i].startWeek).toBe(plan.phases[i - 1].endWeek + 1);
    }
    expect(plan.totalWeeks).toBe(plan.phases.at(-1).endWeek);
  });

  it("gets shorter with more hours and applies goal multipliers", () => {
    const slow = computePlan(ai, sanitizeProgress({ hours: 6 }, ai));
    const fast = computePlan(ai, sanitizeProgress({ hours: 24 }, ai));
    expect(fast.totalWeeks).toBeLessThan(slow.totalWeeks);
    const freelance = computePlan(ai, sanitizeProgress({ goal: "freelance" }, ai));
    const job = computePlan(ai, sanitizeProgress({ goal: "job" }, ai));
    const models = (p) => p.phases.find((x) => x.id === "models");
    expect(models(freelance).hours).toBeLessThan(models(job).hours);
    expect(models(freelance).emphasis).toBe("skim");
    expect(models(job).emphasis).toBe("focus");
  });

  it("suggests the first unread core source and unshipped lab of the current phase", () => {
    const first = computePlan(ai, sanitizeProgress({}, ai));
    expect(first.current.id).toBe("foundation");
    expect(first.nextRead.must).toBe(true);
    expect(first.nextLab.id).toBe("lab-prompt-harness");

    const foundation = ai.phases[0];
    const done = ai.resources.filter((r) => foundation.topics.includes(r.topic)).map((r) => r.id);
    const later = computePlan(ai, sanitizeProgress({ done, shipped: ["lab-prompt-harness"] }, ai));
    expect(later.phases[0].complete).toBe(true);
    expect(later.current.id).toBe("models");
  });
});

describe("router", () => {
  const valid = new Set(["ai", "pm"]);
  it("parses and builds hashes symmetrically", () => {
    const route = parseHash("#/pm/library?topic=metrics&q=ab", valid, "ai");
    expect(route).toEqual({ pathId: "pm", section: "library", id: null, query: { topic: "metrics", q: "ab" } });
    expect(buildHash(route)).toBe("#/pm/library?topic=metrics&q=ab");
  });

  it("falls back for unknown paths and sections", () => {
    expect(parseHash("#/zz/nope", valid, "pm")).toMatchObject({ pathId: "pm", section: "plan" });
    expect(parseHash("", valid, "ai")).toMatchObject({ pathId: "ai", section: "plan" });
  });

  it("keeps lab ids only on the labs section", () => {
    expect(parseHash("#/ai/labs/lab-rag", valid, "ai").id).toBe("lab-rag");
    expect(parseHash("#/ai/library/lab-rag", valid, "ai").id).toBeNull();
  });
});
