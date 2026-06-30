# SPEC-003 — Demo-Safe Persistence (localStorage)

**Priority:** P0 — Hackathon demo
**Status:** Not started
**Effort:** Very low (~30 minutes)
**Target:** June 30 hackathon

---

## Problem

All application state (requests array, next request number) lives in React `useState` inside `page.tsx`. If the presenter accidentally refreshes the browser during the hackathon demo, every new request vanishes and the demo breaks. With 7 seed requests and a scripted demo path, this is a real risk.

## Goal

Persist `requests` and `nextReqNum` to `localStorage` so the app survives a browser refresh. Hide persistence behind an abstraction so a real API can replace it cleanly post-hackathon.

## Non-Goals

- Backend API or database
- Multi-tab sync
- Conflict resolution
- Data migration between versions

---

## Current State (code audit)

**`page.tsx`** — State management:
```tsx
const [requests, setRequests] = useState<EquipmentRequest[]>(INITIAL_REQUESTS);
const [nextReqNum, setNextReqNum] = useState(8);
```

All state is in-memory only. `INITIAL_REQUESTS` from `data.ts` provides 7 seed records. `nextReqNum` starts at 8 (after REQ-007).

No persistence layer, no service abstraction. `addRequest` and `updateRequestStatus` are inline functions that call `setRequests`.

---

## Implementation

### 1. New file: `src/lib/storage.ts`

```tsx
import { INITIAL_REQUESTS, type EquipmentRequest } from "@/lib/data";

const STORAGE_KEY = "haul_requests";
const SEQ_KEY = "haul_next_req";

export function loadRequests(): EquipmentRequest[] {
  if (typeof window === "undefined") return INITIAL_REQUESTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: EquipmentRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Silent fail — localStorage full or disabled
  }
}

export function loadNextReqNum(): number {
  if (typeof window === "undefined") return 8;
  try {
    const stored = localStorage.getItem(SEQ_KEY);
    return stored ? parseInt(stored, 10) : 8;
  } catch {
    return 8;
  }
}

export function saveNextReqNum(n: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEQ_KEY, String(n));
  } catch {}
}

export function resetStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SEQ_KEY);
}
```

### 2. Update `page.tsx`

- [ ] Replace `useState<EquipmentRequest[]>(INITIAL_REQUESTS)` with lazy initializer: `useState(() => loadRequests())`
- [ ] Replace `useState(8)` with: `useState(() => loadNextReqNum())`
- [ ] In `addRequest`: after `setRequests(...)`, call `saveRequests(updatedArray)` and `saveNextReqNum(nextNum)`
- [ ] In `updateRequestStatus`: after `setRequests(...)`, call `saveRequests(updatedArray)`
- [ ] Use `useEffect` to sync on every `requests` change: `useEffect(() => saveRequests(requests), [requests])`

### 3. Optional: Reset button (dev/demo convenience)

- [ ] Add a hidden "Reset Demo Data" button in the header (e.g., click the "HAUL" logo 5 times)
- [ ] Or expose `resetStorage()` on `window` for console access: `window.__resetHaul = resetStorage`

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/storage.ts` | **New file** — localStorage abstraction |
| `src/app/page.tsx` | Import storage functions, wire into state init + updates |

## Acceptance Criteria

- [ ] Create a new request → refresh browser → request still appears in "My Requests"
- [ ] Accept a request in Equipment Services → refresh → status persists as "Accepted"
- [ ] Decline a request with reason → refresh → decline reason persists
- [ ] `resetStorage()` clears all data and returns to seed state
- [ ] App works normally with localStorage disabled (falls back to in-memory)
- [ ] No TypeScript errors, build passes clean

---

*Spec created June 25, 2026 — HAUL_MVP_Plan.md § 4.4 P0*
