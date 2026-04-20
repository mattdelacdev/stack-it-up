import { describe, it, expect, vi, beforeEach } from "vitest";

const { exchangeCodeForSession } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getServerSupabase: async () => ({
    auth: { exchangeCodeForSession: (...a: unknown[]) => exchangeCodeForSession(...a) },
  }),
}));

import { GET } from "@/app/auth/callback/route";

function makeReq(url: string) {
  return new Request(url) as unknown as import("next/server").NextRequest;
}

describe("/auth/callback GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it("exchanges code and redirects to next on success", async () => {
    const res = await GET(
      makeReq("http://localhost/auth/callback?code=abc&next=/settings"),
    );
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/settings");
  });

  it("redirects to /login with error message when exchange fails", async () => {
    exchangeCodeForSession.mockResolvedValueOnce({ error: { message: "bad code" } });
    const res = await GET(makeReq("http://localhost/auth/callback?code=abc"));
    const loc = res.headers.get("location") ?? "";
    expect(loc).toContain("/login?error=");
    expect(loc).toContain(encodeURIComponent("bad code"));
  });

  it("redirects to '/' when no code is present", async () => {
    const res = await GET(makeReq("http://localhost/auth/callback"));
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("http://localhost/");
  });

  // SECURITY: documents current open-redirect exposure via `next` param.
  // `new URL("https://evil.com", origin)` resolves to the attacker URL, so an
  // attacker can craft /auth/callback?next=https://evil.com. Fix by requiring
  // `next` to start with "/" and not "//".
  it("KNOWN ISSUE: follows absolute-URL next param (open redirect)", async () => {
    const res = await GET(
      makeReq("http://localhost/auth/callback?code=abc&next=https://evil.example/pwn"),
    );
    expect(res.headers.get("location")).toBe("https://evil.example/pwn");
  });
});
