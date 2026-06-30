# SPEC-001 — Responsive Layout (Mobile & Tablet)

**Priority:** P0 — Must-have before field deployment
**Status:** ✅ Done (June 30, 2026)
**Effort:** Medium (touches all components; no new features, layout refactor only)
**Target:** Hackathon demo (June 30)

---

## Problem

HAUL is a field-use app — supervisors and foremen will use it on phones and ruggedized tablets at job sites. All current layouts use fixed pixel values, hardcoded grid columns, and inline styles that do not adapt to viewport width. On a phone (~375px), the catalog grid overflows, the filter bar wraps awkwardly, the Order Wizard layout is unusable, and the KPI strip is unreadable.

## Goal

Every Field View screen must be fully usable on a phone (375px) and tablet (768px). Equipment Services View must not break on tablet. No horizontal scrolling except the fleet table (which already scrolls).

## Non-Goals

- Native app or PWA shell (future)
- Offline support (separate spec)
- Redesigning any component — layout shifts only
- Touch gestures (swipe, pull-to-refresh)

---

## Breakpoints

| Token | Width | Target Devices |
|---|---|---|
| `mobile` | ≤ 640px | Phones (iPhone SE through iPhone 15 Pro Max) |
| `tablet` | 641px – 1024px | iPads, ruggedized tablets (Panasonic Toughbook, Samsung Galaxy Tab Active) |
| `desktop` | > 1024px | Current layout — no changes needed |

### Implementation Approach

Since HAUL uses **inline styles** via the `S` token object (not Tailwind classes), CSS media queries alone won't work for most layouts. Add a `useBreakpoint()` hook that returns `"mobile" | "tablet" | "desktop"` and use it in components to conditionally switch style objects.

```tsx
// src/lib/useBreakpoint.ts
"use client";
import { useState, useEffect } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w <= 640 ? "mobile" : w <= 1024 ? "tablet" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return bp;
}
```

**Usage pattern in components:**
```tsx
const bp = useBreakpoint();
const isMobile = bp === "mobile";

// Then use in inline styles:
gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))"
```

---

## Component-by-Component Spec

### 1. App Header (`page.tsx`)

**Current state:**
- Flex row: logo + "HAUL" title + subtitle on the left, nav buttons on the right
- `maxWidth: 1200`, `padding: 0 24px`
- Nav tabs: flex row with text labels + icons

**Mobile (≤ 640px):**
- [ ] Hide subtitle text ("Heavy Asset Utilization & Logistics") — show only "HAUL" next to logo
- [ ] Nav tabs: keep both tabs visible but reduce horizontal padding from 16px to 10px, font to 12px
- [ ] Overall header padding: `0 16px`
- [ ] Logo height: reduce from 34px to 28px

**Tablet (641–1024px):**
- [ ] Keep full subtitle
- [ ] No changes needed — current layout works

**Acceptance criteria:**
- Header never causes horizontal scroll on any viewport width ≥ 320px
- Both nav tabs always visible and tappable (min 44px touch target height)
- Logo and "HAUL" text always visible

---

### 2. Field View — Filter Bar (`FieldView.tsx`)

**Current state:**
- Flex row with `gap: 12, flexWrap: wrap`: search input (`flex: 1, minWidth: 200`) + category dropdown (`minWidth: 140`) + status dropdown (`minWidth: 120`)
- Works okay on tablet but search shrinks too much on phone

**Mobile (≤ 640px):**
- [ ] Stack vertically: search input full width on first row, both dropdowns side-by-side on second row
- [ ] Layout: `flexDirection: "column"` for the outer container
- [ ] Dropdowns row: wrap in a `<div>` with `display: flex, gap: 8`, each dropdown `flex: 1`
- [ ] Search input: remove `minWidth: 200`, set `width: "100%"`

**Tablet:**
- [ ] Keep current horizontal layout — works as-is

**Acceptance criteria:**
- All three filter controls visible without scrolling on 375px viewport
- Dropdown touch targets ≥ 44px height
- Search input placeholder text not truncated on 320px width

---

### 3. Field View — Asset Catalog Grid (`FieldView.tsx`)

