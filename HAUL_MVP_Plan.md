# HAUL — Heavy Asset Utilization & Logistics

## Hackathon MVP Plan

**Submitted By:** Matthew Keating
**Team Lead:** Edison Bardalez
**Team Members:** Fabio Armando Madrigal, Frank Milla, Hengel Betrel, Maricarmen Paulino, Cesar Manzueta Goris
**Event:** Sundt Code-A-Thon • June 30, 2025
**Category:** Operations / Equipment Management
**Primary Users:** Field Supervisors, Project Managers, Equipment Services Staff
**Problem Scale:** Arizona Region, 48+ Assets, 4 Yards

---

## 1. The Core Problem

Sundt Equipment Services manages 48+ heavy assets across four Arizona yards and multiple active job sites, but **there is no centralized, self-service way for field teams to discover, compare, or request internal equipment.**

The current process relies on phone calls, emails, and ad hoc spreadsheets. This creates three cascading problems:

1. **Lack of visibility** — Field teams don't know what's available internally, so they rent externally when they don't need to.
2. **Coordination overhead** — Every request requires back-and-forth phone calls and emails, burning time on both sides.
3. **No spend accountability** — Project managers have no real-time visibility into equipment utilization or cost, making it impossible to optimize.

All of this erodes the return on Sundt-owned assets and directly reduces ESOP value for a 100% employee-owned company.

### 1.1 Today's Manual Process — Six Points of Friction

*(Source: HAUL pitch deck — "Today's Manual Processes Create Friction Across Every Step")*

The current equipment request workflow creates friction at every step, from initial request through delivery:

1. **Disconnected Communication** — Requests rely on phone calls, texts, and emails with no centralized record, leading to miscommunication and lost information.
2. **Spreadsheets & Manual Tracking** — Availability is tracked across multiple spreadsheets and systems that are often outdated and inconsistent.
3. **Delays & Inefficiencies** — Manual coordination and approvals create bottlenecks, causing delays in getting the right equipment to the job.
4. **Poor Visibility of Assets** — No real-time view of equipment location, utilization, or availability across yards and projects.
5. **Compliance Risks** — Certifications and inspections are difficult to track, increasing the risk of non-compliance in the field.
6. **Unnecessary External Costs** — Lack of visibility drives duplicate rentals and missed opportunities to use available internal assets.

**The result:** Higher rental spend, lost time and productivity, increased risk and liability, and lower overall utilization of Sundt's equipment investment.

### Origin: ESD Spark Idea

HAUL builds on an original Equipment Services Department pitch ("Equipment Service Dashboard Spark Idea" — `ESD_Spark_Idea_2.pptx`) with the tagline **"Bring the office to the Field."** That pitch identified the same core problem and proposed a centralized dashboard showing available equipment, specs, locations, and a vendor product library. HAUL takes that vision further by adding a structured request-to-fulfillment workflow, the guided ordering wizard, operator certification enforcement, and the Equipment Services dispatch dashboard.

Key insights from the original Spark Idea that inform HAUL's roadmap:

- **Broader equipment categories** — The ESD pitch includes Backhoes, Reach Forks, Boom Lifts, Trench Plates, Cameras, and Specialty Tools alongside heavy assets. HAUL's MVP focuses on heavy iron (excavators, cranes, dozers, etc.) but should expand to the full Equipment Services inventory post-hackathon.
- **Quantity-based tracking** — The Spark Idea frames inventory as "quantity available" per type, not individual asset records. For commodity items (trench plates, cameras, light towers), a quantity model may be more appropriate than individual tracking. HAUL's production data model should support both: individual tracking for high-value assets and quantity-based tracking for commoditized items.
- **Vendor Library as a first-class feature** — The original pitch gives the Vendor Library (brochures, spec sheets, training videos, pricing, recommended vendors) equal weight alongside the equipment catalog. This signals it is a high priority for Equipment Services stakeholders and should not be deferred too far.
- **Dual value proposition** — The pitch frames the benefit as two-fold: (1) reducing unnecessary rentals / protecting ESOP value, and (2) centralizing vendor knowledge to preserve institutional expertise. HAUL's demo pitch should reference both.

---

## 2. Proposed Solution

HAUL is a purpose-built internal web application that provides an **"Amazon-like" experience** for internal equipment and tool management. Users can search, filter, compare available assets, view detailed specifications, and submit structured requests through a modern, intuitive interface.

