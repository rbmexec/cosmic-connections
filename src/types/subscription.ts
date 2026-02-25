export type SubscriptionTier = "free" | "pro" | "cosmic_plus";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "inactive";

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface TierFeatures {
  modes: string[];
  dailySwipeLimit: number; // -1 = unlimited
  showSubScores: boolean;
  cosmicBlueprint: boolean;
  dailyForecast: boolean;
  icebreakers: boolean;
  circleAddsIncluded: number; // -1 = unlimited
  spotifyInstagram: boolean;
  seeWhoLikedYou: boolean;
  undoLastSwipe: boolean;
  monthlyReading: boolean;
  verification: boolean;
  extendedPrompts: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  conversationStarters: number;
  discovery: boolean;
  discoveryAdvancedFilters: boolean;
  compatibilityQuiz: number;
  quizComparison: boolean;
  events: boolean;
  eventsRsvp: boolean;
  voiceNotes: boolean;
  videoIntros: boolean;
  videoCall: boolean;
  compatibilityReport: boolean;
  referrals: boolean;
  retrogradeAlerts: boolean;
  icebreakerComments: boolean;
  deepCosmicReading: boolean;
  activeConversationLimit: number; // -1 = unlimited, positive = max
  modeSpecificCosmic: string[]; // which modes get deep cosmic analysis
}
