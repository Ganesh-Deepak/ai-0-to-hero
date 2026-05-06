import React from "react";
import { getPath, DEFAULT_PATH_ID } from "../data/paths";

export const PathContext = React.createContext(getPath(DEFAULT_PATH_ID));

export function usePath() {
  return React.useContext(PathContext);
}
