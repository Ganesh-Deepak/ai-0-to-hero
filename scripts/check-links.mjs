import { paths } from "../src/data/paths.js";

const resources = paths.flatMap((path) =>
  path.resources.map((r) => ({ ...r, _pathId: path.id }))
);

const timeoutMs = Number(process.env.LINK_CHECK_TIMEOUT_MS || 15000);
const concurrency = Number(process.env.LINK_CHECK_CONCURRENCY || 8);
const retryableStatuses = new Set([403, 404, 405, 429]);
const acceptableBlockedStatuses = new Set([401, 403, 429]);

async function checkResource(resource) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const request = {
    headers: { "user-agent": "Mozilla/5.0 link-audit AI-0-to-hero" },
    redirect: "follow",
    signal: controller.signal,
  };

  try {
    let response = await fetch(resource.url, { ...request, method: "HEAD" });
    if (retryableStatuses.has(response.status) || response.status >= 500) {
      response = await fetch(resource.url, { ...request, method: "GET" });
    }
    return {
      finalUrl: response.url,
      id: resource.id,
      ok: response.ok || acceptableBlockedStatuses.has(response.status),
      status: response.status,
      title: resource.title,
      url: resource.url,
    };
  } catch (error) {
    return {
      error: error.name === "AbortError" ? "timeout" : error.message,
      id: resource.id,
      ok: false,
      status: "ERR",
      title: resource.title,
      url: resource.url,
    };
  } finally {
    clearTimeout(timer);
  }
}

let nextIndex = 0;
const results = [];

async function worker() {
  while (nextIndex < resources.length) {
    const currentIndex = nextIndex;
    nextIndex += 1;
    results[currentIndex] = await checkResource(resources[currentIndex]);
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, resources.length) }, () => worker())
);

const failures = results.filter((result) => !result.ok);
const blocked = results.filter((result) =>
  acceptableBlockedStatuses.has(result.status)
);
const statusCounts = results.reduce((counts, result) => {
  counts[result.status] = (counts[result.status] || 0) + 1;
  return counts;
}, {});

console.log(
  JSON.stringify(
    {
      checked: results.length,
      failures,
      blocked,
      statusCounts,
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
