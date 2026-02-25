"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles, Heart, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { calculateCompatibility, isSoulmateMatch, getCompatibilityLabel, lifePathData, zodiacDescriptions, chineseAnimalDescriptions } from "@/lib/cosmic-calculations";
import { generateReport } from "@/lib/report-generator";
import { sampleProfiles } from "@/data/profiles";
import { GlassCard, CosmicButton, Badge, SectionHeader } from "@/components/ui";
import type { UserProfile } from "@/types/profile";
import type { CompatibilityReportData } from "@/lib/report-generator";

// --- Types ---
type ReactionType = "supernova" | "shootingStar" | "constellation";

interface SectionState {
  viewed: boolean;
  reaction?: ReactionType;
}

interface StellarStoriesViewProps {
  currentUser: UserProfile;
  onUpgradeRequired?: (trigger: string) => void;
}

// --- Reaction Button ---
const REACTIONS: { type: ReactionType; icon: string; label: string; color: string }[] = [
  { type: "supernova", icon: "💥", label: "Supernova", color: "#ec4899" },
  { type: "shootingStar", icon: "🌠", label: "Shooting Star", color: "#a855f7" },
  { type: "constellation", icon: "✨", label: "Constellation", color: "#06b6d4" },
];

function ReactionBurst({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 100 }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * 360;
        const dist = 30 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function ReactionBar({ onReact }: { onReact: (type: ReactionType, e: React.MouseEvent) => void }) {
  return (
    <div className="flex items-center gap-2">
      {REACTIONS.map(r => (
        <motion.button
          key={r.type}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => onReact(r.type, e)}
        >
          <span>{r.icon}</span>
          <span className="text-slate-400">{r.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

// --- Score Reveal ---
function ScoreReveal({ score, sectionsViewed, totalSections, label, color }: {
  score: number;
  sectionsViewed: number;
  totalSections: number;
  label: string;
  color: string;
}) {
  const blurAmount = Math.max(0, 30 - (sectionsViewed / totalSections) * 30);
  const revealed = blurAmount < 5;

  return (
    <div className="text-center py-6">
      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Cosmic Compatibility</span>
      <motion.div
        className="relative inline-block"
        animate={{ filter: `blur(${blurAmount}px)` }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-6xl font-black" style={{ color }}>
          {score}%
        </span>
      </motion.div>
      {revealed ? (
        <motion.p
          className="text-sm mt-2"
          style={{ color }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.p>
      ) : (
        <p className="text-xs text-slate-500 mt-2">
          View more sections to reveal ({sectionsViewed}/{totalSections})
        </p>
      )}
    </div>
  );
}

// --- Shooting Stars for Soulmate ---
function ShootingStars() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-300 rounded-full"
          style={{
            top: `${10 + Math.random() * 30}%`,
            left: `${-10}%`,
            boxShadow: "0 0 6px #fbbf24, 0 0 12px #f59e0b",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, window?.innerWidth ? window.innerWidth * 1.2 : 500],
            y: [0, 100 + Math.random() * 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.2 + Math.random() * 0.5,
            delay: i * 0.3,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// --- Main Component ---
export default function StellarStoriesView({ currentUser }: StellarStoriesViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sections, setSections] = useState<Record<string, SectionState>>({});
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [showSoulmate, setShowSoulmate] = useState(false);
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const burstId = useRef(0);

  const profiles = useMemo(() => {
    return sampleProfiles
      .filter(p => p.id !== currentUser.id)
      .map(profile => {
        const compat = calculateCompatibility(currentUser, profile);
        return { profile, score: Math.round(compat.overall), compat };
      })
      .sort((a, b) => b.score - a.score);
  }, [currentUser]);

  const current = profiles[currentIndex];
  if (!current) return null;

  const { profile, score, compat } = current;
  const report = useMemo(() => generateReport(currentUser, profile), [currentUser, profile]);
  const compatLabel = getCompatibilityLabel(score);
  const isSoulmate = isSoulmateMatch(currentUser, profile);
  const lpData = lifePathData[profile.lifePath];
  const zodiacData = zodiacDescriptions[profile.westernZodiac.sign];
  const chineseData = chineseAnimalDescriptions[profile.chineseZodiac.animal];

  // Track which sections are viewed
  const sectionIds = ["hero", "prompts", "score", "numerology", "western", "chinese"];
  const viewedCount = sectionIds.filter(id => sections[`${profile.id}-${id}`]?.viewed).length;

  const markViewed = useCallback((sectionId: string) => {
    const key = `${profile.id}-${sectionId}`;
    setSections(prev => prev[key]?.viewed ? prev : { ...prev, [key]: { ...prev[key], viewed: true } });
  }, [profile.id]);

  const handleReact = useCallback((sectionId: string, type: ReactionType, e: React.MouseEvent) => {
    const key = `${profile.id}-${sectionId}`;
    setSections(prev => ({ ...prev, [key]: { ...prev[key], viewed: true, reaction: type } }));
    const reaction = REACTIONS.find(r => r.type === type);
    if (reaction) {
      const id = ++burstId.current;
      setBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY, color: reaction.color }]);
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700);
    }
  }, [profile.id]);

  const goNext = useCallback(() => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex, profiles.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex]);

  const handleConnect = useCallback(() => {
    setConnected(prev => new Set(prev).add(profile.id));
    if (isSoulmate) {
      setShowSoulmate(true);
      setTimeout(() => setShowSoulmate(false), 2500);
    }
  }, [profile.id, isSoulmate]);

  // Connect button intensity based on scroll/sections viewed
  const connectIntensity = Math.min(1, viewedCount / sectionIds.length);

  return (
    <div className="relative">
      {/* Reaction bursts */}
      {bursts.map(b => <ReactionBurst key={b.id} x={b.x} y={b.y} color={b.color} />)}

      {/* Soulmate shooting stars */}
      <AnimatePresence>
        {showSoulmate && <ShootingStars />}
      </AnimatePresence>

      {/* Profile counter */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} className="text-slate-400" />
        </button>
        <span className="text-xs text-slate-500">
          {currentIndex + 1} of {profiles.length}
        </span>
        <button
          onClick={goNext}
          disabled={currentIndex >= profiles.length - 1}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1.5 mb-3">
        <Eye size={12} className="text-slate-500" />
        <div className="flex-1 flex gap-0.5">
          {sectionIds.map(id => (
            <div
              key={id}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                sections[`${profile.id}-${id}`]?.viewed ? "bg-purple-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-500">{viewedCount}/{sectionIds.length}</span>
      </div>

      {/* Scrollable content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          ref={scrollContainerRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="space-y-4 overflow-y-auto max-h-[65vh] pr-1 scrollbar-thin"
        >
          {/* Section 1: Hero Photo */}
          <motion.div
            onViewportEnter={() => markViewed("hero")}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-3xl font-black text-white">{profile.name}, {profile.age}</h2>
                  <p className="text-sm text-slate-300 mt-1">{profile.location}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{profile.occupation}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="purple">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</Badge>
                    <Badge variant="amber">Path {profile.lifePath}</Badge>
                    <Badge variant="blue">{profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}</Badge>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-3 pt-2">
                <ReactionBar onReact={(type, e) => handleReact("hero", type, e)} />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => markViewed("prompts")}
          >
            <GlassCard tier="default" className="p-4">
              <SectionHeader>Their Story</SectionHeader>
              <div className="space-y-4 mt-3">
                {profile.prompts.slice(0, 3).map((prompt, i) => (
                  <div key={i}>
                    <p className="text-xs text-slate-500 italic">{prompt.question}</p>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">{prompt.answer}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <ReactionBar onReact={(type, e) => handleReact("prompts", type, e)} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Section 3: Score Reveal (blurred until sections viewed) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => markViewed("score")}
          >
            <GlassCard
              tier="strong"
              className="p-4"
              style={isSoulmate && viewedCount >= 4 ? {
                background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(236,72,153,0.1))",
              } : undefined}
            >
              <ScoreReveal
                score={score}
                sectionsViewed={viewedCount}
                totalSections={sectionIds.length}
                label={compatLabel.label}
                color={compatLabel.color}
              />
              {viewedCount >= 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 mt-2"
                >
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-300">{Math.round(compat.western)}</div>
                      <div className="text-[10px] text-slate-500">Western</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-300">{Math.round(compat.lifePath)}</div>
                      <div className="text-[10px] text-slate-500">Numerology</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyan-300">{Math.round(compat.chinese)}</div>
                      <div className="text-[10px] text-slate-500">Chinese</div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div className="mt-3">
                <ReactionBar onReact={(type, e) => handleReact("score", type, e)} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Section 4: Numerology Deep Dive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => markViewed("numerology")}
          >
            <GlassCard tier="default" className="p-4">
              <SectionHeader>Numerology Insight</SectionHeader>
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-black text-amber-300">{profile.lifePath}</span>
                  <span className="text-sm text-slate-300">{lpData?.name || `Life Path ${profile.lifePath}`}</span>
                </div>
                {lpData && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lpData.traits.slice(0, 4).map(t => (
                      <Badge key={t} variant="amber">{t}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {report.numerologySection.analysis.slice(0, 200)}...
                </p>
              </div>
              <div className="mt-3">
                <ReactionBar onReact={(type, e) => handleReact("numerology", type, e)} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Section 5: Western Zodiac */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => markViewed("western")}
          >
            <GlassCard tier="default" className="p-4">
              <SectionHeader>Western Zodiac</SectionHeader>
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{profile.westernZodiac.symbol}</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{profile.westernZodiac.sign}</span>
                    <span className="text-xs text-slate-500 ml-2">{profile.westernZodiac.element} element</span>
                  </div>
                </div>
                {zodiacData && (
                  <>
                    <p className="text-xs text-slate-400 mb-2">{zodiacData.traits}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Ruler:</span>
                      <Badge variant="purple">{zodiacData.ruler}</Badge>
                    </div>
                  </>
                )}
                <p className="text-xs text-slate-400 leading-relaxed mt-3">
                  {report.westernSection.analysis.slice(0, 200)}...
                </p>
              </div>
              <div className="mt-3">
                <ReactionBar onReact={(type, e) => handleReact("western", type, e)} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Section 6: Chinese Zodiac */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => markViewed("chinese")}
          >
            <GlassCard tier="default" className="p-4">
              <SectionHeader>Chinese Zodiac</SectionHeader>
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{profile.chineseZodiac.symbol}</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{profile.chineseZodiac.fullName}</span>
                  </div>
                </div>
                {chineseData && (
                  <>
                    <p className="text-xs text-slate-400 mb-2">{chineseData.traits}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {chineseData.luckyColors.slice(0, 3).map(c => (
                        <Badge key={c} variant="green">{c}</Badge>
                      ))}
                    </div>
                  </>
                )}
                <p className="text-xs text-slate-400 leading-relaxed mt-3">
                  {report.chineseSection.analysis.slice(0, 200)}...
                </p>
              </div>
              <div className="mt-3">
                <ReactionBar onReact={(type, e) => handleReact("chinese", type, e)} />
              </div>
            </GlassCard>
          </motion.div>

          {/* "Why You Match" Narrative */}
          {viewedCount >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard tier="strong" className="p-4">
                <SectionHeader>Why You Match</SectionHeader>
                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-xs text-emerald-400 font-medium">Strengths</span>
                    <ul className="mt-1 space-y-1">
                      {report.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs text-orange-400 font-medium">Challenges</span>
                    <ul className="mt-1 space-y-1">
                      {report.challenges.slice(0, 2).map((c, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                          <span className="text-orange-400 mt-0.5">~</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-slate-500 italic mt-2">{report.cosmicAdvice}</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Bottom spacer for floating bar */}
          <div className="h-20" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 pt-3 pb-1 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex items-center gap-3">
          <CosmicButton
            variant="secondary"
            size="md"
            fullWidth
            onClick={goNext}
          >
            Pass
          </CosmicButton>
          <CosmicButton
            variant="cosmic"
            size="md"
            fullWidth
            icon={<Heart size={16} />}
            onClick={handleConnect}
            disabled={connected.has(profile.id)}
            style={{
              boxShadow: `0 0 ${Math.round(connectIntensity * 20)}px rgba(168, 85, 247, ${connectIntensity * 0.4})`,
            }}
          >
            {connected.has(profile.id) ? "Connected" : "Connect"}
          </CosmicButton>
        </div>
        {viewedCount < 3 && (
          <motion.p
            className="text-[10px] text-slate-600 text-center mt-1.5"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to discover more about {profile.name}...
          </motion.p>
        )}
      </div>
    </div>
  );
}
