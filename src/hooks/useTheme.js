import React from "react";
import { usePersistentState } from "./usePersistentState";

const THEMES = ["dark", "light"];

export function useTheme() {
  const [theme, setTheme] = usePersistentState("ai0.theme", "dark");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const cycle = React.useCallback(() => {
    setTheme((current) => {
      const idx = THEMES.indexOf(current);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, [setTheme]);

  return { theme, setTheme, cycle };
}
