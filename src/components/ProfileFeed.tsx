"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, Heart, SearchX } from "lucide-react";
import ProfileStory from "@/components/ProfileStory";
import type { UserProfile, AppMode } from "@/types/profile";
import { hapticImpact, hapticNotification, ImpactStyle, NotificationType } from "@/lib/haptics";

interface ProfileFeedProps {
  profiles: UserProfile[];
  currentUser: UserProfile;
  mode: AppMode;
  onLike: () => void;
  onPass: () => void;
}

export default function ProfileFeed({ profiles, currentUser, mode, onLike, onPass }: ProfileFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const profile = profiles.length > 0 ? profiles[currentIndex % profiles.length] : null;

  const goNext = useCallback(
    (dir: number) => {
      if (profiles.length === 0) return;
      setDirection(dir);
      setCurrentIndex((i) => (i + 1) % profiles.length);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    },
    [profiles.length]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 100;
      if (info.offset.x < -threshold) {
        hapticImpact(ImpactStyle.Light);
        goNext(1);
        onPass();
      } else if (info.offset.x > threshold) {
        hapticNotification(NotificationType.Success);
        goNext(-1);
        onLike();
      }
    },
    [goNext, onLike, onPass]
  );

  const handlePass = useCallback(() => {
    hapticImpact(ImpactStyle.Light);
    goNext(1);
    onPass();
  }, [goNext, onPass]);

  const handleLike = useCallback(() => {
    hapticNotification(NotificationType.Success);
    goNext(-1);
    onLike();
  }, [goNext, onLike]);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <SearchX size={28} className="text-white/20" />
        </div>
        <p className="text-white/60 font-medium mb-1">No profiles found</p>
        <p className="text-white/30 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Scrollable profile area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {profile && (
            <motion.div
              key={`${mode}-${currentIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <ProfileStory
                profile={profile}
                currentUser={currentUser}
                mode={mode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Position dots */}
      {profiles.length > 1 && (
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
          {profiles.slice(0, Math.min(profiles.length, 10)).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === currentIndex % Math.min(profiles.length, 10)
                  ? "w-6 bg-violet-500"
                  : "w-3 bg-white/20"
              }`}
            />
          ))}
          {profiles.length > 10 && (
            <span className="text-[8px] text-white/20 ml-1">+{profiles.length - 10}</span>
          )}
        </div>
      )}

      {/* Sticky action buttons */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6 px-6 py-3 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePass}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-sm border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
          >
            <X size={24} strokeWidth={2} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleLike}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500 transition-all"
          >
            <Heart size={24} strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
