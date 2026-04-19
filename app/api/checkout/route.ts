import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/download/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/supplements`,
    metadata: { product: "stack-it-up-guide" },
  });

  return NextResponse.json({ url: session.url });
}
