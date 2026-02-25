// Per-dimension realized/unrealized nature
export interface DualNature {
  realized: { traits: string[]; energy: string };
  unrealized: { traits: string[]; energy: string };
}

// Per-dimension data for each life area
export interface LifeAreaTraits {
  love: { realized: string[]; unrealized: string[]; lesson: string };
  business: { realized: string[]; unrealized: string[]; lanes: string[]; lesson: string };
  shadow: string[];
  growthKeys: string[];
  masculineHigh: string[];
  masculineShadow: string[];
  feminineHigh: string[];
  feminineShadow: string[];
  highTimeline: string[];
  lowTimeline: string[];
}

// Static data shapes
export interface LifePathBlueprint {
  coreTheme: string;
  dual: DualNature;
  lifeAreas: LifeAreaTraits;
}

export interface ZodiacBlueprint {
  coreTheme: string;
  dual: DualNature;
  lifeAreas: LifeAreaTraits;
}

export interface ChineseAnimalBlueprint {
  description: string;
  dual: DualNature;
  lifeAreas: LifeAreaTraits;
}

export interface ChineseElementBlueprint {
  description: string;
  realizedTraits: string[];
  unrealizedTraits: string[];
}

// Generated combined output
export interface FullBlueprint {
  lifePath: LifePathBlueprint;
  western: ZodiacBlueprint;
  chineseAnimal: ChineseAnimalBlueprint;
  chineseElement: ChineseElementBlueprint;
  combined: {
    intro: string;
    realizedTraits: string[];
    unrealizedTraits: string[];
    coreConflict: string;
    evolutionPath: string[];
  };
  dating: {
    coreDynamic: string[];
    realized: string[];
    loveStyle: string[];
    bestPartnerTraits: string[];
    unrealized: string[];
    lesson: string;
  };
  business: {
    whyStrong: string[];
    realized: string[];
    bestLanes: string[];
    purpose: string;
    unrealized: string[];
    lesson: string;
  };
  shadowWork: {
    perDimension: { label: string; shadows: string[] }[];
    innerConflict: string;
    growthKeys: string[];
  };
  expression: {
    masculineHigh: string[];
    masculineShadow: string[];
    feminineHigh: string[];
    feminineShadow: string[];
  };
  timelines: {
    highest: { traits: string[]; perception: string };
    lowest: { traits: string[]; perception: string };
    masterLesson: string;
    masterKeys: string[];
  };
}
