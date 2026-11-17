// Tiny hash router: #/<path>/<section>[/<id>][?query]
import React from "react";

export const SECTIONS = ["plan", "library", "labs", "reference", "offers"];

export function parseHash(hash, validPaths, fallbackPath) {
  const [pathPart, queryPart = ""] = hash.replace(/^#\/?/, "").split("?");
  const [p, s, id] = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  const pathId = validPaths.has(p) ? p : fallbackPath;
  const section = SECTIONS.includes(s) ? s : "plan";
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  return { pathId, section, id: section === "labs" ? id || null : null, query };
}

export function buildHash({ pathId, section = "plan", id = null, query = {} }) {
  const parts = [pathId, section, id].filter(Boolean).map(encodeURIComponent);
  const q = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return `#/${parts.join("/")}${q ? `?${q}` : ""}`;
}

export function useHash() {
  const [hash, setHash] = React.useState(() => window.location.hash);
  React.useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export function navigate(hash, { replace = false } = {}) {
  if (window.location.hash === hash) return;
  if (replace) {
    window.history.replaceState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = hash;
  }
}
