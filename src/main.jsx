import React from "react";
import { createRoot } from "react-dom/client";
// Fallback only: the site is set in Sitka, which Windows provides. This
// face is downloaded only on systems where Sitka is not installed.
import "@fontsource-variable/newsreader/opsz.css";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
