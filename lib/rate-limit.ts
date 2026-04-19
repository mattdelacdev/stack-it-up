import { createHash } from "node:crypto";
import { getServerSupabase } from "@/lib/supabase/server";

export type Endpoint = "chat" | "stack";

const LIMITS: Record<Endpoint, { hour: number; day: number }> = {
  chat: { hour: 10, day: 30 },
  stack: { hour: 2, day: 5 },
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
  remainingHour: number;
  remainingDay: number;
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
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") {
      const limits = LIMITS[endpoint];
      return {
        allowed: true,
        retryAfterSec: 0,
        remainingHour: limits.hour,
        remainingDay: limits.day,
      };
    }
    identifier = `user:${user.id}`;
  } else {
    identifier = `ip:${hashIp(getIp(req))}`;
  }

  const { hour, day } = LIMITS[endpoint];
  const { data, error } = await supabase.rpc("check_ai_rate_limit", {
    p_identifier: identifier,
    p_endpoint: endpoint,
    p_hour_limit: hour,
    p_day_limit: day,
  });

  if (error || !data || data.length === 0) {
    // Fail open — better to serve than to hard-block on a DB hiccup.
    return { allowed: true, retryAfterSec: 0, remainingHour: hour, remainingDay: day };
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
  };
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
