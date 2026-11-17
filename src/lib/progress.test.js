import { describe, expect, it } from "vitest";
import { getPath } from "../data/paths";
import {
  PROGRESS_VERSION,
  clampHours,
  exportPayload,
  migrateLegacy,
  parseImport,
  progressMarkdown,
  sanitizeProgress,
} from "./progress";

const ai = getPath("ai");
const pm = getPath("pm");

describe("sanitizeProgress", () => {
  it("returns defaults for garbage", () => {
    for (const raw of [null, undefined, 42, "x", []]) {
      const p = sanitizeProgress(raw, ai);
      expect(p).toMatchObject({ done: [], saved: [], shipped: [], steps: {}, hours: 12, goal: "freelance" });
      expect(p.niche).toBe(ai.offers.niches[0].id);
    }
  });

  it("drops unknown ids, duplicates and out-of-range steps, and clamps hours", () => {
    const p = sanitizeProgress(
      {
        done: ["karpathy-intro-llms", "nope", "karpathy-intro-llms", 7],
        saved: ["mcp-spec", "missing"],
        shipped: ["lab-rag", "lab-nope"],
        steps: { "lab-rag": [0, "2", 2, 99, -1, 1.5], "lab-nope": [0], "lab-attention": "bad" },
        hours: 999,
        goal: "nope",
        niche: "nope",
      },
      ai
    );
    expect(p.done).toEqual(["karpathy-intro-llms"]);
    expect(p.saved).toEqual(["mcp-spec"]);
    expect(p.shipped).toEqual(["lab-rag"]);
    expect(p.steps).toEqual({ "lab-rag": [0, 2] });
    expect(p.hours).toBe(30);
    expect(p.goal).toBe("freelance");
  });

  it("clamps hours into range and handles non-numbers", () => {
    expect(clampHours(1)).toBe(4);
    expect(clampHours("10.6")).toBe(11);
    expect(clampHours("abc", 9)).toBe(9);
  });
});

describe("legacy migration", () => {
  it("maps v3 keys and renamed ids", () => {
    const store = {
      "ai0.ai.doneResources": ["anthropic-contextual", "karpathy-intro-llms", "deleted-resource"],
      "ai0.ai.savedResources": ["anthropic-building-agents"],
      "ai0.ai.doneLabs": ["lab-rag-citations"],
      "ai0.ai.hours": 20,
      "ai0.ai.goal": "job",
    };
    const raw = migrateLegacy("ai", (k) => store[k] ?? null);
    const p = sanitizeProgress(raw, ai);
    expect(p.done).toEqual(["contextual-retrieval", "karpathy-intro-llms"]);
    expect(p.saved).toEqual(["building-effective-agents"]);
    expect(p.shipped).toEqual(["lab-rag"]);
    expect(p.hours).toBe(20);
    expect(p.goal).toBe("job");
  });

  it("returns null when there is nothing to migrate", () => {
    expect(migrateLegacy("pm", () => null)).toBeNull();
  });
});

describe("import / export", () => {
  it("round-trips a v4 export", () => {
    const progress = sanitizeProgress({ done: ["mom-test"], shipped: ["pm-lab-prd"], hours: 8, goal: "ai" }, pm);
    const payload = JSON.parse(JSON.stringify(exportPayload(progress, "pm")));
    expect(payload.version).toBe(PROGRESS_VERSION);
    expect(payload.pathId).toBe("pm");
    expect(parseImport(payload, pm)).toEqual(progress);
  });

  it("accepts a v3 export", () => {
    const p = parseImport(
      { version: 3, done: ["intercom-rice"], labs: ["pm-lab-real-prd"], weeklyHours: 6, selectedNiche: "apm-faang" },
      pm
    );
    expect(p.done).toEqual(["rice"]);
    expect(p.shipped).toEqual(["pm-lab-prd"]);
    expect(p.hours).toBe(6);
    expect(p.niche).toBe("apm");
  });

  it("rejects non-objects", () => {
    expect(parseImport("nope", ai)).toBeNull();
  });

  it("writes a markdown report", () => {
    const md = progressMarkdown(sanitizeProgress({ done: ["mcp-spec"], shipped: ["lab-rag"] }, ai), ai);
    expect(md).toContain("# AI Engineering — progress");
    expect(md).toContain("- [x] Cited RAG assistant — shipped");
    expect(md).toContain("[MCP specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)");
  });
});
