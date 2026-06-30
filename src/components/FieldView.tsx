"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS, CATEGORIES, CATEGORY_CARDS, MOCK_USER, type EquipmentRequest } from "@/lib/data";
import { getLocation } from "@/lib/helpers";
import { StatusBadge, Btn, SectionLabel, cardStyle, inputStyle } from "@/components/ui";
import AssetDetail from "@/components/AssetDetail";
import OrderWizard from "@/components/OrderWizard";
import OrderConfirmation from "@/components/OrderConfirmation";
import MyRequests from "@/components/MyRequests";

const AssetMap = dynamic(() => import("@/components/AssetMap"), { ssr: false });

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
  const [showMap, setShowMap] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate on client-side only to avoid time-based mismatches
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const requestCount = useMemo(
    () => requests.filter((r) => r.requestedBy === "Tom Bradley").length,
    [requests]
  );

  const filtered = useMemo(() => {
    return ASSETS.filter((a) => {
      if (category !== "All" && a.type !== category) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (locationFilter && a.location !== locationFilter) return false;
      if (search && !`${a.name} ${a.make} ${a.model} ${a.type}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, statusFilter, locationFilter]);

  const activeRequests = useMemo(() => {
    return requests
      .filter((r) => ["Pending", "Accepted", "In Transit"].includes(r.status))
      .slice(0, 2);
  }, [requests]);

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
        requests={requests}
        onBack={() => setSelectedAsset(null)}
        onSelectAsset={setSelectedAsset}
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
            {isHydrated
              ? new Date().getHours() < 12
                ? "Good morning"
                : new Date().getHours() < 17
                  ? "Good afternoon"
                  : "Good evening"
              : "Welcome"}, {MOCK_USER.name}
          </h1>
          <p style={{ fontSize: 13, color: S.black70, marginTop: 4 }}>
            What equipment do you need today?
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!isMobile && (
            <Btn variant="secondary" onClick={() => setShowMap(!showMap)}>
              {showMap ? "🔲 Grid" : "📍 Map"}
            </Btn>
          )}
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
            {requestCount}
          </span>
        </Btn>
      </div>

      {/* Browse by Category Cards */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <SectionLabel>Browse by Category</SectionLabel>
          <button
            onClick={() => setCategory("All")}
            style={{
              fontSize: 12,
              color: S.navy,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: 600,
              padding: 0,
              marginBottom: 12,
            }}
          >
            View all
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 8,
            WebkitOverflowScrolling: "touch" as const,
          }}
        >
          {CATEGORY_CARDS.map((cat) => (
            <button
              key={cat.type}
              onClick={() => setCategory(cat.type)}
              style={{
                flexShrink: 0,
                width: isMobile ? 90 : 110,
                border: category === cat.type ? `2px solid ${S.navy}` : `1px solid ${S.qdrGray}`,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: S.white,
                padding: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (category !== cat.type) {
                  e.currentTarget.style.borderColor = S.navy;
                }
              }}
              onMouseLeave={(e) => {
                if (category !== cat.type) {
                  e.currentTarget.style.borderColor = S.qdrGray;
                }
              }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                style={{ width: "100%", height: isMobile ? 60 : 70, objectFit: "cover" }}
              />
              <div
                style={{
                  padding: "6px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: S.black90,
                  textAlign: "center" as const,
                }}
              >
                {cat.label}
              </div>
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Your Active Requests */}
      {activeRequests.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SectionLabel>Your Active Requests</SectionLabel>
            <button
              onClick={() => setShowRequests(true)}
              style={{
                fontSize: 12,
                color: S.navy,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0,
                marginBottom: 6,
              }}
            >
              View all
            </button>
          </div>
          {activeRequests.map((req) => {
            const asset = ASSETS.find((a) => a.id === req.assetId);
            return (
              <div
                key={req.id}
                style={{
                  ...cardStyle,
                  padding: "12px 16px",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <img
                  src={asset?.photo}
                  alt=""
                  style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: S.black90 }}>{asset?.name}</div>
                  <div style={{ fontSize: 11, color: S.black70 }}>
                    {req.id} · {req.startDate}
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            );
          })}
        </div>
      )}

      {/* Map (tablet + desktop) */}
      {showMap && !isMobile && (
        <div style={{ marginBottom: 20 }}>
          <AssetMap
            onYardClick={(yardId) => {
              setLocationFilter(yardId);
              setShowMap(false);
            }}
            onJobSiteClick={(jobId) => {
              setLocationFilter(jobId);
              setShowMap(false);
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div style={{ ...cardStyle, padding: isMobile ? 12 : 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: isMobile ? 8 : 12, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? undefined : "flex-end" }}>
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
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: isMobile ? 1 : undefined }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: S.darkGray, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Type</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, width: "auto", minWidth: isMobile ? 0 : 140, minHeight: 44 }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: isMobile ? 1 : undefined }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: S.darkGray, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...inputStyle, width: "auto", minWidth: isMobile ? 0 : 120, minHeight: 44 }}
              >
                <option>All</option>
                <option>Available</option>
                <option>Deployed</option>
                <option>In Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active location filter */}
      {locationFilter && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#E3F0F7",
            border: `1px solid ${S.navy}`,
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 12,
            fontSize: 13,
            fontWeight: 600,
            color: S.navy,
          }}
        >
          📍 Showing: {getLocation(locationFilter)}
          <button
            onClick={() => setLocationFilter(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              color: S.navy,
              padding: "0 2px",
              lineHeight: 1,
            }}
            aria-label="Clear location filter"
          >
            ×
          </button>
        </div>
      )}

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
