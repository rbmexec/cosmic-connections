import type { ChineseZodiac, CompatibilityResult, LifePathInfo, UserProfile, WesternZodiac } from "@/types/profile";

export const lifePathData: Record<number, LifePathInfo> = {
  1: { number: 1, name: "The Pioneer", traits: ["Independent", "Ambitious", "Original", "Self-driven", "Bold"], description: "Natural leaders who forge their own path" },
  2: { number: 2, name: "The Peacemaker", traits: ["Diplomatic", "Intuitive", "Sensitive", "Cooperative", "Patient"], description: "Harmonizers who excel in partnerships" },
  3: { number: 3, name: "The Creative", traits: ["Expressive", "Artistic", "Optimistic", "Charismatic", "Joyful"], description: "Artists and communicators who inspire others" },
  4: { number: 4, name: "The Builder", traits: ["Practical", "Reliable", "Disciplined", "Hardworking", "Loyal"], description: "Grounded souls who create lasting foundations" },
  5: { number: 5, name: "The Free Spirit", traits: ["Adventurous", "Dynamic", "Versatile", "Curious", "Magnetic"], description: "Freedom seekers who embrace change" },
  6: { number: 6, name: "The Nurturer", traits: ["Caring", "Responsible", "Protective", "Harmonious", "Loving"], description: "Natural caretakers devoted to family and home" },
  7: { number: 7, name: "The Seeker", traits: ["Analytical", "Introspective", "Spiritual", "Wise", "Mysterious"], description: "Truth seekers on a journey of inner discovery" },
  8: { number: 8, name: "The Powerhouse", traits: ["Ambitious", "Authoritative", "Successful", "Strategic", "Driven"], description: "Achievers destined for material and spiritual abundance" },
  9: { number: 9, name: "The Humanitarian", traits: ["Compassionate", "Generous", "Creative", "Wise", "Idealistic"], description: "Old souls here to serve humanity" },
  11: { number: 11, name: "The Master Intuitive", traits: ["Visionary", "Enlightened", "Inspiring", "Sensitive", "Spiritual"], description: "Master number with heightened intuition and spiritual gifts" },
  22: { number: 22, name: "The Master Builder", traits: ["Visionary", "Practical", "Powerful", "Disciplined", "Ambitious"], description: "Master number capable of turning dreams into reality" },
  33: { number: 33, name: "The Master Teacher", traits: ["Nurturing", "Wise", "Selfless", "Healing", "Devoted"], description: "Master number devoted to uplifting humanity" },
};

// ─── Numerology Compatibility (from screenshot charts) ───
// Perfect = 95, Good = 80, Neutral = 60, Hard = 35
// Soulmate pairs get a 100 bonus tier

// Soulmate pairs from the Soulmate Numerology chart
const soulmatePairs: [number, number][] = [
  [1, 9], [2, 8], [3, 9], [4, 7], [5, 6], [6, 9], [7, 8],
];

