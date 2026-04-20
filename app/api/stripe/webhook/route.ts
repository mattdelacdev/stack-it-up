import { NextResponse } from "next/server";
import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { stripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";

// Stripe requires the raw body for signature verification.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.client_reference_id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId || !customerId || !subscriptionId) {
          console.warn("checkout.session.completed missing ids", {
            userId,
            customerId,
            subscriptionId,
          });
          break;
        }

        await supabase
          .from("profiles")
          .update({
            tier: "pro",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("id", userId);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        const active =
          event.type !== "customer.subscription.deleted" &&
          (sub.status === "active" || sub.status === "trialing");

        await supabase
          .from("profiles")
          .update({
            tier: active ? "pro" : "free",
            stripe_subscription_id: active ? sub.id : null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      default:
        // Ignore other events.
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("Stripe webhook error:", msg);
    Sentry.withScope((scope) => {
      scope.setTag("route", "stripe-webhook");
      scope.setTag("stripe_event_type", event.type);
      scope.setContext("stripe_event", { id: event.id, type: event.type });
      Sentry.captureException(err);
    });
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
