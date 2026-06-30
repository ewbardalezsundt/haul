# SPEC-022 — Favorites / My Equipment

**Priority:** P1 — Demo personalization
**Status:** Not started
**Effort:** Low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

Field supervisors work with a small set of go-to equipment — the same CAT 320 excavator, the same skid steer, the same generator. Every time they open HAUL, they start from a full 23-item catalog and have to search or filter to find their regulars. A favorites feature lets them star frequently used equipment and see it front-and-center, reducing the path from "open app" to "request equipment" to one click.

## Goal

Add a star/favorite toggle on each asset card in the catalog and on the Asset Detail page. Favorited assets appear in a "My Equipment" section at the top of the Field View catalog, above the category cards. Favorites persist in localStorage.

## Non-Goals

- Favorite attachments or operators
- Shared/team favorites
- Sorting catalog by favorites
- Favorites on the Equipment Services side

---

## Current State

**`FieldView.tsx`** — Renders the catalog grid. Each card is an inline `<div>` with asset photo, name, type, location, rate, and status badge. Cards have an `onClick` that navigates to asset detail.

**`AssetDetail.tsx`** — Shows full spec page for a single asset. Has a "Request Equipment" button. No favorite toggle.

**`storage.ts`** — Manages localStorage for requests and assets. Pattern: `load*()` / `save*()` function pairs with a `STORAGE_KEY` constant and try/catch. `resetStorage()` clears all keys.

---

## Implementation

### 1. Add favorites to storage.ts

```tsx
const FAVORITES_KEY = "haul_favorites";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Silent fail
  }
}
```

Add `FAVORITES_KEY` to `resetStorage()`:

```tsx
export function resetStorage(): void {
  // ... existing keys ...
  localStorage.removeItem(FAVORITES_KEY);
}
```

### 2. Add favorites state to page.tsx

```tsx
const [favorites, setFavorites] = useState<string[]>([]);

// Hydrate in existing useEffect
useEffect(() => {
  // ... existing hydration ...
  setFavorites(loadFavorites());
}, []);

// Persist on change
useEffect(() => { saveFavorites(favorites); }, [favorites]);

const toggleFavorite = (assetId: string) => {
  setFavorites(prev =>
    prev.includes(assetId)
      ? prev.filter(id => id !== assetId)
      : [...prev, assetId]
  );
};
```

Pass to FieldView:

```tsx
<FieldView
  assets={assets}
  requests={requests}
  addRequest={addRequest}
  favorites={favorites}
  toggleFavorite={toggleFavorite}
/>
```

### 3. Update FieldView props

```tsx
interface FieldViewProps {
  assets: Asset[];
  requests: EquipmentRequest[];
  addRequest: (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => string;
  favorites: string[];
  toggleFavorite: (assetId: string) => void;
}
```

### 4. Star button on catalog cards

Add a star icon in the top-right corner of each asset card. Clicking toggles the favorite without navigating to detail.

```tsx
<button
  onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
  style={{
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(255,255,255,0.85)",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    zIndex: 2,
  }}
  aria-label={favorites.includes(asset.id) ? "Remove from favorites" : "Add to favorites"}
>
  {favorites.includes(asset.id) ? "★" : "☆"}
</button>
```

- **Filled star (★)** in `S.yellow` color when favorited
- **Empty star (☆)** in `S.darkGray` when not
- **`e.stopPropagation()`** prevents the card click (navigate to detail) from firing
- **Positioned absolutely** — the card needs `position: relative`

### 5. Star button on Asset Detail page

Add the same toggle on the Asset Detail header, next to the asset name:

```tsx
<button
  onClick={() => toggleFavorite(asset.id)}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 22,
    color: favorites.includes(asset.id) ? S.yellow : S.darkGray,
    padding: 4,
    marginLeft: 8,
  }}
  aria-label={favorites.includes(asset.id) ? "Remove from favorites" : "Add to favorites"}
>
  {favorites.includes(asset.id) ? "★" : "☆"}
</button>
```

This means `AssetDetail` also needs `favorites` and `toggleFavorite` props.

### 6. "My Equipment" section on catalog home

Above the category cards (SPEC-012), when favorites exist and assets match:

```tsx
const favoriteAssets = useMemo(() => {
  return assets.filter(a => favorites.includes(a.id));
}, [assets, favorites]);

{favoriteAssets.length > 0 && (
  <div style={{ marginBottom: 16 }}>
    <SectionLabel>My Equipment</SectionLabel>
    <div style={{
      display: "flex",
      gap: 10,
      overflowX: "auto",
      paddingBottom: 8,
      WebkitOverflowScrolling: "touch",
    }}>
      {favoriteAssets.map(asset => (
        <div
          key={asset.id}
          onClick={() => setSelectedAsset(asset)}
          style={{
            ...cardStyle,
            padding: 0,
            minWidth: isMobile ? 140 : 160,
            maxWidth: isMobile ? 140 : 160,
            cursor: "pointer",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={asset.photo}
            alt={asset.name}
            style={{ width: "100%", height: 80, objectFit: "cover" }}
          />
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.black90, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {asset.name}
            </div>
            <div style={{ fontSize: 10, color: S.darkGray, marginTop: 2 }}>
              {asset.location.startsWith("yard") ? YARDS.find(y => y.id === asset.location)?.name : asset.location}
            </div>
            <StatusBadge status={asset.status} />
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

- **Horizontal scrollable row** of compact cards — same pattern as category cards (SPEC-012)
- **Clicking navigates to Asset Detail** (same as catalog cards)
- **Hidden when no favorites** — clean default state
- **Includes status badge** — user sees at a glance if their go-to machine is available

### 7. Seed favorites for demo

To avoid a cold-start empty state during the demo, pre-seed 2-3 favorites in `loadFavorites()`:

```tsx
const DEFAULT_FAVORITES = ["asset-1", "asset-4", "asset-11"]; // CAT 320, CAT 259D, CAT XQ200

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return DEFAULT_FAVORITES;
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_FAVORITES;
  } catch {
    return DEFAULT_FAVORITES;
  }
}
```

This ensures the "My Equipment" section is populated from the start of the demo. The user (or demo operator) can add/remove favorites live.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/storage.ts` | Add `loadFavorites` / `saveFavorites` + update `resetStorage` |
| `src/app/page.tsx` | Add `favorites` state, hydration, persistence, `toggleFavorite` callback |
| `src/components/FieldView.tsx` | Add `favorites` + `toggleFavorite` props, "My Equipment" section, star on catalog cards |
| `src/components/AssetDetail.tsx` | Add `favorites` + `toggleFavorite` props, star button on header |

## Acceptance Criteria

- [ ] Star icon (☆/★) on every catalog card and on Asset Detail header
- [ ] Clicking star toggles favorite state (filled yellow ★ / empty gray ☆)
- [ ] Star click on catalog card does NOT navigate to detail (stopPropagation)
- [ ] "My Equipment" section appears above category cards when favorites exist
- [ ] "My Equipment" is a horizontal scrollable row of compact cards with photo, name, location, status
- [ ] Clicking a "My Equipment" card navigates to Asset Detail
- [ ] Section hidden when no favorites
- [ ] Favorites persist in localStorage across page refreshes
- [ ] Pre-seeded with 3 defaults (CAT 320, CAT 259D, CAT XQ200) for demo cold start
- [ ] `window.__resetHaul()` clears favorites back to defaults
- [ ] Build passes clean

---

*Spec created June 30, 2026 — personalization that mirrors real field behavior*
