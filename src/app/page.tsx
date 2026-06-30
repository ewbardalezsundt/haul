"use client";

import { useState, useEffect, useCallback } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, INITIAL_REQUESTS, type EquipmentRequest, type Asset } from "@/lib/data";
import { loadRequests, saveRequests, loadNextReqNum, saveNextReqNum, loadAssets, saveAssets, loadNextAssetNum, saveNextAssetNum, resetStorage } from "@/lib/storage";
import FieldView from "@/components/FieldView";
import EquipServicesView from "@/components/EquipServicesView";

export default function Home() {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const [view, setView] = useState<"field" | "equip">("field");
  const [requests, setRequests] = useState<EquipmentRequest[]>(INITIAL_REQUESTS);
  const [nextReqNum, setNextReqNum] = useState(8);
  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [nextAssetNum, setNextAssetNum] = useState(ASSETS.length + 1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Hydrate from localStorage after client-side mount
  useEffect(() => {
    const stored = loadRequests();
    const storedSeq = loadNextReqNum();
    setRequests(stored);
    setNextReqNum(storedSeq);
    const storedAssets = loadAssets();
    const storedAssetSeq = loadNextAssetNum();
    setAssets(storedAssets);
    setNextAssetNum(storedAssetSeq);
    setIsHydrated(true);
  }, []);

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const t = setTimeout(() => setNotifications([]), 5000);
    return () => clearTimeout(t);
  }, [notifications]);

  const switchToField = useCallback(() => {
    setView("field");
  }, []);

  // Persist requests & assets to localStorage on every change
  useEffect(() => { saveRequests(requests); }, [requests]);
  useEffect(() => { saveAssets(assets); }, [assets]);

  // Expose reset for demo/dev console: window.__resetHaul()
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__resetHaul = () => {
      resetStorage();
      window.location.reload();
    };
  }, []);

  const addRequest = (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => {
    const id = `REQ-${String(nextReqNum).padStart(3, "0")}`;
    setRequests((prev) => [
      { ...req, id, status: "Pending" as const, submittedAt: new Date().toISOString() },
      ...prev,
    ]);
    setNextReqNum((n) => {
      saveNextReqNum(n + 1);
      return n + 1;
    });
    return id;
  };

  const addAsset = useCallback((draft: Omit<Asset, "id">) => {
    const id = `asset-${nextAssetNum}`;
    setAssets((prev) => [...prev, { ...draft, id }]);
    setNextAssetNum((n) => {
      saveNextAssetNum(n + 1);
      return n + 1;
    });
    return id;
  }, [nextAssetNum]);

  const updateRequestStatus = (reqId: string, status: string, reason?: string, reasonCode?: string) => {
    const req = requests.find((r) => r.id === reqId);
    const assetName = req ? (assets.find((a) => a.id === req.assetId)?.name ?? req.assetId) : reqId;
    let msg = "";
    if (status === "Accepted") msg = `\u2705 ${reqId} accepted \u2014 ${assetName}`;
    else if (status === "Declined") msg = `${reqId} declined \u2014 ${assetName}`;
    else if (status === "In Transit") msg = `\ud83d\ude9b ${reqId} \u2014 ${assetName} is in transit`;
    else if (status === "Delivered") msg = `\ud83d\udce6 ${reqId} \u2014 ${assetName} delivered to site`;
    if (msg) setNotifications((prev) => [...prev, msg]);

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: status as EquipmentRequest["status"], ...(reason ? { declineReason: reason } : {}), ...(reasonCode ? { declineReasonCode: reasonCode } : {}) }
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
              onClick={switchToField}
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
        {isHydrated ? (
          view === "field" ? (
            <FieldView assets={assets} requests={requests} addRequest={addRequest} />
          ) : (
            <EquipServicesView assets={assets} requests={requests} updateRequestStatus={updateRequestStatus} addAsset={addAsset} />
          )
        ) : (
          <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: S.black70 }}>Loading...</p>
          </div>
        )}
      </main>

      {/* Toast notifications */}
      {notifications.map((msg, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            bottom: (isMobile ? 12 : 16) + i * 64,
            right: isMobile ? 12 : 16,
            left: isMobile ? 12 : "auto",
            backgroundColor: S.white,
            borderLeft: `4px solid ${S.navy}`,
            borderRadius: 8,
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 200,
            maxWidth: 360,
            fontSize: 13,
            fontWeight: 500,
            color: S.black90,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{msg}</span>
          <button
            onClick={() => setNotifications((n) => n.filter((_, j) => j !== i))}
            style={{ background: "none", border: "none", cursor: "pointer", color: S.darkGray, fontSize: 16, flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      ))}
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
