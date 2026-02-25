"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Lock } from "lucide-react";
import { useSubscription } from "@/lib/subscription-context";
import {
  calculateCompatibility,
  getCompatibilityLabel,
  isSoulmateMatch,
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
} from "@/lib/cosmic-calculations";
import { generateReport } from "@/lib/report-generator";
import type { UserProfile, AppMode } from "@/types/profile";

const fadeInView = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

function formatDate(yyyymm: string): string {
  const [year, month] = yyyymm.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

// ─── Mode-aware labels ───
const modeConfig = {
  attraction: {
    sectionTitle: "Chemistry Reading",
    scoreLabel: "Chemistry",
    numerologyTitle: "Magnetic Pull",
    westernTitle: "Romantic Chemistry",
    chineseTitle: "Social Spark",
    adviceTitle: "Attraction Insight",
    subScoreLabels: ["Passion", "Spark", "Magnetism"],
  },
  business: {
    sectionTitle: "Professional Synergy",
    scoreLabel: "Synergy",
    numerologyTitle: "Work Style Alignment",
    westernTitle: "Communication & Leadership",
    chineseTitle: "Strategic Compatibility",
    adviceTitle: "Professional Insight",
    subScoreLabels: ["Strategy", "Drive", "Collaboration"],
  },
  partner: {
    sectionTitle: "Partnership Blueprint",
    scoreLabel: "Partnership",
    numerologyTitle: "Shared Life Purpose",
    westernTitle: "Emotional Depth",
    chineseTitle: "Values & Legacy",
    adviceTitle: "Partnership Guidance",
    subScoreLabels: ["Emotional", "Growth", "Harmony"],
  },
  friend: {
    sectionTitle: "Friendship Frequency",
    scoreLabel: "Friendship",
    numerologyTitle: "Shared Energy",
    westernTitle: "Social Chemistry",
    chineseTitle: "Adventure Compatibility",
    adviceTitle: "Friendship Insight",
    subScoreLabels: ["Vibe", "Loyalty", "Fun"],
  },
} as const;

// ─── Mode-aware numerology narratives ───
function getNumerologyNarrative(
  mode: AppMode,
  score: number,
  userName: string,
  userLp: number,
  userLpName: string,
  profileName: string,
  profileLp: number,
  profileLpName: string,
): string {
  const pair = `Your Life Path ${userLp} (${userLpName}) and ${profileName}'s ${profileLp} (${profileLpName})`;

  if (mode === "attraction") {
    if (score >= 90) return `${pair} create an almost supernatural magnetic pull. This numerological bond suggests instant recognition — the kind of chemistry where conversations flow effortlessly and silences feel comfortable. Your life purposes don't just align, they amplify each other's most attractive qualities.`;
    if (score >= 75) return `${pair} generate genuine spark. Your energies complement each other in ways that create natural attraction — where one leads, the other follows instinctively. There's a playful tension between your paths that keeps things exciting.`;
    if (score >= 55) return `${pair} bring different flavors to the table, and that's exactly what creates intrigue. The mystery of your different approaches to life is what draws you together — you each have something the other finds fascinating.`;
    return `${pair} operate on contrasting frequencies, but opposites often create the most electric chemistry. The tension between your paths, when embraced, becomes magnetic rather than repelling. This is the kind of connection that surprises you.`;
  }

  if (mode === "business") {
    if (score >= 90) return `${pair} form a rare professional powerhouse. Your working styles are deeply complementary — you naturally divide responsibilities in ways that maximize both your strengths. Expect effortless collaboration, aligned vision, and shared drive toward ambitious goals.`;
    if (score >= 75) return `${pair} create strong professional synergy. Your approaches to work mesh well — one's strategic thinking complements the other's execution style. Decision-making feels natural, and you build on each other's ideas rather than competing.`;
    if (score >= 55) return `${pair} bring different professional strengths to the table. Where one focuses on vision, the other anchors in practicality. These contrasts, when leveraged well, create a more complete team than either could be alone.`;
    return `${pair} may approach work from very different angles — different priorities, different timelines, different definitions of success. But this creative friction often produces the most innovative partnerships. The key is clear communication and defined roles.`;
  }

  if (mode === "friend") {
    if (score >= 90) return `${pair} create the rare soul-friend connection. There's an instant comfort here — conversations that go for hours without noticing, the kind of ease that usually takes years to build. Your life energies amplify each other's best qualities.`;
    if (score >= 75) return `${pair} generate natural friendship chemistry. Your energies are complementary in the best way — it just feels easy. You bring out each other's playful side while also being someone the other can count on when it matters.`;
    if (score >= 55) return `${pair} bring different perspectives that make friendship genuinely interesting. You don't see the world the same way, and that's exactly what creates growth. Expect to learn from each other and expand your horizons.`;
    return `${pair} challenge each other in healthy ways. This is the kind of friendship built on honest feedback and real talk. You won't always agree, but the honesty between your paths creates a bond that's deeper than surface-level comfort.`;
  }

  // partner
  if (score >= 90) return `${pair} share what numerologists call a "destined bond." Your life purposes are woven together at a fundamental level — your goals, values, and vision for the future naturally align. This is the kind of partnership where both people help each other become who they're meant to be.`;
  if (score >= 75) return `${pair} create a strong foundation for long-term partnership. Your paths support each other's growth trajectory, and there's a natural understanding of what the other needs to thrive. Shared life decisions feel easier with this alignment.`;
  if (score >= 55) return `${pair} follow different life blueprints, but this means you each bring something the other lacks. The strongest partnerships aren't built on sameness — they're built on two people who complete each other's picture.`;
  return `${pair} may find that your long-term visions require intentional alignment — different life paths mean different default directions. The depth of this partnership depends on how willing both people are to build a shared vision that honors both paths.`;
}

// ─── Mode-aware western zodiac narratives ───
function getWesternNarrative(
  mode: AppMode,
  score: number,
  userSign: string,
  userElement: string,
  profileSign: string,
  profileElement: string,
): string {
  const sameElement = userElement === profileElement;

  if (mode === "attraction") {
    const elementIntro = sameElement
      ? `Both ${userElement} signs, you share an instinctive emotional language — the kind of understanding that makes attraction feel effortless and deep.`
      : `${userElement} meets ${profileElement} — this elemental contrast creates tension, and tension is the raw material of desire.`;

    if (score >= 90) return `${userSign} and ${profileSign}: ${elementIntro} This is one of astrology's most passionate pairings. Expect magnetic attraction, electric conversations, and the kind of chemistry that's hard to manufacture.`;
    if (score >= 70) return `${userSign} and ${profileSign}: ${elementIntro} Your signs create a natural romantic flow. There's a playful push-and-pull dynamic that keeps the attraction alive and evolving. You "get" each other in ways that others might miss.`;
    if (score >= 50) return `${userSign} and ${profileSign}: ${elementIntro} Your romantic styles differ, but that difference is what makes you curious about each other. The most captivating attractions are the ones you can't quite explain.`;
    return `${userSign} and ${profileSign}: ${elementIntro} Astrological friction creates some of the most passionate connections. What feels like a challenge at first often becomes the deepest attraction — you're drawn to what you can't easily understand.`;
  }

  if (mode === "business") {
    const elementIntro = sameElement
      ? `Sharing the ${userElement} element means you approach problems with similar instincts — decision-making is smoother, and you rarely clash on fundamentals.`
      : `${userElement} and ${profileElement} elements bring different cognitive styles to the table, which is actually a strategic advantage.`;

    if (score >= 90) return `${userSign} and ${profileSign}: ${elementIntro} Professionally, this pairing excels. Your communication styles are naturally compatible, your leadership approaches complement each other, and creative brainstorming between you produces exceptional ideas.`;
    if (score >= 70) return `${userSign} and ${profileSign}: ${elementIntro} In a professional context, your signs support productive collaboration. ${userSign}'s strengths cover ${profileSign}'s blind spots, and vice versa. Meetings are efficient, and delegation feels natural.`;
    if (score >= 50) return `${userSign} and ${profileSign}: ${elementIntro} Your professional styles may require adjustment — different pacing, different communication preferences. But diverse thinking is a competitive advantage. The key is respecting each other's process.`;
    return `${userSign} and ${profileSign}: ${elementIntro} Professionally, you'll need clear structure — defined roles, explicit expectations, and regular check-ins. The upside? When signs that don't naturally align learn to work together, they often outperform "easy" pairings because nothing is assumed.`;
  }

  if (mode === "friend") {
    const elementIntro = sameElement
      ? `Both ${userElement} signs, you share a wavelength that makes hangouts effortless — you recharge the same way and humor lands naturally.`
      : `${userElement} meets ${profileElement} — different energies that balance each other out, making your friendship richer than either vibe alone.`;

    if (score >= 90) return `${userSign} and ${profileSign}: ${elementIntro} This is one of the zodiac's best friendship pairings. Your social chemistry is off the charts — inside jokes develop instantly, plans come together easily, and you genuinely look forward to each other's company.`;
    if (score >= 70) return `${userSign} and ${profileSign}: ${elementIntro} Your signs create a natural friendship flow. Humor aligns well, energy levels match, and you have an easy time figuring out what to do together. This friendship has real staying power.`;
    if (score >= 50) return `${userSign} and ${profileSign}: ${elementIntro} Your friendship styles differ, but that's what keeps things fresh. One brings the plans, the other brings the spontaneity. You expand each other's social world in unexpected ways.`;
    return `${userSign} and ${profileSign}: ${elementIntro} Friendships between these signs take a little more effort, but that effort pays off. You challenge each other's comfort zones and bring perspectives the other wouldn't find elsewhere.`;
  }

  // partner
  const elementIntro = sameElement
    ? `Both ${userElement} signs, you share a deep intuitive understanding — your emotional needs, rhythms, and ways of processing the world are naturally in sync.`
    : `${userElement} meets ${profileElement} — your emotional languages differ, which means you'll teach each other entirely new ways of experiencing love and connection.`;

  if (score >= 90) return `${userSign} and ${profileSign}: ${elementIntro} This is a partnership written in the stars. You naturally support each other's emotional growth, navigate conflict with grace, and share a vision for what "home" and "family" mean.`;
  if (score >= 70) return `${userSign} and ${profileSign}: ${elementIntro} Your signs create a stable foundation for long-term partnership. There's a natural rhythm to your relationship — you know when to give space and when to come closer. Conflict resolution comes more easily than for most.`;
  if (score >= 50) return `${userSign} and ${profileSign}: ${elementIntro} As long-term partners, your different approaches to emotions and security require ongoing dialogue. But this difference keeps the relationship dynamic — you never stop discovering new layers of each other.`;
  return `${userSign} and ${profileSign}: ${elementIntro} Long-term partnership between these signs demands emotional maturity and radical honesty. But the reward is profound — a relationship forged through conscious effort is often more resilient than one that came easily.`;
}

// ─── Mode-aware chinese zodiac narratives ───
function getChineseNarrative(
  mode: AppMode,
  score: number,
  userAnimal: string,
  userElement: string,
  profileAnimal: string,
  profileElement: string,
): string {
  if (mode === "attraction") {
    if (score >= 85) return `The ${userAnimal} and ${profileAnimal} share one of the most naturally harmonious dynamics in Chinese astrology. Your ${userElement} and ${profileElement} energies create a social chemistry that's immediately obvious — you light up in each other's presence. Conversations flow, laughter comes easy, and there's a shared sense of adventure.`;
    if (score >= 65) return `The ${userAnimal} and ${profileAnimal} enjoy a warm, positive connection. Your social styles complement each other well — one brings energy while the other brings depth. The ${userElement}-${profileElement} interplay adds an intriguing layer of attraction that grows over time.`;
    if (score >= 45) return `The ${userAnimal} and ${profileAnimal} may not be an obvious pairing, but that's part of the appeal. Your social rhythms are different, which means every interaction teaches you something new. The mystery between your animal energies is what keeps the spark alive.`;
    return `The ${userAnimal} and ${profileAnimal} traditionally challenge each other's comfort zones. In the realm of attraction, this creates a "can't look away" dynamic — you're fascinated by what you don't understand about each other. Lean into the mystery.`;
  }

  if (mode === "business") {
    if (score >= 85) return `The ${userAnimal} and ${profileAnimal} form a highly effective professional partnership in Chinese astrology. Your ${userElement} and ${profileElement} energies create a balanced team — strategic thinking meets execution, vision meets pragmatism. Business decisions benefit from your combined wisdom.`;
    if (score >= 65) return `The ${userAnimal} and ${profileAnimal} bring complementary business instincts. The ${userElement} energy drives strategy while ${profileElement} anchors implementation. You challenge each other's ideas constructively, and the result is stronger decisions.`;
    if (score >= 45) return `The ${userAnimal} and ${profileAnimal} approach business from different philosophies — different risk tolerances, different timelines, different metrics for success. This diversity, when channeled well, creates more robust strategies. Define shared goals early.`;
    return `The ${userAnimal} and ${profileAnimal} in business require clear protocols. Your ${userElement} and ${profileElement} energies can clash under pressure, but this friction also prevents groupthink. The most disruptive partnerships are often the least "comfortable" ones.`;
  }

  if (mode === "friend") {
    if (score >= 85) return `The ${userAnimal} and ${profileAnimal} are natural adventure companions in Chinese astrology. Your ${userElement} and ${profileElement} energies create the perfect blend of loyalty and spontaneity — you're the friends who can go from deep conversation to an impromptu road trip without missing a beat.`;
    if (score >= 65) return `The ${userAnimal} and ${profileAnimal} share a warm, reliable friendship dynamic. Your humor styles complement each other, and there's an easy loyalty between your ${userElement} and ${profileElement} energies. You show up for each other without being asked.`;
    if (score >= 45) return `The ${userAnimal} and ${profileAnimal} bring different social styles to the friendship — one might be the planner while the other goes with the flow. Your ${userElement} and ${profileElement} energies create interesting contrast that keeps the friendship from ever feeling stale.`;
    return `The ${userAnimal} and ${profileAnimal} may have different ideas of what friendship looks like, but that's what makes this connection a growth experience. Your ${userElement} and ${profileElement} energies push each other to be more open-minded and adaptable.`;
  }

  // partner
  if (score >= 85) return `The ${userAnimal} and ${profileAnimal} represent one of the deepest bonds in Chinese astrology. Your ${userElement} and ${profileElement} energies create a home environment of harmony and mutual support. You share similar values around family, loyalty, and what matters most in life.`;
  if (score >= 65) return `The ${userAnimal} and ${profileAnimal} build a partnership on complementary strengths. Where one values tradition, the other brings fresh perspective. Your ${userElement}-${profileElement} balance means your household runs on both heart and practicality.`;
  if (score >= 45) return `The ${userAnimal} and ${profileAnimal} will need to build shared values consciously. Your instincts around home, family, and long-term planning may differ, but these differences — when openly discussed — create a richer life than either would build alone.`;
  return `The ${userAnimal} and ${profileAnimal} face a classic growth-partnership dynamic. Your ${userElement} and ${profileElement} energies push each other to evolve. Long-term partnership here isn't easy, but it's transformative. The question isn't compatibility — it's commitment to growing together.`;
}

// ─── Cosmic Gating Components ───

function CosmicLockOverlay({ targetTier }: { targetTier: "pro" | "cosmic_plus" }) {
  const isPro = targetTier === "pro";
  const handleUpgrade = () => {
    window.dispatchEvent(new CustomEvent("open-upgrade-modal"));
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-xl bg-black/40 rounded-2xl">
      <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
        <Lock size={24} className="text-violet-400" />
      </div>
      <p className="text-sm font-medium text-white/80 mb-1">
        {isPro ? "Unlock Cosmic Deep Dive" : "Unlock All Cosmic Modes"}
      </p>
      <p className="text-xs text-white/40 mb-4 text-center px-8">
        {isPro
          ? "Upgrade to see the full cosmic analysis behind your compatibility score"
          : "Upgrade to Cosmic+ for deep cosmic analysis in all modes"}
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleUpgrade}
        className={`px-6 py-2.5 rounded-2xl text-sm font-bold text-white shadow-lg ${
          isPro
            ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/20"
            : "bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/20"
        }`}
      >
        {isPro ? "Upgrade to Pro" : "Upgrade to Cosmic+"}
      </motion.button>
    </div>
  );
}

