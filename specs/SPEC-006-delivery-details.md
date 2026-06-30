# SPEC-006 — Delivery Details in Order Wizard

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Low (~1 hour)
**Target:** June 30 hackathon

---

## Problem

After a request is submitted, Equipment Services must call the field supervisor back to get delivery logistics: gate code, drop zone, site hours, unloading support. This is exactly the "follow-up phone call" HAUL is supposed to eliminate.

## Goal

Add optional delivery fields to the Order Wizard so all logistics are captured at request time.

## Current State (code audit)

**`OrderWizard.tsx`** — 4-step wizard: Job & Dates → Attachments → Services → Review. No delivery fields exist. The form state has no delivery-related properties.

**`data.ts`** — `EquipmentRequest` has no delivery fields. `JobSite` has `name`, `pm`, `code` — no address or access info.

---

## Implementation

### 1. Update `data.ts`

Add to `EquipmentRequest` interface:
```tsx
deliveryContact?: string;       // "John Smith, 480-555-1234"
deliveryNotes?: string;         // "Use Gate B on 7th Ave, ask for site super"
deliveryDropZone?: string;      // "NE corner near trailer 3"
siteHours?: string;             // "6:00 AM – 4:30 PM"
unloadingSupport?: boolean;     // true = "I need help unloading"
```

### 2. Update `OrderWizard.tsx`

**Option A (recommended):** Add delivery fields to Step 1 (Job & Dates) below the operator select, since they're all job-site-context fields.

**Option B:** Create a new Step 5 between Services and Review. This adds complexity to step navigation and changes `totalSteps` from 4 to 5.

**Go with Option A** — keep 4 steps, add a "Delivery Details (optional)" collapsible section at the bottom of Step 1.

- [ ] Add form state fields: `deliveryContact`, `deliveryNotes`, `deliveryDropZone`, `siteHours`, `unloadingSupport`
- [ ] Render below operator select with a `SectionLabel` "Delivery Details (optional)"
- [ ] Fields:
  - Delivery contact (text input): "Name and phone for delivery coordination"
  - Site hours (text input): placeholder "e.g., 6:00 AM – 4:30 PM"
  - Drop zone (text input): placeholder "e.g., NE corner near trailer 3"
  - Access / gate notes (textarea, 2 rows): placeholder "Gate codes, road restrictions, special instructions..."
  - Unloading support needed (checkbox)
- [ ] In Step 4 Review, show non-empty delivery fields via `InfoRow`
- [ ] Include all delivery fields in `handleSubmit` payload

### 3. Update `RequestCard.tsx`

- [ ] If any delivery fields are populated, show a "📦 Delivery details" expandable indicator
- [ ] On click/expand, show the delivery fields (or show inline below the cert indicator)

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add 5 delivery fields to `EquipmentRequest` |
| `src/components/OrderWizard.tsx` | Add delivery section to Step 1, include in Review + submit |
| `src/components/RequestCard.tsx` | Display delivery info when present |

## Acceptance Criteria

- [ ] Step 1 shows optional delivery fields below operator select
- [ ] All delivery fields are optional — wizard works without filling any
- [ ] Step 4 review shows only delivery fields that were filled
- [ ] Submitted request shows delivery details in Equipment Services queue card
- [ ] Demo path still works unchanged (delivery fields are skippable)
- [ ] Build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P1*
