import { NextResponse } from "next/server";
import { getStripe, stripeSetupMessage } from "@/lib/stripe";
import { missingStripeEnv } from "@/lib/membership";

/**
 * Customer Portal stub.
 * Production: look up Stripe customer id from your auth/session store.
 * Demo: requires STRIPE_CUSTOMER_ID env for a known test customer, otherwise
 * returns a clear setup message.
 */
export async function POST() {
  const needed = ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_BASE_URL"];
  const missing = missingStripeEnv().filter((k) => needed.includes(k));
  if (missing.length) {
    return NextResponse.json(
      { error: stripeSetupMessage(), missing },
      { status: 503 }
    );
  }

  const customerId = process.env.STRIPE_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json(
      {
        error:
          "Portal stub: set STRIPE_CUSTOMER_ID to a Stripe test customer id, or wire auth → customer mapping. Demo membership uses /api/member-demo instead.",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable" }, { status: 503 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, "");
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/account`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Portal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
