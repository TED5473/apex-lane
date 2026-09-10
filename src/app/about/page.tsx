import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Method and source policy for Apex Lane China EV compare.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">About</p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Method, not marketing
      </h1>
      <div className="mt-10 space-y-8 text-[1.05rem] leading-relaxed text-paper/90">
        <p>
          Apex Lane is a{" "}
          <strong className="text-paper">China EV pricing &amp; spec compare</strong>{" "}
          tool. Free visitors get a complete 3-trim board. Membership unlocks
          unlimited compare and CSV export — nothing else is gated behind a wall
          of essay copy.
        </p>
        <section>
          <h2 className="font-display text-2xl text-paper">Differentiation</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-mute">
            <li>Guide MSRP labeled separately from incentive / entitlement notes.</li>
            <li>Empty fields stay empty — marked “Not in source,” never invented.</li>
            <li>Every row carries source URL + accessed date when available.</li>
            <li>Public sources only. Conflicts flagged in notes, not smoothed away.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Disclaimers</h2>
          <p className="mt-3 text-mute">
            Not investment advice. Not affiliated with any OEM. FX is
            illustrative. Guide ≠ transaction — verify on brand channels.
          </p>
        </section>
        <p className="text-mute">
          <Link href="/compare" className="text-brass hover:text-brass-bright">
            Open compare
          </Link>
          {" · "}
          <Link href="/pricing" className="text-brass hover:text-brass-bright">
            Membership
          </Link>
        </p>
      </div>
    </div>
  );
}
