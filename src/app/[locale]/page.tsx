"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Search, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";
import PersonalCard from "@/components/PersonalCard";
import MyCircleView from "@/components/MyCircleView";
import BlueprintView from "@/components/BlueprintView";
import BottomTabBar from "@/components/BottomTabBar";
import ProfileFeed from "@/components/ProfileFeed";
import MatchModal from "@/components/MatchModal";
import UpgradeModal from "@/components/UpgradeModal";
import OnboardingScreen from "@/components/OnboardingScreen";
import MessagesView from "@/components/MessagesView";
import DailyForecast from "@/components/DailyForecast";
import NotificationBell from "@/components/NotificationBell";
import InAppToast from "@/components/InAppToast";
import IcebreakerCommentInput from "@/components/IcebreakerCommentInput";
import CompatibilityQuiz from "@/components/CompatibilityQuiz";
import CompatibilityReport from "@/components/CompatibilityReport";
import RetrogradeAlert from "@/components/RetrogradeAlert";
import OverlayOutlet from "@/components/OverlayOutlet";
import TourGuide from "@/components/TourGuide";
import "@/overlays";
import { sampleProfiles } from "@/data/profiles";
import { getUserProfile, saveUserProfile } from "@/lib/user-storage";
import { calculateCompatibility } from "@/lib/cosmic-calculations";
import { useSubscription } from "@/lib/subscription-context";
import { useOverlay } from "@/lib/overlay-context";
import { getActiveAlerts } from "@/lib/retrograde-alerts";
import type { AppMode, UserProfile } from "@/types/profile";
import { type LocationFilter as LocationFilterType, extractCountry, matchesLocationFilter } from "@/lib/country-utils";
import type { NotificationData } from "@/types/notification";

