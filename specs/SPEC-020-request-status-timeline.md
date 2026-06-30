# SPEC-020 — Request Status Timeline

**Priority:** P0 — Hackathon demo polish
**Status:** Not started
**Effort:** Low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

When a field supervisor checks their request status in My Requests, they see a flat status badge ("Pending", "Accepted", "In Transit"). This tells them *where* the request is but not *how far along* it is in the overall workflow. An Amazon/UPS-style progress tracker communicates the full lifecycle at a glance and makes the app feel production-grade.

## Goal

Add a horizontal step-progress indicator to each request card in `MyRequests.tsx` showing the request's position in the fulfillment pipeline:

```
Submitted → Under Review → Approved → In Transit → Delivered
```

Each step is a small circle connected by a line. Completed steps are filled (green), the current step is highlighted (navy), and future steps are gray. The visual maps directly to the pitch deck's 7-step workflow (condensed to the 5 post-submission states the field user cares about).

## Non-Goals

- Clickable steps or step detail modals
- Timestamps on each step (nice-to-have for production)
- Declined requests showing a timeline (they get a separate "Declined" treatment)
- Animated transitions between steps

---

## Current State

**`MyRequests.tsx`** — Renders a list of request cards with status badge, asset thumbnail, job site, dates, decline reason, and delivery details. Each card uses `cardStyle` from `ui.tsx`.

**`EquipmentRequest.status`** — One of: `"Pending" | "Accepted" | "Declined" | "In Transit"`. There is no "Delivered" status in the current model (that's post-hackathon), but the timeline can show it as a future step to illustrate the full vision.

**`StatusBadge`** from `ui.tsx` — Existing badge component; the timeline supplements it, doesn't replace it.

---

## Implementation

### 1. Step definitions

```tsx
const TIMELINE_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "Pending": return 1;    // Under Review
    case "Accepted": return 2;   // Approved
    case "In Transit": return 3; // In Transit
    default: return 0;           // Submitted (fallback)
  }
}
```

### 2. Timeline component

Create a `RequestTimeline` component inline in `MyRequests.tsx` (or as a small named function). Not worth a separate file.

```tsx
function RequestTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);
  const isMob = useBreakpoint() === "mobile";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "14px 0 4px", width: "100%" }}>
      {TIMELINE_STEPS.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isFuture = i > currentIdx;

        const circleColor = isCompleted ? S.submitGreen
          : isCurrent ? S.navy
          : S.black20;
        const lineColor = isCompleted ? S.submitGreen : S.black20;
        const labelColor = isCompleted ? S.darkGreen
          : isCurrent ? S.navy
          : S.darkGray;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < TIMELINE_STEPS.length - 1 ? 1 : "none" }}>
            {/* Step circle + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: isMob ? 36 : 56 }}>
              <div style={{
                width: isCurrent ? 14 : 10,
                height: isCurrent ? 14 : 10,
                borderRadius: "50%",
                backgroundColor: circleColor,
                border: isCurrent ? `2px solid ${S.navy}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isCompleted && (
                  <span style={{ color: S.white, fontSize: 7, fontWeight: 700 }}>✓</span>
                )}
              </div>
              <span style={{
                fontSize: isMob ? 8 : 9,
                color: labelColor,
                fontWeight: isCurrent ? 700 : 400,
                marginTop: 4,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                {step.label}
              </span>
            </div>
            {/* Connecting line */}
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                backgroundColor: lineColor,
                marginTop: -14, /* Align with circles, not labels */
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### 3. Integration into MyRequests

Add the timeline inside each request card, below the header row and above the decline reason / delivery details. **Skip for Declined requests** — they get their existing decline reason display instead.

```tsx
{req.status !== "Declined" && (
  <RequestTimeline status={req.status} />
)}
```

### 4. Design details

- **Completed steps:** Green circles (`S.submitGreen`) with white checkmark, green connecting line
- **Current step:** Navy circle (`S.navy`), slightly larger (14px vs 10px), bold label
- **Future steps:** Gray circles (`S.black20`), gray connecting line, muted label
- **Declined:** Timeline hidden; existing decline reason display is sufficient
- **Mobile:** Narrower min-width per step (36px vs 56px), smaller font (8px vs 9px)
- **"Delivered" step:** Always shown as a future step (gray) since the mock data doesn't include delivered status. This illustrates the full vision without requiring data model changes.

### 5. Visual alignment with pitch deck

The 5 timeline steps map to the pitch deck's 7-step workflow:

| Pitch Deck Step | Timeline Step | Notes |
|---|---|---|
| 1–4 (Browse, Configure, Project, Fuel) | — | Pre-submission; not shown |
| 5 (Review & Submit) | Submitted | Starting state |
| — | Under Review | Maps to "Pending" status |
| 6 (ES Approval) | Approved | Maps to "Accepted" status |
| 7 (Dispatch & Delivery) | In Transit / Delivered | Two steps to show progress |

---

## Files Changed

| File | Change |
|---|---|
| `src/components/MyRequests.tsx` | Add `RequestTimeline` component + integrate into request cards |

## Acceptance Criteria

- [ ] Each non-declined request card shows a 5-step horizontal timeline
- [ ] Steps: Submitted → Under Review → Approved → In Transit → Delivered
- [ ] Completed steps show green circle with checkmark + green connecting line
- [ ] Current step shows larger navy circle with bold label
- [ ] Future steps show gray circle + gray line + muted label
- [ ] Declined requests hide the timeline (show decline reason instead)
- [ ] "Delivered" always appears as a future/gray step (no mock data for it)
- [ ] Responsive: tighter spacing on mobile, readable on all breakpoints
- [ ] Uses existing `S.*` brand tokens — no new colors
- [ ] Build passes clean

---

*Spec created June 30, 2026 — visual "package tracker" for the demo narrative*
