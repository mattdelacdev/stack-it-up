// @vitest-environment node
import { describe, it, expect } from "vitest";
import { rateLimitMessage } from "@/lib/rate-limit";

describe("rateLimitMessage", () => {
  it("under 90s → 'in a minute'", () => {
    expect(rateLimitMessage({ allowed: false, retryAfterSec: 30, remainingHour: 0, remainingDay: 0, tier: "free" }))
      .toContain("in a minute");
  });
  it("minutes range", () => {
    const msg = rateLimitMessage({ allowed: false, retryAfterSec: 10 * 60, remainingHour: 0, remainingDay: 0, tier: "free" });
    expect(msg).toContain("about 10 minutes");
  });
  it("hour range singular/plural", () => {
    const one = rateLimitMessage({ allowed: false, retryAfterSec: 60 * 60, remainingHour: 0, remainingDay: 0, tier: "free" });
    expect(one).toContain("about 1 hour");
    expect(one).not.toContain("hours");
    const many = rateLimitMessage({ allowed: false, retryAfterSec: 3 * 60 * 60, remainingHour: 0, remainingDay: 0, tier: "free" });
    expect(many).toContain("about 3 hours");
  });
});
