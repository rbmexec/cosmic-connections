import type { UserProfile } from "@/types/profile";
import { lifePathData, zodiacDescriptions } from "@/lib/cosmic-calculations";

export interface DailyForecast {
  focusArea: string;
  luckyNumber: number;
  energyLevel: number; // 1-5
  compatibleSigns: string[];
  message: string;
  date: string; // YYYY-MM-DD
}

const focusAreas = [
  "Career & Ambition", "Love & Relationships", "Self-Discovery",
  "Health & Wellness", "Creativity", "Communication",
  "Financial Growth", "Spiritual Growth", "Adventure",
];

const messages: Record<string, string[]> = {
  Fire: [
    "Your fire burns bright today. Channel that passion into something meaningful.",
    "Bold moves are favored. Trust your instincts and take the lead.",
    "Your energy is magnetic today. Others will naturally gravitate toward you.",
  ],
  Earth: [
    "Ground yourself today. Patience will unlock unexpected rewards.",
    "Build something lasting. Your steady energy is your superpower right now.",
    "Trust the process. Slow and intentional moves pay off today.",
  ],
  Air: [
    "Your mind is razor-sharp today. Let ideas flow and connections form.",
    "Communication is your strength today. Say what you've been holding back.",
    "New perspectives await. Stay curious and open to the unexpected.",
  ],
  Water: [
    "Trust your intuition today. Your emotional depth is a gift right now.",
    "Let your empathy guide you. Deep connections are possible today.",
    "Flow with the current today. Resistance only creates more turbulence.",
  ],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getDateSeed(dateStr: string): number {
  return dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

export function generateDailyForecast(user: UserProfile): DailyForecast {
  const today = new Date().toISOString().split("T")[0];
  const dateSeed = getDateSeed(today);
  const userSeed = user.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(dateSeed + userSeed + user.lifePath);

  const element = user.westernZodiac.element;
  const elementMessages = messages[element] || messages.Fire;

  const focusArea = focusAreas[Math.floor(rng() * focusAreas.length)];
  const luckyNumber = Math.floor(rng() * 9) + 1;
  const energyLevel = Math.floor(rng() * 3) + 3; // 3-5 for generally positive
  const message = elementMessages[Math.floor(rng() * elementMessages.length)];

  // Pick 2-3 compatible signs for today
  const allSigns = Object.keys(zodiacDescriptions);
  const zodiac = zodiacDescriptions[user.westernZodiac.sign];
  const baseCompatible = zodiac?.compatibleSigns || [];

  // Mix base compatible signs with a random one for variety
  const shuffledSigns = allSigns
    .filter((s) => s !== user.westernZodiac.sign)
    .map((s) => ({ s, sort: rng() }))
    .sort((a, b) => a.sort - b.sort);

  const compatibleSigns = [
    baseCompatible[Math.floor(rng() * baseCompatible.length)] || shuffledSigns[0]?.s,
    shuffledSigns[0]?.s !== baseCompatible[0] ? shuffledSigns[0]?.s : shuffledSigns[1]?.s,
  ].filter((s): s is string => !!s).slice(0, 2);

  return {
    focusArea,
    luckyNumber,
    energyLevel,
    compatibleSigns,
    message,
    date: today,
  };
}
