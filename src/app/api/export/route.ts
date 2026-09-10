import { NextResponse } from "next/server";
import { isMember } from "@/lib/membership";
import {
  getAllVehicles,
  getVehiclesByIds,
  vehiclesToCsv,
} from "@/lib/vehicles";

export async function POST(req: Request) {
  const member = await isMember();
  if (!member) {
    return NextResponse.json(
      {
        error: "Membership required for CSV export.",
        code: "MEMBER_REQUIRED",
      },
      { status: 403 }
    );
  }

  let body: { ids?: string[]; scope?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const scope = body.scope === "catalog" ? "catalog" : "selection";
  const vehicles =
    scope === "catalog"
      ? getAllVehicles()
      : getVehiclesByIds(Array.isArray(body.ids) ? body.ids : []);

  if (vehicles.length === 0) {
    return NextResponse.json(
      { error: "No vehicles to export.", code: "EMPTY" },
      { status: 400 }
    );
  }

  const csv = vehiclesToCsv(vehicles);
  const filename =
    scope === "catalog"
      ? "apex-lane-china-ev-catalog.csv"
      : "apex-lane-china-ev-compare.csv";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(req: Request) {
  const member = await isMember();
  if (!member) {
    return NextResponse.json(
      {
        error: "Membership required for CSV export.",
        code: "MEMBER_REQUIRED",
      },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids");
  const scope = url.searchParams.get("scope") === "catalog" ? "catalog" : "selection";
  const vehicles =
    scope === "catalog"
      ? getAllVehicles()
      : getVehiclesByIds(
          idsParam
            ? idsParam.split(",").map((s) => s.trim()).filter(Boolean)
            : []
        );

  if (vehicles.length === 0) {
    return NextResponse.json(
      { error: "No vehicles to export.", code: "EMPTY" },
      { status: 400 }
    );
  }

  const csv = vehiclesToCsv(vehicles);
  const filename =
    scope === "catalog"
      ? "apex-lane-china-ev-catalog.csv"
      : "apex-lane-china-ev-compare.csv";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
