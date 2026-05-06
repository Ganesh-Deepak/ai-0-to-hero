// Concept cheat sheets. The "Concepts" tab shows these as interactive
// reference panels — not tutorials, but canonical snapshots.

import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clipboard,
  FlaskConical,
  Layers3,
  Library,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";

export const architectureLayers = [
  { id: "model", label: "Model", icon: Sparkles, detail: "Reasoning, generation, structured output." },
  { id: "prompt", label: "Instruction", icon: Clipboard, detail: "Role, task, constraints, examples, output contract." },
  { id: "retrieval", label: "Retrieval", icon: Library, detail: "Documents, embeddings, hybrid search, reranking, citations." },
  { id: "tools", label: "Tools", icon: TerminalSquare, detail: "APIs, functions, MCP tools — side effects in the real world." },
  { id: "state", label: "State", icon: Layers3, detail: "Memory, checkpoints, sessions, artifacts, replay." },
  { id: "evals", label: "Evals", icon: FlaskConical, detail: "Datasets, graders, traces, regression, error analysis." },
  { id: "human", label: "Human Gate", icon: ShieldCheck, detail: "Approval, edit, reject — and an immutable audit trail." },
];

export const agentPatterns = [
  {
    title: "Prompt Chaining",
    cost: "Low",
    reliability: "High",
    use: "Clear, decomposable tasks where each step improves accuracy (e.g., outline → draft → edit).",
    avoid: "Open-ended problems where the path isn't known.",
  },
  {
    title: "Routing",
    cost: "Low",
    reliability: "High",
    use: "Distinct task categories that need different prompts or tools (triage, support, RAG routing).",
    avoid: "When categories are genuinely fuzzy — let the downstream agent decide.",
  },
  {
    title: "Parallelization",
    cost: "Medium",
    reliability: "High",
    use: "Independent subtasks (voting, ensembling) or breadth-first info gathering.",
    avoid: "Sequential workflows — you just add cost and latency.",
  },
  {
    title: "Orchestrator-Workers",
    cost: "High",
    reliability: "Medium",
    use: "Dynamic, variable subtasks where the decomposition isn't predictable.",
    avoid: "Anything a deterministic pipeline could handle — the cost explodes.",
  },
  {
    title: "Evaluator-Optimizer",
    cost: "Medium",
    reliability: "High",
    use: "Tasks with clear evaluation criteria and room for iterative improvement (translation, copy).",
    avoid: "Subjective quality where your evaluator will just match your generator.",
  },
  {
    title: "Autonomous Agent",
    cost: "Very High",
    reliability: "Unpredictable",
    use: "Genuinely open-ended tasks with tool use, verifiable end-states, and blast-radius isolation.",
    avoid: "Anything scoped. Anything where a workflow works.",
  },
];

export const ragFailureModes = [
  {
    title: "Low recall",
    icon: AlertTriangle,
    signal: "The right answer is in your docs but never retrieved.",
    fix: "Better chunking. Hybrid BM25+vector. Query rewriting. Metadata filters. Contextual retrieval.",
  },
  {
    title: "Low precision",
    icon: AlertTriangle,
    signal: "Retrieved chunks are topically close but not actually relevant.",
    fix: "Cross-encoder reranker. Reduce top-k. Domain filters. Better embeddings (e.g., voyage, text-embedding-3-large).",
  },
  {
    title: "Hallucination",
    icon: AlertTriangle,
    signal: "Confident answer not supported by any retrieved chunk.",
    fix: "Mandatory citations. Faithfulness eval in CI. Refusal rules. Grounding prompts.",
  },
  {
    title: "Prompt injection",
    icon: ShieldCheck,
    signal: "A document in the corpus contains instructions the model obeys.",
    fix: "Separate trusted instructions from retrieved text. Red-team with adversarial chunks. Scoped tool access.",
  },
  {
    title: "Context dilution",
    icon: Zap,
    signal: "Answers get worse as you stuff more context in.",
    fix: "Fewer, higher-quality chunks. Rerank. Summarize long chunks. Prompt caching for stable prefixes.",
  },
  {
    title: "Stale index",
    icon: Brain,
    signal: "Docs changed; retrieval returns yesterday's reality.",
    fix: "Incremental indexing. TTLs on embeddings. Source-of-truth sync job with alerts.",
  },
];

export const evalPlaybook = [
  {
    stage: "Error Analysis",
    icon: CheckCircle2,
    detail: "Read 50 outputs. Tag failure modes. Build intuition before metrics.",
  },
  {
    stage: "Golden Set",
    icon: Library,
    detail: "10-30 cases covering the main modes. This is your regression net.",
  },
  {
    stage: "Metrics",
    icon: FlaskConical,
    detail: "Deterministic first (regex, structured checks). LLM-as-judge only where needed, calibrated to humans.",
  },
  {
    stage: "CI Integration",
    icon: TerminalSquare,
    detail: "Block merges on regressions. Cheap and fast beats comprehensive.",
  },
  {
    stage: "Production Feedback",
    icon: Zap,
    detail: "Capture thumbs / corrections. Funnel every interesting trace back into the golden set.",
  },
];
