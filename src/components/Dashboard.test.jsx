import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Dashboard from "./Dashboard";
import { labs } from "../data/labs";
import { resources } from "../data/resources";

describe("Dashboard", () => {
  it("shows the total unread priority count, not only the preview count", () => {
    const priorityCount = resources.filter((resource) => resource.priority === 1)
      .length;

    render(
      <Dashboard
        doneLabs={new Set()}
        doneResources={new Set()}
        goToLabs={vi.fn()}
        goToLibrary={vi.fn()}
        goToLibraryIntent={vi.fn()}
        goToPhase={vi.fn()}
        labs={labs}
        resources={resources}
        savedResources={new Set()}
      />
    );

    const priorityCard = screen.getByText("Priority reading").closest("button");
    expect(priorityCard).toHaveTextContent(`${priorityCount} unread`);
  });
});
