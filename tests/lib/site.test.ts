import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("site url helpers", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses NEXT_PUBLIC_SITE_URL when set, stripping trailing slash", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://stackitup.example/";
    const { SITE_URL, absoluteUrl } = await import("@/lib/site");
    expect(SITE_URL).toBe("https://stackitup.example");
    expect(absoluteUrl("/quiz")).toBe("https://stackitup.example/quiz");
    expect(absoluteUrl("quiz")).toBe("https://stackitup.example/quiz");
  });

  it("falls back to VERCEL_URL with https", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "preview.vercel.app";
    const { SITE_URL } = await import("@/lib/site");
    expect(SITE_URL).toBe("https://preview.vercel.app");
  });

  it("defaults to localhost in dev", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    const { SITE_URL } = await import("@/lib/site");
    expect(SITE_URL).toBe("http://localhost:3000");
  });

  it("absoluteUrl passes through absolute URLs", async () => {
    const { absoluteUrl } = await import("@/lib/site");
    expect(absoluteUrl("https://other.example/x")).toBe("https://other.example/x");
  });
});
