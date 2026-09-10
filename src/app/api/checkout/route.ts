import { NextResponse } from "next/server";
import { getStripe, stripeSetupMessage } from "@/lib/stripe";
import { missingStripeEnv } from "@/lib/membership";

export async function POST(req: Request) {
  const missing = missingStripeEnv().filter(
    (k) =>
      k === "STRIPE_SECRET_KEY" ||
      k === "STRIPE_PRICE_MONTHLY" ||
      k === "STRIPE_PRICE_YEARLY" ||
      k === "NEXT_PUBLIC_BASE_URL"
  );
  if (missing.length) {
    return NextResponse.json(
      {
        error: stripeSetupMessage(),
        missing,
        docs: "Set env vars from .env.example (Stripe test mode).",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable" }, { status: 503 });
  }

  let plan: "monthly" | "yearly" = "monthly";
  try {
    const body = await req.json();
    if (body?.plan === "yearly") plan = "yearly";
  } catch {
    /* default monthly */
  }

  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!;
  const base = process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, "");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/pricing?checkout=cancel`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
