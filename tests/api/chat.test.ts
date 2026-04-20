import { describe, it, expect, vi, beforeEach } from "vitest";

const { checkAndRecord, getStatus, generateContentStream } = vi.hoisted(() => ({
  checkAndRecord: vi.fn(),
  getStatus: vi.fn(),
  generateContentStream: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkAndRecord: (...a: unknown[]) => checkAndRecord(...a),
  getStatus: (...a: unknown[]) => getStatus(...a),
  rateLimitMessage: () => "slow down",
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: function () {
    return { models: { generateContentStream: (...a: unknown[]) => generateContentStream(...a) } };
  },
}));

import { GET, POST } from "@/app/api/chat/route";

function req(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("/api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
    checkAndRecord.mockResolvedValue({ allowed: true, retryAfterSec: 0, remainingDay: 5, remainingHour: 2, tier: "free" });
  });

  it("GET returns rate limit status", async () => {
    getStatus.mockResolvedValueOnce({ tier: "anon", dayLimit: 1 });
    const res = await GET();
    expect(await res.json()).toEqual({ tier: "anon", dayLimit: 1 });
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("POST 500s without api key", async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await POST(req({ messages: [{ role: "user", text: "hi" }] }));
    expect(res.status).toBe(500);
  });

  it("POST 400s without messages", async () => {
    const res = await POST(req({ messages: [] }));
    expect(res.status).toBe(400);
  });

  it("POST 429s when rate-limited", async () => {
    checkAndRecord.mockResolvedValueOnce({ allowed: false, retryAfterSec: 30, remainingDay: 0, remainingHour: 0, tier: "free" });
    const res = await POST(req({ messages: [{ role: "user", text: "hi" }] }));
    expect(res.status).toBe(429);
  });

  it("POST streams chunks and sets tier headers", async () => {
    generateContentStream.mockResolvedValueOnce((async function* () {
      yield { text: "Hello" };
      yield { text: " world" };
    })());
    const res = await POST(req({ messages: [{ role: "user", text: "hi" }] }));
    expect(res.headers.get("X-User-Tier")).toBe("free");
    expect(res.headers.get("X-Remaining-Day")).toBe("5");
    expect(await res.text()).toBe("Hello world");
  });
});
