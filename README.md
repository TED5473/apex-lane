# Apex Lane — China EV compare

Primary product: **side-by-side China EV guide-MSRP & specs compare**. Articles under `/briefings` (Notes) are secondary.

## Product

| Tier | What you get |
|------|----------------|
| Free | Compare up to **3** trims. Full row detail: guide MSRP, incentive notes, blanks labeled, source + accessed date. |
| Members | **Unlimited** compare + **CSV export** (selection or full catalog). Demo: `?member=1` or cookie `apex_member=1`. |

Differentiation (UI, not slogans):

- Guide MSRP labeled separately from incentive / entitlement notes
- Empty fields = “Not in source” (never invent MSRPs)
- Source URL + accessed date per row when available
- Method strip on compare surfaces

## Routes

| Path | Purpose |
|------|---------|
| `/` | Tool-first hero + **working** sample compare (3 trims) |
| `/compare` | Full interactive compare + catalog filters |
| `/api/export` | CSV if member; else 403 JSON |
| `/pricing` | $12/mo · $99/yr + Stripe stubs |
| `/account` | Membership status |
| `/briefings` | Notes (demoted) |
| `/about` | Method & disclaimers |

## Data

Seed: `data/vehicles.json` (from `china-ev-competitive-pack/.../pricing_specs.csv`). Do not invent MSRPs.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional until Stripe
npm run dev
npm run build
```

## Stripe

Same stubs as before (`/api/checkout`, `/api/portal`, `/api/webhook`). Missing keys show setup UI.

Demo membership: `/api/member-demo?on=1&next=/compare`