The platform replaces guesswork with a **transparent, data-driven approach** and gives all stakeholders — Field, Project Managers, and Equipment Services — a shared, real-time source of truth.

### 2.1 Proposed Process Flow

*(Source: HAUL pitch deck — end-to-end equipment request workflow)*

HAUL replaces the six manual friction points with a structured 7-step digital workflow:

| Step | Name | What Happens |
|---|---|---|
| 1 | **Browse Equipment** | Search and filter available assets in the catalog |
| 2 | **Configure Asset** | Select options, attachments & requirements |
| 3 | **Project Information** | Add project, location & dates |
| 4 | **Fuel Setup** | Choose fuel type & billing method |
| 5 | **Review & Submit** | Review details and submit request |
| 6 | **Equipment Services Approval** | Request reviewed and approved by Equipment Services experts |
| 7 | **Dispatch & Delivery** | Equipment dispatched to site |

**MVP implementation note:** The hackathon build implements steps 1–6 as the core demo path. Step 1 is the catalog browse experience (Field View). Steps 2–5 are consolidated into a 4-step ordering wizard (Job & Dates → Attachments → Services/Fueling → Review & Submit). Step 6 is the Equipment Services accept/decline workflow. Step 7 (dispatch tracking) is represented by the "In Transit" status and is a post-hackathon production feature.

The wizard step order differs slightly from the pitch deck (which shows Configure Asset before Project Info). The build puts Job & Dates first because field supervisors typically know *where* they need equipment before configuring *what* — and job site context helps filter relevant options. Both orderings are valid; the production version may A/B test this.

---

## 3. Business Rules

### 3.1 User Roles & Views

| Role | Focus | Key Capabilities |
|---|---|---|
| **Field Supervisors / Foremen** | Ordering | Browse catalog, check availability, submit requests, view job site totals, map of rented equipment |
| **Project Managers** | Cost & Analytics | Internal vs. external spend, billing, cost avoidance calculations, job use analytics |
| **Equipment Services** | Fulfillment & Maintenance | Request queue, maintenance notifications, operator certifications, regional heat maps |

Each view surfaces only what that role needs. Field sees less analytics; PMs see billing and cost avoidance; Equipment Services sees the operational picture.

### 3.2 Asset Catalog & Visibility

- Every asset must display: **make, model, specifications, current location, status, and ready date.**
- **Actual equipment photos** are strongly preferred over generated images.
- For specialized equipment (cranes, generators), **subject matter experts (SMEs) must be consulted** on capability data such as lift strength, voltage, and refueling requirements. Spec data may need a review/approval workflow before publishing.
- **Attachments** (buckets, forks, thumbs, etc.) for equipment like skid steers, loaders, and excavators must be browsable and requestable alongside the parent asset.

### 3.3 Ordering / Request Flow

- Requests go through a **guided ordering wizard with dropdown selections** — no free-text input — to keep the process simple and standardized.
- **Fueling services** must be configurable at the time of ordering.
- **Compatible attachments** should be selectable as part of the same order.
- All requests feed into a **structured fulfillment queue** managed by Equipment Services, replacing the current phone/email process.
- Each request must be tied to a **specific job site.**

### 3.4 Scheduling & Availability

- A **30-day Gantt-style calendar** (or clear available/unavailable status) shows asset availability.
- Target: **95%+ on-time equipment delivery.**
- Equipment Services receives **upcoming maintenance notifications** tied to asset schedules.

### 3.5 Financial & Cost Tracking

- PM view must show **internal vs. external spend** at the job level.
- **Cost avoidance calculations** (money saved by using internal vs. renting) must be visible and tie to ESOP value.
- Future: integrated billing linking equipment usage directly to project cost allocation.

### 3.6 Compliance

- **Operator certification must be enforced at deployment.** If an operator isn't certified for a requested asset type, the system should prevent or flag the assignment.

### 3.7 Utilization & Performance Targets

| Metric | Target |
|---|---|
| Internal fill rate | 80%+ |
| External rental spend reduction | 20% |
| On-time equipment delivery | 95%+ |

### 3.8 Vendor Library (Future)

- Equipment Services can store and share vendor product info, specifications, demo videos, and interaction notes.
- Searchable format that serves as a persistent knowledge hub to preserve institutional knowledge.

### 3.9 Platform Design Principles

- **"Amazon-like" UX:** Search, filter, compare, view details, order with minimal friction.
- **API-first architecture** to support future ERP integration, telematics, and multi-region expansion.
- **Start simple, scale incrementally.**

