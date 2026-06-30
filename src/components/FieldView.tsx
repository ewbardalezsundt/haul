"use client";

import { useState, useMemo } from "react";
import { S } from "@/lib/theme";
import { ASSETS, CATEGORIES, type EquipmentRequest } from "@/lib/data";
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
            Equipment Catalog
          </h1>
          <p style={{ fontSize: 13, color: S.black70, marginTop: 4 }}>
            Browse, compare, and request Sundt-owned assets
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
      <div style={{ ...cardStyle, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
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
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 140 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: 120 }}
          >
            <option>All</option>
            <option>Available</option>
          </select>
        </div>
      </div>

      <p style={{ fontSize: 13, color: S.darkGray, marginBottom: 14 }}>
        {filtered.length} asset{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Asset grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {filtered.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            style={{
              ...cardStyle,
              textAlign: "left" as const,
              padding: 20,
              cursor: "pointer",
              transition: "all 0.15s",
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 30 }}>{asset.photo}</span>
              <StatusBadge status={asset.status} />
            </div>
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
          </button>
        ))}
      </div>
    </div>
  );
}
