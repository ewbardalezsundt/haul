import { YARDS, JOB_SITES, ATTACHMENTS, OPERATORS, TRANSIT_MINUTES, type Asset } from "./data";

export function getLocation(locId: string): string {
  const yard = YARDS.find((y) => y.id === locId);
  if (yard) return yard.name;
  const job = JOB_SITES.find((j) => j.id === locId);
  if (job) return job.name;
  return locId;
}

export function getSubstitutes(asset: Asset, allAssets: Asset[], maxResults = 3): Asset[] {
  return allAssets
    .filter(a =>
      a.id !== asset.id &&          // Not the same asset
      a.type === asset.type &&       // Same type
      a.status === "Available"       // Must be available
    )
    .sort((a, b) => {
      // Prefer same yard, then nearest yard, then by rate similarity
      const aYardMatch = a.location === asset.location ? 0 : 1;
      const bYardMatch = b.location === asset.location ? 0 : 1;
      if (aYardMatch !== bYardMatch) return aYardMatch - bYardMatch;
      return Math.abs(a.rate - asset.rate) - Math.abs(b.rate - asset.rate);
    })
    .slice(0, maxResults);
}

export function getCompatibleAttachments(assetType: string) {
  return ATTACHMENTS.filter((a) => a.compatibleTypes.includes(assetType));
}

export interface CertStatus {
  status: "valid" | "expired" | "missing" | "unknown" | "none";
  label: string;
}

export function getTransitEstimate(yardId: string, jobSiteId: string): string | null {
  const minutes = TRANSIT_MINUTES[yardId]?.[jobSiteId];
  if (!minutes) return null;
  if (minutes < 60) return `~${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`;
}

export function getTransitRange(yardId: string): string | null {
  const row = TRANSIT_MINUTES[yardId];
  if (!row) return null;
  const vals = Object.values(row);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (min < 60 && max < 60) return `~${min}–${max} min`;
  const fmtMin = min < 60 ? `${min} min` : `${Math.floor(min / 60)}h`;
  const fmtMax = max < 60 ? `${max} min` : `${Math.floor(max / 60)}h`;
  return `~${fmtMin}–${fmtMax}`;
}

export function getOperatorCertStatus(
  operatorId: string | null,
  requiredCert: string | null
): CertStatus {
  if (!requiredCert) return { status: "none", label: "No cert required" };
  if (!operatorId) return { status: "unknown", label: "No operator assigned" };
  const op = OPERATORS.find((o) => o.id === operatorId);
  if (!op) return { status: "unknown", label: "Operator not found" };
  if (!op.certifications.includes(requiredCert))
    return { status: "missing", label: `Not certified for ${requiredCert}` };
  if (op.status === "Expired")
    return { status: "expired", label: `${requiredCert} cert expired ${op.expiry}` };
  return { status: "valid", label: `${op.name} — Certified (exp ${op.expiry})` };
}
