# SPEC-023 — ES Fulfillment Actions (In Transit → Delivered)

**Priority:** P0 — Completes the core ES workflow loop
**Status:** Not started
**Effort:** Low–Medium (~45 minutes)
**Target:** June 30 hackathon

---

## Problem

After an Equipment Services coordinator accepts a request, it appears in the Active tab with no action buttons. The coordinator cannot mark the equipment as dispatched ("In Transit") or confirm it arrived on site ("Delivered"). The fulfillment half of the workflow is a dead end — the status is stuck at "Accepted" forever.

Additionally, the data model has no `"Delivered"` status, so even if a button existed, the request can never reach the final state shown in the field-side timeline (SPEC-020).

This gap means the demo cannot show the full lifecycle: **Request → Approve → Dispatch → Deliver**.

## Goal

Give ES coordinators two fulfillment actions on the Active tab so they can advance accepted requests through the dispatch pipeline:

```
Accepted  →  [Mark In Transit]  →  In Transit  →  [Mark Delivered]  →  Delivered
```

Once delivered, the request moves from the Active tab to the History tab, completing the lifecycle.

## Non-Goals

- Scheduling a delivery time or date picker (production feature)
- Driver/hauler assignment (production feature)
- Delivery confirmation from the field side (production feature)
- Undo/rollback of status transitions
- Animated status transitions

---

## Current State

**`EquipmentRequest.status`** in `src/lib/data.ts`:
```ts
status: "Pending" | "Accepted" | "Declined" | "In Transit";
```
No `"Delivered"` value exists.

**`statusBadgeColors`** in `src/lib/theme.ts` — Has entries for Pending, Accepted, Declined, In Transit. No "Delivered" entry.

**`RequestCard.tsx`** — Shows Accept/Decline buttons only when `req.status === "Pending"`. For Accepted/In Transit requests, the card is purely informational — no action buttons rendered.

**`EquipServicesView.tsx`** — Active tab renders `<RequestCard key={req.id} req={req} />` with no action callbacks. The `active` filter includes `["Accepted", "In Transit"]`. The `closed` filter is only `"Declined"`.

**`page.tsx` → `updateRequestStatus`** — Already handles "In Transit" status with a notification (`🚛 {reqId} — {assetName} is in transit`). No "Delivered" notification.

---

## Implementation

### 1. Add "Delivered" to the data model

**`src/lib/data.ts`** — Expand the status union:

```ts
status: "Pending" | "Accepted" | "Declined" | "In Transit" | "Delivered";
```

### 2. Add "Delivered" badge color

**`src/lib/theme.ts`** — Add to `statusBadgeColors`:

```ts
Delivered: { color: S.darkGreen, bg: "#E8F5E9" },
```

This uses the same green as "Accepted" — both are positive outcomes.

### 3. Add fulfillment callbacks to RequestCard

**`src/components/RequestCard.tsx`** — Extend the props interface:

```ts
interface RequestCardProps {
  req: EquipmentRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onMarkInTransit?: () => void;   // NEW
  onMarkDelivered?: () => void;   // NEW
}
```

Add a new button block below the existing Accept/Decline block:

```tsx
{/* Fulfillment actions — ES Active tab */}
{req.status === "Accepted" && onMarkInTransit && (
  <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 6, flexShrink: 0, ...(isMobile ? { width: "100%", marginTop: 12 } : {}) }}>
    <Btn
      variant="primary"
      onClick={onMarkInTransit}
      style={{ padding: "8px 16px", fontSize: 12, ...(isMobile ? { flex: 1 } : {}) }}
    >
      🚛 Mark In Transit
    </Btn>
  </div>
)}

{req.status === "In Transit" && onMarkDelivered && (
  <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 6, flexShrink: 0, ...(isMobile ? { width: "100%", marginTop: 12 } : {}) }}>
    <Btn
      variant="submit"
      onClick={onMarkDelivered}
      style={{ padding: "8px 16px", fontSize: 12, ...(isMobile ? { flex: 1 } : {}) }}
    >
      ✅ Mark Delivered
    </Btn>
  </div>
)}
```

**Button styling rationale:**
- "Mark In Transit" → `variant="primary"` (navy) — it's a standard progression action
- "Mark Delivered" → `variant="submit"` (green) — it's a terminal/success action, like submit

### 4. Wire callbacks in EquipServicesView Active tab

**`src/components/EquipServicesView.tsx`** — Update the Active tab rendering (~line 716):

```tsx
{active.map((req) => (
  <RequestCard
    key={req.id}
    req={req}
    onMarkInTransit={() => updateRequestStatus(req.id, "In Transit")}
    onMarkDelivered={() => updateRequestStatus(req.id, "Delivered")}
  />
))}
```

