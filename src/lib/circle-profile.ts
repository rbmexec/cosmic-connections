import type { CircleConnection } from "@/types/circle";
import type { UserProfile } from "@/types/profile";
import { calculateLifePath, getWesternZodiacFromDate, getChineseZodiacFromYear } from "@/lib/cosmic-calculations";

export function buildProfileFromConnection(connection: CircleConnection): UserProfile {
  const date = new Date(connection.birthday + "T00:00:00");
  const birthYear = date.getFullYear();
  const birthMonth = date.getMonth() + 1;
  const birthDay = date.getDate();

  const now = new Date();
  let age = now.getFullYear() - birthYear;
  if (
    now.getMonth() + 1 < birthMonth ||
    (now.getMonth() + 1 === birthMonth && now.getDate() < birthDay)
  ) {
    age--;
  }

  const lifePath = calculateLifePath(date);
  const westernZodiac = getWesternZodiacFromDate(date);
  const chineseZodiac = getChineseZodiacFromYear(birthYear);

  return {
    id: `circle-${connection.id}`,
    name: connection.name,
    age,
    birthYear,
    location: "",
    occupation: "",
    photo: "",
    lifePath,
    westernZodiac,
    chineseZodiac,
    prompts: [],
    birthMonth,
    birthDay,
  };
}
