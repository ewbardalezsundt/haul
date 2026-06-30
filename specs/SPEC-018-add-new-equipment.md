# SPEC-018 — Add New Equipment (Equipment Services)

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Medium (~60–90 minutes)
**Target:** June 30 hackathon

---

## Problem

Equipment Services coordinators have no way to register new assets inside HAUL. The 23 seed assets are hardcoded in `data.ts` as a static `const` array, and no component imports them through state. When Sundt acquires or transfers a piece of equipment, an ES coordinator would need a developer to add it to the codebase. This breaks the "single platform" promise and prevents ES from demonstrating fleet management ownership in the demo.

## Goal

Give Equipment Services coordinators a form to add a new asset to the HAUL fleet from within the app. The new asset appears immediately in the Field View catalog, the Fleet Overview table, and all KPI/utilization calculations — no page reload required.

## Non-Goals

- Edit or archive existing assets (future)
- Bulk import / CSV upload
- Image upload (hackathon uses a dropdown of existing photos or a generic placeholder)
- Linking to ERP or asset management system (Phase 5)
- Validation against real Sundt asset ID schema

---

## Current State (code audit)

**`src/lib/data.ts`**
- `Asset` interface: `id`, `name`, `type`, `make`, `model`, `year`, `specs` (Record<string, string>), `location`, `status`, `readyDate`, `certRequired`, `photo`, `rate`
- `ASSETS` is a `const` array of 23 items — **not in React state**
- `CATEGORIES` lists 16 type strings (including "All")
- `YARDS` has 4 yard objects (`yard-1` through `yard-4`)

**`src/app/page.tsx`**
- Imports `ASSETS` directly — no `useState` wrapper, no setter function
- `requests` are in state + persisted to localStorage (via `storage.ts`)
- `ASSETS` is referenced by `FieldView`, `EquipServicesView`, `FleetOverview`, helpers

**`src/lib/storage.ts`**
- Only persists requests and the sequence number — no asset persistence

**`src/components/EquipServicesView.tsx`**
- Imports `ASSETS` directly for KPI calculations (`total`, `deployed`, `utilization`)
- Tabs: `queue`, `fleet`, `active`, `history`

**`src/components/FleetOverview.tsx`**
- Imports `ASSETS` directly for the fleet table

**`src/components/FieldView.tsx`**
- Imports `ASSETS` directly for catalog grid and filtering

---

## Implementation

### 1. Lift assets into React state (`page.tsx`)

Mirror the pattern used for `requests`:

- [ ] Add state: `const [assets, setAssets] = useState<Asset[]>(ASSETS)`
- [ ] Hydrate from localStorage on mount (same pattern as requests)
- [ ] Persist to localStorage on change via `useEffect`
- [ ] Add `addAsset` callback that appends to state and auto-generates the next `asset-{N}` ID
- [ ] Add `nextAssetNum` state (initialize to `ASSETS.length + 1 = 24`)
- [ ] Pass `assets` and `addAsset` as props to `FieldView`, `EquipServicesView`

### 2. Add asset storage functions to `storage.ts`

```ts
const ASSET_KEY = "haul_assets";
const ASSET_SEQ_KEY = "haul_next_asset";

export function loadAssets(): Asset[] {
  if (typeof window === "undefined") return ASSETS;
  try {
    const stored = localStorage.getItem(ASSET_KEY);
    return stored ? JSON.parse(stored) : ASSETS;
  } catch { return ASSETS; }
}

export function saveAssets(assets: Asset[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(ASSET_KEY, JSON.stringify(assets)); }
  catch { /* silent */ }
}

export function loadNextAssetNum(): number { /* same pattern, default 24 */ }
export function saveNextAssetNum(n: number): void { /* same pattern */ }
```

Update `resetStorage()` to also clear `ASSET_KEY` and `ASSET_SEQ_KEY`.

### 3. Thread `assets` prop through components

Components that currently `import { ASSETS }` directly need to receive `assets` as a prop instead so they reflect newly added equipment:

| Component | Current | Change |
|---|---|---|
| `FieldView.tsx` | `import { ASSETS }` | Accept `assets: Asset[]` prop |
| `EquipServicesView.tsx` | `import { ASSETS }` for KPIs | Accept `assets: Asset[]` prop + `addAsset` callback |
| `FleetOverview.tsx` | `import { ASSETS }` | Accept `assets: Asset[]` prop |
| `AssetDetail.tsx` | Receives single asset already | No change |
| `helpers.ts` | Uses `ASSETS` for `getLocation` | Accept `assets` param or keep as-is (location helper only uses `YARDS`/`JOB_SITES`) |

### 4. Add "Add Equipment" form to Equipment Services view

Place an **"+ Add Equipment"** button on the **Fleet tab**. Clicking it opens an inline form (or slide-down panel) above the fleet table.

**Form fields:**