### 5. Update filters for Delivered status

**`src/components/EquipServicesView.tsx`**:

- **Active filter** stays as-is: `["Accepted", "In Transit"]` — Delivered requests should NOT appear here.
- **History filter** changes to include Delivered:

```ts
// Before:
const closed = requests.filter((r) => r.status === "Declined");
// After:
const closed = requests.filter((r) => ["Declined", "Delivered"].includes(r.status));
```

- **History tab label** update to reflect that it's no longer just declined:

```ts
// Before:
{ key: "history", label: `History (${closed.length})` }
// After — same key/label, just includes more items now
```

### 6. Add "Delivered" notification in page.tsx

**`src/app/page.tsx`** — Add to the `updateRequestStatus` function:

```ts
else if (status === "Delivered") msg = `📦 ${reqId} — ${assetName} delivered to site`;
```

### 7. KPI impact (optional, low-effort)

The "Fulfilled" KPI in `EquipServicesView.tsx` currently counts `["Accepted", "In Transit"]`. Consider whether "Delivered" should also count as fulfilled (it should — it's the terminal success state):

```ts
// Before:
const fulfilled = requests.filter((r) => ["Accepted", "In Transit"].includes(r.status)).length;
// After:
const fulfilled = requests.filter((r) => ["Accepted", "In Transit", "Delivered"].includes(r.status)).length;
```

Same for `fulfilledReqs` used in the cost savings calculation.

---

## Status Flow Summary

```
             ┌─────────────────────────────────────────────────┐
             │             Equipment Services View             │
             └─────────────────────────────────────────────────┘

  Queue Tab                    Active Tab                History Tab
  ─────────                    ──────────                ───────────
  ┌─────────┐   [Accept]   ┌──────────┐  [In Transit] ┌───────────┐
  │ Pending │ ──────────►  │ Accepted │ ─────────────► │In Transit │
  └─────────┘              └──────────┘                └───────────┘
       │                                                     │
       │ [Decline]                              [Delivered]  │
       ▼                                                     ▼
  ┌──────────┐                                     ┌───────────┐
  │ Declined │  ◄─── History tab ──────────────►   │ Delivered │
  └──────────┘                                     └───────────┘
```

## Interaction with SPEC-020 (Request Timeline)

SPEC-020 adds a 5-step timeline to the field-side `MyRequests.tsx`. Its `getStepIndex` currently treats "Delivered" as a future/gray step because the status didn't exist. Once this spec adds `"Delivered"` to the model, SPEC-020's `getStepIndex` needs one additional case:

```ts
case "Delivered": return 4; // Delivered (final step, all green)
```

If SPEC-020 is implemented first, this is a one-line addition. If SPEC-023 is implemented first, SPEC-020 picks it up naturally when it implements the timeline.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `"Delivered"` to `EquipmentRequest.status` union type |
| `src/lib/theme.ts` | Add `Delivered` entry to `statusBadgeColors` |
| `src/components/RequestCard.tsx` | Add `onMarkInTransit` / `onMarkDelivered` props + button blocks |
| `src/components/EquipServicesView.tsx` | Pass fulfillment callbacks in Active tab; update `closed` filter to include "Delivered"; update fulfilled KPI filter |
| `src/app/page.tsx` | Add "Delivered" notification in `updateRequestStatus` |

## Acceptance Criteria

- [ ] `EquipmentRequest.status` type includes `"Delivered"`
- [ ] "Accepted" requests on the Active tab show a "🚛 Mark In Transit" button (navy)
- [ ] "In Transit" requests on the Active tab show a "✅ Mark Delivered" button (green)
- [ ] Clicking "Mark In Transit" transitions the request from Accepted → In Transit
- [ ] Clicking "Mark Delivered" transitions the request from In Transit → Delivered
- [ ] Delivered requests disappear from the Active tab
- [ ] Delivered requests appear in the History tab alongside declined requests
- [ ] Each transition fires a toast notification
- [ ] StatusBadge renders correctly for "Delivered" status (green badge)
- [ ] Fulfillment buttons have 44px minimum touch targets on mobile (SPEC-001 compliance)
- [ ] Buttons are full-width row on mobile, stacked column on desktop (matches existing Accept/Decline pattern)
- [ ] Build passes clean
- [ ] No regressions in Queue tab (Accept/Decline still work)
- [ ] KPI "Fulfilled" count includes Delivered requests

---

*Spec created June 30, 2026 — closes the ES fulfillment loop for demo day*
