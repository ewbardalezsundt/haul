# SPEC-013 — Active Requests on Home Screen

**Priority:** P0 — Hackathon demo polish
**Status:** Not started
**Effort:** Low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

The pitch deck (Slide 6) shows "My Active Requests" displayed directly on the Field View home screen — the user sees their latest request status without navigating to a separate tab. Currently, a field supervisor must click "My Requests" (a nav action inside FieldView) to check status. For the demo, this adds an unnecessary click and makes the app feel disconnected.

## Goal

Show a compact "Your Active Requests" section on the Field View home screen (below the greeting, above or below the catalog). Display the 1-2 most recent non-closed requests with status badges.

## Non-Goals

- Full request history on the home screen
- Expand/collapse detail
- Inline request actions (accept, decline)

---

## Current State

**`FieldView.tsx`** — Internal state machine: `catalog | detail | wizard | confirmation | requests`. The "My Requests" view is the `requests` state, rendered by `<MyRequests>`. No request summary on the `catalog` state.

**`FieldView.tsx` props** — Receives `requests` and `addRequest` from `page.tsx`. Request data is available.

---

## Implementation

### 1. Filter active requests

```tsx
const activeRequests = requests
  .filter(r => ["Pending", "Accepted", "In Transit"].includes(r.status))
  .slice(0, 2); // Show max 2
```

### 2. Render compact section on catalog view

Below the category cards (SPEC-012), above the filter bar, when `view === "catalog"` and `activeRequests.length > 0`:

```tsx
{activeRequests.length > 0 && (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <SectionLabel>Your Active Requests</SectionLabel>
      <button onClick={() => setView("requests")} style={{ fontSize: 12, color: S.navy, border: "none", background: "none", cursor: "pointer" }}>
        View all
      </button>
    </div>
    {activeRequests.map(req => {
      const asset = ASSETS.find(a => a.id === req.assetId);
      return (
        <div key={req.id} style={{
          ...cardStyle, padding: "12px 16px", marginBottom: 6,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <img src={asset?.photo} alt="" style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.black90 }}>{asset?.name}</div>
            <div style={{ fontSize: 11, color: S.black70 }}>
              {req.id} · {req.startDate}
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>
      );
    })}
  </div>
)}
```

### 3. "View all" navigation

- [ ] "View all" button switches FieldView internal state to `"requests"` (same as the existing My Requests nav)
- [ ] If no active requests, the section is hidden entirely (no "0 active requests" message)

---

## Files Changed

| File | Change |
|---|---|
| `src/components/FieldView.tsx` | Add active requests section on catalog view |

## Acceptance Criteria

- [ ] Catalog view shows up to 2 active requests with thumbnail, name, ID, date, and status badge
- [ ] "View all" navigates to the full My Requests list
- [ ] Section hidden when no active requests exist
- [ ] After submitting a new request and returning to catalog, the request appears here
- [ ] Matches pitch deck Slide 6 "My Active Requests" layout
- [ ] Uses mock data only — no user filtering (shows all requests since auth is skipped per hackathon rules)
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 6 (Field Experience)*
