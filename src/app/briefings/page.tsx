import type { Metadata } from "next";
import { getAllBriefings } from "@/lib/content";
import { BriefingCard } from "@/components/BriefingCard";

export const metadata: Metadata = {
  title: "Notes",
  description: "Apex Lane briefing index — free titles, gated full reads.",
};

export default function BriefingsIndexPage() {
  const briefings = getAllBriefings();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Archive</p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Notes
      </h1>
      <p className="mt-4 max-w-xl text-mute">
        Secondary archive. The product is Compare — these are optional context notes.
      </p>
      <div className="mt-12">
        {briefings.map((b) => (
          <BriefingCard key={b.slug} briefing={b} />
        ))}
      </div>
    </div>
  );
}
