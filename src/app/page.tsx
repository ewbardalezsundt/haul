"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { INITIAL_REQUESTS, type EquipmentRequest } from "@/lib/data";
import FieldView from "@/components/FieldView";
import EquipServicesView from "@/components/EquipServicesView";

export default function Home() {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const [view, setView] = useState<"field" | "equip">("field");
  const [requests, setRequests] = useState<EquipmentRequest[]>(INITIAL_REQUESTS);
  const [nextReqNum, setNextReqNum] = useState(8);

  const addRequest = (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => {
    const id = `REQ-${String(nextReqNum).padStart(3, "0")}`;
    setRequests((prev) => [
      { ...req, id, status: "Pending" as const, submittedAt: new Date().toISOString() },
      ...prev,
    ]);
    setNextReqNum((n) => n + 1);
    return id;
  };

  const updateRequestStatus = (reqId: string, status: string, reason?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: status as EquipmentRequest["status"], ...(reason ? { declineReason: reason } : {}) }
          : r
      )
    );
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: S.almostWhite,
        minHeight: "100vh",
        color: S.black90,
      }}
    >
      {/* ─── Header with Sundt navy bg + red brand stripe ─── */}
      <header
        style={{
          backgroundColor: S.navy,
          borderBottom: `3px solid ${S.red}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
            <img
              src="/images/sundt-logo.png"
              alt="Sundt"
              style={{
                height: isMobile ? 28 : 34,
                width: "auto",
              }}
            />
            <div>
              <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: S.white }}>HAUL</span>
              {!isMobile && (
                <span
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginLeft: 8, fontWeight: 500 }}
                >
                  Heavy Asset Utilization & Logistics
                </span>
              )}
            </div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            <NavBtn
              label={isMobile ? "Field" : "Field View"}
              icon="🚛"
              active={view === "field"}
              onClick={() => setView("field")}
              compact={isMobile}
            />
            <NavBtn
              label={isMobile ? "Equip Svcs" : "Equipment Services"}
              icon="📋"
              active={view === "equip"}
              onClick={() => setView("equip")}
              compact={isMobile}
            />
          </nav>
        </div>
      </header>

      {/* ─── Content ─── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>
        {view === "field" ? (
          <FieldView requests={requests} addRequest={addRequest} />
        ) : (
          <EquipServicesView requests={requests} updateRequestStatus={updateRequestStatus} />
        )}
      </main>
    </div>
  );
}

function NavBtn({
  label,
  icon,
  active,
  onClick,
  compact,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 4 : 6,
        padding: compact ? "7px 10px" : "7px 16px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: compact ? 12 : 13,
        fontWeight: 600,
        minHeight: 44,
        backgroundColor: active ? S.white : "transparent",
        color: active ? S.navy : "rgba(255,255,255,0.85)",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: compact ? 14 : 15 }}>{icon}</span>
      {label}
    </button>
  );
}