**Current state:**
- CSS Grid: `gridTemplateColumns: repeat(auto-fill, minmax(300px, 1fr))`
- Cards: full-width image (160px height) + status badge overlay + text content below
- Spacing: `gap: 14`, card content `padding: 14px 20px 20px`

**Mobile (≤ 640px):**
- [ ] Grid: `gridTemplateColumns: "1fr"` — single column, full width
- [ ] Image height: reduce from 160px to 140px
- [ ] Card content padding: reduce to `12px 16px 16px`
- [ ] Grid gap: reduce from 14px to 10px

**Tablet (641–1024px):**
- [ ] Grid: `gridTemplateColumns: repeat(auto-fill, minmax(260px, 1fr))` to fit 2-3 cards

**Desktop (> 1024px):**
- [ ] No change: current `minmax(300px, 1fr)` works

**Acceptance criteria:**
- Single column on phone, 2 columns on tablet, 2-3+ columns on desktop
- Cards fill available width without horizontal overflow
- Images maintain aspect ratio via `objectFit: cover`
- Card text (name, make/model, rate) never truncates — wraps to second line if needed

---

### 4. Asset Detail Page (`AssetDetail.tsx`)

**Current state:**
- Hero card: navy background, flex row with 120×90 thumbnail + name/status text
- Specs section: CSS Grid `gridTemplateColumns: "1fr 1fr"` (two-column spec layout)
- "Request This Equipment" button at bottom
- Back button top-left

**Mobile (≤ 640px):**
- [ ] Hero: stack vertically — image on top (`width: "100%"`, `height: 180`, `objectFit: cover`), name/status/location below
- [ ] Specs grid: change to `gridTemplateColumns: "1fr"` — single column
- [ ] "Request This Equipment" button: `width: "100%"`
- [ ] Back button: ensure it doesn't overlap hero content

**Tablet:**
- [ ] Keep two-column spec grid
- [ ] Hero: keep current horizontal layout (thumbnail + text)

**Acceptance criteria:**
- Hero image fills card width on phone (no tiny thumbnail)
- All spec rows readable without horizontal scroll
- "Request" CTA is easy to reach and tap (full-width on mobile, min 48px height)

---

### 5. Order Wizard (`OrderWizard.tsx`) — Most Complex

**Current state:**
- Header card: navy bg, flex row with 56×42 thumbnail + "Request: {name}" text
- Step indicators: horizontal row of 4 numbered circles connected by lines
- Step 1 (Job & Dates): job site dropdown + start/end date inputs in `gridTemplateColumns: "1fr 1fr"`
- Step 2 (Attachments): checkbox list in a card
- Step 3 (Services): fueling toggle + frequency dropdown
- Step 4 (Review): summary using `InfoRow` component (label + value side by side)
- Navigation: "Back" and "Next" / "Submit Request" buttons in a flex row

**Mobile (≤ 640px):**
- [ ] Header: stack vertically — image full width (120px height), title + step text below
- [ ] Step indicators: reduce circle size from 28px to 24px, font to 11px; hide step label text (show only numbers + short labels like "Job", "Attach", "Service", "Review")
- [ ] Step 1 date fields: `gridTemplateColumns: "1fr"` — stack vertically
- [ ] Step 1 job site dropdown: `width: "100%"`
- [ ] Step 4 review: `InfoRow` — stack label above value instead of side-by-side
- [ ] Nav buttons: full width, stacked vertically — primary action on top, "Back" below
- [ ] All form inputs: `minHeight: 44` for touch targets

**Tablet:**
- [ ] Keep `1fr 1fr` grid for date fields
- [ ] Step indicators: show full labels
- [ ] Nav buttons: keep side-by-side

**Acceptance criteria:**
- Every wizard step completable on a phone without horizontal scrolling
- All form inputs have ≥ 44px touch targets
- Step indicators show current step clearly on all viewports
- "Submit Request" button prominent and easy to tap
- User can navigate back to any previous step

---

### 6. Order Confirmation (`OrderConfirmation.tsx`)

**Current state:**
- Centered card: `maxWidth: 420`, `padding: 40`, `textAlign: center`
- Checkmark icon, title, REQ ID, CTA button

