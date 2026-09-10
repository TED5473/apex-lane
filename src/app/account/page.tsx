import type { Metadata } from "next";
import Link from "next/link";
import { isMember, stripeConfigured } from "@/lib/membership";
import { stripeSetupMessage } from "@/lib/stripe";
import { PortalButton } from "@/components/PortalButton";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage Apex Lane membership.",
};

type Props = {
  searchParams: Promise<{
    member?: string | string[];
    checkout?: string;
    session_id?: string;
  }>;
};

export default async function AccountPage({ searchParams }: Props) {
  const sp = await searchParams;
  const member = await isMember(sp);
  const configured = stripeConfigured();
  const checkoutSuccess = sp.checkout === "success";

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Account</p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Membership
      </h1>

      {checkoutSuccess && (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          <p className="font-medium">Checkout success (stub)</p>
          <p className="mt-1 text-emerald-100/70">
            In production, the webhook grants access. For local demo,{" "}
            <Link href="/api/member-demo?on=1&next=/account" className="underline">
              set the member cookie
            </Link>
            {sp.session_id ? (
              <>
                {" "}
                · session <code className="text-xs">{String(sp.session_id)}</code>
              </>
            ) : null}
          </p>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-line bg-panel p-7">
        <p className="text-sm text-mute">Status</p>
        <p className="mt-2 font-display text-3xl text-paper">
          {member ? "Active member (demo)" : "Free · 3-trim compare"}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          {member
            ? "Unlimited compare + CSV export unlocked. Cookie apex_member=1 or ?member=1."
            : "Free compare works without paying. Membership adds unlimited board + CSV. Demo cookie available for local preview."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {!member ? (
            <>
              <Link
                href="/compare"
                className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright"
              >
                Open compare
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:text-paper"
              >
                Membership
              </Link>
              <Link
                href="/api/member-demo?on=1&next=/account"
                className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:text-paper"
              >
                Enable demo membership
              </Link>
            </>
          ) : (
            <Link
              href="/api/member-demo?on=0&next=/account"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:text-paper"
            >
              Clear demo membership
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line p-7">
        <h2 className="font-display text-2xl text-paper">Customer Portal</h2>
        <p className="mt-2 text-sm text-mute">
          Stripe Customer Portal stub for plan changes and cancellation. Requires
          configured Stripe keys plus optional <code className="text-brass/80">STRIPE_CUSTOMER_ID</code>{" "}
          for the demo customer.
        </p>
        <div className="mt-5">
          <PortalButton
            configured={configured}
            setupMessage={stripeSetupMessage()}
          />
        </div>
      </div>
    </div>
  );
}
