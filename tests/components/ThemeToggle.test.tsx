import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.clear();
  });

  it("reads initial theme from <html data-theme>", () => {
    document.documentElement.dataset.theme = "light";
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/switch to dark theme/i);
  });

  it("toggles theme, updates html attribute and localStorage", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    await userEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
