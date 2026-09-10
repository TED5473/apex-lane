"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import { FREE_COMPARE_LIMIT, blankLabel, labelVehicle } from "@/lib/vehicles";
import { formatAccessed, formatRmb, formatUsd } from "@/lib/format";
import { MethodStrip } from "@/components/MethodStrip";

type Props = {
  vehicles: Vehicle[];
  brands: string[];
  tags: string[];
  isMember: boolean;
  initialIds?: string[];
  /** Homepage embed: hide catalog, keep board + soft export note */
  compact?: boolean;
};

function Blank() {
  return (
    <span className="italic text-mute/70" title="Field not present in cited source">
      {blankLabel()}
    </span>
  );
}

function SourceCell({ v }: { v: Vehicle }) {
  if (!v.source_url) return <Blank />;
  const accessed = formatAccessed(v.accessed_utc);
  return (
    <div className="space-y-1">
      <a
        href={v.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brass hover:text-brass-bright"
      >
        Open source ↗
      </a>
      {accessed ? (
        <div className="text-[11px] text-mute">Accessed {accessed}</div>
      ) : null}
    </div>
  );
}

function PriceCell({ v }: { v: Vehicle }) {
  const rmb = formatRmb(v.msrp_rmb);
  if (!rmb) return <Blank />;
  return (
    <div>
      <div className="tabular-nums text-paper">{rmb}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-mute">
        Guide MSRP
      </div>
      {v.msrp_usd_approx != null ? (
        <div className="mt-1 text-xs text-mute">{formatUsd(v.msrp_usd_approx)}</div>
      ) : null}
    </div>
  );
}

function IncentiveCell({ v }: { v: Vehicle }) {
  if (!v.notes) return <Blank />;
  return <span className="text-paper/85 text-[13px] leading-snug">{v.notes}</span>;
}

function SpecValue({ v, keyName }: { v: Vehicle; keyName: string }): ReactNode {
  switch (keyName) {
    case "msrp":
      return <PriceCell v={v} />;
    case "incentive":
      return <IncentiveCell v={v} />;
    case "source":
      return <SourceCell v={v} />;
    case "battery_kwh":
      return v.battery_kwh ? v.battery_kwh : <Blank />;
    case "range_km":
      return v.range_km ? v.range_km : <Blank />;
    case "drive":
      return v.drive ? v.drive : <Blank />;
    case "adas":
      return v.adas ? v.adas : <Blank />;
    case "month":
      return v.month;
    case "brand":
      return v.brand;
    case "model":
      return v.model;
    case "trim":
      return v.trim;
    default:
      return <Blank />;
  }
}

const SPEC_ROWS: { key: string; label: string; hint?: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "model", label: "Model" },
  { key: "trim", label: "Trim" },
  { key: "msrp", label: "Guide MSRP", hint: "Cited guide / launch price — not street" },
  { key: "incentive", label: "Incentive / notes", hint: "Entitlements as reported by source" },
  { key: "battery_kwh", label: "Battery (kWh)" },
  { key: "range_km", label: "Range (CLTC / claimed)" },
  { key: "drive", label: "Drive" },
  { key: "adas", label: "ADAS" },
  { key: "month", label: "Pack month" },
  { key: "source", label: "Source + accessed" },
];

