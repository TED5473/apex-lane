# Apex Lane

Premium editorial **car intelligence**. Free lede. Pay to read more.

Next.js App Router · TypeScript · Tailwind · MDX · Stripe Checkout (test-mode stubs).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Hero + latest briefings + members CTA |
| `/briefings` | Index (lock badge on gated pieces) |
| `/briefings/[slug]` | Freemium article |
| `/pricing` | $12/mo · $99/yr + Stripe Checkout handlers |
| `/account` | Membership status + Customer Portal stub |
| `/about` | Editorial standards & source policy |

## Quick start

```bash
npm install
cp .env.example .env.local   # optional until you wire Stripe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # must pass
npm start
```

## Freemium model

- MDX in `content/briefings/*.mdx` may include a `<!-- PAYWALL -->` marker (preferred) and/or frontmatter `freePreviewWords`.
- **Non-members** see the free lede + gated CTA.
- **Members** see the full body.

### Preview member vs free (no Stripe required)

1. **Query flag:** append `?member=1` to any briefing URL.
2. **Cookie demo:** visit `/api/member-demo?on=1` (sets `apex_member=1`) or `?on=0` to clear.
3. **Stripe success stub:** Checkout `success_url` lands on `/account?checkout=success`; grant access via webhook in production, or use the demo cookie locally.

## Stripe (test mode)

API routes:

- `POST /api/checkout` — body `{ "plan": "monthly" | "yearly" }`
- `POST /api/portal` — Customer Portal session (needs `STRIPE_CUSTOMER_ID` in this stub)
- `POST /api/webhook` — signature-verified event ack (no DB yet)

Required env (see `.env.example`):

```
STRIPE_SECRET_KEY
STRIPE_PRICE_MONTHLY
STRIPE_PRICE_YEARLY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_BASE_URL
```

If keys are missing, Pricing buttons show a setup message instead of crashing.

Create products in Stripe Dashboard (test mode): recurring **$12/month** and **$99/year**, paste Price IDs into `.env.local`. Forward webhooks with Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Content

Seeded Sep 2026 briefings (public sources only; do not invent MSRPs beyond the drafts):

1. Tesla’s September inventory sprint — what actually changed  
2. Xiaomi Sky Nomad and the Golden September entitlement war  
3. China EV Competitive Brief — September 2026  

Edit / add MDX under `content/briefings/`.

## Disclaimers

- Public sources only. Not affiliated with any OEM.  
- **Not investment advice.** Guide prices and promotions change; verify on brand channels.  
- Independent editorial coverage.

## Stack notes

- App Router + `src/`
- `next-mdx-remote/rsc` for MDX
- Tailwind v4 + `@tailwindcss/typography` plugin (custom MDX components for tables/type)
- Design: refined dark ink journal — Instrument Serif + Source Sans 3, brass accent
