import type { Metadata } from "next";
import Link from "next/link";
import { CompareBoard } from "@/components/CompareBoard";
import { isMember } from "@/lib/membership";
import {
  FEATURED_COMPARE_IDS,
  getAllVehicles,
  getBrands,
  getCatalogMonth,
  getTags,
} from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "China EV compare — guide MSRP & specs",
  description:
    "Free side-by-side China EV pricing and specs. Source-linked guide MSRPs. Members unlock unlimited compare and CSV export.",
};

type Props = {
  searchParams: Promise<{ member?: string | string[] }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const member = await isMember(params);
  const vehicles = getAllVehicles();
  const brands = getBrands();
  const tags = getTags();
  const month = getCatalogMonth();
  const featured = [...FEATURED_COMPARE_IDS];

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
            China EV · pack {month}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-paper md:text-5xl">
            Compare China EV guide prices &amp; specs.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            Free: up to 3 trims, source-linked. Members: unlimited board + CSV
            export. We show guide MSRP — not invented street prices.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/compare?ids=${featured.join(",")}`}
              className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright transition-colors"
            >
              Open compare
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:border-brass/40 hover:text-paper transition-colors"
            >
              Membership · export
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <CompareBoard
          vehicles={vehicles}
          brands={brands}
          tags={tags}
          isMember={member}
          initialIds={featured}
          compact
        />
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brass">
                Free
              </p>
              <p className="mt-2 text-sm text-mute leading-relaxed">
                Compare 3 trims. Full row detail — price, incentives, blanks
                labeled, source link + accessed date.
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brass">
                Moat
              </p>
              <p className="mt-2 text-sm text-mute leading-relaxed">
                Guide MSRP ≠ transaction. Incentive notes separated. Empty =
                not in source. No AI-filled numbers.
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                Members
              </p>
              <p className="mt-2 text-sm text-mute leading-relaxed">
                Unlimited compare + CSV of selection or full catalog.{" "}
                <Link href="/pricing" className="text-brass hover:text-brass-bright">
                  Plans
                </Link>
                {" · "}
                <Link href="/briefings" className="text-mute hover:text-paper">
                  Notes
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
