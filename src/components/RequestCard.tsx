"use client";

import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, ATTACHMENTS, DECLINE_REASONS, JOB_SITES, type EquipmentRequest } from "@/lib/data";
import { getOperatorCertStatus, getLocation, getTransitEstimate } from "@/lib/helpers";
import { StatusBadge, Btn, CertIndicator, cardStyle } from "@/components/ui";

interface RequestCardProps {
  req: EquipmentRequest;
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function RequestCard({ req, onAccept, onDecline }: RequestCardProps) {
  const isMobile = useBreakpoint() === "mobile";
  const asset = ASSETS.find((a) => a.id === req.assetId);
  const job = JOB_SITES.find((j) => j.id === req.jobSiteId);
  const cert = getOperatorCertStatus(req.operatorId, asset?.certRequired ?? null);
  const attNames = req.attachments
    .map((aId) => ATTACHMENTS.find((a) => a.id === aId)?.name)
    .filter(Boolean);

  const transit = asset?.location.startsWith("yard-") && req.jobSiteId
    ? getTransitEstimate(asset.location, req.jobSiteId)
    : null;

  return (
    <div style={{ ...cardStyle, padding: isMobile ? 16 : 20 }}>
      <div style={{ display: "flex", gap: isMobile ? 12 : 16, alignItems: "flex-start", flexWrap: isMobile ? "wrap" : undefined }}>
        <img src={asset?.photo} alt={asset?.name || ""} style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 11, color: S.darkGray }}>
              {req.id}
            </span>
            <StatusBadge status={req.status} />
            {req.fueling && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: S.navy,
                  backgroundColor: "#E3F0F7",
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                ⛽ {req.fuelFreq}
              </span>
            )}
            {req.operatorRequested && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: S.darkGreen || "#2E7D32",
                  backgroundColor: "#E8F5E9",
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                👷 Operator Requested
              </span>
            )}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.black90 }}>{asset?.name}</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
              gap: "4px 20px",
              marginTop: 8,
              fontSize: 12,
            }}
          >
            <div>
              <span style={{ color: S.darkGray }}>Job: </span>
              <span style={{ fontWeight: 600, color: S.black80 }}>{job?.name}</span>
            </div>
            <div>
              <span style={{ color: S.darkGray }}>By: </span>
              <span style={{ fontWeight: 600, color: S.black80 }}>{req.requestedBy}</span>
            </div>
            <div>
              <span style={{ color: S.darkGray }}>Dates: </span>
              <span style={{ fontWeight: 600, color: S.black80 }}>
                {req.startDate} → {req.endDate}
              </span>
            </div>
            {transit && (
              <div>
                <span style={{ color: S.darkGray }}>Transit: </span>
                <span style={{ fontWeight: 600, color: S.black80 }}>{transit} from {getLocation(asset!.location)}</span>
              </div>
            )}
          </div>
          {attNames.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {attNames.map((n, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    backgroundColor: S.lightQdr,
                    color: S.black70,
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <CertIndicator status={cert.status} label={cert.label} />
          </div>
          {(req.declineReasonCode || req.declineReason) && (
            <div
              style={{
                fontSize: 11,
                color: S.black70,
                marginTop: 8,
                backgroundColor: S.black5,
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              {req.declineReasonCode && (
                <span style={{ fontWeight: 700 }}>
                  {DECLINE_REASONS.find((r) => r.code === req.declineReasonCode)?.label ?? req.declineReasonCode}
                </span>
              )}
              {req.declineReasonCode && req.declineReason && " \u2014 "}
              {req.declineReason}
            </div>
          )}
        </div>

        {/* Actions */}
        {req.status === "Pending" && onAccept && (
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 6, flexShrink: 0, ...(isMobile ? { width: "100%", marginTop: 12 } : {}) }}>
            <Btn
              variant="submit"
              onClick={onAccept}
              style={{ padding: "8px 16px", fontSize: 12, ...(isMobile ? { flex: 1 } : {}) }}
            >
              Accept
            </Btn>
            <Btn
              variant="secondary"
              onClick={onDecline}
              style={{ padding: "8px 16px", fontSize: 12, color: S.black70, ...(isMobile ? { flex: 1 } : {}) }}
            >
              Decline
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
