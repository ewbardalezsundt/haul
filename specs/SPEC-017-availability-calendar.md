# SPEC-017 — Availability Calendar (30-Day Bar)

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Medium (~2 hours)
**Target:** June 30 hackathon

---

## Problem

The pitch deck roadmap (Slide 11) lists "Availability Calendar" as a Phase 1 (Current) feature. Our Asset Detail page currently shows only a text badge ("Available") and a ready date. A visual 30-day timeline would answer "when is this available?" at a glance and show scheduling conflicts.

## Goal

Add a simple 30-day availability bar to the Asset Detail page. No full calendar — just a horizontal timeline showing available (green), committed/deployed (navy), and maintenance (yellow) blocks.

## Non-Goals

- Full calendar view with day/week/month
- Drag-to-schedule
- Multi-asset availability comparison
- Integration with Outlook or external calendars

---

## Current State

**`data.ts`** — Assets have `status` and `readyDate`. Requests have `startDate` and `endDate`. No availability timeline data structure.

**`AssetDetail.tsx`** — Shows `readyDate` as text in the Availability info card. No visual timeline.

---

## Implementation

### 1. Build availability data from requests

```tsx
function getAvailabilityTimeline(assetId: string, requests: EquipmentRequest[]): TimelineBlock[] {
  const today = new Date();
  const blocks: TimelineBlock[] = [];

  // Find accepted/in-transit requests for this asset
  const commitments = requests.filter(r =>
    r.assetId === assetId &&
    ["Accepted", "In Transit", "Pending"].includes(r.status)
  );

  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().slice(0, 10);

    const committed = commitments.find(r => dateStr >= r.startDate && dateStr <= r.endDate);
    blocks.push({
      date: dateStr,
      status: committed ? (committed.status === "Pending" ? "pending" : "committed") : "available",
    });
  }

  return blocks;
}
```

### 2. Render 30-day bar in `AssetDetail.tsx`

Below the Availability info card, add a visual bar:

```tsx
<SectionLabel>30-Day Availability</SectionLabel>
<div style={{ display: "flex", gap: 1, borderRadius: 6, overflow: "hidden", height: 28 }}>
  {timeline.map((block, i) => (
    <div key={i} title={`${block.date}: ${block.status}`} style={{
      flex: 1,
      backgroundColor:
        block.status === "available" ? S.lightGreen :
        block.status === "committed" ? S.navy :
        block.status === "pending" ? S.yellow :
        S.qdrGray,
      cursor: "default",
    }} />
  ))}
</div>
<div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: S.darkGray }}>
  <span>Today</span>
  <span>+30 days</span>
</div>
<div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: S.black70 }}>
  <span>🟢 Available</span>
  <span style={{ color: S.navy }}>🔵 Committed</span>
  <span style={{ color: S.yellow }}>🟡 Pending</span>
</div>
```

### 3. Props change

- [ ] `AssetDetail` needs the `requests` array passed as a prop to build the timeline
- [ ] `FieldView.tsx` already has `requests` — pass it through to `AssetDetail`

### 4. Mock data note

For the demo, the seed requests create natural scheduling blocks. Ensure at least one asset (e.g., asset-1, CAT 320) has a seed request with date range that falls within the next 30 days so the timeline shows both available and committed blocks.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/AssetDetail.tsx` | Add timeline builder + 30-day bar rendering |
| `src/components/FieldView.tsx` | Pass `requests` prop to `AssetDetail` |

## Acceptance Criteria

- [ ] Asset Detail shows a 30-day horizontal availability bar
- [ ] Green blocks for available days, navy for committed, yellow for pending
- [ ] Hovering a block shows the date and status
- [ ] Legend shown below the bar
- [ ] Timeline calculated from actual mock request data — no hardcoded availability
- [ ] Assets with no requests show solid green (fully available)
- [ ] Matches pitch deck Slide 11 "Availability Calendar" commitment
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 11 (Future Roadmap, Phase 1)*
