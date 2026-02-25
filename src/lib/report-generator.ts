import {
  calculateCompatibility,
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
} from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

export interface CompatibilityReportData {
  overallScore: number;
  numerologySection: {
    analysis: string;
    score: number;
  };
  westernSection: {
    analysis: string;
    score: number;
  };
  chineseSection: {
    analysis: string;
    score: number;
  };
  strengths: string[];
  challenges: string[];
  cosmicAdvice: string;
}

export function generateReport(
  userA: UserProfile,
  userB: UserProfile
): CompatibilityReportData {
  const compat = calculateCompatibility(userA, userB);

  // --- Numerology Section ---
  const lpA = lifePathData[userA.lifePath];
  const lpB = lifePathData[userB.lifePath];
  const lpAName = lpA?.name || `Life Path ${userA.lifePath}`;
  const lpBName = lpB?.name || `Life Path ${userB.lifePath}`;

  let numerologyAnalysis: string;
  if (compat.lifePath >= 90) {
    numerologyAnalysis = `A soulmate-level numerological connection. ${userA.name}'s ${lpAName} energy perfectly complements ${userB.name}'s ${lpBName} nature. This is a rare and powerful alignment where both paths naturally support each other's growth and purpose. Together, you amplify each other's strengths and create a partnership that feels destined.`;
  } else if (compat.lifePath >= 75) {
    numerologyAnalysis = `An excellent numerological match. ${userA.name} (${lpAName}) and ${userB.name} (${lpBName}) share complementary life purposes. Your paths naturally harmonize, creating opportunities for mutual growth. ${lpA?.traits?.[0] || "Your"} energy blends well with ${lpB?.traits?.[0]?.toLowerCase() || "their"} nature, forming a strong foundation for connection.`;
  } else if (compat.lifePath >= 55) {
    numerologyAnalysis = `A balanced numerological pairing. ${userA.name}'s ${lpAName} path and ${userB.name}'s ${lpBName} path can learn much from each other. While your approaches to life differ, these differences can be complementary when both partners practice understanding. The key is respecting each other's unique life journey.`;
  } else {
    numerologyAnalysis = `A challenging but growth-oriented numerological connection. ${userA.name} (${lpAName}) and ${userB.name} (${lpBName}) operate on different frequencies. This doesn't mean incompatibility -- rather, it means this connection pushes both of you to grow beyond your comfort zones. The greatest relationships often come from the greatest challenges.`;
  }

  // --- Western Zodiac Section ---
  const zodiacA = zodiacDescriptions[userA.westernZodiac.sign];
  const zodiacB = zodiacDescriptions[userB.westernZodiac.sign];
  const elementA = userA.westernZodiac.element;
  const elementB = userB.westernZodiac.element;
  const sameElement = elementA === elementB;

  let westernAnalysis: string;
  if (compat.western >= 90) {
    westernAnalysis = `${userA.westernZodiac.symbol} ${userA.westernZodiac.sign} and ${userB.westernZodiac.symbol} ${userB.westernZodiac.sign} share an extraordinary astrological bond. ${sameElement ? `Both ${elementA} signs, you speak the same elemental language -- ${elementDescriptions[elementA]?.toLowerCase() || "a deeply resonant energy"}.` : `Your ${elementA} and ${elementB} energies create a dynamic and exciting interplay.`} This is one of the strongest zodiac pairings. ${zodiacA?.compatibleSigns.includes(userB.westernZodiac.sign) ? "The stars have literally written you as compatible." : "Your connection transcends typical zodiac patterns."}`;
  } else if (compat.western >= 70) {
    westernAnalysis = `${userA.westernZodiac.sign} and ${userB.westernZodiac.sign} form a favorable astrological connection. ${sameElement ? `Sharing the ${elementA} element gives you an intuitive understanding.` : `${elementA} meets ${elementB} in a way that creates balance and intrigue.`} ${zodiacA?.ruler ? `Ruled by ${zodiacA.ruler}` : userA.westernZodiac.sign} finds natural harmony with ${zodiacB?.ruler ? `${zodiacB.ruler}-ruled` : ""} ${userB.westernZodiac.sign}. Communication flows naturally between you.`;
  } else if (compat.western >= 50) {
    westernAnalysis = `${userA.westernZodiac.sign} and ${userB.westernZodiac.sign} present an interesting astrological dynamic. ${sameElement ? "Sharing an element provides common ground," : `The ${elementA}-${elementB} combination requires effort but offers rewards.`} Your signs may approach life differently, but this creates opportunities for learning. ${zodiacA?.traits ? `${userA.name}'s nature (${zodiacA.traits.split(".")[0]})` : userA.westernZodiac.sign} can grow through interaction with ${zodiacB?.traits ? `${userB.name}'s energy (${zodiacB.traits.split(".")[0]})` : userB.westernZodiac.sign}.`;
  } else {
    westernAnalysis = `${userA.westernZodiac.sign} and ${userB.westernZodiac.sign} face astrological friction that, when navigated well, can forge an incredibly strong bond. ${elementA} and ${elementB} energies can clash, but this tension also creates passion and depth. Many of history's greatest love stories feature challenging zodiac pairings. The key is patience, communication, and appreciating your differences.`;
  }

  // --- Chinese Zodiac Section ---
  const chineseA = chineseAnimalDescriptions[userA.chineseZodiac.animal];
  const chineseB = chineseAnimalDescriptions[userB.chineseZodiac.animal];
  const chElementA = userA.chineseZodiac.element;
  const chElementB = userB.chineseZodiac.element;

  let chineseAnalysis: string;
  if (compat.chinese >= 85) {
    chineseAnalysis = `The ${userA.chineseZodiac.fullName} and ${userB.chineseZodiac.fullName} form one of the most harmonious pairings in Chinese astrology. ${chineseA?.traits ? `${userA.name}'s nature (${chineseA.traits})` : userA.chineseZodiac.animal} beautifully complements ${chineseB?.traits ? `${userB.name}'s qualities (${chineseB.traits})` : userB.chineseZodiac.animal}. The ${chElementA} and ${chElementB} elements ${chElementA === chElementB ? "reinforce each other's strength" : "flow together in the productive cycle"}. This pairing is blessed by the ancient Chinese zodiac wisdom.`;
  } else if (compat.chinese >= 65) {
    chineseAnalysis = `The ${userA.chineseZodiac.animal} and ${userB.chineseZodiac.animal} share a positive connection in Chinese astrology. ${chineseA?.compatibleAnimals?.includes(userB.chineseZodiac.animal) ? `The ${userA.chineseZodiac.animal} naturally gravitates toward the ${userB.chineseZodiac.animal}.` : "While not traditionally paired, your animals find common ground."} The interplay of ${chElementA} and ${chElementB} elements adds ${chElementA === chElementB ? "stability" : "complementary energy"} to your connection. ${chineseElementDescriptions[chElementA]?.split(".")[0] || ""}.`;
  } else if (compat.chinese >= 45) {
    chineseAnalysis = `The ${userA.chineseZodiac.animal} and ${userB.chineseZodiac.animal} have a neutral relationship in the Chinese zodiac. Neither naturally drawn nor opposed, this pairing depends on individual effort and understanding. The ${chElementA}-${chElementB} element combination can be harmonized through awareness and compromise. Focus on shared values rather than instinctive reactions.`;
  } else {
    chineseAnalysis = `The ${userA.chineseZodiac.animal} and ${userB.chineseZodiac.animal} traditionally face challenges in the Chinese zodiac. ${chineseA?.incompatibleAnimals?.includes(userB.chineseZodiac.animal) ? "These animals are traditionally seen as opposing forces." : "The energy between these animals requires conscious navigation."} However, the greatest growth often comes from our most challenging connections. The ${chElementA} and ${chElementB} elements can either clash or create transformative energy depending on how you channel it.`;
  }

  // --- Strengths ---
  const strengths: string[] = [];

  if (compat.overall >= 70) {
    strengths.push("Strong cosmic alignment supports natural chemistry and understanding");
  }
  if (sameElement) {
    strengths.push(`Shared ${elementA} element creates intuitive emotional understanding`);
  }
  if (compat.lifePath >= 80) {
    strengths.push("Numerological harmony supports aligned life goals and values");
  }
  if (chineseA?.compatibleAnimals?.includes(userB.chineseZodiac.animal)) {
    strengths.push(`${userA.chineseZodiac.animal} and ${userB.chineseZodiac.animal} naturally support each other`);
  }
  if (zodiacA?.compatibleSigns?.includes(userB.westernZodiac.sign)) {
    strengths.push(`${userA.westernZodiac.sign} and ${userB.westernZodiac.sign} are classically compatible`);
  }
  if (compat.western >= 75 && compat.chinese >= 75) {
    strengths.push("Both Eastern and Western astrology agree on your compatibility");
  }

  // Ensure at least 2 strengths
  if (strengths.length < 2) {
    strengths.push("Different perspectives bring richness and balance to the partnership");
    if (strengths.length < 2) {
      strengths.push("Opportunity for deep personal growth through understanding each other");
    }
  }

  // --- Challenges ---
  const challenges: string[] = [];

  if (compat.overall < 60) {
    challenges.push("Different cosmic frequencies may require extra patience and communication");
  }
  if (!sameElement && compat.western < 60) {
    challenges.push(`${elementA} and ${elementB} elements may create friction in emotional expression`);
  }
  if (compat.lifePath < 50) {
    challenges.push("Different life paths may mean divergent goals -- alignment requires dialogue");
  }
  if (chineseA?.incompatibleAnimals?.includes(userB.chineseZodiac.animal)) {
    challenges.push(`The ${userA.chineseZodiac.animal}-${userB.chineseZodiac.animal} dynamic requires conscious effort`);
  }
  if (compat.chinese < 50) {
    challenges.push("Chinese elemental energies may need balancing through shared activities");
  }

  // Ensure at least 1 challenge (no relationship is perfect)
  if (challenges.length === 0) {
    challenges.push("Maintaining individuality within a strong cosmic bond can be a journey");
  }

  // --- Cosmic Advice ---
  let cosmicAdvice: string;
  if (compat.overall >= 85) {
    cosmicAdvice = `The cosmos has given you a rare gift: a connection that resonates across multiple cosmic dimensions. Honor this by being fully present with each other. Your ${elementA} and ${elementB} energies create a powerful synergy. Don't take this alignment for granted -- nurture it with honesty, adventure, and daily moments of cosmic wonder. The stars brought you together; your choices will keep you there.`;
  } else if (compat.overall >= 70) {
    cosmicAdvice = `You share a genuinely strong cosmic connection with real potential. Lean into what makes you similar (your shared values and cosmic resonance), but don't shy away from your differences -- they're where growth lives. Consider setting intentions together during new moons and reflecting during full moons. The universe supports this connection; your job is to show up for it consistently.`;
  } else if (compat.overall >= 55) {
    cosmicAdvice = `This connection is a beautiful opportunity for growth. The cosmos has paired you not for ease, but for evolution. Focus on communication -- especially during Mercury retrogrades when misunderstandings amplify. Explore each other's elements: if one is Fire and the other Water, learn to steam together rather than extinguish each other. Your compatibility grows stronger with understanding.`;
  } else {
    cosmicAdvice = `The cosmos presents you with a challenge that, if embraced, can lead to profound transformation. The greatest love stories aren't written in perfect alignment -- they're written in the space where two different souls choose to bridge the gap. Practice radical empathy, communicate your needs clearly, and remember: cosmic friction creates the most brilliant sparks. If you choose this path, choose it fully.`;
  }

  return {
    overallScore: compat.overall,
    numerologySection: {
      analysis: numerologyAnalysis,
      score: compat.lifePath,
    },
    westernSection: {
      analysis: westernAnalysis,
      score: compat.western,
    },
    chineseSection: {
      analysis: chineseAnalysis,
      score: compat.chinese,
    },
    strengths,
    challenges,
    cosmicAdvice,
  };
}
