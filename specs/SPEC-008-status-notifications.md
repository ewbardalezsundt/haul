# SPEC-008 — Status Change Notifications

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Low (~45 minutes)
**Target:** June 30 hackathon (toast on view-switch); production: push notifications

---

## Problem

After a field supervisor submits a request, the only way to know it was accepted is to manually navigate to "My Requests" and check. This is the same communication gap that currently requires Equipment Services to call back.

## Goal

Display a toast notification when the user switches from Equipment Services back to Field View and a request status has changed while they were away.

## Non-Goals (hackathon)

- Browser push notifications (production)
- Real-time WebSocket updates
- Email notifications
- Notification center / history

---

## Current State (code audit)

**`page.tsx`** — View switching:
```tsx
const [view, setView] = useState<"field" | "equip">("field");
```
NavBtn click calls `setView("field")` or `setView("equip")`. No tracking of what changed between views. No notification system.

**No toast/notification component exists.**

---

## Implementation

### 1. Track status changes

- [ ] In `page.tsx`, add a ref to track request states before switching views:
```tsx
const prevRequestsRef = useRef<EquipmentRequest[]>(requests);
const [notifications, setNotifications] = useState<string[]>([]);
```
- [ ] When switching from "equip" to "field", compare current `requests` to `prevRequestsRef.current`
- [ ] For each request whose status changed, generate a notification message:
  - "Accepted" → "✅ REQ-001 accepted — CAT 320 arriving July 3"
  - "Declined" → "REQ-004 declined — Asset in Maintenance"
  - "In Transit" → "🚛 REQ-007 — CAT 950 is in transit"
- [ ] Update `prevRequestsRef.current = requests` after generating notifications

### 2. Toast component

- [ ] Create a simple `Toast` component or render inline in `page.tsx`
- [ ] Position: fixed, bottom-right (desktop) or bottom-center (mobile)
- [ ] Auto-dismiss after 5 seconds
- [ ] Stack multiple toasts vertically
- [ ] Styling: white card, navy left border, shadow, close button

```tsx
{notifications.map((msg, i) => (
  <div key={i} style={{
    position: "fixed", bottom: 16 + (i * 64), right: 16,
    backgroundColor: S.white, borderLeft: `4px solid ${S.navy}`,
    borderRadius: 8, padding: "12px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    zIndex: 200, maxWidth: 360, fontSize: 13,
  }}>
    {msg}
  </div>
))}
```

- [ ] `useEffect` with timer to clear notifications after 5 seconds

### 3. Wire into view switching

- [ ] In the NavBtn click handler for "Field View":
```tsx
onClick={() => {
  // Check for changes before switching
  const changes = findStatusChanges(prevRequestsRef.current, requests);
  if (changes.length > 0) setNotifications(changes);
  prevRequestsRef.current = [...requests];
  setView("field");
}}
```

---

## Files Changed

| File | Change |
|---|---|
| `src/app/page.tsx` | Add prevRequestsRef, notification state, change detection, toast rendering, timer cleanup |

## Acceptance Criteria

- [ ] Switch to Equipment Services → Accept REQ-001 → Switch back to Field View → Toast appears: "REQ-001 accepted"
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Multiple status changes show multiple stacked toasts
- [ ] No toast appears if nothing changed between view switches
- [ ] Toast doesn't block interaction (positioned out of the way)
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
