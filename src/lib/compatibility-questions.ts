export interface CompatibilityQuestion {
  id: number;
  question: string;
  category: "elements" | "energy" | "lifestyle" | "cosmic" | "values";
}

export const compatibilityQuestions: CompatibilityQuestion[] = [
  // Elements (4)
  { id: 1, question: "I feel most alive when I'm surrounded by nature and the elements.", category: "elements" },
  { id: 2, question: "I believe the energy of the moon affects my emotions and decisions.", category: "elements" },
  { id: 3, question: "Water (oceans, rain, rivers) has a deeply calming effect on my spirit.", category: "elements" },
  { id: 4, question: "I'm drawn to fire -- candles, bonfires, and warmth energize me.", category: "elements" },

  // Energy (4)
  { id: 5, question: "I recharge best through solitude rather than socializing.", category: "energy" },
  { id: 6, question: "I trust my gut instincts more than logical analysis.", category: "energy" },
  { id: 7, question: "I believe people can sense each other's energy without words.", category: "energy" },
  { id: 8, question: "Morning energy and night energy feel fundamentally different to me.", category: "energy" },

  // Lifestyle (4)
  { id: 9, question: "Routine and structure help me feel grounded and safe.", category: "lifestyle" },
  { id: 10, question: "I prefer deep conversations with one person over small talk with many.", category: "lifestyle" },
  { id: 11, question: "Travel and exploration are essential to my well-being.", category: "lifestyle" },
  { id: 12, question: "I need a partner who values personal growth as much as I do.", category: "lifestyle" },

  // Cosmic (4)
  { id: 13, question: "I check my horoscope or cosmic forecast regularly.", category: "cosmic" },
  { id: 14, question: "Mercury retrograde genuinely affects my communication and plans.", category: "cosmic" },
  { id: 15, question: "I believe the stars and planets influence our personalities.", category: "cosmic" },
  { id: 16, question: "Synchronicities and signs from the universe guide my major decisions.", category: "cosmic" },

  // Values (4)
  { id: 17, question: "Acts of service matter more to me than words of affirmation.", category: "values" },
  { id: 18, question: "I believe vulnerability is the foundation of true intimacy.", category: "values" },
  { id: 19, question: "Shared silence is more meaningful than constant conversation.", category: "values" },
  { id: 20, question: "I value spiritual compatibility as much as physical attraction.", category: "values" },
];

/**
 * Calculates a bonus score (0-15) based on answer similarity between two users.
 * Answers are Record<string, number> where keys are question IDs and values are 1-5.
 */
export function calculateQuestionnaireBonus(
  answersA: Record<string, number>,
  answersB: Record<string, number>
): number {
  const sharedKeys = Object.keys(answersA).filter((key) => key in answersB);

  if (sharedKeys.length === 0) return 0;

  let totalSimilarity = 0;

  for (const key of sharedKeys) {
    const diff = Math.abs(answersA[key] - answersB[key]);
    // diff 0 => score 4, diff 1 => score 3, diff 2 => score 2, diff 3 => score 1, diff 4 => score 0
    totalSimilarity += Math.max(0, 4 - diff);
  }

  // Max possible similarity = sharedKeys.length * 4
  const maxSimilarity = sharedKeys.length * 4;
  const ratio = totalSimilarity / maxSimilarity;

  // Scale to 0-15 bonus points
  return Math.round(ratio * 15);
}
