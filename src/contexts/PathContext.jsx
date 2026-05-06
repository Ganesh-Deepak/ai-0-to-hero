import React from "react";
import { getPath } from "../data/paths";
import { PathContext } from "./pathContextValue";

export function PathProvider({ pathId, children }) {
  const path = React.useMemo(() => getPath(pathId), [pathId]);
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}