function isSoulmatePair(a: number, b: number): boolean {
  return soulmatePairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

// Numerology Name Compatibility Chart data
const numerologyCompat: Record<number, { perfect: number[]; good: number[]; neutral: number[]; hard: number[] }> = {
  1: { perfect: [1, 5, 7], good: [3, 9], neutral: [8], hard: [2, 4, 6] },
  2: { perfect: [2, 4, 8], good: [3, 6], neutral: [9], hard: [1, 5, 7] },
  3: { perfect: [3, 6, 9], good: [1, 2, 5], neutral: [], hard: [4, 7, 8] },
  4: { perfect: [2, 4, 8], good: [6, 7], neutral: [], hard: [1, 3, 5, 9] },
  5: { perfect: [1, 5, 7], good: [3, 9], neutral: [8], hard: [2, 4, 6] },
  6: { perfect: [3, 6, 9], good: [2, 4, 8], neutral: [], hard: [1, 5, 7] },
  7: { perfect: [1, 5, 7], good: [4], neutral: [9], hard: [2, 3, 6, 8] },
  8: { perfect: [2, 4, 8], good: [6], neutral: [1, 5], hard: [3, 7, 9] },
  9: { perfect: [3, 6, 9], good: [1, 5], neutral: [2, 7], hard: [4, 8] },
};

function getNumerologyScore(lp1: number, lp2: number): number {
  // Reduce master numbers for compatibility lookup
  const a = lp1 > 9 ? Math.floor(lp1 / 10) + (lp1 % 10) : lp1;
  const b = lp2 > 9 ? Math.floor(lp2 / 10) + (lp2 % 10) : lp2;

  if (isSoulmatePair(a, b)) return 100;

  const entry = numerologyCompat[a];
  if (!entry) return 60;

  if (entry.perfect.includes(b)) return 95;
  if (entry.good.includes(b)) return 80;
  if (entry.neutral.includes(b)) return 60;
  if (entry.hard.includes(b)) return 35;
  return 55;
}

// ─── Western Zodiac Compatibility (from 12x12 grid screenshot) ───
// Great Match (heart) = 95, Favorable (thumbs up) = 75, Not Favorable (X) = 30

type ZodiacCompatLevel = "great" | "favorable" | "not_favorable";

const westernZodiacCompat: Record<string, Record<string, ZodiacCompatLevel>> = {
  Aries:       { Aries: "great", Leo: "great", Sagittarius: "great", Taurus: "not_favorable", Virgo: "favorable", Capricorn: "not_favorable", Gemini: "great", Libra: "great", Aquarius: "great", Cancer: "not_favorable", Scorpio: "not_favorable", Pisces: "favorable" },
  Leo:         { Aries: "great", Leo: "great", Sagittarius: "great", Taurus: "favorable", Virgo: "not_favorable", Capricorn: "not_favorable", Gemini: "great", Libra: "great", Aquarius: "not_favorable", Cancer: "favorable", Scorpio: "favorable", Pisces: "not_favorable" },
  Sagittarius: { Aries: "great", Leo: "great", Sagittarius: "great", Taurus: "not_favorable", Virgo: "not_favorable", Capricorn: "not_favorable", Gemini: "great", Libra: "great", Aquarius: "great", Cancer: "not_favorable", Scorpio: "favorable", Pisces: "favorable" },
  Taurus:      { Aries: "not_favorable", Leo: "favorable", Sagittarius: "not_favorable", Taurus: "favorable", Virgo: "great", Capricorn: "great", Gemini: "not_favorable", Libra: "favorable", Aquarius: "not_favorable", Cancer: "great", Scorpio: "great", Pisces: "great" },
  Virgo:       { Aries: "favorable", Leo: "not_favorable", Sagittarius: "not_favorable", Taurus: "great", Virgo: "favorable", Capricorn: "great", Gemini: "not_favorable", Libra: "not_favorable", Aquarius: "not_favorable", Cancer: "great", Scorpio: "great", Pisces: "favorable" },
  Capricorn:   { Aries: "not_favorable", Leo: "not_favorable", Sagittarius: "not_favorable", Taurus: "great", Virgo: "great", Capricorn: "favorable", Gemini: "not_favorable", Libra: "not_favorable", Aquarius: "not_favorable", Cancer: "great", Scorpio: "great", Pisces: "great" },
  Gemini:      { Aries: "great", Leo: "great", Sagittarius: "great", Taurus: "not_favorable", Virgo: "not_favorable", Capricorn: "not_favorable", Gemini: "favorable", Libra: "great", Aquarius: "great", Cancer: "not_favorable", Scorpio: "not_favorable", Pisces: "not_favorable" },
  Libra:       { Aries: "favorable", Leo: "great", Sagittarius: "great", Taurus: "favorable", Virgo: "not_favorable", Capricorn: "not_favorable", Gemini: "great", Libra: "favorable", Aquarius: "great", Cancer: "not_favorable", Scorpio: "favorable", Pisces: "not_favorable" },
  Aquarius:    { Aries: "great", Leo: "not_favorable", Sagittarius: "great", Taurus: "not_favorable", Virgo: "not_favorable", Capricorn: "not_favorable", Gemini: "great", Libra: "great", Aquarius: "favorable", Cancer: "not_favorable", Scorpio: "favorable", Pisces: "not_favorable" },
  Cancer:      { Aries: "not_favorable", Leo: "favorable", Sagittarius: "not_favorable", Taurus: "great", Virgo: "great", Capricorn: "great", Gemini: "not_favorable", Libra: "not_favorable", Aquarius: "not_favorable", Cancer: "favorable", Scorpio: "great", Pisces: "great" },
  Scorpio:     { Aries: "not_favorable", Leo: "favorable", Sagittarius: "favorable", Taurus: "great", Virgo: "great", Capricorn: "great", Gemini: "not_favorable", Libra: "favorable", Aquarius: "favorable", Cancer: "great", Scorpio: "favorable", Pisces: "great" },
  Pisces:      { Aries: "favorable", Leo: "not_favorable", Sagittarius: "favorable", Taurus: "great", Virgo: "favorable", Capricorn: "great", Gemini: "not_favorable", Libra: "not_favorable", Aquarius: "not_favorable", Cancer: "great", Scorpio: "great", Pisces: "favorable" },
};

function getWesternScore(sign1: string, sign2: string): number {
  const level = westernZodiacCompat[sign1]?.[sign2];
  if (level === "great") return 95;
  if (level === "favorable") return 75;
  if (level === "not_favorable") return 30;
  return 55;
}

// ─── Chinese Zodiac Animal Compatibility (from screenshot) ───
// Most Compatible = 95, Symmetrically Compatible = 80, Neutral = 55, Incompatible = 30, Most Incompatible = 15

const chineseAnimalCompat: Record<string, { most: string[]; symmetric: string[]; incompatible: string[]; mostIncompatible: string[] }> = {
  Rat:     { most: ["Ox", "Pig"],         symmetric: ["Monkey", "Dragon"],    incompatible: ["Horse"],           mostIncompatible: ["Rabbit", "Rooster"] },
  Ox:      { most: ["Rat", "Tiger"],      symmetric: ["Snake", "Rooster"],    incompatible: ["Goat"],            mostIncompatible: ["Dragon", "Dog"] },
  Tiger:   { most: ["Ox", "Rabbit"],      symmetric: ["Horse", "Dog"],        incompatible: ["Monkey"],          mostIncompatible: ["Snake", "Pig"] },
  Rabbit:  { most: ["Tiger", "Dragon"],   symmetric: ["Pig", "Goat"],         incompatible: ["Rooster"],         mostIncompatible: ["Rat", "Horse"] },
  Dragon:  { most: ["Rabbit", "Snake"],   symmetric: ["Monkey", "Rat"],       incompatible: ["Dog"],             mostIncompatible: ["Ox", "Goat"] },
  Snake:   { most: ["Dragon", "Horse"],   symmetric: ["Rooster", "Ox"],       incompatible: ["Pig"],             mostIncompatible: ["Tiger", "Monkey"] },
  Horse:   { most: ["Snake", "Goat"],     symmetric: ["Tiger", "Dog"],        incompatible: ["Rat"],             mostIncompatible: ["Rabbit", "Rooster"] },
  Goat:    { most: ["Horse", "Monkey"],   symmetric: ["Pig", "Rabbit"],       incompatible: ["Ox"],              mostIncompatible: ["Dragon", "Dog"] },
  Monkey:  { most: ["Goat", "Rooster"],   symmetric: ["Rat", "Dragon"],       incompatible: ["Tiger"],           mostIncompatible: ["Snake", "Pig"] },
  Rooster: { most: ["Monkey", "Dog"],     symmetric: ["Snake", "Ox"],         incompatible: ["Rabbit"],          mostIncompatible: ["Horse", "Rat"] },
  Dog:     { most: ["Rooster", "Pig"],    symmetric: ["Tiger", "Horse"],      incompatible: ["Dragon"],          mostIncompatible: ["Goat", "Ox"] },
  Pig:     { most: ["Rat", "Dog"],        symmetric: ["Rabbit", "Goat"],      incompatible: ["Snake"],           mostIncompatible: ["Tiger", "Monkey"] },
};

function getChineseAnimalScore(animal1: string, animal2: string): number {
  const entry = chineseAnimalCompat[animal1];
  if (!entry) return 55;

  if (entry.most.includes(animal2)) return 95;
  if (entry.symmetric.includes(animal2)) return 80;
  if (entry.mostIncompatible.includes(animal2)) return 15;
  if (entry.incompatible.includes(animal2)) return 30;
  return 55; // neutral
}

// ─── Chinese Element Compatibility (Five Elements cycle) ───
const chineseElementCompat: Record<string, string[]> = {
  Wood: ["Water", "Wood"],
  Fire: ["Wood", "Fire"],
  Earth: ["Fire", "Earth"],
  Metal: ["Earth", "Metal"],
  Water: ["Metal", "Water"],
};

function getChineseElementScore(el1: string, el2: string): number {
  return chineseElementCompat[el1]?.includes(el2) ? 85 : 50;
}

// ─── Overall Compatibility Calculation ───
export function calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityResult {
  const lifePathScore = getNumerologyScore(user1.lifePath, user2.lifePath);
  const westernScore = getWesternScore(user1.westernZodiac.sign, user2.westernZodiac.sign);

  // Chinese score blends animal compatibility (70%) and element compatibility (30%)
  const animalScore = getChineseAnimalScore(user1.chineseZodiac.animal, user2.chineseZodiac.animal);
  const elementScore = getChineseElementScore(user1.chineseZodiac.element, user2.chineseZodiac.element);
  const chineseScore = Math.round(animalScore * 0.7 + elementScore * 0.3);

  // Weighted overall: Numerology 35%, Western 35%, Chinese 30%
  const overall = Math.round(lifePathScore * 0.35 + westernScore * 0.35 + chineseScore * 0.3);

  return {
    overall,
    lifePath: lifePathScore,
    western: westernScore,
    chinese: chineseScore,
  };
}

// ─── Compatibility Label Helpers ───
export function getCompatibilityLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Soulmate Connection", color: "#ec4899" };
  if (score >= 80) return { label: "Excellent Match", color: "#a78bfa" };
  if (score >= 70) return { label: "Great Potential", color: "#10b981" };
  if (score >= 55) return { label: "Worth Exploring", color: "#3b82f6" };
  if (score >= 40) return { label: "Challenging", color: "#f97316" };
  return { label: "Difficult Match", color: "#ef4444" };
}

