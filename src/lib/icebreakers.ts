import type { UserProfile } from "@/types/profile";
import { lifePathData, zodiacDescriptions, chineseAnimalDescriptions } from "@/lib/cosmic-calculations";

const zodiacTemplates = [
  "As a {userSign}, I'm curious — what's the most {profileSign} thing you've ever done?",
  "I read that {profileSign} and {userSign} have a natural connection. Do you feel that?",
  "Fellow {profileElement} sign energy! What's your favorite way to recharge?",
  "Your {profileSign} traits really show in your profile — what trait do you identify with most?",
  "What's your take on {profileSign} season? Best time of year?",
];

const numerologyTemplates = [
  "We're both on fascinating life paths — what does being a Path {profileLP} mean to you?",
  "Path {profileLP} ({profileLPName}) — that's such a powerful number. Has it shown up in your life?",
  "I noticed we have a strong numerology connection. Do you believe in the power of numbers?",
  "As a Path {profileLP}, what's the biggest lesson your number has taught you?",
  "Your life path says you're {profileTrait} — would your friends agree?",
];

const chineseTemplates = [
  "A {profileAnimal}! What {profileAnimal} traits do you see in yourself?",
  "The {profileAnimal} is known for being {profileAnimalTrait} — does that resonate?",
  "I love that you're a {profileFullName}. What's your relationship with your Chinese zodiac?",
];

const generalTemplates = [
  "The cosmos clearly wanted us to match — what drew you to this app?",
  "If your zodiac sign was a superpower, what would it be?",
  "What's the most cosmic coincidence that's ever happened to you?",
  "Do you check your horoscope? Be honest!",
  "If we could stargaze anywhere in the world right now, where would you pick?",
];

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function getIcebreakers(currentUser: UserProfile, profile: UserProfile, count = 3): string[] {
  const lp = lifePathData[profile.lifePath];
  const zodiac = zodiacDescriptions[profile.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[profile.chineseZodiac.animal];

  const vars: Record<string, string> = {
    name: profile.name,
    userSign: currentUser.westernZodiac.sign,
    profileSign: profile.westernZodiac.sign,
    userElement: currentUser.westernZodiac.element,
    profileElement: profile.westernZodiac.element,
    profileLP: String(profile.lifePath),
    profileLPName: lp?.name || "Unknown",
    profileTrait: lp?.traits[0]?.toLowerCase() || "unique",
    profileAnimal: profile.chineseZodiac.animal,
    profileFullName: profile.chineseZodiac.fullName,
    profileAnimalTrait: animal?.traits.split(",")[0]?.trim().toLowerCase() || "special",
  };

  const allTemplates = [
    ...zodiacTemplates,
    ...numerologyTemplates,
    ...chineseTemplates,
    ...generalTemplates,
  ];

  // Use profile ID + user ID as seed for consistent but varied results
  const seed = (profile.id + currentUser.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);

  // Shuffle and pick
  const shuffled = allTemplates
    .map((t) => ({ t, sort: rng() }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.t);

  // Pick one from each category for variety
  const picks: string[] = [];
  const categories = [zodiacTemplates, numerologyTemplates, [...chineseTemplates, ...generalTemplates]];

  for (const cat of categories) {
    const available = shuffled.filter((t) => cat.includes(t) && !picks.includes(t));
    if (available.length > 0) {
      picks.push(available[0]);
    }
  }

  // Fill remaining slots if needed
  while (picks.length < count) {
    const remaining = shuffled.find((t) => !picks.includes(t));
    if (remaining) picks.push(remaining);
    else break;
  }

  return picks.slice(0, count).map((t) => fillTemplate(t, vars));
}
