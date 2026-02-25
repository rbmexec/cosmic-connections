import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAutoReply } from "@/lib/auto-reply";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const rl = rateLimit(getRateLimitKey(request, "messages"), { limit: 30, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { matchId } = await params;
  const body = await request.json();
  const { content } = body;

  const session = await auth();
  const senderId = session?.user?.id || "self";

  // Create user message
  const userMessage = await prisma.message.create({
    data: {
      matchId,
      senderId,
      content,
    },
  });

  // Get the match to find the profile id for auto-reply
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (match) {
    // Schedule auto-reply after 1-2 seconds
    const delay = 1000 + Math.random() * 1000;
    setTimeout(async () => {
      try {
        const replyContent = getAutoReply(match.matchedProfileId);
        await prisma.message.create({
          data: {
            matchId,
            senderId: match.matchedProfileId,
            content: replyContent,
          },
        });
      } catch {
        // Auto-reply failed silently
      }
    }, delay);
  }

  return NextResponse.json(userMessage);
}