| Field | Input | Required | Default / Notes |
|---|---|---|---|
| Name | Text | Yes | e.g. "CAT 336 Excavator" |
| Type | Dropdown (CATEGORIES minus "All") | Yes | — |
| Make | Text | Yes | e.g. "Caterpillar" |
| Model | Text | Yes | e.g. "336" |
| Year | Number | Yes | Current year (2026) |
| Yard | Dropdown (YARDS) | Yes | First yard |
| Status | Dropdown: Available / In Maintenance | Yes | "Available" |
| Ready Date | Date input | Yes | Today |
| Daily Rate ($) | Number | Yes | — |
| Cert Required | Dropdown: list of cert types + "None" | No | "None" → `null` |
| Photo | Dropdown of existing filenames | No | Placeholder path |
| Specs | Dynamic key/value pairs (+ Add Spec row) | No | Empty → `{}` |

**Auto-generated:** `id` = `"asset-{nextAssetNum}"`

**Mockup:**
```
  ┌──────────────────────────────────────────────────┐
  │  + Add Equipment to Fleet                        │
  │                                                  │
  │  Name *              Type *                      │
  │  ┌──────────────┐    ┌────────────────────┐      │
  │  │ CAT 336 Exc… │    │ ▼ Excavator        │      │
  │  └──────────────┘    └────────────────────┘      │
  │                                                  │
  │  Make *              Model *         Year *      │
  │  ┌──────────┐        ┌─────────┐    ┌──────┐    │
  │  │ Caterp…  │        │ 336     │    │ 2026 │    │
  │  └──────────┘        └─────────┘    └──────┘    │
  │                                                  │
  │  Yard *              Status *                    │
  │  ┌────────────────┐  ┌──────────────────┐        │
  │  │ ▼ Tempe Yard   │  │ ▼ Available      │        │
  │  └────────────────┘  └──────────────────┘        │
  │                                                  │
  │  Ready Date *        Daily Rate ($) *            │
  │  ┌────────────────┐  ┌──────────────────┐        │
  │  │ 2026-06-30     │  │ 2200             │        │
  │  └────────────────┘  └──────────────────┘        │
  │                                                  │
  │  Cert Required       Photo                       │
  │  ┌────────────────┐  ┌──────────────────────┐    │
  │  │ ▼ Excavator    │  │ ▼ cat-320-excavat… │      │
  │  └────────────────┘  └──────────────────────┘    │
  │                                                  │
  │  Specs (optional)                                │
  │  ┌──────────┐  ┌──────────┐                      │
  │  │ weight   │  │ 69,200 lb│  [×]                 │
  │  └──────────┘  └──────────┘                      │
  │  ┌──────────┐  ┌──────────┐                      │
  │  │ hp       │  │ 281 HP   │  [×]                 │
  │  └──────────┘  └──────────┘                      │
  │  [+ Add Spec]                                    │
  │                                                  │
  │            [Cancel]  [Add to Fleet]              │
  └──────────────────────────────────────────────────┘
```

**Behavior:**
- "Add to Fleet" button uses `S.submitGreen` (`#00A200`) — consistent with other submit actions
- Button disabled until all required fields are filled
- On submit: call `addAsset(newAsset)`, close the form, show a brief success indicator
- Form resets after successful submission
- Cancel closes the form without changes

### 5. Cert type options

Derive from existing assets:

```ts
const CERT_TYPES = [
  "Excavator", "Skid Steer", "Loader", "Crane",
  "Generator", "Dozer", "Boom Lift"
];
```

Plus a "None" option that maps to `certRequired: null`.

### 6. Photo dropdown options

List all filenames from `public/images/equipment/`. For hackathon, hardcode the list:

```ts
const PHOTO_OPTIONS = ASSETS.map(a => a.photo).filter((v, i, arr) => arr.indexOf(v) === i);
```

Plus a generic placeholder option (e.g. `/images/equipment/placeholder.jpg` or reuse the first available photo as fallback).

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Export `CERT_TYPES` array |
| `src/lib/storage.ts` | Add `loadAssets`, `saveAssets`, `loadNextAssetNum`, `saveNextAssetNum`; update `resetStorage` |
| `src/app/page.tsx` | Add `assets`/`setAssets` state, hydration, persistence, `addAsset` callback; pass as props |
| `src/components/EquipServicesView.tsx` | Accept `assets` + `addAsset` props; render "Add Equipment" form on Fleet tab; replace direct `ASSETS` import for KPIs |
| `src/components/FleetOverview.tsx` | Accept `assets` prop; replace direct `ASSETS` import |
| `src/components/FieldView.tsx` | Accept `assets` prop; replace direct `ASSETS` import |

---

## Acceptance Criteria

