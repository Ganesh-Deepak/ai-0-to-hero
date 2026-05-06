// How each PM goal reshapes the roadmap.
//   - label/note: summary copy
//   - critical: topics that must be mastered for this goal
//   - skip: topics that can be skimmed
//   - hourMultiplier: per-phase hour adjustment (1 = default)
//   - shipTweak: goal-specific addendum appended to each phase's ship artifact

export const goals = {
  apm: {
    label: "APM / new PM",
    note: "Optimize for fundamentals + portfolio. Recruiters skim case studies, not Notion docs — make yours impossible to ignore.",
    critical: ["foundations", "discovery", "execution", "metrics", "career"],
    skip: ["growth"],
    hourMultiplier: {
      foundation: 1.15,
      discovery: 1.2,
      execution: 1.15,
      "ai-launch": 1.2,
    },
    shipTweak: {
      discovery: "…plus a public Loom walking through your interview synthesis. Recruiters click these.",
      execution: "…and post the PRD as a Notion case study with one screenshot.",
      "ai-launch": "…and a 5-question take-home cheat sheet for your top 3 target companies.",
    },
  },
  ai: {
    label: "AI Product Manager",
    note: "AI PM is a craft, not a topic. Spend extra hours where evals, model risk, and product loops collide.",
    critical: ["foundations", "discovery", "metrics", "ai-pm", "execution"],
    skip: ["growth", "career"],
    hourMultiplier: {
      strategy: 1.1,
      metrics: 1.2,
      "ai-launch": 1.4,
    },
    shipTweak: {
      strategy: "…plus a 'why now / why us / why this model' narrative for one bet.",
      metrics: "…with a hand-built eval set of 30 cases for one AI feature.",
      "ai-launch": "…and a model risk doc + monitoring plan reviewed by an engineer.",
    },
  },
  growth: {
    label: "Growth PM",
    note: "Loops first, dashboards second, ideas third. Most growth losses come from picking the wrong loop, not the wrong test.",
    critical: ["discovery", "metrics", "growth", "execution"],
    skip: ["career", "design"],
    hourMultiplier: {
      strategy: 0.85,
      metrics: 1.25,
      "ai-launch": 0.9,
    },
    shipTweak: {
      strategy: "…plus a one-page growth model with three identified loops.",
      metrics: "…with a written experiment review of one shipped + one killed test.",
    },
  },
  founder: {
    label: "0-1 / founder PM",
    note: "Speed of learning beats process. Your job is to be the company's tightest customer-feedback loop.",
    critical: ["foundations", "discovery", "strategy", "ai-pm"],
    skip: ["leadership", "career"],
    hourMultiplier: {
      discovery: 1.3,
      strategy: 1.15,
      execution: 0.85,
    },
    shipTweak: {
      foundation: "…plus a written hypothesis for who you're building for, what they hire it for, and your unfair angle.",
      discovery: "…and 10 customer interviews logged in a public format you can share with investors.",
      "ai-launch": "…and a 60-second demo video plus 10 cold messages sent.",
    },
  },
};

export const goalList = Object.entries(goals).map(([id, g]) => ({ id, ...g }));
