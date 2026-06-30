"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, type EquipmentRequest } from "@/lib/data";
import { Btn, cardStyle, inputStyle } from "@/components/ui";
import RequestCard from "@/components/RequestCard";
import FleetOverview from "@/components/FleetOverview";

interface EquipServicesViewProps {
  requests: EquipmentRequest[];
  updateRequestStatus: (reqId: string, status: string, reason?: string) => void;
}

export default function EquipServicesView({
  requests,
  updateRequestStatus,
}: EquipServicesViewProps) {
  const [tab, setTab] = useState("queue");
  const [declineReqId, setDeclineReqId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const pending = requests.filter((r) => r.status === "Pending");
  const active = requests.filter((r) => ["Accepted", "In Transit"].includes(r.status));
  const closed = requests.filter((r) => r.status === "Declined");

  const stats = [
    { label: "Total Fleet", value: ASSETS.length, accent: S.red },
    { label: "Available", value: ASSETS.filter((a) => a.status === "Available").length, accent: S.green },
    { label: "Deployed", value: ASSETS.filter((a) => a.status === "Deployed").length, accent: S.navy },
    { label: "In Maintenance", value: ASSETS.filter((a) => a.status === "In Maintenance").length, accent: S.yellow },
    { label: "Pending Requests", value: pending.length, accent: S.blue },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: S.black90, marginBottom: 20 }}>
        Equipment Services Dashboard
      </h1>

      {/* KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={s.label}
            style={{
              ...cardStyle,
              borderTop: `3px solid ${s.accent}`,
              padding: isMobile ? 12 : 16,
              ...(isMobile && idx === stats.length - 1 ? { gridColumn: "1 / -1" } : {}),
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: S.black70,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 800, color: S.black90, marginTop: 4 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          backgroundColor: S.lightQdr,
          borderRadius: 8,
          padding: 3,
          marginBottom: 20,
          width: isMobile ? "100%" : "fit-content",
          overflowX: isMobile ? "auto" : undefined,
          WebkitOverflowScrolling: "touch" as never,
        }}
      >
        {[
          { key: "queue", label: isMobile ? `Queue (${pending.length})` : `Request Queue (${pending.length})` },
          { key: "fleet", label: "Fleet" },
          { key: "active", label: `Active (${active.length})` },
          { key: "history", label: "History" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: isMobile ? "8px 10px" : "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              minHeight: 44,
              flex: isMobile ? 1 : undefined,
              backgroundColor: tab === t.key ? S.white : "transparent",
              color: tab === t.key ? S.black90 : S.black70,
              boxShadow: tab === t.key ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Decline modal */}
      {declineReqId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 16,
          }}
        >
          <div style={{ ...cardStyle, maxWidth: isMobile ? "calc(100vw - 32px)" : 440, width: "100%", padding: isMobile ? 20 : 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.black90, margin: "0 0 12px" }}>
              Decline Request {declineReqId}
            </h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining (e.g., asset in maintenance)..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? undefined : "flex-end", gap: 8, marginTop: 16 }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  setDeclineReqId(null);
                  setDeclineReason("");
                }}
                style={isMobile ? { width: "100%", order: 2 } : undefined}
              >
                Cancel
              </Btn>
              <Btn
                variant="destructive"
                onClick={() => {
                  updateRequestStatus(declineReqId, "Declined", declineReason);
                  setDeclineReqId(null);
                  setDeclineReason("");
                }}
                style={isMobile ? { width: "100%", order: 1 } : undefined}
              >
                Decline
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Tab content */}
      {tab === "queue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.length === 0 && <Empty msg="No pending requests" />}
          {pending.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              onAccept={() => updateRequestStatus(req.id, "Accepted")}
              onDecline={() => setDeclineReqId(req.id)}
            />
          ))}
        </div>
      )}
      {tab === "fleet" && <FleetOverview />}
      {tab === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {active.length === 0 && <Empty msg="No active requests" />}
          {active.map((req) => (
            <RequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {closed.length === 0 && <Empty msg="No history" />}
          {closed.map((req) => (
            <RequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ textAlign: "center", padding: 48, color: S.darkGray, fontSize: 13 }}>{msg}</div>
  );
}
