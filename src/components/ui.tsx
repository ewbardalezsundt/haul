import React from "react";
import { S, statusBadgeColors, certColors } from "@/lib/theme";

// ═══════════════════════════════════════════════════════════
// SHARED UI COMPONENTS — Sundt branded
// ═══════════════════════════════════════════════════════════

// ── Status Badge ────────────────────────────────────────

export function StatusBadge({ status }: { status: string }) {
  const c = statusBadgeColors[status] || { color: S.darkGray, bg: S.black5 };
  return (
    <span
      style={{
        color: c.color,
        backgroundColor: c.bg,
        fontWeight: 600,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 12,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ── Button ──────────────────────────────────────────────

type BtnVariant = "primary" | "brand" | "submit" | "secondary" | "destructive";

interface BtnProps {
  children: React.ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const btnVariants: Record<BtnVariant, React.CSSProperties> = {
  primary: { backgroundColor: S.navy, color: S.white },
  brand: { backgroundColor: S.red, color: S.white },
  submit: { backgroundColor: S.submitGreen, color: S.white },
  secondary: { backgroundColor: S.white, color: S.black80, border: `1px solid ${S.black20}` },
  destructive: { backgroundColor: S.black80, color: S.white },
};

export function Btn({ children, variant = "primary", onClick, disabled, style: s2 }: BtnProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    opacity: disabled ? 0.4 : 1,
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...btnVariants[variant], ...s2 }}>
      {children}
    </button>
  );
}

// ── Back Button ─────────────────────────────────────────

export function BackBtn({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 13,
        fontWeight: 500,
        color: S.navy,
        background: "none",
        border: "none",
        cursor: "pointer",
        marginBottom: 16,
        padding: 0,
      }}
    >
      ← {label || "Back"}
    </button>
  );
}

// ── Section Label ───────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        color: S.black70,
        marginBottom: 12,
        borderBottom: `2px solid ${S.qdrGray}`,
        paddingBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

// ── Info Row ────────────────────────────────────────────

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
      <span style={{ fontSize: 13, color: S.black70 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: S.black90, textAlign: "right", maxWidth: "60%" }}>
        {value}
      </span>
    </div>
  );
}

// ── Cert Icon ───────────────────────────────────────────

export function CertIndicator({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const icon = status === "valid" ? "✅" : status === "expired" || status === "missing" ? "⚠" : "◯";
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: certColors[status] || S.darkGray }}>
      {icon} {label}
    </span>
  );
}

// ── Shared styles ───────────────────────────────────────

export const cardStyle: React.CSSProperties = {
  backgroundColor: S.white,
  border: `1px solid ${S.qdrGray}`,
  borderRadius: 10,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${S.black20}`,
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  backgroundColor: S.white,
  color: S.black90,
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: S.black80,
  marginBottom: 5,
};