---

## 4. MVP Scope — Hackathon Demo

### 4.1 Hackathon Constraints

Per Code-A-Thon guidelines, the MVP must:

- **Skip authentication** — assume a logged-in user
- **Skip authorization** — no roles, no permissions logic
- **Use mock data** shaped like the real thing
- **Skip error handling and logging**
- **Keep secrets out of the AI** — no keys, tokens, or PII in prompts

The guiding principle: **cut everything that isn't the demo path.**

### 4.2 What's In the MVP

The MVP focuses on **two core workflows** — the demand side (Field) and the supply side (Equipment Services). View switching is handled via simple tab/nav toggle, not login-based roles.

#### Field View — "Shop & Request"

The field supervisor needs equipment and should be able to find it and request it without picking up the phone.

| Feature | Description |
|---|---|
| **Asset Catalog** | Searchable, filterable grid/list of all available equipment with the "Amazon-like" browse experience |
| **Asset Detail** | Make, model, specs, photo, current location, ready date |
| **Availability Indicator** | Clear available/unavailable status (or simplified Gantt view) for the next 30 days |
| **Ordering Wizard** | Guided, dropdown-driven flow: select job site → select dates → select equipment → select attachments → configure fueling → review → submit |
| **Request Confirmation** | Submitted state with request summary and status |
| **Job Site Context** | Every request is tied to a specific job site |

#### Equipment Services View — "Fulfill & Manage"

Equipment Services receives requests, manages the fleet, and coordinates delivery.

| Feature | Description |
|---|---|
| **Request Queue** | Incoming requests with all order details (who, what, where, when, attachments, fueling) |
| **Fulfillment Workflow** | Accept, decline, or flag each request |
| **Fleet Overview** | All assets with current status (available, deployed, in maintenance) and location |
| **Maintenance Visibility** | Upcoming maintenance schedule tied to assets |
| **Certification Flag** | Warning or indicator if operator certification is missing or expired for the requested asset type |

### 4.3 What's Deferred (Post-MVP)

| Feature | Reason |
|---|---|
| PM View (cost dashboards, spend analysis, billing) | Valuable but not part of the core request-fulfill loop |
| Vendor Library | Knowledge management, not core workflow |
| Heat maps and hotspot analytics | Analytics layer, not core workflow |
| Integrated billing | Financial integration, complex |
| Usage tracking and availability forecasting | Requires historical data |
| User reviews/feedback on equipment | Nice-to-have |
| ERP integration and telematics | Infrastructure, post-launch |
| Authentication and authorization | Per hackathon rules |
| Error handling and logging | Per hackathon rules |
| Release / Extend / Swap actions | Lifecycle management beyond the core request-fulfill loop; essential for production but doesn't strengthen the demo path |
| Request Priority Levels (normal, schedule-critical, safety-critical, emergency) | Useful for production queue triage but doesn't demo well with a small dataset and scripted flow |
| Pre-Use and Return Condition Checks (checklist + photos) | Separate workflow triggered at delivery/return, not during ordering; important for damage accountability and maintenance planning |

### 4.4 Phase 1.5 — Field-Ready Enhancements (Post-Hackathon, Pre-Deployment)

These features bridge the gap between the hackathon demo and the first real field deployment. HAUL is intended for use on job sites — supervisors and foremen will access it from tablets and phones, not desktop monitors. These enhancements make the app usable in real field conditions and were prioritized based on a product review conducted June 25, 2026.

#### P0 — Must-Have Before Field Deployment

