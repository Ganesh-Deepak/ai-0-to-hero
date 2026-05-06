// Path registry. Each path bundles a complete, self-contained data set:
// topics, phases, resources, labs, lab guides, goals, concepts data,
// and "Revenue/Career" niches. The UI is fully driven by the active path.

import * as aiTopics from "./topics.js";
import * as aiPhases from "./phases.js";
import * as aiResources from "./resources.js";
import * as aiLabs from "./labs.js";
import * as aiLabGuides from "./labGuides.js";
import * as aiConcepts from "./concepts.js";
import * as aiRevenue from "./revenue.js";
import * as aiGoals from "./goals.js";

import * as pmTopics from "./pm/topics.js";
import * as pmPhases from "./pm/phases.js";
import * as pmResources from "./pm/resources.js";
import * as pmLabs from "./pm/labs.js";
import * as pmLabGuides from "./pm/labGuides.js";
import * as pmConcepts from "./pm/concepts.js";
import * as pmRevenue from "./pm/revenue.js";
import * as pmGoals from "./pm/goals.js";

const aiPath = {
  id: "ai",
  label: "AI Engineering",
  short: "AI",
  tagline: "0 → revenue-ready AI systems",
  brand: {
    letter: "A",
    name: "AI 0→Hero",
    sub: "personal workbench",
  },
  hero: {
    eyebrow: "The plan",
    h1Pre: "Learn, build, and ",
    h1Em: "package",
    h1Post: " revenue-ready AI systems.",
    lede: "A personal 16-week operating system for going from LLM basics to shipped, evaluated, sellable agent products. Every source is hand-picked. Every lab has a measurable proof. Every track ties to a real offer.",
  },
  sectionTitles: {
    dashboard: { label: "Dashboard", sub: "Your control room." },
    roadmap: { label: "Roadmap", sub: "A 16-week, personalized plan." },
    library: { label: "Library", sub: "Canonical sources — no filler." },
    labs: { label: "Labs", sub: "Ship one artifact at a time." },
    concepts: { label: "Concepts", sub: "Reference cards and cheat sheets." },
    revenue: { label: "Revenue", sub: "Capability into paid work." },
  },
  sectionLabels: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    library: "Library",
    labs: "Labs",
    concepts: "Concepts",
    revenue: "Revenue",
  },
  conceptsCopy: {
    eyebrow: "Cheat sheets",
    titlePre: "The ",
    titleEm: "harness",
    titlePost: " around the model.",
    lede: "Four reference cards: the architecture layers you compose, agent patterns ranked by cost & reliability, the RAG failure taxonomy, and the five-stage eval playbook.",
    composeTitle: "Compose the stack",
    flowTitle: "Request flow",
    flowLede: "Toggle layers to see the harness reshape. Most production apps land somewhere between five and seven of these.",
    patternsTitle: "Agent patterns, ranked",
    patternsLede: "The blunt truth from Anthropic's \"Building Effective Agents\": pick the simplest pattern that solves the problem. Most things don't need an autonomous agent.",
    failuresTitle: "RAG failure drill",
    failuresLede: "When retrieval is bad, the symptom lies. Diagnose the mode before reaching for a fix.",
    playbookTitle: "Eval playbook",
    playbookLede: "Evals are not a phase — they're the scaffolding the whole product hangs from. Start here on day one.",
    flowStart: "User request",
    flowEnd: "Logged answer",
  },
  revenueCopy: {
    eyebrow: "Commercial track",
    titlePre: "Turn capability into a ",
    titleEm: "paid",
    titlePost: " offer.",
    lede: "Pick a niche. Build the demo. Sell the fixed-scope starter. The four-step loop on the bottom is the entire playbook — treat it like a checklist, not a philosophy.",
    nicheLabel: "Niches",
    planEyebrow: "Build plan for this niche",
    planTitle: "Ship these labs in order — each one is a proof artifact you can put in the pitch.",
    windowLabel: "Window",
  },
  defaults: {
    selectedLayers: ["model", "prompt", "retrieval", "tools", "evals"],
    selectedNiche: aiRevenue.revenueNiches[0]?.id,
    goal: "freelance",
  },
  topics: aiTopics.topics,
  topicById: aiTopics.topicById,
  phases: aiPhases.phases,
  resources: aiResources.resources,
  resourceTypes: aiResources.resourceTypes,
  resourceLevels: aiResources.resourceLevels,
  resourceCatalogMeta: aiResources.resourceCatalogMeta,
  labs: aiLabs.labs,
  labGuides: aiLabGuides.labGuides,
  goals: aiGoals.goals,
  goalList: aiGoals.goalList,
  architectureLayers: aiConcepts.architectureLayers,
  agentPatterns: aiConcepts.agentPatterns,
  ragFailureModes: aiConcepts.ragFailureModes,
  evalPlaybook: aiConcepts.evalPlaybook,
  revenueNiches: aiRevenue.revenueNiches,
  revenueSteps: aiRevenue.revenueSteps,
};

