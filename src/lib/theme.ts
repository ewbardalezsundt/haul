// ═══════════════════════════════════════════════════════════
// SUNDT BRAND TOKENS
// ═══════════════════════════════════════════════════════════
// ⚠️  Red (#EE373D) = brand energy. NEVER error/danger/rejected.

export const S = {
  red: "#EE373D",
  lightRed: "#FF5157",
  darkRed: "#D51E24",
  navy: "#006699",
  lightNavy: "#1A80B3",
  darkNavy: "#004D80",
  blue: "#0099CC",
  lightBlue: "#1AB3E6",
  green: "#78C196",
  lightGreen: "#92DBB0",
  darkGreen: "#5FA87D",
  yellow: "#F3D03E",
  lightYellow: "#FFEA58",
  darkYellow: "#DAB725",
  submitGreen: "#00A200",
  lightQdrGreen: "#50CA65",
  darkQdrGreen: "#2B8C3C",
  black90: "#16171A",
  black80: "#333333",
  black70: "#636467",
  black20: "#CCCCCC",
  black5: "#F2F2F2",
  darkGray: "#898A8D",
  lightGray: "#B7BABC",
  almostWhite: "#F8F9FB",
  lightQdr: "#EFF0F3",
  qdrGray: "#E2E3E6",
  white: "#FFFFFF",
  requiredYellow: "#FFFFC8",
} as const;

// Status badge color mapping (brand-compliant)
export const statusBadgeColors: Record<string, { color: string; bg: string }> = {
  Available: { color: S.darkGreen, bg: "#E8F5E9" },
  Deployed: { color: S.navy, bg: "#E3F0F7" },
  "In Maintenance": { color: S.darkYellow, bg: "#FFF8E1" },
  Pending: { color: S.darkYellow, bg: "#FFF8E1" },
  Accepted: { color: S.darkGreen, bg: "#E8F5E9" },
  Declined: { color: S.black70, bg: S.black5 }, // NOT red
  "In Transit": { color: S.navy, bg: "#E3F0F7" },
};

export const certColors: Record<string, string> = {
  valid: S.darkGreen,
  expired: S.black70,
  missing: S.black70,
  unknown: S.darkGray,
  none: S.lightGray,
};
