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

const lifePathCompat: Record<number, number[]> = {
  1: [1, 3, 5, 7, 9],
  2: [2, 4, 6, 8],
  3: [1, 3, 5, 6, 9],
  4: [2, 4, 6, 8],
  5: [1, 3, 5, 7, 9],
  6: [2, 3, 4, 6, 9],
  7: [1, 5, 7],
  8: [2, 4, 8],
  9: [1, 3, 5, 6, 9],
  11: [2, 4, 6, 11, 22],
  22: [4, 6, 8, 11, 22],
  33: [3, 6, 9, 33],
};

const elementCompat: Record<string, string[]> = {
  Fire: ["Fire", "Air"],
  Earth: ["Earth", "Water"],
  Air: ["Air", "Fire"],
  Water: ["Water", "Earth"],
};

const chineseElementCompat: Record<string, string[]> = {
  Wood: ["Water", "Wood"],
  Fire: ["Wood", "Fire"],
  Earth: ["Fire", "Earth"],
  Metal: ["Earth", "Metal"],
  Water: ["Metal", "Water"],
};

export function calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityResult {
  const lifePathScore = lifePathCompat[user1.lifePath]?.includes(user2.lifePath) ? 90 : 60;
  const westernScore = elementCompat[user1.westernZodiac.element]?.includes(user2.westernZodiac.element) ? 85 : 55;
  const chineseScore = chineseElementCompat[user1.chineseZodiac.element]?.includes(user2.chineseZodiac.element) ? 88 : 58;

  return {
    overall: Math.round((lifePathScore + westernScore + chineseScore) / 3),
    lifePath: lifePathScore,
    western: westernScore,
    chinese: chineseScore,
  };
}

export const zodiacDescriptions: Record<string, { traits: string; ruler: string; compatibleSigns: string[] }> = {
  Aries: { traits: "Bold, ambitious, and confident. A natural-born leader.", ruler: "Mars", compatibleSigns: ["Leo", "Sagittarius", "Gemini", "Aquarius"] },
  Taurus: { traits: "Reliable, patient, and devoted. Grounded and sensual.", ruler: "Venus", compatibleSigns: ["Virgo", "Capricorn", "Cancer", "Pisces"] },
  Gemini: { traits: "Versatile, curious, and expressive. Quick-witted communicator.", ruler: "Mercury", compatibleSigns: ["Libra", "Aquarius", "Aries", "Leo"] },
  Cancer: { traits: "Intuitive, nurturing, and protective. Deeply emotional.", ruler: "Moon", compatibleSigns: ["Scorpio", "Pisces", "Taurus", "Virgo"] },
  Leo: { traits: "Dramatic, creative, and confident. Warm-hearted leader.", ruler: "Sun", compatibleSigns: ["Aries", "Sagittarius", "Gemini", "Libra"] },
  Virgo: { traits: "Analytical, practical, and thoughtful. Detail-oriented perfectionist.", ruler: "Mercury", compatibleSigns: ["Taurus", "Capricorn", "Cancer", "Scorpio"] },
  Libra: { traits: "Diplomatic, gracious, and fair. Seeks harmony and balance.", ruler: "Venus", compatibleSigns: ["Gemini", "Aquarius", "Leo", "Sagittarius"] },
  Scorpio: { traits: "Passionate, resourceful, and brave. Intensely magnetic.", ruler: "Pluto", compatibleSigns: ["Cancer", "Pisces", "Virgo", "Capricorn"] },
  Sagittarius: { traits: "Adventurous, optimistic, and philosophical. Free-spirited explorer.", ruler: "Jupiter", compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"] },
  Capricorn: { traits: "Disciplined, responsible, and ambitious. Master of self-control.", ruler: "Saturn", compatibleSigns: ["Taurus", "Virgo", "Scorpio", "Pisces"] },
  Aquarius: { traits: "Progressive, original, and independent. Humanitarian visionary.", ruler: "Uranus", compatibleSigns: ["Gemini", "Libra", "Aries", "Sagittarius"] },
  Pisces: { traits: "Compassionate, artistic, and intuitive. Mystical dreamer.", ruler: "Neptune", compatibleSigns: ["Cancer", "Scorpio", "Taurus", "Capricorn"] },
};

export const chineseAnimalDescriptions: Record<string, { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[] }> = {
  Rat: { traits: "Quick-witted, resourceful, and versatile", luckyNumbers: [2, 3], luckyColors: ["Blue", "Gold", "Green"], compatibleAnimals: ["Dragon", "Monkey", "Ox"] },
  Ox: { traits: "Diligent, dependable, strong, and determined", luckyNumbers: [1, 4], luckyColors: ["White", "Yellow", "Green"], compatibleAnimals: ["Rat", "Snake", "Rooster"] },
  Tiger: { traits: "Brave, competitive, unpredictable, and confident", luckyNumbers: [1, 3, 4], luckyColors: ["Blue", "Gray", "Orange"], compatibleAnimals: ["Dragon", "Horse", "Pig"] },
  Rabbit: { traits: "Quiet, elegant, kind, and responsible", luckyNumbers: [3, 4, 6], luckyColors: ["Red", "Pink", "Purple"], compatibleAnimals: ["Goat", "Monkey", "Dog", "Pig"] },
  Dragon: { traits: "Confident, intelligent, enthusiastic, and ambitious", luckyNumbers: [1, 6, 7], luckyColors: ["Gold", "Silver", "Gray"], compatibleAnimals: ["Rooster", "Rat", "Monkey"] },
  Snake: { traits: "Enigmatic, intelligent, and wise", luckyNumbers: [2, 8, 9], luckyColors: ["Black", "Red", "Yellow"], compatibleAnimals: ["Dragon", "Rooster", "Ox"] },
  Horse: { traits: "Animated, active, and energetic", luckyNumbers: [2, 3, 7], luckyColors: ["Yellow", "Red", "Green"], compatibleAnimals: ["Tiger", "Goat", "Rabbit"] },
  Goat: { traits: "Calm, gentle, and sympathetic", luckyNumbers: [2, 7], luckyColors: ["Brown", "Red", "Purple"], compatibleAnimals: ["Rabbit", "Horse", "Pig"] },
  Monkey: { traits: "Sharp, smart, and curious", luckyNumbers: [4, 9], luckyColors: ["White", "Blue", "Gold"], compatibleAnimals: ["Ox", "Rabbit", "Dragon"] },
  Rooster: { traits: "Observant, hardworking, and courageous", luckyNumbers: [5, 7, 8], luckyColors: ["Gold", "Brown", "Yellow"], compatibleAnimals: ["Ox", "Snake", "Dragon"] },
  Dog: { traits: "Loyal, honest, and amiable", luckyNumbers: [3, 4, 9], luckyColors: ["Red", "Green", "Purple"], compatibleAnimals: ["Rabbit", "Tiger", "Horse"] },
  Pig: { traits: "Compassionate, generous, and diligent", luckyNumbers: [2, 5, 8], luckyColors: ["Yellow", "Gray", "Brown"], compatibleAnimals: ["Tiger", "Rabbit", "Goat"] },
};

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
