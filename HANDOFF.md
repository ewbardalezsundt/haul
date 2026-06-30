# HANDOFF — HAUL (Heavy Asset Utilization & Logistics)

## Goal

Build an MVP internal web app for Sundt Equipment Services' **Code-A-Thon (June 30, 2025)**. HAUL gives field teams an "Amazon-like" experience to browse, compare, and request Sundt-owned heavy equipment — and gives Equipment Services a dashboard to fulfill those requests. The demo must show the full request-to-fulfillment loop without a single phone call.

**Team:** Edison Bardalez (lead), Fabio Armando Madrigal, Frank Milla, Hengel Betrel, Maricarmen Paulino, Cesar Manzueta Goris. Submitted by Matthew Keating.

---

## Current Progress

### What's Built

The project is a **Next.js 16 + TypeScript + Tailwind** app at `C:\Repo\haul\haul`. All source files are written and the project **builds successfully** (`npx next build` passes clean).

**File structure:**

```
src/
├── app/
│   ├── globals.css           ← Sundt CSS variables + base styles
│   ├── layout.tsx            ← Root layout with metadata
│   └── page.tsx              ← Main app: header, nav toggle, state management
├── lib/
│   ├── theme.ts              ← Sundt brand color tokens (S.red, S.navy, etc.)
│   ├── data.ts               ← All mock data with TypeScript interfaces
│   ├── helpers.ts            ← getLocation, getCompatibleAttachments, getOperatorCertStatus
│   ├── storage.ts            ← localStorage persistence (load/save requests & sequence num)
│   └── useBreakpoint.ts      ← Responsive hook: mobile/tablet/desktop
└── components/
    ├── ui.tsx                ← Shared: Btn, StatusBadge, BackBtn, SectionLabel, InfoRow, CertIndicator
    ├── FieldView.tsx         ← Asset catalog grid with search/filter (labeled Type & Status dropdowns, 4 status options)
    ├── AssetDetail.tsx       ← Full spec page, availability, compatible attachments
    ├── OrderWizard.tsx       ← 4-step guided request (Job & Dates → Attachments → Services → Review)
    ├── OrderConfirmation.tsx ← Success screen with request ID
    ├── MyRequests.tsx        ← Request history list with status badges
    ├── EquipServicesView.tsx ← Dashboard: KPIs, tabs, request queue, decline modal
    ├── RequestCard.tsx       ← Request detail card with cert flags + accept/decline actions
    └── FleetOverview.tsx     ← Filterable fleet table (All/Available/Deployed/Maintenance)

public/
└── images/
    ├── sundt-logo.png            ← Sundt logo (white text, transparent bg)
    └── equipment/                ← 23 equipment photos (17 original + 6 ESD Spark Idea categories)
        ├── cat-320-excavator.jpg
        ├── cat-330-excavator.jpg
        ├── jd-350g-excavator.jpg
        ├── cat-259d-skidsteer.jpg
        ├── jd-333g-skidsteer.jpg
        ├── bobcat-t770-skidsteer.jpg
        ├── cat-950m-loader.jpg
        ├── volvo-l90h-loader.jpg
        ├── liebherr-ltm1060-crane.jpg
        ├── grove-gmk3060-crane.jpg
        ├── cat-xq200-generator.jpg
        ├── generac-mdg150-generator.jpg
        ├── cat-d6-dozer.jpg
        ├── jd-700k-dozer.jpg
        ├── jlg-1055-telehandler.jpg
        ├── cat-cs56b-compactor.jpg
        ├── wacker-ltn6l-lighttower.jpg
        ├── cat-420-backhoe.jpg
        ├── jlg-600s-boomlift.jpg
        ├── cat-th357d-reachfork.jpg
        ├── roadplate-trenchplate.jpg
        ├── sensera-mc30-camera.jpg
        └── hilti-te70-rotaryhammer.jpg
```

### Mock Data (in `src/lib/data.ts`)

- **23 assets** across 15 types (Excavator, Skid Steer, Loader, Crane, Generator, Dozer, Telehandler, Compactor, Light Tower, Backhoe, Boom Lift, Reach Fork, Trench Plate, Camera, Specialty Tool)
- **4 yards** (Tempe, Tucson, Chandler, Mesa)
- **5 job sites** with project codes
- **8 attachments** with compatibility mapping
- **5 operators** with certification statuses (including one expired)
- **7 seed requests** in various states (Pending, Accepted, Declined, In Transit)

