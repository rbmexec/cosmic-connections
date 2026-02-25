import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SubscriptionInfo } from "@/types/subscription";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const info: SubscriptionInfo = {
    tier: (sub?.tier as SubscriptionInfo["tier"]) || "free",
    status: (sub?.status as SubscriptionInfo["status"]) || "inactive",
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
  };

  return NextResponse.json(info);
}
