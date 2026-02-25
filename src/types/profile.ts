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

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  title: string;
  description: string;
}

export interface LifestylePrefs {
  pets?: string;
  drinking?: string;
  smoking?: string;
  cannabis?: string;
  workout?: string;
  socialMedia?: string;
}

export interface SpotifyAnthem {
  trackId: string;
  name: string;
  artist: string;
  albumArt?: string;
  previewUrl?: string;
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
  birthMonth?: number;
  birthDay?: number;
  country?: string;
  workExperience?: WorkExperience[];
  projects?: Project[];
  currentWork?: string;
  school?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  compatibilityAnswers?: Record<string, number>;
  hasVoiceNote?: boolean;
  hasVideoIntro?: boolean;
  photos?: string[];
  bio?: string;
  interests?: string[];
  pronouns?: string;
  heightCm?: number;
  relationshipGoal?: string;
  relationshipType?: string;
  languages?: string[];
  gender?: string;
  genderVisible?: boolean;
  sexualOrientation?: string;
  orientationVisible?: boolean;
  educationLevel?: string;
  familyPlans?: string;
  communicationStyle?: string;
  loveStyle?: string;
  lifestyle?: LifestylePrefs;
  spotifyAnthem?: SpotifyAnthem;
  hideAge?: boolean;
  hideDistance?: boolean;
}

export interface CompatibilityResult {
  overall: number;
  lifePath: number;
  western: number;
  chinese: number;
}

export type AppMode = "personal" | "attraction" | "business" | "partner" | "friend" | "messages";

export interface LifePathInfo {
  number: number;
  name: string;
  traits: string[];
  description: string;
}
