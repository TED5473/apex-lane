import type { Metadata } from "next";
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
  title: "Compare",
  description:
    "China EV pricing & spec compare. Free up to 3 trims with source links; members unlock unlimited + CSV.",
};

type Props = {
  searchParams: Promise<{ member?: string | string[]; ids?: string | string[] }>;
};

function parseIds(raw: string | string[] | undefined): string[] {
  if (!raw) return [...FEATURED_COMPARE_IDS];
  const s = Array.isArray(raw) ? raw[0] : raw;
  const ids = s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return ids.length ? ids : [...FEATURED_COMPARE_IDS];
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const member = await isMember(params);
  const vehicles = getAllVehicles();
  const brands = getBrands();
  const tags = getTags();
  const initialIds = parseIds(params.ids);
  const month = getCatalogMonth();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
        China EV · pack {month}
      </p>
      <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
        Pricing &amp; spec compare
      </h1>
      <p className="mt-3 max-w-2xl text-mute leading-relaxed">
        Free: 3 trims, full detail. Members: unlimited + CSV. Every number is
        guide MSRP from a public source — blanks stay blank.
      </p>

      <div className="mt-10">
        <CompareBoard
          vehicles={vehicles}
          brands={brands}
          tags={tags}
          isMember={member}
          initialIds={initialIds}
        />
      </div>
    </div>
  );
}
