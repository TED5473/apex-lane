import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg text-paper">Apex Lane</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">
            High-level car intelligence. Free lede. Pay to read more. Public
            sources only — not investment advice, not affiliated with any OEM.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-mute">
          <div className="flex flex-col gap-2">
            <Link href="/briefings" className="hover:text-paper">
              Briefings
            </Link>
            <Link href="/pricing" className="hover:text-paper">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-paper">
              About
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/account" className="hover:text-paper">
              Account
            </Link>
            <Link href="/briefings?member=1" className="hover:text-paper">
              Demo member view
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line/60">
        <p className="mx-auto max-w-5xl px-5 py-4 text-xs text-mute/80 md:px-8">
          © {new Date().getFullYear()} Apex Lane. Guide prices change; verify on
          brand channels.
        </p>
      </div>
    </footer>
  );
}
