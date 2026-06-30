# SPEC-009 — Estimated Delivery / Transit Time

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Low (~45 minutes)
**Target:** June 30 hackathon

---

## Problem

A field supervisor sees that a CAT 320 is available at Tucson Yard, but their job is in Mesa. "Available" doesn't answer "when can I actually get it?" — that currently requires a phone call.

## Goal

Show an estimated transit time from the asset's yard to the selected job site. Hardcode a lookup matrix for the 4 yards × 5 job sites (20 combinations).

## Non-Goals

- Real-time traffic / route calculation
- GPS-based distance
- Delivery scheduling or dispatch integration

---

## Current State (code audit)

**`data.ts`** — 4 yards (Tempe, Tucson, Chandler, Mesa) and 5 job sites (I-10 Broadway Curve, Chandler Municipal, Tucson Water Reclamation, Mesa Light Rail, ASU Research Campus). No coordinates, no distance data.

**`AssetDetail.tsx`** — Shows `getLocation(asset.location)` as text. No transit estimate.

**`OrderWizard.tsx`** — Step 4 Review shows job site name but no delivery estimate.

---

## Implementation

### 1. Transit time matrix (`data.ts` or `helpers.ts`)

```tsx
// Transit estimates in minutes — yard (row) to job site (column)
// Rows: yard-1 (Tempe), yard-2 (Tucson), yard-3 (Chandler), yard-4 (Mesa)
// Cols: job-1 (I-10 Broadway), job-2 (Chandler Muni), job-3 (Tucson Water), job-4 (Mesa Light Rail), job-5 (ASU Research)
export const TRANSIT_MINUTES: Record<string, Record<string, number>> = {
  "yard-1": { "job-1": 20, "job-2": 35, "job-3": 120, "job-4": 30, "job-5": 15 },
  "yard-2": { "job-1": 120, "job-2": 130, "job-3": 15, "job-4": 115, "job-5": 125 },
  "yard-3": { "job-1": 30, "job-2": 10, "job-3": 125, "job-4": 25, "job-5": 35 },
  "yard-4": { "job-1": 25, "job-2": 30, "job-3": 115, "job-4": 10, "job-5": 20 },
};
```

Helper function:
```tsx
export function getTransitEstimate(yardId: string, jobSiteId: string): string | null {
  const minutes = TRANSIT_MINUTES[yardId]?.[jobSiteId];
  if (!minutes) return null;
  if (minutes < 60) return `~${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`;
}
```

### 2. Display in `AssetDetail.tsx`

- [ ] Below the location text, show: "Est. delivery to [selected job]: ~30 min from Tempe Yard"
- [ ] Since the job site isn't selected yet at this point, show transit times to all 5 job sites as a compact list, or show just the nearest job site as a teaser
- [ ] **Simpler option:** Show "Est. transit: 15–120 min depending on job site" as a range

### 3. Display in `OrderWizard.tsx` — Step 4 Review

- [ ] Once the job site is selected (Step 1), calculate transit from asset location to selected job site
- [ ] Add `InfoRow` in the Review step:
  ```tsx
  <InfoRow label="Est. Transit" value={getTransitEstimate(asset.location, form.jobSiteId) || "N/A"} />
  ```
- [ ] Only show transit if asset is at a yard (not already deployed at a job site)

### 4. Display in `RequestCard.tsx` (Equipment Services)

- [ ] Show transit estimate in the metadata grid: "Transit: ~30 min from Tempe Yard"
- [ ] Helps coordinators prioritize dispatch logistics

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `TRANSIT_MINUTES` matrix |
| `src/lib/helpers.ts` | Add `getTransitEstimate()` function |
| `src/components/OrderWizard.tsx` | Show transit estimate in Step 4 Review |
| `src/components/RequestCard.tsx` | Show transit in metadata grid |
| `src/components/AssetDetail.tsx` | Optional: show transit range or note |

## Acceptance Criteria

- [ ] Order Review (Step 4) shows "Est. Transit: ~30 min" when asset is at Tempe Yard and job is Chandler Municipal
- [ ] Transit shows "~2h" for Tucson Yard → Mesa Light Rail
- [ ] No transit shown when asset is deployed at a job site (location is "job-*")
- [ ] Equipment Services request card shows transit estimate
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
