export function LockBadge({ membersOnly }: { membersOnly?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-brass/35 bg-brass/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brass"
      title={membersOnly ? "Members-only briefing" : "Full read for members"}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      {membersOnly ? "Members" : "Gated"}
    </span>
  );
}
