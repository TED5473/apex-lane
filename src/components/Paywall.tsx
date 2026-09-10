import Link from "next/link";

export function Paywall({ title }: { title?: string }) {
  return (
    <aside className="relative mt-10 overflow-hidden rounded-2xl border border-brass/30 bg-gradient-to-b from-panel to-ink px-6 py-10 md:px-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink via-ink/80 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-lg text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-brass">
          Members continue
        </p>
        <h2 className="mt-3 font-display text-2xl text-paper md:text-3xl">
          {title || "Read the full briefing"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          The lede is free. Full pricing boards, competitive maps, and method
          notes are for members — $12/mo or $99/yr.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright transition-colors"
          >
            View membership
          </Link>
          <Link
            href="?member=1"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-2.5 text-sm text-mute hover:border-paper/40 hover:text-paper transition-colors"
          >
            Preview as member
          </Link>
        </div>
        <p className="mt-5 text-xs text-mute/70">
          Demo: add <code className="text-brass/80">?member=1</code> or set
          cookie <code className="text-brass/80">apex_member=1</code>
        </p>
      </div>
    </aside>
  );
}