export function CompareBoard({
  vehicles,
  brands,
  tags,
  isMember,
  initialIds = [],
  compact = false,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const valid = initialIds.filter((id) => vehicles.some((v) => v.id === id));
    const seeded = valid.length
      ? valid
      : [];
    return isMember ? seeded : seeded.slice(0, FREE_COMPARE_LIMIT);
  });
  const [brandFilter, setBrandFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [gateMsg, setGateMsg] = useState<string | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (brandFilter !== "all" && v.brand !== brandFilter) return false;
      if (tagFilter !== "all" && !v.tags.includes(tagFilter)) return false;
      if (!q) return true;
      const hay = `${v.brand} ${v.model} ${v.trim} ${v.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [vehicles, brandFilter, tagFilter, query]);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => vehicles.find((v) => v.id === id))
        .filter((v): v is Vehicle => Boolean(v)),
    [selectedIds, vehicles]
  );

  const addVehicle = useCallback(
    (id: string) => {
      setGateMsg(null);
      setExportError(null);
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev;
        if (!isMember && prev.length >= FREE_COMPARE_LIMIT) {
          setGateMsg(
            "Free compares 3 trims. Unlimited + CSV unlock with membership."
          );
          return prev;
        }
        return [...prev, id];
      });
    },
    [isMember]
  );

  const removeVehicle = useCallback((id: string) => {
    setGateMsg(null);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds([]);
    setGateMsg(null);
  }, []);

  const downloadCsv = useCallback(
    async (scope: "selection" | "catalog") => {
      setExportError(null);
      if (!isMember) {
        setExportError("CSV export is a member feature.");
        return;
      }
      const ids = scope === "selection" ? selectedIds : vehicles.map((v) => v.id);
      if (scope === "selection" && ids.length === 0) {
        setExportError("Select at least one trim to export.");
        return;
      }
      setExportBusy(true);
      try {
        const res = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids, scope }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setExportError(data?.error || "Export blocked. Membership required.");
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          scope === "catalog"
            ? "apex-lane-china-ev-catalog.csv"
            : "apex-lane-china-ev-compare.csv";
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        setExportError("Export failed. Try again.");
      } finally {
        setExportBusy(false);
      }
    },
    [isMember, selectedIds, vehicles]
  );

  const board = (
    <section className="rounded-2xl border border-line bg-panel/60 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-paper">
            {compact ? "Sample compare" : "Compare board"}
          </h2>
          <p className="mt-1 text-sm text-mute">
            {selected.length === 0
              ? "Add trims to compare side-by-side."
              : `${selected.length} trim${selected.length === 1 ? "" : "s"} · guide MSRP + source-linked`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 && !compact && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-mute hover:border-brass/40 hover:text-paper"
            >
              Clear
            </button>
          )}
          {isMember ? (
            <>
              <button
                type="button"
                disabled={exportBusy || selected.length === 0}
                onClick={() => downloadCsv("selection")}
                className="rounded-full bg-brass px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-brass-bright disabled:opacity-40"
              >
                {exportBusy ? "Exporting…" : "Export selection CSV"}
              </button>
              {!compact && (
                <button
                  type="button"
                  disabled={exportBusy}
                  onClick={() => downloadCsv("catalog")}
                  className="rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 text-xs font-medium text-brass hover:bg-brass/20 disabled:opacity-40"
                >
                  Export full catalog
                </button>
              )}
            </>
          ) : (
            <Link
              href="/pricing"
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-mute hover:border-brass/40 hover:text-paper"
            >
              CSV export · members
            </Link>
          )}
        </div>
      </div>

      {exportError && (
        <p className="mt-3 text-sm text-amber-200/90">
          {exportError}{" "}
          {!isMember && (
            <Link href="/pricing" className="text-brass hover:text-brass-bright">
              Pricing
            </Link>
          )}
        </p>
      )}

      {selected.length === 0 ? (
        <p className="mt-8 py-10 text-center text-sm text-mute border border-dashed border-line rounded-xl">
          Compare board is empty.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-ink text-[11px] uppercase tracking-wider text-mute">
                <th className="sticky left-0 z-10 bg-ink px-3 py-2.5 font-medium min-w-[150px]">
                  Spec
                </th>
                {selected.map((v) => (
                  <th
                    key={v.id}
                    className="px-3 py-2.5 font-medium text-paper normal-case tracking-normal min-w-[200px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span>
                        {v.brand} {v.model}
                        <span className="mt-0.5 block text-xs text-mute">
                          {v.trim}
                        </span>
                      </span>
                      {!compact && (
                        <button
                          type="button"
                          onClick={() => removeVehicle(v.id)}
                          className="text-mute hover:text-paper text-xs"
                          aria-label={`Remove ${labelVehicle(v)}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.key} className="border-t border-line/70">
                  <th className="sticky left-0 z-10 bg-panel px-3 py-2.5 text-left align-top">
                    <div className="text-xs font-medium uppercase tracking-wider text-mute">
                      {row.label}
                    </div>
                    {row.hint ? (
                      <div className="mt-1 text-[10px] font-normal normal-case tracking-normal text-mute/70 leading-snug">
                        {row.hint}
                      </div>
                    ) : null}
                  </th>
                  {selected.map((v) => (
                    <td
                      key={v.id + row.key}
                      className="px-3 py-2.5 text-paper/90 align-top max-w-[280px]"
                    >
                      <SpecValue v={v} keyName={row.key} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {compact && (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/compare?ids=${selectedIds.join(",")}`}
            className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright transition-colors"
          >
            Open full compare
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:border-brass/40 hover:text-paper transition-colors"
          >
            Unlimited + CSV
          </Link>
        </div>
      )}
    </section>
  );

  if (compact) {
    return (
      <div className="space-y-4">
        <MethodStrip />
        {board}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${
            isMember
              ? "border border-brass/40 bg-brass/10 text-brass"
              : "border border-line bg-panel text-mute"
          }`}
        >
          {isMember
            ? "Member · unlimited + CSV"
            : `Free · ${FREE_COMPARE_LIMIT} trims`}
        </span>
        {!isMember && (
          <Link href="/pricing" className="text-sm text-mute hover:text-brass">
            Need more than 3? Membership unlocks unlimited + export
          </Link>
        )}
      </div>

      <MethodStrip />

      <section className="rounded-2xl border border-line bg-panel/60 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-paper">Catalog</h2>
            <p className="mt-1 text-sm text-mute">
              {vehicles.length} trims · filter · add to board
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              placeholder="Search brand / model / trim"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-[200px] flex-1 rounded-full border border-line bg-ink px-4 py-2 text-sm text-paper placeholder:text-mute/70 outline-none focus:border-brass/50"
            />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-full border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-brass/50"
            >
              <option value="all">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-full border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-brass/50"
            >
              <option value="all">All body / type</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 max-h-[320px] overflow-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 bg-ink text-[11px] uppercase tracking-wider text-mute">
              <tr>
                <th className="px-3 py-2 font-medium">Vehicle</th>
                <th className="px-3 py-2 font-medium">Tags</th>
                <th className="px-3 py-2 font-medium">Guide MSRP</th>
                <th className="px-3 py-2 font-medium">Range</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const on = selectedIds.includes(v.id);
                return (
                  <tr key={v.id} className="border-t border-line/70 hover:bg-ink/40">
                    <td className="px-3 py-2.5 text-paper">
                      <div className="font-medium">{labelVehicle(v)}</div>
                    </td>
                    <td className="px-3 py-2.5 text-mute">{v.tags.join(" · ")}</td>
                    <td className="px-3 py-2.5 tabular-nums text-paper">
                      {formatRmb(v.msrp_rmb) || <Blank />}
                    </td>
                    <td className="px-3 py-2.5 text-mute">
                      {v.range_km || <Blank />}
                    </td>
                    <td className="px-3 py-2.5">
                      {v.source_url ? (
                        <a
                          href={v.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brass hover:text-brass-bright text-xs"
                        >
                          Source
                          {v.accessed_utc
                            ? ` · ${formatAccessed(v.accessed_utc)}`
                            : ""}
                        </a>
                      ) : (
                        <Blank />
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => (on ? removeVehicle(v.id) : addVehicle(v.id))}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          on
                            ? "border border-line text-mute hover:border-brass/40 hover:text-paper"
                            : "bg-paper text-ink hover:bg-brass-bright"
                        }`}
                      >
                        {on ? "Remove" : "Compare"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-mute">
                    No vehicles match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {gateMsg && (
        <div className="rounded-xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-paper">
          {gateMsg}{" "}
          <Link href="/pricing" className="text-brass hover:text-brass-bright">
            See membership
          </Link>
        </div>
      )}

      {board}
    </div>
  );
}
