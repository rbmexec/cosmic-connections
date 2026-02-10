import type { UserProfile } from "@/types/profile";

const STORAGE_KEY = "cosmic_user_profile";

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

export function clearUserProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}