export function isSoulmateMatch(user1: UserProfile, user2: UserProfile): boolean {
  const a = user1.lifePath > 9 ? Math.floor(user1.lifePath / 10) + (user1.lifePath % 10) : user1.lifePath;
  const b = user2.lifePath > 9 ? Math.floor(user2.lifePath / 10) + (user2.lifePath % 10) : user2.lifePath;
  return isSoulmatePair(a, b);
}

// ─── Zodiac Descriptions ───
export type ZodiacPolarity = "Positive" | "Negative";

export const zodiacDescriptions: Record<string, { traits: string; ruler: string; compatibleSigns: string[]; polarity: ZodiacPolarity; polarityLabel: string }> = {
  Aries:       { traits: "Bold, ambitious, and confident. A natural-born leader.", ruler: "Mars", compatibleSigns: ["Leo", "Sagittarius", "Gemini", "Aquarius"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Taurus:      { traits: "Reliable, patient, and devoted. Grounded and sensual.", ruler: "Venus", compatibleSigns: ["Virgo", "Capricorn", "Cancer", "Pisces", "Scorpio"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
  Gemini:      { traits: "Versatile, curious, and expressive. Quick-witted communicator.", ruler: "Mercury", compatibleSigns: ["Libra", "Aquarius", "Aries", "Leo", "Sagittarius"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Cancer:      { traits: "Intuitive, nurturing, and protective. Deeply emotional.", ruler: "Moon", compatibleSigns: ["Scorpio", "Pisces", "Taurus", "Virgo", "Capricorn"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
  Leo:         { traits: "Dramatic, creative, and confident. Warm-hearted leader.", ruler: "Sun", compatibleSigns: ["Aries", "Sagittarius", "Gemini", "Libra"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Virgo:       { traits: "Analytical, practical, and thoughtful. Detail-oriented perfectionist.", ruler: "Mercury", compatibleSigns: ["Taurus", "Capricorn", "Cancer", "Scorpio"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
  Libra:       { traits: "Diplomatic, gracious, and fair. Seeks harmony and balance.", ruler: "Venus", compatibleSigns: ["Gemini", "Aquarius", "Leo", "Sagittarius"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Scorpio:     { traits: "Passionate, resourceful, and brave. Intensely magnetic.", ruler: "Pluto", compatibleSigns: ["Cancer", "Pisces", "Taurus", "Virgo", "Capricorn"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
  Sagittarius: { traits: "Adventurous, optimistic, and philosophical. Free-spirited explorer.", ruler: "Jupiter", compatibleSigns: ["Aries", "Leo", "Gemini", "Libra", "Aquarius"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Capricorn:   { traits: "Disciplined, responsible, and ambitious. Master of self-control.", ruler: "Saturn", compatibleSigns: ["Taurus", "Virgo", "Cancer", "Scorpio", "Pisces"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
  Aquarius:    { traits: "Progressive, original, and independent. Humanitarian visionary.", ruler: "Uranus", compatibleSigns: ["Gemini", "Libra", "Aries", "Sagittarius"], polarity: "Positive", polarityLabel: "Masculine / Yang" },
  Pisces:      { traits: "Compassionate, artistic, and intuitive. Mystical dreamer.", ruler: "Neptune", compatibleSigns: ["Cancer", "Scorpio", "Taurus", "Capricorn"], polarity: "Negative", polarityLabel: "Feminine / Yin" },
};

// ─── Chinese Animal Descriptions (updated compatible animals from screenshot) ───
export const chineseAnimalDescriptions: Record<string, { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[]; incompatibleAnimals: string[] }> = {
  Rat:     { traits: "Quick-witted, resourceful, and versatile", luckyNumbers: [2, 3], luckyColors: ["Blue", "Gold", "Green"], compatibleAnimals: ["Ox", "Pig", "Monkey", "Dragon"], incompatibleAnimals: ["Horse", "Rabbit", "Rooster"] },
  Ox:      { traits: "Diligent, dependable, strong, and determined", luckyNumbers: [1, 4], luckyColors: ["White", "Yellow", "Green"], compatibleAnimals: ["Rat", "Tiger", "Snake", "Rooster"], incompatibleAnimals: ["Goat", "Dragon", "Dog"] },
  Tiger:   { traits: "Brave, competitive, unpredictable, and confident", luckyNumbers: [1, 3, 4], luckyColors: ["Blue", "Gray", "Orange"], compatibleAnimals: ["Ox", "Rabbit", "Horse", "Dog"], incompatibleAnimals: ["Monkey", "Snake", "Pig"] },
  Rabbit:  { traits: "Quiet, elegant, kind, and responsible", luckyNumbers: [3, 4, 6], luckyColors: ["Red", "Pink", "Purple"], compatibleAnimals: ["Tiger", "Dragon", "Pig", "Goat"], incompatibleAnimals: ["Rooster", "Rat", "Horse"] },
  Dragon:  { traits: "Confident, intelligent, enthusiastic, and ambitious", luckyNumbers: [1, 6, 7], luckyColors: ["Gold", "Silver", "Gray"], compatibleAnimals: ["Rabbit", "Snake", "Monkey", "Rat"], incompatibleAnimals: ["Dog", "Ox", "Goat"] },
  Snake:   { traits: "Enigmatic, intelligent, and wise", luckyNumbers: [2, 8, 9], luckyColors: ["Black", "Red", "Yellow"], compatibleAnimals: ["Dragon", "Horse", "Rooster", "Ox"], incompatibleAnimals: ["Pig", "Tiger", "Monkey"] },
  Horse:   { traits: "Animated, active, and energetic", luckyNumbers: [2, 3, 7], luckyColors: ["Yellow", "Red", "Green"], compatibleAnimals: ["Snake", "Goat", "Tiger", "Dog"], incompatibleAnimals: ["Rat", "Rabbit", "Rooster"] },
  Goat:    { traits: "Calm, gentle, and sympathetic", luckyNumbers: [2, 7], luckyColors: ["Brown", "Red", "Purple"], compatibleAnimals: ["Horse", "Monkey", "Pig", "Rabbit"], incompatibleAnimals: ["Ox", "Dragon", "Dog"] },
  Monkey:  { traits: "Sharp, smart, and curious", luckyNumbers: [4, 9], luckyColors: ["White", "Blue", "Gold"], compatibleAnimals: ["Goat", "Rooster", "Rat", "Dragon"], incompatibleAnimals: ["Tiger", "Snake", "Pig"] },
  Rooster: { traits: "Observant, hardworking, and courageous", luckyNumbers: [5, 7, 8], luckyColors: ["Gold", "Brown", "Yellow"], compatibleAnimals: ["Monkey", "Dog", "Snake", "Ox"], incompatibleAnimals: ["Rabbit", "Horse", "Rat"] },
  Dog:     { traits: "Loyal, honest, and amiable", luckyNumbers: [3, 4, 9], luckyColors: ["Red", "Green", "Purple"], compatibleAnimals: ["Rooster", "Pig", "Tiger", "Horse"], incompatibleAnimals: ["Dragon", "Goat", "Ox"] },
  Pig:     { traits: "Compassionate, generous, and diligent", luckyNumbers: [2, 5, 8], luckyColors: ["Yellow", "Gray", "Brown"], compatibleAnimals: ["Rat", "Dog", "Rabbit", "Goat"], incompatibleAnimals: ["Snake", "Tiger", "Monkey"] },
};

// ─── Element Descriptions ───
export const elementDescriptions: Record<string, string> = {
  Fire: "Passionate, dynamic, and temperamental. Fire signs are inspired by action and desire.",
  Earth: "Grounded, practical, and reliable. Earth signs build stable foundations for others.",
  Air: "Intellectual, communicative, and social. Air signs are the thinkers and connectors.",
  Water: "Emotional, intuitive, and deeply feeling. Water signs navigate life through emotion.",
};

export const chineseElementDescriptions: Record<string, string> = {
  Metal: "Strong, determined, and self-reliant. Metal represents precision and order.",
  Water: "Flexible, diplomatic, and intuitive. Water represents wisdom and adaptability.",
  Wood: "Generous, cooperative, and idealistic. Wood represents growth and vitality.",
  Fire: "Passionate, adventurous, and dynamic. Fire represents enthusiasm and energy.",
  Earth: "Stable, reliable, and nurturing. Earth represents patience and honesty.",
};

// ─── Community Compatibility (cross-user analysis) ───
export interface MatchInsightsData {
  averageScore: number;
  bestMatches: { profile: UserProfile; score: number }[];
  distribution: { soulmate: number; excellent: number; great: number; worthExploring: number; challenging: number };
  rank: string | null;
}

export function calculateAllCompatibility(
  profile: UserProfile,
  allProfiles: UserProfile[],
): MatchInsightsData {
  const others = allProfiles.filter((p) => p.id !== profile.id);
  const results = others.map((other) => ({
    profile: other,
    score: calculateCompatibility(profile, other).overall,
  }));

  const sorted = [...results].sort((a, b) => b.score - a.score);
  const bestMatches = sorted.slice(0, 3);

  const total = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = results.length > 0 ? Math.round(total / results.length) : 0;

  const distribution = { soulmate: 0, excellent: 0, great: 0, worthExploring: 0, challenging: 0 };
  for (const r of results) {
    if (r.score >= 90) distribution.soulmate++;
    else if (r.score >= 80) distribution.excellent++;
    else if (r.score >= 70) distribution.great++;
    else if (r.score >= 55) distribution.worthExploring++;
    else distribution.challenging++;
  }

  let rank: string | null = null;
  if (averageScore >= 80) rank = "Top Match Maker";
  else if (averageScore >= 70) rank = "Highly Compatible";
  else if (averageScore >= 60) rank = "Great Connector";

  return { averageScore, bestMatches, distribution, rank };
}

// ─── Numerology Utilities ───

export function reduceToSingleDigit(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    let next = 0;
    while (n > 0) {
      next += n % 10;
      n = Math.floor(n / 10);
    }
    n = next;
  }
  return n;
}

export function calculateBirthdayNumber(day: number): number {
  return reduceToSingleDigit(day);
}

export function calculatePersonalYear(birthMonth: number, birthDay: number, year?: number): number {
  const y = year ?? new Date().getFullYear();
  const digits = `${birthMonth}${birthDay}${y}`;
  let sum = 0;
  for (const ch of digits) {
    sum += Number(ch);
  }
  return reduceToSingleDigit(sum);
}

export const personalYearData: Record<number, { name: string; description: string }> = {
  1: { name: "New Beginnings", description: "A year of fresh starts, independence, and planting seeds for the future. Take initiative and embrace new opportunities." },
  2: { name: "Partnerships", description: "A year of cooperation, patience, and deepening relationships. Focus on diplomacy and finding balance." },
  3: { name: "Creativity", description: "A year of self-expression, joy, and social expansion. Let your creative talents shine and communicate freely." },
  4: { name: "Foundation", description: "A year of hard work, discipline, and building solid structures. Lay the groundwork for long-term goals." },
  5: { name: "Change", description: "A year of freedom, adventure, and unexpected shifts. Embrace flexibility and explore new horizons." },
  6: { name: "Responsibility", description: "A year of home, family, and service to others. Nurture your relationships and create harmony." },
  7: { name: "Reflection", description: "A year of introspection, spiritual growth, and inner wisdom. Seek deeper truths and trust your intuition." },
  8: { name: "Abundance", description: "A year of achievement, power, and material success. Step into your authority and reap what you've sown." },
  9: { name: "Completion", description: "A year of endings, release, and transformation. Let go of what no longer serves you to make room for the new." },
};

export const birthdayNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "The Leader", description: "Independent and driven, you bring originality and determination to everything you do." },
  2: { name: "The Diplomat", description: "Sensitive and cooperative, you excel at creating harmony and understanding others." },
  3: { name: "The Communicator", description: "Creative and expressive, you inspire others with your words and artistic vision." },
  4: { name: "The Organizer", description: "Practical and methodical, you build lasting foundations through discipline and reliability." },
  5: { name: "The Adventurer", description: "Dynamic and versatile, you thrive on change, travel, and new experiences." },
  6: { name: "The Caretaker", description: "Nurturing and responsible, you're devoted to family, home, and community." },
  7: { name: "The Thinker", description: "Analytical and intuitive, you seek knowledge and deeper meaning in life." },
  8: { name: "The Achiever", description: "Ambitious and authoritative, you're destined for material success and leadership." },
  9: { name: "The Humanitarian", description: "Compassionate and generous, you feel a deep calling to serve and uplift others." },
  11: { name: "The Illuminator", description: "A master number bearer — visionary, intuitive, and spiritually gifted." },
  22: { name: "The Master Architect", description: "A master number bearer — capable of turning grand visions into reality." },
};

// ─── Birthday-based Computation Functions ───

export function calculateLifePath(date: Date): number {
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const yyyy = date.getFullYear();

  const digits = `${mm}${dd}${yyyy}`;
  let sum = 0;
  for (const ch of digits) {
    sum += Number(ch);
  }

  // Reduce until single digit or master number
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let next = 0;
    while (sum > 0) {
      next += sum % 10;
      sum = Math.floor(sum / 10);
    }
    sum = next;
  }

  return sum;
}

export function getWesternZodiacFromDate(date: Date): WesternZodiac {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  const signs: { sign: string; symbol: string; element: WesternZodiac["element"]; startMonth: number; startDay: number }[] = [
    { sign: "Capricorn",   symbol: "♑", element: "Earth", startMonth: 12, startDay: 22 },
    { sign: "Aquarius",    symbol: "♒", element: "Air",   startMonth: 1,  startDay: 20 },
    { sign: "Pisces",      symbol: "♓", element: "Water", startMonth: 2,  startDay: 19 },
    { sign: "Aries",       symbol: "♈", element: "Fire",  startMonth: 3,  startDay: 21 },
    { sign: "Taurus",      symbol: "♉", element: "Earth", startMonth: 4,  startDay: 20 },
    { sign: "Gemini",      symbol: "♊", element: "Air",   startMonth: 5,  startDay: 21 },
    { sign: "Cancer",      symbol: "♋", element: "Water", startMonth: 6,  startDay: 21 },
    { sign: "Leo",         symbol: "♌", element: "Fire",  startMonth: 7,  startDay: 23 },
    { sign: "Virgo",       symbol: "♍", element: "Earth", startMonth: 8,  startDay: 23 },
    { sign: "Libra",       symbol: "♎", element: "Air",   startMonth: 9,  startDay: 23 },
    { sign: "Scorpio",     symbol: "♏", element: "Water", startMonth: 10, startDay: 23 },
    { sign: "Sagittarius", symbol: "♐", element: "Fire",  startMonth: 11, startDay: 22 },
  ];

  // Check from last (Sagittarius) to first (Capricorn)
  // Capricorn spans Dec 22 – Jan 19, handled specially
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { sign: "Capricorn", symbol: "♑", element: "Earth" };
  }

  for (let i = signs.length - 1; i >= 1; i--) {
    const s = signs[i];
    if (month === s.startMonth && day >= s.startDay) {
      return { sign: s.sign, symbol: s.symbol, element: s.element };
    }
    if (month > s.startMonth) {
      return { sign: s.sign, symbol: s.symbol, element: s.element };
    }
  }

  // Fallback (Jan 1-19 already handled above — this covers Aquarius Jan 20+)
  return { sign: "Aquarius", symbol: "♒", element: "Air" };
}

export function getChineseZodiacFromYear(year: number): ChineseZodiac {
  const animals: { animal: string; symbol: string }[] = [
    { animal: "Rat",     symbol: "🐀" },
    { animal: "Ox",      symbol: "🐂" },
    { animal: "Tiger",   symbol: "🐅" },
    { animal: "Rabbit",  symbol: "🐇" },
    { animal: "Dragon",  symbol: "🐉" },
    { animal: "Snake",   symbol: "🐍" },
    { animal: "Horse",   symbol: "🐴" },
    { animal: "Goat",    symbol: "🐐" },
    { animal: "Monkey",  symbol: "🐒" },
    { animal: "Rooster", symbol: "🐓" },
    { animal: "Dog",     symbol: "🐕" },
    { animal: "Pig",     symbol: "🐖" },
  ];

  const elements: { element: ChineseZodiac["element"]; elementSymbol: string; elementColor: string }[] = [
    { element: "Wood",  elementSymbol: "🌳", elementColor: "#22c55e" },
    { element: "Wood",  elementSymbol: "🌳", elementColor: "#22c55e" },
    { element: "Fire",  elementSymbol: "🔥", elementColor: "#ef4444" },
    { element: "Fire",  elementSymbol: "🔥", elementColor: "#ef4444" },
    { element: "Earth", elementSymbol: "🌍", elementColor: "#a16207" },
    { element: "Earth", elementSymbol: "🌍", elementColor: "#a16207" },
    { element: "Metal", elementSymbol: "⚙️", elementColor: "#94a3b8" },
    { element: "Metal", elementSymbol: "⚙️", elementColor: "#94a3b8" },
    { element: "Water", elementSymbol: "💧", elementColor: "#3b82f6" },
    { element: "Water", elementSymbol: "💧", elementColor: "#3b82f6" },
  ];

  const animalIndex = (year - 4) % 12;
  const elementIndex = (year - 4) % 10;

  const a = animals[animalIndex >= 0 ? animalIndex : animalIndex + 12];
  const e = elements[elementIndex >= 0 ? elementIndex : elementIndex + 10];

  return {
    animal: a.animal,
    symbol: a.symbol,
    element: e.element,
    elementColor: e.elementColor,
    elementSymbol: e.elementSymbol,
    fullName: `${e.element} ${a.animal}`,
  };
}

// ─── Extended Numerology: Utilities ───

function reduceToSingleDigitStrict(n: number): number {
  while (n > 9) {
    let next = 0;
    while (n > 0) {
      next += n % 10;
      n = Math.floor(n / 10);
    }
    n = next;
  }
  return n;
}

function pythagoreanValue(letter: string): number {
  const code = letter.toUpperCase().charCodeAt(0) - 65;
  return (code % 9) + 1;
}

function isVowel(letter: string): boolean {
  return "AEIOU".includes(letter.toUpperCase());
}

// ─── Extended Numerology: Types ───

export interface PinnacleInfo { number: number; startAge: number; endAge: number | null; label: string }
export interface CycleInfo { number: number; startAge: number; endAge: number | null; label: string }
export interface ChallengeInfo { number: number; label: string }

// ─── Extended Numerology: Name-Based Calculations ───

export function calculateExpressionNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (ch >= "A" && ch <= "Z") sum += pythagoreanValue(ch);
  }
  return reduceToSingleDigit(sum);
}

export function calculateSoulUrgeNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (ch >= "A" && ch <= "Z" && isVowel(ch)) sum += pythagoreanValue(ch);
  }
  return reduceToSingleDigit(sum);
}

export function calculatePersonalityNumber(name: string): number {
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (ch >= "A" && ch <= "Z" && !isVowel(ch)) sum += pythagoreanValue(ch);
  }
  return reduceToSingleDigit(sum);
}

export function calculateBalanceNumber(name: string): number {
  const parts = name.trim().split(/\s+/);
  let sum = 0;
  for (const part of parts) {
    const first = part[0];
    if (first && first.toUpperCase() >= "A" && first.toUpperCase() <= "Z") {
      sum += pythagoreanValue(first);
    }
  }
  return reduceToSingleDigitStrict(sum);
}

export function calculateSecretPassion(name: string): number[] {
  const freq: Record<number, number> = {};
  for (const ch of name.toUpperCase()) {
    if (ch >= "A" && ch <= "Z") {
      const val = pythagoreanValue(ch);
      freq[val] = (freq[val] || 0) + 1;
    }
  }
  let maxCount = 0;
  for (const count of Object.values(freq)) {
    if (count > maxCount) maxCount = count;
  }
  if (maxCount === 0) return [];
  const result: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (freq[d] === maxCount) result.push(d);
  }
  return result;
}

export function calculateKarmicLessons(name: string): number[] {
  const present = new Set<number>();
  for (const ch of name.toUpperCase()) {
    if (ch >= "A" && ch <= "Z") present.add(pythagoreanValue(ch));
  }
  const missing: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!present.has(d)) missing.push(d);
  }
  return missing;
}

export function calculateSubconsciousSelf(name: string): number {
  return 9 - calculateKarmicLessons(name).length;
}

// ─── Extended Numerology: Date-Based Calculations ───

export function calculatePinnacles(month: number, day: number, year: number, lifePath: number): PinnacleInfo[] {
  const reducedMonth = reduceToSingleDigit(month);
  const reducedDay = reduceToSingleDigit(day);
  const reducedYear = reduceToSingleDigit(year);
  const reducedLP = reduceToSingleDigitStrict(lifePath);

  const firstEnd = 36 - reducedLP;

  const p1 = reduceToSingleDigit(reducedMonth + reducedDay);
  const p2 = reduceToSingleDigit(reducedDay + reducedYear);
  const p3 = reduceToSingleDigit(p1 + p2);
  const p4 = reduceToSingleDigit(reducedMonth + reducedYear);

  return [
    { number: p1, startAge: 0, endAge: firstEnd, label: "First Pinnacle" },
    { number: p2, startAge: firstEnd + 1, endAge: firstEnd + 9, label: "Second Pinnacle" },
    { number: p3, startAge: firstEnd + 10, endAge: firstEnd + 18, label: "Third Pinnacle" },
    { number: p4, startAge: firstEnd + 19, endAge: null, label: "Fourth Pinnacle" },
  ];
}

export function calculatePeriodCycles(month: number, day: number, year: number, lifePath: number): CycleInfo[] {
  const reducedLP = reduceToSingleDigitStrict(lifePath);
  const firstEnd = 36 - reducedLP;

  const c1 = reduceToSingleDigit(month);
  const c2 = reduceToSingleDigit(day);
  const c3 = reduceToSingleDigit(year);

  return [
    { number: c1, startAge: 0, endAge: firstEnd, label: "First Cycle" },
    { number: c2, startAge: firstEnd + 1, endAge: firstEnd + 27, label: "Second Cycle" },
    { number: c3, startAge: firstEnd + 28, endAge: null, label: "Third Cycle" },
  ];
}

export function calculateChallenges(month: number, day: number, year: number): ChallengeInfo[] {
  const rm = reduceToSingleDigitStrict(month);
  const rd = reduceToSingleDigitStrict(day);
  const ry = reduceToSingleDigitStrict(year);

  const c1 = Math.abs(rm - rd);
  const c2 = Math.abs(rd - ry);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rm - ry);

  return [
    { number: c1, label: "First Challenge" },
    { number: c2, label: "Second Challenge" },
    { number: c3, label: "Main Challenge" },
    { number: c4, label: "Fourth Challenge" },
  ];
}

// ─── Extended Numerology: Data Records ───

export const expressionNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "The Independent", description: "You are a natural innovator with leadership potential. Your destiny is to pioneer new paths and express originality." },
  2: { name: "The Cooperator", description: "You are meant to bring harmony through partnership. Your gift is diplomacy, mediation, and emotional sensitivity." },
  3: { name: "The Entertainer", description: "You are destined to express yourself creatively. Your path involves communication, joy, and inspiring others through art." },
  4: { name: "The Organizer", description: "You are built for creating order from chaos. Your purpose is to establish systems, structures, and lasting foundations." },
  5: { name: "The Freedom Seeker", description: "You are meant to experience life fully. Your destiny involves adaptability, travel, and promoting progressive change." },
  6: { name: "The Responsible One", description: "You are destined to nurture and heal. Your path centers on family, community service, and creating beauty." },
  7: { name: "The Analyst", description: "You are a seeker of truth and wisdom. Your destiny involves research, spiritual depth, and intellectual mastery." },
  8: { name: "The Executive", description: "You are destined for achievement and authority. Your path involves material mastery, leadership, and strategic vision." },
  9: { name: "The Philanthropist", description: "You are meant to serve humanity. Your destiny involves compassion, artistic talent, and selfless generosity." },
  11: { name: "The Inspirational Teacher", description: "A master number destiny of spiritual illumination. You channel higher wisdom to inspire and uplift others." },
  22: { name: "The Master Architect", description: "A master number destiny of practical visionary power. You can manifest grand ideas into tangible reality." },
  33: { name: "The Master Healer", description: "A master number destiny of compassionate service. You uplift humanity through selfless love and teaching." },
};

export const soulUrgeNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "Desire for Independence", description: "Deep down you crave autonomy and the freedom to lead. Your heart yearns to be first and forge your own way." },
  2: { name: "Desire for Partnership", description: "Your deepest wish is for love, harmony, and meaningful connection. You find fulfillment in close relationships." },
  3: { name: "Desire for Expression", description: "Your soul craves creative self-expression and joy. You need outlets for your imagination and social charm." },
  4: { name: "Desire for Stability", description: "At your core you seek security, order, and accomplishment through hard work. Stability is your inner compass." },
  5: { name: "Desire for Freedom", description: "Your soul thirsts for adventure, variety, and sensory experience. Routine stifles your inner fire." },
  6: { name: "Desire for Harmony", description: "Your deepest need is to love and be loved. You're driven to create beauty, comfort, and family bonds." },
  7: { name: "Desire for Knowledge", description: "Your inner self craves understanding and solitude for reflection. You seek truth beyond the surface." },
  8: { name: "Desire for Achievement", description: "Deep within you burns the drive for success, recognition, and material abundance. Power calls to you." },
  9: { name: "Desire to Serve", description: "Your soul yearns to make the world better. Compassion and idealism are the engines of your inner life." },
  11: { name: "Desire for Illumination", description: "Your inner self seeks spiritual truth and the ability to inspire others. You carry a visionary flame within." },
  22: { name: "Desire for Legacy", description: "At your deepest level you wish to build something that outlasts you — a masterwork for the ages." },
};

export const personalityNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "Confident Leader", description: "Others see you as strong, capable, and self-assured. You project authority and independence." },
  2: { name: "Gentle Peacemaker", description: "People perceive you as kind, approachable, and supportive. You radiate warmth and understanding." },
  3: { name: "Charismatic Charmer", description: "You come across as witty, sociable, and full of life. Your presence lights up a room." },
  4: { name: "Dependable Rock", description: "Others see you as trustworthy, grounded, and hardworking. You project stability and reliability." },
  5: { name: "Magnetic Adventurer", description: "People perceive you as exciting, dynamic, and attractive. You radiate restless energy." },
  6: { name: "Warm Nurturer", description: "You appear caring, responsible, and domestic. Others feel safe and comforted in your presence." },
  7: { name: "Enigmatic Thinker", description: "People see you as mysterious, intelligent, and reserved. You project an aura of depth and wisdom." },
  8: { name: "Powerful Authority", description: "Others perceive you as successful, commanding, and business-minded. You project strength and ambition." },
  9: { name: "Worldly Idealist", description: "People see you as sophisticated, generous, and compassionate. You radiate a universal charm." },
  11: { name: "Intuitive Visionary", description: "Others sense your spiritual depth and sensitivity. You appear otherworldly and deeply perceptive." },
  22: { name: "Masterful Presence", description: "People see you as someone with immense capability and drive. You project an aura of grand purpose." },
};

