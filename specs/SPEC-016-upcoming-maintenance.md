# SPEC-016 — Upcoming Maintenance Table

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Medium (~1 hour)
**Target:** June 30 hackathon

---

## Problem

The pitch deck (Slide 8) shows an "Upcoming Maintenance" table listing equipment with maintenance type and due date. Our Equipment Services dashboard has no maintenance visibility — the only maintenance signal is assets with `status: "In Maintenance"`, which says nothing about what's coming.

## Goal

Add mock maintenance schedule data and display an "Upcoming Maintenance" table in the Equipment Services dashboard.

## Non-Goals

- Maintenance scheduling or editing
- Work order creation
- Maintenance history
- Integration with a CMMS

---

## Current State

**`data.ts`** — Assets have `status` ("Available" | "Deployed" | "In Maintenance") but no maintenance schedule fields. No `MAINTENANCE` data structure exists.

**`EquipServicesView.tsx`** — No maintenance section.

---

## Implementation

### 1. Add mock maintenance data to `data.ts`

```tsx
export interface MaintenanceSchedule {
  assetId: string;
  type: "PM Service" | "Inspection" | "Repair" | "Cert Renewal";
  dueDate: string;
  notes?: string;
}

export const UPCOMING_MAINTENANCE: MaintenanceSchedule[] = [
  { assetId: "asset-2", type: "PM Service", dueDate: "2025-07-09" },
  { assetId: "asset-19", type: "Inspection", dueDate: "2025-07-11" },
  { assetId: "asset-8", type: "PM Service", dueDate: "2025-07-14" },
  { assetId: "asset-6", type: "Inspection", dueDate: "2025-07-17" },
  { assetId: "asset-13", type: "PM Service", dueDate: "2025-07-20" },
];
```

### 2. Render table in Equipment Services dashboard

Add alongside or below the compliance card (SPEC-015):

- [ ] Table columns: Equipment (photo + name), Type, Due Date
- [ ] Sorted by due date ascending (nearest first)
- [ ] Show 5 rows maximum, with "View all" link
- [ ] Due dates within 3 days: highlight row or due date in yellow
- [ ] Overdue dates: highlight in `S.black70` (not red — Sundt brand)

### 3. Dashboard layout

- [ ] Option A: Add as a new tab alongside "Fleet Overview"
- [ ] Option B (recommended): Add as a card below the KPI strip when "Request Queue" tab is active, side-by-side with compliance card

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `MaintenanceSchedule` interface and `UPCOMING_MAINTENANCE` mock data |
| `src/components/EquipServicesView.tsx` | Add upcoming maintenance table card |

## Acceptance Criteria

- [ ] Table shows 5 upcoming maintenance items sorted by due date
- [ ] Each row shows equipment photo, name, maintenance type, and due date
- [ ] All data is mock — no backend, no real scheduling
- [ ] Matches pitch deck Slide 8 "Upcoming Maintenance" section
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 8 (Equipment Services Experience)*