**Mobile (≤ 640px):**
- [ ] Reduce padding from 40px to 24px
- [ ] `maxWidth: "100%"` with side margins (card fills viewport)
- [ ] CTA button: `width: "100%"`

**Acceptance criteria:**
- Confirmation visible without scrolling on any phone
- REQ ID prominently readable
- CTA button tappable and full-width

---

### 7. My Requests (`MyRequests.tsx`)

**Current state:**
- List of request cards: flex row with 48×36 thumbnail + details + status badge
- Details: REQ ID, asset name, date range, job site

**Mobile (≤ 640px):**
- [ ] Keep horizontal layout (thumbnail + details) — already compact enough
- [ ] Reduce card padding from 20px to 16px
- [ ] Ensure status badge doesn't wrap onto its own line at ≤ 375px — if it does, move it below the date row

**Acceptance criteria:**
- All requests readable on phone
- Status badge always visible
- Each request card min height 44px (tappable if we add tap-to-expand later)

---

### 8. Equipment Services — KPI Strip (`EquipServicesView.tsx`)

**Current state:**
- CSS Grid: `gridTemplateColumns: "repeat(5, 1fr)"` — five stat cards in one row
- Each card: colored top accent, large number, uppercase label

**Mobile (≤ 640px):**
- [ ] Grid: `gridTemplateColumns: "repeat(2, 1fr)"` — 2 columns, 3 rows (last card spans full width via `gridColumn: "1 / -1"`)
- [ ] Card padding: reduce from 16px to 12px
- [ ] Number font: reduce from 24px to 20px

**Tablet (641–1024px):**
- [ ] Grid: `gridTemplateColumns: "repeat(3, 1fr)"` — 3 columns, 2 rows

**Desktop:**
- [ ] No change

**Acceptance criteria:**
- All 5 KPI cards visible without horizontal scrolling on any viewport
- Numbers and labels clearly readable on phone
- Accent borders still visible

---

### 9. Equipment Services — Tab Bar (`EquipServicesView.tsx`)

**Current state:**
- Horizontal flex row: 4 tab buttons ("Request Queue", "Active", "History", "Fleet Overview")

**Mobile (≤ 640px):**
- [ ] Reduce tab padding and font to 12px
- [ ] If tabs overflow: wrap in scrollable container (`overflowX: "auto"`, `whiteSpace: "nowrap"`, `-webkit-overflow-scrolling: "touch"`)
- [ ] Alternatively: use shorter labels ("Queue", "Active", "History", "Fleet")

**Acceptance criteria:**
- All tabs reachable on phone (scrollable if needed)
- Active tab clearly distinguishable
- Tab labels not truncated mid-word

---

### 10. Equipment Services — Request Card (`RequestCard.tsx`)

**Current state:**
- Flex row: 48×36 thumbnail + details
- Metadata grid: `gridTemplateColumns: "1fr 1fr 1fr"` — three columns (dates, job site, operator/cert)
- Action buttons: Accept + Decline in a flex row

**Mobile (≤ 640px):**
- [ ] Metadata grid: `gridTemplateColumns: "1fr 1fr"` — two columns
- [ ] Action buttons: full width, stacked vertically (Accept on top, Decline below)
- [ ] Card padding: reduce from 20px to 16px

**Tablet:**
- [ ] Keep three-column metadata grid
- [ ] Buttons: keep side-by-side

**Acceptance criteria:**
- Cert status indicators visible on all viewports
- Accept/Decline buttons: ≥ 44px height, ≥ 120px wide
- All metadata readable without truncation

---

### 11. Fleet Overview Table (`FleetOverview.tsx`)

**Current state:**
- `<table>` inside `<div style={{ overflowX: "auto" }}>` — already scrollable
- Columns: Asset (with thumbnail), Type, Location, Status

**Mobile (≤ 640px):**
- [ ] **No layout change needed** — horizontal scroll already works
- [ ] Reduce cell padding from `10px 16px` to `8px 12px`
- [ ] Reduce font sizes by 1px for tighter fit

**Acceptance criteria:**
- Table scrolls horizontally without breaking the page layout
- Asset name column always starts visible (leftmost)

---

### 12. Decline Modal (`EquipServicesView.tsx`)

