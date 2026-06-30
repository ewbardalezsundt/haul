"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { INITIAL_REQUESTS, type EquipmentRequest } from "@/lib/data";
import FieldView from "@/components/FieldView";
import EquipServicesView from "@/components/EquipServicesView";

export default function Home() {
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
      {/* ─── Header with Sundt red brand stripe ─── */}
      <header
        style={{
          backgroundColor: S.white,
          borderBottom: `3px solid ${S.red}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 4,
                backgroundColor: S.red,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: S.white,
                fontWeight: 800,
                fontSize: 17,
              }}
            >
              H
            </div>
            <div>
              <span style={{ fontSize: 17, fontWeight: 700, color: S.black90 }}>HAUL</span>
              <span
                style={{ fontSize: 11, color: S.black70, marginLeft: 8, fontWeight: 500 }}
              >
                Heavy Asset Utilization & Logistics
              </span>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            <NavBtn
              label="Field View"
              icon="🚛"
              active={view === "field"}
              onClick={() => setView("field")}
            />
            <NavBtn
              label="Equipment Services"
              icon="📋"
              active={view === "equip"}
              onClick={() => setView("equip")}
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
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        backgroundColor: active ? S.navy : "transparent",
        color: active ? S.white : S.black70,
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </button>
  );
}
