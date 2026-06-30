"use client";

import { useState, useMemo } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, CATEGORIES, MOCK_USER, type EquipmentRequest } from "@/lib/data";
import { getLocation } from "@/lib/helpers";
import { StatusBadge, Btn, cardStyle, inputStyle } from "@/components/ui";
import AssetDetail from "@/components/AssetDetail";
import OrderWizard from "@/components/OrderWizard";
import OrderConfirmation from "@/components/OrderConfirmation";
import MyRequests from "@/components/MyRequests";

interface FieldViewProps {
  requests: EquipmentRequest[];
  addRequest: (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => string;
}

export default function FieldView({ requests, addRequest }: FieldViewProps) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS[number] | null>(null);
  const [orderAsset, setOrderAsset] = useState<typeof ASSETS[number] | null>(null);
  const [showRequests, setShowRequests] = useState(false);
  const [confirmReqId, setConfirmReqId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ASSETS.filter((a) => {
      if (category !== "All" && a.type !== category) return false;
      if (statusFilter === "Available" && a.status !== "Available") return false;
      if (search && !`${a.name} ${a.make} ${a.model} ${a.type}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, statusFilter]);

  if (confirmReqId) {
    return (
      <OrderConfirmation
        reqId={confirmReqId}
        onDone={() => {
          setConfirmReqId(null);
          setShowRequests(true);
        }}
      />
    );
  }

  if (orderAsset) {
    return (
      <OrderWizard
        asset={orderAsset}
        onCancel={() => setOrderAsset(null)}
        onSubmit={(req) => {
          const id = addRequest(req);
          setOrderAsset(null);
          setConfirmReqId(id);
        }}
      />
    );
  }

  if (selectedAsset) {
    return (
      <AssetDetail
        asset={selectedAsset}
        onBack={() => setSelectedAsset(null)}
        onRequest={() => {
          setOrderAsset(selectedAsset);
          setSelectedAsset(null);
        }}
      />
    );
  }

  if (showRequests) {
    return <MyRequests requests={requests} onBack={() => setShowRequests(false)} />;
  }

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: S.black90, margin: 0 }}>
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {MOCK_USER.name}
          </h1>
          <p style={{ fontSize: 13, color: S.black70, marginTop: 4 }}>
            What equipment do you need today?
          </p>
        </div>
        <Btn variant="secondary" onClick={() => setShowRequests(true)}>
          📋 My Requests
          <span
            style={{
              marginLeft: 4,
              backgroundColor: "#FFF8E1",
              color: S.darkYellow,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 10,
              padding: "2px 8px",
            }}
          >
            {requests.filter((r) => r.requestedBy === "Tom Bradley").length}
          </span>
        </Btn>
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, padding: isMobile ? 12 : 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: isMobile ? 8 : 12, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : 200, position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: S.darkGray,
                fontSize: 15,
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, make, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 36, minHeight: 44 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, ...(isMobile ? {} : {}) }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, width: "auto", minWidth: isMobile ? 0 : 140, flex: isMobile ? 1 : undefined, minHeight: 44 }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...inputStyle, width: "auto", minWidth: isMobile ? 0 : 120, flex: isMobile ? 1 : undefined, minHeight: 44 }}
            >
              <option>All</option>
              <option>Available</option>
            </select>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: S.darkGray, marginBottom: 14 }}>
        {filtered.length} asset{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Asset grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(auto-fill, minmax(260px, 1fr))" : "repeat(auto-fill, minmax(300px, 1fr))",
          gap: isMobile ? 10 : 14,
        }}
      >
        {filtered.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            style={{
              ...cardStyle,
              textAlign: "left" as const,
              padding: 0,
              cursor: "pointer",
              transition: "all 0.15s",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = S.navy;
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,102,153,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = S.qdrGray;
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{ position: "relative" }}>
              <img src={asset.photo} alt={asset.name} style={{ width: "100%", height: isMobile ? 140 : 160, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <StatusBadge status={asset.status} />
              </div>
            </div>
            <div style={{ padding: isMobile ? "12px 16px 16px" : "14px 20px 20px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.black90 }}>{asset.name}</div>
            <div style={{ fontSize: 12, color: S.black70, marginTop: 3 }}>
              {asset.make} · {asset.model} · {asset.year}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${S.lightQdr}`,
              }}
            >
              <span style={{ fontSize: 11, color: S.darkGray }}>
                {getLocation(asset.location)}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: S.black90 }}>
                ${asset.rate.toLocaleString()}
                <span style={{ fontSize: 11, fontWeight: 400, color: S.darkGray }}>/wk</span>
              </span>
            </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
