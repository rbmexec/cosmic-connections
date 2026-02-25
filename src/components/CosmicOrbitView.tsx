"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Clock, Sparkles, Star, Link2 } from "lucide-react";
import { calculateCompatibility, isSoulmateMatch, getCompatibilityLabel, lifePathData, zodiacDescriptions, chineseAnimalDescriptions } from "@/lib/cosmic-calculations";
import { generateReport } from "@/lib/report-generator";
import { sampleProfiles } from "@/data/profiles";
import { GlassCard, CosmicButton, Badge, SectionHeader } from "@/components/ui";
import type { UserProfile, CompatibilityResult } from "@/types/profile";

// --- Types ---
type RarityTier = "common" | "rare" | "legendary" | "soulmate";

interface OrbitProfile {
  profile: UserProfile;
  score: number;
  compat: CompatibilityResult;
  tier: RarityTier;
  angle: number;      // degrees on orbit
  orbitRadius: number; // 0-1 where 0 is center
  revealed: boolean;
}

interface CosmicOrbitViewProps {
  currentUser: UserProfile;
  onUpgradeRequired?: (trigger: string) => void;
}

// --- Constants ---
const DAILY_ORBITS = 5;
const REVEAL_STAGGER_MS = 600;
const CENTER_X = 160;
const CENTER_Y = 160;
const MAX_ORBIT_RADIUS = 130;
const MIN_ORBIT_RADIUS = 50;
const CONNECT_THRESHOLD = 40; // px from center to trigger connect

// --- Helpers ---
function getTier(score: number, isSoulmate: boolean): RarityTier {
  if (isSoulmate || score >= 90) return "soulmate";
  if (score >= 80) return "legendary";
  if (score >= 65) return "rare";
  return "common";
}

const TIER_RING: Record<RarityTier, string> = {
  common: "ring-2 ring-white/40",
  rare: "ring-2 ring-cyan-400",
  legendary: "ring-2 ring-amber-400",
  soulmate: "ring-2 ring-pink-400",
};

const TIER_GLOW: Record<RarityTier, string> = {
  common: "",
  rare: "shadow-[0_0_12px_rgba(6,182,212,0.4)]",
  legendary: "shadow-[0_0_16px_rgba(251,191,36,0.5)]",
  soulmate: "shadow-[0_0_20px_rgba(236,72,153,0.5)]",
};

const ELEMENT_RING_COLOR: Record<string, string> = {
  Fire: "border-red-500",
  Water: "border-blue-400",
  Earth: "border-amber-500",
  Air: "border-cyan-400",
};

