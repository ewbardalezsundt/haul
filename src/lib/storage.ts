import { INITIAL_REQUESTS, ASSETS, type EquipmentRequest, type Asset } from "@/lib/data";

const STORAGE_KEY = "haul_requests";
const SEQ_KEY = "haul_next_req";
const ASSET_KEY = "haul_assets";
const ASSET_SEQ_KEY = "haul_next_asset";

export function loadRequests(): EquipmentRequest[] {
  if (typeof window === "undefined") return INITIAL_REQUESTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: EquipmentRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Silent fail — localStorage full or disabled
  }
}

export function loadNextReqNum(): number {
  if (typeof window === "undefined") return 8;
  try {
    const stored = localStorage.getItem(SEQ_KEY);
    return stored ? parseInt(stored, 10) : 8;
  } catch {
    return 8;
  }
}

export function saveNextReqNum(n: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEQ_KEY, String(n));
  } catch {
    // Silent fail
  }
}

export function resetStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SEQ_KEY);
  localStorage.removeItem(ASSET_KEY);
  localStorage.removeItem(ASSET_SEQ_KEY);
}

// ── Asset persistence ───────────────────────────────────

export function loadAssets(): Asset[] {
  if (typeof window === "undefined") return ASSETS;
  try {
    const stored = localStorage.getItem(ASSET_KEY);
    return stored ? JSON.parse(stored) : ASSETS;
  } catch {
    return ASSETS;
  }
}

export function saveAssets(assets: Asset[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASSET_KEY, JSON.stringify(assets));
  } catch {
    // Silent fail — localStorage full or disabled
  }
}

export function loadNextAssetNum(): number {
  if (typeof window === "undefined") return ASSETS.length + 1;
  try {
    const stored = localStorage.getItem(ASSET_SEQ_KEY);
    return stored ? parseInt(stored, 10) : ASSETS.length + 1;
  } catch {
    return ASSETS.length + 1;
  }
}

export function saveNextAssetNum(n: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASSET_SEQ_KEY, String(n));
  } catch {
    // Silent fail
  }
}
