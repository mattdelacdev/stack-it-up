import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found" },
      { status: 400 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
