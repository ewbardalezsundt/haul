"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { S } from "@/lib/theme";
import { YARDS, JOB_SITES, ASSETS } from "@/lib/data";
import { getTransitRange } from "@/lib/helpers";

interface AssetMapProps {
  onYardClick: (yardId: string) => void;
  onJobSiteClick?: (jobSiteId: string) => void;
}

/* ── Custom marker icons ───────────────────────────────── */

function yardIcon(count: number) {
  return L.divIcon({
    className: "",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:36px;height:36px;
          background:${S.navy};
          border:3px solid ${S.white};
          border-radius:6px;
          transform:rotate(45deg);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
        ">
          <span style="transform:rotate(-45deg);color:${S.white};font-size:13px;font-weight:700;">${count}</span>
        </div>
        <div style="
          width:0;height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:8px solid ${S.navy};
          margin-top:-3px;
        "></div>
      </div>
    `,
  });
}

function jobSiteIcon(count: number) {
  return L.divIcon({
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:26px;height:26px;
          background:${count > 0 ? S.blue : "#4DB8DB"};
          border:2.5px solid ${S.white};
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 5px rgba(0,0,0,0.3);
        ">
          <span style="color:${S.white};font-size:11px;font-weight:700;">${count > 0 ? count : ""}</span>
        </div>
        <div style="
          width:0;height:0;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:7px solid ${count > 0 ? S.blue : "#4DB8DB"};
          margin-top:-2px;
        "></div>
      </div>
    `,
  });
}

/* ── Fit bounds helper ─────────────────────────────────── */

function FitBounds() {
  const map = useMap();
  useMemo(() => {
    const allPoints: [number, number][] = [
      ...YARDS.map((y) => [y.lat, y.lng] as [number, number]),
      ...JOB_SITES.map((j) => [j.lat, j.lng] as [number, number]),
    ];
    if (allPoints.length > 0) {
      map.fitBounds(allPoints, { padding: [40, 40], maxZoom: 12 });
    }
  }, [map]);
  return null;
}

/* ── Map component ─────────────────────────────────────── */

export default function AssetMap({ onYardClick, onJobSiteClick }: AssetMapProps) {
  const assetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of ASSETS) {
      counts[a.location] = (counts[a.location] || 0) + 1;
    }
    return counts;
  }, []);

  /* Center between Phoenix & Tucson */
  const center: [number, number] = [32.85, -111.45];

  return (
    <div
      style={{
        backgroundColor: S.white,
        border: `1px solid ${S.qdrGray}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${S.qdrGray}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>📍</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: S.black90 }}>
            Asset Locations — Click a pin to filter
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: S.darkGray }}>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: S.navy,
                borderRadius: 2,
                marginRight: 4,
                verticalAlign: "middle",
              }}
            />
            Yard
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                backgroundColor: S.blue,
                borderRadius: 4,
                marginRight: 4,
                verticalAlign: "middle",
              }}
            />
            Job Site
          </span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: 420, width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds />

        {/* Yard markers */}
        {YARDS.map((yard) => {
          const count = assetCounts[yard.id] || 0;
          const transitRange = getTransitRange(yard.id);
          return (
            <Marker
              key={yard.id}
              position={[yard.lat, yard.lng]}
              icon={yardIcon(count)}
              eventHandlers={{
                click: () => onYardClick(yard.id),
              }}
            >
              <Popup>
                <div style={{ fontFamily: "system-ui, sans-serif", minWidth: 160 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, marginBottom: 4 }}>
                    {yard.name}
                  </div>
                  <div style={{ fontSize: 12, color: S.black70 }}>{yard.city}</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: S.black90,
                      marginTop: 6,
                      paddingTop: 6,
                      borderTop: `1px solid ${S.qdrGray}`,
                    }}
                  >
                    {count} asset{count !== 1 ? "s" : ""} here
                  </div>
                  {transitRange && (
                    <div style={{ fontSize: 11, color: S.darkGray, marginTop: 2 }}>
                      Transit: {transitRange} to job sites
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: S.navy,
                      fontWeight: 600,
                      marginTop: 6,
                      cursor: "pointer",
                    }}
                  >
                    Click to filter catalog →
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Job site markers */}
        {JOB_SITES.map((js) => {
          const count = assetCounts[js.id] || 0;
          return (
            <Marker
              key={js.id}
              position={[js.lat, js.lng]}
              icon={jobSiteIcon(count)}
              eventHandlers={{
                click: () => onJobSiteClick?.(js.id),
              }}
            >
              <Popup>
                <div style={{ fontFamily: "system-ui, sans-serif", minWidth: 160 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.blue, marginBottom: 4 }}>
                    {js.name}
                  </div>
                  <div style={{ fontSize: 12, color: S.black70 }}>PM: {js.pm}</div>
                  <div style={{ fontSize: 11, color: S.darkGray }}>Code: {js.code}</div>
                  {count > 0 && (
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: S.black90,
                        marginTop: 6,
                        paddingTop: 6,
                        borderTop: `1px solid ${S.qdrGray}`,
                      }}
                    >
                      {count} asset{count !== 1 ? "s" : ""} deployed
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: S.blue,
                      fontWeight: 600,
                      marginTop: 6,
                      cursor: "pointer",
                    }}
                  >
                    Click to filter catalog →
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
