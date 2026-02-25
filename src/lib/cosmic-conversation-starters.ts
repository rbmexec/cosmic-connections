import type { UserProfile } from "@/types/profile";
import { lifePathData, zodiacDescriptions, chineseAnimalDescriptions } from "@/lib/cosmic-calculations";

export interface ConversationStarter {
  text: string;
  tag: "Element Bond" | "Numerology" | "Zodiac" | "Prompt Reaction" | "Chinese Zodiac";
  icon: string;
}

const elementBondTemplates = [
  {
    text: "We're both {sharedElement} signs -- do you feel that {elementTrait} energy too?",
    condition: "sameElement",
  },
  {
    text: "Your {profileElement} energy and my {userElement} energy create a really interesting dynamic. What do you think draws {profileElement} and {userElement} together?",
    condition: "diffElement",
  },
  {
    text: "I love how {profileElement} signs bring {elementTrait} into everything. What's one way you see that in your own life?",
    condition: "always",
  },
];

const numerologyTemplates = [
  {
    text: "You're a Life Path {profileLP} ({profileLPName}) -- that's such a powerful number. Has it shown up in meaningful ways for you?",
  },
  {
    text: "As a Life Path {userLP}, I find Path {profileLP} people fascinating. Your {profileTrait} energy is really compelling.",
  },
  {
    text: "Our life paths add up to {lpSum} -- in numerology that reduces to {lpReduced}. I wonder what that says about our connection!",
  },
];

const zodiacTemplates = [
  {
    text: "As a {profileSign}, what do you think is the most misunderstood thing about your sign?",
  },
  {
    text: "I read that {userSign} and {profileSign} share a natural {compatWord} connection. Can you feel it?",
  },
  {
    text: "Your sign is ruled by {profileRuler} -- that explains so much about your profile. What's your relationship with astrology?",
  },
];

const promptReactionTemplates = [
  {
    text: "I loved your answer to \"{promptQuestion}\" -- \"{promptAnswer}\". I feel the same way!",
    condition: "hasPrompt",
  },
  {
    text: "Your answer about \"{promptQuestion}\" really stood out to me. What made you choose that one?",
    condition: "hasPrompt",
  },
];

const chineseZodiacTemplates = [
  {
    text: "A {profileAnimal}! That's known for being {profileAnimalTrait}. Do your friends agree?",
  },
  {
    text: "I'm a {userAnimal} and you're a {profileAnimal} -- our Chinese zodiac pairing is said to be {chineseCompat}. What do you think?",
  },
  {
    text: "The {profileFullName} is such a beautiful combination. Do you connect more with the {profileCElement} element or the {profileAnimal} animal?",
  },
];

function reduceNumber(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    let next = 0;
    let val = n;
    while (val > 0) {
      next += val % 10;
      val = Math.floor(val / 10);
    }
    n = next;
  }
  return n;
}

function getElementTrait(element: string): string {
  const traits: Record<string, string> = {
    Fire: "passionate and dynamic",
    Earth: "grounded and steady",
    Air: "intellectual and free-flowing",
    Water: "intuitive and deep",
    Metal: "determined and precise",
    Wood: "generous and growth-oriented",
  };
  return traits[element] || "unique";
}

function getChineseCompatWord(animal1: string, animal2: string): string {
  const entry = chineseAnimalDescriptions[animal1];
  if (!entry) return "interesting";
  if (entry.compatibleAnimals.includes(animal2)) return "highly compatible";
  if (entry.incompatibleAnimals.includes(animal2)) return "a challenging but exciting";
  return "an intriguing";
}

