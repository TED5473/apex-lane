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
  title: "China EV compare tool",
  description:
    "Interactive China EV compare — guide MSRP, range, battery, scenario fit. Free 3 trims. Members: unlimited + CSV.",
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-8 md:px-8 md:py-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
              Pack {month} · {vehicles.length} trims
            </p>
            <h1 className="mt-2 font-display text-3xl text-paper md:text-4xl">
              Compare. Toggle. Decide.
            </h1>
            <p className="mt-2 max-w-lg text-sm text-mute">
              Visual PM tool — free 3-trim board. Guide MSRP only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/compare?ids=${featured.join(",")}`}
              className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright"
            >
              Open tool
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:text-paper"
            >
              Members
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <CompareBoard
          vehicles={vehicles}
          brands={brands}
          tags={tags}
          isMember={member}
          initialIds={featured}
          compact
        />
      </section>
    </div>
  );
}
