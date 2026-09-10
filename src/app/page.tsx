import Link from "next/link";
import { getAllBriefings } from "@/lib/content";
import { BriefingCard } from "@/components/BriefingCard";

export default function HomePage() {
  const briefings = getAllBriefings();
  const [hero, ...rest] = briefings;

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
            Editorial · China EV & beyond
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-paper md:text-6xl">
            High-level car intelligence.
            <span className="block text-mute">Free lede. Pay to read more.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            For product, BD, and supplier people who track China EV competitive
            moves — and enthusiasts who hate filler. Public sources only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/briefings"
              className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright transition-colors"
            >
              Latest briefings
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:border-brass/40 hover:text-paper transition-colors"
            >
              Membership — $12/mo
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mute">
              September 2026 pack
            </p>
            <h2 className="mt-2 font-display text-3xl text-paper">Latest</h2>
          </div>
          <Link href="/briefings" className="text-sm text-brass hover:text-brass-bright">
            All briefings →
          </Link>
        </div>

        {hero && <BriefingCard briefing={hero} featured />}
        <div className="mt-2">
          {rest.map((b) => (
            <BriefingCard key={b.slug} briefing={b} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-paper md:text-4xl">
              Members get the rest of the page
            </h2>
            <p className="mt-4 text-mute leading-relaxed">
              Full pricing boards, competitive pressure maps, method notes, and
              the monthly China EV Competitive Brief. Anonymous readers always
              see the lede.
            </p>
            <Link
              href="/pricing"
              className="mt-7 inline-flex rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright transition-colors"
            >
              See plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
