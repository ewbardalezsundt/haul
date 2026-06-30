# SPEC-010 — Interactive Yard & Job Site Map

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Medium (~2-3 hours)
**Target:** June 30 hackathon

---

## Problem

"Where is it?" is always the next question after "Is it available?" Field supervisors need to know which yard an asset is at — and how that relates geographically to their job site. The text label "Tempe Yard" doesn't convey proximity.

## Goal

Add a map component to Field View showing the 4 Arizona yards and 5 job sites as pin markers. Clicking a pin shows assets at that location.

## Non-Goals (hackathon)

- Real-time GPS / telematics
- Turn-by-turn routing
- Satellite imagery
- Drag-to-assign equipment

---

## Current State (code audit)

**No map component exists.** Locations are text-only throughout the app.

**`data.ts`** — Yards have `id`, `name`, `city`. Job sites have `id`, `name`, `pm`, `code`. Neither has latitude/longitude coordinates.

**`FieldView.tsx`** — No map integration. Catalog is the only way to browse.

---

## Implementation

### Approach: Static SVG Map (no external dependency)

For the hackathon, a styled SVG map of the Phoenix metro area with positioned dots is simpler and more reliable than integrating a mapping library (Leaflet, Mapbox) which would require API keys and network access.

### 1. Add coordinates to `data.ts`

```tsx
export interface Yard {
  id: string; name: string; city: string;
  lat: number; lng: number;
}

export interface JobSite {
  id: string; name: string; pm: string; code: string;
  lat: number; lng: number;
}
```

Approximate AZ coordinates:
```tsx
export const YARDS: Yard[] = [
  { id: "yard-1", name: "Tempe Yard", city: "Tempe, AZ", lat: 33.4255, lng: -111.9400 },
  { id: "yard-2", name: "Tucson Yard", city: "Tucson, AZ", lat: 32.2226, lng: -110.9747 },
  { id: "yard-3", name: "Chandler Yard", city: "Chandler, AZ", lat: 33.3062, lng: -111.8413 },
  { id: "yard-4", name: "Mesa Yard", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315 },
];

export const JOB_SITES: JobSite[] = [
  { id: "job-1", name: "I-10 Broadway Curve", pm: "Martinez", code: "AZ-2025-041", lat: 33.3933, lng: -111.9780 },
  { id: "job-2", name: "Chandler Municipal Center", pm: "Johnson", code: "AZ-2025-018", lat: 33.3028, lng: -111.8414 },
  { id: "job-3", name: "Tucson Water Reclamation", pm: "Davis", code: "AZ-2025-033", lat: 32.1800, lng: -110.9500 },
  { id: "job-4", name: "Mesa Light Rail Extension", pm: "Thompson", code: "AZ-2025-027", lat: 33.4148, lng: -111.7890 },
  { id: "job-5", name: "ASU Research Campus", pm: "Wilson", code: "AZ-2025-052", lat: 33.4242, lng: -111.9281 },
];
```

### 2. New component: `src/components/AssetMap.tsx`

A positioned SVG that maps lat/lng to pixel coordinates within a bounding box (roughly Phoenix metro → Tucson).

- [ ] Bounding box: lat 32.0–33.6, lng -112.2–-110.7
- [ ] Yard pins: red/navy squares with asset count badges
- [ ] Job site pins: smaller blue dots with project code labels
- [ ] Deployed assets shown at their job site location
- [ ] Click a yard pin → filter catalog to assets at that yard
- [ ] Click a job site pin → show deployed assets at that site
- [ ] Tooltip on hover: location name + asset count

**Visual design:**
```
  ┌────────────────────────────────────────────┐
  │    Asset Locations                         │
  │                                            │
  │          ◆ Tempe Yard (8)                  │
  │    ● I-10 Broadway      ◆ Mesa Yard (4)   │
  │                ◆ Chandler (3)  ● Mesa LR   │
  │          ● ASU    ● Chandler Muni          │
  │                                            │
  │                                            │
  │                                            │
  │          ◆ Tucson Yard (3)                 │
  │              ● Tucson Water                │
  └────────────────────────────────────────────┘
  ◆ = Yard (clickable, shows asset count)
  ● = Job Site (clickable, shows deployed assets)
```

### 3. Integrate in `FieldView.tsx`

- [ ] Add a toggle button in the catalog header: "📍 Map View" / "🔲 Grid View"
- [ ] When map is active, render `<AssetMap />` instead of the grid
- [ ] Map click on a yard calls `setCategory("All")` and scrolls to filtered results, or opens a mini-list overlay
- [ ] Map is supplementary — catalog grid remains the default view

### Alternative: Below-the-fold map

Instead of replacing the grid, show the map as a collapsible card above the catalog grid. Always visible, doesn't replace anything.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `lat`/`lng` to Yard and JobSite interfaces and records |
| `src/components/AssetMap.tsx` | **New file** — SVG map component with pins |
| `src/components/FieldView.tsx` | Add map toggle or collapsible map section |

## Acceptance Criteria

- [ ] Map shows 4 yards and 5 job sites as distinct markers
- [ ] Yard markers show asset count
- [ ] Clicking a yard filters the catalog to assets at that location
- [ ] Tucson Yard is visually separate from the Phoenix metro cluster
- [ ] Map is readable on tablet (pin labels don't overlap)
- [ ] Map is hidden or simplified on mobile (< 640px) — catalog grid is primary on phone
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
