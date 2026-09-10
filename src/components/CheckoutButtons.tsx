"use client";

import { useState } from "react";

type Props = {
  configured: boolean;
  setupMessage: string;
};

export function CheckoutButtons({ configured, setupMessage }: Props) {
  const [busy, setBusy] = useState<"monthly" | "yearly" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: "monthly" | "yearly") {
    setError(null);
    if (!configured) {
      setError(setupMessage);
      return;
    }
    setBusy(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error starting checkout");
    } finally {
      setBusy(null);
    }
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100/90">
        <p className="font-medium text-amber-50">Stripe setup required</p>
        <p className="mt-2 leading-relaxed text-amber-100/70">{setupMessage}</p>
        <p className="mt-3 text-xs text-amber-100/50">
          Until keys are set, use{" "}
          <a href="/api/member-demo?on=1" className="underline">
            demo membership
          </a>{" "}
          or append <code>?member=1</code> to any briefing URL.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => startCheckout("monthly")}
        disabled={busy !== null}
        className="flex w-full items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-brass-bright disabled:opacity-60 transition-colors"
      >
        {busy === "monthly" ? "Redirecting…" : "Subscribe — $12 / month"}
      </button>
      <button
        type="button"
        onClick={() => startCheckout("yearly")}
        disabled={busy !== null}
        className="flex w-full items-center justify-center rounded-full border border-brass/50 bg-transparent px-6 py-3 text-sm font-medium text-brass hover:bg-brass/10 disabled:opacity-60 transition-colors"
      >
        {busy === "yearly" ? "Redirecting…" : "Subscribe — $99 / year"}
      </button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
