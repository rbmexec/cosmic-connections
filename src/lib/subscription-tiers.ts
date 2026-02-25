import type { SubscriptionTier, TierFeatures } from "@/types/subscription";

export const tierFeatures: Record<SubscriptionTier, TierFeatures> = {
  free: {
    modes: ["personal", "attraction", "friend", "messages"],
    dailySwipeLimit: 10,
    showSubScores: false,
    cosmicBlueprint: false,
    dailyForecast: false,
    icebreakers: false,
    circleAddsIncluded: 1,
    spotifyInstagram: true,
    seeWhoLikedYou: false,
    undoLastSwipe: false,
    monthlyReading: false,
    verification: true,
    extendedPrompts: false,
    readReceipts: true,
    typingIndicators: false,
    conversationStarters: 0,
    discovery: true,
    discoveryAdvancedFilters: false,
    compatibilityQuiz: 5,
    quizComparison: false,
    events: true,
    eventsRsvp: false,
    voiceNotes: false,
    videoIntros: false,
    videoCall: false,
    compatibilityReport: false,
    referrals: false,
    retrogradeAlerts: false,
    icebreakerComments: false,
    deepCosmicReading: false,
    activeConversationLimit: 3,
    modeSpecificCosmic: [],
  },
  pro: {
    modes: ["personal", "attraction", "business", "partner", "friend", "messages"],
    dailySwipeLimit: -1,
    showSubScores: true,
    cosmicBlueprint: true,
    dailyForecast: true,
    icebreakers: true,
    circleAddsIncluded: 5,
    spotifyInstagram: true,
    seeWhoLikedYou: true,
    undoLastSwipe: false,
    monthlyReading: false,
    verification: true,
    extendedPrompts: true,
    readReceipts: true,
    typingIndicators: true,
    conversationStarters: 2,
    discovery: true,
    discoveryAdvancedFilters: false,
    compatibilityQuiz: 20,
    quizComparison: false,
    events: true,
    eventsRsvp: true,
    voiceNotes: true,
    videoIntros: false,
    videoCall: false,
    compatibilityReport: false,
    referrals: true,
    retrogradeAlerts: false,
    icebreakerComments: true,
    deepCosmicReading: true,
    activeConversationLimit: -1,
    modeSpecificCosmic: ["attraction"],
  },
  cosmic_plus: {
    modes: ["personal", "attraction", "business", "partner", "friend", "messages"],
    dailySwipeLimit: -1,
    showSubScores: true,
    cosmicBlueprint: true,
    dailyForecast: true,
    icebreakers: true,
    circleAddsIncluded: -1,
    spotifyInstagram: true,
    seeWhoLikedYou: true,
    undoLastSwipe: true,
    monthlyReading: true,
    verification: true,
    extendedPrompts: true,
    readReceipts: true,
    typingIndicators: true,
    conversationStarters: 5,
    discovery: true,
    discoveryAdvancedFilters: true,
    compatibilityQuiz: 20,
    quizComparison: true,
    events: true,
    eventsRsvp: true,
    voiceNotes: true,
    videoIntros: true,
    videoCall: true,
    compatibilityReport: true,
    referrals: true,
    retrogradeAlerts: true,
    icebreakerComments: true,
    deepCosmicReading: true,
    activeConversationLimit: -1,
    modeSpecificCosmic: ["attraction", "business", "partner", "friend"],
  },
};

export function canAccessMode(tier: SubscriptionTier, mode: string): boolean {
  return tierFeatures[tier].modes.includes(mode);
}

export function canAccessFeature(tier: SubscriptionTier, feature: keyof TierFeatures): boolean {
  const value = tierFeatures[tier][feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return true;
}

export function priceIdToTier(priceId: string): SubscriptionTier {
  const proMonthly = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
  const proYearly = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
  const cosmicPlus = process.env.STRIPE_COSMIC_PLUS_MONTHLY_PRICE_ID;

  if (priceId === proMonthly || priceId === proYearly) return "pro";
  if (priceId === cosmicPlus) return "cosmic_plus";
  return "free";
}