const pmPath = {
  id: "pm",
  label: "Product Management",
  short: "PM",
  tagline: "APM → senior PM, with AI craft baked in",
  brand: {
    letter: "P",
    name: "PM 0→Hero",
    sub: "personal workbench",
  },
  hero: {
    eyebrow: "The plan",
    h1Pre: "Learn the craft, build the ",
    h1Em: "portfolio",
    h1Post: ", land the PM role.",
    lede: "A personal 16-week operating system for going from PM curious to APM-ready (or from PM to AI PM). Every source is free, hand-picked, and earns its slot. Every lab is a portfolio artifact. Every track maps to a real role.",
  },
  sectionTitles: {
    dashboard: { label: "Dashboard", sub: "Your control room." },
    roadmap: { label: "Roadmap", sub: "A 16-week, personalized plan." },
    library: { label: "Library", sub: "Canonical PM sources — free, no filler." },
    labs: { label: "Labs", sub: "Portfolio artifacts, one at a time." },
    concepts: { label: "Concepts", sub: "Frameworks, anti-patterns, metrics playbook." },
    revenue: { label: "Career", sub: "Specializations and target roles." },
  },
  sectionLabels: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    library: "Library",
    labs: "Labs",
    concepts: "Concepts",
    revenue: "Career",
  },
  conceptsCopy: {
    eyebrow: "Cheat sheets",
    titlePre: "The ",
    titleEm: "harness",
    titlePost: " around the PM role.",
    lede: "Four reference cards: the discovery-to-launch stack, prioritization frameworks ranked by cost & reliability, PM anti-patterns to spot early, and the five-stage metrics playbook.",
    composeTitle: "Compose the PM stack",
    flowTitle: "Discovery → Launch flow",
    flowLede: "Toggle layers to reshape the stack. Strong PM weeks usually touch four or five of these layers — not all seven, not just one.",
    patternsTitle: "Prioritization frameworks, ranked",
    patternsLede: "Frameworks are anchors, not answers. Pick one per scope (sprint, quarter, roadmap). Most teams over-RICE and under-LNO.",
    failuresTitle: "PM anti-patterns",
    failuresLede: "When the team feels busy but the user impact is flat, one of these is usually the cause. Diagnose before reorganizing.",
    playbookTitle: "Metrics playbook",
    playbookLede: "Metrics are not a phase — they're the scaffolding every roadmap defense rests on. Build them with the strategy, not after.",
    flowStart: "User outcome",
    flowEnd: "Shipped + measured",
  },
  revenueCopy: {
    eyebrow: "Career track",
    titlePre: "Turn the craft into a ",
    titleEm: "role",
    titlePost: " offer.",
    lede: "Pick a specialization. Build the portfolio. Run the interview loop deliberately. The four-step loop on the bottom is the entire playbook — treat it like a checklist, not a philosophy.",
    nicheLabel: "Specializations",
    planEyebrow: "Portfolio plan for this role",
    planTitle: "Ship these labs in order — each one is a portfolio artifact you can show in a recruiter screen.",
    windowLabel: "Timeline",
  },
  defaults: {
    selectedLayers: ["outcome", "discovery", "spec", "delivery", "metrics"],
    selectedNiche: pmRevenue.revenueNiches[0]?.id,
    goal: "apm",
  },
  topics: pmTopics.topics,
  topicById: pmTopics.topicById,
  phases: pmPhases.phases,
  resources: pmResources.resources,
  resourceTypes: pmResources.resourceTypes,
  resourceLevels: pmResources.resourceLevels,
  resourceCatalogMeta: pmResources.resourceCatalogMeta,
  labs: pmLabs.labs,
  labGuides: pmLabGuides.labGuides,
  goals: pmGoals.goals,
  goalList: pmGoals.goalList,
  architectureLayers: pmConcepts.architectureLayers,
  agentPatterns: pmConcepts.agentPatterns,
  ragFailureModes: pmConcepts.ragFailureModes,
  evalPlaybook: pmConcepts.evalPlaybook,
  revenueNiches: pmRevenue.revenueNiches,
  revenueSteps: pmRevenue.revenueSteps,
};

export const paths = [aiPath, pmPath];

export const pathById = Object.fromEntries(paths.map((p) => [p.id, p]));

export const DEFAULT_PATH_ID = "ai";

export function getPath(id) {
  return pathById[id] || pathById[DEFAULT_PATH_ID];
}
