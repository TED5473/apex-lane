import { NextResponse } from "next/server";
import { MEMBER_COOKIE } from "@/lib/membership";

/**
 * Demo membership toggle — sets/clears apex_member cookie.
 * GET /api/member-demo?on=1  → member
 * GET /api/member-demo?on=0  → free
 * Also used as Stripe success path stub when keys are absent.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const on = url.searchParams.get("on") !== "0";
  const next = url.searchParams.get("next") || "/account";
  const res = NextResponse.redirect(new URL(next, url.origin));
  if (on) {
    res.cookies.set(MEMBER_COOKIE, "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    res.cookies.set(MEMBER_COOKIE, "", { path: "/", maxAge: 0 });
  }
  return res;
}
