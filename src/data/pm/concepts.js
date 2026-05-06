// PM concept cheat sheets. The "Concepts" tab shows these as interactive
// reference panels — not tutorials, but canonical snapshots.

import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Compass,
  FlaskConical,
  Layers3,
  Library,
  Microscope,
  Rocket,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

// Re-using the shared component shape:
//   architectureLayers → "Discovery layers" (the PM equivalent stack)
//   agentPatterns      → "Prioritization frameworks, ranked"
//   ragFailureModes    → "PM anti-patterns / failure modes"
//   evalPlaybook       → "Metrics playbook"

export const architectureLayers = [
  { id: "outcome", label: "Outcome", icon: Target, detail: "The user-visible change you're trying to cause — not a feature, an effect." },
  { id: "discovery", label: "Discovery", icon: Microscope, detail: "Interviews, JTBD, opportunity solution trees." },
  { id: "strategy", label: "Strategy", icon: Compass, detail: "Positioning, narrative, principles, the 'why us / why now'." },
  { id: "spec", label: "Spec", icon: Library, detail: "PRDs, design intent, non-goals, risks, FAQ." },
  { id: "delivery", label: "Delivery", icon: Layers3, detail: "Sprints, rituals, unblocking, status that doesn't waste time." },
  { id: "metrics", label: "Metrics", icon: BarChart3, detail: "North Star, input metrics, guardrails, dashboards." },
  { id: "launch", label: "Launch", icon: Rocket, detail: "Tiers, GTM partnership, sales enablement, post-launch review." },
];

export const agentPatterns = [
  {
    title: "RICE",
    cost: "Low",
    reliability: "High",
    use: "Big roadmap-level prioritization where reach × impact dominates and team trust is shaky. The framework is the audit trail.",
    avoid: "When confidence numbers are pure guesses (which is most of the time). RICE rewards false precision.",
  },
  {
    title: "LNO (Leverage / Neutral / Overhead)",
    cost: "Low",
    reliability: "High",
    use: "Weekly task-level prioritization. The 60% of work that's N or O is your highest-leverage cut.",
    avoid: "Cross-team prioritization. LNO is for an individual or a sprint, not a roadmap.",
  },
  {
    title: "Cost of Delay (CD3)",
    cost: "Medium",
    reliability: "High",
    use: "When you need to convince finance or engineering. Reframes priority as 'what does each week of delay cost'.",
    avoid: "Early-stage products without a revenue model. The 'cost' part is too speculative.",
  },
  {
    title: "Kano Model",
    cost: "Medium",
    reliability: "Medium",
    use: "Distinguishing must-have from nice-to-have from delight. Survey-based, calibrated to a real user list.",
    avoid: "Engineering-internal work. Kano is a customer-facing tool.",
  },
  {
    title: "Opportunity Solution Tree",
    cost: "Medium",
    reliability: "High",
    use: "Anything that came out of discovery. Forces the link from outcome → opportunity → solution → experiment.",
    avoid: "Pre-discovery work. The tree is empty without real interview signal.",
  },
  {
    title: "Buy a Feature / Sticker Voting",
    cost: "Low",
    reliability: "Unpredictable",
    use: "Rapid stakeholder alignment in a workshop. Useful theater for getting people to commit to tradeoffs out loud.",
    avoid: "As your actual prioritization mechanism. It's a calibration tool, not a decision tool.",
  },
];

export const ragFailureModes = [
  {
    title: "Feature factory",
    icon: AlertTriangle,
    signal: "The team ships features on a cadence. No one can tell you what changed for users this quarter.",
    fix: "Replace output goals with outcome goals. Cancel one upcoming feature. Run discovery on the next bet before approving spec.",
  },
  {
    title: "Roadmap-as-promise",
    icon: AlertTriangle,
    signal: "Roadmap items are commitments to dates, not bets. Engineers code to dates, not to learning.",
    fix: "Switch to Now / Next / Later. Replace dates with appetites (Shape Up). Stop showing Gantt charts to non-engineers.",
  },
  {
    title: "No-discovery PRD",
    icon: AlertTriangle,
    signal: "The PRD's 'why' section cites a stakeholder request, not a customer signal.",
    fix: "Block PRDs that don't cite at least three independent customer signals. Discovery before delivery, every time.",
  },
  {
    title: "Vanity metric capture",
    icon: AlertTriangle,
    signal: "The team's metric goes up. The business's metric stays flat. North Star and inputs are misaligned.",
    fix: "Audit input metrics against North Star. Drop any that don't move it. Add a guardrail to every team metric.",
  },
  {
    title: "Stakeholder roulette",
    icon: Users,
    signal: "Roadmap shifts every time a senior stakeholder visits. PM has no defensible 'no' framework.",
    fix: "Write down the principles by which you say no. Share them up. Reference them in the rejection email — every time.",
  },
  {
    title: "AI-as-feature",
    icon: Sparkles,
    signal: "PM specifies an AI feature with no eval plan, no model risk doc, no kill switch.",
    fix: "Mandate an eval set + risk doc before any AI PRD ships to engineering. Treat AI features like infra: monitor, kill, roll back.",
  },
];

export const evalPlaybook = [
  {
    stage: "Define the metric",
    icon: Target,
    detail: "One North Star tied to user value. 2-3 input metrics that drive it. 1-2 guardrails so you don't game it.",
  },
  {
    stage: "Instrument honestly",
    icon: FlaskConical,
    detail: "Verify event tracking before you trust the dashboard. Log a denominator. Catch zeros and nulls explicitly.",
  },
  {
    stage: "Cohort + segment",
    icon: Library,
    detail: "Always look by signup cohort. Always check segments — overall numbers hide segment-level disasters.",
  },
  {
    stage: "Experiment",
    icon: Brain,
    detail: "Power analysis up front. Pre-write the kill condition. Don't peek. Compare against a guardrail, not just the primary.",
  },
  {
    stage: "Decide + write up",
    icon: CheckCircle2,
    detail: "Win, kill, or iterate. Write a 1-page post-mortem regardless of outcome. The killed tests teach more than the wins.",
  },
];
