import { describe, expect, it } from "vitest";

import { architectureLayers } from "../data/concepts";
import { goals } from "../data/goals";
import { labs } from "../data/labs";
import { phases } from "../data/phases";
import { resources } from "../data/resources";
import { revenueNiches } from "../data/revenue";
import { topics } from "../data/topics";
import {
  DEFAULT_SELECTED_LAYERS,
  PROGRESS_VERSION,
  createProgressPayload,
  sanitizeProgress,
} from "./progress";

const context = {
  architectureLayers,
  goals,
  labs,
  phases,
  resources,
  revenueNiches,
  topics,
};

describe("progress sanitation", () => {
  it("removes unknown ids and clamps unsafe scalar fields", () => {
    const sanitized = sanitizeProgress(
      {
        activePhase: "missing-phase",
        activeTopic: "missing-topic",
        done: ["karpathy-intro-llms", "missing-resource", "karpathy-intro-llms"],
        goal: "missing-goal",
        labTasks: {
          "lab-prompt-harness": [0, 0, "2", 99, -1],
          "missing-lab": [1],
        },
        labs: ["lab-rag-citations", "missing-lab"],
        libraryHighlight: ["openai-structured", "missing-resource"],
        saved: ["openai-cookbook", "missing-resource"],
        section: "bad-section",
        selectedLayersList: ["model", "bad-layer", "tools"],
        selectedNiche: "bad-niche",
        theme: "neon",
        weeklyHours: 999,
      },
      context
    );

    expect(sanitized.activePhase).toBeNull();
    expect(sanitized.activeTopic).toBe("all");
    expect(sanitized.done).toEqual(["karpathy-intro-llms"]);
    expect(sanitized.goal).toBe("freelance");
    expect(sanitized.labTasks).toEqual({ "lab-prompt-harness": [0, 2] });
    expect(sanitized.labs).toEqual(["lab-rag-citations"]);
    expect(sanitized.libraryHighlight).toEqual(["openai-structured"]);
    expect(sanitized.saved).toEqual(["openai-cookbook"]);
    expect(sanitized.section).toBe("dashboard");
    expect(sanitized.selectedLayersList).toEqual(["model", "tools"]);
    expect(sanitized.selectedNiche).toBe("local-services");
    expect(sanitized.theme).toBe("dark");
    expect(sanitized.weeklyHours).toBe(30);
  });

  it("falls back to default layers when every imported layer is invalid", () => {
    const sanitized = sanitizeProgress(
      { selectedLayersList: ["bad-layer"] },
      context
    );

    expect(sanitized.selectedLayersList).toEqual(DEFAULT_SELECTED_LAYERS);
  });

  it("exports a versioned payload with browser-state sets converted to arrays", () => {
    const payload = createProgressPayload({
      activePhase: "foundation",
      activeTopic: "llm",
      doneLabs: new Set(["lab-prompt-harness"]),
      doneResources: new Set(["openai-structured"]),
      goal: "job",
      labTasks: { "lab-prompt-harness": [0] },
      libraryHighlight: ["openai-structured"],
      savedResources: new Set(["openai-cookbook"]),
      section: "library",
      selectedLayersList: ["model"],
      selectedNiche: "support",
      theme: "light",
      weeklyHours: 10,
    });

    expect(payload.version).toBe(PROGRESS_VERSION);
    expect(payload.done).toEqual(["openai-structured"]);
    expect(payload.saved).toEqual(["openai-cookbook"]);
    expect(payload.labs).toEqual(["lab-prompt-harness"]);
    expect(payload.exportedAt).toEqual(expect.any(String));
  });
});
