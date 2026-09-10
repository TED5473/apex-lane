import { cookies } from "next/headers";

export const MEMBER_COOKIE = "apex_member";

/** Demo membership: cookie apex_member=1, or ?member=1 for preview. */
export async function isMember(searchParams?: {
  member?: string | string[];
}): Promise<boolean> {
  if (searchParams) {
    const raw = searchParams.member;
    const flag = Array.isArray(raw) ? raw[0] : raw;
    if (flag === "1" || flag === "true") return true;
  }

  const jar = await cookies();
  return jar.get(MEMBER_COOKIE)?.value === "1";
}

export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_MONTHLY &&
      process.env.STRIPE_PRICE_YEARLY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export function requiredStripeEnv(): string[] {
  return [
    "STRIPE_SECRET_KEY",
    "STRIPE_PRICE_MONTHLY",
    "STRIPE_PRICE_YEARLY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_BASE_URL",
  ];
}

export function missingStripeEnv(): string[] {
  return requiredStripeEnv().filter((key) => !process.env[key]);
}
