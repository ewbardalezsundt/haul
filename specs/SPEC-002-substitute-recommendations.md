# SPEC-002 — Substitute Recommendations

**Priority:** P0 — Hackathon demo
**Status:** Not started
**Effort:** Low (~2 hours)
**Target:** June 30 hackathon

---

## Problem

When a field supervisor finds an asset that's Deployed or In Maintenance, the app shows a yellow warning ("Not available until {date}") and a dead end. The supervisor must go back to the catalog and manually search for alternatives. This is the same phone-call-and-guess workflow HAUL is supposed to replace.

## Goal

When viewing an unavailable asset, automatically suggest comparable available equipment. This creates the "Amazon-like" moment: "This item is unavailable — here are 2 similar items."

## Non-Goals

- AI/ML-based recommendations (future)
- Cross-type suggestions (e.g., suggesting a backhoe when an excavator is unavailable)
- Availability calendar or date-based matching

---

## Current State (code audit)

**`AssetDetail.tsx`** — When `asset.status !== "Available"`, the component renders:
```tsx
<div style={{ backgroundColor: "#FFF8E1", ... }}>
  <span>⚠</span>
  <span>Not available until {asset.readyDate}</span>
</div>
```
No substitute logic exists. The user must manually click "Back to catalog" and search.

**`data.ts`** — Assets have `type`, `specs`, `location`, `status`, and `rate` fields — all filterable. 23 assets across 15 types. Multiple assets exist for: Excavator (3), Skid Steer (3), Loader (2), Crane (2), Generator (2), Dozer (2).

**`helpers.ts`** — No substitute recommendation function exists.

---

## Implementation

### 1. New helper function (`helpers.ts`)

```tsx
export function getSubstitutes(asset: Asset, allAssets: Asset[], maxResults = 3): Asset[] {
  return allAssets
    .filter(a =>
      a.id !== asset.id &&          // Not the same asset
      a.type === asset.type &&       // Same type
      a.status === "Available"       // Must be available
    )
    .sort((a, b) => {
      // Prefer same yard, then nearest yard, then by rate similarity
      const aYardMatch = a.location === asset.location ? 0 : 1;
      const bYardMatch = b.location === asset.location ? 0 : 1;
      if (aYardMatch !== bYardMatch) return aYardMatch - bYardMatch;
      return Math.abs(a.rate - asset.rate) - Math.abs(b.rate - asset.rate);
    })
    .slice(0, maxResults);
}
```

**Sorting logic:** Same type → same yard first → closest rate (proxy for "similar specs").

### 2. UI in `AssetDetail.tsx`

Below the "Not available" warning, add a "Similar Available Equipment" section:

- [ ] Import `ASSETS` and `getSubstitutes` into `AssetDetail.tsx`
- [ ] Call `getSubstitutes(asset, ASSETS)` when `asset.status !== "Available"`
- [ ] Render a section with heading "Similar Available Equipment" and a compact card list
- [ ] Each substitute card shows: photo thumbnail (48×36), name, location, rate, "View →" button
- [ ] Clicking a substitute card calls `onBack()` then navigates to that asset's detail (or: pass a new `onSelectAsset` prop)
- [ ] If no substitutes found (e.g., only one Compactor exists), show: "No similar equipment currently available"

**Mockup:**
```
  ⚠ Not available until 2025-07-18

  ┌─────────────────────────────────────┐
  │ Similar Available Equipment          │
  │                                     │
  │ ┌─────┐ CAT 320 Excavator          │
  │ │ IMG │ Tempe Yard · $1,850/wk     │
  │ └─────┘                    View →   │
  │                                     │
  │ ┌─────┐ John Deere 350G Excavator  │
  │ │ IMG │ Tucson Yard · $2,400/wk    │
  │ └─────┘                    View →   │
  └─────────────────────────────────────┘
```

### 3. Props change in `FieldView.tsx`

- [ ] `AssetDetail` needs a way to navigate to a substitute. Options:
  - **Option A (simpler):** Add `onSelectAsset: (asset: Asset) => void` prop to `AssetDetail`. `FieldView` passes `setSelectedAsset`.
  - **Option B:** Substitute card calls `onBack()` first, then user manually finds the alternative. (Poor UX — avoid.)
- [ ] Use Option A.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/helpers.ts` | Add `getSubstitutes()` function |
| `src/components/AssetDetail.tsx` | Import ASSETS, call getSubstitutes, render substitute section |
| `src/components/FieldView.tsx` | Pass `onSelectAsset` prop to AssetDetail |

## Acceptance Criteria

- [ ] Viewing a Deployed asset (e.g., CAT 330, asset-2) shows substitute suggestions
- [ ] Viewing an In Maintenance asset (e.g., Volvo L90, asset-8) shows substitute suggestions
- [ ] Substitutes are same type and Available only
- [ ] Same-yard substitutes appear first
- [ ] Clicking a substitute navigates to that asset's detail page
- [ ] Available assets show no substitute section (only the "Request" button)
- [ ] If no substitutes exist for a type, show "No similar equipment currently available"
- [ ] Demo path: Browse → CAT 330 (Deployed) → See CAT 320 + JD 350G as substitutes → Click CAT 320 → Request it

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P0*
