# SPEC-021 — Quick Reorder

**Priority:** P1 — Demo depth
**Status:** Not started
**Effort:** Low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

Field supervisors frequently need the same equipment for recurring work — the same excavator at the same job site with the same attachments and fueling setup. Currently, every request starts from scratch in the catalog. A "Request Again" button on past requests would pre-fill the order wizard with all prior selections, reducing a 4-step process to a 1-step review-and-submit. This demonstrates that HAUL was designed for real repeat usage, not just a one-off demo.

## Goal

Add a "Request Again" button on each completed (Accepted, In Transit, or Declined) request card in `MyRequests.tsx`. Clicking it opens the `OrderWizard` pre-filled with the same asset, job site, attachments, fueling, operator preference, and delivery details — the user just picks new dates and submits.

## Non-Goals

- Reorder from Equipment Services View
- Batch reorder (multiple requests at once)
- Recurring/scheduled requests
- Smart date suggestions based on previous rental duration

---

## Current State

**`MyRequests.tsx`** — Renders request cards. Has an `onBack` callback but no way to navigate to the Order Wizard. Imports `ASSETS` and `JOB_SITES` for display.

**`FieldView.tsx`** — Internal state machine manages navigation: `catalog | detail | wizard | confirmation | requests`. The wizard is triggered by setting `orderAsset`. When `showRequests` is true, it renders `<MyRequests>`.

**`OrderWizard.tsx`** — Accepts `asset: Asset` as a prop. Form state is initialized with empty defaults in a `useState` call. There is no "initial values" prop.

**`EquipmentRequest` interface** — Contains all fields needed to reconstruct a wizard pre-fill: `assetId`, `jobSiteId`, `attachments[]`, `fueling`, `fuelFreq`, `operatorRequested`, `deliveryContact`, `deliveryNotes`, `deliveryDropZone`, `siteHours`, `unloadingSupport`.

---

## Implementation

### 1. Add `onReorder` callback to MyRequests

**`MyRequests.tsx`** — Add a new prop:

```tsx
interface MyRequestsProps {
  requests: EquipmentRequest[];
  assets: Asset[];  // Add — needed to resolve assetId → Asset
  onBack: () => void;
  onReorder: (req: EquipmentRequest) => void;  // Add
}
```

### 2. Render "Request Again" button on eligible cards

Inside each request card, after the delivery details section, for non-Pending requests:

```tsx
{req.status !== "Pending" && (
  <Btn
    variant="secondary"
    onClick={() => onReorder(req)}
    style={{ marginTop: 12, fontSize: 12 }}
  >
    🔄 Request Again
  </Btn>
)}
```

- **Pending** requests don't get the button (they're still active — no point reordering)
- **Accepted / In Transit / Declined** all qualify — "the same thing again" or "retry after decline"

### 3. Add `initialValues` prop to OrderWizard

**`OrderWizard.tsx`** — Add optional initial values:

```tsx
interface OrderWizardProps {
  asset: Asset;
  onCancel: () => void;
  onSubmit: (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => void;
  initialValues?: Partial<{
    jobSiteId: string;
    attachments: string[];
    fueling: boolean;
    fuelFreq: string;
    operatorRequested: boolean;
    deliveryContact: string;
    deliveryNotes: string;
    deliveryDropZone: string;
    siteHoursStart: string;
    siteHoursEnd: string;
    unloadingSupport: boolean;
  }>;
}
```

Merge into the existing `useState` initializer:

```tsx
const [form, setForm] = useState({
  jobSiteId: initialValues?.jobSiteId ?? "",
  startDate: "",        // Always empty — user picks new dates
  endDate: "",          // Always empty
  attachments: initialValues?.attachments ?? [],
  fueling: initialValues?.fueling ?? false,
  fuelFreq: initialValues?.fuelFreq ?? "Weekly",
  operatorId: "",
  operatorRequested: initialValues?.operatorRequested ?? false,
  deliveryAddress: "",
  deliveryContact: initialValues?.deliveryContact ?? "",
  deliveryNotes: initialValues?.deliveryNotes ?? "",
  deliveryDropZone: initialValues?.deliveryDropZone ?? "",
  siteHoursStart: initialValues?.siteHoursStart ?? "06:00",
  siteHoursEnd: initialValues?.siteHoursEnd ?? "16:30",
  unloadingSupport: initialValues?.unloadingSupport ?? false,
});
```

**Dates are intentionally left blank** — the user must pick new dates. Everything else carries over.

### 4. Wire up in FieldView

**`FieldView.tsx`** — Add state for reorder initial values and handle the callback:

```tsx
const [reorderValues, setReorderValues] = useState<Record<string, unknown> | null>(null);

const handleReorder = (req: EquipmentRequest) => {
  const asset = assets.find(a => a.id === req.assetId);
  if (!asset) return;

  // Parse siteHours "6:00 AM – 4:30 PM" back to start/end if stored
  setReorderValues({
    jobSiteId: req.jobSiteId,
    attachments: req.attachments,
    fueling: req.fueling,
    fuelFreq: req.fuelFreq,
    operatorRequested: req.operatorRequested ?? false,
    deliveryContact: req.deliveryContact ?? "",
    deliveryNotes: req.deliveryNotes ?? "",
    deliveryDropZone: req.deliveryDropZone ?? "",
    siteHoursStart: req.siteHours?.split(" – ")[0] ?? "06:00",  // Parse back if possible
    siteHoursEnd: req.siteHours?.split(" – ")[1] ?? "16:30",
    unloadingSupport: req.unloadingSupport ?? false,
  });

  setOrderAsset(asset);
  setShowRequests(false);
};
```

Pass `initialValues` when rendering the wizard:

```tsx
<OrderWizard
  asset={orderAsset}
  onCancel={() => { setOrderAsset(null); setReorderValues(null); }}
  onSubmit={(req) => { /* existing logic */ setReorderValues(null); }}
  initialValues={reorderValues ?? undefined}
/>
```

Pass the callback and assets to MyRequests:

```tsx
<MyRequests
  requests={requests}
  assets={assets}
  onBack={() => setShowRequests(false)}
  onReorder={handleReorder}
/>
```

### 5. Site hours parsing note

The `siteHours` field on `EquipmentRequest` stores a formatted string like `"6:00 AM – 4:30 PM"`. To pre-fill the time dropdowns, we need to parse back to 24h format. If parsing fails, fall back to defaults (`06:00` / `16:30`). Since this is demo data with known formats, a simple split-and-parse is sufficient.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/MyRequests.tsx` | Add `onReorder` prop + `assets` prop + "Request Again" button |
| `src/components/OrderWizard.tsx` | Add `initialValues` prop, merge into form state |
| `src/components/FieldView.tsx` | Add `reorderValues` state, `handleReorder`, pass props through |

## Acceptance Criteria

- [ ] "Request Again" button appears on Accepted, In Transit, and Declined requests in My Requests
- [ ] Button hidden on Pending requests
- [ ] Clicking opens OrderWizard with the same asset pre-selected
- [ ] Job site, attachments, fueling, operator preference, and delivery details pre-filled
- [ ] Start and end dates are empty (user must pick new dates)
- [ ] User can modify any pre-filled value before submitting
- [ ] Submitting creates a new request with a new REQ-XXX ID and "Pending" status
- [ ] Canceling returns to My Requests
- [ ] Build passes clean

---

*Spec created June 30, 2026 — proves repeat-usage UX depth*