function GatedCosmicSection({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: AppMode;
}) {
  const { features } = useSubscription();

  // Determine if this section is locked and which tier to target
  let locked = false;
  let targetTier: "pro" | "cosmic_plus" = "pro";

  if (!features.deepCosmicReading) {
    // No deep reading at all → needs Pro
    locked = true;
    targetTier = "pro";
  } else if (!features.modeSpecificCosmic.includes(mode)) {
    // Has deep reading but not for this mode → needs Cosmic+
    locked = true;
    targetTier = "cosmic_plus";
  }

  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <CosmicLockOverlay targetTier={targetTier} />
    </div>
  );
}

interface ProfileStoryProps {
  profile: UserProfile;
  currentUser: UserProfile;
  mode: AppMode;
}

export default function ProfileStory({ profile, currentUser, mode }: ProfileStoryProps) {
  const compat = calculateCompatibility(currentUser, profile);
  const compatLabel = getCompatibilityLabel(compat.overall);
  const isSoulmate = isSoulmateMatch(currentUser, profile);
  const lp = lifePathData[profile.lifePath];
  const currentUserLp = lifePathData[currentUser.lifePath];
  const westernDesc = zodiacDescriptions[profile.westernZodiac.sign];
  const currentUserWesternDesc = zodiacDescriptions[currentUser.westernZodiac.sign];
  const chineseDesc = chineseAnimalDescriptions[profile.chineseZodiac.animal];
  const cosmicReport = generateReport(currentUser, profile);

  const cfg = modeConfig[mode as keyof typeof modeConfig] || modeConfig.attraction;

  // Mode-specific derived scores
  const subScore1 = Math.min(99, compat.western + Math.floor((compat.lifePath - compat.western) * 0.2));
  const subScore2 = Math.min(99, compat.lifePath + Math.floor((compat.chinese - compat.lifePath) * 0.15));
  const subScore3 = Math.min(99, compat.chinese + Math.floor((compat.western - compat.chinese) * 0.1));

  return (
    <div className="pb-32">
      {/* ── Hero Section ── */}
      <div className="relative h-[85vh] min-h-[500px]">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-light text-white tracking-tight"
          >
            {profile.name}
            <span className="text-white/50 ml-3">{profile.age}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex items-center gap-2"
          >
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-medium">
              {profile.occupation}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-1.5 flex items-center gap-1.5 text-white/40"
          >
            <MapPin size={12} />
            <span className="text-xs">{profile.location}</span>
          </motion.div>
        </div>
      </div>

      {/* ── Overall Score ── */}
      <motion.div {...fadeInView} className="px-6 py-10">
        <div className="flex items-end gap-4">
          <span className="text-7xl font-extralight tabular-nums" style={{ color: "#8b5cf6" }}>
            {compat.overall}
          </span>
          <div className="pb-2">
            <span className="text-sm font-medium" style={{ color: compatLabel.color }}>
              {compatLabel.label}
            </span>
            {isSoulmate && (
              <span className="ml-2 text-[10px] uppercase tracking-widest text-violet-400 font-semibold">
                Soulmate
              </span>
            )}
            <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] mt-0.5">
              {cfg.scoreLabel}
            </p>
          </div>
        </div>

        {/* Mode-specific sub-scores */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center py-3 border border-white/5 rounded-xl">
            <span className="text-2xl font-extralight text-white/80">{subScore1}</span>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mt-1">{cfg.subScoreLabels[0]}</p>
          </div>
          <div className="text-center py-3 border border-white/5 rounded-xl">
            <span className="text-2xl font-extralight text-white/80">{subScore2}</span>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mt-1">{cfg.subScoreLabels[1]}</p>
          </div>
          <div className="text-center py-3 border border-white/5 rounded-xl">
            <span className="text-2xl font-extralight text-white/80">{subScore3}</span>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mt-1">{cfg.subScoreLabels[2]}</p>
          </div>
        </div>
      </motion.div>

      <div className="w-12 h-px bg-white/5 mx-auto" />

      {/* ── Prompts ── */}
      {profile.prompts.length > 0 && (
        <div className="px-6 py-8 space-y-4">
          {profile.prompts.map((prompt, i) => (
            <motion.div
              key={i}
              {...fadeInView}
              transition={{ ...fadeInView.transition, delay: i * 0.1 }}
              className="py-4 border border-white/5 rounded-2xl px-5"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-500 font-medium mb-2">
                {prompt.question}
              </p>
              <p className="text-lg font-light text-white/80 leading-relaxed">
                {prompt.answer}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="w-12 h-px bg-white/5 mx-auto" />

      {/* ── Business Mode: Work Experience ── */}
      {mode === "business" && profile.workExperience && profile.workExperience.length > 0 && (
        <div className="px-6 py-8 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2">
            Experience
          </p>
          {profile.workExperience.map((exp, i) => (
            <motion.div
              key={i}
              {...fadeInView}
              transition={{ ...fadeInView.transition, delay: i * 0.08 }}
              className="flex gap-4 py-3"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase size={16} className="text-violet-500/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{exp.title}</p>
                <p className="text-xs text-violet-400/80">{exp.company}</p>
                <p className="text-[10px] text-white/30 mt-0.5">
                  {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                {exp.description && (
                  <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{exp.description}</p>
                )}
              </div>
            </motion.div>
          ))}
          <div className="w-12 h-px bg-white/5 mx-auto mt-4" />
        </div>
      )}

      {/* ── Partner Mode: Strengths & Growth ── */}
      {mode === "partner" && cosmicReport && (
        <GatedCosmicSection mode={mode}>
        <div className="px-6 py-8 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
            Why You Match
          </p>
          {cosmicReport.strengths.length > 0 && (
            <motion.div {...fadeInView}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-violet-500 font-semibold mb-3">Strengths</p>
              <div className="space-y-2">
                {cosmicReport.strengths.map((s, i) => (
                  <p key={i} className="text-sm font-light text-white/60 leading-relaxed">{s}</p>
                ))}
              </div>
            </motion.div>
          )}
          {cosmicReport.challenges.length > 0 && (
            <motion.div {...fadeInView}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-3">Growth Areas</p>
              <div className="space-y-2">
                {cosmicReport.challenges.map((c, i) => (
                  <p key={i} className="text-sm font-light text-white/50 leading-relaxed">{c}</p>
                ))}
              </div>
            </motion.div>
          )}
          <div className="w-12 h-px bg-white/5 mx-auto" />
        </div>
        </GatedCosmicSection>
      )}

      {/* ── Friend Mode: Shared Interests & Lifestyle ── */}
      {mode === "friend" && (
        <div className="px-6 py-8 space-y-6">
          {profile.interests && currentUser.interests && (() => {
            const shared = profile.interests!.filter(i => currentUser.interests!.includes(i));
            const unique = profile.interests!.filter(i => !currentUser.interests!.includes(i));
            if (shared.length === 0 && unique.length === 0) return null;
            return (
              <motion.div {...fadeInView}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3">
                  Shared Interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {shared.map(interest => (
                    <span key={interest} className="text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border text-violet-400 border-violet-500/30 bg-violet-500/10">
                      {interest}
                    </span>
                  ))}
                  {unique.map(interest => (
                    <span key={interest} className="text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border text-white/25 border-white/5">
                      {interest}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          {profile.lifestyle && currentUser.lifestyle && (() => {
            const keys: (keyof typeof profile.lifestyle)[] = ["pets", "drinking", "smoking", "workout", "socialMedia"];
            const matches = keys.filter(k => profile.lifestyle![k] && currentUser.lifestyle![k] && profile.lifestyle![k] === currentUser.lifestyle![k]);
            if (matches.length === 0) return null;
            return (
              <motion.div {...fadeInView}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3">
                  Lifestyle Alignment
                </p>
                <div className="space-y-2">
                  {matches.map(k => (
                    <div key={k} className="flex items-center gap-2 py-2 px-3 rounded-xl border border-violet-500/10 bg-violet-500/[0.03]">
                      <span className="text-[9px] uppercase tracking-[0.12em] text-white/30 w-20 shrink-0">{k}</span>
                      <span className="text-xs font-light text-violet-400/80">{profile.lifestyle![k]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          {profile.communicationStyle && currentUser.communicationStyle && (
            <motion.div {...fadeInView}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3">
                Communication Vibe
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">You</p>
                  <p className="text-xs font-light text-white/50">{currentUser.communicationStyle}</p>
                </div>
                <div className="p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">{profile.name}</p>
                  <p className="text-xs font-light text-white/50">{profile.communicationStyle}</p>
                </div>
              </div>
              {currentUser.communicationStyle === profile.communicationStyle && (
                <p className="text-[10px] text-violet-400/60 mt-2 italic">Same wavelength — you communicate the same way.</p>
              )}
            </motion.div>
          )}

          <div className="w-12 h-px bg-white/5 mx-auto" />
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ── COSMIC DEEP DIVE — Mode-Aware Analysis ── */}
      {/* ═══════════════════════════════════════════════ */}
      <GatedCosmicSection mode={mode}>
      <div className="px-6 py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2">
          {cfg.sectionTitle}
        </p>
        <p className="text-xs font-light text-white/20 leading-relaxed mb-10">
          {mode === "attraction"
            ? "How your cosmic profiles create chemistry, spark, and magnetic attraction."
            : mode === "business"
            ? "How your cosmic profiles align for professional collaboration and shared ambition."
            : mode === "friend"
            ? "How your cosmic profiles align for genuine friendship, shared adventures, and lasting loyalty."
            : "How your cosmic profiles weave together for deep, lasting partnership."}
        </p>

        {/* ──────────────────────────── */}
        {/* NUMEROLOGY DEEP DIVE        */}
        {/* ──────────────────────────── */}
        <motion.div {...fadeInView} className="mb-10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-500 font-semibold mb-6">
            {cfg.numerologyTitle}
          </p>

          {/* Side-by-side life paths */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">You</p>
              <span className="text-3xl font-extralight text-violet-500/70">{currentUser.lifePath}</span>
              <p className="text-sm font-medium text-white/60 mt-1">{currentUserLp?.name}</p>
              <p className="text-[10px] text-white/25 mt-1 leading-relaxed">{currentUserLp?.description}</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">{profile.name}</p>
              <span className="text-3xl font-extralight text-violet-500/70">{profile.lifePath}</span>
              <p className="text-sm font-medium text-white/60 mt-1">{lp?.name}</p>
              <p className="text-[10px] text-white/25 mt-1 leading-relaxed">{lp?.description}</p>
            </div>
          </div>

          {/* Trait comparison */}
          {currentUserLp?.traits && lp?.traits && (
            <div className="mb-5">
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/20 mb-2">Trait overlap</p>
              <div className="flex flex-wrap gap-1.5">
                {lp.traits.map((trait) => {
                  const shared = currentUserLp.traits.includes(trait);
                  return (
                    <span
                      key={trait}
                      className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border ${
                        shared
                          ? "text-violet-400 border-violet-500/30 bg-violet-500/10"
                          : "text-white/20 border-white/5"
                      }`}
                    >
                      {trait}{shared ? " *" : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Score bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">Numerology Score</span>
              <span className="text-sm font-extralight text-white/60">{compat.lifePath}</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-500/60"
                initial={{ width: 0 }}
                whileInView={{ width: `${compat.lifePath}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Mode-specific narrative */}
          <div className="p-4 rounded-2xl border border-violet-500/10 bg-violet-500/[0.03]">
            <p className="text-xs font-light text-white/45 leading-relaxed">
              {getNumerologyNarrative(
                mode, compat.lifePath,
                currentUser.name, currentUser.lifePath, currentUserLp?.name || `Life Path ${currentUser.lifePath}`,
                profile.name, profile.lifePath, lp?.name || `Life Path ${profile.lifePath}`,
              )}
            </p>
          </div>
        </motion.div>

        <div className="w-12 h-px bg-white/5 mx-auto mb-10" />

        {/* ──────────────────────────── */}
        {/* WESTERN ZODIAC DEEP DIVE    */}
        {/* ──────────────────────────── */}
        <motion.div {...fadeInView} className="mb-10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-500 font-semibold mb-6">
            {cfg.westernTitle}
          </p>

          {/* Side-by-side signs */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">You</p>
              <span className="text-3xl">{currentUser.westernZodiac.symbol}</span>
              <p className="text-sm font-medium text-white/60 mt-2">{currentUser.westernZodiac.sign}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{currentUser.westernZodiac.element}</p>
              {currentUserWesternDesc && (
                <p className="text-[10px] text-white/20 mt-2 leading-relaxed">{currentUserWesternDesc.traits}</p>
              )}
            </div>
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">{profile.name}</p>
              <span className="text-3xl">{profile.westernZodiac.symbol}</span>
              <p className="text-sm font-medium text-white/60 mt-2">{profile.westernZodiac.sign}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{profile.westernZodiac.element}</p>
              {westernDesc && (
                <p className="text-[10px] text-white/20 mt-2 leading-relaxed">{westernDesc.traits}</p>
              )}
            </div>
          </div>

          {/* Element + Ruler + Polarity details */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">Ruler</p>
              <p className="text-xs font-light text-white/50">{westernDesc?.ruler}</p>
            </div>
            <div className="p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">Element</p>
              <p className="text-xs font-light text-white/50">{profile.westernZodiac.element}</p>
            </div>
            <div className="p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">Polarity</p>
              <p className="text-xs font-light text-white/50">{westernDesc?.polarity === "Positive" ? "Yang" : "Yin"}</p>
            </div>
          </div>

          {/* Element description */}
          {elementDescriptions[profile.westernZodiac.element] && (
            <p className="text-xs font-light text-white/25 leading-relaxed mb-5">
              {elementDescriptions[profile.westernZodiac.element]}
            </p>
          )}

          {/* Compatible signs with "you" highlight */}
          {westernDesc && westernDesc.compatibleSigns.length > 0 && (
            <div className="mb-5">
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/20 mb-2">
                {profile.name}&apos;s most compatible signs
              </p>
              <div className="flex flex-wrap gap-1.5">
                {westernDesc.compatibleSigns.map((sign) => {
                  const isYou = sign === currentUser.westernZodiac.sign;
                  return (
                    <span
                      key={sign}
                      className={`text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${
                        isYou
                          ? "text-violet-400 border-violet-500/30 bg-violet-500/10"
                          : "text-white/25 border-white/5"
                      }`}
                    >
                      {sign}{isYou ? " (you)" : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Score bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">Western Score</span>
              <span className="text-sm font-extralight text-white/60">{compat.western}</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-500/60"
                initial={{ width: 0 }}
                whileInView={{ width: `${compat.western}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          {/* Mode-specific narrative */}
          <div className="p-4 rounded-2xl border border-violet-500/10 bg-violet-500/[0.03]">
            <p className="text-xs font-light text-white/45 leading-relaxed">
              {getWesternNarrative(
                mode, compat.western,
                currentUser.westernZodiac.sign, currentUser.westernZodiac.element,
                profile.westernZodiac.sign, profile.westernZodiac.element,
              )}
            </p>
          </div>
        </motion.div>

        <div className="w-12 h-px bg-white/5 mx-auto mb-10" />

        {/* ──────────────────────────── */}
        {/* CHINESE ZODIAC DEEP DIVE    */}
        {/* ──────────────────────────── */}
        <motion.div {...fadeInView} className="mb-10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-500 font-semibold mb-6">
            {cfg.chineseTitle}
          </p>

          {/* Side-by-side animals */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">You</p>
              <span className="text-3xl">{currentUser.chineseZodiac.symbol}</span>
              <p className="text-sm font-medium text-white/60 mt-2">{currentUser.chineseZodiac.fullName}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{currentUser.chineseZodiac.element} {currentUser.chineseZodiac.elementSymbol}</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 mb-2">{profile.name}</p>
              <span className="text-3xl">{profile.chineseZodiac.symbol}</span>
              <p className="text-sm font-medium text-white/60 mt-2">{profile.chineseZodiac.fullName}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{profile.chineseZodiac.element} {profile.chineseZodiac.elementSymbol}</p>
            </div>
          </div>

          {/* Element descriptions */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl border border-white/5">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">Your Element</p>
              <p className="text-[10px] font-light text-white/35 leading-relaxed">
                {chineseElementDescriptions[currentUser.chineseZodiac.element]?.split(".")[0]}.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-white/5">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1">Their Element</p>
              <p className="text-[10px] font-light text-white/35 leading-relaxed">
                {chineseElementDescriptions[profile.chineseZodiac.element]?.split(".")[0]}.
              </p>
            </div>
          </div>

          {/* Lucky numbers & colors */}
          {chineseDesc && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              {chineseDesc.luckyNumbers.length > 0 && (
                <div className="p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1.5">Lucky Numbers</p>
                  <div className="flex gap-2">
                    {chineseDesc.luckyNumbers.map((n) => (
                      <span key={n} className="text-sm font-light text-violet-400/60">{n}</span>
                    ))}
                  </div>
                </div>
              )}
              {chineseDesc.luckyColors.length > 0 && (
                <div className="p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/20 mb-1.5">Lucky Colors</p>
                  <p className="text-[10px] font-light text-white/40">{chineseDesc.luckyColors.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          {/* Compatible & challenging animals */}
          {chineseDesc && (
            <div className="space-y-3 mb-5">
              {chineseDesc.compatibleAnimals.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-white/20 mb-2">Best matches</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chineseDesc.compatibleAnimals.map((animal) => {
                      const isYou = animal === currentUser.chineseZodiac.animal;
                      return (
                        <span
                          key={animal}
                          className={`text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${
                            isYou
                              ? "text-violet-400 border-violet-500/30 bg-violet-500/10"
                              : "text-white/25 border-white/5"
                          }`}
                        >
                          {animal}{isYou ? " (you)" : ""}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {chineseDesc.incompatibleAnimals.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-white/20 mb-2">Challenging matches</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chineseDesc.incompatibleAnimals.map((animal) => {
                      const isYou = animal === currentUser.chineseZodiac.animal;
                      return (
                        <span
                          key={animal}
                          className={`text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${
                            isYou
                              ? "text-amber-400/60 border-amber-500/20 bg-amber-500/5"
                              : "text-white/15 border-white/5"
                          }`}
                        >
                          {animal}{isYou ? " (you)" : ""}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Score bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">Chinese Score</span>
              <span className="text-sm font-extralight text-white/60">{compat.chinese}</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-500/60"
                initial={{ width: 0 }}
                whileInView={{ width: `${compat.chinese}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>

          {/* Mode-specific narrative */}
          <div className="p-4 rounded-2xl border border-violet-500/10 bg-violet-500/[0.03]">
            <p className="text-xs font-light text-white/45 leading-relaxed">
              {getChineseNarrative(
                mode, compat.chinese,
                currentUser.chineseZodiac.animal, currentUser.chineseZodiac.element,
                profile.chineseZodiac.animal, profile.chineseZodiac.element,
              )}
            </p>
          </div>
        </motion.div>

        <div className="w-12 h-px bg-white/5 mx-auto mb-10" />

        {/* ── Cosmic Advice ── */}
        {cosmicReport && (
          <motion.div {...fadeInView} className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4">
              {cfg.adviceTitle}
            </p>
            <p className="text-sm font-light text-white/45 leading-relaxed italic">
              {cosmicReport.cosmicAdvice}
            </p>
          </motion.div>
        )}
      </div>
      </GatedCosmicSection>
    </div>
  );
}
