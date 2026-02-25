import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayString();
  const log = await prisma.swipeLog.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  return NextResponse.json({ count: log?.count ?? 0, date: today });
}

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, "swipes"), { limit: 60, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayString();

  const log = await prisma.swipeLog.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    update: { count: { increment: 1 } },
    create: { userId: session.user.id, date: today, count: 1 },
  });

  return NextResponse.json({ count: log.count, date: today });
}
