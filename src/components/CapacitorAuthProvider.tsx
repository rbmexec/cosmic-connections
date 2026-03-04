"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export default function CapacitorAuthProvider({ children }: { children: React.ReactNode }) {
  const { update } = useSession();
  const router = useRouter();

  const handleDeepLink = useCallback(
    async (url: string) => {
      // Match astr://auth/callback?token=...
      if (!url.startsWith("astr://auth/callback")) return;

      const params = new URL(url.replace("astr://", "https://placeholder/"));
      const token = params.searchParams.get("token");
      if (!token) return;

      // Close the SFSafariViewController
      try {
        const { Browser } = await import("@capacitor/browser");
        await Browser.close();
      } catch {
        // Browser plugin may not be available
      }

      // Exchange the one-time token for a session cookie in the WebView
      try {
        const res = await fetch("/api/auth-mobile/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          // Refresh the NextAuth session in the WebView
          await update();
          router.push("/");
        }
      } catch (err) {
        console.error("[CapacitorAuth] Exchange failed:", err);
      }
    },
    [update, router]
  );

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        const listener = await App.addListener("appUrlOpen", (event) => {
          handleDeepLink(event.url);
        });
        cleanup = () => listener.remove();
      } catch {
        // App plugin may not be available
      }
    })();

    return () => {
      cleanup?.();
    };
  }, [handleDeepLink]);

  return <>{children}</>;
}
