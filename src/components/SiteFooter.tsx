import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg text-paper">Apex Lane</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">
            China EV guide-MSRP compare. Public sources only. Not investment
            advice. Not OEM-affiliated. Guide ≠ transaction.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-mute">
          <div className="flex flex-col gap-2">
            <Link href="/compare" className="hover:text-paper">
              Compare
            </Link>
            <Link href="/briefings" className="hover:text-paper">
              Notes
            </Link>
            <Link href="/about" className="hover:text-paper">
              About
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/pricing" className="hover:text-paper">
              Membership
            </Link>
            <Link href="/account" className="hover:text-paper">
              Account
            </Link>
            <Link href="/api/member-demo?on=1&next=/compare" className="hover:text-paper">
              Demo member
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line/60">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-mute/80 md:px-8">
          © {new Date().getFullYear()} Apex Lane. Verify on brand channels before
          decisions.
        </p>
      </div>
    </footer>
  );
}
