import { describe, it, expect, vi, beforeEach } from "vitest";

const { sessionsCreate, sessionsRetrieve } = vi.hoisted(() => ({
  sessionsCreate: vi.fn(),
  sessionsRetrieve: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: { sessions: { create: sessionsCreate, retrieve: sessionsRetrieve } },
  },
}));


import { POST as checkoutPOST } from "@/app/api/checkout/route";
import { GET as downloadGET } from "@/app/api/download/route";

describe("/api/checkout POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_PRICE_ID = "price_123";
    delete process.env.NEXT_PUBLIC_SITE_URL;
    sessionsCreate.mockResolvedValue({ url: "https://stripe.test/session" });
  });

  it("creates a checkout session and returns url", async () => {
    const res = await checkoutPOST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { origin: "https://stackitup.app" },
      }),
    );
    expect(await res.json()).toEqual({ url: "https://stripe.test/session" });
    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_123", quantity: 1 }],
        success_url: expect.stringContaining("https://stackitup.app/download/success"),
        cancel_url: "https://stackitup.app/supplements",
      }),
    );
  });

  it("prefers NEXT_PUBLIC_SITE_URL over origin header", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://env-url.example";
    await checkoutPOST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { origin: "https://header.example" },
      }),
    );
    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ cancel_url: "https://env-url.example/supplements" }),
    );
  });
});

describe("/api/download GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("400s without session_id", async () => {
    const res = await downloadGET(new Request("http://localhost/api/download"));
    expect(res.status).toBe(400);
  });

  it("402s when payment not completed", async () => {
    sessionsRetrieve.mockResolvedValueOnce({ payment_status: "unpaid" });
    const res = await downloadGET(new Request("http://localhost/api/download?session_id=abc"));
    expect(res.status).toBe(402);
  });

  it("serves PDF when paid", async () => {
    sessionsRetrieve.mockResolvedValueOnce({ payment_status: "paid" });
    const res = await downloadGET(new Request("http://localhost/api/download?session_id=abc"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("stack-it-up-guide.pdf");
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    const bytes = await res.arrayBuffer();
    expect(bytes.byteLength).toBeGreaterThan(0);
  });
});
