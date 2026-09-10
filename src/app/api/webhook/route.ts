import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

/**
 * Stripe webhook stub (test mode).
 * Required env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 * On checkout.session.completed you would grant membership in your DB.
 * This stub verifies signatures and acknowledges events without side effects
 * beyond logging — wire persistence before production.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      {
        error:
          "Webhook stub inactive. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      { status: 503 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`[apex-lane webhook] ${event.type}`, event.id);
      break;
    default:
      console.log(`[apex-lane webhook] unhandled ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