export const balanceNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "Stand Your Ground", description: "In times of difficulty, draw on your independence. Face challenges head-on with courage and self-reliance." },
  2: { name: "Seek Mediation", description: "When stressed, turn to trusted partners. Use diplomacy and patience — your balance comes through cooperation." },
  3: { name: "Express Yourself", description: "In crisis, don't bottle up feelings. Talk, write, create — your emotional outlet restores your equilibrium." },
  4: { name: "Get Organized", description: "Under pressure, create order. Making lists, plans, and structures calms your mind and restores control." },
  5: { name: "Embrace Change", description: "When overwhelmed, break your routine. Movement, travel, or a fresh perspective brings back your balance." },
  6: { name: "Nurture Others", description: "In tough times, help those around you. Service to family and community restores your inner peace." },
  7: { name: "Retreat and Reflect", description: "When stressed, seek solitude and quiet analysis. Time alone with your thoughts brings clarity." },
  8: { name: "Take Charge", description: "In crisis, step into leadership. Taking decisive action and managing the situation restores your power." },
  9: { name: "Broaden Your View", description: "When overwhelmed, zoom out. See the bigger picture and remember your ideals — perspective heals." },
};

export const secretPassionData: Record<number, { name: string; description: string }> = {
  1: { name: "Passion for Leading", description: "You have a burning drive to lead, innovate, and be recognized for your individuality and accomplishments." },
  2: { name: "Passion for Connecting", description: "Your strongest talent lies in bringing people together, fostering partnerships, and creating harmony." },
  3: { name: "Passion for Creating", description: "Creative expression is your superpower. Writing, speaking, and artistic endeavors fuel your deepest joy." },
  4: { name: "Passion for Building", description: "You are driven to create lasting, practical results. Hard work, planning, and craftsmanship fulfill you." },
  5: { name: "Passion for Experiencing", description: "You crave variety, adventure, and sensory richness. Your talent is adaptability and infectious enthusiasm." },
  6: { name: "Passion for Nurturing", description: "Caring for others is where your talent shines brightest. Home, family, and beauty are your domains." },
  7: { name: "Passion for Understanding", description: "You're driven to investigate, analyze, and uncover hidden truths. Knowledge is your deepest reward." },
  8: { name: "Passion for Achieving", description: "Success, status, and material accomplishment drive you. You have a natural talent for business and authority." },
  9: { name: "Passion for Inspiring", description: "You feel compelled to uplift and transform the world. Humanitarian and artistic pursuits fulfill your soul." },
};

