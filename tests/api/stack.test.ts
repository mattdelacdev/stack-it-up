import { describe, it, expect, vi, beforeEach } from "vitest";

const { selectMock, generateContent, checkAndRecord } = vi.hoisted(() => ({
  selectMock: vi.fn(),
  generateContent: vi.fn(),
  checkAndRecord: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getServerSupabase: async () => ({
    from: () => ({ select: selectMock }),
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkAndRecord: (...args: unknown[]) => checkAndRecord(...args),
  rateLimitMessage: () => "rate limited",
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: function () {
    return { models: { generateContent: (...args: unknown[]) => generateContent(...args) } };
  },
  Type: { OBJECT: "OBJECT", STRING: "STRING", ARRAY: "ARRAY" },
}));

import { POST } from "@/app/api/stack/route";

const ANSWERS = {
  goals: ["focus"],
  activity: "light",
  diet: "omnivore",
  sun: "medium",
  sleepQuality: "good",
  ageGroup: "30to50",
};

function req(body: unknown) {
  return new Request("http://localhost/api/stack", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("/api/stack POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
    checkAndRecord.mockResolvedValue({ allowed: true, retryAfterSec: 0, remainingDay: 5, remainingHour: 2, tier: "free" });
    selectMock.mockResolvedValue({
      data: [
        { id: "multi", name: "Multi", dose: "1", timing: "morning", why: "w", tag: "core" },
        { id: "caff-lth", name: "Caff", dose: "1", timing: "morning", why: "w", tag: "goal" },
        { id: "b12", name: "B12", dose: "1", timing: "morning", why: "w", tag: "lifestyle" },
      ],
      error: null,
    });
    generateContent.mockResolvedValue({
      text: JSON.stringify({
        summary: "Your stack",
        picks: [
          { id: "caff-lth", why: "for focus" },
          { id: "multi", why: "foundation" },
          { id: "bogus", why: "ignore me" },
          { id: "caff-lth", why: "dup" },
        ],
      }),
    });
  });

  it("500s when GEMINI_API_KEY missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await POST(req({ answers: ANSWERS }));
    expect(res.status).toBe(500);
  });

  it("400s when answers missing", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
  });

  it("429s when rate-limited", async () => {
    checkAndRecord.mockResolvedValueOnce({ allowed: false, retryAfterSec: 60, remainingDay: 0, remainingHour: 0, tier: "free" });
    const res = await POST(req({ answers: ANSWERS }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
  });

  it("returns sorted, deduped, catalog-filtered stack", async () => {
    const res = await POST(req({ answers: ANSWERS }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { summary: string; stack: { id: string; tag: string; why: string }[] };
    expect(body.summary).toBe("Your stack");
    expect(body.stack.map((s) => s.id)).toEqual(["multi", "caff-lth"]); // core before goal, dupes & unknown removed
    expect(body.stack[0].why).toBe("foundation");
  });

  it("maps quota errors to 429 with friendly message", async () => {
    generateContent.mockRejectedValueOnce(new Error("RESOURCE_EXHAUSTED: quota"));
    const res = await POST(req({ answers: ANSWERS }));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/quota/i);
  });

  it("maps generic errors to 500", async () => {
    generateContent.mockRejectedValueOnce(new Error("nope"));
    const res = await POST(req({ answers: ANSWERS }));
    expect(res.status).toBe(500);
  });
});