// --- Floating Particle Field ---
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// --- Starburst Animation ---
function Starburst({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 20 + Math.random() * 15;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300 rounded-full"
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

// --- Orbiting Avatar ---
function OrbitAvatar({
  orbitProfile,
  onTap,
  onConnect,
  containerCenter,
}: {
  orbitProfile: OrbitProfile;
  onTap: (p: OrbitProfile) => void;
  onConnect: (p: OrbitProfile) => void;
  containerCenter: { x: number; y: number };
}) {
  const { profile, tier, angle, orbitRadius, revealed } = orbitProfile;
  const [showStarburst, setShowStarburst] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const radius = MIN_ORBIT_RADIUS + orbitRadius * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS);
  const x = CENTER_X + Math.cos((angle * Math.PI) / 180) * radius - 20;
  const y = CENTER_Y + Math.sin((angle * Math.PI) / 180) * radius - 20;

  const elementColor = ELEMENT_RING_COLOR[profile.westernZodiac.element] || "border-white/30";

  useEffect(() => {
    if (revealed) {
      setShowStarburst(true);
      const t = setTimeout(() => setShowStarburst(false), 700);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setIsDragging(false);
    const avatarX = x + 20 + info.offset.x;
    const avatarY = y + 20 + info.offset.y;
    const dist = Math.sqrt(
      Math.pow(avatarX - containerCenter.x, 2) + Math.pow(avatarY - containerCenter.y, 2)
    );
    if (dist < CONNECT_THRESHOLD) {
      onConnect(orbitProfile);
    }
  }, [x, y, containerCenter, orbitProfile, onConnect]);

  if (!revealed) return null;

  return (
    <>
      {showStarburst && <Starburst x={x + 20} y={y + 20} />}
      <motion.div
        className="absolute cursor-pointer"
        style={{ left: x, top: y }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        drag
        dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
        dragElastic={0.3}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.1 }}
        onClick={() => !isDragging && onTap(orbitProfile)}
      >
        <div className={`w-10 h-10 rounded-full overflow-hidden ${TIER_RING[tier]} ${TIER_GLOW[tier]} border-2 ${elementColor} relative`}>
          <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
        </div>
        {/* Score label */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-300 whitespace-nowrap">
          {orbitProfile.score}%
        </div>
        {/* Legendary/Soulmate particle trail */}
        {(tier === "legendary" || tier === "soulmate") && (
          <motion.div
            className={`absolute inset-0 rounded-full ${tier === "soulmate" ? "bg-pink-400/10" : "bg-amber-400/10"}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </>
  );
}

// --- Resonance Meter (3 concentric arcs) ---
function ResonanceMeter({ compat }: { compat: CompatibilityResult }) {
  const r1 = 18, r2 = 23, r3 = 28;
  const arc = (radius: number, pct: number) => {
    const sweep = (pct / 100) * 270;
    const startAngle = 135;
    const endAngle = startAngle + sweep;
    const x1 = 32 + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 32 + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 32 + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 32 + radius * Math.sin((endAngle * Math.PI) / 180);
    const large = sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <motion.path
        d={arc(r1, compat.lifePath)}
        fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.path
        d={arc(r2, compat.western)}
        fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.path
        d={arc(r3, compat.chinese)}
        fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <text x="32" y="36" textAnchor="middle" className="text-[10px] font-bold fill-white">
        {Math.round(compat.overall)}
      </text>
    </svg>
  );
}

// --- Connection Beam SVG ---
function ConnectionBeams({ connections }: { connections: [OrbitProfile, OrbitProfile][] }) {
  return (
    <svg className="absolute inset-0 pointer-events-none" width="320" height="320">
      {connections.map(([a, b], i) => {
        const r1 = MIN_ORBIT_RADIUS + a.orbitRadius * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS);
        const r2 = MIN_ORBIT_RADIUS + b.orbitRadius * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS);
        const x1 = CENTER_X + Math.cos((a.angle * Math.PI) / 180) * r1;
        const y1 = CENTER_Y + Math.sin((a.angle * Math.PI) / 180) * r1;
        const x2 = CENTER_X + Math.cos((b.angle * Math.PI) / 180) * r2;
        const y2 = CENTER_Y + Math.sin((b.angle * Math.PI) / 180) * r2;
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
          </motion.line>
        );
      })}
    </svg>
  );
}


// --- Main Component ---
export default function CosmicOrbitView({ currentUser }: CosmicOrbitViewProps) {
  const [orbits, setOrbits] = useState<OrbitProfile[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<OrbitProfile | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [connectionBeams, setConnectionBeams] = useState<[OrbitProfile, OrbitProfile][]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [dailyUsed, setDailyUsed] = useState(0);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Build orbit profiles
  const allOrbitProfiles = useMemo(() => {
    return sampleProfiles
      .filter(p => p.id !== currentUser.id)
      .map(profile => {
        const compat = calculateCompatibility(currentUser, profile);
        const score = Math.round(compat.overall);
        const soulmate = isSoulmateMatch(currentUser, profile);
        return {
          profile,
          score,
          compat,
          tier: getTier(score, soulmate),
          angle: 0,
          orbitRadius: 0,
          revealed: false,
        } satisfies OrbitProfile;
      })
      .sort(() => Math.random() - 0.5);
  }, [currentUser]);

  // Assign positions — higher compat = closer orbit
  const assignPositions = useCallback((profiles: OrbitProfile[]): OrbitProfile[] => {
    return profiles.map((p, i) => ({
      ...p,
      angle: (i / profiles.length) * 360 + Math.random() * 20,
      orbitRadius: 1 - (p.score / 100) * 0.8, // higher score = smaller radius = closer
    }));
  }, []);

  // Reveal next batch
  const revealNextBatch = useCallback(() => {
    if (dailyUsed >= DAILY_ORBITS) return;

    const batch = allOrbitProfiles
      .filter(p => !orbits.find(o => o.profile.id === p.profile.id))
      .slice(0, 5);

    if (batch.length === 0) return;

    const positioned = assignPositions(batch);
    setIsRevealing(true);

    // Stagger reveals
    const timers: ReturnType<typeof setTimeout>[] = [];
    positioned.forEach((p, i) => {
      const t = setTimeout(() => {
        setOrbits(prev => [...prev, { ...p, revealed: true }]);
        setRevealedCount(prev => prev + 1);
      }, i * REVEAL_STAGGER_MS);
      timers.push(t);
    });

    const endTimer = setTimeout(() => {
      setIsRevealing(false);
      setDailyUsed(prev => prev + 1);
    }, positioned.length * REVEAL_STAGGER_MS + 300);
    timers.push(endTimer);

    revealTimerRef.current = timers;
  }, [allOrbitProfiles, orbits, assignPositions, dailyUsed]);

  // Clean up timers
  useEffect(() => {
    return () => revealTimerRef.current.forEach(clearTimeout);
  }, []);

  // Auto-reveal first batch
  useEffect(() => {
    if (orbits.length === 0 && !isRevealing) {
      revealNextBatch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = useCallback((p: OrbitProfile) => {
    setSelectedProfile(p);
  }, []);

  const handleConnect = useCallback((p: OrbitProfile) => {
    setConnectedIds(prev => new Set(prev).add(p.profile.id));

    // Build constellation lines between connected profiles
    const connectedOrbits = orbits.filter(o => connectedIds.has(o.profile.id) || o.profile.id === p.profile.id);
    if (connectedOrbits.length >= 2) {
      const last = connectedOrbits[connectedOrbits.length - 2];
      const curr = connectedOrbits[connectedOrbits.length - 1] || p;
      const orbitP = orbits.find(o => o.profile.id === p.profile.id) || p;
      setConnectionBeams(prev => [...prev, [last, orbitP]]);
    }
  }, [connectedIds, orbits]);

  const report = useMemo(() => {
    if (!selectedProfile) return null;
    return generateReport(currentUser, selectedProfile.profile);
  }, [currentUser, selectedProfile]);

  const selectedCompatLabel = selectedProfile ? getCompatibilityLabel(selectedProfile.score) : null;

  return (
    <div className="space-y-3 relative">
      {/* Daily counter & timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-xs text-slate-400">
            {revealedCount} profiles revealed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500">
            {Math.max(0, DAILY_ORBITS - dailyUsed)} orbits remaining
          </span>
        </div>
      </div>

      {/* Constellation stats */}
      {connectedIds.size > 0 && (
        <div className="flex items-center gap-2">
          <Link2 size={12} className="text-violet-400" />
          <span className="text-xs text-violet-300">
            Your constellation: {connectedIds.size} stars, {connectionBeams.length} connections
          </span>
        </div>
      )}

      {/* Orbit Map */}
      <GlassCard tier="strong" className="relative overflow-hidden" style={{ height: 320 }}>
        <ParticleField />

        {/* Orbit rings */}
        <svg className="absolute inset-0 pointer-events-none" width="320" height="320">
          {[0.33, 0.55, 0.8].map((r, i) => (
            <circle
              key={i}
              cx={CENTER_X} cy={CENTER_Y}
              r={MIN_ORBIT_RADIUS + r * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS)}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Connection beams */}
        <ConnectionBeams connections={connectionBeams} />

        {/* Center — You */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: CENTER_X - 22, top: CENTER_Y - 22 }}
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] relative">
            <Image src={currentUser.photo} alt="You" fill className="object-cover" />
          </div>
          <span className="text-[8px] text-amber-300 mt-1 font-medium">YOU</span>
        </div>

        {/* Orbiting profiles */}
        {orbits.map(p => (
          <OrbitAvatar
            key={p.profile.id}
            orbitProfile={p}
            onTap={handleTap}
            onConnect={handleConnect}
            containerCenter={{ x: CENTER_X, y: CENTER_Y }}
          />
        ))}

        {/* Tier legend */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          {([
            ["common", "bg-white/40", "Common"],
            ["rare", "bg-cyan-400", "Rare"],
            ["legendary", "bg-amber-400", "Legend"],
            ["soulmate", "bg-pink-400", "Soul"],
          ] as const).map(([, color, label]) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
              <span className="text-[8px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Reveal button */}
      {dailyUsed < DAILY_ORBITS && !isRevealing && (
        <CosmicButton
          variant="cosmic"
          size="md"
          fullWidth
          icon={<Star size={16} />}
          onClick={revealNextBatch}
        >
          Reveal Next Orbit ({DAILY_ORBITS - dailyUsed} left)
        </CosmicButton>
      )}

      {isRevealing && (
        <motion.div
          className="flex justify-center py-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-xs text-purple-300">Revealing cosmic alignments...</span>
        </motion.div>
      )}

      {/* Profile Bottom Sheet */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-y-auto"
          >
            <div className="max-w-lg mx-auto bg-slate-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-5">
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="w-10 h-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                />
              </div>

              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 ${TIER_RING[selectedProfile.tier]} ${TIER_GLOW[selectedProfile.tier]}`}>
                  <img
                    src={selectedProfile.profile.photo}
                    alt={selectedProfile.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedProfile.profile.name}, {selectedProfile.profile.age}</h3>
                      <p className="text-xs text-slate-400">{selectedProfile.profile.location}</p>
                      <p className="text-xs text-slate-500">{selectedProfile.profile.occupation}</p>
                    </div>
                    <ResonanceMeter compat={selectedProfile.compat} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="purple">{selectedProfile.profile.westernZodiac.symbol} {selectedProfile.profile.westernZodiac.sign}</Badge>
                    <Badge variant="amber">Path {selectedProfile.profile.lifePath}</Badge>
                    <Badge variant="blue">{selectedProfile.profile.chineseZodiac.symbol} {selectedProfile.profile.chineseZodiac.fullName}</Badge>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Cosmic Resonance</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black" style={{ color: selectedCompatLabel?.color }}>
                      {selectedProfile.score}%
                    </span>
                    <span className="text-xs" style={{ color: selectedCompatLabel?.color }}>
                      {selectedCompatLabel?.label}
                    </span>
                  </div>
                </div>
                {/* Sub-scores */}
                <div className="flex gap-3 text-center">
                  <div>
                    <div className="text-sm font-bold text-amber-300">{Math.round(selectedProfile.compat.lifePath)}</div>
                    <div className="text-[9px] text-slate-500">Num</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-300">{Math.round(selectedProfile.compat.western)}</div>
                    <div className="text-[9px] text-slate-500">West</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cyan-300">{Math.round(selectedProfile.compat.chinese)}</div>
                    <div className="text-[9px] text-slate-500">Chi</div>
                  </div>
                </div>
              </div>

              {/* Prompts */}
              {selectedProfile.profile.prompts.length > 0 && (
                <div className="mt-4">
                  <SectionHeader>About</SectionHeader>
                  <div className="space-y-2 mt-2">
                    {selectedProfile.profile.prompts.slice(0, 2).map((prompt, i) => (
                      <div key={i}>
                        <p className="text-[10px] text-slate-500 italic">{prompt.question}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{prompt.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report highlights */}
              {report && (
                <div className="mt-4">
                  <SectionHeader>Why You Match</SectionHeader>
                  <ul className="mt-2 space-y-1">
                    {report.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">+</span> {s}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 italic mt-2">{report.cosmicAdvice}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <CosmicButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setSelectedProfile(null)}
                >
                  Close
                </CosmicButton>
                <CosmicButton
                  variant="cosmic"
                  size="md"
                  fullWidth
                  icon={<Sparkles size={16} />}
                  onClick={() => {
                    handleConnect(selectedProfile);
                    setSelectedProfile(null);
                  }}
                  disabled={connectedIds.has(selectedProfile.profile.id)}
                >
                  {connectedIds.has(selectedProfile.profile.id) ? "Connected" : "Pull to Connect"}
                </CosmicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag hint */}
      {orbits.length > 0 && !selectedProfile && connectedIds.size === 0 && (
        <motion.p
          className="text-[10px] text-slate-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, repeat: 2 }}
        >
          Tap a profile to view details, or drag toward center to connect
        </motion.p>
      )}
    </div>
  );
}