export const karmicLessonData: Record<number, { name: string; description: string }> = {
  1: { name: "Lesson of Independence", description: "You may struggle with asserting yourself. Developing self-reliance and initiative is your growth edge." },
  2: { name: "Lesson of Cooperation", description: "Patience and sensitivity in relationships may not come naturally. Learning diplomacy is your challenge." },
  3: { name: "Lesson of Expression", description: "You may hold back creatively or socially. Learning to share your voice and joy is essential." },
  4: { name: "Lesson of Discipline", description: "Structure and follow-through may be difficult. Building practical habits and perseverance is key." },
  5: { name: "Lesson of Freedom", description: "You may resist change or avoid risk. Embracing adaptability and new experiences is your growth." },
  6: { name: "Lesson of Responsibility", description: "Commitment and domestic harmony may be challenging. Learning to nurture and accept duty is vital." },
  7: { name: "Lesson of Introspection", description: "You may avoid deep self-reflection or spiritual seeking. Developing your inner world is your task." },
  8: { name: "Lesson of Power", description: "Financial management and ambition may not come easily. Learning to handle authority wisely is your challenge." },
  9: { name: "Lesson of Compassion", description: "Selflessness and universal love may be difficult. Opening your heart to humanity is your deepest lesson." },
};

export const pinnacleNumberData: Record<number, { name: string; description: string }> = {
  1: { name: "Independence", description: "A period of new beginnings, self-reliance, and developing personal identity and leadership." },
  2: { name: "Partnership", description: "A period of cooperation, patience, and growth through relationships and emotional sensitivity." },
  3: { name: "Creativity", description: "A period of self-expression, social expansion, and finding joy through artistic and communicative pursuits." },
  4: { name: "Foundation", description: "A period of hard work, building structures, and establishing security through discipline and persistence." },
  5: { name: "Change", description: "A period of freedom, adventure, and learning through unexpected life changes and new experiences." },
  6: { name: "Responsibility", description: "A period focused on family, home, and service. Love, duty, and domestic harmony define this time." },
  7: { name: "Reflection", description: "A period of inner growth, spiritual development, and deepening your understanding of life's mysteries." },
  8: { name: "Achievement", description: "A period of material success, authority, and recognition. Business and financial matters take center stage." },
  9: { name: "Completion", description: "A period of humanitarianism, endings, and emotional depth. Giving back and releasing the past are themes." },
  11: { name: "Illumination", description: "A master pinnacle of heightened intuition, spiritual awareness, and inspiring leadership." },
  22: { name: "Master Building", description: "A master pinnacle of turning great visions into tangible reality on a large scale." },
};

