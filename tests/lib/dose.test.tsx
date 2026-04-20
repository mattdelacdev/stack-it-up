import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { formatDose, hasStructuredDose, hasDoseConversion, DualDose } from "@/lib/dose";

describe("formatDose", () => {
  it("falls back to dose string when no structured data", () => {
    expect(formatDose({ dose: "1 scoop", dose_low: null }, "native")).toBe("1 scoop");
  });

  it("renders native mg range", () => {
    expect(
      formatDose({ dose: "", dose_low: 200, dose_high: 400, dose_unit: "mg" }, "native"),
    ).toBe("200–400 mg");
  });

  it("single value (no range) when low equals high or high is null", () => {
    expect(formatDose({ dose: "", dose_low: 5, dose_high: 5, dose_unit: "g" }, "native")).toBe("5 g");
    expect(formatDose({ dose: "", dose_low: 5, dose_high: null, dose_unit: "g" }, "native")).toBe("5 g");
  });

  it("IU → mcg SI conversion for vitamin D", () => {
    expect(
      formatDose({ dose: "", dose_low: 2000, dose_high: 5000, dose_unit: "IU" }, "si"),
    ).toBe("50–125 mcg");
  });

  it("mcg → mg SI conversion when ≥1000", () => {
    expect(
      formatDose({ dose: "", dose_low: 1000, dose_high: 2000, dose_unit: "mcg" }, "si"),
    ).toBe("1–2 mg");
  });

  it("g → mg SI conversion when sub-gram", () => {
    expect(formatDose({ dose: "", dose_low: 0.5, dose_high: null, dose_unit: "g" }, "si")).toBe(
      "500 mg",
    );
  });

  it("capsule/scoop pluralization", () => {
    expect(formatDose({ dose: "", dose_low: 1, dose_unit: "capsule" }, "native")).toBe("1 capsule");
    expect(formatDose({ dose: "", dose_low: 2, dose_unit: "capsule" }, "native")).toBe("2 capsules");
    expect(formatDose({ dose: "", dose_low: 1, dose_unit: "scoop" }, "native")).toBe("1 scoop");
  });

  it("CFU-B formatter", () => {
    expect(formatDose({ dose: "", dose_low: 10, dose_unit: "CFU-B" }, "native")).toBe("10B CFU");
  });
});

describe("hasStructuredDose / hasDoseConversion", () => {
  it("detects structured dose", () => {
    expect(hasStructuredDose({ dose: "", dose_low: 200, dose_unit: "mg" })).toBe(true);
    expect(hasStructuredDose({ dose: "x", dose_low: null })).toBe(false);
  });

  it("detects convertible units", () => {
    expect(hasDoseConversion({ dose: "", dose_low: 2000, dose_unit: "IU" })).toBe(true);
    expect(hasDoseConversion({ dose: "", dose_low: 200, dose_unit: "mg" })).toBe(false);
  });
});

describe("DualDose", () => {
  it("renders a single span when no conversion", () => {
    const { container } = render(<DualDose s={{ dose: "1 scoop", dose_low: null }} />);
    expect(container.textContent).toBe("1 scoop");
  });

  it("renders both variants when conversion applies", () => {
    const { container } = render(
      <DualDose s={{ dose: "", dose_low: 2000, dose_high: null, dose_unit: "IU" }} />,
    );
    expect(container.querySelector('[data-dose-variant="native"]')?.textContent).toBe("2000 IU");
    expect(container.querySelector('[data-dose-variant="si"]')?.textContent).toBe("50 mcg");
  });
});
