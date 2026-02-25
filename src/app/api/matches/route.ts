import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "self";

  const matches = await prisma.match.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json(matches);
}

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, "matches"), { limit: 30, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  const userId = session?.user?.id || "self";

  const body = await request.json();
  const { matchedProfileId, mode, score, icebreakerPromptIndex, icebreakerComment } = body;

  const match = await prisma.match.upsert({
    where: {
      userId_matchedProfileId: {
        userId,
        matchedProfileId,
      },
    },
    update: { score, mode, icebreakerPromptIndex, icebreakerComment },
    create: {
      userId,
      matchedProfileId,
      mode,
      score,
      icebreakerPromptIndex,
      icebreakerComment,
    },
  });

  return NextResponse.json(match);
}
