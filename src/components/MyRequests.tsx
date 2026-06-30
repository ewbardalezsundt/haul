"use client";

import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, JOB_SITES, type EquipmentRequest } from "@/lib/data";
import { StatusBadge, BackBtn, cardStyle } from "@/components/ui";

interface MyRequestsProps {
  requests: EquipmentRequest[];
  onBack: () => void;
}

export default function MyRequests({ requests, onBack }: MyRequestsProps) {
  const isMobile = useBreakpoint() === "mobile";
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
          return (
            <div
              key={req.id}
              style={{ ...cardStyle, padding: isMobile ? 16 : 20, display: "flex", alignItems: "center", gap: isMobile ? 12 : 16 }}
            >
              <img src={asset?.photo} alt={asset?.name || ""} style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: S.darkGray }}>
                    {req.id}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: S.black90, marginTop: 4 }}>
                  {asset?.name}
                </div>
                <div style={{ fontSize: 12, color: S.black70, marginTop: 2 }}>
                  {job?.name} · {req.startDate} → {req.endDate}
                </div>
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
              </div>
              <div style={{ fontSize: 11, color: S.darkGray, flexShrink: 0 }}>
                {new Date(req.submittedAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
