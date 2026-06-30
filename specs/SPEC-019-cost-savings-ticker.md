# SPEC-019 — Cost Savings Ticker

**Priority:** P0 — Hackathon demo (ESOP narrative)
**Status:** Not started
**Effort:** Low (~20 minutes)
**Target:** June 30 hackathon

---

## Problem

HAUL's entire business case rests on one argument: using internal equipment instead of renting externally saves Sundt money and protects ESOP value. But nowhere in the app does this savings number appear. Without a visible dollar figure, judges must do the math themselves. That's a missed opportunity — one prominent number sells the pitch.

## Goal

Add a "Cost Savings" banner/card visible to Field View users (on the catalog home screen) that shows:

> **$XX,XXX saved** by using Sundt-owned equipment this quarter

Calculate from accepted/in-transit requests: for each, compute `rental days × (external rate - internal rate)` where external rate = `asset.rate × 1.8` (industry markup for external rentals). Sum across all fulfilled requests.

A secondary line shows the count: "across N fulfilled requests."

## Non-Goals

- Real financial modeling or ERP integration
- PM View cost dashboards (Phase 2)
- Per-request savings breakdown
- Editable markup multiplier

---

## Current State

**`Asset.rate`** — Every asset has a `rate: number` field representing the internal daily rate (e.g., CAT 320 = $1,850/day, Light Tower = $150/day).

**`EquipmentRequest`** — Has `startDate`, `endDate`, and `status`. Accepted and In Transit requests are "fulfilled."

**`FieldView.tsx`** — Receives `assets` and `requests` as props. The catalog home screen already has a greeting (SPEC-011), active requests section (SPEC-013), and category cards (SPEC-012).

**`storage.ts`** — Requests persist via localStorage, so savings accumulate as the demo progresses.

---

## Implementation

### 1. Calculation logic

In `FieldView.tsx`, compute savings from fulfilled requests:

```tsx
const EXTERNAL_MARKUP = 1.8; // External rentals cost ~80% more

const savingsData = useMemo(() => {
  const fulfilled = requests.filter(r => ["Accepted", "In Transit"].includes(r.status));
  let totalSavings = 0;
  for (const req of fulfilled) {
    const asset = assets.find(a => a.id === req.assetId);
    if (!asset) continue;
    const start = new Date(req.startDate);
    const end = new Date(req.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const externalCost = asset.rate * EXTERNAL_MARKUP * days;
    const internalCost = asset.rate * days;
    totalSavings += externalCost - internalCost;
  }
  return { totalSavings, count: fulfilled.length };
}, [requests, assets]);
```

### 2. Render savings banner

Place on the catalog home screen between the greeting and category cards (or between category cards and active requests — whichever flows better visually). Only show when `savingsData.count > 0`.

```tsx
{savingsData.count > 0 && (
  <div style={{
    background: `linear-gradient(135deg, ${S.navy}, ${S.darkNavy})`,
    borderRadius: 12,
    padding: isMobile ? "16px 20px" : "20px 28px",
    marginBottom: 16,
    color: S.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  }}>
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.85, marginBottom: 4 }}>
        ESOP Value Protected This Quarter
      </div>
      <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800 }}>
        ${savingsData.totalSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
        saved across {savingsData.count} fulfilled request{savingsData.count !== 1 ? "s" : ""} vs. external rental
      </div>
    </div>
    <div style={{ fontSize: 40, opacity: 0.3 }}>📊</div>
  </div>
)}
```

### 3. Design details

- **Background:** Navy gradient — ties to Sundt brand, stands out without using Red
- **Typography:** Large bold dollar figure (28–36px) for instant visual impact
- **Subtitle:** "ESOP Value Protected This Quarter" — connects directly to the company narrative
- **Secondary line:** "saved across N fulfilled requests vs. external rental" — explains the math without cluttering
- **Hidden when zero:** Before any requests are accepted, the banner doesn't appear. As the demo progresses and ES accepts requests, the number grows — live storytelling during the pitch.

### 4. How the number grows during the demo

With the 7 seed requests, the accepted/in-transit ones (REQ-002 Skid Steer 14 days at $850, REQ-005 Skid Steer 14 days at $800, REQ-007 Loader 14 days at $1,600) produce:

- REQ-002: 14 × $850 × 0.8 = $9,520
- REQ-005: 14 × $800 × 0.8 = $8,960
- REQ-007: 14 × $1,600 × 0.8 = $17,920

**Starting total: ~$36,400** — already a compelling number. When the demo accepts REQ-001 (CAT 320, 14 days at $1,850), it adds $20,720, jumping to **~$57,120**. The judges watch the number grow in real time.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/FieldView.tsx` | Add `savingsData` useMemo + savings banner on catalog view |

## Acceptance Criteria

- [ ] Savings banner visible on Field View catalog when fulfilled requests exist
- [ ] Dollar figure calculated from `(externalRate - internalRate) × days` for accepted/in-transit requests
- [ ] External rate = `asset.rate × 1.8` (hardcoded markup)
- [ ] Number formatted with commas, no decimals (e.g., "$36,400")
- [ ] Count of fulfilled requests shown as secondary text
- [ ] Banner hidden when no fulfilled requests exist
- [ ] Number updates live when switching back from ES View after accepting a request
- [ ] Navy gradient background, white text — brand compliant
- [ ] Responsive: works on mobile (28px number) and desktop (36px number)
- [ ] Build passes clean

---

*Spec created June 30, 2026 — directly supports ESOP narrative in pitch*
