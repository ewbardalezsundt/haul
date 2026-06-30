"use client";

import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import type { Asset } from "@/lib/data";
import { ASSETS } from "@/lib/data";
import { getLocation, getCompatibleAttachments, getSubstitutes, getTransitRange } from "@/lib/helpers";
import { StatusBadge, Btn, BackBtn, SectionLabel, InfoRow, cardStyle } from "@/components/ui";

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
  onRequest: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

export default function AssetDetail({ asset, onBack, onRequest, onSelectAsset }: AssetDetailProps) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const compatible = getCompatibleAttachments(asset.type);
  const substitutes = asset.status !== "Available" ? getSubstitutes(asset, ASSETS) : [];

  return (
    <div>
      <BackBtn onClick={onBack} label="Back to catalog" />
      <div style={cardStyle}>
        {/* Hero */}
        <div
          style={{
            backgroundColor: S.black90,
            padding: isMobile ? "20px 20px" : "32px 32px",
            borderRadius: "10px 10px 0 0",
            borderTop: `4px solid ${S.red}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 20 }}>
            <img src={asset.photo} alt={asset.name} style={isMobile ? { width: "100%", height: 180, objectFit: "cover", borderRadius: 8 } : { width: 120, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: S.white, margin: 0 }}>
                {asset.name}
              </h1>
              <p style={{ fontSize: 13, color: S.lightGray, marginTop: 4 }}>
                {asset.make} · {asset.model} · {asset.year}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <StatusBadge status={asset.status} />
                <span style={{ fontSize: 12, color: S.lightGray }}>
                  {getLocation(asset.location)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: isMobile ? 20 : 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 32 }}>
            {/* Specs */}
            <div>
              <SectionLabel>Specifications</SectionLabel>
              <div>
                {Object.entries(asset.specs).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${S.lightQdr}`,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, color: S.black70, textTransform: "capitalize" }}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: S.black90 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <SectionLabel>Availability</SectionLabel>
              <div style={{ backgroundColor: S.almostWhite, borderRadius: 8, padding: 16 }}>
                <InfoRow label="Ready Date" value={asset.readyDate} />
                <InfoRow label="Internal Rate" value={`$${asset.rate.toLocaleString()}/wk`} />
                <InfoRow label="Certification" value={asset.certRequired || "None"} />
                {asset.location.startsWith("yard-") && (() => {
                  const range = getTransitRange(asset.location);
                  return range ? <InfoRow label="Est. Transit" value={`${range} depending on job site`} /> : null;
                })()}
              </div>
              {compatible.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>Compatible Attachments</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {compatible.map((att) => (
                      <span
                        key={att.id}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: S.lightQdr,
                          color: S.black80,
                          fontSize: 12,
                          borderRadius: 6,
                          fontWeight: 500,
                        }}
                      >
                        {att.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request CTA */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 24,
              borderTop: `1px solid ${S.qdrGray}`,
            }}
          >
            {asset.status === "Available" ? (
              <Btn variant="submit" onClick={onRequest} style={{ padding: "12px 28px", fontSize: 14, width: isMobile ? "100%" : undefined, minHeight: 48 }}>
                Request This Equipment →
              </Btn>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "#FFF8E1",
                    border: `1px solid ${S.darkYellow}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 20,
                  }}
                >
                  <span style={{ color: S.yellow, fontSize: 18 }}>⚠</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: S.black70 }}>
                    Not available until {asset.readyDate}
                  </span>
                </div>

                {/* Similar Available Equipment Section */}
                {substitutes.length > 0 ? (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <SectionLabel>Similar Available Equipment</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {substitutes.map((substitute) => (
                        <button
                          key={substitute.id}
                          onClick={() => {
                            if (onSelectAsset) {
                              onSelectAsset(substitute);
                            }
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px",
                            backgroundColor: S.almostWhite,
                            border: `1px solid ${S.lightQdr}`,
                            borderRadius: 6,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = S.navy;
                            e.currentTarget.style.backgroundColor = "#F5F9FC";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = S.lightQdr;
                            e.currentTarget.style.backgroundColor = S.almostWhite;
                          }}
                        >
                          <img
                            src={substitute.photo}
                            alt={substitute.name}
                            style={{
                              width: 48,
                              height: 36,
                              objectFit: "cover",
                              borderRadius: 4,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: S.black90 }}>
                              {substitute.name}
                            </div>
                            <div style={{ fontSize: 12, color: S.black70, marginTop: 2 }}>
                              {getLocation(substitute.location)} · ${substitute.rate.toLocaleString()}/wk
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: S.navy, fontWeight: 600, flexShrink: 0 }}>
                            View →
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 6,
                      fontSize: 13,
                      color: S.black70,
                    }}
                  >
                    No similar equipment currently available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
