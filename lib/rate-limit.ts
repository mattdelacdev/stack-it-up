import { createHash } from "node:crypto";
import { getServerSupabase } from "@/lib/supabase/server";

export type Endpoint = "chat" | "stack";
export type Tier = "free" | "pro";

const LIMITS: Record<Endpoint, Record<Tier, { hour: number; day: number }>> = {
  chat: {
    free: { hour: 1, day: 1 },
    pro: { hour: 5, day: 5 },
  },
  stack: {
    free: { hour: 2, day: 5 },
    pro: { hour: 5, day: 15 },
  },
};

const ANON_LIMITS: Record<Endpoint, { hour: number; day: number }> =
  {
    chat: LIMITS.chat.free,
    stack: LIMITS.stack.free,
  };

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
  remainingHour: number;
  remainingDay: number;
  tier: Tier | "admin" | "anon";
};

function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function checkAndRecord(
  req: Request,
  endpoint: Endpoint,
): Promise<RateLimitResult> {
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let identifier: string;
  let limits: { hour: number; day: number };
  let callerTier: Tier | "anon" = "anon";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, tier")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") {
      const pro = LIMITS[endpoint].pro;
      return {
        allowed: true,
        retryAfterSec: 0,
        remainingHour: pro.hour,
        remainingDay: pro.day,
        tier: "admin",
      };
    }
    callerTier = profile?.tier === "pro" ? "pro" : "free";
    limits = LIMITS[endpoint][callerTier];
    identifier = `user:${user.id}`;
  } else {
    limits = ANON_LIMITS[endpoint];
    identifier = `ip:${hashIp(getIp(req))}`;
  }

  const { hour, day } = limits;
  const { data, error } = await supabase.rpc("check_ai_rate_limit", {
    p_identifier: identifier,
    p_endpoint: endpoint,
    p_hour_limit: hour,
    p_day_limit: day,
  });

  if (error || !data || data.length === 0) {
    // Fail open — better to serve than to hard-block on a DB hiccup.
    return {
      allowed: true,
      retryAfterSec: 0,
      remainingHour: hour,
      remainingDay: day,
      tier: callerTier,
    };
  }

  const row = data[0] as {
    allowed: boolean;
    retry_after_sec: number;
    remaining_hour: number;
    remaining_day: number;
  };
  return {
    allowed: row.allowed,
    retryAfterSec: row.retry_after_sec,
    remainingHour: row.remaining_hour,
    remainingDay: row.remaining_day,
    tier: callerTier,
  };
}

export async function getStatus(
  endpoint: Endpoint,
): Promise<{ tier: Tier | "admin" | "anon"; dayLimit: number }> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { tier: "anon", dayLimit: ANON_LIMITS[endpoint].day };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    return { tier: "admin", dayLimit: LIMITS[endpoint].pro.day };
  }

  const tier: Tier = profile?.tier === "pro" ? "pro" : "free";
  return { tier, dayLimit: LIMITS[endpoint][tier].day };
}

export function rateLimitMessage(result: RateLimitResult): string {
  const mins = Math.ceil(result.retryAfterSec / 60);
  const when =
    result.retryAfterSec < 90
      ? "in a minute"
      : mins < 60
        ? `in about ${mins} minutes`
        : `in about ${Math.ceil(mins / 60)} hour${Math.ceil(mins / 60) > 1 ? "s" : ""}`;
  return `You've reached the AI request limit. Please try again ${when}.`;
}
