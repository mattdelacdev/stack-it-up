import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Reveal from "@/components/Reveal";

describe("Reveal", () => {
  it("renders children and attaches reveal class", () => {
    const { container, getByText } = render(
      <Reveal className="extra">hello</Reveal>,
    );
    expect(getByText("hello")).toBeInTheDocument();
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("reveal");
    expect(el.className).toContain("extra");
    expect(el.style.transitionDelay).toBe("0ms");
  });

  it("renders the 'as' element when provided", () => {
    const { container } = render(<Reveal as="section">x</Reveal>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("applies transition delay", () => {
    const { container } = render(<Reveal delay={250}>x</Reveal>);
    expect((container.firstElementChild as HTMLElement).style.transitionDelay).toBe("250ms");
  });
});