export const periodCycleData: Record<number, { name: string; description: string }> = {
  1: { name: "Cycle of Individuality", description: "A life period focused on independence, self-discovery, and carving your own unique path." },
  2: { name: "Cycle of Cooperation", description: "A life period centered on relationships, sensitivity, and learning through partnerships." },
  3: { name: "Cycle of Expression", description: "A life period rich with creativity, communication, and joyful social connections." },
  4: { name: "Cycle of Building", description: "A life period of discipline, hard work, and establishing practical foundations for the future." },
  5: { name: "Cycle of Freedom", description: "A life period of change, adventure, and expansion through diverse experiences." },
  6: { name: "Cycle of Nurturing", description: "A life period devoted to family, responsibility, and creating beauty and harmony." },
  7: { name: "Cycle of Seeking", description: "A life period of introspection, study, and spiritual or intellectual deepening." },
  8: { name: "Cycle of Power", description: "A life period of ambition, achievement, and mastering the material world." },
  9: { name: "Cycle of Wisdom", description: "A life period of compassion, humanitarianism, and synthesizing life experiences." },
  11: { name: "Cycle of Inspiration", description: "A master cycle of spiritual insight, visionary thinking, and inspiring others." },
  22: { name: "Cycle of Mastery", description: "A master cycle of building on a grand scale and manifesting extraordinary visions." },
};