function getWesternCompatWord(sign1: string, sign2: string): string {
  const zodiac = zodiacDescriptions[sign1];
  if (!zodiac) return "cosmic";
  if (zodiac.compatibleSigns.includes(sign2)) return "magnetic";
  return "complementary";
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generateConversationStarters(
  currentUser: UserProfile,
  matchProfile: UserProfile
): ConversationStarter[] {
  const lp = lifePathData[matchProfile.lifePath];
  const userLp = lifePathData[currentUser.lifePath];
  const zodiac = zodiacDescriptions[matchProfile.westernZodiac.sign];
  const matchAnimalDesc = chineseAnimalDescriptions[matchProfile.chineseZodiac.animal];

  const sameWesternElement = currentUser.westernZodiac.element === matchProfile.westernZodiac.element;
  const lpSum = currentUser.lifePath + matchProfile.lifePath;
  const lpReduced = reduceNumber(lpSum);

  const vars: Record<string, string> = {
    userSign: currentUser.westernZodiac.sign,
    profileSign: matchProfile.westernZodiac.sign,
    userElement: currentUser.westernZodiac.element,
    profileElement: matchProfile.westernZodiac.element,
    sharedElement: currentUser.westernZodiac.element,
    elementTrait: getElementTrait(sameWesternElement ? currentUser.westernZodiac.element : matchProfile.westernZodiac.element),
    userLP: String(currentUser.lifePath),
    profileLP: String(matchProfile.lifePath),
    userLPName: userLp?.name || "Unknown",
    profileLPName: lp?.name || "Unknown",
    profileTrait: lp?.traits[0]?.toLowerCase() || "unique",
    lpSum: String(lpSum),
    lpReduced: String(lpReduced),
    profileRuler: zodiac?.ruler || "the cosmos",
    compatWord: getWesternCompatWord(currentUser.westernZodiac.sign, matchProfile.westernZodiac.sign),
    userAnimal: currentUser.chineseZodiac.animal,
    profileAnimal: matchProfile.chineseZodiac.animal,
    profileFullName: matchProfile.chineseZodiac.fullName,
    profileCElement: matchProfile.chineseZodiac.element,
    profileAnimalTrait: matchAnimalDesc?.traits.split(",")[0]?.trim().toLowerCase() || "special",
    chineseCompat: getChineseCompatWord(currentUser.chineseZodiac.animal, matchProfile.chineseZodiac.animal),
    promptQuestion: matchProfile.prompts[0]?.question || "",
    promptAnswer: matchProfile.prompts[0]?.answer || "",
  };

  function fillTemplate(template: string): string {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
    return result;
  }

  const starters: ConversationStarter[] = [];

  // 1. Element Bond
  if (sameWesternElement) {
    starters.push({
      text: fillTemplate(elementBondTemplates[0].text),
      tag: "Element Bond",
      icon: currentUser.westernZodiac.element === "Fire" ? "flame" : currentUser.westernZodiac.element === "Water" ? "droplets" : currentUser.westernZodiac.element === "Earth" ? "mountain" : "wind",
    });
  } else {
    starters.push({
      text: fillTemplate(elementBondTemplates[1].text),
      tag: "Element Bond",
      icon: "sparkles",
    });
  }

  // 2. Numerology
  const seed = (matchProfile.id + currentUser.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);
  const numIdx = Math.floor(rng() * numerologyTemplates.length);
  starters.push({
    text: fillTemplate(numerologyTemplates[numIdx].text),
    tag: "Numerology",
    icon: "hash",
  });

  // 3. Zodiac
  const zodiacIdx = Math.floor(rng() * zodiacTemplates.length);
  starters.push({
    text: fillTemplate(zodiacTemplates[zodiacIdx].text),
    tag: "Zodiac",
    icon: "star",
  });

  // 4. Prompt Reaction
  if (matchProfile.prompts.length > 0) {
    const promptIdx = Math.floor(rng() * promptReactionTemplates.length);
    starters.push({
      text: fillTemplate(promptReactionTemplates[promptIdx].text),
      tag: "Prompt Reaction",
      icon: "message-circle",
    });
  } else {
    starters.push({
      text: fillTemplate(elementBondTemplates[2].text),
      tag: "Element Bond",
      icon: "sparkles",
    });
  }

  // 5. Chinese Zodiac
  const chineseIdx = Math.floor(rng() * chineseZodiacTemplates.length);
  starters.push({
    text: fillTemplate(chineseZodiacTemplates[chineseIdx].text),
    tag: "Chinese Zodiac",
    icon: "globe",
  });

  return starters;
}
