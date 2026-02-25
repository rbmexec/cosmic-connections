import type { CircleConnection } from "@/types/circle";

const STORAGE_KEY = "cosmic_circle_connections";

export function getCircleConnections(): CircleConnection[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as CircleConnection[];
  } catch {
    return [];
  }
}

export function saveCircleConnection(connection: CircleConnection): void {
  const existing = getCircleConnections();
  existing.push(connection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function removeCircleConnection(id: string): void {
  const existing = getCircleConnections();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateCircleConnection(id: string, updates: Partial<Omit<CircleConnection, "id" | "createdAt">>): void {
  const existing = getCircleConnections();
  const idx = existing.findIndex((c) => c.id === id);
  if (idx === -1) return;
  existing[idx] = { ...existing[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}
