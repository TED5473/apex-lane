import Stripe from "stripe";
import { missingStripeEnv } from "./membership";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2026-08-26.dahlia",
      typescript: true,
    });
  }
  return stripeClient;
}

export function stripeSetupMessage(): string {
  const missing = missingStripeEnv();
  if (missing.length === 0) return "";
  return `Stripe is not fully configured. Missing env: ${missing.join(", ")}. Copy .env.example → .env.local and add test-mode keys.`;
}