export const challengeNumberData: Record<number, { name: string; description: string }> = {
  0: { name: "The Choice Challenge", description: "You may face all challenges or none — this rare number means you must choose which obstacles to engage with consciously." },
  1: { name: "Challenge of Self", description: "Learning to assert yourself without being domineering. Finding the balance between independence and cooperation." },
  2: { name: "Challenge of Sensitivity", description: "Overcoming excessive shyness or emotional dependency. Learning to trust your own feelings while staying open." },
  3: { name: "Challenge of Expression", description: "Overcoming self-doubt in communication and creativity. Learning to share your gifts without fear of criticism." },
  4: { name: "Challenge of Discipline", description: "Learning patience, organization, and follow-through. Overcoming rigidity or avoidance of hard work." },
  5: { name: "Challenge of Freedom", description: "Balancing the need for change with responsibility. Avoiding impulsive decisions while embracing healthy adventure." },
  6: { name: "Challenge of Responsibility", description: "Avoiding martyrdom or controlling behavior. Learning to nurture without losing yourself in others' needs." },
  7: { name: "Challenge of Trust", description: "Overcoming isolation or excessive skepticism. Learning to open up emotionally and trust the process of life." },
  8: { name: "Challenge of Power", description: "Balancing material ambition with spiritual values. Learning that true authority comes from integrity, not control." },
};

