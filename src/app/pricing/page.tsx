import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutButtons } from "@/components/CheckoutButtons";
import { missingStripeEnv, stripeConfigured } from "@/lib/membership";
import { stripeSetupMessage } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Apex Lane membership — $12/mo or $99/yr via Stripe Checkout.",
};

const envDocs = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_MONTHLY",
  "STRIPE_PRICE_YEARLY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_BASE_URL",
];

export default function PricingPage() {
  const configured = stripeConfigured();
  const missing = missingStripeEnv();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
        Membership
      </p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Pay to read more
      </h1>
      <p className="mt-4 max-w-xl text-mute leading-relaxed">
        Ledes stay free. Members unlock full briefings, pricing boards, and the
        monthly China EV Competitive Brief. Test-mode Stripe Checkout.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-7 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
            Monthly
          </p>
          <p className="mt-3 font-display text-5xl text-paper">
            $12
            <span className="text-lg text-mute"> / mo</span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-mute">
            <li>Full article bodies</li>
            <li>Archive access</li>
            <li>Monthly briefing digest</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-brass/40 bg-panel p-7 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brass">
            Yearly · best value
          </p>
          <p className="mt-3 font-display text-5xl text-paper">
            $99
            <span className="text-lg text-mute"> / yr</span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-mute">
            <li>Everything in monthly</li>
            <li>≈ 2 months free</li>
            <li>Cancel anytime via Customer Portal</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <CheckoutButtons
          configured={configured}
          setupMessage={stripeSetupMessage()}
        />
        <p className="mt-4 text-center text-xs text-mute">
          Or{" "}
          <Link href="/api/member-demo?on=1&next=/account" className="text-brass">
            enable demo membership
          </Link>{" "}
          without Stripe.
        </p>
      </div>

      <section className="mt-16 rounded-2xl border border-line bg-ink p-6 md:p-8">
        <h2 className="font-display text-2xl text-paper">Stripe env (test mode)</h2>
        <p className="mt-2 text-sm text-mute">
          Checkout handlers live at <code className="text-brass/80">/api/checkout</code>,
          portal at <code className="text-brass/80">/api/portal</code>, webhook at{" "}
          <code className="text-brass/80">/api/webhook</code>. Buttons never crash when
          keys are missing — they show this setup state instead.
        </p>
        <ul className="mt-5 space-y-2 font-mono text-xs text-mute">
          {envDocs.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span
                className={
                  missing.includes(key) ? "text-amber-300" : "text-emerald-300"
                }
              >
                {missing.includes(key) ? "○" : "●"}
              </span>
              {key}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
