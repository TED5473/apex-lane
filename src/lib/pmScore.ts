import type { Vehicle } from "@/lib/vehicles";
import { adasProxyScore, parseLeadNumber } from "@/lib/vehicles";

export type ScenarioState = {
  trip: "city" | "highway";
  charging: "home-dc" | "sparse";
  budget: "lean" | "open";
  seats: "any" | "family";
};

export type ScoredVehicle = {
  vehicle: Vehicle;
  score: number;
  chip: string;
};

function powertrainOf(v: Vehicle): string {
  return (v.powertrain || v.tags.find((t) => /BEV|PHEV|EREV/i.test(t)) || "").toUpperCase();
}

/** Soft scenario fit 0–100 for strip ordering — not a purchase recommendation. */
export function scoreForScenario(v: Vehicle, s: ScenarioState): ScoredVehicle {
  let score = 50;
  const pt = powertrainOf(v);
  const isBev = pt.includes("BEV") && !pt.includes("PHEV") && !pt.includes("EREV");
  const isErev = /EREV|PHEV/.test(pt) || (v.tags || []).some((t) => /PHEV|EREV/i.test(t));
  const tags = new Set([...(v.decision_tags || []), ...(v.tags || [])].map((x) => x.toLowerCase()));
  const price = v.msrp_rmb;
  const range = parseLeadNumber(v.range_km);
  const adas = adasProxyScore(v);

  if (s.trip === "city" && isBev) score += 12;
  if (s.trip === "highway" && isErev) score += 14;
  if (s.trip === "highway" && isBev && range != null && range >= 700) score += 8;
  if (s.charging === "home-dc" && isBev) score += 10;
  if (s.charging === "sparse" && isErev) score += 14;
  if (s.charging === "sparse" && tags.has("swap-ecosystem")) score += 8;
  if (s.budget === "lean" && price != null && price <= 200000) score += 12;
  if (s.budget === "lean" && price != null && price > 350000) score -= 10;
  if (s.budget === "open" && adas != null) score += adas * 3;
  if (s.seats === "family" && (tags.has("family") || tags.has("six-seat") || /SUV/i.test(v.tags.join(" "))))
    score += 10;
  if (s.seats === "family" && tags.has("six-seat")) score += 6;

  const chipParts: string[] = [];
  if (isBev && s.charging === "home-dc") chipParts.push("BEV fits charge access");
  if (isErev && (s.trip === "highway" || s.charging === "sparse"))
    chipParts.push("EREV/PHEV buffers range anxiety");
  if (s.budget === "lean" && price != null && price <= 200000) chipParts.push("leans value band");
  if (s.seats === "family" && /SUV|six/i.test(`${v.body_layout || ""} ${v.tags.join(" ")}`))
    chipParts.push("family layout");
  if (!chipParts.length) {
    chipParts.push(isBev ? "BEV path" : isErev ? "range-extender path" : "check powertrain");
  }

  return {
    vehicle: v,
    score: Math.max(0, Math.min(100, Math.round(score))),
    chip: chipParts.slice(0, 2).join(" · "),
  };
}

export function rankSelection(vehicles: Vehicle[], s: ScenarioState): ScoredVehicle[] {
  return vehicles
    .map((v) => scoreForScenario(v, s))
    .sort((a, b) => b.score - a.score);
}
