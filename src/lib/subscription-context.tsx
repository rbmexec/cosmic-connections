"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { tierFeatures } from "@/lib/subscription-tiers";
import type { SubscriptionTier, SubscriptionInfo, TierFeatures } from "@/types/subscription";

export interface CircleAddBalance {
  freeAddsUsed: number;
  freeAddsIncluded: number;
  purchasedAdds: number;
  canAddFree: boolean;
  totalRemaining: number; // -1 = unlimited
}

interface SubscriptionContextValue {
  tier: SubscriptionTier;
  features: TierFeatures;
  isPro: boolean;
  isCosmicPlus: boolean;
  swipesUsed: number;
  swipesRemaining: number;
  activeConversationLimit: number;
  loading: boolean;
  circleAdds: CircleAddBalance | null;
  recordSwipe: () => Promise<boolean>;
  openCheckout: (priceId: string, mode?: "subscription" | "payment") => Promise<void>;
  openPortal: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  isConversationLocked: (conversationIndex: number) => boolean;
  consumeCircleAdd: () => Promise<boolean>;
  purchaseCircleAdd: () => Promise<void>;
  refreshCircleAdds: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  tier: "free",
  features: tierFeatures.free,
  isPro: false,
  isCosmicPlus: false,
  swipesUsed: 0,
  swipesRemaining: 10,
  activeConversationLimit: 3,
  loading: true,
  circleAdds: null,
  recordSwipe: async () => true,
  openCheckout: async () => {},
  openPortal: async () => {},
  refreshSubscription: async () => {},
  isConversationLocked: () => false,
  consumeCircleAdd: async () => false,
  purchaseCircleAdd: async () => {},
  refreshCircleAdds: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [swipesUsed, setSwipesUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [circleAdds, setCircleAdds] = useState<CircleAddBalance | null>(null);

  const features = tierFeatures[tier];
  const isPro = tier === "pro" || tier === "cosmic_plus";
  const isCosmicPlus = tier === "cosmic_plus";
  const swipesRemaining = features.dailySwipeLimit === -1 ? Infinity : Math.max(0, features.dailySwipeLimit - swipesUsed);
  const activeConversationLimit = features.activeConversationLimit;

  const isConversationLocked = useCallback((conversationIndex: number): boolean => {
    if (activeConversationLimit === -1) return false;
    return conversationIndex >= activeConversationLimit;
  }, [activeConversationLimit]);

  const fetchSubscription = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const info: SubscriptionInfo = await res.json();
        setTier(info.status === "active" ? info.tier : "free");
      }
    } catch {
      // fallback to free
    }
    setLoading(false);
  }, [session?.user?.id]);

  const fetchSwipes = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/swipes");
      if (res.ok) {
        const data = await res.json();
        setSwipesUsed(data.count);
      }
    } catch {
      // ignore
    }
  }, [session?.user?.id]);

  const fetchCircleAdds = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/circle-adds");
      if (res.ok) {
        const data: CircleAddBalance = await res.json();
        setCircleAdds(data);
      }
    } catch {
      // ignore
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchSubscription();
    fetchSwipes();
    fetchCircleAdds();
  }, [fetchSubscription, fetchSwipes, fetchCircleAdds]);

  // Watch for ?circle_add=success URL param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("circle_add") === "success") {
      fetchCircleAdds();
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("circle_add");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [fetchCircleAdds]);

  const recordSwipe = useCallback(async (): Promise<boolean> => {
    if (features.dailySwipeLimit === -1) return true;
    if (swipesUsed >= features.dailySwipeLimit) return false;

    try {
      const res = await fetch("/api/swipes", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSwipesUsed(data.count);
        return data.count <= features.dailySwipeLimit;
      }
    } catch {
      // ignore
    }
    return true;
  }, [features.dailySwipeLimit, swipesUsed]);

  const openCheckout = useCallback(async (priceId: string, mode?: "subscription" | "payment") => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
  }, []);

  const openPortal = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
  }, []);

  const consumeCircleAdd = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/circle-adds", { method: "POST" });
      if (res.ok) {
        await fetchCircleAdds();
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [fetchCircleAdds]);

  const purchaseCircleAdd = useCallback(async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_CIRCLE_ADD_PRICE_ID || "";
    await openCheckout(priceId, "payment");
  }, [openCheckout]);

  const refreshCircleAdds = useCallback(async () => {
    await fetchCircleAdds();
  }, [fetchCircleAdds]);

  const refreshSubscription = useCallback(async () => {
    await fetchSubscription();
    await fetchSwipes();
    await fetchCircleAdds();
  }, [fetchSubscription, fetchSwipes, fetchCircleAdds]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        features,
        isPro,
        isCosmicPlus,
        swipesUsed,
        swipesRemaining,
        activeConversationLimit,
        loading,
        circleAdds,
        recordSwipe,
        openCheckout,
        openPortal,
        refreshSubscription,
        isConversationLocked,
        consumeCircleAdd,
        purchaseCircleAdd,
        refreshCircleAdds,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