| Feature | Description | Rationale |
|---|---|---|
| **~~Mobile-Responsive Field View~~** | **Done.** All 11 components refactored with `useBreakpoint()` hook (mobile ≤640px / tablet ≤1024px / desktop). Field View: single-column catalog on phone, stacked filter bar, compact cards. Asset Detail: vertical hero, single-column specs. Order Wizard: full-width header image, compact step indicators, stacked date fields and nav buttons. Equipment Services: 2-col KPI grid on mobile, shorter tab labels, full-width modal. Fleet table: tighter cell padding. All interactive elements ≥44px touch targets. CSS media queries for main padding. `globals.css` + `useBreakpoint.ts` + 10 component files updated. (SPEC-001) | ✅ Complete |
| **~~Real Equipment Photography~~** | **Done.** 23 equipment photos placed in `public/images/equipment/` (17 original heavy asset types + 6 expanded categories from ESD Spark Idea: Backhoe, Boom Lift, Reach Fork, Trench Plate, Camera, Specialty Tool). All asset `photo` fields in `data.ts` updated from emojis to image paths. Catalog cards show full-width images with status badge overlay; detail, wizard, request, and fleet views show appropriately-sized thumbnails. Sundt logo integrated into navy header. See `HAUL_Image_Requirements.md` for the full manifest. For production, replace with actual fleet photos. | ✅ Complete |
| **Substitute Recommendations** | When an asset is deployed or in maintenance, automatically suggest comparable available equipment: same type, similar specs, nearest yard, compatible attachments. Display as a "Similar Available Equipment" section on the Asset Detail page. Filter logic: match `type`, then sort by proximity (same yard first) and spec similarity. | This is the "Amazon-like" moment the pitch promises. A supervisor clicks a deployed excavator, sees "2 similar excavators available," and picks one — no phone call needed. Low implementation effort since the data model already supports type/spec/location filtering. |
| **~~Demo-Safe Persistence (localStorage)~~** | **Done.** `src/lib/storage.ts` abstracts localStorage behind load/save functions. `page.tsx` uses lazy `useState` initializers and `useEffect` sync. `window.__resetHaul()` resets to seed data via console. Graceful fallback if localStorage disabled. (SPEC-003) | ✅ Complete |
| **~~Personalized Greeting~~** | **Done.** Time-of-day greeting ("Good morning/afternoon/evening, Alex") + "What equipment do you need today?" subtitle at top of Field View. `MOCK_USER` object added to `data.ts` (name, role, jobSite). Hardcoded mock user per hackathon rules. (SPEC-011) | ✅ Complete |
| **Browse by Category Cards** | Horizontal scrollable row of 8 category image cards above the catalog grid. Tapping a card filters the catalog. Reuses existing equipment photos. (SPEC-012) | Matches pitch deck Slide 6. Visual browsing is more intuitive than a dropdown. |
| **Active Requests on Home Screen** | Show 1-2 most recent active requests directly on the Field View catalog page with thumbnail, name, ID, and status badge. (SPEC-013) | Matches pitch deck Slide 6 “My Active Requests.” Keeps users informed without extra navigation. |
| **Richer KPIs (Fill Rate, Utilization %)** | Replace simple counts with percentage metrics: Internal Fill Rate %, Equipment Utilization %, Active Requests, Total Fleet. Mock trend arrows. (SPEC-014) | Transforms ESD dashboard from prototype to executive-level. Matches pitch deck Slide 8. |

#### P1 — High-Value Additions for Initial Release

