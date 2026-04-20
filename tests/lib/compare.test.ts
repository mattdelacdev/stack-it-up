import { describe, it, expect } from "vitest";
import { comparePairs, getComparePair } from "@/lib/compare";

describe("comparePairs", () => {
  it("has unique slugs", () => {
    const slugs = comparePairs.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each pair has required fields populated", () => {
    for (const p of comparePairs) {
      expect(p.slug).toBeTruthy();
      expect(p.a).toBeTruthy();
      expect(p.b).toBeTruthy();
      expect(p.question).toBeTruthy();
      expect(p.verdict).toBeTruthy();
      expect(p.summary.length).toBeGreaterThan(20);
      expect(p.pickA.title).toBeTruthy();
      expect(p.pickB.title).toBeTruthy();
    }
  });

  it("getComparePair looks up by slug", () => {
    expect(getComparePair(comparePairs[0].slug)).toBe(comparePairs[0]);
    expect(getComparePair("nonexistent")).toBeUndefined();
  });
});
