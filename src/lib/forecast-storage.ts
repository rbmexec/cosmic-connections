import type { DailyForecast } from "@/lib/daily-forecast";

const STORAGE_KEY = "cosmic_daily_forecast";

interface CachedForecast {
  date: string;
  forecast: DailyForecast;
}

export function getDailyForecast(): DailyForecast | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw) as CachedForecast;
    const today = new Date().toISOString().split("T")[0];
    if (cached.date !== today) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return cached.forecast;
  } catch {
    return null;
  }
}

export function saveDailyForecast(forecast: DailyForecast): void {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, forecast }));
}
