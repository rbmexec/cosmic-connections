import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { priceIdToTier } from "@/lib/subscription-tiers";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

function getPeriodDates(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: item?.current_period_start ? new Date(item.current_period_start * 1000) : null,
    end: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
  };
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      // Handle one-time circle add payment
      if (
        session.mode === "payment" &&
        session.metadata?.type === "circle_add"
      ) {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? session.id;

        await prisma.circleAddPurchase.create({
          data: {
            userId,
            stripePaymentIntentId: paymentIntentId,
            amount: session.amount_total ?? 299,
            quantity: 1,
          },
        });

        await prisma.circleAddCredit.upsert({
          where: { userId },
          update: { purchasedAdds: { increment: 1 } },
          create: { userId, purchasedAdds: 1 },
        });
        break;
      }

      // Handle subscription checkout
      if (!session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price?.id;
      const period = getPeriodDates(subscription);

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          tier: priceId ? priceIdToTier(priceId) : "pro",
          status: "active",
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          tier: priceId ? priceIdToTier(priceId) : "pro",
          status: "active",
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price?.id;
      const period = getPeriodDates(subscription);

      const status = subscription.status === "active"
        ? "active"
        : subscription.status === "past_due"
          ? "past_due"
          : subscription.status === "canceled"
            ? "canceled"
            : "inactive";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: priceId,
          tier: priceId ? priceIdToTier(priceId) : "free",
          status,
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          tier: "free",
          status: "canceled",
          cancelAtPeriodEnd: false,
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subId = subDetails?.subscription;
      if (subId) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: typeof subId === "string" ? subId : subId.id },
          data: { status: "past_due" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
