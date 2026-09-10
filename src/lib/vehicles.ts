import vehiclesData from "../../data/vehicles.json";

export type Vehicle = {
  id: string;
  month: string;
  brand: string;
  model: string;
  trim: string;
  msrp_rmb: number | null;
  msrp_usd_approx: number | null;
  battery_kwh: string | null;
  range_km: string | null;
  drive: string | null;
  adas: string | null;
  source_url: string | null;
  accessed_utc: string | null;
  notes: string | null;
  tags: string[];
  powertrain?: string | null;
  charge_notes?: string | null;
  body_layout?: string | null;
  key_differentiators?: string | null;
  decision_tags?: string[];
};

type VehiclesFile = {
  month: string;
  vehicles: Vehicle[];
};

const data = vehiclesData as VehiclesFile;

export const FREE_COMPARE_LIMIT = 3;

/** Useful default sample for homepage / deep links — 3 free-tier trims. */
export const FEATURED_COMPARE_IDS = [
  "xiaomi-yu7-standard",
  "li-auto-l6-ultra",
  "zeekr-7x-max-75-rwd",
] as const;

export function getCatalogMonth(): string {
  return data.month;
}

export function getAllVehicles(): Vehicle[] {
  return data.vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return data.vehicles.find((v) => v.id === id);
}

export function getVehiclesByIds(ids: string[]): Vehicle[] {
  const map = new Map(data.vehicles.map((v) => [v.id, v]));
  return ids.map((id) => map.get(id)).filter((v): v is Vehicle => Boolean(v));
}

export function getBrands(): string[] {
  return [...new Set(data.vehicles.map((v) => v.brand))].sort();
}

export function getTags(): string[] {
  return [...new Set(data.vehicles.flatMap((v) => v.tags))].sort();
}

export function labelVehicle(v: Vehicle): string {
  return `${v.brand} ${v.model} · ${v.trim}`;
}

export function blankLabel(): string {
  return "Not in source";
}

/** First numeric token from range / battery strings for charts. */
export function parseLeadNumber(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const m = String(raw).replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

/** Coarse ADAS marketing-tier proxy 0–4 for visual compare only — not a ranking of safety. */
export function adasProxyScore(v: Vehicle): number | null {
  const t = `${v.adas || ""} ${v.key_differentiators || ""}`.toLowerCase();
  if (!t.trim()) return null;
  let s = 1;
  if (/lidar|li-dar|激光/.test(t)) s += 1;
  if (/thor|mach m100|ads 5|h7|700 tops|508 tops/.test(t)) s += 1;
  if (/ultra|ultimate|flagship|god.?s eye|xngp|had|nop/.test(t)) s += 0.5;
  if (/optional|à la carte|a la carte|\+12|\+20/.test(t)) s -= 0.5;
  return Math.max(0, Math.min(4, Math.round(s * 2) / 2));
}

export function vehiclesToCsv(vehicles: Vehicle[]): string {
  const headers = [
    "id",
    "month",
    "brand",
    "model",
    "trim",
    "msrp_rmb",
    "msrp_usd_approx",
    "battery_kwh",
    "range_km",
    "drive",
    "adas",
    "powertrain",
    "charge_notes",
    "body_layout",
    "key_differentiators",
    "decision_tags",
    "source_url",
    "accessed_utc",
    "notes",
    "tags",
  ];

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const s = Array.isArray(val) ? val.join("|") : String(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(",")];
  for (const v of vehicles) {
    lines.push(
      [
        v.id,
        v.month,
        v.brand,
        v.model,
        v.trim,
        v.msrp_rmb,
        v.msrp_usd_approx,
        v.battery_kwh,
        v.range_km,
        v.drive,
        v.adas,
        v.powertrain ?? "",
        v.charge_notes ?? "",
        v.body_layout ?? "",
        v.key_differentiators ?? "",
        v.decision_tags ?? [],
        v.source_url,
        v.accessed_utc,
        v.notes,
        v.tags,
      ]
        .map(escape)
        .join(",")
    );
  }
  return lines.join("\n") + "\n";
}
