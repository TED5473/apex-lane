import Link from "next/link";

const nav = [
  { href: "/briefings", label: "Briefings" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Account" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-ink/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight text-paper group-hover:text-brass transition-colors">
            Apex Lane
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-mute">
            Car intelligence
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-mute">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-paper transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-brass hover:bg-brass/20 transition-colors"
          >
            Members
          </Link>
        </nav>
      </div>
    </header>
  );
}
