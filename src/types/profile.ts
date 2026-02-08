export interface WesternZodiac {
  sign: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
}

export interface ChineseZodiac {
  animal: string;
  symbol: string;
  element: "Metal" | "Water" | "Wood" | "Fire" | "Earth";
  elementColor: string;
  elementSymbol: string;
  fullName: string;
}

export interface Prompt {
  question: string;
  answer: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  birthYear: number;
  location: string;
  occupation: string;
  photo: string;
  lifePath: number;
  westernZodiac: WesternZodiac;
  chineseZodiac: ChineseZodiac;
  prompts: Prompt[];
}

export interface CompatibilityResult {
  overall: number;
  lifePath: number;
  western: number;
  chinese: number;
}

export type AppMode = "personal" | "attraction" | "business" | "partner";

export interface LifePathInfo {
  number: number;
  name: string;
  traits: string[];
  description: string;
}
