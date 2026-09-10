"use client";

import { useState } from "react";

export function PortalButton({
  configured,
  setupMessage,
}: {
  configured: boolean;
  setupMessage: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    if (!configured) {
      setError(setupMessage);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Portal unavailable");
        return;
      }
      if (data.url) window.location.href = data.url;
      else setError("No portal URL returned");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={openPortal}
        disabled={busy}
        className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-brass/50 hover:text-brass disabled:opacity-60 transition-colors"
      >
        {busy ? "Opening…" : "Open Stripe Customer Portal"}
      </button>
      {error && <p className="text-sm text-amber-200/80">{error}</p>}
    </div>
  );
}