| Feature | Description | Rationale |
|---|---|---|
| **Yard & Job Site Map** | Add an interactive map component to Field View showing the four Arizona yards and five job sites as pin markers. Clicking a pin shows assets at that location. For demo, a static map with plotted coordinates is sufficient. For production, this becomes the foundation for telematics integration (Phase 5). | "Where is it?" is always the next question after "Is it available?" — a map answers it instantly without a phone call. |
| **~~Status Change Notifications~~** | **Done.** Toast notifications appear when switching from Equipment Services back to Field View after a request status changes. Tracks previous request states via `useRef`. Auto-dismisses after 5 seconds. Stacked toasts with close button. Navy left border, fixed bottom-right (bottom-center on mobile). Implemented in `page.tsx`. (SPEC-008) | ✅ Complete |
| **Estimated Delivery / Transit Time** | Show an estimated arrival time on each asset based on the distance between the asset's current yard and the selected job site. For MVP, hardcode transit estimates for the 4 yards × 5 job sites matrix (20 combinations). Display as "Est. arrival: ~2 hours from Tucson Yard" on the asset detail and order review screens. | Availability alone doesn't answer "when can I get it?" — transit time from a remote yard may change the supervisor's decision. This detail currently requires a phone call. |
| **Delivery Details in Order Wizard** | Add optional delivery fields to the Order Wizard review step: delivery contact name/phone, gate/access instructions, preferred drop zone, site operating hours, and whether unloading support is needed. Use dropdowns and short text fields. Store on the request object and display in the Equipment Services request card. | The "follow-up phone call" problem is exactly what HAUL eliminates. Delivery logistics (gate codes, drop zones, site hours) is where most of those calls happen today. Capturing this at order time removes the need for Equipment Services to call back. |
| **~~Structured Decline / Delay Reasons~~** | **Done.** 6-code dropdown (Maintenance, Unavailable Date, Cert Issue, Transport Constraint, Better Substitute, Other) added to decline modal. `DECLINE_REASONS` array and `declineReasonCode` field in `data.ts`. Decline button disabled until code selected. Free-text notes remain as optional. History tab shows bold reason label + notes. Seed REQ-004 updated. (SPEC-004) | ✅ Complete |
| **~~Request Operator Service Option~~** | **Done.** “Sundt-provided operator requested” checkbox in Order Wizard Step 3 alongside fueling. `operatorRequested?: boolean` on `EquipmentRequest`. Step 4 review row. Green 👷 badge on RequestCard. Independent from operator selection dropdown. (SPEC-005) | ✅ Complete |
| **~~Dispatch-Oriented Queue Grouping~~** | **Done.** Pending requests grouped by time horizon: “Today,” “This Week,” “Future” with colored left-border headers and count badges. Sorted by start date within each group. Empty groups hidden. Uses `DEMO_TODAY` constant matching seed data window. Active/History tabs remain flat. (SPEC-007) | ✅ Complete |
| **Certification Compliance Visualization** | Donut chart / gauge showing operator certification compliance: % Compliant, Expiring Soon, Expired. Calculated from mock `OPERATORS` data. CSS donut via `conic-gradient`. (SPEC-015) | Matches pitch deck Slide 8. Conveys operational maturity. Expired uses `S.black70` per Sundt brand rule. |
| **Upcoming Maintenance Table** | Table showing 5 upcoming maintenance items: equipment photo/name, maintenance type (PM Service, Inspection), due date. Mock data in `UPCOMING_MAINTENANCE` array. (SPEC-016) | Matches pitch deck Slide 8. Fills out the Equipment Services view and shows scheduling awareness. |
| **Availability Calendar (30-Day Bar)** | Horizontal 30-day timeline on Asset Detail page. Green = available, navy = committed, yellow = pending. Built from request date ranges against the asset. (SPEC-017) | Pitch deck Slide 11 lists this as Phase 1 (Current). Answers "when is it available?" visually. |

---

## 5. The Demo Path

This is the **only flow that needs to work flawlessly** in the hackathon demo:

### Step 1 — Field Supervisor Shops for Equipment

1. Open HAUL → Land on the **Field View**
2. Browse the asset catalog
3. Filter to **Excavators**
4. Open an asset detail page (e.g., CAT 320 Excavator)
5. See that it's **available** for the needed dates
6. Click **"Request Equipment"**

### Step 2 — Field Supervisor Completes the Order

7. Ordering wizard opens
8. Select **job site** from dropdown
9. Select **start and end dates**
10. Select **attachment** (e.g., thumb bucket)
11. Configure **fueling** (yes/no, frequency)
12. Review order summary
13. **Submit request**
14. See confirmation: "Request Submitted — Pending Approval"

### Step 3 — Equipment Services Fulfills the Request

15. Switch to **Equipment Services View**
16. New request appears at the top of the **request queue**
17. View all request details (who, what, where, when, attachments, fueling)
18. System shows **operator certification status** — green check
19. Click **"Accept"**
20. Request status updates to "Accepted"

### Step 4 — Field Supervisor Sees the Update

21. Switch back to **Field View**
22. Navigate to request history / status
23. Request now shows **"Accepted"**

**End of demo.** This proves the core value: internal assets are easy to find, request, and fulfill without a single phone call.

---

## 6. Mock Data Requirements

All data is local/seed data. No external APIs or databases are required for the demo.

### 6.1 Assets (~15–20 records)

A realistic mix of heavy equipment:

| Type | Example Makes/Models | Count |
|---|---|---|
| Excavators | CAT 320, CAT 330, John Deere 350G | 3–4 |
| Skid Steers | CAT 259D, John Deere 333G, Bobcat T770 | 3–4 |
| Loaders | CAT 950, John Deere 644, Volvo L90 | 2–3 |
| Cranes | Liebherr LTM 1060, Grove GMK3060 | 2 |
| Generators | CAT XQ200, Generac MDG150 | 2–3 |
| Dozers | CAT D6, John Deere 700K | 2 |
| Misc | Telehandler, Compactor, Light Tower | 2–3 |

Each asset record includes:

