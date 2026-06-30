# SPEC-015 — Certification Compliance Visualization

**Priority:** P1 — Hackathon if time permits
**Status:** Not started
**Effort:** Medium (~1 hour)
**Target:** June 30 hackathon

---

## Problem

The pitch deck (Slide 8) shows a "Certification Compliance" donut chart: 98% Compliant, with counts for Compliant / Expiring Soon / Expired. This conveys operational maturity. Our current dashboard has no compliance visibility — cert status only appears when reviewing individual request cards.

## Goal

Add a certification compliance summary card to the Equipment Services dashboard, showing operator compliance as a visual gauge calculated from mock operator data.

## Non-Goals

- Interactive cert management (renew, notify)
- Per-asset cert tracking (only per-operator)
- Historical compliance trends

---

## Current State

**`data.ts`** — `OPERATORS` array (5 records) with `certifications`, `status` ("Active" | "Expired"), and `expiry` date.

**`EquipServicesView.tsx`** — No compliance visualization.

---

## Implementation

### 1. Calculate compliance from `OPERATORS`

```tsx
const compliant = OPERATORS.filter(o => o.status === "Active").length;
const expired = OPERATORS.filter(o => o.status === "Expired").length;
const expiringSoon = OPERATORS.filter(o => {
  if (o.status !== "Active") return false;
  const daysToExpiry = (new Date(o.expiry).getTime() - Date.now()) / 86400000;
  return daysToExpiry <= 30;
}).length;
const complianceRate = Math.round((compliant / OPERATORS.length) * 100);
```

### 2. Render compliance card

Add below the KPI strip (or as a new tab section). Simple visual:

- [ ] Large percentage: "80%" (or whatever the mock data yields)
- [ ] Three-item legend: ● Compliant (green), ● Expiring Soon (yellow), ● Expired (red — use `S.black70` per Sundt brand, not actual red)
- [ ] Optional: CSS donut chart using `conic-gradient` — no dependencies

```tsx
<div style={{
  width: 100, height: 100, borderRadius: "50%",
  background: `conic-gradient(${S.green} 0% ${complianceRate}%, ${S.black70} ${complianceRate}% 100%)`,
  display: "flex", alignItems: "center", justifyContent: "center",
}}>
  <div style={{ width: 70, height: 70, borderRadius: "50%", backgroundColor: S.white,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 800, color: S.black90 }}>
    {complianceRate}%
  </div>
</div>
```

### 3. Add expiring-soon mock data

- [ ] If all operators are Active with far-future expiry dates, add or adjust one operator to expire within 30 days so the "Expiring Soon" category has data

---

## Files Changed

| File | Change |
|---|---|
| `src/components/EquipServicesView.tsx` | Add compliance card with donut and legend |
| `src/lib/data.ts` | Possibly adjust one operator expiry to be within 30 days |

## Acceptance Criteria

- [ ] Compliance donut/gauge shows % from mock operator data
- [ ] Legend shows Compliant, Expiring Soon, Expired counts
- [ ] Expired uses `S.black70` (not red — Sundt brand rule)
- [ ] All data from mock `OPERATORS` array — no auth, no real API
- [ ] Matches pitch deck Slide 8 "Certification Compliance" section
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 8 (Equipment Services Experience)*