// ─── Lo Shu Grid (Chinese Numerology) ───

export interface LoShuPosition {
  number: number;
  count: number;
  keywords: string[];
  polarity: "Yin" | "Yang";
  direction: string;
  planet: string;
  season: string;
  element: string;
  color: string;
}

export interface LoShuGrid {
  positions: Record<number, LoShuPosition>;
  presentDigits: number[];
  missingDigits: number[];
  strongestPositions: number[];
}

const loShuPositionData: Record<number, Omit<LoShuPosition, "number" | "count">> = {
  1: { keywords: ["Career", "Success", "Communication"], polarity: "Yang", direction: "North", planet: "Sun", season: "Winter", element: "Water", color: "#1e40af" },
  2: { keywords: ["Love", "Marriage", "Relationships"], polarity: "Yin", direction: "South", planet: "Moon", season: "Late Summer", element: "Earth", color: "#ec4899" },
  3: { keywords: ["Health", "Wisdom", "Family"], polarity: "Yang", direction: "East", planet: "Jupiter", season: "Spring", element: "Wood", color: "#22c55e" },
  4: { keywords: ["Luck", "Money", "Discipline"], polarity: "Yin", direction: "North", planet: "Rahu", season: "Spring", element: "Wood", color: "#a855f7" },
  5: { keywords: ["Balance", "Stability", "Mental Health"], polarity: "Yang", direction: "Center", planet: "Mars", season: "Transition", element: "Fire", color: "#ef4444" },
  6: { keywords: ["Friends", "Travel", "New Beginnings"], polarity: "Yin", direction: "Northwest", planet: "Venus", season: "Autumn", element: "Metal", color: "#6b7280" },
  7: { keywords: ["Creativity", "Children", "Future"], polarity: "Yang", direction: "West", planet: "Ketu", season: "Autumn", element: "Metal", color: "#f8fafc" },
  8: { keywords: ["Knowledge", "Intuition", "Spirituality"], polarity: "Yin", direction: "Northeast", planet: "Saturn", season: "Late Winter", element: "Earth", color: "#3b82f6" },
  9: { keywords: ["Prosperity", "Fame", "Reputation"], polarity: "Yang", direction: "South", planet: "Mars", season: "Summer", element: "Fire", color: "#ef4444" },
};

export function calculateLoShuGrid(month: number, day: number, year: number): LoShuGrid {
  const digits = `${month}${day}${year}`;
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (const ch of digits) {
    const n = parseInt(ch, 10);
    if (n >= 1 && n <= 9) counts[n]++;
  }

  const positions: Record<number, LoShuPosition> = {};
  for (let i = 1; i <= 9; i++) {
    positions[i] = { number: i, count: counts[i], ...loShuPositionData[i] };
  }

  const presentDigits = Object.keys(counts).map(Number).filter((n) => counts[n] > 0);
  const missingDigits = Object.keys(counts).map(Number).filter((n) => counts[n] === 0);
  const strongestPositions = Object.keys(counts).map(Number).filter((n) => counts[n] >= 2);

  return { positions, presentDigits, missingDigits, strongestPositions };
}

// ─── Astrological Houses (mapped to Life Paths) ───

export interface AstroHouseInfo {
  house: number;
  name: string;
  keywords: string[];
  description: string;
}

export const astroHouseData: Record<number, AstroHouseInfo> = {
  1: { house: 1, name: "House of Self", keywords: ["Self", "Appearances", "Beginnings", "First Impressions", "Identity"], description: "The body, first impressions, attitude, identity, and approach to life." },
  2: { house: 2, name: "House of Value", keywords: ["Money", "Work", "Income", "Values", "Possessions"], description: "Money, work, income, daily routines, values, material possessions, priorities, habits, and work ethic." },
  3: { house: 3, name: "House of Communication", keywords: ["Mind", "Communication", "Siblings", "Education"], description: "The mind, thinking, communication, siblings, social activity, interests, neighbors, and early education." },
  4: { house: 4, name: "House of Home", keywords: ["Home", "Roots", "Family", "Foundations", "Mother"], description: "Home, roots, family, self-care, emotions, foundations, mother, children, women, and femininity." },
  5: { house: 5, name: "House of Pleasure", keywords: ["Romance", "Creativity", "Play", "Joy", "Drama"], description: "Romance, love affairs, play, creativity, fertility, childlike spirit, joy, self-expression, and drama." },
  6: { house: 6, name: "House of Health", keywords: ["Health", "Fitness", "Systems", "Service", "Organization"], description: "Health, fitness, systems, analytical nature, pets, work habits, organization, sense of usefulness, and service given." },
  7: { house: 7, name: "House of Partnerships", keywords: ["Relationships", "Marriage", "Contracts", "Equality"], description: "Relationships, marriage, contracts, business partners, equality, sharing, and interpersonal style." },
  8: { house: 8, name: "House of Transformation", keywords: ["Merging", "Intimacy", "Shared Finances", "Mystery"], description: "Merging, sex, intimacy, shared finances, inheritances, taxes, loans, assets, property, joint ventures, goals, mystery, and partner's resources." },
  9: { house: 9, name: "House of Philosophy", keywords: ["Travel", "Wisdom", "Philosophy", "Higher Education"], description: "Travel, wisdom, philosophy, higher education, law and religion, cross-cultural relations, learning, and ethics." },
  11: { house: 10, name: "House of Career", keywords: ["Career", "Goals", "Structure", "Reputation", "Fame"], description: "Career, long-term goals, structure, status, reputation, public image, masculinity, men, fathers, experts, and fame." },
  22: { house: 11, name: "House of Community", keywords: ["Groups", "Friends", "Humanitarianism", "Technology"], description: "Groups, friends, social awareness, humanitarianism, technology, hopes and wishes, and the future." },
  33: { house: 12, name: "House of the Subconscious", keywords: ["Endings", "Healing", "Spirituality", "Karma"], description: "Endings, healing, closure, spirituality, solitude, karma, old age, afterlife, what's hidden, limiting beliefs, and the subconscious." },
};
