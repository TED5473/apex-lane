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
    "Interactive China EV compare — charts, scenario toggles, source footnotes. Free 3 trims; members unlimited + CSV.",
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
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
            Pack {month}
          </p>
          <h1 className="mt-1 font-display text-3xl text-paper md:text-4xl">
            Compare tool
          </h1>
        </div>
        <p className="text-xs text-mute">Free 3 · members unlimited + CSV</p>
      </div>

      <div className="mt-6">
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
