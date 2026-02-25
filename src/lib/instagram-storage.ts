import type { InstagramCachedData } from "@/types/instagram";

const STORAGE_KEY = "cosmic_instagram_data";
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getInstagramData(): InstagramCachedData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as InstagramCachedData;
    if (Date.now() - data.fetchedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveInstagramData(data: InstagramCachedData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearInstagramData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isInstagramConnected(): boolean {
  return getInstagramData() !== null;
}
