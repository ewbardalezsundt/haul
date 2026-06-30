import { YARDS, JOB_SITES, ATTACHMENTS, OPERATORS } from "./data";

export function getLocation(locId: string): string {
  const yard = YARDS.find((y) => y.id === locId);
  if (yard) return yard.name;
  const job = JOB_SITES.find((j) => j.id === locId);
  if (job) return job.name;
  return locId;
}

export function getCompatibleAttachments(assetType: string) {
  return ATTACHMENTS.filter((a) => a.compatibleTypes.includes(assetType));
}

export interface CertStatus {
  status: "valid" | "expired" | "missing" | "unknown" | "none";
  label: string;
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
