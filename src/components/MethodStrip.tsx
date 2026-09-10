export function MethodStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-line bg-ink/60 px-4 py-3 text-xs leading-relaxed text-mute ${className}`}
    >
      <span className="text-paper/80">Method.</span> Public sources only. Numbers
      shown are <span className="text-paper/80">guide / launch MSRP</span> as
      cited — not transaction prices. Incentive / entitlement notes sit under
      the price when the source reports them. Empty cells = not in source (we
      do not invent). Not investment advice · not OEM-affiliated.
    </div>
  );
}
