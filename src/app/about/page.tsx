import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Editorial standards and source policy for Apex Lane.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">About</p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Editorial standards
      </h1>
      <div className="mt-10 space-y-8 text-[1.05rem] leading-relaxed text-paper/90">
        <p>
          Apex Lane is a premium editorial site for China EV and global
          competitive intelligence. The promise is simple:{" "}
          <strong className="text-paper">free lede, pay to read more</strong> —
          no SEO spam walls, no filler.
        </p>
        <section>
          <h2 className="font-display text-2xl text-paper">Who it&apos;s for</h2>
          <p className="mt-3 text-mute">
            Product, BD, and supplier people who track competitive moves; serious
            enthusiasts who want transaction-price literacy, not sticker worship.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Source policy</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-mute">
            <li>Public sources only — brand press, major auto outlets, policy reprints.</li>
            <li>No employer-internal materials.</li>
            <li>When outlets conflict, we flag the conflict rather than invent a winner.</li>
            <li>Guide prices and promotions change; verify on brand channels before decisions.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Disclaimers</h2>
          <p className="mt-3 text-mute">
            Not investment advice. Not affiliated with any OEM. FX figures, when
            shown, are illustrative. Apex Lane is independent editorial coverage.
          </p>
        </section>
        <p className="text-mute">
          Questions on membership? See{" "}
          <Link href="/pricing" className="text-brass hover:text-brass-bright">
            Pricing
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
