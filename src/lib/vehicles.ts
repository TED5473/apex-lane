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
};

type VehiclesFile = {
  month: string;
  vehicles: Vehicle[];
};

const data = vehiclesData as VehiclesFile;

export const FREE_COMPARE_LIMIT = 3;

/** Useful default sample for homepage / deep links — 3 free-tier trims. */
export const FEATURED_COMPARE_IDS = [
  "tesla-model-3-rear-wheel-drive",
  "xiaomi-sky-nomad-n70-pro",
  "byd-qin-max-dm-i-230-km-leading",
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
