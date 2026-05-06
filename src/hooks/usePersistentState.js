import React from "react";

const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("ai0:persist", { detail: { key } })
        );
      }
    } catch {}
  },
};

export function useSaveIndicator() {
  const [savedAt, setSavedAt] = React.useState(null);
  React.useEffect(() => {
    let timer;
    const onPersist = () => {
      setSavedAt(Date.now());
      clearTimeout(timer);
      timer = setTimeout(() => setSavedAt(null), 1400);
    };
    window.addEventListener("ai0:persist", onPersist);
    return () => {
      window.removeEventListener("ai0:persist", onPersist);
      clearTimeout(timer);
    };
  }, []);
  return savedAt;
}

export function usePersistentState(key, fallback) {
  const [value, setValue] = React.useState(() => storage.get(key, fallback));
  const lastKeyRef = React.useRef(key);
  // Reload value when the storage key changes (e.g. switching career paths).
  // Each path namespaces its own progress, so a key change should hydrate
  // from the new key rather than overwrite it with the prior path's state.
  React.useEffect(() => {
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    setValue(storage.get(key, fallback));
  }, [key, fallback]);
  const setAndPersist = React.useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        storage.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );
  return [value, setAndPersist];
}

export function usePersistentSet(key) {
  const [stored, setStored] = usePersistentState(key, []);
  const set = React.useMemo(() => new Set(stored), [stored]);
  const toggle = React.useCallback(
    (id) => {
      setStored((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return [...next];
      });
    },
    [setStored]
  );
  const add = React.useCallback(
    (id) => setStored((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [setStored]
  );
  const clear = React.useCallback(() => setStored([]), [setStored]);
  const actions = React.useMemo(
    () => ({ toggle, add, clear, setAll: setStored }),
    [toggle, add, clear, setStored]
  );
  return [set, actions];
}

export function usePersistentMap(key, fallback = {}) {
  return usePersistentState(key, fallback);
}
