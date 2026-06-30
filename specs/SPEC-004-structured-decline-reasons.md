# SPEC-004 — Structured Decline / Delay Reasons

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Very low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

The decline modal currently has only a free-text textarea. Equipment Services coordinators must type the reason from scratch each time. Free text is inconsistent, hard to analyze, and slower than selecting a code. It also misses the opportunity to capture structured data for future analytics.

## Goal

Add a reason code dropdown to the existing decline modal. Keep the free-text field for additional notes.

## Non-Goals

- Analytics dashboard on decline reasons (Phase 2)
- Auto-suggest resolution (e.g., auto-rescheduling)
- Decline reason visible to the field requester (future)

---

## Current State (code audit)

**`EquipServicesView.tsx`** — Decline modal:
```tsx
const [declineReqId, setDeclineReqId] = useState<string | null>(null);
const [declineReason, setDeclineReason] = useState("");
```
Modal renders a `<textarea>` for `declineReason` and calls:
```tsx
updateRequestStatus(declineReqId, "Declined", declineReason);
```

**`data.ts`** — `EquipmentRequest` interface has `declineReason?: string`. No `declineReasonCode` field exists.

**`RequestCard.tsx`** — Displays `req.declineReason` as inline text when present.

---

## Implementation

### 1. Add reason codes to `data.ts`

```tsx
export const DECLINE_REASONS = [
  { code: "maintenance", label: "Asset in Maintenance" },
  { code: "unavailable_date", label: "Unavailable for Requested Dates" },
  { code: "cert_issue", label: "Operator Certification Issue" },
  { code: "transport", label: "Transport Constraint" },
  { code: "better_substitute", label: "Better Substitute Available" },
  { code: "other", label: "Other" },
] as const;
```

Add `declineReasonCode?: string` to `EquipmentRequest` interface.

### 2. Update decline modal in `EquipServicesView.tsx`

- [ ] Add state: `const [declineCode, setDeclineCode] = useState("")`
- [ ] Render a `<select>` dropdown above the textarea with the reason codes
- [ ] Textarea label changes to "Additional notes (optional)" — placeholder: "Provide details..."
- [ ] "Decline" button disabled until a reason code is selected
- [ ] Pass both `declineCode` and `declineReason` to `updateRequestStatus`

**Mockup:**
```
  ┌─────────────────────────────────────┐
  │ Decline Request REQ-001             │
  │                                     │
  │ Reason *                            │
  │ ┌─────────────────────────────────┐ │
  │ │ ▼ Asset in Maintenance          │ │
  │ └─────────────────────────────────┘ │
  │                                     │
  │ Additional notes (optional)         │
  │ ┌─────────────────────────────────┐ │
  │ │ Asset not available until 7/5   │ │
  │ │ — recommend rescheduling to 7/7 │ │
  │ └─────────────────────────────────┘ │
  │                                     │
  │           [Cancel] [Decline]        │
  └─────────────────────────────────────┘
```

### 3. Update `page.tsx` — `updateRequestStatus`

- [ ] Accept `reasonCode?: string` as additional parameter
- [ ] Store in request object as `declineReasonCode`

### 4. Update `RequestCard.tsx` display

- [ ] Show the reason code label (bold) followed by the note text (regular)
- [ ] Example: "**Asset in Maintenance** — Asset not available until 7/5"

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `DECLINE_REASONS` array, add `declineReasonCode` to interface |
| `src/components/EquipServicesView.tsx` | Add dropdown to decline modal, add state, disable button |
| `src/app/page.tsx` | `updateRequestStatus` accepts `reasonCode` |
| `src/components/RequestCard.tsx` | Display reason code label + notes |

## Acceptance Criteria

- [ ] Decline modal shows a dropdown with 6 reason options
- [ ] "Decline" button disabled until a reason code is selected
- [ ] Free-text notes field still available below the dropdown
- [ ] Declined request shows structured reason in the History tab
- [ ] Demo: Decline REQ-004 → select "Asset in Maintenance" → add note "Until 7/5" → History shows both
- [ ] Build passes, no TypeScript errors

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
