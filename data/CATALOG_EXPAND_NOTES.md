# Catalog expand notes — 2026-09-10

## Outcome
- Prior catalog: **16** rows
- Added: **20** verified public guide rows
- New total: **36**
- FX: `msrp_usd_approx ≈ msrp_rmb / 6.78`
- Schema enrichment (optional): `powertrain`, `charge_notes`, `body_layout`, `key_differentiators`, `decision_tags`

## Added (sources)
| id | MSRP RMB | Primary source |
| --- | ---: | --- |
| xiaomi-su7-standard / pro / max | 219900 / 249900 / 303900 | electrive.com 2026-03-20 (dual PCauto/Sina) |
| xiaomi-yu7-standard / long-range / pro | 233500 / 253500 / 279900 | CnEVPost 2026-05-21 + cnevpost.com/cars/xiaomi-yu7 |
| nio-et5-100kwh | 298000 | CnEVPost + CarNewsChina 2026-04-02 (pack-included; BaaS noted) |
| nio-es6-100kwh | 338000 | same dual source |
| li-auto-l6-ultra | 249800 | CnEVPost 2026-07-16 (51 kWh / 300 km EV from launch briefings) |
| li-auto-l9-ultra | 459800 | data.carnewschina.com L9 2026 |
| xpeng-g6-625-max-tech / flagship | 176800 / 186800 | xchuxing launch table; battery/range from retail explainers of same event |
| xpeng-p7-plus-bev-1868 | 186800 | xiaopeng.com official 2026 config (price only; battery/range omitted) |
| leapmotor-c10-erev-entry / bev-660 | 125800 / 142800 | CnEVPost 2026-06-16 + CarNewsChina 2026-06-17 band ends |
| aito-m7-erev-pro-plus-5seat | 279800 | CnEVPost 2025-09-23; CNC 2026 db still lists band |
| aito-m9-max-plus-erev | 479800 | ChinaEVHome 2026-05-27 band open |
| zeekr-001-max-103-rwd | 269800 | CarNewsChina 2025-10-11 launch table |
| zeekr-7x-max-75-rwd / ultra-103-awd | 229800 / 269800 | CarNewsChina 2025-10-28 (+ CNC db Sep 2026) |

## Skipped (why)
- **BYD Sealion 07 EV**: pulled from China retail for export focus (CNC Jul 2026) — no current domestic guide row
- **BYD Song / more Seal 06 / Qin**: incomplete fresh Sep trim tables without inventing battery/range; existing Qin/Seal 06 rows kept
- **Xiaomi YU7 GT / Max**: Max/GT prices appear in retail explainers; Max not dual-sourced cleanly in this pass — deferred
- **NIO nature editions / BaaS-only prices**: BaaS is not pack-included MSRP; special editions deferred
- **Li Auto L9 Livis / L7**: Livis price known but not needed for entry/flagship pair; L7 refresh timing ambiguous
- **XPeng G6 EREV / P7+ higher trims**: EREV G6 exists in later retail copy; stick to dual-clear BEV launch band + official P7+ floor
- **Leapmotor mid trims**: only band endpoints verified in English launch coverage without inventing Smart vs LiDAR names as MSRP certainty
- **AITO M7 full matrix / M9 Ultra/Ultimate**: many seat×ADAS SKUs; only clear band opens
- **Geely Galaxy / Zeekr extras**: Galaxy Cruiser pre-sale only as of Sep notes — skipped

## UI shipped with this pack
- Visual bars (MSRP / range / battery) + lite radar
- Scenario toggles (City/Highway, Charging, Budget, Seats) → fit chips
- Notes removed from primary nav; homepage is tool preview, not editorial wall
