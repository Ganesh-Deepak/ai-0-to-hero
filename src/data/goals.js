// How each goal reshapes the roadmap.
//   - label/note: summary copy
//   - critical: topics that must be mastered for this goal
//   - skip: topics that can be skimmed
//   - hourMultiplier: per-phase hour adjustment (1 = default)
//   - shipTweak: goal-specific addendum appended to each phase's ship artifact

export const goals = {
  freelance: {
    label: "Freelance builder",
    note: "Ship weekly. Two paid pilots during the Revenue phase beats ten unshipped demos.",
    critical: ["rag", "agents", "automation", "revenue", "production"],
    skip: ["transformers"],
    hourMultiplier: {
      transformer: 0.6,
      production: 1.15,
    },
    shipTweak: {
      foundation: "…plus one paid scope-discovery call. Charge for clarity.",
      rag: "…scoped to one verticalised buyer (not a generic chatbot).",
      production: "…and a one-page fixed-scope starter offer in one niche.",
    },
  },
  startup: {
    label: "Micro-SaaS founder",
    note: "Pick a narrow wedge. Your evals are your moat once distribution is solved.",
    critical: ["rag", "agents", "evals", "orchestration", "production"],
    skip: ["revenue", "automation"],
    hourMultiplier: {
      rag: 1.2,
      orchestration: 1.2,
      production: 1.15,
    },
    shipTweak: {
      agents: "…plus a scoped landing page and a 50-person waitlist.",
      production: "…and a signed LOI or two paying pilot users.",
    },
  },
  job: {
    label: "AI engineer portfolio",
    note: "Every phase should leave a public artifact. The portfolio IS the interview.",
    critical: ["transformers", "rag", "agents", "evals", "safety"],
    skip: ["revenue", "automation"],
    hourMultiplier: {
      transformer: 1.3,
      rag: 1.15,
      production: 0.85,
    },
    shipTweak: {
      transformer: "…plus a public writeup with your diagrams.",
      rag: "…and a short blog post explaining one tradeoff you made.",
      agents: "…with a trace viewer you can demo live.",
    },
  },
  internal: {
    label: "Internal automation lead",
    note: "Trust and safety matter more than speed. Budget an extra week on evals.",
    critical: ["safety", "evals", "orchestration", "production"],
    skip: ["revenue"],
    hourMultiplier: {
      orchestration: 1.2,
      production: 1.2,
    },
    shipTweak: {
      agents: "…plus an AI-BOM reviewed with your security team.",
      orchestration: "…and explicit approval policies documented.",
      production: "…and a production runbook with escalation paths.",
    },
  },
};

export const goalList = Object.entries(goals).map(([id, g]) => ({ id, ...g }));