export default function Home() {
  const t = useTranslations('common');
  const ts = useTranslations('subscription');
  const { data: session } = useSession();
  const { features, swipesUsed, swipesRemaining, recordSwipe, refreshSubscription } = useSubscription();
  const { openOverlay } = useOverlay();
  const [mode, setMode] = useState<AppMode>("attraction");
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [matchedId, setMatchedId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ matchId: string; profileId: string } | null>(null);
  const [circleOpen, setCircleOpen] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState<LocationFilterType>("all");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<string | undefined>(undefined);

  // New feature states
  const [toastNotification, setToastNotification] = useState<NotificationData | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [reportProfile, setReportProfile] = useState<UserProfile | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Tour state
  const [tourCompleted, setTourCompleted] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("cosmic_tour_completed") === "true";
  });
  const handleTourComplete = useCallback(() => {
    localStorage.setItem("cosmic_tour_completed", "true");
    setTourCompleted(true);
  }, []);

  // Icebreaker comment state
  const [icebreakerOpen, setIcebreakerOpen] = useState(false);
  const [pendingLikeProfile, setPendingLikeProfile] = useState<UserProfile | null>(null);

  // Track current profile index for icebreaker/match logic
  const [currentIndex, setCurrentIndex] = useState(0);

  const openUpgrade = useCallback((trigger?: string) => {
    setUpgradeTrigger(trigger);
    setUpgradeOpen(true);
  }, []);

  // Active retrograde alerts
  const activeAlerts = useMemo(() => {
    if (!currentUser) return [];
    return getActiveAlerts(currentUser.westernZodiac.sign);
  }, [currentUser]);

  const visibleAlert = activeAlerts.find((a) => !dismissedAlerts.has(a.id));

  // Handle ?subscription=success URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription") === "success") {
      refreshSubscription();
      const url = new URL(window.location.href);
      url.searchParams.delete("subscription");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [refreshSubscription]);

  // Listen for upgrade modal trigger from UserMenu
  useEffect(() => {
    const handler = () => openUpgrade(undefined);
    window.addEventListener("open-upgrade-modal", handler);
    return () => window.removeEventListener("open-upgrade-modal", handler);
  }, [openUpgrade]);

  useEffect(() => {
    const stored = getUserProfile();
    if (stored) {
      setCurrentUser(stored);
      setLoaded(true);
      return;
    }

    if (session?.user?.id) {
      fetch("/api/user/profile")
        .then((res) => res.ok ? res.json() : null)
        .then((dbProfile) => {
          if (dbProfile) {
            const profile: UserProfile = {
              id: session.user!.id!,
              name: dbProfile.name,
              age: dbProfile.age,
              birthYear: dbProfile.birthYear,
              birthMonth: dbProfile.birthMonth,
              birthDay: dbProfile.birthDay,
              location: dbProfile.location,
              country: dbProfile.country,
              occupation: dbProfile.occupation,
              photo: dbProfile.photo,
              lifePath: dbProfile.lifePath,
              westernZodiac: dbProfile.westernZodiac,
              chineseZodiac: dbProfile.chineseZodiac,
              prompts: dbProfile.prompts,
              workExperience: dbProfile.workExperience,
              projects: dbProfile.projects,
              currentWork: dbProfile.currentWork,
              school: dbProfile.school,
              photos: dbProfile.photos,
              bio: dbProfile.bio,
              interests: dbProfile.interests,
              pronouns: dbProfile.pronouns,
              heightCm: dbProfile.heightCm,
              relationshipGoal: dbProfile.relationshipGoal,
              relationshipType: dbProfile.relationshipType,
              languages: dbProfile.languages,
              gender: dbProfile.gender,
              genderVisible: dbProfile.genderVisible,
              sexualOrientation: dbProfile.sexualOrientation,
              orientationVisible: dbProfile.orientationVisible,
              educationLevel: dbProfile.educationLevel,
              familyPlans: dbProfile.familyPlans,
              communicationStyle: dbProfile.communicationStyle,
              loveStyle: dbProfile.loveStyle,
              lifestyle: dbProfile.lifestyle,
              spotifyAnthem: dbProfile.spotifyAnthem,
              hideAge: dbProfile.hideAge,
              hideDistance: dbProfile.hideDistance,
            };
            setCurrentUser(profile);
            saveUserProfile(profile);
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, [session?.user?.id]);

  const userCountry = currentUser?.country || extractCountry(currentUser?.location || "");

  const filteredProfiles = useMemo(() => {
    if (locationFilter === "all") return sampleProfiles;
    return sampleProfiles.filter((p) => {
      const pCountry = p.country || extractCountry(p.location);
      return matchesLocationFilter(pCountry, userCountry, locationFilter);
    });
  }, [locationFilter, userCountry]);

  const profile = filteredProfiles.length > 0
    ? filteredProfiles[currentIndex % filteredProfiles.length]
    : null;

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % (filteredProfiles.length || 1));
  }, [filteredProfiles.length]);

  const handleLike = useCallback(async () => {
    if (!profile) return;

    const allowed = await recordSwipe();
    if (!allowed) {
      openUpgrade("swipeLimit");
      return;
    }

    // If user has icebreaker comments enabled and profile has prompts, show icebreaker input
    if (features.icebreakerComments && profile.prompts.length > 0 && !icebreakerOpen) {
      setPendingLikeProfile(profile);
      setIcebreakerOpen(true);
      return;
    }

    await processLike(profile);
  }, [profile, recordSwipe, openUpgrade, features.icebreakerComments, icebreakerOpen]);

  const processLike = useCallback(async (likeProfile: UserProfile, icebreakerPromptIndex?: number, icebreakerComment?: string) => {
    if (Math.random() < 0.3 && currentUser) {
      const compat = calculateCompatibility(currentUser, likeProfile);
      try {
        const res = await fetch("/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchedProfileId: likeProfile.id,
            mode,
            score: compat.overall,
            icebreakerPromptIndex,
            icebreakerComment,
          }),
        });
        const match = await res.json();
        setMatchedId(match.id);
      } catch {
        setMatchedId(null);
      }
      setMatchedProfile(likeProfile);
    }
    advance();
  }, [advance, currentUser, mode]);

  const handlePass = useCallback(async () => {
    const allowed = await recordSwipe();
    if (!allowed) {
      openUpgrade("swipeLimit");
      return;
    }
    advance();
  }, [advance, recordSwipe, openUpgrade]);

  const handleMessage = useCallback((messageProfile: UserProfile, mId: string) => {
    setMatchedProfile(null);
    setMatchedId(null);
    setChatTarget({ matchId: mId, profileId: messageProfile.id });
    setMode("messages");
  }, []);

  const handleCloseMatch = useCallback(() => {
    setMatchedProfile(null);
    setMatchedId(null);
  }, []);

  const handleUpgradeRequired = useCallback((blockedMode: AppMode) => {
    openUpgrade(blockedMode);
  }, [openUpgrade]);

  const handleQuizComplete = useCallback((answers: Record<string, number>) => {
    if (currentUser) {
      const updated = { ...currentUser, compatibilityAnswers: answers };
      setCurrentUser(updated);
      saveUserProfile(updated);
    }
    setQuizOpen(false);
  }, [currentUser]);

  const handleModeChange = useCallback((m: AppMode) => {
    setMode(m);
    setCircleOpen(false);
    setBlueprintOpen(false);
    if (m !== "messages") setChatTarget(null);
  }, []);

  const showFeed = mode !== "personal" && mode !== "messages";
  const isSwipeLimited = features.dailySwipeLimit !== -1;

  if (!loaded) return null;

  if (!currentUser) {
    return <OnboardingScreen userId={session?.user?.id} sessionEmail={session?.user?.email ?? undefined} onComplete={(p) => setCurrentUser(p)} />;
  }

  return (
    <main className="min-h-[100dvh] relative bg-black">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col min-h-[100dvh]">
        {/* Header — simplified */}
        <header className="flex items-center justify-between px-4 pt-5 pb-3">
          <NotificationBell />
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-violet-500/60" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              astr
            </h1>
            <Sparkles size={14} className="text-violet-500/60" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openOverlay("discovery", { currentUser, onUpgradeRequired: openUpgrade })}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
            >
              <Search size={16} />
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Toast */}
        <div className="px-4">
          <InAppToast
            notification={toastNotification}
            onDismiss={() => setToastNotification(null)}
          />
        </div>

        {/* Retrograde Alert */}
        {features.retrogradeAlerts && visibleAlert && (
          <div className="px-4 pb-2">
            <RetrogradeAlert
              alert={visibleAlert}
              onDismiss={() => setDismissedAlerts((prev) => new Set(prev).add(visibleAlert.id))}
            />
          </div>
        )}

        {/* Daily Forecast */}
        {mode !== "messages" && features.dailyForecast && (
          <div className="px-4 pb-2">
            <DailyForecast user={currentUser} />
          </div>
        )}

        {/* Swipe counter for free users */}
        {showFeed && isSwipeLimited && (
          <div className="text-center pb-1">
            <span className="text-[10px] text-white/20 uppercase tracking-widest">
              {swipesUsed} / {features.dailySwipeLimit}
            </span>
          </div>
        )}

        {/* Content Area */}
        <div data-tour="profile-feed" className="flex-1 overflow-hidden pb-16">
          {mode === "personal" && (
            <div className="px-4 h-full overflow-y-auto">
              {circleOpen ? (
                <MyCircleView currentUser={currentUser} onBack={() => setCircleOpen(false)} />
              ) : blueprintOpen ? (
                <BlueprintView user={currentUser} onBack={() => setBlueprintOpen(false)} />
              ) : (
                <PersonalCard
                  profile={currentUser}
                  currentUser={currentUser}
                  allProfiles={sampleProfiles}
                  onOpenCircle={() => setCircleOpen(true)}
                  onOpenBlueprint={() => setBlueprintOpen(true)}
                  onUpgradeRequired={openUpgrade}
                  onProfileUpdate={(updated) => {
                    const newUser = { ...currentUser, ...updated };
                    setCurrentUser(newUser);
                    saveUserProfile(newUser);
                  }}
                  onOpenQuiz={() => setQuizOpen(true)}
                  onOpenCosmicCalendar={() => openOverlay("cosmicCalendar", { userZodiac: currentUser.westernZodiac.sign, onUpgradeRequired: openUpgrade })}
                />
              )}
            </div>
          )}

          {mode === "messages" && (
            <div className="flex-1 flex flex-col min-h-0 px-4" style={{ height: "calc(100dvh - 180px)" }}>
              <MessagesView
                initialMatchId={chatTarget?.matchId}
                initialProfileId={chatTarget?.profileId}
                currentUser={currentUser}
              />
            </div>
          )}

          {showFeed && (
            <ProfileFeed
              profiles={filteredProfiles}
              currentUser={currentUser}
              mode={mode}
              onLike={handleLike}
              onPass={handlePass}
            />
          )}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        mode={mode}
        onModeChange={handleModeChange}
        onUpgradeRequired={handleUpgradeRequired}
      />

      {/* Match Modal */}
      <MatchModal
        profile={matchedProfile}
        currentUser={currentUser}
        matchId={matchedId}
        onClose={handleCloseMatch}
        onMessage={handleMessage}
        onUpgradeRequired={openUpgrade}
        onViewReport={(p) => { setMatchedProfile(null); setReportProfile(p); }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger={upgradeTrigger}
      />

      {/* Icebreaker Comment Input */}
      {pendingLikeProfile && (
        <IcebreakerCommentInput
          open={icebreakerOpen}
          prompt={pendingLikeProfile.prompts[0] || { question: "", answer: "" }}
          onSendWithComment={(comment) => {
            setIcebreakerOpen(false);
            processLike(pendingLikeProfile, 0, comment);
            setPendingLikeProfile(null);
          }}
          onJustLike={() => {
            setIcebreakerOpen(false);
            processLike(pendingLikeProfile);
            setPendingLikeProfile(null);
          }}
          onClose={() => {
            setIcebreakerOpen(false);
            setPendingLikeProfile(null);
          }}
        />
      )}

      {/* Registered Overlays */}
      <OverlayOutlet />

      {/* Tour Guide */}
      {currentUser && !tourCompleted && (
        <TourGuide mode={mode} onModeChange={handleModeChange} onComplete={handleTourComplete} />
      )}

      {/* Compatibility Quiz */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-black/95" />
            <div className="relative z-10 h-full">
              <CompatibilityQuiz
                onComplete={handleQuizComplete}
                maxQuestions={features.compatibilityQuiz}
                existingAnswers={currentUser?.compatibilityAnswers}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compatibility Report */}
      <AnimatePresence>
        {reportProfile && currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <CompatibilityReport
              profile={reportProfile}
              currentUser={currentUser}
              onClose={() => setReportProfile(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
