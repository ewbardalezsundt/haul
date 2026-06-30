"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, DECLINE_REASONS, type EquipmentRequest } from "@/lib/data";
import { Btn, cardStyle, inputStyle } from "@/components/ui";
import RequestCard from "@/components/RequestCard";
import FleetOverview from "@/components/FleetOverview";

// Demo reference date — matches seed data window so 2+ groups are visible
const DEMO_TODAY = "2026-07-02";

function groupByTimeHorizon(requests: EquipmentRequest[]) {
  const today = DEMO_TODAY;
  const d = new Date(today + "T00:00:00");
  d.setDate(d.getDate() + 7);
  const weekEnd = d.toISOString().slice(0, 10);

  const sorted = [...requests].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return {
    today: sorted.filter((r) => r.startDate <= today),
    thisWeek: sorted.filter((r) => r.startDate > today && r.startDate <= weekEnd),
    future: sorted.filter((r) => r.startDate > weekEnd),
  };
}

function GroupHeader({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 0",
        borderLeft: `3px solid ${color}`,
        paddingLeft: 12,
        marginTop: 8,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: S.black90 }}>{label}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          backgroundColor: color + "20",
          color,
          borderRadius: 10,
          padding: "2px 8px",
        }}
      >
        {count}
      </span>
    </div>
  );
}

interface EquipServicesViewProps {
  requests: EquipmentRequest[];
  updateRequestStatus: (reqId: string, status: string, reason?: string, reasonCode?: string) => void;
}

export default function EquipServicesView({
  requests,
  updateRequestStatus,
}: EquipServicesViewProps) {
  const [tab, setTab] = useState("queue");
  const [declineReqId, setDeclineReqId] = useState<string | null>(null);
  const [declineCode, setDeclineCode] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const pending = requests.filter((r) => r.status === "Pending");
  const active = requests.filter((r) => ["Accepted", "In Transit"].includes(r.status));
  const closed = requests.filter((r) => r.status === "Declined");

  // --- Richer KPIs (SPEC-014) ---
  const total = ASSETS.length;
  const deployed = ASSETS.filter((a) => a.status === "Deployed").length;
  const utilization = Math.round((deployed / total) * 100);
  const totalRequests = requests.length;
  const fulfilled = requests.filter((r) => ["Accepted", "In Transit"].includes(r.status)).length;
  const fillRate = totalRequests > 0 ? Math.round((fulfilled / totalRequests) * 100) : 0;

  // Mock trend data — hardcoded per hackathon rules (no historical data)
  const stats: { label: string; value: string | number; sub: string; accent: string; trend?: string }[] = [
    { label: "Internal Fill Rate", value: `${fillRate}%`, sub: "This Month", accent: S.red, trend: "\u25B2 9% vs last month" },
    { label: "Active Requests", value: pending.length + active.length, sub: `${pending.length} Pending Approval`, accent: S.navy },
    { label: "Equipment Utilization", value: `${utilization}%`, sub: "This Month", accent: S.green, trend: "\u25B2 7% vs last month" },
    { label: "Total Fleet", value: total, sub: "Total Assets", accent: S.black80 },
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
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              ...cardStyle,
              borderTop: `3px solid ${s.accent}`,
              padding: isMobile ? 12 : 16,
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
            <div style={{ fontSize: 11, color: S.black70, marginTop: 2 }}>
              {s.sub}
            </div>
            {s.trend && (
              <div style={{ fontSize: 11, fontWeight: 600, color: s.trend.includes("\u25B2") ? "#00A200" : S.red, marginTop: 4 }}>
                {s.trend}
              </div>
            )}
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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.black90, margin: "0 0 16px" }}>
              Decline Request {declineReqId}
            </h3>
            <label style={{ fontSize: 12, fontWeight: 600, color: S.black80, display: "block", marginBottom: 4 }}>
              Reason <span style={{ color: S.red }}>*</span>
            </label>
            <select
              value={declineCode}
              onChange={(e) => setDeclineCode(e.target.value)}
              style={{ ...inputStyle, marginBottom: 12, cursor: "pointer" }}
            >
              <option value="">Select a reason...</option>
              {DECLINE_REASONS.map((r) => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
            </select>
            <label style={{ fontSize: 12, fontWeight: 600, color: S.black80, display: "block", marginBottom: 4 }}>
              Additional notes (optional)
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Provide details..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? undefined : "flex-end", gap: 8, marginTop: 16 }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  setDeclineReqId(null);
                  setDeclineCode("");
                  setDeclineReason("");
                }}
                style={isMobile ? { width: "100%", order: 2 } : undefined}
              >
                Cancel
              </Btn>
              <Btn
                variant="destructive"
                disabled={!declineCode}
                onClick={() => {
                  updateRequestStatus(declineReqId!, "Declined", declineReason || undefined, declineCode);
                  setDeclineReqId(null);
                  setDeclineCode("");
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
      {tab === "queue" && (() => {
        const groups = groupByTimeHorizon(pending);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.length === 0 && <Empty msg="No pending requests" />}
            {groups.today.length > 0 && (
              <>
                <GroupHeader label="Today" count={groups.today.length} color={S.red} />
                {groups.today.map((req) => (
                  <RequestCard key={req.id} req={req} onAccept={() => updateRequestStatus(req.id, "Accepted")} onDecline={() => setDeclineReqId(req.id)} />
                ))}
              </>
            )}
            {groups.thisWeek.length > 0 && (
              <>
                <GroupHeader label="This Week" count={groups.thisWeek.length} color={S.yellow} />
                {groups.thisWeek.map((req) => (
                  <RequestCard key={req.id} req={req} onAccept={() => updateRequestStatus(req.id, "Accepted")} onDecline={() => setDeclineReqId(req.id)} />
                ))}
              </>
            )}
            {groups.future.length > 0 && (
              <>
                <GroupHeader label="Future" count={groups.future.length} color={S.navy} />
                {groups.future.map((req) => (
                  <RequestCard key={req.id} req={req} onAccept={() => updateRequestStatus(req.id, "Accepted")} onDecline={() => setDeclineReqId(req.id)} />
                ))}
              </>
            )}
          </div>
        );
      })()}
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