- [ ] "Fleet" tab in Equipment Services view shows an "+ Add Equipment" button
- [ ] Clicking opens a form with all required fields
- [ ] "Add to Fleet" button disabled until required fields are filled
- [ ] On submit: form closes, new asset appears in Fleet Overview table immediately
- [ ] New asset visible in Field View catalog (no page reload)
- [ ] KPIs (Total Fleet, Equipment Utilization) update to reflect the new asset
- [ ] New asset persists across page refreshes (localStorage)
- [ ] `window.__resetHaul()` clears added assets and restores seed data
- [ ] Type dropdown uses existing CATEGORIES list
- [ ] Yard dropdown uses existing YARDS data
- [ ] Specs support dynamic key/value pair entry
- [ ] Sundt brand compliance: submit button is `#00A200` (Submit Green), no red for non-brand usage
- [ ] Mobile responsive: form stacks to single-column on mobile
- [ ] Build passes, no TypeScript errors

---

## Step-by-Step Walkthrough

### 1. Navigate to Equipment Services Dashboard

From anywhere in HAUL, click **"Equipment Services"** (📋) in the top-right nav bar. You land on the Equipment Services Dashboard showing four KPI cards at the top — note **Total Fleet** currently reads **23**.

### 2. Open the Fleet tab

Below the KPI strip, Certification Compliance donut, and Upcoming Maintenance table, you'll see four tabs: **Request Queue**, **Fleet**, **Active**, **History**. Click **"Fleet"**.

You now see:
- A navy **"+ Add Equipment"** button at the top-left
- The fleet table below listing all 23 assets with columns: Asset, Type, Location, Status, Ready Date, Rate

### 3. Click "+ Add Equipment"

The button toggles to **"× Cancel"** (gray) and a white form card slides in above the fleet table with the heading **"Add Equipment to Fleet"**.

The form has a 2-column grid layout (single column on mobile) with these fields:

| Field | Input Type | Notes |
|---|---|---|
| **Name *** | Text | e.g. "CAT 336 Excavator" |
| **Type *** | Dropdown | All 15 equipment categories (Excavator, Skid Steer, Loader…) |
| **Make *** | Text | e.g. "Caterpillar" |
| **Model *** | Text | e.g. "336" |
| **Year *** | Number | Defaults to 2026 |
| **Yard *** | Dropdown | Tempe Yard, Tucson Yard, Chandler Yard, Mesa Yard |
| **Status *** | Dropdown | Available or In Maintenance |
| **Ready Date *** | Date picker | Defaults to 2026-06-30 |
| **Weekly Rate ($) *** | Number | e.g. 2200 |
| **Cert Required** | Dropdown | None, Excavator, Skid Steer, Loader, Crane, Generator, Dozer, Boom Lift |
| **Photo** | Dropdown | "Use default" or pick from existing equipment photos |

### 4. Fill in required fields

Example entry:
- Name: `CAT 336 Excavator`
- Type: `Excavator`
- Make: `Caterpillar`
- Model: `336`
- Year: `2026`
- Yard: `Tempe Yard`
- Status: `Available`
- Ready Date: `2026-06-30`
- Weekly Rate: `2200`
- Cert Required: `Excavator`
- Photo: `cat-320-excavator.jpg` (or "Use default")

The **"Add to Fleet"** button at the bottom-right stays gray/disabled until all required fields (*) are filled. Once ready it turns green (`#00A200`).

### 5. Add specs (optional)

Below the main grid, there's a **"Specs (optional)"** section. Click **"+ Add Spec"** to add key/value rows:
- Row 1: Key = `weight`, Value = `79,000 lb`
- Row 2: Key = `hp`, Value = `281 HP`

Each row has a **×** button to remove it. You can add as many spec rows as needed.

### 6. Submit — click "Add to Fleet"

Click the green **"Add to Fleet"** button. Three things happen:
1. The form closes
2. A green **"✓ Equipment added to fleet"** confirmation appears next to the "+ Add Equipment" button (auto-dismisses after 3 seconds)
3. The new asset immediately appears as the last row in the fleet table below

### 7. Verify across views

- **Fleet table:** Scroll down — new asset is the last row with all the details you entered
- **KPI strip:** Scroll up — **Total Fleet** now shows **24** and **Equipment Utilization** recalculates
- **Field View:** Click "Field View" in the nav — the new asset appears in the catalog grid, filterable by type and status
- **Persistence:** Refresh the page — the new asset is still there (saved to localStorage)

### 8. Reset (if needed)

Open the browser console (F12) and run `window.__resetHaul()` to clear all added equipment and requests back to the original 23 seed assets.

---

## Demo Script

1. Switch to Equipment Services view → Fleet tab
2. Click "+ Add Equipment"
3. Fill in: "CAT 336 Excavator", Type: Excavator, Make: Caterpillar, Model: 336, Year: 2026, Yard: Tempe, Available, Rate: $2,200
4. Add specs: weight = "79,000 lb", hp = "281 HP"
5. Click "Add to Fleet" → asset appears in fleet table (row 24)
6. Switch to Field View → new asset appears in catalog
7. KPI "Total Fleet" now shows 24
8. Refresh page → asset persists

---

*Spec created June 30, 2026 — HAUL Equipment Services: fleet management capability*
