import type { CompatibilityResult, LifePathInfo, UserProfile } from "@/types/profile";

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
export const zodiacDescriptions: Record<string, { traits: string; ruler: string; compatibleSigns: string[] }> = {
  Aries: { traits: "Bold, ambitious, and confident. A natural-born leader.", ruler: "Mars", compatibleSigns: ["Leo", "Sagittarius", "Gemini", "Aquarius"] },
  Taurus: { traits: "Reliable, patient, and devoted. Grounded and sensual.", ruler: "Venus", compatibleSigns: ["Virgo", "Capricorn", "Cancer", "Pisces", "Scorpio"] },
  Gemini: { traits: "Versatile, curious, and expressive. Quick-witted communicator.", ruler: "Mercury", compatibleSigns: ["Libra", "Aquarius", "Aries", "Leo", "Sagittarius"] },
  Cancer: { traits: "Intuitive, nurturing, and protective. Deeply emotional.", ruler: "Moon", compatibleSigns: ["Scorpio", "Pisces", "Taurus", "Virgo", "Capricorn"] },
  Leo: { traits: "Dramatic, creative, and confident. Warm-hearted leader.", ruler: "Sun", compatibleSigns: ["Aries", "Sagittarius", "Gemini", "Libra"] },
  Virgo: { traits: "Analytical, practical, and thoughtful. Detail-oriented perfectionist.", ruler: "Mercury", compatibleSigns: ["Taurus", "Capricorn", "Cancer", "Scorpio"] },
  Libra: { traits: "Diplomatic, gracious, and fair. Seeks harmony and balance.", ruler: "Venus", compatibleSigns: ["Gemini", "Aquarius", "Leo", "Sagittarius"] },
  Scorpio: { traits: "Passionate, resourceful, and brave. Intensely magnetic.", ruler: "Pluto", compatibleSigns: ["Cancer", "Pisces", "Taurus", "Virgo", "Capricorn"] },
  Sagittarius: { traits: "Adventurous, optimistic, and philosophical. Free-spirited explorer.", ruler: "Jupiter", compatibleSigns: ["Aries", "Leo", "Gemini", "Libra", "Aquarius"] },
  Capricorn: { traits: "Disciplined, responsible, and ambitious. Master of self-control.", ruler: "Saturn", compatibleSigns: ["Taurus", "Virgo", "Cancer", "Scorpio", "Pisces"] },
  Aquarius: { traits: "Progressive, original, and independent. Humanitarian visionary.", ruler: "Uranus", compatibleSigns: ["Gemini", "Libra", "Aries", "Sagittarius"] },
  Pisces: { traits: "Compassionate, artistic, and intuitive. Mystical dreamer.", ruler: "Neptune", compatibleSigns: ["Cancer", "Scorpio", "Taurus", "Capricorn"] },
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
