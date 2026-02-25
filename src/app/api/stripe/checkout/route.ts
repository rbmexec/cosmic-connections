import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, "checkout"), { limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId, mode: requestedMode } = await request.json();
  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  const checkoutMode = requestedMode === "payment" ? "payment" : "subscription";

  // Get or create subscription record with Stripe customer
  let sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let stripeCustomerId = sub?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    stripeCustomerId = customer.id;

    sub = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId },
      create: {
        userId: session.user.id,
        stripeCustomerId,
        tier: "free",
        status: "inactive",
      },
    });
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
  if (!origin) {
    return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
  }

  const isPayment = checkoutMode === "payment";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: checkoutMode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: isPayment
      ? `${origin}?circle_add=success`
      : `${origin}?subscription=success`,
    cancel_url: isPayment
      ? `${origin}?circle_add=canceled`
      : `${origin}?subscription=canceled`,
    metadata: {
      userId: session.user.id,
      ...(isPayment ? { type: "circle_add" } : {}),
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
