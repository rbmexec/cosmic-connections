"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Zap, Flame, Trophy, Star, RotateCw } from "lucide-react";
import { calculateCompatibility, isSoulmateMatch, getCompatibilityLabel, lifePathData, zodiacDescriptions, chineseAnimalDescriptions } from "@/lib/cosmic-calculations";
import { sampleProfiles } from "@/data/profiles";
import { GlassCard, CosmicButton, Badge } from "@/components/ui";
import type { UserProfile } from "@/types/profile";

// --- Types ---
type Phase = "idle" | "spinning" | "revealing" | "deciding" | "result";
type Decision = "pass" | "like" | "superAlign";

interface Achievement {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

interface ZodiacRouletteViewProps {
  currentUser: UserProfile;
  onUpgradeRequired?: (trigger: string) => void;
}

// --- Constants ---
const TIMER_DURATION = 10;
const REEL_SPIN_BASE = 1200;

const WESTERN_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const LIFE_PATHS = [1,2,3,4,5,6,7,8,9,11,22,33];
const CHINESE_ANIMALS = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

const SIGN_SYMBOLS: Record<string, string> = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const ANIMAL_SYMBOLS: Record<string, string> = {
  Rat:"🐀",Ox:"🐂",Tiger:"🐅",Rabbit:"🐇",Dragon:"🐉",Snake:"🐍",
  Horse:"🐎",Goat:"🐐",Monkey:"🐒",Rooster:"🐓",Dog:"🐕",Pig:"🐖",
};

// --- Reel Component ---
function SlotReel({ items, symbols, finalIndex, spinning, delay, onLocked }: {
  items: string[];
  symbols: Record<string, string>;
  finalIndex: number;
  spinning: boolean;
  delay: number;
  onLocked: () => void;
}) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!spinning) return;
    setLocked(false);
    let speed = 60;
    let elapsed = 0;

    const tick = () => {
      setDisplayIndex(prev => (prev + 1) % items.length);
      elapsed += speed;

      if (elapsed >= REEL_SPIN_BASE + delay) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayIndex(finalIndex);
        setLocked(true);
        onLocked();
        return;
      }

      // Decelerate
      if (elapsed > (REEL_SPIN_BASE + delay) * 0.7) {
        speed = Math.min(speed + 20, 200);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(tick, speed);
      }
    };

    intervalRef.current = setInterval(tick, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [spinning, finalIndex, delay, items.length, onLocked]);

  const item = items[displayIndex];
  const symbol = symbols[item] || "✦";

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-24 h-28 rounded-xl border-2 border-purple-500/40 bg-black/60 backdrop-blur-sm relative overflow-hidden"
      animate={locked ? {
        scale: [1, 1.1, 1],
        x: [0, -3, 3, -2, 2, 0],
      } : undefined}
      transition={locked ? { duration: 0.3, ease: "easeOut" } : undefined}
    >
      {/* Neon glow when locked */}
      {locked && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ boxShadow: "0 0 0px rgba(168, 85, 247, 0)" }}
          animate={{ boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
          transition={{ duration: 0.3 }}
        />
      )}
      <motion.span
        className="text-3xl"
        key={`${item}-${displayIndex}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.05 }}
      >
        {symbol}
      </motion.span>
      <span className="text-xs text-slate-300 mt-1 font-medium truncate w-full text-center px-1">
        {item}
      </span>
    </motion.div>
  );
}

// --- Timer Ring ---
function TimerRing({ duration, running, onExpire }: { duration: number; running: boolean; onExpire: () => void }) {
  const elapsed = useMotionValue(0);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = useTransform(elapsed, [0, duration], [0, circumference]);
  const color = useTransform(elapsed, [0, duration * 0.5, duration * 0.8, duration], ["#22c55e", "#eab308", "#f97316", "#ef4444"]);

  useEffect(() => {
    if (!running) { elapsed.set(0); return; }
    const start = Date.now();
    const frame = () => {
      const s = (Date.now() - start) / 1000;
      elapsed.set(Math.min(s, duration));
      if (s >= duration) { onExpire(); return; }
      requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [running, duration, elapsed, onExpire]);

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="absolute -top-1 -right-1">
      <motion.circle
        cx="48" cy="48" r="42"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ stroke: color, strokeDasharray: circumference, strokeDashoffset: dashOffset }}
        transform="rotate(-90 48 48)"
      />
    </svg>
  );
}

// --- Confetti Particle ---
function ConfettiParticle({ index }: { index: number }) {
  const angle = (index / 30) * 360;
  const dist = 100 + Math.random() * 150;
  const x = Math.cos((angle * Math.PI) / 180) * dist;
  const y = Math.sin((angle * Math.PI) / 180) * dist;
  const colors = ["#a855f7","#ec4899","#22c55e","#fbbf24","#06b6d4","#f472b6"];
  const c = colors[index % colors.length];

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: c, left: "50%", top: "50%" }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0, rotate: Math.random() * 720 }}
      transition={{ duration: 1.2 + Math.random() * 0.5, ease: "easeOut" }}
    />
  );
}

// --- Streak Fire Particle ---
function FireParticle({ index }: { index: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-orange-400"
      style={{ left: `${40 + Math.random() * 20}%`, bottom: 0 }}
      initial={{ y: 0, opacity: 0.8, scale: 1 }}
      animate={{ y: -(20 + Math.random() * 30), opacity: 0, scale: 0 }}
      transition={{ duration: 0.6 + Math.random() * 0.4, delay: index * 0.1, repeat: Infinity, repeatDelay: 0.2 }}
    />
  );
}


// --- Main Component ---
export default function ZodiacRouletteView({ currentUser }: ZodiacRouletteViewProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [reelsLocked, setReelsLocked] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showJackpot, setShowJackpot] = useState(false);
  const [streakLost, setStreakLost] = useState(false);
  const [score, setScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [profileQueue, setProfileQueue] = useState<UserProfile[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "firstSpin", label: "First Spin", icon: "🎰", unlocked: false },
    { id: "firstSoulmate", label: "First Soulmate", icon: "💫", unlocked: false },
    { id: "tenSpins", label: "10 Spins", icon: "🔟", unlocked: false },
    { id: "fiveStreak", label: "5-Streak", icon: "🔥", unlocked: false },
  ]);
  const [showTrophies, setShowTrophies] = useState(false);

  const timerRunning = phase === "deciding";

  // Build shuffled queue
  useEffect(() => {
    const others = sampleProfiles.filter(p => p.id !== currentUser.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    setProfileQueue(shuffled);
  }, [currentUser.id]);

  // Score counting animation
  useEffect(() => {
    if (phase !== "revealing" && phase !== "deciding") return;
    if (displayedScore >= score) return;
    const step = Math.max(1, Math.round((score - displayedScore) / 20));
    const id = setTimeout(() => {
      setDisplayedScore(prev => Math.min(prev + step, score));
    }, 30);
    return () => clearTimeout(id);
  }, [displayedScore, score, phase]);

  // Unlock achievements
  const unlock = useCallback((id: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
  }, []);

  const nextProfile = useCallback(() => {
    if (profileQueue.length === 0) return null;
    const [next, ...rest] = profileQueue;
    setProfileQueue(rest.length === 0
      ? sampleProfiles.filter(p => p.id !== currentUser.id).sort(() => Math.random() - 0.5)
      : rest);
    return next;
  }, [profileQueue, currentUser.id]);

  const handleSpin = useCallback(() => {
    const profile = nextProfile();
    if (!profile) return;

    setCurrentProfile(profile);
    setPhase("spinning");
    setReelsLocked(0);
    setShowJackpot(false);
    setStreakLost(false);
    setDisplayedScore(0);
    setSpinCount(prev => {
      const next = prev + 1;
      if (next === 1) unlock("firstSpin");
      if (next === 10) unlock("tenSpins");
      return next;
    });

    const compat = calculateCompatibility(currentUser, profile);
    setScore(Math.round(compat.overall));
  }, [nextProfile, currentUser, unlock]);

  const handleReelLocked = useCallback(() => {
    setReelsLocked(prev => {
      const next = prev + 1;
      if (next >= 3) {
        // All reels locked — start reveal
        setTimeout(() => setPhase("revealing"), 300);
        setTimeout(() => setPhase("deciding"), 2000);
      }
      return next;
    });
  }, []);

  const handleDecision = useCallback((decision: Decision) => {
    if (!currentProfile) return;

    if (decision === "pass") {
      if (streak > 0) {
        setStreakLost(true);
        setTimeout(() => setStreakLost(false), 800);
      }
      setStreak(0);
    } else {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak >= 5) unlock("fiveStreak");
      setLiked(prev => new Set(prev).add(currentProfile.id));

      // Jackpot check
      if (isSoulmateMatch(currentUser, currentProfile) || score >= 85) {
        unlock("firstSoulmate");
        setShowJackpot(true);
        setTimeout(() => setShowJackpot(false), 2500);
      }
    }

    setPhase("result");
    setTimeout(() => setPhase("idle"), showJackpot ? 2500 : 1200);
  }, [currentProfile, streak, bestStreak, currentUser, score, showJackpot, unlock]);

  const handleTimerExpire = useCallback(() => {
    handleDecision("pass");
  }, [handleDecision]);

  // Reel targets
  const westernIndex = currentProfile
    ? WESTERN_SIGNS.indexOf(currentProfile.westernZodiac.sign)
    : 0;
  const lifePathIndex = currentProfile
    ? LIFE_PATHS.indexOf(currentProfile.lifePath)
    : 0;
  const chineseIndex = currentProfile
    ? CHINESE_ANIMALS.indexOf(currentProfile.chineseZodiac.animal)
    : 0;

  const compatLabel = useMemo(() => getCompatibilityLabel(score), [score]);

  const oddsOfHighMatch = useMemo(() => {
    const total = profileQueue.length || 1;
    const high = profileQueue.filter(p => calculateCompatibility(currentUser, p).overall >= 80).length;
    return Math.round((high / total) * 100);
  }, [profileQueue, currentUser]);

  return (
    <div className="space-y-4 relative">
      {/* Jackpot Overlay */}
      <AnimatePresence>
        {showJackpot && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Gold flash */}
            <motion.div
              className="absolute inset-0 bg-amber-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8 }}
            />
            {/* Confetti */}
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
            {/* Jackpot text */}
            <motion.div
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.4, 1], rotate: [0, 5, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              JACKPOT! 💫
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen shake on streak lost */}
      <motion.div
        animate={streakLost ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : undefined}
        transition={{ duration: 0.4 }}
      >
        {/* HUD Top Bar */}
        <GlassCard tier="strong" className="p-3">
          <div className="flex items-center justify-between">
            {/* Streak */}
            <div className="flex items-center gap-2 relative">
              <Flame size={18} className={streak > 0 ? "text-orange-400" : "text-slate-600"} />
              <span className={`font-bold text-lg ${streak > 0 ? "text-orange-300" : "text-slate-500"}`}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={streak}
                    initial={{ y: streakLost ? 0 : -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, rotate: streakLost ? [0, 20, -20, 0] : 0 }}
                    exit={streakLost ? { y: 40, opacity: 0, rotate: 45 } : { y: 15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {streak}
                  </motion.span>
                </AnimatePresence>
              </span>
              {streak >= 3 && (
                <div className="relative">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FireParticle key={i} index={i} />
                  ))}
                </div>
              )}
              <span className="text-xs text-slate-500">streak</span>
            </div>

            {/* Spin counter */}
            <div className="flex items-center gap-1.5">
              <RotateCw size={14} className="text-purple-400" />
              <span className="text-sm text-slate-400">{spinCount} spins</span>
            </div>

            {/* Trophies button */}
            <button
              onClick={() => setShowTrophies(!showTrophies)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Trophy size={14} className="text-amber-400" />
              <span className="text-xs text-slate-400">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </button>
          </div>
        </GlassCard>

        {/* Trophy Case */}
        <AnimatePresence>
          {showTrophies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <GlassCard tier="subtle" className="p-3 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map(a => (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${a.unlocked ? "bg-amber-400/10" : "bg-white/5 opacity-40"}`}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs text-slate-300">{a.label}</span>
                      {a.unlocked && <Star size={10} className="text-amber-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Odds Meter */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-slate-500">Next high-compat chance:</span>
          <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${oddsOfHighMatch}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-medium text-purple-300">{oddsOfHighMatch}%</span>
        </div>

        {/* Slot Machine Frame */}
        <GlassCard tier="strong" className="p-5 mt-3 relative">
          {/* Neon border accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/50 rounded-br-2xl" />

          {/* Reel Labels */}
          <div className="flex justify-around mb-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Zodiac</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Life Path</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Animal</span>
          </div>

          {/* Reels */}
          <div className="flex justify-around gap-3">
            <SlotReel
              items={WESTERN_SIGNS}
              symbols={SIGN_SYMBOLS}
              finalIndex={westernIndex >= 0 ? westernIndex : 0}
              spinning={phase === "spinning"}
              delay={0}
              onLocked={handleReelLocked}
            />
            <SlotReel
              items={LIFE_PATHS.map(String)}
              symbols={Object.fromEntries(LIFE_PATHS.map(n => [String(n), `${n}`]))}
              finalIndex={lifePathIndex >= 0 ? lifePathIndex : 0}
              spinning={phase === "spinning"}
              delay={400}
              onLocked={handleReelLocked}
            />
            <SlotReel
              items={CHINESE_ANIMALS}
              symbols={ANIMAL_SYMBOLS}
              finalIndex={chineseIndex >= 0 ? chineseIndex : 0}
              spinning={phase === "spinning"}
              delay={800}
              onLocked={handleReelLocked}
            />
          </div>
        </GlassCard>

        {/* Profile Reveal */}
        <AnimatePresence mode="wait">
          {(phase === "revealing" || phase === "deciding" || phase === "result") && currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <GlassCard tier="default" className="p-4 mt-3 relative overflow-hidden">
                {/* Timer ring overlay */}
                {phase === "deciding" && (
                  <TimerRing duration={TIMER_DURATION} running={timerRunning} onExpire={handleTimerExpire} />
                )}

                <div className="flex items-center gap-4">
                  {/* Photo with blur-to-clear */}
                  <motion.div
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative"
                    initial={{ filter: "blur(30px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <img
                      src={currentProfile.photo}
                      alt={currentProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {/* Typewriter name */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">
                        {currentProfile.name.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </span>
                      <span className="text-slate-400">{currentProfile.age}</span>
                    </div>

                    {/* Location */}
                    <p className="text-xs text-slate-500 mt-0.5">{currentProfile.location}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="purple">
                        {currentProfile.westernZodiac.symbol} {currentProfile.westernZodiac.sign}
                      </Badge>
                      <Badge variant="amber">
                        Path {currentProfile.lifePath}
                      </Badge>
                      <Badge variant="blue">
                        {currentProfile.chineseZodiac.symbol} {currentProfile.chineseZodiac.animal}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Cosmic Score</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <motion.span
                        className="text-3xl font-black"
                        style={{ color: compatLabel.color }}
                      >
                        {displayedScore}
                      </motion.span>
                      <span className="text-xs" style={{ color: compatLabel.color }}>
                        {phase === "deciding" || phase === "result" ? compatLabel.label : "..."}
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: compatLabel.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cosmic Details */}
                {(phase === "deciding" || phase === "result") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "Western", desc: zodiacDescriptions[currentProfile.westernZodiac.sign]?.traits.slice(0, 40) },
                        { label: "Numerology", desc: lifePathData[currentProfile.lifePath]?.name },
                        { label: "Chinese", desc: chineseAnimalDescriptions[currentProfile.chineseZodiac.animal]?.traits.slice(0, 40) },
                      ].map((s) => (
                        <div key={s.label} className="text-xs">
                          <span className="text-slate-500 block">{s.label}</span>
                          <span className="text-slate-300 mt-0.5 block truncate">{s.desc || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-4">
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <CosmicButton
                variant="cosmic"
                size="lg"
                fullWidth
                icon={<Zap size={20} />}
                onClick={handleSpin}
              >
                Spin the Cosmos
              </CosmicButton>
              {spinCount > 0 && (
                <p className="text-xs text-slate-500">
                  Best streak: {bestStreak} · Liked: {liked.size}
                </p>
              )}
            </motion.div>
          )}

          {phase === "spinning" && (
            <div className="flex justify-center py-3">
              <motion.div
                className="flex items-center gap-2 text-purple-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <RotateCw size={16} className="animate-spin" />
                <span className="text-sm">Aligning cosmic forces...</span>
              </motion.div>
            </div>
          )}

          {phase === "deciding" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3"
            >
              <CosmicButton
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => handleDecision("pass")}
              >
                Pass
              </CosmicButton>
              <CosmicButton
                variant="primary"
                size="md"
                fullWidth
                icon={<Star size={16} />}
                onClick={() => handleDecision("like")}
              >
                Like
              </CosmicButton>
              <CosmicButton
                variant="cosmic"
                size="md"
                fullWidth
                icon={<Zap size={16} />}
                onClick={() => handleDecision("superAlign")}
              >
                Align
              </CosmicButton>
            </motion.div>
          )}

          {phase === "result" && (
            <div className="flex justify-center py-2">
              <motion.span
                className="text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Get ready for the next spin...
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
