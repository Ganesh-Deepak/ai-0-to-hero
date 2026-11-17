// Validates the data graph of every path: ids, references, required fields.
import { paths } from "../src/data/paths.js";

const errors = [];
const warnings = [];
const summary = {};

const need = (obj, fields, label) => {
  for (const f of fields) {
    const v = obj[f];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
      errors.push(`${label}: missing ${f}`);
    }
  }
};

const ids = (list, label) => {
  const seen = new Set();
  for (const item of list) {
    if (!item.id) errors.push(`${label}: item without id`);
    else if (seen.has(item.id)) errors.push(`${label}: duplicate id "${item.id}"`);
    seen.add(item.id);
  }
  return seen;
};

const known = (id, set, label) => {
  if (!set.has(id)) errors.push(`${label}: unknown id "${id}"`);
};

for (const path of paths) {
  const tag = `[${path.id}]`;
  need(path, ["id", "label", "short", "title", "lede", "reviewed", "offersLabel", "offersTitle", "offersLede"], `${tag} meta`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(path.reviewed)) errors.push(`${tag} meta: reviewed must be YYYY-MM-DD`);

  const topicIds = ids(path.topics, `${tag} topics`);
  const phaseIds = ids(path.phases, `${tag} phases`);
  const resourceIds = ids(path.resources, `${tag} resources`);
  const labIds = ids(path.labs, `${tag} labs`);
  ids(path.offers.niches, `${tag} niches`);

  for (const t of path.topics) need(t, ["name", "blurb"], `${tag} topic ${t.id}`);

  for (const p of path.phases) {
    need(p, ["title", "hours", "topics", "focus", "ship"], `${tag} phase ${p.id}`);
    if (!(p.hours > 0)) errors.push(`${tag} phase ${p.id}: hours must be positive`);
    for (const t of p.topics) known(t, topicIds, `${tag} phase ${p.id}`);
  }

  const urls = new Map();
  for (const r of path.resources) {
    const label = `${tag} resource ${r.id}`;
    need(r, ["topic", "title", "source", "url", "type", "time", "why", "todo"], label);
    known(r.topic, topicIds, label);
    if (typeof r.must !== "boolean") errors.push(`${label}: must should be boolean`);
    try {
      const u = new URL(r.url);
      if (!["http:", "https:"].includes(u.protocol)) errors.push(`${label}: URL must be http(s)`);
    } catch {
      errors.push(`${label}: invalid URL "${r.url}"`);
    }
    if (urls.has(r.url)) warnings.push(`${tag} duplicate URL ${r.url}: ${urls.get(r.url)}, ${r.id}`);
    urls.set(r.url, r.id);
  }

  for (const lab of path.labs) {
    const label = `${tag} lab ${lab.id}`;
    need(lab, ["phase", "title", "hours", "stack", "outcome", "done", "proof", "readings", "steps"], label);
    known(lab.phase, phaseIds, label);
    for (const id of lab.readings || []) known(id, resourceIds, `${label} readings`);
    for (const [i, step] of (lab.steps || []).entries()) {
      need(step, ["title", "body"], `${label} step ${i + 1}`);
      if (step.code && !step.lang) errors.push(`${label} step ${i + 1}: code needs lang`);
    }
    const titles = new Set((lab.steps || []).map((s) => s.title));
    if (titles.size !== (lab.steps || []).length) errors.push(`${label}: duplicate step titles`);
  }

  for (const phase of path.phases) {
    if (!path.labs.some((l) => l.phase === phase.id)) warnings.push(`${tag} phase ${phase.id}: has no lab`);
    if (!path.resources.some((r) => phase.topics.includes(r.topic))) errors.push(`${tag} phase ${phase.id}: has no sources`);
  }

  for (const [id, goal] of Object.entries(path.goals)) {
    const label = `${tag} goal ${id}`;
    need(goal, ["label", "note", "focus"], label);
    for (const t of [...(goal.focus || []), ...(goal.skim || [])]) known(t, topicIds, label);
    for (const p of Object.keys(goal.hours || {})) known(p, phaseIds, `${label}.hours`);
  }

  for (const n of path.offers.niches) {
    const label = `${tag} niche ${n.id}`;
    need(n, ["label", "pain", "offer", "first", "price", "metric", "labs"], label);
    for (const l of n.labs || []) known(l, labIds, label);
  }

  for (const key of ["patterns", "failures", "playbook", "stack"]) {
    const sec = path.reference[key];
    if (!sec?.title || !sec?.rows?.length) errors.push(`${tag} reference.${key}: needs title and rows`);
  }

  summary[path.id] = {
    topics: path.topics.length,
    phases: path.phases.length,
    resources: path.resources.length,
    core: path.resources.filter((r) => r.must).length,
    labs: path.labs.length,
    niches: path.offers.niches.length,
  };
}

console.log(JSON.stringify({ counts: summary, warnings, errors }, null, 2));
if (errors.length) process.exit(1);