- `id` — unique identifier
- `name` — display name
- `type` / `category` — equipment type
- `make` — manufacturer
- `model` — model number
- `year` — model year
- `specs` — key specifications (weight, horsepower, capacity, lift strength, voltage, fuel type, etc.)
- `photo` — image URL or placeholder
- `location` — current yard or job site
- `status` — Available, Deployed, In Maintenance
- `readyDate` — date the asset will next be available
- `compatibleAttachments` — list of attachment IDs (for skid steers, excavators, loaders)
- `certificationRequired` — type of operator certification needed

### 6.2 Yards (4 records)

| Yard | Location |
|---|---|
| Tempe Yard | Tempe, AZ |
| Tucson Yard | Tucson, AZ |
| Chandler Yard | Chandler, AZ |
| Mesa Yard | Mesa, AZ |

### 6.3 Job Sites (3–5 records)

| Job Site | Project Name | PM |
|---|---|---|
| Site 001 | I-10 Broadway Curve | Martinez |
| Site 002 | Chandler Municipal Center | Johnson |
| Site 003 | Tucson Water Reclamation | Davis |
| Site 004 | Mesa Light Rail Extension | Thompson |
| Site 005 | ASU Research Campus | Wilson |

### 6.4 Attachments (5–8 records)

| Attachment | Compatible With |
|---|---|
| Thumb Bucket | Excavators |
| 36" Digging Bucket | Excavators |
| 48" Grading Bucket | Excavators, Loaders |
| Pallet Forks | Skid Steers, Loaders, Telehandlers |
| Auger | Skid Steers |
| Breaker/Hammer | Excavators |
| Sweeper | Skid Steers |
| Grapple | Skid Steers, Excavators |

### 6.5 Sample Requests (5–8 records)

Requests in various states to populate the Equipment Services queue:

| Request | Asset | Job Site | Status |
|---|---|---|---|
| REQ-001 | CAT 320 Excavator | I-10 Broadway Curve | Pending |
| REQ-002 | John Deere 333G Skid Steer | Chandler Municipal Center | Accepted |
| REQ-003 | CAT XQ200 Generator | Tucson Water Reclamation | Pending |
| REQ-004 | CAT D6 Dozer | Mesa Light Rail Extension | Declined — In Maintenance |
| REQ-005 | Bobcat T770 Skid Steer + Pallet Forks | ASU Research Campus | Accepted |
| REQ-006 | Liebherr LTM 1060 Crane | I-10 Broadway Curve | Pending |
| REQ-007 | CAT 950 Loader + 48" Grading Bucket | Chandler Municipal Center | In Transit |

### 6.6 Operators (3–5 records)

| Operator | Certifications | Status |
|---|---|---|
| Mike Rodriguez | Excavator, Loader | Current |
| Sarah Chen | Crane, Excavator | Current |
| James Walker | Skid Steer | Expired |
| David Martinez | Dozer, Loader, Excavator | Current |
| Lisa Thompson | Generator, Crane | Current |

---

## 7. Simplified Architecture

```
┌─────────────────────────────────────────────┐
│              HAUL — Nav Bar                  │
│      [ Field View ]  [ Equipment Services ] │
├─────────────────────────────────────────────┤
│                                             │
│  FIELD VIEW                                 │
│  ├── Asset Catalog (search, filter, browse) │
│  ├── Asset Detail + Availability            │
│  ├── Ordering Wizard                        │
│  │   ├── Job Site (dropdown)                │
│  │   ├── Dates (start / end)                │
│  │   ├── Attachments (dropdown)             │
│  │   ├── Fueling (yes/no + frequency)       │
│  │   └── Review & Submit                    │
│  └── Request Status / Confirmation          │
│                                             │
│  EQUIPMENT SERVICES VIEW                    │
│  ├── Request Queue (with all details)       │
│  ├── Accept / Decline / Flag Workflow       │
│  ├── Fleet Status Overview                  │
│  ├── Maintenance Schedule                   │
│  └── Operator Certification Flags           │
│                                             │
├─────────────────────────────────────────────┤
│  • All data = local mock / seed data        │
│  • No authentication or authorization       │
│  • No error handling or logging             │
│  • View switching via nav toggle            │
└─────────────────────────────────────────────┘
```

---

## 8. Future Roadmap (Post-Hackathon)

These features are documented for future development and can be referenced when expanding beyond the MVP.

### Phase 1.5 — Field-Ready Enhancements (Pre-Deployment)

