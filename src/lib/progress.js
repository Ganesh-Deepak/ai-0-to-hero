// Progress model, sanitation, legacy migration and import/export.
// Everything read from storage or an imported file goes through
// sanitizeProgress before the UI sees it.

export const PROGRESS_VERSION = 4;
export const MIN_HOURS = 4;
export const MAX_HOURS = 30;
export const DEFAULT_HOURS = 12;

export function storageKey(pathId) {
  return `ai0.v4.${pathId}`;
}

export function emptyProgress(path) {
  return {
    version: PROGRESS_VERSION,
    done: [],
    saved: [],
    shipped: [],
    steps: {},
    hours: DEFAULT_HOURS,
    goal: path.defaultGoal,
    niche: path.offers.niches[0]?.id ?? null,
  };
}

export function clampHours(value, fallback = DEFAULT_HOURS) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_HOURS, Math.max(MIN_HOURS, Math.round(n)));
}

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

function knownIds(value, known) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const id of value) {
    if (typeof id === "string" && known.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

function sanitizeSteps(value, path) {
  if (!isObject(value)) return {};
  const out = {};
  for (const [labId, list] of Object.entries(value)) {
    const lab = path.labById[labId];
    if (!lab || !Array.isArray(list)) continue;
    const max = lab.steps.length - 1;
    const clean = [...new Set(list.map(Number))]
      .filter((i) => Number.isInteger(i) && i >= 0 && i <= max)
      .sort((a, b) => a - b);
    if (clean.length) out[labId] = clean;
  }
  return out;
}

export function sanitizeProgress(raw, path) {
  const base = emptyProgress(path);
  if (!isObject(raw)) return base;
  const resourceIds = new Set(Object.keys(path.resourceById));
  const labIds = new Set(Object.keys(path.labById));
  const nicheIds = new Set(path.offers.niches.map((n) => n.id));
  return {
    version: PROGRESS_VERSION,
    done: knownIds(raw.done, resourceIds),
    saved: knownIds(raw.saved, resourceIds),
    shipped: knownIds(raw.shipped, labIds),
    steps: sanitizeSteps(raw.steps, path),
    hours: clampHours(raw.hours, base.hours),
    goal: typeof raw.goal === "string" && path.goals[raw.goal] ? raw.goal : base.goal,
    niche: typeof raw.niche === "string" && nicheIds.has(raw.niche) ? raw.niche : base.niche,
  };
}

// ── Legacy (v3) migration ────────────────────────────────────────────────
// v3 stored each field under its own key and used older ids. Lab step
// indexes are not migrated because the step lists were rewritten.

const ALIASES = {
  "anthropic-building-agents": "building-effective-agents",
  "anthropic-effective-agents": "building-effective-agents",
  "anthropic-context-engineering": "context-engineering",
  "anthropic-writing-tools": "writing-tools",
  "agent-sdk": "claude-agent-sdk",
  "anthropic-multi-agent-research": "multi-agent-research",
  "langgraph-overview": "langgraph",
  "temporal-ai": "temporal",
  "anthropic-contextual": "contextual-retrieval",
  "jason-liu-rag": "jxnl-rag",
  "mteb-leaderboard": "mteb",
  "colpali-visual-retrieval": "colpali",
  "3b1b-transformers": "3b1b-attention",
  "deepseek-r1-paper": "deepseek-r1",
  "anthropic-prompt-engineering": "claude-prompting",
  "anthropic-prompt-caching": "claude-prompt-caching",
  "llm-caching-anthropic": "claude-prompt-caching",
  "openai-responses-migration": "openai-responses",
  "vercel-ai-sdk": "ai-sdk",
  "shreya-evals": "shreya-validators",
  "inspect-ai": "inspect",
  "owasp-llm-top10": "owasp-llm",
  "simon-prompt-injection": "simon-injection",
  "claude-code-docs": "claude-code",
  "openrouter-gateway": "openrouter",
  "stanford-ai-index": "ai-index",
  "latentspace-podcast": "latent-space",
  "anthropic-docs-intro": "claude-docs",
  "cagan-svpg-articles": "svpg-articles",
  "lenny-pm-archive": "lenny-archive",
  "doshi-the-pm-stack": "shreyas",
  "looking-glass-julie": "looking-glass",
  "torres-opportunity-tree": "opportunity-tree",
  "torres-product-talk": "product-talk",
  "cagan-discovery-coach": "svpg-discovery",
  "stratechery-aggregation": "aggregation-theory",
  "sequoia-business-plan": "sequoia-plan",
  "intercom-rice": "rice",
  "gilad-confidence-meter": "confidence-meter",
  "what-matters-okrs": "okrs",
  "amazon-pr-faq": "pr-faq",
  "lenny-prd-template": "prd-template",
  "nn-group-articles": "nngroup",
  "growth-design-cases": "growth-design",
  "amplitude-north-star": "north-star",
  "balfour-growth-loops": "growth-loops",
  "lenny-ab-mistakes": "ab-testing",
  "kohavi-online-experiments": "exp-platform",
  "balfour-essays": "balfour",
  "verna-growth-scoop": "elena-verna",
  "mode-sql-tutorial": "sql-tutorial",
  "hamel-ai-product-evals": "hamel-evals",
  "hamel-llm-evals-faq": "hamel-evals-faq",
  "applied-llms-pm": "applied-llms",
  "google-pair-guidebook-pm": "pair-guidebook",
  "google-rules-of-ml-pm": "rules-of-ml",
  "nist-ai-rmf-pm": "nist-ai-rmf",
  "dunford-positioning": "dunford",
  "lenny-launches": "product-hunt",
  "cracking-pm-interview": "cracking-pm",
  "levels-fyi-pm": "levels-fyi",
  // labs
  "lab-rag-citations": "lab-rag",
  "lab-agent-router": "lab-agent",
  "lab-langgraph-workflow": "lab-durable",
  "lab-transformer-notebook": "lab-attention",
  "lab-n8n-client-automation": "lab-automation",
  "lab-revenue-demo": "lab-offer",
  "pm-lab-operating-principles": "pm-lab-principles",
  "pm-lab-discovery-interviews": "pm-lab-interviews",
  "pm-lab-strategy-narrative": "pm-lab-strategy",
  "pm-lab-real-prd": "pm-lab-prd",
  "pm-lab-experiment-plan": "pm-lab-experiment",
  "pm-lab-ai-feature-spec": "pm-lab-ai-spec",
  // niches
  "apm-faang": "apm",
  "founder-zero-one": "founder",
};

export const alias = (id) => (typeof id === "string" && ALIASES[id]) || id;
const aliasAll = (list) => (Array.isArray(list) ? list.map(alias) : []);

export function migrateLegacy(pathId, read) {
  const get = (name) => read(`ai0.${pathId}.${name}`);
  const done = get("doneResources");
  const saved = get("savedResources");
  const labs = get("doneLabs");
  const hours = get("hours");
  const goal = get("goal");
  const niche = get("niche");
  const found = [done, saved, labs, hours, goal, niche].some((v) => v !== null && v !== undefined);
  if (!found) return null;
  return {
    done: aliasAll(done),
    saved: aliasAll(saved),
    shipped: aliasAll(labs),
    hours,
    goal,
    niche: alias(niche),
  };
}

// Accepts a v4 export or a v3 export ({ done, saved, labs, weeklyHours, … }).
export function parseImport(json, path) {
  if (!isObject(json)) return null;
  if (json.version === PROGRESS_VERSION) return sanitizeProgress(json, path);
  return sanitizeProgress(
    {
      done: aliasAll(json.done),
      saved: aliasAll(json.saved),
      shipped: aliasAll(json.labs),
      hours: json.weeklyHours,
      goal: json.goal,
      niche: alias(json.selectedNiche),
    },
    path
  );
}

export function exportPayload(progress, pathId) {
  return { ...progress, pathId, exportedAt: new Date().toISOString() };
}

export function progressMarkdown(progress, path) {
  const date = new Date().toISOString().slice(0, 10);
  const done = new Set(progress.done);
  const shipped = new Set(progress.shipped);
  const lines = [
    `# ${path.label} — progress`,
    "",
    `Exported ${date} · goal: ${path.goals[progress.goal]?.label} · ${progress.hours} h/week`,
    "",
    `- Sources read: ${done.size} / ${path.resources.length}`,
    `- Labs shipped: ${shipped.size} / ${path.labs.length}`,
    `- Saved for later: ${progress.saved.length}`,
    "",
    "## Labs",
    ...path.labs.map((lab) => {
      const n = (progress.steps[lab.id] || []).length;
      const status = shipped.has(lab.id) ? "shipped" : `${n}/${lab.steps.length} steps`;
      return `- ${shipped.has(lab.id) ? "[x]" : "[ ]"} ${lab.title} — ${status}`;
    }),
  ];
  for (const topic of path.topics) {
    const read = path.resources.filter((r) => r.topic === topic.id && done.has(r.id));
    if (!read.length) continue;
    lines.push("", `## ${topic.name}`, ...read.map((r) => `- [${r.title}](${r.url}) — ${r.source}`));
  }
  return lines.join("\n") + "\n";
}
