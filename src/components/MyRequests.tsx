"use client";

import { CSSProperties, useState } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, JOB_SITES, type EquipmentRequest } from "@/lib/data";
import { StatusBadge, BackBtn, cardStyle } from "@/components/ui";

interface MyRequestsProps {
  requests: EquipmentRequest[];
  onBack: () => void;
}

const TIMELINE_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "Pending": return 1;    // Under Review
    case "Accepted": return 2;   // Approved
    case "In Transit": return 3; // In Transit
    case "Delivered": return 4;  // Delivered (final)
    default: return 0;           // Submitted (fallback)
  }
}

function RequestTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);
  const isMob = useBreakpoint() === "mobile";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "14px 0 4px", width: "100%" }}>
      {TIMELINE_STEPS.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;

        const circleColor = isCompleted ? S.submitGreen
          : isCurrent ? S.navy
          : S.black20;
        const lineColor = isCompleted ? S.submitGreen : S.black20;
        const labelColor = isCompleted ? S.darkGreen
          : isCurrent ? S.navy
          : S.darkGray;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < TIMELINE_STEPS.length - 1 ? 1 : "none" }}>
            {/* Step circle + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: isMob ? 36 : 56 }}>
              <div style={{
                width: isCurrent ? 14 : 10,
                height: isCurrent ? 14 : 10,
                borderRadius: "50%",
                backgroundColor: circleColor,
                border: isCurrent ? `2px solid ${S.navy}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isCompleted && (
                  <span style={{ color: S.white, fontSize: 7, fontWeight: 700 }}>✓</span>
                )}
              </div>
              <span style={{ fontSize: isMob ? 8 : 9, color: labelColor, fontWeight: isCurrent ? 700 : 400, marginTop: 4, textAlign: "center", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {/* Connecting line */}
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, backgroundColor: lineColor, marginTop: -14 /* Align with circles, not labels */ }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyRequests({ requests, onBack }: MyRequestsProps) {
  const isMobile = useBreakpoint() === "mobile";
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
  
  return (
    <div>
      <BackBtn onClick={onBack} label="Back to catalog" />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: S.black90, marginBottom: 20 }}>
        My Requests
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {requests.map((req) => {
          const asset = ASSETS.find((a) => a.id === req.assetId);
          const job = JOB_SITES.find((j) => j.id === req.jobSiteId);
          const hasDeliveryDetails = req.deliveryContact || req.deliveryNotes || req.deliveryDropZone || req.siteHours || req.unloadingSupport;
          const isExpanded = expandedDelivery === req.id;
          
          return (
            <div
              key={req.id}
              style={{ ...cardStyle, padding: isMobile ? 16 : 20 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 16 }}>
                <img src={asset?.photo} alt={asset?.name || ""} style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
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
                  <div style={{ fontSize: 15, fontWeight: 700, color: S.black90 }}>
                    {asset?.name}
                  </div>
                  <div style={{ fontSize: 12, color: S.black70, marginTop: 2 }}>
                    {job?.name} · {req.startDate} → {req.endDate}
                  </div>
                  {req.status !== "Declined" && (
                    <RequestTimeline status={req.status} />
                  )}
                  {req.declineReason && (
                    <div
                      style={{
                        fontSize: 11,
                        color: S.black70,
                        marginTop: 6,
                        backgroundColor: S.black5,
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: 4,
                      }}
                    >
                      Reason: {req.declineReason}
                    </div>
                  )}
                  {hasDeliveryDetails && (
                    <div style={{ marginTop: 12, borderTop: `1px solid ${S.qdrGray}`, paddingTop: 12 }}>
                      <button
                        onClick={() => setExpandedDelivery(isExpanded ? null : req.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: S.navy,
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        📦 Delivery details {isExpanded ? "▼" : "▶"}
                      </button>
                      {isExpanded && (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                          {req.deliveryContact && (
                            <div>
                              <span style={{ color: S.darkGray }}>Contact: </span>
                              <span style={{ fontWeight: 500, color: S.black80 }}>{req.deliveryContact}</span>
                            </div>
                          )}
                          {req.siteHours && (
                            <div>
                              <span style={{ color: S.darkGray }}>Hours: </span>
                              <span style={{ fontWeight: 500, color: S.black80 }}>{req.siteHours}</span>
                            </div>
                          )}
                          {req.deliveryDropZone && (
                            <div>
                              <span style={{ color: S.darkGray }}>Drop zone: </span>
                              <span style={{ fontWeight: 500, color: S.black80 }}>{req.deliveryDropZone}</span>
                            </div>
                          )}
                          {req.deliveryNotes && (
                            <div>
                              <span style={{ color: S.darkGray }}>Access/Gate: </span>
                              <span style={{ fontWeight: 500, color: S.black80 }}>{req.deliveryNotes}</span>
                            </div>
                          )}
                          {req.unloadingSupport && (
                            <div>
                              <span style={{ color: S.darkGray }}>Unloading support: </span>
                              <span style={{ fontWeight: 500, color: S.darkGreen || "#2E7D32" }}>Yes</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 11, color: S.darkGray, marginTop: 12, textAlign: isMobile ? "left" : "right" }}>
                {new Date(req.submittedAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
