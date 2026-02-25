"use client";

import { lazy, createElement } from "react";
import { Search, Calendar, Globe2, Orbit, BookOpen, Dices } from "lucide-react";
import { registerOverlay } from "@/components/OverlayOutlet";

registerOverlay("discovery", {
  component: lazy(() => import("@/components/DiscoveryView")),
  title: "Explore",
  titleIcon: createElement(Search, { size: 18, className: "text-amber-400" }),
});

registerOverlay("events", {
  component: lazy(() => import("@/components/EventsView")),
  title: "Events",
  titleIcon: createElement(Calendar, { size: 18, className: "text-amber-400" }),
});

registerOverlay("cosmicCalendar", {
  component: lazy(() => import("@/components/CosmicCalendar")),
  title: "Cosmic Calendar",
  titleIcon: createElement(Globe2, { size: 18, className: "text-purple-400" }),
});

registerOverlay("referralInbox", {
  component: lazy(() => import("@/components/ReferralInbox")),
  title: "Referral Inbox",
});

registerOverlay("zodiacRoulette", {
  component: lazy(() => import("@/components/ZodiacRouletteView")),
  title: "Zodiac Roulette",
  titleIcon: createElement(Dices, { size: 18, className: "text-purple-400" }),
});

registerOverlay("stellarStories", {
  component: lazy(() => import("@/components/StellarStoriesView")),
  title: "Stellar Stories",
  titleIcon: createElement(BookOpen, { size: 18, className: "text-pink-400" }),
});

registerOverlay("cosmicOrbit", {
  component: lazy(() => import("@/components/CosmicOrbitView")),
  title: "Cosmic Orbit",
  titleIcon: createElement(Orbit, { size: 18, className: "text-cyan-400" }),
});

registerOverlay("editInfo", {
  component: lazy(() => import("@/components/EditInfoPage")),
  variant: "fullscreen",
});
