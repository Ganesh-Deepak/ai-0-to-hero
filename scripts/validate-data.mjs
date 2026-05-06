import { paths } from "../src/data/paths.js";

const errors = [];
const warnings = [];

function collectIds(items, name) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id) {
      errors.push(`${name}: item is missing id`);
      continue;
    }
    if (seen.has(item.id)) errors.push(`${name}: duplicate id "${item.id}"`);
    seen.add(item.id);
  }
  return seen;
}

function requireFields(item, fields, label) {
  for (const field of fields) {
    if (item[field] === undefined || item[field] === "") {
      errors.push(`${label}: missing ${field}`);
    }
  }
}

function assertKnown(id, known, label) {
  if (!known.has(id)) errors.push(`${label}: unknown id "${id}"`);
}

function assertUrl(url, label) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      errors.push(`${label}: URL must be http(s), got "${url}"`);
    }
  } catch {
    errors.push(`${label}: invalid URL "${url}"`);
  }
}

const summary = {};

for (const path of paths) {
  const tag = `[${path.id}]`;
  const {
    topics,
    phases,
    labs,
    labGuides,
    resources,
    resourceLevels,
    resourceTypes,
    architectureLayers,
    revenueNiches,
    goals,
  } = path;

  const topicIds = collectIds(topics, `${tag} topics`);
  const phaseIds = collectIds(phases, `${tag} phases`);
  const labIds = collectIds(labs, `${tag} labs`);
  const resourceIds = collectIds(resources, `${tag} resources`);
  const layerIds = collectIds(architectureLayers, `${tag} architectureLayers`);
  collectIds(revenueNiches, `${tag} revenueNiches`);

  const levelSet = new Set(resourceLevels);
  const typeSet = new Set(resourceTypes);
  if (resourceLevels.length !== levelSet.size) {
    errors.push(`${tag} resourceLevels: duplicate values`);
  }
  if (resourceTypes.length !== typeSet.size) {
    errors.push(`${tag} resourceTypes: duplicate values`);
  }

  for (const topic of topics) {
    requireFields(topic, ["id", "name", "color", "signal", "why"], `${tag} topic ${topic.id}`);
  }

  for (const phase of phases) {
    requireFields(
      phase,
      ["id", "title", "weeks", "baseHours", "focus", "ship", "topics", "unlocks"],
      `${tag} phase ${phase.id}`
    );
    if (!Number.isFinite(phase.baseHours) || phase.baseHours <= 0) {
      errors.push(`${tag} phase ${phase.id}: baseHours must be positive`);
    }
    for (const topic of phase.topics || []) assertKnown(topic, topicIds, `${tag} phase ${phase.id}`);
    for (const prereq of phase.prereqs || []) assertKnown(prereq, phaseIds, `${tag} phase ${phase.id}`);
  }

  for (const resource of resources) {
    requireFields(
      resource,
      ["id", "topic", "type", "level", "time", "priority", "title", "source", "url", "why", "build"],
      `${tag} resource ${resource.id}`
    );
    assertKnown(resource.topic, topicIds, `${tag} resource ${resource.id}`);
    assertUrl(resource.url, `${tag} resource ${resource.id}`);
    if (!typeSet.has(resource.type)) errors.push(`${tag} resource ${resource.id}: unknown type "${resource.type}"`);
    if (!levelSet.has(resource.level)) errors.push(`${tag} resource ${resource.id}: unknown level "${resource.level}"`);
    if (![1, 2, 3].includes(resource.priority)) {
      errors.push(`${tag} resource ${resource.id}: priority must be 1, 2, or 3`);
    }
    if (!Array.isArray(resource.tags)) warnings.push(`${tag} resource ${resource.id}: tags should be an array`);
  }

  for (const lab of labs) {
    requireFields(
      lab,
      ["id", "topic", "phase", "title", "level", "estimate", "stack", "outcome", "acceptance", "proof", "revenue", "steps"],
      `${tag} lab ${lab.id}`
    );
    assertKnown(lab.topic, topicIds, `${tag} lab ${lab.id}`);
    assertKnown(lab.phase, phaseIds, `${tag} lab ${lab.id}`);
    if (!Array.isArray(lab.steps) || lab.steps.length === 0) {
      errors.push(`${tag} lab ${lab.id}: steps must be a non-empty array`);
    }
  }

  for (const [labId, guide] of Object.entries(labGuides)) {
    assertKnown(labId, labIds, `${tag} labGuide ${labId}`);
    requireFields(guide, ["quickStart", "prerequisites", "starter", "walkthrough", "gotchas", "verifyBy"], `${tag} labGuide ${labId}`);
    for (const resourceId of guide.linkedResourceIds || []) {
      assertKnown(resourceId, resourceIds, `${tag} labGuide ${labId}`);
    }
  }
  for (const lab of labs) {
    if (!labGuides[lab.id]) errors.push(`${tag} lab ${lab.id}: missing lab guide`);
  }

  for (const [goalId, goal] of Object.entries(goals)) {
    requireFields(goal, ["label", "note", "critical", "skip"], `${tag} goal ${goalId}`);
    for (const topic of goal.critical || []) assertKnown(topic, topicIds, `${tag} goal ${goalId}.critical`);
    for (const topic of goal.skip || []) assertKnown(topic, topicIds, `${tag} goal ${goalId}.skip`);
    for (const phaseId of Object.keys(goal.hourMultiplier || {})) assertKnown(phaseId, phaseIds, `${tag} goal ${goalId}.hourMultiplier`);
    for (const phaseId of Object.keys(goal.shipTweak || {})) assertKnown(phaseId, phaseIds, `${tag} goal ${goalId}.shipTweak`);
  }

  for (const niche of revenueNiches) {
    requireFields(niche, ["id", "label", "pain", "offer", "firstProject", "price", "proofNeeded"], `${tag} niche ${niche.id}`);
    for (const labId of niche.relatedLabs || []) assertKnown(labId, labIds, `${tag} niche ${niche.id}.relatedLabs`);
    for (const topic of niche.relatedTopics || []) assertKnown(topic, topicIds, `${tag} niche ${niche.id}.relatedTopics`);
  }

  for (const layer of architectureLayers) {
    requireFields(layer, ["id", "label", "detail"], `${tag} architectureLayer ${layer.id}`);
    assertKnown(layer.id, layerIds, `${tag} architectureLayer ${layer.id}`);
  }

  const urlBuckets = new Map();
  for (const resource of resources) {
    const bucket = urlBuckets.get(resource.url) || [];
    bucket.push(resource.id);
    urlBuckets.set(resource.url, bucket);
  }
  for (const [url, ids] of urlBuckets) {
    if (ids.length > 1) warnings.push(`${tag} duplicate URL ${url}: ${ids.join(", ")}`);
  }

  summary[path.id] = {
    topics: topics.length,
    phases: phases.length,
    resources: resources.length,
    labs: labs.length,
    labGuides: Object.keys(labGuides).length,
    revenueNiches: revenueNiches.length,
  };
}

const result = {
  paths: paths.map((p) => p.id),
  counts: summary,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exit(1);
