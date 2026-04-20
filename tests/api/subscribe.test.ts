import { describe, it, expect, vi, beforeEach } from "vitest";

const { insertMock, emailsSend, contactsCreate } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  emailsSend: vi.fn(),
  contactsCreate: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getServerSupabase: async () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

vi.mock("resend", () => ({
  Resend: function () {
    return { emails: { send: emailsSend }, contacts: { create: contactsCreate } };
  },
}));

import { POST } from "@/app/api/subscribe/route";

function req(body: unknown, raw = false) {
  return new Request("http://localhost/api/subscribe", {
    method: "POST",
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("/api/subscribe POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insertMock.mockResolvedValue({ error: null });
    emailsSend.mockResolvedValue({ error: null });
    contactsCreate.mockResolvedValue({ error: null });
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(req("not json", true));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid json/i);
  });

  it("rejects invalid email", async () => {
    const res = await POST(req({ email: "bad", firstName: "Matt" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid email/i);
  });

  it("rejects missing first name", async () => {
    const res = await POST(req({ email: "a@b.co" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/first name/i);
  });

  it("inserts subscriber and returns ok", async () => {
    const res = await POST(req({ email: "Matt@Example.com", firstName: "  Matt  " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith({
      email: "matt@example.com",
      first_name: "Matt",
      source: "newsletter",
    });
  });

  it("treats 23505 unique-violation as alreadySubscribed", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "23505", message: "dup" } });
    const res = await POST(req({ email: "a@b.co", firstName: "X" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, alreadySubscribed: true });
    expect(emailsSend).not.toHaveBeenCalled();
  });

  it("returns 500 on other DB errors", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "other", message: "boom" } });
    const res = await POST(req({ email: "a@b.co", firstName: "X" }));
    expect(res.status).toBe(500);
  });

  it("sends welcome email when RESEND_API_KEY set", async () => {
    process.env.RESEND_API_KEY = "key";
    const res = await POST(req({ email: "a@b.co", firstName: "Matt" }));
    expect(res.status).toBe(200);
    expect(emailsSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: "a@b.co", subject: expect.stringContaining("Matt") }),
    );
    expect(contactsCreate).not.toHaveBeenCalled();
  });

  it("registers contact when audience id configured", async () => {
    process.env.RESEND_API_KEY = "key";
    process.env.RESEND_NEWSLETTER_AUDIENCE_ID = "aud_1";
    await POST(req({ email: "a@b.co", firstName: "Matt" }));
    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: "a@b.co", firstName: "Matt", audienceId: "aud_1" }),
    );
  });

  it("swallows Resend errors — subscription still succeeds", async () => {
    process.env.RESEND_API_KEY = "key";
    emailsSend.mockRejectedValueOnce(new Error("network"));
    const res = await POST(req({ email: "a@b.co", firstName: "Matt" }));
    expect(res.status).toBe(200);
  });
});
