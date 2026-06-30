# SPEC-012 — Browse by Category Cards

**Priority:** P0 — Hackathon demo polish
**Status:** Not started
**Effort:** Low (~1 hour)
**Target:** June 30 hackathon

---

## Problem

The catalog uses a dropdown to filter by category. The pitch deck (Slide 6) shows a horizontal scrollable row of category image cards (Excavators, Lifts, Trucks, Compaction) that field users can tap — matching the Amazon-like browsing promise. A visual category browser is more intuitive and more impressive in a demo.

## Goal

Add a horizontal scrollable "Browse by Category" row of image cards above the catalog grid. Tapping a card filters the grid to that category. Coexists with the existing dropdown/search for power users.

## Non-Goals

- Replacing the dropdown entirely
- Dynamic category images from assets
- Subcategories or multi-level browsing

---

## Current State

**`FieldView.tsx`** — Categories come from `CATEGORIES` array (16 entries including "All"). Filter is a `<select>` dropdown. No visual category browsing.

**`data.ts`** — `CATEGORIES` array is string-only — no images, no icons.

**`public/images/equipment/`** — We already have photos for every category's first asset.

---

## Implementation

### 1. Add category images to `data.ts`

```tsx
export const CATEGORY_CARDS: { type: string; label: string; image: string }[] = [
  { type: "Excavator", label: "Excavators", image: "/images/equipment/cat-320-excavator.jpg" },
  { type: "Skid Steer", label: "Skid Steers", image: "/images/equipment/cat-259d-skidsteer.jpg" },
  { type: "Loader", label: "Loaders", image: "/images/equipment/cat-950m-loader.jpg" },
  { type: "Crane", label: "Cranes", image: "/images/equipment/liebherr-ltm1060-crane.jpg" },
  { type: "Dozer", label: "Dozers", image: "/images/equipment/cat-d6-dozer.jpg" },
  { type: "Boom Lift", label: "Boom Lifts", image: "/images/equipment/jlg-600s-boomlift.jpg" },
  { type: "Generator", label: "Generators", image: "/images/equipment/cat-xq200-generator.jpg" },
  { type: "Compactor", label: "Compaction", image: "/images/equipment/cat-cs56b-compactor.jpg" },
];
```

Keep to 8 most common categories — don't overwhelm the row. Remaining types are still accessible via the dropdown.

### 2. Render in `FieldView.tsx`

Below the greeting (SPEC-011), above the filter bar:

```tsx
<div style={{ marginBottom: 16 }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <SectionLabel>Browse by Category</SectionLabel>
    <button onClick={() => setCategory("All")} style={{ fontSize: 12, color: S.navy, border: "none", background: "none", cursor: "pointer" }}>
      View all
    </button>
  </div>
  <div style={{
    display: "flex", gap: 12, overflowX: "auto",
    paddingBottom: 8, WebkitOverflowScrolling: "touch",
  }}>
    {CATEGORY_CARDS.map(cat => (
      <button key={cat.type} onClick={() => setCategory(cat.type)}
        style={{
          flexShrink: 0, width: 110, border: category === cat.type ? `2px solid ${S.navy}` : `1px solid ${S.qdrGray}`,
          borderRadius: 10, overflow: "hidden", cursor: "pointer",
          backgroundColor: S.white, padding: 0,
        }}>
        <img src={cat.image} alt={cat.label} style={{ width: "100%", height: 70, objectFit: "cover" }} />
        <div style={{ padding: "6px 8px", fontSize: 11, fontWeight: 600, color: S.black90, textAlign: "center" }}>
          {cat.label}
        </div>
      </button>
    ))}
  </div>
</div>
```

### 3. Sync with dropdown

- [ ] Clicking a category card sets the same `category` state the dropdown uses
- [ ] Dropdown reflects the selected category card (and vice versa)
- [ ] Clicking a selected category card deselects it (reverts to "All")

### 4. Mobile behavior

- [ ] Horizontal scroll works naturally on touch devices
- [ ] Cards: 90px wide on mobile (≤ 640px), 110px on desktop
- [ ] Show 3-4 cards visible at once on phone, scroll for more

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `CATEGORY_CARDS` array |
| `src/components/FieldView.tsx` | Add category card row above filter bar |

## Acceptance Criteria

- [ ] Horizontal scrollable row of 8 category cards with equipment images
- [ ] Tapping a card filters the catalog grid to that category
- [ ] Selected card has navy border highlight
- [ ] Category dropdown stays in sync with card selection
- [ ] "View all" link resets to all categories
- [ ] Scrolls naturally on mobile/touch
- [ ] Matches pitch deck Slide 6 layout
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 6 (Field Experience)*
