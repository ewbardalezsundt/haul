"use client";

import { useState, useMemo } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { OPERATORS, DECLINE_REASONS, UPCOMING_MAINTENANCE, YARDS, CATEGORIES, CERT_TYPES, type EquipmentRequest, type Asset } from "@/lib/data";
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
  assets: Asset[];
  requests: EquipmentRequest[];
  updateRequestStatus: (reqId: string, status: string, reason?: string, reasonCode?: string) => void;
  addAsset: (draft: Omit<Asset, "id">) => string;
}

export default function EquipServicesView({
  assets,
  requests,
  updateRequestStatus,
  addAsset,
}: EquipServicesViewProps) {
  const [tab, setTab] = useState("queue");
  const [declineReqId, setDeclineReqId] = useState<string | null>(null);
  const [declineCode, setDeclineCode] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  // --- Add Equipment form state (SPEC-018) ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newYear, setNewYear] = useState(2026);
  const [newYard, setNewYard] = useState(YARDS[0].id);
  const [newStatus, setNewStatus] = useState<"Available" | "In Maintenance">("Available");
  const [newReadyDate, setNewReadyDate] = useState("2026-06-30");
  const [newRate, setNewRate] = useState("");
  const [newCert, setNewCert] = useState("none");
  const [newPhoto, setNewPhoto] = useState("");
  const [newSpecs, setNewSpecs] = useState<{ key: string; value: string }[]>([]);
  const [addSuccess, setAddSuccess] = useState(false);
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const pending = requests.filter((r) => r.status === "Pending");
  const active = requests.filter((r) => ["Accepted", "In Transit"].includes(r.status));
  const closed = requests.filter((r) => ["Declined", "Delivered"].includes(r.status));

  // --- Richer KPIs (SPEC-014) ---
  const total = assets.length;
  const deployed = assets.filter((a) => a.status === "Deployed").length;
  const utilization = Math.round((deployed / total) * 100);
  const totalRequests = requests.length;
  const fulfilled = requests.filter((r) => ["Accepted", "In Transit", "Delivered"].includes(r.status)).length;
  const fillRate = totalRequests > 0 ? Math.round((fulfilled / totalRequests) * 100) : 0;

  // --- Cost Savings (SPEC-019) ---
  const EXTERNAL_MARKUP = 1.8;
  const savingsData = useMemo(() => {
    const fulfilledReqs = requests.filter(r => ["Accepted", "In Transit", "Delivered"].includes(r.status));
    let totalSavings = 0;
    for (const req of fulfilledReqs) {
      const asset = assets.find(a => a.id === req.assetId);
      if (!asset) continue;
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      totalSavings += asset.rate * (EXTERNAL_MARKUP - 1) * days;
    }
    return { totalSavings, count: fulfilledReqs.length };
  }, [requests, assets]);

  // Mock trend data — hardcoded per hackathon rules (no historical data)
  const stats: { label: string; value: string | number; sub: string; accent: string; trend?: string }[] = [
    { label: "Internal Fill Rate", value: `${fillRate}%`, sub: "This Month", accent: S.red, trend: "\u25B2 9% vs last month" },
    { label: "Active Requests", value: pending.length + active.length, sub: `${pending.length} Pending Approval`, accent: S.navy },
    { label: "Equipment Utilization", value: `${utilization}%`, sub: "This Month", accent: S.green, trend: "\u25B2 7% vs last month" },
    { label: "Total Fleet", value: total, sub: "Total Assets", accent: S.black80 },
  ];

  // --- Certification Compliance (SPEC-015) ---
  const demoDate = new Date(DEMO_TODAY + "T00:00:00");
  const compliant = OPERATORS.filter((o) => o.status === "Current").length;
  const expired = OPERATORS.filter((o) => o.status === "Expired").length;
  const expiringSoon = OPERATORS.filter((o) => {
    if (o.status !== "Current") return false;
    const daysToExpiry = (new Date(o.expiry).getTime() - demoDate.getTime()) / 86400000;
    return daysToExpiry <= 30;
  }).length;
  const fullyCompliant = compliant - expiringSoon;
  const complianceRate = Math.round((compliant / OPERATORS.length) * 100);

  // --- Add Equipment helpers (SPEC-018) ---
  const photoOptions = assets
    .map((a) => a.photo)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const typeOptions = CATEGORIES.filter((c) => c !== "All");

  const resetAddForm = () => {
    setNewName(""); setNewType(""); setNewMake(""); setNewModel("");
    setNewYear(2026); setNewYard(YARDS[0].id); setNewStatus("Available");
    setNewReadyDate("2026-06-30"); setNewRate(""); setNewCert("none");
    setNewPhoto(""); setNewSpecs([]);
  };

  const canSubmitAsset = newName.trim() && newType && newMake.trim() && newModel.trim() && newRate;

  const handleAddEquipment = () => {
    if (!canSubmitAsset) return;
    const specsObj: Record<string, string> = {};
    newSpecs.forEach((s) => { if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim(); });
    addAsset({
      name: newName.trim(),
      type: newType,
      make: newMake.trim(),
      model: newModel.trim(),
      year: newYear,
      specs: specsObj,
      location: newYard,
      status: newStatus,
      readyDate: newReadyDate,
      certRequired: newCert === "none" ? null : newCert,
      photo: newPhoto || photoOptions[0] || "/images/equipment/cat-320-excavator.jpg",
      rate: Number(newRate),
    });
    resetAddForm();
    setShowAddForm(false);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

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

      {/* Cost Savings Banner (SPEC-019) */}
      {savingsData.count > 0 && (
        <div style={{
          background: `linear-gradient(135deg, ${S.navy}, ${S.darkNavy})`,
          borderRadius: 12,
          padding: isMobile ? "16px 20px" : "20px 28px",
          marginBottom: 24,
          color: S.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.85, marginBottom: 4 }}>
              ESOP Value Protected This Quarter
            </div>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800 }}>
              ${savingsData.totalSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              saved across {savingsData.count} fulfilled request{savingsData.count !== 1 ? "s" : ""} vs. external rental
            </div>
          </div>
          {!isMobile && (
            <div style={{ opacity: 0.3 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Certification Compliance (SPEC-015) */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 16 : 28,
          padding: isMobile ? 16 : 20,
          marginBottom: 24,
        }}
      >
        {/* Donut */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: `conic-gradient(
                ${S.green} 0% ${(fullyCompliant / OPERATORS.length) * 100}%,
                #D4A017 ${(fullyCompliant / OPERATORS.length) * 100}% ${((fullyCompliant + expiringSoon) / OPERATORS.length) * 100}%,
                ${S.black70} ${((fullyCompliant + expiringSoon) / OPERATORS.length) * 100}% 100%
              )`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                backgroundColor: S.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: S.black90,
              }}
            >
              {complianceRate}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.black90 }}>Certification Compliance</div>
            <div style={{ fontSize: 11, color: S.black70, marginTop: 2 }}>{OPERATORS.length} Operators</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: isMobile ? 16 : 24 }}>
          {[
            { color: S.green, label: "Compliant", count: fullyCompliant },
            { color: "#D4A017", label: "Expiring Soon", count: expiringSoon },
            { color: S.black70, label: "Expired", count: expired },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: S.black90 }}>{item.count}</div>
                <div style={{ fontSize: 10, color: S.black70, whiteSpace: "nowrap" }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Maintenance (SPEC-016) */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: S.black90 }}>Upcoming Maintenance</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: S.navy, cursor: "pointer" }}>View all</span>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as never }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${S.lightQdr}` }}>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: S.black70, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Equipment</th>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: S.black70, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Type</th>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: S.black70, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {[...UPCOMING_MAINTENANCE]
                .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                .slice(0, 5)
                .map((m) => {
                  const asset = assets.find((a) => a.id === m.assetId);
                  const dueMs = new Date(m.dueDate + "T00:00:00").getTime();
                  const demoMs = new Date(DEMO_TODAY + "T00:00:00").getTime();
                  const daysUntil = (dueMs - demoMs) / 86400000;
                  const isOverdue = daysUntil < 0;
                  const isUrgent = !isOverdue && daysUntil <= 3;
                  const rowBg = isOverdue ? S.black70 + "14" : isUrgent ? "#D4A01718" : "transparent";
                  const dateFg = isOverdue ? S.black70 : isUrgent ? "#9A7B00" : S.black90;
                  return (
                    <tr key={m.assetId + m.dueDate} style={{ borderBottom: `1px solid ${S.lightQdr}`, backgroundColor: rowBg }}>
                      <td style={{ padding: "10px 6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {asset?.photo && (
                            <img
                              src={asset.photo}
                              alt={asset.name}
                              style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }}
                            />
                          )}
                          <span style={{ fontWeight: 600, color: S.black90, whiteSpace: "nowrap" }}>{asset?.name ?? m.assetId}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 6px", color: S.black80 }}>{m.type}</td>
                      <td style={{ padding: "10px 6px", fontWeight: 600, color: dateFg, whiteSpace: "nowrap" }}>
                        {new Date(m.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {isOverdue && <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 6, color: S.black70 }}>OVERDUE</span>}
                        {isUrgent && <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 6, color: "#9A7B00" }}>SOON</span>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
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
      {tab === "fleet" && (
        <div>
          {/* Add Equipment button + success toast */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setAddSuccess(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, minHeight: 44,
                backgroundColor: showAddForm ? S.black70 : S.navy,
                color: S.white, transition: "all 0.15s",
              }}
            >
              {showAddForm ? "× Cancel" : "+ Add Equipment"}
            </button>
            {addSuccess && (
              <span style={{ fontSize: 13, fontWeight: 600, color: S.submitGreen }}>✓ Equipment added to fleet</span>
            )}
          </div>

          {/* Add Equipment form (SPEC-018) */}
          {showAddForm && (
            <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.black90, marginBottom: 16 }}>Add Equipment to Fleet</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                {/* Name */}
                <div>
                  <label style={labelSt}>Name *</label>
                  <input style={inputStyle} placeholder="e.g. CAT 336 Excavator" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                {/* Type */}
                <div>
                  <label style={labelSt}>Type *</label>
                  <select style={inputStyle} value={newType} onChange={(e) => setNewType(e.target.value)}>
                    <option value="">Select type…</option>
                    {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {/* Make */}
                <div>
                  <label style={labelSt}>Make *</label>
                  <input style={inputStyle} placeholder="e.g. Caterpillar" value={newMake} onChange={(e) => setNewMake(e.target.value)} />
                </div>
                {/* Model */}
                <div>
                  <label style={labelSt}>Model *</label>
                  <input style={inputStyle} placeholder="e.g. 336" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
                </div>
                {/* Year */}
                <div>
                  <label style={labelSt}>Year *</label>
                  <input style={inputStyle} type="number" min={2000} max={2030} value={newYear} onChange={(e) => setNewYear(Number(e.target.value))} />
                </div>
                {/* Yard */}
                <div>
                  <label style={labelSt}>Yard *</label>
                  <select style={inputStyle} value={newYard} onChange={(e) => setNewYard(e.target.value)}>
                    {YARDS.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label style={labelSt}>Status *</label>
                  <select style={inputStyle} value={newStatus} onChange={(e) => setNewStatus(e.target.value as "Available" | "In Maintenance")}>
                    <option value="Available">Available</option>
                    <option value="In Maintenance">In Maintenance</option>
                  </select>
                </div>
                {/* Ready Date */}
                <div>
                  <label style={labelSt}>Ready Date *</label>
                  <input style={inputStyle} type="date" value={newReadyDate} onChange={(e) => setNewReadyDate(e.target.value)} />
                </div>
                {/* Daily Rate */}
                <div>
                  <label style={labelSt}>Weekly Rate ($) *</label>
                  <input style={inputStyle} type="number" min={0} placeholder="e.g. 2200" value={newRate} onChange={(e) => setNewRate(e.target.value)} />
                </div>
                {/* Cert Required */}
                <div>
                  <label style={labelSt}>Cert Required</label>
                  <select style={inputStyle} value={newCert} onChange={(e) => setNewCert(e.target.value)}>
                    <option value="none">None</option>
                    {CERT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Photo */}
                <div style={{ gridColumn: isMobile ? undefined : "1 / -1" }}>
                  <label style={labelSt}>Photo</label>
                  <select style={inputStyle} value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)}>
                    <option value="">Use default</option>
                    {photoOptions.map((p) => {
                      const filename = p.split("/").pop() || p;
                      return <option key={p} value={p}>{filename}</option>;
                    })}
                  </select>
                </div>
              </div>

              {/* Specs key/value pairs */}
              <div style={{ marginTop: 16 }}>
                <label style={labelSt}>Specs (optional)</label>
                {newSpecs.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Key (e.g. weight)"
                      value={s.key}
                      onChange={(e) => {
                        const updated = [...newSpecs];
                        updated[i] = { ...updated[i], key: e.target.value };
                        setNewSpecs(updated);
                      }}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Value (e.g. 69,200 lb)"
                      value={s.value}
                      onChange={(e) => {
                        const updated = [...newSpecs];
                        updated[i] = { ...updated[i], value: e.target.value };
                        setNewSpecs(updated);
                      }}
                    />
                    <button
                      onClick={() => setNewSpecs(newSpecs.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: S.black70, fontSize: 18, padding: 4, minWidth: 28, minHeight: 44 }}
                      title="Remove spec"
                    >×</button>
                  </div>
                ))}
                <button
                  onClick={() => setNewSpecs([...newSpecs, { key: "", value: "" }])}
                  style={{
                    background: "none", border: `1px dashed ${S.qdrGray}`, borderRadius: 6,
                    padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: S.navy, minHeight: 44,
                  }}
                >+ Add Spec</button>
              </div>

              {/* Submit / Cancel */}
              <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                <button
                  onClick={() => { resetAddForm(); setShowAddForm(false); }}
                  style={{
                    padding: "10px 20px", borderRadius: 6, border: `1px solid ${S.qdrGray}`,
                    cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: S.white,
                    color: S.black70, minHeight: 44,
                  }}
                >Cancel</button>
                <button
                  disabled={!canSubmitAsset}
                  onClick={handleAddEquipment}
                  style={{
                    padding: "10px 24px", borderRadius: 6, border: "none",
                    cursor: canSubmitAsset ? "pointer" : "not-allowed",
                    fontSize: 13, fontWeight: 700, minHeight: 44,
                    backgroundColor: canSubmitAsset ? S.submitGreen : S.qdrGray,
                    color: S.white, transition: "all 0.15s",
                  }}
                >Add to Fleet</button>
              </div>
            </div>
          )}

          <FleetOverview assets={assets} />
        </div>
      )}
      {tab === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {active.length === 0 && <Empty msg="No active requests" />}
          {active.map((req) => (
            <RequestCard key={req.id} req={req} onMarkInTransit={() => updateRequestStatus(req.id, "In Transit")} onMarkDelivered={() => updateRequestStatus(req.id, "Delivered")} />
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

const labelSt: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, color: S.black70,
  textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
};
