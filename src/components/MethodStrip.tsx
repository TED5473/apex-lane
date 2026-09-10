export function MethodStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-line bg-ink/60 px-3 py-2 text-[11px] leading-snug text-mute ${className}`}
    >
      Guide MSRP from public sources · blanks = not cited · not transaction price · not advice
    </div>
  );
}
