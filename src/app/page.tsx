"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Bell, Settings } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";
import ModeSelector from "@/components/ModeSelector";
import PersonalCard from "@/components/PersonalCard";
import AttractionCard from "@/components/AttractionCard";
import BusinessCard from "@/components/BusinessCard";
import PartnerCard from "@/components/PartnerCard";
import SwipeCard from "@/components/SwipeCard";
import SwipeActions from "@/components/SwipeActions";
import MatchModal from "@/components/MatchModal";
import { sampleProfiles } from "@/data/profiles";
import type { AppMode, UserProfile } from "@/types/profile";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("attraction");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  const profile = sampleProfiles[currentIndex % sampleProfiles.length];
  const nextProfile = sampleProfiles[(currentIndex + 1) % sampleProfiles.length];

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % sampleProfiles.length);
  }, []);

  const handleLike = useCallback(() => {
    if (Math.random() < 0.3) {
      setMatchedProfile(profile);
    }
    advance();
  }, [profile, advance]);

  const handlePass = useCallback(() => {
    advance();
  }, [advance]);

  const showSwipe = mode !== "personal";

  return (
    <main className="min-h-[100dvh] relative">
      <CosmicBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between pt-5 pb-3">
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            >
              <Sparkles size={18} className="text-mode-partner" />
            </motion.div>
            <h1 className="text-lg font-bold tracking-tight text-gradient-cosmic">
              Cosmic Connections
            </h1>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, delay: 0.5 }}
            >
              <Sparkles size={18} className="text-mode-personal" />
            </motion.div>
          </div>
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-mode-partner border-2 border-cosmic-bg" />
          </button>
        </header>

        {/* Mode Selector */}
        <div className="pb-4">
          <ModeSelector activeMode={mode} onModeChange={setMode} />
        </div>

        {/* Card Area */}
        <div className="flex-1 flex flex-col justify-center pb-4">
          {/* Card Stack - shows ghost of next card behind */}
          <div className="relative">
            {/* Next card (behind) */}
            {showSwipe && (
              <div className="absolute inset-0 -z-10 scale-[0.95] opacity-50 blur-[1px] pointer-events-none translate-y-2">
                {mode === "attraction" && <AttractionCard profile={nextProfile} />}
                {mode === "business" && <BusinessCard profile={nextProfile} />}
                {mode === "partner" && <PartnerCard profile={nextProfile} />}
              </div>
            )}

            {/* Current card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <SwipeCard
                  onSwipeLeft={handlePass}
                  onSwipeRight={handleLike}
                  enabled={showSwipe}
                >
                  {mode === "personal" && <PersonalCard profile={profile} />}
                  {mode === "attraction" && <AttractionCard profile={profile} />}
                  {mode === "business" && <BusinessCard profile={profile} />}
                  {mode === "partner" && <PartnerCard profile={profile} />}
                </SwipeCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Actions */}
          {showSwipe && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5"
            >
              <SwipeActions
                onPass={handlePass}
                onSuperLike={handleLike}
                onLike={handleLike}
              />
            </motion.div>
          )}

          {/* Personal mode navigation */}
          {mode === "personal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-4 mt-5"
            >
              <button
                onClick={() => setCurrentIndex((i) => (i - 1 + sampleProfiles.length) % sampleProfiles.length)}
                className="px-6 py-2.5 rounded-2xl glass-card text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Previous
              </button>
              <div className="flex gap-1.5">
                {sampleProfiles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex % sampleProfiles.length
                        ? "bg-mode-personal w-4"
                        : "bg-slate-600 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentIndex((i) => (i + 1) % sampleProfiles.length)}
                className="px-6 py-2.5 rounded-2xl glass-card text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Next
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-5 pt-2">
          <p className="text-[10px] text-slate-600 tracking-wider">
            Ancient Wisdom &middot; Modern Connections
          </p>
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal profile={matchedProfile} onClose={() => setMatchedProfile(null)} />
    </main>
  );
}
