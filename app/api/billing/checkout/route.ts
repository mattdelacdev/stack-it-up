import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRO_PRICE_ID not configured" },
      { status: 500 },
    );
  }

  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.tier === "pro") {
    return NextResponse.json(
      { error: "Already on Pro" },
      { status: 400 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    subscription_data: {
      metadata: { user_id: user.id },
    },
    success_url: `${origin}/settings?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=1`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
