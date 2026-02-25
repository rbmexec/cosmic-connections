import type { UserProfile } from "@/types/profile";
import type { FullBlueprint } from "@/types/blueprint";
import {
  lifePathBlueprints,
  zodiacBlueprints,
  chineseAnimalBlueprints,
  chineseElementBlueprints,
} from "@/data/blueprint-data";

function pick<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)];
}

export function generateFullBlueprint(profile: UserProfile): FullBlueprint {
  const lp = lifePathBlueprints[profile.lifePath] ?? lifePathBlueprints[9];
  const western = zodiacBlueprints[profile.westernZodiac.sign] ?? zodiacBlueprints.Aries;
  const animal = chineseAnimalBlueprints[profile.chineseZodiac.animal] ?? chineseAnimalBlueprints.Rat;
  const element = chineseElementBlueprints[profile.chineseZodiac.element] ?? chineseElementBlueprints.Earth;

  // ─── Combined ───
  const realizedTraits = unique([
    ...pick(lp.dual.realized.traits, 3),
    ...pick(western.dual.realized.traits, 3),
    ...pick(animal.dual.realized.traits, 3),
  ]);

  const unrealizedTraits = unique([
    ...pick(lp.dual.unrealized.traits, 3),
    ...pick(western.dual.unrealized.traits, 3),
    ...pick(animal.dual.unrealized.traits, 3),
  ]);

  const coreConflict =
    `Life Path ${profile.lifePath} wants ${lp.coreTheme.toLowerCase()}. ` +
    `${profile.westernZodiac.sign} wants ${western.coreTheme.toLowerCase()}. ` +
    `${profile.chineseZodiac.animal} wants ${animal.description.split(" who ")[0].replace("The ", "").toLowerCase()}. ` +
    `The challenge: integrating all three drives into one unified purpose.`;

  const evolutionPath = unique([
    lp.lifeAreas.growthKeys[0],
    western.lifeAreas.growthKeys[0],
    animal.lifeAreas.growthKeys[0],
  ]);

  // ─── Dating ───
  const coreDynamic = [
    `${profile.westernZodiac.sign} brings ${western.lifeAreas.love.realized[0]?.toLowerCase() ?? "passion"}`,
    `${profile.chineseZodiac.animal} brings ${animal.lifeAreas.love.realized[0]?.toLowerCase() ?? "adventure"}`,
    `Life Path ${profile.lifePath} brings ${lp.lifeAreas.love.realized[0]?.toLowerCase() ?? "depth"}`,
  ];

  const datingRealized = unique([
    ...lp.lifeAreas.love.realized,
    ...western.lifeAreas.love.realized,
    ...animal.lifeAreas.love.realized,
  ]);

  const loveStyle = [
    `You love through: Actions (${profile.westernZodiac.sign})`,
    `Passion (${profile.chineseZodiac.animal})`,
    `Emotional depth (Life Path ${profile.lifePath})`,
  ];

  const bestPartnerTraits = unique([
    `Someone who matches your ${western.coreTheme.split(" & ")[0]?.toLowerCase() ?? "energy"}`,
    `A partner who respects your ${animal.description.split(" who ")[0].replace("The ", "").toLowerCase() ?? "nature"}`,
    `Someone who understands your ${lp.coreTheme.split(" & ")[0]?.toLowerCase() ?? "drive"}`,
  ]);

  const datingUnrealized = unique([
    ...lp.lifeAreas.love.unrealized,
    ...western.lifeAreas.love.unrealized,
    ...animal.lifeAreas.love.unrealized,
  ]);

  const datingLesson = `${lp.lifeAreas.love.lesson} ${western.lifeAreas.love.lesson}`;

  // ─── Business ───
  const whyStrong = [
    `${profile.westernZodiac.sign}: ${western.lifeAreas.business.realized[0] ?? "Strategic thinker"}`,
    `${profile.chineseZodiac.animal}: ${animal.lifeAreas.business.realized[0] ?? "Resourceful"}`,
    `Life Path ${profile.lifePath}: ${lp.lifeAreas.business.realized[0] ?? "Visionary"}`,
  ];

  const businessRealized = unique([
    ...lp.lifeAreas.business.realized,
    ...western.lifeAreas.business.realized,
    ...animal.lifeAreas.business.realized,
  ]);

  const bestLanes = unique([
    ...lp.lifeAreas.business.lanes,
    ...western.lifeAreas.business.lanes,
    ...animal.lifeAreas.business.lanes,
  ]);

  const purpose =
    `Your purpose combines ${lp.coreTheme.toLowerCase()} with ${western.coreTheme.toLowerCase()}, ` +
    `powered by the ${profile.chineseZodiac.animal}'s ${animal.description.split(" through ")[1]?.split(",")[0] ?? "energy"}.`;

  const businessUnrealized = unique([
    ...lp.lifeAreas.business.unrealized,
    ...western.lifeAreas.business.unrealized,
    ...animal.lifeAreas.business.unrealized,
  ]);

  const businessLesson = `${lp.lifeAreas.business.lesson} ${western.lifeAreas.business.lesson}`;

  // ─── Shadow Work ───
  const perDimension = [
    { label: `Life Path ${profile.lifePath}`, shadows: lp.lifeAreas.shadow },
    { label: profile.westernZodiac.sign, shadows: western.lifeAreas.shadow },
    { label: profile.chineseZodiac.animal, shadows: animal.lifeAreas.shadow },
  ];

  const innerConflict =
    `Your ${profile.westernZodiac.sign} ${western.lifeAreas.shadow[0]?.toLowerCase() ?? "pattern"} ` +
    `clashes with your ${profile.chineseZodiac.animal}'s ${animal.lifeAreas.shadow[0]?.toLowerCase() ?? "tendency"}, ` +
    `while Life Path ${profile.lifePath}'s ${lp.lifeAreas.shadow[0]?.toLowerCase() ?? "challenge"} amplifies the tension. ` +
    `This is your core inner work.`;

  const growthKeys = unique([
    ...lp.lifeAreas.growthKeys,
    ...western.lifeAreas.growthKeys,
    ...animal.lifeAreas.growthKeys,
  ]);

  // ─── Expression ───
  const masculineHigh = unique([
    ...lp.lifeAreas.masculineHigh,
    ...western.lifeAreas.masculineHigh,
    ...animal.lifeAreas.masculineHigh,
  ]);
  const masculineShadow = unique([
    ...lp.lifeAreas.masculineShadow,
    ...western.lifeAreas.masculineShadow,
    ...animal.lifeAreas.masculineShadow,
  ]);
  const feminineHigh = unique([
    ...lp.lifeAreas.feminineHigh,
    ...western.lifeAreas.feminineHigh,
    ...animal.lifeAreas.feminineHigh,
  ]);
  const feminineShadow = unique([
    ...lp.lifeAreas.feminineShadow,
    ...western.lifeAreas.feminineShadow,
    ...animal.lifeAreas.feminineShadow,
  ]);

  // ─── Timelines ───
  const highTraits = unique([
    ...lp.lifeAreas.highTimeline,
    ...western.lifeAreas.highTimeline,
    ...animal.lifeAreas.highTimeline,
  ]);
  const lowTraits = unique([
    ...lp.lifeAreas.lowTimeline,
    ...western.lifeAreas.lowTimeline,
    ...animal.lifeAreas.lowTimeline,
  ]);

  const highPerception =
    `At your highest, people see you as a ${lp.dual.realized.traits[0]?.toLowerCase() ?? "visionary"} ` +
    `with the ${western.dual.realized.traits[0]?.toLowerCase() ?? "energy"} of ${profile.westernZodiac.sign} ` +
    `and the ${animal.dual.realized.traits[0]?.toLowerCase() ?? "power"} of the ${profile.chineseZodiac.animal}.`;

  const lowPerception =
    `At your lowest, people experience you as a ${lp.dual.unrealized.traits[0]?.toLowerCase() ?? "shadow"} ` +
    `with ${profile.westernZodiac.sign}'s ${western.dual.unrealized.traits[0]?.toLowerCase() ?? "darkness"} ` +
    `and the ${profile.chineseZodiac.animal}'s ${animal.dual.unrealized.traits[0]?.toLowerCase() ?? "weakness"}.`;

  const masterLesson =
    `Integrate your ${lp.coreTheme.toLowerCase()} with your ${western.coreTheme.toLowerCase()} ` +
    `and your ${profile.chineseZodiac.animal} nature. This is your lifetime assignment.`;

  const masterKeys = [
    `Embody ${lp.coreTheme.split(" & ")[0] ?? "your path"} through daily choices`,
    `Express ${western.coreTheme.split(" & ")[0] ?? "your sign"} authentically`,
    `Honor your ${profile.chineseZodiac.animal} instincts with wisdom`,
  ];

  return {
    lifePath: lp,
    western,
    chineseAnimal: animal,
    chineseElement: element,
    combined: {
      intro:
        `Life Path ${profile.lifePath} + ${profile.chineseZodiac.fullName} + ${profile.westernZodiac.sign} ` +
        `is ${lp.coreTheme.split(" & ")[0]?.toLowerCase() ?? "visionary"}-${animal.description.split(" ")[1]?.toLowerCase() ?? "warrior"}-${western.coreTheme.split(" & ")[0]?.toLowerCase() ?? "sage"} energy.`,
      realizedTraits,
      unrealizedTraits,
      coreConflict,
      evolutionPath,
    },
    dating: {
      coreDynamic,
      realized: datingRealized,
      loveStyle,
      bestPartnerTraits,
      unrealized: datingUnrealized,
      lesson: datingLesson,
    },
    business: {
      whyStrong,
      realized: businessRealized,
      bestLanes,
      purpose,
      unrealized: businessUnrealized,
      lesson: businessLesson,
    },
    shadowWork: {
      perDimension,
      innerConflict,
      growthKeys,
    },
    expression: {
      masculineHigh,
      masculineShadow,
      feminineHigh,
      feminineShadow,
    },
    timelines: {
      highest: { traits: highTraits, perception: highPerception },
      lowest: { traits: lowTraits, perception: lowPerception },
      masterLesson,
      masterKeys,
    },
  };
}
