"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";
import ModeSelector from "@/components/ModeSelector";
import PersonalCard from "@/components/PersonalCard";
import AttractionCard from "@/components/AttractionCard";
import BusinessCard from "@/components/BusinessCard";
import PartnerCard from "@/components/PartnerCard";
import SwipeActions from "@/components/SwipeActions";
import MatchModal from "@/components/MatchModal";
import { sampleProfiles } from "@/data/profiles";
import type { AppMode, UserProfile } from "@/types/profile";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("personal");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const profile = sampleProfiles[currentIndex % sampleProfiles.length];

  const advance = useCallback(
    (dir: "left" | "right") => {
      setDirection(dir);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % sampleProfiles.length);
        setDirection(null);
      }, 300);
    },
    []
  );

  const handleLike = useCallback(() => {
    // ~30% chance of match for demo
    if (Math.random() < 0.3) {
      setMatchedProfile(profile);
    }
    advance("right");
  }, [profile, advance]);

  const handlePass = useCallback(() => {
    advance("left");
  }, [advance]);

  return (
    <main className="min-h-screen relative">
      <CosmicBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} className="text-mode-personal" />
          <h1 className="text-xl font-bold font-serif bg-gradient-to-r from-mode-personal via-mode-partner to-mode-attraction bg-clip-text text-transparent">
            Cosmic Connections
          </h1>
          <Sparkles size={20} className="text-mode-partner" />
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector activeMode={mode} onModeChange={setMode} />
        </div>

        {/* Card Area */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${currentIndex}`}
              initial={{ opacity: 0, x: direction === "left" ? -100 : direction === "right" ? 100 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: direction === "left" ? -200 : direction === "right" ? 200 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {mode === "personal" && <PersonalCard profile={profile} />}
              {mode === "attraction" && <AttractionCard profile={profile} />}
              {mode === "business" && <BusinessCard profile={profile} />}
              {mode === "partner" && <PartnerCard profile={profile} />}
            </motion.div>
          </AnimatePresence>

          {/* Swipe Actions (not shown in Personal mode) */}
          {mode !== "personal" && (
            <div className="mt-4">
              <SwipeActions
                onPass={handlePass}
                onSuperLike={handleLike}
                onLike={handleLike}
              />
            </div>
          )}

          {/* Personal mode navigation */}
          {mode === "personal" && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setCurrentIndex((i) => (i - 1 + sampleProfiles.length) % sampleProfiles.length)}
                className="px-5 py-2.5 rounded-2xl glass-card text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">
                {(currentIndex % sampleProfiles.length) + 1} / {sampleProfiles.length}
              </span>
              <button
                onClick={() => setCurrentIndex((i) => (i + 1) % sampleProfiles.length)}
                className="px-5 py-2.5 rounded-2xl glass-card text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pb-4">
          <p className="text-[10px] text-slate-600">
            Cosmic Connections &middot; Ancient Wisdom Meets Modern Love
          </p>
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal profile={matchedProfile} onClose={() => setMatchedProfile(null)} />
    </main>
  );
}
