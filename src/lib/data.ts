// ═══════════════════════════════════════════════════════════
// MOCK DATA — shaped like real Sundt Equipment Services data
// ═══════════════════════════════════════════════════════════

export interface Yard {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface JobSite {
  id: string;
  name: string;
  pm: string;
  code: string;
  lat: number;
  lng: number;
}

export interface Attachment {
  id: string;
  name: string;
  compatibleTypes: string[];
}

export interface Operator {
  id: string;
  name: string;
  certifications: string[];
  status: "Current" | "Expired";
  expiry: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  make: string;
  model: string;
  year: number;
  specs: Record<string, string>;
  location: string;
  status: "Available" | "Deployed" | "In Maintenance";
  readyDate: string;
  certRequired: string | null;
  photo: string;
  rate: number;
}

export interface EquipmentRequest {
  id: string;
  assetId: string;
  jobSiteId: string;
  requestedBy: string;
  startDate: string;
  endDate: string;
  attachments: string[];
  fueling: boolean;
  fuelFreq: string | null;
  operatorId: string | null;
  operatorRequested?: boolean;
  status: "Pending" | "Accepted" | "Declined" | "In Transit";
  submittedAt: string;
  declineReason?: string;
  declineReasonCode?: string;
  deliveryAddress?: string;
  deliveryContact?: string;
  deliveryNotes?: string;
  deliveryDropZone?: string;
  siteHours?: string;
  unloadingSupport?: boolean;
}

// ── Decline Reason Codes ────────────────────────────────

export const DECLINE_REASONS = [
  { code: "maintenance", label: "Asset in Maintenance" },
  { code: "unavailable_date", label: "Unavailable for Requested Dates" },
  { code: "cert_issue", label: "Operator Certification Issue" },
  { code: "transport", label: "Transport Constraint" },
  { code: "better_substitute", label: "Better Substitute Available" },
  { code: "other", label: "Other" },
] as const;

// ── Yards ───────────────────────────────────────────────

export const YARDS: Yard[] = [
  { id: "yard-1", name: "Tempe Yard", city: "Tempe, AZ", lat: 33.4255, lng: -111.9400 },
  { id: "yard-2", name: "Tucson Yard", city: "Tucson, AZ", lat: 32.2226, lng: -110.9747 },
  { id: "yard-3", name: "Chandler Yard", city: "Chandler, AZ", lat: 33.3062, lng: -111.8413 },
  { id: "yard-4", name: "Mesa Yard", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315 },
];

// ── Job Sites ───────────────────────────────────────────

export const JOB_SITES: JobSite[] = [
  { id: "job-1", name: "I-10 Broadway Curve", pm: "Martinez", code: "AZ-2026-041", lat: 33.3933, lng: -111.9780 },
  { id: "job-2", name: "Chandler Municipal Center", pm: "Johnson", code: "AZ-2026-018", lat: 33.3028, lng: -111.8414 },
  { id: "job-3", name: "Tucson Water Reclamation", pm: "Davis", code: "AZ-2026-033", lat: 32.1800, lng: -110.9500 },
  { id: "job-4", name: "Mesa Light Rail Extension", pm: "Thompson", code: "AZ-2026-027", lat: 33.4148, lng: -111.7890 },
  { id: "job-5", name: "ASU Research Campus", pm: "Wilson", code: "AZ-2026-052", lat: 33.4242, lng: -111.9281 },
];

// ── Attachments ─────────────────────────────────────────

export const ATTACHMENTS: Attachment[] = [
  { id: "att-1", name: "Thumb Bucket", compatibleTypes: ["Excavator"] },
  { id: "att-2", name: '36" Digging Bucket', compatibleTypes: ["Excavator"] },
  { id: "att-3", name: '48" Grading Bucket', compatibleTypes: ["Excavator", "Loader"] },
  { id: "att-4", name: "Pallet Forks", compatibleTypes: ["Skid Steer", "Loader", "Telehandler"] },
  { id: "att-5", name: "Auger", compatibleTypes: ["Skid Steer"] },
  { id: "att-6", name: "Breaker / Hammer", compatibleTypes: ["Excavator"] },
  { id: "att-7", name: "Sweeper", compatibleTypes: ["Skid Steer"] },
  { id: "att-8", name: "Grapple", compatibleTypes: ["Skid Steer", "Excavator"] },
];

// ── Operators ───────────────────────────────────────────

export const OPERATORS: Operator[] = [
  { id: "op-1", name: "Mike Rodriguez", certifications: ["Excavator", "Loader"], status: "Current", expiry: "2027-03-15" },
  { id: "op-2", name: "Sarah Chen", certifications: ["Crane", "Excavator"], status: "Current", expiry: "2026-07-18" },  // Expiring soon — within 30 days of demo date
  { id: "op-3", name: "James Walker", certifications: ["Skid Steer"], status: "Expired", expiry: "2026-01-10" },
  { id: "op-4", name: "David Martinez", certifications: ["Dozer", "Loader", "Excavator"], status: "Current", expiry: "2026-11-01" },
  { id: "op-5", name: "Lisa Thompson", certifications: ["Generator", "Crane"], status: "Current", expiry: "2027-06-30" },
];

// ── Assets (23 items across 15 types) ────────────────────

export const ASSETS: Asset[] = [
  { id: "asset-1", name: "CAT 320 Excavator", type: "Excavator", make: "Caterpillar", model: "320", year: 2022, specs: { weight: "49,600 lb", hp: "162 HP", digDepth: "22 ft", bucketCap: "1.54 yd³" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: "Excavator", photo: "/images/equipment/cat-320-excavator.jpg", rate: 1850 },
  { id: "asset-2", name: "CAT 330 Excavator", type: "Excavator", make: "Caterpillar", model: "330", year: 2021, specs: { weight: "69,200 lb", hp: "204 HP", digDepth: "24 ft", bucketCap: "2.0 yd³" }, location: "job-1", status: "Deployed", readyDate: "2026-07-18", certRequired: "Excavator", photo: "/images/equipment/cat-330-excavator.jpg", rate: 2200 },
  { id: "asset-3", name: "John Deere 350G Excavator", type: "Excavator", make: "John Deere", model: "350G", year: 2023, specs: { weight: "79,100 lb", hp: "271 HP", digDepth: "25 ft", bucketCap: "2.35 yd³" }, location: "yard-2", status: "Available", readyDate: "2026-06-30", certRequired: "Excavator", photo: "/images/equipment/jd-350g-excavator.jpg", rate: 2400 },
  { id: "asset-4", name: "CAT 259D Skid Steer", type: "Skid Steer", make: "Caterpillar", model: "259D3", year: 2023, specs: { weight: "9,400 lb", hp: "74.3 HP", ratedCap: "2,150 lb", liftHeight: "10.1 ft" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: "Skid Steer", photo: "/images/equipment/cat-259d-skidsteer.jpg", rate: 750 },
  { id: "asset-5", name: "John Deere 333G Skid Steer", type: "Skid Steer", make: "John Deere", model: "333G", year: 2022, specs: { weight: "11,575 lb", hp: "100 HP", ratedCap: "3,350 lb", liftHeight: "10.9 ft" }, location: "yard-3", status: "Available", readyDate: "2026-06-30", certRequired: "Skid Steer", photo: "/images/equipment/jd-333g-skidsteer.jpg", rate: 850 },
  { id: "asset-6", name: "Bobcat T770 Skid Steer", type: "Skid Steer", make: "Bobcat", model: "T770", year: 2021, specs: { weight: "11,690 lb", hp: "92 HP", ratedCap: "3,475 lb", liftHeight: "11.1 ft" }, location: "job-3", status: "Deployed", readyDate: "2026-07-25", certRequired: "Skid Steer", photo: "/images/equipment/bobcat-t770-skidsteer.jpg", rate: 800 },
  { id: "asset-7", name: "CAT 950 Wheel Loader", type: "Loader", make: "Caterpillar", model: "950M", year: 2022, specs: { weight: "40,700 lb", hp: "223 HP", bucketCap: "4.5 yd³", breakoutForce: "38,700 lb" }, location: "yard-4", status: "Available", readyDate: "2026-06-30", certRequired: "Loader", photo: "/images/equipment/cat-950m-loader.jpg", rate: 1600 },
  { id: "asset-8", name: "Volvo L90 Wheel Loader", type: "Loader", make: "Volvo", model: "L90H", year: 2023, specs: { weight: "35,500 lb", hp: "195 HP", bucketCap: "3.8 yd³", breakoutForce: "32,400 lb" }, location: "yard-2", status: "In Maintenance", readyDate: "2026-07-10", certRequired: "Loader", photo: "/images/equipment/volvo-l90h-loader.jpg", rate: 1500 },
  { id: "asset-9", name: "Liebherr LTM 1060 Crane", type: "Crane", make: "Liebherr", model: "LTM 1060-3.1", year: 2020, specs: { maxCap: "60 tons", maxBoom: "148 ft", maxRadius: "130 ft", counterweight: "17,600 lb" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: "Crane", photo: "/images/equipment/liebherr-ltm1060-crane.jpg", rate: 4500 },
  { id: "asset-10", name: "Grove GMK3060 Crane", type: "Crane", make: "Grove", model: "GMK3060L", year: 2021, specs: { maxCap: "60 tons", maxBoom: "141 ft", maxRadius: "125 ft", counterweight: "15,400 lb" }, location: "job-2", status: "Deployed", readyDate: "2026-08-01", certRequired: "Crane", photo: "/images/equipment/grove-gmk3060-crane.jpg", rate: 4200 },
  { id: "asset-11", name: "CAT XQ200 Generator", type: "Generator", make: "Caterpillar", model: "XQ200", year: 2022, specs: { power: "200 kW", voltage: "480V", fuelCap: "245 gal", runtime: "24 hrs" }, location: "yard-3", status: "Available", readyDate: "2026-06-30", certRequired: "Generator", photo: "/images/equipment/cat-xq200-generator.jpg", rate: 600 },
  { id: "asset-12", name: "Generac MDG150 Generator", type: "Generator", make: "Generac", model: "MDG150", year: 2023, specs: { power: "150 kW", voltage: "480V", fuelCap: "200 gal", runtime: "20 hrs" }, location: "yard-4", status: "Available", readyDate: "2026-06-30", certRequired: "Generator", photo: "/images/equipment/generac-mdg150-generator.jpg", rate: 500 },
  { id: "asset-13", name: "CAT D6 Dozer", type: "Dozer", make: "Caterpillar", model: "D6", year: 2022, specs: { weight: "44,400 lb", hp: "215 HP", bladeWidth: "12.3 ft", bladeCap: "6.4 yd³" }, location: "yard-2", status: "In Maintenance", readyDate: "2026-07-05", certRequired: "Dozer", photo: "/images/equipment/cat-d6-dozer.jpg", rate: 2000 },
  { id: "asset-14", name: "John Deere 700K Dozer", type: "Dozer", make: "John Deere", model: "700K", year: 2021, specs: { weight: "22,500 lb", hp: "115 HP", bladeWidth: "10.1 ft", bladeCap: "3.8 yd³" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: "Dozer", photo: "/images/equipment/jd-700k-dozer.jpg", rate: 1400 },
  { id: "asset-15", name: "JLG 1055 Telehandler", type: "Telehandler", make: "JLG", model: "1055", year: 2023, specs: { maxCap: "10,000 lb", maxHeight: "55 ft", maxReach: "42 ft", hp: "120 HP" }, location: "yard-4", status: "Available", readyDate: "2026-06-30", certRequired: "Loader", photo: "/images/equipment/jlg-1055-telehandler.jpg", rate: 1100 },
  { id: "asset-16", name: "CAT CS56B Compactor", type: "Compactor", make: "Caterpillar", model: "CS56B", year: 2022, specs: { weight: "26,800 lb", hp: "154 HP", drumWidth: "84 in", centForce: "56,000 lb" }, location: "job-4", status: "Deployed", readyDate: "2026-07-20", certRequired: "Loader", photo: "/images/equipment/cat-cs56b-compactor.jpg", rate: 900 },
  { id: "asset-17", name: "Wacker LTN6L Light Tower", type: "Light Tower", make: "Wacker Neuson", model: "LTN6L", year: 2023, specs: { lights: "4 x 1000W", height: "30 ft", fuelCap: "30 gal", runtime: "60 hrs" }, location: "yard-3", status: "Available", readyDate: "2026-06-30", certRequired: null, photo: "/images/equipment/wacker-ltn6l-lighttower.jpg", rate: 150 },
  // ── Expanded categories (per ESD Spark Idea) ──
  { id: "asset-18", name: "CAT 420 Backhoe", type: "Backhoe", make: "Caterpillar", model: "420", year: 2022, specs: { weight: "24,200 lb", hp: "93 HP", digDepth: "14.3 ft", bucketCap: "1.31 yd³" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: "Loader", photo: "/images/equipment/cat-420-backhoe.jpg", rate: 950 },
  { id: "asset-19", name: "JLG 600S Boom Lift", type: "Boom Lift", make: "JLG", model: "600S", year: 2023, specs: { maxHeight: "60 ft", maxReach: "40.5 ft", capacity: "500 lb", weight: "25,350 lb" }, location: "yard-4", status: "Available", readyDate: "2026-06-30", certRequired: "Boom Lift", photo: "/images/equipment/jlg-600s-boomlift.jpg", rate: 700 },
  { id: "asset-20", name: "CAT TH357D Reach Fork", type: "Reach Fork", make: "Caterpillar", model: "TH357D", year: 2022, specs: { maxCap: "7,000 lb", maxHeight: "57 ft", maxReach: "42 ft", hp: "120 HP" }, location: "yard-2", status: "Deployed", readyDate: "2026-07-15", certRequired: "Loader", photo: "/images/equipment/cat-th357d-reachfork.jpg", rate: 1050 },
  { id: "asset-21", name: "Steel Trench Plate 8'\u00d716'", type: "Trench Plate", make: "RoadPlate", model: "8x16-1.0", year: 2021, specs: { size: "8' \u00d7 16'", thickness: "1.0 in", weight: "3,270 lb", material: "A36 Steel" }, location: "yard-1", status: "Available", readyDate: "2026-06-30", certRequired: null, photo: "/images/equipment/roadplate-trenchplate.jpg", rate: 85 },
  { id: "asset-22", name: "Sensera MC30 Site Camera", type: "Camera", make: "Sensera", model: "MC30", year: 2024, specs: { resolution: "30 MP", connectivity: "4G LTE", power: "Solar", storage: "Cloud" }, location: "yard-3", status: "Available", readyDate: "2026-06-30", certRequired: null, photo: "/images/equipment/sensera-mc30-camera.jpg", rate: 200 },
  { id: "asset-23", name: "Hilti TE 70-ATC Rotary Hammer", type: "Specialty Tool", make: "Hilti", model: "TE 70-ATC", year: 2023, specs: { weight: "18.5 lb", power: "1,600W", impact: "11.5 ft-lb", chuckType: "SDS-max" }, location: "yard-4", status: "Available", readyDate: "2026-06-30", certRequired: null, photo: "/images/equipment/hilti-te70-rotaryhammer.jpg", rate: 65 },
];

// ── Seed Requests ───────────────────────────────────────

export const INITIAL_REQUESTS: EquipmentRequest[] = [
  { id: "REQ-001", assetId: "asset-1", jobSiteId: "job-1", requestedBy: "Tom Bradley", startDate: "2026-07-02", endDate: "2026-07-16", attachments: ["att-1"], fueling: true, fuelFreq: "Weekly", operatorId: "op-1", status: "Pending", submittedAt: "2026-06-28T09:15:00" },
  { id: "REQ-002", assetId: "asset-5", jobSiteId: "job-2", requestedBy: "Carlos Vega", startDate: "2026-07-01", endDate: "2026-07-14", attachments: ["att-4"], fueling: false, fuelFreq: null, operatorId: "op-3", status: "Accepted", submittedAt: "2026-06-27T14:30:00" },
  { id: "REQ-003", assetId: "asset-11", jobSiteId: "job-3", requestedBy: "Rachel Kim", startDate: "2026-07-05", endDate: "2026-08-05", attachments: [], fueling: true, fuelFreq: "Bi-Weekly", operatorId: null, status: "Pending", submittedAt: "2026-06-28T11:00:00" },
  { id: "REQ-004", assetId: "asset-13", jobSiteId: "job-4", requestedBy: "Derek Owens", startDate: "2026-07-01", endDate: "2026-07-21", attachments: [], fueling: true, fuelFreq: "Weekly", operatorId: "op-4", status: "Declined", submittedAt: "2026-06-26T08:45:00", declineReasonCode: "maintenance", declineReason: "Asset not available until 7/5 — rescheduled to 7/7 start" },
  { id: "REQ-005", assetId: "asset-6", jobSiteId: "job-5", requestedBy: "Anna Lopez", startDate: "2026-07-10", endDate: "2026-07-24", attachments: ["att-4", "att-7"], fueling: false, fuelFreq: null, operatorId: "op-3", status: "Accepted", submittedAt: "2026-06-25T16:20:00" },
  { id: "REQ-006", assetId: "asset-9", jobSiteId: "job-1", requestedBy: "Tom Bradley", startDate: "2026-07-08", endDate: "2026-07-22", attachments: [], fueling: true, fuelFreq: "Weekly", operatorId: "op-2", status: "Pending", submittedAt: "2026-06-29T07:30:00" },
  { id: "REQ-007", assetId: "asset-7", jobSiteId: "job-2", requestedBy: "Carlos Vega", startDate: "2026-07-03", endDate: "2026-07-17", attachments: ["att-3"], fueling: true, fuelFreq: "Weekly", operatorId: "op-4", status: "In Transit", submittedAt: "2026-06-24T10:00:00" },
];

// ── Mock User (hackathon — no auth) ────────────────────

export const MOCK_USER = {
  name: "Alex",
  role: "Field Supervisor",
  jobSite: "I-10 Broadway Curve",
};

// ── Transit Time Matrix (yard → job site, in minutes) ────

export const TRANSIT_MINUTES: Record<string, Record<string, number>> = {
  "yard-1": { "job-1": 20, "job-2": 35, "job-3": 120, "job-4": 30, "job-5": 15 },
  "yard-2": { "job-1": 120, "job-2": 130, "job-3": 15, "job-4": 115, "job-5": 125 },
  "yard-3": { "job-1": 30, "job-2": 10, "job-3": 125, "job-4": 25, "job-5": 35 },
  "yard-4": { "job-1": 25, "job-2": 30, "job-3": 115, "job-4": 10, "job-5": 20 },
};

// ── Category Cards for Browse View ────────────────────────

export const CATEGORY_CARDS: { type: string; label: string; image: string }[] = [
  { type: "Excavator", label: "Excavators", image: "/images/equipment/cat-320-excavator.jpg" },
  { type: "Skid Steer", label: "Skid Steers", image: "/images/equipment/cat-259d-skidsteer.jpg" },
  { type: "Loader", label: "Loaders", image: "/images/equipment/cat-950m-loader.jpg" },
  { type: "Crane", label: "Cranes", image: "/images/equipment/liebherr-ltm1060-crane.jpg" },
  { type: "Dozer", label: "Dozers", image: "/images/equipment/cat-d6-dozer.jpg" },
  { type: "Boom Lift", label: "Boom Lifts", image: "/images/equipment/jlg-600s-boomlift.jpg" },
  { type: "Generator", label: "Generators", image: "/images/equipment/cat-xq200-generator.jpg" },
  { type: "Compactor", label: "Compaction", image: "/images/equipment/cat-cs56b-compactor.jpg" },
];

// ── Filter categories ───────────────────────────────────

// ── Upcoming Maintenance Schedule (SPEC-016) ────────────

export interface MaintenanceSchedule {
  assetId: string;
  type: "PM Service" | "Inspection" | "Repair" | "Cert Renewal";
  dueDate: string;
  notes?: string;
}

export const UPCOMING_MAINTENANCE: MaintenanceSchedule[] = [
  { assetId: "asset-13", type: "PM Service", dueDate: "2026-07-04", notes: "500-hour service" },
  { assetId: "asset-2", type: "PM Service", dueDate: "2026-07-09" },
  { assetId: "asset-19", type: "Inspection", dueDate: "2026-07-11" },
  { assetId: "asset-8", type: "PM Service", dueDate: "2026-07-14" },
  { assetId: "asset-6", type: "Inspection", dueDate: "2026-07-17" },
];

export const CATEGORIES = [
  "All", "Excavator", "Skid Steer", "Loader", "Crane",
  "Generator", "Dozer", "Telehandler", "Compactor", "Light Tower",
  "Backhoe", "Boom Lift", "Reach Fork", "Trench Plate", "Camera", "Specialty Tool",
];

export const CERT_TYPES = [
  "Excavator", "Skid Steer", "Loader", "Crane",
  "Generator", "Dozer", "Boom Lift",
] as const;
