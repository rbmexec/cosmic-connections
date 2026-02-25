import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tierFeatures } from "@/lib/subscription-tiers";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import type { SubscriptionTier } from "@/types/subscription";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [sub, credit] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.circleAddCredit.findUnique({ where: { userId } }),
  ]);

  const tier: SubscriptionTier =
    sub?.status === "active" ? (sub.tier as SubscriptionTier) : "free";
  const features = tierFeatures[tier];
  const freeAddsIncluded = features.circleAddsIncluded;
  const freeAddsUsed = credit?.freeAddsUsed ?? 0;
  const purchasedAdds = credit?.purchasedAdds ?? 0;
  const isUnlimited = freeAddsIncluded === -1;
  const canAddFree = isUnlimited || freeAddsUsed < freeAddsIncluded;
  const totalRemaining = isUnlimited
    ? -1
    : Math.max(0, freeAddsIncluded - freeAddsUsed) + purchasedAdds;

  return NextResponse.json({
    freeAddsUsed,
    freeAddsIncluded,
    purchasedAdds,
    canAddFree,
    totalRemaining,
  });
}

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, "circle-adds"), {
    limit: 10,
    windowSec: 60,
  });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [sub, credit] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.circleAddCredit.findUnique({ where: { userId } }),
  ]);

  const tier: SubscriptionTier =
    sub?.status === "active" ? (sub.tier as SubscriptionTier) : "free";
  const features = tierFeatures[tier];
  const freeAddsIncluded = features.circleAddsIncluded;
  const isUnlimited = freeAddsIncluded === -1;
  const freeAddsUsed = credit?.freeAddsUsed ?? 0;
  const purchasedAdds = credit?.purchasedAdds ?? 0;

  if (isUnlimited) {
    // Track usage even for unlimited tier
    await prisma.circleAddCredit.upsert({
      where: { userId },
      update: { freeAddsUsed: { increment: 1 } },
      create: { userId, freeAddsUsed: 1 },
    });
    return NextResponse.json({ success: true });
  }

  if (freeAddsUsed < freeAddsIncluded) {
    await prisma.circleAddCredit.upsert({
      where: { userId },
      update: { freeAddsUsed: { increment: 1 } },
      create: { userId, freeAddsUsed: 1 },
    });
    return NextResponse.json({ success: true });
  }

  if (purchasedAdds > 0) {
    await prisma.circleAddCredit.update({
      where: { userId },
      data: { purchasedAdds: { decrement: 1 } },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "No adds remaining" },
    { status: 402 }
  );
}
