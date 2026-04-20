import { describe, it, expect, vi, beforeEach } from "vitest";

const { constructEvent, updateMock, eqMock, fromMock } = vi.hoisted(() => {
  const eqMock = vi.fn();
  const updateMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ update: updateMock }));
  return {
    constructEvent: vi.fn(),
    updateMock,
    eqMock,
    fromMock,
  };
});

vi.mock("@/lib/stripe", () => ({
  stripe: { webhooks: { constructEvent: (...a: unknown[]) => constructEvent(...a) } },
}));

vi.mock("@/lib/supabase/service", () => ({
  getServiceSupabase: () => ({ from: fromMock }),
}));

import { POST } from "@/app/api/stripe/webhook/route";

function req(body = "{}", headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

describe("/api/stripe/webhook POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eqMock.mockResolvedValue({ error: null });
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("500s when STRIPE_WEBHOOK_SECRET missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(500);
  });

  it("400s when signature header missing", async () => {
    const res = await POST(req("{}"));
    expect(res.status).toBe(400);
  });

  it("400s when signature invalid", async () => {
    constructEvent.mockImplementationOnce(() => {
      throw new Error("bad signature");
    });
    const res = await POST(req("{}", { "stripe-signature": "bad" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/bad signature/i);
  });

  it("promotes profile to pro on checkout.session.completed (subscription)", async () => {
    constructEvent.mockReturnValueOnce({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "subscription",
          client_reference_id: "user-1",
          customer: "cus_123",
          subscription: "sub_123",
        },
      },
    });
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(200);
    expect(fromMock).toHaveBeenCalledWith("profiles");
    expect(updateMock).toHaveBeenCalledWith({
      tier: "pro",
      stripe_customer_id: "cus_123",
      stripe_subscription_id: "sub_123",
    });
    expect(eqMock).toHaveBeenCalledWith("id", "user-1");
  });

  it("ignores non-subscription checkout sessions (one-time guide purchase)", async () => {
    constructEvent.mockReturnValueOnce({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "payment",
          client_reference_id: "user-1",
          customer: "cus_123",
          subscription: null,
        },
      },
    });
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(200);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("skips incomplete checkout.session.completed payloads", async () => {
    constructEvent.mockReturnValueOnce({
      type: "checkout.session.completed",
      data: { object: { mode: "subscription", client_reference_id: null, customer: "cus_1", subscription: "sub_1" } },
    });
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(200);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("downgrades to free on customer.subscription.deleted", async () => {
    constructEvent.mockReturnValueOnce({
      type: "customer.subscription.deleted",
      data: { object: { id: "sub_123", customer: "cus_123", status: "canceled" } },
    });
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith({ tier: "free", stripe_subscription_id: null });
    expect(eqMock).toHaveBeenCalledWith("stripe_customer_id", "cus_123");
  });

  it("keeps pro on customer.subscription.updated with active status", async () => {
    constructEvent.mockReturnValueOnce({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_123", customer: "cus_123", status: "active" } },
    });
    await POST(req("{}", { "stripe-signature": "sig" }));
    expect(updateMock).toHaveBeenCalledWith({ tier: "pro", stripe_subscription_id: "sub_123" });
  });

  it("downgrades on customer.subscription.updated with inactive status (past_due)", async () => {
    constructEvent.mockReturnValueOnce({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_123", customer: "cus_123", status: "past_due" } },
    });
    await POST(req("{}", { "stripe-signature": "sig" }));
    expect(updateMock).toHaveBeenCalledWith({ tier: "free", stripe_subscription_id: null });
  });

  it("acks unhandled event types without writing", async () => {
    constructEvent.mockReturnValueOnce({
      type: "invoice.finalized",
      data: { object: {} },
    });
    const res = await POST(req("{}", { "stripe-signature": "sig" }));
    expect(res.status).toBe(200);
    expect(updateMock).not.toHaveBeenCalled();
  });
});
