import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json(null);
  }

  const parsed = parseProfileJson(profile);
  return NextResponse.json(parsed);
}

function parseProfileJson(profile: Record<string, unknown>) {
  return {
    ...profile,
    westernZodiac: JSON.parse(profile.westernZodiac as string),
    chineseZodiac: JSON.parse(profile.chineseZodiac as string),
    prompts: JSON.parse(profile.prompts as string),
    workExperience: JSON.parse(profile.workExperience as string),
    projects: JSON.parse(profile.projects as string),
    photos: JSON.parse((profile.photos as string) || "[]"),
    interests: JSON.parse((profile.interests as string) || "[]"),
    languages: JSON.parse((profile.languages as string) || "[]"),
    lifestyle: JSON.parse((profile.lifestyle as string) || "{}"),
    spotifyAnthem: profile.spotifyAnthem ? JSON.parse(profile.spotifyAnthem as string) : null,
  };
}

export async function DELETE() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.userProfile.deleteMany({ where: { userId: session.user.id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, "profile"), { limit: 20, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name, age, birthYear, birthMonth, birthDay,
    location, country, occupation, photo,
    lifePath, westernZodiac, chineseZodiac, prompts,
    workExperience, projects, currentWork, school,
    photos, bio, interests, pronouns, heightCm,
    relationshipGoal, relationshipType, languages,
    gender, genderVisible, sexualOrientation, orientationVisible,
    educationLevel, familyPlans, communicationStyle, loveStyle,
    lifestyle, spotifyAnthem, hideAge, hideDistance,
  } = body;

  // When photos array has items, sync first photo for backward compat
  const resolvedPhoto = Array.isArray(photos) && photos.length > 0 ? photos[0] : (photo ?? "");

  const editInfoFields = {
    photos: JSON.stringify(photos ?? []),
    bio: bio ?? "",
    interests: JSON.stringify(interests ?? []),
    pronouns: pronouns ?? null,
    heightCm: heightCm ?? null,
    relationshipGoal: relationshipGoal ?? null,
    relationshipType: relationshipType ?? null,
    languages: JSON.stringify(languages ?? []),
    gender: gender ?? null,
    genderVisible: genderVisible ?? true,
    sexualOrientation: sexualOrientation ?? null,
    orientationVisible: orientationVisible ?? true,
    educationLevel: educationLevel ?? null,
    familyPlans: familyPlans ?? null,
    communicationStyle: communicationStyle ?? null,
    loveStyle: loveStyle ?? null,
    lifestyle: JSON.stringify(lifestyle ?? {}),
    spotifyAnthem: spotifyAnthem ? JSON.stringify(spotifyAnthem) : null,
    hideAge: hideAge ?? false,
    hideDistance: hideDistance ?? false,
  };

  const baseFields = {
    name,
    age,
    birthYear,
    birthMonth: birthMonth ?? null,
    birthDay: birthDay ?? null,
    location,
    country: country ?? null,
    occupation,
    photo: resolvedPhoto,
    lifePath,
    westernZodiac: JSON.stringify(westernZodiac),
    chineseZodiac: JSON.stringify(chineseZodiac),
    prompts: JSON.stringify(prompts ?? []),
    workExperience: JSON.stringify(workExperience ?? []),
    projects: JSON.stringify(projects ?? []),
    currentWork: currentWork ?? "",
    school: school ?? "",
  };

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: { ...baseFields, ...editInfoFields },
    create: { userId: session.user.id, ...baseFields, ...editInfoFields },
  });

  const parsed = parseProfileJson(profile as unknown as Record<string, unknown>);
  return NextResponse.json(parsed);
}
