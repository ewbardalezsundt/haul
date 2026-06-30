"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ASSETS } from "@/lib/data";
import { getLocation } from "@/lib/helpers";
import { StatusBadge, cardStyle } from "@/components/ui";

export default function FleetOverview() {
  const isMobile = useBreakpoint() === "mobile";
  const cellPad = isMobile ? "8px 12px" : "10px 16px";
  const [fleetFilter, setFleetFilter] = useState("All");
  const filtered =
    fleetFilter === "All" ? ASSETS : ASSETS.filter((a) => a.status === fleetFilter);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["All", "Available", "Deployed", "In Maintenance"].map((s) => (
          <button
            key={s}
            onClick={() => setFleetFilter(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.15s",
              backgroundColor: fleetFilter === s ? S.black90 : S.lightQdr,
              color: fleetFilter === s ? S.white : S.black70,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 13 }}>
            <thead>
              <tr style={{ backgroundColor: S.almostWhite }}>
                {["Asset", "Type", "Location", "Status", "Ready Date", "Rate"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: cellPad,
                      textAlign: "left" as const,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: 0.8,
                      color: S.black70,
                      borderBottom: `1px solid ${S.qdrGray}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  style={{ borderBottom: `1px solid ${S.lightQdr}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = S.lightQdr;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = S.white;
                  }}
                >
                  <td style={{ padding: cellPad }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={a.photo} alt={a.name} style={{ width: 32, height: 24, objectFit: "cover", borderRadius: 3, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: S.black90 }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: cellPad, color: S.black70 }}>{a.type}</td>
                  <td style={{ padding: cellPad, color: S.black70 }}>
                    {getLocation(a.location)}
                  </td>
                  <td style={{ padding: cellPad }}>
                    <StatusBadge status={a.status} />
                  </td>
                  <td style={{ padding: cellPad, color: S.black70 }}>{a.readyDate}</td>
                  <td style={{ padding: cellPad, fontWeight: 600, color: S.black90 }}>
                    ${a.rate.toLocaleString()}/wk
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
