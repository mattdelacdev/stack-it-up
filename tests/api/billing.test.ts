import { describe, it, expect, vi, beforeEach } from "vitest";

const { checkoutCreate, portalCreate, getUser, profileMaybeSingle } = vi.hoisted(
  () => ({
    checkoutCreate: vi.fn(),
    portalCreate: vi.fn(),
    getUser: vi.fn(),
    profileMaybeSingle: vi.fn(),
  }),
);

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: { sessions: { create: checkoutCreate } },
    billingPortal: { sessions: { create: portalCreate } },
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  getServerSupabase: async () => ({
    auth: { getUser: () => getUser() },
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => profileMaybeSingle() }),
      }),
    }),
  }),
}));

import { POST as checkoutPOST } from "@/app/api/billing/checkout/route";
import { POST as portalPOST } from "@/app/api/billing/portal/route";

function req(origin = "https://stackitup.app") {
  return new Request("http://localhost/api/billing/x", {
    method: "POST",
    headers: { origin },
  });
}

describe("/api/billing/checkout POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.STRIPE_PRO_PRICE_ID = "price_pro";
    checkoutCreate.mockResolvedValue({ url: "https://stripe.test/pro" });
  });

  it("500s when STRIPE_PRO_PRICE_ID missing", async () => {
    delete process.env.STRIPE_PRO_PRICE_ID;
    const res = await checkoutPOST(req());
    expect(res.status).toBe(500);
  });

  it("401s when not signed in", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await checkoutPOST(req());
    expect(res.status).toBe(401);
  });

  it("400s when already on Pro", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1", email: "a@b.co" } } });
    profileMaybeSingle.mockResolvedValueOnce({ data: { tier: "pro" } });
    const res = await checkoutPOST(req());
    expect(res.status).toBe(400);
    expect(checkoutCreate).not.toHaveBeenCalled();
  });

  it("creates subscription session and passes client_reference_id + email (no existing customer)", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1", email: "a@b.co" } } });
    profileMaybeSingle.mockResolvedValueOnce({ data: { tier: "free" } });
    const res = await checkoutPOST(req());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/pro" });
    expect(checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        client_reference_id: "u1",
        customer: undefined,
        customer_email: "a@b.co",
        subscription_data: { metadata: { user_id: "u1" } },
        allow_promotion_codes: true,
      }),
    );
  });

  it("reuses existing stripe_customer_id and omits customer_email", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1", email: "a@b.co" } } });
    profileMaybeSingle.mockResolvedValueOnce({
      data: { tier: "free", stripe_customer_id: "cus_existing" },
    });
    await checkoutPOST(req());
    expect(checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_existing",
        customer_email: undefined,
      }),
    );
  });

  it("prefers NEXT_PUBLIC_SITE_URL for success/cancel URLs", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://env.example";
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1", email: "a@b.co" } } });
    profileMaybeSingle.mockResolvedValueOnce({ data: { tier: "free" } });
    await checkoutPOST(req("https://header.example"));
    expect(checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringContaining("https://env.example/settings?upgraded=1"),
        cancel_url: "https://env.example/pricing?canceled=1",
      }),
    );
  });
});

describe("/api/billing/portal POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SITE_URL;
    portalCreate.mockResolvedValue({ url: "https://stripe.test/portal" });
  });

  it("401s when not signed in", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await portalPOST(req());
    expect(res.status).toBe(401);
  });

  it("400s when user has no stripe_customer_id", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    profileMaybeSingle.mockResolvedValueOnce({ data: { stripe_customer_id: null } });
    const res = await portalPOST(req());
    expect(res.status).toBe(400);
    expect(portalCreate).not.toHaveBeenCalled();
  });

  it("creates billing portal session for user's customer id", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    profileMaybeSingle.mockResolvedValueOnce({ data: { stripe_customer_id: "cus_123" } });
    const res = await portalPOST(req("https://stackitup.app"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/portal" });
    expect(portalCreate).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "https://stackitup.app/settings",
    });
  });
});
