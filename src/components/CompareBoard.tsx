"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import {
  FREE_COMPARE_LIMIT,
  adasProxyScore,
  blankLabel,
  labelVehicle,
  parseLeadNumber,
} from "@/lib/vehicles";
import { formatAccessed, formatRmb, formatUsd } from "@/lib/format";
import { MethodStrip } from "@/components/MethodStrip";
import {
  rankSelection,
  type ScenarioState,
} from "@/lib/pmScore";

type Props = {
  vehicles: Vehicle[];
  brands: string[];
  tags: string[];
  isMember: boolean;
  initialIds?: string[];
  compact?: boolean;
};

const COLORS = ["#c9a45c", "#7eb8a8", "#c47a6a", "#8aa0c8", "#b08ec8", "#9aaa6a"];

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.18em] text-mute">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                on
                  ? "bg-brass text-ink"
                  : "border border-line text-mute hover:border-brass/40 hover:text-paper"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetricBars({
  title,
  unit,
  values,
  invert = false,
}: {
  title: string;
  unit?: string;
  values: { id: string; label: string; value: number | null; color: string }[];
  invert?: boolean;
}) {
  const numeric = values.map((v) => v.value).filter((n): n is number => n != null);
  const max = numeric.length ? Math.max(...numeric) : 0;
  const min = numeric.length ? Math.min(...numeric) : 0;
  const span = Math.max(max - min, max * 0.15, 1);

  return (
    <div className="rounded-xl border border-line bg-ink/40 p-3">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-mute">{title}</h3>
        {unit ? <span className="text-[10px] text-mute/70">{unit}</span> : null}
      </div>
      <div className="space-y-2.5">
        {values.map((v) => {
          let width = 8;
          if (v.value != null && max > 0) {
            const norm = invert
              ? (max - v.value) / span
              : v.value / max;
            width = Math.max(8, Math.min(100, Math.round(norm * 100)));
          }
          return (
            <div key={v.id} className="grid grid-cols-[88px_1fr_56px] items-center gap-2">
              <div className="truncate text-[11px] text-mute" title={v.label}>
                {v.label}
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-line/60">
                {v.value != null ? (
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${width}%`, background: v.color }}
                  />
                ) : (
                  <div className="h-full w-2 rounded-full bg-mute/30" />
                )}
              </div>
              <div className="text-right text-[11px] tabular-nums text-paper/90">
                {v.value != null ? v.value.toLocaleString() : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RadarLite({
  items,
}: {
  items: {
    id: string;
    label: string;
    color: string;
    priceN: number;
    rangeN: number;
    battN: number;
    adasN: number;
  }[];
}) {
  const cx = 90;
  const cy = 90;
  const r = 62;
  const axes = ["Price fit", "Range", "Battery", "ADAS*"] as const;
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / 4;

  const pt = (i: number, t: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * t, cy + Math.sin(a) * r * t] as const;
  };

  return (
    <div className="rounded-xl border border-line bg-ink/40 p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-mute">Radar</h3>
        <span className="text-[10px] text-mute/70">normalized · *ADAS proxy</span>
      </div>
      <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
        <svg viewBox="0 0 180 180" className="h-44 w-44 shrink-0">
          {[0.35, 0.65, 1].map((t) => (
            <polygon
              key={t}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              points={axes.map((_, i) => pt(i, t).join(",")).join(" ")}
            />
          ))}
          {axes.map((_, i) => {
            const [x, y] = pt(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            );
          })}
          {axes.map((label, i) => {
            const [x, y] = pt(i, 1.18);
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize="8"
              >
                {label}
              </text>
            );
          })}
          {items.map((it) => {
            const vals = [it.priceN, it.rangeN, it.battN, it.adasN];
            const points = vals.map((v, i) => pt(i, Math.max(0.08, v)).join(",")).join(" ");
            return (
              <polygon
                key={it.id}
                points={points}
                fill={it.color}
                fillOpacity={0.18}
                stroke={it.color}
                strokeWidth="1.6"
              />
            );
          })}
        </svg>
        <div className="flex flex-wrap gap-2 md:flex-col">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-2 text-[11px] text-mute">
              <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
              <span className="text-paper/80">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    const seeded = valid.length ? valid : [];
    return isMember ? seeded : seeded.slice(0, FREE_COMPARE_LIMIT);
  });
  const [brandFilter, setBrandFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [gateMsg, setGateMsg] = useState<string | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioState>({
    trip: "city",
    charging: "home-dc",
    budget: "lean",
    seats: "any",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (brandFilter !== "all" && v.brand !== brandFilter) return false;
      if (tagFilter !== "all" && !v.tags.includes(tagFilter)) return false;
      if (!q) return true;
      const hay = `${v.brand} ${v.model} ${v.trim} ${v.tags.join(" ")} ${(v.decision_tags || []).join(" ")}`.toLowerCase();
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

  const ranked = useMemo(() => rankSelection(selected, scenario), [selected, scenario]);

  const colorOf = useCallback(
    (id: string) => {
      const idx = selectedIds.indexOf(id);
      return COLORS[(idx >= 0 ? idx : 0) % COLORS.length];
    },
    [selectedIds]
  );

  const chartData = useMemo(() => {
    const prices = selected.map((v) => v.msrp_rmb);
    const maxPrice = Math.max(...prices.filter((n): n is number => n != null), 1);
    const ranges = selected.map((v) => parseLeadNumber(v.range_km));
    const maxRange = Math.max(...ranges.filter((n): n is number => n != null), 1);
    const batts = selected.map((v) => parseLeadNumber(v.battery_kwh));
    const maxBatt = Math.max(...batts.filter((n): n is number => n != null), 1);
    const adas = selected.map((v) => adasProxyScore(v));
    const maxAdas = Math.max(...adas.filter((n): n is number => n != null), 1);

    return selected.map((v) => {
      const short = `${v.brand} ${v.model}`.replace(/^(.{14}).+$/, "$1…");
      const price = v.msrp_rmb;
      const range = parseLeadNumber(v.range_km);
      const batt = parseLeadNumber(v.battery_kwh);
      const a = adasProxyScore(v);
      return {
        id: v.id,
        label: short,
        color: colorOf(v.id),
        price,
        range,
        batt,
        adas: a,
        priceN: price != null ? Math.max(0.12, 1 - price / maxPrice) : 0.12,
        rangeN: range != null ? range / maxRange : 0.12,
        battN: batt != null ? batt / maxBatt : 0.12,
        adasN: a != null ? a / maxAdas : 0.12,
      };
    });
  }, [selected, colorOf]);

  const addVehicle = useCallback(
    (id: string) => {
      setGateMsg(null);
      setExportError(null);
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev;
        if (!isMember && prev.length >= FREE_COMPARE_LIMIT) {
          setGateMsg("Free = 3 trims. Unlock unlimited + CSV.");
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
        setExportError("CSV is members-only.");
        return;
      }
      const ids = scope === "selection" ? selectedIds : vehicles.map((v) => v.id);
      if (scope === "selection" && ids.length === 0) {
        setExportError("Select a trim first.");
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
          setExportError(data?.error || "Export blocked.");
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
        setExportError("Export failed.");
      } finally {
        setExportBusy(false);
      }
    },
    [isMember, selectedIds, vehicles]
  );

  const scenarioPanel = (
    <section className="rounded-2xl border border-line bg-panel/60 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-paper">Scenario</h2>
          <p className="mt-0.5 text-[11px] text-mute">Reweights the strip — not a buy call</p>
        </div>
        {selected.length > 0 && !compact && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-line px-3 py-1 text-[11px] text-mute hover:text-paper"
          >
            Clear board
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ToggleGroup
          label="Trip"
          value={scenario.trip}
          onChange={(trip) => setScenario((s) => ({ ...s, trip }))}
          options={[
            { id: "city", label: "City" },
            { id: "highway", label: "Highway" },
          ]}
        />
        <ToggleGroup
          label="Charging"
          value={scenario.charging}
          onChange={(charging) => setScenario((s) => ({ ...s, charging }))}
          options={[
            { id: "home-dc", label: "Home / DC" },
            { id: "sparse", label: "Sparse DC" },
          ]}
        />
        <ToggleGroup
          label="Budget"
          value={scenario.budget}
          onChange={(budget) => setScenario((s) => ({ ...s, budget }))}
          options={[
            { id: "lean", label: "Lean" },
            { id: "open", label: "Open" },
          ]}
        />
        <ToggleGroup
          label="Seats"
          value={scenario.seats}
          onChange={(seats) => setScenario((s) => ({ ...s, seats }))}
          options={[
            { id: "any", label: "Any" },
            { id: "family", label: "Family SUV" },
          ]}
        />
      </div>

      {selected.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {ranked.map((r, i) => (
            <div
              key={r.vehicle.id}
              className="max-w-full rounded-2xl border border-line bg-ink/50 px-3 py-2"
              style={{ borderColor: `${colorOf(r.vehicle.id)}55` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-mute">
                  {i === 0 ? "Fit lead" : `#${i + 1}`}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: colorOf(r.vehicle.id) }}
                />
                <span className="text-xs text-paper">
                  {r.vehicle.brand} {r.vehicle.model}
                </span>
                <span className="text-[10px] tabular-nums text-mute">{r.score}</span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-mute line-clamp-2">{r.chip}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-mute">Add trims to see fit chips.</p>
      )}
    </section>
  );

  const visualBoard = (
    <section className="rounded-2xl border border-line bg-panel/60 p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl text-paper">
            {compact ? "Live compare" : "Visual board"}
          </h2>
          <p className="mt-0.5 text-[11px] text-mute">
            {selected.length === 0
              ? "Empty — pick trims below"
              : `${selected.length} trim${selected.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isMember ? (
            <>
              <button
                type="button"
                disabled={exportBusy || selected.length === 0}
                onClick={() => downloadCsv("selection")}
                className="rounded-full bg-brass px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-brass-bright disabled:opacity-40"
              >
                {exportBusy ? "…" : "CSV selection"}
              </button>
              {!compact && (
                <button
                  type="button"
                  disabled={exportBusy}
                  onClick={() => downloadCsv("catalog")}
                  className="rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 text-xs text-brass disabled:opacity-40"
                >
                  CSV catalog
                </button>
              )}
            </>
          ) : (
            <Link
              href="/pricing"
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-mute hover:text-paper"
            >
              CSV · members
            </Link>
          )}
        </div>
      </div>

      {exportError && <p className="mt-2 text-xs text-amber-200/90">{exportError}</p>}

      {selected.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line py-12 text-center text-sm text-mute">
          Pick up to {isMember ? "∞" : FREE_COMPARE_LIMIT} trims
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {selected.map((v) => (
              <div
                key={v.id}
                className="min-w-[168px] shrink-0 rounded-2xl border border-line bg-ink/50 p-3"
                style={{ boxShadow: `inset 3px 0 0 ${colorOf(v.id)}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-paper">
                      {v.brand} {v.model}
                    </div>
                    <div className="text-[11px] text-mute">{v.trim}</div>
                  </div>
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
                <div className="mt-2 text-sm tabular-nums text-brass">
                  {formatRmb(v.msrp_rmb) || blankLabel()}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(v.powertrain ? [v.powertrain] : v.tags.slice(0, 2)).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-1.5 py-0.5 text-[10px] text-mute"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {v.key_differentiators ? (
                  <p className="mt-2 text-[11px] leading-snug text-mute line-clamp-2">
                    {v.key_differentiators}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <MetricBars
              title="Guide MSRP"
              unit="RMB · lower bar = cheaper"
              invert
              values={chartData.map((d) => ({
                id: d.id,
                label: d.label,
                value: d.price,
                color: d.color,
              }))}
            />
            <MetricBars
              title="Range (lead figure)"
              unit="CLTC km"
              values={chartData.map((d) => ({
                id: d.id,
                label: d.label,
                value: d.range,
                color: d.color,
              }))}
            />
            <MetricBars
              title="Battery"
              unit="kWh"
              values={chartData.map((d) => ({
                id: d.id,
                label: d.label,
                value: d.batt,
                color: d.color,
              }))}
            />
            <RadarLite items={chartData} />
          </div>

          <div className="mt-3 space-y-1 border-t border-line/60 pt-3">
            {selected.map((v) => (
              <div key={v.id} className="flex flex-wrap items-baseline gap-x-2 text-[10px] text-mute">
                <span className="text-paper/70">
                  {v.brand} {v.model}
                </span>
                {v.source_url ? (
                  <a
                    href={v.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass hover:text-brass-bright"
                  >
                    source
                  </a>
                ) : (
                  <span>—</span>
                )}
                {v.accessed_utc ? <span>{formatAccessed(v.accessed_utc)}</span> : null}
                {v.msrp_usd_approx != null ? (
                  <span>~{formatUsd(v.msrp_usd_approx)}</span>
                ) : null}
                {v.charge_notes ? <span>· {v.charge_notes}</span> : null}
              </div>
            ))}
            <p className="pt-1 text-[10px] text-mute/70">
              ADAS axis is a marketing-hardware proxy, not a safety score. Guide ≠ deal.
            </p>
          </div>
        </>
      )}

      {compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/compare?ids=${selectedIds.join(",")}`}
            className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-brass-bright"
          >
            Full tool
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-mute hover:text-paper"
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
        {scenarioPanel}
        {visualBoard}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${
            isMember
              ? "border border-brass/40 bg-brass/10 text-brass"
              : "border border-line bg-panel text-mute"
          }`}
        >
          {isMember ? "Member · unlimited + CSV" : `Free · ${FREE_COMPARE_LIMIT} trims`}
        </span>
        {!isMember && (
          <Link href="/pricing" className="text-xs text-mute hover:text-brass">
            Need more than 3?
          </Link>
        )}
      </div>

      <MethodStrip />
      {scenarioPanel}
      {visualBoard}

      {gateMsg && (
        <div className="rounded-xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-paper">
          {gateMsg}{" "}
          <Link href="/pricing" className="text-brass hover:text-brass-bright">
            Membership
          </Link>
        </div>
      )}

      <section className="rounded-2xl border border-line bg-panel/60 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-xl text-paper">Catalog</h2>
            <p className="mt-0.5 text-[11px] text-mute">{vehicles.length} trims</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-[160px] flex-1 rounded-full border border-line bg-ink px-4 py-2 text-sm text-paper placeholder:text-mute/70 outline-none focus:border-brass/50"
            />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-full border border-line bg-ink px-3 py-2 text-sm text-paper outline-none"
            >
              <option value="all">Brand</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-full border border-line bg-ink px-3 py-2 text-sm text-paper outline-none"
            >
              <option value="all">Type</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid max-h-[360px] gap-2 overflow-auto sm:grid-cols-2">
          {filtered.map((v) => {
            const on = selectedIds.includes(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => (on ? removeVehicle(v.id) : addVehicle(v.id))}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  on
                    ? "border-brass/50 bg-brass/10"
                    : "border-line bg-ink/40 hover:border-brass/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-paper">{labelVehicle(v)}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {v.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-mute">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs tabular-nums text-brass">
                      {formatRmb(v.msrp_rmb) || "—"}
                    </div>
                    <div className="mt-1 text-[10px] text-mute">{on ? "On board" : "Add"}</div>
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-mute">No matches</p>
          )}
        </div>
      </section>
    </div>
  );
}
