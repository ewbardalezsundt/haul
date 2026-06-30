# SPEC-007 — Dispatch-Oriented Queue Grouping

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Low (~45 minutes)
**Target:** June 30 hackathon

---

## Problem

The Equipment Services request queue is a flat list sorted by submission time. With 7+ seed requests (and more added during the demo), there's no at-a-glance sense of urgency. Coordinators can't see what needs action today vs. next week.

## Goal

Group pending requests by time horizon: "Today", "This Week", "Future". Sort within each group by requested start date (earliest first).

## Current State (code audit)

**`EquipServicesView.tsx`** — Request Queue tab:
```tsx
{pending.map((req) => (
  <RequestCard key={req.id} req={req} onAccept={...} onDecline={...} />
))}
```
`pending` is `requests.filter(r => r.status === "Pending")` — no sorting, no grouping.

**`data.ts`** — Seed requests have `startDate` (e.g., "2025-07-02") and `submittedAt` (ISO datetime).

---

## Implementation

### 1. Group logic (inline in `EquipServicesView.tsx`)

```tsx
function groupByTimeHorizon(requests: EquipmentRequest[]) {
  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const sorted = [...requests].sort(
    (a, b) => a.startDate.localeCompare(b.startDate)
  );

  return {
    today: sorted.filter(r => r.startDate <= today),
    thisWeek: sorted.filter(r => r.startDate > today && r.startDate <= weekEnd),
    future: sorted.filter(r => r.startDate > weekEnd),
  };
}
```

### 2. Render grouped queue

- [ ] Replace flat `pending.map(...)` with grouped rendering
- [ ] Each group gets a section header:

```tsx
const groups = groupByTimeHorizon(pending);

{groups.today.length > 0 && (
  <>
    <GroupHeader label="Today" count={groups.today.length} color={S.red} />
    {groups.today.map(req => <RequestCard ... />)}
  </>
)}
{groups.thisWeek.length > 0 && (
  <>
    <GroupHeader label="This Week" count={groups.thisWeek.length} color={S.yellow} />
    {groups.thisWeek.map(req => <RequestCard ... />)}
  </>
)}
{groups.future.length > 0 && (
  <>
    <GroupHeader label="Future" count={groups.future.length} color={S.navy} />
    {groups.future.map(req => <RequestCard ... />)}
  </>
)}
```

- [ ] `GroupHeader` component: colored left border, label text, count badge
- [ ] Empty groups are hidden (no empty "Today" section if nothing's due today)

**Note for demo:** Since seed data uses dates around "2025-07-01", adjust the grouping reference date or use the seed data dates. For a live demo, hardcode the reference date to match the seed data window so all three groups have content.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/EquipServicesView.tsx` | Add grouping logic, render grouped queue, add GroupHeader |

## Acceptance Criteria

- [ ] Pending requests grouped into "Today", "This Week", "Future"
- [ ] Within each group, requests sorted by start date (earliest first)
- [ ] Empty groups are hidden
- [ ] Group headers show count badge
- [ ] Active and History tabs remain ungrouped (flat list)
- [ ] Demo: At least 2 groups visible with seed data
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
