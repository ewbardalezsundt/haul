# SPEC-011 — Personalized Greeting (Mock User)

**Priority:** P0 — Hackathon demo polish
**Status:** ✅ Done (June 30, 2026)
**Effort:** Very low (~10 minutes)
**Target:** June 30 hackathon

---

## Problem

The Field View opens straight into the filter bar and catalog grid. There's no welcome context — it feels like a tool, not an experience. The pitch deck (Slide 6) shows "Good morning, Alex" with "What equipment do you need today?" — creating an Amazon-like warmth.

## Goal

Add a time-of-day greeting with a hardcoded mock user name at the top of Field View. Per hackathon rules: mock data, no authentication.

## Non-Goals

- Login or user selection
- User profiles or preferences
- Role-based greeting differences

---

## Current State

**`FieldView.tsx`** — Opens with `<h1>Equipment Catalog</h1>` then the filter bar. No greeting.

**`page.tsx`** — No user state. Hackathon constraint: skip auth entirely.

---

## Implementation

### 1. Add mock user to `data.ts`

```tsx
export const MOCK_USER = {
  name: "Alex",
  role: "Field Supervisor",
  jobSite: "I-10 Broadway Curve",
};
```

### 2. Add greeting to `FieldView.tsx`

```tsx
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Render at top of FieldView, before filters:
<div style={{ marginBottom: 20 }}>
  <h1 style={{ fontSize: 22, fontWeight: 700, color: S.black90, margin: 0 }}>
    {getGreeting()}, {MOCK_USER.name}
  </h1>
  <p style={{ fontSize: 14, color: S.black70, marginTop: 4 }}>
    What equipment do you need today?
  </p>
</div>
```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/data.ts` | Add `MOCK_USER` object |
| `src/components/FieldView.tsx` | Add greeting section above filters |

## Acceptance Criteria

- [ ] Field View shows "Good morning/afternoon/evening, Alex"
- [ ] Subtitle asks "What equipment do you need today?"
- [ ] No login, no user selection — hardcoded mock user per hackathon rules
- [ ] Build passes clean

---

*Spec created June 25, 2026 — matches pitch deck Slide 6 (Field Experience)*
