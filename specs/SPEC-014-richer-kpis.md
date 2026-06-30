# SPEC-014 — Richer KPIs (Fill Rate, Utilization %, Trends)

**Priority:** P0 — Hackathon demo polish
**Status:** Not started
**Effort:** Low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

The Equipment Services dashboard shows simple counts (Total Fleet: 23, Available: 18, etc.). The pitch deck (Slide 8) shows percentage-based KPIs with trend arrows: "Internal Fill Rate: 82%", "Equipment Utilization: 78%", "Total Fleet: 1,246". Simple counts feel like a prototype; percentages and trends feel like a production dashboard.

## Goal

Replace the current 5 count-based KPIs with a mix of percentage metrics and counts that match the pitch deck vision, calculated from mock data.

## Non-Goals

- Historical data or real trend calculations
- Charting (donut, line) — that's SPEC-015
- Backend analytics

---

## Current State

**`EquipServicesView.tsx`** — 5 stat cards in a grid:
```tsx
const stats = [
  { label: "Total Fleet", value: ASSETS.length, accent: S.red },
  { label: "Available", value: ASSETS.filter(...).length, accent: S.green },
  { label: "Deployed", value: ASSETS.filter(...).length, accent: S.navy },
  { label: "In Maintenance", value: ASSETS.filter(...).length, accent: S.yellow },
  { label: "Pending Requests", value: pending.length, accent: S.blue },
];
```

All values are raw counts with no formatting, no percentages, no trend indicators.

---

## Implementation

### 1. Calculate richer metrics

```tsx
const total = ASSETS.length;
const available = ASSETS.filter(a => a.status === "Available").length;
const deployed = ASSETS.filter(a => a.status === "Deployed").length;
const utilization = Math.round((deployed / total) * 100);
const totalRequests = requests.length;
const fulfilled = requests.filter(r => ["Accepted", "In Transit"].includes(r.status)).length;
const fillRate = totalRequests > 0 ? Math.round((fulfilled / totalRequests) * 100) : 0;

const stats = [
  { label: "Internal Fill Rate", value: `${fillRate}%`, sub: "This Month", accent: S.red, trend: "▲ 9% vs last month" },
  { label: "Active Requests", value: pending.length + active.length, sub: `${pending.length} Pending Approval`, accent: S.navy },
  { label: "Equipment Utilization", value: `${utilization}%`, sub: "This Month", accent: S.green, trend: "▲ 7% vs last month" },
  { label: "Total Fleet", value: total, sub: "Total Assets", accent: S.black80 },
];
```

**Note:** Trend values ("▲ 9% vs last month") are hardcoded mock data per hackathon rules — there is no historical data to calculate real trends.

### 2. Update stat card rendering

- [ ] Display `value` as large text, `sub` as smaller text below
- [ ] Show `trend` in green (▲) or red (▼) text below the sub-label when present
- [ ] Reduce from 5 cards to 4 for a cleaner layout (`repeat(4, 1fr)`)

### 3. Mock trend data

All trends are static mock values. Add a note in `data.ts`:
```tsx
// Mock trend data — hardcoded per hackathon rules (no historical data)
```

---

## Files Changed

| File | Change |
|---|---|
| `src/components/EquipServicesView.tsx` | Replace stat calculations, update card rendering with % and trends |

## Acceptance Criteria

- [ ] Dashboard shows: Internal Fill Rate (%), Active Requests (count + pending), Equipment Utilization (%), Total Fleet
- [ ] Percentages calculated from actual mock data (requests, assets)
- [ ] Trend arrows shown as hardcoded mock data (no real historical calculation)
- [ ] Stat cards feel executive-level, not prototype-level
- [ ] Matches pitch deck Slide 8 dashboard style
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 8 (Equipment Services Experience)*