**Current state:**
- Fixed overlay with centered card: `maxWidth: 440`, `padding: 24`
- Textarea for decline reason + Cancel / Decline buttons

**Mobile (≤ 640px):**
- [ ] Card: `maxWidth: "calc(100vw - 32px)"`, `margin: "16px"`
- [ ] Padding: reduce to 20px
- [ ] Buttons: full width, stacked vertically (Decline on top, Cancel below)
- [ ] Textarea: min height 80px, `width: "100%"`

**Acceptance criteria:**
- Modal fully visible on phone without scrolling behind it
- Textarea usable (not too small to type in)
- Both buttons tappable

---

## Global Changes

### `globals.css` — Responsive padding
```css
@media (max-width: 640px) {
  main {
    padding: 16px !important;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  main {
    padding: 20px !important;
  }
}
```

### Touch Target Rule

Per [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), all interactive elements must have a minimum touch target of **44 × 44 CSS pixels** on mobile viewports. This includes: buttons, nav tabs, dropdown selects, checkbox areas, and linked cards.

---

## Implementation Order

Work through the demo path first, then Equipment Services.

| Step | Component | Rationale |
|---|---|---|
| 1 | `src/lib/useBreakpoint.ts` | Foundation — every component depends on it |
| 2 | `page.tsx` (header + nav) | Visible on every screen, affects all views |
| 3 | `FieldView.tsx` (filters + grid) | Demo starts here — biggest visual impact |
| 4 | `AssetDetail.tsx` | Demo step 2 |
| 5 | `OrderWizard.tsx` | Demo step 3 — most complex, needs most testing |
| 6 | `OrderConfirmation.tsx` | Demo step 4 — simplest change |
| 7 | `MyRequests.tsx` | Demo endpoint |
| 8 | `EquipServicesView.tsx` (KPIs + tabs + modal) | Equipment Services view |
| 9 | `RequestCard.tsx` | Inside Equipment Services |
| 10 | `FleetOverview.tsx` | Already mostly works — padding only |

---

## Testing Checklist

Test the complete demo path on each viewport:

> Browse catalog → Filter to Excavators → Open CAT 320 detail → Request → Wizard (all 4 steps) → Confirmation → My Requests → Switch to Equipment Services → Accept → Switch back → Verify status

| Viewport | Device | Orientation |
|---|---|---|
| 375 × 812 | iPhone SE / 13 mini | Portrait |
| 390 × 844 | iPhone 14 / 15 | Portrait |
| 430 × 932 | iPhone 15 Pro Max | Portrait |
| 768 × 1024 | iPad (10th gen) | Portrait |
| 1024 × 768 | iPad (10th gen) | Landscape |
| 1280 × 800 | Panasonic Toughbook | Landscape |
| 1440 × 900 | Desktop | Regression |

Use **Chrome DevTools → Device Toolbar** (Ctrl+Shift+M) to simulate. Test both portrait and landscape on tablet viewports.

---

## Files Changed

| File | Change Type |
|---|---|
| `src/lib/useBreakpoint.ts` | **New file** — responsive hook |
| `src/app/globals.css` | Add media queries for main padding |
| `src/app/page.tsx` | Header: subtitle visibility, nav sizing, padding |
| `src/components/FieldView.tsx` | Filter stacking, grid columns, card sizing |
| `src/components/AssetDetail.tsx` | Hero stack, specs grid, button width |
| `src/components/OrderWizard.tsx` | Step indicators, form grids, nav buttons, header |
| `src/components/OrderConfirmation.tsx` | Padding, width |
| `src/components/MyRequests.tsx` | Padding, badge positioning |
| `src/components/EquipServicesView.tsx` | KPI grid, tab bar, decline modal |
| `src/components/RequestCard.tsx` | Metadata grid, button stacking |
| `src/components/FleetOverview.tsx` | Cell padding |
| `src/components/ui.tsx` | Possibly: `InfoRow` responsive variant, `Btn` min-height |

**No new dependencies.** No breaking changes to component props or data model.

---

*Spec created June 25, 2026 — companion to HAUL_MVP_Plan.md § 4.4 (P0: Mobile-Responsive Field View)*
