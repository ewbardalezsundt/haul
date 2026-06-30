# SPEC-005 — Request Operator Service Option

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Very low (~20 minutes)
**Target:** June 30 hackathon

---

## Problem

The Order Wizard lets the requester select a specific operator (Step 1) and validates their certification, but doesn't let them say "I need Sundt to provide an operator." For cranes, excavators, and specialty assets, operator-provided service is common and often required. Currently this request goes through a phone call.

## Goal

Add a "Sundt-provided operator requested" toggle to the Services step (Step 3) of the Order Wizard, alongside the existing fueling configuration.

## Current State (code audit)

**`OrderWizard.tsx`** — Step 3 (Services) renders a fueling checkbox with conditional frequency dropdown. No operator service option exists. The form state has `operatorId` for selecting a specific operator, but no `operatorRequested` boolean.

**`data.ts`** — `EquipmentRequest` interface has `operatorId: string | null`. No `operatorRequested` field.

**`RequestCard.tsx`** — Displays fueling badge (`⛽ {freq}`) but no operator service indicator.

---

## Implementation

### 1. Update `data.ts`

- [ ] Add `operatorRequested?: boolean` to `EquipmentRequest` interface

### 2. Update `OrderWizard.tsx`

- [ ] Add `operatorRequested: false` to initial form state
- [ ] In Step 3, after the fueling checkbox, add:

```tsx
<label style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, border: "1px solid ...", borderRadius: 8, cursor: "pointer" }}>
  <input type="checkbox" checked={form.operatorRequested}
    onChange={(e) => setForm({ ...form, operatorRequested: e.target.checked })} />
  <span>👷</span>
  <div>
    <span style={{ fontSize: 13, fontWeight: 500 }}>Request Sundt-provided operator</span>
    <p style={{ fontSize: 11, color: S.black70, margin: "2px 0 0" }}>
      Equipment Services will assign a certified operator
    </p>
  </div>
</label>
```

- [ ] In Step 4 (Review), add `InfoRow` for operator service:
  ```tsx
  <InfoRow label="Operator Service" value={form.operatorRequested ? "Yes — Sundt-provided" : "Self-operated"} />
  ```
- [ ] Include `operatorRequested` in the `handleSubmit` payload

### 3. Update `RequestCard.tsx`

- [ ] Display operator service badge next to fueling badge when `req.operatorRequested`:
  ```tsx
  {req.operatorRequested && (
    <span style={{ ...badgeStyle, backgroundColor: "#E8F5E9", color: S.darkGreen }}>
      👷 Operator Requested
    </span>
  )}
  ```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `operatorRequested` to `EquipmentRequest` interface |
| `src/components/OrderWizard.tsx` | Add toggle in Step 3, summary in Step 4, include in submit |
| `src/components/RequestCard.tsx` | Display operator service badge |
| `src/app/page.tsx` | No change — `addRequest` already spreads the full request object |

## Acceptance Criteria

- [ ] Step 3 shows fueling AND operator service toggles
- [ ] Step 4 review shows "Operator Service: Yes — Sundt-provided" when checked
- [ ] Submitted request shows 👷 badge in Equipment Services queue
- [ ] Toggle is independent from the operator *selection* dropdown in Step 1
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
