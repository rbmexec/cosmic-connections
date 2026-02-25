import type { SpotifyCachedData } from "@/types/spotify";

const STORAGE_KEY = "cosmic_spotify_data";
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getSpotifyData(): SpotifyCachedData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as SpotifyCachedData;
    if (Date.now() - data.fetchedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveSpotifyData(data: SpotifyCachedData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearSpotifyData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isSpotifyConnected(): boolean {
  return getSpotifyData() !== null;
}