**P0 — Must-Have:**
- ~~Mobile-responsive Field View~~ — **Done.** useBreakpoint() hook + 11 component refactors (SPEC-001)
- ~~Real equipment photography~~ — **Done.** 23 photos in public/images/equipment/
- Substitute recommendations when an asset is unavailable (same type, similar specs, nearest yard)
- ~~Demo-safe persistence via localStorage~~ — **Done.** `src/lib/storage.ts` + lazy useState initializers + useEffect sync. `window.__resetHaul()` for console reset. (SPEC-003)

**P1 — High-Value:**
- Interactive yard & job site map with asset location pins
- ~~Status change notifications~~ — **Done.** Toast on view-switch with auto-dismiss. (SPEC-008)
- Estimated delivery / transit time based on yard-to-jobsite distance
- Delivery details capture in Order Wizard (contact, gate/access, drop zone, site hours, unloading support)
- ~~Structured decline / delay reason codes~~ — **Done.** 6-code dropdown + optional notes in decline modal. (SPEC-004)
- ~~Request Operator service option~~ — **Done.** Toggle in Order Wizard Step 3 + badge on RequestCard. (SPEC-005)
- ~~Dispatch-oriented queue grouping~~ — **Done.** Today / This Week / Future headers in Equipment Services queue. (SPEC-007)

### Phase 2 — PM View & Financial Layer

- Project Manager dashboard with internal vs. external spend
- Cost avoidance calculations tied to ESOP value
- Job-level billing integration
- Job use analytics (what equipment is used, when)
- Release / extend / swap actions on active requests (equipment lifecycle management beyond request-fulfill)
- Request priority levels (normal, schedule-critical, safety-critical, emergency) for queue triage
- Pre-use and return condition checks (checklist + photos for damage accountability, hour tracking, maintenance planning)

### Phase 3 — Vendor Library & Knowledge Hub

Promoted from Phase 4 based on the original ESD Spark Idea, which gave the Vendor Library equal weight alongside the equipment catalog. Equipment Services stakeholders consider this a high-priority knowledge management need.

- Centralized vendor product information
- Specs, demo videos, and vendor interaction notes
- Searchable, organized format for institutional knowledge
- Brochures and pricing data
- Recommended vendors per equipment category
- Link vendor suggestions to the substitute recommendation flow (when internal equipment is unavailable, suggest a preferred vendor)

### Phase 4 — Analytics & Intelligence

- Heat maps showing rental trends by region
- Tool Hotspot Analytics across projects
- Availability forecasting based on historical data
- User reviews and feedback on equipment performance

### Phase 5 — Integration & Scale

- Expanded equipment categories: Backhoes, Boom Lifts, Reach Forks, Trench Plates, Cameras, Specialty Tools (per ESD Spark Idea)
- Dual data model: individual asset tracking for high-value items + quantity-based tracking for commodity items

- ERP integration (API-first design supports this)
- Telematics integration for real-time asset tracking
- Equipment service and location tracking
- Standardized call-off system
- Multi-region expansion beyond Arizona

---

## 9. Success Criteria for Demo

| Criteria | How to Show It |
|---|---|
| Field team can find equipment without calling anyone | Walk through catalog search and filter |
| Ordering is simple and guided | Complete the wizard with dropdowns only |
| Equipment Services gets structured requests instantly | Show the request appearing in the queue |
| Certification compliance is visible | Show the green/red flag on a request |
| The loop closes | Field sees "Accepted" after Equipment Services approves |

---

## 10. One-Sentence Pitch

> A field supervisor searches the catalog, finds an available excavator with a thumb attachment, requests it with fueling for their job site — and Equipment Services sees that request instantly, confirms the operator is certified, and accepts it — all without a single phone call.

**Demo framing (from the original ESD Spark Idea):** *"Bring the office to the Field"* — HAUL benefits Sundt two-fold: reducing unnecessary external rentals to protect ESOP value, and centralizing equipment and vendor knowledge so institutional expertise isn't lost.

**Expansion narrative for judges:** "We started with heavy assets — excavators, cranes, dozers — but HAUL is designed to scale to the full Equipment Services inventory: boom lifts, trench plates, cameras, specialty tools. And the Vendor Library is next — brochures, spec sheets, training videos, recommended vendors — all in one place."

**Sundt tagline:** *Skill. Grit. Purpose.*

---

*HAUL — Build It. Code It. Vibe It. Ship It.*
