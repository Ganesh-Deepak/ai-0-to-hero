import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

function go(hash) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  window.scrollTo = () => {};
});

describe("App", () => {
  it("renders the plan by default and canonicalises the URL", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /Learn, build and sell/ })).toBeInTheDocument();
    expect(window.location.hash).toBe("#/ai/plan");
  });

  it("persists a read toggle from the library", () => {
    render(<App />);
    go("#/ai/library?topic=mcp");
    const button = screen.getByRole("button", { name: "Mark “MCP specification 2026-07-28” as read" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    const stored = JSON.parse(localStorage.getItem("ai0.v4.ai"));
    expect(stored.done).toContain("mcp-spec");
  });

  it("filters the library by search text", () => {
    render(<App />);
    go("#/ai/library");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search the library" }), { target: { value: "pgvector" } });
    expect(screen.getByText("1 of 67 shown")).toBeInTheDocument();
  });

  it("tracks lab steps and keeps progress separate per path", () => {
    render(<App />);
    go("#/ai/labs/lab-rag");
    fireEvent.click(screen.getByRole("button", { name: "Mark step 1 as done" }));
    expect(screen.getByText("1/6 done")).toBeInTheDocument();
    go("#/pm/labs");
    expect(screen.getByRole("heading", { level: 1, name: "Labs" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("ai0.v4.ai")).steps).toEqual({ "lab-rag": [0] });
    expect(localStorage.getItem("ai0.v4.pm")).not.toContain("lab-rag");
  });

  it("migrates v3 progress on first load", () => {
    localStorage.setItem("ai0.ai.doneResources", JSON.stringify(["anthropic-contextual"]));
    render(<App />);
    expect(JSON.parse(localStorage.getItem("ai0.v4.ai")).done).toEqual(["contextual-retrieval"]);
  });

  it("opens the command palette and navigates to a lab", () => {
    render(<App />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const dialog = screen.getByRole("dialog", { name: "Search and commands" });
    const input = within(dialog).getByRole("combobox");
    fireEvent.change(input, { target: { value: "durable" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(window.location.hash).toBe("#/ai/labs/lab-durable");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
