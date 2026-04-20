import { describe, it, expect } from "vitest";
import { benefits } from "@/lib/benefits";

describe("benefits data", () => {
  it("covers the four benefit slugs", () => {
    expect(Object.keys(benefits).sort()).toEqual(["energy", "immunity", "performance", "sleep"]);
  });

  it("each benefit has non-empty core fields", () => {
    for (const b of Object.values(benefits)) {
      expect(b.title).toBeTruthy();
      expect(b.tagline).toBeTruthy();
      expect(b.intro.length).toBeGreaterThan(0);
      expect(b.signs.length).toBeGreaterThan(0);
      expect(b.highlights.length).toBeGreaterThan(0);
      expect(b.staples.length).toBeGreaterThan(0);
      expect(b.faq.length).toBeGreaterThan(0);
      for (const s of b.staples) {
        expect(s.name && s.mechanism && s.dose && s.timing).toBeTruthy();
      }
    }
  });
});