### Two Core Views

1. **Field View** — Browse catalog → filter/search → asset detail → 4-step order wizard (with attachment selection, fueling config, operator cert validation) → confirmation
2. **Equipment Services View** — KPI strip → request queue with accept/decline → fleet overview table → active/history tabs

### Process Flow Context

*(From HAUL pitch deck — documented in HAUL_MVP_Plan.md §§ 1.1, 2.1)*

**Today's manual process** has six friction points: disconnected communication (phone/email/text with no record), spreadsheets and manual tracking, delays from manual coordination, poor asset visibility across yards, compliance risks from untracked certifications, and unnecessary external rental costs from lack of visibility.

**HAUL's proposed 7-step digital workflow:** Browse Equipment → Configure Asset (attachments/requirements) → Project Information (job site/dates) → Fuel Setup → Review & Submit → Equipment Services Approval → Dispatch & Delivery. The hackathon MVP implements steps 1–6. Step 7 (dispatch tracking) is post-hackathon.

**Note:** The build's wizard step order (Job & Dates first, then Attachments) differs slightly from the pitch deck (Configure Asset first, then Project Info). Both are valid — the build prioritizes job site context first since field users know *where* before *what*.

### Sundt Brand Compliance

Styled per `sundtTheme.js` and `SundtStyleGuide.jsx` (both in uploads):
- **Red (#EE373D) = brand only** — header stripe, logo, brand CTA. NEVER for errors/declined/danger.
- **Navy (#006699)** = header background, primary action buttons, active nav text
- **Submit Green (#00A200)** = Submit Request, Accept buttons only
- **Black-80 (#333333)** = destructive/decline buttons
- **Black-70 (#636467)** = declined status, cert warnings (not red)
- **Yellow (#F3D03E)** = pending, maintenance, caution states
- **Green (#78C196)** = available, accepted, valid certification
- Navy header with Sundt logo (white text on transparent bg) + 3px red bottom border (brand stripe)
- Active nav tab: white bg with navy text; inactive: transparent with white text (85% opacity)
- Cards: white bg, QDR Gray (#E2E3E6) borders
- Stat cards with colored top accent borders

### Git Status

- Repo: `C:\Repo\haul\haul`
- Branch: `main`
- Last commit: `cc1bdb6 Initial commit` (scaffolding from create-next-app)
- **All HAUL source files are staged but NOT committed** — the commit is being saved for June 30 (hackathon day)

---

## Hackathon Constraints

Per Code-A-Thon rules:
- **Skip authentication** — assume a logged-in user
- **Skip authorization** — no roles/permissions logic
- **Use mock data** shaped like the real thing
- **Skip error handling and logging**
- **No secrets/keys/PII in prompts**

View switching is done via nav toggle, not login-based roles.

---

## What Worked

- Scaffolding with `create-next-app --typescript --tailwind --app --src-dir` gave a clean foundation
- Splitting into `lib/` (data, theme, helpers) and `components/` keeps things navigable for a team
- Inline styles using the `S` token object from `theme.ts` enforces brand consistency without needing Tailwind config extension
- The mock data model (typed interfaces in `data.ts`) mirrors real Equipment Services entities closely enough to feel credible in the demo

### ESD Spark Idea Alignment

HAUL builds on an original Equipment Services pitch (`ESD_Spark_Idea_2.pptx`) with the tagline **"Bring the office to the Field."** Reviewing that deck revealed several insights that shaped the roadmap:

- **Broader equipment categories** — The ESD vision includes Backhoes, Boom Lifts, Reach Forks, Trench Plates, Cameras, and Specialty Tools. HAUL's MVP focuses on heavy assets but should expand to the full inventory post-hackathon.
- **Quantity-based tracking** — For commodity items (trench plates, cameras), a "quantity available" model may be more appropriate than individual asset records. The production data model should support both patterns.
- **Vendor Library promoted** — The original pitch gives the Vendor Library equal weight alongside the equipment catalog (brochures, spec sheets, training videos, pricing, recommended vendors). Promoted from Phase 4 to Phase 3 in the roadmap.
- **Dual value proposition** — HAUL benefits Sundt two-fold: (1) reducing unnecessary rentals / ESOP value, and (2) centralizing vendor knowledge. Use both angles in the demo pitch.
- **Demo pitch framing:** *"Bring the office to the Field"* + *"Skill. Grit. Purpose."* (Sundt tagline)

---

## What Didn't Work

- `create-next-app` rejects folder names with capital letters — had to use lowercase `haul`
- Windows `Rename-Item` can't change case on case-insensitive filesystems
- The original plan created the project at `C:\Repo\Haul` but the actual repo lives at `C:\Repo\haul\haul` — always use the latter path

---

## The Demo Path (must work flawlessly)

1. **Field View** → Browse catalog → Filter to Excavators → Open CAT 320 detail → See it's available
2. Click "Request This Equipment" → Wizard: select job site, dates, thumb bucket attachment, weekly fueling → Review → Submit
3. See confirmation with REQ ID
4. **Switch to Equipment Services View** → New request at top of queue → Cert check green → Click Accept
5. **Switch back to Field View** → My Requests → Status shows "Accepted"

---

## Next Steps

### Before the Hackathon (prep)
- [ ] Run `npm run dev` and walk through the full demo path end-to-end
- [x] ~~Replace emoji placeholders with actual equipment photos~~ — **Done.** 23 equipment photos added to `public/images/equipment/` (17 original + 6 ESD Spark Idea categories). All 6 components updated from emoji `<span>` to `<img>` tags with `objectFit: cover`. See `HAUL_Image_Requirements.md` for the full image manifest.
- [x] ~~Add the Sundt logo to the header~~ — **Done.** Logo at `public/images/sundt-logo.png` (white text, transparent bg). Header redesigned from white bg → navy (#006699) bg so the logo is visible. Nav tabs inverted: active = white bg/navy text, inactive = transparent/white text at 85% opacity. Red brand stripe retained as 3px bottom border.
- [ ] Review mock data with team — do the asset specs, job site names, and yard locations feel realistic to Equipment Services?

### During the Hackathon

**Priority targets (from feature review June 25):**
- [ ] **Substitute Recommendations (P0)** — When an asset is deployed/in maintenance, show a "Similar Available Equipment" section on AssetDetail. Filter by same `type`, sort by proximity and spec similarity. This is the "Amazon-like" moment — high demo impact, low effort.
- [x] ~~**localStorage Persistence (P0)**~~ **Done.** — Requests and nextReqNum persisted to `localStorage` via `src/lib/storage.ts`. State survives browser refresh. `useEffect` syncs on every change. `window.__resetHaul()` resets to seed data. Falls back gracefully if localStorage disabled. (SPEC-003)
- [x] ~~**Personalized Greeting (P0)**~~ **Done.** — "Good morning, Alex" + "What equipment do you need today?" at top of Field View. Hardcoded mock user per hackathon rules (no auth). ~10 min. Matches pitch deck Slide 6. (SPEC-011)
- [ ] **Browse by Category Cards (P0)** — Horizontal scrollable row of 8 category image cards above the catalog grid. Tapping filters. Reuses existing photos. ~1 hr. Matches pitch deck Slide 6. (SPEC-012)
- [ ] **Active Requests on Home Screen (P0)** — Show 1-2 active requests on the catalog page with status badges. "View all" links to My Requests. ~30 min. Matches pitch deck Slide 6. (SPEC-013)
- [ ] **Richer KPIs (P0)** — Internal Fill Rate %, Equipment Utilization %, Active Requests, Total Fleet. Mock trend arrows. ~30 min. Matches pitch deck Slide 8. (SPEC-014)
- [x] ~~**Structured Decline Reasons (P1)**~~ **Done.** — Dropdown with 6 reason codes (Maintenance, Unavailable Date, Cert Issue, Transport Constraint, Better Substitute, Other) added to decline modal. Decline button disabled until a code is selected. Free-text notes still available. History tab shows bold reason label + optional notes. Seed REQ-004 updated with structured code. (SPEC-004)
- [x] ~~**Request Operator Service (P1)**~~ **Done.** — "Sundt-provided operator requested" checkbox added to Order Wizard Step 3 (Services) alongside fueling. `operatorRequested?: boolean` on `EquipmentRequest` interface. Step 4 review shows "Operator Service: Yes — Sundt-provided" when checked. RequestCard displays green 👷 badge. Toggle is independent from operator selection dropdown in Step 1. (SPEC-005)
- [ ] **Delivery Details (P1)** — Add optional fields to the Order Wizard: delivery contact, gate/access notes, drop zone, site hours, unloading support needed. Reduces follow-up phone calls.
- [ ] **Dispatch Queue Grouping (P1)** — Add "Today / This Week / Future" date-based grouping headers to the Equipment Services request queue. Sort within each group by start date.
- [ ] **Certification Compliance (P1)** — Donut/gauge showing operator cert compliance % with Compliant / Expiring Soon / Expired counts. CSS donut, mock data. Matches pitch deck Slide 8. (SPEC-015)
- [ ] **Upcoming Maintenance Table (P1)** — Table with 5 upcoming maintenance items (equipment, type, due date). Mock `UPCOMING_MAINTENANCE` data. Matches pitch deck Slide 8. (SPEC-016)
- [ ] **Availability Calendar (P1)** — 30-day horizontal bar on Asset Detail: green (available), navy (committed), yellow (pending). Built from request dates. Matches pitch deck Slide 11 Phase 1 commitment. (SPEC-017)

**Other hackathon stretch goals:**
- [ ] Polish the Gantt/availability calendar (currently just a status badge + ready date — could be a 30-day visual)
- [ ] Add a map component to Field View showing asset locations across yards
- [ ] Add maintenance schedule visibility to Equipment Services view
- [ ] Consider adding notification/toast when a request status changes
- [x] ~~Mobile responsiveness pass~~ **Done.** (SPEC-001)

### Phase 1.5 — Field-Ready Enhancements (Post-Hackathon, Pre-Deployment)

HAUL is a field-use app — supervisors and foremen will access it from phones and ruggedized tablets on job sites, not desktop monitors. These features bridge the gap between the hackathon demo and real field adoption. Prioritized during a product review on June 25, 2026. Full details (including rationale) are in HAUL_MVP_Plan.md § 4.4.

#### P0 — Must-Have Before Field Deployment

- [x] ~~**Mobile-Responsive Field View**~~ **Done.** All 11 components refactored with useBreakpoint() hook. (SPEC-001) — Refactor all Field View layouts (catalog grid, asset detail, order wizard, My Requests) for phones and tablets. Catalog collapses to single-column card list on small viewports. Order wizard steps go full-screen on mobile. All touch targets minimum 44px. Equipment Services view is lower priority (desk users) but must not break on tablet.
- [x] ~~**Real Equipment Photography**~~ — **Done.** 23 equipment photos placed in `public/images/equipment/` (17 original heavy asset types + 6 expanded categories from ESD Spark Idea: Backhoe, Boom Lift, Reach Fork, Trench Plate, Camera, Specialty Tool). All asset `photo` fields in `data.ts` updated from emojis to image paths. Catalog cards show full-width images with status badge overlay; detail, wizard, request, and fleet views show appropriately-sized thumbnails. See `HAUL_Image_Requirements.md` for the full manifest. For production, replace with actual fleet photos.
- [ ] **Substitute Recommendations** — Show "Similar Available Equipment" on AssetDetail when an asset is deployed/in maintenance. Filter by same type, sort by proximity and spec similarity. High demo impact, low effort.
- [x] ~~**Demo-Safe Persistence (localStorage)**~~ **Done.** — `src/lib/storage.ts` abstracts localStorage behind load/save functions. `page.tsx` uses lazy `useState` initializers and `useEffect` sync. `window.__resetHaul()` available in console. Graceful fallback if localStorage disabled. (SPEC-003)

#### P1 — High-Value Additions for Initial Release

- [ ] **Yard & Job Site Map** — Add an interactive map component to Field View showing the four Arizona yards and five job sites as pin markers. Clicking a pin shows assets at that location. For demo, a static map with plotted coordinates is sufficient. For production, this becomes the foundation for the telematics integration in Phase 5.
- [ ] **Status Change Notifications** — Toast/banner notification when a request status changes (e.g., "Your request REQ-008 was accepted — CAT 320 arriving July 3"). For demo, trigger on view-switch. For production, implement as browser push notifications so field users get updates without the app open.
- [ ] **Estimated Delivery / Transit Time** — Show estimated arrival time on each asset based on yard-to-jobsite distance. Hardcode transit estimates for the 4 yards × 5 job sites matrix (20 combinations). Display as "Est. arrival: ~2 hours from Tucson Yard" on asset detail and order review screens.
- [ ] **Delivery Details in Order Wizard** — Add optional delivery fields: contact name/phone, gate/access notes, preferred drop zone, site hours, unloading support needed. Reduces follow-up phone calls significantly.
- [x] ~~**Structured Decline / Delay Reasons**~~ **Done.** — 6-code dropdown (Maintenance, Unavailable Date, Cert Issue, Transport Constraint, Better Substitute, Other) + optional notes. `DECLINE_REASONS` in `data.ts`, `declineReasonCode` on `EquipmentRequest`. History shows bold label + notes. (SPEC-004)
- [x] ~~**Request Operator Service Option**~~ **Done.** — Toggle in Order Wizard Step 3 alongside fueling. `operatorRequested` field on `EquipmentRequest`. Badge on RequestCard. (SPEC-005)
- [ ] **Dispatch-Oriented Queue Grouping** — Add "Today / This Week / Future" grouping headers to Equipment Services request queue. Sort within each group by requested start date.

### Post-MVP (deferred features documented in HAUL_MVP_Plan.md)
- PM View: cost dashboards, internal vs. external spend, cost avoidance, job-level billing
- Release / extend / swap actions on active requests (equipment lifecycle management)
- Request priority levels (normal, schedule-critical, safety-critical, emergency) for queue triage
- Pre-use and return condition checks (checklist + photos for damage accountability, hour tracking)
- Vendor Library (Phase 3 — promoted from Phase 4 per ESD Spark Idea): brochures, spec sheets, training videos, pricing, recommended vendors
- Heat maps / hotspot analytics for rental trends
- Expanded equipment categories: Backhoes, Boom Lifts, Reach Forks, Trench Plates, Cameras, Specialty Tools
- Dual data model: individual asset tracking + quantity-based tracking for commodity items
- Integrated billing, usage tracking, availability forecasting
- ERP integration, telematics, multi-region expansion

---

## Key Files for Reference

| File | What It Is |
|---|---|
| `C:\Repo\haul\haul` | Project root — run `npm run dev` here |
| `src/lib/data.ts` | All mock data + TypeScript interfaces — edit here to change seed data |
| `src/lib/storage.ts` | localStorage persistence — load/save requests & sequence number, resetStorage() |
| `src/lib/theme.ts` | Sundt brand tokens — single source of truth for colors |
| `src/app/page.tsx` | App entry point — header, nav, state management |
| `public/images/` | Sundt logo + 17 equipment photos (see `HAUL_Image_Requirements.md` for manifest) |
| `HAUL_Image_Requirements.md` | Image checklist: filenames, asset ID mapping, folder structure, manufacturer source URLs |
| `/mnt/user-data/uploads/sundtTheme.js` | Original Sundt theme reference |
| `/mnt/user-data/uploads/SundtStyleGuide.jsx` | Original Sundt style guide component |
| `/mnt/user-data/outputs/HAUL_MVP_Plan.md` | Full MVP planning doc (problem, business rules, data model, demo path) |
| `/mnt/project/CodeAThon_Bardalez_HAUL_Heavy_Asset_Utilization_Logistics.docx` | Original hackathon submission |
| `ESD_Spark_Idea_2.pptx` | Original Equipment Services Spark Idea pitch — foundational vision for HAUL |
| `HAUL_FINAL_SLIDES_2.pdf` | Hackathon pitch deck — UI mockups for Field, PM, and Equipment Services views; roadmap; success metrics |

---

*Last updated: June 30, 2026. SPEC-005 (request operator service) implemented — toggle in Order Wizard Step 3, review row in Step 4, badge on RequestCard. Catalog filter UX improved: dropdown labels (TYPE / STATUS) added, status filter expanded to All/Available/Deployed/In Maintenance. SPEC-004 (structured decline reasons) implemented — dropdown with 6 reason codes in decline modal. SPEC-003 (localStorage persistence) implemented — demo survives browser refresh. SPEC-001 (responsive layout) and SPEC-011 (personalized greeting) previously completed. Pitch deck reviewed — 7 new features identified and specced (SPEC-011–017). All features use mock data per hackathon rules (no auth).*
